/**
 * The time-signature reader's decoding (`metre-reader.ts`), on hand-built
 * probabilities and a hand-built band. The network itself is not run here;
 * run 2 of round 6 measured the port against the Python reader window by
 * window (`docs/sessions/report-code-the-metre-seen-and-summed_r6-run2_2026-10-11.md`).
 */
import { describe, expect, it } from 'vitest';
import {
	candidates,
	CLASSES,
	cut,
	CROP,
	cutRatio,
	decide,
	lengthOf,
	margin,
	NOTHING,
	READINGS,
	rivals,
	state,
	toHalf,
	uncovered,
	uncoveredVoid,
	type Band,
	type MetreSettings,
	type Reading,
} from './metre-reader';

/** A reading of `n` places where nothing stands, then `set(i, seat, cls, p)` puts a mark. */
function blank(n: number): Reading & { set: (i: number, seat: number, cls: number, p: number) => void } {
	const probs = new Float32Array(n * 3 * CLASSES);
	for (let i = 0; i < n * 3; i++) probs[i * CLASSES + NOTHING] = 1;
	const r = {
		xs: Array.from({ length: n }, (_, i) => i * 0.2),
		probs,
		feats: new Map<string, Float32Array>(),
		set(i: number, seat: number, cls: number, p: number) {
			const o = (i * 3 + seat) * CLASSES;
			probs[o + NOTHING] = 1 - p;
			probs[o + cls] = p;
		},
	};
	return r;
}

/** A 3/4: a 3 in the upper seat and a 4 in the lower, at places 10 and 11 (two fifths of a space apart). */
function threeFour(p = 0.95): Reading {
	const r = blank(40);
	for (const [i, q] of [[9, 0.5], [10, p], [11, 0.5]] as const) r.set(i, 0, 3, q);
	for (const [i, q] of [[9, 0.5], [10, p], [11, 0.5]] as const) r.set(i, 2, 4, q);
	return r;
}

const SETTINGS: MetreSettings = { cut: 0.5, centre: 0.4, dist: Infinity, tau: 0.6, cLow: 0.1, cutHigh: 0, margin: 0.8 };
const white = (w: number, h: number): Band => ({ width: w, height: h, data: new Uint8Array(w * h).fill(255) });

describe('toHalf', () => {
	it('rounds as float16 stores a value, halves to even', () => {
		expect(toHalf(1)).toBe(1);
		expect(toHalf(0.1)).toBeCloseTo(0.0999755859375, 12);
		expect(toHalf(1 + 2 ** -11)).toBe(1);
		expect(toHalf(1 + 3 * 2 ** -11)).toBe(1 + 2 ** -9);
	});
});

describe('cut', () => {
	it('reads the band at cx + (i - 16) / s, ink 1 for black, 0 beyond the band', () => {
		const band = white(64, 64);
		band.data[20 * 64 + 30] = 0;
		const c = cut(band, [30], [20], 1);
		expect(c.length).toBe(CROP * CROP);
		expect(c[16 * CROP + 16]).toBeCloseTo(1, 6);
		expect(c[16 * CROP + 15]).toBe(0);
		const edge = cut(band, [0], [0], 1);
		expect(edge[0]).toBe(0);
	});
});

describe('candidates and state', () => {
	it('reads a figure from the upper and lower seats, and states it above the cut', () => {
		const cs = candidates(threeFour());
		expect(cs.map((c) => c.lab)).toEqual(['3/4']);
		expect(state(cs, 0.5, 0.4)?.lab).toBe('3/4');
		expect(state(cs, 0.97, 0.4)).toBeNull();
	});

	it('states nothing for a lower figure outside 1, 2, 4, 8, 16, 32', () => {
		const r = blank(40);
		r.set(10, 0, 3, 0.95);
		r.set(10, 2, 5, 0.95);
		expect(candidates(r).map((c) => c.lab)).toEqual(['?']);
	});

	it('reads C on the middle line where no figure stands near', () => {
		const r = blank(40);
		r.set(10, 1, 10, 0.9);
		expect(candidates(r).map((c) => c.lab)).toEqual(['C']);
	});
});

describe('the same-length guard', () => {
	it('names rivals of the same length and the same marks', () => {
		expect(rivals('3/4')).toEqual(['6/8']);
		expect(rivals('2/4')).toEqual(['1/2', '4/8']);
		expect(rivals('4/4')).toEqual(['1/1', '2/2', '8/8']);
		expect(rivals('C')).toEqual(['cut']);
		expect(rivals('3/8')).toEqual([]);
		expect(lengthOf('cut')).toBe(4);
		expect(lengthOf('6/8')).toBe(3);
	});

	it('measures the stated class against its rival at each mark that differs', () => {
		const r = threeFour();
		const p = (i: number, seat: number) => (i * 3 + seat) * CLASSES;
		r.probs[p(10, 0) + 6] = 0.04;
		r.probs[p(10, 2) + 8] = 0.2;
		const g = state(candidates(r), 0.5, 0.4)!;
		expect(margin([r], [g], '3/4')).toBeCloseTo(0.75, 6);
	});
});

describe('decide', () => {
	const nine = (r: Reading) => READINGS.map(() => r);

	it('states a signature all nine readings state, with the checks passed and the margin met', () => {
		const lines = () => [20, 30, 40, 50, 60];
		expect(decide(nine(threeFour()), white(100, 80), lines, SETTINGS, null)).toEqual({ lab: '3/4' });
	});

	it('states nothing when the rival comes too near', () => {
		const r = threeFour();
		r.probs[(10 * 3) * CLASSES + 6] = 0.3;
		const v = decide(nine(r), white(100, 80), () => [20, 30, 40, 50, 60], SETTINGS, null);
		expect(v.lab).toBeNull();
	});

	it('states nothing when one reading disagrees', () => {
		const readings = nine(threeFour());
		readings[0] = blank(40);
		expect(decide(readings, white(100, 80), () => [20, 30, 40, 50, 60], SETTINGS, null).lab).toBeNull();
	});
});

describe('the checks', () => {
	it('finds no uncovered ink on a white band, and voids a heavy run on one side only', () => {
		const lines = () => [20, 30, 40, 50, 60];
		const marks = state(candidates(threeFour()), 0.5, 0.4)!.marks;
		expect(uncovered(white(100, 80), lines, threeFour().xs, marks)).toBeNull();
		expect(uncoveredVoid([[0.9, 0], [0, 0]], 0.6)).toBe(true);
		expect(uncoveredVoid([[0.9, 0.9], [0, 0]], 0.6)).toBe(false);
	});

	it('C against cut C: ink through the middle above and below the staff', () => {
		const band = white(40, 80);
		const lines = () => [20, 30, 40, 50, 60];
		const mark: [number, number, number, number, number] = [1, 10, 10, 0.9, 10];
		expect(cutRatio(band, lines, Array.from({ length: 40 }, (_, i) => i * 0.2), mark)).toBe(0);
		for (let y = 10; y < 70; y++) for (let x = 19; x < 23; x++) band.data[y * 40 + x] = 0;
		expect(cutRatio(band, lines, Array.from({ length: 40 }, (_, i) => i * 0.2), mark)).toBeGreaterThan(0.5);
	});
});
