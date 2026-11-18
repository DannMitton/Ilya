# Report: lane 66, Step 4 (measure, before anything changes)

2026-11-18, Code (cloud session). Branch `cloud-lane-66`. The numbers and what they say: `docs/sessions/n200-lane66-step4-measure_2026-11-17.md` (file name as the brief gives it). Nothing in the app changed in this step.

## What was built (all under `tools/n200-score/`, in no gate)

- `lane66-core.ts`: pure code. The two counts, defined once (`judgedOutside`, `setAside`), the profiles from `path-600.json`, the cross-type run (`judgeGroups`, `outsideCases`), question (a) (`questionA`), question (b) (`subsetOf`, `moveCase`, `moveCases`, `questionB`, `bigMoves`), and the grid of both counts (`countsTable`). "Counts" is today's kept case, by `plausibilityOverride`.
- `lane66-folder.ts`: a folder of the recorder's files. The profile is, for each vowel, the last take whose `sung` is empty or equals `asked`, with the reading its sidecar stored; takes sung as another vowel are reported apart. It judges with the whole profile's anchors and says so in its output. The output goes to `<folder>-lane66-out/` beside the folder and refuses a folder whose output would land inside the repository.
- `lane66-measure.run.ts`: the runner. The golden run is by file name (`N200_LANE66_OUT=<file>` writes the tables); the folder run is started by `N200_LANE66_DIR` with the declared type in `N200_LANE66_TYPE`. It does not read `N200_DIR`, which starts `score.run.ts` and its Burg run (a test pins this).
- `vitest.config.ts`: the runner is registered, with its own variable; the header describes it; `lane66-core.test.ts` joins the two tests that run with no file name.
- `lane66-core.test.ts`: 14 tests: the declared list equals `TIER1`; the groups; the two counts on hand-built profiles; a cut of a profile; the folder's profile rule, stamp, and sidecar parsing; and the output beside the folder.

## Run

`pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts`: 3 files, 47 tests passed (the config's two older tests, 33 in all, and the 14 new). The golden run, by name: passed. The folder run on five synthetic sidecars written by hand in a scratch folder outside the repository: passed, wrote `summary.md` and `readings.csv` beside it, and read as the brief describes. It has not been run on real takes.

## For Step 5

The runner's grid table (`countsTable`) is the measure Step 5 reads again: today 72 judged outside and 72 set aside across the grid; after Step 5, set aside 0 and judged outside 72.
