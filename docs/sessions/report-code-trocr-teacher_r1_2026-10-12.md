# Report: can an open old-spelling model read our underlay? (QUEUE row 88, r1)

Code (Opus 5.5) on Dann's Mac, 2026-10-12, brief `brief-code-trocr-teacher_r2_2026-10-12.md`, read whole.

- **Measures only.** Nothing was kept in `apps/`, `packages/`, `third_party/`, or `static/`. The model, the virtual environment, the rasters, and the crops are under `~/Downloads/_desk-trocr/`, outside the tree.
- **No git command that writes.** No crop or text was sent anywhere; the model ran on this Mac, offline after the download.
- **Songs:** only S, T, K, and M; no set 3 sealed song or set 4 song was opened.
- **What this row wrote:** the measurement folder, this report, and row 88's State.

## The answer first

**Code's recommendation: use `taiga75/ru-trocr-1700s` as a teacher, read in ink-gap chunks, with one fixed post-map: a Latin i inside a Cyrillic word becomes і.**

Against the brief's bar, on the chunked form exactly as the model writes it:

| Count | Bar | Chunked form (t) | Met |
|---|---|---|---|
| ѣ read right | at least 17 of 21 | **21 of 21** | yes |
| і read right | at least 5 of 6 | **1 of 6** | **no, by 4** |
| word-final ъ read right | at least 90 of 101 | **98 of 101** (ъ 96, Ъ 2) | yes |
| syllables read right | at least 315 of 493 | **385 of 493** | yes, by 70 |

- **The one miss is a spelling convention, not a misreading.** In 5 of the 6 places the model wrote **Latin i (U+0069)** where the print has decimal і (U+0456). The sixth, a capital, it wrote as Cyrillic І.
- **The model can write і.** Its tokenizer encodes і as two byte-level tokens, so the Latin i is a habit, most likely its training labels', not a limit of its vocabulary.
- **With the map** (column t-imap, a one-line substitution of mine, not the model's output), і is 6 of 6 and the syllables are 390 of 493. The map changes nothing else.
- **Where the misses fall:** not on the pre-reform letters. Of the syllables holding none, 69 are misread. 50 of those share a token with a neighbouring syllable (left out, or run together with it), and 19 are read one to one with wrong letters.
- **How it compares with row 81.** The best Tesseract model, (c), read ѣ 0 of 21 and 315 syllables.

## 1. Install, versions, and the device

- **The machine:** macOS 26.6.2 (25G83), Apple M4.
- **The environment:** Python 3.14.3 (Homebrew), in a virtual environment at `~/Downloads/_desk-trocr/venv`. torch 2.14.1, transformers 5.19.0, Pillow 12.3.0.
- **The model:** `taiga75/ru-trocr-1700s`, **revision `d5563063e42e4f10104e967eca6644ae17714878`**.
  - Downloaded with `HF_HOME=~/Downloads/_desk-trocr/hf`; `HF_HUB_OFFLINE=1` was set for every read.
  - On disk: 1,339,228,897 bytes in 12 files, of which `model.safetensors` is 1,335,747,032. Loaded in float32.
- **The device:** `torch.backends.mps.is_available()` is True. Two rows (S p1s1r2, T p1s1r1) were read whole on CPU and on MPS, and the texts are identical, so MPS was used for the rest.
- **Warnings, harmless here.** transformers warned that `max_new_tokens` (256) overrides the model's `max_length` (64), and that `clean_up_tokenization_spaces` is ignored for a BPE tokenizer.

## 2. Licence

- **What says MIT.** The model card's metadata (`license: mit`, from the Hub API) and its README (`license: mit` in the front matter). No separate LICENSE file is in the repository.
- **What MIT permits:** use, copying, modification, merging, publishing, distribution, sublicensing, and sale, with the copyright and permission notice kept, and no warranty.
- **The author's request:** the card asks that research use cite Maria Levchenko, 2025, `ru-trocr-1700s`, doi 10.57967/hf/3942. Training lines Ilya keeps should carry that.

## 3. The rows, re-cut

- **The rasters and rows.** `raster.mjs` (Ilya's `rasterizePdf`, with the dev server started for it and then stopped by process number) and `rows.py` remade all four songs' rows.
- **Identical to row 81:** `S.rows.jsonl`, `T.rows.jsonl`, `K.rows.jsonl`, and `M.rows.jsonl` match row 81's byte for byte. There are 146 crops, of which the 55 Russian rows that `poem.txt` lists were read.
- **The PDFs** are those `measure-set3-four-below_2026-10-11/run.py:12-14` resolves, as row 81 used them.

## 4. The three readings

- **(t-row), each row whole.** The processor squashes the row to 384 by 384, so this is a control.
  - The longest output was 210 tokens, against `max_new_tokens` 256. No output ended without the end token.
  - It reads 39 of 493 syllables: whole rows are unusable.
- **(t), ink-gap chunks: the main form.**
  - **The cut.** Ink is projected onto x, with a cut at every gap wider than 0.3 of the row's core height. Pieces are grouped while a chunk stays within 8 times the crop's height, and each chunk is padded by 0.3 of the row's height.
  - **Chunks per row:** 2 to 8, 302 in all. Each row's count is in `read-log.txt`.
  - **Cuts checked by eye.** I drew the cuts on four rows (S p1s2r2, T p2s3r1, K p2s2r1, M p1s1r1), 25 chunks, more than the ten asked. Every cut falls at a syllable boundary, at a hyphen or a space; **none falls inside a syllable**.
  - **One side effect.** At a row's start, the first chunk takes in the system's bracket line, which the model reads as a stray mark (M's first chunk "О").
- **(t3), row 81's (c) word boxes,** each padded by 0.3 of the row's height. 725 boxes. This form inherits (c)'s missed boxes.

**The output shape.** Each form is written in row 81's step 2 shape (`ocr/<L>-<form>.json`):
- the model's string is split on whitespace;
- a token holding a hyphen is split into the part before, the hyphen, and the part after;
- each word's box is its chunk's (or the row's, or the (c) box's), with confidence null.

## 5. Scored with row 81's own code

- **Copied unchanged:** row 81's `step5.py`, `common.py`, `norm.ts`, `norm-cache.json`, and `poem.txt`, with its (a), (b), and (c) outputs.
- **Two named edits, quoted:**
  - `common.py:7`, `MODELS = 'abc'` became `MODELS = ('a', 'b', 'c', 't-row', 't', 't3', 't-imap')`;
  - `step5.py:94-96`, the literal table header now names every model, with each TrOCR form's segmenter.
- **The row-to-`poem.txt` mapping** is unchanged. It lives at `step5.py:70-73`: `R = {rid(r): r for r in ocr(L, m)}`, keyed by `rid` (`common.py:13`, page, system, and row), against `P[L]` from `common.poem()` (`common.py:15`).
- **The t-imap column** is my post-map (`imap.py`), not the model's output.

```
Syllables read right, per song and model (letter for letter / in sound after step 3's normalising), of the printed syllables
song | printed | (a) letter | (a) sound | (b) letter | (b) sound | (c) letter | (c) sound | (t-row: TrOCR, whole row) letter | (t-row) sound | (t: TrOCR, ink-gap chunks) letter | (t) sound | (t3: TrOCR, (c) word boxes) letter | (t3) sound | (t-imap: TrOCR chunks, Latin i mapped to і by Code) letter | (t-imap) sound
S | 109 | 82 | 82 | 83 | 83 | 76 | 76 | 20 | 20 | 99 | 99 | 82 | 82 | 99 | 99
T | 200 | 113 | 113 | 119 | 119 | 135 | 135 | 14 | 14 | 146 | 147 | 134 | 135 | 148 | 149
K | 131 | 83 | 83 | 84 | 84 | 83 | 83 | 4 | 4 | 94 | 94 | 84 | 84 | 95 | 95
M | 53 | 17 | 17 | 23 | 23 | 21 | 21 | 1 | 1 | 46 | 46 | 39 | 39 | 48 | 48
all | 493 | 295 | 295 | 309 | 309 | 315 | 315 | 39 | 39 | 385 | 386 | 339 | 340 | 390 | 391

Pre-reform letters: what each model read in place of each printed one (∅ = nothing; (missed) = the syllable had no token)
ѣ: printed 21
   (a) Ъ 7, ∅ 4, Б 3, в 2, ъ 1, и 1, е 1, Ф 1, Н 1
   (b) Ъ 6, ∅ 6, Б 3, в 2, ъ 1, и 1, е 1, Ф 1
   (c) ъ 6, ∅ 3, Ъ 3, ћ 2, Б 1, Ђ 1, Л 1, к 1, ї 1, б 1, К 1
   (t-row) ѣ 5, а 4, ∅ 4, и 2, з 2, е 1, О 1, в 1, ш 1
   (t) ѣ 21
   (t3) ѣ 20, ∅ 1
   (t-imap) ѣ 21
і: printed 6
   (a) и 1, ∅ 1, Ш 1, Т 1, К 1, И 1
   (b) ∅ 2, и 1, Ш 1, Т 1, И 1
   (c) і 2, и 1, І 1, Ї 1, ю 1
   (t-row) е 2, и 1, ∅ 1, І 1, ш 1
   (t) i 5, І 1
   (t3) i 5, Г 1
   (t-imap) і 5, І 1
ѳ: printed 0
ѵ: printed 0
ъ#: printed 101
   (a) ъ 60, Ъ 17, ъЪ 17, М 2, ∅ 1, ълЪ 1, ъЪъ 1, Ь 1, О 1
   (b) ъ 56, Ъ 30, ъЪ 11, М 1, ь 1, ∅ 1, ълЪ 1
   (c) ъ 87, Ъ 10, ъЪ 2, ∅ 1, К 1
   (t-row) ъ 38, ∅ 18, ь 6, е 5, ы 3, з 3, и 3, О 3, в 2, ѣ 2, а 2, н 2, о 2, ш 2, я 2, ю 1, б 1, й 1, л 1, ъотъ 1, ъдейры 1, ъи 1, И 1
   (t) ъ 96, ь 2, Ъ 2, Т 1
   (t3) ъ 88, Ъ 4, ь 3, Т 3, ѣ 1, ъчто 1, ъц 1
   (t-imap) ъ 96, ь 2, Ъ 2, Т 1
```

**Misread syllables of (t) holding no pre-reform letter** (`misread.py`, using step 5's own alignment):

```
misread syllables with no pre-reform letter: 69 {'shares a token with a neighbour': 50, 'one-to-one, wrong letters': 19}
  S p2s1r2: printed «е», read «жи»
  S p2s1r2: printed «жи-», read «жи»
  S p2s3r2: printed «зо-», read «Ву»
  S p2s3r2: printed «ву», read «Ву»
  S p3s3r2: printed «се-», read «ее»
  S p4s1r2: printed «та-», read «лый»
  S p4s1r2: printed «лый», read «лый»
  S p5s3r2: printed «у-», read «у»
  S p5s3r2: printed «та-», read «у»
  T p1s2r1: printed «шеб-», read «теб»
```

- **Several of these are syllables left out,** not misread. Two printed syllables then align to one token, as «е» and «жи» to "жи", or «зо» and «ву» to "Ву".
- **The 19 one-to-one misreadings** include "04" for «оч», "нимъ" for «кимъ», and "ктъ" for «итъ» (seen in the chunk texts).

## 6. Speed, on MPS

| Unit | Mean (s) | Median (s) | Count |
|---|---|---|---|
| Whole row | 1.31 | 1.19 | 54 (the warm-up row excluded) |
| Chunk | 0.40 | 0.40 | 302 |
| (c) box | 0.27 | 0.26 | 725 |

A typical row of 5 to 7 chunks takes about 2 to 3 seconds chunked.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **ѳ and ѵ.** Neither is printed in these four songs, so the model's reading of them is unmeasured here. The card names both.
- **Why it writes Latin i.** The tokenizer can encode і. That its training labels used Latin i is my inference from the output, not read from its data.
- **How it does on scans outside these four songs,** on other type, or on worse paper. These are four clean engravings.
- **Whether its readings of real pre-1918 scans are good enough as training lines** without a human check. That is the next row's question, under row 82's exclusion rule; no set 1 to 4 scan may be a training line.
- **The model card's CER of 1.69 percent** is on a set the card does not name; it was not checked.
- **Whether a better chunker would recover the 50 syllables that share a token.** One chunker was tried; cuts at hyphens too would be the next thing to measure.
