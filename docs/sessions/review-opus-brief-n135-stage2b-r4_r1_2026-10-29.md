# Review: brief-code-n135-stage2b_r4_2026-10-28 (md5 41975a5f)

Opus, independent adversarial review, 2026-10-29 (Toronto 2026-10-28 23:2x onward). Nothing in either tree or in `docs/memory/` was written; no git write was run on the Mac.

**Read in full:** r4, r3, r2, the Opus review of r3, Fable's review of the stage 2b brief, the three measure reports, the ratified banner file; `CONTRACT.md` §0, §1, §3, §4, §8 and `INBOX.md` 455 to 471 from the Mac's working copy (uncommitted, md5 `b22f58bb` and `c8f31ea9`); `STATE.md` THE ONE THING on the Mac. **Not read:** Fable's review of stage 2a as built; r4 cites nothing from it.

**Trees:** `Shane` at `1e4750e5`, `cloud-lane-19` at `383187a7`, cloned in my workspace. Every `path:line` below was read this session in the tree named; "lane" is `cloud-lane-19`, "merge" is tree `59eba6a7`.

**Data:** A2's archive (md5 `df1a58cf`), A1's (`00d5a807`), the real-page results (`74ceb0e3`), the earlier review's scripts (`08745865`), each unpacked into its own folder. My scripts and outputs are in `review-opus2-scripts.tgz` (section 10).

## 1. Verdict

**SEND WITH AMENDMENTS.** Steps 0 and 1 stand as written. Step 2's banner, as specified, names the wrong bars. Step 3's median fails on one measured system in a way that runs the band into the piano. Step 4, as written, lowers (b) in the replay, and the part of Dann's ruling it leaves out is the part that gains. Seven amendments must land; each has replacement text below.

## 2. Lead finding

Step 2 reverses Fable's amendment 7 on the ground that "the singer now gets a ratified banner naming the unread bars". As specified, the banner would name the wrong bars. r4 takes each unwritten system's bars from `NotePlace.bar`, which is homr's bar number on its own page (`underlay-prepare.ts:60-61` on the lane), and homr numbers every page from bar 1: all 72 captured pages begin at `<measure number="1">`. The join numbers the song's bars one after another (`join-pages.ts:558`). In the share-0.3 replay, 14 of the 19 unwritten systems would be named by the wrong bars. For example, B04 page 2 system 3 is bars 21 to 23 of the song, and the banner would say "bars 7 to 9". Four of the 19 are K page 5's systems: a page of the piano alone, whose notes the join removes (`join-pages.ts:530`, `:539`), so the banner would send the singer to type words into bars 42 to 51, where the voice rests. Two further gaps sit beside these. First, a page that answers null names nothing. Second, nothing carries the bars to a song reopened from its kept reading, which holds only MusicXML and a stamp (`stamp.ts:39-42`). The singer would be told something false and not know it. The reason for the reversal holds once amendments 1 to 3 land, not before.

## 3. What I ran

All replays use A2's own replay (`cells.mjs`) or my prototypes on A2's 18 captures, scored with A2's `score_app.py`, in my workspace. Control first: `node --import ./ts-register.mjs cells.mjs <app> out-cells B01 … U6` printed `control checks 1032 mismatches 0`, and the scorer on its two cells gave A2's figures exactly.

| run | command (in `/home/claude/review2`, scorer from `scorer/lever2-f6`) | read right of 2,538 | (b) of 2,385 | (a) | (c) | vowelless alone |
|---|---|---|---|---|---|---|
| as built, cell d0.5_s0.5 | `OUTD=…/d0.5_s0.5 python3 ../score_app.py` | 1,514 | 1,451 | 1,591 | 559 | 86 |
| step 1 alone, gate still on (9 songs written) | per-song sum of cell d0.5_s0.3 | 900 | 851 | 912 | 342 | |
| steps 1 and 2 (cell d0.5_s0.3) | `OUTD=…/d0.5_s0.3 python3 ../score_app.py` | 1,836 | 1,671 | 1,848 | 638 | **105** |
| V1: step 4 as r4 words it | `node --import ./reg.mjs step4.mjs <app> out-step4`, then the scorer | 1,831 | **1,666** | 1,847 | 636 | 105 |
| V5: step 4, strict reading (no cut in a word whose slot boundaries differ from the print's) | same | 1,822 | **1,645** | 1,814 | 633 | 107 |
| V3: today's cut, every vowelless token folded into a neighbour | same | 1,890 | 1,704 | 1,903 | 641 | 33 |
| **V4: today's cut, only the clitics the transcription knows folded** | same | **1,880** | **1,710** | 1,870 | 640 | **79** |

V0 (today's `cutUnits`) inside `step4.mjs` reproduces the cell exactly: 1,836 / 1,671 / 1,848 / 638 / 105. Per song, V4 against steps 1 and 2: (b) rises on 13 songs, is level on 4 (K and M, which have no syllable truth, and P and U1), and falls on B07 alone, by 1 (87 to 86). V3 loses (b) on P (7), B10 (4), B04 (2), B01 (2), and U1 (1), because noise such as «т», «н», or «Тът» then rides on a real syllable.

**Step 3 prototype**, exactly as r4 words it, on A1's captured pages of B01 and B04 (`node --import ./reg.mjs step3.mjs <A1 app> <harness systems> B01 B04`), against the harness's band ends (`systems/<L>.jsonl`, `y1`, which `rowsys.py` writes):

| rule for B's top line | band ends within 10 px of the harness's, of 23 systems |
|---|---|
| today (`staffIn`'s line of the next box) | 4 |
| r4: median of all columns | 21 (B01 p1 s4 ends 163 px low) |
| the earlier review's minimum | 14 |
| homr's next box top | 21 (all 23 within 12 px but B04 p1 s1) |
| topmost top two columns share, then the median within two spaces below it | **22** |

**Step 2 singer check** (`python3 -I banner.py <cells json> <app>`): of the 19 unwritten systems at share 0.3, 4 are on a piano-alone page, 14 have page bars that differ from song bars, and a word typed into Lyrics between the read words lands on the gap's first note in all 12 inner gaps (`reseat.ts:276-277`); the 3 gaps at a song's head go to the first open note (`reseat.ts:281-298`).

## 4. Amendments

### Amendment 1. Step 2: the banner names the song's bars. Must land.

- **What is wrong.** "Record, for each system not written, its first and last bar (`omr/underlay-prepare.ts`, `NotePlace.bar`…)". That bar is homr's page-local number (`underlay-prepare.ts:60-61`; `NotePlace.bar`, `underlay-seat.ts:57`).
- **Evidence.** 72 of 72 captured pages start at bar 1 (`grep` of each `musicxml.xml`). The join gives bar `n + 1` to the song's nth bar across pages (`join-pages.ts:554-558`). `banner.py`: 14 of 19 unwritten systems differ (B04 p2 s3 page bars 7 to 9, song bars 21 to 23; P p2 s4 27 to 34 against 54 to 61; U5 p7 s1 1 to 5 against 47 to 51).
- **Replacement text** for that sentence:

  > Record, for each system not written, its first and last bar **as the song numbers it**. `NotePlace.bar` is homr's bar on its own page (`underlay-prepare.ts:60-61`), and homr numbers every page from bar 1; the join numbers the song's bars one after another (`join-pages.ts:558`). So a song's bar is the count of `<measure>` elements in the first part of every earlier page plus the page's own bar. Compute it in `applyUnderlay` (`underlay-song.ts:37`), which holds every page's MusicXML. Join ranges that touch: U5's 44 to 46 and 47 to 51 make 44 to 51. Test a two-page song whose unread system is on page 2.

### Amendment 2. Step 2: a piano-alone page names no bars; a null page names all of its. Must land.

- **What is wrong.** Step 2 names "each system not written". On a page of the piano alone those systems hold the piano's notes, which the join removes. A page that answers null has no systems, so its bars are never named.
- **Evidence.** K page 5: 4 of the 19 unwritten systems; `pianoAlonePages` (`join-pages.ts:421-425`) is true for it, and `:539` takes its notes out. The banner would say bars 42 to 51. Null pages: `applyUnderlay` stops the whole song on one today (`underlay-song.ts:40-41`); under step 2 the other pages are written, so a whole page could be bare with the banner silent about it. No page answered null in the 18 songs: every song got words with the gate off (real-page report, section 3), which `underlay-song.ts:40-41` forbids after a null page. The case is the code's, not the data's.
- **Replacement text**, appended to the amendment 1 text:

  > Leave out every system on a page of the piano alone (`pianoAlonePages`, `join-pages.ts:421-425`, exported, not copied). A page that answers null names every bar of its first part that holds a voice note, unless it is a page of the piano alone. Tests: a piano-alone page names none; a null page names its bars.

### Amendment 3. Step 2: where the bars ride, and the page's ceiling. Must land.

- **What is wrong.** r4 says what the banner says, not how its bars reach the page or survive a reopen.
- **Evidence.** A kept reading holds `musicXml` and `stamp` only (`stamp.ts:39-42`). A reopened scan takes its MusicXML from the kept reading (`restore.ts:52` on the merge) and is ingested again; the banner is chosen from the parse's warnings (`+page.svelte:2790` on the merge). The score parser reads no `<miscellaneous>` element today (`grep -rn miscellaneous packages/score-parser/src`: nothing). `+page.svelte` on the merge is 5,586 lines against its ceiling of 5,586 (`scripts/ratchets.json:8` in tree `59eba6a7`); r4 forbids raising ceilings.
- **Replacement text**, appended to the banner paragraph:

  > The bars travel with the reading, so the banner appears again when the song is reopened from its kept reading (`restore.ts:52`); say where they ride (the joined MusicXML, or the kept reading beside its stamp) and test the reopen. `+page.svelte` stands at its ceiling on the merge (5,586 of 5,586, `scripts/ratchets.json:8`): put the banner's choice in a pure function beside `noLyricsNoticeKey` (`score/ingestion/ingest.ts:79-80` on the merge), and the page gains no net line.

### Amendment 4. Step 3: the median of all columns can land between the piano's two staves. Must land.

- **What is wrong.** "Across the columns that find a group, take the median top line, never the minimum."
- **Evidence.** `step3.mjs` on A1's B01 p1 s4: five columns find the upper piano staff (tops 4930 to 4936), five miss it and find the lower (5261 to 5265). The median of ten falls between them; the band ends at 5051, 163 px (about 5 spaces) below the harness's 4888, inside the upper piano staff. That is the failure step 3 exists to remove. The ledger-line case is also less rare than "single columns": B04 p1 s2 has 4 of 9 columns a space high (2369 to 2371 against 2404 to 2409), s4 has 3 of 10, s3 2 of 11, so the median there wins by one column.
- **Replacement text** for that sentence through "(B04 p1: 1171 against the box top 1203; the review's figures, not re-run by the desk)":

  > Across the columns that find a group, take the topmost top line that at least two columns share (within a tenth of a space), then the median of the top lines from it down to two spaces below it; never the minimum, and never the median of every column. Measured on A1's B01 and B04 (23 systems): this rule ends 22 bands within 10 px of the harness's band end; the median of every column 21, with B01 p1 s4 163 px low, inside the upper piano staff, where five columns found the lower staff; the minimum 14; today 4. The 23rd, B04 p1 s1, is the harness's own error: it took a line about 1.1 spaces above the staff (ink rows at 1181, 1174, 1173 above staff lines from 1216, 1211, 1207, at x 1500, 2200, 2900).

  Add a test: "half the columns find the upper staff and half the lower: the band ends at the upper staff's top line minus 1.5 spaces." In section 8, the likeliest failure becomes "columns split between the piano's two staves, or a line above the staff in a third of the columns", not a dynamic or a hairpin.

### Amendment 5. Step 4: keep today's cut and fold the clitics the transcription knows. Must land.

- **What is wrong.** Point 1 keeps every token with one vowel letter or none "one unit at its own box, as today", so a printed «в» keeps taking a note of its own: point 2's clitic fold never reaches the units. The boundary part of the step (points 1 to 3) lowers (b). Dann's 06:19 ruling (a vowelless word is a clitic and joins its host by its own rules) and 06:21 (Ilya's transcription already does this) are the part left out (`STATE.md:41` on the Mac).
- **Evidence.** Section 3: r4 as written, (b) 1,671 to 1,666 and read right 1,836 to 1,831; its strict reading 1,645 and 1,822; r4's own expectation ("step 4 is expected not to lower (b)") fails in both. Cuts: of 101 tokens of two vowel letters or more in the 220 seated rows, today's engine cut takes 85, the slots 88; the letter mapping never failed (0), with 71 final hard signs mapped. The fold of the transcription's own clitics, today's cut kept: (b) 1,710, read right 1,880, vowelless lyrics alone on a note 105 to 79, no song down more than 1. The vowelless count at the step 1 threshold is 105, not the real-page report's 86, which is share 0.5 (same scorer, both cells re-run here).
- **Replacement text** for "Change:" through "(`underlay-units.test.ts`, the review cites `:7-8`; read it)." and the count line after it:

  > Change:
  >
  > 1. **Keep today's cut.** A token with two vowel letters or more is cut by the engine's syllabification as built (`underlay-units.ts:38-83`, `cut` = `GraysonEngine.syllabify`, `underlay-seams.ts:46`). Every other token stays one unit at its own box, except as point 2 says.
  > 2. **Fold the clitics the transcription knows.** Send each Russian row's sewn words (`rowWords`, `underlay-tokens.ts:92-94`) through the transcription as one line and read its own call for each word, `isProclitic` and `isEnclitic` (`pipeline.ts:776-787`; `buildSlotQueue` reads them at `pairings.ts:218`). A vowelless word it calls a proclitic rides in the first printed token of the next word in the row that has a vowel; one it calls an enclitic rides in the last printed token of the word before it. Join the rider to its host with a no-break space, U+00A0, as `buildSlotQueue` does (`pairings.ts:225`, `:241`); the unit keeps the host token's own box. A vowelless token the transcription does not call a clitic stays its own unit, as today. A proclitic with no host after it in the row stays its own unit and is counted: `buildSlotQueue` drops it, because its waiting text lives per line (`pairings.ts:207-208`) and nothing flushes it after the word loop (`:251`).
  > 3. Pass the clitic call in from the factory as a seam, as `cut` and `isWord` are today (`underlay-seams.ts:33-47`); `omr/` imports neither the pipeline nor `score/`.
  > 4. Test the path whole: a lyric `в` + U+00A0 + `ти` written by `writeLyrics` reaches Lyrics and is seated on its note as the slot «в ти» (`seatScoreWords`, `score-seat.ts:107`), and the arrival fold (`clitic-seat.ts`) leaves it as it is. If it does not, stop and report.
  >
  > Why, from the desk's replay on A2's 18 captures at share 0.3, steps 1 and 2 applied: this rule gives (b) 1,710 and read right 1,880 against 1,671 and 1,836; cutting at the transcription's syllable boundaries instead gives 1,666 and 1,831, and folding every vowelless token, clitic or not, costs P 7 and B10 4. Count the vowelless lyrics alone on a note before the arrival fold against **105**, the replay's figure at the step 1 threshold (86 is share 0.5), and report B04 before and after.

  In section 4, replace the vowel-letter bullet's "Step 4 retires `underlay-units.ts:24`" with "Step 4 keeps `underlay-units.ts:24-25` and its pinned test (`underlay-units.test.ts:16-19`)", and add: "**Which word is a clitic.** The transcription's call (`pipeline.ts:776-787`) is the one site; the seam passes it, and `omr/` holds no clitic list. The no-break space between a clitic and its host gains a third copy beside `pairings.ts:62` and `clitic-seat.ts:66` (merge); name it." In section 7, the step 4 mutant becomes "a vowelless proclitic left as its own unit". In section 10, the clitic box gap is closed (the host token's box, as measured).

### Amendment 6. Section 8: the replay is done; record it as the step figures. Must land.

- **What is wrong.** Section 8 leaves the replay of steps 1, 2, and 4 for later, and its step 4 expectation fails on r4's own step 4.
- **Replacement text**, for section 8's first paragraph:

  > The desk's replay on A2's 18 captures (review of r4, section 3): step 1 alone, with the song gate still on, read right 900 and (b) 851; steps 1 and 2, 1,836 and 1,671; step 4 as amended, 1,880 and 1,710. Code's build is checked against these exactly by the same replay before the browser run; a difference is reported before anything else. Step 3 changes the worker half and is measured in the browser run alone.

  The browser expectation becomes "read right at least 1,880 and (b) at least 1,710; step 3 adds or holds on B01 and B04".

### Amendment 7. Header: the review that stands in for Fable is not recorded. Must land.

- **What is wrong.** r4 says "a fresh Opus review reads r4 before it is sent (Dann 2026-10-28 23:21)". `INBOX.md` on the Mac ends at 23:19 (line 471), and `grep 23:21 STATE.md` finds nothing. `CONTRACT.md` §1 item 19 says every Code brief is reviewed by Fable before Code gets it. Tether 6: a claim about what the project has decided carries the document that says so.
- **Replacement text**, for that clause: "a fresh Opus review reads r4 before it is sent, in place of Fable's (Dann 2026-10-28 23:21, `INBOX.md:<line>`); Fable reviews <the brief, or the lane's reports before merge>, as he ruled". The desk records his 23:21 words in `INBOX.md` first.

### Carry amendments

8. **Citations.** r4's header names the lane, but Code builds on the merge, and four cited files differ between them: `isCurrent` is `restore.ts:41` on the lane and `:40` on the merge; the banner's choice is `+page.svelte:2801` on the lane and `:2790` on the merge; `noLyricsNoticeKey` is `ingest.ts:89-90` on the lane and `:79-80` on the merge; the arrival fold's no-break space is `clitic-seat.ts:65` on the lane and `:66` on the merge. Give the merge's line where they differ. The test that holds the two vowel copies equal is `underlay-units.test.ts:16-19` (`:7-8` are its imports). `buildSlotQueue` clears its waiting clitic after a host at `pairings.ts:249-250`; the row-end loss is the per-line scope at `:207-208`. `lineRows` and `fives` are module-private (`metre-windows.ts:72`, `:94`): export them for step 3, do not copy them. The hard-sign rule drops a part-final run too, not only a word-final sign (`pre-reform-normalizer.ts:192`). `seatPage` also fails a page for a system with no band (`underlay-page.ts:145`), and `applyUnderlay` for a null page (`underlay-song.ts:40-41`).
9. **Step 1 wording.** "rows seated that the harness labels other or no text 17 to 11, of which 4 lie outside the harness's bands" mixes kinds: of the 11, 7 overlap rows the harness labels `other` and 4 overlap no harness row (`cost.json`, cell `d0.5_s0.3`, re-read here). Three of the 7 read as text (B02 p2 s4, U5 p1 s1, U6 p2 s3).
10. **The typed-words check is answered.** Replace "If it does not, stop at that point and report; the banner's second sentence would be untrue" with: "A word typed between two read words takes the note right after the earlier one's last syllable, and only if that note is open (`reseat.ts:276-277`, `:310-313`); ahead of every read word it takes the first open note (`:281-298`). In the replay the typed words land on the gap's first note in all 12 inner gaps and at the head in 3. The sentence is untrue where the note before a gap holds no syllable, a melisma's tail or a seating gap; report each such song."
11. **`{bars}` for one bar, and for three ranges or more, is not ratified.** One-bar gaps occur 3 times in the replay (B07 bar 39, B09 bar 4, K bar 37), and "in bars 39" or "in bars 39 to 39" is the result. Dann's wording, EN and FR.
12. **Apostrophes.** The ratified EN and FR use U+0027 («Ilya's», «n'a»); `i18n.ts` uses U+2019 throughout (114 times), and row 78a pinned typographic apostrophes. Pin as ratified, or ask Dann.
13. **"Seated when the hidden switch comes off, not before"** (the ratified file, line 5). r4 adds the key now, behind the switch. Say why in one line (tether 19).
14. **Step 0.** Update `stamp.ts:29-35`'s comment ("the version `0` is 'not wired'") in the same commit; `stamp.test.ts:22-25` holds with `underlay@1`.

## 5. Citations checked

I checked 48 `path:line` citations in r4 against the lane, `Shane`, or the merge, and 42 numbers.

- **Wrong, 3:** `pairings.ts:249-250` as the row-end loss; `underlay-units.test.ts:7-8` (carried from the earlier review); `NotePlace.bar` as the banner's bar (the line is right, its use is wrong: amendment 1).
- **Partly, 6:** `restore.ts:40` (`:41` on the lane the header names, `:40` on the merge Code builds on); `metre-windows.ts:199-241` as "the line finder" (the finder is the private `:72` and `:94`); `underlay-units.ts:37-60` (the function runs `:38-83`); `pre-reform-normalizer.ts:192` ("word-final"); `underlay-song.ts:42-43` and `underlay-page.ts:173`, `:175` (right, but the null page `:40-41` and the bandless system `:145` are not named).
- **Right, 39**, among them: `stamp.ts:36`, `underlay-language.ts:27`, `underlay-tokens.ts:50`, `ocr-guard.ts:37` and `:41` (also on `Shane`), `underlay-page.ts:98-101`, `INBOX.md:459` and `:467-468` (Mac), `metre-windows.ts:199` and `:223-241`, `underlay-band.ts:127-128` and `:31`, `join-pages.ts:421-425`, `:428`, `:530`, `:539`, `pairings.ts:202`, `:205-208`, `:212-228`, `:229-248`, `pipeline.ts:533-537` and `:903`, `engine.ts:1030`, `:1135` (inside `findYoSyllable`, so r4's correction of the earlier review holds), `:1514`, `:1551`, `vowel-resolver.ts:159`, `clitic-merge.ts:13-20`, `typed-hyphens.ts:43`, `metre.worker.ts:42`, `+page.svelte:2010`, `:2790` (`Shane`) and `:2021`, `:2801` (lane), `ingest.ts:89-90`, `score-seat.ts:107`, `ratified-lines.test.ts` (it pins the row 113 HEIC line, so it is the right file), and `measure-n135-stage2b_2026-10-27/measure.mjs` (on the lane and in the merge).
- **Numbers re-run and right, 33 of r4's own and 7 it quotes from the earlier review:** 1,514, 1,451, 1,591, 559; 1,836, 1,671, 1,848, 638; 37 and 19 of 239; 13 and 9 songs held; 17 and 11 seated junk rows, 4 of them outside the harness's rows; 248 of 506 boxes; box 3 at 2585 to 3063 with lines 2899 to 3019; boxes 1 and 5 at 1415 against 1416 and 3695 against 3681; 1171 against 1203; K page 5 with 5 banded systems, 4 of the 19; 1,032 checks with 0 mismatches; the merge tree `59eba6a7`. The earlier review's counts, re-run with its own scripts: 495 words and 1,123 tokens, 81 and 137, 606 words and 74, 3 row-final proclitics.
- **Numbers wrong, 2:** the vowelless baseline 86 (105 at the step 1 threshold); "single columns" for the shifted groups on B04 p1 (4 of 9 on s2).

## 6. The desk's "checked" claims, re-run

- `boxes.mjs` on B01 p1, "run by the desk 2026-10-28 23:3x": re-run, same figures (section 5).
- The correction of `engine.ts:1135`: right; `:1135` is inside `findYoSyllable`, `transcribe` is `:1514`, its `syllabify` call `:1551`.
- The trial merge, marked as the review's: re-run, `git merge-tree --write-tree 1e4750e5 383187a7` gives `59eba6a71690…` with only auto-merges (`restore.ts`, `scan.ts`), no conflict.
- `ocr-guard.ts` constants, marked as the review's reading: right on the lane and on `Shane`.
- The A2 figures in step 1: re-run from A2's own replay and scorer, exact.
- "Every `path:line` here was read by the desk on `cloud-lane-19`": two errors above were carried from the earlier review without a read (`pairings.ts:249-250`, `underlay-units.test.ts:7-8`), and `restore.ts:40` is the merge's line, not the lane's.

## 7. How faithfully r4 applied the review of r3

All eleven amendments are in r4, mostly in the review's words. Three things went wrong with them:

1. The review's A3 and A4 (keep the print's tokens; map the slots' letters) were never measured by the review (its section 6), and r4 adopted them with a replay scheduled for later. Measured now, they lower (b) (amendment 5).
2. The review's A1 used a search window and the minimum that differ from what r4 now says; r4's median was never run by anyone before this review (amendment 4).
3. Citations the review got wrong were copied rather than read (section 6).

r4 improved on the review in two places: the fallback ends 1.5 spaces above homr's next box, as Dann's rule asks, where the review ended it at the box itself; and the `engine.ts:1135` correction.

## 8. Blind spots

- **A song written whole with junk in it shows no banner.** At share 0.3, S has every system written and 3 junk rows seated (S p1 s1, p2 s3, p7 s1). The singer gets wrong words and no sign. Not new in r4, but step 1 widens it.
- **The arrival fold on the reader's output.** Every number here, as in the real-page report, is taken before `clitic-seat.ts` runs. That fold assumes a lone clitic means the tail is one note late (`clitic-seat.ts:80-86` on the merge); the reader's seating places each syllable by its own box, so the tail is not late. What the fold does to today's output is NOT ESTABLISHED; amendment 5 leaves it fewer lone clitics to act on (105 to 79).
- **Second verses.** A system seats its top Russian row only (`underlay-page.ts:160`); a printed second verse is read and never written, and no banner says so.
- **Bar numbers the singer sees against her print.** Song bars after the join match a print only where homr read every bar; a pickup or a missed bar shifts them.

## 9. What I could not establish

- Step 3 on the 16 other songs: A2's captures hold no page pixels, so B01 and B04 are the only pages measured.
- Whether a lyric of «в» + U+00A0 + «ти» reaches Lyrics and seats on its note (amendment 5, point 4). The scorer compares letters, so it cannot see this.
- What `clitic-seat.ts` does after ingest to today's output or to amendment 5's.
- Whether homr's box covers the grand staff on camera pictures.
- Time: the transcription per row ran all 18 songs, six variants, in seconds in Node; the time in a browser is not measured.

## 10. Files

`~/Downloads/_desk-2026-10-29/review-opus2-scripts.tgz` holds `step4.mjs` (variants V0 to V5), `step3.mjs` (r4's median, the minimum, homr's box top, and the two-column rule), `banner.py` (unwritten systems, their bars, piano-alone pages, where a typed word lands), `total.py`, `persong.py`, copies of A2's `cells.mjs` and resolvers and the earlier review's scripts, and the outputs: `step3-out.txt`, `step4-run.json`, `persong-V0-V1-V4.txt`, and the scorer logs under `scores/` and `scores-step4/`. The replayed MusicXML folders (`out-cells/`, `out-step4/`, 26 MB) are left out; the commands in section 3 make them again. Paths inside the scripts point at `/home/claude/a2/` (links to the unpacked archives and the lane clone), as A2's own scripts do.

NOT ESTABLISHED beats a complete invented answer.
