# Brief for Code on the Mac: a Russian model that reads ѣ, ѳ, ѵ, and і, trained and measured (r2, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 00:35 (r1). **r2, 2026-10-12 01:40: applies all fifteen of Fable's amendments** (`docs/sessions/review-fable-brief-row82_r1_2026-10-12.md`, verdict SEND WITH AMENDMENTS). r1 is superseded; do not run it. QUEUE row 82, N.184 (`docs/memory/OPEN.md`, section "N.184"). For Code on the Mac, Opus. **Trains and measures. Nothing is kept in `apps/`, `packages/`, `third_party/`, or `static/`.**

**Before you start:** read row 81's report whole (`docs/sessions/report-code-underlay-baseline_r1_2026-10-12.md`), and read `~/Downloads/_desk-heldout-exclusions_2026-10-12.md` (section 3, step 3).

## 1. What was observed

- Dann, 2026-10-11 23:30: *"many uses if not most will simply photograph their scores and expect Ilya to extract the poetry from the syllable underlay."* And 23:32: *"pre-1918 scores are out there, IMSLP features some, and ѣ is going to be peppered throughout. We need this capability."*
- Row 80 (`docs/sessions/report-code-the-russian-line-by-its-underlay_r1_2026-10-11.md`, section 2): in S and T's split bars, Tesseract read «бѣ» as "Ob", among 10 Russian syllables read as Latin.
- Row 81's report: the baseline per model, letter by letter.
- Row 81's baseline (its section 5): syllables read right letter for letter, (a) 295, (b) 309, (c) 315 of 493; ѣ right 0 of 21 for every model; і right 3 of 6 for (c) and 0 for (a) and (b); word-final ъ right 97 of 101 for (c); ѳ and ѵ not printed in S, T, K, or M.
- Row 81 (its section 2): the float models (b) and (c) abort on the core tesseract.js 7.0.0 picks under Node 24 (`missing function: _ZN9tesseract13DotProductSSEEPKfS1_i`); (a), an integer model, runs there. The browser path was not run.

## 2. What is established, and what are leads

Established, read by the desk 2026-10-12:

- Ilya reads a photographed poem with `createWorker('rus')` (`apps/web/src/lib/score/ScoreUploader.svelte:450`).
- Ilya keeps the printed spelling and maps it to modern for lookup and IPA (`packages/dictionary/src/pre-reform-normalizer.ts:310`, `normalizePreReform`; `:230`, `hasAbolishedLetter`; `ABOLISHED_LETTERS` at `:142-151` maps all four letters, read by Fable 2026-10-12). So the model's job is to read the letters as printed, not to modernise them.

Leads, not read by the desk:

- The `rus` model's character set holds none of ѣ, ѳ, ѵ, and `Cyrillic` holds і only (the desk's reading of `tesseract-ocr/langdata_lstm`, 2026-10-11, recorded in `OPEN.md`, section "N.184"). Row 81 did not read the character sets; its measures agree with this lead (its section 5, the letter table).
- Tesseract's own route for adding characters to a model is fine-tuning with `lstmtraining` from a `tessdata_best` float start model, as in the `tesseract-ocr/tesstrain` repository. Row 81 agrees and did not test it. Whether the Mac's `tesseract` carries the training tools is NOT ESTABLISHED.
- Typefaces that draw the pre-reform letters: Old Standard TT is modelled on Russian book type of the early twentieth century and is reported to hold them. NOT ESTABLISHED for any typeface until its character map is read.
- Pre-reform text for training lines: Russian Wikisource holds texts in the old spelling. NOT ESTABLISHED which, or how many lines.

## 3. Measure before you change anything, then build the model in this order

1. **The tools.** Report whether the Mac can run `tesseract`, `text2image`, `lstmtraining`, `combine_tessdata`, `unicharset_extractor`, `merge_unicharsets`, and `set_unicharset_properties`, at which version, and whether `tesseract-ocr/tesstrain`'s Makefile runs with `START_MODEL=Cyrillic`. If any is missing, report what installing it would take before installing. If they need more than a Homebrew install or a build of `tesseract-ocr/tesseract` from source, stop and report. Fonts for `text2image` must be visible to fontconfig; report `fc-list` for each chosen face.
2. **The typefaces.** List three to six typefaces that hold ѣ, ѳ, ѵ, і, and ъ, with the character map read for each (`fc-query` or `fontTools`), their licences, which must be free and open (SIL OFL, GPL with font exception, Apache 2.0, or public domain); a typeface under any other licence is listed but not used, and a typeface that costs money is a stop under section 5. Say why each resembles engraved lyric type. Prefer the type in S, T, K, and M; re-cut row 81's crops to see it (step 6), because row 81's crops were in its scratchpad and are gone.
3. **The training lines.**
   - Gather pre-reform Russian text whose underlying works are public domain (authors dead before 1946, DESK DEFAULT by Russia's 70-year term plus wartime extension, not verified), from sources that permit reuse, at least 20,000 lines. Name each source, its licence for the transcription, and the line count taken from it.
   - **Exclude every line of S's, T's, K's, and M's poems** (row 81's `poem.txt` is the transcription; match on its lines with pre-reform spelling and, after `modernisePreReform`, in modern spelling). **Exclude every poem listed in `~/Downloads/_desk-heldout-exclusions_2026-10-12.md`**, by the rule written at its top. That file names songs Code must never open; do not open any file in `~/Downloads/_desk-heldout3-private/` or any `heldout4` folder. If the file's set 4 section is empty, stop and report. Report how many lines each exclusion removed.
   - Report how often each of ѣ, ѳ, ѵ, і, and word-final ъ appears in the lines. If ѳ, ѵ, or і appears fewer than 2,000 times, add lines that hold them and say how, keeping the added lines under 10 percent of the corpus (DESK DEFAULT).
   - **Set aside, before training, a synthetic held-out text** of at least 500 lines from a source not used for training, holding at least 100 each of ѣ, ѳ, ѵ, і, and word-final ъ (add lines for ѳ and ѵ if needed and say how). Render it in one typeface that is not used for training, roughened with a different random seed.
4. **The images.** Render the training lines with `text2image` in each typeface, then roughen them to look like an engraved page scanned or photographed (blur, ink spread, a slight tilt, paper tone, noise). Show Dann six samples beside six crops from S, T, K, and M, as one picture, in the report. **That picture is the only image kept in the tree**, under `docs/sessions/measure-prereform-model_2026-10-12/`, as a PNG under 2 MB (DESK DEFAULT).
5. **Fine-tune.** Start from (c), `Cyrillic.traineddata` from `tesseract-ocr/tessdata_best`, `script/`, 36,730,735 bytes, md5 `3bc80391cf90b1e7b9c9296429e96821` (row 81's report, section 2 and its recommendation). Check the md5 before training. Name the new model something other than `rus` or `Cyrillic` (DESK DEFAULT: `rus_prereform`), in its own directory, because tesseract.js reads `${cachePath}/${lang}.traineddata` before `langPath` (row 81's brief, section 2). Fine-tune with the new letters added to the character set. Keep the trained model outside the tree and report its size in bytes. Choose checkpoints by the synthetic held-out set only.

   **5b. The integer form.** Convert the fine-tuned model to integers (`lstmtraining --stop_training --convert_to_int`, or whatever the installed version's equivalent is; report the exact command). Report both files' sizes in bytes beside row 81's (a) 5,053,706 (2,679,598 gzipped) and (c) 36,730,735. Then, with row 81's scratch tesseract.js harness (its `ocr-rows.mjs`, `TCORE` honoured; rebuild the scratch copy as row 81 did if it is gone), read all 146 rows of S, T, K, and M three ways: the float model on `tesseract-core-simd-lstm`; the integer model on `tesseract-core-simd-lstm`; the integer model on the core tesseract.js picks by default under Node 24 (the relaxed-SIMD core, where (b) and (c) aborted). Report whether each loads, and how many of the 146 rows give byte-identical text between the three runs. **Where the integer model fails to load on the default core, that is the finding: stop the measure there and say so.** The browser path itself is not required; if Code can run tesseract.js's default browser bundle in a headless browser from the Mac without touching the tree, do it and report; otherwise mark it NOT ESTABLISHED.
6. **Measure against row 81's baseline.** Re-cut the rows with row 81's `raster.mjs` (dev server at `localhost:5173`; ask nothing, but stop the server by its process number when done, as row 81 did) and `rows.py`, and check that the `<L>.rows.jsonl` files match row 81's byte for byte. Run `ocr-rows.mjs` with the new model as (d), the integer form, on `tesseract-core-simd-lstm`, in its own directory, `gzip: false`, `cacheMethod: 'none'`, as row 81 ran (a) to (c). Then run `step4.py` in all three variants, `step5.py` with both counts, and `step7.py` under both the brief and the syll calls, unchanged, and print each of row 81's tables with (d) added as a column, or as a row where the table is one row per model. Row 81's section 5 letter table is the one that decides; report every place where (d) read ѣ, і, or word-final ъ wrong, as `step5-letters.json` does.

## 4. The rulings this serves

- N.184, ruled in by Dann 2026-10-11 23:32, quoted in section 1.
- Dann's idea, 2026-10-11 23:28: render the glyphs as bitmaps to train on (`OPEN.md`, section "N.184", the plan).
- Ilya keeps the letters as printed and gives the IPA the modern sound (`OPEN.md`, section "N.184", the plan). Not amended since.
- THE ONE THING (`docs/memory/STATE.md`).

## 5. Constraints

- Nothing kept in `apps/`, `packages/`, `third_party/`, or `static/`. Scripts and outputs go in `docs/sessions/measure-prereform-model_2026-10-12/`. Fonts, language data, rendered images (except step 4's one picture), and the models stay outside the tree.
- Set 3's other songs (Q, R, U, W, Y, and Z) and set 4 stay unopened.
- No git command that writes.
- Anything that costs money (a paid typeface, a paid service): stop and report.
- **One shot on the real songs.** S, T, K, and M are run once per trained model, and at most two models are trained in this row. Checkpoints are chosen by the synthetic held-out set, never by the real songs. If the first model misses section 6's floors, the second model's change is named before it is trained, and both results are reported.
- **Ceilings (DESK DEFAULT):** 8 hours of wall-clock for rendering and training together; at most 10,000 training iterations per model, with a checkpoint evaluated on the synthetic held-out set every 1,000; at most 20 GB outside the tree for fonts, images, and models. Where a ceiling is reached, stop, report what exists, and set the row's State to the partial result. These are the desk's numbers, not measured; the report says how long each step took so the next row can set them from a measure.
- **Displaces:** nothing. Shipping the model into Ilya is a later row, with its byte count put to Dann first (`CONTRACT.md`, section 6, the `static/` rule).

## 6. Done when

- Section 3's reports exist, each with its numbers, including step 5b's three loads.
- **On S, T, K, and M,** (d) reads ѣ right in at least 14 of 21 places, і in at least 3 of 6, word-final ъ in at least 97 of 101, and syllables letter for letter in at least 315 of 493 (row 81's (c)), with every count reported whether or not it is met. ѳ and ѵ have no count on these songs; their test is the synthetic one. These thresholds are the desk's proposal (DESK DEFAULT, offered by Fable), not Dann's; the ѣ threshold is a majority, chosen because the baseline is zero and "at least as often" is met by zero.
- **On the synthetic held-out set,** per-letter right counts for (c) and (d), and the character error rate of each over the whole set. Shipping is not recommended where (d)'s character error rate on the held-out set is worse than (c)'s on the same lines with the pre-reform letters mapped to their modern forms (so (c) is not penalised for letters it cannot output).
- A recommendation, marked as Code's: ship the model into Ilya, train again with a named change, or stop.
- Nothing built. `WRITTEN` does not apply; this row trains and measures.

## 7. Report back

`docs/sessions/report-code-prereform-model_r1_2026-10-12.md`, with a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set row 82's State in `docs/memory/QUEUE.md` and stop.
