# Brief: N.135 stage 2b r3, the four changes the real-page measures call for

Desk (Opus 5.5), 2026-10-28. For Code in the cloud lane, Sonnet. **NOT YET REVIEWED BY FABLE**; the review runs after Sunday 2026-11-01 04:00 and its amendments are applied before this brief is sent (`docs/memory/CONTRACT.md` §1 item 19). Builds on stage 2b as built, `cloud-lane-19` at `383187a` (brief r2, `docs/sessions/brief-code-n135-stage2b_r2_2026-10-27.md`, which stands wherever this brief does not change it). Every `path:line` here was read on `cloud-lane-19` at `383187a` on 2026-10-28 unless it says otherwise.

## 1. What the singer gains

With the hidden switch `?words=read` on, a singer who drops a scanned song gets its sung words in Lyrics, seated under the notes the engraver put them under. Measured on the real page on 2026-10-28, stage 2b as built writes words on 5 of the 18 build songs, and with its song gate lifted it reads 1,514 of 2,538 printed syllables right and seats 1,451 of 2,385 exactly, against the harness's 2,086 and 1,831. The goal is 9 of 10 syllables seated right on row 114's songs on the singer's path (`docs/memory/STATE.md`, THE ONE THING). This brief makes the four changes the measures point to. Nothing changes for a singer without the switch.

Read these three reports in full before you start:

- `docs/sessions/report-desk-n135-stage2b-real-page_r1_2026-10-28.md` (the real-page measure, 18 songs).
- `docs/sessions/report-desk-n135-app-vs-harness-rows_r1_2026-10-28.md` (A1: why the app reads B01 and B04 worse than the harness).
- `docs/sessions/report-desk-n135-a2-fixes-18-songs_r1_2026-10-28.md` (A2: A1's two fixes on all 18 songs, 12 settings).

## 2. Branch

DESK DEFAULT: cut `cloud-lane-21` from `Shane` as it stands when you start, merge `origin/cloud-lane-19` into it, and report every conflict and how you resolved it. `Shane` has moved since `cloud-lane-19` was cut (row 113, HEIC, `fb2d2e37`; the retirement of `?reader=ilya` may also have landed: check `git log origin/Shane` for "retire"). Run all eight gates on the merge before step 1 and report them as the baseline.

## 3. The four changes, one commit each, each with its own report

### Step 1. The Russian-row threshold

`RUSSIAN_SHARE` (`apps/web/src/lib/omr/underlay-language.ts:27`) from 0.5 to 0.3. Leave the long-dash limit (`underlay-tokens.ts:50`, `0.5 * options.inkHeight`) as built.

Why, from A2 (a replay on a fresh capture of all 18 songs that reproduced the real-page figures song by song): at 0.3 with the dash limit as built, read right 1,514 to 1,836, seated exact (b) 1,451 to 1,671, nucleus (a) 1,591 to 1,848, word-exact (c) 559 to 638; systems with no row called Russian 37 to 19 of 239; rows seated that are not text rows 17 to 11; no word fused. Raising the dash limit to 0.75 or 1.0 lowers read right by 66 and 90 once the threshold is 0.3, and fuses 3 to 4 printed word pairs. A1's case for raising it rested on two songs; A2's 18 songs overturn it.

Update the threshold's test and keep a mutant that fails at 0.5.

### Step 2. A system that cannot be read loses only itself

Today one page with one system that has no Russian row holds back the whole song: `applyUnderlay` (`apps/web/src/lib/omr/underlay-song.ts:42-43`) writes nothing when any page fails, and `seatPage` fails a page when any banded system has no Russian row (`underlay-page.ts:173`, `:175`). On the real page that held back 13 of 18 songs; at the step 1 threshold it still holds back 9.

Change: write the words of every system that has a Russian row; a system without one, and a page that answers null, take no words, and every other system keeps its own. The console line names the systems not written, by page and system number. `UnderlayPage.passes` and `why` (`underlay-page.ts:98-101`) become per-system facts or go; say which.

What the singer is told about a song with some systems unwritten is a string, and strings are Dann's. DESK DEFAULT for this step: add no string and change no banner; the switch keeps the case hidden. In your report, count the songs among the 18 where some voice systems get words and others do not, and say which banner the song shows today in that case (`+page.svelte:2790`, `:2010`; `ingest.ts:89-90`). The desk brings Dann the wording before the switch comes off.

### Step 3. The piano's upper staff found in the ink

Today B, the lower edge of the band, is "the next staff below A in the page's order", from the staves homr boxed (`underlay-band.ts:127-128`); with no staff below A the band runs `BELOW` = 20 staff spaces under A (`:31`, `:99`). homr gave no box for the piano's upper staff in 8 of 12 B01 systems and all 11 of B04's (A1, section 5), so the band ran into the piano: B01 36 rows against the harness's 18. The extra rows cost syllables only where one was called Russian and seated (A1: B04 p3 s2; A2: 11 such rows seated over 18 songs at the step 1 threshold).

Dann's ruling (2026-10-28 15:57 and 16:00, `docs/memory/INBOX.md`): the band is the rectangle whose upper edge is the voice staff's bottom line and whose lower edge is the piano's upper staff's top line; the outer stave lines are the bounding box; rare ledger lines and their notes are ignored, and a ledger line is never a five-line group.

Change: B is the first five-line group found **in the ink** below A, never only from homr's list. Search from A's bottom line plus `MARGIN` spaces down to the next staff homr boxed below A, or to the page's end where there is none, across the middle half of A's span, with the same line finder `staffIn` uses (`metre-windows.ts:199-211`, `fives(lineRows(...))`). A group counts only when its five lines are evenly spaced at a space within 0.8 to 1.25 of A's, and its lines run across at least half of A's width (a ledger line is short; say what width test you chose and why). When the search finds nothing, fall back to homr's next staff, then to `BELOW`, as today. Test cases: a three-staff system where homr omits B (the band ends at B's top line); a ledger-line run under A (not a group); a system where homr gave B (the ink search agrees with it).

Check one more thing and report it: the ink search must never make a staff a voice staff. `systemsOf` makes a system only for a staff nearest at least one voice note (`underlay-band.ts:125-126`), and a staff found in the ink only ends a band; a two-staff system (the piano alone) holds no voice notes and gets no band (`underlay-band.ts:126`). Add a test that a page with a piano-only system writes no words to it.

### Step 4. Seating by Ilya's own vowel slots

Today a token with two or more vowel letters is cut by the engine's syllabification and placed in proportion to its letters (`underlay-units.ts:37-60`), with a second copy of the vowel list (`:24`, `VOWEL`). Dann ruled on 2026-10-28 (06:16 to 06:21, `docs/memory/INBOX.md`): one vowel per syllable, the vowel is the nucleus; a vowelless word is a clitic and joins its host by its own rules; Ilya's transcription already does this, so build from it.

Change: for each Russian row, after `sewWords`, send the row's words through the transcription and take its slots, `buildSlotQueue` (`apps/web/src/lib/score/pairings.ts:202`), which gives one slot per vowel and folds vowelless clitics into their host (`:212-228`). Pass it in from the factory as a seam, as `cut` and `isWord` are today; `omr/` imports neither the pipeline nor `score/`. Each slot becomes one unit placed inside its word's box in proportion to its letters, carrying the print's own letters, capitals, and marks (as `cutUnits` does today, `underlay-units.ts:9-12`). Where a word's slots do not add up to its printed letters, the word stays one unit and is counted, as today's `mismatched`. Then `seatTokens(units, notes, 'monotone')` as before. Retire `cutUnits`' vowel list and its test of the two copies (`underlay-units.ts:19-25`).

Vowelless lyrics alone on a note: the real-page measure counted 86 before the arrival fold (`score/clitic-seat.ts`, N.111). Count them again after this step, before the fold, and say how many the slots took.

This is the desk's proposal, built on an existing rule; it adds no phonological predicate (`CONTRACT.md` §8).

## 4. Cross-site line (`CONTRACT.md` §4)

- **Where a syllable divides.** After step 4 the slots decide seating; `sewWords` gives `syllabic` from the print's hyphens; Markup prints the transcription's syllables (`pairings.ts`). Report every word in the 18 songs' output where the written `syllabic` and the slots disagree. Step 4 removes the engine's `syllabify` from the seating path; name every other caller of it in `omr/` or say there is none.
- **The vowel letters.** `CYRILLIC_VOWEL` in `score/vowel-resolver.ts` stays the one list; step 4 retires the copy at `underlay-units.ts:24`. Grep `omr/` for any other copy and report it.
- **The staff below the voice.** After step 3, two sites decide where the piano's upper staff is: homr's boxes and this ink search. The metre worker reads homr's boxes only (`metre.worker.ts:42`); nothing depends on the two agreeing; say so, and report on how many of the 18 songs' systems they differ.
- **The Russian-row threshold.** `ocr-guard.ts` computes an unknown-word share for the poem path (`ocr-guard.ts:25`, `:53`). Say whether it shares any constant with `RUSSIAN_SHARE`; if it does, the change stays in `underlay-language.ts` only.

## 5. What may not change

As brief r2 section 6: notes do not move; ceilings (`scripts/ratchets.json`) are not raised; nothing in `static/`; no string added or changed; commit and push `cloud-lane-21` only; no pull request; no file under `docs/memory/`; no brief or review file committed.

## 6. Tests and gates

Unit tests for each step with a mutant each: the threshold at 0.5; a song with one unreadable system still writes the rest; the ink search accepting a ledger-line run; slots replaced by the old vowel cut. The eight gates at baseline except gate 4, which rises by your tests; report its exact string.

## 7. The measure on the real page

The desk measures with `docs/sessions/measure-n135-stage2b_2026-10-27/measure.mjs` on the 18 build songs in its workspace, after you report. Expectation, written now: read right at least 1,836 of 2,538 and (b) at least 1,671 of 2,385 (A2's cell at the step 1 threshold, which steps 2 to 4 ought not to lower), words written on more than 9 of 18 songs; the likeliest failure is step 3's ink search accepting a dynamic or a hairpin as a five-line group, which shows as bands cut short and a read-right count under 1,836. Also measured: the time per page beside homr's.

## 8. Report

`docs/sessions/report-code-n135-stage2b-r3-step<n>_r1_2026-10-28.md` on the lane for each step, and one summary. The answer first; each measurement with its expectation and likeliest failure written before the run; departures; the files.

## 9. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Known gaps at briefing:

- Why homr omits the piano's upper staff box (A1, section 9). Not this brief's to fix; report anything you see.
- The 8 syllables of A1's cause 3 on B04 (seating after the right rows). Step 4 may move them; report B04 before and after.
- Whether the slots path reaches a read word the dictionary does not hold (N.163): read `pipeline.ts` and report the path before you wire it.
- Share values under 0.3, and a dash limit between 0.5 and 0.75: not measured.
