/**
 * Bespoke SVG staff renderer — the renderer spike.
 *
 * `renderAnalyzedStaff(parsed, analyzed)` draws the isolated vocal melody
 * plus Shane's Appendix B analytical markup directly to an SVG string,
 * owning every glyph and coordinate. This is the spike answer to Kimi's
 * OSMD question: rather than driving a general engraver and maintaining a
 * fragile coordinate-mapping overlay for the red boxes and the grey
 * turning-pitch markers, we render the (bounded, melody-only) staff
 * ourselves and place the analytical marks exactly.
 *
 * It proves the four hard criteria in one pass:
 *   1. **Forced stem direction** carrying meaning: open timbre = stem down,
 *      close timbre = stem up (Mitton 2020, Appendix B).
 *   2. **Grey stemless notehead** at the turning pitch (octave below fR1).
 *   3. **Red squircle** around a note at an fR1/fo crossing.
 *   4. **Dual Cyrillic / IPA underlay** (verse 1 over verse 2).
 * plus the diction `#` phonation-break mark, and a `data-event-id` on every
 * note group so the correction UI binds without a hit-test layer.
 *
 * Spike scope: fixed horizontal spacing, one system, no beaming, and simple
 * SVG shapes for noteheads (an ellipse) rather than SMuFL/Bravura glyphs.
 * Production will swap the shape primitives for SMuFL glyph references (per
 * Kimi) behind this same layout; the layout math and the analytical marks
 * are the load-bearing part the spike proves.
 */

import type { ParsedScore, Pitch, VocalLineEvent } from './types';
import type { AnalyzedEvent, AnalyzedScore } from './analysis-types';

export interface StaffRenderOptions {
  /** Left margin before the first note. */
  startX?: number;
  /** Horizontal distance between successive events. */
  xStep?: number;
  /** Vertical centre of the staff (the middle line). */
  staffMidY?: number;
  /** Pixels between adjacent staff lines. */
  lineGap?: number;
}

const DEFAULTS: Required<StaffRenderOptions> = { startX: 64, xStep: 68, staffMidY: 90, lineGap: 12 };

const DIATONIC: Record<Pitch['step'], number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
// Bass staff: the middle line is D3 (the low male voice's home clef).
const MIDDLE_LINE_DIATONIC = 3 * 7 + DIATONIC.D; // D3

function diatonicNumber(p: Pitch): number {
  return p.octave * 7 + DIATONIC[p.step];
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Render the analysed vocal line to a standalone SVG string. */
export function renderAnalyzedStaff(
  parsed: ParsedScore,
  analyzed: AnalyzedScore,
  options: StaffRenderOptions = {},
): string {
  const o = { ...DEFAULTS, ...options };
  const halfStep = o.lineGap / 2;
  // y for a pitch: higher pitch → smaller y. Each diatonic step is half a gap.
  const yFor = (p: Pitch): number => o.staffMidY - (diatonicNumber(p) - MIDDLE_LINE_DIATONIC) * halfStep;

  const notes = parsed.vocalLine.filter((e): e is VocalLineEvent & { pitch: Pitch } => e.type === 'note' && !!e.pitch);
  const width = o.startX + notes.length * o.xStep + 40;
  const staffTop = o.staffMidY - 2 * o.lineGap;
  const staffBottom = o.staffMidY + 2 * o.lineGap;
  const lyric1Y = staffBottom + 28;
  const lyric2Y = staffBottom + 44;

  const parts: string[] = [];
  parts.push(
    `<svg viewBox="0 0 ${width} ${staffBottom + 64}" xmlns="http://www.w3.org/2000/svg" font-family="'Source Serif 4', Georgia, serif">`,
  );
  parts.push(`<rect x="0" y="0" width="${width}" height="${staffBottom + 64}" fill="#F0EBE0"/>`);

  // Five staff lines (bass: G2 B2 D3 F3 A3), and a simple bass-clef colon.
  for (let i = -2; i <= 2; i++) {
    const y = o.staffMidY + i * o.lineGap;
    parts.push(`<line x1="24" y1="${y}" x2="${width - 12}" y2="${y}" stroke="#3a352f" stroke-width="1"/>`);
  }
  const fY = o.staffMidY - o.lineGap; // F3 line
  parts.push(`<circle cx="44" cy="${fY - 3}" r="1.7" fill="#3a352f"/><circle cx="44" cy="${fY + 3}" r="1.7" fill="#3a352f"/>`);

  notes.forEach((ev, i) => {
    const x = o.startX + i * o.xStep;
    const y = yFor(ev.pitch);
    const a: AnalyzedEvent | undefined = analyzed.events[ev.id];

    // Ledger lines for notes beyond the staff.
    for (let ly = o.staffMidY - 3 * o.lineGap; ly >= y - 1; ly -= o.lineGap) {
      parts.push(`<line x1="${x - 11}" y1="${ly}" x2="${x + 11}" y2="${ly}" stroke="#3a352f" stroke-width="1"/>`);
    }
    for (let ly = o.staffMidY + 3 * o.lineGap; ly <= y + 1; ly += o.lineGap) {
      parts.push(`<line x1="${x - 11}" y1="${ly}" x2="${x + 11}" y2="${ly}" stroke="#3a352f" stroke-width="1"/>`);
    }

    parts.push(`<g data-event-id="${esc(ev.id)}">`);

    // 2. Grey stemless notehead at the turning pitch (drawn under the sung note).
    if (a) {
      const ty = yFor(a.turningPitch);
      parts.push(`<ellipse cx="${x}" cy="${ty}" rx="6" ry="4.4" fill="#9a968f" opacity="0.85" transform="rotate(-18 ${x} ${ty})"/>`);
    }

    // Sung notehead: filled for eighth and shorter, open for half and longer.
    const open = ev.duration.base === 'half' || ev.duration.base === 'whole' || ev.duration.base === 'breve';
    const head = open
      ? `<ellipse cx="${x}" cy="${y}" rx="6.2" ry="4.6" fill="none" stroke="#1a1612" stroke-width="1.6" transform="rotate(-18 ${x} ${y})"/>`
      : `<ellipse cx="${x}" cy="${y}" rx="6.2" ry="4.6" fill="#1a1612" transform="rotate(-18 ${x} ${y})"/>`;
    parts.push(head);

    // 1. Forced stem: open timbre = down, close timbre = up.
    if (a && ev.duration.base !== 'whole') {
      if (a.timbre === 'open') {
        parts.push(`<line x1="${x - 5.5}" y1="${y + 1}" x2="${x - 5.5}" y2="${y + 30}" stroke="#1a1612" stroke-width="1.5"/>`);
      } else {
        parts.push(`<line x1="${x + 5.5}" y1="${y - 1}" x2="${x + 5.5}" y2="${y - 30}" stroke="#1a1612" stroke-width="1.5"/>`);
      }
    }

    // 3. Red squircle around an fR1/fo crossing.
    if (a?.crossing) {
      parts.push(`<rect x="${x - 11}" y="${y - 11}" width="22" height="22" rx="7" fill="none" stroke="#b23b3b" stroke-width="1.8"/>`);
    }

    // Diction: '#' phonation break above the note.
    if (a?.phonationBreak) {
      parts.push(`<text x="${x}" y="${staffTop - 8}" text-anchor="middle" font-size="14" fill="#4a4540">#</text>`);
    }

    parts.push(`</g>`);

    // 4. Dual underlay: Cyrillic (verse 1) over IPA (verse 2 / analysed vowel).
    const syl = ev.syllable;
    const cyr = syl?.verses?.[0] ?? syl?.text ?? '';
    const ipa = syl?.verses?.[1] ?? a?.vowel ?? '';
    if (cyr) parts.push(`<text x="${x}" y="${lyric1Y}" text-anchor="middle" font-size="12.5" fill="#1a1612">${esc(cyr)}</text>`);
    if (ipa) parts.push(`<text x="${x}" y="${lyric2Y}" text-anchor="middle" font-size="12" fill="#6a655f" font-style="italic">${esc(ipa)}</text>`);
  });

  parts.push('</svg>');
  return parts.join('\n');
}
