# Amendment to brief r3, N.200 path picker (lane 62), Step 1: the two Burg tests

r1, 2026-11-16 22:5x, written by the desk (Opus 5.5) after the lane stopped at Step 1 under the brief's own rule. For Fable's review before it goes to the lane (`CONTRACT.md` §1 item 19, widened 2026-10-27).

## What happened

The lane reported (session https://claude.ai/code/session_01Vk7wM5enJiVyf2wzCyx1kB, read by the desk 22:4x; nothing for Step 1 committed):

1. Known poles: brief r3 Step 1 set a 1 Hz bar on the unwindowed impulse response of a tenth-order all-pole filter. Largest error 15 Hz, on the 4300 Hz pole. `burg.py`'s own `burg()` on the same signal gives the same frequencies to 0.01 Hz.
2. Against `burg.py`: fR1 medians within 1.6 percent on all 13 takes tried; fR2 outside the 3 percent bar on 4 of 13 (6.3 percent on the brief's chosen take), where a spurious second pole flickers between frames.

DESK ERROR, owned: the 1 Hz bar on a decaying impulse response tests the signal, not the code. Burg's estimate is biased on a short, decaying record.

## The desk's measurement (22:5x, its own workspace, `m.py` beside this file)

Expectation stated first: an impulse response gives errors of several hertz; stationary AR(10) data gives errors that shrink with length. Likeliest failure: no length gets under 1 Hz.

A textbook Burg recursion (Burg 1967 as given in standard references; the desk's own code), fs 10 kHz, poles 500, 1500, 2500, 3500, 4300 Hz with bandwidths 60, 90, 120, 150, 200 Hz:

| signal | pole errors |
|---|---|
| impulse response, 2,000 samples | +4.1, −0.7, −4.4, −2.6, −5.5 Hz |
| stationary AR(10), 50 ms, 20 seeds | max 27 to 44 Hz; max 0.9 to 5.5 percent |
| stationary AR(10), 200 ms, 20 seeds | max 11 to 20 Hz; max 0.5 to 2.1 percent |
| stationary AR(10), 2 s, 20 seeds | max 3.0 to 5.1 Hz; max 0.12 to 0.61 percent |

So no data length gives 1 Hz on every pole; a relative bar on long stationary data does hold with margin. The lane's poles were not read by the desk; its 15 Hz may come from narrower bandwidths.

## The amendment

**Test 1, identity (replaces nothing; the lane has run it).** `burg.ts`'s recursion on a fixed signal equals a direct transcription of `burg.py`'s `burg()` (`tools/i-extractor-check/burg.py`, the function the lane compared) to 0.01 Hz on every root. This is the test that the code is right.

**Test 2, known poles (replaces the 1 Hz bar).** White noise, fixed seed, through the tenth-order all-pole filter the lane already built; 2 s at the filter's rate after a 1,000-sample warm-up; 20 seeds. Every pole within 1 percent of its true frequency on every seed. Report the largest error per pole in hertz and percent. Keep the impulse-response case as a reported measurement with no bar. DESK DEFAULT bar (the desk measured at most 0.61 percent on its own poles).

**Test 3, against `burg.py` (narrows the 3 percent bar to where it means something).**
1. First, find the stage that differs. Feed both pipelines the same input at each stage boundary in turn: after resampling, after pre-emphasis, after windowing. At the first stage where both are given identical input, frame-by-frame F1 and F2 must agree within 0.1 Hz. If they do not, that is a defect in `burg.ts`: fix it.
2. Then the whole pipeline: fR1 medians within 3 percent on all 13 takes (met). fR2 medians are reported for all 13 with no bar, and each take outside 3 percent names the stage that causes the difference (expected, NOT ESTABLISHED: the resampler, `resampleTo` against scipy's).
3. Report the ceiling used. The 5000 Hz ceiling is `burg.py`'s fixed value (`:28`); on Dann's bass takes 5000 Hz is the ceiling at which the desk's re-score (2026-11-16 15:2x) found the second resonance taken for the first on [o] and [u], so a flickering pole at 5000 Hz is no evidence about the path picker, which chooses its ceiling.

Nothing else in Step 1 changes. Steps 2 to 4 unchanged. Gates: the changed files' tests after the step, all eight at the end of the lane (the desk rule of 2026-11-16 02:4x Toronto time, `ENVIRONMENT.md`, "LEARNED BY THE 2026-11-16 OPUS DESK"; the lane found it and asked; the desk's prompt for lane 62 broke it, and the rule stands).

## What the desk could not establish

- The lane's own pole set and bandwidths (not pushed).
- Whether the fR2 difference comes from the resampler.
- Burg's own pages in Markel and Gray (1976) or Press et al. (1996): the lane did not have them; NOT ESTABLISHED, and the file says so.
