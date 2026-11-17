/**
 * The Step 3 measurement of the path picker (`docs/sessions/brief-code-n200-path-picker_r3_2026-11-16.md`, Step 3): per-take rows
 * from the synthetic set, and the tables built from them. Pure code, no I/O (`measure.run.ts` runs the takes and writes the rows).
 *
 * THE BARS (written before the first run, in `report-code-n200-path-step3_r1_2026-11-17.md`): fR1 within 10 percent and fR2 within
 * 12 percent of the truth, on at least 80 percent of the takes of each voice type. The denominator is every take generated (120 per
 * type). A take counts when `runCapture` gives a reading within the bar, whatever its status; a re-prompt or an error is a miss.
 * An fR2 marked absent is an fR2 miss in the main table. "In both bars" is judged on the path's fR1 and fR2 before the fR2 check.
 */
import { TYPES, type SetType } from './fidelity-set';

export const BAR1 = 0.10, BAR2 = 0.12, PASS = 0.80, FLAG_MAX = 0.10;

export interface PickerCell { outcome: 'reading' | 'reprompt' | 'error'; f1: number | null; f2: number | null; reading: string | null; confidence: string | null }
export interface PathCell extends PickerCell {
	f2Quality: string | null;
	case: string | null; reason: string | null; kept: boolean | null;
	pathF1: number | null; pathF2: number | null; pathF3: number | null;
	ceiling: number | null; ceilingIdx: number | null; ladderLen: number; setAside: number | null; w: (number | null)[] | null; frames: number | null;
}
export interface Variant { ceiling: number | null; f1: number | null; f2: number | null }
export interface MRow {
	idx: number; k: number; type: SetType; vowel: string; pair: boolean; truth: number[];
	shipped: PickerCell; path: PathCell;
	variants: Record<string, Variant>;
}

const within = (v: number | null, t: number, bar: number) => v !== null && Math.abs(v - t) / t <= bar;
const isReading = (c: PickerCell) => c.outcome === 'reading';

/** fR1 and fR2 in bar as `runCapture` reports them (fR2 after the check; absent is a miss). */
export const bars = (r: MRow) => ({ f1: isReading(r.path) && within(r.path.f1, r.truth[0], BAR1), f2: isReading(r.path) && within(r.path.f2, r.truth[1], BAR2) });
/** In bar on what the path found, before the fR2 check. */
export const preBars = (r: MRow) => ({ f1: isReading(r.path) && within(r.path.pathF1, r.truth[0], BAR1), f2: isReading(r.path) && within(r.path.pathF2, r.truth[1], BAR2) });
const pct = (n: number, d: number) => (d ? `${((100 * n) / d).toFixed(1)}%` : 'n/a');
const frac = (n: number, d: number) => `${n}/${d} (${pct(n, d)})`;

function quantile(v: number[], p: number): number { const s = [...v].sort((a, b) => a - b), k = (s.length - 1) * p, lo = Math.floor(k), hi = Math.ceil(k); return s[lo] + (s[hi] - s[lo]) * (k - lo); }
const table = (head: string[], rows: (string | number)[][]) => ['| ' + head.join(' | ') + ' |', '|' + head.map(() => '---').join('|') + '|', ...rows.map((r) => '| ' + r.join(' | ') + ' |')].join('\n');
const byType = (rows: MRow[]) => TYPES.map((t) => ({ t, rows: rows.filter((r) => r.type === t) }));

/** The main table, and the Captured-only and absent-left-out tables. */
export function mainTables(rows: MRow[]): string {
	const out: string[] = [];
	const main = byType(rows).map(({ t, rows: g }) => {
		const a = g.filter((r) => bars(r).f1).length, b = g.filter((r) => bars(r).f2).length, both = g.filter((r) => bars(r).f1 && bars(r).f2).length;
		const ok = a / g.length >= PASS && b / g.length >= PASS;
		return [t, g.length, frac(a, g.length), frac(b, g.length), frac(both, g.length), ok ? 'pass' : 'FAIL'];
	});
	out.push('Main table: reading within the bar, any status; an fR2 marked absent is a miss.\n', table(['type', 'takes', 'fR1 within 10%', 'fR2 within 12%', 'both', `each at ${PASS * 100}%`], main));
	const cap = byType(rows).map(({ t, rows: g }) => {
		const c = g.filter((r) => r.path.reading === 'captured');
		const a = c.filter((r) => bars(r).f1).length, b = c.filter((r) => bars(r).f2).length, both = c.filter((r) => bars(r).f1 && bars(r).f2).length;
		return [t, g.length, c.length, frac(a, g.length), frac(b, g.length), frac(both, g.length)];
	});
	out.push('\nCaptured readings only (denominator: every take):\n', table(['type', 'takes', 'captured', 'fR1 within 10%', 'fR2 within 12%', 'both'], cap));
	const noAbs = byType(rows).map(({ t, rows: g }) => {
		const p = g.filter((r) => isReading(r.path) && r.path.f2 !== null);
		const b = p.filter((r) => within(r.path.f2, r.truth[1], BAR2)).length;
		return [t, g.length, p.length, g.length - p.length, frac(b, p.length)];
	});
	out.push('\nAbsent fR2 left out (denominator: readings that kept an fR2):\n', table(['type', 'takes', 'fR2 present', 'fR2 absent or no reading', 'fR2 within 12%'], noAbs));
	return out.join('\n');
}

/** Good takes flagged, Provisional by any cause, and the shipped picker's figure on the same takes. */
export function flagTable(rows: MRow[]): string {
	const body = byType(rows).map(({ t, rows: g }) => {
		const good = g.filter((r) => preBars(r).f1 && preBars(r).f2);
		const bd = good.filter((r) => r.path.case === 'b' || r.path.case === 'd').length;
		const prov = good.filter((r) => r.path.reading === 'provisional').length;
		const sProv = good.filter((r) => r.shipped.reading === 'provisional').length, sNo = good.filter((r) => !isReading(r.shipped)).length;
		const ok = good.length ? bd / good.length <= FLAG_MAX : true;
		return [t, good.length, frac(bd, good.length), ok ? 'pass' : 'FAIL', frac(prov, good.length), frac(sProv, good.length), sNo];
	});
	return 'Takes in both bars (path fR1 and fR2 before the fR2 check): share in case (b) or (d), bar at most 10%.\n\n' + table(['type', 'in both bars', 'case b or d', `<= ${FLAG_MAX * 100}%`, 'path Provisional (any cause)', 'shipped Provisional, same takes', 'shipped no reading'], body);
}

const state = (c: PickerCell) => (isReading(c) ? (c.reading as string) : c.outcome);
/** Every status that moves between the shipped picker and the path picker, in both directions. */
export function moveTable(rows: MRow[]): string {
	const kinds = ['captured', 'provisional', 'reprompt', 'error'];
	const body: (string | number)[][] = [];
	for (const { t, rows: g } of byType(rows)) {
		for (const a of kinds) for (const b of kinds) {
			if (a === b) continue;
			const n = g.filter((r) => state(r.shipped) === a && state(r.path) === b).length;
			if (n) body.push([t, `${a} to ${b}`, n]);
		}
		body.push([t, 'unchanged', g.filter((r) => state(r.shipped) === state(r.path)).length]);
	}
	return 'Status, shipped picker to path picker (counts of takes):\n\n' + table(['type', 'move', 'takes'], body);
}

/** The fR2 misses (path fR2 before the check outside the bar), and the keep-rule for `f2Check`. */
export function f2Section(rows: MRow[]): { keep: string; misses: string } {
	const rd = rows.filter((r) => isReading(r.path));
	const inBar = rd.filter((r) => preBars(r).f2), miss = rd.filter((r) => !preBars(r).f2);
	const absentOfGood = inBar.filter((r) => r.path.kept === false).length, caught = miss.filter((r) => r.path.kept === false).length;
	const c1 = inBar.length ? absentOfGood / inBar.length <= 0.01 : true, c2 = miss.length ? caught / miss.length >= 0.5 : true;
	const keep = [
		`The keep-rule (written before any run): the check passes when it marks fR2 absent on no more than 1% of takes whose path fR2 is in the bar, and marks absent at least half of the fR2 misses. With no misses, the first condition decides alone.`,
		`- takes with a reading: ${rd.length}; path fR2 in the bar: ${inBar.length}; fR2 misses: ${miss.length}`,
		`- in-bar takes with fR2 marked absent: ${frac(absentOfGood, inBar.length)} (bar at most 1%): ${c1 ? 'met' : 'NOT met'}`,
		`- misses with fR2 marked absent: ${frac(caught, miss.length)} (bar at least half): ${miss.length ? (c2 ? 'met' : 'NOT met') : 'no misses'}`,
		`- **the check ${c1 && c2 ? 'PASSES' : 'FAILS'} the rule.** The default is not changed by the lane.`,
	].join('\n');
	const head = ['seed idx', 'type', 'vowel', 'chosen ceiling', 'path F2', 'path F3', 'truth fR2', 'truth fR3', 'check kept fR2'];
	const misses = table(head, miss.map((r) => [`${r.idx}/${r.k}`, r.type, r.vowel, r.path.ceiling === null ? '-' : Math.round(r.path.ceiling), r.path.pathF2 === null ? '-' : Math.round(r.path.pathF2), r.path.pathF3 === null ? '-' : Math.round(r.path.pathF3), Math.round(r.truth[1]), Math.round(r.truth[2]), r.path.kept ? 'yes' : 'no']));
	return { keep, misses };
}

/** The chosen ceilings, and how many takes choose the lowest or the highest ceiling and miss a bar. */
export function ceilingTable(rows: MRow[]): string {
	const body = byType(rows).map(({ t, rows: g }) => {
		const rd = g.filter((r) => isReading(r.path) && r.path.ceiling !== null);
		const cs = rd.map((r) => r.path.ceiling as number);
		const low = rd.filter((r) => r.path.ceilingIdx === 0), high = rd.filter((r) => r.path.ceilingIdx === r.path.ladderLen - 1);
		const miss = (a: MRow[]) => a.filter((r) => !(preBars(r).f1 && preBars(r).f2)).length;
		const sa = rd.map((r) => r.path.setAside ?? 0);
		return [t, rd.length, cs.length ? Math.round(quantile(cs, 0.5)) : '-', cs.length ? `${Math.round(quantile(cs, 0.1))} to ${Math.round(quantile(cs, 0.9))}` : '-', `${low.length} (${miss(low)} miss)`, `${high.length} (${miss(high)} miss)`, sa.reduce((a, b) => a + b, 0), `${sa.filter((v) => v > 0).length}`];
	});
	return table(['type', 'readings', 'median ceiling (Hz)', '10th to 90th', 'lowest ceiling chosen (of which miss a bar)', 'highest chosen (miss)', 'ceilings set aside, total', 'takes with any set aside'], body);
}

/** Sensitivity: takes that change ceiling, and takes that change a bar result, against the default run. */
export function sensitivityTable(rows: MRow[]): string {
	const names = [...new Set(rows.flatMap((r) => Object.keys(r.variants)))];
	const body = names.map((n) => {
		const g = rows.filter((r) => r.variants[n] && isReading(r.path));
		const ceil = g.filter((r) => r.variants[n].ceiling !== null && r.path.ceiling !== null && Math.abs((r.variants[n].ceiling as number) - (r.path.ceiling as number)) > 1e-6).length;
		const bar = g.filter((r) => {
			const v = r.variants[n], base = preBars(r);
			const f1 = within(v.f1, r.truth[0], BAR1), f2 = within(v.f2, r.truth[1], BAR2);
			return f1 !== base.f1 || f2 !== base.f2;
		}).length;
		const inBoth = g.filter((r) => within(r.variants[n].f1, r.truth[0], BAR1) && within(r.variants[n].f2, r.truth[1], BAR2)).length;
		const base = g.filter((r) => preBars(r).f1 && preBars(r).f2).length;
		return [n, g.length, n === 'L9' ? 'n/a (a different ladder: no ceiling is shared)' : frac(ceil, g.length), frac(bar, g.length), `${inBoth} (default ${base})`];
	});
	return table(['variant', 'takes', 'change ceiling', 'change a bar result', 'in both bars (default)'], body);
}

/** [i] and [u] takes with fR1 standing (case a or c) and fR2 absent, per type: what `divergence.ts` turns into a Provisional [ɨ]. */
export function iuAbsent(rows: MRow[]): string {
	const body = byType(rows).map(({ t, rows: g }) => {
		const cell = (v: string) => { const x = g.filter((r) => r.vowel === v && isReading(r.path)); return frac(x.filter((r) => (r.path.case === 'a' || r.path.case === 'c') && r.path.f2 === null).length, x.length); };
		return [t, cell('i'), cell('u')];
	});
	return table(['type', '[i] fR1 standing, fR2 absent', '[u] fR1 standing, fR2 absent'], body);
}

/** The main table with `f2Check` on (as `runCapture` ran it) and off (fR2 is the path's own whenever it has one): the status does not depend on the check. */
export function onOffTable(rows: MRow[]): string {
	const body = byType(rows).map(({ t, rows: g }) => {
		const on = g.filter((r) => bars(r).f2).length, off = g.filter((r) => preBars(r).f2).length;
		const bothOn = g.filter((r) => bars(r).f1 && bars(r).f2).length, bothOff = g.filter((r) => preBars(r).f1 && preBars(r).f2).length;
		return [t, g.length, frac(on, g.length), frac(off, g.length), frac(bothOn, g.length), frac(bothOff, g.length), g.filter((r) => isReading(r.path) && r.path.kept === false).length];
	});
	return table(['type', 'takes', 'fR2 within 12%, check on', 'check off', 'both bars, check on', 'check off', 'fR2 marked absent by the check'], body);
}
