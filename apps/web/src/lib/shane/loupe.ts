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

import { METER_RUN_IN_SP } from '@ilya/score-parser';

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
 *
 * THIS LEFT EDGE IS COUPLED TO `headBound` AND MUST NOT OVERLAP IT.
 * `clipToHead` carries the whole of that rule and what it cost when it was
 * only an accident of construction. Read it before changing either.
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
	/** The band a tap must land in, if this target is bounded. See `tapBand`. */
	top?: number;
	bottom?: number;
}

/* ── HOW FAR BEYOND THE STAFF A TAP STILL COUNTS ─────────────────────────
   Dann's walk on `893ccb4` found the page's tap band unbounded vertically: a
   click an inch below the staff still raised the loupe, because the search
   took the nearest hit rectangle's centre with no limit on how far away that
   was. Ruled: a tap must land on or near the staff to count, bounded in
   STAVE-SPACES and not pixels so it holds at every zoom.

   FINE POINTERS GET TWO LEDGER LINES' WORTH, plus the half-space a notehead
   sitting on the second of them occupies: 2.5 spaces beyond the staff. That is
   not only the ruling's own figure, it is this document's: MEASURED for §14,
   the highest ink on the page stands 13.88 units above the staff's top line
   against a 5.5-unit space, which is 2.52 spaces. So the band covers every
   note the engraving actually draws and little else.

   COARSE POINTERS GET SEVEN, and the number is the thumb's, not the music's.
   MEASURED on the portrait thumbnail, one stave-space is 2.57 px and the
   renderer's own hit rectangle is 28.3 px tall — well under the 44 px floor
   this project holds for touch. Clearing 44 needs 17.1 spaces of total band,
   so seven beyond the staff gives 18 spaces, 46.3 px, and clears it. GEOMETRY
   ANSWERS MODALITY (principle 7): the same staff, read twice.

   WHAT THIS COSTS, said plainly: on the portrait thumbnail the systems are
   pitched 49 px apart, so bands 46.3 px tall very nearly meet, and between two
   systems a tap picks whichever staff is nearer rather than nothing. The band
   still ends: taps in the title, in the margins, beside the page and below the
   last system now do nothing, which is the defect that was reported. */
export const FINE_TAP_SPACES = 2.5;
export const COARSE_TAP_SPACES = 7;

/**
 * One target's tap band, from the hit rectangle the renderer drew for it.
 *
 * The rectangle runs `staffTop - 3.5 * lineGap` to `staffBottom + 3.5 * lineGap`
 * around a staff of `4 * lineGap` (`staff-renderer.ts:1007-1011`), so it is
 * eleven spaces tall with the staff as its middle four, and one space is an
 * eleventh of it. That is the same arithmetic the loupe recovers `lineGap` by,
 * and it is why the band can be read off the rectangle without the caller
 * knowing anything about the renderer's units.
 */
export function tapBand(
	rectTop: number,
	rectHeight: number,
	spaces: number,
): { top: number; bottom: number } {
	const space = rectHeight / 11;
	return {
		top: rectTop + (3.5 - spaces) * space,
		bottom: rectTop + (7.5 + spaces) * space,
	};
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
		/* A TARGET MAY CARRY A BAND, and where it does the tap must land inside
		   it however near the centre is otherwise. A target without one is
		   unbounded on purpose: the loupe's own targets live inside a window
		   that is cropped and `overflow: hidden`, so the window is already the
		   bound and a second one would only be a place for the two to drift. */
		if (t.top !== undefined && (y < t.top || y > t.bottom!)) continue;
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

/* THE INSERTION BAR IS GONE, N.113a. `InsertionBar` and `insertionBar` stood
   here from 2026-08-26 until 2026-09-07, when Dann walked `e1bcb67` and ruled
   the mark out: the bar drew AFTER the notehead and read as an insertion point
   between two notes, *"misleading because the insertion point was in the space
   after тес"*. The loupe now keeps the page's own selection ring in its clone
   (`Loupe.svelte`, the clone cleanup), so there is one mark for the taken note
   on both surfaces and no geometry here for a second one. */

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
 * THE DISCRIMINATOR: where the head's ink stops and the music's begins.
 *
 * The head is the clef and the key signature, ruled by Dann 2026-08-27, and it
 * ends where the music's first ink begins. Naming that boundary is the whole
 * of the rule, and it is done here rather than in the component so there is
 * one place to read it.
 *
 * IT IS PAINT ORDER, GATED BY A HANDLE. The renderer emits a system in one
 * fixed order: the staff lines, the clef (`staff-renderer.ts:1172`), the
 * octave `8` (`:1196`), the key signature (`:1215`), and only then the tacet
 * pass (`:1382`), the note loop (`:1532`) and the underlay (`:2044`). So
 * everything before the FIRST element carrying a music handle is the head's
 * furniture, and everything from it onward is not.
 *
 * `MUSIC_MARK` IS THAT GATE. Three handles, and the renderer puts them on
 * every drawn part of a note and on nothing else:
 *
 * - `[data-event-id] > :not([data-hit])`, a notehead with its stem, flag and
 *   ledger lines (`:1731`). The group itself is deliberately not matched: its
 *   own box contains the hit rectangle.
 * - `[data-of-event]`, a part drawn OUTSIDE that group because it precedes the
 *   group in paint order: an accidental (`:1559`) or an augmentation dot
 *   (`:1708`). An accidental sits LEFT of its notehead, and MEASURED on the
 *   engraved Without Sun song 1 it is the leftmost music ink on two of the
 *   seven systems, at x = 66.38 against a notehead at 72.5.
 * - `[data-tacet]`, N.104's consolidated multibar rest (`:1214-1340`).
 *
 * WHY A GATE AND NOT A LIST. The underlay carries no handle at all
 * (`:2044`, `:2049`), and it is drawn wider than the note it sits under: on
 * six of the seven systems the first syllable begins LEFT of the first
 * notehead. A head bounded on the marked music alone paints that syllable,
 * which is a word where a clef and key belong. Paint order catches it without
 * asking the renderer for a new handle, because the underlay is emitted last.
 *
 * WHAT THE HEAD KEEPS. Anything the renderer draws before the gate and leaves
 * unmarked lands INSIDE the head. That is the right side for a clef, a key
 * signature and the octave `8`, and it would be the right side for a printed
 * time signature. **Ilya draws no time signature anywhere today**: `:1102`
 * reads `timeSignature` for spacing and nothing emits it.
 */
export const MUSIC_MARK = '[data-event-id] > :not([data-hit]), [data-of-event], [data-tacet]';

/**
 * Where the loupe's head ends: the leftmost ink drawn from `MUSIC_MARK` on.
 *
 * The caller measures each candidate off the DOM as drawn rather than
 * computing any of it from the renderer's constants, which are options a
 * caller can change. Same register as the boundary-barline search in
 * `Loupe.svelte`, which the file's own comment insists is found as drawn.
 *
 * Zero when the system draws no music at all. The loupe never rises on one:
 * `Loupe.svelte`'s frame effect returns early on its `ownIds.length === 0`
 * guard when the held measure carries no event ids, and a system of nothing
 * but rests carries none.
 *
 * THIS BOUND IS COUPLED TO `measureWindow`'S LEFT EDGE AND MUST NOT OVERLAP
 * IT. `clipToHead` carries the whole of that rule. Read it before changing
 * what this returns.
 */
export function headBound(inkXs: readonly number[]): number {
	const all = inkXs.filter((n) => Number.isFinite(n));
	if (all.length === 0) return 0;
	return Math.max(0, Math.min(...all));
}

/**
 * THE WINDOW BEGINS WHERE THE HEAD ENDS, and the two are one rule rather than
 * two quantities that happen to agree.
 *
 * WHAT THEY ARE. `headBound` is the leftmost MUSIC INK on the system, so the
 * head paints `[0, head]`. `measureWindow`'s left is the leftmost HIT
 * RECTANGLE of the held measure, which the renderer tiles from the midpoint
 * BEFORE each note (`staff-renderer.ts:1011`). The loupe draws the two crops
 * flush, at one scale, so any x they both contain is painted twice.
 *
 * THEY WERE THE SAME NUMBER BY CONSTRUCTION UNTIL 2026-08-29. The head was
 * bounded on `Math.min(...allHits)` then, which is the same quantity this
 * window opens on, so an overlap was impossible and the coupling was never
 * written down. `510a280` moved the head onto the music's ink to stop it
 * cutting the key signature, and broke the coupling without noticing.
 *
 * WHAT DANN WALKED, 2026-09-01. On a measure that OPENS a system the leftmost
 * hit rectangle stands at x = 56, LEFT of the key signature's second sharp,
 * whose ink runs 56.01 to 61.25; the head now runs to 63.53 or beyond. So the
 * head drew that sharp and the window drew it again, and the loupe showed
 * three sharps in a key signature that has two. MEASURED on all six affected
 * measures of the engraved Without Sun song 1: overlaps of 7.53, 8.98, 10.38,
 * 13.33, 14.77 and 13.14 units, with exactly one glyph inside each.
 *
 * NOTHING IS LOST, AND THAT IS A PROOF RATHER THAN A HOPE. The head paints
 * `[0, head]` and the clipped window paints `[head, right]`, so their union is
 * `[0, right]`, which is exactly the union the unclipped pair painted. The clip
 * changes the PARTITION and not the coverage, so it cannot remove a note, an
 * accidental, a rest or a syllable whatever the discarded region holds. A mark
 * that straddles the seam is cut by the head's crop and resumes at the window's,
 * and the two halves abut because the caller draws the crops adjacent at one
 * scale: MEASURED, the five staff lines cross it on every system and read as
 * one stave.
 *
 * THE CLAMP CANNOT BITE TODAY and is kept for the same reason `measureWindow`
 * keeps its own `left + 1`: a window narrower than a unit is not a window. A
 * head past the held measure's right edge would need a system whose first
 * measure carries a hit rectangle and no music ink at all, and a hit rectangle
 * is only ever emitted for a note (`staff-renderer.ts:1011`), whose notehead is
 * ink. NOT ESTABLISHED by a test on the page, because the case cannot be built
 * from this renderer.
 */
export function clipToHead(win: MeasureWindow, head: number): MeasureWindow {
	if (!Number.isFinite(head) || !(head > win.left)) return win;
	return { left: Math.min(head, win.right - 1), right: win.right };
}

/**
 * THE RUN-IN FROM THE METER TO THE MUSIC lives in `@ilya/score-parser` since
 * N.139, beside the page renderer that draws the same meter, so there is exactly
 * one. Its source and Dann's ruling are with it there. Re-exported so the
 * loupe's callers and tests keep their import.
 */
export { METER_RUN_IN_SP };

/**
 * THE AIR BETWEEN THE KEY SIGNATURE AND THE METER, in stave-spaces. The
 * renderer separates its clef from its key signature by one stave-space, on
 * Gould r236, p. 41 (`staff-renderer.ts`, `clefX = ksStart - sp(1) - clefW`),
 * and the meter takes the same separation from the key. DESK DEFAULT: Gould's
 * own figure for key to meter was not read, because the book is not on this
 * machine.
 */
export const METER_LEAD_SP = 1;

/** One time-signature digit's SMuFL box, in stave-spaces. */
export interface MeterDigit {
	char: string;
	bBoxSW: readonly [number, number];
	bBoxNE: readonly [number, number];
}

/** The meter panel, in page units, with x measured from the panel's own left edge. */
export interface MeterLayout {
	/** The panel's width: the air the head lacks, the wider digit group, and the run-in the body lacks. */
	span: number;
	/** Each digit's `<text>` origin: its x, and its baseline. */
	glyphs: { char: string; x: number; y: number }[];
}

/**
 * N.138. The meter the loupe supplies for the measure it holds, laid out as a
 * third panel between the head and the body.
 *
 * Ruled by Dann 2026-09-14: *"insert the correct corresponding meter signature
 * for every measure the Loupe displays, even if that measure does not feature a
 * verbatim meter signature marking in the score."*
 *
 * A PANEL AND NOT A WIDER HEAD. `headBound` and `clipToHead` partition one clone
 * into two crops, and that partition carries a proof. This panel is the loupe's
 * own drawing and sits between the two crops, so neither bound moves.
 *
 * THE DIGITS ARE PLACED THE WAY SMUFL DRAWS THEM. Every time-signature digit is
 * two stave-spaces tall and centred on its baseline: MEASURED in all three
 * faces' metadata, `timeSig4` runs -0.964 to 1.0 in Finale Maestro, -1.0 to
 * 1.004 in Bravura, and -0.992 to 0.996 in Leland. So the count's baseline is
 * the second line from the top and the unit's the second line from the bottom,
 * and each group fills its two spaces.
 *
 * THE WIDTH COMES FROM THE FONT. A group is as wide as its digits' boxes laid
 * edge to edge, and the two groups are centred on the wider. No chosen constant
 * sets the ink's width.
 *
 * EACH SIDE MAKES UP ONLY THE AIR ITS NEIGHBOUR LACKS. The head ends at the
 * system's first music ink and the body begins on the held measure's crop, and
 * both already open some air of their own, so a fixed clearance on each side
 * would double it where it exists.
 *
 * THE LEFT. `headAir` is the space from the head's last glyph to the head's
 * right edge. Since increment 2 the caller ends the head's crop ON that glyph,
 * so it passes 0 and the panel supplies the whole of `METER_LEAD_SP`: Dann
 * walked `78f3db8` and found *"an inexplicable gap between the key signature
 * and the meter signature"*, which was the head's own run-in air, about eight
 * spaces on a mid-system measure, standing before a panel that only topped it
 * up. The parameter stays for a caller whose head still carries air.
 *
 * THE RIGHT. `bodyAir` is the
 * space the body's own crop already opens with, from its left edge to the
 * measure's first ink. A measure that opens its system has none, because the
 * body starts on that ink; a mid-system measure opens half a gap after its
 * barline and has some. Either way the meter's ink stands at least
 * `METER_RUN_IN_SP` clear of the first thing in the measure.
 *
 * Null for a signature no digit can spell, so a malformed measure draws no
 * panel rather than a wrong one.
 */
export function meterLayout(
	beats: number,
	beatType: number,
	digit: (d: number) => MeterDigit,
	lineGap: number,
	staffTop: number,
	headAir: number,
	bodyAir: number,
): MeterLayout | null {
	const valid = (n: number) => Number.isInteger(n) && n > 0;
	if (!valid(beats) || !valid(beatType) || !(lineGap > 0) || !Number.isFinite(staffTop)) return null;

	const group = (n: number) =>
		[...String(n)].map((c) => {
			const g = digit(Number(c));
			return { g, width: (g.bBoxNE[0] - g.bBoxSW[0]) * lineGap };
		});
	const count = group(beats);
	const unit = group(beatType);
	const widthOf = (gs: { width: number }[]) => gs.reduce((a, b) => a + b.width, 0);
	const ink = Math.max(widthOf(count), widthOf(unit));

	const gapBefore = (want: number, have: number) =>
		Math.max(0, want * lineGap - (Number.isFinite(have) ? Math.max(0, have) : 0));
	const lead = gapBefore(METER_LEAD_SP, headAir);

	const glyphs: MeterLayout['glyphs'] = [];
	const place = (gs: { g: MeterDigit; width: number }[], baseline: number) => {
		let x = lead + (ink - widthOf(gs)) / 2;
		for (const { g, width } of gs) {
			glyphs.push({ char: g.char, x: x - g.bBoxSW[0] * lineGap, y: baseline });
			x += width;
		}
	};
	place(count, staffTop + lineGap);
	place(unit, staffTop + 3 * lineGap);

	return { span: lead + ink + gapBefore(METER_RUN_IN_SP, bodyAir), glyphs };
}

/**
 * N.139 round 3. Where the body opens on a measure that changes meter
 * mid-system.
 *
 * Ruled at the desk 2026-09-16: *"a measure that changes meter mid-system must
 * show exactly 2 spaces from its meter to the first note, as the page does."*
 *
 * WHAT WAS WRONG. The page draws the change after its barline and holds the
 * first note `METER_RUN_IN_SP` clear of it. The loupe strips the page's meter
 * from its clone and draws its own panel, so the body opened on the measure's
 * window as before and carried the page meter's whole room as empty stave:
 * three spaces on Without Sun song 1, m. 2.
 *
 * THE FIX. The body opens where the page's meter ink ends. The page already
 * stands the first note the run-in clear of that edge, so when the caller passes
 * `meterLayout` the air to that NOTE (not to the underlay, which sits below the
 * stave), it finds `bodyAir` complete and adds nothing, and the panel's digits
 * meet the note at the page's own run-in.
 *
 * `meterRights` is every page meter's ink right edge on the system. The one
 * that belongs to this measure ends at or before the measure's first note and
 * within `METER_RUN_IN_SP + METER_LEAD_SP` of it. An earlier measure's meter is
 * a note column and a barline further left, so it cannot qualify.
 *
 * NOTHING THE BODY DRAWS IS CUT. `inkXs` is the music's ink as the frame
 * measures it, underlay included, and the edge never passes the leftmost of it
 * inside the window. Where a long syllable reaches left of the page's meter,
 * the body opens on the syllable, and the note then stands further than the
 * run-in from the panel. NOT MEASURED: neither walk score has such a syllable.
 *
 * Returns `view` unchanged where no page meter belongs to the measure.
 */
export function openAfterPageMeter(
	view: MeasureWindow,
	meterRights: readonly number[],
	firstNoteInk: number,
	inkXs: readonly number[],
	lineGap: number,
): MeasureWindow {
	if (!Number.isFinite(firstNoteInk) || !(lineGap > 0)) return view;
	const reach = (METER_RUN_IN_SP + METER_LEAD_SP) * lineGap;
	let edge = -Infinity;
	for (const r of meterRights) {
		if (!Number.isFinite(r) || r > firstNoteInk + 1e-6 || r < firstNoteInk - reach) continue;
		edge = Math.max(edge, r);
	}
	if (!Number.isFinite(edge)) return view;
	for (const x of inkXs) if (Number.isFinite(x) && x >= view.left && x < view.right) edge = Math.min(edge, x);
	if (!(edge > view.left) || !(edge < view.right - 1)) return view;
	return { left: edge, right: view.right };
}

/** One mark's horizontal extent, in its system's coordinates. */
export interface InkSpan {
	left: number;
	right: number;
}

/**
 * N.138 increment 2. What the head's shortened crop would drop, and whether the
 * loupe carries it.
 *
 * THE HEAD NOW ENDS ON THE HEADER'S LAST GLYPH, the clef or the key signature's
 * last accidental, instead of at `headBound`, the system's first music ink. The
 * body still opens at `headBound`, so the stretch between the two is drawn by
 * neither crop. ON THE PAGE IT IS NOT ALWAYS EMPTY STAVE. Established by reading
 * the renderer's paint order: everything from the `MUSIC_MARK` gate on lies at
 * or right of `headBound` by construction, so only what is painted BEFORE the
 * gate and carries no mark can stand there. Three things can:
 *
 * - a REST's glyph, which gets neither an event group nor a hit rectangle
 *   (`staff-renderer.ts`, the `ev.type === 'rest'` branch), so a system that
 *   opens on rests has them all before the gate;
 * - the first sung note's LEDGER LINES, pushed before its group opens, and a
 *   ledger line is wider than its notehead, so its left end stands just left of
 *   `headBound`;
 * - a BARLINE between two opening measures of rests.
 *
 * The renderer draws no tempo mark, dynamic or rehearsal mark anywhere, so
 * none of those can land there today. A future one that is painted before the
 * gate would be carried by this same rule without a change here.
 *
 * `band` is every such mark's extent: pre-gate ink that is not the header, not a
 * stave line and not the ground. The carried band opens on the leftmost of them
 * that reaches past the header, and closes at `headBound`, where the body opens,
 * so the carried band and the body abut exactly the way the old head and body
 * did, and a ledger line that straddles the seam is still whole.
 *
 * CARRIED ONLY WHERE IT ABUTS THE BODY. On a measure that opens its system,
 * `clipToHead` opens the body at `headBound` and the band is that measure's own
 * opening. On a mid-system measure the body opens further right and the band is
 * an EARLIER measure's ink, whose other contents the body already leaves out,
 * so it is left out too and null is returned. DESK DEFAULT.
 */
export function carryBand(
	headerRight: number,
	head: number,
	viewLeft: number,
	band: readonly InkSpan[],
): InkSpan | null {
	if (![headerRight, head, viewLeft].every(Number.isFinite) || !(headerRight < head)) return null;
	if (Math.abs(viewLeft - head) > 1e-6) return null;
	let left = Infinity;
	for (const b of band) {
		if (!(b.right > headerRight) || !(b.left < head)) continue;
		left = Math.min(left, Math.max(b.left, headerRight));
	}
	return Number.isFinite(left) ? { left, right: head } : null;
}

/**
 * N.138 increment 3. How far the stave runs on past a measure's closing barline,
 * in stave-spaces. DESK DEFAULT, recorded in `docs/memory/OPEN.md` §N.138 as the
 * desk's figure and not Gould's: one space, the barline clearance the project
 * already uses. Dann overrules it once he has seen it.
 */
export const EXCERPT_TAIL_SP = 1;

/** A staff-spanning vertical as drawn: its centre x and its stroke width. */
export interface Vertical {
	x: number;
	width: number;
}

/**
 * The held measure's OPENING barline, found as drawn: the rightmost
 * staff-spanning vertical left of the measure's first note's ink.
 *
 * Found on the walk of `eb7d220`, 2026-09-16: a measure that opens on a REST lost
 * the rest in the loupe. MEASURED on Kabalevsky T05, mm. 28, 35, 37, 57 and 81.
 * The renderer draws a rest with no hit rectangle, and a note's hit rectangle
 * starts halfway from the column before it (`staff-renderer.ts:2894`), so where
 * that column is the rest, `measureWindow` opened BETWEEN the rest and the note:
 * on m. 37, at 576.00 against the rest's ink at 558.52 to 564.09. The old search
 * then took a barline only INSIDE that window, and this barline, at 543.28, lies
 * left of it. The same code was deployed at `570d76f`.
 *
 * WHY THE RIGHTMOST, AND WHY LEFT OF THE FIRST NOTE. A measure has no barline
 * inside it, so the nearest barline left of its first note is its own opening,
 * whatever columns (rests, a multibar rest's closing edge) stand between. A
 * barline RIGHT of the first note is never the opening: N.141 measured T05 m. 23,
 * where a tacet run's barline stood in the window's left half, right of every
 * note, and the crop opened past them.
 *
 * Null where none stands left of the note, which is a system's first measure:
 * the renderer draws no barline before a slice's first column, and the caller
 * keeps the window it had. Null too where the first note's ink is unknown, so a
 * missing measurement cannot fall through to the system's closing barline.
 */
export function openingBarline(verticals: readonly Vertical[], firstNoteInk: number): Vertical | null {
	if (!Number.isFinite(firstNoteInk)) return null;
	let found: Vertical | null = null;
	for (const v of verticals) {
		if (!Number.isFinite(v.x) || !(v.x < firstNoteInk)) continue;
		if (found === null || v.x > found.x) found = v;
	}
	return found;
}

/**
 * Whether a `<text>` holds a SMuFL rest glyph: one character in the Rests range,
 * U+E4E0 to U+E4FF. The renderer draws a rest as a bare glyph with no handle,
 * so the glyph is the only thing that says it is a rest.
 */
export function isRestGlyph(text: string | null | undefined): boolean {
	if (!text) return false;
	const chars = [...text];
	if (chars.length !== 1) return false;
	const cp = chars[0].codePointAt(0) ?? 0;
	return cp >= 0xe4e0 && cp <= 0xe4ff;
}

/** The leftmost x in `[left, right)`, or `Infinity` where none falls there. */
export function firstInkIn(xs: readonly number[], left: number, right: number): number {
	let first = Infinity;
	for (const x of xs) if (Number.isFinite(x) && x >= left && x < right && x < first) first = x;
	return first;
}

/**
 * N.138 increment 3. The held measure's closing barline, found as drawn.
 *
 * Ruled by Dann 2026-09-14: *"I am asking for the stave lines to protrude
 * uniformly a little beyond the barline. Users will understand this to mean
 * that the measure is extracted from the middle of a piece. The only measure
 * that should terminate with the barline flush right is the final measure."*
 *
 * THE MIRROR OF THE OPENING SEARCH, `memo-mobile-slice3_r1_2026-08-26.md` §11:
 * `verticals` are the lines that span exactly the staff, found by the caller
 * the same way, and a measure has no barline inside it, so the first one right
 * of the window's opening edge is the one that closes it.
 *
 * A FINAL BARLINE IS TWO LINES, thin then thick half a space apart
 * (`staff-renderer.ts`, `options.finalBarline`, Gould r96), and the renderer
 * draws that pair only where the piece ends. So a second staff-spanning line
 * within a stave-space of the first marks the final bar, and the crop takes the
 * whole pair.
 *
 * `right` is the outer edge of the closing stroke, where the body's crop ends.
 * Null when no line is found, and the caller keeps the edge it had.
 */
export function closingBarline(
	verticals: readonly Vertical[],
	after: number,
	lineGap: number,
): { right: number; final: boolean } | null {
	const lines = verticals.filter((v) => Number.isFinite(v.x) && v.x > after).sort((a, b) => a.x - b.x);
	if (lines.length === 0 || !(lineGap > 0)) return null;
	const pair = lines.filter((v) => v.x - lines[0].x <= lineGap);
	const right = Math.max(...pair.map((v) => v.x + Math.max(0, v.width) / 2));
	return { right, final: pair.length >= 2 };
}

/** A rectangle, in whatever units the caller names. */
export interface Box {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * N.141 step 2. The page's selection ring, placed on the loupe's strip.
 *
 * The loupe draws its panels side by side at one `scale`, and the body panel's
 * left edge in page units is `viewLeft`, at `bodyLeftPx` along the strip. The
 * page's coordinates run on continuously across that edge, so one linear map
 * places the ring wherever it reaches, including left of the body over the
 * meter's run-in or the carried band, which is exactly the reach a ring cut to
 * the body could not have. Vertically the strip starts at the crop's top.
 *
 * THE SHAPE IS THE PAGE'S, ruled 2026-09-14: same box, same corner, same
 * stroke, only scaled. Nothing here adjusts it.
 */
export function stripRing(
	ring: Box & { radius: number; stroke: number },
	viewLeft: number,
	bodyLeftPx: number,
	cropTop: number,
	scale: number,
): Box & { radius: number; stroke: number } {
	return {
		x: bodyLeftPx + (ring.x - viewLeft) * scale,
		y: (ring.y - cropTop) * scale,
		width: ring.width * scale,
		height: ring.height * scale,
		radius: ring.radius * scale,
		stroke: ring.stroke * scale,
	};
}

/**
 * N.141 step 2. The ink band the loupe crops to, widened above so the ring fits.
 *
 * `inkCrop` pads the page's ink band by half a stave-space. The ring stands
 * `reach` above the highest ink it encloses, which is more than that, so on the
 * page's tallest system its top was cut: MEASURED 2026-09-15 on the engraved
 * Without Sun song 1, 60 of 96 notes, by 0.37 to 3.37 units. The band grows
 * above by only what the pad does not already give. It is a page-wide constant
 * like the band itself, so the frame still does not breathe between notes.
 */
export function ringRoom(page: PageInk | null, lineGap: number, padSpaces: number, reach: number): PageInk | null {
	if (!page) return page;
	return { ...page, above: page.above + Math.max(0, reach - lineGap * padSpaces) };
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

/** N.149. The loupe's two modes: Syllables draws no carets, Corrections draws them and holds the correction cells. */
export type LoupeMode = 'syllables' | 'corrections';
