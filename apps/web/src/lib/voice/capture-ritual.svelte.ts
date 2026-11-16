/**
 * THE CAPTURE RITUAL, WRITTEN FRESH (N.199 Step 3), RESHAPED BY N.203 lane 59 Step 3. One vowel's take, from the Start tap to the reading, in
 * four named parts: Breathe (2 s, silent), Sing (4 s, four soft ticks), Shape (2 s, silent), Fry (the session's wait for steady fry, up to 10 s,
 * then the 3.0 s sweep), then the reading and a dwell on the new dot. It is written against `CaptureSession` (`engine/session.ts`) and `count-in.ts`.
 *
 * WHAT IT HOLDS: the phase, the vowel, the take line's part and how far through it (`take`), the sweep's progress, and the cue. It holds no formant
 * map and emits no profile; the screen draws from the wizard's `profile`. It never calls `t`: the cue is a key and a vowel, and the screen words it.
 *
 * WHAT IS RULED HERE:
 *   - TIMING is `count-in.ts`'s: 2 s, 4 s, 2 s, then the fry. The line holds at the first quarter of Fry while the session waits for steady fry
 *     (the quarter fills over 1.0 s, the gate's window) and the cue stays; the sweep fills the other three quarters. Under reduced motion the line
 *     still advances, in coarser steps.
 *   - THE RE-TAKE RULE: a Provisional re-take never replaces a Captured reading. It compares against `previous(vowel)`, the wizard's GUARDED reading.
 *   - CANCEL: Stop, Escape, and the visit's close call `cancel()`, which works in every phase up to the moment the reading is DELIVERED
 *     (`onCaptured` or `onRolledBack`). After that the take cannot be cancelled, so "Nothing is saved from it" stays true through the dwell.
 *   - A TAP ON A VOWEL is the screen's: it focuses and never records, so `begin()` is called only by Start, and during a take it returns false.
 *   - THE DWELL (DESK DEFAULT 2026-11-16, Dann's to strike): after a capture the screen rests 1.4 s on the new dot (`DWELL_MS`, held under reduced
 *     motion too: only the glide goes), or less if the singer taps a vowel (`endDwell()`).
 *   - EACH TAKE HAS AN ID. A callback from an earlier take, a late `CANCELLED` above all, is dropped.
 *   - THE TICKS: four soft ticks on the four seconds of Sing, none elsewhere, from the ritual's own context, made inside the Start tap.
 *
 * ONE CHOICE BEYOND THE BRIEF, from N.199: a cancelled take is reported through `onFailed` with the `CaptureError` code `CANCELLED`, once, whether
 * the singer cancelled or the session did, so the take record can note cancels without a fourth event. A real failure is any other code.
 */
import { runCountIn, BREATHE_MS, SING_MS, SHAPE_MS, type CountInStep } from './count-in';
import type { TakePartId } from './take-line';
import type { CaptureSession } from './engine/session';
import type { CaptureError } from './engine/errors';
import type { CalibratedFormant, Vowel } from './engine/types';

/** The fixed sweep, which the line paces (`engine/live.ts` `SWEEP_S`, 3.0 s). */
export const SWEEP_MS = 3000;
/** How long the screen rests on the new dot before it is idle again and the focus moves on (DESK DEFAULT 2026-11-16, Dann's to strike). Held under reduced motion. */
export const DWELL_MS = 1400;
/** How long the glide to the next vowel takes (about 800 ms; Dann 2026-11-15 19:16: "the chart's zoom toward the vowel ... for the switch to every vowel"). */
export const GLIDE_MS = 800;
/** The first quarter of Fry is the wait for steady fry; it fills over the gate's window (`engine/live.ts` `GATE_WINDOW_S`, 1.0 s). */
export const WAIT_QUARTER = 0.25;
export const WAIT_FILL_MS = 1000;
/** The line's update step, and its coarser step under reduced motion (it still advances). */
export const PROGRESS_STEP_MS = 50;
export const PROGRESS_STEP_REDUCED_MS = 250;

export type RitualPhase = 'idle' | 'breathe' | 'sing' | 'shape' | 'listening' | 'sweep' | 'landing';

/** What the take line shows: the part the take is in, how far through it (0 to 1), and whether it is holding for steady fry. */
export interface TakeProgress {
	part: TakePartId;
	within: number;
	holding: boolean;
}

/**
 * What the screen should say: a key and the vowel it is about. Keys are the tree's (`capture.cue.breathe`, `pacifier.singFirst`, `pacifier.pause`,
 * `pacifier.beginPhonating`, `pacifier.nowSustain`, `pacifier.captured`, `pacifier.rolledBack`, `pacifier.cancelled`, `pacifier.error.*`) and
 * `capture.uncertain`, which replaced the wheel's `pacifier.sampleUncertain`.
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
	/** The audio tick on the seconds of Sing (default true). */
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
	/** The take line's state; null when idle. */
	readonly take: TakeProgress | null;
	readonly cue: RitualCue;
	/** Whether a take is in progress and can still be cancelled (every phase before the reading is delivered). */
	readonly cancellable: boolean;
	/** Starts a take. False, and nothing happens, when a take is already in progress. */
	begin(vowel: Vowel): boolean;
	/** Ends the take in progress. False, and nothing happens, when there is none or its reading is already delivered. */
	cancel(): boolean;
	/** Ends the landing (the dwell on the new dot) at once. False, and nothing happens, in any other phase. The reading is already delivered and kept. */
	endDwell(): boolean;
	/** Closes the tick's audio context without tearing the ritual down (the visit helper's close, Step 1). A later `begin()` makes a new one. */
	closeTicks(): void;
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

const PART_MS: Record<'breathe' | 'sing' | 'shape', number> = { breathe: BREATHE_MS, sing: SING_MS, shape: SHAPE_MS };

export function createCaptureRitual(deps: CaptureRitualDeps): CaptureRitual {
	let phase = $state<RitualPhase>('idle');
	let vowel = $state<Vowel | null>(null);
	let progress = $state(0);
	let take = $state<TakeProgress | null>(null);
	let cue = $state<RitualCue>({ key: '', vowel: null });

	let takeId = 0;
	let timers: ReturnType<typeof setTimeout>[] = [];
	let stepTimer: ReturnType<typeof setInterval> | null = null;
	let sessionStarted = false;
	let clockDone = false;
	let pending: CalibratedFormant | null = null;
	let partStartedAt = 0;
	let fryStartedAt = 0;
	let sweepStartedAt = 0;
	let audioCtx: AudioContext | undefined;
	let destroyed = false;

	const after = (ms: number, fn: () => void) => {
		timers.push(setTimeout(fn, ms));
	};
	const stopTicker = () => {
		if (stepTimer !== null) clearInterval(stepTimer);
		stepTimer = null;
	};
	const clearTimers = () => {
		for (const t of timers) clearTimeout(t);
		timers = [];
		stopTicker();
	};
	const say = (key: string, v: Vowel | null) => {
		cue = { key, vowel: v };
	};

	/**
	 * The tick's own audio context (not the session's), made and resumed inside the Start tap, which is a user gesture: the first tick comes later
	 * than the tap, and a context made then may not run on iOS. Optional; a failure must never block the take.
	 */
	function prepareTicks() {
		if (deps.ticks === false) return;
		try {
			if (!audioCtx || audioCtx.state === 'closed') audioCtx = new AudioContext();
			if (audioCtx.state === 'suspended') void audioCtx.resume();
		} catch {
			// Audio is optional.
		}
	}
	function closeTicks() {
		try {
			void audioCtx?.close();
		} catch {
			// Already closed.
		}
		audioCtx = undefined;
	}

	/** A short soft sine tick; optional, and a failure must never block the take. */
	function tick() {
		if (deps.ticks === false) return;
		try {
			prepareTicks();
			if (!audioCtx) return;
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

	/** The take line and the sweep's progress, from the clock. One timer runs from the tap to the delivery of the reading. */
	function update(id: number) {
		if (id !== takeId) return;
		const now = Date.now();
		if (phase === 'breathe' || phase === 'sing' || phase === 'shape') {
			take = { part: phase, within: Math.min(1, Math.max(0, (now - partStartedAt) / PART_MS[phase])), holding: false };
		} else if (phase === 'listening') {
			const within = Math.min(WAIT_QUARTER, ((now - fryStartedAt) / WAIT_FILL_MS) * WAIT_QUARTER);
			take = { part: 'fry', within, holding: within >= WAIT_QUARTER };
		} else if (phase === 'sweep') {
			progress = Math.min(1, (now - sweepStartedAt) / SWEEP_MS);
			take = { part: 'fry', within: WAIT_QUARTER + (1 - WAIT_QUARTER) * progress, holding: false };
		}
	}
	function startTicker(id: number) {
		stopTicker();
		stepTimer = setInterval(() => update(id), deps.reducedMotion() ? PROGRESS_STEP_REDUCED_MS : PROGRESS_STEP_MS);
	}

	function toIdle() {
		clearTimers();
		phase = 'idle';
		vowel = null;
		progress = 0;
		take = null;
		sessionStarted = false;
		clockDone = false;
		pending = null;
	}

	function begin(v: Vowel): boolean {
		if (destroyed || phase !== 'idle') return false;
		const id = ++takeId;
		prepareTicks();
		vowel = v;
		progress = 0;
		sessionStarted = false;
		clockDone = false;
		pending = null;
		const enter = (p: 'breathe' | 'sing' | 'shape', key: string) => {
			phase = p;
			partStartedAt = Date.now();
			take = { part: p, within: 0, holding: false };
			say(key, v);
		};
		startTicker(id);
		runCountIn((step: CountInStep) => {
			if (id !== takeId) return;
			if (step === 'fry') return startListening(id, v);
			if (step === 'tick') return tick();
			if (step === 'breathe') return enter('breathe', 'capture.cue.breathe');
			if (step === 'sing') return enter('sing', 'pacifier.singFirst');
			enter('shape', 'pacifier.pause');
		}, after);
		return true;
	}

	function startListening(id: number, v: Vowel) {
		phase = 'listening';
		fryStartedAt = Date.now();
		take = { part: 'fry', within: 0, holding: false };
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
		take = { part: 'fry', within: WAIT_QUARTER, holding: false };
		// The line is a fixed 3.0 s clock that never stalls, independent of the engine's delivery time; delivery waits on both.
		after(SWEEP_MS, () => {
			if (id !== takeId || phase !== 'sweep') return;
			clockDone = true;
			progress = 1;
			take = { part: 'fry', within: 1, holding: false };
			stopTicker();
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
		take = { part: 'fry', within: 1, holding: false };
		const prev = deps.previous(v);
		if (formant.reading === 'provisional' && prev?.reading === 'captured') {
			// The re-take rule: a Provisional re-take never replaces a Captured reading.
			say('pacifier.rolledBack', v);
			deps.onRolledBack?.(v, formant);
		} else {
			say(formant.reading === 'provisional' ? 'capture.uncertain' : 'pacifier.captured', v);
			deps.onCaptured?.(v, formant);
		}
		// The dwell holds under reduced motion too: only the glide goes (the screen's).
		after(DWELL_MS, () => id === takeId && toIdle());
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

	function endDwell(): boolean {
		if (destroyed || phase !== 'landing') return false;
		toIdle();
		return true;
	}

	function destroy() {
		if (destroyed) return;
		destroyed = true;
		const hadSession = sessionStarted;
		takeId++;
		toIdle();
		if (hadSession) deps.session.cancel();
		closeTicks();
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
		get take() {
			return take;
		},
		get cue() {
			return cue;
		},
		get cancellable() {
			return phase !== 'idle' && phase !== 'landing';
		},
		begin,
		cancel,
		endDwell,
		closeTicks,
		destroy
	};
}
