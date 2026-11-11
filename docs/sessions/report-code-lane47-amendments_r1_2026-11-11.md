# Report: lane 43's amendments, then the merge with Shane (Code, cloud lane 47, r1, 2026-11-11)

Branch `cloud-lane-47`, cut from `origin/cloud-lane-43` at `68cfb9c4`. Brief: `docs/sessions/brief-code-lane43-amendments_r2_2026-11-10.md` (read from `Shane` at `47284e24`), with the two Fable reviews it names. Written step by step; each step is its own commit.

## Step 0: reading and baseline

Read in full: the brief; `review-fable-lane43-as-built_r1`; `review-fable-lane43-amendments-brief_r1`; `report-code-barline-ts-handover_r1`; `rebar-notes.ts` and `rebar-notes.test.ts`; `correction-verbs.svelte.ts:325-445`; `rebar.ts:150-200, 320-345`. The brief's "LANE 43 AS BUILT" rulings in `OPEN.md` are not on this branch and were not read; I used the brief's own quotation of them.

Baseline, working tree clean at `68cfb9c4`, run on the Mac that holds the repository:

| gate | command | result |
|---|---|---|
| 1 | `pnpm test:phonology` | 456 passed |
| 2 | `pnpm test:dictionary` | 248 passed |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings (5 files) |
| 4 | `pnpm --filter @ilya/web test` | 4796 passed, 1 skipped (266 files) |
| 5 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped |
| 6 | `pnpm test:blurb` | 168 passed |
| 7 | `pnpm test:integration` | 125 passed |
| 8 | `pnpm ratchets` | OK (719 source files) |

These equal the lane's own handover figures.

## What I could not establish (step 0)

- Playwright baselines: not run yet; step 8.
- The `OPEN.md` sections "BARLINE AND TIME SIGNATURE TOOLS" and "LANE 43 AS BUILT": not on this branch.
