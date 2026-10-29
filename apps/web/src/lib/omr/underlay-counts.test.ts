/**
 * Two vowels or more in one seated unit, counted and not repaired (brief r5 step 7C).
 */
import { describe, expect, it } from 'vitest';
import { freeNoteXs, manyVowelsInUnits, manyVowelsMerged } from './underlay-counts';
import type { Seat } from './underlay-seat';

const seat = (token: number, text: string, note: number | null, x: number): Seat => ({ token, kind: 'syllable', text, x, note, offset: null, by: 'monotone', unseated: false, runTogether: false, shared: false });

describe('freeNoteXs', () => {
	it('is the x of each note that sings a syllable, sorted', () => {
		expect(freeNoteXs([{ id: 0, x: 300, bar: 1 }, { id: 1, x: 100, bar: 1 }, { id: 2, x: 200, bar: 1, tiedInto: true }, { id: 3, x: 250, bar: 1, underExtender: true }])).toEqual([100, 300]);
	});
});

describe('manyVowelsInUnits (a cut that failed)', () => {
	it('counts a unit of two vowels or more, with its box and the free noteheads between its edges', () => {
		const units = [{ text: 'шумного', x0: 100, x1: 400 }, { text: 'мир', x0: 410, x1: 450 }];
		expect(manyVowelsInUnits(units, [90, 150, 300, 420])).toEqual([{ text: 'шумного', x0: 100, x1: 400, notesBetween: 2 }]);
	});
	it('counts nothing of units of one vowel or none', () => {
		expect(manyVowelsInUnits([{ text: 'в', x0: 0, x1: 10 }, { text: 'бью', x0: 20, x1: 60 }], [5, 30])).toEqual([]);
	});
});

describe('manyVowelsMerged (two tokens on one note)', () => {
	const units = [{ text: 'ко', x0: 100, x1: 140 }, { text: 'ра', x0: 142, x1: 190 }, { text: 'мир', x0: 300, x1: 340 }];
	it('counts two tokens seated on one note whose joined text holds two vowels', () => {
		const seats = [seat(0, 'ко', 7, 120), seat(1, 'ра', 7, 166), seat(2, 'мир', 8, 320)];
		expect(manyVowelsMerged(units, seats, [130, 320])).toEqual([{ text: 'кора', x0: 100, x1: 190, notesBetween: 1 }]);
	});
	it('counts nothing where the two tokens hold one vowel between them, or each is alone on its note', () => {
		expect(manyVowelsMerged(units, [seat(0, 'ко', 7, 120), seat(1, 'мн', 7, 166)], [130])).toEqual([]);
		expect(manyVowelsMerged(units, [seat(0, 'ко', 7, 120), seat(1, 'ра', 8, 166)], [130])).toEqual([]);
	});
	it('changes nothing it is given', () => {
		const seats = [seat(0, 'ко', 7, 120), seat(1, 'ра', 7, 166)];
		const before = JSON.stringify([units, seats]);
		manyVowelsMerged(units, seats, [130]);
		expect(JSON.stringify([units, seats])).toBe(before);
	});
});
