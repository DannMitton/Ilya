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
 * inference (§A.68): read the line as written and an octave down, and keep the
 * reading that sits inside the range they gave. A genuine treble line (a
 * soprano's) fits as written and is never shifted; a bass line notated in
 * treble fits an octave down and is. An explicitly octave-displaced source
 * clef is authoritative and honoured directly, which also repairs the
 * standing gap that `analyzeScore` never applied a clef's `octaveChange`.
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
 * The octave shift (in octaves; 0 or negative) at which the vocal line should
 * be READ for this singer:
 *   - a bass, C, or absent clef yields 0 (bass already sounds as written; a
 *     C clef and an absent clef route through the render's own heuristic);
 *   - an explicit octave-displaced treble clef (`octaveChange <= -1`) is
 *     honoured directly (the source told us);
 *   - a plain treble clef is disambiguated by the singer's range, shifting an
 *     octave down only when that fits their range strictly better;
 *   - a plain treble clef with no declared range yields 0 (no signal to judge
 *     by, and with no range there is no out-of-range flood to repair anyway).
 */
export function resolveVocalReadingOctave(
  parsed: ParsedScore,
  range?: { lowest: Pitch; highest: Pitch },
): number {
  const clef = parsed.clefs?.[0]?.clef;
  if (!clef || clef.sign !== 'G') return 0;

  const marked = clef.octaveChange ?? 0;
  if (marked <= -1) return marked; // an explicit treble-8vb clef is authoritative

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

  // An octave down is the only real vocal reading (treble-8vb is exactly −1).
  // Shift only when it fits the singer's declared range strictly better than
  // as-written, so a true treble line is never displaced. JUDGEMENT: strict
  // improvement, single-octave candidate set.
  return inRangeFraction(-1) > inRangeFraction(0) ? -1 : 0;
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
