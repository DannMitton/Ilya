# Brief: N.135 stage 2b r5, steps 5 to 9, one vowel per note (desk, 2026-10-29, r2)

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


---

## Amendments, applied (r2, desk, 2026-10-29 02:2x). Where this section and anything above it differ, this section wins.

The Opus review standing in for Fable (`review-opus-brief-steps5-9_r1_2026-10-29.md`, 17 amendments, verdict SEND WITH AMENDMENTS) is applied in full below, verbatim, with two desk rulings that override it:

**Desk ruling on amendment 1: option (a).** Repair verses 1 and 2 on bars 2 to 16 and bar 17's first two notes; leave bars 17 and 18's notes as they are (the N.156 «я.» eighth is deliberate, `clitic-seat.test.ts:56-57`); allow-list the note-by-note comparison for bars 17 and 18 with that reason. Map syllabic `start` to `begin` and `whole` to `single`.

**Desk ruling on amendments 10 and 11: step 7A is withdrawn as a behaviour; step 4's fold stays as built.** A clitic the transcription calls a clitic always joins its host, as step 4 does it, and the note the print may have given it is left empty. Reason: a clitic left on its own note is written into `<lyric>` and, on arrival, `seatCliticFolds` (`+page.svelte:2868`) moves every later syllable one note (`:2865-2867`), which is the cascade `CONTRACT.md` §0.1 forbids; folding leaves at most one empty note for the singer to fill. This departs from the desk's 01:3x proposal that Ilya follow a print that gives a clitic its own note. In its place, **count only**: a stat `clitics.ownNote`, using amendment 10's rule (C, H, and the neighbour clause) to say how many folded clitics the print appears to give a note of their own, with each one's page, row, and text in the report. No behaviour depends on it. Amendment 10's tests become tests of the count; amendment 11's report line is dropped.

## Amendments

### 1. Step 8: the fixture and the extract disagree on notes, not only on words (ruling needed)

Evidence (measured with a read-only parse of `git show 1eb05e7:apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`, part P1, against the extract): fixture 97 voice notes, extract 96. Bars 2 to 16 agree in count and pitch. Bar 17: same three pitches (52, 52, 52) but the third onset is 5/4 in the fixture and 9/8 in the extract. Bar 18: fixture 4 notes (54, 50, 50, 50 at 0, 3/8, 1/2, 5/8), extract 3 (54, 50, 50 at 0, 3/8, 1/2). The extra note is the N.156 «я.» eighth (`apps/web/src/lib/score/clitic-seat.test.ts:56-57`: "The fixture now carries «я.» as its own eighth note after an eighth «ка»"). Code's per-bar check fails at bar 18 and it stops, as the brief tells it to.

Replace the paragraph beginning "**Repair `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`**" with, once the desk has ruled, one of:

> (a) "Repair the fixture's `<lyric>` text and `<syllabic>` of verses 1 and 2 on bars 2 to 16 and bar 17's first two notes from the extract. Bars 17 and 18 hold different notes from the extract (fixture 97 notes, extract 96; bar 17 third onset 5/4 against 9/8; bar 18 four notes against three, the N.156 «я.» eighth). Do not change them; allow-list the note-by-note comparison for bars 17 and 18 with this reason, and report."

> (b) "Bars 17 and 18 may change to the extract's notes (onset and count), and only those; report each change. This lifts §6's 'any note of any fixture' for these two bars of this one file."

Desk recommendation: (a); it keeps §6 whole and leaves the note question to Dann. Either way, add: "Map the extract's syllabic values to MusicXML's: `start` to `begin`, `whole` to `single`, `middle` and `end` unchanged" (the extract uses start/middle/end/whole; the fixture uses begin/middle/end/single).

### 2. Step 8: keep the original fixture for the tests that exist to test its breach

Evidence: `clitic-seat.test.ts:1-8` names this fixture as N.111's proof because bar 8 seats «в» alone; `:91-103` expects exactly one fold at `m7-0-1`; `:117` expects 97 cells; `:127` expects the file's «в», «бью», «щем»; `:55-66` builds `truncatedXml` from it. `typed-words-land.test.ts:88` (LIMIT 1) pins the lone «в». Repairing the file in place deletes the only real-file proof of the clitic seat. Add after the repair paragraph:

> "Before the repair, copy the file as it stands to `apps/web/src/lib/score/ingestion/fixtures/sunless-01-finale-lone-v.musicxml`, byte for byte, and point `clitic-seat.test.ts` at the copy. Allow-list the copy in the rule test, naming `clitic-seat.test.ts` and the reason (N.111's proof needs the lone «в»). Every other reader of the fixture reads the repaired file. The approved SVG `apps/web/src/lib/approval/__approved__/sunless-01-engraved.primitive.svg` will change; re-approve it with `vitest -u` (`__approved__/README.md:16-19`) and show the diff in the report."

### 3. Step 8: no truth file is tracked; say which truth the test reads

Evidence: `tools/e16-harness/.gitignore:2` ignores `output/` (checked with `git check-ignore`), and `git ls-tree -r 1eb05e7` holds no `*.truth.json`. "Every tracked truth file" covers nothing. Replace "and every tracked truth file" with:

> "and the truth extracts tracked in the repository (today only `truth-sunless-01-underlay_2026-10-29.json`, once copied beside its fixture). The 16 truth files under `tools/e16-harness/output/truth/` are not tracked (`tools/e16-harness/.gitignore:2`); do not read them from a test."

### 4. Step 8: the vowel check runs on Cyrillic verses; the lone-mark check runs on every verse

Evidence: the fixture's verse 2 is IPA (`sunless-01-engraved.musicxml:433-436`, «#»; extract verse 2 «ˈko», «mnɑ»). An IPA syllable has letters and no Cyrillic vowel, so step 6's check as written reports every IPA note. Add to step 8's first bullet:

> "Run the vowel count on each verse that holds a Cyrillic letter; run the lone-mark check (a note whose text is a mark alone, `#` above all) on every verse, IPA included. Bar 5's lone `#` is in verse 2."

### 5. Step 8: the `n188-markings` path, and what reads it

Evidence: the file is `packages/score-parser/src/fixtures/n188-markings.musicxml`; its only reader is `packages/score-parser/src/n188-markings.test.ts` (slurs, fermatas, arcs: `:61-211`); no test there reads its lyrics. Replace "`apps/web/src/lib/score/ingestion/fixtures/n188-markings.musicxml` (or wherever it is tracked)" with "`packages/score-parser/src/fixtures/n188-markings.musicxml` (read by `packages/score-parser/src/n188-markings.test.ts`)".

### 6. Step 8: provenance needs history the clone may not have

Evidence: the lane21 clone is shallow (`git rev-parse --is-shallow-repository` gives true; `git log` reaches 5 commits; the fixture's log shows only `596930d`). Add to the provenance bullet:

> "Run `git fetch --unshallow origin` (or `--deepen` until `git log --follow` on the fixture reaches its first commit) before writing the edit history; if you cannot, write NOT ESTABLISHED and say why."

### 7. Reaching `origin/Shane` from the cloud lane

Evidence: the clone has only `origin/cloud-lane-21` (`git branch -r`). `git show origin/Shane:...` fails in a single-branch clone. Add to section 0, first sentence:

> "First run `git fetch origin Shane` so that `origin/Shane` exists; the brief, the extract, and the two reports are there."

### 8. Step 5: thread `modern` into the match, and match either spelling

Evidence: `cliticCalls` takes only `words` and `transcribe` (`underlay-seams.ts:51`); `loadSeams` calls it as `(words) => cliticCalls(words)` (`:69`); `modern` is a parameter of `makeSeams` only (`:34`). `modernisePreReform('въ')` gives «в» (`packages/dictionary/src/pre-reform-normalizer.ts:192`, `:280`, `:306`). But the pipeline keeps a pre-reform spelling it cannot resolve (`pipeline.ts:533-537`, `modernisedForm` null when the modern form is unknown), so a modern-only match loses words the raw match finds. Replace the first bullet of step 5 with:

> "Pass `modern` into `cliticCalls` (a third parameter; `loadSeams` passes `modernisePreReform`). A sewn word matches a transcribed word where `lettersOf(cleanWord)` equals the word's own letters or the letters of `modern(word)` (where `modern` gives non-null). Do not strip «ъ» by hand."

And to the expectation bullet add: "The replay's figures came from a different edit (a final «ъ» stripped, replay report §3); a difference from 1,880 / 1,710 is a finding to report, not a failure to tune away."

### 9. Step 5 and step 7: bump the reader stamp

Evidence: `apps/web/src/lib/omr/stamp.ts:36-45`: "Bumped when the reader's output changes, because `isCurrent` compares a kept reading's stamp by equality"; `UNDERLAY_READER = 'underlay@1'`. Steps 5 and 7 change the reader's output. Add to section 7:

> "**The reader stamp** (`omr/stamp.ts:45`, `UNDERLAY_READER`): steps 5 and 7 change what the reader writes, so the step that lands last of them sets it to `underlay@2`, with the comment at `:38-43` extended, and `stamp.test.ts` updated."

### 10. Step 7A: the geometry test misfires on a dense print, and its two clauses disagree

Evidence: `nearestOf` (`underlay-seat.ts:108-112`) is not exported and takes any x list; `seatTokens` seats on free notes only (`:165-166`); `foldClitics` has no notes today (`underlay-clitics.ts:64`) and runs before seating (`underlay-page.ts:182-195`).

Failure cases of the brief's test:
- **Lamm's «В бью» under one notehead, dense bar.** The group is centred under the note, so «В»'s centre lies left of the note by about half the group's width. With eighths close together, «В» is nearer the previous free note. Clause 1 fails (different nearest notes). Clause 2 fails too, because the host's own note lies between the two centres. Result: not folded, a regression from step 4.
- **A print that gives «в» its own note.** Clause 2 then turns on sub-pixel offsets: if the clitic's note sits a pixel left of the clitic centre and the host's note a pixel right of the host centre, "no free note between" holds and it folds against the print.
- The brief's second sentence ("a free note nearer the clitic than to its host, and not shared") is a third, different test. Two engineers would build two different rules.

Replace step 7A's middle sentences ("New: fold it only where ... count it in a new stat `clitics.ownNote`.") with:

> "New: pass the row's free notes (not tied into, not under an extender, as `seatTokens` takes them at `underlay-seat.ts:165-166`) into `foldClitics`. For a clitic, let C be the free note nearest its box centre and H the free note nearest the centre of the unit it would join (the host's first unit for a proclitic, its last for an enclitic). Fold where C equals H, or where C is also the nearest free note of the neighbouring unit on the clitic's other side (the print packs the clitic against its host and its centre drifts onto the neighbour's note). Otherwise the print gives it a note of its own: leave it a unit of its own, as printed, and count it in `clitics.ownNote`. One rule; no other test."

Replace the tests bullet with:

> "Tests for A: (1) «В бью» as one group over one notehead, the «В» centre nearer the previous note than the host's note, the previous syllable nearest that same note: folds. (2) The same group with no near neighbour: folds. (3) «в» centred on a free note of its own that no other unit is nearest, the host on the next note: stays its own unit and is counted. Mutants: fold regardless (step 4) fails 3; the brief r1's 'no free note between their centres' fails 1."

### 11. Step 7A: an unfolded clitic reaches the page's own fold, which moves the tail

Evidence: the reader writes the lone «в» into `<lyric>` (`underlay-words.ts` `writeLyrics`); on arrival the page runs `seatCliticFolds` (`+page.svelte:2868`, and `:2012` for a first transcription), which rewrites the run from the clitic to the end ("rewrote the run from «в» to the end, up to 60 decided notes", `:2865-2867`; `clitic-seat.test.ts:105-120`, a 60-note run). The banner says so (`i18n.ts:386-387`, `clitic.seated`), so it is announced, not silent, but it is a cascade the brief does not name. Add to step 7A:

> "A clitic left on its own note is written into `<lyric>` as printed. On arrival `seatCliticFolds` (`+page.svelte:2868`) folds it and moves every later syllable one note, with the `clitic.seated` banner. Do not change that path (§6). Report, for each `clitics.ownNote` in the integration tests, how many notes that fold would move."

The desk decides whether the order of evidence wants that fold to run on a scan's ownNote clitic; NOT ESTABLISHED here.

### 12. Step 7C: say where `manyVowels` is counted

Evidence: two-vowel units arise in `cutUnits` (`underlay-units.ts:53-65`, the cut that fails, not `:52-56`) before seating; two tokens merge on one note in `oneToANote` (`underlay-words.ts:59-80`, text join at `:74`) inside `sewWords`, after `seatPage` has filled its stats (`underlay-page.ts:208`). Replace "(an engine cut that failed, `underlay-units.ts:52-56`; two tokens merged on one note, `underlay-words.ts:72-75`)" with:

> "(an engine cut that failed, `underlay-units.ts:53-65`, counted on the units before seating; two tokens merged on one note, `underlay-words.ts:69-78`, counted on the seats `seatPage` passes to `sewWords`, `underlay-page.ts:208`; keep the two counts apart)"

### 13. Step 9: there is no blur handler, and a programmatic value is not on the typed-edit undo path

Evidence: the Lyrics field is the textarea in `apps/web/src/lib/components/Drawer/IntakeViews.svelte:225-237`, with `oninput`, `onkeydown`, `onscroll` and no blur. Typed-edit undo is the browser's own textarea history: `historyUndo` and `historyRedo` arrive as input events (`:173-182`, `:189-194`). Setting the value from code fires no input event and does not enter that history. The edit goes up through `oninput` to `handlePoemInput` (`+page.svelte:3984`, `:2362-2365`), which first calls `claimDerivedPoem()`: on a song showing the score's derived words, a blur would claim them. `+page.svelte` is at its ratchet ceiling (5,586 lines, `scripts/ratchets.json`). Replace the "Where" and "Undo" bullets with:

> "Where: a new `onblur` on the textarea in `IntakeViews.svelte:225-237`, Lyrics view only, and only when the converted text differs from the field's text and the field is not showing the score's derived words (`+page.svelte:458`, `derivedPoem`). Add nothing to `+page.svelte` (at its ratchet ceiling, 5,586)."

> "Undo: a value set from code does not enter the textarea's own history, which is what undoes a typed edit (`IntakeViews.svelte:173-182`). Send the change up through `oninput(value, 'paste')` so the app state takes the typed-edit path (`handlePoemInput`, `+page.svelte:2362`). Test in a browser whether Cmd-Z after a blur restores «я #»; report what you see, and do not claim it undoes unless you saw it."

And in the "What" bullet, write the space through `break-glue.ts` (export the converter there, beside `WORD_TOKEN`), so no fourth copy of U+00A0 is made (section 7's "add none").

### 14. Section 7: the vowel letters are computed in more than four places

Evidence (each read at `1eb05e7`): `score/phrase-ends.ts:30` `HAS_VOWEL` (with ѣ, і, ѵ); `score/pairings.ts:871` `vowels`; `syllable-utils.ts:21-23` `CY_VOWELS`; `components/Drawer/InspectorPanel.svelte:534` and `:921`; `components/Paper/WordStack.svelte:67`; plus the four the brief names (`clitic-merge.ts:13-16`, `typed-hyphens.ts:43`, `vowel-resolver.ts:159`, `underlay-units.ts:24-25`). Replace the first bullet's opening with:

> "**Vowel letters** are computed in at least ten places: `CYRILLIC_VOWEL` (`score/vowel-resolver.ts:159`), `VOWEL` and `VOWELS` (`omr/underlay-units.ts:24-25`), `HAS_VOWEL` (`score/phrase-ends.ts:30`), all three with ѣ, і, ѵ; and without them `CYRILLIC_VOWELS` (`clitic-merge.ts:13-16`, `hasVowel`, used at `pipeline.ts:903`), `CYRILLIC_VOWEL` (`typed-hyphens.ts:43`), `CY_VOWELS` (`syllable-utils.ts:21-23`), `vowels` (`score/pairings.ts:871`), and two in `InspectorPanel.svelte` (`:534`, `:921`) and one in `WordStack.svelte` (`:67`)."

### 15. Section 6: `cliticData`'s lines

Evidence: `packages/phonology/src/engine.ts:244` opens `cliticData`; `:289` closes it; `:681` is inside an exceptions list. Replace "`packages/phonology/src/engine.ts:244-681`" with "`packages/phonology/src/engine.ts:244-289`, with the derived sets at `:2256-2262`".

### 16. Section 8: three files sit at their ratchet ceilings

Evidence: `scripts/ratchets.json` ceilings equal the files' lengths at `1eb05e7`: `+page.svelte` 5,586, `pipeline.ts` 925, `score/pairings.ts` 1,422. Add to section 8: "`+page.svelte`, `pipeline.ts`, and `score/pairings.ts` are at their ceilings; a line added to any of them fails the ratchet gate."

### 17. Step 9: cite the attach rule where it is

Evidence: `syntactic-break.ts:28-32` states the rule (a leading or lone `#` belongs to the word before it; a U+00A0 before `#` goes with it); `:41-49` applies it. Replace "`:27-36`" with "`:28-32`, applied at `:41-49`".

