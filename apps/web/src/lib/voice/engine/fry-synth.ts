/**
 * Synthetic vocal fry with known resonances, for testing the extractor without a singer
 * (`docs/sessions/brief-code-i-extractor_r1_2026-09-30.md`, step 1). Test support only:
 * nothing in the app imports it.
 *
 * Source: a train of glottal flow-derivative pulses (the derivative of a Rosenberg pulse,
 * so lip radiation is folded in), at a fry rate with per-period jitter, optionally
 * alternating long and short periods (diplophonic fry), optionally with pulse-synchronous
 * aspiration noise. Tract: a cascade of two-pole resonators, each normalized to unit gain
 * at 0 Hz, as in a Klatt cascade synthesizer. Room: a quiet pink-ish noise bed at a fixed
 * level, so a quieter take has a lower signal-to-noise ratio, as it would in a real room.
 *
 * The known fR1 is the first resonator's frequency. Every expected value a test asserts
 * comes from these arguments, never from the extractor.
 */

export interface FryCase {
	/** Resonance frequencies in Hz, lowest first; the first is the known fR1. */
	formants: number[];
	/** Bandwidths in Hz, one per formant. */
	bandwidths: number[];
	/** Mean pulse rate in Hz. */
	rate: number;
	/** Per-period jitter as a fraction of the period (uniform, plus or minus). */
	jitter?: number;
	/** Alternate periods lengthened and shortened by this fraction (diplophonic fry). */
	diplo?: number;
	/** Aspiration noise mixed into each pulse, as a fraction of the pulse's peak. */
	breath?: number;
	/** Signal level in dB relative to a 0.3 peak. 0 is loud; -30 is 30 dB quieter. */
	levelDb?: number;
	/** Room noise RMS, absolute. */
	roomRms?: number;
	/** Open phase of each pulse in ms. */
	openMs?: number;
	/** A second pulse this many ms after each main pulse (multiple-pulsed fry). */
	pairMs?: number;
	/** The second pulse's amplitude relative to the first. */
	pairRatio?: number;
	/** A microphone's low-frequency roll-off: a second-order highpass at this frequency. */
	highpassHz?: number;
	/** Mains hum at 60 Hz with its 2nd and 3rd harmonics, RMS, absolute. */
	humRms?: number;
	/** Seconds. */
	durationS?: number;
	seed?: number;
}

export const SYNTH_SR = 48000;

/** Deterministic uniform noise in [0, 1), xorshift32. */
export function rng(seed: number): () => number {
	let s = (seed || 1) >>> 0;
	return () => {
		s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
		return s / 0x100000000;
	};
}

/** Rosenberg flow derivative: opening over 2/3 of the open phase, closing over the rest. */
function pulseShape(sr: number, openMs: number): Float64Array {
	const n = Math.max(4, Math.round((openMs / 1000) * sr)), tp = Math.round(n * 2 / 3), tn = n - tp;
	const flow = new Float64Array(n + 1);
	for (let i = 0; i <= n; i++) {
		flow[i] = i <= tp ? 0.5 * (1 - Math.cos((Math.PI * i) / tp)) : Math.cos((Math.PI * (i - tp)) / (2 * tn));
	}
	const d = new Float64Array(n);
	for (let i = 0; i < n; i++) d[i] = flow[i + 1] - flow[i];
	return d;
}

/** One two-pole resonator, unit gain at 0 Hz, applied in place. */
function resonator(x: Float64Array, sr: number, f: number, bw: number): void {
	const r = Math.exp((-Math.PI * bw) / sr);
	const c = 2 * r * Math.cos((2 * Math.PI * f) / sr), d = -r * r, g = 1 - c - d;
	let y1 = 0, y2 = 0;
	for (let i = 0; i < x.length; i++) {
		const y = g * x[i] + c * y1 + d * y2;
		y2 = y1; y1 = y; x[i] = y;
	}
}

/** Second-order Butterworth highpass, applied in place (bilinear transform). */
function highpass(x: Float64Array, sr: number, fc: number): void {
	const k = Math.tan((Math.PI * fc) / sr), q = Math.SQRT1_2, norm = 1 / (1 + k / q + k * k);
	const b0 = norm, b1 = -2 * norm, b2 = norm, a1 = 2 * (k * k - 1) * norm, a2 = (1 - k / q + k * k) * norm;
	let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
	for (let i = 0; i < x.length; i++) {
		const xi = x[i], yi = b0 * xi + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
		x2 = x1; x1 = xi; y2 = y1; y1 = yi; x[i] = yi;
	}
}

export function synthFry(c: FryCase): Float64Array {
	const sr = SYNTH_SR, n = Math.round((c.durationS ?? 3.5) * sr);
	const r = rng(c.seed ?? 0x5eed), shape = pulseShape(sr, c.openMs ?? 5);
	const src = new Float64Array(n);
	let t = 0.01, k = 0;
	for (;;) {
		const i0 = Math.round(t * sr);
		if (i0 >= n) break;
		for (let j = 0; j < shape.length && i0 + j < n; j++) {
			const asp = c.breath ? c.breath * (r() * 2 - 1) * 0.02 : 0;
			src[i0 + j] += shape[j] + asp;
		}
		if (c.pairMs) {
			const i1 = i0 + Math.round((c.pairMs / 1000) * sr), g1 = c.pairRatio ?? 0.6;
			for (let j = 0; j < shape.length && i1 + j < n; j++) src[i1 + j] += g1 * shape[j];
		}
		const base = 1 / c.rate;
		const alt = c.diplo ? (k % 2 === 0 ? 1 + c.diplo : 1 - c.diplo) : 1;
		const jit = 1 + (r() * 2 - 1) * (c.jitter ?? 0);
		t += base * alt * jit; k++;
	}
	c.formants.forEach((f, i) => resonator(src, sr, f, c.bandwidths[i]));
	let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(src[i]));
	const gain = (0.3 * Math.pow(10, (c.levelDb ?? 0) / 20)) / (peak || 1);
	// Pink-ish room bed: white noise through a one-pole lowpass at about 500 Hz, rescaled.
	const nr = rng((c.seed ?? 0x5eed) ^ 0x9e3779b9), bed = new Float64Array(n);
	const a = Math.exp((-2 * Math.PI * 500) / sr);
	let p = 0, ss = 0;
	for (let i = 0; i < n; i++) { p = a * p + (1 - a) * (nr() * 2 - 1); bed[i] = p; ss += p * p; }
	const bedGain = (c.roomRms ?? 0.0005) / Math.sqrt(ss / n || 1);
	const out = new Float64Array(n);
	for (let i = 0; i < n; i++) out[i] = src[i] * gain + bed[i] * bedGain;
	if (c.humRms) {
		for (let i = 0; i < n; i++) {
			const w = (2 * Math.PI * 60 * i) / sr;
			out[i] += c.humRms * Math.SQRT2 * (0.8 * Math.sin(w) + 0.5 * Math.sin(2 * w + 1) + 0.33 * Math.sin(3 * w + 2)) / Math.hypot(0.8, 0.5, 0.33);
		}
	}
	if (c.highpassHz) highpass(out, sr, c.highpassHz);
	return out;
}
