/**
 * Dictionary Loader
 *
 * Orchestrates the full data loading pipeline:
 * 1. Check IndexedDB cache for previously fetched data
 * 2. If not cached, fetch via Web Worker (off main thread)
 * 3. Store decompressed text in IndexedDB for next visit
 * 4. JSON.parse and inject into Phase 1 packages
 *
 * Tiered loading (matching prototype pattern):
 * - Tier 1 (405K lemmas) + supplement + blurb: load immediately in parallel
 * - Tier 2 (887K inflections): lazy load on first interaction or after 5 seconds
 *
 * Failure modes handled:
 * - Worker spawn failure --> falls back to main-thread fetch
 * - IndexedDB unavailable (private browsing) --> skips caching, still loads
 * - Fetch errors --> reports error, engine falls back to inference mode
 * - Worker timeout (30s) --> falls back to main-thread fetch
 * - DecompressionStream unavailable --> reports error with browser guidance
 */

import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { setBlurbData } from '@ilya/blurb';

// -------------------------------------------------------------------
// Configuration
// -------------------------------------------------------------------

const CACHE_VERSION = '2026.3';
const DB_NAME = 'ilya-data';
const STORE_NAME = 'cache';
const WORKER_TIMEOUT_MS = 30_000;

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

interface CacheEntry {
	text: string;
	version: string;
	timestamp: number;
}

export interface LoaderState {
	isLoading: boolean;
	error: string | null;
	entryCount: number;
	durationMs: number;
	tier2Loaded: boolean;
	tier2Count: number;
}

export interface LoaderCallbacks {
	onStateChange: (state: LoaderState) => void;
}

// -------------------------------------------------------------------
// IndexedDB Cache
// -------------------------------------------------------------------

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			request.result.createObjectStore(STORE_NAME);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function getCached(key: string): Promise<string | null> {
	try {
		const db = await openDB();
		return new Promise((resolve) => {
			const tx = db.transaction(STORE_NAME, 'readonly');
			const store = tx.objectStore(STORE_NAME);
			const request = store.get(key);
			request.onsuccess = () => {
				const entry = request.result as CacheEntry | undefined;
				if (entry && entry.version === CACHE_VERSION) {
					resolve(entry.text);
				} else {
					resolve(null);
				}
			};
			request.onerror = () => resolve(null);
		});
	} catch {
		// IndexedDB unavailable (e.g. private browsing)
		return null;
	}
}

async function setCache(key: string, text: string): Promise<void> {
	try {
		const db = await openDB();
		return new Promise((resolve) => {
			const tx = db.transaction(STORE_NAME, 'readwrite');
			const store = tx.objectStore(STORE_NAME);
			store.put(
				{ text, version: CACHE_VERSION, timestamp: Date.now() } satisfies CacheEntry,
				key
			);
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve(); // don't fail on cache write errors
		});
	} catch {
		// IndexedDB unavailable -- silently skip caching
	}
}

// -------------------------------------------------------------------
// Web Worker Management
// -------------------------------------------------------------------

function createWorker(): Worker | null {
	try {
		return new Worker(new URL('./loader-worker.ts', import.meta.url), {
			type: 'module'
		});
	} catch {
		console.warn('[Ilya] Web Worker unavailable, using main-thread fallback');
		return null;
	}
}

function fetchViaWorker(worker: Worker, url: string, key: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error(`Timeout loading ${key} after ${WORKER_TIMEOUT_MS / 1000}s`));
		}, WORKER_TIMEOUT_MS);

		const handler = (event: MessageEvent) => {
			if (event.data.key !== key) return;
			clearTimeout(timer);
			worker.removeEventListener('message', handler);

			if (event.data.type === 'success') {
				resolve(event.data.text);
			} else {
				reject(new Error(event.data.error));
			}
		};

		worker.addEventListener('message', handler);
		worker.postMessage({ type: 'fetch', url, key });
	});
}

// -------------------------------------------------------------------
// Main-Thread Fallback
// -------------------------------------------------------------------

async function fetchDirect(url: string): Promise<string> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	// Check if the server already decompressed the .gz file for us.
	// Vite dev server sets Content-Encoding: gzip, which means the browser
	// transparently decompresses the response. In that case, the body is
	// already plain text and we must NOT run DecompressionStream on it.
	const wasAutoDecompressed = response.headers.get('content-encoding') === 'gzip';

	if (url.endsWith('.gz') && !wasAutoDecompressed) {
		if (typeof DecompressionStream === 'undefined') {
			throw new Error(
				'Your browser does not support DecompressionStream. ' +
					'Please use a recent version of Chrome, Firefox, or Safari.'
			);
		}
		const ds = new DecompressionStream('gzip');
		const stream = response.body!.pipeThrough(ds);
		return new Response(stream).text();
	}

	return response.text();
}

// -------------------------------------------------------------------
// Data File Loading (cache --> worker --> fallback)
// -------------------------------------------------------------------

async function loadDataFile(
	key: string,
	url: string,
	worker: Worker | null
): Promise<Record<string, unknown>> {
	// 1. Check IndexedDB cache
	const cached = await getCached(key);
	if (cached) {
		console.log(`[Ilya] ${key}: loaded from cache`);
		return JSON.parse(cached);
	}

	// 2. Fetch via Worker (or main-thread fallback)
	let text: string;
	if (worker) {
		try {
			text = await fetchViaWorker(worker, url, key);
		} catch (workerError) {
			console.warn(`[Ilya] Worker failed for ${key}, using main thread:`, workerError);
			text = await fetchDirect(url);
		}
	} else {
		text = await fetchDirect(url);
	}

	// 3. Cache for next visit (fire-and-forget)
	setCache(key, text);

	// 4. Parse and return
	console.log(`[Ilya] ${key}: fetched and cached`);
	return JSON.parse(text);
}

// -------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------

/**
 * Load all dictionary data and inject into Phase 1 packages.
 *
 * Call once at app startup. Reports state via callbacks.
 * On failure, the engine's VERIFY cascade handles missing stress data
 * gracefully -- the app remains usable in inference mode.
 */
export async function loadDictionary(callbacks: LoaderCallbacks): Promise<void> {
	const start = performance.now();

	const state: LoaderState = {
		isLoading: true,
		error: null,
		entryCount: 0,
		durationMs: 0,
		tier2Loaded: false,
		tier2Count: 0
	};
	callbacks.onStateChange({ ...state });

	const worker = createWorker();

	try {
		// Load tier 1, supplement, and blurb in parallel
		const [tier1Data, supplementData, blurbData] = await Promise.all([
			loadDataFile('tier1', '/data/ilya_tier1_final.json.gz', worker),
			loadDataFile('supplement', '/data/singer-supplement.json', worker),
			loadDataFile('blurb', '/data/blurb-composer.json', worker)
		]);

		// Inject into Phase 1 packages
		setStressDictionary(tier1Data);
		setSingerSupplement(supplementData);
		setGlossDictionary(tier1Data);
		setBlurbData(blurbData);

		const entryCount = Object.keys(tier1Data).length;
		const durationMs = Math.round(performance.now() - start);

		console.log(
			`[Ilya] ${entryCount.toLocaleString()} words loaded in ${durationMs}ms`
		);

		state.isLoading = false;
		state.entryCount = entryCount;
		state.durationMs = durationMs;
		callbacks.onStateChange({ ...state });

		// Schedule tier 2 lazy loading
		scheduleTier2(worker, tier1Data, state, callbacks);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		console.error('[Ilya] Dictionary loading failed:', message);

		state.isLoading = false;
		state.error = message;
		callbacks.onStateChange({ ...state });

		worker?.terminate();
	}
}

// -------------------------------------------------------------------
// Tier 2: Lazy Loading
// -------------------------------------------------------------------

function scheduleTier2(
	worker: Worker | null,
	dictionary: Record<string, unknown>,
	state: LoaderState,
	callbacks: LoaderCallbacks
): void {
	let triggered = false;

	const triggerLoad = () => {
		if (triggered) return;
		triggered = true;

		// Small delay to ensure UI is fully responsive first
		setTimeout(() => loadTier2(worker, dictionary, state, callbacks), 100);
	};

	// Load on first user interaction
	document.addEventListener('click', triggerLoad, { once: true });
	document.addEventListener('keydown', triggerLoad, { once: true });
	document.addEventListener('paste', triggerLoad, { once: true });

	// Safety: load after 5 seconds regardless
	setTimeout(triggerLoad, 5000);
}

async function loadTier2(
	worker: Worker | null,
	dictionary: Record<string, unknown>,
	state: LoaderState,
	callbacks: LoaderCallbacks
): Promise<void> {
	try {
		const tier2Data = await loadDataFile(
			'tier2',
			'/data/ilya_tier2.json.gz',
			worker
		);

		// Chunked merge: 10K entries per frame to prevent UI jank
		const entries = Object.entries(tier2Data);
		const chunkSize = 10_000;

		for (let i = 0; i < entries.length; i += chunkSize) {
			const chunk = entries.slice(i, i + chunkSize);
			for (const [k, v] of chunk) {
				dictionary[k] = v;
			}
			// Yield to main thread between chunks
			if (i + chunkSize < entries.length) {
				await new Promise((resolve) => requestAnimationFrame(resolve));
			}
		}

		console.log(
			`[Ilya] Tier 2: ${entries.length.toLocaleString()} inflections merged`
		);

		state.tier2Loaded = true;
		state.tier2Count = entries.length;
		callbacks.onStateChange({ ...state });
	} catch (error) {
		console.warn('[Ilya] Tier 2 loading failed:', error);
	} finally {
		worker?.terminate();
	}
}
