# Report: lane 65, Step 2 (the wizard's voice type line)

2026-11-17, Code (cloud session), branch `cloud-lane-65`.

## What changed

- `apps/web/src/lib/i18n.ts`: `calib.voiceTypeFirst.hint`, both values replaced with the brief's words, character for character, with U+2019 for every apostrophe ("doesn’t", "jusqu’à", "qu’Ilya"), curly quotes around “Not sure”, and U+00A0 after « and before ». The characters are written literally in the file, as `calib.roster.kept` at the line above writes its own. One comment line was added above it: re-ratified by Dann 2026-11-17 15:46 (en) and 15:47 (fr), after the block above (`:1335-1336`) was ratified 2026-09-30 verbatim, with the reason (`PRODUCT.md:1271`, the voice type is scaffolding only).
  - en: Ilya can use generic values with your guidance, until you record your own vowels. This doesn’t change what Ilya measures. “Not sure” is a valid answer.
  - fr: Ilya peut utiliser des valeurs par défaut selon vos indications, jusqu’à ce que vous captiez vos propres voyelles. Cela ne change pas ce qu’Ilya mesure. « Je ne sais pas » est une réponse valable.
- `apps/web/src/lib/voice/chart/ratified-strings.test.ts`: one new literal test, "pins the wizard’s voice type line", of both values (with `’`, `“`, `”`, and ` ` written as escapes so the characters are unmistakable). It sits beside the file's list, not in it, because the list's own test requires every key to be a `capture.` or `sheet.` key and its count to be 71. That list and count are untouched. The file's header comment still says it pins "the calibration screen's and the sheet's strings"; I did not edit it.

## Tests run (only the files this step touched, and the files that read the key)

`ratified-strings.test.ts`, `i18n.test.ts` (its typography checks: U+00A0 around « », semicolons, apostrophes), `i18n-index.test.ts`, and `voice/outside.test.ts` (which checks only that the key exists): 4 files, 25 tests, all pass. No test pinned the old line (the brief said so; I grepped `calib.voiceTypeFirst` in `src` and found only `VoiceTypeFirst.svelte` and `outside.test.ts`).

## Not done, by the brief

No picture of the wizard's first screen was asked for in this step, so none was taken. `CalibrationWizard.svelte` and `VoiceTypeFirst.svelte` are untouched.
