# Memo: the yardstick on seven songs. homr 0.7.0, scored by the scan scorer

**Written by the desk (Fable), 2026-10-02 about 10:25.** Plan r4, phase 0: *"Audiveris and one permissively licensed engine as a ceiling."* The cloud lane measured homr and oemer on *Sunless* 1 with its own scorer (`report-code-the-yardstick_r1_2026-10-02.md`, on branch `cloud-lane` at `d6d9f34`, read in full by the desk). This memo runs homr on all seven songs that have truth and scores it with the same scorer and the same truth as row 22, so the two readers can be set side by side. **It is a ceiling, measured. Nothing of homr's enters the repository.**

## The table

Of every 100 printed notes, how many are present with the right pitch and the right length. Ilya's column is row 22's (`report-code-the-baseline-on-eight-songs_r1_2026-10-02.md`).

| Song | Ilya's reader | homr | homr: bars file / read | homr: notes file / read / matched | homr: pitch right | homr: length right | homr: rests file / matched |
|---|---|---|---|---|---|---|---|
| Tchaikovsky Op. 38 No. 3 | not yet scored | **93.1** | 99 / 98 | 174 / 176 / 173 | 162 | 170 | 48 / 48 |
| *Sunless* 1 | 36.5 | **81.3** | 18 / 18 | 96 / 89 / 89 | 85 | 81 | 19 / 16 |
| *Sunless* 4 | 37.1 | **97.4** | 29 / 29 | 116 / 114 / 113 | 113 | 113 | 29 / 28 |
| *Sunless* 5 | 11.6 | **86.8** (an upper bound) | 61 / 81 | 258 / 371 / 253 | 232 | 244 | 48 / 45 |
| *Sunless* 6 | 23.0 | **94.4** | 55 / 55 | 161 / 157 / 157 | 152 | 157 | 26 / 26 |
| *Sunless* 2, test only | 16.2 | **66.2** | 12 / 16 | 68 / 73 / 68 | 56 | 52 | 13 / 10 |
| *Sunless* 3, test only | 20.7 | **69.8** (an upper bound) | 41 / 63 | 222 / 321 / 216 | 195 | 157 | 40 / 34 |

The octave shift the scorer chose for homr is the one it chose for Ilya's reader on every song: 0 for the Tchaikovsky song and *Sunless* 4, +12 for the rest.

## How it was run

- **Engine:** homr 0.7.0 from PyPI, in a scratch environment in the desk's cloud workspace: Python 3.13.15, onnxruntime 1.30.0, numpy 2.5.3, opencv-python 5.0.0.93. Two CPU cores, no GPU. Its models downloaded on the first run.
- **Pages:** a Poppler raster at 400 dpi (`pdftoppm` 24.02.0) of `Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` (md5 `3d3d4684a1180bd4d4904ccbaca15bfb`) and of `IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf`, each page given to homr unaltered. **This is not the app's raster** (pdf.js); row 22 read the app's.
- **The voice:** the first part of homr's MusicXML, staff 1, with chord tones after the first and grace notes left out. A bar that holds one rest and nothing else is a bar of rest and carries no event, as in the truth files. Lengths are the written type with its dots (`conv.py`).
- **The scorer:** `tools/e16-harness/src/scan-scorer.ts`, unchanged, as Code wrote it for row 22 (`score.ts` calls it the way `scan-baseline.ts` does).
- **Truth:** the six *Sunless* truth files, and for the Tchaikovsky song the desk's draft `truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json`, which Dann has not proofed.
- **The test-only songs:** totals only. The desk did not open their pages or their note-by-note output.
- **Time:** 14.0 to 35.1 seconds a page on the 23 *Sunless* pages, mean 18.2; 24.5 seconds on page 1 of the Tchaikovsky song and 49.9 seconds for pages 2 and 3 together.
- **Files:** `measure-yardstick-desk_r1_2026-10-02/` holds `conv.py`, `score.ts`, and the reads and scores of the five build songs.

## What the numbers do and do not show

- **On *Sunless* 5 and 3, homr's first staff holds 113 and 99 more notes than the song prints for the voice, and 20 and 22 more bars.** The scorer does not lower the headline for an extra note, and an aligner with more notes to choose from can find matches by chance. Those two headlines are upper bounds. What the extra notes are is NOT ESTABLISHED; the desk did not look.
- **On the Tchaikovsky song, every difference between homr and the truth draft lies in bars 45 to 53,** which are page 2, system 3. There homr's first staff holds eighth rests and pitches a fifth to an octave under the printed voice. What homr read there is NOT ESTABLISHED. **In the other 90 bars homr and the truth draft agree in every pitch and every length,** bar 83's D♯4 among them. That is a second witness for the draft, made by a different method.
- **homr reads no words** (the cloud report: no lyric element in its output).
- **homr is AGPL-3.0** (the cloud report) **and Ilya is MIT** (`LICENSE`, line 1, read by the desk 2026-10-02). Leads from project knowledge, snippets only, not read in full this session: the bake-off of 2026-07-22 and 2026-07-23 kept homr as a ceiling reference and out of the shipped product for that reason (`claude/e16-phase0-options-memo_2026-07-22.md`, `claude/sonnet-memo-e16-notehead-localization-survey_2026-07-23.md`).
- **Whether homr runs in a browser is NOT ESTABLISHED.** Here it ran as Python with onnxruntime and about 134 MB of models (the cloud report's sizes).
- One run for each page. The cloud lane found homr's output byte-identical on a second run of *Sunless* 1.

## What it means for the plan

- The ceiling on these pages, for a trained reader, is 81 to 97 on the build songs and 66 to 70 on the two songs nobody studied. Dann's bar is 95 for each song. Ilya's reader stands at 12 to 37.
- Plan r4 already says where this goes: *"At the checkpoint, Friday 2026-10-09, the numbers go to Dann with three options if the reader is short: the date moves; the scan read is released as a first draft the singer confirms; or an outside engine is evaluated, which raises a licence question and the offline stance."* (section 5, "Standing pivots"). This memo is the outside engine's number for that day.
- The next brief does not change: lengths are still the reader's largest loss (`QUEUE.md` row 23).
- homr's output can serve the desk as a second witness when it makes truth by eye, as it did here. The truth for Tchaikovsky Op. 38 No. 2 is still to make.
