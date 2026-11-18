# Report: lane 67, Step 5 (one calm flag, on the take's own steadiness)

2026-11-18, Code (cloud session), branch `cloud-lane-67`. Paths under `apps/web/src/lib/` unless they begin with `docs/`.

## What was done

1. **`voice/outside.ts`**: `outsideVowels(profile, order)` is now the sung readings (`isSung`) whose `confidence === 'low'` and that are not kept (`plausibilityOverride !== true`), in the order given. Not `reading === 'provisional'` (the header says why: `docs/memory/OPEN.md:3800`, and `plausibility.ts` `keepReading` already treats `confidence` as the truth). `outsideNote()` takes no argument and returns `calib.summary.unstable`. `voice/OutsideNote.svelte` lost its `voiceType` prop and the `{type}` fill; the wizard's call lost `{voiceType}`.
2. **The "Beyond Ilya's reference values" mark is retired**: the `beyond` field of `RowMarks` and its value (`voice/chart/readings.ts`), the span in `voice/chart/VowelSpaceSheet.svelte`, and the pins (`voice/outside.test.ts`, `voice/chart/VowelSpaceSheet.test.ts`, `voice/chart/readings.test.ts`, `analysis/every-sung-reading-counts.test.ts`).
3. **`keepReading` (`voice/engine/plausibility.ts`) is unchanged in behaviour**: it marks the reading kept and quiets the note. Re-take works as before.
4. **`judgeUnchecked` removed at every site**, because nothing singer-facing reads the verdict after this step: the definition and its call (`voice/engine/resolve-values.ts`), the re-export (`analysis/analyze-score-adapter.ts`), the wizard's import and call (`voice/CalibrationWizard.svelte`). With it went `ResolvedValues.formants` (the judged copy): I found no reader of that field in `lib` or `routes` (grep for `.formants` over non-test files finds only store and wizard fields of other objects). The wizard **keeps storing the verdict** (`withPlausibility` is untouched), and `plausibility.ts`'s guard and `computeZones` still read bands; nothing reads the stored verdict any more except tests that set it.
5. **Strings**: `calib.summary.unstable` added exactly as brief section 6 writes it (French with U+00A0 before the colon). The three retired keys (`calib.summary.outside`, `calib.summary.outsideNoType`, `calib.roster.kept`) are kept and marked in place with a dated UNUSED comment, the file's habit (`i18n.ts`). The index line `i18n.ts:19` and the `calib.` count move 1,328 to 1,329 and 120 to 121 (the index test passes).

## Tests

New in `voice/outside.test.ts`: the note lists exactly the unstable readings not kept in roster order; it is about `confidence` (a Provisional reading with good evidence, and a steady 1063 Hz [i], are not named; an estimate and a take with `f1` 0 are not named); Keep and a fresh steady take clear it; one sentence for every type; the ratified string in both languages. `analysis/every-sung-reading-counts.test.ts`: the note names an unstable reading and Keep changes no number; a steady reading beyond the reference values is not named and counts as its kept twin; the wizard passes the stored profile with no verdict; the retired mark leaves the row marks as `provisional` and `noiseFloorUnmeasured` alone. Changed: `analysis/analyze-score-adapter.test.ts` (two `judgeUnchecked` assertions removed with the function).

`vitest run` over `src/lib/analysis`, `voice`, `components/Drawer`, `i18n`: 75 files, 1173 passed, 4 skipped. `svelte-check`: 0 errors, 12 warnings. Ratchets: OK; `CalibrationWizard.svelte` is now 1121 (the import line is gone), `InsightsPane.svelte` 742.

## Comments corrected

`voice/outside.ts` (header, whole), `voice/OutsideNote.svelte` (header), `voice/engine/plausibility.ts` (`keepReading`'s comment: no longer marks the reading "Beyond Ilya's reference values"), `voice/engine/types.ts` (`plausibilityOverride`: now means "kept"), `voice/engine/resolve-values.ts` (header: judging removed; the verdict comment; `formants` comment), `analysis/analyze-score-adapter.ts` (the note about `judgeUnchecked` removed), `analysis/analyze-score-adapter.test.ts` and `analysis/every-sung-reading-counts.test.ts` (titles and comments that said the adapter judges).

## What could not be established

- Whether a stored reading with `confidence` unset exists on any device: `outsideVowels` then names nothing (`undefined !== 'low'`). `analyze.ts` always writes it for a fresh take; older stored data NOT ESTABLISHED.
- The Playwright suites that seed a summary note are run at Step 8.
