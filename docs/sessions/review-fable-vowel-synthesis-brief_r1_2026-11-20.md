# Review: the Code brief for vowel synthesis, r1

Fable 5.2, 2026-11-20, for the Shane desk. Under review: `brief-code-vowel-synthesis_r1_2026-11-20.md` (md5 `41b6e35c3fff00a6350d4ef851697d0d`, confirmed). Rests on: `research-vowel-synthesis-methods_r1_2026-11-20.md` (md5 `f7dcdff26b656bf81a08ce6c033129c3`, confirmed). Tree: `Shane` at `3bff3358` (confirmed as HEAD). Nothing under `apps/` or `docs/memory/` was written, and no git write command was run.

## VERDICT: DO NOT SEND

Five blockers. Two of them need a decision that sits over the brief (what the change is for, and where it falls in the build order), so r1 cannot be repaired by wording alone. An r2 that resolves the five and applies the amendments can go.

**The finding that changes a decision, first and alone.** Believed: one reference and one scale answers Dann's objection of 01:43. Known now: it applies the same one voice's proportions as today, averaged over everything she sang where today each hangs on one neighbour. For [ɨ], the vowel the objection and the scan's evidence are about, the value a singer sees moves by under 6 percent. What it changes: the brief's statement of purpose, and one sentence in `OPEN.md`.

## Reading status

| Source | Status |
|---|---|
| The brief, the scan, `OPEN.md:4183-4259`, `CONTRACT.md` sections 0, 0.1, 1, 3, 4, 5, 6 | READ in full |
| `INBOX.md:931-954` (the night's rulings; line 954 is the file's last) | READ |
| Barreda and Nearey (2018), all 21 pages, from the filed PDF's text layer | READ in full. Figures 1 to 7 read by caption only; the plots were not viewed |
| Mitton (2020), printed pp. 79 to 83 (PDF pp. 97 to 101); p. 81 also viewed as a page image | READ, those pages |
| Padgett and Tabain (2005): section 3.1.4 and Table A4, stressed rows | PART |
| Every file and line the brief cites, and the files named in this review | READ this session at the lines given |
| The scan's script `..._check.py` | Lines 1 to 60 read; NOT RUN |

Terms. Adopted: synthesis, reference, scale, constant ratio hypothesis, log-mean, dialectal reference pattern (Barreda and Nearey), borrowed profile, asked-for set. Coined here: "cell" for one vowel's one resonance; "ground" is the tree's own word (`zones.ts:88`).

## The five questions, answered

### 1. Is the method sound?

**What Barreda and Nearey (2018) supports, in my reading.**

1. The model. Within one dialect, a speaker's formants equal a shared dialectal reference pattern times one speaker factor (Eq. 1, p. 502). The reference pattern is a property of the dialect, estimated across many speakers together with the speaker factors (Eqs. 12 and 13, p. 507).
2. The estimator. When vowels are missing, the plain mean over the vowels in hand is biased by which vowels they are (Eqs. 8 to 10 and Fig. 1, pp. 505 to 506). Subtracting the reference value for each cell first removes that bias (p. 507). The brief's formula, the geometric mean of her value over the reference value for the same cell, is that estimator with the reference held fixed. **This part of the brief is supported, and it is the right form.**
3. Few parameters for few tokens. One scale is estimated to about 1 percent in their simulations, and the per-resonance spread that Lobanov needs is estimated poorly (p. 511). With seven vowels and one take each, their argument favours one scale over anything richer. I agree with the scan on that.

**What it does not support.**

1. **Placing a missing vowel.** The paper never predicts, places, or tests a vowel a speaker did not produce. "Missing" there means missing rows in a many-speaker data set, and the object is an unbiased speaker factor so that the vowels that ARE present normalize correctly. Reference times her factor follows from Eq. 1 by algebra; the authors do not take that step. The scan says so (its section 1.9). The brief's section 3.2 does not: "as set out for missing vowels in Barreda and Nearey (2018)" overstates the paper.
2. **One informant as the reference.** The paper's reference is a dialect's pattern. One singer's table is that pattern plus his own vowel-by-vowel departures plus one take's error. The paper itself reports that speakers "vary in consistent idiosyncratic ways that cannot be captured by a single multiplicative parameter" (p. 510), and builds its simulated speakers with independent variation of about 3 percent in each formant's position and 7 percent in its spread (Appendix, p. 518). With a one-voice reference, the informant's departures and the singer's both land in the synthesized value.
3. **A claim about production.** The authors state that normalization methods "should not be approached as models of variation in formant patterns between speakers, but rather as models of the human perceptual accommodation to this variation" (p. 501). What the paper warrants is that a vowel at reference times her scale would be HEARD as the same vowel quality as the reference vowel (p. 503). So the synthesized [ɨ] is, with the paper's warrant, Dann's [ɨ] as it would sound from a tract of her size. It is not a prediction of where her own [ɨ] resonates.
4. **Across voice types.** The model is stated for speakers of one dialect. Whether a soprano's sung [ɨ] and a bass's are one "dialect" target is NOT ESTABLISHED, and uniform scaling between male and female tracts is the contested case in the paper's own literature review (p. 503, Fant against Nordström and Lindblom and Turner et al.). The treble voice is the case Dann's objection names.

**Does a different method in the paper fit better? No.** Formant-wise log-mean (one scale per resonance) is offered and not recommended (p. 508); Lobanov and Gerstman need more than seven single takes can give (pp. 508 to 511). Two things in the paper do bear on how the brief uses the method:

- Note 3 (p. 519): where a few vowel-formant cells are suspected of pattern differences, "a small number of suspicious vowel-formants could be left out of the calculations" of the speaker factor. The brief does the opposite: its scale runs over "every vowel she has sung", so her own sung [ɨ] would enter it (amendment 2).
- The regression (Eq. 13) estimates the reference from every speaker in hand. That is the paper's own route to the scan's "largest available gain": each complete ten-vowel set a singer gives could improve the reference. The reference belongs in the code as data with a named source and an n, not as one man's table wired into function names (amendment 12).

**The algebra the brief has not faced.** The synthesized value is

    404 × k = the geometric mean, over every cell c she sang, of (404 / Mitton's value for c) × her value for c

Each term is one of Mitton's own internal ratios applied to one of her vowels. Today's rule for [ɨ] fR1 is the single term where c is [i] fR1: 404 / 296 = 1.365 (`derivations.ts:31`). The new rule keeps that term and adds the others. So the method does not remove one voice's distribution from her page. It applies ALL of that voice's ratios, not one. What it buys is that one odd take of hers no longer moves a synthesized vowel by itself. What it leaves untouched is the thing section 1 of the brief measures the objection by: her synthesized [ɨ] still sits 36.5 percent over her scaled [i], the step the scan found to be about twice the largest of nine spoken ones.

How far the page moves, by my arithmetic on Bozeman's four staves treated as singers who sang the six core vowels at the staff's values (not a measurement of any singer; the second resonances are Mitton's scaled in both cases, so they barely move):

| vowel | fR1 today | fR1 by one scale | change |
|---|---|---|---|
| [ɨ] | 425 to 520 Hz | 401 to 491 Hz | -5.9 to +1.6 percent |
| [ɪ] | 454 to 589 Hz | 390 to 478 Hz | -14 to -22 percent, 2.6 to 4.3 semitones lower |
| [ʌ] | 605 to 679 Hz | 612 to 749 Hz | +1 to +10 percent |
| [a] | 695 to 780 Hz | 706 to 865 Hz | +2 to +11 percent |

**So the vowel the lane is argued from, [ɨ], is the one it changes least, and the vowel it changes most is [ɪ]**, the commonest unstressed vowel on a Russian page. The [ɪ] move comes from Mitton's close [e] (381 Hz against Bozeman's bass band of 392 to 494, `plausibility.ts:77`; his own p. 83 calls [e] his greatest deviation from Bozeman): today's rule ties her [ɪ] to her own [e], and one scale ties it to her average. Under one scale her synthesized [ɪ] can fall well under her own sung [e] in fR1, which the fill rule's test ("her own vowels bound the answer", `OPEN.md:4212`) was written to prevent. Which of the two is nearer a singer's true [ɪ] is NOT ESTABLISHED; the scan's desk check on English found one scale level with or ahead of neighbour ratios. I do not object to the change for [ɪ] and [ʌ]. I object to sending it without the brief saying it is the largest change on the page (amendment 10).

**Judgement.** One reference and one scale is a defensible RULE: it has a source for its form, one sentence states it, and it treats the ten vowels alike. It is not a remedy for the objection, and the brief presents it as one. Blocker 1.

### 2. Does one reference and one scale break anything that depends on `template('middle')`?

Yes, in three places, and the largest break is not in `template('middle')` at all.

1. **The scale and the fill must change together.** `fillStandIns` computes k against `template('middle')` (`stand-ins.ts:160`) and then fills a personal voice's missing core vowel from that same shape times k (`:163-164`, `:167-177`). Change the shape at `:160` alone and a missing core vowel is filled from `middle` times a k fitted against Mitton: for a singer on the middle staff k moves from 1.00 to about 1.12 (my arithmetic), so the filled vowel comes out about 12 percent high. The brief changes `:160` and says nothing of `:163-177`.
2. **The chart's ground is not `template('middle')` for a declared voice, and it depends on `derive`.** The ground is `resolveVowelValues({}, voiceType, { placeholders: 'always' })` (`zones.ts:89`). With nothing sung, `personal` is false, so `tractScale` is never called (`stand-ins.ts:160`) and the shape is the declared type's staff (`:163`); `middle` is the ground only for "Not sure" and no type (`:61`). The scale's reference therefore cannot move the ground. **But the ground's four hard vowels come from `derive` on the staff's anchors (`stand-ins.ts:181-198`), which the brief's section 3.6 deletes.** With no replacement, `ground.fR1` and `ground.fR2` hold nothing for [ɨ], [ɪ], [ʌ], and [a], and `zones.ts:104`, `:110`, and `:115` build those four zones from `undefined`. Blocker 2.
3. **Placeholder dots.** `computeZones` pushes a dot for every unsung vowel from `now.fR1[vowel]` (`zones.ts:121-124`). If the seven asked-for vowels are "never synthesized for a singer who has begun sampling" (brief, section 3.3), an unsung one has no number and the dot is built from `undefined`. Blocker 3.

Also resting on these values, and unnamed in the brief: `finishEarlyState` turns on whether any vowel reads `'surrogate'` (`finish-early.ts:36-38`); `StandInReport.bucket` reports `'middle'` for a scaled voice (`stand-ins.ts:163`), which will no longer be true; and the test files that call these functions (`stand-ins.test.ts`, `stand-ins-snapshot.test.ts`, `resolve-values.test.ts`, `zones.test.ts`, `geometry.test.ts`, `readings.test.ts`, `adapter-golden.test.ts`, `every-sung-reading-counts.test.ts`, `analyze-score-adapter.test.ts`, `plausibility.test.ts`, `divergence.test.ts`, `outside-igh.test.ts`, `tools/n200-score/lane67-core.test.ts`). I read their names, not their pinned values.

### 3. What the plausibility guard does for a vowel with no `expectedF1`

Read at `plausibility.ts:202-268`:

- For a vowel outside Bozeman's six, `windowFor` takes its centre from `expectedF1` (`:219`). Where that returns `null`, `windowFor` returns `null` (`:220`).
- `checkPlausibility` then returns `{ plausibility: 'unchecked', anchorSource: null }` with no window and no distances (`:242-247`). The comment calls this "a valid, expected outcome, not an error".
- The chart draws that vowel's zone around the ground's placeholder value with the same margins, `basis: 'placeholder'` (`zones.ts:109-119`).
- Nothing downstream is gated: the verdict "gates nothing" in the resolution (`resolve-values.ts:62-73`), and no pass changes a status.

So removing the derivations does not crash the guard. It makes every sung [ɨ], [ɪ], [ʌ], and [a] `unchecked`. The brief's section 5 names [ɨ] and [a]; `expectedF1` holds three constants ([ɨ] 1.365, [ɪ] 1.0315, [a] 1.15, `derivations.ts:21-24`) and an identity for [ʌ], so all four lose their windows if the function goes whole.

Two consequences the brief needs to rule on, not leave to the lane:

1. **[a] is now an asked-for vowel with no guard.** The guard exists because a take read [i] at 1063 Hz (`plausibility.ts:4-7`). After this lane the same misread on [a] gets no verdict.
2. **Re-centring the guard on the synthesized value is a graft route.** Today her sung [ɨ] is already judged against 1.365 × her [i] (`plausibility.ts:219`, `derivations.ts:21`), with a floor 3 semitones under the centre (`:124`). For an [i] at 296 Hz the floor is about 340 Hz. A sung [ɨ] about 30 Hz over her [i], the scan's conversion of the nine spoken speakers' mean, reads 326 Hz and is stored `implausible`. Centring on 404 × k keeps that. Amendment 8 gives a replacement.

### 4. Is the accuracy claim honest?

The brief makes no numeric accuracy claim of its own, and section 5 item 4 forbids one. Good. Four things still present desk arithmetic or unread data more firmly than the scan does:

1. Section 1, "measured the objection". The scan measured nothing; it did arithmetic on a published table. Amendment 9.
2. Section 1 drops the scan's two cautions on Padgett and Tabain: the quantity is F1 minus F0 in ERB, and stressed vowels were sampled at 75 percent of duration (their section 3.1.4; I confirmed both). I re-derived the nine per-speaker steps from Table A4's stressed rows: +0.82, +0.42, -0.17, -0.13, -0.13, +0.90, +0.85, +0.85, +0.50, mean 0.43. The scan's figures hold. Mitton's 1.74 ERB also holds by the Moore and Glasberg formula. The comparison sets an F1 step in fry against an F1-minus-F0 step in speech, and the brief does not say so.
3. Section 1 gives the Peterson and Barney and Hillenbrand medians (1.47, 1.26, 1.10) as fact. They are the scan's DESK ARITHMETIC on the phonTools copies; neither paper was read (scan, section 1.4). `CONTRACT.md` section 6 admits no value from a paper not read in full. I could not check them.
4. Section 3.4, "[ɨ] carries a wider uncertainty". No width has been measured for any of the three in sung fry. The uncertainty can be carried as a rank (two classes) and never as a number of hertz or a percentage; a number would be invented. The spoken evidence is also one-sided: all nine speakers put [ɨ] fR1 at or under where the synthesis puts it, and the second resonance nearer [i] (13 to 54 percent of the way to [u], against 67). If spoken evidence transfers to sung fry, which is NOT ESTABLISHED, the synthesized [ɨ] is likelier too open and too far back than the reverse, and its turning pitch up to about 5 semitones high. That is for the wording round: "less certain" understates what is known.

What the lane would produce: code comments and a reference file's header. Amendment 3 fixes what they may and may not say.

### 5. Grafts by a route the brief has not noticed

Seven, in the order a singer is likeliest to meet them.

1. **The borrowed profile's four hard vowels.** A declared soprano who has sung nothing gets [ɨ] fR1 = 1.365 × Bozeman's soprano [i], and the other three the same way (`stand-ins.ts:181-198`, `derivations.ts:31-34`). Section 1 of the brief cites `derivations.ts:20-36` only. This is the path every singer starts on, and the pages will call it "from the soprano staff" (the strings ratified at 00:35, `INBOX.md:932`). It extends `OPEN.md`'s note 3 from the second resonances to four vowels' first.
2. **The far-off [ɨ] note.** `applyIghDivergence` holds 1.365 and 0.67 a second time, hard-coded, with 50 Hz and 100 Hz tolerances (`divergence.ts:3`, `:22-23`). `farOffIgh` raises the note for a personal voice (`outside.ts:35-43`), and "Use Ilya's estimate for now" sets `useEstimate`, which makes `isSung` false (`outside.ts:46-49`, `sung.ts:14-15`), so every page then shows the synthesized [ɨ] in place of the one she sang. A sung [ɨ] 30 Hz over her [i] is more than 50 Hz from 1.365 × her [i] for every [i] from 296 to 430 Hz (my arithmetic). **By the scan's own evidence this route tells a typical speaker her [ɨ] is off and offers her Dann's in its place.** The brief's section 3.5 points at this mechanism but cites `sung.ts:14-15`, which is `isSung`, and never cites `divergence.ts`.
3. **The guard**, as in question 3: her sung [ɨ], [ɪ], and [a] are judged against his ratios today.
4. **The zone she sings toward.** The chart draws the [ɨ] zone around that same centre (`zones.ts:96-108` for a guard window, `:109-119` otherwise), and a take records whether the zone was showing while she sang (`voice/engine/types.ts:109`, `visibility: 'zone'`). A singer who can see the zone can steer toward it. Her "own" sample then carries his proportion.
5. **A poor take, by design.** Section 3.5 replaces her unsteady sung [ɨ] with the synthesized one. That is Dann's ruling of 02:15 and I do not dispute it. It is a graft route all the same, and the page must say which value is in use.
6. **The key suggestion.** `key-suggest.ts:291` counts every vowel whose source is not `'surrogate'`, so today's derived vowels steer the suggested key with no mark. Whatever this lane calls a synthesized value decides whether Dann-scaled [ɪ], moved by up to 4 semitones, steers it too.
7. **The interim fill, if the lane takes one.** If a personal voice's missing [a] or sixth core vowel is filled from Mitton times k until the VOICE lane lands (blocker 3, option b), his [e] and [a] enter her set where Bozeman's middle and 1.15 × her [ɑ] stand today.

Not a route: her sung values are never changed by the scale (`stand-ins.ts:146-148`, `:168`, `:173`).

## The three further checks

**Table 5.3 from printed page 81.** The page is right: PDF page 99 carries the printed number 81 and the whole table (the scan's "pp. 81-82" is one page too many). All six cross-check values match: [i] 296, [e] 381, [ɪ] 393, [ɨ] 404, [ɛ] 577, [a] 711 Hz. The text layer yields the table cleanly, and I confirmed it against the page image. My reading of all twenty, for the desk's cross-check only: fR1 [i] 296, [e] 381, [ɪ] 393, [ɨ] 404, [ɛ] 577, [a] 711, [ɑ] 617, [ʌ] 616, [o] 489, [u] 346; fR2 1705, 1532, 1600, 1100, 1311, 1113, 1013, 1167, 826, 804. The six in `MITTON_FR2` (`stand-ins.ts:46`) agree. **The instruction is not workable as written for the branch it names.** `cloud-lane-76` is a cloud lane, and the dissertation is not tracked in the repository (`git ls-files` returns no copy). Amendment 4.

**The scope line.** It does not hold. Blockers 3 and 4.

**[ɨ]'s wider uncertainty and the single flag.** It cannot be carried as the code stands. Provenance is one of three words per vowel per resonance, `'sung' | 'derived' | 'surrogate'` (`stand-ins.ts:39`; `packages/score-parser/src/analysis-types.ts:69`, `:72`). The score reads one comparison, `fR1Source === 'surrogate'`, into one boolean, `placeholder` (`overlay-engine.ts:231`, `analysis-types.ts:211-218`). Three more sites branch on the same word: `key-suggest.ts:291`, `finish-early.ts:37`, `zones.ts:123`. There is no slot for a degree. It also does not need one: which vowel is the less certain is a property of the vowel, not of the singer, so a constant beside the reference table carries it and the snapshot need not. Amendment 6.

## Blockers

**1. The brief presents the method as answering the objection, and it does not (sections 1, 2, and 3.2).** See question 1. Section 1 closes "One voice's proportions have no claim on another's" and then prescribes that one voice's proportions, all of them. Section 2 item 4 lists "another voice's absolute values are not [admissible]" as a ruling this enacts, while section 3.3 synthesizes three vowels as another voice's absolute values times a scale. `OPEN.md:4223`, "Not one number on any singer's page then comes from Dann's voice", is reversed by this lane and the brief does not say so. This goes to Dann as a finding before the lane is cut, in his terms: what the singer gets is his three vowels resized to her voice and marked, and [ɨ] lands where it lands today. Replacement for the bold paragraph of section 1:

> **What the singer gets from this work:** every value Ilya shows her is her own measurement, or Dann Mitton's measured value for that vowel resized to her voice by one number drawn from everything she sang, and marked. This does not take his voice off her page: the three synthesized vowels are his, resized. What changes is that one rule, with a source for its form, replaces seven constants; that an odd take of one neighbour no longer moves a synthesized vowel by itself; and that every such value says what it is. Her synthesized [ɨ] lands within a few percent of where today's rule puts it. The objection of 01:43 is answered by the mark and by asking her to sing the vowel, not by the arithmetic.

And strike section 2 item 4, or replace it with: "4. The ruling of 00:54 (a proportion may touch her numbers, another voice's values may not) is NOT enacted for [ɨ], [ɪ], and [ʌ]: his 02:15 ruling that Ilya synthesizes and owns the uncertainty takes its place for those three, and `OPEN.md:4223` is amended to say so."

**2. No rule for the borrowed profile and the chart's ground (section 3.6).** `derive` has two callers in the app: the personal path (`resolve-values.ts:130-142`, through `deriveFrom`) and the stand-in path (`stand-ins.ts:181-198`). The second gives the four hard vowels to every voice that has sung nothing, to every voice not yet complete, and to the chart's ground. The brief deletes the proportions and names only the first. Add a section:

> ### 3.7 The borrowed profile and the chart's ground
> For a voice that is not complete, the four vowels Bozeman's staves do not carry are today built by `derive` from the staff's anchors (`voice/engine/stand-ins.ts:181-198`). In this lane each becomes the reference value times the staff's scale, the number `template` already computes at `stand-ins.ts:110` and applies to the six second resonances at `:112`. One reference, one scale, on this path too. The chart's ground (`voice/chart/zones.ts:89`) moves with it; report the old and new ground values for all five buckets before changing a test.

That keeps the path alive. It also leaves graft route 1 standing, said plainly: the borrowed profile's four hard vowels and all ten second resonances are his, resized to the staff. The wording round owes a sentence for it.

**3. The scope line fails on values (sections 3.3 and 4).** "Never synthesized for a singer who has begun sampling" cannot be built without the two things section 4 excludes.

- A personal voice today is five stable core vowels (`sung.ts:40-41`). Its sixth core vowel is filled from `middle` × k (`stand-ins.ts:167-177`) and its [a] from 1.15 × her [ɑ] (`resolve-values.ts:130-142`). Stop both and those vowels have no number: that is a blank state.
- A voice with one to four stable core vowels takes the staff's values for the rest (`stand-ins.ts:163-178`) and `derive` on the staff's anchors (`:184`). Stop that and it is the threshold and the blanks again.
- An unsung vowel with no number breaks the chart's dots (`zones.ts:121-124`).

Two ways through. **(a), recommended:** cut this lane after the VOICE lane, which `OPEN.md:4239` already places first; section 3.3's table is then true on arrival and nothing interim is invented. Replacement for the branch line: "Branch when cut: from `Shane` after the VOICE lane merges." **(b)** if this lane must go first, add to section 3.3: "Until the VOICE lane lands, this lane changes no vowel's presence. A vowel that has a number today keeps one, produced as reference times scale and flagged as today's fill is. Section 3.3's first row describes the state after the VOICE lane, not after this one." Under (b), graft route 7 opens for the interval.

Under either, section 3.3 needs its condition stated (amendment 5).

**4. The scope line fails on strings (section 4).** "Changes no string" holds only by leaving these sentences in place after the lane has made them untrue:

- `calib.summary.outsideIgh` (`i18n.ts:1348`): "Ilya has an estimate ready, built from your own [i] and [u]". The estimate will be the reference times her scale.
- `calib.pane.worksOut` and `worksOutOne` (`i18n.ts:1447-1448`): "Ilya works out the other {m} from your own vowels." `OPEN.md:4196` forbids compressing the method back into "hers".
- `capture.finish.workOut.caption` and `captionLast` (`i18n.ts:2611-2612`): "it can work out the other {m} from them: {vowels}", where the list can include [a].
- `sheet.legend.zones` (`i18n.ts:2579`): "Ilya can work out these four from your samples of the other six."
- Not yet in the tree: his sentence ratified at 01:21, "Ilya worked your {x} out from your own {y} and {z}" (`INBOX.md:947`), presupposes the neighbour method this lane removes. He needs to hear that before the wording round builds on it.

Replacement for the last sentence of section 4: "This lane changes how a value is produced and carries its provenance, and changes no string. It makes the following sentences untrue and leaves them: [the list]. It therefore reaches `Shane` only together with the wording round's replacements for them, never ahead."

**5. The brief does not name every site that computes these numbers (`CONTRACT.md` section 4).** Add to section 3.6:

> **Other sites that compute the same numbers, and what depends on their agreeing:**
> - `voice/engine/divergence.ts:22`: 1.365 and 0.67 again, hard-coded, tolerances at `:3`. Read by `voice/outside.ts:35-43` (the far-off note and "Use Ilya's estimate for now") and `voice/CalibrationWizard.svelte:264-273`. It must agree with what Ilya would synthesize, or the note compares her [ɨ] with a value no page shows.
> - `voice/engine/plausibility.ts:219`: the guard's centres, and through `voice/chart/zones.ts:96` the zones.
> - `voice/engine/stand-ins.ts:181-198`: the stand-in path (section 3.7).
> - `tools/n200-score/fidelity-set.ts:55` (`derive`, the truth for the fidelity sets), `tools/n168-frequency-run/frequency-run.run.ts:180` (`expectedF1`), and `tools/n200-score/lane67-core.ts:38-45` (its own copy of `tractScale`, against `template`). Say for each whether it moves, is frozen as a record of the old method, or is retired.

## Amendments

**1. Section 3.2, the source.** Replace "the constant ratio hypothesis as set out for missing vowels in Barreda and Nearey (2018), JASA 144(1), 500-520" with:

> the constant ratio hypothesis (Barreda and Nearey 2018, Eq. 1, p. 502). That paper shows how to estimate one speaker's scale without bias when some of her vowels are missing (pp. 505 to 507), and Ilya's scale is that estimator. It does not place a missing vowel and does not test one; reference times her scale is Ilya's own step from Eq. 1. The paper's reference is a dialect's pattern over many speakers. Ilya's is one singer.

**2. Section 3.2, what enters the scale.** Replace "over every vowel she has sung and both resonances where she sang them" with:

> over the seven asked-for vowels she has sung (`isSung`, `voice/engine/sung.ts:14-15`), the first resonance always and the second where the resolver takes it (`voice/engine/resolve-values.ts:94-99`). Her own sung [ɨ], [ɪ], and [ʌ] do not enter the scale: they are the cells where her pattern is most likely to differ from the reference (Barreda and Nearey 2018, note 3, p. 519). Today's scale runs over the six core only (`stand-ins.ts:124`); [a] joins, and `tractScale`'s types widen to match.

**3. Section 3.1, what the reference file's header says, and what no comment may say.** Add:

> The header states: Mitton (2020), Table 5.3, printed p. 81; one informant, a bass; one take per vowel; each vowel sung on G2 and then phonated in fry with the singing posture held (pp. 80 to 81); each value read from a long-term average spectrum over a stable stretch of at least 1.5 seconds (p. 81); and the author's own caution, "Other individuals' values will vary" (p. 82). No comment, test name, or identifier in this lane states or implies how close a synthesized value falls to a sung one. None has been measured.

**4. Section 3.1, reading the table.** The instruction to read from the PDF holds for a lane on the Mac. For a cloud lane, replace "Read the table from that page and encode all twenty values" with:

> Read the table from `docs/sessions/source-mitton-2020-table-5-3-p81.pdf` (md5 given at cutting), a one-page extract of printed p. 81 that the desk commits before the lane is cut, and encode all twenty values.

The stop-and-report rule on the six cross-check values stays as written.

**5. Section 3.3, the condition.** The table says what is synthesized and not when. Add after the table: "A vowel is synthesized only for a profile that is complete (`isPersonal`, `voice/engine/sung.ts:41`, whatever the VOICE lane makes its threshold). Short of complete, nothing is scaled, as today (`stand-ins.ts:160`): a scale from one or two takes is not a scale." And correct "six fixed proportions" in section 1 to "seven fixed constants": `derivations.ts:31-34` holds 1.365, 0.67, 1.0315, 0.39, 0.52, 1.15, and 1.10.

**6. Section 3.4, provenance.** Replace the second paragraph with:

> Provenance today is one of three words per vowel per resonance (`voice/engine/stand-ins.ts:39`; `packages/score-parser/src/analysis-types.ts:69`, `:72`), and four sites branch on `'surrogate'`: `packages/score-parser/src/overlay-engine.ts:231`, `insights/key-suggest.ts:291`, `voice/chart/finish-early.ts:37`, `voice/chart/zones.ts:123`. Add a fourth word, `'synthesized'`, in both packages. In this lane it behaves at each of the four sites exactly as `'derived'` does today, and `zones.ts:123` names it and does not let it fall through to `'surrogate'`. So this lane draws no new mark; "marked wherever it appears" becomes true when the wording round gives the mark its form. [ɨ]'s wider class is a constant exported beside the reference table (the set of vowels whose synthesis is less certain, today [ɨ] alone), not a field on the snapshot. It is a rank, never a number of hertz. Report the four sites as found before changing them.

And replace the first sentence of 3.4, "Every synthesized value is marked wherever it appears", with "Every synthesized value carries its provenance to every surface that could mark it."

**7. Section 3.5, rewritten.** The section names the wrong mechanism and asks for a sentence the scope forbids. Replace it with:

> A sung vowel supersedes its synthesis. For [ɨ], [ɪ], and [ʌ] only, a take Ilya could not read steadily does not: the test is `stableCore`'s own (`voice/engine/sung.ts:26-30`), a reading whose `confidence` is `'low'` and which the singer has not kept. Such a take stays stored and is never discarded; the resolution uses the synthesized value and exposes which of the two is in use, per vowel, for the wording round to name. This lane writes no sentence for it. It narrows the rule that every sung reading counts (`resolve-values.ts:62-73`, Dann 2026-11-13) for these three vowels, on his ruling of 02:15; say so in the comment at `sung.ts:3-7`, and report every site that calls `isSung` for one of the three before changing what it returns.
>
> The far-off [ɨ] pass (`voice/engine/divergence.ts:17-25`, raised at `voice/outside.ts:35-43`) is a different mechanism: it compares her sung [ɨ] with 1.365 × her [i] and 0.67 of the way to her [u], within 50 and 100 Hz. By the scan's section 0.1 a typical spoken [ɨ] fails that test. In this lane `farOffIgh` returns `false`, so the note and its offer do not show, until the wording round rules on what, if anything, Ilya compares a sung [ɨ] with. The pass, its string, and `useEstimate` stay in the tree untouched; a stored `useEstimate` keeps its effect.

**8. Section 3.6, the guard.** Replace the last two sentences with:

> With no `expectedF1`, `windowFor` returns `null` (`plausibility.ts:219-220`), the verdict is `'unchecked'` (`:242-247`), and the chart draws the zone around the ground value (`zones.ts:109-119`). In this lane: [ɪ], [ʌ], and [a] take their centre from the reference value times her scale. [ɨ] takes a band, not a centre: floor at her own sung [i], ceiling at the reference [ɨ] times her scale, the standing margins applied outside both (`applyMargins`, `:170`); with no sung [i] it is `'unchecked'`. That band is the range the scan's section 0.5 calls defensible, so a sung [ɨ] near her [i] is no longer stored `implausible`. `anchorSource` needs a third value for these windows; `'anchors-derived'` will no longer describe them.

The band for [ɨ] is my proposal, not a published one; the desk may prefer `'unchecked'` for [ɨ], which is the smaller change.

**9. Section 1, the evidence paragraph.** Replace "measured the objection" with "checked the objection against the one multi-speaker source it found". After "+0.90 ERB" add "(F1 minus F0, stressed vowels sampled at 75 percent of duration; DESK ARITHMETIC on Table A4, re-derived in Fable's review)". Mark the three medians "DESK ARITHMETIC on the phonTools copies of the data; neither paper read", or cut the sentence.

**10. A before-and-after report, as part of done.** Add a section:

> ### 3.8 What the lane reports before any test is changed
> For each of the five buckets with nothing sung, and for every stored or fixture profile that is complete: the fR1 and fR2 of [ɨ], [ɪ], [ʌ], and [a] by today's rules and by this lane's, in hertz and semitones; and how often the synthesized [ɪ] falls outside the span of her own [e] and [i], and [ʌ] outside her own [ɑ] and [ɛ], in either resonance. Fable's arithmetic on Bozeman's staves expects [ɪ] fR1 to fall 2.6 to 4.3 semitones and [ɨ] to move under 6 percent; a result far from that is a reason to stop. The desk puts the [ɪ] change to Dann in a singer's terms before the lane merges.

**11. Section 5 item 3.** "once `expectedF1` loses [ɨ] and [a]" becomes "once `expectedF1` goes: it holds constants for [ɨ], [ɪ], and [a], and an identity for [ʌ] (`derivations.ts:21-24`)".

**12. Section 3.1, the reference as data.** Add: "Hold the reference as a table with its source and its n (today 1), under a name that says 'reference' and not 'Mitton', so that a second singer's complete ten-vowel set can be folded in by Barreda and Nearey's Eq. 13 without touching a caller." This is cheap now and it is the only route to a better [ɨ] that the reading found.

**13. Section 6.** Add to what is carried in: whether a singer's synthesized [ɪ] is nearer her true one by one scale or by her own [e] (the scan's desk check is English speech); whether uniform scaling holds from a bass's sung fry to a treble's; and whether the three medians in section 1 are right.

## Corrected error, mine

While preparing a page image I created an empty directory, `docs/sessions/_scratch_review`. The bridge refused its removal, so I moved it to `_to_delete/_scratch_review_fable_2026-11-20`. It is empty and git does not see it. Nothing else was written but this file.

## WHAT YOU COULD NOT ESTABLISH

NOT ESTABLISHED beats a complete invented answer.

- The three medians for [ɪ] over [i] (1.47, 1.26, 1.10). The data were not at hand and the two papers were not read.
- The scan's accuracy table. The script was read in part and not run.
- Barreda and Nearey's Figures 1 to 7 as plots. I read the captions and the text that describes them; the "about 1 percent" for the scale is from the text on p. 511.
- Padgett and Tabain beyond section 3.1.4 and Table A4: the speakers' sexes, and the scan's second-resonance fractions apart from one speaker I spot-checked (AC, 0.38, inside the scan's range).
- Whether a cloud session can reach the dissertation by any route. I established only that it is not tracked in the repository.
- Pacifier v11 sections 7.4 and 9.2. They are in project knowledge, which this session cannot open.
- The values pinned in the thirteen test files named in question 2. I read their names.
- Whether the gates type-check `tools/`, and so whether deleting `derive` fails a gate through `fidelity-set.ts:55`.
- Whether Ilya's capture asks a singer to sing the vowel before the fry, as Mitton's method did (p. 80). If it does not, her takes and the reference were made differently, and one scale absorbs only the part of that difference that is uniform.
- How many stored profiles hold `useEstimate` or a sung [ɨ] the far-off pass would flag.
- Whether one scale places [ɪ] or [ʌ] nearer a singer's true vowel than today's rules do, in sung Russian in fry. No data exist; my table is arithmetic on Bozeman's staves.
- Whether spoken evidence on [ɨ] transfers to sung fry. Mitton (2020) is the only sung-fry [ɨ] found by the scan, and I found no other.
