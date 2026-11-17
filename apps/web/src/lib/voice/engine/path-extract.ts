/**
 * The path picker (N.200 plan step P2, `docs/sessions/brief-code-n200-path-picker_r3_2026-11-16.md`, section 3.2). Read when `?measure=path`
 * is in the address. It reads each take from the take alone: no vowel, no voice type, and no table of anyone's values reach it.
 *
 * THE METHOD, from the published descriptions (Dann, 2026-11-16 16:46: build from them, never from Praat's code):
 *  - Burg LPC at each ceiling of a ladder (`burg.ts`), the first three poles of each frame forming three formant tracks.
 *  - Weenink (2015), Eq. 3, p. 3: each track is fitted with Legendre polynomials, and W = (s²ₚ / k)^t · (χ² / d); the lowest W is the path.
 *    The paper gives t only as "somewhat larger than 1", gives the order as "three or four", and does not define d.
 *  - Weenink (2023) gives the ladder formula, middle × exp(j × step).
 * Not opened, and not copied from: Praat's source, Praat's repository, and parselmouth's source.
 *
 * ILYA'S CHOICES, each a DESK DEFAULT of the brief unless it says otherwise:
 *  - LADDER L15: middle 4583 Hz, step 0.0605, j from -7 to +7: 15 ceilings, 3000 to 7000 Hz (the ladder P0b and the fidelity run measured). One
 *    ladder serves every voice, because no voice type may reach into the measurement. L9 (Weenink 2023's defaults: middle 5500, step 0.05,
 *    j from -4 to +4, 4503 to 6718 Hz) is reported beside it and never the default.
 *  - m = 3 Legendre terms (P0, P1, P2, unnormalised, time scaled to -1 to 1). Whether the paper's "order 3" means three terms is NOT ESTABLISHED.
 *  - t = 1.25. d = the sum over the three tracks of (frames present - m). Three tracks. k = 9 (three tracks of three terms; it scales every
 *    ceiling's W alike, so it never changes which ceiling wins).
 *  - A frame lacking a formant is skipped for that track only (paper p. 2). The fit is by least squares weighted by 1/b, b the pole's bandwidth.
 *  - B_FLOOR_HZ = 20 (the lane's choice: a pole near the unit circle has a bandwidth of a few hertz and would otherwise carry all the weight;
 *    20 Hz is under the 25 Hz `MIN_BW` the closed-phase module treats as a steady tone, and about the resolution of a 50 ms window).
 *  - MIN_TRACK_SHARE = 0.5 (the lane's choice): a ceiling is set aside when any of its three tracks is present in fewer than half of the frames,
 *    or has no more frames than terms. When every ceiling is set aside the picker returns no fR1.
 *  - The reading is the median of the winning path's fR1 and fR2 frames over the stretch it is given (the guard's, `analyze.ts`).
 *
 * THE CROSS-CHECK has no prior (`crossCheck`). Every tolerance is relative to the path's value. It never calls `closedPhaseF1`, which picks by a prior.
 *
 * LANE 64 OPTIONS (switch-on brief r2, Steps 1 and 4, Fable's fixes 1 and 5), each a field of `PathOptions`, so the scoring tool can run every
 * combination. Step 1 built them off; Step 4 turned R125, DP, and P3 ON by default (`PATH_DEFAULTS`) and left the weighting off. With every
 * one set false the picker is byte-identical to lane 62's, which is what the scoring tool's `off` combination does (`tools/n200-score/variants.ts`):
 *  - r125: keep fR2 only when it stands at least `RESOLUTION_HZ` above fR1 (the envelope cannot separate two peaks closer than that).
 *  - dp: the envelope peak that supports fR1 is looked for in every case, and is never the peak that supports fR2 (a duplicate pole is not a second formant).
 *  - p3: when the second track fails r125 or dp, the third track is offered to the same tests, and `PathEvidence.fR2Track` records which track gave fR2.
 *  - sqrtWeight: `fitTrack` weights each row by 1/sqrt(b) instead of 1/b.
 */
import { burgFrames, type BurgFrame } from './burg';
import { findPeaks } from './dsp';
import { closedPhaseResonances, MIN_BW, MAX_BW, type ClosedPhaseResult, type Resonance } from './closed-phase';
import { ltasEnvExport, parabolic, type ExtractResult, type ExtractTrace } from './extract';
import { PROM_DB, F1R, RESOLUTION_HZ } from './open-extract';

/** Weenink (2023)'s ladder: middle × exp(j × step), j from -jMax to +jMax. */
export function ladder(middle: number, step: number, jMax: number): number[] {
	const out: number[] = [];
	for (let j = -jMax; j <= jMax; j++) out.push(middle * Math.exp(j * step));
	return out;
}
export const L15 = ladder(4583, 0.0605, 7);
export const L9 = ladder(5500, 0.05, 4);

/**
 * The path picker's defaults, chosen by section 3A of `docs/sessions/brief-code-n200-switch-on-lane64_r2_2026-11-17.md`: ladder L15, R125 + DP + P3 on, weighting off.
 * Evidence: the third synthetic set, `docs/sessions/report-code-n200-lane64-step3_r1_2026-11-17.md` (tables: `n200-lane64-step3-tables-third_2026-11-17.md`):
 * 580 of 600 takes in both bars against 535 with every option off, fR2 changed on none of the 542 takes whose track-2 fR2 was already within 12 percent,
 * all 46 readings P3 promoted within 12 percent, every voice type at 80 percent or more; and the desk's run of Dann's takes, 2026-11-17, held outside the
 * repository: 12 of 13 in both bars (as for every L15 variant), no take lost, both [u] takes kept, and R125 changes none of the 12 readings.
 * The weighting stays off: it moves 27.3 percent of the ceilings on the third set and no bar was set for it. A caller passes an option as `false` to turn it off.
 */
export const PATH_DEFAULTS = { r125: true, dp: true, p3: true, sqrtWeight: false } as const;

export const T_WEIGHT = 1.25;
export const TERMS = 3;
export const B_FLOOR_HZ = 20;
export const MIN_TRACK_SHARE = 0.5;
export const TRACKS = 3;
/** The cross-check's tolerances, relative to the path's value: T1 for fR1 (the tree's own 0.30, `extract.ts`), T2 for fR2 (a DESK DEFAULT taken from T1). */
export const T1 = 0.30, T2 = 0.30;
/** The envelope peaks the cross-check reads are kept from this range, in Hz (as `open-extract.ts` keeps them). */
const PEAK_RANGE: [number, number] = [150, 3500];

export type PathCase = 'a' | 'b' | 'c' | 'd';
export type PathReason = 'no-fr1' | 'out-of-range' | 'no-peak';

export interface PathEvidence {
	/** The fR1 cross-check's case: a, closed phase reads and agrees; b, reads and disagrees; c, abstains and the envelope agrees; d, see `reason`. */
	case: PathCase;
	reason?: PathReason;
	/** Whether the path's fR2 was kept (an envelope peak within T2 of it), or the check was off and it was present. */
	fR2Kept: boolean;
	f2Check: boolean;
	/** What the path found, before the cross-check. `ExtractResult.f2` is null when fR2 was not kept. */
	pathF1: number | null;
	pathF2: number | null;
	pathF3: number | null;
	/** The chosen ceiling in Hz, and the ladder with W for each ceiling (null where it was set aside). */
	ceiling: number | null;
	ceilings: number[];
	w: (number | null)[];
	setAside: number;
	frames: number;
	/** Which track gave the fR2 that was kept: 2 (the usual), or 3 when `p3` promoted it; null when fR2 was not kept. */
	fR2Track: 2 | 3 | null;
	/** The winning path's fR1 and fR2 in the first and second half of its frames. */
	halves: { f1: [number | null, number | null]; f2: [number | null, number | null] };
}

export interface PathOptions {
	ladder?: number[];
	t?: number;
	terms?: number;
	bFloor?: number;
	stepS?: number;
	/** Whether an envelope peak must stand under fR2 for it to be kept. Default true. */
	f2Check?: boolean;
	/** Keep fR2 only when `pathF2 - pathF1 >= RESOLUTION_HZ`. Default on (`PATH_DEFAULTS`). Acts inside the fR2 check, so not when `f2Check` is false. */
	r125?: boolean;
	/** Look for fR1's envelope peak in every case and exclude it as fR2's peak in every case. Default on (`PATH_DEFAULTS`). */
	dp?: boolean;
	/** When track 2 fails `r125` or `dp`, offer track 3 to the same tests. Never fires alone: it needs `r125` or `dp`. Default on (`PATH_DEFAULTS`). */
	p3?: boolean;
	/** Weight each row of `fitTrack` by 1/sqrt(b) instead of 1/b. Default off (`PATH_DEFAULTS`). */
	sqrtWeight?: boolean;
}

interface Pt { t: number; f: number; b: number }
export interface CeilingTracks { ceiling: number; frames: number; t0: number; t1: number; tracks: Pt[][] }

/** Burg at every ceiling of the ladder, and the first three poles of each frame as three tracks. The expensive part: do it once per take. */
export function pathTracks(y: Float64Array, sr: number, opts: PathOptions = {}): CeilingTracks[] {
	return (opts.ladder ?? L15).map((ceiling) => {
		const frames: BurgFrame[] = burgFrames(y, sr, ceiling, { stepS: opts.stepS });
		const tracks: Pt[][] = [[], [], []];
		for (const fr of frames) for (let j = 0; j < TRACKS; j++) if (fr.poles.length > j) tracks[j].push({ t: fr.t, f: fr.poles[j].f, b: fr.poles[j].bw });
		return { ceiling, frames: frames.length, t0: frames.length ? frames[0].t : 0, t1: frames.length ? frames[frames.length - 1].t : 0, tracks };
	});
}

/** Unnormalised Legendre polynomials P0 to P3 at x. */
function legendre(x: number, terms: number): number[] {
	const all = [1, x, (3 * x * x - 1) / 2, (5 * x * x * x - 3 * x) / 2];
	return all.slice(0, terms);
}

/** Gauss-Jordan inverse of a small symmetric matrix; null when singular. */
function invert(a: number[][]): number[][] | null {
	const n = a.length, m = a.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
	for (let c = 0; c < n; c++) {
		let p = c;
		for (let r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[p][c])) p = r;
		if (Math.abs(m[p][c]) < 1e-12) return null;
		[m[c], m[p]] = [m[p], m[c]];
		const d = m[c][c];
		for (let k = 0; k < 2 * n; k++) m[c][k] /= d;
		for (let r = 0; r < n; r++) if (r !== c) { const f = m[r][c]; if (f) for (let k = 0; k < 2 * n; k++) m[r][k] -= f * m[c][k]; }
	}
	return m.map((r) => r.slice(n));
}

/** One track fitted with Legendre terms by least squares weighted 1/b: χ², and the sum of the coefficients' variances (the covariance matrix's trace). */
function fitTrack(pts: Pt[], t0: number, t1: number, terms: number, bFloor: number, sqrtWeight = false): { chi2: number; varSum: number } | null {
	if (pts.length <= terms) return null;
	const half = (t1 - t0) / 2 || 1, mid = (t0 + t1) / 2;
	const ata = Array.from({ length: terms }, () => new Array<number>(terms).fill(0)), atb = new Array<number>(terms).fill(0);
	const rows = pts.map((p) => {
		const b = Math.max(p.b, bFloor), div = sqrtWeight ? Math.sqrt(b) : b, phi = legendre((p.t - mid) / half, terms).map((v) => v / div);
		for (let i = 0; i < terms; i++) { atb[i] += phi[i] * (p.f / div); for (let j = 0; j < terms; j++) ata[i][j] += phi[i] * phi[j]; }
		return { phi, y: p.f / div };
	});
	const inv = invert(ata);
	if (!inv) return null;
	const c = inv.map((r) => r.reduce((s, v, j) => s + v * atb[j], 0));
	let chi2 = 0;
	for (const r of rows) { const e = r.y - r.phi.reduce((s, v, i) => s + v * c[i], 0); chi2 += e * e; }
	return { chi2, varSum: inv.reduce((s, r, i) => s + r[i], 0) };
}

/** W of Weenink (2015) Eq. 3 for each ceiling, or null where the ceiling is set aside. Re-scorable from stored tracks without running Burg again. */
export function scoreCeilings(all: CeilingTracks[], opts: PathOptions = {}): (number | null)[] {
	const t = opts.t ?? T_WEIGHT, terms = opts.terms ?? TERMS, bFloor = opts.bFloor ?? B_FLOOR_HZ, k = TRACKS * terms;
	return all.map((c) => {
		if (!c.frames) return null;
		let chi2 = 0, s2 = 0, d = 0;
		for (const tr of c.tracks) {
			if (tr.length < MIN_TRACK_SHARE * c.frames) return null;
			const fit = fitTrack(tr, c.t0, c.t1, terms, bFloor, opts.sqrtWeight ?? PATH_DEFAULTS.sqrtWeight);
			if (!fit) return null;
			chi2 += fit.chi2; s2 += fit.varSum; d += tr.length - terms;
		}
		if (d <= 0) return null;
		return Math.pow(s2 / k, t) * (chi2 / d);
	});
}

const med = (v: number[]): number | null => {
	if (!v.length) return null;
	const s = [...v].sort((a, b) => a - b), h = s.length >> 1;
	return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
};

/** `track` and `f2` appear only when `p3` promoted track 3: `f2` is then the value to report in place of the path's second track. */
export interface CrossCheck { case: PathCase; reason?: PathReason; fR2Kept: boolean; f2Prom: number; track?: 3; f2?: number }
/** The fR2 options of the cross-check (`PathOptions`), and the path's third track for `p3`. */
export interface Fr2Options { r125?: boolean; dp?: boolean; p3?: boolean; pathF3?: number | null }
export interface PeakLite { f: number; prom: number }

/**
 * The cross-check with no prior. `closed` is the closed phase's qualifying poles (150 to 1200 Hz, `MIN_BW <= bw < MAX_BW`), or null when it
 * abstains (the module returned null, or no pole qualifies). `peaks` are the envelope's peaks, 150 to 3500 Hz.
 *   fR1: (d, no-fr1) the path has none; (d, out-of-range) it lies outside 150 to 1200 Hz, so the reading stands but is unsteady;
 *        (a) closed phase reads and a qualifying pole lies within T1 of it: stands; (b) reads and none does: unsteady;
 *        (c) abstains and an envelope peak lies within T1: stands, read by one estimator; (d, no-peak) abstains and none does: unsteady.
 *   fR2: runs whenever the path has an fR1. An envelope peak within T2 of the path's fR2 keeps it (in case c, a peak other than fR1's);
 *        otherwise, or when the path has no fR2, it is absent. fR2 never makes a take unsteady.
 */
export function crossCheck(pathF1: number | null, pathF2: number | null, closed: Resonance[] | null, peaks: PeakLite[], f2Check = true, fr2: Fr2Options = {}): CrossCheck {
	if (pathF1 === null) return { case: 'd', reason: 'no-fr1', fR2Kept: false, f2Prom: 0 };
	const near = (v: number, f: number, tol: number) => Math.abs(f - v) / v <= tol;
	let kase: PathCase, reason: PathReason | undefined, f1Peak: PeakLite | null = null;
	if (pathF1 < F1R[0] || pathF1 > F1R[1]) { kase = 'd'; reason = 'out-of-range'; }
	else if (closed && closed.length) {
		if (closed.some((r) => near(pathF1, r.f, T1))) kase = 'a';
		else kase = 'b';
	}
	else {
		for (const p of peaks) if (near(pathF1, p.f, T1) && (!f1Peak || Math.abs(p.f - pathF1) < Math.abs(f1Peak.f - pathF1))) f1Peak = p;
		if (f1Peak) kase = 'c'; else { kase = 'd'; reason = 'no-peak'; }
	}
	const { r125 = false, dp = false, p3 = false, pathF3 = null } = fr2;
	if (dp && !f1Peak) for (const p of peaks) if (near(pathF1, p.f, T1) && (!f1Peak || Math.abs(p.f - pathF1) < Math.abs(f1Peak.f - pathF1))) f1Peak = p;
	/** One value through the fR2 tests: kept, or failed on `r125` or `dp` (the failures `p3` answers), or simply unsupported. */
	const test = (v: number): { kept: boolean; prom: number; failed: boolean } => {
		let best: PeakLite | null = null;
		for (const p of peaks) if (p !== f1Peak && near(v, p.f, T2) && (!best || Math.abs(p.f - v) < Math.abs(best.f - v))) best = p;
		const gapFail = r125 && v - pathF1 < RESOLUTION_HZ;
		const dpFail = dp && !best && f1Peak !== null && near(v, f1Peak.f, T2);
		return { kept: !gapFail && !!best, prom: best ? best.prom : 0, failed: gapFail || dpFail };
	};
	let kept = false, f2Prom = 0, promoted: { f2: number } | null = null;
	if (pathF2 !== null) {
		if (!f2Check) kept = true;
		else {
			const t2 = test(pathF2);
			if (t2.kept) { kept = true; f2Prom = t2.prom; }
			else if (p3 && (r125 || dp) && t2.failed && pathF3 !== null) {
				const t3 = test(pathF3);
				if (t3.kept) { kept = true; f2Prom = t3.prom; promoted = { f2: pathF3 }; }
			}
		}
	}
	return { case: kase, ...(reason ? { reason } : {}), fR2Kept: kept, f2Prom, ...(promoted ? { track: 3 as const, f2: promoted.f2 } : {}) };
}

export interface Chosen {
	/** Index of the winning ceiling, or -1 when every ceiling is set aside. */
	best: number;
	w: (number | null)[];
	frames: number;
	/** The winning path's medians over the stretch: fR1, fR2, fR3. */
	f1: number | null; f2: number | null; f3: number | null;
	halves: PathEvidence['halves'];
}

/** The choice of path and its reading, from stored tracks: no Burg, no cross-check. The scoring tool re-scores variants (t, terms) with it. */
export function choosePath(all: CeilingTracks[], opts: PathOptions = {}): Chosen {
	const w = scoreCeilings(all, opts);
	let best = -1;
	w.forEach((v, i) => { if (v !== null && (best < 0 || v < (w[best] as number))) best = i; });
	const halves: PathEvidence['halves'] = { f1: [null, null], f2: [null, null] };
	if (best < 0) return { best, w, frames: 0, f1: null, f2: null, f3: null, halves };
	const c = all[best], mid = (c.t0 + c.t1) / 2;
	const part = (tr: Pt[], second: boolean) => med(tr.filter((p) => (second ? p.t > mid : p.t <= mid)).map((p) => p.f));
	halves.f1 = [part(c.tracks[0], false), part(c.tracks[0], true)]; halves.f2 = [part(c.tracks[1], false), part(c.tracks[1], true)];
	return { best, w, frames: c.frames, f1: med(c.tracks[0].map((p) => p.f)), f2: med(c.tracks[1].map((p) => p.f)), f3: med(c.tracks[2].map((p) => p.f)), halves };
}

/** What the cross-check reads from the take, apart from the path: the envelope's peaks and the closed phase's qualifying poles. Computed once per take. */
export interface CheckInputs { peaks: PeakLite[]; closedPhase: ClosedPhaseResult | null; poles: Resonance[] }
export function checkInputs(y: Float64Array, sr: number): CheckInputs {
	const { env, freqs } = ltasEnvExport(y, sr);
	const peaks = findPeaks(env, PROM_DB).filter((p) => freqs[p.idx] >= PEAK_RANGE[0] && freqs[p.idx] <= PEAK_RANGE[1]).map((p) => ({ f: parabolic(env, freqs, p.idx), prom: p.prom }));
	const closedPhase: ClosedPhaseResult | null = closedPhaseResonances(y, sr);
	const poles = closedPhase ? closedPhase.resonances.filter((r) => r.f >= F1R[0] && r.f <= F1R[1] && r.bw >= MIN_BW && r.bw < MAX_BW) : [];
	return { peaks, closedPhase, poles };
}

/** The choice of path, the reading, and the cross-check, from stored tracks and stored cross-check inputs. The scoring tool runs every variant through it. */
export function pathFinish(all: CeilingTracks[], inputs: CheckInputs, opts: PathOptions = {}, trace?: Partial<ExtractTrace>): ExtractResult {
	const ch = choosePath(all, opts), { best, w, frames, f1, f2, f3, halves } = ch;
	const f2Check = opts.f2Check ?? true;
	const x = crossCheck(f1, f2, inputs.poles.length ? inputs.poles : null, inputs.peaks, f2Check, { r125: opts.r125 ?? PATH_DEFAULTS.r125, dp: opts.dp ?? PATH_DEFAULTS.dp, p3: opts.p3 ?? PATH_DEFAULTS.p3, pathF3: f3 });
	const evidence: PathEvidence = {
		case: x.case, ...(x.reason ? { reason: x.reason } : {}), fR2Kept: x.fR2Kept, f2Check, pathF1: f1, pathF2: f2, pathF3: f3, fR2Track: x.fR2Kept ? (x.track ?? 2) : null,
		ceiling: best >= 0 ? all[best].ceiling : null, ceilings: all.map((c) => c.ceiling), w, setAside: w.filter((v) => v === null).length, frames, halves,
	};
	const out: ExtractResult = { f1, f2: x.fR2Kept ? (x.f2 ?? f2) : null, f2Prom: x.f2Prom, method: 'path', path: evidence };
	if (trace) Object.assign(trace, { envelopePeaks: inputs.peaks.map((p) => ({ f: p.f, promDb: p.prom })), closedPhase: inputs.closedPhase, chosen: out });
	return out;
}

/** Everything after Burg: the choice of path, the reading, and the cross-check. `opts.f2Check` is the switch the brief's keep-rule asks for. */
export function pathFromTracks(y: Float64Array, sr: number, all: CeilingTracks[], opts: PathOptions = {}, trace?: Partial<ExtractTrace>): ExtractResult {
	return pathFinish(all, checkInputs(y, sr), opts, trace);
}

/** The path picker. `runCapture` uses the defaults. */
export function extractPath(y: Float64Array, sr: number, opts: PathOptions = {}, trace?: Partial<ExtractTrace>): ExtractResult {
	return pathFromTracks(y, sr, pathTracks(y, sr, opts), opts, trace);
}
