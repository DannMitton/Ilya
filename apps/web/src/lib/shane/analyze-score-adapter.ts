/**
 * The analysis adapter: the active voice's stored calibration to the overlay
 * engine's VoiceProfileSnapshot (E.5 slice 4).
 *
 * `analyzeScore` reads one minimal shape, `VoiceProfileSnapshot`
 * (analysis-types.ts): per-vowel fR1, plus an OPTIONAL singer range,
 * tessitura, and passaggio. The app stores those across two places: measured
 * resonances in `VoiceProfile.calibratedFormants` (engine/types.ts) and the
 * typed edges in `VoiceCharacteristics`, every field of which is optional
 * because the wizard's Voice characteristics phase is skippable (§A.31).
 * This adapter is the one seam that reconciles the two.
 *
 * Honesty model, Option A (Dann ruled 2026-07-15, replacing the earlier
 * sentinel-band design): **genuine absence, not a permissive default.** A
 * dimension the singer did not provide is simply omitted from the snapshot.
 * The overlay engine reads that absence directly (`profile.range === undefined`,
 * and so on) and skips the comparison rather than being handed inert bounds
 * engineered to never fire. `undefined` on `rangeStatus` or `inPassaggio`
 * means "not assessed"; it is never collapsed into a negative finding.
 *
 * Why this replaced the sentinel design: the sentinel bands' correctness
 * depended on a cross-module proof, pinned to a date, against
 * overlay-engine.ts's exact comparisons. Nothing enforced that proof; a
 * changed comparison there could make a sentinel start firing silently, and
 * the failure would look like a real analysis result rather than a bug.
 * Correct by construction (the type says "may be absent," the engine handles
 * absence) beats correct by cross-module audit.
 *
 * The COMPLETENESS descriptor is now derived from the snapshot, not tracked
 * in parallel (`completenessOf` below): the snapshot is the single truth,
 * and completeness is a view of it, so the two channels cannot disagree.
 */

import type { VoiceProfileSnapshot } from '@ilya/score-parser';
import type { CalibratedFormant, VoiceCharacteristics, Vowel } from './engine/types';

/**
 * Which analysis dimensions rest on real singer input. Derived from the
 * snapshot (`completenessOf`), never tracked independently of it.
 */
export interface AnalysisCompleteness {
	/** At least one measured fR1 is present, so acoustic marks can be forecast. */
	formants: boolean;
	/** Both range edges were provided. */
	range: boolean;
	/** Both tessitura edges were provided. */
	tessitura: boolean;
	/** Both passaggio edges were provided: the zona di passaggio needs primo and secondo (§B.3). */
	passaggio: boolean;
}

/** The adapter's result: the engine's snapshot plus the completeness signal. */
export interface AdaptedProfile {
	snapshot: VoiceProfileSnapshot;
	completeness: AnalysisCompleteness;
}

/**
 * True when any dimension the broad-analysis note tracks is a default rather
 * than real singer input. Formants are excluded: with no fR1 the engine
 * omits every event, so the render is notation-only and the note has nothing
 * to qualify.
 */
export function isBroadAnalysis(c: AnalysisCompleteness): boolean {
	return !(c.range && c.tessitura && c.passaggio);
}

/**
 * Completeness derived from the snapshot itself: the snapshot is the single
 * truth, and this is a view of it, so the two can never disagree (Option A,
 * replacing the earlier parallel-tracked completeness).
 */
export function completenessOf(s: VoiceProfileSnapshot): AnalysisCompleteness {
	return {
		formants: Object.keys(s.fR1).length > 0,
		range: s.range !== undefined,
		tessitura: s.tessitura !== undefined,
		passaggio: s.passaggio !== undefined,
	};
}

/**
 * Build the overlay-engine snapshot from the active voice's stored formants
 * and typed characteristics. Pure: no store reads, no DOM, deterministic, so
 * it is sandbox-testable the way `analyzeScore` is.
 *
 * @param formants the active voice's direct-sample formants (captured or
 *   provisional); a reading with no usable f1, or one the plausibility guard
 *   judged implausible, contributes no fR1 (§B.4).
 * @param characteristics the typed range/tessitura/passaggio, or undefined
 *   when the singer skipped the phase entirely.
 * @param label optional citation-block label (e.g. the voice name or type).
 */
export function buildVoiceProfileSnapshot(
	formants: Partial<Record<Vowel, CalibratedFormant>>,
	characteristics: VoiceCharacteristics | undefined,
	label?: string,
): AdaptedProfile {
	// fR1 per vowel from the measured formants. A vowel the singer never sang,
	// or a reading with no usable f1, contributes nothing: the engine already
	// omits any event whose vowel has no fR1, so silence here is honest.
	//
	// §B.4 RULED (Dann, 2026-07-15): the same silence extends to a reading the
	// plausibility guard judged IMPLAUSIBLE, and to nothing else. Fit will not
	// build acoustic marks on a number the engine has already decided cannot be
	// that vowel (the motivating class: fR1 ≈ 1063 Hz extracted for a sung [i]).
	//
	// What is deliberately NOT excluded, and why: `reading: 'provisional'` is a
	// SIGNAL-QUALITY verdict, not a physical one. analyze.ts:30-34 sets it from
	// `confidence === 'low'`, which means no stable window, a rejected detection,
	// or SNR under 12 dB. A noisy capture of an honest vowel is still an honest
	// vowel, and analyze.ts:26-29 records that real-room captures land there
	// routinely. Excluding on `reading` would silently drop good data for any
	// singer without a quiet room. Plausibility and confidence are orthogonal by
	// ruling (engine/types.ts), and only plausibility speaks to whether the
	// number can be the vowel.
	//
	// `plausibility` absent means the guard never ran (values predating it, or
	// derived values), which is `unchecked`, not a verdict. Unchecked is kept:
	// the guard's own tri-state ruling says absence of a window is not a failure.
	const fR1: Record<string, number> = {};
	for (const [vowel, formant] of Object.entries(formants) as [Vowel, CalibratedFormant | undefined][]) {
		if (
			formant &&
			typeof formant.f1 === 'number' &&
			formant.f1 > 0 &&
			formant.plausibility !== 'implausible'
		) {
			fR1[vowel] = formant.f1;
		}
	}

	const c = characteristics;
	const hasRange = c?.rangeLow !== undefined && c?.rangeHigh !== undefined;
	const hasTessitura = c?.tessituraLow !== undefined && c?.tessituraHigh !== undefined;
	const hasPassaggio = c?.passaggioPrimary !== undefined && c?.passaggioSecondary !== undefined;

	// A dimension the singer did not provide is simply omitted: genuine
	// absence, not a permissive default (Option A). The overlay engine reads
	// `profile.range === undefined`, and so on, directly.
	const range = hasRange ? { lowest: { ...c!.rangeLow! }, highest: { ...c!.rangeHigh! } } : undefined;

	const tessitura = hasTessitura ? { low: { ...c!.tessituraLow! }, high: { ...c!.tessituraHigh! } } : undefined;

	// §B.3 RULED (Dann, 2026-07-16): the zona di passaggio is derived only when
	// BOTH edges are declared. Primo and secondo are the lower and upper
	// boundaries of the zone (Miller, The Structure of Singing, pp. 116-117); a
	// single self-declared pitch is a boundary, not a zone. A lone edge yields
	// no passaggio, so `inPassaggio` stays `undefined` (not assessed), never a
	// point band that would read as a negative finding for every off-break note.
	// No width is inferred from one edge: individual variation is carried by
	// self-declaration, not a synthesized span.
	const passaggio = hasPassaggio
		? { primo: { ...c!.passaggioPrimary! }, secondo: { ...c!.passaggioSecondary! } }
		: undefined;

	const snapshot: VoiceProfileSnapshot = {
		fR1,
		...(range ? { range } : {}),
		...(tessitura ? { tessitura } : {}),
		...(passaggio ? { passaggio } : {}),
		...(label !== undefined ? { label } : {}),
	};

	return {
		snapshot,
		completeness: completenessOf(snapshot),
	};
}
