/**
 * driver.ts — where the bytes go.
 *
 * N.67 step 0. Two drivers ship here: the LEGACY driver, which reads and
 * writes today's six localStorage keys byte for byte, and the MEMORY driver,
 * for tests. Step 1 adds the IndexedDB driver underneath the same interface
 * and deletes nothing above it.
 *
 * THE STORE IS INJECTED. `savePairings` / `loadPairings` (`pairings.ts:390`,
 * `:408`) reach for the global `localStorage` directly, which is correct for
 * them and untestable in this suite: vitest runs in node, where there is no
 * `localStorage`. So the driver takes its store as an argument, defaulting to
 * the global one, and the tests hand it a plain object. The pairings KEY is
 * imported rather than retyped (`PAIRINGS_KEY`), so the one string that must
 * not drift cannot.
 */
import { PAIRINGS_KEY, type PairingMap } from '$lib/shane/pairings';
import { parseFromScore, serializeFromScore, type MetadataField } from '$lib/metadata-provenance';
import { getFrom, openDatabase, writeAcross, type StoreSpec } from './idb';
import {
	emptySongRecord,
	type FailureReason,
	type GlossRow,
	type LoadResult,
	type Outcome,
	type SongRecord,
} from './types';

/** The slice of the `Storage` interface this file uses. */
export interface KeyValueStore {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}

/**
 * The score file's bytes, kept whole and separate from the record.
 *
 * A separate store so that listing the library reads kilobytes of records and
 * never megabytes of blobs (design §2.1). `ArrayBuffer` rather than `Blob`:
 * both structured-clone into IndexedDB, and the plainer type sidesteps a
 * history of WebKit defects around stored Blobs at no cost.
 */
export interface SourceBytes {
	songId: string;
	fileName: string;
	bytes: ArrayBuffer;
	byteLength: number;
	contentHash: string;
	importedAt: string;
}

export interface StorageDriver {
	/** For notices and tests. Never branched on by the facade. */
	readonly kind: 'legacy' | 'memory' | 'indexeddb';
	load(id: string): Promise<LoadResult>;
	/**
	 * `source` UNDEFINED means leave the stored bytes exactly as they are, which
	 * is every autosave. A value replaces them, and `null` deletes them. The
	 * record and its bytes are written in ONE transaction, so the old source is
	 * gone only once the new one is durable (design §2.1, §2.6).
	 */
	save(record: SongRecord, source?: SourceBytes | null): Promise<Outcome>;
	loadSource(songId: string): Promise<SourceBytes | null>;
}

/* ── The six legacy keys ────────────────────────────────────────── */

export const LEGACY_KEYS = {
	poem: 'ilya:inputText',
	metadata: 'ilya:metadata',
	fromScore: 'ilya:metadataFromScore',
	glosses: 'ilya:glossOverrides',
	openSyllabification: 'ilya:openSyllabification',
	pairings: PAIRINGS_KEY,
} as const;

/**
 * The same detection `savePairings` performs (`pairings.ts:397-401`). A quota
 * failure has its own notice, so it must not be flattened into the generic one.
 */
function reasonFor(err: unknown): FailureReason {
	return err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22)
		? 'quota-exceeded'
		: 'write-failed';
}

/** The global store, or null where it is absent or blocked (private browsing). */
export function globalStore(): KeyValueStore | null {
	try {
		return typeof localStorage === 'undefined' ? null : localStorage;
	} catch {
		return null;
	}
}

/**
 * Read the six keys into a record.
 *
 * ORDER MATTERS IN ONE PLACE: the provenance tags are parsed AFTER the
 * metadata values, because `parseFromScore` only honours a tag for a field
 * that came back with something in it (`+page.svelte:920-925` says so, and
 * `metadata-provenance.ts:180` is the code). Everything else is independent.
 *
 * A malformed value never throws and never takes the rest of the song with
 * it: that field falls back to its default and the reason is reported once.
 */
function readLegacy(store: KeyValueStore, id: string, now: string): LoadResult {
	const record = emptySongRecord(id, now);
	let reason: FailureReason | undefined;
	const malformed = () => {
		reason ??= 'malformed';
	};

	const poem = store.getItem(LEGACY_KEYS.poem);
	if (poem !== null) record.poem = poem;

	const rawMeta = store.getItem(LEGACY_KEYS.metadata);
	if (rawMeta) {
		try {
			const parsed: unknown = JSON.parse(rawMeta);
			// The page merges over its defaults rather than replacing
			// (`+page.svelte:918`), so a record written by an older Ilya that
			// lacks a field keeps the default for it instead of `undefined`.
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				record.metadata = { ...record.metadata, ...(parsed as Partial<typeof record.metadata>) };
			} else {
				malformed();
			}
		} catch {
			malformed();
		}
	}

	const rawFromScore = store.getItem(LEGACY_KEYS.fromScore);
	if (rawFromScore) {
		record.fromScore = [...parseFromScore(rawFromScore, record.metadata)] as MetadataField[];
	}

	const rawGlosses = store.getItem(LEGACY_KEYS.glosses);
	if (rawGlosses) {
		try {
			const parsed: unknown = JSON.parse(rawGlosses);
			if (Array.isArray(parsed)) {
				// The anchor guard is today's, verbatim (`+page.svelte:954`): a row
				// with no anchor word cannot be checked for survival, so it is not
				// restored at all.
				record.glosses = parsed.filter(
					(row): row is GlossRow =>
						Array.isArray(row) &&
						typeof row[0] === 'string' &&
						typeof row[1] === 'string' &&
						typeof row[2] === 'string' &&
						row[2] !== '',
				);
			} else {
				malformed();
			}
		} catch {
			malformed();
		}
	}

	const rawSyll = store.getItem(LEGACY_KEYS.openSyllabification);
	if (rawSyll) {
		try {
			const parsed: unknown = JSON.parse(rawSyll);
			if (typeof parsed === 'boolean') record.openSyllabification = parsed;
			else malformed();
		} catch {
			malformed();
		}
	}

	const rawPairings = store.getItem(LEGACY_KEYS.pairings);
	if (rawPairings !== null) {
		try {
			const parsed: unknown = JSON.parse(rawPairings);
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				record.pairings = parsed as PairingMap;
			} else {
				malformed();
			}
		} catch {
			malformed();
		}
	}

	return reason ? { record, reason } : { record };
}

/**
 * Write the six keys.
 *
 * Every write goes through one try, so a quota failure part way through is
 * reported once with its own reason rather than five times or not at all.
 * That is the whole difference from today, where five of these six sites
 * catch and say nothing (`+page.svelte:678`, `:711`, `:732`, `:605`, `:505`).
 */
function writeLegacy(store: KeyValueStore, record: SongRecord): Outcome {
	try {
		store.setItem(LEGACY_KEYS.poem, record.poem);
		store.setItem(LEGACY_KEYS.metadata, JSON.stringify(record.metadata));
		store.setItem(LEGACY_KEYS.fromScore, serializeFromScore(new Set(record.fromScore)));
		store.setItem(LEGACY_KEYS.glosses, JSON.stringify(record.glosses));
		store.setItem(LEGACY_KEYS.openSyllabification, JSON.stringify(record.openSyllabification));
		store.setItem(LEGACY_KEYS.pairings, JSON.stringify(record.pairings));
		return { ok: true };
	} catch (err) {
		return { ok: false, reason: reasonFor(err) };
	}
}

/**
 * The legacy read, synchronously.
 *
 * localStorage is synchronous, and `+page.ts` sets `ssr = false`, so the page
 * never renders on a server and there is no hydration to mismatch. That lets
 * step 0 build the document at component init with its data already in it: no
 * null window, no `{#if doc}` around the template, and the unrestored-state
 * race is impossible without a guard flag. Step 1's IndexedDB driver is
 * genuinely async and uses `load()` below; this door closes then.
 */
export function readLegacySync(
	id: string,
	store: KeyValueStore | null = globalStore(),
): LoadResult {
	const now = new Date().toISOString();
	if (!store) return { record: emptySongRecord(id, now), reason: 'no-storage' };
	return readLegacy(store, id, now);
}

/**
 * Today's storage, behind the new seam. Single-song by construction: the id is
 * carried on the record but nothing keys on it until step 1, because these six
 * keys have no room for a second song and are not being given one.
 */
export function createLegacyDriver(store: KeyValueStore | null = globalStore()): StorageDriver {
	return {
		kind: 'legacy',
		async load(id) {
			if (!store) return { record: emptySongRecord(id, new Date().toISOString()), reason: 'no-storage' };
			// A legacy browser has nowhere to put bytes, so it must not claim a
			// source it cannot produce. `readLegacy` leaves `source` null.
			return readLegacy(store, id, new Date().toISOString());
		},
		async save(record) {
			if (!store) return { ok: false, reason: 'no-storage' };
			// The source is dropped, not half-kept: six string keys have no room
			// for a score, and this driver only runs where IndexedDB refused.
			return writeLegacy(store, { ...record, source: null });
		},
		async loadSource() {
			return null;
		},
	};
}

/** For tests, and for the "no storage at all" path once step 6 builds it. */
export function createMemoryDriver(seed: SongRecord[] = []): StorageDriver {
	const songs = new Map(seed.map((r) => [r.id, structuredClone(r)]));
	const sources = new Map<string, SourceBytes>();
	return {
		kind: 'memory',
		async load(id) {
			const found = songs.get(id);
			return { record: found ? structuredClone(found) : emptySongRecord(id, new Date().toISOString()) };
		},
		async save(record, source) {
			songs.set(record.id, structuredClone(record));
			if (source === null) sources.delete(record.id);
			else if (source !== undefined) sources.set(record.id, source);
			return { ok: true };
		},
		async loadSource(songId) {
			return sources.get(songId) ?? null;
		},
	};
}

/* ── The vault ──────────────────────────────────────────────────── */

export const LIBRARY_DB = 'ilya-library';
export const LIBRARY_DB_VERSION = 1;
export const SONGS_STORE = 'songs';
export const SOURCES_STORE = 'sources';
export const META_STORE = 'meta';
export const META_KEY = 'library';

export const LIBRARY_STORES: StoreSpec[] = [
	{
		name: SONGS_STORE,
		keyPath: 'id',
		indices: [
			{ name: 'by-updated', keyPath: 'updatedAt' },
			{ name: 'by-fingerprint', keyPath: 'source.fingerprint' },
		],
	},
	{ name: SOURCES_STORE, keyPath: 'songId' },
	{ name: META_STORE },
];

/**
 * Open `ilya-library`, a NEW database beside `ilya-data`, never inside it.
 *
 * `loader.ts:105` opens `ilya-data` with an explicit `indexedDB.open(DB_NAME, 1)`.
 * Upgrading that database to version 2 would make the loader's own open fail
 * with `VersionError` until the loader itself was edited, so sharing it would
 * force a change to working dictionary code on day one. The two also deserve
 * different lifecycles: the cache is re-downloadable and the library is the
 * singer's work, and "clear the cache" must never be able to mean "delete a
 * song" (design §2.1).
 */
export function openLibraryDatabase(): Promise<IDBDatabase> {
	return openDatabase(LIBRARY_DB, LIBRARY_DB_VERSION, LIBRARY_STORES);
}

/**
 * A quota failure arrives from IndexedDB as a `QuotaExceededError` DOMException
 * on the transaction, the same name localStorage uses, so one mapping serves
 * both. Anything else is a write failure with its own reason kept in the log.
 */
function idbReason(err: unknown): FailureReason {
	if (err instanceof DOMException && err.name === 'QuotaExceededError') return 'quota-exceeded';
	return 'write-failed';
}

export function createIndexedDbDriver(db: IDBDatabase): StorageDriver {
	return {
		kind: 'indexeddb',
		async load(id) {
			try {
				const stored = await getFrom<unknown>(db, SONGS_STORE, id);
				if (stored === undefined) {
					// Not an error: a song that was never written is a new song.
					return { record: emptySongRecord(id, new Date().toISOString()) };
				}
				// Shape checking is the facade's job, not the driver's; the driver
				// hands back what it found.
				return { record: stored as SongRecord };
			} catch {
				return { record: emptySongRecord(id, new Date().toISOString()), reason: 'write-failed' };
			}
		},
		async save(record, source) {
			try {
				// ONE transaction across both stores. On any abort the previous
				// record stands whole, so a half-written song cannot exist.
				await writeAcross(db, [SONGS_STORE, SOURCES_STORE], (store) => {
					store(SONGS_STORE).put(record);
					if (source === null) store(SOURCES_STORE).delete(record.id);
					else if (source !== undefined) store(SOURCES_STORE).put(source);
				});
				return { ok: true };
			} catch (err) {
				return { ok: false, reason: idbReason(err) };
			}
		},
		async loadSource(songId) {
			try {
				return (await getFrom<SourceBytes>(db, SOURCES_STORE, songId)) ?? null;
			} catch {
				return null;
			}
		},
	};
}

/** Has the one-time localStorage migration already run? Design §3. */
export async function readMigrationFlag(db: IDBDatabase): Promise<boolean> {
	const meta = await getFrom<{ migratedFromLocalStorage?: boolean }>(db, META_STORE, META_KEY);
	return meta?.migratedFromLocalStorage === true;
}

export async function writeMigrationFlag(db: IDBDatabase): Promise<void> {
	await writeAcross(db, [META_STORE], (store) => {
		store(META_STORE).put({ migratedFromLocalStorage: true }, META_KEY);
	});
}
