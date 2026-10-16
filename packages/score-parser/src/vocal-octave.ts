/**
 * Vocal reading-octave resolution.
 *
 * A `.musx` vocal line is often notated an octave above where a lower voice
 * sings it: the treble-8vb ("vocal tenor") clef, printed with a small 8 or,
 * frequently, without. The denigma converter flattens that displaced clef to
 * a plain treble clef and emits the WRITTEN octave, so the line arrives an
 * octave too high. Every downstream stage reads `pitch.octave` absolutely,
 * which is correct, so the whole analysis and the watch list then treat the
 * line as far above where the singer actually sings. This module recovers the
 * intended SOUNDING octave.
 *
 * The disambiguation uses only the singer's OWN declared range, never a Fach
 * inference (§A.68): read the line as written, an octave down, and an octave
 * up, and keep the reading that sits inside the range they gave. A genuine
 * treble line (a soprano's) fits as written and is never shifted; a bass line
 * notated in treble fits an octave down and is; a bass-clef line a mezzo
 * would sing fits an octave up and is. An explicitly octave-displaced source
 * clef is authoritative and honoured directly, which also repairs the
 * standing gap that `analyzeScore` never applied a clef's `octaveChange`.
 *
 * ROW 47, 2026-10-15, THE READING GOES BOTH WAYS. Dann, 2026-10-08, on a
 * mezzo who sang Mussorgsky's *Sunless* an octave up with great success
 * (01:11): "I think we should let it benefit high voices browsing low
 * anthologies." Ruled 01:17 to 01:20: either direction, from any clef, by one
 * octave at most; the reading that fits the typed range STRICTLY better than
 * as written, and a line that fits as written is never moved. So the
 * candidates are −1, 0, and +1 (written, an octave down, an octave up), and
 * the explicit octave-clef branch below is unchanged.
 *
 * Pure and non-destructive: `shiftVocalOctave` returns a COPY; the ground
 * truth `ParsedScore` is never mutated.
 *
 * Tags: SOURCED (from the running code or a ruling), INFERENCE, JUDGEMENT
 * (a build-time default, Dann rules). The thresholds below are JUDGEMENT.
 */

import { pitchToMidi } from './overlay-engine';
import type { ParsedScore, Pitch } from './types';

/**
 * The octave shift (−1, 0, or +1) at which the vocal line should be READ for
 * this singer:
 *   - an absent clef yields 0 (the render's own heuristic routes it);
 *   - an explicit octave-displaced treble clef (`octaveChange <= -1`) yields
 *     0 for MusicXML and for MNX that denigma converted from `.musx`, because
 *     both already store the sounding pitch; it is honoured directly only for
 *     MNX uploaded as MNX, whose convention is not established;
 *   - every other present clef (a plain treble, a bass, a C clef) is judged
 *     by the singer's range: the shift of −1, 0, or +1 with the STRICTLY
 *     greatest fraction of notes inside it, and 0 on any tie with as written.
 *     DESK DEFAULT (row 47 review, 2026-10-15): where −1 and +1 both beat 0
 *     and tie each other, 0;
 *   - no declared range, or no pitched note, yields 0 (no signal to judge by).
 */
export function resolveVocalReadingOctave(
  parsed: ParsedScore,
  range?: { lowest: Pitch; highest: Pitch },
): number {
  const clef = parsed.clefs?.[0]?.clef;
  if (!clef) return 0;

  const marked = clef.sign === 'G' ? (clef.octaveChange ?? 0) : 0;
  if (marked <= -1) {
    /* A MUSICXML PITCH ALREADY SOUNDS WHERE THE OCTAVE CLEF SAYS. Its
       `<octave>` is the sounding octave and `<clef-octave-change>` only tells
       the engraver how to print it, so shifting again reads the line an
       octave low. Measured 2026-09-23: Sunless no. 2's voice part stores A2
       to E♭4 under a treble-8vb clef, the span Mitton (2020, printed p. 92)
       gives, and this branch read it as A1 to E♭3.

       DENIGMA'S MNX STORES SOUNDING PITCH TOO. Measured 2026-09-23 on Dann's
       own `.musx` files through denigma: Sunless nos. 2, 3, 5, and 6 carry a
       treble-8vb clef, and their MNX pitches already sit in Mitton's range
       (no. 2 stores A2 to E♭4). Dann ruled 2026-09-23: skip the shift for
       denigma MNX only. MNX uploaded as MNX keeps it, because no hand-written
       MNX with an octave clef has been checked: its convention is NOT
       ESTABLISHED, and this branch is where that question lives. */
    const storesSounding =
      parsed.source?.format === 'musicxml' || parsed.source?.origin === 'denigma-mnx-from-musx';
    return storesSounding ? 0 : marked;
  }

  if (!range) return 0; // plain treble, no range: do not guess

  const midis = parsed.vocalLine
    .filter((e) => e.type === 'note' && e.pitch)
    .map((e) => pitchToMidi(e.pitch as Pitch));
  if (midis.length === 0) return 0;

  const lo = pitchToMidi(range.lowest);
  const hi = pitchToMidi(range.highest);
  const inRangeFraction = (shiftOctaves: number): number => {
    const shift = 12 * shiftOctaves;
    let inside = 0;
    for (const m of midis) if (m + shift >= lo && m + shift <= hi) inside++;
    return inside / midis.length;
  };

  // One octave either way at most (treble-8vb is exactly −1, and a mezzo on a
  // bass song is +1). Shift only when a candidate fits the singer's declared
  // range strictly better than as-written, so a line that fits is never
  // displaced. JUDGEMENT: strict improvement, single-octave candidate set, and
  // a tie between −1 and +1 stays as written.
  const asWritten = inRangeFraction(0);
  const down = inRangeFraction(-1);
  const up = inRangeFraction(1);
  if (down > asWritten && up > asWritten) return down > up ? -1 : up > down ? 1 : 0;
  if (down > asWritten) return -1;
  if (up > asWritten) return 1;
  return 0;
}

/**
 * A non-destructive copy of `parsed` with the vocal line read `octaves` lower
 * (or higher). The source clef list is cleared so the render's tessitura
 * heuristic re-picks a clef suiting the shifted pitches (a shifted-down bass
 * line lands in bass clef, where it sounds). `octaves === 0` returns the input
 * unchanged. The per-measure `clef` snapshots are left as-is; the v1 renderer
 * resolves one clef from `clefs`, so clearing that list is sufficient (revisit
 * if per-system clef rendering lands).
 */
export function shiftVocalOctave(parsed: ParsedScore, octaves: number): ParsedScore {
  if (octaves === 0) return parsed;
  return {
    ...parsed,
    clefs: [],
    vocalLine: parsed.vocalLine.map((e) =>
      e.pitch ? { ...e, pitch: { ...e.pitch, octave: e.pitch.octave + octaves } } : e,
    ),
  };
}
