# Report, N.200 path picker, Step 1 (r2): Burg, against known answers, under the desk's amendment

Cloud lane 62, branch `cloud-lane-62`. Brief `brief-code-n200-path-picker_r3_2026-11-16.md`, Step 1, as replaced by the desk's amendment of 2026-11-17 (r2, reviewed by Fable). It supersedes `report-code-n200-path-step1_r1_2026-11-17.md`, which stays as the record of the stop. In this report "the gates" means the changed files' tests; the eight gates are reported once, at the end of the lane (desk rule, `ENVIRONMENT.md`).

## Result

**All three tests pass. Step 1 is done.** The `it.fails` tests of r1 are gone, replaced by the three tests below.

## What changed

- `apps/web/src/lib/voice/engine/burg.test.ts`: rewritten, three tests (5 cases).
- New `apps/web/src/lib/voice/engine/burg-fixtures.ts` (test support, nothing in the app imports it): the known filter, the noise records, the 13 takes, `percentile`, and the call into the Python helper.
- New `tools/n200-score/burg_ref.py`: imports `tools/i-extractor-check/burg.py` unedited and prints what its functions give (coefficients and roots; frames; a resampling level comparison). Writes no bytecode. `burg.py` itself is untouched.
- New `tools/n200-score/burg-check.run.ts` (not a gate): prints the numbers below. `tools/n200-score/vitest.config.ts` gained it in `include`.
- `burg.ts` is unchanged since r1. No `dsp.ts` change.

Not in the brief's Owns, so for the desk to confirm: `burg-fixtures.ts`, `burg_ref.py`, `burg-check.run.ts`, and the config's `include`.

## Test 1, identity

Fixed signals: the Test 2 record of seed 1, and one windowed frame (offset 5000 of the 10 kHz take, pre-emphasised, 500-sample Gaussian window) of the fry-synth take of seed 4242. `burg.ts` coefficients agree with `burg.py`'s `burg()` to **1e-9** and the roots' frequencies to **0.01 Hz**, on both. PASS. This shows `burg.ts` is the recursion of `burg.py`. Neither is checked against Burg's pages (NOT ESTABLISHED).

## Test 2, known poles from noise

Rate 10 kHz; poles 500, 1500, 2500, 3500, 4300 Hz; bandwidths 60, 90, 120, 150, 200 Hz. Uniform zero-mean white noise (`rng(seed)` mapped to [−1, 1), `fry-synth.ts`), through the filter, first 1,000 samples dropped, 80,000 kept (8 s). **Records: seeds 1 to 20** of `noiseRecord` (`burg-fixtures.ts`). Recursion and roots only. Bar (DESK DEFAULT): every pole within 1 percent on every record. **PASS.**

| Pole (Hz) | Largest error over 20 records (Hz) | (percent) |
|---|---|---|
| 500 | 1.58 | 0.317 |
| 1500 | 2.43 | 0.162 |
| 2500 | 1.69 | 0.067 |
| 3500 | 2.73 | 0.078 |
| 4300 | 3.06 | 0.071 |

**Impulse response of the same filter, reported, no bar:** recovered 504.06, 1499.26, 2495.58, 3497.41, 4294.54 Hz (errors +4.06, −0.74, −4.42, −2.59, −5.46 Hz), bandwidths 9.1, 14.4, 20.8, 27.8, 58.4 Hz against 60, 90, 120, 150, 200. Burg on a decaying impulse response pulls the poles toward the unit circle; this measures the signal, not the code (the desk's words, and Test 1 agrees).

## Test 3, against `burg.py`

**Item 1, the same input, on all 13 takes: PASS.** For each take, `burg.ts`'s own resampled signal at 10 kHz was rounded to 16 bits and written with `wavBytes` as a 10 kHz WAV in the temporary folder (removed after); `burg.py --json` was not used for this item, its frame loop was called through `burg_ref.py` on that WAV unedited (at 10 kHz its resampler changes nothing); `burg.ts` ran on the same rounded samples (÷ 32768, as `burg.py` reads them) with its resampler skipped. Frame counts are equal on every take (396 for the first, 557 for the others), and the largest difference in any of the 25th, 50th, and 75th percentiles of F1 and F2 is **1.5e-11 Hz** (bar 0.1 Hz). So no defect in pre-emphasis, window, framing, recursion, or `polyRoots` shows on these takes. Python's round-half-even for the hop (62.5 samples is 62) is reproduced in `burg.ts`; without it the frame counts differ by 7 (r1 saw 389 against 396).

**Item 2, the whole pipeline at the ceiling `burg.py` fixes, 5000 Hz (`burg.py:28`), 48 kHz take in, each side with its own resampler.** fR1 medians within 3 percent on all 13 takes: **PASS** (largest 1.56 percent). fR2 medians reported, no bar:

| Seed | Take | fR1 burg.ts / burg.py (Hz) | fR1 diff | fR2 burg.ts / burg.py (Hz) | fR2 diff |
|---|---|---|---|---|---|
| 4242 | own | 578.9 / 577.2 | +0.30% | 848.9 / 904.4 | −6.14% |
| 5000 | bass i | 296.2 / 295.4 | +0.29% | 1706.7 / 1706.8 | −0.01% |
| 5080 | bass ɛ | 517.8 / 511.6 | +1.21% | 1306.0 / 1297.9 | +0.62% |
| 5180 | bass u | 302.9 / 302.4 | +0.18% | 783.7 / 780.9 | +0.36% |
| 5240 | baritone ɪ | 515.1 / 514.8 | +0.07% | 1729.0 / 1729.5 | −0.03% |
| 5340 | baritone ʌ | 592.8 / 595.1 | −0.38% | 1255.0 / 1258.8 | −0.30% |
| 5420 | tenor e | 563.5 / 570.1 | −1.15% | 625.4 / 1797.7 | **−65.21%** |
| 5520 | tenor ɑ | 642.4 / 647.7 | −0.82% | 943.4 / 797.4 | **+18.31%** |
| 5600 | mezzo i | 344.0 / 346.2 | −0.64% | 1658.9 / 1742.7 | **−4.81%** |
| 5660 | mezzo ɨ | 445.6 / 446.8 | −0.27% | 1306.9 / 1318.3 | −0.86% |
| 5760 | mezzo o | 553.9 / 562.6 | −1.56% | 1026.9 / 1037.1 | −0.99% |
| 5820 | soprano e | 559.5 / 560.2 | −0.13% | 1849.3 / 1864.1 | −0.79% |
| 5940 | soprano ʌ | 635.4 / 640.9 | −0.86% | 960.6 / 957.9 | +0.28% |

The "take" column is the set's cell with combination k = 0; seed 4242 is the r1 take (own settings).

**The four takes outside 3 percent (on fR2; none on fR1).** For each: the share of frames in which each pipeline finds a pole between F1 and F2, and the level difference of `resampleTo`'s output against scipy's `resample_poly` (5/24 at 48 kHz to 10 kHz; Welch, 2,048 samples; summed power by band, burg.ts minus scipy).

"Between" is my reading: a pole strictly between 1.15 times the take's truth fR1 and 0.85 times its truth fR2 (a margin so the real F1 and F2 do not count). **The desk to confirm this reading**; with another margin the shares move.

| Seed | Take | Frames with a pole between: burg.ts | burg.py | Level, burg.ts minus scipy (dB), 0-1, 1-2, 2-3, 3-4, 4-5 kHz |
|---|---|---|---|---|
| 4242 | own | 74.0% | 60.9% | −0.01, −0.18, −0.83, −2.14, −3.43 |
| 5420 | tenor e | 33.6% | 0.0% | −0.01, −0.21, −0.90, −1.96, −4.64 |
| 5520 | tenor ɑ | 99.6% | 55.8% | −0.01, −0.06, −1.08, −2.22, −4.68 |
| 5600 | mezzo i | 57.8% | 37.3% | −0.01, −0.14, −0.66, −2.48, −4.24 |

Read (INFERENCE from these numbers): the two pipelines see the same recursion (Item 1) but not the same signal. `resampleTo` is a Butterworth low-pass at 0.45 times the new rate followed by linear interpolation; it is 2 to 5 dB below scipy's polyphase filter from 3 to 5 kHz. That changes how many frames carry an extra pole below F2, and the median of the second pole moves with it. It does not touch fR1 on any take. **Nothing in `dsp.ts` was changed; the desk rules.** Whether the flicker bears on the path picker is NOT ESTABLISHED; Step 3's real-voice results decide.

## The gates

The changed files' tests: `burg.test.ts` passes (5 tests), `fidelity-set.test.ts` passes (5 tests), `node scripts/ratchets.mjs` OK. The eight gates and the Playwright suites are for the end of the lane.

## What I could not establish

- Burg's page numbers (NOT ESTABLISHED, in the file). Tests 1 and 2 are the check.
- Whether the "pole between F1 and F2" reading above is the desk's.
- Whether the resampler's high-frequency roll-off matters to the path picker.
