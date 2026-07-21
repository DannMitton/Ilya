/**
 * General modification-engine tests (§A.162).
 *
 * The matrix here is Mitton's own measured low-male-voice profile (the
 * `fRn_values` block of `shane_mitton_reference_dataset.json`), keyed by bare
 * IPA the way `VoiceProfileSnapshot.fR1`/`fR2` are. The two "reproduces"
 * assertions are the beat's contract: ONE rule ("raise fR1, hold fR2 in-band")
 * computes BOTH sourced modifications, `[i]→[ɪ]` and `[o]→[ɑ]`.
 *
 * Sandbox note: runs via the node vitest shim; authoritative run is
 * `pnpm --filter @ilya/score-parser test`.
 */

import { describe, expect, it } from 'vitest';
import { modificationTarget } from './modification-engine';
import { analyzeScore, type VowelResolver } from './overlay-engine';
import type { Fraction, Measure, ParsedScore, Pitch, VocalLineEvent } from './types';
import type { VoiceProfileSnapshot } from './analysis-types';

// Mitton 2020 measured matrix (fR1/fR2 in Hz), bare-IPA keyed.
const MITTON: VoiceProfileSnapshot = {
  fR1: { i: 296, e: 381, ɪ: 393, ɨ: 404, u: 346, o: 489, ɛ: 577, ʌ: 616, ɑ: 617, a: 711 },
  fR2: { i: 1705, e: 1532, ɪ: 1600, ɨ: 1100, u: 804, o: 826, ɛ: 1311, ʌ: 1167, ɑ: 1013, a: 1113 },
};

describe('modificationTarget — one rule reproduces both sourced modifications', () => {
  it('computes [i] → [ɪ] (front: fR1 up, fR2 held)', () => {
    const t = modificationTarget('i', MITTON);
    expect(t?.vowel).toBe('ɪ');
    expect(t?.fR1).toBe(393);
    expect(t?.fR2).toBe(1600);
  });

  it('computes [o] → [ɑ] (back: fR1 up, fR2 held)', () => {
    const t = modificationTarget('o', MITTON);
    expect(t?.vowel).toBe('ɑ');
    expect(t?.fR1).toBe(617);
    expect(t?.fR2).toBe(1013);
  });

  it('holds fR2, not fR1: [i] picks [ɪ] over [e] though [e] is nearer in fR1', () => {
    // [e] (381) is closer to [i] (296) in fR1 than [ɪ] (393) is, but [ɪ] holds
    // fR2 nearer (1600 vs 1532 against the source 1705). The rule is fR2-band,
    // not nearest-fR1, so [ɪ] must win.
    expect(modificationTarget('i', MITTON)?.vowel).toBe('ɪ');
  });
});

describe('modificationTarget — absence stays absence', () => {
  it('returns undefined when the snapshot carries no fR2 at all', () => {
    const noFr2: VoiceProfileSnapshot = { fR1: MITTON.fR1 };
    expect(modificationTarget('i', noFr2)).toBeUndefined();
  });

  it('returns undefined when the source vowel was not measured', () => {
    expect(modificationTarget('y', MITTON)).toBeUndefined();
  });

  it('returns undefined when no more-open neighbour exists (source is the most open)', () => {
    // [a] has the highest fR1 (711); nothing is more open, so there is no target.
    expect(modificationTarget('a', MITTON)).toBeUndefined();
  });

  it('skips candidates missing fR2 (sparse profile), taking the next measured neighbour', () => {
    // [ɪ] has no fR2 here, so the [i] search falls through it to [ɑ], the only
    // more-open vowel with both resonances measured.
    const sparse: VoiceProfileSnapshot = {
      fR1: { i: 296, ɪ: 393, ɑ: 617 },
      fR2: { i: 1705, ɑ: 1013 },
    };
    expect(modificationTarget('i', sparse)?.vowel).toBe('ɑ');
  });
});

// ── fR2 must survive the analysis snapshot (deepCopyProfile carries it) ──

const QUARTER: Fraction = { numerator: 1, denominator: 4 };

function note(id: string, pitch: Pitch, vowel: string): VocalLineEvent {
  return {
    id,
    type: 'note',
    measureIndex: 0,
    rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
    duration: { base: 'quarter', dots: 0, fraction: QUARTER },
    pitch,
    syllable: { id: `s-${id}`, text: vowel, type: 'whole', verseNumber: 1, wordContext: vowel },
  };
}

function scoreOf(events: VocalLineEvent[]): ParsedScore {
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

describe('modificationTarget — reads the analysis snapshot (fR2 round-trip)', () => {
  const bySyllable: VowelResolver = (e) => e.syllable?.text;
  const profile: VoiceProfileSnapshot = {
    ...MITTON,
    range: { lowest: { step: 'C', octave: 2, alter: 0 }, highest: { step: 'C', octave: 5, alter: 0 } },
  };
  const analyzed = analyzeScore(
    scoreOf([note('n1', { step: 'D', octave: 4, alter: 0 }, 'i')]),
    profile,
    bySyllable,
    { generatedAt: '2026-07-21T00:00:00.000Z' },
  );

  it('carries fR2 into the deep-copied calibration snapshot', () => {
    expect(analyzed.calibrationSnapshot.fR2).toEqual(MITTON.fR2);
    expect(analyzed.calibrationSnapshot.fR2).not.toBe(MITTON.fR2); // a copy, not a reference
  });

  it('computes [i] → [ɪ] straight off the analysis snapshot', () => {
    expect(modificationTarget('i', analyzed.calibrationSnapshot)?.vowel).toBe('ɪ');
  });
});
