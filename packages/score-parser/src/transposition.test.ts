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
  intervalName,
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
});
