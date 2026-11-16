/**
 * N.203 lane 59 Step 3: the first eight seconds of a take. The intervals are quoted here, not imported, so a silent change to `count-in.ts` fails a
 * test: Breathe 2 s, Sing 4 s with a tick at the start of each of its seconds, Shape 2 s, then the fry (Dann 2026-11-15 18:54: DESK DEFAULT 2, 4, 2, 4 s).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { runCountIn, type CountInStep } from './count-in';

/** The ritual's own timer shape: every timer in one list, cleared together. */
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

describe('Start answers the tap at once', () => {
	it('with Breathe', () => {
		vi.useFakeTimers();
		const h = harness();
		h.begin();
		expect(h.seen).toEqual([{ step: 'breathe', at: 0 }]);
	});
});

describe('Breathe, Sing, Shape, and the fry fire in order at the stated intervals', () => {
	it('breathes 2 s, sings 4 s with four ticks, holds the shape 2 s, then begins the fry', () => {
		vi.useFakeTimers();
		const h = harness();
		h.begin();
		vi.advanceTimersByTime(8000);
		expect(h.seen).toEqual([
			{ step: 'breathe', at: 0 },
			{ step: 'sing', at: 2000 },
			{ step: 'tick', at: 2000 },
			{ step: 'tick', at: 3000 },
			{ step: 'tick', at: 4000 },
			{ step: 'tick', at: 5000 },
			{ step: 'shape', at: 6000 },
			{ step: 'fry', at: 8000 }
		]);
	});

	it('sounds no tick outside Sing', () => {
		vi.useFakeTimers();
		const h = harness();
		h.begin();
		vi.advanceTimersByTime(20_000);
		const ticks = h.seen.filter((s) => s.step === 'tick').map((s) => s.at);
		expect(ticks).toEqual([2000, 3000, 4000, 5000]);
	});
});

describe('no capture session starts before the fry step', () => {
	it('has not started a session one millisecond before the fry', () => {
		vi.useFakeTimers();
		const h = harness();
		h.begin();
		vi.advanceTimersByTime(7999);
		expect(h.sessionStart).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(h.sessionStart).toHaveBeenCalledTimes(1);
	});
});

describe('a cancel in Breathe, Sing, or Shape', () => {
	it.each([
		['Breathe', 1000],
		['Sing', 4000],
		['Shape', 7000]
	])('starts no session after a cancel in %s', (_where, ms) => {
		vi.useFakeTimers();
		const h = harness();
		h.begin();
		vi.advanceTimersByTime(ms);
		h.clear(); // what the ritual's cancel does to its timers
		vi.advanceTimersByTime(20_000);
		expect(h.sessionStart).not.toHaveBeenCalled();
		expect(h.seen.every((s) => s.at <= ms)).toBe(true);
	});
});
