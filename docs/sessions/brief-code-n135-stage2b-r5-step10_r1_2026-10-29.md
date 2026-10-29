# Brief: N.135 stage 2b r5, step 10, Sunless 1's last two bars as printed (desk, 2026-10-29, r1)

For the cloud session on `cloud-lane-21`, on top of step 9 (`3fa4a218`). One commit and one report, then stop. The rule it serves is `CONTRACT.md` §0.1 (one vowel per note; the print decides). Everything in brief r2 of steps 5 to 9 that this brief does not change still holds, except the line "never a note" for these two bars of this one file.

## 0. Why

Step 8 repaired `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` on bars 2 to 16 and bar 17's first two notes, under the desk's ruling (a), and left bars 17 and 18 (report step 8, "The answer first", item 1). The fixture now opens «о» twice, reads 40 words and 97 slots against the print's 39 and 96, and 13 test files read the kept original instead. Ruling (a)'s reason was to keep the N.156 «я.» eighth for `clitic-seat.test.ts`; step 8 kept the original byte for byte as `sunless-01-finale-lone-v.musicxml`, and `clitic-seat.test.ts` reads that copy, so the main fixture no longer needs to depart from the print. **DESK DEFAULT 2026-10-29 12:4x, replacing ruling (a): bars 17 and 18 of the main fixture take the print's notes and words.**

## 1. The print's bars 17 and 18 (read by the desk 2026-10-29 12:4x)

Source: `tools/e16-harness/output/truth/mussorgsky_sunless-01_within-four-walls.truth.json` on Dann's Mac (untracked, read from the musx by Ilya's parser, 0 warnings), verse 1, `measureIndex` 16 and 17. Bars are 3/2 (`measureDurations`, indices 16 and 17: 3/2).

| bar | onset | duration | MIDI | verse 1 | syllabic |
|---|---|---|---|---|---|
| 17 | 0 | 1/2 (half) | 52 | ночь | single |
| 17 | 1/2 | 1/4 (quarter rest) | | | |
| 17 | 3/4 | 3/8 (dotted quarter) | 52 | о | begin |
| 17 | 9/8 | 3/8 (dotted quarter) | 52 | ди | middle |
| 18 | 0 | 3/8 (dotted quarter) | 54 | но | middle |
| 18 | 3/8 | 1/8 (eighth) | 50 | ка | middle |
| 18 | 1/2 | 1/4 (quarter) | 50 | я. | end |
| 18 | 3/4 | 1/2 (half rest) | | | |
| 18 | 5/4 | 1/4 (quarter rest) | | | |

Verse 2 (IPA) for the six notes, from the tracked extract `fixtures/truth-sunless-01-underlay_2026-10-29.json`: `notʃʲ` single, `ɑ` start, `dʲi` middle, `ˈno` middle, `kɑ` middle, `jɑ` end (write `start` as `begin`).

What the fixture holds today (read by the desk on `3fa4a218`): bar 17 half at 0, quarter rest at 1/2, **half at 3/4, half at 5/4** (the bar runs to 7/4; this is the parser's existing warning "Measure 16 content lasts 7/4 whole notes against an expected 3/2"); bar 18 dotted quarter at 0, eighth at 3/8, **eighth at 1/2, eighth at 5/8** (N.156's split), then half rest and quarter rest. Bar 18 before N.156 (`sunless-01-engraved.musicxml.bak-before-ja-2026-09-20`) already has the print's rhythm: dotted quarter, eighth, quarter.

## 2. What to change

1. In the main fixture only, rewrite the voice part's bars 17 and 18 to the table in section 1: durations, `<type>`, `<dot/>`, beams as the converter writes them for the same values elsewhere in the file, lyrics verses 1 and 2. Pitches stay as they are (they already agree). Change nothing in the piano part, nothing in any other bar, and nothing in the copy or the `.bak` file.
2. Then the main fixture must hold 96 voice notes, equal the extract note for note on every bar (bar, onset, pitch, both verses' text and syllabic), pass one vowel per note, and parse with neither the 7/4 warning nor step 8's interrupted-word warning. Remove the bars 17 and 18 allow-list entry from `fixture-rule.test.ts`; the comparison then runs on every bar.
3. For each of the 13 test files step 8 pointed at the copy (report step 8, "Pointed at the copy"): point it back at the main fixture, run it, and for each expectation that changes, say what it pinned, what it pins now, and that the new value matches the extract. Where a test exists for something only the copy holds (the lone «в», the lone `#`, N.156's «я.» eighth), it stays on the copy; say which and why.
4. `typed-words-land.test.ts`: re-run the 62-window sweep on the main fixture and report LIMITS 1, 2, and 3 and step 8's two siblings as they stand.
5. Re-approve the fixture's approved files (`apps/web/src/lib/approval/__approved__/sunless-01-engraved.primitive.svg`, `packages/score-parser/src/approval/__approved__/sunless-01-engraved.parsed-score.json` and `.warnings.json`) with `vitest -u`; show each diff's size and say what moved. The 97 plain noteheads become 96; say which notehead went and that the rest keep their pitch sequence.
6. Add a dated line to `sunless-01-engraved.musicxml.provenance.md` for this edit.

## 3. What may not change

The reader (`apps/web/src/lib/omr/`), seating code, the copy `sunless-01-finale-lone-v.musicxml`, the `.bak` file, any other fixture, any note of the main fixture outside bars 17 and 18.

## 4. Cross-site line (`CONTRACT.md` §4)

This brief changes no computation. It changes a fixture that many tests read; the list is step 8's 13 files plus `fixture-rule.test.ts`, `diction-fold-live.test.ts`, `typed-words-land.test.ts`, `glue-typed-marks.test.ts` (step 9's placement test reads the main fixture's text), and the approval tests. Run all of them.

## 5. Gates

All eight, as in brief r2 section 8, with their figures in the report. Gate 4 will move; say by how much and why.

## 6. Report

`docs/sessions/report-code-n135-stage2b-r5-step10_r1_2026-10-29.md` on the lane: the answer first, then each item of section 2, then NOT ESTABLISHED. Push to `cloud-lane-21`, never `Shane` or `main`, and stop.

## 7. What you could not establish

Say it. NOT ESTABLISHED beats a complete invented answer.
