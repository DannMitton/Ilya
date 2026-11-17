<!-- Filed verbatim by the desk (Opus 5.5) 2026-11-16 late evening. Fable 5.2 subagent, read-only, at Shane 55b64d28, cap 160k; 159,411 tokens by the harness count, 11 tool uses, 3.7 min. All of R1 to R12 applied in brief r3. -->

# Fable delta review: brief-code-n200-path-picker_r2_2026-11-16.md

Repository `Shane` at `55b64d28` (`git rev-parse --short=8 HEAD`). Nothing was written. Nothing here comes from memory.

## 1. Verdict

**SEND WITH AMENDMENTS.** All 7 blockers and 15 amendments are in, but option 1 as written lets an "absent" fR2 reach six readers that never look at `f2Quality`, the "real voices first" order asks the lane for results it cannot hold, and the lane's recorder deployment is still switched off at `vercel.json:43-47`.

## 2. Faithfulness table

| Item | Status | Note |
|---|---|---|
| B1 Owns vs build | APPLIED | r2 :216-222, :126. Lines confirmed: `types.ts:77`, `takes.ts:28`, `capture-file.ts:105`, `extract.ts:130`, `analyze.ts:16`, `:151`. |
| B2 "unchanged" test | APPLIED | r2 :149-150, :165. The golden's file name, its runner, and its place in Owns are not given (section 4, R8). My r1 did not give them either. |
| B3 phone timing | WEAKENED | r2 :198-206 applies my text. My text was incomplete: `vercel.json:43-47` has `"**": false` and lists only `Shane`, `main`, `cloud-lane-52` as `true`, so `cloud-lane-62` gets no deployment from the `:3` edit alone. My error in r1; I read lines 1-6 only. |
| B4 ladder | APPLIED | r2 :66. 4583 × exp(±7 × 0.0605) = 7000 and 3001 (my arithmetic). |
| B5 synthetic set | WEAKENED | r2 :142-148 applies my recipe. The recipe does not say how the permutation is built. `gen-eval.run.ts:42` draws one `cellRng()` per combination in order, sorts ascending on the drawn number, and takes the indices. My omission in r1. |
| B6 frame step | APPLIED | r2 :57, :60. |
| B7 references | APPLIED | r2 :178-183. |
| A1 paths | WEAKENED | The golden's full path was dropped. r2 :150 writes `analysis/__golden__/adapter-snapshots.json`, which under the r2 :17 rule resolves to `apps/web/src/lib/voice/analysis/`, a folder that does not exist (`ls`). The file is `apps/web/src/lib/analysis/__golden__/adapter-snapshots.json`. Line corrections (`:142`, `:155`, `closed-phase.ts:192-196`) are in. |
| A2 Escudero and Boersma | APPLIED | r2 :48. The "3187 Hz" bullet (r1 :148) is removed, not reworded; no loss. |
| A3 Burg recipe | APPLIED | r2 :53-62. |
| A4 ladder and criterion | APPLIED | r2 :66-79. |
| A5 cross-check detail | APPLIED | r2 :82-91. "A path with no fR2 fails the fR2 part" is replaced by the ruling (r2 :94). |
| A6 why fR2 is checked | APPLIED, changed by the ruling | r2 :95-102. The Provisional count I asked for is moot under option 1. |
| A7 evidence, f2Quality, steadiness, route | APPLIED | r2 :109-133. "Case (c)'s mark is `path.case === 'c'`" is dropped; r2 :110 holds the case, so it can be derived. |
| A8 Step 0 | APPLIED | r2 :142-150. The reason for rounding is dropped; r2 :149 leaves it unclear whether f1 is rounded too. |
| A9 Step 1 | APPLIED | r2 :155-156. |
| A10 Step 2 tests | APPLIED | r2 :161-165. |
| A11 Step 3 | APPLIED | r2 :169-196. |
| A12 Step 4 | APPLIED | r2 :200-206. See B3. |
| A13 Owns and Leaves | APPLIED | r2 :210-228. |
| A14 section 6 | APPLIED | r2 :241-242. |
| A15 section 7 | APPLIED | r2 :248-249. |

## 3. The four changes

**(a) Option 1. PROBLEM, three parts.**

1. **"Absent" does not drop out unless `f2` is null.** r2 :114 says "`absent` when fR2 is null or not kept", which allows a number in `f2` with `f2Quality: 'absent'`. `analyze.ts:154` copies any non-null `ex.f2` into the reading. `resolve-values.ts:148` (the file is `engine/resolve-values.ts`) is the only reader that tests `f2Quality`. These read `f2` by number alone: `takes.ts:36`, `chart/zones.ts:137`, `chart/readings.ts:62` and `:93`, `chart/tap.ts:57`, `chart/ChartLayers.svelte:72`, `VowelCapture.svelte:312`, `engine/divergence.ts:7` and `:16-17` (grep of `\.f2\b` and `f2Quality` under `apps/web/src/lib/voice`). The fix is one sentence: not kept means `ExtractResult.f2` is null.
2. **With `f2` null, one reader does more than drop it.** `engine/divergence.ts:7` and `:15`: when [i] or [u] has no `f2`, a sung [ɨ] is set to `provisional`. It runs from `CalibrationWizard.svelte:73`. P0b's fR2 misses were 18 of 21 on [i] (r2 :97). So an absent fR2 on [i] keeps [i] Captured and makes [ɨ] Provisional. r2 :118 ("already left out downstream") is true of `resolve-values.ts:148` only. The lane changes none of this; the brief needs to say it and count it.
3. **Case logic: complete for fR1, three gaps.**
   - Two different cases are both named (d) (r2 :87, :91), and `PathEvidence` records "the case (a to d)".
   - "One of its poles" (r2 :88): any pole, or a qualifying pole (150 to 1200 Hz, bandwidth limits)? Not said.
   - fR2 is defined only "when fR1 stands" (r2 :93-94). What `f2` holds in case (b) or the second (d) is not said, and the keep-rule's counts depend on it.
   - Also: a path with no fR1 gives `f1: 0`, which `analyze.ts:190` turns into the error `EXTRACTION_FAILED`, not a Provisional reading. r2 :87 calls it "unsteady". Step 3 already counts an error as a miss (r2 :171), so only the wording needs fixing.

**The keep-rule (r2 :102): it still makes sense, with three undefined terms.** Its two conditions fit option 1 (the check now removes an fR2; it no longer demotes a take). Undefined: what counts as an "fR2 miss" (the path's own fR2 before the check, I take it); what happens when there are no misses; and what "leave the check off" does to the code. "Report every table with the check and without it" needs a switch, and r2 names none.

**(b) Real voices first. PROBLEM.** r2 :176 says "The report opens with Dann's takes." r2 :178-182 says the takes are not in the repository, the desk runs them on Dann's Mac, and the lane compares nothing. r2 :241 forbids committing any table from a real take. The lane cannot write that opening, and a committed report cannot hold it. r2 :184 ("the real one decides") is a rule only the desk can apply. The order is right; the owner of each part is not stated.

**(c) The fR2-miss report item and the [i] truths. FINE, one addition.**
- Bass [i] fR2 is 1705 Hz: `stand-ins.ts:54` (`MITTON_FR2.i`), with `scale` 1 for bass (`stand-ins.ts:102-104`).
- Bass [i] fR3 is 2750 Hz: `truth.ts:22`. 2750 / 1705 = 1.61.
- Same factor for every type: `truth.ts:34` and `:40` scale fR3 by the same geometric mean that `stand-ins.ts:102-104` applies to fR2 (`geo`, `stand-ins.ts:89`).
- Addition: the report item (r2 :196) lists the path's F2 and F3. Add the take's truth fR2 and fR3 and whether the check kept fR2, so the row can be read alone.
- Dann's 22:11 words (`INBOX.md:814`) say a real [i] has fR2 close to fR3. The synthetic [i] holds them 1.6 times apart, so the synthetic set does not test his point. r2 :250 says the truths are apart; it does not draw that consequence.

**(d) `PROM_DB`. FINE.** `engine/open-extract.ts:44`: `export const PROM_DB = 3;`. `engine/analyze.ts:6` already imports it from there.

## 4. Amendments for r3, paste-ready

**R1. Section 3.2 item 3, replace the two fR2 bullets (r2 :93-94).**
> - The fR2 check runs in every case in which the path has an fR1, whether fR1 stands or not (DESK DEFAULT: the reading is Provisional anyway when fR1 does not stand, and one rule is simpler to count).
> - An envelope peak within T2 of the path's fR2: fR2 is **kept**. In case (c) it must be a different peak from fR1's.
> - No such peak, or the path has no fR2: fR2 is **absent**. **Absent means `ExtractResult.f2` is null**, so `engine/analyze.ts:154` writes no `f2`. The value the path found is held in `PathEvidence` only. Reason: `takes.ts:36`, `chart/zones.ts:137`, `chart/readings.ts:62`, `chart/tap.ts:57`, `chart/ChartLayers.svelte:72`, `VowelCapture.svelte:312`, and `engine/divergence.ts:7` read `f2` by number and never read `f2Quality`.
> - fR1 stays as its own case left it. fR2 never makes a take unsteady.

**R2. Section 3.2 item 3, the fR1 cases, add.**
> - "One of its poles" means one of the qualifying poles (150 to 1200 Hz, `MIN_BW <= bw < MAX_BW`). DESK DEFAULT.
> - `PathEvidence` records the case as a, b, c, or d, and for d its reason: `no-fr1`, `out-of-range`, or `no-peak`.
> - A path with no fR1 returns `f1: null`. `engine/analyze.ts:190` then gives the error `EXTRACTION_FAILED`, which Step 3 counts as a miss. An fR1 outside 150 to 1200 Hz is returned and is Provisional.

**R3. Section 3.2 item 3, the keep-rule (r2 :102), replace.**
> **The rule for keeping the check, written before any run.** `extractPath` takes `f2Check`, default true. An fR2 miss is a take whose path fR2, before the check, is outside the 12 percent bar. On the held-out set, the check passes when it marks fR2 absent on no more than 1 percent of takes whose path fR2 is in the bar, and marks absent at least half of the fR2 misses. With no fR2 misses, the first condition decides alone (DESK DEFAULT). The lane reports pass or fail and every table with `f2Check` on and off. **It does not change the default.** The desk reads Dann's takes beside it and rules.

**R4. Section 3.2 item 6, replace the last two sentences (r2 :118).**
> No reader tells `clear` from `marginal` today (`engine/analyze.ts:98`). `engine/resolve-values.ts:148` leaves out a reading with no `f2`. One reader does more: `engine/divergence.ts:7` and `:15` set a sung [ɨ] to Provisional when [i] or [u] has no `f2`. Change nothing there. Report, per voice type, how many [i] and [u] takes have fR1 standing and fR2 absent.

**R5. Step 0 item 2, "The draw" (r2 :145), replace.**
> - **The draw:** per cell, `cellRng = rng(7000 + idx*31 + 1)`; draw one number per combination, in combination order; sort the combinations ascending by their number; keep the first 12. Bandwidth order is `BW` then `BW_WIDE`; pair order is none then pair.

**R6. Step 0 item 3 (r2 :149), replace.**
> 3. **Commit a golden before any engine change.** `tools/n200-score/golden.run.ts` runs `runCapture` under `shipped` and `open` on the 600 primary takes and writes `tools/n200-score/__golden__/shipped-open-600.json`: f1 and f2 (both rounded to 0.1 Hz), confidence, reading, f2Quality, picker, and outcome. It runs under the tool's own config (`tools/n200-score/vitest.config.ts`) and is not one of the eight gates (DESK DEFAULT). Both files join Owns.

In r2 :150, write the path in full: `apps/web/src/lib/analysis/__golden__/adapter-snapshots.json`.

**R7. Step 3, "Real voices first" and item 1 (r2 :176-184), replace.**
> **Real voices first** (Dann 22:11). Dann's takes are not in the repository, and nothing from them may be committed, so the lane cannot report them. The lane's part:
> - `PICKERS` in `score-core.ts` gains `path` (L15, through `runCapture`).
> - L9 has no route through `runCapture`. The tool adds columns `path9_fR1` and `path9_fR2` from `extractPath` with the L9 ladder on the guard's stretch, with no status (DESK DEFAULT).
> - `score.run.ts` reads the reference file named by `N200_REF`, default `reference.csv`.
> - Push this before the synthetic runs, and say so in the Step 3 report's first line.
> - The Step 3 report opens with the heading "Dann's takes" and one sentence: the desk runs them and holds the results outside the repository.
>
> The desk's part, not the lane's: run on Dann's Mac with `N200_NO_BURG=1`, once with FormantPath's values and once with Praat at 4000 Hz (two CSV files from P0b's table); [ɨ] take 09 against Praat at 4000 Hz only; where the real result and the synthetic one point different ways, the real one decides.

**R8. Step 3 bars (r2 :173), add one sentence.**
> "In both bars" is judged on the path's fR1 and fR2 before the fR2 check.

**R9. Step 3 item 3, last bullet (r2 :196), replace.**
> - for each fR2 miss: the chosen ceiling, the path's F2 and F3, the take's truth fR2 and fR3, and whether the check kept fR2.

**R10. Step 4 and Owns (r2 :203, :222), replace.**
> - `vercel.json:3` gains `cloud-lane-62` beside `cloud-lane-52`, and `git.deploymentEnabled` (`:43-47`) gains `"cloud-lane-62": true`. Without the second, the branch is not deployed (`"**": false`, `:44`).

**R11. Paths (r2 :17-21), add.**
> - `resolve-values.ts`, `divergence.ts`, and `open-extract.test.ts` are under `engine/`;
> - `tools/`, `scripts/`, `docs/`, and `vercel.json` are at the repository root; `e2e-phone/` and `playwright.config.ts` are under `apps/web/`.

**R12. Section 7, the [i] bullet (r2 :250), add one sentence.**
> Dann's point at 22:11 is that a real [i] has fR2 close to fR3. These truths hold them 1.6 times apart, so the synthetic set does not test it. His takes do.

**Desk action, not brief text.** `git status --short` shows the brief (r1 and r2) and the plan (r1 and r2) as untracked, and `docs/memory/INBOX.md` as modified. The lane is cut from the tip of `Shane` and is told to read the plan and the 22:11 line. They need to be committed and pushed before the cut.

## 5. For Dann's eye

1. **"Option 1" is the desk's reading of his words** (`INBOX.md:814`, "Desk's reading, his to correct"). His two sentences do not name an option. One yes or no from him closes it.
2. **A consequence of option 1 (taste).** With fR2 absent on [i] or [u], his sung [ɨ] goes Provisional (`engine/divergence.ts:15`). And the landing's readout shows "Try again" / « Réessayer » beside fR2 on a Captured take (`VowelCapture.svelte:312`, `i18n.ts:1280`). Both exist today for any reading with no fR2. Nothing changes in this lane for a singer; it matters when the path picker is switched on. My recommendation: keep option 1, and rule on these two when that lane is briefed.
3. **Per-take values of his voice.** Still open from r1: R7 keeps them out of the repository. Whether the desk's own report of them may be committed is his call.

No French, no money, and no use of his name arises in r2.

## 6. Not established

- How P0b counted "a pole within T1" (qualifying poles or any pole). I did not reopen P0b this session.
- Whether a differently built permutation would still give 323 and 277.
- How long 600 takes under two pickers run on the lane's machine. `open-extract.test.ts:20-22` records single cases at 5.0 to 6.1 s under load.
- Whether L15's low ceilings hold three tracks for the treble [i] truths (fR3 is 2750 Hz × scale; the lowest ceiling keeps roots under 2951 Hz). Not computed.
- Everything listed under "What I could not establish" in my r1 review stands, except the `vercel.json` point corrected above.
- The eight gates; `adapter-golden.test.ts`; P0, P0b, the plan, and the fidelity report were not reopened.

## 7. What I read

- `docs/sessions/review-fable-brief-n200-path_r1_2026-11-16.md`, whole. `docs/sessions/brief-code-n200-path-picker_r2_2026-11-16.md`, lines 1-262, whole. r1 brief: grep hits at :116, :148 only.
- `engine/analyze.ts` 1-192. `engine/open-extract.ts` 36-50 and grep of exports. `engine/closed-phase.ts` 54-58, 133-139, 185-197. `engine/extract.ts` 37-41, 92-96, 124-156. `engine/dsp.ts` 39, 127, 151-157, 197. `engine/resolve-values.ts` 140-152. `engine/divergence.ts` 1-21. `engine/stand-ins.ts` 54, 89, 92-106. `engine/types.ts` 44-80. `engine/live.ts` 730-748. `engine/capture-file.ts` 100-108. `engine/open-extract.test.ts` 20-48. `takes.ts` 26-40. `capture-ritual.svelte.ts` 296-306. `chart/measure-switch.ts`, whole. `VowelCapture.svelte` 300-316. `CalibrationWizard.svelte` 254-275. `i18n.ts` grep at :1280, :2599.
- `tools/n200-score/score-core.ts` 84-152; `score.run.ts`, whole. `vercel.json`, whole. `apps/web/playwright.config.ts`, grep of `name:` (:27 `chromium`, :46 `phone`). `docs/memory/INBOX.md:814`.
- From the tgz, to standard output only: the file list; `fidelity/truth.ts` 1-41; `fidelity/gen-eval.run.ts` 1-87.
- Commands: `git rev-parse --short=8 HEAD`; `git status --short`; greps of `f2Quality`, `\.f2\b`, `divergen`, `steady2`, `PROM_DB`, `cloud-lane-52`; `ls` of `apps/web/src/lib/voice`, `chart`, `e2e-phone`, and the two golden paths.

Terms: `f2Check`, `golden.run.ts`, `shipped-open-600.json`, and the reasons `no-fr1`, `out-of-range`, `no-peak` are names I propose. L15, L9, and the case letters are the brief's.
