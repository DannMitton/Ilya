/**
 * Lane 67: the seven strings of the brief's section 6, RATIFIED by Dann 2026-11-18 10:49 ("I ratify them all"), pinned character for character, English and French.
 * French: U+00A0 before the colon of `calib.summary.unstable` (OQLF); the apostrophe of "Ilya's" is straight in English, as the table writes it.
 */
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';

const A = '’'; // the French apostrophe, as the table writes it
// The four `calib.pane.*` pins below are of strings RETIRED by lane 68 (`UNUSED SINCE LANE 68` in `i18n.ts`, replaced by `calib.pane.belowCore`; `lane68-strings.test.ts`): they stay in the table, with their ratified French, and these pins keep them from drifting.
const SEVEN: [string, string, string][] = [
	['calib.pane.coreGeneric', 'You have recorded {n} of the 6 core vowels. Record {m} more, and Ilya builds your resonance profile. Until then, it uses generic values for a {voiceType} voice.', `Vous avez capté {n} des 6 voyelles de base. Captez-en {m} de plus, et Ilya établit votre profil de résonances. D${A}ici là, il utilise des valeurs par défaut pour une voix type de {voiceType}.`],
	['calib.pane.coreGenericOne', 'You have recorded 4 of the 6 core vowels. Record one more, and Ilya builds your resonance profile. Until then, it uses generic values for a {voiceType} voice.', `Vous avez capté 4 des 6 voyelles de base. Captez-en une de plus, et Ilya établit votre profil de résonances. D${A}ici là, il utilise des valeurs par défaut pour une voix type de {voiceType}.`],
	['calib.pane.core', 'You have recorded {n} of the 6 core vowels. Record {m} more, and Ilya builds your resonance profile.', 'Vous avez capté {n} des 6 voyelles de base. Captez-en {m} de plus, et Ilya établit votre profil de résonances.'],
	['calib.pane.coreOne', 'You have recorded 4 of the 6 core vowels. Record one more, and Ilya builds your resonance profile.', 'Vous avez capté 4 des 6 voyelles de base. Captez-en une de plus, et Ilya établit votre profil de résonances.'],
	['calib.summary.unstable', 'These readings were unstable: {vowels}. Another try may help.', 'Ces lectures étaient instables : {vowels}. Une reprise pourrait aider.'],
	['calib.summary.keepOne', 'Keep it', 'Le garder'],
	['calib.summary.useEstimate', "Use Ilya's estimate for now", `Utiliser l${A}estimation d${A}Ilya pour l${A}instant`]
];

describe('the seven ratified strings of lane 67 (the first four retired by lane 68 and kept)', () => {
	for (const [key, en, fr] of SEVEN) {
		it(key, () => {
			expect(t(key, 'en')).toBe(en);
			expect(t(key, 'fr')).toBe(fr);
		});
	}
});
