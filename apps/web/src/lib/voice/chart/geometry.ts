/**
 * The chart's geometry (N.199 Step 1): log-frequency axes, the full view, the zoom to one vowel, the eased mix between
 * two views, the hull. Pure numbers; no DOM. Board D's `target`, `mix`, and `hullOf` (`docs/sessions/n199-calibrate/
 * n199-board-d-drawer-desktop.dc.html`) are the references; where this file differs, this file governs.
 *
 * THE AXES (ruling 3, Dann 2026-11-12; Vennard's departure explained on the sheet). fR2 runs across, high on the left
 * to low on the right, so the tongue is forward on the left as on a phonetician's chart; fR1 runs down, low at the top.
 * Both are logarithmic: a semitone is the same distance everywhere. `u` is ln fR2, `v` is ln fR1.
 */
import type { Zone } from './zones';

/** A view: the log-frequency window the chart shows. `u0 > u1` (left to right), `v0 < v1` (top to bottom). */
export interface View {
	u0: number;
	u1: number;
	v0: number;
	v1: number;
}

/** A reading or placeholder to hold in view. `f2` is optional because a reading may have none (`CalibratedFormant.f2`). */
export interface ChartPoint {
	f1: number;
	f2?: number;
}

/** F5 and D7 in A440 equal temperament: where second resonances lie (Bozeman, *Practical Vocal Acoustics*, 2nd ed. (2025), p. 35). */
export const BOZEMAN_FR2_HZ = { low: 698.46, high: 2349.32 } as const;

/**
 * The extractor's search ranges, `extract.ts:9` (`F1R` 150 to 1200 Hz, `F2R` 500 to 3000 Hz), which are not exported. A
 * reading cannot lie outside them, so the chart never shows beyond them. `geometry.test.ts` reads that line and fails if
 * these two drift from it.
 */
export const EXTRACTOR_FR1_HZ = { low: 150, high: 1200 } as const;
export const EXTRACTOR_FR2_HZ = { low: 500, high: 3000 } as const;

/** JUDGEMENT: the margin round the data in the full view, as a fraction of the span it frames. */
export const VIEW_MARGIN = 0.06;
/** JUDGEMENT, board D's: the zoom to one vowel, as a multiple of the full view, limited to this range. */
export const ZOOM_MIN = 1.4;
export const ZOOM_MAX = 3.2;
/** JUDGEMENT, board D's: at full zoom a zone's extent fills about this fraction of the view along its tighter axis. */
const ZONE_FILL = 0.5;
/** JUDGEMENT: the room kept round a reading that lands outside the target view, as a fraction of that view's span. */
const WIDEN_MARGIN = 0.1;
/** A span below this (in log units, about 4 semitones) is never drawn: it would stretch a single point to the frame. */
const MIN_SPAN = 0.25;

const L = Math.log;
const semitone = Math.log(2) / 12;

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

/**
 * The full view: every zone, every placeholder, every reading of this voice, with a margin; fR2 held to Bozeman's F5 to
 * D7 wherever the data allow (an edge the data pass is not held back), and never beyond the extractor's search range.
 */
export function fullView(zones: readonly Zone[], points: readonly ChartPoint[] = []): View {
	let uLo = Infinity, uHi = -Infinity, vLo = Infinity, vHi = -Infinity;
	const take = (u: number | undefined, v: number | undefined) => {
		if (u !== undefined && isFinite(u)) { uLo = Math.min(uLo, u); uHi = Math.max(uHi, u); }
		if (v !== undefined && isFinite(v)) { vLo = Math.min(vLo, v); vHi = Math.max(vHi, v); }
	};
	for (const z of zones) {
		const h = z.f2HalfSpanSemitones * semitone;
		take(L(z.f2Centre) - h, L(z.f1Low));
		take(L(z.f2Centre) + h, L(z.f1High));
	}
	for (const p of points) take(p.f2 !== undefined && p.f2 > 0 ? L(p.f2) : undefined, p.f1 > 0 ? L(p.f1) : undefined);
	if (!isFinite(uLo) || !isFinite(vLo)) {
		// Nothing to frame: the extractor's own ranges.
		return { u0: L(EXTRACTOR_FR2_HZ.high), u1: L(EXTRACTOR_FR2_HZ.low), v0: L(EXTRACTOR_FR1_HZ.low), v1: L(EXTRACTOR_FR1_HZ.high) };
	}
	const mu = Math.max(uHi - uLo, MIN_SPAN) * VIEW_MARGIN;
	const mv = Math.max(vHi - vLo, MIN_SPAN) * VIEW_MARGIN;
	const bozLo = L(BOZEMAN_FR2_HZ.low), bozHi = L(BOZEMAN_FR2_HZ.high);
	// fR2: an edge of the data inside Bozeman's range is held to it; one outside it is not.
	let u1 = uLo >= bozLo ? Math.max(uLo - mu, bozLo) : uLo - mu;
	let u0 = uHi <= bozHi ? Math.min(uHi + mu, bozHi) : uHi + mu;
	u1 = Math.max(u1, L(EXTRACTOR_FR2_HZ.low));
	u0 = Math.min(u0, L(EXTRACTOR_FR2_HZ.high));
	const v0 = Math.max(vLo - mv, L(EXTRACTOR_FR1_HZ.low));
	const v1 = Math.min(vHi + mv, L(EXTRACTOR_FR1_HZ.high));
	return { u0, u1, v0, v1 };
}

/**
 * The view that moves in on one vowel's zone: board D's `target`. The factor is the one at which the zone's extent fills
 * about half the view along its tighter axis, held between `ZOOM_MIN` and `ZOOM_MAX`; the view is centred on the zone.
 * WIDENED to contain any `reading` that lands outside it, with room, so a dot is never drawn off the frame; the result is
 * held inside the extractor's search ranges.
 */
export function zoomTarget(full: View, zone: Zone, readings: readonly ChartPoint[] = []): View {
	const hu = zone.f2HalfSpanSemitones * semitone;
	const vLo = L(zone.f1Low), vHi = L(zone.f1High);
	const hv = (vHi - vLo) / 2;
	const uc = L(zone.f2Centre), vc = (vLo + vHi) / 2;
	const spanU = full.u0 - full.u1, spanV = full.v1 - full.v0;
	const z = clamp(Math.min(spanU / (2 * hu / ZONE_FILL), spanV / (2 * hv / ZONE_FILL)), ZOOM_MIN, ZOOM_MAX);
	const su = spanU / z / 2, sv = spanV / z / 2;
	let { u0, u1, v0, v1 } = { u0: uc + su, u1: uc - su, v0: vc - sv, v1: vc + sv };
	const padU = (u0 - u1) * WIDEN_MARGIN, padV = (v1 - v0) * WIDEN_MARGIN;
	for (const r of readings) {
		if (r.f2 !== undefined && r.f2 > 0) {
			const u = L(r.f2);
			if (u > u0) u0 = u + padU;
			if (u < u1) u1 = u - padU;
		}
		if (r.f1 > 0) {
			const v = L(r.f1);
			if (v < v0) v0 = v - padV;
			if (v > v1) v1 = v + padV;
		}
	}
	return {
		u0: Math.min(u0, L(EXTRACTOR_FR2_HZ.high)),
		u1: Math.max(u1, L(EXTRACTOR_FR2_HZ.low)),
		v0: Math.max(v0, L(EXTRACTOR_FR1_HZ.low)),
		v1: Math.min(v1, L(EXTRACTOR_FR1_HZ.high))
	};
}

/** Ease in and out (board D's `mix`): `t` from 0 to 1, clamped. */
export const ease = (t: number): number => {
	const x = clamp(t, 0, 1);
	return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
};

/** The view `t` of the way from `a` to `b`, eased. */
export function mixView(a: View, b: View, t: number): View {
	const k = ease(t);
	return { u0: a.u0 + (b.u0 - a.u0) * k, u1: a.u1 + (b.u1 - a.u1) * k, v0: a.v0 + (b.v0 - a.v0) * k, v1: a.v1 + (b.v1 - a.v1) * k };
}

/** How many times closer `view` is than `full` along fR2. */
export const zoomFactor = (full: View, view: View): number => (full.u0 - full.u1) / (view.u0 - view.u1);

/** Where a reading falls in a frame `w` by `h` px: fR2 to x (high on the left), fR1 to y (low at the top). */
export function project(view: View, w: number, h: number, f1: number, f2: number): { x: number; y: number } {
	return { x: (w * (view.u0 - L(f2))) / (view.u0 - view.u1), y: (h * (L(f1) - view.v0)) / (view.v1 - view.v0) };
}

/** The convex hull of the points (Andrew's monotone chain), in order round it; fewer than three distinct non-collinear points give []. */
export function hull(points: ReadonlyArray<readonly [number, number]>): Array<[number, number]> {
	const p = points.map((q) => [q[0], q[1]] as [number, number]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const cross = (o: [number, number], a: [number, number], b: [number, number]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
	const lo: Array<[number, number]> = [];
	const up: Array<[number, number]> = [];
	for (let k = 0; k < p.length; k++) {
		while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p[k]) <= 0) lo.pop();
		lo.push(p[k]);
	}
	for (let k = p.length - 1; k >= 0; k--) {
		while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p[k]) <= 0) up.pop();
		up.push(p[k]);
	}
	const h = lo.slice(0, -1).concat(up.slice(0, -1));
	return h.length >= 3 ? h : [];
}

/** The nice steps the grid picks from, Hz. */
const GRID_STEPS = [10, 20, 25, 50, 100, 200, 250, 500, 1000];

/** The smallest of `GRID_STEPS` that keeps lines at least `minPx` apart (at the middle of the span), and every multiple of it inside `[lo, hi]`. */
function gridAxis(loHz: number, hiHz: number, px: number, minPx: number): number[] {
	const midHz = Math.sqrt(loHz * hiHz);
	const pxPerLn = px / (Math.log(hiHz) - Math.log(loHz));
	const step = GRID_STEPS.find((s) => pxPerLn * Math.log((midHz + s) / midHz) >= minPx) ?? GRID_STEPS[GRID_STEPS.length - 1];
	const out: number[] = [];
	for (let f = Math.ceil(loHz / step) * step; f <= hiHz; f += step) out.push(f);
	return out;
}

/**
 * The size of the grid's numbers in the chart's own units, so they hold `cssPx` CSS px at any rendered width: the SVG scales to
 * the width it is given, so a size in its units shrinks with it. Before the first measure (`renderedW` 0) the frame's own width.
 */
export const labelSizeFor = (frameW: number, renderedW: number, cssPx = 11): number => Math.round((cssPx * frameW) / (renderedW || frameW));

/** A rectangle in the chart's own units. */
export interface Box {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

/**
 * WHERE THE GRID'S NUMBERS SIT, shared by the drawing (`ChartLayers.svelte`) and the rule below, so the two cannot disagree.
 * A column's number is centred on its line, its baseline `NUMBER_COL_BASELINE` em-and-a-bit below the top; a row's number
 * starts `NUMBER_ROW_X` from the left edge, its baseline `NUMBER_ROW_LIFT` above its line.
 */
export const NUMBER_ROW_X = 3;
export const NUMBER_ROW_LIFT = 3;
export const numberColBaseline = (labelSize: number): number => labelSize + 1;
/** The halo (`stroke-width: 3px`, `ChartLayers.svelte`) is part of a number's box: it paints over what it meets. */
export const NUMBER_HALO = 3;
/** An estimate, not the served face's measure: a digit is half an em wide (Source Sans 3's figures are narrower, so this errs towards dropping a number). */
const DIGIT_EM = 0.5;
/** A letter of an axis word, in em. Estimated; wider than a digit, so errs towards dropping a number. */
const WORD_EM = 0.55;
/** JUDGEMENT: the clearance kept between two numbers, or a number and an axis word, as a fraction of the number's size. */
const CLEARANCE_EM = 0.4;
/** JUDGEMENT: the room kept from the frame's edge, in chart units. */
const EDGE_INSET = 1;

/** A number's box, halo included: `cx` is its centre (a column) or its left (a row). */
const numberBox = (text: string, anchor: 'middle' | 'start', x: number, baseline: number, ls: number): Box => {
	const w = text.length * DIGIT_EM * ls + NUMBER_HALO;
	const x0 = anchor === 'middle' ? x - w / 2 : x - NUMBER_HALO / 2;
	return { x0, y0: baseline - 0.75 * ls - NUMBER_HALO / 2, x1: x0 + w, y1: baseline + NUMBER_HALO / 2 };
};

/**
 * The boxes of the axis words the capture chart draws inside its frame (`ChartLayers.svelte`, `axisWords`): "tongue forward"
 * bottom left, "tongue back" bottom right, the resonance symbol bottom centre, and the turned fR1 word down the right edge.
 * Widths are estimated from the letters; the symbol `fR2` is taken as 1.2 em.
 */
export function axisWordBoxes(w: number, h: number, ls: number, words: { front: string; back: string; open: string }): Box[] {
	const base = h - 5;
	const top = base - 0.75 * ls - NUMBER_HALO / 2;
	const bottom = base + 0.25 * ls + NUMBER_HALO / 2;
	const width = (s: string) => s.length * WORD_EM * ls + NUMBER_HALO;
	const sym = 1.2 * ls + NUMBER_HALO;
	const open = (1.2 + 0.4) * ls + width(words.open);
	return [
		{ x0: 5 - NUMBER_HALO / 2, y0: top, x1: 5 + width(words.front), y1: bottom },
		{ x0: w - 5 - width(words.back), y0: top, x1: w - 5 + NUMBER_HALO / 2, y1: bottom },
		{ x0: w / 2 - sym / 2, y0: top, x1: w / 2 + sym / 2, y1: bottom },
		// Turned a quarter turn: the glyphs rise towards the right edge from a baseline `ls` in from it.
		{ x0: w - 5 - ls - 0.25 * ls - NUMBER_HALO / 2, y0: h / 2 - open / 2, x1: w - 5 - ls + 0.8 * ls + NUMBER_HALO / 2, y1: h / 2 + open / 2 }
	];
}

const meets = (a: Box, b: Box, gap: number): boolean => a.x0 < b.x1 + gap && b.x0 < a.x1 + gap && a.y0 < b.y1 + gap && b.y0 < a.y1 + gap;

/** How round a number is: the rounder is kept first when two numbers meet (1000 before 500 before 100 before 50 ...). */
const roundness = (f: number): number => {
	const k = [1000, 500, 250, 100, 50, 25, 20, 10].findIndex((s) => f % s === 0);
	return k < 0 ? 8 : k;
};

/**
 * THE GRID'S NUMBERS NEVER RUN TOGETHER (N.199 readings brief, Step 2). Of the lines, the ones whose numbers are drawn: a
 * number whose box (halo included) would meet another number's box, an axis word, or the frame's edge is not drawn, and its
 * line stays. The rounder number wins a meeting; at a tie, a column wins over a row, then the lower in Hz. Widths are estimated (`DIGIT_EM`), so the thinning errs towards dropping a number.
 */
function numbersFor(cols: Array<{ f: number; x: number }>, rows: Array<{ f: number; y: number }>, w: number, h: number, ls: number, words: Box[]): { f2: number[]; f1: number[] } {
	const gap = CLEARANCE_EM * ls;
	const frame = { x0: EDGE_INSET, y0: EDGE_INSET, x1: w - EDGE_INSET, y1: h - EDGE_INSET };
	const inside = (b: Box) => b.x0 >= frame.x0 && b.y0 >= frame.y0 && b.x1 <= frame.x1 && b.y1 <= frame.y1;
	type C = { kind: 'f2' | 'f1'; f: number; box: Box; rank: number };
	const cands: C[] = [
		...cols.map((c) => ({ kind: 'f2' as const, f: c.f, box: numberBox(String(c.f), 'middle', c.x, numberColBaseline(ls), ls), rank: roundness(c.f) })),
		...rows.map((r) => ({ kind: 'f1' as const, f: r.f, box: numberBox(String(r.f), 'start', NUMBER_ROW_X, r.y - NUMBER_ROW_LIFT, ls), rank: roundness(r.f) }))
	]
		.filter((c) => inside(c.box) && !words.some((b) => meets(c.box, b, gap)))
		.sort((a, b) => a.rank - b.rank || (a.kind === b.kind ? 0 : a.kind === 'f2' ? -1 : 1));
	const kept: C[] = [];
	for (const c of cands) if (!kept.some((k) => meets(c.box, k.box, gap))) kept.push(c);
	return {
		f2: kept.filter((c) => c.kind === 'f2').map((c) => c.f).sort((a, b) => a - b),
		f1: kept.filter((c) => c.kind === 'f1').map((c) => c.f).sort((a, b) => a - b)
	};
}

/**
 * The grid for a view: fR2 columns and fR1 rows at round numbers of Hz, spaced at least `minPx` apart so a zoomed view gains
 * lines and the full view keeps few (`f2`, `f1`: the lines, as dense as `minPx` allows), and `f2Numbers`, `f1Numbers`: the
 * lines whose numbers are drawn, at `labelSize`, clear of each other, of `words` (the axis words' boxes, `axisWordBoxes`), and
 * of the frame's edge. A line with no number is still drawn.
 */
export function gridTicks(view: View, w: number, h: number, labelSize: number, words: readonly Box[] = [], minPx = 38): { f2: number[]; f1: number[]; f2Numbers: number[]; f1Numbers: number[] } {
	const f2 = gridAxis(Math.exp(view.u1), Math.exp(view.u0), w, minPx);
	const f1 = gridAxis(Math.exp(view.v0), Math.exp(view.v1), h, minPx);
	const xs = f2.map((f) => ({ f, x: project(view, w, h, 1, f).x })).filter((c) => c.x > 0 && c.x < w);
	const ys = f1.map((f) => ({ f, y: project(view, w, h, f, 1).y })).filter((r) => r.y > 0 && r.y < h);
	const n = numbersFor(xs, ys, w, h, labelSize, [...words]);
	return { f2, f1, f2Numbers: n.f2, f1Numbers: n.f1 };
}
