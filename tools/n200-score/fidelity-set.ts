/**
 * The synthetic fidelity set, rebuilt (`docs/sessions/brief-code-n200-path-picker_r3_2026-11-16.md`, Step 0 item 2). The original
 * generator is not in the repository; this is built from the brief's recipe and the truths the desk gave as text.
 *
 * 5 voice types x 10 vowels = 50 cells, `idx` 0 to 49 (types in the order bass, baritone, tenor, mezzo-soprano, soprano; vowels in
 * the order i, e, ɪ, ɨ, ɛ, a, ɑ, ʌ, o, u). Per cell, 36 combinations (rate x bandwidth set x level x pair) in the loop order the
 * brief names; one number is drawn per combination from `rng(permSeed + idx*31 + 1)`, the combinations are sorted ascending by it, and
 * the first 12 are kept. A kept combination's rank `k` (0 to 11, in the sorted order) gives its take seed `seedBase + idx*20 + k`.
 * DESK DEFAULT in the brief: `k` is the rank in the sorted order. If the original used the combination's own index the takes differ
 * and NOT ESTABLISHED is the honest status of "the same 600 takes as the fidelity run".
 *
 * TRUTHS are Ilya's own stand-ins (`engine/stand-ins.ts`), not a real voice: tenor and mezzo-soprano share one bucket, so the set holds
 * four distinct types. fR1 and fR2 of i, e, ɛ, ɑ, o, u are the bucket's template; ɪ, ɨ, ʌ, a come from `derive` (`engine/derivations.ts`);
 * fR3 to fR5 are a row (Hz, the bass's) times the bucket's scale.
 */
import { synthFry, rng, type FryCase } from '$lib/voice/engine/fry-synth';
import { template, type StandInBucket } from '$lib/voice/engine/stand-ins';
import { derive } from '$lib/voice/engine/derivations';
import type { Vowel } from '$lib/voice/engine/types';

export const TYPES = ['bass', 'baritone', 'tenor', 'mezzo-soprano', 'soprano'] as const;
export type SetType = (typeof TYPES)[number];
export const VOWELS: Vowel[] = ['i', 'e', 'ɪ', 'ɨ', 'ɛ', 'a', 'ɑ', 'ʌ', 'o', 'u'];
const BUCKET: Record<SetType, StandInBucket> = { bass: 'bass', baritone: 'baritone', tenor: 'tenor-mezzo', 'mezzo-soprano': 'tenor-mezzo', soprano: 'soprano' };
const SIX = ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'] as const;

/** fR3, fR4, fR5 in Hz for a bass, by vowel (the desk's `truth.ts`, given as text). */
const ROW: Record<string, [number, number, number]> = {
	i: [2750, 3300, 3900], e: [2600, 3300, 3900], ɛ: [2500, 3300, 3900], a: [2500, 3300, 3900], ɑ: [2500, 3300, 3900],
	o: [2500, 3200, 3800], u: [2300, 3000, 3700],
};
ROW['ɪ'] = ROW.e;
ROW['ɨ'] = [0, 1, 2].map((k) => (ROW.i[k] + ROW.u[k]) / 2) as [number, number, number];
ROW['ʌ'] = ROW['ɑ'];

export const BW = [60, 90, 120, 180, 250];
export const BW_WIDE = [80, 100, 200, 250, 300];
const RATES = [35, 50, 70], BWS = [BW, BW_WIDE], LEVELS = [0, -15, -30], PAIRS = [false, true];

export interface Combo { rate: number; bw: number[]; level: number; pair: boolean }
export function combos(): Combo[] {
	const out: Combo[] = [];
	for (const rate of RATES) for (const bw of BWS) for (const level of LEVELS) for (const pair of PAIRS) out.push({ rate, bw, level, pair });
	return out;
}

/** The truth for a type and vowel: five resonances in Hz, lowest first. */
export function truthFor(type: SetType, vowel: Vowel): number[] {
	const t = template(BUCKET[type]), b = template('bass');
	const scale = Math.exp(SIX.reduce((s, v) => s + Math.log(t.f1[v] / b.f1[v]), 0) / SIX.length);
	const cap: Record<string, { f1: number; f2: number }> = {};
	for (const v of SIX) cap[v] = { f1: t.f1[v], f2: t.f2[v] };
	let f1: number, f2: number;
	if ((SIX as readonly string[]).includes(vowel)) { f1 = t.f1[vowel as (typeof SIX)[number]]; f2 = t.f2[vowel as (typeof SIX)[number]]; }
	else { const d = derive(vowel, cap)!; f1 = d.f1; f2 = d.f2; }
	return [f1, f2, ...ROW[vowel].map((x) => x * scale)];
}

export interface SetOptions {
	/** Take seed base (primary 5000, held-out 9000). */
	seedBase: number;
	/** Permutation seed base (primary 7000, held-out 11000). */
	permBase: number;
	/** Held-out only: each cell's five truths are multiplied by one factor from 0.90 to 1.10, drawn from `rng(truthBase + idx)`. */
	truthBase?: number;
}
export const PRIMARY: SetOptions = { seedBase: 5000, permBase: 7000 };
/** Settings of the held-out set (Step 3). Committed before its one run. */
export const HELD_OUT: SetOptions = { seedBase: 9000, permBase: 11000, truthBase: 13000 };

export interface SetCell { idx: number; type: SetType; vowel: Vowel; truth: number[]; factor: number }
export interface SetTake { cell: SetCell; k: number; seed: number; combo: Combo; pair: boolean; truth: number[]; y: Float64Array }

export function cells(opts: SetOptions): SetCell[] {
	const out: SetCell[] = [];
	TYPES.forEach((type, ti) => VOWELS.forEach((vowel, vi) => {
		const idx = ti * 10 + vi;
		const factor = opts.truthBase === undefined ? 1 : 0.9 + 0.2 * rng(opts.truthBase + idx)();
		out.push({ idx, type, vowel, truth: truthFor(type, vowel).map((f) => f * factor), factor });
	}));
	return out;
}

/** The 12 kept combinations of a cell, in take order. */
export function keptCombos(idx: number, opts: SetOptions): Combo[] {
	const cellRng = rng(opts.permBase + idx * 31 + 1);
	const all = combos().map((c) => ({ c, n: cellRng() }));
	all.sort((a, b) => a.n - b.n);
	return all.slice(0, 12).map((x) => x.c);
}

export function caseFor(cell: SetCell, k: number, opts: SetOptions): FryCase & { seed: number } {
	const c = keptCombos(cell.idx, opts)[k];
	return {
		formants: cell.truth, bandwidths: c.bw, rate: c.rate, jitter: 0.05, levelDb: c.level, durationS: 3.5, seed: opts.seedBase + cell.idx * 20 + k,
		...(c.pair ? { pairMs: 5, pairRatio: 0.6 } : {}),
	};
}

/** Every take, generated lazily (600 buffers of 3.5 s at 48 kHz are 1.3 GB if held at once). */
export function* takes(opts: SetOptions = PRIMARY): Generator<SetTake> {
	for (const cell of cells(opts)) for (let k = 0; k < 12; k++) {
		const fc = caseFor(cell, k, opts);
		yield { cell, k, seed: fc.seed, combo: keptCombos(cell.idx, opts)[k], pair: !!fc.pairMs, truth: cell.truth, y: synthFry(fc) };
	}
}

/** How many of the 600 takes carry the second pulse: the brief's check is 323 (and 277 without). */
export function pairCount(opts: SetOptions = PRIMARY): number {
	let n = 0;
	for (const cell of cells(opts)) for (const c of keptCombos(cell.idx, opts)) if (c.pair) n++;
	return n;
}
