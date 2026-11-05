# Brief: can Ilya's reader score the poem's syllables against what it sees? (Sonnet helper, r1, 2026-11-04)

Code and documentation reading, plus small probes. Keep nothing in any repository. Every claim about Ilya's code carries a `path:line` you read in this run. NOT ESTABLISHED beats a complete invented answer.

## Why

Dann ruled 2026-11-04 23:52 to try "read as matching": instead of the reader guessing each syllable's letters and the join comparing strings afterwards, the poem's next syllables are scored against the reader's own evidence for each letter, so «Го» loses to «То» when the poem says «То». Two models: de Reuse and Fujinaga, "Robust Transcript Alignment on Medieval Chant Manuscripts" (WoRMS 2019, https://timothydereuse.github.io/static/pdfs/worms2019.pdf): global letter-level alignment of a known text to OCR output with affine gaps, each known syllable taking the boxes of the OCR letters it matched; and CTC-segmentation (Kürzinger and others 2020, https://arxiv.org/pdf/2007.09127): a known transcript forced through a recognizer's per-step letter probabilities, with a confidence per segment.

## Questions, in order

1. Which Tesseract build and model does Ilya's words path run in the browser (tesseract.js version, core file, the `rus_prereform` r2 traineddata), and where is it called (`apps/web/src/lib/omr/` on `cloud-lane-34`, clone `/home/claude/ilya`, read with `git show origin/cloud-lane-34:<path>`)? What does Ilya ask it to return today (words, symbols, boxes, confidences)?
2. What can that build return that Ilya does not ask for: per-symbol confidence; per-symbol alternatives ("choices", LSTM symbol choices, `lstm_choice_mode` and similar parameters); the raw per-step probabilities? Answer from the tesseract.js and Tesseract sources or docs of the exact version in Ilya's lockfile, and confirm with a probe: run that tesseract.js version in Node or headless Chromium on one row image (crop one underlay row from `/root/m0/_colleague-pages/mussorgsky-1967-songs-01-05.pdf` page 2; first file only, never the second) and print what it returns with the alternatives switched on.
3. From 1 and 2, the cheapest design that lets a poem syllable be scored against a token's evidence: (a) per-letter alternatives with confidences, scored by edit distance weighted by them; (b) per-step probabilities, forced alignment as in CTC-segmentation; (c) neither available, letter-level global alignment of the poem against the read letters as McGill did, with a reader confusion cost. Say which the build supports, with the probe's output as evidence, and what each would need in Ilya (files named, size in lines NOT guessed: say NOT ESTABLISHED where you cannot read it).

## Rules

- Scratch under `/root/c181/match/`. Write nothing elsewhere. Another helper is building the app under `/root/c181/`: do not touch its folders, ports, or worktrees.
- Stop at 150,000 tokens and write what you have, saying where you stopped.

## Output

`/root/c181/match/report-desk-row181-read-as-matching-feasibility_r1_2026-11-04.md`: answers 1 to 3 with lines and probe output; what you could not establish. Reply with three lines: what the build can return, the design it supports, the report path.
