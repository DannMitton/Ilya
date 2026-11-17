/**
 * The tables of the lane 64 variants (switch-on brief r2, Step 3), built from per-take rows. Pure code, no I/O.
 * The bars are section 3A of the brief, committed in Step 0 (`report-code-n200-lane64-step0_r1_2026-11-17.md`, section 5). Definitions stand
 * as in `measure-core.ts:5-8`: every take generated is in the denominator, and an absent fR2 is a miss. Bars are judged on the pooled takes;
 * each voice type and the split by second pulse are reported.
 *
 * Two readings of the brief, DESK DEFAULTS, printed with the tables so the desk can apply another:
 *  - A take with no track-2 value at all (the path has no second track) is in neither the "within 12 percent" set of bar 1 nor the "outside"
 *    set of bar 2: it has no value to be inside or outside of. Bar 2 is also given with those takes counted (they end absent in every variant).
 *  - Bar 2's "more than with every option off" compares a variant with the same ladder's `off` row. For a row that IS the `off` row the
 *    comparison is with itself, so only its "at least half" clause is judged and the row is marked as the reference.
 * A take is a reading in a variant when the fry detector accepted it (no re-prompt) and the variant found an fR1. Re-prompts count as misses.
 */
import { TYPES } from './fidelity-set';
import { BAR1, BAR2, PASS, FLAG_MAX, type MRow } from './measure-core';
import { VARIANT_KEYS, WEIGHT_KEY, DEFAULT_KEY, type VarCell, type LadderName } from './variants';

const within = (v: number | null, t: number, bar: number) => v !== null && Math.abs(v - t) / t <= bar;
const pct = (n: number, d: number) => (d ? `${((100 * n) / d).toFixed(1)}%` : 'n/a');
const frac = (n: number, d: number) => `${n}/${d} (${pct(n, d)})`;
const table = (head: string[], rows: (string | number)[][]) => ['| ' + head.join(' | ') + ' |', '|' + head.map(() => '---').join('|') + '|', ...rows.map((r) => '| ' + r.join(' | ') + ' |')].join('\n');

/** The variant's cell for a take, or null when the take is a miss in that variant (re-prompt, or no fR1). */
export function cellOf(r: MRow, k: string): VarCell | null {
	if (r.path.outcome === 'reprompt') return null;
	const c = r.v?.[k] ?? null;
	return c && c.f1 !== null ? c : null;
}
export const inF1 = (r: MRow, k: string) => { const c = cellOf(r, k); return !!c && within(c.f1, r.truth[0], BAR1); };
export const inF2 = (r: MRow, k: string) => { const c = cellOf(r, k); return !!c && within(c.f2, r.truth[1], BAR2); };
export const inBoth = (r: MRow, k: string) => inF1(r, k) && inF2(r, k);
const flagged = (r: MRow, k: string) => { const c = cellOf(r, k); return !!c && (c.case === 'b' || c.case === 'd'); };

const baseOf = (k: string) => `${k.split('|')[0]}|off`;
const isOff = (k: string) => k.endsWith('|off');
const hasP3 = (k: string) => k.endsWith('+P3');
const ladderOf = (k: string) => k.split('|')[0] as LadderName;

export interface Judgement {
	key: string; n: number; both: number; f1n: number; f2n: number;
	b1: { n: number; differ: number; pass: boolean };
	b2: { n: number; okV: number; okBase: number; nNull: number; okVWithNull: number; pass: boolean; reference: boolean };
	b3: { promoted: number; within: number; pass: boolean; applies: boolean };
	b4: { lost: number; pass: boolean; applies: boolean };
	b5: { pass: boolean; worst: string };
	pass: boolean; failed: string[];
}

/** Applies the five bars of section 3A to one variant on the given rows (pooled). */
export function judge(rows: MRow[], k: string): Judgement {
	const base = baseOf(k);
	const live = rows.filter((r) => cellOf(r, base));
	// bar 1
	const s1 = live.filter((r) => within(cellOf(r, base)!.p2, r.truth[1], BAR2));
	const differ = s1.filter((r) => cellOf(r, k)?.f2 !== cellOf(r, base)!.f2).length;
	const b1 = { n: s1.length, differ, pass: s1.length === 0 || differ / s1.length <= 0.01 };
	// bar 2
	const s2 = live.filter((r) => cellOf(r, base)!.p2 !== null && !within(cellOf(r, base)!.p2, r.truth[1], BAR2));
	const nulls = live.filter((r) => cellOf(r, base)!.p2 === null);
	const ok = (r: MRow, kk: string) => { const c = cellOf(r, kk); return !!c && (c.f2 === null || within(c.f2, r.truth[1], BAR2)); };
	const okV = s2.filter((r) => ok(r, k)).length, okBase = s2.filter((r) => ok(r, base)).length;
	const okVWithNull = okV + nulls.filter((r) => ok(r, k)).length;
	const reference = isOff(k);
	const b2 = { n: s2.length, okV, okBase, nNull: nulls.length, okVWithNull, reference, pass: s2.length === 0 || (okV * 2 >= s2.length && (reference || okV > okBase)) };
	// bar 3
	const prom = rows.filter((r) => cellOf(r, k)?.track === 3 && cellOf(r, k)?.f2 !== null);
	const pw = prom.filter((r) => within(cellOf(r, k)!.f2, r.truth[1], BAR2)).length;
	const b3 = { promoted: prom.length, within: pw, applies: hasP3(k), pass: !hasP3(k) || (prom.length > 0 && pw / prom.length >= 0.9) };
	// bar 4
	const l15 = `L15|${k.split('|')[1]}`;
	const lost = ladderOf(k) === 'L15' ? 0 : rows.filter((r) => inBoth(r, l15) && !inBoth(r, k)).length;
	const b4 = { lost, applies: ladderOf(k) !== 'L15', pass: lost === 0 };
	// bar 5
	const per = TYPES.map((t) => {
		const g = rows.filter((r) => r.type === t), b = g.filter((r) => inBoth(r, k));
		const a1 = g.filter((r) => inF1(r, k)).length / g.length, a2 = g.filter((r) => inF2(r, k)).length / g.length;
		const fl = b.length ? b.filter((r) => flagged(r, k)).length / b.length : 0;
		return { t, a1, a2, fl, pass: a1 >= PASS && a2 >= PASS && fl <= FLAG_MAX };
	});
	const w = per.reduce((m, x) => (Math.min(x.a1, x.a2) < Math.min(m.a1, m.a2) ? x : m));
	const b5 = { pass: per.every((x) => x.pass), worst: `${w.t} fR1 ${(100 * w.a1).toFixed(1)}%, fR2 ${(100 * w.a2).toFixed(1)}%; flagged max ${(100 * Math.max(...per.map((x) => x.fl))).toFixed(1)}%` };
	const failed = [!b1.pass && '1', !b2.pass && '2', !b3.pass && '3', !b4.pass && '4', !b5.pass && '5'].filter(Boolean) as string[];
	return {
		key: k, n: rows.length, both: rows.filter((r) => inBoth(r, k)).length, f1n: rows.filter((r) => inF1(r, k)).length, f2n: rows.filter((r) => inF2(r, k)).length,
		b1, b2, b3, b4, b5, pass: failed.length === 0, failed,
	};
}

const mark = (ok: boolean) => (ok ? 'ok' : 'FAIL');

/** The pooled verdict table: one row per variant, the figure behind each bar, and the verdict. `rows` is the third set. */
export function verdictTable(rows: MRow[], label = 'pooled'): string {
	const body = VARIANT_KEYS.map((k) => {
		const j = judge(rows, k);
		return [
			k, frac(j.both, j.n), frac(j.f1n, j.n), frac(j.f2n, j.n),
			`${j.b1.differ}/${j.b1.n} ${mark(j.b1.pass)}`,
			`${j.b2.okV}/${j.b2.n} (off ${j.b2.okBase}${j.b2.reference ? ', reference' : ''}; with ${j.b2.nNull} no-track-2 takes: ${j.b2.okVWithNull}/${j.b2.n + j.b2.nNull}) ${mark(j.b2.pass)}`,
			j.b3.applies ? `${j.b3.within}/${j.b3.promoted} ${mark(j.b3.pass)}` : 'n/a',
			j.b4.applies ? `${j.b4.lost} lost ${mark(j.b4.pass)}` : 'n/a',
			`${j.b5.worst} ${mark(j.b5.pass)}`,
			j.pass ? '**PASS**' : `fails ${j.failed.join(',')}`,
		];
	});
	return `Variants on the third set, ${label} (${rows.length} takes). Counts are takes in a reading within the bar, every take generated in the denominator.\n\n` +
		table(['variant', 'in both bars', 'fR1 within 10%', 'fR2 within 12%', 'bar 1: fR2 changed, of takes whose track-2 fR2 is within 12%', 'bar 2: end absent or within 12%, of takes whose track-2 fR2 is outside', 'bar 3: promoted by P3 within 12%', 'bar 4: in both bars on L15, out of them here', 'bar 5: weakest voice type', 'verdict'], body);
}

/** Per voice type and variant: fR1 and fR2 within the bar, both, and the share of the in-both takes in case (b) or (d). */
export function perTypeTable(rows: MRow[]): string {
	const body: (string | number)[][] = [];
	for (const t of TYPES) {
		const g = rows.filter((r) => r.type === t);
		for (const k of VARIANT_KEYS) {
			const b = g.filter((r) => inBoth(r, k));
			body.push([t, k, frac(g.filter((r) => inF1(r, k)).length, g.length), frac(g.filter((r) => inF2(r, k)).length, g.length), frac(b.length, g.length), frac(b.filter((r) => flagged(r, k)).length, b.length)]);
		}
	}
	return table(['type', 'variant', 'fR1 within 10%', 'fR2 within 12%', 'both', 'of the in-both takes, case b or d'], body);
}

/** The weighting option on L15 alone: how many takes change ceiling, and what it does to the bars. */
export function weightTable(rows: MRow[]): string {
	const body = TYPES.map((t) => {
		const g = rows.filter((r) => r.type === t && cellOf(r, 'L15|off') && r.v?.[WEIGHT_KEY]);
		const ch = g.filter((r) => Math.abs((r.v![WEIGHT_KEY].ceiling ?? -1) - (r.v!['L15|off'].ceiling ?? -1)) > 1e-6).length;
		const bothW = g.filter((r) => inBoth(r, WEIGHT_KEY)).length, bothO = g.filter((r) => inBoth(r, 'L15|off')).length;
		return [t, g.length, frac(ch, g.length), `${bothW} (off ${bothO})`];
	});
	const all = rows.filter((r) => cellOf(r, 'L15|off') && r.v?.[WEIGHT_KEY]);
	const ch = all.filter((r) => Math.abs((r.v![WEIGHT_KEY].ceiling ?? -1) - (r.v!['L15|off'].ceiling ?? -1)) > 1e-6).length;
	body.push(['all', all.length, frac(ch, all.length), `${all.filter((r) => inBoth(r, WEIGHT_KEY)).length} (off ${all.filter((r) => inBoth(r, 'L15|off')).length})`]);
	return 'The weighting option (rows weighted by 1/sqrt(b)), L15, every other option off:\n\n' + table(['type', 'readings', 'takes that change ceiling', 'in both bars (L15 off)'], body);
}

/** The 80 percent bar per voice type with every option off, on L15: if any type misses, the lane stops for the desk (brief, Step 3). */
export function defaultCheck(rows: MRow[]): { text: string; anyMiss: boolean } {
	let anyMiss = false;
	const body = TYPES.map((t) => {
		const g = rows.filter((r) => r.type === t);
		const a = g.filter((r) => inF1(r, 'L15|off')).length, b = g.filter((r) => inF2(r, 'L15|off')).length;
		const miss = a / g.length < PASS || b / g.length < PASS;
		if (miss) anyMiss = true;
		return [t, g.length, frac(a, g.length), frac(b, g.length), miss ? 'MISS' : 'ok'];
	});
	return { anyMiss, text: `Every option off, L15 (the lane 62 picker), the ${PASS * 100}% bar per voice type:\n\n` + table(['type', 'takes', 'fR1 within 10%', 'fR2 within 12%', 'bar'], body) };
}

/** How many readings of the default variant (`DEFAULT_KEY`) equal the default `runCapture` path reading (they must all). */
export function selfCheck(rows: MRow[]): { agree: number; of: number; text: string } {
	const g = rows.filter((r) => r.path.outcome === 'reading' && r.v?.[DEFAULT_KEY]);
	const agree = g.filter((r) => r.v![DEFAULT_KEY].f1 === r.path.f1 && r.v![DEFAULT_KEY].f2 === r.path.f2).length;
	return { agree, of: g.length, text: `Self-check: ${DEFAULT_KEY} equals the default \`runCapture\` path reading (f1 and f2 to 0.1 Hz) on ${agree} of ${g.length} readings.` };
}

/** The variants that pass every bar on the pooled third set, with the desk's choice rule: most takes in both bars, then fewest options, then L15. */
export function choice(rows: MRow[]): { passing: Judgement[]; ranked: Judgement[]; text: string } {
	const optionCount = (k: string) => { const c = k.split('|')[1]; return c === 'off' ? 0 : c.split('+').length; };
	const passing = VARIANT_KEYS.map((k) => judge(rows, k)).filter((j) => j.pass);
	const ranked = [...passing].sort((a, b) => b.both - a.both || optionCount(a.key) - optionCount(b.key) || (ladderOf(a.key) === 'L15' ? -1 : 0) - (ladderOf(b.key) === 'L15' ? -1 : 0));
	const text = passing.length
		? `Variants that pass all five bars on the third set (the desk applies Dann's takes and then chooses; rule: most takes in both bars, then fewest options, then L15):\n\n` +
			table(['rank', 'variant', 'in both bars', 'options'], ranked.map((j, i) => [i + 1, j.key, `${j.both}/${j.n}`, optionCount(j.key)]))
		: 'No variant passes all five bars on the third set.';
	return { passing, ranked, text };
}

/** The split by second pulse: in-both, fR1, and fR2 counts per variant on each half, and bars 1 and 2 on each half (reported, never judged). */
export function pairSplitTable(rows: MRow[]): string {
	const halves: [string, MRow[]][] = [['with the second pulse', rows.filter((r) => r.pair)], ['without the second pulse', rows.filter((r) => !r.pair)]];
	const body = VARIANT_KEYS.map((k) => {
		const cells: (string | number)[] = [k];
		for (const [, g] of halves) { const j = judge(g, k); cells.push(frac(j.both, j.n), frac(j.f1n, j.n), frac(j.f2n, j.n), `${j.b1.differ}/${j.b1.n}`, `${j.b2.okV}/${j.b2.n} (off ${j.b2.okBase})`); }
		return cells;
	});
	const head = ['variant', ...halves.flatMap(([n]) => [`${n}: both`, 'fR1', 'fR2', 'bar 1 changed', 'bar 2 end ok'])];
	return table(head, body);
}

/** Which tracks gave fR2 on the kept readings, and how often P3 promoted a value, per variant (the evidence behind bar 3). */
export function trackTable(rows: MRow[]): string {
	const body = VARIANT_KEYS.filter(hasP3).map((k) => {
		const g = rows.filter((r) => cellOf(r, k));
		return [k, g.filter((r) => cellOf(r, k)!.f2 !== null && cellOf(r, k)!.track === 2).length, g.filter((r) => cellOf(r, k)!.track === 3).length, g.filter((r) => cellOf(r, k)!.f2 === null).length];
	});
	return table(['variant', 'fR2 from track 2', 'fR2 from track 3 (P3)', 'fR2 absent'], body);
}
