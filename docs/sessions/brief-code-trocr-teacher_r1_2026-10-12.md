# Brief for Code on the Mac: can an open old-spelling model read our underlay? (r1, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 14:42. QUEUE row 88, N.184. For Code on Dann's Mac, Opus, after row 86 (and before or beside row 82, whichever Dann pastes first). Fable reviews this brief before Code gets it. **Measures only. Nothing kept in `apps/`, `packages/`, `third_party/`, or `static/`; the model stays outside the tree.**

Displaces: nothing.

## 1. What was observed

- Dann, 2026-10-12 14:30 to 14:42: if open models already read ѣ, ѳ, ѵ, and і, use them; *"My mac is fast and I'm happy to have it perform the testing we need."*
- The desk's research (`docs/sessions/memo-prereform-ocr-research_r1_2026-10-12.md`): `taiga75/ru-trocr-1700s` on Hugging Face (MIT licence; TrOCR, about 0.3B parameters; its card names ѣ, і, ѳ, ѵ, ъ; CER 1.69% on 18th-century books). It is too large for the browser. Its use here is as a teacher: if it reads our underlay rows well, its transcriptions of real pre-1918 scans can become training lines for row 82's small model.
- Row 81's baseline (`docs/sessions/report-code-underlay-baseline_r1_2026-10-12.md`, section 5): best Tesseract model (c) reads 315 of 493 printed syllables right, ѣ 0 of 21, і 3 of 6, word-final ъ 97 of 101.

## 2. What is established, each line carrying its `path:line`

- Row 81's instruments and data: `docs/sessions/measure-underlay-baseline_2026-10-12/` (`raster.mjs`, `rows.py`, `<L>.rows.jsonl`, `poem.txt`, `step5.py`, `common.py`, `norm.ts`). Row 81's report, "The files", says the rasters and row crops were in its scratchpad and are gone.
- Everything else about the model (how to load it, its input size, speed on this Mac) is NOT ESTABLISHED.

## 3. The run

1. **Install, outside the tree:** a Python virtual environment under `~/Downloads/_desk-trocr/` with `transformers`, `torch`, and `pillow`; download `taiga75/ru-trocr-1700s` there. Report versions, the model's size on disk, and whether the Mac's GPU (MPS) is used. If the download or install fails, stop and report.
2. **Licence check:** read the model's licence on Hugging Face and say what it permits; if it is not MIT or as permissive, stop and report.
3. **Re-cut row 81's Russian rows** (the 55 rows `poem.txt` lists) with `raster.mjs` (dev server; stop it by process number after) and `rows.py`, and confirm the `<L>.rows.jsonl` files match row 81's byte for byte. Crops go to `~/Downloads/_desk-trocr/crops/`.
4. **Read every Russian row with the model**, one line per crop. TrOCR reads one text line; if a row is too wide for its input, report what the processor does to it and, as a second form, cut each row into overlapping halves and say how they were joined.
5. **Score with row 81's own code:** `step5.py`'s alignment of printed syllables to the output, letter for letter and in sound, and the per-letter table (ѣ, і, ѳ, ѵ, word-final ъ) as `step5-letters.json` does. Print row 81's step 5 tables with one more column, (t).
6. **Speed:** seconds per row on this Mac.

## 4. The rulings this serves

- N.184, ruled in by Dann 2026-10-11 23:32 (`OPEN.md`, section "N.184").
- Dann, 2026-10-12 14:42, quoted in section 1.

## 5. Constraints

- No git command that writes. Write only `docs/sessions/measure-trocr-teacher_2026-10-12/` (scripts and printed tables, no images), the report, and row 88's State line in `docs/memory/QUEUE.md`.
- Set 3's sealed songs and set 4 stay unopened; use only S, T, K, and M, as row 81 did.
- Anything that costs money: stop and report.

## 6. Done when

- Section 3's six results exist, each with its numbers, and the tables carry column (t) beside (a), (b), and (c).
- A recommendation, marked as Code's: use the model as a teacher for row 82's training lines, or not, with the count that decides it.
- Nothing built; `WRITTEN` does not apply.

## 7. Report back

`docs/sessions/report-code-trocr-teacher_r1_2026-10-12.md` with a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer.
