# Report from Code: the [i] extractor, steps 1 to 3 done, step 4 waiting for one [i]

Brief: `docs/sessions/brief-code-i-extractor_r1_2026-09-30.md` (desk, 2026-09-30 12:45). Branch `Shane`, working tree dirty before and after (the voice-type and comments work is uncommitted beside this). No git writes.

`docs/memory/CONTRACT.md` §6 says not to open the extractor before saying how a fix gets verified against Dann's voice, and to read the N.49 document first. **The N.49 document (`claude/e43-n49-assigned-extraction_2026-08-12.md`) is not on this machine**: a search of the disk found no file by that name. It lives in project knowledge. I worked from the N.110 brief's account of it, which the desk read in full. The verification path is the brief's own: step 1's synthetic cases before any change, and step 4's one real take against an independent method.

## Step 1. The instrument, and what it showed

`apps/web/src/lib/voice/engine/fry-synth.ts:94` (`synthFry`). A train of glottal flow-derivative pulses (the derivative of a Rosenberg pulse, 5 ms open phase) at a fry rate, through a cascade of five two-pole resonators at known frequencies, with a pink-ish room bed at a fixed level, so a quieter take has a lower signal-to-noise ratio. The options cover the brief's variants and more: per-period jitter, alternating long and short periods, pulse-synchronous breath noise, a second pulse a few ms after each main pulse, a microphone's low roll-off, and mains hum. Test support only; nothing in the app imports it.

Each case ran through `runCapture()`, the path `live.ts`'s `finish()` uses, so the detector, the guard's stretch, and `extractFormants()` all took part. 36 takes per case: fry at 35, 50, and 70 Hz; levels 0, −15, and −30 dB; four sources (clean with 2% jitter, 12% jitter, alternating periods, breath noise). Every take was accepted by the detector.

**Before the fix** (the extractor at HEAD):

| case | known fR1 | reported fR1 | within 5% | spread |
|---|---|---|---|---|
| [i] | 250 | 221 to 240 | 14 of 36 | 19 Hz |
| [i] | 290 | 261 to 274 | 0 of 36 | 13 Hz |
| [i] | 330 | 317 to 330 | 36 of 36 | 13 Hz |
| [u] | 270 | 245 to 262 | 3 of 36 | 17 Hz |
| [ɑ] | 650 | 640 to 652 | 36 of 36 | 12 Hz |
| [ɑ] | 700 | 694 to 700 | 36 of 36 | 6 Hz |
| [ɑ] | 750 | 750 to 761 | 36 of 36 | 11 Hz |

The brief's expectation, stated before measuring, was "[ɑ] and [u] land; [i] does not, or not stably". Half right. [ɑ] landed. **[i] and [u] both read low, but stably**: a bias, not a scatter. The LPC route alone was unstable (a 290 Hz [i] read 257 to 326), but `extractFormants()` uses LPC only when the cepstral route finds no F1 or F2, and on these takes it always found both.

**The clean instrument did not reproduce Dann's spread** (186, 247, and 1063 Hz). So I made it harder. With a second pulse 5 ms after each main pulse, a 330 Hz [i] read **204 Hz at 35 and 50 Hz fry and 360 Hz at 70 Hz**. That is a Dann-sized jump. The second pulse cuts a comb of notches into the spectrum at odd multiples of 100 Hz, and the one at 300 Hz splits the resonance in two.

### What causes the bias

On a 290 Hz [i] with a 5 ms open phase, the raw averaged spectrum's own maximum sits at 246 Hz, before pre-emphasis or the lifter touch it. Varying pre-emphasis (on, off) and the lifter (8, 12, 16 ms) moved the reading around the error without removing it. The cepstral route reads the peak of source times tract, and a fry pulse's open phase puts a broad dip in the source spectrum at a few hundred Hz, where a bass [i]'s and [u]'s first resonance sits. [ɑ] at 650 Hz and above is clear of it.

The N.110 hypothesis, pre-emphasis tilting a lone low peak, is **not supported** on this instrument: turning pre-emphasis off did not remove the bias.

## Step 3. The fix

**Read fR1 from the closed phase.** Fry has a long closed phase, and after each glottal closure the signal is the tract ringing with no source in it. New module `apps/web/src/lib/voice/engine/closed-phase.ts:137` (`closedPhaseResonances`):

1. Find the excitations twice. Once as peaks of the smoothed Hilbert envelope, which is how `detector.ts` finds pulses and works on any vowel at any level. Once as peaks of an inverse-filtered residual, which also catches a second pulse a few ms after the first when the take is loud enough to show it.
2. Keep each 6 ms stretch after an excitation that no other excitation interrupts, with 5 ms to spare before the next one, whose open phase has already begun.
3. Align the stretches by correlation and average them. The ringing repeats pulse after pulse and the room does not, so the room falls by about the square root of the number of stretches (63 to 243 per take in the traced runs).
4. Fit one all-pole model (covariance method, order 12 at 8 kHz) to the average, and take the pole in 150 to 1200 Hz nearest the prior, ignoring poles under 25 Hz wide.

`extract.ts:133` (`extractCore`): fR1 comes from the closed phase when it has an answer, unless it disagrees with the envelope's peak by more than 30% (`CLOSED_PHASE_AGREE`, `extract.ts:12`). Then the envelope's reading stands, as before. fR2 stays on the envelope. When the closed phase abstains (fewer than six clean stretches), the extractor is exactly the old one. **`CORE_BANDS` and the margins are untouched.**

**After the fix**, the same 36 takes per case, plus four more vowels as a no-worse check (bass values I chose; no source):

| case | known fR1 | before: within 5%, range | after: within 5%, range | spread after |
|---|---|---|---|---|
| [i] | 250 | 14/36, 221 to 240 | **36/36**, 250 to 252 | 2 Hz |
| [i] | 290 | 0/36, 261 to 274 | **36/36**, 287 to 290 | 3 Hz |
| [i] | 330 | 36/36, 317 to 330 | 36/36, 323 to 331 | 8 Hz |
| [u] | 270 | 3/36, 245 to 262 | **36/36**, 269 to 271 | 2 Hz |
| [ɑ] | 650 | 36/36, 640 to 652 | 36/36, 649 to 652 | 3 Hz |
| [ɑ] | 700 | 36/36, 694 to 700 | 36/36, 699 to 701 | 2 Hz |
| [ɑ] | 750 | 36/36, 750 to 761 | 36/36, 748 to 751 | 3 Hz |
| [o] | 450 | 36/36, 438 to 454 | 36/36, 448 to 451 | 3 Hz |
| [e] | 360 | 36/36, 350 to 365 | 36/36, 357 to 361 | 4 Hz |
| [ɛ] | 520 | 33/36, 492 to 513 | 36/36, 519 to 520 | 1 Hz |
| [a] | 700 | 36/36, 694 to 702 | 36/36, 699 to 701 | 2 Hz |

Every case lands within 5% in every take, and holds across fry rate, level, and source. [u] and [ɑ] are no worse on any take in this set.

### The harder set, which the fix does not fully cover

63 takes per case: second pulses at 3, 5, and 7 ms, microphone roll-off at 150 and 250 Hz, hum, and all of them at once.

| case | before, within 5% | after, within 5% |
|---|---|---|
| [i] 250 | 26/63 | 44/58 |
| [i] 290 | 21/63 | 49/63 |
| [i] 330 | 35/63 | 43/60 |
| [u] 270 | 28/63 | 48/63 |
| [ɑ] 650 / 700 / 750 | 54 / 54 / 63 | 61 / 54 / 58 |
| [o] 450 | 61/63 | 56/62 |
| [e] 360 | 40/63 | 56/63 |
| [ɛ] 520 | 35/63 | 54/63 |
| [a] 700 | 54/63 | 54/56 |

("Before" counts every take; "after" counts takes the detector accepted, the same set.) Across the whole probe, 230 takes moved into 5% and 7 moved out. All seven are second-pulse takes at −15 or −30 dB, off by 3 to 10%: [ɑ] 750 read 711 and 709 (before 736, 732); [o] 450 read 405 to 422 (before 430 to 433); [e] 360 read 392 (before 374). A second pulse 5 ms after the first still defeats both routes on quiet takes: the residual cannot see it under the room, and the envelope merges it with the first.

## Step 2. The capture file

`apps/web/src/lib/voice/engine/capture-file.ts`. On the dev server, with `?harness=1` in the address, every calibration take downloads two files:
- `ilya-capture-<vowel>-<UTC timestamp>.wav`: 16-bit mono at the engine's sample rate, exactly the buffer `runCapture()` received (the sweep after `live.ts` trims 0.5 s from each end).
- the same name with `.json`: the outcome, the guard's verdict and the stretch it chose (`segmentS`), and the extractor's trace (`ExtractTrace`, `extract.ts:112`): the prior, every envelope peak with its prominence, the closed-phase poles and stretch count, the closed-phase fR1 and whether the agreement check set it aside, the LPC answer, and what was chosen.

**Which gate, and why.** Both `import.meta.env.DEV` and the query flag. Every use in `live.ts:682-691` begins with `import.meta.env.DEV`, which a production build replaces with `false`, so the bundler drops the branches and the module. A dev session without the flag downloads nothing. Nothing is stored in the app, and nothing is sent anywhere. Dann needs no control to press.

The trace threads through as an optional last parameter: `runCapture` (`analyze.ts:83`), `analyze` (`analyze.ts:42`), and `extractFormants` (`extract.ts:127`). Existing callers are unchanged.

**Verified:**
- In the browser pane at `http://localhost:5173/?harness=1`, one synthetic [i] take through `runCapture` and `saveCapture` produced `ilya-capture-i-2026-09-30T17-08-47-560Z.wav` (336,044 bytes, which is 44 + 2 × 168,000 samples) and its `.json` (reading 290 Hz, method `closed-phase`, prior 296/1705, 174 stretches). At `http://localhost:5173/` the flag reads off.
- `live.ts` bundled on its own with esbuild, minified. With `DEV` false: no `ilya-capture`, no `harness`, no `audio/wav`, and 1,335 bytes smaller. With `DEV` true: all three present.

N.110 §2.3's attempt series table is not built; the brief's step 2 does not ask for it.

## Step 4. Ready, not run

`tools/i-extractor-check/burg.py` reads fR1 and fR2 from a capture WAV by a different method: Praat's "To Formant (burg)" recipe with its adult male defaults (5000 Hz ceiling, 25 ms Gaussian window, pre-emphasis from 50 Hz, Burg with 10 coefficients), median across frames. It shares no code with the app and reads every frame, open phase included. With the sidecar beside the WAV, it analyses the guard's stretch.

**Its own accuracy, measured on synthetic WAVs written by the app's `wavBytes`:** within about 4% on loud takes ([i] 290 read 279; [i] 250 read 245; [u] 270 read 259; [ɑ] 700 read 692), and 4 to 17% high at −30 dB. So agreement between the app and this tool means within about 5% on a take recorded at a normal level.

**Dann's part** (brief, step 4): open `http://localhost:5173/?harness=1` (the dev server; the Vercel preview does not carry this until it is committed and pushed), run an ordinary calibration, and sing [i]. Two files land in Downloads. Then:

```bash
python3 tools/i-extractor-check/burg.py ~/Downloads/ilya-capture-i-<timestamp>.wav
```

and compare with `outcome.formant.f1` in the sidecar. `DONE` is his reading landing, stable, and agreeing with this tool.

## Tests

`apps/web/src/lib/voice/engine/i-extractor.test.ts`, 11 tests, about 5 seconds:
- a positive control: the cepstral route alone reads a 290 Hz [i] more than 5% low, so the instrument is not too kind;
- six cases ([i] 250, 290, and 330, [u] 270, [ɑ] 650 and 750), nine takes each over three rates and 30 dB, with the four sources rotating. Every take is within 5%, and the spread of nine is within 5%. The seeds and the 2.5 s length differ from the probe's;
- the agreement check sets aside a spoiled closed-phase reading (an [o] under every hard condition) and the envelope's reading lands;
- the trace marks a closed-phase take and names the prior;
- the WAV writer's header and sample values; the flag reads off without a page address.

Every expected value is a resonator frequency the test passes to the synth, never a value the extractor reported.

These tests caught one defect the probe had not. A 250 Hz [i] at 70 Hz fry with alternating periods read 222: the short period (10 ms) left the next pulse's open phase inside the 6 ms stretch, and the fit split F1 into 238 and 307 Hz. The 5 ms `OPEN_MS` margin (`closed-phase.ts:50`) is the fix, and the full probe was rerun after it. The tables above are that rerun.

## Gates

1 phonology 251, 2 dictionary 235, 3 check 0 errors and 12 warnings, 4 web **1732** (1721 plus the 11 above), 5 score-parser 636 plus 5 skipped, 6 blurb 145, 7 integration 55, 8 ratchets OK. **Gate 4's baseline in `ilya-ship.sh` should become 1732. I have not changed it**: the auto-mode classifier refused my read of that script this session, so I did not touch it.

## Judgements taken (For Dann)

Each is JUDGEMENT unless marked. None has a source; the synthetic set chose among values that all passed.
1. **`CLOSED_PHASE_AGREE = 0.3`.** Every value from 0.15 to 0.30 kept all of the brief's cases; 0.30 drops the fewest good closed-phase readings.
2. **`MIN_BW = 25` Hz.** A pole narrower than this is treated as a steady tone, not a tract resonance. 20 to 30 Hz gave the same result.
3. **`OPEN_MS = 5`.** The synthetic pulse's own open phase. No source read here gives real fry's.
4. **`AVG_MS = 6`.** 6 ms beat 8 and 10 ms on the harder set.
5. **The prior still chooses among candidates** ("nearest the prior", as before). A rule that chose the strongest resonance instead moved one failure from [i] to [ɑ], so I kept the old rule and changed only what it chooses from.
6. **The bass values for [o], [e], [ɛ], and [a]** in the no-worse check are my choice, not a source's.

## What I could not establish

- **Whether Dann's fry has the defect the instrument found.** The synthetic bias explains a reading 5 to 10% low. It does not explain 1063 or 186 Hz. A second pulse explains 186-like jumps; nothing here produced 1063. The fit's spare pole pair on [i] tends to settle between F1 and F2, often at 900 to 1100 Hz; a route that picked it would read about 1063. **That is a hypothesis**, and his first capture file will show whether it holds.
- **Whether real fry leaves 5 ms for the open phase**, or has second pulses, and at what spacing. Step 4's capture answers the first; the sidecar's excitation count and stretch count bear on the second.
- **The N.49 document** was not read. See the top of this report.
- **A full calibration walk in the browser** with a fake microphone was not done. The capture file was driven directly, and `live.ts`'s wiring is proved by the type check and the esbuild fold, not by a take.
- **A production `vite build`** was not run. It would overwrite `apps/web/build`, which another session's preview may be serving. The esbuild bundle of `live.ts` stands in for it.
- **`lpcFormants`' bandwidth** (`extract.ts`, the `bw` line in `lpcFormants`) is −(sr/4π)·ln|z|, a quarter of the standard −(sr/π)·ln|z|, so its 400 Hz ceiling admits poles up to about 1600 Hz wide. Found in passing and not changed; it matters only on the LPC fallback.
- **The git index changed during this session, and not by me.** `git status` now shows `closed-phase.ts` and `fry-synth.ts` staged at an earlier version, and two probe files of mine, `zz-diag.test.ts` and `zz-probe.test.ts`, staged as added and since deleted from disk. Before committing, unstage those two and restage the current versions of the rest.
