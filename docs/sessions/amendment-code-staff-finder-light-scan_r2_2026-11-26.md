# Amendment r2 to the staff finder brief: the three decisions, measured and amended

2026-11-26, desk. **Supersedes r1** (md5 `8c0e6a8545ae655c4ac1fddc2cc9c8dd`). Amends
`brief-code-staff-finder-light-scan_r2_2026-11-25.md`. Reviews: `review-fable-brief-staff-finder_r1_2026-11-25.md`
and **`review-fable-amendment-staff-finder_r1_2026-11-26.md`** (md5 `7b1151023af187e5c75952fc8ae8cc3b`), which
re-ran part of 0d on the saved rasters rather than trusting the record. Step 0c is reported in
`report-code-staff-finder-light-scan-0c_r1_2026-11-26.md`.

**All three decisions STAND, each with amendments. Nothing here is a new design; it is the record made true.**

## What changed since r1, and it is the reason for this revision

1. **A staff found today IS lost at the provisional pair.** r1 said none was. `underlay-prepare.ts:214-218` runs
   `staffIn` on every box, piano included, and song2 p1 box 5, a grand staff, is found at 140 and 0.45 and null at
   206-scale level 229 and ceiling 0.65. The lane's own `song2-p1.sweep2.json` and Fable's re-run agree.
   **DESK DEFAULT, Dann's to overrule: the loss is accepted and named, not avoided by moving the pair.** Its one
   consumer was measured: `underlay-band.ts:136-138` into `underlay-below.ts:66-67` returns 4473.0 with the box and
   4473.0 with null. A grand-staff piano box is out of scope by decision 1, and moving the pair to keep it would
   put the pair on the window's edge, which brief r2 step 2 forbids.
2. **`topLineBelow` moves 78.8 px on a control page, and r1 omitted it.** song2 box 0 goes 1607.5 to 1528.8 under
   decisions 2 and 3 together (`underlay-below.ts:52`, `:75`), which lifts the lyric band's lower edge by 2.7 staff
   spaces (`underlay-band.ts:101`). Two strips return a line three staff spaces above the piano's true top line,
   and two agreeing strips is the whole guard at `:52`. **Whether a row of words is lost is NOT ESTABLISHED, and
   step 0e below settles it before step 1 builds anything.**
3. **Decision 3's ground in r1 was wrong.** The song2 end repair comes from `lineRows`'s level, not `extent`'s:
   with `extent` held at 140 on the new samples song2 box 0 already ends at 3933. The real reason `extent` must
   take the page level is that `lineRows` does, and holding `extent` at 140 breaks song1 (box 0 ends at 3668
   against 4017 shipped; box 2 starts at 681 against 525). `metre-windows.ts:181-182`, `:207-208`, `:214-216`.
4. **"Corrects an error that has been shipping" is false of one staff.** song1 box 2's `x0` goes 525 to 572, and
   the rules start near 527, so 572 sits inside the treble clef. No harm was found on that staff; the sentence is
   withdrawn as a general claim.

## The three decisions, as they now stand

1. **The done-when counts voice boxes**, by the tree's own `voiceBoxes` (`metre-model.ts:93-111`), not by the
   harness's "under 300 px tall". Grand-staff piano boxes are out of scope.
2. **`strokes` and `meanInk` keep the shipped level 140 in this lane;** the page-relative glyph level is
   `QUEUE.md` row 218. **This does not hold the bar lines still:** over twenty control staves, sixteen are
   unchanged, three gain one, and Without Sun p6 box 6 loses its final bar line with `x0` and `x1` unchanged,
   because `strokes` reads its rows from lines found at the new level. Name that in the report.
3. **`extent` takes the page-relative level**, on the ground in point 3 above.

## Step 0e, new, and it runs before step 1. Keeps nothing

Look at song2's first system and report `cutRows` before and after decisions 2 and 3 together, with the rows
printed. **If a row of words is lost, stop and report; step 1 does not start.** This is the ledger-line fault the
module's own doc names at `underlay-below.ts:22-25`.

Also in 0e, because 0d carried no such column: run `readPageMetres` on the twenty control staves before and after,
and list any metre verdict that flips. Bar-line columns shift 1 to 3 px and `bandOf`'s centre (`metre-windows.ts:426`)
moves about one pixel of height.

## The done-when, in numbers

Brief r2 step 2's counts are replaced. **"9 of 9 on Without Sun page 5" never counted anything `staffIn` returns;
shipped is 4 of 6 boxes.**

- **16 of 16 voice boxes on Nightingale page 4** (homr's total: 16).
- **4 of 4 voice boxes on song1 page 1** (homr's total: 8, four of them grand-staff).
- **3 of 3 voice boxes on Without Sun page 5** (homr's total: 6).
- Each with the lane's own count printed beside homr's.
- **No voice box is lost on any swept page.** Every box of either kind that changes state is listed with its
  direction. Known today: song2 p1 box 5 lost (accepted above), Without Sun p5 box 3 and p6 box 7 gained.
- The margins are measured on voice-box regions, and a pair on a page's edge still does not ship.

## Step 1, amended

- **Brief r2 step 1's done-when cannot be met as written** under decision 2: `metre-windows.ts` still holds the
  shipped constant for `strokes` and `meanInk`. It reads instead: no page-wide ink constant governs `lineRows` or
  `extent`, and the level arrives as an argument to both.
- **Pass one object with two named fields**, the rule level and the glyph level, rather than two bare numbers, so
  a reader cannot be given the wrong one. There is no cross-level comparison and no cached binary image
  (`:67-69`, `:78`, `:163`, `:263`, `:294`), so the split is safe; the guard is against a later swap.
- **Add one mid-grey test page.** Every existing test page is two-tone and passes with the levels swapped, so the
  current suite cannot catch that swap.
- `topLineBelow` (`underlay-below.ts:75`) calls `lineRows` and `fives`, so it inherits the rule level. That is the
  move 0e measures.

## Tests, read and reported by Fable, not run

- `underlay-prepare.test.ts:263` paints words at 215, which become ink at that page's level 220. By reading,
  `:264-265` still pass, on a margin of five grey levels. **Run it early.**
- `underlay-below.test.ts:59-92`'s single-staff pages are 0.83 per cent ink, which puts the level at 255; strict
  less-than keeps them passing, and a blank page gives 255, not NaN.
- The only direct pins on `extent` are `metre-windows.test.ts:38-39`.

## Every consumer of `x0` and `x1`, with the move applied

`metre-windows.ts:284`, `:348`, `:359`, `:367`, `:369` into `:377`, `:426`; `underlay-band.ts:59`;
`underlay-below.ts:69-71`; `metre.worker.ts:44-46` into `metre-witness.ts:134-136`. None outside `lib/omr/`. The
expected effect of 89 to 133 px is one more bar line where the final bar line comes into range (song1 box 0,
song2 boxes 0 and 4). No courtesy flag flips; the tails were computed.

## Housekeeping

Copy `~/Downloads/_desk-staffin-2026-11-25/work/code-lane/step0d_p1_085_065.txt` into
`docs/sessions/measure-staff-finder-light-scan_2026-11-25/`, because row 218 and r1 both point at figures that
live only in `Downloads`. Add a sparse page to the held-out set: the 1st percentile tracks ink coverage, so song1
cut to one system moves the level 229 to 242 and Nightingale page 4 cut to one staff moves it 206 to 220. Both are
still found; it is a caution, not a fault.

## Corrections to the record, both the desk's

- **`mac-staff-finder` is one commit behind `Shane`, not two.** r1 said two. `Shane` is `b14d94b3` and its parent
  is `1c9cc741`, which is where that branch sits.
- **`hasStaves`'s call sites are `ScoreUploader.svelte:215` and `first-staved-page.ts:102`.**
  `ScoreUploader.svelte:67` is the import, and the desk carried it from brief r2 without opening it. Step 0c found
  this; brief r2 and r1 of this amendment both carry the wrong line.
- **Step 1 cannot be cut from `b14d94b3` and carry this work.** The amendment, the 0c report, and the `step0c-*`
  scripts are untracked, so the day's records ship before the lane branch is cut.

## What the agent could not establish

**NOT ESTABLISHED beats a complete invented answer.**

- Whether the 78.8 px move costs song2 a row of words. **Step 0e settles it.**
- Whether any metre verdict flips on a control page. **Step 0e settles it.**
- Whether page 4's bar lines under decisions 2 and 3 include false ones; truth exists for box 1 only, three true
  and none false.
- "14 of 20 control staves" at a glyph level and "8 true bars" on page 4 box 1, both from the stopped session.
- That the saved rasters are what the browser produces (0a's md5 `5bb97b1e`). Everything re-measured rests on it,
  and step 0c re-rendered page 4 and got the same bytes.
