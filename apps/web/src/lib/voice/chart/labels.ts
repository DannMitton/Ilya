/**
 * WHERE EACH SYMBOL GOES (N.199 Step 6b). A symbol is set beside its dot, and a fixed offset cannot clear every voice: for a bass, [ʌ] and [ɑ] sit
 * one hertz apart on fR1 and [ɪ] lies under [e] (the Step 6 phone picture lost [ɪ]'s symbol under [e]'s dot). So each label tries four positions round
 * its dot, upper right (the old one), lower right, upper left, lower left, and takes the first that is clear of every dot, every label already placed, and
 * the frame. If none is clear it takes the one that hides least and says so (`clear: false`), so a test, or a later fix, can see it.
 *
 * Pure: pixels in, pixels out. The box of a symbol is a rectangle of `0.7 * size` by `size`, a little more than a Lato IPA vowel needs.
 */
export interface LabelAnchor {
	id: string;
	x: number;
	y: number;
	/** The radius of the dot the label sits beside; 0 for a bar. */
	r: number;
}

export type LabelSide = 'NE' | 'SE' | 'NW' | 'SW';

export interface PlacedLabel {
	id: string;
	/** The centre of the symbol's box. */
	x: number;
	y: number;
	side: LabelSide;
	/** No overlap with any dot, any earlier label, or the frame. */
	clear: boolean;
}

const SIDES: Array<[LabelSide, number, number]> = [
	['NE', 1, -1],
	['SE', 1, 1],
	['NW', -1, -1],
	['SW', -1, 1]
];
/** The old fixed offset, in units of the symbol's size: right 0.8, up 0.55. */
const DX = 0.8;
const DY = 0.55;
const GAP = 2;

interface Box {
	x: number;
	y: number;
	w: number;
	h: number;
}

const boxesOverlap = (a: Box, b: Box) => Math.abs(a.x - b.x) * 2 < a.w + b.w && Math.abs(a.y - b.y) * 2 < a.h + b.h;
/** A circle against a box: the nearest point of the box to the circle's centre is within the radius. */
function circleHitsBox(cx: number, cy: number, r: number, b: Box): boolean {
	const nx = Math.max(b.x - b.w / 2, Math.min(cx, b.x + b.w / 2));
	const ny = Math.max(b.y - b.h / 2, Math.min(cy, b.y + b.h / 2));
	return (cx - nx) ** 2 + (cy - ny) ** 2 < r * r;
}

export function placeLabels(anchors: readonly LabelAnchor[], size: number, bounds: { w: number; h: number }): PlacedLabel[] {
	const w = 0.7 * size;
	const h = size;
	const placed: PlacedLabel[] = [];
	const boxes: Box[] = [];
	for (const a of anchors) {
		let best: { side: LabelSide; box: Box; hits: number } | null = null;
		for (const [side, sx, sy] of SIDES) {
			const box: Box = { x: a.x + sx * DX * size, y: a.y + sy * DY * size, w, h };
			let hits = 0;
			if (box.x - w / 2 < 0 || box.x + w / 2 > bounds.w || box.y - h / 2 < 0 || box.y + h / 2 > bounds.h) hits += 1;
			for (const o of anchors) if (circleHitsBox(o.x, o.y, o.r + GAP, box)) hits += 1;
			for (const b of boxes) if (boxesOverlap(box, b)) hits += 1;
			if (!best || hits < best.hits) best = { side, box, hits };
			if (hits === 0) break;
		}
		boxes.push(best!.box);
		placed.push({ id: a.id, x: best!.box.x, y: best!.box.y, side: best!.side, clear: best!.hits === 0 });
	}
	return placed;
}
