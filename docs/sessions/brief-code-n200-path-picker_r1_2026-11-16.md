# Brief to Code: N.200, the path picker behind `?measure=path` (plan step P2)

r1, 2026-11-16 late evening, written by the desk (Opus 5.5). For a cloud Code session on branch `cloud-lane-62`, cut from the tip of `Shane` (the desk names the commit in the prompt). It is not sent until Fable has reviewed it (`CONTRACT.md` §1 item 19).

**Read first:**
- the plan of record: `docs/sessions/plan-n200-voice-as-it-is_r2_2026-11-16.md`, especially sections 3.1, 3.2, and 6;
- its Fable critique: `docs/sessions/review-fable-plan-n200_r1_2026-11-16.md`;
- the rulings: `docs/memory/PRODUCT.md:1264-1278`.

Three measurements back this brief. They live outside the repository, in Dann's Downloads. The prompt that starts the lane gives them as text where the lane needs them.
- **P0:** `_desk-2026-11-16/n200-p0/REPORT_p0_r1_2026-11-16.md`, the papers read in full.
- **P0b:** `_desk-2026-11-16/n200-p0b/REPORT_p0b_r1_2026-11-16.md`, the cross-check measured.
- **P1:** `_desk-2026-11-16/n200-p1/REPORT_p1_r1_2026-11-16.md`, the bands checked.

Paths are under `apps/web/src/lib/voice/` unless they say otherwise. Lines were read by the desk at `Shane` `55b64d28`. Step 0 re-reads every one.

## 1. What the singer gets

**Nothing changes for a singer in this lane.** A third picker, "path", is built behind `?measure=path`. It reads each take from the take alone: no vowel, no voice type, and no table of anyone's values. The lane measures it against pre-registered bars, and it measures how long it takes on Dann's phone. Switching it on for everyone is a later lane (plan step P5).

## 2. The rulings, in Dann's words

| When | His words (short) | What it rules |
|---|---|---|
| 2026-11-13 12:29 to 12:34 | "Yes to Ilya encoutners the voice as it is. This is our gospel" | The measurement is agnostic; the status is the measurement's own; the neighbourhood never demotes; the voice type is scaffolding (`PRODUCT.md:1268-1271`). |
| 2026-11-16 16:46 | "Yes to building from the descriptions of Escudero and Boersma, and Weenink." | Built from published descriptions, not from Praat's code. |
| 2026-11-16 16:46 | "We shouldn't be using my 2020 values for everybody, that's nonsense." | `MITTON` has no place in the new picker. |
| 2026-11-16 21:27 | "the take's own analysis chooses" | The take's own analysis chooses. Other takes only describe. |

## 3. The design

**Where the method comes from.** P0 read the three papers in full.
- **Weenink (2015), Eq. 3, p. 3.** For each candidate ceiling, it fits each formant track with Legendre polynomials and computes W = (s²ₚ/k)^t · (χ²/d). The lowest W wins.
  - s²ₚ is the summed variance of the coefficients.
  - k is the number of coefficients.
  - χ² is the sum over the tracks of ((fᵢ − f̂ᵢ)/bᵢ)².
  - d is the combined degrees of freedom.
- **What the paper leaves open.** It gives t only as "somewhat larger than 1" and does not define d exactly. P0 marks both NOT ESTABLISHED.
- **Weenink (2023), p. 705,** gives the ladder of ceilings: middle × exp(k × 0.05), k = −4 to +4. It also gives Burg with ten coefficients, a 25 ms window, a 5 ms step, and pre-emphasis from 50 Hz.
- **Escudero and Boersma (2009)** need about 20 tokens per vowel. That cross-take rule failed on Dann's [u] takes (fidelity report). It is not used.

**The build.**

1. **`engine/burg.ts`: Burg LPC, with formants from the polynomial's roots.**
   - Write it from a published description of Burg's method, cited at the head of the file with author, year, title, and pages.
   - Which source is yours to choose. P0 found that Escudero and Boersma (2009, p. 9) cite Anderson (1978) for their Burg routine, and that Weenink cites no source. Name what you used.
   - `dsp.ts` already has `polyRoots` (`:39`) and `levinson` (`:127`). Reuse them where they apply.
   - Do not open Praat's source, Praat's repository, or parselmouth's source.
   - `tools/i-extractor-check/burg.py` is an offline reference written from Praat's documentation (`:5-11`). You may read it, and you may compare your output with it on the same input.
2. **`engine/path-extract.ts`: the path picker.**
   - Run the ladder of 2023: nine ceilings, middle 5500 Hz, k from −4 to +4. Score each ceiling by Weenink 2015's W on the first three formant tracks.
   - **Ilya's own settings:** t = 1.25 and d = (number of frames × number of tracks) − k. These are DESK DEFAULTS, because the paper leaves both open (P0).
   - **Sensitivity:** report every result again at t = 1.0 and t = 1.5.
   - Name each setting in the code as Ilya's choice, with the reason.
   - The reading is the median of the winning path's fR1 and fR2 frames over the guard's stretch, as `burg.py` does (`:9-11`).
3. **The cross-check, with no prior** (plan r2 section 3.1 step 3, as P0b measured it).
   - **When each estimator agrees:**
     - The closed phase agrees when one of `closedPhaseResonances`' poles with `MIN_BW <= bw < MAX_BW`, in 150 to 1200 Hz, lies within T1 of the path's fR1.
     - The envelope agrees when one of its `PROM_DB` peaks lies within T1 of fR1 and another lies within T2 of fR2.
   - **The four cases:**
     - (a) The closed phase reads and agrees, **and an envelope peak lies within T2 of fR2**: the reading stands.
     - (b) The closed phase reads and fails either part: unsteady.
     - (c) The closed phase abstains and the envelope agrees: the reading stands, marked as read by one estimator.
     - (d) Anything else, or the path's fR1 outside 150 to 1200 Hz: unsteady.
   - **Tolerances:** T1 = T2 = 0.30.
   - **Do not call `closedPhaseF1`.** It chooses by `MITTON` (`engine/closed-phase.ts:192-196`).
   - **Why case (a) checks fR2, DESK DEFAULT.** P0b found that the plan's rule caught 1 of 21 fR2 misses. Adding the fR2 check would catch 15 of the 21 and newly flag none of the 579 good takes. That was found after the fact, on the same data, so Step 3 tests it on fresh takes.
4. **Status.**
   - Unsteady joins the existing route to Provisional: `confidence === 'low'` (`engine/analyze.ts:143-147`). Add a `picker === 'path'` term beside the open picker's `evidencePoor` (`:139`).
   - The landing's existing sentence speaks for it: `capture.uncertain` (`i18n.ts:2599`). No new words.
   - The roll-back of a Provisional re-take over a Captured reading stays (`capture-ritual.svelte.ts:301-303`).
5. **Steadiness.** For the path picker, read the split-half check from the one fit's frame tracks, not by running the picker twice (`engine/analyze.ts:57-59` runs it twice today). Leave the shipped and open pickers' behaviour unchanged.
6. **The switch.** Add `'path'` to `Picker` (`engine/analyze.ts:13`) and to `measurePicker` (`chart/measure-switch.ts:9-11`), selected by `?measure=path`. A reading taken with it carries `picker: 'path'`, as the open picker's readings carry `'open'` (`:148`). Nothing changes when the address does not ask for it.

## 4. Steps

Each step is its own commit, test first where a test applies, with its own report section, then push.

### Step 0. Read and report. Change nothing.

The eight gates, with counts. Every line this brief cites, re-read on your tip. Line counts of every file you touch, against `scripts/ratchets.json`. Then confirm that the fidelity harness's synthetic generator can be rebuilt inside the repository: `engine/fry-synth.ts` (`synthFry`) and the generator the scoring tool uses (`tools/n200-score/synth-gate.run.ts`). Report whatever is missing.

### Step 1. Burg, and a known answer.

`engine/burg.ts` with unit tests:
- a synthetic all-pole signal with known poles, whose roots are recovered to 1 Hz;
- the same `fry-synth` take run through `burg.ts` and through `tools/i-extractor-check/burg.py` at one fixed ceiling, with medians agreeing within 3 percent. Run `burg.py` in the lane if Python with numpy and scipy is present. Otherwise say so and give the comparison as NOT RUN.

### Step 2. The path picker and the cross-check.

`engine/path-extract.ts`, the switch, and the status term, with these unit tests:
- each of the four cases on a constructed input;
- `closedPhaseF1` is never called on the path route (spy or grep test);
- `MITTON` is never imported by `path-extract.ts`;
- the shipped and open pickers' outputs are unchanged on the existing golden set (`analysis/__golden__/adapter-snapshots.json`; list any case that moves).

### Step 3. Pre-registered measurement, on two instruments.

Write the bars into the report before the first run (plan r2 section 6):
- fR1 within 10 percent and fR2 within 12 percent, on at least 80 percent of all takes per voice type;
- a take with no reading counts as a miss;
- no more than 10 percent of takes the truth accepts are flagged unsteady;
- every status that moves, listed in both directions.

1. **The synthetic set.** The fidelity set's recipe: five types × ten vowels × 12 takes; rate 35, 50, 70 Hz; bandwidths `BW` or `BW_WIDE`; level 0, −15, −30 dB; second pulse none or 5 ms at 0.6; seeds 5000 + index.
   - **And a held-out set:** the same recipe with seeds 9000 + index, never looked at while settings are chosen.
   - Report both, with and without the second pulse.
   - The truths are Ilya's stand-ins (`engine/stand-ins.ts`, `template()`), and tenor and mezzo-soprano share one truth: say in words that the set holds four distinct types.
2. **Dann's takes are not in the repository** (`PRODUCT.md:1106-1108`). The lane writes a script that scores a folder of capture WAVs and sidecars with the path picker and prints one row per take. The desk runs it on Dann's Mac and reports against Praat FormantPath and Praat at 4000 Hz. Score [ɨ] take 09 against Praat at 4000 Hz only, and report it by itself.

### Step 4. Time on a phone.

Write the bar before measuring: the path picker adds no more than 1.0 s to a take's analysis on an iPhone (DESK DEFAULT).
- Add a timing line to the take's trace (`ExtractTrace`) giving the picker's milliseconds, so that a take recorded on Dann's phone with `?measure=path` reports it.
- In the lane, measure the same in Playwright's WebKit with CPU throttling at 4×, and say plainly that this is not a phone.
- If the bar is missed, move the analysis into a Web Worker and measure again. Report both.

## 5. Owns and leaves

**Owns:**
- `engine/burg.ts`, `engine/path-extract.ts`, and their tests;
- `engine/analyze.ts` (the `Picker` type, the status term, steadiness for the path picker);
- `chart/measure-switch.ts`;
- the take record's `picker` field;
- a scoring script under `tools/n200-score/`;
- the trace's timing line.

**Leaves:**
- `engine/extract.ts`, `engine/open-extract.ts`, and `engine/closed-phase.ts`. Read them, change nothing.
- `engine/plausibility.ts` and `engine/stand-ins.ts`. Their sources are corrected in a separate lane after P1's findings.
- Every string.

**Other sites that compute the same number.** fR1 and fR2 are computed today by `extractFormants` (`engine/extract.ts:132`) and `extractOpen` (`engine/open-extract.ts`), both routed through `extractWith` (`engine/analyze.ts:15-16`). The path picker joins them as a third route, and nothing that reads `CalibratedFormant` changes shape. The scoring tool (`tools/n200-score/score-core.ts`) compares pickers; it gains `path`.

## 6. Constraints

- Change nothing under `docs/memory/`, and do not edit, rename, or replace a brief.
- No new dependency. Line ceilings hold, and a new file stays under 1,000 lines.
- Push only `cloud-lane-62`, and open no pull request.
- No English or French is added.
- No recording of a real voice enters the repository.

## 7. What the desk could not establish

NOT ESTABLISHED beats a complete invented answer.

- Whether t = 1.25 and this d reproduce Praat's FormantPath choices. Report agreement with the FormantPath values the desk supplies, as a check only.
- Whether nine ceilings from 4503 to 6718 Hz reach a bass's low ceiling. Fidelity B chose ceilings as low as 3187 Hz for bass (fidelity report, "Ceilings chosen"). If the ladder's lowest ceiling misses the bass bars, report it and run a second ladder from 3000 to 7000 Hz in 15 log steps as well.
- The time on a real phone.
- Whether a real treble's fry gives closed-phase poles.

## 8. Reports

Write `docs/sessions/report-code-n200-path-step<N>_r1_<date>.md` for each step. Each gives what changed, with file and line; the tests added; the gates; the tables; and what you could not establish.
