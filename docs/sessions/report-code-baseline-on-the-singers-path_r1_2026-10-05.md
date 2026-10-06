# Report: the baseline on the singer's path (r1, written 2026-10-06 about 00:25)

Code (Sonnet 5.5), runbook step 3. Nothing in Ilya was changed. Tree at `bbe524b`, clean outside `docs/`. Results: `docs/sessions/baseline-on-the-singers-path_r1_2026-10-06/` (`joined/`, `score/`, `read-meta.json`, `console.log`, `baseline-read.cjs`).

## How it was read, and one departure to know about

- Chrome: Dann's installed Google Chrome, headed, fresh profile, brought to front (`visibilityState` visible). Ilya's dev server on port 5199, which I started and stopped; `lsof` listed no other node server first.
- Pages: `kit/pages/*.png` from `resume-kit.tgz`, unpacked in my scratchpad, never in the repository.
- **Departure.** Ilya's intake takes one picture per drop, and each drop replaces the song, so I did not drop the pages one by one. I called Ilya's own reader, `readScanPages` in `apps/web/src/lib/omr/homr-reader.ts`, from the page, with every page of a song as one list. That is the module the drops use: it chooses the path itself (`path-choice.ts`), reads page by page, and joins with `joinPages`. What I skipped is the intake UI, its rasterizing of PDFs, and the `[omr] homr read` console line (that line is written by `scan.ts`, which I did not call; the times below are from the reader's own result).
- **Path:** every song read on `webgpu` (`backend` in each result; the adapter is the step 1 one, `shader-f16` present). Times for the whole song: Tchaikovsky 3 pages 42.4 s; *Sunless* 1, 2 pages 17.8 s; 4, 2 pages 24.7 s; 5, 7 pages 90.1 s; 6, 6 pages 63.2 s.
- Scoring: the pipeline in `measure-checks_r1_2026-10-05/scripts/scorer/` unchanged (`conv.py`, then `score.ts` in `full` mode), run with Node's own type stripping (no `tsx`). *Sunless* 2 and 3 were not run. The songs are tch = tch-1 to 3, sun1 = sun-01 to 02, sun4 = sun-03 to 04, sun5 = sun-05 to 11, sun6 = sun-12 to 17.

## The baseline

Notes right, of the printed notes, "right" meaning pitch and length as printed (`bothRight`, under the song's octave shift).

| Song | Notes right of printed | Score | Bars all right | Notes: wrong pitch / wrong length / missing / extra | Rests (length right of printed) | Read time |
|---|---|---|---|---|---|---|
| Tchaikovsky Op. 38 No. 3 | 172 of 174 | 98.85 | 81 of 99 | 2 / 0 / 0 / 0 | 48 of 48 | 42.4 s |
| *Sunless* 1 | 94 of 96 | 97.92 | 16 of 18 | 0 / 2 / 0 / 0 | 19 of 19 | 17.8 s |
| *Sunless* 4 | 116 of 116 | 100 | 27 of 29 | 0 / 0 / 0 / 0 | 29 of 29 | 24.7 s |
| *Sunless* 5 | 247 of 258 | 95.74 | 47 of 61 | 8 / 3 / 0 / 28 | 46 of 48 (1 missing, 7 extra) | 90.1 s |
| *Sunless* 6 | 156 of 161 | 96.89 | 43 of 55 | 5 / 0 / 0 / 0 | 26 of 26 | 63.2 s |

- The Tchaikovsky is the three `tch-*.png` pages. Through the PDF the singer drops (step 2b), the same song scores 98.28 (171 of 174): a different raster of the same pages gives one more wrong pitch, bar 39.
- Octave shift chosen by the scorer: 0 for the Tchaikovsky and *Sunless* 4; 12 for *Sunless* 1, 5, and 6.
- **Against the file** (`measure-checks_r1_2026-10-05/score/`, readings by the port on WebAssembly): the joined voice parts of *Sunless* 1, 4, and 6 are equal to the file's, and the scores are the same. The Tchaikovsky differs only in how the XML is written (one is OCR'd for a title, `ocr: false` here) and scores the same. ***Sunless* 5 differs in one note**: the half note F sharp 4 at truth bar 57 (reading bar 65, page sun-11) is read as a dotted half here, and as a half in the file. The one difference of event 335 of 340, from the events of `conv.py`; no other event of any song differs in pitch, length, or type. So the WebGPU read of step 1's brief is not byte-for-byte the WebAssembly read: on these 20 pages it differs in one note, and in a tremolo mark's place and a note's spelling inside the footnote (XML only, not scored). Step 1 compared one song only.

## Every difference, with its cause

Cause sources: the on-file report `report-opus-the-checks-measured_r1_2026-10-05.md` and its tables (`4a-differences.csv`, `4d-pitch-differences.csv`), which describe the same reads. **I did not look at the page scans.** Where a cause is the on-file report's, I say so; what I add is the check that my read has the same difference.

**Tchaikovsky (2)**
| Truth bar | What was read | Cause |
|---|---|---|
| 35 (page tch-2, bar 9) | D sharp 4 for D4, an eighth | An accidental: the semitone off is +1 under key 2 sharps; the on-file table marks it `accidentalOnly`. Why homr wrote the sharp is NOT ESTABLISHED. |
| 67 (page tch-3, bar 6) | G sharp 4 for G4, an eighth | An accidental, +1 semitone, key 3 sharps, `accidentalOnly`. The same. |

**Sunless 1 (2)**
| Truth bar | What was read | Cause |
|---|---|---|
| 16 (sun-02, bar 8), two notes | a half note E4 where the truth has a dotted quarter (3/8), twice | Length: two dotted quarters written as halves (the on-file report, 4a). Why NOT ESTABLISHED. |

**Sunless 4:** none. Two bars are not "all right" with no note difference at all; why is NOT ESTABLISHED (same figures in the file).

**Sunless 5 (48 differences)**
| Where | Differences | Cause |
|---|---|---|
| Truth bar 0, page sun-05 bar 1 | a rest read as an eighth rest (truth 1/12), the next note a quarter (truth 1/6) | The triplet: the tuplet was misread, and the bar adds to 9/8 (on-file 4b). |
| Truth bar 1, sun-05 bar 2 | two pitches, C4 for D (truth 50, two notes), 2 semitones off | Not an accidental (`accidentalOnly` false). Cause NOT ESTABLISHED by the on-file report. |
| Reading bars 4 to 11 (sun-05): 34 of the 35 extra events (27 notes, 7 rests) | extra events | **A footnote.** The small system printed under the song (the autograph's first sketch of the opening) is read as part of the song: 8 bars, 27 notes, 7 rests, and every later bar is 8 bars off the truth. The on-file report looked at the page and says so (`evidence/sun-05-small.png`); I did not. |
| Truth bars 14, 22, 33, 51 | G sharp 4, C sharp 5, G sharp 4, E sharp 4 where the truth has the natural: +1 semitone | Accidentals (`accidentalOnly`); the on-file report: printed double sharps and naturals; which is which is not mapped one by one there. |
| Truth bars 26, 29 | C4 for D; G4 for A: -2 semitones | Not an accidental. Cause NOT ESTABLISHED. |
| Truth bar 42 | a missing note, then a quarter A sharp 4 where the truth has an eighth | An eighth written as a quarter, its rest dropped (on-file 4a). |
| Reading bar 64 (sun-11): the 35th extra event | one extra note | An ossia: a small E5 above the sung F sharp 4, read as a second voice (on-file `evidence/sun11-b65.png`). |
| Truth bar 57 (reading bar 65, sun-11) | the half note F sharp 4 read as a **dotted half** | **New in this read**: the file's WebAssembly read has it right. Cause NOT ESTABLISHED. It sits in the bar that holds the ossia, but I did not look at the page or the XML for why the dot was written. |

**Sunless 6 (5, all pitch)**
| Truth bar | What was read | Cause |
|---|---|---|
| 20 (sun-14) | F4 for G, -2 | Under a key the page prints as 7 sharps, a note the key sharpens (`keyGivesStep` 1): not an accidental by the on-file table; the on-file report names one read "under a misread key". Which of these five is that one is NOT ESTABLISHED. |
| 21, 22 (sun-14); 43 (sun-16) | G sharp 4 for A, -1 | The same kind of note, keyed 7 sharps; each is one semitone down from the truth. |
| 35 (sun-15) | B sharp 4 for B, +1 | An accidental, `accidentalOnly`. |

## NOT ESTABLISHED

- **That a drop of the same pages through the intake gives the same reads.** I called the reader directly, not the UI; the Tchaikovsky through the PDF path scored 98.28 in step 2b, one note lower than the PNG pages here.
- **The causes marked so above.** I did not open the page scans, so every cause is the on-file report's or "not established".
- **Why *Sunless* 4 has two bars not "all right" with no difference, and why bars are not "all right" in *Sunless* 1 and 6 beyond the differences listed:** a bar is spoilt by any note it holds, which the differences account for; the *Sunless* 4 case has no difference to account for it.
- **Why WebGPU and WebAssembly differ by one note on *Sunless* 5, and whether they differ elsewhere:** one run of each song on WebGPU; the WebAssembly reads are the file's (the port, in the cloud), not a run on this iMac.
- **The test-only songs** (*Sunless* 2 and 3): not run, as told.
- **Repeat runs:** one read of each song; no spread.
