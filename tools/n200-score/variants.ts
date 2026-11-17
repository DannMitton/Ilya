/**
 * The path picker's variants (N.200 lane 64, Step 2, `docs/sessions/brief-code-n200-switch-on-lane64_r2_2026-11-17.md`): three ladders and the
 * five combinations of Step 1's options, scored from ONE set of Burg tracks and ONE set of cross-check inputs per take. Pure code, no I/O.
 *
 *  - Ladders: `L15` (the lane 62 ladder, 3000 to 7000 Hz), `L3188` and `L3387` (L15 with its lowest one or two ceilings removed:
 *    3188 to 7000 Hz and 3387 to 7000 Hz). A raised floor re-scores the stored tracks of the same 15 ceilings by `choosePath` on a slice,
 *    so it costs no new Burg run (`path-extract.ts`, `choosePath`).
 *  - Combinations: off, R125, DP, R125+DP, R125+DP+P3. P3 acts only when R125 or DP fails, so it has no combination of its own.
 *  - The weighting option (`sqrtWeight`, Fable's fix 5) is run on L15 alone, with the other options off: key `L15|w`.
 *
 * `L15|off` is the lane 62 picker. Since Step 4 the engine's default is `L15|R125+DP+P3` (`PATH_DEFAULTS`), and the runners check that this variant equals the default run.
 */
import { pathTracks, checkInputs, pathFinish, type PathOptions, type PathEvidence } from '$lib/voice/engine/path-extract';
import type { ExtractResult } from '$lib/voice/engine/extract';

export const LADDERS = ['L15', 'L3188', 'L3387'] as const;
export type LadderName = (typeof LADDERS)[number];
/** How many of L15's lowest ceilings each ladder drops. */
export const LADDER_DROP: Record<LadderName, number> = { L15: 0, L3188: 1, L3387: 2 };
export const COMBOS = ['off', 'R125', 'DP', 'R125+DP', 'R125+DP+P3'] as const;
export type ComboName = (typeof COMBOS)[number];
/** Every option is named, true or false, because since Step 4 an option left out takes the engine's default (`PATH_DEFAULTS`: R125, DP, and P3 on). */
const O = (r125: boolean, dp: boolean, p3: boolean): PathOptions => ({ r125, dp, p3, sqrtWeight: false });
export const COMBO_OPTS: Record<ComboName, PathOptions> = {
	off: O(false, false, false), R125: O(true, false, false), DP: O(false, true, false), 'R125+DP': O(true, true, false), 'R125+DP+P3': O(true, true, true),
};
export const key = (l: LadderName, c: ComboName) => `${l}|${c}`;
export const WEIGHT_KEY = 'L15|w';
/** The variant the engine runs by default since Step 4 (`PATH_DEFAULTS` in `path-extract.ts`): ladder L15, R125 + DP + P3, weighting off. */
export const DEFAULT_KEY = 'L15|R125+DP+P3';
/** The fifteen ladder-and-combination variants, in the order the tables print them. */
export const VARIANT_KEYS: string[] = LADDERS.flatMap((l) => COMBOS.map((c) => key(l, c)));

/** What one variant reads from one take. fR1 and fR2 are the final reading (fR2 after the cross-check); `p2` and `p3` are the path's tracks before any check. */
export interface VarCell {
	f1: number | null; f2: number | null;
	p2: number | null; p3: number | null;
	case: string | null; track: 2 | 3 | null;
	ceiling: number | null; runnerUp: number | null;
}

const r1 = (v: number | null | undefined) => (v === null || v === undefined ? null : Math.round(v * 10) / 10);

/** The ceiling with the second-lowest W (the runner-up of the choice), or null when fewer than two ceilings were scored. */
export function runnerUpCeiling(p: Pick<PathEvidence, 'w' | 'ceilings' | 'ceiling'>): number | null {
	let best = -1, second = -1;
	p.w.forEach((v, i) => {
		if (v === null) return;
		if (best < 0 || v < (p.w[best] as number)) { second = best; best = i; }
		else if (second < 0 || v < (p.w[second] as number)) second = i;
	});
	return second >= 0 ? p.ceilings[second] : null;
}

export function cellOf(r: ExtractResult): VarCell {
	const p = r.path!;
	return {
		f1: r1(r.f1), f2: r1(r.f2), p2: r1(p.pathF2), p3: r1(p.pathF3), case: p.case, track: p.fR2Track,
		ceiling: p.ceiling === null ? null : Math.round(p.ceiling * 10) / 10, runnerUp: (() => { const u = runnerUpCeiling(p); return u === null ? null : Math.round(u * 10) / 10; })(),
	};
}

/** Every variant on the guard's stretch `yw`. Burg runs once, on L15; the other ladders re-score slices of its tracks. */
export function runVariants(yw: Float64Array, sr: number, withWeight = true): Record<string, VarCell> {
	const tracks = pathTracks(yw, sr);
	const inputs = checkInputs(yw, sr);
	const out: Record<string, VarCell> = {};
	for (const l of LADDERS) for (const c of COMBOS) out[key(l, c)] = cellOf(pathFinish(tracks.slice(LADDER_DROP[l]), inputs, COMBO_OPTS[c]));
	if (withWeight) out[WEIGHT_KEY] = cellOf(pathFinish(tracks, inputs, { ...COMBO_OPTS.off, sqrtWeight: true }));
	return out;
}
