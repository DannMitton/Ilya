/**
 * Where a system's closing barline puts its ink (QUEUE row 36).
 *
 * Dann, 2026-10-05 15:16, on a Tchaikovsky reading: bar 1's multimeasure rest
 * ends with clear space before its barline, the last bar's runs almost into
 * the final barline. "Can we adopt the spacing of m.1 for all multimeasure
 * rests?" The tacet rest is bounded by the centre of the barline stroke
 * nearest it, which an opening or mid-system barline already gives. At the
 * system's end the bound was `contentRight`, the stave's outer edge: half a
 * thin stroke past a single barline's centre, and, where the piece ends, past
 * the thick stroke and the half space before it to the thin one, so the
 * H-bar's inset was spent inside the barline.
 */

/**
 * The centre of the stroke a system's closing barline draws nearest the music:
 * the single thin line, or, where the piece ends, the thin line of Gould r96's
 * thin-plus-thick pair, which stands half a stave-space before the thick one
 * (QUEUE row 36). Both sit inside `contentRight`, the stave's outer edge, as
 * the end barline draws them.
 */
export function closingBarlineStrokeX(
  contentRight: number,
  finalBarline: boolean,
  t: { thin: number; thick: number; halfSpace: number },
): number {
  const r = (v: number): number => Math.round(v * 100) / 100;
  if (!finalBarline) return r(contentRight - t.thin / 2);
  const thickX = r(contentRight - t.thick / 2);
  return r(thickX - t.halfSpace - t.thick / 2);
}
