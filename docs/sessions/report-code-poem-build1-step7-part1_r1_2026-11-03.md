# Report: poem library build 1, step 7, part 1, the page fit (Code cloud lane, r1, 2026-11-04)

Brief: `brief-code-poem-library-build1-step7_r4_2026-11-03.md`, Part 1, with Fable's `review-fable-poem-build1-step7_r1_` (14 amendments) and `_r2_` (12), and `desk-probe-and-sum.diff`. Branch `cloud-lane-31`, on top of the merge `39c42c9` and its report.

## Diagnosis first (r1 amendment 1), measured in a browser on the Tchaikovsky song

A scratch probe (not committed) read the page as drawn, on the tree as it stood after the merge, then with the desk's two-line sum fix alone:

| | Tree after the merge | Sum fix alone (padding counted, gap floored) |
|---|---|---|
| Title header | 127 px | 127 px |
| Content window | top 191, bottom 920: 729 px | the same |
| Row gap drawn | 19 px | 18 px |
| Rows on page 1 | 10, each 56 px, ink 1.4 px below the box | 10, each 56.3 px, ink 1.1 px below |
| Footer | **90 px**, top at 918, the legend «ё stress» at 918 | the same |
| Content against the footer | **7.4 px into it** | **1.1 px into it** |

The arithmetic holds to the digit: ten rows of 56 plus nine gaps of 19 plus the window's 4 px `padding-top` is 735 px in a 729 px window, and the ink adds 1.4: 7.4. With the fix, 10 x 56.3 + 9 x 18 + 4 = 729, and the ink adds 1.1. **So the sum was most of it, the ink the rest, and the footer a third, separate fault**: the footer is 90 px with a one-row legend, against the 80 px both Text pages reserved, so the legend's top (918) stood above the window's bottom edge (920). The same 90 px footer is there with and without the poem, because the song's own words carry the legend (declined, the page showed the same footer and had 56 px to spare only because its one long line wrapped to fewer rows than were budgeted).

**Later pages overran too, which the step 6 fixtures did not show.** Run against the old components, my new tests (below) report page 2 and page 3 of a 36-line song 7.1 px into the footer, and page 1 11.4 px: the fixed 28 px gap and the constant 80 (r2 case 3).

## What was built

| File | State |
|---|---|
| `lib/page-fit.ts` | new, 261 lines, **pure**: `fitRows`, `slicePages`, `contentHeight`, `pieceKey`, `estimateMetrics`, `FALLBACK_FIT` |
| `lib/components/Paper/TextFitProbe.svelte` | new, 129 lines: the one DOM measurement (wrap counts, cut points, the row's height and overhang) |
| `lib/components/Paper/Paper.svelte` | 141 to 250 lines: holds the measurements, the footer reserve, the loop; passes each page its window and gap |
| `lib/components/Paper/TitlePage.svelte`, `SubsequentPage.svelte` | no `rowConfig`, no `FOOTER_MAX_HEIGHT`, no `subsequentRowGap`, no `onbudgetchange`: they take `contentTop`, `contentBottom`, `rowGap` and report their header's height |
| `lib/page-config.ts` | `sliceLinesToPages`, `rowsOf`, `WORDS_PER_ROW`, `LINES_PER_PAGE` removed; `TEXT_CONTENT` and `contentWidth` added |
| `lib/page-fit.test.ts` | new, 32 tests; replaces `text-pages.test.ts` (its cases that still hold are kept) |
| `e2e/pages-without-gaps.test.ts` | +6 tests |

## The design, against the amendments

- **One pure slicer, one `fitRows` for every page** (r2 amendment 3; r1 amendment 4). `slicePages` takes lines, a measurement per piece, and each page's window, and returns pages with their rows and gap. Page 1 and later pages differ only in the header height that sets the window, so the constant 28 px gap and `LINES_PER_PAGE` are gone. `fitRows` is Dann's rule: ten rows, nine or eight when the gap falls below 18, the gap floored, capped at 28. The cut leaves at least two rows on each side, at a point where the browser wrapped the line (`rowStarts`).
- **The structural guard against a measure loop** (r2 amendment 1). Nothing a page measures depends on how the lines are sliced, except the wrap counts of the pieces, which are thrown away when the lines change. The footer reserve is **one** hidden `PageFooter` rendered with the legend and the Richter credit of the **whole** document's lines (`Paper.svelte:88`), measured by its own `onheightchange` and reserved on every page, as `Math.max(FOOTER_MAX_HEIGHT, measured)` (`:77`), the N.83 precedent (`MarkupPane.svelte`), so a short footer reserves what it reserved. The real footers do not report; a unit test fails if they do. A page still draws its own legend. DESK DEFAULT, as r2 says: a page without the legend carries up to one legend row of slack.
- **Wrap counts and cut points, not heights in place** (r2 amendment 2). `TextFitProbe` renders each requested line once, at the content width (`contentWidth`, 628 at letter) with a row gap of 0, and reads the visual rows and which displayed word each begins with. The pure slicer then adds the page's own gap. From one-row lines it reads the row's drawn height and its overhang. A phone's scale transform is read back and divided out.
- **When it measures** (r2 amendment 6). The probe is `visibility: hidden`, fixed, zero high, never `display: none` on screen, and hidden in print. It is mounted only while there is something to measure. It waits for `document.fonts.ready` (`TextFitProbe.svelte:52`), and `Paper` measures again when the fonts arrive (`Paper.svelte:104`) and whenever the lines, language, stress diacritics, page size, notation preferences, gloss overrides or spot reconstitution change. Until a line is measured it is sliced by the old seven-words-a-row guess, so a page is never blank; the guess is now only that, and is replaced by the first measurement.
- **The loop is capped and reports** (r1 amendment 4). `MAX_MEASURE_CYCLES = 8` (`Paper.svelte:73`); at the cap it writes one `console.warn`. A tail of a cut line is measured as its own piece, because its first row is wider than a continuation row and can wrap to fewer rows than were left. **Convergence observed:** on the Tchaikovsky song the probe ran 3 batches (the whole lines, a cut tail, the later pages' lines) before the slice asked for nothing more; a unit test with a stand-in browser settles in at most 6 and checks the slice is then a fixed point.
- **The ink, and the `GAP`** (r2 amendment 4). The probe reads child element boxes, not glyphs. The dashed "verify" box is a pseudo-element about 5 px below its word that no rectangle sees; the 8 px `GAP` in the window's bottom margin is what keeps it off the footer, and the comment at the top of `page-fit.ts` says so.
- **The posterity comment** (brief; r2 amendment 9) is at the top of `page-fit.ts`, and cites the brief, the four measured facts (the window that ignored its own 4 px padding and a rounded gap; a row draws 56.3 px, not 56; the overhang of 1.1 px; the footer of 90 px against a reserved 80) and N.83 as the first instance of the rule. `Paper.svelte`, `TitlePage.svelte` and `SubsequentPage.svelte` each carry a short comment pointing to it.

**One more measured fact, which the brief's numbers do not have:** on the page as it now draws, a row is **57.4 px with 0 overhang** (the probe and the page agree on it). The desk's 56.3 px with 1.1 px is the same 57.4 px split differently; which part is "box" and which "ink" changes with the state the page is in, which is the reason to measure them as drawn. The model uses the probe's own numbers, so it follows whichever the page draws.

## Print and screen (r1 amendment 5), with lines

The sheet is `{dims.width}px` by `{dims.height}px` on every display (`TitlePage.svelte:85`, `SubsequentPage.svelte:65`: 816 by 1056 at letter), and the print rules change colour and shadow only (`TitlePage.svelte:189-197`, `SubsequentPage.svelte:124-128`; `WordStack.svelte` print block). So a wrap count taken on screen holds on paper, provided the same fonts are loaded, which the `fonts.ready` wait covers. The measurement is a layout measurement (`offsetWidth`, rectangles with the scale divided out), which a CSS transform does not change, so the phone's fit does not move it: **measured on a phone-sized touch viewport, the Tchaikovsky page 1 was nine rows at a 24 px gap, as on the desk.** The e2e tests read both `screen` and `print` media (`overlaps`, `pages-without-gaps.test.ts`).

## What page 1 lands on for the Tchaikovsky poem (r2 amendment 5; for Dann)

By Dann's rule, from true heights (row 57.4 px, overhang 0, padding 4):

| Footer | Content window | Rows | Gap |
|---|---|---|---|
| With the one-row legend (90 px, as it is) | 719 px | **9** | **24 px** |
| With no legend (66 px footer, reserve floored at 80) | 729 px | **9** | **26 px** |

Observed in the browser with the legend: nine rows at a gap of 24, as above (`DIAG`), and three pages for the poem. **The 18 px minimum gap stays (Dann 2026-11-03 20:34).** Ten rows would need a gap of 15.7 px with the legend and 16.8 px without, so lowering the floor to 17 would not restore ten rows either; I report it and change nothing. The old page's ten rows were an overrun, not a layout.

## Tests (r1 amendment 6; the brief)

Unit, `page-fit.test.ts` (32): the arithmetic of the old overrun (735 px against 729, plus 1.4: the 7.4 of step 6) and of the desk's fix (1.1); `fitRows` on every window from 300 to 1100 px (gap floored, at most 28, at least 18 above eight rows, the rows always fit); the Tchaikovsky numbers above; **Letter and A4** (r2 amendment 7; Text cannot reach A4, so this is the only place it is exercised); **three footers** (none, one legend row at 90 px, two at 110 px, inference); **40 one-row lines**, each sheet, each footer: nothing overruns and every page but the last is full and under 15 percent empty; **lines that wrap past the old estimate** (seven long words that wrap to three rows cost three); rows taller than the fit assumed (the height decides, not the count); a poem that arrives as one 95-word line, cut at measured row starts, two rows each side, no proclitic at a part's end, a tail measured as its own piece; the loop settles and is a fixed point; no lines is one page; and source guards against restoring the constants.

Browser, `e2e/pages-without-gaps.test.ts` (+6, both languages, screen and print): **36 short lines**, **14 wrapping lines**, and **36 short lines under a taller footer** (the legend given 20 px, standing for two legend rows: a fixture with two legend rows is NOT ESTABLISHED, because two items fit one row and no fixture reaches more; this is how I made the footer taller). Plus the two Tchaikovsky tests of step 6, now green.

**Controls.** The six new browser tests, run against the old components, **all fail** (page 1 11.4 px into the footer, pages 2 and 3 7.1 px); on the new code all pass. Mutations of the slicer: rounding the gap, dropping the padding, dropping the overhang, estimating always, and dropping the height check each fail a test (two survived my first tests, because they checked the fit with the function under test, and now fail after I made the check hand-computed and added a padding and a taller-rows case).

## Gates after part 1

| Gate | After the merge | Now |
|---|---|---|
| phonology, dictionary, blurb, score-parser | 407, 248, 148, 785 + 5 skipped | not rerun (no change in the packages) |
| web unit | 4094 + 1 skipped | **4120** + 1 skipped |
| integration (root) | 112 | 112 (not rerun; no root file changed) |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings (991 files) |
| ratchets | OK | OK |
| build | succeeded | succeeded |
| e2e | not run | `pages-without-gaps.test.ts` whole file: 24 of 24 before the new tests, 30 of 30 with them. The whole suite is Part 5's. |

## NOT ESTABLISHED

- The cost of the probe on a long song: it mounts each line a second time, briefly. Not timed.
- A footer of two legend rows from a real fixture (see above), and the footer in French beyond the legend «Accent de ё» (the French tests pass).
- Whether the row's box and ink split changes again on another machine's fonts. The model reads the probe, not a constant, so it should follow.
- What a printed page tells a coach about a cut line's continuation (r2, outside this brief).
