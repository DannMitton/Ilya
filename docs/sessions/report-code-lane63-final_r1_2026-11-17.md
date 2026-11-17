# Report: lane 63, the eight gates and the Playwright suites (end of lane)

2026-11-17. Branch `cloud-lane-63`, from `Shane` `240fe5ab` plus this lane's five report-and-change commits (Steps 0 to 4). Run once, here, after Step 4. A fresh install (`pnpm install --frozen-lockfile`); working tree clean before the run.

## The eight gates

I took the eight to be the ship script's list in `docs/memory/ENVIRONMENT.md` ("Gate baselines"): phonology, dictionary, web-check, web-test, score-parser, blurb, integration, ratchets. The ship script is not in this container, so the numbering by name is my reading, not the script's. All eight exited 0.

| Gate | Command | Result |
|---|---|---|
| 1 phonology | `pnpm --filter @ilya/phonology test` | 14 files, 462 passed |
| 2 dictionary | `pnpm --filter @ilya/dictionary test` | 4 files, 248 passed |
| 3 web-check | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings, 5 files |
| 4 web-test | `pnpm --filter @ilya/web test` | 355 files, **6556 passed, 5 skipped (6561)** |
| 5 score-parser | `pnpm --filter @ilya/score-parser test` | 43 files, 904 passed, 5 skipped (909) |
| 6 blurb | `pnpm --filter @ilya/blurb test` | 5 files, 178 passed |
| 7 integration | `pnpm test:integration` | 7 files, 159 passed |
| 8 ratchets | `pnpm ratchets` | OK, 895 files checked |

Gate 4 against the baseline: this container has Python 3 and numpy but no scipy, so the baseline to compare is 6540 passed, 5 skipped. The count is 6556 passed, 5 skipped: **+16, the 16 tests this lane added** (13 in `note-picker.test.ts`, Step 1; 3 in `reveal-scroll.test.ts`, Step 2). The skipped count is the baseline's. I have no baseline for gates 1, 2, 5, 6, and 7 in this container, so I report their counts without a comparison.

## Playwright

`apps/web/node_modules/.bin/playwright test --trace off`, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, the dev server on 5173.

- `--project=chromium voice-pane voice-stations voice-links calibrate-new`: **70 passed** (16.9 min), none failed or flaky. I did not split the 70 by suite.
- `--project=phone voice-stations`: **4 passed** (34 s).

## What I could not establish

- The per-suite counts for the desk run.
- Gate 4 with Python, numpy, and scipy present (no scipy here), so the with-Python baseline of 6544 and 1 skipped is not checked.
- Lane 64's branch: I did not look at it, and have not merged anything. The two lanes' `tools/n200-score/vitest.config.ts` need a look at merge (Step 3 report).
