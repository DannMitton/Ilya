# Review, lane 70 brief: INSIGHTS is WYSIWYG on a phone

r1, 2026-11-19, Fable 5.2, read-only against `Shane` `3271b4da`.
Brief reviewed: `docs/sessions/brief-code-lane70-insights-wysiwyg_r1_2026-11-19.md`, 233 lines, md5 `36a91ef45ed2fcfe6d9e61a25e55bc54` (confirmed by `md5sum` this session).
Tree: `git --no-optional-locks status --porcelain` shows one entry, the brief itself, untracked. Nothing else differs from `3271b4da`.

Every claim below carries a `path:line` read this session, a command run this session, or the words "not established". No browser was run; every pixel size in this review is computed from the CSS and is marked as such.

## 1. Citations, one by one

### Brief section 2

| Brief says | Tree says | Verdict |
|---|---|---|
| `InsightsPane.svelte:577` opens `{#if isMobile}` | `:577` | right |
| `.insights-flow`, `.flow-head`, `.flow-body`, `.flow-foot` at `:579` to `:586` | `:579`, `:580`, `:581`, `:584` to `:586` | right |
| footer fixed at page 1 of 1, `:585` | `:585` | right |
| `:589` `<PageFit fit={false} pageWidth={dims.width}>` | `:589` | right |
| `:488` `flowWidth`, `:490` `flowSegments` | `:488`, `:490` to `:498` | right |
| style rules `:692`, `:702`, `:706`, `:714`, `:718`, `:724`, `:728` | all seven as cited | right |
| `isMobile` at `:113` and `:146`, "used nowhere else in the file" | `grep -n isMobile` gives `:113`, `:146`, `:577` | right in substance; the wording omits `:577` |
| `Paper.svelte:154` | `:154` | right |
| `MarkupPane.svelte:959` | `:959` | right |
| `+page.svelte` passes `{isMobile}` to `Paper` at `:4302` | `:4302` | right |
| to `InsightsPane` at `:4352` | `:4352` (the tag opens `:4351`) | right |
| to `MarkupPane` at `:4379` | `:4379` is a comment line; the tag opens `:4384` and `{isMobile}` is `:4385` | **wrong, shifted by 6** |
| `isMobile` set at `:3633` as `!isDeskLayout(window.innerWidth)` | `:3633` | right |
| `isPhone` at `:3635` | `:3635` | right |
| `PageFit.svelte:6-15`, `:45-51`, `:107-128` | all three as cited | right |
| measurer at `InsightsPane.svelte:566-574`, `.measurer` at `:674-680` | as cited | right |
| `pages` comes from measured heights, not `flowWidth` | `:459` to `:485` reads `heights`, `breakTops`, `footHeight`; no `flowWidth` | right |

### Brief section 3

| Brief says | Tree says | Verdict |
|---|---|---|
| delete `:577` to `:587`, the `{:else}`, and the closing `{/if}` | `{:else}` is `:588`, `{/if}` is `:613` | right |
| `flowSegments` `:490` to `:498`, with its comment | comment at `:489` | right |
| style rules `:691` to `:730` | `:691` comment through `:730` closing brace | right |
| ratchet `"apps/web/src/lib/insights/InsightsPane.svelte": 744` | `scripts/ratchets.json:18`; the file is 742 lines (`wc -l`) | right |
| `insights-key-lines.test.ts:43` and `:69` | as cited | right |
| `one-head-one-foot.test.ts:23`, `:33` | as cited | right |
| same file `:40`, `:45`, `:52` | `:40` and `:45` are MarkupPane's assertions; the INSIGHTS ones are `:41`, `:46`, and `:53` | **shifted by 1, three times** |
| same file `:58-70` | INSIGHTS assertions at `:59` to `:63` and `:68` to `:69` | right |
| `footer-credit.test.ts:42` | `:42` | right |
| gate baselines from `~/Downloads/ilya-ship.sh` | the file is outside the connected folder | **not established by this review** |

### Brief section 6

| Brief says | Tree says | Verdict |
|---|---|---|
| `insights-label.test.ts` tolerances at `:50-53` | `:51` to `:53` | right |
| selects the on-screen copy by `left > -1000` | `:41`, `:46`, `:47` | right |
| `insights-links.test.ts:29` is `b.x >= 0 && b.x < 390` | that test is `:26`, and again `:61`; `:29` is `const band` | **wrong, shifted by 3** |
| flakes at `voice-stations.test.ts:62` and `insights-links.test.ts:32`, recorded in `STATE.md` | `docs/memory/STATE.md:23`; both lines are test declarations | right |
| phone footer reads 1 of 1, `:585` | `:585` | right |

Three wrong line numbers. The first one matters most: step 0 tells Code to stop if any section 2 citation fails, so the brief as written halts itself at `+page.svelte:4379`. Step 0 also says "eleven citations"; section 2 carries more than eleven.

## 2. What the brief missed

1. **A stale comment in the file being repaired.** `InsightsPane.svelte:19` reads "On the phone the same blocks run in one column (the phone board)." Step 1 deletes the branch and leaves this sentence standing. The same block's line `:14` to `:19` is the pane's own account of how it draws.

2. **The branch is not phone-only.** `isMobile` is `!isDeskLayout(window.innerWidth)` (`+page.svelte:3633`), and the comment above it puts the threshold at 1400 (`+page.svelte:3628` to `:3631`; the media query is `max-width: 1399px`, `:5410`). So the reflowed column is what INSIGHTS draws today on a tablet and in any window under 1400 px, and this lane changes all of those. From `PageFit.svelte:51` and the 24 px gutter (`+page.svelte:5432`, `app.css:142`): at any width where the desk is 816 px or wider the page lands at full size, centred by `PageFit.svelte:57`; below that it scales. The brief's pictures cover 390 px only.

3. **The scale at 390 px is about 0.42, not 0.48.** Computed, not measured: the desk's content width is 390 less twice the 24 px gutter, 342 px (`+page.svelte:5432`; `box-sizing: border-box` at `app.css:192`, its selector not read), and `PageFit.svelte:51` divides by 816, giving 0.419. Brief section 6 item 1 uses "about 0.24 px", which implies 0.48.

4. **`e2e-phone/voice-stations.test.ts` drives the page too.** It opens INSIGHTS at 390 px (`:57`) and clicks "Add your range" by role (`:59`, `:71`, `:72`). The measurer is `aria-hidden` and `inert` (`InsightsPane.svelte:567`), so the role query finds the page's copy alone. The brief names this file only as a flake. I expect it to hold; not established without a run.

5. **"Done when" cannot be met as written.** "No `insights-flow`, `flow-head`, `flow-body`, or `flow-foot` remains anywhere in the repository": `git --no-optional-locks grep` finds the names in six tracked files under `docs/sessions/` (`brief-code-row134-printed-colours_r2_2026-10-25.md`, `insights-r2-shots/shots66.mjs`, `report-code-n182-suggesting-a-key_r2_2026-11-01.md`, `review-fable-brief-row134_r1_2026-10-25.md`, `rows-78-79-shots/figure85.mjs`, `rows-78-79-shots/shoot.mjs`), and the brief itself carries them. Those are session records. Under `apps/` the only hits are `InsightsPane.svelte` and `e2e/insights-key-lines.test.ts:43` and `:69`, as the brief found. No hit under `packages/` or `scripts/`.

6. **A comment in the test to keep true.** `e2e/insights-key-lines.test.ts:42` reads "the letter pages on the desk, the one column on a phone."

7. **Section 0's "never prints" is not supported.** No rule hides `.insights-flow` in print: `app.css:276` to `:288` and `:297` to `:302` name `.insights-container` only, and `InsightsPane.svelte:732` to `:741` names `.paper-page` and `.screen-only`. By reading, a print from a layout under 1400 px today emits the column; not measured. After the repair that print emits the pages, through `PageFit.svelte:114` to `:128`. This is a change in what a phone prints, and the brief's report asks for no evidence of it.

8. **The label test changes meaning.** `e2e-phone/insights-label.test.ts:2` to `:6` describes the label cut "on a phone", where the figure had the column's width. After the repair every block is drawn at `COLUMN` or `INSIDE` (`InsightsPane.svelte:384`, `:385`, `:604`), so the figure inside a squircle is 570 px wide in page pixels (816 less two 96 px margins, `page-config.ts:21`, less 54) at every viewport. The narrow cut is then drawn nowhere. The test's assertions still compare like with like. Whether `PitchSeconds.svelte:69` to `:91` still cuts the label at 570 px is not established.

9. **Nothing else under `apps/web/src` reads the flow names or assumes a column.** `grep` for `insights-flow|flow-head|flow-body|flow-foot|flowWidth|flowSegments` over tracked files outside `docs/` returns `InsightsPane.svelte` and the one test. `+page.svelte` mentions INSIGHTS as a document at `:4346` and `:5039` only. `GuideContent.svelte` has no line pairing a phone with INSIGHTS, a page, or a column (grep, both languages).

## 3. Does the repair produce the ruled result

Yes, by reading. After step 1 the `PageFit` call is the same call `MarkupPane.svelte:959` makes, with the same `dims.width`, and `.insights-container` is declared the same as the other two stacks (`InsightsPane.svelte:616` to `:624`). The page articles carry inline 816 px by 1056 px sizes (`:595`), which `PageFit.svelte:71` wraps in an 816 px box and scales. The differences between the three panes that bear on the fit:

- **The measurer sits outside `PageFit`, and that is what keeps it correct.** `InsightsPane.svelte:567` is a sibling of the `PageFit` call at `:589`. `Paper.svelte` keeps its footer probe inside the fit (`Paper.svelte:157`). INSIGHTS reads its line breaks with `getBoundingClientRect` and `getClientRects` (`insights/line-breaks.ts:27`, `:34`), which a transform scales, so a measurer moved inside the fit would return break offsets at 0.42 of their page value. Where it stands today it is unscaled. The brief says "keep the measurer"; it does not say "keep it where it is", and a tidy-minded session could move it.
- **Measured heights.** Block heights and the footer height are `offsetHeight` (`InsightsPane.svelte:415`, `:417`), the header heights are `bind:offsetHeight` (`TitleHeader.svelte:154`, `RunningHeader.svelte:53`), and the fit's own height is `bind:clientHeight` (`PageFit.svelte:69`). None of these is changed by a transform. The figures measure text with `getComputedTextLength` (`PitchSeconds.svelte:70`) and canvas `measureText` (`CompassStave.svelte:55`, `Tessituragram.svelte:79`), also unchanged by a transform.
- **One shared measurement does read scaled rectangles.** `TitleHeader.svelte:130` to `:135` reads `getClientRects` and compares the result with `clientWidth` values at `:141`. Under a fit the first is scaled and the second is not. This path serves the legend beside the subtitle (`TitleHeader.svelte:92` to `:115`), and TEXT and MELODY already run it under the fit on a phone. Whether INSIGHTS reaches it is not established. It is not this lane's to repair.
- **Absolutely positioned children.** `.column` is absolute inside a `position: relative` page (`InsightsPane.svelte:626` to `:641`), the same shape the other two pages use. No difference.
- **Overflow.** A block cut across a page break is shown through an `overflow: hidden` window (`:556` to `:560`, `:670` to `:672`). This is the desktop path today and it scales whole.
- **Scroll height.** `PageFit` reserves `naturalHeight * scale` (`PageFit.svelte:64`). The measurer is `position: absolute; left: -20000px; top: 0` (`:674` to `:680`) and holds every block at full size, so after the repair it is taller than the scaled stack for the first time. Its containing block appears to be `.app-content` (`position: relative` at `+page.svelte:5412`; no `position` on `.main-content` in `:4877` to `:4904` or `:5417` to `:5452`), which would keep it out of the scroller's height. Whether the scroller grows past the last page on a phone is **not established**; it needs one measurement.
- **Opening a disclosure.** "N more observations" and the key reveal re-page the document on screen (`InsightsPane.svelte:425` to `:433`, `:458`). The fit's height follows through `bind:clientHeight`. Same as the desktop.
- **Print.** `PageFit.svelte:114` to `:128` undoes the fit, `app.css:276` to `:288` resets the stack, and `beforeprint` closes both disclosures (`InsightsPane.svelte:437` to `:444`). By reading, a phone prints what the desktop prints. Not measured.
- **The loupe rule.** `+page.svelte:5148` to `:5151` dims `.paper-fit` and stops its taps while a loupe is up. INSIGHTS is already inside `.paper-fit` on the desktop, and only the score raises a loupe (`+page.svelte:5141` to `:5143`). No change.

## 4. Tap targets

### What is ruled, quoted

- `docs/memory/OPEN.md:2684`: "**Control geometry answers to input modality, not to form factor or brand.**" Hook: "`@media (pointer: coarse)`, not a width query; the desktop keeps its sizes." And: "touch geometry E, a 44 px floor with the exemption rule *\"Every exemption is named in the record with its justification. An exemption that is not named does not exist.\"*"
- `docs/memory/PRODUCT.md:595`: "The drawer also carries two existing 44 px touch-target exemptions, ruled in E.36: the table-of-contents rows and the stress circles."
- `docs/memory/CONTRACT.md:154`: "Do not create a third touch-geometry exemption. The cursor alone takes the 44 px floor (N.55b's station shape, ruled 2026-08-13, corrected 2026-08-14); every other syllable is plain text and stays directly tappable."
- `docs/memory/CONTRACT.md:149`: "Do not put a control on the paper: drawer manipulates, page displays and prints. **No control is part of the printed page; passing layers, the loupe, and the Transposition ruler float above it and never print**".
- `docs/memory/OWED.md:697`: N.15, "The touch-target repair", "`RULED`, increment 1 specified and unapplied".
- `apps/web/src/app.css:395` to `:396`: "maximum-scale=1 is NOT on the table. It would also stop the zoom, and it kills pinch, which Dann kept deliberately (E.36 section 7.6)." The viewport tag carries no scale limit (`apps/web/src/app.html:37`).

I found no ruling that names the controls on the INSIGHTS page, and no ruling about controls inside a scaled page. The ruling text `claude/e36-RULED-touch-geometry_2026-08-10.md` is project knowledge and was not readable from here.

### What the controls are, and what the scale does to them

The page carries these controls, all screen-only (`SingerBlock.svelte:615` to `:623`): "Try this key" (`:69`), the range offer and its decline (`:95`), the two disclosures (`:115` to `:121`), the notes links (`:180`, `:181`), the INPUT link (`:63`), and "Change the tempo" (`:186`).

None has a coarse-pointer rule: `grep` for `pointer: coarse` and for `44px` in `apps/web/src/lib/insights/*.svelte` returns nothing. Their declared sizes: `.try-key` is 11.5 px type with 1 px vertical padding and a 1 px border (`:563` to `:573`); `.offer-link` and `.offer-decline` have no padding (`:585` to `:598`) and sit in 14 px prose (`:231` to `:235`); both `summary` lines are 11.5 px (`:600` to `:613`); `.tempo-link` has 0.1 rem of vertical padding (`:370` to `:373`).

Computed from those declarations, **not measured**: at full size each is roughly 17 to 21 px tall, which is where the phone column draws them today. At a scale of 0.419 each becomes roughly 7 to 9 px tall on the screen, and its width shrinks by the same factor.

### Whose defect

- These controls are under the 44 px floor today, on the phone column, with no named exemption. That predates this lane. It belongs with N.15 (`OWED.md:697`) or with a ruling of its own.
- This lane does not create the non-conformance. It makes each target about 2.4 times smaller in each direction.
- Dann's ruling accepts "the legibility cost of the smaller type". Whether a thumb can land on a 7 to 9 px control is a different cost, and nothing I read rules on it.
- I do not recommend that this lane repair it. Any repair is a design, and none is ruled. The lane owes a measurement: the on-screen box of each control at 390 px, before and after, in its report, so the finding reaches the desk with numbers.
- One fact that bears on it and is already in the product: the browser's own pinch is kept on purpose (`app.css:395` to `:396`). Whether a pinch on the INSIGHTS page behaves well is not established.

## 5. The gate expectation

Gate 4 holds, by reading. Two source-reading tests name `InsightsPane.svelte`: `one-head-one-foot.test.ts:23` and `footer-credit.test.ts:42` (`git grep -l InsightsPane` over `apps/web`; the other test hits are comments). Each assertion against the pane after the repair:

- `:33`, the running head call: matched by `InsightsPane.svelte:601`, kept.
- `:41`, the page 1 tab mark: matched by `:507`, kept.
- `:46`, `formatRunningHeader(composer, scoreTitle ?? '', poet)`: `:500`, kept.
- `:53`, no identity line in the running head: unaffected.
- `:59` to `:63`: `<PageFooter` stays at `:572` and `:607`; `hairlineAccent="var(--rose)"` stays; `notesBlock(methodLine` stays at `:339`; the two absent strings stay absent.
- `:68`, `:69`: `bind:this={footProbe}` at `:571` and the assignment at `:417`, both kept.
- `footer-credit.test.ts:44`, `:45`: the deletion adds neither string.

The deleted branch holds one of the three `<PageFooter` calls (`:585`) and no assertion counts them.

Gate 8: `scripts/ratchets.mjs:63` to `:67` counts lines and reports a ceiling that can fall; it does not fail on one. The brief's instruction to lower it is right.

Gate 3 (12 warnings in 5 files): whether any of the 12 sits in the deleted style rules is not established. If one does, the count falls, and the brief's rule "do not move a baseline yourself" covers gate 4 by name only.

The baselines themselves are not established by this review (section 1).

## 6. The brief's risk section

1. **Item 1 has its arithmetic backwards.** A screen tolerance of 0.5 px under a scale of 0.419 is about 1.19 px of page space, so the test becomes looser in page terms, not tighter. The "like with like" reasoning is right (`insights-label.test.ts:41` to `:53` measures the svg and its tspans in one frame). The larger change is in section 2 item 8 above.
2. **Item 2 is right in substance, wrong in its line.** The on-screen copy lands between x = 24 and x = 366 by the gutter arithmetic, inside `[0, 390)`. The desktop twin clicks the same link with a strict role locator on the same fixture and voice (`e2e/insights-links.test.ts:14`, `:29`, `:38`), which implies one on-screen copy; the phone now pages the same blocks the same way.
3. **Item 3 is right** against `STATE.md:23`.
4. **Item 4 is right.**

Missing from the risks: the tap sizes (section 4), the scroll height (section 3), the layouts between 391 and 1399 px (section 2 item 2), and what a phone prints (section 2 item 7).

## 7. Verdict

**SEND WITH AMENDMENTS.** Amendments 1 to 3 are blockers: as written, step 0 stops the lane at the first of them.

1. Section 2: change "to `MarkupPane` (`:4379`)" to "to `MarkupPane` (`:4385`; the tag opens at `:4384`)".
2. Section 6 item 2: change "(`:29`)" to "(`:26`, and again at `:61`)".
3. Section 3 step 4: change the `one-head-one-foot.test.ts` list to "`:23`, `:33`, `:41`, `:46`, `:53`, `:59-63`, `:68-69`".
4. Step 0: change "Read the eleven citations in section 2" to "Read every citation in section 2". Section 2: change "and is used nowhere else in the file" to "and is read at `:577` alone".
5. Step 1, new item: "Rewrite the last sentence of the header comment (`:19`, 'On the phone the same blocks run in one column (the phone board).') to say the page is drawn once and `PageFit` scales it below the desk layout. Change no other comment."
6. Step 1 item 5, add: "The measurer stays where it is, outside `PageFit` (`:567`, a sibling of the call at `:589`). `insights/line-breaks.ts:27` and `:34` read client rectangles, which a transform scales; inside the fit they would return break offsets at the scale."
7. Section 0 and section 2: say once that `isMobile` is every layout under 1400 px (`+page.svelte:3633`, `:5410`), so this lane also changes INSIGHTS on a tablet and in a narrow window. Step 3, add two pictures in English: INSIGHTS page 1 at 768 by 1024 and at 1024 by 768.
8. Section 0: strike "and never prints". Step 3, add: "Report what `page.pdf()` or print emulation gives for INSIGHTS at 390 by 844: the page count, against the same song and voice at 1440 px. Report only; add no test."
9. Step 2, add: "Rewrite the comment at `:42` to match."
10. Section 6 item 1: replace the sentence about 0.24 px with: "The scale at 390 px is about 0.42 (342 px of desk over 816; computed, confirm it). A 0.5 px screen tolerance is then about 1.2 px of page space, so the test is looser than before, not tighter. The figure is now drawn at its page width at every viewport, so report how many lines the label takes in each of the four cases. Do not delete, rename, or loosen the test."
11. New step between 3 and 4, "The taps, measured": "At 390 by 844, on the same song and voice, report the on-screen width and height (`getBoundingClientRect`) of every control on the page: `.try-key`, `.offer-link`, `.offer-decline`, `.tempo-link`, `.more summary`, `.reveal summary`. Take the same numbers at `3271b4da` before step 1. Report both tables. Change no control's size, padding, or hit area: the floor is ruled (`OPEN.md:2684`, `CONTRACT.md:154`) and its repair is not this lane's."
12. Step 3, add: "Report the scroller's `scrollHeight` on INSIGHTS at 390 px against the bottom edge of `.paper-fit` plus the scroller's bottom padding, and the same two numbers on MELODY. If INSIGHTS scrolls past its last page by more than MELODY does, say by how much and stop."
13. Step 3: change "with one of its stored voices" to "with a stored voice whose INSIGHTS runs to at least two pages; report the page count in each language. If no voice in that file gives two pages, say so and send page 1 alone."
14. Section 8: change "anywhere in the repository" to "under `apps/`". Add: "Session records under `docs/sessions/` keep the old names and are not edited."
15. Step 4: after "do not move a baseline yourself", add: "The same holds for gate 3: if the warning count falls because a deleted rule carried one, report which, and leave the baseline to the desk."
16. Section 4: change "`InsightsPane.svelte:589`" to "the `PageFit` call in `InsightsPane.svelte`", since step 1 moves that line.

## FOR DANN'S EYE

1. **Can your thumb hit the taps on the page.** "Try this key", "Add your range", "N more observations", "Show keys that reach higher", and "Change the tempo" shrink with the page. By my arithmetic they go from about 17 to 21 px tall to about 7 to 9 px tall on your iPhone; nobody has measured it yet. Pinch still works in the browser. The lane will bring you the measured sizes and will not change them.
2. **Tablets and narrow windows change too.** Anything under 1400 px wide shows the column today. After this lane an iPad shows the page, at or near full size.
3. **Printing from a phone changes.** By my reading, a phone today prints the column. After this lane it prints the same pages the desktop prints. The lane will confirm it.
4. **The footer on a phone tells the truth.** It reads "1 of 1" today whatever the length. After this lane it reads the real page count.

Nothing here reopens the type size.
