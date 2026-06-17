/**
 * The live capture-session contract the pacifier depends on.
 *
 * Engine spec v1 §9 is a batch boundary: an AudioBuffer goes in, a
 * CalibratedFormant comes out. The v11 two-beat capture flow needs a live beat
 * that the batch signature does not carry, the "stable fry detected" moment that
 * starts the 3.0 s arc. This session wraps the §9 boundary (getUserMedia, the
 * Pulse-Register Detector, and the §9 extraction) and surfaces that beat.
 *
 * Source: Phase 3a brief and Kimi's review §2.2 and §2.5 (2026-06-09). The
 * pacifier is written against this interface; the port injects a stub
 * implementation, and the real engine drops in behind the same interface later.
 */

import type { Vowel, VoiceType, CalibratedFormant } from './types';
import type { ShaneEngineError } from './errors';

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
	 * captured or provisional outcome (a divergent velar-i resolves to
	 * provisional), so the UI needs no separate isDivergent flag; the §9 batch
	 * boundary keeps isDivergent internally.
	 */
	onComplete(formant: CalibratedFormant): void;
	onError(error: ShaneEngineError): void;
}

export interface CaptureSession {
	start(vowel: Vowel, voiceType: VoiceType | undefined, handlers: CaptureHandlers): void;
	/**
	 * Fire-and-forget teardown (Kimi §2.5). The session stops the microphone
	 * tracks, releases the AudioContext, aborts in-flight buffering and timers,
	 * and calls onError({ code: 'CANCELLED' }) only if it was in a non-terminal
	 * state. The component reverts on the cancel gesture itself, so a CANCELLED
	 * callback is an idempotent confirmation rather than a required signal.
	 */
	cancel(): void;
}
