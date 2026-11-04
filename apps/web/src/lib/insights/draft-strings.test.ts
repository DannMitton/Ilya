/**
 * DESK DRAFTS, NOT RATIFIED (2026-11-03, `docs/sessions/brief-code-insights-further-reading_r2_2026-11-03.md`).
 * The words of the second paragraph's opening sentence and of Further reading's topic line are pinned here
 * so a change is deliberate. Dann has ruled the design, not these words; when he rules, this file changes with them
 * (`CONTRACT.md` §1 item 11a). French changes reach the tree as marked drafts he rules on (§7).
 */
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';

const DRAFTS: Record<string, { en: string; fr: string }> = {
	'insights.r2.otherApproaches.one.a': { en: 'There is another way in.', fr: 'Il existe une autre approche.' },
	'insights.r2.otherApproaches.one.b': { en: 'You can also come at it differently.', fr: 'On peut aussi s’y prendre autrement.' },
	'insights.r2.otherApproaches.many.a': { en: 'There are other ways in.', fr: 'Il existe d’autres approches.' },
	'insights.r2.otherApproaches.many.b': { en: 'You can also come at it differently.', fr: 'On peut aussi s’y prendre autrement.' },
	'insights.r2.readingTopic': { en: '[{vowel}] on {pitch}, bar {bar}:', fr: '[{vowel}] sur {pitch}, mesure {bar}\u00a0:' },
	// Not in the brief: the build's addition for a note with no pitch to name.
	'insights.r2.readingTopicNoPitch': { en: '[{vowel}], bar {bar}:', fr: '[{vowel}], mesure {bar}\u00a0:' },
};

describe('the Further reading drafts, pinned', () => {
	for (const [key, want] of Object.entries(DRAFTS)) {
		it(`${key}, English and French`, () => {
			expect(t(key, 'en')).toBe(want.en);
			expect(t(key, 'fr')).toBe(want.fr);
		});
	}
	it('keeps the French clear of « piste » (opener 4 uses it), with the OQLF no-break space before « : »', () => {
		for (const [key, want] of Object.entries(DRAFTS)) {
			expect(want.fr, key).not.toMatch(/piste/i);
			expect(want.fr, key).not.toMatch(/[^\u00a0]:(\s|$)/);
		}
	});
	it('has no em dash in any of them', () => {
		for (const want of Object.values(DRAFTS)) expect(want.en + want.fr).not.toContain('—');
	});
});
