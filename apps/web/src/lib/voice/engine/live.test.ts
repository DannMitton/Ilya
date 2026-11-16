/**
 * N.203 lane 59 Step 1: the live session's visit. A fake microphone and a fake AudioContext stand in for the browser; fake timers drive the
 * gate. What is pinned (Fable's review of the brief, amendments 1 and 2): a visit keeps the stream and the context across runs, a later run
 * hears its own audio and none from before it, a missed fry or a Stop inside a visit keeps the microphone, only `closeVisit()` and a
 * microphone failure release it, and outside a visit every run acquires and releases as it always did.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveCaptureSession } from './live';
import { synthFry, SYNTH_SR } from './fry-synth';
import { createVisit } from '../visit';
import type { CaptureHandlers } from './session';
import type { CaptureError } from './errors';

interface FakeTrack {
	readyState: 'live' | 'ended';
	label: string;
	stop(): void;
	getSettings(): object;
}
class FakeCtx {
	static all: FakeCtx[] = [];
	sampleRate = SYNTH_SR;
	state: 'running' | 'suspended' | 'closed' = FakeCtx.startSuspended ? 'suspended' : 'running';
	/** A test sets this to start the next contexts suspended, and `holdResume` to keep their `resume()` pending until `releaseResume()`. */
	static startSuspended = false;
	static holdResume = false;
	static releaseResume: (() => void) | null = null;
	destination = {};
	resumes = 0;
	node: { onaudioprocess: ((ev: unknown) => void) | null; connect(): void; disconnect(): void } | null = null;
	constructor() {
		FakeCtx.all.push(this);
	}
	resume() {
		this.resumes++;
		if (FakeCtx.holdResume) {
			return new Promise<void>((done) => {
				FakeCtx.releaseResume = () => {
					this.state = 'running';
					done();
				};
			});
		}
		this.state = 'running';
		return Promise.resolve();
	}
	close() {
		this.state = 'closed';
		return Promise.resolve();
	}
	createMediaStreamSource() {
		return { connect() {}, disconnect() {} };
	}
	createGain() {
		return { gain: { value: 1 }, connect() {}, disconnect() {} };
	}
	createScriptProcessor() {
		this.node = { onaudioprocess: null, connect() {}, disconnect() {} };
		return this.node;
	}
}

let tracks: FakeTrack[];
let getUserMedia: ReturnType<typeof vi.fn>;

beforeEach(() => {
	vi.useFakeTimers();
	vi.spyOn(console, 'info').mockImplementation(() => {});
	FakeCtx.all = [];
	FakeCtx.startSuspended = false;
	FakeCtx.holdResume = false;
	FakeCtx.releaseResume = null;
	tracks = [];
	getUserMedia = vi.fn(async () => {
		const t: FakeTrack = { readyState: 'live', label: 'fake', stop() { t.readyState = 'ended'; }, getSettings: () => ({}) };
		tracks.push(t);
		return { getTracks: () => [t], getAudioTracks: () => [t] };
	});
	vi.stubGlobal('AudioContext', FakeCtx);
	Object.defineProperty(globalThis.navigator, 'mediaDevices', { value: { getUserMedia }, configurable: true });
});
afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

const FRY = () => synthFry({ formants: [270, 700, 2300, 3000, 3700], bandwidths: [60, 90, 120, 180, 250], rate: 50, jitter: 0.03, seed: 5, durationS: 6 });
const SILENCE = new Float32Array(4096);

/** Feeds the live tap `seconds` of `source` from `at`, in 4096-sample blocks, advancing the clock as the audio would arrive. Returns the new offset. */
async function feed(ctx: FakeCtx, source: Float64Array | null, at: number, seconds: number): Promise<number> {
	const blocks = Math.round((seconds * SYNTH_SR) / 4096);
	let off = at;
	for (let b = 0; b < blocks; b++) {
		const data = source ? Float32Array.from(source.subarray(off % (source.length - 4096), (off % (source.length - 4096)) + 4096)) : SILENCE;
		ctx.node?.onaudioprocess?.({ inputBuffer: { getChannelData: () => data } });
		off += 4096;
		await vi.advanceTimersByTimeAsync((4096 / SYNTH_SR) * 1000);
	}
	return off;
}

interface Run {
	events: string[];
	errors: CaptureError[];
	handlers: CaptureHandlers;
}
function run(): Run {
	const r: Run = {
		events: [],
		errors: [],
		handlers: {
			onStableFry: () => r.events.push('fry'),
			onComplete: () => r.events.push('complete'),
			onError: (e) => {
				r.events.push('error:' + e.code);
				r.errors.push(e);
			}
		}
	};
	return r;
}
const ctxNow = () => FakeCtx.all[FakeCtx.all.length - 1];
const startAndSettle = async (s: LiveCaptureSession, r: Run) => {
	s.start('i', 'bass', r.handlers);
	await vi.advanceTimersByTimeAsync(10);
};
/** One whole take: audio until the gate accepts, then the sweep, then the end. */
async function take(s: LiveCaptureSession, r: Run, source = FRY()) {
	await startAndSettle(s, r);
	let at = await feed(ctxNow(), source, 0, 1.6);
	expect(r.events).toContain('fry');
	at = await feed(ctxNow(), source, at, 3.2);
	expect(r.events.some((e) => e === 'complete' || e.startsWith('error:'))).toBe(true);
}

describe('one microphone per visit', () => {
	it('two takes in one visit call getUserMedia once, and the stream and the context stay live between them', async () => {
		const s = new LiveCaptureSession();
		s.openVisit();
		await take(s, run());
		expect(tracks[0].readyState).toBe('live');
		expect(ctxNow().state).toBe('running');
		await take(s, run());
		expect(getUserMedia).toHaveBeenCalledTimes(1);
		expect(FakeCtx.all).toHaveLength(1);
	});

	it('the second take of a visit receives audio and reaches stable fry (the handler reads the run at call time)', async () => {
		const s = new LiveCaptureSession();
		s.openVisit();
		await take(s, run());
		const second = run();
		await take(s, second);
		expect(second.events[0]).toBe('fry');
	});

	it('no audio from before a take reaches it: chunks between runs are dropped and a start clears the buffer', async () => {
		const s = new LiveCaptureSession();
		s.openVisit();
		await take(s, run());
		const internals = s as unknown as { chunkSamples: number };
		await feed(ctxNow(), FRY(), 0, 1);
		expect(internals.chunkSamples).toBe(0);
		await startAndSettle(s, run());
		expect(internals.chunkSamples).toBe(0);
	});

	it('a gate timeout inside a visit keeps the microphone: the next take does not call getUserMedia again', async () => {
		const s = new LiveCaptureSession();
		s.openVisit();
		const missed = run();
		await startAndSettle(s, missed);
		await feed(ctxNow(), null, 0, 10.5);
		expect(missed.errors.map((e) => e.code)).toEqual(['EXTRACTION_FAILED']);
		expect(tracks[0].readyState).toBe('live');
		await take(s, run());
		expect(getUserMedia).toHaveBeenCalledTimes(1);
	});

	it('Stop (cancel) mid-take inside a visit keeps the tracks live, and CANCELLED is reported once', async () => {
		const s = new LiveCaptureSession();
		s.openVisit();
		const r = run();
		await startAndSettle(s, r);
		await feed(ctxNow(), FRY(), 0, 0.5);
		s.cancel();
		expect(r.errors.map((e) => e.code)).toEqual(['CANCELLED']);
		expect(tracks[0].readyState).toBe('live');
		expect(ctxNow().state).toBe('running');
	});

	it('closeVisit between takes releases the tracks and the context, and a take after it acquires again', async () => {
		const s = new LiveCaptureSession();
		s.openVisit();
		await take(s, run());
		s.closeVisit();
		expect(tracks[0].readyState).toBe('ended');
		expect(FakeCtx.all[0].state).toBe('closed');
		s.openVisit();
		await take(s, run());
		expect(getUserMedia).toHaveBeenCalledTimes(2);
		expect(FakeCtx.all).toHaveLength(2);
	});

	it('closeVisit during a take ends it silently and stops the tracks', async () => {
		const s = new LiveCaptureSession();
		s.openVisit();
		const r = run();
		await startAndSettle(s, r);
		await feed(ctxNow(), FRY(), 0, 0.5);
		s.closeVisit();
		expect(r.events).toEqual([]);
		expect(tracks[0].readyState).toBe('ended');
	});

	it('a microphone failure releases the microphone even inside a visit', async () => {
		const s = new LiveCaptureSession();
		s.openVisit();
		getUserMedia.mockRejectedValueOnce(Object.assign(new Error('no'), { name: 'NotReadableError' }));
		const r = run();
		await startAndSettle(s, r);
		expect(r.errors.map((e) => e.code)).toEqual(['NO_AUDIO_INPUT']);
		await take(s, run());
		expect(getUserMedia).toHaveBeenCalledTimes(2);
	});

	it('a held track that has ended is let go, and the next take acquires again', async () => {
		const s = new LiveCaptureSession();
		s.openVisit();
		await take(s, run());
		tracks[0].readyState = 'ended';
		await take(s, run());
		expect(getUserMedia).toHaveBeenCalledTimes(2);
	});

	it('openVisit resumes a context the system suspended, and is idempotent', async () => {
		const s = new LiveCaptureSession();
		s.openVisit();
		await take(s, run());
		ctxNow().state = 'suspended';
		s.openVisit();
		s.openVisit();
		expect(ctxNow().state).toBe('running');
		expect(ctxNow().resumes).toBeGreaterThanOrEqual(1);
	});

	it('a cancel while resume() is pending leaves no half-built graph: the next take in the visit reaches stable fry', async () => {
		const s = new LiveCaptureSession();
		s.openVisit();
		FakeCtx.startSuspended = true;
		FakeCtx.holdResume = true;
		const first = run();
		s.start('i', 'bass', first.handlers);
		await vi.advanceTimersByTimeAsync(10); // getUserMedia is in, the context is made, resume() is pending
		expect(FakeCtx.releaseResume).not.toBeNull();
		s.cancel();
		FakeCtx.releaseResume!(); // the superseded acquire returns, with no source connected
		await vi.advanceTimersByTimeAsync(10);
		expect(first.errors.map((e) => e.code)).toEqual(['CANCELLED']);
		FakeCtx.startSuspended = false;
		FakeCtx.holdResume = false;
		const second = run();
		await take(s, second);
		expect(second.events[0]).toBe('fry');
	});

	it('openVisit acquires nothing', () => {
		new LiveCaptureSession().openVisit();
		expect(getUserMedia).not.toHaveBeenCalled();
	});
});

describe('outside a visit, every run behaves as it always did', () => {
	it('a take acquires and releases its own microphone', async () => {
		const s = new LiveCaptureSession();
		await take(s, run());
		expect(tracks[0].readyState).toBe('ended');
		expect(FakeCtx.all[0].state).toBe('closed');
		await take(s, run());
		expect(getUserMedia).toHaveBeenCalledTimes(2);
	});

	it('a cancel releases the tracks', async () => {
		const s = new LiveCaptureSession();
		const r = run();
		await startAndSettle(s, r);
		s.cancel();
		expect(tracks[0].readyState).toBe('ended');
	});
});

describe('the visit helper over the live session (Back and return)', () => {
	it('Back, return, then two takes call getUserMedia exactly once more', async () => {
		const s = new LiveCaptureSession();
		const state = { wanted: true };
		const visit = createVisit({ session: s, endTake: () => s.cancel(), closeTicks: () => {}, wanted: () => state.wanted, pageVisible: () => true });
		visit.sync();
		await take(s, run());
		expect(getUserMedia).toHaveBeenCalledTimes(1);
		state.wanted = false;
		visit.sync(); // Back
		state.wanted = true;
		visit.sync(); // return
		await take(s, run());
		await take(s, run());
		expect(getUserMedia).toHaveBeenCalledTimes(2);
		visit.destroy();
	});

	it('Back during a take ends it, keeps nothing, and stops the tracks', async () => {
		const s = new LiveCaptureSession();
		const state = { wanted: true };
		const visit = createVisit({ session: s, endTake: () => s.cancel(), closeTicks: () => {}, wanted: () => state.wanted, pageVisible: () => true });
		visit.sync();
		const r = run();
		await startAndSettle(s, r);
		await feed(ctxNow(), FRY(), 0, 0.5);
		state.wanted = false;
		visit.sync();
		expect(r.events).toEqual(['error:CANCELLED']);
		expect(tracks[0].readyState).toBe('ended');
		visit.destroy();
	});
});
