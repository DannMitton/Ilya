# Report: the yardstick (plan r4 phase 0), run 1

Written 2026-10-02 by Code in the cloud lane (Sonnet 5.5). Branch `cloud-lane`, started from `origin/Shane` at `887931f` (fast-forward, then pushed). Working tree clean before this file. **No product code changed. Nothing was added to the repository except this report.** No package file, lockfile, or workspace file was touched.

## What was measured

How well outside engines read the vocal line of a real scan whose truth we hold.

- **Scan:** `tools/e16-harness/scans/pdfjs400-1.png` and `pdfjs400-2.png` (3699 x 4920 px each), Mussorgsky, Sunless 1, Lamm edition. Both pages were given to the engines unaltered.
- **Truth:** `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`, part P1 (Bass), counted from the file: **18 bars, 97 notes, 19 rests**, no grace notes, all 97 notes carry a lyric.
- **Printed bars, counted by eye on both scan pages:** 9 voice bars on page 1 and 9 on page 2, so 18. This agrees with the truth.
- **What the scan prints differently from the truth** (seen on the images and in the file): the scan engraves the voice in the treble clef, the truth in the bass clef. The scan prints 6/4 throughout; the truth declares 6/8 in bar 1 and 12/8 after it. Note lengths still agree as written values (a quarter is 1/4 of a whole in both), which is what was compared. The truth's bar 1 carries no `<note>` element; the scan's first voice bar is a rest bar.

## Method

- Machine: 4 CPU cores, 15 GB, no GPU, Linux. Engines ran on CPU through onnxruntime. Scratch virtual environments live in the session scratchpad, outside the repository.
- **Scoring is mine, in scratch Python, not the harness scorer.** The two note sequences (notes only; rests excluded; chord tones after the first excluded) are lined up in order by dynamic programming. A pair scores 3 for the right pitch and 2 for the right length; a gap costs 1. A missing note and an extra note are both allowed. Bar numbers are never used.
- **Octave:** the alignment is run at every whole-octave shift from -3 to +3. The shift that gives the most right pitches is reported. **Both engines: the best shift is +12 semitones (one octave up from the truth)**, which is the bass-to-treble difference. No other shift gave more than 1 right pitch (homr: shift 0 gave 0, -12 gave 0, +24 gave 1).
- **Right length** means the engine's note duration equals the truth's as an exact whole-note fraction.
- "Paired" means the aligner matched a truth note with an engine note, right or wrong. It is a generous number because a wrongly read note still pairs. Use the "right" counts.

## Results

| | homr 0.7.0 (AGPL) | oemer 0.1.8 (MIT) | Audiveris (AGPL) |
|---|---|---|---|
| Ran | **Yes**, both pages, exit 0 | **Yes, after two library pins** (below), both pages, exit 0 | **No, not fetched** |
| Minutes per page | **0.39 and 0.39** (23.7 s, 23.3 s), models already cached; the first run was 36.3 s and 23.0 s with the model download inside page 1 | **10.1 and 7.5** (606 s, 450 s), nothing else running | not run |
| Bars found (truth 18) | **18** (9 + 9) | **20** (10 + 10) | not run |
| Notes found (truth 97) | **93** | **91** on staff 1, 82 on staff 2 (see below) | not run |
| Pairs made | 92 (5 truth notes unpaired, 1 engine note extra) | 74 (23 missing, 17 extra), staff 1 | not run |
| Right pitch (of 97) | **88** (90.7%) | **41** (42.3%), staff 1 | not run |
| Right written length (of 97) | **85** (87.6%) | **40** (41.2%), staff 1 | not run |
| Both right (of 97) | **82** (84.5%) | **28** (28.9%), staff 1 | not run |
| Words under the voice | no lyric or text element in the output of either page | no lyric or words element in the output of either page | not run |

### homr

- Output: two MusicXML files, each with two parts. Part P1 holds two staves: staff 1 is the voice and staff 2 is the piano's upper staff. P2 is the piano's lower staff. The voice was taken as P1 staff 1. This was confirmed by reading: its first measure is a rest, its clef is G, and the pitches line up with the truth an octave up.
- Voice staff: 9 measures per page, 18 in all, equal to the truth. Clef read as G on both pages.
- Notes: 93 against 97. 92 paired, 88 with the right pitch, 85 with the right length, 82 with both.
- Observed in the first notes: the truth's first sung note is A3 (MIDI 57) and homr's first note is A5 (MIDI 81), a pitch error of two octaves on that note; the rest of the first 20 line up at +12 apart from a length error on the tenth note (the truth reads a dotted quarter, 3/8; homr reads a half, 1/2).
- The log reports "Removing tuplets from measure # 1" and "# 10" on page 1. What was removed there was not examined.
- Repeatability: a second full run produced byte-identical MusicXML on both pages.

### oemer

- It failed twice before it ran. Neither failure is a model download refusal.
  1. `pip install oemer` brought onnxruntime-gpu 1.30.0, which rejected oemer's model at load: `Attribute pads must not contain negative values` on a ConvTranspose node. Fixed by installing onnxruntime 1.18.1.
  2. After about 7 minutes of inference, page 1 crashed at `oemer/bbox.py` `find_lines` with `IndexError: invalid index to scalar variable`, with OpenCV 5.0.0.93 installed (the return shape of `HoughLinesP` changed). Fixed by pinning opencv-python-headless 4.10.0.84 and numpy 1.26.4. One in-between attempt with OpenCV 4.14 pulled numpy 2.x back in and onnxruntime 1.18.1 would not import; it failed in 3 seconds and was undone.
  3. The final run is therefore on **onnxruntime 1.18.1, numpy 1.26.4, opencv-python-headless 4.10.0.84**. The minutes per page above are from the clean final run. The crashed run's 412 s on page 1 is not reported as a time.
- Its model checkpoints came from `https://github.com/BreezeWhite/oemer/releases/download/checkpoints/` (the URLs are in `oemer/inference.py`), and that host **did answer**.
- Structure of the output: one part, **one staff pair**, 10 measures per page. oemer did not separate the voice staff from the piano. Its two output staves each mix voice and piano material (page 1 measure 1: staff 2 holds E5, D4, F4, A4, staff 1 holds D3, A3, rests). So there is no clean "voice staff" to score.
- The figures in the table are for **staff 1, the better of the two staves, picked after seeing the scores**, which flatters oemer. Staff 2 scored 29 right pitch, 41 right length, 15 both, of 97. All notes of both staves together is not a meaningful reading of the voice (173 notes for 97) and is not tabulated beyond this sentence: 97 pairs, 52 right pitch, 61 right length, 38 both.
- The log prints "Note 0 is not a valid note", "Note 16", "Note 99", "Note 103" for page 1; four lines, not examined further.
- Bars: 20 found against 18, but with the voice and piano mixed this count is not a count of voice bars.

### Audiveris

- Java is present: OpenJDK 21.0.11.
- **Refused:** a request to `https://api.github.com/repos/Audiveris/audiveris/releases/latest` returned HTTP 403 with the body "GitHub access to this repository is not enabled for this session", and a request to `https://github.com/Audiveris/audiveris/releases/latest` returned HTTP 403 through the session's proxy. Both are from the agent proxy, for the `Audiveris/audiveris` repository. I did not add the repository to the session, and I did not try another host or mirror. Audiveris was not installed and not run.

### Words under the voice (Russian and German)

- homr: the output has no `<lyric>`, `<words>` or `<credit-words>` element on either page. Its log prints "Found title:" with nothing after it. It reads no Russian and no German.
- oemer: no `<lyric>` or `<words>` element on either page.
- Whether the words were read as note shapes: homr made one extra note beyond the 97 truth notes, so the words did not produce a visible flood of notes there. For oemer 17 extra notes on staff 1 were counted, but its staves are mixed, so those are not attributable to the words. **Not established for either engine** which, if any, of the extras came from text.

## Reading the numbers

- On this one scan, homr is a strong outside reader of the vocal line (18 of 18 bars, 82 of 97 notes with pitch and length both right, after shifting one octave), and it keeps its voice staff separate.
- oemer, on the same scan, found 41 right pitches of 97 on its best staff and did not isolate the voice. Neither engine reads the words.
- Neither engine gives a lyric. The truth's 97 syllables are not recoverable from either output.

## NOT ESTABLISHED

- **Audiveris**: not fetched (403 from the proxy on github.com and api.github.com for that repository). Nothing is known about it from this run.
- **One scan, one song.** These are measurements of this scan only. Whether homr's result holds on the Tchaikovsky and Kalmus pages, other engravings, or older ones is not tested here.
- **homr's model host** is not recorded: its models downloaded (51 MB, 46 MB, 37 MB) on the first run, and I did not find the host in its source. The oemer host is recorded above.
- **Why homr's first note is two octaves off**, what its tuplet removal on measures 1 and 10 changed, and what oemer's four "not a valid note" lines changed: not looked into.
- **oemer's staff choice** is made with the answer in hand. A blind choice would not have been better than the table's figure for staff 1 and might have been the worse staff.
- **Time per page** is one run each on a 4-core CPU box with onnxruntime. The numbers are not a prediction for the app's own pipeline or for a Mac, and the page-1 homr figure of 36 s from the first run contains a model download.
- **Cross-check of the scorer**: it is new scratch code, not the harness's `scorer.ts`, and it was not run against the harness's perfect and corrupted fixtures. I did check by hand that the 18 truth bars, 97 notes, and 19 rests match the file's own count, and that the homr alignment's first 20 notes read sensibly beside the truth's.
- **Licence note**: homr and Audiveris are AGPL and oemer is MIT. This run only measured them. None was added to the repository or any package file; the virtual environments are in the scratchpad.
