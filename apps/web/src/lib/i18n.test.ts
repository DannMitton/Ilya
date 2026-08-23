/**
 * N.62: the accessible names a screen reader speaks.
 *
 * Four strings that no sighted singer ever sees stood as English literals in
 * the markup, so a French session heard `Controls`, `Toggle`, `Navigation`,
 * and `Transcription`. They now live here under `a11y.*` keys.
 *
 * The expected values below are copied from Dann's ratified table of
 * 2026-08-23, not read back out of `i18n.ts`, so this test fails if the
 * dictionary drifts from what he approved. That is the standing condition on
 * every acceptance test in this repository: no expectation may take its value
 * from the mechanism under test.
 *
 * `[MISSING` is asserted separately from the values because it is the failure
 * `t()` prints for an absent key or an absent language variant, and an
 * `a11y.*` slot with no French would be spoken aloud as that literal string.
 */

import { describe, it, expect } from 'vitest';
import { t } from './i18n';

describe('N.62 accessible names', () => {
	it('speaks the ratified French, and never [MISSING, for all four keys', () => {
		const ratified: Record<string, { en: string; fr: string }> = {
			'a11y.drawer':    { en: 'Controls',           fr: 'Commandes' },
			'a11y.tocToggle': { en: 'Expand or collapse', fr: 'Développer ou réduire' },
			'a11y.tabs':      { en: 'Navigation',         fr: 'Navigation' },
			'a11y.paper':     { en: 'Transcription',      fr: 'Transcription' }
		};

		for (const [key, expected] of Object.entries(ratified)) {
			expect(t(key, 'fr'), key).toBe(expected.fr);
			expect(t(key, 'en'), key).toBe(expected.en);
			expect(t(key, 'fr'), key).not.toContain('[MISSING');
			expect(t(key, 'en'), key).not.toContain('[MISSING');
		}
	});
});
