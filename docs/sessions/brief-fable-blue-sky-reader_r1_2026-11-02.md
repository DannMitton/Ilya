# Brief: Fable as partner on the scan reader's words, blue sky then narrowed (r1, 2026-11-02)

Dann asked for this himself (2026-11-02 09:14): "We're recruiting Fable as a smarter, more knowledgeable partner to streamline our efforts." You are not reviewing a brief. You are thinking with us. Read-only: change no file you keep, push nothing.

## The goal

Ilya (free, open-source, in the browser, for classical singers) takes a scan, PDF, or phone photo of a printed Russian art song and gives back the melody with the sung syllables seated under their notes, in IPA and in syllabified modern Cyrillic. Dann's release gate (ruled 2026-10-27, restated 2026-11-02 09:10): **the words from a scan reach 9 of 10 syllables, exactly right on the right note**, on the sealed set (QUEUE row 114: the 1967 Mussorgsky collection, songs 1 to 10), on the singer's path. The notes are already read at 95.7 of 100 on that set (homr, WebGPU, in the browser). The words are the gap.

## Where we stand (numbers are the desk's records; verify any you lean on)

- On the 18 build songs, through the app's page code (replay on stored captures, not row 114, not the singer's path): exact seats **1,750 of 2,385** truth syllable notes; goal 2,147. "Read right" 1,939 of 2,538 printed syllables.
- Of 2,538 printed syllables, 2,316 sit in the lyric row Ilya seats; so the loss is mostly the reader's letters, worst on photocopies (songs P, B06, B10, B07, U6); 74 have no readable row; 53 sit in systems never captured (song M pp. 1 to 2).
- Print features that bite: pre-reform orthography (ѣ, і, ѳ, ѵ, word-final ъ), syllables split by hyphens and long dashes under the notes, small type, italics, editors' footnotes read as song, a publisher's low syllable marks read as periods («неза. глу.»), proclitics and enclitics sharing a note (Dann's one-vowel-per-note rule, `CONTRACT.md` §0.1).
- A recent lesson Dann wants us to hunt for more of: a misunderstanding about clitics cost us, and was solved once the challenge was understood. He believes more such oversights remain.

## Tried

- Reader: Tesseract (tesseract.js 7) with our fine-tuned `rus_prereform` r2, float form on the SIMD core, about 2,086 of 2,538 with the row's frame; r3 and r5 retrains (synthetic photocopy-like lines, rotation, damage) gained nothing. RapidOCR rejected (no Cyrillic). A server reader (t-imap) did not reach 9 of 10 either. TrOCR `taiga75/ru-trocr-1700s` (1.3 GB, MIT) measured stronger than r2 on four songs as a teacher, not as the browser reader.
- Image: deskew plus 3x3 closing plus a framed row (ink height 32 px, 16 px paper-tone padding) +211 syllables; Sauvola does nothing (crops already two-level); the reader is sensitive to a 1 px vertical shift.
- Seating: monotone least-cost seating with surplus dropped; a hybrid that cuts multi-vowel tokens with the phonology engine's syllabifier; a row fallback that picks the row whose words the dictionary sews into words (shipped).
- Witnesses: dictionary at edit distance 1 (ties unresolved: the word list has no frequency); the notes' syllable count as a witness (55 percent precision, not shipped); two readers voting (186 syllables recoverable where they disagree); a "second look" from confusion pairs (redesign: it would flag 7.3 percent of words).

## Not tried

- The new candidates the desk found today (`report` below): `orus` (Tesseract fine-tuned on pre-reform *Iskra*, Apache 2.0, 1.30 percent CER on its test set); PP-OCRv6 Cyrillic (Metrika Labs, 2026, ONNX, character set unknown); `eslav` (PaddleOCR, lacks ѣ ѳ ѵ). A bake-off of all of these on the same framed rows.
- A real pre-reform corpus for training (`nevmenandr/russian-old-orthography-ocr`, 248,503 rows, 19th-century books, MIT).
- A word list with frequencies to break ties.
- The poem as a witness for the scan's words (the text-seating design is ratified, `OPEN.md` "N.135 STAGE 3", rows 111 and 150), when the singer also gives the poem.
- A systematic sort of the lost syllables by cause.

## The desk's research this morning

- `orus`: https://github.com/AButon-8/iskra_ocr
- Corpus: https://huggingface.co/datasets/nevmenandr/russian-old-orthography-ocr
- PP-OCRv6 Cyrillic: https://github.com/metrika-labs/PP-OCRv6_rec_cyrillic
- Levchenko (2025), arXiv 2510.06743: large vision models read 18th-century Russian at 3.4 to 5.8 percent page CER but add old letters never printed; text-only post-correction by an LLM made results worse.
- Row 158's earlier reading: `/root/shane/docs/sessions/memo-desk-b0-reader-review-reading_r1_2026-10-28.md`.

## Where to read more (tree at `/root/shane`, branch `Shane` at `ce5dc96`)

`docs/memory/SCHEDULE.md` (meta 2), `docs/memory/STATE.md` (the 2026-10-27 to 10-29 paragraphs), `docs/sessions/report-desk-row117-image-cleaning_r1_2026-10-27.md`, `report-desk-n135-lever2-measure_r1_2026-10-27.md`, `report-desk-rows115-116_r1_2026-10-19.md`, `review-opus-brief-second-look_r1_2026-10-29.md`, `review-opus-brief-syllable-breaks_r1_2026-10-29.md`, `brief-n135-row-fallback_r3_2026-10-29.md`, and the code under `apps/web/src/lib/omr/`. Read what you need; you need not read all of it. You may search the web.

## Constraints (Dann's, standing)

Free and open source; runs in the singer's browser (WebGPU allowed; a model must be a reasonable download); every licence compatible; no outside service at run time; nothing that writes text the print does not carry (the page is never wrong; Ilya's misreading is Ilya's). Money, his name, and burning a held-out song for diagnosis are his calls.

## What we ask, in three passes

1. **Blue sky.** Ideas that would move the words from a scan toward 9 of 10, unconstrained by our habits: other models, other framings of the problem, uses of the music itself, the poem, the dictionary, the singer, the print's own regularities, or oversights like the clitics one. Number them. One or two sentences each. Aim for breadth.
2. **Implementable in Ilya.** Which of those fit the constraints above, and what in the tree each would touch (name files you read).
3. **Practical now.** Of the implementable ones, which are practical in the next week or two, ranked by expected gain per cost, each with: how to measure it first cheaply, what number would justify building it, and its worst-case token cost. Say which order you would run them in and why. Where a gain is a guess, say so.

Every claim about the tree carries a file and line read this session or NOT ESTABLISHED. NOT ESTABLISHED beats a complete invented answer. Canadian spelling, no em dashes. Stop at 200,000 tokens and write what you have.

Write `/tmp/claude-0/-home-claude/0f00879f-3f64-5ccb-8135-18444a0c17a2/scratchpad/memo-fable-blue-sky-reader_r1_2026-11-02.md`. Reply with one line naming your top practical recommendation and the path.
