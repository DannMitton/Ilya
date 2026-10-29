# Memo: B0, the reader review, desk reading (r1, 2026-10-28 21:5x)

QUEUE row 158, step 1 (desk reading, cheap). Opus desk. Measure: none yet; step 2 measures after the Sunday reset.

## TrOCR `taiga75/ru-trocr-1700s`

- Licence: MIT (model card front matter, read in full from the copy on the Mac, `~/Downloads/_desk-trocr/hf/hub/models--taiga75--ru-trocr-1700s/snapshots/d5563063.../README.md`; also the Hugging Face API, `cardData.license` = `mit`).
- Author: Maria Levchenko, 2025, DOI 10.57967/hf/3942 (the card's citation block).
- Letters: the card lists ѣ, і, ѳ, ѵ, ъ among those it handles. Not checked in `tokenizer.json`.
- Training: 18th-century Russian books from the National Library of Russia, civil script; 3 epochs, 1,227 steps; base "TrOCR" (checkpoint not named). Reported CER 1.69 percent, WER 5.75 percent on its own evaluation.
- Training code and data published: NOT ESTABLISHED. The card links neither.
- Size: `model.safetensors` 1,335,747,032 bytes (the snapshot's tree file). Not a browser model; the teacher path only, which runs on the Mac (`~/Downloads/_desk-trocr/venv` exists).
- Fit: trained on 18th-century civil script, not on music underlay; whether it reads hyphenated syllables under staves well is what step 2 measures. The desk's earlier measure (2026-10-12) found it stronger than r2 on S, T, K, and M (INBOX 2026-10-28 15:30, desk line); that measure is not re-read here.

## PaddleOCR PP-OCRv5 `eslav` recognizer

- Licence: Apache 2.0 (PaddleOCR repository `LICENSE`, first lines read; the ONNX repackaging `monkt/paddleocr-onnx` states Apache 2.0 in its README).
- Size: `languages/eslav/rec.onnx` 7,870,092 bytes in `monkt/paddleocr-onnx` (Hugging Face API tree listing). Browser route claimed through onnxruntime-web; not tried.
- **Letters: its dictionary holds і and І, and does not hold ѣ, Ѣ, ѳ, Ѳ, ѵ, or Ѵ** (`ppocrv5_eslav_dict.txt` from the PaddleOCR repository, 517 lines, each letter tested as a whole line). It holds ъ and ё.
- Consequence: `eslav` can never write ѣ, ѳ, or ѵ. For sound (the IPA, after `modernisePreReform`, where ѣ sounds as е, ѳ as ф, ѵ as и) that need not matter, if it reads those glyphs as their modern equals; for fidelity to the print it cannot serve. Which letter it writes for a printed ѣ is NOT ESTABLISHED until step 2.

## For step 2 (after Sunday 04:00)

Measure both, and r2, on the same framed rows of the 18 build songs with the same scorer, split three ways: letters as printed; sound after `modernisePreReform`; the old letters alone. TrOCR is measured as a teacher (Mac, no Claude tokens), `eslav` as a candidate reader (browser size). The recommendation follows the numbers.

Sources: the TrOCR model card on the Mac (above); `https://huggingface.co/taiga75/ru-trocr-1700s`; `https://huggingface.co/monkt/paddleocr-onnx`; `https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/main/ppocr/utils/dict/ppocrv5_eslav_dict.txt`; `https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/main/LICENSE`.
