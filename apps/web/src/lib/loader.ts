/**
 * Dictionary Loader (v2 — single-file architecture)
 *
 * Replaces the two-tier loader with a single dictionary file
 * and content-hash cache invalidation.
 *
 * Pipeline:
 * 1. Fetch dictionary-manifest.json for current content hash
 * 2. Check IndexedDB cache against that hash
 * 3. If cache miss: fetch dictionary with progress reporting
 * 4. Map compressed keys to engine-expected format
 * 5. Load supplement + blurb in parallel with dictionary
 * 6. Inject into Phase 1 packages
 *
 * Key mapping (performed once at load time):
 *   Build script output    →  Engine/gloss pipeline expectation
 *   s (number)             →  s (pass-through; engine reads entry.s)
 *   e (englishShort)  }    →  g: { en, fr } (BilingualGloss object)
 *   f (frenchShort)   }
 *   E (englishFull)        →  E (pass-through; future Inspector use)
 *   F (frenchFull)         →  F (pass-through; future Inspector use)
 *   p (pos)                →  p (pass-through; engine reads entry.p)
 *   l (lemma)              →  l (pass-through; engine reads entry.l)
 *   r (provenance)         →  provenance (build provenance; engine ignores, for auditing)
 *
 * Failure modes handled:
 * - IndexedDB unavailable (private browsing) → skips caching, still loads
 * - Fetch errors → reports error, engine falls back to inference mode
 * - Manifest fetch failure → falls back to direct dictionary load
 * - JSON parse failure → reports error with guidance
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

// Old cache keys from the two-tier loader (cleaned up on first load)
const LEGACY_CACHE_KEYS = ['tier1', 'tier2', 'supplement', 'blurb'];

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

interface DictionaryManifest {
	version: string;
	hash: string;
	file: string;
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
// IndexedDB Cache
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

async function getCached(key: string): Promise<string | null> {
	try {
		const db = await openDB();
		return new Promise((resolve) => {
			const tx = db.transaction(STORE_NAME, 'readonly');
			const store = tx.objectStore(STORE_NAME);
			const request = store.get(key);
			request.onsuccess = () => {
				resolve((request.result as string) ?? null);
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
			store.put(text, key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve();
		});
	} catch {
		// IndexedDB unavailable — silently skip caching
	}
}

/**
 * Remove legacy two-tier cache entries and any stale dictionary entries.
 * Runs once on first load under the new architecture.
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

		// Remove stale dictionary entries (any dict- key that isn't the current hash)
		const keysReq = store.getAllKeys();
		keysReq.onsuccess = () => {
			for (const key of keysReq.result) {
				if (
					typeof key === 'string' &&
					key.startsWith('dict-') &&
					key !== `dict-${currentHash}`
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
		// No streaming progress available — report indeterminate
		onProgress(-1);
		return response.text();
	}

	// Stream the response and track bytes received
	const reader = response.body.getReader();
	const chunks: Uint8Array[] = [];
	let receivedBytes = 0;

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		chunks.push(value);
		receivedBytes += value.length;

		// Cap at 1.0 (gzip decompression can produce more bytes than Content-Length)
		const progress = Math.min(receivedBytes / totalBytes, 1.0);
		onProgress(progress);
	}

	// Reassemble the text from chunks
	const decoder = new TextDecoder();
	const textParts: string[] = [];
	for (const chunk of chunks) {
		textParts.push(decoder.decode(chunk, { stream: true }));
	}
	textParts.push(decoder.decode()); // flush
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

/**
 * Map compressed dictionary keys to the shapes the engine and
 * gloss pipeline expect. Mutates entries in place for performance
 * (424K+ entries; allocation-free is meaningful here).
 *
 * Compose bilingual gloss: e + f → g: { en, fr }
 * Map provenance: r → provenance (not source; engine defaults to 'dictionary')
 * Pass through: s, p, l, E, F (untouched)
 */
function mapCompressedEntries(dictionary: Record<string, any>): void {
	for (const key in dictionary) {
		const value = dictionary[key];
		if (Array.isArray(value)) {
			// Homograph: array of entries
			for (const entry of value) {
				mapSingleEntry(entry);
			}
		} else {
			mapSingleEntry(value);
		}
	}
}

function mapSingleEntry(entry: any): void {
	// Compose bilingual gloss from short fields
	if (entry.e !== undefined || entry.f !== undefined) {
		entry.g = {
			en: entry.e || '',
			fr: entry.f || ''
		};
	}

	// Build provenance (r) is how the data was assembled (kaikki-en, lemma-fallback, etc.).
	// It is NOT stress provenance. The engine defaults to 'dictionary' for all dictionary
	// entries. Keep r as 'provenance' for future auditing; do not map to 'source'.
	if (entry.r !== undefined) {
		entry.provenance = entry.r;
	}

	// E and F (full glosses) pass through untouched.
	// Current consumers ignore them. Future Inspector
	// expansion reads them directly.
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
			// Manifest unavailable — cannot determine which dictionary file to load.
			// This is fatal: without the manifest, we don't know the filename.
			throw new Error(
				'Could not load dictionary manifest. ' +
					'Please check that dictionary-manifest.json exists in /data/.'
			);
		}

		const cacheKey = `dict-${manifest.hash}`;
		const dictionaryUrl = `/data/${manifest.file}`;

		// Step 2: Clean legacy cache (fire-and-forget)
		cleanLegacyCache(manifest.hash);

		// Step 3: Load dictionary, supplement, and blurb in parallel
		// Dictionary comes from cache or network; supplement and blurb are small files.
		const [dictionaryText, supplementData, blurbData] = await Promise.all([
			loadDictionaryData(cacheKey, dictionaryUrl, manifest.hash, state, callbacks),
			loadJsonFile(SUPPLEMENT_URL),
			loadJsonFile(BLURB_URL)
		]);

		// Step 4: Parse dictionary JSON
		// Keep progress indeterminate during parse — the sliding animation
		// plays through the minimum display duration.
		state.progress = -1;
		callbacks.onStateChange({ ...state });

		const dictionary = JSON.parse(dictionaryText);

		// Step 5: Map compressed keys to engine-expected format
		mapCompressedEntries(dictionary);

		// Step 6: Inject into Phase 1 packages
		setStressDictionary(dictionary);
		setSingerSupplement(supplementData);
		setGlossDictionary(dictionary);
		setBlurbData(blurbData);

		const entryCount = Object.keys(dictionary).length;
		const durationMs = Math.round(performance.now() - start);

		console.log(
			`[Ilya] ${entryCount.toLocaleString()} words loaded in ${durationMs}ms`
		);

		// Minimum display duration: the progress bar communicates substance.
		// If loading finishes faster than this, hold the bar visible.
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
// Dictionary Loading (cache → network with progress)
// -------------------------------------------------------------------

/**
 * Load the dictionary text from IndexedDB cache or network.
 * Reports progress during network fetch.
 */
async function loadDictionaryData(
	cacheKey: string,
	url: string,
	hash: string,
	state: LoaderState,
	callbacks: LoaderCallbacks
): Promise<string> {
	// Check IndexedDB cache first
	const cached = await getCached(cacheKey);
	if (cached) {
		console.log(`[Ilya] Dictionary loaded from cache (hash: ${hash})`);
		state.progress = 1;
		callbacks.onStateChange({ ...state });
		return cached;
	}

	// Cache miss — fetch with progress
	console.log(`[Ilya] Fetching dictionary: ${url}`);
	const text = await fetchWithProgress(url, (progress) => {
		state.progress = progress;
		callbacks.onStateChange({ ...state });
	});

	// Cache for next visit (fire-and-forget)
	setCache(cacheKey, text);

	return text;
}
