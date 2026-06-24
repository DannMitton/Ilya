import { rfftMag, cepstralEnvelopeDb, hann, findPeaks, autocorr, levinson, polyRoots, resampleTo } from './dsp';

export const MITTON: Record<string, [number, number]> = {
	i: [296, 1705], e: [381, 1532], ɪ: [393, 1600], ɨ: [404, 1100], ɛ: [577, 1311],
	a: [711, 1113], ɑ: [617, 1013], ʌ: [616, 1167], o: [489, 826], u: [346, 804],
};
const PREEMPH = 0.97, FRAME_MS = 25, NFFT = 4096, LIFTER_MS = 8, PROM_DB = 3;
const F1R: [number, number] = [150, 1200], F2R: [number, number] = [500, 3000];

function preemph(y: Float64Array): Float64Array {
	const o = new Float64Array(y.length); o[0] = y[0];
	for (let i = 1; i < y.length; i++) o[i] = y[i] - PREEMPH * y[i - 1];
	return o;
}

function ltasEnvelope(y: Float64Array, sr: number) {
	const ye = preemph(y);
	const fl = Math.floor((FRAME_MS / 1000) * sr), hop = fl >> 1, w = hann(fl);
	const half = NFFT / 2 + 1, avg = new Float64Array(half); let nf = 0;
	for (let s = 0; s + fl <= ye.length; s += hop) {
		const fr = new Float64Array(fl);
		for (let i = 0; i < fl; i++) fr[i] = ye[s + i] * w[i];
		const mag = rfftMag(fr, NFFT);
		for (let k = 0; k < half; k++) avg[k] += mag[k];
		nf++;
	}
	for (let k = 0; k < half; k++) avg[k] /= nf;
	const env = cepstralEnvelopeDb(avg, sr, LIFTER_MS, NFFT);
	const freqs = new Float64Array(half);
	for (let k = 0; k < half; k++) freqs[k] = (k * sr) / NFFT;
	return { env, freqs };
}

function parabolic(env: Float64Array, freqs: Float64Array, k: number): number {
	if (k > 0 && k < env.length - 1) {
		const a = env[k - 1], b = env[k], c = env[k + 1], d = a - 2 * b + c;
		const delta = d !== 0 ? (0.5 * (a - c)) / d : 0;
		return freqs[k] + delta * (freqs[1] - freqs[0]);
	}
	return freqs[k];
}

function nearestPeak(peaks: { idx: number }[], freqs: Float64Array, target: number): number {
	return peaks.reduce((b, p) => (Math.abs(freqs[p.idx] - target) < Math.abs(freqs[b.idx] - target) ? p : b)).idx;
}

export function ltasFormants(y: Float64Array, sr: number, vowel: string): { f1: number | null; f2: number | null } {
	const { env, freqs } = ltasEnvelope(y, sr);
	const [pe1, pe2] = MITTON[vowel];
	const peaks = findPeaks(env, PROM_DB).filter((p) => freqs[p.idx] >= F1R[0] && freqs[p.idx] <= F2R[1]);
	const c1 = peaks.filter((p) => freqs[p.idx] >= F1R[0] && freqs[p.idx] <= F1R[1]);
	if (!c1.length) return { f1: null, f2: null };
	const k1 = nearestPeak(c1, freqs, pe1);
	const f1 = parabolic(env, freqs, k1);
	const c2 = peaks.filter((p) => freqs[p.idx] >= F2R[0] && freqs[p.idx] <= F2R[1] && freqs[p.idx] > f1 + 80);
	if (!c2.length) return { f1, f2: null };
	const k2 = nearestPeak(c2, freqs, pe2);
	return { f1, f2: parabolic(env, freqs, k2) };
}

export function lpcFormants(y: Float64Array, sr: number, vowel: string): { f1: number | null; f2: number | null } {
	const target = 8000;
	const yr = resampleTo(preemph(y), sr, target);
	const w = hann(yr.length), yw = new Float64Array(yr.length);
	for (let i = 0; i < yr.length; i++) yw[i] = yr[i] * w[i];
	const order = 18;
	const r = autocorr(yw, order); if (r[0] <= 0) return { f1: null, f2: null }; r[0] *= 1.0001;
	const a = levinson(r, order);
	const cand: number[] = [];
	for (const rt of polyRoots(a)) {
		if (rt.im <= 0) continue;
		const f = (Math.atan2(rt.im, rt.re) * target) / (2 * Math.PI);
		const bw = -0.5 * (target / (2 * Math.PI)) * Math.log(Math.hypot(rt.re, rt.im) + 1e-12);
		if (f > 150 && f < 3000 && bw < 400) cand.push(f);
	}
	cand.sort((x, y) => x - y);
	if (!cand.length) return { f1: null, f2: null };
	const [pe1, pe2] = MITTON[vowel];
	const inF1 = cand.filter((f) => f > 150 && f < 1200);
	const f1 = inF1.length ? inF1.reduce((b, f) => (Math.abs(f - pe1) < Math.abs(b - pe1) ? f : b)) : null;
	const inF2 = cand.filter((f) => f > 500 && f < 3000 && (f1 === null || f > f1 + 80));
	const f2 = inF2.length ? inF2.reduce((b, f) => (Math.abs(f - pe2) < Math.abs(b - pe2) ? f : b)) : null;
	return { f1, f2 };
}

export function cents(meas: number, known: number): number { return 1200 * Math.log2(meas / known); }

// --- full extraction with f2 prominence, LPC fallback, agreement (for assembly) ---
function ltasEnvExport(y: Float64Array, sr: number) {
	const ye = preemph(y);
	const fl = Math.floor((FRAME_MS / 1000) * sr), hop = fl >> 1, w = hann(fl);
	const half = NFFT / 2 + 1, avg = new Float64Array(half); let nf = 0;
	for (let s = 0; s + fl <= ye.length; s += hop) {
		const fr = new Float64Array(fl);
		for (let i = 0; i < fl; i++) fr[i] = ye[s + i] * w[i];
		const mag = rfftMag(fr, NFFT);
		for (let k = 0; k < half; k++) avg[k] += mag[k];
		nf++;
	}
	for (let k = 0; k < half; k++) avg[k] /= nf;
	const env = cepstralEnvelopeDb(avg, sr, LIFTER_MS, NFFT);
	const freqs = new Float64Array(half);
	for (let k = 0; k < half; k++) freqs[k] = (k * sr) / NFFT;
	return { env, freqs };
}

export interface ExtractResult { f1: number | null; f2: number | null; f2Prom: number; method: 'ltas' | 'lpc-fallback'; agreement: [number, number] | null; }

export function extractFormants(y: Float64Array, sr: number, vowel: string): ExtractResult {
	const { env, freqs } = ltasEnvExport(y, sr);
	const [pe1, pe2] = MITTON[vowel];
	const peaks = findPeaks(env, PROM_DB).filter((p) => freqs[p.idx] >= F1R[0] && freqs[p.idx] <= F2R[1]);
	const c1 = peaks.filter((p) => freqs[p.idx] >= F1R[0] && freqs[p.idx] <= F1R[1]);
	let lf1: number | null = null, lf2: number | null = null, f2Prom = 0;
	if (c1.length) {
		const p1 = c1.reduce((b, p) => (Math.abs(freqs[p.idx] - pe1) < Math.abs(freqs[b.idx] - pe1) ? p : b));
		lf1 = parabolic(env, freqs, p1.idx);
		const c2 = peaks.filter((p) => freqs[p.idx] >= F2R[0] && freqs[p.idx] <= F2R[1] && freqs[p.idx] > lf1! + 80);
		if (c2.length) {
			const p2 = c2.reduce((b, p) => (Math.abs(freqs[p.idx] - pe2) < Math.abs(freqs[b.idx] - pe2) ? p : b));
			lf2 = parabolic(env, freqs, p2.idx); f2Prom = p2.prom;
		}
	}
	if (lf1 === null || lf2 === null) {
		const p = lpcFormants(y, sr, vowel);
		return { f1: p.f1, f2: p.f2, f2Prom: 0, method: 'lpc-fallback', agreement: null };
	}
	const p = lpcFormants(y, sr, vowel);
	const agreement: [number, number] | null = (p.f1 && p.f2) ? [Math.abs(cents(lf1, p.f1)), Math.abs(cents(lf2, p.f2))] : null;
	return { f1: lf1, f2: lf2, f2Prom, method: 'ltas', agreement };
}
