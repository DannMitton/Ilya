# Brief for Code: the printed metre, round 3: these editions' own figures (r3, 2026-10-09)

Written by the desk (Opus) 2026-10-09 about 02:25. For Code on the Mac, Opus. QUEUE row 57. **r3 replaces r2's section 3 only;** r2's sections on the singer, the rulings, section 4 (the rule and the join's order), the constraints, and "Done when" stand (`brief-code-the-metre-seen-and-summed_r2_2026-10-09.md`). **The final test (QUEUE row 55) waits for this row, by Dann's choice of 2026-10-09 02:19** (*"wait for round 3"*).

## Why

Your round 2 (`report-code-the-metre-seen-and-summed_r1_2026-10-09.md`) found that a reader built from the fonts' figures reads 3 of 32 printed signatures on the 17 songs, and gives figures not printed on rendered ones. Its cause (section 3.5): these editions print figures smaller and shaped unlike the fonts', nearer to flags and flats, and staff lines break their loops. Your report named the step that would change it: examples of these editions' own figures as templates. **The desk takes that step (a DESK DEFAULT, reversible).**

## What is established

- The reader you measured is at `docs/sessions/measure-metre-r57_2026-10-09/time-signature.ts` (moved there by the desk from `apps/web/src/lib/omr/`, unchanged, so nothing unimported sits in the app). Move it back when you build on it.
- Your harness and results are in your scratchpad (`m57/`).
- Row 37's table, completed in your report's section 3.4: 27 printed pairs and 5 Cs in the 17 songs.

## 1. Gather the examples

1. Every printed time signature you can find on **opened** pages: the 17 songs, and any other opened scan in the tree or in `~/Downloads` whose name does not begin `heldout2`. **Not A, B, C, E, or F:** they stay unseen, run once each through the drop box as before, never opened. List each source page.
2. Cut each figure and each C as the reader seats it, after line removal, at the scan's own staff space. Label it from the page, by eye, with a crop saved beside it.
3. The non-figures: your 2,051 seated scan marks, plus the fonts' signs from round 2.

## 2. Measure, held out song by song

1. Read each song's signatures with that song's own figures left out of the templates, so no song grades itself. Keep the fonts' figures in as well, or leave them out, whichever gives fewer false figures; report both.
2. The same three tables as round 2: rendered (fonts held out), the 32 printed places, and every other bar start on the 17 songs.
3. **The bar is still 0 false figures anywhere.** Report recall by figure and by song.

## 3. Then

If section 2 shows 0 false figures, build r2's section 4 on it (the seen-and-summed rule, in the order your report gave: state the seen figure first, run the tuplet checks under it, then sum), and meet r2's "Done when". The templates from these editions ship as features (numbers), as row 56's do; say the byte count.

If it shows any false figure, stop and report, as in round 2.

## Constraints

As r2. **Never open, read, list, or run anything whose name begins `heldout2`.** No git command that writes.

## Report back

`docs/sessions/report-code-the-metre-seen-and-summed_r2_2026-10-09.md`: the examples (count by figure and by source), section 2's tables first, then what was built or why not, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set QUEUE row 57, say so in one line, and stop.
