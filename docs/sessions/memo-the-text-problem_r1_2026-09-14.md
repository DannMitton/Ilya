# Memo: the text problem, what is proven, and the way forward

**Answers:** Dann's request of 2026-09-14, at the close of a long walk: summarize
what is verified, say what still needs reading, define the problems, and propose
a plan.
**Instrument:** files read through the device bridge this session, his own
engraving read directly, and one Sonnet measurement run (267k tokens, memo at
`memo-n135-ocr-measurement_r1_2026-09-14.md`).
**Status:** every line below carries a citation, a measurement, or the words NOT
ESTABLISHED.

---

## 1. What is proven

### 1.1 How a song is put together

| # | assertion | source |
|---|---|---|
| A1 | A song holds a poem slot and a score slot independently, and nothing checks that they are the same work. | Observed on the branch alias 2026-09-13: `1. В четырёх стенах` held Mussorgsky's poem beside `eflat-walk-fixture.musicxml`, an eight-note exercise on `да`, and reported `0 / 96 placed`. |
| A2 | Nothing anywhere writes the poem box from an ingested score. | `INBOX.md:147`, established 2026-09-12: `doc.inputText` is assigned at `+page.svelte:2679`, `:2403`, and `document.svelte.ts:269` only. **Not re-read this session.** |
| A3 | An arriving score seats the poem's syllables only when the file carries no lyrics of its own. Otherwise it returns an empty map. | `pairings.ts:304-318`, `mergeOnUpload`; the flag is set at `+page.svelte:3009` from the `no-lyrics-found` warning. |
| A4 | That restriction is a desk inference, not Dann's ruling, and it says so. | `+page.svelte:3004-3008`: *"That is an INFERENCE from R3 and N.55a together, not a ruling of Dann's."* |
| A5 | `Transcribe and fit` does not fit. It never touches `doc.pairings`. | `+page.svelte:2373-2380`, and its own comment: *"IT DOES NOT RE-SEAT A SCORE THAT IS ALREADY ATTACHED."* |
| A6 | Its second act duplicates `Continue to analysis`. | `ScoreUploader.svelte:550-560`: *"one press of Continue and one press of Transcribe now run the SAME line."* |
| A7 | Two things seat syllables: an arriving score under A3, and `Start placement over`. | `firstPass` has two non-test callers, `pairings.ts:315` and `+page.svelte:577`. |
| A8 | Ilya already rejoins a publisher's syllabified underlay into words, and already knows which note each vowel nucleus sits on. | `vowel-resolver.ts:198-235`, `collectScoreWords`; `raw` is built at `:210`, `slots` in the loop below it. |

**A8 is the most consequential line in this memo.** `INBOX.md:147` recorded the
rejoining as the hard part of N.121 on 2026-09-12. It was already built.

### 1.2 What a score file actually carries

Read directly from `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`.

| # | assertion |
|---|---|
| B1 | Two verses, 96 Cyrillic syllables and 96 IPA syllables. |
| B2 | Punctuation travels inside the syllable text: `я,` `я;` and a full stop. |
| B3 | No line structure at all. Zero `end-line`, zero `end-paragraph`, zero `new-system`, zero `new-page`. |
| B4 | Rejoining verse 1 gives 39 words against the poem box's 38. The engraving divides `не проглядная` and `без ответная` where the poet writes them closed, and its last word is `одинока`, missing the final `я`, which matches the note recorded against N.111 on 2026-09-04. |

### 1.3 The page reader

| # | assertion | source |
|---|---|---|
| A9 | Classical computer vision under Pyodide in a Worker: cv2 4.9.0, numpy 1.26.4, matplotlib, pinned because drift changed a reading. 2.9 s to load, 0.867 s per page. | `page-reader.worker.ts:1-31` |
| A10 | It reads no text of any kind. `RecognizedOutput` has no text field, the converter contains no `lyric`, and its tests assert `no-lyrics-found` including on a captured real browser read of Mussorgsky 01 page 1. | `recognized.ts:29-70`; `recognized-to-musicxml.ts`; `recognized-to-musicxml.test.ts:179-200` |
| A11 | Ilya ships OCR today, for a whole photographed poem, in Russian, in the browser, and the result goes to the poem box. | `apps/web/package.json:25`; `ScoreUploader.svelte:300-326`; stated in `PRODUCT.md` under the tabs table |
| A12 | No poetic scansion, metre, or rhyme code exists anywhere. The only `metre.py` is the reader's time-signature work. | repository-wide search, 2026-09-14 |

### 1.4 Measured 2026-09-14

| # | measurement |
|---|---|
| C1 | The OCR Ilya ships is entirely CDN-fetched from jsdelivr and bundled nowhere. First use costs about **4.08 MB** over the wire: worker 31,770 B, core WASM 1,373,509 B, `rus.traineddata` 2,679,598 B. None of it is inside the 12 to 22 MB first-session figure, and it is gated behind a press. |
| C2 | Multi-language does not help. `rus` 47%, `rus+deu` 42%, `rus+eng` 48%. The 47% baseline reproduced. |
| C3 | **Per-syllable crops read far better than a whole page: 10 of 12 correct, 83%, against 47%.** Twelve of 96 syllables, hand-drawn crop grid, and a different Tesseract build from C2, so it is indicative and not controlled. |
| C4 | `packages/dictionary` is a whole-word lexicon. It corrected nothing at the fragment level, because every raw token was already a valid prefix of some real word. |

### 1.5 From the record, not re-verified

| # | assertion | source |
|---|---|---|
| D1 | No actively maintained, permissively licensed OMR engine emits lyrics at all. Confirmed at the time by grepping source and tokenizer vocabularies. | `claude/e16-phase0-options-memo_2026-07-22.md` |
| D2 | Audiveris alone emits lyrics and is AGPL-3.0, so it cannot be bundled into MIT Ilya. Its lesson decomposes to Tesseract plus Ilya's own knit. | same, and `LOG.md:336-339` |
| D3 | The 47% was measured on a bilingual Russian and German page, and the interleaved German drags it down. | `memo-n96-pdf-ingest_r1_2026-08-24.md` |

---

## 2. The five problems

**P1. Text that exists inside Ilya is not in the field where a singer can edit
it.** A score's words never reach the poem box, so the Transcription document is
empty beside a fully drawn score, and the words cannot be corrected. Dann's
reason, 2026-09-14: the box is the only manual text alteration surface.
Already ruled, 2026-09-10, and transcribed into `PRODUCT.md`. Numbered N.134.

**P2. A score that brought its own words never marries to the poem.** A3 and A4.
The singer is left at `0 / 96` with one control that can help, and it is named
`Start placement over`.

**P3. A poem and a score that are not the same work sit together in silence.**
A1. Ilya prints a count implying a relationship it has not checked.

**P4. A PDF or a photograph yields notes and no words.** A10. Ruled by Dann
2026-09-14 that Ilya must read the underlay. Numbered N.135.

**P5. Score-derived text has no line shape.** B3. A block of 39 words where the
singer expects eight lines.

---

## 3. The approach to each

**P1.** Join `collectScoreWords(parsed, 1)`'s `raw` values and write them to
`doc.inputText` when the box is empty, tagging the poem receipt `from score` on
the Piece fields' existing pattern. No new algorithm. A8 supplies the words.

**P2.** Overturn the inference at A4, and seat from the score's own `slots`
rather than from a positional first pass. The file already states which note
each nucleus sits on, so this is more accurate than `firstPass`, not less.
**Dann's ruling required.**

**P3.** Before seating, weigh the two queues, which already sit side by side at
`+page.svelte:373-378`. Seat count against syllable count catches 96 against 8.
The score's own words against the poem's catches `да да да` against `Комнатка`.
**What counts as a mismatch is Dann's ruling**, and a rule that fires wrongly
blocks a real song.

**P4.** Point the shipped tesseract.js at the underlay band per notehead, using
the reader's own geometry. C3 is the evidence that this reads far better than a
whole page. Then rejoin the syllables with A8's existing code and check the
resulting **whole words** against the dictionary, which is where C4 says the
lexicon can actually help. The correction order matters: fragments cannot be
checked, words can.

**P5.** Break only where two independent signals agree, and return an unbroken
block otherwise, because a block invites the singer in and a wrong line looks
finished. Signals: end punctuation; metre, induced from the `stressIndex` Ilya
already computes per word (`+page.svelte:2392-2399`); rhyme on the IPA of
candidate line endings, used to score a breaking rather than to generate one.
**A rest in the vocal line is weak evidence only**, per Dann 2026-09-14:
enjambement exists and composers set against the scansion.

---

## 4. What still needs reading before a brief can be written

1. The three `doc.inputText` assignment sites, unread by this desk this session (A2).
2. `packages/dictionary`'s public API, to know what a corrector may ask it.
3. `reseat.ts`, to know what happens when the box fills under existing placements.
4. The poem receipt's render site, for the `from score` tag.
5. Whether tesseract.js v7 can recognize a rectangle without paying a worker start per crop. This decides whether P4 is seconds or minutes per page.

---

## 5. What Dann owes

1. **P2's ruling.** Overturn the `scoreCarriesNoLyrics` gate, or keep it.
2. **P3's rule.** What counts as "not the same work".
3. **The server tier**, recorded unruled since 2026-07-22. C1 is new context: Ilya already fetches 4 MB from jsdelivr at runtime, so it is not offline-pure today.
4. **The `Transcribe and fit` pill.** Its two acts are duplicates (A5, A6).
5. **P5's scope.** Punctuation only now, or wait for metre and rhyme.

---

## 6. The sequence, proposed

P1, then P2 with P3 in the same commit, then P5's punctuation half, then P4.

P1 first because it builds the surface every later error is corrected in.
P3 travels with P2 because overturning the gate is what makes a mismatch
dangerous. P4 last because it is the only one that is research.

---
*Desk, 2026-09-14. No git was run except reads. No application code was written.*
