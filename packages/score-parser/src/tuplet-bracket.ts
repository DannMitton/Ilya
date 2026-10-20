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
  /** Row 129: a beamed triplet is drawn as the publisher draws it, the numeral alone, no line. */
  bare?: boolean;
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

/**
 * A run's span and the numeral's x (row 129, Dann 2026-10-19 23:21).
 *
 * A run of an odd count whose every note stands on a beam stem of ONE beam group
 * (the group may hold other notes too) is drawn WITHOUT a bracket, as the
 * publisher prints it: the numeral alone, centred on the middle note: over the
 * point where its stem meets the beam when the stems are up, over its notehead
 * when they are down. Its span is then the numeral's own box, so a slur has only
 * the numeral to clear. Any other run keeps the bracket, centred between its ends.
 */
export function bracketSpan(
  run: ReadonlyArray<{ x: number; ev: { id: string } }>,
  beamStemById: ReadonlyMap<string, { sx: number; up: boolean; group?: object }>,
): { xa: number; xb: number; midX: number; bare: boolean } {
  const ends = { xa: run[0].x - 8, xb: run[run.length - 1].x + 8 };
  const stems = run.map((p) => beamStemById.get(p.ev.id));
  const mid = stems[run.length >> 1];
  if (run.length % 2 === 1 && mid && stems.every((st) => st && st.group === mid.group && st.up === mid.up)) {
    const midX = mid.up ? mid.sx : run[run.length >> 1].x;
    return { xa: midX - NUMERAL_HALF_GAP, xb: midX + NUMERAL_HALF_GAP, midX, bare: true };
  }
  return { ...ends, midX: (ends.xa + ends.xb) / 2, bare: false };
}

export function bracketMarkup(b: BracketRec): string {
  const { xa, xb, midX, yBr, thickness: tupletT } = b;
  const numeral = `<text x="${midX}" y="${yBr + 3.5}" text-anchor="middle" font-size="11" font-style="italic" fill="#1a1612">${b.n}</text>`;
  if (b.bare) return `<g data-tuplet="${b.n}">${numeral}</g>`;
  return (
    `<g data-tuplet="${b.n}">` +
    `<line x1="${xa}" y1="${yBr + 5}" x2="${xa}" y2="${yBr}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
    `<line x1="${xa}" y1="${yBr}" x2="${midX - 7}" y2="${yBr}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
    `<line x1="${midX + 7}" y1="${yBr}" x2="${xb}" y2="${yBr}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
    `<line x1="${xb}" y1="${yBr}" x2="${xb}" y2="${yBr + 5}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
    numeral +
    `</g>`
  );
}
