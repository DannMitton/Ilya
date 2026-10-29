# Brief: N.135 stage 2b r5, the five changes the real-page measures call for

Desk (Opus 5.5), 2026-10-29 00:0x. For Code in the cloud lane, Sonnet.

**Reviews.** r5 applies every amendment of two independent adversarial Opus reviews: of r3 (`docs/sessions/review-opus-brief-n135-stage2b-r3_r1_2026-10-28.md`, 11 amendments) and of r4 (`docs/sessions/review-opus-brief-n135-stage2b-r4_r1_2026-10-29.md`, 7 must-land, 7 carry). The two Opus reviews stand in for Fable's review of this brief, at Dann's word (2026-10-28 23:21 to 23:23, `docs/memory/INBOX.md`, the 23:21 entry; `CONTRACT.md` §1 item 19). Fable reviews the lane's reports after its reset (Sunday 2026-11-01 04:00) and before Dann merges, DESK DEFAULT.

**Where every line was read.** Code builds on the merge of `Shane` and `cloud-lane-19` (section 2). The desk built that merge in its workspace (`Shane` `1e4750e5` with `cloud-lane-19` `383187a7`, tree `59eba6a7`, clean, auto-merges in `omr/restore.ts` and `omr/scan.ts` only) and read every `path:line` in this brief **on that merge tree**, 2026-10-29, unless a line says otherwise. Paths under `apps/web/src/lib/` are written from there. Where a figure comes from a review's measure that the desk did not re-run, the line says so.

## 1. What the singer gains

With the hidden switch `?words=read` on, a singer who drops a scanned song gets its sung words in Lyrics, seated under the notes the engraver put them under. Stage 2b as built writes words on 5 of the 18 build songs; with its song gate lifted it reads 1,514 of 2,538 printed syllables right and seats 1,451 of 2,385 exactly, against the harness's 2,086 and 1,831 (`report-desk-n135-stage2b-real-page_r1_2026-10-28.md`). After this brief, by the desk's and the reviews' replay on A2's captures, the page half reads 1,880 and seats 1,710 (section 8). Where Ilya cannot read a system's words, she is told which bars, by a ratified banner, and the rest of the song keeps its words. The goal is 9 of 10 syllables seated right on row 114's songs on the singer's path. Nothing changes for a singer without the switch.

Read before you start, in full: this brief; brief r2 (`brief-code-n135-stage2b_r2_2026-10-27.md`, which stands wherever r5 does not change it); the real-page report; A1 (`report-desk-n135-app-vs-harness-rows_r1_2026-10-28.md`); A2 (`report-desk-n135-a2-fixes-18-songs_r1_2026-10-28.md`); both Opus reviews. A1's section 5 premise ("homr gave no box for the piano's upper staff") is false; step 3 says why.

## 2. Branch and baseline

DESK DEFAULT: cut `cloud-lane-21` from `Shane` as it stands when you start (at least `1e4750e5`), merge `origin/cloud-lane-19` into it, and confirm the tree is `59eba6a7` when `Shane` is at `1e4750e5`; if `Shane` has moved, report its new commits and every conflict and how you resolved it. Run all eight gates on the merge before step 0 and report them as the baseline. Gate 4 on `Shane` `1e4750e5` is "3404 passed | 1 skipped (3405)"; the merge adds stage 2b's tests.

## 3. The changes, one commit each, each with its own report

### Step 0. The underlay stamp

`UNDERLAY_READER` is `'underlay@0'` (`omr/stamp.ts:36`), and `isCurrent` compares a kept reading's stamp by equality (`omr/restore.ts:40`; a kept reading is reused at `:52`). So a reading kept with the switch on under stage 2b as built would be reused under this brief and never read again. Change it to `'underlay@1'`, and in the same commit rewrite the comment above it (`omr/stamp.ts:29-35`, which says the version `0` is "not wired"). `omr/stamp.test.ts:22-25` holds as is; report that it passes.

### Step 1. The Russian-row threshold

`RUSSIAN_SHARE` (`omr/underlay-language.ts:27`) from 0.5 to 0.3. Leave the long-dash limit (`omr/underlay-tokens.ts:50`, `0.5 * options.inkHeight`) as built.

Why, from A2 (a replay on a fresh capture of all 18 songs that reproduced the real-page figures song by song): at 0.3 with the dash limit as built, read right 1,514 to 1,836, seated exact (b) 1,451 to 1,671, nucleus (a) 1,591 to 1,848, word-exact (c) 559 to 638; systems with no row called Russian 37 to 19 of 239. Rows seated that are not the harness's Russian rows go from 17 to 11: 7 overlap rows the harness labels other and 4 overlap no harness row (`cost.json`, cell `d0.5_s0.3`; the r4 review's re-read); 3 of the 7 read as text. No word is fused. Raising the dash limit lowers read right by 66 and 90 once the threshold is 0.3. The poem path's guard shares no constant with this one (`score/ingestion/ocr-guard.ts:37`, `:41`). Keep a mutant that fails at 0.5.

### Step 2. A system that cannot be read loses only itself, and the singer is told which bars

**Today.** One page with one system that has no Russian row holds back the whole song: `applyUnderlay` (`omr/underlay-song.ts:37`) writes nothing when any page answers null (`:40-41`) or fails (`:42-43`), and `seatPage` fails a page for a system with no band (`omr/underlay-page.ts:145`) or no Russian row (`:173`, `:175`). On the real page that held back 13 of 18 songs; at the step 1 threshold it still holds back 9.

This reverses Fable's amendment 7 to r2 (r2 section 4: a song's words written only when every page passes). Its reason was that a song with one bare page would show the singer no sign of the bare half. The banner below gives that sign, so the per-song rule goes.

**Change.** Write the words of every system that has a Russian row. A system without one, a system with no band, and a page that answers null take no words; every other system keeps its own. `UnderlayPage.passes` and `why` (`omr/underlay-page.ts:98-101`) become per-system facts or go; say which.

**The bars, as the song numbers them.** For each voice system not written, record its first and last bar **as the song numbers it**. `NotePlace.bar` is homr's bar on its own page (`omr/underlay-prepare.ts:56-61`), and homr numbers every page from bar 1 (B04's three captured pages each begin `<measure number="1"`, read by the desk; all 72 captured pages, the r4 review's grep); the join numbers the song's bars one after another (`omr/join-pages.ts:558`). So a song's bar is the count of `<measure>` elements in the first part of every earlier page plus the page's own bar. Compute it in `applyUnderlay` (`omr/underlay-song.ts:37`), which holds every page's MusicXML. Join ranges that touch (U5: 44 to 46 and 47 to 51 make 44 to 51). Leave out every system on a page of the piano alone: export `pianoAlonePages` (`omr/join-pages.ts:421-425`) and call it, do not copy it; the join removes that page's notes (`:530`, `:539`), so its bars are not the voice's (K page 5 holds 4 of the 19 unwritten systems at the step 1 threshold, the r4 review's count). A page that answers null names every bar of its first part that holds a voice note, unless it is a page of the piano alone. Tests: a two-page song whose unread system is on page 2 names song bars; a piano-alone page names none; a null page names its bars; touching ranges join.

**The banner** (ratified by Dann, English and French: the ranges 2026-10-28 23:12, the single bar 2026-10-29 00:00; `docs/sessions/ratified-banner-words-partly-read_2026-10-28.md`). A new key, chosen only with the switch on, for a song where at least one voice system was written and at least one was not. No other banner changes. Write the apostrophes as the file's other strings do, U+2019 (`i18n.ts` uses it throughout), DESK DEFAULT; the ratified wording is otherwise exact.

- Ranges, EN: *Ilya’s reading of printed words is still imperfect; it could not read the words in bars {bars}. Type the missing words into Lyrics exactly where they fall in the song. Check every word against your score.*
- Ranges, FR: *Ilya lit encore imparfaitement les paroles imprimées et n’a pas pu lire celles des mesures {bars}. Saisissez les paroles manquantes dans Paroles, exactement à leur place dans le chant. Vérifiez chaque mot sur votre partition.*
- One bar, EN: the first sentence ends *…it could not read the words in bar {bar}.*
- One bar, FR: *…et n’a pas pu lire celles de la mesure {bar}.*
- `{bars}`: "23 to 30"; "23 to 30 and 41 to 48"; for three ranges or more, commas and a final "and" ("4, 9 to 12, and 39"). FR: « 23 à 30 », « 23 à 30 et 41 à 48 », « 4, 9 à 12 et 39 » (no comma before « et »). The three-range form is a DESK DEFAULT, Dann's to change. A range of one bar inside a list is written as the bar alone.
- Pin all four sentences, EN and FR, in `insights/ratified-lines.test.ts` (it already pins a ratified string, row 113's).

**Where the bars ride.** A kept reading holds `musicXml` and `stamp` only (`omr/stamp.ts:39-42`), a reopened scan is ingested again from it (`omr/restore.ts:52`), and the banner is chosen from the parse's warnings (`routes/+page.svelte:2790`, the path relative to `apps/web/src/`). The bars must travel with the reading so the banner returns when the song is reopened: say where they ride (inside the joined MusicXML, or in the kept reading beside its stamp), and test the reopen. The score parser reads no `<miscellaneous>` element today (the r4 review's grep). `routes/+page.svelte` is 5,586 lines against its ceiling of 5,586 (`wc -l`, read by the desk; `scripts/ratchets.json:8`): put the banner's choice in a pure function beside `noLyricsNoticeKey` (`score/ingestion/ingest.ts:79-80`), and the page gains no net line.

**Where a typed word lands, the banner's second sentence.** A word typed between two read words takes the note right after the earlier one's last syllable, and only if that note is open (`score/reseat.ts:276-277`, `:310-313`); a word typed ahead of every read word takes the first open note (`:281-298`). In the r4 review's replay the typed words land on the gap's first note in all 12 inner gaps and at the head in 3. The sentence is untrue where the note before a gap holds no syllable (a melisma's tail, or a seating gap): report each such case in the 18 songs.

**Why the banner is built now, behind the switch:** the ratified file says it is seated when the switch comes off; the desk wrote that line, not Dann, and building it now behind the switch lets the measure see it (DESK DEFAULT).

### Step 3. The piano's upper staff, found inside homr's own box

Dann's ruling (2026-10-28 15:57 and 16:00, `docs/memory/INBOX.md:467-468`): the band runs from 1.5 staff spaces under the voice staff's bottom line to 1.5 staff spaces above the top line of the piano's upper staff; the outer stave lines are the bounding box; rare ledger lines and their notes are ignored.

**Why the band runs into the piano today**, run by the desk on A1's captured B01 page 1 (the r3 review's `boxes.mjs` on `n135-diag/app/B01/p1/page.raw`, 2026-10-28 23:3x; re-run by the r4 review): homr gives the piano's two staves as one box. Box 3 runs from y 2585 to 3063 (478 px, about 15 staff spaces, against 139 px for the voice staff's box 2); `staffIn` (`omr/metre-windows.ts:199`, keeping the staff most candidates fall on, `:223-241`) returns lines 2899 to 3019, the lower piano staff. On the same page boxes 1 and 5 return their upper staff (top lines 1415 and 3695 against box tops 1416 and 3681). B is "the next staff below A in the page's order" (`omr/underlay-band.ts:127-128`), so B's top line is often the lower piano staff's, and the band runs over the upper piano staff.

**Change.** B's top line is found in the ink:

1. Search from A's bottom line plus `MARGIN` spaces down to the **bottom** of the next box homr gave below A (into that box, not to its top), or to the page's end where there is none, across the middle half of A's span, with the line finder `staffIn` uses: `lineRows` and `fives` (`omr/metre-windows.ts:72`, `:94`), which are module-private; export them, do not copy them.
2. A group counts only when its five lines are evenly spaced at a space within 0.8 to 1.25 of A's.
3. **Across the columns that find a group, take the topmost top line that at least two columns share (within a tenth of a space), then the median of the top lines from it down to two spaces below it.** Never the minimum, and never the median of every column.
4. Where no group is found, end the band 1.5 spaces above the top of homr's next box below A, then at `BELOW` (`omr/underlay-band.ts:31`).

Why point 3, measured by the r4 review on A1's B01 and B04 pages (23 systems, its `step3.mjs`; not re-run by the desk): this rule ends 22 bands within 10 px of the harness's band end; the median of every column 21, with B01 page 1 system 4 ending 163 px low, inside the upper piano staff, because five columns found the upper staff and five the lower; the minimum 14; today 4. The 23rd, B04 page 1 system 1, is the harness's own error by the review's reading. A line one space above the piano staff, from a ledger line or a note above it, shifts a column's group a space up in 4 of 9 columns on B04 page 1 system 2.

Report, for B01 and B04, each system's band end against the harness's (`rowsys.py`'s `y1`, in A1's archive).

Tests: a homr box about twice a staff's height holding two staves where `staffIn` returns the lower (the band ends 1.5 spaces above the upper staff's top line); half the columns finding the upper staff and half the lower (the band ends at the upper); a ledger line one space above the piano staff in a third of the columns (ignored); a system where homr boxed the upper staff alone (the result agrees with today's).

**A page of the piano alone.** homr makes the piano the first part on such a page, so its systems hold notes and get bands (K page 5, five systems; the r3 review, confirmed by the r4 review). The join removes their words (`omr/join-pages.ts:530`, `:539`). Add a test that a piano-alone page's words do not reach the joined MusicXML.

### Step 4. Keep today's cut, and fold the clitics the transcription knows

Dann ruled on 2026-10-28 that a syllable holds one vowel and the vowel is its nucleus (06:16, `docs/memory/INBOX.md:459`), that a vowelless word is a clitic that joins its host by its own rules, and that Ilya's transcription already does this (06:19 and 06:21, recorded in `docs/memory/STATE.md`). Today a printed «в» standing alone takes a note of its own.

**Change.**

1. **Keep today's cut.** A token with two vowel letters or more is cut by the engine's syllabification as built (`omr/underlay-units.ts:38-83`, `cutUnits`; the cut is `GraysonEngine.syllabify`, passed in by `underlay-seams.ts:46`). Every other token stays one unit at its own box, except as point 2 says. `underlay-units.ts:24-25` and its test holding the two vowel lists equal (`omr/underlay-units.test.ts:16-19`) stay.
2. **Fold the clitics the transcription knows.** Send each Russian row's sewn words (`rowWords`, `omr/underlay-tokens.ts:92-94`) through the transcription as one line and read its own call for each word: `isProclitic` and `isEnclitic` (`pipeline.ts:776-787`). A vowelless word it calls a proclitic rides in the first printed token of the next word in the row that has a vowel; one it calls an enclitic rides in the last printed token of the word before it. Join the rider to its host with a no-break space, U+00A0, as `buildSlotQueue` does (`score/pairings.ts:225`, `:241`). The unit keeps the host token's own box. A proclitic with no host after it in the row stays its own unit and is counted.
3. **A deliberate departure from `buildSlotQueue`.** `buildSlotQueue` also folds leftward any vowelless word that is not a proclitic when a host precedes it in the line (`score/pairings.ts:218`, `w.isEnclitic || (!w.isProclitic && lastInLine !== null)`). Step 4 does not: a vowelless token the transcription does not call a clitic stays its own unit, because on a scan such a token is often a misread letter (`т`, `н`, `Тът`), and folding every vowelless token cost P 7 and B10 4 of (b) in the r4 review's replay. Name this departure in your report.
4. Pass the clitic call in from the factory as a seam, as `cut` and `isWord` are today (`underlay-seams.ts:33-47`); `omr/` imports neither the pipeline nor `score/`.
5. **Test the path whole.** A lyric `в` + U+00A0 + `ти` written by `writeLyrics` reaches Lyrics and is seated on its note as the slot «в ти» (`seatScoreWords`, `score/score-seat.ts:107`), and the arrival fold (`score/clitic-seat.ts`) leaves it as it is. If it does not, stop and report before the next commit.

Why, from the r4 review's replay on A2's 18 captures at the step 1 threshold, steps 1 and 2 applied (its `step4.mjs`; its control reproduced A2's cell exactly; not re-run by the desk): this rule gives (b) 1,710 and read right 1,880 against 1,671 and 1,836; (b) rises on 13 songs, holds on 4, and falls on B07 by 1. Cutting at the transcription's syllable boundaries instead (r4's step 4) gives 1,666 and 1,831. Count the vowelless lyrics alone on a note before the arrival fold against **105**, the replay's figure at the step 1 threshold (the real-page report's 86 is at 0.5), and report B04 before and after.

This adds no phonological predicate (`CONTRACT.md` §8): the clitic call is the transcription's.

## 4. Cross-site line (`CONTRACT.md` §4)

- **Which word is a clitic.** The transcription's call (`pipeline.ts:776-787`) is the one site; the seam passes it, and `omr/` holds no clitic list. The no-break space between a clitic and its host gains a third copy beside `score/pairings.ts:62` and `score/clitic-seat.ts:66`; name it in the report.
- **Where a syllable divides.** The engine's `syllabify` (`packages/phonology/src/engine.ts:1030`) cuts a run-together token in `cutUnits`, and the transcription's syllables, which Markup prints, come from the same function inside `transcribe` (`engine.ts:1514`, its call at `:1551`). `sewWords` gives `syllabic` from the print's hyphens. Report every word in the 18 songs' output where the written `syllabic` and the transcription's syllables disagree.
- **The vowel letters.** `CYRILLIC_VOWEL` with ѣ, і, ѵ (`score/vowel-resolver.ts:159`) and its copy `omr/underlay-units.ts:24` (held equal by `underlay-units.test.ts:16-19`); `hasVowel` without them (`clitic-merge.ts:13-20`), used at `pipeline.ts:903`; `typed-hyphens.ts:43`, without them. Step 4 adds no set; say which one decides "vowelless" in step 4's fold, and if it is not `hasVowel`, why.
- **The staff below the voice.** After step 3, homr's boxes and the ink search both bear on where the piano's upper staff is. The metre worker reads homr's boxes only (`omr/metre.worker.ts:42`); nothing depends on the two agreeing; report on how many of the 18 songs' systems they differ.
- **Bar numbers.** The join's numbering (`omr/join-pages.ts:558`) and step 2's song bars are two computations of the same number; test that they agree on a two-page song.

## 5. Citations corrected since r3

- `+page.svelte:2790` and `:2010` are on `Shane` and on the merge; on the lane they are `:2801` and `:2021`.
- `engine.ts:1135` is inside `findYoSyllable`; `transcribe` is `:1514`, its `syllabify` call `:1551`.
- `restore.ts:40` and `ingest.ts:79-80` are the merge's lines; the lane's are `:41` and `:89-90`.
- The test holding the vowel copies equal is `underlay-units.test.ts:16-19`; `:7-8` are its imports.
- `buildSlotQueue`'s row-end loss is its per-line scope (`score/pairings.ts:205-208`).
- `modernisePreReform` drops a part-final run of hard signs, not only a word-final one (`packages/dictionary/src/pre-reform-normalizer.ts:192`).

## 6. What may not change

As brief r2 section 6: notes do not move; ceilings (`scripts/ratchets.json`) are not raised; nothing in `static/`; no string added or changed except step 2's ratified banner; commit and push `cloud-lane-21` only; no pull request; no file under `docs/memory/`; no brief or review file committed.

## 7. Tests and gates

A unit test with a mutant for each step: the stamp at `underlay@0`; the threshold at 0.5; a song with one unreadable system still writes the rest, and the banner names song bars (mutant: page bars); the ink search taking the median of every column; a vowelless proclitic left as its own unit. The eight gates at baseline except gate 4, which rises by your tests; report its exact string.

## 8. The measure

**The page half, replayed.** On A2's 18 captures (review of r4, section 3): step 1 alone, with the song gate still on, read right 900 and (b) 851; steps 1 and 2, 1,836 and 1,671; step 4 as amended, 1,880 and 1,710. The desk checks Code's build against these exactly with the same replay (`tools/cells.mjs` in `~/Downloads/_desk-2026-10-28/desk-n135-a2_2026-10-28.tgz`, the r4 review's `step4.mjs` in `~/Downloads/_desk-2026-10-29/review-opus2-scripts.tgz`) before the browser run; a difference is reported before anything else. Step 3 changes the worker half and is measured in the browser run alone.

**The whole, in the browser.** The desk measures with `docs/sessions/measure-n135-stage2b_2026-10-27/measure.mjs` on the 18 build songs. Expectation, written now: read right at least 1,880 of 2,538 and (b) at least 1,710 of 2,385; step 3 adds or holds on B01 and B04; words written on every song with a Russian row, the systems not written named by song, page, system, and song bars, against A2's 19. Likeliest failure: columns split between the piano's two staves, or a line above the staff in a third of the columns, on songs other than B01 and B04, which shows as bands cut short and read right under 1,880 on those songs. Also measured: the time per page beside homr's.

## 9. Report

`docs/sessions/report-code-n135-stage2b-r5-step<n>_r1_<date>.md` on the lane for each step, and one summary. The answer first; each measurement with its expectation and likeliest failure written before the run; departures; the files.

## 10. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Known gaps at briefing:

- Step 3 on the 16 songs other than B01 and B04: only those two have captured page pixels.
- Why `staffIn` keeps the lower piano staff in some boxes and the upper in others (step 3 does not depend on it).
- What the arrival fold (`score/clitic-seat.ts`) does to the reader's output after ingest; every figure here is taken before it runs.
- Whether homr's box covers the grand staff on camera pictures.
- A song written whole with junk rows seated shows no banner (S at the step 1 threshold, 3 junk rows; the r4 review). Not this brief's to fix; report the songs.
- A printed second verse is read and not written (`omr/underlay-page.ts:160`, the top Russian row only); no banner says so. Not this brief's to fix.
- Whether the slots path reaches a read word the dictionary does not hold (N.163): read `pipeline.ts` and report the path before you wire step 4.
