# Report, lane 69, Step 0: the baseline and the read

Branch `cloud-lane-69`, cut from `Shane` at `00d0417d` (local `Shane` was at `ab67b836`, behind; fetched, then cut). Clean tree, Linux cloud sandbox, `pnpm install --frozen-lockfile`. Python numpy and scipy are not installed here, so gate 4 reads the "without Python" figure.

## 1. The eight gates on the untouched tip

| Gate | Measured here | Mac baseline | Match |
|---|---|---|---|
| phonology | 462 passed (462) | 462 passed (462) | yes |
| dictionary | 248 passed (248) | 248 passed (248) | yes |
| web-check | 0 errors, 12 warnings, 5 files with problems (1241 files) | found 0 errors and 12 warnings in 5 files | yes |
| web-test | 6682 passed, 5 skipped (6687) | 6682 passed, 5 skipped (6687) without Python | yes |
| score-parser | 904 passed, 5 skipped (909) | 904 passed, 5 skipped (909) | yes |
| blurb | 178 passed (178) | 178 passed (178) | yes |
| integration | 159 passed (159) | 159 passed (159) | yes |
| ratchets | OK | OK | yes |

I ran the gates in the order phonology, dictionary, blurb, score-parser, integration, ratchets, web-check, web-test. The brief does not name which package is which of 178 and 904, so I matched them by count against the baseline: the count each package printed equals its baseline number.

## 2. Lines read at this tip

Every cited line matches the brief. No contradiction. Where a range differs from the brief's wording:

- `markup/MarkupPane.svelte:553-568`: the comment is `:554-567` (14 lines), the declaration is `:568`. As the brief says.
- `:444-446` is the three-line comment; `:450` is `hasReadings`.
- `:949` is one line, `statusLineFor(analysedVowels.length, language)`.
- `:1097-1113` opens `{#if hasReadings}`; two `.profile-status` paragraphs (`:1102`, `:1105`).
- `profile-status.ts:12-37` as cited; `:7-8` is "PURE: counts and a language in, strings out"; `:25-28` is the "DRAFT copy, flagged for Dann (§B.2)" comment.
- `sung.ts:14-15` `isSung`; `:26-30` `stableCore`; `:36-41` the threshold, `PERSONAL_CORE_MIN = 5`, `isPersonal`.
- `profileStore.ts:196-198` `usableReadingCount`.
- `resolve-values.ts:74-83` writes `'sung'` where `isSung` holds; `:153-156` `anySung`.
- `stand-ins.ts:151-156` writes `'surrogate'` where fR1 is undefined.
- `placeholder-line.ts:53-57` `belowCoreText`; `:73` the `isSung` and `isPersonal` test.
- `analyze-score-adapter.ts:117-129` passes `sampled` into `resolveVowelValues`.
- `voice-pane.ts:38`, `:57` as cited.
- `i18n.ts:1349-1356` the comment order Step 2 repairs; `:1443-1444` `calib.pane.belowCore` and `...One`; `:1498-1504` the profile keys.

## 3. Readers

- `analysedVowels`: `MarkupPane.svelte:446` (comment), `:568`, `:949`. Same as the desk's greps.
- `statusLineFor`: `MarkupPane.svelte:77` (import), `:949`; `profile-status.test.ts:2`, `:8-11`, `:15`; `profile-status.ts:15` (a comment) and its definition at `:29`. The desk named the first three; the rest are the test's calls and one comment.
- `analysedCount` (the parameter Step 1 renames): `profile-status.ts:29`, `:31`, `:33`, `:36` only.
- No reader in `apps/web/e2e/` or `apps/web/e2e-phone/`.

## 4. Second report item of Step 1 (read now, nothing built)

`voice/profileStore.ts` `validVoice` checks only that `formants` is a non-null object, and `loadStore` filters no keys (`:225-300`). A key outside the ten vowels would therefore load from storage, for example hand-edited storage or a v1 migration. Whether any in-app path writes one: NOT ESTABLISHED. I read the loader only.
