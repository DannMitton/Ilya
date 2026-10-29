# Brief: N.135 stage 2b r4, the five changes the real-page measures call for

Desk (Opus 5.5), 2026-10-28 23:4x. For Code in the cloud lane, Sonnet. r4 applies the eleven amendments of an adversarial Opus review of r3 (`docs/sessions/review-opus-brief-n135-stage2b-r3_r1_2026-10-28.md`, SEND WITH AMENDMENTS); where the desk checked a claim of that review against the tree or the captured pages, the line read is cited here; where it did not, the claim is marked as the review's. One of the review's citations was wrong and is corrected (section 5). **NOT YET REVIEWED a second time**; a fresh Opus review reads r4 before it is sent (Dann 2026-10-28 23:21). Builds on stage 2b as built, `cloud-lane-19` at `383187a` (brief r2, `docs/sessions/brief-code-n135-stage2b_r2_2026-10-27.md`, stands wherever this brief does not change it). Every `path:line` here was read by the desk on `cloud-lane-19` at `383187a` on 2026-10-28 unless it says otherwise.

## 1. What the singer gains

With the hidden switch `?words=read` on, a singer who drops a scanned song gets its sung words in Lyrics, seated under the notes the engraver put them under. Measured on the real page on 2026-10-28, stage 2b as built writes words on 5 of the 18 build songs; with its song gate lifted it reads 1,514 of 2,538 printed syllables right and seats 1,451 of 2,385 exactly, against the harness's 2,086 and 1,831. The goal is 9 of 10 syllables seated right on row 114's songs on the singer's path (`docs/memory/STATE.md`, THE ONE THING). Nothing changes for a singer without the switch.

Read these in full before you start: `docs/sessions/report-desk-n135-stage2b-real-page_r1_2026-10-28.md`, `report-desk-n135-app-vs-harness-rows_r1_2026-10-28.md` (A1), `report-desk-n135-a2-fixes-18-songs_r1_2026-10-28.md` (A2), and the Opus review above. A1's section 5 premise ("homr gave no box for the piano's upper staff") is false; step 3 says why.

## 2. Branch

DESK DEFAULT: cut `cloud-lane-21` from `Shane` as it stands when you start (at least `1e4750e5`), merge `origin/cloud-lane-19` into it, and report every conflict and how you resolved it. The review's trial merge of `Shane` `1e4750e5` with `383187a` was clean (`git merge-tree`, tree `59eba6a7`; the review's command, not re-run by the desk). Run all eight gates on the merge before step 0 and report them as the baseline.

## 3. The changes, one commit each, each with its own report

### Step 0. The underlay stamp

`UNDERLAY_READER` is `'underlay@0'` (`apps/web/src/lib/omr/stamp.ts:36`), and `isCurrent` compares a kept reading's stamp by equality (`omr/restore.ts:40`). So a reading kept with the switch on under stage 2b as built would be reused under this brief and never read again. Change it to `'underlay@1'`. `stamp.test.ts` keeps holding `READER_STAMP` and `UNDERLAY_READER` apart; say which of its lines you read.

### Step 1. The Russian-row threshold

`RUSSIAN_SHARE` (`omr/underlay-language.ts:27`) from 0.5 to 0.3. Leave the long-dash limit (`omr/underlay-tokens.ts:50`, `0.5 * options.inkHeight`) as built.

Why, from A2 (a replay on a fresh capture of all 18 songs that reproduced the real-page figures song by song): at 0.3 with the dash limit as built, read right 1,514 to 1,836, seated exact (b) 1,451 to 1,671, nucleus (a) 1,591 to 1,848, word-exact (c) 559 to 638; systems with no row called Russian 37 to 19 of 239; rows seated that the harness labels other or no text 17 to 11, of which 4 lie outside the harness's bands (`cost.json`, cell `d0.5_s0.3`, the review's count, A8); no word fused. Raising the dash limit lowers read right by 66 and 90 once the threshold is 0.3. The poem path's guard shares no constant with this one: `score/ingestion/ocr-guard.ts:37` (`MIN_TOKEN_LENGTH = 3`) and `:41` (`MAX_UNKNOWN_SHARE = 0.5`) (the review's reading). Keep a mutant that fails at 0.5.

### Step 2. A system that cannot be read loses only itself

Today one page with one system that has no Russian row holds back the whole song: `applyUnderlay` (`omr/underlay-song.ts:42-43`) writes nothing when any page fails, and `seatPage` fails a page when any banded system has no Russian row (`omr/underlay-page.ts:173`, `:175`). On the real page that held back 13 of 18 songs; at the step 1 threshold it still holds back 9.

This reverses Fable's amendment 7 to r2 (r2 section 4: a song's words written only when every page passes). It is reversed because the singer now gets a ratified banner naming the unread bars (below), which removes the reason for the per-song rule.

Change: write the words of every system that has a Russian row; a system without one, and a page that answers null, take no words, and every other system keeps its own. Record, for each system not written, its first and last bar (`omr/underlay-prepare.ts`, `NotePlace.bar`; say the line you used). The console line names the systems not written by page, system, and bars. `UnderlayPage.passes` and `why` (`omr/underlay-page.ts:98-101`) become per-system facts or go; say which.

**The banner (ratified by Dann 2026-10-28 23:12, `docs/sessions/ratified-banner-words-partly-read_2026-10-28.md`):** add it as a new key, shown only with the switch on, for a song where some voice systems get words and others do not. Do not change any other banner.

- EN: *Ilya's reading of printed words is still imperfect; it could not read the words in bars {bars}. Type the missing words into Lyrics exactly where they fall in the song. Check every word against your score.*
- FR: *Ilya lit encore imparfaitement les paroles imprimées et n'a pas pu lire celles des mesures {bars}. Saisissez les paroles manquantes dans Paroles, exactement à leur place dans le chant. Vérifiez chaque mot sur votre partition.*
- `{bars}`: "23 to 30", "23 to 30 and 41 to 48"; FR « 23 à 30 », « 23 à 30 et 41 à 48 ». Pin both in `apps/web/src/lib/insights/ratified-lines.test.ts`, as earlier ratified strings are pinned.

Before you write the banner's code, read how words typed into Lyrics are seated when some notes already carry read words (`score/score-seat.ts`, `seatScoreWords`, and whatever Lyrics edits call), and report whether a word typed "where it falls in the song" lands in the unread bars and leaves the read words where they are. If it does not, stop at that point and report; the banner's second sentence would be untrue.

### Step 3. The piano's upper staff, found inside homr's own box

Dann's ruling (2026-10-28 15:57 and 16:00, `docs/memory/INBOX.md:467-468`): the band runs from 1.5 staff spaces under the voice staff's bottom line to 1.5 staff spaces above the top line of the piano's upper staff; the outer stave lines are the bounding box; rare ledger lines and their notes are ignored.

Why the band runs into the piano today, checked by the desk on A1's captured B01 page 1 (`boxes.mjs` from the review, run by the desk 2026-10-28 23:3x on `n135-diag/app/B01/p1/page.raw`): homr gives the piano's two staves as one box. Box 3 runs from y 2585 to 3063 (478 px, about 15 staff spaces against 139 px for the voice staff's box 2); `staffIn` (`omr/metre-windows.ts:199`, keeping the staff most candidates fall on, `:223-241`) returns lines 2899 to 3019, the lower piano staff. On the same page boxes 1 and 5 return their upper staff (top lines 1415 and 3695 against box tops 1416 and 3681), so which staff `staffIn` keeps varies. B is "the next staff below A in the page's order" (`omr/underlay-band.ts:127-128`), so B's top line is often the lower piano staff's, and the band runs over the upper piano staff. The review counts 248 of 506 homr boxes over the 18 songs as more than 2.5 times the smallest box on their page (its count, not re-run by the desk).

Change: B's top line is the top line of the first five-line group found in the ink below A, searched from A's bottom line plus `MARGIN` spaces down to the **bottom** of the next box homr gave below A (into that box, not to its top), or to the page's end where there is none, across the middle half of A's span, with the line finder `staffIn` uses (`metre-windows.ts:199-241`, `fives(lineRows(...))`). A group counts only when its five lines are evenly spaced at a space within 0.8 to 1.25 of A's. Across the columns that find a group, take the **median** top line, never the minimum: the review found, on B04 p1 s1 to s4 and B01 p3 s4, single columns where a line one space above the piano staff (a ledger line or a note above it) pairs with four staff lines and shifts the group a space up (B04 p1: 1171 against the box top 1203; the review's figures, not re-run by the desk). Where no group is found, end the band 1.5 spaces above the top of homr's next box, then at `BELOW` (`underlay-band.ts:31`). Report, for B01 and B04, each system's band end against the harness's (`rowsys.py`'s `y1`, in the A1 archive).

Tests: a homr box about twice a staff's height holding two staves where `staffIn` returns the lower (the band ends at the upper staff's top line minus 1.5 spaces); a ledger line one space above the piano staff in some columns (the median ignores it); a system where homr boxed the upper staff alone (the result agrees with today's).

**A page of the piano alone.** homr makes the piano the first part on such a page, so its systems hold notes and get bands (the review: K page 5, five systems, all banded; not re-run by the desk). The join removes their words: `omr/join-pages.ts:530` marks piano-alone pages (`pianoAlonePages`, `:421-425`) and `:539` takes their notes out (`withoutNotes`, `:428`). Add a test that a piano-alone page's words do not reach the joined MusicXML, and report how many of the 19 systems with no Russian row at the step 1 threshold are on piano-alone pages (the review: K page 5 holds 4).

### Step 4. Seating by Ilya's own syllables, keeping the print's boxes

Today a token with two or more vowel letters is cut by the engine's syllabification and placed in proportion to its letters (`omr/underlay-units.ts:37-60`), with a second copy of the vowel list (`:24`). Dann ruled on 2026-10-28 that a syllable holds one vowel and the vowel is its nucleus, that a vowelless word is a clitic that joins its host by its own rules, and that Ilya's transcription already does this (06:16, `docs/memory/INBOX.md:459`; 06:19 and 06:21 as recorded in `docs/memory/STATE.md`).

Change:

1. **Keep the print's tokens.** A printed token with one vowel letter or none stays one unit at its own box, as today. A token with two vowel letters or more (the run-together case of the 06:16 ruling) is cut at the syllable boundaries the transcription gives inside it, each piece placed inside that token's box in proportion to its letters. Where the transcription's boundaries inside a word do not land on the print's token boundaries, the print's tokens stand, and the word is counted. Why: the review counted, at the step 1 threshold, 495 words printed as several tokens (1,123 tokens), 81 of them with the transcription's cut differing from the print's (185 syllables) and 137 with different counts (320 syllables) (its `span2.mjs`; not re-run by the desk). Placing every syllable by letters would discard where the engraver put them.
2. **The syllables come from the transcription's slots.** Send each Russian row's sewn words through the transcription and take its slots, `buildSlotQueue` (`score/pairings.ts:202`), which folds a vowelless clitic into its host (`:212-228`) and gives one slot per syllable of each word (`:229-248`). Pass it in from the factory as a seam, as `cut` and `isWord` are today; `omr/` imports neither the pipeline nor `score/`. Send each row as one line.
3. **Only the boundaries come from the slots; the letters come from the print.** The transcription modernises a pre-reform word before it cuts it (`pipeline.ts:533-537`, `modernisePreReform`, which drops a word-final hard sign, `packages/dictionary/src/pre-reform-normalizer.ts:192`), and it may restore ё. Take the slots' boundaries as letter counts, map a dropped final ъ to the last slot of its word, treat е for ё and the pre-reform letters one for one, and count the words where the mapping fails. The written text is the print's (r2 step 10).
4. **A vowelless word at a row's end.** `buildSlotQueue` holds a proclitic for the next syllable in the same line (`pairings.ts:205-208`) and clears it at the line's end (`:249-250`), so a row ending in «в» loses that word. Keep such a word as its own unit, as today, and count it.
5. Retire `cutUnits`' vowel list (`underlay-units.ts:24`) and its test of the two copies (`underlay-units.test.ts`, the review cites `:7-8`; read it).

Count the vowelless lyrics alone on a note before the arrival fold (`score/clitic-seat.ts`), against the real-page report's 86, and report B04 before and after (A1's cause 3: 8 syllables).

This is the desk's proposal, built on existing rules; it adds no phonological predicate (`CONTRACT.md` §8).

## 4. Cross-site line (`CONTRACT.md` §4)

- **Where a syllable divides.** After step 4 the transcription's slots set the cut inside a run-together token; the print's hyphens set it everywhere else; `sewWords` gives `syllabic` from the print's hyphens; Markup prints the transcription's syllables (`pairings.ts`). The engine's cut reaches seating through `transcribe` (`packages/phonology/src/engine.ts:1514`, its `syllabify` call at `:1551`), not through `cutUnits`. Report every word in the 18 songs' output where the written `syllabic` and the slots disagree.
- **The vowel letters.** Step 4's path reads at least three sets: `CYRILLIC_VOWEL` with ѣ, і, ѵ (`score/vowel-resolver.ts:159`) in `buildSlotQueue`; `hasVowel` without them (`clitic-merge.ts:13-20`) deciding vowelless words at `pipeline.ts:903`; and the engine's `syllabify` (`engine.ts:1030`), which the review found gives `дѣтямъ` as one piece. A pre-reform word the pipeline does not modernise therefore gets fewer slots than vowel letters (the review: 74 of 606 such words at the step 1 threshold; not re-run by the desk). Step 4 retires `underlay-units.ts:24`; a fifth copy, outside `omr/`, is `typed-hyphens.ts:43` (without ѣ, і, or ѵ). Report the sets and the count; add no new set.
- **The staff below the voice.** After step 3, homr's boxes and the ink search both bear on where the piano's upper staff is. The metre worker reads homr's boxes only (`omr/metre.worker.ts:42`); nothing depends on the two agreeing; say so, and report on how many of the 18 songs' systems they differ.
- **The Russian-row threshold.** As step 1: no shared constant.

## 5. Citations corrected from r3 and from the review

- `+page.svelte:2790` and `:2010` are on `Shane`; on the lane they are `:2801` and `:2021` (the review).
- The review's "the slots are `transcribe`'s syllables (`engine.ts:1135`)" is wrong: `engine.ts:1135` is inside `findYoSyllable`. `transcribe` begins at `:1514` and calls `syllabify` at `:1551`.
- r3's "a two-staff system (the piano alone) holds no voice notes" was wrong (step 3).
- r3's "11 such rows" seated in the piano area: 4 lie outside the harness's bands (step 1).

## 6. What may not change

As brief r2 section 6: notes do not move; ceilings (`scripts/ratchets.json`) are not raised; nothing in `static/`; no string added or changed except the ratified banner of step 2; commit and push `cloud-lane-21` only; no pull request; no file under `docs/memory/`; no brief or review file committed.

## 7. Tests and gates

A unit test with a mutant for each step: the stamp; the threshold at 0.5; a song with one unreadable system still writes the rest, and the banner names its bars; the ink search taking the minimum instead of the median; slots placed by letters across print tokens. The eight gates at baseline except gate 4, which rises by your tests; report its exact string.

## 8. The measure

**Before the browser run, the desk replays steps 1, 2, and 4** on A2's 18 captures (`~/Downloads/_desk-2026-10-28/desk-n135-a2_2026-10-28.tgz`, `tools/cells.mjs` and the scorer) and reports read right and (b) after each step; step 4 is expected not to lower (b) below step 2's figure. A2's replay of the page half matched the app's own `seatPage` and language calls in 1,032 checks with 0 mismatches (A2 report, section 1). Step 3 changes the worker half and is measured in the browser run alone.

Then the desk measures the whole with `docs/sessions/measure-n135-stage2b_2026-10-27/measure.mjs` on the 18 build songs. Expectation, written now: read right at least 1,836 of 2,538 and (b) at least 1,671 of 2,385; words written on every song with a Russian row, the systems not written named by song, page, and system against A2's 19. Likeliest failure: step 3's median group landing on a dynamic or hairpin row in some columns, which shows as bands cut short and a read-right count under 1,836. Also measured: the time per page beside homr's.

## 9. Report

`docs/sessions/report-code-n135-stage2b-r4-step<n>_r1_<date>.md` on the lane for each step, and one summary. The answer first; each measurement with its expectation and likeliest failure written before the run; departures; the files.

## 10. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Known gaps at briefing:

- Why `staffIn` keeps the lower piano staff in some boxes and the upper in others (step 3 avoids depending on it).
- Whether homr's box covers the grand staff on camera pictures.
- Whose box a clitic folded into its host takes when the two were printed as separate tokens («в» and «бью»). DESK DEFAULT: the host's own token box carries the folded text; report each case.
- What step 4 does to (b): the desk's replay (section 8) answers it.
- Whether the slots path reaches a read word the dictionary does not hold (N.163): read `pipeline.ts` and report the path before you wire it.
