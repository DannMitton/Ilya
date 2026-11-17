# Plan: N.200, Ilya measures the voice as it is (r2)

r2, 2026-11-16 evening, by the desk (Opus 5.5).

- **Sources:** r1, Fable's critique of r1 (`docs/sessions/review-fable-plan-n200_r1_2026-11-16.md`), and Dann's rulings of 21:27.
- **Critique:** PROCEED WITH FIXES, with 5 blockers and 16 fixes. All are applied here, and each change is marked [r2].
- **Status:** r1 is superseded and kept. Nothing in this plan is built.

**The design is the desk's proposal**, except where section 1 quotes a ruling.

**Where the facts come from:**
- **Code claims:** each carries a `path:line` read this session at `Shane` `55b64d28`. Paths are under `apps/web/src/lib/voice/` unless they say otherwise.
- **Numbers:** from the fidelity report (`~/Downloads/_desk-2026-11-16/n200-fidelity/REPORT_n200-fidelity-steps1-2_r1_2026-11-16.md`) or the literature report (`~/Downloads/_desk-2026-11-16/lit/REPORT-lit-voice-types_r1_2026-11-16.md`). The desk and Fable each read both in full.

## 0. The plan on one page

1. **What is wrong.** Today's picker chooses each resonance nearest a fixed table of Dann's 2020 values. The same table serves every voice (`engine/extract.ts:5-8`). It is used at `:140`, `:145`, `:153`, and `:164`, and through `lpcFormants` at `:83-87`, which is called at `:169`. [r2]
   - It also chooses the closed-phase reading by nearness to that table (`closedPhaseF1`, `engine/closed-phase.ts:192-196`, called at `engine/extract.ts:153`). [r2]
   - On 600 synthetic takes, the table is the main cause of low fR1 for tenor, mezzo-soprano, and soprano.
2. **What replaces it.** A measurement that chooses its own analysis from the take alone, built from the published descriptions of Praat's FormantPath (Weenink) and of Escudero and Boersma's ceiling choice. It is checked against the take's own closed-phase poles and envelope peaks, by a rule that uses no table (3.1). **The take's own analysis chooses** (Dann 21:27).
3. **What the singer sees.** A take whose own evidence is poor is told at once, with the sentence Ilya already has, and the singer can sing it again (3.2). Her other takes describe her reading at the summary and never change a status (3.3). [r2]
4. **Where Bozeman stands.** His per-voice-type bands remain a description and the placeholders before a vowel is sung. They are verified note by note first (3.4).
5. **How we know it works.** Pre-registered bars on the synthetic set and on Dann's takes, with an agreement check run first (P0b) and the phone's time measured (P2). The new picker becomes the default for every singer when those pass. Colleagues' treble takes are scored when they come and are not a condition of the switch (Dann 21:27). [r2]
6. **What it costs Dann.** Rulings on the bars (D1) and on the consent line (D2); the colleague recordings he arranges; one walk.

## 1. What is ruled

### 2026-11-13: "ILYA ENCOUNTERS THE VOICE AS IT IS"

From `PRODUCT.md:1264-1278`:

1. The measurement is agnostic: "No vowel, no voice type, and no other singer's voice reaches into it."
2. The status is the measurement's own.
3. The neighbourhood "never demotes, discards, or blocks a reading".
4. The voice type is scaffolding only.

### 2026-11-16 16:46

From `OPEN.md`, "N.200 FIDELITY: THE WAY FORWARD":
- "Yes to building from the descriptions of Escudero and Boersma, and Weenink."
- "We shouldn't be using my 2020 values for everybody, that's nonsense."
- Lean on vetted resources for credibility; trebles need more input.
- The two-part design is consented, on condition of a Fable-critiqued plan.

### 2026-11-16 21:27 (`INBOX.md`) [r2]

- **"the take's own analysis chooses".** This ratifies the change from the 16:46 wording "the singer's own data chooses": her other takes and her vowel space describe only.
- **Colleagues' treble takes are not a condition** of the new picker becoming the default. His word was "No."

### Also asked, 16:29 and 16:46

An unsteady take told to the singer at once, with another go; a painless protocol for a colleague's samples, with a consent line.

### Standing rulings

- **N.200 is solved before the release** (2026-11-16 13:17).
- **The release is Friday 2026-11-27.**
- **"The date never sizes the work"** (`CONTRACT.md` §1 item 7). If N.200 is not done, the date moves. [r2]
- **Colleagues' recordings are never public** (`PRODUCT.md:1106-1108`, ruled 2026-09-30 13:14). Each volunteer signs a short bilingual consent naming the storage and how to withdraw; adults only. [r2: r1 gave the wrong date and words]

## 2. The evidence

### 2.1 The fixed table is the main cause

On the synthetic set, 95 of the shipped picker's 98 fR1 failures read low. The median error is minus 63 percent for tenor, mezzo-soprano, and soprano.

| type | shipped fR1 in 10% (all takes) | same, of takes with a reading [r2] | table set to the truth |
|---|---|---|---|
| bass | 81% | 85% | 81% |
| baritone | 91% | 95% | 89% |
| tenor | 79% | 80% | 99% |
| mezzo-soprano | 79% | 81% | 98% |
| soprano | 73% | 76% | 97% |

**The mechanism, on tenor [e] (truth 571 Hz):**
- The envelope's weak peak at 211 Hz is nearer the table's 381 than the true peak at 574 is, so the envelope picks 211.
- The closed phase reads 571, but `CLOSED_PHASE_AGREE` (0.3, `engine/extract.ts:13`, applied `:154`, `:159`) sets it aside.

Whether the 211 Hz peak occurs in real voices is NOT ESTABLISHED.

### 2.2 The open picker, built in Step 3, is not enough

The open picker takes no vowel and no table (`engine/open-extract.ts:4-5`).

- **Synthetic set:** it meets both bars for every type with no second pulse. Its fR2 is in bar on 10 percent of takes with a second pulse.
- **Dann's takes:** its fR2 misses on [e], [i], and [ɨ] take 10. It reads a lower peak near 820 Hz instead of fR2 near 1600 Hz on [e] and [i], and near 1139 Hz on [ɨ]. [r2]

### 2.3 A self-choosing analysis

Praat's FormantPath, run with 15 ceilings from 3000 to 7000 Hz and never told the voice type:
- **Synthetic set:** it meets both bars for every type (fR1 100 percent, fR2 94 to 98 percent).
- **Dann's 13 takes:** it agrees with Praat at 4000 Hz on 12. It loses fR1 on [ɨ] take 09 (1274/2499 against 327/1278).
- **Not checked:** the path finder's settings were the helper's "from recollection" and are NOT ESTABLISHED as Praat's own. [r2] The take-09 result held across five settings.

The two variants the helper built failed on real takes, by settling on a steady wrong root:
- **Variant B** (the steadiest track per take) was wrong on 4 of Dann's 13.
- **Variant A** (across takes) was wrong on both [u].

### 2.4 The closed phase

On the synthetic set, the closed-phase candidate alone is 95 percent within the fR1 bar, with a 90th percentile error of 0.6 percent. It abstains on 59 of 600 takes, all of them second-pulse takes. On takes under 350 Hz its median error is 0.0 percent.

**[r2] These figures were measured with the pole chosen nearest `MITTON[vowel]`** (`engine/closed-phase.ts:192-196`; harness `gen-eval.run.ts:73-76`). They do not describe an agnostic choice. P0b measures the agnostic rule.

### 2.5 Three voice types have no published values

No source among the nineteen read gives resonances by vowel for contralto, countertenor, or bass-baritone singers. Two of the nineteen had stated gaps: Howell's score pages and McCoy's figures (`OPEN.md`, N.200 FIDELITY, 17:5x). [r2]

Today these types borrow a staff (`engine/stand-ins.ts:60`, `:66`, `:68`).

### 2.6 Not yet read

Escudero and Boersma (2009); Weenink (2015, 2023). Under `CONTRACT.md` §6 (17:10), nothing here uses them until P0 reads them in full.

## 3. The design (the desk's proposal)

### 3.1 The measurement: a path picker

A third picker beside `shipped` and `open` (`engine/analyze.ts:13`). It is selected by `?measure=path` beside today's switch (`chart/measure-switch.ts:9-11`). "Path" is the desk's coinage.

1. **[r2] Fit at a ladder of ceilings.** Burg LPC at each ceiling, written in TypeScript from a named textbook or paper. That source is cited at the head of the file with pages. The ladder's criterion is written from P0's reading of the published descriptions. Praat's and parselmouth's source code are never opened or copied: Praat is GPL-3.0-or-later as recorded in `OPEN.md`, and Ilya is AGPL-3.0-only (`package.json:5`).
2. **Choose the path,** then take fR1 and fR2 from it.
3. **[r2] Cross-check without a prior.** Fable's proposed rule, untested until P0b:
   - The closed phase **agrees** when one of its poles with `MIN_BW <= bw < MAX_BW` in 150 to 1200 Hz lies within T1 of the path's fR1.
   - The envelope **agrees** when one of its peaks lies within T1 of the path's fR1, and another within T2 of its fR2.
   - The four cases:

     | case | result |
     |---|---|
     | (a) closed phase reads and agrees | the reading stands |
     | (b) closed phase reads and disagrees | unsteady |
     | (c) closed phase abstains, envelope agrees | the reading stands, marked single estimator |
     | (d) closed phase abstains and envelope disagrees, or the path's fR1 is outside 150 to 1200 Hz | unsteady |

   - `closedPhaseF1` is not called.
   - **Tolerances,** stated before the run: T1 = 0.30, the value the tree already uses (`engine/extract.ts:13`). T2 = 0.30, a DESK DEFAULT taken from T1 with nothing shown for fR2.
   - **The evidence for T1:** a 10 percent tolerance would flag Dann's takes 02 and 06, which other references accept at +15 percent. The lost-fR1 cases differ by +115 to +402 percent.
4. **Limits:** the open picker's physical limits (`engine/open-extract.ts:8-13`, constants `:40-57`) plus the ladder. Nothing else reaches in.
5. **[r2] Cost on a phone.**
   - The ladder is 15 ceilings times every frame, not 15 fits. A 2 s buffer (`engine/live.ts:109-114`: a 3.0 s sweep, 0.5 s trimmed from each end) at a 6.25 ms step is about 320 frames: about 4,800 Burg fits per take.
   - It doubles if the split-half check re-runs the picker on each half (`engine/analyze.ts:57-59`).
   - **DESK DEFAULT:** steadiness comes from the one fit's frame tracks.
   - P2 measures the time on Dann's phone against a bar stated first, and names a Web Worker as the fallback.
   - Time on a phone is NOT ESTABLISHED.

`MITTON` (`engine/extract.ts:5-8`) leaves measurement at P5 and stays in the scoring tool for the shipped picker. `MITTON_FR2` (`engine/stand-ins.ts:54`) still builds fR2 placeholders before a vowel is sung (D3).

### 3.2 The unsteady take, told at once

**[r2]** Unsteady is `reading: 'provisional'`, by the route that exists: `confidence === 'low'` (`engine/analyze.ts:143-147`). The cross-check's cases (b) and (d) join the conditions there.

The landing already says so in both languages: `capture.uncertain`, "{v} is noted, though this take was less clear. A re-take can replace it." / « {v} est noté, même si cette prise était moins nette. Une reprise peut le remplacer. » (`i18n.ts:2599`, said at `capture-ritual.svelte.ts:306`). **DESK DEFAULT: no new words.** The cause is not named.

**DESK DEFAULT: the roll-back stays.** A Provisional re-take never replaces a Captured reading (`capture-ritual.svelte.ts:301-303`): Ilya says `pacifier.rolledBack`, and the take stays in the take record.

### 3.3 The singer's other takes describe

- **[r2]** With two or more takes of one vowel, a reading far from the others is named at the summary, and the singer chooses which stands. This is the ruled "keep or sing again" (`OPEN.md`, N.199, 12:16 to 12:20; `outside.ts`). It never changes a status.
- **[r2] The vowel-order check is not in this release.** No source for which orders hold in every voice has been read. Within Ilya's own bands, [e] and [o] share one band for soprano, baritone, and bass (`engine/plausibility.ts:53`, `:56`, `:69`, `:72`, `:77`, `:80`). Explained to Dann 21:2x.

### 3.4 Bozeman's bands

Brief r3 Step 5 already stops the bands from demoting a reading. Two corrections come first:

1. **The two code comments disagree on the source.** `engine/plausibility.ts:87-92` cites KVP2 (2021) Figs. 8 to 10 and "Levels of Acoustic Registration". `engine/stand-ins.ts:11-13` cites the 2013 chart. [r2: cites corrected]
2. **The bands are verified note by note** against each cited figure and PVA2 (2025) Fig. 19.1. Then the tenor and mezzo bucket is settled (`engine/plausibility.ts:59`).

### 3.5 Contralto, countertenor, bass-baritone

The placeholders stay as today for this release. Each is marked "borrowed" wherever Ilya shows its source; the words are new and go to Dann (P3). Real values come from colleague recordings in a later letter.

## 4. The steps

At no time do more than two helpers run. [r2]

| step | what | who | cost (cap at top) | done when |
|---|---|---|---|---|
| P0 | Read Escudero and Boersma (2009) and Weenink (2015, 2023) in full; file each in the Voice Pedagogy Library | Sonnet | 150k to 230k (first of its kind) | **[r2]** A digest with page cites, and a statement per paper of whether the criterion is given as a formula with its parameter values. If it is not, the helper stops and reports. It never opens Praat's or parselmouth's source. |
| P0b [r2] | Re-score the synthetic set and Dann's 13 takes with the 3.1 cross-check, using Praat FormantPath as the path | Sonnet, from the fidelity harness | 110k to 260k | With and without the second pulse: fR1 and fR2 in bar; share flagged unsteady; share of in-bar takes flagged unsteady; [ɨ] take 09 reported by itself |
| P1 | Verify `CORE_BANDS` note by note against KVP2 Figs. 8 to 10, the 2013 chart, PVA2 Fig. 19.1; settle tenor and mezzo; correct the stale comment; settle whether Bozeman's fR2 is PVA2 p. 35 or Fig. 5.3, p. 31 | Sonnet | 150k to 230k (first of its kind) | A table, band by band, figure and page, match or mismatch |
| P1b | fR2 placeholders by voice type from P1's pages, or flagged for later | desk | small | A DESK DEFAULT or a sourced table |
| P2 | Code brief: the path picker behind `?measure=path`, the cross-check, the phone timing | desk; Sonnet scout; Fable review; cloud Code lane | scout 200k to 320k; review 160k to 370k | The brief passes review; the lane meets section 6 on instruments 1 and 2, and the phone bar |
| P3 | The "borrowed" mark, EN and FR | desk drafts; Dann rules | small | A ratified sheet |
| P4 | The colleague protocol and consent (section 5); colleague takes recorded and scored on Dann's Mac. Python with parselmouth on his Mac is not checked. | desk; Dann arranges | up to 260k per scoring run | Scored and reported. **Not a condition of P5** (Dann 21:27). |
| P5 | Status from evidence; the path picker as default; `MITTON` out of measurement. Brief r4 supersedes r3 Steps 3, 4, and 6 (r3 made `?measure=open` the default, `brief r3:102`) and says what becomes of the open picker. | cloud Code lane; Fable as built | review 300k to 400k | All eight gates; Dann's walk |

**Order:**
- P0 and P0b run together. P1 follows when a slot frees.
- P2's brief waits on P0 and P0b.
- P3 and P4 run alongside.
- P5 waits on P2.
- Each step's cost range comes from `ENVIRONMENT.md`, ESTIMATES BY KIND OF JOB.

**Access:** P0 and P1 need `~/Documents/Voice Pedagogy Library/`. This session has `ilya-rewrite` and `Downloads` only, so the desk asks for the folder before they start.

**Money:** P2's lane runs as a cloud Code session. Whether it draws on anything Dann pays for beyond his plan is NOT ESTABLISHED. The cloud credit recorded in `CONTRACT.md` §4 expired 2026-11-05. [r2]

## 5. The colleague protocol

### The consent, [r2] drafted to the ruling of 2026-09-30

Bilingual, naming the storage and how to withdraw, adults only. The English draft follows; the French comes with D2. **The sources it is modelled on are not named to colleagues** until the desk has read TCPS 2, article 3.2, and Common Voice's terms in full (`CONTRACT.md` §6). [r2]

> **Before you begin.** You'll sing [ten] short vowels, [three] times each, in about [10] minutes. Ilya saves them as sound files on your own device, and you choose whether to send them to Dann Mitton. They are used only to test how accurately Ilya measures voices like yours. The files carry the vowel, the date and time, and no name; you tell Dann your voice type yourself. Dann keeps them on his own computer and never in Ilya's public code. Your recordings are never published or passed to anyone else; results may be reported only as numbers. You can stop at any time, and you can ask Dann to delete your recordings at any time, no reason needed. Questions: [your email].
> ☐ I am 18 or older, and I agree to take part.

### The protocol

- **Who:** treble voices first, then the three types with no published values.
- **Where:** the recorder build. It is deployed for the branch `cloud-lane-52` only (`vercel.json:3`) and opens only with `?harness=1` (`engine/capture-file.ts:30-33`). Its panel is English only. [r2]
- **Open before sending a colleague:** whether that deployment opens without a Vercel sign-in is NOT ESTABLISHED. The desk checks it before any colleague is sent.
- **The sung vowel:** the colleague leaves the Sung field empty, and the desk stamps `sung` = `asked` into each sidecar on Dann's Mac. Five of the ten vowels cannot be typed. This is how Dann's own takes were handled (`ENVIRONMENT.md`, 2026-11-15 afternoon section).
- **Consent is recorded** by the colleague returning the signed form with the files. DESK DEFAULT; Dann's ruling says "signs".
- **Files** go to Dann by a route he chooses and are scored on his Mac. Only the table of numbers leaves it.

## 6. The bars, stated before any run (D1)

**[r2] The proposal:**
- fR1 within 10 percent and fR2 within 12 percent, on at least 80 percent of all right-vowel takes per voice type. A take with no reading counts as a miss.
- Wrong-vowel takes read the sung vowel to the same bars (brief r3, Step 4).
- **No more than 10 percent of takes that both references accept are flagged unsteady.** The 10 percent is the desk's proposal.
- Every status that moves is listed, in both directions.

**The instruments:**

1. **The synthetic set.** The 600 takes and their saved harness, reported with and without the second pulse. It holds four distinct types, because tenor and mezzo-soprano share one truth. [r2]
2. **Dann's takes,** against Praat FormantPath and against Praat at 4000 Hz. [ɨ] take 09 is scored against Praat at 4000 Hz only, and the path picker's result on it is reported by itself. [r2]
   - Brief r3 Step 4's wrong-vowel pairings are not yet sung, so the wrong-vowel bar cannot be measured on instrument 2 until they are. Whether Dann sings them is in D1.
   - The report says in words that the real evidence is one bass in one room.
3. **Colleagues' takes, when they come.** Scored the same way, plus a human reading of the spectrum on one take per vowel per singer as a third reference. Where the two Praat references disagree, that reading decides; without it the take is reported unscored. [r2]

**The switch to default for every singer** follows instruments 1 and 2 and the phone bar (Dann 21:27).

## 7. Decisions for Dann

- **D1, the bars** (section 6), including the 10 percent ceiling on good takes flagged unsteady, and whether he sings the wrong-vowel pairings before the switch.
- **D2, the consent:** the English words, then the French draft.
- **D3, the fR2 placeholders:** decided after P1 reads the pages.

Everything else is a DESK DEFAULT, his to strike.

## 8. The do-nothing option

Ship today's picker.
- **Dann's voice:** 10 of 12 takes within the fR1 bar against FormantPath.
- **Synthetic trebles:** 76 to 81 percent of takes with a reading, and 73 to 79 percent of all takes.
- **The table stays,** which his ruling of 2026-11-13 rejects.

The desk does not recommend it.

## 9. NOT ESTABLISHED

- The 211 Hz peak in real voices, and how often real fry carries a second pulse.
- Whether a treble's real fry gives a closed-phase reading.
- Why FormantPath loses fR1 on [ɨ] take 09, and whether the closed phase reads on that take.
- The published ceiling criterion, and whether the descriptions are enough to build from (P0).
- How the cross-check behaves at any tolerance on any voice (P0b).
- The path picker's time on a phone (P2).
- Whether the recorder build opens for a colleague.
- Whether `CORE_BANDS` matches its figures (P1).
- Whether the release date holds. No forecast is made.

## 10. Read for r2

- **In full this session:** both reports, Fable's critique, and r1.
- **Ranges this session:**
  - `PRODUCT.md:1104-1109`
  - `capture-ritual.svelte.ts:298-307`
  - `i18n.ts:2599`
  - `engine/capture-file.ts:98-108`, `:139-148`
  - `vercel.json:1-6`
  - `engine/analyze.ts:143-147`
  - `engine/closed-phase.ts:190-197`
  - `engine/live.ts:109-114`
- **Taken from r1:** r1's own reads, listed in r1's section 10.
