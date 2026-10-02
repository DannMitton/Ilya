# Memo: Soundslice, PhotoScore, SmartScore, and OCR for pre-reform Russian (Sonnet subagent, 2026-10-01)

**Provenance.** Returned by a Sonnet subagent spawned by the desk (Fable) at about 15:47 on 2026-10-01, on Dann's instruction to look with fresh eyes. The agent was given the questions and none of the project's earlier conclusions. Saved here verbatim. **The desk has NOT opened these pages itself, except the three it fetched at 15:42 (Neuratron's language list, Soundslice's scanner page, and Soundslice's 2023 lyrics post). Every other READ below is the agent's reading. Vendor statements are claims, not measurements.** Cost: 195,158 tokens, 57 tool uses, 3.9 minutes.

---

Research only; nothing was changed. All pages were opened this session on 2026-10-01. Dates are as printed on the page, or "undated" where the page shows none.

## Part A. Soundslice

**A1. How it reads lyrics.** READ. Soundslice states it trained its ML "specifically to detect lyric syllables and run OCR (optical character recognition) on the individual letters", and took "extra care" to preserve hyphens and "should do the right thing" for extenders (Jan 5, 2023): https://www.soundslice.com/blog/233/lyrics-support-in-pdf-scanner/. Since Feb 5, 2026 it states it uses "custom OCR models for lyrics in 20 languages", chosen by the user at upload: https://www.soundslice.com/blog/304/better-lyrics-language-support-in-scans/. Which element is detected first is NOT ESTABLISHED. The wording suggests syllable-level detection followed by per-letter OCR; that is INFERRED.

**A2. Languages.** READ. The Feb 5, 2026 post lists Russian and Ukrainian among 20 (Arabic, Chinese, Greek, Hebrew, Japanese, Korean and others) and says OCR then uses "language-specific glyphs and diacritics". The scanner page says "over 20 languages, including those using non-Latin scripts" (undated; its footer lists Sept. 25, 2026 posts): https://www.soundslice.com/sheet-music-scanner/. The help page "Supported notations" (undated) still says lyrics work for "other languages with Latin characters": https://www.soundslice.com/help/en/creating/pdf-import/294/supported-notations/. That page is stale or contradictory. Pre-1918 spelling, ѣ, і and ъ are named nowhere.

**A3. Attachment and correction.** Syllable-to-note attachment in scans is NOT ESTABLISHED. In the editor, lyrics are one syllable per note. An extender is added automatically only if the next note has no lyric and the two notes are slurred (undated): https://www.soundslice.com/help/en/creating/notations/91/lyrics/. Correction is by editing in the notation editor beside the original image: https://www.soundslice.com/help/en/creating/pdf-import/346/editing-scans/. Import settings let you declare lyrics above or below the staff (default below) and re-process non-destructively: https://www.soundslice.com/help/en/creating/pdf-import/307/importer-settings/ and https://www.soundslice.com/blog/256/improvements-to-pdf-image-importer-sept-21/ (Sept 21, 2023). The system also asks review questions about uncertain items, and (Jan 26, 2023) groups the text-based ones so you click only the wrong ones: https://www.soundslice.com/blog/237/smart-grouping-of-music-scanning-questions/.

**A4. Other text.** READ, from the supported-notations page above. "Text" is "No": directions, section names and expressions are not imported (fingerings and chord names are). "Title" is "No": title, composer and lyricist are not detected. Tempo markings and "commonly used" dynamics are detected. Tempo detection dates from Feb 13, 2025: https://www.soundslice.com/blog/286/new-features-feb-13/.

**A5. Stated limits.**
- Typeset music works best; handwriting is "maybe". One page per image. Straight and good resolution preferred: https://www.soundslice.com/help/en/creating/pdf-import/343/starting-the-import/.
- Auto slant correction (Oct 2, 2025): https://www.soundslice.com/blog/296/automatic-slant-correction-in-pdf-image-scans/.
- Cross-staff piano handling was fixed (Mar 21, 2024): https://www.soundslice.com/blog/267/improvements-to-pdf-image-scanning/.
- Soundslice states "possibly the most common challenge" is an instrument entering mid-piece, as in piano-and-vocal music where the voice enters a few bars in. It now asks the user which staff is which (Aug 13, 2026): https://www.soundslice.com/blog/311/sheet-music-scan-improvements/.
- Old engravings and multi-staff system detection limits: NOT ESTABLISHED.

## Part B. Neuratron and Musitek

**B1. Lyric recognition.** READ. Neuratron's marketing page says it "Reads text (lyrics, title etc) in 120 different languages" (undated): https://www.neuratron.com/photoscore.htm. Its language-download page lists Russian, Ukrainian, Belorussian and Bulgarian, for v5.0.0+ (undated): https://www.neuratron.com/idrslanguages.htm. The v6 User Guide (copyright 1995-2009, on a third-party host, so it may be outdated) says text is guessed as title, lyrics or technique. The chosen language alters reading by expecting language-specific characters and word features, and 300 dpi is optimum. Text is auto-attached to the nearest note, with a visible attachment line: https://docshare04.docshare.tips/files/25522/255222434.pdf. The OCR engine is credited to I.R.I.S. in that guide. For SmartScore, Musitek's help (last updated 07/30/2024) says lyrics are "divided into syllable blocks" and SmartScore "automatically attaches" each to a note. Lyrics show blue and other text black: https://www.musitek.com/smartscore-online-help/songbook/modes/lyric_text.php and https://www.musitek.com/smartscore-online-help/professional/troubleshooting/recognition_results.php. Musitek claims "up to 99+% accuracy" for "notation, lyrics and text" (undated): https://www.musitek.com/smartscore64-pro.html. A SmartScore language list is NOT ESTABLISHED.

**B2. Independent review.** READ. The Scoring Notes review of Jan 16, 2021 is qualitative only. It says lyrics are "most often successfully read correctly" (with "m" read as "rn") and that PhotoScore's lyrics were "not 100% accurate, but largely complete". It does not measure lyric accuracy: https://www.scoringnotes.com/reviews/a-review-of-optical-music-recognition-software/. The Dec 14, 2024 review states it limited its focus "primarily to music, and not to text like lyrics", so it gives no lyric measurements: https://www.scoringnotes.com/reviews/scanning-the-current-omr-landscape/.

## Part C. Pre-reform print

**C1. Models.**
- **orus** (Tesseract LSTM, repo undated): https://github.com/AButon-8/iskra_ocr. Apache 2.0, fine-tuned on the newspaper Iskra (1900-1905). The README reports test word accuracy 94.0% and micro-CER 1.30%, against 61.2% and 9.45% for stock `rus`. Test-set size is not given. I downloaded `orus.traineddata` and inspected its unicharset (READ): 133 symbols, with ѣ, і and ъ present and ѳ and ѵ absent. It was trained on newspaper text, not music.
- **Stock Tesseract:** the old letters are missing from the Cyrillic unicharset, so ground truth is needed: https://github.com/tesseract-ocr/tessdata_best/issues/24 and https://github.com/tesseract-ocr/langdata_lstm/issues/3 (both undated). A `rus_old` model was proposed there.
- **Transkribus public models** (Jan 25, 2023): https://blog.transkribus.org/en/5-ai-models-for-transcribing-old-russian-handwriting-and-printed-russian-texts. The only print model is 18th-century (CER 0.6%). The 1911-13 handwriting model is described as "ideal for using with pre-form Cyrillic documents" (CER 4.4%).
- **Church Slavonic:** https://github.com/slavonic/church-slavonic-ocr is a Tesseract `cu` model whose model card has unfilled metric placeholders. The Kraken model (https://zenodo.org/records/7755483, cc-by-2.0) covers 11th-16th c. script.
- A 19th-century Russian civil-type Kraken or Transkribus model was not found.

**C2. Conversion rules.** READ. The decree "О введении новой орфографии" of 10 Oct 1918 lists 11 rules: https://ru.wikisource.org/wiki/Декрет_о_введении_новой_орфографии. They cover ѣ→е, ѳ→ф, final ъ dropped, і→и, з/с prefixes, -аго/-яго→-ого/-его, and -ыя/-ія→-ые/-ие. They also give word-specific rules for она, однѣ, and ея→ее. The decree has no ѵ rule. SEES's cheat sheet (rev. Oct 8, 2015) adds ѵ→и and flags exceptions: https://sites.google.com/site/seesscm/pre-reform-russian-orthography-cheat-sheet.

## Ideas worth borrowing
- Let the user declare the lyric language, and expose the pre-1918 option as part of it (A2).
- Detect syllable boxes first, then OCR within them, and keep the hyphens (A1).
- Add an upload toggle for whether lyrics sit above or below the staff, with non-destructive re-run (A3).
- Show the source image next to the result, and ask review questions only for uncertain syllables, grouped (A3).
- Ask which staff is the voice when it enters late, since Soundslice calls this its most common problem (A5).
- Start from `orus` (Apache 2.0) and fine-tune it for ѳ, ѵ and music-page text (C1).
- Normalise ѣ, і, final ъ and the -аго/-яго endings with the 1918 rule list, as a separate step from reading (C2).

## Could not establish
- A1: which element is detected first, and how scanned hyphens and extenders are processed.
- A3: how a scanned syllable gets tied to a note.
- A5: old engravings, and multi-staff system detection limits.
- B1: any SmartScore language list, and how either product separates lyrics from other text beyond the manual's "guesses its type".
- B1: PhotoScore's current manual (only v6, about 2009, was reachable).
- B2: any measured lyric accuracy figure.
- C1: any 19th-century Russian civil-type model for Kraken or Transkribus. I checked only a few catalogues, so this is not proof of absence.
- C1: orus test-set size and training-data size; the repo date.
- C1: any in-browser pre-reform model.
