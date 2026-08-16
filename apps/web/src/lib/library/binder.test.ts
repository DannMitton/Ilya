/**
 * binder.test.ts — N.67 step 5, single-song half.
 *
 * The binder is the fire escape: design §8 says it is the only thing that
 * survives an eviction, a wipe, or a lost phone. So these tests are weighted
 * toward the round trip surviving intact, and toward refusing rather than
 * guessing when a binder cannot be understood.
 */
import { describe, it, expect } from 'vitest';
import {
	autoName,
	binderFileName,
	buildBinder,
	readBinder,
	BINDER_FORMAT,
	MANIFEST_NAME,
} from './binder';
import { listZipEntries, readZipEntry } from '$lib/shane/ingestion/zip-reader';
import { buildZip, utf8 } from './zip-writer';
import { emptySongRecord, type SongRecord } from './types';
import type { SourceBytes } from './driver';

const NOW = '2026-08-16T00:00:00.000Z';
const TODAY = '16 August 2026';

function song(): SongRecord {
	const record = emptySongRecord('song-1', NOW);
	record.poem = 'Я тебя любил';
	record.metadata = { ...record.metadata, title: 'Сонет 90', composer: 'Kabalevsky' };
	record.glosses = [['0-0', 'I', 'я']];
	record.pairings = { 'm1-0-1': { kind: 'empty' } };
	record.source = {
		fileName: 'sonnet90.musicxml',
		byteLength: 9,
		importedAt: NOW,
		contentHash: 'abc',
		fingerprint: 'fp',
	};
	return record;
}

function bytes(text: string, fileName = 'sonnet90.musicxml'): SourceBytes {
	const data = utf8(text);
	return {
		songId: 'song-1',
		fileName,
		bytes: data.buffer.slice(0) as ArrayBuffer,
		byteLength: data.byteLength,
		contentHash: 'abc',
		importedAt: NOW,
	};
}

describe('autoName', () => {
	it('names a song the way a singer would, composer then title', () => {
		expect(autoName(song(), TODAY)).toBe('Kabalevsky, Сонет 90');
	});

	it('falls back to the title, then the composer', () => {
		const r = song();
		r.metadata.composer = '';
		expect(autoName(r, TODAY)).toBe('Сонет 90');
		r.metadata.title = '';
		r.metadata.composer = 'Kabalevsky';
		expect(autoName(r, TODAY)).toBe('Kabalevsky');
	});

	it('falls back to the poem, because a song with no header still has words', () => {
		const r = emptySongRecord('x', NOW);
		r.poem = 'Я вас любил любовь еще быть может';
		expect(autoName(r, TODAY)).toBe('Я вас любил любовь');
	});

	it('falls back to the date, because something must be said', () => {
		expect(autoName(emptySongRecord('x', NOW), TODAY)).toBe('Untitled, 16 August 2026');
	});
});

describe('binderFileName', () => {
	it('keeps Cyrillic, accents, and spaces, which are the singer’s own words', () => {
		expect(binderFileName('Kabalevsky, Сонет 90', TODAY)).toBe('Kabalevsky, Сонет 90.ilya');
	});

	it('removes what a filesystem refuses', () => {
		expect(binderFileName('A/B\\C:D*E?F"G<H>I|J', TODAY)).toBe('A B C D E F G H I J.ilya');
	});

	it('never begins with a dot, which would hide the file', () => {
		expect(binderFileName('...hidden', TODAY)).toBe('hidden.ilya');
	});

	it('falls back rather than producing a bare extension', () => {
		expect(binderFileName('///', TODAY)).toBe('Untitled, 16 August 2026.ilya');
	});

	it('caps the length in BYTES, because Cyrillic costs two apiece', () => {
		const name = binderFileName('Я'.repeat(400), TODAY);
		expect(new TextEncoder().encode(name).length).toBeLessThanOrEqual(186);
	});
});

describe('the binder, round trip', () => {
	it('carries the song back whole', async () => {
		const record = song();
		const built = await buildBinder({
			record,
			source: bytes('<score/>'),
			appVersion: '2026a',
			exportedAt: NOW,
			name: 'Kabalevsky, Сонет 90',
		});

		const read = await readBinder(built, NOW);

		expect(read.ok).toBe(true);
		if (!read.ok) return;
		expect(read.songs).toHaveLength(1);
		expect(read.songs[0].record.poem).toBe('Я тебя любил');
		expect(read.songs[0].record.metadata.title).toBe('Сонет 90');
		expect(read.songs[0].record.glosses).toEqual([['0-0', 'I', 'я']]);
		expect(read.songs[0].record.pairings).toEqual({ 'm1-0-1': { kind: 'empty' } });
		expect(read.songs[0].name).toBe('Kabalevsky, Сонет 90');
	});

	it('carries the score file back BYTE FOR BYTE', async () => {
		// The whole point of §8: the singer's own file, not a rendition of it.
		const built = await buildBinder({
			record: song(),
			source: bytes('<score>the actual bytes</score>'),
			appVersion: '2026a',
			exportedAt: NOW,
			name: 'x',
		});

		const read = await readBinder(built, NOW);

		expect(read.ok).toBe(true);
		if (!read.ok) return;
		expect(new TextDecoder().decode(read.songs[0].source!.bytes)).toBe('<score>the actual bytes</score>');
		expect(read.songs[0].source!.fileName).toBe('sonnet90.musicxml');
	});

	it('exports a song that has no score at all', async () => {
		const record = song();
		record.source = null;

		const built = await buildBinder({ record, source: null, appVersion: '2026a', exportedAt: NOW, name: 'x' });
		const read = await readBinder(built, NOW);

		expect(read.ok).toBe(true);
		if (!read.ok) return;
		expect(read.songs[0].source).toBeNull();
		expect(read.songs[0].record.poem).toBe('Я тебя любил');
	});

	it('is a real ZIP, with the manifest first', async () => {
		const built = await buildBinder({
			record: song(),
			source: bytes('<score/>'),
			appVersion: '2026a',
			exportedAt: NOW,
			name: 'x',
		});

		const entries = listZipEntries(built);
		expect(entries[0].name).toBe(MANIFEST_NAME);
		expect(entries.map((e) => e.name)).toEqual([
			MANIFEST_NAME,
			'songs/song-1/song.json',
			'songs/song-1/source/sonnet90.musicxml',
		]);
		const manifest = JSON.parse(new TextDecoder().decode(await readZipEntry(built, MANIFEST_NAME)));
		expect(manifest.format).toBe(BINDER_FORMAT);
		expect(manifest.schema).toBe(1);
		expect(manifest.appVersion).toBe('2026a');
	});

	it('stores an already-compressed container rather than deflating it', async () => {
		// gzip -9 on a real .musx returned THIRTEEN BYTES LARGER than the
		// original, measured 2026-08-16. Deflating those spends processor time
		// to grow the file.
		const built = await buildBinder({
			record: song(),
			source: bytes('finale bytes', 'sonata.musx'),
			appVersion: '2026a',
			exportedAt: NOW,
			name: 'x',
		});

		const entries = listZipEntries(built);
		const source = entries.find((e) => e.name.endsWith('.musx'))!;
		expect(source.compressionMethod).toBe(0);
		// While the record and manifest, which are JSON, are deflated.
		expect(entries.find((e) => e.name === MANIFEST_NAME)!.compressionMethod).toBe(8);
	});
});

describe('a binder that cannot be read', () => {
	it('refuses something that is not a ZIP at all', async () => {
		expect(await readBinder(utf8('this is not a zip'), NOW)).toEqual({ ok: false, reason: 'not-a-zip' });
	});

	it('refuses a ZIP that is not a binder', async () => {
		const zip = await buildZip([{ name: 'score.xml', data: utf8('<score/>'), method: 8 }]);

		expect(await readBinder(zip, NOW)).toEqual({ ok: false, reason: 'not-a-binder' });
	});

	it('REFUSES A NEWER SCHEMA rather than guessing at it', async () => {
		// A future Ilya may add fields this version would silently drop, and
		// dropping a singer's work while appearing to succeed is the thing this
		// whole item exists to prevent.
		const manifest = { format: BINDER_FORMAT, schema: 99, appVersion: '2030a', exportedAt: NOW, songs: [] };
		const zip = await buildZip([{ name: MANIFEST_NAME, data: utf8(JSON.stringify(manifest)), method: 8 }]);

		expect(await readBinder(zip, NOW)).toEqual({ ok: false, reason: 'newer-schema', schema: 99 });
	});

	it('refuses a binder whose manifest names a song it does not contain', async () => {
		const manifest = {
			format: BINDER_FORMAT,
			schema: 1,
			appVersion: '2026a',
			exportedAt: NOW,
			songs: [{ id: 'ghost', name: 'Ghost', path: 'songs/ghost/song.json' }],
		};
		const zip = await buildZip([{ name: MANIFEST_NAME, data: utf8(JSON.stringify(manifest)), method: 8 }]);

		expect(await readBinder(zip, NOW)).toEqual({ ok: false, reason: 'malformed' });
	});

	it('refuses an empty binder rather than reporting a silent success', async () => {
		const manifest = { format: BINDER_FORMAT, schema: 1, appVersion: '2026a', exportedAt: NOW, songs: [] };
		const zip = await buildZip([{ name: MANIFEST_NAME, data: utf8(JSON.stringify(manifest)), method: 8 }]);

		expect(await readBinder(zip, NOW)).toEqual({ ok: false, reason: 'no-songs' });
	});

	it('never throws, whatever it is handed', async () => {
		for (const input of [new Uint8Array(0), new Uint8Array([80, 75, 3, 4]), utf8('PK')]) {
			const result = await readBinder(input, NOW);
			expect(result.ok).toBe(false);
		}
	});
});
