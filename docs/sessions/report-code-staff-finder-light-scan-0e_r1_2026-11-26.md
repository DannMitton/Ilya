# Report r1: step 0e of the staff finder lane, song2's lyric rows and the control metres

2026-11-26, Code, Mac, on `Shane` at `b14d94b3` with uncommitted files under `docs/`. Answers step 0e of
`amendment-code-staff-finder-light-scan_r2_2026-11-26.md`. Step 0e alone ran. Step 1 has not started.

**No row of words is lost, and no metre verdict flips.**

`git diff -- apps packages scripts third_party` is empty.

## What was compared

- **Before:** the shipped constants (ink 140, ceiling 0.45).
- **After:** decisions 2 and 3 together. `lineRows` and `extent` take the page level, the ceiling is 0.65, and
  `strokes` and `meanInk` stay at 140. The level is 217 to 233 on the seven control pages, and 229 on song2.
- **Staves and `topLineBelow`** come from `scratch.ts` and `scratch-below.ts`. Everything downstream is the tree's.
- **Inputs.** A fresh `rasterizePdf` of each of the seven pages gives the saved raster's bytes, and homr's boxes
  equal the saved ones (`step0e-homr.out.txt`).
- **The "before" is the tree's behaviour.** On song2, the bands and row tops equal the tree's `prepareUnderlay`. On
  all seven pages, the repeated metre loop equals the tree's `readPageMetres` window for window.

All files named here are in `measure-staff-finder-light-scan_2026-11-25/`.

## 1. song2 page 1, first system (`step0e-song2.out.txt`, `step0e-overlay.mjs`)

The system holds one line of words, «Дай-те бо-». Page pixels, staff space 29.

| | before | after |
|---|---|---|
| `topLineBelow` | 1607.5 | 1528.8 |
| band | y 1250 to 1564, 10.8 spaces | y 1249 to 1485, 8.1 spaces |
| rows from `cutRows` | 3 | 2 |

| row | what the page shows there | before: crop y; ink y | after: crop y; ink y |
|---|---|---|---|
| 0 | the words, lower half | 1250 to 1279; 1250 to 1270 | 1249 to 1279; 1249 to 1270 |
| 1 | the piano's «8» line | 1369 to 1432; 1378 to 1423 | 1369 to 1432; 1378 to 1423 |
| 2 | ledger-line notes over the piano's upper staff | 1483 to 1564; 1492 to 1563 | gone |

**The row that goes holds no words.** The move drops the tops of the piano's high chords out of the band.

The other two systems keep three rows each. Their band edges move by 0 to 4 px, and the last row of the third
system ends 4 px higher (y 4428 against 4432). Those two systems were measured and not looked at.

### The words on this system are already cut, before and after

The band's top edge (y 1250 shipped, 1249 after) runs through the middle of «Дай-те бо-». About the top half of the
letters is outside the band, and the breve of «й» is outside it entirely (`step0e-words.mjs`). **This happens today
at the shipped constants.** It is the fault in `QUEUE.md` row 224, on a second page.

**A correction to the 0c report and to row 224.** Both say that the cut part of a letter is not in the crop that the
OCR reads. That holds for the first look only. Where a system gives no Russian row, `underlay-reader.ts:132-138`
looks again, and the `wide` look raises the top edge by one staff space (`underlay-looks.ts:35-44`), which on this
system reaches y 1220 and takes in the whole line. A cut row that still passes as Russian gets no second look. The
OCR did not run, so which happens here is NOT ESTABLISHED. Row 224 was corrected the same day; the 0c report's
sentence stands as written.

## 2. `readPageMetres` on the twenty control staves (`step0e-compare.out.txt`)

`voiceBoxes` picks 20 staves on the seven pages, the same twenty that the harness picked by height: 4 on song1 and 3
on Without Sun page 5, among them.

| | before | after |
|---|---|---|
| voice staves unfound | 0 | 0 |
| windows read | 83 | 85 |
| signatures stated | 3 | 3 |

- **Flips: none.** 82 windows pair up. None changes its verdict, its reason for stating nothing, or its courtesy
  flag.
- **The three signatures are the same:** 4/4 on song1 box 0, 3/4 on song2 box 0, and C on Without Sun page 5 box 0,
  each at its system start.
- **Three windows are new**, after a final bar line that comes into range: song1 box 0 at x 4103, and song2 boxes 0
  and 4 at x 3933 and 3951. Each is flagged courtesy and states nothing.
- **One window is gone:** Without Sun page 6 box 6, after the final bar line that the staff loses (x 3516). It stated
  nothing before.
- **One start window moves 47 px**, on song1 box 2 (x 525 to 572). It states nothing on both sides.

Bar lines on the twenty: 16 staves keep their count, 3 gain one, and Without Sun page 6 box 6 loses one. That
matches the amendment. So do the boxes that change state (`step0e-staves.out.txt`): song2 box 5 lost, Without Sun
page 5 box 3 and page 6 box 7 gained.

## Not established

- What the OCR reads from the first system, before or after.
- The metre on any light scan under these two columns. Page 4 is in the 0c report.
- Whether the verdicts hold at another pair. Only level `anchor + 0.85 × (paper − anchor)` and ceiling 0.65 ran.

## Not done

The amendment's housekeeping did not run: the copy of `step0d_p1_085_065.txt` into the harness folder, and the
sparse page for the held-out set.

## To run it again

With the dev server on port 5173, and with `W` as `~/Downloads/_desk-staffin-2026-11-25/work/code-lane`:

1. `node step0e-homr.mjs "$W" song1-p1 song2-p1 song3-p1 song4-p1 withoutsun-p4 withoutsun-p5 withoutsun-p6`
2. `bash step0e-run.sh step0e-song2.mts "$W" <a temporary folder>`
3. `node step0e-overlay.mjs "$W" <overlay.png> <rows.png>`, then `node step0e-words.mjs "$W" <words.png>`
4. `node step0e-staves.mts "$W"`
5. `node step0e-metre.mjs "$W"`
6. `python3 -I step0e-compare.py "$W"`
