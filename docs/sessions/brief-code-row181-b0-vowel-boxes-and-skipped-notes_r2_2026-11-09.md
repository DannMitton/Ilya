# Brief: row 181, B0 and B0g: each syllable placed by its own vowel's ink, and grace notes, chord tones, cue notes, and voice 2 take no syllable (Code, cloud lane, r2, 2026-11-09)

Written by the desk (Opus) 2026-11-09. r2 applies all eleven amendments of Fable's review (`docs/sessions/review-fable-three-briefs_r1_2026-11-09.md`, "Brief 1"); r1 is `brief-code-row181-b0-vowel-boxes-and-skipped-notes_r1_2026-11-09.md`. Code lines were read by the desk on `cloud-lane-34` at `05db2dac` and by Fable on `cloud-lane-38` (`git diff` of `apps/web/src/lib/omr` between them empty at review time); step 0 re-reads every line on the lane's tip. NOT ESTABLISHED beats a complete invented answer.

## 1. What the singer gets

On a scanned song, a word printed across a melisma lands each of its syllables under the note the print puts it under, because Ilya now places a syllable where its vowel's ink is, not a share of the way along the word's box. A grace note or a chord tone never takes a syllable meant for the voice's own note. Cue notes and a second voice's notes are counted in this build and left out in a later one (step 2, DESK DEFAULT). She sees nothing new on the page: fewer syllables one note early or late. Nothing is added to the page, the drawer, or the Loupe.

## 2. The rulings this builds

- **The vowel is the nucleus, and the note takes a vowel** (Dann 2026-11-05 00:32 and 00:35, `OPEN.md`, "THE VOWEL IS THE NUCLEUS"; first use named there: B0).
- **Positions come from evidence, never from an arbitrary rule** (`CONTRACT.md` §0.2). Today's placement by letter share is the arbitrary rule this replaces.
- **A grace note takes no syllable by default** (Dann 2026-11-05 00:19, `OPEN.md`, "A GRACE NOTE TAKES NO SYLLABLE BY DEFAULT"). Chord tones and voice 2 left out of the seated notes: DESK DEFAULT in the same section. Cue notes and voice 2 are counted but not skipped in this build (step 2.8, DESK DEFAULT): the score parser keeps both as ordinary events and the poem join would fill them from the poem (Fable review, amendment 6).
- **One vowel per note, no exceptions** (`CONTRACT.md` §0.1). `assertVowelPerNote` still runs on every unit; this brief adds no path around it.

## 3. The evidence, already measured

Report `report-desk-row181-b0_r1_2026-11-05.md`; ledgers `ledger-tip.tsv`, `ledger-B0_tip.tsv` (`~/Downloads/_desk-2026-11-04/desk-row181-c-drop-data_2026-11-05.tgz`; `~/Downloads/_desk-2026-11-08/desk-row181-armJ2-harness_2026-11-08.tgz`), read and diffed by the desk 2026-11-09. Row 114 f1, five songs, 590 printed syllables, (b) exact syllable on the right note:

| Tree | (b) | per song |
|---|---|---|
| arm S control (the base this lands on) | 385 | 48, 136, 33, 82, 86 |
| B0g on arm S | 387 | |
| B0 on arm S | 389 | 49, 139, 33, 82, 86 |
| history: `05db2dac` (joint) control | 376 | 48, 139, 33, 82, 74 |
| history: B0 on the joint | 380 | 49, 142, 33, 82, 74 |

Per syllable, B0 against control: **+6, −2.** Gained: song 1 p1 s2 «на»; song 2 p3 s3 «те,» and «дру» (the control seats them swapped); song 2 p6 s3 «те,» and «дру» (the same swap) and «ви». Lost: song 2 p6 s2 «Ра» and «мгно». The same +6 and −2 hold on the arm S base (385 to 389). New two-vowel notes and empty sung notes: 0. Symbol fallbacks: 0 (every token's letter boxes matched its letters).

**The two losses, explained by the desk 2026-11-09** (control capture `cap/ctl2/s2/r114-song2.console.txt`, the `[c181] ink` line for the page, in the J2 harness): on song 2's page 6, the system Ilya seats as one holds the notes of two printed systems (heads at y 541 to 721 for page bars 1 to 7, and y 1758 to 1980 for page bars 8 to 13), and seating compares x only. «Ра»'s right note is at x 804; the upper staff's first note is at x 820. B0's narrower vowel box moves «Ра» and «мгно» onto upper-staff notes. Which x each vowel box held is NOT ESTABLISHED (not logged); the merged system is established. Cause of the merge: `systemsOf` gives each note to a staff (`staffOfNotes`, `apps/web/src/lib/omr/underlay-band.ts:130`) and makes one system per owning staff (`:133-140`); why both printed systems' notes went to one staff is NOT ESTABLISHED (the metre read of that page logged "1 voice staves not found"). This is design r3 rank 7's case (`design-desk-reader-data-r3_r1_2026-11-08.md` §7), not this brief's. **This brief does not touch it.**

## 4. The build

Lane: a new branch `cloud-lane-40` from `origin/Shane` after `cloud-lane-38` (which holds lane 34 and the long-dash split) is merged; the desk gives the tip. Never `Shane` or `main`; no pull request; Dann merges (`CONTRACT.md` §4). One commit and one report per step, reports at `docs/sessions/report-code-row181-b0-step<n>_r1_2026-11-09.md`. Do not edit `docs/memory/`.

The measured patch is the sketch, not the code: `~/Downloads/_desk-2026-11-08/desk-row181-armJ2-harness_2026-11-08.tgz`, `./patch.py` (md5 `d974868cd76e430dc37789ab6cc2366b`), whose text the desk pastes below where it matters. It ran behind a URL switch (`?b0=full`, `?b0=g`) and a module of mutable counters; the build has neither. **B0 and B0g are on for every singer; the brief adds no switch.** The `?words=read` switch was removed by the integration's step 8.

### Step 0. Read, report, change nothing

1. Read in full: `apps/web/src/lib/omr/underlay-recognize.ts`, `underlay-page.ts`, `underlay-tokens.ts`, `underlay-units.ts`, `underlay-prepare.ts`, `underlay-seat.ts`, `stamp.ts`, `metre-witness.ts:150-175`, and their tests.
2. Confirm or correct each premise, with the line you read: (a) `wordsOf` keeps text and bbox and drops `symbols` (`underlay-recognize.ts:55-57`; the type at `:50-52` declares no `symbols`); (b) `pageTokens` keeps text, x0, x1 (`underlay-page.ts:207-214`); (c) `splitTokens` places the parts of a token split at an internal mark by letter share (`underlay-tokens.ts:63-69` in the `parts.forEach`); (d) `cutUnits` places the engine's pieces by letter share (`underlay-units.ts:79-85`); (e) `VOWEL` in `underlay-units.ts:24` is held equal to `CYRILLIC_VOWEL` (`score/vowel-resolver.ts:159`) by `underlay-units.test.ts`; (f) `voiceNotes` tests `rest`, `at`, `tiedInto`, and slur ends, and nothing for grace, chord, cue, or voice (`underlay-prepare.ts:114-141`); (g) a `NotePlace`'s `id` is the note's `ordinal` among every note of the part, rests counted (`underlay-prepare.ts:188`; `VoiceNote.ordinal` at `:41`), so leaving a note out of the seated notes shifts no other note's ordinal and no `writeLyrics` ordinal; (h) `metre-witness.ts:169` skips `<grace`, `<chord`, `<cue` for the bar's sum.
3. Name every other site that places a token or a unit on the page by x, or that decides which notes take syllables (`CONTRACT.md` §4, the "every other site" line), and say for each whether it must change with this build and what depended on the sites agreeing. The desk knows of: `seatTokens` (`underlay-seat.ts`), `markExtenderNotes` (called at `underlay-page.ts:259`), `freeNoteXs` (`underlay-counts.ts`), the second look's seating (`underlay-reader.ts`), the row fallback (`underlay-fallback.ts`), the typed path's `syllableTargetIds` (`apps/web/src/lib/score/pairings.ts`), the poem join's runs (`text/poem-join-wire.ts`). The list is a lead, not a census. Add, with lines, the readers of a token's box: `foldClitics` (`underlay-clitics.ts:106-108`, `:120`), `manyVowelsInUnits` (`underlay-counts.ts:51`), `markExtenderNotes` (`underlay-extender.ts:62-72`; inert with arm `off`, `underlay-page.ts:221`, live under `?extender=`), and `scoreLook` through `rowWordSpans` (`underlay-choose.ts:31`, `underlay-tokens.ts:75-77`); say for each whether the build changes it.
4. Report the ceilings and the eight gates' baselines on the lane's tip, run by you, not from the ship script's `Shane` numbers.

### Step 1. The reader's letter boxes reach the tokens

1. `TesseractBlock`'s word type gains `symbols?: { text: string; bbox: {x0,y0,x1,y1} }[]`, and `wordsOf` carries them to `WordBox` as `symbols?: { text, x0, y0, x1, y1 }[]`. The call already asks for `{ blocks: true }` (`underlay-recognize.ts:74`), which returns symbols (tesseract.js 7 typings `index.d.ts:191-215`, cited by Fable's review of design r2, finding 12; re-read them).
2. `Token` (`underlay-seat.ts:76-83`) gains `syms?: { c: string; x0: number; x1: number }[]`: the token's letter boxes in page pixels, each unframed as the word box is (`pageTokens`, `underlay-page.ts:208-210`: `unframeBox(row.transform, s)` plus `row.offsetX`).
3. Tests: a fixture word with symbols round-trips through `wordsOf` and `pageTokens`; a word without symbols gives a token without `syms`, unchanged from today.

### Step 2. Which notes take no syllable (B0g)

1. One module, `apps/web/src/lib/omr/note-kinds.ts` (new, pure): `isGrace`, `isChordTone`, `isCue`, `voiceOf` over a `<note>` element's text, as the patch tested them: `/<grace[\s/>]/`, `/<chord[\s/>]/`, `/<cue[\s/>]/`, and the number in `<voice>`, 1 where absent.
2. `VoiceNote` and `NotePlace` gain `skip?: 'grace' | 'chord'` (the first that applies, in that order; see item 8 for cue and voice 2), set in `voiceNotes` and carried in `prepareUnderlay` where `mine` is built (`underlay-prepare.ts:188`).
3. In `seatPage`, the notes a system seats and marks are those without `skip` (the patch: `const live = system.notes.filter((n) => !n.skip)`, used for `markExtenderNotes` at `:259` and for `notes` at `:261`). **Keep the patch's placement:** skipped notes stay in `system.notes`, so `systemsOf`'s grouping and the band are unchanged; the measure was taken that way. Every later use of `system.notes` in `seatPage` (`:369`, `:373`, `:381`) is listed in the report with whether it reads `live` or all notes, and why.
4. `metre-witness.ts:169` uses the same three predicates (no behaviour change there; it keeps no voice test), and a test holds the two lists equal on grace, chord, and cue.
5. `UnderlayStats` gains `skippedNotes: { grace, chord, wouldSkip: { cue, voice2 } }`, printed in the page's console line.
6. Comments, in the 2026-11-01 form (what it checks, why, what follows when it fails, how it relates): grace, Dann 2026-11-05 00:19; chord, DESK DEFAULT. A skipped note stays in the XML, so `writeLyrics`' ordinals do not shift. The comment on `live` says a skipped note is outside the one-vowel-per-note count by ruling (Dann 2026-11-05 00:19), so §0.1's "none" clause is not breached when it leaves `sung` (`underlay-page.ts:339`) and the breach check (`:388-389`).
8. **Cue and voice 2 are counted, not skipped (DESK DEFAULT).** The score parser keeps both as ordinary events (`packages/score-parser/src/musicxml-parser.ts`, no `<voice>` or `<cue>` test) and the poem join's `buildRuns` (`text/poem-join-wire.ts:137-179`) would fill an empty one from the poem. So `skip` takes `'grace'` and `'chord'` only in this build; `note-kinds.ts` still detects cue and voice 2, and `UnderlayStats.skippedNotes` counts them as `wouldSkip`. Report the per-kind counts on every fixture and say which kind accounts for song 3's 290 flagged notes if the fixtures allow. The comment names N.191 and the join as what must read `skip` before cue and voice 2 join it.
9. Tests: one per kind (grace and chord skip; cue and voice 2 counted, not skipped), with their own fixtures (`tch-2` and `tch-3` hold none); a measure with a grace note before a long note seats the syllable on the long note; ordinals of the other notes unchanged.

### Step 3. Each piece placed by its own vowel's ink (B0)

1. **`splitTokens`** (`underlay-tokens.ts`, the `parts.forEach` of `:63-69`): where the token has `syms` and their letters equal the token's letters (letters only, case folded: the patch's `symLettersMatch`), each part takes the box of **its own vowel letter** when it holds exactly one vowel; a part with two or more vowels or none takes the span of its own letters' boxes. Each part carries its own `syms` slice onward. Where the letters do not match, today's letter share stands and is counted.
2. **`cutUnits`** (`underlay-units.ts`, the `pieces.forEach` of `:79-85`): where the token's `syms` match its letters and number exactly its letters, each piece takes the box of the first vowel letter in it; a piece with no vowel letter keeps its share and is counted. Where they do not match, today's share stands and is counted.
3. The vowel test is `VOWEL` from `underlay-units.ts:24` everywhere (it includes ѣ, і, ѵ, as `CYRILLIC_VOWEL` does, and excludes «й»). The patch wrote a second inline regex in `underlay-tokens.ts`; the build does not.
4. `UnderlayStats` gains `vowelBoxes: { placed, fallbackNoMatch, fallbackNoVowel }`, on the page's console line. On row 114 f1 the measure gave fallbacks 0.
5. Nothing after the box changes: `seatTokens(..., 'monotone')` takes the units as today.
6. Comments: what (a piece's vowel letter has a box), why (Dann 2026-11-05 00:32 and 00:35; `CONTRACT.md` §0.2), what follows when it fails (the letter share, counted), relation (`seatTokens` unchanged; one vowel per note still checked by `assertVowelPerNote`).
7. Tests, with mutants that the tests kill: a two-syllable token whose second vowel sits at three quarters of the box places its second piece there, not at the letter share; a token whose symbols drop a letter falls back and counts one; a part with no vowel keeps its share; a pre-reform vowel (ѣ) is found.

### Step 4. The stamp

Read `stamp.ts` on the lane's tip (step 8 of the integration joined `UNDERLAY_READER` to `READER_STAMP`). Bump the underlay reader's stamp once from whatever it holds, add its line to the header comment (B0 and B0g; a stored scan is read again once), and update `stamp.test.ts` to the relation the tip has. Do not pre-name a version.

### Step 5. Gates and report

All eight gates on the lane's tip, each with its number against step 0's baseline; any move explained. Ceilings not raised; if a file would pass its ceiling, move code out first and say so.

## 5. Done when

1. Code: steps 0 to 5 pushed to `cloud-lane-40`, all eight gates green, every new comment and test in place, the reports read in full by the desk.
2. **The desk's measure on row 114 f1, on the lane's tip, through the same harness and scorer as the B0 report** (the scans are not in the repository; the cloud session does not run this): (b) **389, per song 49, 139, 33, 82, 86**, with the per-syllable diff against the arm S control (385) equal to section 3's +6 and −2, captured three times for songs 2 and 5. New two-vowel notes 0; new empty sung notes 0; `vowelBoxes` fallbacks reported. If it does not reproduce, the desk reports where it differs before anything ships. The harness applied B0 as a patch behind `?b0=`; for the gate it runs the lane as built, with no patch and no `?b0=` or `?words=` query (a one-line change to the harness before the run). The desk also scores the join's fills on skipped notes.
3. Then Fable as built (`CONTRACT.md` §1 item 19), then Dann's ship.

## 6. Out of scope

The long-dash split is the base and is not changed here (its gain on song 5 p21 s3 stays NOT ESTABLISHED); skipping cue and voice-2 notes; rank 2, the row floor (refuted twice, `report-desk-row181-armJ2-scaled-floor_r1_2026-11-08.md`); the chooser's pick on song 2 p5 s1 (`scoreLook`, a question for the Fable session); the merged system of section 3 (rank 7); any string, the Loupe, the page.

## 7. What Code could not establish

The report carries a section of this name. NOT ESTABLISHED beats a complete invented answer.

## 8. Cost

Code, Sonnet 5.5, cloud lane. The desk's estimate, first of its kind for a Code build of this size in `ENVIRONMENT.md`'s table: NOT ESTABLISHED until the desk reads the table; the desk states the range before the session starts.
