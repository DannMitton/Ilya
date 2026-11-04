# Report: poem library build 1, step 7, part 5, the gates, the walk, and the browser baseline (Code cloud lane, r1, 2026-11-04)

Brief: `brief-code-poem-library-build1-step7_r4_2026-11-03.md`, Part 5 and "Done". Branch `cloud-lane-31`, after parts 0 to 4. Earlier reports: `report-code-poem-build1-step7-part0_r1_` to `-part4_r1_2026-11-03.md`.

## A finding from this part: the probe put a second word in the page

The first full browser run of this step had **one failure outside the baseline's eight**: `e2e/singer-paths.test.ts:48`, «correcting a word's gloss in the Inspector sticks». The error was a strict-mode violation: `[data-word-index="0-0"]` matched two elements. Cause, mine: Part 1's measuring probe renders a second copy of the lines while it measures, and a gloss change re-measures; for a moment the page held the probe's copy of word `0-0` beside its own, with the same `data-word-index`. **Fix:** the probe's copy carries no `data-word-index` (`WordStack.svelte` gets a `probe` prop, passed through `VerseLine.svelte` from `TextFitProbe.svelte`); the probe's container stays `aria-hidden` and `inert`. A first version also dropped the role and tab stop from the copy; that raised the svelte-check warnings from 12 to 13 (Svelte's a11y check must see a static role), so the role stays and only the data attribute is conditional. A unit guard pins the three places. After the fix `singer-paths:48` passes and the whole suite was run again (below).

## The eight gates

The brief and `CONTRACT.md` do not list them (step 0); I ran every suite.

| Gate | Step 0 baseline (`979fdd78`) | After step 6 | Now |
|---|---|---|---|
| phonology | 407 | 407 | 407 |
| dictionary | 248 | 248 | 248 |
| blurb | 148 | 148 | 148 |
| score-parser | 785 + 5 skipped | 785 + 5 skipped | 785 + 5 skipped |
| web unit | 3898 + 1 skipped | 4065 + 1 skipped | **4145** + 1 skipped |
| integration (root) | 98 | 112 | 112 |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings | 0 errors, 12 warnings (994 files) |
| ratchets | OK | OK | OK (`+page.svelte` 5586 of 5586) |
| build | succeeded | succeeded | succeeded |

The merge of row 177 (Part 0) added 29 web tests; this step's own are the rest of the difference.

## The browser suite against the baseline

**128 tests: 120 passed, 8 failed.** The 8 are **exactly the baseline's 8, by name** (step 0, section 9; the comparison is a `comm` of the two lists of failing titles, which printed nothing new and nothing fixed):

1. `glue-typed-marks.test.ts:29` leaves «я #на» as typed
2. `glue-typed-marks.test.ts:39` Control+Z after the blur
3. `heic-offline.test.ts:43`
4. `heic-reader-path.test.ts:111`
5. `insights-page.test.ts:95`
6. `loupe-header.test.ts:47`
7. `print-pages.test.ts:20`
8. `singer-paths.test.ts:169` Learn and Guide

**The two step 6 failures are green:** `pages-without-gaps.test.ts` «Tchaikovsky Op. 38 no. 3, text, en» and «..., fr»: *nothing on any page reaches its footer*, on screen and in print. 128 = the baseline's 90, plus 18 in `poem-library.test.ts`, 6 new in `pages-without-gaps.test.ts`, and 14 in `text-header.test.ts`. NOT ESTABLISHED, as in steps 0 and 6: why each of the 8 fails.

## A test for each walk item (the brief's list)

| Walk item | Unit | Browser |
|---|---|---|
| **1. Every page ends above its footer; no empty band mid-document** | `page-fit.test.ts` (32 cases: the arithmetic of the old overrun; Letter and A4; footers of none, one and two legend rows; 40 one-row lines; wrapping lines; cut points; the loop settles; source guards) | `pages-without-gaps.test.ts`: the two Tchaikovsky tests (the case that failed), plus **36 short lines, 14 wrapping lines, 36 short lines under a taller footer**, each in English and French, screen and print. Run against the old components all six new ones fail (11.4 px into the footer on page 1, 7.1 px on pages 2 and 3). |
| **2. The header names the text the page prints** | `text/text-header.test.ts` (the state table through the real `shownWitness`; the strings; the wiring) | `e2e/text-header.test.ts`: 7 states, 2 languages, screen and print, page 1's mark and every later running head (28 checks) |
| **3. POEM has no dating line** | `poem-source.test.ts` (every library entry; the three forms; the library keeps «1830»), `poem-offer.test.ts` | `poem-library.test.ts`: POEM ends «Видит заря!», has no «1830», the card says no passage |
| **4. The ratified wording (D1 to D4)** | `poem-library-strings.test.ts` (13 keys pinned to the brief; the site per language), `poem-source.test.ts` (the passage wording, and the pinned list of capitalised joins), `input-line.test.ts` | `poem-library.test.ts`: «a passage beginning “Дитя моё, останься здесь со мной”», “Весёлый час” in the quiet line, «Tiré de Wikisource en russe.» |

## Done, line by line

| "Done" says | State |
|---|---|
| Parts 0 to 5 pushed with reports | Yes: six commits-with-reports on `cloud-lane-31` (parts 0 to 5), plus this part's fix. |
| **No page overruns its footer for any fixture** | Yes for both tracked fixtures (Without Sun, Tchaikovsky) in text, markup and insights, English and French, screen and print (`pages-without-gaps.test.ts`, 30 of 30), and for the three new songs. Markup and Insights were not changed by this step and still pass. |
| The header matches the printed text in every state | Yes (the table above). |
| Nothing else changes | The files touched are in the list below. Beyond what the parts asked: `WordStack.svelte` and `VerseLine.svelte` gained the `probe` prop. |

## Everything this step changed, in one place

`page-fit.ts`, `TextFitProbe.svelte`, `Paper.svelte`, `TitlePage.svelte`, `SubsequentPage.svelte`, `page-config.ts`, `WordStack.svelte`, `VerseLine.svelte` (Part 1 and the fix above); `text/text-header.ts`, `i18n.ts`, `+page.svelte` (one prop on one line; the file is still 5,586 lines) (Part 2); `text/poem-source.ts` (Parts 3 and 4); `text/poem-site.ts`, `PoemLibraryCard.svelte`, `IntakeViews.svelte` (Part 4); and their tests. `docs/memory/` was not touched, `Shane` and `main` were not touched, and no pull request was opened.

## For Dann: what is his to say

1. **Page 1 of the Tchaikovsky song is nine rows, not ten** (Part 1): nine at a 24 px gap with the legend, nine at 26 px without. Ten rows need 15.7 px (with the legend) or 16.8 px (without) at today's 57.4 px row, so lowering the 18 px floor to 17 does not restore ten. The old ten rows were an overrun. The floor stays, as he ruled at 20:34.
2. **The card's own title and first line** still print «…» in English (Part 4, D1 lists three keys).
3. **D4's rule lowers a line after a sentence end** («Весело на пашне. ну, тащися, сивка»), and two library stanzas begin with data faults (an underscore run in «Мцыри»; a heading line «ИЗ ГЕЙНЕ.» in the Heine entry). Part 4's report has them.
4. **A footer of two legend rows** is exercised by giving the legend more height, not by a fixture (no fixture reaches two rows).
5. **Cost:** the probe mounts each line a second time, briefly. Not timed on a long song or a phone.

## NOT ESTABLISHED

- Why each of the 8 baseline browser failures fails.
- The probe's cost on a long song, and on a phone.
- A real two-legend-row footer from data.
- Whether the row's box and ink split changes on another machine's fonts (the model reads the probe, not a constant).
