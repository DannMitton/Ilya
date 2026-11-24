# review-fable-arrival-seam-r2_r1-delta_2026-11-24

Delta review by Fable of `brief-code-arrival-seam-closes-up_r2_2026-11-24.md` against the four blockers of `review-fable-two-tier4-briefs_r1_2026-11-24.md`. Tree: `Shane` at `50315f2e` (ran, `git rev-parse`). Nothing in the repository was changed except this file. No subagent. No test was run: every behaviour claim is by reading unless it says "ran".

**Path prefixes.** `W/` is `apps/web/src/lib/`. `P/` is `apps/web/src/routes/+page.svelte`. `C/` is `docs/memory/CONTRACT.md`. `F/` is `W/score/ingestion/fixtures/`. "r2:N" is line N of the brief.

**Terms.** Adopted from the tree: fold, seat, run, cell, slot, queue, continuation, blanked. Coined here: "the refused state" (what a note holds after item 4 declines a repair).

## Verdict

**DO NOT SEND.** One of the four blockers is answered. Three new blockers, all of them inside item 4 and the done-when. Items 1 to 3 are close and need amendments only.

## 1. The four blockers

| Blocker | State | Where in r2 |
|---|---|---|
| B1, the governing ruling | **ANSWERED** | r2:7. It matches `W/omr/underlay-clitics.ts:36-39` (the replaced departure) and `:41-46` (the count-only ruling, standing), and `C/:11` as now worded. |
| B2, the done-when cannot be met on the fixture | **NOT ANSWERED** | r2:52 puts a rule in place of a special case, and that rule refuses the fixture's only repair (section 3). r2:56 and r2:57 then ask for the repaired state. |
| B3, the cruder mechanism | **NOT ANSWERED, in part** | The bound is answered: r2:8 and r2:48 keep the five conditions. Of the five open points: (a) and (b) follow from the bound; (c) is r2:50, resting on a fact that is wrong (section 2); (d) a vowelless syllable that is no clitic and (e) one with no host are not answered and are made worse (N2). Where the mechanism lives is not said (N3). |
| B4, the continuation test | **NOT ANSWERED, in part** | The extender is answered by item 1 (r2:24-26). "Counts, never refuses" is answered at r2:42. Three parts stand: r2:42 repeats "the mechanism the scan path uses", which a file path does not have (`W/omr/underlay-page.ts:424` fills a scan's `stats.counted.breaches`; the file path's precedent is `console.warn` at `W/score/ingestion/ingest.ts:372`); MNX carries no slurs (`packages/score-parser/src/types.ts:530`), so an MNX melisma note is still counted bare; no "cannot tell" bucket. |

r1's citation errors are corrected (r2:9, r2:10). `P/:561` is `findCliticFolds` (read); the five `seatCliticFolds` calls are `P/:687`, `:690`, `:2007`, `:2730`, `:2874` (ran: `grep`).

## 2. The desk's measurement

Ran: a Python `ElementTree` walk of part `P1` ("Bass") of `F/sunless-01-finale-lone-v.musicxml`.

| Claim (r2:16) | Result |
|---|---|
| 97 sung notes | **Holds.** 116 `<note>`, 19 rests, 97 sung. No grace note, no chord note. |
| every one carries a lyric cell | **Holds.** 97 carry `<lyric number="1">`, 97 carry `<lyric number="2">`, none carries neither. |
| zero `<extend>` | **Holds.** 0 in the whole file. Also 0 slurs and 0 tie stops on the voice part. |
| the IPA verse treats «в» and «бью» as one unit | **Holds.** Bar 8, second note: «бью» over `ˈvʲbʲu`. |
| the IPA verse "sits one note later than the Cyrillic all the way to the end" | **Does not hold.** |

**What the second verse does, note by note (index from 0):**
- Notes 0 to 17: the two verses agree.
- Note 18 (bar 5, first note): the IPA verse holds `#` alone on a note, under «тень». From there the IPA is one note LATE against the Cyrillic, through note 36, where `jɑ` sits under the lone «в».
- Notes 37 to 78 (bar 8 «бью» to bar 15, first note): the two verses AGREE again. The Cyrillic's spent note on «в» and the IPA's spent note on `#` cancel.
- Note 79 (bar 15, second note): a second `#` alone on a note. From there the IPA is one note late again to the end.
- The IPA verse holds 95 syllables and two `#` cells. `kɑ` is absent: bar 18 reads «ди но ка я.» over `ɑ dʲi ˈno jɑ`. The repaired file has it (`F/sunless-01-engraved.musicxml`, bar 18: «ка» over `kɑ`, ran).

**So the second verse is not a clean witness.** It fuses the clitic, and it also breaks section 0.1 twice on its own account (`#` alone on a note, `C/:11`) and is one syllable short. The file's faults are three, not one. r2:14 to r2:20 hold in their main point (the file has no bare note; `W/score/ingestion/vowelless-fold.ts:115-122` makes one). r2:50 and r2:56 rest on the part that does not hold.

Whether `foldDictionMarks` (`packages/score-parser/src/diction-marks.ts:141`, not read) repairs a `#` in an IPA verse and closes its gap: NOT ESTABLISHED. If it does, the IPA verse arrives at the repaired file's alignment through note 94 and leaves notes 95 and 96 bare in that verse.

## 3. Item 4, "refused and counted": is it executable

**The predicate exists.** `foldAt` returns `blanked`, the notes of the run the queue cannot reach (`W/score/clitic-seat.ts:323-329`). "A repair would leave a note without a syllable" is `blanked.length > 0`, inside the run. Outside the run nothing is touched (`:375-380`), so "any note of the song" reduces to it.

**New blocker N1. On the lane's own fixture the rule refuses the repair, and the done-when asks for the repair.**
- The run opens at the clitic's cell and stays open to the last note (`:289-304`). By the count in section 2 that is cells 36 to 96, 61 cells. The queue from the fused slot is 60 slots, if the pipeline's queue is the repaired file's 96 units (an inference from `W/score/row108.support.ts:43-44`; not run). One note is blanked. The seat's own comment says so of this fixture (`:323-325`).
- r2:52 then refuses. r2:56 ("every sung note of both verses carries one vowel") and r2:57 cannot be met either way: 97 notes, 96 Cyrillic units, 95 IPA syllables.
- r2:56's second half ("the Cyrillic verse agrees with the IPA verse note for note") cannot be met at all: the IPA verse has no `kɑ`.
- "One vowel" in an IPA verse has no check in the tree: `vowelsPerNote` counts Cyrillic vowel letters and applies to a Cyrillic verse (`W/omr/vowels-per-note.ts:67-70`, `:90-92`).

**New blocker N2. The refused state is forbidden by section 0.1.**
- r2:48: a refused candidate is "left as the file has it". For this fixture that is «в» alone under a note.
- `C/:11`: "No path, brief, desk, or helper may write a syllable without a vowel under a note, for any reason", and of the lone token, "It is never represented faithfully".
- It also fails two standing tests the brief forbids rebuilding (r2:65): `W/score/ingestion/fixture-rule.test.ts:443-445` (no vowelless syllable under any note of any tracked file, no allow-list) and `:458-463` («знь», which today's fold joins leftward as "any other vowelless syllable", `W/score/ingestion/vowelless-fold.ts:15-17`, and which condition 2 would refuse if the pipeline does not call it a clitic; whether it does is NOT ESTABLISHED).
- **The repair:** the refused state is today's fold (fused to the host, the clitic's note with no syllable, `vowelless-fold.ts:115-122`), counted by item 3 as `no-syllable`. That is the fallback r1 section 1.6 item 2 called not optional.

**New blocker N3. The five conditions cannot be applied where r2:46 puts them.**
- Conditions 2, 4, and 5 are read off the pipeline's words and the slot queue (`W/score/clitic-seat.ts:260-265`, `:272-287`), built by `processText` (`:47`, `:467-470`).
- `foldVowelessSyllables` takes a `ParsedScore` and nothing else (`vowelless-fold.ts:83`), and the import lines of `ingest.ts` read this session (`:19-30`) hold no pipeline.
- The seat writes a `PairingMap` (`clitic-seat.ts:382-393`); the fold rewrites the `ParsedScore`. r2 does not say which object the close-up is written to, whether ingestion may run the pipeline, or what the five page calls do afterwards (double seat, or nothing left to seat).
- **Recommendation, unchanged from r1:** the fold leaves the seat its clitic where `findCliticFolds` finds a fold with `blanked` empty, and applies today's fold everywhere else. That keeps the five conditions in the one place they are written.

## 4. Item 2 against the count gate, and against Ilya's extender convention

**The count gate. No contradiction; one sentence is not executable.**
- The gate as built: `observedTargets` compares the poem's queue length with targets less slur continuations, over the whole song, once (`W/score/slur-seat.ts:56-66`), on the first seating of a score with no words (`:11-14`).
- Item 2 is narrower than the gate, not wider: it reads a slur only over a note that "carries no cell of its own" (r2:38). The case the gate guards, a phrasing slur over a syllabic passage (`slur-seat.ts:8-9`), has a cell on every note, so item 2 observes nothing there. Nothing is created; a note is only named a continuation.
- **Amendment:** "the count gate is unchanged" (r2:38) names a comparison the file path cannot make at ingest, since there is no poem queue. Either name the two counts, or say that the no-cell condition is the file path's form of the gate. I recommend the second. Note also `slur-seat.ts:13-14`: a score with its own words "already honours its melismas", so item 2 changes the count of item 3 and not the seating.

**The extender convention. No double count if two things are written into the brief.**
- `extenderMelismaIds` reads only a file that carries the `ilya-extenders` field (`W/omr/extend-convention.ts:36-39`, `:69-70`), and `withExtenders` turns its ids into one `extender-notes` warning (`W/score/ingestion/ingest.ts:161-166`). After item 1, a file Ilya made is read twice: by the parser and by the convention.
- The two readings are sets of note ids, so they collide only if they disagree or are summed. r2:28 says "must not double-count" and leaves the rule to the lane.
- **Amendment:** (1) item 1 takes the convention's span word for word: every note after the `<extend>` note, up to the next note with a lyric, never across a rest, a tied-into note left out (`extend-convention.ts:64-67`); (2) where the field is present, the convention's reading stands and the parser's adds nothing to the warning's count.
- **Amendment:** r2:65 forbids changing `VocalLineEvent`, and that type encodes a melisma "by absence of syllable" (`packages/score-parser/src/types.ts:508-517`). Item 1 has to say where the parser puts the fact. The precedent is the `extender-notes` warning with `eventIds` (`ingest.ts:166`).
- The parser reads no `<extend>` today: confirmed (ran: `grep -n extend packages/score-parser/src/musicxml-parser.ts`, no hit).

## 5. What r3 needs

1. Rewrite r2:16's last clause and r2:50 on the measured shape of verse 2 (section 2).
2. State the refused state as today's fold, counted (N2).
3. Say where the five conditions run and which object is written (N3).
4. Replace r2:56 and r2:57 with what the fixture can show: the repair on this fixture is REFUSED and counted, with the number of `no-syllable` notes stated per verse; and a second fixture, or a built score, of 96 notes with the lone «в», where the close-up fills every note (the case `clitic-seat.ts:294-300` describes). Whether Dann wants the 97-note copy closed up with its last note undecided, as the seat does today (`:42-44`), is his: r2:52 changes behaviour he walked on 2026-09-04.
5. Item 3: the console, by name (B4).
6. Item 2: the gate sentence (section 4). MNX named as out of reach, with its notes in a "cannot tell" count.
7. Item 1: the span rule, the carrier, and which reading wins (section 4).

## 6. What I could not establish

1. Any behaviour by running. The 61 cells against 60 slots in N1 is by counting the XML and reading `foldAt`.
2. Whether `foldDictionMarks` acts on verse 2.
3. Whether the pipeline marks «знь» a vowelless clitic.
4. Token spend: a subagent cannot read its own meter. Estimate, about 80,000 of the 260,000 cap.

## 7. Corrected errors in this review

None reported yet.
