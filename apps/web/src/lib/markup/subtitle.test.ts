import { describe, expect, it } from 'vitest';
import { profileSubtitle } from './subtitle';

describe('row 166: MELODY\'s subtitle', () => {
	it('a placeholder voice prints the ratified subtitle with the identity line\'s label, EN and FR', () => {
		expect(profileSubtitle({ generic: true, voiceName: 'Voice 1', voiceType: { voiceType: 'baritone' }, language: 'en' })).toBe('Formant profile: placeholder values for a generic baritone, not yet your own resonances.');
		expect(profileSubtitle({ generic: true, voiceName: 'Voice 1', voiceType: { voiceType: 'baritone' }, language: 'fr' })).toBe('Profil de formants\u00a0: valeurs par défaut pour le type générique baryton, pas encore vos propres résonances.');
	});
	it('any other voice keeps the two old subtitles', () => {
		expect(profileSubtitle({ generic: false, voiceName: 'Dann', voiceType: { voiceType: 'baritone' }, language: 'en' })).toBe('Formant profile: a map of Dann\u2019s resonances');
		expect(profileSubtitle({ generic: false, language: 'en' })).toBe('Formant profile: a map of your voice\u2019s resonances');
		expect(profileSubtitle({ generic: true, voiceName: 'Dann', language: 'en' })).toBe('Formant profile: a map of Dann\u2019s resonances');
	});
});
