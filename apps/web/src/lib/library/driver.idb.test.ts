/**
 * driver.idb.test.ts — N.67 steps 1 and 2.
 *
 * The IndexedDB driver, under `fake-indexeddb`, which Dann ruled in on
 * 2026-08-16 on the ground that the five gates are what protect a ship and a
 * Playwright lane outside them protects nothing automatically. A driver bug is
 * a data-loss bug, so it belongs in the fast lane.
 *
 * Apache-2.0, no runtime dependencies, dev-only: zero bytes reach the bundle.
 */
import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
	createIndexedDbDriver,
	openLibraryDatabase,
	readMigrationFlag,
	writeMigrationFlag,
	SONGS_STORE,
	SOURCES_STORE,
	type SourceBytes,
	type StorageDriver,
} from './driver';
import { getAllByIndex } from './idb';
import { emptySongRecord, type SongRecord } from './types';

const NOW = '2026-08-16T00:00:00.000Z';

let db: IDBDatabase;
let driver: StorageDriver;

function song(id: string, poem = 'Я тебя любил'): SongRecord {
	const record = emptySongRecord(id, NOW);
	record.poem = poem;
	return record;
}

function bytesFor(id: string, text = 'score bytes'): SourceBytes {
	const bytes = new TextEncoder().encode(text);
	return {
		songId: id,
		fileName: 'sonnet90.musicxml',
		bytes: bytes.buffer.slice(0) as ArrayBuffer,
		byteLength: bytes.byteLength,
		contentHash: 'abc123',
		importedAt: NOW,
	};
}

afterEach(() => {
	// CLOSE BEFORE DELETING. An open connection blocks `deleteDatabase`, and a
	// blocked delete then blocks the next open, which hangs the whole file
	// rather than failing it. Cost: one 120-second run, 2026-08-16.
	db?.close();
});

beforeEach(async () => {
	// A fresh database per test: fake-indexeddb keeps state between them.
	await new Promise<void>((resolve) => {
		const request = indexedDB.deleteDatabase('ilya-library');
		request.onsuccess = () => resolve();
		request.onerror = () => resolve();
		request.onblocked = () => resolve();
	});
	db = await openLibraryDatabase();
	driver = createIndexedDbDriver(db);
});

describe('the vault', () => {
	it('creates the three stores and both indices', () => {
		expect([...db.objectStoreNames].sort()).toEqual(['meta', 'songs', 'sources']);
		const tx = db.transaction(SONGS_STORE, 'readonly');
		expect([...tx.objectStore(SONGS_STORE).indexNames].sort()).toEqual(['by-fingerprint', 'by-updated']);
		tx.abort();
	});

	it('round trips a song', async () => {
		await driver.save(song('s1'));

		const loaded = await driver.load('s1');

		expect(loaded.reason).toBeUndefined();
		expect(loaded.record.poem).toBe('Я тебя любил');
	});

	it('treats a song that was never written as a new song, not an error', async () => {
		const loaded = await driver.load('never-written');

		expect(loaded.reason).toBeUndefined();
		expect(loaded.record.poem).toBe('');
	});

	it('keeps the two songs apart', async () => {
		await driver.save(song('s1', 'first'));
		await driver.save(song('s2', 'second'));

		expect((await driver.load('s1')).record.poem).toBe('first');
		expect((await driver.load('s2')).record.poem).toBe('second');
	});

	it('finds a song by its fingerprint, for the recognition prompt', async () => {
		const record = song('s1');
		record.source = {
			fileName: 'sonnet90.musicxml',
			byteLength: 1757,
			importedAt: NOW,
			contentHash: 'abc123',
			fingerprint: 'fp-kabalevsky-90',
		};
		await driver.save(record);

		const found = await getAllByIndex<SongRecord>(db, SONGS_STORE, 'by-fingerprint', 'fp-kabalevsky-90');

		expect(found.map((r) => r.id)).toEqual(['s1']);
	});
});

describe('the source', () => {
	it('stores the bytes beside the song and reads them back whole', async () => {
		await driver.save(song('s1'), bytesFor('s1', 'the actual score'));

		const source = await driver.loadSource('s1');

		expect(source).not.toBeNull();
		expect(new TextDecoder().decode(source!.bytes)).toBe('the actual score');
		expect(source!.fileName).toBe('sonnet90.musicxml');
	});

	it('leaves stored bytes alone on an ordinary save', async () => {
		await driver.save(song('s1'), bytesFor('s1', 'original'));

		// Every autosave passes no source at all. If this replaced or dropped
		// the bytes, a singer typing would erase their own score.
		await driver.save(song('s1', 'edited poem'));

		expect(new TextDecoder().decode((await driver.loadSource('s1'))!.bytes)).toBe('original');
		expect((await driver.load('s1')).record.poem).toBe('edited poem');
	});

	it('replaces the bytes when a new score arrives', async () => {
		await driver.save(song('s1'), bytesFor('s1', 'first score'));

		await driver.save(song('s1'), bytesFor('s1', 'second score'));

		expect(new TextDecoder().decode((await driver.loadSource('s1'))!.bytes)).toBe('second score');
	});

	it('deletes the bytes only when explicitly told null', async () => {
		await driver.save(song('s1'), bytesFor('s1'));

		await driver.save(song('s1'), null);

		expect(await driver.loadSource('s1')).toBeNull();
	});

	it('reports no source for a song that never had one', async () => {
		await driver.save(song('s1'));

		expect(await driver.loadSource('s1')).toBeNull();
	});

	it('writes the record and its bytes in ONE transaction', async () => {
		// Both stores are named by the same transaction, so both land or
		// neither does. Observable here as: the source is readable the instant
		// the save resolves, with no second write.
		await driver.save(song('s1'), bytesFor('s1'));

		const [record, source] = await Promise.all([driver.load('s1'), driver.loadSource('s1')]);
		expect(record.record.poem).toBe('Я тебя любил');
		expect(source).not.toBeNull();
	});
});

describe('the migration flag', () => {
	it('is false before it is written and true after', async () => {
		expect(await readMigrationFlag(db)).toBe(false);

		await writeMigrationFlag(db);

		expect(await readMigrationFlag(db)).toBe(true);
	});
});

describe('a database that has gone away', () => {
	it('reports a failure rather than throwing at the caller', async () => {
		db.close();

		const outcome = await driver.save(song('s1'));

		expect(outcome.ok).toBe(false);
		// And the read side degrades to an empty record with a reason, never a
		// rejected promise, because the page awaits this at boot.
		const loaded = await driver.load('s1');
		expect(loaded.reason).toBe('write-failed');
	});
});
