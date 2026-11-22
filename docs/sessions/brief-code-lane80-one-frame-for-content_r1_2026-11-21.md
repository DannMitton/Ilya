# Lane 80, QUEUE row 202: one frame for the content of TEXT, MELODY, and INSIGHTS

r1, 2026-11-21, by the Opus desk. Every line cited was read at `e0ca61bf` by the desk or by the census helper (`census-three-documents_r1_2026-11-21.md`).

**This lane is written before lane 79 merges.** Lane 79 (row 201) adds one exported frame function to `page-config.ts` and puts the three blank states on it. Every citation here is to `e0ca61bf`, which is lane 79's base, so step 0 re-locates each one against the tree you actually have. Where lane 79 has already built something this brief asks for, say so and move on; do not undo it.

## 0. What this is for

A singer moves between TEXT, MELODY, and INSIGHTS by tapping three words at the top of one sheet. The sheet must sit still under her hand. Today it does not: the text block starts 4 px left of everything else, the gap under MELODY's title rule is 2 px deeper than the other two, INSIGHTS ends its pages 32 px higher, and the footer's divider rides up or down with whatever sits above it.

**Ruled by Dann 2026-11-21 22:10** (`OPEN.md`, THE THREE DOCUMENTS SHARE ONE FRAME), transcribed as written: *"Ok I need you to rectify the inconsistencies among these documents. You uynderstand that their content vaires but margins and graphic elements like squircles should aligne properly and appear consistent. resolve these incongruencies, pelase. <Make Ilya look well-considered and professional"*. And at 22:12, on the footer: *"Footers shoul be identicalk, and only the legeds that appear above the footre's horizontal divider should change to refelct their content."*

**He ruled this knowing it moves content.** Lines will rewrap in TEXT and page 1 of every score will shift. That is accepted, and this lane's job is to show him exactly what moved.

## 1. Step 0. Measure what nobody has measured, and re-locate

Five numbers in this project have never been read from a browser. Measure each on the tree you have, at 816 px sheet width, and report them before changing anything:

1. `.running-header` offsetHeight. The CSS arithmetic gives 24.6; `page-config.ts:60-70` records 29 from 2026-08-15, before `RunningHeader` was rewritten on 2026-10-11 (`RunningHeader.svelte:3-13`). Both cannot be right.
2. `.page-footer` offsetHeight on each of the three documents, on a page with no legend and on a page with one.
3. The first ink under the title rule on MELODY (the first system's top) and on INSIGHTS (the first squircle's border).
4. The computed `font-size` of `html`, which is what TEXT's `1rem` rows resolve against (`WordStack.svelte:273-286`).
5. `.header-aside` clientWidth on INSIGHTS, the compass slot that narrows its title (`TitleHeader.svelte:219-229`).

Then re-locate every citation in this brief against your tree and list any that moved.

Also record, for the two fixtures `src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` and `tchaikovsky-op38-3-voice.musicxml` (`e2e/pages-without-gaps.test.ts:21`), the page count and the first and last system of each page, for TEXT and for MELODY, before any change. This is the control for step 7.

## 2. The frame, extended

Lane 79's function returns the window of a blank page. This lane makes it the window of **every** page of all three documents:

- `top` = `MARGINS.vertical` + the measured header height + `HEADER_GAP`, on page 1 and on later pages, from the header actually drawn.
- `bottom` = `MARGINS.vertical` + the pinned footer block's height + `HEADER_GAP`, plus the height of the legend band that page carries (step 5).
- `left` = `right` = `MARGINS.horizontal`.

Every pane reads it. No pane keeps arithmetic of its own.

## 3. Step 1. TEXT's content joins the margin

`page-config.ts:108` gives `TEXT_CONTENT { left: 88, right: 96, padLeft: 4 }`, so TEXT's box starts at 88 and its text at 92, against 96 for the header rule, the footer hairline, MELODY, and INSIGHTS (`TitlePage.svelte:120`, `SubsequentPage.svelte:88`). Its column is 628 where the others are 624 (`page-config.ts:110-113`).

TEXT's content box starts at `MARGINS.horizontal` and its column is 624. Keep the word stack's own 4 px side padding (`WordStack.svelte:211`) only if the first glyph still lands on 96; if it does not, the padding goes and the report says so. The hanging indent on wrapped lines (`VerseLine.svelte:65`, `:71`) is untouched.

Expect every TEXT document to rewrap. Report the page count before and after for both fixtures.

## 4. Step 2. One gap under every rule

- MELODY's local `TITLE_HEADER_GAP = 18` (`MarkupPane.svelte:469`, used at `:471`) goes. The gap is `HEADER_GAP`, 16, as TEXT and INSIGHTS already use (`Paper.svelte:90`, `InsightsPane.svelte:286`). `page-config.ts:26-40` already states this as the rule, in Dann's own requirement that the space under the rule be identical on every page.
- MELODY's later pages take the measured running header instead of the constant 93 (`MarkupPane.svelte:511`, which adds `HEADER_HEIGHTS.subsequent` 37 and `GAP` 8). `page-config.ts:74` records that 37 as a number nobody measured.
- Repair the stale comment at `MarkupPane.svelte:464-468`.

Both move page 1 of every score. That is ruled and expected. The report carries the before-and-after page counts and a picture.

## 5. Step 3. INSIGHTS' clear space

`InsightsPane.svelte:450` reserves `footHeight + CLEAR`, with `CLEAR = 40` at `:378`, where TEXT and MELODY reserve the footer plus `GAP` 8 under an 80 px floor (`Paper.svelte:88-89`, `MarkupPane.svelte:491-493`). INSIGHTS therefore ends its pages higher than the other two.

All three reserve the same thing: the pinned footer block plus `HEADER_GAP`, plus that page's legend band. `CLEAR` goes, and so does the 80 px floor, because the footer block's height is now fixed and there is nothing to floor. If removing the floor changes a page count, report it with the numbers.

## 6. Step 4. INSIGHTS gains the paper size it lacks

`InsightsPane.svelte:162` hard-codes `PAGE_SIZES.letter`. TEXT and MELODY carry an A4 path (`TitlePage.svelte:76`, `MarkupPane.svelte:280`, `:419`). INSIGHTS takes the same `pageSize` prop and the same default, so the three agree whatever the page size is.

## 7. Step 5. The footer's divider sits still

**Ruled by Dann 2026-11-21 22:12.** The footer is the divider and the credit row under it, and it is identical on every page of all three documents, at one fixed height from the sheet's bottom edge. The legend band (`provenance-legend`, `broad-legend`, `apparatus`, `PageFooter.svelte:78-90`) stacks above the divider and changes with what the page carries.

Today `.page-footer` is anchored at `bottom: 48px` and grows upward (`PageFooter.svelte:107-109`), with the legend in flow before the hairline (`:92`), so the divider rides up by the band's height. After this step the divider's distance from the sheet's bottom edge is one number on every page of all three documents, and the band above it is measured and reserved by the content window.

**Keep the N.83 repair** (`PageFooter.svelte:115-126`): the band is still in flow and still reported through `onheightchange`, so the page reserves it and a legend can never land on a lyric. If your change would take the band out of the page's reserved height, stop and report it.

## 8. Step 6. The literals that ignore the constants

`TitleHeader.svelte:211-214`, `RunningHeader.svelte:64-67`, and `PageFooter.svelte:107-111` each write 48, 96, 96 as literals and read `MARGINS` not at all. `MarkupPane.svelte:1168-1169`, `InsightsPane.svelte:609-610`, and `BlankState.svelte:46` repeat the 96. Each reads the constant instead. No value changes; this is what stops the next drift.

## 9. Step 7. Pin it, and show him

**In gate 4:** extend lane 79's pins so they cover content, not only the blank page. No pane may name `MARGINS`, `HEADER_GAP`, `GAP`, `FOOTER_MAX_HEIGHT`, `TEXT_CONTENT`, or a bare 48, 96, 16, 18, 8, 40, or 80 in a window computation; the frame function is the only place those appear.

**In Playwright:** one test renders a real score and a real text document in all three documents, at 390 and at 1024, in both languages, page 1 and a later page, and asserts to the pixel: the same left edge and the same column width; the same gap under the title rule and under the running header's rule; the divider at the same distance from the sheet's bottom edge; and the same sheet and margins. It fails on any one of them.

**Pictures, which are the point for Dann:** page 1 and page 2 of `sunless-01-engraved` in TEXT and in MELODY, and one INSIGHTS page, each before and after, at 390 and at 1024. Name in one line each what moved and by how much.

## 10. Done when

- Every assertion in the Playwright test passes.
- The gate 4 pins fail if any pane computes a window itself.
- The five measurements of step 0 are reported, and `page-config.ts`'s stale comments about header heights say what was measured and when.
- Gates 1, 2, 3, 5, 6, 7 at the baselines; gate 4's count reported with every test added or changed and what each replaced one protected; gate 8 `ratchets: OK.` with no ceiling raised.
- Page counts for both fixtures reported before and after, in all three documents.

## 11. The same number computed elsewhere

This lane changes the page's content window. Every site that computes one, from the census: `Paper.svelte:88`, `:89`, `:90`, `:93`; `TitlePage.svelte:120`; `SubsequentPage.svelte:88`; `page-config.ts:108`, `:110-113`; `MarkupPane.svelte:469`, `:471`, `:491-493`, `:510`, `:511`, `:792`, `:853`, `:873-876`, `:987`, `:993`, `:998`, `:1014`, `:1168-1169`; `InsightsPane.svelte:162`, `:286`, `:288`, `:373`, `:378`, `:450`, `:576`, `:609-610`; `BlankState.svelte:46`; `TitleHeader.svelte:211-214`; `RunningHeader.svelte:64-67`; `PageFooter.svelte:107-111`; `page-fit.ts:57`; `TextFitProbe.svelte:99`. Tests that pin them: `page-fit.test.ts:38`, `:348`, `:377-381`; `blank-states.test.ts`; `one-head-one-foot.test.ts:69`; `e2e/pages-without-gaps.test.ts:67-83`; `e2e/print-pages.test.ts`; `e2e/markup-pages-lose-no-bars.test.ts`.

What depended on them agreeing: page breaks, which this lane is ruled to move. Where a test pins a page count that changes, update the pin and say in the report what the old count was, what the new one is, and which fixture.

## 12. Constraints

- Runs on Dann's Mac, in the desktop app, on the branch the desk names when it starts. No commit to `Shane`, no pull request; Dann fast-forwards.
- Nothing under `docs/memory/` is written by the lane.
- **Strings: none.** No sentence changes in either language.
- Ratchets: `MarkupPane.svelte` 1234 and `InsightsPane.svelte` 674 sit at their ceilings (`scripts/ratchets.json:16`, `:18`). Removing arithmetic should shrink both. Do not raise a ceiling.
- The eight gates and their baselines are in `brief-code-lane79-one-page-frame_r2_2026-11-21.md`, section 5, inlined there from `~/Downloads/ilya-ship.sh`. Gate 4's figure will have moved with lane 79; take it from lane 79's report.

## 13. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Report every item you could not settle, with its instrument. One the desk already knows of: whether `paginateMelody` spreads slack across a page's gaps, which decides whether step 2 moves only the page's first system or every system on it.

Report to `docs/sessions/report-code-lane80_r1_2026-11-21.md` on the branch.
