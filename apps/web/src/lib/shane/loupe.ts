/**
 * loupe.ts — the arithmetic behind the loupe, as pure functions.
 *
 * N.92 mobile slice 2. The loupe is a VIEW TRANSFORM over the page that is
 * already on screen: it clones the held measure out of the rendered system and
 * shows it larger. Nothing here draws, and nothing here knows about the DOM.
 * `Loupe.svelte` reads the geometry off the injected SVG and hands it to these
 * functions, which is the `note-picker.ts` discipline: every rule is testable
 * under vitest's node environment with no browser.
 *
 * `VocalLineEvent` IS NOT TOUCHED. Nothing here adds a field to it, and the
 * reconciliation package is not read or imported.
 */

/** A system's measure range, from the renderer's own `data-system` attribute. */
export interface SystemRange {
	fromMeasure: number;
	toMeasure: number;
}

/** A hit rectangle's geometry, in its system's own coordinate space. */
export interface HitRect {
	x: number;
	width: number;
}

/** The x window the loupe shows, in the system's own coordinate space. */
export interface MeasureWindow {
	left: number;
	right: number;
}

/**
 * Parse one `data-system="12-17"` attribute. Returns null on anything that is
 * not two integers, so a renderer change cannot silently produce a system
 * numbered NaN of NaN in the measure tag.
 */
export function parseSystemRange(attr: string | null | undefined): SystemRange | null {
	if (!attr) return null;
	const m = /^(\d+)-(\d+)$/.exec(attr.trim());
	if (!m) return null;
	const fromMeasure = Number(m[1]);
	const toMeasure = Number(m[2]);
	if (toMeasure < fromMeasure) return null;
	return { fromMeasure, toMeasure };
}

/**
 * Which system holds a measure, zero-based, or -1 when none does.
 *
 * The ranges are the page's own, in document order, so the index this returns
 * is the number the measure tag prints after adding one. A measure belongs to
 * exactly one system: `paginateScore` packs by measure and never splits one.
 */
export function systemIndexOf(ranges: readonly SystemRange[], measureIndex: number): number {
	return ranges.findIndex((r) => measureIndex >= r.fromMeasure && measureIndex <= r.toMeasure);
}

/**
 * The x window of one measure inside its system.
 *
 * The renderer tiles the system with hit rectangles that meet at the midpoints
 * between neighbouring columns (`staff-renderer.ts:1011`), so a measure's own
 * hits START at the midpoint before its first note. The window therefore runs
 * from that midpoint to the midpoint before the NEXT measure's first note,
 * which puts a barline just inside each end and no neighbouring notehead
 * inside at all.
 *
 * A measure that ends its system has no next measure to bound it, so the
 * window runs to the system's right edge, which is where the closing barline
 * is drawn.
 */
export function measureWindow(
	own: readonly HitRect[],
	next: readonly HitRect[],
	systemWidth: number,
): MeasureWindow | null {
	if (own.length === 0) return null;
	const left = Math.max(0, Math.min(...own.map((r) => r.x)));
	const rightRaw = next.length > 0 ? Math.min(...next.map((r) => r.x)) : systemWidth;
	const right = Math.min(systemWidth, Math.max(rightRaw, left + 1));
	return { left, right };
}

/** A tappable entry, with its centre in viewport coordinates. */
export interface TapTarget {
	id: string;
	cx: number;
	cy: number;
}

/**
 * The entry nearest a tap.
 *
 * The page's own glyphs are far below the 44 px floor at thumbnail scale, and
 * item 9 exempts them. This is what makes the exemption safe: a coarse tap
 * lands somewhere in the measure and resolves to the nearest entry, rather
 * than needing to land on a 7 px notehead. Ties go to the earlier target, so
 * the same tap always resolves to the same entry.
 */
export function nearestTarget(targets: readonly TapTarget[], x: number, y: number): string | null {
	let best: string | null = null;
	let bestD = Infinity;
	for (const t of targets) {
		const dx = t.cx - x;
		const dy = t.cy - y;
		const d = dx * dx + dy * dy;
		if (d < bestD) {
			bestD = d;
			best = t.id;
		}
	}
	return best;
}

/**
 * Whether a pointer gesture is the dismissal swipe.
 *
 * Down, and more down than sideways, and far enough that a thumb resting on
 * the dock cannot make it by accident. The threshold is 56 px, one 44 px
 * target plus a little: below that the gesture is inside the size of the
 * control the finger started on.
 */
export const SWIPE_DISMISS_PX = 56;

export function isDismissSwipe(dx: number, dy: number): boolean {
	return dy >= SWIPE_DISMISS_PX && dy > Math.abs(dx);
}

/** The insertion bar's geometry, in the system's own coordinate space. */
export interface InsertionBar {
	/** The bar's centre line, through the notehead. */
	x: number;
	top: number;
	bottom: number;
	thickness: number;
	capWidth: number;
	capHeight: number;
}

/**
 * Finale Speedy's insertion bar, at the taken entry.
 *
 * A thin vertical bar bisecting the notehead, with a small inward triangle
 * capping each terminus so the bar never reads as a barline. Dann's ruling of
 * 2026-08-26 replaced the magnified selection outline with this: the shipped
 * outline rides the note's whole group, and the group's box includes the
 * transparent rectangle that makes a 7 px notehead tappable, so at 2.4 times
 * it read as a tall capsule around the entry rather than as a bar through it.
 *
 * IT SPANS THE STAFF, and reaches further only when the notehead sits outside
 * the staff on ledger lines. A bar that stopped at the staff would miss the
 * note it is meant to bisect, and a bar sized to the notehead alone would be
 * too short to read as Speedy's frame.
 *
 * Every number is in line gaps, so the bar scales with the engraving rather
 * than with the screen.
 */
export function insertionBar(
	centreX: number,
	staffTop: number,
	staffBottom: number,
	headTop: number,
	headBottom: number,
	lineGap: number,
): InsertionBar {
	return {
		x: centreX,
		top: Math.min(staffTop - lineGap, headTop - lineGap / 2),
		bottom: Math.max(staffBottom + lineGap, headBottom + lineGap / 2),
		thickness: lineGap * 0.22,
		capWidth: lineGap * 0.9,
		capHeight: lineGap * 0.8,
	};
}

/** A glyph's inked box, measured from the rendered face rather than declared. */
export interface InkBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * The box every glyph in one set is drawn into.
 *
 * WHY THE SET SHARES A BOX. A SMuFL duration glyph's origin is its NOTEHEAD,
 * and the stem runs out of the character's advance width, so laying the raw
 * characters out as text centres each notehead and leaves each note visibly
 * off-centre in its cell. Dann, 2026-08-26, at the walk: the centroid of the
 * note looks uncentred, and the margin inside the cell is not consistent.
 *
 * The cure is to draw each glyph's INK centred instead. Take the widest and
 * the tallest ink in the set, give every glyph that same box, and centre its
 * own ink inside it. One box for the set means one scale for the set, so a
 * whole note does not swell to the height of a sixteenth, and centred ink
 * means the same margin inside every cell.
 */
export function commonInkBox(boxes: readonly InkBox[]): { width: number; height: number } {
	return {
		width: Math.max(0, ...boxes.map((b) => b.width)),
		height: Math.max(0, ...boxes.map((b) => b.height)),
	};
}

/**
 * One glyph's `viewBox`, its ink centred inside the set's common box.
 *
 * Returned as the attribute string, because that is the only thing the caller
 * does with it and a four-number object would just be taken apart again.
 */
export function centredViewBox(box: InkBox, common: { width: number; height: number }): string {
	const x = box.x - (common.width - box.width) / 2;
	const y = box.y - (common.height - box.height) / 2;
	return `${round(x)} ${round(y)} ${round(common.width)} ${round(common.height)}`;
}

function round(n: number): number {
	return Math.round(n * 100) / 100;
}
