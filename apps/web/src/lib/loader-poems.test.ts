/**
 * The poem library through `loadDictionary` (poem library, build 1, step 2).
 *
 * Drives the exported `loadDictionary` and `poemLibrary` with a stubbed `fetch`
 * and `fake-indexeddb`, as `loader.test.ts` does for N.195. `poemLibrary` is one
 * promise per module instance, so each test imports a fresh `./loader`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import type { PoemEntry, PoemLibrary } from './text/poem-library';

const NDJSON = (...words: string[]) => words.map((w) => JSON.stringify([w, { s: 1, e: 'x', f: 'y', p: 'noun', l: w }])).join('\n');
const HASH = 'abc12345';
const POEM_HASH = 'deadbeef';
const POEM_FILE = `dictionary.poems.${POEM_HASH}.json`;

const entry: PoemEntry = {
	id: 'e1',
	work: 'w1',
	title: 'Весёлый час',
	incipit: 'Дайте бокалы!',
	author: 'Алексей Васильевич Кольцов',
	translator: null,
	source: { site: 'Russian Wikisource', url: 'https://ru.wikisource.org/w/index.php?oldid=1' },
	spelling: 'modern',
	textModern: 'Дайте вина',
	letters: 'даитевина',
	at: [0, 1, 1, 1, 1, 1, 2, 1, 1],
};
const poems: PoemLibrary = { version: 1, entries: [entry] };

type Manifest = Record<string, unknown>;
const manifestWithPoems = (): Manifest => ({ version: 't', hash: HASH, files: [`d1.${HASH}.json`], glossFiles: [`g.${HASH}.json`], poemFiles: [POEM_FILE], poemHash: POEM_HASH });

describe('the poem library through loadDictionary', () => {
	let fetched: string[];
	let poemResponse: () => Response | Promise<Response>;
	let manifest: Manifest | 'reject';

	function serve() {
		fetched = [];
		vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
			const path = new URL(String(input), 'http://x').pathname;
			fetched.push(path);
			const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
			if (path.endsWith('dictionary-manifest.json')) {
				if (manifest === 'reject') throw new TypeError('Failed to fetch');
				return json(manifest);
			}
			if (path.endsWith('singer-supplement.json') || path.endsWith('blurb-composer.json') || path.endsWith('homographs.json')) return json({});
			if (path.endsWith(POEM_FILE)) return poemResponse();
			return new Response(NDJSON('гора', 'горе'), { status: 200 });
		});
	}

	/** A fresh `./loader`, started; the idle callback runs on the next tick. */
	async function start() {
		vi.resetModules();
		const loader = await import('./loader');
		let last: { error: string | null } = { error: null };
		await loader.loadDictionary({ onStateChange: (s) => (last = s) });
		return { loader, state: last };
	}

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
	const put = (key: string, value: unknown): Promise<void> =>
		new Promise((resolve, reject) => {
			const open = indexedDB.open('ilya-data', 1);
			open.onupgradeneeded = () => open.result.createObjectStore('cache');
			open.onerror = () => reject(open.error);
			open.onsuccess = () => {
				const tx = open.result.transaction('cache', 'readwrite');
				tx.objectStore('cache').put(value, key);
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error);
			};
		});

	beforeEach(() => {
		globalThis.indexedDB = new IDBFactory();
		manifest = manifestWithPoems();
		poemResponse = () => new Response(JSON.stringify(poems), { status: 200 });
		// The idle callbacks run on the next tick, so the tiers load as they do in the app.
		vi.stubGlobal('requestIdleCallback', (cb: () => void) => setTimeout(cb, 0));
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it('does not fetch the poem file before the app is interactive: the dictionary state is final first', async () => {
		serve();
		const { state } = await start();
		expect(state.error).toBeNull();
		expect(fetched.some((p) => p.endsWith(POEM_FILE))).toBe(false);
	});

	it('resolves the library after the tier loads, and keeps it under poems-<poemHash>', async () => {
		serve();
		const { loader } = await start();
		expect(await loader.poemLibrary).toEqual(poems);
		expect(fetched.filter((p) => p.endsWith(POEM_FILE))).toHaveLength(1);
		await vi.waitFor(async () => expect(await keys()).toContain(`poems-${POEM_HASH}`));
	});

	it('reads the kept copy when the file cannot be fetched (a start offline)', async () => {
		await put(`poems-${POEM_HASH}`, poems);
		poemResponse = () => {
			throw new TypeError('Failed to fetch');
		};
		serve();
		const { loader } = await start();
		expect(await loader.poemLibrary).toEqual(poems);
		expect(fetched.some((p) => p.endsWith(POEM_FILE))).toBe(false);
	});

	it('resolves null, with the dictionary unharmed, when the file is missing', async () => {
		poemResponse = () => new Response('', { status: 404 });
		serve();
		const { loader, state } = await start();
		expect(state.error).toBeNull();
		expect(await loader.poemLibrary).toBeNull();
		expect(await keys()).not.toContain(`poems-${POEM_HASH}`);
	});

	it('resolves null when the manifest names no library', async () => {
		manifest = { version: 't', hash: HASH, files: [`d1.${HASH}.json`] };
		serve();
		const { loader, state } = await start();
		expect(state.error).toBeNull();
		expect(await loader.poemLibrary).toBeNull();
		expect(fetched.some((p) => p.includes('poems'))).toBe(false);
	});

	it('resolves null when the dictionary itself fails to load, so nothing waits on it', async () => {
		manifest = 'reject';
		serve();
		const { loader, state } = await start();
		expect(state.error).not.toBeNull();
		expect(await loader.poemLibrary).toBeNull();
	});

	it('cleanLegacyCache sweeps the poem keys of an earlier build and keeps the current one', async () => {
		await put('poems-0ldhash1', poems);
		await put('poems-0ldhash2', poems);
		await put(`poems-${POEM_HASH}`, poems);
		await put('dict-keepme', 1); // a key outside the poem prefix is not this sweep's to judge
		serve();
		const { loader } = await start();
		await loader.poemLibrary;
		await vi.waitFor(async () => {
			const k = await keys();
			expect(k).not.toContain('poems-0ldhash1');
			expect(k).not.toContain('poems-0ldhash2');
			expect(k).toContain(`poems-${POEM_HASH}`);
		});
	});

	it('sweeps every poem key when the manifest names no library', async () => {
		await put('poems-0ldhash1', poems);
		manifest = { version: 't', hash: HASH, files: [`d1.${HASH}.json`] };
		serve();
		const { loader } = await start();
		await loader.poemLibrary;
		await vi.waitFor(async () => expect(await keys()).not.toContain('poems-0ldhash1'));
	});
});
