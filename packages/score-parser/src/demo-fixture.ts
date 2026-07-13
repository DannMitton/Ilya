/**
 * Shared demo fixture for the staff renderer: a four-measure phrase
 * exercising rhythmic spacing, barlines, accidentals, rests, flags,
 * beat-derived beaming (including the timbre-change break), a triplet,
 * turning-layer accidentals with measure carry, and all four analytical
 * marks plus the `#` phonation break.
 *
 * Used by `staff-renderer.test.ts` (string assertions) and by the
 * in-browser font lab (visual taste test). NOT production data.
 *
 * The IPA strings here are PLACEHOLDERS for layout work only. Production
 * underlay comes verbatim from Ilya's GraysonEngine via processText
 * (post-assimilation); the renderer never synthesizes IPA (Dann's
 * tethering requirement, 2026-07-12).
 */

import { analyzeScore, type VowelResolver } from './overlay-engine';
import { renderAnalyzedStaff, type StaffRenderOptions } from './staff-renderer';
import { prepareSmuflFont, REQUIRED_GLYPHS, type PreparedSmuflFont } from './smufl-metadata';
import type { Fraction, NoteBase, ParsedScore, Pitch, TieInfo, TupletInfo, VocalLineEvent } from './types';
import type { VoiceProfileSnapshot } from './analysis-types';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const frac = (n: number, d: number): Fraction => ({ numerator: n, denominator: d });
const DUR: Record<NoteBase, Fraction> = {
  breve: frac(2, 1), whole: frac(1, 1), half: frac(1, 2), quarter: frac(1, 4), eighth: frac(1, 8),
  '16th': frac(1, 16), '32nd': frac(1, 32), '64th': frac(1, 64), '128th': frac(1, 128),
};

function note(id: string, measureIndex: number, pos: Fraction, pitch: Pitch | null, base: NoteBase, verses?: [string, string], tuplet?: TupletInfo, sylType: 'whole' | 'start' | 'middle' | 'end' = 'whole', tied?: TieInfo): VocalLineEvent {
  const plain = DUR[base];
  const fraction = tuplet
    ? { numerator: plain.numerator * tuplet.normalNotes, denominator: plain.denominator * tuplet.actualNotes }
    : plain;
  return {
    id,
    type: pitch ? 'note' : 'rest',
    measureIndex,
    rhythmicPosition: { fraction: pos },
    duration: { base, dots: 0, fraction, ...(tuplet ? { tuplet } : {}) },
    ...(pitch ? { pitch } : {}),
    ...(tied ? { tied } : {}),
    ...(verses ? { syllable: { id: `s-${id}`, text: verses[0], type: sylType, verseNumber: 1, wordContext: verses[0], verses } } : {}),
  };
}

const TRIPLET: TupletInfo = { actualNotes: 3, normalNotes: 2, normalType: 'eighth' };

export const demoProfile: VoiceProfileSnapshot = {
  fR1: { a: 650, o: 450, u: 350, i: 300, e: 400, ɛ: 500, ɑ: 622 },
  range: { lowest: P('C', 2), highest: P('E', 4) },
  tessitura: { low: P('F', 2), high: P('C', 3) },
  passaggio: { primo: P('A', 2), secondo: P('D', 3) },
  label: 'bass',
};

const vowelById: Record<string, string> = {
  n1: 'a', n2: 'o', n3: 'o', n5: 'i', n6: 'i',
  n7: 'o', n8: 'u', n9: 'o', n10: 'o', n11: 'i',
  n13: 'ɑ', n14: 'ɑ', n15: 'ɑ', n16: 'a',
  n18: 'o', n19: 'o', n20: 'o', // melisma: the vowel carries across
};
export const demoResolver: VowelResolver = (e) => vowelById[e.id];

export function demoScore(): ParsedScore {
  const events = [
    // «Ты погрузись»: the polysyllable по-гру-зи-сь carries syllable types
    // (start/middle/middle/end) so hyphenation is exercised, including
    // across the rest n4 (hyphens flank rests, Gould extraction r32).
    note('n1', 0, frac(0, 1), P('F', 2), 'quarter', ['Ты', 'tɨ']),
    note('n2', 0, frac(1, 4), P('A', 2), 'eighth', ['по', 'po'], undefined, 'start'),
    note('n3', 0, frac(3, 8), P('B', 2), 'eighth', ['гру', 'gru'], undefined, 'middle'), // B natural vs Bb key → ♮
    note('n4', 0, frac(1, 2), null, 'quarter'), // rest
    // Sung D3 on [i]: the turning pitch for [i] (fR1 300 → 150 Hz) is ALSO
    // D3, a deliberate unison collision exercising the two-voice offset
    // rule (turning notehead displaced beside the sung note).
    note('n5', 1, frac(0, 1), P('D', 3), 'quarter', ['зи', 'zi'], undefined, 'middle'),
    note('n6', 1, frac(1, 4), P('D', 4), 'half', ['сь', 'sʲ'], undefined, 'end'), // crossing (≈ fR1 300)
    // Measure 3: beaming cases. Beat 1: an eighth pair, both open → one
    // primary beam despite differing vowels (grouping is by timbre).
    // Beat 2: a 16th pair (open, double beam) then an eighth whose vowel
    // flips the timbre to close → the beam breaks and it takes a flag.
    note('n7', 2, frac(0, 1), P('F', 2), 'eighth', ['но', 'no']),
    note('n8', 2, frac(1, 8), P('G', 2), 'eighth', ['чу', 'tʃʲu']),
    note('n9', 2, frac(1, 4), P('A', 2), '16th', ['по', 'po']),
    note('n10', 2, frac(5, 16), P('B', 2, -1), '16th', ['го', 'go']),
    note('n11', 2, frac(3, 8), P('E', 3), 'eighth', ['ди', 'dʲi']), // close vs open n9/n10 → beam break
    note('n12', 2, frac(1, 2), null, 'quarter'), // rest
    // Measure 4: an eighth-note triplet on dark-a (fR1 622 → turning D#4:
    // the sage sharp appears once and carries through the measure), then a
    // quarter on [a] whose natural turning E4 needs no accidental.
    note('n13', 3, frac(0, 1), P('A', 2), 'eighth', ['тьма', 'tʲmɑ'], TRIPLET),
    note('n14', 3, frac(1, 12), P('B', 2, -1), 'eighth', ['на', 'nɑ'], TRIPLET),
    note('n15', 3, frac(1, 6), P('C', 3), 'eighth', ['ста', 'stɑ'], TRIPLET),
    // «пять» [pʲatʲ]: interpalatal bright-a (Mitton 2020 §4.6.6), placed
    // beside the dark-a [ɑ] syllables so the a/ɑ contrast is visually
    // checkable in the font lab.
    note('n16', 3, frac(1, 4), P('D', 3), 'quarter', ['пять', 'pʲatʲ']),
    note('n17', 3, frac(1, 2), null, 'quarter'), // rest
    // Measure 5: a three-note melisma on «по» (syllable on n18 only;
    // n19 and n20 continue the vowel, encoded by absent syllables per the
    // data model). Exercises melisma detection and Gould's left-aligned
    // melisma syllable (extraction rules 4 to 6).
    // n19 ties into n20 (same pitch): the tie is a melisma-interior case,
    // exercising flat head-anchored tie rendering (extraction Section R).
    note('n18', 4, frac(0, 1), P('G', 2), 'eighth', ['по', 'po']),
    note('n19', 4, frac(1, 8), P('A', 2), 'eighth', undefined, undefined, 'whole', { type: 'start' }),
    note('n20', 4, frac(1, 4), P('A', 2), 'quarter', undefined, undefined, 'whole', { type: 'stop' }),
    note('n21', 4, frac(1, 2), null, 'quarter'), // rest
  ];
  const m = (index: number) => ({ index, number: String(index + 1), timeSignature: { beats: 3, beatType: 4 }, keySignature: { fifths: -1 }, expectedDuration: frac(3, 4) });
  return {
    source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
    vocalPart: { partId: 'P1', partName: 'Voice' },
    measures: [m(0), m(1), m(2), m(3), m(4)],
    keySignatures: [{ measureIndex: 0, signature: { fifths: -1 } }],
    timeSignatures: [{ measureIndex: 0, signature: { beats: 3, beatType: 4 } }],
    tempoMarkings: [],
    vocalLine: events,
  };
}

/** Analyse the demo and mark n2 as a phonation break (as the diction layer would). */
export function renderDemo(options?: StaffRenderOptions): string {
  const parsed = demoScore();
  const analyzed = analyzeScore(parsed, demoProfile, demoResolver, { generatedAt: '2026-07-12T00:00:00.000Z' });
  analyzed.events.n2.phonationBreak = true;
  return renderAnalyzedStaff(parsed, analyzed, options);
}

/**
 * A complete synthetic SMuFL font for tests: every required glyph gets the
 * same bounding box and stem anchors, so assertions are deterministic
 * without shipping a real metadata file into the test bundle.
 */
export function syntheticSmuflFont(fontName = 'TestFont'): PreparedSmuflFont {
  const glyphBBoxes: Record<string, { bBoxNE: [number, number]; bBoxSW: [number, number] }> = {};
  const glyphsWithAnchors: Record<string, Record<string, [number, number]>> = {};
  for (const name of REQUIRED_GLYPHS) {
    glyphBBoxes[name] = { bBoxNE: [1.18, 0.5], bBoxSW: [0, -0.5] };
    glyphsWithAnchors[name] = { stemUpSE: [1.18, 0.168], stemDownNW: [0, -0.168] };
  }
  return prepareSmuflFont({
    fontName,
    fontVersion: '1.0',
    engravingDefaults: {
      staffLineThickness: 0.13,
      stemThickness: 0.12,
      beamThickness: 0.5,
      beamSpacing: 0.25,
      thinBarlineThickness: 0.16,
      thickBarlineThickness: 0.5,
      legerLineThickness: 0.16,
      legerLineExtension: 0.4,
      tupletBracketThickness: 0.16,
    },
    glyphBBoxes,
    glyphsWithAnchors,
  });
}
