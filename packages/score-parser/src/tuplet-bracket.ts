/**
 * The tuplet bracket as a record, and its markup (row 126).
 *
 * MOVED OUT OF `staff-renderer.ts`, which is at its ratchet ceiling: the tuplet
 * pass keeps its geometry and pushes a `BracketRec`; the markup is built here,
 * after the printed-slur plan, because a slur wholly inside a bracket's run
 * raises the bracket (`planPrintedSlurs`), so `yBr` is not final until then.
 *
 * The markup is character for character what the pass built in place, so every
 * approved SVG that carries a `data-tuplet` group comes out identical.
 */
export interface BracketRec {
  /** The placed indices of the run's first and last event (a rest inside the run belongs to it). */
  from: number;
  to: number;
  /** The bracket's left and right ends, and the middle the numeral stands on. */
  xa: number;
  xb: number;
  midX: number;
  /** The bracket line's y; a slur drawn under it can raise it. */
  yBr: number;
  /** The numeral printed: the tuplet's `actualNotes`. */
  n: number;
  thickness: number;
}

/** The numeral's font size in px, and the half-gap the line leaves around it. */
const NUMERAL_PX = 11;
const NUMERAL_HALF_GAP = 7;
/** How far the numeral's baseline sits below the line. */
const NUMERAL_BASELINE_DROP = 3.5;

/**
 * The box the numeral occupies, in px: x from `midX - 7` to `midX + 7` (the gap
 * the line leaves), the top 0.75 of its font size above its baseline, the bottom
 * at the line. Defined once so the slur planner and the tests agree on it.
 */
export function numeralBox(b: Pick<BracketRec, 'midX' | 'yBr'>): { left: number; right: number; top: number; bottom: number } {
  return { left: b.midX - NUMERAL_HALF_GAP, right: b.midX + NUMERAL_HALF_GAP, top: b.yBr + NUMERAL_BASELINE_DROP - NUMERAL_PX * 0.75, bottom: b.yBr };
}

export function bracketMarkup(b: BracketRec): string {
  const { xa, xb, midX, yBr, thickness: tupletT } = b;
  return (
    `<g data-tuplet="${b.n}">` +
    `<line x1="${xa}" y1="${yBr + 5}" x2="${xa}" y2="${yBr}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
    `<line x1="${xa}" y1="${yBr}" x2="${midX - 7}" y2="${yBr}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
    `<line x1="${midX + 7}" y1="${yBr}" x2="${xb}" y2="${yBr}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
    `<line x1="${xb}" y1="${yBr}" x2="${xb}" y2="${yBr + 5}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
    `<text x="${midX}" y="${yBr + 3.5}" text-anchor="middle" font-size="11" font-style="italic" fill="#1a1612">${b.n}</text>` +
    `</g>`
  );
}
