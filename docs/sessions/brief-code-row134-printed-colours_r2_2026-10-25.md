# Brief r2: row 134, printed pages keep their screen colours (2026-10-25)

Written by the desk (Sonnet) 2026-10-21 as r1; r2 written 2026-10-25. Fable-reviewed 2026-10-25 (`../sessions/review-fable-brief-row134_r1_2026-10-25.md`, md5 `a66bb919c2d8f6c1b852e0e056e9daa8` of the brief it reviewed, verdict SEND WITH AMENDMENTS), all 7 amendments applied (`CONTRACT.md` section 1 item 19). It waits for Dann's say-so to send. Dann has not ruled the DESK DEFAULT in section 3.

For Code in a cloud session, Sonnet, on a lane cut from `Shane` by Dann. It has no dependency on batch C or on N.194. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code below carries a `path:line` the desk or Fable read (the desk on 2026-10-21; Fable and the r2 edit on 2026-10-25 at `e0f4ad9`), or says NOT ESTABLISHED. Do not write with git beyond one commit per step on the lane; no pull request; no other branch; no brief file in any commit.

Cost, a range and not measured: about 80k to 250k Sonnet tokens.

## 1. The need

Dann 2026-09-24 15:35 (`INBOX.md`): *"It would be great if the pages could preserve their onscreen colouration. This is one of the ways I planned to be able to distinguish the three outputs at a glance."* The three outputs are Text, Markup, and Insights. Each document's footer line keeps that document's colour (Dann 2026-10-20 03:27, `QUEUE.md` row 143).

## 2. What the desk read

- `print-color-adjust` and `color-adjust` appear nowhere under `apps/web/src` (grep, 2026-10-21; Fable again 2026-10-25).
- The footer line is a border, not a background: `.footer-hairline { border-top: 0.5px solid var(--footer-accent) }` (`apps/web/src/lib/components/Paper/PageFooter.svelte:148-150`), with the accent passed per document: Text `var(--sage)` by default (`PageFooter.svelte:49`), Markup `#9585A2` (`apps/web/src/lib/markup/MarkupPane.svelte:1031`, `:1046`, `:1135`), Insights `var(--rose, #ab7f7f)` (`apps/web/src/lib/insights/InsightsPane.svelte:590`, `:603`, `:625`). `print-color-adjust` governs what the browser may drop or alter to save ink; MDN names backgrounds, background images, and text colour; it is inherited and its initial value is `economy` (MDN, `print-color-adjust`, https://developer.mozilla.org/docs/Web/CSS/color-adjust). Dann's report of 2026-09-24 (`INBOX.md:194`) says his printer "printed Texte's sage rule green" with no such property in the tree. So the one surface the done state names, the footer line's colour, may print today.
- What the three stacks do draw as CSS backgrounds, and so may lose: Insights' `apps/web/src/lib/insights/SingerBlock.svelte:379-393` (the `.under`, `.within`, `.above`, `.past`, `.before` bars of the stack at `:370-376`) and `apps/web/src/lib/insights/PitchSeconds.svelte:200-202` (`.band-swatch`, a `color-mix` of `--rose`). Tessituragram's colour is SVG `fill` (`apps/web/src/lib/insights/Tessituragram.svelte:126`, `:154`), drawn as content, not background. Text's only coloured backgrounds are hover states (`apps/web/src/lib/components/Paper/WordStack.svelte:228-230`), set transparent in print (`:405-408`). Markup's coloured backgrounds live in the Transposition dock and ruler (`TranspositionDock.svelte`, `TranspositionRuler.svelte`), which float and never print (`CONTRACT.md` section 8).
- `@media print` appears in 29 files under `apps/web/src` (`grep -rl`, 2026-10-21; Fable's grep matches), among them `app.css:277`, `InsightsPane.svelte:750-758`, and `MarkupPane.svelte:1181-1185` and `:1357-1363`.
- The three page stacks are `.paper-container` (Text, `apps/web/src/lib/components/Paper/Paper.svelte:70`), `.markup-paper-container` (`MarkupPane.svelte:985`, `:1066`, the envelope page included), and `.insights-container` (`InsightsPane.svelte:609`). In `apps/web/src/app.css` the `@media print` line is `:277`, the three selectors are `:319-321`, the rule body `:322-331`, and the comment of 2026-10-09 (a trailing-page defect that a 32 px spill caused) is `:312-318`. Every footer of the three documents sits inside one of them, except Insights' phone flow branch (`InsightsPane.svelte:600-606`, `.flow-foot`), which is not printed from the desk layout.
- In print, `.paper-page` is forced white with no shadow (`app.css:335-339`), and `--paper-cream` is set to `#ffffff` (`app.css:279`).
- The repository's only print measure, `apps/web/e2e/print-pages.test.ts:33`, calls `page.pdf({ preferCSSPageSize: true, printBackground: true })`. With `printBackground: true` Chromium draws every background whatever `print-color-adjust` says, which a singer never gets: Chrome's print dialog ships with background graphics off, and Playwright's `page.pdf` default is `printBackground: false`. Do not copy `:33` as the measure.
- The Guide is not one of the three stacks: `ReadingPaper.svelte` (`apps/web/src/lib/components/Paper/ReadingPaper.svelte:126-138`) sets `.chapter-band` to `color: #fdfbf6` (near white) on `background: var(--umber)` (`.band-learn`) or `var(--cobalt)` (`.band-guide`). It is drawn at `apps/web/src/routes/+page.svelte:4478-4492`, and its print sheet (`ReadingPaper.svelte:505-509`) removes only the shadow.
- NOT ESTABLISHED: which screen colours drop on paper today. Nothing was printed. NOT ESTABLISHED: whether Chromium drops a border's colour under `economy`; whether `print-color-adjust: exact` overrides `printBackground: false` in headless `page.pdf` (one account of Chrome's dialog says `exact` printed a background with the option off and a correspondent called it a bug: Stefan Judis, https://www.stefanjudis.com/today-i-learned/color-adjust-trumps-user-agent-setting-about-background-printing/); whether a rasterizer exists in the lane (`pdfjs-dist` is a dependency, `apps/web/package.json`, but the tree's `rasterizePdf`, `$lib/reader/page-pdf`, per `scan.ts:11-12`, produces greyscale PNG, which destroys the measurement); whether Chromium alters text colour under `economy`.

## 3. DESK DEFAULT, his to wave off

The pages' accent colours print as they appear on screen. The sheet itself stays white: the rules at `app.css:279` and `:339` do not change. Whether the cream prints is taste, and Dann rules it separately if he wants it (see "Owed to Dann" below).

## 4. Steps

**Step 0, measure, change nothing.** In headless Chromium (Playwright), load one fixture song the repository holds (name it, with its path; do not depend on a file outside the repository). Emulate print media and render each of the three documents to PDF twice: `page.pdf({ preferCSSPageSize: true, printBackground: false })`, the singer's default, and `printBackground: true`, the control that shows every colour the screen has. Rasterize both at 300 dpi or more (the footer line is 0.5 px; a 72 dpi raster loses it). Name the rasterizer you used and how it got into the lane; if none can be had, write NOT ESTABLISHED for the raster and compare the two PDFs' content streams for fill-colour operators instead, saying that is what you did. Positive control first (tether 11): the Insights stack bars (`SingerBlock.svelte:379-393`) must be present in the `true` render and absent or white in the `false` render before any other colour is reported as dropped. Table: element, screen colour, printed colour with backgrounds off, printed colour with backgrounds on. Sample the footer line, the gloss line, and any filled area. Render the Guide once the same two ways and report its chapter band (`ReadingPaper.svelte:126-138`); report only, the desk opens a row if the heading is lost. Report it all before you change code.

Then say in one line whether any colour inside the three stacks dropped. If none did, stop before step 1 and report; the desk takes the finding to Dann, because the remaining difference between screen and paper is the cream, which section 3 keeps off paper. If one did, name it and go on.

**Step 1.** Add `print-color-adjust: exact` and `-webkit-print-color-adjust: exact` (keep both; the prefixed one is for Safari) to the three stack selectors inside the existing `@media print` block at `app.css:277`. Do not set it on `*` or on `body`. If step 0 shows a colour that comes from outside those three subtrees, say so and stop at that colour. DESK DEFAULT, added: pin the rule with a one-line test that `app.css` carries `print-color-adjust: exact` inside its print block for the three selectors, in the style of `apps/web/src/lib/insights/ratified-lines.test.ts`, so a later tidy-up that removes it fails; if the test cannot be written without a new helper, say so and leave it out.

**Step 2.** Repeat step 0's measurement: both renders. File the table before and after. The table must show at least one element whose printed colour changed between step 0 and step 2; the footer lines alone do not prove the rule did anything. The claim the report may make is about `printBackground: false` only. The three documents must be told apart by the colour of their footer line in the PDF.

**Step 3.** Safari is NOT ESTABLISHED in the lane and stays so: Playwright renders PDF in Chromium only (Checkly, Playwright PDF guide, https://www.checklyhq.com/learn/playwright/generating-pdfs). Write that line. The check in Safari is Dann's print of one song after the ship, with the desk telling him first which checkbox Safari's print dialog shows for backgrounds.

## 5. Constraints

- The page count of each document's PDF is the same before and after, for the same fixture (`apps/web/e2e/print-pages.test.ts` guards it and stays).
- No new colour is introduced; every colour printed is one the screen already uses.
- `app.css` has no entry in `scripts/ratchets.json` (grep, 2026-10-21; Fable read it 2026-10-25) and stands at 457 lines. Do not add a ratchet entry and do not raise a ceiling.
- No strings and no French. This brief changes no computation, so it omits the cross-site line `CONTRACT.md` section 4 asks of computation briefs. The print sheets that set a colour are `app.css:279`, `:339`; `WordStack.svelte:405-412`; `SingerBlock.svelte:580-582`; none conflicts with the rule. (`print-color-adjust` is inherited, so a rule on the three stack selectors reaches every element inside them.)
- Run all eight gates before and after, and report each.

## 6. Report

`docs/sessions/report-code-row134_r1_2026-10-21.md`, with: what you changed (files and `path:line`); the tables of steps 0 and 2, in both renders; the Guide chapter-band finding; the page counts; the eight gates before and after; and a section "What I could not establish" (every NOT ESTABLISHED above, closed or still open).

## Owed to Dann

- Owed to Dann: whether the cream prints (taste). It stands in section 3 as a DESK DEFAULT he may wave off, and is not re-asked here. If step 0 finds no colour drops inside the three stacks, it becomes the only lever left for "told apart at a glance", and the desk brings him that finding, not a choice.

## Appendix: amendments of Fable's review and where r2 applies them

| No. | Applied | Where in r2 |
|---|---|---|
| 1 | yes | Section 2 (second and third bullets); section 4 step 0 closing paragraph; step 2 |
| 2 | yes | Section 2 (print-measure and NOT ESTABLISHED bullets); section 4 step 0 and step 2 |
| 3 | yes | Section 4 step 3 |
| 4 | yes | Section 2 (Guide bullet); section 4 step 0; section 6 |
| 5 | yes | Section 5 fourth bullet |
| 6 | yes | Section 2 (cites bullets: `app.css` lines, print-block lines, 457 lines and no ratchet, both property spellings in step 1) |
| 7 | yes, as DESK DEFAULT: added | Section 4 step 1 |

## What I could not establish

- Fable's review cites the Text footer default at `PageFooter.svelte:48`; reading the file at `e0f4ad9` shows the default `hairlineAccent = 'var(--sage)'` at `:49` (`:48` is not it), so r2 writes `:49`. Fable's Markup lines `:1031`, `:1046`, `:1135` and Insights lines `:590`, `:603`, `:625` all carry `hairlineAccent`; `:1031` and `:1046` run past what I read of the line, so whether `:1031` carries `#9585A2` itself is not confirmed.
- I did not re-read `Tessituragram.svelte:126`, `:154` beyond seeing SVG `fill`, nor `TranspositionDock.svelte` and `TranspositionRuler.svelte`.
- The five NOT ESTABLISHED items in section 2 (Chromium border colour, `exact` against `printBackground: false`, rasterizer, text colour under `economy`, Safari), and the eight gate baselines at Code's start.
- Nothing was run; the r2 edit is reading only.
