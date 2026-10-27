# Brief: N.135 stage 2b, the reader reads the words under the voice staff, behind a hidden switch (r1)

Desk (Opus 5.5), 2026-10-27. For Code in the cloud lane, Sonnet. Replaces section 7 of `docs/sessions/brief-code-n135-underlay-reader_r1_2026-10-15.md` (stage 2b as briefed then); sections 1, 2, 8, 9, 11, and 12 of that brief still stand where this one does not change them. Every `path:line` here was read in a clone of `Shane` at `7238b77a` on 2026-10-27, or on `cloud-lane-16` at `0bdba67` where it says so. Not yet Fable-reviewed; it goes to Code only after the review's amendments are applied (`docs/memory/CONTRACT.md` §1 item 19).

## 1. What the singer sees and gains

Today a singer drops a scanned song. The notes appear, and the drawer tells her: "Ilya does not read the words printed in an image." (`apps/web/src/lib/i18n.ts:1458`, `upload.banner.noLyricsScan`). She types the words.

After this stage, with the hidden switch on, Ilya reads the sung words printed under the voice staff, seats each syllable under the note the engraver put it under, and fills Lyrics with them. Nothing changes for a singer without the switch. The switch stays hidden until the words read 9 of 10 syllables on row 114's songs on the singer's path (`docs/memory/STATE.md`, THE ONE THING, ruled by Dann 2026-10-27 02:49) and Dann has ratified the banner's new words (section 8 of the 2026-10-15 brief).

Dann's design principle for this stage (2026-10-27 14:18 and 14:27, `docs/memory/INBOX.md:449`): **the lyric band is the rectangle between the voice staff (A) and the staff below it, the piano's upper staff (B), found by those landmarks and sized in proportion, never in fixed pixels; syllables answer to the notes above them.** The one legitimate absolute is the reader's preferred letter height, 32 px of ink.

## 2. What is built and measured already

- **Stage 2a, on `cloud-lane-16` at `0bdba67`**, merged into `Shane` before this stage starts (if it is not merged when you start, stop and say so): `cutRows` (`apps/web/src/lib/omr/underlay-rows.ts`), `seatTokens` with the 'monotone' rule that seats the least-cost in-order subset and returns the surplus as `unseated` (`underlay-seat.ts`), `sewWords` and `writeLyrics` (`underlay-words.ts`), `rowLanguage` (`underlay-language.ts`), `frameRow` with `unframePoint` and `unframeBox` (`underlay-frame.ts`), and `UNDERLAY_READER` in `stamp.ts`, not yet joined to `READER_STAMP`. Read the three step reports on that lane: `docs/sessions/report-code-n135-stage2a-step{1,2,3}_r1_2026-10-27.md`. Any amendments from Fable's review of stage 2a as built land as step 4 before this stage.
- **The harness numbers this stage must reproduce in kind.** On the 18 build songs (2,538 printed syllables): the float reader `rus_prereform_r2` read 1,875 right letter for letter on the stored crops; with the row framed (deskew, closing 3 by 3, scaled to 32 px of ink, paper-tone padding) it read 2,086 (`docs/sessions/report-desk-row117-image-cleaning_r1_2026-10-27.md`, lines 421 to 443). Seating on 2,385 truth syllable notes, rule 2 baseline: (b) exact 1,622, (a) nucleus 1,815, (c) word-exact 792; the hybrid configuration C2 (below): 1,630, 1,955, 812 (`docs/sessions/report-desk-n135-lever2-measure_r1_2026-10-27.md`, section "Step 1c"). **The frame and the hybrid were never measured together; this stage's measure is the first that does, so no number is expected within a tolerance (DESK DEFAULT).** The scripts that produced the frame and hybrid numbers are not in the tree and are lost; the two reports are the specification.
- **The reader.** The float form of the fine-tuned model, `rus_prereform_r2_29000.traineddata` (7,827,478 bytes, md5 `2ff2af3e33461cd64e7d2015ef21d10d`), read by `tesseract.js` 7 (`apps/web/package.json:27`) at page segmentation mode 7 (one line), with `corePath` naming the SIMD core file itself, `tesseract-core-simd-lstm.wasm.js`, because the relaxed-SIMD core tesseract.js picks by default aborts on every float model (`docs/memory/ENVIRONMENT.md`, section `A FLOAT MODEL LOADS WHEN corePath NAMES THE SIMD CORE FILE`). The harness's browser reader is `docs/sessions/measure-n135-underlay-harness_2026-10-15/chrome-load.mjs` and `docs/sessions/measure-row82-retrain_2026-10-15/harness/chrome-load-d.mjs`; read the second before you write the worker. Where the model file is today on the Mac: `~/Downloads/_desk-prereform/models/rus_prereform_r2/rus_prereform_r2_29000.traineddata`; the desk stages it to you (section 9).

## 3. The pipeline, per page, in order

Each step names its module. New code goes in new files under `apps/web/src/lib/omr/`; `homr-reader.ts` (434 lines) takes only the dependency and its call.

1. **The dependency.** `ReaderDeps` (`apps/web/src/lib/omr/homr-reader.ts:87-96`) gains `underlay?: ReadUnderlay` beside `metres`, called per page in `pass` the way `deps.metres` is (`:312`), with the page image, homr's page MusicXML, and `result.staves`, and wired in the factory (`:403-414`) only when the hidden switch is on and `Worker` and `OffscreenCanvas` exist. Its worker and client follow `metre-client.ts` and `metre.worker.ts` (59 and 60 lines). A page that answers null is joined exactly as today.
2. **The band: Dann's rectangle.** For each system, the voice staff (A) is the staff nearest the system's voice notes' `imgpos` (`join-pages.ts:435-439`, `placeOf`); B is the next staff below it in the same system. The band runs from A's bottom line plus 1.5 staff spaces to B's top line minus 1.5 staff spaces, across the system's width; where no staff lies below A, to A's bottom line plus 20 spaces or the page's end. This is the harness's rule (`docs/sessions/measure-row82-retrain_2026-10-15/harness/rowsys.py:37-39`), stated in spaces. One departure from the harness, DESK DEFAULT on Dann's proportion ruling: the harness drops a band under 40 px tall (`rowsys.py:40`); drop a band under 2 staff spaces instead. Use the staff geometry homr already returns (`result.staves`; the type `metre-windows.ts:47-53` reads them as `Staff`, with `space`); do not find staves again.
3. **Rows.** `cutRows(band, staffSpace)`.
4. **The frame.** `frameRow(crop)` on each row, defaults unchanged (ink 32 px, padding 0.5 of the ink height, closing 3 by 3, deskew sweep). Keep the `FrameTransform` with the row.
5. **The read.** The worker reads each framed row with the float model at PSM 7 and returns its word boxes in framed pixels; map each box back with `unframeBox`, then into page pixels by the row's offset.
6. **Tokens.** A token is a word box split at an internal hyphen or mark, each part keeping its share of the box by letters, as the harness does (`score44.py`, `tokens_of`; in `docs/sessions/measure-row82-retrain_2026-10-15/harness/` or the 2026-10-15 harness folder; find it and cite it).
7. **Language.** `rowLanguage(words, isWord)` with `isWord` from `packages/dictionary`; a row that is not Russian is not seated (the brief of 2026-10-15, section 4.3).
8. **Seating: the hybrid, C2.** Candidates are the system's free notes (every read voice note that is not the stop of a tie), at their `imgpos` x. A token holding two or more vowel letters is cut into syllables by the engine's own cut, `GraysonEngine.syllabify` (`packages/phonology/src/engine.ts:1030`), each syllable placed inside the token's box in proportion to its letters; a token with one vowel or none stays whole. Then `seatTokens(units, notes, 'monotone')`. Surplus units come back `unseated` and are not written; count them in the report. Expected from the lever 2 report: C2 drops units in 124 of 210 systems.
9. **Words.** `sewWords(seats)`, then on the joined MusicXML after `joinLookingAtPages` (`homr-reader.ts:379`), `writeLyrics` for every page that passed the threshold (section 4).
10. **Spelling.** Each written syllable's word goes through `modernisePreReform` (`packages/dictionary/src/pre-reform-normalizer.ts:244`) where it returns a form; where it returns null the letters stay as read. Capitals and punctuation as read.
11. **The stamp.** `READER_STAMP` (`stamp.ts:23`) joins `UNDERLAY_READER` only while the switch is on, so a stored scan reading made with the switch off is not read again for every singer. Say in the report how a reading made with the switch on is told apart when the switch is later off (DESK DEFAULT: read again).

After step 9 nothing is new: on upload the page fills Lyrics from the score's words (`apps/web/src/routes/+page.svelte:2829`) and `seatScoreWords` seats them (`apps/web/src/lib/score/score-seat.ts:107`). Confirm both on the real page.

## 4. The threshold

DESK DEFAULT, from the 2026-10-15 brief's section 5: a page's words are written only where `rowLanguage` calls at least one Russian row per system of the page and at least half of the sewn words of those rows pass the dictionary; otherwise the page keeps today's path and today's banner. Report, per build song, how many pages pass.

## 5. The hidden switch

`?reader=ilya` is being retired (QUEUE row 155, ruled by Dann 2026-10-27 14:59), so this stage does not use it. DESK DEFAULT: an address query `?words=read`, read by a function in a new file `apps/web/src/lib/omr/underlay-switch.ts`, not in `scan.ts`, so this lane and the retirement lane touch different files. No string is added; nothing a singer can see changes with the switch off. Prove that with the e2e suite and one screenshot compare of a scan dropped with the switch off, before and after.

## 6. What may not change

- Notes: the reader's note scores on the build songs do not move. Run the scorer before and after on U1 to U6 and B1 to B10 if the truth files are in your clone; if they are not, say so and the desk runs it.
- Ceilings: `+page.svelte` 5,586 (`scripts/ratchets.json:8`), `ScoreUploader.svelte` 1,358 (`:19`), new files under 1,000 lines (`:3`). Neither ceiling file is touched.
- `static/`: the model (7,827,478 bytes) and the SIMD core files (`tesseract-core-simd-lstm.wasm.js`, 3,899,472 bytes, and its `.wasm` if separate) are served from Ilya's own origin, never a CDN (N.197, QUEUE row 155). Before any file lands in `static/`, write its byte count in the report and stop; the desk tells Dann (`CONTRACT.md` §8, last bullet). The service worker caches them only once the switch is on (DESK DEFAULT: a singer without the switch downloads nothing new).
- Strings: none added or changed. The banner's new words wait for Dann (2026-10-15 brief, section 8).
- Git: commit and push `cloud-lane-<n>` only, as every cloud lane; no pull request; no `docs/memory/` file; no brief or review file committed.

## 7. Cross-site line (`CONTRACT.md` §4)

This stage adds a second computation of three quantities. Name each site in the report and say what depends on them agreeing:

- **Which note a word sits under.** Today a score's `<lyric>` decides it and `seatScoreWords` (`score-seat.ts:107`) honours it; this stage writes that `<lyric>` from `seatTokens`. Nothing else may re-seat a read word.
- **Where a syllable divides.** `sewWords` gives `syllabic` from the print's hyphens; the engine's `syllabify` (`engine.ts:1030`) cuts tokens for seating (step 8); Markup prints the engine's cut. Report every word in the build songs where the written `syllabic` and the engine's cut disagree.
- **The staff space.** `cutRows`, the band, and `frameRow`'s caller each take it from `result.staves`; one value per staff, passed down, never measured twice.

## 8. Tests

- Unit tests for the band, the token split, the hybrid cut, and the switch, with mutants for the band's 1.5-space margins and the 2-space drop.
- An integration test on `apps/web/src/lib/omr/fixtures/tch-3.musicxml` with a fake `ReadUnderlay` that returns a fixed seat list: the joined MusicXML carries the `<lyric>`s, `no-lyrics-found` does not fire, and `collectScoreWords` returns the words in order.
- The eight gates at baseline except gate 4 (web tests), which rises by your new tests.

## 9. The measure on the real page

Code builds and tests the stage in the cloud with fixtures; the scans and the model are not in the tree. **The real-page measure is the desk's,** in its workspace, with the scans and model staged from the Mac. So deliver, in `docs/sessions/measure-n135-stage2b_2026-10-27/`, a script `measure.mjs` that drives the built app in headless Chromium: for each PDF in a folder, drop it on the page with `?words=read`, wait for the read, and write the joined MusicXML and the Lyrics text to an output folder. Run it once yourself on any PDF in the tree that holds a voice staff with words, if one exists (search `apps/web/src/lib/omr/fixtures/` and `tools/`), and report what it wrote; if none exists, say so. The desk then scores the 18 build songs with the harness's scorer: read right (of 2,538), and (b), (a), (c) on the 2,385 truth syllable notes, per song, and the time per page.

## 10. Report

`docs/sessions/report-code-n135-stage2b_r1_2026-10-27.md` on the lane, in the 2026-10-15 brief's section 11 shape. The answer first; the tree; each measurement with its expectation and likeliest failure written before the run; departures; the files.

## 11. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Known gaps at briefing, for your report to close or carry:

- Whether the frame and the hybrid together beat either alone (never measured; section 2).
- The time per page in a browser: `frameRow` took 1.5 s per full-width row in Node (stage 2a step 3 report, "Timing"); a page holds several rows. If a page's underlay takes longer than its homr read, report both times; do not cut the frame to save time.
- Whether `result.staves` holds every staff of a system, or only the ones homr kept.
- Where `score44.py`'s `tokens_of` lives in the tree (section 3 step 6).
- What the transcription does with a read word the dictionary does not hold (N.163; the 2026-10-15 brief, section 7 item 5): read `apps/web/src/lib/pipeline.ts` and report the path before you write anything that reaches it.
