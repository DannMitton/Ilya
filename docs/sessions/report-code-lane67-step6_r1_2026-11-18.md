# Report: lane 67, Step 6 (the VOICE pane below the threshold)

2026-11-18, Code (cloud session), branch `cloud-lane-67`. Paths under `apps/web/src/` unless they begin with `docs/`.

## What was done

- `lib/components/Drawer/voice-pane.ts`: `PaneSentenceInput` gains `core` (the core count). `paneState` gains two states, `'core-generic'` (the type has generic values: `isTier1` and `hasPlaceholderProfile`) and `'core'` (every other type, "Not sure", and none), for "anything sung and core count under 5" (`usable >= 1 && core < PERSONAL_CORE_MIN`), placed after `all` and before `some-fills` and `some-works-out`. A voice with only a hard vowel sung (`usable >= 1`, `core` 0) takes one of these two, so it no longer reads "Ilya fills the other 9". `paneSentence` prints the section 6 strings with {n} the core count, {m} = 5 minus {n}, and {voiceType} filled as `typedGeneric` fills it (`voiceTypePrint` and `fillVoiceType`); the "One" key is used when {m} is 1. With five or more core vowels the existing states apply unchanged. The door names (`recordDoorKey`) are unchanged.
- `lib/components/Drawer/VoicePane.svelte`: a `core` prop, passed to `paneSentence`.
- `routes/+page.svelte`: one prop (`core={coreCount(voiceFormants)}`) and one import line (`coreCount` from `$lib/voice/engine/sung`). The file is 5532 of 5534.
- `lib/i18n.ts`: `calib.pane.coreGeneric`, `calib.pane.coreGenericOne`, `calib.pane.core`, `calib.pane.coreOne`, as brief section 6 writes them (French apostrophes as `’`, as the neighbouring pane keys write them). The index line `i18n.ts:19` and the `calib.` count move to 1,333 and 125 (the index test passes).

## Tests

`lib/components/Drawer/voice-pane.test.ts` (10 new tests, 162 passed in `components/Drawer`): core counts 1 to 4 with a bass (the generic form, English and French, with the "One" forms at 4); core counts 1 to 4 for contralto, countertenor, bass-baritone, "Not sure", and no type (the short form); a hard vowel alone (`usable` 1, `core` 0) for a bass and for no type, and that "fills" and "other 9" never print; five and six core vowels give the existing states unchanged; nothing sung keeps `typed-generic` and `none`; no unfilled placeholder for five types at core counts 0, 1, and 4, and the French elision for mezzo-soprano; the door name is unchanged. The test's helper `S(usable, voiceType, restWorkedOut, core)` defaults `core` to 6 (or 0 with nothing sung), so the seven ratified states are tested as they were.
`svelte-check`: 0 errors, 12 warnings. Ratchets: OK.

## Comments corrected

`lib/components/Drawer/voice-pane.ts` header (the count the sentence prints is stated for the new states), `PaneSentenceInput`'s `usable` comment now sits beside `core`.

## What could not be established

- The picture of the pane at 3 and at 5 core vowels with a bass type is made at Step 8.
- Whether the pane's "Record N more" sentence is right for a voice whose stored readings include a take with `f1` 0: `coreCount` does not count it, so the sentence counts the singer's usable core vowels only.
