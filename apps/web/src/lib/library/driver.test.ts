/**
 * driver.test.ts — N.67 step 0.
 *
 * The point of these tests is BYTE COMPATIBILITY. Step 0 must leave a
 * singer's browser holding exactly what today's code leaves it holding, so
 * that step 1's migration reads the same six keys it was designed against and
 * a singer who reloads mid-build loses nothing. So the assertions are on the
 * exact stored strings, not on a round trip alone: a round trip through one
 * module's own serializer would pass even if both halves drifted together.
 */
import { describe, it, expect } from 'vitest';
import { createLegacyDriver, createMemoryDriver, LEGACY_KEYS, type KeyValueStore } from './driver';
import { emptySongRecord, type SongRecord } from './types';

function fakeStore(seed: Record<string, string> = {}): KeyValueStore & { map: Map<string, string> } {
	const map = new Map(Object.entries(seed));
	return {
		map,
		getItem: (key) => (map.has(key) ? (map.get(key) as string) : null),
		setItem: (key, value) => void map.set(key, value),
		removeItem: (key) => void map.delete(key),
	};
}

function filledRecord(): SongRecord {
	const record = emptySongRecord('test-song', '2026-08-16T00:00:00.000Z');
	record.poem = 'Я тебя любил';
	record.metadata = {
		title: 'Сонет 90',
		composer: 'Kabalevsky',
		poet: 'Shakespeare',
		translator: 'Marshak',
		opus: 'op. 52 no. 9',
		transcriber: 'Dann',
	};
	record.fromScore = ['title', 'composer'];
	record.glosses = [['0-1', 'loved', 'любил']];
	record.openSyllabification = true;
	record.pairings = {
		'm1-0-1': {
			kind: 'syllable',
			cyrillic: 'Я',
			ipa: 'ja',
			vowel: 'a',
			origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0, word: 'Я' },
		},
	};
	return record;
}

describe('legacy driver', () => {
	it('writes exactly the six keys today writes, and nothing else', async () => {
		const store = fakeStore();
		const outcome = await createLegacyDriver(store).save(filledRecord());

		expect(outcome).toEqual({ ok: true });
		expect([...store.map.keys()].sort()).toEqual(
			[
				'ilya:glossOverrides',
				'ilya:inputText',
				'ilya:metadata',
				'ilya:metadataFromScore',
				'ilya:openSyllabification',
				'ilya:pairings',
			].sort(),
		);
	});

	it('serializes each key the way the page serializes it today', async () => {
		const store = fakeStore();
		const record = filledRecord();
		await createLegacyDriver(store).save(record);

		// The poem is a bare string, not JSON (`handleClear` in `+page.svelte`).
		expect(store.map.get(LEGACY_KEYS.poem)).toBe(record.poem);
		expect(store.map.get(LEGACY_KEYS.metadata)).toBe(JSON.stringify(record.metadata));
		// Tag order is the SCORE_HEADER_FIELDS order, not insertion order.
		expect(store.map.get(LEGACY_KEYS.fromScore)).toBe('["title","composer"]');
		// Rows are [key, gloss, anchor] (`persistGlosses` in `+page.svelte`).
		expect(store.map.get(LEGACY_KEYS.glosses)).toBe('[["0-1","loved","любил"]]');
		expect(store.map.get(LEGACY_KEYS.openSyllabification)).toBe('true');
		expect(store.map.get(LEGACY_KEYS.pairings)).toBe(JSON.stringify(record.pairings));
	});

	it('reads back what it wrote, field for field', async () => {
		const store = fakeStore();
		const driver = createLegacyDriver(store);
		const record = filledRecord();
		await driver.save(record);

		const loaded = await driver.load('test-song');
		expect(loaded.reason).toBeUndefined();
		expect(loaded.record.poem).toBe(record.poem);
		expect(loaded.record.metadata).toEqual(record.metadata);
		expect(loaded.record.fromScore).toEqual(['title', 'composer']);
		expect(loaded.record.glosses).toEqual(record.glosses);
		expect(loaded.record.openSyllabification).toBe(true);
		expect(loaded.record.pairings).toEqual(record.pairings);
	});

	it('reads a browser that today, unmodified, wrote', async () => {
		// Written by hand in the shapes `+page.svelte` writes, not by the driver.
		const store = fakeStore({
			'ilya:inputText': 'Если',
			'ilya:metadata': '{"title":"Сонет 90","composer":"Kabalevsky"}',
			'ilya:metadataFromScore': '["title"]',
			'ilya:glossOverrides': '[["0-0","if","если"]]',
			'ilya:openSyllabification': 'true',
			'ilya:pairings': '{"m1-0-1":{"kind":"empty"}}',
		});

		const loaded = await createLegacyDriver(store).load('test-song');

		expect(loaded.reason).toBeUndefined();
		expect(loaded.record.poem).toBe('Если');
		// A partial metadata object merges over the defaults, so the four fields
		// the old value does not carry come back empty rather than undefined.
		expect(loaded.record.metadata).toEqual({
			title: 'Сонет 90',
			composer: 'Kabalevsky',
			poet: '',
			translator: '',
			opus: '',
			transcriber: '',
		});
		expect(loaded.record.fromScore).toEqual(['title']);
		expect(loaded.record.glosses).toEqual([['0-0', 'if', 'если']]);
		expect(loaded.record.openSyllabification).toBe(true);
		expect(loaded.record.pairings).toEqual({ 'm1-0-1': { kind: 'empty' } });
	});

	it('drops a provenance tag whose field came back empty, as today does', async () => {
		const store = fakeStore({
			'ilya:metadata': '{"composer":"Kabalevsky"}',
			'ilya:metadataFromScore': '["title","composer"]',
		});

		const loaded = await createLegacyDriver(store).load('test-song');

		// `parseFromScore` discards a tag over an empty box, and it can only do
		// that if the metadata was parsed FIRST. This test is the ordering.
		expect(loaded.record.fromScore).toEqual(['composer']);
	});

	it('drops a gloss row with no anchor word, as today does', async () => {
		const store = fakeStore({ 'ilya:glossOverrides': '[["0-0","if",""],["0-1","and","и"]]' });

		const loaded = await createLegacyDriver(store).load('test-song');

		expect(loaded.record.glosses).toEqual([['0-1', 'and', 'и']]);
	});

	it('reports malformed without losing the fields that were readable', async () => {
		const store = fakeStore({
			'ilya:inputText': 'Если',
			'ilya:metadata': '{not json',
			'ilya:pairings': '["an array where an object belongs"]',
		});

		const loaded = await createLegacyDriver(store).load('test-song');

		expect(loaded.reason).toBe('malformed');
		expect(loaded.record.poem).toBe('Если');
		expect(loaded.record.metadata.title).toBe('');
		expect(loaded.record.pairings).toEqual({});
	});

	it('reports a quota failure with its own reason, not a generic one', async () => {
		const store = fakeStore();
		store.setItem = () => {
			throw new DOMException('full', 'QuotaExceededError');
		};

		const outcome = await createLegacyDriver(store).save(filledRecord());

		expect(outcome).toEqual({ ok: false, reason: 'quota-exceeded' });
	});

	it('reports any other write failure as write-failed', async () => {
		const store = fakeStore();
		store.setItem = () => {
			throw new Error('something else');
		};

		expect(await createLegacyDriver(store).save(filledRecord())).toEqual({
			ok: false,
			reason: 'write-failed',
		});
	});

	it('reports no-storage rather than pretending to save', async () => {
		const driver = createLegacyDriver(null);

		expect(await driver.save(filledRecord())).toEqual({ ok: false, reason: 'no-storage' });
		const loaded = await driver.load('test-song');
		expect(loaded.reason).toBe('no-storage');
		expect(loaded.record.poem).toBe('');
	});

	it('leaves an absent key at its default, and does not report that as a failure', async () => {
		const loaded = await createLegacyDriver(fakeStore()).load('test-song');

		expect(loaded.reason).toBeUndefined();
		expect(loaded.record.poem).toBe('');
		expect(loaded.record.openSyllabification).toBe(false);
		expect(loaded.record.pairings).toEqual({});
	});
});

describe('memory driver', () => {
	it('round trips a record and hands back a copy, not the stored object', async () => {
		const driver = createMemoryDriver();
		const record = filledRecord();
		await driver.save(record);

		const first = await driver.load('test-song');
		first.record.poem = 'mutated';
		const second = await driver.load('test-song');

		expect(second.record.poem).toBe(record.poem);
	});
});
