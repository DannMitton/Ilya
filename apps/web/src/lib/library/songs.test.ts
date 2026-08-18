/**
 * songs.test.ts — N.67 step 4b, the library door's six operations.
 *
 * Plain TypeScript under vitest in node, which is the only place in this
 * repository where a decision is actually checked: runes are inert here
 * (`docs/memory/ENVIRONMENT.md`) and `.svelte` files are never compiled at all.
 * So every rule the door follows is asserted below, and `SongList.svelte` holds
 * none of them.
 */
import { describe, it, expect } from 'vitest';
import {
	createSong,
	deleteSong,
	libraryRows,
	listSongs,
	nameFor,
	placeholderName,
	proposeName,
	recognize,
	renameSong,
	sortSongs,
	toRows,
	uniqueName,
} from './songs';
import { createMemoryDriver, summarize, type PluralStore, type SongSummary } from './driver';
import { Library } from './library';
import { emptySongRecord, type SongRecord } from './types';

const NOW = '2026-08-18T12:00:00.000Z';

function song(id: string, over: Partial<SongRecord> = {}): SongRecord {
	return { ...emptySongRecord(id, NOW), ...over };
}

function withFingerprint(id: string, fingerprint: string): SongRecord {
	return song(id, {
		source: { fileName: 's.musicxml', byteLength: 10, importedAt: NOW, contentHash: 'h', fingerprint },
	});
}

function summary(over: Partial<SongSummary> & { id: string }): SongSummary {
	return { name: '', createdAt: NOW, updatedAt: NOW, fingerprint: null, ...over };
}

/** A plural store whose every method throws, for the "never crashes" rule. */
const hostile: PluralStore = {
	list: () => Promise.reject(new Error('gone')),
	remove: () => Promise.reject(new Error('gone')),
	findByFingerprint: () => Promise.reject(new Error('gone')),
};

describe('proposeName, design §2.3 layer 3', () => {
	it('names a song composer, title, the way a singer names a piece', () => {
		expect(proposeName(song('a', { metadata: { ...emptySongRecord('a', NOW).metadata, composer: 'Kabalevsky', title: 'Сонет 90' } }))).toBe(
			'Kabalevsky, Сонет 90',
		);
	});

	it('falls back to the title, then the composer, then the poem', () => {
		const base = emptySongRecord('a', NOW).metadata;
		expect(proposeName(song('a', { metadata: { ...base, title: 'Сонет 90' } }))).toBe('Сонет 90');
		expect(proposeName(song('a', { metadata: { ...base, composer: 'Kabalevsky' } }))).toBe('Kabalevsky');
		expect(proposeName(song('a', { poem: 'Я вас любил любовь ещё быть может' }))).toBe('Я вас любил любовь');
	});

	it('RETURNS NOTHING when there is nothing to name a song after', () => {
		// The honest answer for a song created a moment ago. Inventing a name
		// here is what put "Untitled" into records that later had a real title.
		expect(proposeName(song('a'))).toBe('');
		expect(proposeName(song('a', { poem: '   \n  ' }))).toBe('');
	});
});

describe('placeholderName', () => {
	it('is the song own creation date, in ISO, and is never stored', () => {
		expect(placeholderName('2026-08-18T12:00:00.000Z', 'Untitled')).toBe('Untitled, 2026-08-18');
	});
});

describe('uniqueName', () => {
	it('leaves a name alone when nothing else has it', () => {
		expect(uniqueName('Kabalevsky, Сонет 90', new Set())).toBe('Kabalevsky, Сонет 90');
	});

	it('appends a numeral on collision, and keeps counting', () => {
		expect(uniqueName('Sunless', new Set(['Sunless']))).toBe('Sunless (2)');
		expect(uniqueName('Sunless', new Set(['Sunless', 'Sunless (2)']))).toBe('Sunless (3)');
	});
});

describe('sortSongs', () => {
	it('puts the newest work first', () => {
		const rows = sortSongs([
			summary({ id: 'old', updatedAt: '2026-08-01T00:00:00.000Z' }),
			summary({ id: 'new', updatedAt: '2026-08-18T00:00:00.000Z' }),
		]);
		expect(rows.map((r) => r.id)).toEqual(['new', 'old']);
	});

	it('breaks every tie, so the same data never sorts two ways', () => {
		// Two songs written in the same millisecond are ordinary: creating one
		// writes the record and the pointer together. A list whose order changes
		// between two reads of the same data jumps under the hand.
		const a = summary({ id: 'a' });
		const b = summary({ id: 'b' });
		expect(sortSongs([a, b]).map((r) => r.id)).toEqual(sortSongs([b, a]).map((r) => r.id));
	});
});

describe('toRows', () => {
	it('draws the stored name when there is one', () => {
		expect(toRows([summary({ id: 'a', name: 'Kabalevsky, Сонет 90' })], 'Untitled')[0].label).toBe('Kabalevsky, Сонет 90');
	});

	it('numbers unnamed songs of the same day by CREATION order, not list order', () => {
		// The numbering must not move when a song is edited and rises to the top,
		// or the second song becomes the first one every time you touch it.
		const first = summary({ id: 'first', createdAt: '2026-08-18T09:00:00.000Z', updatedAt: '2026-08-18T09:00:00.000Z' });
		const second = summary({ id: 'second', createdAt: '2026-08-18T10:00:00.000Z', updatedAt: '2026-08-18T23:00:00.000Z' });
		const rows = toRows([first, second], 'Untitled');

		expect(rows.map((r) => r.id)).toEqual(['second', 'first']);
		expect(rows.find((r) => r.id === 'first')?.label).toBe('Untitled, 2026-08-18');
		expect(rows.find((r) => r.id === 'second')?.label).toBe('Untitled, 2026-08-18 (2)');
	});

	it('leaves two songs the singer named the same alone', () => {
		// They said what they meant. Correcting them would be the tool arguing.
		const rows = toRows([summary({ id: 'a', name: 'Elegy' }), summary({ id: 'b', name: 'Elegy' })], 'Untitled');
		expect(rows.map((r) => r.label)).toEqual(['Elegy', 'Elegy']);
	});
});

describe('libraryRows, what the drawer draws', () => {
	const open = summary({ id: 'open', name: 'live name' });

	it('takes the OPEN song name live, not the one the vault has', () => {
		// A rename debounces like every other write. Reading the vault's copy
		// would show the old name until the debounce landed, so a singer would
		// type a name and watch nothing happen.
		const rows = libraryRows([summary({ id: 'open', name: 'stale name' })], open, 'Untitled');
		expect(rows.map((r) => r.label)).toEqual(['live name']);
	});

	it('lists the open song even when the vault has never seen it', () => {
		// A first visit mints an id and writes nothing until the singer makes
		// something. That song is still the one they are in.
		expect(libraryRows([], open, 'Untitled').map((r) => r.id)).toEqual(['open']);
	});

	it('does not list it twice', () => {
		expect(libraryRows([summary({ id: 'open' })], open, 'Untitled')).toHaveLength(1);
	});
});

describe('nameFor', () => {
	it('is empty while a song has nothing to be named after', () => {
		expect(nameFor(song('a'), [])).toBe('');
	});

	it('builds the name and numbers it past what is already taken', () => {
		const record = song('a', { poem: 'Ночь тиха' });
		expect(nameFor(record, [])).toBe('Ночь тиха');
		expect(nameFor(record, [summary({ id: 'b', name: 'Ночь тиха' })])).toBe('Ночь тиха (2)');
	});

	it('never collides a song with ITSELF', () => {
		// Renaming through this path would otherwise walk a song up through
		// (2), (3), (4) every time its own row was counted against it.
		const record = song('a', { poem: 'Ночь тиха' });
		expect(nameFor(record, [summary({ id: 'a', name: 'Ночь тиха' })])).toBe('Ночь тиха');
	});
});

describe('listSongs', () => {
	it('is empty where the driver cannot hold two songs', async () => {
		expect(await listSongs(undefined)).toEqual([]);
	});

	it('is empty rather than a crash when the store throws', async () => {
		expect(await listSongs(hostile)).toEqual([]);
	});

	it('returns every song, newest work first', async () => {
		const driver = createMemoryDriver([
			song('old', { updatedAt: '2026-08-01T00:00:00.000Z' }),
			song('new', { updatedAt: '2026-08-18T00:00:00.000Z' }),
		]);
		expect((await listSongs(driver.plural)).map((s) => s.id)).toEqual(['new', 'old']);
	});
});

describe('createSong', () => {
	it('writes the record BEFORE anything opens it, and leaves it unnamed', async () => {
		const driver = createMemoryDriver();
		const library = new Library(driver, () => NOW, async () => undefined);

		const created = await createSong({ library, newId: () => 'fresh', now: () => NOW });

		expect(created.ok).toBe(true);
		// In the vault already: a reload between the write and the pointer move
		// must find a song that is really there.
		expect((await driver.plural!.list()).map((s) => s.id)).toEqual(['fresh']);
		expect((await library.load('fresh')).record.name).toBe('');
	});

	it('reports the reason when the write fails', async () => {
		const driver = createMemoryDriver();
		driver.save = async () => ({ ok: false, reason: 'quota-exceeded' });
		const library = new Library(driver, () => NOW, async () => undefined);

		expect(await createSong({ library, newId: () => 'fresh', now: () => NOW })).toEqual({
			ok: false,
			reason: 'quota-exceeded',
		});
	});
});

describe('renameSong', () => {
	it('renames a song without touching anything else in it', async () => {
		const driver = createMemoryDriver([song('a', { poem: 'Я вас любил', name: 'old' })]);
		const library = new Library(driver, () => NOW, async () => undefined);

		expect(await renameSong(library, 'a', 'Пушкин, Я вас любил')).toEqual({ ok: true });

		const loaded = await library.load('a');
		expect(loaded.record.name).toBe('Пушкин, Я вас любил');
		expect(loaded.record.poem).toBe('Я вас любил');
	});

	it('refuses rather than inventing a song where there is no storage', async () => {
		const driver = createMemoryDriver();
		driver.load = async (id) => ({ record: emptySongRecord(id, NOW), reason: 'no-storage' });
		const library = new Library(driver, () => NOW, async () => undefined);

		expect(await renameSong(library, 'a', 'anything')).toEqual({ ok: false, reason: 'no-storage' });
	});
});

describe('deleteSong', () => {
	it('removes the record and the bytes TOGETHER', async () => {
		const driver = createMemoryDriver([song('a'), song('b')]);
		await driver.save(song('a'), {
			songId: 'a',
			fileName: 's.musicxml',
			bytes: new ArrayBuffer(8),
			byteLength: 8,
			contentHash: 'h',
			importedAt: NOW,
		});

		expect(await deleteSong(driver.plural, 'a')).toEqual({ ok: true });

		expect((await driver.plural!.list()).map((s) => s.id)).toEqual(['b']);
		// Bytes with no record would be unreachable and undeletable forever.
		expect(await driver.loadSource('a')).toBeNull();
	});

	it('refuses where the driver cannot hold two songs', async () => {
		expect(await deleteSong(undefined, 'a')).toEqual({ ok: false, reason: 'no-storage' });
	});

	it('reports rather than throwing when the store throws', async () => {
		expect(await deleteSong(hostile, 'a')).toEqual({ ok: false, reason: 'write-failed' });
	});
});

describe('recognize, design §2.3 layer 2', () => {
	it('finds the song this music was built on', async () => {
		const driver = createMemoryDriver([withFingerprint('stored', 'fp-90'), song('open')]);

		const found = await recognize(driver.plural, 'fp-90', 'open');

		expect(found.map((s) => s.id)).toEqual(['stored']);
	});

	it('never recognizes the song you are already in', async () => {
		const driver = createMemoryDriver([withFingerprint('open', 'fp-90')]);
		expect(await recognize(driver.plural, 'fp-90', 'open')).toEqual([]);
	});

	it('MATCHES NOTHING ON AN EMPTY FINGERPRINT', async () => {
		// `attachUploadedSource` stores the empty string where `crypto.subtle`
		// was absent, and the empty string is a perfectly valid key. Without this
		// every unhashable song would recognize every other one.
		const driver = createMemoryDriver([withFingerprint('a', ''), withFingerprint('b', '')]);
		expect(await recognize(driver.plural, '', 'b')).toEqual([]);
	});

	it('is empty where there is no plural store, and where it throws', async () => {
		expect(await recognize(undefined, 'fp-90', 'open')).toEqual([]);
		expect(await recognize(hostile, 'fp-90', 'open')).toEqual([]);
	});
});

describe('summarize', () => {
	it('carries the fingerprint as null rather than as an empty string', async () => {
		// So a caller can tell "no score" and "unhashable" from a real match
		// without knowing that the empty string is a legal IndexedDB key.
		expect(summarize(song('a')).fingerprint).toBeNull();
		expect(summarize(withFingerprint('a', '')).fingerprint).toBeNull();
		expect(summarize(withFingerprint('a', 'fp-90')).fingerprint).toBe('fp-90');
	});
});
