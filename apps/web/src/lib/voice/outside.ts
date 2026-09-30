/**
 * The summary's one note (Dann, 2026-09-30 12:43; brief
 * `docs/sessions/brief-code-calibration-first-moments_r1_2026-09-30.md`).
 *
 * Capture asks nothing: a take the guard judges `implausible` advances like
 * any other, and the verdict waits here. The summary names every such reading
 * the singer has not kept, once, and offers Keep or Re-take. The verdict is
 * the one stored at capture (`withPlausibility` in `CalibrationWizard.svelte`),
 * the same field Markup and Insights read through `isUsable`, so the note and
 * the documents cannot disagree.
 */
import type { CalibratedFormant, Vowel } from './engine/types';
import { isTier1 } from './voiceTypes';

/** The readings outside the band, in the order given (the roster's). */
export function outsideVowels(
	profile: Partial<Record<Vowel, CalibratedFormant>>,
	order: readonly Vowel[]
): Vowel[] {
	return order.filter((g) => {
		const f = profile[g];
		return !!f && f.reading !== 'estimated' && f.plausibility === 'implausible' && !f.plausibilityOverride;
	});
}

/**
 * The note's string key and its {type}. A Tier 1 type names itself; "Not sure"
 * and no answer take the sentence without a type, because their readings were
 * judged against every type's values at once (the union bands).
 */
export function outsideNote(voiceType: string | undefined): { key: string; typeId?: string } {
	if (isTier1(voiceType) && voiceType !== 'not-sure')
		return { key: 'calib.summary.outside', typeId: voiceType };
	return { key: 'calib.summary.outsideNoType' };
}
