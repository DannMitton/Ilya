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
import { stringKeys, t } from './i18n';

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
 * French spacing before the semicolon, ruled by Dann 2026-09-28 19:42
 * (`docs/memory/PRODUCT.md`): a narrow no-break space, U+202F, before every
 * French semicolon. Markup inside a value is not prose: a semicolon inside a
 * tag (the footer's inline `style`) or ending an entity (`&#160;`) is skipped.
 */
describe('French semicolons carry a narrow no-break space', () => {
	const prose = (s: string) => s.replace(/<[^>]*>/g, '').replace(/&#?\w+;/g, '');
	const unspaced = (s: string) => [...prose(s)].filter((c, i, a) => c === ';' && a[i - 1] !== '\u202f').length;

	it('finds the faults it is looking for', () => {
		expect(unspaced('passaggio; attendez')).toBe(1);
		expect(unspaced('passaggio\u00a0; attendez')).toBe(1);
		expect(unspaced('passaggio ; attendez')).toBe(1);
		expect(unspaced('passaggio\u202f; attendez')).toBe(0);
		expect(unspaced('<span style="width:14px;height:7px">x</span>')).toBe(0);
	});

	it('every French value in i18n.ts has U+202F before each semicolon', () => {
		const faults = stringKeys().filter((k) => unspaced(t(k, 'fr')) > 0);
		expect(faults).toEqual([]);
		// Not vacuous: the table carries French semicolons to check (14 on 2026-09-29).
		const checked = stringKeys().reduce((n, k) => n + (prose(t(k, 'fr')).match(/;/g)?.length ?? 0), 0);
		expect(checked).toBeGreaterThanOrEqual(14);
	});
});
