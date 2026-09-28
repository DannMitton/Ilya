# Brief for Code: two changes to the Voice screens

**Desk brief r1, 2026-09-28.** Both DESK DEFAULT under Dann's findings of 2026-09-28 15:38 to 15:40.

## 1. Higher limits first in Voice characteristics

Dann, 15:40: *"reorder the Range, Tessitura, and Passaggio intakes to list the higher limits first, followed by the lower limits. The order they are in now seems counterintuitive."* Agreed by the desk: the form is a vertical picture of the voice.

- Range: Highest comfortable note, then Lowest comfortable note.
- Tessitura: Tessitura ceiling, then Tessitura floor.
- Passaggio: Secondary passaggio, then Primary passaggio.

Order of display only: stored fields, keys, and every sentence elsewhere that names a range low to high ("B♭1 to F♯4") are unchanged. Tab order follows the new visual order.

## 2. A reading outside Bozeman's band can be kept

**Observed:** Dann's [i] reads 247 Hz, Provisional, for a bass. The plausibility window floor for a bass [i] is 246.9 Hz (`apps/web/src/lib/voice/engine/plausibility.ts`, `CORE_BANDS.bass.i` D4 lowered by `FLOOR_MARGIN_SEMITONES` = 3). An `implausible` reading becomes Provisional (`CalibrationWizard.svelte`, `withPlausibility`) and Markup and Insights then skip it (`InsightsPane.svelte:202`, `analysis/analyze-score-adapter.ts:134`, `:155`).

**Measure first:** report whether Dann's stored [i] is `plausibility: 'implausible'` (his browser, `shane.profiles.v2`) or Provisional for low confidence, and its unrounded value.

**Build:** when a captured reading is judged implausible, the hold keeps its current sentence and offers two choices: **Try again** (as now) and **Keep my reading**. A kept reading is marked as the singer's own (a stored flag on that formant, for example `plausibilityOverride: true`), shows as Captured with a small note that it lies outside the usual band, and Markup and Insights use it. Re-taking clears the flag. The guard's console event records the choice. Bozeman labels his values approximate (`plausibility.ts` header), and a singer's measured voice outranks an approximate chart.

**French:** draft « Garder ma mesure » and the note's French from the calibration strings already in `i18n.ts`; the desk brings them to Dann before they ship.

## Constraints and done when

No change to `CORE_BANDS` or the margins. A stored flag is a record of the singer's decision, not a derived value (`CONTRACT.md` §6 allows it). Gates pass; a unit test covers override on and off. `DONE` is Dann's walk: re-take [i], keep the reading, and see it counted in Markup.
