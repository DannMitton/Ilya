# Brief r1: row 134, printed pages keep their screen colours (2026-10-21)

Written by the desk (Sonnet) 2026-10-21 about 21:4x. NOT Fable-reviewed; it waits for Sunday 2026-10-25 05:00 and Dann's say-so (`CONTRACT.md` section 1 item 19). Dann has not ruled the DESK DEFAULT in section 3.

For Code in a cloud session, Sonnet, on a lane cut from `Shane` by Dann. It has no dependency on batch C or on N.194. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code below carries a `path:line` the desk read on 2026-10-21, or says NOT ESTABLISHED. Do not write with git beyond one commit per step on the lane; no pull request; no other branch; no brief file in any commit.

Cost, a range and not measured: about 80k to 250k Sonnet tokens.

## 1. The need

Dann 2026-09-24 15:35 (`INBOX.md`): *"It would be great if the pages could preserve their onscreen colouration. This is one of the ways I planned to be able to distinguish the three outputs at a glance."* The three outputs are Text, Markup, and Insights. Each document's footer line keeps that document's colour (Dann 2026-10-20 03:27, `QUEUE.md` row 143).

## 2. What the desk read

- `print-color-adjust` and `color-adjust` appear nowhere under `apps/web/src` (grep, 2026-10-21).
- `@media print` appears in 29 files under `apps/web/src` (`grep -rl`, 2026-10-21), among them `app.css:277`, `InsightsPane.svelte:750`, and `MarkupPane.svelte:1181` and `:1358`.
- The three page stacks are `.paper-container` (Text), `.markup-paper-container`, and `.insights-container` (`app.css:320-321`, with the comment of 2026-10-09 at `:313-318`, which records a trailing-page defect that a 32 px spill caused).
- In print, `.paper-page` is forced white with no shadow (`app.css:335-339`), and `--paper-cream` is set to `#ffffff` (`app.css:279`).
- NOT ESTABLISHED by the desk: which screen colours drop on paper today. Nothing was printed.

## 3. DESK DEFAULT, his to wave off

The pages' accent colours print as they appear on screen. The sheet itself stays white: the rules at `app.css:279` and `:339` do not change. Whether the cream should print is taste, and Dann rules it separately if he wants it.

## 4. Steps

**Step 0, measure, change nothing.** In headless Chromium (Playwright), load one fixture song the repository holds (name it, with its path; do not depend on a file outside the repository). Emulate print media and render each of the three documents to PDF. Rasterize the PDF pages and list every colour present on screen that is absent on paper: sample the footer line, the gloss line, and any filled area. Report a table: element, screen colour, printed colour. Report it before you change code.

**Step 1.** Add `print-color-adjust: exact` and `-webkit-print-color-adjust: exact` to the three stack selectors inside the existing `@media print` block at `app.css:277`. Do not set it on `*` or on `body`. If step 0 shows a colour that comes from outside those three subtrees, say so and stop at that colour.

**Step 2.** Repeat step 0's measurement. File the table before and after. The three documents must be told apart by the colour of their footer line in the PDF.

**Step 3.** If Playwright's WebKit is installed in the lane, repeat step 2 in it. If it is not, write NOT ESTABLISHED: Dann prints from Safari.

## 5. Constraints

- The page count of each document's PDF is the same before and after, for the same fixture.
- No new colour is introduced; every colour printed is one the screen already uses.
- `app.css` has no entry in `scripts/ratchets.json` (grep, 2026-10-21) and stands at 457 lines. Do not add a ratchet entry and do not raise a ceiling.
- No strings and no French. This brief changes no computation, so it omits the cross-site line `CONTRACT.md` section 4 asks of computation briefs.
- Run all eight gates before and after, and report each.

## 6. Report

`docs/sessions/report-code-row134_r1_2026-10-21.md`, with: what you changed (files and `path:line`); the tables of steps 0 and 2; the page counts; the eight gates before and after; and a section "What I could not establish" (every NOT ESTABLISHED above, closed or still open).
