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

## Addendum 2, 2026-09-24: six test voices

**Written by Claude Code on branch `Shane` at `6e0ab97`.** Answers `brief-code-n168-six-voices_r1_2026-09-24.md`. At the start the working tree was dirty with `docs/memory/PRODUCT.md` and the untracked brief. During the session, `docs/memory/STATE.md` and `docs/sessions/LOG.md` changed and the brief was staged. I did not touch any of those four.

The run is WRITTEN. It is DONE when you have seen the tables.

### What changed

Only the runner, `tools/n168-frequency-run/frequency-run.run.ts`, and its outputs. Nothing in `packages/` or `apps/` changed. `CORE_BANDS` (`plausibility.ts:50`) is not exported, so the runner copies it value for value. A positive control, `bozemanControl`, checks every copied band against the live `checkPlausibility` window before the run starts, so drift in the app stops the run. No export was needed. `expectedF1` and `checkPlausibility` are imported from `$lib` as they stand.

The run command has not changed and takes about 3 seconds:

```bash
pnpm --filter @ilya/web exec vitest run --config ../../tools/n168-frequency-run/vitest.config.ts
```

New outputs in `tools/n168-frequency-run/out/`:

- `frequency-run.md` and `.csv`, regenerated for eight voices. They add a voices table, a transposition table, a three-way passaggio dimension, and the P1a counts. Every row from the previous run is present and unchanged, which the diff of the old and new CSV confirmed. Mitton and Godin gained only the three-way passaggio rows.
- `notes-<voice>.csv`, eight files of 2,473 rows each, one row per sung note, with the columns the brief lists plus `shift`, `midi`, `fR1_source`, `p1a_near`, `p1a_fires`, and `p1a_clauses`. There is no lyric text.
- `p1a-counts.csv`.

### The six voices

| Voice | fR1 source | Range (McKinney floor, two octaves up) | Primo, secondo (Miller) |
|---|---|---|---|
| Bass | Bozeman bass | F2 to F4 | A3, D4 (p. 117, basso cantante) |
| Baritone | Bozeman baritone | A♭2 to A♭4 | B3, E4 (p. 117, baritono lirico) |
| Tenor | Bozeman tenor-mezzo | C3 to C5 | D4, G4 (p. 117, tenore lirico) |
| Contralto | Bozeman tenor-mezzo, **stand-in** | G3 to G5 | G4, D5 (p. 135, Figure 10.3) |
| Mezzo | Bozeman tenor-mezzo | A3 to A5 | E4, E5 (p. 135, Figure 10.2) |
| Soprano | Bozeman soprano | C4 to C6 | E♭4, F♯5 (p. 134, Figure 10.1) |

The fR1 values per vowel, in Hz, are in the output's "Voices" table. [ɪ], [ɨ], [ʌ], and [a] are derived by `expectedF1` and marked "derived" in the per-note CSV and "d" in the table. The contralto's rows carry "(stand-in)" in `fR1_source`.

**I checked Miller against the page.** I rendered printed pp. 117, 134, and 135 (PDF pp. 138, 155, and 156). All six passaggi match the brief. Two points disagree with the extraction CSV (`_extraction/claims_millers_2026-09-23.csv`), which was read from a garbled text layer:

- **RMR-024:** the page prints basso cantante's secondo as D4. The CSV brackets D4 as inferred.
- **RMR-041:** the mezzo's secondo arrow lands on E5, the top of upper middle, with F5 in parentheses. The CSV's "F5 (F♯5)" is the start of the Upper zone, not the passaggio.

I did not edit the CSV. It sits outside the repository and belongs to the archivist.

**Miller and McKinney compared.** McKinney 1994 Figure 5, as you verified it, sits a semitone below Miller's secondo for five of the six voices:

| Voice | Miller secondo | McKinney Figure 5 |
|---|---|---|
| Bass | D4 | D♭4 (first series) |
| Baritone | E4 | E♭4 (first series) |
| Tenor | G4 | G♭4 (first series) |
| Contralto | D5 | D♭5 (second series) |
| Mezzo | E5 | E♭5 (second series) |
| Soprano | F♯5 | G♭5 (second series), the same pitch |

The run uses Miller.

### Transposition

`suggestTranspositions` (`transposition.ts:347`) does not fit this job. It counts notes rather than time, searches only ±6 semitones, and returns nothing when the file's key already fits. The runner searches every shift from −12 to +24 and keeps the one with the most sung time in range.

Every voice reaches 100 percent of time in range on every song, so the tie-break decides the key. The first tie-break I tried was the smaller move. It left the bass, the baritone, and the tenor in the file's key for most songs, which put the tenor at the bottom of its range, where it almost never reached G4. The run now uses a second tie-break: the shift whose time-weighted mean pitch sits nearest the middle of the range. The resulting shifts:

| Voice | Shifts across the sixteen songs |
|---|---|
| Bass | −1 to −3 |
| Baritone | 0 to +2 |
| Tenor | +4 to +6 |
| Contralto | +11 to +13 |
| Mezzo | +13 to +15 |
| Soprano | +16 to +18 |

The table per song, with the share in range in the file's key, is in the output.

### What the shares show

| Voice | Open | Close | Crossing | Above fR1 | Below primo | Inside | Above secondo |
|---|---|---|---|---|---|---|---|
| Mitton | 65.5% | 32.2% | 0.1% | 0.3% | 50.7% | 45.5% | 3.8% |
| Godin | 8.4% | 59.1% | 3.1% | 20.2% | not assessed | | |
| Bass | 75.7% | 22.6% | none | none | 83.2% | 16.8% | none |
| Baritone | 69.8% | 28.1% | 0.0% | 0.3% | 73.9% | 25.5% | 0.5% |
| Tenor | 51.6% | 44.2% | 0.8% | 1.6% | 63.6% | 35.2% | 1.2% |
| Contralto | 11.2% | 65.7% | 3.8% | 17.6% | 41.6% | 57.2% | 1.2% |
| Mezzo | 4.4% | 64.1% | 5.5% | 24.1% | 6.0% | 92.8% | 1.2% |
| Soprano | 0.3% | 54.4% | 7.2% | 36.3% | 0.2% | 96.8% | 3.1% |

The 1.8 percent missing from each fR1 row is the 50 notes that resolve no vowel. The three-way passaggio is computed from pitch, so it assesses those notes too.

**Miller's female zona di passaggio is wide.** It spans an octave for the mezzo and more than an octave for the soprano. With the song centred in the range, 93 to 97 percent of their sung time falls inside it. For those voices, "inside the passaggio" separates almost nothing. Nearness to either edge is the informative reading.

### Candidate P1a counts

A note counts when it lies within one semitone of the secondo (for a treble voice, also within one semitone of the primo) and at least one clause holds.

| Voice | Near an edge | Fires | Share of sung time | Held | Highest of phrase | Turning pitch 0 to 2 st below | Crossing | fR2 rung |
|---|---|---|---|---|---|---|---|---|
| Mitton | 264 | 188 | 9.7% | 12 | 131 | 15 | 6 | 79 |
| Godin | not assessed (no passaggio) | | | | | | | |
| Bass | 17 | 15 | 1.2% | 6 | 15 | 5 | 0 | 0 |
| Baritone | 51 | 44 | 2.8% | 9 | 36 | 14 | 2 | 0 |
| Tenor | 89 | 68 | 3.8% | 9 | 58 | 12 | 7 | 0 |
| Contralto | 805 | 189 | 9.3% | 22 | 92 | 49 | 57 | 0 |
| Mezzo | 453 | 180 | 7.8% | 9 | 63 | 90 | 34 | 0 |
| Soprano | 244 | 131 | 7.4% | 12 | 119 | 5 | 1 | 0 |

The clause columns can overlap, so they do not sum to the firing count.

**The count depends on the key as much as on the rule.** With the smaller-move tie-break, the counts were: bass 92 (5.0 percent), baritone 18 (1.3 percent), tenor 3 (0.3 percent), contralto 173 (8.8 percent), mezzo 219 (9.0 percent), and soprano 91 (4.9 percent). Mitton does not move, because Mitton stays in the file's key. Known-answer tests built on these CSVs must pin the shift.

Two more points for vetting:

- **The fR2 clause fires only for Mitton**, on 79 of 188 notes, because no other voice has fR2. Mitton's count is not comparable with the six on that clause.
- **"Highest of its phrase" carries most of the male counts.** It is the clause that fires most often for every male voice, and it needs nothing acoustic.

### The gates

| Gate | Before, at `6e0ab97` | After |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216) |
| dictionary | 235 passed (235) | 235 passed (235) |
| web-check | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files |
| web-test | 1396 passed (1396) | 1396 passed (1396) |
| score-parser | 599 passed, 5 skipped (604) | 599 passed, 5 skipped (604) |

The baseline matches `~/Downloads/ilya-ship.sh:76-80`. No gate moved.

### Every desk default applied

From the brief:

1. fR1 is the geometric midpoint of each Bozeman band. Bass routes to bass, baritone to baritone, tenor and mezzo to tenor-mezzo, and soprano to soprano.
2. The contralto uses tenor-mezzo, marked as a stand-in.
3. [ɪ], [ɨ], [ʌ], and [a] come from `expectedF1`, because `derivations.ts` has it. They are marked "derived".
4. There is no fR2 for the six, so the fR2 dimensions read "not assessed".
5. The passaggi are Miller's. The baritone primo is read as B3, not the printed B4.
6. The range floors are McKinney's Figure 3 noteheads, and each ceiling is two octaves above the floor.
7. There is no tessitura.
8. Mitton stays in the file's key.

Added in this run, each reversible:

9. **The search window runs from −12 to +24 semitones.**
10. **The tie-break is the shift whose time-weighted mean pitch sits nearest the middle of the range**, then the smaller move, then downward. The smaller-move counts are reported in "Candidate P1a counts".
11. **Godin keeps her fixed +12.** She has no range to search against.
12. **Every voice transposes from the low voice's reading**: the app's reading octave for Mitton's range. The search spans three octaves, so it absorbs any octave choice.
13. **The search weights come from the file's key.** A note's seconds depend on the notation, not its pitch.
14. **The three-way passaggio is computed from pitch for every sung note**, inclusive at both ends, as in `overlay-engine.ts:186`. The two-way passaggio dimension and the regions still use the engine's `inPassaggio`, so the earlier tables are unchanged.
15. **Beats are counted in the unit of the time signature's lower number**, starting at 1.
16. **"Highest of its phrase" includes ties.** Every note that reaches the phrase's top pitch counts, including tied continuations.
17. **The treble voices for P1a are Godin, contralto, mezzo, and soprano.** Godin has no passaggio, so she is not assessed.
18. **"Turning pitch within two semitones below it"** means the note sits 0 to 2 semitones above fR1 / 2, measured from the exact frequency, not from the rounded turning pitch in the CSV.
19. **"Held" is the tie-chain reading**, `NoteCondition.held`, the one the regions use.
20. **"An fR2 rung" is any rung from n = 1 to 8.**
21. **The per-note CSVs are committed, by your ruling of 2026-09-24.** They carry every note's pitch, bar, beat, and length, which is enough to rebuild each vocal line, and the repository is public. You ruled that scholarly fair dealing in Canada covers them, because Ilya is free, open source, and non-commercial.

### NOT ESTABLISHED

- **Whether a singer of each type would choose the key this run chose.** No published high-voice or low-voice edition was consulted. Centring the mean in a two-octave range is a proxy, and the P1a counts move with it.
- **Whether the derivation ratios hold for other voices.** The four ratios in `expectedF1` (1.365, 1.0315, the identity for [ʌ], and 1.15) come from Mitton's one voice. `gaps_pass01.md` records no study of vowel-to-vowel ratios across voices (E22).
- **How far a real singer's fR1 sits from the Bozeman midpoint.** The bands are two to seven semitones wide. A real voice anywhere in a band would move its turning pitch, crossings, and rungs by up to half that width.
- **The contralto's resonances.** Bozeman charts no contralto, and the tenor-mezzo bands stand in.
- **The two-octave ceilings.** They are computed from McKinney's interval, not printed. The Sonnet memo records Figure 3's upper noteheads as not independently legible.
- **The effect of Miller's parenthesised alternates.** These are the mezzo's F4 and F5, the contralto's A♭4, and the soprano's C♯6 in the upper zone. They are unused and not measured.
- **Which source should anchor P1a: Miller or McKinney.** They differ by a semitone for five of the six voices. The run used Miller only.
- **Type checking of the runner.** No gate type-checks `tools/n168-frequency-run/`. Vitest transpiles it without checking types.
- **The extraction CSV corrections.** RMR-024 and RMR-041 disagree with the page as described in "The six voices". Whether and when the archivist corrects them is open.

### Files for `git add`

- `tools/n168-frequency-run/frequency-run.run.ts` (modified)
- `tools/n168-frequency-run/out/frequency-run.md` (modified)
- `tools/n168-frequency-run/out/frequency-run.csv` (modified)
- `tools/n168-frequency-run/out/p1a-counts.csv` (new)
- `tools/n168-frequency-run/out/notes-baritone.csv`, `notes-bass.csv`, `notes-contralto.csv`, `notes-godin.csv`, `notes-mezzo.csv`, `notes-mitton.csv`, `notes-soprano.csv`, and `notes-tenor.csv` (new, by your ruling on desk default 21)
- `docs/sessions/memo-code-n168-frequency-run_r1_2026-09-23.md` (this addendum)
