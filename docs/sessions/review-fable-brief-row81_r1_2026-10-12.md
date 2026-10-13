# Review of the Code brief for QUEUE row 81, the underlay baseline (r1, 2026-10-12)

Reviewer: Fable, as a subagent of the desk. Read whole: `brief-code-underlay-baseline_r1_2026-10-12.md`; row 80's report; `BRIEF-TEMPLATE.md`; the review of rows 78 to 80; `OPEN.md` lines 3000 to 3006 (N.184) and 2764 (item 12, the ossia). Opened on the Mac tree (`~/Desktop/ilya-rewrite`, read only, no git write): every file in `docs/sessions/measure-russian-line_2026-10-11/` named below, `measure-set3-four-below_2026-10-11/run.py` and `after/`, `pre-reform-normalizer.ts`, `metre-witness.ts`, `ScoreUploader.svelte`, `join-pages.ts`, and `apps/web/node_modules/tesseract.js/src/worker-script/index.js`. I also opened the S and T truth files' field names only (`~/Downloads/_desk-heldout3-private/truth/`), and ran one count over row 80's `*.notes.jsonl` and `*.status.json` (amendment 7). No sealed song was opened.

## Verdict: SEND WITH AMENDMENTS

The shape and the questions are right. Three things in section 3 would not work as written: `normalizePreReform` empties every modern word (amendment 4); the S and T truth files cannot give the poem's words (amendment 3); and the metre check cannot see the second voice, where every one-place pair's other note lives (amendment 9). One claim in section 2 is settled: tesseract.js 7 loads a script model by name (amendment 2).

## Section 2 checked against the tree

| Claim | Result |
|---|---|
| `ScoreUploader.svelte:450`, `createWorker('rus')` | checks |
| `join-pages.ts:435-437`, `placeOf` | checks (comment :435, function :436 to :439) |
| `pre-reform-normalizer.ts:310`, `:237`, `:230` | checks |
| `systems.py`, 55 of 55; `*.notes.jsonl` fields; `*.status.json`; `words/` | checks (`words/` holds 55 `band-`, 55 `rus-`, 55 `lat-`, 6 `page-` runs) |
| `OPEN.md` item 12, the ossia, quoted | checks (line 2764) |
| N.184 lead on the character sets | matches `OPEN.md:3004`; not re-read in langdata_lstm |
| Row 76 93.8; row 77 S 12 and T 14 extras; row 80's 10 of 33, 8 of 26 | check |
| Row 77's brief "section 3.3" | the DESK DEFAULT is section 3, item 3 (`brief-code-set3-four-below_r1_2026-10-11.md:28`) |

## Amendments

1. **Section 3, before step 1, the inputs.** Add: "The PDFs resolve by `docs/sessions/measure-set3-four-below_2026-10-11/run.py` lines 12 to 14 (`src`): S and T under `~/Downloads/_desk-heldout3-private/truth/` (`four.json` names them), K and M under `~/Downloads/_desk-2026-10-08/heldout2-scans/`; their truth files by `run.py:55-57`. The readings are `measure-set3-four-below_2026-10-11/after/drops/<L>.musicxml` and `after/<L>.read.json`. `raster.mjs` needs the dev server at `localhost:5173` (`raster.mjs:9`)." Reason: the brief names none of these, and `notes.py:3` and `status.ts:6-8` take them as arguments.

2. **Section 2, the lead on tesseract.js.** Replace "Whether tesseract.js 7 loads a script model under its own name from a local `langPath` is NOT ESTABLISHED; if it does not, use the `tesseract` command line ..." with: "tesseract.js 7.0.0 loads `${langPath}/${lang}.traineddata` (`.gz` when `gzip` is true) by the name given, with no mapping of script names (`apps/web/node_modules/tesseract.js/src/worker-script/index.js:132-151`), and hands that name to `api.Init` (`:264`). So `createWorker(['Cyrillic'], 1, { langPath, gzip: false })` works with `Cyrillic.traineddata` in `langPath`. Use one directory per model: the loader reads `${cachePath}/${lang}.traineddata` before `langPath` (`:112`), so (a) and (b), both named `rus`, collide in one directory. Whether the WebAssembly core accepts the float `tessdata_best` files is NOT ESTABLISHED; row 80 used `best_int`. If a float file fails to initialise, say so and use the `tesseract` command line if the Mac has it (NOT ESTABLISHED that it does)." Reason: read at the lines cited; `ocr.mjs:8` passes `gzip: true` and `cachePath: tessdata`, which is where the collision would happen.

3. **Step 3, the poem.** Replace "For S and T, the poem is the truth file's syllables joined into words, as row 80's measure E did." with: "For all four songs, type the Russian words of the underlay from the page, as printed, in reading order, and mark them as your transcription. For S and T, check your text against the truth's `syllable` fields: every syllable, with its hyphen and spaces removed, must occur in order in your text; report any that does not." Reason: the S and T truth files carry `syllable` with no word-boundary field (fields listed from the files; one T entry is «въ лѣ», two words), so words cannot be rebuilt from them, and measure E (`step3.py:17`) joined every syllable into one string and matched substrings, which row 80 names as E's weakness.

4. **Step 3, the normaliser.** Replace "Normalise both the poem and every reading with `normalizePreReform` before matching (take the first candidate; say if any word has more than one)." with: "Normalise each token, in the poem and in every reading, with `modernisePreReform` under `tsx` (as `status.ts` runs), keeping the token itself where it returns `null`; then lower-case it, fold ё to е (DESK DEFAULT), and strip every character outside а to я. Compare the results for equality." Reason: `normalizePreReform` returns an empty list for a word with no pre-reform feature (`pre-reform-normalizer.ts:310-313`, documented at `:193-195`), so "the first candidate" would empty every modern word, and it holds at most one candidate (`:191-192`), so "more than one" cannot occur.

5. **Step 4, what a word is.** Add: "A row's words: its word boxes in x order, with a token ending in a hyphen sewn to the next token in the same row; tokens of fewer than two Cyrillic letters after amendment 4's normalising are not counted (DESK DEFAULT, as `step3.py:11` did). A row with no countable word is other. 'At least half' is of the countable words." Reason: the underlay prints syllables («про-», «буж-», `step3-T.txt:37-38`), so a whole-word match fails on every hyphenated word unless the syllables are sewn first.

6. **Step 1, the row cut.** Add: "Ink is darker than the page's paper tone less 60, as `systems.py:11` takes it. A row is a run of raster lines whose ink count exceeds 2 percent of the band's width; runs separated by less than 0.3 staff space are one row; a row under 0.4 staff space tall is dropped (melisma extenders, hyphens alone); each row is padded by 0.3 space above and below before the OCR (DESK DEFAULT)." Reason: "a horizontal ink profile is enough" leaves the threshold and the merge distance to Code, and a wrong cut changes every later count.

7. **Step 6, what the data already shows.** Add: "By row 80's `*.notes.jsonl` and `*.status.json`, the rule as written (same bar, same page, same `midi`, `x` at most 30 px apart, chords excluded) finds S 4 pairs, T 7, K 0, M 0 (the desk's count, 2026-10-12). In T two pairs are two song notes (bar 22, x 2108 and 2122; bar 75, x 2691 and 2670); in S bar 72 both notes are extra; five of the eleven pairs share one `type`, so 'longer' cannot decide them; in T bar 76 the song note is the shorter. Report every pair against this list, and report a pair where both are song as the rule's cost." Reason: the brief expects K and M to supply the control and they hold no pairs, while the cost the control was to show is in S and T.

8. **Step 6, "false merge".** Replace "(where every such pair is a false merge, since homr read no extra note there)" with "(where homr read no extra note, so any pair found is two notes of the song, and a rule that drops one of them is wrong)". Reason: as written it says the opposite of what the control measures.

9. **Step 6, the metre rule.** Replace "the note whose bar then sums to the printed metre (Ilya's own metre check, `apps/web/src/lib/omr/metre-witness.ts`)" with: "the note whose removal leaves the bar's notes and rests, over both voices, summing to the truth's `measureDurations` for that bar; sum `<duration>` over the divisions in force from `after/drops/<L>.musicxml`, as `barFacts` does (`metre-witness.ts:157-180`), but without its voice-1 filter (`:171`)." Reason: every pair found has one note in voice 2 or 3 (amendment 7's count), and `barFacts` skips every note outside voice 1, so Ilya's own check cannot see the pair.

10. **Step 6, the larger head.** Add: "Head size: on Ilya's raster, in a window 2 staff spaces square centred on `imgpos`, with the staff lines blanked (their y from `systems.jsonl`), take the connected ink component nearest the centre and measure its width across its own vertical middle; the heads differ in size where the widths differ by more than 20 percent (DESK DEFAULT). A hollow and a filled head of one width are one size." Reason: "larger head" has no measure in the brief, and `imgpos` is attention-derived, within about one head (row 80, section 1), so the window must find the head rather than assume it.

11. **Step 6, the scorer's verdict.** Replace "report which of the two notes the scorer counts as the song" with "report the scorer's status of each (song, extra, or both the same)". Reason: S bar 72's pair is two extras and T has two pairs of two song notes (amendment 7).

12. **Step 2, the data.** Add: "Downloading the three model files (jsdelivr `4.0.0_best_int` for (a); GitHub `tesseract-ocr/tessdata_best` for (b) and (c)) is permitted for this row (DESK DEFAULT); row 80's copies were in its scratchpad and are gone. Record each file's size and md5 in the report." Reason: row 80 downloaded with Dann's yes during the session; the brief gives Code no standing to repeat it.

13. **Step 5, "read right".** Add: "A syllable is read right where the row's token, hyphen removed, equals the printed syllable letter for letter, pre-reform letters included, case folded. Give a second count after amendment 4's normalising, so a model that reads ѣ as е is counted as right in sound and wrong in spelling." Reason: `rus` cannot output ѣ at all (N.184), so without the second count the baseline for row 82 to beat is 0 by construction and says nothing about the rest of the word.

14. **Section 6, third bullet.** Replace "which model row 82 should fine-tune" with "which model row 82 is to fine-tune". Reason: house style; the only other occurrence of a barred word is inside Dann's quotation in section 4, which stays.

15. **Step 7.** Add: "A note's column is `imgpos` x ± 30 px against the word boxes of its system's band, as row 80's form B (`step3.py:5-6`); the row calls come from step 4, per model." Reason: the brief names the rule but not the column it is applied to.

## Could not establish

- Whether the Mac has a `tesseract` command line; the device shell is a Linux VM, not the Mac.
- Whether tesseract.js 7's WebAssembly core initialises the float `tessdata_best` models; row 80 used `best_int` only.
- Whether K's and M's truth files or `.notes.md` hold the poem's words; row 80 says the truth carries no syllables, and I did not open them.
- The frame of `imgpos` on K and M against Ilya's raster; row 80 checked S and T only (its section 1), though `systems.py` found all of K's and M's systems from those positions.
- The character sets of `rus` and `Cyrillic` in `langdata_lstm`; taken from `OPEN.md:3004`, not re-read.
