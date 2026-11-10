/**
 * syllable-utils.test.ts: ONE VOWEL PER NOTE (CONTRACT §0.1) on a stored syllable division (row 184, as-built review).
 * A division read from storage or a binder is used only where it moves no vowel; otherwise the engine's division stands.
 */
import { describe, expect, it } from 'vitest';
import type { SyllableData } from '@ilya/phonology';
import { boundariesKeepOneVowel, reslicedSyllables } from './syllable-utils';
import type { SyllableOverride, WordStackData } from './types';

const syl = (cyrillic: string): SyllableData => ({ cyrillic, ipa: '', isStressed: false }) as SyllableData;
const word = (parts: string[]): WordStackData =>
	({ lineIndex: 0, wordIndex: 0, syllables: parts.map(syl), displayLog: [], typedBreaks: [], isProclitic: false, isEnclitic: false }) as unknown as WordStackData;
const cut = (parts: string[], boundaries: number[]) =>
	reslicedSyllables(word(parts), new Map<string, SyllableOverride>([['0-0', { boundaries }]]), false)?.map((s) => s.cyrillic);

describe('reslicedSyllables on a stored division', () => {
	it('uses a division that moves no vowel (мос|ква to мо|сква)', () => {
		expect(cut(['мос', 'ква'], [1])).toEqual(['мо', 'сква']);
	});

	it('too few boundaries: keeps the engine division (the word would be one syllable of two vowels)', () => {
		expect(cut(['мо', 'ло', 'ко'], [1])).toBeUndefined();
	});

	it('a boundary past the end: keeps the engine division', () => {
		expect(cut(['мос', 'ква'], [9])).toBeUndefined();
		expect(cut(['мо', 'ло', 'ко'], [1, 9])).toBeUndefined();
	});

	it('a boundary that moves a vowel: keeps the engine division (м|осква leaves one piece with no vowel)', () => {
		expect(cut(['мос', 'ква'], [0])).toBeUndefined();
		// москв|а still holds one vowel in each place, so it moves none and is used
		expect(cut(['мос', 'ква'], [4])).toEqual(['москв', 'а']);
		expect(cut(['мо', 'ло', 'ко'], [0, 2])).toBeUndefined();
	});

	it('й is a consonant: a cut that leaves й with a vowel is still one vowel each', () => {
		expect(cut(['май', 'ка'], [2])).toEqual(['май', 'ка']);
		expect(cut(['май', 'ка'], [1])).toEqual(['ма', 'йка']);
	});
});

describe('boundariesKeepOneVowel (the same refusal, on the letters alone)', () => {
	it('accepts a cut of one vowel a piece, and refuses the others', () => {
		expect(boundariesKeepOneVowel('москва', [1])).toBe(true);
		expect(boundariesKeepOneVowel('москва', [])).toBe(false);
		expect(boundariesKeepOneVowel('москва', [9])).toBe(false);
		expect(boundariesKeepOneVowel('москва', [0])).toBe(false);
		expect(boundariesKeepOneVowel('молоко', [1, 3])).toBe(true);
		expect(boundariesKeepOneVowel('молоко', [3, 1])).toBe(false);
		expect(boundariesKeepOneVowel('молоко', [1, 1])).toBe(false);
		expect(boundariesKeepOneVowel('молоко', [0.5, 3])).toBe(false);
	});
});
