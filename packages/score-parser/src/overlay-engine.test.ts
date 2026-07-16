/**
 * Overlay engine tests.
 *
 * A hand-built `ParsedScore` with pitches chosen so every acoustic branch
 * is hit with numbers verified by hand (turning pitch = fR1/2; open below /
 * close above; crossing within a semitone of fR1; positional range and
 * passaggio). This is the "one note end-to-end" milestone the plan called
 * for, generalised across a handful of notes.
 *
 * Sandbox note: runs via the node vitest shim; authoritative run is
 * `pnpm --filter @ilya/score-parser test`.
 */

import { describe, expect, it } from 'vitest';
import {
  analyzeScore,
  scoreContentId,
  pitchToHz,
  hzToPitch,
  type VowelResolver,
} from './overlay-engine';
import type {
  Fraction,
  Measure,
  ParsedScore,
  Pitch,
  VocalLineEvent,
} from './types';
import type { VoiceProfileSnapshot } from './analysis-types';

// ── Fixture builders ───────────────────────────────────────────────

const QUARTER: Fraction = { numerator: 1, denominator: 4 };

function note(id: string, pitch: Pitch | null, vowel?: string): VocalLineEvent {
  return {
    id,
    type: pitch ? 'note' : 'rest',
    measureIndex: 0,
    rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
    duration: { base: 'quarter', dots: 0, fraction: QUARTER },
    ...(pitch ? { pitch } : {}),
    ...(vowel ? { syllable: { id: `s-${id}`, text: vowel, type: 'whole', verseNumber: 1, wordContext: vowel } } : {}),
  };
}

function buildScore(events: VocalLineEvent[]): ParsedScore {
  const measure: Measure = {
    index: 0,
    number: '1',
    timeSignature: { beats: 4, beatType: 4 },
    keySignature: { fifths: -1 },
    expectedDuration: { numerator: 1, denominator: 1 },
  };
  return {
    source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
    vocalPart: { partId: 'P1', partName: 'Voice' },
    measures: [measure],
    keySignatures: [{ measureIndex: 0, signature: { fifths: -1 } }],
    timeSignatures: [{ measureIndex: 0, signature: { beats: 4, beatType: 4 } }],
    tempoMarkings: [],
    vocalLine: events,
  };
}

// A low-male-voice-ish profile with round fR1 numbers for hand-checkable math.
const profile: VoiceProfileSnapshot = {
  fR1: { a: 600, i: 300, u: 320 },
  range: { lowest: { step: 'C', octave: 2, alter: 0 }, highest: { step: 'C', octave: 5, alter: 0 } },
  tessitura: { low: { step: 'G', octave: 2, alter: 0 }, high: { step: 'C', octave: 4, alter: 0 } },
  passaggio: { primo: { step: 'D', octave: 3, alter: 0 }, secondo: { step: 'G', octave: 3, alter: 0 } },
  label: 'bass',
};

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const bySyllable: VowelResolver = (e) => e.syllable?.text;

// E3=165 Hz, A4=440, D5≈587; profile turning for 'a' = 300 Hz (≈ D4), for 'i' = 150 Hz (≈ D3).
const fixture = buildScore([
  note('n1', P('E', 3), 'a'), // open, in passaggio, in tessitura
  note('n2', P('A', 4), 'i'), // close, above passaggio, in-range (above tessitura)
  note('n3', P('D', 5), 'a'), // close, crossing (≈fR1 600), out-of-range
  note('n4', null), // rest → omitted
  note('n5', P('D', 4), 'e'), // 'e' not in profile fR1 → omitted
]);

describe('overlay engine: pitch/frequency helpers', () => {
  it('converts pitch to Hz (A4 = 440, E3 ≈ 165)', () => {
    expect(pitchToHz(P('A', 4))).toBeCloseTo(440, 3);
    expect(pitchToHz(P('E', 3))).toBeCloseTo(164.81, 1);
  });
  it('finds the nearest pitch to a frequency (300 Hz ≈ D4)', () => {
    expect(hzToPitch(300)).toEqual({ step: 'D', octave: 4, alter: 0 });
    expect(hzToPitch(150)).toEqual({ step: 'D', octave: 3, alter: 0 });
  });
});

describe('overlay engine: analyzeScore', () => {
  const analyzed = analyzeScore(fixture, profile, bySyllable, { generatedAt: '2026-07-12T00:00:00.000Z' });

  it('omits rests and notes whose vowel has no fR1 in the profile', () => {
    expect(Object.keys(analyzed.events).sort()).toEqual(['n1', 'n2', 'n3']);
  });

  it('places the turning pitch an octave below fR1 for the note\'s vowel', () => {
    // 'a' fR1 600 → turning 300 Hz ≈ D4; 'i' fR1 300 → turning 150 Hz ≈ D3.
    expect(analyzed.events.n1.turningPitch).toEqual({ step: 'D', octave: 4, alter: 0 });
    expect(analyzed.events.n2.turningPitch).toEqual({ step: 'D', octave: 3, alter: 0 });
  });

  it('forecasts open below the turning pitch and close above', () => {
    expect(analyzed.events.n1.timbre).toBe('open'); // E3 165 < 300
    expect(analyzed.events.n2.timbre).toBe('close'); // A4 440 > 150
    expect(analyzed.events.n3.timbre).toBe('close'); // D5 587 > 300
  });

  it('flags a crossing only when fo sits within a semitone of fR1', () => {
    expect(analyzed.events.n1.crossing).toBe(false); // 165 vs 600
    expect(analyzed.events.n2.crossing).toBe(false); // 440 vs 300
    expect(analyzed.events.n3.crossing).toBe(true); // 587 vs 600 (≈ −38 cents)
  });

  it('marks passaggio position (D3–G3 band)', () => {
    expect(analyzed.events.n1.inPassaggio).toBe(true); // E3 165 in [147,196]
    expect(analyzed.events.n2.inPassaggio).toBe(false); // A4 440
    expect(analyzed.events.n3.inPassaggio).toBe(false); // D5 587
  });

  it('forecasts range status against tessitura and absolute range', () => {
    expect(analyzed.events.n1.rangeStatus).toBe('in-tessitura'); // E3 within G2–C4
    expect(analyzed.events.n2.rangeStatus).toBe('in-range'); // A4 above tessitura, within range
    expect(analyzed.events.n3.rangeStatus).toBe('out-of-range'); // D5 above C5
  });

  it('carries the resolved vowel and defaults phonationBreak to false', () => {
    expect(analyzed.events.n1.vowel).toBe('a');
    expect(analyzed.events.n1.phonationBreak).toBe(false);
    expect(analyzed.events.n1.vowelModification).toBeUndefined();
  });

  it('summarises the song globally (range, passaggio carried, key/time)', () => {
    expect(analyzed.global.range).toEqual({
      lowest: { step: 'E', octave: 3, alter: 0 },
      highest: { step: 'D', octave: 5, alter: 0 },
    });
    expect(analyzed.global.passaggio).toEqual(profile.passaggio);
    expect(analyzed.global.keyFifths).toBe(-1);
    expect(analyzed.global.timeSignature).toBe('4/4');
  });

  it('pins generatedAt and produces a stable content id', () => {
    expect(analyzed.generatedAt).toBe('2026-07-12T00:00:00.000Z');
    expect(analyzed.sourceScoreId).toMatch(/^[0-9a-f]{8}$/);
    expect(analyzeScore(fixture, profile, bySyllable).sourceScoreId).toBe(analyzed.sourceScoreId);
  });

  it('changes the content id when the ground truth changes', () => {
    const other = buildScore([note('n1', P('F', 3), 'a')]);
    expect(scoreContentId(other)).not.toBe(scoreContentId(fixture));
  });

  it('deep-copies the calibration snapshot (later profile edits do not leak in)', () => {
    const mutable: VoiceProfileSnapshot = JSON.parse(JSON.stringify(profile));
    const a = analyzeScore(fixture, mutable, bySyllable);
    mutable.fR1.a = 999;
    if (mutable.passaggio) mutable.passaggio.primo.octave = 9; // profile is complete: always defined here
    expect(a.calibrationSnapshot.fR1.a).toBe(600);
    expect(a.calibrationSnapshot.passaggio?.primo.octave).toBe(3);
  });
});

describe('overlay engine: melisma carries the sustained vowel', () => {
  it('analyses a syllable-less note when the resolver supplies the operative vowel', () => {
    const score = buildScore([
      note('m1', P('E', 3), 'a'),
      note('m2', P('F', 3)), // melisma: no syllable of its own
    ]);
    // The app-side resolver carries the sustained vowel across the melisma.
    const carry: VowelResolver = (e) => (e.id === 'm2' ? 'a' : e.syllable?.text);
    const a = analyzeScore(score, profile, carry);
    expect(Object.keys(a.events).sort()).toEqual(['m1', 'm2']);
    expect(a.events.m2.vowel).toBe('a');
    expect(a.events.m2.turningPitch).toEqual({ step: 'D', octave: 4, alter: 0 });
  });
});

// Dann ruled 2026-07-15 (Option A): a dimension the singer never provided is
// genuinely absent, not defaulted to a negative finding. `undefined` means
// "not assessed"; it must never read as `false` or a settled range status.
describe('overlay engine: absent dimensions are not assessed, not negative findings', () => {
  it('omits rangeStatus and inPassaggio entirely when the whole profile has no range, tessitura, or passaggio', () => {
    const bare: VoiceProfileSnapshot = { fR1: { a: 600 } };
    const a = analyzeScore(fixture, bare, bySyllable);
    for (const id of ['n1', 'n2', 'n3']) {
      expect(a.events[id].rangeStatus).toBeUndefined();
      expect(a.events[id].inPassaggio).toBeUndefined();
      expect('rangeStatus' in a.events[id]).toBe(false);
      expect('inPassaggio' in a.events[id]).toBe(false);
    }
  });

  it('assesses range without tessitura: in-tessitura never fires, but out-of-range and in-range still do', () => {
    const rangeOnly: VoiceProfileSnapshot = { fR1: { a: 600 }, range: profile.range };
    const a = analyzeScore(fixture, rangeOnly, bySyllable);
    expect(a.events.n1.rangeStatus).toBe('in-range'); // E3: would be in-tessitura with tessitura present
    expect(a.events.n2.rangeStatus).toBe('in-range');
    expect(a.events.n3.rangeStatus).toBe('out-of-range'); // D5 still above C5
    expect(a.events.n1.inPassaggio).toBeUndefined(); // no passaggio supplied
  });

  it('assesses passaggio independently of range and tessitura', () => {
    const passaggioOnly: VoiceProfileSnapshot = { fR1: { a: 600 }, passaggio: profile.passaggio };
    const a = analyzeScore(fixture, passaggioOnly, bySyllable);
    expect(a.events.n1.inPassaggio).toBe(true); // E3 165 in [147,196]
    expect(a.events.n2.inPassaggio).toBe(false);
    expect(a.events.n1.rangeStatus).toBeUndefined(); // no range supplied
  });

  it('omits global.passaggio and calibrationSnapshot.passaggio when the profile has none', () => {
    const noPassaggio: VoiceProfileSnapshot = { fR1: { a: 600 }, range: profile.range, tessitura: profile.tessitura };
    const a = analyzeScore(fixture, noPassaggio, bySyllable);
    expect(a.global.passaggio).toBeUndefined();
    expect(a.calibrationSnapshot.passaggio).toBeUndefined();
    expect('passaggio' in a.global).toBe(false);
    expect('passaggio' in a.calibrationSnapshot).toBe(false);
  });

  it('a complete profile is unaffected: the full three-way rangeStatus branch still runs', () => {
    const a = analyzeScore(fixture, profile, bySyllable);
    expect(a.events.n1.rangeStatus).toBe('in-tessitura');
    expect(a.events.n2.rangeStatus).toBe('in-range');
    expect(a.events.n3.rangeStatus).toBe('out-of-range');
  });
});
