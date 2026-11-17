# Report, N.200 lane 64, Step 6: the end of the lane

Cloud lane 64, branch `cloud-lane-64`. **Lane 63 had merged into `Shane` first** (`f44eeba`, tip `55be262`), so, as the brief says, I merged `Shane` into this branch (`5b72778`, clean, no conflict) and ran the eight gates and the Playwright suites on the merged tree. Nothing was pushed to `Shane` or `main`, and no pull request was opened. Working tree clean when the runs started.

## The eight gates, on the merged tree (`5b72778`)

| Gate | Result |
|---|---|
| 1 phonology | 462 passed (462) |
| 2 dictionary | 248 passed (248) |
| 3 web-check | 0 errors, 12 warnings, 5 files |
| 4 web-test | **6584 passed, 1 skipped (6585)**; 357 files |
| 5 score-parser | 904 passed, 5 skipped (909) |
| 6 blurb | 178 passed (178) |
| 7 integration | 159 passed (159) |
| 8 ratchets | OK |

**Gate 4's count and its baseline.** The brief's baseline at `240fe5ab` is 6544 passed, 1 skipped (6545) with Python, numpy, and scipy (they were present). Before the merge, on this lane's own tree, gate 4 gave 6568 passed, 1 skipped (6569): 24 more than the baseline, from this lane's new tests. After the merge it gives 6584: 16 more, which I take to be lane 63's new tests (inferred from the two counts; I did not check them against lane 63's report). Nothing failed or was skipped beyond the one skipped test the baseline already had.

**One failure along the way, fixed.** On the first run of the gates (before the merge) gate 8 failed: my longer `withPlausibility` comment took `CalibrationWizard.svelte` to 1128 lines against its ceiling of 1126. I shortened the comment (the file is now 1120 lines, under the ceiling) and did not raise the ceiling (`cfd248e`). Gate 8 also prints three ceilings that could be lowered by a line; it is a notice, not a failure.

## The Playwright suites

`calibrate-new`, `singer-paths`, `voice-pane`, and `voice-stations` on the `chromium` project, **71 passed (16.2 min)**; `voice-stations` and `path-picker-time` on the `phone` project, **5 passed (51.6 s)**. Run on the merged tree, with `--trace off`, and with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`.

**The first attempt failed for the environment, not the code**: all 71 desktop and 5 phone tests died at browser launch, because the project wanted `chromium_headless_shell-1208` and this container holds build 1243 (and the config's own `PW_CHROMIUM_PATH` switch is how to point it at the pre-installed browser). I did not install a browser. The same suites had also passed on the pre-merge tree (71 and 5), so the merge changed no result.

The tool's own tests (`tools/n200-score`, under lane 63's rewritten `vitest.config.ts`): 33 passed (`fidelity-set.test.ts` 7, `score-core.test.ts` 26).

## Where the lane stands

Pushed to `cloud-lane-64`, in order: Step 0 (`b66b0d9`, the second golden and the bars), Step 1 (the fR2 options), Step 2 (`5e71b59`, the tool columns and the third set), Step 3 (`2658679`, the run), Step 4 (the defaults, `e2c7e16`, 43 of 600 `path-600.json` takes changed), Step 4b (`19cc17e`, the deployment), Step 5 (`2d7b344` and its report), and this step. Reports: `docs/sessions/report-code-n200-lane64-step0` to `step6_r1_2026-11-17.md`; tables: `n200-lane64-step3-tables-third_2026-11-17.md` and `n200-lane64-step5-counts_2026-11-17.md`.

## What the desk should know before the review as built

- **The time bar was met by bound**, on the desk's word (path median 258.5 ms on Dann's iPhone, shipped median not measured). I measured nothing on a phone.
- **Files outside the brief's Owns list that I touched**, each for a stated reason: `plausibility-keeps-status.test.ts` (new; the Step 5 plausibility test, which has to read the component's source because it has no component test, see the Step 5 report); `engine/divergence.test.ts` (new; the desk added the file and its test to Owns).
- **Stale comments I did not edit** (outside Owns): the comment above `withIghPass` in `CalibrationWizard.svelte`, `engine/session.ts:38-42`, `engine/capture-file.ts:104`, `engine/derivations.ts:73`. And `withIghPass` still deletes `isDivergent`, so the description the divergence pass now keeps is dropped before storage; nothing reads it.
- **The plausibility count on Dann's takes is NOT MEASURED** (held outside the repository); on the synthetic sets it is 0 of 588 and 0 of 566, which says nothing about real voices.
- **Not established anywhere in the lane**: whether R125, DP, or P3 helps a real [ɨ] or a treble's real fry; the weighting Weenink (2015) means; whether the primary and held-out sets share too much with the third set to count as independent evidence.
- A reading taken under `?measure=shipped` now stores `picker: 'shipped'`; readings stored earlier keep what they hold, and absent still means shipped.
