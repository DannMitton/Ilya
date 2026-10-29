# Report: N.135 stage 2b r5, step 7, the scan reader counts, and changes nothing (Code, cloud lane, 2026-10-29, r1)

Branch `cloud-lane-21`, on top of step 6 (`d61cd802`). One commit. Under the desk's ruling in the brief's last section, step 7A is **withdrawn as a behaviour** and 7C is **count only**; 7B is unchanged. No fold decision, no seat, no word changed in this step.

## The answer first

1. **7A, counted.** A clitic the transcription calls a clitic always joins its host, as step 4 built it. `foldClitics` (`omr/underlay-clitics.ts:87`) now also takes the system's free notes and reports, in `counts.ownNote`, each folded clitic the print appears to give a note of its own, by amendment 10's one rule: C is the free note nearest the clitic's box centre; H the free note nearest the centre of the unit it joined; it has a note of its own where C differs from H, unless C is also the nearest free note of the unit next to it on its other side. `seatPage` rolls it into `stats.clitics.ownNote` (a count) and `stats.counted.ownNote` (each one's system, row, text, and x).
2. **7B unchanged:** a vowelless token the transcription does not call a clitic stays a unit at its own box (step 4's named departure). Not touched.
3. **7C, counted, the two sources kept apart** (`omr/underlay-counts.ts`): `manyVowels.cut` (a unit of two vowels or more that `cutUnits` left whole, counted on the units before seating; `manyVowelsInUnits`, `:47`) and `manyVowels.merged` (two tokens seated on one note whose joined text holds two vowels or more, counted on the seats `seatPage` hands to `sewWords`; `manyVowelsMerged`, `:52`). Each entry has the text, the box, and the number of free noteheads between x0 and x1.
4. **A third source the brief does not name, found by running step 6's check:** an unseated unit whose letters `sewWords` joins to the next syllable of its word. In `underlay-page.test.ts`'s first seating case, «шумного» is cut «шум | но | го» for five notes; the alignment leaves «но» out and its letters join the next syllable, so one note carries «ного» (two vowels). Neither of the two counts sees it (the cut was good, no two tokens share a note). So `seatPage` also runs `vowelsPerNote` (step 6) over the sewn words it returns, `stats.counted.breaches` (`omr/underlay-page.ts:223`), which catches every source. The reader's console line now says the counts (`omr/underlay-reader.ts`, `counted`).
5. **Gates:** 1 291 passed (291). 2 248 passed (248). 3 found 0 errors and 12 warnings in 5 files. **4 3664 passed | 1 skipped (3665).** 5 775 passed | 5 skipped (780). 6 145 passed (145). 7 55 passed (55). 8 ratchets: OK.

## Tests and mutants

- `underlay-clitics.test.ts` (count tests, 5): «в» on a free note of its own with its host on the next note is counted and still folded; «В бью» as one group over one notehead is not counted (C equals H); a «В» whose centre drifts onto the previous unit's note is not counted, and is counted alone; an enclitic by the same rule; nothing counted with no free notes. **Mutant:** the neighbour clause dropped (`if (true)`): two tests fail (the drift case and the enclitic case). C different from H alone is the brief r1/r2 geometry the review showed misfires on a dense print.
- `underlay-counts.test.ts` (7) and `underlay-page.test.ts` (2 new, 2 re-keyed): the cut count with its notes-between; the merged count; neither changes anything it is given; the breaches count.

## Step 6's check on the existing integration tests' pages, the counts

The words the fake underlay readers write in `omr/underlay-integration.test.ts` are invented single-syllable words, one per note, to prove plumbing: page 1 «Средь», «шумного»; page 2 «бала», «случайно»; page 3 «в», «тревоге». `vowelsPerNote` (run once, a probe not committed) reports: page 1 one breach («шумного», many-vowels); page 2 two («бала», «случайно», many-vowels); page 3 two («в», no-vowel; «тревоге», many-vowels). 5 breaches on 6 notes. **They break the rule on purpose of the test's shape, not as a reading of a print**; they are not a tracked file, so step 8's rule test does not see them. I changed none. The seating case above is the one real seat: 1 breach on 5 notes («ного»).

## Amendment 11, for each `clitics.ownNote` in the integration tests

The integration tests produce none (their words hold no vowelless clitic). The one the unit tests produce is the invented «в» in `underlay-page.test.ts` ("seats a printed «в» on the note of its host"): counted at system 1 row 1, x 90. How many notes the page's arrival fold would move for it: not run; the reader folds it, so the lyric is written «в мир» and the arrival fold finds no lone clitic (the step 4 whole-path test shows that). NOT ESTABLISHED for a real scan: the desk decides whether the order of evidence wants a scan's ownNote clitic left on its note.

## Departures

- The brief says "a stat `clitics.ownNote`"; it is a number there and a list beside it (`stats.counted.ownNote`), so the report can name each.
- `nearestOf` is now exported (`omr/underlay-seat.ts:108`), unchanged.
- The `breaches` count (4 above) is mine; the desk asked for counts of two sources.

## NOT ESTABLISHED

The counts on the 18 songs: the replay and the browser run are the desk's. Whether any `ownNote` appears on a real scan.

## Files

`omr/underlay-clitics.ts`, `omr/underlay-clitics.test.ts`, `omr/underlay-counts.ts` (new), `omr/underlay-counts.test.ts` (new), `omr/underlay-page.ts`, `omr/underlay-page.test.ts`, `omr/underlay-reader.ts`, `omr/underlay-seat.ts` (one `export`), `omr/underlay-integration.test.ts` and `omr/underlay-song.test.ts` (one stats field), this report.
