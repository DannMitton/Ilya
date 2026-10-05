# Memo: why July and October disagreed about homr

**Written by the desk (Fable), 2026-10-04 about 14:45.** It answers the first act of `commission-appraisal-of-the-approach_r1_2026-10-04.md`, section 4: *"Settle why July and October disagree about homr."* Nothing of homr's enters the repository. Nothing in the plan changes on this memo; it is evidence for the appraisal.

## The question

July 2026 measured the open reader homr on *Sunless* and found that it could not read pitch: pitch F1 0.150, and 0.20 to 0.23 after an octave correction (`claude/sonnet-memo-e16-note-engine-bakeoff-v2_2026-07-23.md`, `claude/sonnet-memo-e16-homr-octave-corrected-score_2026-07-23.md`, both read in full this session). On that figure the charter reopened "do not build perception from scratch" and authorized the hand-built reader; its stated premise is *"no engine reads pitch on this corpus"* (`claude/fable-ruling-e16-pitch-reader_2026-07-23.md`, section 2, read in full). October measured homr on scans of the same songs at 81 to 97 of 100 notes right in pitch and length (`memo-desk-yardstick-homr-on-seven-songs_r1_2026-10-02.md`).

## The answer

**July's figure belonged to the test pages and to the scorer. It did not belong to homr.** The same version July used, homr 0.6.2, reads faithful renders of the same engravings at 98 of 100 on each of the three build songs that could be scored.

Three things were wrong with July's measurement, and the project's own record already holds the first two:

1. **The pages printed no accidentals.** Found the day after the bake-off: every corpus page rendered plain noteheads with no inline sharp, flat, or natural, while the truth carried the altered pitches (`claude/e16-corpus-accidental-render-gap_2026-07-24.md`, read in full). That memo says of the engines: *"LIKELY CONFOUNDED: homr's and PrIMuS's 'weak pitch.' They read the same accidental-free images."* The desk found no later document that measured homr again.
2. **The pages printed the piano on one staff,** with stacks of ledger lines and no brace, because the conversion dropped the staff count (`claude/opus-memo-e16-render-fidelity-piano-staff-collapse_2026-07-27.md`, read in full). The repaired pages are in `tools/e16-harness/output/<piece>/repaired/` (`claude/sonnet-memo-e16-render-fidelity-repair_2026-07-27.md`, read in full).
3. **The scorer could not forgive an octave or a moved barline.** July's `scorer.ts` matches each note by nearest onset on the truth's own bar timeline and counts a pitch right only on exact MIDI equality (`tools/e16-harness/src/scorer.ts:16-33`, `:153-157`, read in full). October's `scan-scorer.ts` aligns the two note sequences in order and chooses one octave shift for the whole song (`tools/e16-harness/src/scan-scorer.ts:15-36`, read in full). On the repaired pages the shift it chooses is +12 for *Sunless* 2 and 5, -12 for *Sunless* 4, and 0 for *Sunless* 1 and 3 (`measure-july-october-homr_r1_2026-10-04/results.txt`). July's scorer counted every note of a song read an octave away as a misread pitch.

## The measurement

Of every 100 printed notes, present with the right pitch and the right length, by `scan-scorer.ts`, unchanged, against the truth files in `tools/e16-harness/output/truth/`.

| Song | July's own figures: pitch F1, rhythm F1 | July's stored homr 0.6.2 output, October's scorer | homr 0.6.2 on the repaired pages | homr 0.7.0 on the repaired pages | homr 0.7.0 on the scan (2026-10-02) |
|---|---|---|---|---|---|
| *Sunless* 1 | 0.536, 0.856 | 59.4 | **97.9** | 78.1 | 81.3 |
| *Sunless* 4 | 0.000, 0.944 | 75.9 | **98.3** | 99.1 | 97.4 |
| *Sunless* 5 | 0.000, 0.959 | 48.8 | **98.1** | 97.7 | 86.8 (an upper bound) |
| *Sunless* 6 | 0.013, 0.330 | 14.9 | not scored | not scored | 94.4 |
| *Sunless* 2, test only | 0.000, 0.691 | 55.9 | 100.0 | 75.0 | 66.2 |
| *Sunless* 3, test only | 0.352, 0.785 | 52.7 | 49.5 | 53.2 | 69.8 (an upper bound) |

Reading across a row:

- **Column 3 against column 2 is the scorer alone.** The reads are the ones July stored on 2026-07-23. Under October's scorer the lengths of the matched notes are right on 94 of 96, 114 of 114, and 251 of 254 for *Sunless* 1, 4, and 5. The pitches are right on 59 of 96, 88 of 114, and 128 of 254, which is what pages with no accidentals would give.
- **Column 4 against column 3 is the pages alone.** Same version, same scorer; the pages now print their accidentals and a three-staff system. Pitch is right on 96 of 96, 114 of 115, and 253 of 258 matched notes.
- **Column 5 against column 4 is the version.** 0.7.0 is lower than 0.6.2 on *Sunless* 1: 18 of its 19 misread pitches are 20 or 21 semitones high, in truth bars 12 to 14 and 17, which is the distance between a bass-clef and a treble-clef reading of one staff position. Why is NOT ESTABLISHED.

## How it was run

- **Engines:** homr 0.7.0 (Python 3.13.16) and homr 0.6.2 (Python 3.12), each from PyPI in a scratch environment in the desk's cloud workspace, with onnxruntime 1.30.0, numpy 2.5.3, and opencv-python 5.0.0.93. Two CPU cores. 8 to 26 seconds a page.
- **Pages:** the 24 repaired render pages, 300 dpi, copied from the Mac unaltered (md5 of *Sunless* 1 page 1: `0f26d6a88050181dd5700517cb9be275`). **The pages July read no longer exist:** the top-level PNGs are dated 2026-07-24 07:17, after the accidentals were injected, and July's stored reads are dated 2026-07-23 03:50. So column 3 scores July's stored output and cannot re-run its pages.
- **The voice:** the first part, staff 1, chord tones after the first and grace notes left out, by the desk's `conv.py` of 2026-10-02, unchanged (`measure-yardstick-desk_r1_2026-10-02/conv.py`).
- **The scorer:** `scan-scorer.ts` through the desk's `score.ts` of 2026-10-02, both unchanged.
- **Control:** the truth for *Sunless* 4 given to the scorer as if it were a read scores 100, 116 of 116.
- **The test-only songs:** totals only. The desk did not open their pages, their reads, or their note-by-note scores, and kept none of them.
- **Files:** `measure-july-october-homr_r1_2026-10-04/` holds `results.txt` (every total), the reads of the build songs, the two run scripts, and the page timings.

## What this does not establish

- ***Sunless* 6 on the renders.** Dann's engraving sets the piano above the voice, and homr's parts and staves change from page to page there. Choosing a staff after seeing the scores would flatter it, so it is not scored.
- **Why *Sunless* 3 stays near 50** on both versions. A lead: July's close records triplets through that song (`claude/e16-CLOSE_2026-07-29.md`, section 5.1). The desk did not look, because the song is test only.
- **Why 0.7.0 is lower than 0.6.2** on the renders of *Sunless* 1 and 2.
- **Whether July's rejections of PrIMuS and SMT stand.** PrIMuS was scored on 2026-07-23 on the same pages without accidentals. Its other faults on record (it never read the bass clef) do not depend on accidentals. Neither was measured again.
- **Anything about scans beyond the 2026-10-02 figures.** A render is not a scan.

## What it means for the appraisal

- The charter's premise, *"no engine reads pitch on this corpus"*, does not hold for homr. The charter's own conditions said the hand-built path was to be earned by a number, that homr stayed *"a possible fallback tier if the classical path fails its numbers"*, and that on photographs a learned stage in front of the classical spine was *"a legitimate pre-authorized outcome"* (section 4 of the ruling).
- The hand-built reader also reads these clean renders: pitch F1 1.0000 and rhythm F1 1.0000 on *Sunless* 1 page 1, 66 of 66 notes, by July's scorer (`claude/e16-CLOSE_2026-07-29.md`, section 2). The two readers part on scans: 41 to 73 for Ilya's, 81 to 97 for homr, on the five build songs.
- homr is AGPL-3.0 and Ilya is MIT. That question is unchanged by this memo and is the appraisal's to lay out.
