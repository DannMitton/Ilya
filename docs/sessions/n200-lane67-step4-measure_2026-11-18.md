# Lane 67, Step 4: the sixth core vowel, three ways

The truths are Ilya's own templates by type (`fidelity-set.ts:12-14`). The declared-type arm is exact by construction. This run measures how far Bozeman's staves differ in shape from their middle, and how far one odd [i] moves a missing vowel. It does not test `middle` against a real voice.
Run 2026-11-18 on the untouched engine at `Shane` `2b3bde8e` plus Step 1's comment-only commit (no engine behaviour changed). Code: `tools/n200-score/lane67-core.ts` (tests `lane67-core.test.ts`, 7 passed), runner `lane67-measure.run.ts`:

```
pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts lane67-measure.run.ts
```

Arm `fit` is the tree's own `fillStandIns` through `resolveVowelValues(..., 'always')` (`apps/web/src/lib/voice/engine/stand-ins.ts`) as it stood for this run. Step 3 removes that code; this runner's `fit` arm then reads the tree after Step 3 and is no longer today's fit. The numbers below are the record of today's.

## What the numbers say, and what they do not

Read from the tables below; the desk decides nothing from them here, and Step 3 uses `middle` as the brief fixes.

1. **`declared` is the smallest error in fR1 (median 0.09 st, p90 0.24) and that says nothing about a real voice.** The truths are the declared type's templates, so the arm is exact up to the picker's noise on the five sung vowels. It would win whatever the shape of real voices.
2. **How far Bozeman's staves differ in shape from their middle** is the gap between `shape` and `declared` in fR1: median 0.53 st over all cuts, 0.79 st for the bass staff, 0.16 to 0.18 st for tenor and mezzo, 0.49 for baritone, 0.61 for soprano; 90th percentile 0.98 st over all cuts, 1.16 st for bass. By vowel the p90 is 0.59 st ([o]) to 1.16 st ([ɑ]). In fR2 `shape` and `declared` agree within 0.01 to 0.03 st by type: the fR2 template is one bass row scaled by the fR1 ratio (`stand-ins.ts`, `template`), so the shape difference in fR2 is built in, not measured. NOT ESTABLISHED: whether real voices differ from `middle` by more or less than Bozeman's staves do from it.
3. **Today's fit** has median fR1 error 0.33 st and p90 0.63 st, better than `shape` in fR1 and worse in fR2 (median 0.15 against 0.10; p90 0.45 against 0.27). It uses the voice type's template, so in this run it is also helped by the truth being that template.
4. **One odd [i] (1063 Hz, 2250 Hz) among five core vowels.** `shape` and `declared` move the missing vowel by the same amount in both resonances (one scale number): median 2.23 st, p90 2.68, max 2.74 (270 cuts). Today's fit moves it by median 0.10 st in fR1 and 0.49 in fR2, but with a long tail: fR1 p90 6.39 st, max 18.64 st. So with five vowels the scale is steady and gives a bounded error from an odd reading; the fit is usually unmoved and sometimes moves a vowel by more than an octave's third. I did not trace which cuts give the tail (NOT ESTABLISHED: why).
5. **Not run:** a real voice (no recording of a singer with a missing core vowel is in this tree), the held-out and third synthetic sets, and a leave-two-out. The 54 of 60 profiles with all six readings carry this run; 6 profiles lack a core reading (re-prompt) and give no cut.


600 takes in `path-600.json`, in 60 profiles (5 types by 12 take indexes). 54 profiles hold all six core readings (a re-prompt gives none); each gives six cuts, so 324 cuts, each estimated three ways. Errors are the estimate against the set's truth, in semitones; every cell is "median / 90th percentile" of the absolute error (nearest rank). The five sung vowels are the path picker's readings of the synthetic takes, noise included.

## All cuts

### fR1

| all | cuts | shape: median / p90 | declared: median / p90 | fit: median / p90 |
|---|---|---|---|---|
| all | 324 | 0.53 / 0.98 | 0.09 / 0.24 | 0.33 / 0.63 |

### fR2

| all | cuts | shape: median / p90 | declared: median / p90 | fit: median / p90 |
|---|---|---|---|---|
| all | 324 | 0.10 / 0.27 | 0.09 / 0.24 | 0.15 / 0.45 |

## By type

### fR1

| type | cuts | shape: median / p90 | declared: median / p90 | fit: median / p90 |
|---|---|---|---|---|
| bass | 54 | 0.79 / 1.16 | 0.17 / 0.23 | 0.46 / 0.87 |
| baritone | 60 | 0.49 / 0.75 | 0.15 / 0.27 | 0.41 / 0.73 |
| tenor | 72 | 0.16 / 0.85 | 0.06 / 0.15 | 0.26 / 0.49 |
| mezzo-soprano | 72 | 0.18 / 0.86 | 0.08 / 0.16 | 0.28 / 0.44 |
| soprano | 66 | 0.61 / 1.01 | 0.09 / 0.25 | 0.33 / 0.63 |

### fR2

| type | cuts | shape: median / p90 | declared: median / p90 | fit: median / p90 |
|---|---|---|---|---|
| bass | 54 | 0.16 / 0.28 | 0.17 / 0.23 | 0.14 / 0.37 |
| baritone | 60 | 0.16 / 0.30 | 0.15 / 0.27 | 0.13 / 0.39 |
| tenor | 72 | 0.07 / 0.18 | 0.06 / 0.15 | 0.19 / 0.45 |
| mezzo-soprano | 72 | 0.07 / 0.16 | 0.08 / 0.16 | 0.19 / 0.54 |
| soprano | 66 | 0.11 / 0.30 | 0.09 / 0.25 | 0.11 / 0.42 |

## By vowel

### fR1

| vowel | cuts | shape: median / p90 | declared: median / p90 | fit: median / p90 |
|---|---|---|---|---|
| i | 54 | 0.75 / 0.89 | 0.08 / 0.25 | 0.26 / 0.73 |
| e | 54 | 0.64 / 1.08 | 0.09 / 0.21 | 0.34 / 0.54 |
| ɛ | 54 | 0.40 / 0.95 | 0.10 / 0.26 | 0.36 / 0.59 |
| ɑ | 54 | 0.32 / 1.16 | 0.09 / 0.27 | 0.36 / 0.79 |
| o | 54 | 0.31 / 0.59 | 0.09 / 0.20 | 0.31 / 0.47 |
| u | 54 | 0.20 / 1.01 | 0.15 / 0.26 | 0.34 / 0.73 |

### fR2

| vowel | cuts | shape: median / p90 | declared: median / p90 | fit: median / p90 |
|---|---|---|---|---|
| i | 54 | 0.12 / 0.30 | 0.08 / 0.25 | 0.11 / 0.28 |
| e | 54 | 0.08 / 0.22 | 0.09 / 0.21 | 0.09 / 0.18 |
| ɛ | 54 | 0.11 / 0.30 | 0.10 / 0.26 | 0.11 / 0.21 |
| ɑ | 54 | 0.09 / 0.28 | 0.09 / 0.27 | 0.25 / 0.42 |
| o | 54 | 0.09 / 0.20 | 0.09 / 0.20 | 0.36 / 0.71 |
| u | 54 | 0.14 / 0.25 | 0.15 / 0.26 | 0.21 / 0.48 |

## By type and vowel

### fR1

| type | vowel | cuts | shape: median / p90 | declared: median / p90 | fit: median / p90 |
|---|---|---|---|---|---|
| bass | i | 9 | 0.65 / 0.73 | 0.11 / 0.20 | 0.75 / 0.93 |
| bass | e | 9 | 1.08 / 1.29 | 0.15 / 0.25 | 0.44 / 0.54 |
| bass | ɛ | 9 | 0.94 / 1.01 | 0.19 / 0.26 | 0.31 / 0.59 |
| bass | ɑ | 9 | 1.16 / 1.24 | 0.19 / 0.27 | 0.24 / 0.86 |
| bass | o | 9 | 0.59 / 0.92 | 0.19 / 0.26 | 0.47 / 0.56 |
| bass | u | 9 | 0.06 / 0.26 | 0.18 / 0.27 | 0.87 / 1.10 |
| baritone | i | 10 | 0.81 / 0.89 | 0.19 / 0.27 | 0.53 / 0.66 |
| baritone | e | 10 | 0.10 / 0.18 | 0.10 / 0.22 | 0.36 / 0.46 |
| baritone | ɛ | 10 | 0.46 / 0.56 | 0.17 / 0.27 | 0.59 / 0.69 |
| baritone | ɑ | 10 | 0.41 / 0.59 | 0.18 / 0.29 | 0.66 / 0.86 |
| baritone | o | 10 | 0.54 / 0.58 | 0.14 / 0.18 | 0.35 / 0.42 |
| baritone | u | 10 | 0.51 / 0.60 | 0.18 / 0.26 | 0.29 / 0.64 |
| tenor | i | 12 | 0.85 / 0.89 | 0.04 / 0.13 | 0.11 / 0.27 |
| tenor | e | 12 | 0.70 / 0.85 | 0.07 / 0.15 | 0.28 / 0.47 |
| tenor | ɛ | 12 | 0.06 / 0.15 | 0.06 / 0.14 | 0.27 / 0.49 |
| tenor | ɑ | 12 | 0.16 / 0.27 | 0.05 / 0.12 | 0.25 / 0.45 |
| tenor | o | 12 | 0.07 / 0.16 | 0.05 / 0.12 | 0.24 / 0.39 |
| tenor | u | 12 | 0.12 / 0.25 | 0.08 / 0.22 | 0.40 / 0.54 |
| mezzo-soprano | i | 12 | 0.82 / 0.93 | 0.08 / 0.16 | 0.13 / 0.33 |
| mezzo-soprano | e | 12 | 0.70 / 0.86 | 0.08 / 0.15 | 0.26 / 0.41 |
| mezzo-soprano | ɛ | 12 | 0.07 / 0.23 | 0.10 / 0.16 | 0.30 / 0.45 |
| mezzo-soprano | ɑ | 12 | 0.18 / 0.28 | 0.06 / 0.13 | 0.37 / 0.44 |
| mezzo-soprano | o | 12 | 0.07 / 0.17 | 0.07 / 0.13 | 0.28 / 0.32 |
| mezzo-soprano | u | 12 | 0.12 / 0.20 | 0.08 / 0.16 | 0.34 / 0.49 |
| soprano | i | 11 | 0.61 / 0.78 | 0.08 / 0.25 | 0.26 / 0.38 |
| soprano | e | 11 | 0.07 / 0.26 | 0.09 / 0.20 | 0.34 / 0.56 |
| soprano | ɛ | 11 | 0.81 / 0.97 | 0.09 / 0.22 | 0.33 / 0.63 |
| soprano | ɑ | 11 | 0.62 / 0.75 | 0.07 / 0.14 | 0.44 / 0.70 |
| soprano | o | 11 | 0.41 / 0.46 | 0.10 / 0.15 | 0.35 / 0.46 |
| soprano | u | 11 | 1.01 / 1.12 | 0.14 / 0.26 | 0.18 / 0.52 |

### fR2

| type | vowel | cuts | shape: median / p90 | declared: median / p90 | fit: median / p90 |
|---|---|---|---|---|---|
| bass | i | 9 | 0.16 / 0.25 | 0.11 / 0.20 | 0.08 / 0.60 |
| bass | e | 9 | 0.06 / 0.18 | 0.15 / 0.25 | 0.09 / 0.32 |
| bass | ɛ | 9 | 0.25 / 0.33 | 0.19 / 0.26 | 0.12 / 0.42 |
| bass | ɑ | 9 | 0.27 / 0.36 | 0.19 / 0.27 | 0.18 / 0.38 |
| bass | o | 9 | 0.13 / 0.20 | 0.19 / 0.26 | 0.21 / 0.78 |
| bass | u | 9 | 0.16 / 0.25 | 0.18 / 0.27 | 0.22 / 0.34 |
| baritone | i | 10 | 0.24 / 0.33 | 0.19 / 0.27 | 0.12 / 0.16 |
| baritone | e | 10 | 0.10 / 0.22 | 0.10 / 0.22 | 0.10 / 0.16 |
| baritone | ɛ | 10 | 0.20 / 0.30 | 0.17 / 0.27 | 0.06 / 0.20 |
| baritone | ɑ | 10 | 0.13 / 0.24 | 0.18 / 0.29 | 0.18 / 0.39 |
| baritone | o | 10 | 0.18 / 0.22 | 0.14 / 0.18 | 0.24 / 0.68 |
| baritone | u | 10 | 0.12 / 0.20 | 0.18 / 0.26 | 0.19 / 0.22 |
| tenor | i | 12 | 0.08 / 0.12 | 0.04 / 0.13 | 0.10 / 0.23 |
| tenor | e | 12 | 0.07 / 0.21 | 0.07 / 0.15 | 0.08 / 0.23 |
| tenor | ɛ | 12 | 0.06 / 0.14 | 0.06 / 0.14 | 0.11 / 0.21 |
| tenor | ɑ | 12 | 0.06 / 0.14 | 0.05 / 0.12 | 0.27 / 0.45 |
| tenor | o | 12 | 0.05 / 0.13 | 0.05 / 0.12 | 0.38 / 0.71 |
| tenor | u | 12 | 0.08 / 0.22 | 0.08 / 0.22 | 0.23 / 0.38 |
| mezzo-soprano | i | 12 | 0.07 / 0.24 | 0.08 / 0.16 | 0.11 / 0.25 |
| mezzo-soprano | e | 12 | 0.08 / 0.22 | 0.08 / 0.15 | 0.09 / 0.18 |
| mezzo-soprano | ɛ | 12 | 0.09 / 0.16 | 0.10 / 0.16 | 0.12 / 0.23 |
| mezzo-soprano | ɑ | 12 | 0.07 / 0.14 | 0.06 / 0.13 | 0.34 / 0.64 |
| mezzo-soprano | o | 12 | 0.07 / 0.13 | 0.07 / 0.13 | 0.37 / 0.81 |
| mezzo-soprano | u | 12 | 0.09 / 0.16 | 0.08 / 0.16 | 0.35 / 0.67 |
| soprano | i | 11 | 0.13 / 0.30 | 0.08 / 0.25 | 0.18 / 0.33 |
| soprano | e | 11 | 0.08 / 0.19 | 0.09 / 0.20 | 0.07 / 0.11 |
| soprano | ɛ | 11 | 0.10 / 0.17 | 0.09 / 0.22 | 0.05 / 0.11 |
| soprano | ɑ | 11 | 0.07 / 0.14 | 0.07 / 0.14 | 0.19 / 0.36 |
| soprano | o | 11 | 0.13 / 0.18 | 0.10 / 0.15 | 0.42 / 0.63 |
| soprano | u | 11 | 0.22 / 0.33 | 0.14 / 0.26 | 0.05 / 0.41 |

## One odd [i] (1063 Hz, 2250 Hz; `analysis/adapter-grid.ts:29`) among five core vowels

Each of the other five core vowels is left out in turn; the [i] is the odd one, and the other four are the profile's own. The move is the estimate of the missing vowel with the odd [i] against the same estimate with the profile's own [i]: absolute, in semitones, median / 90th percentile / maximum.

| method | cuts | fR1 move: median / p90 / max (st) | fR2 move: median / p90 / max (st) |
|---|---|---|---|
| shape | 270 | 2.23 / 2.68 / 2.74 | 2.23 / 2.68 / 2.74 |
| declared | 270 | 2.23 / 2.68 / 2.74 | 2.23 / 2.68 / 2.74 |
| fit | 270 | 0.10 / 6.39 / 18.64 | 0.49 / 1.59 / 2.81 |
