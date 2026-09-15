/**
 * selection-ring.ts — the squircle that marks the taken note, as numbers both
 * surfaces read.
 *
 * `VoiceProfilePane.svelte` builds the ring on the page. Since N.141 step 2 the
 * loupe draws its own copy of that ring rather than showing a crop of the
 * page's, so the loupe needs the same stroke and the same reach to size its
 * crop. One source, so the two cannot drift.
 *
 * THE PROPORTIONS were ruled by Dann 2026-08-28 from the walk on `776c267`,
 * chosen by eye against full pages: §24 of the slice 4 memo. `RING_ASPECT`, the
 * height floor of that ruling, was ruled out on 2026-09-15 for N.141, and the
 * height now follows the system's IPA baseline (`docs/memory/OPEN.md` §N.141).
 */

/** Horizontal air between the note's own ink and the ring's edge. */
export const RING_PAD_X = 4;
/** Air above the system's highest note ink, and below a note with no underlay. */
export const RING_PAD_Y = 9;
/** The narrowest the box may be, so a bare notehead is not shrink-wrapped. */
export const RING_MIN_W = 15;
export const RING_RADIUS = 6;
/** The stroke, which the stylesheet also sets: the clamps have to know it. */
export const RING_STROKE = 2;

/**
 * How far the ring can reach above the highest ink it encloses, stroke
 * included. The loupe's crop leaves at least this much above the page's ink, or
 * the ring's top is cut.
 */
export const RING_REACH = RING_PAD_Y + RING_STROKE / 2;
