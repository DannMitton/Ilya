# Report: row 105, the next underlay model, trained on the Mac (r1)

Code (Sonnet 5.5), 2026-10-27, brief `brief-code-row105-next-model_r2_2026-10-27.md`. Branch `Shane`, HEAD `6bd34b14`; the tree is dirty only in `docs/`. Measure folder: `docs/sessions/measure-row105-next-model_2026-10-27/` (scripts in `build/`, readings and logs in `ctl/`). Everything large is outside the tree in `~/Downloads/_desk-row105/` and `~/Downloads/_desk-prereform/` (`models/rus_prereform_r3/`, `tesstrain/data/rus_prereform_r3/`).

## Answer first

**The new model does not read better than r2. Nothing should ship from this row, and no integer form was made.**

| Form (float, framed with `clean.py`) | Read right of 2,538 | Photocopies (B01 to B10 less B05), of 1,249 | Other nine, of 1,289 | C2 (b) / (a) / (c), of 2,385 | Bytes |
|---|---|---|---|---|---|
| r2 29,000 (control) | **2,086** | 1,025 | 1,061 | **1,831** / 2,032 / 1,168 | 7,827,478 |
| r2 28,000 | 2,045 | 975 | 1,070 | 1,763 / 2,000 / 1,016 | 7,827,478 |
| r2 30,000 | 2,049 | 1,005 | 1,044 | 1,772 / 1,989 / 1,049 | 7,827,478 |
| **r3 30,000, no word list (the only eligible checkpoint)** | **2,029** | 976 | 1,053 | **1,793** / 2,021 / 982 | 7,830,646 |
| r3 30,000 with word list | 1,927 | 904 | 1,023 | 1,755 / 1,991 / 938 | 15,657,098 |
| r3 31,000 (ineligible, plain BCER 0.634) | 2,000 | 981 | 1,019 | 1,775 / 2,017 / 871 | 7,830,646 |
| r3 32,000 (ineligible) | 1,977 | 960 | 1,017 | 1,738 / 2,008 / 837 | 7,830,646 |
| r3 33,000 (ineligible) | 1,912 | 920 | 992 | 1,674 / 1,989 / 876 | 7,830,646 |

- Read right is 57 below r2 29,000 (r3 30,000, no list). r2's own checkpoint spread from 2,086 is 37 to 41 (28,000 and 30,000), so r3's 2,029 is inside r2's noise. **No gain; the goal of 2,147 is not reached.**
- C2 (b) is 38 below 1,831, also not a gain. The expectation written in the brief (a gain on the photocopies) failed: the photocopies fell from 1,025 to 976 and the other nine from 1,061 to 1,053.
- The word list lowers read right by 102 (2,029 to 1,927): letter recognition improves (198 to 172) and token splitting worsens (291 to 419), as the brief warned.
- Baseline note: C2 (c) of the control is 1,168, accepted by Dann (the desk's figure was 1,166).

## Why it stopped, and what it shows

Training ran four chunks (30,000 to 33,000) and then stopped on the brief's own rule: plain-type BCER was above 0.42 on three chunks in a row (0.634, 0.996, 1.172; row 82's 722 lines, unframed). 30,000, at 0.296, is the only checkpoint the rule lets me choose, so the choice was made by the rule, not by a song.

| Iterations | plain BCER (722 lines) | held-out underlay BCER (1,000 framed rows) | read right (songs) |
|---|---|---|---|
| r2 29,000, for reference | 0.186 | 31.71 | 2,086 |
| 30,000 | 0.296 | 16.27 | 2,029 |
| 31,000 | 0.634 | 15.04 | 2,000 |
| 32,000 | 0.996 | 14.28 | 1,977 |
| 33,000 | 1.172 | 13.47 | 1,912 |

The held-out synthetic error roughly halves against r2 (31.7 to 16.3 in one chunk, 13.5 by 33,000), while the real songs get worse. So the synthetic damage teaches the model something the songs do not reward. I did not test why. Candidates, none tested: my kind 2 damage is not the photocopies' damage; the held-out set shares my renderer, so it measures the renderer; the plain test lines are unframed while training now frames kind 3 (the plain BCER rise may partly be that mismatch). **Whether the guard is too tight is not decided here:** the songs get worse along with the guard, so it did not hide a better model in this run.

Training time: 859 s for four chunks (about 215 s per 1,000 iterations); the 8-hour ceiling was far from reached.

## Step 0b and what held

Control reproduced: 2,086; C2 1,831 / 2,032 / 1,168. See the earlier stop in this file's history: the (c) figure was 2 above the brief and Dann accepted 1,168. All measured forms below were read by the same scripts. Each form is served as `rus_prereform.traineddata` from `~/Downloads/_desk-row105/serve/<tag>/` with its md5 in `ctl/m-<tag>.json`.

## The training data (every count)

All text is built by `build/textgen.py` (report: `build/textgen-report.json`).

- **Kind 3 (row 82's lines, framed):** 23,591 rendered lines; **2 dropped**, both by three-word runs shared with row 114's song 4 (`r114:song4`); none from the build songs, S, T, K, or M. Kept 23,589. So of r2's own lines, 2 would have been dropped: r2's 2,086 rests on song text only to that extent (two lines, both from one row 114 song).
- **Kinds 1 and 2:** 23,591 lines each of new text, none dropped by the three-word filter (the filter ran; zero hits). Lines dropped before that for length (over 28 syllables) are counted in the report, as are words whose cut failed. **Kind 2 uses its own text, not kind 1's** (the brief says "built from new text"; I read "the same lines" as the same kind of line).
- **Mix:** one third each (70,771 lines: 23,591 + 23,591 + 23,589), the list shuffled with seed 105.
- **Words.** Modern words: half from the Wikisource corpus's unmarked tokens (natural frequency), half uniform over the dictionary's forms not in the corpus (2 to 14 letters, no final ъ: a dictionary form with a final ъ is pre-reform and is excluded, since pre-reform words must come from real text only). Pre-reform words: real corpus tokens only. **Pre-reform share:** 40.95 percent of the corpus's tokens carry ѣ, і, ѳ, ѵ or a final ъ; the built lines carry 42.2 percent (kind 1), 42.4 percent (kind 2), 42.0 percent (held-out).
- **Cutting.** `GraysonEngine.syllabify` on the modernised form, mapped back letter for letter, a dropped final ъ joined to the last syllable; a word whose modernised form changes any letter other than ѣ і ѳ ѵ is rejected. 30 words checked: `build/cut-check-30.txt` (all cut; all 30 map back to the printed spelling).
- **Underlay setting:** syllables of one word joined by « - », words spaced as under notes, 2 to 12 words, at most 28 syllables, capital on about one line in four, a leading « -» on 20 percent and a trailing « -» on 25 percent (row 82's), spacing 2 to 9 spaces (85 percent) or 10 to 22 (15 percent; **my choice, wider than row 82's, to match the crops' gaps**). **Punctuation** after a word in the proportions of the 18 build songs' truth (962 words: none 79.7 percent, comma 10.8, full stop 6.3, then ; ! ? : …; `build/punct-stats.json`). The leading « —» seen once is not modelled.
- **Fonts, lines per font** (`build/damage-summary.json`): kind 1: Tinos 2,390, Spectral 2,362, Palatino 2,367, Gentium Book Plus 2,385, PT Serif 2,378, Times New Roman 2,382, Georgia 2,329, Baskerville 2,332, Old Standard TT 2,329, Didot Bold 2,337. Kind 2: Old Standard TT 2,431, Times New Roman 2,444, Palatino 2,296, Georgia 2,330, Tinos 2,288, Spectral 2,324, Baskerville 2,346, Didot Bold 2,409, Gentium Book Plus 2,396, PT Serif 2,327. Kind 3: row 82's five faces. **Which engraving lyric faces on the Mac hold Cyrillic (and ѣ ѳ ѵ і):** Times New Roman, Georgia, Palatino, Baskerville (all regular weights), and Didot in its bold only (Didot regular has none: all its Cyrillic glyphs are absent). Whether any of them is the face a Finale file prints lyrics in is not established.
- **Rendering:** Pillow, 100 px em (24 pt at 300 dpi), not `text2image` (which cannot read the `.ttc` files); row 82's own faces were rendered the same way for kinds 1 and 2.
- **Kind 1 damage:** row 82's `rough()`, copied unchanged (tilt up to 0.5 degree, blur, JPEG, grey paper, barline stubs), then framed.
- **Kind 2 damage** (23,591 rows, all kept; `build/damage-summary.json`, min / median / max): ink height H drawn from the nine photocopies' single rows, 23 / 43 / 60 px; stroke width sw 2.1 / 4.4 / 8.6 px. Rotation uniform, −3.0 / −0.02 / +3.0 degrees (the real crops' angles are far narrower: median 0.1, 90th percentile 0.7, 7 percent above 1.0; I followed the brief). Toner fade along the row up to 0.4 of the ink's strength (70 percent of rows). Random erosion on 5 to 30 percent of the row's area, kernel 0.24 to 0.94 of sw; random dilation on 3 to 25 percent, kernel 0.23 to 0.94 of sw. Heavier toner (a 2 by 2 dilation, 0.19 sw at the median) on 60 percent of rows. Pepper in the ink up to 1.2 percent of ink pixels; salt on the paper up to 0.04 percent of pixels. The row is cut through its own ascenders and descenders (90.2 percent of rows; the cut falls between 0 and 0.9 of the way from the tip to the x-height band; the bands run 0 / 0.46 / 0.71 H above and 0 / 0.43 / 0.69 H below); staff-line ink at an edge in 25 percent, stem stubs in 25 percent, a barline stub in 30 percent. Two-level (0 and 255) output. **The cut is made in the text's own frame, before the rotation:** cutting after a 3-degree rotation of a row 4,000 pixels wide removed most of the text while the label kept it.
- **Framing:** `build/clean105.py`, a copy of the desk's `clean.py` whose only edit is that `CROPS`, `ROOT`, and the angles cache come from the environment. Steps `deskew,close:3,height:32,padpaper:16:16`, on every training line of all three kinds and on the held-out rows. `underlay-frame.ts` was not used. Whether a model trained on `clean.py`'s frame reads `frameRow`'s as well is NOT ESTABLISHED (step 4's row).
- **Held-out:** 722 plain lines (row 82's) and **1,000 rendered underlay rows** (500 kind-1 style, 500 kind-2 style) built from words that are in no training line: modern dictionary forms that hash to a reserved twentieth (40,737 of 813,313 forms not in the corpus) and pre-reform words from the held-out authors' lines that are not in any training author's lines (2,274). Overlap of held-out and training words: 0. Kind 3's lines contain none of them (they are not in the corpus's training authors' tokens by construction).
- **Characters:** one character of the new text is absent from r2's unicharset: the ellipsis U+2026 (from 0.2 percent of the build songs' word ends). So a new proto was built: r2's `lstm-unicharset` merged with the new text's (`merge_unicharsets`), 210 classes against r2's 209 (`combine_lang_model`, no word list), and the first chunk added `--old_traineddata <copy of r2 29,000>`. The line of `lstmtraining --help` (5.5.3): "`--old_traineddata`  When changing the character set, this specifies the old character set that is to be replaced".
- **Line-making times** (200-line trial, then the full run; `stage-times.txt`): render 1 min 50 s (kind 1), 4 min 18 s (kind 2), 15 s (held-out); framing 10 min 37 s (kind 1), 26 min 52 s (kind 2), 4 min 41 s (kind 3), 1 min 22 s (held-out); lstmf for 70,771 files 21 min. The 200-line trial projected about 10 to 25 minutes per kind, under the 3-hour stop. Total making: about 85 minutes; training 15 minutes; measure about 15 minutes.
- **A slip I fixed:** my first copy of the framed gt files used a glob that overflowed; no lstmf was made from them before I caught it (the second run used `find`). The held-out rows' text was drawn before framing and was not altered.

## The word list

Built from the chosen model's own extracted `lstm-unicharset` (`combine_tessdata -u`): a word dawg (`wordlist2dawg`, 940,721 words: 897,481 dictionary forms plus 72,866 corpus word types incl. pre-reform spellings, less the overlap) and a punctuation dawg (`combine_lang_model --puncs`, nine patterns: , . ; ! ? : … ... !..), both merged into a copy of the model with `combine_tessdata -o`. Documentation read: Tesseract's *TrainingTesseract-5* page, "Understanding the Various Files Used During Training" ("if any of the dawgs are provided, the punctuation dawg must also be provided"); the page does not give the file formats or the `combine_tessdata -o` steps, so those follow the `--help` lines of `combine_lang_model` ("--puncs File listing punctuation patterns") and `wordlist2dawg`, and the punctuation dawg's patterns were read back with `dawg2wordlist` to confirm what was stored.

| Form | Bytes | Gzipped bytes | md5 | Words |
|---|---|---|---|---|
| r3 30,000, no dawgs | 7,830,646 | 4,189,695 | `9449505f52c43de6322cc035e5071c2e` | none |
| r3 30,000, with dawgs | 15,657,098 | 5,720,321 | `2ea55a884340595e39d5979fb2f8b13e` | 940,721 |

**The size reaches Dann before any model ships (`CONTRACT.md` §8, last bullet):** the word list doubles the float file (7.8 to 15.7 MB; 4.2 to 5.7 MB gzipped), and it loses 102 syllables. Nothing here is a candidate to ship: no form beats r2's 2,086, and no integer form was converted or measured (the float form did not gain).

## Checks

- The model loads in headless Chromium (145.0.7632.6) through the real `createWorker` with `corePath` naming `tesseract-core-simd-lstm.wasm.js` (that is how every reading was made). Its text on three framed rows (B03 row 1, S row 6, U5 row 11) equals Node's (tesseract.js 7.0.0, simd-lstm core forced in a scratch copy, as `ilya-float-tessdata-needs-simd-core`): **3 of 3 equal** (`build/node-equal.mjs`).
- **r2 untouched:** the md5 of every file in `models/rus_prereform_r2/` and `songs/models-r2/` (23 files) recorded before the first chunk (`r2-md5-before.txt`) is identical now.
- **No held-out song opened**; row 114's truth JSON read by script only for the n-gram comparison (derived grams kept outside the tree in `~/Downloads/_desk-row105/private/`); no PDF, photograph, or reader run on row 114.
- `git --no-optional-locks status --short -- apps packages third_party static` is empty.

## Environment edits

Paths rebased; `tsx` replaced by `bin/tsx` over the repo's `vite-node`; a Python venv at `~/Downloads/_desk-row105/venv` (numpy 2.5.4, Pillow 13.0.0, opencv-python-headless 5.0.0, scikit-image 0.26.0, scipy) because Homebrew's Pillow does not import; the Chromium launch path removed (Playwright's own, 145). `map_boxes105.py` is `map_boxes.py` with `SRC` and the geometry output as arguments. `measure105.py` runs the whole measure for one model file.

## What I could not establish

- **Why the synthetic gain does not carry to the songs.** The synthetic held-out error halves while read right falls. Untested causes: damage unlike the photocopies' (rotation uniform to 3.0 degrees against the real crops' median 0.1), heavier toner and erosion than the real strokes show, the rendered faces, the framed-versus-unframed plain test, or a learning rate (0.0005) too high for a model already near its best. A re-run with a narrower rotation and a lower rate, scored only on the songs' neighbours, would test two of these; I have not run it.
- Whether the plain guard (0.42) should be looser. This run does not show it hid a better model.
- Whether a model trained on `clean.py`'s frame reads `frameRow`'s as well (step 4's row).
- Whether any Mac face is the one a Finale file prints lyrics in.
- Which of the framed kind 1 rows resemble the 9 clean songs (not looked at beyond a contact sheet of the first 7).
- The run was one seed; I did not repeat training, so r3's own run-to-run noise is unmeasured (r2's checkpoint spread of 37 to 41 syllables is the only noise figure).
