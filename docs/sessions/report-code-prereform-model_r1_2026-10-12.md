# Report: a Russian model that reads ѣ, ѳ, ѵ, and і, trained and measured (QUEUE row 82, r1)

Code (Opus 5.5) on Dann's Mac, 2026-10-15, brief `brief-code-prereform-model_r3_2026-10-12.md`, read whole, after row 81's report, row 88's report, and section 3 of the desk's private exclusions file, all read whole.

- **Tree:** `14e2ff8e` on `Shane`. The working tree already held edits I did not make (`CONTRACT.md`, `QUEUE.md`, `SEQUENCE.md`, `STATE.md`, and untracked briefs). I changed row 82's State in `QUEUE.md` and nothing else outside this row's folder.
- **Nothing kept in `apps/`, `packages/`, `third_party/`, or `static/`** (`git status --short -- apps packages third_party` is empty). Everything this row wrote is in `docs/sessions/measure-prereform-model_2026-10-12/` (2.0 MB, one PNG of 0.35 MB) and this report.
- **Outside the tree:** `~/Downloads/_desk-prereform/` (7.0 GB of 20 GB allowed): fonts, Wikisource pages, 24,000 rendered lines, tesstrain, ten checkpoints, the trained models, and the scratch tesseract.js. Songs' crops and rasters are in `songs/` there.
- **No git command that writes.** No scan from IMSLP was downloaded. Q, R, U, W, Y, Z and set 4 were not opened. No song other than S, T, K, and M is named here; the exclusion counts below are counts only.
- **Dev server:** started once for `raster.mjs`, stopped by its server id (6b1ddd9f) when the rasters were cut; nothing listens on 5173.
- **One shot on the real songs:** S, T, K, and M were read with one trained model (one checkpoint, chosen before any song was read, by the synthetic held-out set alone). That model was read in three forms (step 5b). No second model was trained, since the first met every floor.

## The answer first

**Step 3b was dropped. The first model trained on 23,591 rendered lines alone, and on S, T, K, and M it meets every floor in section 6.** Its integer form is 1,016,969 bytes. It fails one test I was given for shipping, so my recommendation is not to ship it yet.

| Count on S, T, K, M | Floor | (c) row 81 | **(d) integer form** | (d) float form | Row 88's teacher (t-imap) |
|---|---|---|---|---|---|
| ѣ right | 14 of 21 | 0 | **18** | 18 | 21 |
| і right | 3 of 6 | 3 | **6** | 6 | 6 |
| word-final ъ right | 97 of 101 | 97 | **98** | 101 | 98 |
| syllables right, letter for letter | 315 of 493 | 315 | **336** | 368 | 390 |

- **The integer model loads on all three runs**, including the relaxed-SIMD core that tesseract.js picks under Node 24, where (b) and (c) aborted. Its text is byte-identical between the two cores on 146 of 146 rows. The float form of the same model aborts on that core with the same `DotProductSSE` message.
- **The integer form is much worse than the float form on the synthetic held-out set:** character error rate 15.06 percent against 1.67 percent. By the brief's own rule ("shipping is not recommended where (d)'s character error rate on the held-out set is worse than (c)'s", which is 12.27 percent on the mapped lines), the integer form fails it, and the float form, which cannot run on that core, passes it. On the real songs the same gap is smaller: 336 against 368 syllables.
- **Code's recommendation:** do not ship this model into Ilya. Train again with one named change (section "Recommendation").

## 1. The tools

- **Installed with Homebrew, nothing else:** `brew install tesseract` (5.5.3, leptonica 1.87.0; the formula runs `make training` and `training-install`), and `brew install make` (GNU Make 4.4.1; `/usr/bin/make` is 3.81 and tesstrain's Makefile refuses anything under 4.2). The brief's "stop if more than Homebrew" did not apply. A `brew cat` turned Homebrew's developer mode on; I turned it off again with `brew developer off`.
- **All seven present** at `/opt/homebrew/bin`: `tesseract`, `text2image`, `lstmtraining`, `combine_tessdata`, `unicharset_extractor`, `merge_unicharsets`, `set_unicharset_properties`, and also `lstmeval` and `combine_lang_model`. `lstmtraining --version` gives 5.5.3.
- **tesstrain** (`tesseract-ocr/tesstrain` at `405346a3a67d8e4e049341d1da6a4b752e0b8351`) **runs with `START_MODEL=Cyrillic`**, with four things set from outside: `PY_CMD` pointing at a venv (Homebrew's Python cannot import Pillow: `_jpeg_resync_to_restart`), `TESSERACT_SCRIPTS=Cyrillic` with `Cyrillic.unicharset` and `radical-stroke.txt` fetched by `curl` (no `wget`), `TESSDATA` at the folder holding `Cyrillic.traineddata`, and `RATIO_TRAIN=0.99`. I used the Makefile for the unicharset, the proto model, and the train and eval lists. I built the lstmf files with my own `xargs` loop (`mklstmf.sh`, same two commands as the Makefile's rules; the Makefile's `-j9` gave about 5 files a second, the loop about 65), and trained with my own driver, `train.py`, which runs the Makefile's exact `lstmtraining` flags in 1,000-iteration chunks so each checkpoint can be scored.
- **Fonts must be visible to fontconfig, and `--fonts_dir` is not enough on this Mac.** Pango on macOS defaults to CoreText, which ignores fontconfig. `text2image` found a face only with `PANGOCAIRO_BACKEND=fc` and `FONTCONFIG_FILE` pointing at a `fonts.conf` that includes Homebrew's own and adds the font folder. `fc-list` under that file, for each face:

```
~/Downloads/_desk-prereform/fonts/OldStandard-Regular.ttf: Old Standard TT:style=Regular
~/Downloads/_desk-prereform/fonts/PT_Serif-Web-Regular.ttf: PT Serif:style=Regular
~/Downloads/_desk-prereform/fonts/GentiumBookPlus-Regular.ttf: Gentium Book Plus:style=Regular
~/Downloads/_desk-prereform/fonts/Spectral-Regular.ttf: Spectral:style=Regular
~/Downloads/_desk-prereform/fonts/Tinos-Regular.ttf: Tinos:style=Regular
~/Downloads/_desk-prereform/fonts/PT_Serif-Caption-Web-Regular.ttf: PT Serif Caption:style=Regular
```

## 2. The typefaces

Character maps read with fontTools: **each of the six holds ѣ ѳ ѵ і ъ and the capitals Ѣ Ѳ Ѵ І.** Licences from the font files' own name tables (field 13 or 14); I did not read the upstream licence files for Tinos or Spectral beyond that.

| Face | Licence (name table) | Used for | Why it resembles engraved lyric type |
|---|---|---|---|
| Old Standard TT | SIL OFL | training | Modelled on Russian and European book type of the early 1900s: high-contrast, vertical stress, bracketed serifs, as in the S, K, and M underlay |
| PT Serif | SIL OFL (ParaType) | training | A sturdy transitional serif with a Cyrillic designed first; close to T's heavier setting |
| Gentium Book Plus | SIL OFL | training | Book-weight old-style serif, wide letters like the spaced underlay |
| Spectral | SIL OFL | training | Screen-drawn serif with moderate contrast: a second contrast level |
| Tinos | SIL OFL (name table) | training | Times-like, the commonest model for printed music text |
| PT Serif Caption | SIL OFL (ParaType) | held-out only | Wider and lower in contrast than PT Serif; never trained on |

- **Rejected after looking:** variable fonts (Noto Serif, EB Garamond, Cormorant, Lora, Playfair, Literata, Bitter). Under fontconfig their default instance rendered as a sans fallback in my first test sheet, so I removed them. Cardo has no Cyrillic.
- **"The type in S, T, K, and M":** by eye, S, K, and M are set in a high-contrast Didone-like face and T in a heavier one. Old Standard TT is the nearest of the six. I did not measure similarity.
- **Not matched:** my rendered paper is greyer than the real crops' near-white, and T's type is heavier than any of mine. Tesseract rescales and normalises each line, so I did not re-render.

## 3. The training lines

**Source:** Russian Wikisource, category «Дореформенная орфография» (41,022 pages). I read a seeded random sample of 3,520 pages through the MediaWiki API (seed 82). Each page was kept only where:

- the header names one author, and no translator;
- that author's Wikidata death year (P570) is before 1946 (DESK DEFAULT; an author with no death year on Wikidata is left out, not assumed);
- at least 70 percent of the page's words that end in a hard consonant end in ъ (so a page tagged old spelling but typed in modern spelling is dropped).

| Stage | Pages |
|---|---|
| fetched | 3,520 |
| dropped: author not resolvable | 1,344 |
| dropped: has a translator | 553 |
| dropped: author's death year not on Wikidata | 148 |
| dropped: author died 1946 or later | 43 |
| kept after authors | 1,432 |
| dropped: not in old spelling | 373 |
| **kept** | **1,059** |

- **Licence for the transcription:** Wikisource text is CC BY-SA 4.0 under the Wikimedia terms of use. **Per-page licence is NOT ESTABLISHED:** many pages record az.lib.ru as their source (`ИСТОЧНИК`), and I did not read that site's terms. Attribution: ru.wikisource.org, with page ids and revision ids in `~/Downloads/_desk-prereform/data/lines_pool.json` outside the tree. The lines are not shipped; only the trained model would be.
- **Lines:** verse as printed, prose cut into runs of 3 to 8 words; 10 to 78 characters; no Latin letters or digits; at most 80 lines per page. That gave 76,323 candidate lines after the exclusions below (68,422 from training authors, 7,901 from held-out authors).

**Exclusions** (S, T, K, M's `poem.txt`, and the private file's 35 titled songs; their poems were found on Wikisource by title and added to the same set):

| What removed | Count |
|---|---|
| pages sharing two or more five-word runs with an excluded poem (after `modernisePreReform`) | 7 pages |
| lines holding an excluded four-word run | 18 lines |
| pages titled with a listed title | 0 |
| lines from pages titled with a generic listed title («Ночь», «Музыка», and the like) | 0 lines |
| duplicate lines | 171 |
| added lines (ѳ, ѵ) removed by the same tests | 2 |

- **The counts per exclusion list are not separate:** S, T, K, and M and the private list went into one set, so I can report only the totals above. The first run, which used three-word runs, removed 764 pages for sharing common phrases; I judged that too coarse, and it is not what produced the counts above.
- **Five listed songs have no title** («NOT ESTABLISHED», all in set 1). Their poems could not be looked up, so **a line of any of those five poems could be in the corpus.** The exclusion was not possible for them.
- **Set 4's section is not empty** (twelve rows), as the brief required.

**The added lines (under 10 percent):**

- ѳ and ѵ were nearly absent from the sample (84 and 1 in the 68,422 lines). I searched Wikisource for 24 words that carry them and kept lines that hold ѳ or ѵ from pages passing the same tests: 20,744 lines after the exclusions.
- ѵ is too rare for real text to reach 2,000. **635 of the added lines are synthetic:** a real line with three real old-spelling ѵ words (мѵро, мѵроносица, мѵропомазаніе, Ѵпсиланти, ѵпсилонъ, Сѵрія, Кѵръ) inserted at random places. Their sense is nonsense; they teach the glyph.
- **Corpus:** 22,000 main lines (936 pages, 489 authors) and 2,006 added lines (163 real lines with ѵ, 1,208 real lines with ѳ, 635 synthetic), **8.4 percent added.** 23,591 of the 24,006 rendered (section 4).

**Letters in the 23,591 rendered training lines** (from the `.gt.txt` files):

| Letter | Count | Brief's 2,000 |
|---|---|---|
| ѣ | 13,052 (Ѣ 5) | met |
| і | 6,990 (І 64) | met |
| ѳ, both cases | 1,994 (ѳ 585, Ѳ 1,409) | **short by 6**; 2,051 before the 415 lines that did not render |
| ѵ, both cases | 1,801 (ѵ 1,556, Ѵ 245) | **short by 199**; 2,052 before the unrendered lines |
| word-final ъ | 35,185 | met |

The shortfall was not repaired. **Lowercase ѳ has only 585 examples**, and the held-out test below shows the consequence.

**Synthetic held-out text:** 722 rendered lines (712 chosen, 70 extras, 60 not rendered) from 55 authors whose names hash to 0 mod 10, never in training, in PT Serif Caption, roughened with seeds 777 and 778 (training used 82). Counts, case-folded: **ѣ 408, ѳ 165, ѵ 189, і 305, word-final ъ 1,110**, all over 100. Of its lines, 212 were added: real lines with ѳ or ѵ from held-out authors, and 30 synthetic ѵ lines built as above. No held-out line equals a training line.

## 3b. Real lines read by the teacher: dropped

**What happened:** IMSLP's public API answered every query (I read 1,376 work pages of 27 composers' categories and parsed their file entries). Its download page does not answer a script.

- A request for a file's own address returns `302 Found`.
- A request for its download page (`Special:ImagefromIndex/<id>`) returns a 724-byte page that needs JavaScript. It builds a form with a random field, posts it to `friendlyredirect2.html`, and only then goes on to the disclaimer.

Getting past that would mean imitating a browser to pass a check meant to stop scripts. The brief says to stop at a login, a wall, or a block, and not to run a crawler. **I stopped. No scan was downloaded, no disclaimer was accepted, and no IMSLP file is in any folder.**

- **The consequence, as the brief provides:** the first model trains on rendered lines only, and the real held-out slice does not exist. Checkpoints were chosen by the synthetic held-out set alone, as r2 briefed. Row 88's teacher was not run.
- **What the survey found, for the next row:** of the 300 Russian-marked, public-domain PDF entries I could parse, 114 carry a pre-1918 year (a rough count; many are opera scores), and enough solo-song volumes remain after removing the listed songs' opuses to reach 40 songs and six publishers (Jurgenson, Belaieff, Bessel, Gutheil, Zimmermann, Éditions Russes de Musique). **That is a survey of the API's text, not a check of any scan.** Whether a person can fetch them in a browser and hand them to a script is for Dann.

## 4. The images

- **Render:** `text2image` per line (24 pt at 300 dpi), random face from the five training faces. Half the lines are set as underlay: each word cut into syllables, joined by « - », with 2 to 9 spaces between syllables in the image and one in the ground truth. The rest are plain words with punctuation, spaced 1 to 4 spaces.
- **Roughen:** crop to the ink, scale to 0.5 to 0.7, dilate or erode a 2 by 2 pixel kernel, Gaussian blur (sigma 0.4 to 1.1), 0.15 to 0.4 line height of padding, tilt up to 0.5 degree, paper tone 190 to 252, low-frequency shading, pixel noise, JPEG at quality 40 to 85 on 40 percent, and on a third of the lines a barline stub at an edge or a slur fragment above or below.
- **Not rendered:** 415 of 24,006: 364 wrapped inside the page or blank, 21 wider than a page, 30 lost to a transient fontconfig error on Tinos.
- **The picture:** `docs/sessions/measure-prereform-model_2026-10-12/samples-beside-crops.png` (1500 by 1102, 346,672 bytes). Six rendered lines, each followed by a real crop from S, T, K, or M (the third rendered line is followed by a crop with no underlay text, a tempo mark). It is the only image kept in the tree.

## 5. The fine-tune

- **Start:** `Cyrillic.traineddata` from `tessdata_best`, `script/`, 36,730,735 bytes, md5 `3bc80391cf90b1e7b9c9296429e96821`, checked before training. It holds none of ѣ ѳ ѵ Ѣ Ѳ Ѵ and holds і І (the unicharset read with `combine_tessdata -u`).
- **Model:** `rus_prereform`, in its own folder. The training added six classes (code range 203 to 209) using `--old_traineddata`. Learning rate 0.0005 (my choice; tesstrain's default is 0.0001), 10,000 iterations in ten chunks, 23,354 training and 235 eval lstmf files, 23,591 rendered lines, **0 real lines**. 10,000 iterations took 1,061 seconds.
- **No wordlist was given**, so the model carries no dictionary data (the reason it is smaller than (c)).
- **Checkpoints on the synthetic held-out set** (`lstmeval`, 722 lines, `train-heldout.txt`):

| Iterations | 1,000 | 2,000 | 3,000 | 4,000 | 5,000 | 6,000 | 7,000 | 8,000 | 9,000 | 10,000 |
|---|---|---|---|---|---|---|---|---|---|---|
| BCER | 4.855 | 4.756 | 2.817 | 2.738 | 2.930 | 2.414 | 2.476 | 2.125 | 1.597 | **1.355** |
| BWER | 14.275 | 13.472 | 8.234 | 7.766 | 8.329 | 6.968 | 6.954 | 6.334 | 4.492 | 3.850 |

- **Chosen: 10,000**, the last. The error was still falling when the ceiling was reached. No song was read to choose it. (My driver's own `lstmeval` call used paths relative to the wrong folder and returned nothing; I scored all ten checkpoints afterwards with `evalckpt.sh`. The first attempt at training also failed on those relative paths and is kept as `train-failed-run0.log` outside the tree; nothing from it was used.)

### 5b. The integer form

`lstmtraining --stop_training --convert_to_int --continue_from data/rus_prereform/checkpoints/rus_prereform_checkpoint --traineddata data/rus_prereform/rus_prereform.traineddata --model_output <dir>/rus_prereform.traineddata`

| File | Bytes | Gzipped | md5 |
|---|---|---|---|
| float form | 7,827,478 | not measured | `b336aae350dd06a85a36dd08f602c57b` |
| **integer form** | **1,016,969** | 895,433 | `4241f3c011d736529ab441d36f798752` |
| row 81 (a), integer | 5,053,706 | 2,679,598 | |
| row 81 (c), float | 36,730,735 | | |

The 146 rows of S, T, K, and M, read with the scratch tesseract.js 7.0.0 (`ocr-rows.mjs`, `TCORE` honoured; I rebuilt the scratch copy from the pnpm store):

| Run | Loads | Notes |
|---|---|---|
| float, `tesseract-core-simd-lstm` | yes | |
| integer, `tesseract-core-simd-lstm` | yes | |
| **integer, default core (relaxed SIMD) under Node 24** | **yes** | |
| float, default core | **no** | `Aborted(missing function: _ZN9tesseract13DotProductSSEEPKfS1_i)` (read on song M only) |

- **Byte-identical text:** integer on the SIMD core against the default core, **146 of 146.** Float against integer, 30 of 146 (the integer form reads differently, section 6).
- **The finding the brief asked for:** the integer model loads on the default core. The stop condition did not fire.
- **The browser path:** NOT ESTABLISHED. I did not run tesseract.js's browser bundle in a headless browser.

## 6. Against row 81's baseline

I re-cut the rows with `raster.mjs` (the dev server at `localhost:5173`, stopped after) and `rows.py`: **`S.rows.jsonl`, `T.rows.jsonl`, `K.rows.jsonl`, and `M.rows.jsonl` match row 81's byte for byte.** (d) is the integer form on `tesseract-core-simd-lstm`, `gzip: false`, `cacheMethod: 'none'`, in its own folder. I ran row 81's `step4.py` (three variants), `step5.py`, and `step7.py` unchanged except for two named edits: `common.py:7` `MODELS = 'abc'` became `'abcd'`, and `step5.py`'s header line gained (d). Row 81's (a), (b), and (c) outputs are its own, copied; **with them, my runs reproduce row 81's printed numbers for (a), (b), and (c) exactly.** (My `step6.py` holds only `parse`, which `step7.py` reads; the rest of row 81's file names its truth files and was left out of this folder.)

### Syllables right (letter for letter and in sound, which agree everywhere), of 493

| Song | Printed | (a) | (b) | (c) | **(d)** | (d) float form |
|---|---|---|---|---|---|---|
| S | 109 | 82 | 83 | 76 | **74** | 81 |
| T | 200 | 113 | 119 | 135 | **146** | 147 |
| K | 131 | 83 | 84 | 83 | **96** | 96 |
| M | 53 | 17 | 23 | 21 | **20** | 44 |
| All | 493 | 295 | 309 | 315 | **336** | 368 |

Beside it, row 88's (t-imap), copied from its printed table, not re-run: 390 (S 99, T 148, K 95, M 48).

### The pre-reform letters (`step5.txt`; what each model read in place of each printed letter)

| Printed | Count | (a) | (b) | (c) | **(d)** | (d) float form | (t-imap) |
|---|---|---|---|---|---|---|---|
| ѣ | 21 | right 0 | right 0 | right 0 | **ѣ 18**; ѣв 1; в 1; nothing 1 | ѣ 18; ѣв 1; ѣи 1; в 1 | ѣ 21 |
| і | 6 | right 0 | right 0 | і 2, І 1 | **і 5, І 1** | і 5, І 1 | і 5, І 1 |
| ѳ, ѵ | 0 | none printed | | | | | |
| final ъ | 101 | 77 | 86 | 97 | **ъ 98**; ъте 1; е 1; nothing 1 | ъ 101 | 98 |

(One of the six і is a printed capital І in K, which counts here, as for (c).) **Every place where (d) read ѣ or word-final ъ wrong** (`places-d-wrong.txt`; (d) read і wrong nowhere):

- T p1s1r1 «лѣ-»: read «ѣв» (a letter added);
- T p2s2r1 «лѣсъ»: ѣ read as «в»;
- M p2s1r1 «бѣ»: ѣ not read;
- S p4s1r2 «духъ»: ъ read as «ъте»;
- M p1s2r1 «тикъ»: ъ read as «е»;
- M p2s3r1 «чекъ»: ъ not read.

### The language of each row (`step4-syll.txt`: Russian rows, called Russian, other rows, other called Russian, Russian missed)

| Song | (a) | (b) | (c) | **(d)** |
|---|---|---|---|---|
| S | 18, 16, 55, 2, 2 | 18, 18, 55, 4, 0 | 18, 18, 55, 2, 0 | **18, 14, 55, 4, 4** |
| T | 19, 16, 21, 0, 3 | 19, 18, 21, 0, 1 | 19, 19, 21, 0, 0 | **19, 19, 21, 0, 0** |
| K | 12, 12, 7, 0, 0 | 12, 11, 7, 0, 1 | 12, 11, 7, 0, 1 | **12, 11, 7, 1, 1** |
| M | 6, 3, 8, 0, 3 | 6, 5, 8, 1, 1 | 6, 6, 8, 0, 0 | **6, 3, 8, 0, 3** |

Under the brief's rule and the joint rule (`step4-brief.txt`, `step4-joint.txt`) the rows are called Russian as seldom as row 81 found.

### The whole test (`step7-syll.txt`: Russian notes kept and dropped, extras kept and dropped; K and M show the control's notes wrongly removed)

| Song | (a) | (b) | (c) | **(d)** |
|---|---|---|---|---|
| S | 96 / 20, 11 / 1 | 107 / 9, 10 / 2 | 103 / 13, 9 / 3 | **101 / 15, 9 / 3** |
| T | 151 / 46, 7 / 7 | 165 / 32, 7 / 7 | 175 / 22, 5 / 9 | **187 / 10, 7 / 7** |
| K (wrongly removed) | 1 | 10 | 14 | **1** |
| M (wrongly removed) | 11 | 7 | 3 | **1** |

(d) is the best on T, K, and M and the third on S. The brief's own rule (`step7-brief.txt`) is still too severe for every model (T (d) keeps 25 of 197).

### On the synthetic held-out set (722 lines, `evalout/`)

| | CER | ѣ | ѳ | ѵ | і | final ъ |
|---|---|---|---|---|---|---|
| (c), lines mapped to modern letters (ѣ to е, ѳ to ф, ѵ to и, і to и) | **12.27 %** | | | | | 944 / 1,110 |
| (c), original lines | 11.44 % | 0 / 408 | 0 / 165 | 0 / 189 | 292 / 305 | 944 / 1,110 |
| **(d) float form**, original lines | **1.67 %** | 407 / 408 | 58 / 165 (159 ignoring case) | 138 / 189 (159) | 302 / 305 | 1,108 / 1,110 |
| **(d) integer form**, original lines | **15.06 %** | 359 / 408 | 54 / 165 (144) | 121 / 189 (137) | 266 / 305 | 988 / 1,110 |
| (d) float form, lines mapped | 4.25 % | | | | | |

Read through tesseract.js on the same images the numbers hold: 1.63 percent (float) and 15.10 percent (integer).

- **ѳ and ѵ:** 97 of the ѳ misses are the capital Ѳ read for a lowercase ѳ, and 20 are Ѵ read for ѵ (the case is what differs). Both cases sound and normalise the same in Ilya (`ABOLISHED_LETTERS` holds both). That follows from my having only 585 lowercase ѳ in training (section 3).
- **The brief's shipping rule:** (d)'s CER must not be worse than (c)'s on the mapped lines. **Float passes (1.67 against 12.27 percent). Integer fails (15.06 against 12.27 percent).**
- **Why (c) reads these lines at 12 percent** (its word-final ъ is 944 of 1,110, the same as on the real songs' 97 of 101) I did not look into. The held-out lines are set in wide, hyphenated syllables for half their number, which the real underlay shares.

## Time spent (the desk's ceilings were 8 hours and 3 hours; all measured here)

About 3 hours of wall-clock in all, none of it near a ceiling.

| Step | Time |
|---|---|
| Wikisource crawl, 3,520 pages | about 20 minutes (polite, one batch a second) |
| authors and lines, with the dictionary's normaliser | about 10 minutes |
| supplement search, 24 terms and 2,570 hits | about 8 minutes |
| IMSLP survey (API only) | about 10 minutes |
| render 24,006 lines, 8 processes | about 6 minutes |
| lstmf files, 23,591 | 6 minutes |
| train 10,000 iterations | 1,061 seconds, plus about 5 minutes scoring ten checkpoints |
| step 5b and step 6 | about 10 minutes |

## Recommendation (Code's)

**Do not ship this model into Ilya. Train again with one named change.**

- **Why not now:** the form that runs on Ilya's likely core is the integer form, and it is worse than the float form by a wide margin on held-out type (15.06 against 1.67 percent) and fails the brief's rule against (c). On the four real songs it is still better than any Tesseract model, so the result is worth building on. The 1 MB size, against 5 MB for (a), is a point for it.
- **The named change for the next model:** train past 10,000 iterations (the held-out error was still falling at the end of the ceiling; I propose 30,000, about an hour on this Mac at the measured rate), then convert to integers and compare the two forms again before anything else. If the gap does not close, the next change is rendering with white paper and heavy ink like the real crops, and more lowercase ѳ and ѵ. **I did not test which of these closes the gap; the brief allowed one more model only if the first missed a floor, and it did not.**
- **If the gap closes,** the model goes to Dann with its byte count (`CONTRACT.md` section 6), and the teacher's real rows (step 3b) are the next lever, once a person has fetched scans in a browser.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Step 3b, in full.** No IMSLP scan was fetched (section 3b). The 40-row check, the teacher's lines, and the real held-out slice do not exist.
- **Whether a person could fetch the scans** and whether IMSLP's terms allow a script to use them afterwards.
- **The browser path** of the integer model (section 5b).
- **Why the integer form loses 14 points of character error on held-out type** and 32 syllables on the real songs, and whether it is the quantisation, the missing dictionary data, the heavy ѳ and ѵ class imbalance, or the type. Not separated.
- **Why (c) reads the synthetic held-out set at 12 percent.**
- **The licence of each Wikisource page's text,** and whether az.lib.ru's terms allow it.
- **Which of the five listed songs with no established title** are in the corpus (their poems could not be looked up).
- **How the model does on other scans:** only S, T, K, and M were read. One checkpoint was chosen by a synthetic set that shares its pipeline with training.
- **ѳ and ѵ on real print:** no real line holds either in S, T, K, or M. The tests are synthetic only.
- **Whether Tinos's and Spectral's licence is the OFL as upstream states it;** I read the name table only.
- **The exact split of the exclusion counts by list** (section 3).

## The files

In `docs/sessions/measure-prereform-model_2026-10-12/`:

- **Step 3:** `ws-crawl.py`, `authors.py`, `build-text.py`, `lines.py`, `supplement.py`, `assemble.py`; counts in `build_stats.json`, `lines_report.json`, `assemble_report.json`. The exclusion titles are read from the desk's private file at run time and are not copied here.
- **Step 4:** `render.py`, `picture.py`, `samples-beside-crops.png`.
- **Step 5:** `mk.sh`, `mklstmf.sh`, `train.py`, `evalckpt.sh`, `train-heldout.txt`.
- **Steps 5b and 6:** row 81's scripts as copied (`raster.mjs`, `rows.py`, `ocr-rows.mjs`, `common.py`, `norm.ts`, `step4.py`, `step5.py`, `step7.py`) with the edits named above; `step6.py` (parse only); `ocr-images.mjs`, `eval_heldout.py`, `places.py`; `<L>.rows.jsonl`; `ocr/<L>-{a,b,c,d,d-float}.json`; outputs `step4-{brief,joint,syll}.txt`, `step5.txt`, `step5-with-float-form.txt`, `step5-letters.json`, `step7-{brief,joint,syll}.txt`, `places-d-wrong.txt`, `evalout/`.

Kept outside the tree, and not gone at the session's end (unlike row 81's scratchpad): `~/Downloads/_desk-prereform/` (models in `songs/models/float` and `songs/models/int`, all ten checkpoints in `models/rus_prereform/`, the rendered lines in `tesstrain/data/rus_prereform-ground-truth/`, the held-out images in `heldout_images/`, the Wikisource pages in `data/`).
