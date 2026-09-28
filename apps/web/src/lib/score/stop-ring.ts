/**
 * stop-ring.ts — the squircle on every stop the cursor can take: a note, a
 * rest, and a gap's caret.
 *
 * CALM-LOUPE SLICE 7, 2026-09-28. Dann's walk that afternoon, «Скучай» m. 25:
 * a taken rest carried no mark (*"I cannot effectively select a rest. Compare
 * this to the selection squircle on a note."*), and neither did a taken gap
 * (*"the squircle doesn't capture the carets as I expected."*). DESK DEFAULT
 * under his delegation of 01:36: one mark for every stop, the same squircle in
 * the same colour and stroke (`brief-code-calm-loupe-s7_r1_2026-09-28.md` §4).
 *
 * A note's and a rest's ring are `ringBox`'s (`selection-ring.ts`, whose
 * `entryGroup` finds a rest's anonymous group). This module holds what the
 * loupe needs besides: how wide a caret's ring may be, and when a ring may
 * not stand as a caret's boundary. `Loupe.svelte` calls it.
 */

import { RING_PAD_X, RING_STROKE } from './selection-ring';

/** A span of drawn ink across the stave, in native units. */
export interface InkSpan {
	left: number;
	right: number;
}

/**
 * The room a caret's ring has: from the caret's line at `x` to the nearest ink
 * on either side, in native units, and 0 where ink stands on the line itself.
 *
 * READ FROM EVERY ENTRY'S OWN INK, not from the gap's two neighbours, because
 * the order along the stave is not guaranteed where a measure opens on a
 * carried rest (MEASURED, «Скучай» m. 2: the head caret stands right of the
 * caret after the rest, a defect older than this slice, recorded in
 * `report-code-calm-loupe_r1_2026-09-28.md` §1 item 3). `leftEdge` is the
 * body's own left edge, since the opening barline is never drawn (THE CARET,
 * clause 11) and the panel past that edge keeps its own air; `rightEdge` is
 * the closing barline where the tail gap nudged it, or the body's right edge.
 * A beam may be bisected (ruled 2026-09-14), so the caller passes no beams.
 */
export function inkRoom(x: number, ink: readonly InkSpan[], leftEdge: number, rightEdge: number): number {
	let left = x - leftEdge;
	let right = rightEdge - x;
	for (const k of ink) {
		if (k.right <= x) left = Math.min(left, x - k.right);
		else if (k.left >= x) right = Math.min(right, k.left - x);
		else return 0;
	}
	return Math.min(left, right);
}

/**
 * A caret ring's least reach from its caret, to the stroke's OUTER edge: the
 * arrowhead's half-base, a stroke of air around it, and the stroke.
 */
export function caretRingFloor(armHalf: number): number {
	return armHalf + RING_STROKE * 1.5;
}

/**
 * The half-width of a caret's ring, to its stroke's centre, in a `room`
 * measured by `inkRoom`, and whether the room is short of the ring's floor.
 *
 * THE WIDTH IS THE NOTE'S PADDING AROUND THE ARROWHEADS: `RING_PAD_X` past
 * each end of the arrowhead's base, as a notehead's ink gets. `RING_MIN_W` is
 * not applied: it exists so a bare notehead is not shrink-wrapped, and a
 * caret's ring is already tall and narrow. CODE DEFAULT, reversible.
 *
 * IT NEVER TOUCHES A NEIGHBOUR'S INK (the brief, and THE CARET clauses 4 and
 * 13 read for the new mark). Where the padded ring would reach past the room,
 * it narrows to leave half a stroke of air past its stroke, and never below
 * its floor. The loupe's spacing search holds every caret's room to that floor
 * (`Loupe.svelte`, the ring pairs), so a short room is one the search could
 * not give, and the caller reports it; nothing is quietly overlapped.
 */
export function caretRingHalf(room: number, armHalf: number): { half: number; short: boolean } {
	const floor = caretRingFloor(armHalf);
	return {
		half: Math.max(floor - RING_STROKE / 2, Math.min(armHalf + RING_PAD_X, room - RING_STROKE)),
		short: room < floor,
	};
}

/**
 * A taken entry's ring as a caret's boundary: its two outer stroke edges, or
 * null where the ring may not stand as one.
 *
 * A RING THE CARRIED BAND HOLDS IS NOT A BOUNDARY. A measure that opens on a
 * rest carries that rest left of the body (N.138 increment 2), so its ring
 * stands wholly left of the measure's own window, where no caret is drawn.
 * MEASURED on «Скучай» m. 2 when a rest first took a ring: read as a boundary,
 * it put the head caret and the caret after the rest on one x, 1,052 px, two
 * carets with no glyph between them (THE CARET, clause 5). Such a ring leaves
 * the carets where the rest's own ink puts them, and it stands clear of them
 * by construction, in another panel.
 */
export function ringBoundary(
	r: { x: number; width: number; stroke: number } | null,
	windowLeft: number,
): InkSpan | null {
	if (!r || r.x + r.width < windowLeft) return null;
	return { left: r.x - r.stroke / 2, right: r.x + r.width + r.stroke / 2 };
}
