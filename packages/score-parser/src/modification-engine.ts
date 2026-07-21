/**
 * The general vowel-modification engine (framework §4/§7; §A.162).
 *
 * Given a source vowel and the singer's calibrated resonance matrix, compute
 * the acoustic modification TARGET: the neighbour a singer opens toward to move
 * the vowel's first resonance clear of a harmonic. This is the pure math that
 * supersedes the v1 hardcoded `[i]→[ɪ]` case in `apps/web`'s advice resolver;
 * the sourced advice reads a target rather than baking one in.
 *
 * The rule (§A.162, SOURCED to Mitton 2020 §6 and Bozeman's vowel-opening
 * lever): **raise fR1, hold fR2 in its band.** Among the singer's measured
 * vowels, the target is the one with a HIGHER fR1 (a more-open vowel, so its
 * first resonance sits higher and clears the sung pitch) whose fR2 stays
 * NEAREST the source vowel's fR2. Holding fR2 nearest is how "in the same band,
 * without crossing the front/back divide" is operationalised: backness reads
 * off fR2, not off fR1 (§A.163), so the fR2-nearest candidate is the same-side
 * neighbour. One rule reproduces BOTH sourced modifications from the low-male
 * matrix: `[i]` 296/1705 → `[ɪ]` 393/1600 (front, fR1 up, fR2 held), and `[o]`
 * 489/826 → `[ɑ]` 617/1013 (back, fR1 up, fR2 held). Verified in the test.
 *
 * Search pool (RULED by Dann, 2026-07-21). The candidate pool is the singer's
 * own MEASURED matrix (the curated inventory), not just the vowels a given
 * singer happened to capture, and not yet the full Jones quadrilateral. Dann
 * ruled the automatic search may later range over the full Jones space; that
 * needs canonical cardinal-vowel formant numbers for unmeasured vowels (e.g.
 * `[ɔ]`), a sourced reference this engine does not yet carry and will not
 * invent, so until it lands the search stays over the measured matrix. Over the
 * measured matrix the computed target equals the SOURCED target for both v1
 * cases, which is why the resolver can read this and still let the sourced
 * target govern what the singer is told (Dann's ruling, 2026-07-21): this is
 * the forecast layer, not the shipped prescription.
 *
 * Absence stays absence (§A.56). When the source vowel is unmeasured, when no
 * fR2 was captured, or when no more-open same-band neighbour exists, this
 * returns `undefined` rather than guessing; the resolver then falls back to the
 * sourced target (which never depends on the singer's own capture of it).
 *
 * Pure and dependency-free, so it unit-tests the way the parsers do.
 *
 * Tags: SOURCED (a ruling, a citation, or a measured value), INFERENCE
 * (derived), JUDGEMENT (a build-time default, Dann rules).
 */

import type { VoiceProfileSnapshot } from './analysis-types';

/** A computed modification target: the vowel to open toward, and its resonances. */
export interface ModificationTarget {
  /** The target vowel (IPA), a measured neighbour with higher fR1 holding fR2 nearest. */
  vowel: string;
  /** The target's first resonance (Hz), from the snapshot. */
  fR1: number;
  /** The target's second resonance (Hz), from the snapshot. */
  fR2: number;
}

/**
 * The more-open, fR2-holding neighbour of `sourceVowel` in the singer's
 * measured matrix, or `undefined` when none can be computed (see the module
 * doc's "absence stays absence"). Reads BOTH fR1 and fR2; a vowel missing
 * either is not a candidate, and a snapshot with no fR2 at all returns nothing.
 */
export function modificationTarget(
  sourceVowel: string,
  snapshot: VoiceProfileSnapshot,
): ModificationTarget | undefined {
  const fR2 = snapshot.fR2;
  if (!fR2) return undefined; // no fR2 measured → the hold-fR2 rule cannot run
  const sourceFr1 = snapshot.fR1[sourceVowel];
  const sourceFr2 = fR2[sourceVowel];
  if (typeof sourceFr1 !== 'number' || typeof sourceFr2 !== 'number') return undefined;

  const candidates: ModificationTarget[] = [];
  for (const [vowel, vowelFr1] of Object.entries(snapshot.fR1)) {
    if (vowel === sourceVowel) continue;
    const vowelFr2 = fR2[vowel];
    if (typeof vowelFr2 !== 'number') continue; // needs both fR1 and fR2 to be a candidate
    if (vowelFr1 <= sourceFr1) continue; // must be MORE open (higher fR1) to clear the pitch
    candidates.push({ vowel, fR1: vowelFr1, fR2: vowelFr2 });
  }
  if (candidates.length === 0) return undefined;

  // Hold fR2 nearest (in-band, same side of the front/back divide); ties break
  // to the subtler opening (smaller fR1 rise), then deterministically by IPA.
  candidates.sort((a, b) => {
    const da = Math.abs(a.fR2 - sourceFr2);
    const db = Math.abs(b.fR2 - sourceFr2);
    if (da !== db) return da - db;
    if (a.fR1 !== b.fR1) return a.fR1 - b.fR1;
    return a.vowel < b.vowel ? -1 : 1;
  });
  return candidates[0];
}
