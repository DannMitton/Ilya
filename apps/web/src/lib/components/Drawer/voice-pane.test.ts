import { describe, expect, it } from 'vitest';
import { paneSentence, paneState, recordDoorKey, showVowelSpaceDoor, typeControlLabel, type PaneState } from './voice-pane';
import { t } from '$lib/i18n';
import { usableReadingCount, assignToVoice, type StoredVoice } from '$lib/voice/profileStore';
import { withTier1 } from '$lib/voice/voiceTypes';
import { CORE_VOWELS } from '$lib/voice/engine/sung';

/** `core` is the number of stable core vowels (the first `core` of the roster's six; the pane takes the list), and defaults to 6: the first seven states are those of a voice with five or more core vowels (or none sung, where `core` is 0 and `usable` is 0). */
const S = (usable: number, voiceType?: string, restWorkedOut = false, core = usable === 0 ? 0 : 6) => ({ usable, core: CORE_VOWELS.slice(0, core), voiceType, restWorkedOut });

describe('the pane’s sentence states, English and French, as ratified', () => {
	const cases: [string, ReturnType<typeof S>, PaneState, string, string][] = [
		['nothing recorded, no type', S(0), 'none', 'Record your ten vowels, and Ilya builds your resonance profile. Or choose a voice type, and Ilya starts from generic values for now.', 'Captez vos dix voyelles, et Ilya établit votre profil de résonances. Ou choisissez un type de voix, et Ilya part de valeurs par défaut pour l’instant.'],
		['a type with generic values', S(0, 'bass'), 'typed-generic', 'Ilya is using generic values for a bass voice until you record your own.', 'Ilya utilise des valeurs par défaut pour une voix type de basse jusqu’à ce que vous captiez les vôtres.'],
		// QUEUE row 167 (ruling of 2026-11-19): a contralto, a countertenor, and a bass-baritone have generic values now, named by the staff they borrow. The "typed, none" state is gone.
		['a contralto', S(0, 'contralto'), 'typed-generic', 'Ilya is using generic values for a mezzo-soprano voice until you record your own.', 'Ilya utilise des valeurs par défaut pour une voix type de mezzo-soprano jusqu’à ce que vous captiez les vôtres.'],
		['a countertenor', S(0, 'countertenor'), 'typed-generic', 'Ilya is using generic values for a mezzo and tenor voice until you record your own.', 'Ilya utilise des valeurs par défaut pour une voix type de mezzo et ténor jusqu’à ce que vous captiez les vôtres.'],
		['a bass-baritone', S(0, 'bass-baritone'), 'typed-generic', 'Ilya is using generic values for a bass voice until you record your own.', 'Ilya utilise des valeurs par défaut pour une voix type de basse jusqu’à ce que vous captiez les vôtres.'],
		// RATIFIED by Dann 2026-11-19 11:59 (ruling section 8), replacing the earlier text whole.
		['Not sure', S(0, 'not-sure'), 'not-sure', 'Not knowing is a fine answer. Record your vowels in vocal fry and Ilya works from your own voice, which also gives you evidence in your own search. Or choose a voice type, and Ilya starts from published values for it.', 'Ne pas savoir est une réponse valable. Captez vos voyelles en friture vocale et Ilya travaille à partir de votre propre voix, ce qui vous donne aussi des indices dans votre propre recherche. Ou choisissez un type de voix, et Ilya part de valeurs publiées pour celui-ci.'],
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
	it('fills through the one helper the other fills use, from the Tier 1 id: a bass who chose octavist reads "a bass voice" (never "octavist")', () => {
		expect(paneSentence(S(0, 'mezzo-soprano'), 'fr')).toContain('voix type de mezzo-soprano');
		expect(paneSentence(S(0, 'bass'), 'en')).toBe('Ilya is using generic values for a bass voice until you record your own.');
		expect(paneSentence(S(0, 'bass'), 'fr')).toContain('voix type de basse');
	});
	it('"typed, none" is gone: every Tier 1 id but "Not sure" is typed-generic with nothing recorded, and "Not sure" and an unknown id are not', () => {
		for (const id of ['soprano', 'mezzo-soprano', 'contralto', 'countertenor', 'tenor', 'baritone', 'bass-baritone', 'bass']) expect(paneState(S(0, id)), id).toBe('typed-generic');
		expect(paneState(S(0, 'not-sure'))).toBe('not-sure');
		expect(paneState(S(0, 'castrato'))).toBe('none');
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

describe('below five stable core vowels (lane 68): how many, which, and how many more complete the profile', () => {
	const EN = (n: number, list: string) => `You have sampled ${n} of the 6 core vowels so far${list}. To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide ${5 - n} more, unsampled vowels are assigned placeholder values.`;
	const FR = (n: number, list: string) => `Vous avez échantillonné ${n} des 6 voyelles de base jusqu’ici${list}. Pour compléter votre espace vocalique personnel, Ilya a besoin d’au moins 5 échantillons stables en friture vocale. D’ici à ce que vous en fournissiez ${5 - n === 1 ? 'une' : 5 - n} de plus, les voyelles non échantillonnées reçoivent des valeurs par défaut.`;
	const LISTS_EN = [' ([i])', ' ([i] and [e])', ' ([i], [e], and [ɛ])', ' ([i], [e], [ɛ], and [ɑ])'];
	const LISTS_FR = [' ([i])', ' ([i] et [e])', ' ([i], [e] et [ɛ])', ' ([i], [e], [ɛ] et [ɑ])'];
	it('prints the ratified sentence with the count, the list, and what is left, for 1 to 4 stable core vowels, for every type', () => {
		for (const type of ['bass', 'soprano', 'contralto', 'countertenor', 'bass-baritone', 'not-sure', undefined]) {
			for (const n of [1, 2, 3, 4]) {
				const input = S(n, type, false, n);
				expect(paneState(input), `${type} ${n}`).toBe('below-core');
				expect(paneSentence(input, 'en'), `${type} ${n}`).toBe(EN(n, LISTS_EN[n - 1]));
				expect(paneSentence(input, 'fr'), `${type} ${n}`).toBe(FR(n, LISTS_FR[n - 1]));
			}
		}
	});
	it('with one more to go, the "one more" forms: "Until you provide 1 more" and « D’ici à ce que vous en fournissiez une de plus »', () => {
		expect(paneSentence(S(4, 'bass', false, 4), 'en')).toContain('Until you provide 1 more, unsampled');
		expect(paneSentence(S(4, 'bass', false, 4), 'fr')).toContain('D’ici à ce que vous en fournissiez une de plus, les voyelles');
	});
	it('a voice with only a hard vowel sampled (usable 1, no core vowel) prints "0" and leaves out the list with its parentheses', () => {
		const input = S(1, 'bass', false, 0);
		expect(paneState(input)).toBe('below-core');
		expect(paneSentence(input, 'en')).toBe(EN(0, ''));
		expect(paneSentence(input, 'fr')).toBe(FR(0, ''));
		expect(paneSentence(input, 'en')).not.toMatch(/fills|other 9|\(|\)/);
	});
	it('is tested before ten usable: ten readings with four stable core vowels is still below five', () => {
		expect(paneState(S(10, 'bass', false, 4))).toBe('below-core');
		expect(paneState(S(10, 'bass', false, 5))).toBe('all');
	});
	it('at five and six core vowels the existing states apply unchanged', () => {
		expect(paneState(S(5, 'bass', false, 5))).toBe('some-fills');
		expect(paneState(S(5, 'bass', true, 5))).toBe('some-works-out');
		expect(paneState(S(6, 'bass', true, 6))).toBe('some-works-out');
		expect(paneState(S(10, 'bass', false, 6))).toBe('all');
		expect(paneSentence(S(5, 'bass', false, 5), 'en')).toBe('You have recorded 5 of the 10 vowels. Ilya fills the other 5 from what you have recorded so far.');
	});
	it('nothing sung keeps the four states with nothing recorded', () => {
		expect(paneState(S(0, 'bass'))).toBe('typed-generic');
		expect(paneState(S(0))).toBe('none');
	});
	it('every sentence carries no unfilled placeholder', () => {
		for (const type of ['soprano', 'tenor', 'bass', 'baritone', 'mezzo-soprano']) for (const n of [0, 1, 4]) for (const l of ['en', 'fr'] as const) expect(paneSentence(S(1, type, false, n), l)).not.toMatch(/[{}]/);
	});
	it('the door names are unchanged', () => {
		expect(recordDoorKey(3)).toBe('calib.pane.door.carryOn');
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
	it('"Your vowel space" shows for a stored reading or one of the eight types with generic values, and not otherwise (amendment 9; QUEUE row 167)', () => {
		expect(showVowelSpaceDoor(true, undefined)).toBe(true);
		for (const type of ['soprano', 'mezzo-soprano', 'contralto', 'countertenor', 'tenor', 'baritone', 'bass-baritone', 'bass']) expect(showVowelSpaceDoor(false, type), type).toBe(true);
		for (const type of [undefined, '', 'not-sure', 'castrato']) expect(showVowelSpaceDoor(false, type), String(type)).toBe(false);
		expect(showVowelSpaceDoor(true, 'not-sure')).toBe(true);
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
