# Report: Insights Further reading, step 1 (the second paragraph) (r1)

Brief: `brief-code-insights-further-reading_r2_2026-11-03.md` with the Fable review's amendments 2, 3, 4 (in part), 9, 11. Branch `cloud-lane-33`, built on `2c9bdb8`. Paths are under `apps/web/src/lib/` unless stated.

## What changed

1. **Strings (DESK DRAFTS, not ratified).** Four keys added exactly as the brief gives them, with a comment above them saying they are drafts (`i18n.ts`, before `comment.more.one`):
   - `insights.r2.otherApproaches.one.a` "There is another way in." / « Il existe une autre approche. »
   - `insights.r2.otherApproaches.one.b` "You can also come at it differently." / « On peut aussi s’y prendre autrement. »
   - `insights.r2.otherApproaches.many.a` "There are other ways in." / « Il existe d’autres approches. »
   - `insights.r2.otherApproaches.many.b` "You can also come at it differently." / « On peut aussi s’y prendre autrement. »
   The header index of `i18n.ts` (key count, `insights.` 142 to 146, total 1,119 to 1,123) was updated; `i18n-index.test.ts` enforces it and failed until I did.
2. **Rotation, path (b) (`insights/comment-text.ts`).** `PARAGRAPH_OPENERS = ['a', 'b']`; `Voicing` gains `paragraph`; `rotate` keeps a `usedParagraphs` set beside `usedLeads` and picks from `seed + k`, skipping a variant already used on the page, and repeating only when both are used. Only a comment with hidden suggestions takes a variant. Nothing else in `rotate` changed: hidden suggestions keep their closers and their within-comment opener rule (`comment-text.ts` closers line, and the `strict` pass). The pool is keyed by variant letter, not by text, so `one.a` and `many.a` count as alike. That is stricter than the text strictly needs; DESK DEFAULT.
3. **`RenderedComment` (`comment-text.ts`).** Added `otherApproaches: Run[]` (empty when nothing is hidden, so empty with "All of them") and `rows: string[]` (the deduplicated list already built, in its order; amendment 4). `printedRows` now includes every suggestion that prints, hidden ones too, still excluding `cite: false`. **`references` stays for now** (the endnote still draws it); step 2 replaces it with the consolidated list and removes it.
4. **The paragraph (`insights/SingerBlock.svelte`).** In the `comment` snippet, a second `<p class="body">` after the first and before the placeholder note and teacher line: the opening sentence, then each hidden suggestion with its short citation. No label, same type. The one snippet serves the page and "N more observations".
5. **The endnote no longer carries suggestions** (`singer-blocks.ts`, type and builder; `SingerBlock.svelte` endnote branch). It is still built for each observation with references, with its tag and references, until step 2.

## Tests

- New `insights/second-paragraph.test.ts` (renders `SingerBlock` with `svelte/server`): second paragraph follows the first and precedes the teacher line; none when nothing is hidden; present inside `more`.
- `comments.test.ts`, new `describe`: sentence by count (one hidden reads "one", several read "many", both occur on the fixtures); no paragraph where nothing is hidden and with "All of them" on, in both languages; hidden short citations kept in both languages, with `lean` excluded as the review's amendment 11 says (exercised by a forced hidden `lean` case); `rows` and `printedRows`; the rotation differs for the first two observations with hidden suggestions for twelve seeds; the suggestions' closers unchanged; all four strings in both languages end in a period, no "piste" in French.
- Rewritten, not deleted: `comments.test.ts` `printedRows` assertion (now `['RMR-057', 'PVA2-C-025', 'REID-057', 'MIL04-008', 'MCK-049']` for D4 [u]: the consequence rows, then the hidden `decrescendo`, `preface`, and `legato` rows; `lean` adds none) and the corpus string check (now also reads `otherApproaches`). `singer-blocks.test.ts` fixture gains `otherApproaches` and `rows`; a test asserts the endnote carries no suggestions.

## The eight gates after step 1 (against step 0)

| Gate | Step 0 | Step 1 |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files (976 files, was 975) |
| web-test | 3927 passed, 1 skipped | 3939 passed, 1 skipped (+12: the new tests) |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 148 | 148 |
| integration | 98 | 98 |
| ratchets | OK | OK |

A first web-test run failed two tests in `i18n-index.test.ts` (the key index, above). I fixed the index and re-ran web-test in full; the table shows that second run. web-check ran before the index edit, which touched only a header comment.

## Reported, not changed (amendment 9)

`insights.r2.teacherA`, "Discuss this approach with your voice teacher." (`i18n.ts:1905`), now follows a paragraph of several approaches wherever an observation has hidden suggestions. The singular reads oddly there. The wording is the owner's.

## NOT ESTABLISHED

- The look of the second paragraph on screen and on paper. It inherits `.body`; I did not render a page.
- How often two observations on a real page have hidden suggestions (the rotation test uses the test fixtures only).
- Whether the added paragraph keeps `pages-without-gaps.test.ts` green; that is step 4.
