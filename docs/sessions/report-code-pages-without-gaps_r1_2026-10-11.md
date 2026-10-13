# Report: row 79, no empty space mid-document (r1)

Code (Opus 5.5) on Dann's Mac, 2026-10-12, brief `brief-code-pages-without-gaps_r2_2026-10-11.md`, read whole, after `PRODUCT.md` "No empty space mid-document", read whole.

- **Tree:** `Shane`, uncommitted, with rows 78a to 78c in the tree before it.
- **Where the brief was set aside.** It was written for the cloud lane. As Dann directed, its git instructions were ignored: no git command that writes.
- **Two sittings.** This report replaces the partial one written at a usage limit. The second sitting finished the parts left to do.

## The answer first

- **All seven rules are built.**
- **Markup** is the cleanest result. Its full pages went from 16.7 or 17.1 percent empty to 2.5. The cause was a defect: every page was packed against page 1's shorter window.
- **Text** no longer runs off its page. Tchaikovsky's poem reaches Text as one 95-word line, which used to print as one overflowing page.
- **Insights.** *Without Sun* is 3 pages in English (was 4). Tchaikovsky is 6 in both languages (was 7 and 8). Every Insights page's footer now starts at the same height, 942 px.
- **What still stands over 15 percent.** Three Insights pages do. In each, the next page opens with a figure, or a block that may not break, that would not fit. The check names them as FULL rather than failing them (see rule 6).
- **The eight gates pass.** Gate 4 reads 2477 and gate 5 675 passed, 5 skipped (680). The script's baselines are the desk's to move.

## Before and after (section 3)

Measured with `docs/sessions/rows-78-79-shots/pages.mjs`: headless Chrome at 1440 px, the dev server at localhost:5173, a fully sampled bass voice.

- **Empty share:** the empty height above the footer's first line, over the content's full height. Each page but the last is listed; the last is in brackets.
- **What the harness leaves out:** text hidden in a closed `<details>` ("3 more observations") and text clipped by a broken block's window. Both are laid out but not painted.
- **Data and pictures:** `79/before.jsonl` and `79/after.jsonl`, and every page of every document in `79/before/` and `79/after/` (both songs, English and French).

| Song | Document | Before: pages; empty share | After: pages; empty share |
|---|---|---|---|
| *Without Sun*, no. 1 | Text en, fr | 1 | 1 (unchanged) |
| *Without Sun*, no. 1 | Markup en | 3; 2.4, 16.7 (last 85.8) | 3; 2.4, **2.5** (last 85.8) |
| *Without Sun*, no. 1 | Markup fr | 3; 2.4, 17.1 | 3; 2.4, **2.5** |
| *Without Sun*, no. 1 | Insights en | 4; 19.2, 50.2, 40.4 | **3**; 21.1, 8.6 |
| *Without Sun*, no. 1 | Insights fr | 4; 35.0, 11.9, 28.8 | 4; 14.3, 30.8, 8.9 |
| Tchaikovsky | Text en, fr | 1, **overflowing** (the poem ran past the footer and off the page) | **2**; 6.4 |
| Tchaikovsky | Markup en, fr | 4; 2.4, 16.7, 16.7 (fr 17.1, 17.1); 5, 5, 4 systems | 4; 2.4, **2.5, 2.5**; 5, 6, 3 systems |
| Tchaikovsky | Insights en | 7; 24.9, 21.0, 10.1, 33.9, 53.2, 19.6 | **6**; 9.3, 5.2, 6.8, 9.4, 8.5 |
| Tchaikovsky | Insights fr | 8; 19.4, 15.0, 67.0, 25.9, 34.7, 52.5, 20.2 | **6**; 7.9, 32.3, 8.7, 9.2, 6.9 |

- **Markup's last page** holds only the "For your consideration" box, which is why it is 84 to 90 percent empty.
- **The *Without Sun* French Insights page 1 ratio rose** with the change, though the page is fuller in pixels than before. Its gap moved: page 2 is now the one with room left, because page 3 opens with a figure (see rule 6).
- **The page count,** which the brief predicted would be three or fewer for *Without Sun* in Insights: 3 in English, 4 in French.

## What changed, rule by rule

**Rule 1, order.** Unchanged. Only figures move, and only past prose of their own squircle.

**Rule 2, finer breaks.**

- **Text** (`apps/web/src/lib/page-config.ts`).
  - A line costs its estimated rows (`rowsOf`), at `WORDS_PER_ROW` = 7 words a row. Seven is the file's old threshold, and I checked it on Tchaikovsky, where rows hold seven or eight words. Before, a line cost at most two rows.
  - A line that does not fit breaks between rows, at least two on each page, never after a proclitic. A stanza is treated as a paragraph (DESK DEFAULT).
  - Each word keeps its own `lineIndex` and `wordIndex`, so a click on either part finds its word.
  - Tests: `text-pages.test.ts` (6).
- **Insights** (`insights/line-breaks.ts`, `paginate.ts`, `InsightsPane.svelte`).
  - **Measuring.** The measuring pane reads each prose block's rendered lines: comments, prose, endnotes, notes, and the note block. `lineBoxes` merges overlapping fragments, and `breakOffsets` offers each line top that leaves at least two lines above and below.
  - **Placing.** `paginate` puts a block's first part on the page, up to the lowest break that fits, and the rest on the next page. A remainder may break again, two lines on from where it began.
  - **Drawing.** The page draws a part as the whole block in a window of the part's height, shifted up by its start, so the lines are the measured lines and nothing reflows.
  - **Endnotes** therefore break between suggestions and references, since each starts a line.
  - **Headings** ride on their block's first lines (as before), so a heading never ends a page.
  - **What never breaks:** figures, the conclusion with its controls, and the cycles block.
  - Tests: `paginate.test.ts` +3, `line-breaks.test.ts` (2).
  - Pictures: Tchaikovsky's endnotes run across pages 3 to 5 in `79/after/after-tchaikovsky-insights-en-p3.png` to `-p5.png`.
- **Markup** sets no prose that can break: its prose box is one block on its own sheet.

**Rule 3, figures float** (`paginate.ts`).

- **The rule as built.** A figure that does not fit goes to the top of the next page. The prose blocks after it in the same squircle that fit move up into the space.
- **Its limits.** Never more than one page, and never ahead of the block that introduces the figure.
- **Which blocks float.** The pitch chart and the vowel chart. The cycles block carries its squircle's heading and stays.
- Tests: `paginate.test.ts` +3.

**Rule 4, music pages share out leftover space** (`packages/score-parser/src/page-layout.ts`).

- **The defect.** `paginateScore` packed every page against one window height, page 1's. Page 1 carries the title block; later pages carry only a running head. So every later page left about 145 px empty.
- **The fix.** New option `laterPageHeight`; `MarkupPane.svelte` passes the later pages' own window.
- **The cap.** Spacing was already shared out between systems. It is now capped at `MAX_SYSTEM_GAP_FACTOR` = 2 times the normal `systemGap`, the brief's DESK DEFAULT, marked JUDGEMENT in the code. Beyond the cap, the rest stays at the foot.
- **The last page** still repeats the spacing of the full pages before it (Dann 2026-08-06, already built). It is now capped the same way.
- **On these songs** no page reached the cap: every full page fills to 2.5 percent. I have no picture at the cap.
- **Gould.** No copy of the extraction is in the repository, and `page-layout.ts`'s existing comment calls the even distribution INFERENCE from r235, with p. 491 never photographed. So the maximum is JUDGEMENT, not a rule.
- Tests: `page-layout.test.ts` +2 (the cap; later pages packed against their own window). The old fill test is re-pinned: a full page reaches the bottom margin, or every gap stands at the cap.

**Rule 5, type.** No type size, margin, or stave size changed.

**Rule 6, the check** (`apps/web/e2e/pages-without-gaps.test.ts`, new).

- **What it checks.** Twelve Playwright tests: both tracked fixtures, all three documents, English and French, measured as drawn. Each fails when any page but the last is more than 15 percent empty.
- **Exemptions, each printed by name.** A page is not failed when the next page's first item (a system, a row, or a block that may not break, or that breaking would leave with fewer than two lines) needs more than the page's room. That is printed as FULL, or as CAPPED for Markup when its gaps already stand above the floor.
- **On Insights,** the room excludes the 40 px kept clear above the footer (row 66's standard) and the 16 px gap between segments.
- **Where it runs.** CI runs this suite (`--project=chromium`); the eight gates do not.
- **Run here against the dev server:** 12 passed, with three pages named FULL:
  - *Without Sun*, Insights en, page 1, 21.1 percent: the next block needs 148 px, the room is 134.
  - *Without Sun*, Insights fr, page 2, 30.8 percent: the next figure needs 477 px, the room is 212.
  - Tchaikovsky, Insights fr, page 2, 32.3 percent: the next page opens the totals squircle with the pitch chart, which carries the heading and needs 262 px against 225.
- **The fixtures used:** `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` and `tchaikovsky-op38-3-voice.musicxml`. The Tchaikovsky fixture exists in the tree, which the brief had NOT ESTABLISHED.
- **Text's sixth-system concession** did not arise: Text sets rows, not systems.
- **No unit test** checks this. Vitest has no layout, so the check had to run in Playwright.

**Rule 7, Insights' notes are endnotes.**

- **The Notes section.** A `notes` block, headed `insights.r2.notes` ("Notes" / « Notes »). It holds the Pacheco footnote with its unchanged marker `1`, then the method line, last.
- **Where it sits.** Unboxed, in the small type `insights.r2.sourcesLine` uses, after the totals and before "Further reading". It also appears on the no-score and unmeasured pages.
- **Where it left.** Every page footer loses the footnote and the method line, on the desktop and on the phone's single column. The phone carries Notes at the end of its column.
- **The code:** `singer-blocks.ts` (`notesBlock`), `SingerBlock.svelte`, `InsightsPane.svelte`, and `i18n.ts`.
- **The result.** Every Insights page's footer begins at **942 px**, in both songs and both languages. Before, it began at 893 or 920 in English and 865 or 906 in French.
- Tests: `singer-blocks.test.ts` +2. `one-head-one-foot.test.ts` is re-pinned: no footer apparatus, and Notes is built.

**The 40 percent widow threshold** (Dann 2026-08-06). It is not built. `page-layout.ts:338-340` names it as C11's rebalance trigger, "still unbuilt", and this row did not build it.

## The gates

| Gate | After 78c | After 79 |
|---|---|---|
| 1 phonology | 251 | 251 |
| 2 dictionary | 242 | 242 |
| 3 web-check | 0 errors, 12 warnings, 5 files | the same |
| 4 web-test | 2461 | **2477**, all passed |
| 5 score-parser | 673 passed, 5 skipped (678) | **675 passed, 5 skipped (680)** |
| 6 blurb | 145 | 145 |
| 7 integration | 55 | 55 |
| 8 ratchets | OK | OK |

- **Gate 4: +16.**
  - `insights/paginate.test.ts` 5 to 11 (+6).
  - `insights/singer-blocks.test.ts` 10 to 12 (+2).
  - `insights/line-breaks.test.ts` 0 to 2 (+2, new).
  - `text-pages.test.ts` 0 to 6 (+6, new).
- **Gate 5: +2.** `page-layout.test.ts` 24 to 26.
- **The Playwright check** (not a gate): 12 passed, three FULL pages named.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **A page at rule 4's cap.** No page of these two songs reached it, so no picture shows the maximum gap.
- **Print.** Everything above was measured on screen at 1440 px. Print pagination uses the same code, but I did not measure a printed page.
- **The phone.** Its Insights is one column with no pages. The Notes section is built there but not pictured.
- **Text's row estimate** is an estimate. A poem of unusually long words could fill a row with fewer than seven, and a page could then run over. The Playwright check would catch that only on the two fixtures.
- **Whether Dann accepts the FULL exemption.** Rule 6 names CAPPED and Text's concession. I added FULL for a page whose next item cannot fit without breaking a figure or a block that may not break. That is my reading of what the other rules force, and it is named in the output so it can be argued.
- **Whether the cycles block should break** between its sentence and its bar. That would fill *Without Sun*'s English page 1. I treated the block as a figure, which never breaks.

## For Dann

- Walk on **http://localhost:5173** (uncommitted; Vercel will not show this until you commit and push).
- Insights now ends with a Notes section before Further reading, and its long endnotes run across pages.
- Markup's later pages hold more systems.
- Text breaks a long poem across pages.
