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
		// `persistGlosses` uses `?? ''` (`+page.svelte:602`). A gloss with no
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
