# The reference was mis-set for a bass. N.200, the instrument before the method

Desk report, 2026-11-22 night, Opus desk. Written after Dann's 31 takes of the same evening.

## 1. The finding, and it changes what Step 4's score meant

**The independent reference Ilya's readings were scored against was reading a bass wrongly, and the cause is one constant.** `tools/i-extractor-check/burg.py:28-29` sets `CEILING = 5000.0` and `N_FORMANTS = 5`, which the file itself describes as Praat's defaults for an adult male voice. For a bass singing close back vowels in vocal fry, ten coefficients across 5,000 Hz cannot separate a first and second resonance that both sit low and close together. The predictor merges them, reports the merged pole as the first resonance, and promotes the next formant to second.

**Measured, on Dann's takes of 2026-11-22, in his room, on the recorder build `1d1d8836`.** Thirteen takes: three [i], three [ɑ], four [o], three [u]. The same audio was read by the app (closed-phase, pulse by pulse) and by `burg.py` (every frame) at six formant ceilings.

Against the Step 4 bars (fR1 within 10 per cent, fR2 within 12 per cent):

| ceiling | fR1 within 10% | fR2 within 12% |
|---|---|---|
| 5,000 Hz, the default | **1 of 13** | **3 of 13** |
| 4,000 Hz | **13 of 13** | **13 of 13** |

At 4,000 Hz the worst disagreement across all thirteen takes is 2.7 per cent, and nine of the thirteen agree within half a per cent on both resonances.

## 2. The failure has the signature the 2026-11-16 score showed

At the 5,000 Hz default the reference read Dann's [o] at 569 to 627 Hz for the first resonance and about 2,400 Hz for the second; his [u] at 551 to 641 Hz and about 2,340 Hz. On 2026-11-16 the same reference read his [o] at 669 / 2,371 and his [u] at 648 / 2,271 and 691 / 2,240 (`~/Downloads/_desk-2026-11-16/n200-step4-score/n200-step4-score.md`). Same vowels, same shape of error, two sessions apart.

It is not confined to back vowels. At 5,000 Hz the reference also put two of three [i] takes at about 1,690 and 1,644 Hz for the FIRST resonance, and one [ɑ] at 832 / 2,397.

## 3. What this does to Step 4's reported result

Step 4 reported 6 of 12 on fR1 and 9 of 12 on fR2 for the shipped picker, and the desk and Dann were to decide before Step 5 on those figures. **Those figures measure the reference's ceiling at least as much as they measure Ilya.** Takes 04, 05, and 06 of that set, the [o] and the two [u], are three of the six fR1 failures.

## 4. What is NOT established

- **Agreement is not proof.** Two methods agreeing to within one per cent is strong, and it is not the same as either being right. The two differ by design (closed phase pulse by pulse against every frame), which is why the cross-check is worth anything at all, but a shared assumption would not show up here.
- **One bass, one room, one session, thirteen takes.** Nothing here says what ceiling suits a treble voice, and a treble's resonances sit where the 5,000 Hz default was designed for.
- **Where the right ceiling is.** 4,000 Hz and 3,500 Hz both agree closely; 3,000 and 2,500 break [i]'s second resonance (it merges, reading about 1,150 to 1,290 Hz instead of about 1,620 to 1,680). The ceiling was not optimized, only swept at 5,000, 4,500, 4,000, 3,500, 3,000, and 2,500.
- **4,500 Hz is unstable** rather than simply wrong: it reads most takes correctly and fails on u1 (554 / 2,283). The boundary is not clean, which is itself a reason not to sit near it.
- **Whether the ceiling becomes a per-voice-type setting** or a fixed lower value is not decided here, and it is a design question, not a measurement.

## 5. One trace that this was half known

The Step 4 record notes that take 09, Dann's [ɨ], "is scored against Praat at 4000 Hz only". Someone had already found that the default ceiling failed for one vowel of this voice and had worked around it for that vowel. It was never generalized, and the rest of the set stayed on 5,000.

## 6. Where the work is

- `~/Downloads/_desk-2026-11-22-night/n200-takes/`: the 31 takes of 2026-11-22, unpacked, each sidecar's `sung` stamped equal to `asked`.
- `~/Downloads/_desk-2026-11-22-night/burg-diag/`: the 16 pairs used here, with ASCII names and a manifest of Ilya's own readings.
- The sweep script and `sweep.json` are in the desk's container and are not delivered; the table above is the result.

## 7. What follows, and it is the desk's

1. Score all 31 takes against the reference at a corrected ceiling, both pickers, and report it as Step 4 asked.
2. Put to Dann the design question of what the ceiling becomes: a fixed lower value, or something chosen from the declared voice type. That is taste and his.
3. Nothing in Ilya changes on this report alone. `burg.py` is a checking tool outside the app.
