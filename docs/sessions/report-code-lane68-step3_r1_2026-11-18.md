# Report, lane 68, Step 3: the five fixes of lane 67's as-built review

2026-11-18. Branch `cloud-lane-68`. Source: `docs/sessions/review-fable-lane67-as-built_r1_2026-11-18.md`, section "Fixes". Tests run (files this step changed, plus the neighbours that import them): `voice/outside-igh.test.ts`, `voice/outside.test.ts`, `voice/engine/resolve-values.test.ts`, and everything under `markup/`: 12 files, 714 tests, all passed. The Fix 5 run is Playwright, below.

1. **Fix 1.** `markup/MarkupPane.svelte:448`: `provisionalVowels` now filters `isSung(formants[g]) && formants[g]?.reading === 'provisional'`, so a Provisional [ɨ] set aside with "Use Ilya's estimate for now" is not listed as a vowel to re-take. The import is `{ isSung }` alone (amendment 9; Step 1 had already removed `isPersonal`). No line added. No unit test: the filter is inline in the component; NOT ESTABLISHED by a test, only by reading the line.
2. **Fix 2.** `voice/outside.ts:37-39`: `farOffIgh` returns false for a sung [ɨ] with no usable fR2 (`f2` not a positive number, or `f2Quality === 'absent'`). Test added to `voice/outside-igh.test.ts` (three ways of having no fR2, and the far-off [ɨ] with an fR2 still true). How often a take has no fR2: NOT ESTABLISHED, as the review says.
3. **Fix 3.** `voice/CalibrationWizard.svelte:862`: the comment reads "the note on unstable readings, and the far-off [ɨ]'s". Same line count (1124).
4. **Fix 4.** Comments now say "scaled to the singer (the tract scale, `stand-ins.ts`)": `voice/engine/resolve-values.ts` (header, and the comment at the stand-ins call, rewritten for lane 68's two cases), `voice/chart/zones.ts:20` and `:64`. (`stand-ins.ts:22` keeps "a fitted shift and spread" because it describes the method before lane 67.)
5. **Fix 5.** The rolled-back re-take test (`e2e/calibrate-new.test.ts:233`) passed 3 of 3 runs, alone, desktop project (40.5, 39.4, and 41.1 s). A dated line is appended to section 5 of `report-code-lane67-step8_r1_2026-11-18.md`.

Ratchets: `CalibrationWizard` 1124 of 1126, `MarkupPane` 1353 of 1353 (unchanged). Comments corrected: those named in Fix 3 and Fix 4.
