import { autocorr, levinson, polyRoots, resampleTo, hann, welchPSD, hilbertEnvelope, butterLowpassFiltfilt, findPeaksHeight, mean, std } from './dsp';

const FRAME_MS = 100, HOP_FRAC = 0.5, MIN_STABLE_S = 1.5;
const T_FR1_CV = 0.08, T_FR2_CV = 0.12, T_ENVCORR = 0.92, T_RATE_CV = 0.25;

function frameIndex(n: number, sr: number): [number, number][] {
	const fl = Math.floor((FRAME_MS / 1000) * sr), hop = Math.floor(fl * HOP_FRAC);
	const idx: [number, number][] = [];
	for (let s = 0; s + fl <= n; s += hop) idx.push([s, s + fl]);
	return idx;
}

function coarseFormants(fr: Float64Array, sr: number): [number, number] {
	const target = 8000, order = 12;
	const yr = resampleTo(fr, sr, target), w = hann(yr.length), yw = new Float64Array(yr.length);
	for (let i = 0; i < yr.length; i++) yw[i] = yr[i] * w[i];
	const r = autocorr(yw, order); if (r[0] <= 0) return [NaN, NaN]; r[0] *= 1.0001;
	const a = levinson(r, order);
	const fs: number[] = [];
	for (const rt of polyRoots(a)) {
		if (rt.im <= 0) continue;
		const f = (Math.atan2(rt.im, rt.re) * target) / (2 * Math.PI);
		const bw = -0.5 * (target / (2 * Math.PI)) * Math.log(Math.hypot(rt.re, rt.im) + 1e-12);
		if (f > 90 && f < 3900 && bw < 400) fs.push(f);
	}
	fs.sort((x, y) => x - y);
	return [fs[0] ?? NaN, fs[1] ?? NaN];
}

function envBands(fr: Float64Array, sr: number, nbands = 20): Float64Array {
	const nper = Math.min(512, 1 << Math.floor(Math.log2(fr.length)));
	const { freqs, psd } = welchPSD(fr, sr, nper);
	const sm = new Float64Array(psd.length);
	for (let k = 0; k < psd.length; k++) { let s = 0, c = 0; for (let j = -2; j <= 2; j++) { const i = k + j; if (i >= 0 && i < psd.length) { s += psd[i]; c++; } } sm[k] = s / c; }
	const edges: number[] = [];
	for (let i = 0; i <= nbands; i++) edges.push(100 * Math.pow(40, i / nbands)); // 100..4000 log
	const bands = new Float64Array(nbands);
	for (let b = 0; b < nbands; b++) { let s = 0, c = 0; for (let k = 0; k < freqs.length; k++) if (freqs[k] >= edges[b] && freqs[k] < edges[b + 1]) { s += sm[k]; c++; } bands[b] = c ? s / c : 0; }
	let norm = 0; for (let b = 0; b < nbands; b++) norm += bands[b] * bands[b]; norm = Math.sqrt(norm) + 1e-12;
	for (let b = 0; b < nbands; b++) bands[b] /= norm;
	return bands;
}

function pulseRate(fr: Float64Array, sr: number): number {
	const env = butterLowpassFiltfilt(hilbertEnvelope(fr), 250, sr);
	const pk = findPeaksHeight(env, mean(env) + 1.5 * std(env), Math.floor(sr * 0.005));
	if (pk.length < 2) return NaN;
	let s = 0; for (let i = 1; i < pk.length; i++) s += pk[i] - pk[i - 1];
	return sr / (s / (pk.length - 1));
}

function cv(arr: number[]): number {
	const a = arr.filter((x) => !isNaN(x));
	if (a.length < 2) return Infinity;
	const m = mean(a); return m === 0 ? Infinity : std(a) / m;
}

/** The cosine similarity between each adjacent pair of band envelopes, computed once. */
function adjacentCorrelations(envs: Float64Array[]): number[] {
	const out: number[] = [];
	for (let i = 0; i + 1 < envs.length; i++) {
		const a = envs[i], b = envs[i + 1];
		let dot = 0, na = 0, nb = 0;
		for (let k = 0; k < a.length; k++) { dot += a[k] * b[k]; na += a[k] * a[k]; nb += b[k] * b[k]; }
		out.push(dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12));
	}
	return out;
}

interface WindowStats { cv1: number; cv2: number; mincor: number; cvr: number; }

/** The four quantities the guard tests. Arithmetic unchanged from the single
 *  boolean this replaced; `windowPasses` is now the same test read off these. */
function measure(fr1: number[], fr2: number[], cor: number[], rates: number[], lo: number, hi: number): WindowStats {
	const cv1 = cv(fr1.slice(lo, hi)), cv2 = cv(fr2.slice(lo, hi)), cvr = cv(rates.slice(lo, hi));
	let mincor = 1;
	for (let i = lo; i < hi - 1; i++) mincor = Math.min(mincor, cor[i]);
	return { cv1, cv2, mincor, cvr };
}

/** Names of the tests this window failed. Written as negations so a NaN, which
 *  compares false against everything, counts as a failure exactly as it did. */
function failedIn(m: WindowStats, frames: number): string[] {
	const out: string[] = [];
	if (frames < 2) out.push('frames');
	if (!(m.cv1 < T_FR1_CV)) out.push('fr1_cv');
	if (!(m.cv2 < T_FR2_CV)) out.push('fr2_cv');
	if (!(m.mincor > T_ENVCORR)) out.push('envcorr');
	if (!(m.cvr < T_RATE_CV)) out.push('rate_cv');
	return out;
}

function windowPasses(fr1: number[], fr2: number[], cor: number[], rates: number[], lo: number, hi: number): boolean {
	if (hi - lo < 2) return false;
	return failedIn(measure(fr1, fr2, cor, rates, lo, hi), hi - lo).length === 0;
}

/** Three places. `null` where the quantity could not be formed at all: `cv()`
 *  returns Infinity on fewer than two measurable frames, and an infinity on the
 *  console says nothing a reader can act on. The name still appears in `failed`. */
function round3(x: number): number | null {
	return Number.isFinite(x) ? Math.round(x * 1000) / 1000 : null;
}

/**
 * What the guard measured on one window. N.80 step 2: the guard used to answer
 * yes or no, and a [u] take that came back `Provisional` said nothing about which
 * of the four tests refused it or by how much.
 */
export interface GuardWindowDiag {
	spanS: number;
	cv1: number | null; cv2: number | null; mincor: number | null; cvr: number | null;
	failed: string[];
}

/**
 * `full` is the whole buffer. `best` is the candidate window of at least
 * MIN_STABLE_S with the fewest failing tests, ties going to the longer span and
 * then to the earlier start. The whole buffer is itself a candidate, so when the
 * full window passes, `best` and `full` describe the same window.
 *
 * `best` is a DIAGNOSTIC choice, not the guard's choice. When `best.failed` is
 * empty it is the window `segmentS` names. When it is not empty, no window passed
 * and `segmentS` is null: `best` then says which window came closest and what
 * stopped it.
 */
export interface GuardDiag { full: GuardWindowDiag; best: GuardWindowDiag | null; }

export interface GuardResult { reading: 'Captured' | 'Provisional'; fullWindow: boolean; segmentS: [number, number] | null; spanS: number; diag: GuardDiag; }

export function guard(y: Float64Array, sr: number): GuardResult {
	const idx = frameIndex(y.length, sr), nf = idx.length;
	const fr1: number[] = [], fr2: number[] = [], envs: Float64Array[] = [], rates: number[] = [];
	for (const [s, e] of idx) {
		const fr = y.subarray(s, e);
		const [f1, f2] = coarseFormants(fr, sr);
		fr1.push(f1); fr2.push(f2); envs.push(envBands(fr, sr)); rates.push(pulseRate(fr, sr));
	}
	// Under two frames there is no window to test and never was: `windowPasses`
	// refused on `hi - lo < 2` and the sub-window loop could not run. Same verdict,
	// stated up front so the diagnostic below can index `idx` safely.
	if (nf < 2)
		return {
			reading: 'Provisional', fullWindow: false, segmentS: null, spanS: 0,
			diag: { full: { spanS: 0, cv1: null, cv2: null, mincor: null, cvr: null, failed: ['frames'] }, best: null }
		};
	const cor = adjacentCorrelations(envs);
	const spanS = (lo: number, hi: number) => (idx[hi - 1][1] - idx[lo][0]) / sr;
	const diagOf = (lo: number, hi: number): GuardWindowDiag => {
		const m = measure(fr1, fr2, cor, rates, lo, hi);
		return {
			spanS: spanS(lo, hi),
			cv1: round3(m.cv1), cv2: round3(m.cv2), mincor: round3(m.mincor), cvr: round3(m.cvr),
			failed: failedIn(m, hi - lo)
		};
	};
	let bestDiag: GuardWindowDiag | null = null;
	for (let lo = 0; lo < nf; lo++) {
		for (let hi = nf; hi > lo + 1; hi--) {
			if (spanS(lo, hi) < MIN_STABLE_S) break;
			const d = diagOf(lo, hi);
			if (!bestDiag || d.failed.length < bestDiag.failed.length ||
				(d.failed.length === bestDiag.failed.length && d.spanS > bestDiag.spanS)) bestDiag = d;
		}
	}
	const diag: GuardDiag = { full: diagOf(0, nf), best: bestDiag };
	if (windowPasses(fr1, fr2, cor, rates, 0, nf))
		return { reading: 'Captured', fullWindow: true, segmentS: [0, y.length / sr], spanS: spanS(0, nf), diag };
	let best: [number, number, number] | null = null;
	for (let lo = 0; lo < nf; lo++) {
		for (let hi = nf; hi > lo + 1; hi--) {
			if (spanS(lo, hi) < MIN_STABLE_S) break;
			if (windowPasses(fr1, fr2, cor, rates, lo, hi)) { const sp = spanS(lo, hi); if (!best || sp > best[2]) best = [lo, hi, sp]; break; }
		}
	}
	if (best) return { reading: 'Captured', fullWindow: false, segmentS: [idx[best[0]][0] / sr, idx[best[1] - 1][1] / sr], spanS: best[2], diag };
	return { reading: 'Provisional', fullWindow: false, segmentS: null, spanS: 0, diag };
}
