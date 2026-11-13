/**
 * N.199 Step 3: the capture ritual's transition table. A fake session, fake timers; nothing mounts. The intervals are quoted
 * here, not imported (1000 ms a beat, 2000 ms pause, 3000 ms sweep, 900 ms landing), so a silent change to the module or to
 * `count-in.ts` fails a test.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCaptureRitual, errorCueKey, type CaptureRitual } from './capture-ritual.svelte';
import type { CaptureSession, CaptureHandlers, ReadinessHandlers } from './engine/session';
import type { CaptureError } from './engine/errors';
import type { CalibratedFormant, Vowel } from './engine/types';

const BEAT = 1000, PAUSE = 2000, SWEEP = 3000, LANDING = 900;
const FRY_AT = 3 * BEAT + PAUSE; // 5000: the session starts here

const formant = (reading: CalibratedFormant['reading'] = 'captured', f1 = 296): CalibratedFormant =>
	({ f1, f2: 1705, confidence: reading === 'provisional' ? 'low' : 'high', f2Quality: 'clear', reading, source: 'measured-user' }) as CalibratedFormant;

class FakeSession implements CaptureSession {
	starts: Array<{ vowel: Vowel; voiceType: string | undefined; handlers: CaptureHandlers }> = [];
	cancels = 0;
	start(vowel: Vowel, voiceType: string | undefined, handlers: CaptureHandlers) {
		this.starts.push({ vowel, voiceType, handlers });
	}
	startReadiness(_h: ReadinessHandlers) {}
	cancel() {
		this.cancels++;
	}
	get last() {
		return this.starts[this.starts.length - 1].handlers;
	}
}

interface Rig {
	ritual: CaptureRitual;
	session: FakeSession;
	captured: Array<[Vowel, CalibratedFormant]>;
	rolledBack: Array<[Vowel, CalibratedFormant]>;
	failed: Array<[Vowel, CaptureError]>;
	previous: Partial<Record<Vowel, CalibratedFormant>>;
	reduced: { on: boolean };
}
function rig(opts: { ticks?: boolean; voiceType?: string } = {}): Rig {
	const session = new FakeSession();
	const captured: Rig['captured'] = [];
	const rolledBack: Rig['rolledBack'] = [];
	const failed: Rig['failed'] = [];
	const previous: Rig['previous'] = {};
	const reduced = { on: false };
	const ritual = createCaptureRitual({
		session,
		voiceType: () => opts.voiceType ?? 'bass',
		previous: (v) => previous[v],
		reducedMotion: () => reduced.on,
		ticks: opts.ticks ?? false,
		onCaptured: (v, f) => captured.push([v, f]),
		onRolledBack: (v, f) => rolledBack.push([v, f]),
		onFailed: (v, e) => failed.push([v, e])
	});
	return { ritual, session, captured, rolledBack, failed, previous, reduced };
}
/** Runs a take to the sweep: begin, count in, fry, stable fry. */
function toSweep(r: Rig, v: Vowel = 'i') {
	r.ritual.begin(v);
	vi.advanceTimersByTime(FRY_AT);
	r.session.last.onStableFry();
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

describe('the count-in and the fry', () => {
	it('starts idle, with nothing to cancel', () => {
		const r = rig();
		expect([r.ritual.phase, r.ritual.vowel, r.ritual.progress, r.ritual.cancellable]).toEqual(['idle', null, 0, false]);
		expect(r.ritual.cancel()).toBe(false);
	});

	it('answers the tap at once with the sung cue, and walks the beats, the pause, and the fry at the stated intervals', () => {
		const r = rig();
		expect(r.ritual.begin('e')).toBe(true);
		expect([r.ritual.phase, r.ritual.vowel, r.ritual.cue]).toEqual(['sing', 'e', { key: 'pacifier.singFirst', vowel: 'e' }]);
		vi.advanceTimersByTime(BEAT - 1);
		expect(r.ritual.cue.key).toBe('pacifier.singFirst');
		vi.advanceTimersByTime(1);
		expect([r.ritual.phase, r.ritual.cue.key]).toEqual(['sing', 'calib.readiness.countTwo']);
		vi.advanceTimersByTime(BEAT);
		expect([r.ritual.phase, r.ritual.cue.key]).toEqual(['sing', 'calib.readiness.countOne']);
		vi.advanceTimersByTime(BEAT);
		expect([r.ritual.phase, r.ritual.cue]).toEqual(['pause', { key: 'pacifier.pause', vowel: 'e' }]);
		vi.advanceTimersByTime(PAUSE - 1);
		expect(r.session.starts).toHaveLength(0); // nothing is captured before the fry step
		vi.advanceTimersByTime(1);
		expect([r.ritual.phase, r.ritual.cue]).toEqual(['listening', { key: 'pacifier.beginPhonating', vowel: 'e' }]);
		expect(r.session.starts).toHaveLength(1);
		expect(r.session.starts[0].vowel).toBe('e');
	});

	it('reads the voice type when the session starts, not before', () => {
		const r = rig({ voiceType: 'soprano' });
		r.ritual.begin('i');
		vi.advanceTimersByTime(FRY_AT);
		expect(r.session.starts[0].voiceType).toBe('soprano');
	});

	it('ignores a tap on any vowel, the same or another, while a take is in progress', () => {
		const r = rig();
		r.ritual.begin('i');
		expect(r.ritual.begin('e')).toBe(false);
		expect(r.ritual.begin('i')).toBe(false);
		expect(r.ritual.vowel).toBe('i');
		vi.advanceTimersByTime(FRY_AT);
		expect(r.ritual.begin('u')).toBe(false);
		r.session.last.onStableFry();
		expect(r.ritual.begin('u')).toBe(false);
		expect(r.session.starts).toHaveLength(1);
	});
});

describe('the sweep and the reading', () => {
	it('starts the bar at stable fry, not before, and fills it over 3.0 s', () => {
		const r = rig();
		r.ritual.begin('i');
		vi.advanceTimersByTime(FRY_AT + 4000); // a long wait for stable fry
		expect(r.ritual.progress).toBe(0);
		expect(r.ritual.phase).toBe('listening');
		r.session.last.onStableFry();
		expect([r.ritual.phase, r.ritual.cue.key, r.ritual.progress]).toEqual(['sweep', 'pacifier.nowSustain', 0]);
		vi.advanceTimersByTime(1500);
		expect(r.ritual.progress).toBeCloseTo(0.5, 1);
		vi.advanceTimersByTime(1500);
		expect(r.ritual.progress).toBe(1);
	});

	it('delivers the reading when the clock and the result are both in, result first', () => {
		const r = rig();
		toSweep(r);
		vi.advanceTimersByTime(1000);
		r.session.last.onComplete(formant());
		expect(r.captured).toHaveLength(0); // the clock has not run out
		expect(r.ritual.phase).toBe('sweep');
		vi.advanceTimersByTime(SWEEP - 1000);
		expect(r.captured).toEqual([['i', formant()]]);
		expect([r.ritual.phase, r.ritual.vowel, r.ritual.cue]).toEqual(['landing', 'i', { key: 'pacifier.captured', vowel: 'i' }]);
	});

	it('delivers when the clock is out and the result arrives late, the bar holding full', () => {
		const r = rig();
		toSweep(r);
		vi.advanceTimersByTime(SWEEP + 2000);
		expect([r.ritual.phase, r.ritual.progress, r.captured.length]).toEqual(['sweep', 1, 0]);
		r.session.last.onComplete(formant());
		expect([r.ritual.phase, r.captured.length]).toEqual(['landing', 1]);
	});

	it('lands for 900 ms, then is idle and ready for the next take', () => {
		const r = rig();
		toSweep(r);
		vi.advanceTimersByTime(SWEEP);
		r.session.last.onComplete(formant());
		vi.advanceTimersByTime(LANDING - 1);
		expect(r.ritual.phase).toBe('landing');
		expect(r.ritual.begin('e')).toBe(false); // the landing is not a time to start another
		vi.advanceTimersByTime(1);
		expect([r.ritual.phase, r.ritual.vowel, r.ritual.progress]).toEqual(['idle', null, 0]);
		expect(r.ritual.begin('e')).toBe(true);
	});

	it('under reduced motion lands at once, and the bar still advances, in coarser steps', () => {
		const r = rig();
		r.reduced.on = true;
		toSweep(r);
		const seen = new Set<number>();
		for (let k = 0; k < 24; k++) {
			vi.advanceTimersByTime(50);
			seen.add(r.ritual.progress);
		}
		// 1200 ms in: it has moved, and in no more than six distinct values (250 ms steps), where 50 ms steps give about 24.
		expect(r.ritual.progress).toBeGreaterThan(0.3);
		expect(seen.size).toBeLessThanOrEqual(7);
		expect(seen.size).toBeGreaterThan(2);
		vi.advanceTimersByTime(SWEEP);
		r.session.last.onComplete(formant());
		expect([r.ritual.phase, r.captured.length]).toEqual(['idle', 1]);
	});
});

describe('the re-take rule, against the guarded reading', () => {
	it('keeps a Captured reading when the re-take is Provisional, and reports the rejected one', () => {
		const r = rig();
		r.previous.i = formant('captured', 296);
		toSweep(r);
		vi.advanceTimersByTime(SWEEP);
		const worse = formant('provisional', 310);
		r.session.last.onComplete(worse);
		expect(r.rolledBack).toEqual([['i', worse]]);
		expect(r.captured).toHaveLength(0);
		expect(r.ritual.cue).toEqual({ key: 'pacifier.rolledBack', vowel: 'i' });
	});

	it('takes a Provisional reading when there was none, when the previous was Provisional (the guard demoted it), or only an estimate', () => {
		for (const previous of [undefined, formant('provisional'), formant('estimated')]) {
			const r = rig();
			if (previous) r.previous.i = previous;
			toSweep(r);
			vi.advanceTimersByTime(SWEEP);
			r.session.last.onComplete(formant('provisional'));
			expect(r.captured).toHaveLength(1);
			expect(r.rolledBack).toHaveLength(0);
			expect(r.ritual.cue).toEqual({ key: 'capture.uncertain', vowel: 'i' });
		}
	});

	it('a Captured re-take over a Captured reading is simply captured', () => {
		const r = rig();
		r.previous.i = formant('captured', 296);
		toSweep(r);
		vi.advanceTimersByTime(SWEEP);
		r.session.last.onComplete(formant('captured', 300));
		expect(r.captured).toHaveLength(1);
		expect(r.rolledBack).toHaveLength(0);
	});
});

describe('cancel', () => {
	const CANCEL_AT: Array<[string, number, boolean]> = [
		// [where, ms from the tap, whether the session has started]
		['the first sung beat', 500, false],
		['the third sung beat', 2500, false],
		['the pause', 4000, false],
		['the wait for stable fry', FRY_AT + 1500, true]
	];
	it.each(CANCEL_AT)('ends the take in %s, once, and nothing it set going fires afterwards', (_where, ms, started) => {
		const r = rig();
		r.ritual.begin('o');
		vi.advanceTimersByTime(ms);
		expect(r.ritual.cancellable).toBe(true);
		expect(r.ritual.cancel()).toBe(true);
		expect(r.failed).toEqual([['o', { code: 'CANCELLED', message: expect.any(String) }]]);
		expect([r.ritual.phase, r.ritual.vowel, r.ritual.progress, r.ritual.cue]).toEqual(['idle', null, 0, { key: 'pacifier.cancelled', vowel: 'o' }]);
		expect(r.session.cancels).toBe(started ? 1 : 0);
		const startsThen = r.session.starts.length;
		vi.advanceTimersByTime(30_000);
		expect(r.session.starts).toHaveLength(startsThen);
		expect(r.captured).toHaveLength(0);
		expect(r.failed).toHaveLength(1);
		expect(r.ritual.cancel()).toBe(false);
	});

	it('ends the take in the sweep, and a result that arrives afterwards is dropped', () => {
		const r = rig();
		toSweep(r, 'u');
		vi.advanceTimersByTime(1000);
		expect(r.ritual.cancel()).toBe(true);
		expect(r.session.cancels).toBe(1);
		r.session.last.onComplete(formant()); // the session had already delivered
		vi.advanceTimersByTime(SWEEP);
		expect(r.captured).toHaveLength(0);
		expect(r.failed).toHaveLength(1);
		expect(r.ritual.phase).toBe('idle');
	});

	it('ends the take in the sweep after the clock is out and before the result', () => {
		const r = rig();
		toSweep(r);
		vi.advanceTimersByTime(SWEEP + 500);
		expect(r.ritual.cancel()).toBe(true);
		expect(r.captured).toHaveLength(0);
	});

	it('cannot end a take once its reading is delivered: nothing is saved from a cancelled take, and this one is saved', () => {
		const r = rig();
		toSweep(r);
		vi.advanceTimersByTime(SWEEP);
		r.session.last.onComplete(formant());
		expect(r.ritual.cancellable).toBe(false);
		expect(r.ritual.cancel()).toBe(false);
		expect(r.captured).toHaveLength(1);
		expect(r.failed).toHaveLength(0);
		expect(r.session.cancels).toBe(0);
	});

	it('drops the session’s own CANCELLED after a cancel, so it is reported once', () => {
		const r = rig();
		r.ritual.begin('i');
		vi.advanceTimersByTime(FRY_AT);
		const handlers = r.session.last;
		r.ritual.cancel();
		handlers.onError({ code: 'CANCELLED', message: 'late' });
		expect(r.failed).toHaveLength(1);
	});
});

describe('each take has an id: a late callback from an earlier take is dropped', () => {
	it('a late CANCELLED, a late result, and a late stable fry from take 1 do nothing to take 2', () => {
		const r = rig();
		r.ritual.begin('i');
		vi.advanceTimersByTime(FRY_AT);
		const first = r.session.last;
		r.ritual.cancel();
		r.ritual.begin('e');
		vi.advanceTimersByTime(FRY_AT);
		expect(r.session.starts).toHaveLength(2);
		first.onError({ code: 'CANCELLED', message: 'late' });
		first.onStableFry();
		first.onComplete(formant());
		expect(r.ritual.phase).toBe('listening'); // take 2 is undisturbed
		expect(r.ritual.vowel).toBe('e');
		expect(r.captured).toHaveLength(0);
		expect(r.failed).toHaveLength(1); // only take 1's own cancel
		r.session.last.onStableFry();
		vi.advanceTimersByTime(SWEEP);
		r.session.last.onComplete(formant('captured', 381));
		expect(r.captured).toEqual([['e', formant('captured', 381)]]);
	});
});

describe('errors', () => {
	const CODES: Array<[CaptureError, string]> = [
		[{ code: 'MIC_PERMISSION_DENIED', message: 'm' }, 'pacifier.error.micPermission'],
		[{ code: 'MIC_NOT_FOUND', message: 'm' }, 'pacifier.error.micNotFound'],
		[{ code: 'NO_AUDIO_INPUT', message: 'm' }, 'pacifier.error.noAudio'],
		[{ code: 'SAMPLE_TOO_SHORT', message: 'm', actualMs: 900, minimumMs: 2000 }, 'pacifier.error.tooShort'],
		[{ code: 'EXTRACTION_FAILED', message: 'm' }, 'pacifier.error.default'],
		[{ code: 'CANCELLED', message: 'by the session' }, 'pacifier.cancelled']
	];
	it.each(CODES)('%j in the wait for stable fry: the take ends, the cue is the code’s own, onFailed fires once', (error, key) => {
		const r = rig();
		r.ritual.begin('a');
		vi.advanceTimersByTime(FRY_AT);
		r.session.last.onError(error);
		expect([r.ritual.phase, r.ritual.vowel, r.ritual.cue]).toEqual(['idle', null, { key, vowel: 'a' }]);
		expect(r.failed).toEqual([['a', error]]);
		expect(r.captured).toHaveLength(0);
		vi.advanceTimersByTime(30_000);
		expect(r.failed).toHaveLength(1);
		expect(r.ritual.begin('a')).toBe(true); // a way back in
	});
	it.each(CODES)('%j in the sweep ends it too, and the clock does not deliver afterwards', (error) => {
		const r = rig();
		toSweep(r, 'a');
		vi.advanceTimersByTime(1000);
		r.session.last.onError(error);
		expect(r.ritual.phase).toBe('idle');
		vi.advanceTimersByTime(SWEEP * 2);
		expect(r.captured).toHaveLength(0);
		expect(r.failed).toHaveLength(1);
	});
	it('names a key for any code', () => {
		expect(errorCueKey('SOMETHING_NEW')).toBe('pacifier.error.default');
	});
});

describe('the audio tick', () => {
	function fakeAudio() {
		const log = { oscillators: 0, closed: 0, constructed: 0 };
		class FakeAudioContext {
			currentTime = 0;
			destination = {};
			constructor() {
				log.constructed++;
			}
			createOscillator() {
				log.oscillators++;
				const node = { type: '', frequency: { value: 0 }, connect: (n: unknown) => n, start() {}, stop() {} };
				return node;
			}
			createGain() {
				return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect: (n: unknown) => n };
			}
			close() {
				log.closed++;
				return Promise.resolve();
			}
		}
		vi.stubGlobal('AudioContext', FakeAudioContext);
		return log;
	}
	it('ticks on the three sung beats and not on the pause, and closes the context on destroy', () => {
		const log = fakeAudio();
		const r = rig({ ticks: true });
		r.ritual.begin('i');
		vi.advanceTimersByTime(3 * BEAT + PAUSE);
		expect(log.oscillators).toBe(3);
		expect(log.constructed).toBe(1);
		r.ritual.destroy();
		expect(log.closed).toBe(1);
	});
	it('makes no sound with ticks off', () => {
		const log = fakeAudio();
		const r = rig({ ticks: false });
		r.ritual.begin('i');
		vi.advanceTimersByTime(FRY_AT);
		expect(log.oscillators).toBe(0);
	});
	it('a context that throws never blocks the count', () => {
		vi.stubGlobal('AudioContext', class { constructor() { throw new Error('no audio'); } });
		const r = rig({ ticks: true });
		r.ritual.begin('i');
		vi.advanceTimersByTime(FRY_AT);
		expect(r.ritual.phase).toBe('listening');
	});
});

describe('destroy', () => {
	it('stops a take in the count without telling the session or anyone, and refuses a new take', () => {
		const r = rig();
		r.ritual.begin('i');
		vi.advanceTimersByTime(1500);
		r.ritual.destroy();
		vi.advanceTimersByTime(30_000);
		expect(r.session.starts).toHaveLength(0);
		expect(r.session.cancels).toBe(0);
		expect(r.failed).toHaveLength(0);
		expect(r.ritual.begin('i')).toBe(false);
	});
	it('tears down the session of a take in the sweep, fires no event, and is safe twice', () => {
		const r = rig();
		toSweep(r);
		r.ritual.destroy();
		r.ritual.destroy();
		expect(r.session.cancels).toBe(1);
		vi.advanceTimersByTime(SWEEP * 2);
		r.session.last.onComplete(formant());
		expect([r.captured.length, r.rolledBack.length, r.failed.length]).toEqual([0, 0, 0]);
	});
});
