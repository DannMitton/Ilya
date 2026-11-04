# Report: Insights Further reading, step 2 (consolidated list) (r1)

Brief: `brief-code-insights-further-reading_r2_2026-11-03.md` with the Fable review's amendments 1, 4, 5, 6, 7, 10. Branch `cloud-lane-33`, built on `26d89fd`. Paths are under `apps/web/src/lib/` unless stated.

## What changed

1. **One pass, one block per work (`insights/further-reading.ts`, new).** `furtherReading(comments, {language, pitchOf, barOf})` groups every observation's `rows` by `ROWS[id].work`, in `worksCited` order (alphabetical by author, then year). Each work gives `{ reference, topics }`: the full reference once (`fullReference`) and one line per topic.
2. **Topic order (amendment 1).** Topics run in the order of `i.comments`, which is performance order (`comments.ts:436-437`); nothing is re-sorted by bar. A test puts bar 9 before bar 6 and checks the order holds.
3. **Merging (amendment 10, DESK DEFAULT).** Two observations with the same vowel, pitch, and printed bar under one work make one topic with the union of their rows, each passage once.
4. **Passages and joiners (amendment 7).** Within a passage, comma-separated: `pagesText` (so "pp. 18 to 19" in English and « p. 18-19 » in French), then the heading if read, then the quotation in “ ” or « » (`passageText`, `comment-sources.ts`, which replaces `rowReference`). Between passages, "; ". Passages are in page order within a topic (first page, last page, row id). The topic label ends with a colon and one space. `pagesText` sets "p." and the number with a no-break space (`comment-sources.ts:133-134`), as it did; French quotations keep their no-break spaces inside « ».
5. **Block shape (amendment 6).** Kind `endnote` kept: `{ kind: 'endnote'; heading?; teacher?; reference: Run[]; topics: Run[][] }` (`singer-blocks.ts`). It stays in `BREAKS` (`InsightsPane.svelte:423`), so a long resource breaks between its lines with two lines on each side, as every prose block does. I dropped the brief's "keep each block whole" sentence, as the review directs. The heading and teacher line C ride on the first block only (`singer-blocks.ts`, `first.heading`, `first.teacher`).
6. **Pitch (amendment 5).** `pitchOf: (r) => string` added to `BlockInputs`, beside `barOf`, fed from the pane by `commentPitch`, the lookup `commentTag` already used, through `P`. `commentTag` now reads `commentBar` and `commentPitch` instead of repeating both lookups. `InsightsPane.svelte` is at its ratchet ceiling (760 of 760); the change nets zero lines. The tag text is unchanged (same lookups).
7. **Drawn (`SingerBlock.svelte`).** The endnote draws the reference as `p.reference` and each topic as `p.reading-topic` (indented 18px). The `<ol class="references">`, the `.tag` line, and the `.references` style are gone.
8. **Removed.** `RenderedComment.references` and `rowReference` (the only consumer was `comment-text.ts`). The endnote's `tag`. `rows` (step 1) is what Further reading reads.
9. **Strings (DESK DRAFTS, not ratified).** `insights.r2.readingTopic` EN "[{vowel}] on {pitch}, bar {bar}:" / FR « [{vowel}] sur {pitch}, mesure {bar} : » (no-break space before the colon, per OQLF), marked as a draft in `i18n.ts`. `{pitch}` is formatted by `pitchName`, as the file formats pitches in each language.
   **One string beyond the brief:** `insights.r2.readingTopicNoPitch` EN "[{vowel}], bar {bar}:" / FR « [{vowel}], mesure {bar} : », used only when `pitchOf` returns '' (amendment 5 says it returns '' where no pitch), so the line never reads "on ,". I coined it; Dann rules on it. The header index of `i18n.ts` was updated (`insights.` 146 to 148, total 1,123 to 1,125).

## Tests

- New `insights/further-reading.test.ts`: the brief's Reid example exactly (one entry, both passages, one semicolon, page order); one work cited by two observations (one entry, two topic lines, observation order, bar 9 before bar 6); a merge; a row with a heading and no quotation; a row with neither; alphabetical works with each reference once; page range and quotation marks in both languages; the no-pitch fallback; empty input; the drawn endnote (one `reference`, one `reading-topic` per topic, no `<ol>`).
- `comments.test.ts`, new `describe` "Further reading loses nothing": on the fixtures' whole page, both languages, every row any observation cites appears under its work with its page, heading, and quotation, one full reference per work, no missing string.
- Control: I broke `furtherReading` on purpose (it kept only the first row per topic and dropped merged rows); four tests failed, including both "loses nothing" tests. I restored it; all 286 pass.
- Rewritten, not deleted: `singer-blocks.test.ts` (fixture loses `references`, gains `pitchOf`; the endnote test now counts topics; a new test builds one endnote per work and checks which block carries the heading and teacher line), `comments.test.ts` (the `references` assertions now read `rows`).

## The eight gates after step 2

| Gate | Step 0 | Step 2 |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files (978 files) |
| web-test | 3927 passed, 1 skipped | 3951 passed, 1 skipped |
| score-parser | 785 passed, 5 skipped | same |
| blurb | 148 | 148 |
| integration | 98 | 98 |
| ratchets | OK | OK |

## Reported, not changed

- `insights.r2.teacherC` ("Review these sources with your voice teacher, ...") still heads the list; its words still fit a list of resources (review finding 8).
- `RenderedComment.count` ("N more things to explore") is still built and still drawn nowhere I searched (`apps/web/src/lib/insights` only). NOT ESTABLISHED for the rest of the app.

## NOT ESTABLISHED

- How the list looks on screen and on paper (indent, spacing between a reference and its topics, the break behaviour of a long resource). Not rendered here; step 4 tries the Playwright page-fill test.
- Whether a long work (many topics) breaks cleanly across a page. The rule is the existing one; I did not measure a page.
