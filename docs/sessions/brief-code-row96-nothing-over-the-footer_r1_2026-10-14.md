# Brief: QUEUE row 96, nothing on an Insights page runs into its footer (r1)

Desk (Opus 5.5), 2026-10-14 about 03:50. For Code (Opus) on Dann's Mac, on `Shane` at `dbe41af` or later. Fable review owed before this is sent (`CONTRACT.md` §1 item 19).

## What the singer sees, and what must be true

On Insights of «Средь шумного бала» (Tchaikovsky, op. 38 no. 3), page 3, on the alias at `6c69161`, the vowel-turn chart's last rows, [ɛ] to [ɑ], print over the page footer's text. Found by Dann 2026-10-14 03:10 from his own screenshot: *"That is unaccveptable and must not be allowed in production"* (transcribed as written).

**Done when:** on every page of Insights, Markup, and Text, in English and French, on screen and in print, nothing in the page's content reaches the top of its footer, whatever the singer opens or closes on the page. A check in the repository fails when that stops being true.

## The desk's leads (DESK INFERENCE, read from the tree at `dbe41af`; none is measured)

1. **A block the pages never count.** `InsightsPane.svelte:446` leaves screen-only blocks out of `paginate`; `:466-470` then adds each to the page of the block before it. Their height is never counted. The one screen-only block is "N more observations" (`singer-blocks.ts:283-292`), a `<details>` (`SingerBlock.svelte:88-92`). Closed, it is one summary line plus the 12 px between blocks, which may fit inside the 40 px kept clear (`CLEAR`, `InsightsPane.svelte:410`). Opened, every hidden observation adds its full height. Dann's walk at 03:10 names «One more observation» on this song (`INBOX.md`), so the block exists there; which page it sits on, and whether he had it open, are NOT ESTABLISHED.
2. **A block measured before it finishes laying out.** The measurer runs once after `tick()`, when the blocks, the fonts, or the language change (`InsightsPane.svelte:428-444`). A block whose layout lands later is measured short.
3. **The check cannot see this fault.** `apps/web/e2e/pages-without-gaps.test.ts:83` reports `empty: footer - bottom`; an overlap gives a negative number, and nothing fails on it.

## Step 1. Measure first; change nothing

- **Instrument.** For each page: the lowest painted content edge in the page column, against the top of the footer's first painted element (the same footer elements `pages-without-gaps.test.ts:69` reads). Overlap is any content edge below the footer's top.
- **Positive control first.** Inflate one block's drawn height by 100 px in a throwaway local edit, confirm the instrument reports the overlap, then revert it. Report the control's reading.
- **Expectation, stated before the measurement.** On `apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml`, with the fully sampled bass voice row 79 used, an overlap appears on the page that holds "N more observations" when it is opened, and on no page when it is closed. Likeliest way this is wrong: the overlap comes from lead 2, or from a voice or setting that differs from Dann's.
- **Run.** Both fixtures row 79 used (`sunless-01-engraved.musicxml`, `tchaikovsky-op38-3-voice.musicxml`), English and French, the list closed and opened, screen at 1440 px and print (Playwright `page.pdf` or the print media type, whichever `print-pages.test.ts` already uses).
- **If no overlap reproduces,** stop and report. Do not fix a cause you have not seen. The desk then asks Dann for his voice and settings.

## Step 2. The fix

- Make "Done when" true. The mechanism is yours; report what you chose and why in one paragraph.
- **Keep:** every rule of row 79 (`PRODUCT.md`, "No empty space mid-document"), the pages counted in row 79's report wherever the fix does not need to move them, and the order of blocks.
- **Opening the list must not push anything into the footer.** If the pages re-flow when it opens, say so in the report; the desk takes that to Dann's walk.
- Print and screen must agree on what each page holds, apart from the screen-only list itself (`PRODUCT.md`, "1. WYSIWYG means what it says", Dann 2026-09-17).

## Step 3. The check

- Extend `pages-without-gaps.test.ts`, or add a test beside it, so that any page whose content reaches its footer fails, for all three documents, both languages, the list closed and opened.
- Show it red on the step 1 case before the fix and green after. Report both runs.

## Step 4. Row 78b's stroke, with this row

- `packages/score-parser/src/placeholder-mark.ts:44`: `PLACEHOLDER_HOLLOW_STROKE_SP` from 0.198 to 0.098. Ruled by Dann 2026-10-14 03:11 on `docs/sessions/placeholder-shots/hollow-strokes.png`: *"thinnest 0.098 has my vote for the placeholder circles"*.
- Rewrite the comment above it (`:36-43`) to say it is the rim's thinnest, chosen by Dann on that picture on that date. Update any test that pins the value (`placeholder-mark.test.ts`, `stem-legend.test.ts`).

## Gates

- Run all eight. Baselines in `~/Downloads/ilya-ship.sh` at this brief: gate 4 2474, gate 5 675 passed, 5 skipped (680); gates 1, 2, 3, 6, 7, 8 as the script records.
- Report each gate's count before and after, with the test files that moved it. The desk moves the script's baselines.

## Constraints

- No git command that writes (`CONTRACT.md` §4). Leave everything uncommitted.
- Do not edit `docs/memory/`.
- Do not change type sizes, margins, the stave size, or `CLEAR`.

## Report

`docs/sessions/report-code-row96-nothing-over-the-footer_r1_2026-10-14.md`, in this order: the answer in three lines; step 1's table (song, document, language, list state, medium, page, overlap in px); the control's reading; the cause, with `path:line`; the fix; the check red then green; step 4; the gates; what could not be established. Pictures of page 3 before and after, both languages, in `docs/sessions/row96-shots/`.

**What could not be established.** List every point you could not settle. NOT ESTABLISHED beats a complete invented answer.
