/**
 * The three counts the switch-on brief r2 asks for at Step 5 (plus the desk's addition), from the per-take rows of `measure.run.ts` (`v` holds the variants, `DEFAULT_KEY`
 * the engine's default reading). Pure code, no I/O. Synthetic takes only.
 *
 *  1. [i] and [u] takes with fR1 standing (case a or c) and fR2 absent, per voice type: the readings that make a sung [ɨ] unanswerable for `divergence.ts` (`usable` needs an fR2).
 *  2. Readings the plausibility band used to turn from Captured to Provisional (`CalibrationWizard.svelte`, `withPlausibility`, before Step 5): Captured readings whose fR1
 *     `checkPlausibility` calls implausible for the voice type the set gives the take. The app also passes the singer's own anchors (`anchorF1sFor(profile)`), which a set
 *     of separate takes does not have, so the window here is the voice type's alone: NOT the app's exact window.
 *  3. [ɨ] readings the divergence pass used to turn Provisional (a missing or Provisional [i] or [u], or a divergent [ɨ]) and no longer does (the desk's addition,
 *     Dann 2026-11-13, `docs/memory/PRODUCT.md:1269-1270`). A profile here is the [i], [ɨ], and [u] takes of one voice type with the same take index `k`
 *     (12 per type), each as its default reading; the pass is the real `applyIghDivergence`, and the old status is derived from its `isDivergent`
 *     (null or true demoted, as the old code did).
 */
import { TYPES } from './fidelity-set';
import type { MRow } from './measure-core';
import { DEFAULT_KEY } from './variants';
import { checkPlausibility } from '$lib/voice/engine/plausibility';
import { applyIghDivergence, type IghReading } from '$lib/voice/engine/divergence';
import type { Vowel } from '$lib/voice/engine/types';

const pct = (n: number, d: number) => (d ? `${((100 * n) / d).toFixed(1)}%` : 'n/a');
const frac = (n: number, d: number) => `${n}/${d} (${pct(n, d)})`;
const table = (head: string[], rows: (string | number)[][]) => ['| ' + head.join(' | ') + ' |', '|' + head.map(() => '---').join('|') + '|', ...rows.map((r) => '| ' + r.join(' | ') + ' |')].join('\n');

const isReading = (r: MRow) => r.path.outcome === 'reading' && !!r.v?.[DEFAULT_KEY] && r.v[DEFAULT_KEY].f1 !== null;
const cellOf = (r: MRow) => r.v![DEFAULT_KEY];

/** Count 1: per voice type, [i] and [u] readings with fR1 standing (case a or c) and fR2 absent. */
export function iuAbsentTable(rows: MRow[]): string {
	const body = TYPES.map((t) => {
		const cell = (v: string) => {
			const x = rows.filter((r) => r.type === t && r.vowel === v && isReading(r));
			return frac(x.filter((r) => (cellOf(r).case === 'a' || cellOf(r).case === 'c') && cellOf(r).f2 === null).length, x.length);
		};
		return [t, cell('i'), cell('u')];
	});
	return table(['type', '[i] fR1 standing, fR2 absent', '[u] fR1 standing, fR2 absent'], body);
}

/** Count 2: Captured readings the plausibility band used to demote. */
export function plausibilityTable(rows: MRow[]): { text: string; total: number; of: number } {
	let total = 0, of = 0;
	const body = TYPES.map((t) => {
		const g = rows.filter((r) => r.type === t && isReading(r));
		const cap = g.filter((r) => r.path.reading === 'captured');
		const demoted = cap.filter((r) => checkPlausibility(cellOf(r).f1 as number, r.vowel as Vowel, t).plausibility === 'implausible');
		total += demoted.length; of += cap.length;
		const byVowel = [...new Set(demoted.map((r) => r.vowel))].map((v) => `${v}: ${demoted.filter((r) => r.vowel === v).length}`).join(', ');
		return [t, g.length, cap.length, frac(demoted.length, cap.length), byVowel || '-'];
	});
	return { total, of, text: table(['type', 'readings', 'Captured', 'implausible (used to be demoted)', 'by vowel'], body) };
}

interface IghCount { profiles: number; igh: number; own: number; missing: number; divergent: number; changed: number }
/** Count 3: [ɨ] readings the divergence pass used to demote. */
export function divergenceTable(rows: MRow[]): { text: string; total: IghCount } {
	const total: IghCount = { profiles: 0, igh: 0, own: 0, missing: 0, divergent: 0, changed: 0 };
	const body = TYPES.map((t) => {
		const c: IghCount = { profiles: 0, igh: 0, own: 0, missing: 0, divergent: 0, changed: 0 };
		for (let k = 0; k < 12; k++) {
			const pick = (v: string) => rows.find((r) => r.type === t && r.vowel === v && r.k === k);
			const ri = pick('i'), rg = pick('ɨ'), ru = pick('u');
			if (!rg || !isReading(rg)) continue;
			c.profiles++; c.igh++;
			const mk = (r: MRow | undefined): IghReading | undefined => {
				if (!r || !isReading(r)) return undefined;
				const cell = cellOf(r);
				return { f1: cell.f1 as number, ...(cell.f2 === null ? {} : { f2: cell.f2 }), confidence: r.path.confidence as IghReading['confidence'], reading: r.path.reading as IghReading['reading'], source: 'measured-user' } as IghReading;
			};
			const profile: Partial<Record<Vowel, IghReading>> = { ɨ: mk(rg) };
			const i = mk(ri), u = mk(ru);
			if (i) profile.i = i;
			if (u) profile.u = u;
			const own = profile.ɨ!.reading;
			applyIghDivergence(profile);
			const out = profile.ɨ!;
			if (out.reading !== own) throw new Error('the divergence pass changed a status: it must only describe');
			if (own !== 'captured') continue;
			c.own++;
			// The old pass: a null isDivergent (an anchor missing, Provisional, or without an fR2) or a divergent [ɨ] became Provisional.
			if (out.isDivergent === null) { c.missing++; c.changed++; }
			else if (out.isDivergent === true) { c.divergent++; c.changed++; }
		}
		for (const key of Object.keys(total) as (keyof IghCount)[]) total[key] += c[key];
		return [t, c.igh, c.own, c.missing, c.divergent, `${c.changed} (${pct(c.changed, c.own)})`];
	});
	return { total, text: table(['type', '[ɨ] readings (one per take index)', 'Captured on their own evidence', 'old pass: Provisional for a missing, Provisional, or fR2-less [i] or [u]', 'old pass: Provisional for divergence', 'changed by Step 5 (Captured now, Provisional before)'], body) };
}

/** All three, as Markdown, for one set. */
export function step5Tables(rows: MRow[], set: string): string {
	const p = plausibilityTable(rows), d = divergenceTable(rows);
	return [
		`## Step 5 counts, ${set} set (${rows.length} takes), under the engine's defaults (${DEFAULT_KEY})`,
		'\n### [i] and [u] with fR1 standing and fR2 absent\n', iuAbsentTable(rows),
		`\n### Readings the plausibility band used to demote (it no longer does)\n\nWindow: the voice type's, without the singer's own anchors (see \`step5-core.ts\`).\n\n`, p.text, `\n\nTotal: ${p.total} of ${p.of} Captured readings.`,
		`\n### [ɨ] readings the divergence pass used to demote (it no longer does)\n\nOne profile per voice type and take index: the [i], [ɨ], and [u] takes of that index.\n\n`, d.text,
		`\n\nTotal: ${d.total.changed} of ${d.total.own} Captured [ɨ] readings (${d.total.missing} for a missing or unusable [i] or [u], ${d.total.divergent} for divergence).`,
	].join('\n');
}
