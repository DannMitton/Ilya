# Report, N.200 lane 64, Step 3: one run of the third synthetic set

Cloud lane 64, branch `cloud-lane-64`, on top of `5e71b59` (Step 2). Third set as the desk confirmed: take seed `15000 + idx*20 + k`, permutation `rng(17000 + idx*31 + 1)`, truth factor from `rng(19000 + idx)`. **Run once** (five voice-type processes, 600 takes, about nine minutes of wall time on two cores, every process exit 0; nothing re-run, nothing re-scored). Rows stayed in the session's scratchpad; the full tables, all takes and with and without the second pulse, are filed beside this report: `docs/sessions/n200-lane64-step3-tables-third_2026-11-17.md` (530 lines). Synthetic takes only; no real voice, sidecar, or table.

The bars are those of section 3A, committed in Step 0 (`report-code-n200-lane64-step0_r1_2026-11-17.md`, section 5, commit `b66b0d9`), before anything was built. The two readings I had to make are in the Step 2 report and in the header of `tools/n200-score/variant-core.ts`.

## The stop rule

With every option off on L15 (the lane 62 picker), **no voice type misses the 80 percent bar** on the third set. The lane does not stop on this ground.

| type | takes | fR1 within 10% | fR2 within 12% |
|---|---|---|---|
| bass | 120 | 119 (99.2%) | 106 (88.3%) |
| baritone | 120 | 120 (100.0%) | 117 (97.5%) |
| tenor | 120 | 119 (99.2%) | 107 (89.2%) |
| mezzo-soprano | 120 | 118 (98.3%) | 101 (84.2%) |
| soprano | 120 | 118 (98.3%) | 104 (86.7%) |

The weakest figure is mezzo-soprano fR2, 84.2 percent. Three of 600 takes are re-prompted by the fry detector (all three are [ʌ]: tenor idx 27, mezzo-soprano idx 37, soprano idx 47). The path picker finds an fR1 on every other take; three of those fR1 readings are outside the 10 percent bar (bass [i] idx 0 k 7, mezzo-soprano [o] idx 38 k 7, soprano [o] idx 48 k 1). Self-check: L15 with every option off equals the default `runCapture` path reading (f1 and f2 to 0.1 Hz) on **597 of 597** readings.

## The verdict, per variant, pooled (600 takes)

"In both bars" is the take's final reading within 10 percent on fR1 and 12 percent on fR2, with every take generated in the denominator.

| variant | in both bars | bar 1 (fR2 changed, of 542 to 569 takes with track-2 fR2 in bar) | bar 2 (end absent or within, of the takes outside) | bar 3 (P3 promoted, within 12%) | bar 4 (lost against L15) | bar 5 | verdict |
|---|---|---|---|---|---|---|---|
| L15, off | 535 (89.2%) | 0 | 16 of 55 (reference row) | n/a | n/a | holds | fails 2 |
| L15, R125 | 535 (89.2%) | 0 | 54 of 55 (off 16) | n/a | n/a | holds | **PASS** |
| L15, DP | 535 (89.2%) | 0 | 53 of 55 (off 16) | n/a | n/a | holds | **PASS** |
| L15, R125+DP | 535 (89.2%) | 0 | 54 of 55 (off 16) | n/a | n/a | holds | **PASS** |
| L15, R125+DP+P3 | **580 (96.7%)** | 0 | 54 of 55 (off 16) | 46 of 46 | n/a | holds | **PASS** |
| L3188, off | 557 (92.8%) | 0 | 12 of 34 (reference row) | n/a | 1 lost | holds | fails 2, 4 |
| L3188, R125 | 557 | 0 | 33 of 34 (off 12) | n/a | 1 lost | holds | fails 4 |
| L3188, DP | 557 | 0 | 31 of 34 | n/a | 1 lost | holds | fails 4 |
| L3188, R125+DP | 557 | 0 | 33 of 34 | n/a | 1 lost | holds | fails 4 |
| L3188, R125+DP+P3 | 580 | 0 | 33 of 34 | 24 of 24 | 1 lost | holds | fails 4 |
| L3387, off | 563 (93.8%) | 0 | 11 of 28 (reference row) | n/a | 1 lost | holds | fails 2, 4 |
| L3387, R125 | 563 | 0 | 27 of 28 (off 11) | n/a | 1 lost | holds | fails 4 |
| L3387, DP | 563 | 0 | 26 of 28 | n/a | 1 lost | holds | fails 4 |
| L3387, R125+DP | 563 | 0 | 27 of 28 | n/a | 1 lost | holds | fails 4 |
| L3387, R125+DP+P3 | 582 (97.0%) | 0 | 27 of 28 | 19 of 19 | 1 lost | holds | fails 4 |

Every figure, with the per-type and with-and-without-pulse tables, is in the filed tables. No takes had no track-2 value (every take has a second track), so the first reading of the brief never came into play.

**Passing both bars of the third set, in the choice rule's order** (most takes in both bars, then fewest options, then L15): L15 R125+DP+P3 (580), then L15 R125, L15 DP, and L15 R125+DP (535 each). Per the brief, the desk applies Dann's takes and chooses; I choose nothing.

## What the numbers say, and what they do not

- **R125, DP, and R125+DP change fR2 on none of the takes whose track-2 fR2 is in the bar (0 of 542)**, and they raise the takes that end absent or within 12 percent, of the 55 whose track-2 fR2 is outside the bar, from 16 (every option off) to 54 (R125 and R125+DP) or 53 (DP). They do not raise the count of takes in both bars (535), because an absent fR2 is still a miss in the denominator. Their gain is that a wrong fR2 is no longer reported.
- **P3 is what raises the count**: it promotes track 3 on 46 takes, and all 46 are within 12 percent of the truth (the worst is 4.0 percent off). With it, every voice type reads fR2 within 12 percent on at least 91.7 percent of its takes (bass 91.7, baritone 100.0, tenor 98.3, mezzo-soprano 95.8, soprano 98.3; in both bars, mezzo-soprano 95.0). It does not touch fR1.
- **P3's 46 promotions are not evenly spread**: 16 are [ɨ], 14 are mezzo-soprano, 14 soprano, 11 tenor, 4 bass, 3 baritone. This is a synthetic set whose [ɨ] truths come from `derive`; whether a real [ɨ] behaves so is **NOT ESTABLISHED**.
- **A raised floor helps on this set and fails bar 4 by exactly one take, the same one for both floors**: bass [u], idx 9, k 0, with the second pulse. Truth fR1 296, fR2 744. L15 chooses its lowest ceiling (3000.7 Hz) and reads 273.8 and 789.6, in both bars (fR1 -7.5 percent, fR2 +6.1 percent). L3188 reads 279.6 and 833.2 (fR2 +12.00 percent, over the 12 percent bar by a hair), and L3387 reads 285.7 and 891.8 (fR2 +19.9 percent). Bar 4 is "no take", so by the brief's words every raised-floor variant fails. Weighing against it: on L3188 with every option off, 23 takes enter both bars that were not in them on L15 (net +22 with the one lost), and the default run chose the lowest ceiling on 27 takes, 24 of which miss a bar (tenor 7, mezzo-soprano 10, soprano 7, all misses; bass 2 and baritone 1, none). So the lowest ceiling is wrong for the trebles and right for the basses, and the take lost is a bass [u], the vowel and voice type of Dann's two [u] takes, which section 3A requires to stay in both bars.
- **The weighting option** (rows weighted by 1/sqrt(b), L15, every other option off): **163 of 597 readings (27.3 percent) change ceiling** (bass 21, baritone 31, tenor 34, mezzo-soprano 43, soprano 34), and the takes in both bars go from 535 to 553. The brief set no bar for it, so it has no verdict. It moves more than a quarter of the ceilings, so I would not adopt it without Dann's takes and the desk's reading.
- **With and without the second pulse** (reported, not judged): the picture is the same. In both bars, L15 off: 251 of 281 (89.3 percent) with the pulse, 284 of 319 (89.0 percent) without. L15 R125+DP+P3: 274 of 281 (97.5 percent) and 306 of 319 (95.9 percent). Bar 1 changes none on either half. fR1 is 100 percent without the pulse and 97.9 percent with it on L15.

## The tables the brief asks to report

All in `n200-lane64-step3-tables-third_2026-11-17.md`: main table, Captured only, absent left out, the check on and off, good takes flagged, the fR2 keep-rule, [i] and [u] with fR1 standing and fR2 absent, all for all takes, with the second pulse (281), and without (319); status moves; ceilings; the fR2 misses; and the lane 64 section (self-check, the stop rule, the pooled verdicts, the choice rule, where P3 got its fR2, the weighting, every voice type for every variant, the split by pulse, and the verdict table on each half). The older sensitivity table is empty by design for this set (lane 62's t, terms, L9, and 5 ms variants are skipped here).

## What I could not establish

- Whether R125, DP, or P3 helps or harms a real voice. The third set is synthetic, from the same generator and the same stand-in truths as the earlier sets. None of this speaks for a real [ɨ], for a treble's real fry, or for Dann's bass beyond what the desk's run of his 13 takes shows.
- That the third set is independent of the choice of options: it is independent of the earlier sets' seeds, but the options were designed after the lane 62 failures on the primary and held-out sets, which share a generator with it.
- Whether the one lost take (bass [u] idx 9) is a fair reason to reject a raised floor. Bar 4 says so by its words; the numbers are above for the desk to weigh.

**Stopped for the desk.** I have not started Step 4 or Step 5. Step 4 begins when the desk types the chosen variant here (or that none passes, in which case every option stays off and the ladder stays L15).
