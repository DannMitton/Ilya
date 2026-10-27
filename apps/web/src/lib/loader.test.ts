/**
 * Homograph tier installation tests (N.14).
 *
 * The shards hold exactly one entry per headword, so a spelling with two
 * stress positions can only ship one of them. data/homographs.json supplies
 * the rest, and installHomographEntries puts them into the live dictionary
 * that @ilya/phonology and @ilya/dictionary both hold by reference.
 *
 * What is pinned down here is the plumbing that could silently lie rather
 * than throw:
 *
 *  - the raw payload needs mapSingleEntry's composed `g`, or lookupStress
 *    reads an undefined gloss and every printed gloss for these 6,763 words
 *    goes blank;
 *  - element 0 must remain the entry the shards shipped, because
 *    lookupStress returns entry[0] and nothing a singer has transcribed may
 *    move;
 *  - mergeGlossTier must write E/F onto element 0 rather than onto the array
 *    object, where nothing reads it and the full gloss vanishes with no
 *    error;
 *  - the two tiers land on an idle callback each and may arrive in either
 *    order.
 *
 * The fixtures use горе, whose four readings are the case that prompted the
 * item. Glosses are copied from the payload the build produces.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { installHomographEntries, mergeGlossTier, loadDictionary, type LoaderState } from './loader';

/** As the shards ship it: the locative of гора, one entry, mapped on parse. */
function shippedGore() {
	return { s: 1, e: 'mountain', f: 'peine, chagrin', p: 'noun', l: 'гора', g: { en: 'mountain', fr: 'peine, chagrin' } };
}

/** As data/homographs.json holds it: raw, unmapped, shipped entry first. */
function payloadGore() {
	return {
		горе: [
			{ s: 1, e: 'mountain', f: 'peine, chagrin', p: 'noun', l: 'гора' },
			{ s: 1, e: 'up', p: 'adv', l: 'горе' },
			{ s: 0, e: 'grief, distress, sadness', p: 'noun', l: 'горе' },
		],
	};
}

describe('installHomographEntries (N.14)', () => {
	it('replaces the scalar entry with the array', () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		const installed = installHomographEntries(dict, payloadGore());
		expect(installed).toBe(1);
		expect(Array.isArray(dict.горе)).toBe(true);
		expect(dict.горе).toHaveLength(3);
	});

	it('leaves element 0 as the reading the shards shipped', () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		installHomographEntries(dict, payloadGore());
		// lookupStress returns entry[0]. If this moves, every existing score moves.
		expect(dict.горе[0].s).toBe(1);
		expect(dict.горе[0].l).toBe('гора');
	});

	it('composes g on every entry, not only the first', () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		installHomographEntries(dict, payloadGore());
		// normalizeEntry reads `gloss ?? g`. Without this the page goes blank.
		expect(dict.горе[0].g).toEqual({ en: 'mountain', fr: 'peine, chagrin' });
		expect(dict.горе[1].g).toEqual({ en: 'up', fr: '' });
		expect(dict.горе[2].g).toEqual({ en: 'grief, distress, sadness', fr: '' });
	});

	it('skips a word the shards never shipped', () => {
		const dict: Record<string, any> = {};
		expect(installHomographEntries(dict, payloadGore())).toBe(0);
		expect(dict.горе).toBeUndefined();
	});

	it('is a no-op on a second run', () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		expect(installHomographEntries(dict, payloadGore())).toBe(1);
		expect(installHomographEntries(dict, payloadGore())).toBe(0);
		expect(dict.горе).toHaveLength(3);
	});

	it('ignores a payload value that is not a real alternative', () => {
		const dict: Record<string, any> = { горе: shippedGore(), мука: { s: 1, e: 'flour', p: 'noun', l: 'мука' } };
		installHomographEntries(dict, { горе: [{ s: 1, e: 'mountain', p: 'noun', l: 'гора' }], мука: [] } as any);
		expect(Array.isArray(dict.горе)).toBe(false);
		expect(Array.isArray(dict.мука)).toBe(false);
	});
});

describe('mergeGlossTier across an array-valued entry (N.14)', () => {
	const line = (word: string, E: string) => JSON.stringify([word, { E }]);

	it('writes the full gloss onto element 0, not onto the array', async () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		installHomographEntries(dict, payloadGore());
		await mergeGlossTier([line('горе', 'grief; the mountain word')], dict);
		expect(dict.горе[0].E).toBe('grief; the mountain word');
		// The control that makes this test able to fail: before N.14 the property
		// landed here, where resolveFullGloss never looks.
		expect((dict.горе as any).E).toBeUndefined();
	});

	it('still writes onto a scalar entry', async () => {
		const dict: Record<string, any> = { гора: { s: 1, e: 'mountain', p: 'noun', l: 'гора' } };
		await mergeGlossTier([line('гора', 'a mountain')], dict);
		expect(dict.гора.E).toBe('a mountain');
	});

	it('survives the gloss tier arriving first', async () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		await mergeGlossTier([line('горе', 'arrived first')], dict);
		installHomographEntries(dict, payloadGore());
		expect(dict.горе[0].E).toBe('arrived first');
	});
});

/**
 * N.195: the dictionary starts with no connection.
 *
 * These drive the exported `loadDictionary` with a mocked global `fetch` and
 * `fake-indexeddb` on `globalThis`; `openDB` and the other internals are not
 * exported and are not reached around. A fresh `IDBFactory` per test: the loader
 * never closes its connections, so deleting a database would block.
 */
describe('loadDictionary without a connection (N.195)', () => {
	const NDJSON = (...words: string[]) => words.map((w) => JSON.stringify([w, { s: 1, e: 'x', f: 'y', p: 'noun', l: w }])).join('\n');
	const manifestFor = (hash: string, files: string[] = [`d1.${hash}.json`, `d2.${hash}.json`]) => ({ version: 't', hash, files, glossFiles: [`g.${hash}.json`] });

	interface Net {
		manifest?: object | 'reject' | 'http500';
		json?: 'ok' | 'reject' | 'http503';
		files?: 'ok' | 'reject';
	}
	let calls: string[];

	function serve(net: Net) {
		calls = [];
		vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
			const path = new URL(String(input), 'http://x').pathname;
			calls.push(path);
			const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
			if (path.endsWith('dictionary-manifest.json')) {
				if (net.manifest === 'reject') throw new TypeError('Failed to fetch');
				if (net.manifest === 'http500') return new Response('', { status: 500 });
				return json(net.manifest);
			}
			if (path.endsWith('singer-supplement.json') || path.endsWith('blurb-composer.json')) {
				if (net.json === 'reject') throw new TypeError('Failed to fetch');
				if (net.json === 'http503') return new Response('', { status: 503 });
				return json({});
			}
			if (path.endsWith('homographs.json')) return json({});
			if (net.files === 'reject') throw new TypeError('Failed to fetch');
			return new Response(NDJSON('гора', 'горе'), { status: 200 });
		});
	}

	async function start(): Promise<LoaderState> {
		let last!: LoaderState;
		await loadDictionary({ onStateChange: (s) => (last = s) });
		return last;
	}

	const get = <T>(key: string): Promise<T | undefined> =>
		new Promise((resolve, reject) => {
			const open = indexedDB.open('ilya-data', 1);
			open.onupgradeneeded = () => open.result.createObjectStore('cache');
			open.onerror = () => reject(open.error);
			open.onsuccess = () => {
				const g = open.result.transaction('cache').objectStore('cache').get(key);
				g.onsuccess = () => resolve(g.result as T | undefined);
				g.onerror = () => reject(g.error);
			};
		});
	const keys = (): Promise<string[]> =>
		new Promise((resolve, reject) => {
			const open = indexedDB.open('ilya-data', 1);
			open.onupgradeneeded = () => open.result.createObjectStore('cache');
			open.onerror = () => reject(open.error);
			open.onsuccess = () => {
				const g = open.result.transaction('cache').objectStore('cache').getAllKeys();
				g.onsuccess = () => resolve(g.result.map(String));
				g.onerror = () => reject(g.error);
			};
		});

	beforeEach(() => {
		globalThis.indexedDB = new IDBFactory();
		// The two background tiers are scheduled on idle; they are not under test.
		vi.stubGlobal('requestIdleCallback', () => 0);
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it('(a) writes the manifest only after the last file’s chunks and meta', async () => {
		const written: string[] = [];
		const put = IDBObjectStore.prototype.put;
		vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, value: unknown, key?: IDBValidKey) {
			written.push(String(key));
			return put.call(this, value, key);
		});
		serve({ manifest: manifestFor('h1') });
		const state = await start();
		expect(state.error).toBeNull();
		await vi.waitFor(async () => expect(await get('ilya-dict-manifest')).toBeTruthy());
		const at = written.indexOf('ilya-dict-manifest');
		expect(at).toBeGreaterThan(written.indexOf('dict-h1-part0-meta'));
		expect(at).toBeGreaterThan(written.indexOf('dict-h1-part1-meta'));
		expect(written.indexOf('dict-h1-part1-meta')).toBeGreaterThan(-1);
	});

	it('(a) stores no manifest when a chunk write fails, so a stored manifest is never ahead of its dictionary', async () => {
		const put = IDBObjectStore.prototype.put;
		vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, value: unknown, key?: IDBValidKey) {
			if (String(key).startsWith('dict-h1-part1-chunk')) throw new Error('quota');
			return put.call(this, value, key);
		});
		serve({ manifest: manifestFor('h1') });
		expect((await start()).error).toBeNull();
		await vi.waitFor(async () => expect(await get('dict-h1-part0-meta')).toBe(1));
		await new Promise((r) => setTimeout(r, 50));
		expect(await get('ilya-dict-manifest')).toBeUndefined();
	});

	it('(b) a failed manifest with a stored one loads the dictionary from IndexedDB', async () => {
		serve({ manifest: manifestFor('h1') });
		expect((await start()).error).toBeNull();
		await vi.waitFor(async () => expect(await get('ilya-dict-manifest')).toBeTruthy());

		serve({ manifest: 'reject' });
		const state = await start();
		expect(state.error).toBeNull();
		expect(state.entryCount).toBe(2);
		expect(calls.some((c) => c.includes('/d1.h1.json') || c.includes('/d2.h1.json'))).toBe(false);
	});

	it('(b) a manifest that answers with an HTTP error also reads the stored one', async () => {
		serve({ manifest: manifestFor('h1') });
		await start();
		await vi.waitFor(async () => expect(await get('ilya-dict-manifest')).toBeTruthy());
		serve({ manifest: 'http500' });
		const state = await start();
		expect(state.error).toBeNull();
		expect(state.entryCount).toBe(2);
	});

	it('(c) a failed manifest with none stored gives the error it gave before', async () => {
		serve({ manifest: 'reject' });
		const state = await start();
		expect(state.error).toMatch(/^Could not load dictionary manifest\./);
		expect(state.entryCount).toBe(0);
	});

	it('(c) a stored value that does not name a dictionary is no manifest', async () => {
		serve({ manifest: manifestFor('h1') });
		await start();
		await vi.waitFor(async () => expect(await get('ilya-dict-manifest')).toBeTruthy());
		await new Promise<void>((resolve) => {
			const open = indexedDB.open('ilya-data', 1);
			open.onsuccess = () => {
				const tx = open.result.transaction('cache', 'readwrite');
				tx.objectStore('cache').put({ hash: 7 }, 'ilya-dict-manifest');
				tx.oncomplete = () => resolve();
			};
		});
		serve({ manifest: 'reject' });
		expect((await start()).error).toMatch(/^Could not load dictionary manifest\./);
	});

	it('(d) a new hash online replaces the stored manifest, and the old dict- keys go', async () => {
		serve({ manifest: manifestFor('h1') });
		await start();
		await vi.waitFor(async () => expect(((await get<{ hash: string }>('ilya-dict-manifest')) ?? { hash: '' }).hash).toBe('h1'));
		serve({ manifest: manifestFor('h2') });
		expect((await start()).error).toBeNull();
		await vi.waitFor(async () => expect(((await get<{ hash: string }>('ilya-dict-manifest')) ?? { hash: '' }).hash).toBe('h2'));
		const left = await keys();
		expect(left.filter((k) => k.startsWith('dict-h1'))).toEqual([]);
		expect(left.filter((k) => k.startsWith('dict-h2')).length).toBeGreaterThan(0);
	});

	it('(e) a rejected fetch of the supplement and the blurb reads the stored copies', async () => {
		serve({ manifest: manifestFor('h1') });
		await start();
		await vi.waitFor(async () => {
			expect(await get('data-singer-supplement')).toBeDefined();
			expect(await get('data-blurb-composer')).toBeDefined();
			expect(await get('ilya-dict-manifest')).toBeTruthy();
		});
		serve({ manifest: manifestFor('h1'), json: 'reject' });
		const state = await start();
		expect(state.error).toBeNull();
		expect(state.entryCount).toBe(2);
	});

	it('(e) with nothing stored, a rejected fetch of the supplement still fails the start', async () => {
		serve({ manifest: manifestFor('h1'), json: 'reject' });
		const state = await start();
		expect(state.error).toBe('Failed to fetch');
	});

	it('(e) a response that is not ok throws, whatever is stored', async () => {
		serve({ manifest: manifestFor('h1') });
		await start();
		await vi.waitFor(async () => {
			expect(await get('data-singer-supplement')).toBeDefined();
			expect(await get('data-blurb-composer')).toBeDefined();
		});
		serve({ manifest: manifestFor('h1'), json: 'http503' });
		const state = await start();
		expect(state.error).toMatch(/^HTTP 503/);
	});
});
