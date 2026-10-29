# Brief: N.135 stage 2b r5, step 10, Sunless 1's last two bars as printed (desk, 2026-10-29, r2)

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

## Amendments, applied (r2, desk, 2026-10-29 13:1x). Where this section and anything above it differ, this section wins.

The Opus review standing in for Fable (`review-opus-brief-step10_r1_2026-10-29.md`, verdict SEND WITH AMENDMENTS, 6) is applied in full below, verbatim from its "Amendments" section, with one desk choice. Its tuplet, beam, and `UNREPAIRED` citations were re-read by the desk at `3fa4a218` before applying.

**Desk choice on amendment 4 (DESK DEFAULT):** `replace-seat.test.ts` stays on the copy `sunless-01-finale-lone-v.musicxml`; its subject is an added note, and the copy keeps the eighth `m17-5-8` it splits. Do not re-target it.

## Amendments

### 1. Bar 17's two halves are a 2:3 tuplet. The brief does not say so.

Evidence: fixture lines 1888 to 1893 and 1912 to 1917 carry `<time-modification><actual-notes>2</actual-notes><normal-notes>3</normal-notes>` and `<tuplet number="1" type="start"/>` and `type="stop"`. The `.bak` has the same at lines 1888 and 1912. The parser reads the tuplet into `duration.tuplet` (`packages/score-parser/src/musicxml-parser.ts:747-754`). The approved parsed score holds it at lines 5075 and 5127, and the approved SVG has one `tuplet="2"` bracket. Code would face a half note marked as a duplet and have to decide what to do with the marking.

In section 1, after "**half at 3/4, half at 5/4**", insert:

> (each `<duration>32</duration>`, `<type>half</type>`, with a 2:3 `<time-modification>` and a `<tuplet>` start or stop in `<notations>`, fixture lines 1888 to 1917)

Add this to section 2 item 1:

> In bar 17, each of the two notes at 3/4 and 9/8 becomes `<duration>24</duration>`, `<type>quarter</type>`, `<dot/>`. Remove its `<time-modification>`, and remove its `<notations>` element, which holds only the `<tuplet>`. The print's dotted quarters in 12/8 are not a tuplet.

### 2. The file holds no beams. "Beams as the converter writes them" names nothing.

Evidence: `grep -c '<beam'` on the fixture returns 0, and so does `<stem`. The converter is `musx2mxl 0.2.9` (fixture line 10).

In section 2 item 1, replace "beams as the converter writes them for the same values elsewhere in the file," with:

> no `<beam>` or `<stem>` (the file has none anywhere; the renderer beams by itself),

### 3. The bar 17 and 18 exemption is a `Set`, not an allow-list entry, and three tests use it.

Evidence: `fixture-rule.test.ts:319` reads `const UNREPAIRED = new Set([17, 18]);`. The `Set` is used at lines 325, 333, 345, and 350. Line 331 pins `toHaveLength(97)`. Line 350 filters the copy's comparison through `UNREPAIRED`. `ALLOWED` (line 105 on) has no bar 17 or 18 entry. `SHIFTED_READERS` (line 102) and the `LONE_V` reason at line 114 say "Re-point them when the tail is repaired."

Replace the last sentence of section 2 item 2 with:

> In `fixture-rule.test.ts`, delete `UNREPAIRED` (line 319) and its filters at 325, 333, and 345. Rewrite the test at 329 to 333 as 96 extract notes, 96 fixture notes, and no difference. At line 350, keep the copy's check and drop only the filter (the copy has more than 50 differences either way). Rewrite `SHIFTED_READERS` and the `LONE_V` reason at line 114 to name only the readers that stay on the copy, and drop the words "while its bars 17 and 18 are unrepaired". The comparison then runs on every bar.

### 4. Section 2 item 3 does not name the 13 files, and `replace-seat.test.ts` depends on N.156's eighth.

Evidence: `replace-seat.test.ts:10-12` and lines 68 to 70 split `m17-5-8`, «я.» as an eighth (`<duration>8</duration>` to `4`), and line 197 pins `m17-5-8`. After the change, the main fixture has no `m17-5-8`. «я.» becomes `m17-1-2` with duration 16, so `editNote(xml, at('m17-5-8'), ...)` finds nothing. Other dependencies: `punctuation-slot.test.ts:78-83` has an N.156 branch, "a cell short", that the repaired file will no longer take. `score-seat.test.ts:64` reads "whole since N.156". Step 8's report lists 11 items, with `row108.support.ts` standing for 3 more (report lines 24 and 60). It never states which 13.

After item 3's first sentence, insert:

> The files are: `score/score-seat.test.ts`, `score/punctuation-slot.test.ts`, `score/seated-text.test.ts`, `score/waiting-seat.test.ts`, `score/replace-seat.test.ts`, `text/lay-out-seat.test.ts`, `text/break-text.test.ts`, `typed-hyphens.test.ts` (its `load` calls at lines 281, 287, 316, 340, and 370), `score/row108.support.ts` `SUNLESS` (read by `text/relining.test.ts`, `score/several-lines.test.ts`, and `score/phrase-ends.test.ts`), and `e2e-phone/relining.test.ts`. `clitic-seat.test.ts` stays on the copy (N.111's lone «в»). `replace-seat.test.ts` splits the eighth `m17-5-8`, which the repaired file no longer has. Either keep it on the copy (its subject is an added note, not the eighth) or re-target its split to `m17-1-2`, a quarter, as two eighths. Report which you chose and why; this is a DESK DEFAULT. Where a comment or branch names N.156's split (`punctuation-slot.test.ts:78-83`, `score-seat.test.ts:64`), say whether it still holds on the main fixture.

### 5. Section 4's list leaves out files that read the main fixture.

Evidence: grep for `sunless-01-engraved` outside `docs/` turns up these readers, which section 4 does not name. Unit tests: `old-spelling.test.ts:141`, `score/correction.test.ts:538`, `score/loupe-render.test.ts:25` (pins 18 measures at line 97 and, for every measure, `stuck` `['head>a']` and `minGap` within 0.5 of 38.18 at lines 98 to 103, which bar 17's new spacing may move), `tempo/tempo.test.ts:129`, `text/break-here.test.ts:51`, `approval/staff-renderer-real-fixture.approval.test.ts:66`, and `packages/score-parser/src/approval/musicxml-parser.approval.test.ts:140`. Playwright: `e2e-phone/input-views.test.ts:26`, `e2e-phone/loupe-scan.test.ts:43`, `e2e-phone/text-witness.test.ts:128`, and `e2e/insights-page`, `markup-pages-lose-no-bars`, `octave-line` (line 35), `pages-without-gaps`, `print-pages`, `singer-paths`, and `tempo`.

At the end of section 4, add:

> Also read the main fixture, and run: `old-spelling.test.ts`, `score/correction.test.ts`, `score/loupe-render.test.ts` (watch its per-measure `minGap` on measure index 16), `tempo/tempo.test.ts`, `text/break-here.test.ts`, and both approval tests. Run the Playwright files that read it, as step 8 did: `e2e-phone/input-views`, `loupe-scan`, `text-witness`, `relining`, and `e2e/insights-page`, `markup-pages-lose-no-bars`, `octave-line`, `pages-without-gaps`, `print-pages`, `singer-paths`, and `tempo`. Step 8's baseline: `insights-page` and `print-pages` fail on the original too, and `singer-paths` fails one French heading. Report any change from that baseline.

### 6. Section 2 item 5 and item 6 need to expect the tuplet and the md5.

Evidence: step 8's report (line 8) found no duration field in its parsed-score diff. This step changes durations, `base`, `dots`, and `tuplet` on two notes, and it changes the ids `m16-5-4` to `m16-9-8` and `m17-5-8` to none. The warnings file at `packages/score-parser/src/approval/__approved__/sunless-01-engraved.warnings.json` holds exactly the two warnings the brief expects to go.

Append to item 5:

> Expect in the parsed score: bar 17's last two notes change `base`, `dots`, `fraction`, and lose `tuplet`; ids `m16-5-4` and `m17-5-8` go and `m16-9-8` arrives; bar 18's third note becomes a quarter. Expect in the SVG: the one `tuplet="2"` bracket goes. Expect the warnings file to become `[]`. Any other moved field is a finding: report it and stop.

Append to item 6:

> Give the new md5.

