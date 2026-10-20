# Report: row 133, the loupe and the tempo chips name dotted values in words

Branch `cloud-lane-12`, after row 129 (`c0afd48`). Brief: batch A r2, row 133. Strings copied from `docs/sessions/ratified-loupe-dot-words_2026-10-19.md`.

## The diff, by file

- `apps/web/src/lib/i18n.ts` (after `loupe.rest`, about `:511-554`): 35 keys, whole phrases. `loupe.value.<base>.1` and `.2` for notes (14), `loupe.restValue.<base>.0`, `.1`, `.2` for rests (21), bases `whole half quarter eighth 16th 32nd 64th`. English rest values are the fragment, "Rest · Dotted eighth" (U+00B7 between spaces). `loupe.rest`, `loupe.doubleDot`, `correct.dot` are untouched (`CorrectionSurface.svelte` still uses `loupe.rest` and the dot cell keeps "Dot" / « Point »). No other string added or changed.
- `apps/web/src/lib/score/value-name.ts` (new): `valueName(base, dots, isRest, language)` (null for a base the tables do not name, so `128th` and `breve` keep today's readout); `restFragmentParts` (splits "Rest · Dotted eighth" where the beat clause goes); `valueParts({...})`, the pieces both readouts are built from, with today's pieces as the fallback. Two or more dots read as double-dotted, as before.
- `apps/web/src/routes/+page.svelte` (5641 to 5618, ceiling lowered): `readoutLine` and `loupeNoteLine` call `valueParts`; the beat clause is passed in and lands after the rest's name (French « Demi-soupir pointé · temps 1, division 3 ») or after the rest word (English "Rest · beat 1, pulse 3 · Dotted eighth", the DESK DEFAULT). The comment about the "second name for Quarter · Dot" is rewritten to the new fact; the comment on rests leading with the word was shortened (its "MEASURED on the walk" history is gone from the file).
- `apps/web/src/lib/tempo/beat-glyph.ts`: `beatName` returns the phrase where the tables name the unit ("Dotted half", « Blanche pointée »); header comment (the "no dotted adjective exists" paragraph) rewritten.
- `apps/web/src/lib/tempo/tempo.test.ts`: the pinned `beatName('half', 1, 'en')` is now "Dotted half".
- `apps/web/src/lib/score/value-name.test.ts` (new, 19 tests): every cell of both tables in both languages, the readout pieces for a dotted note, a double-dotted note, and a dotted rest in both languages, the beat clause, the fallback bases, `beatName`.
- `scripts/ratchets.json`: `+page.svelte` 5641 to 5618.

## Gates

phonology 267, dictionary 248, blurb 145, integration 55, web-test 2884 (2884) (2865 plus 19), web-check 0 errors and 12 warnings, score-parser 763 passed and 5 skipped (768), ratchets OK.

## Pictures

`docs/sessions/batch-a-shots/row133-dotted-quarter-{en,fr}-{1440,390}.png` and `row133-dotted-eighth-rest-{en,fr}-{1440,390}.png`: the loupe in Corrections on the Tchaikovsky fixture, a note changed to a dotted quarter, then to a rest. Text read from the page at each step: EN "B4 · beat 1, pulse 3 · Dotted quarter"; FR « B4 · temps 1, division 3 · Noire pointée »; EN "Rest · beat 1, pulse 3 · Dotted eighth"; FR « Demi-soupir pointé · temps 1, division 3 ». The dock's readout line reads the same (« Demi-soupir pointé · го »).

## Shared numbers

Not a number change; the same words come from one function now. The two readouts and `beatName` all go through `valueName`. Other sites that print a duration: Corrections' length cells (`correct.len*`, `correct.dot`), unchanged by the ruling; the undo history's `from`/`to` words (`correction-verbs.svelte.ts:265`, `durationWord`) are unchanged and still read "Quarter" without a dot. I did not search for other readers of `loupe.doubleDot`.

## Could not establish

- Whether the undo history's labels (`durationWord`) should also say "Dotted": not in the brief, not changed.
- A rest still shows its syllable in the dock's readout (« Demi-soupir pointé · го »): seen in the pictures, existing behaviour, not touched.
- No Playwright suite was run; the pictures come from a script of mine against a dev server.
