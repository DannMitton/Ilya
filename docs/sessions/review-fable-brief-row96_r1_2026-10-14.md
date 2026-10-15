# Fable's review of row 96's brief (r1, 2026-10-14)

Reviewed by Fable 2026-10-14 on the read-only snapshot of `Shane` at `dbe41af` under `/home/claude/row96` (partial: `apps/web/src`, `apps/web/e2e`, `packages/score-parser/src`, `docs/memory/PRODUCT.md`, four `docs/sessions` files, `ilya-ship.sh`). Read whole: the brief, `InsightsPane.svelte`, `paginate.ts`, `singer-blocks.ts`, `SingerBlock.svelte`, `PageFooter.svelte`, `pages-without-gaps.test.ts`, `print-pages.test.ts`, `playwright.config.ts`, the row 89 review. Read in part: `MarkupPane.svelte:455-520, 838-852, 1018-1036`, `page-config.ts:17-110, 158`, `Paper.svelte:42-57`, `TitlePage.svelte:166, 186`, `SubsequentPage.svelte:83, 93`, `placeholder-mark.ts:30-80`, the row 79 report, `PRODUCT.md:749-756, 1157-1170`. Every `path:line` below was read this session unless marked otherwise.

## Verdict: SEND WITH AMENDMENTS

The three leads are read correctly from the tree and the citations hold. Four things keep it from SEND as it stands. The positive control, as written, can inflate the measured copy of the block as well as the drawn one, in which case the pages re-flow and the instrument reports no overlap; Code would then read a sound instrument as broken. The print measurement names `page.pdf`, which returns a PDF and no element geometry. The check in step 3 inherits an exclusion of the last page from the test it extends, and the fault was found on a page that may be the last. And the done-when names three documents for the fix where the fault was seen in one, which invites a rewrite of Text's pagination nobody asked for.

## 1. Citations checked

| Brief line | Claim | Result |
|---|---|---|
| 13 | `InsightsPane.svelte:446` leaves screen-only blocks out of `paginate` | CONFIRMED: `printed` filters `!b.screenOnly` at `:446`; `paginate` reads `printed` at `:449-456` |
| 13 | `:466-470` adds each screen-only block to the page of the block before it | CONFIRMED: `:466-471`, `s.blocks.push(k)` where `s.blocks.includes(k - 1)` |
| 13 | The one screen-only block is "N more observations", `singer-blocks.ts:283-292` | CONFIRMED: `:283-293`, `screenOnly: true`, `kind: 'more'`; no other block sets `screenOnly` in the file. The label key `comment.more.one` at `:289` matches "One more observation" |
| 13 | A `<details>`, `SingerBlock.svelte:88-92` | CONFIRMED |
| 13 | "12 px between blocks" | CONFIRMED for a block inside a squircle: `GEOMETRY.inner: 12` (`InsightsPane.svelte:407`), `.squircle { gap: 12px }` (`:629`). The 'more' block is in the `moments` group (`singer-blocks.ts:285`), so 12 is the right figure |
| 13 | `CLEAR`, 40 px, `InsightsPane.svelte:410` | CONFIRMED |
| 14 | Measurer runs once after `tick()` on blocks, fonts, or language, `:428-444` | CONFIRMED: `:429-431` read `blocks`, `fontsReady`, `language`; `:433` `tick().then` |
| 15 | `pages-without-gaps.test.ts:83` reports `empty: footer - bottom`, a negative number fails nothing | CONFIRMED: `:83`; `:106-107` returns early when `share <= LIMIT`, which a negative share always is |
| 19 | The footer elements `:69` reads | CONFIRMED: `.page-footer .apparatus > *, .provenance-legend, .broad-legend, .footer-hairline` |
| 21 | Fixture `apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml` | CONFIRMED on disk; `sunless-01-engraved.musicxml` beside it |
| 21 | "the fully sampled bass voice row 79 used" | CONFIRMED: `storedVoice()`, `pages-without-gaps.test.ts:25-30`, ten vowels, `voiceType: 'bass'` |
| 22 | `print-pages.test.ts` prints by `page.pdf` or the print media type | `page.pdf({ preferCSSPageSize: true, printBackground: true })` at `:33`; no `emulateMedia` anywhere in `e2e/`. See amendment 3 |
| 28, 30 | `PRODUCT.md` "No empty space mid-document"; "1. WYSIWYG means what it says", Dann 2026-09-17 | CONFIRMED: `PRODUCT.md:1157-1170`; `:749-756` |
| 39 | `placeholder-mark.ts:44`, `PLACEHOLDER_HOLLOW_STROKE_SP = 0.198` | CONFIRMED. The comment at `:36-43` names 0.098 as the thinnest, as the brief says |
| 39 | `docs/sessions/placeholder-shots/hollow-strokes.png` | CONFIRMED on disk |
| 40 | Tests that pin the value: `placeholder-mark.test.ts`, `stem-legend.test.ts` | Neither pins a number. `placeholder-mark.test.ts:41` and `stem-legend.test.ts:85` read the constant by import (`:12`, `:10`). The approved SVG `apps/web/src/lib/approval/__approved__/sunless-01-engraved.primitive.svg` holds no `stroke-width` of 2.38 or 1.18, so no snapshot moves either. Amendment 7 |
| 44 | Gate 4 2474, gate 5 "675 passed, 5 skipped (680)" | CONFIRMED: `ilya-ship.sh` gate 4 `"2474 passed (2474)"`, gate 5 `"675 passed | 5 skipped (680)"`; gates 1, 2, 3, 6, 7, 8 as the script records (251, 248, 0 errors and 12 warnings in 5 files, 145, 55, ratchets OK) |
| 3, 49 | `CONTRACT.md` §1 item 19, §4 | Not in the snapshot: NOT ESTABLISHED |
| 13 | `INBOX.md`, «One more observation» | Not in the snapshot: NOT ESTABLISHED |
| 7 | Dann's words at 03:10, the alias at `6c69161` | Not in the snapshot: NOT ESTABLISHED |

## 2. The leads against the code

**Lead 1 holds and is the likeliest cause, with one refinement.** The arithmetic of the page bounds the overrun a closed list can make. `paginate` packs a page to `capacity`, which is the page less its margin, its measured footer, `CLEAR`, and the column's top (`InsightsPane.svelte:448`), so by the numbers the lowest printed block ends at least 40 px above the footer's top. A closed 'more' block adds one summary line of 11.5 px sans (`SingerBlock.svelte:524-529`) plus the 12 px inner gap: about 30 px, which lands inside the 40 and not over the footer. The footer's first painted element is the hairline (`PageFooter.svelte:94, 151-154`), with the attribution text 8 px below it. For the chart's last two rows (about 30 px, `.vowel-rows` row-gap 5 and track height 10, `SingerBlock.svelte:441-458`) to print over that text, content has to run about 80 px or more past the capacity. One opened observation is a tag line, a body of two to four lines at 14 px and 1.45 line height, and sometimes a teacher line (`SingerBlock.svelte:47-55`, `:196-221`): 60 to 100 px, plus the summary and gap. So the screenshot is consistent with the list open and not with it closed. This is arithmetic from the stylesheet, not a measurement; amendment 4 puts it in the expectation so Code reads "closed: no overlap" as the expected result and not as a failed instrument.

Two details of the riding rule for Code's eye. The 'more' block rides at the end of the segment that holds the end of the block before it (`:470`), so on a page where the moments squircle ends and the totals squircle begins, everything in totals, including the vowel chart, is pushed down by its height. And in print `.screen-only` is `display: none` (`InsightsPane.svelte:714-716`; also `.more` at `SingerBlock.svelte:534`), so lead 1 cannot show in print at all; a print overlap would be lead 2 or something else.

**Lead 2 is possible and the brief handles it rightly** (measure first). One thing it can name: the measurer and the page draw at the same widths (`widthOf` at `:411` gives `COLUMN` 624 or `INSIDE` 570; the page's `.column` is 816 less two 96 px margins, `:611-613`, and the squircle's 1 px border and 26 px padding, `:624-626`, give 570), so a height difference between the two copies would come from timing, not geometry. The vowel track is 300 px in both (`SingerBlock.svelte:36`).

**Lead 3 holds**, and the same test excludes the last page (`pages-without-gaps.test.ts:105`, `pages.slice(0, -1)`), which the brief does not say. Amendment 5.

**A single block taller than the page.** `paginate` allows exactly one overflow: a block that does not fit on an empty page is placed anyway (`paginate.ts:7`, `:46`, `:136-145`; `:136` tests `page().length > 0`, and a block on an empty page falls through to `place` at `:145`). The vowel chart is a figure (`InsightsPane.svelte:454`) and never breaks (`:417` leaves `'vowels'` out of `BREAKS`), so it is the kind of block this path takes. By size it should not: the chart is captions, an 80 px ring, ten rows of 10 px tracks with 5 px gaps, and an optional placeholder line (`SingerBlock.svelte:113-140`), some 300 to 350 px, against a later page's capacity of roughly 1056 less 48, less the footer, less 40, less `subsequentTop` (48 + the running head + 16): about 800 px. Not measured. Amendment 4 asks Code to report the chart's measured height beside the capacity so this path is ruled out by a number and not by my estimate.

**Markup and Text.** They share `PageFooter` and nothing else. Insights paginates with `paginate.ts` against a measured footer and `CLEAR` (`InsightsPane.svelte:448-456`, `:547-549`). Markup paginates with `paginateScore` from `@ilya/score-parser` (`MarkupPane.svelte:843-846`) against `contentBottom`, which is the margin plus the larger of `FOOTER_MAX_HEIGHT` (80, `page-config.ts:84`) and the footer measured on page 1 (`MarkupPane.svelte:484-486`, `:1018`), plus the notes sheets at `:1036`. Text paginates by row count: `sliceLinesToPages` (`page-config.ts:158`, called at `Paper.svelte:44`) with `LINES_PER_PAGE` 10 (`:97`) and `WORDS_PER_ROW` 7 (`:109`), nothing measured; its content layer is bounded by `bottom: contentBottom` (`TitlePage.svelte:166`, `SubsequentPage.svelte:83`), and row 79's report calls the row estimate an estimate that a page could run over (`report-code-pages-without-gaps_r1_2026-10-11.md:136`). Whether that layer clips or overflows is not read this session. So a fault of the row 96 kind in Text would need a different fix in a different file, which is why amendment 2 scopes the fix.

## 3. Are steps 1 to 4 executable?

- **Step 1, the instrument.** It already exists: `measure()` at `pages-without-gaps.test.ts:41-86` returns `empty` as footer top less lowest painted edge, counts a summary but not a closed list's contents (`:46`), clips a cut block to its window (`:56-62`), and skips anything taller than 95 percent of the page (`:54`). A negative `empty` is the overlap. The brief has Code build one; amendment 1 names this one.
- **Step 1, the control.** `SingerBlock.svelte` is drawn twice, once in the measurer and once on the page (`InsightsPane.svelte:543-546`, `:516-518`). A padding added in `SingerBlock.svelte`'s stylesheet, or any rule that matches both copies, inflates the measured height too; `paginate` then makes room for it and the control reads zero. The rule has to match the page copy only. `.insights-page .column` (`:570`, `:579`) contains the page copy and not the measurer (`:543`). Amendment 1.
- **Step 1, print.** `page.pdf` (`print-pages.test.ts:33`) gives a PDF, and the test counts `/Type /Page` objects in it (`:18`); there is no element geometry to measure. `page.emulateMedia({ media: 'print' })` then `measure()` gives the geometry under the print stylesheet, where `.screen-only` is hidden. Amendment 3.
- **Step 1, the list opened.** The measurer's copy is `inert` (`:543`), so the click has to go to the page copy: `.paper-page:visible details.more > summary`. Whether both fixtures produce a 'more' block under `storedVoice()` is NOT ESTABLISHED here; row 79's report saw "3 more observations" on one song (`:23`) without naming it. Amendment 5 says what to do when a fixture has none.
- **Step 1, where the chart sits.** Under the fixture voice Tchaikovsky is six Insights pages (row 79 report `:14`) and its endnotes run pages 3 to 5 in English (`:61`), so the chart's page there is not Dann's page 3. The brief's pictures name "page 3"; amendment 6 names the chart's page instead.
- **Step 3, the command.** The Playwright check is not one of the eight gates (`ilya-ship.sh`, "Playwright stays in CI"; row 79 report `:127`). It runs with `pnpm test:e2e` from `apps/web` (`package.json:17`) against the dev server, which the config starts or reuses (`playwright.config.ts:50-55`), at 1440 by 1300 (`pages-without-gaps.test.ts:18`). The brief never says how the red and green runs are made. Amendment 5.
- **Step 4.** Executable as written. No test or snapshot pins 0.198 (section 1), so no test moves and gate 5 stays at 675 unless Code adds one. Amendment 7 saves Code the search.
- **Gates.** Baselines match the script. A unit test added to `paginate.test.ts` for the fix would move gate 4; the brief's reporting rule covers it.

## 4. Is the brief complete for Code?

- **Done-when.** "Nothing in the page's content reaches the top of its footer" is testable by `measure()`'s `empty >= 0` on every page, including the last. "Whatever the singer opens or closes on the page" is testable only for the one `<details>`, which is the one control that changes height; the range offer's decline removes a block and re-measures (`:297-301`, `:429`), and "Try this key" changes the blocks (`:146`, `:489`), both re-measured by the effect. Fine as a statement; amendment 5 makes the test say which states it covers.
- **Scope.** The fault is on Insights. Text and Markup are in the done-when for the fix, and their pagination lives elsewhere (section 2). Measuring all three in step 1 is right and cheap; fixing all three in one row is not what Dann asked for on 2026-10-14. Amendment 2.
- **Nothing forbidden that is needed.** The constraints (no `CLEAR`, type, margin, or stave change; no `docs/memory/` edit; no writing git command) leave every mechanism for lead 1 open: counting the summary line in `paginate`, drawing the opened list without taking page room, or a re-flow on open with a report. The brief's rule "opening the list must not push anything into the footer" and its WYSIWYG line say what the mechanism must satisfy without choosing it. Good.
- **One tension for the desk, not for the brief.** `PRODUCT.md:754-755`: "anything that cannot print does not belong on the page." The 'more' list never prints (`SingerBlock.svelte:534`) and stands on the page by N.127 and N.168 (`InsightsPane.svelte:21-23`). The brief's "apart from the screen-only list itself" grants the list an exception the product rule does not state. The brief is right not to open that here; the desk may want it on the walk.
- **The report path and shots folder** are named; the table's columns are named. Good.

## Amendments

1. Replace step 1's first two bullets with:

   "- **Instrument.** `measure()` in `apps/web/e2e/pages-without-gaps.test.ts:41-86`, as it stands: its `empty` is the footer's first painted element's top less the lowest painted content edge (`:83`), it counts an opened list's text and a closed list's summary line (`:46`), and it clips a cut block to its window (`:56-62`). An overlap is `empty < 0`, in px. Report it for every page, the last included.
   - **Positive control first.** In a throwaway local edit, add to `InsightsPane.svelte`'s stylesheet a rule that matches the page copy and not the measurer's, for example `.insights-page .column .block-vowels { padding-bottom: 100px; }` (the measurer at `:543` is outside `.column`, `:579`). A rule in `SingerBlock.svelte`, or any rule both copies match, inflates the measured height too, and `paginate` makes room for it, so the control reads zero. Confirm `measure()` reports about 100 px of overlap, or the chart's move to the next page with the reason, then revert. Report the control's reading."

   Reason: the instrument exists at `:41-86`, and a control that inflates both copies cannot show an overlap (`InsightsPane.svelte:436`, `:448-456`).

2. Replace "Done when" with:

   "**Done when:** on every page of Insights, in English and French, on screen and in print, with the observations list closed and opened, nothing in the page's content reaches the top of its footer; the check in step 3 fails when that stops being true on any of the three documents. Step 1 measures Text and Markup too. An overlap found there is reported with its page and px and left for its own row, since Text paginates by row count (`page-config.ts:158`, `Paper.svelte:44`) and Markup by `paginateScore` (`MarkupPane.svelte:843`), neither through `paginate.ts`."

   Reason: the fix for Insights lives in `InsightsPane.svelte` and `paginate.ts`; a done-when over three documents invites a rewrite of Text's row budget that Dann did not ask for.

3. Replace, in step 1's "Run" bullet, "(Playwright `page.pdf` or the print media type, whichever `print-pages.test.ts` already uses)" with:

   "(`page.emulateMedia({ media: 'print' })`, then `measure()`; `page.pdf`, which `print-pages.test.ts:33` uses, returns a PDF with no element geometry and is for page counts only)".

   Reason: `print-pages.test.ts:18, 33` counts `/Type /Page` objects in the PDF and measures nothing.

4. Add to step 1's "Expectation" bullet, after "and on no page when it is closed":

   "Closed, the list adds about 30 px (one 11.5 px summary line, `SingerBlock.svelte:524-529`, plus the 12 px inner gap, `InsightsPane.svelte:407`) inside the 40 px kept clear, so no overlap is expected and that result does not mean the instrument failed. Opened with one observation it adds 80 px or more, which reaches the attribution text 8 px below the hairline (`PageFooter.svelte:151-154`). These are the desk's arithmetic from the stylesheet, not measurements. Report also the vowel chart's measured height (`heights[k]`) beside the page's capacity (`room`, `:448`), to rule out by a number the one overflow `paginate` allows, a block taller than an empty page (`paginate.ts:46`, `:136-145`)."

   Reason: without the arithmetic, "closed: no overlap" reads as a failed control, and the single-block overflow path exists and is cheap to rule out.

5. Replace step 3 with:

   "- Extend `pages-without-gaps.test.ts`, or add a test beside it, so that any page whose content reaches its footer fails: `measure()`'s `empty < 0` on any page, the last page included (the present test skips it, `:105`), for all three documents, both languages, on screen and under `emulateMedia` print, and on Insights with the list closed and then opened by clicking `.paper-page:visible details.more > summary` (the measurer's copy at `InsightsPane.svelte:543` is inert). Where a fixture and voice produce no 'more' block, print that by name and pass the opened case; do not invent one.
   - Run it from `apps/web` with `pnpm test:e2e e2e/pages-without-gaps.test.ts` against the dev server (`playwright.config.ts:50-55`); it is not one of the eight gates. Show it red on the step 1 case before the fix and green after. Report both runs."

   Reason: `:105` excludes the last page, the click has a wrong target if unscoped, and the brief names no command for the red and green runs.

6. In "Report", replace "Pictures of page 3 before and after, both languages" with "Pictures of the page that holds the vowel chart before and after, both languages, list closed and opened, and the page number named".

   Reason: under the fixture voice Tchaikovsky's chart is not on page 3 (row 79 report `:14`, `:61`).

7. Replace, in step 4, "Update any test that pins the value (`placeholder-mark.test.ts`, `stem-legend.test.ts`)" with "No test pins the number: `placeholder-mark.test.ts:41` and `stem-legend.test.ts:85` read the constant by import, and no approved SVG holds the stroke. Run gate 5 and report it; it is expected to stay at 675."

   Reason: saves a search; the expectation makes a moved gate 5 a finding.

## What I could not establish

- `CONTRACT.md`, `INBOX.md`, `QUEUE.md`, and `STATE.md` are not in the snapshot: §1 item 19, §4, row 96's row, and the «One more observation» note are not checked.
- Dann's screenshot and his words at 03:10 and 03:11; the alias commit `6c69161` and whether it matches `dbe41af` in the files read.
- Which page holds the 'more' block under Dann's voice, how many observations it holds, and whether he had it open. The arithmetic in section 2 says the screenshot needs it open; that is inference from the stylesheet, not a measurement.
- Whether both fixtures produce a 'more' block under `storedVoice()`. Row 79's report names "3 more observations" on one song without saying which (`:23`).
- The vowel chart's actual measured height and any page's actual capacity. My 300 to 350 px and 800 px are estimates from the stylesheet.
- Whether lead 2 ever fires: no timing was measured here.
- Whether Text's content layer clips or overflows a row that exceeds its budget (`TitlePage.svelte:166`; `overflow` not read).
- `packages/score-parser/src/page-layout.ts` (`paginateScore`) was not read; Markup's footer reservation was read in `MarkupPane.svelte` only.
- Whether Playwright's browsers are installed on Dann's Mac. Row 79's report ran the check there (`:89`), so the path existed on 2026-10-11.
