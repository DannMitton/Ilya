/**
 * N.201 step 4, amendment A7: the one definition of "a word the page labels
 * verify". The expectations come from the rule `WordStack.svelte` drew before
 * the move (inferred stress, not a clitic, not a Latin word), written out
 * here as cases and not read back from the function.
 */
import { describe, it, expect } from 'vitest';
import type { LineData, WordStackData } from '$lib/types';
import { countVerifyWords, isVerifyWord } from './verify-words';

function word(over: Partial<WordStackData>): WordStackData {
	return {
		cyrillic: 'слово',
		cleanWord: 'слово',
		stressSource: 'dictionary',
		isProclitic: false,
		isEnclitic: false,
		lineIndex: 0,
		wordIndex: 0,
		...over,
	} as WordStackData;
}

function line(words: WordStackData[]): Pick<LineData, 'words'> {
	return { words };
}

describe('isVerifyWord', () => {
	it('is true for an inferred Russian word', () => {
		expect(isVerifyWord(word({ stressSource: 'inferred' }))).toBe(true);
	});
	it('is false for every other source', () => {
		for (const s of ['dictionary', 'supplement', 'user-override', 'yo-restored', 'user-dictionary']) {
			expect(isVerifyWord(word({ stressSource: s }))).toBe(false);
		}
	});
	it('is false for a clitic, however it was marked', () => {
		expect(isVerifyWord(word({ stressSource: 'inferred', isProclitic: true }))).toBe(false);
		expect(isVerifyWord(word({ stressSource: 'inferred', isEnclitic: true }))).toBe(false);
		expect(isVerifyWord(word({ stressSource: 'clitic' }))).toBe(false);
	});
	it('is false for a Latin word, which has no Russian stress to verify', () => {
		expect(isVerifyWord(word({ stressSource: 'inferred', latin: true, cyrillic: 'amen' }))).toBe(false);
	});
});

describe('countVerifyWords', () => {
	it('is zero for no lines and for lines with none', () => {
		expect(countVerifyWords([])).toBe(0);
		expect(countVerifyWords([line([word({}), word({ wordIndex: 1 })])])).toBe(0);
	});
	it('counts across lines', () => {
		const lines = [
			line([word({ stressSource: 'inferred' }), word({ wordIndex: 1 })]),
			line([word({ lineIndex: 1, stressSource: 'inferred' }), word({ lineIndex: 1, wordIndex: 1, stressSource: 'inferred' })]),
		];
		expect(countVerifyWords(lines)).toBe(3);
	});
	it('skips a token the page does not draw (no Cyrillic, not Latin)', () => {
		expect(countVerifyWords([line([word({ stressSource: 'inferred', cyrillic: '—' })])])).toBe(0);
	});
	it('counts one inferred word beside a clitic and a Latin word as one', () => {
		const lines = [
			line([
				word({ stressSource: 'inferred', isProclitic: true, cyrillic: 'и' }),
				word({ wordIndex: 1, stressSource: 'inferred' }),
				word({ wordIndex: 2, stressSource: 'inferred', latin: true, cyrillic: 'amen' }),
			]),
		];
		expect(countVerifyWords(lines)).toBe(1);
	});
});
