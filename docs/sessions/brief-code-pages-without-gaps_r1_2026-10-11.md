# Brief for Code: no empty space mid-document in Text, Markup, and Insights (r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 21:55. QUEUE row 79. For the cloud lane, Sonnet, after row 78; or Code on the Mac. The rules are Dann's ratification of 21:50, in `docs/memory/PRODUCT.md`, "No empty space mid-document". Read that section whole first.

## 1. What was observed

Insights for *Without Sun*, no. 1, on the alias at `8e74f39`, Dann's library, desktop Chrome, measured by the desk at 21:39 (each `.paper-page.insights-page` 1056 px tall):

| Page | Content | Content ends | Footer apparatus begins | Empty |
|---|---|---|---|---|
| 1 | title, frame, key, "Where this piece meets your voice" | 759 | 921 | about 160 px |
| 2 | totals box: paragraph (134), bar 17 line (20), "Phonation per pitch" (199) | 487 | 893 | about 400 px |
| 3 | totals box continued: vowel figure (371), two paragraphs (40, 49) | 593 | 921 | about 330 px |
| 4 | sources box, one endnote block (316) | 438 | 921 | last page |

## 2. What is established (read on `cloud-lane` at `b8b07f8`)

- `apps/web/src/lib/insights/paginate.ts:39-72`: blocks are placed whole; a squircle may continue across pages between blocks (`openTop`, `openBottom`); a block that does not fit starts a new page.
- `apps/web/src/lib/insights/singer-blocks.ts:361-370`: each comment's endnote is one block, headed by `comment.tap`.
- Lead, not read: Markup's and Text's pagination live elsewhere (`MarkupPane.svelte`, the Text pane); find them before changing anything.

## 3. Measure before you change anything

For Insights, Markup, and Text, on *Without Sun*, no. 1 and the Tchaikovsky song (Op. 38 no. 3), English and French, desktop: the page count and, for each page but the last, the empty share above the footer. Report the table before any code changes. This is also the test of rule 6's first run.

## 4. The work, one rule at a time (PRODUCT.md numbering)

1. **Order** stays as it is.
2. **Finer breaks.** In Insights, a paragraph block may split between lines, keeping at least two lines on each page; an endnote splits between its suggestions and between its references; a heading stays with the part after it. Build it in `paginate.ts` (pure, with tests) and the measuring pane. Text and Markup: apply wherever they set prose.
3. **Figures float**: in `paginate.ts`, a figure block that does not fit goes to the top of the next page and the following prose blocks of the same squircle fill the space before it; never more than one page, never ahead of the block that introduces it.
4. **Music pages share out leftover space** between their systems, up to a maximum gap (DESK DEFAULT: twice the normal gap between systems; report it and send pictures at that value). Check `gould-vocal-engraving-rules_v6` for vertical justification first; quote the rule if it exists, otherwise mark the choice JUDGEMENT in a comment.
5. **No type size changes.**
6. **The check**: a test over the fixture songs that fails when any page but the last is more than 15 percent empty, naming the song, document, language, and page.
7. **Insights' notes become endnotes** (PRODUCT.md rule 7). Move the page footnotes (the `apparatus` element under each page's column; today the Pacheco note on page 2) and the method line (`insights.method.typed` / `.untyped`, today above page 1's footer) into a section headed `Notes` / `Notes` at the end, before the sources box. Markers in the text stay as they are and keep their numbers. The French heading is « Notes ». After this, every Insights page has the same room above the footer; say so with the measured figure.

## 5. Constraints

No type size, margin, or stave size changes. Never break inside a figure or a music system, and never leave fewer than two lines of a paragraph on either page. The squircle's open edges keep their accepted drawing. Do not touch `tools/e16-harness/`, `third_party/homr-web/`, or `apps/web/src/lib/omr/`. Do not edit `docs/memory/` except row 79's State. **Displaces:** nothing.

## 6. Done when

Section 3's table again, after; Insights for *Without Sun*, no. 1 in three pages or fewer (by the desk's arithmetic it should be three; that is a prediction, not a requirement); pictures of every page of the three documents for both songs, before and after, English and French; the eight gates. `WRITTEN`; DONE is Dann's walk.

## 7. Report back

`docs/sessions/report-code-pages-without-gaps_r1_2026-10-11.md`: the before and after tables, what changed with `path:line`, the maximum gap chosen and why, the Gould finding, the gates, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Commit and push the lane's branch only. Set row 79's State and stop.
