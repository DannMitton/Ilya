/**
 * N.62: the accessible names a screen reader speaks.
 *
 * Four strings that no sighted singer ever sees stood as English literals in
 * the markup, so a French session heard `Controls`, `Toggle`, `Navigation`,
 * and `Transcription`. They now live here under `a11y.*` keys.
 *
 * The expected values below are copied from Dann's ratified table of
 * 2026-08-23, not read back out of `i18n.ts`, so this test fails if the
 * dictionary drifts from what he approved. `a11y.paper` was re-ruled to
 * Text and Texte, matching `tab.text`, on 2026-09-25 (N.154), and
 * its expectation is copied from that ruling. That is the standing condition
 * on every acceptance test in this repository: no expectation may take its value
 * from the mechanism under test.
 *
 * `[MISSING` is asserted separately from the values because it is the failure
 * `t()` prints for an absent key or an absent language variant, and an
 * `a11y.*` slot with no French would be spoken aloud as that literal string.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { hasString, stringKeys, t } from './i18n';

describe('N.62 accessible names', () => {
	it('speaks the ratified French, and never [MISSING, for all four keys', () => {
		const ratified: Record<string, { en: string; fr: string }> = {
			'a11y.drawer':    { en: 'Controls',           fr: 'Commandes' },
			'a11y.tocToggle': { en: 'Expand or collapse', fr: 'Développer ou réduire' },
			'a11y.tabs':      { en: 'Navigation',         fr: 'Navigation' },
			'a11y.paper':     { en: 'Text',               fr: 'Texte' }
		};

		for (const [key, expected] of Object.entries(ratified)) {
			expect(t(key, 'fr'), key).toBe(expected.fr);
			expect(t(key, 'en'), key).toBe(expected.en);
			expect(t(key, 'fr'), key).not.toContain('[MISSING');
			expect(t(key, 'en'), key).not.toContain('[MISSING');
		}
	});
});

/**
 * The loupe's French, ruled by Dann 2026-09-14 and 2026-09-16
 * (`docs/sessions/spec-loupe-french_r1_2026-09-14.md`). The expected values
 * are copied from that spec, not read back out of `i18n.ts`, on the same
 * standing condition the N.62 test above states.
 */
describe("the loupe's French", () => {
	it('speaks the ruled French, and never [MISSING, for every ruled key', () => {
		const ratified: Record<string, { en: string; fr: string }> = {
			'loupe.redo':            { en: 'Redo: %s',                          fr: 'Refaire : %s' },
			'loupe.undo.placed':     { en: 'syllable placed',                   fr: 'syllabe placée' },
			'loupe.undo.melisma':    { en: 'melisma set',                       fr: 'mélisme défini' },
			'loupe.undo.melismaOff': { en: 'melisma cleared',                   fr: 'mélisme effacé' },
			'loupe.melisma':         { en: 'Melisma',                           fr: 'Mélisme' },
			'loupe.lyric.melisma':   { en: 'This note sustains the syllable',   fr: 'Cette note prolonge la syllabe' },
			'calib.common.retake':   { en: 'Re-take',                           fr: 'Réessayer' },
			'loupe.beat':            { en: 'beat %b',                          fr: 'temps %b' },
			'loupe.beatPulse':       { en: 'beat %b, pulse %p',                 fr: 'temps %b, division %p' },
			'loupe.undo.startOver':  { en: 'placement started over',           fr: 'placement recommencé' }
		};

		for (const [key, expected] of Object.entries(ratified)) {
			expect(t(key, 'fr'), key).toBe(expected.fr);
			expect(t(key, 'en'), key).toBe(expected.en);
			expect(t(key, 'fr'), key).not.toContain('[MISSING');
			expect(t(key, 'en'), key).not.toContain('[MISSING');
			expect(t(key, 'fr'), key).not.toBe(t(key, 'en'));
		}
	});

	it('leaves the two keys the spec names as identical on purpose alone', () => {
		const onPurpose: Record<string, string> = {
			'loupe.pitch.octave':         'octave',
			'loupe.station.corrections':  'Corrections'
		};

		for (const [key, word] of Object.entries(onPurpose)) {
			expect(t(key, 'fr'), key).toBe(word);
			expect(t(key, 'en'), key).toBe(word);
		}
	});
});

/**
 * French spacing follows the OQLF table, ruled by Dann 2026-09-30 21:39
 * (*"Ilya agrees with whatever the conventions for modern Canadian French
 * demand"*; `docs/memory/PRODUCT.md` and `ENVIRONMENT.md`, "THE RULE FOR
 * CANADIAN FRENCH"). No space of any kind before « ; », « ? », or « ! »; a
 * no-break space, U+00A0, before « : »; U+00A0 inside « ». This reverses the
 * semicolon ruling of 2026-09-28, which put U+202F before « ; ».
 *
 * Markup inside a value is not prose: a tag (the footer's inline `style`), an
 * entity (`&#160;`) are skipped. A `{placeholder}` or `{cite:…}` token reads
 * as one letter, because each prints as text (a citation prints as
 * "(Miller 1986, p. 158)", so « lui-même {cite:RMR-057}; mais » is right). A
 * colon between digits (a time, 13:52) or before `//` (a URL) is not
 * punctuation.
 */
describe('French spacing follows the OQLF table', () => {
	const prose = (s: string) => s.replace(/<[^>]*>/g, '').replace(/&#?\w+;/g, '').replace(/\{[^}]*\}/g, 'x');
	const SPACE = /[\s\u00a0\u202f\u2009]/;
	const faults = (s: string): string[] => {
		const out: string[] = [];
		const p = [...prose(s)];
		p.forEach((c, i) => {
			const before = p[i - 1] ?? '';
			const after = p[i + 1] ?? '';
			if (';?!'.includes(c) && SPACE.test(before)) out.push(`space before ${c}`);
			if (c === ':' && !(/\d/.test(before) && /\d/.test(after)) && after !== '/' && before !== '\u00a0') out.push('no U+00A0 before :');
			if (c === '«' && after !== '\u00a0') out.push('no U+00A0 after «');
			if (c === '»' && before !== '\u00a0') out.push('no U+00A0 before »');
		});
		return out;
	};

	it('finds the faults it is looking for', () => {
		expect(faults('passaggio; attendez')).toEqual([]);
		expect(faults('passaggio\u202f; attendez')).toEqual(['space before ;']);
		expect(faults('passaggio\u00a0; attendez')).toEqual(['space before ;']);
		expect(faults('passaggio ; attendez')).toEqual(['space before ;']);
		expect(faults('Supprimer ce chant\u202f?')).toEqual(['space before ?']);
		expect(faults('Supprimer ce chant?')).toEqual([]);
		expect(faults('Mesure 3 : votre')).toEqual(['no U+00A0 before :']);
		expect(faults('Mesure 3: votre')).toEqual(['no U+00A0 before :']);
		expect(faults('Mesure {bar}\u00a0: votre')).toEqual([]);
		expect(faults('«\u00a0{word}\u00a0»')).toEqual([]);
		expect(faults('« mot »')).toEqual(['no U+00A0 after «', 'no U+00A0 before »']);
		expect(faults('à 13:52, via https://kaikki.org')).toEqual([]);
		expect(faults('<span style="width:14px;height:7px">x</span>')).toEqual([]);
		expect(faults('lui-même {cite:RMR-057}; mais')).toEqual([]);
		expect(faults('lui-même {cite:RMR-057} ; mais')).toEqual(['space before ;']);
	});

	/* QUEUE row 70 (Fable's amendment of 2026-10-11 19:30): the same table over
	   the French branch of the two Reading files, where French prose lives in
	   markup rather than in this file. Entities are decoded first, since the
	   markup writes its no-break spaces as `&#160;`. A colon inside an English
	   title keeps its source's punctuation (row 68's rule for a quotation). */
	it('the French branch of Learn and the Guide follows the table', () => {
		const ENGLISH_TITLES = ['Russian Lyric Diction: A', 'Classical Singer: The'];
		for (const [file, open] of [['./components/Reading/LearnContent.svelte', "{#if language === 'fr'}"], ['./components/Reading/GuideContent.svelte', "{#if language === 'fr'}"]] as const) {
			const src = readFileSync(new URL(file, import.meta.url), 'utf8');
			const start = src.indexOf(open);
			const end = src.indexOf('{:else}', start);
			expect(start, file).toBeGreaterThan(0);
			let fr = src.slice(start + open.length, end).replace(/&#160;|&nbsp;/g, '\u00a0').replace(/&#8239;/g, '\u202f');
			for (const title of ENGLISH_TITLES) fr = fr.replaceAll(title, '');
			expect(faults(fr), file).toEqual([]);
			// Not vacuous: each branch holds French colons and guillemets.
			expect((fr.match(/\u00a0:/g) ?? []).length, file).toBeGreaterThan(5);
		}
	});

	it('every French value in i18n.ts follows the table', () => {
		// A key whose French is owed (empty on purpose) reads `[MISSING: key]`, which is not French prose.
		const found = stringKeys().filter((k) => hasString(k, 'fr')).flatMap((k) => faults(t(k, 'fr')).map((f) => `${k}: ${f}`));
		expect(found).toEqual([]);
		// Not vacuous: on 2026-09-30 the table carried 16 « ; », 21 « ? », 62 « : », and 8 « » pairs in French prose.
		const count = (c: string) => stringKeys().filter((k) => hasString(k, 'fr')).reduce((n, k) => n + [...prose(t(k, 'fr'))].filter((x) => x === c).length, 0);
		expect(count(';')).toBeGreaterThanOrEqual(16);
		expect(count('?')).toBeGreaterThanOrEqual(21);
		expect(count(':')).toBeGreaterThanOrEqual(62);
		// 7 since 2026-10-02: the ratified « Qu’est-ce que la friture vocale? » (row 15) dropped the « vocal fry » pair.
		expect(count('«')).toBeGreaterThanOrEqual(7);
	});
});

describe('the octave line strings (QUEUE row 47, ratified by Dann 2026-10-08 01:20)', () => {
	const RATIFIED: Record<string, [string, string]> = {
		'octave.readLower': ['Voice line read an octave lower, for your range', 'Ligne vocale lue une octave plus bas, pour votre ambitus'],
		'octave.readHigher': ['Voice line read an octave higher, for your range', 'Ligne vocale lue une octave plus haut, pour votre ambitus'],
		'octave.asWrittenState': ['Voice line as written', 'Ligne vocale telle qu\u2019\u00e9crite'],
		'octave.toAsWritten': ['As written', 'Telle qu\u2019\u00e9crite'],
		'octave.toForRange': ['Read for your range', 'Lire pour votre ambitus'],
	};

	it('carry the ratified words in both languages, and only these five exist', () => {
		for (const [key, [en, fr]] of Object.entries(RATIFIED)) {
			expect(t(key, 'en'), key).toBe(en);
			expect(t(key, 'fr'), key).toBe(fr);
		}
		expect(stringKeys().filter((k) => k.startsWith('octave.')).sort()).toEqual(Object.keys(RATIFIED).sort());
	});

	it('take the typographic apostrophe, and no colon or guillemets, in French', () => {
		for (const key of Object.keys(RATIFIED)) {
			const fr = t(key, 'fr');
			expect(fr, key).not.toMatch(/[:«»']/);
		}
		expect(t('octave.asWrittenState', 'fr')).toContain('\u2019');
		expect(t('octave.toAsWritten', 'fr')).toContain('\u2019');
	});
});
