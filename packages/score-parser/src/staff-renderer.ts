/**
 * Bespoke SVG staff renderer for the isolated vocal melody plus Shane's
 * Appendix B analytical markup. Chosen over driving an engraver (OSMD /
 * Verovio) by the renderer spike (2026-07-12): the sage turning-pitch
 * noteheads and red crossing boxes are not notation primitives, so any
 * engraver route needs a fragile coordinate-mapping overlay anyway; the
 * melody-only staff is bounded enough to render ourselves and own every
 * coordinate (and every `data-event-id` for the correction UI).
 *
 * This is the production layout engine (increment 4). It handles:
 *   - proportional rhythmic spacing (x by onset time, with a minimum gap);
 *   - multiple measures with barlines;
 *   - a clef (treble, treble-8vb, or bass; source clef when captured,
 *     else the tessitura heuristic — v37 §A.17) and the key signature
 *     at that clef's standard positions;
 *   - accidentals (sung line and turning layer) with per-measure carry and
 *     the measure-opening barline nudge (Kimi's collision rule);
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
 *     p. 206) renders in Calm Authority's sage (#8B9A7D, the `--sage` app
 *     token; see the TURNING_COLOUR constant below), noteheads and
 *     accidentals in one colour, with
 *     its own per-measure accidental carry state independent of the sung
 *     line (Dann's rulings, 2026-07-12);
 *   - TWO RENDERING MODES: pass `options.font` (a `PreparedSmuflFont`) and
 *     `options.fontFamily` for production SMuFL glyph output (clef, heads,
 *     accidentals, rests, flags as font glyphs; stems from the font's
 *     anchors; thicknesses from its engraving defaults). Omit `font` for
 *     the primitive shapes, which stay byte-stable for sandbox tests.
 *
 * Deliberately deferred to later increments: multi-system pagination onto
 * the letter Paper page; wiring to live overlay data and the correction-UI
 * editable bindings.
 */

import type { Fraction, NoteBase, ParsedScore, Pitch, TimeSignature, VocalLineEvent } from './types';
import type { AnalyzedEvent, AnalyzedScore } from './analysis-types';
import { smuflFontSizePx, type PreparedSmuflFont, type RequiredGlyphName } from './smufl-metadata';
import { chooseClef, type RenderClef } from './clef-select';

export interface StaffRenderOptions {
  staffMidY?: number;   // y of the middle staff line
  lineGap?: number;     // px between adjacent staff lines
  leftMargin?: number;  // x where the staff content begins (after clef/key)
  pxPerWhole?: number;  // horizontal px per whole-note of onset time
  minGap?: number;      // minimum px between successive events
  /**
   * Render clef. Omit to let the renderer assess the input and choose
   * (source clef when captured, else the tessitura heuristic; v37
   * §A.17). `paginateScore` resolves this ONCE per score so systems
   * never flip clef mid-piece.
   */
  clef?: RenderClef;
  /** SMuFL mode: prepared font metadata. Omit for primitive shapes. */
  font?: PreparedSmuflFont;
  /** CSS font-family for SMuFL glyph text (must match the loaded FontFace). */
  fontFamily?: string;
  /**
   * Per event id, the full syllable IPA for the underlay's NEAR line, the
   * one closest to the stave since the 2026-08-05 swap
   * (Dann, 2026-07-17: every lyric Fit underlays gets two lines, IPA then
   * Cyrillic; "one vowel per syllable per rhythmic value" is the rule,
   * consonants included, never just the acoustic vowel). Verbatim from
   * Ilya's GraysonEngine; the renderer never synthesizes IPA (Dann's
   * tethering requirement, 2026-07-12). In production this is built by
   * `buildUnderlayResolvers` (`apps/web/.../vowel-resolver.ts`) walking
   * every event through its `.ipa` resolver; the demo fixture supplies its
   * own placeholder strings for the font lab instead. Not to be confused
   * with `SyllableInfo.verses`, which carries real sung text for OTHER
   * verses (§A.86) and must never be read as an IPA source (the two were
   * conflated here until a 2026-07-17 fix). NOT YET WIRED to a live
   * `VoiceProfilePane` render call; today only `renderDemo` populates it.
   */
  ipaPreview?: Record<string, string>;
}

const DEFAULTS: Required<Omit<StaffRenderOptions, 'font' | 'clef' | 'ipaPreview'>> = {
  staffMidY: 96,
  lineGap: 12,
  leftMargin: 92,
  pxPerWhole: 240,
  minGap: 40,
  fontFamily: 'Bravura',
};

const DIATONIC: Record<Pitch['step'], number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

/** Diatonic number of the middle staff line, per clef (bass D3, treble B4). */
const MIDDLE_LINE: Record<RenderClef, number> = {
  bass: 3 * 7 + DIATONIC.D,
  treble: 4 * 7 + DIATONIC.B,
  'treble-8vb': 4 * 7 + DIATONIC.B, // written pitches; the 8 is sounding-only
};

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

/** SMuFL glyph names by alteration. */
const ACCIDENTAL_SMUFL: Record<number, RequiredGlyphName> = {
  1: 'accidentalSharp',
  [-1]: 'accidentalFlat',
  0: 'accidentalNatural',
  2: 'accidentalDoubleSharp',
  [-2]: 'accidentalDoubleFlat',
};

/** SMuFL rest glyphs by note base (64th/128th clamp to 32nd for v1). */
const REST_SMUFL: Record<NoteBase, RequiredGlyphName> = {
  breve: 'restWhole', whole: 'restWhole', half: 'restHalf', quarter: 'restQuarter',
  eighth: 'rest8th', '16th': 'rest16th', '32nd': 'rest32nd', '64th': 'rest32nd', '128th': 'rest32nd',
};

/** SMuFL flag glyphs [up, down] by flag count (clamped at 3 for v1). */
const FLAG_SMUFL: Record<number, [RequiredGlyphName, RequiredGlyphName]> = {
  1: ['flag8thUp', 'flag8thDown'],
  2: ['flag16thUp', 'flag16thDown'],
  3: ['flag32ndUp', 'flag32ndDown'],
};

/**
 * Turning-pitch layer colour: Calm Authority's core sage accent, `--sage`
 * in app.css (Dann's ruling, 2026-07-12: use the existing colour story,
 * not an invented estimate). Baked as hex because this module is pure and
 * DOM-free; keep in sync with the app token.
 */
const TURNING_COLOUR = '#8B9A7D';

/**
 * Standard per-clef octave placement for key-signature accidentals.
 * treble-8vb shares the treble tables: it is treble geometry with a
 * sounding-octave marker, not a different staff mapping.
 */
const KS_OCTAVES: Record<'bass' | 'treble', { sharps: Record<Pitch['step'], number>; flats: Record<Pitch['step'], number> }> = {
  bass: {
    sharps: { F: 3, C: 3, G: 3, D: 3, A: 2, E: 3, B: 2 },
    flats: { B: 2, E: 3, A: 2, D: 3, G: 2, C: 3, F: 2 },
  },
  treble: {
    sharps: { F: 5, C: 5, G: 5, D: 5, A: 4, E: 5, B: 4 },
    flats: { B: 4, E: 5, A: 4, D: 5, G: 4, C: 5, F: 4 },
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

const STEM_HALF = 5.5;   // primitive-mode stem x-offset from the notehead centre
/**
 * Standard stem length, in STAVE-SPACES: an octave, 3.5 stave-spaces from
 * the notehead centre (Gould r86). Expressed in stave-spaces because the
 * stave-space is notation's base unit (r79), and because the production
 * stave is less than half the size of the test and font-lab default: the
 * hardcoded 26 and 30 px this replaces measured 4.7 and 5.45 stave-spaces
 * on the printed page, a stem longer than the staff is tall (Dann at the
 * browser, 2026-08-05).
 *
 * NOT implemented from r86, recorded for N.6: ledger-line notes' stems
 * reach the middle staff line; stems shorten progressively outside the
 * staff to a floor of 2.5 stave-spaces; and r87 lengthens the stem for
 * each beam past the second.
 */
const STEM_LENGTH_SP = 3.5;
const BEAM_STROKE = 4;   // primitive-mode beam thickness
const BEAM_GAP = 7;      // primitive-mode spacing between beam levels
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
  const smufl = options.font;
  const clef: RenderClef = options.clef ?? chooseClef(parsed);
  const half = o.lineGap / 2;
  const staffTop = o.staffMidY - 2 * o.lineGap;
  const staffBottom = o.staffMidY + 2 * o.lineGap;
  // The mirror of `lowestInk`, which the underlay has always used. The top of
  // the system never had one, so nothing knew how much space above the staff
  // was actually occupied and `staffMidY`'s fixed 96 px was reserved
  // regardless (N.6a).
  //
  // DECLARED HERE, not beside `lowestInk`, and the reason is a bug this
  // already caused: the tuplet and beam passes run BEFORE that point and both
  // write to it, so a `let` down there is read inside a closure during its own
  // temporal dead zone and every render throws. `tsc` cannot see it, because
  // it cannot prove when a nested arrow runs; only the suite caught it.
  let highestInk = staffTop;
  const yFor = (p: Pitch): number => o.staffMidY - (diatonicNumber(p) - MIDDLE_LINE[clef]) * half;

  const fifths = parsed.keySignatures[0]?.signature.fifths ?? 0;

  // ── SMuFL metrics (undefined in primitive mode) ──
  const glyphSize = smuflFontSizePx(o.lineGap);
  const sp = (v: number): number => v * o.lineGap;
  const round2 = (v: number): number => Math.round(v * 100) / 100;
  /** Glyph text at a horizontal CENTRE (or left origin when anchorLeft). */
  const glyphAt = (name: RequiredGlyphName, x: number, y: number, fill: string, anchorLeft = false): string => {
    const g = smufl!.glyph(name);
    const gx = anchorLeft ? x : x - sp(g.widthSp / 2);
    return `<text x="${round2(gx)}" y="${round2(y)}" font-size="${glyphSize}px" font-family="${esc(o.fontFamily)}" fill="${fill}">${g.char}</text>`;
  };
  const headNameFor = (base: NoteBase): RequiredGlyphName =>
    base === 'whole' || base === 'breve' ? 'noteheadWhole' : base === 'half' ? 'noteheadHalf' : 'noteheadBlack';

  const ed = smufl?.engravingDefaults;
  const stemT = smufl ? sp(ed!.stemThickness) : 1.5;
  const beamT = smufl ? sp(ed!.beamThickness) : BEAM_STROKE;
  const beamLevelGap = smufl ? sp(ed!.beamThickness + ed!.beamSpacing) : BEAM_GAP;
  // Stem x-offsets from the notehead centre, from the black notehead's
  // anchors (half noteheads differ by a hair; v1 accepts the approximation
  // so the beam pass and the stem pass agree).
  let stemHalfUp = STEM_HALF;
  let stemHalfDown = -STEM_HALF;
  if (smufl) {
    const nh = smufl.glyph('noteheadBlack');
    const w = nh.widthSp;
    stemHalfUp = sp((nh.anchors.stemUpSE?.[0] ?? w) - w / 2) - stemT / 2;
    stemHalfDown = sp((nh.anchors.stemDownNW?.[0] ?? 0) - w / 2) + stemT / 2;
  }
  /** Standard stem length in px at this stave size (Gould r86). */
  const stemLen = sp(STEM_LENGTH_SP);

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
  const beamStemById = new Map<string, { sx: number; tipY: number; up: boolean }>();
  const beamParts: string[] = [];
  {
    interface BeamNote { id: string; x: number; noteY: number; flags: number }
    let group: BeamNote[] = [];
    // `undefined` means "no acoustic data, settle the direction positionally
    // at flush"; a boolean is a semantic direction already known per note.
    let groupUp: boolean | undefined = false;
    let groupKey = '';

    const emit = (notes: BeamNote[], stemUp: boolean): void => {
      const dir = stemUp ? -1 : 1;
      const sxOf = (n: BeamNote): number => n.x + (stemUp ? stemHalfUp : stemHalfDown);
      const first = notes[0];
      const last = notes[notes.length - 1];
      const x0 = sxOf(first);
      const rawSlope = (last.noteY - first.noteY) / (sxOf(last) - x0);
      const slope = Math.max(-MAX_BEAM_SLOPE, Math.min(MAX_BEAM_SLOPE, rawSlope));
      // Anchor the beam so every stem in the group reaches the standard
      // length (r86); the slope then lengthens the rest.
      let anchor = stemUp ? Infinity : -Infinity;
      for (const n of notes) {
        const cand = n.noteY + dir * stemLen - slope * (sxOf(n) - x0);
        anchor = stemUp ? Math.min(anchor, cand) : Math.max(anchor, cand);
      }
      const beamY = (x: number): number => anchor + slope * (x - x0);
      for (const n of notes) {
        beamStemById.set(n.id, { sx: sxOf(n), tipY: beamY(sxOf(n)), up: stemUp });
      }
      // Level 1 is the primary beam; higher levels draw as runs of two or
      // more, or as stubs on singletons (a stub points at its left
      // neighbour when it has one, otherwise right).
      const maxFlags = Math.max(...notes.map((n) => n.flags));
      for (let level = 1; level <= maxFlags; level++) {
        const yOff = (level - 1) * beamLevelGap * -dir; // step toward the noteheads
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
          beamParts.push(`<line x1="${xa}" y1="${round2(beamY(xa) + yOff)}" x2="${xb}" y2="${round2(beamY(xb) + yOff)}" stroke="#1a1612" stroke-width="${beamT}" data-beam-level="${level}"/>`);
          i = j + 1;
        }
      }
    };

    /**
     * Gould's positional direction for a group with no acoustic data: the
     * note furthest from the middle line decides, and an equidistant group
     * takes down-stems (r84; r85's no-clear-case convention; r91). One
     * direction serves the whole group, so a beat-group never splits for
     * position alone (r92). Semantic direction is the only thing that can
     * disagree within a beat, and that case still breaks the group above.
     *
     * INFERENCE, gap named: Gould's own beamed-group stem page (p. 24) is
     * missing from our extraction, and r102's furthest-from-the-middle-line
     * rule is stated for chords.
     */
    const positionalUp = (notes: BeamNote[]): boolean => {
      let furthest = notes[0];
      for (const n of notes) {
        if (Math.abs(n.noteY - o.staffMidY) > Math.abs(furthest.noteY - o.staffMidY)) furthest = n;
      }
      return furthest.noteY > o.staffMidY; // below the middle line → up-stem
    };

    const flush = (): void => {
      if (group.length >= 2) emit(group, groupUp ?? positionalUp(group));
      group = [];
      groupKey = '';
    };

    for (const { ev, x: nx } of placed) {
      const a = ev.type === 'note' && ev.pitch ? analyzed.events[ev.id] : undefined;
      const flags = ev.type === 'note' ? flagCount(ev.duration.base) : 0;
      if (!ev.pitch || flags < 1) { flush(); continue; }
      const ts = parsed.measures[ev.measureIndex]?.timeSignature ?? { beats: 4, beatType: 4 };
      // Timbre stays in the key, so adjacent notes that disagree still break
      // the group and fall back to flags (Dann's ruling, 2026-07-12). An
      // unanalysed note has no timbre to disagree about, so it groups by
      // beat alone and the group's direction is settled at flush.
      const key = `${ev.measureIndex}|${beatIndexOf(ev.rhythmicPosition.fraction, ts)}|${a ? a.timbre : 'positional'}`;
      if (key !== groupKey) flush();
      groupKey = key;
      groupUp = a ? a.timbre === 'close' : undefined;
      group.push({ id: ev.id, x: nx, noteY: yFor(ev.pitch), flags });
    }
    flush();
  }

  /**
   * Stem direction for one note, and the SINGLE source of truth for it:
   * semantics first, then a beamed note's group direction, then Gould's
   * positional default. Every consumer must call this rather than restate
   * the precedence, or the two copies drift and a stem silently stops
   * meaning what the legend says it means.
   */
  const stemUpFor = (ev: VocalLineEvent, noteY: number): boolean => {
    const a = ev.pitch ? analyzed.events[ev.id] : undefined;
    const beamed = beamStemById.get(ev.id);
    return a ? a.timbre === 'close' : beamed ? beamed.up : noteY > o.staffMidY;
  };

  const parts: string[] = [];
  // The svg tag and background are patched at the end, once the true
  // height (underlay placed clear of the lowest ink) is known.
  parts.push('');
  parts.push('');

  // Staff lines.
  const staffLineT = smufl ? round2(sp(ed!.staffLineThickness)) : 1;
  for (let i = -2; i <= 2; i++) {
    const y = o.staffMidY + i * o.lineGap;
    parts.push(`<line x1="24" y1="${y}" x2="${width - 12}" y2="${y}" stroke="#3a352f" stroke-width="${staffLineT}"/>`);
  }

  // Clef at the head: SMuFL glyph on its reference line (treble winds
  // around the G line, bass around the F line with its dots either side;
  // Gould extraction v5, rule 80), or the primitive placeholder.
  parts.push(`<g data-clef="${clef}">`);
  if (clef === 'bass') {
    const fLineY = o.staffMidY - o.lineGap;
    if (smufl) {
      parts.push(glyphAt('fClef', 34, fLineY, '#3a352f', true));
    } else {
      parts.push(`<path d="M40 ${fLineY - 5} q10 -2 10 8 q0 12 -14 16" fill="none" stroke="#3a352f" stroke-width="2.2"/>`);
      parts.push(`<circle cx="54" cy="${fLineY - 3}" r="1.7" fill="#3a352f"/><circle cx="54" cy="${fLineY + 3}" r="1.7" fill="#3a352f"/>`);
    }
  } else {
    const gLineY = o.staffMidY + o.lineGap;
    if (smufl) {
      parts.push(glyphAt(clef === 'treble-8vb' ? 'gClef8vb' : 'gClef', 34, gLineY, '#3a352f', true));
    } else {
      parts.push(`<line x1="46" y1="${staffTop - 8}" x2="46" y2="${gLineY + 10}" stroke="#3a352f" stroke-width="2.2"/>`);
      parts.push(`<circle cx="46" cy="${gLineY}" r="4" fill="none" stroke="#3a352f" stroke-width="1.6"/>`);
      if (clef === 'treble-8vb') {
        parts.push(`<text x="46" y="${gLineY + 22}" text-anchor="middle" font-size="9" fill="#3a352f">8</text>`);
      }
    }
  }
  parts.push('</g>');

  // Key signature at the head, at the selected clef's standard positions.
  const order = fifths >= 0 ? SHARP_ORDER : FLAT_ORDER;
  const glyph = fifths >= 0 ? ACCIDENTAL_GLYPH[1] : ACCIDENTAL_GLYPH[-1];
  const ksName: RequiredGlyphName = fifths >= 0 ? 'accidentalSharp' : 'accidentalFlat';
  const ksClef = clef === 'bass' ? KS_OCTAVES.bass : KS_OCTAVES.treble;
  const ksTable = fifths >= 0 ? ksClef.sharps : ksClef.flats;
  let ksX = 62;
  for (let i = 0; i < Math.abs(fifths); i++) {
    const step = order[i];
    const ky = yFor({ step, octave: ksTable[step], alter: 0 });
    if (smufl) {
      parts.push(glyphAt(ksName, ksX, ky, '#3a352f', true));
      ksX += sp(smufl.glyph(ksName).widthSp) + 1;
    } else {
      parts.push(`<text x="${62 + i * 9}" y="${ky + 4}" font-size="15" fill="#3a352f">${glyph}</text>`);
    }
  }

  // ── Tuplet pass: bracket runs of identical tuplet info ──
  // Chunked by `actualNotes` (adjacent same-ratio groups split correctly);
  // rests inside a tuplet belong to its bracket. Standard black ink: the
  // appendix sample's blue is engraving cosmetics (Dann, 2026-07-12).
  const tupletParts: string[] = [];
  {
    let run: Placed[] = [];
    let runKey = '';
    const tupletT = smufl ? round2(sp(ed!.tupletBracketThickness)) : 1;
    const emit = (): void => {
      if (run.length >= 2) {
        const t = run[0].ev.duration.tuplet!;
        // The bracket clears ALL ink above the run (Dann's collision fix,
        // 2026-07-12): noteheads, the turning layer AND its accidentals,
        // and up-stem tips (beamed or flagged), not noteheads alone.
        const accClear = smufl ? Math.max(6, sp(smufl.glyph('accidentalSharp').bBoxNE[1])) : 12;
        let minY = staffTop;
        for (const p of run) {
          const ev = p.ev;
          if (!ev.pitch) continue;
          const y = yFor(ev.pitch);
          minY = Math.min(minY, y - 6);
          const a = analyzed.events[ev.id];
          if (a) minY = Math.min(minY, yFor(a.turningPitch) - accClear);
          // Any up-stem rises above the notehead and the bracket must clear
          // it, measured or not. Before N.4 only a close-timbre note could
          // stem up, so this was gated on `a`; unmeasured pages now stem up
          // positionally too and the old gate would let a bracket collide.
          if (ev.duration.base !== 'whole' && ev.duration.base !== 'breve' && stemUpFor(ev, y)) {
            const beamed = beamStemById.get(ev.id);
            minY = Math.min(minY, beamed ? beamed.tipY : y - stemLen);
          }
        }
        const yBr = minY - 8;
        highestInk = Math.min(highestInk, yBr);
        const xa = run[0].x - 8;
        const xb = run[run.length - 1].x + 8;
        const midX = (xa + xb) / 2;
        tupletParts.push(
          `<g data-tuplet="${t.actualNotes}">` +
          `<line x1="${xa}" y1="${yBr + 5}" x2="${xa}" y2="${yBr}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
          `<line x1="${xa}" y1="${yBr}" x2="${midX - 7}" y2="${yBr}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
          `<line x1="${midX + 7}" y1="${yBr}" x2="${xb}" y2="${yBr}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
          `<line x1="${xb}" y1="${yBr}" x2="${xb}" y2="${yBr + 5}" stroke="#1a1612" stroke-width="${tupletT}"/>` +
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

  // Collision-aware underlay (Dann's ruling, 2026-07-12): the text lines
  // are collected during the draw and placed below the lowest ink of the
  // system, never at a fixed offset that a down-stem beam can crash into.
  const underlay: Array<{ x: number; cyr: string; ipa: string; align: 'middle' | 'start'; sylType?: 'whole' | 'start' | 'middle' | 'end'; evId: string }> = [];
  // Melisma detection: the data model encodes a melisma by ABSENCE of
  // syllable on continuation notes, so a syllabled note followed by an
  // unsyllabled note starts one. Its syllable left-aligns at the first
  // notehead (the reading eye moves rightward); single-note syllables
  // stay centred. (Gould extraction rules 4 to 6.)
  const melismaStart = new Set<string>();
  const melismaEndX = new Map<string, number>(); // start id → last continuation notehead x
  interface MelismaSpan { startIdx: number; endIdx: number; id: string; slur: boolean }
  const melismaSpans: MelismaSpan[] = [];
  const slurredIdx = new Set<number>(); // placed indices under a syllabic slur
  {
    for (let i = 0; i < placed.length; i++) {
      const e = placed[i].ev;
      if (e.type !== 'note' || !e.syllable) continue;
      let j = i + 1;
      let lastX: number | null = null;
      while (j < placed.length && placed[j].ev.type === 'note' && !placed[j].ev.syllable) {
        lastX = placed[j].x;
        j++;
      }
      if (lastX !== null) {
        melismaStart.add(e.id);
        melismaEndX.set(e.id, lastX);
        // A melisma that is nothing but tied unisons takes no slur: the
        // tie already joins the syllable (extraction r5, r69, r150).
        let needsSlur = false;
        for (let k = i; k < j - 1; k++) {
          const a1 = placed[k].ev;
          const b1 = placed[k + 1].ev;
          const tiedUnison = !!a1.tied && (a1.tied.type === 'start' || a1.tied.type === 'continue')
            && !!a1.pitch && !!b1.pitch
            && a1.pitch.step === b1.pitch.step && a1.pitch.octave === b1.pitch.octave && a1.pitch.alter === b1.pitch.alter;
          if (!tiedUnison) { needsSlur = true; break; }
        }
        melismaSpans.push({ startIdx: i, endIdx: j - 1, id: e.id, slur: needsSlur });
        if (needsSlur) for (let k = i; k <= j - 1; k++) slurredIdx.add(k);
      }
    }
  }
  // Phonation breaks render as [#] ON THE IPA LINE (Dann's ruling,
  // 2026-07-12): the break is a diction event, so it lives with the
  // diction, at the junction between the pair of notes it clips; above
  // the staff it reads as a stray sharp. Square brackets command
  // attention wherever one occurs.
  const breaks: number[] = [];
  const nextXById = new Map<string, number>();
  for (let i = 0; i < placed.length; i++) {
    nextXById.set(placed[i].ev.id, placed[i + 1]?.x ?? placed[i].x + 40);
  }
  let lowestInk = staffBottom;

  for (const { ev, x: nx, newMeasure } of placed) {
    if (ev.measureIndex !== curMeasure) {
      curMeasure = ev.measureIndex;
      measureAcc = {}; // accidental state resets each measure
      turningAcc = {}; // the turning layer carries its own state
    }
    if (newMeasure) {
      const barT = smufl ? round2(sp(ed!.thinBarlineThickness)) : 1;
      parts.push(`<line x1="${nx - 18}" y1="${staffTop}" x2="${nx - 18}" y2="${staffBottom}" stroke="#3a352f" stroke-width="${barT}"/>`);
    }

    if (ev.type === 'rest') {
      if (smufl) {
        const rest = REST_SMUFL[ev.duration.base];
        const ry = rest === 'restWhole' ? o.staffMidY - o.lineGap : o.staffMidY;
        parts.push(glyphAt(rest, nx, ry, '#3a352f'));
      } else {
        parts.push(`<rect x="${nx - 5}" y="${o.staffMidY - 3}" width="10" height="6" rx="1.5" fill="#3a352f"/>`);
      }
      continue;
    }
    const pitch = ev.pitch;
    if (!pitch) continue;
    const y = yFor(pitch);
    const a: AnalyzedEvent | undefined = analyzed.events[ev.id];
    const headName = headNameFor(ev.duration.base);
    const headHalfW = smufl ? sp(smufl.glyph(headName).widthSp / 2) : 6.2;
    lowestInk = Math.max(lowestInk, y + 6);
    highestInk = Math.min(highestInk, y - 6);

    // Ledger lines.
    const ledgerHalf = smufl ? round2(headHalfW + sp(ed!.legerLineExtension)) : 11;
    const ledgerT = smufl ? round2(sp(ed!.legerLineThickness)) : 1;
    for (let ly = o.staffMidY - 3 * o.lineGap; ly >= y - 1; ly -= o.lineGap) {
      parts.push(`<line x1="${round2(nx - ledgerHalf)}" y1="${ly}" x2="${round2(nx + ledgerHalf)}" y2="${ly}" stroke="#3a352f" stroke-width="${ledgerT}"/>`);
    }
    for (let ly = o.staffMidY + 3 * o.lineGap; ly <= y + 1; ly += o.lineGap) {
      parts.push(`<line x1="${round2(nx - ledgerHalf)}" y1="${ly}" x2="${round2(nx + ledgerHalf)}" y2="${ly}" stroke="#3a352f" stroke-width="${ledgerT}"/>`);
    }

    // Accidental, if the note's alter differs from what's in effect.
    // Measure-opening notes nudge the accidental right so it clears the
    // barline at nx - 18 (Kimi's collision rule, 2026-07-12).
    const accKey = `${pitch.step}${pitch.octave}`;
    const inEffect = accKey in measureAcc ? measureAcc[accKey] : keySignatureAlter(pitch.step, fifths);
    if (pitch.alter !== inEffect) {
      if (smufl) {
        const name = ACCIDENTAL_SMUFL[pitch.alter];
        if (name) {
          const accW = sp(smufl.glyph(name).widthSp);
          const gx = Math.max(nx - headHalfW - 1.5 - accW, newMeasure ? nx - 16 : -Infinity);
          parts.push(glyphAt(name, gx, y, '#1a1612', true));
        }
      } else {
        const g = ACCIDENTAL_GLYPH[pitch.alter] ?? '';
        if (g) parts.push(`<text x="${newMeasure ? nx - 13 : nx - 20}" y="${y + 4}" font-size="15" fill="#1a1612">${g}</text>`);
      }
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
        if (smufl) {
          const name = ACCIDENTAL_SMUFL[tp.alter];
          if (name) {
            const accW = sp(smufl.glyph(name).widthSp);
            const gx = Math.max(nx - sp(smufl.glyph('noteheadBlack').widthSp / 2) - 1.5 - accW, newMeasure ? nx - 16 : -Infinity);
            parts.push(glyphAt(name, gx, ty, TURNING_COLOUR, true));
          }
        } else {
          const g = ACCIDENTAL_GLYPH[tp.alter] ?? '';
          if (g) parts.push(`<text x="${newMeasure ? nx - 13 : nx - 19}" y="${ty + 4}" font-size="14" fill="${TURNING_COLOUR}">${g}</text>`);
        }
        turningAcc[tKey] = tp.alter;
      }
      // Two-voice collision rule, refined per the Gould extraction (v5
      // rules 103/104/109/180; Dann's legibility ruling, 2026-07-12).
      // The melody always keeps system alignment (offsets are collision
      // devices, never timing statements). Unison: turning note displaces
      // right. Second: the pair keeps the fixed rising diagonal, so the
      // turning note goes right when it is the upper note and left when
      // it is the lower. Ties and dots may refine this again at the
      // melisma build (v5 rule 169).
      const offset = (smufl ? sp(smufl.glyph('noteheadBlack').widthSp) : 12.4) + 1.6;
      const gap = Math.abs(ty - y);
      const tx = gap === 0 ? nx + offset            // unison
        : gap <= o.lineGap ? (ty < y ? nx + offset  // second, turning above
        : nx - offset)                              // second, turning below
        : nx;
      if (smufl) {
        parts.push(glyphAt('noteheadBlack', tx, ty, TURNING_COLOUR).replace('<text ', '<text opacity="0.85" '));
      } else {
        parts.push(`<ellipse cx="${round2(tx)}" cy="${ty}" rx="6" ry="4.4" fill="${TURNING_COLOUR}" opacity="0.85" transform="rotate(-18 ${round2(tx)} ${ty})"/>`);
      }
      lowestInk = Math.max(lowestInk, ty + 6);
      highestInk = Math.min(highestInk, ty - 6);
    }

    // Sung notehead: open for half and longer, filled otherwise.
    const openHead = ev.duration.base === 'half' || ev.duration.base === 'whole' || ev.duration.base === 'breve';
    if (smufl) {
      parts.push(glyphAt(headName, nx, y, '#1a1612'));
    } else {
      parts.push(openHead
        ? `<ellipse cx="${nx}" cy="${y}" rx="6.2" ry="4.6" fill="none" stroke="#1a1612" stroke-width="1.6" transform="rotate(-18 ${nx} ${y})"/>`
        : `<ellipse cx="${nx}" cy="${y}" rx="6.2" ry="4.6" fill="#1a1612" transform="rotate(-18 ${nx} ${y})"/>`);
    }

    // Stem direction, in precedence order. SEMANTICS FIRST, and the order
    // is the rule, not a convenience (Dann's ruling, 2026-08-05):
    //   1. where a turning pitch shares the stave, the melody's stem MUST
    //      state its timbre — open = down, close = up (analysis-types.ts:130).
    //      A beam may never override it. Adjacent notes of opposing timbre
    //      therefore cannot share a beam, which is why the beam pass keys
    //      its groups on timbre and the odd note out takes a flag.
    //   2. no acoustic data, but beamed: the group's direction, settled
    //      positionally at flush. Without it the stem would attach to the
    //      wrong side of the notehead.
    //   3. no acoustic data, unbeamed: Gould's positional default (r84).
    //      Above the middle line takes a down-stem, below takes an up-stem,
    //      on the line takes a down-stem by r85's no-clear-case convention.
    // 1 and 3 never both apply: `a` exists only where a profile does, so
    // Gould's positional rule is active only when no voice data constrains
    // the melody. The stem itself is no longer gated on `a`: an unmeasured
    // page still gets stems, and a stemless notehead stays reserved for a
    // turning pitch. Whole notes and breves excepted.
    const beamed = beamStemById.get(ev.id);
    const stemUp = stemUpFor(ev, y);
    if (ev.duration.base !== 'whole' && ev.duration.base !== 'breve') {
      // Stem contact y: from the notehead's anchor in SMuFL mode.
      const anchors = smufl ? smufl.glyph(headName).anchors : undefined;
      const contactY = smufl
        ? y - sp((stemUp ? anchors?.stemUpSE?.[1] : anchors?.stemDownNW?.[1]) ?? 0)
        : stemUp ? y - 1 : y + 1;
      if (beamed) {
        // The stem meets the beam; the beam replaces flags.
        parts.push(`<line x1="${round2(beamed.sx)}" y1="${round2(contactY)}" x2="${round2(beamed.sx)}" y2="${round2(beamed.tipY)}" stroke="#1a1612" stroke-width="${stemT}"/>`);
        lowestInk = Math.max(lowestInk, beamed.tipY + beamT / 2);
        highestInk = Math.min(highestInk, beamed.tipY - beamT / 2);
      } else {
        const sx = nx + (stemUp ? stemHalfUp : stemHalfDown);
        const sy2 = stemUp ? y - stemLen : y + stemLen;
        lowestInk = Math.max(lowestInk, sy2);
        highestInk = Math.min(highestInk, sy2);
        parts.push(`<line x1="${round2(sx)}" y1="${round2(contactY)}" x2="${round2(sx)}" y2="${sy2}" stroke="#1a1612" stroke-width="${stemT}"/>`);
        // Flags for unbeamed short notes.
        const flags = flagCount(ev.duration.base);
        if (flags > 0) {
          if (smufl) {
            const fg = FLAG_SMUFL[Math.min(flags, 3)];
            parts.push(glyphAt(stemUp ? fg[0] : fg[1], sx - stemT / 2, sy2, '#1a1612', true));
          } else {
            for (let f = 0; f < flags; f++) {
              const fy = sy2 + f * 6 * (stemUp ? 1 : -1);
              parts.push(`<path d="M${sx} ${fy} q8 3 7 12" fill="none" stroke="#1a1612" stroke-width="1.4"/>`);
            }
          }
        }
      }
    }

    // Red squircle around an fR1/fo crossing.
    if (a?.crossing) {
      parts.push(`<rect x="${nx - 11}" y="${y - 11}" width="22" height="22" rx="7" fill="none" stroke="#b23b3b" stroke-width="1.8"/>`);
      lowestInk = Math.max(lowestInk, y + 11);
      highestInk = Math.min(highestInk, y - 11);
    }

    // Phonation break: collected for the IPA line, drawn after the loop.
    if (a?.phonationBreak) {
      breaks.push((nx + (nextXById.get(ev.id) ?? nx + 40)) / 2);
    }

    parts.push(`</g>`);

    // Dual underlay, collected now and placed after the loop, once the
    // lowest ink is known (baseline repositioning, Dann's fix).
    const syl = ev.syllable;
    // `syl.text` is the primary (verse-1 lens) syllable text (§A.35); never
    // read `syl.verses` here, that array is real sung text for OTHER verses
    // (§A.86), not a display convenience, and must not be shown as if it
    // were this note's IPA. `options.ipaPreview` carries the full syllable
    // IPA (production: `buildUnderlayResolvers(...).ipa`, not yet wired to
    // a live render call; demo/test: the fixture's placeholder strings).
    // The `a?.vowel` fallback is a degrade path only, for when no full-IPA
    // resolver ran at all; it is a single acoustic vowel, not the real
    // syllable transcription, so it will read as sparser than the intended
    // line 2 until the production wiring lands.
    const cyr = syl?.text ?? '';
    const ipa = options.ipaPreview?.[ev.id] ?? a?.vowel ?? '';
    if (cyr || ipa) {
      const isMelisma = melismaStart.has(ev.id);
      underlay.push({
        x: isMelisma ? round2(nx - headHalfW) : nx,
        cyr,
        ipa,
        align: isMelisma ? 'start' : 'middle',
        sylType: syl?.type,
        evId: ev.id,
      });
    }
  }

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
    if (!nxt || nxt.ev.type !== 'note' || !nxt.ev.pitch) continue;
    const y1 = yFor(e.pitch);
    const a1 = analyzed.events[e.id];
    const a2 = analyzed.events[nxt.ev.id];
    // Direction: OPPOSITE the syllabic slur when one arches above the
    // span (extraction r174); otherwise away from shared stems (open =
    // stems down → tie up); mixed or unanalysed: away from the middle
    // staff line.
    const up = slurredIdx.has(i)
      ? false
      : a1 && a2 && a1.timbre === a2.timbre
        ? a1.timbre === 'open'
        : y1 < o.staffMidY;
    const half1 = smufl ? sp(smufl.glyph(headNameFor(e.duration.base)).widthSp / 2) : 6.2;
    const half2 = smufl ? sp(smufl.glyph(headNameFor(nxt.ev.duration.base)).widthSp / 2) : 6.2;
    const x1 = placed[i].x + half1 + 1;
    const x2 = nxt.x - half2 - 1;
    if (x2 <= x1) continue;
    const ey = y1 + (up ? -4 : 4);
    let depth = (up ? -1 : 1) * o.lineGap * 0.9; // shallow: flatness is identity
    // Quadratic apex sits at ey + depth/2; keep it off staff lines.
    const apex = ey + depth / 2;
    if (apex >= staffTop && apex <= staffBottom && Math.abs((apex - staffTop) % o.lineGap) < 1.5) {
      depth += up ? -3 : 3;
    }
    parts.push(`<path d="M${round2(x1)} ${round2(ey)} Q ${round2((x1 + x2) / 2)} ${round2(ey + depth)} ${round2(x2)} ${round2(ey)}" fill="none" stroke="#1a1612" stroke-width="1.1" data-tie="${esc(e.id)}"/>`);
    lowestInk = Math.max(lowestInk, ey + Math.max(0, depth));
    highestInk = Math.min(highestInk, ey + Math.min(0, depth));
  }

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
      let top = staffTop;
      for (let k = s.startIdx; k <= s.endIdx; k++) {
        const ev2 = placed[k].ev;
        if (!ev2.pitch) continue;
        const y2 = yFor(ev2.pitch);
        top = Math.min(top, y2 - 6);
        const a2 = analyzed.events[ev2.id];
        if (a2) top = Math.min(top, yFor(a2.turningPitch) - accClearSlur);
        // The same two N.4 faults the tuplet bracket had: this was gated on
        // close timbre, so an unmeasured page's positional up-stems never
        // pushed the slur clear, and the fallback was a hardcoded 30 px that
        // ignored the stave size.
        if (ev2.duration.base !== 'whole' && ev2.duration.base !== 'breve' && stemUpFor(ev2, y2)) {
          top = Math.min(top, beamStemById.get(ev2.id)?.tipY ?? y2 - stemLen);
        }
      }
      const sy = top - 6;
      const lift = Math.min(24, 10 + (last.x - first.x) / 20);
      // The control point, not the apex: the quadratic peaks at half the lift,
      // so this over-reserves rather than clipping.
      highestInk = Math.min(highestInk, sy - lift);
      parts.push(`<path d="M${round2(first.x)} ${round2(sy)} Q ${round2((first.x + last.x) / 2)} ${round2(sy - lift)} ${round2(last.x)} ${round2(sy)}" fill="none" stroke="#1a1612" stroke-width="1.3" data-slur="${esc(s.id)}"/>`);
    }
  }

  // Beams contribute ink below the staff on down-stem groups.
  for (const s of beamStemById.values()) {
    lowestInk = Math.max(lowestInk, s.tipY + beamT / 2);
    highestInk = Math.min(highestInk, s.tipY - beamT / 2);
  }

  // Underlay baselines: clear of the lowest ink, never above the classic
  // fixed offsets (compact systems keep their compact look).
  //
  // IPA IS THE NEAR LINE, Cyrillic beneath it (Dann's ruling, 2026-08-05).
  // Two reasons, and neither is cosmetic. Transcribe's word stack is already
  // IPA over Cyrillic (`Paper/WordStack.svelte:172, :181`), and Ilya's output
  // is ONE study document, so a singer learns the reading order once and
  // never relearns it when the score pages begin. And the IPA is the line
  // acted on at the moment of phonation, so it belongs nearest the notes:
  // Gould r13 asks the text to sit as close to the stave as it can and does
  // not say which line, so this serves her rationale rather than departing
  // from it (INFERENCE, r13 states no order for a pronunciation line; r45's
  // original-language-nearest rule governs two LANGUAGES, and IPA is not a
  // second language but a pronunciation guide, which she treats separately
  // at r49 and r50 without ordering it).
  const ipaY = Math.max(staffBottom + 28, Math.ceil(lowestInk) + 14);
  const cyrY = ipaY + 16;
  for (const u of underlay) {
    if (u.cyr) parts.push(`<text x="${u.x}" y="${cyrY}" text-anchor="${u.align}" font-size="12.5" fill="#1a1612">${esc(u.cyr)}</text>`);
    // IPA is ALWAYS upright, in the app's 'Lato IPA' subset (Mitton 2020
    // §§4.6.6–4.6.7 via Grayson): italics flatten double-storey [a] toward
    // single-storey, destroying the bright-a / dark-a contrast that sung
    // Russian depends on (dark [ɑ] default, bright [a] interpalatal only).
    if (u.ipa) parts.push(`<text x="${u.x}" y="${ipaY}" text-anchor="${u.align}" font-size="12" fill="#6a655f" font-family="'Lato IPA', sans-serif">${esc(u.ipa)}</text>`);
  }
  // Phonation breaks: [#] on the IPA line, in full ink for attention.
  for (const bx of breaks) {
    parts.push(`<text x="${bx}" y="${ipaY}" text-anchor="middle" font-size="12" fill="#1a1612" font-family="'Lato IPA', sans-serif">[#]</text>`);
  }

  // ── Hyphens and extenders (melisma build 2; Dann's Gould extraction,
  // rules 26–40). The distinction is semantic: a hyphen is RAISED and
  // means the word continues; an extender sits ON THE BASELINE at
  // staff-line thickness and means the word has ended while its final
  // sound continues, running to the last notehead and no further.
  {
    const estW = (s: string): number => s.length * 7.5; // width estimate at 12.5px
    const rightEdgeOf = (u: (typeof underlay)[number]): number =>
      u.align === 'start' ? u.x + estW(u.cyr) : u.x + estW(u.cyr) / 2;
    const leftEdgeOf = (u: (typeof underlay)[number]): number =>
      u.align === 'start' ? u.x : u.x - estW(u.cyr) / 2;
    const noteXs = placed.filter((p) => p.ev.type === 'note').map((p) => p.x);
    const hyphenY = cyrY - 4; // raised to roughly x-height midpoint

    // Hyphens: between consecutive syllables of one word (start|middle
    // followed by middle|end). One per gap; wide gaps fill at intervals;
    // a hyphen never sits directly under a note column (nudged clear).
    for (let i = 0; i < underlay.length - 1; i++) {
      const a = underlay[i];
      const b = underlay[i + 1];
      const joins = (a.sylType === 'start' || a.sylType === 'middle') && (b.sylType === 'middle' || b.sylType === 'end');
      if (!joins || !a.cyr || !b.cyr) continue;
      const from = rightEdgeOf(a) + 2;
      const to = leftEdgeOf(b) - 2;
      if (to <= from) continue;
      const count = Math.max(1, Math.floor((to - from) / 60));
      for (let k = 1; k <= count; k++) {
        let hx = from + ((to - from) * k) / (count + 1);
        if (noteXs.some((x2) => Math.abs(x2 - hx) < 7)) hx += 8; // clear of note columns
        parts.push(`<line x1="${round2(hx - 2.5)}" y1="${hyphenY}" x2="${round2(hx + 2.5)}" y2="${hyphenY}" stroke="#1a1612" stroke-width="1" data-hyphen="${esc(a.evId)}"/>`);
      }
    }

    // Extenders: word-final syllable (whole|end) opening a melisma.
    for (const u of underlay) {
      if ((u.sylType === 'whole' || u.sylType === 'end') && melismaEndX.has(u.evId)) {
        const x1 = rightEdgeOf(u) + 3;
        const x2 = melismaEndX.get(u.evId)! + 6;
        if (x2 > x1) {
          parts.push(`<line x1="${round2(x1)}" y1="${cyrY}" x2="${round2(x2)}" y2="${cyrY}" stroke="#1a1612" stroke-width="${staffLineT}" data-extender="${esc(u.evId)}"/>`);
        }
      }
    }
  }

  // Beams and tuplet brackets (drawn once, after the notes they govern).
  parts.push(...beamParts);
  parts.push(...tupletParts);

  // Final barline.
  const finalBarT = smufl ? round2(sp(ed!.thickBarlineThickness)) : 1.6;
  parts.push(`<line x1="${contentRight - 6}" y1="${staffTop}" x2="${contentRight - 6}" y2="${staffBottom}" stroke="#3a352f" stroke-width="${finalBarT}"/>`);
  parts.push('</svg>');

  // Patch the svg tag and background with the true extent. The LOWER of the
  // two underlay baselines governs the bottom, which is the Cyrillic since
  // the swap; `highestInk` governs the top (N.6a).
  //
  // WHY THE TOP IS CROPPED RATHER THAN `staffMidY` REDUCED. `staffMidY`
  // defaults to a fixed 96 px and no caller scales it with `lineGap`, so on
  // the print sheet's 5.5 px stave every system reserved about 85 px above a
  // 22 px staff and a page fitted four systems where six belong (Dann at the
  // browser, 2026-08-06). Shrinking `staffMidY` would move every coordinate
  // in the system and could clip a high tessitura; cropping the viewBox
  // leaves every element's own y untouched, so the `data-event-id`
  // hit-testing math is unaffected, and the headroom is sized by what
  // actually occupies it (Gould r184: a gap is sized by what must live
  // inside it), never by a constant.
  //
  // `paginateScore` MUST read this viewBox's min-y. `viewBoxOf` was written
  // when the origin was always 0.
  const top = Math.max(0, Math.floor(Math.min(highestInk, staffTop) - sp(1)));
  const height = cyrY + 20 - top;
  parts[0] = `<svg viewBox="0 ${top} ${width} ${height}" xmlns="http://www.w3.org/2000/svg" font-family="'Source Serif 4', Georgia, serif">`;
  parts[1] = `<rect x="0" y="${top}" width="${width}" height="${height}" fill="#F0EBE0"/>`;
  return parts.join('\n');
}
