/**
 * The analysis adapter: the active voice's stored calibration to the overlay
 * engine's VoiceProfileSnapshot (E.5 slice 4).
 *
 * `analyzeScore` reads one minimal shape, `VoiceProfileSnapshot`
 * (analysis-types.ts): per-vowel fR1, plus a singer range, tessitura, and
 * passaggio, all three REQUIRED on the type. The app stores those across two
 * places: measured resonances in `VoiceProfile.calibratedFormants`
 * (engine/types.ts) and the typed edges in `VoiceCharacteristics`, every
 * field of which is optional because the wizard's Voice characteristics
 * phase is skippable (§A.31). This adapter is the one seam that reconciles
 * the two, filling each dimension the singer did not provide with a
 * permissive default so the forecast never invents a warning it was not told
 * to make.
 *
 * Honesty model (§A.31: "permissive defaults ... and an honest broad-analysis
 * note"). Two channels, kept separate on purpose:
 *
 *   1. The SNAPSHOT carries inert sentinel bands for any missing dimension,
 *      chosen so the exact comparisons in overlay-engine.ts can never fire.
 *      Proven against overlay-engine.ts `analyzeScore` (audited 2026-07-14):
 *        - out-of-range fires when a pitch is below range.lowest or above
 *          range.highest (lines 164-168);
 *        - in-tessitura fires when tessitura.low <= pitch <= tessitura.high
 *          (lines 169-173);
 *        - inPassaggio is true when passaggio.primo <= pitch <=
 *          passaggio.secondo (line 162).
 *      SENTINEL_LOW (C0, MIDI 12) sits below, and SENTINEL_HIGH (C10, MIDI
 *      132) above, every representable sung pitch. So a missing range gets
 *      the wide band [C0, C10], which contains every pitch and can never read
 *      out-of-range; a missing tessitura or passaggio gets the INVERTED band
 *      [C10, C0], whose floor sits above its ceiling, which no pitch can
 *      satisfy, so neither in-tessitura nor inPassaggio can ever fire.
 *
 *   2. The COMPLETENESS descriptor states, as first-class booleans, which
 *      dimensions are real and which are defaulted. The broad-analysis note
 *      reads THIS, never the sentinels: the honesty lives in an explicit
 *      signal, not in reverse-engineering the arithmetic. See the note in the
 *      handover return memo on why this stays adapter-side rather than
 *      widening the shared score-parser type (Option A). PROVISIONAL: the
 *      sentinel-vs-optional-fields choice is flagged for Dann and Fable.
 *
 * Leak note (honest downside, flagged): `analyzeScore.buildGlobal` copies
 * `profile.passaggio` into `AnalyzedGlobal.passaggio` unconditionally, and
 * the whole profile is deep-copied into `calibrationSnapshot`. A sentinel
 * band therefore travels into those fields. They are unread at render today
 * (notation-overlay.ts docstring), but any FUTURE consumer of
 * global.passaggio or calibrationSnapshot must consult `completeness` first,
 * or we revisit Option A. This is the named condition under which the
 * shared-type change earns its cost.
 */

import type { Pitch, VoiceProfileSnapshot } from '@ilya/score-parser';
import type { CalibratedFormant, VoiceCharacteristics, Vowel } from './engine/types';

/**
 * Sentinel edges. NOT musical values: markers for "this dimension was not
 * provided", chosen to be provably inert against overlay-engine.ts (see the
 * file docstring). C0 is below and C10 above any real sung pitch.
 */
const SENTINEL_LOW: Pitch = { step: 'C', octave: 0, alter: 0 };
const SENTINEL_HIGH: Pitch = { step: 'C', octave: 10, alter: 0 };

/**
 * Which analysis dimensions rest on real singer input and which fall back to
 * a permissive default. The broad-analysis note is driven from this, never
 * from inspecting the snapshot's sentinel bands.
 */
export interface AnalysisCompleteness {
	/** At least one measured fR1 is present, so acoustic marks can be forecast. */
	formants: boolean;
	/** Both range edges were provided. */
	range: boolean;
	/** Both tessitura edges were provided. */
	tessitura: boolean;
	/** The primary passaggio was provided (a secondary is optional). */
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
 * Build the overlay-engine snapshot from the active voice's stored formants
 * and typed characteristics. Pure: no store reads, no DOM, deterministic, so
 * it is sandbox-testable the way `analyzeScore` is.
 *
 * @param formants the active voice's direct-sample formants (captured or
 *   provisional); a reading with no usable f1 contributes no fR1.
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
	const fR1: Record<string, number> = {};
	for (const [vowel, formant] of Object.entries(formants) as [Vowel, CalibratedFormant | undefined][]) {
		if (formant && typeof formant.f1 === 'number' && formant.f1 > 0) {
			fR1[vowel] = formant.f1;
		}
	}

	const c = characteristics;
	const hasRange = c?.rangeLow !== undefined && c?.rangeHigh !== undefined;
	const hasTessitura = c?.tessituraLow !== undefined && c?.tessituraHigh !== undefined;
	const hasPassaggio = c?.passaggioPrimary !== undefined;

	const range = hasRange
		? { lowest: { ...c!.rangeLow! }, highest: { ...c!.rangeHigh! } }
		: { lowest: { ...SENTINEL_LOW }, highest: { ...SENTINEL_HIGH } };

	const tessitura = hasTessitura
		? { low: { ...c!.tessituraLow! }, high: { ...c!.tessituraHigh! } }
		: // inverted (empty) band: floor above ceiling, so in-tessitura never fires.
			{ low: { ...SENTINEL_HIGH }, high: { ...SENTINEL_LOW } };

	const passaggio = hasPassaggio
		? {
				primo: { ...c!.passaggioPrimary! },
				// A single declared break reads as a point band (secondo = primo):
				// inPassaggio then flags only the exact break pitch, the honest
				// reading of one passaggio. PROVISIONAL: point band vs no flagging
				// vs a pedagogical zone is flagged for Dann and Fable.
				secondo: { ...(c!.passaggioSecondary ?? c!.passaggioPrimary!) },
			}
		: // inverted (empty) band: no positional passaggio event is ever flagged.
			{ primo: { ...SENTINEL_HIGH }, secondo: { ...SENTINEL_LOW } };

	const snapshot: VoiceProfileSnapshot = {
		fR1,
		range,
		tessitura,
		passaggio,
		...(label !== undefined ? { label } : {}),
	};

	return {
		snapshot,
		completeness: {
			formants: Object.keys(fR1).length > 0,
			range: hasRange,
			tessitura: hasTessitura,
			passaggio: hasPassaggio,
		},
	};
}
