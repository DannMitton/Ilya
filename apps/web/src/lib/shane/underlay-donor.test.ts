/**
 * N.10: the donor matching rule (`underlay-donor.ts`).
 *
 * What these pin down is POSITION. E.31 §1.5 rejected keying the singer's
 * overrides by spelling because that "over-applies to repeated words and
 * homographs, and Russian stress minimal pairs are exactly the words a
 * singer overrides." The tests that matter here are therefore the ones with
 * a repeated word in them: a rule that passed every other case and failed
 * those would be the rejected design wearing a new name.
 *
 * No IPA and no engine appear in this file. The unit under test is a string
 * alignment; what the aligned words then transcribe to is
 * `vowel-resolver.test.ts`'s business.
 */

import { describe, expect, it } from 'vitest';
import { MAX_ALIGNMENT_CELLS, flattenTranscribedWords, matchDonors } from './underlay-donor';
import type { LineData, WordStackData } from '$lib/types';

/** A word stack with only the field the aligner reads. */
const w = (cleanWord: string) => ({ cleanWord }) as WordStackData;
const line = (lineNumber: number, words: string[]): LineData => ({
	lineNumber,
	words: words.map(w)
});

describe('matchDonors: position, not spelling', () => {
	it('pairs a repeated word first-with-first and second-with-second', () => {
		// The whole reason this is an alignment. A spelling-keyed map would
		// give both occurrences the same donor.
		expect(matchDonors(['замок', 'дом', 'замок'], ['замок', 'дом', 'замок'])).toEqual([0, 1, 2]);
	});

	it('keeps the pairing when the poem carries a word the score does not sing', () => {
		expect(matchDonors(['а', 'б', 'в'], ['а', 'х', 'б', 'в'])).toEqual([0, 2, 3]);
	});

	it('leaves a score word unpaired when the poem lacks it, and resumes after', () => {
		expect(matchDonors(['а', 'б', 'в'], ['а', 'в'])).toEqual([0, null, 1]);
	});

	it('pairs verse 1 of a score against a poem typed in full', () => {
		// The ordinary case today: Transcribe holds every verse, Fit reads one.
		const score = ['ты', 'моя', 'заря'];
		const poem = ['ты', 'моя', 'заря', 'ты', 'моё', 'солнце'];
		expect(matchDonors(score, poem)).toEqual([0, 1, 2]);
	});

	it('never pairs two words at once, even when the text is transposed', () => {
		const got = matchDonors(['а', 'б'], ['б', 'а']);
		expect(got.filter((x) => x !== null)).toHaveLength(1);
	});
});

describe('matchDonors: the abstentions', () => {
	it('pairs nothing when either side is empty', () => {
		expect(matchDonors([], ['а'])).toEqual([]);
		expect(matchDonors(['а'], [])).toEqual([null]);
	});

	it('never pairs an empty cleaned form with another', () => {
		// A punctuation-only token cleans to '' on both sides. Pairing those
		// would hand a real word the wrong donor.
		expect(matchDonors(['', ''], ['', ''])).toEqual([null, null]);
	});

	it('abstains entirely rather than build a table past the ceiling', () => {
		// Degrades to the pre-N.10 page, never to a wrong one.
		expect(matchDonors(['а', 'б'], ['а', 'б'], 4)).toEqual([null, null]);
		expect(MAX_ALIGNMENT_CELLS).toBeGreaterThan(4);
	});

	it('the ceiling is a real guard, not a formality', () => {
		// A control that cannot fail is not a check: the same input under the
		// default ceiling must pair.
		expect(matchDonors(['а', 'б'], ['а', 'б'])).toEqual([0, 1]);
	});
});

describe('flattenTranscribedWords', () => {
	it('keeps reading order across lines', () => {
		const got = flattenTranscribedWords([line(0, ['а', 'б']), line(1, ['в'])]);
		expect(got.map((x) => x.cleanWord)).toEqual(['а', 'б', 'в']);
	});

	it('returns nothing for no lines, and for lines with no words', () => {
		expect(flattenTranscribedWords([])).toEqual([]);
		expect(flattenTranscribedWords([line(0, [])])).toEqual([]);
	});
});
