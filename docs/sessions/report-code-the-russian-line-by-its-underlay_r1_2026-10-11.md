# Report: the Russian line found by its underlay, measured (QUEUE row 80, r1)

Code (Opus 5.5) on Dann's Mac, 2026-10-11, brief `brief-code-the-russian-line-by-its-underlay_r1_2026-10-11.md`, read whole, with the correction from Fable's review that Dann relayed mid-run (positions are already in homr's MusicXML; step 1 narrows to the frame; state the scale; confirm the controls' underlay).

- **Tree:** `b80b543` on `Shane`. The working tree held edits I did not make: `docs/memory/CONTRACT.md`, `PRODUCT.md`, and `QUEUE.md`, and several untracked briefs.
- **Measures only.** Nothing under `apps/` or `third_party/` was changed. Every instrument is in `docs/sessions/measure-russian-line_2026-10-11/`.
- **No git command that writes.** Q, R, U, W, Y, and Z were not opened.
- **Readings used:** row 77's "after" readings (`measure-set3-four-below_2026-10-11/after/`) of S, T, K, and M, read at the code now in `b80b543`.

## The answer first

**No general rule is possible from this measure. The test of step 3 does not separate, in any of the five forms tried.**

- **What works:**
  - homr's `imgpos` and the page Ilya renders are one frame (step 1).
  - Tesseract finds nearly every underlay syllable once the band under the voice staff is cut out: 33 of 33 Russian and 46 of 48 Latin.
- **What fails, three ways, any one of them enough:**
  1. **Tesseract cannot tell this Cyrillic from Latin.** With English and French loaded, it reads 10 of the 33 Russian syllables as Latin look-alikes («да» as "Ja", «жизнь» as "KM3Hb", «не» as "He"). Its confidences favour the wrong reading, and on M it reads a whole Russian row as Latin.
  2. **The nearest word below is the wrong question in S.** S prints English first, then Russian, then French, so the nearest word below every note is English. In S the brief's test keeps 5 of 116 Russian notes.
  3. **8 of the 26 extra notes stand within one notehead of a Russian note.** One is 0.1 staff spaces away, the same head read twice. No column test can separate those, whatever the OCR reads.
- **The controls show the cost.** Even the best form wrongly removes 18 of K's 134 notes and 26 to 30 of M's 62. Both songs have one Russian underlay.

## 1. One frame

- **Where the positions come from.** `generate-main.ts:494` to `:504` (`build_image_position`) writes each note's `imgpos`. It is where the decoder was attending: the coordinates come from the model's attention output (`transformer/decoder.ts:147` to `:150`), not from a detected head.
- **How they are mapped.** Two steps take them to the input image:
  - the staff's dewarp mapping back to homr's page (`toPage`, `pipeline/staff-image.ts:534`);
  - `pageToInput` (`pipeline/recognize.ts:184` to `:188`), which undoes homr's resize and then its autocrop: `x / (preprocessed.width / crop.width) + crop.left`, and the same for y.
- **The input image is Ilya's own raster.** `rasterizePdf` (`apps/web/src/lib/reader/page-pdf.ts:199` to `:200`) renders the PDF's **CropBox** with pdf.js, at `renderScaleFor`'s scale.
- **The scale used.** Both songs' CropBoxes are inside the 17 by 11 inch limit (`page-pdf.ts:65` to `:66`, `:74` to `:82`), so the scale is the full 400/72 px a point (400 dpi):

  | Page | CropBox | Raster |
  |---|---|---|
  | S, page 6 | 585 × 812 pt | 3250 × 4511 px |
  | T, page 2 | 612.8 × 802.8 pt | 3405 × 4460 px |

- **The mapping.** It is the identity onto Ilya's raster; no scaling is needed. I drew each `imgpos` on Ilya's raster of S's page 8, and every cross sits on its head, within about one head's width.
- **A trap I fell into first.** `pdftoppm` renders the **MediaBox** by default. T's MediaBox is 840.96 × 1189.20 pt, with its CropBox inset 67.66 pt on the left and top. On a `pdftoppm` render, every T position looked 376 px left of its head and 376 px above it. 376 px is 67.66 pt at 400/72. The positions were right; the render was not Ilya's. From then on, every measure uses Ilya's own raster, made by `raster.mjs`, which calls `rasterizePdf` in headless Chrome on the dev server.
- **One run I should not have made.** Before the correction reached me, I ran the scratch copy of the port on T's page 2 to read its positions. Its MusicXML writer failed on that page on WebAssembly (`MusicXmlError: KeyError: 3`), so I read the positions from `onVoices`. It agreed: on the MediaBox render, homr's positions land on the heads. Nothing from it is used below.

## 2. Tesseract on the underlay

**Set-up.** tesseract.js 7.0.0 (Ilya's own dependency) under Node, with the `4.0.0_best_int` language data for rus, eng, and fra. That data came from tesseract.js's default source, `cdn.jsdelivr.net/npm/@tesseract.js-data/`, downloaded with Dann's yes during the session and kept in the session scratchpad.

Two runs on Ilya's raster, both with rus+eng+fra:

- **Page:** the whole page, Tesseract's default layout (PSM 3), as the brief asks.
- **Band:** the strip under the voice staff, from 1.5 staff spaces below its bottom line to 1.5 spaces above the next staff, read as one block (PSM 6). The staff lines were found in a 500 px window at the middle of each system's notes, with ink taken as darker than the page's paper tone less 60, so that M's grey paper and T's slight rotation do not hide them. All 55 systems of S, T, K, and M were found, and I checked four crops by eye.

**The script of each word** is Cyrillic or Latin by which kind of letters it holds more of (U+0400 to U+04FF against A to Z and U+00C0 to U+024F).

**Counted by eye against the page, in the split bars** (S 49 and 69 to 73; T 21, 22, 41, 43, and 73 to 76; the word lists are in `step2.py`'s output):

| | Printed | Page run: found | Page run: right script | Band run: found | Band run: right script |
|---|---|---|---|---|---|
| Russian syllables | 33 | 19 | 13 | **33** | **23** |
| English and French syllables | 48 | 20 | 20 | **46** | **46** |

- The page run also returns many non-words from the staff lines and notes ("Eee", "SR", "TEE").
- The band run missed one English word, «to» (S bar 71), and one French word, «-veil?» (T bar 76). It merged some syllables into one box, such as «de sans» and «mor-ne»; each merged box is counted as finding every syllable it covers.
- **Every misclassification goes one way: Cyrillic read as Latin look-alikes.** In the band run, these 10:
  - S: «да» "Ja,", «жизнь» "KM3Hb", «мо» "MO"
  - T: «шум» "INYM", «ный» "HbIM", «и» "M", «со» "€O", «бѣ» "Ob", «не» "He", «ско» "CKO"
- No Latin word was read as Cyrillic.

## 3. The test

**What each note is tested against.** For every note homr read, I took the band words whose box overlaps the head, taken as `imgpos` x ± 30 px (about one head; the staff space is 27 to 29 px). A note's status, song or extra, is the unchanged scorer's (`status.ts` calls `scoreScan`).

**The five forms:**

- **A (the brief's):** the note is the Russian line where the nearest word below it is Cyrillic.
- **B:** the note is dropped only where a Latin word is in its column and no Cyrillic word is.
- **C:** as B, with each underlay row given one script by all the letters in that row.
- **D:** as B, with each row read twice, by Russian alone and by English and French alone; the row goes to the reading with the higher mean confidence.
- **E:** as B, with a row Cyrillic where at least half of its Russian-only words are found in the song's own Russian text. The truth file's syllables stand in for the singer's poem, with ѣ, і, ѳ, and a final ъ normalised.

**Whole songs:**

| Song, form | Russian notes kept | Russian notes dropped | Extra notes kept | Extra notes dropped |
|---|---|---|---|---|
| S, A | 5 | 111 | 0 | 12 |
| S, B | 63 | 53 | 7 | 5 |
| S, C | 76 | 40 | 6 | 6 |
| S, D | 89 | 27 | 8 | 4 |
| S, E | 103 | 13 | 9 | 3 |
| T, A | 105 | 92 | 8 | 6 |
| T, B | 118 | 79 | 8 | 6 |
| T, C | 130 | 67 | 9 | 5 |
| T, D | 129 | 68 | 7 | 7 |
| T, E | 154 | 43 | 8 | 6 |

**The measure separates in no form.** Every form either drops Russian notes, keeps extra notes, or both.

The table for each note in the split bars, with the word below it, its script, the scorer's verdict and syllable, and each form's verdict, is in `step3-S.txt` and `step3-T.txt`. Three rows show the pattern:

```
 21 F4   x 1588 extra   near рой   cyr  A:keep ...   (the French quarter, 20 px from the Russian half «рой»)
 21 F4   x 1568 song  рой ? near рой   cyr  A:keep ...
 73 F#4  x 1735 extra   near етъ,  cyr  A:keep ...   (2 px from «етъ»: one head read twice)
```

**Why the column cannot separate them** (`gaps.txt`): the distance from each extra note to the nearest Russian note of its bar, in staff spaces.

- **1.1 or less:** 8 of 26. In S: 0.4, 0.8, and 0.9. In T: 0.1, 0.7, 0.8, 1.0, and 1.1.
- **1.4 to 3.1:** 6 of 26.
- **3.7 or more:** 10 of 26.
- **No Russian note in its bar:** 2, both in S's bar 72. There the scorer pairs the Russian D4 with a note in bar 73.

A French or English note within one head of the Russian one shares its column and its word. Those eight are mostly the Russian note and the other language's note at one place: two heads side by side, or one head with two stems, which homr writes as two notes in two voices.

**A weakness found in measure E:** short Russian syllables match the poem as substrings almost anywhere. On S's page 7, the English row (cen, tu, ries) read by the Russian model as "сео" counted as Cyrillic.

## 4. The poem, as a second witness

The poem gives the syllables of each word. Placing them in bars is the job of the underlay reader (N.135), which does not exist. As an upper bound, I used the truth file's own syllables in each bar (`step4.txt`):

| Bar | Russian syllables | Truth notes | Notes homr read | Read, counted song | E kept | E kept, song |
|---|---|---|---|---|---|---|
| S 49 | 2 | 2 | 5 | 2 | 5 | 2 |
| S 69 | 1 | 2 | 5 | 2 | 4 | 2 |
| S 70 | 1 | 1 | 2 | 1 | 0 | 0 |
| S 71 | 1 | 2 | 4 | 2 | 3 | 2 |
| S 72 | 1 | 1 | 2 | 0 | 2 | 0 |
| S 73 | 0 | 0 | 2 | 1 | 1 | 0 |
| T 21 | 3 | 3 | 5 | 3 | 2 | 1 |
| T 22 | 4 | 4 | 5 | 4 | 4 | 4 |
| T 41 | 3 | 3 | 5 | 3 | 5 | 3 |
| T 43 | 3 | 3 | 5 | 3 | 3 | 2 |
| T 73 | 4 | 4 | 6 | 4 | 4 | 2 |
| T 74 | 4 | 4 | 6 | 3 | 3 | 2 |
| T 75 | 4 | 4 | 6 | 5 | 5 | 5 |
| T 76 | 2 | 2 | 3 | 2 | 3 | 2 |

- **In T, the count is a clean witness that a bar holds too many notes.** Every split bar has as many Russian syllables as Russian notes, and homr read more in each (5 or 6 against 2 to 4). It cannot say which notes to drop.
- **In S, ties and melismas break the count.** Bars 69 and 71 have one syllable and two Russian notes, so a count of syllables would drop a Russian note.
- **Agreement with step 3:** the count of notes E keeps equals the syllable count in 3 of 14 bars (T 22, 43, and 73). Only in T 22 are they the right notes.

## 5. Controls: K and M

K (Ippolitov-Ivanov, «Невольникъ», Jurgenson 1899) and M (Lyadov, «Колыбельная», Belaieff) each print one underlay, in Cyrillic, on every music page. I confirmed this on Ilya's rasters: K's printed pages 13 to 17, and M's pages 2 and 3. homr's reading of either has no extra note, so any note a form drops is wrongly removed:

| Form | K: notes wrongly removed (of 134) | M: notes wrongly removed (of 62) |
|---|---|---|
| A | 56 | 49 |
| B | 38 | 26 |
| C | 20 | 29 |
| D | 18 | 30 |
| E | not measured (K's truth has no syllables) | not measured (the same) |

The causes, from `step3.py`'s rows:

- **Russian syllables read as Latin.** On M, «Ко-тинь-ка ко-токъ» comes back as "Ko", "Ka", "KO", "TOKB,", and «хво-стокъ» as "XBO CTOK®,".
- **Tempo text in the band.** In K, «Più mosso.» stands above the piano's staff, inside the band, and is read as an English row.
- **Confidence favours the wrong reading on M.** The English and French model scores "XBO" at 83, while the Russian model scores «хво» at 5.

## Code's recommendation

**Do not build a rule from this measure.** The underlay can be found, and placed against homr's notes in one frame. But this Tesseract cannot tell pre-reform Russian lyric type from Latin, and a column test cannot split notes that share a head's place.

A rule would need three things, each measured on its own first:

1. **An underlay reader (N.135)** that cuts the band into rows. The band and its rows proved easy here: 55 of 55 systems found.
2. **Each row's language decided by the singer's poem,** not by the letters' code points or by confidence. That means matching whole words of the row's Russian-only reading, not syllables as substrings: E's weakness. Of the forms tried, E came closest on S and T (S: 13 Russian notes dropped and 3 of 12 extras dropped). It is not yet a separator.
3. **A rule for one place read twice:** two notes of one pitch at one place in a bar (within about one head) are one event, as Dann ruled for Ilya's own reader (row 20, the ossia). It must decide which length is the Russian one. Up to 8 of the 26 extras here are of this kind, and the rule could be measured without any OCR.

Even with all three, the two other-language lines at a distance (18 of 26 extras) still depend on the OCR placing a Latin syllable under them and no Cyrillic one.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **How precise `imgpos` is in general.** It is attention-derived. On S's page 8 every cross sat within about one head, but I did not measure its error over a whole song or on WebGPU against WebAssembly.
- **Measure E on the controls.** K's and M's truth files carry no syllables, so there was no poem text to match. The singer's own poem for either was not at hand.
- **Whether other OCR would do better.** Only Tesseract (tesseract.js 7, best_int data) was tried. A larger model, a Russian model trained on pre-reform type, or a different engine were not.
- **The step 2 counts are mine,** counted by eye against the page in the bars named. The truth files' syllables were the reference for the Russian ones.
- **Why homr's MusicXML writer failed on T's page 2 on WebAssembly** (`KeyError: 3`). WebGPU read the same page without fault in row 77.

## The files

In `docs/sessions/measure-russian-line_2026-10-11/`:

- **Scripts:**
  - `raster.mjs`: Ilya's `rasterizePdf` in headless Chrome
  - `notes.py`: notes, `imgpos`, and page
  - `systems.py`: staffs and underlay bands
  - `ocr.mjs`: tesseract.js
  - `step2.py`
  - `status.ts`: the scorer's verdict per note
  - `step3.py`: forms A to E
  - `gaps.py`
  - `step4.py`
  - `mark.py`: crosses on a page, for looking
  - `bands.py`: the first form of the band finder, superseded by `systems.py`
- **Data:**
  - `*.notes.jsonl`, `*.systems.jsonl`, `*.status.json`
  - `words/`: every OCR run, as word boxes, with no page images
- **Output:** `step3-S.txt`, `step3-T.txt`, `step3-K.txt`, `step3-M.txt`, `gaps.txt`, and `step4.txt`.

Kept outside the tree, in the session scratchpad (gone at the session's end):

- the rasters and band crops;
- the Tesseract language data;
- the scratch copy of the port.
