/**
 * Clef selection (v37 §A.17, Dann's ruling 2026-07-13): the process must
 * assess the input and choose reasonably. The printed clef wins when the
 * source carries one; otherwise a tessitura heuristic picks the clef
 * that keeps the sung line nearest the staff (fewest ledger lines).
 *
 * Modern vocal music uses treble and bass clefs only; a tenor part is
 * written in treble sounding an octave lower, ideally treble-with-8,
 * and C clefs appear only to replicate original clefs in early-music
 * editions (Gould extraction v5, rule 76, p. 433). Fit therefore
 * renders three clef passes — treble, treble-8vb, and bass — and maps
 * a source C clef through the heuristic rather than drawing one.
 *
 * v1 scope: ONE clef per rendered score, selected from the first source
 * clef (or the whole line's median). Mid-score clef changes are captured
 * by the parsers (`ParsedScore.clefs`, `Measure.clef`) but not yet
 * honoured per system; that refinement has a data path waiting via
 * `sliceScore`'s measure snapshots.
 */

import type { Clef, ParsedScore, Pitch } from './types';

/** The clef a rendered staff is drawn in. */
export type RenderClef = 'treble' | 'treble-8vb' | 'bass';

const DIATONIC: Record<Pitch['step'], number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const MIDDLE_C = 4 * 7 + DIATONIC.C; // C4

/**
 * Map a captured source clef to a render pass. Returns null for clefs
 * Fit does not draw (C clefs), routing the caller to the heuristic.
 */
export function clefFromSource(clef: Clef): RenderClef | null {
  if (clef.sign === 'G') return (clef.octaveChange ?? 0) <= -1 ? 'treble-8vb' : 'treble';
  if (clef.sign === 'F') return 'bass';
  return null;
}

/**
 * Choose the render clef for a parsed score: source clef when present
 * and drawable, else the tessitura heuristic (median written sung pitch
 * against middle C; at or above C4 reads best in treble, below in bass).
 * An empty vocal line takes treble, the modern default.
 */
export function chooseClef(parsed: ParsedScore): RenderClef {
  const source = parsed.clefs?.[0]?.clef;
  if (source) {
    const mapped = clefFromSource(source);
    if (mapped) return mapped;
  }
  const nums = parsed.vocalLine
    .filter((e) => e.type === 'note' && e.pitch)
    .map((e) => e.pitch!.octave * 7 + DIATONIC[e.pitch!.step])
    .sort((a, b) => a - b);
  if (nums.length === 0) return 'treble';
  const median = nums[Math.floor(nums.length / 2)];
  return median >= MIDDLE_C ? 'treble' : 'bass';
}
