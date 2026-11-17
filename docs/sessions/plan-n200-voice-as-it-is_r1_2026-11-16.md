# Plan: N.200, Ilya measures the voice as it is (r1)

r1, 2026-11-16 evening, written by the desk (Opus 5.5). **The design is the desk's proposal.** Dann ruled the direction on 2026-11-13 and 2026-11-16 16:46. He ruled that nothing is built until a written plan has a Fable critique. This document is that plan. Nothing in it has been built, and nothing in it has been ruled beyond what section 1 quotes.

Code claims carry a `path:line` read this session at `Shane` `55b64d28`. Paths are under `apps/web/src/lib/voice/` unless they say otherwise. Every number comes from the fidelity report (`~/Downloads/_desk-2026-11-16/n200-fidelity/REPORT_n200-fidelity-steps1-2_r1_2026-11-16.md`, read in full this session, 621 lines) or the literature report (`~/Downloads/_desk-2026-11-16/lit/REPORT-lit-voice-types_r1_2026-11-16.md`, read in full).

## 0. The plan on one page

1. **What is wrong.** Today's picker chooses each resonance nearest a fixed table of Dann's own 2020 values, the same table for every voice (`engine/extract.ts:5-8`, used at `:140`, `:144`, `:164`). On 600 synthetic takes with known resonances, that table is the main cause of low fR1 for tenor, mezzo-soprano, and soprano. With the table replaced by the truth, their fR1 rises from 79, 79, and 73 percent within the bar to 99, 98, and 97 percent.
2. **What replaces it.** A measurement that chooses its own analysis from the take alone, built from the published descriptions of Praat's FormantPath (Weenink) and of Escudero and Boersma's ceiling choice. It is cross-checked against the closed-phase reading Ilya already makes. No vowel, voice type, or other singer's values reach into it.
3. **What the singer's own data adds.** Two checks, both description only: whether a take agrees with itself (split-half, which exists) and with the singer's other takes of that vowel, and whether her ten vowels keep their order in her own vowel space. A take that fails a check is shown as unsteady at once, with an offer of another go. Nothing is overwritten, demoted, or discarded.
4. **Where Bozeman stands.** His per-voice-type bands stay what Dann ruled the neighbourhood to be: a description beside the reading, and the placeholders before a vowel is sung. The bands are first verified note by note against their cited figures.
5. **How we know it works.** Pre-registered bars on three instruments: the synthetic set, Dann's 13 takes against two references, and real treble takes from colleagues under a consent protocol. Nothing switches on for everyone until all three pass.
6. **What it costs you.** Two rulings (the bars in section 6, and the consent line's final wording), the colleague recordings you arrange, and one walk.

## 1. What is ruled

- **2026-11-13, `PRODUCT.md`, "ILYA ENCOUNTERS THE VOICE AS IT IS":**
  1. The measurement is agnostic: "No vowel, no voice type, and no other singer's voice reaches into it."
  2. The status is the measurement's own.
  3. The neighbourhood "never demotes, discards, or blocks a reading".
  4. The voice type is scaffolding only.
- **2026-11-16 16:46 (`OPEN.md`, "N.200 FIDELITY: THE WAY FORWARD"):**
  - "Yes to building from the descriptions of Escudero and Boersma, and Weenink."
  - "We shouldn't be using my 2020 values for everybody, that's nonsense."
  - Lean on vetted resources for credibility.
  - Trebles need more input.
  - The two-part design is consented, on condition of a Fable-critiqued plan.
- **Also asked, 16:29 and 16:46:** an unsteady take told to the singer at once, with another go; a painless protocol for a colleague's samples with a consent line.
- **2026-11-16 13:17 (`STATE.md`):** N.200 is solved before the release.
- **Release:** Friday 2026-11-27 (ruled 2026-11-15 23:54).

## 2. The evidence

### 2.1 The fixed table is the main cause

On the synthetic set, the shipped picker's fR1 failures read low in 95 of 98 cases. The median error for tenor, mezzo-soprano, and soprano is minus 63 percent.

| type | shipped fR1 in 10% | same picker, table set to the truth |
|---|---|---|
| bass | 81% | 81% |
| baritone | 91% | 89% |
| tenor | 79% | 99% |
| mezzo-soprano | 79% | 98% |
| soprano | 73% | 97% |

**The mechanism (tenor [e], truth 571 Hz).**
- The envelope shows a weak peak at 211 Hz and the true peak at 574 Hz.
- The table's value, 381 Hz, is nearer 211, so the envelope picks 211.
- The closed phase reads 571. Because it disagrees with the envelope by more than `CLOSED_PHASE_AGREE` (0.3, `engine/extract.ts:13`, applied `:154`, `:159`), it is set aside.
- The right answer is thrown away.

**One caution.** The fidelity report infers that the 211 Hz peak may be an artefact of the synthetic source (a fixed 5 ms open phase). Dann's real takes show no such peak. This is NOT ESTABLISHED.

### 2.2 The open picker, built in Step 3, is not enough by itself

The open picker takes no vowel and no table (`engine/open-extract.ts:1-31`).

- **Synthetic set:** it meets both bars for every type when no second pulse is present. With a second pulse, fR2 falls to 10 percent in bar.
- **Dann's 13 takes:** its fR2 misses on [e], [i], and one [ɨ]. It reads a lower peak near 820 Hz instead of fR2 near 1600 Hz (re-scored against FormantPath, fidelity report, "Re-scored against FP").

### 2.3 A self-choosing analysis works on the synthetic set and on Dann's voice

Praat's FormantPath was run with 15 ceilings from 3000 to 7000 Hz and was never told the voice type.

**Synthetic set:**
- It meets both bars for every type: fR1 100 percent, fR2 94 to 98 percent.
- A fixed ceiling does not do this. The best fixed ceiling differs by type: 4868 Hz for bass, 5838 Hz for soprano.

**Dann's 13 takes:**
- It agrees with Praat at 4000 Hz on 12 of 13.
- It fails on [ɨ] take 09, where it reads 1274/2499 Hz and loses fR1.
- That result holds across five settings of its path finder.

**The two variants built by the helper failed on real takes.** Variant B (the steadiest track per take) and variant A (consistency across takes, Escudero and Boersma's idea as briefed) both meet the bars on the synthetic set. On Dann's takes, both chose a steady wrong root: B on 4 of 13, A on both [u] takes. The synthetic set overstated them.

### 2.4 The closed-phase reading is the best fR1 candidate when it reads

On the synthetic set, the closed-phase candidate alone is 95 percent within the fR1 bar, with a 90th percentile error of 0.6 percent. It abstains on 59 of 600 takes and is spoiled by a second pulse. It does not read high on a low fR1: on takes under 350 Hz its median error is 0.0 percent.

### 2.5 The literature for three voice types is empty

Nineteen sources were read in full in two rounds. None measures resonances by vowel for contralto, countertenor, or bass-baritone singers. Herbst (2026, *Journal of Singing* 83(2), p. 177) writes that "not a single study" looks at specific Fach categories. Today these types borrow a staff:
- contralto and countertenor use tenor-mezzo (`engine/stand-ins.ts:66`)
- bass-baritone uses bass (`:68`)

The comment there calls the countertenor mapping a DESK INFERENCE (`:60`).

### 2.6 What is not yet read

The fidelity helper built its ceiling-choice variants from the brief's one-line description. It did not read Escudero and Boersma (2009) or Weenink (2015, 2023). Under the standing rule of 2026-11-16 17:10 (`CONTRACT.md` §6), nothing here may use those papers until they are read in full. Step P0 does that.

## 3. The design (the desk's proposal)

### 3.1 The measurement: a path picker

A third picker beside `shipped` and `open` (`engine/analyze.ts:13`). Working name "path", coined by the desk.

**How it reads a take:**
1. Fit the take with Burg LPC at a ladder of ceilings, written in TypeScript from the published descriptions. Praat's code is not read or copied: it is GPL-3.0-or-later, and Ilya is AGPL-3.0-only.
2. Choose the ceiling whose resonance tracks the description's criterion favours.
3. Take fR1 and fR2 from that path.
4. **Cross-check fR1 against the closed-phase reading** (`engine/closed-phase.ts`), which the take already computes.
   - When both read and agree within a stated tolerance, the reading stands.
   - When they disagree, the take is unsteady (3.2): the reading is kept and the singer is offered another go.
   - When the closed phase abstains, the path reading stands alone and is marked as read by one estimator.
5. Inputs: the take and the physical limits only. The limits are the same as the open picker's (`engine/open-extract.ts:8-13`), plus the ceiling ladder.

**Why a picker beside the others, not an edit to `extract.ts`:**
- The shipped picker stays in the scoring tool as the baseline (brief r3, Step 6).
- The switch already exists (`chart/measure-switch.ts:9-11`).
- A third value, `?measure=path`, puts the path picker on the lane's deployment without touching what singers use.

**What retires with it.** When the path picker becomes the default (P5), `MITTON` (`engine/extract.ts:5-8`) leaves measurement. `MITTON_FR2` (`engine/stand-ins.ts:54`) still builds the fR2 placeholders before a vowel is sung. Dann's ruling of 16:46 says "We shouldn't be using my 2020 values for everybody". By that ruling the placeholders also need a source per voice type. That is item P1b, and it may stay as today for the release, flagged (section 7, D3).

### 3.2 The unsteady take, told at once

Today a take carries a split-half check. fR1 and fR2 are read from each half and compared (`engine/analyze.ts:57-68`), and the result decides Provisional (`:163`).

The plan adds the closed-phase disagreement of 3.1 as a second cause. When either cause holds:
- the landing says so in the singer's terms;
- it offers another go of the same vowel.

The reading is kept either way (`PRODUCT.md` clause 3).

The words are new: drafts, English and French, for Dann's ruling. NOT READ: what the landing shows today for a Provisional take (`capture-ritual.svelte.ts:229`, `:234` are its readers by brief r3). P2's Step 0 reads it.

### 3.3 The singer's own data

These two checks are description, never correction.

1. **Agreement across her takes of one vowel.** With two or more takes, a reading far from the others is named, and the singer chooses which stands. The rule of "keep or sing again" is already ruled for a mismatched vowel (`OPEN.md`, N.199, 12:16 to 12:20).
2. **The order in her own vowel space.** Some orderings hold for any human tract, for example fR1 of [i] and [u] below fR1 of [a]. Which orderings are safe enough to state is NOT ESTABLISHED: P0 reads the sources, and the list goes to Fable before it is built. A reading that breaks one is named at the summary, with another go offered.

### 3.4 Bozeman's bands

Today the bands describe a reading and fill the placeholders (`engine/plausibility.ts:50-82`, `BAND_SOURCES` `:86-91`; `engine/stand-ins.ts:9-12`). Brief r3 Step 5 already stops them demoting a reading. Two corrections come first:

1. **The two comments disagree on the source.** `plausibility.ts:86-91` cites KVP2 (2021) Figs. 8 to 10 and "Levels of Acoustic Registration". `stand-ins.ts:9-12` cites the 2013 chart. One is stale.
2. **The values are unverified.** Every band is checked note by note against its cited figure and against PVA2 (2025) Fig. 19.1. The tenor and mezzo bucket is then settled: the chart draws them apart, and the code holds one (`plausibility.ts:61`).

Bozeman's own framing supports this use. PVA2 p. 179 says his boxes are deliberately approximate, cover more than one pitch, and overlap between types (`OPEN.md`, N.200 FIDELITY, 16:5x).

### 3.5 Contralto, countertenor, bass-baritone

No published values exist (2.5). For the release, these types keep today's borrowed staff as placeholders and description. Each is marked as borrowed wherever Ilya shows its source. Colleague recordings (P4) are the only route to real values. Real values are a later letter of Ilya, not this release.

## 4. The steps

Each step names who does it, its worst-case token cost from `ENVIRONMENT.md`, ESTIMATES BY KIND OF JOB, and what "done" looks like. No step begins before the one it depends on.

| step | what | who | cost (range, cap at top) | done when |
|---|---|---|---|---|
| P0 | Read Escudero and Boersma (2009) and Weenink (2015, 2023) in full; file each in the Voice Pedagogy Library; extract the ceiling criterion and the vowel-order relations the sources state, each with its page | Sonnet | 150k to 230k | a digest with page cites; the three PDFs filed by the naming convention |
| P1 | Verify `CORE_BANDS` note by note against KVP2 Figs. 8 to 10, the 2013 chart, PVA2 Fig. 19.1; settle tenor and mezzo; correct the stale comment | Sonnet, from the library's scans | 150k to 230k (first of its kind) | a table, band by band, figure and page, match or mismatch |
| P1b | Placeholder fR2 by voice type from Bozeman PVA2 p. 35 and Fig. 5.3, or flag it for after the release | desk, after P1 | small | a DESK DEFAULT stated, or a value table with sources |
| P2 | Code brief: the path picker behind `?measure=path`, the cross-check, the unsteady-take signal; scored on the synthetic set and Dann's 13 takes against two references | desk writes; Sonnet scout; Fable review; cloud Code lane | scout 200k to 320k; review 160k to 370k; lane on cloud credit | the brief passes its review; the lane meets the bars of section 6 on both instruments |
| P3 | The unsteady-take and agreement words, EN and FR | desk drafts; Dann rules | small | ratified sheet |
| P4 | The colleague protocol with its consent line; treble takes recorded and scored on Dann's Mac | desk writes; Dann sends and arranges; desk scores | small to 260k (scoring run) | at least one treble voice's takes scored against both references |
| P5 | Brief r3 Steps 5 and 6: status from evidence, the path picker as default, `MITTON` out of measurement | cloud Code lane, reviewed as built by Fable | review 300k to 400k | all eight gates; Dann's walk |

P0 and P1 run at once (two helpers, the ceiling). P2's brief waits on P0. P3 runs beside P2. P4 needs only the recorder build, which exists, so it can start as soon as Dann rules the consent line. P5 waits on P2 and P4.

**Access needed.** P0 and P1 file into and read from `~/Documents/Voice Pedagogy Library/`. This session has access to `ilya-rewrite` and `Downloads` only, so the helpers need that folder granted.

## 5. The colleague protocol

**The consent line**, drafted in the previous thread and recovered from it. It is modelled on TCPS 2, article 3.2, and on Mozilla's Common Voice. It was never written into a file. The bracketed parts wait on the protocol, and the French comes with it:

> **Before you begin.** You'll sing [ten] short vowels, [three] times each, in about [10] minutes. Ilya saves them as sound files on your own device, and you choose whether to send them to Dann Mitton. They are used only to test how accurately Ilya measures voices like yours. The files carry your voice type and no name. Your recordings are never published or passed to anyone else; results may be reported only as numbers. You can stop at any time, and you can ask Dann to delete your recordings at any time, no reason needed. Questions: [your email].
> ☐ I agree to take part.

**The protocol** (the desk's proposal):
- **Who:** treble voices first (soprano, mezzo-soprano), then the three types with no published values.
- **Where:** the recorder build, with the takes saved as one ZIP on the singer's device (`OPEN.md`, "The recorder's Save, measured").
- **What:** three takes of each of the ten vowels.
- **How the files travel:** sent to Dann by a route he chooses.
- **Where they go:** scored on his Mac only, kept out of the public repository (his ruling of 2026-10-01, "colleagues' voice recordings must never be committed publicly").
- **What leaves the Mac:** only the table of numbers (brief r3, Step 4).

**Not legal advice.** If results from these samples go into an article, a journal may ask about ethics review. Following TCPS 2 keeps that door open.

## 6. The bars, stated before any run (for Dann's ruling)

The desk proposes the bars brief r3 already uses: **fR1 within 10 percent and fR2 within 12 percent, on at least 80 percent of right-vowel takes.** They apply per voice type, on each instrument:

1. **The synthetic set:** the same 600 takes, its harness saved (`n200-fidelity/fidelity-harness_2026-11-16.tgz`). Reported with and without the second pulse.
2. **Dann's 13 takes:** against Praat FormantPath, and against Praat at 4000 Hz. Both are reported, because each reference fails somewhere (FormantPath on [ɨ] take 09).
3. **Each colleague's takes:** against Praat FormantPath, cross-checked by Praat at a fixed ceiling chosen for the voice by the synthetic table's best fixed ceiling.

**What counts as worse:** a take that today's picker reads within the bar and the path picker does not. Every such take is listed.

## 7. Decisions for Dann

- **D1, the bars** (section 6): the desk's proposal is to keep brief r3's bars.
- **D2, the consent line:** its final words in English, then the French draft.
- **D3, the fR2 placeholders:** keep `MITTON_FR2` scaled by type for the release and flag it, or replace it in P1b if Bozeman's pages give values by type. The desk's leaning: decide after P1 reads the pages.

Everything else in this plan is a DESK DEFAULT, his to strike.

## 8. The do-nothing option

Ship with today's picker. On Dann's own voice it reads fR1 within the bar on 10 of 12 takes against FormantPath. On synthetic treble voices it reads 73 to 79 percent, under the bar. It also keeps a table that his ruling of 2026-11-13 (clause 1) and of 16:46 rejects. The desk does not recommend it.

## 9. NOT ESTABLISHED

- Whether the 211 Hz envelope peak occurs in real voices.
- Whether a treble's real fry gives a closed-phase reading at all.
- Why FormantPath loses fR1 on [ɨ] take 09.
- The ceiling criterion in the published descriptions (P0).
- Which vowel-order relations are safe for every tract (P0).
- What the landing shows today for a Provisional take.
- Whether `CORE_BANDS` matches its cited figures (P1).
- Whether the release date holds with P2 to P5 in it. The desk makes no forecast. The size is known when P2's brief is reviewed.

## 10. What the desk read for this plan

- **Read in full:**
  - the fidelity report (621 lines) and its brief (52 lines);
  - the literature report (round 1);
  - `OPEN.md` 3967 to 3979 (N.200 FIDELITY);
  - `PRODUCT.md` 1264 to 1278 (the ruling).
- **Ranges:**
  - brief r3 headings, and lines 80 to 113;
  - `engine/extract.ts` 1-20 and 130-175;
  - `engine/plausibility.ts` 40-100;
  - `engine/stand-ins.ts` 1-20, 54, and 56-70;
  - `engine/open-extract.ts` 1-40;
  - `engine/analyze.ts` 9-16 and 40-68;
  - `chart/measure-switch.ts` 1-12.
- **Search hits:** the consent draft, from a past chat in this project.
