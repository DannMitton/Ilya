/**
 * Bespoke SVG staff renderer for the isolated vocal melody plus Shane's
 * Appendix B analytical markup. Chosen over driving an engraver (OSMD /
 * Verovio) by the renderer spike (2026-07-12): the grey turning-pitch
 * noteheads and red crossing boxes are not notation primitives, so any
 * engraver route needs a fragile coordinate-mapping overlay anyway; the
 * melody-only staff is bounded enough to render ourselves and own every
 * coordinate (and every `data-event-id` for the correction UI).
 *
 * This is the production layout engine (increment 3). It handles:
 *   - proportional rhythmic spacing (x by onset time, with a minimum gap);
 *   - multiple measures with barlines;
 *   - a bass clef and the key signature at the system head;
 *   - accidentals (♯ ♭ ♮) with per-measure state and key-signature carry;
 *   - ledger lines; rests; flags for unbeamed short notes;
 *   - beaming, derived by beat (Dann's ruling, 2026-07-12): the data model
 *     carries no source beams, and the forced semantic stems would break an
 *     engraver's groups anyway, so groups are computed here — flagged notes
 *     joined within one measure, one beat (compound-metre aware), and one
 *     timbre, with multi-level beams and stubs for mixed values;
 *   - tuplet brackets and numerals in standard black (Dann's ruling,
 *     2026-07-12: the appendix sample's blue is engraving cosmetics);
 *   - the four analytical marks (forced semantic stems, sage turning-pitch
 *     noteheads, red crossing squircles, dual Cyrillic/IPA underlay) and the
 *     `#` phonation break. The turning layer (Mitton 2020, App. B pref.
 *     p. 206) renders in the sample's sage (#8FA294, pending Dann's
 *     in-browser sign-off), noteheads and accidentals in one colour, with
 *     its own per-measure accidental carry state independent of the sung
 *     line (Dann's rulings, 2026-07-12).
 *
 * Deliberately deferred to later increments (documented so nothing is a
 * surprise): SMuFL / Bravura glyph references in place of the shape
 * primitives (Kimi's production constraint — a swap behind this same
 * layout, verified in-browser where the font loads); multi-system
 * pagination onto the letter Paper page; wiring to live overlay data and the
 * correction-UI editable bindings.
 */

import type { Fraction, NoteBase, ParsedScore, Pitch, TimeSignature, VocalLineEvent } from './types';
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

/**
 * Turning-pitch layer colour: the App. B sample's sage midtone (estimated
 * from the p. 210 image; awaiting Dann's in-browser confirmation).
 */
const TURNING_COLOUR = '#8FA294';

/**
 * Standard per-clef octave placement for key-signature accidentals.
 * v1 renders the bass clef; keyed by clef so the treble pass has a home.
 */
const KS_OCTAVES: Record<'bass', { sharps: Record<Pitch['step'], number>; flats: Record<Pitch['step'], number> }> = {
  bass: {
    sharps: { F: 3, C: 3, G: 3, D: 3, A: 2, E: 3, B: 2 },
    flats: { B: 2, E: 3, A: 2, D: 3, G: 2, C: 3, F: 2 },
  },
};

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

// ── Beaming ────────────────────────────────────────────────────────
// Groups are derived by beat, not read from the source (Dann's ruling,
// 2026-07-12): `ParsedScore` carries no beam data, and the semantic stems
// (open = down, close = up) would force breaks in an engraver's groups
// wherever the timbre changes, so source beams could not be honoured
// verbatim regardless.

const STEM_HALF = 5.5;   // stem x-offset from the notehead centre
const STEM_MIN = 26;     // minimum stem length under a beam
const BEAM_STROKE = 4;   // beam thickness
const BEAM_GAP = 7;      // spacing between beam levels
const BEAM_STUB = 9;     // length of a partial (stub) beam
const MAX_BEAM_SLOPE = 0.18; // px of rise per px of run, clamped

/**
 * Beat length in whole-note units, for beam grouping. Compound metres
 * (6/8, 9/8, 12/8) group by the dotted beat; simple metres by denominator.
 */
function beatFraction(ts: TimeSignature): Fraction {
  const compound = ts.beatType >= 8 && ts.beats % 3 === 0 && ts.beats > 3;
  return { numerator: compound ? 3 : 1, denominator: ts.beatType };
}

/** 0-based index of the beat containing a rhythmic position. */
function beatIndexOf(pos: Fraction, ts: TimeSignature): number {
  const b = beatFraction(ts);
  return Math.floor((pos.numerator * b.denominator) / (pos.denominator * b.numerator));
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

  // ── Beam pass: group flagged notes by measure, beat, and timbre ──
  // A group needs at least two consecutive members; it breaks at rests,
  // barlines, beat boundaries, unanalysed notes, and timbre changes
  // (semantic stems make mixed-timbre beams impossible).
  const beamStemById = new Map<string, { sx: number; tipY: number }>();
  const beamParts: string[] = [];
  {
    interface BeamNote { id: string; x: number; noteY: number; flags: number }
    let group: BeamNote[] = [];
    let groupUp = false;
    let groupKey = '';

    const emit = (notes: BeamNote[], stemUp: boolean): void => {
      const dir = stemUp ? -1 : 1;
      const sxOf = (n: BeamNote): number => (stemUp ? n.x + STEM_HALF : n.x - STEM_HALF);
      const first = notes[0];
      const last = notes[notes.length - 1];
      const x0 = sxOf(first);
      const rawSlope = (last.noteY - first.noteY) / (sxOf(last) - x0);
      const slope = Math.max(-MAX_BEAM_SLOPE, Math.min(MAX_BEAM_SLOPE, rawSlope));
      // Anchor the beam so every stem in the group reaches at least STEM_MIN.
      let anchor = stemUp ? Infinity : -Infinity;
      for (const n of notes) {
        const cand = n.noteY + dir * STEM_MIN - slope * (sxOf(n) - x0);
        anchor = stemUp ? Math.min(anchor, cand) : Math.max(anchor, cand);
      }
      const beamY = (x: number): number => anchor + slope * (x - x0);
      for (const n of notes) {
        beamStemById.set(n.id, { sx: sxOf(n), tipY: beamY(sxOf(n)) });
      }
      // Level 1 is the primary beam; higher levels draw as runs of two or
      // more, or as stubs on singletons (a stub points at its left
      // neighbour when it has one, otherwise right).
      const maxFlags = Math.max(...notes.map((n) => n.flags));
      for (let level = 1; level <= maxFlags; level++) {
        const yOff = (level - 1) * BEAM_GAP * -dir; // step toward the noteheads
        let i = 0;
        while (i < notes.length) {
          if (notes[i].flags < level) { i++; continue; }
          let j = i;
          while (j + 1 < notes.length && notes[j + 1].flags >= level) j++;
          let xa: number;
          let xb: number;
          if (j > i) {
            xa = sxOf(notes[i]);
            xb = sxOf(notes[j]);
          } else if (level > 1) {
            const sx = sxOf(notes[i]);
            xa = i > 0 ? sx - BEAM_STUB : sx;
            xb = i > 0 ? sx : sx + BEAM_STUB;
          } else {
            i = j + 1;
            continue;
          }
          beamParts.push(`<line x1="${xa}" y1="${beamY(xa) + yOff}" x2="${xb}" y2="${beamY(xb) + yOff}" stroke="#1a1612" stroke-width="${BEAM_STROKE}" data-beam-level="${level}"/>`);
          i = j + 1;
        }
      }
    };

    const flush = (): void => {
      if (group.length >= 2) emit(group, groupUp);
      group = [];
      groupKey = '';
    };

    for (const { ev, x: nx } of placed) {
      const a = ev.type === 'note' && ev.pitch ? analyzed.events[ev.id] : undefined;
      const flags = ev.type === 'note' ? flagCount(ev.duration.base) : 0;
      if (!a || !ev.pitch || flags < 1) { flush(); continue; }
      const ts = parsed.measures[ev.measureIndex]?.timeSignature ?? { beats: 4, beatType: 4 };
      const key = `${ev.measureIndex}|${beatIndexOf(ev.rhythmicPosition.fraction, ts)}|${a.timbre}`;
      if (key !== groupKey) flush();
      groupKey = key;
      groupUp = a.timbre === 'close';
      group.push({ id: ev.id, x: nx, noteY: yFor(ev.pitch), flags });
    }
    flush();
  }

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

  // Key signature at the head, at standard bass-clef staff positions.
  const order = fifths >= 0 ? SHARP_ORDER : FLAT_ORDER;
  const glyph = fifths >= 0 ? ACCIDENTAL_GLYPH[1] : ACCIDENTAL_GLYPH[-1];
  const ksTable = fifths >= 0 ? KS_OCTAVES.bass.sharps : KS_OCTAVES.bass.flats;
  for (let i = 0; i < Math.abs(fifths); i++) {
    const step = order[i];
    const ky = yFor({ step, octave: ksTable[step], alter: 0 });
    parts.push(`<text x="${62 + i * 9}" y="${ky + 4}" font-size="15" fill="#3a352f">${glyph}</text>`);
  }

  // ── Tuplet pass: bracket runs of identical tuplet info ──
  // Chunked by `actualNotes` (adjacent same-ratio groups split correctly);
  // rests inside a tuplet belong to its bracket. Standard black ink: the
  // appendix sample's blue is engraving cosmetics (Dann, 2026-07-12).
  const tupletParts: string[] = [];
  {
    let run: Placed[] = [];
    let runKey = '';
    const emit = (): void => {
      if (run.length >= 2) {
        const t = run[0].ev.duration.tuplet!;
        let minY = staffTop;
        for (const p of run) {
          if (p.ev.pitch) minY = Math.min(minY, yFor(p.ev.pitch));
          const a = analyzed.events[p.ev.id];
          if (a) minY = Math.min(minY, yFor(a.turningPitch));
        }
        const yBr = minY - 10;
        const xa = run[0].x - 8;
        const xb = run[run.length - 1].x + 8;
        const midX = (xa + xb) / 2;
        tupletParts.push(
          `<g data-tuplet="${t.actualNotes}">` +
          `<line x1="${xa}" y1="${yBr + 5}" x2="${xa}" y2="${yBr}" stroke="#1a1612" stroke-width="1"/>` +
          `<line x1="${xa}" y1="${yBr}" x2="${midX - 7}" y2="${yBr}" stroke="#1a1612" stroke-width="1"/>` +
          `<line x1="${midX + 7}" y1="${yBr}" x2="${xb}" y2="${yBr}" stroke="#1a1612" stroke-width="1"/>` +
          `<line x1="${xb}" y1="${yBr}" x2="${xb}" y2="${yBr + 5}" stroke="#1a1612" stroke-width="1"/>` +
          `<text x="${midX}" y="${yBr + 3.5}" text-anchor="middle" font-size="11" font-style="italic" fill="#1a1612">${t.actualNotes}</text>` +
          `</g>`,
        );
      }
      run = [];
      runKey = '';
    };
    for (const p of placed) {
      const t = p.ev.duration.tuplet;
      if (!t) { emit(); continue; }
      const key = `${p.ev.measureIndex}|${t.actualNotes}:${t.normalNotes}:${t.normalType}`;
      if (key !== runKey) emit();
      runKey = key;
      run.push(p);
      if (run.length === t.actualNotes) emit();
    }
    emit();
  }

  // ── Draw ──
  let measureAcc: Record<string, number> = {};
  let turningAcc: Record<string, number> = {};
  let curMeasure = -1;

  for (const { ev, x: nx, newMeasure } of placed) {
    if (ev.measureIndex !== curMeasure) {
      curMeasure = ev.measureIndex;
      measureAcc = {}; // accidental state resets each measure
      turningAcc = {}; // the turning layer carries its own state
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
    // Measure-opening notes nudge the accidental right so it clears the
    // barline at nx - 18 (Kimi's collision rule, 2026-07-12).
    const accKey = `${pitch.step}${pitch.octave}`;
    const inEffect = accKey in measureAcc ? measureAcc[accKey] : keySignatureAlter(pitch.step, fifths);
    if (pitch.alter !== inEffect) {
      const g = ACCIDENTAL_GLYPH[pitch.alter] ?? '';
      if (g) parts.push(`<text x="${newMeasure ? nx - 13 : nx - 20}" y="${y + 4}" font-size="15" fill="#1a1612">${g}</text>`);
      measureAcc[accKey] = pitch.alter;
    }

    parts.push(`<g data-event-id="${esc(ev.id)}">`);

    // Sage stemless turning-pitch notehead, with its own accidental state
    // (standard per-measure carry, independent of the sung line).
    if (a) {
      const tp = a.turningPitch;
      const ty = yFor(tp);
      const tKey = `${tp.step}${tp.octave}`;
      const tInEffect = tKey in turningAcc ? turningAcc[tKey] : keySignatureAlter(tp.step, fifths);
      if (tp.alter !== tInEffect) {
        const g = ACCIDENTAL_GLYPH[tp.alter] ?? '';
        if (g) parts.push(`<text x="${newMeasure ? nx - 13 : nx - 19}" y="${ty + 4}" font-size="14" fill="${TURNING_COLOUR}">${g}</text>`);
        turningAcc[tKey] = tp.alter;
      }
      parts.push(`<ellipse cx="${nx}" cy="${ty}" rx="6" ry="4.4" fill="${TURNING_COLOUR}" opacity="0.85" transform="rotate(-18 ${nx} ${ty})"/>`);
    }

    // Sung notehead: open for half and longer, filled otherwise.
    const openHead = ev.duration.base === 'half' || ev.duration.base === 'whole' || ev.duration.base === 'breve';
    parts.push(openHead
      ? `<ellipse cx="${nx}" cy="${y}" rx="6.2" ry="4.6" fill="none" stroke="#1a1612" stroke-width="1.6" transform="rotate(-18 ${nx} ${y})"/>`
      : `<ellipse cx="${nx}" cy="${y}" rx="6.2" ry="4.6" fill="#1a1612" transform="rotate(-18 ${nx} ${y})"/>`);

    // Forced stem: open timbre = down, close = up. (No stem on a whole note.)
    const stemUp = a ? a.timbre === 'close' : false;
    if (a && ev.duration.base !== 'whole' && ev.duration.base !== 'breve') {
      const beamed = beamStemById.get(ev.id);
      if (beamed) {
        // The stem meets the beam; the beam replaces flags.
        const sy1 = stemUp ? y - 1 : y + 1;
        parts.push(`<line x1="${beamed.sx}" y1="${sy1}" x2="${beamed.sx}" y2="${beamed.tipY}" stroke="#1a1612" stroke-width="1.5"/>`);
      } else {
        const sx = stemUp ? nx + STEM_HALF : nx - STEM_HALF;
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

  // Beams and tuplet brackets (drawn once, after the notes they govern).
  parts.push(...beamParts);
  parts.push(...tupletParts);

  // Final barline.
  parts.push(`<line x1="${contentRight - 6}" y1="${staffTop}" x2="${contentRight - 6}" y2="${staffBottom}" stroke="#3a352f" stroke-width="1.6"/>`);
  parts.push('</svg>');
  return parts.join('\n');
}
