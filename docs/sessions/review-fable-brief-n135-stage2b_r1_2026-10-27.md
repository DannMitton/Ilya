SEND WITH AMENDMENTS

# Review: brief-code-n135-stage2b_r1_2026-10-27 (Fable, 2026-10-27)

Report written incrementally. Each claim about code carries a file:line read this session in `/root/lanes/shane` (trunk `Shane`) or `/root/lanes/l16` (`cloud-lane-16`).

Order: the Q1 spot-check first (it grounds amendment 1), then the twelve amendments, the short answers, and what could not be established.

### Q1 spot-check of path:lines on `Shane` at 7238b77 (read 2026-10-27)

Right: `homr-reader.ts` is 434 lines; `deps.metres` call at `:312`; `joinLookingAtPages` at `:379`; factory `makeReader({` at `:403` to `:414`; `rowsys.py:37-39` band rule, `:40` the 40 px drop; `+page.svelte:2829` is the `fillText` line (2827 to 2831 is the whole statement); `score-seat.ts:107` is `export function seatScoreWords(`; `i18n.ts:1458` is `upload.banner.noLyricsScan`; `ratchets.json:3` newFileMaxLines 1000, `:8` +page.svelte 5586, `:19` ScoreUploader 1358; `stamp.ts:23` READER_STAMP; `join-pages.ts:438` placeOf (brief says 435-439, close enough); `metre-windows.ts:47-53` interface Staff; `engine.ts:1030` syllabify; `pre-reform-normalizer.ts:244` modernisePreReform; `metre-client.ts` 59 and `metre.worker.ts` 60 lines; `package.json:27` tesseract.js ^7.0.0; `tokens_of` is at `docs/sessions/measure-n135-underlay-harness_2026-10-15/score44.py:21` and `docs/sessions/measure-row82-retrain_2026-10-15/harness/score44.py:21` (closes section 11's fourth gap).

Off by one: `ReaderDeps` starts at `homr-reader.ts:86`, not 87 (comment 85, `export interface ReaderDeps {` 86).

WRONG, load-bearing: step 2 says `result.staves` is read "as `Staff`, with `space`". It is not. `result.staves` is `StaffBoxLike[]`: homr's page-normalised boxes `{cx, cy, w, h, index}` (`metre-windows.ts:36-42`; `metre.worker.ts:19`; `metre-client.ts:16`). `Staff` with `space` and five line samples is what `staffIn(g, box)` finds in the ink inside that box (`metre-windows.ts:199`, `:241`). So "do not find staves again" cannot be obeyed as written: the band needs line ys and a space, and the only existing site that gives them is `staffIn`. Amendment 1 below. Consequence for section 7: the staff space is already measured once per page by the metre worker (`metre.worker.ts:42` via `readPageMetres`), so this stage adds a second measurement of it in its own worker unless the two workers share one; the brief's "never measured twice" is a claim it cannot keep, and must instead name the two sites.

## Amendments (exact replacement text for r2)

### 1. Section 3 step 2 (the band): the staff geometry is found by `staffIn`, not carried by `result.staves`

Replace the last sentence of step 2 ("Use the staff geometry homr already returns ... do not find staves again.") with:

> `result.staves` is homr's list of page-normalised boxes, `StaffBoxLike` `{cx, cy, w, h, index}`, fractions of the page (`metre-windows.ts:36-42`; it is what `deps.metres` receives, `metre-client.ts:16`). It carries no line positions and no space. The five lines and the space come from `staffIn(grey, box)` (`metre-windows.ts:199`, returning `Staff` with `ls`, `space`, `metre-windows.ts:47-53`, `:241`), with `linesAt(st, x)` for the five line ys at a column (`:128`). Call `staffIn` once per staff box on the page, in this stage's worker, and keep the `Staff` with the box; A's bottom line is `linesAt(A, x)[4]` and B's top line `linesAt(B, x)[0]` at the system's centre column, DESK DEFAULT. The staff space of a system is `A.space`, passed to `cutRows` and `frameRow`. Convert `imgpos` (page pixels, `join-pages.ts:438`) and the boxes (page fractions) to one unit before the nearest-staff test, and say which in the report. The metre worker already runs `staffIn` on the same boxes (`metre.worker.ts:42` via `readPageMetres`); this stage is a second call of it on the same page, named as such in section 7.

### 2. Section 3 step 1 and section 7, third bullet: the worker, and the staff space's two sites

In step 1, replace "Its worker and client follow `metre-client.ts` and `metre.worker.ts` (59 and 60 lines)." with:

> `tesseract.js`'s `createWorker` makes its own Worker (the review of 2026-10-15, amendment 6). Build the client on `metre-client.ts`'s request and reply shape (`metre-client.ts:16`, `:47-53`) and the pure steps (band, rows, frame, tokens, seating) in one Worker of this stage's own on `metre.worker.ts`'s pattern, but do not nest `createWorker` inside that Worker unless you have measured that the nested form loads in headless Chromium; say which form you built and the measurement. `createWorker` takes `workerPath`, `corePath`, and `langPath` and every one names Ilya's own origin: the defaults are a CDN, and the poem path's `createWorker('rus')` with no paths (`ScoreUploader.svelte:449-450`) is what N.197's remainder (QUEUE row 155) exists to retire; do not add a second CDN fetch.

Replace section 7's third bullet with:

> **The staff space.** Two sites measure it from the ink inside homr's box: the metre worker (`metre.worker.ts:42`, `staffIn` at `metre-windows.ts:199`) and this stage's worker (step 2). Within this stage, one `Staff` per staff box, passed down to the band, `cutRows`, and `frameRow`, never measured again. What depends on the two workers agreeing: nothing today, because neither reads the other's output; say so, and report the two `space` values on one page of the Sunless PDF (amendment 8) so a future reader can see them equal.

### 3. Section 3 step 7 and step 8: the dictionary and the engine reach `omr/` as functions

Replace step 7's first clause "`rowLanguage(words, isWord)` with `isWord` from `packages/dictionary`;" with:

> `rowLanguage(words, isWord)` with `isWord` = `isKnownWord` (`apps/web/src/lib/pipeline.ts:225`) passed in from the factory in `homr-reader.ts` on the pattern of `ocr-guard.ts:25` and `:53` (`unknownWordShare(text, isKnownWord)`); `pipeline.ts:9-11` names itself the only importer of `@ilya/dictionary`, and this stage keeps that true;

In step 8, replace "by the engine's own cut, `GraysonEngine.syllabify` (`packages/phonology/src/engine.ts:1030`)" with:

> by the engine's own cut, `GraysonEngine.syllabify` (`packages/phonology/src/engine.ts:1030`), passed in as `cut: (word: string) => string[]` from the factory (the engine is already imported in `pipeline.ts:15`), never imported into `omr/` (stage 2a review, amendment 4)

### 4. Section 3 step 10 (spelling): strike it

Replace step 10 with:

> 10. **Spelling.** `writeLyrics` writes each syllable as read, pre-reform letters and all (`underlay-words.ts:13` on `cloud-lane-16`; the 2026-10-15 review, amendment 5, applied). It does not call `modernisePreReform`. The modern form is the pipeline's: intake modernisation on Dann's 2026-08-08 ruling (`pipeline.ts:548-552`), the normaliser fallback only when the direct lookup misses (`:544-547`, `:568-575`). A second call in `omr/` would modernise a word before the pipeline sees the print and lose the engraver's form. Capitals and punctuation as read.

### 5. Section 3 step 11 (the stamp): the constants stay; the switch passes its own stamp

Replace step 11 with:

> 11. **The stamp.** `READER_STAMP` and `UNDERLAY_READER` (`stamp.ts:23`, `:36` on `cloud-lane-16`) do not change, and `stamp.test.ts:22` keeps holding them apart. `isCurrent(reading, stamp)` already takes the stamp to compare against (`restore.ts:40`); with the switch on, the scan path passes `${READER_STAMP}+${UNDERLAY_READER}` (DESK DEFAULT on the separator) to `isCurrent` and stamps the kept reading with it; with the switch off it passes nothing, as today. So a reading kept with the switch off is read again when the switch is on (the one re-read, on the one device with the switch), and a reading kept with the switch on is read again when the switch is off, and its words are gone then; both re-reads are silent only where the song has no hand work (`stamp.ts:7-9`). Report the two cases with the line that decides each. The join of `UNDERLAY_READER` into `READER_STAMP` stays with the commit that removes the switch (the 2026-10-15 review, amendment 7).

### 6. Section 6, the `static/` bullet: where the model lives, and the service worker

Replace the `static/` bullet with:

> `static/`: nothing under `apps/web/static/omr/` is committed; the folder is git-ignored (`.gitignore:37-42`) and filled at `dev` and `build` by the copy scripts (`apps/web/package.json:9-10`). The underlay model and the two core files follow `copy-metre-model.mjs` (`apps/web/scripts/copy-metre-model.mjs:1-25`): a committed source folder, `apps/web/omr-underlay/` (DESK DEFAULT on the name), copied to `static/omr/models/underlay/` at build, so that `/omr/` keeps them out of the service worker's cache (`static/sw.js:57-60`) and the browser's HTTP cache holds them. **Before any model or core file is committed anywhere in the tree, or copied into `static/` by a script you add, write each file's byte count in the report and stop; the desk tells Dann (`CONTRACT.md` §8, last bullet).** Until Dann says yes, the worker names the paths and the files are absent: the fetch fails, the page answers null, and the join is as today. Who downloads what: only this stage's worker fetches the model and core, and the factory makes the worker only with the switch on (step 1), so a singer without the switch downloads nothing new; prove it with the network log of the switched-off screenshot run (section 5), not with the service worker, which cannot see the switch. Strike "The service worker caches them only once the switch is on".

### 7. Section 4 (the threshold): per song, so that no song is half written under no banner

Replace section 4 with:

> DESK DEFAULT, from the 2026-10-15 brief's section 5, tightened: a page passes when `rowLanguage` calls at least one Russian row per system of the page and at least half of the sewn words of those rows pass the dictionary. **A song's words are written only when every page of it that holds a voice staff passes;** otherwise nothing is written and the song takes today's path and today's banner. Why per song: the banner is chosen per song from the `no-lyrics-found` warning (`+page.svelte:2790`, `:2010`; `ingest.ts:89-90`), so a song with one passing page and one failing page would fill Lyrics with the first page's words, seat them, and show no banner on the second page's bare notes, a half the singer is not told about. Report, per build song, how many pages pass and how many songs are written.

### 8. Sections 2 and 9: the measure has been taken; what the real-page measure is compared against; what the desk stages

In section 2, replace "**The frame and the hybrid were never measured together; this stage's measure is the first that does, so no number is expected within a tolerance (DESK DEFAULT).** The scripts that produced the frame and hybrid numbers are not in the tree and are lost; the two reports are the specification." with:

> **The frame and the hybrid were measured together on 2026-10-27 after this brief was first written** (`report-desk-n135-frame-plus-c2_r1_2026-10-27.md`, in the desk's workspace; to be filed under `docs/sessions/`): C2 on the framed readings, 2,086 of 2,538 read right, seats (b) exact **1,831**, (a) nucleus **2,032**, (c) word-exact **1,166** on the 2,385 truth syllable notes (its table, lines 9 to 13), against C2 unframed 1,630 / 1,955 / 812 reproduced exactly as the control. The noise floor on the read-right count is +6 and +19 on a nine-song total (row 117); the seating has not been repeated on a shifted frame. The harness scripts are recovered: row 117's `clean.py` and `read-dfloat-chrome.mjs`, lever 2's `step1c.py` and `lever2.py`, and the combined `map_boxes.py`, in the desk's workspace under `measures/n135-row117/`, `measures/n135-lever2/`, and `measures/n135-combined/`.

In section 9, after "and the time per page.", append:

> **Done-when for the real page:** the desk's measure on the 18 build songs through `measure.mjs` is compared with 2,086 read right and 1,831 / 2,032 / 1,166 seated. The expectation, written before the run: read right within 20 of 2,086 (the noise floor), (b) within 40 of 1,831; the likeliest failure is `cutRows` on the real band cutting rows the harness's `rows2/*.jsonl` did not (stage 2a step 1, NOT ESTABLISHED on real rasters), which shows as a read-right count far under 2,086 before any seating number is looked at. A real-page count that is lower and unexplained is reported as such; the page is not declared read (`CONTRACT.md` §1 item 18).
>
> The PDF exists: `tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf` (Sunless 1, Lamm; a voice staff with words). Without the model in your clone, your own run of `measure.mjs` on it proves only the driver (the drop, the wait, the two output files) and writes a MusicXML with no `<lyric>`; say so in the report rather than reporting a count. Build the model's paths so that the desk can run the same script with the files in place and no edit.
>
> **What the desk stages** before its run: the model (`rus_prereform_r2_29000.traineddata`, 7,827,478 bytes) and the core files into `apps/web/omr-underlay/`; the 18 build PDFs; the truth files and the scorer (`score117.py`, `step1c.py`, `lever2.py`); and homr's models, which `fetch-omr-models.mjs` downloads at build.

### 9. Stage 2a review amendments 4 to 9, placed

- **Amendment 4 (a token splitter; the engine cut passed in)** goes into section 3 steps 6 and 8: step 6 names a pure `splitTokens(tokens)` in a new file `underlay-tokens.ts` on `score44.tokens_of` (`docs/sessions/measure-n135-underlay-harness_2026-10-15/score44.py:21-30`), run before step 8; step 8's cut is the function of amendment 3 above. Must land in this stage: without it no measured seating number can be reproduced.
- **Amendment 5 (the sweep over the ink pixels)** goes into section 3 step 4 as a required change to `frameRow` before the measure, with its timing line (the 3,400 by 90 row under 100 ms): the probe put 1,320 ms of `frameRow` in `skewAngle` on one full-width row, and section 11's second gap ("do not cut the frame to save time") is answered by it, because it computes the same quantity. Must land before the real-page measure, or the time per page is 15 to 30 s of sweep before a letter is read.
- **Amendment 6 (sweep padding derived from the width)** goes into step 4 beside amendment 5, with its test (a 3,400 by 50 row tilted 2.8 degrees).
- **Amendment 7 (a cap on the scale factor)** goes into step 4; it never binds on a row from `cutRows` and only guards a caller.
- **Amendment 8 (`PAPER_GRID` as a proportion)** goes into step 3: the band passes `paper` from the page, so the fallback is rarely used; the proportion is a one-line change with its test re-keyed. Can land here or be carried to the report as a known absolute.
- **Amendment 9 (a long dash is a mark)** goes into step 6 with `splitTokens`, as a test and a rule; the build songs hold no such dash, so it changes no measured number. Carry if time is short.

### 10. Section 7 (cross-site line): two more sites

Append to section 7:

> - **The token split.** `score44.tokens_of` (`measure-n135-underlay-harness_2026-10-15/score44.py:21-30`) and this stage's `splitTokens` compute the same parts; the measured counts rest on them agreeing. The report runs `splitTokens` on the harness's word lists of one song and counts differences.
> - **The current stamp.** `isCurrent` (`restore.ts:40`) and the scan path's call to it are the two places that decide whether a kept reading is used; amendment 5 makes the second pass a stamp the first compares, so nothing else is read again.

### 11. Section 1 and section 11: what the switched-on singer waits through, and the fallback

Append to section 1:

> With the switch on, the join waits for every page's underlay read as it waits for the metres (`homr-reader.ts:378`), so the notes arrive later than today by the underlay's time; report that time per page beside homr's. Where the worker throws, the model does not load, or a fetch fails, the page answers null, the song joins as today, one `console.info` line says why, and nothing a singer sees changes; test it with a fake that throws.

### 12. Section 3, step 1: the line

Replace "`homr-reader.ts:87-96`" with "`homr-reader.ts:86-96`".

## Short answers

1. **Path:lines.** All spot-checked lines are right on `Shane` at 7238b77 except `ReaderDeps` (86, not 87) and the load-bearing error in step 2: `result.staves` is boxes, not `Staff` (Q1 section above; amendment 1).
2. **Buildable in the cloud?** Yes, with amendments 6 and 8: the fixtures and a fake `ReadUnderlay` cover the pipeline from step 1 to `writeLyrics`; the worker, the model's paths, and `measure.mjs` are built blind to the model, and the one PDF in the tree lets Code prove the driver. Section 9's split is sound once the done-when names 2,086 / 1,831 / 2,032 / 1,166 and what the desk stages (amendment 8). Code cannot run the note scorer (no truth files in the tree beyond the e16 harness's own; `tools/e16-harness/src/ground-truth.ts`, not read in full), so section 6's "the desk runs it" clause is the path.
3. **False sentence or unasked download.** Three found: (a) the per-page threshold leaves a song half written under no banner (amendment 7); (b) `createWorker` without `workerPath`, `corePath`, and `langPath` fetches from a CDN, as the poem path does today (`ScoreUploader.svelte:449-450`); the brief names `corePath` only (amendment 2); (c) "the service worker caches them only once the switch is on" cannot be built, since `sw.js` does not see the page's query; the sound rule is `/omr/` (amendment 6). The byte stop is right in spirit but aimed at `static/`, which is git-ignored for `/omr/`; it must fire on the commit of the source folder (amendment 6). Step 10's modernising would have printed a modern word where the singer should see the print (amendment 4).
4. **Walling in.** Nothing permanent: the switch is an address query, nothing a singer can turn on by touch, and a null answer joins as today. With the switch on, the notes wait on the words (amendment 11), and a reading kept with the switch on is re-read without its words when the switch is off (amendment 5); both reach only the one device with the switch. No string changes; `+page.svelte` and `ScoreUploader.svelte` are untouched, so the two ceilings hold.
5. **Amendments 4 to 9.** Placed in amendment 9 above.
6. **Cross-site line.** Present but incomplete: the third bullet claims the staff space is "never measured twice" and the tree says it is measured in the metre worker already (`metre.worker.ts:42`); amendments 2 and 10 name the sites.

## What I could not establish

- Whether `staffIn` costs enough per staff box to matter; not measured here (the metre worker's own timing line, `metre-client.ts:29`, reports a page time that includes it).
- Whether `imgpos` and the staff boxes share a unit after homr's own scaling; `wideStaves` reads `b.w` as a page fraction (`homr-reader.ts:110-113`) and `placeOf` reads integers (`join-pages.ts:438-439`), so they differ, and the conversion is Code's to state (amendment 1).
- Whether nesting `tesseract.js`'s `createWorker` inside a second Worker loads in Chromium; the 2026-10-15 review left it NOT ESTABLISHED and nothing since has measured it.
- The separator in the combined stamp and the source folder's name are desk defaults, not readings.
- The `no-lyrics-found` warning's producer in the parser (the per-song claim rests on `+page.svelte:2790` and `ingest.ts:89-90`, read this session; the warning's own site was not read).
- Whether the e16 harness's note scorer and truth files cover U1 to U6 and B1 to B10; `tools/e16-harness/` was listed, not read.

NOT ESTABLISHED beats a complete invented answer.
