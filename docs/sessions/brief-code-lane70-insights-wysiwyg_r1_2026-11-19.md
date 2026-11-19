# Brief, lane 70: INSIGHTS is WYSIWYG on a phone

r1, 2026-11-19, written by the desk (Opus 5) against `Shane` `3271b4da`, working tree clean.
Every line cited below was read in this session from that tree.

## 0. What this screen is for

A singer opens INSIGHTS to read what Ilya has found about this song in this voice, and to
print or share what they read. TEXT and MELODY draw the printed page itself and scale it to
the phone, so the phone shows the sheet that comes out of the printer. INSIGHTS alone draws
something else on a phone: one reflowed column, at full type size, that is not a page and
never prints. A singer moving between the three tabs on a phone meets two different kinds of
object and has to learn which is which.

This lane makes INSIGHTS the third page.

## 1. The ruling

Dann, 2026-11-18 23:36, transcribed as written:

> Claude. I am AuDHD. / Repair INSIGHTS to be WYSIWYG... it is the only one of the three
> that is not WYSIWYG. / I don't need more choice. I need consistency.

Recorded in `docs/memory/OPEN.md`, section "THE WALK OF 2026-11-18/19", ruling 1, and in
`docs/memory/INBOX.md` under that time.

**The legibility cost of the smaller type is accepted and is never re-raised.** Do not add a
zoom, a reading aid, a toggle, a "tap to enlarge", or any second drawing of the same content.
Any such addition fails this brief.

## 2. What is there today

Read 2026-11-19 from `Shane` `3271b4da`.

- `apps/web/src/lib/insights/InsightsPane.svelte:577` opens `{#if isMobile}`, a phone-only
  branch that draws `.insights-flow` with `.flow-head`, `.flow-body`, and `.flow-foot`
  (`:579` to `:586`), one column at full size, with a footer fixed at page 1 of 1 (`:585`).
- `:589` is `<PageFit fit={false} pageWidth={dims.width}>`, so the desktop branch never fits,
  which is correct today because it is reached only off the phone.
- `:488` `let flowWidth = $state(358);` and `:490` `const flowSegments = $derived.by(...)`
  exist for that branch alone.
- The style block carries `.insights-flow` (`:692`), `.flow-head` (`:702`, `:706`, `:714`),
  `.flow-body` (`:718`, `:724`), and `.flow-foot` (`:728`) for that branch alone.
- `isMobile` enters the component at `:113` (prop type) and `:146` (default `false`), and is
  used nowhere else in the file.

The two panes that already do what Dann asked for:

- `apps/web/src/lib/components/Paper/Paper.svelte:154` is `<PageFit fit={isMobile}
  pageWidth={PAGE_SIZES[pageSize].width}>`.
- `apps/web/src/lib/markup/MarkupPane.svelte:959` is `<PageFit fit={isMobile}
  pageWidth={dims.width}>`.

All three panes receive the same flag from the same place: `apps/web/src/routes/+page.svelte`
passes `{isMobile}` to `Paper` (`:4302`), to `InsightsPane` (`:4352`), and to `MarkupPane`
(`:4379`). `isMobile` is set at `:3633` as `!isDeskLayout(window.innerWidth)`, the width test
that decides the fit; it is not `isPhone` (`:3635`, the smallest-side test), and this brief
does not touch that distinction.

`PageFit.svelte` needs no change. It is one implementation for both documents by design
(`PageFit.svelte:6-15`), it clamps the scale at 1 so a stale flag on a wide desk cannot
enlarge a page (`:45-51`), and it undoes every part of the fit for print (`:107-128`).

The pagination INSIGHTS needs already runs on a phone: the measurer draws every block once
off screen at its printed width (`InsightsPane.svelte:566-574`, `.measurer` at
`left: -20000px`, `:674-680`), and `pages` is derived from those measured heights, not from
`flowWidth`. So the page stack is already correct on a phone and is simply not shown.

## 3. The work

One commit per step, one report per step, named
`docs/sessions/report-code-lane70-step<n>_r1_2026-11-19.md`.

### Step 0. Hold or break the premise

Read the eleven citations in section 2 against the tree you have. Report, for each, whether
the line says what this brief says it says. If any does not, stop and report before changing
anything.

Then state, from the code and not from inference, whether anything other than
`InsightsPane.svelte` reads `.insights-flow`, `.flow-head`, `.flow-body`, or `.flow-foot`.
The desk found one file outside the component (`apps/web/e2e/insights-key-lines.test.ts`,
step 2 below) and nothing else under `apps/web/src`. Report what you find, including
anything in `apps/web/e2e-phone/`.

### Step 1. The repair

In `apps/web/src/lib/insights/InsightsPane.svelte`:

1. Delete the `{#if isMobile}` branch whole (`:577` to `:587`, the `.insights-flow` block and
   its three children), and the `{:else}` and the closing `{/if}` with it, so the `PageFit`
   block stands alone and unconditional.
2. Change `fit={false}` to `fit={isMobile}` on that `PageFit` (`:589`).
3. Delete `flowWidth` (`:488`) and `flowSegments` (`:490` to `:498`), and the comment that
   introduces `flowSegments`.
4. Delete the style rules that only that branch used: `.insights-flow`, `.flow-head` and its
   two `:global` rules, `.flow-body` and `.flow-body .squircle`, and `.flow-foot
   :global(.page-footer)` (`:691` to `:730`, with the `/* The phone: one column... */`
   comment heading them).
5. Keep everything else: the measurer, the foot probe, `pages`, `segment`, `part`,
   `blockAt`, `header`, `.insights-container`, `.paper-page`, `.column`, `.squircle` and its
   open-top and open-bottom forms, `.part`, and the `@media print` block.
6. Add one comment above the `PageFit` call, in Ilya's own voice, naming the ruling and its
   date: INSIGHTS draws the page and `PageFit` scales it on a phone, as Text and the marked
   score do; ruled by Dann 2026-11-18 23:36.
7. Lower this file's ratchet in `scripts/ratchets.json` (today
   `"apps/web/src/lib/insights/InsightsPane.svelte": 744`) to the file's new line count.
   Report the before and after numbers.

Nothing on the page changes. No string is added, removed, or reworded. No component is added.
No prop is added or removed. `+page.svelte` is not touched.

### Step 2. The one test that names the old root

`apps/web/e2e/insights-key-lines.test.ts` chooses its root by viewport:

- `:43` `const rootOf = (width) => (width === 'phone' ? '.insights-flow' : '.insights-container');`
- `:69` screenshots `'.insights-flow .block-conclusion'` on a phone and
  `'.insights-container .paper-page'` elsewhere.

Make the root `.insights-container` for both, and make the phone screenshot target
`.insights-container .paper-page`, the same as the desktop one, since the phone now shows the
same object. Keep the `width` parameter and both viewports: the point of this file is that
the key lines read correctly at 390 px as well as at 1440 px, and that point survives.

Do not change its assertions.

### Step 3. The pictures

Run, at 390 by 844, in English and in French, on the Sunless no. 1 engraved fixture already
used by that test file, with one of its stored voices:

1. INSIGHTS page 1, whole, as the singer sees it.
2. The foot of INSIGHTS page 1 and the head of page 2, so the page break is visible.

Save them under `docs/sessions/lane70-shots/` and name each one in the step 3 report. The
desk looks at every picture before this lane is reviewed.

### Step 4. The gates, and the report

Run all eight gates and the Playwright suites you can run, and report each against its
baseline:

| gate | baseline |
|---|---|
| 1 phonology | `462 passed (462)` |
| 2 dictionary | `248 passed (248)` |
| 3 web-check | `found 0 errors and 12 warnings in 5 files` |
| 4 web-test | `6691 passed | 1 skipped (6692)` |
| 5 score-parser | `904 passed | 5 skipped (909)` |
| 6 blurb | `178 passed (178)` |
| 7 integration | `159 passed (159)` |
| 8 ratchets | `ratchets: OK.` |

(from `~/Downloads/ilya-ship.sh:90-92`, `:180-182`, `:186-188`, md5 `a13b0969fbacd36ce4211fca6a3e66cb`,
read 2026-11-19.)

Gate 4 is expected to stay at its baseline: the guards that read this file's source
(`apps/web/src/lib/components/Paper/one-head-one-foot.test.ts:23`, `:33`, `:40`, `:45`,
`:52`, `:58-70`; `apps/web/src/lib/components/footer-credit.test.ts:42`) assert on the
`RunningHeader` calls, `PageFooter`, `hairlineAccent="var(--rose)"`, `footProbe`,
`notesBlock(methodLine`, `formatRunningHeader`, and the absence of
`class="insights-foot"`, `{#snippet apparatus()}`, `attribution={`, and
`strikeLiederClause`. None of those is in the deleted branch. **If gate 4 moves, say by how
many and which file, and do not move a baseline yourself.**

Report the ratchet's new number for `InsightsPane.svelte`.

## 4. What this brief changes about a computed number

Nothing is computed differently. The only value that changes is the boolean handed to
`PageFit` by one caller. The scale itself is computed at exactly one site,
`apps/web/src/lib/components/Paper/PageFit.svelte:51`
(`Math.min(1, fitWidth / pageWidth)`), and its three callers after this lane are
`Paper.svelte:154`, `MarkupPane.svelte:959`, and `InsightsPane.svelte:589`, each passing the
same `isMobile` from `+page.svelte`. What depended on them agreeing is the singer's
experience of the three tabs as one kind of object, which is the ruling itself. Do not add a
second scale, a second fit, or a per-pane override.

## 5. Constraints

- Do not touch `PageFit.svelte`, `Paper.svelte`, `MarkupPane.svelte`, or `+page.svelte`.
- Do not add a string, in either language.
- Do not add a control to the page (`docs/memory/CONTRACT.md` section 8: the drawer
  manipulates, the page displays and prints).
- Do not add a zoom, a reading aid, a size toggle, or a "tap to enlarge".
- Do not change the print path. Print must emit the page whole, as `PageFit.svelte:107-128`
  already arranges.
- One commit per step, each with its report committed in the same commit.
- Push to `cloud-lane-70`, cut from `Shane` `3271b4da`. Never push to `Shane` or `main`.
- Do not edit anything under `docs/memory/`.

## 6. Risks the desk has already found, named so you can check them

These are leads, not instructions. Report what you find; repair only what is in scope.

1. **`apps/web/e2e-phone/insights-label.test.ts`** measures the bracket label's `<tspan>`
   boxes against the figure's own SVG box at 390 px, with absolute tolerances of 0.5 px
   (`:50-53` in the current file). Every box in that comparison is inside the same scaled
   container, so the comparisons are between like and like; but 0.5 px of screen slack is
   about 0.24 px of page space once the page is scaled to a phone. If that test fails after
   step 1, report the measured numbers and say so. Do not loosen a tolerance without saying
   what it was and what you made it.
   The test selects the on-screen copy by `getBoundingClientRect().left > -1000`, which still
   separates it from the measurer at `left: -20000px`.
2. **`apps/web/e2e-phone/insights-links.test.ts`** picks the on-screen copy of a link by
   `b.x >= 0 && b.x < 390` (`:29`). That still holds under the fit. Its station assertions
   read the drawer, not the pane.
3. **Two phone checks are known to flake** at `voice-stations.test.ts:62` and
   `insights-links.test.ts:32` (2 of 3 runs at `737228cb`, before lane 68; cause NOT
   ESTABLISHED, `docs/memory/STATE.md`). If either fails, run it alone and report both
   results. Do not treat a known flake as this lane's fault, and do not treat this lane's
   fault as a known flake.
4. The phone footer today reads page 1 of 1 (`InsightsPane.svelte:585`). After the repair the
   phone gets the real pagination footers. That is the intended change, not a defect.

## 7. What you could not establish

Finish your report with a section headed "NOT ESTABLISHED", listing every claim in this brief
you could not confirm against the tree, and every question your work raised that you did not
answer.

**NOT ESTABLISHED beats a complete invented answer.**

## 8. Done when

- A phone at 390 px shows INSIGHTS as the 816 px page scaled by `PageFit`, with the same page
  furniture TEXT and MELODY show.
- No `insights-flow`, `flow-head`, `flow-body`, or `flow-foot` remains anywhere in the
  repository.
- The eight gates stand at their baselines, with the ratchet for `InsightsPane.svelte`
  lowered.
- The pictures of step 3 exist, in both languages.
