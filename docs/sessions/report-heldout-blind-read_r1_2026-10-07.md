# The unseen set read blind: 935 of 960 printed notes right, 61 extra (r1, 2026-10-07)

> Provenance, added by the desk (Opus): a Sonnet helper in the desk's cloud workspace, 2026-10-07 about 01:35 to 02:30, on a clone of `Shane` at `5c0f557` (homr-web `0.2.0-ilya.4`, model 465), headless Chromium 141, WebAssembly, no WebGPU adapter. It passed the scans and truth to its scripts and saw only score lines and counts. Truth is the Opus helper's draft by eye (`report-heldout-truth_r1_2026-10-07.md`), not checked by Dann. NOT SCORED on WebGPU or on Dann's iMac. Outputs: `~/Downloads/_desk-2026-10-07/heldout-out.tgz`. Its final message, transcribed by script, unedited:

All eight held-out songs were read and scored. None failed, so no retry was needed.

I never opened, listed or printed anything in `scans/` or `truth/`. A script looped over the PDFs, and I saw only the score lines, meta JSON and counts. Nothing in Ilya, the reader or the scorer changed. The runner is `/home/claude/heldout/harness/run-heldout.sh`. The category counts come from `categorize.py`, which only reads the score and truth files; it prints no bar numbers or note names.

## 1. Per song

All eight read on single-threaded WebAssembly, as the earlier runs did.

```
cui_op11-4_kogda-golubymi-glazami: 67 of 69 printed notes right (97.10); missing 0; extra 0; pitch misreads 2; length misreads 0; bars equal 9 of 12 (read 12); shift 0   [251.7 s, 2 pages]
cui_op62-12_geroi-vremeni: 79 of 79 printed notes right (100.00); missing 0; extra 0; pitch misreads 0; length misreads 0; bars equal 13 of 16 (read 16); shift 0   [230.9 s, 2 pages]
glazunov_op27-2_vostochnyi-romans: 126 of 126 printed notes right (100.00); missing 0; extra 0; pitch misreads 0; length misreads 0; bars equal 14 of 17 (read 17); shift 0   [293.0 s, 3 pages]
grechaninov_op20-4_uznik: 153 of 154 printed notes right (99.35); missing 0; extra 38; pitch misreads 1; length misreads 0; bars equal 54 of 58 (read 70); shift 0   [566.3 s, 5 pages]
gurilyov_no-op-6_raskayanie: 138 of 153 printed notes right (90.20); missing 0; extra 1; pitch misreads 0; length misreads 15; bars equal 27 of 31 (read 32); shift 0   [332.5 s, 3 pages]
napravnik_op25-3_dlya-beregov: 230 of 231 printed notes right (99.57); missing 0; extra 0; pitch misreads 1; length misreads 0; bars equal 45 of 50 (read 50); shift 0   [598.9 s, 5 pages]
scriabin_no-op_romans: 81 of 85 printed notes right (95.29); missing 0; extra 0; pitch misreads 4; length misreads 0; bars equal 16 of 20 (read 20); shift 0   [276.1 s, 3 pages]
varlamov_no-op_skazhi-zachem: 61 of 63 printed notes right (96.83); missing 0; extra 22; pitch misreads 0; length misreads 2; bars equal 22 of 26 (read 37); shift 0   [304.8 s, 4 pages]
```

## 2. Totals across the eight

- **Notes right:** 935 of 960 printed notes (97.40 percent).
- **Missing:** 0.
- **Extra:** 61 (grechaninov 38, varlamov 22, gurilyov 1).
- **Pitch misreads:** 8.
- **Length misreads:** 17 on notes. Two rests were also read at the wrong length; those are not in the 17.
- **Bars equal:** 200 of 230 truth bars. 254 bars were read.

## 3. Counts by category

**Pitch misreads (8).** I classified them by interval size, not by letter.
- Octave: 0.
- One semitone: 2.
- Two semitones: 6.
- Anything larger: 0.

The truth files carry only MIDI numbers, with no note spelling. So "same letter with a different accidental" versus "different letter" is not established. A one-semitone error is consistent with an accidental misread, but it could also be a different letter (E to F, B to C).

**Length misreads on notes (17).**
- Read longer: 15, none of them with a dot or triplet marked on the read note.
- Read shorter: 2, both with a triplet marked on the read note.
- Read length against truth length, a 3/2 ratio: 12, all in one song (gurilyov).
- A 2/3 ratio: 2.
- A 2x ratio: 2.
- An 8x ratio: 1.
- The 12 at 3/2 are read longer with no dot or triplet marked. I infer that the truth has triplets the reader missed, but the score file does not say so.

**Rest length misreads (2).** Both were read shorter, at 2/3 of the true length. One of the two has a triplet marked on the read rest.

## 4. Tokens and what I could not establish

**Tokens used:** about 40,000 for this task, within the 150,000 budget. About 95,000 earlier.

**Could not establish:**
- **Letter versus accidental split.** It cannot be made from the truth files. I classified pitch by interval instead, as above.
- **Dot and triplet in the truth.** The scorer records durations only, so whether the truth has a dot or triplet comes from the length ratios and the reader's own markings, not from the score file.
- **Causes of the extras and shortfalls.** I did not look into the 38 extra notes in grechaninov or the 22 in varlamov, nor why varlamov reads 37 bars against 26 in the truth. Both were not investigated.
- **Timings.** They are headless WebAssembly in this sandbox, not comparable with the iMac.

Files are in `/home/claude/heldout/harness/`:
- `heldout-results.txt`
- `out-heldout/` (the MusicXML, `*.meta.json`, `*.read.json` and `*.score.json` per song)
- `categorize.py`
- `run-heldout.sh`