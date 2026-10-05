# Brief for a Sonnet agent: reading old Russian print, and Russian songs that already exist in digital form

**Written by:** the desk (Fable), 2026-10-04 about 14:40. **Status: RUN the same hour.** It serves `commission-appraisal-of-the-approach_r1_2026-10-04.md`, section 6, "Research not yet done". Its companions are the systems sweep (`memo-sonnet-working-music-readers_r1_2026-10-04.md`) and the literature sweep (`brief-sonnet-sweep-omr-research-since-2012_r1_2026-10-04.md`). One agent, about 300k tokens at worst. The text from here down is the prompt, to be given whole.

---

You are a research agent. Today is 2026-10-04. Your job is a web research sweep, written up as one memo file. You change no code and run no engines unless a step says a download and inspection is allowed. You read sources and report.

## Who this is for

A small open-source project, Ilya, a free MIT-licensed web app for classical singers of Russian song. It reads SCANS of printed piano-vocal scores, often nineteenth-century Russian editions (Jurgenson, Bessel, Belaieff, Gutheil) in the spelling used before the reform of 1918, as clean black-and-white IMSLP scans. From the scan it must produce the vocal line and the printed WORDS under the notes, each syllable under its note. The words are small (lyric type under a staff), split into syllables by hyphens, and sometimes printed with no space between words. Constraints: it runs entirely in the browser, offline-capable, no server, MIT licence, modest download. The target for the words is 95 of every 100 syllables read as printed and under the right note. The singer can correct what Ilya marks as unsure, so a reader that knows which letters it doubts is worth more than one that does not.

The app already ships `tesseract.js` 7.0.0 with the stock modern `rus` model for photographed poems.

## What the project already holds. Verify and extend it; do not repeat it

1. **A sweep of 2026-10-01** (a Sonnet agent; the project lead has not opened its sources). It named: `orus`, a Tesseract LSTM model fine-tuned on the newspaper *Iskra* (1900 to 1905), Apache-2.0, at github.com/AButon-8/iskra_ocr, whose README reports word accuracy 94.0% and CER 1.30% against 61.2% and 9.45% for stock `rus`, with ѣ, і, and ъ in its character set and ѳ and ѵ absent; two Tesseract issues saying the stock Cyrillic models lack the old letters (tessdata_best issue 24, langdata_lstm issue 3); Transkribus public models (an eighteenth-century print model, a 1911 to 1913 handwriting model); Church Slavonic models for Tesseract and Kraken; and no nineteenth-century Russian civil-type model for Kraken or Transkribus, after checking "only a few catalogues".
2. **The project's own probe, 2026-10-04:** Tesseract 5.3.4 with `tessdata_best` `script/Cyrillic`, one lyric line at a time, read about 36 of 41 syllables as printed on three lines of an 1878 Jurgenson page at 400 dpi. It reads і. It misread ѣ every time.
3. **The project's own measurement, 2026-09-14:** whole-page OCR of a bilingual score page matched 47% of syllables; cropping to one syllable at a time matched 10 of 12; a whole-word dictionary did not help on fragments of two to four letters.
4. **A memo of 2026-07-16** on identifying a poem from its first line and on Russian text repositories (ru.wikisource, RVB, FEB, the Russian National Corpus, LiederNet). LiederNet's Russian is in modern spelling.
5. **OpenScore Lieder** is recorded as CC0, about 1,200 songs, MusicXML with lyrics. Whether it holds any Russian song is not recorded.

## What to find

### A. Engines and models that read Russian print in the pre-1918 spelling

For each, give: what it is, its licence (code and model separately), what it was trained on, what accuracy is reported and on what material, whether its character set holds ѣ, і, ѳ, ѵ, and the hard sign at the end of words, and whether it gives a confidence for each character or word.

- Tesseract: `orus` (verify the README's figures, the test set, the training set, and the date); any `rus_old`, `rus_prereform`, or similar model in `tessdata_contrib`, on GitHub, or on Hugging Face; any fine-tuning recipe that adds letters to an existing model and how much labelled text it needed.
- Kraken, eScriptorium, HTR-United, Zenodo's OCR model community, and Transkribus: any model for Russian civil type of the nineteenth or early twentieth century. Check the catalogues properly this time and say which you checked.
- Commercial and platform engines: ABBYY FineReader (it lists an old-spelling Russian language; confirm from ABBYY's own pages), Google Cloud Vision and Google Books practice, Apple's Vision framework, Azure. What do they document about pre-reform Russian?
- Newer open engines: PaddleOCR and its PP-OCR models (the East Slavic or Cyrillic recognition models; character set; licence; size), EasyOCR, docTR, Surya, TrOCR variants, any vision-language model with published results on historical Cyrillic print. Say plainly where a model's character set cannot output ѣ at all.
- Large digitization efforts that had to solve this: the Russian State Library, the National Library of Russia, Google Books, HathiTrust, the Prozhito project, the digital Tolstoy edition, the pre-reform holdings of the Russian National Corpus. What do they say they used, and how well did it work?

### B. Help from the language, after the reading

- Converters and lexicons between the old spelling and the modern one, in both directions (for example "Славеница", `prereform2modern`, any list of the roots that take ѣ). Licences. Where ѣ, і, ѳ, and ѵ stand is fixed by the word, so a reader that confuses ѣ with ъ or ь can be corrected from a lexicon. Is there published work or a tool that corrects OCR of pre-reform Russian this way, and how well does it do?
- Texts in the old spelling that could serve as a language model or as a second witness for a known poem: Russian Wikisource's pre-reform ("ДО") pages, the pre-reform corpus of the Russian National Corpus, others. Licences and access.

### C. OCR that runs in a browser, offline

For each engine that can run in a browser with no server: licence, download size, speed where stated, whether it has a Cyrillic model, and whether its models can be fine-tuned or extended by a small team. Cover at least: tesseract.js; PP-OCR or RapidOCR models through onnxruntime-web (the browser port of the music reader homr, `homr-web`, already ships RapidOCR 3.9.2 this way); transformers.js with TrOCR-style models; any Rust or C++ engine compiled to WebAssembly. Cite real, working examples.

### D. Russian art songs that already exist as digital scores

The project could sometimes match a scanned song to an existing encoding instead of reading every note. For each corpus or site: what it holds, the file format, whether the lyrics are present and in which script, the licence or terms, and whether bulk access or an API exists. Look for songs by Tchaikovsky, Mussorgsky, Rachmaninoff, Glinka, Rimsky-Korsakov, Borodin, Dargomyzhsky, and Cui in particular, and report counts where a source lets you count.

- OpenScore Lieder (which composers; any Russian songs; how lyrics are encoded).
- PDMX and any other public-domain MusicXML dataset built from MuseScore.com; MuseScore.com's own terms.
- IMSLP: does it host engraving files (MusicXML, MuseScore, LilyPond, Finale) for songs, and under what terms?
- Mutopia, KernScores, CPDL, Wikimedia Commons and Wikisource scores, the Tchaikovsky Research site, any Russian-language score library with symbolic files.
- MIDI collections, only if they carry the vocal line as its own track.

### E. Anything that already does this job for Russian

Any tool, paper, thesis, or project, in English or Russian, that reads the words of Russian vocal scores, or that aligns a known Russian poem to a scanned score. Search in Russian as well as English (for example "распознавание нот", "распознавание текста дореформенной орфографии", "оптическое распознавание нот вокальных"). If you find none, say what you searched.

## Rules of evidence. These are strict.

- Every factual claim carries its source URL. Prefer the primary source: the repository, the model card, the paper, the vendor's own page.
- For every source say how you read it: **read in full**, **read in part** (say which part), or **search-result snippet only**. A snippet is a lead, not a reading.
- Do not state a number, a licence, or a result you did not read in a source. If you could not establish something, write NOT ESTABLISHED and say what you tried. **NOT ESTABLISHED beats a complete invented answer.**
- If a page is blocked or paywalled, say so and move on. Do not use caches, mirrors, or other routes around a block.
- You may download a small model file or character-set file to inspect what letters it holds. Say that you did.
- Short quotations only (under 15 words each), in quotation marks, with the URL.
- Mark each inference of your own INFERENCE.
- Give full bibliographic details for each paper (authors, year, title, venue, DOI or arXiv id), because this project cites its sources.

## Output

Write the memo to one file: `/mnt/user-data/outputs/memo-sonnet-old-russian-print-and-existing-encodings_r1_2026-10-04.md`.

Structure: a one-paragraph answer to "what is the best available way to read the words of an 1878 Russian song page in a browser, and how good is it?"; then sections A to E, each ending with "What this means for Ilya" (two or three sentences, marked INFERENCE where it is yours); then "What could not be established"; then the numbered source list with URL, bibliographic details, and how each was read.

Length: as long as the evidence needs, about 3,000 to 5,000 words. Plain, direct English, Canadian spelling, no em dashes, no hype.

Budget: at most about 70 tool calls and about 300k tokens. If you are running out, write what you have and list what is left under "What could not be established".

Your final message: the file path, then a summary of at most 250 words with the five most important findings and the three biggest gaps. Do not paste the memo into the final message.
