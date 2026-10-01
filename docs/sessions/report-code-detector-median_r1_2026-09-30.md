# Report from Code: the detector judges fry rhythm on medians (row 2d, part 2b)

Answers `brief-code-detector-median_r1_2026-09-30.md`. Read and built on branch `Shane` at `93bc639`. The tree was clean at the start for code; during the session another writer modified `docs/memory/OWED.md`, `QUEUE.md`, and `STATE.md` and added two `docs/sessions/` files. This session did not touch them. No git writes.

Dann's 14 capture WAVs were read in place from `~/Downloads`. The speech and noise controls are the last report's files, copied into the scratchpad. Nothing was copied into the repository.

## Summary

- **Built as ruled.** `c3` reads the median inter-pulse interval (band 12.5 to 50 ms, unchanged). `c5` reads the median absolute deviation over the median, limit **0.75**. The limit stands: nothing that should be refused got through at 0.75.
- **All fourteen of Dann's takes now pass,** including the five refused first takes. All fourteen read Captured, medium. The nine that passed before read exactly what they read before.
- **Every control is still refused.** Speech is now refused by `c3`, not `c5`. Noise is refused by `c4`, `c7`, and `c8`, as before.
- **Gates:** all eight pass. Gate 4 moved 1750 → **1753**: three new tests. The ship script now expects 1753 (backup `~/Downloads/ilya-ship.sh.bak-1750-2026-09-30`).

## What changed

| File | Change |
|---|---|
| `apps/web/src/lib/voice/engine/detector.ts` | `c3` on the median interval; `c5` on median dispersion, limit 0.75. The `c5` comment now records the ruling and its history. Two new fields on `DetectorResult`: `medianIpi` (s) and `dispersion`. `cv` stays, marked diagnostic only. |
| `apps/web/src/lib/voice/engine/live.ts` | The gate's console line prints `median … ms` and `dispersion` in place of `cv`. |
| `apps/web/src/lib/voice/engine/detector.test.ts` | Three new tests (below). |
| `apps/web/src/lib/voice/engine/analyze.test.ts` | One test rewritten (below). A local `median()` helper. |

**DESK DEFAULT:** `rateHz` is unchanged; it is still 1 over the mean interval. It feeds the readiness step's fry-rate verdict (`readiness.ts:295`) and the live gate's window ranking, which the brief did not ask to move. On Dann's takes the mean reads a lower rate than the median wherever the picker skipped pulses. Changing it is a one-line follow-up if the desk wants it.

## Before and after, per take

Before is `runCapture` on the code at `93bc639`; after is the same call on the changed code. Median and dispersion are on the stretch the detector was shown (the guard's window where it found one, otherwise the whole take).

| Vowel | Take (UTC) | Median (ms) | Dispersion | SD-based CV | Before | After |
|---|---|---|---|---|---|---|
| [i] | 23:32:35 | 22.7 | 0.41 | 0.67 | Captured, 241 / 1807 | unchanged |
| [i] | 23:33:11 | 20.9 | 0.30 | 0.82 | Captured, 273 / 1658 | unchanged |
| [e] | 23:33:29 | 19.2 | 0.11 | 0.34 | Captured, 365 / 1622 | unchanged |
| [ɛ] | 23:33:46 | 20.1 | 0.16 | 1.11 | **refused `c5_cv`** | **Captured, 536 / 1346** |
| [ɛ] | 23:33:58 (0 to 1.95 s) | 20.7 | 0.11 | 0.58 | Captured, 530 / 1352 | unchanged |
| [a] | 23:34:11 | 20.7 | 0.14 | 1.38 | **refused `c5_cv`** | **Captured, 699 / 1120** |
| [a] | 23:34:21 | 22.6 | 0.17 | 0.82 | Captured, 681 / 1080 | unchanged |
| [ɑ] | 23:34:33 | 18.7 | 0.24 | 1.10 | **refused `c5_cv`** | **Captured, 614 / 1016** |
| [ɑ] | 23:34:47 | 19.1 | 0.17 | 0.90 | Captured, 586 / 999 | unchanged |
| [ʌ] | 23:35:07 | 17.3 | 0.38 | 1.04 | **refused `c5_cv`** | **Captured, 635 / 1083** |
| [ʌ] | 23:35:22 | 27.4 | 0.36 | 0.71 | Captured, 587 / 1052 | unchanged |
| [o] | 23:35:38 | 16.0 | 0.55 | 1.36 | **refused `c5_cv`** | **Captured, 409 / 736** |
| [o] | 23:35:50 (0.1 to 1.9 s) | 17.0 | 0.52 | 0.98 | Captured, 425 / 744 | unchanged |
| [u] | 23:36:01 | 19.5 | 0.06 | 0.92 | Captured, 289 / 702 | unchanged |

All readings are fR1 / fR2 in Hz, every one at medium confidence. Dispersion across the fourteen runs 0.06 to 0.55 on the detector's window (0.57 on the [o] retake's whole buffer). Each pair of first and second takes agrees within 48 Hz on fR1; the largest gap is [ʌ], 635 against 587.

## The controls, and the test that refuses each

| Input | Median (ms) | Dispersion | Before | After |
|---|---|---|---|---|
| White noise, RMS 0.003 | 18.5 | 0.44 | `c4_decay`, `c7_flat`, `c8_snr` | same |
| Pink noise with 60 Hz hum | 18.5 | 0.59 | `c4_decay`, `c7_flat`, `c8_snr` | same |
| English speech, five 2.5 s windows | 5.9 to 6.3 | 0.09 to 0.19 | `c5_cv` | `c3_ipi` |
| French speech, four windows | 7.6 to 7.7 | 0.10 to 0.14 | `c5_cv` | `c3_ipi` |
| English speech with a sustained "Ahhh", three windows | 8.4 to 9.1 | 0.06 to 0.11 | `c5_cv` (one window also `c3_ipi`) | `c3_ipi` |

The live gate's view was checked too: one-second windows stepped 0.25 s across every control file. None was accepted, before or after (0 of 54).

Two facts for the desk to weigh, neither of which moves the limit:

- **Noise passes `c3` and `c5` on the median,** at 18.5 ms and 0.44 to 0.59. It always passed `c5`; what refuses noise is `c4`, `c7`, and `c8`, three tests deep. A limit low enough to refuse noise on `c5` would sit below Dann's [o] at 0.55, so lowering 0.75 would buy nothing here and cost his [o].
- **Speech now rests on `c3` alone,** with 3.4 ms of margin: the lowest-voiced control reads a 9.1 ms median against the 12.5 ms floor. A man speaking below 80 Hz would have a median above 12.5 ms. Whether real low speech reaches that is NOT ESTABLISHED; the controls are macOS synthetic voices. `c4` (decay) is the remaining guard there, and it passed every speech window.

## Tests

New, in `detector.test.ts`, every expected value computed from the fixture's own pulse schedule:

1. A 40 Hz fry with three 300 ms gaps. Its standard-deviation CV is above 1.0 and its dispersion is 0; the detector accepts it.
2. A 140 Hz voice in 0.3 s phrases with 0.4 s pauses. Its mean interval is inside 12.5 to 50 ms and its median is below 12.5 ms; the detector refuses it on `c3_ipi`.
3. A rhythm cycling 6, 30, and 120 ms: median 30 ms, dispersion 0.8; the detector refuses it on `c5_cv` and not on `c3_ipi`.

Rewritten, in `analyze.test.ts`: "is still rejected by the detector when the detector is shown all 3.5 seconds". It pinned N.80's defect, a whole-buffer refusal on a standard-deviation CV above 1.0. On the median that buffer is fry (its regular phase is most of its intervals), so the test now asserts the fixture's median and dispersion by arithmetic, that the detector accepts the whole buffer, and that the guard still keeps the sub-window (`fullWindow: false`). The other N.80 tests are unchanged and pass, including the rough negative control.

**Mutation control:** with the old `c3` and `c5` lines restored, all four of these tests fail and the rest of the two files pass (45 of 49). The new code was put back and diffed afterwards.

## Gates

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251) |
| 2 dictionary | 235 passed (235) |
| 3 web check | 0 errors and 12 warnings in 5 files |
| 4 web test | **1753 passed (1753)**; was 1750 |
| 5 score parser | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | OK |

Run from a scratch copy of `ilya-ship.sh` that cannot stage. The "before" gate run is the last report's, on the same code at `93bc639`; this session did not repeat it.

## Residuals

- `rateHz` still reads the mean (DESK DEFAULT above).
- Speech refusal now rests on `c3` alone (above).
