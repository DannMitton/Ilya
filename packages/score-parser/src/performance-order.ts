/**
 * Performance-order projection for the analysis path.
 *
 * `analyzeScore`, the watch list, and the per-verse machinery should read the
 * score as it is actually SUNG: repeats taken, jumps followed, and any material
 * after a Fine (or jumped over) absent, so a note contributes an acoustic
 * forecast only where the singer actually reaches it. The engraved score, by
 * contrast, stays in NOTATED order, with repeats and jumps drawn as written.
 * That boundary is deliberate: whether the render itself expands repeats is the
 * open strophic ruling's to settle (D3, the reprint-per-verse bundle), not this
 * layer's. So the app derives TWO views from one parse: this performance-order
 * projection for analysis, and the untouched `ParsedScore` for the renderer.
 *
 * This module owns the projection so the wiring in `apps/web` stays a one-liner
 * and the reordering logic is unit-testable in the sandbox, exactly like the
 * unfolder it builds on. It runs the existing `unfold` (increment 1 repeats and
 * voltas, plus increment 2 jumps) over the score's measure markers, then rebuilds
 * the vocal line by concatenating each sung measure's events in performance order.
 *
 * Honesty over guessing: when `unfold` cannot compute an order (an unsupported or
 * ambiguous structure), it returns a flag and this projection falls back to the
 * score AS WRITTEN (identity), carrying the flag so a later notice UI can read it.
 * The as-written no-op is also the fast path for the common score with no repeats
 * or jumps: the input is returned by reference, so nothing changes for the scores
 * that dominate today, and every existing analysis result is preserved exactly.
 *
 * Event identity: a measure sung more than once contributes its events more than
 * once, keeping the SAME `VocalLineEvent.id` (and the same event object) on every
 * pass. The overlay `analyzeScore` builds is a deterministic function of (pitch,
 * vowel, profile), so repeated ids resolve to the same `AnalyzedEvent` and
 * collapse cleanly in the id-keyed `events` map, while every occurrence still
 * weights the melody's tessitura band. Downstream consumers (`paginateScore`,
 * `buildWatchList`) look marks up by id against the NOTATED score, so this
 * id-stable projection keeps their joins intact and simply carries no mark for a
 * note that is never sung.
 *
 * Pure and non-destructive: the input `ParsedScore` is never mutated.
 */

import type { ParsedScore, VocalLineEvent } from './types';
import { markersFromMeasures, unfold, type UnfoldFlag } from './unfold';

export interface PerformanceOrderScore {
  /**
   * The score whose `vocalLine` is in sung performance order. When unfolding was
   * a no-op (as-written) or fell back on a flag, this is the input by reference,
   * so `result.score === parsed` identifies the untouched case.
   */
  score: ParsedScore;
  /** True only when the vocal line was actually reordered from as-written. */
  reordered: boolean;
  /**
   * Why an order could not be computed, when applicable. Empty on success and on
   * the plain as-written case. A caller carries these to its score-level notice
   * surface; the messages are the unfolder's own documented flag copy, not new
   * user-facing strings authored here.
   */
  flags: UnfoldFlag[];
}

/**
 * Project a parsed score into sung performance order for the analysis path.
 */
export function scoreInPerformanceOrder(parsed: ParsedScore): PerformanceOrderScore {
  const result = unfold(markersFromMeasures(parsed.measures));

  // An unsupported or ambiguous structure: analyse as written, carry the flag.
  if (!result.ok) {
    return { score: parsed, reordered: false, flags: [result.flag] };
  }

  const order = result.order;

  // Fast path: as-written order (each measure once, in index order). The common
  // score with no repeats or jumps lands here and is returned by reference.
  const isAsWritten =
    order.length === parsed.measures.length &&
    order.every((step, i) => step.source === i && step.pass === 1);
  if (isAsWritten) {
    return { score: parsed, reordered: false, flags: [] };
  }

  // Group the vocal-line events by their measure index once, preserving the
  // within-measure order.
  const eventsByMeasure = new Map<number, VocalLineEvent[]>();
  for (const ev of parsed.vocalLine) {
    const bucket = eventsByMeasure.get(ev.measureIndex);
    if (bucket) bucket.push(ev);
    else eventsByMeasure.set(ev.measureIndex, [ev]);
  }

  // Rebuild the vocal line by walking the sung measure sequence. Events are
  // reused by reference (same id, same object) so the id-keyed joins downstream
  // stay intact; a measure carrying no vocal events (an interlude) is skipped.
  const vocalLine: VocalLineEvent[] = [];
  for (const step of order) {
    const bucket = eventsByMeasure.get(step.source);
    if (!bucket) continue;
    for (const ev of bucket) vocalLine.push(ev);
  }

  return { score: { ...parsed, vocalLine }, reordered: true, flags: [] };
}
