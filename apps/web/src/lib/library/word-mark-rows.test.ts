/**
 * word-mark-rows.test.ts: row 182, step 1. The stored shape of the Inspector's word marks: a round trip of each kind for each
 * witness through the record, a record without the field, and a malformed row dropped alone. Also the pure halves
 * (`rowsFromMaps`, `mapsFromRows`) that step 2 wires to the document.
 */
import { describe, expect, it } from 'vitest';
import { fieldsFromRecord, recordFromFields, validateRecord } from './library';
import { emptySongRecord, type MarkRow, type SongRecord } from './types';
import { emptyMarkMaps, mapsFromRows, rowsFromMaps, validRow, validateWordMarks, type MarkMaps } from './word-mark-rows';
import { wordGrid } from '$lib/pipeline';

const NOW = '2026-11-10T00:00:00.000Z';

const lyricsRows: MarkRow[] = [
	['0-1', 'stress', { stressIndex: 1, stressSource: 'user-override' }, 'любил'],
	['0-1-3', 'yo', { source: 'user-override' }, 'любил'],
	['1-0', 'syllables', { boundaries: [2] }, 'москва'],
	['1-0', 'spot', true, 'москва'],
];
const poemRows: MarkRow[] = [
	['0-0', 'stress', { stressIndex: 0, stressSource: 'user-composer', promotedFromClitic: true }, 'я'],
	['0-2', 'spot', false, 'тебя'],
];

const record = (over: Partial<SongRecord> = {}): SongRecord => ({ ...emptySongRecord('song', NOW), poem: 'Я любил\nмосква', ...over });

describe('the record carries the word marks', () => {
	it('round trips each kind for each witness', () => {
		const stored = recordFromFields(record(), { ...fieldsFromRecord(record()), wordMarks: { lyrics: lyricsRows, poem: poemRows } });
		expect(stored.wordMarks).toEqual({ lyrics: lyricsRows, poem: poemRows });
		const loaded = validateRecord(JSON.parse(JSON.stringify(stored)), 'song', NOW);
		expect(loaded.reason).toBeUndefined();
		expect(loaded.record.wordMarks).toEqual({ lyrics: lyricsRows, poem: poemRows });
		expect(fieldsFromRecord(loaded.record).wordMarks).toEqual({ lyrics: lyricsRows, poem: poemRows });
	});

	it('round trips one witness alone, and leaves the other out', () => {
		const stored = recordFromFields(record(), { ...fieldsFromRecord(record()), wordMarks: { poem: poemRows } });
		expect(stored.wordMarks).toEqual({ poem: poemRows });
		expect('lyrics' in (stored.wordMarks ?? {})).toBe(false);
	});

	it('a record without the field loads as today, and writes none back', () => {
		const loaded = validateRecord(JSON.parse(JSON.stringify(record())), 'song', NOW);
		expect(loaded.reason).toBeUndefined();
		expect('wordMarks' in loaded.record).toBe(false);
		const fields = fieldsFromRecord(loaded.record);
		expect(fields.wordMarks).toEqual({});
		expect('wordMarks' in recordFromFields(loaded.record, fields)).toBe(false);
	});

	it('removing every mark removes the stored field, even though `base` held rows (amendment 7)', () => {
		const base = record({ wordMarks: { lyrics: lyricsRows } });
		const stored = recordFromFields(base, { ...fieldsFromRecord(base), wordMarks: {} });
		expect('wordMarks' in stored).toBe(false);
	});

	it('drops a malformed row alone, and the song still loads whole', () => {
		const raw = JSON.parse(JSON.stringify(record()));
		raw.wordMarks = {
			lyrics: [
				lyricsRows[0],
				['0-1', 'stress', { stressIndex: -1, stressSource: 'user-override' }, 'любил'],
				['0-1', 'stress', { stressIndex: 1, stressSource: 'someone' }, 'любил'],
				['0-1', 'nonsense', true, 'любил'],
				['0-1', 'spot', 'yes', 'любил'],
				['0-1', 'yo', { source: 'user-override' }, 'любил'],
				['1-0', 'syllables', { boundaries: [2, 'x'] }, 'москва'],
				['1-0', 'spot', true, ''],
				'not a row',
				lyricsRows[3],
			],
			poem: 'not a list',
		};
		const loaded = validateRecord(raw, 'song', NOW);
		expect(loaded.reason).toBeUndefined();
		expect(loaded.record.wordMarks).toEqual({ lyrics: [lyricsRows[0], lyricsRows[3]] });
		expect(loaded.record.poem).toBe('Я любил\nмосква');
	});

	it('a wordMarks that is not an object is dropped without costing the song', () => {
		for (const bad of ['x', 3, [], null]) {
			const raw = JSON.parse(JSON.stringify(record()));
			raw.wordMarks = bad;
			const loaded = validateRecord(raw, 'song', NOW);
			expect(loaded.reason).toBeUndefined();
			expect('wordMarks' in loaded.record).toBe(false);
		}
	});

	it('checks the key shape by kind: a ё key has three parts, the others two', () => {
		expect(validRow(['0-1-3', 'yo', { source: 'user-override' }, 'а'])).toBe(true);
		expect(validRow(['0-1', 'yo', { source: 'user-override' }, 'а'])).toBe(false);
		expect(validRow(['0-1-3', 'stress', { stressIndex: 0, stressSource: 'user-override' }, 'а'])).toBe(false);
		expect(validateWordMarks({ lyrics: [] })).toBeUndefined();
	});
});

describe('rows and maps', () => {
	const grid = wordGrid('Я любил тебя\nМосква');

	const maps = (): MarkMaps => ({
		stress: new Map([['0-1', { stressIndex: 1, stressSource: 'user-override' as const }]]),
		yo: new Map([['1-0-3', { source: 'user-override' as const }]]),
		syllables: new Map([['1-0', { boundaries: [2] }]]),
		spot: new Map([['0-2', true], ['0-0', false]]),
	});

	it('writes each mark with the clean form of its word, ё folded, in a fixed order', () => {
		const rows = rowsFromMaps(maps(), grid, null);
		expect(rows).toEqual([
			['0-1', 'stress', { stressIndex: 1, stressSource: 'user-override' }, 'любил'],
			['1-0-3', 'yo', { source: 'user-override' }, 'москва'],
			['1-0', 'syllables', { boundaries: [2] }, 'москва'],
			['0-0', 'spot', false, 'я'],
			['0-2', 'spot', true, 'тебя'],
		]);
		expect(rowsFromMaps(emptyMarkMaps(), grid, null)).toEqual([]);
	});

	it('reads them back, and a spot choice of false stays false', () => {
		const back = mapsFromRows(rowsFromMaps(maps(), grid, null), grid);
		expect(back.dropped).toBe(0);
		expect(back.maps.spot.get('0-0')).toBe(false);
		expect(back.maps.spot.get('0-2')).toBe(true);
		expect(back.maps.stress.get('0-1')).toEqual({ stressIndex: 1, stressSource: 'user-override' });
		expect(back.maps.yo.get('1-0-3')).toEqual({ source: 'user-override' });
		expect(back.maps.syllables.get('1-0')).toEqual({ boundaries: [2] });
	});

	it('drops and counts a row whose anchor is not the word standing at its key', () => {
		const rows = rowsFromMaps(maps(), grid, null);
		const other = wordGrid('Я любил тебя\nМорозко\nещё');
		const back = mapsFromRows(rows, other);
		expect(back.dropped).toBe(2);
		expect(back.maps.stress.size).toBe(1);
		expect(back.maps.spot.get('0-0')).toBe(false);
	});

	it('folds ё against е: a restored ё keeps its mark', () => {
		const rows: MarkRow[] = [['0-0', 'stress', { stressIndex: 0, stressSource: 'user-override' }, 'еж']];
		expect(mapsFromRows(rows, wordGrid('Ёж')).dropped).toBe(0);
		expect(mapsFromRows(rows, wordGrid('Еж')).dropped).toBe(0);
	});

	it('a word that moved: the rows follow it, from the grid the keys describe to the text now (amendment 4)', () => {
		const keyedTo = wordGrid('Я любил тебя\nМосква');
		const now = wordGrid('Новая строка\nЯ любил тебя\nМосква');
		const rows = rowsFromMaps(maps(), keyedTo, now);
		expect(rows.find((r) => r[1] === 'stress')).toEqual(['1-1', 'stress', { stressIndex: 1, stressSource: 'user-override' }, 'любил']);
		expect(rows.find((r) => r[1] === 'yo')?.[0]).toBe('2-0-3');
		expect(mapsFromRows(rows, now).dropped).toBe(0);
	});

	it('a deleted word takes its mark with it', () => {
		const keyedTo = wordGrid('Я любил тебя\nМосква');
		const now = wordGrid('Я тебя\nМосква');
		const rows = rowsFromMaps(maps(), keyedTo, now);
		expect(rows.some((r) => r[1] === 'stress')).toBe(false);
		expect(rows.some((r) => r[1] === 'syllables')).toBe(true);
	});
});
