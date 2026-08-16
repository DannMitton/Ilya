/**
 * migration.test.ts — N.67 step 1.
 *
 * The migration is the only irreversible thing in this build: it deletes the
 * singer's localStorage keys. So the tests are weighted toward the failure
 * side, and the rule they all check is one sentence from the design: a failed
 * migration removes NOTHING and runs again next boot.
 */
import { describe, it, expect } from 'vitest';
import { migrateFromLocalStorage, hasLegacyWork, MIGRATED_KEYS } from './migration';
import { createMemoryDriver, LEGACY_KEYS, type KeyValueStore, type StorageDriver } from './driver';
import { emptySongRecord, type SongRecord } from './types';

const NOW = '2026-08-16T00:00:00.000Z';

function fakeStore(seed: Record<string, string> = {}): KeyValueStore & { map: Map<string, string> } {
	const map = new Map(Object.entries(seed));
	return {
		map,
		getItem: (key) => (map.has(key) ? (map.get(key) as string) : null),
		setItem: (key, value) => void map.set(key, value),
		removeItem: (key) => void map.delete(key),
	};
}

function workingStore() {
	return fakeStore({
		'ilya:inputText': 'Я тебя любил',
		'ilya:metadata': '{"title":"Сонет 90","composer":"Kabalevsky"}',
		'ilya:metadataFromScore': '["title"]',
		'ilya:glossOverrides': '[["0-0","I","я"]]',
		'ilya:openSyllabification': 'true',
		'ilya:pairings': '{"m1-0-1":{"kind":"empty"}}',
	});
}

function deps(store: KeyValueStore | null, driver: StorageDriver, alreadyMigrated = false) {
	return { store, driver, alreadyMigrated, newId: () => 'new-song-id', now: () => NOW };
}

describe('hasLegacyWork', () => {
	it('is false for a fresh install', () => {
		expect(hasLegacyWork(fakeStore())).toBe(false);
	});

	it('is false for keys a mere render left behind', () => {
		// An empty map and an empty list are not the singer's work. Without
		// this, every first visit would mint and store an empty song.
		expect(hasLegacyWork(fakeStore({ 'ilya:pairings': '{}', 'ilya:glossOverrides': '[]', 'ilya:inputText': '' }))).toBe(
			false,
		);
	});

	it('is true for a poem alone', () => {
		expect(hasLegacyWork(fakeStore({ 'ilya:inputText': 'Если' }))).toBe(true);
	});

	it('is true for placements alone', () => {
		expect(hasLegacyWork(fakeStore({ 'ilya:pairings': '{"m1-0-1":{"kind":"empty"}}' }))).toBe(true);
	});
});

describe('migrateFromLocalStorage', () => {
	it('does nothing when the flag is already set', async () => {
		const store = workingStore();

		const outcome = await migrateFromLocalStorage(deps(store, createMemoryDriver(), true));

		expect(outcome.kind).toBe('not-needed');
		expect(store.map.has('ilya:inputText')).toBe(true);
	});

	it('moves the song, then removes exactly the five keys that moved', async () => {
		const store = workingStore();
		const driver = createMemoryDriver();

		const outcome = await migrateFromLocalStorage(deps(store, driver));

		expect(outcome.kind).toBe('migrated');
		const stored = await driver.load('new-song-id');
		expect(stored.record.poem).toBe('Я тебя любил');
		expect(stored.record.metadata.title).toBe('Сонет 90');
		expect(stored.record.fromScore).toEqual(['title']);
		expect(stored.record.glosses).toEqual([['0-0', 'I', 'я']]);
		expect(stored.record.pairings).toEqual({ 'm1-0-1': { kind: 'empty' } });
		expect(stored.record.openSyllabification).toBe(true);

		for (const key of MIGRATED_KEYS) expect(store.map.has(key)).toBe(false);
		// The syllabification choice STAYS: it is also the default for new
		// songs, and removing it would silently reset that default (design §3.5).
		expect(store.map.get(LEGACY_KEYS.openSyllabification)).toBe('true');
	});

	it('carries no source, and says so, because today never kept one', async () => {
		const driver = createMemoryDriver();

		await migrateFromLocalStorage(deps(workingStore(), driver));

		expect((await driver.load('new-song-id')).record.source).toBeNull();
	});

	it('sets the id and the timestamps it was given', async () => {
		const driver = createMemoryDriver();

		const outcome = await migrateFromLocalStorage(deps(workingStore(), driver));

		expect(outcome.kind === 'migrated' && outcome.record.id).toBe('new-song-id');
		expect(outcome.kind === 'migrated' && outcome.record.createdAt).toBe(NOW);
	});

	it('migrates nothing on a fresh install', async () => {
		const outcome = await migrateFromLocalStorage(deps(fakeStore(), createMemoryDriver()));

		expect(outcome.kind).toBe('nothing-to-move');
	});

	it('REMOVES NOTHING when the write fails', async () => {
		const store = workingStore();
		const failing: StorageDriver = {
			kind: 'memory',
			load: async (id) => ({ record: emptySongRecord(id, NOW) }),
			save: async () => ({ ok: false, reason: 'quota-exceeded' }),
			loadSource: async () => null,
		};

		const outcome = await migrateFromLocalStorage(deps(store, failing));

		expect(outcome).toEqual({ kind: 'failed', reason: 'quota-exceeded' });
		for (const key of MIGRATED_KEYS) expect(store.map.has(key)).toBe(true);
	});

	it('REMOVES NOTHING when the write succeeds but the read back fails', async () => {
		const store = workingStore();
		// The case the whole write-verify-remove order exists for: a driver that
		// says yes and cannot produce the record afterwards.
		const liar: StorageDriver = {
			kind: 'memory',
			load: async (id) => ({ record: emptySongRecord(id, NOW), reason: 'write-failed' }),
			save: async () => ({ ok: true }),
			loadSource: async () => null,
		};

		const outcome = await migrateFromLocalStorage(deps(store, liar));

		expect(outcome.kind).toBe('failed');
		for (const key of MIGRATED_KEYS) expect(store.map.has(key)).toBe(true);
	});

	it('REMOVES NOTHING when the record comes back changed', async () => {
		const store = workingStore();
		const forgetful: StorageDriver = {
			kind: 'memory',
			load: async (id) => {
				const record: SongRecord = emptySongRecord(id, NOW);
				// Everything but the poem survived. That is a loss, and it must
				// not be followed by deleting the original.
				record.poem = '';
				return { record };
			},
			save: async () => ({ ok: true }),
			loadSource: async () => null,
		};

		const outcome = await migrateFromLocalStorage(deps(store, forgetful));

		expect(outcome).toEqual({ kind: 'failed', reason: 'malformed' });
		expect(store.map.get('ilya:inputText')).toBe('Я тебя любил');
	});

	it('treats an absent store as nothing to move rather than a failure', async () => {
		expect((await migrateFromLocalStorage(deps(null, createMemoryDriver()))).kind).toBe('nothing-to-move');
	});
});
