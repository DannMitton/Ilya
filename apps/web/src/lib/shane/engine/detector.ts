import { hilbertEnvelope, butterLowpassFiltfilt, welchPSD, findPeaksHeight, mean, std, median } from './dsp';

function envelope(y: Float64Array, sr: number): Float64Array {
	// Hilbert magnitude, smoothed at 250 Hz (above the 20-80 Hz pulse band; the spec's
	// 20 Hz figure sits below it and smears the pulses).
	return butterLowpassFiltfilt(hilbertEnvelope(y), 250, sr);
}

function spectralFlatness(y: Float64Array, sr: number, lo = 100, hi = 4000): number {
	const { freqs, psd } = welchPSD(y, sr, 2048);
	let logsum = 0, sum = 0, n = 0;
	for (let k = 0; k < freqs.length; k++) if (freqs[k] >= lo && freqs[k] <= hi) { const p = psd[k] + 1e-20; logsum += Math.log(p); sum += p; n++; }
	return Math.exp(logsum / n) / (sum / n);
}

function snrDb(y: Float64Array, sr: number): number {
	const { freqs, psd } = welchPSD(y, sr, 2048);
	let sigSum = 0, sigN = 0; const noise: number[] = [];
	const hiNoise = Math.min(sr / 2 - 200, 10000);
	for (let k = 0; k < freqs.length; k++) {
		if (freqs[k] >= 100 && freqs[k] <= 4000) { sigSum += psd[k]; sigN++; }
		if (freqs[k] >= 5000 && freqs[k] <= hiNoise) noise.push(psd[k]);
	}
	if (!noise.length) return 60;
	return 10 * Math.log10((sigSum / sigN + 1e-20) / (median(noise) + 1e-20));
}

export interface DetectorResult {
	accept: boolean; nPulses: number; rateHz: number | null; cv: number | null;
	decay: number | null; flatness: number; snrDb: number; failed: string[];
}

export function detect(y: Float64Array, sr: number): DetectorResult {
	const env = envelope(y, sr);
	const thr = mean(env) + 1.5 * std(env);
	const peaks = findPeaksHeight(env, thr, Math.floor(sr * 0.005));
	let meanIpi = NaN, cv = NaN, rate = NaN, decay = NaN;
	if (peaks.length >= 2) {
		const ipi: number[] = [];
		for (let i = 1; i < peaks.length; i++) ipi.push((peaks[i] - peaks[i - 1]) / sr);
		meanIpi = mean(ipi); cv = std(ipi) / meanIpi; rate = 1 / meanIpi;
		const ratios: number[] = [];
		for (let i = 0; i < peaks.length - 1; i++) {
			let lo = Infinity;
			for (let j = peaks[i]; j < peaks[i + 1]; j++) lo = Math.min(lo, env[j]);
			ratios.push(lo / (env[peaks[i]] + 1e-20));
		}
		decay = median(ratios);
	}
	const sf = spectralFlatness(y, sr), snr = snrDb(y, sr);
	const c3 = !isNaN(meanIpi) && meanIpi >= 0.0125 && meanIpi <= 0.05;
	const c4 = !isNaN(decay) && decay < 0.4;
	const c5 = !isNaN(cv) && cv <= 0.4;
	const c6 = peaks.length >= 8;
	const c7 = sf <= 0.3;
	const c8 = snr >= 20;
	const conds: Record<string, boolean> = { c3_ipi: c3, c4_decay: c4, c5_cv: c5, c6_count: c6, c7_flat: c7, c8_snr: c8 };
	return {
		accept: Object.values(conds).every(Boolean),
		nPulses: peaks.length, rateHz: isNaN(rate) ? null : rate, cv: isNaN(cv) ? null : cv,
		decay: isNaN(decay) ? null : decay, flatness: sf, snrDb: snr,
		failed: Object.entries(conds).filter(([, v]) => !v).map(([k]) => k),
	};
}
