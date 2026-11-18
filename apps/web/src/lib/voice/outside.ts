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
import { applyIghDivergence, type IghReading } from './engine/divergence';
import { isPersonal, isSung } from './engine/sung';

/** The unstable readings among `order`, kept ones excluded, in the order given (the roster's). A reading counts here only if it is sung (`isSung`). */
export function outsideVowels(
	profile: Partial<Record<Vowel, CalibratedFormant>>,
	order: readonly Vowel[]
): Vowel[] {
	return order.filter((g) => {
		const f = profile[g];
		// A far-off [ɨ] that is also unstable is named by its own note only, so the summary holds one note per vowel.
		return isSung(f) && f.confidence === 'low' && !f.plausibilityOverride && !(g === 'ɨ' && farOffIgh(profile));
	});
}

/**
 * THE FAR-OFF [ɨ] (ruled 2026-11-13 15:13, message ratified 15:29, `docs/memory/OPEN.md:3800-3801`; lane 67, Step 7): a sung [ɨ] far from where the singer's [i] and [u]
 * place it (`applyIghDivergence`, `engine/divergence.ts`: 50 Hz in fR1 or 100 Hz in fR2 off the formula), for a PERSONAL voice only. Below five core vowels
 * Ilya uses no value built from the singer's [i] and [u], so the message would not be true. The note goes quiet on Keep (`plausibilityOverride`), on the mark
 * (`useEstimate`, which `isSung` reads), or on a fresh take, which replaces the reading object. Pure: the pass describes on a clone and the profile is untouched.
 */
export function farOffIgh(profile: Partial<Record<Vowel, CalibratedFormant>>): boolean {
	const igh = profile['ɨ'];
	if (!isPersonal(profile) || !isSung(igh) || igh.plausibilityOverride) return false;
	// A sung [ɨ] with no usable second resonance is never far-off: the pass would read the missing fR2 as 0 and call it divergent, and the singer would be told [ɨ] sits away from [i] and [u] when only its fR2 is missing (lane 68, Fix 2).
	if (!(typeof igh.f2 === 'number' && igh.f2 > 0) || igh.f2Quality === 'absent') return false;
	const clone: Partial<Record<Vowel, IghReading>> = { ...profile, ɨ: { ...igh } };
	applyIghDivergence(clone);
	return clone['ɨ']?.isDivergent === true;
}

/** The profile with the singer's choice "Use Ilya's estimate for now" marked on [ɨ]: a new profile; the reading itself stays stored. */
export function markUseEstimate(profile: Partial<Record<Vowel, CalibratedFormant>>): Partial<Record<Vowel, CalibratedFormant>> {
	const igh = profile['ɨ'];
	return igh ? { ...profile, ɨ: { ...igh, useEstimate: true } } : profile;
}

/**
 * The note's string key: the unstable readings' sentence (`count` is how many readings it names: one takes `calib.summary.unstableOne`, "This reading was unstable", lane 68;
 * two or more take `calib.summary.unstable`), or the far-off [ɨ]'s (`kind` 'igh', `calib.summary.outsideIgh`, ratified 2026-11-13 15:29). No voice type in either.
 */
export function outsideNote(kind: 'unstable' | 'igh' = 'unstable', count = 2): { key: string } {
	return { key: kind === 'igh' ? 'calib.summary.outsideIgh' : count === 1 ? 'calib.summary.unstableOne' : 'calib.summary.unstable' };
}
