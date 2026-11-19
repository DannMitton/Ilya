# Report, lane 70, step 1: the repair

2026-11-19. Branch `cloud-lane-70`, on top of the step 0 commit. Brief: `docs/sessions/brief-code-lane70-insights-wysiwyg_r2_2026-11-19.md`, section 3, step 1.

## 1. What changed

Two files: `apps/web/src/lib/insights/InsightsPane.svelte` and `scripts/ratchets.json`. Command: `git diff --stat` before the ratchet edit showed `InsightsPane.svelte | 115 ++++---` (25 insertions, 90 deletions).

By the brief's numbered items:

1. The `{#if isMobile}` branch is deleted whole: the `.insights-flow` block, its three children, the `{:else}`, and the closing `{/if}`. The `PageFit` block now stands alone and unconditional (`InsightsPane.svelte:565` to `:589` after the edit; `</PageFit>` is `:589`).
2. `fit={false}` is now `fit={isMobile}`: `<PageFit fit={isMobile} pageWidth={dims.width}>` at `InsightsPane.svelte:566`.
3. `flowWidth` (was `:488`), `flowSegments` (was `:490` to `:498`), and the comment that introduced it (was `:489`) are deleted. The blank line that followed them went with them.
4. The style rules `.insights-flow`, `.flow-head` and its two `:global` rules, `.flow-body`, `.flow-body .squircle`, and `.flow-foot :global(.page-footer)` are deleted, with their heading comment `/* ── The phone: one column, the same blocks ── */` (was `:691` to `:730`). The `@media print` block that followed is untouched.
5. The last sentence of the header comment (was `:19`) now reads: "Under 1400 px the page is drawn once and `PageFit` scales it to the screen." No other comment in the file was changed. (Checked by reading the whole diff; the only `-`/`+` comment lines are that sentence, the deleted `flowSegments` comment, the deleted phone-board comment, and item 8.)
6. The measurer and the foot probe are where they were, outside `PageFit` (`<div class="measurer" aria-hidden="true" inert>` at `InsightsPane.svelte:555`, `.foot-probe` at `:559`, both before the `PageFit` comment at `:565`; the diff shows no hunk touching them).
7. `pages`, `segment`, `part`, `blockAt`, `header`, `.insights-container`, `.paper-page`, `.column`, `.squircle`, `.part`, and the `@media print` block are untouched (no hunk in the diff touches them).
8. One comment added above the `PageFit` call, `InsightsPane.svelte:565`: `<!-- INSIGHTS draws the page and `PageFit` scales it under 1400 px, as Text and the marked score do. Ruled by Dann, 2026-11-18 23:36. -->`
9. Ratchet. `scripts/ratchets.json:18` was `"apps/web/src/lib/insights/InsightsPane.svelte": 744`; it is now `677`.

**One choice the brief does not name.** I removed one tab of indentation from the `PageFit` block, because it left the `{#if}` and would otherwise sit one level too deep. This changes the whitespace of about 25 lines and nothing else on them. If the desk would rather keep the old indentation to shrink the diff, it is a pure-whitespace revert.

## 2. The ratchet, before and after

- The ceiling: 744 before, 677 after.
- The file's actual line count by the ratchet's own rule (`scripts/ratchets.mjs:63`, `split('\n').length` less one for a trailing newline): 742 before (the brief step 0 report read it), 677 after, a drop of 65 lines. Command: `node -e` using that exact expression.
- The ceiling had 2 lines of slack before. It has none now, by design: the brief says to lower it to the new line count.
- `node scripts/ratchets.mjs` prints `ratchets: OK.` and lists other files that could be lowered (for example `CalibrationWizard.svelte: 1126 -> 1124`, `+page.svelte: 5534 -> 5532`, `musicxml-parser.ts: 1167 -> 1166`). Those are not this lane's files and I did not touch them.

## 3. What I ran

| Command | Result |
| --- | --- |
| `pnpm --filter @ilya/web check` | `svelte-check found 0 errors and 12 warnings in 5 files`, the same line as before the edit. The twelve are in `InspectorPanel.svelte` (3), `IntakePanel.svelte` (5), `ReadingPaper.svelte` (1), `LearnContent.svelte` (2), and `+page.svelte` (1), listed with `--output machine`. None is in `InsightsPane.svelte`, before or after. This settles step 0's open item 4. |
| `pnpm exec vitest run src/lib/components/Paper/one-head-one-foot.test.ts src/lib/components/footer-credit.test.ts src/lib/insights` (in `apps/web`) | 24 files, 517 tests, all passed. These are the guards that read this file's source. |
| `node scripts/ratchets.mjs` | `ratchets: OK.` |
| `grep -rnE "insights-flow\|flow-head\|flow-body\|flow-foot\|flowWidth\|flowSegments" apps/` (excluding `node_modules`, `.svelte-kit`, `build`) | two lines left, both in `apps/web/e2e/insights-key-lines.test.ts` (`:43`, `:69`). Step 2 repairs them. None remains in `InsightsPane.svelte`. |

The full eight-gate run, including the whole of gate 4, is step 4.

## 4. Before-repair tap measurements, taken first

Step 3b asks for the taps "before the repair and after it". The "before" numbers had to be taken on the unrepaired tree, so I took them before editing, with a script kept outside the repository (it is not a test and is not committed). They are reported in the step 3b report, not here.

## 5. What was not touched

`PageFit.svelte`, `Paper.svelte`, `MarkupPane.svelte`, `+page.svelte`, anything under `docs/memory/`, every string in both languages, every control's size, padding, and hit area. No coarse-pointer rule, no zoom, no toggle.

## NOT ESTABLISHED

1. How INSIGHTS looks under the fit. Step 1 is a source change; no screenshot has been taken after it yet. Step 3 is where that is read.
2. Whether the 12 warnings would be the same on a tree where `PageFit` had run in a browser. `svelte-check` is static, so this is not in question for gate 3, but nothing in this step exercises the page.
3. Whether the Playwright suites still pass. Step 2 changes the one test that names the old root, and steps 3 and 4 run the suites.
4. Nothing further on `Segment`: it is still used at `InsightsPane.svelte:84` (import), `:459` (`pages`), `:532` (`segment`), and `:544` (`part`), read with `grep -n "Segment\b"`.
