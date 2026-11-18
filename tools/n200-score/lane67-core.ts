/**
 * Lane 67, Step 4 (`docs/sessions/brief-code-lane67-voice-threshold_r2_2026-11-18.md`): the measure that comes before the tract scale (Step 3). Pure code,
 * no I/O (`lane67-measure.run.ts` reads the golden and writes the tables). Not a gate.
 *
 * THE QUESTION. A singer has sung five of the six core vowels. What does Ilya say for the sixth, three ways?
 *   shape    the `middle` template times the tract scale k (the brief's rule for a personal voice, Step 3);
 *   declared the declared type's template times k (what putting the voice type back above the threshold would do);
 *   fit      today's stand-in fit, the tree's own `fillStandIns` through `resolveVowelValues` (`engine/stand-ins.ts`), run on the untouched engine.
 *
 * THE TRACT SCALE k (brief section 2): the geometric mean, over every sung core vowel and both resonances where sung (fR1 always; fR2 where
 * `resolve-values.ts` would take it: a positive f2 whose `f2Quality` is not `absent`), of the sung value over the shape's value. A sung core
 * vowel with no usable fR2 contributes to fR1's mean only; a missing vowel takes shape fR1 times k and shape fR2 times k.
 *
 * WHAT THIS CAN AND CANNOT SAY. The truths are Ilya's own templates by type (`fidelity-set.ts:12-14`), so `declared` is exact by construction (up to the
 * picker's noise on the five sung vowels). The run measures how far Bozeman's staves differ in shape from their middle, and how far one odd [i] moves a
 * missing vowel. It does not test `middle` against a real voice.
 */
import { resolveVowelValues } from '$lib/voice/engine/resolve-values';
import { standInBucket, template, BOZEMAN_VOWELS } from '$lib/voice/engine/stand-ins';
import type { BozemanVowel } from '$lib/voice/engine/plausibility';
import type { CalibratedFormant, Vowel } from '$lib/voice/engine/types';
import { TYPES, type SetType } from './fidelity-set';
import { profilesFromGolden, st, truthOf, f, type GoldenRow, type Profile, type SetProfile } from './lane66-core';

export { profilesFromGolden, type GoldenRow };

export const CORE = BOZEMAN_VOWELS;
export type Method = 'shape' | 'declared' | 'fit';
export const METHODS: Method[] = ['shape', 'declared', 'fit'];

const geo = (xs: number[]): number => Math.exp(xs.reduce((a, x) => a + Math.log(x), 0) / xs.length);
const usableF2 = (x: CalibratedFormant): boolean => typeof x.f2 === 'number' && x.f2 > 0 && x.f2Quality !== 'absent';
const sungCore = (p: Profile): BozemanVowel[] => CORE.filter((v) => !!p[v] && p[v]!.reading !== 'estimated' && p[v]!.f1 > 0);

/** The tract scale of a profile against a shape (see the header). NaN with no sung core vowel. */
export function tractScale(p: Profile, shape: { f1: Record<BozemanVowel, number>; f2: Record<BozemanVowel, number> }): number {
	const ratios: number[] = [];
	for (const v of sungCore(p)) {
		ratios.push(p[v]!.f1 / shape.f1[v]);
		if (usableF2(p[v]!)) ratios.push(p[v]!.f2! / shape.f2[v]);
	}
	return ratios.length ? geo(ratios) : NaN;
}

export interface Estimate { f1: number; f2: number }

/** One method's estimate of a vowel missing from `p` (the profile holds the other core vowels it was handed). */
export function estimate(method: Method, p: Profile, vowel: BozemanVowel, type: SetType): Estimate {
	if (method === 'fit') {
		const r = resolveVowelValues(p, type, { placeholders: 'always' });
		return { f1: r.fR1[vowel], f2: r.fR2[vowel] };
	}
	const shape = template(method === 'shape' ? 'middle' : standInBucket(type));
	const k = tractScale(p, shape);
	return { f1: shape.f1[vowel] * k, f2: shape.f2[vowel] * k };
}

export interface Case { type: SetType; k: number; vowel: BozemanVowel; method: Method; e1: number; e2: number }

/** The profile's core vowels, each left out in turn: only a profile that holds all six core readings gives six cuts. */
export function leaveOneOut(profiles: SetProfile[]): Case[] {
	const out: Case[] = [];
	for (const p of profiles) {
		if (sungCore(p.formants).length < 6) continue;
		for (const vowel of CORE) {
			const cut: Profile = { ...p.formants };
			delete cut[vowel];
			const truth = truthOf(p.type, vowel);
			for (const method of METHODS) {
				const est = estimate(method, cut, vowel, p.type);
				out.push({ type: p.type, k: p.k, vowel, method, e1: st(est.f1, truth[0]), e2: st(est.f2, truth[1]) });
			}
		}
	}
	return out;
}

/** The odd [i] of `analysis/adapter-grid.ts:29`: 1063 Hz first resonance, 2250 Hz second. */
export const ODD_I: CalibratedFormant = { f1: 1063, f2: 2250, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user' } as CalibratedFormant;

export interface Move { type: SetType; k: number; vowel: BozemanVowel; method: Method; m1: number; m2: number }

/** One odd [i] among five core vowels: each of the other five left out in turn, and how far each method moves it, odd [i] against the profile's own [i]. */
export function oddIMoves(profiles: SetProfile[]): Move[] {
	const out: Move[] = [];
	for (const p of profiles) {
		if (sungCore(p.formants).length < 6) continue;
		for (const vowel of CORE) {
			if (vowel === 'i') continue;
			const own: Profile = { ...p.formants };
			delete own[vowel];
			const odd: Profile = { ...own, i: ODD_I };
			for (const method of METHODS) {
				const a = estimate(method, own, vowel, p.type);
				const b = estimate(method, odd, vowel, p.type);
				out.push({ type: p.type, k: p.k, vowel, method, m1: st(b.f1, a.f1), m2: st(b.f2, a.f2) });
			}
		}
	}
	return out;
}

// ── Tables ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

export const median = (xs: number[]): number => {
	if (!xs.length) return NaN;
	const s = [...xs].sort((a, b) => a - b);
	const m = s.length >> 1;
	return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
/** Nearest-rank 90th percentile. */
export const p90 = (xs: number[]): number => {
	if (!xs.length) return NaN;
	const s = [...xs].sort((a, b) => a - b);
	return s[Math.min(s.length - 1, Math.ceil(0.9 * s.length) - 1)];
};
const table = (head: string[], rows: (string | number)[][]): string =>
	['| ' + head.join(' | ') + ' |', '|' + head.map(() => '---').join('|') + '|', ...rows.map((r) => '| ' + r.join(' | ') + ' |')].join('\n');
const cell = (xs: number[]): string => (xs.length ? `${f(median(xs.map(Math.abs)))} / ${f(p90(xs.map(Math.abs)))}` : 'n/a');

/** Absolute error, median / 90th percentile, in semitones, by group; one row per group, a column pair per method. */
export function errorTable(cases: Case[], by: 'type' | 'vowel' | 'all', resonance: 'e1' | 'e2'): string {
	const keys: string[] = by === 'type' ? [...TYPES] : by === 'vowel' ? [...CORE] : ['all'];
	const rows = keys.map((key) => {
		const pick = (m: Method) => cases.filter((c) => c.method === m && (by === 'all' || c[by] === key)).map((c) => c[resonance]);
		return [key, pick('shape').length / 1, ...METHODS.map((m) => cell(pick(m)))];
	});
	return table([by, 'cuts', ...METHODS.map((m) => `${m}: median / p90`)], rows);
}
export function errorByTypeAndVowel(cases: Case[], resonance: 'e1' | 'e2'): string {
	const rows: (string | number)[][] = [];
	for (const type of TYPES) for (const vowel of CORE) {
		const pick = (m: Method) => cases.filter((c) => c.method === m && c.type === type && c.vowel === vowel).map((c) => c[resonance]);
		rows.push([type, vowel, pick('shape').length, ...METHODS.map((m) => cell(pick(m)))]);
	}
	return table(['type', 'vowel', 'cuts', ...METHODS.map((m) => `${m}: median / p90`)], rows);
}
/** The odd [i]'s move of the missing vowel, absolute, median / p90 / max, by method. */
export function oddTable(moves: Move[]): string {
	const rows = METHODS.map((m) => {
		const a1 = moves.filter((x) => x.method === m).map((x) => Math.abs(x.m1));
		const a2 = moves.filter((x) => x.method === m).map((x) => Math.abs(x.m2));
		return [m, a1.length, `${f(median(a1))} / ${f(p90(a1))} / ${f(Math.max(...a1))}`, `${f(median(a2))} / ${f(p90(a2))} / ${f(Math.max(...a2))}`];
	});
	return table(['method', 'cuts', 'fR1 move: median / p90 / max (st)', 'fR2 move: median / p90 / max (st)'], rows);
}
