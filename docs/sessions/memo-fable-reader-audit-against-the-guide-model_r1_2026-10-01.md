# Memo: the page reader audited against the guide model (Fable, 2026-10-01)

**Written by:** the desk (Fable), 2026-10-01 about 16:45, at Dann's request (16:11): *"compare what we have been discussing and you have been researching with what Ilya has in code, both active and dormant... identify the conceptual errors, gaps, and opportunities for optimization."*

**Status: a dated draft, not a ruling.** Nothing here is built. Every code claim carries a `path:line` read this session. Every number is from a run this session, on the desk's shell (Poppler raster at 400 dpi, OpenCV 5.0.0, numpy 2.2.6, which are NOT the app's pins).

## What was read, and what was not

**Read in full:** `tools/e16-harness/reader/README.md`, `run_page2.py`, `envelope.py`, `beams.py`, `reader.py:20-75` and `:235-1350`, `apps/web/src/lib/reader/page-reader.worker.ts`.
**Read in part:** `rest_templates.py:1-140`, `timesig.py:1-95`, `substrate.py:1-110`, `recognized-to-musicxml.ts:1-60` plus a grep, `pre-reform-normalizer.ts:1-40`, `tempo-terms.ts:1-25`, `ScoreUploader.svelte` by grep only.
**Not read:** `clefkey.py`, `metre.py`, `hollow.py`, `ocr-guard.ts`, `page-pdf.ts`, `vowel-resolver.ts`, and the harness's TypeScript.

## The guide model, in one paragraph (Dann's, 16:02 to 16:09, with the desk's critique)

A page is flattened layers that Ilya rebuilds, most reliable ink first. The staff is the ruler: every other guide is placed relative to it. A system announces itself several ways at once (left line, brace, barlines through the piano, a text line under the voice, one note at a time in the voice), and those signs vote, so one broken sign is outvoted. Lyrics sit on a line at a shared distance under the voice staff; directive text floats elsewhere. Order and hyphens tie syllables to notes. Where signs disagree, Ilya flags and does not guess. A system with no voice staff is tacet.

## A. Conceptual errors

**E1. A staff is five row numbers.** `detect_staves` (`reader.py:352`) returns five y-values per staff, and pitch comes from one of them: `position()` (`reader.py:766-769`). Measured on Tchaikovsky page 2: the bottom staff drifts 59 px across the page at a staff space of 29 px. That is two staff spaces, or four pitch steps. So tilt costs pitch as well as staves.

**E2. A system-level fact is decided from one staff.** `detect_barlines` (`reader.py:1228-1244`) looks only at ink inside the voice staff. Three successive tests (width, solidity, a row-width ceiling; the comment at `reader.py:1020-1133`) exist to tell a barline from a stem. Nothing asks whether the piano has a barline at the same place. Measured: 18 bars found on page 1 against 27 printed.

**E3. An undecided voice becomes the top staff.** `select_vocal` (`reader.py:659-684`): no brace found, or every staff braced, gives `group[0]` and counts a fallback. There is no tacet outcome.

**E4. Glyphs are recognized by one modern font.** Rests and time-signature digits are matched against outlines of Leipzig, Verovio's font (`rest_templates.py:5-6`, `timesig.py:5-8`). An 1878 Jurgenson rest or numeral is a different drawing. Measured: 7 rests found on three pages (page 1 alone prints 19), and the metre reads 3/8 on one raster and 9/8 on another.

**E5. Rhythm is read from how much ink there is, not from its shape.** The flag count comes from the area of the connected blob of ink, in staff spaces squared (`run_page2.py:342-352`; constants at `reader.py:1286` and `run_page2.py:37`). The file itself names the principled replacement, "geometric flag-lobe counting" (`run_page2.py:35-36`). Measured: 22 of 41 notes on page 1 abstain on duration. The converter then draws each abstained note, and every note after it in the bar, as a quarter (`recognized-to-musicxml.ts:23-28`). That is the banner's "Length assumed on 33 notes".

**E6. Checks raise alarms and never help decide.** The bar-sum test flags a bar that does not add up (`run_page2.py:551-610`), under the charter line "validators flag, humans and D8 fix" (`run_page2.py:4`). Nothing uses "this bar must add up to 3/8" to choose between two candidate readings of a note. An empty bar abstains: "the reader never invents an unprinted rest" (`run_page2.py:573-575`). **This is a ruling of July 2026, and bringing it up is a case for Dann, not a strike by the desk.**

**E7. The reader is calibrated to a corpus, not to the page in front of it.** `G_BRIDGE = 18` (`substrate.py:104`), `T_REL` (`beams.py:59`), the sentinel's limit, and `INK_WEIGHT_GUARD` (`run_page2.py:105`) are measured over 47 Verovio renders and two Lamm pages, each with the instruction to re-derive "whenever the corpus changes" (`beams.py:57-58`, `substrate.py:101-103`). Every new edition is a corpus change. Measured: the sentinel halts Tchaikovsky pages 2 and 3 (`beams.py:231`). The page-local alternative already exists in two places (`_derive_rowfrac_gate` at `reader.py:20`, `_derive_flag_boundary` at `run_page2.py:131`).

## B. Gaps

- **No text is read by the reader.** None of the modules read touches lyrics, tempo words, dynamics, or expression. The only OCR in the app is the poem route, whole image, Russian model (`ScoreUploader.svelte:442-443`).
- **Whole-bar and half rests.** `REST_KINDS` holds quarter, eighth, and sixteenth only (`run_page2.py:108`). This song opens with seven whole-bar rests.
- **Slurs, ties, tuplets, hairpins, fermatas, chords.** Not read (README, "Known limitations"; `run_page2.py:437-439` on chords).
- **Clef and key inside the read.** They come from the singer's answers (`envelope.py:59-62`); the page's own are read only as a probe (`reader.py:871-900`).
- **Tacet systems, ossia staves, two voices.** No concept.
- **Damaged ink.** One sign with one threshold: the left join at 0.5 (`reader.py`, "JOIN THRESHOLD").
- **Truth.** No ground truth exists for any print except the two Lamm pages, so accuracy on prints has never been measured.

## C. Assets already in the tree, dormant or underused

- **A pre-reform normalizer** (`packages/dictionary/src/pre-reform-normalizer.ts`, 306 lines). Built for typed text. It is what words read off a Jurgenson page need before the dictionary.
- **A tempo vocabulary** (`packages/score-parser/src/tempo-terms.ts`, `tempo-lexicon.ts`). The small known vocabulary for directive text exists.
- **A dictionary judgment of OCR text** (`ScoreUploader.svelte:79`, `ingestion/ocr-guard.ts`; not read).
- **A page-learned glyph matcher.** `_rest_template` and `detect_rests` (`reader.py:1327-1350`) take a rest glyph from the page itself and match it across the page. No caller remains in the reader folder (grep). It is the font-independent idea E4 needs.
- **Per-fact abstention with a reason** (`run_page2.py:446-474`). The right carrier for "unsure, flagged".
- **Read, pre-fill, ask** (the clef and key probe, `reader.py:871-900`).
- **Nine real-scan pages** in `tools/e16-harness/robustness-samples/` and `scans/` (Bessel 1908, Lamm 1931).

## D. Opportunities, in order of leverage

1. **The staff as a traced ruler, then straighten.** Measured with `proto-trace-staves_r1_2026-10-01.py`: Tchaikovsky goes from 9, 2, and refused to 9, 12, 12 staves, with the voice staff right on all 11 systems and no fallback. On the nine other scan pages, two of the three that fail today read, none gets worse, and on the third the trace finds 9 staves while the old row test still refuses the straightened page. So the trace itself should supply the staves.
2. **System-level voting.** Brace, text line, and monody for the voice staff; barlines confirmed across the system; tacet as an outcome.
3. **Let the page teach Ilya its own glyphs.** Take the page's own rest, digits, and clef as exemplars, in place of one modern font.
4. **Bar arithmetic as evidence.** Where exactly one reading makes the bar add up, take it and mark it deduced. Needs Dann's ruling (E6).
5. **The lyric line.** Cut by position, read by OCR, normalize pre-reform spelling, rejoin syllables, check against the dictionary. Measured raw on page 1: 32 of 40 syllables.
6. **Beams and slurs in the voice as melisma signs.** The desk's reading of general engraving practice, not checked against Gould this session: voice notes are flagged one per syllable and beamed only on a melisma.

## What could not be established

- Why the app's own read of page 1 was worse than the desk's (4 staves and 4/4 against 9 staves and 3/8).
- Which 9 bars are missing on page 1, and why.
- Why straightening changes the metre read from 3/8 to 9/8.
- Whether any of this holds on a degraded photocopy. Every page measured is a clean scan.
