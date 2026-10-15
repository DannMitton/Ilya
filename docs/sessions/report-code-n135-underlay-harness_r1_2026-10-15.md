# Report: N.135 stage 1, the underlay harness (QUEUE row 103, r1)

Code (Sonnet 5.5) on Dann's Mac, 2026-10-15. Brief `brief-code-n135-underlay-reader_r1_2026-10-15.md` and Fable's review `review-fable-brief-n135-underlay-reader_r1_2026-10-15.md`, both read whole; every amendment applied, the review winning where they differ. Stage 1 only. Nothing ships.

Every number below is printed by a script in `docs/sessions/measure-n135-underlay-harness_2026-10-15/` (the harness folder). Each line names its output file.

## 1. The answer first

**Which reader, and which seating rule, reach 9 of 10 syllables right and under the right note, and where?** Almost nowhere today.

- **Only one song reaches it.** In `summary.txt` (R2), the Sunless no. 1 song (U1) reaches 92 to 94 percent of its 96 truth syllables seated right under reader (c) (Tesseract `Cyrillic`, a float model), by all three rules. No other song and no other reader reaches 90 percent. The best cell of every other song is 88 percent or lower: S 88 (t-syl, rule 3), U5 76, B03 80, P 65, B02 45 (homr read only 93 of its 157 notes, so 57 syllables are unread before any reader acts).
- **The one browser reader that loads, (a), reaches** 1,761 of 2,538 printed syllables (69 percent, sound, tokens split at an internal mark) and seats 1,546 of 2,385 truth syllables (65 percent) with its best rule (`score42-R2-split.txt`, `score44-R2.txt`). On the build songs: Sunless 74 percent seated (rule 2), P 60, Kabalevsky 62.
- **(c) cannot be the browser reader as it stands.** In headless Chrome 155 through the real `createWorker`, (c) aborts with `Aborted(missing function: _ZN9tesseract13DotProductSSEEPKfS1_i)` on `tesseract-core-relaxedsimd-lstm.wasm.js`, as it did under Node. (a) loads on the same core and reads the same text as Node on three rows (`chrome-load.json`).
- **Of the three outcomes in brief section 10, we are in the third:** no reader that loads in the browser suffices today. The teacher (t-imap) does not suffice either, on its own chunker (below).

**Which seating rule?** Rule 2 (order within the bar) wins for the Tesseract readers: best on 12 of 16 songs for (a) and 13 of 16 for (c). Rule 3 (monotone alignment) wins for the TrOCR readers (9 of 16 for t-imap, 9 of 16 for t-syl). Rule 1 (nearest head) wins on 1 to 5 songs. The rule is not what limits the score: when a token is read right, rule 2 puts it on its own note 95 percent of the time for (a) and (c) and 93 percent for (t-imap); rules 1 and 3 do 88 to 93 percent (`score44-R2.txt`, "Seating given the token is right"). **The reading limits the score, and so does a token that holds two printed syllables.**

**What the harness found that the brief did not predict:**

1. Row 81's row rule (R1) merges the Russian row with the German row under it, or with a tempo mark, on 26 of the 57 Sunless Russian rows (U4 4, U5 6, U6 16), and with the piano's upper reach or a slanted baseline on 17 more rows (Kabalevsky 16, P 1) (`rowstats.txt`). Splitting rows taller than 1.6 staff spaces at the valleys of their ink (R2, my addition) leaves 1 Sunless Russian row merged. Stage 2a's `cutRows` has to do this.
2. The prints join syllables in ways that cost every reader. Where a syllable ends and the next begins, the Sunless, P, and Kabalevsky prints use a short underscore, and the readers return a period, nothing, or the whole word. A token holding two or more printed syllables is counted wrong. Splitting a token at any internal non-letter (my addition) raises (a) from 1,391 to 1,761 and (c) from 1,459 to 1,801 right of 2,538.
3. The truth of U1 to U6 and B01 to B10 is in modern spelling (no ѣ, і, ѳ, ѵ, or final ъ in any of their syllables). The Sunless print is not: the sheet of U1 shows «безъ». So "letter for letter" is understated on the Sunless songs, and "sound" is the column to read there. P's truth is pre-reform (11 ѣ, 5 і, 23 final ъ). The Kabalevsky print is modern.

## 2. The tree

- **Branch and commit:** `Shane`. The session began at `bf78ff61`; HEAD read `b21ce8a6` at the end (another session committed during this one). I made no commit and ran no git command that writes.
- **The working tree held, that I did not make:** `docs/memory/QUEUE.md` and `docs/memory/STATE.md` modified; untracked `brief-code-n135-...`, `draft-guide-captions_...`, `measure-prereform-model_2026-10-12/`, `report-code-prereform-model_r1_2026-10-12.md`, and `review-fable-brief-n135-...`. My own additions are the harness folder and this report.
- **Gate 4.6:** `git --no-optional-locks status --short -- apps packages third_party static` is empty (run again at the end, see the last line of section 8).
- **What was running first:** the user's Chrome, the Claude app, and Ollama. No `python`, `torch`, `lstmtraining`, or `tesseract` process showed in `ps`, and nothing listened on `localhost:5173`. Row 82's training was not visible to me. I started `ilya-web` for Ilya's `rasterizePdf` and stopped it by its server id when the rasters were done.
- **MPS and CPU:** no script of mine moves the model to `mps`. (t-imap) and (t-syl) run with `torch.set_num_threads(4)` on CPU. Tesseract runs in Node and in headless Chrome, one thread.
- **Held-out songs:** I read `~/Downloads/_desk-heldout-exclusions_2026-10-12.md` first. I opened no folder of set 3 beyond the two files `four.json` names for S and T, no set 4 file, and no other letter's reading. I listed the folder `measure-set3-four-below_2026-10-11/after/drops/` and opened only the files of S, T, K, M, the Sunless, the Kabalevsky, and the P readings. The harness folder names no held-out song. It does hold, as row 81's `poem.txt` already did, the syllable text of S and T (`align/S.json`, `align/T.json`).

## 3. Songs and readers run

| Letters | Songs | Reading used | Truth with syllables |
|---|---|---|---|
| U1, U4, U5, U6 | Sunless 1, 4, 5, 6 | `after/drops/sun*.musicxml` (stamp `homr-web@0.2.0-ilya.7/465`, row 77) | `tools/e16-harness/output/truth/` |
| P | Tchaikovsky op. 38 no. 3 | `tch.musicxml` | the desk's draft (172 syllables), not proofed by Dann |
| B01 to B04, B06 to B10 | Kabalevsky op. 52 | `k*.musicxml` | `tools/e16-harness/output/truth/` |
| S, T, K, M | as rows 80, 81, 88 | `after/drops/{S,T,K,M}.musicxml` | S and T carry syllables; K and M carry none |

**Not run, and why.** U2, U3, and B05: no reading at the current stamp is on disk, and `sunless3-diagnosis_r1_2026-10-06/reads/` holds an older reading in another pixel frame. Making one means running homr in Chrome on WebGPU, on the GPU row 82 holds. (d), row 82's `rus_prereform`: not landed, and the files in `~/Downloads/_desk-prereform/models/rus_prereform/` are another session's, so I did not touch them. (p), reader RapidOCR: struck by amendment 1; I did not re-open it.

**Readers.**

| Name | Reader | Where it ran |
|---|---|---|
| (a) | Tesseract `rus` 4.0.0_best_int, tesseract.js 7.0.0, PSM 7 | Node 24.13.0, default core; and Chrome 155 |
| (c) | Tesseract `Cyrillic` best (float), PSM 7 | Node, scratch copy on `tesseract-core-simd-lstm`; Chrome (fails) |
| (e) | Tesseract `eng`, Homebrew 5.5.3 file | Node and Chrome; the "other language" reading of decision 2 |
| (t-imap) | `taiga75/ru-trocr-1700s` at `d5563063e42e4f10104e967eca6644ae17714878`, row 88's chunks, Latin i mapped to і | CPU, 4 threads |
| (t-syl) | the same model, one ink piece per chunk (mine) | CPU, 4 threads, Russian rows only |

**Models** (outside the tree, `~/Downloads/_desk-n135/models/`): `rus.traineddata.gz` 2,679,598 bytes md5 `9c66849e0afcfd659d613e71695d6f1c` (downloaded again from the same jsDelivr URL as row 81; md5 matches); unzipped 5,053,706 bytes md5 `d9803e3ca069b58b5c1dc6745d2bdf16`; `Cyrillic.traineddata` 36,730,735 bytes md5 `3bc80391cf90b1e7b9c9296429e96821` (copied from `~/Downloads/_desk-prereform/models/`, md5 equals row 81's); `eng.traineddata` 4,113,088 bytes md5 `d1be414fbb296b3ad777bfca655e194e` (already on disk with Homebrew's Tesseract). TrOCR: row 88's files, 1,335,747,032 bytes for `model.safetensors`. No other download.

**Controls that reproduced earlier work exactly.** My rows for S, T, K, M equal row 81's byte for byte (`cmp`, R1). My (a) and (c) readings of M equal row 81's. (a) 295, (c) 315, and (t-imap) 390 letter / 391 sound of 493 are row 81's and row 88's numbers (`score42-R1.txt`; my R2 form gives the same for these four songs).

## 4. Each measurement

Expectations and likeliest failures are the brief's, written before the run. For the three things I added (R2, the split of tokens, (t-syl)) I wrote no expectation before running; I added them after R1's results.

### 4.1 Rows and bands (`rowsys.py`, `rowsys2.py`, `label.py`, `rowstats.py`, `rowstats.txt`)

- **Expected:** every Russian row of U1 to U6 and B01 to B10 becomes exactly one row. **Likeliest failure:** photocopy grey on B01 to B10 splits a row or swallows the piano's reach.
- **Result, R1 (row 81's rule):** one row each on 129 of the 172 Russian rows of the Sunless, P, and Kabalevsky songs (43 merged); 26 of the 57 Sunless Russian rows are merged with the row under them or a tempo mark (taller than 2.2 staff spaces), as are P 1, B06 4, B07 2, B08 4, B09 3, B10 3. No Russian row was split. The failure was the Sunless German row, a few pixels under the Russian, and not the photocopies' paper tone. Rows per system, for every song, are in `rowstats.txt`.
- **Result, R2 (my split at ink valleys, `rowsys2.py`):** 1 Sunless Russian row stays merged (U5); P 1, B06 4, B07 2, B08 3, B09 3, B10 3 stay tall (slanted baselines and piano reach on rotated pages). B10's first page is rotated, and row 80's staff finder found no staff on its four systems; I found them with a 120 px window instead of 500 px (departure 3).
- **By eye:** two systems of each of the 18 songs, drawn on the band (`sheets/E-<song>.png`). Every Russian label sat on the Russian row. The transcription matched the print on every checked system except the differences in section 5.
- **No English row seen** beside the Russian on the 20 Kabalevsky systems I checked; the "other" rows there are tempo words, dynamics, and noteheads. Not established for the pages I did not draw.

### 4.2 Syllables read right (`score42.py`; `score42-R1.txt`, `score42-R1-split.txt`, `score42-R2.txt`, `score42-R2-split.txt`)

Percent of the printed syllables of the transcription, sound, R2. "As read" is row 81's token rule; "split" splits a token at an internal non-letter.

| Group | Printed | (a) as read | (a) split | (c) as read | (c) split | (t-imap) as read | (t-imap) split | (t-syl) split |
|---|---|---|---|---|---|---|---|---|
| U1 to U6 | 619 | 362 (58%) | 458 (74%) | 364 (59%) | 457 (74%) | 362 (58%) | 384 (62%) | 357 (58%) |
| P | 177 | 50 (28%) | 97 (55%) | 65 (37%) | 102 (58%) | 89 (50%) | 100 (56%) | 87 (49%) |
| B01 to B10 | 1,249 | 684 (55%) | 870 (70%) | 715 (57%) | 907 (73%) | 772 (62%) | 790 (63%) | 459 (37%) |
| S, T, K, M | 493 | 295 (60%) | 336 (68%) | 315 (64%) | 335 (68%) | 391 (79%) | 395 (80%) | 374 (76%) |
| All | 2,538 | 1,391 (55%) | 1,761 (69%) | 1,459 (57%) | 1,801 (71%) | 1,614 (64%) | 1,669 (66%) | 1,277 (50%) |

- **Expected:** (t-imap) above 75 of 100 on every pre-reform song; (a) between 55 and 70; on B01 to B10 (a) and (c) close most of the gap to (t-imap). **Likeliest failure:** the photocopies' broken strokes cost (a) and (c) more, and the gap widens.
- **Result:** the S, T, K, M row holds (t-imap 79, (a) 60). It fails on every other pre-reform song: (t-imap) as read is 58 percent on U1 to U6 and 50 on P. (a) is inside 55 to 70 only on U1 to U6 (58) and B (55, at the edge). On B the gap did not widen; it nearly vanished (t-imap 62, (c) 57), because (t-imap) fell, not because Tesseract rose. Tokens covering two or more printed syllables, as read: (a) 413, (c) 359, (t-imap) 318, (t-syl) 435 (`score42-R2.txt`).
- **Pre-reform letters** (`score42-R2-split.txt`; counted only where the transcription holds them: P, S, T, K, M): ѣ 32 printed, (t-imap) right 31, (c) 0 right, (a) 0 right; і 11, (t-imap) 8, (c) 6, (a) 0; ъ final 124, (c) reads 104 as ъ, (a) 70 and doubles 19. No ѳ or ѵ is printed.
- **Misreads that become words** (`scorewords-R2.txt`, amendment 5): of the sewn words of two or more letters on Russian rows, (a) reads 1,443; 983 are a word or a printed syllable of the song, 131 (9 percent) are not but are dictionary entries, and 329 (23 percent) are not entries. (c): 1,456, 990, 126, 340. (t-imap): 1,485, 1,083, 117, 285. A word that is wrong but in the dictionary reaches the singer with a gloss, and nothing in the tree catches it (OPEN.md:2367-2368). The "no confident non-word" count is the non-word share, and it does not cover the 9 percent that are words.

### 4.3 The language of a row (`score43.py`; `score43-R1.txt`, `score43-R2.txt`)

R2, all songs, Russian rows of more than two countable words (210 to 214 by reader): Russian called Russian / other-language rows called Russian / not-text rows called Russian / Russian missed.

| Decision | (a) | (c) | (t-imap) |
|---|---|---|---|
| 1 dictionary witness | 179 / 82 / 12 / 31 | 180 / 38 / 1 / 34 | 189 / 25 / 7 / 21 |
| 2 two readings (Russian against `eng`) | 171 / 57 / 11 / 39 | 170 / 26 / 2 / 44 | 174 / 20 / 10 / 36 |
| 3 position (first text row) | 172 / 29 / 0 / 38 | 177 / 27 / 0 / 37 | same, 172 / 19 / 0 / 38 |
| 4 dictionary witness with the poem | 167 / 8 / 0 / 43 | 180 / 4 / 0 / 34 | 195 / 0 / 0 / 15 |

Short rows (two or fewer countable words, about 18 per reader) are apart in the file: decision 1 calls 14 to 17 of them Russian and also calls 47 to 55 short other rows Russian.

- **Expected:** decision 1 with (t-imap) calls at least 50 of the 55 rows of S, T, K, M and every Russian row of U1 to U6, false calls only on short rows. **Likeliest failures:** one misread letter makes a short row a non-word; German look-alike letters read as Cyrillic words.
- **Result:** S, T, K, M: 41 of 46 long rows plus 9 of 9 short = 50 of 55, so the first half holds. U1 to U6: 48 of 54 long rows plus 1 of 3 short, so "every Russian row" fails, and false calls are not only on short rows (11 German or other rows and 5 not-text rows called Russian, plus 18 short ones). Both predicted failures occurred, the German one worse.
- **Section 5's threshold** (decision 1 calls a Russian row in every system of a page and at least half of those words are dictionary entries). Pages passing of 69: R2 (a) 52, (c) 46, (t-imap) 52; R1 (a) 46, (c) 38, (t-imap) 49. By group, R2 (a): U 14 of 17, P 2 of 3, B 25 of 30, S/T/K/M 11 of 19. The number is high enough to be a rule only for the Sunless and Kabalevsky pages; on P (a) and (t-imap) pass 2 and 1 of 3, and (c) passes none.
- **Dictionary fidelity:** the dictionary is the key set of `data/dictionary*.json`, the supplement, and the homographs (909,795 words, ё folded, hyphens out), not `GraysonEngine.lookupStress` itself. Whether the two agree is NOT ESTABLISHED.

### 4.4 Seating (`score44.py`; `score44-R1.txt`, `score44-R2.txt`, `walk.py`)

Percent of each group's truth syllable-bearing notes seated right in sound, R2, by rule 1 / 2 / 3. The denominator includes truth syllables whose note homr did not read (U5 1, B02 57; no other song).

| Group | (a) | (c) | (t-imap) | (t-syl) |
|---|---|---|---|---|
| U1 to U6 (599) | 72 / 72 / 71 | 71 / 74 / 68 | 62 / 61 / 60 | 55 / 54 / 55 |
| P (172) | 59 / 60 / 55 | 60 / 62 / 65 | 59 / 61 / 60 | 47 / 49 / 51 |
| B01 to B10 (1,304) | 58 / 62 / 59 | 59 / 66 / 60 | 54 / 57 / 58 | 34 / 36 / 37 |
| S, T (310) | 63 / 65 / 64 | 63 / 66 / 62 | 77 / 79 / 80 | 74 / 76 / 75 |

Tokens seated on a note that carries no truth syllable (a tie's second note, a melisma continuation, an extra note): (a) 32, 34, 50 for rules 1 to 3; (c) 41, 46, 66; (t-imap) 34, 31, 40. Rule 2 and rule 1 seat the fewest.

- **Expected:** rule 3 beats rule 1 wherever a row holds a melisma; rule 1 within 2 syllables of rule 3 on B01 to B10; 9 of 10 on B01 to B10 with (t-imap), below 9 of 10 on U1 to U6. **Likeliest failures:** the box is offset from `imgpos` by more than a head; a chunk holds two syllables.
- **Result:** the 9 of 10 on B with (t-imap) fails (54 to 58). Rule 1 is not within 2 syllables of rule 3 on most B songs (up to 12 apart per song). I did not isolate rows with a melisma, so the first expectation is NOT ESTABLISHED. Both failures occurred: the right token's box centre sits a median 10 to 50 px right of `imgpos` (staff space about 30 px; `score44-R2.txt`, last block), and 289 to 413 tokens cover two or more syllables.
- **Rule 2 as built:** from the brief's description (a bar's tokens, equal in number to its notes not tied into, paired in order; otherwise rule 1). I did not read `old-reader-seats.ts:165-175`. The printed extender is not observable here, so a melisma under an extender is not removed from the notes counted.
- **P's four walk findings** (`walk-R2.txt`; the draft is the desk's, not proofed by Dann; bars are the truth's `measureIndex`, so 14 and 15 stand for print bar 16, 76 and 77 for bars 77 and 78). (a) and (c) match all four exactly, case and marks kept, by rules 1 and 3: «су | е | ты,» with its comma, «те | бя» lower-case, «груст | но | я, | груст | но», «зву | читъ!». (t-imap): the comma token is read «гы,» and «чных!» replaces «читъ!»; «те-бя» and the repeated «грустно» are right by rule 3 (rule 1 leaves one empty). (t-syl): reads «Те» with a capital, and no token for «зву».

### 4.5 What a reading costs (`cost.py`, `chrome-load.mjs`; `cost.txt`, `chrome-load.json`)

- **Seconds per page** (recognition, model loaded): (a) 0.5, (c) 0.7, (e) 0.3 over 69 pages. (t-imap) on CPU, 4 threads: 24.3 s a page and 0.66 s a chunk over 2,540 chunks (row 88 on MPS: 0.40). (t-syl): 23.3 s a page, 0.60 s a chunk.
- **Bytes:** (a) 2,679,598 gzip (5,053,706 raw); (c) 36,730,735 (19,830,479 gzip, my gzip); (e) 4,113,088; the core it fetches 3,905,767; `tesseract.min.js` 62,961; `worker.min.js` 111,307. (t-imap) is the teacher: 1,335,747,032 bytes, not a browser candidate.
- **Expected:** (a) loads as on today's poem path; (c) fails as under Node; **likeliest failure:** Chrome's core choice differs, and (c) loads. **Result:** as expected. Chrome 155 fetched `tesseract-core-relaxedsimd-lstm.wasm.js` for all three; (a) and (e) loaded (init 0.13 s and 0.07 s, rows in 0.04 to 0.13 s); (c) failed uncompressed and gzipped with the `DotProductSSE` abort. (d) NOT RUN.

## 5. Spelling and transcription (amendment 9)

I did not correct the transcription to the print row by row; that is about 2,500 syllables across 18 songs. Method: the truth's `syllableText` in note order, put on the system's row that best matches it (S, T, K, M: row 81's `poem.txt`), checked by eye on 36 systems (two per song). The checks found:

- **ё:** the truth has ё in 33 syllables where the print has е (`score42-R2.txt`: U1 2, U4 1, U5 4, U6 3, B01 5, B02 2, B03 1, B04 5, B06 3, B07 1, B08 3, B10 3). They count right in sound, wrong in letter.
- **Spelling:** the truth of U1 to U6 and B01 to B10 is modern; the Sunless print holds «безъ» (U1). P's truth is pre-reform and matched the print on both systems drawn.
- **Hyphens and joins:** the print writes some multi-syllable words whole where the truth has one syllable per note («Быстрый» under three notes, U1). This cannot be fixed by retyping; it is the print's own division, and it counts against every reader.
- **Marks:** a dash after «Люблю,» in B03 and a full stop before «и» in B04 are in the print and not in the truth.

Not found on the 36 systems: a different word. Not established for the other systems.

## 6. Departures from the brief

| Departure | Reason | Reversible |
|---|---|---|
| Added row rule R2 beside row 81's R1; both reported | R1 merges the Russian and German rows on 26 of 57 Sunless rows | Yes, harness only |
| B10 page 1: staff finder fallback window 120 px | row 80's 500 px window found no staff on a rotated page | Yes |
| Page breaks at a 500 px y drop, not row 80's 1500 | B07 loses a page at 1500 (its drop is 745); inside pages the largest drop is 120 px. S, T, K, M are identical either way | Yes |
| Transcription from the truth, checked on 36 systems | cost; see section 5 | Yes, by retyping |
| Tokens split at an internal non-letter (4.2 "split", 4.4) and (t-imap) boxes shared by letters inside a chunk | seating needs a box per syllable; (a) and (c) join «су-е» and «Ком.нат» | Yes |
| (t-syl) added | row 88's open question on a finer chunker | Yes |
| Decision 2 reads English only: `eng` from Homebrew, no French model on this Mac; the "other" dictionary is `/usr/share/dict/words` plus the words of the dictionary's French glosses (15,732, a poor lexicon) | no download without Dann's yes | Yes |
| Row label `notext` for a core taller than 2.2 spaces; labels from similarity of (a) and (c) readings to the truth, and the Sunless fell back to "first row" under R1 only | no hand labels | Yes; by-eye check found no wrong label on 36 systems |
| Rule 2 ignores the printed extender | not observable here | Yes |

## 7. Could not establish

- Whether `isKnownWord` (the engine's `lookupStress`) agrees with my 909,795-word set.
- U2, U3, B05, and (d): not run (section 3).
- Whether the seating rules differ on melismas: no melisma rows isolated.
- Whether Kabalevsky op. 52 prints English beside the Russian on pages I did not draw.
- K and M: no syllable truth, so 4.4 does not score them; they count in 4.2, 4.3, and the page threshold.
- Why (t-syl) falls to 37 percent on B (fragmented strokes in the photocopies are my guess; I did not test it). A cut at the underscore ink, not a gap, is untried.
- How far `imgpos` sits from the printed head over a whole song: only the median offset of right tokens is measured (10 to 50 px).
- Whether the Sunless and Kabalevsky engravings match the scans in key and edition: matched on the 36 systems seen, nothing more.

## 8. The files

In the harness folder: `prep.py`, `status2.ts` (notes and alignment), `rowsys.py`, `rowsys2.py`, `label.py`, `rowstats.py` (rows), `ocr-rows.mjs`, `run-tess.sh`, `read_t.py`, `read_tsyl.py` (readers), `score42.py`, `score43.py`, `score44.py`, `scorewords.py`, `walk.py`, `cost.py`, `chrome-load.mjs`, `summary.py` (scores), `sheet.py`, `eyecheck.py`, `tile.py`, `raster.mjs` (checks), `common2.py`, `norm.ts`. Data: `notes/`, `align/`, `read/`, `systems/`, `rows/`, `rows2/`, `labels/`, `labels2/`, `ocr/`, `ocr2/`, `calls43-*.json`, `score*-R1|R2*.txt|json`, `summary.txt`, `rowstats.txt`, `cost.txt`, `chrome-load.json`, `walk-*.txt`, `sheets/E-*.png`, `poem-r81.txt` (copy of row 81's). Outside the tree, `~/Downloads/_desk-n135/`: rasters, crops, models, the patched tesseract.js copy, word lists, and `truthpaths.json`.

`git --no-optional-locks status --short -- apps packages third_party static` at the end: empty.
