# Brief for Code on the Mac: the Russian line found by its underlay, measured (r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 22:30. QUEUE row 80. For Code on the Mac, Opus. **Measures only: no change to Ilya or the port is kept.** Asked by Dann 22:24 (*"What about vertical correspondence of note to syllable underlay?"*) and 22:25 (*"Can tesseract and homr agree on coordinates to deduce where Cyrillic text falls versus latin characters?"*).

## 1. What was observed

Row 77 (`report-code-set3-four-below_r1_2026-10-11.md`, read whole by the desk): S (Balakirev) keeps 12 extra notes and T (Borodin) 14, all from the English or French line printed beside the Russian in split bars (S bars 49, 69 to 73; T bars 21, 22, 41, 43, 73 to 76). homr's MusicXML carries no stem direction, no cue size, and voice numbers that do not follow the line, so no rule could separate them from homr's output.

## 2. What is established, and what are leads

- Ilya renders each scan page once for homr at `TARGET_DPI` 400 (row 77's report, "How it was read").
- homr knows where each note sits on the page image (row 77's trace quotes `imgpos` values), but its MusicXML does not carry it. Lead: where in `third_party/homr-web/` the positions are available.
- Ilya loads Tesseract for poems (`apps/web/src/lib/omr/tuplet-number.ts:37`). Lead, not read: whether Ilya already asks Tesseract for word boxes anywhere, and the state of N.135 (the reader of the text underlay, `docs/memory/OPEN.md`).
- Lead: the singer's pasted Russian poem gives the syllable count of every Russian word.

## 3. Measure, in this order, and report each before the next

1. **One frame.** Does homr straighten, crop, or rescale the page before it places notes? If so, can its note positions be mapped back to the 400 dpi page? Cite the file and line.
2. **Tesseract on the underlay.** On S's and T's split bars, run Tesseract (Russian plus French and English) on the same 400 dpi page image and list each word's box and text. Classify each word as Cyrillic or Latin by its letters' Unicode ranges. Report how many underlay words in those bars were found, and how many were classified as the page prints them (check each against the page).
3. **The test.** For every note homr reads in those bars, does a Cyrillic or a Latin word sit nearest below it (horizontal overlap with the note's head, within the system)? Report a table: bar, note, the word below it, Cyrillic or Latin, and whether the truth file counts it as the song. The measure separates if every Russian note has a Cyrillic word below it and every extra note does not.
4. **The poem, as a second witness.** For the same bars, does the count of notes on each candidate line match the Russian syllables the poem gives? Report where it agrees with step 3 and where it does not.
5. **Controls.** Run step 3 on two songs with a single Russian underlay (K and M) and report any note it would wrongly remove.

## 4. The rulings this serves

THE ONE THING (`STATE.md`). The DESK DEFAULT on scoring, row 77's brief section 3.3: the song a Russian singer sings is the Russian underlay's line. Dann 2026-10-02 15:55 (`CONTRACT.md` §5): where Ilya's reading differs from the print, the misread is Ilya's.

## 5. Constraints

Change nothing in `apps/` or `third_party/` that stays; any instrument lives under `docs/sessions/measure-russian-line_2026-10-11/` or a scratch copy outside the tree. Set 3's other songs (Q, R, U, W, Y, Z) stay unopened. No git command that writes. **Displaces:** nothing.

## 6. Done when

Section 3's five reports, each with its numbers. A recommendation, marked as Code's, on whether a general rule is possible and what it would need. Nothing built.

## 7. Report back

`docs/sessions/report-code-the-russian-line-by-its-underlay_r1_2026-10-11.md`, with **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set row 80's State in `docs/memory/QUEUE.md` and stop.
