/**
 * The tapered arc a tie and a syllabic slur draw. MOVED OUT OF `staff-renderer.ts`
 * by the loupe remainder brief, item 2, 2026-10-02, to make room under that file's
 * ratchet ceiling without raising it. A move, not a change.
 */

function round2px(v: number): number {
  return Math.round(v * 100) / 100;
}

/**
 * One tapered arc, outlined and filled: the shape both ties and slurs draw.
 *
 * GOULD 151, ONE DESIGN. A tie and a slur are the same object at different
 * flatness, so they are the same geometry here and differ only in the four
 * numbers handed in.
 *
 * WHAT SMuFL PROMISES, AND WHAT A CURVE ACTUALLY DRAWS. `tieMidpointThickness`
 * and `tieEndpointThickness` are DRAWN ink, the thickness of the finished shape
 * at its centre and at each terminal. A quadratic reaches only half way to its
 * control point, so the gap between two control points draws half as much ink,
 * and a renderer that feeds the font's number straight into a control point
 * draws a tie half the weight the font asked for. That was the defect N.125
 * measured on 2026-09-16.
 *
 * THE CONSTRUCTION. The outer edge runs the nominal arc, terminal to terminal
 * with control `y + depth`, exactly where the single curve always ran. The
 * inner edge returns `endThick` away at the terminals and `midThick` away at
 * the centre, which gives the shape blunt ends of the font's own height rather
 * than points. Writing the thickness as `2 * midThick - endThick` at the inner
 * control is what cancels the half-way rule: sampled across the span the ink is
 * `endThick + 4u(1-u)(midThick - endThick)`, so it is exactly `endThick` at
 * each end and exactly `midThick` at the centre.
 *
 * ENDS THAT ARE POINTS STAY POINTS. With `endThick` at 0 the two edges meet at
 * the terminals and the joining segment has no length, so the path is the
 * two-quadratic lens that primitive mode has always emitted, character for
 * character.
 *
 * @param x1 @param x2  The terminals' x, left and right.
 * @param y             The terminals' y; both ends sit level, as they always have.
 * @param depth         Signed arc height at the control point: negative bows up.
 * @param midThick      Drawn ink at the centre.
 * @param endThick      Drawn ink at each terminal.
 */
export function arcOutline(
  x1: number,
  x2: number,
  y: number,
  depth: number,
  midThick: number,
  endThick: number,
): string {
  const sgn = Math.sign(depth) || 1;
  const mid = round2px((x1 + x2) / 2);
  const inner = y + depth - sgn * (2 * midThick - endThick);
  const back = round2px(y - sgn * endThick);
  const out = `M${round2px(x1)} ${round2px(y)} Q ${mid} ${round2px(y + depth)} ${round2px(x2)} ${round2px(y)}`;
  const ret = `Q ${mid} ${round2px(inner)} ${round2px(x1)} ${back} Z`;
  return endThick === 0 ? `${out} ${ret}` : `${out} L ${round2px(x2)} ${back} ${ret}`;
}
