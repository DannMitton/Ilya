# Report, N.200 path picker, Step 0: read, rebuild the test set, commit a golden

Cloud lane 62, branch `cloud-lane-62`, cut from `origin/Shane` at `d20f6f1` ("N.200: plan r1 and r2, path picker brief r1 to r3"). The clone's local `Shane` was behind (`649fe49`); `git fetch origin Shane` moved the remote ref to `d20f6f1` (a forced update) and the branch was cut from it. Node v22.23.4, pnpm 10.28.0, `pnpm install --frozen-lockfile`. No engine code changed.

## The eight gates on the untouched tip

| Gate | Baseline | Measured |
|---|---|---|
| 1 phonology | 462 passed (462) | 462 passed (462) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| 4 web-test | 6481 passed, 1 skipped (6482) | 6481 passed, 1 skipped (6482) |
| 5 score-parser | 904 passed, 5 skipped (909) | 904 passed, 5 skipped (909) |
| 6 blurb | 178 passed (178) | 178 passed (178) |
| 7 integration | 159 passed (159) | 159 passed (159) |
| 8 ratchets | OK | OK |

All eight match. Caveat on honesty: gate 4 ran while I was creating new files outside the engine. Its count equals the baseline exactly, so none of them was collected.

## The test set (`tools/n200-score/fidelity-set.ts`, 113 lines, test 25 lines)

Built from the brief's recipe and the truths given as text. **The check passes: 323 takes carry the second pulse and 277 do not** (`fidelity-set.test.ts`). One DESK DEFAULT to confirm: the take index `k` is the combination's rank in the sorted order (0 to 11); if the original used another index the takes differ, and "the same 600 takes as the fidelity run" is NOT ESTABLISHED. The held-out settings (`HELD_OUT`: seeds 9000, 11000, factor from `rng(13000 + idx)` as 0.9 + 0.2 × first draw) are defined and unused until Step 3.

## The golden

`tools/n200-score/golden.run.ts` runs `runCapture` under `shipped` and `open` on the 600 primary takes and compares to `__golden__/shipped-open-600.json` (f1 and f2 to 0.1 Hz, confidence, reading, f2Quality, picker, outcome). `N200_GOLDEN=write` writes it. It was still being written when this commit was made; the file arrives in the next commit, before any engine change.

## Files touched against `scripts/ratchets.json`

None of the files touched has a ceiling. `tools/n200-score/vitest.config.ts` (not named in the brief's Owns) gained `fidelity-set.test.ts` and `golden.run.ts` in `include`, which the runner needs.

## Gap named (brief Step 0 item 4)

`apps/web/src/lib/analysis/__golden__/adapter-snapshots.json` holds no picker output (read by `adapter-golden.test.ts`), so it cannot serve as this golden.

## Not established

Whether Python's scipy was present on the desk's machine; here it was installed with pip. The golden's run time on this machine (long: 1,200 captures).
