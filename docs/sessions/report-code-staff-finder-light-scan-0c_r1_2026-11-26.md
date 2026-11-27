# Report r1: step 0c of the staff finder lane, the other ink sites on Nightingale page 4

2026-11-26, Code, Mac, on `Shane` at `b14d94b3` with uncommitted files under `docs/`. Answers step 0c of
`brief-code-staff-finder-light-scan_r2_2026-11-25.md`, as set out in
`amendment-code-staff-finder-light-scan_r1_2026-11-26.md`. Step 0c alone ran. Step 1 has not started.

`git diff -- apps packages scripts third_party` is empty. The tree's functions ran at their shipped constants.
Where a figure is marked **diagnostic**, it comes from a generated copy of a module at another level, or from an
option the function already takes.

## What the figures stand on

- **The page** is step 0a's saved raster, md5 `5bb97b1e`, 4400 × 5500. A fresh `rasterizePdf` of page 4 gives
  the same bytes.
- **homr ran again** on that raster (WASM) for its MusicXML. Its 16 boxes equal step 0a's.
- **Staves.** The shipped finder returns 0 of 16, so `profiles`, `cutRatio`, the staff-line removal's truth, and
  `inkProfile` have nothing to stand on today. They were measured on the staves that the provisional pair finds
  (level 206, ceiling 0.65, `extent` at 206, `strokes` and `meanInk` at 140): 16 of 16, staff space 18.9 to
  19.8 px. `scratch.ts` regenerated from the tree is identical to the saved copy.

All files named here are in `measure-staff-finder-light-scan_2026-11-25/`.

## The page, as looked at

16 voice staves and no piano staff. Seven printed 2/4 signatures, one at the start of each verse. No C and no cut
C. No tuplet number. One numeral, a 7 over a multi-bar rest at the end of the fourth staff. 32 underlay lines
(Russian over German), six «(Refrain wie bei Vers 1.)» lines, one «Allegro.», and the publisher's line.

## Verdict on the desk's reading

| site | returns on page 4 | the look | verdict |
|---|---|---|---|
| `profiles`, `metre-reader.ts:333`, ink at `:348` | no uncovered ink at all seven signatures (`[[0,0],[0,0]]`) | nothing printed beside any signature in the seats | **holds on this page**, on a thin margin |
| `cutRatio`, `:416`, ink at `:427` | never called; 0.000 when forced onto the 2/4 marks | no C or cut C | **NOT ESTABLISHED** |
| `staffSpace`, `tuplet-number.ts:72-99`, ink at `:83` | null for 112 of 129 bars, 11 px for 14, 19 px for 3 | 18.9 to 19.8 px | **does not hold: confirmed** |
| staff-line removal, ink at `:149` | five-line staff found for 0 of 129 bars | five lines at every one | **does not hold**, for two causes |
| `inkProfile`, `underlay-rows.ts:97-102` | 41 rows over 16 systems | 40 text lines | **holds** as an ink test; the band above it clips the Russian |
| `hasStaves`, `staff-detect.ts:33` | false | 16 staves | **does not hold** |

## 1. `profiles` and `cutRatio` (`step0c-print.out.txt`, `step0c-sites.out.txt`)

`profiles` catches each signature's dark core: runs of 12 to 23 page px, where the digits span about 25 to 30 px
by eye (`step0c-sigs.mjs`). The digits are not far under the cut. Of the digit pixels darker than 170, 49 per
cent are also under 128; their median greys are 121 to 146.

No signature on this page has ink beside it that should void it. Whether `profiles` catches such ink at this
paleness is therefore NOT ESTABLISHED.

**The whole metre reader on the candidate staves** states 2/4 at 6 of the 7 signatures and states nothing at the
other 67 of 74 windows. The miss is the first staff of verse 5: 3 of its 9 readings state 2/4, so `decide`
returns before either ink site runs. Today the reader reads 0 windows and counts 16 staves unfound.

**This bears on `QUEUE.md` row 218.** All seven printed signatures stand at a system start, and a start window
needs no bar line. On page 4, the staff finder alone yields 6 of the 7. The bar-line shortfall that step 0d
measured remains, and a signature printed mid-system depends on it; this page prints none.

## 2. `staffSpace` and the staff-line removal (`step0c-sites.out.txt`)

| positions asked | `staffSpace` at 140 | at 206 (diagnostic) |
|---|---|---|
| every bar with notes, 129 | null 112, 11 px 14, 19 px 3 | non-null 129; within 1.5 px of its staff 110 |
| bars the join asks about today, 1 | null | 19 px |
| bars it asks about with the metres seen, 7 | null 7 | 19 px at 7 |
| four placed positions on each staff, page 4 | null on 16 of 16 | right on 14 of 16 |

The same placed positions on seven control pages give the right space on 20 of 20 staves at 140 (song1 to song4,
Without Sun pages 4 to 6).

No tuplet number is read on page 4 at either level, and none is printed. Today a null leaves the bar as homr wrote
it, so no wrong output was observed.

**The removal at `:149` fails for a second reason.** It finds no staff at 140, and none at 206 either, even when it
is handed the true space. The rules are about 8 px thick at levels 190 to 206, and the removal cuts only strokes
of at most `max(2, round(0.22 × space))`, which is 4 px here (`:168`). Raising the ink level alone does not repair
it. The removal is also incomplete on the controls at 140: it finds the five lines on 3 of 3, 3 of 3, and 3 of 4
staves on Without Sun, and on 2 of 4, 1 of 3, 0 of 1, and 0 of 2 on song1 to song4.

## 3. `inkProfile`, through `cutRows` and `bandInk` (`step0c-sites.out.txt`, `step0c-overlay.mjs`)

16 systems, with all 383 voice notes assigned. The paper reads 224 to 227, so ink is under 164 to 167.

All 32 underlay lines come out as separate rows. The six refrain lines, «Allegro.», and the publisher's line make
40 text rows. The 41st row holds no text: it is the tops of the ornaments over the fourth staff, at the foot of the
third staff's band (y 1672 to 1682).

**The band's top edge cuts the Russian line.** In all 16 systems the first row starts within 1 px of the band's
top. On the six systems looked at (counting from 0: 0, 4, 6, 8, 12, and 14), the edge takes about a quarter to a
third off the capitals and removes the breve of «й» where there is one (`step0c-bandtop.mjs`). The cause is
`MARGIN = 1.5` staff spaces under the staff (`underlay-band.ts:27`), not an ink level. The row crops come out of
the band, so the cut part of a letter is not in the crop that the OCR reads. It bears on the words road that step 3
reports on, and it is outside this lane's rule. The OCR did not run, so what it reads from these crops is NOT
ESTABLISHED. Filed as `QUEUE.md` row 224; the finding in section 4 is row 225.

## 4. `hasStaves` (`step0c-print.out.txt`, `step0c-sites.out.txt`)

False on page 4, and false on all six pages of the PDF. The darkest row of page 4 is 0.107 ink across the page
against a gate of 0.4. **Diagnostic**, through the function's own `darkThreshold`: still false at 175, true from
180.

- **As a PDF**, the score still reaches the reader, because it has no usable text layer. `routePdf` returns
  `to: 'reader', stavesFound: false`.
- **As a picture**, `ScoreUploader.svelte:215` sends a page that fails this check to the poem route, so the staff
  finder never runs. This lane does not change that. The measurement used the saved page PNG. That the picture
  path leaves grey pixels unchanged is read from `page-image.ts`, not run. What a phone photograph of the page
  returns is NOT ESTABLISHED.

## Corrections to the record

- The amendment says that `mac-staff-finder` is two commits behind `Shane`. Git shows one (`b14d94b3`), and the
  branch holds no commit of its own.
- The brief cites `ScoreUploader.svelte:67` for `hasStaves`. Line 67 is the import. The calls are at
  `ScoreUploader.svelte:215` (pictures) and `first-staved-page.ts:102` (PDFs).

## Not established

- `cutRatio` on a light scan.
- Whether `profiles` voids on light ink beside a signature.
- The join across the whole six-page song. Page 4 ran alone.
- `underlay-frame.ts` (`INK_BELOW = 128`), which step 0c does not name.
- Fable's view of the amendment's decision 3, which the staves here assume.

## Before step 1

**Step 1 needs a lane branch cut from `Shane`.** No branch was cut, and no writing git command ran. A branch cut
from `b14d94b3` holds none of the uncommitted files, including the amendment, this report, and the `step0c-*`
files, until they are committed.

## To run it again

With the dev server on port 5173, and with `W` as `~/Downloads/_desk-staffin-2026-11-25/work/code-lane`:

1. `node step0c-browser.mjs "$W/nightingale-p4.png" <the PDF> "$W/step0c-p4"`
2. `node step0c-staves.mts "$W"`
3. `node step0c-metre.mjs "$W"`
4. `bash step0c-run.sh "$W" <a temporary folder>`
5. `python3 -I step0c-print.py "$W"`
