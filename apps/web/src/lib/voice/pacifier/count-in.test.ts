/**
 * Row 2d part 3: sing the vowel first, pause, then fry. The intervals asserted
 * are the brief's numbers, quoted here rather than imported, so a silent change
 * to `count-in.ts` fails a test: 1000 ms a beat and a 2000 ms pause (both DESK
 * DEFAULT, 2026-09-30).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { runCountIn, tapAction, type CountInStep } from './count-in';

const BEAT = 1000, PAUSE = 2000;

/** The Pacifier's own timer shape: every timer in one list, cleared together. */
function harness() {
	let timers: ReturnType<typeof setTimeout>[] = [];
	const after = (ms: number, fn: () => void) => { timers.push(setTimeout(fn, ms)); };
	const clear = () => { for (const t of timers) clearTimeout(t); timers = []; };
	const seen: { step: CountInStep; at: number }[] = [];
	const t0 = Date.now();
	const sessionStart = vi.fn();
	const begin = () => runCountIn((step) => {
		seen.push({ step, at: Date.now() - t0 });
		if (step === 'fry') sessionStart();
	}, after);
	return { begin, clear, seen, sessionStart };
}

afterEach(() => { vi.useRealTimers(); });

describe('one tap begins the count-in', () => {
	it('begins from every resting state, including the wizard’s pointer and a skipped vowel', () => {
		for (const s of ['dormant', 'estimated', 'armed', 'captured', 'provisional', 'deselected']) expect(tapAction(s)).toBe('begin');
	});

	it('answers the tap at once with the sung cue', () => {
		vi.useFakeTimers();
		const h = harness();
		h.begin();
		expect(h.seen).toEqual([{ step: 'sing', at: 0 }]);
	});
});

describe('the beats and the pause fire in order at the stated intervals', () => {
	it('sings on three beats a second apart, pauses two seconds, then begins the fry', () => {
		vi.useFakeTimers();
		const h = harness();
		h.begin();
		vi.advanceTimersByTime(3 * BEAT + PAUSE);
		expect(h.seen).toEqual([
			{ step: 'sing', at: 0 },
			{ step: 'two', at: BEAT },
			{ step: 'one', at: 2 * BEAT },
			{ step: 'pause', at: 3 * BEAT },
			{ step: 'fry', at: 3 * BEAT + PAUSE }
		]);
	});
});

describe('no capture session starts before the fry step', () => {
	it('has not started a session one millisecond before the fry', () => {
		vi.useFakeTimers();
		const h = harness();
		h.begin();
		vi.advanceTimersByTime(3 * BEAT + PAUSE - 1);
		expect(h.sessionStart).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(h.sessionStart).toHaveBeenCalledTimes(1);
	});
});

describe('a tap during the count or the pause cancels', () => {
	it('maps a tap in the sung count and in the pause to cancel, and a tap in the fry to nothing', () => {
		expect(tapAction('preparing')).toBe('cancel');
		expect(tapAction('pausing')).toBe('cancel');
		expect(tapAction('listening')).toBe('ignore');
		expect(tapAction('working')).toBe('ignore');
	});

	it.each([
		['the sung count', 1.5 * BEAT],
		['the pause', 3 * BEAT + PAUSE / 2]
	])('starts no session after a cancel in %s', (_where, ms) => {
		vi.useFakeTimers();
		const h = harness();
		h.begin();
		vi.advanceTimersByTime(ms);
		h.clear(); // what the Pacifier's cancelCapture does to its timers
		vi.advanceTimersByTime(10 * BEAT);
		expect(h.sessionStart).not.toHaveBeenCalled();
		expect(h.seen.every((s) => s.at <= ms)).toBe(true);
	});
});
