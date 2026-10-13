/**
 * The rings' numbers, in a system's own user units (QUEUE row 78c). The
 * selection ring's padding and stroke lived in the app's `selection-ring.ts`,
 * which draws on the page; since row 78c the renderer must know them too,
 * because the notes make room for the red crossing ring before a pixel is
 * drawn. One source for both, so the room the renderer leaves and the ring the
 * page draws cannot drift. `selection-ring.ts` re-exports the selection ring's
 * numbers under their old names.
 *
 * THE PROPORTIONS of the selection ring were ruled by Dann 2026-08-28 (§24 of
 * the calm-loupe slice 4 memo), its height grammar 2026-09-14 to 2026-09-20
 * (`OPEN.md` §N.141). The red ring's offset is row 78c's.
 */

/** Horizontal air between the note's own ink and the selection ring's edge. */
export const RING_PAD_X = 4;
/** Air above the system's highest note ink, and below a note with no underlay. */
export const RING_PAD_Y = 9;
/** The narrowest the box may be, so a bare notehead is not shrink-wrapped. */
export const RING_MIN_W = 15;
export const RING_RADIUS = 6;
/** The selection ring's stroke, which the stylesheet also sets: the clamps have to know it. */
export const RING_STROKE = 2;

/**
 * How far the selection ring can reach above the highest ink it encloses,
 * stroke included. The loupe's crop leaves at least this much above the page's
 * ink, or the ring's top is cut.
 */
export const RING_REACH = RING_PAD_Y + RING_STROKE / 2;

/** The crossing's ink, unchanged from the renderer's old rectangle (row 34). */
export const CROSSING_INK = '#b23b3b';
/** The crossing ring's stroke, unchanged (row 34). */
export const CROSSING_STROKE = 1.8;

/**
 * THE RED RING STANDS OUTSIDE THE SELECTION RING, ALWAYS (Dann 2026-10-11
 * 20:11 to 20:12, `OPEN.md` "THE RED CROSSING RING STANDS OUTSIDE THE
 * SELECTION RING"). It is the selection ring's box grown on every side by the
 * selection ring's stroke plus a gap of that stroke (DESK DEFAULT, 2 + 2), so
 * when the note is taken the two rings nest and both show.
 */
export const CROSSING_RING_OFFSET = RING_STROKE * 2;
/** Its corner, concentric with the selection ring's (DESK DEFAULT): 6 + 4. */
export const CROSSING_RING_RADIUS = RING_RADIUS + CROSSING_RING_OFFSET;

/**
 * How far the red ring's outer edge stands beyond the ink it encloses, left and
 * right: the selection ring's padding, the offset, and half the red stroke.
 * The ring encloses the note's IPA syllable too, so where the syllable is wider
 * than the note the reach is measured from the syllable's edge. 8.9.
 */
export const CROSSING_RING_REACH = RING_PAD_X + CROSSING_RING_OFFSET + CROSSING_STROKE / 2;

/**
 * How much more headroom a system holding a crossing needs above the
 * renderer's one stave space: the selection ring's top sits a stave space above
 * the highest ink, and the red ring stands the offset and half its stroke
 * beyond it. 4.9.
 */
export const CROSSING_RING_HEADROOM = CROSSING_RING_OFFSET + CROSSING_STROKE / 2;
