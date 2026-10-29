# Report: N.135 stage 2b r5, step 1, the Russian-row threshold (Code, cloud lane, 2026-10-29, r1)

Branch `cloud-lane-21`. One commit for the step, on top of step 0.

## The answer first

1. `RUSSIAN_SHARE` is 0.3 (`apps/web/src/lib/omr/underlay-language.ts:33`; the test at `:65` reads `known >= RUSSIAN_SHARE * counted`). The long-dash limit is as built (`omr/underlay-tokens.ts:50`, `0.5 * options.inkHeight`, not touched).
2. The mutant: with the constant set back to 0.5, two tests in `omr/underlay-language.test.ts` fail ("holds the share at three in ten", and "calls a row Russian at one word in three and at two in five"). Run, then restored.
3. Two existing tests pinned the old share and were rewritten, not deleted: "calls a row other where under half its words are entries" (one word in three is now Russian) became "under three in ten" (one in four, and two in eight); "calls a row other at two words in five" became part of the new Russian case; "counts a word of two letters" used three words (`ты`, `xx`, `yy`) and now uses four, so the row stays one in four. A third new case pins the boundary: three words in ten is Russian.
4. The floating-point edge is safe: `0.3 * n` is not exact for some `n` (3, 6, 9, 12, 18 and others, run in Node), but `known` is an integer and the threshold at those `n` is a non-integer, so the comparison never turns on the last bit. At `n` a multiple of ten the product is exact.
5. The poem path's guard shares no constant with this one: `score/ingestion/ocr-guard.ts:37` (`MIN_TOKEN_LENGTH = 3`) and `:41` (`MAX_UNKNOWN_SHARE = 0.5`) are read in that file; `grep RUSSIAN_SHARE` finds it only in `omr/underlay-language.ts` and the comment in `omr/underlay-page.ts:17` (reworded to match).

## Gates after step 1

Gate 1 291 passed (291). Gate 2 248 passed (248). Gate 3 found 0 errors and 12 warnings in 5 files. **Gate 4 3555 passed | 1 skipped (3556)** (3553 after step 0: two tests dropped into rewritten ones, four added). Gate 5 775 passed | 5 skipped (780). Gate 6 145 passed (145). Gate 7 55 passed (55). Gate 8 ratchets: OK.

## The measure

Expectation, written before the run, from the brief and A2's replay: at 0.3 with the dash limit as built, read right 1,514 to 1,836 of 2,538, seated exact (b) 1,451 to 1,671 of 2,385, nucleus (a) 1,848, word-exact (c) 638, systems with no Russian row 37 to 19 of 239 (A2, section 2 and 3). With the song gate still on, 900 and 851 (the brief's section 8, from the r4 review's replay). **I did not run this replay.** `tools/cells.mjs`, the scorer, and the 18 captures are in the desk's `~/Downloads`, not in this lane. Likeliest failure: a replay difference from a 0.3 comparison on a row at the boundary; the check above shows none from floating point. The desk's replay on my build is the measure.

## Departures

None from the brief. The step 0 report's comment citation was corrected from `stamp.ts:29-44` to `:25-44` in this commit (the comment starts at line 25).

## Files

`apps/web/src/lib/omr/underlay-language.ts`, `apps/web/src/lib/omr/underlay-language.test.ts`, `apps/web/src/lib/omr/underlay-page.ts` (a comment), `docs/sessions/report-code-n135-stage2b-r5-step0_r1_2026-10-29.md` (one citation), this report.
