# Brief to Code: N.200, the path picker behind `?measure=path` (plan step P2)

r3, 2026-11-16 late evening, written by the desk (Opus 5.5) from r1, Fable's review of r1 (`docs/sessions/review-fable-brief-n200-path_r1_2026-11-16.md`: SEND WITH AMENDMENTS, 7 blockers, 15 amendments), Fable's delta review of r2 (`docs/sessions/review-fable-brief-n200-path-r2-delta_r1_2026-11-16.md`: SEND WITH AMENDMENTS, R1 to R12), and Dann's two rulings of 22:11. Every amendment is applied here. r1 and r2 are superseded and kept.

This brief is for a cloud Code session on branch `cloud-lane-62`, cut from the tip of `Shane`. The desk names the commit in the prompt.

**Read first:**
- the plan of record, `docs/sessions/plan-n200-voice-as-it-is_r2_2026-11-16.md`, sections 3.1, 3.2, and 6;
- its Fable critique, `docs/sessions/review-fable-plan-n200_r1_2026-11-16.md`;
- Fable's review of this brief's r1.

**Three measurements back this brief.** They sit outside the repository, in Dann's Downloads folder, and the prompt gives you what you need from them as text:
- P0, the papers read in full;
- P0b, the cross-check measured on Praat FormantPath;
- P1, the bands checked.

**Paths.** Paths are under `apps/web/src/lib/voice/` unless they say otherwise. Exceptions:
- `i18n.ts` is `apps/web/src/lib/i18n.ts`;
- `dsp.ts` is `engine/dsp.ts`;
- `CONTRACT.md` is `docs/memory/CONTRACT.md`;
- the ruling is `docs/memory/PRODUCT.md:1264-1273`.
- `resolve-values.ts`, `divergence.ts`, and `open-extract.test.ts` are under `engine/`;
- `tools/`, `scripts/`, `docs/`, and `vercel.json` are at the repository root; `e2e-phone/` and `playwright.config.ts` are under `apps/web/`.

The desk, the scout, and Fable read the lines at `Shane` `55b64d28`. Step 0 re-reads every one.

## 1. What the singer gets

Nothing changes for a singer in this lane. A third picker, "path", is built behind `?measure=path`. It reads each take from the take alone, with no vowel, no voice type, and no table of anyone's values. The lane measures it against bars written before the run and times it. Switching it on for everyone is a later lane.

## 2. The rulings, in Dann's words

| When | His words (short) | What it rules |
|---|---|---|
| 2026-11-13 12:29 to 12:34 | "Yes to Ilya encoutners the voice as it is. This is our gospel" | The measurement is agnostic. Its status is the measurement's own. The neighbourhood never demotes. The voice type is scaffolding (`PRODUCT.md:1268-1271`). |
| 2026-11-16 16:46 | "Yes to building from the descriptions of Escudero and Boersma, and Weenink." | Build from published descriptions, never from Praat's code. |
| 2026-11-16 16:46 | "We shouldn't be using my 2020 values for everybody, that's nonsense." | `MITTON` has no place in the path picker. |
| 2026-11-16 21:27 | "the take's own analysis chooses" | Other takes only describe. |
| 2026-11-16 22:11 | "real voices matter to me more than synthetic tests do" | Real-voice results are reported first, and they decide where the two disagree (`INBOX.md`, 22:11). |
| 2026-11-16 22:11 | (option 1, the desk's reading of his reply) | When fR1 is sound and fR2 is not clear, fR1 stays Captured and fR2 is absent. The take is not marked Provisional. |
| 2026-09-30 13:14 | "Colleagues' recordings will never be public!" | No real recording enters the repository (`PRODUCT.md:1106-1108`). |

## 3. The design

### 3.1 Where the method comes from (P0, the papers read in full)

- **Weenink (2015), Eq. 3, p. 3.** For each candidate ceiling, the method fits each formant track with Legendre polynomials and computes W = (s²ₚ/k)^t · (χ²/d). The lowest W wins.
- **What 2015 leaves open.** The paper gives t only as "somewhat larger than 1". It does not define d. It gives the order as "three or four".
- **Weenink (2023)** gives the ladder formula (middle × exp(j × step)) and Praat's defaults.
- **Escudero and Boersma (2009)** choose one ceiling per speaker and vowel across 20 tokens. Ilya has one take, and Dann ruled that the take's own analysis chooses, so this method is not used. A cross-take variant built from a description of it gave wrong values on Dann's [u] takes. That was the fidelity report's variant A; the paper's exact criterion was not tested.

### 3.2 The build

**1. `engine/burg.ts`: Burg LPC, with formants from the roots.**
- The analysis follows `tools/i-extractor-check/burg.py:66-89`, with the ceiling as a parameter:
  - resample to twice the ceiling (`resampleTo`, `dsp.ts:197`);
  - pre-emphasis from 50 Hz;
  - a Gaussian window 50 ms long, 25 ms effective (`:72-75`);
  - **a 6.25 ms step** (`:31`);
  - ten coefficients;
  - roots kept between 50 Hz and the ceiling minus 50 Hz, sorted ascending, the first three being F1 to F3 (`:61-63`).
- **Why 6.25 ms (DESK DEFAULT):** it is the step P0b's path ran at and the step the plan costed. Weenink 2015 uses 2.5 ms, and the form in Weenink 2023 shows 5 ms.
- **The source of Burg's method.** Write it from a published description, cited at the head of the file with pages. Weenink 2015's reference list has Markel and Gray (1976) and Press et al. (1996). Use either if it describes Burg's method, and name what you used.
- `levinson` (`dsp.ts:127`) is the autocorrelation method, not Burg. `polyRoots` (`dsp.ts:39`) may be reused.
- **What you must not open:** Praat's source, Praat's repository, and parselmouth's source.

**2. `engine/path-extract.ts`: the path picker.**
- **The ladder, L15 (DESK DEFAULT).** Weenink 2023's formula with Ilya's own values: middle 4583 Hz, step 0.0605, j from −7 to +7. That gives 15 ceilings from 3000 to 7000 Hz, the ladder P0b and the fidelity run measured. One ladder serves every voice, because no voice type may reach into the measurement. The 2023 defaults (nine ceilings, 4503 to 6718 Hz) are L9. Report L9 beside L15; it is never the default.
- **The criterion, Weenink 2015 Eq. 3,** computed on the first three tracks of each ceiling:
  - fit each track with m = 3 Legendre terms (P0, P1, P2, unnormalised, time scaled to −1 to 1), by least squares weighted by 1/bᵢ, where bᵢ is the root's bandwidth;
  - skip a frame that lacks a formant, for that track only (paper p. 2);
  - sum χ² over the three tracks;
  - s²ₚ is the sum of the fitted coefficients' variances over the three tracks, from the fit's covariance matrix;
  - k = 9;
  - d = the sum over tracks of (nⱼ − 3), where nⱼ is the frames present;
  - t = 1.25.
- **Ilya's choices.** m, t, d, three tracks, and the step are each a DESK DEFAULT, named in the code with its reason. Whether the paper's "order 3" means three terms is NOT ESTABLISHED.
- **Yours to choose and report:** a floor on bᵢ, and when a ceiling is set aside for too few frames in a track. When every ceiling is set aside, the picker returns no fR1.
- **Sensitivity**, re-scored from the stored tracks without re-running Burg: t = 1.0 and 1.5; m = 4; L9. Once, on the primary set only: a 5 ms step.
- **The reading:** the median of the winning path's fR1 and fR2 frames over the guard's stretch.
- Export `extractPath(y, sr, options?)` so the scoring tool can run each variant. `runCapture` uses the defaults.

**3. The cross-check, with no prior.**
- Every tolerance is relative to the path's value. T1 = 0.30 for fR1 and T2 = 0.30 for fR2.
- **The closed phase reads** when at least one pole of `closedPhaseResonances` qualifies: 150 to 1200 Hz, `MIN_BW <= bw < MAX_BW` (`engine/closed-phase.ts:137`, `:189`; a pole is `{ f, bw }`, `:56`). It **abstains** when the function returns null or no pole qualifies.
- **Envelope peaks** are `findPeaks(env, PROM_DB)` on `ltasEnvExport` (`engine/extract.ts:94`), kept from 150 to 3500 Hz and refined with `parabolic` (`:39`). Import `PROM_DB` from `engine/open-extract.ts:44`, which exports it.
- **Do not call `closedPhaseF1`.** It picks by its `prior` argument (`engine/closed-phase.ts:192-196`), and its caller passes `MITTON` (`engine/extract.ts:140`, `:152-153`).
- **fR1, in order:**
  - (d, `no-fr1`) The path has no fR1: it returns `f1: null`, and `engine/analyze.ts:190` gives the error `EXTRACTION_FAILED`, which Step 3 counts as a miss. Decided first.
  - (d, `out-of-range`) The path's fR1 is outside 150 to 1200 Hz: the reading is returned and is **unsteady** (Provisional).
  - (a) The closed phase reads, and one of its qualifying poles (150 to 1200 Hz, `MIN_BW <= bw < MAX_BW`; DESK DEFAULT) lies within T1 of the path's fR1: fR1 **stands**.
  - (b) The closed phase reads, and no qualifying pole lies within T1: **unsteady**.
  - (c) The closed phase abstains, and an envelope peak lies within T1 of fR1: fR1 **stands**, marked as read by one estimator.
  - (d, `no-peak`) The closed phase abstains, and no envelope peak lies within T1: **unsteady**.
  - `PathEvidence` records the case as a, b, c, or d, and for d its reason: `no-fr1`, `out-of-range`, or `no-peak`.
- **fR2, Dann's option 1 (22:11):**
  - The fR2 check runs in every case in which the path has an fR1, whether fR1 stands or not (DESK DEFAULT: when fR1 does not stand the reading is Provisional anyway, and one rule is simpler to count).
  - An envelope peak within T2 of the path's fR2: fR2 is **kept**. In case (c) it must be a different peak from fR1's.
  - No such peak, or the path has no fR2: fR2 is **absent**. **Absent means `ExtractResult.f2` is null**, so `engine/analyze.ts:154` writes no `f2`. The value the path found is held in `PathEvidence` only. Reason: `takes.ts:36`, `chart/zones.ts:137`, `chart/readings.ts:62`, `chart/tap.ts:57`, `chart/ChartLayers.svelte:72`, `VowelCapture.svelte:312`, and `engine/divergence.ts:7` read `f2` by number and never read `f2Quality`.
  - fR1 stays as its own case left it. fR2 never makes a take unsteady.
- **Why the fR2 check exists.** P0b measured the plan's rule on Praat FormantPath with 15 ceilings, not on Ilya's picker:
  - the plan's rule caught 1 of 21 fR2 misses;
  - all 21 had fR1 in the bar, and 18 were [i];
  - an envelope-peak check on fR2 would have caught 15 and newly rejected none of the 579 good takes;
  - each of Dann's 12 good takes has such a peak.

  This was seen after the fact, on the same data, and is NOT ESTABLISHED on real voices or on Ilya's picker.
- **The rule for keeping the check, written before any run.** `extractPath` takes `f2Check`, default true. An fR2 miss is a take whose path fR2, before the check, is outside the 12 percent bar. On the held-out set, the check passes when it marks fR2 absent on no more than 1 percent of takes whose path fR2 is in the bar, and marks absent at least half of the fR2 misses. With no fR2 misses, the first condition decides alone (DESK DEFAULT). The lane reports pass or fail and every table with `f2Check` on and off. **It does not change the default.** The desk reads Dann's takes beside it and rules.

**4. Status.**
- Unsteady joins the existing route to Provisional, `confidence === 'low'` (`engine/analyze.ts:143-147`): add a `picker === 'path'` term beside the open picker's `evidencePoor` (`:142`).
- The landing's existing sentence speaks for it: `capture.uncertain` (`i18n.ts:2599`). No new words.
- The roll-back of a Provisional re-take over a Captured reading stays as it is (`capture-ritual.svelte.ts:301-303`).

**5. Evidence shape.**
- `ExtractResult` gains `method: 'path'` and an optional `path?: PathEvidence`. It holds the case (a to d), whether fR2 was kept, the chosen ceiling, W per ceiling, and the halves.
- Do not widen `evidence`, which `engine/analyze.ts:142` and `tools/n200-score/score-core.ts:108-111` read as `OpenEvidence`.

**6. `f2Quality` for the path picker:**
- `absent` when fR2 is null or not kept;
- `clear` in case (a) when `steady2` is not false;
- otherwise `marginal`.

No reader tells `clear` from `marginal` today (`engine/analyze.ts:98`). `engine/resolve-values.ts:148` leaves out a reading with no `f2`. One reader does more: `engine/divergence.ts:7` and `:15` set a sung [ɨ] to Provisional when [i] or [u] has no `f2`. Change nothing there. Report, per voice type, how many [i] and [u] takes have fR1 standing and fR2 absent.

**7. Steadiness.**
- Take the medians of the winning path's fR1 and fR2 frames in the first and second halves of its frames.
- Hold them to `T_HALVES_F1` and `T_HALVES_F2` (`engine/analyze.ts:38`, `:55`), and return them as a `Steadiness`.
- Run the picker once, not twice.

**8. The route.**
- `extractWith` (`engine/analyze.ts:16`) and the `f2Quality` line (`:151`) each gain a `'path'` branch. Today anything that is not `'open'` reaches the shipped code and `MITTON`.
- The path picker receives the guard's stretch, which `grade` already holds (`engine/analyze.ts:186-189`).
- It fills `trace.envelopePeaks`, `trace.closedPhase`, and `trace.chosen`, as the open picker does (`engine/open-extract.ts:143-146`).
- A reading taken with it carries `picker: 'path'`, as the open picker's readings carry `'open'` (`engine/analyze.ts:155`).

**9. The switch.**
- Add `'path'` to `Picker` (`engine/analyze.ts:13`).
- `measurePicker` (`chart/measure-switch.ts:9-11`) returns `'path'` for the exact value `path` only. Update its header comment.

## 4. Steps

Each step is its own commit, test first where a test applies, with its own report section, then pushed.

### Step 0. Read, rebuild the test set, and commit a golden. Change no engine code.

1. **Read.** Run the eight gates with counts. Re-read every line this brief cites on your tip. Give the line counts of every file you touch against `scripts/ratchets.json`.
2. **Rebuild the test set.** The fidelity generator is not in the repository. Build it as `tools/n200-score/fidelity-set.ts`:
   - **Cells:** five types (bass, baritone, tenor, mezzo-soprano, soprano) × ten vowels (i, e, ɪ, ɨ, ɛ, a, ɑ, ʌ, o, u), in that order, `idx` 0 to 49.
   - **Combinations:** 36, in the loop order rate (35, 50, 70 Hz), bandwidth (`BW = [60, 90, 120, 180, 250]` or `BW_WIDE = [80, 100, 200, 250, 300]`), level (0, −15, −30 dB), pair (none, or `pairMs: 5, pairRatio: 0.6`).
   - **The draw:** per cell, `cellRng = rng(7000 + idx*31 + 1)`; draw one number per combination, in combination order; sort the combinations ascending by their number; keep the first 12. Bandwidth order is `BW` then `BW_WIDE`; pair order is none then pair.
   - **Seeds and settings:** take seed `5000 + idx*20 + k`, with `jitter: 0.05` and 3.5 s.
   - **Truths:** from `truth.ts`, given in the prompt as text.
   - **The check:** 323 takes carry the second pulse and 277 do not. If your count differs, stop and report.
3. **Commit a golden before any engine change.** `tools/n200-score/golden.run.ts` runs `runCapture` under `shipped` and `open` on the 600 primary takes and writes `tools/n200-score/__golden__/shipped-open-600.json`: f1 and f2 (both rounded to 0.1 Hz, because pole values differed between two machines in P0b), confidence, reading, f2Quality, picker, and outcome. It runs under the tool's own config (`tools/n200-score/vitest.config.ts`) and is not one of the eight gates (DESK DEFAULT). Both files join Owns.
4. **Name the gap.** `apps/web/src/lib/analysis/__golden__/adapter-snapshots.json` holds no picker output (it is read by `adapter-golden.test.ts`), so it cannot serve as this golden.

### Step 1. Burg, against known answers.

`engine/burg.ts`, with these unit tests:
- **Known poles.** The unwindowed impulse response of a tenth-order all-pole filter recovers its poles to 1 Hz. If it does not, report the error found and stop. Do not loosen the bar.
- **Against `burg.py`.** A `fry-synth` take goes through `burg.ts` at 5000 Hz and through `burg.py`, unedited; its ceiling is fixed at 5000 Hz (`:28`). The take is written as a 16-bit WAV, with `wavBytes`, to the system's temporary folder, never into the repository. The medians agree within 3 percent. If Python lacks numpy or scipy, say so and give NOT RUN.

### Step 2. The path picker, the cross-check, and the switch.

The build of section 3.2, with these tests:
- each fR1 case, (a) to (d), and each fR2 outcome, on constructed inputs;
- `closedPhaseF1` is never called on the path route, and `path-extract.ts` imports no `MITTON`;
- the path picker gives the same reading whichever vowel is asked, and its source holds no per-vowel table (follow `open-extract.test.ts:35`, `:44`);
- `open-extract.test.ts:25-30` gains `?measure=path`;
- **the Step 0 golden is byte-equal after this step**, for `shipped` and `open`.

### Step 3. Measurement, with bars written first.

**Write the bars into the report before the first run:**
- fR1 within 10 percent and fR2 within 12 percent, on at least 80 percent of takes per voice type.
- **Denominator:** every take generated, 120 per type. A take counts when `runCapture` gives a reading within the bar, whatever its status. A re-prompt or an error counts as a miss. Give a second table for Captured readings only.
- **fR2 marked absent** counts as an fR2 miss in the main table. Give a second table that leaves absent fR2 out.
- "In both bars" is judged on the path's fR1 and fR2 before the fR2 check.
- **Good takes flagged:** no more than 10 percent of takes in both bars may fall in case (b) or (d). Give Provisional by any cause beside it, with the shipped picker's figure on the same takes.
- **List every status that moves, in both directions.**

**Real voices first** (Dann 22:11). Dann's takes are not in the repository, and nothing from them may be committed, so the lane cannot report them. The lane's part:
- `PICKERS` in `score-core.ts` gains `path` (L15, through `runCapture`).
- L9 has no route through `runCapture`. The tool adds columns `path9_fR1` and `path9_fR2` from `extractPath` with the L9 ladder on the guard's stretch, with no status (DESK DEFAULT).
- `score.run.ts` reads the reference file named by `N200_REF`, default `reference.csv`.
- Push this before the synthetic runs, and say so in the Step 3 report's first line.
- The Step 3 report opens with the heading "Dann's takes" and one sentence: the desk runs them and holds the results outside the repository.

The desk's part, not the lane's: run on Dann's Mac with `N200_NO_BURG=1`, once with FormantPath's values and once with Praat at 4000 Hz (two CSV files from P0b's table); [ɨ] take 09 against Praat at 4000 Hz only; where the real result and the synthetic one point different ways, the real one decides.

1. **The synthetic set.** The primary set from Step 0, and a held-out set:
   - **Held-out settings:** take seed `9000 + idx*20 + k`, permutation from `rng(11000 + idx*31 + 1)`, and each cell's five truth frequencies multiplied by one factor drawn from 0.90 to 1.10 with `rng(13000 + idx)`.
   - **Why new truths, not only new seeds (DESK DEFAULT):** new seeds on the same 50 truths would repeat the cells where the misses sit.
   - **Run it once:** commit the settings, record that commit in the report, then run the held-out set once.
   - **Report** every table with and without the second pulse.
   - **Say in words** that the truths are Ilya's own stand-ins, and that tenor and mezzo-soprano share one truth, so the set holds four distinct types.
2. **Report, so the choices can be checked:**
   - the ceiling chosen per take, as median and 10th to 90th percentile per type;
   - how many takes choose the lowest or the highest ceiling, and how many of those miss a bar (Weenink 2023, p. 706, reports a wrong lowest-ceiling winner);
   - for each sensitivity run, how many takes change ceiling and how many change a bar result;
   - how many ceilings were set aside;
   - for each fR2 miss: the chosen ceiling, the path's F2 and F3, the take's truth fR2 and fR3, and whether the check kept fR2.

### Step 4. Time.

**Write the bar first (DESK DEFAULT):** over at least five takes each, the median `analysisMs` with `?measure=path` is no more than 1,000 ms above the median without it, on Dann's iPhone.

- `CaptureRecord` gains `analysisMs`, the time around `runCapture` at `engine/live.ts:738`, in whole milliseconds, for every picker. It reaches the sidecar on the recorder build with `?harness=1`.
- `vercel.json:3` gains `cloud-lane-62` beside `cloud-lane-52`, and `git.deploymentEnabled` (`:43-47`) gains `"cloud-lane-62": true`. Without the second, the branch is not deployed (`"**": false`, `:44`).
- **In the lane:** time `runCapture` under both pickers in the `phone` project, with Chromium's CPU throttle at 1× and 4×, after the pattern of `e2e-phone/poem-arias-time.test.ts:21-24`. Say in the report that this is Chromium on the lane's machine, not WebKit and not a phone.
- **Report** milliseconds per ceiling, and frames per take.
- **Build no Web Worker.** If the throttled figure is above the bar, report it and stop. A Worker is a separate brief, because it makes the capture flow in `live.ts` asynchronous.

## 5. Owns and leaves

**Owns:**
- new: `engine/burg.ts`, `engine/path-extract.ts`, `tools/n200-score/fidelity-set.ts`, their tests, and one timing test under `e2e-phone/`;
- `engine/analyze.ts`: the `Picker` type, `extractWith`, the status term, `f2Quality`, and steadiness, for the path branch only;
- `chart/measure-switch.ts`;
- `tools/n200-score/score-core.ts`, `score.run.ts`, and their test.

**Owns, these lines only:**
- `engine/types.ts:77`: `picker?: 'open' | 'path'`;
- `takes.ts:28`: the same (`rawOf`, `:34-39`, copies it);
- `engine/capture-file.ts:105`: `picker?: Picker`, and the new `analysisMs`;
- `engine/extract.ts:130`: `'path'` in `method`, and `path?: PathEvidence`. Nothing else in the file;
- `engine/live.ts:738`: the two timing lines around the call, and passing `analysisMs` at `:740` and `:745`;
- `vercel.json:3` and `:43-47`: the branch name added in both.
- new: `tools/n200-score/golden.run.ts` and `tools/n200-score/__golden__/shipped-open-600.json`.

**Leaves:**
- the rest of `engine/extract.ts` and `engine/live.ts`;
- `engine/open-extract.ts`, `engine/closed-phase.ts`, `engine/plausibility.ts`, `engine/stand-ins.ts`;
- `tools/i-extractor-check/burg.py`;
- every string.

**Other sites that compute the same number.**
- fR1 and fR2 are computed today by `extractFormants` (`engine/extract.ts:132`) and by the open picker, both through `extractWith` (`engine/analyze.ts:15-16`). The path picker is a third route.
- Every reader of `CalibratedFormant` keeps its shape, apart from the widened `picker` literal.
- The scoring tool compares pickers, and it gains `path` and `path9`.

## 6. Constraints

- Change nothing under `docs/memory/`, and do not edit, rename, or replace a brief.
- No new dependency. Line ceilings hold. A new file stays under 1,000 lines.
- Push only `cloud-lane-62`, and open no pull request.
- No English or French is added.
- Nothing from a real take is committed: no WAV, no sidecar, no table. The scoring tool writes into the takes' own folder (`tools/n200-score/vitest.config.ts:10-12`).
- The status counts in the reports are the engine's (`runCapture`), before the plausibility guard.

## 7. What the desk could not establish

NOT ESTABLISHED beats a complete invented answer.

- Whether Ilya's t, d, and m reproduce Praat FormantPath's choices. The desk compares them on Dann's takes; the lane does not.
- Whether L15's lowest ceilings split a formant on a treble voice (Weenink 2023, p. 706). Step 3's ceiling table is the check.
- What caused the 18 [i] fR2 misses on the synthetic set. Its [i] truths keep fR2 and fR3 apart: 1705 and 2750 Hz for a bass, about 1.6 times, scaled by the same factor for every type (`truth.ts`). The Step 3 report on the misses is the check. Dann's point at 22:11 is that a real [i] has fR2 close to fR3. These truths hold them 1.6 times apart, so the synthetic set does not test it. His takes do.
- Whether the cloud lane has Python with numpy and scipy, and Chromium for Playwright.
- The time on a real phone. The desk measures it with Dann after the lane deploys.
- Whether a real treble's fry gives closed-phase poles.

## 8. Reports

Write `docs/sessions/report-code-n200-path-step<N>_r1_<date>.md` for each step. Each report gives:
- what changed, with file and line;
- the tests added;
- the gates;
- the tables;
- what you could not establish.
