# Brief for Code: the first moments of calibration are easy and painless

Written by the desk 2026-09-30 12:50. Draft r1. **Ruled by Dann 2026-09-30 12:43**, options offered by the desk: *"I like 2 and I Don't Know is a reasonable answer... I would implement that with Option 1."* The principle: `docs/memory/PRODUCT.md` §"THE FIRST MOMENTS OF CALIBRATION MUST BE EASY AND PAINLESS" (12:40). Runs with, not instead of, `brief-code-i-extractor_r1_2026-09-30.md`. It supersedes `../memory/QUEUE.md` row 8d (the dead wheel), which this removes.

## What the singer gets

1. **Before the first vowel, one optional question: their voice type, only if the voice has none yet.** Dann 2026-09-30 12:44: *"assuming the user has not already entered this? If they have, just carry over the label from their self-informed choice."* If the stored voice already has a `voiceType` (from slice A's Voice characteristics or an earlier calibration), skip the question and use it; re-calibration never asks again. "Not sure" counts as an answer and is not asked again either. The nine Tier 1 choices, "Not sure" among them and treated as a good answer. Skippable. The answer is the same stored `voiceType` the Voice characteristics step edits (slice A), so it routes the plausibility bands from the first take.
2. **No question during capture.** Every take that passes the signal checks is accepted and the ritual moves on as it does for a good reading. An `implausible` verdict is still computed and logged, never shown as a stop. The implausible hold, its catcher, and its wait are removed.
3. **One question at the end, in the summary, only if needed.** If any reading is outside the band for the declared type (or the union bands for "Not sure" or no answer), the summary shows one note naming those vowels and offers Keep or Re-take. Keep sets `plausibilityOverride` as today's Keep my reading does; Re-take opens that vowel.

## What stays

The silence floor and the fry detector (a dead input is still "no sound"). `CORE_BANDS`, the margins, and the verdict logging. Provisional for low confidence.

## Strings: RATIFIED by Dann 2026-09-30 12:49, English and French

Drafted by the desk; Dann's changes: no "usual" (12:46), the no-type sentence has no {type} (12:47), and "the values Ilya draws on" (option 1, 12:49). Use verbatim.

| key | English | French |
|---|---|---|
| calib.voiceTypeFirst.heading | Your voice type | Votre type de voix |
| calib.voiceTypeFirst.hint | This helps Ilya read your voice against the right values. "Not sure" is a fine answer. | Cela aide Ilya à lire votre voix selon les bonnes valeurs. « Je ne sais pas » est une bonne réponse. |
| calib.summary.outside | These readings sit outside the values Ilya draws on for {type} voices: {vowels}. Keep them as they are, or sing them again. | Ces lectures se situent hors des valeurs sur lesquelles Ilya s'appuie pour les voix de {type} : {vowels}. Gardez-les telles quelles, ou chantez-les de nouveau. |
| calib.summary.outsideNoType | These readings sit outside the values Ilya draws on for any voice type: {vowels}. Keep them as they are, or sing them again. | Ces lectures se situent hors des valeurs sur lesquelles Ilya s'appuie pour tous les types de voix : {vowels}. Gardez-les telles quelles, ou chantez-les de nouveau. |
| calib.summary.keepAll | Keep them | Les garder |
| calib.roster.kept (changes) | Beyond Ilya's reference values | Au-delà des valeurs de référence d'Ilya |

{type} is the Tier 1 label in lower case; "Not sure" and no answer take `outsideNoType`. Typographic apostrophes; colon on a no-break space.

## Prove it

Tests: a take judged implausible advances like a good one; the summary note lists exactly the out-of-band vowels; Keep and Re-take behave; the voice type chosen first routes `bucketFor`. The eight gates with counts; `CalibrationWizard.svelte` stays under its ceiling (new component if needed). Browser: the whole ritual in English and French with a seeded low [i], showing no stop during capture and the one note at the end.

## Report

`report-code-calibration-first-moments_r1_<date>.md`, with **What I could not establish**.
