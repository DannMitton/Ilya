# Report: lane 67, Step 1 (the six fixes of lane 66's as-built review)

2026-11-18, Code (cloud session), branch `cloud-lane-67`. Paths under `apps/web/src/lib/` unless they begin with `docs/`. The six fixes are those of `docs/sessions/review-fable-lane66-as-built_r1_2026-11-17.md`, section Fixes.

## What was done

1. `voice/chart/readings.ts`: the local `isSung` (was `:51`) is deleted and `import { isSung } from '../engine/sung'` added. The comment at the old `:80` now reads `"sung" is the one test, `engine/sung.ts` `isSung``. `voice/VowelCapture.svelte`: `sungSet` is `VOWELS.filter((v) => isSung(profile[v]))`, with the import added.
2. `analysis/analyze-score-adapter.ts:64-65`: "(off its shape) or the guard failed," becomes "(off its shape),".
3. `voice/engine/resolve-values.ts` (the derived-fR2 comment): "no f2Quality and no plausibility, both of which mean 'not assessed' and pass" becomes "no f2Quality, which means 'not assessed' and passes".
4. `voice/engine/resolve-values.ts`: the comment above `judgeUnchecked`'s call now says the judged copy is returned as `formants` and no gate below reads its verdict; the comment on an absent `plausibility` now says the summary's note judges it for itself.
5. `voice/engine/sung.ts` (header comment): the clause now reads "`analyze.ts:175` can set `f1: 0`; `runCapture` refuses such a take (`:216`), so only data stored by other means can hold one, and two of the four tests counted it." I read `analyze.ts:175` (`f1: ex.f1 ?? 0`) and `:216` (`if (!cf.f1) return { outcome: 'error', ... }`) before writing it.
6. `docs/sessions/n200-lane66-step4-measure_2026-11-17.md`: a dated correction paragraph appended under the sentence at `:40`; the sentence itself is not rewritten. The same sentence also stands in the lane 66 Step 5 and Step 6 reports; the brief asks for the correction at the measure report only, so those two reports are untouched.

I also corrected one citation in my own Step 0 report (`finish-early.ts:68`, not `:97`).

## Comments corrected

Fixes 1 (readings.ts), 2, 3, 4 (two comments), and 5 above are each a comment correction. `voice/engine/sung.ts` header was the only other comment naming the old behaviour.

## Tests

`vitest run src/lib/voice/chart src/lib/voice/engine/sung`: 18 files, 244 passed. `src/lib/voice/VowelCapture`: 21 passed. The type check runs once at the end.

## What I could not establish

Nothing in this step.
