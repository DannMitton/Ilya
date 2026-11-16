/**
 * A TAP ON THE CHART FOCUSES A VOWEL (N.203 lane 59 Step 5; Dann 2026-11-16 00:32: "the vowel space map was supposed to be touch-sensitive").
 * Pure geometry, no DOM. A tap inside one or more zones focuses the vowel whose dot (sung, else placeholder) is nearest the tap, in the chart's own
 * units; a tap outside every zone focuses nothing. The tap is read against the view as it stands at that instant, so a tap mid-glide hits what is drawn.
 *
 * `zoneEllipse` is the same ellipse `ChartLayers.svelte` draws for a zone (the centre at the middle of its fR1 window on a log axis, `rx` from its fR2
 * half-span in semitones, `ry` from its fR1 window), so the tap and the drawing cannot disagree.
 */
import type { Vowel } from '../engine/types';
import { project, type View } from './geometry';
import type { PlaceholderDot, SungDot, Zone } from './zones';

const SEMITONE = Math.log(2) / 12;

export interface Ellipse {
	cx: number;
	cy: number;
	rx: number;
	ry: number;
}

/** A zone's ellipse in a `w` by `h` frame for `view`. */
export function zoneEllipse(zone: Zone, view: View, w: number, h: number): Ellipse {
	const c = project(view, w, h, Math.sqrt(zone.f1Low * zone.f1High), zone.f2Centre);
	return {
		cx: c.x,
		cy: c.y,
		rx: (w * zone.f2HalfSpanSemitones * SEMITONE) / (view.u0 - view.u1),
		ry: (h * (Math.log(zone.f1High) - Math.log(zone.f1Low))) / 2 / (view.v1 - view.v0)
	};
}

const inside = (e: Ellipse, x: number, y: number): boolean => ((x - e.cx) / e.rx) ** 2 + ((y - e.cy) / e.ry) ** 2 <= 1;

/**
 * The vowel a tap at (`x`, `y`) focuses, or null. Where a vowel has a sung reading its dot is that reading (a reading with no fR2 sits across its own
 * zone at its fR1, as the chart draws it: its x is the zone's centre); otherwise its dot is its placeholder.
 */
export function vowelForTap(
	x: number,
	y: number,
	view: View,
	w: number,
	h: number,
	zones: readonly Zone[],
	sung: readonly SungDot[],
	placeholders: readonly PlaceholderDot[]
): Vowel | null {
	let best: { vowel: Vowel; d: number } | null = null;
	for (const z of zones) {
		const e = zoneEllipse(z, view, w, h);
		if (!inside(e, x, y)) continue;
		const s = sung.find((d) => d.vowel === z.vowel);
		const p = placeholders.find((d) => d.vowel === z.vowel);
		let dot: { x: number; y: number } | null = null;
		if (s) {
			const hasF2 = typeof s.f2 === 'number' && s.f2 > 0;
			const q = project(view, w, h, s.f1, hasF2 ? s.f2! : 1);
			dot = { x: hasF2 ? q.x : e.cx, y: q.y };
		} else if (p) dot = project(view, w, h, p.f1, p.f2);
		if (!dot) continue;
		const d = Math.hypot(dot.x - x, dot.y - y);
		if (best === null || d < best.d) best = { vowel: z.vowel, d };
	}
	return best?.vowel ?? null;
}

/**
 * Where a client point falls in the chart's own units. The SVG is drawn with `preserveAspectRatio="xMidYMid meet"`, so a box of another shape letterboxes
 * the frame: the scale is the smaller of the two, and the frame is centred. A point in the letterbox is outside the frame (`null`).
 */
export function chartPoint(clientX: number, clientY: number, box: { left: number; top: number; width: number; height: number }, w: number, h: number): { x: number; y: number } | null {
	const scale = Math.min(box.width / w, box.height / h);
	if (!(scale > 0)) return null;
	const x = (clientX - box.left - (box.width - w * scale) / 2) / scale;
	const y = (clientY - box.top - (box.height - h * scale) / 2) / scale;
	return x < 0 || y < 0 || x > w || y > h ? null : { x, y };
}
