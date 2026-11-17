<!-- Filed verbatim by the desk (Opus 5.5) 2026-11-16 evening. Fable 5.2 subagent, read-only, at Shane 55b64d28, cap 370k; 223,952 tokens by the harness count, 16 tool uses, 5.6 min. All 16 fixes applied in plan r2. -->

# Fable review: plan N.200 r1 (2026-11-16), read at `Shane` `55b64d28`

## 1. Verdict

**PROCEED WITH FIXES.** The direction is supported by the reports, and P0 and P1 (reading only) can start now. The cross-check, the verification, and the consent line each rest on something the tree or the evidence does not hold, so P2 and P4 wait on r2.

## 2. Blockers

**B1. The closed-phase fR1 the plan cross-checks against is chosen by the `MITTON` prior, and section 2.4's numbers were measured with that prior.**
- `engine/closed-phase.ts:192-196`: `closedPhaseF1(cp, prior, window)` returns "the pole in `window` nearest `prior`".
- `engine/extract.ts:153`: called with `pe1`, which is `MITTON[vowel]` (`:140`).
- The harness took its "closed-phase candidate alone" from `extractFormants(yw, SYNTH_SR, c.vowel, trace)` and `trace.closedPhaseF1` (`fidelity/gen-eval.run.ts:73-76` in the tgz), after `MITTON` was restored (`:71-72`).
- So "95 percent in bar, p90 0.6 percent, abstains on 59 of 600" (report line 36, line 119) describes a vowel-prior pick. The plan (3.1 step 4) calls it "the closed-phase reading ... which the take already computes" and gives no agnostic rule for which pole is compared.
- Reusing `closedPhaseF1` breaks clause 1 (`PRODUCT.md:1268`). No number in either report covers an agnostic pole choice for the cross-check.

**B2. The cross-check does not guard the failure the evidence shows (a steady wrong root, fR1 lost).**
- FormantPath on [ɨ] take 09 reads 1274/2499 against 327/1278 (report line 473); variant B reads 1633/2580, 648/2243, 1275/2510, and 1097/2560 on four takes (lines 466, 469, 473, 474).
- Plan 3.1 step 4: when the closed phase abstains, "the path reading stands alone". A lost fR1 then passes as a reading.
- fR2 has no cross-check at all. In each failure above fR2 is wrong too.
- Plan 3.1 step 5 keeps the open picker's limits. fR1 tops out at 1200 Hz (`engine/open-extract.ts:42`). What the path picker returns when its first track is above 1200 Hz (1274, 1633) is unstated. Today a null fR1 is `EXTRACTION_FAILED` (`engine/analyze.ts:190`).
- Whether the closed phase reads on take 09: NOT ESTABLISHED (the sidecars were not in my reach).

**B3. For real voices the verification is circular.**
- Section 6, instruments 2 and 3, score a TypeScript rebuild of FormantPath against Praat's FormantPath. A faithful rebuild agrees with it on take 09 as well, where it is wrong.
- The second reference for colleagues is "Praat at a fixed ceiling chosen ... by the synthetic table's best fixed ceiling". That reference meets the fR2 bar on 88 to 92 percent of synthetic takes by type (report lines 301, 313, 325, 337, 349), and Praat at 5000 Hz misread Dann's [o] and both [u] (lines 468-470).
- The synthetic truths are Ilya's own stand-ins (report line 17), and tenor and mezzo-soprano share one truth (line 20): the set holds four distinct types.
- The plan does not say how a take is scored when the two references disagree, and names no independent reference for a treble. Brief r3 Step 2.3 allows "Dann's own reading of the spectrum on a few takes" (`brief r3:52`).

**B4. "Unsteady" has no stated mapping to status, and no bar limits how often a good take is called unsteady.**
- Today Provisional is `confidence === 'low'` (`engine/analyze.ts:143-147`). The landing already speaks for it: `capture.uncertain`, "{v} is noted, though this take was less clear. A re-take can replace it." (`i18n.ts:2599`, said at `capture-ritual.svelte.ts:306`).
- A Provisional re-take never replaces a Captured reading (`capture-ritual.svelte.ts:301-303`). If unsteady means Provisional, plan 3.2's "the reading is kept either way" meets that roll-back, and the plan does not say which wins.
- Section 6 has no bar for the share of reference-correct takes flagged unsteady. On the synthetic set all 59 abstentions fall on second-pulse takes (the no-pulse tables read 51/51, 52/52, 58/58, 58/58, 58/58: report lines 135, 149, 163, 177, 191). About 26 of the 264 second-pulse takes with a closed-phase value are outside the fR1 bar (my arithmetic from lines 119 and 135-191, under the prior pick of B1). How often real fry carries a second pulse: NOT ESTABLISHED.

**B5. The consent line states something the recorder does not do, and omits what the standing ruling requires.**
- "The files carry your voice type and no name": the sidecar holds `file`, `samples`, `asked`, `sung`, `build`, `picker`, `vowel`, `sampleRate`, `trimS`, `outcome`, `trace` (`engine/capture-file.ts:148`, `CaptureRecord` `:98-108`). No voice type. `live.ts:740`, `:745` pass none. "No name" holds for the file names (`:139`, `:170`); they do carry the date and time (`:145`, `:167`).
- `PRODUCT.md:1106-1108` (ruled 2026-09-30 13:14): each volunteer "signs a short bilingual consent naming the storage and how to withdraw; adults only". The draft names no storage on Dann's side and has no adults-only clause.
- The recorder is built only for the branch `cloud-lane-52` (`vercel.json:3`), and only with `?harness=1` (`capture-file.ts:30-33`). Its panel is English only, and the colleague must type the sung vowel or the file says `unstated` (`:139`, `:203-205`). Plan P4 says it "needs only the recorder build, which exists". Whether that deployment is reachable by a colleague without a Vercel sign-in: NOT ESTABLISHED.

## 3. Fixes for r2 (paste-ready)

1. **Section 2.4, add:** "These figures were measured with the pole chosen nearest `MITTON[vowel]` (`closed-phase.ts:192-196`; harness `gen-eval.run.ts:73-76`). They do not describe an agnostic choice."
2. **Section 3.1 step 4, replace with:** "Cross-check without a prior. The closed phase agrees when one of its poles with `MIN_BW <= bw < MAX_BW` in 150 to 1200 Hz lies within T1 of the path's fR1. The envelope agrees when a peak lies within T1 of the path's fR1 and another within T2 of its fR2. (a) Closed phase reads and agrees: the reading stands. (b) Closed phase reads and disagrees: unsteady. (c) Closed phase abstains and the envelope agrees: the reading stands, marked single estimator. (d) Closed phase abstains and the envelope disagrees, or the path's fR1 is outside 150 to 1200 Hz: unsteady. `closedPhaseF1` is not called." Evidence: B1, B2. This rule is my proposal and is untested.
3. **Section 3.1, add a tolerance line:** "T1 = 0.30, stated before the run, the value the tree already uses (`extract.ts:13`, `open-extract.ts:55`)." Evidence for the size: on Dann's takes the app's fR1 differs from a reference by up to +15 percent on takes the other references accept (take 02, report lines 504, 525; take 06, lines 508, 529), and the lost-fR1 cases differ by +115 to +402 percent (lines 610-618). A tolerance at the 10 percent bar would flag takes 02 and 06. The helper's own figure is "about 25%", not built or tested (line 271). No treble evidence exists for any value.
4. **Section 4, new step P0b (before P2's brief; Sonnet; one harness re-run):** "Re-score the synthetic set and Dann's 13 takes with the rule of fix 2, using Praat FormantPath as the path. Report, with and without the second pulse: fR1 and fR2 in bar; share flagged unsteady; share of in-bar takes flagged unsteady; outcome on [ɨ] take 09."
5. **Section 3.2, replace the first sentence after the list with:** "Unsteady is `reading: 'provisional'` by the existing route (`analyze.ts:143-147`). The landing already says so (`capture.uncertain`, `i18n.ts:2599`). The roll-back of a Provisional re-take over a Captured reading (`capture-ritual.svelte.ts:301-303`) stays / goes [desk to choose and say]." Then strike "The words are new" for the first cause.
6. **Section 0 item 3, replace "A take that fails a check is shown as unsteady at once" with:** "A take whose own evidence is poor (3.2) is told at once. The two checks of 3.3 are named at the summary and never change a status." As written, line 13 lets a vowel-order check set a status, against clause 2 (`PRODUCT.md:1269`).
7. **Section 3.3.2, replace with:** "Not in this release. The summary already asks keep or sing again for an outside reading (`outside.ts`; `calib.summary.outside`, `i18n.ts:1340`)." Evidence: no source for the orderings is named; P0's three papers are assigned the question with nothing showing they address it; within Ilya's own bands [e] and [o] share one band for soprano, baritone, and bass (`plausibility.ts:53`, `:56`, `:69`, `:72`, `:77`, `:80`), so only wide contrasts could hold; a second summary prompt would sit beside the existing one.
8. **Section 6, replace the bar sentence with:** "fR1 within 10 percent and fR2 within 12 percent, on at least 80 percent of all right-vowel takes, a take with no reading counting as a miss. Wrong-vowel takes read the sung vowel to the same bars (brief r3, Step 4). No more than N percent of takes the reference accepts are flagged unsteady. Every status that moves is listed, in both directions." Evidence: the report's bar is "of takes with a reading" (line 27), which gives mezzo-soprano 81 percent (line 89) where the plan's table gives 79 (line 255); r3 requires five wrong pairings and status movement (`brief r3:82-84`), and the plan drops both.
9. **Section 6 instrument 2, add:** "[ɨ] take 09 is scored against Praat at 4000 Hz only, and the path picker's result on it is reported by itself." **Instrument 3, add:** "On one take per vowel per colleague, a human reading of the spectrum is the third reference; where the two Praat references disagree, that reading decides, and without it the take is reported unscored."
10. **Section 6, add:** "Count: [n] treble singers. Tenor and baritone have no real take; the report says so in words (as `brief r3:84` does for one bass in one room)."
11. **Section 3.1, add a cost line, and P2 a gate:** "The ladder is 15 ceilings times every frame, not 15 fits. At the 6.25 ms step the report used (line 260) a 2 s buffer (`live.ts:111`, `:113`) is about 320 frames, so about 4,800 Burg fits and root solves, and twice that if `f1Steadiness` re-runs the picker on each half (`analyze.ts:57-59`). The guard does about 40 such fits per take today (`guard.ts:3`, `:13-28`). Analysis runs on the main thread, described as 100 to 300 ms (`live.ts:79-82`, a comment, not measured). P2 measures the time on Dann's phone against a bar stated first, takes steadiness from the frame tracks of the one fit, and names the Worker as the fallback." The plan says nothing on this (grep for phone, worker, seconds, latency: no hit). Time on a phone: NOT ESTABLISHED.
12. **P0 "done when", add:** "and a statement, per paper, of whether the criterion is given as a formula with its parameter values. If not, the helper stops and reports; it does not open Praat's source, Praat's repository, or parselmouth's source." **Section 3.1 step 1, add:** "Burg's method is written from a named textbook or paper, cited at the head of the file with pages. The Path finder values the helper used 'from recollection' (report line 260) are not a specification."
13. **Section 5, consent line, replace the fourth sentence with:** "The files carry the vowel, the date and time, and no name; you tell Dann your voice type yourself." **Add:** "Dann keeps them on his own computer and never in Ilya's public code. You confirm that you are 18 or older." **Protocol, add:** who records on which address, that the colleague types the sung vowel, and how consent is recorded (the ruling says "signs"). Or add a lane step that stamps voice type into the sidecar.
14. **Section 5, correct two cites:** the ruling is `PRODUCT.md:1106`, 2026-09-30 13:14, "Colleagues' recordings will never be public!" (the plan gives 2026-10-01 and other words in quotation marks). "The recorder's Save, measured" is `ENVIRONMENT.md:5341`, not `OPEN.md`.
15. **Section 4, add under the table:** "At no time more than two helpers. P4's scoring run and P2's scout or review each take a slot." Add to P3: "the 'borrowed' mark of 3.5, EN and FR". Add to P4: "Python with parselmouth on Dann's Mac (not checked)". Add to P5: "brief r4 supersedes r3 Steps 3, 4, and 6 (`?measure=open` as default, `brief r3:102`); says what becomes of the `open` picker."
16. **Section 3.1, cite fix:** "used at `:140`, `:145`, `:153`, `:164`, and through `lpcFormants` `:83-87` (called `:169`)".

## 4. Truth table

| cite or number in the plan | finding |
|---|---|
| `extract.ts:5-8` `MITTON` | Match. |
| used at `:140`, `:144`, `:164` | `:140` and `:164` match. The fR1 nearest-pick is `:145`; `:144` is the `if`. Also used at `:153` and `:83-87`, not listed. |
| `CLOSED_PHASE_AGREE` 0.3 at `:13`, applied `:154`, `:159` | Match. |
| `open-extract.ts:1-31` takes no vowel, no table | Match (lines 4-5). |
| `open-extract.ts:8-13` limits | Match (comment, lines 8-13; constants at `:40-57`). |
| `analyze.ts:13` `Picker` | Match. |
| `analyze.ts:57-68` split-half | Match. |
| `analyze.ts:163` decides Provisional | Line 163 is a comment. The decision is `:143-147`. |
| `chart/measure-switch.ts:9-11` | Match. |
| `plausibility.ts:50-82` | `CORE_BANDS` is `:50-83`. |
| `BAND_SOURCES` `:86-91` | It is `:87-92`. |
| `plausibility.ts:61` one tenor-mezzo bucket | The bucket opens at `:59`. |
| `stand-ins.ts:9-12` cites the 2013 chart | The cite is at `:11-13`. |
| `stand-ins.ts:54`, `:60`, `:66`, `:68` | Match. |
| `capture-ritual.svelte.ts:229`, `:234` (marked NOT READ, from r3) | Stale. The readers are `:301` and `:306`. |
| 79, 79, 73 to 99, 98, 97 percent | Match (report lines 33, 254-256), on the all-takes denominator. With-a-reading: 80, 81, 76 (lines 75, 89, 103). |
| 95 of 98 read low; median minus 63 percent | Match (lines 33, 236-242). |
| Table in 2.1 | Match (lines 252-256). |
| Tenor [e]: 571, 211, 574, 381 | Match (line 33). |
| Open picker: both bars with no second pulse; fR2 10 percent with it | Match (lines 31, 204). |
| Open picker fR2 misses on [e], [i], one [ɨ], "near 820 instead of near 1600" | Misses match (lines 483, 484, 491). For [ɨ] take 10 the reference fR2 is 1139, not near 1600. |
| FormantPath: 15 ceilings, fR1 100 percent, fR2 94 to 98 | Match (lines 263, 302, 314, 326, 338, 350). |
| Best fixed ceiling 4868 bass, 5838 soprano | Match (line 37). |
| 12 of 13; take 09 at 1274/2499; five settings | Match (lines 269, 473, 444-448). Not carried into the plan: the Path finder arguments were "from recollection", NOT ESTABLISHED as Praat's (line 260). |
| B wrong on 4 of 13; A on both [u] | Match (line 269). |
| Closed phase 95 percent, p90 0.6, abstains 59 of 600, median 0.0 under 350 Hz | Numbers match (lines 36, 119, 246). The qualifier is missing: see B1. |
| Nineteen sources "read in full"; Herbst p. 177 | 11 plus 8 matches (lit report line 6; `OPEN.md:3979`). Two had stated gaps (Howell's score pages, McCoy's figures, `OPEN.md:3979`). Round 2 is not in the lit report file. |
| Section 8: 10 of 12; 73 to 79 percent | Match (line 495; lines 255-256). |
| Rulings quoted in section 1 | Match (`PRODUCT.md:1268-1271`; `OPEN.md:3968-3972`; `STATE.md:23`; release `STATE.md:29`). The "ruled 23:54" time: NOT ESTABLISHED. |
| `CONTRACT.md` §6, 17:10 | Match (`CONTRACT.md:127`). |
| P1b "PVA2 p. 35 and Fig. 5.3" | `stand-ins.ts:14` says p. 35; `brief r3:116` says Fig. 5.3, p. 31. Which is right: NOT ESTABLISHED. |
| Cost ranges | 160k to 370k and 300k to 400k match (`ENVIRONMENT.md:5189-5190`). The 150k to 230k and 200k to 320k rows: not found in the lines I read (5182-5200). |
| Praat GPL-3.0-or-later; Ilya AGPL-3.0-only | Ilya matches (`package.json:5`). Praat's licence: as `OPEN.md:3968` records it; not read at source. |

## 5. For Dann's eye

1. **A change to what he consented to.** The 16:46 design reads "the singer's own data chooses" (`OPEN.md:3971`). The plan makes her data describe, never choose. The evidence supports the change: the cross-take variant gave wrong values on both [u] takes (report line 269). Recommendation: he ratifies the change in words.
2. **The consent line (goes out under his name).** Fix 13. The plan says it is modelled on TCPS 2, article 3.2, and on Common Voice. Both NOT READ by me, and the plan shows no read of either. Recommendation: do not name either to colleagues until read in full, as `CONTRACT.md:127` requires of papers.
3. **A reference for trebles that is not Praat checking a copy of Praat.** His or a colleague's reading of the spectrum, one take per vowel per singer. It costs his time. Recommendation: yes.
4. **The bars (D1).** Recommendation: keep 10 and 12 percent at 80; fix the denominator; add the wrong-vowel clause and a ceiling on good takes flagged unsteady; state how many treble singers "every singer" rests on.
5. **The release.** "N.200 solved before release" (`STATE.md:23`) and the 27th are both ruled. The plan has no rule for which gives if a bar is missed or no treble records in time. Recommendation: he rules it now.
6. **Words and French.** The landing already has a Provisional sentence in both languages (`i18n.ts:2599`). Recommendation: reuse it for the new cause unless he wants the cause named.
7. **Vowel-order checks.** Recommendation: out of this release (fix 7).
8. **Money.** P2's lane is "on cloud credit" with no figure.

## 6. What I could not establish

- What Escudero and Boersma (2009), Weenink (2015, 2023), TCPS 2, or Common Voice say. None read.
- Whether the published descriptions suffice to build the picker.
- How the cross-check behaves with an agnostic pole choice, at any tolerance, on any voice.
- Whether the closed phase reads on Dann's take 09, and which estimator gave the app's fR1 on each of his takes.
- The path picker's time on a phone.
- The licence of Praat's manual pages; whether `tools/i-extractor-check/burg.py` was written from documentation alone (its header says so, `burg.py:5-6`); any legal effect of committing harness scripts that call parselmouth.
- Whether the `cloud-lane-52` deployment is open to a colleague, and whether the wizard holds three takes per vowel.
- Take length: 2.0 s by `live.ts:111`, `:113`; 2.5 s by `ENVIRONMENT.md:5341`.
- Second-pulse prevalence in real fry; the 211 Hz peak in real voices; any real treble behaviour.

## 7. What I read

- Plan r1: whole (231 lines).
- Fidelity report: whole (621 lines). Its brief: whole (52 lines). From the harness tgz: the file list and `fidelity/gen-eval.run.ts` whole (87 lines), read to stdout.
- Literature report: whole (65 lines).
- `PRODUCT.md` 1264-1278 and 1106-1110. `OPEN.md` 3967-3979. By grep only: `STATE.md` (lines 19, 23, 29), `CONTRACT.md` (headings, 93, 127), `ENVIRONMENT.md` 5182-5200 and 5341.
- Brief r3: whole (138 lines).
- Code, whole: `engine/extract.ts` (175), `open-extract.ts` (148), `analyze.ts` (192), `closed-phase.ts` (197), `capture-file.ts` (220), `chart/measure-switch.ts` (11).
- Code, ranges: `plausibility.ts` 40-100; `stand-ins.ts` 1-75; `guard.ts` 1-60; `live.ts` 76-84 and grep hits; `capture-ritual.svelte.ts` 222-238 and 296-308; `dsp.ts` export list; `i18n.ts` 1340-1345 and 2599 (grep); `vercel.json:3`; `tools/i-extractor-check/burg.py` 1-30.
- Not read: `plausibility.ts` beyond 100, `stand-ins.ts` beyond 75, `fry-synth.ts`, the harness Python scripts.

Nothing was written on the Mac and no git write was made. No fact in this report came from memory.
