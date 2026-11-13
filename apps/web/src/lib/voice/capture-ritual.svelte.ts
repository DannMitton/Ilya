/**
 * THE CAPTURE RITUAL, WRITTEN FRESH (N.199 Step 3; brief r5, Fable review amendment 2). One vowel's take, from the tap to the
 * reading: sing it on a count of three, a silent pause, then the fry, a wait for stable fry, a 3.0 s sweep, and the reading.
 * It is written against `CaptureSession` (`engine/session.ts`) and `count-in.ts`, not cut out of `pacifier/Pacifier.svelte`,
 * whose version of this is tangled through its per-vowel `nodes` state and has no test. `Pacifier.svelte` is not touched.
 *
 * WHAT IT HOLDS: the phase, the vowel, the sweep's progress, and the cue. It holds no formant map and emits no profile; the
 * screen draws from the wizard's `profile`, so `handleProfileChange` and `sameExtraction` lose their caller in Step 8a. It
 * never calls `t`: the cue is a key and a vowel, and the screen words it.
 *
 * WHAT IS RULED HERE, because "same as the wheel" cannot be said of a thing nothing tests (brief r5, Step 3):
 *   - TIMING is the tree's: three sung beats of 1 s, a 3 s pause (`count-in.ts`, 2 s until N.199 Step 7), a wait for stable fry (the session's: up to
 *     10 s, `engine/live.ts`), then the 3.0 s sweep. The progress bar starts at stable fry. Under reduced motion the bar still
 *     advances, in coarser steps, as the readiness bar does.
 *   - THE RE-TAKE RULE: a Provisional re-take never replaces a Captured reading. It compares against `previous(vowel)`, the
 *     wizard's GUARDED reading, where the wheel compared against its own raw copy.
 *   - CANCEL: a second tap on the vowel, Stop, and Escape (the screen's gestures) all call `cancel()`, which works in every
 *     phase up to the moment the reading is DELIVERED (`onCaptured` or `onRolledBack`). After that the take cannot be
 *     cancelled, so "Nothing is saved from it" stays true through the landing. (The wheel ignored a tap during the fry and had
 *     a 900 ms window after the reading was set in which a cancel would have been a lie.)
 *   - A TAP ON ANOTHER VOWEL during a take is ignored: `begin()` during a take returns false. DESK DEFAULT (Dann's "when you tap a
 *     vowel it takes precedence" was said of the idle screen).
 *   - EACH TAKE HAS AN ID. A callback from an earlier take, a late `CANCELLED` above all, is dropped.
 *   - THE AUDIO TICK on the three sung beats stays; the audio context is closed on `destroy()`.
 *
 * ONE CHOICE BEYOND THE BRIEF, flagged in the Step 3 report: a cancelled take is reported through `onFailed` with the
 * `CaptureError` code `CANCELLED` (the session's own vocabulary), once, whether the singer cancelled or the session did,
 * so Step 5 can record cancels without a fourth event. A real failure is any other code.
 */
import { runCountIn, type CountInStep } from './count-in';
import type { CaptureSession } from './engine/session';
import type { CaptureError } from './engine/errors';
import type { CalibratedFormant, Vowel } from './engine/types';

/** The fixed sweep, which the bar paces (`engine/live.ts` `SWEEP_S`; `Pacifier.svelte` `SWEEP_MS`, both 3.0 s). */
export const SWEEP_MS = 3000;
/** How long the reading's landing lasts before the screen is idle again (`Pacifier.svelte` `COMPLETE_MS`). None under reduced motion. */
export const LANDING_MS = 900;
/** The bar's update step, and its coarser step under reduced motion (it still advances). */
export const PROGRESS_STEP_MS = 50;
export const PROGRESS_STEP_REDUCED_MS = 250;

export type RitualPhase = 'idle' | 'sing' | 'pause' | 'listening' | 'sweep' | 'landing';

/**
 * What the screen should say: a key and the vowel it is about. Keys are the tree's (`pacifier.singFirst`,
 * `calib.readiness.countTwo`, `calib.readiness.countOne`, `pacifier.pause`, `pacifier.beginPhonating`, `pacifier.nowSustain`,
 * `pacifier.captured`, `pacifier.rolledBack`, `pacifier.cancelled`, `pacifier.error.*`) and one proposed, `capture.uncertain`,
 * which replaces the tree's `pacifier.sampleUncertain` ("Tap to retry" is false once the selection has moved).
 */
export interface RitualCue {
	key: string;
	vowel: Vowel | null;
}

export interface CaptureRitualDeps {
	session: CaptureSession;
	/** The declared voice type, read when the take starts. */
	voiceType: () => string | undefined;
	/** The wizard's GUARDED stored reading for a vowel, for the re-take rule. */
	previous: (vowel: Vowel) => CalibratedFormant | undefined;
	reducedMotion: () => boolean;
	/** The audio tick on the sung beats (the wheel's `countdownTicks`, default true). */
	ticks?: boolean;
	onCaptured?: (vowel: Vowel, formant: CalibratedFormant) => void;
	onRolledBack?: (vowel: Vowel, rejected: CalibratedFormant) => void;
	/** A take that ended without a reading: a real failure, or `{ code: 'CANCELLED' }`. */
	onFailed?: (vowel: Vowel, error: CaptureError) => void;
}

export interface CaptureRitual {
	readonly phase: RitualPhase;
	/** The vowel of the take in progress or landing; null when idle. */
	readonly vowel: Vowel | null;
	/** The sweep's progress, 0 to 1; 0 outside the sweep and the landing. */
	readonly progress: number;
	readonly cue: RitualCue;
	/** Whether a take is in progress and can still be cancelled (every phase before the reading is delivered). */
	readonly cancellable: boolean;
	/** Starts a take. False, and nothing happens, when a take is already in progress. */
	begin(vowel: Vowel): boolean;
	/** Ends the take in progress. False, and nothing happens, when there is none or its reading is already delivered. */
	cancel(): boolean;
	/** Tears down: timers, the session, the audio context. Fires no event. */
	destroy(): void;
}

const ERROR_KEY: Record<string, string> = {
	MIC_PERMISSION_DENIED: 'pacifier.error.micPermission',
	MIC_NOT_FOUND: 'pacifier.error.micNotFound',
	NO_AUDIO_INPUT: 'pacifier.error.noAudio',
	SAMPLE_TOO_SHORT: 'pacifier.error.tooShort'
};
/** The cue for a failed take (the wheel's `errorCaption`): the code's own words, or the default. */
export const errorCueKey = (code: string): string => ERROR_KEY[code] ?? 'pacifier.error.default';

export function createCaptureRitual(deps: CaptureRitualDeps): CaptureRitual {
	let phase = $state<RitualPhase>('idle');
	let vowel = $state<Vowel | null>(null);
	let progress = $state(0);
	let cue = $state<RitualCue>({ key: '', vowel: null });

	let takeId = 0;
	let timers: ReturnType<typeof setTimeout>[] = [];
	let stepTimer: ReturnType<typeof setInterval> | null = null;
	let sessionStarted = false;
	let clockDone = false;
	let pending: CalibratedFormant | null = null;
	let sweepStartedAt = 0;
	let audioCtx: AudioContext | undefined;
	let destroyed = false;

	const after = (ms: number, fn: () => void) => {
		timers.push(setTimeout(fn, ms));
	};
	const clearTimers = () => {
		for (const t of timers) clearTimeout(t);
		timers = [];
		if (stepTimer !== null) clearInterval(stepTimer);
		stepTimer = null;
	};
	const say = (key: string, v: Vowel | null) => {
		cue = { key, vowel: v };
	};

	/** A short sine tick on each sung beat; optional, and a failure must never block the count. */
	function tick() {
		if (deps.ticks === false) return;
		try {
			audioCtx ??= new AudioContext();
			const osc = audioCtx.createOscillator();
			const gain = audioCtx.createGain();
			osc.type = 'sine';
			osc.frequency.value = 660;
			gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.01);
			gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.09);
			osc.connect(gain).connect(audioCtx.destination);
			osc.start();
			osc.stop(audioCtx.currentTime + 0.1);
		} catch {
			// Audio is optional.
		}
	}

	function toIdle() {
		clearTimers();
		phase = 'idle';
		vowel = null;
		progress = 0;
		sessionStarted = false;
		clockDone = false;
		pending = null;
	}

	function begin(v: Vowel): boolean {
		if (destroyed || phase !== 'idle') return false;
		const id = ++takeId;
		vowel = v;
		progress = 0;
		sessionStarted = false;
		clockDone = false;
		pending = null;
		phase = 'sing';
		runCountIn((step: CountInStep) => {
			if (id !== takeId) return;
			if (step === 'fry') return startListening(id, v);
			if (step === 'pause') {
				phase = 'pause';
				say('pacifier.pause', v);
				return;
			}
			say(step === 'sing' ? 'pacifier.singFirst' : step === 'two' ? 'calib.readiness.countTwo' : 'calib.readiness.countOne', v);
			tick();
		}, after);
		return true;
	}

	function startListening(id: number, v: Vowel) {
		phase = 'listening';
		say('pacifier.beginPhonating', v);
		sessionStarted = true;
		deps.session.start(v, deps.voiceType(), {
			onStableFry: () => {
				if (id === takeId) startSweep(id);
			},
			onComplete: (formant) => {
				if (id !== takeId || phase === 'idle' || phase === 'landing') return;
				pending = formant;
				maybeDeliver(id, v);
			},
			onError: (error) => {
				if (id !== takeId || phase === 'idle' || phase === 'landing') return; // a late CANCELLED from an earlier take is dropped here
				fail(v, error);
			}
		});
	}

	function startSweep(id: number) {
		if (phase !== 'listening') return;
		phase = 'sweep';
		say('pacifier.nowSustain', vowel);
		sweepStartedAt = Date.now();
		progress = 0;
		// The bar still advances under reduced motion, in coarser steps.
		const step = deps.reducedMotion() ? PROGRESS_STEP_REDUCED_MS : PROGRESS_STEP_MS;
		stepTimer = setInterval(() => {
			if (id === takeId && phase === 'sweep') progress = Math.min(1, (Date.now() - sweepStartedAt) / SWEEP_MS);
		}, step);
		// The bar is a fixed 3.0 s clock that never stalls, independent of the engine's delivery time; delivery waits on both.
		after(SWEEP_MS, () => {
			if (id !== takeId || phase !== 'sweep') return;
			clockDone = true;
			progress = 1;
			if (stepTimer !== null) clearInterval(stepTimer);
			stepTimer = null;
			maybeDeliver(id, vowel!);
		});
	}

	function maybeDeliver(id: number, v: Vowel) {
		if (id !== takeId || !clockDone || pending === null) return;
		const formant = pending;
		pending = null;
		sessionStarted = false; // the session has completed; there is nothing of it left to cancel
		phase = 'landing';
		progress = 1;
		const prev = deps.previous(v);
		if (formant.reading === 'provisional' && prev?.reading === 'captured') {
			// The re-take rule: a Provisional re-take never replaces a Captured reading.
			say('pacifier.rolledBack', v);
			deps.onRolledBack?.(v, formant);
		} else {
			say(formant.reading === 'provisional' ? 'capture.uncertain' : 'pacifier.captured', v);
			deps.onCaptured?.(v, formant);
		}
		if (deps.reducedMotion()) toIdle();
		else after(LANDING_MS, () => id === takeId && toIdle());
	}

	function fail(v: Vowel, error: CaptureError) {
		toIdle();
		if (error.code === 'CANCELLED') say('pacifier.cancelled', v);
		else say(errorCueKey(error.code), v);
		deps.onFailed?.(v, error);
	}

	function cancel(): boolean {
		if (destroyed || phase === 'idle' || phase === 'landing') return false;
		const v = vowel!;
		const hadSession = sessionStarted;
		takeId++; // anything the session says about this take from here on is dropped
		toIdle();
		if (hadSession) deps.session.cancel();
		say('pacifier.cancelled', v);
		deps.onFailed?.(v, { code: 'CANCELLED', message: 'The take was cancelled.' });
		return true;
	}

	function destroy() {
		if (destroyed) return;
		destroyed = true;
		const hadSession = sessionStarted;
		takeId++;
		toIdle();
		if (hadSession) deps.session.cancel();
		try {
			void audioCtx?.close();
		} catch {
			// Already closed.
		}
		audioCtx = undefined;
	}

	return {
		get phase() {
			return phase;
		},
		get vowel() {
			return vowel;
		},
		get progress() {
			return progress;
		},
		get cue() {
			return cue;
		},
		get cancellable() {
			return phase !== 'idle' && phase !== 'landing';
		},
		begin,
		cancel,
		destroy
	};
}
