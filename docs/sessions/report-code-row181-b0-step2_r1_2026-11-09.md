# Report: row 181 B0 and B0g, step 2 (which notes take no syllable) (Code, cloud lane 40, r1, 2026-11-09)

## 1. What was built

- `apps/web/src/lib/omr/note-kinds.ts` (new, pure): `isGrace`, `isChordTone`, `isCue` (`/<grace[\s/>]/`, `/<chord[\s/>]/`, `/<cue[\s/>]/`), `voiceOf` (the number in `<voice>`, 1 where absent), `skipOf` (grace, then chord) and `wouldSkipOf` (cue, then voice 2 or later).
- `VoiceNote` and `NotePlace` gain `skip?: 'grace' | 'chord'` (first that applies, in that order); both also gain `wouldSkip?: 'cue' | 'voice2'` for the note that is not skipped and would be later (item 8). `voiceNotes` sets them (`kindsOf`, `underlay-prepare.ts`); `prepareUnderlay` carries them to `mine`. A plain note has neither key, so every earlier `toEqual` on a plain note holds.
- `seatPage` (`underlay-page.ts`): `const live = system.notes.filter((n) => !n.skip)`, given to `markExtenderNotes` and used as `notes`. Skipped notes stay in `system.notes` (the patch's placement: `systemsOf`'s grouping and the band are unchanged).
- `metre-witness.ts` `barFacts` uses the three predicates. Its own voice test (`<voice>` other than 1 is skipped, `:170-171`) is unchanged (step 0 corrects the brief: it has one). `note-kinds.test.ts` holds the old one regex and the predicates equal on grace, chord, cue (with the `<grace slash="yes"/>` and `<chord />` spellings), and `barFacts` counts the same.
- `UnderlayStats.skippedNotes: { grace, chord, wouldSkip: { cue, voice2 } }`, counted over every system's notes in the layout, and printed in the page's console line (`skippedLine`, `underlay-reader.ts`): `; skipped notes: G grace, C chord (not skipped, counted: N cue, M voice 2)`.
- Comments in the 2026-11-01 form on `live` (what it checks, why, what follows when it fails, relation), naming Dann 2026-11-05 00:19 for grace and DESK DEFAULT for chord, and N.191 and the poem join as what must read `skip` before cue and voice 2 join it.

## 2. Every later use of `system.notes` in `seatPage` (step 2 item 3)

| Use | Reads | Why |
|---|---|---|
| `bars` (`system.notes.map((n) => n.bar)`) | **all notes** | The system's first and last bar as homr numbers them: a grace note is in its bar. Reading `live` would drop a bar that holds only a skipped note. |
| `silent` (`system.notes.every((n) => n.tiedInto === true)`) | **all notes** | As measured, and unchanged from today. Consequence, for the desk: a system with no ink whose every sung note is tied, but which also holds a grace note or a chord tone, is not `silent` and appears in the banner as it did before this build. Reading `live` would make it silent. Not changed here, because the measure was taken with all notes and silence decides a banner line; a question for the desk. |
| `barExtents(system.notes, …)` | **all notes** | The bar's extent across the page is drawn from every notehead; a skipped note is a notehead on the page. |
| `free`, `tiesOnly`, `slurFree`, `slurReading`, `seatNotes`, `seatFree`, `sung`, `vowelsPerNote` | **`live`** (through `notes`) | Every count and every seat reads one list, so the sites agree (`CONTRACT.md` §4, "every other site"). A skipped note is outside the one-vowel-per-note count by ruling. |

## 3. Counts on the fixtures (first `<part>`, the part the seating reads)

| Fixture | Notes | grace | chord | cue | voice 2 or later |
|---|---|---|---|---|---|
| `sun3-2.musicxml` | 70 | 0 | 0 | 0 | 0 |
| `tch-1.musicxml` | 59 | 0 | 0 | 0 | 0 |
| `tch-2.musicxml` | 91 | 0 | 0 | 0 | 0 |
| `tch-3.musicxml` | 88 | 0 | 0 | 0 | 0 |

So the fixtures give no case; each kind has its own hand-written fixtures in `note-kinds.test.ts`. **Song 3's 290 flagged notes: I cannot say which kind accounts for them.** The fixtures hold none, the scans are not in the repository, and the kinds are not logged anywhere I can read. NOT ESTABLISHED. The console line prints the four counts per page, so the desk's run will say.

## 4. Tests (`note-kinds.test.ts`, 10 tests)

- Each kind with its own fixture: grace and chord skip; cue and voice 2 are counted and NOT skipped (seated on, counted under `wouldSkip`).
- The four tests do not match a longer element name (`<graceful/>`, `<chords/>`, `<cues/>`).
- The two lists equal (metre read and seating).
- `voiceNotes` flags, numbers every note, and a plain part reads as before.
- `writeLyrics`: a syllable seated by ordinal lands on its note with a grace note ahead of it (no ordinal moved).
- `prepareUnderlay` carries the flags to the layout and keeps the skipped note there, with its ordinal.
- `seatPage`: a grace note at 455 before a long note at 500, with the word centred at 460: the syllable seats on the long note (id 2); with the flag removed it seats on the grace note (id 1), so the test kills the mutant that drops the filter. Ids of the other notes unchanged. A chord tone likewise. A skipped note leaves the breach check (no `no-syllable` breach for it).

## 5. Gates touched

`apps/web/src/lib/omr` 41 files, 679 tests pass; `svelte-check` 0 errors, 12 warnings. The full eight are in step 5.

## 6. What Code could not establish

- Which kind accounts for song 3's 290 flagged notes (above).
- Whether homr writes `<grace>` and `<chord/>` into the first part on a real scan: the fixtures show none; the console line will say on the desk's run.
