/**
 * The note markings and fermatas Markup draws as the file printed them (N.188):
 * accents, tenuti, staccati and their kin, breath marks, caesuras, and
 * fermatas on a note or a rest.
 *
 * A MARKING IS NOTATION, NOT A CONTROL (`CONTRACT.md` §8). It prints with the
 * page and shows in the loupe because the one renderer draws it. It takes no
 * pointer: every mark is `pointer-events="none"`, so a click still reaches the
 * note's hit rectangle under it.
 *
 * WHICH KINDS ARE DRAWN is `printed-marks.ts`'s one list: every kind on a
 * MusicXML or MNX file, and on a score read from a scan only the kinds whose
 * measured accuracy has earned it.
 *
 * THE WORDS NEVER MOVE LOWER (brief item 6). A mark sits at the notehead on the
 * side away from the stem only when that keeps its bottom at or above the
 * stave's bottom line; otherwise it goes above the stave. Either way it is ink,
 * so it widens the system's ink bounds; at the notehead it cannot lower the
 * underlay, and above the stave it can only raise the top of the viewBox.
 *
 * SOURCES, as the project's Gould extraction (`gould-vocal-engraving-rules_v7`,
 * SNIPPET ONLY, read by the desk as search results) words them: rule 74, an
 * articulation at the notehead or above the stave, moving above whenever it
 * would push the text lower; rule 70, a mark and a slur meeting at a note leave
 * the mark between the notehead and the slur. Every number below that carries no
 * rule is JUDGEMENT, marked so.
 */
import type { Articulation, ParsedScore, Pitch, VocalLineEvent } from './types';
import type { PreparedSmuflFont, RequiredGlyphName } from './smufl-metadata';
import { drawsKind } from './printed-marks';

/** JUDGEMENT. Clear air between a notehead's edge and the first mark beside it, in stave spaces. */
const MARK_HEAD_GAP_SP = 0.3;
/** JUDGEMENT. Clear air between two marks stacked on one note. */
const MARK_STACK_GAP_SP = 0.25;
/** JUDGEMENT. Clear air between a mark above the stave and the stave, a stem tip, or a head. */
const MARK_ABOVE_STAVE_GAP_SP = 0.5;
/** JUDGEMENT. The same for a fermata. */
const FERMATA_GAP_SP = 0.5;
/** JUDGEMENT. A breath mark or caesura stands this far past its note's right edge. */
const BREATH_AFTER_SP = 0.75;
/** JUDGEMENT. A breath mark or caesura's ink bottom stands this far above the top staff line. */
const BREATH_ABOVE_STAFF_SP = 0.5;
/** Float guard on the space-centre snap and the stave-bottom test, in stave spaces. */
const SNAP_TOL_SP = 0.05;

/**
 * The marks that sit IN A SPACE, never on a line, when they stand beside a
 * notehead. DESK DEFAULT, engravers' convention; not read in Gould this session.
 */
const IN_SPACE: ReadonlySet<Articulation> = new Set<Articulation>(['staccato', 'staccatissimo', 'tenuto']);

/** The Above and Below glyph of each articulation that has a pair. */
const PAIRS: Partial<Record<Articulation, readonly [RequiredGlyphName, RequiredGlyphName]>> = {
  accent: ['articAccentAbove', 'articAccentBelow'],
  'strong-accent': ['articMarcatoAbove', 'articMarcatoBelow'],
  staccato: ['articStaccatoAbove', 'articStaccatoBelow'],
  tenuto: ['articTenutoAbove', 'articTenutoBelow'],
  'detached-legato': ['articTenutoStaccatoAbove', 'articTenutoStaccatoBelow'],
  staccatissimo: ['articStaccatissimoAbove', 'articStaccatissimoBelow'],
  stress: ['articStressAbove', 'articStressBelow'],
  unstress: ['articUnstressAbove', 'articUnstressBelow'],
};

/** A breath mark and a caesura stand after their note and have one glyph each. */
const AFTER_NOTE: Partial<Record<Articulation, RequiredGlyphName>> = {
  'breath-mark': 'breathMarkComma',
  caesura: 'caesura',
};

export interface MarkingsContext {
  parsed: ParsedScore;
  /** The notation font. Without one (primitive mode) nothing is drawn. */
  font: PreparedSmuflFont;
  fontFamily: string;
  /** The glyph size in px (`smuflFontSizePx`). */
  glyphSize: number;
  lineGap: number;
  staffMidY: number;
  placed: ReadonlyArray<{ ev: VocalLineEvent; x: number }>;
  yFor: (p: Pitch) => number;
  /** The notehead's extent at `y`: its top and bottom edges, and half its width. */
  headOf: (ev: VocalLineEvent, y: number) => { top: number; bottom: number; halfW: number };
  /** The stem's direction, and the y of its tip (beam tip when beamed); `tipY` is null on a stemless note. */
  stemOf: (ev: VocalLineEvent, y: number) => { up: boolean; tipY: number | null };
}

export interface MarkingsResult {
  parts: string[];
  /** Per event id, the highest (smallest y) ink of a mark standing over or beside its note. */
  top: Map<string, number>;
  /** Per event id, the lowest (largest y) ink of a mark standing under or beside its note. */
  bottom: Map<string, number>;
  /** The lowest and highest ink of every mark drawn; `-Infinity` and `Infinity` when none. */
  lowest: number;
  highest: number;
}

const INK = '#1a1612';

export function drawMarkings(c: MarkingsContext): MarkingsResult {
  const out: MarkingsResult = { parts: [], top: new Map(), bottom: new Map(), lowest: -Infinity, highest: Infinity };
  const sp = (v: number): number => v * c.lineGap;
  const r2 = (v: number): number => Math.round(v * 100) / 100;
  const staffTop = c.staffMidY - 2 * c.lineGap;
  const staffBottom = c.staffMidY + 2 * c.lineGap;
  const tol = sp(SNAP_TOL_SP);

  interface Laid { name: RequiredGlyphName; kind: string; text: string; top: number; bottom: number }

  /**
   * One glyph, centred on `cx`, with its INK edge at `edge` and growing away
   * from it in `dir`. A glyph that sits in a space is first moved outward to the
   * nearest space centre, so it never lands on a line.
   */
  const lay = (name: RequiredGlyphName, kind: string, cx: number, edge: number, dir: 'up' | 'down', inSpace: boolean): Laid => {
    const g = c.font.glyph(name);
    const inkH = sp(g.bBoxNE[1] - g.bBoxSW[1]);
    let bottom = dir === 'up' ? edge : edge + inkH;
    if (inSpace) {
      const centre = bottom - inkH / 2;
      const k = dir === 'up'
        ? Math.floor((centre + tol - c.staffMidY) / c.lineGap - 0.5)
        : Math.ceil((centre - tol - c.staffMidY) / c.lineGap - 0.5);
      bottom = c.staffMidY + (k + 0.5) * c.lineGap + inkH / 2;
    }
    const top = bottom - inkH;
    const baseline = bottom + sp(g.bBoxSW[1]);
    const x = cx - sp((g.bBoxSW[0] + g.bBoxNE[0]) / 2);
    return { name, kind, top, bottom, text: `<text data-marking="${kind}" x="${r2(x)}" y="${r2(baseline)}" font-size="${c.glyphSize}px" font-family="${c.fontFamily}" fill="${INK}" pointer-events="none">${g.char}</text>` };
  };

  /** A stack of marks laid outward from `edge`, first mark nearest. */
  const stack = (arts: readonly Articulation[], cx: number, edge: number, dir: 'up' | 'down'): Laid[] => {
    const laid: Laid[] = [];
    let e = edge;
    for (const a of arts) {
      const pair = PAIRS[a]!;
      const l = lay(pair[dir === 'up' ? 0 : 1], a, cx, e, dir, IN_SPACE.has(a));
      laid.push(l);
      e = (dir === 'up' ? l.top : l.bottom) + (dir === 'up' ? -1 : 1) * sp(MARK_STACK_GAP_SP);
    }
    return laid;
  };

  const record = (id: string, laid: readonly Laid[]): void => {
    for (const l of laid) {
      out.parts.push(l.text);
      out.top.set(id, Math.min(out.top.get(id) ?? Infinity, l.top));
      out.bottom.set(id, Math.max(out.bottom.get(id) ?? -Infinity, l.bottom));
      out.highest = Math.min(out.highest, l.top);
      out.lowest = Math.max(out.lowest, l.bottom);
    }
  };

  for (const { ev, x } of c.placed) {
    const isNote = ev.type === 'note' && !!ev.pitch;
    const y = isNote ? c.yFor(ev.pitch!) : c.staffMidY;
    const head = isNote ? c.headOf(ev, y) : { top: staffTop, bottom: staffBottom, halfW: 0 };
    const stem = isNote ? c.stemOf(ev, y) : { up: false, tipY: null };
    let top = Math.min(staffTop, head.top, stem.up && stem.tipY !== null ? stem.tipY : Infinity);
    let bottom = Math.max(staffBottom, head.bottom, !stem.up && stem.tipY !== null ? stem.tipY : -Infinity);

    // Articulations beside the notehead, or above the stave when beside it would hang below the stave.
    if (isNote) {
      const beside = (ev.articulations ?? []).filter((a) => PAIRS[a] && drawsKind(c.parsed, a));
      if (beside.length > 0) {
        const away = stem.up ? 'down' : 'up';
        let laid = stack(beside, x, away === 'up' ? head.top - sp(MARK_HEAD_GAP_SP) : head.bottom + sp(MARK_HEAD_GAP_SP), away);
        if (Math.max(...laid.map((l) => l.bottom)) > staffBottom + tol) {
          laid = stack(beside, x, Math.min(staffTop, head.top, stem.up && stem.tipY !== null ? stem.tipY : Infinity) - sp(MARK_ABOVE_STAVE_GAP_SP), 'up');
        }
        record(ev.id, laid);
        top = Math.min(top, ...laid.map((l) => l.top));
        bottom = Math.max(bottom, ...laid.map((l) => l.bottom));
      }
      // A breath mark or a caesura: above the stave, after its note.
      for (const a of ev.articulations ?? []) {
        const name = AFTER_NOTE[a];
        if (!name || !drawsKind(c.parsed, a)) continue;
        const g = c.font.glyph(name);
        const cx = x + head.halfW + sp(BREATH_AFTER_SP) + sp(g.widthSp) / 2;
        const l = lay(name, a, cx, staffTop - sp(BREATH_ABOVE_STAFF_SP), 'up', false);
        out.parts.push(l.text);
        out.highest = Math.min(out.highest, l.top);
        out.lowest = Math.max(out.lowest, l.bottom);
      }
    }

    // A fermata, on a note or on a rest. Above unless the file inverted it.
    if (ev.fermata && drawsKind(c.parsed, 'fermata')) {
      const below = ev.fermata.placement === 'below';
      const l = below
        ? lay('fermataBelow', 'fermata', x, bottom + sp(FERMATA_GAP_SP), 'down', false)
        : lay('fermataAbove', 'fermata', x, top - sp(FERMATA_GAP_SP), 'up', false);
      record(ev.id, [l]);
    }
  }
  return out;
}
