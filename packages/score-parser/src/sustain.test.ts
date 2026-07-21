/**
 * Sustain-test tests. `isLongSustain` was lifted here from apps/web's watch
 * list (§A.117) so the overlay engine and the watch list share one source of
 * truth. These cover the fermata path, the tempo/duration path, the ≥ 2.5 s
 * boundary, and the honest-silence cases (no tempo, tempo only after the note).
 */

import { describe, expect, it } from 'vitest';
import { isLongSustain, SUSTAIN_SECONDS_THRESHOLD } from './sustain';
import type { NoteBase, TempoMarking, VocalLineEvent } from './types';

function note(opts: {
  measureIndex?: number;
  base?: NoteBase;
  dots?: number;
  fermata?: boolean;
}): VocalLineEvent {
  const base = opts.base ?? 'quarter';
  const dots = opts.dots ?? 0;
  // Whole-note fraction for the base (dots ignored for the fixture's simple cases).
  const denom: Record<NoteBase, number> = {
    breve: 1, whole: 1, half: 2, quarter: 4, eighth: 8,
    '16th': 16, '32nd': 32, '64th': 64, '128th': 128,
  };
  const num = base === 'breve' ? 2 : 1;
  return {
    id: 'n',
    type: 'note',
    measureIndex: opts.measureIndex ?? 0,
    rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
    duration: { base, dots, fraction: { numerator: num, denominator: denom[base] } },
    pitch: { step: 'A', octave: 4, alter: 0 },
    ...(opts.fermata ? { fermata: { shape: 'normal' } } : {}),
  };
}

function tempo(bpm: number, beatUnit: NoteBase = 'quarter', measureIndex = 0): TempoMarking {
  return { measureIndex, rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } }, bpm, beatUnit, beatUnitDots: 0 };
}

describe('isLongSustain', () => {
  it('a fermata is a long sustain regardless of tempo (even with no tempo)', () => {
    expect(isLongSustain(note({ fermata: true }), [])).toBe(true);
  });

  it('no fermata and no active tempo is not a sustain (honest silence, not a guess)', () => {
    expect(isLongSustain(note({}), [])).toBe(false);
  });

  it('a whole note at quarter = 60 is 4 s → a long sustain', () => {
    // whole = 4 quarter-beats; 4 beats × (60/60 s) = 4 s ≥ 2.5.
    expect(isLongSustain(note({ base: 'whole' }), [tempo(60)])).toBe(true);
  });

  it('a quarter note at quarter = 120 is 0.5 s → not a long sustain', () => {
    expect(isLongSustain(note({ base: 'quarter' }), [tempo(120)])).toBe(false);
  });

  it('exactly the 2.5 s threshold counts (>=): a half note at quarter = 48 is 2.5 s', () => {
    // half = 2 quarter-beats; 2 × (60/48) = 2.5 s.
    expect(isLongSustain(note({ base: 'half' }), [tempo(48)])).toBe(true);
    expect(SUSTAIN_SECONDS_THRESHOLD).toBe(2.5);
  });

  it('a tempo that begins AFTER the note is not active → not a sustain', () => {
    const later = tempo(60, 'quarter', 1); // measure 1, after the note in measure 0
    expect(isLongSustain(note({ measureIndex: 0, base: 'whole' }), [later])).toBe(false);
  });
});
