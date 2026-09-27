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

/**
 * The in-buffer proxy SNR: the [100, 4000] Hz signal band against a 5-10 kHz
 * noise band inside the same sample. Not a room SNR; that is measured across
 * two buffers in `readiness.ts` and the two thresholds are not transferable.
 *
 * Returns `null` when the question cannot be asked (item 1.4b).
 */
function snrDb(y: Float64Array, sr: number): number | null {
	const { freqs, psd } = welchPSD(y, sr, 2048);
	let sigSum = 0, sigN = 0; const noise: number[] = [];
	const hiNoise = Math.min(sr / 2 - 200, 10000);
	for (let k = 0; k < freqs.length; k++) {
		if (freqs[k] >= 100 && freqs[k] <= 4000) { sigSum += psd[k]; sigN++; }
		if (freqs[k] >= 5000 && freqs[k] <= hiNoise) noise.push(psd[k]);
	}
	// ITEM 1.4b. This line read `if (!noise.length) return 60;`, and the 60 was
	// not a harmless fallback. It was a SILENT PASS: 60 clears c8's 12 dB
	// threshold unconditionally, and the noise band collapses to empty whenever
	// `hiNoise` falls below 5000, which is whenever `sr < 10400`. So at any
	// sample rate under 10.4 kHz the eight-condition gate was really a
	// seven-condition gate, and nothing said so. `live.ts` requests 48 kHz and
	// falls back to the device default, so that was reachable, not theoretical.
	// Abstaining obliges every caller to handle the absence instead.
	if (!noise.length) return null;
	// Same family, same treatment: no bins in the signal band would make
	// `sigSum / sigN` a NaN, which propagates into a comparison as a silent
	// false. There is no honest number here either.
	if (!sigN) return null;
	return 10 * Math.log10((sigSum / sigN + 1e-20) / (median(noise) + 1e-20));
}

export interface DetectorResult {
	/**
	 * Nothing that could be checked failed. Item 1.4b widened this from "every
	 * condition passed": a condition that could not be evaluated does not
	 * block, because refusing every capture forever on a device whose sample
	 * rate collapses the noise band is not a product. The difference from the
	 * 60 this replaced is DISCLOSURE, not permissiveness: what could not be
	 * checked is named in `undecided` rather than silently assumed to pass.
	 * Same shape as plausibility's `unchecked` (Kimi, 2026-07-11): a valid
	 * outcome, not an error.
	 */
	accept: boolean; nPulses: number; rateHz: number | null; cv: number | null;
	decay: number | null; flatness: number;
	/** `null` when the noise band could not be formed at this sample rate. */
	snrDb: number | null;
	/** Conditions evaluated and failed. Disjoint from `undecided`. */
	failed: string[];
	/**
	 * Conditions that could not be evaluated at all on this sample. A name in
	 * here must NEVER be reported to a singer as a fault: it says the
	 * instrument could not answer, not that the singer did something wrong.
	 */
	undecided: string[];
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
	// Recalibrated 2026-07-01 on Dann's ACCEPT, from live iMac console evidence:
	// genuine M0 fry read CV 0.28-1.16 tick to tick because the pulse-picker misses
	// weak pulses at real-room levels, doubling an interval and inflating the
	// statistic; real M0 is also quasi-periodic with period-doubling. The load-bearing
	// modal discriminator is c4 (decay), which passes comfortably. Spec amendment
	// pending (engine spec §3, c5: 0.40 -> 1.0); a median-based dispersion measure
	// is the principled future fix, for the Kimi brief.
	const c5 = !isNaN(cv) && cv <= 1.0;
	const c6 = peaks.length >= 8;
	const c7 = sf <= 0.3;
	// Recalibrated 2026-07-01 on Dann's ACCEPT, from live iMac console evidence:
	// an excellent fry at 30 cm on an iMac in a normal room reads 12.4-16.5 dB by
	// this ratio; the spec's 20 dB was set against idealized material. Spec
	// amendment pending (engine spec §3, c8: 20 -> 12 dB). Confidence is graded on
	// SNR in analyze.ts rather than gated here.
	// `null` = undecidable, and it is deliberately not `false` (item 1.4b).
	const c8 = snr === null ? null : snr >= 12;
	const conds: Record<string, boolean | null> = { c3_ipi: c3, c4_decay: c4, c5_cv: c5, c6_count: c6, c7_flat: c7, c8_snr: c8 };
	const entries = Object.entries(conds);
	return {
		accept: entries.every(([, v]) => v !== false),
		nPulses: peaks.length, rateHz: isNaN(rate) ? null : rate, cv: isNaN(cv) ? null : cv,
		decay: isNaN(decay) ? null : decay, flatness: sf, snrDb: snr,
		failed: entries.filter(([, v]) => v === false).map(([k]) => k),
		undecided: entries.filter(([, v]) => v === null).map(([k]) => k),
	};
}
