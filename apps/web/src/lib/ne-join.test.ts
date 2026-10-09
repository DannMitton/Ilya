/**
 * A word printed apart from its «не» (walk finding 2026-10-09, N.181).
 *
 * «не проглядная» drew «про» as [pro] because «проглядная» is not in the
 * dictionary and «непроглядная» is. These tests give the engine a three-word
 * dictionary, so the lookups are the ones named here and nothing else:
 *
 *   непроглядная  stress index 2 (не-про-ГЛЯД-ная)   joined only
 *   неловко       stress index 1 (не-ЛОВ-ко)          joined AND apart
 *   ловко         stress index 0 (ЛОВ-ко, as stored)  joined AND apart
 *
 * The expectations are syllable counts and indices, read off the words, not
 * values the mechanism produced.
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { setStressDictionary } from '@ilya/phonology';
import { processText } from './pipeline';

const DICTIONARY = {
	непроглядная: { s: 2, e: 'impenetrable', p: 'adj', l: 'непроглядный' },
	неловко: { s: 1, e: 'awkwardly', p: 'adv', l: 'неловко' },
	// Stored with the stress on the first syllable on purpose: where the apart word is found on its
	// own, it stands as printed even when the joined entry would have given a different index.
	ловко: { s: 0, e: 'deftly', p: 'adv', l: 'ловко' },
};

beforeAll(() => setStressDictionary(DICTIONARY));
afterAll(() => setStressDictionary({}));

const wordsOf = (text: string) => processText(text)[0].words;

describe('a word printed apart from its «не»', () => {
	it('takes the joined word’s stress, one syllable on, and keeps its printed spelling', () => {
		const [ne, host] = wordsOf('не проглядная');
		expect(host.cyrillic).toBe('проглядная');
		// не-про-ГЛЯД-ная is index 2 joined, so про-ГЛЯД-ная is index 1 apart.
		expect(host.stressIndex).toBe(1);
		expect(host.stressSource).toBe('dictionary');
		expect(host.originalStressIndex).toBe(1);
		expect(ne.cyrillic).toBe('не');
	});

	it('reduces the pretonic vowel: «про» is [prɑ], not [pro]', () => {
		const apart = wordsOf('не проглядная')[1];
		expect(apart.syllables.map((s) => s.isStressed)).toEqual([false, true, false, false]);
		expect(apart.syllables[0].ipa).toContain('ɑ');
		expect(apart.syllables[0].ipa).not.toContain('o');
	});

	it('control: with no joined entry the same text keeps the vowel cardinal, as the walk saw', () => {
		setStressDictionary({});
		try {
			const apart = wordsOf('не проглядная')[1];
			expect(apart.stressIndex).toBe(-2);
			expect(apart.syllables[0].ipa).toContain('o');
		} finally {
			setStressDictionary(DICTIONARY);
		}
	});

	it('leaves the word alone where it is found on its own: the separate word stands as printed', () => {
		const host = wordsOf('не ловко')[1];
		expect(host.stressIndex).toBe(0);
		expect(host.stressSource).toBe('dictionary');
	});

	it('leaves a word with no joined entry at unknown stress', () => {
		const host = wordsOf('не неведомая')[1];
		expect(host.stressIndex).toBe(-2);
		expect(host.stressSource).toBe('inferred');
	});

	it('does not reach across another word, or past punctuation', () => {
		expect(wordsOf('не она проглядная')[2].stressIndex).toBe(-2);
		expect(wordsOf('не, проглядная')[1].stressIndex).toBe(1);
	});
});
