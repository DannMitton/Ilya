/**
 * Vocal reading-octave resolution tests (the denigma treble-8vb flattening
 * repair). The heuristic reads a treble line an octave down only when the
 * singer's OWN declared range says the lower octave fits better; a true
 * treble line is never displaced.
 */

import { describe, expect, it } from 'vitest';
import { pitchToMidi } from './overlay-engine';
import { resolveVocalReadingOctave, shiftVocalOctave } from './vocal-octave';
import type { Clef, ParsedScore, Pitch, VocalLineEvent } from './types';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

function note(id: string, pitch: Pitch): VocalLineEvent {
  return {
    id,
    type: 'note',
    measureIndex: 0,
    rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
    duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
    pitch,
  };
}

function scoreOf(events: VocalLineEvent[], clef?: Clef): ParsedScore {
  return {
    source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
    vocalPart: { partId: 'P1', partName: 'Voice' },
    measures: [],
    keySignatures: [],
    timeSignatures: [],
    tempoMarkings: [],
    vocalLine: events,
    ...(clef ? { clefs: [{ measureIndex: 0, clef }] } : {}),
  };
}

const BASS_RANGE = { lowest: P('B', 1, -1), highest: P('F', 4, 1) }; // Bb1 – F#4

describe('resolveVocalReadingOctave', () => {
  it('reads a treble-notated bass line an octave down (the denigma case)', () => {
    // G4/A4/B4 all sit above F#4 as written, but G3/A3/B3 fit the bass range.
    const parsed = scoreOf([note('n1', P('G', 4)), note('n2', P('A', 4)), note('n3', P('B', 4))], {
      sign: 'G',
      line: 2,
    });
    expect(resolveVocalReadingOctave(parsed, BASS_RANGE)).toBe(-1);
  });

  it('leaves a genuine treble line as written', () => {
    // A soprano's C5/E5/G5 fit her range; an octave down would fall below it.
    const parsed = scoreOf([note('n1', P('C', 5)), note('n2', P('E', 5)), note('n3', P('G', 5))], {
      sign: 'G',
      line: 2,
    });
    expect(resolveVocalReadingOctave(parsed, { lowest: P('C', 5), highest: P('C', 6) })).toBe(0);
  });

  it('never shifts a bass-clef part', () => {
    const parsed = scoreOf([note('n1', P('A', 3)), note('n2', P('F', 3))], { sign: 'F', line: 4 });
    expect(resolveVocalReadingOctave(parsed, BASS_RANGE)).toBe(0);
  });

  it('honours an explicit treble-8vb clef directly, even with no range', () => {
    const parsed = scoreOf([note('n1', P('G', 4))], { sign: 'G', line: 2, octaveChange: -1 });
    expect(resolveVocalReadingOctave(parsed)).toBe(-1);
    expect(resolveVocalReadingOctave(parsed, BASS_RANGE)).toBe(-1);
  });

  it('does not guess on a plain treble clef with no declared range', () => {
    const parsed = scoreOf([note('n1', P('G', 4))], { sign: 'G', line: 2 });
    expect(resolveVocalReadingOctave(parsed)).toBe(0);
  });

  it('does not shift when there is no source clef', () => {
    const parsed = scoreOf([note('n1', P('G', 4))]);
    expect(resolveVocalReadingOctave(parsed, BASS_RANGE)).toBe(0);
  });
});

describe('shiftVocalOctave', () => {
  it('shifts every vocal pitch down and clears the source clef', () => {
    const parsed = scoreOf([note('n1', P('G', 4)), note('n2', P('A', 4))], { sign: 'G', line: 2 });
    const shifted = shiftVocalOctave(parsed, -1);
    expect(shifted.vocalLine.map((e) => pitchToMidi(e.pitch as Pitch))).toEqual([
      pitchToMidi(P('G', 3)),
      pitchToMidi(P('A', 3)),
    ]);
    expect(shifted.clefs).toEqual([]);
    // Ground truth is untouched.
    expect(parsed.vocalLine[0].pitch).toEqual(P('G', 4));
  });

  it('returns the input unchanged for a zero shift', () => {
    const parsed = scoreOf([note('n1', P('G', 4))], { sign: 'G', line: 2 });
    expect(shiftVocalOctave(parsed, 0)).toBe(parsed);
  });
});
