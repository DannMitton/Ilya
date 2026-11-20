# Report, lane 74, step 3: item 4, the concession at the moment of choice

Brief section 2. Paths without a directory are under `apps/web/src/lib/`. Every line cited was read in this session before it was edited.

## What the tree held (read before the change)

- `TIER1` is `voice/voiceTypes.ts:19-29`, nine ids.
- `voice/VoiceTypeIntake.svelte` renders its radio group with `{#each TIER1 as id (id)}` inside `<fieldset class="vt-question">`, and the clear button (`{#if tier1}`) follows the `{/each}`. This is the shape the brief describes. Selecting calls `onchange(withTier1(choice(), id))`.
- `voice/VoiceTypeFirst.svelte` renders `.vt-choices`, a two-column grid (`grid-auto-flow: column`), inside `<fieldset class="vt-first">`. Selecting calls `onchange(id)`.
- `voice/voiceTypes.ts` held `isBorrowingType`, `borrowedStaffLabel`, `voiceTypePrint`, and `fillVoiceType`, so the function belongs there. `scripts/ratchets.mjs:81` is the brief's authority for why not `analysis/`; the lane's gate 8 (step 7) is the check, because I did not re-read that line.

## What changed

1. **`i18n.ts`, new key `voiceType.borrowing`**, beside `voiceType.heading` and `voiceType.hint` (the brief's DESK DEFAULT on the key name). Both strings are the ratified ones, character for character. The English is "The field has not yet published resonance values for a {type}. Ilya can start from the {borrowed} staff, or you can record your vowels in vocal fry and Ilya works from your own voice." The French begins « La recherche n’a pas encore publié de valeurs de résonance pour un {type}. Ilya peut partir de la portée de {borrowed}, ou vous pouvez capter vos voyelles en friture vocale et Ilya travaille à partir de votre propre voix. » The apostrophe is written `’`, the same way `placeholder.borrowing` (`i18n.ts`, `La recherche n’a pas...`) writes it, which is U+2019 and not U+0027. The comment above the key carries the provenance the brief asks for (assembled from `placeholder.borrowing` and `calib.pane.notSure`; the join clause built on `sheet.provenance`; ratified 2026-11-19 18:36; key name a desk default).
2. **`voice/voiceTypes.ts`, new `voiceTypeBorrowingNote(voiceType, language): string | null`.** It returns `null` unless `isBorrowingType(voiceType)` (so `null` for the five published types, "Not sure", `undefined`, and an id this build does not know). Otherwise it fills `{type}` from `voiceTypePrint({ voiceType })` on the Tier 1 id alone and `{borrowed}` from `borrowedStaffLabel`, with `fillVoiceType` and the tokens `type` and `borrowed`. It does not call `borrowingLine`, and it takes no formants.
3. **`voice/VoiceTypeIntake.svelte`.** `const borrowingNote = $derived(voiceTypeBorrowingNote(tier1, language))`. The note sits directly after the `{/each}` and before the clear button, inside the same fieldset, in `<div class="vt-note" aria-live="polite">` holding `<p class="vt-hint">` when there is a note.
4. **`voice/VoiceTypeFirst.svelte`.** The same derivation on `value`. The note sits after the closing `</div>` of `.vt-choices`, so outside the grid, and inside the fieldset.

No control, no dismiss, no focus move, no new CSS. The note's style is the file's own `.vt-hint` recipe, which both files already define (the brief's DESK DEFAULT).

## How it announces

The live region (`aria-live="polite"`) is in the page before the note arrives, and the note is inserted into it when the singer selects one of the three types. A polite live region queues its announcement after the screen reader finishes the current speech, so the radio's own announcement is not interrupted. Focus stays on the radio. The language of the announcement is the language of the string, which is the page language (`language` prop).

**NOT ESTABLISHED: what a screen reader says.** No screen reader ran in this sandbox. Step 6 reads the accessibility tree through Playwright for both languages and says what it shows; that shows the region and its text, not the speech.

**One layout consequence, to be measured.** The empty live region stays in the page for the other six choices. In `VoiceTypeFirst.svelte` the fieldset is a flex column with `gap: 0.3rem`, so an empty `div` adds one gap. Step 6 reports it.

## Tests and renders

The pure function's tests, all nine Tier 1 ids and no selection in both languages, are step 5. The rendered note at 390 px in both pickers, in both languages, with pixel heights, pictures, and the Begin check, is step 6.

`pnpm --filter @ilya/web check` reports one error at this point: `stand-in-borrowing.test.ts` imports `placeholderFillLabel`, which step 2 retired. It is in the brief's section 6 and step 5 repairs it. `svelte-check`'s warning count stays at 12.

## Added at step 7: the key index

The new key made two tests in `src/lib/i18n-index.test.ts` fail in the first full run of gate 4, because the hand-kept index at the head of `i18n.ts` counts keys by prefix and in total. Two lines of that index changed (`voiceType.` 45 to 46, "This file holds 1,347 keys." to "1,348"). Step 7 reports it.
