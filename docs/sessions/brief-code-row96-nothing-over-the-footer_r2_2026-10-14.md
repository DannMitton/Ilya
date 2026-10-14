# Brief: QUEUE row 96, nothing on an Insights page runs into its footer (r2)

Desk (Opus 5.5), 2026-10-14 about 03:50. For Code (Opus) on Dann's Mac, on `Shane` at `dbe41af` or later. r2, 2026-10-14 about 13:30: applies all seven of Fable's amendments (`review-fable-brief-row96_r1_2026-10-14.md`, SEND WITH AMENDMENTS); r1 superseded, do not send it.

## What the singer sees, and what must be true

On Insights of «Средь шумного бала» (Tchaikovsky, op. 38 no. 3), page 3, on the alias at `6c69161`, the vowel-turn chart's last rows, [ɛ] to [ɑ], print over the page footer's text. Found by Dann 2026-10-14 03:10 from his own screenshot: *"That is unaccveptable and must not be allowed in production"* (transcribed as written).

**Done when:** on every page of Insights, in English and French, on screen and in print, with the observations list closed and opened, nothing in the page's content reaches the top of its footer; the check in step 3 fails when that stops being true on any of the three documents. Step 1 measures Text and Markup too. An overlap found there is reported with its page and px and left for its own row, since Text paginates by row count (`page-config.ts:158`, `Paper.svelte:44`) and Markup by `paginateScore` (`MarkupPane.svelte:843`), neither through `paginate.ts`.

## The desk's leads (DESK INFERENCE, read from the tree at `dbe41af`; none is measured)

1. **A block the pages never count.** `InsightsPane.svelte:446` leaves screen-only blocks out of `paginate`; `:466-470` then adds each to the page of the block before it. Their height is never counted. The one screen-only block is "N more observations" (`singer-blocks.ts:283-292`), a `<details>` (`SingerBlock.svelte:88-92`). Closed, it is one summary line plus the 12 px between blocks, which may fit inside the 40 px kept clear (`CLEAR`, `InsightsPane.svelte:410`). Opened, every hidden observation adds its full height. Dann's walk at 03:10 names «One more observation» on this song (`INBOX.md`), so the block exists there; which page it sits on, and whether he had it open, are NOT ESTABLISHED.
2. **A block measured before it finishes laying out.** The measurer runs once after `tick()`, when the blocks, the fonts, or the language change (`InsightsPane.svelte:428-444`). A block whose layout lands later is measured short.
3. **The check cannot see this fault.** `apps/web/e2e/pages-without-gaps.test.ts:83` reports `empty: footer - bottom`; an overlap gives a negative number, and nothing fails on it.

## Step 1. Measure first; change nothing

- **Instrument.** `measure()` in `apps/web/e2e/pages-without-gaps.test.ts:41-86`, as it stands: its `empty` is the footer's first painted element's top less the lowest painted content edge (`:83`), it counts an opened list's text and a closed list's summary line (`:46`), and it clips a cut block to its window (`:56-62`). An overlap is `empty < 0`, in px. Report it for every page, the last included.
- **Positive control first.** In a throwaway local edit, add to `InsightsPane.svelte`'s stylesheet a rule that matches the page copy and not the measurer's, for example `.insights-page .column .block-vowels { padding-bottom: 100px; }` (the measurer at `:543` is outside `.column`, `:579`). A rule in `SingerBlock.svelte`, or any rule both copies match, inflates the measured height too, and `paginate` makes room for it, so the control reads zero. Confirm `measure()` reports about 100 px of overlap, or the chart's move to the next page with the reason, then revert. Report the control's reading.
- **Expectation, stated before the measurement.** On `apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml`, with the fully sampled bass voice row 79 used, an overlap appears on the page that holds "N more observations" when it is opened, and on no page when it is closed. Closed, the list adds about 30 px (one 11.5 px summary line, `SingerBlock.svelte:524-529`, plus the 12 px inner gap, `InsightsPane.svelte:407`) inside the 40 px kept clear, so no overlap is expected and that result does not mean the instrument failed. Opened with one observation it adds 80 px or more, which reaches the attribution text 8 px below the hairline (`PageFooter.svelte:151-154`). These are the desk's arithmetic from the stylesheet, not measurements. Report also the vowel chart's measured height (`heights[k]`) beside the page's capacity (`room`, `:448`), to rule out by a number the one overflow `paginate` allows, a block taller than an empty page (`paginate.ts:46`, `:136-145`). Likeliest way this is wrong: the overlap comes from lead 2, or from a voice or setting that differs from Dann's.
- **Run.** Both fixtures row 79 used (`sunless-01-engraved.musicxml`, `tchaikovsky-op38-3-voice.musicxml`), English and French, the list closed and opened, screen at 1440 px and print (`page.emulateMedia({ media: 'print' })`, then `measure()`; `page.pdf`, which `print-pages.test.ts:33` uses, returns a PDF with no element geometry and is for page counts only).
- **If no overlap reproduces,** stop and report. Do not fix a cause you have not seen. The desk then asks Dann for his voice and settings.

## Step 2. The fix

- Make "Done when" true. The mechanism is yours; report what you chose and why in one paragraph.
- **Keep:** every rule of row 79 (`PRODUCT.md`, "No empty space mid-document"), the pages counted in row 79's report wherever the fix does not need to move them, and the order of blocks.
- **Opening the list must not push anything into the footer.** If the pages re-flow when it opens, say so in the report; the desk takes that to Dann's walk.
- Print and screen must agree on what each page holds, apart from the screen-only list itself (`PRODUCT.md`, "1. WYSIWYG means what it says", Dann 2026-09-17).

## Step 3. The check

- Extend `pages-without-gaps.test.ts`, or add a test beside it, so that any page whose content reaches its footer fails: `measure()`'s `empty < 0` on any page, the last page included (the present test skips it, `:105`), for all three documents, both languages, on screen and under `emulateMedia` print, and on Insights with the list closed and then opened by clicking `.paper-page:visible details.more > summary` (the measurer's copy at `InsightsPane.svelte:543` is inert). Where a fixture and voice produce no 'more' block, print that by name and pass the opened case; do not invent one.
- Run it from `apps/web` with `pnpm test:e2e e2e/pages-without-gaps.test.ts` against the dev server (`playwright.config.ts:50-55`); it is not one of the eight gates. Show it red on the step 1 case before the fix and green after. Report both runs.

## Step 4. Row 78b's stroke, with this row

- `packages/score-parser/src/placeholder-mark.ts:44`: `PLACEHOLDER_HOLLOW_STROKE_SP` from 0.198 to 0.098. Ruled by Dann 2026-10-14 03:11 on `docs/sessions/placeholder-shots/hollow-strokes.png`: *"thinnest 0.098 has my vote for the placeholder circles"*.
- Rewrite the comment above it (`:36-43`) to say it is the rim's thinnest, chosen by Dann on that picture on that date. No test pins the number: `placeholder-mark.test.ts:41` and `stem-legend.test.ts:85` read the constant by import, and no approved SVG holds the stroke. Run gate 5 and report it; it is expected to stay at 675.

## Gates

- Run all eight. Baselines in `~/Downloads/ilya-ship.sh` at this brief: gate 4 2474, gate 5 675 passed, 5 skipped (680); gates 1, 2, 3, 6, 7, 8 as the script records.
- Report each gate's count before and after, with the test files that moved it. The desk moves the script's baselines.

## Constraints

- No git command that writes (`CONTRACT.md` §4). Leave everything uncommitted.
- Do not edit `docs/memory/`.
- Do not change type sizes, margins, the stave size, or `CLEAR`.

## Report

`docs/sessions/report-code-row96-nothing-over-the-footer_r1_2026-10-14.md`, in this order: the answer in three lines; step 1's table (song, document, language, list state, medium, page, overlap in px); the control's reading; the cause, with `path:line`; the fix; the check red then green; step 4; the gates; what could not be established. Pictures of the page that holds the vowel chart before and after, both languages, list closed and opened, and the page number named, in `docs/sessions/row96-shots/`.

**What could not be established.** List every point you could not settle. NOT ESTABLISHED beats a complete invented answer.
