# MEMO. N.153 stage 5: the whole-fixture scan. r1, 2026-09-21

**Written by Code, in answer to `brief-n153-s5-whole-fixture-scan_r1_2026-09-21.md`
(the amended copy, with clause 15 in §4). Status: WRITTEN. DONE is Dann's walk.**

## 1. The command

```bash
pnpm --filter @ilya/web exec playwright test --project=phone
```

It runs three tests on the new `phone` project (Chromium, 390 x 844, device scale
factor 3, `hasTouch`, `isMobile`). The report is written to
`apps/web/test-results/loupe-scan/report.md`, and the raw walk to `scan.json` beside it.
The tap log is `taps-m5.md`. The whole run takes about 60 s.

**It exits non-zero today, by design.** Rule 5a has one violation, and the scan
reports it rather than passing it (clause 13).

## 2. What changed

- `apps/web/playwright.config.ts`: a `phone` project with its own `testDir`,
  `./e2e-phone`. The `chromium` project is unchanged and never reads that
  directory (`playwright test --list` shows 21 chromium tests, all `core-loop`).
- `apps/web/e2e-phone/loupe-probe.ts`: reads the mounted loupe in client CSS
  pixels through `getScreenCTM`. It writes nothing.
- `apps/web/e2e-phone/loupe-rules.ts`: the five rules, one function each.
- `apps/web/e2e-phone/loupe-scan.test.ts`: the walk, the report, and the two tap
  tests.
- `apps/web/src/lib/shane/loupe-render.ts:98`: **the doc comment on `converged`
  is corrected**, as the desk asked. It said the render budget could make it
  false. It cannot: the bisection stops on `hi`, which already clears the floor.
  Comment only; no code changed.

No change to the loupe's drawing, its spacing, `deriveMinGap`, `VocalLineEvent`,
or `reconciliation/`.

## 3. How the scan works

The loupe is raised once, by a real tap on m. 1's first note. The scan switches
it to **Corrections**, steps back to the score's head gap, and then presses
**Next note** until the end of the score. That is 233 selections. The loupe
follows the selection across measures. So each measure is drawn with each of its
notes taken, when the squircle is drawn, and with each of its gaps and rests
taken, when no squircle is drawn.

**The walk waits for the seat.** MEASURED today: the page first draws the score's
raw underlay. About 4 s later, once the poem's transcription exists, it redraws
the underlay seated, and logs `[Ilya] N.160 seats:` once. The loupe's spacing
reads the underlay, so a measure derived before the seat gets a different answer:
m. 5 was 82.78 before the seat and 82.16 after. My first run started too early
and derived m. 4 twice. The scan now waits for that line before raising anything.

## 4. The per-measure table

Measure numbers are the fixture's 0-based index, which is what the ids and the
console carry. The loupe's tag prints each one higher. **`converged` is inferred as
worst >= 44, and labelled so.** The page's `minGap` is 14 on every measure.

| m. | minGap | renders | converged (inferred) | search worst px | drawn worst px | offending pairs | nearest squircle, lg | worst off-centre, px | rules violated |
|---|---|---|---|---|---|---|---|---|---|
| 0 | no entry, no loupe | | | | | | | | |
| 1 | 69.41 | 11 | yes | 44.05 | 44.05 | none | 1.92 | 0.28 | none |
| 2 | 54.69 | 11 | yes | 44.16 | 44.16 | none | 1.81 | 0.28 | none |
| 3 | 58.82 | 11 | yes | 44.12 | 44.11 | none | 2.21 | 0.28 | none |
| 4 | 66.91 | 11 | yes | 44.07 | 44.06 | none | 2.21 | 0.28 | none |
| 5 | 82.16 | 11 | yes | 44.03 | 44.03 | none | 1.91 | 0.28 | none |
| 6 | 69.65 | 11 | yes | 44.09 | 44.09 | none | 1.91 | 0.27 | none |
| 7 | 69.65 | 11 | yes | 44.15 | 44.15 | none | 2.23 | 0.28 | none |
| 8 | 68.39 | 11 | yes | 44.05 | 44.04 | none | 2.02 | 0.27 | none |
| 9 | 57.70 | 11 | yes | 44.13 | 44.12 | none | 2.28 | 0.27 | none |
| 10 | 72.79 | 11 | yes | 44.13 | 44.13 | none | 1.81 | 0.27 | none |
| 11 | 66.19 | 11 | yes | 44.09 | 44.09 | none | 2.01 | 0.27 | none |
| 12 | 66.50 | 11 | yes | 44.08 | 44.08 | none | 1.98 | 0.27 | none |
| 13 | 61.16 | 11 | yes | 44.01 | 44.01 | none | 1.90 | 0.27 | none |
| 14 | 61.16 | 11 | yes | 44.01 | 44.00 | none | 1.91 | 0.27 | none |
| 15 | 65.56 | 11 | yes | 44.09 | 44.09 | none | 2.03 | 0.27 | none |
| 16 | 55.81 | 11 | yes | 44.04 | 44.03 | none | 2.11 | 0.27 | none |
| 17 | 66.82 | 11 | yes | 44.02 | 44.01 | none | 1.90 | 2.90 | 5a |

"Search worst" is the console's figure: the worst over every possible selection.
"Drawn worst" is the smallest separation in any of the 233 states that were
actually drawn. The last two columns are the rules' own evidence, so a clean row
is a measured zero and not an empty probe. Every measure also showed its closing
barline, drawn in the body and correctly found hidden in the head panel's copy.
That is the positive control for rules 3 and 4.

## 5. The five rules

Each rule is its own named, soft-asserted `test.step`, so every rule is asserted
and reported even when another fails.

1. **Tap floor, 44 px caret to caret: 0 violations.** Every one of the 17 measures
   converged. The 2026-09-18 baseline was 1.13 to 7.89 px.
2. **Squircle clearance, 1.6 line-gaps: 0 violations.** This is measured on the
   drawn mark's nearest edge, not the hit centre. The nearest any caret came is
   1.81 line-gaps (m. 2 and m. 10).
3. **No mark of an adjacent measure: 0 violations.**
4. **No opening barline: 0 violations.**
5. **Position rule.**
   - **5a, the middle of its space: 1 violation.** On m. 17, the caret after
     `m17-5-4` stands **2.90 px (0.52 line-gaps) right of the middle**.
     **The reason:** `closingBarline` returns the pair's outer edge
     (`loupe.ts:691`), and the placement takes that as the tail gap's right
     boundary. On a single barline the outer edge and the facing edge are a
     half-stroke apart, which is the 0.27 to 0.28 px in every other row. On the
     final double bar they are the width of the whole pair apart. The stem
     stands at 520.25, the exact midpoint to the thick line's outer edge. The
     midpoint to the thin line, which is the edge facing the space, is 517.35.
     Whether the space ends at the thin line is a reading of the rule. **It is
     Dann's to rule, and I changed nothing.**
   - **5b, touches nothing: 0 violations.**
6. **Clause 15, beam contacts: 6, reported and not counted.** They are the carets
   after `m2-9-8`, `m5-9-8`, `m8-9-8`, `m10-9-8`, `m14-9-8` and `m15-3-8`. Stage 3b
   counted 11 gaps that a beam spans. The difference is that a beam can span a
   gap without reaching the caret's drawn height, and this scan counts only
   drawn contact.

**One false positive was found in my own probe and fixed before this report.** My
first run tested text by its em box and reported m. 16's caret after `m16-3-4`
touching the tuplet's "2". Measured by the glyph's own ink, the digit ends at its
baseline, **1.2 px above the caret's arrowhead**, and a 3x screenshot shows the
daylight. Text is now tested by its canvas-measured ink. All 5625 glyph measures
fall inside their own em boxes, so the canvas used the painted face.

## 6. Real-click verification

**Converged: m. 5, 49 taps, 49 correct.** m. 5 carries notes, two rests, a dotted
note and a beam. The test makes a real touch (`page.touchscreen.tap`) on every
note, rest and caret in the loupe, including the head caret, which belongs to
m. 4. It taps each one at its hit centre and at 40 percent of the way toward its
nearest neighbour in the shared pool, on each side. Each tap is checked against
the readout the stepper gave for that position. A note is also checked for the
squircle standing on it. A gap is also checked for the entry before it, so two
gaps that read the same cannot be confused.

**Unconverged: NOT ESTABLISHED.** Every measure converged at 390 px, so there is
no unconverged measure to click. The test skips and says so. As ruled, no failing
case was manufactured.

`(pointer: coarse)` matches on the `phone` project (checked:
`[true, true, 390, 844, 3]` for coarse, hover none, width, height and ratio).

## 7. Two findings outside the five rules

**Carets stand 15.6 to 21.4 px from the nearest note, everywhere.** `handleTap`
resolves notes and carets in one pool, by nearest centre. Rule 1 reads clause 13
as caret to caret, and that now holds. But the nearest caret-to-note centre
distance is 15.6 px (m. 2) to 21.4 px (m. 17), all horizontal. So a thumb that
lands more than about 8 px off a note's centre, toward its caret, selects the
caret. The taps at 40 percent resolve correctly, as nearest-centre must. Whether
clause 13's "its neighbour" means the next caret or the next target of any kind
is NOT ESTABLISHED. It decides whether the insert reach is safe on a phone, and it
is Dann's to rule. The report's last table gives the figure for every measure.

**Every gap after a rest reads "before the first entry".** Measured on all 19
such gaps. `gapAnchorName` (`+page.svelte:1587`) names the entry before a gap by
its syllable or its pitch. A rest has neither, so the name is null, and
`readoutLine` takes null to mean the head gap. The selection itself is right,
and the tap test confirms it through the entry before each gap. Only the words
are wrong. I did not fix it; it is outside this brief.

## 8. Gates

| gate | baseline | now |
|---|---|---|
| phonology | 216 | 216 |
| dictionary | 235 | 235 |
| web-check | 0 errors, 12 warnings, 5 files | same |
| web-test | 1385 | 1385 |
| score-parser | 575 passed, 5 skipped | same |

The new files type-check clean under `tsc --strict`. `svelte-check` does not read
`e2e-phone/`.

**`core-loop.test.ts` fails at baseline, and not because of this change.** Its
`beforeEach` waits for `.status-ok`, which `IntakePanel.svelte:225` records as
removed. Run on the untouched `chromium` project, the first test times out after
45 s on that selector. `~/Downloads/ilya-ship.sh` does not run Playwright, so no
gate records this. It refuses to run at all while untracked files are present,
so I ran its five commands by hand.

## 9. What could not be established

- **The unconverged half of the real-click verification**, as in §6.
- **What clause 13's "its neighbour" covers**, as in §7.
- **Why m. 7 derives 69.65 today where stage 3b recorded 69.33.** The other 16
  measures match stage 3b's `minGap` exactly. m. 7's underlay may have changed
  since 2026-09-20 (N.160 and N.161 both touch seats), but I did not trace it.
- **A correction to my section 3 report.** I said m. 17's row could not be
  compared with stage 3b's because N.156 added a note there. That was wrong.
  The note split (`46f1d31`) is an ancestor of stage 3b's tree (`a1cd0dd`), so
  stage 3b already measured the five-note ending, and m. 17 matches it. Only
  clause 13's measurement of 2026-09-18 predates the added note.
- **Whether the scan holds at other widths.** I ran only 390 x 844. Clause 13's
  own measurement used 375 px. That would be one more project entry.
- **A caret inside a glyph's bounds but between its strokes** is counted as
  touching, because a glyph is tested by its ink box, not its outline. No such
  case arose.
- **Rule 3 finds marks by their ids.** An unlabelled mark of another measure, such
  as a tie or slur arriving from the previous bar, would not be caught. The
  one-measure render contains no other measure's ids.

## 10. Sequencing

Nothing in the code makes the trade look wrong. The scan takes 35 s, and the tap
tests 25 s.
