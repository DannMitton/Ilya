# Brief to Code: N.200, Ilya encounters the voice as it is (agnostic measurement)

r2, 2026-11-13, from the desk (Opus). r2 applies all thirteen amendments of the Fable review of r1 (`docs/sessions/review-fable-brief-n200_r1_2026-11-13.md`, SEND WITH AMENDMENTS; "Where each amendment went" at the end). DESK DEFAULT number N.200. Runs on its own lane, `cloud-lane-52`, cut from `Shane` **after lane 51 (N.199) merges**, because both touch `plausibility.ts`, `resolve-values.ts`, and `CalibrationWizard.svelte`.

No git writes outside your lane. Gates before and after every step. Canadian spelling, the Oxford comma, no em dashes. One commit, one push, and one report per step, `docs/sessions/report-code-n200-step<n>_r1_<date>.md`.

**NOT ESTABLISHED beats a complete invented answer.**

## 1. Why: the ruling and the measurement

**The ruling, verbatim in `docs/memory/PRODUCT.md`, last section, "ILYA ENCOUNTERS THE VOICE AS IT IS" (Dann 2026-11-13 12:29 to 12:34). Read it in full first.** In short:

1. The measurement is agnostic: no vowel, no voice type, and no other singer's voice reaches into it; only the physical limits of a human tract and of the instrument.
2. The status (captured or provisional) is the measurement's own, from the quality of the evidence alone.
3. The neighbourhood is a description set beside the reading, never applied to it: it never demotes, discards, or blocks a reading.
4. The voice type is scaffolding only: placeholders before the singer sings, and the drawn zones.

Also binding (`docs/memory/OPEN.md`, section N.199, entries 2026-11-13 12:16 to 12:20): a mismatched vowel is met once, at the summary, with keep it or sing it again; a reading is never reassigned to another vowel.

**The measurement (`OPEN.md`, N.199, "M0 MEASURED").** Dann fried [u] three times and [ɑ] three times with [i] asked, on the shipped wheel. His own [i] reads 267/1990 Hz, [u] 262/677, [ɑ] 647/996. [u] under [i]: 250/2235, 311/2210, 321/2178, all captured. [ɑ] under [i]: 585/2275, 562/2220, 556/1451, all provisional (the guard, fR1 only). fR2 followed the asked vowel in five of six takes. **The review reproduced this on the synthetic generator** (`engine/fry-synth.ts:94`): the shipped picker with [i] asked reads synthetic [ɑ] fR1 right on 3 of 36 and 2 of 36 takes, [u] fR2 on 17 of 36, [o] fR2 on 8 of 36.

**The cause:** the asked vowel's expected values from one table, `MITTON` (`engine/extract.ts:4-7`, one bass, every voice), choose the peaks: `extractCore` (`:135`, fR1 nearest at `:140`, fR2 nearest at `:159`), `ltasFormants` (`:53`), `lpcFormants` (`:82`), and `closedPhaseF1` (`closed-phase.ts:192-197`). The closed-phase set-aside test (`extract.ts:149`) compares with `envF1`, which `:140` also chose by the prior.

## 2. What changes, in the singer's terms

- Ilya reports the resonances the voice presents. A [u] sung where [i] was asked lands where a [u] lands.
- A reading is provisional only when its evidence is poor, never because it sits outside a band or differs from an expectation.
- Outside its neighbourhood, a reading is kept as measured and asked about once at the summary (`outside.ts`), keep or sing again.
- Nothing a singer sees changes until Step 6, and nothing ships to singers until the desk has scored it (Step 4).

## 3. Steps

### Step 0. Read and report. Change nothing.

The eight gates. Every reader, with `path:line`, of: `MITTON`, `pe1`, `pe2`, `prior`, `plausibility`, `plausibilityOverride`, `isUsable` (`plausibility.ts:317-319`), `keepReading` (`:327-329`), `applyIghDivergence` (`divergence.ts:11-21`), `f2Quality`, `agreement`, `coarseFormants` (`guard.ts:13-28`, already prior-free), and `reading === 'provisional'`. Anything this brief misstates. `CONTRACT.md` §4: name every site that computes a resonance or a status.

### Step 1. The recorder, on the lane's own deployment. Ship this first, alone.

Dann records takes for scoring. The recorder (`engine/capture-file.ts`) is development-only: `captureFileEnabled` (`:22-25`) and the three calls at `live.ts:684`, `:688`, `:693` each test `import.meta.env.DEV`.

1. **Keep it out of the singers' bundle.** Enable it by a build-time flag set only on the lane's own preview deployment (or a dedicated `harness` deployment the desk names), never in the `Shane` or `main` build. Update the comments at `capture-file.ts:15-17` and `live.ts:681-683`. Report the exact URL Dann opens and that the production bundle does not contain the path.
2. **One save, on a tap.** Hold the session's takes in memory and save them all on one button, not two downloads per take fired seconds after the last gesture (`capture-file.ts:42-48`), because repeated non-gesture downloads may be blocked. Prove it in Chrome, which Dann records in.
3. **Labels in the file.** `CaptureRecord.vowel` (`:51`) is the asked vowel. Add `&sung=<vowel>` to the address so the sung vowel is stamped into each file name and JSON. Add the build id (the service worker serves the page network-first with a cached fallback, `static/sw.js:124-133`, so a stale bundle is possible) and, from Step 3 on, which picker made the reading.
4. **Privacy.** A static test that `capture-file.ts` holds no `fetch`, `XMLHttpRequest`, or `sendBeacon`. Recordings never enter the repository (`PRODUCT.md`, "COLLEAGUES' RECORDINGS ARE NEVER PUBLIC").

### Step 2. The scoring tool. Pure code, no app change.

`tools/n200-score/`, run as `tools/n168-frequency-run/` is run (`pnpm --filter @ilya/web exec vitest run --config tools/n200-score/vitest.config.ts`; `tsx` is not installed). It reads a folder of the recorder's files (path on the command line) and:

1. Runs each take through `runCapture` (`engine/analyze.ts:125-147`), because the guard's stretch and the detector decide what the extractor sees and the status.
2. Dumps every candidate: envelope peaks with prominence and level, closed-phase poles with bandwidth, so picking rules can be compared offline without new recordings.
3. Writes one table: file, asked, sung, each picker's fR1 and fR2, status, evidence marks, and an independent reference (Burg LPC via `tools/i-extractor-check/burg.py`, or Dann's own reading of the spectrum on a few takes), because Dann's stored readings come from the picker under suspicion.
4. Until Step 3 lands it runs the shipped picker only; say so in the report.

Test it on `engine/fry-synth.ts` with known resonances.

### Step 3. The agnostic extractor, behind a switch.

**The switch.** `?measure=open` is read at the session boundary as `chart/calibrate-switch.ts:13` reads its own, and passed down through `runCapture` and `analyze` (`engine/analyze.ts:79`, `:126`) for both screens. A reading taken under the switch carries the picker's name in its take record (`takes.ts:28`) and the recorder's JSON.

**Allowed limits (physical, voice-agnostic) and nothing else:** fR1 below fR2; the 150 Hz floor; bandwidth limits (`MIN_BW`, `MAX_BW`); the instrument's resolution; a cap on how many resonances a tract can show in the band. **Not allowed:** any per-vowel or per-type centre, band, or nearest-to pick.

**The picker** (the review's v2, prototyped on synthetic fry; its thresholds are illustrative, tune them on the synthetic set and report):

1. Candidates come from two estimators: closed-phase poles with `MIN_BW <= bw < MAX_BW`, and envelope peaks.
2. A resonance qualifies when both see it: a qualifying pole with an envelope peak within a tolerance (12% worked on synthetic), with a lower prominence floor for a matched peak than `PROM_DB` (1.5 dB worked). This recovers weak fR2 on [u] and [o] and rejects the closed-phase fit's spare pole (1070 to 1800 Hz, bandwidth 135 to 400, `closed-phase.ts:189`, `ORDER` 12 at `:35`).
3. fR1 is the lowest qualifying resonance in 150 to 1200 Hz; fR2 is the next qualifying resonance above it, separated by at least the instrument's resolution (the 80 Hz margin at `extract.ts:59`, `:85`, `:157`, `:166` is under what the 8 ms lifter resolves; derive and state the value). Values come from where they come from today: fR1 from the closed phase, fR2 from the envelope.
4. **When the closed phase abstains** (`closed-phase.ts:149`): fR1 is the lowest 3 dB envelope peak that is also within 8 dB of the strongest peak in the band (this rejects the source's peak near 200 Hz that the review found on [e], [o], and [ɑ], 8 to 15 dB under the strongest), and the reading is marked single-estimator evidence.
5. **The set-aside test** compares the closed-phase fR1 with the envelope peak nearest it, never the lowest and never a prior.
6. **The front vowels.** When R2 and R3 are resolved (a valley between them deeper than `PROM_DB`, and further apart than the instrument's resolution), the lower is fR2, `clear`, and R3 stays in the trace. Only when they are not resolved is `f2Quality` no better than `marginal`. Note that today no reader tells `clear` from `marginal` (`resolve-values.ts:148` excludes only `absent`).
7. **A missing fR2 is reported absent, never R3.**
8. **The fR2 ceiling** of 3000 Hz (`extract.ts:9`, filters at `:54`, `:136`, LPC at `:78`) may clip a treble [i]; leave it, and the treble scoring decides (Step 4).
9. `f1Steadiness` (`analyze.ts:36-41`) uses the new picker, and is extended to fR2.
10. `agreement` (`extract.ts:171`) is computed from a prior-picked LPC and nothing reads it: make it prior-free or delete it.

**Status from internal evidence only.** Besides today's evidence (SNR, the detector, split-half steadiness): two-estimator agreement; fR2 split-half steadiness; the comb count (more than about six 3 dB envelope peaks under 3500 Hz means the envelope shows the source, not the tract, so the evidence is poor); a runner-up candidate close in strength. **There is no check against an expected value of any kind.**

**A synthetic gate before any recording:** the picker on the `fry-synth` set, bass and treble, with the pass rates stated in the report before the run. Double-pulsed fry fails every picker today, the shipped one included; report it, and let the comb count lower the status there.

### Step 4. Measure, report, stop. The desk and Dann decide before Step 5.

**The recordings** (Dann, on the Step 1 deployment): three takes of each of the ten vowels asked right; five wrong pairings, not only under [i] (for example [u] under [i], [ɑ] under [i], [i] under [u], [a] under [o], [e] under [ɑ]), three takes each. One treble voice, scored before Step 6 only. **The recordings are scored on Dann's Mac**, and only the table of numbers leaves it (DESK DEFAULT).

**Pass, stated before the run, per resonance against the independent reference:** fR1 within 10% and fR2 within 12% on at least 80% of right-vowel takes; wrong-vowel takes read the sung vowel's resonances to the same bars. Report every status that moves, in both directions, and what counts as worse (captured to provisional on a take the reference reads as right). The report says in words that this describes one bass in one room.

### Step 5. Status from evidence; the neighbourhood as description.

1. `withPlausibility` (`CalibrationWizard.svelte:320-326`) keeps writing the verdict and **stops demoting** (`:324-325`).
2. **The one change to Insights and Melody:** the `implausible` gate goes. Today Provisional readings are used, by ruling (`resolve-values.ts:113-120`, Dann 2026-07-15); that does not change. The gates are `isUsable` (`plausibility.ts:317-319`) read at `resolve-values.ts:132`, `:148`, `:207`, `insights/InsightsPane.svelte:241`, and its inline copy at `derivations.ts:86`.
3. `resolve-values.ts:206-212` passes `implausible` to `fillStandIns` (`stand-ins.ts:191`, `:234`), which lists those vowels for re-take: that list stays, as description.
4. `judgeUnchecked` (`resolve-values.ts:48-68`) stays as description; `:59` gates derived-window anchors on `plausible`: change it to any measured reading.
5. `keepReading` (`plausibility.ts:327-329`) and `keepOutside` (`CalibrationWizard.svelte:949-960`) restore a demotion that no longer happens: keep the "kept" mark, drop the restore.
6. **Stored profiles:** readings demoted by `:324-325` before this ship are stored as provisional. On load, a reading whose only cause of provisional is the plausibility verdict returns to what its `confidence` earns. Test it on a stored profile.
7. `hold.ts:19-22`: the hold follows status alone; the branch at `:20-21` goes.
8. Correct the comments that become false: `engine/types.ts:59-63`, `hold.ts:11-18`, `CalibrationWizard.svelte:308-319`, `:850-859`.
9. List and check every status reader: `capture-ritual.svelte.ts:229`, `:234`; `takes.ts:53`; `pacifier/Pacifier.svelte:219`, `:290`, `:419`, `:458`; `markup/MarkupPane.svelte:447`; `CalibrationWizard.svelte:1202`.
10. **The [ɨ] demotion is superseded** (Dann 2026-11-13 15:05 to 15:13, `OPEN.md`, N.199, "THE [ɨ] DEMOTION IS SUPERSEDED"). `applyIghDivergence` (`divergence.ts:11-21`, through `withIghPass`, `CalibrationWizard.svelte:289-298`, called at `:814` and `:872`) stops setting `reading = 'provisional'` for divergence (`:19`) and for a missing or provisional anchor (`:15`); it keeps computing `isDivergent` as description. The summary's outside note (`outside.ts`) includes a divergent [ɨ], and for [ɨ] offers a third choice, "use Ilya's estimate for now", which sets the sung reading aside (it stays in the take record) and restores the derived placeholder. The string is drafted by the desk for Dann in both languages before this step; until ratified, the button is not built. The formula itself stays for the unsung placeholder (`derivations.ts:20`, `:30`).
11. **The forecast's golden file** (`analysis/__golden__/adapter-snapshots.json`) changes: list every case that moves and why. The desk puts the list to Dann before the merge.

### Step 6. Switch on for everyone. Only on the desk's word after Step 4 and the treble voice.

`?measure=open` becomes the default; the old picker leaves measurement and stays in the scoring tool. Pictures: the summary's outside question with an outside reading.

## 4. Out of scope

The placeholders' fR2 template (today Mitton 2020 Table 5.3 scaled, `stand-ins.ts:14-16`): its swap to Bozeman, *Practical Vocal Acoustics*, 2nd ed., Fig. 5.3, p. 31, is a separate item. The zones. Phase 2's live dot. Every string.

## 5. What the desk could not establish

- Any behaviour on real fry: every picker result in the review is synthetic. From M0 plus `extract.ts:140`, the desk infers that Dann's real [ɑ] showed no 3 dB peak near 200 to 300 Hz, or the shipped picker would have chosen it. That is an inference, not a measurement.
- Central vowels ([ɨ], [ɪ], [ɛ]) were not prototyped.
- A treble voice, real.
- The perceptual literature on the effective second formant (Carlson, Granström, and Fant 1970) describes perception, not a picking rule; it is context only.

## 6. Where each amendment went

A1 Step 1.1; A2 Step 1.1 to 1.4; A3 Step 2; A4 Step 0; A5 Step 3, the picker; A6 Step 3.6; A7 Step 3, allowed limits, and 3.8; A8 the disagreement check struck, status from internal evidence; A9 Step 5.2 to 5.10; A10 Step 5.2; A11 Step 3, the switch; A12 Step 4 and the synthetic gate; A13 the ruling and M0 are now in the tree (Dann's ship before this brief is sent). Questions: 1 (an outside reading is used meanwhile) answered by the ruling, applied; 2 (the [ɨ] rule) ruled by Dann 15:13, Step 5.10; 3 (recordings on his Mac only) DESK DEFAULT.

## 7. Reports

One per step, with `path:line`, gate counts, and "Could not establish".
