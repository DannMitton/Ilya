# Brief for Code on the Mac: the Russian underlay read by a Russian model, the baseline (r2, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 00:20. **r2 applies Fable's fifteen amendments** (`docs/sessions/review-fable-brief-row81_r1_2026-10-12.md`, verdict SEND WITH AMENDMENTS); r1 is superseded. QUEUE row 81. For Code on the Mac, Opus. **Measures only: no change to Ilya or the port is kept.** It serves THE ONE THING (`docs/memory/STATE.md`) and is the baseline for N.184 (`docs/memory/OPEN.md`, section "N.184"). Row 82, the fine-tuned model, is measured against what this row reports. **Fable reviews this brief before Code gets it** (`docs/memory/CONTRACT.md`, the paragraph of 2026-10-11 22:36).

## 1. What was observed

- Row 76 (`docs/sessions/report-code-the-final-test-set3_r1_2026-10-11.md`): held-out set 3 read 93.8, below 95. Row 77 (`docs/sessions/report-code-set3-four-below_r1_2026-10-11.md`) left S (Balakirev) with 12 extra notes and T (Borodin) with 14, from the English or French line printed beside the Russian in split bars.
- Row 80 (`docs/sessions/report-code-the-russian-line-by-its-underlay_r1_2026-10-11.md`, read whole by the desk 2026-10-12): with rus+eng+fra loaded, Tesseract read 10 of 33 Russian syllables in the split bars as Latin look-alikes («да» as "Ja", «не» as "He"), and on M read a whole Russian row as Latin. No form of the note-to-word test separated the lines. 8 of the 26 extras stand within about one notehead of a Russian note.
- Row 80's recommendation, marked as Code's: decide each underlay row's language by the singer's poem, matching whole words of a Russian-only reading; and measure a rule for one place read twice, which needs no OCR.

## 2. What is established, and what are leads

Established, each read by the desk this session:

- Ilya reads a photographed poem with `createWorker('rus')`, Russian only (`apps/web/src/lib/score/ScoreUploader.svelte:450`).
- homr's MusicXML carries each note's `<!-- imgpos: x, y -->`, and Ilya reads it (`apps/web/src/lib/omr/join-pages.ts:436-439`, `placeOf`). Row 80 found these in the frame of Ilya's own raster, with the identity mapping, for S and T (its section 1).
- Ilya already maps pre-reform spelling to modern: `modernisePreReform` (`packages/dictionary/src/pre-reform-normalizer.ts:237`) returns the modern form or `null`; `normalizePreReform` (`:310`) returns an empty list for a word with no pre-reform feature (`:310-313`); `hasAbolishedLetter` is at `:230`.
- Row 80's instruments and data are in `docs/sessions/measure-russian-line_2026-10-11/`: `systems.py` finds the staffs and the underlay band (55 of 55 systems); `S.notes.jsonl`, `T.notes.jsonl`, `K.notes.jsonl`, `M.notes.jsonl` hold homr's notes with page, bar, `x`, `y`, pitch, and type; `*.status.json` holds the scorer's verdict per note; `words/` holds every OCR run as word boxes.
- tesseract.js 7.0.0 loads `${langPath}/${lang}.traineddata` (`.gz` when `gzip` is true) by the name given, with no mapping of script names (`apps/web/node_modules/tesseract.js/src/worker-script/index.js:132-151`), and hands that name to `api.Init` (`:264`). So `createWorker(['Cyrillic'], 1, { langPath, gzip: false })` works with `Cyrillic.traineddata` in `langPath`. Use one directory per model: the loader reads `${cachePath}/${lang}.traineddata` before `langPath` (`:112`), so (a) and (b), both named `rus`, collide in one directory (row 80's `ocr.mjs:8` passes `gzip: true` and `cachePath: tessdata`). Whether the WebAssembly core accepts the float `tessdata_best` files is NOT ESTABLISHED; row 80 used `best_int`. If a float file fails to initialise, say so and use the `tesseract` command line if the Mac has it (NOT ESTABLISHED that it does).
- Dann's ruling on the ossia, 2026-10-02 (`docs/memory/OPEN.md`, section "N.178 AND THE SCAN READER", item 12): two heads on one stem do not halt the read; the larger head is the note; two heads of one size are offered to the singer to choose or delete.

Leads, not read by the desk:

- The desk's reading of `tesseract-ocr/langdata_lstm` on 2026-10-11 (`OPEN.md`, section "N.184"): the `rus` model's character set holds none of ѣ, ѳ, ѵ; the `Cyrillic` script model holds і and not the other three. The traineddata files themselves are in `tesseract-ocr/tessdata_best` on GitHub (`rus.traineddata`, and `script/Cyrillic.traineddata`).
- Which truth files carry syllables: S's and T's carry `syllable` fields with no word boundary (one T entry is «въ лѣ», two words); K's and M's carry none (row 80, "Could not establish"). Whether K's or M's `.notes.md` hold the poem's words is NOT ESTABLISHED.

## 3. Measure, in this order, and report each before the next

Use row 80's rasters (made again with its `raster.mjs`, Ilya's own `rasterizePdf`), its bands, and its notes. Do not re-run homr.

**The inputs.** The PDFs resolve by `docs/sessions/measure-set3-four-below_2026-10-11/run.py` lines 12 to 14 (`src`): S and T under `~/Downloads/_desk-heldout3-private/truth/` (`four.json` names them), K and M under `~/Downloads/_desk-2026-10-08/heldout2-scans/`; their truth files by `run.py:55-57`. The readings are `measure-set3-four-below_2026-10-11/after/drops/<L>.musicxml` and `after/<L>.read.json`. `raster.mjs` needs the dev server at `localhost:5173` (`raster.mjs:9`).

1. **Rows.** Cut each underlay band into its text rows. Ink is darker than the page's paper tone less 60, as `systems.py:11` takes it. A row is a run of raster lines whose ink count exceeds 2 percent of the band's width; runs separated by less than 0.3 staff space are one row; a row under 0.4 staff space tall is dropped (melisma extenders, hyphens alone); each row is padded by 0.3 space above and below before the OCR (DESK DEFAULT). Report, for S, T, K, and M, how many rows each system's band holds, and check four crops by eye against the page, including K's band that holds «Più mosso.».
2. **Three Russian-only readings of every row.** (a) `rus` at `4.0.0_best_int`, as row 80 used; (b) `rus` from `tessdata_best`; (c) `Cyrillic` from `tessdata_best`. One line of text per row (PSM 7). Keep every word box and confidence. Keep the language data outside the tree. Downloading the three model files (jsdelivr `4.0.0_best_int` for (a); GitHub `tesseract-ocr/tessdata_best` for (b) and (c)) is permitted for this row (DESK DEFAULT); row 80's copies were in its scratchpad and are gone. Record each file's size and md5 in the report.
3. **The poem.** For all four songs, type the Russian words of the underlay from the page, as printed, in reading order, and mark them as your transcription. For S and T, check your text against the truth's `syllable` fields: every syllable, hyphen and spaces removed, must occur in order in your text; report any that does not. Normalise each token, in the poem and in every reading, with `modernisePreReform` under `tsx` (as `status.ts` runs), keeping the token itself where it returns `null`; then lower-case it, fold ё to е (DESK DEFAULT), and strip every character outside а to я. Compare the results for equality.
4. **Each row's language, decided by the poem.** A row is Russian where at least half of its words, read by each of the three models, match a whole word of the poem after normalising; a match of a part of a word does not count. Report, per song and per model: Russian rows called Russian, other rows called Russian, Russian rows missed. The tempo row in K counts as an other row. A row's words: its word boxes in x order, with a token ending in a hyphen sewn to the next token in the same row; tokens of fewer than two Cyrillic letters after step 3's normalising are not counted (DESK DEFAULT, as `step3.py:11` did). A row with no countable word is other. "At least half" is of the countable words.
5. **The baseline for N.184.** On every Russian row of S, T, K, and M, for each model: syllables read right against the page, and every printed ѣ, і, ѳ, ѵ, and word-final ъ, listed with what each model read in its place. Report the counts in one table, letter by letter. A syllable is read right where the row's token, hyphen removed, equals the printed syllable letter for letter, pre-reform letters included, case folded. Give a second count after step 3's normalising, so a model that reads ѣ as е is counted as right in sound and wrong in spelling.
6. **One place read twice, without OCR.** In every song's notes, find each pair of notes in one bar with the same pitch within one notehead's width (`x` within 30 px, as row 80 used). Report how many such pairs are in S and T, and how many are in K and M (where homr read no extra note, so any pair found is two notes of the song, and a rule that drops one of them is wrong). Fable's count from row 80's `*.notes.jsonl` and `*.status.json` (same bar, same page, same `midi`, `x` at most 30 px apart, chords excluded), in its review of 2026-10-12: S 4 pairs, T 7, K 0, M 0. In T two pairs are two song notes (bar 22, x 2108 and 2122; bar 75, x 2691 and 2670); in S bar 72 both notes are extra; five of the eleven pairs share one `type`, so "longer" cannot decide them; in T bar 76 the song note is the shorter. Report every pair against this list, and report a pair where both are song as the rule's cost. For each pair, report the scorer's status of each (song, extra, or both the same), and what each candidate rule keeps: the longer note; the shorter note; the note whose removal leaves the bar's notes and rests, over both voices, summing to the truth's `measureDurations` for that bar (sum `<duration>` over the divisions in force from `after/drops/<L>.musicxml`, as `barFacts` does in `apps/web/src/lib/omr/metre-witness.ts:157-180`, but without its voice-1 filter at `:171`); and the larger head. Head size: on Ilya's raster, in a window 2 staff spaces square centred on `imgpos`, with the staff lines blanked (their y from `systems.jsonl`), take the connected ink component nearest the centre and measure its width across its own vertical middle; the heads differ in size where the widths differ by more than 20 percent (DESK DEFAULT). A hollow and a filled head of one width are one size.
7. **The whole test.** Combine steps 4 and 6: drop a note only where its column holds a word from a row called other and no word from a row called Russian, then apply the best rule from step 6. A note's column is `imgpos` x ± 30 px against the word boxes of its system's band, as row 80's form B (`step3.py:5-6`); the row calls come from step 4, per model. Report row 80's whole-song table (Russian notes kept and dropped, extras kept and dropped) for S and T, and notes wrongly removed for K and M, for each of the three models.

## 4. The rulings this serves

- THE ONE THING (`STATE.md`): at least 95 of every 100 printed notes on unseen songs, on the singer's path.
- N.184, ruled in by Dann 2026-10-11 23:32: *"pre-1918 scores are out there, IMSLP features some, and ѣ is going to be peppered throughout. We need this capability."* And 23:30: *"many uses if not most will simply photograph their scores and expect Ilya to extract the poetry from the syllable underlay."*
- The DESK DEFAULT in row 77's brief, section 3, item 3 (`brief-code-set3-four-below_r1_2026-10-11.md:28`): the song a Russian singer sings is the Russian underlay's line. Not ruled by Dann.
- The ossia, Dann 2026-10-02, quoted in section 2. Its case is two heads on one stem; the case here is one place read as two notes. Report how the cases differ on the page; do not extend his ruling.

## 5. Constraints

- Change nothing that stays in `apps/`, `packages/`, or `third_party/`. Every instrument and its output go in `docs/sessions/measure-underlay-baseline_2026-10-12/`. Rasters, crops, and language data stay outside the tree.
- Set 3's other songs (Q, R, U, W, Y, and Z) stay unopened. V and X are not needed.
- No git command that writes.
- **Displaces:** nothing. Rows 78a to 79 run on the cloud lane at the same time and touch none of these files.

## 6. Done when

- Each of section 3's seven reports, with its numbers, holds on all four songs (S, T, K, and M), not only on the split bars.
- Step 5's letter-by-letter table exists for each of the three models.
- A recommendation, marked as Code's: which model row 82 is to fine-tune, and whether steps 4 and 6 together separate the Russian line.
- Nothing built. `WRITTEN` does not apply; this row measures.

## 7. Report back

`docs/sessions/report-code-underlay-baseline_r1_2026-10-12.md`, with a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set row 81's State in `docs/memory/QUEUE.md` and stop.
