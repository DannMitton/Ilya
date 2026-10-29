# Brief: N.135 stage 2b r5, steps 5 to 9, one vowel per note (desk, 2026-10-29, r1)

For Code, cloud lane `cloud-lane-21`, on top of step 4 (`1eb05e7`). One commit and one report per step, `docs/sessions/report-code-n135-stage2b-r5-step<n>_r1_2026-10-29.md`. Never push `Shane` or `main`. Stop after step 9's push and report. Reviewed by Opus in Fable's place (Dann 2026-10-28 23:21 for stage 2b; 2026-10-29 01:39 for this brief).

## 0. The rule this serves (read first)

`CONTRACT.md` §0.1 on `Shane` (read it with `git show origin/Shane:docs/memory/CONTRACT.md`): Russian lyric diction sings one vowel per note, no more and no less; a vowelless word takes no note and joins its host as *proclitic + U+00A0 + initial syllable* or *terminal syllable + U+00A0 + enclitic*; «й» is a consonant. **The order of evidence** (Dann 01:37): the print decides which note a syllable takes; the rule checks it; where they disagree Ilya looks closer at the print and never cascades silently; the singer repairs what is left with the notation controls. With no engraving (an imported file, a fixture) the rule checks that no clitic sits on a note without its host. **Scope** (Dann 01:23): the machinery only. Nothing here changes how the Text view shows a transcription, its directional arrows included.

## 1. What the singer gains

A printed «въ» or «съ» joins its host as a modern «в» does; a clitic the print groups with its host never takes a note of its own; nothing Ilya does moves a later syllable it did not read; and no test of Ilya rests on a file that breaks the rule.

## 2. Step 5: the clitic match reads the modern spelling

Found by the desk's replay (`report-desk-n135-stage2b-r5-replay_r1_2026-10-29.md`, filed with this brief): step 4 reads 1,870 / 1,707 against 1,880 / 1,710 because `cliticCalls` matches the row's letters to the transcription's `cleanWord` letter for letter (`underlay-seams.ts:42`, `:56` at `1eb05e7`), and the transcription gives «в» for a printed «въ». Six rows lose a fold (K p1, p4; S p1; T p2, p3, p5).

- Compare a sewn word with the transcription's word after the same modern-spelling conversion the factory already passes as `modern` (`makeSeams`, `underlay-seams.ts:34`); where `modern` gives null, the word's own letters. Do not strip «ъ» by hand.
- Test: «въ мир» and «съ нею» fold as «в мир» and «с нею» do; a mutant comparing raw letters fails it.
- Expectation for the desk's replay: 1,880 / 1,710, vowelless alone on a note 79 (the replay's scratch edit gave exactly these).
- Report any other spelling difference you see the match fail on; do not fix it in this step.

## 3. Step 6: one check, `vowelsPerNote`

- A pure function that takes the syllable text on each note and reports each note whose text has letters and **no vowel** (and is not a continuation: tied into, under an extender, or a melisma's later note) or **two or more vowels**. Vowel letters: the existing sets only. `CYRILLIC_VOWEL` (`score/vowel-resolver.ts:159`) and `VOWEL` (`omr/underlay-units.ts:24`, held equal by `underlay-units.test.ts:16-19`); `omr/` may not import `score/`, so place the function where both may import it, or give `omr/` its copy beside `VOWEL` held equal by a test. No new vowel set. Count a letter of U+00A0-joined text as part of the one unit.
- It also reports a note whose text is a mark alone, `#` above all. A syntactic break is fused to its syllable with a no-break space («я\u00a0#», ruled 2026-10-25/26, `INBOX.md`), never a note of its own. Dann 2026-10-29 01:44: *"An isolated octothrope is not possible or permissible. Octohropes are dealt with in Ilay as if they are enclitics."* No allow-list entry may permit a lone `#`. Found by the desk 2026-10-29 01:4x: the Sunless 1 fixture's IPA verse puts `#` alone on bar 5's first note (`sunless-01-engraved.musicxml:435`; a second at `:1643`), and every IPA syllable after it lands one note late.
- It reports; it changes nothing.
- Tests: «в бью» one vowel; «в» none; «бью ж» one; «мой» one («й» a consonant); «мгновенья» four; a tied-into note with no text not reported.

## 4. Step 7: the scan reader, print first

Two cases, both inside `omr/` (step 4's `underlay-clitics.ts`, and `underlay-units.ts`, `underlay-words.ts`):

**A. A vowelless word the transcription calls a clitic.** Today step 4 folds it into its host whatever the print shows. New: fold it only where the print groups it with its host, that is, where the note nearest the clitic's box centre (`nearestOf`, `underlay-seat.ts:108`) is the same note as the one nearest its host unit's centre, or where no free note lies between their two centres. Where the print gives it a note of its own (a free note nearer the clitic than to its host, and not shared), leave it a unit of its own, as printed, and count it in a new stat `clitics.ownNote`. The print decides; the singer repairs.

**B. A vowelless word the transcription does not call a clitic** (step 4's named departure, a misread letter such as «т»): unchanged. It stays a unit at its own box; a misread syllable under its own note is the print's syllable read wrong, and the singer repairs it.

**C. Two or more vowels in one seated unit** (an engine cut that failed, `underlay-units.ts:52-56`; two tokens merged on one note, `underlay-words.ts:72-75`): **count only, change nothing.** Add a stat `manyVowels` with, for each such unit, its text, its box, and how many free noteheads lie between its box's x0 and x1. The desk designs the repair from these counts. No cascade, ever.

- Tests for A: «В бью» printed as one group over one notehead folds; a «в» whose centre is nearest a free note of its own and a host nearest the next note stays its own unit and is counted. Mutant: fold regardless (step 4's behaviour) fails the second.
- Run step 6's check on every page's seats in the existing integration tests and print the counts in the report.

## 5. Step 8: no test rests on a file that breaks the rule

- A test that runs step 6's check over every tracked MusicXML with Cyrillic lyrics (`git ls-files`) and every tracked truth file. It fails on any breach not on an allow-list; each allow-list entry names the test that needs the breach and why.
- **Repair `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`** from the desk's extract of its truth file, `docs/sessions/truth-sunless-01-underlay_2026-10-29.json` on `origin/Shane` (`git show origin/Shane:docs/sessions/truth-sunless-01-underlay_2026-10-29.json`): 96 voice notes in order with bar, onset, MIDI, and both verses. Change only the `<lyric>` text and `<syllabic>` of verse 1 and verse 2; never a note. Check note count and pitch per bar first; if they do not match the extract, stop and report. The fixture breaks the rule from bar 8 (verse 1: «в» alone, the rest one note late through bar 18) and its IPA verse from bar 4 (a stray «#» at bar 5); the Lamm print and the musx agree with the extract (desk, 2026-10-29 01:1x).
- **`apps/web/src/lib/score/ingestion/fixtures/n188-markings.musicxml`** (or wherever it is tracked) breaks the rule at bar 1 («знь») and bar 4 («в»). Read every test that reads it. If a breach is what a test exists to test, allow-list it with the test's name; otherwise report it and do not change the file. Do not guess.
- Re-run every test that reads the repaired fixture. For each expectation that changes, say what it pinned, what it pins now, and that the new value matches the extract. `typed-words-land.test.ts`: re-run the 62-window sweep on the repaired fixture and report LIMITS 1, 2, and 3 as they stand now, each still pinned or removed with its reason.

- **A fixture is checked against its source, not only against the rule.** The vowel check misses a stretch shifted by one note where every note still holds one vowel (the repaired fixture's IPA verse was shifted from bar 4 and broke the rule only at bar 5). So: for every tracked MusicXML fixture with Cyrillic lyrics that has a tracked truth file or desk extract for the same song, a test compares the two note by note (bar, onset, verse 1 text, verse 2 text where present) and fails on any difference not on the allow-list. Sunless 1 is compared with `docs/sessions/truth-sunless-01-underlay_2026-10-29.json`, copied into the fixtures folder beside it. List the lyric-bearing fixtures that have no truth to compare with, by name, in the report.
- **Provenance.** Beside each lyric-bearing fixture, a short `<name>.provenance.md`: where the file came from (the source file and its md5 where known, the converter and version, e.g. `musx2mxl 0.2.9` from `sunless-01-engraved.musicxml:10`), every edit since by date as far as `git log` shows it, and what it was checked against. Write what you can read; mark the rest NOT ESTABLISHED.

## 5a. Step 9: a typed `#` takes the no-break form when the singer leaves Lyrics

Ruled by Dann 2026-10-29 01:48 on the desk's offer (*"Yes I love it make it so."*): when the singer leaves the Lyrics field, a `#` that stands after a word with an ordinary space becomes the no-break form, «я #» to «я\u00a0#». Nothing changes while the singer types, and a `#` never moves.

- Where: the Lyrics field's leave (blur) only, on the field's own text; find the handler and say where. Not on a keystroke, not on paste, not on a score's own text.
- What: one or more U+0020 spaces or tabs between a word's last character and a `#` that is followed by whitespace, a line end, the text's end, or another `#`, become one U+00A0. A `#` already glued is left alone. **Leave «я #на» as it is**: `break-glue.ts`'s `WORD_TOKEN` (`:15`) would read «я\u00a0#на» as one token and fuse two words. Never touch a line break, and never a `#` inside a word.
- It must change no placement: the words, their syllables, every seat, and the IPA are identical before and after (`syntactic-break.ts` already attaches every typed `#` to the word before it, `:27-36`). Test that on Sunless 1 with a `#` typed after three words. Mutant: converting «я #на» fails a test that shows the two words fused.
- Undo: the change goes through the same path as a typed edit, so whatever undoes a typed edit today undoes this one; say which path that is, with file and line.
- The Text view's display does not change.

## 6. What may not change

The Text view's display; the staff's drawing of a file's own `<lyric>`; `reseat.ts`, `text-diff.ts`, and the N.161 clitic-fold rule; `GraysonEngine.cliticData` (`packages/phonology/src/engine.ts:244-681`); the banner keys and their ratified wording; any note of any fixture; `CYRILLIC_VOWEL`'s letters.

## 7. Cross-site line (`CONTRACT.md` §4)

- **Vowel letters** are computed in four places: `CYRILLIC_VOWEL` (`score/vowel-resolver.ts:159`), `VOWEL` (`omr/underlay-units.ts:24`), `CYRILLIC_VOWELS` in `clitic-merge.ts:13-16` (`hasVowel`, used at `pipeline.ts`; lacks ѣ, і, ѵ), and `typed-hyphens.ts` (find it; the brief r5 names `:43`). Step 6 adds none; say which it uses and that the others agree with it on every letter but ѣ, і, ѵ.
- **Which word is a clitic** is computed once, `GraysonEngine.cliticData` via `isProclitic` and `isEnclitic` (`pipeline.ts:777-788`). Step 5 changes only how the reader matches its words to it.
- **The no-break space** has three copies (`score/pairings.ts`, `score/clitic-seat.ts`, `omr/underlay-clitics.ts`); add none.

## 8. Gates

All eight after each step. Baselines after step 4: 291; 248; 0 errors and 12 warnings in 5 files; 3635 passed | 1 skipped (3636); 775 passed | 5 skipped (780); 145; 55; ratchets OK. Gate 4 rises by your tests; every other gate stays.

## 9. Report

Per step: the answer first; what was built, with file and line; tests and mutants; gates; departures; and a section NOT ESTABLISHED. NOT ESTABLISHED beats a complete invented answer.

## 10. What you could not establish

Say it here, in each report, rather than fill it in.
