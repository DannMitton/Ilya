# Reading old Russian print, and Russian songs that already exist in digital form

**Provenance, added by the desk (Fable), 2026-10-04 about 14:45.** Returned by a Sonnet subagent the desk spawned at about 14:08 from `brief-sonnet-sweep-old-russian-print-and-existing-encodings_r1_2026-10-04.md`. Saved verbatim under this paragraph. **The desk read this memo in full.** Of its sources the desk itself read the `homr-web` README [20] in full and opened no other; every other reading is the agent's, and each is a lead until the desk opens the source. Cost: 229,841 tokens, 77 tool uses, 10.8 minutes.

Memo of 2026-10-04 for the Ilya project. Written by a research agent from the brief `brief-sonnet-sweep-old-russian-print-and-existing-encodings_r1_2026-10-04.md`. No code was changed and no OCR engine was run. I downloaded four small files to inspect them (the `orus` model, two PaddleOCR dictionaries, one RapidOCR ONNX file) and several catalogue files, and I say where. Numbers in square brackets are entries in the source list at the end. "Read in part" means a fetch tool or a partial reading, not the whole page. WebFetch returns a small model's answer about a page, so every WebFetch reading below is "in part" by definition.

## The answer in one paragraph

Nothing published has been measured on the lyric lines of a nineteenth-century Russian music engraving, so no figure for "how good" exists yet. The best candidate that exists today and can run in a browser is the stock Tesseract engine you already ship, loaded with the community model `orus` [1][3]. It is Apache-2.0 [1][3], it is 11.8 MB raw and 6.3 MB gzipped (my measurement) [3], and its character set holds ѣ, Ѣ, і, І, ъ and Ъ but not ѳ or ѵ [3]. Its author reports 94.0% word accuracy and 1.30% character error on a test set of pre-reform newspaper text, against 61.2% and 9.45% for stock `rus` [1]. That material is the 1900 to 1905 newspaper *Iskra*, not music and not 1878 [1]. At 1.30% character error, independent errors would leave about 95 to 96 of 100 three- to four-letter syllables intact (INFERENCE, arithmetic only), but lyric type under a staff is a different job, so treat that as a ceiling to test, not an expectation. A second candidate is the PaddleOCR PP-OCRv5 Cyrillic line recogniser, an 8.07 MB ONNX file that RapidOCR ships and that onnxruntime-web can run the way `homr-web` already runs RapidOCR [17][19][20]. Its dictionary has output slots for ѣ, ѳ and ѵ [16][17], but I could not establish that it was ever trained to produce them. No Kraken, Transkribus, HTR-United or Zenodo model for nineteenth-century Russian civil print exists in the catalogues I checked [6][9][10]. The honest route is to measure `orus` on a few hundred of your own lyric-line crops and, if it falls short, fine-tune it on those lines.

---

## A. Engines and models that read Russian print in the pre-1918 spelling

### Tesseract: `orus`

- **What it is.** A Tesseract LSTM model fine-tuned on the newspaper *Iskra*, 1900 to 1905, "printed in pre-reform Russian orthography" [1]. Developers named in the README are locusclassicus and AButon-8, with HSE University (Moscow) master's students credited for the reference data [1]. Read in full [1].
- **Licence.** The README says the repository is Apache License 2.0 and the `LICENSE` file begins with the Apache 2.0 text [1][3]. The README does not give a separate licence for the model file. The training text is 1900 to 1905 newspaper print; I did not look for a copyright statement on the scans.
- **Training data.** The repository holds `data/ground-truth/` and `data/val/` folders and R scripts for training and validation [1][2]. The sizes of those folders are not stated in the README and I could not list them: the GitHub tree and commit pages are disallowed to my fetch tool (robots.txt) [2]. The GitHub front page shows 22 commits and no dates I could read [2]. NOT ESTABLISHED: the number of labelled lines, the commit dates, and the date of the model.
- **Reported accuracy.** Test set, from the README table [1]:

| Model | Word accuracy | Micro-CER | Macro-CER | Char accuracy | WER |
|---|---|---|---|---|---|
| `rus` | 61.2% | 9.45% | 13.0% | 90.6% | 69.9% |
| `orus` | 94.0% | 1.30% | 2.35% | 98.7% | 9.9% |

  I verified the figures against the README itself. I could not verify them against the data: the README calls the table "Test Set" without saying how many pages or lines, or whether the test pages come from the same issues as the training pages [1]. The README's "Final iterations" training figures are batch error rates of 5.374% (character) and 10.65% (word), which are training-time numbers, not test results [1].
- **Character set (my inspection).** I downloaded `orus.traineddata` (11,786,045 bytes) and read its container and its LSTM unicharset with a short script, without running Tesseract [3]. The unicharset holds 133 entries, of which 70 are Cyrillic letters. Present: ѣ (U+0463), Ѣ (U+0462), і (U+0456), І (U+0406), ъ, Ъ, ё, Ё, the hyphen, digits, and the usual punctuation, including « » and „ “. Absent: ѳ, Ѳ, ѵ, Ѵ. The only Latin letters are c and i. This agrees with the 2026-10-01 sweep's report [3].
- **Other facts from the file.** It holds only the LSTM network, its unicharset and recoder, and a version entry; it carries no word-list (dawg) components [3]. So it reads letter by letter without a built-in dictionary, which suits syllable fragments. The version entry reads "5.5.0" [3]. Whether tesseract.js 7.0.0 loads a model with that marker is NOT ESTABLISHED; test it. Size: 11,786,045 bytes raw, 6,293,178 bytes after `gzip -9` (my measurement). tesseract.js asks for `<lang>.traineddata.gz` [21].
- **Confidence per character or word.** Not sourced in this sweep. NOT ESTABLISHED from a document I read; your own use of tesseract.js already shows what it returns.

### Any other Tesseract model for the old spelling

- `tessdata_contrib` lists six model folders (Khmer, Old_Persian, akk, grc_hist, ori_hist, urd_naw), none Russian or Cyrillic [36]. Read in part.
- The two Tesseract issues confirm that stock models lack the old letters. In `langdata_lstm` issue 3, a maintainer says a new model "should not replace `rus`, but be a new `rus_old`" [4]. In `tessdata_best` issue 24, a maintainer says Ѣ and the other old glyphs are "missing in the Cyrillic.unicharset" [5]. Both read in part. Neither thread gives dates.
- I ran one web search for `rus_old`, `rus_prereform`, "pre-reform" and `tessdata_contrib` with Hugging Face. It returned `orus`, the dataset described under B, and the `tessdata_contrib` page above, and no other model (search-result level only; I did not browse Hugging Face's own model index).
- **Fine-tuning recipe.** In issue 24 a contributor suggests "plus-char" training with at least 15 occurrences of each new character and about 150 lines of training text containing the target glyphs; another points to `tesstrain` with line images and transcriptions [5]. The `orus` README thanks a blog post on Tesseract fine-tuning by Andrés Cruz, but that page now returns 404 [1][37]. How much labelled text `orus` itself needed is NOT ESTABLISHED. The 150-line figure is one contributor's suggestion, not a measured requirement.

### Kraken, eScriptorium, HTR-United, Zenodo, Transkribus

What I checked, and how:

- **Zenodo OCR-models community (Kraken's registry).** I queried the Zenodo API within the `ocr_models` community for "Russian" (5 hits), "Cyrillic" (6), "Russian print" (14), "Church Slavonic" (5) and "pre-reform" (0) [6]. The Russian-relevant hits are: a generic HTR model for Old Cyrillic uncial and semi-uncial hands of the 11th to 16th centuries (CC-BY-2.0, 2023) [6]; a multilingual "Party" model (Apache-2.0, 2025) [8]; and three PP-OCRv6 multilingual models for Kraken (Apache-2.0, 2026-08-04) [7]. None is a nineteenth-century Russian civil-type model.
- **HTR-United catalogue.** I downloaded `htr-united.yml` from the master branch (138 entries) and searched every entry for Cyrillic characters, "Russia", "Ukrain", "Slavon", "Serb" and "Bulgar", and counted the language codes [9]. No entry is in Russian or any Cyrillic language. The catalogue holds French (57), Latin (31), German (15), and a long tail of other languages [9].
- **Transkribus.** I downloaded the platform's public list of text models (410 models) from its REST endpoint and filtered it for Russian, Ukrainian, Belarusian, Church Slavonic and Cyrillic [10]. 32 models matched. The Russian print models are "Russian print XVIII cent PyLaia" (CER 1.7%, 4,653 lines) and "Russian print of the 18 c. (V. Okorokov's Printing House)" (CER 0.2%, 16,162 lines) [10]. The nineteenth- and twentieth-century Russian models are handwriting: for example "Russian Civil Records late XIX cent." (CER 3.0%), "Russian-RychkovArchive-v1.0" (CER 2.5%, 1911 to 1913 per the Transkribus blog) and the generic handwriting models [10][11]. "Russian generic handwritten and typed 1" (CER 4.55%, 175,348 lines, 2024) is catalogued as handwritten, and whether its training set includes nineteenth-century print is NOT ESTABLISHED [10]. The Transkribus blog describes the Rychkov model as "ideal for using with pre-form Cyrillic documents" (read in part) [11], but it is a handwriting model for a different hand and period. Whether any Transkribus model weights can be downloaded for browser use is NOT ESTABLISHED.
- **What the PP-OCRv6 and Party records say about Russian.** In the PP-OCRv6 small record, Russian is trained on "2 private datasets" plus synthetic modern print, and its test row reads 3,053 lines, CER 16.34%, WER 49.26% [7]. In the Party record, Russian has "1 private manuscript dataset" plus synthetic print [8]. INFERENCE: the real Russian training material is manuscripts, and the 16% CER reflects that; neither is evidence about old print.

### Commercial and platform engines

- **ABBYY.** ABBYY's support page for FineReader Engine says "Russian (old spelling) is 18-19th century variant of Russian language", names the internal language "RussianOldSpelling", and was last edited 2023-06-21 [12]. It lists no letter inventory, no dictionary and no accuracy. Read in part. I did not read ABBYY's desktop-product language list. FineReader Engine is a commercial SDK, so it is not a browser option.
- **Google Cloud Vision.** The language-support page, last updated 2026-09-30 according to the fetch answer, lists Russian (`ru`) and also "Русский (старая орфография)" with code `ru-PETR1708` and the note "Old Orthography" [13]. Read in part. INFERENCE: the code name suggests the Petrine orthography of 1708, so the label may point at the eighteenth-century civil type rather than the 1918 reform, and nothing on the page says ѣ is recognised. Google Books practice is NOT ESTABLISHED.
- **Apple Vision framework and Azure.** NOT ESTABLISHED. One search for Apple's supported recognition languages returned only developer-forum threads, which I did not read. I did not search Azure.

### Newer open engines: can the character set output ѣ?

I downloaded or read the character lists directly. Results:

| Engine / model | Character set source | ѣ | і | ѳ, ѵ | ъ |
|---|---|---|---|---|---|
| Tesseract `script/Cyrillic` and stock `rus` | issue 24 [5] and your own probe | No ("missing" [5]) | Yes (your probe) | No | Yes |
| PaddleOCR `cyrillic_dict.txt` (163 entries, older model) | raw file [16] | No | Yes | No | Yes |
| PaddleOCR `ru_dict.txt` (125 entries) | raw file [16] | No | No | No | ъ yes, Ъ no |
| PaddleOCR PP-OCRv5 `eslav` (517 entries) | raw file and model config [16][18] | No | Yes | No | Yes |
| PaddleOCR PP-OCRv5 `cyrillic` (850 entries) | raw file and model config [16][17] | Yes (Ѣ ѣ) | Yes | Yes (Ѳ ѳ Ѵ ѵ) | Yes |
| EasyOCR `cyrillic_g2` | `config.py` string [22] | No | Yes (Іі) | No | Yes |
| docTR `russian` vocabulary | `vocabs.py` [23] | No | No | No | Yes |
| `orus` | unicharset [3] | Yes | Yes | No | Yes |

The PP-OCRv5 Cyrillic dictionary needs a caution. Its 290 Cyrillic entries run across the whole Unicode Cyrillic block, including the Church Slavonic and Central Asian letters [16]. INFERENCE: that looks like a block-wide list, so a slot for ѣ says the output layer has a class for it, not that the network learned to emit it. The model card gives 80.27% line accuracy (a line counts as wrong if any character is wrong) on the team's own Cyrillic test, which is modern text [17]. The `eslav` card gives 81.6% [18]. The Cyrillic model is Apache-2.0 on its Hugging Face card, last modified 2025-10-16, with a 7,972,691-byte weights file [17]. I did not test it on ѣ.

- **Surya.** Code Apache-2.0; weights under a modified Open Rail-M licence, "free for research, personal use, and startups under $5M funding/revenue" [24]. It reports 88.8% for Russian on its own benchmark [24]. Levchenko measured it at 45.96% CER on eighteenth-century Russian civil type [14]. It does not run in a browser, and the weights licence is not MIT-compatible for redistribution (INFERENCE).
- **TrOCR and vision-language models.** Levchenko (2025) tested 12 multimodal models on 1,029 pages of eighteenth-century Russian civil-type books (428 books, 1752 to 1801). Gemini-2.5-Pro scored 3.36% CER and 4.69% WER in full-page mode. Tesseract 4.0 scored 21.55% CER, Transkribus PyLaia 26.93%, Surya 45.96%, and a TrOCR fine-tuned on the paper's own data 1.83% CER, which the paper presents as an upper bound [14]. The paper names a failure it calls "over-historicization", where models insert letters from the wrong period, and notes "ї→i" and ъ confusions [14]. Read in part. This is eighteenth-century type, not 1878, and the dataset "will be released upon publication" [14]. The result that matters here is that a small recogniser fine-tuned on in-domain lines reached 1.83%, far below the engines used as shipped. A second paper in the search results, Vesalainen et al. (2026), is about English and is not relevant [15].

### Large digitization efforts

NOT ESTABLISHED. I ran one Russian query on the Russian State Library, the Presidential Library and Prozhito with "дореформенной орфографии" and "ABBYY"; it returned Habr posts and a library history page, none of which I read. I did not reach Google Books, HathiTrust, the National Library of Russia or the digital Tolstoy edition. The only digitization-adjacent artefact I found and read is a Hugging Face dataset, described under B [29].

### What this means for Ilya (section A)

INFERENCE: the cheapest next experiment is `orus` through tesseract.js, with `langPath` pointing at your own server, on the same three 1878 lines your probe used. That tests ѣ directly and costs one file. The reported 94.0% is on a different typeface and period, so do not carry it over. If `orus` misses ѳ and ѵ, check how often they occur in the songs you care about before it matters. A tuned model is the likely end state, because the one published result in this sweep that reached about 2% CER was a recogniser fine-tuned on in-domain lines [14].

---

## B. Help from the language, after the reading

### Converters and lexicons

- **prereform2modern** (dhhse, GitHub; also on PyPI). Converts pre-reform text to modern spelling, in one direction only [27]. MIT licence; Python 3; returns the converted text, a list of old and new word pairs, and a JSON of word and character details; supports bracketed editorial corrections [27]. The page gives no accuracy figure, says nothing about OCR errors, and does not describe its dictionary or morphology. 58 commits [27]. Read in part. The Hugging Face dataset card below recommends it [29].
- **prereform_to_contemporary** (Elena Sidorova, GitHub). Converts 1918-reform text to contemporary spelling [28]. Python 2.7, and its README example shows the output keeping the old form in braces ("Он{Онъ} стоял{стоялъ}") [28]. No licence in the README, which I read in full [28]. An online version is linked (web-corpora.net) and was marked "in process" [28].
- **Славеница (Slavenitsa).** A converter and tool for Slavic writing systems at slavenica.com; its licence, direction and method are NOT ESTABLISHED, because I saw only a search-result snippet [36].
- **Modern to old spelling.** I found no tool I could read that goes from modern to old spelling. Slavenitsa and an online service on lingvoforum.net appeared in search results as converters to old spelling; snippet only [36].
- **A list of roots that take ѣ.** NOT ESTABLISHED. The Slavic Cataloging Manual cheat sheet appeared in results (snippet only) [36]. I did not read a machine-readable list.
- **Published work on correcting pre-reform OCR with a lexicon.** NOT ESTABLISHED. A Russian article titled "Классификация ошибок распознавания символов печатных изданий в старинной орфографии" (Cyberleninka) looked relevant, but the site returned a CAPTCHA page to my fetch tool, so I could not read it and moved on [36].

### Old-spelling texts as a language model or second witness

- **Hugging Face dataset `nevmenandr/russian-old-orthography-ocr`.** MIT licence. It holds page images and human-corrected plain text of nineteenth-century Russian publications in pre-reform spelling, built "to train and evaluate optical character recognition systems" [29]. Long texts are PDFs with matching `.txt` files; one-page texts are PNGs with matching `.txt` [29]. Read in full. The card gives no page or word count, and I did not count them. This is the most directly useful training or testing resource I found for nineteenth-century type, though it is prose books, not lyric lines.
- **Russian Wikisource pre-reform pages and the Russian National Corpus.** NOT ESTABLISHED. My fetch tool refused ru.wikisource.org ("This domain is cache-only and cannot be fetched"), and I did not look for another route. Search results show a Wikisource project page and category called "Дореформенная орфография" [36]. For the Russian National Corpus I saw only snippets and the corpus portrait page address [36], not its pre-reform content, size or licence.

### What this means for Ilya (section B)

INFERENCE: a lexicon pass is worth building only after you know what the reader gets wrong. Your own finding that dictionaries do not help on two- to four-letter fragments still stands, and nothing I read contradicts it. A converter such as prereform2modern is more useful in the other direction for you: run a known poem (from Wikisource or LiederNet) through it, and use the old and new word pairs to decide where ѣ, і, ѳ and ѵ ought to stand in the expected lyric, which gives a second witness to compare against what the reader printed.

---

## C. OCR that runs in a browser, offline

| Engine | Licence | Download | Speed (as stated) | Cyrillic | Fine-tune by a small team |
|---|---|---|---|---|---|
| tesseract.js 7.0.0 | Apache-2.0 [21] | model: `orus` 6.3 MB gz (mine); core files not measured | not stated in what I read | `rus`; `orus` adds ѣ [3] | Yes, with Tesseract's own tools [5] |
| RapidOCR / PP-OCR through onnxruntime-web | RapidOCR Apache-2.0 [19]; model terms see below | Cyrillic v5 recogniser 8,074,092 bytes (mine) | `homr-web` OCR about 3 s a page on WebGPU, about 5 s on WASM threads [20] | Cyrillic v5 has ѣ slot [16] | INFERENCE: yes via PaddleOCR training, then export |
| transformers.js with TrOCR | not established (badge only) [26] | not established | not established | no Russian old-print model found | In principle; Levchenko's fine-tuned TrOCR reached 1.83% CER on 18th-century lines [14] |
| `ocrs` (Rust to WASM) | not established | not established | not established | "recognizes the Latin alphabet only" [25] | not applicable |

- **tesseract.js.** Version 7.0.0 and licence Apache-2.0 are in its `package.json` [21]. Its local-installation guide says language files are fetched as `langPath + langCode + '.traineddata.gz'`, and that the core is four WebAssembly files (plain and SIMD, each with and without LSTM) [21]. That guide's examples name v5.0.0, so confirm against the 7.0.0 docs. Core download size and speed are NOT ESTABLISHED here; you have the app, so measure.
- **RapidOCR in the browser.** `homr-web` is a browser port of the music reader homr, licensed AGPL-3.0, that runs its models through onnxruntime-web on WebGPU or WebAssembly [20]. Its README says it reads text with RapidOCR 3.9.2's default pipeline: a detection model of 9,929,594 bytes, a classifier of 585,532 bytes and a recogniser of 21,234,383 bytes, and that a page takes 7 to 9 seconds on an Apple M-series laptop with WebGPU once the models are cached, of which OCR is about 3 seconds (about 5 on WebAssembly threads) [20]. WebAssembly threads need cross-origin isolation headers [20]. Read in part. I did not establish which script that default recogniser reads. RapidOCR's own model list names the Cyrillic and East Slavic PP-OCRv5 recognisers and an older Cyrillic PP-OCRv3 recogniser in ONNX form [19]. I downloaded the Cyrillic v5 ONNX from the path in that list: 8,074,092 bytes [19]. RapidOCR is Apache-2.0, and its README says converted model artifacts carry their own terms, pointing to a `MODEL_LICENSES.md` that I could not find at the path I tried [19]. The Paddle Cyrillic model card says Apache-2.0 [17]. The Zenodo PP-OCRv6 models are Apache-2.0 and Kraken-format [7], not drop-in for onnxruntime-web (INFERENCE).
- **Surya and docTR.** Neither is a browser engine as shipped. docTR's code is Apache-2.0 and its Russian vocabulary has no ѣ, і, ѳ or ѵ [23].

### What this means for Ilya (section C)

INFERENCE: you have two realistic browser paths. Tesseract with `orus` is a file swap in code you already ship and keeps your existing confidence output. A PP-OCR Cyrillic recogniser through onnxruntime-web is smaller (8.07 MB) and `homr-web` shows the pattern works in a browser, but you would own the line-cropping and the decoding, and I found no evidence the model reads ѣ. Start with `orus`.

---

## D. Russian art songs that already exist as digital scores

### OpenScore Lieder

- **What it holds.** A mirror of the OpenScore Lieder Corpus on MuseScore.com, released under CC0, "over 1,200 nineteenth century songs" by "over 100 composers" in several languages [30]. Read in full. The mirror's `corpus_conversion.json` lists 1,356 score files across 107 composer directories; I downloaded and counted it [31].
- **Russian songs.** None that I can find. I read all 107 composer directory names. None is Tchaikovsky, Mussorgsky, Rachmaninoff, Glinka, Rimsky-Korsakov, Borodin, Dargomyzhsky or Cui, and none is a Russian composer I recognize [31]. The 21 Pauline Viardot scores I listed have French titles [31]. I did not open the lyric files, so I cannot say that no song by another composer sets a Russian text. The `data/scores.tsv` metadata files the README mentions returned 404 at the paths I tried [30][31].
- **Format and lyrics.** Scores are MuseScore `.mscx` files named `lc<id>.mscx`; the README gives a batch command to convert them to MusicXML (`.mxl`), PDF or MIDI [30]. Each song also has a `.txt` file of lyrics "as automatically extracted" from the score, which is where lyric script would show [30]. Scripts are not recorded in what I read.
- **Terms and access.** CC0; the authors ask for credit and a link, and for citation for academic use [30]. Bulk access is by cloning the mirror or from the Zenodo release (DOI 10.5281/zenodo.15450143, cited in the README); there is no API [30].
- **Citation.** Gotham, M. R. H. and Jonas, P. (2022). "The OpenScore Lieder Corpus." *Music Encoding Conference Proceedings 2021*, pp. 131 to 136. doi:10.17613/1my2-dm23 [30].

### PDMX and MuseScore.com

PDMX: Long, P., Novack, Z., Berg-Kirkpatrick, T. and McAuley, J. (2025). "PDMX: A Large-Scale Public Domain MusicXML Dataset for Symbolic Music Processing." ICASSP 2025; arXiv:2409.10831. It holds "over 250K public domain MusicXML scores" collected from MuseScore, with tag and user-interaction metadata [32]. Read in part (abstract level). NOT ESTABLISHED: whether lyrics are included, the dataset's own licence text, and how many Russian songs it holds. I did not read MuseScore.com's terms. Search results show MuseScore pages for Tchaikovsky's Romances Op. 21 and Glinka's "Romances and Songs" uploaded by users (snippet only), with unknown licence and lyric script [36].

### IMSLP

IMSLP accepts compressed MusicXML (`.mxl`) and MuseScore (`.mscz`) files; other source files (`.sib`, `.mus`, `.ly`) only inside a single ZIP, with a PDF of the same work uploaded separately [33]. Read in part. NOT ESTABLISHED: whether any Russian song carries such a file, and under what terms. The page you would look at per work is the work's IMSLP page.

### Mutopia

I queried Mutopia's keyword search for each composer [34]. For Glinka, Borodin and Dargomyzhsky: "Sorry, no matches were found" [34]. For Tchaikovsky: three pieces, all for piano. For Mussorgsky: *Pictures at an Exhibition* (piano). For Rimsky-Korsakov: four piano pieces. For Rachmaninoff: ten piano pieces on the first page (the page had a "Next" link, and I did not page through). For Cui: the one hit was a madrigal by Philippe de Monte, a false match [34]. The listings show LilyPond (`.ly`), MIDI and PDF files, and a Creative Commons Attribution-ShareAlike 4.0 licence on the Rachmaninoff items [34]. No Russian song with Cyrillic lyrics appeared.

### Not reached

KernScores, CPDL, Wikimedia Commons and Wikisource scores, the Tchaikovsky Research site, Russian-language score libraries with symbolic files, and MIDI collections with a vocal track: NOT ESTABLISHED. I ran one search for free MusicXML, MuseScore or LilyPond scores of Russian art songs; it returned Wikipedia pages, IMSLP pages and a list of MusicXML sites (snippets only) [36]. I did not follow them.

### What this means for Ilya (section D)

INFERENCE: matching a scan to an existing open encoding looks unlikely to help for this repertoire. Where I looked and could count, the open corpora hold no Russian art songs by the eight composers: OpenScore Lieder has none, and Mutopia has only piano music. The largest remaining unknown is user-uploaded MuseScore.com content, which is large but of uncertain licence, and for which I found no count.

---

## E. Anything that already does this job for Russian

I found no tool, paper, thesis or project that reads the words of Russian vocal scores, or that aligns a known Russian poem to a scanned score.

What I searched, in English and Russian:

- English: Tesseract and pre-reform Russian models; "OCR lyrics sheet music Russian Cyrillic vocal score lyrics optical music recognition text underlay alignment poem"; historical Russian print and vision-language models.
- Russian: "распознавание текста дореформенной орфографии Tesseract модель ѣ"; "распознавание нот вокальная партитура распознавание текста под нотами русский романс оптическое распознавание музыки"; "исправление ошибок OCR дореформенный текст словарь ѣ".

What turned up, and what it is:

- Fuentes-Martínez, E., Ríos-Vila, A., Martinez-Sevilla, J. C., Rizo, D. and Calvo-Zaragoza, J. (2024). "Aligned Music Notation and Lyrics Transcription." arXiv:2412.04217. It defines a task of transcribing vocal scores with notes, lyrics and their alignment, and evaluates it on four Gregorian chant datasets [35]. Read in part (abstract). No Cyrillic.
- A paper called "Lyric extraction and recognition on digital images of early music sources" (ISMIR 2009) appeared in search results; I did not read it [36].
- Russian results were mostly consumer note-recognition apps, an article page on Finale and OMR at notovodstvo.ru, and a GitHub project `Dene33/notes-recognition`; snippets only, and none concerned reading lyrics [36].

### What this means for Ilya (section E)

INFERENCE: this is open ground. The nearest published work, on chant, treats lyric transcription and notation as one aligned task, and none of the Russian-language results I saw addresses it. Your own measurements (47% on whole-page OCR, 10 of 12 syllables when cropped one at a time) are probably the only data on the subject, so keep them in the project record.

---

## What could not be established

1. The `orus` training-set size, test-set composition, commit dates and date of the model. The GitHub tree and commit pages are disallowed to my tool, and the README is silent [1][2].
2. Any measurement of any model on lyric lines of a nineteenth-century Russian music engraving. None found.
3. Whether the PP-OCRv5 Cyrillic model emits ѣ, ѳ or ѵ in practice. Only its dictionary was inspected [16][17]. A quick test through RapidOCR would settle it.
4. Whether tesseract.js 7.0.0 loads `orus.traineddata` (version entry "5.5.0") and how it handles per-character confidence for that model.
5. Apple Vision and Azure (not read or not searched); Google Books, HathiTrust, Russian State Library, National Library of Russia, Prozhito, the digital Tolstoy edition (not reached); ABBYY's desktop-product language list.
6. Whether Transkribus models can be downloaded, and whether "Russian generic handwritten and typed 1" includes nineteenth-century print [10].
7. Licences and methods of Славеница and prereform_to_contemporary; any published lexicon-based correction of pre-reform OCR (the one candidate article was behind a CAPTCHA); any list of ѣ roots.
8. Russian Wikisource pre-reform pages and the Russian National Corpus pre-reform subcorpus: the first refused by my tool, the second not read.
9. Russian content in PDMX and on MuseScore.com, and MuseScore's terms; IMSLP engraving files for Russian songs; KernScores, CPDL, Wikimedia Commons, Tchaikovsky Research, Russian symbolic score libraries, and MIDI collections.
10. Licences of transformers.js and `ocrs` (not read); core download sizes for tesseract.js.
11. The Mutopia search is keyword-based, so a Russian song entered under a transliterated title could be missed; the Rachmaninoff listing had a second page I did not read.

---

## Sources

How each was read: **full** (whole text read), **part** (partial or tool-summarised), **file** (downloaded and parsed by script), **snippet** (search result only).

1. AButon-8, `iskra_ocr` README. https://raw.githubusercontent.com/AButon-8/iskra_ocr/main/README.md (fetched by curl). **Full.**
2. AButon-8, `iskra_ocr` repository front page. https://github.com/AButon-8/iskra_ocr . **Part** (WebFetch). `/commits/main` and `/tree/main/data/ground-truth` refused (robots.txt).
3. `orus.traineddata` and `LICENSE`. https://raw.githubusercontent.com/AButon-8/iskra_ocr/main/orus.traineddata and https://raw.githubusercontent.com/AButon-8/iskra_ocr/main/LICENSE . **File** (model downloaded, 11,786,045 bytes, container and LSTM unicharset parsed by script; licence file read in its first lines, **part**). No OCR engine installed or run.
4. Tesseract `langdata_lstm` issue 3, "Is it possible to add few pre-1918 Russian characters to RUS language files?" https://github.com/tesseract-ocr/langdata_lstm/issues/3 . **Part** (WebFetch).
5. Tesseract `tessdata_best` issue 24, "old russian / church slavonic glyphs?" https://github.com/tesseract-ocr/tessdata_best/issues/24 . **Part** (WebFetch).
6. Zenodo API, `ocr_models` community queries ("Russian", "Cyrillic", "Russian print", "Church Slavonic", "pre-reform"). https://zenodo.org/api/records?communities=ocr_models . **File** (result lists read in full). Records: Generic HTR model for Old Cyrillic uncial and semi-uncial script styles, https://zenodo.org/records/7755483 (listing only).
7. PP-OCRv6 (small) multilingual handwritten and printed text recognition model, Zenodo record 21788405, 2026-08-04, Apache-2.0. https://zenodo.org/records/21788405 . **Part** (API JSON; Russian rows, metrics table, licence and file list read; 13,065,380-byte `small.safetensors`).
8. Multilingual Party model for European languages, Zenodo record 15764161, 2025-06-28, Apache-2.0. https://zenodo.org/records/15764161 . **Part** (API JSON).
9. HTR-United catalogue. https://raw.githubusercontent.com/htr-united/htr-united/master/htr-united.yml . **File** (389,311 bytes, 138 entries parsed and searched).
10. Transkribus public text models list. https://transkribus.eu/TrpServer/rest/models/text . **File** (267,094 bytes, 410 models parsed and filtered).
11. READ-COOP, "5 AI Models For Transcribing Old Russian Handwriting And Printed Russian Texts." https://blog.transkribus.org/en/5-ai-models-for-transcribing-old-russian-handwriting-and-printed-russian-texts . **Part** (WebFetch; the fetch answer says the article describes four models).
12. ABBYY, "Russian old spelling and Russian with accents marking stress position predefined languages in FineReader Engine." https://support.abbyy.com/hc/en-us/articles/360012249179-Russian-old-spelling-and-Russian-with-accents-marking-stress-position-predefined-languages-in-FineReader-Engine . **Part** (WebFetch).
13. Google Cloud, Cloud Vision "Supported languages." https://docs.cloud.google.com/vision/docs/languages . **Part** (WebFetch).
14. Levchenko, M. (2025). "Evaluating LLMs for Historical Document OCR: A Methodological Framework for Digital Humanities." First Workshop on Natural Language Processing and Language Models for Digital Humanities (LM4DH 2025), RANLP 2025; arXiv:2510.06743. https://arxiv.org/abs/2510.06743 and https://arxiv.org/html/2510.06743v1 . **Part** (WebFetch of both). Workshop PDF address seen in search results only: https://acl-bg.org/proceedings/2025/LM4DH%202025/pdf/2025.lm4dh-1.7.pdf .
15. Vesalainen, A., Mäkelä, E., Ruotsalainen, L. and Tolonen, M. (2026). "Error Patterns in Historical OCR: A Comparative Analysis of TrOCR and a Vision-Language Model." arXiv:2602.14524. https://arxiv.org/abs/2602.14524 . **Part** (WebFetch). Not relevant (English).
16. PaddleOCR dictionaries: https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/main/ppocr/utils/dict/ppocrv5_cyrillic_dict.txt , `.../ppocrv5_eslav_dict.txt` , `.../cyrillic_dict.txt` , `.../ru_dict.txt` . **File** (downloaded and checked for ѣ, і, ѳ, ѵ, ъ).
17. PaddlePaddle, `cyrillic_PP-OCRv5_mobile_rec`, Hugging Face model card, `inference.yml` and file list. https://huggingface.co/PaddlePaddle/cyrillic_PP-OCRv5_mobile_rec . **Part** (card read in part; config parsed, 850-entry dictionary; file sizes from the Hugging Face API).
18. PaddlePaddle, `eslav_PP-OCRv5_mobile_rec`, Hugging Face model card and config. https://huggingface.co/PaddlePaddle/eslav_PP-OCRv5_mobile_rec . **Part**.
19. RapidAI, RapidOCR README and `default_models.yaml` (v3.9.2). https://raw.githubusercontent.com/RapidAI/RapidOCR/main/README.md and https://raw.githubusercontent.com/RapidAI/RapidOCR/main/python/rapidocr/default_models.yaml . **Part** (README read by keyword search; model list read by keyword search). ONNX file https://www.modelscope.cn/models/RapidAI/RapidOCR/resolve/v3.9.2/onnx/PP-OCRv5/rec/cyrillic_PP-OCRv5_rec_mobile.onnx downloaded (8,074,092 bytes), size only.
20. jymen, `homr-web` README. https://raw.githubusercontent.com/jymen/homr-web/main/README.md . **Part** (read by keyword search for OCR, size, speed, licence).
21. tesseract.js `package.json` and `docs/local-installation.md`. https://raw.githubusercontent.com/naptha/tesseract.js/master/package.json and https://raw.githubusercontent.com/naptha/tesseract.js/master/docs/local-installation.md . **Part**.
22. EasyOCR `config.py` and `LICENSE`. https://raw.githubusercontent.com/JaidedAI/EasyOCR/master/easyocr/config.py . **Part** (the `cyrillic_g2` character string read; licence header Apache 2.0).
23. docTR `vocabs.py`. https://raw.githubusercontent.com/mindee/doctr/main/doctr/datasets/vocabs.py . **Part** (Cyrillic vocabularies; licence header Apache 2.0).
24. Datalab, Surya README. https://raw.githubusercontent.com/datalab-to/surya/master/README.md . **Part** (licence and Russian benchmark lines).
25. robertknight, `ocrs` README. https://raw.githubusercontent.com/robertknight/ocrs/main/README.md . **Part**.
26. Hugging Face, transformers.js README. https://raw.githubusercontent.com/huggingface/transformers.js/main/README.md . **Part** (TrOCR and image-to-text entries; licence is a badge, not read). TrOCR: Li, M. et al. (2021), arXiv:2109.10282, as cited in that README.
27. dhhse, `prereform2modern`. https://github.com/dhhse/prereform2modern . **Part** (WebFetch; the raw README path I tried returned 404).
28. shelari (Elena Sidorova), `prereform_to_contemporary` README. https://raw.githubusercontent.com/shelari/prereform_to_contemporary/master/README.md . **Full** (1,159 bytes).
29. nevmenandr, `russian-old-orthography-ocr`, Hugging Face dataset card. https://huggingface.co/datasets/nevmenandr/russian-old-orthography-ocr (README fetched from `/raw/main/README.md`). **Full** (2,939 bytes).
30. OpenScore, `Lieder` README. https://raw.githubusercontent.com/OpenScore/Lieder/main/README.md . **Full** (9,046 bytes). Corpus report cited there: Gotham and Jonas (2022), doi:10.17613/1my2-dm23. Zenodo release: https://doi.org/10.5281/zenodo.15450143 (cited in the README, not opened).
31. OpenScore Lieder `data/corpus_conversion.json`. https://raw.githubusercontent.com/OpenScore/Lieder/main/data/corpus_conversion.json . **File** (288,812 bytes; 1,356 entries and 107 composer directories counted; all composer names read).
32. Long, P., Novack, Z., Berg-Kirkpatrick, T. and McAuley, J. (2025). "PDMX: A Large-Scale Public Domain MusicXML Dataset for Symbolic Music Processing." ICASSP 2025; arXiv:2409.10831. https://arxiv.org/abs/2409.10831 . **Part** (WebFetch).
33. IMSLP, "File formats." https://imslp.org/wiki/IMSLP:File_formats . **Part** (WebFetch).
34. Mutopia Project keyword search results for Tchaikovsky, Mussorgsky, Rachmaninoff, Glinka, Rimsky, Borodin, Dargomyzhsky, Cui. https://www.mutopiaproject.org/cgibin/make-table.cgi?searchingfor=<name> . **File** (pages downloaded and parsed; first page only).
35. Fuentes-Martínez, E., Ríos-Vila, A., Martinez-Sevilla, J. C., Rizo, D. and Calvo-Zaragoza, J. (2024). "Aligned Music Notation and Lyrics Transcription." arXiv:2412.04217. https://arxiv.org/abs/2412.04217 . **Part** (WebFetch, abstract).
36. Search-result snippets and refused or unreadable pages, none of them a reading: `tessdata_contrib` front page (https://github.com/tesseract-ocr/tessdata_contrib, **part**, WebFetch); Славеница https://slavenica.com/v2 ; lingvoforum.net service thread https://lingvoforum.net/index.php?topic=14530.0 ; Slavic Cataloging Manual cheat sheet https://sites.google.com/site/seesscm/pre-reform-russian-orthography-cheat-sheet ; Cyberleninka article https://cyberleninka.ru/article/n/klassifikatsiya-oshibok-raspoznavaniya-simvolov-pechatnyh-izdaniy-v-starinnoy-orfografii (**blocked**, CAPTCHA); ru.wikisource.org "Викитека:Дореформенная орфография" (**blocked**, "cache-only"); Russian National Corpus https://ruscorpora.ru/corpus/main ; MuseScore user pages (Tchaikovsky Op. 21, Glinka romances); MusicXML sites list https://www.musicxml.com/music-in-musicxml/ ; ISMIR 2009 lyric-extraction paper https://archives.ismir.net/ismir2009/paper/000031.pdf ; notovodstvo.ru OMR page http://www.notovodstvo.ru/library/omr/ ; https://github.com/Dene33/notes-recognition .
37. Andrés Cruz, post on fine-tuning Tesseract, linked from the `orus` README. https://andrescruz.org/posts/finetuning-tess/index.html . **Not read**: returned 404.
