# Report, N.200 Step 3: the agnostic extractor, behind `?measure=open`

Cloud lane 52. Brief Step 3. This file is committed twice: first with only the section below, **before the open picker was written or run**, then complete with the step.

## PRE-REGISTRATION: the synthetic gate, stated before the run (2026-11-15, before any code of the picker exists)

**The set.** `engine/fry-synth.ts`, as `i-extractor.test.ts` builds it: per case 36 takes (three fry rates 35, 50, 70 Hz; three levels 0, -15, -30 dB; four sources: jitter 0.02, jitter 0.12, jitter 0.05 with diplophonic alternation 0.3, jitter 0.1 with breath). "Plain" means the three sources that are not diplophonic. Bass cases: [i] 290/2150, [e] 380/1900, [ɛ] 580/1700, [a] 710/1200, [ɑ] 650/1050, [ɑ] 750/1150, [o] 480/830, [u] 270/700. Treble cases (fR1 and fR2 raised, never prototyped): [ɑ] 900/1400, [u] 400/900, [o] 600/1000, [e] 500/2300, [i] 400/2700. Stress variants: open phase 4 ms on [u] and [o]; room noise six times louder on [o]; a second pulse 5 ms after each main pulse (ratio 0.6) on [i] 290 and [ɑ] 650. Known resonances are generator arguments.

**What a pass is.** fR1 within 10% and fR2 within 12% of the generator's values, the bars of Step 4.

**The bars, before the run.**
1. Agnostic: for every take, the open picker's reading is identical whichever vowel is asked (ten asked values tried). 100%, by construction; if it is not 100% the picker is not agnostic.
2. Plain sources, bass: in each of the eight cases, fR1 within the bar on at least 90% of plain takes, and fR2 on at least 80%.
3. Plain sources, treble: in each of the five cases, fR1 on at least 80% and fR2 on at least 70%. (Lower, because nothing here was tuned for treble; the review's own treble [ɑ] was 28 of 36, 78%.)
4. Stress variants: reported, no bar, except that the open picker must not do worse than the shipped picker with the right vowel asked on the same takes.
5. Diplophonic and second-pulse sources: no pass bar. The brief says double-pulsed fry fails every picker today. Expectation: both pickers miss at least 25% of such takes.
6. The status must not hide a miss: over all takes, those where the open fR1 is outside 10% yet the status is `captured` are at most 10% of takes.
7. A good take is not demoted: of plain takes at levels 0 and -15 dB, at most 20% are `provisional`.
8. Positive control: the shipped picker, with [i] asked on takes of [ɑ], [u], and [o], reproduces the review's failures (fR1 of [ɑ] right on fewer than 25% of takes; [u] fR2 on fewer than 60%; [o] fR2 on fewer than 40%). If it does not, the generator is too kind and nothing here proves anything.

**What I expect to fail, said now:** the diplophonic sources (5); possibly fR2 on [i] where R2 and R3 are close; treble [i] fR2 at 2700 Hz, which is under the 3000 Hz ceiling but near it.

**Tuning.** The picker's thresholds (12% match, 1.5 dB, 8 dB, 125 Hz, 6 peaks) are the brief's illustrative values. If a bar fails I may change a threshold on this set; every change and its reason goes in this report, and the bars above do not move.
