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

/**
 * What the loupe needs to know about the page as a whole, in staff units.
 *
 * Gathered by measuring the rendered page once, so it holds for every measure
 * on it. See `Loupe.svelte`'s `pageMetrics`.
 */
export interface PageInk {
	/** How far the highest ink on the page rises above the staff's top line. */
	above: number;
	/** How far the lowest ink falls below it. */
	below: number;
	/** The narrowest measure's width, head included; `Infinity` if unknown. */
	minTotalSpan: number;
}

/** The loupe's vertical crop, in the system's own coordinates. */
export interface Crop {
	top: number;
	height: number;
}

/**
 * The crop, cut to the page's ink rather than to the renderer's reserved box.
 *
 * WHY THE PAGE'S INK AND NOT THE MEASURE'S. Dann, 2026-08-27: the loupe was
 * too loose around its content, and empty loupe is page the singer cannot see.
 * The obvious cure is to cut the frame to each measure — but the same ruling
 * forbids the frame changing size as the singer steps, and MEASURED across one
 * document's seventeen measures a per-measure frame swings between 68.15 and
 * 80.89 units. So the cut is the page's ink band: the furthest any measure
 * reaches above the staff and the furthest any reaches below it. One height
 * for the page, containing every measure, clipping none.
 *
 * ANCHORED TO THE STAFF. `staffTop` is the one landmark every system shares;
 * a system's viewBox top drifts with whatever its own highest note was.
 *
 * The fallback is the system's declared box, which is what the crop always
 * used, so a page that cannot be measured is no worse off than before.
 */
export function inkCrop(
	page: PageInk | null,
	staffTop: number,
	lineGap: number,
	padSpaces: number,
	fallback: Crop,
): Crop {
	if (!page || !Number.isFinite(page.above) || !Number.isFinite(page.below)) return fallback;
	const pad = lineGap * padSpaces;
	return { top: staffTop - page.above - pad, height: page.above + page.below + pad * 2 };
}

/**
 * The scale the loupe's WINDOW is sized at, which is not the scale the held
 * measure is drawn at.
 *
 * A measure too wide for the capped loupe is shown whole at less than full
 * magnification (`Loupe.svelte`, "THE HEAD SHARES THE FIT"), so its drawing is
 * shorter. A window held at full magnification keeps the difference as empty
 * loupe: MEASURED in landscape, where the cap bites hardest, a 254.4 px window
 * around a 212.4 px drawing. The window cannot follow the held measure without
 * breathing, so it follows the widest drawing the page can produce, which is
 * the narrowest measure's.
 *
 * UNDERSTATED ON PURPOSE. It is bounded above by the full-magnification height
 * the window always had, so an estimate that runs small costs a little air and
 * one that runs large would clip. This one runs small.
 */
export function windowScale(page: PageInk | null, fullScale: number, width: number): number {
	if (!page || !(page.minTotalSpan > 0) || !Number.isFinite(page.minTotalSpan)) return fullScale;
	return Math.min(fullScale, width / page.minTotalSpan);
}

/**
 * How far the loupe's frame is held inside the page's own edges, in pixels.
 *
 * Ruled by Dann 2026-08-28: the loupe must read as an appliance resting above
 * the page, not as part of it. MEASURED before the ruling, its frame matched
 * the page's width exactly — 816 into 816 on the desk, 382 into 382 in
 * portrait, no paper showing past it on either side — and a full-width bar on
 * the page's own bottom edge is a footer, which is a part of a document rather
 * than a thing set down on one.
 *
 * A FRACTION OF THE PAGE'S WIDTH, not a pixel count, so it holds at every
 * viewport. The fraction is the page's own: MEASURED, the sheet sits inside
 * the desk by 24 px on a 382-wide page in portrait (6.28% of its own width)
 * and by 58.3 px on an 816-wide page in landscape (7.14%). A sixteenth, 6.25%,
 * is the round number those two straddle, so the loupe standing inside the
 * page repeats the rhythm the page already makes against the desk.
 */
export function pageInset(stageWidth: number, fraction: number): number {
	return Math.max(0, stageWidth) * fraction;
}

/**
 * The y the loupe's CENTRE sits on, in viewport coordinates.
 *
 * Ruled by Dann 2026-08-28, correcting the round before it. That round placed
 * the loupe in the page's lower third with a ruled gap of 1.4 × the side inset
 * beneath it. **The lower third was this desk's own narrowing of his words and
 * was never his ruling**, and the result sat below the eyeline. The loupe is
 * centred on the page instead, and the foot is now whatever centring leaves
 * rather than a number of its own.
 *
 * `stageTop` and `stageBottom` bound as much of the page as the singer can
 * actually see: the sheet clipped to the room beside the dock and above it —
 * the viewport's floor on a desk, the dock's top edge on a phone, whichever
 * the page reaches first.
 *
 * A CENTRE RATHER THAN AN EDGE, because the centre is the thing being ruled.
 * The caller hangs the frame on it with `translateY(-50%)`, so the centring is
 * exact whatever the frame's chrome measures; an earlier pass computed a
 * bottom edge from an estimated height and MEASURED 6.5 px off true centre for
 * exactly that reason.
 *
 * `height` is therefore needed only for the clamps, and only the degenerate
 * case reads it. WHERE CENTRING IS IMPOSSIBLE, because the frame stands taller
 * than the room it is centred in, the frame is clamped on screen rather than
 * centred and the memo says so rather than the code pretending it centred: a
 * frame whose top has left the screen has lost the tag naming the measure and
 * the top of the staff with it.
 */
export function centreOnPage(
	stageTop: number,
	stageBottom: number,
	viewportHeight: number,
	height: number,
	gutter: number,
): number {
	const centre = stageTop + (stageBottom - stageTop) / 2;
	/* Never so low that the frame crosses the stage's floor, which on a phone
	   is the dock's top edge. */
	const lowest = stageBottom - height / 2;
	/* Never so high that its own top leaves the screen. */
	const highest = gutter + height / 2;
	return Math.min(Math.max(Math.min(centre, lowest), highest), viewportHeight - height / 2);
}
