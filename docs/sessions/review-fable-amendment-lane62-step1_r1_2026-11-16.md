# Fable review of the lane 62 Step 1 amendment r1

Filed verbatim by the desk 2026-11-16 23:0x. Fable 5.2 subagent, read only; harness count 123,808 tokens, 8 tool uses, 3.8 min (cap 315k). Applied whole in amendment r2.

Tokens used, as the memo gave them: not known to it; estimated under 80k. Scratch scripts in /tmp only. Memory: nothing from memory was used as fact.

VERDICT: SEND WITH AMENDMENTS (two blockers, both fixed by wording).

WHAT HOLDS (each from a run or a line read)
- m.py reproduces the amendment's table exactly (run of /home/claude/burgcheck/m.py; amendment :22-25).
- The desk's recursion (m.py:2-8) equals burg.py's burg() (burg.py:35-52): coefficient difference 0.0 on a 2,000-sample AR(10) record; the same impulse-response errors, +4.06, -0.74, -4.42, -2.59, -5.46 Hz (run).
- Pole construction (m.py:11-14) and the 1,000-sample warm-up are sound. Impulse-response error does not change with length from 200 to 5,000 samples (run), so the desk's diagnosis at :12 is right.
- `CEILING = 5000.0` is at burg.py:28. The gate rule is at ENVIRONMENT.md:5357 on origin/Shane.
- House style: no em dashes, none of the barred words, no US spellings found (grep run).

BLOCKERS

1. Test 2's bar has thin margin on the desk's poles and is unreachable on other pole sets. The lane's poles are unread (:27, :44).
- Desk poles, 2 s, 2,000 seeds: largest 1.04 percent, on the 500 Hz pole; 0.25 percent of seeds exceed 1 percent (run). Uniform noise gives the same (1.03 percent, 500 seeds).
- Lowest pole 250 Hz, bandwidth 60: 10.7 percent of seeds exceed 1 percent. Lowest pole 300 Hz, bandwidth 100: 13.7 percent (300 seeds each). Twenty seeds would then almost surely fail, and the lane would stop a second time on a correct Burg.
- 8 s on the desk's poles: largest 0.48 percent over 400 seeds (run).
- "fixed seed ... 20 seeds" contradicts itself; m.py:20 draws 20 records from one generator.
Fix, replace Test 2 with:
"**Test 2, known poles (replaces the 1 Hz bar).** Rate 10 kHz. Poles at 500, 1500, 2500, 3500, 4300 Hz with bandwidths 60, 90, 120, 150, 200 Hz (the desk's set; if yours differs, use this one for this test). Zero-mean white noise, uniform or Gaussian, through that filter; drop the first 1,000 samples; keep 8 s (80,000 samples). Twenty records, seeds 1 to 20 of your generator, named in the test. The recursion and the roots only: no resampling, no pre-emphasis, no window. Every pole within 1 percent of its true frequency on every record. Report the largest error per pole in hertz and percent. Keep the impulse-response case as a reported measurement with no bar. DESK DEFAULT bar (measured: at most 0.48 percent over 400 records of 8 s)."

2. Test 3 item 1 cannot be run as written. "The first stage where both are given identical input" has no meaning when the lane does the feeding. burg.py is unedited and in Leaves (brief r3 :162, :235), and `analyse()` exposes no stage and no per-frame output (burg.py:66-89). The takes and frames covered are unnamed. Since item 2 drops the fR2 bar, item 1 is the only guard against a `burg.ts` defect, so it must be exact.
A route with no new file: at 10 kHz input, burg.py's resampler is an identity (`resample_poly(x,1,1)` difference 0.0, run; burg.py:67-69).
Fix, replace item 1 with:
"1. Same input after resampling, on all 13 takes. Take `burg.ts`'s own resampled signal at 10 kHz, round it to 16 bits, and write it with `wavBytes` as a 10 kHz WAV in the temporary folder. Run `burg.py --json` on that file, unedited (at 10 kHz its resampler changes nothing). Run `burg.ts` from the same rounded samples with its resampler skipped. Bar: equal frame counts, and the 25th, 50th, and 75th percentiles of F1 and of F2 within 0.1 Hz, on every take. A miss is a defect in `burg.ts` (pre-emphasis, window, framing, recursion, or `polyRoots`): find it and fix it. If it cannot be fixed inside Owns, report and stop."

AMENDMENTS

1. Test 1 overstates (:31). A recursion with one real error (the backward update fed the already-updated forward error) recovers every pole within 0.57 percent on 2 s and so passes Test 2 (run); only Test 1 catches it. Test 1 proves equality with burg.py, not correctness against Burg's pages. Replace the last sentence with:
"Fixed signals: the Test 2 record of seed 1, and one windowed frame of the fry-synth take. Coefficients agree to 1e-9 and roots to 0.01 Hz. This shows `burg.ts` is the recursion of `burg.py`; Test 2 shows that recursion recovers known poles. Neither is checked against Burg's pages (NOT ESTABLISHED)."
2. Item 2 (:37). After item 1 passes, only the resampler and the WAV rounding remain, so "names the stage" needs a number the desk can rule on, and `dsp.ts` is not in Owns. Replace with:
"2. Then the whole pipeline: fR1 medians within 3 percent on all 13 takes, listed by seed. fR2 medians are reported for all 13 with no bar. For each take outside 3 percent, report the share of frames in which each pipeline finds a pole between F1 and F2, and the level difference in dB between `resampleTo`'s output and scipy's in 1 kHz bands to 5 kHz. Change nothing in `dsp.ts`; the desk rules."
3. Item 3's reasoning (:38) does not follow. The picker runs `burg.ts` at every ceiling and scores track smoothness (brief r3 :69-76), so flicker caused by `resampleTo` would bear on it. Which pipeline flickers is not stated (:10). The sound reason for dropping the bar is that item 1 is stricter and that a median flips when a spurious pole crosses half the frames. Replace everything after "(`:28`)" with:
"The fR2 bar is dropped because item 1 tests the same code more strictly, and because a median of second poles jumps when a spurious pole appears in half the frames. Whether the flicker bears on the path picker is NOT ESTABLISHED; Step 3's real-voice results decide."
4. :10 "the brief's chosen take": brief r3 :162 names no take. Write "the lane's chosen take".
5. Gates (:40) against "Steps 2 to 4 unchanged": brief r3 section 8 (:268) asks each report for "the gates". Add: "In each step's report, 'the gates' means the changed files' tests; the eight gates are reported once, at the end."
6. Fill the "22:5x" and "22:4x" placeholders (:3, :7, :14). Label the table's ranges "across the five poles" (:23-25).

WHAT I COULD NOT ESTABLISH
- The lane's pole set, its `burg.ts`, and its 13 takes: nothing pushed, nothing read.
- The cause of the fR2 difference. My Python port of `resampleTo` (dsp.ts:172-208) against `resample_poly`, on three synthetic pulse-train vowels at 48 and 44.1 kHz, moved F1 by at most 0.61 percent and F2 by at most 0.18 percent (run). The resampler alone did not reproduce 6.3 percent there; that signal is not fry-synth, so this is weak evidence only. It raises the weight on blocker 2.
- The desk's 15:2x re-score on Dann's bass takes (:38): not in what I was given.
- Whether `polyRoots` (Durand-Kerner, 500 iterations, dsp.ts:39) agrees with `np.roots` to 0.1 Hz on every frame: not run; no Node run was made.
- Whether the lane's generator offers Gaussian noise; hence "uniform or Gaussian" in blocker 1.

Steps 2 to 4 and the brief's other bars: nothing else touched that I could find. The Step 0 golden and the Step 3 bars do not depend on these tests.
