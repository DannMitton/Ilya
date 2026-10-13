# Pre-reform Russian OCR: what exists (r1, 2026-10-12)

Returned by a Sonnet helper for the desk (Opus), 2026-10-12 about 14:35, at Dann's request (14:30). 100k tokens. Transcribed by the desk with this provenance line; the helper's words follow, condensed only by removing nothing of substance. Every URL was read by the helper unless marked snippet or summarising fetch.

**Headline.** No pre-reform Russian model exists in a form tesseract.js can load, as far as the helper found. The only open models that read ѣ ѳ ѵ і are TrOCR transformers trained on 18th-century civil-type books, about 0.3B parameters (roughly 1.2 GB in F32, the desk's arithmetic), not Tesseract and far too large for the browser.

| Rank | Candidate | Licence | Engine | Letters | Accuracy | Browser |
|---|---|---|---|---|---|---|
| 1 | `taiga75/ru-trocr-1700s`, https://huggingface.co/taiga75/ru-trocr-1700s | MIT | TrOCR | ѣ і ѳ ѵ ъ named | CER 1.69% (held-out NOT ESTABLISHED) | not plausible |
| 2 | `dsmchr/trocr_russian_18th_century_printed`, https://huggingface.co/dsmchr/trocr_russian_18th_century_printed | CC BY-NC 4.0 | TrOCR | not named | val CER 0.0534; 14,911 aligned lines | not plausible |
| 3 | Transkribus "Russian Print XVIII Cent", https://transkribus.org/model/russian-print-xviii-cent | not stated | PyLaia | not stated | CER 2.4% (blog says 0.6%) | no weights |
| 4 | ABBYY FineReader "Russian (old spelling)", https://support.abbyy.com/hc/en-us/articles/360012249179 | proprietary | ABBYY | not stated | not stated | no |

**Corpora.** LLM-OCR benchmark, https://arxiv.org/pdf/2510.06743: 1,029 pages, 28,657 lines, 1752 to 1801; Tesseract 21.55% CER, fine-tuned TrOCR 1.83%; post-OCR correction from text alone made results worse. Licence not stated; full set promised on publication.

**Correction by dictionary.** Habr, https://habr.com/en/companies/contentai/articles/223315: a pre-reform morphological dictionary built from a modern one by rule; ѣ restored by grammatical category, hand lists, and Ukrainian cognates with і; under about 9,000 roots carry ѣ. oldrus-ispell, https://de.osdn.net/projects/freshmeat_oldrus-ispell/releases/ (licence not stated). No published evaluation of dictionary-based ѣ restoration after OCR was found.

**Could not establish.** Any Tesseract traineddata for pre-reform Russian; any browser-loadable model; model byte sizes; the Russian national libraries' OCR pipelines; Russian-only repositories (the search tools are US-centred).

**What it changes for Ilya (the desk's reading).** Nothing can be imported as is. Row 82 (fine-tune and convert to integers) stays the durable path. The near path is a constrained correction: map the model's measured stand-ins for ѣ (ъ, Ъ, Б, ћ) back to ѣ only where Ilya's dictionary then recognizes the word. The benchmark's warning applies to unconstrained text-only correction; this one would be measured on row 81's 21 printed ѣ before anything is built.
