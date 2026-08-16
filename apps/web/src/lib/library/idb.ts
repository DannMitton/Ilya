/**
 * idb.ts — the promise wrapper.
 *
 * N.67 step 1. Design §6 declined `idb` (1.5 KB min+gzip) and `dexie` (31 KB)
 * because the surface needed here is small, because the lockfile is a hand
 * operation of Dann's, and because vendoring is the house style. This is that
 * surface: open, get, put, delete, getAll, one multi-store transaction, and
 * two indices. Nothing here knows what a song is.
 *
 * WHY EVERY CALL IS WRAPPED RATHER THAN USED RAW. IndexedDB reports failure
 * three different ways: `request.onerror`, `transaction.onabort`, and a
 * synchronous throw from `transaction()` itself when a store is missing. A
 * caller that handles only the first loses data silently, which is the exact
 * failure this whole item exists to end. Everything below funnels all three
 * into one rejected promise, and `library.ts` turns that into an outcome.
 */

/** A request, as a promise. Rejects with the request's own error. */
export function requestAsPromise<T>(request: IDBRequest<T>): Promise<T> {
	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? new Error('idb request failed'));
	});
}

/**
 * A transaction, as a promise that settles when the WHOLE transaction does.
 *
 * Resolving on `oncomplete` rather than on the last request's `onsuccess` is
 * the difference between "the write was accepted" and "the write is durable".
 * Design §4 rests on this: a song save is atomic across `songs` and `sources`,
 * so a reload mid-write leaves the previous record whole.
 */
export function transactionAsPromise(tx: IDBTransaction): Promise<void> {
	return new Promise((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? new Error('idb transaction failed'));
		tx.onabort = () => reject(tx.error ?? new DOMException('aborted', 'AbortError'));
	});
}

export interface StoreSpec {
	name: string;
	keyPath?: string;
	indices?: { name: string; keyPath: string }[];
}

/**
 * Open a database, creating any missing stores and indices.
 *
 * `onblocked` is reported rather than left to hang. A blocked open means
 * another tab holds an older version open, and without this the page would
 * simply never finish loading, which looks like a crash and is impossible to
 * diagnose from the outside.
 */
export function openDatabase(
	name: string,
	version: number,
	stores: StoreSpec[],
): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		let request: IDBOpenDBRequest;
		try {
			request = indexedDB.open(name, version);
		} catch (err) {
			reject(err);
			return;
		}
		request.onupgradeneeded = () => {
			const db = request.result;
			for (const spec of stores) {
				const store = db.objectStoreNames.contains(spec.name)
					? request.transaction!.objectStore(spec.name)
					: db.createObjectStore(spec.name, spec.keyPath ? { keyPath: spec.keyPath } : undefined);
				for (const index of spec.indices ?? []) {
					if (!store.indexNames.contains(index.name)) {
						// Not unique: two songs may legitimately share a fingerprint
						// (design §2.4), and recognition is a prompt, not a key.
						store.createIndex(index.name, index.keyPath, { unique: false });
					}
				}
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? new Error('idb open failed'));
		request.onblocked = () =>
			reject(new DOMException('another tab holds an older version open', 'InvalidStateError'));
	});
}

export async function getFrom<T>(db: IDBDatabase, store: string, key: IDBValidKey): Promise<T | undefined> {
	const tx = db.transaction(store, 'readonly');
	const value = await requestAsPromise<T | undefined>(tx.objectStore(store).get(key));
	await transactionAsPromise(tx);
	return value;
}

export async function getAllFrom<T>(db: IDBDatabase, store: string): Promise<T[]> {
	const tx = db.transaction(store, 'readonly');
	const values = await requestAsPromise<T[]>(tx.objectStore(store).getAll());
	await transactionAsPromise(tx);
	return values;
}

export async function getAllByIndex<T>(
	db: IDBDatabase,
	store: string,
	index: string,
	key: IDBValidKey,
): Promise<T[]> {
	const tx = db.transaction(store, 'readonly');
	const values = await requestAsPromise<T[]>(tx.objectStore(store).index(index).getAll(key));
	await transactionAsPromise(tx);
	return values;
}

/**
 * Write across several stores in ONE transaction.
 *
 * The callback receives the stores by name and must only issue requests; it
 * must not await anything that is not an IndexedDB request, because an
 * IndexedDB transaction closes as soon as its microtask queue drains and an
 * unrelated await will silently take the stores away mid-write.
 */
export async function writeAcross(
	db: IDBDatabase,
	stores: string[],
	work: (get: (name: string) => IDBObjectStore) => void,
): Promise<void> {
	const tx = db.transaction(stores, 'readwrite');
	const settled = transactionAsPromise(tx);
	work((name) => tx.objectStore(name));
	await settled;
}
