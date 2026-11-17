# Brief to Code: N.200 lane 64, the path picker's fixes, then the path picker as the default (plan step P5)

r1, 2026-11-17 10:3x, written by the desk (Opus 5.5) from plan r2 (`docs/sessions/plan-n200-voice-as-it-is_r2_2026-11-16.md`, sections 0, 3.2, 3.3, 4 P5, 6), Fable's review of lane 62 as built (`docs/sessions/review-fable-lane62-as-built_r1_2026-11-17.md`, fixes 1, 2, 5), and the desk's scoring of Dann's 13 takes on lane 62 (held outside the repository; the figures you need are in section 2). For a cloud Code session on branch `cloud-lane-64`, cut from the tip of `Shane` (the desk names the commit; `77555a06` or later).

Paths are under `apps/web/src/lib/voice/` unless they begin with `tools/`, `docs/`, `e2e`, or `vercel.json`. The desk read every cited line at `Shane` `77555a06`. Step 0 re-reads them on your tip.

## 1. What the singer gets

At the end of this lane, every take is read by the path picker unless the address says otherwise: no vowel, no voice type, and no other singer's values reach into the measurement (Dann 2026-11-13, "Ilya encounters the voice as it is"; `docs/memory/PRODUCT.md:1264-1273`). A take whose own evidence is poor is Provisional, with the sentence Ilya already has (`capture.uncertain`, `apps/web/src/lib/i18n.ts:2599`). No new words.

The switch (Step 5) merges only after Dann's iPhone meets the time bar (section 5).

## 2. The rulings and the evidence

| When | His words (short) | What it rules |
|---|---|---|
| 2026-11-13 12:29 to 12:34 | "Yes to Ilya encoutners the voice as it is. This is our gospel" | The measurement is agnostic; status is the measurement's own (`PRODUCT.md:1268-1271`). |
| 2026-11-16 16:46 | "We shouldn't be using my 2020 values for everybody, that's nonsense." | `MITTON` leaves the default measurement. |
| 2026-11-16 21:27 | "No." / "the take's own analysis chooses" | Colleagues' treble takes are not a condition of the switch; other takes only describe. |
| 2026-11-16 22:11 | "real voices matter to me more than synthetic tests do" | Real-voice results decide where real and synthetic disagree. |
| 2026-11-16 22:11 | option 1 | fR1 sound and fR2 unclear: fR1 Captured, fR2 absent (`f2` null). |
| 2026-09-30 13:14 | "Colleagues' recordings will never be public!" | No real recording, sidecar, or table from one enters the repository. |

**Dann's 13 takes on lane 62** (the desk's run, b320496d; both bars = fR1 within 10 percent and fR2 within 12 percent; Praat at 4000 Hz as reference): shipped 9 of 13, open 7, path 11, path with Weenink 2023's L9 ladder 11. Path: 12 Captured, 1 with no reading ([ʌ] 19-28-23, refused by the fry detector for every picker). Path misses: [ɪ] 19-28-08 fR2 1270 against 1470, chosen ceiling 3001 Hz; [ɛ] 19-26-04 also chose 3001 Hz, fR2 10.3 percent low, inside the bar. Take 09 [ɨ] 19-27-37 (where Praat FormantPath itself fails) chose 3001 Hz and reads 303/1213 against 327/1278: in both bars. On every path reading fR2 is at least 347 Hz above fR1. L9 reads both [u] takes with fR1 647 and 688 Hz and fR2 near 2300: wrong for this bass, so L9 does not become the ladder.

## 3. Steps

Each step is its own commit and report section, test first where a test applies, then pushed. After each step run only the tests of the files that step changed; all eight gates and the named Playwright suites once, at the end of the lane (`docs/memory/ENVIRONMENT.md`, "LEARNED BY THE 2026-11-16 OPUS DESK"). Gate 4 baseline at `77555a06`: 6544 passed, 1 skipped (6545) with Python, numpy, and scipy; 6540 passed, 5 skipped without (`tools/n200-score/burg-fixtures.ts:17`).

### Step 0. Read, and a second golden. Change no engine code.

1. The eight gates with counts; every cited line re-read.
2. `tools/n200-score/golden.run.ts` gains the path picker: write `tools/n200-score/__golden__/path-600.json` from `runCapture` under `path` on the 600 primary takes, in the same shape and rounding as `shipped-open-600.json`. Commit it before any engine change. From Step 1 to Step 3, `shipped-open-600.json` stays byte-equal and, with every new option off, so does `path-600.json`.

### Step 1. The fR2 options, each behind its own switch, default off.

Fable's fix 1, with his instruction. In `engine/path-extract.ts`:

- **R125.** Inside the fR2 check, keep fR2 only when `pathF2 - pathF1 >= RESOLUTION_HZ` (import from `engine/open-extract.ts:41`).
- **DP.** Move the `f1Peak` search (`crossCheck`, `:174-197`; today in the `else` branch, `:184`, `:192`) so it runs in every case, and exclude that peak as fR2's peak in every case, not in case (c) only.
- **P3.** When track 2 fails R125 or DP, offer track 3 (`PathEvidence.pathF3`, `:66`) to the same tests; record in `PathEvidence` which track gave fR2.
- Each is a field of `PathOptions` (`:77-84`), default off, so `scoreCeilings`/`choosePath` and the tool can run every combination.
- Unit tests, constructed: `crossCheck` with fR1 640, fR2 647, case (a), one envelope peak at 647: fR2 not kept under R125 and under DP; a gap of exactly 125 Hz is kept; P3 promotes a track-3 value that passes and refuses one that does not.

### Step 2. The ceiling options, as tool columns only.

Fable's fix 2. No engine default changes in this step.

- `tools/n200-score/score-core.ts` gains columns beside `path9`: the path with ladders from 3188 to 7000 Hz and from 3387 to 7000 Hz (L15's own rungs with the lowest one or two removed; re-scored from stored tracks by `choosePath` on a slice of the ladder, `path-extract.ts:210`), each with R125, DP, and P3 on and off; and in the evidence string (`evidenceOf`) the path's fR1, fR3, chosen ceiling, and runner-up ceiling.
- `tools/n200-score/measure-core.ts` gains the same variants for the synthetic sets.
- Push. Say in the report's first line that the tool is ready for the desk.

### Step 3. The bars, written first, then one run of a third synthetic set.

**Write into the report and commit before any run:**
- The third set: take seed `15000 + idx*20 + k`, permutation from `rng(17000 + idx*31 + 1)`, truth factor from `rng(19000 + idx)` drawn as `HELD_OUT` draws it (`tools/n200-score/fidelity-set.ts`). The primary and held-out sets are spent for choosing; they are reported beside it, never used to choose.
- For R125, DP, and P3, each alone and in the combinations R125+DP and R125+DP+P3, on L15 and on the two raised floors:
  1. it changes fR2 on at most 1 percent of the takes whose track-2 fR2 is in the bar;
  2. at least half of the fR2 misses end absent or in the bar;
  3. at least 90 percent of the readings P3 promotes are within 12 percent;
  4. a raised floor puts no take that is in both bars under L15 out of them.
- The plan's bars stand for every variant (plan r2 section 6): fR1 within 10 percent and fR2 within 12 percent on at least 80 percent of takes per type; no more than 10 percent of takes in both bars made Provisional by case (b) or (d); every status that moves listed, both directions.

Then run the third set once. Report every table, with and without the second pulse. Fable's weighting question (fix 5): report how many takes change ceiling when `fitTrack` (`path-extract.ts:127`) weights rows by `1/sqrt(b)` (squared residuals by `1/b`) instead of `1/b`; change nothing.

**Then stop and wait for the desk.** The desk runs Dann's takes with Step 2's columns and types the chosen options into this session (real voices decide, Dann 22:11). If none passes on both the third set and Dann's takes, the desk says so and the lane goes on with all options off.

### Step 4. The chosen options become the path picker's defaults.

As the desk types them. Update the defaults in `PathOptions` and their comments with each choice's evidence (third-set table and Dann's takes, by file name of the report). `shipped-open-600.json` stays byte-equal; `path-600.json` is rewritten in this step's own commit, with the number of takes whose reading changed stated in the commit message and the report.

### Step 5. The switch.

- `chart/measure-switch.ts:10-13`: with no `measure` in the address, `measurePicker` returns `'path'`; `?measure=shipped` and `?measure=open` keep the other two pickers for comparison and for the scoring tool (DESK DEFAULT: they stay until after the release, when a separate lane removes them). Rewrite the header (`:1-7`).
- `engine/analyze.ts:140`, `:144` (`picker: Picker = 'shipped'`): the default becomes `'path'`. List every other default of `'shipped'` you find (grep `= 'shipped'` across `apps/web/src`) and change each that a singer's take reaches.
- `MITTON` stays in `engine/extract.ts` for the shipped picker only; no default path reaches it. Test: with no `measure` in the address, a capture never calls `extractFormants` or `closedPhaseF1`.
- Tests that assert the default (`engine/open-extract.test.ts:28`, `engine/path-extract.test.ts`) change with it.
- Existing readings are not re-measured: a reading keeps its `picker` field as stored (`engine/types.ts:77`).
- Report, on the third set and on the primary set, per voice type: how many [i] and [u] takes have fR1 standing and fR2 absent, since `engine/divergence.ts:7` and `:15` then make a sung [ɨ] Provisional. Change nothing there; Dann was told this consequence on 2026-11-16 22:11.

### Step 6. The end of the lane.

All eight gates; the Playwright suites `calibrate-new`, `singer-paths`, `voice-pane`, `voice-stations`, and the phone `voice-stations` and `path-picker-time`. `vercel.json:3` and `:43-47`: add `cloud-lane-64` beside `cloud-lane-62` so Dann can time this build on his iPhone.

## 4. Owns and leaves

**Owns:** `engine/path-extract.ts` and its test; `engine/analyze.ts` (the defaults only); `chart/measure-switch.ts`; the tests that assert a default picker; `tools/n200-score/` (the tool, the golden runner, the new golden, the third set's settings in `fidelity-set.ts`); `vercel.json` (the branch name); this lane's reports.

**Leaves:** `engine/extract.ts`, `engine/open-extract.ts` (import only), `engine/closed-phase.ts`, `engine/plausibility.ts`, `engine/stand-ins.ts`, `engine/divergence.ts`, `engine/resolve-values.ts`, `engine/burg.ts`; every string; everything under `docs/memory/`.

## 5. The time bar, before the switch merges

Lane 62's Step 4 bar, unchanged: over at least five takes each, the median `analysisMs` with the path picker is no more than 1,000 ms above the median without it, on Dann's iPhone. The lane measured 136 ms at 1x and 508 ms at 4x CPU throttle in Chromium, not on a phone (`docs/sessions/n200-path-step4-time_2026-11-17.txt`). The desk measures it with Dann on the lane 64 deployment after Step 6, from the sidecars of `?harness=1`. The lane builds no Web Worker; if the phone misses the bar, the desk writes that brief.

## 6. Constraints

- No new dependency, no new English or French, no key. Line ceilings hold; a new file stays under 1,000 lines.
- Push only `cloud-lane-64`; open no pull request.
- Nothing from a real take is committed.
- Do not open Praat's, parselmouth's, or any other program's source.
- Do not edit, rename, or replace a brief.

## 7. Reports

`docs/sessions/report-code-n200-lane64-step<N>_r1_<date>.md`: what changed with file and line, tests, the changed files' counts, tables, what you could not establish.

## 8. What the desk could not establish

- Whether R125, DP, or P3 helps a real voice: none of Dann's 12 path readings has the duplicate fault, so his takes can show only that an option does no harm.
- Why [ɪ] and [ɛ] read fR2 low at 3001 Hz, and whether a raised floor fixes them without losing take 09, which also chose 3001 Hz and is right.
- Which weighting Weenink (2015) means.
- The time on a real phone.
- Whether a treble's real fry gives closed-phase poles.
