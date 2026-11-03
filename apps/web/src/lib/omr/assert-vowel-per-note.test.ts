/**
 * assertVowelPerNote: the one check that keeps a vowelless syllable off a note
 * (`CONTRACT.md` §0.1). Units are made by hand; `underlay-page.test.ts` runs the
 * check inside `seatPage`.
 */
import { describe, expect, it } from 'vitest';
import { assertVowelPerNote, hasVowelLetter, isStrayLetter, isVowelless, wholeTokenOf } from './assert-vowel-per-note';

const u = (text: string) => ({ text, x0: 0, x1: 10 });
const kept = (texts: string[], whole?: (i: number) => boolean) => assertVowelPerNote(texts.map(u), whole).kept.map((k) => k.text);

describe('hasVowelLetter, isVowelless, isStrayLetter', () => {
	it('reads the vowel letters as VOWEL has them: ѣ, і, and ѵ included, й a consonant', () => {
		expect(hasVowelLetter('гѣ')).toBe(true);
		expect(hasVowelLetter('мір')).toBe(true);
		expect(hasVowelLetter('й')).toBe(false);
		expect(isVowelless('й')).toBe(true);
		expect(isVowelless('сп')).toBe(true);
	});

	it('does not call a unit without a letter vowelless: a hyphen, an extender, a mark', () => {
		expect(['-', '_', '', '…'].map(isVowelless)).toEqual([false, false, false, false]);
	});

	it('calls a text whose only letter is one і, ѣ, or ѵ a stray letter, and nothing else', () => {
		expect(['І', 'і', 'ѣ', 'ѵ', 'ѣ-', '(і)'].map(isStrayLetter)).toEqual([true, true, true, true, true, true]);
		expect(['и', 'гѣ', 'іі', 'мир'].map(isStrayLetter)).toEqual([false, false, false, false]);
	});
});

describe('assertVowelPerNote', () => {
	it('refuses a vowelless unit between two syllables, and keeps the order of the rest', () => {
		const out = assertVowelPerNote(['мир', 'т', 'ты'].map(u));
		expect(out.kept.map((k) => k.text)).toEqual(['мир', 'ты']);
		expect(out.refused.map((r) => [r.item.text, r.index, r.why])).toEqual([['т', 1, 'vowelless']]);
	});

	it('keeps a unit with no letter at all: sewWords reads a joint, an extender, and a mark', () => {
		expect(kept(['мир', '-', '_', 'ты'])).toEqual(['мир', '-', '_', 'ты']);
	});

	it('refuses a lone «І» at a row\'s start as a stray mark where it is its whole token', () => {
		const out = assertVowelPerNote(['І', 'мир'].map(u), () => true);
		expect(out.kept.map((k) => k.text)).toEqual(['мир']);
		expect(out.refused.map((r) => r.why)).toEqual(['stray']);
	});

	it('keeps a lone «ѣ» that is a piece of a cut token: «по-ѣ-ду» keeps its «ѣ»', () => {
		// Three units of one token (origin 0, 0, 0): none is a whole token.
		const whole = wholeTokenOf([0, 0, 0], [0, 0, 0]);
		expect(kept(['по-', 'ѣ-', 'ду'], whole)).toEqual(['по-', 'ѣ-', 'ду']);
	});

	it('tests a stray only when told the unit is its whole token: without `whole`, a lone «ѣ» stays', () => {
		expect(kept(['ѣ'])).toEqual(['ѣ']);
	});
});

describe('wholeTokenOf', () => {
	it('reads the origin before the fold: a unit is whole where cutUnits made one unit of its token', () => {
		// Tokens 0 and 2 stayed whole; token 1 was cut in two. After the fold a rider left token 2's neighbour out.
		const whole = wholeTokenOf([0, 1, 1, 2], [0, 1, 2]);
		expect([0, 1, 2].map(whole)).toEqual([true, false, true]);
	});
});
