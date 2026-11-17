/**
 * Burg LPC, with formants from the roots of the predictor (N.200 path picker, `docs/sessions/brief-code-n200-path-picker_r3_2026-11-16.md`,
 * section 3.2 item 1).
 *
 * SOURCE OF BURG'S METHOD. Burg's recursion is written here from its published description: the reflection coefficient of each stage
 * is the one that minimises the summed forward and backward prediction error power, k = -2 Σ f·b / Σ (f² + b²), after which the
 * predictor is updated by the Levinson step and the two error sequences by f' = f + k·b, b' = b + k·f (shifted by one sample). Two
 * published descriptions are named in the reference list of Weenink (2015), the paper this lane builds from: Markel and Gray (1976),
 * *Linear Prediction of Speech* (Springer), and Press et al. (1996), *Numerical Recipes in C*, 2nd ed., the section on linear
 * prediction (routine `memcof`). I wrote the recursion from the standard description of it, and I did not have either book to open in
 * this session, so the PAGE NUMBERS ARE NOT ESTABLISHED and are not given here. The desk supplies them. The known-poles test
 * (`burg.test.ts`) is what checks the recursion; it does not rest on the citation.
 * Not opened, and not copied from: Praat's source, Praat's repository, and parselmouth's source (Praat is GPL-3.0-or-later; Ilya is AGPL-3.0-only).
 *
 * THE ANALYSIS RECIPE is `tools/i-extractor-check/burg.py:66-89`, the repository's own independent reading, with the ceiling a parameter:
 * resample to twice the ceiling (`resampleTo`, `dsp.ts`); pre-emphasis from 50 Hz; a Gaussian window 50 ms long (25 ms effective);
 * a 6.25 ms step; ten coefficients; roots kept between 50 Hz and the ceiling minus 50 Hz, sorted ascending.
 * 6.25 ms is a DESK DEFAULT: the step P0b's path ran at and the step the plan costed (Weenink 2015 uses 2.5 ms, Weenink 2023's form shows 5 ms).
 */
import { polyRoots, resampleTo } from './dsp';

export const BURG_ORDER = 10;
export const WIN_EFFECTIVE_S = 0.025;
export const STEP_S = 0.00625;
export const PREEMPH_HZ = 50;
/** Roots kept from this frequency to the ceiling minus this margin, in Hz. */
export const ROOT_MARGIN_HZ = 50;

/** Burg's method: predictor coefficients a[0..order], a[0] = 1, so that A(z) = Σ a[i] z^-i. */
export function burgCoefficients(x: ArrayLike<number>, order: number): number[] {
	const n = x.length;
	const f = new Float64Array(n), b = new Float64Array(n);
	for (let i = 0; i < n; i++) { f[i] = x[i]; b[i] = x[i]; }
	let a = [1];
	for (let m = 0; m < order; m++) {
		// forward error f[m+1..], backward error b[m..n-2], as in the recursion's definition
		let num = 0, den = 0;
		for (let i = m + 1; i < n; i++) { num += f[i] * b[i - 1]; den += f[i] * f[i] + b[i - 1] * b[i - 1]; }
		if (!(den > 0)) break;
		const k = (-2 * num) / den;
		const next = new Array<number>(a.length + 1).fill(0);
		for (let i = 0; i < a.length; i++) next[i] += a[i];
		for (let i = 0; i < a.length; i++) next[a.length - i] += k * a[i];
		a = next;
		// update both error sequences in place, newest sample first so b[i-1] is still the old value
		for (let i = n - 1; i > m; i--) {
			const fi = f[i], bi = b[i - 1];
			f[i] = fi + k * bi;
			b[i] = bi + k * fi;
		}
	}
	return a;
}

export interface Pole { f: number; bw: number }

/** Poles of 1/A(z) in the upper half plane, as frequency and bandwidth in Hz, sorted ascending by frequency. */
export function polesOf(a: number[], sr: number): Pole[] {
	const out: Pole[] = [];
	for (const r of polyRoots(a)) {
		if (r.im <= 0) continue;
		const mag = Math.hypot(r.re, r.im);
		out.push({ f: (Math.atan2(r.im, r.re) * sr) / (2 * Math.PI), bw: (-Math.log(mag) * sr) / Math.PI });
	}
	return out.sort((p, q) => p.f - q.f);
}

/** The Gaussian window of the recipe: exp(-12 (t/n)²) with its edge removed, n samples, centred. */
export function gaussianWindow(n: number): Float64Array {
	const w = new Float64Array(n), edge = Math.exp(-12 * 0.25);
	for (let i = 0; i < n; i++) { const t = i - (n - 1) / 2; w[i] = (Math.exp(-12 * (t / n) ** 2) - edge) / (1 - edge); }
	return w;
}

/** Round half to even, as `burg.py`'s Python `round` does: 62.5 samples is 62, not 63. Matters only for an exact comparison with it. */
const roundEven = (v: number) => { const r = Math.round(v); return Math.abs(v % 1) === 0.5 && r % 2 !== 0 ? r - 1 : r; };

export interface BurgFrame {
	/** Frame centre, seconds from the start of the analysed stretch. */
	t: number;
	/** Poles kept (50 Hz to ceiling minus 50 Hz), ascending: the first three are F1 to F3. */
	poles: Pole[];
}

export interface BurgOptions { stepS?: number; order?: number }

/** Every frame of a stretch analysed at one ceiling. */
export function burgFrames(y: Float64Array, sr: number, ceiling: number, opts: BurgOptions = {}): BurgFrame[] {
	const sr2 = 2 * ceiling;
	const x0 = sr === sr2 ? y : resampleTo(y, sr, sr2);
	const alpha = Math.exp((-2 * Math.PI * PREEMPH_HZ) / sr2);
	const x = new Float64Array(x0.length);
	if (x0.length) x[0] = x0[0];
	for (let i = 1; i < x0.length; i++) x[i] = x0[i] - alpha * x0[i - 1];
	const n = roundEven(2 * WIN_EFFECTIVE_S * sr2), w = gaussianWindow(n);
	const hop = Math.max(1, roundEven((opts.stepS ?? STEP_S) * sr2)), order = opts.order ?? BURG_ORDER;
	const out: BurgFrame[] = [];
	const fr = new Float64Array(n);
	for (let s = 0; s < x.length - n; s += hop) {
		let any = false;
		for (let i = 0; i < n; i++) { fr[i] = x[s + i] * w[i]; if (fr[i] !== 0) any = true; }
		if (!any) continue;
		const poles = polesOf(burgCoefficients(fr, order), sr2).filter((p) => p.f > ROOT_MARGIN_HZ && p.f < ceiling - ROOT_MARGIN_HZ);
		out.push({ t: (s + n / 2) / sr2, poles });
	}
	return out;
}
