/**
 * poem-library.ts: the poem library as the app holds it (poem library, build 1,
 * step 2; brief `docs/sessions/brief-code-poem-library-build1_r3_2026-11-03.md`).
 *
 * The data is built by `scripts/build-poem-library.mjs` into
 * `data/dictionary.poems.<hash8>.json` and named in the manifest by `poemFiles`
 * and `poemHash`. This file holds its shape, the check a file passes before the
 * app trusts it, and how it is brought in: from IndexedDB when this device has
 * kept it, else fetched once and kept. It holds no DOM and no IndexedDB of its
 * own: `lib/loader.ts` hands it the three things it needs (`PoemIO`), so a test
 * drives every path without a browser.
 *
 * A LIBRARY THAT CANNOT BE HAD LEAVES THE APP AS IT IS TODAY. `loadPoemLibrary`
 * never throws and never says anything to the singer: no file named, a
 * file that does not arrive, a stored copy that fails the check, all answer
 * `null`, and the callers treat `null` as "no poem to offer".
 *
 * THE FILE IS NAMED BY ITS CONTENT. `poemHash` is the hash of the file's text, so
 * a copy kept under `poems-<poemHash>` is the file and is read before the
 * network is. DESK DEFAULT (mine), reversible: the brief reads "fetch it in the
 * background... read it from there when offline"; reading the kept copy first
 * is the same offline and spares an online start a 131 KB fetch it already has.
 */

/** One poem as the build ships it. `at` is delta-coded; `decodeOffsets` restores the offsets. */
export interface PoemEntry {
	id: string;
	/** Entries of one work share it (a pre-reform and a modern text of one poem). */
	work: string;
	title: string;
	incipit: string;
	/** The full name, as the data prints it. */
	author: string;
	/** Set when the Russian is a translator's; null otherwise. */
	translator: string | null;
	source: { site: string; url: string };
	spelling: 'modern' | 'pre-reform';
	textModern: string;
	/** The folded letters of `textModern` (the matcher's alphabet). */
	letters: string;
	/** Where each letter stands in `textModern`, delta-coded: the first offset, then each distance from the one before. */
	at: number[];
}

export interface PoemLibrary {
	version: 1;
	entries: PoemEntry[];
}

/**
 * The library as the loader hands it out: the file's content, and the hash that names it (`poemHash`).
 * A song's `poemSource` stores that hash, so the offsets it keeps are known to belong to this file or not.
 */
export interface LoadedPoemLibrary extends PoemLibrary {
	hash: string;
}

/** The part of the dictionary manifest this reads. */
export interface PoemManifest {
	poemFiles?: string[];
	poemHash?: string;
}

/** What `lib/loader.ts` lends: the same three things its other files use. */
export interface PoemIO {
	fetchFile: (url: string) => Promise<Response>;
	getStored: <T>(key: string) => Promise<T | null>;
	setStored: (key: string, value: unknown) => Promise<boolean>;
}

/** Every IndexedDB key this library uses starts with this; `cleanLegacyCache` sweeps by it. */
export const POEM_KEY_PREFIX = 'poems-';
export const poemStoreKey = (poemHash: string): string => `${POEM_KEY_PREFIX}${poemHash}`;

/** Offsets from the delta-coded `at`. The inverse of the build's `encodeOffsets`. */
export function decodeOffsets(at: readonly number[]): number[] {
	const out: number[] = [];
	let here = 0;
	for (const d of at) {
		here += d;
		out.push(here);
	}
	return out;
}

const isText = (v: unknown): v is string => typeof v === 'string' && v !== '';

function isEntry(v: unknown): v is PoemEntry {
	const e = v as PoemEntry | null;
	if (!e || typeof e !== 'object') return false;
	if (![e.id, e.work, e.title, e.incipit, e.author, e.textModern].every(isText)) return false;
	if (e.translator !== null && !isText(e.translator)) return false;
	if (!e.source || !isText(e.source.site) || !isText(e.source.url)) return false;
	if (e.spelling !== 'modern' && e.spelling !== 'pre-reform') return false;
	if (typeof e.letters !== 'string' || !Array.isArray(e.at) || e.at.length !== e.letters.length) return false;
	// Every offset lands inside the text: a map that points outside it would cut a stanza from nothing.
	let here = 0;
	for (const d of e.at) {
		if (!Number.isInteger(d) || d < 0) return false;
		here += d;
		if (here >= e.textModern.length) return false;
	}
	return true;
}

/** The check a file passes before the app trusts it: its shape, and that each entry's map fits its text. */
export function isPoemLibrary(v: unknown): v is PoemLibrary {
	const lib = v as PoemLibrary | null;
	return !!lib && typeof lib === 'object' && lib.version === 1 && Array.isArray(lib.entries) && lib.entries.length > 0 && lib.entries.every(isEntry);
}

/**
 * The library for a manifest, or `null`. Reads the copy this device kept under
 * `poems-<poemHash>`; otherwise fetches the first of `poemFiles` and keeps it
 * (in the background: the answer does not wait for the write).
 */
export async function loadPoemLibrary(manifest: PoemManifest, io: PoemIO): Promise<LoadedPoemLibrary | null> {
	try {
		const file = manifest.poemFiles?.[0];
		const hash = manifest.poemHash;
		if (!file || !hash) return null;
		const key = poemStoreKey(hash);

		const kept = await io.getStored<unknown>(key);
		if (isPoemLibrary(kept)) return { ...kept, hash };

		const response = await io.fetchFile(`/data/${file}`);
		if (!response.ok) return null;
		const fetched: unknown = await response.json();
		if (!isPoemLibrary(fetched)) return null;
		void io.setStored(key, fetched);
		return { ...fetched, hash };
	} catch (error) {
		console.warn('[Ilya] Poem library unavailable (no poem will be offered):', error);
		return null;
	}
}
