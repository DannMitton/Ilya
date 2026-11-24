# review-fable-arrival-seam-r4_r3-delta_2026-11-24

Delta review by Fable of `brief-code-arrival-seam-closes-up_r4_2026-11-24.md` against `review-fable-arrival-seam-r3_r2-delta_2026-11-24.md`. Tree: `Shane` at `50315f2e` (ran, `git rev-parse`), `docs/memory/` modified and uncommitted and read as it stands. Nothing in the repository was changed except this file. No subagent. No test was run. Three small scripts were run and are marked "ran": a regex count in `node`, and two readings of `<lyric>` elements in Python. Every other claim is by reading.

**Path prefixes.** `W/` is `apps/web/src/lib/`. `C/` is `docs/memory/CONTRACT.md`. `T/` is `W/score/ingestion/fixture-rule.test.ts`. `E/` is `packages/phonology/src/engine.ts`. `H/` is `tools/e16-harness/output/`. "r4:N" is line N of the brief.

**Terms.** Adopted from the tree: fold, seat, run, cell, slot, vacated tail, abstain. Adopted from r4: fragment, fuse, divide, close-up, leftover. Coined here: "re-deal" (section 4): the verse's syllables dealt in order onto the notes that held text, after fusing and dividing.

## Verdict

**SEND WITH AMENDMENTS.** The rule holds. I tried it on Dann's own second song and it gave the right answer where the five conditions it replaces would have refused (section 2). No amendment needs a ruling from Dann. Amendments 1 to 5 are conditions of sending: without them the done-when contradicts itself, the lane fails three tests the brief does not name, and the leftover note is sung as a melisma by the resolver. Amendments 6 to 12 close holes a Sonnet lane would fill by guessing.

## 1. Question 1: the earlier blockers

| Blocker | State | Where in r4 |
|---|---|---|
| N4, outcome 2 defines no state | **ANSWERED for the main case; two ways in still have no state** | r4:3 retires "no claim". r4:23 and r4:27-29 give the state: fuse always, close up, one note left with no syllable, counted. That is state 2, form (a), of my r3 review. Open: a vowelless token with no host in its verse (today not drawn, `W/score/ingestion/vowelless-fold.ts:20-21`, `:120-121`), and what a refusal by the five conditions means (section 4). |
| N5, the done-when cannot be met | **ANSWERED IN PART** | r4:31 and r4:55 name `T/:447-456` as rewritten in the behaviour commit. r4:47 keeps `T/:458-463`. **The contradiction survives one line up:** r4:53 says "Ilya empties no note anywhere on that path", and r4:27, r4:29, and r4:54 say the close-up leaves one note with no syllable. Amendment 1. |
| B3, the cruder mechanism | **LANDS** | r4:9-13 replaces the mechanism with one test. r4:11 gives «знь» a direction, which settles the case my r3 review said r3 misfiled. Its residue is amendment 8 (directions r4:11 does not list). |
| B4, the continuation test | **LANDS IN PART** | r4:20 and r4:41: tie, extender, or slur under the gate at `W/score/slur-seat.ts:55-70` (the lines my r3 review asked for); MNX named as holding no slurs. Not taken from r3: the carrier (amendment 5 there, amendment 6 here), and a "cannot tell" count for bare notes on an MNX file. |

## 2. Question 2: trying to break the rule

**Where it held.**
- **Two fusions in one song, no division.** `H/mussorgsky---sunless-02---you-did-not-recognize-me/mxl_extract/score.musicxml` (untracked, written by `musx2mxl 0.2.9`) holds 68 sung notes, 68 with verse-1 text, a lone «в» in bar 2 and another in bar 8, and no token of two vowels (ran). The verse's last note holds «нья». After two fusions and the close-up, 66 syllables sit on 68 notes and two notes are left at the end, counted. That is the slide r4:29 describes, twice. Whether the print's verse runs two syllables past «нья»: NOT ESTABLISHED (no truth file for Sunless 2 on disk).
- **A fusion paid for by a division.** `W/score/ingestion/fixtures/sunless-01-engraved.musicxml.bak-before-ja-2026-09-20` holds 96 sung notes, the lone «в» in bar 8, and «кая.» on one note in bar 18 (ran; `T/:428` names it). Fuse frees a note, divide asks for one, and 96 syllables sit on 96 notes. **This is the only tracked file that exercises the two-or-more branch, and r4 does not name it** (amendment 4).
- **The same file through the five conditions fails.** Condition 5 refuses a clitic unless the file and the queue agreed before it (`W/score/clitic-seat.ts:286`), and the first run ends at the next clitic's cell (`:292-303`). On Sunless 2 the second «в» is refused. By reading, not run. So the rule is right where the conditions are wrong, which bears on step 0 (section 4).

**Where it broke.** Four inputs. Each is closed by one sentence in the brief.

1. **An IPA verse.** The vowel set is Cyrillic only (`W/score/vowel-resolver.ts:159`). Every syllable of the Finale copy's verse 2 holds zero vowel letters, so "count the vowel letters under every note" (r4:9, r4:40, r4:52) makes every one a fragment. Today's fold skips a verse with no Cyrillic letter (`vowelless-fold.ts:101-102`), and the check runs the vowel count on a Cyrillic verse and the mark check on every verse (`W/omr/vowels-per-note.ts:33-35`). r4:48 pulls the IPA verse into the lane and r4 never restates the scope. Amendment 3.
2. **«й» written as two code points.** `'мой'` in NFD is `43c 43e 438 306`, and the set matches the bare «и»: two vowel letters where NFC gives one (ran, `node`). Nothing on the path normalizes: no `normalize(` in `packages/score-parser/src/musicxml-parser.ts`, `W/score/ingestion/ingest.ts`, `vowelless-fold.ts`, `vowels-per-note.ts`, or `W/omr/assert-vowel-per-note.ts` (ran `grep`; the count is at `vowels-per-note.ts:90`). Under r4:13 that token divides and pushes a syllable that does not exist through the rest of the verse. This is the one case where the rule's own safety argument (r4:15, the glide is a consonant) fails on the bytes. Amendment 7.
3. **The divider counts fewer vowels than the test.** r4:40 gives the division to "the engine" and names no call. The engine's vowels are ten letters (`E/:241`, `:810-812`); the test's are thirteen (`vowel-resolver.ts:159`). `syllabify` on «тѣни» finds one nucleus where the test counted two. It also strips punctuation and lowercases (`E/:843-844`) and treats any non-vowel character, a combining acute included, as a consonant that travels to the next syllable (`E/:889-892`). Amendment 7.
4. **A fragment whose nature r4:11 does not list.** r4:11 names three: word-final, proclitic, break mark. Today's direction reads the clitic table and nothing else (`vowelless-fold.ts:107-114`); the cell's syllabic type is carried (`:49-55`) and never consulted. So a word-initial fragment (`begin`, such as «вз» before «дох») fuses backward onto the previous word, against r4:7's own definition. The table's keys are «в», «к», «с» (`E/:251`, `:253`, `:255`), so the old spelling's «въ» is no proclitic there and fuses backward too, in a lane whose vowel set exists to serve old spelling (`vowel-resolver.ts:158`). Amendment 8.

**Tried and not a break.** A letter sung by its name («М» as [эм], Dann 2026-11-02 13:46, `C/:11`) holds no vowel letter and would fuse. The contract gives the alternative in the same paragraph ("or it is not sung and takes no note"), and today's fold already joins it leftward (`W/score/ingestion/vowelless-fold.test.ts:30-33`). Named so the desk knows the rule reads letters, never sounds. A Latin letter typed for a Cyrillic one («мoй») counts zero (ran) and fuses; nothing at the ingestion seam maps it (ran `grep`). Rare, and the count reports it; no amendment.

## 3. Question 3: the pin, and the tests that still assert the old behaviour

**The pin's rewrite is half stated.** r4:31 says "assert the close-up and the counted leftover". The close-up half can be written from that: with `at` the lone «в», `after[at]` is `в ` plus `raw[at + 1]`, `after[at + k]` is `raw[at + k + 1]` to the end, and the last note is null. The "counted" half cannot: r4 names no object that holds the count (amendment 6).

**Three more places assert today's fold, and r4 names none.**
- `W/score/ingestion/vowelless-fold.test.ts:19-23` ("nothing after it moves"), `:25-28`, and `:30-33`: each expects `null` on the fragment's own note with the next syllable unmoved.
- `W/analysis/diction-fold-live.test.ts:102-112`: the Finale copy after arrival equals the raw file but for the «в» note and its host (the copy is read at `:31`).
- `T/:428-429` filters `many-vowels` out of the after-arrival check, with the comment "A note of two vowels is another rule". Under r4 it is this rule. The filter would hide a division the lane failed to make.

`T/:443-445` and `T/:458-463` pass under the close-up, by reading. No file under `W/approval/` names the kept fixture or the backup (ran `grep`).

## 4. Question 4: step 0

**Not enough, and the brief can settle it without the lane.** r4:35 asks how the five conditions reach the repair and does not say what they decide once there. r4:23 says fusing never waits. r4:29 takes the close-up with no condition. So a refusal by the conditions has no stated outcome, which is N4's shape again.

**The rule does not need them.**
- Conditions 1 to 3 (`clitic-seat.ts:268-278`) are the vowel test and the direction.
- Conditions 4 and 5 (`:280-287`) are agreement between the file and the queue. r4:17-21 replaces that with the count, and section 2 shows condition 5 refusing a file the rule repairs.
- **Recommendation:** strike the five conditions from step 0. The repair is a re-deal, per Cyrillic verse, on the `ParsedScore`: the notes that held text keep their places, the tokens are fused and divided, the syllables are dealt back in order, and what is left at the end in either direction is counted. A fusion and a later division cancel by themselves. No import of `$lib/pipeline` into the ingestion seam. Cost: `findCliticFolds` loses its last caller on an arrived file, which r4:62 already tells the lane to report.

**Two facts from my r3 review that r4 does not carry.**
- The fold's `rewrite` keeps the old cell's syllabic type (`vowelless-fold.ts:61`). A close-up moves every later cell, so each text has to travel with its type (amendment 9).
- **A note with no syllable is a melisma to every reader** (`packages/score-parser/src/types.ts:513-514`). The one exception is the vacated tail the `#` fold records (`packages/score-parser/src/diction-marks.ts:209-210`, `:272`), which the resolver abstains on (`W/score/vowel-resolver.ts:653`). Unless the leftover note is recorded the same way, the resolver sustains the last vowel across it, and r4:53's "invents no melisma" is false in the numbers while true on the page (amendment 2).

## 5. Path:line audit of r4

Audited in r2 or r3 and unchanged: `vowelless-fold.ts:83`; `clitic-seat.ts:146`, `:242-258`, `:260-287`, `:270-272`; `ingest.ts:337`; `+page.svelte:561`; `musicxml-parser.ts:796-806`, `:872-881`; `extend-convention.ts:64-67`; `slur-seat.ts:55-70`; `types.ts:530`; `vowels-per-note.ts:73`; `underlay-page.ts:424`; the `#` at sung notes 19 and 80; the eight gates; `cloud-lane-86`.

| r4 | Citation | Result |
|---|---|---|
| r4:15 | `score/vowel-resolver.ts:159`, ten letters and three, «й» excluded | **Holds.** The same set is `W/omr/underlay-units.ts:24`. The engine's is ten (`E/:241`). |
| r4:21 | Dann 03:05 | **Not in `INBOX.md`** (ran `grep`). Paraphrased at `docs/memory/STATE.md:38`. |
| r4:5, r4:15 | Dann 03:15 to 03:19, 03:18 | **Not in `INBOX.md`.** `STATE.md:38` and `:40` carry the desk's wording. His words as written are owed a line. |
| r4:31, r4:55 | `T/:447-456` | **Holds.** |
| r4:40 | "No hand-rolled phonological predicate" (`C/` section 8) | **Holds**, `C/:178`. The same section says "Do not let Ilya propose a deliberately empty note" (`C/:175`); the leftover is counted as a mistake, never proposed, and the brief is better for saying so. |
| r4:42 | "the shape the scan path already reports", with bars and a reason | **The shape holds neither.** `Breach` is an id, a text, a kind, and a vowel count (`vowels-per-note.ts:59-65`). My r3 amendment 5, not taken. |
| r4:42 | slice 6 of `plan-corrections-build_r2_2026-11-05.md`, ruled in at 02:35 | **Half right.** r2 names the work slice 6R (`:31`) and drops or folds parts of slice 6 (`:20-23`). The 02:35 ruling as recorded cites plan r1's slices 5 and 6 (`docs/memory/INBOX.md:1023`). |
| r4:46 | 97 sung notes against 96 | **Holds** (ran): 97 pitched notes, 97 with verse-1 text, in the copy; 96 and 96 in `sunless-01-engraved.musicxml`. After the fusion, 96 syllables on 97 notes: one leftover, no slur, tie, or extender to claim it. |
| r4:47 | n188's texts run «жи», «знь»; `T/:458-463` | **Holds, with a gap the brief hides.** «жи» is at the note at `n188-markings.musicxml:16` under a slur that stops at `:30`; two notes with no text lie between; «знь» is at `:38`, outside the slur. The pins pass under either placement. The close-up moves «ра» from bar 2 onto the note at `:38`. |
| r4:48 | the two `#` fused backward | **Holds, and is already built.** `foldDictionMarks` joins the mark to the syllable before it and closes the slot (`diction-marks.ts:34-35`), at arrival (`ingest.ts:337`, `:358`), tested at `diction-fold-live.test.ts:76`. Nothing for this lane to build. |
| r4:62 | `score/reconciliation/`, `VocalLineEvent`, `analyzePerVerse` | **Holds**, `C/:174`. |

## 6. Amendments

**Conditions of sending.**
1. **r4:53:** replace "Ilya empties no note anywhere on that path" with "the only notes left with no syllable are the leftovers the count names".
2. **The leftover is recorded where the resolver abstains,** by the mechanism at `diction-marks.ts:209-210` and `vowel-resolver.ts:653`, with a test that the resolver returns no vowel there.
3. **Scope:** the vowel test runs on a verse that holds a Cyrillic letter (`vowelless-fold.ts:101-102`). The `#` fold is `foldDictionMarks`' and is left alone; r4:48 is a check, not work.
4. **r4:55:** name `vowelless-fold.test.ts:19-33` and `diction-fold-live.test.ts:102-112` as rewritten in the behaviour commit, and the filter at `T/:428-429` as removed. Add the backup file to "What the kept fixtures must show": after arrival, 96 syllables on 96 notes and no `many-vowels`.
5. **Step 0:** strike the five conditions and state the re-deal (section 4). The lane reports what in `clitic-seat.ts` no arrived file reaches.

**Holes.**
6. **The carrier:** a `ParseWarning` with `bars` and `eventIds` (`ingest.ts:151`, `:166`), which plan r2's list of bars already reads. r4:42 cannot be met in the `Breach` shape.
7. **Counting and dividing:** NFC before the count. Name the division call, require that the pieces rejoin to the token character for character, and say what happens where the divider returns fewer pieces than the count (count the place, divide nothing).
8. **Directions:** `begin` and `middle` fragments fuse within their own word; a vowelless `single` that is no clitic fuses backward, as today; the clitic table is asked after the old-spelling letter map. Whether the pipeline already marks «въ» a clitic: NOT ESTABLISHED.
9. **Every moved text carries its syllabic type** (`vowelless-fold.ts:61`).
10. **A backward fusion closes up too.** r4:29 words the close-up for the forward case only. Say that the tail moves onto the fragment's own note unless a tie, an extender, or a slur under the gate claims that note.
11. **No host in the verse, and a syllable the cascade pushes off the end:** the text leaves the notes and goes into the record with its bar.
12. **r4:42:** cite slice 6R. Dann's words of 03:05 and 03:15 to 03:19 go into `INBOX.md` as written.

## 7. What I could not establish

1. Any behaviour by running the app or a test.
2. Whether the print of Sunless 2 holds two more syllables than the file.
3. Whether the pipeline marks «въ» `isVowellessClitic`.
4. Whether a bare note on an MNX file can be told from a melisma; r4:41 leaves it and so do I.
5. Token spend: a subagent cannot read its own meter. Estimate, about 140,000 of the 260,000 cap.

## 8. Corrected errors in this review

1. My r3 review, section 3, listed the tests an arrived close-up trips and named only the three in `T/`. It missed `vowelless-fold.test.ts:19-33` and `diction-fold-live.test.ts:102-112`.
2. My r3 review, section 5, recommended calling `findCliticFolds` from the fold. Condition 5 (`clitic-seat.ts:286`) refuses the second clitic of a file, so that recommendation repairs only the first lone clitic of a file. Five of the six Sunless files under `H/` hold more than one (2, 5, 3, 7, and 7 in songs 2 to 6; ran). Withdrawn in favour of the re-deal.
