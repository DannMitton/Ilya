# Report: Insights Further reading, step 5 (plural teacher line, `count` removed) (r1)

Orders: Dann's step 5, from Fable's review of the build (amendments 1 and 6). Branch `cloud-lane-33`, built on `9177ee3`. No pull request; nothing under `docs/memory/`; `Shane` and `main` untouched. Paths are under `apps/web/src/lib/` unless stated.

## What changed

1. **`insights.r2.teacherA.many` (`i18n.ts`, after `teacherA`).** EN "Discuss these approaches with your voice teacher." FR « Discutez de ces approches lors de vos cours de chant. » The comment above it says it is RATIFIED by Dann 2026-11-04 09:34, English and French. It has no colon, so no OQLF space applies; the apostrophe rule does not arise (no apostrophe in either string).
2. **The teacher line A site (`insights/singer-blocks.ts`, `moment`, read again before editing).** `teacher` is still present only where `suggestsApproach(c)` holds (a visible suggestion), as today. When it is present it is `insights.r2.teacherA.many` if `c.hidden.length > 0`, the condition that draws the second paragraph (`SingerBlock.svelte`, `{#if c.hidden.length}`), else `insights.r2.teacherA`. `moment` feeds both the page and the screen-only "N more observations" block (`singer-blocks.ts`, `i.more.map(moment)`), so both follow. The other use of `teacherA`, under "no better key" in the conclusion (`singer-blocks.ts:205`), is not an observation and keeps the singular.
3. **`RenderedComment.count` and `comment.count.one` / `comment.count.many` removed** (amendment 6). `comment-text.ts` no longer builds or declares it; `n` stays, since it picks the opening sentence's count.
4. **Stale fixture fields removed** at `second-paragraph.test.ts` (`references: []`, and `count: ''`), and `count: ''` in the `singer-blocks.test.ts` fixture.
5. **Header counts of `i18n.ts`:** total 1,125 to 1,124 (one key added, two removed); `insights.` 148 to 149; `comment.` 42 to 40. `i18n-index.test.ts` enforces them and passes. A comment above the `comment.*` furniture, which said the counts were ratified 2026-09-30, now says they were removed on 2026-11-04 because nothing drew them.

## The grep for amendment 6, before removing

All run over `apps/web/src`, `*.ts` and `*.svelte`, from `/home/user/Ilya` at `9177ee3`:

- `grep -rn "comment\.count" . --include=*.ts --include=*.svelte`: three hits only. `i18n.ts` (the two keys) and `insights/comment-text.ts` (the one read, in `renderComment`).
- `grep -rnw "count" lib/insights --include=*.ts --include=*.svelte`, less unrelated words (`countWord`, the cycle-dose files): the only reads or writes of `RenderedComment.count` were `comment-text.ts` (declaration, build, return), the two test fixtures (`singer-blocks.test.ts`, `second-paragraph.test.ts`) and `comments.test.ts` (the `forced` helper's `count: r.count`, three assertions on the strings "1 more thing to explore", "2 more things to explore", "3 more things to explore", and the corpus join). No `.svelte` file reads it, and neither does `singer-blocks.ts`, `further-reading.ts`, or `InsightsPane.svelte`.
- `grep -rln "RenderedComment|renderComments|renderComment\b" .`: nine files, all under `lib/insights/`.
- Beyond the brief: the English and French strings searched across `apps packages scripts tests tools` (`*.ts`, `*.svelte`, `*.js`, `*.mjs`, `*.json`, `node_modules` excluded): nothing but the files above. The only other hits were unrelated English prose in two comments.

The condition (nothing but `comment-text.ts` and tests reads them) held, so I removed them. The three `comments.test.ts` assertions now check `r.hidden` length (1, 2, 3), which is what the strings counted.

## Tests

- `ratified-lines.test.ts`: pins `teacherA.many` in both languages, cited to Dann 2026-11-04 09:34.
- `singer-blocks.test.ts`: an observation with hidden suggestions gets the plural line and one without gets the singular, in English and French, on the page and inside "more" (the order is reversed in `more` so a swap would show); an observation that only describes gets no teacher line.
- Control: with the condition forced to the singular, the new test failed (1 of 25); restored, 25 pass.

## The eight gates, and the page-fill test

| Gate | Step 0 | Step 5 |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files (979 files) |
| web-test | 3927 passed, 1 skipped | 3961 passed, 1 skipped |
| score-parser | 785 passed, 5 skipped | same |
| blurb | 148 | 148 |
| integration | 98 | 98 |
| ratchets | OK | OK (`InsightsPane.svelte` 760 of 760, unchanged) |

Insights page-fill (`e2e/pages-without-gaps.test.ts`, `-g insights`, `vite dev` plus `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`, as in step 4; outside the eight gates): **8 passed**. The one FULL line is the step 4 line, unchanged (Without Sun, French, page 2, 27.1 percent empty, page 3's first item needs 477 px, the page has 180).

Live render, Tchaikovsky, both languages, 6 pages in each (unchanged): the plural line prints under the observations with a second paragraph and the singular line appears nowhere in the page text (`Discuss this approach ` / « Discutez de cette approche » count 0). The counts of plural hits in the page text are inflated because a block cut across pages repeats its text; I do not report them as a number of observations.

## Observed, not changed

An observation with hidden suggestions and no visible one would draw the second paragraph with no teacher line, since `suggestsApproach` requires a visible suggestion. I did not find a case: `orderSuggestions` shows at least one primary when the comment has a spoken challenge (`comment-text.ts`, `orderSuggestions`), and `speaks()` limits the page to those. NOT ESTABLISHED for every possible comment; I did not enumerate challenge combinations.

## NOT ESTABLISHED

NOT ESTABLISHED beats a complete invented answer. These I did not establish:

- The look on paper (print dialogue, A4) and on the phone layout (`e2e-phone` was not run).
- Whether anything outside `apps/web`, `packages`, `scripts`, `tests`, `tools` reads `RenderedComment.count`, `comment.count.*`, `RenderedComment.references`, or `printedRows`.
- Whether `lean`-only hidden cases or a comment with no visible suggestion can occur on a real score (see above).
- The French strings were not reviewed by me beyond the pin; they are Dann's, ratified 2026-11-04 09:34.
