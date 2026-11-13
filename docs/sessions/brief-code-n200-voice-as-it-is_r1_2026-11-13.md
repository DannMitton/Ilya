# Brief to Code: N.200, Ilya encounters the voice as it is (agnostic measurement)

r1, 2026-11-13, from the desk (Opus). DESK DEFAULT number N.200. Not yet Fable-reviewed (`CONTRACT.md` §1 item 19). Runs on its own lane, `cloud-lane-52`, cut from `Shane` **after lane 51 (N.199) merges**, because both touch `plausibility.ts`, `resolve-values.ts`, and `CalibrationWizard.svelte`.

No git writes outside your lane. Gates before and after every step. Canadian spelling, the Oxford comma, no em dashes. One commit, one push, and one report per step, `docs/sessions/report-code-n200-step<n>_r1_<date>.md`.

**NOT ESTABLISHED beats a complete invented answer.**

## 1. Why: the ruling and the measurement

**The ruling** (Dann 2026-11-13 12:29 to 12:34, `docs/memory/PRODUCT.md`, last section, "ILYA ENCOUNTERS THE VOICE AS IT IS"; read it in full first):

1. The measurement is agnostic: no vowel, no voice type, and no other singer's voice reaches into it; only the physical limits of a human tract and of the instrument.
2. The status (captured or provisional) is the measurement's own, from the quality of the evidence alone.
3. The neighbourhood (the expected range for a vowel and voice type) is a description set beside the reading, never applied to it: it never demotes, discards, or blocks a reading.
4. The voice type is scaffolding only: placeholders before the singer sings, and the drawn zones.

Also binding (`docs/memory/OPEN.md`, N.199, 2026-11-13 12:16 to 12:20): a mismatched vowel is met once, at the summary, with keep it or sing it again; a reading is never reassigned to another vowel.

**The measurement (M0, `OPEN.md`, N.199, "M0 MEASURED", 2026-11-13).** Dann fried [u] three times and [ɑ] three times with [i] asked, on the shipped wheel. His own [i] reads 267/1990 Hz, [u] 262/677, [ɑ] 647/996. [u] under [i]: 250/2235, 311/2210, 321/2178, all Captured. [ɑ] under [i]: 585/2275, 562/2220, 556/1451, all Provisional (the guard, fR1 only). fR2 followed the asked vowel in five of six takes.

**The cause, read by the desk 2026-11-13 on the lane 51 tip:** the asked vowel's expected values from one table, `MITTON` (`apps/web/src/lib/voice/engine/extract.ts:4-7`, one bass's readings, used for every voice) choose the peaks: `extractCore` (`:135`, fR1 nearest at `:140`, fR2 nearest at `:159`), `ltasFormants` (`:53`), `lpcFormants` (`:82`, nearest picks below it), and `closedPhaseF1` (`closed-phase.ts:192-197`, nearest to the prior). So the measure confirms the expectation by construction.

**A known acoustic wrinkle.** In front vowels the third resonance crowds the second; listeners' single "effective second formant" lies between R2 and R3, and above R3 for [i] and [e] (Carlson, Granström, and Fant 1970, "Some studies concerning perception of isolated vowels", STL-QPSR 11(2-3):19-35). A prior-free picker meets that cluster on [i] and [e] and must handle it deliberately.

## 2. What changes, in the singer's terms

- Ilya reports the resonances the voice presents. A [u] sung where [i] was asked lands where a [u] lands.
- A reading is provisional only when its evidence is poor (noise, unsteady halves, an ambiguous peak), never because it sits outside a band.
- Outside its neighbourhood, a reading is kept as measured and asked about once at the summary (today's `outside.ts` note), keep or sing again.
- Nothing a singer sees changes until Step 6, and nothing ships to singers until the desk has scored it on recorded voices (Step 4).

## 3. Steps

### Step 0. Read and report. Change nothing.

The eight gates. Every reader of `MITTON`, `pe1`, `pe2`, `prior`, `plausibility`, `plausibilityOverride`, and `reading === 'provisional'` under `apps/web/src`, with `path:line`. Anything in this brief the tree contradicts. `CONTRACT.md` §4: name every site that computes a resonance or a status.

### Step 1. The recorder, for Dann's own device. Ship this first, alone.

`engine/capture-file.ts:21-24` records only on a development server (`import.meta.env.DEV`). Dann records on the alias. Allow `?harness=1` in a production build too: it downloads each take's WAV and JSON to the singer's own device and sends nothing anywhere (the file's own comment, `:16-17`). Keep `live.ts:684-693` behaviour otherwise. The JSON gains: the asked vowel, the voice type, and (from Step 3 on) both pickers' answers. A test that nothing uploads. **Report the exact URL Dann opens.** The desk hands Dann this step's ship; he records while Steps 2 to 5 are built.

### Step 2. The scoring tool. Pure code, no app change.

`tools/n200-score/` (Node, TypeScript through `npx tsx`): reads a folder of the recorder's WAV and JSON pairs, runs the extractor as shipped and the new one side by side, and writes a table: file, asked vowel, sung vowel (from a labels file Dann's takes come with), each picker's fR1 and fR2, status, and the cents from each to the singer's own reading of the sung vowel. Synthetic fixtures with known resonances test it (`i-extractor.test.ts` has a synthetic set; reuse its generator). Recordings never enter the repository (`PRODUCT.md`, "COLLEAGUES' RECORDINGS ARE NEVER PUBLIC"); the tool reads a path given on the command line.

### Step 3. The agnostic extractor, behind `?measure=open`.

1. Remove every vowel and voice-type input from the four pickers named in section 1. The search limits stay physical and the same for all: fR1 150 to 1200 Hz, fR2 500 to 3000 Hz (`extract.ts:9`).
2. fR1 is the lowest qualifying resonance (closed-phase where it qualifies, as today; envelope otherwise); fR2 is the next qualifying peak above fR1 plus the existing 80 Hz margin. Define "qualifying" from prominence and bandwidth, the measures the code already has (`PROM_DB`, `MIN_BW`, `MAX_BW`), and say what you chose and why.
3. **The front-vowel cluster.** When two qualifying peaks lie close in the fR2 region (define close; propose a value), report the lower as fR2, record the upper as an alternate, and mark `f2Quality` no better than `marginal`. Say how this reads on [i] and [e].
4. `f1Steadiness` (`analyze.ts:36-41`) calls the new picker the same way.
5. The old picker stays callable for the scoring tool and for the disagreement check.
6. **The disagreement check.** Where the scoring shows it earns its place: compute the old picker's answer with expectations taken from the zones' values (voice type, then the singer's own readings; `resolve-values.ts`), never from `MITTON`. A large disagreement marks the reading provisional. Propose the threshold from the scores.

### Step 4. Measure, report, stop. The desk and Dann decide before Step 5.

Run the scoring tool on Dann's recordings (the desk stages them to you or runs the tool itself). Report: right-vowel takes, old against new, cents to his own readings; wrong-vowel takes, where each lands; [i] and [e] cluster behaviour; failures (no fR2, ambiguous). **Pass, stated before the run:** wrong vowels land nearer the sung vowel's own reading than the asked vowel's in at least 5 of 6 M0-style takes; right vowels move by no more than 50 cents median from today's readings, and no vowel's status worsens on more than one of three takes. One treble voice is scored before the switch comes off for singers (Step 6), not before Step 5.

### Step 5. Status from evidence; the neighbourhood as description.

1. `withPlausibility` (`CalibrationWizard.svelte:320-326`) keeps writing the verdict and **stops demoting** a captured reading.
2. `hold.ts:19-22`: the hold follows status alone.
3. `outside.ts:19-24` stays: it is the summary's one question, keep or sing again.
4. Insights and Melody (`resolve-values.ts:51-65`, `:109-120`; `derivations.ts:86`) use every measured reading whose status is captured, implausible or not; a provisional reading falls back as today. **The forecast's golden file** (`analysis/__golden__/adapter-snapshots.json`) will change: list every case that moves and why, and the desk puts the list to Dann before the merge.
5. The re-take rule (`capture-ritual.svelte.ts`, `maybeDeliver`) is unchanged: it compares statuses, which now mean evidence.

### Step 6. Switch on for everyone. Only on the desk's word after Step 4.

`?measure=open` becomes the default and the old picker leaves measurement (it stays in the scoring tool). Pictures: the summary's outside question with an outside reading.

## 4. Out of scope

The placeholders' fR2 template (today Mitton 2020 Table 5.3 scaled, `stand-ins.ts:14-16`): its swap to Bozeman, *Practical Vocal Acoustics*, 2nd ed., Fig. 5.3, p. 31, is a separate item, measured on the golden file. The zones. Phase 2's live dot. Any string: none changes in this brief.

## 5. What the desk could not establish

- Whether a prior-free picker reads Dann's real [u] and [o] fR2 as well as today's (their fR2 is weak in fry; Step 4 measures it).
- The right closeness for the front-vowel cluster.
- How a treble voice reads at all, before or after.
- Whether the closed-phase fR1 needs a prior to stay stable; `closed-phase.ts` was read only at `:192-197`.

## 6. Reports

One per step, with `path:line`, gate counts, and "Could not establish".
