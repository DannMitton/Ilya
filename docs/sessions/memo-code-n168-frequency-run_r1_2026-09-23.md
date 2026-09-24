# MEMO. N.168 step 2: the frequency run

**Written by Claude Code, 2026-09-23, on branch `Shane` at `b1f58c8`, working tree dirty with this run's files only.** Answers `brief-code-n168-frequency-run_r1_2026-09-23.md`. The tables are in `tools/n168-frequency-run/out/frequency-run.md` and `.csv`.

The run is WRITTEN. It is DONE when you have seen the tables.

## What was built

1. **`packages/score-parser/src/conditions.ts`**, with `conditions.test.ts` (18 tests, each value hand-traced in its comment). `noteConditions(parsed, profile, analyzedEvents, options)` returns one record per sung note. Each record carries the overlay's fR1 band, passaggio, range status, sustained ceiling exposure, and vowel, plus held or short, the fR1 rung, the fR2 rung, the approach, the phrase, and the cumulative phonation at the note's onset. It adds only. No existing type or output changed, and `reconciliation/` was not touched.
2. **Two additive edits to existing files.** `overlay-engine.ts:131` now exports `CROSSING_TOLERANCE_CENTS`, so the rungs read the same 50 cents rather than a copy. `index.ts` exports the new module.
3. **`tools/n168-frequency-run/`**: the run (`frequency-run.run.ts`) and its vitest config. It runs under `apps/web`'s own vitest 4.1.6, because the vowel resolver needs `$lib`. It lives outside `apps/web/src` on purpose. A skipped test inside that glob would change the web-test gate's count string. Run it from the repository root:

```bash
pnpm --filter @ilya/web exec vitest run --config ../../tools/n168-frequency-run/vitest.config.ts
```

It takes about 3 seconds. It reads each `.musx` through the product's own denigma WASM in Node, reusing `tools/e16-harness/src/denigma-convert.ts`, and parses the MNX with `MnxScoreParser`, which is the app's `.musx` path. Nothing from the scores is written to disk: the conversion stays in memory, and the outputs hold counts and seconds only.

**The real dictionary is loaded, not inferred stress.** The run injects the dictionary the way `loader.ts:585` does: both shards, the singer supplement, the blurb data, and the homograph tier (943,106 headwords). A positive control stops the run unless `processText` reports a `dictionary` stress source. Without this step, vitest runs the pipeline in inference mode, and the vowels would differ.

**The chain per song follows `InsightsPane.svelte:106-123`.** It takes the reading octave for the low voice, runs `buildUnderlayResolvers` on verse 1 of the reading score, and analyzes the performance-order score. There is one departure, covered in the next section.

## An app defect found on the way: `.musx` treble-8vb lines read an octave low

`resolveVocalReadingOctave` returns the clef's own shift for a non-MusicXML source (`packages/score-parser/src/vocal-octave.ts:60`). The MNX that denigma produces already stores sounding pitch. Sunless 02 is stored A2 to E♭4, the span Mitton (2020, p. 92) gives, as quoted at `vocal-octave.ts:57`. The app shifts it to A1 to E♭3. Sunless 03, 05, and 06 have the same clef and the same error. The comment at `:58-59` already flags the MNX convention as not established. This run establishes it for denigma output, for these four files.

**Fixed later the same session, on your ruling (2026-09-23): denigma MNX only.** `vocal-octave.ts` now returns 0 for a marked octave clef when `origin` is `denigma-mnx-from-musx`, as it already did for MusicXML. MNX uploaded as MNX keeps the shift, and its convention is NOT ESTABLISHED. The run's workaround is gone: it now calls the app's own function, and the output CSV is byte-identical to the workaround run. Two tests were added to `vocal-octave.test.ts`, so score-parser moves to 599 passed, 5 skipped (604).

## The gates

| Gate | At `b1f58c8`, before | After |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216) |
| dictionary | 235 passed (235) | 235 passed (235) |
| web-check | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files |
| web-test | 1396 passed (1396) | 1396 passed (1396) |
| score-parser | 579 passed, 5 skipped (584) | **597 passed, 5 skipped (602)** |

The baseline measured at HEAD matches `~/Downloads/ilya-ship.sh:76-80`. **Score-parser moves by 18, which is exactly the count of new tests in `conditions.test.ts`.** The ship script refuses until line 80 reads `gate 5 score-parser "597 passed | 5 skipped (602)"`. That move needs your permission. `tsc --noEmit` on `packages/score-parser` is clean.

## Each song's read status

All sixteen were read from `.musx`. None needed the `score.mxl` fallback.

| Song | Bars read | Bars untrusted | Tempo | Notes with a vowel | Parse warnings |
|---|---|---|---|---|---|
| Sunless 01 | 18 | 0 | stated, 82 | 96 of 96 | none |
| Sunless 02 | 12 | 0 | stated, 120 | 68 of 68 | none |
| Sunless 03 | 41 | 0 | stated, 98 (2 markings) | 222 of 222 | 1, `measure-duration-mismatch` |
| Sunless 04 | 29 | 0 | stated, half = 38 (2 markings) | 116 of 116 | none |
| Sunless 05 | 61 | 0 | stated, 108 (3 markings) | 255 of 258 | none |
| Sunless 06 | 55 | 0 | stated, 120 | 124 of 161 | none |
| Kabalevsky T01 | 67 | 0 | stated, 63 (3 markings) | 149 of 152 | none |
| Kabalevsky T02 | 70 | 0 | stated, 72 (2 markings) | 156 of 157 | none |
| Kabalevsky T03 | 52 | 0 | stated, quaver = 104 | 156 of 157 | none |
| Kabalevsky T04 | 39 | 0 | stated, 50 (3 markings) | 151 of 151 | none |
| Kabalevsky T05 | 90 | 0 | stated, 96 (3 markings) | 159 of 160 | 5, `unrecognised-element` |
| Kabalevsky T06 | 37 | 0 | stated, 80 (2 markings) | 152 of 153 | none |
| Kabalevsky T07 | 53 | 0 | stated, dotted crotchet = 56 (2 markings) | 163 of 163 | none |
| Kabalevsky T08 | 32 | 0 | stated, 66 | 154 of 154 | none |
| Kabalevsky T09 | 39 | 0 | stated, 84 | 147 of 149 | none |
| Kabalevsky T10 | 83 | 0 | stated, dotted minim = 56 | 155 of 156 | none |

Every tempo is a metronome value encoded in the file. No song needed an inferred tempo or the quaver fallback, so every weight is in seconds. All sixteen are as written: no repeats or jumps to unfold. The full table, with clef, octave shift, sung span, phrase count, and boundary kinds per song, is in the output.

## Every desk default applied, and the calls this memo adds

From the brief:

1. The module sits in `packages/score-parser/src/conditions.ts`, with a test file.
2. fR2 rungs run from n = 1 to 8. No song reached n = 1 or 2 for the low voice, and n = 8 still holds 3.3 percent of sung time, so the top rung may be worth raising. That is your call.
3. A rest does not reset the previous note, and `afterRest` flags the note.
4. A phrase ends at a breath mark, a caesura, or a rest. Across the sixteen songs these fired: rest 184, silence 20, breath mark 16, caesura 0, end of line 3.
5. Godin's fR1 is the midpoint of each printed band, taken in pitch. The band starts at its lower edge, and the midpoint is 50 cents above it: G4 for [i] and [u], A4 + 50 cents for [ɪ], [o], and [e], E5 + 50 cents for [ɛ], [ʌ], and [ɑ], G5 + 50 cents for [a].
6. For the treble voice, the songs go up an octave with `transposeScore(+12)` from the low voice's reading.
7. Seconds follow `secondsFor`'s arithmetic, so they use the first stated tempo. Nine songs state more than one distinct tempo, and later changes do not reach the weights.

Added in this run, each a JUDGEMENT:

8. **Silence ends a phrase.** In some songs, empty interlude bars carry no rest event. Without this call, a phrase would run straight across an interlude. It fired 20 times.
9. **A tied continuation gets its own approach band, `tie`.** Counting it as `repeated` would have added 97 notes to repeated notes that are not re-attacked.
10. **Held or short is read over the whole tie chain,** using `isLongSustain` on one event that spans the chain. The overlay's per-event reading finds 14 held notes (3.2 percent of sung time). The chain reading finds 45 (6.3 percent). Both are in the dimension table, and the regions use the chain reading.
11. **Phrase-length bands** break at 2, 4, 6, 8, and 12 s. **Position-in-piece bands** break at 30, 60, 90, 120, and 180 s, plus the song split in thirds.
12. **Sounding length per note** follows each bar's arbitrated reading from `aggregatePhonation`, computed on the notated score (`barsFrom`). In a performance-order score, a repeated bar would sum to twice its metre.

## NOT ESTABLISHED

- **Mitton's passaggi.** No primo or secondo for Mitton exists in the tree. The search covered `apps/`, `packages/`, `docs/memory/`, and every `.json`. `demo-fixture.ts:65` holds a demo bass profile, not Mitton's. Passaggio is not assessed for either voice.
- **Whether 120 bpm in Sunless 02 and 06 is printed or is Finale's default playback tempo.** Both files state exactly 120 and nothing else. If it is the default, those two songs' seconds are wrong, 103 s between them.
- **Phrase length is notational.** A breath the singer takes with no rest or mark in the score is invisible. Kabalevsky T08 has 5 phrases in 104.5 s, and 41.3 percent of all sung time sits in notated phrases of 12 s or more. Read the phrase-length dimension as "time between notated breaks", not as breath length.
- **Why 50 notes resolve no vowel.** 37 of them are in Sunless 06. The resolver withholds words honestly rather than guessing. Two patterns show: several words hold two syllables on one note joined by a non-breaking space, and reflexive verbs ending in `-тся` or `-ться` fail in seven Kabalevsky songs and in Sunless 05. The cause was not traced.
- **What the `T` prefix on the Kabalevsky files means.** Not guessed.
- **Whether the per-note seconds should follow tempo changes.** The brief ties them to `secondsFor`, which reads the first tempo. The per-event held test reads the tempo in force, so the two can disagree at a tempo change.
- **The Sunless 03 `measure-duration-mismatch` warning.** Its bar was not identified. It produced one silence boundary, which may be an artifact.
- **Whether `fit-acoustic-framework_2026-07-20.md` matches the values used.** It is not in the repository or in `~/Documents`. The Mitton range (A2 to E4) and Godin's bands come from the brief, not from the document.

## Files for `git add`

- `packages/score-parser/src/conditions.ts`
- `packages/score-parser/src/conditions.test.ts`
- `tools/n168-frequency-run/frequency-run.run.ts`
- `tools/n168-frequency-run/vitest.config.ts`
- `tools/n168-frequency-run/out/frequency-run.md`
- `tools/n168-frequency-run/out/frequency-run.csv`
- `docs/sessions/memo-code-n168-frequency-run_r1_2026-09-23.md`

Modified: `packages/score-parser/src/index.ts` and `packages/score-parser/src/overlay-engine.ts`. The brief itself, `docs/sessions/brief-code-n168-frequency-run_r1_2026-09-23.md`, was already untracked.

## Addendum, 2026-09-23: Mitton's passaggi

**Written by Claude Code on branch `Shane` at `10e090c`. The working tree was dirty with `docs/memory/STATE.md` and this addendum's brief, both untouched.** Answers `brief-code-n168-passaggio_r1_2026-09-23.md`.

### The change

The Mitton profile in `frequency-run.run.ts` now carries `passaggio: { primo: A♭3, secondo: D♭4 }`. Godin still has none. The comment beside the values cites Mitton (2020), §3.2.2, Table 3.1, printed p. 30 (Miller's lyric bass values), and §3.5, p. 35. It says the values are generic, a published value for the voice category, and not measured from your voice.

I checked the citation against the PDF in `~/Downloads`. Table 3.1 on printed p. 30 lists lyric bass at A♭3 and D♭4. The §3.5 sentence on p. 35 reads as the brief quotes it. The table points to §1.5 for pitch notation, which is scientific pitch notation with middle C as C4. That matches the engine's `Pitch`, so A♭3 is 207.7 Hz and D♭4 is 277.2 Hz, with no octave conversion. The band is inclusive at both ends (`overlay-engine.ts:186`).

Nothing in `packages/` or `apps/` changed.

### The gates

| Gate | Before | After |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216) |
| dictionary | 235 passed (235) | 235 passed (235) |
| web-check | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files |
| web-test | 1396 passed (1396) | 1396 passed (1396) |
| score-parser | 599 passed, 5 skipped (604) | 599 passed, 5 skipped (604) |

The baseline matches `~/Downloads/ilya-ship.sh:76-80`. No gate moved.

### Passaggio shares, Mitton

| Band | Share of sung time | Seconds | Notes | Songs |
|---|---|---|---|---|
| inside | 44.7% | 623.7 | 1061 | 16 |
| outside | 53.6% | 747.8 | 1362 | 16 |
| not assessed | 1.8% | 24.6 | 50 | 9 |

The 50 notes that are not assessed are the 50 notes that resolve no vowel. The overlay engine skips a note with no operative vowel before it computes passaggio (`overlay-engine.ts:164`), so those notes get no reading. Every song has time inside the band.

Godin's tables are byte-for-byte unchanged.

### How the regions changed

- The region key gained a sixth part, passaggio. Distinct regions rose from 125 to 171.
- The top 40 now hold 68.5 percent of sung time, down from 82.2 percent. The same time is split across more regions.
- The old leader, open × ɑ × short × step × in-range at 9.8 percent, splits into outside (5.4 percent, still first) and inside (4.4 percent, second).
- Upward leaps on [ɑ] land mostly inside the band: inside is 3.5 percent (fourth), and outside is 1.0 percent (35th). Before the split, this region was fourth at 4.5 percent.
- Stepwise [u] and upward leaps on [u] and [i] also lean inside. Stepwise [o], repeated [ɑ], downward leaps on [ɑ], and [ɨ] and [ɪ] lean outside.

### Per-piece zones

The runner does not report them. It has one passaggio dimension across all sixteen songs, with inside and outside only. It does not split "outside" into below and above, and it has no per-song passaggio table. I did not add one, because the brief made it conditional on the runner.

## NOT ESTABLISHED (addendum)

- **How "outside" divides into below A♭3 and above D♭4.** `NoteCondition.inPassaggio` is a boolean, so the runner cannot tell them apart without a new field or a pitch comparison in the runner.
- **Per-song passaggio shares.** Not computed.
