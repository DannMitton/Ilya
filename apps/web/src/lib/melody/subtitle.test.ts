import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';
import { fillVoiceType } from '$lib/voice/voiceTypes';
import { profileSubtitle } from './subtitle';

describe('row 166: MELODY\'s subtitle', () => {
	it('a placeholder voice prints the ratified subtitle with the identity line\'s label, EN and FR', () => {
		expect(profileSubtitle({ generic: true, voiceName: 'Voice 1', voiceType: { voiceType: 'baritone' }, language: 'en' })).toBe('Resonance profile: placeholder values for a generic baritone, not yet your own resonances.');
		expect(profileSubtitle({ generic: true, voiceName: 'Voice 1', voiceType: { voiceType: 'baritone' }, language: 'fr' })).toBe('Profil de résonances\u00a0: valeurs par défaut pour une voix type de baryton, pas encore vos propres résonances.');
	});
	it('any other voice keeps the two old subtitles', () => {
		expect(profileSubtitle({ generic: false, voiceName: 'Dann', voiceType: { voiceType: 'baritone' }, language: 'en' })).toBe('Resonance profile: a map of Dann\u2019s resonances');
		expect(profileSubtitle({ generic: false, language: 'en' })).toBe('Resonance profile: a map of your voice\u2019s resonances');
		expect(profileSubtitle({ generic: true, voiceName: 'Dann', language: 'en' })).toBe('Resonance profile: a map of Dann\u2019s resonances');
	});
	it('a bass who typed their own words still reads "bass": the label is the staff, never the typed text (lane 74, item 3)', () => {
		const o = { generic: true, voiceType: { voiceType: 'bass', voiceTypeSpecific: 'other', voiceTypeOther: 'octaviste' }, language: 'fr' } as const;
		expect(profileSubtitle(o)).toBe('Profil de résonances\u00a0: valeurs par défaut pour une voix type de basse, pas encore vos propres résonances.');
		expect(profileSubtitle({ ...o, voiceType: { ...o.voiceType, voiceTypeOther: 'heldentenor' } })).toBe('Profil de résonances\u00a0: valeurs par défaut pour une voix type de basse, pas encore vos propres résonances.');
	});
	it('the French elision rule, pinned on `fillVoiceType` itself: « de » becomes « d’ » before a vowel letter and stays before a consonant or an h (step 2; no live path reaches it, lane 74 step 2)', () => {
		const template = t('profile.subtitlePlaceholder', 'fr');
		expect(fillVoiceType(template, 'octaviste', 'fr')).toBe('Profil de résonances\u00a0: valeurs par défaut pour une voix type d\u2019octaviste, pas encore vos propres résonances.');
		expect(fillVoiceType(template, 'heldentenor', 'fr')).toBe('Profil de résonances\u00a0: valeurs par défaut pour une voix type de heldentenor, pas encore vos propres résonances.');
		expect(fillVoiceType(template, 'basse', 'fr')).toBe('Profil de résonances\u00a0: valeurs par défaut pour une voix type de basse, pas encore vos propres résonances.');
		expect(fillVoiceType(template, 'élève', 'fr')).toContain('type d\u2019élève');
		// English never elides.
		expect(fillVoiceType(t('profile.subtitlePlaceholder', 'en'), 'octavist', 'en')).toContain('a generic octavist');
	});
});
