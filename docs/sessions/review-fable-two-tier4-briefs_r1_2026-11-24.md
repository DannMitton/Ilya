# review-fable-two-tier4-briefs_r1_2026-11-24

Review by Fable of two tier 4 Code briefs, before either goes to a lane (Dann's ruling of 2026-10-19 20:32). Tree: `Shane` at `50315f2e` (ran, `git rev-parse HEAD`). Nothing in the repository was changed except this file. No subagent, no gate, no test was run: vitest does not start on the bridge, so every behaviour claim here is by reading unless it says "ran".

**Briefs reviewed.**
- `brief-code-arrival-seam-closes-up_r1_2026-11-24.md`, as it stood after the desk's second correction (md5 `7c3648ad`). Called "the arrival brief" here.
- `brief-code-corrections-keeps-what-she-did_r1_2026-11-24.md` (md5 `217c1af9`). Called "the Corrections brief" here.

**Path prefixes.** `W/` is `apps/web/src/lib/`. `P/` is `apps/web/src/routes/+page.svelte`. `C/` is `docs/memory/CONTRACT.md`.

**Terms.** Adopted from the tree: fold, seat, run, cell, slot, queue, continuation. Coined here: "the struck departure" and "the count-only ruling" (two desk acts of 2026-10-29 that the arrival brief treats as one), "residue" (a breach the fold cannot repair).

---

## Verdicts

| Brief | Verdict |
|---|---|
| The arrival brief | **DO NOT SEND.** Four blockers. |
| The Corrections brief | **SEND WITH AMENDMENTS.** Six amendments, none of them a redesign. |

---

## 1. The arrival brief

### 1.1 The one judgement it rests on: the desk has over-read CONTRACT 0.1

**The brief's claim (lines 13 to 15):** `C/` 0.1 has struck the desk ruling that competes with Dann's of 2026-09-04, and "that removal has not happened", the departure being "live" at `W/omr/underlay-clitics.ts:41-48`.

**What the tree says. Two different desk acts of 2026-10-29 are being read as one.**

1. **The struck departure.** `C/:11` strikes "the desk departure of 2026-10-29 (`underlay-clitics.ts:28-33`)". At the commit before the removal (`d6db949a`, ran: `git show`), lines 28 to 34 of that file read: "A DELIBERATE DEPARTURE from `buildSlotQueue` ... here a vowelless word the transcription does not call a clitic stays a unit of its own, because on a scan such a token is often a misread letter". The removing brief quotes the same words (`brief-code-n135-scan-vowelless-and-far-tokens_r2_2026-11-02.md:11`, `:22`). **That removal has happened**: commit `6c3f0556`, 2026-11-02, "N.135 step 1: a vowelless unit takes no note on the scan path". The file says so at HEAD: "This replaces the desk departure of 2026-10-29 (a vowelless word the transcription did not call a clitic stayed a unit of its own), which broke §0.1" (`W/omr/underlay-clitics.ts:36-38`).
2. **The count-only ruling.** "COUNT ONLY, step 7 (desk ruling 2026-10-29 02:2x ...): a clitic the transcription calls a clitic ALWAYS joins its host, and the note the print may have given it is left empty" (`W/omr/underlay-clitics.ts:41-44`). It stood in the same header beside the departure at `d6db949a` (lines 36 to 47 there) and was left standing by `6c3f0556`. **`C/` 0.1 does not name it and does not strike it.**

**So the brief's line 13 quotes a sentence about act 1 as authority against act 2, and its line 15 says a removal "has not happened" that happened on 2026-11-02.** Both statements are false as written. The citation `:41-48` is real and does hold the words quoted; it is the wrong act.

**Does the conclusion fall with the argument? No, and that matters.** Dann's ruling of 2026-09-04 (the clitic's note takes the fused slot and the tail closes up) is in the tree in his words (`W/score/clitic-seat.ts:23-28`, `:445-447`; `W/score/score-seat.ts:43-45`). Dann 2026-11-02 14:34 calls a bare sung note a mistake (`C/:11`). Dann 2026-11-24 02:29 is now in `C/:11` (uncommitted, read from the working tree). A desk ruling does not outrank three of his. **The close-up governs on the file path; the brief reaches it by a false step.** A lane that reads "that removal has not happened" and "the departure is live at `underlay-clitics.ts:41-48`" may go and remove the count-only block from the scan reader, which no item orders.

**One more thing the over-read hides.** The count-only ruling gives its own reason: on arrival `seatCliticFolds` "moves every later syllable one note, the cascade `CONTRACT.md` §0.1 forbids" (`W/omr/underlay-clitics.ts:44-46`). `C/:11` forbids a SILENT cascade in the scan path's order of evidence ("never cascades silently"). The brief orders a silent close-up of a whole song. That tension is answered by Dann's 02:29 words and by 2026-09-04, and the brief has to say so in terms, because it is the first objection a careful lane will raise.

### 1.2 Blockers

**B1. The governing-ruling section is false in two sentences (1.1).** Replace lines 13 to 19 with the true ground: Dann 2026-09-04, Dann 2026-11-02 14:34, Dann 2026-11-24 02:29; the count-only ruling named as a desk ruling of the scan path that this lane does not touch; the struck departure not mentioned at all.

**B2. The done-when cannot be met on the fixture the brief names.**
- `sunless-01-finale-lone-v.musicxml` carries 97 sung notes in its voice part, and 97 verse-1 syllables counting the lone «в» (ran: a count of `<note>` and `<lyric number="1">` in part `P1`). The repaired `sunless-01-engraved.musicxml` carries 96 and 96 (ran, same count; `W/score/row108.support.ts:43-44` says 96).
- After the fold, the copy holds 96 units on 97 notes. Closing up leaves its last sung note with no syllable, and that note is not a continuation. The seat's own comment says so of this fixture: "after the repair one note has no syllable left" (`W/score/clitic-seat.ts:323-325`).
- The copy's bars 17 and 18 also differ from the repaired file in their notes, not only their text (ran: bar 17 is half, rest, half, half in the copy and half, rest, quarter, quarter in the repaired file; bar 18 holds four notes against three).
- **So "No note in that result carries no syllable, and the new check says so" (line 56) is false for the lane's own fixture, and "the page matches the print" (line 9) is false for its last two bars.** A lane held to line 56 has three ways out and all are wrong: invent a syllable, drop a note, or mark the last note a continuation.

**B3. Item 1 replaces the ruled mechanism with a cruder one and does not say so.**
- The ruled repair exists: `seatCliticFolds` (`W/score/clitic-seat.ts:455-465`). It is bounded by five conditions (`:242-258`), ends its run where the file and the queue re-align (`:289-304`), leaves an unreachable note undecided and never `empty` (`:42-44`, `:326-329`), and carries punctuation by Dann's ruling (`:351-352`). The comment calls the limit "the other half of the same ruling" (`:33-40`).
- Item 1 orders "every later syllable in that voice closes up by one note" inside `foldVowelessSyllables`, which reads the file's cells alone and has no queue (`W/score/ingestion/vowelless-fold.ts:83-142`). That is an unbounded shift with none of the five conditions.
- The unit read proposed the other route: "If ruling 1 governs, the arrival fold must leave a proclitic for the seat" (`read-fable-n204-unit-f_r1_2026-11-24.md:39`). The brief chose differently and gives no reason.
- **Undecided in the brief, each of which moves real syllables:** (a) whether the shift is by lyric-bearing cell, as the seat's is (`W/score/clitic-seat.ts:314-318`), or by note, which would put a syllable on a melisma note; (b) what bounds it, since a file whose engraver re-aligned by hand after one phrase would have every later phrase pulled one note early; (c) the other verses: the fold repairs each Cyrillic verse alone and leaves an IPA verse untouched (`W/score/ingestion/vowelless-fold.ts:24`, `:101-102`), and the copy's verse 2 is IPA and shifted with verse 1 (ran: bar 16 reads «Вот» over `jɑ`), so the two verses part by one note after the lane; (d) a vowelless syllable that is no clitic («знь» in `n188-markings`, `W/score/ingestion/fixture-rule.test.ts:458-463`), which today joins leftward (`W/score/ingestion/vowelless-fold.ts:15-17`): does its tail close up too; (e) a vowelless syllable with no host, today undrawn (`:20-21`, `:120`).
- **Section 8 is in play.** "Do not let Ilya propose a deliberately empty note" (`C/:175`): today's fold breaks it on every clitic, the brief's fold breaks it once at the tail (B2), and the seat's undecided-and-blanked note is the only form Dann has walked (`W/score/clitic-seat.ts:101-108`).

**B4. Item 2 asks for a continuation test the file path cannot make.**
- The check wants "tied into, under a slur's melisma, under an extender" (line 37). A parsed event carries `tied` and `slurs` and nothing about an extender (`packages/score-parser/src/types.ts:502-506`, `:530-531`); the type says melismas "are encoded by absence of syllable" (`:508-517`). The parser reads no `<extend>` (`W/omr/extend-convention.ts:17-19`). `slurs` is MusicXML only (`types.ts:530`). The test suite's own count calls slur interiors "a later row" (`W/score/ingestion/fixture-rule.test.ts:82`).
- The lane may not change `VocalLineEvent` (brief line 63; `C/:174`). **So on an ordinary authored file every melisma note drawn with an extender and no slur would be counted as a bare note**, and on MNX every melisma note. The count would be noise on correct files, which is the opposite of "a breach that survives is the finding" (line 39).
- The same paragraph says the check "refuses" three things and then that "it counts and reports; it does not silently rewrite". A lane cannot do both. `C/:11` uses "refuses" for the writer (the fold, which does not write the syllable) and "counted" for the bare note.
- "Reports its breaches by the same mechanism the scan path uses" names nothing a file path has: the scan path fills `stats.counted.breaches` (`W/omr/underlay-page.ts:424`) and one console sentence reads it (`W/omr/underlay-reader.ts:68-74`). The file path's own precedent is one `console.warn` (`W/score/ingestion/ingest.ts:372`).

### 1.3 Citations, every one

| Brief line | Citation | Finding |
|---|---|---|
| 7 | `W/score/ingestion/fixture-rule.test.ts` fails a tracked file that breaks the rule, with an allow-list | **Real** (`:7-13`, `:142-159`, `:206-211`) |
| 7 | the copy holds the lone «в» and the repaired file does not | **Real** (ran: bar 8 of each) |
| 13 | the sentence quoted from `C/` 0.1 | **Real and verbatim** (`C/:11`). **Misapplied** (1.1) |
| 15 | `W/omr/underlay-clitics.ts:41-48`, the words quoted | **Real** (`:43-44`). **Not the struck departure** (1.1) |
| 17 | Dann 2026-11-02 14:34 and 13:46 | **Real** (`C/:11`) |
| 25 | `vowelless-fold.ts:83`, `:115-122`, `:18-19` | **Real**, all three |
| 27 | `pairings.ts:224-226` and `:241` build the joiner | **Stale.** The enclitic joiner is `:223-224`; the proclitic's is `:227`; `:241` is `ipa: piece.ipa`. The brief copied `C/:11`'s own stale citation |
| 31 | `#` is an enclitic, never alone | **Real** (`C/:11`). **But already done:** `foldDictionMarks` runs first (`W/score/ingestion/ingest.ts:337`, `:355-360`), closes the gap it opens (`vowelless-fold.ts:18-19`), and the vowelless fold leaves `#` alone (`:22`). The line orders nothing and invites a second handling |
| 35 | `vowels-per-note.ts:73`, `underlay-page.ts:424`, `poem-join.ts:227`, and no call on the file path | **Real** (ran: `grep`, tests excluded) |
| 43 | `clitic-seat.ts:455-465`, `:268-269` | **Real** |
| 43 | "Its callers are `P/:561`, `:687`, `:690`, `:2007`, `:2730`, `:2874`" | **One wrong.** `P/:561` calls `findCliticFolds`, which feeds the blank channel (`P/:560-569`). The other five call `seatCliticFolds` |
| 43 | "After item 1 no such cell reaches it" | **True today already**, before item 1 (`read-fable-n204-unit-f_r1_2026-11-24.md:36`). Item 3 does not depend on item 1 |
| 49 | `row108.support.ts:37-40`, `:43-49` | **Real** |
| 49 to 51 | no test takes the copy through the arrival seam, so a new characterization test is the first step | **False.** `W/score/ingestion/fixture-rule.test.ts:447-456` runs the copy through `ingestScoreFile` and pins today's result: the clitic's note null, the host fused, "Nothing after the host moved" (`:454-455`). `W/score/ingestion/vowelless-fold.test.ts:19` pins the same on a built score. What is true is narrower: the CLITIC SEAT's tests never pass the seam |

### 1.4 The coordinator's two questions

**First: where the brief still reads as though the print could be the source.**
- **Line 55:** "A file whose print gives a clitic its own note". Rewrite as "a file that gives a vowelless token a note of its own".
- **Line 15:** the quoted "the note the print may have given it". It is a true quotation of a comment written under the old premise; it goes out with B1.
- **Line 9** is sound on the premise and wrong on the fixture's last two bars (B2).
- Item 1, item 2, item 3, and the title carry no such reading.

**Second: what a singer meets when she drops such a file in herself. Count and carry on, or tell her.**

**My view: open the song, repair the clitic class without a word, count the residue where a developer reads it, and tell her nothing in this lane.**
- Dann ruled the silence itself. On his walk of `c574cf8`, 2026-09-04, the sentence that reported the seat and its Undo left Corrections on his instruction: "I'm not crazy about the idea of that courtesy warning we give about Ilya having concatenated a clitic... I think it's unnecessary" (`W/score/clitic-seat.ts:433-437`). And the same day: "You are complicating things for the user with a situation that is impossible in music notation" (`:24-27`).
- Refusing the file fails her outright: it is likely the only file she has, and the fault is one Ilya can repair.
- The residue shows itself. A note with no syllable under it is on the page, and the order of evidence gives her the last step: "as a last resort the user can repair anomalies" (`C/:11`). Section 8 forbids a mark that says Ilya is unsure (`C/:170`).
- Any sentence to her is a string, and strings are Dann's.

**The strongest argument against it.** The close-up is the one repair in Ilya that moves text she did not touch across a whole song on an inference about a file fault, and the fault is not always the simple one: the lane's own fixture carries an extra note and re-written rhythms in its last two bars (B2), and a file re-aligned by hand part-way would be pulled out of line from that point on. She trusts the page, there is no Undo for the seat any more (`W/score/clitic-seat.ts:430-440`), and a study score silently wrong for sixty notes costs more than one line of text would. **I hold my view on one condition, and it is B3: the shift is bounded as the 2026-09-04 seat bounds it, so that Ilya moves only what it can account for.** With an unbounded shift, the argument against wins and she would have to be told.

### 1.5 Strings and the done-when

- **Strings.** None is needed if the count goes to the console. The guard at line 63 is right.
- **Done-when.** Line 55 describes intent; line 56 is unmeetable (B2); line 59 names families 1 to 5 of a baseline that is not committed yet, so its reach is NOT ESTABLISHED. **A measurable replacement exists in the tree:** after arrival, the copy's verse 1 equals the repaired file's verse 1 note for note through bar 16 (`W/score/ingestion/fixture-rule.test.ts:15-20` already compares a fixture with its truth extract that way), and the count of non-continuation notes with no syllable is stated as a number for the copy, with the tail note named.
- **No step narrows Dann's ask as written.** B3's unbounded shift widens it past what he ruled.

### 1.6 What r2 needs, in order

1. Rewrite the governing-ruling section on the true ground (B1).
2. Choose the mechanism and say why: the seat that exists, fed by a fold that leaves it its clitic, with a fallback for a file the seat refuses; or a fold that closes up, carrying the seat's bounds. **Recommendation: the first.** It is Dann's walked behaviour, it has the queue to supply the tail, and it costs a smaller change. Its cost: between ingest and seat the parsed score carries a lone «в», which every other reader then sees (`W/score/ingestion/vowelless-fold.ts:5-7`), so the fallback is not optional.
3. Answer B3 (a) to (e) in the brief.
4. Replace line 56 and line 55 (B2, 1.5).
5. Restate item 2 with the continuation evidence a file has (ties, MusicXML slurs), a third bucket for "cannot tell", the word "counts" and never "refuses", and the console as the place (B4).
6. Change the existing test at `fixture-rule.test.ts:447-456` and `vowelless-fold.test.ts:19` in the behaviour commit; order no new characterization test.
7. Strike line 31 or say it is already done. Correct `P/:561` and the `pairings.ts` lines.
8. Add to the report-only item: a song saved under each earlier arrangement (seat in the map before 2026-11-02; fold with a bare note since) reopens how. `seatCliticFolds` is written to be safe on a restore (`W/score/clitic-seat.ts:449-453`); what a changed fold does to a stored map keyed by note id is NOT ESTABLISHED.

---

## 2. The Corrections brief

### 2.1 Citations, every one

| Defect | Citation | Finding |
|---|---|---|
| 1 | `tuplet-row.svelte.ts:14-18`, `:76-80`, `:60-68` | **Real**, all three |
| 1 | `P/:1405`, `:4508` | **Real** (`tuplet.close()` in `dismissLoupe`; `onclosetuplet={tuplet.close}`) |
| 1 | the case named in `tuplet-row.test.ts` | **Real** (`:149`) |
| 2 | `correction.ts:483-491`, `:544`, `:550`, `:564`, `:553-560`, `:889-905`, `:469`, `:545` | **Real**, all eight |
| 3 | `correction-verbs.svelte.ts:352-362`, `:352-354` | **Real** (the lookup is `:356-359`) |
| 3 | `correction.ts:809-811` | **Real** |
| 3 | `P/:898` sets the selection to null | **Wrong line.** `:898` is `clef: () => scoreClef`. The write is `P/:896`, `selectEntry: (id) => (stationCursor.selectedEventId = id)`. The unit read carries the same slip |
| 3 | `P/:4514` | **Off by one.** The condition is `P/:4513`; `:4514` is the `<Loupe` tag |
| 3 | `correction-verbs.test.ts:235-241` | **Real** (the case is `:233-242`) |
| 4 | `entry.ts:256-276`, `:307-310` | **Real** |
| 4 | `correction.ts:368-399`, `:426-430` | **Real** |
| 4 | `correction-verbs.svelte.ts:332-339`, `:214-217` | **Real** |
| 4 | `P/:827`, `:983` | **Real** |
| 5 | `key-signature.ts:49`, `:50-51`, `:4` | **Real** |
| 5 | `rebar.ts:156-166`, `:28-29` | **Real** |
| 5 | `key-signature.test.ts` holds no "deleted" | **Real** (ran: `grep -c` gives 0) |
| all | the six test files named | **All exist** (ran: `ls`) |

**The "ran" claims in the brief are the unit read's, made on copies under plain Node. I did not re-run them.** Each mechanism they rest on reads as the brief says.

### 2.2 Does each repair fix its defect

**Defect 1: not fully. Amendment A1.** "Key `#base` to the taken entry" clears the case the read ran (tuplet on `n0`, pitch on `n5`, apply on `n3`). It does not clear this one: tuplet on `n0`, pitch on `n5`, back to `n0`, nudge. The entry is the same, the base is the old map, and `applyTuplet(this.#base, ...)` writes over the pitch on `n5` (`tuplet-row.svelte.ts:76-80`). An Undo pressed with the row open leaves the same stale base. **The defect's heading is "and everything done between them"; an entry key answers half of it.** The sound test is whether the map is still the one the row last wrote: keep that map, and start a fresh base and a fresh undo step when the entry differs OR `corrections()` is no longer it. The fresh step reuses `loupe.undo.tuplet` (`:78`), so no new string.

**Defect 2: yes, with the wording tightened. Amendment A2.** "As `carried` already does" points at the wrong thing: `carried` holds grace notes MADE FULL (`correction.ts:462-469`, `:545`), and a read grace note that is still a grace note is in no line and is carried nowhere (`:483-484`). The repair that follows the stated principle at `:554-557` ("the singer deleted the reader's note, not their own work") is to emit, in the not-standing branch (`:553-560`), the entries hung on that principal's read grace notes as well as its own. Name the expected line in the brief: `a, hand:1, c`.

**Defect 3: yes. Amendment A3.** "For every entry" changes two things beyond the defect, both by reading: after deleting an ordinary note the selection may now land on a grace stop or on a hand-added note, where today it skips both, because the drawn line holds them (`correction-verbs.svelte.ts:355-356`). Probably better; it is a change, so the test names it.

**Defect 4: the repair narrows the ask. Amendment A4.** The defect is "a press that changes nothing still leaves a correction behind". The brief names tie, rest, and a same-length press. By reading, the same record is left by:
- a dot turned on and off: `handleDot` writes `dots: on ? 0 : 1` (`correction-verbs.svelte.ts:341-346`), and `withCorrection` prunes only a field that is `undefined` (`correction.ts:383-398`), so `{ dots: 0 }` stays;
- a pitch stepped up and back: `handleStep` writes `{ pitch: next }` (`:268-273`), so the read's own pitch stays as a record. `withCorrection`'s comment promises the opposite, "a singer who nudges a note up and back down leaves no correction behind" (`correction.ts:368-370`), and the code does not keep that promise;
- a length changed and changed back (`:332-338`).
**I did not run these three.** If the lane confirms them, they are the same defect and belong in the same commit, with the comparison against the read in one place; if it does not, the brief says why they are out.
One judgement inside it, the desk's: a read rest made a note and back keeps a remembered pitch on purpose (`entry.ts:252-254`, `:272`). Pruning that record loses the memory; keeping it leaves Restore lit. **Recommendation: prune.** A second toggle costs her one pitch choice; a lit Restore on an untouched rest tells her something false.

**Defect 5: yes.** Low risk. `rebar.ts` treats a note made a grace note as it treats a deleted one (`rebar.ts:149-150`, `:159`); "as the time signature layer does" covers that, and the brief can say so. Amendment A5: the lane may add a fourth copy of the carry walk and may not merge the three that exist (the read's F2-4 is tier 2), since "Refactor" is forbidden at brief line 56.

### 2.3 CONTRACT 0.1 and section 8

**No conflict.** No path in the five repairs writes text to a note. None touches `reconciliation/`, `VocalLineEvent`, or `analyzePerVerse`, and the brief forbids all three. Nothing derived is stored. No control goes on the paper.

### 2.4 Strings

**None needed.** Defect 1 reuses `loupe.undo.tuplet`. Defects 2 to 5 add no sentence. The stop-and-report guard at brief line 51 stands.

### 2.5 The done-when

Measurable for all five: each has a named test. Two notes.
- **Amendment A6.** Defect 3's "confirm it on the page before and after" is the only look in the brief (`C/` 0.3). It needs a named place for its evidence in the lane's report, and a cloud lane's means of seeing the page is NOT ESTABLISHED here; if it has none, the confirmation is the desk's or Dann's on the walk and the brief says so.
- Families 1 and 4 of the behaviour baseline are named before the baseline is committed; their reach is NOT ESTABLISHED.

### 2.6 The amendments, in brief

- **A1.** Defect 1: a fresh base when the entry changes or when the map is no longer the one the row last wrote. Two test cases: the read's, and "back to the same note".
- **A2.** Defect 2: emit the read grace notes' entries in the not-standing branch; expected line `a, hand:1, c`; strike "as `carried` already does".
- **A3.** Defect 3: the test also states where the selection lands beside a grace stop and beside a hand-added note.
- **A4.** Defect 4: widen to dot, pitch, and length round trips after the lane confirms each; one comparison against the read; the rest-memory case ruled by the desk.
- **A5.** Defect 5: a note made a grace note carries the mark too; a fourth copy of the walk is accepted in this lane.
- **A6.** Correct `P/:898` to `P/:896` and `P/:4514` to `P/:4513`; say who looks at the page for defect 3.

---

## 3. What I could not establish

1. **Any behaviour by running.** Vitest does not start on the bridge. The three extra cases of A4, the "same note" case of A1, and the tail note of B2 are by reading and by counting the fixture's XML.
2. **The behaviour baseline's families.** `cloud-lane-86`'s baseline is not in the tree.
3. **What a changed arrival fold does to a stored song** (1.6, item 8).
4. **Whether a cloud lane can look at the page** (A6).
5. **Token spend.** A subagent cannot read its own meter. My estimate is about 170,000 of the 420,000 cap.

## 4. Corrected errors in this review

None reported yet.
