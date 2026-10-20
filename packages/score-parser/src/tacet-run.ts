/**
 * Where a tacet run meets a measure range (row 141).
 *
 * `layoutColumns` once kept a run only when it lay wholly inside the range
 * (`sliceWidth`'s question), while the render of the same range asks
 * `tacetRuns` of the SLICE, which sees a run the range cuts as a shorter run of
 * its own. A range that ended inside a run was therefore measured without it and
 * drawn with it, up to a whole rest too wide. The run is clipped to the range
 * here, the way the slice sees it, so the two agree.
 */
import type { TacetRun } from './staff-renderer';

export function clipRun(run: TacetRun, fromMeasure: number, toMeasure: number): TacetRun {
  const from = Math.max(run.fromMeasure, fromMeasure);
  const to = Math.min(run.toMeasure, toMeasure);
  return from === run.fromMeasure && to === run.toMeasure ? run : { fromMeasure: from, toMeasure: to, count: to - from + 1 };
}

/** The last measure of the packing unit that holds `measure`: a whole tacet run, or the measure itself. */
export function unitEnd(runs: readonly TacetRun[], measure: number): number {
  return runs.find((r) => r.fromMeasure <= measure && measure <= r.toMeasure)?.toMeasure ?? measure;
}
