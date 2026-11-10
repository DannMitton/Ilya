# Report: step B-1, the eight gates' baselines (Code, cloud lane 43, r1, 2026-11-10)

Branch `cloud-lane-43`, from `origin/cloud-lane-38` at `534d9981`. Working tree clean before the first commit of the lane (the six-file docs commit, which carries five files: see "What I could not establish"). Run by me, on this Linux sandbox, after `pnpm install --frozen-lockfile`.

| gate | command | result |
|---|---|---|
| 1 | `pnpm test:phonology` | 456 passed |
| 2 | `pnpm test:dictionary` | 248 passed |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings (5 files) |
| 4 | `pnpm --filter @ilya/web test` | 4707 passed, 1 skipped (256 files; 305 s) |
| 5 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped |
| 6 | `pnpm test:blurb` | 168 passed |
| 7 | `pnpm test:integration` | 125 passed |
| 8 | `pnpm ratchets` | OK (701 source files) |

These are the desk's own figures of 2026-11-09 21:5x (456; 248; 0 errors 12 warnings; 4707 + 1 skipped; 785 + 5 skipped; 168; 125; OK). Nothing moved between the desk's workspace and this sandbox.

**Ceilings that bind this lane** (from `scripts/ratchets.json`, read): `routes/+page.svelte` 5534 lines, `score/Loupe.svelte` 3012, `score/CorrectionSurface.svelte` 1227. Each is at its ceiling today, so every change to one of them is net zero or negative, and new logic goes in a new module. A new unlisted file may hold 1000 lines.

**Gate 4 takes five minutes.** I run it in the background after each step and run the focused tests between.

## What I could not establish

- Whether gate 4's baseline run counted two files I wrote during it (`rebar.test.ts` was created about four minutes after it started). The count, 4707, equals the desk's, so I take it to have been the clean tree.
- The Playwright projects' baselines: not yet run. They are run after B3, T1, T2, and A2, and the first run is the baseline for the first failure I would otherwise be unable to attribute. I will report the pre-change run in the B3 report if the project can start here.
