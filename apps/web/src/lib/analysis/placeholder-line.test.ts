/**
 * placeholder-line.test.ts: the line at the top of Markup and Insights names
 * the placeholder vowels the page uses (QUEUE row 69). The English and the
 * French are Dann's ratified words of 2026-10-11 (the French singular 19:51,
 * Markup's own last sentence 20:06, the comment's remedy 19:49), pinned here
 * character for character.
 */
import { describe, expect, it } from 'vitest';
import type { AnalyzedScore } from '@ilya/score-parser';
import { placeholderCommentSentence, placeholderLine, placeholderVowels, vowelList } from './placeholder-line';

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
	it('French, one (ratified 19:51)', () => {
		expect(placeholderLine(['ɛ'], 'fr')).toBe(
			'Votre voyelle [ɛ] repose sur une valeur par défaut jusqu’à ce que vous l’échantillonniez en friture vocale, ce que vous pouvez faire à tout moment depuis le tiroir de gauche. Les constats qui en dépendent sont tracés en pointillé.',
		);
	});
	it('Markup, English, several: ends "drawn hollow or dashed" (row 78a)', () => {
		expect(placeholderLine(['ɛ', 'o', 'u'], 'en', 'markup')).toBe(
			'Your [ɛ], [o], and [u] use placeholder values until you sample them in vocal fry, which you can do anytime through the drawer on the left. Findings that rest on a placeholder are drawn hollow or dashed.',
		);
	});
	it('Markup, English, one', () => {
		expect(placeholderLine(['ɛ'], 'en', 'markup')).toBe(
			'Your [ɛ] uses a placeholder value until you sample it in vocal fry, which you can do anytime through the drawer on the left. Findings that rest on it are drawn hollow or dashed.',
		);
	});
	it('Markup, French, several', () => {
		expect(placeholderLine(['ɛ', 'o', 'u'], 'fr', 'markup')).toBe(
			'Vos voyelles [ɛ], [o] et [u] reposent sur des valeurs par défaut jusqu’à ce que vous les échantillonniez en friture vocale, ce que vous pouvez faire à tout moment depuis le tiroir de gauche. Les constats qui en dépendent sont tracés évidés ou en pointillé.',
		);
	});
	it('Markup, French, one', () => {
		expect(placeholderLine(['ɛ'], 'fr', 'markup')).toBe(
			'Votre voyelle [ɛ] repose sur une valeur par défaut jusqu’à ce que vous l’échantillonniez en friture vocale, ce que vous pouvez faire à tout moment depuis le tiroir de gauche. Les constats qui en dépendent sont tracés évidés ou en pointillé.',
		);
	});
	it('a comment names the placeholder, then the remedy, in either language (ratified 19:49)', () => {
		expect(placeholderCommentSentence('ɑ', 'en')).toBe(
			'This finding rests on a placeholder value for [ɑ]. To replace it with your own value, sample [ɑ] in vocal fry.',
		);
		expect(placeholderCommentSentence('ɑ', 'fr')).toBe(
			'Ce constat repose sur une valeur par défaut pour la voyelle [ɑ]. Pour obtenir votre propre valeur, échantillonnez [ɑ] en friture vocale.',
		);
	});
	it('joins a pair on the profile separators', () => {
		expect(vowelList(['o', 'u'], 'en')).toBe('[o] and [u]');
		expect(vowelList(['o', 'u'], 'fr')).toBe('[o] et [u]');
	});
});
