# Brief to Code: the segment guard stamps clean fry "Provisional"

From the desk, 2026-09-30 19:40. Dann walked calibration at `localhost:5173/?harness=1` (19:32 to 19:36 local). His words: "SO MANY OF MY SAMPLES WERE 'UNCERTAIN' BUT I AM CERTAIN THAT I PRODUCED REGULAR AUDIBLE FRY ... THIS IS STILL PROBLEMATIC AND NOT AN ENJOYABLE EXPERIENCE." No git writes. Do not ask Dann to sing again until parts 1 and 2 are done and verified on his files.

## The evidence (read by the desk from the sidecars)

14 capture pairs in `~/Downloads/ilya-capture-*-2026-09-30T23-3*.{wav,json}`. These are Dann's own recordings: **never copy them into the repository, never commit them** (PRODUCT.md, recordings are never public).

- **The readings are good.** [i] 273/1658 and 241/1807 (two takes, closed-phase), [e] 365/1622, [ɛ] 531/1352, [a] 681/1080, [ɑ] 586/999, [o] 425/744, [u] 289/702, [ʌ] 587/1052. The extractor fix works on his voice.
- **Every "Provisional" came from `guard.ts`, not from the extractor or plausibility.** `analyze.ts:58-62` makes confidence low when `g.reading === 'Provisional'`, and the guard returned Provisional with `spanS 0` on 7 of the 9 accepted takes. Failing tests in the sidecars' `guard.diag`:
  - `rate_cv` on nearly every take: cvr 0.25 to 0.58 against `T_RATE_CV = 0.25` (`guard.ts:4`). Real fry's pulse rate is irregular; your own synth models jitter and alternating periods for that reason.
  - `fr1_cv` on [i], [ɑ], [o]: 0.09 to 0.18 against 0.08. The guard's `coarseFormants` per 100 ms frame is the old per-frame estimator the closed-phase fix replaced for the reading itself.
  - `envcorr` on some [ɑ], [ɛ], [ʌ] takes (0.85 to 0.92 against 0.92).
- **Five first takes were rejected `not-fry`** ([a], [ɑ], [ɛ], [ʌ], [o]); the retake then passed. Each rejection cost Dann a repeat.

## Part 1. The guard must not mark clean fry Provisional

Make a take Provisional only on evidence that the reading is poor. Proposal (JUDGEMENT; choose on the evidence): drop `rate_cv` as a cause of Provisional; judge fR1 stability from the closed-phase reading (or from repeat-take agreement, the ruled acceptance signal in OPEN.md's intake plan) rather than `coarseFormants`. Keep `CORE_BANDS` and the plausibility margins untouched.

**DONE:** Dann's 9 accepted takes, re-run through `runCapture` from his WAVs, come back Captured with the same readings (within 2%); the synthetic suite and gates still pass; a take of room noise or speech is still refused. Report the before and after per take.

## Part 2. Why the first take of five vowels was refused `not-fry`

Diagnose from the five refused WAVs (`det.failed` is in each sidecar's outcome if present; otherwise re-run `detect`). If the cause is the sung lead-in (Ilya's cue asks for the vowel sung first, then fry), the capture window or the detector must allow for it. Report the cause before changing the detector.

## Part 3. WAIT: "sing the vowel first," with a countdown

Dann 19:37: "WE ALSO NEED TO INJECT A DIRECTIVE IN THE WIZARD TO SING THE VOWEL FIRST. WE SHOULD PROVIDE A COUNTDOWN FOR THAT AND STREAMLINE THE USER EXPERIENCE." The strings and the flow need Dann's ratification and French from the desk. **Do not build part 3 until the desk sends ratified strings.** Do report where in `CalibrationWizard.svelte` the cue and the capture start live, so the desk can design it.

## Report

`docs/sessions/report-code-guard-provisional_r1_2026-09-30.md`. Gates after each part.
