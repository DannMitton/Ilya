# MEMO. N.80 research: why cardinal-u lands Provisional, as returned

Returned 2026-08-23 by one Opus subagent run from the desk on Dann's ruling,
read-only against the tree at `d0a1895`. Cost: 138,923 tokens, 42 tool calls,
8 minutes, against a stated range of 150k to 300k. The agent ran the tree's
own `extract.ts`, `dsp.ts`, `detector.ts`, and `guard.ts` on synthetic fry
outside the repository; nothing in the tree was touched. The text under the
rule is the agent's own, saved verbatim.

Desk reading: the window `[150, 1200]` is not the limit (fR1 resolves to
about 160 Hz); the three browser constraints are already off at
`live.ts:339-341`; the SNR estimator is a level meter with a 0.4 to 4.5 dB
margin over its 12 dB floor, so a quieter close vowel crosses it. Recommended
next step: build nothing, one console reading.

---
# Memo: why cardinal-u lands Provisional

All paths relative to `~/mnt/ilya-rewrite/`. Engine root is `apps/web/src/lib/shane/engine/`. Runs were performed on the device with Node 22 against **copies** of the tree's own `dsp.ts`, `extract.ts`, `detector.ts`, and `guard.ts` (copied outside the repository, scratch deleted after). Nothing in the repository was modified.

## 1. Citation check against today's tree

| Prior claim | Verdict today |
|---|---|
| `analyze()` takes `_voiceType` and does not use it | **Holds.** `engine/analyze.ts:22`. The parameter is still underscore-prefixed and unread. |
| `extractFormants(y, sr, vowel)` never given a voice type | **Holds.** `engine/extract.ts:109`; called at `analyze.ts:25` with three arguments. |
| `MITTON` at `extract.ts:3-6`, one prior table for every singer | **Holds**, exact lines. `u: [346, 804]`. |
| F1 search window `[150, 1200]` at `extract.ts:8` | **Holds**, exact line. `F1R: [150, 1200]`, `F2R: [500, 3000]`. Repeated as literals in the LPC path at `extract.ts:79` and `extract.ts:81`. |
| `checkPlausibility` runs at `CalibrationWizard.svelte:299`, on `formant.f1` | **Holds**, exact line. Demotion at `:301-302`. |
| Bands tuned on field evidence, `plausibility.test.ts:64` | **Holds**, exact line: "field evidence 2026-07-11: a dark bass [u] at 255 Hz is plausible (floor 3 st)". |
| `analyze.ts:36-42` offers no F1-dependent path to Provisional; three routes | **Moved and now narrower.** The block is still at `analyze.ts:36-42`. But only **two** routes can produce a Provisional *reading*, not three. `runCapture` returns `reprompt` on `!det.accept` at `analyze.ts:67`, before `analyze()` is reached, and `detect()` is recomputed deterministically on the same buffer at `analyze.ts:23`. So the fry detector never yields a Provisional reading; it yields a re-prompt that `live.ts:686-690` maps to `EXTRACTION_FAILED`. The surviving routes are **the stationarity guard** (`guard.ts:92`) and **snrDb < 12** (`analyze.ts:36`). A third exists outside the engine: the plausibility demotion at `CalibrationWizard.svelte:301`. |
| No path writes a capture buffer to disk | **Holds.** Grep across `apps/web/src` for `MediaRecorder`, `audio/wav`, `encodeWAV`: no hits. The only `Blob` in `live.ts:456` is the inlined worklet source. |

## 2. The capture chain, end to end

- **Constraints, `live.ts:337-343`:** `echoCancellation: false`, `noiseSuppression: false`, `autoGainControl: false`, `channelCount: 1`. All three are explicitly off, so the Chrome and iOS Safari defaults do not apply. Caveat: passed as plain booleans they are *ideal*, not *mandatory*, so the browser may silently decline. The applied settings are already printed at `live.ts:356` (`dbg('track settings:', ... getSettings())`), and `DEBUG = true` at `live.ts:173`, so this is checkable today with no build.
- **Sample rate:** `AudioContext({ sampleRate: 48000 })` with a bare-constructor fallback, `live.ts:360-365`. `TARGET_SR = 48000` at `live.ts:101`.
- **Gain:** none applied. The only `GainNode` is the sink at `live.ts:377` with `gain.value = 0`, so the mic is never audible. No `applyConstraints`, no compressor, no normalization.
- **Filters in the chain:** **no highpass anywhere, at any stage.** Lowpasses only: the detector's envelope smoother at 250 Hz (`detector.ts:6`) and the resampler's anti-alias at `0.45 * 8000 = 3600` Hz (`dsp.ts:198`).
- **Pre-emphasis:** `PREEMPH = 0.97`, single zero, `extract.ts:7, 10-14`. At 48 kHz the zero's corner sits near 230 Hz, so content below that rolls off at 6 dB/octave; 300 Hz sits about 6.8 dB below 800 Hz. Applied to the LTAS and LPC paths only, never to the detector or the guard.
- **Window and transform:** 25 ms Hann frames, 50 percent hop, zero-padded to `NFFT = 4096`, magnitude-averaged, then a cepstral envelope with an 8 ms lifter (`extract.ts:7, 16-32`). At 48 kHz that is 11.7 Hz bins and roughly 125 Hz envelope resolution.
- **Formant method:** LTAS peak-picking first, with `PROM_DB = 3` topographic prominence and nearest-to-`MITTON`-prior selection (`extract.ts:112-123`). LPC fallback only if either peak is missing: order 18 at 8 kHz, roots with bandwidth < 400 Hz (`extract.ts:61-84`).
- **F1 search window:** `[150, 1200]` Hz.
- **Fry detector, `detector.ts:90-109`:** c3 mean inter-pulse interval 0.0125 to 0.05 s (20 to 80 Hz); c4 median inter-pulse decay < 0.4; c5 inter-pulse-interval CV <= 1.0; c6 at least 8 pulses; c7 spectral flatness <= 0.3 over 100 to 4000 Hz; c8 proxy SNR >= 12 dB, tri-state (`null` when the 5 to 10 kHz noise band cannot be formed).
- **Stationarity guard, `guard.ts:3-4, 58-68`:** 100 ms frames, 50 percent hop, order-12 LPC coarse formants; a window passes only if fR1 CV < 0.08, fR2 CV < 0.12, minimum adjacent 20-band envelope correlation > 0.92, and pulse-rate CV < 0.25. Full window first, then the longest sub-window of at least 1.5 s. No passing window means `Provisional`.
- **SNR estimator, `detector.ts:23-45`:** in-buffer proxy. Mean Welch PSD over 100 to 4000 Hz divided by the **median** PSD over 5 kHz to `min(sr/2 - 200, 10000)`. Not a room SNR. Threshold 12 dB, recalibrated 2026-07-01 (`detector.ts:102-106`) from live iMac evidence that "an excellent fry at 30 cm in a normal room reads **12.4 to 16.5 dB**".

**Routes to Provisional, exhaustively:** guard verdict `Provisional`, or proxy SNR < 12 dB, or the wizard's implausibility demotion. Nothing else.

## 3. Dann's three questions

### a. Mic sensitivity

There is no gain control, no level meter, no clipping check anywhere in the capture path. The only amplitude test in the whole chain is `SILENCE_RMS = 0.003` at `analyze.ts:11`, a floor, not a meter. The RMS of the live gate window is printed at `live.ts:524, 528` but is never compared to anything.

The SNR estimator treats **the 5 to 10 kHz band of the same buffer** as noise. **Run performed:** holding a fixed broadband floor and dropping the voice level, the proxy SNR falls one dB per dB of level (60.2, 57.2, 54.2, 51.2, 48.2 dB at 0, -3, -6, -9, -12 dB of voice level). The proxy SNR is a level meter in disguise. With the measured field margin above the 12 dB threshold being only **0.4 to 4.5 dB** (`detector.ts:102-106`), **a vowel sung 3 to 6 dB quieter than the calibration reference crosses the threshold and lands Provisional.** A close, rounded, lip-constricted [u] in fry radiates less than an open [a] at the same effort. So yes: the mechanism Dann suspects exists, and it is a *level* mechanism, not a vowel mechanism.

Run performed, same synthetic level: [u] and [a] give proxy SNR within 0.1 dB of each other. The estimator has no vowel bias. Only radiated level moves it.

### b. The low cutoff

**Run performed.** Synthetic fry (40 Hz pulse rate, 15 percent jitter, 2.5 s, four resonances) with fR1 swept downward, fR2 fixed at 760 Hz, put through the tree's own `extractFormants`:

| true fR1 | recovered |
|---|---|
| 400, 350, 300, 270, 250 | 407, 355, 304, 274, 252 |
| 220, 200, 180, 160 | 221, 201, 180, 159 |
| 140, 120 | **755, 756** (locks onto fR2) |

The chain resolves fR1 accurately to about **160 Hz**, which is roughly eight semitones below the bass [u] plausibility floor of 246.94 Hz. **The `[150, 1200]` window is not the limiting factor and the low cutoff is already low enough.** Below 150 Hz it fails hard, as designed, but no bass [u] lives there.

The harmonic-comb concern in the question does not apply as stated, because **the gate requires fry, not modal**. At an accepted fry rate of 30 to 60 Hz the harmonics are 30 to 60 Hz apart and the recovered fR1 was 300.3, 300.6, and 302.0 Hz against a true 300. Bias appears only at the **top** of the accepted band: 323 Hz at 80 Hz pulse rate, 336 Hz at 110 Hz. Dann's 301 Hz reading is consistent with a genuine low-rate fry, not with harmonic locking.

No filter in the chain attenuates below 300 Hz except pre-emphasis, which tilts rather than cuts and is applied identically to every vowel.

Incidental finding: at f0 = 80 Hz a **modal** synthetic passed the whole eight-condition gate and extracted 313/885 Hz. Every other modal rate was refused at c3, c5, or c6. That is a hole at the top of the fry band, not today's failure.

### c. What else would make [u] capturable, ranked by cost

**1. Singer advice, zero build.** Evidence: the proxy SNR tracks level one-for-one, and the field margin above 12 dB is 0.4 to 4.5 dB. The instruction is *level and distance*, not vowel shape: fry [u] at the same distance and the same subglottal effort you use for [a], or move 5 cm closer for the closed vowels. Explicitly **not** "open the vowel", which is cause 4 (reshaping) turned into policy.
*Verification against Dann's voice:* three [u] takes at habitual distance, three at 5 cm closer, same sitting. Record the console `snr` from the last `[shane-live] gate:` line before `stable fry confirmed`, and the `reading` from the `outcome:` line at `live.ts:684`. A fix means the closer set clears 12 dB and reads Captured while the far set does not, with fR1 **scattering** within about 20 Hz across all six takes rather than drifting upward in the successful ones.

**2. Constraint change: none needed, one verification instead.** `echoCancellation`, `noiseSuppression`, `autoGainControl` are already false at `live.ts:339-341`. What is not verified is whether the browser honoured them. `live.ts:356` already prints `getSettings()`.
*Verification:* read that line on the device Dann actually uses. If it reports any of the three as `true`, the constraints must be made mandatory, and that is a `live.ts` change with the same three-take protocol as above.

**3. Parameter change: the 12 dB threshold at `detector.ts:108`, or the guard's `T_FR1_CV = 0.08` at `guard.ts:4`.** Which one is unknown until step 4 below discriminates them. Moving either without knowing which fired would be tuning the wrong knob.
*Verification:* the parameter may only move on a distribution, per the precedent already set by the 2026-07-01 recalibration and the asymmetric plausibility floor. That means at least six [u] takes and six [a] takes with their post-hoc numbers, not one screenshot.

**4. Method change: none is indicated.** Under synthetic conditions [u] was the **most** robust of the four vowels tested, not the least. At a proxy SNR of 22 dB the guard already failed for [i] while [u] still passed; [u] survived to 13.6 dB with the guard intact. Nothing in the DSP is [u]-specific.

## 4. Diagnosis

**Cause 3, signal level, is the leading candidate; cause 1, stationarity, is second. Cause 2, the fry detector, is ELIMINATED, and cause 4, reshaping, is NOT ESTABLISHED.**

The eliminations are arithmetic:
- **Cause 2 cannot produce a Provisional reading.** `analyze.ts:67` returns `reprompt` before `analyze()` runs. A failed fry detection surfaces to Dann as "did not read as vocal fry", never as a Provisional value with numbers attached. He got numbers, so the detector accepted.
- **Plausibility is eliminated for today's reading.** Bass [u] core band is `[293.66, 349.23]` (`plausibility.ts:81`); with the 3-semitone floor and 2-semitone ceiling (`plausibility.ts:124-125`) the guarded window is **[246.94, 391.99]**. Union is **[246.94, 554.36]**. **301 Hz is comfortably inside both.** The plausibility guard returned `plausible` and did not demote anything.
- **The extractor worked.** 301/759 Hz is a coherent bass [u]; my synthetic recovers 300 as 300.6. The failure was a *quality verdict on a good number*, not a bad number.

That leaves the stationarity guard and the SNR floor, and the code cannot tell me which. **The single observation that confirms or refutes it:** the post-hoc `snrDb` and the `guard.reading` for that take. Neither is logged. But a usable proxy already is: the **last `[shane-live] gate:` line before `stable fry confirmed`** prints `snr` for the 1.0 s window immediately preceding the sweep. If that reads near 12 to 14 dB on [u] and comfortably above 18 dB on a vowel that captured in the same sitting, the SNR route is confirmed and the answer is level. If [u]'s gate SNR is as high as [a]'s and it still came back Provisional, the guard is the culprit and the answer is steadiness of the held fry.

## 5. Recommended next step

**Build nothing. One sentence of advice, and one console reading, tonight. Zero hours of Claude Code work.**

Ask Dann to open the browser console, run one calibration sitting, and capture [u] and one vowel that succeeds, then paste two lines per vowel: the last `[shane-live] gate:` line before `stable fry confirmed`, and the `[shane-live] outcome:` line. `DEBUG = true` is hard-coded at `live.ts:173`, so this works on the deployed build with no change. That single paste discriminates the two surviving causes and costs nothing.

Costed alternatives, for comparison:
- **Log the post-hoc `snrDb` and `guard.reading` on the `outcome:` line.** Roughly 0.5 to 1 hour. Two fields added to one `dbg` call. It is inside `analyze.ts`, so CONTRACT §6 applies: the verification plan is the three-plus-three take protocol in §3 above, stated before the edit.
- **Retain rejected takes (the prior document's instrumentation A).** Roughly 3 to 5 hours, and it answers scatter-versus-drift, which is cause 4. Worth doing only after the console reading has ruled out the level explanation, because if [u] is simply quiet, retention measures the wrong thing.
- **Thread the voice type (instrumentation C).** Still last. A per-take level cause is not fixed by a better prior, and the [u] prior is not what failed.

## What I could not establish

- **Which of the two routes fired on 2026-08-23.** The post-hoc `snrDb` and the guard verdict are computed at `analyze.ts:23-24` and discarded. `live.ts:684` logs only the resulting `CalibratedFormant`, whose `confidence: 'low'` collapses both routes into one word. NOT ESTABLISHED from the tree.
- **Whether the browser honoured the three constraints on Dann's device.** `live.ts:356` prints it; nothing in the tree records it.
- **Any walk record of a [u] failure with numbers.** `docs/sessions/` has no hit for `cardinal-u`, `[u]`, or a [u] Provisional. The only trace is `docs/memory/INBOX.md:28`, today's line. `docs/memory/STATE.md:2179` says "N.48 may be unclosable; it needs a `[u]` that fails", which implies no such record was ever captured.
- **Anything about the microphone or the capture chain in `ENVIRONMENT.md`.** Grep for `microphone`, `mic`, `fry`, `audio`, `calibrat` returns only storage-notice and deploy-URL lines. The capture chain has no environment entry.
- **The absolute dB by which [u] radiates less than [a] for Dann.** My runs prove the estimator's one-for-one level sensitivity; they cannot supply his physiology. That number has to come from his voice.
- **Whether the takes scatter or drift.** No attempt history is retained anywhere; `profileStore.ts` has no attempt, reject, or history field.
