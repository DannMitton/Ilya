# Brief for Code on the Mac: can an open old-spelling model read our underlay? (r2, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 14:42. **r2, about 14:50: applies Fable's twelve amendments** (`docs/sessions/review-fable-brief-row88_r1_2026-10-12.md`, SEND WITH AMENDMENTS); r1 superseded. QUEUE row 88, N.184. For Code on Dann's Mac, Opus, after row 86 (and before or beside row 82, whichever Dann pastes first). Fable reviews this brief before Code gets it. **Measures only. Nothing kept in `apps/`, `packages/`, `third_party/`, or `static/`; the model stays outside the tree.**

Displaces: nothing.

## 1. What was observed

- Dann, 2026-10-12 14:30 to 14:42: if open models already read ѣ, ѳ, ѵ, and і, use them; *"My mac is fast and I'm happy to have it perform the testing we need."*
- The desk's research (`docs/sessions/memo-prereform-ocr-research_r1_2026-10-12.md`): `taiga75/ru-trocr-1700s` on Hugging Face (MIT licence; TrOCR, about 0.3B parameters; its card names ѣ, і, ѳ, ѵ, ъ; CER 1.69% on a set the card does not name; trained on 18th-century books from the National Library of Russia). It is too large for the browser. Its use here is as a teacher: if it reads our underlay rows well, its transcriptions of real pre-1918 scans, from outside every held-out set, could become training lines; row 82 as briefed trains on rendered lines, so adding them is a change the desk makes to row 82 after this report.
- Row 81's baseline (`docs/sessions/report-code-underlay-baseline_r1_2026-10-12.md`, section 5): best Tesseract model (c) reads 315 of 493 printed syllables right, ѣ 0 of 21, і 3 of 6, word-final ъ 97 of 101.

## 2. What is established, each line carrying its `path:line`

- Row 81's instruments and data: `docs/sessions/measure-underlay-baseline_2026-10-12/` (`raster.mjs`, `rows.py`, `<L>.rows.jsonl`, `poem.txt`, `step5.py`, `common.py`, `norm.ts`). Row 81's report, "The files", says the rasters and row crops were in its scratchpad and are gone.
- Read by Fable on Hugging Face 2026-10-12: `preprocessor_config.json` is `ViTImageProcessor`, `size` 384 by 384, `do_resize` true, `resample` 2; `config.json` has encoder `vit` with `image_size` 384 and decoder `trocr` with `max_position_embeddings` 512 and `vocab_size` 50265; `generation_config.json` sets `max_length` 64 and `num_beams` 4; `model.safetensors` is 1.34 GB, F32. Speed on this Mac, and the Mac's Python version, are NOT ESTABLISHED.

## 3. The run

1. **Install, outside the tree:** a Python virtual environment under `~/Downloads/_desk-trocr/` with `transformers`, `torch`, and `pillow`; download `taiga75/ru-trocr-1700s` there. Set `HF_HOME` inside `~/Downloads/_desk-trocr/` before the download so the cache lands there. Record the model revision (commit sha). Report macOS, chip, Python, `torch`, and `transformers` versions, the model's size on disk, and `torch.backends.mps.is_available()`. Load in float32. Read two rows on CPU and on MPS and confirm the texts match before using MPS for the rest; if they differ, use CPU and say so. After the download set `HF_HUB_OFFLINE=1`. If the download or install fails, stop and report.
2. **Licence check:** read the model's licence on Hugging Face and say what it permits; if it is not MIT or as permissive, stop and report.
3. **Re-cut row 81's Russian rows** (the 55 rows `poem.txt` lists) with `raster.mjs` (dev server; stop it by process number after) and `rows.py`, and confirm the `<L>.rows.jsonl` files match row 81's byte for byte. If any differs, stop and report the first differing row; do not read on different crops. The PDFs are where `measure-set3-four-below_2026-10-11/run.py:12-14` resolves them, as row 81 used them. Crops go to `~/Downloads/_desk-trocr/crops/`.
4. **Read every Russian row with the model.** The processor resizes every crop to 384 by 384 without keeping its aspect ratio (section 2), so a system-wide row is squashed. Read every row whole anyway, as a control, with `max_new_tokens` at least 256, and report the longest output in tokens and whether any output ended without the end token. As the main form, cut each row into chunks by ink gaps: project the row's ink onto x (as `rows.py` projected onto y), cut at every gap wider than 0.3 of the row's height (DESK DEFAULT), then group consecutive pieces left to right until the chunk's width would exceed 8 times its height (DESK DEFAULT); pad each chunk by 0.3 of the row's height; read each chunk; join the strings with one space in x order. Report the number of chunks per row and, on ten chunks chosen by eye, whether any cut falls inside a syllable. As a third form, if time allows, cut by row 81's (c) word boxes (`ocr/<L>-c.json`) and read each box; this form inherits (c)'s missed boxes and the report says so.
5. **Score with row 81's own code.** Write each form's output in the shape row 81's step 2 wrote (`ocr/<L>-<form>.json`: a list of words with `text`, the chunk's box as the word's box, confidence null). Split the model's string on whitespace, and split a token holding a hyphen into the part before, the hyphen, and the part after, so the hyphen is its own token as Tesseract gave it. Run `step5.py` unchanged; if it needs a field the model cannot give, make the smallest named edit and quote it. Print row 81's step 5 tables with columns (t-row) for the whole-row control and (t) for the chunked form, (t3) for the box form if run, each header naming its segmenter. Use the same mapping from row index to `poem.txt` line that `step5.py` uses, and say where that mapping lives.
6. **Speed:** seconds per row and per chunk on this Mac, on the device used, with the first (warm-up) row excluded.

## 4. The rulings this serves

- N.184, ruled in by Dann 2026-10-11 23:32 (`OPEN.md`, section "N.184").
- Dann, 2026-10-12 14:42, quoted in section 1.

## 5. Constraints

- No git command that writes. Write only `docs/sessions/measure-trocr-teacher_2026-10-12/` (scripts and printed tables, no images), the report, and row 88's State line in `docs/memory/QUEUE.md`.
- Set 3's sealed songs and set 4 stay unopened; use only S, T, K, and M, as row 81 did.
- Anything that costs money: stop and report.
- The model runs on the Mac only; no crop or text is sent anywhere. Transcribing real pre-1918 scans is a later row's work and carries row 82's exclusion rule (`~/Downloads/_desk-heldout-exclusions_2026-10-12.md`): no scan from sets 1 to 4 is ever a training line.

## 6. Done when

- Section 3's six results exist, each with its numbers, and the tables carry column (t) beside (a), (b), and (c).
- A recommendation, marked as Code's, decided by this bar on the chunked form (DESK DEFAULT, Fable 2026-10-12): the model is a teacher if it reads ѣ right in at least 17 of 21, і in at least 5 of 6, word-final ъ in at least 90 of 101, and syllables right in no fewer than 315 of 493 (row 81's (c)). Where it misses the bar, name each count missed and by how much, and say whether the misses fall on the pre-reform letters or on the type generally (ten misread syllables holding no pre-reform letter, listed).
- Nothing built; `WRITTEN` does not apply.

## 7. Report back

`docs/sessions/report-code-trocr-teacher_r1_2026-10-12.md` with a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer.
