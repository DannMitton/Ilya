# Report: N.135 stage 2b r5, step 0, the underlay stamp (Code, cloud lane, 2026-10-29, r1)

Branch `cloud-lane-21`, cut from `origin/Shane` at `b57410da`, with `origin/cloud-lane-19` (`383187a7`) merged in. Working tree clean before the step; one commit for the step.

## The answer first

1. `UNDERLAY_READER` is now `'underlay@1'` (`apps/web/src/lib/omr/stamp.ts:45`), and the comment above it, which called version `0` "not wired", is rewritten (`stamp.ts:29-44`). A reading kept with the switch on as stage 2b was first built (`...+underlay@0`) is no longer current under the switch (`isCurrent` compares by equality, `omr/restore.ts:40`), so it is read again once.
2. `omr/stamp.test.ts:22-25` passes unchanged (read in the run below).
3. One test added, with its mutant: `omr/underlay-switch.test.ts`, "is read again when it was kept with the switch on under stage 2b as first built, underlay@0". With `UNDERLAY_READER` set back to `'underlay@0'` it fails (run, then restored).
4. The merge tree is **`2c239db2abfa1da2f337aaf81cf90061674f44f3`, not `59eba6a7`.** Why: `Shane` is at `b57410da`, not at `1e4750e5`. `git diff --name-only 1e4750e b57410d` lists eleven files, all under `docs/` (five in `docs/memory/`, six in `docs/sessions/`), so no source file differs between the two `Shane` commits. I cannot run `git cat-file` on `59eba6a7` here (the object is not in this clone), so that the code of the two trees is equal is read from the diff, not from the tree hash. The merge had no conflicts (`git merge --no-ff origin/cloud-lane-19`, no conflict output; the brief expects auto-merges in `omr/restore.ts` and `omr/scan.ts`; I did not list which files git auto-merged, so NOT ESTABLISHED that they are those two).

## Baseline: all eight gates on the merge, before step 0

Measured with `pnpm install --frozen-lockfile` first. Expectation written before the run: gates 1 to 3 and 5 to 8 equal the brief's strings; gate 4 rises above 3404 by the stage 2b tests the merge brings. Likeliest failure: a gate string differing by an environment effect.

| gate | command | brief's string on `Shane` `b57410da` | measured on the merge |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 291 passed (291) | 291 passed (291) |
| 2 | `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) |
| 3 | `pnpm --filter @ilya/web check` | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 3404 passed \| 1 skipped (3405) | **3552 passed \| 1 skipped (3553)** (+148, stage 2b's tests) |
| 5 | `pnpm --filter @ilya/score-parser test` | 775 passed \| 5 skipped (780) | 775 passed \| 5 skipped (780) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | ratchets: OK. | ratchets: OK. |

## After step 0

Gate 4 is **3553 passed | 1 skipped (3554)** (+1, the new test). Gates 1 to 3 and 5 to 8 are as above, unchanged.

## Departures and what I did not do

- The replay on A2's captures (`tools/cells.mjs`, the scorer, `step4.mjs`) is in the desk's `~/Downloads`, which this cloud lane does not have. I cannot run the section 8 replay. Every replay figure in my reports is the brief's, marked as such, and the desk's replay of my build is the check.
- The brief's gate 4 baseline string (`3404 | 1 (3405)`) is for `Shane`; the merge adds stage 2b's tests, as the brief says (section 2).

## Files

`apps/web/src/lib/omr/stamp.ts`, `apps/web/src/lib/omr/underlay-switch.test.ts`, this report.
