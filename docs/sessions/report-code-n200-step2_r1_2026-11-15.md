# Report, N.200 Step 2: the scoring tool

Cloud lane 52, branch `cloud-lane-52`. Brief Step 2. Pure code; **one app change, an `export` keyword** (below).

## What exists

`tools/n200-score/` (outside `apps/web/src`, so no gate counts it; `tools/n168-frequency-run/` is the model):
- `vitest.config.ts`: aliases `$lib`; defines `__ILYA_RECORDER__` false and `__ILYA_BUILD__`. `tsx` is not installed, so it runs under vitest.
- `score-core.ts`: `decodeWav`; `candidatesFor`; `PICKERS` (one entry, `shipped`, which is `runCapture` exactly as the app calls it); `burgReference` (runs `tools/i-extractor-check/burg.py --json`, which shares no code with the app); `manualReferences` (a `reference.csv` of `file,fR1,fR2` in the folder, Dann's own reading, which takes the place of Burg's); `scoreFolder`; `tableCsv`; `summaryText`.
- `score.run.ts`: the folder run. `score-core.test.ts`: 10 tests (9 run, 1 is the folder run, skipped with no folder).
- App change: `engine/extract.ts:93`, `ltasEnvExport` is now `export`ed so the tool reads the same envelope the extractor reads (no behaviour change; Step 3 edits this file anyway).

## How to run (from the repository root)

```
N200_DIR=/path/to/unzipped/folder pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts score.run.ts
```
A path after `--` is read too. Output goes to `<folder>/n200-score-out/`, never into the repository: `table.csv`, `summary.txt`, `candidates.json`. Python 3 with numpy and scipy is needed for the Burg reference (`N200_NO_BURG=1` skips it). The recorder saves one ZIP; unzip it into a folder first.

## What each take gets

1. `runCapture` on the recorder's exact buffer, with its trace: the guard's stretch, the detector, the status.
2. Every candidate (`candidates.json`): envelope peaks from 150 to 3500 Hz down to 0.5 dB prominence with prominence and level; the closed-phase fit's every pole with bandwidth and the number of averaged stretches; the strongest level; the comb count (peaks of 3 dB or more under 3500 Hz). This is finer than any picker's floor, so thresholds can be compared offline.
3. One table row: file, asked, sung, kind (right, wrong, or unstated), build, the recorder's stored reading, then per picker fR1, fR2, status, `f2Quality`, confidence, method, split-half spread, whether the closed phase was set aside, a note for a take with no reading, and whether fR1 and fR2 fall within the bars (10% and 12%) of the reference; the comb count; the reference and its source.
4. `summary.txt`: per picker and kind, "n of m" within the bars, and captured, provisional, and no-reading counts. A take with no reference value is left out of that rate.

**Until Step 3 lands the tool runs the shipped picker only.** The table has one picker's columns; Step 3 adds `open` to `PICKERS` and the columns follow.

## Tests (`score-core.test.ts`, all from generator arguments, none from a picker's output)

`decodeWav` inverts the recorder's `wavBytes` to within one quantisation step. For synthetic [i] (290/2150), [u] (270/700), and [ɑ] (650/1050), the known fR1 (10%) and fR2 (12%) are each among the dumped envelope peaks or poles. One entry per picker with status and marks. A folder written in the recorder's own format: asked and sung and build read from the JSON, `sung` taken from the name when the JSON lacks it, `unstated` read as unknown, a manual reference taking precedence over Burg, the table header and row count, the summary. With python, numpy, and scipy present, Burg's reference on a synthetic [i] lies within 25% of the generator's fR1 (a wide bar on purpose: Burg reads open-phase frames too).

## A live run, on the real recorder output of Step 1

One take: a synthetic [u] (fR1 300, fR2 800, generator arguments) taken through the fake microphone in Chromium with [i] asked, recorded by the Step 1 recorder, unzipped, scored. Row as written: shipped fR1 300, fR2 2471.4, captured, `f2Quality` clear, high confidence, method closed-phase; Burg reference 285.7 and 800.3; fR1 within the bar, **fR2 not**. The candidate dump holds a closed-phase pole at 799.9 Hz with bandwidth 100.2 and an envelope peak at 808.6 Hz (3.4 dB prominence), so the right answer was among the candidates and the prior chose the 2472 Hz peak. One synthetic take; it shows the tool works end to end and shows the defect the brief describes, and says nothing about real fry.

## The eight gates after Step 2

462; 248; 0 errors, 12 warnings (5 files); 5751 passed, 1 skipped (5752), unchanged from Step 1 (the tool lives outside the gate's glob); 785, 5 skipped; 178; 159; ratchets OK (810 files).

## Could not establish

- Real fry through this tool: no real take has been scored. Dann's recordings are Step 4.
- That Burg's frame-wise median is a good reference on real fry with a closed vowel: the original `burg.py` header says it is a second opinion; the 25% bar in the test is not a validation.
- The Mac's Python: Dann's Mac needs numpy and scipy for the Burg column; not checked there.
