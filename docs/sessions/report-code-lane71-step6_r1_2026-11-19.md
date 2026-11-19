# Report, lane 71, step 6: the two strings that reach the voice type without `generic` (brief 4.10)

2026-11-19. Branch `cloud-lane-71`, on `80bae09e` (step 5) plus this step. Paths are under `apps/web/src/lib/`.

## 1. What changed

**`i18n.ts`**
- `sheet.provenance`: its last clause, EN "scaled to the {borrowed} staff, for the second.", FR « ajusté à la portée de {borrowed}, pour la deuxième. ». Everything before it is the live text, byte for byte; I replaced only the clause in the existing line (so its three French colons keep the U+00A0 already there, checked by a script that listed the characters before each colon).
- `sheet.provenance.undeclared` (new key): the same line with the last clause EN "scaled to the middle of Ilya’s five staves, for the second.", FR « ajusté au milieu des cinq portées d’Ilya, pour la deuxième. ». **This is the one string the brief marks DESK DEFAULT (Dann's ratified Guide wording in a new arrangement); it is the only line he has not seen in this exact form.** Both apostrophes are U+2019.
- `capture.hint.placed.typed`: EN "Ilya has placed {v} from its {borrowed} values for now. Its placeholder moves as you record.", FR « Ilya a placé {v} d’après ses valeurs de {borrowed}, pour l’instant. Sa valeur par défaut évolue à mesure que vous captez vos voyelles. ».
- Comments above each, citing the ruling and the brief. The key index moves: total 1,346 to 1,347, `sheet.` 16 to 17.

**`voice/chart/screen-logic.ts`**
- `Hint` gains `staffOf?: string`. `hintsFor` now chooses `capture.hint.placed.typed` when `borrowedStaffLabel(h.voiceType, 'en') !== undefined` and `capture.hint.placed.untyped` otherwise, with `staffOf: h.voiceType` on the typed hint. **It branches on `borrowedStaffLabel` being `undefined`, never on `hasDeclaredType`** (brief 4.10); `hasDeclaredType` stays exported and is no longer read by this function. (`'en'` is only a definedness test: the function's `undefined` does not depend on the language.)
- `hintText` fills `{borrowed}` through `fillVoiceType(..., 'borrowed')` when a hint carries `staffOf`.
- `sheetProvenance(voiceType, language)` (new, exported): `undefined` from `borrowedStaffLabel` draws `sheet.provenance.undeclared`; otherwise `sheet.provenance` filled through `fillVoiceType(..., 'borrowed')`.

**`voice/chart/VowelSpaceSheet.svelte`**: `:163` draws `sheetProvenance(voiceType, language)`; one import line added (`:26`). `voiceType` there is the string id prop, passed by `SummarySheet.svelte:14` (not read further up).

## 2. Probe output, run once and not kept

A throwaway test, deleted. For `contralto`, `countertenor`, `bass-baritone`, `bass`, `not-sure`, `undefined`, and `'zzz'`, in both languages:

- sheet last clause: contralto "scaled to the mezzo-soprano staff"; countertenor "the mezzo and tenor staff"; bass-baritone and bass "the bass staff"; `not-sure`, none, and `'zzz'` "scaled to the middle of Ilya’s five staves". FR: « à la portée de mezzo-soprano », « de mezzo et ténor », « de basse » (twice), and « au milieu des cinq portées d’Ilya » for the last three.
- capture hint: "Ilya has placed [ɑ] from its mezzo-soprano values for now." (contralto), "its mezzo and tenor values" (countertenor), "its bass values" (bass-baritone and bass); "from typical voices" for `not-sure`, none, and `'zzz'`. FR « d’après ses valeurs de mezzo-soprano », « de mezzo et ténor », « de basse », and « d’après des voix typiques » for the last three.
- no probe output contained `{` or `}`.

A bass who chose octavist was not probed; the functions take the Tier 1 id alone, so Tier 2 cannot reach them. Step 7's test 9 pins it.

## 3. What it breaks, and gates

Whole suite: `6667 passed | 20 failed | 5 skipped (6692)`. The seventeen of Step 4, plus three: `voice/chart/ratified-strings.test.ts` (2: "pins all seventy-one", which pins the old text of the two strings, and "is every key under capture. and sheet., and no other", which counts keys, so the new key moves it) and `voice/chart/screen-logic.test.ts` (1: the typed-hint test, old text). Brief section 7 names all of them (`ratified-strings.test.ts:29` and `:70`, `screen-logic.test.ts:45`).

Gate 3: `svelte-check found 1 error and 12 warnings in 6 files`, the one error still `voice-pane.test.ts:15:43`. Gate 8: `ratchets: OK.`, none moved. Gates 1, 2, 5, 6, and 7 were not re-run.

## NOT ESTABLISHED

1. That `capture.hint.placed.typed` is true for a voice that has five stable core vowels. Brief 9.1 records that it stays false there for all eight types. Not repaired.
2. Whether the sheet's first clause is true for an undeclared voice (brief 9.2). Not read further.
3. What the sheet looks like with the longer last clause printed: its height on the printed page. Nothing rendered.
4. Where `VowelCapture.svelte` passes `voiceType` from, in every state (`:50`, `:66`, `:220` read; not the callers).
5. Whether `knip` or another tool flags `hasDeclaredType` (`screen-logic.ts:31`) as unused. `grep -rn hasDeclaredType apps/web/src` (non-test) now returns its declaration and two comments, so no non-test code calls it; `screen-logic.test.ts` still imports it. I left it in place, since the brief does not ask for its removal.
