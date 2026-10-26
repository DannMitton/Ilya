# Fable review: brief for Code, row 134, r1 (2026-10-25)

Brief reviewed: `docs/sessions/brief-code-row134-printed-colours_r1_2026-10-21.md`, md5 `a66bb919c2d8f6c1b852e0e056e9daa8` (checked in the clone at `e0f4ad9`, 2026-10-25). Every `path:line` below was read by Fable this session; nothing was run. NOT ESTABLISHED beats a complete invented answer.

## Verdict: SEND WITH AMENDMENTS

The change is one CSS rule and the brief keeps it small. What is wrong is the instrument: the done state as written can hold on the unchanged tree, the measurement as written draws every background whatever the property says, and step 3 names a tool that does not exist. Amendments 1 to 3 fix the measure; 4 names the wall the measure will find next door; the rest are cites and a guard.

## Amendments, ranked

### 1. The done state may already hold today, so step 0 must decide whether step 1 has work to do

Evidence. The footer line is a border, not a background: `PageFooter.svelte:148-150`, `.footer-hairline { border-top: 0.5px solid var(--footer-accent) }`, with the accent passed per document: Text `var(--sage)` by default (`:48`), Markup `#9585A2` (`MarkupPane.svelte:1031`, `:1046`, `:1135`), Insights `var(--rose, #ab7f7f)` (`InsightsPane.svelte:590`, `:603`, `:625`). `print-color-adjust` governs what the browser may drop or alter to save ink, and MDN's own description names backgrounds, background images, and text colour; it is inherited and its initial value is `economy` (MDN, `print-color-adjust`, https://developer.mozilla.org/docs/Web/CSS/color-adjust, read this session). Dann's report of 2026-09-24 (`INBOX.md:194`) says his printer "printed Texte's sage rule green" with no such property in the tree. So the one surface the brief's done state names, the footer line's colour, may print today.

What the three stacks do draw as CSS backgrounds, and so may lose: Insights' `SingerBlock.svelte:379-393` (the `.under`, `.within`, `.above`, `.past`, `.before` bars of the stack at `:370-376`) and `PitchSeconds.svelte:200-202` (`.band-swatch`, a `color-mix` of `--rose`). Tessituragram's colour is SVG `fill` (`Tessituragram.svelte:126`, `:154`), which is drawn as content, not background. Text's only coloured backgrounds are hover states (`WordStack.svelte:228-230`), set transparent in print (`:405-408`). Markup's coloured backgrounds live in the Transposition dock and ruler (`TranspositionDock.svelte`, `TranspositionRuler.svelte`), which float and never print (`CONTRACT.md` §8).

Cost if not amended. Code measures, sees three coloured footer lines before and after, writes "told apart" in both tables, and the row ships a rule whose only effect is on two Insights elements nobody checked, while Dann's wish ("preserve their onscreen colouration") is answered by a line that already printed.

Add to step 0, after the table: "Then say in one line whether any colour inside the three stacks dropped. If none did, stop before step 1 and report; the desk takes the finding to Dann, because the remaining difference between screen and paper is the cream, which section 3 keeps off paper. If one did, name it and go on." Add to step 2: "The table must show at least one element whose printed colour changed between step 0 and step 2; the footer lines alone do not prove the rule did anything."

### 2. The measurement prints every background, so it cannot see what the rule changes

Evidence. The repository's only print measure, `apps/web/e2e/print-pages.test.ts:33`, calls `page.pdf({ preferCSSPageSize: true, printBackground: true })`. With `printBackground: true` Chromium draws every background regardless of `print-color-adjust`, which is what a singer never gets: Chrome's dialog ships with background graphics off, and Playwright's `page.pdf` default is `printBackground: false`. A step 0 that copies `:33` measures nothing. Whether `print-color-adjust: exact` overrides `printBackground: false` in headless `page.pdf` is NOT ESTABLISHED by anything I read; one account of Chrome's dialog says `exact` printed a background with the option off and a correspondent called it a bug (Stefan Judis, https://www.stefanjudis.com/today-i-learned/color-adjust-trumps-user-agent-setting-about-background-printing/, read this session). Code's step 2 is the first real reading.

Also: the brief says "rasterize the PDF pages" and names no rasterizer. `pdfjs-dist` is a dependency (`apps/web/package.json`), but the tree's `rasterizePdf` (`$lib/reader/page-pdf`, per `scan.ts:11-12`) produces greyscale PNG, which destroys the measurement. Whether `pdftoppm` or a Python PDF renderer exists in the lane is NOT ESTABLISHED.

Replace step 0's second and third sentences with:

> Emulate print media and render each of the three documents to PDF twice: `page.pdf({ preferCSSPageSize: true, printBackground: false })`, the singer's default, and `printBackground: true`, the control that shows every colour the screen has. Rasterize both at 300 dpi or more (the footer line is 0.5 px; a 72 dpi raster loses it). Name the rasterizer you used and how it got into the lane; if none can be had, write NOT ESTABLISHED for the raster and compare the two PDFs' content streams for fill-colour operators instead, saying that is what you did. Positive control first (tether 11): the Insights stack bars (`SingerBlock.svelte:379-393`) must be present in the `true` render and absent or white in the `false` render before any other colour is reported as dropped. Table: element, screen colour, printed colour with backgrounds off, printed colour with backgrounds on.

Step 2 repeats both renders. The claim the report may make is about `printBackground: false` only.

### 3. Step 3 cannot run: Playwright's `page.pdf` is Chromium only

Evidence. "This feature is currently only supported in Chromium headless in Playwright" (Checkly, Playwright PDF guide, https://www.checklyhq.com/learn/playwright/generating-pdfs, read this session). WebKit under Playwright has no `page.pdf`.

Replace step 3 with: "Safari is NOT ESTABLISHED in the lane and stays so: Playwright renders PDF in Chromium only. Write that line. The check in Safari is Dann's print of one song after the ship, with the desk telling him first which checkbox Safari's print dialog shows for backgrounds."

### 4. The wall the measure will find is outside the three stacks: the Guide's chapter bands

Evidence. `ReadingPaper.svelte:126-138`: `.chapter-band` sets `color: #fdfbf6` (near white) on `background: var(--umber)` (`.band-learn`) or `var(--cobalt)` (`.band-guide`). `ReadingPaper` is drawn at `+page.svelte:4478-4492` and is none of the three stacks; its print sheet (`ReadingPaper.svelte:505-509`) removes only the shadow. Under `economy` with backgrounds off, the band's fill goes and its near-white heading stays, unless the browser also darkens the text (MDN says it may; NOT ESTABLISHED). A singer who prints the Guide may get an invisible chapter title. The brief's step 1 rightly stops at a colour from outside the three subtrees; it does not ask Code to look there.

Add to step 0: "Render the Guide once the same two ways and report its chapter band (`ReadingPaper.svelte:126-138`), report only; the desk opens a row if the heading is lost."

### 5. The cross-site line is not owed, but the print sheets that touch colour are three, and they agree

Evidence. Of the 29 files with `@media print` (my grep matches the brief's count), the ones that set a colour inside the print block are `app.css:279` and `:339` (white sheet), `WordStack.svelte:405-412` (`.word-stack` transparent, `.verify-label` white), and `SingerBlock.svelte:580-582` (`.offer-link` `color: inherit`). `print-color-adjust` is inherited (MDN, above), so a rule on the three stack selectors reaches every element inside them, and none of those three sheets sets a colour the rule would restore against the author's intent. The brief's omission of §4's line is right: no number is computed. Add one sentence to section 5 so Code does not re-derive it: "The print sheets that set a colour are `app.css:279`, `:339`; `WordStack.svelte:405-412`; `SingerBlock.svelte:580-582`; none conflicts with the rule."

### 6. Cites

- `app.css:277` is the `@media print` line; the three stack selectors are `:319-321`, the rule body `:322-331`; `.paper-page` is `:335`, its white at `:339`; `--paper-cream: #ffffff` at `:279`. The 2026-10-09 comment is `:312-318`. As the brief says, within a line.
- `InsightsPane.svelte:750` and `MarkupPane.svelte:1181`, `:1358`: the print blocks are at `:750-758`, `:1181-1185`, and `:1357-1363`. Right.
- `app.css` is 457 lines and has no ratchet entry (`scripts/ratchets.json` read this session). Right; the 1000-line rule for an unceilinged file leaves room.
- `-webkit-print-color-adjust` beside the unprefixed property: right for Safari; keep both.

### 7. A guard, DESK DEFAULT

No test in the brief can fail. `print-pages.test.ts` guards the page count (constraint 1) and stays. A one-line pin that `app.css` carries `print-color-adjust: exact` inside its print block for the three selectors, in the style of `ratified-lines.test.ts`, is cheap and catches a later tidy-up that removes it. Add or leave out; say which.

## Checks that passed

- `print-color-adjust` and `color-adjust` appear nowhere under `apps/web/src` (grep this session). Right.
- The three stacks are `.paper-container` (`Paper.svelte:70`), `.markup-paper-container` (`MarkupPane.svelte:985`, `:1066`, the envelope page included), and `.insights-container` (`InsightsPane.svelte:609`). Every footer of the three documents sits inside one of them, except Insights' phone flow branch (`:600-606`, `.flow-foot`), which is not printed from the desk layout.
- The sheet stays white under the brief's rule: white backgrounds print white. Right, and the cream is Dann's.
- No string, no French. Right.

## Where would this wall a singer in

- Amendment 4: a printed Guide whose chapter title is white on white. Outside this row's change, inside its measure.
- A singer whose Chrome dialog has backgrounds off and whose browser honours `exact`: the Insights bars print; one whose browser does not: nothing changes, and nothing breaks. No wall from the rule itself.

## Questions for Dann

- The brief's own: whether the cream prints (taste). Not re-asked here; it stands in section 3. If step 0 finds no colour drops inside the three stacks (amendment 1), this becomes the only lever left for "told apart at a glance", and the desk brings him that finding, not a choice.

## What I could not establish

- Whether Chromium drops a border's colour under `economy`; Dann's 2026-09-24 print says no for one printer and one browser.
- Whether `print-color-adjust: exact` overrides `printBackground: false` in headless `page.pdf`.
- Whether a rasterizer is available in the lane.
- Whether Chromium alters text colour under `economy` (the Guide's band heading).
- What Safari does with any of it (Playwright cannot say).
- The eight gate baselines at Code's start.
