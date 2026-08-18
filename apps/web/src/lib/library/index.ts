/**
 * index.ts — opening the library, once, at boot.
 *
 * N.67 step 1. This is the only place that decides which driver the app runs
 * on, runs the migration, and resolves which song opens. It NEVER throws and
 * NEVER hangs: the page awaits it before rendering, so a rejected promise here
 * would be a blank screen and a hung one would be a blank screen that never
 * resolves. Every failure degrades to a working app plus a reported reason.
 */
import {
	createIndexedDbDriver,
	createLegacyDriver,
	globalStore,
	openLibraryDatabase,
	readLegacySync,
	readMigrationFlag,
	writeMigrationFlag,
	type KeyValueStore,
	type SourceBytes,
	type StorageDriver,
} from './driver';
import { Library } from './library';
import { migrateFromLocalStorage, type MigrationOutcome } from './migration';
import { readStorageEstimate, type StorageReading } from './quota';
import { LEGACY_SONG_ID } from './document.svelte';
import { listSongs, nameFor } from './songs';
import type { LoadResult, SongRecord } from './types';

/**
 * A pointer, not data. Losing it loses nothing but which song opens first,
 * which is why it may live in localStorage while the songs do not (design §2.1).
 */
export const ACTIVE_SONG_KEY = 'ilya:activeSongId';

/**
 * How long to wait for `indexedDB.open` before running on localStorage instead.
 *
 * `openDatabase` rejects on `onblocked`, but a browser that fires none of the
 * three callbacks would leave the page waiting forever. Three seconds is far
 * beyond a healthy open (the dictionary's own open is milliseconds) and far
 * below a singer's patience for a blank screen.
 */
const OPEN_TIMEOUT_MS = 3000;

export interface OpenedLibrary {
	library: Library;
	songId: string;
	loaded: LoadResult;
	source: SourceBytes | null;
	driverKind: StorageDriver['kind'];
	migration: MigrationOutcome;
	storage: StorageReading;
	/** Set when the vault could not be opened and the app fell back. */
	vaultError: string | null;
}

/**
 * A song's permanent, opaque identity (design §2.3 layer 1). Exported since
 * N.67 step 4b, because New song mints one in the page.
 */
export function newId(): string {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
	// Only reachable on a browser without randomUUID; the id needs to be
	// opaque and unique, not cryptographically strong.
	return `song-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

function readActiveSongId(store: KeyValueStore | null): string | null {
	if (!store) return null;
	try {
		const id = store.getItem(ACTIVE_SONG_KEY);
		return id && id !== '' ? id : null;
	} catch {
		return null;
	}
}

/**
 * Move the pointer. Exported since N.67 step 4b: switching songs is exactly
 * this write plus `close()` then `open()`.
 */
export function writeActiveSongId(store: KeyValueStore | null, id: string): void {
	try {
		store?.setItem(ACTIVE_SONG_KEY, id);
	} catch {
		// A lost pointer costs which song opens first, never a song.
	}
}

async function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
	let timer: ReturnType<typeof setTimeout>;
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new Error('indexedDB.open timed out')), ms);
	});
	try {
		return await Promise.race([work, timeout]);
	} finally {
		clearTimeout(timer!);
	}
}

export async function openLibrary(): Promise<OpenedLibrary> {
	const store = globalStore();

	let db: IDBDatabase | null = null;
	let vaultError: string | null = null;
	try {
		db = await withTimeout(openLibraryDatabase(), OPEN_TIMEOUT_MS);
	} catch (err) {
		// Private browsing, a blocked upgrade from another tab, or no IndexedDB
		// at all. The app keeps running on the six legacy keys, exactly as it did
		// before step 1, and says so rather than pretending it saved.
		vaultError = err instanceof Error ? err.message : String(err);
	}

	if (!db) {
		const driver = createLegacyDriver(store);
		const loaded = readLegacySync(LEGACY_SONG_ID, store);
		return {
			library: new Library(driver),
			songId: LEGACY_SONG_ID,
			loaded,
			source: null,
			driverKind: 'legacy',
			migration: { kind: 'not-needed' },
			storage: await readStorageEstimate(),
			vaultError,
		};
	}

	const driver = createIndexedDbDriver(db);
	const library = new Library(driver);

	let alreadyMigrated = false;
	try {
		alreadyMigrated = await readMigrationFlag(db);
	} catch {
		// Unreadable flag: treat as not migrated. The migration itself is
		// idempotent in effect, because it only runs where legacy work exists,
		// and it removes those keys when it succeeds.
	}

	const migration = await migrateFromLocalStorage({
		store,
		driver,
		alreadyMigrated,
		newId,
		now: () => new Date().toISOString(),
	});

	if (migration.kind === 'migrated') {
		writeActiveSongId(store, migration.record.id);
	}
	if (migration.kind === 'migrated' || migration.kind === 'nothing-to-move') {
		try {
			await writeMigrationFlag(db);
		} catch {
			// An unset flag costs one more attempted migration next boot, which
			// will find nothing to move and stop. It cannot cost a song.
		}
	}

	// Which song opens: the one the pointer names, the one just migrated, or a
	// new one. A pointer naming a song that is not there yields an empty record
	// rather than an error, which is the "new song" path.
	let songId = readActiveSongId(store);
	if (!songId) {
		songId = migration.kind === 'migrated' ? migration.record.id : newId();
		writeActiveSongId(store, songId);
	}

	const loaded = await library.load(songId);
	await backfillName(library, loaded.record);
	const source = await library.loadSource(songId);

	return {
		library,
		songId,
		loaded,
		source,
		driverKind: 'indexeddb',
		migration,
		storage: await readStorageEstimate(),
		vaultError: null,
	};
}

/**
 * Give a song a name the first time one can be built from its own material.
 *
 * N.67 step 4b. `SongRecord.name` has existed since step 0 and NOTHING HAS EVER
 * WRITTEN IT, so every record in every browser carries the empty string. This
 * is where that is repaired, for the migrated song and for any song whose
 * material arrived before the door did.
 *
 * A song with nothing in it is left EMPTY rather than named "Untitled": the
 * list draws a placeholder for those, and storing one would still say Untitled
 * after the singer typed a title. Storing nothing is also the rule
 * (CONTRACT §6, do not store anything derived); a name becomes the singer's own
 * the moment it is written, which is why it is written once and then left alone.
 *
 * A failure here costs a name and never a song, so it is not reported: the
 * record is untouched, the app runs, and the next boot tries again.
 */
async function backfillName(library: Library, record: SongRecord): Promise<void> {
	if (record.name !== '') return;
	const named = nameFor(record, await listSongs(library.plural));
	if (named === '') return;
	// Mutated before the document is built FROM this record, so the page shows
	// the name in the same paint as the song rather than one save later.
	record.name = named;
	await library.save(record);
}
