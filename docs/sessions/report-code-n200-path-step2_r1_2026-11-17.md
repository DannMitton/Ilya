# Report, N.200 path picker, Step 2: the path picker, the cross-check, and the switch

Cloud lane 62, branch `cloud-lane-62`. Brief `brief-code-n200-path-picker_r3_2026-11-16.md`, Step 2. Commit `bdb9b00` (one correction after the first test run is described below). "The gates" here means the changed files' tests; the eight gates are reported once, at the end of the lane (desk rule).

## What changed, with file and line

- **New `apps/web/src/lib/voice/engine/path-extract.ts`** (about 235 lines): the ladders `L15` and `L9`; `pathTracks` (Burg at each ceiling, the first three poles of each frame as three tracks); `scoreCeilings` (Weenink 2015 Eq. 3); `choosePath`; `crossCheck` (the pure fR1 cases a to d and the fR2 outcome); `pathFromTracks`; `extractPath(y, sr, options?, trace?)`. It imports `closedPhaseResonances`, not `closedPhaseF1`, and `PROM_DB` and `F1R` from `open-extract.ts`.
- `engine/analyze.ts`: `Picker` gains `'path'`; `extractWith` and the `f2Quality` line gain a `'path'` branch; `pathSteadiness` (halves from the one fit's tracks: the picker runs once); `pathF2Quality`; a `pathPoor` term (case b or d) beside `evidencePoor`; the reading carries `picker: 'path'`.
- `engine/types.ts:77`, `takes.ts:28`: `'open' | 'path'`. `engine/capture-file.ts:27,105`: `picker?: Picker`. `engine/extract.ts:4,131`: `'path'` in `method`, `path?: PathEvidence`, and the type import that needs (one line more than the brief's "nothing else in the file").
- `chart/measure-switch.ts`: `path` for the exact value `path` only; header comment updated.
- `tools/n200-score/score-core.ts`, `score.run.ts`, `score-core.test.ts`: `PICKERS.path`, `path9_fR1` and `path9_fR2` (L9 through `extractPath` on the guard's stretch, no status; `path9_fR2` is the path's own fR2 before the check), the evidence marks for path, `N200_REF`.
- New `tools/n200-score/measure-core.ts` and `measure.run.ts` (Step 3 tools); `tools/n200-score/vitest.config.ts` `include`.
- `PathEvidence` gained `pathF3` (the median of the third track), beyond the brief's list, so Step 3's report on fR2 misses can name the path's F3.

## The choices, each named in the code with its reason

DESK DEFAULTS of the brief: L15 as the only default ladder, m = 3 terms, t = 1.25, d = Σ(nⱼ − m), three tracks, a 6.25 ms step, T1 = T2 = 0.30. **My choices, to report:**
- **B_FLOOR_HZ = 20:** a bandwidth floor for the weights. A pole near the unit circle has a bandwidth of a few hertz and would carry all the weight. 20 Hz is under the 25 Hz `MIN_BW` the closed-phase module treats as a steady tone.
- **MIN_TRACK_SHARE = 0.5:** a ceiling is set aside when any of its three tracks is present in fewer than half of the frames, or has no more frames than terms. When every ceiling is set aside, the picker returns `f1: null`, which `runCapture` turns into `EXTRACTION_FAILED`.
- k = 3 × terms, since it scales every ceiling's W alike (it cannot change which ceiling wins).

## The tests added (`path-extract.test.ts`, 26 tests; one line in `open-extract.test.ts`)

- The ladders: L15 15 ceilings 3000 to 7000 Hz; L9 4503 to 6718 Hz.
- Each fR1 case on constructed inputs: (a), (b), (c), (d no-peak), (d out-of-range, both ends), (d no-fr1).
- Each fR2 outcome: kept; absent with no peak; absent with no path fR2; the check runs whether fR1 stands or not; in case (c) a different peak from fR1's; `f2Check` off; every tolerance relative to the path's value (30.0 percent of 2000 is 600).
- `scoreCeilings`: the steadier path has the lower W; a ceiling is set aside when a track is short; t moves W.
- **Source tests** (after `open-extract.test.ts:35,44`): `path-extract.ts` has no `MITTON`, no `vowel`, no voice type, no `prior`, no per-vowel table, no import of `plausibility`, `stand-ins`, or `voiceTypes`; and it never calls `closedPhaseF1` (and does call `closedPhaseResonances`).
- **The same reading whichever vowel is asked:** ten vowels through `runCapture` with `'path'`, one distinct output, carrying `"picker":"path"`.
- The switch: `?measure=path` selects it for the exact value only (`PATH` and `paths` do not); `open-extract.test.ts` gains the `?measure=path` line.
- The route: a clean take reads within 10 percent of the truth, carries `picker: 'path'`, fills `trace.envelopePeaks`, `trace.closedPhase`, `trace.chosen` (with `method: 'path'`, `evidence` undefined, 15 ceilings and 15 W values), and the take record keeps the picker. A kept fR2 is the path's own value; an absent one leaves `f2` undefined, and `f2Quality` is `absent` exactly then.
- Scoring tool: `path` and `path9` appear with their columns; `N200_REF` selects the reference file.

## The Step 0 golden is byte-equal after this step

`golden.run.ts` ran against the tree with Step 2's code (before the `choosePath` refactor, which touches only the path route): **passed**. The shipped and open pickers read the 600 primary takes exactly as before, to the byte.

## The gates (the changed files' tests)

| Run | Result |
|---|---|
| `path-extract.test.ts`, `burg.test.ts`, `capture-file.test.ts` | 42 passed |
| `score-core.test.ts`, `fidelity-set.test.ts` (tool config) | 16 passed |
| the whole `src/lib/voice` folder (before the move below) | 746 passed, 1 failed (below), 747 |
| `svelte-check` | 0 errors, 12 warnings, 5 files |
| golden compare | passed |

**One failure, found and fixed.** `capture-file.test.ts` ("no other file in the app imports the recorder") failed because my Step 1 r2 test-support file `burg-fixtures.ts` sat under `apps/web/src` and imported `wavBytes` from the recorder. **Commit `02ae6fd` (Step 1 r2) therefore left that test failing, because I ran only `burg.test.ts` and the ratchets for that step, not the whole folder.** The file now lives at `tools/n200-score/burg-fixtures.ts`, and the test passes. The Step 1 r2 report names the old place; this report is the correction. `svelte-check` also found a type error in my Step 0 `fidelity-set.ts` (`d.f2` is optional), once it was imported from a checked file; fixed.

## An observation to report (not changed: the brief's rule is followed to the letter)

On a synthetic [ɑ] (truth fR1 650, fR2 1050) the picker returned fR1 640 and **fR2 647**, case (a), fR2 kept and `clear`. The path's second track had settled on the same resonance as fR1 (a spurious pole just above fR1), and the envelope peak near 647 is fR1's own peak, which the check accepts: the brief asks for "a different peak from fR1's" in case (c) only. A rule that fR2 must lie above fR1 by the instrument's resolution (the open picker's `RESOLUTION_HZ`, 125 Hz) would catch it. It is not in the brief; Step 3's fR2-miss table shows how often it matters, and the desk rules.

## Timing, one case

One take through `runCapture` with `'path'` took 0.6 to 0.8 s on the lane's machine, unloaded, Node. Step 4 measures it properly.

## What I could not establish

- Whether t = 1.25, m = 3, and this d choose the ceilings Praat's FormantPath chooses (the desk compares on Dann's takes).
- Whether the path picker reads Dann's back vowels: Step 3's synthetic results cannot say.
