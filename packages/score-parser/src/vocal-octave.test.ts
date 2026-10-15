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

  it('leaves a bass-clef part that fits as written', () => {
    const parsed = scoreOf([note('n1', P('A', 3)), note('n2', P('F', 3))], { sign: 'F', line: 4 });
    expect(resolveVocalReadingOctave(parsed, BASS_RANGE)).toBe(0);
  });

  // ROW 47, 2026-10-15: the upward reading, from any clef. The ranges and the
  // lines are built here, in MIDI numbers worked out by hand, and do not
  // depend on any fixture's pitches. MEZZO: A3 (57) to A5 (81).
  const MEZZO_RANGE = { lowest: P('A', 3), highest: P('A', 5) };

  it('reads a bass-clef line that is low for a mezzo an octave UP', () => {
    // C3 E3 G3 = 48 52 55, all below 57 as written; +1 gives 60 64 67, all inside.
    const parsed = scoreOf([note('n1', P('C', 3)), note('n2', P('E', 3)), note('n3', P('G', 3))], {
      sign: 'F',
      line: 4,
    });
    expect(resolveVocalReadingOctave(parsed, MEZZO_RANGE)).toBe(1);
  });

  it('reads a treble line that is low for a soprano an octave up too', () => {
    // C4 E4 G4 = 60 64 67 against C5 (72) to C6 (84): 0 of 3 as written, 3 of 3 up.
    const parsed = scoreOf([note('n1', P('C', 4)), note('n2', P('E', 4)), note('n3', P('G', 4))], {
      sign: 'G',
      line: 2,
    });
    expect(resolveVocalReadingOctave(parsed, { lowest: P('C', 5), highest: P('C', 6) })).toBe(1);
  });

  it('prefers +1 over -1 when +1 fits more of the line', () => {
    // C3 E3 C6 = 48 52 84. Written 0 of 3; down: C5 only, 1 of 3; up: C4 E4, 2 of 3.
    const parsed = scoreOf([note('n1', P('C', 3)), note('n2', P('E', 3)), note('n3', P('C', 6))], {
      sign: 'G',
      line: 2,
    });
    expect(resolveVocalReadingOctave(parsed, MEZZO_RANGE)).toBe(1);
  });

  it('leaves a line that fits as written, from any clef, even when a shift fits equally', () => {
    // B3 C4 = 59 60: inside as written (2 of 2). Up gives 71 72, also inside,
    // so +1 ties with as written and does not beat it.
    const bass = scoreOf([note('n1', P('B', 3)), note('n2', P('C', 4))], { sign: 'F', line: 4 });
    expect(resolveVocalReadingOctave(bass, MEZZO_RANGE)).toBe(0);
    const c = scoreOf([note('n1', P('B', 3)), note('n2', P('C', 4))], { sign: 'C', line: 3 });
    expect(resolveVocalReadingOctave(c, MEZZO_RANGE)).toBe(0);
  });

  it('leaves a line that fits neither shift better', () => {
    // A4 (69) is inside at every shift of a 24-semitone range that holds it
    // twice over; G7 (103) is outside at -1, 0, and +1. 1 of 2 each way.
    const parsed = scoreOf([note('n1', P('A', 4)), note('n2', P('G', 7))], { sign: 'G', line: 2 });
    expect(resolveVocalReadingOctave(parsed, MEZZO_RANGE)).toBe(0);
  });

  it('keeps the line as written when -1 and +1 both beat it and tie each other', () => {
    // C6 C3 = 84 48. Written 0 of 2; down: C5 (72) in, C2 out, 1 of 2; up: C7 out,
    // C4 (60) in, 1 of 2. A tie between the two, so no shift (DESK DEFAULT).
    const parsed = scoreOf([note('n1', P('C', 6)), note('n2', P('C', 3))], { sign: 'G', line: 2 });
    expect(resolveVocalReadingOctave(parsed, MEZZO_RANGE)).toBe(0);
  });

  it('does not shift a bass-clef line with no typed range, or a line with no pitched note', () => {
    const bass = scoreOf([note('n1', P('C', 3))], { sign: 'F', line: 4 });
    expect(resolveVocalReadingOctave(bass)).toBe(0);
    const rests = scoreOf([{ ...note('n1', P('C', 3)), type: 'rest' as const }], { sign: 'F', line: 4 });
    expect(resolveVocalReadingOctave(rests, MEZZO_RANGE)).toBe(0);
  });

  it('leaves the explicit octave-clef branch unchanged for each source, whatever the range says', () => {
    // A treble-8vb line from MusicXML and from denigma MNX is never shifted by
    // the range, even one that would pull it up; plain MNX keeps its -1.
    const direct = scoreOf([note('n1', P('A', 2)), note('n2', P('E', 4, -1))], { sign: 'G', line: 2, octaveChange: -1 });
    const musicxml = { ...direct, source: { ...direct.source, format: 'musicxml' as const, origin: 'musicxml-direct' as const } };
    const denigma = { ...direct, source: { ...direct.source, origin: 'denigma-mnx-from-musx' as const } };
    expect(resolveVocalReadingOctave(musicxml, MEZZO_RANGE)).toBe(0);
    expect(resolveVocalReadingOctave(denigma, MEZZO_RANGE)).toBe(0);
    expect(resolveVocalReadingOctave(direct, MEZZO_RANGE)).toBe(-1);
  });

  it('honours an explicit treble-8vb clef directly, even with no range', () => {
    const parsed = scoreOf([note('n1', P('G', 4))], { sign: 'G', line: 2, octaveChange: -1 });
    expect(resolveVocalReadingOctave(parsed)).toBe(-1);
    expect(resolveVocalReadingOctave(parsed, BASS_RANGE)).toBe(-1);
  });

  it('reads a MusicXML treble-8vb line where it sounds, since its pitches already sound', () => {
    const mnx = scoreOf([note('n1', P('A', 2)), note('n2', P('E', 4, -1))], { sign: 'G', line: 2, octaveChange: -1 });
    const musicxml = { ...mnx, source: { ...mnx.source, format: 'musicxml' as const, origin: 'musicxml-direct' as const } };
    expect(resolveVocalReadingOctave(musicxml)).toBe(0);
    expect(resolveVocalReadingOctave(musicxml, BASS_RANGE)).toBe(0);
  });

  it('reads a denigma treble-8vb line where it sounds, since denigma MNX stores sounding pitch too', () => {
    // Sunless no. 2 as denigma delivers it: A2 to E♭4 under a treble-8vb clef.
    const direct = scoreOf([note('n1', P('A', 2)), note('n2', P('E', 4, -1))], { sign: 'G', line: 2, octaveChange: -1 });
    const denigma = {
      ...direct,
      source: { ...direct.source, fidelity: 'high' as const, origin: 'denigma-mnx-from-musx' as const },
    };
    expect(resolveVocalReadingOctave(denigma)).toBe(0);
    expect(resolveVocalReadingOctave(denigma, BASS_RANGE)).toBe(0);
    // The same line uploaded as MNX keeps the shift: that convention is not established.
    expect(resolveVocalReadingOctave(direct, BASS_RANGE)).toBe(-1);
  });

  it('still disambiguates a plain treble clef by range on the denigma path', () => {
    // Sunless no. 4 arrives in plain treble at its written octave, B3 to E♭5.
    const parsed = scoreOf([note('n1', P('B', 3)), note('n2', P('E', 5, -1))], { sign: 'G', line: 2 });
    const denigma = { ...parsed, source: { ...parsed.source, origin: 'denigma-mnx-from-musx' as const } };
    expect(resolveVocalReadingOctave(denigma, { lowest: P('A', 2), highest: P('E', 4) })).toBe(-1);
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
