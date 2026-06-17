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
 */

import type { CaptureSession, CaptureHandlers } from './session';
import type { Vowel, VoiceType, CalibratedFormant } from './types';

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

	/** Pass a StubOutcome to force every capture down one path. */
	constructor(forced?: StubOutcome) {
		this.forced = forced;
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
