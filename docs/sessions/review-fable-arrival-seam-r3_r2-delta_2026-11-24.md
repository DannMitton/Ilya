# review-fable-arrival-seam-r3_r2-delta_2026-11-24

Delta review by Fable of `brief-code-arrival-seam-closes-up_r3_2026-11-24.md` against `review-fable-arrival-seam-r2_r1-delta_2026-11-24.md`. Tree: `Shane` at `50315f2e` (ran, `git rev-parse`), with `docs/memory/` modified and uncommitted; `CONTRACT.md` is read as it stands in the working tree. Nothing in the repository was changed except this file. No subagent. No test was run: every behaviour claim is by reading unless it says "ran".

**Path prefixes.** `W/` is `apps/web/src/lib/`. `P/` is `apps/web/src/routes/+page.svelte`. `C/` is `docs/memory/CONTRACT.md`. `T/` is `W/score/ingestion/fixture-rule.test.ts`. "r3:N" is line N of the brief.

**Terms.** Adopted from the tree: fold, seat, run, cell, slot, queue, continuation, blanked, undecided. Adopted from r3: unsettled, hand over. Coined here: "the three states" (section 2).

## Verdict

**DO NOT SEND.** r3 answers N1 and B2, and most of B4 and N3. N2 is not answered: it is replaced by a state the brief does not define. Two blockers, both inside item 4 and the done-when. Items 1 to 3 and step 0 need amendments only.

## 1. The six blockers

| Blocker | State | Where in r3 |
|---|---|---|
| B2, the done-when cannot be met on the fixture | **ANSWERED** | r3:52 and r3:61. The done-when no longer asks for the repaired state on the kept fixture. Its successor is N5. |
| B3, the cruder mechanism | **ANSWERED IN WORDS, NOT EXECUTABLE** | r3:20 withdraws the wrong fact. r3:50 routes a vowelless unit that is no clitic, and a clitic with no host, to outcome 2. Outcome 2 has no defined state (N4), and the routing misfiles one case the file's own evidence settles (section 3). |
| B4, the continuation test | **ANSWERED IN PART; no longer a blocker** | r3:34 names MNX as out of reach of slurs. r3:40 asks for the scan path's shape, not its mechanism. Open: the carrier on the file path is not named, and there is no "cannot tell" count (amendments 5 and 6). |
| N1, the rule refuses the fixture's repair and the done-when asks for it | **ANSWERED** | r3:52. The 61 cells against 60 slots are pinned by a test: `W/score/clitic-seat.test.ts:119-120` (97 cells, a seat of 60) and `:160` (the 97th note is the one blanked). |
| N2, the refused state is forbidden by section 0.1 | **NOT ANSWERED** | r3:11 and r3:49 put "no claim" in its place. Section 2 shows that no such state exists in the objects the file path writes. Becomes N4. |
| N3, where the five conditions run | **ANSWERED IN PART; amendment** | r3:26. Section 5. |

## 2. Question 2: is an unsettled run a breach of section 0.1

**It is not outside the rule. Whether it is a breach depends on what the notes of the run hold, and r3 does not say.**

**The lines that decide it.**
- Section 0.1 governs what is under a note, on "every path that puts text under notes (Ilya's seating, the scan reader, a typed edit, an imported file, a test fixture, a truth file)" (`C/:11`). It has no clause about what Ilya claims. A record beside the score does not change what is under the note.
- The object every surface reads has no value for "no claim". A note of `ParsedScore` holds a syllable or it does not, and absence already has a meaning: "Melismas are encoded by absence of syllable on subsequent notes" (`packages/score-parser/src/types.ts:513-515`). The tree's one "undecided" state lives in the pairing map, not in the score, and it is drawn as nothing by Dann's ruling of 2026-09-04 (`W/score/clitic-seat.ts:99-108`).

**The three states an unsettled run can hold, and what section 0.1 says of each.**
1. **The file's «в» stays under its note.** A breach, of the half that is refused in code: "No path, brief, desk, or helper may write a syllable without a vowel under a note, for any reason"; "It is never represented faithfully"; "The rule is enforced in code, not counted" (all `C/:11`). It also fails `T/:443-445`, which has no allow-list. r3:11 agrees this state is forbidden.
2. **«в» joins its host and a note is left with no syllable, counted.** Not a breach of the refused half. It is the other half, which the contract words as counted: "a sung note that is not a continuation ... and carries no syllable is a mistake, counted by the same check" (`C/:11`). The order of evidence then gives it to the singer: "(3) the singer repairs what remains with the notation controls" (`C/:11`, Dann 2026-10-29 01:37). This is the only state the contract already names for "account for what it does not". r3:11, r3:44, and r3:60 forbid it.
3. **The whole run is lifted off its notes.** Sixty-one notes with no syllable on the kept fixture. r3:49 forbids it ("empties no note").

**So the desk's reading leaves the lane no state to build.** r3:49 says "seats nothing there, invents no melisma, empties no note". With all three states ruled out, the only thing left to write is state 1, the one both r3:11 and the contract forbid.

**Where the reading goes wrong.** It treats the fusion and the close-up as one act that the evidence supports or does not. They are two.
- **The fusion never waits on evidence.** Dann 2026-11-24 02:31: "Wherever «в» appears in the l;yrics it will always concatenate to its 'host' syllabe" (`C/:11`). "NO EXCEPTIONS" (`C/:11`, 2026-11-02 13:46).
- **Where the tail goes is what the evidence may fail to settle.** On the kept fixture it settles 60 of 61 notes (`clitic-seat.test.ts:120`, `:160`).
- **Recommendation (state 2, in two forms; the choice between them is Dann's, as it was in my r2 review, item 4):**
  - (a) Close up as far as the queue reaches and leave the notes it cannot reach with no syllable, counted and recorded as unsettled. This is what he walked on 2026-09-04 (`clitic-seat.ts:42-44`, `:323-329`).
  - (b) Fuse onto the host's note, move nothing, and count the clitic's own note. This is today's fold (`W/score/ingestion/vowelless-fold.ts:115-122`).
  - **I recommend (a).** The contract names the close-up as the remedy for a file (`C/:11`: "for a file with no engraving to read, the clitic's own note takes the fused unit and the tail closes up"), and on this fixture the leftover note lands in bar 18, the bar r3:17 measured as holding the surplus note.
  - Either form meets his ruling of 03:04: the repair is what the evidence supports, and the note left over is accounted for and handed to the singer.

**One caution on r3:44.** "That empty note is Ilya's own and is the state Dann ruled a mistake" is true of the note. The same sentence of the contract says what is done with that mistake: it is counted. It does not say the state may not exist.

## 3. Question 3: the allow-list, and the tests an unsettled run does trip

**"No new entry on its allow-list" (r3:64) is met by any build, and it guards the wrong door.**
- `ALLOWED` (`T/:142-183`) is read only by the check of the files' bytes (`T/:202-216`). The lane changes no fixture's bytes, so no entry is added or needed. The kept fixture's two entries stay matched (`T/:144-159`), so the stale-entry test (`T/:210-216`) holds.
- The tests an unsettled run trips are in the block that reads the score after `ingestScoreFile`, which says of itself "There is NO `ALLOWED` list here" (`T/:389`).

**New blocker N5. r3:60, r3:64, and r3:70 cannot all be met.**
- `T/:447-456` pins today's fold on the kept fixture: `expect(after[at]).toBeNull()` (`:452`, the emptied note), the fused text on the host's note (`:453`), and nothing after it moved (`:455`). r3:60 forbids the emptied note, "proved by a test over the kept Finale fixture". r3:64 asks that this file "still passes". r3:70 forbids rebuilding it.
- `T/:443-445` fails on the kept fixture under state 1.
- `T/:458-463` pins the n188 fixture: «знь» and «в» are no longer under a note of their own, and «знь» is joined to something. «знь» there is `<syllabic>end` (`packages/score-parser/src/fixtures/n188-markings.musicxml:42`), the last cell of a two-cell word. Condition 1 of the seat refuses a word of more than one cell (`clitic-seat.ts:268`), so r3:50 sends it to outcome 2. Today the fold joins it to the syllable before it (`vowelless-fold.ts:112-117`), which leaves its own note with no syllable (`:121`), which r3:60 forbids. **So r3:60 cannot be met on n188 either, and the evidence there is complete: the file itself says the syllable ends the word begun on the note before.**
- **The repair:** r3 names `T/:447-456` as the one test the lane rewrites, with the state it now pins; says `T/:443-445` and `T/:458-463` pass unchanged; and rewords r3:60 so that it forbids only what the lane can stop (see amendment 2).

## 4. New blocker N4: outcome 2 defines no state

Section 2 in one line: r3:49 forbids every value a note of the run can hold except the one r3:11 forbids. The brief has to say, for each of the three ways into outcome 2, what the notes hold after arrival.

| Way in | Evidence the file gives | What the notes hold (recommended) |
|---|---|---|
| The five conditions hold and the queue runs short (r3:48, second clause) | The fusion; the slide for every note the queue reaches | Section 2, form (a) or (b), Dann's choice. The notes left over carry no syllable, are counted `no-syllable`, and are recorded as unsettled with their bars. |
| A vowelless syllable inside a word («знь») | The file's own `<syllabic>` | Joined to the syllable before it in its word, as today. Its note is counted `no-syllable` unless item 2 calls it a continuation. Not "unsettled". |
| A clitic with no host, or a vowelless word the transcription does not call a clitic | None | Not under a note: "it is not sung and takes no note" (`C/:11`). The text goes into the record, so it is not dropped in silence (r3:50). The scan path's precedent drops it (`W/omr/underlay-clitics.ts:30-36`); the file path's precedent is `undrawn` and a console line (`vowelless-fold.ts:20-21`, `W/score/ingestion/ingest.ts:372`). |

## 5. Question 4: is step 0 enough

**No. The brief can decide it, and the lane keeps one check.** r3:26 lets a Sonnet lane "take one" of two shapes and build on it with no desk read between. Four facts, read this session, decide the shape.

1. **The object is the `ParsedScore`.** The standing tests read `score.vocalLine` after `ingestScoreFile` (`T/:407-421`). A repair written to the pairing map leaves «в» in the score and fails `T/:443-445`.
2. **N3's obstacle is smaller than I wrote.** `findCliticFolds(parsed, verseNumber)` takes a `ParsedScore` and nothing else (`clitic-seat.ts:146`); it builds the queue itself (`:149-153`, `:483-497`). The fold can call it on the score before folding. The cost is an import of `$lib/pipeline` into the ingestion seam (`clitic-seat.ts:47`).
3. **The page's seat is already out of reach for an arrived file.** `toOutcome` folds before the page sees the score (`ingest.ts:337`, `:369-374`). The page hands that folded score to `findCliticFolds` (`P/:561`). There «в бью» is one cell matching two pipeline words (`clitic-seat.ts:214-216`), and `foldAt` returns null for that (`:270-272`). Every test of the seat parses with the raw parser and never arrives through `ingestScoreFile` (`clitic-seat.test.ts:70-76`; `W/score/row108.support.ts:36-39`). By reading, not run. **So the five conditions run on no arrived file today, and r3:70's "what item 4 makes unreachable" is in part unreachable already.**
4. **The seat carries text and no syllabic role** (`clitic-seat.ts:88-97`), and the fold's `rewrite` keeps the old cell's type (`vowelless-fold.ts:61`). A close-up written into the score has to move each cell's type with its text.

**What step 0 keeps:** one check, then stop for the desk if it fails. Whether `processText` marks `isVowellessClitic` the same at the ingestion seam as on the page, with no dictionary loaded. `clitic-seat.test.ts` imports no dictionary loader (`:16-40`) and finds the fold (`:110`), which suggests yes; NOT ESTABLISHED for the app.

**Also for step 0:** the seat acts on verse 1 by default (`clitic-seat.ts:146`); the fold acts on every Cyrillic verse (`vowelless-fold.ts:95-102`). The brief says which verses the close-up reaches.

## 6. Path:line audit of r3

Already audited in r2 and unchanged: `clitic-seat.ts:23-31`, `:242-258`, `:260-287`; `vowelless-fold.ts:83`, `:115-122`; `types.ts:530`; `underlay-page.ts:424`; `extend-convention.ts:64-67`.

| r3 | Citation | Result |
|---|---|---|
| r3:15 | `brief-code-n135-stage2b-r5-step10_r1_2026-10-29.md` | Exists (ran `ls`). An r2 of the same brief exists too; r3 and `INBOX.md:1025` both cite r1. Which one ran: NOT ESTABLISHED. |
| r3:19 | `#` alone at sung notes 19 and 80 | **Holds.** My notes 18 and 79, counted from 0. |
| r3:30 | `musicxml-parser.ts:796-806`, `:872-881` | **Holds, a few lines short.** `:796-808` is the lyric loop; `<syllabic>` is read at `:881-883`, `<text>` at `:884-886`, `<elision>` at `:888`. No `extend` in the file (ran `grep`). |
| r3:30 | `omr/extend-convention.ts:18-20` | **Holds** at `:18-19`. |
| r3:34 | `score/slur-seat.ts:12-18` | **Wrong lines.** `:11-18` says the seat is the first seating only and that a score with its own words "already honours its melismas". The gate is worded at `:5-9` and built at `:55-70`. |
| r3:38 | `omr/vowels-per-note.ts:73`; `text/poem-join.ts:227`; "nowhere on the file path" | **Holds.** The only two calls outside tests are `underlay-page.ts:424` and `poem-join.ts:227` (ran `grep`). |
| r3:44 | `vowelless-fold.ts:18-19` | **Holds.** |
| r3:48 | `score-seat.ts:43-45` | **Holds.** |
| r3:49 | "Dann, E.46: Ilya never creates a melisma" | **Holds** as recorded at `clitic-seat.ts:42` and `slur-seat.ts:5`. |
| r3:56 | slice 6 of `plan-corrections-build_r1_2026-10-08.md`, "the mark, the line, and the review" | **Superseded form.** r1's table row 6 reads so (`:43`). `plan-corrections-build_r2_2026-11-05.md:3` replaces r1's order for slices 3, 5, 6, and 11; its `:20-23` fold the line into the banner, keep the mark, and drop the review strip; `:31` renames the work slice 6R. |
| r3:63 | "eight gates"; gate 4 | **Holds.** Eight since 2026-09-27 (`docs/memory/ENVIRONMENT.md:749`); gate 4 is the web test count (`:600`, `:877`). |
| r3:3, r3:66 | `cloud-lane-86`; families 1 to 5 | Lane 86 is running (`docs/memory/QUEUE.md:28`). The ten families are in `brief-code-n204-behaviour-baseline_r2_2026-11-23.md:59-67`. |
| r3:9 | Dann 03:05, "we created Corrections to give the user agency ..." | **Not found in `docs/memory/`** (ran `grep` for two phrases of it). The 03:04 ruling is at `INBOX.md:1025`. The 03:05 words are owed a line there (`C/` section 1 item 20, as cited at `INBOX.md:1012`). |

Not r3's citation, found on the way: the comment at `clitic-seat.ts:248-249` sends the reader to `pipeline.ts:927` and `:972`; that file is 896 lines (ran `wc`), and `isVowellessClitic` is at `:144` and `:449`.

## 7. Amendments, if the two blockers are repaired

1. **N4:** the table of section 4 goes into item 4, with Dann's choice between forms (a) and (b) made first. One question for him.
2. **N5:** r3:60 becomes "no note that the file filled is left with no syllable where the evidence seats one; every note that is left so is counted and recorded". r3:64 names `T/:447-456` as rewritten and `T/:443-445` and `T/:458-463` as passing unchanged. r3:70's "Rebuild" is kept, with that one test excepted by name.
3. **Step 0:** the brief decides the object and the call (section 5, facts 1 and 2); the lane runs the one check and stops if it fails.
4. **Item 1, the carrier and which reading wins.** r3:70 forbids touching `VocalLineEvent`, and r3:30 leaves the winner to the lane. The code already decides it if the parser reports through the existing warning: `withExtenders` returns early where the result already carries `extender-notes` (`ingest.ts:162`), so the parser's reading stands and the convention adds nothing. Say so, and say the parser emits `extender-notes` with `eventIds` (`ingest.ts:166`).
5. **Item 3, the carrier.** The scan path's shape is `Breach` (`vowels-per-note.ts:57-65`): an id, a text, a kind, a vowel count. It has no bar, no run, and no reason, so it cannot hold r3:61's record. The file path's standing carrier with bars is a `ParseWarning` (`ingest.ts:151`, `bars`; `:166`, `eventIds`), and plan r2's one list of bars to check already reads one. Name it.
6. **Item 2.** Cite `slur-seat.ts:5-9` and `:55-70`. "Exactly as implemented" cannot run at ingestion: the gate "reads only the queue handed to `mergeOnUpload`" (`slur-seat.ts:59-60`), and a file has no poem. Say that the no-cell condition is the file path's form of the gate. On an MNX file, count the bare notes under a kind of their own ("cannot tell"), not as `no-syllable`.
7. **r3:56:** cite plan r2 and slice 6R.
8. **r3:65 against r3:66:** "no committed approval or golden file changed" and a behaviour change on purpose can collide. Whether any approval file reads an arrived score with a vowelless syllable: NOT ESTABLISHED (no file under `W/approval/` names the kept fixture or `ingestScoreFile`, ran `grep`). Say what the lane does if one moves: stop and report.

## 8. What I could not establish

1. Any behaviour by running. Section 5 fact 3 is by reading four files.
2. Whether the pipeline at the ingestion seam marks clitics as it does on the page.
3. Whether the n188 fixture's «в» (`n188-markings.musicxml:149`) passes the five conditions.
4. Which revision of the step 10 brief ran.
5. Token spend: a subagent cannot read its own meter. Estimate, about 110,000 of the 260,000 cap.

## 9. Corrected errors in this review

1. My r2 review, N3, said the five conditions "cannot be applied" at the fold because it takes only a `ParsedScore`. `findCliticFolds` takes only a `ParsedScore` too (`clitic-seat.ts:146`). The obstacle is the import and the object written, not the signature.
2. My r2 review, section 4, cited the count gate at `slur-seat.ts:56-66`. The comment and function run `:55-70`.
