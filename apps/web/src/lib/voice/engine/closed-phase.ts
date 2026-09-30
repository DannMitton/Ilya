/**
 * Closed-phase first resonance for vocal fry
 * (`docs/sessions/brief-code-i-extractor_r1_2026-09-30.md`, step 3).
 *
 * Why this exists. The cepstral route in `extract.ts` reads the peak of the averaged
 * spectrum, and that spectrum is the source times the tract. A fry pulse's open phase
 * (a few ms) puts a broad dip in the source spectrum at a few hundred Hz, which is where a
 * bass [i] or [u] has its first resonance. The dip pulls the peak off the resonance, by
 * an amount that moves with the open phase. Measured on synthetic fry (`fry-synth.ts`,
 * `i-extractor.test.ts`) before this module: a 290 Hz resonance read 262 to 274 Hz, a
 * 270 Hz [u] read 245 to 262 Hz, and with a second pulse 5 ms after each main pulse a
 * 330 Hz resonance read 204 Hz at one fry rate and 360 Hz at another. [ɑ] at 650 to
 * 750 Hz was unaffected.
 *
 * What this does instead. Fry has a long closed phase. After each glottal excitation the
 * signal is the tract ringing with no source in it. This module:
 *   1. finds the excitations twice: as peaks of the smoothed Hilbert envelope, which is how
 *      the detector finds pulses and works on any vowel at any level, and as peaks of an
 *      inverse-filtered residual, which also catches a second pulse a few ms after the
 *      first when the take is loud enough to show it;
 *   2. keeps each stretch of AVG_MS after an excitation that no other excitation interrupts, with
 *      OPEN_MS to spare before the next one, whose open phase has already begun by then;
 *   3. aligns those stretches on each other and averages them. The ringing repeats pulse
 *      after pulse and the room does not, so the room falls by about the square root of
 *      the number of stretches;
 *   4. fits one all-pole model to the average (the covariance method) and returns its poles.
 *
 * Returns null, and the caller keeps the cepstral route, when fewer than MIN_SEGMENTS
 * clean stretches exist. Deterministic: the same buffer always gives the same answer.
 */
import { autocorr, levinson, polyRoots, resampleTo, hann, hilbertEnvelope, butterLowpassFiltfilt } from './dsp';

const TARGET_SR = 8000;
/** Poles for up to five resonances under 4 kHz, plus one spare pair. */
const ORDER = 12;
/** The inverse filter that exposes the excitations in the residual. */
const INV_ORDER = 10;
/** Two excitations closer than this are one event. */
const MIN_GAP_MS = 2;
/** An envelope peak within this of a residual excitation is the same pulse; the residual's instant wins. */
const MERGE_MS = 3;
/** An excitation is judged against the largest peak within this distance, and must reach LOCAL_FRAC of it. */
const LOCAL_WIN_MS = 12, LOCAL_FRAC = 0.35;
/** Samples skipped after each excitation, so the pulse itself stays outside the fit. */
const SKIP_MS = 0.5;
/** The length of each averaged stretch: shorter than the shortest fry period the detector admits (12.5 ms). */
const AVG_MS = 6;
/** Room left for the next pulse's open phase: its flow starts rising this long before its closure, smoothly,
 *  so neither finder marks it. JUDGEMENT: the synthetic pulse's own open phase; no source here gives real fry's. */
const OPEN_MS = 5;
/** Each stretch may slide this many samples (1 ms) to line up with the average, over REFINE passes. */
const SHIFT = 8, REFINE = 2;
/** At least this many clean stretches, or the module abstains. */
const MIN_SEGMENTS = 6;

export interface Resonance { f: number; bw: number }
export interface ClosedPhaseResult {
	/** Resonances found, ascending, with bandwidths in Hz. */
	resonances: Resonance[];
	/** How many stretches were averaged. */
	segments: number;
}

function preemph(y: Float64Array, k: number): Float64Array {
	const o = new Float64Array(y.length); o[0] = y[0];
	for (let i = 1; i < y.length; i++) o[i] = y[i] - k * y[i - 1];
	return o;
}

/** Local maxima of `v` above `floor`, each at least LOCAL_FRAC of the largest value near it, MIN_GAP_MS apart. */
function localPeaks(v: Float64Array, floor: number): number[] {
	const gap = Math.round((MIN_GAP_MS / 1000) * TARGET_SR), win = Math.round((LOCAL_WIN_MS / 1000) * TARGET_SR);
	const cand: number[] = [];
	for (let n = 1; n < v.length - 1; n++) {
		if (!(v[n] > v[n - 1] && v[n] >= v[n + 1]) || v[n] < floor) continue;
		let m = 0;
		for (let j = Math.max(0, n - win); j <= Math.min(v.length - 1, n + win); j++) m = Math.max(m, v[j]);
		if (v[n] >= LOCAL_FRAC * m) cand.push(n);
	}
	cand.sort((p, q) => v[q] - v[p]);
	const kept: number[] = [];
	for (const n of cand) if (kept.every((k) => Math.abs(k - n) >= gap)) kept.push(n);
	return kept.sort((p, q) => p - q);
}

/** Excitations as peaks of the inverse-filtered residual: sharp, and they include a second pulse. */
function residualExcitations(x: Float64Array): number[] {
	const xe = preemph(x, 0.97), w = hann(x.length), xw = new Float64Array(x.length);
	for (let i = 0; i < x.length; i++) xw[i] = xe[i] * w[i];
	const r = autocorr(xw, INV_ORDER);
	if (r[0] <= 0) return [];
	r[0] *= 1.0001;
	const a = levinson(r, INV_ORDER);
	const res = new Float64Array(x.length);
	for (let n = INV_ORDER; n < x.length; n++) {
		let s = 0;
		for (let j = 0; j <= INV_ORDER; j++) s += a[j] * xe[n - j];
		res[n] = Math.abs(s);
	}
	const heights: number[] = [];
	for (let n = 1; n < res.length - 1; n++) if (res[n] > res[n - 1] && res[n] >= res[n + 1]) heights.push(res[n]);
	if (!heights.length) return [];
	heights.sort((p, q) => p - q);
	const p99 = heights[Math.floor(0.99 * (heights.length - 1))], med = heights[Math.floor(0.5 * (heights.length - 1))];
	return localPeaks(res, Math.max(0.1 * p99, 3 * med));
}

/** Excitations as peaks of the smoothed Hilbert envelope, as `detector.ts` finds pulses. */
function envelopeExcitations(x: Float64Array): number[] {
	const env = butterLowpassFiltfilt(hilbertEnvelope(x), 250, TARGET_SR);
	const sorted = Float64Array.from(env).sort();
	return localPeaks(env, 2 * sorted[Math.floor(0.2 * (sorted.length - 1))]);
}

/** Solve A x = b by Gaussian elimination with partial pivoting. Null if singular. */
function solve(A: number[][], b: number[]): number[] | null {
	const n = b.length, M = A.map((row, i) => [...row, b[i]]);
	for (let c = 0; c < n; c++) {
		let p = c;
		for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
		if (Math.abs(M[p][c]) < 1e-300) return null;
		[M[c], M[p]] = [M[p], M[c]];
		for (let r = c + 1; r < n; r++) {
			const f = M[r][c] / M[c][c];
			for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
		}
	}
	const x = new Array(n).fill(0);
	for (let r = n - 1; r >= 0; r--) {
		let s = M[r][n];
		for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k];
		x[r] = s / M[r][r];
	}
	return x;
}

export function closedPhaseResonances(y: Float64Array, sr: number): ClosedPhaseResult | null {
	const x = resampleTo(y, sr, TARGET_SR);
	const res = residualExcitations(x), near = Math.round((MERGE_MS / 1000) * TARGET_SR);
	const ex = [...res, ...envelopeExcitations(x).filter((e) => res.every((r) => Math.abs(r - e) > near))].sort((p, q) => p - q);

	const skip = Math.round((SKIP_MS / 1000) * TARGET_SR), L = Math.round((AVG_MS / 1000) * TARGET_SR);
	const open = Math.round((OPEN_MS / 1000) * TARGET_SR);
	const starts: number[] = [];
	for (let k = 0; k + 1 < ex.length; k++) {
		const st = ex[k] + skip;
		if (ex[k + 1] - open - st >= L && st - SHIFT >= 0 && st + L + SHIFT < x.length) starts.push(st);
	}
	if (starts.length < MIN_SEGMENTS) return null;

	let avg = new Float64Array(L);
	for (const st of starts) for (let i = 0; i < L; i++) avg[i] += x[st + i];
	for (let pass = 0; pass < REFINE; pass++) {
		const next = new Float64Array(L);
		for (const st of starts) {
			let best = 0, bestC = -Infinity;
			for (let d = -SHIFT; d <= SHIFT; d++) {
				let c = 0;
				for (let i = 0; i < L; i++) c += avg[i] * x[st + d + i];
				if (c > bestC) { bestC = c; best = d; }
			}
			for (let i = 0; i < L; i++) next[i] += x[st + best + i];
		}
		avg = next;
	}

	// Covariance method on the average: phi[i][j] = sum over n of avg[n-i] avg[n-j].
	const phi = Array.from({ length: ORDER + 1 }, () => new Array(ORDER + 1).fill(0));
	for (let n = ORDER; n < L; n++)
		for (let i = 0; i <= ORDER; i++) for (let j = i; j <= ORDER; j++) phi[i][j] += avg[n - i] * avg[n - j];
	for (let i = 0; i <= ORDER; i++) for (let j = 0; j < i; j++) phi[i][j] = phi[j][i];
	const A: number[][] = [], b: number[] = [];
	for (let i = 1; i <= ORDER; i++) { A.push(phi[i].slice(1)); b.push(-phi[i][0]); }
	const coef = solve(A, b);
	if (!coef) return null;

	const resonances: Resonance[] = [];
	for (const rt of polyRoots([1, ...coef])) {
		const mag = Math.hypot(rt.re, rt.im);
		if (rt.im <= 0 || mag >= 1) continue;
		resonances.push({ f: (Math.atan2(rt.im, rt.re) * TARGET_SR) / (2 * Math.PI), bw: (-TARGET_SR / Math.PI) * Math.log(mag) });
	}
	resonances.sort((p, q) => p.f - q.f);
	return { resonances, segments: starts.length };
}

/** Below this bandwidth a pole is a steady tone (hum, a harmonic), not a resonance of the tract. JUDGEMENT:
 *  on the synthetic set any floor from 20 to 30 Hz gives the same result; 25 sits in the middle. */
const MIN_BW = 25, MAX_BW = 400;

/** The closed-phase first resonance: the pole in `window` nearest `prior`, or null when the module abstains. */
export function closedPhaseF1(cp: ClosedPhaseResult | null, prior: number, window: [number, number]): number | null {
	if (!cp) return null;
	const c = cp.resonances.filter((q) => q.f >= window[0] && q.f <= window[1] && q.bw >= MIN_BW && q.bw < MAX_BW);
	if (!c.length) return null;
	return c.reduce((b, q) => (Math.abs(q.f - prior) < Math.abs(b.f - prior) ? q : b)).f;
}
