# Report: row 181 B0 and B0g, step 0 (read, report, change nothing) (Code, cloud lane 40, r1, 2026-11-09)

Branch `cloud-lane-40`, from `origin/cloud-lane-38` at `534d998` (fetched; working tree clean). Brief: `brief-code-row181-b0-vowel-boxes-and-skipped-notes_r2_2026-11-09.md`. Every line below was read on that tip.

## 1. Premises

| | Premise | Verdict | Line read |
|---|---|---|---|
| a | `wordsOf` keeps text and bbox and drops `symbols`; the type declares none | **Confirmed** | `underlay-recognize.ts:50-52` (type), `:55-57` (map to `{text,x0,y0,x1,y1}`); the call asks `{ blocks: true }` at `:74` |
| b | `pageTokens` keeps text, x0, x1 | **Confirmed** | `underlay-page.ts:207-214` |
| c | `splitTokens` places parts by letter share | **Confirmed, lines moved** | `underlay-tokens.ts:69-75` (the brief's `:63-69` is now `:69-75`): `width = (x1-x0) * letters(p) / total` |
| d | `cutUnits` places pieces by letter share | **Confirmed** | `underlay-units.ts:79-85` |
| e | `VOWEL` equals `CYRILLIC_VOWEL`, held by a test | **Confirmed** | `underlay-units.ts:24`; `score/vowel-resolver.ts:159`; `underlay-units.test.ts:16-19` (source and flags) |
| f | `voiceNotes` tests rest, at, tied, slur; nothing for grace, chord, cue, voice | **Confirmed** | `underlay-prepare.ts:114-141`; `at` is filtered in `systemsOfPage` (`:169`), not in `voiceNotes` |
| g | `NotePlace.id` is the ordinal among every note of the part, rests counted | **Confirmed** | `underlay-prepare.ts:188`, `:130-131` (`ordinal: out.length`, one entry per `<note>`); `writeLyrics` counts `ordinal++` on every `<note>` match (`underlay-words.ts:219-221`). A note left out of the seated notes shifts nothing. |
| h | `metre-witness.ts:169` skips grace, chord, cue | **Confirmed, with one correction** | `:169` is the three tests. `:170-171` also skips `<voice>` other than 1. The brief's "it keeps no voice test" is wrong: it keeps one. Step 2 item 4 leaves that voice test as it is (no behaviour change) and shares the three predicates. |

Other corrections to the brief, found while reading:

- **Fixtures do hold chord tones.** The brief says `tch-2` and `tch-3` hold none of the four kinds. They hold `<chord />` (counts of the element over the whole file, both parts: `tch-1` 55, `tch-2` 68, `tch-3` 75, `sun3-2` 123). None holds `<grace>` or `<cue>`. They also hold `<voice>` 2 to 7 (several belong to the second part). Step 2 reports the counts for the first part, which is what the seating reads.
- **The score parser already drops grace notes and chords.** `packages/score-parser/src/musicxml-parser.ts:701-702` skips a grace note with a warning; `:941` skips grace and chord when reading supplied ids. It reads no cue and no voice (grep: no match), which is the brief's reason for counting them rather than skipping them.

## 2. Every other site that places a token or unit by x, or decides which notes take syllables

| Site | Reads | Change with this build? | What depends on agreement |
|---|---|---|---|
| `seatTokens` (`underlay-seat.ts:206-279`) | the unit's centre `(x0+x1)/2`; the notes' `x` and `isContinuation` | **No code change.** It receives units with the new boxes, and `live` notes. | It is the one place a box becomes a seat. `monotone` takes the centre. |
| `markExtenderNotes` (`underlay-page.ts:259`; `underlay-extender.ts:62-72`) | token box centre (`:62`), the token's `x0`/`x1` against note x (`:73`) | **No code change; it is handed `live`** (step 2.3). Inert with arm `off` (`underlay-page.ts:221`); live only under `?extender=`. A skipped note must not be marked under an extender, so it gets `live`. | It reads the tokens `pageTokens` gives. A part's box is inside the token's, so the `before` token and its centre move by at most the token's width. |
| `freeNoteXs` (`underlay-counts.ts:37-39`) | notes' `isContinuation` | **No code change.** It is called on `tiesOnly`/`seatNotes`, which derive from `notes`; with `notes = live` the skipped notes leave every free count together. | `underlay-seat.test.ts` holds its filter equal to `seatTokens`' `free`. It stays so, because both see the same `live` list. |
| second look (`underlay-reader.ts:116`, `:155`) | calls `seatPage` again on the re-cut layout; no seating of its own (grep: no `seatTokens`, no `x0`/`x1` in the file) | **No code change.** It inherits both changes through `seatPage`. | |
| `scoreLook` through `rowWordSpans` (`underlay-choose.ts:31`; `underlay-tokens.ts:75-77`) | words by x-centre order, text only | **No change in result.** A part's box lies inside the token's box and parts keep their order, so the order `byCentre` gives is the same; the words are the same text. | The chooser's pick is not moved by B0. |
| row fallback (`underlay-fallback.ts`) | text only (`sewByDictionary`), no x | **No.** | |
| `foldClitics` (`underlay-clitics.ts:106-108`, `:120`) | each unit's centre against the free notes (`noteOf`, `ride`) | **Reads the new boxes; no code change.** It counts `ownNote` by nearest free note, as `seatTokens` seats, so both read one box and agree. A clitic's host unit now has the vowel's centre where it had the share's. The count may move on pieces; it is counted, never acted on. | |
| `manyVowelsInUnits` (`underlay-counts.ts:51`) | `u.x0`, `u.x1` for `notesBetween` | **Reads the new boxes; no code change.** Counts only. | |
| `barExtents` (`underlay-page.ts:381`; `kept-bands.ts`) | `system.notes` (all notes, skipped included) | **No change, deliberately** (step 2.3): it draws a bar's extent from every notehead on the page. | |
| `syllableTargetIds` (`score/pairings.ts:297-308`) | rests and ties only | **No change in this build.** The parser has dropped grace and chord notes before it (above); it keeps cue and voice 2, so they are targets and the poem join would fill them. N.191 is where it must read `skip`. | |
| the poem join's `buildRuns` (`text/poem-join-wire.ts:137-179`) | events, ties, pairings | **No change.** It would fill a cue or voice-2 note as an empty sung note. Not in this build (DESK DEFAULT, step 2.8). | |
| `assertVowelPerNote` (`underlay-page.ts:303`) | the units' letters | **No change.** It runs on every unit; B0 adds no path around it. | |

Not a site, but read: `sung` (`underlay-page.ts:352`) and `vowelsPerNote` (`:389`) take `seatNotes`, so a skipped note leaves the breach check when it leaves the seating, by ruling (Dann 2026-11-05 00:19).

## 3. Ceilings and the eight gates, baselines on `cloud-lane-40` at `534d998` (run by me)

`pnpm install --frozen-lockfile`, then each gate from the repository root. All exit 0.

| # | Gate | Baseline |
|---|---|---|
| 1 | `pnpm test:phonology` | 14 files, **456** tests passed |
| 2 | `pnpm test:dictionary` | 4 files, **248** passed |
| 3 | `pnpm --filter @ilya/web check` | **0 errors, 12 warnings** in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 256 files, **4707 passed, 1 skipped** (4708) |
| 5 | `pnpm --filter @ilya/score-parser test` | 35 files, **785 passed, 5 skipped** (790) |
| 6 | `pnpm test:blurb` | 4 files, **168** passed |
| 7 | `pnpm test:integration` | 7 files, **125** passed |
| 8 | `pnpm ratchets` | 699 source files, OK; ceilings that could be lowered (not mine to lower): `Drawer.svelte` 1990 to 1975, `LearnContent.svelte` 4099 to 4096, `pairings.ts` 1422 to 1420, `CalibrationWizard.svelte` 2124 to 2112, `staff-renderer.ts` 3427 to 3426 |

Ceilings: no `underlay-*.ts`, `stamp.ts`, or `metre-witness.ts` is listed in `scripts/ratchets.json`, so each new or grown file is held by `newFileMaxLines` 1000. Current lengths: `underlay-page.ts` 391, `underlay-prepare.ts` 247, `underlay-seat.ts` 279, `underlay-tokens.ts` 118, `underlay-units.ts` 88, `underlay-recognize.ts` 101, `stamp.ts` 64. No ceiling is raised by this build.

## 4. What Code could not establish

- The desk's measure (section 5 item 2) needs scans that are not in the repository. Not run.
- Which x each vowel box holds on row 114 f1: not established here (no scans).
