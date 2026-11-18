# N.200 lane 66, Step 4: what a reading outside the reference values does, measured before Step 5

2026-11-18, Code (cloud session), branch `cloud-lane-66`, tip of Step 3 (`c8859f4`) plus the runner. The numbers come from `tools/n200-score/lane66-measure.run.ts` on `tools/n200-score/__golden__/path-600.json`; the appendix is its output, unedited. Nothing in the app has changed for this report: Step 5 comes after it, and nothing merges before the desk has read it (`docs/memory/PRODUCT.md:1273`).

## What was measured

- **The sets.** `path-600.json` holds the path picker's reading of the 600 primary synthetic takes: 582 readings, 18 re-prompts. A profile is the takes of one voice type with the same take index `k`: 5 types by 12 = 60 profiles, about ten vowels each. Truth is the set's own cell (`cells(PRIMARY)`), which is Ilya's own stand-in value for the type, so the truths are the guard's band centres. A "voice type" here is the declared type the profile is judged under, not who sang: the take belongs to no singer.
- **Judged outside** is `checkPlausibility`'s verdict, judged as the wizard judges it with the whole profile's anchors (the wizard holds the anchors it had at capture). **Set aside** is a sung vowel whose `fR1Source` is not `'sung'`, or whose `fR2Source` is not `'sung'` where the take read an fR2. Both are defined once, in `lane66-core.ts`, and Step 5 rereads them.
- **Cross-type run.** Each profile is judged under every declared type and under no type. Ids that route the same way give the same verdicts and replacements, so there are six groups, and one stands for each (listed in the appendix). "Counts" is today's kept case, computed by setting `plausibilityOverride`.
- **Confirmed from Step 0, as the reviews said:** the golden holds no truth and no verdict, and six of its 582 readings have no fR2.

## What the numbers say

**1. Own type: the guard almost never fires on the set.** 2 of 582 readings are judged outside under their own type. Both are [ʌ] (tenor `k6` at 491.2 Hz, soprano `k1` at 501.9 Hz, against a truth of 678.6 Hz): the path picker's own error of about 5.4 semitones on a vowel whose window is centred on the singer's [ɑ]. Lane 64 counted 0 of 566 and 0 of 588 with the type's window and no anchors; the two here appear only because the whole profile's anchors are used. These two describe picker error and nothing else. **The sets hold no contralto, countertenor, or bass-baritone bands, and none of the bass-baritone or countertenor voices these types stand for: own-type results describe the picker's error on four buckets.**

**2. Cross type: the reading is judged outside mostly under the bass window.** 60 readings are outside under a type that is not the profile's own and inside under its own. 59 of them are the baritone, tenor, mezzo-soprano, and soprano profiles judged as a bass or bass-baritone (59 of 468 readings, 12.6 percent); one is judged as a soprano. Judged as any other type, nothing is outside beyond the two [ʌ] errors above and one more (a mezzo-soprano [o] judged as a soprano); no bass profile is outside under any other type. The 60 are [e] 26, [i] 12, [u] 12, and [o] 10. This is consistent with the bands (a higher voice's first resonance lies above the bass window), which I did not test further.

**3. Question (a), which is nearer the truth.** For fR1 the reading is nearer than today's replacement in 58 of the 60 cases: the readings sit a mean 0.34 semitones from the truth, today's replacement 2.39 (the replacement is a stand-in fitted to the profile's other sung vowels, `stand-ins.ts`, shaped by the declared type's template, which is the wrong type's template). The two exceptions are a mezzo-soprano [o] judged as a soprano (reading 406 Hz, replacement 554.7 Hz, truth 538.6 Hz) and a soprano [i] judged as a bass-baritone (reading 403 Hz, replacement 362.4 Hz, truth 380.8 Hz). For fR2 the two are a wash: 0.32 st for the reading and 0.15 st for the replacement on average; the reading is nearer in 32 cases, farther in 24, equal in 4. Today's replacement for these vowels is always a stand-in (60 of 60), never a derived value.

**4. Question (b), what moves when the reading counts (cross-type cases, 198 cuts of the profile).** Counted, the reading moves the other vowels' values, and mostly toward the truth:

| sung vowels | other-vowel values | fR1 mean move | fR1 nearer / farther / equal | fR1 mean change in distance to truth | fR2 nearer / farther / equal |
|---|---|---|---|---|---|
| 1 | 540 | 4.19 st | 293 / 247 / 0 | -1.44 st | 531 / 9 / 0 |
| 2 | 480 | 1.22 st | 279 / 174 / 27 | -0.51 st | 279 / 156 / 45 |
| 3 | 420 | 0.89 st | 277 / 43 / 100 | -0.54 st | 225 / 94 / 101 |
| 6 | 72 | 0.53 st | 17 / 0 / 55 | -0.52 st | 18 / 2 / 52 |

With one sung vowel the whole template shifts to the reading, so every other value moves about 4 st; it lands nearer the truth in a little over half of the fR1 values and nearly all fR2 values, because a profile sung under the wrong type is displaced as a whole. From three sung vowels the fit starts to set an outlier aside (`stand-ins.ts:157-168`), and most of the movement is in the derived vowels ([ɪ], [ɨ]) rather than the six.

**5. The case that harms: a bass with [i] at 1063 Hz** (the bass profiles' own [i] replaced, judged as a bass; 45 cuts). Counted, the other vowels move away from the truth:

| sung vowels | cases | other-vowel values | fR1 mean move | fR1 nearer / farther / equal | fR1 mean change in distance to truth |
|---|---|---|---|---|---|
| 1 | 12 | 108 | 21.27 st | 0 / 108 / 0 | +21.27 st |
| 2 | 12 | 96 | 10.89 st | 0 / 84 / 12 | +10.00 st |
| 3 | 12 | 84 | 3.10 st (median 0) | 0 / 12 / 72 | +2.98 st |
| 6 | 9 | 36 | 5.47 st (median 0) | 0 / 9 / 27 | +5.16 st |

With one or two sung vowels, every other value follows the odd reading, by about 21 st with one. From three, the fit sets the odd [i] aside for the six Bozeman values, and the values that still move are all [ɨ]: 12 of 12 cuts at three sung vowels and 9 of 9 at six. A derived [ɨ] is built from the sung [i] (1.365 times 1063 Hz, 1451 Hz) by the second derivation loop (`stand-ins.ts:214-232`, which builds from the anchors that stand, sung or not), and the fit does not set it aside; the 21 st is that. I read this from the numbers and from that loop's text, and did not step through it. (The brief said one odd take can move Ilya's estimates until that vowel is sung again or the fit sets it aside at three; the numbers say the fit sets it aside for the six, and not for the derived [ɨ].) Nine of the twelve cuts exist at six sung vowels: the other three bass profiles lack five plausible companions, or the cut changes a verdict.

Correction, 2026-11-18 (lane 67, Step 1; Fable's as-built review of lane 66, Fix 6): the sentence "From three, the fit sets the odd [i] aside for the six Bozeman values" holds for the cut [i], [e], [ɛ]. With [i], [u], [ɑ] the fit sets the true [u] aside and the stand-ins follow the odd [i] (adapter golden, `bass | bad i (1063), no override`, `apps/web/src/lib/analysis/adapter-grid.ts:29`).

**6. The two counts, today.** Over the whole grid, 72 readings are judged outside and 72 sung vowels are set aside: they are the same vowels, since today an outside reading not kept is set aside. Of the 198 cross-type cuts, a sung vowel is set aside in 198 when not kept, and in 0 when kept; of the 45 bass cuts, 45 and 0. In none of the 243 does a plain case equal its kept twin. Step 5's rerun should read: set aside 0 in every row, judged outside unchanged (72), and every value equal to its kept twin.

## What I am not saying

- Nothing about contralto, countertenor, or bass-baritone voices: the sets hold none, and the guard routes them to the buckets the four types use (contralto to tenor-mezzo, bass-baritone to bass, countertenor to the union band).
- Nothing about a real singer. The takes are synthetic; the "wrong type" cases are a profile judged under a declared type it was not synthesised for. A real singer who declares the wrong type is displaced in just this way, and a real singer's odd take (a picker error on a clean voice) is the [ʌ] case at two readings in 582. The folder run, below, is the way to see it on real takes.
- Companions in a cut are the first plausible vowels of [i], [e], [ɛ], [ɑ], [o], [u], in that order, so the sizes are comparable; a different choice moves the numbers, not the shape. NOT ESTABLISHED: that every other choice of cut gives the same result.

## The folder run

`N200_LANE66_DIR=<folder> N200_LANE66_TYPE=<declared type>` (header of `lane66-measure.run.ts`). Run here on five synthetic sidecars written by hand in a scratch folder (an [i] at 1063 Hz, [u], [e], [ɑ], and an [o] sung as [u]): the profile is the last take sung as asked; the [o] sung as [u] is reported apart; the verdict and the window are printed per reading; counting the [i] moves [ɨ]'s fR1 by 21.0 st and leaves the other fR1 values where they are (four vowels are sung), with fR2 values shifting by up to 2.6 st; the output went to `<folder>-lane66-out/` beside the folder (`summary.md`, `readings.csv`); it refuses a folder whose output would land in the repository. It has not been run on real takes: the desk runs it on Dann's takes on his Mac.

## Appendix: the runner's output, unedited

600 takes in `path-600.json`, 582 readings (a re-prompt gives none), in 60 profiles: 5 types by 12 take indexes. Judged as the wizard judges, with the whole profile's anchors.

### The voice types the profiles are judged under

Ids that route the same way, by the guard's bucket and the stand-ins' bucket, give the same verdicts and the same replacements, so one stands for each group:

- soprano
- mezzo-soprano, contralto, tenor
- countertenor
- baritone
- bass-baritone, bass
- not-sure, (no type)

### Judged outside, under the profile's own type

| type | readings | judged outside |
|---|---|---|
| bass | 114 | 0 |
| baritone | 115 | 0 |
| tenor | 119 | 1 |
| mezzo-soprano | 118 | 0 |
| soprano | 116 | 1 |

Total: 2 of 582: tenor [ʌ] k6: fR1 491.2 Hz, truth 678.6 Hz (-5.6 st); soprano [ʌ] k1: fR1 501.9 Hz, truth 678.6 Hz (-5.2 st). The truths are the guard's own band centres, so a reading outside its own type's window is a picker error and nothing else. The sets hold no contralto, countertenor, or bass-baritone cells: own-type results describe the picker's error on four buckets, not those voices.

### Judged outside, under every other type

| judged as | readings | judged outside | of which also outside under the profile's own type (the picker's error) |
|---|---|---|---|
| soprano | 466 | 2/466 (0.4%) | 1 |
| mezzo-soprano, contralto, tenor | 345 | 1/345 (0.3%) | 1 |
| countertenor | 582 | 2/582 (0.3%) | 2 |
| baritone | 467 | 2/467 (0.4%) | 2 |
| bass-baritone, bass | 468 | 61/468 (13.0%) | 2 |
| not-sure, (no type) | 582 | 2/582 (0.3%) | 2 |

60 readings in all are outside under a type that is not the profile's own and inside under its own: the cross-type cases below. These are true to the voice: the voice is the profile's, only the declared type differs. A group's readings are counted once per profile and group, so a vowel that is outside under several groups appears in each.

### Question (a): the reading, or today's replacement, nearer the truth

|  | cases | fR1: reading, mean st from truth | fR1: replacement, mean st from truth | fR1: reading nearer / farther / equal | with an fR2 | fR2: reading, mean st | fR2: replacement, mean st | fR2: reading nearer / farther / equal |
|---|---|---|---|---|---|---|---|---|
| all cross-type cases | 60 | 0.34 | 2.39 | 58 / 2 / 0 | 60 | 0.32 | 0.15 | 32 / 24 / 4 |
| judged as bass-baritone, bass | 59 | 0.26 | 2.43 | 58 / 1 / 0 | 59 | 0.17 | 0.14 | 32 / 23 / 4 |
| judged as soprano | 1 | 4.89 | 0.51 | 0 / 1 / 0 | 1 | 9.54 | 0.81 | 0 / 1 / 0 |

By vowel:

|  | cases | fR1: reading, mean st from truth | fR1: replacement, mean st from truth | fR1: reading nearer / farther / equal | with an fR2 | fR2: reading, mean st | fR2: replacement, mean st | fR2: reading nearer / farther / equal |
|---|---|---|---|---|---|---|---|---|
| [e] | 26 | 0.21 | 2.55 | 26 / 0 / 0 | 26 | 0.05 | 0.13 | 16 / 7 / 3 |
| [o] | 10 | 0.69 | 2.51 | 9 / 1 / 0 | 10 | 1.05 | 0.23 | 4 / 5 / 1 |
| [i] | 12 | 0.38 | 1.67 | 11 / 1 / 0 | 12 | 0.04 | 0.14 | 10 / 2 / 0 |
| [u] | 12 | 0.29 | 2.68 | 12 / 0 / 0 | 12 | 0.61 | 0.14 | 2 / 10 / 0 |

Where today's value for the vowel comes from (fR1): surrogate: 60, derived: 0, sung: 0.

The cases where today's value is nearer the truth for fR1 (2):

- mezzo-soprano k4, [o] judged as soprano: reading 406 Hz, today's value 554.7 Hz (surrogate), truth 538.6 Hz
- soprano k5, [i] judged as bass-baritone: reading 403 Hz, today's value 362.4 Hz (surrogate), truth 380.8 Hz

### Question (b): what moves when the reading counts, other vowels' values

Each case is a cut of the profile to n sung vowels, one judged outside and the rest plausible under that type. A value moves by the difference between the case where the reading is excluded and the case where it counts (today's Keep). "Nearer / farther / equal" compares each moved value's distance to the set's truth, before and after. A voice sung under the wrong type is displaced as a whole, so counting its reading can help it.


#### Cross-type cases

| sung vowels | cases | other-vowel values | fR1 moves: mean st | median | max | fR1 nearer / farther / equal | fR1 mean change in distance to truth (st; negative: nearer) | fR2 moves: mean st | max | fR2 nearer / farther / equal | fR2 mean change (st) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 60 | 540 | 4.19 | 4.24 | 5.89 | 293 / 247 / 0 | -1.44 | 3.51 | 10.29 | 531 / 9 / 0 | -2.92 |
| 2 | 60 | 480 | 1.22 | 1.28 | 3.75 | 279 / 174 / 27 | -0.51 | 0.54 | 4.67 | 279 / 156 / 45 | -0.26 |
| 3 | 60 | 420 | 0.89 | 0.89 | 5.60 | 277 / 43 / 100 | -0.54 | 0.08 | 0.89 | 225 / 94 / 101 | -0.01 |
| 6 | 18 | 72 | 0.53 | 0.00 | 2.61 | 17 / 0 / 55 | -0.52 | 0.03 | 0.43 | 18 / 2 / 52 | -0.02 |

Of 198 cases: a sung vowel is set aside in 198 when the reading is not kept, and in 0 when it is kept; every value equals its kept twin in 0.

Where the movement sits:

| sung vowels | cases | values that move by more than 1 st (fR1) | by vowel |
|---|---|---|---|
| 1 | 60 | 540 | [i] 48, [e] 34, [ɪ] 60, [ɨ] 60, [ɛ] 60, [a] 60, [ɑ] 60, [ʌ] 60, [o] 50, [u] 48 |
| 2 | 60 | 356 | [i] 25, [e] 20, [ɪ] 46, [ɨ] 34, [ɛ] 18, [a] 46, [ɑ] 46, [ʌ] 46, [o] 38, [u] 37 |
| 3 | 60 | 92 | [i] 6, [e] 2, [ɪ] 28, [ɨ] 16, [a] 9, [ɑ] 9, [ʌ] 9, [o] 5, [u] 8 |
| 6 | 18 | 17 | [ɪ] 17 |

#### A bass with [i] at 1063 Hz (the profile's own [i] replaced; judged as a bass)

| sung vowels | cases | other-vowel values | fR1 moves: mean st | median | max | fR1 nearer / farther / equal | fR1 mean change in distance to truth (st; negative: nearer) | fR2 moves: mean st | max | fR2 nearer / farther / equal | fR2 mean change (st) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 12 | 108 | 21.27 | 21.27 | 21.27 | 0 / 108 / 0 | 21.27 | 0.07 | 0.23 | 0 / 108 / 0 | 0.07 |
| 2 | 12 | 96 | 10.89 | 10.91 | 22.12 | 0 / 84 / 12 | 10.00 | 0.10 | 0.32 | 80 / 16 / 0 | -0.08 |
| 3 | 12 | 84 | 3.10 | 0.00 | 21.90 | 0 / 12 / 72 | 2.98 | 0.05 | 0.22 | 65 / 15 / 4 | -0.03 |
| 6 | 9 | 36 | 5.47 | 0.00 | 22.20 | 0 / 9 / 27 | 5.16 | 0.03 | 0.21 | 7 / 10 / 19 | -0.00 |

Of 45 cases: a sung vowel is set aside in 45 when the reading is not kept, and in 0 when it is kept; every value equals its kept twin in 0.

Where the movement sits:

| sung vowels | cases | values that move by more than 1 st (fR1) | by vowel |
|---|---|---|---|
| 1 | 12 | 108 | [e] 12, [ɪ] 12, [ɨ] 12, [ɛ] 12, [a] 12, [ɑ] 12, [ʌ] 12, [o] 12, [u] 12 |
| 2 | 12 | 84 | [ɨ] 12, [ɛ] 12, [a] 12, [ɑ] 12, [ʌ] 12, [o] 12, [u] 12 |
| 3 | 12 | 12 | [ɨ] 12 |
| 6 | 9 | 9 | [ɨ] 9 |

### The two counts, over the whole grid

Judged outside and set aside, every profile under every group, own type included. Set aside is read with nothing kept (today's rule: an outside reading is set aside).

| judged as | profiles | readings | judged outside | set aside | profiles with a vowel set aside |
|---|---|---|---|---|---|
| soprano | 60 | 582 | 3 | 3 | 3 |
| mezzo-soprano, contralto, tenor | 60 | 582 | 2 | 2 | 2 |
| countertenor | 60 | 582 | 2 | 2 | 2 |
| baritone | 60 | 582 | 2 | 2 | 2 |
| bass-baritone, bass | 60 | 582 | 61 | 61 | 29 |
| not-sure, (no type) | 60 | 582 | 2 | 2 | 2 |

Total: 72 judged outside, 72 set aside.
