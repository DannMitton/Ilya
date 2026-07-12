/**
 * Bespoke SVG staff renderer for the isolated vocal melody plus Shane's
 * Appendix B analytical markup. Chosen over driving an engraver (OSMD /
 * Verovio) by the renderer spike (2026-07-12): the grey turning-pitch
 * noteheads and red crossing boxes are not notation primitives, so any
 * engraver route needs a fragile coordinate-mapping overlay anyway; the
 * melody-only staff is bounded enough to render ourselves and own every
 * coordinate (and every `data-event-id` for the correction UI).
 *
 * This is the production layout engine (increment 1). It handles:
 *   - proportional rhythmic spacing (x by onset time, with a minimum gap);
 *   - multiple measures with barlines;
 *   - a bass clef and the key signature at the system head;
 *   - accidentals (♯ ♭ ♮) with per-measure state and key-signature carry;
 *   - ledger lines; rests; simple flags for unbeamed short notes;
 *   - the four analytical marks (forced semantic stems, grey turning-pitch
 *     noteheads, red crossing squircles, dual Cyrillic/IPA underlay) and the
 *     `#` phonation break.
 *
 * Deliberately deferred to later increments (documented so nothing is a
 * surprise): SMuFL / Bravura glyph references in place of the shape
 * primitives (Kimi's production constraint — a swap behind this same
 * layout, verified in-browser where the font loads); beaming; multi-system
 * pagination onto the letter Paper page; wiring to live overlay data and the
 * correction-UI editable bindings.
 */

import type { NoteBase, ParsedScore, Pitch, VocalLineEvent } from './types';
import type { AnalyzedEvent, AnalyzedScore } from './analysis-types';

export interface StaffRenderOptions {
  staffMidY?: number;   // y of the middle staff line
  lineGap?: number;     // px between adjacent staff lines
  leftMargin?: number;  // x where the staff content begins (after clef/key)
  pxPerWhole?: number;  // horizontal px per whole-note of onset time
  minGap?: number;      // minimum px between successive events
}

const DEFAULTS: Required<StaffRenderOptions> = {
  staffMidY: 96,
  lineGap: 12,
  leftMargin: 92,
  pxPerWhole: 240,
  minGap: 40,
};

const DIATONIC: Record<Pitch['step'], number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const MIDDLE_LINE_DIATONIC = 3 * 7 + DIATONIC.D; // bass staff middle line = D3

function diatonicNumber(p: Pitch): number {
  return p.octave * 7 + DIATONIC[p.step];
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Order in which sharps / flats are added by the key signature.
const SHARP_ORDER: Pitch['step'][] = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
const FLAT_ORDER: Pitch['step'][] = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

/** The alteration a key signature imposes on a given diatonic step. */
function keySignatureAlter(step: Pitch['step'], fifths: number): number {
  if (fifths > 0 && SHARP_ORDER.slice(0, fifths).includes(step)) return 1;
  if (fifths < 0 && FLAT_ORDER.slice(0, -fifths).includes(step)) return -1;
  return 0;
}

const ACCIDENTAL_GLYPH: Record<number, string> = { 1: '♯', [-1]: '♭', 0: '♮', 2: '𝄪', [-2]: '𝄫' };

function flagCount(base: NoteBase): number {
  switch (base) {
    case 'eighth': return 1;
    case '16th': return 2;
    case '32nd': return 3;
    case '64th': return 4;
    case '128th': return 5;
    default: return 0;
  }
}

interface Placed {
  ev: VocalLineEvent;
  x: number;
  newMeasure: boolean;
}

/** Render the analysed vocal line to a standalone SVG string. */
export function renderAnalyzedStaff(
  parsed: ParsedScore,
  analyzed: AnalyzedScore,
  options: StaffRenderOptions = {},
): string {
  const o = { ...DEFAULTS, ...options };
  const half = o.lineGap / 2;
  const staffTop = o.staffMidY - 2 * o.lineGap;
  const staffBottom = o.staffMidY + 2 * o.lineGap;
  const yFor = (p: Pitch): number => o.staffMidY - (diatonicNumber(p) - MIDDLE_LINE_DIATONIC) * half;

  const fifths = parsed.keySignatures[0]?.signature.fifths ?? 0;

  // ── Layout: assign x by onset, insert barlines at measure changes ──
  const placed: Placed[] = [];
  let x = o.leftMargin;
  let prevMeasure = -1;
  let prevDurWhole = 0;
  for (const ev of parsed.vocalLine) {
    const newMeasure = ev.measureIndex !== prevMeasure;
    if (placed.length > 0) {
      const advance = Math.max(o.minGap, prevDurWhole * o.pxPerWhole);
      x += advance + (newMeasure ? 14 : 0); // a little breathing room across barlines
    }
    placed.push({ ev, x, newMeasure: newMeasure && placed.length > 0 });
    prevMeasure = ev.measureIndex;
    prevDurWhole = ev.duration.fraction.numerator / ev.duration.fraction.denominator;
  }
  const contentRight = (placed[placed.length - 1]?.x ?? o.leftMargin) + Math.max(o.minGap, prevDurWhole * o.pxPerWhole);
  const width = contentRight + 24;

  const parts: string[] = [];
  parts.push(`<svg viewBox="0 0 ${width} ${staffBottom + 64}" xmlns="http://www.w3.org/2000/svg" font-family="'Source Serif 4', Georgia, serif">`);
  parts.push(`<rect x="0" y="0" width="${width}" height="${staffBottom + 64}" fill="#F0EBE0"/>`);

  // Staff lines.
  for (let i = -2; i <= 2; i++) {
    const y = o.staffMidY + i * o.lineGap;
    parts.push(`<line x1="24" y1="${y}" x2="${width - 12}" y2="${y}" stroke="#3a352f" stroke-width="1"/>`);
  }

  // Bass clef placeholder (two dots around the F3 line; SMuFL glyph later).
  const fLineY = o.staffMidY - o.lineGap;
  parts.push(`<path d="M40 ${fLineY - 5} q10 -2 10 8 q0 12 -14 16" fill="none" stroke="#3a352f" stroke-width="2.2"/>`);
  parts.push(`<circle cx="54" cy="${fLineY - 3}" r="1.7" fill="#3a352f"/><circle cx="54" cy="${fLineY + 3}" r="1.7" fill="#3a352f"/>`);

  // Key signature at the head.
  const order = fifths >= 0 ? SHARP_ORDER : FLAT_ORDER;
  const glyph = fifths >= 0 ? ACCIDENTAL_GLYPH[1] : ACCIDENTAL_GLYPH[-1];
  const ksOctave = 3; // place the accidentals in a readable bass-staff octave
  for (let i = 0; i < Math.abs(fifths); i++) {
    const step = order[i];
    const ky = yFor({ step, octave: ksOctave, alter: 0 });
    parts.push(`<text x="${62 + i * 9}" y="${ky + 4}" font-size="15" fill="#3a352f">${glyph}</text>`);
  }

  // ── Draw ──
  let measureAcc: Record<string, number> = {};
  let curMeasure = -1;

  for (const { ev, x: nx, newMeasure } of placed) {
    if (ev.measureIndex !== curMeasure) {
      curMeasure = ev.measureIndex;
      measureAcc = {}; // accidental state resets each measure
    }
    if (newMeasure) {
      parts.push(`<line x1="${nx - 18}" y1="${staffTop}" x2="${nx - 18}" y2="${staffBottom}" stroke="#3a352f" stroke-width="1"/>`);
    }

    if (ev.type === 'rest') {
      parts.push(`<rect x="${nx - 5}" y="${o.staffMidY - 3}" width="10" height="6" rx="1.5" fill="#3a352f"/>`);
      continue;
    }
    const pitch = ev.pitch;
    if (!pitch) continue;
    const y = yFor(pitch);
    const a: AnalyzedEvent | undefined = analyzed.events[ev.id];

    // Ledger lines.
    for (let ly = o.staffMidY - 3 * o.lineGap; ly >= y - 1; ly -= o.lineGap) {
      parts.push(`<line x1="${nx - 11}" y1="${ly}" x2="${nx + 11}" y2="${ly}" stroke="#3a352f" stroke-width="1"/>`);
    }
    for (let ly = o.staffMidY + 3 * o.lineGap; ly <= y + 1; ly += o.lineGap) {
      parts.push(`<line x1="${nx - 11}" y1="${ly}" x2="${nx + 11}" y2="${ly}" stroke="#3a352f" stroke-width="1"/>`);
    }

    // Accidental, if the note's alter differs from what's in effect.
    const accKey = `${pitch.step}${pitch.octave}`;
    const inEffect = accKey in measureAcc ? measureAcc[accKey] : keySignatureAlter(pitch.step, fifths);
    if (pitch.alter !== inEffect) {
      const g = ACCIDENTAL_GLYPH[pitch.alter] ?? '';
      if (g) parts.push(`<text x="${nx - 20}" y="${y + 4}" font-size="15" fill="#1a1612">${g}</text>`);
      measureAcc[accKey] = pitch.alter;
    }

    parts.push(`<g data-event-id="${esc(ev.id)}">`);

    // Grey stemless turning-pitch notehead.
    if (a) {
      const ty = yFor(a.turningPitch);
      parts.push(`<ellipse cx="${nx}" cy="${ty}" rx="6" ry="4.4" fill="#9a968f" opacity="0.85" transform="rotate(-18 ${nx} ${ty})"/>`);
    }

    // Sung notehead: open for half and longer, filled otherwise.
    const openHead = ev.duration.base === 'half' || ev.duration.base === 'whole' || ev.duration.base === 'breve';
    parts.push(openHead
      ? `<ellipse cx="${nx}" cy="${y}" rx="6.2" ry="4.6" fill="none" stroke="#1a1612" stroke-width="1.6" transform="rotate(-18 ${nx} ${y})"/>`
      : `<ellipse cx="${nx}" cy="${y}" rx="6.2" ry="4.6" fill="#1a1612" transform="rotate(-18 ${nx} ${y})"/>`);

    // Forced stem: open timbre = down, close = up. (No stem on a whole note.)
    const stemUp = a ? a.timbre === 'close' : false;
    if (a && ev.duration.base !== 'whole' && ev.duration.base !== 'breve') {
      const sx = stemUp ? nx + 5.5 : nx - 5.5;
      const sy1 = stemUp ? y - 1 : y + 1;
      const sy2 = stemUp ? y - 30 : y + 30;
      parts.push(`<line x1="${sx}" y1="${sy1}" x2="${sx}" y2="${sy2}" stroke="#1a1612" stroke-width="1.5"/>`);
      // Simple flags for unbeamed short notes.
      const flags = flagCount(ev.duration.base);
      for (let f = 0; f < flags; f++) {
        const fy = sy2 + f * 6 * (stemUp ? 1 : -1);
        parts.push(`<path d="M${sx} ${fy} q8 3 7 12" fill="none" stroke="#1a1612" stroke-width="1.4"/>`);
      }
    }

    // Red squircle around an fR1/fo crossing.
    if (a?.crossing) {
      parts.push(`<rect x="${nx - 11}" y="${y - 11}" width="22" height="22" rx="7" fill="none" stroke="#b23b3b" stroke-width="1.8"/>`);
    }

    // '#' phonation break above the staff.
    if (a?.phonationBreak) {
      parts.push(`<text x="${nx}" y="${staffTop - 8}" text-anchor="middle" font-size="14" fill="#4a4540">#</text>`);
    }

    parts.push(`</g>`);

    // Dual underlay: Cyrillic (verse 1) over IPA (verse 2 / analysed vowel).
    const syl = ev.syllable;
    const cyr = syl?.verses?.[0] ?? syl?.text ?? '';
    const ipa = syl?.verses?.[1] ?? a?.vowel ?? '';
    if (cyr) parts.push(`<text x="${nx}" y="${staffBottom + 28}" text-anchor="middle" font-size="12.5" fill="#1a1612">${esc(cyr)}</text>`);
    if (ipa) parts.push(`<text x="${nx}" y="${staffBottom + 44}" text-anchor="middle" font-size="12" fill="#6a655f" font-style="italic">${esc(ipa)}</text>`);
  }

  // Final barline.
  parts.push(`<line x1="${contentRight - 6}" y1="${staffTop}" x2="${contentRight - 6}" y2="${staffBottom}" stroke="#3a352f" stroke-width="1.6"/>`);
  parts.push('</svg>');
  return parts.join('\n');
}
