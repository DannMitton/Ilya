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
import type { CaptureSession, CaptureHandlers } from './session';
import { detect } from './detector';
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
	private lastFailed: string[] = [];

	start(vowel: Vowel, voiceType: VoiceType | undefined, handlers: CaptureHandlers): void {
		// A new start supersedes any prior capture silently, matching the
		// stub; CANCELLED is reserved for the explicit cancel() gesture.
		this.gen++;
		this.active = false;
		this.handlers = null;
		this.chunks = [];
		this.chunkSamples = 0;
		this.recording = false;
		this.lastFailed = [];
		this.loggedFirstChunk = false;
		this.releaseAudio();
		this.active = true;
		this.handlers = handlers;
		void this.run(this.gen, vowel, voiceType);
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
		this.active = false;
		this.recording = false;
		this.handlers = null;
		this.chunks = [];
		this.chunkSamples = 0;
		this.releaseAudio();
		if (wasActive) handlers?.onError({ code: 'CANCELLED', message: 'Capture cancelled.' });
	}

	/** Terminal failure: release everything, then report once. */
	private fail(gen: number, error: ShaneEngineError): void {
		if (gen !== this.gen) return;
		dbg('fail:', error.code, '—', error.message, 'cause' in error ? JSON.stringify(error.cause) : '');
		const handlers = this.handlers;
		this.active = false;
		this.recording = false;
		this.handlers = null;
		this.chunks = [];
		this.chunkSamples = 0;
		this.releaseAudio();
		handlers?.onError(error);
	}

	private async run(gen: number, vowel: Vowel, voiceType: VoiceType | undefined): Promise<void> {
		let stream: MediaStream;
		try {
			const md = typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined;
			if (!md?.getUserMedia) {
				this.fail(gen, {
					code: 'MIC_NOT_FOUND',
					message: 'Microphone capture is not available in this browser context.'
				});
				return;
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
			return;
		}
		if (gen !== this.gen) {
			for (const t of stream.getTracks()) t.stop();
			return;
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
		if (gen !== this.gen) return;

		try {
			this.srcNode = ctx.createMediaStreamSource(stream);
			this.sinkNode = ctx.createGain();
			this.sinkNode.gain.value = 0; // capture-only: the mic must never be audible
			this.sinkNode.connect(ctx.destination);
			this.tapNode = await this.buildTap(ctx, gen);
			if (gen !== this.gen) return;
			this.srcNode.connect(this.tapNode);
			this.tapNode.connect(this.sinkNode);
		} catch (e) {
			this.fail(gen, { code: 'EXTRACTION_FAILED', message: 'Audio capture setup failed.', cause: e });
			return;
		}

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
			'| snr', det.snrDb.toFixed(1), 'dB',
			'|', det.accept ? 'ACCEPT' : 'refused: ' + det.failed.join(', ')
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
