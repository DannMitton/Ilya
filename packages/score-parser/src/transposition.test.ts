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
  keyNameAfterTransposition,
  type TranspositionCandidate,
} from './transposition';
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
  });

  it('omits the target key when the score declares no mode', () => {
    // buildScore's default key signature carries fifths but no mode.
    const score = buildScore([note('n1', P('C', 4), 'a'), note('n2', P('E', 5), 'a')]);
    const out = suggestTranspositions(score, profile, bySyllable);
    expect(out.suggestions.length).toBeGreaterThan(0);
    for (const c of out.suggestions) expect(c.targetKey).toBeUndefined();
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
