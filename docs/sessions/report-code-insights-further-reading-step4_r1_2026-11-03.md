# Report: Insights Further reading, step 4 (tests, gates, the live render) (r1)

Brief: `brief-code-insights-further-reading_r2_2026-11-03.md`, step 4, with review amendments 8 and 11. Branch `cloud-lane-33`, built on `db4013b`. No code changed in this step; it adds this report. The tests the brief lists were written with the steps they test.

## The brief's tests, and where each is

| The brief asks for | Where |
|---|---|
| One work cited twice by one observation: one entry, both passages, one semicolon | `insights/further-reading.test.ts`, the brief's Reid example, character for character |
| One work cited by two observations: one entry, two topic lines | `further-reading.test.ts` (bar 9 before bar 6; observation order, never re-sorted by bar, amendment 1) |
| A row with a heading and no quotation; a row with neither | `further-reading.test.ts` (`KVP2-022`; `PVA2-B-014`) |
| Two observations on the same vowel, pitch, and bar | `further-reading.test.ts` (merge, amendment 10) |
| Hidden suggestions: second paragraph present, short citations kept | `insights/comments.test.ts` ("the second paragraph holds the hidden suggestions"), both languages; `insights/second-paragraph.test.ts` draws it |
| The `lean` exception (amendment 11) | `comments.test.ts` (a forced hidden `lean`: no citation, no added printed row) |
| "All of them" on: no second paragraph | `comments.test.ts`, both languages |
| Nothing lost: every cited row appears under its work | `comments.test.ts` ("Further reading loses nothing"), both languages, on the fixtures' whole page |
| Both languages | `comments.test.ts`, `further-reading.test.ts`, `draft-strings.test.ts` |
| Screen and print | One snippet and one block draw both (`SingerBlock.svelte`). The only difference is the screen-only "N more observations" block, which is unchanged (`singer-blocks.ts`, `screenOnly`); `second-paragraph.test.ts` shows the paragraph inside it too |
| The tests the change breaks, rewritten (amendment 8) | `singer-blocks.test.ts` (one endnote per observation became one per work; fixture gained `rows`, `otherApproaches`, `pitchOf`), `comments.test.ts` (`printedRows`; `references` became `rows`) |

## `pages-without-gaps.test.ts` for Insights

Run in this sandbox, not part of the eight gates: a dev server (`vite dev`, not `pnpm dev`, which would first fetch models) with Chromium at `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` through `PW_CHROMIUM_PATH` (the override in `apps/web/playwright.config.ts`). Without the override the test could not launch (it wants Chromium revision 1208). Result: **8 passed** (both fixtures, English and French, "no page but the last is more than 15 percent empty" and "nothing on any page reaches its footer").

One FULL line prints: Without Sun, French, page 2, 27.1 percent empty (236 px), page 3's first item needs 477 px and the page has 180. The same test at the step 0 commit (`ff41dd0`) printed two FULL lines: page 1, 16.5 percent empty, and page 2, 36.5 percent empty (318 px; needs 477, has 262). So that note is not new, and the page is fuller than before.

## The live render

I rendered both fixtures through the dev server (1440 px wide) and read the screenshots and page text.

- **Page counts are unchanged from step 0**, measured on both commits: Without Sun 3 pages in English and 4 in French; Tchaikovsky 6 in both.
- **The second paragraph reads as a plain second paragraph of the same observation,** no label, before teacher line A. In Without Sun, English, the bar 6 observation reads: "You can also come at it differently. Consider easing into the note with a slight decrescendo, ... (Reid, *Voice: Psyche and Soma*, 1975, p. 66). You can experiment with ... (Miller, *Solutions for Singers*, 2004, pp. 76 to 77)." In French: « On peut aussi s’y prendre autrement. Vous pouvez songer à ... ».
- **Further reading, Without Sun, English (page 3):** five resources, each with its full reference on its own line and one indented topic line, for example "[u] on A3, bar 6: p. 65, “vowel is incapable of being articulated in the upper tonal regions”; p. 66, “there will be no real reason for modifying the vowel any longer”". Nothing reaches the footer.
- **Tchaikovsky, a long list:** the list starts at the foot of page 4 and breaks between lines onto page 5 and on to page 6, with open squircle edges as the page-filling rules draw them. The five observations' second-paragraph sentences alternate (b, a, b, a, b); with a pool of two, three of five must repeat. `one.b` and `many.b` are the same sentence by the brief's words, so "You can also come at it differently." appears three times on that document.

## Things for Dann, not changed

1. **A quotation repeats under every topic that cites it.** In Tchaikovsky, Miller 1986, p. 158 prints its quotation under three topics, and Miller 2004 prints a quotation under each of five. That follows the ruled design (one line per topic, each with its passages), and the page count did not grow. A topic could name a passage once per resource instead; that is a design change, not mine.
2. **A topic line can break across pages.** Page 5 ends in the middle of Reid's first topic line ("... p. 66,"), because the break rule allows a break between any two lines with two lines on each side (`line-breaks.ts`). The brief's "keep whole" wording was dropped by the review (amendment 6).
3. **Teacher line A** ("Discuss this approach with your voice teacher.", `i18n.ts:1905`) now follows two paragraphs of approaches. The singular reads oddly there. The wording is Dann's.
4. **The French references print the author in capitals** ("BOZEMAN, Kenneth."), as `fullReference` already did in the old endnotes; not changed.
5. **The new strings are drafts** (`draft-strings.test.ts` pins them). `insights.r2.readingTopicNoPitch` is my addition, beyond the brief.
6. The rotation's "page" is the whole Insights document (`rotate` receives every comment of the song, `comment-text.ts`), as it was for lead openers.

## The eight gates

Unchanged by this step; the last full run was at the step 3 code (`db4013b` carries no code after it).

| Gate | Step 0 | Now |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| web-test | 3927 passed, 1 skipped | 3959 passed, 1 skipped (+32: the new tests) |
| score-parser | 785 passed, 5 skipped | same |
| blurb | 148 | 148 |
| integration | 98 | 98 |
| ratchets | OK | OK (`InsightsPane.svelte` 760 of 760) |

## NOT ESTABLISHED

- The look on paper (print dialogue, A4): the Playwright suite and my screenshots are screen renders at letter size; print was not run.
- The phone layout of the list (`e2e-phone` was not run).
- Whether anything outside `apps/web/src` reads `RenderedComment.references` or `printedRows`, both of which changed (only `apps/web/src` was searched).
- Whether `RenderedComment.count` is drawn anywhere in the app.
