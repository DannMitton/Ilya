# The catalogue of what TEXT, MELODY, and INSIGHTS share

r1, 2026-11-22, built by the desk. **This is a desk deliverable, not Dann's.** What is
his inside it is taste alone: where two documents could legitimately differ, which way
they go. Every number here was measured on a rendered page. None was read from source.

## What this is for

`CONTRACT.md` section 8 carries a bullet of mine that is half unexecutable: "every
difference an eye or a pixel diff finds is listed" returns hundreds of correct
differences between a page of staves and a page of prose. What the lane 80 failure
wanted is a record of WHICH properties the three documents hold in common. This file is
that record. A consistency brief names the properties it holds from this list, and its
done-when is those properties measured on the rendered pages at one size.

I did not build this when the rule was written. Dann asked at 05:22 on 2026-11-22 whose
responsibility it was to catalogue this, and it is mine.

## How it was measured

- Instrument: `javascript_tool` in Dann's Chrome against the branch alias
  `ilya-git-shane-dannmittons-projects.vercel.app`, numerically, by
  `getBoundingClientRect` and `getComputedStyle`. No screenshot was used as a source of
  a number.
- Build: the alias served `CACHE_VERSION` 1795335294159, which converts to
  2026-11-22T08:14:54Z, 40 seconds after `c470e03d` (N.208, row 204, lane 81). `Shane`
  at `99a8c0e4` is documents only and its build was skipped.
- Conditions: `innerWidth` 2428, `PageFit` scale 1 on all three documents, so these are
  the sheet's own pixels with no scaling to undo. Letter, 816 by 1056.
- Song: "3. Средь шумного бала", Dann's own library entry, English and French, page 1
  and page 2 of each document.
- Every value is in pixels measured from the sheet's own top left corner. `L` is the
  left edge, `T` the top edge, `W` the width, `H` the height, `R` the inset from the
  sheet's right edge, `B` the inset from its bottom edge.
- Dann's stored state was recorded before the measurement and restored after it:
  language `en`, active tab `markup`, the same song, the same open stations.

## The shared properties, measured

A property is in this table because all three documents are meant to hold it in common.
EQUAL means the three agree to the sub-pixel. The verdict column says what was measured,
not what the source intends.

| # | Property | TEXT | MELODY | INSIGHTS | Verdict |
|---|---|---|---|---|---|
| 1 | Sheet size | 816 × 1056 | 816 × 1056 | 816 × 1056 | EQUAL |
| 2 | Sheet ground | rgb(240,235,224) | rgb(240,235,224) | rgb(240,235,224) | EQUAL |
| 3 | Sheet padding | 0 | 0 | 0 | EQUAL |
| 4 | Title header block | L96 T47.99 W624 | L96 T47.99 W624 | L96 T47.99 W624 | EQUAL |
| 5 | Logo | L90 T47.99 W67.32 H26.22 | same | same | EQUAL, and it hangs 6 px left of the margin on all three |
| 6 | Song title top | T82.21 H33.6 | T82.21 H33.6 | T82.21 H33.6 | EQUAL |
| 7 | Metadata block top | T121.81 | T121.81 | T121.81 | EQUAL |
| 8 | Header rule | L96 W624 H0.56 | L96 W624 H0.56 | L96 W624 H0.56 | EQUAL in geometry; hue differs by document and is ruled |
| 9 | Gap under the header rule, page 1 | 15.84 | 15.53 en, 16.49 fr | 15.92 | WITHIN ONE PIXEL, spread 0.96. See the defect list |
| 10 | Gap under the header rule, page 2 | 15.85 | 15.85 | 15.85 | EQUAL |
| 11 | Content window left | L87.99 by design, first ink at 95.98 | L96 | L96 | EQUAL at the ink |
| 12 | Content window right inset | R96 | R96 | R96 | EQUAL |
| 13 | Content window top, page 2 | 88 | 88 | 87.99 | EQUAL |
| 14 | Gap above the footer | 16.48 | 16.48 | not bounded in CSS | DIFFERENT IN KIND. See the defect list |
| 15 | Footer block | L96 T942.48 W624 H65.53 B47.99 | identical | identical | EQUAL, both languages, both pages |
| 16 | Footer hairline | L96 T942.48 W624 H0.56 | identical | identical | EQUAL; hue differs by document and is ruled |
| 17 | Footer content row | L96 T951.03 W624 H56.98 | identical | identical | EQUAL |
| 18 | Attribution cell | L96 W518.01 | identical | identical | EQUAL |
| 19 | Pagination cell | L646.01 W73.99 | identical | identical | EQUAL |
| 20 | Page number | en L664.59 W55.41, fr L658.34 W61.66 | identical | identical | EQUAL within a language |
| 21 | Running header block, page 2 | L96 T47.99 W624 H24.15 | identical | identical | EQUAL |
| 22 | Running header line | L96 T47.99 W624 H19.6 | identical | identical | EQUAL |
| 23 | Running header underline | L96 T71.59 W624 H0.56 | identical | identical | EQUAL; hue differs and is ruled |
| 24 | Tab mark | T23.99 H19.6 R96 | T23.99 H19.6 R96 | T23.99 H19.6 R96 | EQUAL; its width follows its word |

The footer is the strongest result in the census: lines 15 to 20 are identical to the
sub-pixel across three documents, two languages, and two pages. That is Dann's ruling of
2026-11-21 22:12 holding.

## What differs legitimately, and why

These are not defects. A consistency brief does not list them as done-when items.

1. **The accent hue.** TEXT sage rgb(125,157,118), MELODY lavender rgb(159,133,188),
   INSIGHTS rose rgb(175,133,142), on the header rule, the footer hairline, the running
   header's underline, the logo, and the tab mark's ink. Ruled: the three documents each
   own a hue.
2. **The tab mark's width.** It is the word's width, right-aligned to the 96 margin: en
   TEXT 72.96, MELODY 44.34, INSIGHTS 53.16; fr TEXTE 95.59, CHANT 37.5, APERÇUS 50.69.
   The right edge is the shared property and it holds.
3. **The header's own height.** TEXT 127.16, MELODY 235.47, INSIGHTS 209.08 on page 1 in
   English. The header carries what each document carries, and the shared property is the
   gap under its rule, not its height.
4. **INSIGHTS' aside on page 1.** `title-header has-aside` narrows the song title and the
   metadata block to 536.01 en and 540.01 fr, against 624 on the other two. The header
   block is still L96 W624.
5. **The page count.** 3 pages on TEXT and MELODY, 6 on INSIGHTS in English and 7 in
   French. Content.
6. **The card's measure on INSIGHTS.** `.squircle` carries padding `16px 26px 5px`, so a
   sentence inside a card is set at about 570 against the column's 624. Lane 81 pulled
   INSIGHTS' top-level prose onto the column (`frame`, `verdict`, and `forward` all
   measure 623.99) and left the card's inside indented on purpose: `SingerBlock.svelte:434`
   records that the dashed marker hangs in the padding so the comment's text starts at
   123 with every other block in the card. The 570 figure Dann found at 02:20 was the
   card's inside, not the column.

## The defect list, from the rendered pages

Two items. Both are mine.

1. **INSIGHTS does not bound its window at the bottom.** TEXT and MELODY set a CSS
   `bottom` on their content layer, so the window closes `HEADER_GAP` above the footer and
   the measured gap is 16.48 on both. INSIGHTS' column at `InsightsPane.svelte:572` sets
   `top`, `left`, and `right` and no `bottom`, so its height is its content's height; the
   frame's bottom edge reaches INSIGHTS only through the capacity arithmetic at `:463`.
   The pages agree today because the arithmetic agrees. Nothing on the page holds them
   together. Measured: the column's foot sits 34.79 above the footer on page 1 and 30 on
   page 2, which is where its content ran out, not where its window ends.
2. **The gap under the header rule on page 1 spans 0.96 px.** MELODY 15.53 in English and
   16.49 in French, TEXT 15.84, INSIGHTS 15.92, against `HEADER_GAP` 16. Page 2 is 15.85
   on all three in both languages. The cause is sub-pixel header heights feeding
   `pageFrame`. It is under one pixel and no singer will see it; it is here because a
   catalogue that only lists what already agrees is not an instrument.

## What is not established

- **Print.** Every number here is the screen at `innerWidth` 2428. No print rendering was
  measured.
- **A phone.** `PageFit` scale was 1 throughout, so nothing here tests the scaled page.
- **Pages past the second**, and the last page of each document.
- **Another song.** One library entry was measured. A song whose MELODY carries NOTES
  would give the card measure on a second document; this one draws no `.squircle` on
  TEXT or MELODY.
- **The blank pages.** Lane 79 measured those (top edge 484.19, L96, W624 on all three)
  and I did not re-measure them tonight.

## How a brief uses this

A consistency brief names the rows it holds from the table, quotes Dann's words for the
ask it serves, and sets its done-when as those rows measured on the rendered pages at one
size. It does not say "the pages look consistent", and it does not take its list from a
source census. Source reading finds the cause of a difference. It never finds the
differences.

---
*Raw capture: `~/Downloads/ilya-frame-census-raw_2026-11-22.txt`, six blocks. Its block
headed MELODY holds a second INSIGHTS capture, which is my labelling error, caught by
reading each block's own `DOC=` line; the English MELODY numbers in this file were
re-measured afterwards and their block self-reports `DOC=MELODY`.*
