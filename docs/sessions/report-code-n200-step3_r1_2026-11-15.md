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

---

## RESULT (written after the runs; the section above is unchanged from the pre-registration commit `08a6af4`)

### What was built

- `engine/open-extract.ts` (new): the open picker. No vowel, voice type, or table reaches it; `open-extract.test.ts` pins that by reading its source (no `MITTON`, no word "vowel" in code, no import of plausibility, stand-ins, or voice types) and by asking ten different vowels of one take and getting one reading.
- `chart/measure-switch.ts` (new): `?measure=open`, read in `captureSessionFor` (`chart/stub-switch.ts`) in every build, not development only. It becomes `new LiveCaptureSession('open')`; `live.ts` passes the picker to `runCapture` (`engine/analyze.ts`), which passes it to `grade`, `f1Steadiness`, and the extractor. The old `calibrate-switch.ts` is gone (lane 55), so there is no switch to copy; `stub-switch.ts:14` is the model.
- The picker's name travels: `CalibratedFormant.picker` (`engine/types.ts`, `'open'`, absent for the shipped picker), `TakeRecord.raw.picker` (`takes.ts`), and the recorder's JSON (`picker`, `'shipped'` or `'open'`). The scoring tool has `open` in `PICKERS` and an `_evidence` column per picker.
- `engine/analyze.ts`: `f1Steadiness` takes the picker and is extended to fR2 (`halvesF2`, `spread2`, `steady2`, JUDGEMENT 12%) (item 9). Status under `open` adds the measurement's own evidence to today's (SNR, detector, fR1 split-half): both estimators saw fR1, the comb count is at most six, and no rival for "lowest" is as strong. fR2's `f2Quality` is `clear` only when both estimators saw it, its halves agree, its prominence is at least 3 dB, it is 200 Hz above fR1, and R2 is not merged with R3; otherwise `marginal`; none is `absent` (item 6). There is no check against an expected value of any kind.
- `engine/extract.ts`: `agreement` and the LPC call that only fed it are deleted (item 10). The shipped picker's readings are unchanged (the gate-4 tests that pin them pass). Exports added: `parabolic`; in `closed-phase.ts`, `MIN_BW` and `MAX_BW`.

### The picker's thresholds, and the resolution derived

12% for a pole and an envelope peak to match (fR1 also takes a wider arm, below); 1.5 dB for a matched peak, 3 dB (`PROM_DB`) otherwise; 8 dB under the strongest for the envelope-only fR1; six 3 dB peaks as the comb limit; 3 dB for a rival to fR1. **`RESOLUTION_HZ` = 1000 / `LIFTER_MS` = 125 Hz:** the envelope is the cepstrum liftered at 8 ms (`extract.ts`, `LIFTER_MS`), which smooths away structure finer than 1 / 0.008 s. The 80 Hz margin in `extract.ts` (`:59`, `:85`, `:157`, `:166`) is under that; the shipped picker keeps it.

### The brief's items 1 to 10, as built

1. Two estimators, poles of bandwidth `MIN_BW` to `MAX_BW` and envelope peaks. 2. A resonance qualifies when both see it. 3. fR1 the lowest qualifying pole in 150 to 1200 Hz (value from the closed phase); fR2 the lowest envelope candidate at least 125 Hz above fR1 (value from the envelope). 4. When the closed phase abstains or no pole qualifies: the lowest 3 dB peak within 8 dB of the strongest, marked `single` in `evidence`. 5. **Set-aside:** the 30% set-aside test of the shipped picker is replaced by the match itself: a pole with no envelope peak near it does not qualify (`closedPhaseSetAside` in the open trace means exactly that). 6. R3 is looked for as the next 3 dB peak above fR2; it is `resolved` when 125 Hz or more away with a valley deeper than 3 dB between; unresolved makes `f2Merged` and `marginal`. **A merged R2 and R3 that shows as one peak leaves nothing to compare, so it cannot be marked: not established.** 7. fR2 is the lowest candidate or absent: the picker never skips to a higher peak. **Not separately tested.** 8. The 3000 Hz ceiling is left. 9. Done. 10. Done.

### The synthetic gate: three runs, all reported

Set and bars as pre-registered above (`n200-step3-synthetic-gate-table_2026-11-15.txt` is the final run's per-case table). One run is about 13 to 17 minutes. Before run 1 the picker had been edited twice, both before any run (a garbled line and the rival's definition); none of that was tuned on results.

**Run 1** (the picker as first written; 12% match for all). Bars 1, 2, 3, 6, 7, 8 met (agnostic 720 of 720; bass plain 27 of 27 on fR1 and fR2 in all eight cases; treble [ɑ] 25 of 27, the rest 27 of 27; wrong and captured 20 of 648, 3.1%; plain good-level takes provisional 0 of 234; positive control below). Bar 4 not met on two stress cases (below). **Then the browser run** (next section) read a synthetic [u] of 300 and 800 Hz as fR1 800 on the real path, provisional. The set had missed it. I reproduced it as a unit test (4 of 4 takes failed), then changed the picker.

**Run 2** (30% match for fR1, unconditional; five wide-bandwidth cases added, POST HOC, labelled `W` in the table). **Bar 3 failed:** treble [ɑ] fR1 20 of 27 (74%), because a spurious low pole now matched the source's weak peak near 200 Hz (the 9 misses read 171 to 277 Hz). Bar 7: 9 of 234. I did not keep it.

**Run 3, the picker as committed.** fR1's wider arm (30%) applies only to a peak within 8 dB of the strongest, which the source's peak near 200 Hz is not (8 to 15 dB under, as the review found). Per-bar:

| Bar | Result |
|---|---|
| 1 agnostic | **Met.** 720 of 720 identical across ten asked vowels. |
| 2 bass, plain | **Met.** All eight cases 27 of 27 on fR1 and on fR2. |
| 3 treble, plain | **Met.** [ɑ] 25 of 27 on both; [u], [o], [e], [i] 27 of 27. |
| 4 stress not worse than shipped with the right vowel | **Not met on two cases.** [i] with a second pulse 5 ms after each: open fR1 11 of 27, fR2 12 of 27; shipped (right vowel asked) fR1 7 of 27, fR2 15 of 27: **fR2 worse**. [ɑ] with the second pulse: open 21 and 17 of 27; shipped 27 and 27 of 27: **worse on both**. Met elsewhere: [u] open phase 4 ms (open fR2 25 against 17), [o] open phase 4 ms (27 and 27), [o] room noise (fR1 24 and 24, fR2 23 against 20). |
| 5 double-pulsed fry fails both | **My expectation was partly wrong.** Diplophonic alternation (0.3) did not fail either picker on this generator (open 8 of 9 on one case, all other 9 of 9). The second-pulse takes failed [i] for both pickers (shipped fR1 7 of 27, open 11 of 27) but not [ɑ] for the shipped picker (27 of 27, with the right vowel asked, which is the prior at work). |
| 6 a miss must not read `captured` | **Met**: 21 of 828 takes, 2.5% (bar 10%). **But in the second-pulse cases it is not clean:** of 72 such takes the open picker's fR1 was wrong on 25 and 18 of those 25 still read `captured`. The shipped picker (right vowel asked): wrong on 27, all 27 `captured`. |
| 7 a good take is not demoted | **Met.** 0 of 234 provisional. |
| 8 positive control | **Met.** Shipped picker, [i] asked: [ɑ] 650 fR1 right on 3 of 36, [ɑ] 750 on 2 of 36 (the review: 3 and 2), [u] fR2 on 17 of 36 (the review: 17), [o] fR2 on 12 of 36 (the review: 8). The generator reproduces the review. |

**The comparison that matters for the ruling, measured on this synthetic set:** over all 824 takes with a reading, fR1 outside 10% yet `captured`: open 21 (2.5%), shipped with the right vowel 27 (3.3%), shipped with [i] asked 178 of 500 (36%). fR2 outside 12% yet `clear`: open 5, shipped with the right vowel 30, shipped with [i] asked 117.

**Tuning, listed.** One threshold changed on this set, because the browser run showed a case the set missed: fR1's match gained a wider arm (30% when the peak is within 8 dB of the strongest). No bar moved. The five `W` cases were added after run 1 and are post hoc; they do not enter the bars, and all 36 takes of each pass both pickers (so they would not have caught the [u] 300/800 failure either: what separates it is four formants and a narrower bandwidth, which is the unit test). The 12%, 1.5 dB, 8 dB, 125 Hz, and six-peak values are unchanged and remain illustrative, tuned on one synthetic set.

**What this set cannot say.** It is one generator. Its closed-phase fits are clean, which is why the shipped picker with the right vowel asked scores 27 of 27 almost everywhere. Every real-fry statement is NOT ESTABLISHED until Step 4. A treble voice, real, was not tested; the central vowels [ɨ], [ɪ], [ʌ] were not generated.

### In the browser, on the real path

Chromium (the pre-installed Playwright build, headless; not Chrome on a Mac) on the development server, a fake microphone fed a synthetic fry WAV (`fry-synth`, resonances 300, 800, 2500, 3500 Hz, bandwidths 80, 100, 200, 250, 70 Hz rate), the recorder on, `[i]` asked and `sung=u` stated, once with `?measure=shipped` and once with `?measure=open`. Pictures (looked at): `docs/sessions/pictures-n200-step3/step3-shipped-one-take.png`, `step3-open-one-take.png`.

| | shipped | open (final picker) |
|---|---|---|
| readout in the picture | fR1 300 Hz, fR2 2472 Hz | fR1 300 Hz, fR2 805 Hz |
| status stored | captured, high, `f2Quality` clear | captured, high, `f2Quality` clear, `picker: open` |
| the dot in the chart | at the front, far left (an [i]'s place) | in the back, at the right, inside the [u] zone |
| `takes[0].raw` | no `picker` | `"picker":"open"` |

The recorder JSON of the open take: `asked: i`, `sung: u`, `build: 08a6af48`, `picker: open`, `chosen.method: open`, evidence `fR1: both`, `fR2: both`, comb 3, no rival, R3 at 2472 Hz and resolved. (The generator's resonances are 300 and 800; the shipped picker's 2472 is the R3 peak it was led to by the asked [i].) The scoring tool, run on the same files, shows both pickers side by side.

**The first open run of this step, before the fix above, read fR1 800 and fR2 2473, provisional, and the wizard then also stamped it `implausible` (`CalibrationWizard.svelte:301-302`, which Step 5 removes).** That run is what found the defect.

**Not a defect fixed here, noted:** the evidence dump's `poles[].peak` uses the 12% match only, so the pole at 300 Hz shows `peak: null` although fR1's wider arm accepted it. The evidence is right; the dump's `peak` is not for a pole taken by the wider arm.

### The eight gates after Step 3

462; 248; 0 errors, 12 warnings (5 files); **5760 passed, 1 skipped (5761)** (+9 from 5751: `open-extract.test.ts`); 785, 5 skipped; 178; 159; ratchets OK (813 files). The scoring tool's own tests (not a gate): 9 passed.

### Could not establish

- Any behaviour on real fry. Every number above is synthetic.
- Central vowels ([ɨ], [ɪ], [ɛ]) were not prototyped; [ɛ] and [a] are in the set, [ɨ], [ɪ], [ʌ] are not.
- Whether an R2 and R3 that merge into one peak is ever read as `clear` (item 6): nothing marks it.
- That Chrome on a Mac and a real microphone give what Chromium and a fake microphone gave.
- What the wizard does with an open reading whose fR1 is far from the Bozeman bands: Step 5 is not built, so `plausibility` still demotes it exactly as before (in the browser run below it did).
