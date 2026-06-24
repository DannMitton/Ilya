// Shane DSP core: numeric primitives for the engine port (browser-safe, no deps).
// Validated under Node against the Python/scipy reference before use.

/** In-place iterative radix-2 FFT. Length must be a power of two. */
export function fft(re: Float64Array, im: Float64Array, inverse = false): void {
	const n = re.length;
	for (let i = 1, j = 0; i < n; i++) {
		let bit = n >> 1;
		for (; j & bit; bit >>= 1) j ^= bit;
		j ^= bit;
		if (i < j) {
			const tr = re[i]; re[i] = re[j]; re[j] = tr;
			const ti = im[i]; im[i] = im[j]; im[j] = ti;
		}
	}
	for (let len = 2; len <= n; len <<= 1) {
		const ang = (inverse ? 2 : -2) * Math.PI / len;
		const wr = Math.cos(ang), wi = Math.sin(ang);
		for (let i = 0; i < n; i += len) {
			let cwr = 1, cwi = 0;
			const half = len >> 1;
			for (let k = 0; k < half; k++) {
				const a = i + k, b = i + k + half;
				const vr = re[b] * cwr - im[b] * cwi;
				const vi = re[b] * cwi + im[b] * cwr;
				re[b] = re[a] - vr; im[b] = im[a] - vi;
				re[a] = re[a] + vr; im[a] = im[a] + vi;
				const ncwr = cwr * wr - cwi * wi;
				cwi = cwr * wi + cwi * wr; cwr = ncwr;
			}
		}
	}
	if (inverse) { for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; } }
}

export function nextPow2(n: number): number { let p = 1; while (p < n) p <<= 1; return p; }

/** Roots of a real polynomial by Durand-Kerner. coeffs highest-degree first. */
export function polyRoots(coeffs: number[]): { re: number; im: number }[] {
	// strip leading zeros, normalise to monic
	let c = coeffs.slice();
	while (c.length > 1 && Math.abs(c[0]) < 1e-14) c.shift();
	const deg = c.length - 1;
	if (deg < 1) return [];
	const lead = c[0];
	const a = c.map((v) => v / lead); // monic, a[0] = 1
	// initial guesses on a circle, classic 0.4+0.9i spread
	const roots: { re: number; im: number }[] = [];
	let pr = 0.4, pi = 0.9;
	for (let k = 0; k < deg; k++) {
		roots.push({ re: pr, im: pi });
		const nr = pr * 0.4 - pi * 0.9, ni = pr * 0.9 + pi * 0.4;
		pr = nr; pi = ni;
	}
	const evalP = (zr: number, zi: number) => {
		let rr = a[0], ri = 0;
		for (let k = 1; k < a.length; k++) {
			const nr = rr * zr - ri * zi + a[k];
			const ni = rr * zi + ri * zr;
			rr = nr; ri = ni;
		}
		return { re: rr, im: ri };
	};
	for (let iter = 0; iter < 500; iter++) {
		let maxDelta = 0;
		for (let i = 0; i < deg; i++) {
			const p = evalP(roots[i].re, roots[i].im);
			// denominator = prod (zi - zj)
			let dr = 1, di = 0;
			for (let j = 0; j < deg; j++) {
				if (j === i) continue;
				const er = roots[i].re - roots[j].re, ei = roots[i].im - roots[j].im;
				const nr = dr * er - di * ei, ni = dr * ei + di * er;
				dr = nr; di = ni;
			}
			const den = dr * dr + di * di;
			const qr = (p.re * dr + p.im * di) / den;
			const qi = (p.im * dr - p.re * di) / den;
			roots[i].re -= qr; roots[i].im -= qi;
			maxDelta = Math.max(maxDelta, Math.abs(qr) + Math.abs(qi));
		}
		if (maxDelta < 1e-12) break;
	}
	return roots;
}

/** Magnitude spectrum (length nfft/2+1) of a real signal, zero-padded to nfft. */
export function rfftMag(signal: Float64Array | number[], nfft: number): Float64Array {
	const re = new Float64Array(nfft), im = new Float64Array(nfft);
	const n = Math.min(signal.length, nfft);
	for (let i = 0; i < n; i++) re[i] = signal[i];
	fft(re, im);
	const half = nfft / 2 + 1;
	const out = new Float64Array(half);
	for (let k = 0; k < half; k++) out[k] = Math.hypot(re[k], im[k]);
	return out;
}

/** Cepstral spectral envelope in dB. mag is length nfft/2+1. */
export function cepstralEnvelopeDb(mag: Float64Array, sr: number, lifterMs: number, nfft: number): Float64Array {
	const re = new Float64Array(nfft), im = new Float64Array(nfft);
	const half = mag.length;
	for (let k = 0; k < half; k++) re[k] = Math.log(mag[k] + 1e-12);
	for (let k = half; k < nfft; k++) re[k] = re[nfft - k]; // mirror
	fft(re, im, true); // cepstrum = ifft(log|.|)
	const nq = Math.floor(lifterMs / 1000 * sr);
	for (let k = nq; k <= nfft - nq; k++) { re[k] = 0; im[k] = 0; } // lifter keeps |q| < nq
	fft(re, im); // back to spectral envelope (ln units)
	const out = new Float64Array(half);
	const scale = 20 / Math.LN10;
	for (let k = 0; k < half; k++) out[k] = re[k] * scale;
	return out;
}

export function autocorr(signal: Float64Array | number[], maxLag: number): Float64Array {
	const r = new Float64Array(maxLag + 1);
	const n = signal.length;
	for (let lag = 0; lag <= maxLag; lag++) {
		let s = 0;
		for (let i = lag; i < n; i++) s += signal[i] * signal[i - lag];
		r[lag] = s;
	}
	return r;
}

/** Levinson-Durbin: returns LPC coeffs a[0..order] with a[0] = 1. */
export function levinson(r: Float64Array, order: number): number[] {
	const a = new Float64Array(order + 1); a[0] = 1;
	let err = r[0];
	if (err <= 0) return Array.from(a);
	for (let i = 1; i <= order; i++) {
		let acc = r[i];
		for (let j = 1; j < i; j++) acc += a[j] * r[i - j];
		const k = -acc / err;
		const prev = a.slice();
		for (let j = 1; j < i; j++) a[j] = prev[j] + k * prev[i - j];
		a[i] = k;
		err *= 1 - k * k;
		if (err <= 0) break;
	}
	return Array.from(a);
}

export function hann(n: number): Float64Array {
	const w = new Float64Array(n);
	for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
	return w;
}

/** Local maxima with topographic prominence >= minProm and spacing >= minDist samples. */
export function findPeaks(y: Float64Array, minProm: number, minDist = 1): { idx: number; prom: number }[] {
	const peaks: number[] = [];
	for (let i = 1; i < y.length - 1; i++) if (y[i] > y[i - 1] && y[i] > y[i + 1]) peaks.push(i);
	const out: { idx: number; prom: number }[] = [];
	for (const k of peaks) {
		// topographic prominence: descend each side to the higher of the two key cols
		let li = k, lmin = y[k];
		for (let i = k - 1; i >= 0; i--) { if (y[i] > y[k]) break; lmin = Math.min(lmin, y[i]); }
		let rmin = y[k];
		for (let i = k + 1; i < y.length; i++) { if (y[i] > y[k]) break; rmin = Math.min(rmin, y[i]); }
		const prom = y[k] - Math.max(lmin, rmin);
		if (prom >= minProm) out.push({ idx: k, prom });
	}
	// enforce min distance, keeping higher peaks
	out.sort((a, b) => y[b.idx] - y[a.idx]);
	const kept: { idx: number; prom: number }[] = [];
	for (const p of out) if (kept.every((q) => Math.abs(q.idx - p.idx) >= minDist)) kept.push(p);
	kept.sort((a, b) => a.idx - b.idx);
	return kept;
}

/** 2nd-order Butterworth lowpass, zero-phase (forward-backward). */
export function butterLowpassFiltfilt(x: Float64Array, cutoff: number, sr: number): Float64Array {
	const wc = Math.tan((Math.PI * cutoff) / sr);
	const k1 = Math.SQRT2 * wc, k2 = wc * wc;
	const a0 = 1 + k1 + k2;
	const b0 = k2 / a0, b1 = 2 * b0, b2 = b0;
	const a1 = (2 * (k2 - 1)) / a0, a2 = (1 - k1 + k2) / a0;
	const pass = (inp: Float64Array) => {
		const out = new Float64Array(inp.length);
		let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
		for (let i = 0; i < inp.length; i++) {
			const xi = inp[i];
			const yi = b0 * xi + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
			x2 = x1; x1 = xi; y2 = y1; y1 = yi; out[i] = yi;
		}
		return out;
	};
	const fwd = pass(x);
	fwd.reverse();
	const back = pass(fwd);
	back.reverse();
	return back;
}

/** Resample by anti-alias lowpass + linear interpolation (adequate for LPC analysis). */
export function resampleTo(x: Float64Array, srcSr: number, dstSr: number): Float64Array {
	const lp = dstSr < srcSr ? butterLowpassFiltfilt(x, 0.45 * dstSr, srcSr) : x;
	const dstLen = Math.floor((x.length * dstSr) / srcSr);
	const out = new Float64Array(dstLen);
	const step = srcSr / dstSr;
	for (let i = 0; i < dstLen; i++) {
		const pos = i * step, i0 = Math.floor(pos), frac = pos - i0;
		out[i] = i0 + 1 < lp.length ? lp[i0] * (1 - frac) + lp[i0 + 1] * frac : lp[i0] || 0;
	}
	return out;
}

/** Analytic-signal envelope (|Hilbert|). */
export function hilbertEnvelope(x: Float64Array): Float64Array {
	const n = x.length, N = nextPow2(n);
	const re = new Float64Array(N), im = new Float64Array(N);
	for (let i = 0; i < n; i++) re[i] = x[i];
	fft(re, im);
	const half = N >> 1;
	for (let k = 1; k < half; k++) { re[k] *= 2; im[k] *= 2; }
	for (let k = half + 1; k < N; k++) { re[k] = 0; im[k] = 0; }
	fft(re, im, true);
	const env = new Float64Array(n);
	for (let i = 0; i < n; i++) env[i] = Math.hypot(re[i], im[i]);
	return env;
}

/** Welch PSD (Hann, 50% overlap). nperseg must be a power of two. */
export function welchPSD(x: Float64Array, sr: number, nperseg = 2048): { freqs: Float64Array; psd: Float64Array } {
	const hop = nperseg >> 1, w = hann(nperseg), half = nperseg / 2 + 1;
	let winNorm = 0; for (let i = 0; i < nperseg; i++) winNorm += w[i] * w[i];
	const psd = new Float64Array(half); let nseg = 0;
	for (let s = 0; s + nperseg <= x.length; s += hop) {
		const re = new Float64Array(nperseg), im = new Float64Array(nperseg);
		for (let i = 0; i < nperseg; i++) re[i] = x[s + i] * w[i];
		fft(re, im);
		for (let k = 0; k < half; k++) psd[k] += re[k] * re[k] + im[k] * im[k];
		nseg++;
	}
	const scale = 1 / (sr * winNorm);
	for (let k = 0; k < half; k++) { psd[k] = (psd[k] / Math.max(nseg, 1)) * scale; if (k > 0 && k < half - 1) psd[k] *= 2; }
	const freqs = new Float64Array(half);
	for (let k = 0; k < half; k++) freqs[k] = (k * sr) / nperseg;
	return { freqs, psd };
}

/** Local maxima at or above a height threshold, enforcing min spacing (keep higher). */
export function findPeaksHeight(y: Float64Array, height: number, minDist: number): number[] {
	const cand: number[] = [];
	for (let i = 1; i < y.length - 1; i++) if (y[i] >= height && y[i] > y[i - 1] && y[i] > y[i + 1]) cand.push(i);
	cand.sort((a, b) => y[b] - y[a]);
	const kept: number[] = [];
	for (const k of cand) if (kept.every((q) => Math.abs(q - k) >= minDist)) kept.push(k);
	kept.sort((a, b) => a - b);
	return kept;
}

export function mean(a: ArrayLike<number>): number { let s = 0; for (let i = 0; i < a.length; i++) s += a[i]; return s / a.length; }
export function std(a: ArrayLike<number>): number { const m = mean(a); let s = 0; for (let i = 0; i < a.length; i++) s += (a[i] - m) ** 2; return Math.sqrt(s / a.length); }
export function median(a: number[]): number { const s = [...a].sort((x, y) => x - y); const h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; }
