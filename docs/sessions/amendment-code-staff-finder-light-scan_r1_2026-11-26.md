# Amendment r1 to the staff finder brief: where the lane stands, and the three decisions it runs under

2026-11-26, desk. Amends `brief-code-staff-finder-light-scan_r2_2026-11-25.md` (reviewed:
`review-fable-brief-staff-finder_r1_2026-11-25.md`). **This file exists because the lane's own findings and the
desk's amendment of 2026-11-25 18:2x were recorded only in `docs/memory/STATE.md` and in a Code session that has
since stopped.** Everything below is transcribed from that record by the desk on 2026-11-26. **It is the previous
desk's record of the lane's reports, not a fresh measurement**, so a figure that decides anything is re-checked
cheaply before it is built on.

## The branch

**Re-cut the lane from `Shane`.** `mac-staff-finder` sits at `1c9cc741`, two commits behind `Shane`, which is now
`b14d94b3` (N.225, the ribbon lane). Do not resume on the old branch.

## What the lane has already done: step 0a, 0b, 0d

**0a.** The browser's own raster through `rasterizePdf` and Playwright gives Nightingale page 4 at 4400 × 5500,
md5 `5bb97b1e`, paper tone 227, local paper 225, 1st percentile 89, rule greys 174, 180 and 185, and homr's 16
boxes. The Python renders reproduce it exactly.

**0b.** The rule swept is `level = anchor + u × (paperTone − anchor)`. With the anchor at the 1st percentile every
page passes at u 0.76 to 0.93 with the ceiling 0.60 to 0.75, against u 0.76 to 0.85 at the shipped ceiling 0.45,
so **the shipped ceiling sits on the edge of the window**. **Provisional pair: anchor at the 1st percentile,
u = 0.85, ceiling 0.65**, which is level 206 on page 4. No staff found today is lost at u 0.85.

**0d, and it is why this lane delivers less than one lane.** No single ink level serves both the rule finder and
the bar-line reader. On page 4, box 1, against 8 true bars counted from crops, the reader finds 3 at the shipped
level and 7 plus a false hit at the finder's level; a separate page-relative glyph level reads the page but costs
14 of 20 control staves their bar lines. **So the metre on a light scan is a second repair with its own row**
(`QUEUE.md`, row 218), not part of this lane.

**A repair 0d found, and the lane looked at the page to confirm it:** at the new level `extent` moves 89 px on
song1 and 133 px on song2. The shipped level stops song2's staff at 3802, where the rules fade; the real end is
the bar line at 3935. **The page-relative level corrects an error that has been shipping.**

**Two errors in the brief, the desk's own:** its done-when counts of "12 of 12" and "9 of 9" count staves, taken
from a helper's report without checking, when homr returns boxes, four single-staff plus four grand-staff on
song1 page 1; and the brief never put the grand-staff piano boxes out of scope.

## The three decisions this lane runs under. Desk amendment of 2026-11-25 18:2x, all reversible

1. **The done-when counts voice boxes**, with the lane's own count printed beside homr's. Grand-staff piano boxes
   are out of scope.
2. **`strokes` and `meanInk` keep the shipped level in this lane.** The page-relative glyph level is row 218 and
   is not built here, because no single level serves both readers (0d).
3. **`extent` takes the new level**, on the strength of the repair above.

These three were sent to the running session on 2026-11-25 and **have not had a Fable review**. Decision 3 reaches
the code, so the desk is putting it to Fable while this lane runs the step below, which keeps nothing.

## What is next, in order

**0c, and it keeps nothing.** Report what the four other ink sites return on page 4, with no change to any of them,
exactly as brief r2's step 0c sets out: `profiles` (`metre-reader.ts:333`, ink at `:348`), `cutRatio` (`:416`, ink
at `:427`), `staffSpace` (`tuplet-number.ts:72-99`, ink at `:83`) with the staff-line removal at `:149`,
`inkProfile` (`underlay-rows.ts:97-102`), and `hasStaves` through `darkThreshold` (`reader/staff-detect.ts:33`,
used at `score/ScoreUploader.svelte:67`). The desk's reading, to confirm or refute: the metre reader's two act on
dark glyph ink and hold, and `staffSpace` does not.

**Then steps 1, 2 and 3 of brief r2, unchanged**, under the three decisions above.

## Start warm

The previous session's harness is on disk at `docs/sessions/measure-staff-finder-light-scan_2026-11-25/`
(`sweep.mts`, `sweep2.mts`, `step0d.mts`, `stepbars.mts`, `raster.mjs`, `togray.mjs`, `crop.mjs`, `analyse2.mjs`,
`table.mjs`, `fig0a.py`, `runall.sh`, and two scratch files). Read it before rebuilding any of it.

## What the agent could not establish

**NOT ESTABLISHED beats a complete invented answer.**

- Every figure in this file is the previous desk's record of the lane's reports, not a measurement made today.
- Whether the Code session that produced them left anything beyond the harness folder.
