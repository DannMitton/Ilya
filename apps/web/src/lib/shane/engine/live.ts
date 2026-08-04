/**
 * Live CaptureSession: the real auditory input behind the pacifier.
 *
 * Implements the CaptureSession contract (session.ts; Phase 3a brief and
 * Kimi's review §2.2/§2.5, 2026-06-09) over getUserMedia and the §9 batch
 * core. The stub (stub.ts) drove this seam with timers; this class replaces
 * it behind the same interface, per the locked port order (wizard spec v1
 * §2, step 2, capture side).
 *
 * Shape of a capture (engine spec v1 §2):
 *   1. Acquire the microphone with all voice processing disabled
 *      (echoCancellation, noiseSuppression, autoGainControl all off:
 *      processing designed for speech calls would smear the glottal pulses
 *      the Pulse-Register Detector reads).
 *   2. Listen. The detector (engine spec §3, eight conditions, all must
 *      pass) runs on the trailing 1.0 s of audio every 250 ms. While
 *      listening, only the trailing 2.0 s is retained, so a slow start can
 *      never overflow the 5 s recording ceiling.
 *   3. Stable fry confirmed -> onStableFry() (the second beat of the
 *      two-beat split; the pacifier starts its 3.0 s arc), and recording
 *      proper begins: the 0.5 s already buffered before the confirm is kept
 *      (the gate-settling window in the spec's §2 arithmetic) plus the
 *      3.0 s sweep, about 3.5 s recorded in all.
 *   4. Sweep ends -> the microphone is released immediately (tracks
 *      stopped, context closed: the mic indicator goes dark between
 *      captures), 500 ms is trimmed from each end (spec §2, the fixed
 *      trims), and the roughly 2.5 s interior (clearing the 2.0 s target)
 *      goes through runCapture(): structural checks, the post-hoc detector
 *      pass, then the §9 analyze().
 *
 * Shape of a readiness run (item 1.4a; wizard spec v1 §2 Phase 1), added
 * 2026-08-04 on Dann's Option A ruling. Same acquisition, different driver:
 *   1. Acquire the microphone exactly as above.
 *   2. Bank one quiet second, after a short settling discard, as the ambient
 *      noise floor. Then onQuiet(), and the wizard asks for the fry.
 *   3. Listen for the throwaway fry with the same detector on the same
 *      trailing window. A window is only considered at all once it carries
 *      something above the banked quiet second (item 1.4a, E.26); finish on the
 *      first accepting window that does.
 *   4. On timeout, finish anyway from the most recent window that yielded an
 *      inter-pulse rate. This is deliberate: the range check is guidance, not
 *      gatekeeping (spec §2 Phase 1, "flag, do not block"), so a fry at 15 Hz
 *      must produce a range verdict, not a failure. Only a run that never
 *      recovered any rate at all is an honest failure.
 *
 *      The presence test in step 3 is what makes step 4 mean anything. It was
 *      added after a walk, not a reading: on 2026-08-04 the detector accepted a
 *      window of Dann's silent room, so the run finished about one second after
 *      the fry prompt appeared and reported 23.1 Hz for a fry that never
 *      happened. The ten-second timeout had been unreachable in practice.
 *   5. Release the microphone, then measure through readiness.ts. No formant
 *      extraction and no vowel are involved at any point.
 *
 * Engineering decisions taken in this file (raised once at build time,
 * recorded in the handover):
 *   - AudioWorklet first, inlined as a Blob URL so this stays one file with
 *     no static-asset placement; ScriptProcessorNode fallback if the
 *     worklet path is unavailable (older Safari, restrictive CSP). Both are
 *     routed through a zero-gain node, so the microphone is never audible.
 *   - The AudioContext requests 48 kHz and falls back to the device
 *     default. The engine's FFT constants (4096-point, engine spec §5)
 *     assume 44.1/48 kHz; requesting 48 kHz keeps unusual device rates
 *     (96 kHz interfaces) from coarsening the bins.
 *   - A 10 s listening timeout, counted from mic-live so a permission
 *     prompt never eats it. No stable fry inside it resolves to
 *     EXTRACTION_FAILED with the last failed detector conditions carried in
 *     `cause`. Likewise a post-hoc 'reprompt' outcome (runCapture judged
 *     the recorded sample not-fry) maps to EXTRACTION_FAILED: the error
 *     vocabulary is locked (errors.ts, no invented codes), and the
 *     pacifier's existing default caption reads honestly for both. Wiring
 *     the engine spec §3 re-prompt line ("...more like a sung tone than
 *     vocal fry...") to these cases is a copy decision, deferred to Dann.
 *   - Analysis (runCapture) runs on the main thread: one blocking call of
 *     roughly 100-300 ms at sweep end, after the arc has finished. If real
 *     devices show jank, moving it behind a Worker is a contained v1.x
 *     change; noted here, not built.
 */

import type { Vowel, VoiceType } from './types';
import type { CaptureError, ShaneEngineError } from './errors';
import type { CaptureSession, CaptureHandlers, ReadinessHandlers } from './session';
import { detect } from './detector';
import { assessReadiness, bandPower, classifyFryPresence, roomSnrDb } from './readiness';
import { runCapture, type CaptureOutcome } from './analyze';

/** Preferred capture rate; the engine's FFT constants assume 44.1/48 kHz. */
const TARGET_SR = 48000;
/** Live-gate analysis window: 8 pulses at the 20 Hz floor need 0.4 s; 1.0 s gives margin. */
const GATE_WINDOW_S = 1.0;
/** Live-gate evaluation cadence. */
const GATE_HOP_MS = 250;
/** Audio kept from before the stable-fry confirm (the gate-settling window, spec §2). */
const PREROLL_S = 0.5;
/** The fixed sweep the pacifier's arc paces (spec §2). */
const SWEEP_S = 3.0;
/** Fixed trim from each end of the recorded buffer at analysis time (spec §2). */
const TRIM_S = 0.5;
/** Rolling retention while listening; keeps the 5 s ceiling unreachable. */
const LISTEN_RETAIN_S = 2.0;
/** Listening timeout, counted from mic-live. */
const LISTEN_TIMEOUT_MS = 10_000;

/** The ambient window (wizard spec v1 §2 Phase 1, "measured over one second"). */
const QUIET_S = 1.0;
/**
 * Discarded ahead of the quiet window. A track that has just gone live can
 * carry a switch-on transient, and the settling costs nothing: the retention
 * cap below is 2.0 s and this plus QUIET_S is 1.25 s.
 */
const QUIET_SETTLE_S = 0.25;
/** Listening timeout for the throwaway fry, counted from the end of the quiet second. */
const READINESS_FRY_TIMEOUT_MS = 10_000;

const WORKLET_NAME = 'shane-capture-tap';
/**
 * The worklet source, inlined so no static asset needs placing. It batches
 * the render quantum (128 samples) into 2048-sample posts, about 23
 * messages per second instead of 375. The partial tail buffer at stop is
 * discarded (under 43 ms), which the 500 ms end trim swallows anyway.
 */
const WORKLET_SRC = `
class ShaneCaptureTap extends AudioWorkletProcessor {
	constructor() {
		super();
		this.buf = new Float32Array(2048);
		this.n = 0;
	}
	process(inputs) {
		const ch = inputs[0] && inputs[0][0];
		if (ch) {
			let i = 0;
			while (i < ch.length) {
				const take = Math.min(ch.length - i, 2048 - this.n);
				this.buf.set(ch.subarray(i, i + take), this.n);
				this.n += take;
				i += take;
				if (this.n === 2048) {
					this.port.postMessage(this.buf.slice(0));
					this.n = 0;
				}
			}
		}
		return true;
	}
}
registerProcessor('${WORKLET_NAME}', ShaneCaptureTap);
`;

/**
 * TEMPORARY diagnostic switch (2026-07-02): logs the capture pipeline to the
 * browser console so the gate's behaviour can be read on real devices and
 * rooms. Flip to false (or strip the dbg calls) once the gate is tuned.
 */
const DEBUG = true;
function dbg(...args: unknown[]): void {
	if (DEBUG) console.info('[shane-live]', ...args);
}
function fmt(x: number | null, digits = 2): string {
	return x === null || Number.isNaN(x) ? 'n/a' : x.toFixed(digits);
}

/** Map a getUserMedia rejection onto the locked CaptureError vocabulary. */
function mapMicError(e: unknown): CaptureError {
	const name = e instanceof DOMException || e instanceof Error ? e.name : '';
	if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError')
		return { code: 'MIC_PERMISSION_DENIED', message: 'Microphone permission was denied.' };
	if (name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'DevicesNotFoundError')
		return { code: 'MIC_NOT_FOUND', message: 'No microphone was found.' };
	if (name === 'NotReadableError' || name === 'AbortError' || name === 'TrackStartError')
		return { code: 'NO_AUDIO_INPUT', message: 'The microphone could not be read.' };
	return { code: 'EXTRACTION_FAILED', message: 'Microphone setup failed.', cause: e };
}

export class LiveCaptureSession implements CaptureSession {
	/** Generation counter: every async continuation checks it, so a cancel
	 * or a superseding start silences stale callbacks (same pattern as the
	 * stub's `active` flag, extended to real async boundaries). */
	private gen = 0;
	private active = false;
	private recording = false;
	private handlers: CaptureHandlers | null = null;
	/** Set for a readiness run instead of `handlers`; never both at once. */
	private readinessHandlers: ReadinessHandlers | null = null;
	private stream: MediaStream | null = null;
	private ctx: AudioContext | null = null;
	private srcNode: MediaStreamAudioSourceNode | null = null;
	private tapNode: AudioNode | null = null;
	private sinkNode: GainNode | null = null;
	private sampleRate = TARGET_SR;
	private chunks: Float32Array[] = [];
	private chunkSamples = 0;
	private loggedFirstChunk = false;
	private gateTimer: ReturnType<typeof setInterval> | null = null;
	private stopTimer: ReturnType<typeof setTimeout> | null = null;
	private listenTimer: ReturnType<typeof setTimeout> | null = null;
	private quietTimer: ReturnType<typeof setInterval> | null = null;
	private lastFailed: string[] = [];
	/** The banked ambient second of a readiness run. */
	private quietBuf: Float64Array | null = null;
	/**
	 * The banked ambient second's band power, held so the readiness tick can ask
	 * "is anything actually happening?" every hop without recomputing a Welch
	 * PSD over a buffer that never changes. `null` = not measurable, which the
	 * tick treats as "cannot tell", never as "nothing there".
	 */
	private quietPower: number | null = null;
	/** The most recent readiness window that yielded an inter-pulse rate. */
	private fryBuf: Float64Array | null = null;

	start(vowel: Vowel, voiceType: VoiceType | undefined, handlers: CaptureHandlers): void {
		// A new start supersedes any prior capture silently, matching the
		// stub; CANCELLED is reserved for the explicit cancel() gesture.
		this.reset();
		this.active = true;
		this.handlers = handlers;
		void this.run(this.gen, vowel, voiceType);
	}

	/**
	 * The readiness gate (item 1.4a). Supersedes any run in flight on the same
	 * terms as start(), and shares the whole microphone lifecycle below.
	 */
	startReadiness(handlers: ReadinessHandlers): void {
		this.reset();
		this.active = true;
		this.readinessHandlers = handlers;
		void this.runReadiness(this.gen);
	}

	/** Common pre-run teardown: supersede silently and clear every buffer. */
	private reset(): void {
		this.gen++;
		this.active = false;
		this.handlers = null;
		this.readinessHandlers = null;
		this.chunks = [];
		this.chunkSamples = 0;
		this.recording = false;
		this.lastFailed = [];
		this.loggedFirstChunk = false;
		this.quietBuf = null;
		this.quietPower = null;
		this.fryBuf = null;
		this.releaseAudio();
	}

	/**
	 * Fire-and-forget teardown (session contract; Kimi §2.5): stop the
	 * tracks, release the context, abort in-flight buffering and timers, and
	 * confirm with CANCELLED only from a non-terminal state.
	 */
	cancel(): void {
		this.gen++;
		const wasActive = this.active;
		const handlers = this.handlers;
		const readinessHandlers = this.readinessHandlers;
		this.active = false;
		this.recording = false;
		this.handlers = null;
		this.readinessHandlers = null;
		this.chunks = [];
		this.chunkSamples = 0;
		this.quietBuf = null;
		this.quietPower = null;
		this.fryBuf = null;
		this.releaseAudio();
		if (wasActive) {
			const cancelled: ShaneEngineError = { code: 'CANCELLED', message: 'Capture cancelled.' };
			handlers?.onError(cancelled);
			readinessHandlers?.onError(cancelled);
		}
	}

	/** Terminal failure: release everything, then report once. */
	private fail(gen: number, error: ShaneEngineError): void {
		if (gen !== this.gen) return;
		dbg('fail:', error.code, '—', error.message, 'cause' in error ? JSON.stringify(error.cause) : '');
		const handlers = this.handlers;
		const readinessHandlers = this.readinessHandlers;
		this.active = false;
		this.recording = false;
		this.handlers = null;
		this.readinessHandlers = null;
		this.chunks = [];
		this.chunkSamples = 0;
		this.quietBuf = null;
		this.quietPower = null;
		this.fryBuf = null;
		this.releaseAudio();
		handlers?.onError(error);
		readinessHandlers?.onError(error);
	}

	/**
	 * Acquire the microphone and stand up the graph. Shared by both drivers:
	 * one owner of getUserMedia, which is the whole reason Option A was ruled.
	 * Returns false when the run has failed or been superseded, in which case
	 * the caller must do nothing further.
	 */
	private async acquire(gen: number): Promise<boolean> {
		let stream: MediaStream;
		try {
			const md = typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined;
			if (!md?.getUserMedia) {
				this.fail(gen, {
					code: 'MIC_NOT_FOUND',
					message: 'Microphone capture is not available in this browser context.'
				});
				return false;
			}
			stream = await md.getUserMedia({
				audio: {
					echoCancellation: false,
					noiseSuppression: false,
					autoGainControl: false,
					channelCount: 1
				}
			});
		} catch (e) {
			this.fail(gen, mapMicError(e));
			return false;
		}
		if (gen !== this.gen) {
			for (const t of stream.getTracks()) t.stop();
			return false;
		}
		this.stream = stream;
		const track = stream.getAudioTracks()[0];
		dbg('mic acquired:', track?.label ?? '(unlabelled)');
		dbg('track settings:', JSON.stringify(track?.getSettings() ?? {}));

		let ctx: AudioContext;
		try {
			ctx = new AudioContext({ sampleRate: TARGET_SR });
		} catch {
			ctx = new AudioContext();
		}
		this.ctx = ctx;
		this.sampleRate = ctx.sampleRate;
		dbg('audio context: sampleRate', ctx.sampleRate, 'state', ctx.state);
		try {
			if (ctx.state === 'suspended') await ctx.resume();
		} catch {
			// Best-effort; the two-tap arming means a user gesture preceded this.
		}
		if (gen !== this.gen) return false;

		try {
			this.srcNode = ctx.createMediaStreamSource(stream);
			this.sinkNode = ctx.createGain();
			this.sinkNode.gain.value = 0; // capture-only: the mic must never be audible
			this.sinkNode.connect(ctx.destination);
			this.tapNode = await this.buildTap(ctx, gen);
			if (gen !== this.gen) return false;
			this.srcNode.connect(this.tapNode);
			this.tapNode.connect(this.sinkNode);
		} catch (e) {
			this.fail(gen, { code: 'EXTRACTION_FAILED', message: 'Audio capture setup failed.', cause: e });
			return false;
		}
		return true;
	}

	private async run(gen: number, vowel: Vowel, voiceType: VoiceType | undefined): Promise<void> {
		if (!(await this.acquire(gen))) return;
		this.gateTimer = setInterval(() => this.gateTick(gen, vowel, voiceType), GATE_HOP_MS);
		this.listenTimer = setTimeout(() => {
			if (gen !== this.gen || !this.active || this.recording) return;
			this.fail(gen, {
				code: 'EXTRACTION_FAILED',
				message: 'Stable vocal fry was not detected.',
				cause: { reason: 'gate-timeout', failed: this.lastFailed }
			});
		}, LISTEN_TIMEOUT_MS);
	}

	/** The readiness driver: bank the quiet second, then listen for the fry. */
	private async runReadiness(gen: number): Promise<void> {
		if (!(await this.acquire(gen))) return;
		const need = Math.floor((QUIET_SETTLE_S + QUIET_S) * this.sampleRate);
		const want = Math.floor(QUIET_S * this.sampleRate);
		this.quietTimer = setInterval(() => {
			if (gen !== this.gen || !this.active) return;
			if (this.chunkSamples < need) {
				dbg('readiness quiet: buffering', this.chunkSamples, '/', need, 'samples');
				return;
			}
			if (this.quietTimer) {
				clearInterval(this.quietTimer);
				this.quietTimer = null;
			}
			this.quietBuf = this.tail(want);
			// The reference for every presence test below (E.26). Measured once
			// here rather than per hop, because this buffer never changes again.
			this.quietPower = bandPower(this.quietBuf, this.sampleRate);
			// Start the fry side from an empty buffer, so no ambient audio can
			// leak into the sample that supplies the signal side of the ratio.
			this.chunks = [];
			this.chunkSamples = 0;
			dbg(
				'readiness: quiet second banked,', want, 'samples at', this.sampleRate, 'Hz',
				'| quiet band power', this.quietPower === null ? 'n/a' : this.quietPower.toExponential(3)
			);
			this.readinessHandlers?.onQuiet();
			if (gen !== this.gen || !this.active) return;
			this.gateTimer = setInterval(() => this.readinessTick(gen), GATE_HOP_MS);
			this.listenTimer = setTimeout(() => {
				if (gen !== this.gen || !this.active) return;
				dbg('readiness: fry listen timed out; reporting best evidence');
				this.finishReadiness(gen);
			}, READINESS_FRY_TIMEOUT_MS);
		}, GATE_HOP_MS);
	}

	/** AudioWorklet tap, with a ScriptProcessorNode fallback. */
	private async buildTap(ctx: AudioContext, gen: number): Promise<AudioNode> {
		if (typeof AudioWorkletNode === 'function' && ctx.audioWorklet) {
			try {
				const url = URL.createObjectURL(new Blob([WORKLET_SRC], { type: 'application/javascript' }));
				try {
					await ctx.audioWorklet.addModule(url);
				} finally {
					URL.revokeObjectURL(url);
				}
				const node = new AudioWorkletNode(ctx, WORKLET_NAME, {
					numberOfInputs: 1,
					numberOfOutputs: 1,
					outputChannelCount: [1]
				});
				node.port.onmessage = (ev: MessageEvent) => this.onChunk(gen, ev.data as Float32Array);
				dbg('tap: AudioWorklet');
				return node;
			} catch {
				// Fall through to the ScriptProcessor path.
			}
		}
		const node = ctx.createScriptProcessor(4096, 1, 1);
		node.onaudioprocess = (ev: AudioProcessingEvent) =>
			this.onChunk(gen, new Float32Array(ev.inputBuffer.getChannelData(0)));
		dbg('tap: ScriptProcessor fallback');
		return node;
	}

	private onChunk(gen: number, data: Float32Array): void {
		if (gen !== this.gen || !this.active) return;
		if (!this.loggedFirstChunk) {
			this.loggedFirstChunk = true;
			dbg('first audio chunk received:', data.length, 'samples');
		}
		this.chunks.push(data);
		this.chunkSamples += data.length;
		if (!this.recording) this.trimToTail(Math.floor(LISTEN_RETAIN_S * this.sampleRate));
	}

	/** Drop whole chunks from the front until at most `cap` samples remain. */
	private trimToTail(cap: number): void {
		while (this.chunks.length > 1 && this.chunkSamples - this.chunks[0].length >= cap) {
			this.chunkSamples -= this.chunks[0].length;
			this.chunks.shift();
		}
	}

	/** Assemble the trailing `n` samples into a Float64Array. */
	private tail(n: number): Float64Array {
		const out = new Float64Array(n);
		let need = n;
		for (let ci = this.chunks.length - 1; ci >= 0 && need > 0; ci--) {
			const c = this.chunks[ci];
			const take = Math.min(need, c.length);
			for (let i = 0; i < take; i++) out[need - take + i] = c[c.length - take + i];
			need -= take;
		}
		return out;
	}

	/** The live stable-fry gate: engine spec §3 on the trailing window. */
	private gateTick(gen: number, vowel: Vowel, voiceType: VoiceType | undefined): void {
		if (gen !== this.gen || !this.active || this.recording) return;
		const win = Math.floor(GATE_WINDOW_S * this.sampleRate);
		if (this.chunkSamples < win) {
			dbg('gate: buffering', this.chunkSamples, '/', win, 'samples');
			return;
		}
		const y = this.tail(win);
		let sumSq = 0;
		for (let i = 0; i < y.length; i++) sumSq += y[i] * y[i];
		const rms = Math.sqrt(sumSq / y.length);
		const det = detect(y, this.sampleRate);
		this.lastFailed = det.failed;
		dbg(
			'gate: rms', rms.toFixed(4),
			'| pulses', det.nPulses,
			'| rate', fmt(det.rateHz, 1), 'Hz',
			'| cv', fmt(det.cv),
			'| decay', fmt(det.decay),
			'| flatness', det.flatness.toFixed(3),
			// fmt() rather than toFixed(): snrDb is nullable since item 1.4b, and
			// a null here means the device's sample rate collapsed the noise band.
			'| snr', fmt(det.snrDb, 1), 'dB',
			'|', det.accept ? 'ACCEPT' : 'refused: ' + det.failed.join(', '),
			det.undecided.length ? '| undecided: ' + det.undecided.join(', ') : ''
		);
		if (!det.accept) return;
		// Stable fry confirmed: the second beat. Keep the settling pre-roll,
		// record the 3.0 s sweep, then analyse.
		this.recording = true;
		if (this.gateTimer) {
			clearInterval(this.gateTimer);
			this.gateTimer = null;
		}
		if (this.listenTimer) {
			clearTimeout(this.listenTimer);
			this.listenTimer = null;
		}
		this.trimToTail(Math.floor(PREROLL_S * this.sampleRate));
		dbg('stable fry confirmed; sweep started');
		this.handlers?.onStableFry();
		this.stopTimer = setTimeout(() => this.finish(gen, vowel, voiceType), SWEEP_S * 1000);
	}

	/**
	 * The readiness gate's listening tick. Deliberately NOT the capture gate:
	 * it keeps every window that yielded an inter-pulse rate, so a fry outside
	 * the 20-80 Hz band still produces a range verdict rather than a timeout.
	 * An accepting window ends the run at once.
	 */
	private readinessTick(gen: number): void {
		if (gen !== this.gen || !this.active) return;
		const win = Math.floor(GATE_WINDOW_S * this.sampleRate);
		if (this.chunkSamples < win) {
			dbg('readiness gate: buffering', this.chunkSamples, '/', win, 'samples');
			return;
		}
		const y = this.tail(win);
		const det = detect(y, this.sampleRate);
		this.lastFailed = det.failed;
		// Is anything happening at all? (E.26.) The detector answers "at what
		// rate", never "is there a voice", and on 2026-08-04 it answered the
		// first question about a silent room and was believed. The room ratio
		// is the instrument for the second question, and we already hold both
		// sides of it here.
		const snr = roomSnrDb(this.quietPower, bandPower(y, this.sampleRate));
		const heard = classifyFryPresence(snr);
		dbg(
			'readiness gate: pulses', det.nPulses,
			'| rate', fmt(det.rateHz, 1), 'Hz',
			'| room', fmt(snr, 1), 'dB',
			'| heard', heard === null ? 'n/a' : heard,
			'|', det.accept ? 'ACCEPT' : 'refused: ' + det.failed.join(', ')
		);
		// Nothing above the ambient second: this window is a second reading of
		// the room. Keep listening. The singer gets the full
		// READINESS_FRY_TIMEOUT_MS to actually fry, which is what the timeout
		// was for; before E.26 an accepting window of room noise could end the
		// run about a second after the prompt appeared, and the singer never
		// got a turn. `heard === null` does not veto: an unmeasurable ratio is
		// not evidence of silence.
		if (heard === false) return;
		// An accepting window always carries a rate (c3 gates on the interval),
		// so this assignment covers the accepting case as well.
		if (det.rateHz !== null) this.fryBuf = y;
		if (!det.accept) return;
		this.finishReadiness(gen);
	}

	/** Release the microphone, then measure. Terminal for a readiness run. */
	private finishReadiness(gen: number): void {
		if (gen !== this.gen || !this.active) return;
		const handlers = this.readinessHandlers;
		const quiet = this.quietBuf;
		const fry = this.fryBuf;
		const sr = this.sampleRate;
		const failed = this.lastFailed;
		// Terminal before any callback, so a cancel() issued from inside a
		// callback is a no-op rather than a spurious CANCELLED.
		this.active = false;
		this.recording = false;
		this.handlers = null;
		this.readinessHandlers = null;
		this.chunks = [];
		this.chunkSamples = 0;
		this.quietBuf = null;
		this.quietPower = null;
		this.fryBuf = null;
		this.releaseAudio();

		if (!quiet || !fry) {
			// No inter-pulse rate was ever recovered. There is nothing to give
			// range guidance about, so this is an honest failure rather than a
			// verdict of "out of range".
			handlers?.onError({
				code: 'EXTRACTION_FAILED',
				message: 'No vocal fry was heard during the readiness check.',
				cause: { reason: 'readiness-timeout', failed }
			});
			return;
		}
		const result = assessReadiness(quiet, fry, sr);
		dbg('readiness outcome:', JSON.stringify(result));
		handlers?.onComplete(result);
	}

	/** Sweep over: release the microphone, trim, and run the §9 core. */
	private finish(gen: number, vowel: Vowel, voiceType: VoiceType | undefined): void {
		if (gen !== this.gen || !this.active) return;
		const handlers = this.handlers;
		const sr = this.sampleRate;
		const chunks = this.chunks;
		const total = this.chunkSamples;
		// Terminal before any callback, so a cancel() issued from inside a
		// callback is a no-op rather than a spurious CANCELLED.
		this.active = false;
		this.recording = false;
		this.handlers = null;
		this.chunks = [];
		this.chunkSamples = 0;
		this.releaseAudio();

		dbg('sweep complete; analysing', total, 'samples at', sr, 'Hz');
		const full = new Float64Array(total);
		let off = 0;
		for (const c of chunks) {
			full.set(c, off);
			off += c.length;
		}
		const trim = Math.floor(TRIM_S * sr);
		if (full.length <= 2 * trim) {
			handlers?.onError({
				code: 'SAMPLE_TOO_SHORT',
				message: 'The recorded sample was too short to analyse.',
				actualMs: (full.length / sr) * 1000,
				minimumMs: 2 * TRIM_S * 1000 + 500
			});
			return;
		}
		const y = full.subarray(trim, full.length - trim);

		let outcome: CaptureOutcome;
		try {
			outcome = runCapture(y, sr, vowel, voiceType);
		} catch (e) {
			handlers?.onError({ code: 'EXTRACTION_FAILED', message: 'Analysis failed unexpectedly.', cause: e });
			return;
		}
		dbg('outcome:', JSON.stringify(outcome));
		if (outcome.outcome === 'reading') handlers?.onComplete(outcome.formant);
		else if (outcome.outcome === 'reprompt')
			handlers?.onError({
				code: 'EXTRACTION_FAILED',
				message: 'The sample did not read as vocal fry.',
				cause: { reason: outcome.reason, failed: outcome.failed }
			});
		else handlers?.onError(outcome.error as ShaneEngineError);
	}

	/** Release all audio resources: timers, graph, tracks, context. */
	private releaseAudio(): void {
		if (this.gateTimer) {
			clearInterval(this.gateTimer);
			this.gateTimer = null;
		}
		if (this.quietTimer) {
			clearInterval(this.quietTimer);
			this.quietTimer = null;
		}
		if (this.stopTimer) {
			clearTimeout(this.stopTimer);
			this.stopTimer = null;
		}
		if (this.listenTimer) {
			clearTimeout(this.listenTimer);
			this.listenTimer = null;
		}
		if (this.tapNode) {
			// typeof guard first: on the ScriptProcessor fallback path the
			// AudioWorkletNode global may not exist, and a bare instanceof
			// against undefined throws.
			if (typeof AudioWorkletNode === 'function' && this.tapNode instanceof AudioWorkletNode)
				this.tapNode.port.onmessage = null;
			if ('onaudioprocess' in this.tapNode)
				(this.tapNode as ScriptProcessorNode).onaudioprocess = null;
		}
		try {
			this.srcNode?.disconnect();
		} catch {
			// already disconnected
		}
		try {
			this.tapNode?.disconnect();
		} catch {
			// already disconnected
		}
		try {
			this.sinkNode?.disconnect();
		} catch {
			// already disconnected
		}
		if (this.stream) for (const t of this.stream.getTracks()) t.stop();
		if (this.ctx && this.ctx.state !== 'closed') void this.ctx.close().catch(() => undefined);
		this.stream = null;
		this.ctx = null;
		this.srcNode = null;
		this.tapNode = null;
		this.sinkNode = null;
	}
}
