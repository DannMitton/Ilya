# Report, lane 70, step 0: does the premise hold

2026-11-19. Branch `cloud-lane-70`, cut from `Shane` at `61536a9f` (the commit that holds the brief). Working tree clean at the time of reading. `3271b4da`, the commit the brief names, is an ancestor of `61536a9f` (`git merge-base --is-ancestor 3271b4da HEAD`, exit 0). Between the two, `git diff --stat 3271b4da HEAD` shows only the three brief and review files under `docs/sessions/`, so no source line moved.

Brief read: `docs/sessions/brief-code-lane70-insights-wysiwyg_r2_2026-11-19.md`, in full. r1 not read.

**Verdict: the premise holds. Every citation in section 2 says what the brief says it says. Nothing was changed. Step 1 proceeds.**

## 1. Citations, one by one

All line numbers are in the tree at `61536a9f`, read with `sed -n` and `grep -n`.

| Brief's claim | What I read | Holds |
| --- | --- | --- |
| `InsightsPane.svelte:577` opens `{#if isMobile}` | `:577` is `{#if isMobile}` | yes |
| `.insights-flow` with `.flow-head`, `.flow-body`, `.flow-foot` at `:579` to `:586` | `:579` `<div class="insights-flow">`, `:580` flow-head, `:581` flow-body, `:584` flow-foot, `:586` closing div | yes |
| footer fixed at page 1 of 1 (`:585`) | `:585` `<PageFooter pageNumber={1} totalPages={1} ...>` | yes |
| `:589` is `<PageFit fit={false} pageWidth={dims.width}>` | `:589` is exactly that; `:587` is `</div>`, `:588` is `{:else}` | yes |
| `:488` `let flowWidth = $state(358);` | `:488` is exactly that | yes |
| `:490` `const flowSegments = $derived.by(...)` | `:490` is that; the introducing comment is `:489`; the block ends at `:498` | yes |
| style rules `.insights-flow` (`:692`), `.flow-head` (`:702`, `:706`, `:714`), `.flow-body` (`:718`, `:724`), `.flow-foot` (`:728`) | all seven selectors at exactly those lines; the heading comment `/* ── The phone: one column, the same blocks ── */` is `:691` | yes |
| `isMobile` at `:113` (prop type) and `:146` (default `false`), read at `:577` alone | `grep -n isMobile` returns three lines only: `:113`, `:146`, `:577` | yes |
| `:19` says "On the phone the same blocks run in one column (the phone board)" | `:19` is that sentence, the last line of the header comment paragraph | yes |
| `Paper.svelte:154` `<PageFit fit={isMobile} pageWidth={PAGE_SIZES[pageSize].width}>` | exactly that | yes |
| `MarkupPane.svelte:959` `<PageFit fit={isMobile} pageWidth={dims.width}>` | exactly that | yes |
| `+page.svelte` passes `{isMobile}` to `Paper` (`:4302`), `InsightsPane` (`:4352`), `MarkupPane` (`:4384` tag, `:4385` prop) | `:4302` is the `<Paper ... {isMobile} ...>` line; `:4352` is `{isMobile}`; `:4384` is `<MarkupPane`; `:4385` is `{isMobile}` | yes |
| `isMobile` is `!isDeskLayout(window.innerWidth)` at `+page.svelte:3633` | `:3633` is `isMobile = !isDeskLayout(window.innerWidth);` | yes |
| `isDeskLayout` true at 1400 and above (`layout.ts:62`), pinned at `layout.test.ts:53-54` | `layout.ts:62` declares `isDeskLayout`; `layout.test.ts:53-54` expects true at 1400 and false at 1399 | yes |
| `PageFit.svelte:6-15` "one implementation for both documents" | `:6-15` is that header comment ("ONE implementation, two documents") | yes |
| clamp at 1 (`:45-51`) | the NEVER ABOVE 1 comment is `:45-50`; `:51` is `const scale = $derived(fitting ? Math.min(1, fitWidth / pageWidth) : 1);` | yes |
| print undoes the fit (`:107-128`) | the PRINT EMITS THE PAGE comment and `@media print` block fall in `:107-128` (the `@media print` line itself is `:114`) | yes |
| desk's content width at 390 is 390 less two 24 px gutters (`app.css:142`, `+page.svelte:5432`) | `app.css:142` `--portrait-gutter: 24px;`; `+page.svelte:5432` `padding: 1rem var(--portrait-gutter, 24px);` | yes |
| scale about 0.419 (342 over 816) | 342 / 816 = 0.41912 (arithmetic from the two lines above and `PageFit.svelte:51`; not measured in a browser at this step) | arithmetic yes; live value is step 3 |
| measurer at `:566-574`, `aria-hidden` and `inert` at `:567` | `:566` comment, `:567` `<div class="measurer" aria-hidden="true" inert>`, `:574` closing div | yes |
| `.measurer` at `left: -20000px`, `:674-680` | `:674` `.measurer {`, `:676` `left: -20000px;` | yes |
| `pages` derived from measured heights, not `flowWidth` | not read in full at this step (see NOT ESTABLISHED, item 1) | partly |
| `line-breaks.ts:27` and `:34` read client rectangles | `:27` `el.getBoundingClientRect().top`; `:34` `range.getClientRects()` | yes |
| `insights-key-lines.test.ts:42`, `:43`, `:69` | `:42` the comment, `:43` `rootOf`, `:69` the screenshot line, all as quoted | yes |
| controls and declarations in `SingerBlock.svelte` (`:370-373`, `:556-613`; controls at `:63`, `:69`, `:95`, `:180-181`, `:186`) | `.tempo-link` `:370`; `.try-key`, `.offer-link`, `.offer-decline` group `:556-558`; the rules run to `.reveal summary` before `:616`; controls: `:63` `.offer-link.input-link`, `:69` `.try-key`, `:95` `.offer-link` and `.offer-decline`, `:180-181` `.offer-link`, `:186` `.tempo-link`; `<summary>` at `:116` and `:121` | yes |
| ratchet `"apps/web/src/lib/insights/InsightsPane.svelte": 744` | `scripts/ratchets.json:18` is exactly that | yes |

## 2. What reads the old names

Command, run from the repo root:

```
grep -rnE "insights-flow|flow-head|flow-body|flow-foot|flowWidth|flowSegments" apps/ \
  --exclude-dir=node_modules --exclude-dir=.svelte-kit --exclude-dir=build \
  --exclude-dir=test-results --exclude-dir=playwright-report
```

Result: 19 matching lines, in two files.

- `apps/web/src/lib/insights/InsightsPane.svelte`: `:488`, `:490`, `:579` to `:582`, `:584`, `:692`, `:702`, `:706`, `:707`, `:714`, `:718`, `:724`, `:728`. All inside the branch and rules Step 1 deletes.
- `apps/web/e2e/insights-key-lines.test.ts`: `:43` and `:69`. Step 2 repairs these.

Nothing else. `apps/web/e2e-phone/` has 22 files (listed with `ls`) and none of them matches. This agrees with the desk and the review.

Session records that keep the names, found with `grep -rln ... docs --include=*.md`: the two lane 70 briefs and the review, `report-code-n182-suggesting-a-key_r2_2026-11-01.md`, `review-fable-brief-row134_r1_2026-10-25.md`, `brief-code-row134-printed-colours_r2_2026-10-25.md`. Not edited, per the brief.

## 3. Small facts the brief does not state

- `scripts/ratchets.mjs:63` counts lines as `text.split('\n').length - (text.endsWith('\n') ? 1 : 0)`. By that rule `InsightsPane.svelte` is 742 lines today (`wc -l` also 742), against a ceiling of 744. The ceiling already carries 2 lines of slack. Step 1 will lower it to the new count, not to the old 742.
- `node_modules` was absent in this checkout. `pnpm install --frozen-lockfile` was started in the background for later steps. No source file was touched by this step.

## 4. Gates

No code changed in step 0, so no gate is rerun for it. The baselines stand as the brief gives them; step 4 reports each.

## NOT ESTABLISHED

1. That `pages` is derived from the measured heights and not from `flowWidth`. I read where `flowWidth` is declared and used (`:488`, `:581`, `:582`) and I read the measurer, but I have not read the `pages` derivation itself. Step 1 and step 3 will exercise it. Until then this brief claim stands as the desk's, not mine.
2. The live scale at 390 px. 0.419 is arithmetic from three cited lines. Step 3 measures it.
3. That nothing outside `apps/` and `docs/` reads the old class names (for example under `packages/`). The brief's "done when" is scoped to `apps/`, and I searched that scope only.
4. Whether any of the 12 gate 3 warnings sits in the rules Step 1 deletes. Step 1 and step 4 settle this by running the check before and after.
