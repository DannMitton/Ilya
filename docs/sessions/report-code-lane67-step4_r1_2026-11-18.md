# Report: lane 67, Step 4 (the measure, on the untouched engine)

2026-11-18, Code (cloud session), branch `cloud-lane-67`. Nothing in the product changed.

## What was done

- `tools/n200-score/lane67-core.ts` (pure code): the tract scale (brief section 2), three estimators (`shape`: the `middle` template times the scale; `declared`: the declared type's template times the scale; `fit`: the tree's own `fillStandIns` through `resolveVowelValues`), the leave-one-out over the six core vowels, the odd-[i] moves, and the median and nearest-rank 90th-percentile tables.
- `tools/n200-score/lane67-core.test.ts`: 7 tests (scale is 1 on the shape and the ratio on a scaled shape; a sung vowel with no usable fR2 counts in fR1's mean only; NaN with none sung; shape and declared are exact on a template voice; the fit's stand-in; the two statistics). 7 passed.
- `tools/n200-score/lane67-measure.run.ts` and two lines in `tools/n200-score/vitest.config.ts` (the test and the runner, by file name only). The tool is in no gate.
- The report: `docs/sessions/n200-lane67-step4-measure_2026-11-18.md`. Its first lines are the sentence the brief fixes.

## Result in one line each (the report has the tables)

- 54 of 60 synthetic profiles hold all six core readings: 324 cuts, each estimated three ways.
- `declared` is exact by construction (fR1 median 0.09 st); `shape` differs from it by 0.53 st median (bass 0.79), 0.98 st at p90; the fit sits between (0.33).
- One odd [i]: `shape` and `declared` move a missing vowel by 2.23 st median and 2.74 st at most; the fit by 0.10 st median in fR1 and up to 18.64 st.

## Comments corrected

None; no existing code changed.

## What could not be established

Whether real voices differ from `middle` as Bozeman's staves do; why the fit's tail reaches 18.64 st (not traced); the held-out and third sets (not run). Gate counts are not re-run here (tool tests are in no gate).
