/**
 * N.80: the capture pipeline judges the fry on its best window, not on all 3.5 s.
 *
 * The failure these tests pin is Dann's, 2026-08-23, three [u] takes on the
 * deployed build at `9d314de`. The live gate accepted at 30.3 to 37.8 dB SNR and
 * two takes still came back
 * `{"outcome":"reprompt","reason":"not-fry","failed":["c5_cv"]}`. Level was not the
 * cause. The live gate asks for one regular second; `runCapture` asked `detect()`
 * for a regular 3.5 s. A rounded [u] fry that holds for a second and a half fails
 * the whole-buffer inter-pulse-interval CV and never reaches the extractor.
 *
 * `guard()` already finds the longest passing stretch of at least MIN_STABLE_S
 * (`guard.ts:3`, 1.5 s) and returns it as `segmentS` (`guard.ts:91`). Nothing used
 * it for the fry check. Now `runCapture` shows the detector and the extractor that
 * stretch instead of the whole buffer.
 *
 * Dann's standing condition: no acceptance test may take its expected value from
 * the mechanism under test. So every number asserted below comes from the fixture,
 * which is built here and whose properties are arithmetic on its own pulse
 * schedule:
 *   - the interval CV above 1.0 is computed from the schedule, not read from
 *     `detect()`;
 *   - the 300 Hz that `f1` must land within 30 Hz of is the resonator this file
 *     puts in the signal, not a value the extractor reported;
 *   - 1.5 s is `MIN_STABLE_S`, quoted from `guard.ts:3`.
 *
 * Control run, performed while this file was written, with the pre-N.80
 * `analyze.ts` swapped back in and this same fixture:
 *   - two-phase buffer: `{"outcome":"reprompt","reason":"not-fry","failed":["c5_cv"]}`
 *   - steady 3.5 s control: `reading`, `confidence: "high"`, f1 298.892 Hz
 * The first line is the defect, reproduced. The second is the proof that the
 * change moves only the case it was written for.
 */

import { describe, it, expect } from 'vitest';
import { detect } from './detector';
import { guard } from './guard';
import { analyze, runCapture } from './analyze';

const SR = 48000;
/** `guard.ts:3`. Quoted, not imported, so a silent move there fails a test here. */
const MIN_STABLE_S = 1.5;
/** `guard.ts:4`, the four thresholds the guard tests a window against. Same rule. */
const T_FR1_CV = 0.08, T_FR2_CV = 0.12, T_ENVCORR = 0.92, T_RATE_CV = 0.25;
/** The two resonances the fixture puts in the signal. A dark bass [u]. */
const FR1 = 300, FR2 = 750, RESONATOR_BW = 80;

/** Deterministic uniform noise, xorshift32, fixed seed, so fixtures never drift. */
function rng(seed: number): () => number {
	let s = (seed || 1) >>> 0;
	return () => {
		s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
		return s / 0xffffffff;
	};
}

/**
 * The pulse schedule, in seconds between pulses. Only intervals that fit inside
 * `totalS` are returned, so the arithmetic done on this list describes the buffer
 * that gets built from it and not one pulse more.
 */
function steadyIntervals(untilS: number, seed: number): number[] {
	const r = rng(seed), out: number[] = [];
	let t = 0;
	// 40 Hz, which is the middle of the detector's 20 to 80 Hz band, with about
	// 5 percent jitter on each interval.
	while (t + 0.025 < untilS) { const iv = 0.025 * (1 + (r() * 2 - 1) * 0.05); out.push(iv); t += iv; }
	return out;
}

/** Alternating 9 ms and 200 ms. Irregular by construction; the CV is asserted, not assumed. */
function roughIntervals(fromS: number, untilS: number): number[] {
	const out: number[] = [];
	let t = fromS, k = 0;
	while (t + 0.2 < untilS) { const iv = k % 2 === 0 ? 0.009 : 0.2; out.push(iv); t += iv; k++; }
	return out;
}

/** A two-pole resonator per formant, summed. An impulse train shaped to [FR1, FR2]. */
function resonate(x: Float64Array, sr: number, freqs: number[], bw: number): Float64Array {
	const out = new Float64Array(x.length);
	for (const f of freqs) {
		const r = Math.exp((-Math.PI * bw) / sr);
		const c = 2 * r * Math.cos((2 * Math.PI * f) / sr), d = r * r;
		let y1 = 0, y2 = 0;
		for (let i = 0; i < x.length; i++) {
			const y = x[i] + c * y1 - d * y2;
			y2 = y1; y1 = y;
			out[i] += y * (1 - r);
		}
	}
	return out;
}

/** Lays `intervals` down as impulses from 10 ms in, filters, normalizes, adds a quiet bed. */
function buildBuffer(intervals: number[], totalS: number, seed: number): Float64Array {
	const n = Math.round(totalS * SR), src = new Float64Array(n);
	let t = 0.01;
	for (const iv of intervals) { const i = Math.round(t * SR); if (i < n) src[i] = 1; t += iv; }
	const shaped = resonate(src, SR, [FR1, FR2], RESONATOR_BW);
	let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(shaped[i]));
	const r = rng(seed), out = new Float64Array(n);
	for (let i = 0; i < n; i++) out[i] = (shaped[i] / peak) * 0.3 + (r() * 2 - 1) * 0.0005;
	return out;
}

function cv(a: number[]): number {
	const m = a.reduce((s, x) => s + x, 0) / a.length;
	const v = a.reduce((s, x) => s + (x - m) * (x - m), 0) / a.length;
	return Math.sqrt(v) / m;
}

/** 1.8 s of regular fry, then 1.7 s of irregular pulses. Dann's take, in synthesis. */
const STEADY_S = 1.8, TOTAL_S = 3.5;
const steady = steadyIntervals(STEADY_S, 0x11d);
const twoPhase = [...steady, ...roughIntervals(STEADY_S, TOTAL_S)];
const twoPhaseBuffer = buildBuffer(twoPhase, TOTAL_S, 0xbeef);
/** The positive control: the same fry, regular for the whole 3.5 s. */
const steadyThroughout = steadyIntervals(TOTAL_S, 0x11d);
const steadyBuffer = buildBuffer(steadyThroughout, TOTAL_S, 0xbeef);
/** The negative control: irregular from end to end, so no window passes at all. */
const roughBuffer = buildBuffer(roughIntervals(0, TOTAL_S), TOTAL_S, 0xbeef);
/**
 * One quantity moved and three held. The resonators are fixed for the whole
 * buffer, so the two formants and the band envelope are what they are in every
 * other fixture here; only the interval between pulses wanders, by up to 95
 * percent. This is the shape a fry that holds its vowel and loses its rhythm
 * makes, and it is the take the guard used to refuse without saying why.
 */
function rateWanderIntervals(untilS: number, seed: number): number[] {
	const r = rng(seed), out: number[] = [];
	let t = 0;
	while (t + 0.025 < untilS) { const iv = 0.025 * (1 + (r() * 2 - 1) * 0.95); out.push(iv); t += iv; }
	return out;
}
const rateWanderBuffer = buildBuffer(rateWanderIntervals(TOTAL_S, 0x9a1), TOTAL_S, 0xbeef);

describe('the fixture is what it claims to be, by arithmetic on its own schedule', () => {
	it('gives the whole buffer an inter-pulse-interval CV above the detector 1.0 ceiling', () => {
		// c5's threshold is `cv <= 1.0` (`detector.ts:100`). This number is the
		// standard deviation over the mean of the schedule this file wrote.
		expect(cv(twoPhase)).toBeGreaterThan(1.0);
	});

	it('keeps the first phase steady, and long enough for the guard to keep it', () => {
		expect(cv(steady)).toBeLessThan(0.1);
		expect(steady.reduce((s, x) => s + x, 0)).toBeGreaterThan(MIN_STABLE_S);
	});

	it('gives the positive control a CV the detector accepts end to end', () => {
		expect(cv(steadyThroughout)).toBeLessThan(1.0);
	});
});

describe('a take that is steady for part of its length is judged on that part', () => {
	it('is still rejected by the detector when the detector is shown all 3.5 seconds', () => {
		// The defect, pinned. This is what `runCapture` used to ask, and the answer
		// has not changed: read as one buffer, this take is not fry.
		const det = detect(twoPhaseBuffer, SR);
		expect(det.accept).toBe(false);
		expect(det.failed).toContain('c5_cv');
	});

	it('finds a passing sub-window and reports it as a sub-window, not the whole take', () => {
		const g = guard(twoPhaseBuffer, SR);
		expect(g.segmentS).not.toBeNull();
		expect(g.fullWindow).toBe(false);
		expect(g.spanS).toBeGreaterThanOrEqual(MIN_STABLE_S);
	});

	it('returns a reading instead of a re-prompt', () => {
		expect(runCapture(twoPhaseBuffer, SR, 'u').outcome).toBe('reading');
	});

	it('recovers the first formant the fixture put in the signal', () => {
		const out = runCapture(twoPhaseBuffer, SR, 'u');
		if (out.outcome !== 'reading') throw new Error(`expected a reading, got ${out.outcome}`);
		expect(Math.abs(out.formant.f1 - FR1)).toBeLessThan(30);
	});

	it('tops the confidence out at medium, because a second and a half is not 3.5 seconds', () => {
		const out = runCapture(twoPhaseBuffer, SR, 'u');
		if (out.outcome !== 'reading') throw new Error(`expected a reading, got ${out.outcome}`);
		expect(out.formant.confidence).not.toBe('high');
	});

	it('carries the guard verdict out to the caller, which is what the console prints', () => {
		const out = runCapture(twoPhaseBuffer, SR, 'u');
		if (out.outcome !== 'reading') throw new Error(`expected a reading, got ${out.outcome}`);
		expect(out.guard.reading).toBe('Captured');
		expect(out.guard.fullWindow).toBe(false);
		expect(out.guard.segmentS).not.toBeNull();
	});
});

describe('the takes this change was not written for move nowhere', () => {
	it('still reads a fry that is regular for the whole take at high confidence', () => {
		// The positive control, and the reason `fullWindow` had to be threaded
		// rather than recomputed: if a 1.5 s slice could earn 'high', this
		// assertion and the sub-window one above would say the same thing.
		const out = runCapture(steadyBuffer, SR, 'u');
		if (out.outcome !== 'reading') throw new Error(`expected a reading, got ${out.outcome}`);
		expect(out.formant.confidence).toBe('high');
		expect(out.guard.fullWindow).toBe(true);
	});

	it('still re-prompts a take with no steady stretch anywhere in it', () => {
		// The negative control. `segmentS` is null, so the pipeline hands the
		// detector the whole buffer exactly as it did before N.80.
		expect(guard(roughBuffer, SR).segmentS).toBeNull();
		const out = runCapture(roughBuffer, SR, 'u');
		expect(out.outcome).toBe('reprompt');
	});
});

describe('the confidence tier reads the guard verdict it was given', () => {
	it('grades on the whole take, not on the slice it was handed', () => {
		// The one rule the threading exists for, stated directly. The buffer is the
		// regular 3.5 s control, which earns 'high' on its own guard. Told that the
		// take it came from only held for a sub-window, the same buffer must not.
		expect(analyze(steadyBuffer, SR, 'u').confidence).toBe('high');
		const asSubWindow = analyze(steadyBuffer, SR, 'u', undefined, {
			...guard(steadyBuffer, SR), fullWindow: false, segmentS: [0, MIN_STABLE_S], spanS: MIN_STABLE_S
		});
		expect(asSubWindow.confidence).toBe('medium');
	});

	it('behaves as it always did when no verdict is passed', () => {
		// The parameter is optional and the absent case must be the old case: the
		// guard runs on `y`. Same buffer, same answer, both ways of asking.
		const own = analyze(steadyBuffer, SR, 'u');
		const explicit = analyze(steadyBuffer, SR, 'u', undefined, guard(steadyBuffer, SR));
		expect(explicit).toEqual(own);
	});
});

describe('the guard says which of its four tests refused a take, and by how much', () => {
	// N.80 step 2. Three [u] takes on `d491d22` all came back
	// `{"reading":"Provisional","fullWindow":false,"segmentS":null,"spanS":0}`, and
	// `c5_cv` never fired. Which of `windowPasses`'s four tests refused them was
	// not recoverable from anything the engine kept.

	it('measures the whole take and names every test the whole take failed', () => {
		const d = guard(twoPhaseBuffer, SR).diag.full;
		expect(d.spanS).toBeGreaterThan(MIN_STABLE_S);
		// The second half alternates 9 ms and 200 ms between pulses, so the pulse
		// rate is the quantity the fixture attacks most directly. It is not the
		// only one it moves: a buffer that is half one thing and half another
		// unsettles the formants and the band envelope too, and the assertion is
		// `toContain` because that is what the fixture licenses.
		expect(d.failed).toContain('rate_cv');
		for (const v of [d.cv1, d.cv2, d.mincor, d.cvr]) expect(typeof v).toBe('number');
	});

	it('measures the sub-window it kept, and that one passes all four', () => {
		const d = guard(twoPhaseBuffer, SR).diag.best;
		if (d === null) throw new Error('expected a candidate window');
		expect(d.failed).toEqual([]);
		expect(d.spanS).toBeGreaterThanOrEqual(MIN_STABLE_S);
		expect(d.cv1).toBeLessThan(T_FR1_CV);
		expect(d.cv2).toBeLessThan(T_FR2_CV);
		expect(d.mincor).toBeGreaterThan(T_ENVCORR);
		expect(d.cvr).toBeLessThan(T_RATE_CV);
	});

	it('names nothing on a fry that is regular for the whole take', () => {
		const g = guard(steadyBuffer, SR);
		expect(g.diag.full.failed).toEqual([]);
		// The whole buffer is itself a candidate window, so when it passes there is
		// nothing longer or cleaner for `best` to be.
		expect(g.diag.best).toEqual(g.diag.full);
	});

	it('names the pulse rate alone when the pulse rate alone is what wandered', () => {
		// The reading this instrument exists to make possible. Everything except
		// the rhythm is held fixed by construction, and the guard says so.
		const d = guard(rateWanderBuffer, SR).diag.full;
		expect(d.failed).toEqual(['rate_cv']);
		expect(d.cvr).toBeGreaterThan(T_RATE_CV);
		expect(d.cv1).toBeLessThan(T_FR1_CV);
		expect(d.cv2).toBeLessThan(T_FR2_CV);
		expect(d.mincor).toBeGreaterThan(T_ENVCORR);
	});

	it('offers no candidate window when the take is shorter than the minimum', () => {
		// A 1.0 s buffer has no window of MIN_STABLE_S to offer, so `best` is null
		// rather than a window that does not exist. `full` is still measured.
		const g = guard(buildBuffer(steadyIntervals(1.0, 0x11d), 1.0, 0xbeef), SR);
		expect(g.diag.best).toBeNull();
		expect(g.diag.full.spanS).toBeLessThan(MIN_STABLE_S);
		expect(typeof g.diag.full.cvr).toBe('number');
	});

	it('rides out on the capture outcome, which is what the console prints', () => {
		// Confirmed, not assumed: `live.ts:684` stringifies the whole outcome, so
		// `diag` reaches the console only if it is reachable from here.
		const out = runCapture(twoPhaseBuffer, SR, 'u');
		if (out.outcome !== 'reading') throw new Error(`expected a reading, got ${out.outcome}`);
		expect(out.guard.diag.full.failed).toContain('rate_cv');
		expect(out.guard.diag.best?.failed).toEqual([]);
		expect(JSON.parse(JSON.stringify(out)).guard.diag.full.cvr).toBe(out.guard.diag.full.cvr);
	});
});
