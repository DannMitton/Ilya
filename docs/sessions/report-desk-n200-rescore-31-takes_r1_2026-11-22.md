# N.200 Step 4, re-scored: 31 takes, the corrected ceiling, and what it settles

Desk report, 2026-11-23 early (Opus desk). The measurement was run by a Sonnet helper in its own container (133,890 tokens of a 300,000 cap, 13 tool uses, 2.9 minutes); this file is the desk's filing of its report, read in full.

Successor to `report-desk-n200-burg-ceiling_r1_2026-11-22.md`, which diagnosed the ceiling on thirteen takes. That report's section 7 item 1 asked for exactly this run, and it is now done.

## 1. What it settles

**At a 4,000 Hz reference ceiling, Ilya's shipped picker agrees with the independent reference on every one of the 31 takes, on both resonances.**

| picker | reference ceiling | fR1 within 10% | fR2 within 12% |
|---|---|---|---|
| path (the shipped default) | **4,000 Hz** | **31 of 31** | **31 of 31** |
| path | 5,000 Hz, the old default | 12 of 31 | 17 of 31 |

The worst disagreement at 4,000 Hz is 4.4 per cent, on an [ɨ] take's second resonance; the worst on a first resonance is 4.3 per cent, also [ɨ].

**So the 2026-11-16 Step 4 figure of 6 of 12 on fR1 measured the reference's ceiling, not Ilya.** That is now established on 31 takes rather than inferred from 13.

## 2. The control was reproduced exactly

The helper identified the same thirteen takes the 2026-11-22 report used, by matching Ilya's fR1 values in `burg-diag/manifest.json` against the sidecars, and got 1 of 13 and 3 of 13 at 5,000 Hz, and 13 of 13 on both at 4,000 Hz. The worst disagreement measured 2.757 per cent against the report's 2.7, on the same take. Nine of thirteen within half a per cent on both, as reported.

One correction to the earlier report's description of its own set: the `dark-a` files are the [ɑ] takes, not the [a] takes.

## 3. Ilya's own ladder never chose the reference's default

`trace.chosen.path.ceiling` across the 31 takes: minimum 3,001 Hz, median 4,061 Hz, maximum 4,869 Hz, mean 3,989 Hz. Sixteen of 31 fall between 3,500 and 4,500 Hz. **No take chose 5,000 Hz or above.**

This is independent of the scoring above: Ilya's fifteen-ceiling ladder, picking for itself on this voice, lands where the corrected reference lands. The two methods were not told about each other.

## 4. Per vowel

Passes of fR1 and fR2, three takes per vowel and four for [o].

| vowel | path, 4,000 Hz | path, 5,000 Hz |
|---|---|---|
| a | 3/3 | 1/3 |
| e | 3/3 | 2/2 |
| i | 3/3 | 1/1 |
| o (4) | 4/4 | 0/0 |
| u | 3/3 | 0/0 |
| ɑ | 3/3 | 0/2 |
| ɛ | 3/3 | 3/3 |
| ɨ | 3/3 | 2/2 |
| ɪ | 3/3 | 2/2 |
| ʌ | 3/3 | 1/2 |

At 5,000 Hz the failures concentrate exactly where the diagnosis predicted: all four [o] and all three [u] fail both resonances, and all three [ɑ] fail the first. [ɛ] passes at both ceilings for both pickers, which is the one vowel the old default never broke.

## 5. "Both pickers" is half delivered, and the desk owns the gap

The close of 2026-11-22 asked for both pickers. **Only the path picker is properly measured here.**

Every one of the 31 sidecars carries `picker: "path"`, and the app's own closed-phase *reading* is not stored in them; only the raw `trace.closedPhase.resonances` list is. The helper therefore defined its own selection rule over that list and scored it, getting 24 of 31 and 28 of 31 at 4,000 Hz. **Those numbers measure the helper's rule, not Ilya's closed-phase picker**, and three plausible rules gave three different fR2 scores (28, 24, 28). They are not evidence about the app and are not reported as such.

Measuring the app's closed-phase picker needs the app, re-reading the same 31 WAVs with that picker selected. That is a separate job and it is the desk's.

Worth keeping from the attempt: 17 of the 31 takes carry a resonance entry below 50 Hz, one of them at 1.9e-29. Whatever the app's closed-phase picker does with those is NOT ESTABLISHED here.

## 6. Method, as the helper reported it

An unmodified copy of `burg.py` was imported and `burg.CEILING` overridden; the helper first read that `CEILING` is a module global consumed at call time in `analyse` and `frame_formants`, then proved the override took effect by instrumenting the resample rate (8,000 Hz at a 4,000 Hz ceiling, 10,000 Hz at 5,000) and the highest pole kept (3,950 Hz against 4,917 Hz) across all 31 takes. The unmodified command line on one take printed 569 / 2,411 Hz, matching the helper's own 5,000 Hz reading for it.

The analysis stretch followed the script's own default: the sidecar's `outcome.guard.segmentS` where present, the whole file otherwise, which was the case for 21 of 31.

## 7. What is NOT established

- **Agreement is not correctness.** Two methods agreeing to within 4.4 per cent is strong and is not proof that either is right. The desk's 2026-11-22 caveat stands unchanged.
- **One bass, one room, one session.** Nothing here says what ceiling suits a treble voice. A treble's resonances sit where the 5,000 Hz default was designed to look.
- **Where the right ceiling is.** Only 4,000 and 5,000 Hz were run here. The earlier sweep found 3,500 Hz also close, 4,500 Hz unstable, and 3,000 and 2,500 Hz breaking [i]'s second resonance.
- **The app's closed-phase picker**, as section 5 says.

## 8. What follows

1. **Dann's, and it is taste: what the reference ceiling becomes.** A fixed lower value, or a value chosen from the declared voice type. The measurement does not decide it, and `burg.py` is a checking tool outside the app, so nothing a singer meets changes either way.
2. **The desk's:** score the app's own closed-phase picker on the same 31 takes.
3. Nothing in Ilya changes on this report.
