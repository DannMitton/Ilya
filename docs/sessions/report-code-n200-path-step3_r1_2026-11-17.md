The scoring tool's changes (`PICKERS` gains `path`; the `path9_fR1` and `path9_fR2` columns; `N200_REF`) were committed and pushed in `bdb9b00`, before any synthetic run in this report. The bars below were committed before the first run.

# Report, N.200 path picker, Step 3: measurement, with bars written first

Cloud lane 62, branch `cloud-lane-62`. Brief `brief-code-n200-path-picker_r3_2026-11-16.md`, Step 3.

## Dann's takes

The desk runs them and holds the results outside the repository. Nothing in this report comes from a real voice.

## The bars, written before the first run

- **fR1 within 10 percent and fR2 within 12 percent of the truth, on at least 80 percent of the takes of each voice type.** Reading: each resonance's rate must reach 80 percent per type (DESK reading of "on at least 80 percent of takes per voice type"); the rate of takes in both bars is reported beside it.
- **Denominator:** every take generated, 120 per type. A take counts when `runCapture` gives a reading within the bar, whatever its status. A re-prompt or an error counts as a miss. A second table gives Captured readings only.
- **fR2 marked absent** counts as an fR2 miss in the main table. A second table leaves absent fR2 out.
- **"In both bars"** is judged on the path's fR1 and fR2 before the fR2 check.
- **Good takes flagged:** no more than 10 percent of takes in both bars may fall in case (b) or (d). Provisional by any cause is given beside it, with the shipped picker's figure on the same takes. Every status that moves, in both directions, is listed.
- **The keep-rule for the fR2 check (`f2Check`), on the held-out set:** the check passes when it marks fR2 absent on no more than 1 percent of takes whose path fR2 is in the bar, and marks absent at least half of the fR2 misses. With no fR2 misses, the first condition decides alone. The lane reports pass or fail and every table with `f2Check` on and off; it does not change the default.
- **Sensitivity (re-scored from the stored tracks without re-running Burg):** t = 1.0 and 1.5; m = 4 (k = 3m; it scales every ceiling's W alike). L9 beside L15 (Burg re-run at the L9 ceilings). A 5 ms step, once, on the primary set only.

## The settings of the held-out set, committed before its one run

Take seed `9000 + idx*20 + k`; permutation from `rng(11000 + idx*31 + 1)`; each cell's five truth frequencies multiplied by one factor, `0.90 + 0.20 × rng(13000 + idx)()` (the first draw). They are `HELD_OUT` in `tools/n200-score/fidelity-set.ts`, committed in `d173440` (Step 0). The held-out set is run once. A later commit (`bdb9b00`) fixed a type error elsewhere in that file; the settings did not change.

The truths are Ilya's own stand-ins (`engine/stand-ins.ts`), not a real voice. **Tenor and mezzo-soprano share one truth, so the set holds four distinct types.** Their takes are distinct (different cells, so different seeds and combinations); only the truths are the same. (An earlier version of this sentence, committed with the bars, said the rows count the same takes twice. That was wrong and is corrected here; no bar changed.)

## Results

Files: the per-take tables, every one for all takes, with the second pulse, and without it, are `n200-path-step3-tables-primary_2026-11-17.md` and `n200-path-step3-tables-held_2026-11-17.md` (synthetic takes only; each ends with every fR2 miss, listed as the brief asks). The runner is `tools/n200-score/measure.run.ts`; its rows are not committed. The primary set is 600 takes (323 with the second pulse); the held-out set was run once on the settings above and has 600 takes (311 with it, 289 without, because its truths and seeds differ).

### In one paragraph

**The bars are met on both sets, narrowly for the treble fR2.** On the primary set the per-type rates are fR1 95.0 to 98.3 percent and fR2 81.7 to 93.3 percent; on the held-out set fR1 90.8 to 99.2 percent and fR2 81.7 to 92.5 percent. Soprano fR2 is 81.7 percent on both sets, 1.7 points above the 80 percent bar. **With the second pulse alone, soprano fR2 is 77.4 percent on both sets, under the bar** (the bar is stated on all takes; I report the subset because the brief asks for it). **The keep-rule for the fR2 check FAILS on the held-out set:** the check marked fR2 absent on none of the 529 in-bar takes (condition 1, met) but on only 7 of the 53 misses (13.2 percent; condition 2 needs half). The lane does not change the default; the desk reads Dann's takes and rules. **What the misses are is the finding:** see "The fR2 misses". Real voices come first; none is in this report.

### Main table, held-out set (the one the keep-rule is judged on), every take generated, any status

| Type | Takes | fR1 within 10% | fR2 within 12% | Both | Each at 80% |
|---|---|---|---|---|---|
| bass | 120 | 119 (99.2%) | 111 (92.5%) | 111 (92.5%) | pass |
| baritone | 120 | 116 (96.7%) | 110 (91.7%) | 110 (91.7%) | pass |
| tenor | 120 | 113 (94.2%) | 106 (88.3%) | 106 (88.3%) | pass |
| mezzo-soprano | 120 | 114 (95.0%) | 104 (86.7%) | 104 (86.7%) | pass |
| soprano | 120 | 109 (90.8%) | 98 (81.7%) | 98 (81.7%) | pass |

### Main table, primary set

| Type | Takes | fR1 within 10% | fR2 within 12% | Both | Each at 80% |
|---|---|---|---|---|---|
| bass | 120 | 114 (95.0%) | 111 (92.5%) | 111 (92.5%) | pass |
| baritone | 120 | 115 (95.8%) | 112 (93.3%) | 112 (93.3%) | pass |
| tenor | 120 | 118 (98.3%) | 106 (88.3%) | 106 (88.3%) | pass |
| mezzo-soprano | 120 | 117 (97.5%) | 103 (85.8%) | 103 (85.8%) | pass |
| soprano | 120 | 114 (95.0%) | 98 (81.7%) | 98 (81.7%) | pass |

The Captured-only table, the table with absent fR2 left out, and the on/off table are in the files. In short: Captured-only rates are within 7.5 points of these (soprano held-out fR2 81.7 percent, primary 80.0 percent); with absent fR2 left out the fR2 rates are 86.0 to 98.2 percent (primary) and 88.3 to 94.8 percent (held-out). **The fR2 check on or off changes no bar result:** "check off" gives the same counts, because the check never marked fR2 absent on an in-bar take, and an absent fR2 is a miss either way.

**By the second pulse** (held-out, with it / without it): soprano fR1 83.9 / 98.3 percent and fR2 77.4 / 86.2 percent; bass fR2 92.2 / 92.9; baritone 90.6 / 92.9; tenor 85.2 / 91.5; mezzo-soprano 86.7 / 86.7. Primary: soprano fR2 77.4 / 86.2. The second pulse costs the treble voices most, on both sets.

### Good takes flagged (bar: at most 10 percent of takes in both bars in case (b) or (d))

| Type | Primary: in both bars, case b or d | Held-out: in both bars, case b or d |
|---|---|---|
| bass | 111, 6 (5.4%) | 111, 0 (0.0%) |
| baritone | 112, 0 (0.0%) | 110, 0 (0.0%) |
| tenor | 106, 1 (0.9%) | 106, 3 (2.8%) |
| mezzo-soprano | 103, 3 (2.9%) | 104, 3 (2.9%) |
| soprano | 98, 2 (2.0%) | 98, 0 (0.0%) |

**Pass, every row.** Provisional by any cause on those takes: path 0 to 5.4 percent; the shipped picker 0 to 1.0 percent on the same takes. The path picker makes slightly more good takes Provisional than the shipped one (all of them by case b or d).

### Every status that moves, shipped to path, both directions (takes of 120 per type)

| Type | Captured to Provisional | Provisional to Captured | Unchanged | Primary / held-out |
|---|---|---|---|---|
| bass | 5 / 1 | 0 / 0 | 115 / 119 | |
| baritone | 0 / 1 | 0 / 0 | 120 / 119 | |
| tenor | 2 / 3 | 0 / 1 | 118 / 116 | |
| mezzo-soprano | 4 / 4 | 0 / 0 | 116 / 116 | |
| soprano | 4 / 4 | 1 / 1 | 115 / 115 | |

(Each cell: primary / held-out.) No take moves to or from a re-prompt or an error: the shipped and the path picker both re-prompt the same 18 takes on each set, because the detector and the guard decide that before any picker does.

### The fR2 misses (primary 52, held-out 53 takes whose path fR2, before the check, is outside the 12 percent bar)

- **The path's second track sits on fR1's own resonance in 39 of 52 (primary) and 34 of 53 (held-out) misses** (its fR2 is within 15 percent of its own fR1); the rest are a spurious pole between the true fR1 and fR2 (13 and 19). **None is the path reading fR3** (the brief's P0b: 18 of 21 misses were [i], which the synthetic set does not test: see "What I could not establish"). By vowel the misses are spread: [ɨ] 13 and 12, [o] 7 and 6, [u] 7 and 7, [ɛ] 6 and 5, [ʌ] 5 and 6, and the rest one to four each; [i] only 3 and 4.
- **The check keeps most of them:** 42 of 52 and 46 of 53 misses had their fR2 kept, because in case (a) the check's envelope peak near the path's fR2 is fR1's own peak, and the brief asks for "a different peak from fR1's" in case (c) only.
- **A rule the brief does not have, seen after the fact, on the same data (post hoc, so NOT a test of any rule written in advance):** requiring fR2 to lie at least 125 Hz above the path's own fR1 (the open picker's `RESOLUTION_HZ`) would mark absent 41 of the 52 primary misses and 38 of the 53 held-out misses, and none of the 530 and 529 in-bar takes. It is not implemented; the desk rules whether to add it, and a different pre-registered run would have to test it.
- Each miss's chosen ceiling, path F2 and F3, truth fR2 and fR3, and whether the check kept fR2, are listed at the end of each tables file.

### What the path chose (ceilings)

Median chosen ceiling by type (Hz), primary / held-out: bass 5172 / 5172, baritone 5172 / 5495, tenor 5495 / 5838, mezzo-soprano 5495 / 5838, soprano 5838 / 6202; the 10th to 90th range is wide (soprano, held-out: 3387 to 7000). Ceilings set aside: none, on any take of either set.
- **The lowest ceiling (3001 Hz) was chosen, with the take missing a bar, on 23 of 24 takes (primary) and 23 of 23 (held-out):** soprano 11 and 7, bass 1 and 7, baritone 3 and 2, tenor 4 and 4, mezzo-soprano 5 (four miss) and 3. Every such pick but one missed a bar: **Weenink (2023, p. 706) reports a wrong lowest-ceiling winner, and on this set it is the main source of fR1 misses** (all 4 primary and 8 of 11 held-out fR1 misses were at the lowest ceiling). The highest ceiling (7000 Hz) was chosen on 0 to 15 takes per type (soprano held-out 15) and none missed a bar.

### Sensitivity (all takes; primary / held-out)

| Variant | Change ceiling | Change a bar result | In both bars (default) |
|---|---|---|---|
| t = 1.0 | 38 (6.5%) / 53 (9.1%) | 10 (1.7%) / 17 (2.9%) | 532 / 544 (530 / 529) |
| t = 1.5 | 49 (8.4%) / 42 (7.2%) | 14 (2.4%) / 18 (3.1%) | 520 / 513 |
| m = 4 | 18 (3.1%) / 18 (3.1%) | 3 (0.5%) / 4 (0.7%) | 531 / 531 |
| L9 | not comparable (no ceiling is shared) | 83 (14.3%) / 65 (11.2%) | 549 / 562 |
| 5 ms step (primary only) | 32 (5.5%) | 11 (1.9%) | 530 |

Of the 582 readings in each set. **L9 puts more takes in both bars (549 and 562) than L15 (530 and 529).** On synthetic takes that is the evidence against L15 as the default; the brief says L9 is reported beside it and never the default, and Dann's takes (where L15 was measured against Praat at 3000 to 7000 Hz) decide. t = 1.0 moves slightly up and t = 1.5 down; m = 4 is nearly the same as m = 3.

### [i] and [u] with fR1 standing and fR2 absent (what `engine/divergence.ts:15` turns into a Provisional [ɨ]); primary / held-out, of 12 takes each

| Type | [i] | [u] |
|---|---|---|
| bass | 0 / 0 | 0 / 0 |
| baritone | 0 / 1 | 0 / 0 |
| tenor | 1 / 0 | 1 / 0 |
| mezzo-soprano | 2 / 1 | 1 / 0 |
| soprano | 0 / 2 | 0 / 1 |

Nothing in `divergence.ts` or `resolve-values.ts` was changed.

## What I could not establish

- Anything about real voices: the desk runs Dann's takes.
- Whether the synthetic fR2 misses (spurious or duplicate second pole) occur on real voices. The brief's P0b found 18 of 21 [i]; here [i] is 3 and 4 of about 52. These truths hold [i]'s fR2 and fR3 1.6 times apart, so the set does not test Dann's point (22:11) that a real [i] has fR2 close to fR3.
- Whether the shared-truth for tenor and mezzo-soprano hides a difference between them (it cannot show one).
- Whether L15's lowest ceilings split a formant on a treble voice: the ceiling table is the check, and it says they pick wrongly (above), which is the splitting Weenink (2023) names, inferred from the misses and not examined frame by frame.
- Whether the keep-rule's verdict on the synthetic set carries to real voices.
- The status counts are the engine's (`runCapture`), before the plausibility guard.
