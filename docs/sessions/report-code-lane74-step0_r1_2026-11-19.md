# Report, lane 74, step 0: the baseline

2026-11-20 (the file name carries the brief's date). Branch `cloud-lane-74`. `git log -1` reads `20c9a48` ("Lane 74 brief r3, and the picker's borrowing note ratified EN and FR"), the child of `ca2a4e5`. `git diff --stat ca2a4e5b HEAD -- apps packages scripts` prints nothing, so no source line differs from the cut the brief names. `git status --short` was empty before any change. Dependencies: `pnpm install --frozen-lockfile`, exit 0.

## The eight gates, on the untouched tree

| Gate | Command | Result |
| --- | --- | --- |
| 1 phonology | `pnpm --filter @ilya/phonology test` | `Tests  462 passed (462)`, 14 files |
| 2 dictionary | `pnpm --filter @ilya/dictionary test` | `Tests  248 passed (248)`, 4 files |
| 3 web check | `pnpm --filter @ilya/web check` | `svelte-check found 0 errors and 12 warnings in 5 files` |
| 4 web test | `pnpm --filter @ilya/web test` | `Tests  6723 passed \| 5 skipped (6728)`, 363 files, 266 s |
| 5 score-parser | `pnpm --filter @ilya/score-parser test` | `Tests  904 passed \| 5 skipped (909)`, 43 files |
| 6 blurb | `pnpm --filter @ilya/blurb test` | `Tests  178 passed (178)`, 5 files |
| 7 integration | `pnpm run test:integration` | `Tests  159 passed (159)`, 7 files |
| 8 ratchets | `pnpm run ratchets` | `ratchets: OK.` (905 source files checked) |

The list and order of the eight gates is lane 71's (`report-code-lane71-step0_r1_2026-11-19.md`, section 2). The ship script is not in this sandbox.

## Gate 4

The brief names two baselines: `6727 passed | 1 skipped (6728)` with numpy and scipy, and `6723 passed | 5 skipped (6728)` without scipy. This sandbox read the second: `python3 -c "import numpy"` succeeds and `python3 -c "import scipy"` prints `ModuleNotFoundError: No module named 'scipy'`. I read both commands' output. I did not read how `havePython` in `burg.test.ts` is computed, so that scipy is the cause of the four extra skips is NOT ESTABLISHED here, as lane 71 also recorded. The total (6728) matches both forms. The brief's instruction is met: I read the second figure, so I am on the no-scipy path and nothing is wrong.

## One difference from the brief's own ledger, reported not acted on

Gate 8 prints `905 source files checked`. Lane 71's step 0 recorded 904 on its tree. The brief does not state a file count, so no brief claim is contradicted. The difference is one file, and lane 71's tree was an earlier cut.

## Playwright baseline

Started on a pristine `git archive HEAD` copy of the tree (so this lane's edits cannot reach it), both projects, one worker, `--trace off`. Its result is reported in step 7, beside the post-change run, because the two are read together.

## What this step changed

Nothing under `apps/`, `packages/`, or `docs/memory/`. This report is the only file added.
