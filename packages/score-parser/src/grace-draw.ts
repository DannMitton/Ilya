/**
 * Drawing grace notes (N.187). A grace note is drawn before its principal note
 * (after it, for an after-grace), at grace size, stem up, with its slur below,
 * outside the bar's count, and with no underlay: it takes no syllable.
 *
 * Gould pp. 125 to 130, as read 2026-10-19 (`docs/sessions/gould-pp125-130-grace-notes_r1_2026-10-19.md`):
 * a little under three quarters of full size (SOURCED; 0.7 is JUDGEMENT within it), the stem about 2 1/4
 * stave-spaces (SOURCED), stem up in a single part (SOURCED), a stroke through a lone grace note's flag
 * (SOURCED), the grace slur below, notehead to notehead, one slur per group (SOURCED). Everything else
 * below, the slot gaps, the stroke's angle and length, the slur's depth, is JUDGEMENT.
 *
 * This file holds the arithmetic and the markup so `staff-renderer.ts` (at its ratchet ceiling) only
 * calls it. The room a group takes (`graceRoom`) is computed here and used by BOTH `layoutColumns`
 * (so `sliceWidth` and the drawing agree) and the draw loop, from the same marks, so the two cannot differ.
 */
import type { GraceNote } from './grace';
import type { NoteBase } from './types';

export const GRACE_SCALE = 0.7;
export const GRACE_STEM_SP = 2.25;
/** Between neighbouring grace noteheads, and between the group and its principal's ink, in stave-spaces. JUDGEMENT. */
const GRACE_GAP_SP = 0.5;
const GRACE_CLEAR_SP = 0.5;

export interface GraceGroups {
  before: GraceNote[];
  after: GraceNote[];
}

/** The grace notes of each principal, in the list's order. Memoised on the list. */
const memo = new WeakMap<readonly GraceNote[], Map<string, GraceGroups>>();
export function graceGroupsOf(list: readonly GraceNote[] | undefined): Map<string, GraceGroups> {
  const none = new Map<string, GraceGroups>();
  if (!list || list.length === 0) return none;
  const hit = memo.get(list);
  if (hit) return hit;
  for (const g of list) {
    const e = none.get(g.principalId) ?? { before: [], after: [] };
    (g.after ? e.after : e.before).push(g);
    none.set(g.principalId, e);
  }
  memo.set(list, none);
  return none;
}

/** What the caller knows about the page: widths in px, from the font or from the primitive figures. */
export interface GraceMetrics {
  lineGap: number;
  /** Full-size black notehead's width. */
  headW: number;
  /** A full-size accidental's width (0 where the alteration has no glyph). */
  accW: (alter: number) => number;
  /** The accidental-to-head gap, as full-size notes use. */
  accGap: number;
}

const flagged = (b: NoteBase): boolean => b !== 'whole' && b !== 'breve' && b !== 'half' && b !== 'quarter';

/** One grace note's slot: its accidental (where one draws), its head, and a flag's room where it is a lone flagged note. */
function slotOf(g: GraceNote, mark: boolean, lone: boolean, m: GraceMetrics): { acc: number; head: number; width: number } {
  const acc = mark ? (m.accW(g.pitch.alter) + m.accGap) * GRACE_SCALE : 0;
  const head = m.headW * GRACE_SCALE;
  const flag = lone && flagged(g.base) ? m.lineGap * 0.8 * GRACE_SCALE : 0;
  return { acc, head, width: acc + head + flag + m.lineGap * GRACE_GAP_SP };
}

/** The room a group takes, in px, from the left of its first slot to its principal's ink. 0 for no group. */
export function graceRoom(group: readonly GraceNote[], marks: readonly boolean[], m: GraceMetrics): number {
  if (group.length === 0) return 0;
  const lone = group.length === 1;
  return group.reduce((t, g, i) => t + slotOf(g, marks[i], lone, m).width, 0) + m.lineGap * GRACE_CLEAR_SP;
}

/** What the draw loop supplies: positions, markers, and the page's own glyph and ink helpers. */
export interface GraceDraw {
  m: GraceMetrics;
  yFor: (p: GraceNote['pitch']) => number;
  staffTop: number;
  staffBottom: number;
  /** One glyph at grace size, `x` its left edge. */
  glyph: (name: 'noteheadBlack' | 'flag8thUp' | 'flag16thUp', x: number, y: number, anchorLeft: boolean) => string;
  /** An accidental at grace size, its left edge at `x`: a SMuFL glyph, or the primitive text run where no font is loaded. */
  acc: (alter: number, x: number, y: number) => string | undefined;
  stemT: number;
  beamT: number;
  slurT: number;
  /** True where a font is loaded (SMuFL glyphs); false draws the primitive ellipse. */
  font: boolean;
  /** Whether a lone flagged grace note with no `slash` of its own draws slashed (the file is a read scan). */
  slashDefault: boolean;
  round: (v: number) => number;
  /** Notehead half-height in px, for the slur's anchor. */
  headHalfH: number;
}

export interface GraceDrawn {
  markup: string[];
  /** Highest y the group reaches (a smaller number is higher). */
  highest: number;
  /** Lowest y the group reaches. */
  lowest: number;
}

/**
 * The group's markup. `rightEdge` is where the group's room ends (the principal's left ink less the clearance) for a
 * before-group; for an after-group it is the LEFT edge, where the first slot begins. `principal` is the principal's
 * (x, y) for the slur. One `<g data-grace>` group; no `data-event-id`, so the page's hit and underlay passes never see it.
 */
export function drawGrace(
  group: readonly GraceNote[],
  marks: readonly boolean[],
  after: boolean,
  anchorX: number,
  principal: { x: number; y: number },
  d: GraceDraw,
): GraceDrawn {
  const { m, round } = d;
  const lone = group.length === 1;
  const slots = group.map((g, i) => slotOf(g, marks[i], lone, m));
  const total = slots.reduce((t, s) => t + s.width, 0);
  let x = after ? anchorX : anchorX - m.lineGap * GRACE_CLEAR_SP - total;
  const out: string[] = [`<g data-grace="${group.map((g) => g.id).join(' ')}"${after ? ' data-grace-after=""' : ''}>`];
  const stemLen = m.lineGap * GRACE_STEM_SP;
  const stemHalf = (m.headW * GRACE_SCALE) / 2;
  const tips: { sx: number; tip: number; y: number; g: GraceNote }[] = [];
  const centres: { cx: number; y: number }[] = [];
  let highest = Infinity;
  let lowest = -Infinity;
  group.forEach((g, i) => {
    const s = slots[i];
    const y = d.yFor(g.pitch);
    const cx = x + s.acc + s.head / 2;
    // ledger lines, where the head stands off the stave
    const ledgerHalf = s.head / 2 + m.lineGap * 0.3;
    for (let ly = d.staffTop - m.lineGap; ly >= y - 0.01 && y < d.staffTop - 0.01; ly -= m.lineGap)
      out.push(`<line x1="${round(cx - ledgerHalf)}" y1="${round(ly)}" x2="${round(cx + ledgerHalf)}" y2="${round(ly)}" stroke="#3a352f" stroke-width="1"/>`);
    for (let ly = d.staffBottom + m.lineGap; ly <= y + 0.01 && y > d.staffBottom + 0.01; ly += m.lineGap)
      out.push(`<line x1="${round(cx - ledgerHalf)}" y1="${round(ly)}" x2="${round(cx + ledgerHalf)}" y2="${round(ly)}" stroke="#3a352f" stroke-width="1"/>`);
    if (marks[i]) {
      const acc = d.acc(g.pitch.alter, round(x), y);
      if (acc) out.push(acc);
    }
    if (d.font) out.push(d.glyph('noteheadBlack', round(cx - s.head / 2), y, true));
    else out.push(`<ellipse cx="${round(cx)}" cy="${round(y)}" rx="${round(6.2 * GRACE_SCALE)}" ry="${round(4.6 * GRACE_SCALE)}" fill="#1a1612" transform="rotate(-18 ${round(cx)} ${round(y)})"/>`);
    const sx = round(cx + stemHalf - d.stemT / 2);
    tips.push({ sx, tip: y - stemLen, y, g });
    centres.push({ cx, y });
    highest = Math.min(highest, y - stemLen);
    lowest = Math.max(lowest, y + m.lineGap / 2);
    x += s.width;
  });
  // stems, flags, beam or stroke
  if (lone) {
    const t = tips[0];
    out.push(`<line x1="${t.sx}" y1="${round(t.y)}" x2="${t.sx}" y2="${round(t.tip)}" stroke="#1a1612" stroke-width="${d.stemT}"/>`);
    if (flagged(t.g.base)) {
      const name = t.g.base === 'eighth' ? 'flag8thUp' : 'flag16thUp';
      if (d.font) out.push(d.glyph(name, round(t.sx - d.stemT / 2), t.tip, true));
      // The stroke through the flag: up to the right across the stem, at a slant. JUDGEMENT on length and angle.
      if (t.g.slash ?? d.slashDefault) {
        const x0 = t.sx - m.lineGap * 0.45 * GRACE_SCALE * 1.4;
        const x1 = t.sx + m.lineGap * 0.95 * GRACE_SCALE * 1.4;
        const y0 = t.tip + m.lineGap * 1.1 * GRACE_SCALE * 1.4;
        const y1 = t.tip + m.lineGap * 0.2 * GRACE_SCALE * 1.4;
        out.push(`<line x1="${round(x0)}" y1="${round(y0)}" x2="${round(x1)}" y2="${round(y1)}" stroke="#1a1612" stroke-width="${round(d.stemT)}" data-grace-slash=""/>`);
      }
    }
  } else {
    // A group: the stems run to one beam, joining the first and last tips, at grace size. Two beams for a 16th.
    const a = tips[0];
    const z = tips[tips.length - 1];
    const slope = z.sx === a.sx ? 0 : (z.tip - a.tip) / (z.sx - a.sx);
    const beamAt = (sx: number): number => a.tip + slope * (sx - a.sx);
    for (const t of tips) out.push(`<line x1="${t.sx}" y1="${round(t.y)}" x2="${t.sx}" y2="${round(beamAt(t.sx))}" stroke="#1a1612" stroke-width="${d.stemT}"/>`);
    const levels = Math.max(...group.map((g) => (g.base === '16th' ? 2 : g.base === 'eighth' ? 1 : g.base === '32nd' ? 3 : 1)));
    for (let k = 0; k < levels; k++) {
      const off = k * m.lineGap * 0.5;
      out.push(`<line x1="${a.sx - d.stemT / 2}" y1="${round(beamAt(a.sx) + off)}" x2="${z.sx + d.stemT / 2}" y2="${round(beamAt(z.sx) + off)}" stroke="#1a1612" stroke-width="${d.beamT}" data-grace-beam=""/>`);
    }
  }
  // One slur per group, below, notehead to notehead: first head to the principal's for a before-group, the principal's to the last head for an after-group.
  const first = after ? principal : { x: centres[0].cx, y: centres[0].y };
  const last = after ? { x: centres[centres.length - 1].cx, y: centres[centres.length - 1].y } : principal;
  const x1 = first.x;
  const x2 = last.x;
  const y1 = first.y + d.headHalfH + 1.5;
  const y2 = last.y + d.headHalfH + 1.5;
  const depth = Math.min(m.lineGap * 1.2, Math.max(m.lineGap * 0.6, Math.abs(x2 - x1) * 0.25));
  const cxm = (x1 + x2) / 2;
  const cym = Math.max(y1, y2) + depth;
  out.push(`<path d="M${round(x1)} ${round(y1)} Q ${round(cxm)} ${round(cym)} ${round(x2)} ${round(y2)}" fill="none" stroke="#1a1612" stroke-width="${round(d.slurT)}" data-grace-slur=""/>`);
  lowest = Math.max(lowest, (y1 + y2) / 2 + depth);
  out.push('</g>');
  return { markup: out, highest, lowest };
}
