/**
 * placeholder-line.test.ts: the line at the top of Markup and Insights names
 * the placeholder vowels the page uses (QUEUE row 69). The English and the
 * French plural are Dann's ratified words of 2026-10-11, pinned here
 * character for character; the French singular is the desk's derivation.
 */
import { describe, expect, it } from 'vitest';
import type { AnalyzedScore } from '@ilya/score-parser';
import { placeholderLine, placeholderVowels, vowelList } from './placeholder-line';

const analysed = (events: Array<[string, boolean]>): AnalyzedScore =>
	({
		events: Object.fromEntries(events.map(([vowel, ph], i) => [`n${i}`, { eventId: `n${i}`, vowel, ...(ph ? { placeholder: true } : {}) }])),
	}) as unknown as AnalyzedScore;

describe('which vowels', () => {
	it('names the placeholder vowels the page uses, once each, in roster order', () => {
		expect(placeholderVowels(analysed([['u', true], ['ɛ', true], ['a', false], ['o', true], ['u', true]]))).toEqual(['ɛ', 'o', 'u']);
	});
	it('names none without an analysis or without a placeholder', () => {
		expect(placeholderVowels(null)).toEqual([]);
		expect(placeholderVowels(analysed([['a', false]]))).toEqual([]);
	});
});

describe('the line', () => {
	it('prints nothing when the page uses no placeholder', () => {
		expect(placeholderLine([], 'en')).toBeNull();
	});
	it('English, several (ratified)', () => {
		expect(placeholderLine(['ɛ', 'o', 'u'], 'en')).toBe(
			'Your [ɛ], [o], and [u] use placeholder values until you sample them in vocal fry, which you can do anytime through the drawer on the left. Findings that rest on a placeholder are drawn dashed.',
		);
	});
	it('English, one (ratified)', () => {
		expect(placeholderLine(['ɛ'], 'en')).toBe(
			'Your [ɛ] uses a placeholder value until you sample it in vocal fry, which you can do anytime through the drawer on the left. Findings that rest on it are drawn dashed.',
		);
	});
	it('French, several (ratified; the apostrophe typographic)', () => {
		expect(placeholderLine(['ɛ', 'o', 'u'], 'fr')).toBe(
			'Vos voyelles [ɛ], [o] et [u] reposent sur des valeurs par défaut jusqu’à ce que vous les échantillonniez en friture vocale, ce que vous pouvez faire à tout moment depuis le tiroir de gauche. Les constats qui en dépendent sont tracés en pointillé.',
		);
	});
	it('French, one (desk-derived)', () => {
		expect(placeholderLine(['ɛ'], 'fr')).toBe(
			'Votre voyelle [ɛ] repose sur une valeur par défaut jusqu’à ce que vous l’échantillonniez en friture vocale, ce que vous pouvez faire à tout moment depuis le tiroir de gauche. Les constats qui en dépendent sont tracés en pointillé.',
		);
	});
	it('joins a pair on the profile separators', () => {
		expect(vowelList(['o', 'u'], 'en')).toBe('[o] and [u]');
		expect(vowelList(['o', 'u'], 'fr')).toBe('[o] et [u]');
	});
});
