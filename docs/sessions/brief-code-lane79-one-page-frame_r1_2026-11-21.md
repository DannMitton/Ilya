# Lane 79, QUEUE row 201: one window for TEXT, MELODY, and INSIGHTS

r1, 2026-11-21, written by the Opus desk. Every line of code cited here was read in the tree at `42df5011` on 2026-11-21 between 21:40 and 21:55.

## 0. What this is for

A singer moves between TEXT, MELODY, and INSIGHTS by tapping three words at the top of the same sheet. The sheet is meant to sit still underneath her: the same page, three documents on it. Today it does not. The message Ilya shows on an empty page sits at a different height and a different left edge on each of the three, so the page appears to shift under her hand as she moves between them.

Dann has asked for this three times: 2026-11-19 (the ruling that created the squircle), 2026-11-20 15:41 on his iPhone (*"I'm botherd that the page layout between TEXT, MELODY, and INSIGHTS is dissimilar. / I askled yesterday to establish consistency."*), and 2026-11-21 21:43 (*"Please find one design template for all three surfaces and make them consistent"*, transcribed as written). Lane 78 built one component for the three blank states and did not unify the window it draws in, because the lane 78 brief's step 1 told it not to force a common midpoint. That instruction was the desk's and it is struck.

## 1. What is true today

One component draws all three squircles: `apps/web/src/lib/components/Paper/BlankState.svelte`. Its radius, border, padding, gap, and type are therefore already identical. What differs is the window each page hands it, at three call sites:

| | call site | top | bottom | left |
|---|---|---|---|---|
| TEXT | `components/Paper/TitlePage.svelte:133-143` | `Paper.svelte:90`: `MARGINS.vertical + header + HEADER_GAP` | `Paper.svelte:89`: `MARGINS.vertical + max(FOOTER_MAX_HEIGHT, measured) + GAP` | `TEXT_CONTENT.left + padLeft` = 92 |
| MELODY | `markup/MarkupPane.svelte:1073-1082` | `MarkupPane.svelte:471`: `MARGINS.vertical + header + TITLE_HEADER_GAP`, a local 18 at `:469` | `MarkupPane.svelte:491-493`: `MARGINS.vertical + max(FOOTER_MAX_HEIGHT, footerHeight) + GAP` | not passed, so 96 (`BlankState.svelte:46`) |
| INSIGHTS | `insights/InsightsPane.svelte:576` | `InsightsPane.svelte:286`: `MARGINS.vertical + header + HEADER_GAP` | `MARGINS.vertical + footHeight + HEADER_GAP` | not passed, so 96 |

Constants, all from `apps/web/src/lib/page-config.ts`: `MARGINS` 48 and 96 at `:21`, `GAP` 8 at `:24`, `HEADER_GAP` 16 at `:41`, `FOOTER_MAX_HEIGHT` 80 at `:84`, `TEXT_CONTENT { left: 88, right: 96, padLeft: 4 }` at `:108`.

Two of these are already recorded as retired. `page-config.ts:26-40` states the rule in Dann's own requirement, that the negative space under the header rule be identical on every page, and says in terms that `HEADER_GAP` "replaces TitlePage's local TITLE_HEADER_GAP of 18". `MarkupPane.svelte:469` still carries that 18, and the comment at `:467` says it is TitlePage's gap, which is no longer true.

**Measured.** Lane 78 measured the live render (`report-code-lane78_r1_2026-11-21/measurements.json`): squircle midpoints TEXT 545, MELODY 546, INSIGHTS 548, against a window midpoint of 548 on all three, where the window is the title rule's lower edge to the footer hairline's upper edge. The desk measured the lane's own phone captures independently on 2026-11-21 21:45 and agrees: squircle tops and bottoms at 665/727 (TEXT), 661/733 (MELODY), 663/735 (INSIGHTS) in image pixels, with the title rule at 368 and the footer hairline at 1029 on all three, and squircle left edges at 136 (TEXT) against 139 (MELODY and INSIGHTS). So INSIGHTS' arithmetic is the only one that lands on the centre the two drawn rules define.

## 2. What to build

**Step 0, measure before changing anything.** Record, for TEXT, MELODY, and INSIGHTS at 390 and at 1024 wide, with a score loaded and with none: the measured header height, the measured footer height, the resulting content top and bottom, and the first and last page's line counts for a score that paginates (use the project's existing fixture). This is the control for step 3. Report it as a table.

**Step 1, one frame, one place.** Add to `page-config.ts` one exported function that returns the content window of a document page from the measured header and footer heights, with `HEADER_GAP` at both ends: top `MARGINS.vertical + header + HEADER_GAP`, bottom `MARGINS.vertical + footer + HEADER_GAP`, left and right `MARGINS.horizontal`. Document it in the style of the `HEADER_GAP` comment, naming this brief and Dann's three asks.

**Step 2, the three blank states take it.** `TitlePage.svelte`, `MarkupPane.svelte`, and `InsightsPane.svelte` pass that one frame to `BlankState`. TEXT stops passing `TEXT_CONTENT.left + padLeft` and `TEXT_CONTENT.right`: the verse column exists so sung lines hang correctly and has no business placing a system message. Remove the now-dead `left` and `right` defaults from `BlankState.svelte:46` only if no caller still needs them.

**Step 3, the retired 18.** Replace `MarkupPane.svelte:469`'s local `TITLE_HEADER_GAP = 18` with `HEADER_GAP`, and correct the comment at `:467`. **Condition, and this is the one place where you stop:** if step 0 shows that this moves any page break or changes any page's line count in a paginated score, do not make the change; report it with the numbers and leave `:469` as it is. A 2 px gap is not worth reflowing a singer's score without Dann's word.

**Step 4, pagination's reserve is not touched.** `FOOTER_MAX_HEIGHT` and the `max(FOOTER_MAX_HEIGHT, measured)` floor at `Paper.svelte:89` and `MarkupPane.svelte:491-493` stay exactly as they are for paginated content. The floor reserves room for the tallest footer and changing it reflows every score. The new frame is for the blank window. Where the two differ on a page with content, the reserve wins.

**Step 5, pin it.** One test renders the three blank pages at one width and asserts that the three squircles have the same midpoint, the same left edge, and the same width, to the pixel. `components/Paper/blank-states.test.ts:100-102` currently asserts that `const TITLE_HEADER_GAP = 18;` still exists and `:109` pins INSIGHTS' bottom expression as a string; both pins encode today's inconsistency and are replaced by the new test. Say in the report what each replaced pin was protecting and why the new one covers it.

## 3. Done when

- The three squircles measure one midpoint, one left edge, one width, at 390 and at 1024, in both languages, with a saved voice and without one.
- The new test fails if any one of the three call sites goes back to computing its own window.
- All eight gates at the baselines in `~/Downloads/ilya-ship.sh`, gate 4 at `6785 passed | 1 skipped (6786)` with scipy and `6781 passed | 5 skipped (6786)` without it.
- No ratchet ceiling raised.
- Twelve captures as lane 78 took them (TEXT, MELODY, INSIGHTS by phone and tablet, English and French), plus a `measurements.json` of the three windows and the three squircles.

## 4. The same number computed elsewhere

This changes how a page's content window is computed. Every other site that computes one: `Paper.svelte:89` and `:90` (TEXT, including subsequent pages), `MarkupPane.svelte:471`, `:491-493`, and `:511`, `InsightsPane.svelte:286`, `:288`, and `:576`, and the test helper `page-fit.test.ts:38`, which reproduces the whole sum. What depended on them agreeing: page breaks in paginated scores, which is why step 4 holds the reserve still, and `page-fit.test.ts:38`, which must be updated in the same pass or it will pass for the wrong reason. Say in the report which of these you touched.

## 5. Constraints

- Cloud lane, cut from `Shane` at `42df5011`, pushed to `cloud-lane-79`. No commit to `Shane`, no pull request, Dann merges.
- Nothing under `docs/memory/` is written by the lane.
- Strings: none. This lane adds, removes, and rewords no sentence in either language. If you believe a string must change, stop and report it instead.
- Lane 76 (`cloud-lane-76`, row 199) and lane 77 (row 200) are held and both touch MELODY's NOTES wording. This lane touches geometry only, so merge order does not matter; do not merge either branch into this one.

## 6. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Report every item you could not settle, with the instrument you used. Two the desk already knows of, and you are not asked to solve them: the squircle's edges sit about 12 px inside the title rule and the footer hairline on all three pages, which is a separate relationship Dann has not ruled on; and lane 78 left five Playwright failures that exist on its base (`report-code-lane78_r1_2026-11-21.md` section 9, items 1 and 2).

Report to `docs/sessions/report-code-lane79_r1_2026-11-21.md` on the lane.
