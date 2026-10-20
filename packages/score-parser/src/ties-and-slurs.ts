/**
 * The tie pass, the derived melisma slur, and the PRINTED slurs (N.188).
 *
 * MOVED OUT OF `staff-renderer.ts`: the tie pass (melisma build 3) and the
 * syllabic slur pass (melisma build 4) are verbatim what stood at
 * `staff-renderer.ts` 3182 to 3309 at `ba6f064`, wrapped as functions over the
 * renderer's own geometry, to make room under that file's ratchet ceiling
 * without raising it. The tie's direction rule gains one clause for a printed
 * slur that bows below; where no printed slur reaches it, the output is the
 * bytes it was.
 *
 * Everything here returns SVG parts and the ink it adds, so the renderer's
 * `lowestInk` and `highestInk` stay the renderer's.
 */
import type { AnalyzedScore } from './analysis-types';
import { arcOutline, slopedArcOutline } from './arc-outline';
import { slurEndKey } from './printed-marks';
import type { PreparedSmuflFont, RequiredGlyphName } from './smufl-metadata';
import type { NoteBase, Pitch, SlurEnd, VocalLineEvent } from './types';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * How far a syllabic slur's terminal sits from its notehead's centre, in stave
 * spaces, and how far it clears everything else it has to miss.
 *
 * THE HEAD ANCHOR IS THE TIE'S OWN. Dann on the walk of `34b143c`, 2026-09-16:
 * the m. 87 slur sits too high and the m. 30 tie is right. A tie anchors 4 px
 * from the notehead centre (`ey = y1 ± 4`); the slur was taking `y2 - 6` and
 * then another 6 in `sy = top - 6`, so it sat 12 px off the head, about seven
 * times the tie's clearance measured from the head's edge. One clearance now,
 * at the tie's distance. DESK DEFAULT: Dann judges the height on the walk.
 *
 * WHY THESE ARE FRACTIONS AND NOT DECIMALS. Both were px constants that ignored
 * the stave size, which is the second of the two N.4 faults this block already
 * carries a note about. Written over 5.5, the shipping `lineGap`
 * (`apps/web/src/lib/score/engraving.ts`), they draw the same pixel they drew
 * before at the shipping stave and scale everywhere else. `SLUR_CLEAR_SP` is
 * the old 6 px, unchanged in value and applied to the same two things: an
 * up-stem or beam tip, and the turning layer above its own accidental
 * clearance.
 */
export const SLUR_HEAD_ANCHOR_SP = 4 / 5.5;
export const SLUR_CLEAR_SP = 6 / 5.5;

/**
 * A printed slur is allowed this much rise at its apex above its chord, in
 * stave spaces, before an end that can move toward its stem does.
 *
 * WHERE IT COMES FROM. Dann's slur end-point rule (2026-10-19 15:5x, `OPEN.md`,
 * "slurs and ties drawn with a shoulder, not a parabola", the CORRECTED
 * paragraph): ends sit at the noteheads by default, and where that would force a
 * steep or deep curve to clear an inner note, the end moves off its head toward
 * the stem to keep the arc shallow. The rule names no number. This one is the
 * derived melisma slur's own ceiling: `Math.min(24, ...)` px of control lift at
 * the shipping 5.5 px stave is 24 / 5.5 stave spaces of control and half that at
 * the apex, because a quadratic reaches half way to its control point. DESK
 * DEFAULT, Dann judges it on the walk. Only DEPTH is tested; a steep chord with a
 * shallow arc is left alone (NOT ESTABLISHED as a case Dann's rule means).
 */
export const SLUR_SHALLOW_APEX_SP = 24 / 5.5 / 2;
/** JUDGEMENT. How far an end moves toward its stem on each try, in stave spaces. */
const SLUR_END_STEP_SP = 0.25;
/** JUDGEMENT. How far short of the stem's tip an end stops, in stave spaces. */
const SLUR_STEM_END_SP = 0.25;
/** JUDGEMENT. Clear air between a printed slur and a marking standing between it and the head. */
const MARK_SLUR_CLEAR_SP = 0.3;

export interface ArcPlaced {
  ev: VocalLineEvent;
  x: number;
}

/** The renderer's geometry that the arc passes read, handed over once. */
export interface ArcCtx {
  placed: ReadonlyArray<ArcPlaced>;
  o: { staffMidY: number; lineGap: number; runOnTieSp?: number };
  smufl: PreparedSmuflFont | undefined;
  sp: (v: number) => number;
  yFor: (p: Pitch) => number;
  analyzed: AnalyzedScore;
  headNameFor: (base: NoteBase) => RequiredGlyphName;
  stemUpFor: (ev: VocalLineEvent, noteY: number) => boolean;
  beamStemById: ReadonlyMap<string, { sx: number; tipY: number; up: boolean }>;
  stemLen: number;
  stemHalfUp: number;
  stemHalfDown: number;
  staffTop: number;
  staffBottom: number;
  /** Where the system's music starts, after its head. */
  contentLeft: number;
  contentRight: number;
  arcInk: { tieMid: number; tieEnd: number; slurMid: number; slurEnd: number };
  /** The ink bounds as they stand; the pass returns them widened. */
  lowestInk: number;
  highestInk: number;
}

export interface ArcOut {
  parts: string[];
  lowestInk: number;
  highestInk: number;
}

/** The derived melisma slur's spans, as the renderer detects them. */
export interface ArcMelismaSpan {
  startIdx: number;
  endIdx: number;
  id: string;
  slur: boolean;
}

/**
 * Ties. `slurredIdx` holds the placed indices under a slur that arches ABOVE
 * (the derived one or a printed one), where the tie takes the opposite bow;
 * `slurredBelowIdx` holds those under a printed slur that bows below.
 */
export function drawTies(c: ArcCtx, slurredIdx: ReadonlySet<number>, slurredBelowIdx: ReadonlySet<number>): ArcOut {
  const { placed, o, smufl, sp, yFor, analyzed, headNameFor, staffTop, staffBottom, contentRight, arcInk } = c;
  const parts: string[] = [];
  let lowestInk = c.lowestInk;
  let highestInk = c.highestInk;
  // ── Ties (melisma build 3; Dann's Gould extraction, Section R). A tie
  // is FLAT and HEAD-ANCHORED — those two properties are its identity
  // against the slur. It curves away from the stems when the pair shares
  // a direction, away from the middle staff line when directions mix,
  // and its apex is nudged off staff lines. Drawn here, before the
  // underlay baselines are computed, because a downward tie is ink the
  // text must clear.
  for (let i = 0; i < placed.length; i++) {
    const e = placed[i].ev;
    if (e.type !== 'note' || !e.pitch || !e.tied) continue;
    if (e.tied.type !== 'start' && e.tied.type !== 'continue') continue;
    const nxt = placed[i + 1];
    /* THE LOUPE'S RUN-ON (loupe remainder, item 3). A slice ends where its measure does, so a tie
       that leaves the last note has no partner here. With `runOnTieSp` set it is drawn as if it
       reached a note that is not shown, and tagged `data-tie-runon` so the page's `[data-tie]`
       readers never see it. Its partner is read as the note itself: a tie joins one pitch. */
    const runOn = !nxt && !!o.runOnTieSp && o.runOnTieSp > 0;
    if (!runOn && (!nxt || nxt.ev.type !== 'note' || !nxt.ev.pitch)) continue;
    const y1 = yFor(e.pitch);
    const a1 = analyzed.events[e.id];
    const a2 = nxt ? analyzed.events[nxt.ev.id] : a1;
    // Direction: OPPOSITE the syllabic slur when one arches above the
    // span (extraction r174); otherwise away from shared stems (open =
    // stems down → tie up); mixed or unanalysed: away from the middle
    // staff line.
    const up = slurredIdx.has(i)
      ? false
      : slurredBelowIdx.has(i)
        ? true
        : a1 && a2 && a1.timbre === a2.timbre
          ? a1.timbre === 'open'
          : y1 < o.staffMidY;
    const half1 = smufl ? sp(smufl.glyph(headNameFor(e.duration.base)).widthSp / 2) : 6.2;
    const half2 = !nxt ? 0 : smufl ? sp(smufl.glyph(headNameFor(nxt.ev.duration.base)).widthSp / 2) : 6.2;
    const x1 = placed[i].x + half1 + 1;
    const x2 = nxt ? nxt.x - half2 - 1 : contentRight + sp(o.runOnTieSp!);
    if (x2 <= x1) continue;
    const ey = y1 + (up ? -4 : 4);
    let depth = (up ? -1 : 1) * o.lineGap * 0.9; // shallow: flatness is identity
    // Quadratic apex sits at ey + depth/2; keep it off staff lines.
    const apex = ey + depth / 2;
    if (apex >= staffTop && apex <= staffBottom && Math.abs((apex - staffTop) % o.lineGap) < 1.5) {
      depth += up ? -3 : 3;
    }
    /* A FILLED TWO-CURVE OUTLINE, not a stroked path. Dann's ruling of
       2026-08-27, from his walk: an engraved tie is a filled shape, thickest at
       its centre and tapering to fine points at both terminals, and a stroked
       path cannot taper at all. What stood here was one quadratic at a constant
       1.1 px, which drew a ribbon of one width end to end.

       THE SHAPE IS `arcOutline`'s, AND ITS WEIGHT IS THE FONT'S. N.125,
       2026-09-16: the centre and terminal thicknesses are the loaded font's
       `tieMidpointThickness` and `tieEndpointThickness`, converted from drawn
       ink to control points there. Everything that decided WHERE the
       tie goes is untouched: the terminals are still the two noteheads' own
       edges (`half1`, `half2` above), the height is still `lineGap * 0.9` with
       the staff-line nudge, and the direction is still chosen by the syllabic
       slur, then timbre, then staff position.

       MAESTRO CARRIES NO COMPOSABLE TIE. Searching all 2,728 glyph names in
       `FinaleMaestro.json` for `tie` or `slur` returns only articulations and
       `textTie`, which is the lyric elision character. SMuFL has none either,
       so ties stay drawn geometry and there was never a second option. */
    parts.push(
      `<path d="${arcOutline(x1, x2, ey, depth, arcInk.tieMid, arcInk.tieEnd)}" fill="#1a1612" data-tie${nxt ? '' : '-runon'}="${esc(e.id)}"/>`,
    );
    lowestInk = Math.max(lowestInk, ey + Math.max(0, depth));
    highestInk = Math.min(highestInk, ey + Math.min(0, depth));
  }
  return { parts, lowestInk, highestInk };
}

/** The derived melisma slur, one arc per span that needs it. */
export function drawDerivedSlurs(c: ArcCtx, melismaSpans: readonly ArcMelismaSpan[]): ArcOut {
  const { placed, smufl, sp, yFor, analyzed, stemUpFor, beamStemById, stemLen, staffTop, arcInk } = c;
  const parts: string[] = [];
  let highestInk = c.highestInk;
  // ── Syllabic slurs (melisma build 4; extraction r69, r71, r174).
  // One arc joins the notes of a syllable, above the staff for a bass
  // melody so the text corridor below stays untouched, cleared above the
  // turning layer, its accidentals, and any up-stem or beam tips. Rests
  // never sit inside a span (detection breaks at rests), so the r70
  // suppression case cannot arise. Deeper than ties by design.
  {
    const accClearSlur = smufl ? Math.max(6, sp(smufl.glyph('accidentalSharp').bBoxNE[1])) : 12;
    for (const s of melismaSpans) {
      if (!s.slur) continue;
      const first = placed[s.startIdx];
      const last = placed[s.endIdx];
      /* ONE CLEARANCE PER THING CLEARED, and the terminal's own is the tie's.
         What stood here took `y2 - 6` off the notehead and then a second 6 in
         `sy = top - 6`, so the two stacked and the slur floated 12 px above its
         own head. Everything else the slur has to miss keeps the 6 px it had,
         now as `SLUR_CLEAR_SP`. `sy` is computed directly, so no clearance can
         pick up a second one on the way out. */
      let sy = staffTop - sp(SLUR_CLEAR_SP);
      for (let k = s.startIdx; k <= s.endIdx; k++) {
        const ev2 = placed[k].ev;
        if (!ev2.pitch) continue;
        const y2 = yFor(ev2.pitch);
        sy = Math.min(sy, y2 - sp(SLUR_HEAD_ANCHOR_SP));
        const a2 = analyzed.events[ev2.id];
        if (a2) sy = Math.min(sy, yFor(a2.turningPitch) - accClearSlur - sp(SLUR_CLEAR_SP));
        // The same two N.4 faults the tuplet bracket had: this was gated on
        // close timbre, so an unmeasured page's positional up-stems never
        // pushed the slur clear, and the fallback was a hardcoded 30 px that
        // ignored the stave size.
        if (ev2.duration.base !== 'whole' && ev2.duration.base !== 'breve' && stemUpFor(ev2, y2)) {
          sy = Math.min(sy, (beamStemById.get(ev2.id)?.tipY ?? y2 - stemLen) - sp(SLUR_CLEAR_SP));
        }
      }
      const lift = Math.min(24, 10 + (last.x - first.x) / 20);
      // The control point, not the apex: the quadratic peaks at half the lift,
      // so this over-reserves rather than clipping.
      highestInk = Math.min(highestInk, sy - lift);
      /* THE SAME FILLED OUTLINE THE TIE USES. N.125, Dann's word of 2026-09-11:
         "make them taper gracefully as objects". Gould 151 (project extraction,
         `gould-vocal-engraving-rules_v7`) gives tie and slur ONE design, a
         tapered symmetrical arc with the tie the flatter of the two, so the
         slur cannot keep a stroked path of one width while the tie is a filled
         lens. What stood here was a single quadratic at a constant 1.3 px.

         IT IS `arcOutline`, THE SAME CALL THE TIE MAKES, and its weight is the
         font's: `slurMidpointThickness` and `slurEndpointThickness`, which
         Bravura and Maestro both set equal to their tie pair. If a font ever
         parts them, the slur follows that font rather than a constant of ours
         (Dann's ruling, 2026-09-16).

         WHERE THE SLUR GOES IS UNTOUCHED. The terminals are still `first.x`
         and `last.x` at `sy`, and the height is still the `lift` above, with
         its cap. Only the ink changed. `data-slur` stays: N.141 and N.142 both
         read this attribute to tell a slur from a tie. */
      parts.push(
        `<path d="${arcOutline(first.x, last.x, sy, -lift, arcInk.slurMid, arcInk.slurEnd)}" fill="#1a1612" data-slur="${esc(s.id)}"/>`,
      );
    }
  }
  return { parts, lowestInk: c.lowestInk, highestInk };
}

// ── The printed slurs (N.188) ───────────────────────────────────────────────

/** One printed slur, planned: where it stands, and which way it bows. */
export interface PrintedSlurPlan {
  /** The event carrying the START end, which is the slur's identity on the page. */
  id: string;
  dir: 'above' | 'below';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Signed height of the control point above (negative) or below the chord's midpoint. */
  depth: number;
  /** `'out'` leaves the system to the right, `'in'` arrives from the left, `'through'` crosses it with both ends elsewhere; absent for a whole slur. */
  half?: 'out' | 'in' | 'through';
  /** The placed indices the slur spans. */
  from: number;
  to: number;
}

/**
 * Plan every printed slur this system can draw, and mark the notes it covers in
 * `slurredAbove` or `slurredBelow` so the tie pass bows the other way (Gould
 * r174, as the project's extraction words it: a tie and a slur over the same
 * notes curve in opposite directions).
 *
 * Planning runs BEFORE the tie pass for that reason, and after the markings,
 * because a slur lifts over a mark standing between it and the head (r70).
 *
 * A slur whose partner is on this system draws whole. One whose partner is on
 * another system, named in `across` by `slurEndKey`, draws a half to this
 * system's content edge. One that starts before this system and stops after it
 * (`through`, from `slursThrough`) crosses it edge to edge. One whose partner is
 * on no system, a note deleted in Corrections, is in none of these and draws
 * nothing, with no error.
 *
 * DIRECTION: the file's `placement` on either end, else above, the way the
 * derived melisma slur goes (Gould r71 as the extraction words it: long
 * slurs above the stave, clear of the text). A slur that bows below is kept
 * only if its lowest point stays within `inkBelow`, the ink already there, so
 * the words never move lower for it; otherwise it goes above.
 */
export function planPrintedSlurs(
  c: ArcCtx,
  across: ReadonlySet<string>,
  through: ReadonlyArray<{ id: string; placement?: 'above' | 'below' }>,
  marks: { top: ReadonlyMap<string, number>; bottom: ReadonlyMap<string, number> },
  inkBelow: number,
  slurredAbove: Set<number>,
  slurredBelow: Set<number>,
): PrintedSlurPlan[] {
  const { placed, smufl, sp, yFor, analyzed, stemUpFor, beamStemById, stemLen } = c;
  const plans: PrintedSlurPlan[] = [];
  const indexOf = new Map(placed.map((p, i) => [p.ev.id, i] as const));
  const accClear = smufl ? Math.max(6, sp(smufl.glyph('accidentalSharp').bBoxNE[1])) : 12;
  const anchor = sp(SLUR_HEAD_ANCHOR_SP);
  const clear = sp(SLUR_CLEAR_SP);
  const markClear = sp(MARK_SLUR_CLEAR_SP);
  const stemless = (ev: VocalLineEvent): boolean => ev.duration.base === 'whole' || ev.duration.base === 'breve';

  const placementOf = (ev: VocalLineEvent, end: SlurEnd): 'above' | 'below' | undefined => {
    if (end.placement) return end.placement;
    const partner = placed[indexOf.get(end.partnerEventId ?? '') ?? -1]?.ev;
    return partner?.slurs?.find((e) => e.partnerEventId === ev.id && e.type !== end.type)?.placement;
  };

  const geometry = (
    dir: 'above' | 'below',
    from: number,
    to: number,
    half: 'out' | 'in' | 'through' | undefined,
  ): Omit<PrintedSlurPlan, 'id' | 'from' | 'to' | 'half'> => {
    const s = dir === 'above' ? -1 : 1;
    /** The outermost of two levels: the one further from the notes in the slur's direction. */
    const outer = (a: number, b: number): number => (dir === 'above' ? Math.min(a, b) : Math.max(a, b));
    const markEdge = (id: string): number | undefined => (dir === 'above' ? marks.top.get(id) : marks.bottom.get(id));
    /** Where a slur has to be at event k to leave its head and any marking beside it clear. */
    const levelAt = (k: number): number => {
      const ev = placed[k].ev;
      const y = yFor(ev.pitch!);
      let lvl = y + s * anchor;
      const m = markEdge(ev.id);
      if (m !== undefined) lvl = outer(lvl, m + s * markClear);
      return lvl;
    };
    /** Everything an inner note adds that the slur must also miss: turning layer, stem tip or beam. */
    const clearAt = (k: number): number => {
      const ev = placed[k].ev;
      const y = yFor(ev.pitch!);
      let lvl = levelAt(k);
      const a = analyzed.events[ev.id];
      if (a) lvl = outer(lvl, yFor(a.turningPitch) + s * (accClear + clear));
      if (!stemless(ev) && stemUpFor(ev, y) === (dir === 'above')) {
        lvl = outer(lvl, (beamStemById.get(ev.id)?.tipY ?? y + s * stemLen) + s * clear);
      }
      return lvl;
    };

    // The two ends. A half has one real end and one free end at the content edge.
    let xA = placed[from].x;
    let xB = placed[to].x;
    const freeA = half === 'in' || half === 'through';
    const freeB = half === 'out' || half === 'through';
    let yA = freeA ? NaN : levelAt(from);
    let yB = freeB ? NaN : levelAt(to);
    if (freeB) xB = c.contentRight + (c.o.runOnTieSp && c.o.runOnTieSp > 0 ? sp(c.o.runOnTieSp) : 0);
    if (freeA) xA = c.contentLeft;
    const inner: number[] = [];
    for (let k = freeA ? from : from + 1; k <= (freeB ? to : to - 1); k++) {
      if (placed[k].ev.type === 'note' && placed[k].ev.pitch) inner.push(k);
    }
    // A free end rides at the outermost level its half has to clear, so the half hangs level.
    const floor = inner.reduce((v, k) => outer(v, clearAt(k)), dir === 'above' ? Infinity : -Infinity);
    if (freeB && !freeA) yB = outer(yA, floor);
    else if (freeA && !freeB) yA = outer(yB, floor);
    else if (freeA && freeB) yA = yB = Number.isFinite(floor) ? floor : c.o.staffMidY + s * 2 * c.o.lineGap;

    const lift = Math.min(24, 10 + (xB - xA) / 20);
    const solve = (): number => {
      let d = s * lift;
      for (const k of inner) {
        const t = (placed[k].x - xA) / (xB - xA);
        const chord = yA + (yB - yA) * t;
        const room = Math.max(2 * t * (1 - t), 0.05);
        const need = (clearAt(k) - chord) / room;
        d = dir === 'above' ? Math.min(d, need) : Math.max(d, need);
      }
      return d;
    };
    let depth = solve();

    /* DANN'S END-POINT RULE. Where both ends at their heads force a deep curve to
       clear an inner note, an end moves off its head toward the stem, until the
       arc is shallow or no end can move. An end can move only if its stem points
       the slur's way: a stem pointing away would lengthen the curve, not shorten it. */
    if (!half) {
      const ends = [from, to].map((k, n) => {
        const ev = placed[k].ev;
        const y = yFor(ev.pitch!);
        const movable = !stemless(ev) && stemUpFor(ev, y) === (dir === 'above');
        const tip = beamStemById.get(ev.id)?.tipY ?? y + s * stemLen;
        return { n, k, movable, limit: tip - s * sp(SLUR_STEM_END_SP), moved: false, up: stemUpFor(ev, y) };
      });
      const cap = sp(SLUR_SHALLOW_APEX_SP);
      for (let guard = 0; guard < 200 && Math.abs(depth) / 2 > cap; guard++) {
        const candidates = ends.filter((e) => e.movable && (dir === 'above' ? (e.n === 0 ? yA : yB) - sp(SLUR_END_STEP_SP) >= e.limit : (e.n === 0 ? yA : yB) + sp(SLUR_END_STEP_SP) <= e.limit));
        if (candidates.length === 0) break;
        // The end furthest from the outside gains the most.
        const pick = candidates.reduce((best, e) => {
          const ye = e.n === 0 ? yA : yB;
          const yb = best.n === 0 ? yA : yB;
          return (dir === 'above' ? ye > yb : ye < yb) ? e : best;
        });
        if (pick.n === 0) yA += s * sp(SLUR_END_STEP_SP);
        else yB += s * sp(SLUR_END_STEP_SP);
        if (!pick.moved) {
          pick.moved = true;
          const px = placed[pick.k].x;
          const stemX = pick.up ? px + c.stemHalfUp : px - c.stemHalfDown;
          if (pick.n === 0) xA = stemX;
          else xB = stemX;
        }
        depth = solve();
      }
    }
    return { dir, x1: xA, y1: yA, x2: xB, y2: yB, depth };
  };

  const plan = (i: number, j: number, ev: VocalLineEvent, end: SlurEnd, half?: 'out' | 'in'): void => {
    const wanted = placementOf(ev, end) ?? 'above';
    let g = geometry(wanted, i, j, half);
    if (wanted === 'below') {
      const lowest = Math.max(g.y1, g.y2, (g.y1 + g.y2) / 2 + g.depth / 2);
      if (lowest > inkBelow) g = geometry('above', i, j, half);
    }
    // For a half the slur's identity is the real end's event.
    const id = end.type === 'start' ? ev.id : (end.partnerEventId ?? ev.id);
    plans.push({ id, ...g, half, from: i, to: j });
    for (let k = i; k <= j; k++) (g.dir === 'above' ? slurredAbove : slurredBelow).add(k);
  };

  for (const t of through) {
    if (placed.length === 0) break;
    const wanted = t.placement ?? 'above';
    let g = geometry(wanted, 0, placed.length - 1, 'through');
    if (wanted === 'below' && Math.max(g.y1, g.y2, (g.y1 + g.y2) / 2 + g.depth / 2) > inkBelow) g = geometry('above', 0, placed.length - 1, 'through');
    plans.push({ id: t.id, ...g, half: 'through', from: 0, to: placed.length - 1 });
    for (let k = 0; k < placed.length; k++) (g.dir === 'above' ? slurredAbove : slurredBelow).add(k);
  }
  for (let i = 0; i < placed.length; i++) {
    const ev = placed[i].ev;
    if (ev.type !== 'note' || !ev.pitch || !ev.slurs) continue;
    for (const end of ev.slurs) {
      if (!end.partnerEventId) continue;
      const j = indexOf.get(end.partnerEventId);
      if (end.type === 'start') {
        if (j !== undefined) {
          if (j > i && placed[j].ev.pitch) plan(i, j, ev, end);
        } else if (across.has(slurEndKey(ev.id, end))) {
          plan(i, placed.length - 1, ev, end, 'out');
        }
      } else if (j === undefined && across.has(slurEndKey(ev.id, end))) {
        plan(0, i, ev, end, 'in');
      }
    }
  }
  return plans;
}

/** Draw the planned printed slurs; the loupe's leaving half carries `data-slur-runon`. */
export function drawPrintedSlurs(c: ArcCtx, plans: readonly PrintedSlurPlan[]): ArcOut {
  const parts: string[] = [];
  let lowestInk = c.lowestInk;
  let highestInk = c.highestInk;
  const loupe = !!c.o.runOnTieSp && c.o.runOnTieSp > 0;
  for (const p of plans) {
    const handle = `data-slur-printed="${esc(p.id)}"${p.half ? ` data-slur-half="${p.half}"` : ''}${(p.half === 'out' || p.half === 'through') && loupe ? ` data-slur-runon="${esc(p.id)}"` : ''}`;
    parts.push(`<path d="${slopedArcOutline(p.x1, p.y1, p.x2, p.y2, p.depth, c.arcInk.slurMid, c.arcInk.slurEnd)}" fill="#1a1612" ${handle}/>`);
    // The control point, not the apex, as the derived slur reserves: it over-reserves rather than clipping.
    const control = (p.y1 + p.y2) / 2 + p.depth;
    highestInk = Math.min(highestInk, p.y1, p.y2, control);
    if (p.dir === 'below') lowestInk = Math.max(lowestInk, p.y1, p.y2, control);
  }
  return { parts, lowestInk, highestInk };
}
