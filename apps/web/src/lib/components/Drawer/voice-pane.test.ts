import { describe, expect, it } from 'vitest';
import { paneSentence, paneState, recordDoorKey, showVowelSpaceDoor, typeControlLabel, type PaneState } from './voice-pane';
import { t } from '$lib/i18n';
import { usableReadingCount, assignToVoice, type StoredVoice } from '$lib/voice/profileStore';
import { withTier1 } from '$lib/voice/voiceTypes';

const S = (usable: number, voiceType?: string, restWorkedOut = false) => ({ usable, voiceType, restWorkedOut });

describe('the pane’s seven sentence states, English and French, as ratified', () => {
	const cases: [string, ReturnType<typeof S>, PaneState, string, string][] = [
		['nothing recorded, no type', S(0), 'none', 'Record your ten vowels, and Ilya builds your resonance profile. Or choose a voice type, and Ilya starts from generic values for now.', 'Captez vos dix voyelles, et Ilya établit votre profil de résonances. Ou choisissez un type de voix, et Ilya part de valeurs par défaut pour l’instant.'],
		['a type with generic values', S(0, 'bass'), 'typed-generic', 'Ilya is using generic values for a bass voice until you record your own.', 'Ilya utilise des valeurs par défaut pour une voix type de basse jusqu’à ce que vous captiez les vôtres.'],
		['a type with none', S(0, 'contralto'), 'typed-none', 'Ilya has no generic values for a contralto voice yet, so it works from your own vowels. Record them to begin.', 'Ilya n’a pas encore de valeurs par défaut pour une voix de contralto; il travaille donc à partir de vos propres voyelles. Captez-les pour commencer.'],
		['Not sure', S(0, 'not-sure'), 'not-sure', 'Ilya builds your resonance profile from your own vowels, recorded in vocal fry. Record them to begin.', 'Ilya établit votre profil de résonances à partir de vos propres voyelles, captées en friture vocale. Captez-les pour commencer.'],
		['one to nine, the rest filled', S(3, 'bass'), 'some-fills', 'You have recorded 3 of the 10 vowels. Ilya fills the other 7 from what you have recorded so far.', 'Vous avez capté 3 des 10 voyelles. Ilya complète les 7 autres à partir de ce que vous avez capté jusqu’ici.'],
		['one to nine, the rest worked out', S(6, 'bass', true), 'some-works-out', 'You have recorded 6 of the 10 vowels. Ilya works out the other 4 from your own vowels.', 'Vous avez capté 6 des 10 voyelles. Ilya déduit les 4 autres de vos propres voyelles.'],
		['ten recorded', S(10, 'bass'), 'all', 'You have recorded all ten vowels. Your resonance profile is complete.', 'Vous avez capté les dix voyelles. Votre profil de résonances est complet.']
	];
	for (const [name, input, state, en, fr] of cases) {
		it(name, () => {
			expect(paneState(input)).toBe(state);
			expect(paneSentence(input, 'en')).toBe(en);
			expect(paneSentence(input, 'fr')).toBe(fr);
		});
	}
	it('the counted forms for one vowel left', () => {
		expect(paneSentence(S(9), 'en')).toBe('You have recorded 9 of the 10 vowels. Ilya fills the last one from what you have recorded so far.');
		expect(paneSentence(S(9, undefined, true), 'en')).toBe('You have recorded 9 of the 10 vowels. Ilya works out the last one from your own vowels.');
		expect(paneSentence(S(9), 'fr')).toBe('Vous avez capté 9 des 10 voyelles. Ilya complète la dernière à partir de ce que vous avez capté jusqu’ici.');
		expect(paneSentence(S(9, undefined, true), 'fr')).toBe('Vous avez capté 9 des 10 voyelles. Ilya déduit la dernière de vos propres voyelles.');
	});
	it('elides « de » before a vowel in French (« d’alto »-style), through the one helper the other fills use', () => {
		expect(paneSentence(S(0, 'countertenor'), 'fr')).toContain('une voix de contre-ténor');
		expect(paneSentence(S(0, 'mezzo-soprano'), 'fr')).toContain('voix type de mezzo-soprano');
	});
	it('an id this build does not know reads as no type', () => {
		expect(paneState(S(0, 'castrato'))).toBe('none');
	});
	it('every sentence carries no unfilled placeholder', () => {
		for (const [, input] of cases) for (const l of ['en', 'fr'] as const) expect(paneSentence(input, l)).not.toMatch(/[{}]/);
	});
});

describe('a profile whose readings are all beyond the reference values counts them (lane 66, Step 5)', () => {
	const beyond = { f1: 90, confidence: 'high', reading: 'provisional', source: 'measured-user', plausibility: 'implausible' } as const;
	it('usableReadingCount is 2 while two such readings are stored, as it is with both kept: the pane counts what was sung', () => {
		const stored = { a: beyond, e: beyond };
		const kept = { a: { ...beyond, plausibilityOverride: true as const }, e: { ...beyond, plausibilityOverride: true as const } };
		expect(usableReadingCount(stored)).toBe(2);
		expect(usableReadingCount(stored)).toBe(usableReadingCount(kept));
		expect(paneState(S(usableReadingCount(stored)))).toBe(paneState(S(usableReadingCount(kept))));
		expect(recordDoorKey(usableReadingCount(stored))).toBe('calib.pane.door.carryOn');
		expect(recordDoorKey(usableReadingCount(stored))).toBe(recordDoorKey(usableReadingCount(kept)));
	});
	it('a stored estimate, or a take that placed no first resonance, is not a sung reading: the pane says nothing is recorded', () => {
		const stored = { a: { ...beyond, reading: 'estimated' }, e: { ...beyond, f1: 0 } } as const;
		expect(Object.keys(stored).length).toBe(2);
		expect(usableReadingCount(stored)).toBe(0);
		expect(paneState(S(0))).toBe('none');
		expect(recordDoorKey(0)).toBe('calib.pane.door.record');
	});
});

describe('the doors', () => {
	it('the door to recording is named by the usable count', () => {
		expect(t(recordDoorKey(0), 'en')).toBe('Record your vowels');
		expect(t(recordDoorKey(1), 'en')).toBe('Carry on recording');
		expect(t(recordDoorKey(9), 'en')).toBe('Carry on recording');
		expect(t(recordDoorKey(10), 'en')).toBe('Record a vowel again');
		expect(t(recordDoorKey(10), 'fr')).toBe('Capter de nouveau une voyelle');
	});
	it('"Your vowel space" shows for a stored reading or a type with generic values, and not otherwise (amendment 9)', () => {
		expect(showVowelSpaceDoor(true, undefined)).toBe(true);
		expect(showVowelSpaceDoor(false, 'bass')).toBe(true);
		for (const type of [undefined, 'contralto', 'countertenor', 'bass-baritone', 'not-sure']) expect(showVowelSpaceDoor(false, type), String(type)).toBe(false);
	});
});

describe('the voice type control’s label', () => {
	it('prints the type, "Not sure" by its own name, and nothing when no type is stored', () => {
		expect(typeControlLabel({ voiceType: 'bass' }, 'en')).toBe('Bass');
		expect(typeControlLabel({ voiceType: 'not-sure' }, 'en')).toBe('Not sure');
		expect(typeControlLabel({ voiceType: 'not-sure' }, 'fr')).toBe('Je ne sais pas');
		expect(typeControlLabel({}, 'en')).toBeUndefined();
	});
	it('the pane’s control and Welcome store the same voice type', () => {
		const base = { id: 'v', name: 'x', createdAt: 'a', updatedAt: 'a', formants: {} } as StoredVoice;
		const welcome = { ...base } as StoredVoice;
		const pane = { ...base } as StoredVoice;
		assignToVoice(welcome, { voiceType: 'tenor' }); // `VoiceTypeFirst` through `setOwn`
		assignToVoice(pane, withTier1({}, 'tenor')); // `VoiceTypeIntake` through `setOwn`
		expect(pane.voiceType).toBe(welcome.voiceType);
		expect(pane.voiceTypeSpecific).toBe(welcome.voiceTypeSpecific);
	});
});
