# Memo: the words from a scan, blue sky then narrowed (Fable, r1, 2026-11-02)

Brief: `brief-fable-blue-sky-reader_r1_2026-11-02.md`. Tree `/root/shane`, branch `Shane` at `ce5dc96`. Read only; nothing in any tree changed. Amendment of 09:17 applied: pass 3 ranks by expected gain toward 9 of 10 and by the strength of the evidence, not by gain per cost. Every file and line below was read this session; every outside figure names its source. Where I infer, I say so. Terms I coined: "syllable DAWG", "self-ensemble", "word-shape seating", "the clean-print question". Terms I adopted: the desk's stage names (letter recognition, token splitting, row cutting, unattributed), "witness", "free note", "sewn word".

## 0. Three findings that reshape the problem

Before the ideas, three things in the records that I think the desk has not yet put together.

**F1. The word list did not fail; the unit was wrong.** Row 105 r3 built a word DAWG of 940,721 whole words into the traineddata and lost 102 syllables: letter recognition improved (198 to 172) while token splitting worsened (291 to 419) (`report-code-row105-next-model_r1_2026-10-27.md:22, :67-74`), and r5 then ruled "No word list. Do not build it" (`brief-code-row105-next-model_r5_2026-10-29.md:23`). But a lyric row is not made of words. It is made of syllables separated by hyphens and spaces («чест- ву», «мо- жет»), so a whole-word DAWG tells the decoder that «честву» is a word and «чест-» is not, and it glues what the print splits. The +26 on letters is the real signal: the decoder listens to the dictionary. The fix is to build the DAWG from syllables (each dictionary word cut by the engine's `cut`, the same `Seams.cut` the app already uses at `underlay-page.ts:81, :203`), with and without a trailing hyphen, plus whole monosyllables and clitics. This is the clitics lesson in another coat: a rule that is right for text was applied to underlay. No retrain, no new model: `combine_tessdata` with a new `lstm-word-dawg`.

**F2. The reader is unstable, and nobody is averaging it.** A one-pixel vertical shift of the crops moves the nine photocopies by +6 and +19 of 1,249 and single songs by 10 or 11 (`report-desk-row117-image-cleaning_r1_2026-10-27.md`, "Vertical sensitivity"; the frame module records the 1 px finding at `underlay-frame.ts` header). r2's own checkpoints spread by 41 syllables (`brief-code-row105-next-model_r5_2026-10-29.md:9`). Variance of that size is exactly what an ensemble removes. Reading each row three to five times (shift 0 and ±1 px, ink height 30/32/34) and voting per box is the cheapest ensemble there is: one model, no new bytes, three to five times the read time. "Two readers voting" (186 recoverable) was measured with two different models; a self-ensemble was not.

**F3. The clean-print question.** The gate is row 114, the 1967 Mussorgsky collection, Dann's own scans (`QUEUE.md:60`). I could not find in the tree whether that print is pre-reform or modern orthography, or whether it is a photocopy (NOT ESTABLISHED; `brief-truth-heldout3_r1_2026-10-11.md:22` asks only that the text be Cyrillic). Inference, marked as such: a 1967 Soviet edition is almost surely re-engraved in modern orthography on clean paper. If so, the pre-reform letters and the photocopy damage that dominate the build set's losses (songs P, B06, B10, B07, U6) are not the gate's problem at all, and the gate's problem is clean modern print, where the build set's nearest analogues already read 90 to 96 percent before seating (S 102/109, T 176/200, K 119/131, M 48/53, U1 92/97: `report-code-row105-next-model_r2_2026-10-29.md`, "Per-song read right"). The gap on clean print would then be seating and splitting, not letters. This is one question for Dann (what the sealed pages look like) and one cheap measure (section 3, M0). It changes the ranking of everything below, so I rank twice where it matters.

## 1. Blue sky

Numbered for reference. One or two sentences each. "Gain" figures here are guesses unless a source is named.

### The reader's letters

1. **A syllable DAWG in r2's traineddata** (F1). Build `lstm-word-dawg` from syllables cut by the engine, not from words; keep r2's weights. Acts on the 198 one-to-one wrong-letter syllables and should not repeat r3's splitting loss.
2. **Self-ensemble at read time** (F2). Read each framed row at three to five small perturbations (±1 px vertical, ink height 30/32/34, closing on and off) and vote per aligned box; ties go to the dictionary. One model, no bytes.
3. **PP-OCRv6 Cyrillic as a second reader or the reader.** Metrika Labs, Apache 2.0, ONNX; the tiny model is 2,497,057 bytes, the medium 62,762,162 bytes; its character set (`rec_keys.txt`, 850 lines) holds ѣ і ѳ ѵ ъ ё in both cases; trained on 7.5 million printed and handwritten examples, real scans and synthetic, about 80 percent Russian (Hugging Face API and the repository README, read this session). Whether it reads pre-reform glyphs well, or reads underlay at all, is NOT ESTABLISHED. It runs through onnxruntime-web; nothing fetched at run time.
4. **`orus` as a drop-in Tesseract model.** 11,786,045 bytes (float, by size), Apache 2.0, unicharset holds ѣ і ъ ё and not ѳ ѵ, no word DAWG, fine-tuned from `rus` on 5,171 real word crops from *Iskra* 1900 to 1905 (I parsed the traineddata and the ground-truth zip in the cloned repository). Zero code: swap `UNDERLAY_LANG` (`underlay-recognize.ts:31`). Likely weaker than r2 on underlay (word crops of newspaper type, not hyphenated syllables under staves), but it costs one afternoon to know.
5. **Fine-tune on real underlay rows, not synthetic.** r3 and r5 learned the synthetic rows (held-out synthetic CER fell from 6.58 to 4.73) while the songs did not move (`report-code-row105-next-model_r2_2026-10-29.md`, "Answer first"). The dropped step 3b of row 82 (real pre-1918 IMSLP underlay rows, teacher-labelled) was never run because IMSLP's download page needs a browser (`QUEUE.md:126`). `orus` reached 1.30 percent CER from 5,171 real crops. Real rows are the lever not yet pulled.
6. **Two architectures voting.** r2 (Tesseract LSTM) and PP-OCRv6 (SVTR-style CTC) make different errors; where they disagree, the dictionary and the note count arbitrate. The two-reader measure found 186 recoverable syllables with TrOCR as the second reader.
7. **Lattice decoding instead of a confusion table.** Tesseract emits per-symbol alternatives in hOCR when `lstm_choice_mode` is set; tesseract.js exposes `hocr` (its `dump.js`, read this session; whether its `blocks` JSON carries `choices` is NOT ESTABLISHED). Choose among the alternatives by three independent witnesses at once: the dictionary, the syllable shape (one vowel), and the free-note count of the span. This is the "second look" with an independent target, which the Opus review said the confusion table lacked (`review-opus-brief-second-look_r1_2026-10-29.md`, "Lead finding").
8. **Re-read low-confidence tokens alone.** Tesseract's `tsv` gives a confidence per word; re-read a token under a threshold as a single word (PSM 8) at a larger ink height. Cheap, targeted, and the frame module already exists.
9. **Distil a teacher into r6.** Run TrOCR `ru-trocr-1700s` and PP-OCRv6 medium offline on the Mac over thousands of real IMSLP rows; keep rows where the two agree and the dictionary passes; train. This is idea 5 with labels from machines rather than hands.
10. **Synthetic underlay that looks like underlay.** Render hyphenated syllables at underlay spacing under stems, beams, and slurs that intrude. Two null results say plain synthetic does not transfer; I list this to say I would not run it again.

### The image

11. **Remove the music's ink from the lyric band before reading.** Stems, beam ends, slur tails, and bar lines cross into the band; 21 of the token-splitting losses are a stray glyph at the start of a row (E1, `report-desk-n135-token-splitting_r1_2026-10-28.md`, "Sub-splits"). homr knows the staff geometry; a connected component that touches the staff or runs vertically through the band is not a letter.
12. **Keep the greyscale.** Row 117 could not test thresholding because the crops arrived two-level (`report-desk-row117-image-cleaning_r1_2026-10-27.md`, "What the measure cannot tell"); whether `page-pdf.ts` or the scan binarised them is NOT ESTABLISHED. If Ilya binarises upstream, letting Tesseract see grey (it binarises itself, adaptively) is a one-line experiment on the photocopies.
13. **Choose the frame per row by the dictionary.** Read at ink height 28, 32, and 40; keep the reading whose sewn words the dictionary knows most. A self-selecting frame; the 32 was chosen on the photocopy median (`underlay-frame.ts` header, step 3).
14. **Recover the rows never read.** 74 syllables have no readable row and 53 sit in systems never captured (brief, "Where we stand"): 127 of 2,538, five percent, lost before any reader. A band fallback when `cutRows` finds nothing under a staff with notes.
15. **Exclude footnote staves by size.** U5 p1's editor's footnote was seated as song (`brief-n135-row-fallback_r3_2026-10-29.md:164`); a system whose staff space is far below the page median is not the song.

### The music as a witness

16. **Slur-aware free notes.** `voiceNotes` marks a note unfree only on `<tie type="stop">` (`underlay-prepare.ts:70`); `underExtender` is declared (`underlay-seat.ts:61`) and never set in `underlay-prepare.ts`. homr reads slur ends 91 of 92 on row 114 (`QUEUE.md:60`). A slur over two voice notes is a melisma: the second note takes no syllable. Fewer free notes means less room for the monotone seating to drift.
17. **Extender-aware free notes.** An extender token (`kindOf` returns `extender`, `underlay-seat.ts:99-105`) says the notes between it and the next syllable are sung on the previous vowel; today the seating ignores it.
18. **Word-shape seating.** `monotone` seats each token independently by x distance with free skips (`underlay-seat.ts:120-154`). But the print's hyphens are read: a token ending in a hyphen must be followed by the next token of the same word on the next free note. Seating words as rigid runs of k consecutive free notes, rather than k independent tokens, removes most of the drift that the Opus review found behind the 425 "split" losses (`review-opus-brief-syllable-breaks_r1_2026-10-29.md`, "Lead finding").
19. **The note count inside decoding.** The syllable-count witness had 55 percent precision as a flag (brief, "Witnesses"). As one term in a joint score with the dictionary and the lattice (idea 7) it needs no precision of its own.
20. **Verse metre and stress.** The dictionary knows stress; the bar knows strong beats; Russian song text is metrical verse. A read word whose stress falls on a weak beat where every neighbour's falls on a strong one is suspect. Low confidence; the composers set against the metre often enough to make this a weak witness.
21. **Repeats as a witness.** Composers repeat lines, and second verses sit under the same notes. Two readings of the same words at two places can vote.

### The dictionary and the language

22. **A frequency list to break ties.** 273 of 331 distance-1 candidates tie because `ru.txt` has no frequency (`report-desk-n135-lever2-measure_r1_2026-10-27.md`, Step 2). Sources to check for licence: OpenCorpora, Sharoff's lists, or a frequency table derived from `nevmenandr/russian-old-orthography-ocr` (MIT), which gives pre-reform spellings with counts in one pass.
23. **A pre-reform dictionary.** `ru.txt` has no ѣ і ѳ ѵ entries; 65 of 900 correct words were called unknown (same report). Harvest old-spelling forms from the nevmenandr corpus, or generate them by rule from the modern dictionary.
24. **A poetry language model.** Russian art song texts are published poems; a bigram model over public-domain 19th-century verse (Wikisource) is small and would arbitrate among candidates far better than a flat dictionary. Licence of the corpus to be checked; the model itself ships as a few hundred kilobytes.
25. **The poem as a witness** when the singer gives it (stage 3, ratified; `OPEN.md:2823`). Already designed; outside this memo's scope except to say it is the one witness with an independent target for every word.

### The singer

26. **Confidence-targeted correction.** Show the singer the few syllables the witnesses doubt, so that "fewer necessary corrections" (Dann 2026-10-29 16:12, quoted in `brief-n135-second-look_r1_2026-10-29.md:9`) is served even where the measure does not move. Does not raise 9 of 10; serves the goal behind it.

### Oversights of the clitics kind (what I would hunt)

27. **The word-list unit** (F1) is the first.
28. **The sort is on the wrong path.** The cause sort of 2026-10-28 runs on the harness's tokens before seating; the app's 425 "split" bucket is mostly alignment drift (Opus review). A per-syllable ledger on the app path (reader token, cut, seat, sew) does not exist and is the missing instrument.
29. **The gate's print** (F3). Everything measured is on the build songs; the gate is a 1967 print of unknown (to me) orthography and quality.
30. **Hyphen as a letter-class.** `splitTokens` cuts at any non-letter run between letters (`underlay-tokens.ts` header and `INTERNAL`); a publisher's low syllable mark read as a period («неза. глу.», brief) is cut the same way, which is right, but a hyphen inside a word («Люблю-ли», row 131) is also cut, and the reader may also drop a printed hyphen (A1 "same word", 32 syllables). Hyphen presence is treated as certain; it is a reading like any other and could carry a confidence.

## 2. Implementable in Ilya

Constraints: free and open source, in the browser, model a reasonable download, licences compatible, no outside service at run time, nothing written that the print does not carry.

| idea | fits | what it touches (read this session) | note |
|---|---|---|---|
| 1 syllable DAWG | yes | the traineddata under `/omr/models/underlay` (`underlay-recognize.ts:30-31`); no code | built offline with `combine_tessdata`; the engine's `cut` at build time |
| 2 self-ensemble | yes | `underlay-recognize.ts:60-76` (read each row n times), `underlay-frame.ts:374` (`frameRow` options for shift and ink height), a new vote module; `underlay-page.ts:155` unchanged | read time ×n; measure the time on the Mac first |
| 3 PP-OCRv6 | yes, licence Apache 2.0 | a new recogniser beside `underlay-recognize.ts` (onnxruntime-web, WebGPU or WASM); `WordBox` needs x positions, which CTC frame alignment gives approximately | tiny 2.5 MB is a reasonable download; medium 62.8 MB is Dann's call |
| 4 orus | yes | `UNDERLAY_LANG` (`underlay-recognize.ts:31`) | lacks ѳ ѵ; bake-off only |
| 5, 9 real-row fine-tune | yes | offline (Mac); ships a new traineddata | needs the IMSLP scans fetched by hand (Dann's call, `QUEUE.md:126`), or the build songs' own rows |
| 6 two readers voting | yes | a vote module over two `WordBox[]`; `underlay-page.ts:179-183` | depends on 3 |
| 7 lattice | yes | `underlay-recognize.ts:65` (`lstm_choice_mode`, `hocr: true`), an hOCR parser, a chooser using `Seams.isWord`, `Seams.cut`, and `freeNoteXs` (`underlay-counts.ts:40`) | the chooser never writes a letter the lattice does not offer, so §8 is kept |
| 8 re-read low confidence | yes | `underlay-recognize.ts` (`tsv: true`), `frameRow` on the token's crop | |
| 11 remove music ink | yes | `underlay-prepare.ts` (worker side), `underlay-rows.ts` | needs the staff geometry homr gives |
| 12 greyscale | yes if upstream binarises | `apps/web/src/lib/reader/page-pdf.ts` (not read; NOT ESTABLISHED) | |
| 13 frame by dictionary | yes | `underlay-recognize.ts`, `underlay-page.ts:191` (`rowLanguage` as the judge) | a variant of 2 |
| 14 band fallback | yes | `underlay-rows.ts:147` (`cutRows`), `underlay-prepare.ts:100` | |
| 15 footnote staves | yes | `underlay-prepare.ts` (staff space per system is already there, `SystemLayout.staffSpace`, `underlay-page.ts:62`) | |
| 16 slurs | yes | `underlay-prepare.ts:50-76` (`voiceNotes`: read `<slur type="start">`/`stop` and `<notations>`), `NotePlace.underExtender` or a new flag | homr must write slurs into the MusicXML it gives this path; NOT ESTABLISHED that it does |
| 17 extenders | yes | `underlay-seat.ts:156` (`seatTokens`), `underlay-page.ts:219` | |
| 18 word-shape seating | yes | `underlay-seat.ts:120-154` (`monotone`), new cost; `underlay-words.ts:101` (`sewWords`) unchanged | |
| 19 note count in decoding | yes | with 7 | |
| 20 metre | yes in principle | engine stress + MusicXML beats | weak witness; do not build first |
| 21 repeats | yes | `underlay-song.ts` (across pages) | gain small on through-composed songs |
| 22 frequency list | licence to check | `packages/` dictionary build (not read) and the witness | OpenCorpora is CC BY-SA; derive from the MIT corpus if that is cleaner |
| 23 pre-reform dictionary | yes | the dictionary build; `wordKnown` (`underlay-language.ts:46`) | |
| 24 poetry LM | licence to check | a new small model file; the chooser of 7 | |
| 26 correction UI | yes | Corrections slices (meta 5) | not this memo's measure |
| 10 synthetic underlay | fits, not recommended | | two null results |

Idea 25 is stage 3, designed. Ideas 27 to 30 are measures and rulings, not code.

## 3. Practical now, ranked by expected gain and strength of evidence

Measure first, in this order; then build in the order the measures earn. Worst-case token costs assume Sonnet for measures and Code for builds; Mac compute is free of tokens.

**M0. The clean-print question (do first, one day).** Ask Dann what row 114's pages look like (orthography, paper, photocopy or original). Then take the per-song exact-seat (b) numbers on the clean modern-orthography build songs (S, T, K, U1, and M for text) from the existing replay (`replay/out-real/`), to see where Ilya stands on the gate's kind of print without opening a sealed song. Justifies: if clean print is already near 9 of 10 before seating, ideas 16 to 18 outrank the letter ideas; if not, the letter ideas lead. Cost: 20,000 tokens. No build.

**R1. Idea 18 with 16 and 17, word-shape and music-aware seating.** Evidence: strong. The Opus review's own analysis puts most of the 425 (17 percent of all syllables) in alignment drift and missing syllables, not in merges (`review-opus-brief-syllable-breaks_r1_2026-10-29.md`, amendment 1); the seating cost is x distance alone with free skips (`underlay-seat.ts:120-154`); slurs are read at 91 of 92 and unused (`underlay-prepare.ts:70`). Expected gain: the largest single bucket, and the one that matters most on clean print. A guess at the number: 100 to 200 exact seats on the build songs. First measure: an oracle on the replay, seating the tokens as read with (a) rigid word runs, (b) slur and extender unfree notes, each alone and together, against 1,750; the harness's `score44`-style scorer exists. Justifies building at +60 on the 18 songs (above r2's spread of 41). Cost: measure 60,000 tokens; build 120,000.

**R2. Idea 1, the syllable DAWG.** Evidence: strong for the mechanism (r3's +26 letters, `report-code-row105-next-model_r1_2026-10-27.md:22`), and a clear reason for the loss that the fix removes. Expected gain: 20 to 40 letter-recognition syllables, no splitting loss; a guess. First measure: build the DAWG from the engine's cut of `ru.txt` plus the clitics, combine into r2 29,000, read the 18 framed rows on the Mac harness, compare 2,086 and the stage counts; also at a frequency DAWG off and on. Justifies shipping at +20 with token splitting not worse than 232, and the file under about 12 MB (Dann's call on bytes, `CONTRACT.md` §8). Cost: 40,000 tokens; no app code.

**R3. Idea 2, the self-ensemble.** Evidence: strong for variance (+6/+19 on 1,249 from 1 px; checkpoint spread 41), moderate for the gain (ensembles reduce variance; the magnitude on this reader is a guess, 30 to 80 on the 18). First measure: on the harness, read each framed row at shift −1/0/+1 px and ink height 30/32/34, vote per box by majority with the dictionary as tie-breaker, score once; also record read time per row. Justifies building at +40 and read time under about three times today's. Cost: measure 50,000; build 80,000.

**R4. Idea 3 with 6, PP-OCRv6 Cyrillic bake-off, then a two-reader vote.** Evidence: moderate. The model exists, is Apache 2.0, holds every pre-reform letter, is trained on millions of real examples, and is two orders of magnitude more recent than Tesseract's LSTM; whether it reads underlay is NOT ESTABLISHED. This is the one candidate that could move letters by a large step rather than tens, so it ranks above cheaper certainties by Dann's rule of 09:17. First measure: on the Mac, run tiny and medium through onnxruntime (Python) on the 589 framed crops, score with `score117.py` as letters, as sound, and old letters alone, against r2's 2,086; then score a vote of r2 and the better PP-OCR with dictionary arbitration. Justifies building at +80 alone or +60 as a voter, and tiny's 2.5 MB is a reasonable download; medium's 62.8 MB goes to Dann. Cost: measure 80,000; build 150,000 (a second recogniser, CTC x positions, a vote module).

**R5. Idea 5 with 9, fine-tune on real underlay.** Evidence: strong by elimination (two synthetic runs learned the synthetic and not the songs; `orus` reached 1.30 percent CER from 5,171 real crops), weak on the number. The strongest durable path for letters, and the slowest. Two sources: the 18 build songs' own truth rows (about 2,500 syllables; train on 14, test on 4, rotate), and IMSLP pre-1918 Russian vocal scores fetched by hand (Dann's call), labelled by r2 and TrOCR agreement plus dictionary, Dann proofing a sample. First measure: the rotation on the build songs alone, r2 continued for 2,000 iterations on 14 songs' real rows, scored on the 4 held out, four folds. Justifies a full run at a held-out gain above the fold's share of 41. Cost: measure 60,000 tokens plus Mac hours; full run 120,000 plus scan fetching.

**R6. Idea 7 with 19, lattice decoding.** Evidence: moderate; principled, the review's own prescription, but unmeasured and the hOCR alternatives' quality in tesseract.js is NOT ESTABLISHED. First measure: set `lstm_choice_mode=2`, dump hOCR for the 18 songs, count how many of the 198 wrong-letter syllables have the printed form among the alternatives (the oracle ceiling); if under 60, stop. Cost: measure 40,000; build 120,000.

**R7. Ideas 22 and 23, frequency and pre-reform dictionary.** Evidence: strong on the mechanism (273 ties, 65 correct words called unknown), small gain alone (lever 2b gained +4 exact); their value is as the arbiter inside R3, R4, and R6. Build them when any of those is built. Cost: 40,000, licence check included.

**R8. Idea 4, `orus` swap.** Evidence: weak (word crops, no ѳ ѵ). One afternoon on the harness, 15,000 tokens. Run it alongside R4's bake-off since the scorer is the same.

**R9. Ideas 11, 14, 15, the band and the music's ink.** Evidence: moderate (127 syllables never reach a reader; E1's 21 stray glyphs). Gain bounded at five percent and most of it on the photocopies. Measure after M0 says whether the gate's print has the problem. Cost: 50,000 each.

**R10. Idea 28, the per-syllable ledger on the app path.** Not a gain; the instrument every measure above needs. Build it first if the desk agrees the replay cannot already name, per printed syllable, the token, cut, seat, and sewn word. Cost: 50,000.

Order I would run: M0 and R10 in the same session; then R1's oracle and R2's DAWG side by side (one is seating, one is letters, they do not interact); then R3 and R4's measures together on the Mac; R5 starts the day Dann rules on the IMSLP fetch, because it runs for days and nothing else waits on it; R6 after R4 says which reader's lattice to use. Why this order: M0 decides which half of the problem the gate lives in; R1 and R2 are the two highest-evidence ideas and each is a week; R4 is the one that could jump; R5 is the durable floor.

## 4. NOT ESTABLISHED

- Row 114's orthography and scan quality.
- Whether homr's MusicXML on the scan path carries slurs (`voiceNotes` does not read them; whether they are there to read, not checked).
- Whether tesseract.js's `blocks` JSON carries per-symbol `choices`; hOCR with `lstm_choice_mode` is the standard Tesseract route, not verified in tesseract.js this session.
- Whether PP-OCRv6 Cyrillic reads pre-reform glyphs or hyphenated syllables; the dictionary holds the letters, the training mix does not say.
- `orus`'s float or integer form (inferred float from 11.8 MB); its base `rus` version.
- Whether `page-pdf.ts` binarises; I read only the row 117 report's note on it.
- Every gain figure in section 3 is a guess unless a source is named beside it.
- Licences of OpenCorpora and any poetry corpus for ideas 22 and 24.

## 5. Sources read this session

Tree: `docs/memory/SCHEDULE.md`, `QUEUE.md` rows 82, 103, 111, 114, 150, 158, `CONTRACT.md` §0.1 heading, `OPEN.md` stage 3 headings; `docs/sessions/memo-desk-b0-reader-review-reading_r1_2026-10-28.md`, `report-desk-n135-token-splitting_r1_2026-10-28.md`, `report-desk-row117-image-cleaning_r1_2026-10-27.md` (sections named above), `report-desk-n135-lever2-measure_r1_2026-10-27.md` (answer, step 2, limits), `report-code-row105-next-model_r1` and `_r2`, `brief-code-row105-next-model_r5` (lines 9, 23), `review-opus-brief-second-look_r1`, `review-opus-brief-syllable-breaks_r1`, `brief-n135-row-fallback_r3` (outline, line 164), `brief-n135-second-look_r1` (lines 7, 9, 40), `report-code-trocr-teacher_r1_2026-10-12.md` (answer), `memo-prereform-ocr-research_r1_2026-10-12.md` (head); `apps/web/src/lib/omr/underlay-recognize.ts`, `underlay-page.ts`, `underlay-seat.ts`, `underlay-clitics.ts` (header), `underlay-tokens.ts` (header), `underlay-language.ts`, `underlay-frame.ts` (header), `underlay-prepare.ts:37-76`, exports of the other `underlay-*.ts`.
Outside: `github.com/AButon-8/iskra_ocr` (cloned to `/home/claude/abuton-8/iskra_ocr`, traineddata and zips parsed), `huggingface.co/metrika-labs/PP-OCRv6_medium_rec_cyrillic_onnx` and `_tiny_` (API tree, `rec_keys.txt`), `github.com/metrika-labs/PP-OCRv6_rec_cyrillic` (README), tesseract.js `src/worker-script/utils/dump.js`.
