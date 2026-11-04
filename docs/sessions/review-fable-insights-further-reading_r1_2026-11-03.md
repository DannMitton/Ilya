# Review of the brief: Insights, Further reading as one list, other approaches as a second paragraph (r1, 2026-11-03)

Reviewed against `origin/Shane` in the clone at `/home/claude/m177/repo`. Every code claim below carries a file and line read this session. The owner's design is taken as ruled; this review is about how the brief delivers it.

## Verdict

**SEND WITH AMENDMENTS.** The brief names the right files and the right seams, and its example is accurate to the rows (REID-054 is p. 65 and REID-057 is p. 66, `comment-sources.ts:93-106`; the Reid imprint matches `sources.ts:219-230`). Three things would send the coder wrong without a change: the topic order rule, the fixed paragraph opener in French (and its count), and the "keep whole" sentence about page breaking, which describes behaviour the page-filling code does not have. The rest are gaps the coder would otherwise fill by guessing.

## Findings: what the singer and her teacher meet

1. **The second paragraph lands inside "N more observations" too, unasked.** One snippet draws every observation, on the page (`SingerBlock.svelte:96`) and inside the screen-only `more` block (`:100`). Whatever the coder adds to the snippet appears in both. That is the right outcome (same type, same shape), and the `more` block is measured open (`InsightsPane.svelte:557`), so its new height is counted. The brief says `more` "stays as it is"; a coder reading that literally might special-case it away. Say it.

2. **The paragraph opener repeats on every observation of a page.** Today's hidden suggestions sat behind a tap or in endnotes, where a repeated phrase was out of sight. On the page, "Another way in:" opens the second paragraph of every observation that has one. The rotation exists because "place alone makes every song's first comment open the same way, which across a library is the machine tell" (`PRODUCT.md:1041`, DESK DEFAULT of 12:27). The brief's "the rotation's page rule covers the new opener" does not say how: `rotate` only chooses from `OPENERS` for suggestions without a fixed opener (`comment-text.ts:170`, `:227-246`); a string outside that pool is covered by nothing. Amendment 3 decides it.

3. **French: the proposed « Autre piste : » collides with opener 4 and with French capitalization.** Opener 4 in French is « Une piste à explorer : {action} » (`i18n.ts:2035`), so a second paragraph can read « Autre piste : Une piste à explorer : … », one word repeated and two colons. Every French opener begins with a capital (`i18n.ts:2033-2037`), which after « : » is not French usage. Lowercasing the first opener is not a fix: opener 7 begins with the author's name (`:2037`), and the `own` openers are ratified words (`comment-text.ts:65-70`). The same casing problem defeats "Alternatively," in English before "Consider" or "One thing to explore is". A sentence-form opener avoids all of it (amendment 2).

4. **"Another way in:" is singular; the paragraph can hold several.** A closed [u] observation can hide both `decrescendo` and `preface` (`comment-text.ts:84-85`, alternatives go behind the lead, `:147`, `:152`). The file already pluralizes this count (`comment.count.one` and `.many`, `i18n.ts:2061-2062`).

5. **A hidden suggestion can print without a short citation, by design.** `lean` carries `cite: false` because the consequence already cites its row (`comment-text.ts:82`, `:400`). It can land in `hidden` when a comment has three challenges and the visible cap (`COMMENT_DEFAULTS.visibleSuggestions`, 2, `comments.ts:38`; `comment-text.ts:153`) cuts it. The brief's "each suggestion keeps its short citation" and the step 4 test "short citations kept" must allow this one exception or the test is wrong.

6. **"Discuss this approach with your voice teacher" now follows two paragraphs of approaches.** `teacherA` (`i18n.ts:1905`) rides on any observation with a visible suggestion (`singer-blocks.ts:276`, `singer-page.ts:308-310`). The singular reads oddly under a second paragraph. Wording is the owner's; the coder reports it and leaves it (amendment 9).

7. **Two observations can share a topic line.** Repeats and later verses are unrolled (`PRODUCT.md`, "COMMENTS APPEAR IN THE ORDER THE SINGER MEETS THEM"; `comments.ts:436-438`), so two observations can carry the same vowel, pitch, and printed bar and would print two identical topic lines under one work. Amendment 10 decides it.

8. **The heading and teacher line C still ride on the first block** (`singer-blocks.ts:384-387`, `withHeading` at `:402-405`), and teacher line C's words ("Review these sources", `i18n.ts:1906`) still fit a list of resources. No change needed.

## Findings: engineering

9. **Topic order: the brief says "bar by bar"; the code's order is performance order.** `i.comments` arrives as `selectComments(...).shown`, "up to the budget, in performance order" (`comments.ts:436-437`, sorted at `:466`), and the endnotes already iterate it in that order (`singer-blocks.ts:381`). Re-sorting by bar number would reorder an unrolled verse-2 observation ahead of or behind where the singer meets it, and two bars numbered the same would tie. Amendment 1.

10. **Row ids are not exposed to `singer-blocks.ts`.** `RenderedComment` carries `references: Run[][]` (already rendered, `comment-text.ts:313`, `:434`) and `printedRows: string[]` (consequence and visible rows only, `:315`, `:425-426`). The consolidated list needs each observation's row ids to group by `ROWS[id].work`. The brief's "one pass over every observation's cited rows" assumes a field that does not exist. Amendment 4.

11. **`printedRows` changes meaning.** It is "rows the printed page cites: the consequence and the visible suggestions" (`comment-text.ts:314-315`). Once hidden suggestions print in the body, their rows are printed rows. Its only consumer is a test (`comments.test.ts:390-394`; no other use under `apps/web/src`, by `git grep printedRows`). Amendment 4 covers it.

12. **The pitch for the topic line is not available in `singer-blocks.ts`.** `BlockInputs` gives `tagOf` ("m. 6 · A3", built at `InsightsPane.svelte:260-265`) and `barOf` (`:268-270`, `singer-blocks.ts:101-103`), not the pitch alone. Parsing the tag is fragile and language-dependent (`loupe.measureTagShort`). Amendment 5.

13. **"Keep each resource's block whole across a page break where the page-filling rules allow, as today's endnotes do" describes behaviour the code does not have.** Endnotes are in `BREAKS` (`InsightsPane.svelte:423`), so they break between lines with two lines on each side (`line-breaks.ts:1-8`, `:52-55`); a block that does not fit "puts its first part on this page, up to the lowest break that fits" (`paginate.ts:55-60`). There is no preference for keeping a block whole. A block of a kind not in `BREAKS` gets no break offsets (`InsightsPane.svelte:443`) and, when taller than the room, is the one overflow the paginator allows (`paginate.ts:45-46`). A consolidated resource with many topic lines is exactly the block that must break. Amendment 6.

14. **The brief does not say whether to keep the kind `endnote` or add a kind.** Keeping the kind keeps `BREAKS`, the `.references`, `.tag`, and `.teacher-c` styles (`SingerBlock.svelte:161-170`, `:510`), and the e2e test, which reads blocks by DOM position, not kind (`pages-without-gaps.test.ts:75-79`). Amendment 6.

15. **Joiners inside a topic line are ambiguous in the prose.** Step 2 reads "each as 'p. N' or 'pp. A to B', then the heading if read, then the quotation, joined by semicolons", which a coder can read as semicolons between the three parts. The example shows commas within a passage and semicolons between passages. `rowReference` today joins with periods (`comment-sources.ts:167-169`) and uses « » in French (`:169`); `pagesText` gives « p. 65-66 » in French (`:131-135`). Amendment 7.

16. **Existing tests that the change breaks are not named.** `singer-blocks.test.ts:99-105` expects one `endnote` per observation with extras; its fixture builds `RenderedComment` with `references` as runs and empty `printedRows` (`:43-54`); `comments.test.ts:390-394` asserts `printedRows` and `references.length`. Amendment 8.

17. **The suggestions' own rotation needs no change, and the brief does not say so.** For hidden suggestions, closers always print (`comment-text.ts:221`), openers avoid repeating within the comment (`:239`), and the page rule on leads applies only to the first suggestion (`:240`). Moving the paragraph does not move these. Amendment 3 says to leave `rotate` alone except for the paragraph opener.

18. **"The eight gates" are not located for a coder on a fresh lane.** `ENVIRONMENT.md:36` ("Shipping, gates, and the ship script") and `:95` ("THE GATES RUN IN A CLOUD CLONE") hold them. Amendment 11.

19. **Correct as written:** "All of them" leaves nothing hidden (`comment-text.ts:153-154`); the screen-only `more` block and `o.all` stay (`singer-blocks.ts:290-301`, `comment-text.ts:107`); works in `worksCited` order (`comment-sources.ts:174-178`); the heading `comment.tap` is "Further reading" / « Lectures complémentaires » (`i18n.ts:2060`); « mesure {bar} » matches `insights.r2.unlikely.range` (`i18n.ts:1912`); pitches format through `pitchName` in both files (`singer-blocks.ts:146`, `InsightsPane.svelte:294`).

## Amendments

1. **Topic order.** Change "Topics run in the song's order, bar by bar" (step 2 and item 2) and the step 4 test's "in bar order" to: "Topics run in the order of `i.comments`, which is performance order; never re-sort by bar." Reason: finding 9. Evidence: `comments.ts:436-437`, `:466`; `singer-blocks.ts:381`.

2. **The paragraph opener: sentence form, two counts.** Replace step 3's second string with two keys, `insights.r2.otherApproaches.one` and `.many`, each a full sentence that ends with a period, so the suggestion after it keeps its own capital and its own opener in both languages. Desk draft EN: "There is another way in." / "There are other ways in." French, as suggestions for the owner: « Il existe une autre piste. » / « Il existe d’autres pistes. » Drop the "Alternatively," and « Sinon, » alternatives from the brief: they do not join to a capitalized opener. Reason: findings 3 and 4. Evidence: `i18n.ts:2033-2037`, `:2061-2062`; `comment-text.ts:65-70`, `:398`.

3. **How the page rule covers the paragraph opener.** Replace "the rotation's page rule covers the new opener" with one of two explicit paths, and pick one: (a) one string per count, repeated wherever it falls, named DESK DEFAULT in the report; or (b) a pool of two or three sentence-form variants per count, chosen in `rotate` per comment from `seed + k` with a `usedParagraphOpeners` set beside `usedLeads` (`comment-text.ts:214`, `:240-242`), so no two observations on one page open their second paragraph alike where the pool allows. Recommendation: (b), since the whole point of the rotation is this tell (`PRODUCT.md:1041`), and the cost is one set and one pool. In either case add: "`rotate`'s handling of the suggestions themselves is unchanged: hidden suggestions keep their closers (`:221`) and their within-comment opener rule (`:239`)." Reason: findings 2 and 17.

4. **Expose row ids on `RenderedComment`.** Add to step 1: "Add `rows: string[]` to `RenderedComment` (`comment-text.ts:303-318`), the deduplicated list already built at `:421-424`, in that order. `printedRows` now includes every suggestion row that prints, hidden ones included (`:425-426`), since they print; update `comments.test.ts:390-394`. `references` may stay for the tap or go; say which." Reason: findings 10 and 11.

5. **Pitch for the topic line.** Add to step 2: "Add `pitchOf: (r: RenderedComment) => string` to `BlockInputs` beside `barOf` (`singer-blocks.ts:101-103`), fed from `InsightsPane.svelte` by the same lookup `commentTag` uses (`:263`) through `P` (`:294`); return '' where no pitch. Never parse `tagOf`." Reason: finding 12.

6. **Block kind and page breaking.** Replace the "Keep each resource's block whole…" sentence with: "One block per work, kind `endnote`, reshaped to `{ kind: 'endnote'; heading?; teacher?; reference: Run[]; topics: Run[][] }`. Keeping the kind keeps it in `BREAKS` (`InsightsPane.svelte:423`), so a long resource breaks between its lines with two lines on each side, as every prose block does (`line-breaks.ts:52-55`, `paginate.ts:55-60`). If a new kind is added instead, add it to `BREAKS`, or a tall resource becomes the one overflow the paginator allows (`paginate.ts:45-46`)." Reason: findings 13 and 14.

7. **Joiners in a topic line.** Add to step 2: "Within one passage, comma-separated: `pagesText` (so « p. 65-66 » in French, `comment-sources.ts:131-135`), then the heading if read, then the quotation in “ ” or « » as `rowReference` sets it (`:169`). Between passages, a semicolon and a space. The topic label ends with a colon, then one space." Reason: finding 15.

8. **Name the tests the change breaks.** Add to step 4: "`singer-blocks.test.ts:99-105` (one endnote per observation) and its fixture at `:43-54` (add `rows`); `comments.test.ts:390-394` (`printedRows`). Rewrite, do not delete." Reason: finding 16.

9. **Where the paragraph sits, and `more`.** Add to step 1: "The second paragraph is drawn in the `comment` snippet after `.body` and before the placeholder sentence and the teacher line (`SingerBlock.svelte:60-62`), so it appears on the page and inside 'N more observations' alike (`:96`, `:100`). Further reading stays built from `i.comments` only (`singer-blocks.ts:381`): observations behind `more` do not print, so their sources do not print. Report, without changing, that `insights.r2.teacherA` ('Discuss this approach', `i18n.ts:1905`) now follows several approaches; the wording is the owner's." Reason: findings 1 and 6.

10. **Identical topic lines.** Add to step 2: "Two observations with the same vowel, pitch, and printed bar under one work merge into one topic line with the union of their rows, DESK DEFAULT." Reason: finding 7. Evidence: `comments.ts:436-438`.

11. **The `cite: false` exception and the gates.** Add to steps 3 and 4: "`lean` prints no short citation when hidden (`comment-text.ts:82`, `:400`); the 'short citations kept' test excludes it." Add to step 0: "The eight gates: `ENVIRONMENT.md:36` and `:95`." Reason: findings 5 and 18.

## NOT ESTABLISHED

- Whether the owner ruled the words of `insights.r2.teacherA`; the key's history was not read.
- Whether any consumer outside `apps/web/src` reads `printedRows` or `RenderedComment.references` (only `apps/web/src` was searched).
- How often two or more observations on one page carry hidden suggestions on the two tracked fixtures (decides whether amendment 3's path (b) earns its cost); not measured.
- The CSS the second paragraph and the indented topic lines take; `SingerBlock.svelte` styles past line 200 were not read.
- Whether `comment.count` (`comment-text.ts:418`) is drawn anywhere; no use was found in `SingerBlock.svelte` or `singer-blocks.ts`, and the rest of the app was not searched.
