/**
 * The agnostic picker (N.200 Step 3, `docs/sessions/brief-code-n200-voice-as-it-is_r3_2026-11-14.md`;
 * the ruling is `docs/memory/PRODUCT.md`, "ILYA ENCOUNTERS THE VOICE AS IT IS"). Read when `?measure=open` is in the address.
 *
 * It reports the resonances the voice presents. It takes no vowel, no voice type, and no table of expected values: nothing but
 * the physical limits of a human tract and of the instrument reaches into the choice.
 *
 * ALLOWED LIMITS (physical, voice-agnostic), and nothing else:
 *   - fR1 is below fR2, and fR2 lies above fR1 by at least the instrument's resolution (`RESOLUTION_HZ`);
 *   - the 150 Hz floor, and the 1200 Hz top of the fR1 range (`F1R`, as in `extract.ts`), the 3000 Hz fR2 ceiling (`F2_CEILING`);
 *   - a pole's bandwidth between `MIN_BW` and `MAX_BW` (`closed-phase.ts`);
 *   - a cap on how many resonances a tract shows in the band: `COMB_MAX` (a 17 cm tract has about three resonances under 3 kHz; more
 *     than about six 3 dB envelope peaks under 3.5 kHz means the envelope is showing the source's harmonics, not the tract).
 * NOT ALLOWED: any per-vowel or per-type centre, band, or nearest-to pick.
 *
 * THE PICKER
 *   1. Candidates come from two estimators: the closed-phase fit's poles (bandwidth within the limits), and the cepstral envelope's peaks.
 *   2. A resonance qualifies when both see it: a qualifying pole with an envelope peak within `TOL_MATCH` (relative to the pole; for fR1,
 *      `TOL_MATCH_F1`, wider because the source pulls the envelope's peak off a low resonance), the
 *      peak needing only `PROM_MATCHED` dB of prominence, less than `PROM_DB`. This keeps a weak fR2 on a rounded vowel and rejects the
 *      closed-phase fit's spare pole, which has no envelope peak under it.
 *   3. fR1 is the lowest qualifying resonance in 150 to 1200 Hz (its value is the pole's, from the closed phase, as before). fR2 is the
 *      lowest envelope candidate above fR1 by at least the resolution, its value the envelope peak's, as before. A candidate is an
 *      envelope peak of `PROM_DB` dB, or a matched peak of `PROM_MATCHED` dB. When the lowest candidate is seen by one estimator only,
 *      fR2 is that peak marked single-estimator, never the next resonance up: a missing fR2 is absent, never R3.
 *   4. When the closed phase abstains or no pole qualifies, fR1 is the lowest `PROM_DB` envelope peak within `ENV_WITHIN_DB` dB of the
 *      strongest peak in the band, marked single-estimator. (The source puts a peak near 200 Hz, 8 to 15 dB under the strongest, on
 *      [e], [o], and [ɑ].)
 *
 * RESOLUTION_HZ is derived, not chosen: the envelope is the cepstrum liftered at `LIFTER_MS` (8 ms), which smooths away structure
 * finer than 1 / 0.008 s = 125 Hz. Two peaks closer than that are one peak to this instrument. The 80 Hz margin `extract.ts` uses
 * is under it.
 *
 * The thresholds are the brief's illustrative values, tuned once on `fry-synth.ts` (the report says how).
 */
import { findPeaks } from './dsp';
import { closedPhaseResonances, MIN_BW, MAX_BW, type ClosedPhaseResult } from './closed-phase';
import { ltasEnvExport, parabolic, type ExtractResult } from './extract';

export const LIFTER_MS = 8;
export const RESOLUTION_HZ = 1000 / LIFTER_MS;
export const F1R: [number, number] = [150, 1200];
export const F2_CEILING = 3000;
export const PROM_DB = 3;
export const PROM_MATCHED = 1.5;
export const TOL_MATCH = 0.12;
/**
 * fR1's match has a second, wider arm: the source's open phase puts a dip near a bass [i] or [u] fR1 and pulls the envelope's peak off
 * the resonance (`closed-phase.ts` says why), by 14% in a case the browser run found. A pole with no peak within `TOL_MATCH` still
 * matches a peak within `TOL_MATCH_F1` (30%, the set-aside tolerance the shipped picker has used since 2026-09-30, `extract.ts`,
 * `CLOSED_PHASE_AGREE`) when that peak is within `ENV_WITHIN_DB` of the strongest in the band. The strength condition is the one that
 * rejects the source's own peak near 200 Hz (8 to 15 dB under the strongest): without it, a 30% match let a spurious low pole claim
 * fR1 on a treble [ɑ].
 */
export const TOL_MATCH_F1 = 0.30;
export const ENV_WITHIN_DB = 8;
export const COMB_MAX = 6;
/** A rival for "lowest" this close in strength (dB of prominence) to the chosen fR1 peak makes the reading ambiguous. */
export const RUNNER_UP_DB = 3;

export interface OpenEvidence {
	/** Which estimators saw the chosen resonance: both, or the envelope alone. Null when there is no such resonance. */
	fR1: 'both' | 'single' | null;
	fR2: 'both' | 'single' | null;
	/** 3 dB envelope peaks under 3500 Hz. More than `COMB_MAX` means the envelope shows the source. */
	comb: number;
	/** An envelope peak below the chosen fR1 peak, within `RUNNER_UP_DB` of its prominence. */
	runnerUp: boolean;
	/** The next envelope peak above fR2, and whether a valley deeper than `PROM_DB` and a gap of at least the resolution separate it (R3 resolved). Null when there is none. */
	r3: { f: number; resolved: boolean } | null;
	/** True when a peak above fR2 is not resolved from it: the cluster is merged, so fR2 is no better than marginal. */
	f2Merged: boolean;
	/** The closed phase abstained (too few clean stretches), so there were no poles. */
	closedPhaseAbstained: boolean;
	/** Poles in 150 to 3000 Hz with their bandwidths, and the matched peak for those that qualified. */
	poles: { f: number; bw: number; peak: number | null }[];
}

interface Peak { f: number; prom: number; level: number; idx: number }

export function extractOpen(y: Float64Array, sr: number, trace?: { closedPhase?: ClosedPhaseResult | null; envelopePeaks?: { f: number; promDb: number }[]; envelopeF1?: number | null; closedPhaseF1?: number | null; closedPhaseSetAside?: boolean; chosen?: ExtractResult }): ExtractResult {
	const { env, freqs } = ltasEnvExport(y, sr);
	const peaks: Peak[] = findPeaks(env, PROM_MATCHED)
		.filter((p) => freqs[p.idx] >= F1R[0] && freqs[p.idx] <= 3500)
		.map((p) => ({ f: parabolic(env, freqs, p.idx), prom: p.prom, level: env[p.idx], idx: p.idx }));
	const cp = closedPhaseResonances(y, sr);
	const poles = (cp?.resonances ?? []).filter((r) => r.f >= F1R[0] && r.f <= F2_CEILING && r.bw >= MIN_BW && r.bw < MAX_BW);

	// A pole is matched when an envelope peak lies within TOL_MATCH of it.
	const matchOf = (f: number, tol: number = TOL_MATCH, minLevel = -Infinity): Peak | null => {
		let best: Peak | null = null;
		for (const p of peaks) if (p.level >= minLevel && Math.abs(p.f - f) / f <= tol && (!best || Math.abs(p.f - f) < Math.abs(best.f - f))) best = p;
		return best;
	};
	const dump = poles.map((r) => ({ f: r.f, bw: r.bw, peak: matchOf(r.f)?.f ?? null }));
	const inBand = peaks.filter((p) => p.f <= F2_CEILING);
	const strongest = inBand.length ? Math.max(...inBand.map((p) => p.level)) : -Infinity;
	const comb = peaks.filter((p) => p.prom >= PROM_DB).length;

	let f1: number | null = null, f1Evidence: 'both' | 'single' | null = null, f1Peak: Peak | null = null;
	for (const r of poles) {
		if (r.f > F1R[1]) break;
		const m = matchOf(r.f) ?? matchOf(r.f, TOL_MATCH_F1, strongest - ENV_WITHIN_DB);
		if (m) { f1 = r.f; f1Evidence = 'both'; f1Peak = m; break; }
	}
	const poleSetAside = f1 === null && poles.some((r) => r.f <= F1R[1]);
	if (f1 === null) {
		const c = peaks.filter((p) => p.f <= F1R[1] && p.prom >= PROM_DB && p.level >= strongest - ENV_WITHIN_DB);
		if (c.length) { f1Peak = c[0]; f1 = c[0].f; f1Evidence = 'single'; }
	}

	let f2: number | null = null, f2Evidence: 'both' | 'single' | null = null, f2Prom = 0, f2Peak: Peak | null = null;
	if (f1 !== null) {
		const above = peaks.filter((p) => p.f >= f1! + RESOLUTION_HZ && p.f <= F2_CEILING);
		for (const p of above) {
			const matched = poles.some((r) => Math.abs(p.f - r.f) / r.f <= TOL_MATCH);
			if (p.prom >= PROM_DB || matched) {
				f2 = p.f; f2Prom = p.prom; f2Peak = p; f2Evidence = matched ? 'both' : 'single';
				break; // the lowest candidate: if it is not fR2 then fR2 is not claimed from higher up
			}
		}
	}

	// R3, and whether it is resolved from fR2: a valley deeper than PROM_DB, and a gap of at least the resolution.
	let r3: OpenEvidence['r3'] = null, f2Merged = false;
	if (f2Peak) {
		const next = peaks.find((p) => p.f > f2Peak!.f + 1 && p.prom >= PROM_DB && p.f <= 3500);
		if (next) {
			const lo = Math.min(f2Peak.idx, next.idx), hi = Math.max(f2Peak.idx, next.idx);
			let valley = Infinity;
			for (let k = lo; k <= hi; k++) valley = Math.min(valley, env[k]);
			const resolved = next.f - f2Peak.f >= RESOLUTION_HZ && Math.min(f2Peak.level, next.level) - valley > PROM_DB;
			r3 = { f: next.f, resolved };
			f2Merged = !resolved;
		}
	}

	// A runner-up for fR1: a peak BELOW the chosen one (a rival for "lowest") nearly as prominent as it. A peak above is fR2's, not a rival.
	const runnerUp = !!f1Peak && peaks.some((p) => p.f < f1Peak!.f - RESOLUTION_HZ && p.prom >= f1Peak!.prom - RUNNER_UP_DB);

	const evidence: OpenEvidence = { fR1: f1Evidence, fR2: f2Evidence, comb, runnerUp, r3, f2Merged, closedPhaseAbstained: cp === null, poles: dump };
	const out: ExtractResult = { f1, f2, f2Prom, method: 'open', evidence };
	if (trace) Object.assign(trace, {
		envelopePeaks: peaks.map((p) => ({ f: p.f, promDb: p.prom })), envelopeF1: f1Peak?.f ?? null, closedPhase: cp,
		closedPhaseF1: poles.find((r) => r.f <= F1R[1])?.f ?? null, closedPhaseSetAside: poleSetAside, chosen: out,
	});
	return out;
}
