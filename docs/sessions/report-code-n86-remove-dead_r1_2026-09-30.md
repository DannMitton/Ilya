# Report: N.86, remove three dead items

Written by Code 2026-09-30, for `brief-code-n86-remove-dead_r1_2026-09-28.md` (`QUEUE.md` row 3). Read against branch `Shane` at `6d87638`, working tree dirty with row 2c's work and this one. Nothing committed.

**Two of the three are removed. The third, `tools/e16-harness/_rhythm_spike/`, is not: the check in step 1 found a live reference, and the brief says to stop on any hit.**

## Step 1: the reference check

Command, run from the repository root once per term, with `node_modules`, `.git`, `.svelte-kit`, `build`, `dist`, `test-results`, and the gitignored `*.tsbuildinfo` left out:

```
grep -rlaI --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.svelte-kit --exclude-dir=build --exclude-dir=dist --exclude-dir=test-results --exclude=*.tsbuildinfo "<term>" .
```

Hits outside `docs/`, which hold prose only:

| Term | Hits outside `docs/` | Verdict |
|---|---|---|
| `TextualWitnesses` | `apps/web/src/lib/score/reconciliation/witnesses.ts:4`, a comment ("TextualWitnesses.svelte renders this") | Prose. Removed. |
| `renderer-output` | `packages/score-parser/src/index.ts:27`, the barrel export the brief names; `types.ts:512` and `:625`, comments ("the renderer-output pipeline") | The export was expected. Removed. |
| `generateRendererMusicXml` | `packages/score-parser/src/index.ts:11` and `:27` only | No caller anywhere. Removed. |
| `_rhythm_spike` | `tools/e16-harness/verify_toolchain.py:10-11`, `:200-201`, `:294`; `tools/e16-harness/e16_scratch_2026-07-28/gate02_legacy_p01p1.py:3`; `tools/e16-harness/.gitignore:6` | **Live. Stopped.** |

**Why `_rhythm_spike/` is live.** `verify_toolchain.py` is the E.16 toolchain pin, and it is tracked. Its docstring says every F1, precision, recall, and metre-accuracy figure the project has recorded was produced by `_rhythm_spike/scorer_local.ts` via `_rhythm_spike/score_rng.ts`. It pins both files by MD5 (`:200-201`), and its negative control copies the tree and flips a byte in `_rhythm_spike/scorer_local.ts` (`:294`). Deleting the folder makes `verify_toolchain.verify()` fail on two missing pinned files and makes the negative control raise on `open()`. `gate02_legacy_p01p1.py:3` also says its output is scored by `_rhythm_spike/score_rng.ts`.

The N.86 audit (`n86-dead-code_r1_2026-09-28.md`, row for `_rhythm_spike/`) read `run-harness.ts:32` and found it imports `./scorer`, not the spike, and said the other hits were "only prose in three docs". The `.py` references were not in its search.

**DESK DEFAULT, to rule:** leave `_rhythm_spike/` in place. To remove it later, `verify_toolchain.py` first needs its two pins and its negative control moved to `src/scorer.ts`, or the pin retired, which is a harness decision under E.16's own law (`verify_toolchain.py:1-40`).

## Step 2: removed

Ordinary file deletion, no git command. Copies of both files are in the session scratchpad, and `git show HEAD:<path>` restores either.

| Path | Lines |
|---|---|
| `apps/web/src/lib/score/TextualWitnesses.svelte` | 197 |
| `packages/score-parser/src/renderer-output.ts` | 122 |
| `packages/score-parser/src/index.ts`, the export line and its line in the header comment | 2 |
| **Total** | **321** |

## Step 3: `reconciliation/` untouched

`apps/web/src/lib/score/reconciliation/` is unchanged (`CONTRACT.md` §6). Its `witnesses.ts:4` comment still says `TextualWitnesses.svelte` renders it; that is now stale, and I left it because the folder is not mine to edit. No tool flagged the folder: gate 8 (ratchets) is OK, and knip was not run.

## Step 4: `ARCHITECTURE.md`

It names none of the three items. No change.

## Also stale, left alone

`packages/score-parser/src/types.ts:512` and `:625` still say fields are "preserved verbatim for the renderer-output pipeline". The words describe why the data is kept, and removing a file is not a reason to rewrite a type's comment unasked. **DESK DEFAULT:** leave them.

## Proof

- `npx tsc --noEmit -p packages/score-parser`: exit 0.
- The eight gates, with the scratch copy of `ilya-ship.sh` described in `report-code-calibration-first-moments_r1_2026-09-30.md`: gates 1, 2, 3, 5, 6, 7, and 8 at baseline; gate 4 at 1739, row 2c's seven tests and nothing from this row.
- Playwright, `pnpm test:e2e` (chromium): **28 passed (3.0m)**.

## What I could not establish

- **Whether any E.16 run still calls `verify_toolchain.py`.** It is tracked and referenced by `scratch_status.py` and a scratch README, but I did not run it and did not find a gate that does.
- **knip** was not run, so I cannot say whether it now flags `reconciliation/` as unused.
