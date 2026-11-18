/**
 * The live capture-session contract the capture screen depends on.
 *
 * Engine spec v1 §9 is a batch boundary: an AudioBuffer goes in, a
 * CalibratedFormant comes out. The v11 two-beat capture flow needs a live beat
 * that the batch signature does not carry, the "stable fry detected" moment that
 * starts the 3.0 s arc. This session wraps the §9 boundary (getUserMedia, the
 * Pulse-Register Detector, and the §9 extraction) and surfaces that beat.
 *
 * Source: Phase 3a brief and Kimi's review §2.2 and §2.5 (2026-06-09). The
 * capture screen is written against this interface; the port injects a stub
 * implementation, and the real engine drops in behind the same interface later.
 *
 * WIDENED 2026-08-04 for item 1.4a, on Dann's Option A ruling
 * (`claude/e25-ruling-request-1.4a-contract.md`): the readiness gate needs a
 * noise-floor reading with no vowel involved and a fry-range result with no
 * formant extraction, and neither was expressible through `start()`. Rather
 * than stand up a second `getUserMedia` owner, the contract gains a readiness
 * mode, so one implementation keeps the microphone lifecycle, the abort and
 * teardown discipline of Kimi §2.5, and the typed error surface. The vowel
 * capture path below is unchanged.
 */

import type { Vowel, VoiceType, CalibratedFormant } from './types';
import type { CaptureError } from './errors';
import type { ReadinessResult } from './readiness';

export interface CaptureHandlers {
	/**
	 * The second beat of the two-beat split: a stable M0 fry was confirmed, so
	 * start the arc. A bare beat by design: the Pulse-Register Detector (engine
	 * spec §3) is an eight-condition, all-must-pass binary gate, so it carries no
	 * graded confidence at this instant. The graded reading confidence arrives on
	 * onComplete in CalibratedFormant.confidence.
	 */
	onStableFry(): void;
	/**
	 * Extraction complete. CalibratedFormant.reading already encodes the
	 * captured or provisional outcome, which comes from the take's own evidence
	 * alone. A divergent velar-i does not change it (the divergence pass
	 * describes and never demotes, `divergence.ts`), so the UI needs no
	 * separate isDivergent flag; the §9 batch boundary keeps isDivergent
	 * internally.
	 */
	onComplete(formant: CalibratedFormant): void;
	onError(error: CaptureError): void;
}

/**
 * The readiness gate's callbacks (wizard spec v1 §2 Phase 1). Two steps, in
 * this order, because SNR needs a quiet reference and a fry is not quiet.
 */
export interface ReadinessHandlers {
	/**
	 * The quiet second is measured and banked; the wizard now asks for the
	 * throwaway fry. The counterpart of onStableFry for this mode: a bare beat
	 * that moves the prompt, carrying no number, because the ratio is not
	 * computable until the signal side arrives.
	 */
	onQuiet(): void;
	/** Both steps are in and the gate has measured. */
	onComplete(result: ReadinessResult): void;
	/**
	 * The gate could not measure. `MIC_NOT_FOUND` and `MIC_PERMISSION_DENIED`
	 * are the "abstain with no microphone" path the plan requires: the wizard
	 * makes no claim about the room and does not block the singer.
	 */
	onError(error: CaptureError): void;
}

export interface CaptureSession {
	start(vowel: Vowel, voiceType: VoiceType | undefined, handlers: CaptureHandlers): void;
	/**
	 * The readiness gate (item 1.4a): one quiet second for the ambient noise
	 * floor, then a throwaway fry for the mic check, the 20-80 Hz range check,
	 * and the signal side of the SNR ratio. No vowel, no formant extraction.
	 * Shares this session's microphone lifecycle, so a readiness run supersedes
	 * any capture in flight exactly as a second start() would.
	 */
	startReadiness(handlers: ReadinessHandlers): void;
	/**
	 * Fire-and-forget teardown (Kimi §2.5). The session stops the run: it aborts
	 * in-flight buffering and timers, clears its buffers, and calls
	 * onError({ code: 'CANCELLED' }) only if it was in a non-terminal state. With
	 * no visit open it also stops the microphone tracks and releases the
	 * AudioContext, as every run has always done; inside a visit (below) it keeps
	 * both. The component reverts on the cancel gesture itself, so a CANCELLED
	 * callback is an idempotent confirmation rather than a required signal.
	 */
	cancel(): void;
	/**
	 * A visit (N.203 lane 59 Step 1, Dann 2026-11-16 00:44): the microphone is
	 * opened once for as long as the singer is on the screen that needs it, so a
	 * phone announces it once. Inside a visit only two things release the stream
	 * and the context: closeVisit(), and a microphone failure
	 * (MIC_PERMISSION_DENIED, MIC_NOT_FOUND, NO_AUDIO_INPUT). A run's end, a
	 * cancel, and every other failure stop the run and keep both. Outside a visit
	 * every run acquires and releases as before.
	 *
	 * openVisit() is idempotent and acquires nothing: the first start() or
	 * startReadiness() of the visit does. Call it from a user gesture, because it
	 * resumes a suspended context.
	 */
	openVisit(): void;
	/** Ends the visit: silently supersedes any run, then releases the tracks and the context. Idempotent. */
	closeVisit(): void;
}
