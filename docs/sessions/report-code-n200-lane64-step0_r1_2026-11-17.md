# Report, N.200 lane 64, Step 0: read, a second golden, the bars committed first

Cloud lane 64, branch `cloud-lane-64`, cut from `origin/Shane` at `240fe5ab` (the commit the desk named; the clone's local `Shane` was behind at `649fe492`, and `git fetch origin Shane` showed a forced update to `240fe5ab`). Working tree clean at the cut. Node and pnpm as installed by `pnpm install --frozen-lockfile`; Python 3 with numpy and scipy (scipy installed here with pip; it was absent). No engine code changed in this step. Lane 63 runs on `cloud-lane-63`; nothing outside this lane's Owns list is touched.

## 1. The eight gates on the untouched tip

The gates ran in one background script while the golden was being written in the same container. Gate 4's count equals the baseline exactly, so nothing new was collected.

| Gate | Measured at `240fe5ab` |
|---|---|
| 1 phonology | 462 passed (462) |
| 2 dictionary | 248 passed (248) |
| 3 web-check | 0 errors, 12 warnings, 5 files |
| 4 web-test | 6544 passed, 1 skipped (6545); 355 files. Equal to the baseline |
| 5 score-parser | 904 passed, 5 skipped (909) |
| 6 blurb | 178 passed (178) |
| 7 integration | 159 passed (159) |
| 8 ratchets | OK (the tool also printed three ceilings that could be lowered by one to four lines; it is a notice, not a failure) |

The brief's gate 4 baseline is 6544 passed, 1 skipped (6545) with Python, numpy, and scipy.

## 2. The cited lines, re-read on this tip

Every line the brief cites was read at `240fe5ab` and matches: `engine/analyze.ts` `:59`, `:140`, `:144`, `:180`, `:195`; `engine/live.ts` `:199`, `:200`, `:740`; `engine/types.ts:77`; `takes.ts:28`; `chart/measure-switch.ts:1-13`; `chart/stub-switch.ts:32`; `CalibrationWizard.svelte` `:205`, `:294-299`; `engine/divergence.ts` `:7`, `:15`; `engine/open-extract.ts:41`; `engine/path-extract.ts` `:66`, `:77`, `:122`, `:127`, `:174`, `:184`, `:192`, `:210`, `:223`; `tools/n200-score/measure.run.ts:29`; `tools/n200-score/score-core.ts:107`; `tools/n200-score/burg-fixtures.ts:17`; `apps/web/src/lib/i18n.ts:2601`; `docs/memory/PRODUCT.md:1264-1273` (items 2 and 3 at `:1269-1270`); `vercel.json` `:3` and `:48`. The test-file lines of Step 5 (`analyze.test.ts:187-405` and the others) are re-read in Step 5, where they change.

## 3. A gap in the brief, and what I did

r2 says "the third set as `N200_SET=third`" but does not define it. The definition is in r1 (`brief-code-n200-switch-on-lane64_r1_2026-11-17.md:56`) and in Fable's review of lane 62 (`review-fable-lane62-as-built_r1_2026-11-17.md:29`), identically: take seed `15000 + idx*20 + k`, permutation from `rng(17000 + idx*31 + 1)`, truth factor from `rng(19000 + idx)` drawn as `HELD_OUT` draws it. Fable's review of the lane 63 and 64 briefs (`review-fable-briefs-lanes63-64_r1_2026-11-17.md:58`) confirms the ranges collide with neither earlier set. I will build the third set from those numbers in Step 2. If the desk meant otherwise, say so before Step 2 is pushed.

## 4. The second golden

`tools/n200-score/golden.run.ts` now holds two tests. `N200_GOLDEN=write` writes `shipped-open-600.json` (as before); `N200_GOLDEN=write-path` writes `__golden__/path-600.json`, the `path` picker under `runCapture` on the 600 primary takes, same row shape and rounding (f1 and f2 to 0.1 Hz, confidence, reading, f2Quality, picker, outcome). With no variable set, both files are compared and any difference fails. `path-600.json` was written once on the untouched engine (370 s). Of its 600 takes: 566 Captured, 16 Provisional, 18 re-prompts. `shipped-open-600.json` is not rewritten and is byte-equal to the tip's.

A second run of the path test in compare mode, on the same machine, matched the committed file byte for byte. Committed as the lane's first commit, before any engine change; `git diff 240fe5ab` on `apps/web` is empty at that commit.

## 5. The bars of section 3A, copied as written from `brief-code-n200-switch-on-lane64_r2_2026-11-17.md`

### 3A. The bars, committed in Step 0 before anything is built

**Definitions.** Those of `tools/n200-score/measure-core.ts:5-8` stand: every take generated is in the denominator, and an absent fR2 is a miss. Bars are judged on the third set's takes pooled across voice types; per voice type and the split by second pulse are reported. "Track-2 fR2" is the path's second track before any check.

**On the third set, a variant (one of the five combinations on one of the three ladders) passes when:**
1. Of the takes whose track-2 fR2 is within 12 percent, the final fR2 differs from the same ladder with every option off on at most 1 percent.
2. Of the takes whose track-2 fR2 is outside 12 percent, at least half end with fR2 absent or within 12 percent, and more than with every option off.
3. With P3: at least 90 percent of the readings P3 promotes are within 12 percent. A variant with P3 that promotes none does not pass.
4. A raised floor puts no take that is in both bars on L15 out of them ("in both bars" is the final reading, with the same options on both ladders).
5. The plan's bars hold for every voice type (plan r2 section 6): fR1 within 10 percent and fR2 within 12 percent on at least 80 percent of takes; no more than 10 percent of takes in both bars made Provisional by case (b) or (d).

**On Dann's 13 takes** (the desk's run, outside the repository), a variant passes when: no take in both bars under the lane 62 picker leaves them; both [u] takes stay in both bars; R125 changes none of the 12 readings. [ɪ], [ɛ], and take 09 are reported.

**The choice.** Among variants that pass both, the desk takes the one with the most third-set takes in both bars; a tie goes to the fewest options, then to L15. Dann's takes can refuse a variant; they cannot choose one that failed the third set (Dann 2026-11-17 10:02, on the desk's recommendation: "I defer to your recommendation"; one bass cannot speak for the treble voices the third set holds).

## 6. What I could not establish

- Whether the original third set, if the desk had one in mind, is the one built from r1's numbers (section 3).
- That the path golden is identical on another machine: pole values differed between two machines in lane 62's P0b, which is why the golden rounds to 0.1 Hz. Only this machine has written it.
