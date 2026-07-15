/**
 * Dictionary Loader (v4 — incremental merge architecture)
 *
 * Replaces the single JSON.parse() call with a line-by-line NDJSON parser
 * that yields to the event loop every CHUNK_SIZE entries. IndexedDB writes
 * are chunked to the same size. This keeps the mobile heap flat and prevents
 * the long-running-script kill that crashed iOS Safari and Android Chrome.
 *
 * Pipeline:
 * 1. Fetch dictionary-manifest.json for current content hash
 * 2. Check IndexedDB chunked cache against that hash
 * 3. If cache miss: fetch dictionary with progress reporting
 * 4. Parse NDJSON line-by-line, mapping compressed keys as we go
 * 5. Write parsed chunks to IndexedDB between event loop yields
 * 6. Load supplement + blurb in parallel with dictionary
 * 7. Inject into Phase 1 packages
 *
 * v4 change: parse each file immediately after fetch into a shared
 * dictionary object (mergeNDJSON), then discard raw lines before
 * fetching the next file. This halves peak heap on iOS Safari.
 *
 * Format detection: first character of dictionary text
 *   '[' → NDJSON (v3 build, streaming parse)
 *   '{' → legacy JSON (v2 build, single parse — fallback only)
 *
 * Key mapping (performed per-entry during parse):
 *   Build script output    →  Engine/gloss pipeline expectation
 *   s (number)             →  s (pass-through; engine reads entry.s)
 *   e (englishShort)  }    →  g: { en, fr } (BilingualGloss object)
 *   f (frenchShort)   }
 *   E (englishFull)        →  E (lazy gloss tier; merged in background)
 *   F (frenchFull)         →  F (lazy gloss tier; merged in background)
 *   p (pos)                →  p (pass-through; engine reads entry.p)
 *   l (lemma)              →  l (pass-through; engine reads entry.l)
 *
 * Tier 2 (2026-06): the build provenance field (r) is no longer shipped;
 * full glosses (E/F) live in a separate gloss tier listed in the manifest
 * as glossFiles, fetched in the background after the app is interactive
 * and merged into entries in place. Inspector/pipeline fall back to short
 * glosses (entry.F || entry.f) until the merge lands.
 *
 * Failure modes handled:
 * - IndexedDB unavailable (private browsing) → skips caching, still loads
 * - Fetch errors → reports error, engine falls back to inference mode
 * - Manifest fetch failure → fatal (cannot determine dictionary filename)
 * - Malformed NDJSON lines → skipped silently
 */

import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { setBlurbData } from '@ilya/blurb';
import type { BlurbData } from '@ilya/blurb';

// -------------------------------------------------------------------
// Configuration
// -------------------------------------------------------------------

const DB_NAME = 'ilya-data';
const STORE_NAME = 'cache';
const MANIFEST_URL = '/data/dictionary-manifest.json';
const SUPPLEMENT_URL = '/data/singer-supplement.json';
const BLURB_URL = '/data/blurb-composer.json';
const CACHE_HASH_KEY = 'ilya-dict-hash';

// Number of NDJSON entries per IndexedDB transaction and per event loop yield
const CHUNK_SIZE = 1500;

// Old cache keys from the two-tier loader (cleaned up on first load)
const LEGACY_CACHE_KEYS = ['tier1', 'tier2', 'supplement', 'blurb'];

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

interface DictionaryManifest {
	version: string;
	hash: string;
	file?: string;
	files?: string[];
	/** Lazy gloss tier (Tier 2): full E/F glosses, fetched after interactive */
	glossFiles?: string[];
}

export interface LoaderState {
	isLoading: boolean;
	error: string | null;
	entryCount: number;
	durationMs: number;
	/** Fetch progress: 0 to 1 when determinable, -1 for indeterminate */
	progress: number;
}

export interface LoaderCallbacks {
	onStateChange: (state: LoaderState) => void;
}

// -------------------------------------------------------------------
// IndexedDB — core
// -------------------------------------------------------------------

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME);
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

// -------------------------------------------------------------------
// IndexedDB — chunked cache (v3)
//
// Stores the dictionary as N chunks of CHUNK_SIZE NDJSON lines each.
// Keys:  dict-{hash}-chunk-0, dict-{hash}-chunk-1, ...
// Meta:  dict-{hash}-meta  → total chunk count (number)
//
// Each chunk is a string: CHUNK_SIZE lines joined by '\n'.
// Individual transactions are ~240 KB each — well within mobile IDB limits.
// -------------------------------------------------------------------

async function setCacheChunked(baseKey: string, lines: string[]): Promise<void> {
	try {
		const db = await openDB();
		const totalChunks = Math.ceil(lines.length / CHUNK_SIZE);

		for (let i = 0; i < totalChunks; i++) {
			const chunk = lines.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE).join('\n');
			await new Promise<void>((resolve) => {
				const tx = db.transaction(STORE_NAME, 'readwrite');
				tx.objectStore(STORE_NAME).put(chunk, `${baseKey}-chunk-${i}`);
				tx.oncomplete = () => resolve();
				tx.onerror = () => resolve();
			});
			// Yield between chunk writes so we don't block the event loop
			await new Promise((r) => setTimeout(r, 0));
		}

		// Write meta last — its presence signals a complete cache write
		await new Promise<void>((resolve) => {
			const tx = db.transaction(STORE_NAME, 'readwrite');
			tx.objectStore(STORE_NAME).put(totalChunks, `${baseKey}-meta`);
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve();
		});
	} catch {
		// IndexedDB unavailable — silently skip caching
	}
}

async function getCachedChunked(baseKey: string): Promise<string[] | null> {
	try {
		const db = await openDB();

		// Read meta first — if absent, cache is incomplete or missing
		const totalChunks = await new Promise<number | null>((resolve) => {
			const tx = db.transaction(STORE_NAME, 'readonly');
			const req = tx.objectStore(STORE_NAME).get(`${baseKey}-meta`);
			req.onsuccess = () =>
				resolve(typeof req.result === 'number' ? req.result : null);
			req.onerror = () => resolve(null);
		});

		if (!totalChunks) return null;

		// Read each chunk and reassemble into a lines array
		const allLines: string[] = [];
		for (let i = 0; i < totalChunks; i++) {
			const chunk = await new Promise<string | null>((resolve) => {
				const tx = db.transaction(STORE_NAME, 'readonly');
				const req = tx.objectStore(STORE_NAME).get(`${baseKey}-chunk-${i}`);
				req.onsuccess = () =>
					resolve(typeof req.result === 'string' ? req.result : null);
				req.onerror = () => resolve(null);
			});
			if (chunk === null) return null; // incomplete write — force re-fetch
			allLines.push(...chunk.split('\n'));
		}

		return allLines;
	} catch {
		return null;
	}
}

// -------------------------------------------------------------------
// IndexedDB — legacy single-key cache (read-only, for backwards compat)
// -------------------------------------------------------------------

async function getCachedLegacy(key: string): Promise<string | null> {
	try {
		const db = await openDB();
		return new Promise((resolve) => {
			const tx = db.transaction(STORE_NAME, 'readonly');
			const req = tx.objectStore(STORE_NAME).get(key);
			req.onsuccess = () => resolve((req.result as string) ?? null);
			req.onerror = () => resolve(null);
		});
	} catch {
		return null;
	}
}

// -------------------------------------------------------------------
// IndexedDB — cleanup
// -------------------------------------------------------------------

/**
 * Remove legacy two-tier cache entries and any stale dictionary chunks.
 * Uses startsWith(dict-{currentHash}) so we preserve all chunks for the
 * current hash (chunk-0, chunk-1, ..., meta) while deleting old hashes.
 */
async function cleanLegacyCache(currentHash: string): Promise<void> {
	try {
		const db = await openDB();
		const tx = db.transaction(STORE_NAME, 'readwrite');
		const store = tx.objectStore(STORE_NAME);

		// Remove old two-tier keys
		for (const key of LEGACY_CACHE_KEYS) {
			store.delete(key);
		}

		// Remove stale dictionary and gloss-tier entries
		// Keep anything that starts with dict-{currentHash} or gloss-{currentHash}
		// (chunks + meta); delete everything else under those prefixes.
		const keysReq = store.getAllKeys();
		keysReq.onsuccess = () => {
			for (const key of keysReq.result) {
				if (typeof key !== 'string') continue;
				const staleDict =
					key.startsWith('dict-') && !key.startsWith(`dict-${currentHash}`);
				const staleGloss =
					key.startsWith('gloss-') && !key.startsWith(`gloss-${currentHash}`);
				if (staleDict || staleGloss) {
					store.delete(key);
				}
			}
		};

		await new Promise<void>((resolve) => {
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve();
		});
	} catch {
		// Non-critical cleanup — silently skip
	}
}

// -------------------------------------------------------------------
// Manifest
// -------------------------------------------------------------------

async function fetchManifest(): Promise<DictionaryManifest> {
	const response = await fetch(MANIFEST_URL, { cache: 'no-cache' });
	if (!response.ok) {
		throw new Error(`Manifest fetch failed: HTTP ${response.status}`);
	}
	return response.json();
}

// -------------------------------------------------------------------
// Fetch with Progress
// -------------------------------------------------------------------

/**
 * Fetch a URL and report download progress via callback.
 * Uses ReadableStream byte counting when Content-Length is available.
 * Falls back to indeterminate progress (-1) otherwise.
 */
async function fetchWithProgress(
	url: string,
	onProgress: (progress: number) => void
): Promise<string> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	// Content-Length may be absent with chunked/gzip transfer
	const contentLength = response.headers.get('content-length');
	const totalBytes = contentLength ? parseInt(contentLength, 10) : null;

	if (!response.body || !totalBytes) {
		onProgress(-1);
		return response.text();
	}

	const reader = response.body.getReader();
	const chunks: Uint8Array[] = [];
	let receivedBytes = 0;

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
		receivedBytes += value.length;
		onProgress(Math.min(receivedBytes / totalBytes, 1.0));
	}

	const decoder = new TextDecoder();
	const textParts: string[] = [];
	for (const chunk of chunks) {
		textParts.push(decoder.decode(chunk, { stream: true }));
	}
	textParts.push(decoder.decode());
	return textParts.join('');
}

// -------------------------------------------------------------------
// Simple File Loading (supplement, blurb)
// -------------------------------------------------------------------

async function loadJsonFile<T = Record<string, unknown>>(url: string): Promise<T> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText} (${url})`);
	}
	return response.json();
}

// -------------------------------------------------------------------
// Entry Mapping: Compressed Keys → Engine-Expected Format
// -------------------------------------------------------------------

function mapSingleEntry(entry: any): void {
	// Compose bilingual gloss from short fields
	if (entry.e !== undefined || entry.f !== undefined) {
		entry.g = {
			en: entry.e || '',
			fr: entry.f || ''
		};
	}

	// E and F (full glosses) arrive later via the lazy gloss tier and are
	// merged in place by mergeGlossTier(). Nothing to map here.
}

// -------------------------------------------------------------------
// NDJSON Parser — streaming, incremental merge, with event loop yields
// -------------------------------------------------------------------

/**
 * Parse NDJSON lines and merge entries into an existing dictionary object.
 * Each line is: ["word", {compressed entry}]
 *
 * v4: writes into a caller-supplied object rather than returning a new one.
 * This allows the caller to discard the raw lines array after each file,
 * enabling GC between file loads and halving peak heap on iOS Safari.
 *
 * Yields to the event loop every CHUNK_SIZE entries to prevent
 * the long-running-script kill on mobile browsers.
 *
 * Applies mapSingleEntry() per entry during parse — no separate pass needed.
 */
async function mergeNDJSON(
	lines: string[],
	dictionary: Record<string, any>,
	onProgress: (progress: number) => void
): Promise<void> {
	const total = lines.length;

	for (let i = 0; i < total; i++) {
		const line = lines[i];
		if (!line.trim()) continue;
		try {
			const [word, entry] = JSON.parse(line);
			mapSingleEntry(entry);
			dictionary[word] = entry;
		} catch {
			// Skip malformed lines silently
		}

		// Yield every CHUNK_SIZE entries
		if (i > 0 && i % CHUNK_SIZE === 0) {
			onProgress(-1);
			await new Promise((r) => setTimeout(r, 0));
		}
	}
}

// -------------------------------------------------------------------
// Gloss tier (Tier 2) — lazy background load of full glosses
// -------------------------------------------------------------------

/**
 * Merge gloss-tier NDJSON lines into the live dictionary in place.
 * Each line is: ["word", { E?, F? }]
 *
 * Entries are mutated directly. Both @ilya/phonology and @ilya/dictionary
 * hold the same dictionary object by reference, so merged full glosses
 * become visible everywhere without re-injection. Words absent from the
 * dictionary (none expected) are skipped silently.
 *
 * Yields to the event loop every CHUNK_SIZE entries, same as mergeNDJSON.
 */
async function mergeGlossTier(
	lines: string[],
	dictionary: Record<string, any>
): Promise<void> {
	const total = lines.length;
	for (let i = 0; i < total; i++) {
		const line = lines[i];
		if (!line.trim()) continue;
		try {
			const [word, gloss] = JSON.parse(line);
			const entry = dictionary[word];
			if (entry) {
				if (gloss.E !== undefined) entry.E = gloss.E;
				if (gloss.F !== undefined) entry.F = gloss.F;
			}
		} catch {
			// Skip malformed lines silently
		}
		if (i > 0 && i % CHUNK_SIZE === 0) {
			await new Promise((r) => setTimeout(r, 0));
		}
	}
}

/**
 * Fetch and merge the lazy gloss tier listed in the manifest.
 * Cache keys: gloss-{hash}-part{i} (chunked, same machinery as the
 * core dictionary). Failures are non-fatal: the app keeps running on
 * short glosses, and the next visit retries.
 */
async function loadGlossTier(
	manifest: DictionaryManifest,
	dictionary: Record<string, any>
): Promise<void> {
	const glossFiles = manifest.glossFiles ?? [];
	for (let i = 0; i < glossFiles.length; i++) {
		const cacheKey = `gloss-${manifest.hash}-part${i}`;

		let lines = await getCachedChunked(cacheKey);
		if (!lines) {
			const response = await fetch(`/data/${glossFiles[i]}`);
			if (!response.ok) {
				throw new Error(`Gloss tier fetch failed: HTTP ${response.status}`);
			}
			const text = await response.text();
			lines = text.split(/\r?\n/).filter((l) => l.trim());
			// Cache in the background
			setCacheChunked(cacheKey, lines);
		}

		await mergeGlossTier(lines, dictionary);
		// lines goes out of scope here — eligible for GC before next fetch
	}
}

/**
 * Schedule the gloss tier to load after the app is interactive.
 * Uses requestIdleCallback where available, with a setTimeout fallback.
 */
function scheduleGlossTier(
	manifest: DictionaryManifest,
	dictionary: Record<string, any>
): void {
	if (!manifest.glossFiles || manifest.glossFiles.length === 0) return;

	const start = () => {
		loadGlossTier(manifest, dictionary).catch((err) => {
			console.warn('[Ilya] Gloss tier load failed (short glosses remain in use):', err);
		});
	};

	if (typeof requestIdleCallback === 'function') {
		requestIdleCallback(start, { timeout: 5000 });
	} else {
		setTimeout(start, 1500);
	}
}

// -------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------

/**
 * Load all dictionary data and inject into Phase 1 packages.
 *
 * Call once at app startup. Reports state via callbacks.
 * On failure, the engine's VERIFY cascade handles missing stress data
 * gracefully — the app remains usable in inference mode.
 */
export async function loadDictionary(callbacks: LoaderCallbacks): Promise<void> {
	const start = performance.now();

	const state: LoaderState = {
		isLoading: true,
		error: null,
		entryCount: 0,
		durationMs: 0,
		progress: 0
	};
	callbacks.onStateChange({ ...state });

	try {
		// Step 1: Fetch manifest for current content hash
		let manifest: DictionaryManifest;
		try {
			manifest = await fetchManifest();
		} catch (manifestError) {
			throw new Error(
				'Could not load dictionary manifest. ' +
					'Please check that dictionary-manifest.json exists in /data/.'
			);
		}

		const cacheKey = `dict-${manifest.hash}`;

		// Support both single-file (file) and split-file (files) manifest formats
		const dictionaryFiles: string[] = manifest.files
			? manifest.files
			: manifest.file
				? [manifest.file]
				: [];

		if (dictionaryFiles.length === 0) {
			throw new Error('Dictionary manifest contains no file references.');
		}

		// Step 2: Clean legacy cache (fire-and-forget)
		cleanLegacyCache(manifest.hash);

		// Step 3: Load and parse each dictionary file immediately after fetch.
		// Parsing into a shared object before fetching the next file allows
		// the raw lines array to be GC'd, halving peak heap on iOS Safari.
		const dictionary: Record<string, any> = {};

		for (let i = 0; i < dictionaryFiles.length; i++) {
			const file = dictionaryFiles[i];
			const url = `/data/${file}`;
			const fileCacheKey = dictionaryFiles.length > 1
				? `${cacheKey}-part${i}`
				: cacheKey;

			const lines = await loadDictionaryData(fileCacheKey, url, state, callbacks);

			state.progress = -1;
			callbacks.onStateChange({ ...state });
			
			await mergeNDJSON(lines, dictionary, (progress) => {
				state.progress = progress;
				callbacks.onStateChange({ ...state });
			});
			// lines goes out of scope here — eligible for GC before next fetch
		}

		const [supplementData, blurbData] = await Promise.all([
			loadJsonFile(SUPPLEMENT_URL),
			loadJsonFile<BlurbData>(BLURB_URL)
		]);

		// Step 4: Inject into Phase 1 packages
		setStressDictionary(dictionary);
		setSingerSupplement(supplementData);
		setGlossDictionary(dictionary);
		setBlurbData(blurbData);

		const entryCount = Object.keys(dictionary).length;
		const durationMs = Math.round(performance.now() - start);

		state.isLoading = false;
		state.entryCount = entryCount;
		state.durationMs = durationMs;
		state.progress = 1;
		callbacks.onStateChange({ ...state });

		// Tier 2: schedule the lazy gloss tier (full E/F glosses) now that
		// the app is interactive. Non-blocking; failures are non-fatal.
		scheduleGlossTier(manifest, dictionary);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		console.error('[Ilya] Dictionary loading failed:', message);

		state.isLoading = false;
		state.error = message;
		state.progress = 0;
		callbacks.onStateChange({ ...state });
	}
}

// -------------------------------------------------------------------
// Dictionary Loading (chunked cache → network with progress)
// -------------------------------------------------------------------

/**
 * Load dictionary lines from IndexedDB chunked cache or network.
 * Returns an array of NDJSON lines ready for mergeNDJSON().
 *
 * Cache read path: chunked IDB (v3) → legacy single-key IDB (v2) → network
 * Cache write path: chunked IDB only (v3)
 */
async function loadDictionaryData(
	cacheKey: string,
	url: string,
	state: LoaderState,
	callbacks: LoaderCallbacks
): Promise<string[]> {
	// Try chunked cache first (v3)
	const cachedLines = await getCachedChunked(cacheKey);
	if (cachedLines) {
		state.progress = 1;
		callbacks.onStateChange({ ...state });
		return cachedLines;
	}

	// Try legacy single-key cache (v2 — handles existing installations)
	const legacyText = await getCachedLegacy(cacheKey);
	if (legacyText) {
		state.progress = 1;
		callbacks.onStateChange({ ...state });
		const lines = legacyText.split(/\r?\n/).filter((l) => l.trim());
		// Migrate to chunked cache in the background
		setCacheChunked(cacheKey, lines);
		return lines;
	}

	// Cache miss — fetch with progress
	const text = await fetchWithProgress(url, (progress) => {
		state.progress = progress;
		callbacks.onStateChange({ ...state });
	});

	const lines = text.split(/\r?\n/).filter((l) => l.trim());

	// Write to chunked cache in the background
	setCacheChunked(cacheKey, lines);

	return lines;
}
