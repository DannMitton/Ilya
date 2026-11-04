# Brief for Code: Insights, Further reading as one list of resources, and other approaches as a second paragraph (desk, r1, 2026-11-03 23:0x)

Ruled by Dann 2026-11-03 22:41 to 22:53 (`docs/memory/OPEN.md`, last section, "INSIGHTS: FURTHER READING IS ONE CONSOLIDATED LIST OF RESOURCES"). Lane `cloud-lane-33` from `origin/Shane`; one commit and one report per step, push after each; never `Shane` or `main`, never `docs/memory/`. Every code claim with a file and line; NOT ESTABLISHED where you cannot establish. Fable reviews this brief in its final form before you get it.

## What the singer and her teacher meet

1. **Where this piece meets your voice.** Each observation reads as today: the one suggestion per challenge (`orderSuggestions`, `comment-text.ts:131-154`), each with its short citation. If the observation has other approaches (today's `hidden`: the alternatives and the tap-only suggestions), they follow as a **plain second paragraph of the same observation, same type, no label**. Its first words say these are other approaches (opener drafts below), and each suggestion keeps its short citation.
2. **Further reading.** One consolidated list of resources for the whole song. Each resource appears once, its full reference on its own line. Under it, one indented line per topic it is cited for: the topic in plain words, then each page with its passage, passages joined by semicolons:

   > Reid, Cornelius L. *Voice: Psyche and Soma*. New York: Joseph Patelson Music House, 1975, third printing 1999. ISBN 0-915282-00-3.
   >     [u] on A3, bar 6: p. 65, “vowel is incapable of being articulated in the upper tonal regions”; p. 66, “there will be no real reason for modifying the vowel any longer”

   The topic says in words what today's tag «m. 6 · A3 · [u]» encodes (`singer-blocks.ts:383`). Topics run in the song's order, bar by bar; a topic with one passage shows it plainly (DESK DEFAULTS). The heading and the teacher line stay (`comment.tap`, `insights.r2.teacherC`, `singer-blocks.ts:384-387`).
3. **Nothing is lost.** Every row any observation cites appears in Further reading under its resource, with its page, its heading if read, and its quotation if read (as `rowReference` prints them, `comment-sources.ts:165-171`); every hidden suggestion appears in its observation's second paragraph. Screen and print show the same.

## Steps

0. **Measure, change nothing.** Name, with lines: where `references` and `hidden` are built (`comment-text.ts:309-313`, `:401-434`); how `endnote` and `comment` blocks render (`SingerBlock.svelte:94`, `:161`); the opener rotation and its page rule (`rotate`, `comment-text.ts:186-230`; `PRODUCT.md`, "A SUGGESTION IS AN OFFER") and which openers hidden suggestions take today; the "All of them" setting (`o.all`) and the screen-only `more` block (`singer-blocks.ts:290-301`), which stay as they are; how pages are filled for Insights (`InsightsPane.svelte:423`, `pages-without-gaps.test.ts`). Run the eight gates for a baseline.
1. **The second paragraph.** The `comment` block carries its hidden suggestions as a second paragraph; the `endnote` block no longer carries suggestions. The paragraph opens with an alternative opener (strings below), then the suggestions in today's order, each with its short citation; the rotation's page rule covers the new opener. With "All of them" on, nothing is hidden, so there is no second paragraph.
2. **Further reading consolidated.** Replace the per-observation `endnote` blocks with one list built in one pass over every observation's cited rows: group by work (`ROWS[id].work`, `WORKS`), one full reference per work (`fullReference`, `comment-sources.ts`), then topic lines. A topic is one observation (vowel, pitch, bar); its passages are that observation's rows of that work, in page order, each as "p. N" or "pp. A to B" (`pagesText`, `:131-135`), then the heading if read, then the quotation, joined by semicolons. Works in today's order (`worksCited`, alphabetical by author then year, `:174-178`). Keep each resource's block whole across a page break where the page-filling rules allow, as today's endnotes do.
3. **Strings** (desk drafts; Dann has ruled the design, not these words):
   - topic line: `insights.r2.readingTopic` EN "[{vowel}] on {pitch}, bar {bar}:" FR « [{vowel}] sur {pitch}, mesure {bar} : » (adopted: « mesure {bar} », `insights.r2.unlikely.range`; {pitch} formatted as the file already formats pitches in each language).
   - alternative opener: `insights.r2.otherApproaches` EN "Another way in:" FR « Autre piste : » (coined by the desk; Dann may prefer "Alternatively,", FR « Sinon, »).
4. **Tests and gates.** A song whose observations cite one work twice (one entry, both passages, one semicolon), a work cited by two observations (one entry, two topic lines in bar order), a row with a heading and no quotation, a row with neither; an observation with hidden suggestions (second paragraph present, short citations kept) and with "All of them" on (no second paragraph); both languages, screen and print; `pages-without-gaps.test.ts` for Insights still green. The eight gates against step 0.

## Done

Steps 0 to 4 pushed with reports; Further reading names each resource once; every passage and every hidden suggestion still appears; nothing else in Insights changes.
