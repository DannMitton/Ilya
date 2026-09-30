# Brief for Code: Dann's [i] reads wrong and unstably. Find why, fix it, without a special session from him

Written by the desk 2026-09-30 12:45. Draft r1. Priority: first in the queue after the ship. Dann, 12:38 to 12:39: *"My fry [i] is loud and well produced. Fix this."* and *"I do not want to do this because of the problems we encounter... I want this fixed."* **So: no recording session, no extra walk. His only part is singing [i] in an ordinary calibration once the fix is in.**

## What is observed

- His [i] fR1 has read **1063 Hz** (2026-09-02, N.110), **247 Hz** (2026-09-28, the intake brief), and **186 Hz with fR2 1883 Hz** (2026-09-30 12:35, his screenshot, judged implausible). The same singer, the same vowel, in fry as the ritual asks. A bass [i]'s Bozeman band is D4 to E4 (`plausibility.ts`, `CORE_BANDS.bass.i`), about 294 to 330 Hz. [u] at 274 Hz came through the same extractor earlier (N.110 brief §1).
- The spread, not the band, is the defect. An extractor that returns 186, 247, and 1063 for one vowel is not reading his voice.

## The rule that governs this

`docs/memory/CONTRACT.md` §6: do not open the formant extractor before saying how a fix gets verified against his voice; read `claude/e43-n49-assigned-extraction_2026-08-12.md` (project knowledge) and `docs/sessions/brief-n110-i-extractor-harness_r1_2026-09-02.md` first. N.110's harness was briefed and never built (grep for `harness=1` and `ilya-capture-` in `apps/web/src`: nothing).

## Step 1. An instrument that needs no singer

Build synthetic fry: a glottal pulse train at fry rates (about 30 to 80 Hz, and a few irregular-period variants) through a vocal-tract filter with **known** resonances. At least: a bass [i] (fR1 from 250 to 330 Hz, fR2 about 1900 to 2300 Hz), a bass [u] (fR1 about 270, fR2 about 700), a bass [ɑ] (fR1 about 650 to 750); vary loudness over 30 dB and add a little room noise. Run every take through the real extraction path (`engine/analyze.ts` → `extract.ts`, both the cepstral and LPC routes, and whatever chooses between them). Report, per case: the known fR1, the reported fR1, and the spread across takes. **Expectation, stated before measuring:** [ɑ] and [u] land; [i] does not, or not stably. **Likeliest failure of the instrument itself:** a synthetic source too clean to show what real fry does; so include jittered periods and a noisy source.

## Step 2. Keep the next real takes

Build N.110 §2.1's dev-only capture file (its words govern: a query flag, a WAV download per take, nothing stored in the app), and log for each take the extractor's candidate peaks, the prior, and the peak it chose. Then Dann's next ordinary calibration can be analysed offline without asking him for anything more.

## Step 3. Diagnose and fix

Find why [i] fails (the N.110 brief records the desk's hypothesis: pre-emphasis tilting a lone low peak into the rising slope; treat it as a hypothesis). Fix the extraction so the synthetic cases in step 1 land within 5% of their known fR1 and stay stable across pitch, loudness, and fry rate, with [u] and [ɑ] no worse. **Do not change `CORE_BANDS` or the margins**; the band is not the fault.

## Step 4. The one real check

When the fix is in, Dann sings [i] once in an ordinary calibration with the capture flag on. Compare the app's reading with an independent analysis of the saved WAV (a second method you write in `tools/`, not the app's own code). Report both numbers. `DONE` is his reading landing, stable, and agreeing with the independent method.

## Prove it

Tests for step 1's cases in `analyze.test.ts` or a new file; the eight gates with counts; ratchets OK. Report `report-code-i-extractor_r1_<date>.md` with the table from step 1 before and after, and **What I could not establish**. NOT ESTABLISHED beats a complete invented answer.
