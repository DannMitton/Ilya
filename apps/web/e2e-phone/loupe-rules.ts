/**
 * N.153 STAGE 5. THE FIVE RULES, each a function of what the scan collected
 * and nothing else. The set is the brief's DESK DEFAULT (§4) and Dann may
 * correct it: correcting it changes which of these the spec asserts, never how
 * the scan collects.
 *
 * Every function answers the violations it found, one line each, naming the
 * measure (the fixture's index, 0-based, which is what the ids and the console
 * carry; the loupe's tag prints it one higher) and the ids involved.
 */
import type { Probe } from './loupe-probe';

export const TAP_FLOOR_PX = 44;
/** Clause 13's drawn clearance, in line-gaps. */
export const SQUIRCLE_CLEARANCE_LG = 1.6;
/** How far a caret's stem may stand from the middle of its space: DESK DEFAULT, under a pixel's worth of doubt. */
export const CENTRE_TOLERANCE_PX = 1;
/** Rounding allowance on a clearance compared in client pixels. */
const CLEARANCE_EPS_PX = 0.25;

/** One console line of the spacing loop, parsed. */
export interface Derivation {
	measure: number;
	minGap: number;
	pageMinGap: number;
	renders: number;
	ms: number;
	worst: number;
	/**
	 * INFERRED, NOT LOGGED: `deriveMinGap` returns `converged: false` only where
	 * the ceiling itself stays under the floor, and every `converged: true`
	 * return carries a worst of at least the floor (`loupe-render.ts:126-149`),
	 * so converged is exactly worst >= 44.
	 */
	convergedInferred: boolean;
	/** The warn line's pairs, where one followed. */
	offending: string[];
}

export interface ScanState {
	step: number;
	/** What the selection was: a note (the squircle drawn), a rest, or a gap. */
	kind: 'note' | 'rest' | 'gap';
	probe: Probe;
}

const DEBUG_RE = /^\[loupe\] m\.(\d+) minGap ([\d.]+) \(page ([\d.]+)\), (\d+) renders in (\d+) ms, worst ([\d.]+|Infinity) px$/;
const WARN_RE = /^\[loupe\] m\.(\d+) kept minGap ([\d.]+) short of the (\d+) px floor: (.*)$/;

/** Parse the loupe's console lines, in the order they came, into derivations. */
export function parseDerivations(lines: { type: string; text: string }[]): Derivation[] {
	const out: Derivation[] = [];
	for (const l of lines) {
		const d = DEBUG_RE.exec(l.text);
		if (d) {
			const worst = d[6] === 'Infinity' ? Infinity : Number(d[6]);
			out.push({
				measure: Number(d[1]),
				minGap: Number(d[2]),
				pageMinGap: Number(d[3]),
				renders: Number(d[4]),
				ms: Number(d[5]),
				worst,
				convergedInferred: worst >= TAP_FLOOR_PX,
				offending: [],
			});
			continue;
		}
		const w = WARN_RE.exec(l.text);
		if (w) {
			const last = [...out].reverse().find((x) => x.measure === Number(w[1]));
			if (last) last.offending = w[4] ? w[4].split('; ') : [];
		}
	}
	return out;
}

const heldOf = (s: ScanState) => s.probe.heldMeasure ?? -1;
const sepLines = (p: Probe): { a: string; b: string; px: number }[] => {
	const c = [...p.carets].sort((x, y) => x.cx - y.cx);
	const out: { a: string; b: string; px: number }[] = [];
	for (let i = 1; i < c.length; i++) out.push({ a: c[i - 1].after || 'head', b: c[i].after || 'head', px: c[i].cx - c[i - 1].cx });
	return out;
};

/** The smallest drawn separation between neighbouring caret centres, in this state. */
export function drawnWorst(p: Probe): number {
	return Math.min(Infinity, ...sepLines(p).map((s) => s.px));
}

/**
 * RULE 1, clause 13. No adjacent pair of caret hit centres nearer than 44 CSS px
 * at phone width. Read two ways, and both must hold: the search's own answer
 * (the worst over every selection, from the console) and every drawn state.
 */
export function rule1TapFloor(derivations: Derivation[], states: ScanState[]): string[] {
	const out: string[] = [];
	const lastByMeasure = new Map<number, Derivation>();
	for (const d of derivations) lastByMeasure.set(d.measure, d);
	for (const [m, d] of [...lastByMeasure].sort((a, b) => a[0] - b[0])) {
		if (!d.convergedInferred) out.push(`m.${m} search: worst ${d.worst.toFixed(2)} px, unconverged; ${d.offending.join('; ') || 'no pairs logged'}`);
	}
	for (const s of states) {
		for (const pair of sepLines(s.probe)) {
			if (pair.px < TAP_FLOOR_PX) out.push(`m.${heldOf(s)} step ${s.step} (${s.kind}) drawn: ${pair.a} to ${pair.b} ${pair.px.toFixed(2)} px`);
		}
	}
	return out;
}

/** A caret's drawn distance to the squircle's outer stroke, in px: negative where they overlap in x. */
export function squircleDistance(p: Probe, after: string): { edge: number; centre: number } | null {
	const c = p.carets.find((x) => x.after === after);
	if (!c || !p.ring) return null;
	const r = p.ring;
	const edge = c.ink.right <= r.left ? r.left - c.ink.right : c.ink.left >= r.right ? c.ink.left - r.right : -Math.min(c.ink.right - r.left, r.right - c.ink.left);
	const centre = c.cx <= r.left ? r.left - c.cx : c.cx >= r.right ? c.cx - r.right : -Math.min(c.cx - r.left, r.right - c.cx);
	return { edge, centre };
}

/**
 * RULE 2, clause 13. No caret nearer than 1.6 line-gaps to the squircle's stroke.
 * MEASURED ON THE DRAWN MARK, its nearest arrowhead or stem edge, since the
 * clause names daylight; the hit centre's distance is reported beside it.
 * Only where a note is taken, since only then is a squircle drawn.
 */
export function rule2SquircleClearance(states: ScanState[]): string[] {
	const out: string[] = [];
	for (const s of states) {
		if (s.kind !== 'note' || !s.probe.ring) continue;
		const need = SQUIRCLE_CLEARANCE_LG * s.probe.lineGapPx;
		for (const c of s.probe.carets) {
			const d = squircleDistance(s.probe, c.after);
			if (d && d.edge < need - CLEARANCE_EPS_PX) {
				out.push(
					`m.${heldOf(s)} step ${s.step}, caret after ${c.after || 'head'}: drawn ${d.edge.toFixed(2)} px (${(d.edge / s.probe.lineGapPx).toFixed(2)} lg), centre ${d.centre.toFixed(2)} px, needs ${need.toFixed(2)} px`,
				);
			}
		}
	}
	return out;
}

/** RULE 3, clause 7. No mark of an adjacent measure is drawn, at either end. */
export function rule3NoAdjacentMarks(states: ScanState[]): string[] {
	const out = new Set<string>();
	for (const s of states) for (const f of s.probe.foreign) out.add(`m.${heldOf(s)}: ${f.attr}="${f.id}" visible in the ${f.panel} panel`);
	return [...out];
}

/** RULE 4, clause 11. No barline drawn at the loupe's left, whatever it belongs to. */
export function rule4NoOpeningBarline(states: ScanState[]): string[] {
	const out = new Set<string>();
	for (const s of states) {
		const first = s.probe.entries[0];
		if (!first) continue;
		const firstLeft = first.ink?.left ?? first.cx;
		for (const b of s.probe.barlines) {
			if (b.visible && b.cx < firstLeft) out.add(`m.${heldOf(s)}: a barline is drawn in the ${b.panel} panel at x ${b.cx.toFixed(1)}, left of the first entry ${first.id}`);
		}
	}
	return [...out];
}

export interface CentreRow {
	measure: number;
	after: string;
	leftBy: string;
	rightBy: string;
	offsetPx: number | null;
}

/**
 * The space a caret names, bounded by ink: the entry before it and the entry
 * after it, or the barline's facing edge at either end, or the body's own edge
 * where the render drew no barline there. The squircle is not a boundary here:
 * this reads only states where none is drawn.
 */
export function centring(p: Probe): CentreRow[] {
	const rows: CentreRow[] = [];
	const e = p.entries;
	const bodyBars = p.barlines.filter((b) => b.panel === 'body');
	for (const c of p.carets) {
		const i = e.findIndex((x) => x.id === c.after);
		let left: number | null;
		let leftBy: string;
		if (i >= 0) {
			left = e[i].ink?.right ?? null;
			leftBy = e[i].id;
		} else {
			const firstLeft = e[0]?.ink?.left ?? Infinity;
			const bar = bodyBars.filter((b) => b.cx < firstLeft).sort((a, b) => b.cx - a.cx)[0];
			left = bar ? bar.right : p.body.left;
			leftBy = bar ? 'opening barline' : 'body edge';
		}
		const next = e[i + 1];
		let right: number | null;
		let rightBy: string;
		if (next) {
			right = next.ink?.left ?? null;
			rightBy = next.id;
		} else {
			const lastRight = e[e.length - 1]?.ink?.right ?? -Infinity;
			const bar = bodyBars.filter((b) => b.cx > lastRight).sort((a, b) => a.cx - b.cx)[0];
			right = bar ? bar.left : p.body.right;
			rightBy = bar ? 'closing barline' : 'body edge';
		}
		const stem = (c.ink.left + c.ink.right) / 2;
		rows.push({
			measure: p.heldMeasure ?? -1,
			after: c.after,
			leftBy,
			rightBy,
			offsetPx: left !== null && right !== null ? stem - (left + right) / 2 : null,
		});
	}
	return rows;
}

/**
 * RULE 5, the position rule and clause 1. Every caret stands in the middle of
 * the space it names (read where no squircle is drawn), and touches nothing in
 * any state. THE BEAM IS NOT "SOMETHING", clause 15, ruled by Dann 2026-09-21:
 * beam contacts are `beamContacts`' row and never these violations.
 */
export function rule5Position(states: ScanState[]): { centre: string[]; touch: string[]; notMeasured: string[] } {
	const centre = new Set<string>();
	const notMeasured = new Set<string>();
	const touch = new Set<string>();
	for (const s of states) {
		if (s.kind !== 'note' || !s.probe.ring) {
			for (const r of centring(s.probe)) {
				if (r.offsetPx === null) notMeasured.add(`m.${r.measure} caret after ${r.after || 'head'}: ink not found on a side (${r.leftBy} | ${r.rightBy})`);
				else if (Math.abs(r.offsetPx) > CENTRE_TOLERANCE_PX)
					centre.add(`m.${r.measure} caret after ${r.after || 'head'}: ${r.offsetPx > 0 ? '+' : ''}${r.offsetPx.toFixed(2)} px off the middle of ${r.leftBy} to ${r.rightBy}`);
			}
		}
		for (const c of s.probe.contacts) {
			if (c.kind === 'beam') continue;
			touch.add(`m.${heldOf(s)} caret after ${c.after || 'head'} touches ${c.what}${c.owner ? ` of ${c.owner}` : ''}${s.kind === 'note' ? ' (a note taken)' : ''}`);
		}
	}
	return { centre: [...centre], touch: [...touch], notMeasured: [...notMeasured] };
}

/** Clause 15's own row: beam contacts, counted, visible, and never a violation. */
export function beamContacts(states: ScanState[]): string[] {
	const out = new Set<string>();
	for (const s of states) for (const c of s.probe.contacts) if (c.kind === 'beam') out.add(`m.${heldOf(s)} caret after ${c.after || 'head'}`);
	return [...out];
}
