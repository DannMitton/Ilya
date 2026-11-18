/**
 * The summary's one note on the take's own steadiness (Dann 2026-11-17 23:21 to 23:38, `docs/memory/OPEN.md`, "VOICE: HOW ILYA MEETS A VOICE, AND A BREAK"; lane 67).
 *
 * Capture asks nothing. The summary names the readings that were UNSTABLE, once, and offers Keep or Re-take: a reading whose own evidence is `confidence ===
 * 'low'` (no stable window, a rejected detection, or a signal-to-noise ratio under 12 dB; `analyze.ts`). It is not a comparison with reference values for a
 * voice type, or with the other vowels. Not `reading === 'provisional'`: before lane 64 the guard and the [ɨ] pass also wrote `provisional` on readings with good
 * evidence (`docs/memory/OPEN.md:3800`), and `keepReading` already treats `confidence` as the truth (`plausibility.ts`). Keep marks the reading kept
 * (`plausibilityOverride`, whose name now means "kept") and quiets the note; it changes no number.
 *
 * The note's older form, the readings "outside the values Ilya draws on for {type} voices" and its "Beyond Ilya's reference values" mark, are retired
 * (`i18n.ts`: `calib.summary.outside`, `calib.summary.outsideNoType`, `calib.roster.kept`).
 */
import type { CalibratedFormant, Vowel } from './engine/types';
import { isSung } from './engine/sung';

/** The unstable readings among `order`, kept ones excluded, in the order given (the roster's). A reading counts here only if it is sung (`isSung`). */
export function outsideVowels(
	profile: Partial<Record<Vowel, CalibratedFormant>>,
	order: readonly Vowel[]
): Vowel[] {
	return order.filter((g) => {
		const f = profile[g];
		return isSung(f) && f.confidence === 'low' && !f.plausibilityOverride;
	});
}

/** The note's string key: one sentence, no voice type in it. */
export function outsideNote(): { key: string } {
	return { key: 'calib.summary.unstable' };
}
