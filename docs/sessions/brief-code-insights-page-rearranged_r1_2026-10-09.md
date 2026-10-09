# Brief for Code: the Insights page, rearranged (r1, 2026-10-09)

Written by the desk (Opus) 2026-10-09 about 02:05. **For the cloud lane**, Sonnet, after `brief-code-walk-findings_r1_2026-10-09.md`. Ruled by Dann 2026-10-09 01:38 to 01:47 (`docs/memory/OPEN.md`, "THE INSIGHTS PAGE, REARRANGED").

## What the singer sees

Opening Insights, the singer finds the piece's compass in a small stave in the top-right corner, in the same place on every Insights page. Under the phonation sentence, the histogram runs across the page over a quiet grey stave with its clef, so each bar's height on the stave says its pitch; each bar carries one label, and nothing crowds. The histogram leads straight into "Ilya reads your compatibility…", the table follows, and one closing verdict sums it up under "Your compatibility, in short". Cycle dose comes last, before the method line.

## 1. What was observed

Dann's walk, *Without Sun*, no. 1, English, 2026-10-09 01:38: the compass stave at the top left is *"toooooo large"*; the histogram's labels are a *"visual traffic jam"*. In his screenshot the letter names (D4, C4, B3, A3, G3, F3, E3, D3) run down the left while the sharps and flats (C♯4, B♭3, A♭3, F♯3, C♯3) sit beside the bars, and the two columns collide where two semitones share a staff position.

## 2. What is established (read by the desk 2026-10-09)

- The figure is `apps/web/src/lib/insights/Tessituragram.svelte`; its positions are decided in `tessituragram-layout.ts` (`Tessituragram.svelte:17-20`). Today one stave carries the clef, the compass's two notes, a barline, and the bars (`Tessituragram.svelte:8-11`), after Design's drawing for QUEUE row 42 (`:2-6`). **This brief departs from that drawing on Dann's ruling of 2026-10-09.**
- Each sounding pitch has a row; a sharp or flat sits half a stave step from its letter (`Tessituragram.svelte:13-15`). The clef glyph comes from `figure.clef` (`:92`, `:153-154`).
- Cycle dose is drawn inside the figure from `insights.figure.cycleDose` (`Tessituragram.svelte:109`; `apps/web/src/lib/i18n.ts:1712`).
- The page's order is in `apps/web/src/lib/insights/InsightsPane.svelte`: phonation (`:532-552`, the figure at `:542`), the fit table under `insights.fit.heading` (`:633`), and the findings under `insights.findings.heading` (`:725-730`). The verdict sentences are the `insights.verdict.*` keys (`i18n.ts:1626-1627`, and their siblings). Page one is filled by measuring what it renders (`InsightsPane.svelte:258-270`).

## 3. Measure before you change anything

Screenshots, English and French, of page 1 of Insights for every fixture song with a score, at desk width, before any change, in `docs/sessions/insights-rearranged-shots/before/`. Count each page-one label that touches another label, a line, or a bar (the layout's own test may already count it; say which).

## 4. The rulings (Dann, 2026-10-09; desk defaults marked)

1. **The compass stave** at a normal notation size, top right of page 1, on every Insights page that has a compass: clef and the two compass notes, with "Compass {low} to {high}" under it as today.
2. **The histogram's background:** grey stave lines and a proportionate grey clef, no notes. The clef follows the voice's clef (`figure.clef`). The freed width goes to the histogram.
3. **Labels:** the left column of letter names goes; each bar keeps one label, its own pitch, beside the bar. Line names for the *passaggi* and the centre stay.
4. **Order:** phonation sentence, histogram, compatibility table, the closing verdict, the findings list where there is one, then cycle dose, then the method line. **DESK DEFAULT:** cycle dose is a sentence of its own, drawn out of the figure into the page.
5. **The closing verdict** joins the verdict sentence and the findings sentence under one heading, ratified both languages 01:47:

| Key (new, your naming) | English | French |
|---|---|---|
| the verdict heading | Your compatibility, in short | Votre compatibilité, en bref |

Where findings exist, they keep their list under `insights.findings.heading`; only the "nothing flagged" sentence joins the verdict. **DESK DEFAULT.**

## 5. Constraints

- No other string changes. No French but the row in section 4.
- The page stays WYSIWYG and prints as it shows. Page one stays one page (`InsightsPane.svelte:260-261`).
- Nothing in `apps/web/src/lib/omr/` or `tools/e16-harness/`.
- Commit and push to `cloud-lane` only. **What this displaces:** nothing.

## 6. Done when

- Screenshots after, the same songs and languages, in `docs/sessions/insights-rearranged-shots/after/`.
- No page-one label touches another label, a line, or a bar, on any of them (a test in the layout).
- The compass stave sits at the same place on every page 1.
- All eight gates, against the baselines the batch's earlier rows leave, named.

`WRITTEN` on the code. `DONE` is Dann's look.

## 7. Report back

`docs/sessions/report-code-insights-page-rearranged_r1_2026-10-09.md`: section 3's counts first; then each change with its `path:line`, the tests, the gates, the screenshots, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Push, and stop.
