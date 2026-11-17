The scoring tool's changes (`PICKERS` gains `path`; the `path9_fR1` and `path9_fR2` columns; `N200_REF`) were committed and pushed in `bdb9b00`, before any synthetic run in this report. The bars below were committed before the first run.

# Report, N.200 path picker, Step 3: measurement, with bars written first

Cloud lane 62, branch `cloud-lane-62`. Brief `brief-code-n200-path-picker_r3_2026-11-16.md`, Step 3.

## Dann's takes

The desk runs them and holds the results outside the repository. Nothing in this report comes from a real voice.

## The bars, written before the first run

- **fR1 within 10 percent and fR2 within 12 percent of the truth, on at least 80 percent of the takes of each voice type.** Reading: each resonance's rate must reach 80 percent per type (DESK reading of "on at least 80 percent of takes per voice type"); the rate of takes in both bars is reported beside it.
- **Denominator:** every take generated, 120 per type. A take counts when `runCapture` gives a reading within the bar, whatever its status. A re-prompt or an error counts as a miss. A second table gives Captured readings only.
- **fR2 marked absent** counts as an fR2 miss in the main table. A second table leaves absent fR2 out.
- **"In both bars"** is judged on the path's fR1 and fR2 before the fR2 check.
- **Good takes flagged:** no more than 10 percent of takes in both bars may fall in case (b) or (d). Provisional by any cause is given beside it, with the shipped picker's figure on the same takes. Every status that moves, in both directions, is listed.
- **The keep-rule for the fR2 check (`f2Check`), on the held-out set:** the check passes when it marks fR2 absent on no more than 1 percent of takes whose path fR2 is in the bar, and marks absent at least half of the fR2 misses. With no fR2 misses, the first condition decides alone. The lane reports pass or fail and every table with `f2Check` on and off; it does not change the default.
- **Sensitivity (re-scored from the stored tracks without re-running Burg):** t = 1.0 and 1.5; m = 4 (k = 3m; it scales every ceiling's W alike). L9 beside L15 (Burg re-run at the L9 ceilings). A 5 ms step, once, on the primary set only.

## The settings of the held-out set, committed before its one run

Take seed `9000 + idx*20 + k`; permutation from `rng(11000 + idx*31 + 1)`; each cell's five truth frequencies multiplied by one factor, `0.90 + 0.20 × rng(13000 + idx)()` (the first draw). They are `HELD_OUT` in `tools/n200-score/fidelity-set.ts`, committed in `d173440` (Step 0). The held-out set is run once. A later commit (`bdb9b00`) fixed a type error elsewhere in that file; the settings did not change.

The truths are Ilya's own stand-ins (`engine/stand-ins.ts`), not a real voice. **Tenor and mezzo-soprano share one truth, so the set holds four distinct types**, and the five rows below count the same takes twice in two of them.
