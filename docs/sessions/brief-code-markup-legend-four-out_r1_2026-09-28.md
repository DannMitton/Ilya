# Brief for Code: remove the four voice-state entries from Markup's footer legend

Written by the desk 2026-09-28 22:20, at `de31e22`.

## The ruling

Dann, 2026-09-28 22:17, of the footer lines "Captured: you sang it, and it read
cleanly. Provisional: you sang it, but it read with less certainty. You can re-take
it.": *"They don't have a symbol to tie them to anything. Justify them if possible, if
not, let's get rid of them."* The desk found no justification ("Captured" appears
nowhere on the page, whose prose says "measured", `i18n.ts:1184-1185`; "Provisional"
is already explained by the status sentence, `i18n.ts:1186-1187`; all four were
PLACEHOLDER copy never ruled, `legend.ts:60`). Dann, 22:18: *"Remove the four."*

## The work

1. `apps/web/src/lib/markup/legend.ts`: remove the four voice-state entries
   (`markup-captured`, `markup-provisional`, `markup-estimated`,
   `markup-unmeasured`), their copy, `MARKUP_LEGEND_ORDER`, `MarkupLegendType`, and
   `markupLegendTypes`. **Keep the withheld-syllable entry and its sigla**
   (`MARKUP_WITHHELD_TYPE`, Dann's ruling of 8 August). `buildMarkupLegend` keeps
   only that entry; if its `formants` argument is then unused, drop it and update the
   one caller (`MarkupPane.svelte:697` at `de31e22`).
2. Rewrite the module header to say what the legend now is: one entry, for the one
   mark on the page that needs a key. Record the removal and Dann's words.
3. `legend.test.ts`: remove the tests of the four; keep and pass the withheld tests.
4. **Leave the data alone.** `CalibratedFormant.reading` and `noiseFloor` stay; other
   code reads them.

## Gates

All eight at baseline or better; report the new gate 4 count. `check` 0 errors;
ratchets OK; no file grows past its ceiling. A screenshot of a Markup page footer in
both languages, with and without a withheld syllable.

## The report

`docs/sessions/report-code-markup-legend-four-out_r1_<date>.md`: what changed with
`path:line`, the gates, the screenshots, and **What I could not establish**. NOT
ESTABLISHED beats a complete invented answer. Do not commit, stage, stash, check out,
or restore. Dann ships.
