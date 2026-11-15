/**
 * Voice type slice A (2026-09-30): the identity line with the declared type
 * after the voice's name, in both languages. With no type or "Not sure" the
 * line is exactly the line before the slice.
 */
import { describe, expect, it } from 'vitest';
import { composeIdentityLine, genericLede, methodLineKey, restsOnSamples } from './identity';
import { buildVoiceProfileSnapshot } from '$lib/analysis/analyze-score-adapter';
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
		const sung = buildVoiceProfileSnapshot({ u: { f1: 330, f2: 800, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user' } as never }, undefined, undefined, undefined, 'baritone');
		expect(restsOnSamples(sung)).toBe(true);
		expect(restsOnSamples(un('contralto'))).toBe(false);
		expect(restsOnSamples(un(undefined))).toBe(false);
	});

	it('the method line names no calibration for a placeholder voice, and keeps today\'s keys otherwise', () => {
		expect(methodLineKey({ generic: false, typed: true })).toBe('insights.method.typed');
		expect(methodLineKey({ generic: false, typed: false })).toBe('insights.method.untyped');
		for (const lang of ['en', 'fr'] as const) {
			for (const typed of [true, false]) {
				const line = t(methodLineKey({ generic: true, typed }), lang);
				expect(line).not.toMatch(/\{date\}|calibration/i);
			}
		}
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
});
