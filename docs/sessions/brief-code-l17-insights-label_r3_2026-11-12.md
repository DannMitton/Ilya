# Brief: INSIGHTS' comfortable-zone label at phone width in French (L17)

This brief is the desk's. Do not edit, rename, or replace it.

r3, 2026-11-12. FABLE-REVIEWED: SEND WITH AMENDMENTS, 5 amendments, appended below and binding. It rides in the closing polish lane (that brief's amendment 16).

r2, 2026-11-12, written by the desk (Opus). Small; it may ride in the closing polish lane (`cloud-lane-48`) as a last step.

**Changes from r1** (the Sonnet scout's packet `scout-packet-three-briefs_r1_2026-11-11.md`, item (d); every line below re-read by the desk on `Shane` at `7fb9cd30`, 2026-11-12):
- The element is named: the label is SVG text, which does not wrap, so step 2's "let the label wrap" could not be done as written. Step 2 now says how.
- Step 1 still measures, and now reports the overflow of the two SVG lines only.

## What the singer gets

On a phone, in French, INSIGHTS' pitch figure prints its label for the singer's comfortable working zone in full, not clipped.

## Ruling

Dann 2026-11-09 23:09 (`docs/memory/OPEN.md`, ledger batch 3): L17 joins the share; measure first, then a small fix. DESK DEFAULT: Code takes the measurement in step 1, since the desk's workspace would need the same build and seeded voice; the desk reads the captures before step 2 runs. The ledger's entry (`docs/sessions/ledger-open-work_r1_2026-11-09.md:82`) says the label clips at 390 px in French and was not re-measured.

## Steps

**Before each step, read the Amendments section at the end of this brief for that step.**

1. **Measure.** Build the app; seed a calibrated test voice with a typed tessitura (the `voiced.test.ts` set-up in `docs/sessions/n174-c2/`); open one song's INSIGHTS in French at 390 × 844. Capture the pitch figure. Report by how many pixels each of the bracket's two lines runs past the figure's right edge, and whether the page clips it. Repeat in English and at 1,440 px as controls. If nothing clips, report that and stop.

   Where the label is, read by the desk: `insights.r2.yourTessitura` (`i18n.ts:2067`, FR « votre zone de travail confortable, telle que vous l’avez indiquée ») is drawn twice. In the figure it is SVG text, `<text class="bracket-name">` at `insights/PitchSeconds.svelte:125`, with the typed range under it at `:126`; both start at `BRACKET_X + 6`, where `BRACKET_X = X0 + BAR_W + 98` (`:44`) and `BAR_W` leaves 120 px right of the bars (`:43`). The svg is `overflow: visible` (`:140`). In the legend under the figure it is an HTML `<li>` (`:133`), which wraps. `insights.r2.cycles.within` (`:2027`) is filled into a sentence at `singer-blocks.ts:292`, not into the figure; check it only if step 1 finds it clipped.
2. **Fix, only if step 1 finds a clip.** SVG text does not wrap, so break the bracket's label into `<tspan>` lines at word boundaries, each no wider than the room right of the bracket (`width - BRACKET_X - 6`), measured from the rendered text (for example `getComputedTextLength`), not from a character count. Centre the stack of lines on the bracket's middle as the two lines are today (`bracket.mid - 2`, `bracket.mid + 10`), and widen the chart's vertical extent (`extent`, `:99-104`) by the added lines, so nothing is cut at the top or bottom. The typed range (`:126`) stays one line under the label. Do not shorten the ratified French text. DESK DEFAULT: wrap in place rather than drop the in-figure label, because the bracket without a name reads as a second band. Capture again at 390 px in both languages and at 1,440 px.
3. Gates and the screenshot pair in the report.

## What the desk could not establish

Whether anything clips at 390 px today: the ledger's entry was not re-measured, and the desk has not rendered the figure. The measure in step 1 decides.

## Amendments from Fable's review, part of this brief

Source: `review-fable-three-briefs-r2_r1_2026-11-12.md` (Fable, 2026-11-12; 5 amendments), filed beside this brief. Applied by the desk as written, DESK DEFAULT on each, except where marked. **Where an amendment and a step's text disagree, the amendment wins.** Numbers are Fable's. Each names the step it changes.

1. **Step 2: measure in the real font.** The page's fonts load with `display=swap` (`app.html:49`), and brief 1's step 6 keeps that. A width taken before the font arrives is the fallback font's. Add: "Measure after `document.fonts.ready`, and again if the fonts load later, so the lines are cut for Source Sans 3, not for the fallback."
2. **Step 2: the figure's height feeds the page breaks.** INSIGHTS measures every block at its printed width and places it by that height (`insights/paginate.ts:5`, `:66`). A figure that grows after it was measured prints over what follows. Add: "The pane measures the figure after the wrap has settled. Done when, in French and English at 390 px and at letter width, no page's content reaches its footer and the pages Chromium prints equal the sheets on screen (the checks of `e2e/pages-without-gaps.test.ts`), with a typed tessitura of two semitones (the tallest stack beside the shortest bracket)."
3. **Riding in lane 48.** Step 1 ends with a stop for the desk's read, which would hold lane 48's close. Replace "it may ride … as a last step" with: "In lane 48, step 1 (measure) runs with step 0's readings and is reported there; step 2 (fix) runs after step 11 and before step 12, only if the desk has answered. If the desk has not answered by then, lane 48 closes without it and L17 takes its own lane."
4. **A done state a test can hold.** Add to step 2: "A Playwright test asserts, at 390 × 844 in French and English, that the right edge of every line of the bracket's label is at or left of the svg's right edge, and that the label's words, joined, equal `insights.r2.yourTessitura`."
5. **Print.** Add to step 3: "Print INSIGHTS to PDF in French at letter size and report whether the label is whole there."
