# Report from Code: the segment guard and the `not-fry` first takes

Answers `brief-code-guard-stamps-good-fry-provisional_r1_2026-09-30.md`, queue row 2d. Parts 1 and 2 only. Part 3 waits for the desk's strings.

Read on branch `Shane` at `477ba5b`. The working tree was clean at the start. It now holds two modified files and this report. No git writes.

Dann's 14 capture pairs were read in place from `~/Downloads`. Nothing was copied into the repository. The speech and noise controls are scratchpad files, also outside the repository.

## Summary

- **Part 1 is done.** All nine of Dann's accepted takes now come back Captured, with readings identical to the sidecars (0.0% change on fR1 and fR2). Speech and room noise are still refused. The synthetic suite passes, and all eight gates pass. Gate 4 moved from 1747 to 1750: the three new tests.
- **Part 2 is diagnosed, not changed.** The five refusals are not the sung lead-in. The cause is the detector's pulse picker together with a CV based on standard deviation. A fix is proposed below for the desk to rule on, because `c5_cv` is also the only test that refuses speech.

## Part 1. The guard no longer stamps clean fry Provisional

### What changed

`apps/web/src/lib/voice/engine/analyze.ts`. The guard's verdict no longer makes a take Provisional on its own. Instead, `f1Steadiness()` reads fR1 from each half of the stretch the extractor saw, using the same extractor. The take is Provisional when the two halves differ by 8% or more of their mean (`T_HALVES_F1`).

- **JUDGEMENT:** 8% is the number the guard already held its coarse fR1 track to (`T_FR1_CV`, `guard.ts:4`). It now applies to the reading itself.
- **Unchanged:** `guard.ts` and the window it chooses (`segmentS`), so the detector and the extractor see exactly what they saw before. Also unchanged are the `high` tier (it still needs the guard's `fullWindow`), `f2Quality`, `CORE_BANDS`, and the plausibility margins.
- The check rides out on the reading outcome as `steadiness: { halvesF1, spread, steady }`, so the capture file's sidecar records it.

Of the brief's two options I chose split-half rather than repeat-take agreement. Split-half is the within-take form of the same test, and it needs no second take. Repeat-take agreement remains available for the intake plan.

### Why this test and not a tuned guard

On Dann's files, the guard's coarse per-frame estimator cannot track a closed vowel. On the [i] that reads 273 Hz, its fR1 track scatters from 120 to 311 Hz frame to frame. On [e], its fR2 track ranges from 548 to 1665 Hz, which is a fourth cause of Provisional that the brief did not list (`fr2_cv` 0.185). On [ɑ], a single frame at 136 Hz is enough to fail `fr1_cv`. `rate_cv` fails on almost every take because real fry's rhythm wanders, and the detector already judges rhythm. Tuning these thresholds would have chased the estimator's noise rather than the reading.

`rate_cv` still helps choose the window: the [o] retake is read on 0.1 to 1.9 s because of it, and its whole-buffer CV (1.29) would fail the detector. For that reason I left the window choice alone.

### Before and after, per take

Before is the sidecar, which a re-run of the old code reproduced exactly. After is `runCapture` on the same WAV with this change. Split is the difference between the two halves' fR1.

| Vowel | Take (UTC) | Before | After | fR1 / fR2 (Hz), before = after | Halves fR1 (Hz) | Split |
|---|---|---|---|---|---|---|
| [i] | 23:32:35 | Provisional, low | Captured, medium | 241 / 1807 | 212, 217 | 2.3% |
| [i] | 23:33:11 | Provisional, low | Captured, medium | 273 / 1658 | 275, 284 | 3.2% |
| [e] | 23:33:29 | Provisional, low | Captured, medium | 365 / 1622 | 366, 364 | 0.5% |
| [ɛ] | 23:33:58 | Captured, medium | Captured, medium | 530 / 1352 | 525, 516 | 1.7% |
| [a] | 23:34:21 | Provisional, low | Captured, medium | 681 / 1080 | 679, 691 | 1.8% |
| [ɑ] | 23:34:47 | Provisional, low | Captured, medium | 586 / 999 | 588, 585 | 0.5% |
| [ʌ] | 23:35:22 | Provisional, low | Captured, medium | 587 / 1052 | 582, 605 | 3.9% |
| [o] | 23:35:50 | Captured, medium | Captured, medium | 425 / 744 | 430, 417 | 3.1% |
| [u] | 23:36:01 | Provisional, low | Captured, medium | 289 / 702 | 271, 274 | 1.1% |

The five refused first takes are still refused `not-fry` on `c5_cv`. Part 1 does not touch them.

The halves agree with each other more tightly than they agree with the whole-take reading on [i] 23:32:35 (212 and 217 against 241) and on [u] (271 and 274 against 289). The whole-take reading is unchanged and is what the profile stores. I note it for the desk because the shorter windows read lower on both closed vowels.

### Refusals still hold

| Input | Outcome |
|---|---|
| White noise, RMS 0.003 | re-prompt: `c4_decay`, `c7_flat`, `c8_snr` |
| Pink noise with 60 Hz hum | re-prompt: `c4_decay`, `c7_flat`, `c8_snr` |
| English speech, macOS `say` (two 2.5 s windows) | re-prompt: `c5_cv` |
| French speech, voice Thomas (two windows) | re-prompt: `c5_cv` |
| English speech, voice Daniel, with a sustained "Ahhh" (two windows) | re-prompt: `c5_cv` |

The existing tests (empty room, dead input, a take with no regular stretch) still pass.

### New tests

Three tests in `analyze.test.ts`, each taking its expected values from the fixture:

1. A fry whose rhythm wanders by up to 95% while its resonators hold. The guard refuses it (`reading: 'Provisional'`, `failed: ['rate_cv']`), which is what made it Provisional before. It now reads Captured, within 30 Hz of the 300 Hz resonator.
2. A regular fry whose resonators move from [u] 300 Hz to [o] 450 Hz at mid-take, each half held for 1.25 s, so no sub-window can hide the move. The detector accepts it, and it reads Provisional, low.
3. The same take names both halves on the outcome, each within 45 Hz of its own resonator.

### Gates

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251) |
| 2 dictionary | 235 passed (235) |
| 3 web check | 0 errors and 12 warnings in 5 files |
| 4 web test | **1750 passed (1750)**; baseline 1747. The three new tests. The baseline is the desk's to move. |
| 5 score parser | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | OK |

The gates ran from a scratch copy of `ilya-ship.sh` that cannot stage. After they ran, the only edit was a one-number correction in a code comment (the split range, 0.5% to 3.9%).

## Part 2. Why five first takes were refused `not-fry`

### It is not the sung lead-in

- **The WAV holds no lead-in.** The live gate (`live.ts:516`) records only after a one-second window has already passed the detector. Each WAV is the 0.5 s pre-roll plus the 3.0 s sweep, with 0.5 s trimmed from each end. So it starts at the moment of the gate's confirmation and holds fry from end to end.
- **The level is flat.** RMS per 100 ms stays steady across every refused take. There is no louder modal stretch at the start.
- **Modal voicing looks different.** The three speech controls show the picker's median interval at 6 to 9 ms (110 to 170 Hz). The refused takes show 16 to 21 ms, which is fry.
- **The current cue does not ask for the vowel to be sung first.** It reads "Begin phonating now. {v} in vocal fry." (`pacifier.beginPhonating`). Part 3 would add that instruction. Because the gate waits for fry, a sung lead-in would come before the gate fires and fall outside the recorded buffer.

### The cause: the pulse picker and a CV based on standard deviation

All five refused takes fail `c5_cv` alone: the inter-pulse-interval CV is 1.03 to 1.38, against a limit of 1.0. In every case the guard found no passing window, so the detector was shown the whole buffer.

The picker (`detector.ts`: Hilbert envelope, threshold at the mean plus 1.5 standard deviations, at least 5 ms between peaks) both double-picks and skips pulses on Dann's fry:

| Take | Result | Median interval | CV | Picks of 8 ms or less | Gaps over 1.8 × median |
|---|---|---|---|---|---|
| [a] 23:34:11 | refused | 21 ms | 1.38 | 3% | 13%, including one gap of 349 ms |
| [a] 23:34:21 | accepted | 22.5 ms | 0.82 | 9% | 24% |
| [ɑ] 23:34:33 | refused | 19 ms | 1.10 | 19% | 18% |
| [ɑ] 23:34:47 | accepted | 19 ms | 0.90 | 15% | 22% |
| [ɛ] 23:33:46 | refused | 20 ms | 1.10 | 11% | 17% |
| [ɛ] 23:33:58 | accepted | 21 ms | 0.73 | 5% | 26% |
| [ʌ] 23:35:07 | refused | 17 ms | 1.03 | 15% | 28% |
| [ʌ] 23:35:22 | accepted | 27.5 ms | 0.71 | 6% | 18% |
| [o] 23:35:38 | refused | 16 ms | 1.36 | 24% | 26% |
| [o] 23:35:50 | accepted on 0.1 to 1.9 s | 16.5 ms | 1.29 for the whole take | 24% | 26% |

The refused and accepted takes are not different kinds of signal. On a CV based on standard deviation, one to three long gaps decide the verdict: the refused [a] fails on a single 349 ms gap during a brief dip in level. The detector's own comment (`detector.ts`, at `c5`) already names the cause, "the pulse-picker misses weak pulses at real-room levels", and names "a median-based dispersion measure" as the principled fix.

### Proposal for the desk (not built)

A median-based `c5` on its own would admit speech. On speech the picker's median interval is 6 to 9 ms and its median absolute deviation over the median is 0.11 to 0.17, which is as regular as Dann's fry (0.05 to 0.58). What saves the median form is `c3`. Speech passes `c3` today only because its pauses inflate the mean interval. Measured on the median interval, all twelve speech windows fall below `c3`'s 12.5 ms floor, and all fourteen of Dann's takes clear it at 16 to 27.5 ms.

So the proposal is to change the two tests together:

1. **`c3` on the median interval**, with its 12.5 to 50 ms band unchanged.
2. **`c5` on a dispersion based on the median.** Median absolute deviation over the median reads 0.05 to 0.58 on Dann's fourteen takes. The limit is a JUDGEMENT the desk should set: the [o] takes, at 0.56 and 0.58, set the floor.

Before building it, I would re-run all fourteen of Dann's WAVs, the speech and noise controls, and the synthetic suite, and report the before and after. The alternative is a better picker, for example one that merges peaks closer than 8 ms. That fixes the double-picks but not the gaps, so I do not recommend it alone.

## Part 3. Where the cue and the capture start live, for the desk's design

Nothing was built here.

- **The written cue:** `CalibrationWizard.svelte:1376-1380`, the paragraph `.wizard-cue`, from the strings `calib.capture.cuePrefix` and `calib.capture.cueSuffix` (`i18n.ts:1081-1082`). It says only how to arm and start a vowel.
- **The countdown and the capture start:** `pacifier/Pacifier.svelte`, not the wizard.
  - `beginPrepare()` (`Pacifier.svelte:371`) runs a three-beat count at `COUNT_INTERVAL = 700` ms (`:293`), with `pacifier.preparing` ("Preparing {v}. Three."), then `calib.readiness.countTwo` and `countOne`.
  - `startListening()` (`:390`) announces `pacifier.beginPhonating` ("Begin phonating now. {v} in vocal fry.") and calls `session.start()`, which runs the live gate.
  - `startSweep()` (`:406`) fires on `onStableFry` and announces `pacifier.nowSustain`.
- **The readiness step's own count-in** is in `CalibrationWizard.svelte:697-718`. It is separate from the vowel steps.

A "sing the vowel first" step fits between the count and `startListening()`. Because the gate waits for fry, nothing in the engine has to change for it.

## Residuals

- **`high` is still out of reach on real fry.** It needs the guard's `fullWindow`, and `rate_cv` fails the whole buffer on every take Dann sang. All nine now read `medium`. If `high` should be reachable, that is a separate ruling.
- **`f2Quality` still reads the guard's verdict.** Seven of the nine takes stay `marginal` for that reason. The brief did not ask for this to change.
