# Report: lane 63, Step 1 (the empty picker's clef and starting octave)

2026-11-17. Branch `cloud-lane-63`, on `240fe5ab` plus the Step 0 report.

## What changed

- `apps/web/src/lib/voice/note-picker.ts:70-85`: new pure function `emptyPickerStart(voiceType?)`, returning `{ clef, octave }`. The clef is `clefForVoiceType(voiceType) ?? 'treble'`. The octave is 3 when that clef is bass, otherwise 4. Its doc comment records the DESK DEFAULT and the open question about the baritone.
- `apps/web/src/lib/voice/NotePicker.svelte:70-75`: `stagedOctave` is now `$state<number | null>(null)`, with `start = $derived(emptyPickerStart(voiceType))`; `curOctave` is `value ? value.octave : (stagedOctave ?? start.octave)`. Until the singer sets an octave, the octave follows the declared voice type, so it changes if the type changes while the picker is empty. `setOctave` and `clear` assign a number as before, so after the octave control or Clear, the number stays.
- `apps/web/src/lib/voice/NotePicker.svelte:126`: the empty state reads `start.clef`, where it read `'treble'`. A picker that holds a note still uses `clefFor(value, voiceType)`.
- `apps/web/src/lib/voice/NotePicker.svelte:38`: import added.
- `apps/web/src/lib/voice/note-picker.test.ts`: 13 new tests (the block "the empty picker draws the declared voice type's clef and starts at its octave (lane 63)"). Written first and run red (13 failed), then green.

No string, key, dependency, or ceiling changed. `NotePicker.svelte` is 390 lines and `note-picker.ts` 179; neither has a ceiling in `scripts/ratchets.json`.

## Tests

`apps/web/node_modules/.bin/vitest run src/lib/voice/note-picker.test.ts`: **32 passed (32)**, 1 file. Before the change the file had 19 tests; the 13 new ones are the table below.

| Declared type | Empty clef | Starting octave |
|---|---|---|
| bass | bass | 3 |
| bass-baritone | bass | 3 |
| baritone | bass | 3 |
| tenor | treble | 4 |
| mezzo-soprano | treble | 4 |
| soprano | treble | 4 |
| contralto | treble | 4 |
| countertenor | treble | 4 |
| not-sure | treble | 4 |
| none (undefined) | treble | 4 |
| empty string | treble | 4 |
| an unknown type | treble | 4 |

One more test checks that a bass's starting octave puts D on the middle line of the bass staff (offset 0).

`svelte-check --threshold error`: 0 errors (12 warnings, in 5 files; I did not compare them with the tip's warnings).

## Pictures

`docs/sessions/report-code-lane63-pictures/`, English, stub session (`?capture=stub`), the returning-browser storage state, "Describe your voice" open, the first picker ("Highest comfortable note") in view. I looked at all eight.

- `step1-desk-en-bass-empty.png`, `step1-phone-en-bass-empty.png`: bass clef, octave control reads 3.
- `step1-desk-en-tenor-empty.png`, `step1-phone-en-tenor-empty.png`: treble clef, octave 4.
- `step1-desk-en-notype-empty.png`, `step1-phone-en-notype-empty.png`: treble clef, octave 4 (the pane offers "Choose a voice type").
- `step1-desk-en-bass-one-note.png`, `step1-phone-en-bass-one-note.png`: the same bass with E4 set as the highest note: bass clef, E4 on a ledger line above the staff, "E4" and "Clear" beside it.

Desk is 1440 by 900 at 1x. Phone is 390 by 844 at 2x (the brief gives the size, not the scale). My first one-note pair set the lowest note (E2), which on the phone sat below the fold; I discarded that pair and retook both with the highest note set. The script that took them is in my scratchpad, not in the repository.

## What I could not establish

- Whether octave 3 suits a baritone's first pick (the brief's section 7). The code treats the baritone as the bass, as the ruling's clef split does.
- The eight Playwright suites on this change: they run once at the end.
- Whether the 12 svelte-check warnings are all on the tip already.
