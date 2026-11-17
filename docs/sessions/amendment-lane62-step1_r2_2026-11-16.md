# Amendment to brief r3, N.200 path picker (lane 62), Step 1: the Burg tests

r2, 2026-11-16 23:0x, written by the desk (Opus 5.5). r1 of 22:52 with Fable's review applied whole (`review-fable-amendment-lane62-step1_r1_2026-11-16.md`: SEND WITH AMENDMENTS, two blockers, six amendments).

## What happened

The lane stopped at Step 1 under the brief's own rule (session read by the desk at 22:47; nothing for Step 1 committed):

1. Known poles: brief r3 Step 1 set a 1 Hz bar on the unwindowed impulse response of a tenth-order all-pole filter. Largest error 15 Hz, on the 4300 Hz pole. `burg.py`'s own `burg()` on the same signal gives the same frequencies to 0.01 Hz.
2. Against `burg.py`: fR1 medians within 1.6 percent on all 13 takes tried; fR2 outside the 3 percent bar on 4 of 13 (6.3 percent on the lane's chosen take), where a spurious second pole flickers between frames.

DESK ERROR, owned: the 1 Hz bar on a decaying impulse response tests the signal, not the code. Burg's estimate is biased on that record whatever its length.

## The desk's measurement (22:50, its own workspace, `m.py`)

Burg recursion equal to `burg.py`'s `burg()` (coefficient difference 0.0, by Fable's run); rate 10 kHz; poles 500, 1500, 2500, 3500, 4300 Hz with bandwidths 60, 90, 120, 150, 200 Hz. Ranges are across the five poles.

| signal | largest error per pole, across the five poles |
|---|---|
| impulse response, 2,000 samples | +4.1, −0.7, −4.4, −2.6, −5.5 Hz |
| stationary AR(10), 2 s, 20 records | 3.0 to 5.1 Hz; 0.12 to 0.61 percent |
| stationary AR(10), 2 s, 2,000 records (Fable) | up to 1.04 percent, on the 500 Hz pole |
| stationary AR(10), 8 s, 400 records (Fable) | up to 0.48 percent |

## The amendment

**Test 1, identity.** Fixed signals: the Test 2 record of seed 1, and one windowed frame of the fry-synth take. Coefficients agree with `burg.py`'s `burg()` to 1e-9 and roots to 0.01 Hz. This shows `burg.ts` is the recursion of `burg.py`; Test 2 shows that recursion recovers known poles. Neither is checked against Burg's pages (NOT ESTABLISHED).

**Test 2, known poles (replaces the 1 Hz bar).** Rate 10 kHz. Poles at 500, 1500, 2500, 3500, 4300 Hz with bandwidths 60, 90, 120, 150, 200 Hz (the desk's set; if yours differs, use this one for this test). Zero-mean white noise, uniform or Gaussian, through that filter; drop the first 1,000 samples; keep 8 s (80,000 samples). Twenty records, seeds 1 to 20 of your generator, named in the test. The recursion and the roots only: no resampling, no pre-emphasis, no window. Every pole within 1 percent of its true frequency on every record. Report the largest error per pole in hertz and percent. Keep the impulse-response case as a reported measurement with no bar. DESK DEFAULT bar (measured: at most 0.48 percent over 400 records of 8 s).

**Test 3, against `burg.py`.**
1. Same input after resampling, on all 13 takes. Take `burg.ts`'s own resampled signal at 10 kHz, round it to 16 bits, and write it with `wavBytes` as a 10 kHz WAV in the temporary folder. Run `burg.py --json` on that file, unedited (at 10 kHz its resampler changes nothing). Run `burg.ts` from the same rounded samples with its resampler skipped. Bar: equal frame counts, and the 25th, 50th, and 75th percentiles of F1 and of F2 within 0.1 Hz, on every take. A miss is a defect in `burg.ts` (pre-emphasis, window, framing, recursion, or `polyRoots`): find it and fix it. If it cannot be fixed inside Owns, report and stop.
2. Then the whole pipeline: fR1 medians within 3 percent on all 13 takes, listed by seed. fR2 medians are reported for all 13 with no bar. For each take outside 3 percent, report the share of frames in which each pipeline finds a pole between F1 and F2, and the level difference in dB between `resampleTo`'s output and scipy's in 1 kHz bands to 5 kHz. Change nothing in `dsp.ts`; the desk rules.
3. Report the ceiling used: `burg.py`'s fixed 5000 Hz (`:28`). The fR2 bar is dropped because item 1 tests the same code more strictly, and because a median of second poles jumps when a spurious pole appears in half the frames. Whether the flicker bears on the path picker is NOT ESTABLISHED; Step 3's real-voice results decide.

**Gates.** After each step, the changed files' tests; all eight gates and the named Playwright suites once, at the end of the lane (the desk rule of 2026-11-16 02:4x Toronto time, `docs/memory/ENVIRONMENT.md`, "LEARNED BY THE 2026-11-16 OPUS DESK"; you found it and asked; the desk's prompt broke it, and the rule stands). In each step's report, "the gates" means the changed files' tests; the eight gates are reported once, at the end.

Nothing else in Steps 1 to 4 changes.

## What the desk could not establish

- The lane's own pole set and its 13 takes (not pushed).
- The cause of the fR2 difference. Fable's port of `resampleTo` against `resample_poly` on three synthetic vowels moved F2 by at most 0.18 percent: weak evidence that the resampler alone does not explain 6.3 percent. Item 1 decides.
- Whether `polyRoots` (`dsp.ts:39`) agrees with `np.roots` to 0.1 Hz on every frame. Item 1 covers it.
- Burg's own pages in Markel and Gray (1976) or Press et al. (1996).
