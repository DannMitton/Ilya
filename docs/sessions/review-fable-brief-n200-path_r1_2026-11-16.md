<!-- Filed verbatim by the desk (Opus 5.5) 2026-11-16 22:1x. Fable 5.2 subagent, read-only, at Shane 55b64d28, cap 330k; 218,633 tokens by the harness count, 20 tool uses, 6.1 min. Map: Downloads/_desk-2026-11-16/n200-p2-scout/packet-sonnet-path-brief_r1_2026-11-16.md (Sonnet, 228,601 tokens). -->

# Fable review: brief-code-n200-path-picker_r1_2026-11-16.md

Repository `Shane` at `55b64d28` (`git rev-parse`, confirmed). Nothing was written anywhere. Nothing in this report comes from memory; every fact is from a file read or a command run this session.

## 1. Verdict

**SEND WITH AMENDMENTS.** The design is sound, but as written the lane cannot compile inside its Owns, its "unchanged" test cannot fail, its phone timing cannot reach a file, and its ladder is not the one the evidence was measured on.

## 2. Blockers, with evidence

**B1. Owns and Leaves contradict the build.** Widening `Picker` breaks the compile at three literal types outside Owns: `engine/types.ts:77` (`picker?: 'open'`), `takes.ts:28` and `rawOf` at `:34-39`, `engine/capture-file.ts:105` (`'shipped' | 'open'`, fed by `live.ts:740,745` with `this.picker`). `ExtractResult.method` is a closed union in `engine/extract.ts:130`, which Leaves says not to change. `extractWith` (`analyze.ts:16`) and `f2Quality` (`analyze.ts:151`) send anything that is not `'open'` to the shipped code, so `'path'` would be read by `MITTON` unless both lines change.

**B2. Step 2's "outputs unchanged" test cannot fail.** `analysis/__golden__/adapter-snapshots.json` is read by `adapter-golden.test.ts`, which the packet found calls no picker (packet A, row 21; I did not reopen that test). No golden of `runCapture` output exists under `voice/`.

**B3. Step 4 cannot be measured as written.**
- The trace exists only when `__ILYA_RECORDER__ && captureFileEnabled()` (`live.ts:736`), and is kept only when `trace.chosen` is set (`live.ts:745`).
- `vercel.json:3` sets `PUBLIC_RECORDER=1` for `cloud-lane-52` only. The lane is `cloud-lane-62`, so its deployment has no recorder and no sidecar.
- `playwright.config.ts:25-55` has two projects, both `devices['Desktop Chrome']`. No WebKit project exists. The tree's one CPU-throttle precedent is Chromium's `Emulation.setCPUThrottlingRate` (`e2e-phone/poem-arias-time.test.ts:21-24`).
- "Adds no more than 1.0 s" has no baseline: nothing records the shipped picker's time.
- The Worker fallback is triggered by a phone result the lane never sees, and `runCapture` is called synchronously at `live.ts:738` in a file outside Owns.

**B4. The ladder is not the measured one.** The brief runs nine ceilings, 4503 to 6718 Hz, middle 5500, which Weenink 2023 gives as the adult-female default (P0 report :24). Against that:
- P0b's cross-check numbers (the 15 of 21, the 0 of 579) and the "12 of 13" on Dann's takes were measured on Praat FormantPath with 15 ceilings, 3000 to 7000 Hz (P0b :7; fidelity report, "FP" definition).
- The plan costs 15 ceilings (plan 3.1 item 5: "The ladder is 15 ceilings").
- Weenink 2015 gives 4000 to 6000 Hz for male voices and an optimum of 4400 Hz on its /o/ example (paper p. 3 caption and step 1, read by pdftotext). 4400 is below the brief's lowest ceiling.
- On Dann's takes Praat at 5000 Hz reads [o] 610/2029 and [u] 648/2257, where Praat at 4000 reads 440/788 and 302/714 (fidelity report, Dann table rows 04, 05).
Whether 4503 Hz reads Dann's back vowels is NOT ESTABLISHED. The brief's section 7 makes the wider ladder conditional on a miss, which is a choice made after seeing results.

**B5. The synthetic set cannot be rebuilt from the brief.** The generator is in `fidelity-harness_2026-11-16.tgz` in Downloads, not in the repository (`tools/n200-score/` holds `score-core.ts`, `score.run.ts`, `synth-gate.run.ts`, `vitest.config.ts`, one test; `ls`). From `gen-eval.run.ts` in the tgz (lines 16-18, 36-57): take seed `5000 + idx*20 + k` with `idx` the cell index 0 to 49 and `k` 0 to 11; the 12-of-36 draw is a permutation from `rng(7000 + idx*31 + 1)`; `jitter: 0.05`; duration is `synthFry`'s default 3.5 s (`fry-synth.ts:95`). The brief gives "seeds 5000 + index" and nothing else.

**B6. The frame step is stated two ways.** The brief cites Weenink 2023's 5 ms and then says "as `burg.py` does", which is 6.25 ms (`burg.py:31`). Weenink 2015 uses 2.5 ms (paper, step 4).

**B7. Instrument 2 has no route for its references.** `score-core.ts` takes one reference per take, from `burg.py` at 5000 Hz or `reference.csv` (`score-core.ts:130-150`). Praat could not be installed on the Mac VM (P0b :20) and the VM has numpy but no scipy (`python3 -c "import scipy"`: `ModuleNotFoundError`), so `burg.py` does not run there either. What is realistic: both references already exist as numbers for the 13 takes (P0b :77-89), so the desk writes them as two CSV files. New takes have no Praat route today.

## 3. Amendments, paste-ready

**1. Line 15, replace.**
> Paths are under `apps/web/src/lib/voice/` unless they say otherwise. `i18n.ts` is `apps/web/src/lib/i18n.ts`. The golden file is `apps/web/src/lib/analysis/__golden__/adapter-snapshots.json`. `dsp.ts` is `engine/dsp.ts`. `CONTRACT.md` is `docs/memory/CONTRACT.md`. The ruling is `docs/memory/PRODUCT.md:1264-1273`.

Also correct: `evidencePoor` is at `analyze.ts:142`, not `:139`; `out.picker = 'open'` is at `:155`, not `:148`. `closedPhaseF1` picks by its `prior` argument (`closed-phase.ts:192-196`); `MITTON` enters at its caller (`extract.ts:140`, `:152-153`).

**2. Section 3, the Escudero and Boersma bullet, replace.**
> **Escudero and Boersma (2009)** choose one ceiling per speaker and vowel across 20 tokens (P0). Ilya has one take, and Dann ruled that the take's own analysis chooses, so it is not used. A cross-take variant built from a description of it gave wrong values on Dann's [u] takes (fidelity report, variant A; the paper's exact criterion was not tested).

In section 7, "as low as 3187 Hz" becomes "a 10th percentile of 3187 Hz, median 4313, under variant B, which is not the path rule".

**3. Section 3 build item 1, add after the first bullet.**
> **The analysis recipe is `tools/i-extractor-check/burg.py:66-89` with the ceiling as a parameter:** resample to twice the ceiling (`resampleTo`, `engine/dsp.ts:197`); pre-emphasis from 50 Hz; a Gaussian window 50 ms long, 25 ms effective (`:72-75`); **a 6.25 ms step** (`:31`); ten coefficients; roots kept between 50 Hz and ceiling − 50 Hz, sorted ascending, the first three being F1 to F3 (`:61-63`). The step is a DESK DEFAULT: it is the step P0b's path was run at and the step the plan costed. Weenink 2015 uses 2.5 ms and Weenink 2023's form shows 5 ms. `levinson` (`engine/dsp.ts:127`) is the autocorrelation method and is not Burg. Weenink 2015's reference list has Markel and Gray (1976) and Press et al. (1996); either may serve as the published source if it describes Burg's method, with pages.

**4. Section 3 build item 2, replace the first three bullets.**
> - **The ladder, DESK DEFAULT:** Weenink 2023's formula, middle × exp(j × step), with Ilya's own values: middle 4583 Hz, step 0.0605, j from −7 to +7. That is 15 ceilings from 3000 to 7000 Hz, the ladder P0b and the fidelity run measured. One ladder serves every voice, because no voice type may reach into the measurement. Call it L15. The 2023 defaults (nine ceilings, 4503 to 6718 Hz) are L9, reported beside it and never the default.
> - **The criterion, Weenink 2015 Eq. 3,** on the first three tracks of each ceiling:
>   - each track is fitted with m = 3 Legendre terms (P0, P1, P2, unnormalised, time scaled to −1 to 1), by least squares weighted 1/bᵢ, bᵢ being the root's bandwidth;
>   - a frame lacking a formant is skipped for that track (paper p. 2);
>   - χ² is summed over the three tracks; s²ₚ is the sum of the fitted coefficients' variances over the three tracks, from the fit's covariance matrix; k = 9; d = the sum over tracks of (nⱼ − 3), nⱼ being the frames present;
>   - t = 1.25.
> - **Ilya's choices, each a DESK DEFAULT named in the code with its reason:** m, t, d, three tracks, and the step. The paper gives "three or four" for m, "somewhat larger than 1" for t, and no formula for d. Whether its "order 3" means three terms is NOT ESTABLISHED.
> - **Yours to choose and report:** a floor on bᵢ; and when a ceiling is set aside for too few frames in a track. When every ceiling is set aside the picker returns no fR1.
> - **Sensitivity, re-scored from the stored tracks without re-running Burg:** t = 1.0 and 1.5; m = 4; L9. Once, on the primary set only: a 5 ms step.
> - Export `extractPath(y, sr, options?)` so the scoring tool can run each variant. `runCapture` uses the defaults.

**5. Section 3 build item 3, add under "When each estimator agrees".**
> - Every tolerance is relative to the path's value.
> - The closed phase **reads** when at least one pole qualifies (150 to 1200 Hz, `MIN_BW <= bw < MAX_BW`). It **abstains** when `closedPhaseResonances` returns null or no pole qualifies.
> - Envelope peaks are `findPeaks(env, PROM_DB)` on `ltasEnvExport`, kept from 150 to 3500 Hz and refined with `parabolic`, as P0b measured. In case (c) the fR2 peak is a different peak from the fR1 peak.
> - The path's fR1 absent or outside 150 to 1200 Hz is case (d), decided first. A path with no fR2 fails the fR2 part.

**6. Section 3, "Why case (a) checks fR2", replace.**
> **Why case (a) checks fR2, DESK DEFAULT.** P0b measured the plan's rule on Praat's FormantPath with 15 ceilings, not on Ilya's picker. There the rule caught 1 of 21 misses. All 21 were fR2 misses with fR1 in bar, and 18 were [i]. Requiring an envelope peak within T2 of fR2 would have caught 15 and newly flagged none of the 579 good takes. Each of Dann's 12 good takes has such a peak (P0b per-take table). This was seen after the fact on the same data, and it is NOT ESTABLISHED on real voices or on Ilya's picker. **The rule for keeping it, written before any run:** on the held-out set the clause is kept when it newly flags no more than 1 percent of takes in both bars and catches at least half of the fR2 misses. Otherwise report it and leave it off. Report every table with the clause and without. Report also how many takes the clause sends to Provisional whose fR1 is in bar.

**7. Section 3 items 4 to 6, add.**
> - **Evidence shape.** `ExtractResult` gains `method: 'path'` and an optional `path?: PathEvidence` (case a to d, the chosen ceiling, W per ceiling, the halves). Do not widen `evidence`, which `analyze.ts:142` and `score-core.ts:108-111` read as `OpenEvidence`. Case (c)'s mark is `path.case === 'c'`.
> - **`f2Quality` for the path picker:** `absent` when fR2 is null; `clear` in case (a) when `steady2` is not false; otherwise `marginal`. No reader tells `clear` from `marginal` today (`analyze.ts:98`).
> - **Steadiness:** the medians of the winning path's fR1 and fR2 frames in the first and second half of the frames, held to `T_HALVES_F1` and `T_HALVES_F2` (`analyze.ts:38`, `:55`), returned as a `Steadiness`.
> - **The route:** `extractWith` (`analyze.ts:16`) and the `f2Quality` line (`:151`) each gain a `'path'` branch. The path picker receives the guard's stretch, which `grade` already holds (`analyze.ts:186-189`). It fills `trace.envelopePeaks`, `trace.closedPhase`, and `trace.chosen`, as the open picker does (`open-extract.ts:143-146`).
> - `measurePicker` returns `'path'` for the exact value `path` only; update its header comment.

**8. Step 0, replace the last two sentences.**
> The fidelity generator is not in the repository. Build it as `tools/n200-score/fidelity-set.ts` from this recipe: cells in the order five types (bass, baritone, tenor, mezzo-soprano, soprano) × ten vowels (i, e, ɪ, ɨ, ɛ, a, ɑ, ʌ, o, u), `idx` 0 to 49; the 36 combinations in the loop order rate, bandwidth, level, pair; per cell a permutation from `rng(7000 + idx*31 + 1)`, the first 12 taken; take seed `5000 + idx*20 + k`; `jitter: 0.05`; `pairMs: 5, pairRatio: 0.6` when the pair is on; 3.5 s; `BW = [60, 90, 120, 180, 250]`, `BW_WIDE = [80, 100, 200, 250, 300]`. The truths are in the prompt as `truth.ts`. **The check:** 323 takes carry the second pulse and 277 do not (P0b :15). If your count differs, stop and report.
>
> **Then, before any engine change, commit a golden:** `runCapture` under `shipped` and `open` on the 600 primary takes, keeping f1, f2 (rounded to 0.1 Hz), confidence, reading, f2Quality, picker, and outcome. Round, because pole values differed between two machines in P0b (:22).

**9. Step 1, replace the second bullet.**
> - a `fry-synth` take through `burg.ts` at 5000 Hz and through `burg.py` unedited (its ceiling is fixed at 5000, `:28`), on a 16-bit WAV written with `wavBytes` to the system's temporary folder, never into the repository. Medians agree within 3 percent. If Python lacks numpy or scipy, say so and give NOT RUN.
> - For the known-pole test, use the unwindowed impulse response of a tenth-order all-pole filter. If 1 Hz is not met, report the error found and stop. Do not loosen the bar.

**10. Step 2, replace the last test bullet and add two.**
> - the Step 0 golden is byte-equal after this step, for `shipped` and `open`;
> - the path picker gives the same reading whichever vowel is asked, and its source holds no per-vowel table (the open picker's tests, `open-extract.test.ts:35`, `:44`, are the pattern);
> - `open-extract.test.ts:25-30` gains `?measure=path`.

**11. Step 3, replace the bars and item 1's held-out bullet.**
> - **Denominator:** every take generated, 120 per voice type. A take counts when `runCapture` gives a reading within the bar, whatever its status. A re-prompt or an error is a miss. Give a second table for Captured readings only.
> - **The 10 percent bar** counts cross-check cases (b) and (d) among takes in both bars, as P0b counted. Give Provisional by any cause beside it, with the shipped picker's figure on the same takes.
> - **Held-out set:** take seed `9000 + idx*20 + k`, permutation from `rng(11000 + idx*31 + 1)`, and each cell's five truth frequencies multiplied by one factor drawn from 0.90 to 1.10 with `rng(13000 + idx)`. DESK DEFAULT: new seeds on the same 50 truths would repeat the cells where the misses sit. Commit the settings, record that commit in the report, then run the held-out set once.
> - **Report, so the choices can be checked:** the ceiling chosen per take, as median and 10th to 90th percentile per type; how many takes choose the lowest or the highest ceiling, and how many of those miss a bar (Weenink 2023 p. 706 reports a wrong lowest-ceiling winner); for each sensitivity run, how many takes change ceiling and how many change a bar result; how many ceilings were set aside.

Replace item 2:
> 2. **Dann's takes are not in the repository.** `PICKERS` in `score-core.ts` gains `path` (L15) and `path9`. `score.run.ts` reads the reference file named by `N200_REF`, default `reference.csv`. The desk runs it on Dann's Mac with `N200_NO_BURG=1`, once with FormantPath's values and once with Praat 4000's, both taken from P0b's table. The lane compares nothing against Praat. [ɨ] take 09 is scored against Praat 4000 only and reported by itself.

**12. Step 4, replace whole.**
> Write the bar first: over at least five takes each, the median `analysisMs` with `?measure=path` is no more than 1,000 ms above the median without it, on Dann's iPhone (DESK DEFAULT).
> - `CaptureRecord` gains `analysisMs`, the time around `runCapture` at `live.ts:738`, in whole milliseconds, for every picker. It reaches the sidecar on the recorder build with `?harness=1`.
> - `vercel.json:3` gains `cloud-lane-62` beside `cloud-lane-52`, so the lane's deployment has the recorder.
> - In the lane, time `runCapture` under both pickers in the `phone` project with Chromium's CPU throttle at 1× and 4×, after `e2e-phone/poem-arias-time.test.ts`. Say in the report that this is Chromium on the lane's machine, not WebKit and not a phone.
> - Report milliseconds per ceiling, and frames per take.
> - Build no Web Worker. If the throttled figure is above the bar, report it and stop. A Worker is a separate brief, because it makes `live.ts`'s capture flow asynchronous.

**13. Section 5, replace Owns and Leaves.**
> **Owns:**
> - new: `engine/burg.ts`, `engine/path-extract.ts`, `tools/n200-score/fidelity-set.ts`, their tests, one timing test under `e2e-phone/`;
> - `engine/analyze.ts`: the `Picker` type, `extractWith`, the status term, `f2Quality`, and steadiness, for the path branch only;
> - `chart/measure-switch.ts`;
> - `tools/n200-score/score-core.ts`, `score.run.ts`, and their test.
>
> **Owns, these lines only:**
> - `engine/types.ts:77`: `picker?: 'open' | 'path'`;
> - `takes.ts:28`: the same;
> - `engine/capture-file.ts:105`: `picker?: Picker`, and the new `analysisMs`;
> - `engine/extract.ts:130`: `'path'` in `method`, and `path?: PathEvidence`. Nothing else in the file;
> - `engine/live.ts:738`: the two timing lines around the call, and passing `analysisMs` at `:740` and `:745`;
> - `vercel.json:3`: the branch name added.
>
> **Leaves:** the rest of `engine/extract.ts` and `engine/live.ts`; `engine/open-extract.ts`; `engine/closed-phase.ts`; `engine/plausibility.ts`; `engine/stand-ins.ts`; `tools/i-extractor-check/burg.py`; every string.

**14. Section 6, add.**
> - Nothing derived from a real take is committed: no WAV, no sidecar, no table. The scoring tool writes into the takes' own folder (`tools/n200-score/vitest.config.ts:10-12`).
> - The status counts in the reports are the engine's (`runCapture`), before the plausibility guard.

**15. Section 7, replace the first two bullets.**
> - Whether Ilya's t, d, and m reproduce Praat's FormantPath choices. The desk compares on Dann's takes; the lane does not.
> - Whether L15's lowest ceilings split a formant on a treble voice (Weenink 2023, p. 706). Step 3's ceiling table is the check.

## 4. For Dann's eye

1. **What an fR2 miss does to the reading (taste).** The brief sends the whole take to Provisional when fR2 has no envelope peak. In P0b every such miss had fR1 in bar, and 18 of 21 were [i]. The alternative keeps fR1 Captured and marks fR2 `absent`, which `resolve-values.ts:148` already leaves out. My recommendation is the alternative, because a re-take of the same vowel may meet the same miss. Amendment 6 has the lane count both before he rules.
2. **Where his recordings go for new Praat references.** Praat does not install on the Mac VM (P0b :20). The fidelity run's Praat step ran from `/home/claude/n200` (fidelity report :3, :8), which reads as a cloud container; that is my inference, not a stated fact. Scoring new takes against Praat means staging them off the Mac or installing Praat there.
3. **Per-take values of his voice in a repository report.** The ruling allows "expected values and checksums" (`PRODUCT.md:1108`); the tool's own comment is stricter (`tools/n200-score/vitest.config.ts:10-12`). The brief does not say which holds for the desk's Step 3 report.
4. **Money.** The plan records that the cloud lane's cost beyond his plan is NOT ESTABLISHED (plan section 4, "Money").

**Rulings check (judge item 5).** Nothing in the brief breaks `PRODUCT.md:1268-1271`: the path route takes no vowel, type, or table; the 150 to 1200 Hz limit is already listed as a physical limit (`open-extract.ts:8-10`); status comes from the cross-check; the neighbourhood is not touched. One ladder for all voices keeps clause 1; a middle chosen by voice type would break it. `PRODUCT.md:1106-1108` holds with amendment 14.

## 5. What I could not establish

- Whether t = 1.25, m = 3, and this d choose the ceilings Praat's FormantPath chooses.
- Whether L15 or L9 reads Dann's [o] and [u] under Ilya's criterion.
- Whether Weenink 2015's "order 3" means three terms or a cubic.
- Whether a tenth-order Burg fit recovers known poles to 1 Hz.
- Whether the cloud lane has Python with numpy and scipy, or a Chromium for Playwright.
- Whether `cloud-lane-62` or `-61` exists on GitHub (the local remote list ends at 60), and whether lane 52's recorder deployment is still in use.
- The list of the eight gates; I did not extract it.
- `adapter-golden.test.ts` itself; I relied on the packet for its imports.
- Packet item 10 is wrong on one point: "closed phase agrees, no fR2 peak" falls under the brief's case (b) ("fails either part", brief :62), not (d). Both are unsteady.
- Time on any phone.

## 6. What I read

- Brief: lines 1-154 (whole).
- Scout packet: lines 1-203 (whole).
- Plan r2: section headings; lines 115-155, 172-198, 216-262.
- P0 report: 1-72 (whole). P0b report: 1-173 (whole). Fidelity report: 1-30, 255-292, 425-434, 455-480.
- Fidelity tgz: file list; `gen-eval.run.ts` 1-87; `truth.ts` 1-41 (to standard output, nothing extracted).
- Weenink 2015 PDF: pdftotext lines 60-276. Weenink 2023 PDF: grep hits only.
- `engine/analyze.ts` 1-192; `chart/measure-switch.ts` 1-11; `engine/open-extract.ts` 1-148; `engine/extract.ts` 1-16, 105-175; `engine/closed-phase.ts` 125-197; `engine/types.ts` 1-12, 68-80; `takes.ts` 20-40; `engine/capture-file.ts` 20-32, 96-110, 140-150; `engine/live.ts` 94-116, 175-178, 196-204, 722-752; `engine/fry-synth.ts` 88-100; `engine/dsp.ts` 191-200; `capture-ritual.svelte.ts` 296-308.
- `tools/i-extractor-check/burg.py` 1-126; `tools/n200-score/score-core.ts` 1-60, 84-247; `score.run.ts` 1-22; `vitest.config.ts` whole; `synth-gate.run.ts` 1-30.
- `docs/memory/PRODUCT.md` 1100-1110, 1262-1279. `scripts/ratchets.mjs` 18-59, 78-114. `apps/web/playwright.config.ts` 20-60. `apps/web/vite.config.ts` 5-32. `vercel.json` 1-6. `e2e-phone/poem-arias-time.test.ts` 1-40.
- Commands: `git rev-parse`, `git branch -a`, `python3 -c "import numpy"` (ok), `python3 -c "import scipy"` (fails), greps named above.
