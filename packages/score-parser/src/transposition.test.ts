/**
 * Transposition-suggestion tests. Hand-built scores with pitches chosen so
 * range violations and their resolutions are checkable by hand (range
 * C3..C5; C4 = 60, C5 = 72, E5 = 76). Runs in the sandbox via the node
 * vitest shim; authoritative run is `pnpm --filter @ilya/score-parser test`.
 */

import { describe, expect, it } from 'vitest';
import {
  suggestTranspositions,
  transposePitch,
  transposeScore,
  spellPitch,
  intervalName,
  keyAfterTransposition,
  keyNameAfterTransposition,
  engraveInKey,
  doubleAccidentalsDrawn,
  transpositionRulerStops,
  type TranspositionCandidate,
} from './transposition';
import { advanceAccidentalState } from './staff-renderer';
import { pitchToMidi, type VowelResolver } from './overlay-engine';
import type { Fraction, Measure, ParsedScore, Pitch, VocalLineEvent } from './types';
import type { VoiceProfileSnapshot } from './analysis-types';

const QUARTER: Fraction = { numerator: 1, denominator: 4 };
const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

function note(id: string, pitch: Pitch | null, vowel?: string): VocalLineEvent {
  return {
    id,
    type: pitch ? 'note' : 'rest',
    measureIndex: 0,
    rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
    duration: { base: 'quarter', dots: 0, fraction: QUARTER },
    ...(pitch ? { pitch } : {}),
    ...(vowel
      ? { syllable: { id: `s-${id}`, text: vowel, type: 'whole', verseNumber: 1, wordContext: vowel } }
      : {}),
  };
}

function buildScore(events: VocalLineEvent[]): ParsedScore {
  const measure: Measure = {
    index: 0,
    number: '1',
    timeSignature: { beats: 4, beatType: 4 },
    keySignature: { fifths: 0 },
    expectedDuration: { numerator: 1, denominator: 1 },
  };
  return {
    source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
    vocalPart: { partId: 'P1', partName: 'Voice' },
    measures: [measure],
    keySignatures: [{ measureIndex: 0, signature: { fifths: 0 } }],
    timeSignatures: [{ measureIndex: 0, signature: { beats: 4, beatType: 4 } }],
    tempoMarkings: [],
    vocalLine: events,
  };
}

const bySyllable: VowelResolver = (e) => e.syllable?.text;

const profile: VoiceProfileSnapshot = {
  fR1: { a: 600, i: 300, u: 320 },
  range: { lowest: P('C', 3), highest: P('C', 5) },
};
const profileNoRange: VoiceProfileSnapshot = { fR1: { a: 600, i: 300, u: 320 } };

describe('transposePitch', () => {
  it('shifts by semitones with height-correct spelling', () => {
    expect(transposePitch(P('C', 4), 2)).toEqual(P('D', 4));
    expect(transposePitch(P('C', 4), -1)).toEqual(P('B', 3));
    expect(transposePitch(P('E', 3), 1)).toEqual(P('F', 3));
    expect(pitchToMidi(transposePitch(P('C', 4), 7))).toBe(pitchToMidi(P('G', 4)));
  });
});

describe('transposeScore', () => {
  it('is non-destructive, shifts every pitch, preserves rests; 0 returns the input', () => {
    const s = buildScore([note('n1', P('C', 4), 'a'), note('r', null)]);
    const up = transposeScore(s, 2);
    expect(up).not.toBe(s);
    expect(s.vocalLine[0].pitch).toEqual(P('C', 4)); // original untouched
    expect(up.vocalLine[0].pitch).toEqual(P('D', 4));
    expect(up.vocalLine[1].pitch).toBeUndefined();
    expect(transposeScore(s, 0)).toBe(s);
  });
});

describe('intervalName', () => {
  it('names direction and interval', () => {
    expect(intervalName(-2)).toBe('down a whole tone');
    expect(intervalName(3)).toBe('up a minor third');
    expect(intervalName(-4)).toBe('down a major third');
  });
});

describe('suggestTranspositions', () => {
  it('suggests the smallest downward shift that resolves a high out-of-range note', () => {
    // E5 (76) is above C5 (72); C4 (60) is comfortably within C3..C5.
    const score = buildScore([note('n1', P('C', 4), 'a'), note('n2', P('E', 5), 'a')]);
    const out = suggestTranspositions(score, profile, bySyllable);
    expect(out.currentOutOfRange).toBe(1);
    expect(out.suggestions.length).toBeGreaterThan(0);
    expect(out.suggestions.length).toBeLessThanOrEqual(2);
    for (const c of out.suggestions) expect(c.outOfRange).toBeLessThan(out.currentOutOfRange);
    expect(out.suggestions[0].resolvesRange).toBe(true);
    expect(out.suggestions[0].semitones).toBe(-4); // E5 -> C5, smallest fully-resolving move
    expect(out.suggestions[0].intervalName).toBe('down a major third');
  });

  it('suggests an upward shift for a low out-of-range note', () => {
    // A#2 (46) is below C3 (48); G3 (55) is in range. Transposing up brings A#2 in.
    const score = buildScore([note('n1', P('A', 2, 1), 'a'), note('n2', P('G', 3), 'a')]);
    const out = suggestTranspositions(score, profile, bySyllable);
    expect(out.currentOutOfRange).toBe(1);
    expect(out.suggestions.length).toBeGreaterThan(0);
    expect(out.suggestions[0].semitones).toBeGreaterThan(0);
    expect(out.suggestions[0].resolvesRange).toBe(true);
  });

  it('returns no suggestion when the printed key already fits', () => {
    const score = buildScore([note('n1', P('C', 4), 'a'), note('n2', P('G', 4), 'a')]);
    const out = suggestTranspositions(score, profile, bySyllable);
    expect(out.currentOutOfRange).toBe(0);
    expect(out.suggestions).toEqual([]);
  });

  it('returns no suggestion when the profile carries no range', () => {
    const score = buildScore([note('n1', P('E', 5), 'a')]);
    const out = suggestTranspositions(score, profileNoRange, bySyllable);
    expect(out.currentOutOfRange).toBe(0);
    expect(out.suggestions).toEqual([]);
  });

  it('ranks by range fit, then crossings, then smaller shift', () => {
    const score = buildScore([note('n1', P('C', 4), 'a'), note('n2', P('E', 5), 'a')]);
    const out = suggestTranspositions(score, profile, bySyllable, { maxSuggestions: 5 });
    const le = (a: TranspositionCandidate, b: TranspositionCandidate): boolean =>
      a.outOfRange !== b.outOfRange
        ? a.outOfRange < b.outOfRange
        : a.crossings !== b.crossings
          ? a.crossings < b.crossings
          : Math.abs(a.semitones) <= Math.abs(b.semitones);
    for (let i = 1; i < out.suggestions.length; i++) {
      expect(le(out.suggestions[i - 1], out.suggestions[i])).toBe(true);
    }
  });

  it('attaches the named target key when the score declares a mode', () => {
    // Range C3..C5; E5 is out of range, best fully-resolving move is down a
    // major third (E5 -> C5). C major transposed down a major third is A flat.
    const cMajor = inKey(buildScore([note('n1', P('C', 4), 'a'), note('n2', P('E', 5), 'a')]), 0, 'major');
    const out = suggestTranspositions(cMajor, profile, bySyllable);
    expect(out.suggestions[0].semitones).toBe(-4);
    expect(out.suggestions[0].targetKey).toBe('A flat major');
    expect(out.suggestions[0].targetKeySignature).toEqual({ fifths: -4, mode: 'major' });
  });

  it('omits the target key when the score declares no mode', () => {
    // buildScore's default key signature carries fifths but no mode.
    const score = buildScore([note('n1', P('C', 4), 'a'), note('n2', P('E', 5), 'a')]);
    const out = suggestTranspositions(score, profile, bySyllable);
    expect(out.suggestions.length).toBeGreaterThan(0);
    for (const c of out.suggestions) expect(c.targetKey).toBeUndefined();
    for (const c of out.suggestions) expect(c.targetKeySignature).toBeUndefined();
  });
});

/** Re-key a hand-built score so key-name derivation has a mode to read. */
function inKey(score: ParsedScore, fifths: number, mode?: 'major' | 'minor'): ParsedScore {
  return {
    ...score,
    keySignatures: [{ measureIndex: 0, signature: { fifths, ...(mode ? { mode } : {}) } }],
  };
}

describe('keyNameAfterTransposition', () => {
  it('names major targets on the circle of fifths', () => {
    const cMaj = { fifths: 0, mode: 'major' as const };
    expect(keyNameAfterTransposition(cMaj, -4)).toBe('A flat major'); // down a major third
    expect(keyNameAfterTransposition(cMaj, 7)).toBe('G major'); // up a perfect fifth
    expect(keyNameAfterTransposition(cMaj, 1)).toBe('D flat major'); // up a semitone
    expect(keyNameAfterTransposition(cMaj, 5)).toBe('F major'); // up a perfect fourth
  });

  it('names minor targets from the same signature table', () => {
    const aMin = { fifths: 0, mode: 'minor' as const };
    expect(keyNameAfterTransposition(aMin, -4)).toBe('F minor'); // down a major third
    expect(keyNameAfterTransposition(aMin, 2)).toBe('B minor'); // up a whole tone
  });

  it('respells beyond seven accidentals to a normal key', () => {
    // C sharp major up a whole tone is D sharp major (nine sharps) -> E flat major.
    expect(keyNameAfterTransposition({ fifths: 7, mode: 'major' }, 2)).toBe('E flat major');
    // C flat major down a whole tone is B double-flat major -> A major.
    expect(keyNameAfterTransposition({ fifths: -7, mode: 'major' }, -2)).toBe('A major');
  });

  it('gives the same key as numbers for the app to name (N.82)', () => {
    expect(keyAfterTransposition({ fifths: 0, mode: 'major' }, -4)).toEqual({ fifths: -4, mode: 'major' });
    expect(keyAfterTransposition({ fifths: 7, mode: 'major' }, 2)).toEqual({ fifths: -3, mode: 'major' });
    expect(keyAfterTransposition({ fifths: 0, mode: 'minor' }, 2)).toEqual({ fifths: 2, mode: 'minor' });
    expect(keyAfterTransposition({ fifths: -1 }, -4)).toBeNull();
  });

  it('returns null when there is no mode to trust', () => {
    expect(keyNameAfterTransposition({ fifths: -1 }, -4)).toBeNull();
    expect(keyNameAfterTransposition(undefined, -4)).toBeNull();
  });
});

/**
 * THE SPELLING POLICY (N.92 slice 2, ruled by Dann 2026-08-24).
 *
 * Read these as a musician would: every case names the note a singer expects to
 * see on the page, and the fifteen-key sweep asserts the two facts that make a
 * key signature what it is (its own seven letters, at its own heights).
 */
describe('spellPitch, the one speller', () => {
  /** Major tonic of each signature, -7 fifths to +7. The hand-written truth. */
  const TONIC_BY_FIFTHS: Pitch[] = [
    { step: 'C', alter: -1, octave: 4 }, // 7 flats, C flat major
    { step: 'G', alter: -1, octave: 4 },
    { step: 'D', alter: -1, octave: 4 },
    { step: 'A', alter: -1, octave: 4 },
    { step: 'E', alter: -1, octave: 4 },
    { step: 'B', alter: -1, octave: 4 },
    { step: 'F', alter: 0, octave: 4 },
    { step: 'C', alter: 0, octave: 4 }, // no sharps, no flats
    { step: 'G', alter: 0, octave: 4 },
    { step: 'D', alter: 0, octave: 4 },
    { step: 'A', alter: 0, octave: 4 },
    { step: 'E', alter: 0, octave: 4 },
    { step: 'B', alter: 0, octave: 4 },
    { step: 'F', alter: 1, octave: 4 },
    { step: 'C', alter: 1, octave: 4 }, // 7 sharps, C sharp major
  ];

  const MAJOR_DEGREES = [0, 2, 4, 5, 7, 9, 11];

  it('spells every one of the fifteen key signatures with its own seven letters', () => {
    for (let fifths = -7; fifths <= 7; fifths++) {
      const key = { fifths };
      const tonic = TONIC_BY_FIFTHS[fifths + 7];
      const tonicMidi = pitchToMidi(tonic);
      const letters = new Set<string>();
      for (const degree of MAJOR_DEGREES) {
        const spelled = spellPitch(tonicMidi + degree, { key });
        // The scale of the key uses each letter once and only once.
        letters.add(spelled.step);
        // The number of accidentals never exceeds the signature's own count.
        expect(Math.abs(spelled.alter)).toBeLessThanOrEqual(1);
        // Flat keys carry no sharps and sharp keys carry no flats.
        if (fifths < 0) expect(spelled.alter).toBeLessThanOrEqual(0);
        if (fifths > 0) expect(spelled.alter).toBeGreaterThanOrEqual(0);
      }
      expect(letters.size).toBe(7);
      // And the tonic itself comes back exactly as written above.
      expect(spellPitch(tonicMidi, { key })).toEqual(tonic);
    }
  });

  it('never changes the sounding pitch, in any key, anywhere in the octave', () => {
    for (let fifths = -7; fifths <= 7; fifths++) {
      for (let midi = 55; midi <= 79; midi++) {
        expect(pitchToMidi(spellPitch(midi, { key: { fifths } }))).toBe(midi);
      }
    }
  });

  it('spells the two keys whose tonic crosses the octave boundary', () => {
    // C sharp major's leading note is B sharp, an octave below its own tonic,
    // and C flat major's tonic is a C flat that sounds where B natural does.
    expect(spellPitch(72, { key: { fifths: 7 } })).toEqual({ step: 'B', alter: 1, octave: 4 });
    expect(spellPitch(71, { key: { fifths: -7 } })).toEqual({ step: 'C', alter: -1, octave: 5 });
  });

  it('spells a chromatic note to the key own side', () => {
    // E flat major: the note between C and D is a D flat, not a C sharp.
    expect(spellPitch(61, { key: { fifths: -3 } })).toEqual({ step: 'D', alter: -1, octave: 4 });
    // D major: the raised fourth is a G sharp.
    expect(spellPitch(68, { key: { fifths: 2 } })).toEqual({ step: 'G', alter: 1, octave: 4 });
    // A key of no sharps and no flats takes the sharp side, as the reader did
    // before this policy existed.
    expect(spellPitch(61, { key: { fifths: 0 } })).toEqual({ step: 'C', alter: 1, octave: 4 });
  });

  it('prefers the key own spelling over its side, so E flat major keeps its E flat', () => {
    expect(spellPitch(63, { key: { fifths: -3 } })).toEqual({ step: 'E', alter: -1, octave: 4 });
    // B major's own A sharp, which the flat side would have called a B flat.
    expect(spellPitch(70, { key: { fifths: 5 } })).toEqual({ step: 'A', alter: 1, octave: 4 });
  });

  it('falls back to the melodic interval where there is no key at all', () => {
    // A leap: E flat up to the note three semitones above is a minor third to G
    // flat, never an augmented second to F sharp.
    expect(spellPitch(66, { previous: { step: 'E', alter: -1, octave: 4 } })).toEqual({
      step: 'G',
      alter: -1,
      octave: 4,
    });
    // C up to the note ten semitones above is a minor seventh to B flat, never
    // an augmented sixth to A sharp.
    expect(spellPitch(70, { previous: { step: 'C', alter: 0, octave: 4 } })).toEqual({
      step: 'B',
      alter: -1,
      octave: 4,
    });
    // C sharp up a tone is a D sharp, not the diminished third to E flat.
    expect(spellPitch(63, { previous: { step: 'C', alter: 1, octave: 4 } })).toEqual({
      step: 'D',
      alter: 1,
      octave: 4,
    });
  });

  it('spells a semitone neighbour as the second, not the chromatic inflection', () => {
    // Sunless 1, measure 2, as Dann engraved it: A A A up to the flat sixth is
    // a B flat. The plain interval from A is the minor second, so the policy
    // says B flat where the direction alone would have said A sharp.
    expect(spellPitch(58, { previous: { step: 'A', alter: 0, octave: 3 } })).toEqual({
      step: 'B',
      alter: -1,
      octave: 3,
    });
  });

  it('lets direction decide only where neither spelling makes a plain interval', () => {
    // A tritone reads as an augmented fourth or a diminished fifth whichever
    // way it is written, so nothing distinguishes the two spellings but the way
    // the line is going: rising takes the sharp, falling takes the flat.
    expect(spellPitch(66, { previous: { step: 'C', alter: 0, octave: 4 } }).alter).toBe(1);
    expect(spellPitch(66, { previous: { step: 'C', alter: 0, octave: 5 } }).alter).toBe(-1);
  });

  it('takes the sharp side with no key and no previous note', () => {
    expect(spellPitch(61)).toEqual({ step: 'C', alter: 1, octave: 4 });
  });

  it('leaves a white key alone whatever the context', () => {
    expect(spellPitch(60, { previous: { step: 'B', alter: -1, octave: 3 } })).toEqual({
      step: 'C',
      alter: 0,
      octave: 4,
    });
  });
});

// ── N.94 slice 1: engraving in a new key ───────────────────────────────

/** A score in `fifths` (and `mode`) over `measureCount` bars, notes spread across them. */
function keyedScore(
  pitches: Pitch[],
  fifths: number,
  mode: 'major' | 'minor' | undefined = 'major',
  measureCount = 2,
): ParsedScore {
  const key = mode ? { fifths, mode } : { fifths };
  const base = buildScore(
    pitches.map((p, i) => ({ ...note(`n${i}`, p), measureIndex: i % measureCount })),
  );
  return {
    ...base,
    measures: Array.from({ length: measureCount }, (_, i) => ({
      ...base.measures[0],
      index: i,
      number: String(i + 1),
      keySignature: key,
    })),
    keySignatures: [{ measureIndex: 0, signature: key }],
  };
}

/** D major, one octave up from D4: every note diatonic. */
const D_MAJOR_SCALE = [
  P('D', 4), P('E', 4), P('F', 4, 1), P('G', 4), P('A', 4), P('B', 4), P('C', 5, 1), P('D', 5),
];

/** How many notes the renderer would give an accidental, by its own rule. */
function accidentalsDrawn(s: ParsedScore): number {
  const fifths = s.keySignatures[0].signature.fifths;
  let n = 0;
  for (const e of s.vocalLine) {
    if (e.pitch && advanceAccidentalState(e.pitch, fifths, {}, {}) !== 'none') n++;
  }
  return n;
}

describe('engraveInKey', () => {
  it('moves the signature and every measure snapshot, keeping the mode', () => {
    const s = keyedScore(D_MAJOR_SCALE, 2);
    const b = engraveInKey(s, { semitones: -3, fifths: 5 });
    expect(b.keySignatures).toEqual([{ measureIndex: 0, signature: { fifths: 5, mode: 'major' } }]);
    expect(b.measures.map((m) => m.keySignature)).toEqual([
      { fifths: 5, mode: 'major' },
      { fifths: 5, mode: 'major' },
    ]);
    // Non-destructive: the printed score is untouched.
    expect(s.keySignatures[0].signature.fifths).toBe(2);
    expect(s.measures[1].keySignature.fifths).toBe(2);
    expect(s.vocalLine[0].pitch).toEqual(P('D', 4));
  });

  it('D major down a minor third lands in B major with no accidental on a diatonic note', () => {
    const b = engraveInKey(keyedScore(D_MAJOR_SCALE, 2), { semitones: -3, fifths: 5 });
    expect(b.vocalLine.map((e) => e.pitch)).toEqual([
      P('B', 3), P('C', 4, 1), P('D', 4, 1), P('E', 4), P('F', 4, 1), P('G', 4, 1), P('A', 4, 1), P('B', 4),
    ]);
    expect(accidentalsDrawn(b)).toBe(0);
  });

  it('the same move to C flat major spells every note with flats', () => {
    const cb = engraveInKey(keyedScore(D_MAJOR_SCALE, 2), { semitones: -3, fifths: -7 });
    expect(cb.keySignatures[0].signature).toEqual({ fifths: -7, mode: 'major' });
    for (const e of cb.vocalLine) expect(e.pitch?.alter).toBe(-1);
    // Same heights as B major: C flat 4 sounds B3, and the octave arithmetic says so.
    expect(cb.vocalLine[0].pitch).toEqual(P('C', 4, -1));
    expect(pitchToMidi(cb.vocalLine[0].pitch!)).toBe(pitchToMidi(P('B', 3)));
    expect(accidentalsDrawn(cb)).toBe(0);
  });

  it('a chromatic note keeps its printed spelling, moved by the tonic interval', () => {
    // G sharp in D major is the raised fourth: E natural in B flat major, E sharp in B major.
    const s = keyedScore([P('G', 4, 1)], 2);
    expect(engraveInKey(s, { semitones: -4, fifths: -2 }).vocalLine[0].pitch).toEqual(P('E', 4));
    expect(engraveInKey(s, { semitones: -3, fifths: 5 }).vocalLine[0].pitch).toEqual(P('E', 4, 1));
  });

  it('the flat sixth stays a flat sixth: Sunless 1, bar 2, where tier 2 alone went wrong', () => {
    // B flat in D major. Tier 2 spells C major's chromatic notes sharp (G sharp)
    // and E flat major's pitch class 11 as B natural; the degree is A flat and C flat.
    const s = keyedScore([P('A', 3), P('B', 3, -1)], 2, 'major', 1);
    expect(engraveInKey(s, { semitones: -2, fifths: 0 }).vocalLine.map((e) => e.pitch)).toEqual([P('G', 3), P('A', 3, -1)]);
    const eFlat = engraveInKey(s, { semitones: 1, fifths: -3 });
    expect(eFlat.vocalLine.map((e) => e.pitch)).toEqual([P('B', 3, -1), P('C', 4, -1)]);
    expect(accidentalsDrawn(eFlat)).toBe(1);
  });

  it('a note that would need a triple accidental takes its enharmonic with fewer', () => {
    // The ruled case (Dann 2026-09-28 21:35): B double flat down a chromatic
    // semitone, an augmented unison (D major to D flat major, same letter),
    // would be B triple flat. It comes out as A flat, the same pitch.
    const s = keyedScore([P('B', 4, -2)], 2);
    const out = engraveInKey(s, { semitones: -1, fifths: -5 }).vocalLine[0].pitch!;
    expect(out).toEqual(P('A', 4, -1));
    expect(pitchToMidi(out)).toBe(pitchToMidi(P('B', 4, -2)) - 1);
    // A triple sharp takes the letter above: C double sharp in C major, up a
    // chromatic semitone to C sharp major, would be C triple sharp; it is D sharp.
    const up = engraveInKey(keyedScore([P('C', 5, 2)], 0), { semitones: 1, fifths: 7 }).vocalLine[0].pitch!;
    expect(up).toEqual(P('D', 5, 1));
  });

  it("a composer's double accidental moved by a plain interval stays double", () => {
    // F double sharp in D major, up a major second to E major: G double sharp.
    const up = engraveInKey(keyedScore([P('F', 4, 2)], 2), { semitones: 2, fifths: 4 });
    expect(up.vocalLine[0].pitch).toEqual(P('G', 4, 2));
    // B double flat in D major, down a major second to C major: A double flat.
    const down = engraveInKey(keyedScore([P('B', 3, -2)], 2), { semitones: -2, fifths: 0 });
    expect(down.vocalLine[0].pitch).toEqual(P('A', 3, -2));
  });

  it('a double accidental that results from the move stays: D major to C flat major', () => {
    // A G double flat, carried one letter and three semitones down, would be
    // F triple flat; the neighbouring letter gives E double flat, which stays.
    const s = keyedScore([P('G', 4, -2)], 2);
    const out = engraveInKey(s, { semitones: -3, fifths: -7 }).vocalLine[0].pitch!;
    expect(out).toEqual(P('E', 4, -2));
    expect(pitchToMidi(out)).toBe(pitchToMidi(P('G', 4, -2)) - 3);
  });

  it('0 semitones at the printed signature returns the input itself', () => {
    const s = keyedScore(D_MAJOR_SCALE, 2);
    expect(engraveInKey(s, { semitones: 0, fifths: 2 })).toBe(s);
  });

  it('keeps every event field but the pitch, and every id', () => {
    const s = keyedScore(D_MAJOR_SCALE, 2);
    const b = engraveInKey(s, { semitones: 2, fifths: 4 });
    b.vocalLine.forEach((e, i) => {
      const { pitch: _a, ...rest } = e;
      const { pitch: _b, ...was } = s.vocalLine[i];
      expect(rest).toEqual(was);
    });
  });

  it('a later key change moves by the same fifths and folds past seven accidentals', () => {
    const s = keyedScore(D_MAJOR_SCALE, 2);
    const withChange: ParsedScore = {
      ...s,
      keySignatures: [...s.keySignatures, { measureIndex: 1, signature: { fifths: 5, mode: 'major' } }],
      measures: [s.measures[0], { ...s.measures[1], keySignature: { fifths: 5, mode: 'major' } }],
    };
    // Up a major third: D (2) to F sharp (6), so B (5) goes to D sharp (9), folded to E flat (-3).
    const up = engraveInKey(withChange, { semitones: 4, fifths: 6 });
    expect(up.keySignatures.map((k) => k.signature.fifths)).toEqual([6, -3]);
    expect(up.measures.map((m) => m.keySignature.fifths)).toEqual([6, -3]);
  });

  it('transposeScore is untouched by it: still naturals and sharps, signature unmoved', () => {
    const s = keyedScore(D_MAJOR_SCALE, 2);
    const t = transposeScore(s, -4);
    expect(t.keySignatures).toBe(s.keySignatures);
    expect(t.vocalLine[0].pitch).toEqual(P('A', 3, 1));
  });
});

describe('transpositionRulerStops', () => {
  it('D major: fifteen keys, the tritone at both ends, the enharmonic pairs side by side', () => {
    const stops = transpositionRulerStops({ fifths: 2, mode: 'major' });
    const names = stops.map((s) => `${s.semitones}:${s.fifths}`);
    expect(names).toEqual([
      '-6:-4', // A flat, down a tritone
      '-5:3', // A
      '-4:-2', // B flat
      '-3:5', '-3:-7', // B, C flat
      '-2:0', // C
      '-1:7', '-1:-5', // C sharp, D flat
      '0:2', // D, as printed
      '1:-3', // E flat
      '2:4', // E
      '3:-1', // F
      '4:6', '4:-6', // F sharp, G flat
      '5:1', // G
      '6:-4', // A flat, up a tritone
    ]);
    expect(stops.every((s) => s.mode === 'major')).toBe(true);
  });

  it('a minor song gets the minor keys: B minor puts G sharp and A flat minor together', () => {
    const stops = transpositionRulerStops({ fifths: 2, mode: 'minor' });
    expect(stops).toHaveLength(16);
    const printed = stops.find((s) => s.semitones === 0);
    expect(printed).toEqual({ semitones: 0, fifths: 2, mode: 'minor' });
    // G sharp minor (5 sharps) and A flat minor (7 flats) are both down a minor third from B minor.
    expect(stops.filter((s) => s.semitones === -3).map((s) => s.fifths)).toEqual([5, -7]);
  });

  it('C major: the tritone is a pair at each end', () => {
    const stops = transpositionRulerStops({ fifths: 0, mode: 'major' });
    expect(stops.slice(0, 2).map((s) => `${s.semitones}:${s.fifths}`)).toEqual(['-6:6', '-6:-6']);
    expect(stops.slice(-2).map((s) => `${s.semitones}:${s.fifths}`)).toEqual(['6:6', '6:-6']);
  });

  it('a source with no mode still has its stops, and carries no mode on them', () => {
    const stops = transpositionRulerStops({ fifths: 2 });
    expect(stops.map((s) => `${s.semitones}:${s.fifths}`)).toEqual(
      transpositionRulerStops({ fifths: 2, mode: 'major' }).map((s) => `${s.semitones}:${s.fifths}`),
    );
    expect(stops.some((s) => 'mode' in s)).toBe(false);
  });

  it('every stop engraves consistently: the signature moves by the same count the tonic does', () => {
    const s = keyedScore(D_MAJOR_SCALE, 2);
    for (const stop of transpositionRulerStops({ fifths: 2, mode: 'major' })) {
      const out = engraveInKey(s, stop);
      expect(out.keySignatures[0].signature.fifths).toBe(stop.fifths);
      expect(accidentalsDrawn(out)).toBe(0);
      expect(pitchToMidi(out.vocalLine[0].pitch!) - pitchToMidi(P('D', 4))).toBe(stop.semitones);
    }
  });
});

describe('doubleAccidentalsDrawn (N.94 slice 2, the twins)', () => {
  /** One bar per entry of `bars`, in order, in C major. */
  const inBars = (bars: Pitch[][]): ParsedScore => {
    const flat = bars.flat();
    const s = keyedScore(flat, 0, 'major', bars.length);
    let i = 0;
    const vocalLine = bars.flatMap((bar, m) => bar.map(() => ({ ...s.vocalLine[i], measureIndex: m, pitch: flat[i++] })));
    return { ...s, vocalLine };
  };

  it('counts a double accidental where it draws, not every note spelled with one', () => {
    // Two B double flats in one bar draw one sign; the next bar draws it again.
    expect(doubleAccidentalsDrawn(inBars([[P('B', 4, -2), P('B', 4, -2)]]))).toEqual({ flats: 1, sharps: 0 });
    expect(doubleAccidentalsDrawn(inBars([[P('B', 4, -2)], [P('B', 4, -2)]]))).toEqual({ flats: 2, sharps: 0 });
  });

  it('counts double sharps apart from double flats, and no single accidental', () => {
    const s = inBars([[P('F', 4, 2), P('G', 4, 1), P('A', 4, -1), P('E', 4, -2)]]);
    expect(doubleAccidentalsDrawn(s)).toEqual({ flats: 1, sharps: 1 });
  });

  it('Sunless 1, bar 2: of the twins B major and C flat major, only C flat draws a double flat', () => {
    // The flat sixth (B flat in D major), carried down a minor third, is G
    // natural in B major and A double flat in C flat major.
    const s = keyedScore([P('A', 3), P('B', 3, -1)], 2, 'major', 1);
    expect(doubleAccidentalsDrawn(engraveInKey(s, { semitones: -3, fifths: 5 }))).toEqual({ flats: 0, sharps: 0 });
    expect(doubleAccidentalsDrawn(engraveInKey(s, { semitones: -3, fifths: -7 }))).toEqual({ flats: 1, sharps: 0 });
  });
});
