/**
 * Voice type slice A (2026-09-30): the identity line with the declared type
 * after the voice's name, in both languages. With no type or "Not sure" the
 * line is exactly the line before the slice.
 */
import { describe, expect, it } from 'vitest';
import { composeIdentityLine } from './identity';
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
