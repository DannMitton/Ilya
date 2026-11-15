# Fable review of brief N.200 r1 ("Ilya encounters the voice as it is")

2026-11-13. Filed by the desk (Opus) from the reviewer's hand-back, condensed: the verdict, the measurements, and every amendment are kept with their sites; prose shortened. 211,801 tokens (harness count), cap 320k, 24 tool uses, 16.5 min. Read in the desk's clone at `desk-merge-51`. Prototype files outside the tree (`/tmp/n200proto/`), synthetic only.

**Verdict: SEND WITH AMENDMENTS.** Steps 0 to 2 can go once A1 to A4 are applied. Steps 3 to 5 were not ready: the Step 3.2 rule fails on the repository's own synthetic generator (A5), Step 3.6 contradicts the ruling (A8), Step 5 misstated today's behaviour and missed a second demotion site (A9, A10).

## What the reviewer measured (synthetic, `engine/fry-synth.ts:94`, 36 takes per case)

- r1's literal rule (v1) against the reviewer's proposal (v2): plain [ɑ] 650 fR1 v1 3/36, v2 36/36; [ɑ] 750 v1 2/36, v2 36; [u] fR2 v1 33, v2 36; [o] fR2 v1 28, v2 36; [i] and [e] 36/36 all, R3 resolved 500 to 700 Hz higher.
- Open phase 4 ms: [u] fR2 v1 1/36, v2 33/36. Room noise six times louder: [o] fR2 v1 16/36, v2 31/36. Treble [ɑ] 900/1400: v1 2/36, v2 28/36.
- Double-pulsed fry fails every picker, the shipped one included ([i] 290 fR1 8/36 with the right vowel asked). A "comb count" (more than six 3 dB peaks under 3500 Hz) flagged about half.
- The shipped picker with [i] asked: synthetic [ɑ] fR1 3/36 and 2/36; [u] fR2 17/36; [o] fR2 8/36. M0 reproduces on synthetic signals.
- The low false peak: an envelope peak at 201 to 233 Hz, 8 to 15 dB under the strongest, moving with the open phase: the source (`closed-phase.ts:5-13`). The closed-phase fit carries a spare pole at 1070 to 1800 Hz, bandwidth 135 to 400 (`closed-phase.ts:189`, `ORDER` 12 at `:35`).
- v2's thresholds (12%, 8 dB, 1.5 dB) were tuned on the same set in one pass: illustrative, not validated.

## Amendments (all applied in r2; r2 section 6 maps them)

A1 Step 1 lines: `capture-file.ts:22-25`; the DEV tests at `live.ts:684`, `:688`, `:693`; comments `capture-file.ts:15-17`, `live.ts:681-683`. A2 Step 1 instrument: stale bundle via `static/sw.js:124-133` (build id in JSON); two non-gesture downloads per take (`capture-file.ts:42-48`), save on one tap; a build-time flag on the lane's own deployment instead of a runtime flag; `&sung=` stamps the sung vowel; a static no-upload test. A3 Step 2: no `tsx`; run as `tools/n168-frequency-run/`; generator is `engine/fry-synth.ts`; go through `runCapture` (`analyze.ts:125-147`); dump every candidate. A4 Step 0 readers: `isUsable` (`plausibility.ts:317-319`), `keepReading` (`:327-329`), `applyIghDivergence` (`divergence.ts:11-21`), `f2Quality`, `agreement`, `coarseFormants`. A5 the picker: two-estimator qualification, lowest then next, envelope-only fallback within 8 dB of the strongest, set-aside against the nearest envelope peak, the 80 Hz margin under the lifter's resolution. A6 the cluster: `marginal` only when R2 and R3 are unresolved. A7 allowed physical limits listed; the 3000 Hz ceiling may clip a treble [i]. A8 strike the disagreement check (it is the neighbourhood applied to the reading); status from internal evidence: two-estimator agreement, fR2 split-half, comb count, close runner-up; `agreement` (`extract.ts:171`) prior-free or deleted. A9 Step 5 sites: `divergence.ts:15`, `:19` via `withIghPass` (`CalibrationWizard.svelte:289-298`, `:814`, `:872`); `isUsable` readers `resolve-values.ts:132`, `:148`, `:207`, `insights/InsightsPane.svelte:241`, `derivations.ts:86`; `fillStandIns` list (`resolve-values.ts:206-212`, `stand-ins.ts:191`, `:234`); `judgeUnchecked` (`resolve-values.ts:48-68`, `:59`); `keepReading`, `keepOutside` (`CalibrationWizard.svelte:949-960`); stored demoted profiles; false comments (`types.ts:59-63`, `hold.ts:11-18`, `CalibrationWizard.svelte:308-319`, `:850-859`); status readers (`capture-ritual.svelte.ts:229`, `:234`, `takes.ts:53`, `Pacifier.svelte:219`, `:290`, `:419`, `:458`, `MarkupPane.svelte:447`, `CalibrationWizard.svelte:1202`). A10 Step 5.4 was wrong: Provisional readings are used today by ruling (`resolve-values.ts:113-120`, 2026-07-15); only `implausible` is withheld. A11 the switch read at the session boundary (`chart/calibrate-switch.ts:13`) and passed through `analyze.ts:79`, `:126`; the picker stamped in `takes.ts:28`. A12 pass criteria: absolute bars per resonance, an independent reference (`tools/i-extractor-check/burg.py`), ten vowels by three takes plus five wrong pairings, a synthetic gate first; 5 of 6 is passed 11% of the time by a picker right half the time. A13 citations checked correct; the ruling and M0 were not yet in the tree's memory files.

## Questions the reviewer marked as Dann's

1. An outside reading before the summary's question is answered: used by Melody meanwhile? (Desk: the ruling answers yes.)
2. The [ɨ] anchor rule (`CalibrationWizard.svelte:275-277`) demotes a sung [ɨ] against an expectation: superseded by today's ruling? (Recommendation: yes, it becomes a description at the summary.)
3. The treble colleague's recordings: Mac only, with only the numbers leaving? (Desk: DESK DEFAULT, yes.)

## Could not establish

Real fry behaviour; central vowels; a real treble voice; browser download behaviour; the Carlson, Granström, and Fant content (paper not read by the reviewer); which golden cases move.
