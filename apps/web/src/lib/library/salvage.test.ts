/**
 * salvage.test.ts — N.67 step 6, design §4's corrupt-record path.
 *
 * **A RECORD THAT FAILS VALIDATION IS NEVER OVERWRITTEN AND NEVER DELETED.**
 * That promise is only worth making if there is a way to get the singer's work
 * back out, and the way is the binder: the raw stored value and the score's
 * bytes go into a file, and the file can be read back into a clean origin.
 *
 * THIS FILE'S CENTRE IS THE ROUND TRIP. Everything else here guards one of the
 * paths that used to launder the damage away: a boot-time name backfill, a
 * rename, and an autosave all wrote the REBUILT record, which is the damaged
 * song emptied and made to look whole.
 */
import { describe, it, expect } from 'vitest';
import { Library, validateRecord } from './library';
import { createMemoryDriver, summarize, summarizeStored, type SourceBytes } from './driver';
import { readBinder } from './binder';
import { exportBinder, importBinder } from './exchange';
import { libraryRows, renameSong } from './songs';
// The autosave EFFECT that reads `readOnly` cannot be gated: runes are inert
// under this suite (`docs/memory/ENVIRONMENT.md`), so `$effect` compiles to
// nothing here. What is gated is the flag itself, which is a plain field and is
// the single thing the effect and `#write` both branch on.
import { SongDocument } from './document.svelte';
import { emptySongRecord, type SongRecord } from './types';

const NOW = '2026-08-18T00:00:00.000Z';
const TODAY = '18 August 2026';

/**
 * A record as a browser would actually hold it after damage: the id and the
 * dates survive, because they are what the store keys and sorts on, and one
 * field has become something it may not be.
 */
function damaged(): Record<string, unknown> {
	return {
		schema: 1,
		id: 'damaged',
		name: 'Кабалевский, Сонет 90',
		createdAt: '2026-08-01T00:00:00.000Z',
		updatedAt: '2026-08-02T00:00:00.000Z',
		// The poem is a NUMBER. `validateRecord` reports `malformed` and rebuilds
		// the field as the empty string, which is the laundering this path exists
		// to keep from ever being written back.
		poem: 42,
		metadata: { title: 'Сонет 90', composer: 'Кабалевский', poet: '', translator: '', opus: '', transcriber: '' },
		fromScore: ['title'],
		glosses: [['0-0', 'I', 'я']],
		openSyllabification: true,
		pairings: { 'ev-1': { syllable: 'я', vowel: 'a' } },
		source: null,
	};
}

function fromFuture(): Record<string, unknown> {
	return { ...damaged(), id: 'future', poem: 'Я вас любил', schema: 2 };
}

function bytes(text: string, songId: string): SourceBytes {
	const data = new TextEncoder().encode(text);
	return {
		songId,
		fileName: 'score.musicxml',
		bytes: data.buffer as ArrayBuffer,
		byteLength: data.byteLength,
		contentHash: 'hash',
		importedAt: NOW,
	};
}

describe('what validation now reports', () => {
	it('names a record from a newer Ilya, and does not read it', () => {
		// BEFORE THIS STEP NOTHING READ `schema` AT ALL. The rebuild started from
		// `emptySongRecord`, whose schema is the literal 1, so a record written by
		// a future Ilya was silently downgraded and then written back at that
		// number. Design §4 called for read-never; the tree did read-and-lower.
		const result = validateRecord(fromFuture(), 'future', NOW);

		expect(result.reason).toBe('newer-schema');
		expect(result.raw).toEqual(fromFuture());
		expect(result.record.poem).toBe('');
	});

	it('carries the stored value beside the rebuilt one when a field is wrong', () => {
		const result = validateRecord(damaged(), 'damaged', NOW);

		expect(result.reason).toBe('malformed');
		expect(result.record.poem).toBe('');
		expect((result.raw as Record<string, unknown>).poem).toBe(42);
	});

	it('carries nothing extra when the record reads whole', () => {
		expect(validateRecord(emptySongRecord('clean', NOW), 'clean', NOW).raw).toBeUndefined();
	});
});

describe('the list marks the rows it cannot read', () => {
	it('keeps the song’s own name and dates, so the singer can tell which one it is', () => {
		const row = summarizeStored(damaged(), 'damaged', NOW);

		expect(row.readFailure).toBe('malformed');
		expect(row.name).toBe('Кабалевский, Сонет 90');
		expect(row.createdAt).toBe('2026-08-01T00:00:00.000Z');
	});

	it('distinguishes a newer Ilya from damage, because they are different sentences', () => {
		expect(summarizeStored(fromFuture(), 'future', NOW).readFailure).toBe('newer-schema');
	});

	it('marks nothing on a record that reads whole', () => {
		expect(summarizeStored(emptySongRecord('clean', NOW), 'clean', NOW).readFailure).toBeNull();
	});
});

describe('nothing writes to a record that could not be read', () => {
	it('refuses a rename rather than saving the rebuilt record over it', async () => {
		const driver = createMemoryDriver([damaged() as unknown as SongRecord]);
		const library = new Library(driver);

		const outcome = await renameSong(library, 'damaged', 'A new name');

		expect(outcome).toEqual({ ok: false, reason: 'malformed' });
		// Still exactly what it was. A rename that "worked" here would have
		// stored a song with a name, no poem, and no way back.
		expect((await driver.load('damaged')).record).toEqual(damaged());
	});

	it('writes a salvaged value back with no stamp and no rebuild', async () => {
		const driver = createMemoryDriver();
		const library = new Library(driver, () => '2026-12-25T00:00:00.000Z');

		const outcome = await library.salvage(damaged(), 'damaged');

		expect(outcome).toEqual({ ok: true });
		// `updatedAt` is UNTOUCHED. Every ordinary save stamps it; stamping a
		// damaged record would edit the very thing being preserved.
		expect((await driver.load('damaged')).record).toEqual(damaged());
	});

	it('refuses a salvage whose value could never be found again', async () => {
		const library = new Library(createMemoryDriver());

		// The songs store keys on `id`. A value with the wrong one lands under a
		// key nothing can reach, which is a loss wearing the shape of a save.
		expect(await library.salvage(damaged(), 'a-different-id')).toEqual({ ok: false, reason: 'malformed' });
		expect(await library.salvage('not a record at all', 'damaged')).toEqual({ ok: false, reason: 'malformed' });
	});
});

describe('the open song, when it is the damaged one', () => {
	it('is READ-ONLY, for both reasons a record can refuse to be read', () => {
		const library = new Library(createMemoryDriver());
		const record = emptySongRecord('damaged', NOW);

		expect(SongDocument.fromLoaded(library, { record, reason: 'malformed' }).readOnly).toBe(true);
		expect(SongDocument.fromLoaded(library, { record, reason: 'newer-schema' }).readOnly).toBe(true);
	});

	it('is writable for every other reason, and for none', () => {
		// A write that refused and a browser with no storage are not damage. The
		// singer keeps working and the next save is allowed to try again.
		const library = new Library(createMemoryDriver());
		const record = emptySongRecord('ordinary', NOW);

		expect(SongDocument.fromLoaded(library, { record }).readOnly).toBe(false);
		expect(SongDocument.fromLoaded(library, { record, reason: 'no-storage' }).readOnly).toBe(false);
		expect(SongDocument.fromLoaded(library, { record, reason: 'quota-exceeded' }).readOnly).toBe(false);
	});
});

describe('the list row of a song that cannot be written to', () => {
	it('keeps the STORED name, never the live one', () => {
		// **FOUND ON THE WALK, 2026-08-18.** A damaged record opens as a rebuilt
		// stand-in with an empty name, the page auto-names it from whatever is on
		// screen, and the row drew that invented name beside a sentence promising
		// the record had been left untouched. The two contradicted each other and
		// the invented one was the lie: it can never be stored.
		const stored = summarizeStored(damaged(), 'damaged', NOW);
		const live = { ...stored, name: 'A NAME THE PAGE INVENTED' };

		const rows = libraryRows([stored], live, 'Untitled', true);

		expect(rows[0].label).toBe('Кабалевский, Сонет 90');
	});

	it('still takes the live name for a song that reads whole', () => {
		// A rename debounces like every other write, and the singer must see it
		// land in the same moment they typed it.
		const stored = summarize(emptySongRecord('clean', NOW));
		const live = { ...stored, name: 'Renamed a moment ago' };

		const rows = libraryRows([stored], live, 'Untitled', false);

		expect(rows[0].label).toBe('Renamed a moment ago');
	});
});

describe('the round trip: a damaged song leaves and comes back damaged', () => {
	async function exportBoth(): Promise<Uint8Array> {
		const vault = new Library(
			createMemoryDriver([emptySongRecord('clean', NOW), damaged() as unknown as SongRecord]),
		);
		const result = await exportBinder({
			ids: ['clean', 'damaged'],
			openId: 'clean',
			openRecord: emptySongRecord('clean', NOW),
			load: (id) => vault.load(id),
			loadSource: async (id) => (id === 'damaged' ? bytes('<score/>', 'damaged') : null),
			appVersion: '2026a',
			exportedAt: NOW,
			today: TODAY,
			untitled: 'Untitled',
		});
		expect(result.ok).toBe(true);
		if (!result.ok) throw new Error('export refused');
		return result.bytes;
	}

	it('carries the RAW record off, not the rebuilt one', async () => {
		const read = await readBinder(await exportBoth(), NOW);

		expect(read.ok).toBe(true);
		if (!read.ok) return;
		const song = read.songs.find((s) => s.record.id === 'damaged');
		// The damage is IN THE FILE. Exporting the rebuilt record would have
		// handed the singer a binder full of a repair they never asked for, and
		// the poem would be gone from the only copy that outlives the browser.
		expect((song?.raw as Record<string, unknown>).poem).toBe(42);
	});

	it('carries the raw record even when the damaged song is the OPEN one', async () => {
		// **THE WALK REFUTED THE FIRST BUILD HERE, 2026-08-18.** The open song was
		// taken from the document without asking the vault, so opening the damaged
		// song and pressing Export all wrote a binder holding the REBUILT record
		// plus an edit that was never saved and never would be. The salvage path
		// failed for exactly the song the singer was looking at.
		const vault = new Library(createMemoryDriver([damaged() as unknown as SongRecord]));
		const stale = emptySongRecord('damaged', NOW);
		stale.poem = 'AN EDIT THAT MUST NEVER LAND';

		const result = await exportBinder({
			ids: ['damaged'],
			openId: 'damaged',
			openRecord: stale,
			load: (id) => vault.load(id),
			loadSource: async () => null,
			appVersion: '2026a',
			exportedAt: NOW,
			today: TODAY,
			untitled: 'Untitled',
		});
		expect(result.ok).toBe(true);
		if (!result.ok) return;

		const read = await readBinder(result.bytes, NOW);
		expect(read.ok).toBe(true);
		if (!read.ok) return;
		expect(read.songs[0].raw).toEqual(damaged());
	});

	it('still takes the open song from the DOCUMENT when it reads whole', async () => {
		// The repair above must not cost the ordinary case: a song that reads
		// whole is exported as the singer has it on screen, not as the vault last
		// saw it.
		const vault = new Library(createMemoryDriver([emptySongRecord('clean', NOW)]));
		const live = emptySongRecord('clean', NOW);
		live.poem = 'typed a moment ago';

		const result = await exportBinder({
			ids: ['clean'],
			openId: 'clean',
			openRecord: live,
			load: (id) => vault.load(id),
			loadSource: async () => null,
			appVersion: '2026a',
			exportedAt: NOW,
			today: TODAY,
			untitled: 'Untitled',
		});
		expect(result.ok).toBe(true);
		if (!result.ok) return;

		const read = await readBinder(result.bytes, NOW);
		expect(read.ok).toBe(true);
		if (!read.ok) return;
		expect(read.songs[0].record.poem).toBe('typed a moment ago');
		expect(read.songs[0].raw).toBeUndefined();
	});

	it('does not refuse the whole binder because one song is damaged', async () => {
		// Before this step one bad record refused the file outright, so the export
		// design §4 calls the salvage path could be written and never read.
		const read = await readBinder(await exportBoth(), NOW);

		expect(read.ok).toBe(true);
		if (!read.ok) return;
		expect(read.songs).toHaveLength(2);
	});

	it('lands in a clean origin still damaged, still marked, with its bytes', async () => {
		const read = await readBinder(await exportBoth(), NOW);
		expect(read.ok).toBe(true);
		if (!read.ok) return;

		const driver = createMemoryDriver();
		const fresh = new Library(driver);
		const outcome = await importBinder({
			songs: read.songs,
			existing: [],
			save: (record, source) => fresh.save(record, source),
			salvage: (raw, id, source) => fresh.salvage(raw, id, source),
			ask: async () => 'mine',
			newId: () => 'never-used',
			openId: 'clean',
		});

		expect(outcome.added).toBe(2);
		expect(outcome.failed).toBe(false);
		// The record arrives as it left, and the vault says so rather than
		// pretending it is whole.
		const landed = await fresh.load('damaged');
		expect(landed.reason).toBe('malformed');
		expect(landed.raw).toEqual(damaged());
		// The score's bytes are the other half of the salvage, and they travel
		// whether or not the record they belong to can be read.
		const source = await fresh.loadSource('damaged');
		expect(new TextDecoder().decode(source!.bytes)).toBe('<score/>');
	});
});

describe('a binder from a newer Ilya', () => {
	it('is refused whole, at the record and not only at the manifest', async () => {
		const vault = new Library(createMemoryDriver([fromFuture() as unknown as SongRecord]));
		const written = await exportBinder({
			ids: ['future'],
			openId: 'somebody-else',
			openRecord: emptySongRecord('somebody-else', NOW),
			load: (id) => vault.load(id),
			loadSource: async () => null,
			appVersion: '2026a',
			exportedAt: NOW,
			today: TODAY,
			untitled: 'Untitled',
		});
		expect(written.ok).toBe(true);
		if (!written.ok) return;

		// The manifest's own schema is this version's, because this version wrote
		// the file. The refusal has to come from the RECORD, which is where the
		// future version actually is. Design §5, and the binder is untouched.
		expect(await readBinder(written.bytes, NOW)).toEqual({ ok: false, reason: 'newer-schema' });
	});
});
