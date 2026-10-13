# Brief for Code on the Mac: a Russian model that reads ѣ, ѳ, ѵ, and і, trained and measured (r1, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 00:35. QUEUE row 82, N.184 (`docs/memory/OPEN.md`, section "N.184"). For Code on the Mac, Opus. **Starts only after row 81 has reported**, because row 81 names the model this row starts from and the baseline it must beat. **Trains and measures. Nothing is kept in `apps/`, `packages/`, `third_party/`, or `static/`.** Fable reviews this brief before Code gets it (`docs/memory/CONTRACT.md`, the paragraph of 2026-10-11 22:36).

## 1. What was observed

- Dann, 2026-10-11 23:30: *"many uses if not most will simply photograph their scores and expect Ilya to extract the poetry from the syllable underlay."* And 23:32: *"pre-1918 scores are out there, IMSLP features some, and ѣ is going to be peppered throughout. We need this capability."*
- Row 80 (`docs/sessions/report-code-the-russian-line-by-its-underlay_r1_2026-10-11.md`, section 2): in S and T's split bars, Tesseract read «бѣ» as "Ob", among 10 Russian syllables read as Latin.
- Row 81's report (`docs/sessions/report-code-underlay-baseline_r1_2026-10-12.md`): the baseline per model, letter by letter. **Read it whole before starting.**

## 2. What is established, and what are leads

Established, read by the desk 2026-10-12:

- Ilya reads a photographed poem with `createWorker('rus')` (`apps/web/src/lib/score/ScoreUploader.svelte:450`).
- Ilya keeps the printed spelling and maps it to modern for lookup and IPA (`packages/dictionary/src/pre-reform-normalizer.ts:310`, `normalizePreReform`; `:230`, `hasAbolishedLetter`). So the model's job is to read the letters as printed, not to modernise them.

Leads, not read by the desk:

- The `rus` model's character set holds none of ѣ, ѳ, ѵ, and `Cyrillic` holds і only (the desk's reading of `tesseract-ocr/langdata_lstm`, 2026-10-11, recorded in `OPEN.md`, section "N.184"). Row 81 may have confirmed or corrected this.
- Tesseract's own route for adding characters to a model is fine-tuning with `lstmtraining` from a `tessdata_best` start model, as in the `tesseract-ocr/tesstrain` repository. Whether the Mac's `tesseract` carries the training tools is NOT ESTABLISHED.
- Typefaces that draw the pre-reform letters: Old Standard TT is modelled on Russian book type of the early twentieth century and is reported to hold them. NOT ESTABLISHED for any typeface until its character map is read.
- Pre-reform text for training lines: Russian Wikisource holds texts in the old spelling. NOT ESTABLISHED which, or how many lines.

## 3. Measure before you change anything, then build the model in this order

1. **The tools.** Report whether the Mac can run `text2image` and `lstmtraining`, at which version, and what installing them would take. If they need more than a Homebrew install or a build of `tesseract-ocr/tesseract` from source, stop and report.
2. **The typefaces.** List three to six typefaces that hold ѣ, ѳ, ѵ, і, and ъ, with the character map read for each (`fc-query` or `fontTools`), their licences, and why each resembles engraved lyric type. Prefer the type in S, T, K, and M as row 81's crops show it.
3. **The training lines.** Gather pre-reform Russian text from public-domain sources, at least 20,000 lines, and list the sources. **Exclude every line of S's, T's, K's, and M's poems,** and of any song in sets 1 to 3, so the test stays unseen. Report how often each of ѣ, ѳ, ѵ, і appears in the lines; if ѳ or ѵ appears fewer than 200 times, add lines that hold them and say how.
4. **The images.** Render the lines with `text2image` in each typeface, then roughen them to look like an engraved page scanned or photographed (blur, ink spread, a slight tilt, paper tone, noise). Show Dann six samples beside six crops from row 81, as one picture, in the report.
5. **Fine-tune.** Start from the model row 81 recommends. Fine-tune with the new letters added to the character set. Keep the trained model outside the tree and report its size in bytes.
6. **Measure against row 81's baseline.** Run row 81's steps 2, 4, 5, and 7 again with the new model on the same rows of S, T, K, and M, and print row 81's tables with one more column.

## 4. The rulings this serves

- N.184, ruled in by Dann 2026-10-11 23:32, quoted in section 1.
- Dann's idea, 2026-10-11 23:28: render the glyphs as bitmaps to train on (`OPEN.md`, section "N.184", the plan).
- Ilya keeps the letters as printed and gives the IPA the modern sound (`OPEN.md`, section "N.184", the plan). Not amended since.
- THE ONE THING (`docs/memory/STATE.md`).

## 5. Constraints

- Nothing kept in `apps/`, `packages/`, `third_party/`, or `static/`. Scripts and outputs go in `docs/sessions/measure-prereform-model_2026-10-12/`. Fonts, language data, rendered images, and the model stay outside the tree.
- Set 3's other songs (Q, R, U, W, Y, and Z) stay unopened.
- No git command that writes.
- Anything that costs money (a paid typeface, a paid service): stop and report.
- **Displaces:** nothing. Shipping the model into Ilya is a later row, with its byte count put to Dann first (`CONTRACT.md`, section 6, the `static/` rule).

## 6. Done when

- Section 3's six reports exist, each with its numbers.
- The new model reads each of ѣ, ѳ, ѵ, і, and word-final ъ on S, T, K, and M at least as often as row 81's best model, letter by letter, and reads no fewer syllables right overall. Where it does not, the report says so with the count.
- A recommendation, marked as Code's: ship the model into Ilya, train again with a named change, or stop.

## 7. Report back

`docs/sessions/report-code-prereform-model_r1_2026-10-12.md`, with a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set row 82's State in `docs/memory/QUEUE.md` and stop.
