# Report r1: steps 1 and 2 of the staff finder lane

2026-11-26, Code, Mac, on `mac-staff-finder`, cut from `Shane` at `7ae519b9`. Answers steps 1 and 2 of
`brief-code-staff-finder-light-scan_r2_2026-11-25.md` as amended by
`amendment-code-staff-finder-light-scan_r2_2026-11-26.md`, and the DESK amendment of 2026-11-26 21:4x on song3 page 6, which Dann pasted into the session. That amendment is the desk's, his to overrule, and it is recorded as the desk's rather than as his ruling (`CONTRACT.md` section 5, a ratification is not an authorship). His own ruling in this lane is the one at line 16, "No, pair stands".
Step 3 has not started. Nothing is committed.

All files named here are in `measure-staff-finder-light-scan_2026-11-25/` unless a path says otherwise.

## Where it stands

- **The done-when counts pass:** 16 of 16, 4 of 4, and 3 of 3 voice boxes. No voice box found today is lost.
- **The pair is level share 0.85 and ceiling 0.65,** the provisional pair. Over the voice staves of the swept pages,
  the two made-up sparse pages aside, it sits 0.08 of a level share and 0.07 of a ceiling inside every page.
- **Ruled, the pair stands.** A made-up page holding one pale staff and nothing else is not found at this level, and
  no pair serves both it and Nightingale page 4. Dann, 2026-11-26, asked whether that page counts against the pair:
  "No, pair stands".
- **Gates:** seven at baseline. Gate 4 is up by the three new tests.

## Step 1: the page's own ink level

### What was built

| file | change |
|---|---|
| `omr/metre-windows.ts` | new `InkLevels { rule, glyph }` and `inkLevels(page)`; `inkAt` takes a level; `lineRows` and `extent` read `ink.rule`; `strokes` and `meanInk` read `ink.glyph`; `staffIn`, `barLines`, and `windowsOf` take the object |
| `omr/underlay-below.ts` | `topLineBelow` takes the object and hands it to `lineRows` |
| `omr/metre-model.ts`, `omr/underlay-prepare.ts` | each calls `inkLevels` once per page |
| `omr/underlay-looks.ts` | `toneAt` exported and reused for the percentile |

- **The rule level** is `round(anchor + 0.85 × (paperTone − anchor))`, where the anchor is the grey at the first
  percentile. One expression, no branch, no clamp.
- **The glyph level** is the shipped 140, now `GLYPH_INK`, with a comment naming `QUEUE.md` row 218.
- **No page-wide ink constant governs `lineRows` or `extent`.** The level arrives as an argument to both.
- **On a blank page the level is 255,** and on white paper under one per cent ink it is 255. A test holds both.

### Tests

- `underlay-prepare.test.ts` ran first: 30 of 30, expected values unchanged. Its pale words (grey 215) sit under that
  page's level of 220, five levels clear.
- The existing tests changed only where a call gained an argument. `topLineBelow` calls changed too, which the brief's
  list did not name.
- **The mid-grey page** (`metre-windows.test.ts`, "the two ink levels"): paper 230, staff lines 180, bar line 60. It
  fails when any one of `lineRows`, `extent`, `strokes`, or `meanInk` is given the other level, and when the two
  levels are swapped (`step1-mutants.out.txt`).

### Real pages at step 1, ceiling still 0.45 (`step1-staves.out.txt`)

Nightingale page 4, 16 of 16; song1 page 1, 4 of 4; Without Sun page 5, 3 of 3. Two boxes found by the shipped code
were lost, boxes 2 and 5 of song3 page 6, a page added to the held-out set. The next section judges them.

## Song3 page 6, boxes 2 and 5

**Both are piano grand staves,** read from the page: a brace, treble over bass, a key signature in each, no words.
The page has one voice staff (box 0) and five grand staves (boxes 1 to 5). `voiceBoxes` names all six because homr
gave the page as one part. No note of that part lies on the voice staff; box 0 is named because 12 notes drawn just
above the first grand staff are nearer its centre than any other box's. `voiceBoxes` is unchanged (`QUEUE.md`
row 226).

**The two were lost at step 1 only. At the pair both are found, so the pair loses nothing on this page.** The staff
picked inside each box flips: box 2 from the lower staff to the upper, box 5 from the upper to the lower.

`readPageMetres` (`step2-song3-metre.out.txt`; the repeated loop equals the tree's own function on the step 1 column):

| box | shipped | pair | step 1, for the record |
|---|---|---|---|
| 2 | one start window at x 985, states nothing | one start window at x 587, states nothing | unfound |
| 5 | one start window at x 645, states nothing | one start window at x 749, states nothing | unfound |

Over the whole page no verdict flips: every window states nothing, for the same reason, shipped and at the pair, and
the page prints no time signature. Windows go from 8 to 10, the two new ones courtesy places on boxes 1 and 4.

`topLineBelow` and the band it leads to (`step2-song3.out.txt`):

| call | shipped | pair |
|---|---|---|
| box 2's system, box 3 below | 2875.5; band 2378 to 2831 | 2282.3; band 2079 to 2237 |
| box 5's system, nothing below | 5032.5; band 4805 to 4987 | null; band 5200 to 5761 |
| box 1's system, box 2 below | 1171.0 | 1171.8 |
| box 4's system, box 5 below | 4155.0 | 4150.5 |

Every band here lies on piano, so no words are in play. The voice staff gets no system, shipped or built.

**Named, per the amendment:** song2 page 1 box 5, found today and **lost** at the pair (accepted by amendment r2).
Song3 page 6 boxes 2 and 5, found today, **lost at step 1, found again at the pair.** One more loss at the pair,
which the amendment did not have: **song1 page 2 box 1, found today and lost,** a piano grand staff read from the
page. The system above it asks `topLineBelow` and gets 795.5, which is that grand staff's top line, found in the ink.

## Step 2: the ceiling

`LINE_CEILING = 0.65` replaces the bare 0.45 in `fives`, with a comment saying what it is and what set it.

### What 0.45 rejects at the shipped constants (`step2-rejects.out.txt`)

Groups of five evenly spaced rows turned away by the ceiling alone, on every box:

| page | groups | page | groups |
|---|---|---|---|
| song1 p1 | 91 | song1 p2 | 90 |
| song2 p1 | 39 | song2 p4 | 35 |
| song3 p1 | 28 | song3 p6 | 390 |
| song4 p1 | 298 | song4 p5 | 120 |
| Without Sun p4 | 72 | Without Sun p23 | 427 |
| Without Sun p5 | 97 | Without Sun p6 | 147 |

Eight were looked at, from eight different boxes (`step2-crops.mjs`). In each, a beam, notehead, rest, clef, or
ledger line through a note lies along one of the five rows. One (Without Sun p5 box 3) is shifted a line up, onto a
ledger line. What the number was first meant to reject is still NOT ESTABLISHED.

### The pair and its margins (`step2-sweep.mts`, `step2-margins.out.txt`)

Level share 0.50 to 0.99 and ceiling 0.30 to 1.20, both in steps of 0.01, on 19 pages.

| voice staves counted | level share at 0.65 | ceiling at 0.85 | rectangle that passes (N, M) |
|---|---|---|---|
| read from the page, sparse pages aside | 0.76 to 0.93 | 0.42 to 1.20, the sweep's end | 0.08, 0.07 |
| `voiceBoxes`, song3 p6 all six | 0.83 to 0.90 | 0.47 to 0.70 | 0.02, 0.01 |
| read from the page, at ceiling 0.45 | 0.76 to 0.85 | | none in level: on the edge |

- **N is 0.08 and M is 0.07.** Both level edges and the lower ceiling edge are Nightingale page 4's.
- The second row differs only by the five grand staves of song3 page 6.
- **0.45 does not ship at this level:** Nightingale page 4 stands on its edge.
- **0.58 was measured and not taken.** It widens the second row's rectangle to 0.04, 0.02, and keeps song1 p1 box 2's
  left end at the system line. It loses three piano boxes against two, and moves the band edge under song1 p1 box 6
  by 75 px, which was not checked for words.

### Done-when

| page | voice staves counted from the page | found by the lane | found today | homr's boxes |
|---|---|---|---|---|
| Nightingale p4 | 16 | 16 | 0 | 16 |
| song1 p1 | 4 | 4 | 4 | 8 |
| Without Sun p5 | 3 | 3 | 3 | 6 |

Across the 19 pages, `voiceBoxes` names 65; 39 are found today and 64 at the pair. The one not found is on the
one-staff page below.

**Every box of either kind that changes state** (`step2-staves.out.txt`):

| page | gained | lost |
|---|---|---|
| Nightingale p2, p3, p4, p5 | all 6, 7, 16, and 5 boxes (3, 3, 16, and 1 voice) | none |
| Without Sun p5 | box 3 | none |
| Without Sun p6 | box 7 | none |
| song2 p1 | none | box 5 (piano) |
| song1 p2 | box 0 (voice), boxes 3 and 7 | box 1 (piano) |
| song2 p4 | box 0 (voice), box 5 | none |

### What else moves on voice staves

Tolerance 6 px, a fifth of a staff space. Moves inside it are not listed.

| page, box | move | looked at |
|---|---|---|
| song1 p1 box 0 | right end +89, one more bar line | amendment r2 |
| song1 p1 box 2 | left end +47, inside the clef | amendment r2 |
| song2 p1 box 0 | right end +133, one more bar line; band edge below −78.8 | 0e: no words lost |
| song2 p1 box 4 | right end +40, one more bar line | amendment r2 |
| Without Sun p6 box 6 | final bar line lost, ends unchanged | amendment r2 |
| song1 p2 box 2 | right end +113, one more bar line | no |
| song2 p4 box 2 | left end −430; band edge below +8.5 | left end now at the system line; today's is past the key signature |
| song2 p4 box 6 | band edge below −137.5 | two rows go, both piano; «за-ря!» stays |
| song3 p6 box 0 | left end −349; band edge below +18.5 | left end now at the system line; today's is past the key signature |
| song4 p5 box 0 | left end −58, right end +28 | left end now at the system line; right end not looked at |
| **Without Sun p23 box 2** | **left end +58, inside the clef** | worse than today, the same shape as song1 p1 box 2 |
| song1 first-system page | right end +67 | no |

Over the twenty control staves this is the amendment's count: sixteen unchanged, three gain a bar line, and Without
Sun page 6 box 6 loses one.

### Carrying 0e forward, and the lyric rows (`step2-check.out.txt`)

- The built tree equals step 0e's pair on all 45 boxes of its seven pages: staff, windows, and bar lines. So 0e's
  findings hold for the build: no row of words lost on song2 page 1, and no metre verdict flips on the twenty staves.
- The built tree equals the sweep at (0.85, 0.65) on all 19 pages.
- Lyric rows, shipped against built, on every non-Nightingale page: they differ on song2 p1, song1 p2, song2 p4, and
  song3 p6. No row of words found today is lost on the systems looked at.
- **Gained:** song1 p2 and song2 p4 each get a system for their first voice staff. Today its notes go to the piano
  staff below it on song1 p2, and to the next voice staff on song2 p4.
- **The new system on song2 p4 is clipped at the bottom.** The page tilts, and the band's lower edge cuts through
  «-се-лых ви-дит за-ря!» on the left. Today those words get no band under their own staff. This is near
  `QUEUE.md` row 224, at the other edge.

## The sparse pages

The held-out set gained five last pages (song1 to song4, and Without Sun p23) and two made-up sparse pages. None of
the real pages added has fewer than three systems.

- **song1 page 1 under its first system:** level 233, found.
- **Nightingale page 4 with the heading and one staff:** level 219, found (`step2-sparse.out.txt`).
- **Nightingale page 4 with one staff and nothing else:** level 226 on paper of 227, **not found.** Under one per cent
  of the page is ink, so the first percentile falls in the paper. With two staves, one of two is found; from three,
  all are.

The sweep finds the bare one-staff page only at a level share of 0.74 or less with a ceiling of 0.77 or more.
Nightingale page 4 needs a share of 0.76 or more. **No pair serves both.** Brief r2 says to stop and report rather
than make the rule piecewise if one expression cannot serve every swept page. **Dann ruled on 2026-11-26 that the pair
stands,** so the page does not count against it; the rule is unchanged. Today's code does not find it either. Amendment r2 records a one-staff cut at
level 220, found; how that cut was made is not recorded, and it matches the heading version here more nearly.

## Gates

Run from a scratch copy of `ilya-ship.sh` with the branch and untracked refusals and every git write removed
(`step2-gates.out.txt`).

| gate | result |
|---|---|
| 1 phonology | 462 passed |
| 2 dictionary | 248 passed |
| 3 web check | 0 errors, 12 warnings in 5 files |
| 4 web test | **6963 passed, 1 skipped (6964); baseline 6960, 1 skipped (6961).** The three new tests |
| 5 score parser | 913 passed, 5 skipped |
| 6 blurb | 178 passed |
| 7 integration | 159 passed |
| 8 ratchets | OK |

After that run, a comment and one missing space changed. The type check, the ratchets, and the 712 tests under
`lib/omr` were run again and passed. The full eight were not run again.

## Housekeeping

- `step0d_p1_085_065.txt` is copied into the measure folder (md5 `a914cf79`, the same as the source).
- The sparse pages are defined in `step-lib.mts` (`CUTS`).
- `docs/memory/` files changed during the session. This lane did not edit them.

## Not established

- Step 3, and anything the OCR reads from any band.
- The app was not walked: the change shows only when a scan is read, which is step 3.
- Metre verdicts on the pages beyond step 0e's seven and song3 page 6.
- Whether the page 4 bar lines include false ones beyond box 1.
- The moves marked "no" or "not looked at" above.

## To run it again

`W` is `~/Downloads/_desk-staffin-2026-11-25/work/code-lane`. `B` is a folder holding
`git archive 7ae519b9 apps/web/src/lib | tar -x -C B`. `G` is a copy of the working tree's `apps/web/src/lib`.

1. `node step2-pages.mjs "$W" <page names>` (dev server on port 5173)
2. `node step-staves.mts "$W" "$B"`
3. `node step2-sweep.mts "$W" "$B" "$G"`, then `python3 -I step2-margins.py "$W" 0.85 0.65`
4. `node step2-check.mts "$W" "$B"`, `node step2-sparse.mts "$W"`, `node step2-rejects.mts "$W" "$B" <copy of B's lib>`
5. `node step2-song3.mts "$W" "$B" <lib at 0.45> <lib at 0.65>`, then `node step2-song3-metre.mjs "$W" "<column the tree is at>"`
