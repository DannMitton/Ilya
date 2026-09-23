/**
 * Per-note condition tests (N.168 step 2, Part 1).
 *
 * Every expected value is hand-traced in the comment beside it, at A4 = 440
 * and quarter = 60, so one quarter note is one second. The vowels are stubs
 * keyed on the syllable text, as the overlay engine's own tests do: this
 * module never decides what a vowel is.
 */

import { describe, expect, it } from 'vitest';
import { noteConditions } from './conditions';
import { analyzeScore, type VowelResolver } from './overlay-engine';
import type { Articulation, Measure, NoteBase, ParsedScore, Pitch, TempoMarking, VocalLineEvent } from './types';
import type { VoiceProfileSnapshot } from './analysis-types';

const P = (step: Pitch['step'], octave: number): Pitch => ({ step, octave, alter: 0 });
const WHOLES: Partial<Record<NoteBase, number>> = { whole: 1, half: 2, quarter: 4 };

function ev(
  id: string,
  measureIndex: number,
  at: number,
  base: 'whole' | 'half' | 'quarter',
  pitch?: Pitch,
  extra: { vowel?: string; tie?: 'start' | 'stop'; marks?: Articulation[]; fermata?: boolean } = {},
): VocalLineEvent {
  return {
    id,
    type: pitch ? 'note' : 'rest',
    measureIndex,
    rhythmicPosition: { fraction: { numerator: at, denominator: 4 } },
    duration: { base, dots: 0, fraction: { numerator: 1, denominator: WHOLES[base]! } },
    ...(pitch ? { pitch } : {}),
    ...(extra.tie ? { tied: { type: extra.tie } } : {}),
    ...(extra.vowel
      ? { syllable: { id: `s-${id}`, text: extra.vowel, type: 'whole', verseNumber: 1, wordContext: extra.vowel } }
      : {}),
    ...(extra.marks ? { articulations: extra.marks } : {}),
    ...(extra.fermata ? { fermata: { shape: 'normal' } } : {}),
  } as VocalLineEvent;
}

function scoreOf(events: VocalLineEvent[], bars: number, tempo: TempoMarking[] = [q60]): ParsedScore {
  const measures: Measure[] = Array.from({ length: bars }, (_, i) => ({
    index: i,
    number: String(i + 1),
    timeSignature: { beats: 4, beatType: 4 },
    keySignature: { fifths: 0 },
    expectedDuration: { numerator: 1, denominator: 1 },
  }));
  return {
    source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
    vocalPart: { partId: 'P1', partName: 'Voice' },
    measures,
    keySignatures: [{ measureIndex: 0, signature: { fifths: 0 } }],
    timeSignatures: [{ measureIndex: 0, signature: { beats: 4, beatType: 4 } }],
    tempoMarkings: tempo,
    vocalLine: events,
  };
}

const q60: TempoMarking = {
  measureIndex: 0,
  rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
  bpm: 60,
  beatUnit: 'quarter',
  beatUnitDots: 0,
};

const profile: VoiceProfileSnapshot = {
  fR1: { a: 660, i: 300 },
  fR2: { a: 1100 }, // no fR2 for [i]: its rung is not assessed
};

// Only the vowels with an fR1 reach the overlay; the stub also answers [u].
const bySyllable: VowelResolver = (e) => e.syllable?.text;

function run(events: VocalLineEvent[], bars: number, tempo?: TempoMarking[]) {
  const parsed = scoreOf(events, bars, tempo);
  const analyzed = analyzeScore(parsed, profile, bySyllable, { generatedAt: '2026-09-23T00:00:00.000Z' });
  const result = noteConditions(parsed, profile, analyzed.events, { vowelForEvent: bySyllable });
  return { ...result, byId: Object.fromEntries(result.notes.map((n) => [n.eventId, n])) };
}

// Bar 1: A3 B3 rest F4 (quarters). Bar 2: F4 half tied to F4 half, breath mark.
// Bar 3: C4 whole on [i].
const line = [
  ev('n1', 0, 0, 'quarter', P('A', 3), { vowel: 'a' }),
  ev('n2', 0, 1, 'quarter', P('B', 3), { vowel: 'a' }),
  ev('r1', 0, 2, 'quarter'),
  ev('n3', 0, 3, 'quarter', P('F', 4), { vowel: 'a' }),
  ev('n4', 1, 0, 'half', P('F', 4), { vowel: 'a', tie: 'start' }),
  ev('n5', 1, 2, 'half', P('F', 4), { tie: 'stop', marks: ['breath-mark'] }),
  ev('n6', 2, 0, 'whole', P('C', 4), { vowel: 'i' }),
];

describe('noteConditions: the harmonic rungs', () => {
  const { byId } = run(line, 3);

  it('A3 on [a]: 3 × 220 = 660 Hz meets fR1 exactly (rung 3), and 5 × 220 = 1100 meets fR2 (rung 5)', () => {
    expect(byId.n1.fR1Rung).toBe(3);
    expect(byId.n1.fR2Rung).toBe(5);
  });

  it('B3 on [a]: 3 × 246.9 = 741 Hz is 200 cents from 660, and 4 × and 5 × miss fR2 by more than 50 cents: null, assessed', () => {
    expect(byId.n2.fR1Rung).toBeNull();
    expect(byId.n2.fR2Rung).toBeNull();
  });

  it('C4 on [i]: fR1 assessed (null), fR2 not assessed because the profile carries none for [i]', () => {
    expect(byId.n6.fR1Rung).toBeNull();
    expect(byId.n6).not.toHaveProperty('fR2Rung');
  });
});

describe('noteConditions: the fR1 band, carried from the overlay', () => {
  it('open below the turning pitch, close above it', () => {
    const { byId } = run(line, 3);
    expect(byId.n1.fR1Band).toBe('open'); // 220 < 660 / 2
    expect(byId.n3.fR1Band).toBe('close'); // 349.2 > 330, far below 660
    expect(byId.n6.fR1Band).toBe('close'); // 261.6 > 150, 237 cents below 300
  });

  it('crossing owns the 50 cents around fR1, and above is fo past fR1', () => {
    const { byId } = run(
      [
        ev('c', 0, 0, 'quarter', P('D', 4), { vowel: 'i' }), // 293.7 Hz, 37 cents below 300
        ev('x', 0, 1, 'quarter', P('A', 4), { vowel: 'i' }), // 440 Hz, above 300
        ev('u', 0, 2, 'half', P('A', 4), { vowel: 'u' }), // no fR1 for [u]
      ],
      1,
    );
    expect(byId.c.fR1Band).toBe('crossing');
    expect(byId.x.fR1Band).toBe('above');
    // The overlay omits a vowel with no fR1: the vowel is still reported, nothing acoustic is.
    expect(byId.u.vowel).toBe('u');
    expect(byId.u).not.toHaveProperty('fR1Band');
    expect(byId.u).not.toHaveProperty('fR1Rung');
  });
});

describe('noteConditions: approach', () => {
  const { byId } = run(line, 3);

  it('the first sung note has no approach', () => {
    expect(byId.n1).not.toHaveProperty('approach');
  });

  it('A3 to B3 is a step up of 2', () => {
    expect(byId.n2.approach).toEqual({ semitones: 2, band: 'step', afterRest: false });
  });

  it('a rest does not reset the previous note: B3 to F4 over a rest is a leap up of 6, after a rest', () => {
    expect(byId.n3.approach).toEqual({ semitones: 6, band: 'leap-up', afterRest: true });
  });

  it('F4 to a newly attacked F4 is repeated; the tied continuation is a tie, not a repeat', () => {
    expect(byId.n4.approach?.band).toBe('repeated');
    expect(byId.n5.approach?.band).toBe('tie');
  });

  it('F4 to C4 is a leap down of 5', () => {
    expect(byId.n6.approach).toEqual({ semitones: -5, band: 'leap-down', afterRest: false });
  });
});

describe('noteConditions: held or short', () => {
  it('reads the tie chain: two tied halves at quarter = 60 are 4 s, held; a lone quarter is 1 s, short', () => {
    const { byId } = run(line, 3);
    expect(byId.n3.held).toBe(false);
    expect(byId.n4.held).toBe(true); // a half alone is 2 s, short; the chain is 4 s
    expect(byId.n5.held).toBe(true);
    expect(byId.n6.held).toBe(true);
    expect(byId.n6.heldBasis).toBe('is-long-sustain');
  });

  it('with no tempo, only a fermata makes a note held, and no seconds are claimed', () => {
    const { byId, tempo } = run(
      [ev('a', 0, 0, 'half', P('A', 3), { vowel: 'a' }), ev('b', 0, 2, 'half', P('A', 3), { vowel: 'a', fermata: true })],
      1,
      [],
    );
    expect(tempo).toBe('none');
    expect(byId.a.held).toBe(false);
    expect(byId.b.held).toBe(true);
    expect(byId.b.heldBasis).toBe('fermata-only');
    expect(byId.a).not.toHaveProperty('seconds');
    expect(byId.b).not.toHaveProperty('onsetPhonationSeconds');
    expect(byId.b.onsetPhonationQuavers).toBe(4);
  });
});

describe('noteConditions: phrases and position in the piece', () => {
  const { byId, boundaryCounts, tempo } = run(line, 3);

  it('a rest, a breath mark, and the end of the line each close a phrase', () => {
    expect(boundaryCounts).toEqual({ rest: 1, silence: 0, 'breath-mark': 1, caesura: 0, end: 1 });
    expect([byId.n1, byId.n2].map((n) => n.phrase.index)).toEqual([0, 0]);
    expect([byId.n3, byId.n4, byId.n5].map((n) => n.phrase.index)).toEqual([1, 1, 1]);
    expect(byId.n6.phrase.index).toBe(2);
  });

  it('places each note in its phrase', () => {
    expect([byId.n1, byId.n2].map((n) => n.phrase.position)).toEqual(['first', 'last']);
    expect([byId.n3, byId.n4, byId.n5].map((n) => n.phrase.position)).toEqual(['first', 'middle', 'last']);
    expect(byId.n6.phrase.position).toBe('only');
  });

  it('measures each phrase in sung seconds, rests excluded', () => {
    expect(tempo).toBe('stated');
    expect(byId.n1.phrase.seconds).toBeCloseTo(2, 9); // two quarters
    expect(byId.n4.phrase.seconds).toBeCloseTo(5, 9); // quarter + half + half
    expect(byId.n6.phrase.seconds).toBeCloseTo(4, 9); // whole
    expect(byId.n4.phrase.quavers).toBe(10);
  });

  it('cumulative phonation at each onset excludes the rest', () => {
    const at = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'].map((id) => byId[id].onsetPhonationSeconds);
    [0, 1, 2, 3, 5, 7].forEach((s, i) => expect(at[i]).toBeCloseTo(s, 9));
  });
});

describe('noteConditions: a silence the file wrote no rest for', () => {
  it('an empty bar ends the phrase and counts as after a rest', () => {
    // Bar 1: A3 whole. Bar 2: no vocal event at all. Bar 3: B3 whole.
    const { byId, boundaryCounts } = run(
      [ev('a', 0, 0, 'whole', P('A', 3), { vowel: 'a' }), ev('b', 2, 0, 'whole', P('B', 3), { vowel: 'a' })],
      3,
    );
    expect(boundaryCounts).toEqual({ rest: 0, silence: 1, 'breath-mark': 0, caesura: 0, end: 1 });
    expect(byId.a.phrase.index).toBe(0);
    expect(byId.b.phrase.index).toBe(1);
    expect(byId.b.approach).toEqual({ semitones: 2, band: 'step', afterRest: true });
  });

  it('a gap inside a bar is a silence too; contiguous notes across a barline are not', () => {
    // Bar 1: A3 quarter on beat 1, then nothing until B3 on beat 3 (a half). Bar 2: C4 whole.
    const { byId, boundaryCounts } = run(
      [
        ev('a', 0, 0, 'quarter', P('A', 3), { vowel: 'a' }),
        ev('b', 0, 2, 'half', P('B', 3), { vowel: 'a' }),
        ev('c', 1, 0, 'whole', P('C', 4), { vowel: 'a' }),
      ],
      2,
    );
    expect(boundaryCounts.silence).toBe(1);
    expect(byId.b.approach?.afterRest).toBe(true);
    expect(byId.c.approach?.afterRest).toBe(false);
    expect(byId.c.phrase.index).toBe(byId.b.phrase.index);
  });
});
