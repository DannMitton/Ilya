# Brief, lane 70: INSIGHTS is WYSIWYG on a phone

r2, 2026-11-19, written by the desk (Opus 5) against `Shane` `3271b4da`, working tree clean.
r2 applies all sixteen amendments of `review-fable-lane70-brief_r1_2026-11-19.md`; r1 is
superseded, do not send it. Every line cited below was read from that tree, either by the
desk or by that review, and the three corrected citations were re-read by the desk.

## 0. What this screen is for

A singer opens INSIGHTS to read what Ilya has found about this song in this voice, and to
print or share what they read. TEXT and MELODY draw the printed page itself and scale it to
the narrow screen, so what the singer sees is the sheet. INSIGHTS alone draws something
else: one reflowed column at full type size, which is not the page at all. A singer moving
between the three tabs meets two different kinds of object and has to learn which is which.

This lane makes INSIGHTS the third page.

**Who meets the change.** `isMobile` is not a phone test. It is
`!isDeskLayout(window.innerWidth)` (`apps/web/src/routes/+page.svelte:3633`), and
`isDeskLayout` is true at 1400 px and above (`apps/web/src/lib/components/Drawer/layout.ts:62`,
pinned at `layout.test.ts:53-54`). So every layout under 1400 px sees the column today and
the scaled page after: phones, tablets, and a narrow desktop window alike.

## 1. The ruling

Dann, 2026-11-18 23:36, transcribed as written:

> Claude. I am AuDHD. / Repair INSIGHTS to be WYSIWYG... it is the only one of the three
> that is not WYSIWYG. / I don't need more choice. I need consistency.

Recorded in `docs/memory/OPEN.md`, section "THE WALK OF 2026-11-18/19", ruling 1, and in
`docs/memory/INBOX.md` under that time.

**The legibility cost of the smaller type is accepted and is never re-raised.** Do not add a
zoom, a reading aid, a toggle between a page and a column, a "tap to enlarge", or any second
drawing of the same content. Any such addition fails this brief.

## 2. What is there today

Read 2026-11-19 from `Shane` `3271b4da`.

- `apps/web/src/lib/insights/InsightsPane.svelte:577` opens `{#if isMobile}`, a branch that
  draws `.insights-flow` with `.flow-head`, `.flow-body`, and `.flow-foot` (`:579` to
  `:586`), one column at full size, with a footer fixed at page 1 of 1 (`:585`).
- `:589` is `<PageFit fit={false} pageWidth={dims.width}>`, so the page stack never fits,
  which is correct today because it is reached only above 1400 px.
- `:488` `let flowWidth = $state(358);` and `:490` `const flowSegments = $derived.by(...)`
  exist for that branch alone.
- The style block carries `.insights-flow` (`:692`), `.flow-head` (`:702`, `:706`, `:714`),
  `.flow-body` (`:718`, `:724`), and `.flow-foot` (`:728`) for that branch alone.
- `isMobile` enters the component at `:113` (prop type) and `:146` (default `false`), and is
  read at `:577` alone.
- `:19`, inside the file's header comment, says "On the phone the same blocks run in one
  column (the phone board)". It goes stale with the branch.

The two panes that already do what Dann asked for:

- `apps/web/src/lib/components/Paper/Paper.svelte:154` is `<PageFit fit={isMobile}
  pageWidth={PAGE_SIZES[pageSize].width}>`.
- `apps/web/src/lib/markup/MarkupPane.svelte:959` is `<PageFit fit={isMobile}
  pageWidth={dims.width}>`.

All three panes receive the same flag from the same place: `apps/web/src/routes/+page.svelte`
passes `{isMobile}` to `Paper` (`:4302`), to `InsightsPane` (`:4352`), and to `MarkupPane`
(the tag opens at `:4384`, the prop is `:4385`).

`PageFit.svelte` needs no change. It is one implementation for both documents by design
(`PageFit.svelte:6-15`), it clamps the scale at 1 so a stale flag on a wide desk cannot
enlarge a page (`:45-51`), and it undoes every part of the fit for print (`:107-128`).

**The scale on a phone is about 0.42, not a half.** The desk's content width at 390 px is
390 less two 24 px gutters (`app.css:142`, `+page.svelte:5432`), so `PageFit.svelte:51`
gives 342 over 816, about 0.419. Every size on the page shrinks by that factor.

The pagination INSIGHTS needs already runs under 1400 px: the measurer draws every block once
off screen at its printed width (`InsightsPane.svelte:566-574`, `.measurer` at
`left: -20000px`, `:674-680`), and `pages` is derived from those measured heights, not from
`flowWidth`. So the page stack is already correct and is simply not shown.

## 3. The work

One commit per step, one report per step, named
`docs/sessions/report-code-lane70-step<n>_r1_2026-11-19.md`.

### Step 0. Hold or break the premise

Read every citation in section 2 against the tree you have. Report, for each, whether the
line says what this brief says it says. If any does not, stop and report before changing
anything.

Then state, from the code and not from inference, what under `apps/` reads `.insights-flow`,
`.flow-head`, `.flow-body`, `.flow-foot`, `flowWidth`, or `flowSegments`. The desk and the
review together found the component itself and `apps/web/e2e/insights-key-lines.test.ts:43`
and `:69`, and nothing else under `apps/`. Report what you find, including anything in
`apps/web/e2e-phone/`. Session records under `docs/sessions/` keep those names and are not
edited.

### Step 1. The repair

In `apps/web/src/lib/insights/InsightsPane.svelte`:

1. Delete the `{#if isMobile}` branch whole (`:577` to `:587`, the `.insights-flow` block and
   its three children), and the `{:else}` and the closing `{/if}` with it, so the `PageFit`
   block stands alone and unconditional.
2. Change `fit={false}` to `fit={isMobile}` on that `PageFit` (`:589` before your edits move
   it).
3. Delete `flowWidth` (`:488`) and `flowSegments` (`:490` to `:498`), and the comment that
   introduces `flowSegments`.
4. Delete the style rules that only that branch used: `.insights-flow`, `.flow-head` and its
   two `:global` rules, `.flow-body` and `.flow-body .squircle`, and `.flow-foot
   :global(.page-footer)` (`:691` to `:730`, with the `/* The phone: one column... */`
   comment heading them).
5. Rewrite the last sentence of the header comment at `:19` so it says what is now true: the
   page is drawn once and scaled to fit a narrow screen. Change no other comment in the file.
6. **Keep the measurer where it is, outside `PageFit`** (`:566-574`, a sibling of the
   `PageFit` call). It must not move inside, because `insights/line-breaks.ts:27` and `:34`
   read client rectangles (`getBoundingClientRect`, `getClientRects`), and a CSS transform
   scales those; measuring inside the fit would feed scaled line boxes into pagination.
   Keep the foot probe with it.
7. Keep everything else: `pages`, `segment`, `part`, `blockAt`, `header`,
   `.insights-container`, `.paper-page`, `.column`, `.squircle` and its open-top and
   open-bottom forms, `.part`, and the `@media print` block.
8. Add one comment above the `PageFit` call, in Ilya's own voice, naming the ruling and its
   date: INSIGHTS draws the page and `PageFit` scales it under 1400 px, as Text and the
   marked score do; ruled by Dann 2026-11-18 23:36.
9. Lower this file's ratchet in `scripts/ratchets.json` (today
   `"apps/web/src/lib/insights/InsightsPane.svelte": 744`) to the file's new line count.
   Report the before and after numbers.

Nothing on the page changes. No string is added, removed, or reworded. No component is added.
No prop is added or removed. No control's size or hit area changes. `+page.svelte` is not
touched.

### Step 2. The one test that names the old root

`apps/web/e2e/insights-key-lines.test.ts` chooses its root by viewport:

- `:42` is the comment "The page's own root: the letter pages on the desk, the one column on
  a phone."
- `:43` `const rootOf = (width) => (width === 'phone' ? '.insights-flow' : '.insights-container');`
- `:69` screenshots `'.insights-flow .block-conclusion'` on a phone and
  `'.insights-container .paper-page'` elsewhere.

Make the root `.insights-container` for both, make the phone screenshot target
`.insights-container .paper-page`, and rewrite the comment at `:42` to say that the root is
now one for both viewports. Keep the `width` parameter and both viewports: the point of this
file is that the key lines read correctly at 390 px as well as at 1440 px, and that point
survives.

Do not change its assertions.

### Step 3. The pictures, and four things to report

Run at 390 by 844 in English and in French, on the Sunless no. 1 engraved fixture already
used by that test file. Choose a stored voice from that file whose INSIGHTS runs to at least
two pages; if none of them does, say so and report the page count you got.

Pictures, saved under `docs/sessions/lane70-shots/` and named in the report:

1. INSIGHTS page 1, whole, English and French.
2. The foot of page 1 and the head of page 2, so the page break is visible, English.
3. English only, at 768 by 1024 and at 1024 by 768, since every layout under 1400 px changes.

Report, measure only, changing nothing:

4. The page count per language at 390 by 844.
5. The printed page count at 390 by 844 against the printed page count at 1440 px, on the
   same song and voice. The desk has established only that no rule under `app.css` or in the
   component hides `.insights-flow` in print; what a narrow layout prints today is otherwise
   NOT ESTABLISHED, so measure it rather than reasoning about it. Write no new test.
6. The scroller's `scrollHeight` against the bottom of `.paper-fit`, on INSIGHTS and on
   MELODY, at 390 by 844. The off-screen measurer is now taller than the scaled stack for the
   first time. If INSIGHTS overscrolls further than MELODY does, stop and report before step
   4.

### Step 3b. The taps, measured

Report the on-screen bounding box, width and height in CSS pixels, of each of these at 390 by
844, before the repair and after it, in one table: `.try-key`, `.offer-link`,
`.offer-decline`, `.tempo-link`, `.more summary`, and `.reveal summary` (declarations at
`apps/web/src/lib/insights/SingerBlock.svelte:370-373` and `:556-613`; the controls
themselves at `:63`, `:69`, `:95`, `:180-181`, `:186`).

**Change nothing.** No size, no padding, no hit area, no coarse-pointer rule. This is a
measurement Dann asked to see, and the design question it raises is his, not this lane's.

### Step 4. The gates, and the report

Run all eight gates and the Playwright suites you can run, and report each against its
baseline (from `~/Downloads/ilya-ship.sh:90-92`, `:180-182`, `:186-188`, md5
`a13b0969fbacd36ce4211fca6a3e66cb`, read by the desk 2026-11-19):

- gate 1 phonology: `462 passed (462)`
- gate 2 dictionary: `248 passed (248)`
- gate 3 web-check: `found 0 errors and 12 warnings in 5 files`
- gate 4 web-test: `6691 passed | 1 skipped (6692)`
- gate 5 score-parser: `904 passed | 5 skipped (909)`
- gate 6 blurb: `178 passed (178)`
- gate 7 integration: `159 passed (159)`
- gate 8 ratchets: `ratchets: OK.`

Gate 4 is expected to stay at its baseline. The guards that read this file's source assert on
the `RunningHeader` calls, `PageFooter`, `hairlineAccent="var(--rose)"`, `footProbe`,
`notesBlock(methodLine`, `formatRunningHeader`, and the absence of `class="insights-foot"`,
`{#snippet apparatus()}`, `attribution={`, and `strikeLiederClause`:
`apps/web/src/lib/components/Paper/one-head-one-foot.test.ts:23`, `:33`, `:41`, `:46`, `:53`,
`:59-63`, `:68-69`, and `apps/web/src/lib/components/footer-credit.test.ts:42`, `:44-45`.
None of those is in the deleted branch.

Gate 3's twelve warnings are in five files; whether one of them is in the deleted style rules
is NOT ESTABLISHED, so report gate 3's exact line.

**If gate 3 or gate 4 moves, say by how many and which file, and do not move a baseline
yourself.** Report the ratchet's new number for `InsightsPane.svelte`.

## 4. What this brief changes about a computed number

Nothing is computed differently. The only value that changes is the boolean handed to
`PageFit` by one caller. The scale itself is computed at exactly one site,
`apps/web/src/lib/components/Paper/PageFit.svelte:51`
(`Math.min(1, fitWidth / pageWidth)`), and its three callers after this lane are
`Paper.svelte:154`, `MarkupPane.svelte:959`, and the `PageFit` call in `InsightsPane.svelte`,
each passing the same `isMobile` from `+page.svelte`. What depended on them agreeing is the
singer's experience of the three tabs as one kind of object, which is the ruling itself. Do
not add a second scale, a second fit, or a per-pane override.

## 5. Constraints

- Do not touch `PageFit.svelte`, `Paper.svelte`, `MarkupPane.svelte`, or `+page.svelte`.
- Do not add a string, in either language.
- Do not add a control to the page (`docs/memory/CONTRACT.md` section 8: the drawer
  manipulates, the page displays and prints).
- Do not add a zoom, a reading aid, a size toggle, or a "tap to enlarge".
- Do not change the print path. Print must emit the page whole, as `PageFit.svelte:107-128`
  already arranges.
- Do not change any control's size, padding, or hit area, and do not add a coarse-pointer
  rule. Step 3b measures; it does not repair.
- One commit per step, each with its report committed in the same commit.
- Push to `cloud-lane-70`, cut from `Shane` `3271b4da`. Never push to `Shane` or `main`.
- Do not edit anything under `docs/memory/`.

## 6. Risks already found, named so you can check them

These are leads, not instructions. Report what you find; repair only what is in scope.

1. **`apps/web/e2e-phone/insights-label.test.ts`** measures the bracket label's `<tspan>`
   boxes against the figure's own SVG box at 390 px, with absolute tolerances of 0.5 px. Both
   boxes are inside the same scaled container, so the comparison stays like with like, and at
   a scale of about 0.42 a 0.5 px screen tolerance is about 1.2 px of page space: the test
   gets looser, not tighter. What does change is the figure's drawn width, which becomes 570
   page pixels at every viewport, so the narrow cut that test was written for is drawn
   nowhere. Report the label's line count in each of its four cases. **Do not delete, rename,
   or loosen that test.** If it fails, report the measured numbers.
   It selects the on-screen copy by `getBoundingClientRect().left > -1000`, which still
   separates it from the measurer at `left: -20000px`.
2. **`apps/web/e2e-phone/insights-links.test.ts`** picks the on-screen copy of a link by
   `b.x >= 0 && b.x < 390` at `:26` and again at `:61`. The on-screen copy lands between
   x = 24 and x = 366 under the fit, so that still holds. Its station assertions read the
   drawer, not the pane.
3. **`apps/web/e2e-phone/voice-stations.test.ts:57-72`** drives the INSIGHTS page too; it
   clicks "Add your range" by role. The measurer is `aria-hidden` and `inert`
   (`InsightsPane.svelte:567`), so it should still find one copy, but that is NOT ESTABLISHED
   without a run. Run it and report.
4. **Two phone checks are known to flake** at `voice-stations.test.ts:62` and
   `insights-links.test.ts:32` (2 of 3 runs at `737228cb`, before lane 68; cause NOT
   ESTABLISHED, `docs/memory/STATE.md:23`). If either fails, run it alone and report both
   results. Do not treat a known flake as this lane's fault, and do not treat this lane's
   fault as a known flake.
5. **`TitleHeader.svelte:130-141` compares scaled rectangles with unscaled widths.** TEXT and
   MELODY already run it under the fit, so it is not this lane's defect; whether INSIGHTS
   reaches that code is NOT ESTABLISHED. Report what you find, repair nothing.
6. The footer under 1400 px today reads page 1 of 1 (`InsightsPane.svelte:585`). After the
   repair it reads the real page count. That is the intended change, not a defect.

## 7. What you could not establish

Finish your report with a section headed "NOT ESTABLISHED", listing every claim in this brief
you could not confirm against the tree, and every question your work raised that you did not
answer.

**NOT ESTABLISHED beats a complete invented answer.**

## 8. Done when

- A layout under 1400 px shows INSIGHTS as the 816 px page scaled by `PageFit`, with the same
  page furniture TEXT and MELODY show.
- No `insights-flow`, `flow-head`, `flow-body`, `flowWidth`, or `flowSegments` remains
  anywhere under `apps/`.
- The eight gates stand at their baselines, with the ratchet for `InsightsPane.svelte`
  lowered.
- The pictures and the six reported measurements of steps 3 and 3b exist.
