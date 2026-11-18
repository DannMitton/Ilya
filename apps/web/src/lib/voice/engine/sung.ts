import type { CalibratedFormant } from './types';

/**
 * THE ONE TEST OF "SUNG" (lane 66, Step 5). A stored reading counts as sung when it holds a number above zero and is not an estimate. It is the whole of
 * the test: the plausibility verdict, the singer's Keep, the signal-quality status, and the quality of the second resonance take no part in it. What a
 * singer sings is what Ilya uses (Dann 2026-11-13, `docs/memory/PRODUCT.md:1269-1273`: a neighbourhood "never demotes, discards, or blocks a reading").
 *
 * Read by the count the VOICE pane and its doors print (`voice/profileStore.ts`, `usableReadingCount`), by the vowels INSIGHTS calls measured
 * (`insights/InsightsPane.svelte`), by the resolution of values for MELODY, INSIGHTS, and the chart (`voice/engine/resolve-values.ts`, `derivations.ts`),
 * and by the chart's own dots and the capture screen's "recorded" (`voice/chart/zones.ts`, `finish-early.ts`). Before this lane four sites held four
 * tests, and `analyze.ts` can write `f1: 0` for a take whose first resonance it could not place, which two of them counted.
 */
export const isSung = (f: CalibratedFormant | undefined): f is CalibratedFormant => !!f && f.reading !== 'estimated' && typeof f.f1 === 'number' && f.f1 > 0;
