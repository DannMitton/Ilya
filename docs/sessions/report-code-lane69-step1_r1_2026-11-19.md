# Report, lane 69, Step 1: the status line says where the voice stands

## What changed

- `markup/profile-status.ts`: `statusLineFor({ sampledCount, personal, core }, language)`. When `personal` is false it returns `belowCoreText('calib.pane.belowCore', core, language)`. When true it returns today's words, unchanged. The zero branch and `profile.statusSetPlain` stay. Two imports added (`Vowel`, `belowCoreText`). Parameter renamed `analysedCount` to `sampledCount`.
- `markup/MarkupPane.svelte`: `analysedVowels` is now `sampledVowels`, counted with `isSung(formants[g])` (`:564`), where it was `adapted.snapshot.fR1[g] !== undefined`. `:945` is one line passing the state. Import at `:64` gains `isPersonal` and `stableCore`.
- `markup/profile-status.test.ts`: the existing cases moved to the new signature; all their strings are kept, the zero case included. Added the five cases the brief names and the wiring guard.
- `scripts/ratchets.json:16`: `MarkupPane.svelte` 1353 lowered to 1349, its new line count (the file's own rule, `scripts/ratchets.json:2`).
- No string added or changed in `i18n.ts`.

## Comments corrected, in the same commit

1. `MarkupPane.svelte:444-446`: now says the singer sampled the vowels the status line counts. Three lines.
2. `MarkupPane.svelte:554-561` (was `:554-567`, 14 lines, now 8): names section B.2 and `cfcd0ba6` as the ruling's records, `usableReadingCount` (`voice/profileStore.ts:196-198`) as the same count elsewhere, and `isSung` (`voice/engine/sung.ts:14-15`) as the one test. It says why the snapshot is not read. It does not contain the text `snapshot.fR1[`.
3. `profile-status.ts:25-28` (now `:27-33`): the count spans every reading the singer sampled (`isSung`), provisional and unstable ones included. The "DRAFT copy, flagged for Dann (§B.2)" marker is kept.
4. `profile-status.ts:7-8`: "PURE: the voice's state ... and a language in, strings out."

The comment at `profile-status.ts:12-17` is untouched, as the brief says.

## The two things to report

1. `profile.statusSetPlain` is unreachable from this pane before and after. After this step it is reached only when `personal` is true, which needs five stable core vowels, each of them sampled (`voice/engine/sung.ts:26-30`, `:41`). The key, its branch, and its pinned test stay.
2. Whether a stored voice can hold a key outside the ten vowels: see Step 0 report, section 4. The loader does not filter keys; whether the app writes one is NOT ESTABLISHED. With this step that path would print the below-five sentence, which is true. No guard built.

## Tests run (only the changed file)

- `profile-status.test.ts`: 9 passed (9). The wiring guard runs against the real pane text.
- `svelte-check`: 0 errors, 12 warnings, 5 files with problems (same as baseline).
- `node scripts/ratchets.mjs`: OK.
- Mistake caught on the way: my first rewrite of `profile-status.ts` dropped `provisionalPartsFor` and `listSep`; the test file failed on both; I restored them from `HEAD`, and the diff shows only the intended lines changed.

## Form of the count

Built as the brief says, `isSung(formants[g])`. My Step 0 read contradicted nothing in the brief's reasoning for it: `resolve-values.ts:78-82` writes `'sung'` for exactly the entries where `isSung` holds.
