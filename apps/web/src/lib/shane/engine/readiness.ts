/**
 * The readiness gate's measurements (item 1.4a).
 *
 * Pure and microphone-free by design: `live.ts` owns `getUserMedia` and hands
 * two buffers to this module, so every threshold here is reachable by `vitest`
 * (which never compiles a `.svelte` file, and which cannot open an
 * `AudioContext` either). The wizard renders what this returns and decides
 * nothing numeric itself.
 *
 * Source of record for the two steps and their numbers:
 * `shane-calibration-wizard-spec_v1_2026-06-30.md` §2 Phase 1 and §4.
 *
 *   1. Quiet second. Ambient noise over one second with no phonation. This is
 *      the session noise floor and the SNR baseline.
 *   2. Throwaway fry. Confirms the mic hears the singer, runs the fry-range
 *      check, and supplies the signal side of the SNR ratio.
 *
 * The SNR is therefore a ROOM ratio measured ACROSS the two steps, over the
 * engine's own [100, 4000] Hz band. It is a different quantity from
 * `DetectorResult.snrDb` (`detector.ts:16`), which is an in-buffer proxy
 * comparing that band against 5-10 kHz inside one sample. The two are not
 * interchangeable and their thresholds are not transferable: the 2026-07-01
 * recalibration of the detector's c8 from 20 dB to 12 dB is scoped in its own
 * comment to "this ratio", meaning the proxy.
 *
 * Abstention discipline. Every measurement here returns `null` rather than a
 * stand-in when it cannot be made. This is deliberately the opposite of
 * `detector.ts:24` (`if (!noise.length) return 60;`), which is item 1.4b and is
 * NOT touched here; the word a singer reads for an unmeasurable noise floor is
 * Dann's ruling and is not pre-empted. This module makes no claim instead.
 *
 * E.26 added the other half of that discipline, which was missing. Abstaining
 * when a measurement CANNOT be made is only useful if the module also declines
 * to describe a measurement it had no business making: before E.26 the gate
 * classified whatever inter-pulse rate the detector recovered, including one
 * recovered from a silent room, and handed the singer range guidance about a
 * fry that never happened. See `classifyFryPresence` and the presence veto in
 * `assessReadiness`.
 */

import { welchPSD } from './dsp';
import { detect } from './detector';

/**
 * The detector's own accept band, engine spec §3, implemented at
 * `detector.ts:51` as a mean inter-pulse interval of 0.0125 to 0.05 s
 * inclusive, which is 80 Hz down to 20 Hz. Restated here as a rate so the
 * range check reads in the units the singer's voice is described in.
 */
export const FRY_RANGE_LO_HZ = 20;
export const FRY_RANGE_HI_HZ = 80;

/**
 * Wizard spec §2 Phase 1: "flag, do not block, when marginal (approaching the
 * edges, below ~25 Hz or above ~75 Hz)". A property of voices, not of this
 * mechanism, which is why these are the only readiness figures the fidelity
 * tests may assert against directly.
 */
export const FRY_MARGINAL_LO_HZ = 25;
export const FRY_MARGINAL_HI_HZ = 75;

/** Wizard spec §4, "SNR band: engine's [100, 4000] Hz flatness band". */
export const SNR_BAND_LO_HZ = 100;
export const SNR_BAND_HI_HZ = 4000;

/** Welch segment length, matching `detector.ts:11` and `detector.ts:17`. */
export const PSD_NPERSEG = 2048;

/**
 * PLACEHOLDER, and named as one. Wizard spec §5 lists "the ambient SNR toast
 * threshold: placeholder SNR below ~25 dB (anchored above the engine's 20 dB
 * gate, §3), tuned against real rooms post-launch."
 *
 * RECORDED DRIFT: the anchor that sentence names has since moved. The engine's
 * gate was recalibrated from 20 dB to 12 dB on 2026-07-01 (`detector.ts:68`).
 * That recalibration is scoped in its own comment to the in-buffer proxy ratio,
 * not to this room ratio, so it does not invalidate 25 dB; but the stated
 * derivation no longer holds and 25 dB now stands on nothing but the
 * placeholder. Item 1.5 (Dann's microphone against a preview build) is the
 * tuning step. Do not treat this number as measured.
 */
export const ROOM_SNR_TOAST_DB = 25;

/**
 * The minimum room ratio, in dB, at which the throwaway sample is taken to
 * carry a fry AT ALL. Below this the sample is a second reading of the room,
 * and any inter-pulse rate recovered from it describes the room rather than a
 * voice.
 *
 * PLACEHOLDER, and named as one, on the same footing as `ROOM_SNR_TOAST_DB`
 * above. What it currently stands on is one measurement and one arithmetic
 * fact, both of which bound it from below and neither of which fixes it:
 *
 *   - MEASURED, E.26, 2026-08-04, Dann's iMac, deployed build `a1d58e4`: a
 *     readiness run in which the singer did not fry at all returned
 *     `snrDb: 0.708`. The gate nonetheless recovered 17 pulses, called them
 *     23.1 Hz, and told the singer their fry was near the edge of our range.
 *   - ARITHMETIC: two independent draws of the same room differ only by
 *     estimator variance, so noise-against-noise sits at 0 dB by construction.
 *     Synthetic controls in `readiness.test.ts` read -0.15 to +0.07 dB.
 *
 * So the floor must clear roughly 1 dB. 6 dB is a power factor of four, which
 * is far above that and far below any phonation, but the SEPARATION between a
 * real fry and a real room has NOT been measured through this path on any
 * device. Item 1.5 (Dann's microphone against a preview build) is the step that
 * anchors it. Do not treat this number as measured.
 */
export const FRY_PRESENCE_MIN_SNR_DB = 6;

/** What the quiet second and the throwaway fry say about the room. */
export interface RoomMeasurement {
	/** Mean PSD over the SNR band of the quiet second. `null` = not measurable. */
	noiseFloor: number | null;
	/** Mean PSD over the same band of the throwaway fry. `null` = not measurable. */
	signal: number | null;
	/** 10·log10(signal / noiseFloor), dB. `null` when either side abstained. */
	snrDb: number | null;
	/**
	 * True only when `snrDb` was measured AND falls below the placeholder
	 * threshold. An abstention is never "lively": the toast asserts something
	 * about the singer's room, and we do not assert what we did not measure.
	 */
	lively: boolean;
}

/**
 * The range check's verdict. `out-of-range` is guidance, never a block (wizard
 * spec §2 Phase 1); `not-measured` means no inter-pulse rate was recovered.
 */
export type FryRangeVerdict = 'clear' | 'marginal' | 'out-of-range' | 'not-measured';

export interface ReadinessResult {
	room: RoomMeasurement;
	/**
	 * Whether the throwaway sample carried anything above the ambient second
	 * (`FRY_PRESENCE_MIN_SNR_DB`). `null` when the room ratio itself could not
	 * be measured, which is not the same as `false` and must never be shown as
	 * one: `false` says we listened and heard nothing; `null` says we could not
	 * tell. Same discipline as `plausibility: 'unchecked'` and item 1.4b's
	 * `noiseFloor: 'unmeasured'`.
	 */
	fryHeard: boolean | null;
	/**
	 * The throwaway fry's inter-pulse rate, Hz. `null` = not recovered, OR
	 * recovered from a sample that carried no fry, which is the same answer to
	 * the singer and for the same reason.
	 */
	fryRateHz: number | null;
	fryRange: FryRangeVerdict;
	/**
	 * The Pulse-Register Detector's own eight-condition verdict on the
	 * throwaway sample, carried for the record. The readiness gate does not act
	 * on it: a refused sample still yields range guidance, which is the whole
	 * point of a flag-don't-block gate.
	 */
	fryAccepted: boolean;
	/** The detector conditions the throwaway sample failed, for diagnostics. */
	fryFailed: string[];
	/**
	 * The detector conditions that could not be evaluated on the throwaway
	 * sample (item 1.4b). Kept separate from `fryFailed` for the same reason
	 * the detector keeps them separate: a condition we could not check is not a
	 * fault, and must never be shown to a singer as one. Typically non-empty
	 * only on a device whose sample rate collapses the detector's noise band.
	 */
	fryUndecided: string[];
}

/**
 * Mean power spectral density across a frequency band.
 *
 * Returns `null` rather than a stand-in in the two cases where the question has
 * no answer: a buffer shorter than one Welch segment (`welchPSD` would average
 * zero segments and return an all-zero spectrum, which reads as silence rather
 * than as "unmeasured"), and a band that contains no bins at this sample rate.
 */
export function bandPower(
	y: Float64Array,
	sr: number,
	lo = SNR_BAND_LO_HZ,
	hi = SNR_BAND_HI_HZ,
	nperseg = PSD_NPERSEG
): number | null {
	if (!Number.isFinite(sr) || sr <= 0) return null;
	if (y.length < nperseg) return null;
	const { freqs, psd } = welchPSD(y, sr, nperseg);
	let sum = 0;
	let n = 0;
	for (let k = 0; k < freqs.length; k++) {
		if (freqs[k] >= lo && freqs[k] <= hi) {
			sum += psd[k];
			n++;
		}
	}
	if (!n) return null;
	return sum / n;
}

/**
 * The room ratio: the throwaway fry's band power over the quiet second's, in
 * dB. These are power quantities, so the conversion is 10·log10, not 20.
 */
export function measureRoom(quiet: Float64Array, fry: Float64Array, sr: number): RoomMeasurement {
	const noiseFloor = bandPower(quiet, sr);
	const signal = bandPower(fry, sr);
	const snrDb = roomSnrDb(noiseFloor, signal);
	return { noiseFloor, signal, snrDb, lively: snrDb !== null && snrDb < ROOM_SNR_TOAST_DB };
}

/**
 * The ratio itself, split out from `measureRoom` so the live driver can hold
 * the quiet second's band power once and re-ask the question every hop without
 * recomputing a Welch PSD over an unchanging buffer (`live.ts`, the readiness
 * tick). Same abstention rule: `null` when either side has no answer, and a
 * non-positive power is no answer rather than a very small one.
 */
export function roomSnrDb(noiseFloor: number | null, signal: number | null): number | null {
	if (noiseFloor === null || signal === null || noiseFloor <= 0 || signal <= 0) return null;
	return 10 * Math.log10(signal / noiseFloor);
}

/**
 * Did the throwaway sample carry a fry at all?
 *
 * This is the question the gate did not ask before E.26, and its absence is why
 * a silent room could be handed back to a singer as a fry reading near the edge
 * of our range. Mirrors `classifyFryRate` below: a small named classifier over
 * one measured quantity, so the threshold is reachable by `vitest`.
 *
 * `null` is an abstention, not a "no". See `ReadinessResult.fryHeard`.
 */
export function classifyFryPresence(snrDb: number | null): boolean | null {
	if (snrDb === null) return null;
	return snrDb >= FRY_PRESENCE_MIN_SNR_DB;
}

/**
 * The fry-range check. Boundaries follow the spec's wording literally: "below
 * ~25 Hz or above ~75 Hz" is marginal, so 25 and 75 themselves read clear, and
 * the 20 and 80 endpoints of the detector's own band read marginal rather than
 * out of range.
 */
export function classifyFryRate(rateHz: number | null): FryRangeVerdict {
	if (rateHz === null || !Number.isFinite(rateHz)) return 'not-measured';
	if (rateHz < FRY_RANGE_LO_HZ || rateHz > FRY_RANGE_HI_HZ) return 'out-of-range';
	if (rateHz < FRY_MARGINAL_LO_HZ || rateHz > FRY_MARGINAL_HI_HZ) return 'marginal';
	return 'clear';
}

/**
 * The whole gate, given the two buffers. `quiet` is the ambient second, `fry`
 * the throwaway sample; both at `sr`.
 */
export function assessReadiness(
	quiet: Float64Array,
	fry: Float64Array,
	sr: number
): ReadinessResult {
	const det = detect(fry, sr);
	const room = measureRoom(quiet, fry, sr);
	const heard = classifyFryPresence(room.snrDb);
	/*
	 * The presence veto (E.26). A pulse detector asked for the rate of a buffer
	 * will find one; whether the buffer contains a voice is a different question
	 * and it has a different instrument, which this function already computes
	 * one line above. Before E.26 the answer was discarded except to decide a
	 * toast, and every rate the detector recovered was passed on and classified,
	 * including rates recovered from an empty room.
	 *
	 * MEASURED, synthetic control in `readiness.test.ts`: two independent draws
	 * of the same noise yield rates of 26 to 37 Hz, which `classifyFryRate`
	 * reports as `clear`. A CONFIDENT WRONG ANSWER where an abstention belongs,
	 * which is the same defect shape as `detector.ts`'s old `return 60`.
	 *
	 * `heard === null` does NOT veto. An unmeasurable ratio is not evidence of
	 * silence, and refusing on it would be the mirror of the fault above.
	 */
	const rateHz = heard === false ? null : det.rateHz;
	return {
		room,
		fryHeard: heard,
		fryRateHz: rateHz,
		fryRange: classifyFryRate(rateHz),
		fryAccepted: det.accept,
		fryFailed: det.failed,
		fryUndecided: det.undecided
	};
}
