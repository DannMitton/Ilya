# Report: lane 63, Step 3 (the scoring tool's config)

2026-11-17. Branch `cloud-lane-63`. Not a gate. Files changed: `tools/n200-score/vitest.config.ts` and `tools/n200-score/burg-check.run.ts` only. No other runner touched (lane 64 owns them).

## What changed

- `vitest.config.ts`: `include` is now `[...TESTS, ...runners]`. `TESTS` is `fidelity-set.test.ts` and `score-core.test.ts`, always. `runners` is each `*.run.ts` in the `RUNNERS` table whose file name appears in a non-flag argument of `process.argv` (substring match, so a path to the file works), or whose variable is set:
  - `score.run.ts`: `N200_DIR`
  - `synth-gate.run.ts`: `N200_SYNTH_OUT`
  - `golden.run.ts`: `N200_GOLDEN`
  - `burg-check.run.ts`, `measure.run.ts`, `measure-report.run.ts`: by file name only.
- The header now lists every runner, what it does, and how to start it, and says that a bare command runs only the two tests.
- `burg-check.run.ts`: the test takes `ctx`; where `havePython` (`burg-fixtures.ts:18`) is false it writes the reason to stderr and calls `ctx.skip(reason)`. The header says so. Python-present behaviour is untouched.

## Two decisions the desk may want to overrule

1. **The measure pair is by file name only.** The brief says a runner is listed "when its file name is on the command line or its variable is set". `measure.run.ts` and `measure-report.run.ts` read the same variables (`N200_SET`, `N200_OUT`), so a variable test would load both whenever either was set, and `measure-report.run.ts` reads the rows the other writes. Every documented command for them names the file. `burg-check.run.ts` has no variable at all.
2. **The reason is written with `writeSync(2, ...)`.** With `ctx.skip(reason)` alone, or a `console.log` before it, the default reporter prints "1 skipped" and no reason (vitest 4.1.6 here); `--reporter=verbose` shows it. Writing to file descriptor 2 prints under the default reporter. This is the only way I found; I did not look for another.

## Established

- `process.argv` is visible to the config (Step 0), and the file-name filter reaches it. Checked with `vitest list --filesOnly --config <cfg>` (apps/web, `node_modules/.bin/vitest`):
  - no argument: `fidelity-set.test.ts`, `score-core.test.ts`;
  - `golden.run.ts`: `golden.run.ts` alone;
  - `../../tools/n200-score/measure.run.ts`: `measure.run.ts`;
  - `N200_DIR=/nonexistent` and no file name: the two tests and `score.run.ts`;
  - the filter `score` (not a whole file name): `score-core.test.ts` only.
- The same `list` through `pnpm --filter @ilya/web exec vitest list ... golden.run.ts` finished in under 60 s with the same answer, so argv passes through `pnpm exec`, and it did not hang here (the 2026-11-16 note says it did in the desk's workspace).
- Unfiltered `vitest run --config <cfg>`: Test Files 2 passed (2); Tests 15 passed, 1 skipped (16). I did not check which test is the skipped one; it is in one of the two files, which I did not change.
- `burg-check.run.ts` named, in this container (Python 3 and numpy, no scipy): prints "burg-check.run.ts SKIPPED: it needs python3 with numpy and scipy ...", Tests 1 skipped.

## What I could not establish

- `burg-check.run.ts` with Python, numpy, and scipy present: this container has no scipy. The branch that runs is the one the file had; I added only the `ctx` argument and the guard line.
- The other runners' behaviour (`score.run.ts` with a folder, `synth-gate.run.ts`, `golden.run.ts`, the measure pair): I did not run them. `golden.run.ts` takes about 468 s and is lane 64's.
- Lane 64 runs at the same time and may add or rename a runner. The header and `RUNNERS` list the six runners on `240fe5ab`; a merge of both lanes needs a look at that table.
