/**
 * document-word-marks.test.ts: row 182, step 2. The song document owns the Inspector's word marks of both witnesses,
 * writes them with the song, and loads them in place of a clear.
 *
 * Runes are inert under vitest, so the autosave effect does not run here (see `document-poem-source.test.ts`). What is
 * checked: a record's marks load into both witnesses and back out through `toRecord`; a mark follows its word when the
 * text moves it, including before the quiet pause transcribed it; a deleted word's mark is gone; a mark on a word that is
 * no longer there is dropped and counted; a song whose Lyrics come from the score holds its marks until those words are
 * known; and one song's marks never reach another's.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SongDocument } from './document.svelte';
import { LIBRARY_CHANNEL } from './channel';
import { Library, type SaveScheduler } from './library';
import { createMemoryDriver } from './driver';
import { emptySongRecord, type MarkRow, type SongRecord } from './types';
import { wordGrid } from '$lib/pipeline';

const NOW = '2026-11-10T00:00:00.000Z';
const idle = (): SaveScheduler => ({ schedule: () => {}, flush: async () => {}, isPending: () => false, dispose: () => {} });
const stress = (stressIndex: number) => ({ stressIndex, stressSource: 'user-override' as const });

const lyricsRows: MarkRow[] = [
	['0-1', 'stress', stress(1), 'любил'],
	['0-1-2', 'yo', { source: 'user-override' }, 'любил'],
	['1-0', 'syllables', { boundaries: [2] }, 'москва'],
	['1-0', 'spot', true, 'москва'],
];
const poemRows: MarkRow[] = [
	['0-0', 'stress', stress(0), 'я'],
	['0-2', 'spot', false, 'тебя'],
];
const record = (id: string, over: Partial<SongRecord> = {}): SongRecord => ({
	...emptySongRecord(id, NOW),
	poem: 'Я любил тебя\nМосква',
	publishedPoem: 'Я любил тебя',
	...over,
});

const open: SongDocument[] = [];
const channels: BroadcastChannel[] = [];
const library = (): Library => new Library(createMemoryDriver(), () => NOW);
const doc = (r: SongRecord, lib: Library = library()): SongDocument => {
	const d = SongDocument.fromLoaded(lib, { record: r }, idle);
	open.push(d);
	return d;
};
afterEach(async () => {
	for (const d of open.splice(0)) await d.close();
	for (const c of channels.splice(0)) c.close();
	vi.restoreAllMocks();
});

describe('SongDocument owns the word marks', () => {
	it('loads both witnesses from the record, and writes the same rows back', () => {
		const d = doc(record('a', { wordMarks: { lyrics: lyricsRows, poem: poemRows } }));
		expect(d.lyricsMarks.stress.get('0-1')).toEqual(stress(1));
		expect(d.lyricsMarks.yo.get('0-1-2')).toEqual({ source: 'user-override' });
		expect(d.lyricsMarks.syllables.get('1-0')).toEqual({ boundaries: [2] });
		expect(d.lyricsMarks.spot.get('1-0')).toBe(true);
		expect(d.poemMarks.stress.get('0-0')).toEqual(stress(0));
		expect(d.poemMarks.spot.get('0-2')).toBe(false);
		expect(d.lyricsMarks.stress.size + d.poemMarks.stress.size).toBe(2);
		expect(d.toRecord().wordMarks).toEqual({ lyrics: lyricsRows, poem: poemRows });
	});

	it('a song with no marks writes no field; set one of each kind and each is back after a save and reopen', async () => {
		const lib = library();
		const d = doc(record('a'), lib);
		expect('wordMarks' in d.toRecord()).toBe(false);
		d.lyricsMarks.assignStress('0-1', {}, 1, 'user-override');
		d.lyricsMarks.toggleYo('0-1-2', 'user-override');
		d.lyricsMarks.setSyllable('1-0', { boundaries: [2] });
		d.lyricsMarks.toggleSpot('1-0', false);
		d.lyricsMarksGrid = wordGrid(d.inputText);
		d.poemMarks.assignStress('0-0', {}, 0, 'user-override');
		d.poemMarks.toggleSpot('0-2', true);
		expect((await lib.save(d.toRecord())).ok).toBe(true);
		const back = doc((await lib.load('a')).record, lib);
		expect(back.lyricsMarks.maps()).toEqual(d.lyricsMarks.maps());
		expect(back.poemMarks.maps()).toEqual(d.poemMarks.maps());
		expect(back.lyricsMarks.spot.get('1-0')).toBe(true);
		expect(back.poemMarks.spot.get('0-2')).toBe(false);
	});

	it('removing the last mark removes the stored rows', async () => {
		const lib = library();
		const d = doc(record('a', { wordMarks: { lyrics: lyricsRows } }), lib);
		d.lyricsMarks.clear();
		expect('wordMarks' in d.toRecord()).toBe(false);
	});

	it('mark song A, switch to B, switch back: A has its mark and B has none', async () => {
		const lib = library();
		const a = doc(record('a'), lib);
		a.lyricsMarks.assignStress('0-1', {}, 1, 'user-override');
		a.lyricsMarksGrid = wordGrid(a.inputText);
		await lib.save(a.toRecord());
		await a.close(); // the page's switch: close the outgoing document first
		await lib.save(record('b', { poem: 'Дайте бокалы' }));
		const b = doc((await lib.load('b')).record, lib);
		expect(b.lyricsMarks.stress.size).toBe(0);
		expect('wordMarks' in b.toRecord()).toBe(false);
		await b.close();
		const again = doc((await lib.load('a')).record, lib);
		expect(again.lyricsMarks.stress.get('0-1')).toEqual(stress(1));
	});

	it('a word that moves takes its mark with it, and a deleted word takes its mark away', () => {
		const d = doc(record('a'));
		d.lyricsMarks.assignStress('0-1', {}, 1, 'user-override');
		d.lyricsMarks.toggleYo('0-1-2', 'user-override');
		d.lyricsMarksGrid = wordGrid(d.inputText);
		d.inputText = 'Новая строка\nЯ любил тебя\nМосква';
		d.lyricsMarks.carry({ ...(() => ({ moved: new Map([['0-0', '1-0'], ['0-1', '1-1'], ['0-2', '1-2'], ['1-0', '2-0']]), removed: new Set<string>(), added: new Set(['0-0', '0-1']), unchanged: false }))() });
		d.lyricsMarksGrid = wordGrid(d.inputText);
		const rows = d.toRecord().wordMarks?.lyrics ?? [];
		expect(rows).toContainEqual(['1-1', 'stress', stress(1), 'любил']);
		expect(rows).toContainEqual(['1-1-2', 'yo', { source: 'user-override' }, 'любил']);
		d.inputText = 'Я тебя\nМосква';
		expect(d.toRecord().wordMarks).toBeUndefined();
	});

	it('the text typed but not yet transcribed: the saved row still lands on its own word (Fable amendment 4)', () => {
		const d = doc(record('a'));
		d.lyricsMarks.assignStress('0-1', {}, 1, 'user-override');
		d.lyricsMarksGrid = wordGrid(d.inputText); // the grid the pause last transcribed
		d.inputText = 'Новая строка\nЯ любил тебя\nМосква'; // a line typed above it, inside the pause: no carry has run
		expect(d.lyricsMarks.stress.has('0-1')).toBe(true); // the live map is left alone
		expect(d.toRecord().wordMarks?.lyrics).toEqual([['1-1', 'stress', stress(1), 'любил']]);
	});

	it('drops a row whose word is no longer there, counts it, and keeps the rest', () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		const rows: MarkRow[] = [...lyricsRows, ['0-0', 'stress', stress(0), 'другое']];
		const d = doc(record('a', { name: 'Моя песня', wordMarks: { lyrics: rows } }));
		expect(d.lyricsMarks.stress.has('0-0')).toBe(false);
		expect(d.lyricsMarks.stress.get('0-1')).toEqual(stress(1));
		expect(info).toHaveBeenCalledTimes(1);
		expect(String(info.mock.calls[0][0])).toContain('Моя песня');
		expect(String(info.mock.calls[0][0])).toContain('1 word mark');
	});

	it('a restored ё keeps its stress mark: the anchor is ё-folded, checked on the stored text', () => {
		const d = doc(record('a', { poem: 'Ёлка', wordMarks: { lyrics: [['0-0', 'stress', stress(0), 'елка']] } }));
		expect(d.lyricsMarks.stress.size).toBe(1);
	});

	it('Lyrics that come from the score: rows are held, written back as held, then applied against those words', () => {
		const info = vi.spyOn(console, 'info').mockImplementation(() => {});
		const rows: MarkRow[] = [['0-1', 'stress', stress(1), 'любил'], ['0-2', 'spot', true, 'другая']];
		const d = doc(record('a', { poem: '', wordMarks: { lyrics: rows } }));
		expect(d.lyricsMarks.stress.size).toBe(0);
		expect(d.toRecord().wordMarks?.lyrics).toEqual(rows); // a save in the meantime keeps them
		d.syncLyricsMarks(''); // the score's words are not known yet
		expect(d.lyricsMarks.stress.size).toBe(0);
		d.syncLyricsMarks('Я любил тебя');
		expect(d.lyricsMarks.stress.get('0-1')).toEqual(stress(1));
		expect(d.lyricsMarks.spot.size).toBe(0);
		expect(info).toHaveBeenCalledTimes(1);
		expect(d.toRecord().wordMarks?.lyrics).toEqual([rows[0]]);
	});

	it('a record from another tab replaces the marks (the third way a song opens)', async () => {
		const remote = record('song', { wordMarks: { poem: poemRows } });
		const lib = { lastSavedAt: null, load: vi.fn(async () => ({ record: remote })) } as unknown as Library;
		const d = doc(record('song', { wordMarks: { lyrics: lyricsRows } }), lib);
		expect(d.lyricsMarks.stress.size).toBe(1);
		expect(d.poemMarks.stress.size).toBe(0);
		const other = new BroadcastChannel(LIBRARY_CHANNEL);
		channels.push(other);
		other.postMessage({ songId: 'song', updatedAt: '2026-11-10T00:00:07.000Z' });
		await vi.waitFor(() => expect(d.poemMarks.stress.size).toBe(1));
		expect(d.lyricsMarks.stress.size).toBe(0);
	});
});
