# Review: brief N.135 stage 2b r5, steps 5 to 9 (Opus in Fable's place, 2026-10-29, r1)

Brief read: `docs/sessions/brief-code-n135-stage2b-r5-steps5-8_r1_2026-10-29.md`, md5 `b53fada53931a1a348ff33349bcf8462` (matches b53fada5). CONTRACT §0 and §0.1 read in full. Tree read at `1eb05e7` with `git show` in the lane21 clone; nothing in it was changed. Every file:line below was read in this session at `1eb05e7` unless marked otherwise.

## Verdict

**SEND WITH AMENDMENTS for steps 5, 6, 7, and 9. DO NOT SEND step 8 until the desk rules on amendment 1.** Step 8 as written stops at its own pre-check: the fixture and the extract do not hold the same notes, so "change only the `<lyric>` ... never a note" cannot be met. The other amendments fix wrong citations, close two-engineer ambiguities, and name cross-sites the brief misses, two of which change behaviour (the reader stamp; the page's clitic fold cascading the tail).

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

## Checked and found as the brief says

`underlay-seams.ts:34`, `:42`, `:56`; `score/vowel-resolver.ts:159`; `omr/underlay-units.ts:24`; `underlay-units.test.ts:16-19`; `underlay-seat.ts:108` (`nearestOf`); `sunless-01-engraved.musicxml:10` (`musx2mxl 0.2.9`), `:435` and `:1643` (a lone `#` in verse 2); `text/break-glue.ts:15` (`WORD_TOKEN` reads «я #на» as one token, so the «я #на» carve-out is needed); `pipeline.ts:777-788`; the three U+00A0 copies (`score/pairings.ts:62`, `score/clitic-seat.ts:66`, `omr/underlay-clitics.ts:41`); `clitic-merge.ts:13-16` lacks ѣ, і, ѵ; `typed-hyphens.ts:43`. The six rows of step 5 match the replay report §3.

Step 9's regex scope, as the brief states it (U+0020 or tab only, `#` followed by whitespace, line end, text end, or `#`, «я #на» left alone), fuses no two words under `WORD_TOKEN` (`break-glue.ts:15`) or `WORD_SPLIT` (`:12`), and every split on `\s` (`same-words.ts:31`, `library/songs.ts:54`) still splits «я #» after stripping `GLUED_MARK` first. Its "no change to any seat" holds where the word grid is unchanged: `reseatAcross` returns at once on an unchanged diff (`+page.svelte:2072`). Whether the diff is unchanged for «я #» against «я #» was not run; the test the brief asks for settles it.

## NOT ESTABLISHED

- Whether `poem-compare.ts`'s colouring of the Lyrics field changes when «я #» becomes one token (`text/poem-compare.ts:40`, `:113`); the field's highlight only, not the Text view. Not run.
- Whether Cmd-Z restores «я #» after a programmatic change in any browser. Not run.
- How far, in pixels, a Lamm «В» centre sits from its host's notehead on the A2 captures; the failure case in amendment 10 is argued from geometry, not measured.
- Whether the order of evidence wants `seatCliticFolds` to run on a scan's ownNote clitic (amendment 11). A ruling, not a fact.
- Whether `omr/` is barred from importing `score/` by a lint rule. No rule found; the bar is a comment (`underlay-clitics.ts:15-18`, stage 2a review amendment 4), and `omr/restore.ts:18` and `omr/scan.ts:18` already import `$lib/score/`.
- Why the fixture's bar 17 is overfull (half, quarter rest, half, half in 12/8 at divisions 16 sums to 112 against 96). Read, not explained.
- The 11 e2e files that read the fixture (`apps/web/e2e/`, `e2e-phone/`): which of them pin lyric text. Not read.

Tokens used: about 130k.
