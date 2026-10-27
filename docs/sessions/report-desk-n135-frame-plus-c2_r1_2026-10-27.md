# Report: C2 seating on the framed readings (desk helper, 2026-10-27, r2)

Measure only. Nothing outside `/root/measures/n135-combined/` was written. No git write command was run. This revision replaces r1 (which stopped because the crops and word lists were missing).

## The answer

C2 seating on the framed readings (`ocr2-f6-h32-B`, 2,086 of 2,538 read right), on the same 2,385 truth syllable notes:

| credit | C2 framed | C2 unframed | delta | rule 2 unframed | delta | rule 2 framed |
|---|---|---|---|---|---|---|
| (b) exact | **1,831** | 1,630 | +201 | 1,622 | +209 | 1,798 |
| (a) nucleus | **2,032** | 1,955 | +77 | 1,815 | +217 | 1,917 |
| (c) word-exact | **1,166** | 812 | +354 | 792 | +374 | 1,139 |

Within the framed readings, C2 beats rule 2 by +33 (b), +115 (a), and +27 (c). Unframed, the margins were +8, +140, and +20. The frame gives most of the gain under (b) and (c); the cut-and-place step still gives the larger share under (a), but less than before (+115 against +140).

## Control 1 (positive)

Written before the run (`controls-before-measure.md`, stamp `.t0`). Lever 2's `step1c.py`, copied to `work/` with only paths changed, on the unframed readings: rule 2 1,622 / 1,815 / 792, the rule 3 machinery check REPRODUCED (1,552 / 1,762 / 771), and **C2 1,630 / 1,955 / 812, reproduced exactly** (`log-control1-step1c.txt`). Control 2's expectation (gains smaller than the 211 read-right gain under (b) and (a)) held for (a) only, and failed for (b) (+201 against 211, about equal) and for (c) (+354, larger). The word-exact credit gained most because a right word needs every syllable of it right, and the frame lifted the reading of whole words.

## Per-song table (16 seated songs; K and M are not in lever 2's seating set)

| song | truth notes | (b) C2 unframed | (b) C2 framed | (a) C2 unframed | (a) C2 framed | (c) C2 unframed | (c) C2 framed |
|---|---|---|---|---|---|---|---|
| U1 | 96 | 93 | 93 (+0) | 95 | 94 (-1) | 27 | 32 (+5) |
| U4 | 108 | 86 | 90 (+4) | 97 | 99 (+2) | 37 | 40 (+3) |
| U5 | 251 | 203 | 216 (+13) | 228 | 231 (+3) | 112 | 149 (+37) |
| U6 | 144 | 95 | 95 (+0) | 114 | 109 (-5) | 39 | 59 (+20) |
| P | 172 | 122 | 127 (+5) | 153 | 153 (+0) | 59 | 67 (+8) |
| B01 | 146 | 106 | 132 (+26) | 130 | 142 (+12) | 55 | 97 (+42) |
| B02 | 146 | 60 | 67 (+7) | 70 | 71 (+1) | 35 | 56 (+21) |
| B03 | 146 | 99 | 126 (+27) | 122 | 137 (+15) | 50 | 93 (+43) |
| B04 | 146 | 104 | 113 (+9) | 121 | 128 (+7) | 48 | 59 (+11) |
| B06 | 140 | 72 | 93 (+21) | 103 | 117 (+14) | 32 | 50 (+18) |
| B07 | 148 | 93 | 101 (+8) | 119 | 122 (+3) | 18 | 45 (+27) |
| B08 | 140 | 92 | 111 (+19) | 113 | 121 (+8) | 39 | 65 (+26) |
| B09 | 146 | 87 | 111 (+24) | 117 | 126 (+9) | 44 | 88 (+44) |
| B10 | 146 | 84 | 95 (+11) | 104 | 107 (+3) | 46 | 60 (+14) |
| S | 114 | 85 | 96 (+11) | 97 | 99 (+2) | 73 | 90 (+17) |
| T | 196 | 149 | 165 (+16) | 172 | 176 (+4) | 98 | 116 (+18) |
| **all 16** | 2385 | 1630 | 1831 (+201) | 1955 | 2032 (+77) | 812 | 1166 (+354) |

Source: `log-framed-step1c.txt` and `log-control1-step1c.txt`. Against C2 unframed, only two cells fall: U6 (a) -5 and U1 (a) -1. No song falls under (b) or (c).

## Read-right count under the frame

Summed from `n135-row117/results/f6-h32-B.json`: **2,086 of 2,538**, reproduced.

## How I mapped the boxes back

1. **Where boxes were recorded.** Tesseract's pixels in the framed crop, plus the row's `x0` and `y0` from `rows2/<song>.jsonl` (`read-dfloat-chrome.mjs`). So a framed box is in framed pixels with the offset added.
2. **Regenerating each crop's geometry** (`map_boxes.py`, importing row 117's own `clean.py` functions, reading nothing with the reader). For each of the 589 rows: load `/root/n135work/crops2/<name>`, rotate by the saved angle from `n135-row117/results/angles.json` about (w/2, h/2) with `deskew`, close 3 by 3 with `close_ink`, measure the ink extent with `ink_rows_extent`, set f = 32 / extent, new size (round(w f), round(h f)). The framed size is that plus 16 px on each side. Per-crop sizes are in `crop-geometry.json`.
3. **Inverting.** For each box corner: subtract `x0`, `y0`; subtract the 16 px pad; divide x by round(w f)/w and y by round(h f)/h (the exact ratios the resize used); undo the rotation with `cv2.invertAffineTransform` of the same rotation matrix; add `x0`, `y0` back. The four corners are mapped and the box is their bounds. Rows with no ink skip the scale, as `clean.py` does.
4. **Checks.**
   - No box of the 589 rows' words lies outside the regenerated frame (0 outside), and the rightmost word edge is 0.905 of the frame width at the median and never above 0.997. A wrong scale would push boxes outside or leave them hugging a smaller frame. This is a bound, not a proof: the reading carries no image size.
   - Against the unframed readings, 1,569 words that occur once in the same row in both readings (two letters or more) have mapped centres within a median of 0.5 px of the unframed centre (median signed difference 0.0; 90th percentile 8 px; 67 words differ by more than 40 px, which I did not examine, most likely different readings of the same text). This check uses the unframed boxes only to test the mapping, not to seat anything.
5. **Seating.** The mapped readings replaced `ocr2/<song>-dfloat.json` in a copy of the lever 2 harness (`work_framed/`), and `step1c.py` was run unchanged.

## Departures

- The brief named `ocr2-f-h32-B-b9/` and `-c9/`; those are the white-padded run (2,041). I used `ocr2-f6-h32-B/` (paper-tone padding, the 2,086 run), as the coordinator's second message directs.
- Paths in the copied harness were changed (`/home/claude/n135-lever2`, `/home/claude/ilya` to this machine's copies, `/root/lanes/shane`), and `npx --no-install tsx` was replaced by the installed `tsx` binary. `common2.modern` now primes the normaliser cache for a token it has not seen instead of raising a KeyError, because the framed readings hold tokens the unframed cache lacks. The normaliser (`modernisePreReform`) and the engine syllabifier run unchanged. The framed run found 209 seated systems against 210 unframed.
- The control used a first copy (`work/`); a path slip ran my first framed attempt on the unframed readings (it printed the unframed numbers). I caught it because the rule 2 baseline did not move, fixed the path in `work_framed/`, and deleted that output. The numbers above are from the corrected run.

## What I could not establish

- That the regenerated size equals the size the reader saw, pixel for pixel. The readings carry no image dimensions, so the check is the bound and the unframed correspondence above. NOT ESTABLISHED beyond those.
- The 67 words with a mapped centre more than 40 px from the unframed one (not examined).
- Whether the gain survives a second run of the reader or other vertical offsets; the row 117 noise floor (+6 and +19 on a nine-song total) applies to the read-right count, and I did not repeat the seating on a shifted frame.
- K and M, which lever 2's seating does not cover.
- NOT ESTABLISHED beats a complete invented answer.

## Files

`controls-before-measure.md`, `map_boxes.py`, `check_map.py`, `crop-geometry.json`, `log-control1-step1c.txt`, `log-framed-step1c.txt`, `pertable.md`, `work/` (control copy), `work_framed/` (mapped readings in `harness/ocr2/`, framed run).
