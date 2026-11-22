/**
 * Voice type slice A (2026-09-30): the identity line with the declared type
 * after the voice's name, in both languages. With no type or "Not sure" the
 * line is exactly the line before the slice.
 */
import { describe, expect, it } from 'vitest';
import { composeIdentityLine, genericLede, methodLineKey, placeholderLabel, restsOnSamples } from './identity';
import { buildVoiceProfileSnapshot } from '$lib/analysis/analyze-score-adapter';
import { pick } from '$lib/analysis/adapter-grid';
import { t } from '$lib/i18n';
import { OTHER } from '$lib/voice/voiceTypes';

const base = { voiceName: 'Dann', voiceUpdatedAt: '2026-09-12T10:00:00.000Z', measured: true };

describe('voice type slice A: the identity line', () => {
	it.each([
		['Other', { voiceType: 'bass', voiceTypeSpecific: OTHER, voiceTypeOther: 'Russian Bass' }, 'INSIGHTS for Dann · Russian Bass · calibrated 2026-09-12', 'APERÇUS pour Dann · Russian Bass · calibration du 2026-09-12'],
		['Tier 2', { voiceType: 'bass', voiceTypeSpecific: 'basso-cantante' }, 'INSIGHTS for Dann · basso cantante · calibrated 2026-09-12', 'APERÇUS pour Dann · basse chantante · calibration du 2026-09-12'],
		['Tier 1', { voiceType: 'bass-baritone' }, 'INSIGHTS for Dann · bass-baritone · calibrated 2026-09-12', 'APERÇUS pour Dann · baryton-basse · calibration du 2026-09-12'],
		['Not sure', { voiceType: 'not-sure' }, 'INSIGHTS for Dann · calibrated 2026-09-12', 'APERÇUS pour Dann · calibration du 2026-09-12'],
		['nothing', undefined, 'INSIGHTS for Dann · calibrated 2026-09-12', 'APERÇUS pour Dann · calibration du 2026-09-12']
	])('%s', (_, voiceType, en, fr) => {
		expect(composeIdentityLine({ ...base, voiceType, language: 'en' })).toBe(en);
		expect(composeIdentityLine({ ...base, voiceType, language: 'fr' })).toBe(fr);
	});

	it('carries the type on the uncalibrated line too, and drops it the same way', () => {
		const un = { voiceName: 'Dann', measured: false };
		expect(composeIdentityLine({ ...un, voiceType: { voiceType: 'tenor' }, language: 'en' })).toBe('INSIGHTS for Dann · tenor · not calibrated');
		expect(composeIdentityLine({ ...un, voiceType: { voiceType: 'tenor' }, language: 'fr' })).toBe('APERÇUS pour Dann · ténor · sans calibration');
		expect(composeIdentityLine({ ...un, language: 'en' })).toBe('INSIGHTS for Dann · not calibrated');
		expect(composeIdentityLine({ ...un, language: 'fr' })).toBe('APERÇUS pour Dann · sans calibration');
	});

	it('prints Other under Not sure after the name, as any label does (desk default, 2026-09-30 10:46)', () => {
		const voiceType = { voiceType: 'not-sure', voiceTypeSpecific: OTHER, voiceTypeOther: 'Russian Bass' };
		expect(composeIdentityLine({ ...base, voiceType, language: 'en' })).toBe('INSIGHTS for Dann · Russian Bass · calibrated 2026-09-12');
		expect(composeIdentityLine({ ...base, voiceType, language: 'fr' })).toBe('APERÇUS pour Dann · Russian Bass · calibration du 2026-09-12');
		const empty = { voiceType: 'not-sure', voiceTypeSpecific: OTHER };
		expect(composeIdentityLine({ ...base, voiceType: empty, language: 'en' })).toBe('INSIGHTS for Dann · calibrated 2026-09-12');
	});

	it('prints a typed label containing a placeholder as typed', () => {
		const voiceType = { voiceType: 'bass', voiceTypeSpecific: OTHER, voiceTypeOther: '{date}' };
		expect(composeIdentityLine({ ...base, voiceType, language: 'en' })).toBe('INSIGHTS for Dann · {date} · calibrated 2026-09-12');
	});
});

/* QUEUE row 166: a declared type with nothing sung computes as a measured voice, but is not calibrated. */
describe('row 166: the identity head of a placeholder voice', () => {
	const un = (type: string | undefined) => buildVoiceProfileSnapshot({}, undefined, undefined, undefined, type);

	it('a generic baritone prints the uncalibrated form, with a date on hand, never "calibrated"', () => {
		const adapted = un('baritone');
		expect(adapted.generic).toBe(true);
		expect(adapted.completeness.formants).toBe(true);
		const input = { voiceName: 'Dann', voiceUpdatedAt: '2026-09-12T10:00:00.000Z', voiceType: { voiceType: 'baritone' }, measured: restsOnSamples(adapted) };
		expect(composeIdentityLine({ ...input, language: 'en' })).toBe('INSIGHTS for Dann · baritone · not calibrated');
		expect(composeIdentityLine({ ...input, language: 'fr' })).toBe('APERÇUS pour Dann · baryton · sans calibration');
	});

	it('a voice with a sung vowel is still calibrated, and a voice with nothing is still not', () => {
		const sung = buildVoiceProfileSnapshot(pick(['e', 'ɛ', 'ɑ', 'o', 'u']), undefined, undefined, undefined, 'baritone'); // five core vowels: the singer's own profile (lane 67)
		expect(restsOnSamples(sung)).toBe(true);
		// Every sampled vowel counts from the first (lane 68): four core vowels, and one, rest on the singer's samples.
		expect(restsOnSamples(buildVoiceProfileSnapshot(pick(['e', 'ɛ', 'ɑ', 'o']), undefined, undefined, undefined, 'baritone'))).toBe(true);
		expect(restsOnSamples(buildVoiceProfileSnapshot(pick(['u']), undefined, undefined, undefined, 'contralto'))).toBe(true);
		expect(restsOnSamples(un('contralto'))).toBe(false);
		expect(restsOnSamples(un('not-sure'))).toBe(false);
		expect(restsOnSamples(un(undefined))).toBe(false);
	});

	it('the method line names no calibration for a placeholder voice, and keeps today\'s keys otherwise', () => {
		expect(methodLineKey({ generic: false, typed: true })).toBe('insights.method.typed');
		expect(methodLineKey({ generic: false, typed: false })).toBe('insights.method.untyped');
		for (const lang of ['en', 'fr'] as const) {
			for (const typed of [true, false]) {
				const line = t(methodLineKey({ generic: true, typed })!, lang);
				expect(line).not.toMatch(/\{date\}|calibration/i);
			}
		}
	});

	it('the method line of a page with no score reads what the voice rests on: samples, generic values, or neither (N.203 Step 8)', () => {
		expect(methodLineKey({ generic: false, typed: false, noScore: true, samples: true })).toBe('insights.method.noScore.samples');
		expect(methodLineKey({ generic: true, typed: true, noScore: true, samples: false })).toBe('insights.method.noScore.generic');
		// Neither: `null`, so the page draws no NOTES (lane 78; the companion's table, `ratified-blank-state-blurbs_2026-11-19.md` section 2 and its correction 1, supersedes Dann's line of 2026-11-16 01:28).
		expect(methodLineKey({ generic: false, typed: false, noScore: true, samples: false })).toBeNull();
		// With a score nothing changes: `noScore` and `samples` are not read.
		expect(methodLineKey({ generic: true, typed: false, samples: true })).toBe('insights.method.generic.untyped');
	});

	it('the three states, from real profiles: a measured voice, a typed voice with generic values, a voice with neither', () => {
		const sung = buildVoiceProfileSnapshot(pick(['e', 'ɛ', 'ɑ', 'o', 'u']), undefined, undefined, undefined, 'baritone'); // five core vowels: the singer's own profile (lane 67)
		const key = (a: Parameters<typeof restsOnSamples>[0]) => methodLineKey({ generic: a.generic, typed: false, noScore: true, samples: restsOnSamples(a) });
		expect(key(sung)).toBe('insights.method.noScore.samples');
		expect(key(un('baritone'))).toBe('insights.method.noScore.generic');
		// QUEUE row 167 (ruling of 2026-11-19): a contralto, a countertenor, and a bass-baritone have generic values now; "Not sure" and no type take none.
		for (const id of ['contralto', 'countertenor', 'bass-baritone']) expect(key(un(id)), id).toBe('insights.method.noScore.generic');
		expect(key(un('not-sure'))).toBeNull();
		expect(key(un(undefined))).toBeNull();
	});

	it('the lede: shown only for a placeholder voice, with the identity line\'s own label (EN lower-cased, FR as printed)', () => {
		const labels: Array<[string, string, string]> = [
			['soprano', 'soprano', 'soprano'],
			['mezzo-soprano', 'mezzo-soprano', 'mezzo-soprano'],
			['tenor', 'tenor', 'ténor'],
			['baritone', 'baritone', 'baryton'],
			['bass', 'bass', 'basse'],
		];
		for (const [id, en, fr] of labels) {
			expect(genericLede(true, { voiceType: id }, 'en')).toBe(
				`These findings use placeholder values for a generic ${en}, not your specific voice.`,
			);
			expect(genericLede(true, { voiceType: id }, 'fr')).toBe(
				`Ces constats reposent sur des valeurs par défaut pour une voix type de ${fr}, et non sur votre voix en particulier.`,
			);
		}
		expect(genericLede(false, { voiceType: 'baritone' }, 'en')).toBeNull();
	});

	// QUEUE row 167, ruling of 2026-11-19 section 6 (RATIFIED 10:08): a sentence never tells a singer the values are their own type's when they are a neighbour's.
	it('the lede for a contralto, a countertenor, and a bass-baritone names the staff the values came from, and never the declared type', () => {
		const rows: Array<[string, string, string]> = [
			['contralto', 'mezzo-soprano', 'mezzo-soprano'],
			['countertenor', 'mezzo and tenor', 'mezzo et ténor'],
			['bass-baritone', 'bass', 'basse'],
		];
		for (const [id, en, fr] of rows) {
			expect(genericLede(true, { voiceType: id }, 'en')).toBe(`These findings use placeholder values for a generic ${en}, not your specific voice.`);
			expect(genericLede(true, { voiceType: id }, 'fr')).toBe(`Ces constats reposent sur des valeurs par défaut pour une voix type de ${fr}, et non sur votre voix en particulier.`);
			// A Tier 2 label or Other's text does not reach the fill.
			for (const own of [{ voiceTypeSpecific: OTHER, voiceTypeOther: 'My Own Name' }, { voiceTypeSpecific: id === 'countertenor' ? 'haute-contre' : id }]) {
				expect(genericLede(true, { voiceType: id, ...own }, 'en'), id).toBe(`These findings use placeholder values for a generic ${en}, not your specific voice.`);
			}
		}
	});

	it('"Not sure" and no type have no lede and no label, whatever Other holds', () => {
		for (const v of [{ voiceType: 'not-sure' }, { voiceType: 'not-sure', voiceTypeSpecific: OTHER, voiceTypeOther: 'Russian Bass' }, {}, { voiceType: 'zzz' }, undefined]) {
			expect(genericLede(false, v, 'en')).toBeNull();
			expect(placeholderLabel(false, v, 'en')).toBeUndefined();
			expect(placeholderLabel(true, v, 'en'), JSON.stringify(v)).toBeUndefined();
		}
	});
});
