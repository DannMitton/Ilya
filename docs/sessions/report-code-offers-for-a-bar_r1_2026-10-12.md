# Report: what Ilya can offer for a bar to confirm (Corrections slice 2, r1, 2026-10-12)

QUEUE row 51, slice 2, from `brief-code-offers-for-a-bar_r2_2026-10-12.md`. The brief was handed over in chat, saved verbatim to `/tmp/briefs/` outside the repository, and is not committed. Cloud lane, branch `cloud-lane-2`. Read at `cloud-lane-2` 9e1af16, which already holds `origin/Shane` 72b564f (checked: ancestor). The tree was clean at the start. Nothing under `docs/memory/` or `apps/web/src/lib/omr/` was touched, and `triplets.ts` was not read for anything but the types and the one-line `compound`.

## Section 3: measured before the module

**Order, stated plainly.** I ran the survey below before the module existed, but I wrote the module and tests before writing this report, so the table was not reported "before writing the module" as the brief asks.

### 3.1 The fields the rules need, on `VocalLineEvent`

`packages/score-parser/src/types.ts`:

| Need | Where | Status |
|---|---|---|
| Rest or note | `:474` `type: 'note' \| 'rest'` | present |
| Pitch | `:486` `pitch?: Pitch` (absent on rests) | present |
| Printed type | `:547` `Duration.base` | present |
| Dots | `:550` `Duration.dots` | present |
| Tuplet | `:553` `Duration.tuplet?: TupletInfo` | present |
| `duration.fraction` | `:561` | present |
| Grace | no field on `VocalLineEvent` or `Duration` | **NOT ESTABLISHED as a field** |

Grace: the parsers drop grace notes before the event list exists (`musicxml-parser.ts:706-708`, `mnx-parser.ts:862-867`). So a grace note can never be a candidate and never enters a bar's sum. Test (i) is built on that fact (it parses real MusicXML with a grace note and shows four events, not five). The rule "not a grace note" is therefore satisfied by the parser, not by a check in the module.

### 3.2 Every bar `barsToConfirm` names, on every tracked `.musicxml`

`git ls-files '*.musicxml'` gives **187** files, all parsed (0 parse failures). **96** files hold at least one named bar, **811** bars in all, **179** distinct (metre, notes, offer) patterns. The full per-bar table (file, bar, metre, reads as, expected, short or long by, the bar's notes with dots and `[n:m]` tuplets, the offer, and any set-aside note) is **`docs/sessions/offers-for-a-bar-table_r1_2026-10-12.tsv`**, 811 rows. The most common patterns follow ("Offered" is the function's own output, section 4's table):

| Metre | Reads as | Notes in the bar | Offered | Bars | Files |
|---|---|---|---|---|---|
| 1/4 | 1.5 of 1 | eighth eighth eighth | A:3:2@0 | 69 | 6 |
| 4/8 | 6 of 4 | quarter. quarter eighth | none | 64 | 4 |
| 1/4 | 1.5 of 1 | r:eighth r:eighth eighth | A:3:2@0 | 42 | 6 |
| 4/8 | 6 of 4 | quarter. eighth r:eighth eighth | none | 36 | 4 |
| 1/4 | 1.5 of 1 | quarter eighth | note:shorter@0->eighth | 30 | 6 |
| 4/8 | 6 of 4 | half. | note:undot@0->half | 28 | 4 |
| 1/4 | 1.5 of 1 | r:quarter. | note:undot@0->quarter | 27 | 6 |
| 4/8 | 6 of 4 | quarter. eighth r:eighth. 16th | none | 16 | 4 |
| 4/8 | 6 of 4 | quarter. eighth. 16th eighth | none | 16 | 4 |
| 1/4 | 1.5 of 1 | quarter. | note:undot@0->quarter | 15 | 6 |
| 1/4 | 1.5 of 1 | eighth. 16th eighth | none | 15 | 6 |
| 4/4 | 6 of 4 | half quarter half quarter | none | 14 | 4 |
| 11/8 | 12 of 11 | half. half. | none | 12 | 3 |
| 1/4 | 1.5 of 1 | eighth r:eighth r:eighth | A:3:2@0 | 9 | 6 |
| 11/8 | 12 of 11 | quarter. quarter. quarter. quarter. | none | 9 | 3 |
| 4/8 | 6 of 4 | quarter. quarter 16th 16th | none | 8 | 4 |

By direction: 721 bars long, 90 short (short = `actual` below `expected`).

**An observation, not a finding I can explain:** the commonest named bars sit in metres of `1/4`, `4/8`, and `11/8`, reading as `1.5 of 1`, `6 of 4`, and `12 of 11`. Those look like misread time signatures in the scan fixtures, not music. I did not check which fixtures carry them or why. The offers there are arithmetic against a wrong metre.

## The module

- `apps/web/src/lib/score/offers-for-a-bar.ts`: `offersForABar(score, bar)`, returns `BarOffers` (`kind`, `note`, `change`, `runs`, `rejected`), the brief's shape. Types `Metre` and `Ratio` are imported from `../omr/triplets` as types only. `compound` is copied with a comment naming `triplets.ts:190`. `conventionalSpace` is not called. Nothing exported from `triplets.ts`. Lengths come from `durationFraction` (`correction.ts:166`) and `TUPLET_VALUES` (`entry.ts:313`); `stepValue` is not used.
- Exact arithmetic: fractions in lowest terms, no epsilon. The metre is read from `score.measures[bar.measureIndex].timeSignature`, because `BarToConfirm` carries only the numerator.
- Kind 1: exactly one fitting change is offered; two or more are listed in `rejected` and none offered. Kind 2: one or two fitting runs return as A and B by start then n; three or more are listed and none offered; where two runs together would fit, `rejected` says so. Ratios as the brief: 3:2 any metre, 2:3 and 4:3 in compound, 4:3 in simple only at 3 beats.
- It changes no note, stores nothing, and adds no string.

**Two choices of mine, DESK DEFAULT, for you to rule on:**

1. `kind` names the first kind that made an offer, because the brief's shape has one `kind` but its test (e) needs a note offer and a tuplet offer together. In that case both `note`/`change` and `runs` are filled. 5 of the 811 bars come out this way.
2. A step to a longer or shorter type keeps the dots. The brief does not say; I did not add a dot change to a step.
3. "A run begins at a whole number of spans" is measured from the bar as printed, for the offered runs. To report "fits only under two runs", the second run's start is measured after the first run's change. A run can therefore be missing from the offers and still appear in that message.

## Offers for every bar in section 3.2

Across the 811 bars: **130 offer one note's length** (of which 5 also offer a tuplet), **129 offer only a tuplet**, **552 offer nothing**. The set-aside reasons on the 552: 437 have no candidate at all; 107 had two or more single-note changes (so none was offered); 8 fit only under two tuplet runs together. These three groups do not overlap (437 + 107 + 8 = 552). The per-bar offers are in the TSV, column `offers`.

## Tests

`apps/web/src/lib/score/offers-for-a-bar.test.ts`, 16 tests: the brief's ten bars (a) to (j), one each, and six edge tests (the ladder does not wrap, a rest is offered with no pitch, a rest may stand in a run, 4:3 is not offered in simple metre other than 3 beats, the two-runs message, three or more runs). Test (i) parses MusicXML through `MusicXmlScoreParser`; the others build events by hand with `durationFraction`.

## Gates

Run in a Linux cloud sandbox from a fresh install, before then after.

| Gate | Baseline you gave (9e1af16) | Before (measured) | After |
|---|---|---|---|
| 1 phonology | 251 | 251 | 251 |
| 2 dictionary | 248 | 248 | 248 |
| 3 web-check | 0 errors, 12 warnings, 5 files | same | same |
| 4 web-test | 2428 | 2428 | **2444** |
| 5 score-parser | 675 passed, 5 skipped (680) | same | same |
| 6 blurb | 145 | 145 | 145 |
| 7 integration | 55 | 55 | 55 |
| 8 ratchets | OK | OK | OK |

Gate 4 moved by **+16**, exactly the 16 tests in `offers-for-a-bar.test.ts`. Nothing else moved. The Playwright suite is not one of the eight and was not run.

## Could not establish

- **Grace notes as a field.** There is none, so rule "not a grace note" and test (i) rest on the parser dropping them, not on a check in the module. If a later parser keeps grace notes, the module needs a check.
- **Whether the offers are right against the composers' rhythms.** The brief says the table against the 17 song readings and their truth is for Code on the Mac, because those readings are not in the repository. I compared nothing to a printed page.
- **Why the `1/4`, `4/8`, and `11/8` metres appear** in the fixtures, and which fixtures hold the wrong signatures.
- **Whether the fixtures are independent.** 96 files hold bars, but many sit in repeated session folders; 811 bars is not 811 different bars. 179 distinct patterns is the better count, and it too is by pattern, not by song.
- **Whether `triplets.ts` still has `compound` on line 190** after row 89's change on the Mac. I copied it as it stands at 72b564f.
- Whether 4:3 in 3 beats of simple metre, and the 2:3 and 4:3 compound ratios, are the right set: they are the brief's DESK DEFAULT. Dann may widen it.
