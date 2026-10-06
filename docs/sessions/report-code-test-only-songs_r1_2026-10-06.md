# Report: the test-only songs, run once (r1, written 2026-10-06)

Code (Sonnet 5.5), runbook step 4. Nothing in Ilya was changed. Tree at `bbe524b`; `git status` before and after is the same list, all under `docs/`.

**Totals only.** I did not open the pages, crops, or note-by-note output of either song. The reads (joined MusicXML, per-song events, per-song scores) are outside the repository, in my scratchpad: `/private/tmp/claude-502/-Users-dannmitton-Desktop-ilya-rewrite/9bd8867e-af4f-41f0-9866-3e291d1dcc74/scratchpad/out/`. The scorer was run without its `full` mode, so it wrote no note-level file.

## How it was read

- Pages: PDF pages 3 to 4 (*Sunless* 2) and 5 to 8 (*Sunless* 3) of `~/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf`, rendered with `pdftoppm -r 400`. Control: page 1 rendered the same way is byte-identical (`cmp`) to the kit's `sun-01.png`, so these pages are rendered as the build songs' pages were. The 23 pages split 2, 2, 4, 2, 7, 6 across the six songs, which matches the runbook's page ranges.
- Reader: `readScanPages` in `apps/web/src/lib/omr/homr-reader.ts`, called from the page the way step 3 did (same driver, `lib.cjs` and a copy of `baseline-read.cjs` with the page list changed). Dann's installed Chrome, headed, fresh profile, in front (`visibilityState` visible). Dev server on port 5199, which I started and stopped; `lsof` listed no node server before I started it and no listener on 5199 after.
- Path: both songs read on `webgpu`. *Sunless* 2, 2 pages, 17.0 s. *Sunless* 3, 4 pages, 45.8 s.
- Scoring: `conv.py` then `score.ts` from `docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/`, unchanged, against `tools/e16-harness/output/truth/mussorgsky_sunless-02_you-did-not-recognize-me.truth.json` and `mussorgsky_sunless-03_finished-is-the-noisy-idle-day.truth.json`. Control: the same commands on step 3's joined *Sunless* 4 reproduce its 116 of 116 and 100.
- Departure, the same as step 3's: I called the reader directly, not the intake UI.

## The totals

"Right" means pitch and length as printed (`bothRight`), under the octave shift the scorer chose (12 for both).

| | *Sunless* 2 | *Sunless* 3 |
|---|---|---|
| Notes right of printed | 59 of 68 | 143 of 222 |
| Score (headline) | 86.76 | 64.41 |
| Missing | 0 | 22 |
| Extra | 0 | 2 |
| Misread pitch | 1 | 1 |
| Misread length | 8 | 56 |
| Bars read, of truth bars | 12 of 12 | 36 of 41 |
| Bars all right | 8 | 21 |
| Rests, of printed (length right) | 13 of 13 (13) | 31 of 40 read (25 right) |

The scorer's own counts, for the record: *Sunless* 2 matched 68, pitch right 67, length right 60. *Sunless* 3 matched 200, pitch right 199, length right 144, 9 rests missing.

For comparison, the build songs in step 3 scored 95.74 to 100. These two are lower: *Sunless* 2 by 9 points or more, *Sunless* 3 by 31 or more, and *Sunless* 3 reads 5 bars fewer than the truth has.

## Tchaikovsky Op. 38 No. 2

**Not run.** No truth file for it exists in the tree. `tools/e16-harness/output/truth/` holds the Kabalevsky and Mussorgsky files only. The one Tchaikovsky truth in the tree is `docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json`, and that is Op. 38 No. 3, the build song. I made no truth file, as told.

## NOT ESTABLISHED

- **Why either song scores as it does.** I did not look at the pages, so no cause is given for any miss. In particular, why *Sunless* 3 has 22 missing notes, 9 missing rests, and 5 bars fewer than the truth is NOT ESTABLISHED, and so is whether the 56 length misreads follow from the missing bars.
- **That a drop through the intake gives the same reads.** The reader was called directly.
- **Repeat runs.** One read of each song, no spread. The test set is spent for these two songs on this reader; a second read would not be a clean test.
- **Whether WebAssembly would read them the same.** Step 3 found one note of difference across the five build songs; these two were read on WebGPU only.
