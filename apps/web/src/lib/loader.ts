/**
 * Dictionary Loader (v3 — NDJSON streaming architecture)
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
 * Format detection: first character of dictionary text
 *   '[' → NDJSON (v3 build, streaming parse)
 *   '{' → legacy JSON (v2 build, single parse — fallback only)
 *
 * Key mapping (performed per-entry during parse):
 *   Build script output    →  Engine/gloss pipeline expectation
 *   s (number)             →  s (pass-through; engine reads entry.s)
 *   e (englishShort)  }    →  g: { en, fr } (BilingualGloss object)
 *   f (frenchShort)   }
 *   E (englishFull)        →  E (pass-through; future Inspector use)
 *   F (frenchFull)         →  F (pass-through; future Inspector use)
 *   p (pos)                →  p (pass-through; engine reads entry.p)
 *   l (lemma)              →  l (pass-through; engine reads entry.l)
 *   r (provenance)         →  provenance (build provenance; engine ignores)
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

		// Remove stale dictionary entries
		// Keep anything that starts with dict-{currentHash} (chunks + meta)
		// Delete everything else that starts with dict-
		const keysReq = store.getAllKeys();
		keysReq.onsuccess = () => {
			for (const key of keysReq.result) {
				if (
					typeof key === 'string' &&
					key.startsWith('dict-') &&
					!key.startsWith(`dict-${currentHash}`)
				) {
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

async function loadJsonFile(url: string): Promise<Record<string, unknown>> {
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

	// Build provenance (r) is how the data was assembled (kaikki-en, lemma-fallback, etc.).
	// It is NOT stress provenance. Keep as 'provenance' for auditing.
	if (entry.r !== undefined) {
		entry.provenance = entry.r;
	}

	// E and F (full glosses) pass through untouched.
}

// -------------------------------------------------------------------
// NDJSON Parser — streaming, with event loop yields
// -------------------------------------------------------------------

/**
 * Parse a dictionary from an array of NDJSON lines.
 * Each line is: ["word", {compressed entry}]
 *
 * Yields to the event loop every CHUNK_SIZE entries to prevent
 * the long-running-script kill on mobile browsers.
 *
 * Applies mapSingleEntry() per entry during parse — no separate pass needed.
 */
async function parseNDJSON(
	lines: string[],
	onProgress: (progress: number) => void
): Promise<Record<string, any>> {
	const dictionary: Record<string, any> = {};
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

	return dictionary;
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

		// Step 3: Load dictionary files sequentially, supplement and blurb in parallel
		// Sequential fetch keeps mobile heap flat — no concurrent 75 MB buffers.
		let dictionaryLines: string[] = [];
		for (let i = 0; i < dictionaryFiles.length; i++) {
			const file = dictionaryFiles[i];
			const url = `/data/${file}`;
			// Each file gets its own cache key so the second file is not
			// served from the first file's cached data.
			const fileCacheKey = dictionaryFiles.length > 1
				? `${cacheKey}-part${i}`
				: cacheKey;
			const lines = await loadDictionaryData(fileCacheKey, url, state, callbacks);
			dictionaryLines = dictionaryLines.concat(lines);
		}

		const [supplementData, blurbData] = await Promise.all([
			loadJsonFile(SUPPLEMENT_URL),
			loadJsonFile(BLURB_URL)
		]);

		// Step 4: Parse dictionary — line-by-line with event loop yields
		state.progress = -1;
		callbacks.onStateChange({ ...state });

		const dictionary = await parseNDJSON(dictionaryLines, (progress) => {
			state.progress = progress;
			callbacks.onStateChange({ ...state });
		});

		// Step 5: Inject into Phase 1 packages
		setStressDictionary(dictionary);
		setSingerSupplement(supplementData);
		setGlossDictionary(dictionary);
		setBlurbData(blurbData);

		const entryCount = Object.keys(dictionary).length;
		const durationMs = Math.round(performance.now() - start);

		// Minimum display duration: the progress bar communicates substance.
		const MIN_DISPLAY_MS = 3000;
		const elapsed = performance.now() - start;
		if (elapsed < MIN_DISPLAY_MS) {
			await new Promise((r) => setTimeout(r, MIN_DISPLAY_MS - elapsed));
		}

		state.isLoading = false;
		state.entryCount = entryCount;
		state.durationMs = durationMs;
		state.progress = 1;
		callbacks.onStateChange({ ...state });
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
 * Returns an array of NDJSON lines ready for parseNDJSON().
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
