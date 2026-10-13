# Brief for Code on the Mac: the Russian underlay read by a Russian model, the baseline (r1, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 00:20. QUEUE row 81. For Code on the Mac, Opus. **Measures only: no change to Ilya or the port is kept.** It serves THE ONE THING (`docs/memory/STATE.md`) and is the baseline for N.184 (`docs/memory/OPEN.md`, section "N.184"). Row 82, the fine-tuned model, is measured against what this row reports. **Fable reviews this brief before Code gets it** (`docs/memory/CONTRACT.md`, the paragraph of 2026-10-11 22:36).

## 1. What was observed

- Row 76 (`docs/sessions/report-code-the-final-test-set3_r1_2026-10-11.md`): held-out set 3 read 93.8, below 95. Row 77 (`docs/sessions/report-code-set3-four-below_r1_2026-10-11.md`) left S (Balakirev) with 12 extra notes and T (Borodin) with 14, from the English or French line printed beside the Russian in split bars.
- Row 80 (`docs/sessions/report-code-the-russian-line-by-its-underlay_r1_2026-10-11.md`, read whole by the desk 2026-10-12): with rus+eng+fra loaded, Tesseract read 10 of 33 Russian syllables in the split bars as Latin look-alikes («да» as "Ja", «не» as "He"), and on M read a whole Russian row as Latin. No form of the note-to-word test separated the lines. 8 of the 26 extras stand within about one notehead of a Russian note.
- Row 80's recommendation, marked as Code's: decide each underlay row's language by the singer's poem, matching whole words of a Russian-only reading; and measure a rule for one place read twice, which needs no OCR.

## 2. What is established, and what are leads

Established, each read by the desk this session:

- Ilya reads a photographed poem with `createWorker('rus')`, Russian only (`apps/web/src/lib/score/ScoreUploader.svelte:450`).
- homr's MusicXML carries each note's `<!-- imgpos: x, y -->`, and Ilya reads it (`apps/web/src/lib/omr/join-pages.ts:435-437`, `placeOf`). Row 80 found these in the frame of Ilya's own raster, with the identity mapping, for S and T (its section 1).
- Ilya already maps pre-reform spelling to modern: `normalizePreReform` and `modernisePreReform` (`packages/dictionary/src/pre-reform-normalizer.ts:310`, `:237`), and `hasAbolishedLetter` (`:230`).
- Row 80's instruments and data are in `docs/sessions/measure-russian-line_2026-10-11/`: `systems.py` finds the staffs and the underlay band (55 of 55 systems); `S.notes.jsonl`, `T.notes.jsonl`, `K.notes.jsonl`, `M.notes.jsonl` hold homr's notes with page, bar, `x`, `y`, pitch, and type; `*.status.json` holds the scorer's verdict per note; `words/` holds every OCR run as word boxes.
- Dann's ruling on the ossia, 2026-10-02 (`docs/memory/OPEN.md`, section "N.178 AND THE SCAN READER", item 12): two heads on one stem do not halt the read; the larger head is the note; two heads of one size are offered to the singer to choose or delete.

Leads, not read by the desk:

- The desk's reading of `tesseract-ocr/langdata_lstm` on 2026-10-11 (`OPEN.md`, section "N.184"): the `rus` model's character set holds none of ѣ, ѳ, ѵ; the `Cyrillic` script model holds і and not the other three. The traineddata files themselves are in `tesseract-ocr/tessdata_best` on GitHub (`rus.traineddata`, and `script/Cyrillic.traineddata`). Whether tesseract.js 7 loads a script model under its own name from a local `langPath` is NOT ESTABLISHED; if it does not, use the `tesseract` command line at the same version of the model, and say which you used.
- Which truth files carry syllables: row 80 used S's and T's; K's and M's carry none (row 80, "Could not establish").

## 3. Measure, in this order, and report each before the next

Use row 80's rasters (made again with its `raster.mjs`, Ilya's own `rasterizePdf`), its bands, and its notes. Do not re-run homr.

1. **Rows.** Cut each underlay band into its text rows (a horizontal ink profile is enough). Report, for S, T, K, and M, how many rows each system's band holds, and check four crops by eye against the page, including K's band that holds «Più mosso.».
2. **Three Russian-only readings of every row.** (a) `rus` at `4.0.0_best_int`, as row 80 used; (b) `rus` from `tessdata_best`; (c) `Cyrillic` from `tessdata_best`. One line of text per row (PSM 7). Keep every word box and confidence. Keep the language data outside the tree.
3. **The poem.** For S and T, the poem is the truth file's syllables joined into words, as row 80's measure E did. For K and M, type the Russian words of the underlay from the page, as printed, and mark them as your transcription. Normalise both the poem and every reading with `normalizePreReform` before matching (take the first candidate; say if any word has more than one).
4. **Each row's language, decided by the poem.** A row is Russian where at least half of its words, read by each of the three models, match a whole word of the poem after normalising; a match of a part of a word does not count. Report, per song and per model: Russian rows called Russian, other rows called Russian, Russian rows missed. The tempo row in K counts as an other row.
5. **The baseline for N.184.** On every Russian row of S, T, K, and M, for each model: syllables read right against the page, and every printed ѣ, і, ѳ, ѵ, and word-final ъ, listed with what each model read in its place. Report the counts in one table, letter by letter.
6. **One place read twice, without OCR.** In every song's notes, find each pair of notes in one bar with the same pitch within one notehead's width (`x` within 30 px, as row 80 used). Report how many such pairs are in S and T, and how many are in K and M (where every such pair is a false merge, since homr read no extra note there). For each pair, report which of the two notes the scorer counts as the song, and what each candidate rule keeps: the longer note, the shorter note, the note whose bar then sums to the printed metre (Ilya's own metre check, `apps/web/src/lib/omr/metre-witness.ts`), and the larger head on the raster where the heads differ in size.
7. **The whole test.** Combine steps 4 and 6: drop a note only where its column holds a word from a row called other and no word from a row called Russian, then apply the best rule from step 6. Report row 80's whole-song table (Russian notes kept and dropped, extras kept and dropped) for S and T, and notes wrongly removed for K and M, for each of the three models.

## 4. The rulings this serves

- THE ONE THING (`STATE.md`): at least 95 of every 100 printed notes on unseen songs, on the singer's path.
- N.184, ruled in by Dann 2026-10-11 23:32: *"pre-1918 scores are out there, IMSLP features some, and ѣ is going to be peppered throughout. We need this capability."* And 23:30: *"many uses if not most will simply photograph their scores and expect Ilya to extract the poetry from the syllable underlay."*
- The DESK DEFAULT in row 77's brief, section 3.3: the song a Russian singer sings is the Russian underlay's line. Not ruled by Dann.
- The ossia, Dann 2026-10-02, quoted in section 2. Its case is two heads on one stem; the case here is one place read as two notes. Report how the cases differ on the page; do not extend his ruling.

## 5. Constraints

- Change nothing that stays in `apps/`, `packages/`, or `third_party/`. Every instrument and its output go in `docs/sessions/measure-underlay-baseline_2026-10-12/`. Rasters, crops, and language data stay outside the tree.
- Set 3's other songs (Q, R, U, W, Y, and Z) stay unopened. V and X are not needed.
- No git command that writes.
- **Displaces:** nothing. Rows 78a to 79 run on the cloud lane at the same time and touch none of these files.

## 6. Done when

- Each of section 3's seven reports, with its numbers, holds on all four songs (S, T, K, and M), not only on the split bars.
- Step 5's letter-by-letter table exists for each of the three models.
- A recommendation, marked as Code's: which model row 82 should fine-tune, and whether steps 4 and 6 together separate the Russian line.
- Nothing built. `WRITTEN` does not apply; this row measures.

## 7. Report back

`docs/sessions/report-code-underlay-baseline_r1_2026-10-12.md`, with a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set row 81's State in `docs/memory/QUEUE.md` and stop.
