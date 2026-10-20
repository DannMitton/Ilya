# Report: row 141, a tacet run is packed whole, and a system is measured as it is drawn

Branch `cloud-lane-12`, after row 133 (`5e441ac`). Brief: batch A r2, row 141.

## The cause

`layoutColumns` (`packages/score-parser/src/staff-renderer.ts`, the `runs` filter, now `:1658`) kept a tacet run only when it lay wholly inside the asked range (`r.fromMeasure >= fromMeasure && r.toMeasure <= toMeasure`). `sliceWidth` asks it about a range of the unsliced score; the render asks `tacetRuns` of the SLICE (`sliceScore`), which sees a run the range cuts as a shorter run of its own. A range ending inside a run was therefore measured without the run and drawn with it. Both symptoms follow, and I confirmed it on my reproduction score:

1. The packer (`paginateScore`) added one measure at a time, and a partial run measured as nothing, so a system could close inside a run (the run drawn as 4 and then 2, or 6 and then 1).
2. The same blindness made the packed range wider in the render than in `sliceWidth` (the system with its end cut off).

Evidence on the pre-fix code, on a 109-bar score built to the brief (below): `sliceWidth(18, 27)` equalled `sliceWidth(18, 21)` (873.2 both), so the run of indices 22 to 27 counted for nothing; at page width 700 the pictured system of bars 63 to 67 rendered 789.2 wide on a 700 line; at 700 and 760 the run of bars 66 to 68 fell across two systems. The review's reading, a single cause, holds for what I measured.

## The diff, by file and line

- `packages/score-parser/src/tacet-run.ts` (new): `clipRun(run, from, to)` clips a run to the range as the slice sees it; `unitEnd(runs, measure)` is the last measure of a packing unit (a whole run, or the measure alone).
- `packages/score-parser/src/staff-renderer.ts` (3432, 3430 after row 129, now 3429; ceiling lowered): the `runs` filter at `:1658` keeps any run that overlaps the range and clips it (one line, from three); the import at `:56`.
- `packages/score-parser/src/page-layout.ts` (the packing loop, about `:262-282`): the packer extends by units, so a system never ends inside a run; a run too wide for a fresh system goes alone (the first unit is always taken). Imports `tacetRuns` and `unitEnd`.
- `packages/score-parser/src/row141-tacet-run.test.ts` (new, 11 tests).
- `scripts/ratchets.json`: `staff-renderer.ts` 3430 to 3429.

No repack guard (DESK DEFAULT). Vertical spacing is untouched.

## Tests

The 109-bar 3/4 score in A major, treble, empty in bars 1 to 6, 23 to 29, 66 to 68, and 104 to 109, three quarters or a half and a quarter elsewhere. At page widths 640, 700, 760, and 816 with margins 0: each tacet run lies in exactly one system, whole; no rendered system is wider than its line. The packer's width of a range equals the render's natural width for the ranges 18 to 27, 18 to 25, 24 to 30, 62 to 66, 62 to 67, and 100 to 106 (indices). I ran the new tests against the old source: widths 700 and 760, the clipped-run test, and four of the six natural-width cases fail there; width 640 and 816 and the other two cases pass there. So my score reproduces the desk's second case (700, 760) but **not the first (816, indices 18 to 27 rendering 923 wide)** at the page width; the clipped-run test reproduces that range's miss directly.

## Gates

phonology 267, dictionary 248, blurb 145, integration 55, web-test 2884 (2884), web-check 0 errors and 12 warnings, score-parser 774 passed and 5 skipped (779) (763 plus 11), ratchets OK.

## Pictures

`docs/sessions/batch-a-shots/row141-{before,after}-{1440,390}.png`: the systems around bars 57 to 71 at page width 700, drawn by `paginateScore` on that score, in Finale Maestro, scaled to the viewport width. Before: bars 63 to 67 run past the 700 line with the rest cut off at the right, and bars 68 to 71 begin with a one-bar rest. After: bars 66 to 70 are one system, the rest whole, every system 700 wide. The pictures are the renderer's SVG, not the web page.

## Shared numbers

A range's width is computed by `sliceWidth` (`page-layout.ts`), which sums `layoutColumns`'s advances, and by the render, `renderAnalyzedStaff` (`staff-renderer.ts`, which calls `layoutColumns` on the slice at `:1945` in the old numbering). They now agree for ranges that end or begin inside a run: that agreement is what lets the packer trust `sliceWidth` to keep a system within its line. Other callers of `renderSystemSlice`: `apps/web/src/lib/score/loupe-render.ts:91` (one measure) and `:267` (a range). A single measure is a range of one: a tacet measure drawn alone is a run of one, as before; I did not run the loupe on a range across a run, so what `:267` draws there is not established.

## Could not establish

- The desk's 816 px case (indices 18 to 27 rendering 923 wide) on song 2 itself: I do not have the file, and my built score does not hit it at page width 816.
- That a real score's page count is unchanged: I ran no real score through the new packer. Packing by units can move a system break (a run that does not fit moves whole to the next system), which can change page breaks.
- The loupe's range render across a run (`loupe-render.ts:267`).
- `meterDeclaredAt` inside a clipped run: the slice keeps only its first measure's meter, so a meter change in the middle of a run the range cuts is not modelled by `clipRun`; no test covers it.
- The web app's page was not rendered; the pictures are of the SVG.
