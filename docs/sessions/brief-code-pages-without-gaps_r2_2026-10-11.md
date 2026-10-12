# Brief for Code: no empty space mid-document in Text, Markup, and Insights (r2, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 21:55 as r1; r2 at about 23:10 applies Fable's nine amendments (`docs/sessions/review-fable-briefs-78-80_r1_2026-10-11.md`). QUEUE row 79. For the cloud lane, **Opus** (it rewrites pagination in three documents), after row 78c is merged into the lane. The rules are Dann's ratification of 21:50, in `docs/memory/PRODUCT.md`, "No empty space mid-document". Read that section whole first.

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
- **An older ruling that agrees, found by the desk 23:10 (`claude/e28-handover_v1_2026-08-06.md` in project knowledge, snippet read): Dann 2026-08-06, "Vertical: fill full pages, leave the last short, and the short page repeats the spacing the full pages established so it reads as intentional", and "Widow threshold is FILL, not bar count, at 40%" (ruled, not built then).** So the last page does not share out its space; it repeats the spacing of the full pages before it. Whether the 40% widow threshold was ever built is NOT ESTABLISHED; check the tree and report.
- The method line prints in the apparatus of EVERY Insights page today (`InsightsPane.svelte:268-271` chooses `insights.method.typed`, `.untyped`, or `.silent`; `:478`, rendered per page at `:564`), not page 1 only.

## 3. Measure before you change anything

Take this table only after row 78c is merged into the lane (it changes system heights and line counts). For Insights, Markup, and Text, on *Without Sun*, no. 1 and the Tchaikovsky song (Op. 38 no. 3), English and French, desktop: the page count and, for each page but the last, the empty share above the footer. Report the table before any code changes. This is also the test of rule 6's first run.

## 4. The work, one rule at a time (PRODUCT.md numbering)

1. **Order** stays as it is.
2. **Finer breaks.** In Insights, a paragraph block may split between lines, keeping at least two lines on each page; an endnote splits between its suggestions and between its references; a heading stays with the part after it. Build it in `paginate.ts` (pure, with tests) and the measuring pane. Text and Markup: apply wherever they set prose. In Text, a stanza is treated as a paragraph for this rule (DESK DEFAULT; two lines minimum on each page); if Text sets no prose that can break, say so and move on.
3. **Figures float**: in `paginate.ts`, a figure block that does not fit goes to the top of the next page and the following prose blocks of the same squircle fill the space before it; never more than one page, never ahead of the block that introduces it.
4. **Music pages share out leftover space** between their systems, up to a maximum gap (DESK DEFAULT: twice the normal gap between systems; report it and send pictures at that value); beyond it the rest stays at the foot (`PRODUCT.md` rule 4). The last page does not share out; it repeats the spacing of the full pages (Dann 2026-08-06, section 2). No copy of the Gould extraction is in the repository, and the cloud lane cannot read project knowledge (`ENVIRONMENT.md:4694`); the desk's search of project knowledge found no Gould rule on vertical justification (snippets only, NOT ESTABLISHED that none exists). Mark the maximum JUDGEMENT in a comment.
5. **No type size changes.**
6. **The check**: a test over the fixture songs that fails when any page but the last is more than 15 percent empty, naming the song, document, language, and page. A page whose emptiness is what rule 4's maximum leaves is not a failure: the test reports it as CAPPED with the figure. Text's sixth-system concession is exempt likewise and named. Fixtures: name each one used; `sunless-01-engraved` is in `packages/score-parser/src/approval/__approved__/`; whether a Tchaikovsky Op. 38 no. 3 fixture exists in the tree is NOT ESTABLISHED (find one or say so).
7. **Insights' notes become endnotes** (PRODUCT.md rule 7). Move the page footnotes (the `apparatus` element under each page's column; today the Pacheco note on page 2) and the method line (`insights.method.typed`, `.untyped`, or `.silent`, `InsightsPane.svelte:268-271`, which today prints on every page) into a section headed `Notes` / `Notes` at the end, before the sources box. The method line is the LAST item of Notes. The section is unboxed (`group: 'free'`), in the small type `insights.r2.sourcesLine` uses (`singer-blocks.ts:356`, `small: true`) (DESK DEFAULT; the desk has told Dann it is not a fourth box). The phone's one-column flow (`InsightsPane.svelte:532-545`) has no pages and carries the apparatus in its one footer; the Notes section appears there too, at the end, and the footer loses the footnote and the method line alike. Markers in the text stay as they are and keep their numbers. The French heading is « Notes ». After this, every Insights page has the same room above the footer; say so with the measured figure.

## 5. Constraints

No type size, margin, or stave size changes. Never break inside a figure or a music system, and never leave fewer than two lines of a paragraph on either page. The squircle's open edges keep their accepted drawing. Do not touch `tools/e16-harness/`, `third_party/homr-web/`, or `apps/web/src/lib/omr/`. Do not edit `docs/memory/` except row 79's State. **Displaces:** nothing.

## 6. Done when

Section 3's table again, after; Insights for *Without Sun*, no. 1 in three pages or fewer (by the desk's arithmetic it should be three; that is a prediction, not a requirement); pictures of every page of the three documents for both songs, before and after, English and French; the eight gates. `WRITTEN`; DONE is Dann's walk.

## 7. Report back

`docs/sessions/report-code-pages-without-gaps_r1_2026-10-11.md`: the before and after tables, what changed with `path:line`, the maximum gap chosen and why, the Gould finding, the gates, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Commit and push the lane's branch only. Set row 79's State and stop.
