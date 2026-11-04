# Report, row 177, step 0 (r1), 2026-11-02: the eight gates on the cut

Lane: `cloud-lane-30`, cut from `origin/Shane` at `21a050374f962db615d5f8c23816e03630110b74` (read with `git log` after `git checkout -B`; the working tree was clean at the start and `pnpm install --frozen-lockfile` changed no tracked file). No source file was changed in this step. Nothing under `docs/memory/` was touched. Neither `Shane` nor `main` is pushed, and no pull request is opened.

## Read, in full, this session

- `docs/sessions/brief-code-row177-scan-slur_r2_2026-11-02.md` (54 lines).
- `docs/sessions/review-fable-row177-and-pw-r2_r1_2026-11-02.md` (151 lines). Part 1 amendments A1 to A8 are the ones r2 carries; r2's text and the review's text agree where I compared them (A1 to A8 against steps 1 to 4 and the measure).
- `docs/memory/CONTRACT.md` (158 lines), including sections 0 to 0.2 and 4 as asked.

## The eight gates

The brief does not list the eight or give expected counts. I took the list from `docs/sessions/report-code-n135-row-fallback_r1_2026-10-29.md` (section 8) and the web count from `docs/memory/STATE.md` (row 176 ship: gate 4 is 3898 passed plus 1 skipped).

| # | Gate | Result on the cut |
|---|---|---|
| 1 | `pnpm test:phonology` | 407 passed (13 files) |
| 2 | `pnpm test:dictionary` | 248 passed (4 files) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | **3898 passed, 1 skipped** (222 files) |
| 5 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped (35 files) |
| 6 | `pnpm test:blurb` | 148 passed (2 files) |
| 7 | `pnpm test:integration` | 98 passed (6 files) |
| 8 | `pnpm ratchets` | OK |

Gate 4 equals the count STATE.md records for the shipped row 176 tree. The other seven have no expected number in the brief or in STATE.md that I read; the figures above are the baseline for steps 1 to 4. Gates 1, 6, and 7 differ from the 2026-10-29 report's 291, 145, and 55, which is expected: that report is four days older, and I did not trace which commits moved them. Ratchets printed "can be lowered" lines for several files (among them `Drawer.svelte`, `LearnContent.svelte`, `Loupe.svelte`, `pairings.ts`, `CalibrationWizard.svelte`, `+page.svelte`, `staff-renderer.ts`); none is in a file this row touches yet.

## NOT ESTABLISHED

- Playwright is not one of the eight gates and was not run.
- Why gates 1, 6, and 7 moved from the 2026-10-29 counts: not traced.
