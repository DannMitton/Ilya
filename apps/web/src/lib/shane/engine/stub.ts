/**
 * Port-time stub CaptureSession.
 *
 * No microphone, no Pulse-Register Detector, no extraction: that is the
 * analytical engine, milestone 3, built after this port. The stub drives the
 * pacifier's capture sequence with timers and canned per-vowel formants, and
 * exercises the captured, provisional, and divergent paths deterministically so
 * the reset-sigla flow is testable. The real session replaces this file behind
 * the same CaptureSession interface.
 *
 * The formant values below are throwaway illustrative numbers, NOT measured and
 * NOT the dissertation's Table 5.3 values; they exist only to render the UI.
 *
 * The readiness half (added 2026-08-04 for item 1.4a) works the same way: it is
 * timed, not measured, and its numbers are illustrative. It exists so the
 * wizard stays clickable end to end without a microphone, which is the same
 * reason the capture half exists. The REAL readiness measurements are in
 * `readiness.ts` and are tested by synthetic injection there; nothing in this
 * file is evidence of anything.
 */

import type { CaptureSession, CaptureHandlers, ReadinessHandlers } from './session';
import type { Vowel, VoiceType, CalibratedFormant } from './types';
import {
	classifyFryPresence,
	classifyFryRate,
	ROOM_SNR_TOAST_DB,
	type ReadinessResult
} from './readiness';

/** Illustrative, non-authoritative formant pairs, one per vowel. Stub data only. */
const STUB_FORMANTS: Record<Vowel, { f1: number; f2: number }> = {
	i: { f1: 300, f2: 2200 },
	e: { f1: 450, f2: 2000 },
	ɪ: { f1: 400, f2: 1900 },
	ɨ: { f1: 350, f2: 1400 },
	ɛ: { f1: 550, f2: 1800 },
	a: { f1: 700, f2: 1400 },
	ɑ: { f1: 650, f2: 1100 },
	ʌ: { f1: 600, f2: 1200 },
	o: { f1: 450, f2: 900 },
	u: { f1: 350, f2: 800 }
};

/** Force a specific outcome regardless of vowel, for testing the UI paths. */
export type StubOutcome = 'captured' | 'provisional-low' | 'provisional-divergent';

/** Force a specific readiness outcome, for exercising the wizard's three paths. */
export type StubReadinessOutcome = 'clear' | 'marginal-fry' | 'marginal-snr' | 'no-microphone';

function stubFormant(vowel: Vowel, outcome: StubOutcome): CalibratedFormant {
	const { f1, f2 } = STUB_FORMANTS[vowel];
	const base: CalibratedFormant = {
		f1,
		f2,
		confidence: 'high',
		f2Quality: 'clear',
		reading: 'captured',
		source: 'measured-user'
	};
	if (outcome === 'provisional-low') {
		return { ...base, confidence: 'low', reading: 'provisional' };
	}
	if (outcome === 'provisional-divergent') {
		// A divergent velar-i: the fry was clean, but it falls outside the
		// retracted-[i] model, so the engine resolves the reading to provisional.
		return { ...base, reading: 'provisional' };
	}
	return base;
}

/**
 * A canned ReadinessResult. Illustrative numbers only. The verdicts are run
 * through the real classifiers rather than hardcoded, so a threshold change in
 * `readiness.ts` cannot leave the stub asserting the old rule.
 */
function stubReadiness(outcome: Exclude<StubReadinessOutcome, 'no-microphone'>): ReadinessResult {
	const snrDb = outcome === 'marginal-snr' ? ROOM_SNR_TOAST_DB - 7 : ROOM_SNR_TOAST_DB + 9;
	const fryRateHz = outcome === 'marginal-fry' ? 22 : 48;
	// Any positive floor works; the pair is kept internally consistent with
	// snrDb so nothing downstream can read a contradictory triple.
	const noiseFloor = 1e-8;
	return {
		room: {
			noiseFloor,
			signal: noiseFloor * Math.pow(10, snrDb / 10),
			snrDb,
			lively: snrDb < ROOM_SNR_TOAST_DB
		},
		// Through the real classifier, per this function's own rule above: both
		// stub outcomes sit well clear of the presence floor, and if that floor
		// ever moves past them the stub follows rather than asserting the old
		// answer.
		fryHeard: classifyFryPresence(snrDb),
		fryRateHz,
		fryRange: classifyFryRate(fryRateHz),
		fryAccepted: true,
		fryFailed: [],
		fryUndecided: []
	};
}

/** The default per-vowel script: most capture cleanly; two exercise the sigla. */
function defaultOutcome(vowel: Vowel): StubOutcome {
	if (vowel === 'ɨ') return 'provisional-divergent';
	if (vowel === 'ʌ') return 'provisional-low';
	return 'captured';
}

export class StubCaptureSession implements CaptureSession {
	private timers: ReturnType<typeof setTimeout>[] = [];
	private active = false;
	private readonly forced?: StubOutcome;
	private readonly readiness: StubReadinessOutcome;

	/**
	 * Pass a StubOutcome to force every capture down one path, and a
	 * StubReadinessOutcome to force the readiness gate's verdict.
	 */
	constructor(forced?: StubOutcome, readiness: StubReadinessOutcome = 'clear') {
		this.forced = forced;
		this.readiness = readiness;
	}

	start(vowel: Vowel, _voiceType: VoiceType | undefined, handlers: CaptureHandlers): void {
		this.cancel(); // clear any prior session cleanly
		this.active = true;

		const stableDelay = 500 + Math.random() * 500; // 500 to 1000 ms to stable fry
		const completeDelay = stableDelay + 3000; // plus the fixed 3.0 s sweep
		const outcome = this.forced ?? defaultOutcome(vowel);

		this.timers.push(
			setTimeout(() => {
				if (this.active) handlers.onStableFry();
			}, stableDelay)
		);
		this.timers.push(
			setTimeout(() => {
				if (!this.active) return;
				this.active = false;
				handlers.onComplete(stubFormant(vowel, outcome));
			}, completeDelay)
		);
	}

	/**
	 * The readiness gate, timed rather than measured. The two delays mirror the
	 * shape of a real run (a quiet second, then a fry that takes a moment to
	 * settle) so the wizard's prompts read at a human pace without a device.
	 */
	startReadiness(handlers: ReadinessHandlers): void {
		this.cancel();
		this.active = true;
		const outcome = this.readiness;
		this.timers.push(
			setTimeout(() => {
				if (!this.active) return;
				handlers.onQuiet();
				this.timers.push(
					setTimeout(() => {
						if (!this.active) return;
						this.active = false;
						if (outcome === 'no-microphone') {
							handlers.onError({ code: 'MIC_NOT_FOUND', message: 'No microphone was found.' });
							return;
						}
						handlers.onComplete(stubReadiness(outcome));
					}, 1200)
				);
			}, 1000)
		);
	}

	cancel(): void {
		this.active = false;
		// Clear every pending timer, not just the last: the onStableFry and
		// onComplete timers are tracked separately so neither fires after cancel.
		for (const t of this.timers) clearTimeout(t);
		this.timers = [];
		// No onError(CANCELLED) here: the component reverts on the cancel gesture,
		// and the real session's CANCELLED callback is an idempotent confirmation,
		// so both paths behave identically.
	}
}
