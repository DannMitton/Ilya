# Brief to Code: the Markup legend explains the stems

From the desk, 2026-10-01 02:05. No git writes. Gates before and after. **French RATIFIED by Dann 2026-10-01 02:33 ("ratified!"), underline on the adjective alone.**

**The ask:** Dann, 2026-10-01 01:51: *"We need to include a legend on Markup with this information, this is a capture from my dissertation Appendix B."* The capture shows two rows, each with four notes (two eighth notes, a quarter, a half) drawn with their stems in the stated direction:

- stems up: = <u>close</u> timbre
- stems down: = <u>open</u> timbre

Source: Mitton 2020, Appendix B (the capture Dann sent; page not stated).

**What the page does today:** a note's stem direction is semantic when the note carries a timbre analysis: `const stemUp = a ? a.timbre === 'close' : y > staffMidY;` (`packages/score-parser/src/staff-renderer.ts:1584`). The Markup legend carries only the withheld-syllable item (`apps/web/src/lib/markup/legend.ts`, `buildMarkupLegend`; drawn by `PageFooter.svelte`). Nothing tells a singer what the stems mean.

**The work:**
1. Add a legend entry to `buildMarkupLegend` for the stems, present only when the page draws at least one note with a timbre analysis (the same condition as `a` at `staff-renderer.ts:1584`), so the legend never explains a mark that is not there (the rule `legend.ts` already follows).
2. Draw it as the dissertation does: per row, the four note values from the music font with forced stems (up in row 1, down in row 2), then the text. Use the renderer's own glyphs and colour so the legend and the stave cannot disagree (the pattern `WITHHELD_SIGLA` uses). Underline "close" and "open".
3. Strings, English as given; French RATIFIED by Dann 2026-10-01 02:33:
   - `markup.legend.stemsUp`: EN "stems up = close timbre" / FR « hampes vers le haut = timbre fermé »
   - `markup.legend.stemsDown`: EN "stems down = open timbre" / FR « hampes vers le bas = timbre ouvert »
   Adopted, not coined: « hampe » is the standard French engraving term for a stem; « fermé » and « ouvert » follow `vowel.name.e` and `vowel.name.ɛ` (`i18n.ts:1124`, `:1127`) and `insights.finding.timbreOpenToClose` (`:1550`).
4. Print: the legend prints with the page.

**Tests:** the entry is absent with no voice measured and present with one; both languages; the drawn stems point the stated way.

**Report:** `docs/sessions/report-code-markup-legend-stems_r1_2026-10-01.md`.

**Held by the desk, not part of this brief:** the legend also does not explain the lavender turning noteheads, the red crossing squircles, or the `#` (memo-n84-path-map §8).
