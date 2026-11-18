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
import type { CalibratedFormant, Vowel } from '$lib/voice/engine/types';

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
			'Your [ɛ], [o], and [u] use placeholder values until you sample them in vocal fry, which you can do anytime through the DRAWER on the left. Findings that rest on a placeholder are drawn dashed.',
		);
	});
	it('English, one (ratified)', () => {
		expect(placeholderLine(['ɛ'], 'en')).toBe(
			'Your [ɛ] uses a placeholder value until you sample it in vocal fry, which you can do anytime through the DRAWER on the left. Findings that rest on it are drawn dashed.',
		);
	});
	it('French, several (ratified; the apostrophe typographic)', () => {
		expect(placeholderLine(['ɛ', 'o', 'u'], 'fr')).toBe(
			'Vos voyelles [ɛ], [o] et [u] reposent sur des valeurs par défaut jusqu’à ce que vous les échantillonniez en friture vocale, ce que vous pouvez faire à tout moment depuis le TIROIR de gauche. Les constats qui en dépendent sont tracés en pointillé.',
		);
	});
	it('French, one (ratified 19:51)', () => {
		expect(placeholderLine(['ɛ'], 'fr')).toBe(
			'Votre voyelle [ɛ] repose sur une valeur par défaut jusqu’à ce que vous l’échantillonniez en friture vocale, ce que vous pouvez faire à tout moment depuis le TIROIR de gauche. Les constats qui en dépendent sont tracés en pointillé.',
		);
	});
	it('Markup, English, several: ends "drawn hollow or dashed" (row 78a)', () => {
		expect(placeholderLine(['ɛ', 'o', 'u'], 'en', 'markup')).toBe(
			'Your [ɛ], [o], and [u] use placeholder values until you sample them in vocal fry, which you can do anytime through the DRAWER on the left. Findings that rest on a placeholder are drawn hollow or dashed.',
		);
	});
	it('Markup, English, one', () => {
		expect(placeholderLine(['ɛ'], 'en', 'markup')).toBe(
			'Your [ɛ] uses a placeholder value until you sample it in vocal fry, which you can do anytime through the DRAWER on the left. Findings that rest on it are drawn hollow or dashed.',
		);
	});
	it('Markup, French, several', () => {
		expect(placeholderLine(['ɛ', 'o', 'u'], 'fr', 'markup')).toBe(
			'Vos voyelles [ɛ], [o] et [u] reposent sur des valeurs par défaut jusqu’à ce que vous les échantillonniez en friture vocale, ce que vous pouvez faire à tout moment depuis le TIROIR de gauche. Les constats qui en dépendent sont tracés évidés ou en pointillé.',
		);
	});
	it('Markup, French, one', () => {
		expect(placeholderLine(['ɛ'], 'fr', 'markup')).toBe(
			'Votre voyelle [ɛ] repose sur une valeur par défaut jusqu’à ce que vous l’échantillonniez en friture vocale, ce que vous pouvez faire à tout moment depuis le TIROIR de gauche. Les constats qui en dépendent sont tracés évidés ou en pointillé.',
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

describe('the below-five line (lane 68)', () => {
	const fm = (f1: number, extra: Partial<CalibratedFormant> = {}): CalibratedFormant => ({ f1, f2: 1500, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user', ...extra }) as CalibratedFormant;
	const of = (vs: Vowel[], over: Partial<Record<Vowel, CalibratedFormant>> = {}) => ({ ...Object.fromEntries(vs.map((v) => [v, fm(400)])), ...over }) as Partial<Record<Vowel, CalibratedFormant>>;
	const on = (formants: Partial<Record<Vowel, CalibratedFormant>>, analysed = true) => ({ formants, analysed });

	it('replaces the placeholder line when the page has an analysis, something is sampled, and the voice is not personal: n, the list, and m', () => {
		const en = placeholderLine(['ɛ', 'o'], 'en', 'insights', on(of(['i', 'e', 'u'])))!;
		expect(en).toContain('You have sampled 3 so far ([i], [e], and [u]). Until you provide 2 more, unsampled vowels are assigned placeholder values. Findings that rest on a placeholder are drawn dashed.');
		expect(en.startsWith('To complete your personal vowel space, Ilya needs you to sample at least 5 of these 6 core vowels: [i], [e], [ɛ], [ɑ], [o], and [u].')).toBe(true);
		const fr = placeholderLine([], 'fr', 'insights', on(of(['i', 'e', 'u'])))!;
		expect(fr).toContain('Vous en avez échantillonné 3 jusqu’ici ([i], [e] et [u]). D’ici à ce que vous en fournissiez 2 de plus');
	});
	it('shows for a song that uses no placeholder vowel, and for MELODY with "hollow or dashed"', () => {
		expect(placeholderLine([], 'en', 'insights', on(of(['i'])))).toContain('You have sampled 1 so far ([i]).');
		expect(placeholderLine([], 'en', 'markup', on(of(['i'])))).toContain('drawn hollow or dashed. You can add new fry samples anytime');
		expect(placeholderLine([], 'fr', 'markup', on(of(['i'])))).toContain('tracés évidés ou en pointillé. Vous pouvez');
	});
	it('with one more to go, "1 more" and « une de plus »', () => {
		expect(placeholderLine([], 'en', 'insights', on(of(['i', 'e', 'ɛ', 'ɑ'])))).toContain('Until you provide 1 more,');
		expect(placeholderLine([], 'fr', 'insights', on(of(['i', 'e', 'ɛ', 'ɑ'])))).toContain('fournissiez une de plus,');
	});
	it('counts only stable core vowels: an unstable one is not counted or listed; a hard vowel alone prints 0 with no list and no parentheses', () => {
		const line = placeholderLine([], 'en', 'insights', on(of(['i', 'e'], { u: fm(300, { confidence: 'low' }) })))!;
		expect(line).toContain('You have sampled 2 so far ([i] and [e]). Until you provide 3 more');
		const hardOnly = placeholderLine([], 'en', 'insights', on(of(['ɨ'])))!;
		expect(hardOnly).toContain('You have sampled 0 so far. Until you provide 5 more');
		expect(hardOnly).not.toMatch(/\(|\{/);
		expect(placeholderLine([], 'fr', 'insights', on(of(['ɨ'])))).toContain('Vous en avez échantillonné 0 jusqu’ici. D’ici à ce que vous en fournissiez 5 de plus');
	});
	it('with no analysis shows nothing; personal or nothing sampled gives today\'s line', () => {
		expect(placeholderLine([], 'en', 'insights', on(of(['i']), false))).toBeNull();
		expect(placeholderLine(['ɛ'], 'en', 'insights', on(of(['i']), false))).toBeNull();
		expect(placeholderLine(['ɛ'], 'en', 'insights', on(of(['i', 'e', 'o', 'ɑ', 'u'])))).toBe(placeholderLine(['ɛ'], 'en'));
		expect(placeholderLine(['ɛ'], 'en', 'insights', on({}))).toBe(placeholderLine(['ɛ'], 'en'));
		expect(placeholderLine([], 'en', 'insights', on({}))).toBeNull();
	});
});
