# Brief to Code: the detector judges fry rhythm on medians (row 2d, part 2b)

From the desk, 2026-09-30 20:58. Answers Code's proposal in `report-code-guard-provisional_r1_2026-09-30.md` §Part 2. No git writes. Gates before and after.

## The ruling (DESK DEFAULT, reversible)

Build the proposal as written, both tests together:

1. **`c3` on the median inter-pulse interval**, band 12.5 to 50 ms unchanged.
2. **`c5` on median absolute deviation over the median**, limit **0.75**. JUDGEMENT: Dann's fourteen takes read 0.05 to 0.58; 0.75 leaves headroom above his [o] at 0.58 without approaching what `c3` already refuses. If the measurements below show 0.75 admitting anything that should be refused, set it lower and report the number and why.

Update the comment at `c5` in `detector.ts`, which already names this fix.

## DONE

- All fourteen of Dann's capture WAVs in `~/Downloads/ilya-capture-*-2026-09-30T23-3*` pass the detector, including the five refused first takes. Read in place; never copy them into the repository.
- The twelve speech windows and the noise controls from the last report are still refused. Name the test that refuses each.
- The synthetic suite and all eight gates pass. Report the before and after per take, and the new gate 4 count.

## Report

`docs/sessions/report-code-detector-median_r1_2026-09-30.md`. NOT ESTABLISHED beats a complete invented answer.
