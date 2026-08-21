/**
 * library.test.ts — N.67 step 0.
 *
 * The facade is where everything that can lose a singer's work lives, so this
 * is where the coverage is. Three groups: the conversion between the record
 * and the page's own state, validation of a record that came back wrong, and
 * the save cadence, whose one job is that a burst of edits writes once and no
 * edit is ever the one that did not land.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	arrivalDecision,
	createSaveScheduler,
	fieldsFromRecord,
	Library,
	recordFromFields,
	validateRecord,
	type SongFields,
} from './library';
import { createMemoryDriver, type StorageDriver } from './driver';
import { emptySongRecord, type SongRecord } from './types';

const NOW = '2026-08-16T00:00:00.000Z';
const LATER = '2026-08-16T01:00:00.000Z';

function seededRecord(): SongRecord {
	const record = emptySongRecord('test-song', NOW);
	record.poem = 'Я тебя любил';
	record.metadata = { ...record.metadata, title: 'Сонет 90', composer: 'Kabalevsky' };
	record.fromScore = ['title'];
	record.glosses = [
		['0-0', 'I', 'я'],
		['0-1', 'loved', 'любил'],
	];
	record.openSyllabification = true;
	return record;
}

describe('record and page state', () => {
	it('splits the stored gloss rows back into the page’s two maps', () => {
		const fields = fieldsFromRecord(seededRecord());

		expect([...fields.glossOverrides]).toEqual([
			['0-0', 'I'],
			['0-1', 'loved'],
		]);
		expect([...fields.glossAnchors]).toEqual([
			['0-0', 'я'],
			['0-1', 'любил'],
		]);
	});

	it('round trips through the page shapes without losing a field', () => {
		const record = seededRecord();

		const back = recordFromFields(record, fieldsFromRecord(record));

		expect(back).toEqual(record);
	});

	it('writes an empty anchor rather than dropping a gloss that has none', () => {
		// `persistGlosses` uses `?? ''` (`+page.svelte`). A gloss with no
		// anchor is still the singer's writing, so it is stored; the READ side
		// is where an unanchored row is discarded, which is today's split too.
		const fields: SongFields = {
			...fieldsFromRecord(emptySongRecord('x', NOW)),
			glossOverrides: new Map([['0-0', 'if']]),
			glossAnchors: new Map(),
		};

		expect(recordFromFields(emptySongRecord('x', NOW), fields).glosses).toEqual([['0-0', 'if', '']]);
	});

	it('copies the metadata rather than aliasing the record’s object', () => {
		const record = seededRecord();
		const fields = fieldsFromRecord(record);

		fields.metadata.title = 'changed';

		expect(record.metadata.title).toBe('Сонет 90');
	});
});

describe('validateRecord', () => {
	it('accepts a whole record unchanged', () => {
		const record = seededRecord();

		const result = validateRecord(record, 'test-song', LATER);

		expect(result.reason).toBeUndefined();
		expect(result.record).toEqual(record);
	});

	/**
	 * N.59 step 7 found that `source` was never carried through this function at
	 * all. Two things depended on it and neither worked across a reload: the
	 * chimera warning's stored fingerprint (N.67 step 4a), and the clef and key
	 * a photographed page was read with. These tests exist so it cannot go
	 * silently missing again.
	 */
	it('carries the source provenance through, which it did not before N.59', () => {
		const source = {
			fileName: 'kabalevsky.musx',
			byteLength: 145513,
			importedAt: NOW,
			contentHash: 'abc123',
			fingerprint: 'fp-90',
		};

		const result = validateRecord({ source }, 'test-song', NOW);

		expect(result.reason).toBeUndefined();
		expect(result.record.source).toEqual({ ...source, page: null });
	});

	it('carries a photographed page\'s clef, key, and octave', () => {
		const page = {
			clef: { sign: 'G', line: 2 },
			octaveChange: -1,
			fifths: 7,
			originalName: 'IMG_5042.HEIC',
			originalHash: 'b0c91c1c',
			staffSpace: [21],
		};

		const result = validateRecord(
			{ source: { fileName: 'page.png', byteLength: 828495, importedAt: NOW, contentHash: 'h', fingerprint: 'f', page } },
			'test-song',
			NOW,
		);

		expect(result.record.source?.page).toEqual(page);
	});

	it('drops a half-read page rather than inventing an answer the singer never gave', () => {
		const result = validateRecord(
			{
				source: {
					fileName: 'page.png',
					byteLength: 1,
					importedAt: NOW,
					contentHash: 'h',
					fingerprint: 'f',
					// No clef: a half-kept answer would be read back as confident.
					page: { octaveChange: -1, fifths: 7 },
				},
			},
			'test-song',
			NOW,
		);

		expect(result.record.source?.page).toBeNull();
		expect(result.record.source?.fileName).toBe('page.png');
	});

	it('reports a source it cannot read, and keeps the rest of the record', () => {
		const result = validateRecord({ poem: 'Если', source: { fileName: 7 } }, 'test-song', NOW);

		expect(result.reason).toBe('malformed');
		expect(result.record.source).toBeNull();
		expect(result.record.poem).toBe('Если');
	});

	it('replaces a record that is not an object at all', () => {
		expect(validateRecord('nonsense', 'test-song', NOW).reason).toBe('malformed');
		expect(validateRecord(null, 'test-song', NOW).record.poem).toBe('');
		expect(validateRecord([1, 2], 'test-song', NOW).reason).toBe('malformed');
	});

	it('keeps the fields it can read and reports the ones it cannot', () => {
		const result = validateRecord(
			{ poem: 'Если', metadata: { title: 42 }, pairings: 'not a map' },
			'test-song',
			NOW,
		);

		expect(result.reason).toBe('malformed');
		expect(result.record.poem).toBe('Если');
		expect(result.record.metadata.title).toBe('');
		expect(result.record.pairings).toEqual({});
	});

	it('does not report a record that is merely missing optional fields', () => {
		const result = validateRecord({ poem: 'Если' }, 'test-song', NOW);

		expect(result.reason).toBeUndefined();
		expect(result.record.poem).toBe('Если');
	});

	it('discards a provenance tag that names no metadata field', () => {
		const result = validateRecord({ fromScore: ['title', 'nonsense'] }, 'test-song', NOW);

		expect(result.record.fromScore).toEqual(['title']);
	});

	it('keeps the id it was given when the record carries none', () => {
		expect(validateRecord({}, 'test-song', NOW).record.id).toBe('test-song');
	});
});

describe('Library', () => {
	it('stamps updatedAt on every save, and leaves createdAt alone', async () => {
		const driver = createMemoryDriver();
		const library = new Library(driver, () => LATER);
		const record = seededRecord();

		await library.save(record);

		const loaded = await driver.load('test-song');
		expect(loaded.record.updatedAt).toBe(LATER);
		expect(loaded.record.createdAt).toBe(NOW);
	});

	it('turns a driver that throws into a reported failure, not a crash', async () => {
		const throwing: StorageDriver = {
			kind: 'memory',
			load: async () => {
				throw new Error('driver exploded');
			},
			save: async () => {
				throw new Error('driver exploded');
			},
			loadSource: async () => null,
		};
		const library = new Library(throwing, () => NOW);

		expect(await library.save(seededRecord())).toEqual({ ok: false, reason: 'write-failed' });
		const loaded = await library.load('test-song');
		expect(loaded.reason).toBe('malformed');
		expect(loaded.record.poem).toBe('');
	});

	it('prefers the driver’s own reason over the validator’s', async () => {
		const noStorage: StorageDriver = {
			kind: 'legacy',
			load: async (id) => ({ record: emptySongRecord(id, NOW), reason: 'no-storage' }),
			save: async () => ({ ok: false, reason: 'no-storage' }),
			loadSource: async () => null,
		};

		// An empty record from a browser with no storage is not a malformed
		// record, and telling the singer it was malformed would be a lie.
		expect((await new Library(noStorage, () => NOW).load('test-song')).reason).toBe('no-storage');
	});

	it('validates what the driver hands back, however it was stored', async () => {
		const rotten: StorageDriver = {
			kind: 'memory',
			load: async () => ({ record: { poem: 'Если', pairings: 7 } as unknown as SongRecord }),
			save: async () => ({ ok: true }),
			loadSource: async () => null,
		};

		const loaded = await new Library(rotten, () => NOW).load('test-song');

		expect(loaded.reason).toBe('malformed');
		expect(loaded.record.poem).toBe('Если');
	});
});

describe('the save cadence', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('folds a burst of changes into one write', async () => {
		const run = vi.fn(async () => {});
		const scheduler = createSaveScheduler(run, { delayMs: 800, maxWaitMs: 5000 });

		scheduler.schedule();
		vi.advanceTimersByTime(200);
		scheduler.schedule();
		vi.advanceTimersByTime(200);
		scheduler.schedule();
		expect(run).not.toHaveBeenCalled();

		await vi.advanceTimersByTimeAsync(800);
		expect(run).toHaveBeenCalledTimes(1);
	});

	it('checkpoints under continuous activity rather than never writing', async () => {
		const run = vi.fn(async () => {});
		const scheduler = createSaveScheduler(run, { delayMs: 800, maxWaitMs: 5000 });

		// A change every 400 ms would reset the trailing timer forever. The
		// ceiling is what stops a singer typing for ten minutes from having
		// written nothing at all.
		for (let elapsed = 0; elapsed < 5000; elapsed += 400) {
			scheduler.schedule();
			await vi.advanceTimersByTimeAsync(400);
		}

		expect(run).toHaveBeenCalledTimes(1);
	});

	it('writes immediately on flush, with no timer left behind', async () => {
		const run = vi.fn(async () => {});
		const scheduler = createSaveScheduler(run, { delayMs: 800, maxWaitMs: 5000 });

		scheduler.schedule();
		await scheduler.flush();
		expect(run).toHaveBeenCalledTimes(1);

		await vi.advanceTimersByTimeAsync(5000);
		expect(run).toHaveBeenCalledTimes(1);
	});

	it('does nothing on flush when nothing changed', async () => {
		const run = vi.fn(async () => {});

		await createSaveScheduler(run, {}).flush();

		expect(run).not.toHaveBeenCalled();
	});

	it('never drops a change that arrived while a write was in flight', async () => {
		const releases: Array<() => void> = [];
		const run = vi.fn(() => new Promise<void>((resolve) => void releases.push(resolve)));
		const scheduler = createSaveScheduler(run, { delayMs: 800, maxWaitMs: 5000 });

		scheduler.schedule();
		const first = scheduler.flush();
		expect(run).toHaveBeenCalledTimes(1);

		// The singer clicks another note while the write is still going.
		scheduler.schedule();
		releases[0]();
		for (let i = 0; i < 5; i += 1) await Promise.resolve();

		// The second write starts off the back of the first, without waiting
		// for a timer: the change is carried, not dropped and not delayed.
		expect(run).toHaveBeenCalledTimes(2);
		releases[1]();
		await first;
	});

	it('drops pending timers on dispose without writing', async () => {
		const run = vi.fn(async () => {});
		const scheduler = createSaveScheduler(run, { delayMs: 800, maxWaitMs: 5000 });

		scheduler.schedule();
		scheduler.dispose();
		await vi.advanceTimersByTimeAsync(5000);

		expect(run).not.toHaveBeenCalled();
	});
});

/* ── The chimera warning, N.67 step 4a ──────────────────────────── */

describe('arrivalDecision', () => {
	const fp = (s: string) => s.padEnd(64, '0');

	it('attaches the first score a song has ever had', () => {
		// Nothing to be different from, and nothing to lose.
		expect(arrivalDecision({ storedFingerprint: null, incomingFingerprint: fp('a'), orphanCount: 0 })).toBe('attach');
		expect(arrivalDecision({ storedFingerprint: undefined, incomingFingerprint: fp('a'), orphanCount: 9 })).toBe('attach');
	});

	it('attaches a re-export of the same music without a word', () => {
		// Different bytes, same notes at the same positions, same fingerprint
		// (design §2.4). The commonest legitimate re-upload of all.
		expect(arrivalDecision({ storedFingerprint: fp('a'), incomingFingerprint: fp('a'), orphanCount: 0 })).toBe('attach');
	});

	it('attaches a CORRECTED NOTE without a word, which is §2.4 kept', () => {
		// A corrected pitch breaks the fingerprint but keeps every event's
		// measure and position, so nothing is orphaned. §2.4 promises this case
		// is fine, and the orphan condition is what keeps that promise.
		expect(arrivalDecision({ storedFingerprint: fp('a'), incomingFingerprint: fp('b'), orphanCount: 0 })).toBe('attach');
	});

	it('attaches a TRANSPOSED edition without a word', () => {
		// Every pitch changes, every position survives, so no orphans. This is
		// why the rule does not test pitches: in vocal repertoire a transposition
		// is a common re-upload and the placements must survive it untouched.
		expect(arrivalDecision({ storedFingerprint: fp('transposed'), incomingFingerprint: fp('orig'), orphanCount: 0 })).toBe('attach');
	});

	it('ASKS when the music differs and a placement would be orphaned', () => {
		// A different piece. This is the chimera the warning exists to end.
		expect(arrivalDecision({ storedFingerprint: fp('a'), incomingFingerprint: fp('b'), orphanCount: 1 })).toBe('ask');
		expect(arrivalDecision({ storedFingerprint: fp('a'), incomingFingerprint: fp('b'), orphanCount: 40 })).toBe('ask');
	});

	it('never asks on a matching fingerprint, whatever the orphan count', () => {
		// Same music cannot be a different piece, so orphans there are drift,
		// which the drawer already reports without a dialog.
		expect(arrivalDecision({ storedFingerprint: fp('a'), incomingFingerprint: fp('a'), orphanCount: 12 })).toBe('attach');
	});
});
