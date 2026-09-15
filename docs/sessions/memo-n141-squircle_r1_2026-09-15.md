# Memo: N.141, the squircle's grammar

Revision 1, 2026-09-15. Written by Claude Code, built to
`brief-n141-squircle-grammar_r1_2026-09-15.md` and `docs/memory/OPEN.md` §N.141.
**Not committed and not staged.**

**Status: WRITTEN.** Measured in the dev server's Browser pane, from DOM geometry,
on both scores, at 390 px. **Not walked by Dann.** Whether the shape reads as
closed and balanced is his eye, per the brief.

**Steps 1 and 2 are built. Step 3, re-spacing the loupe, is NOT built and was not
needed:** step 2 brought every count to zero on both scores.

---

## 1. What changed, by file and line

### Step 1: the ring's geometry, `apps/web/src/lib/shane/VoiceProfilePane.svelte`

- **`:483`, the ring effect.**
  - **Width.** `:498`: the taken note's own ink (notehead, accidental, dot) plus
    `RING_PAD_X` each side, floored at `RING_MIN_W`. Unchanged in kind.
  - **Top.** `:506`: the highest ink of any note on the system, notehead,
    accidental, dot or its own stem, less `RING_PAD_Y`. **One number per
    system.** Beams are not read, because a beam may be bisected (ruled
    2026-09-14).
  - **Bottom.** `:513`: halfway between the IPA row's lowest ink and the
    Cyrillic row's highest ink on the system, both found as drawn. A system with
    no IPA text keeps the note's own bottom, padded.
  - **No truncation.** `:533`: the ring is held inside the system's viewBox.
  - **`RING_ASPECT` is removed**, by Dann's ruling of 2026-09-15.
- **`:366` `markBox`, `:386` `eventInk`, `:417` `underlayRows`**: three helpers.
  `eventInk` leaves the analysis layer out, so the turning notehead is not part
  of the note's own ink.

### Step 2: the loupe draws its own squircle

- **New file, `apps/web/src/lib/shane/selection-ring.ts`.** The ring's constants
  move here from the pane, because the loupe needs the same stroke and reach.
  It adds `RING_REACH = RING_PAD_Y + RING_STROKE / 2`. The pane imports them at
  `VoiceProfilePane.svelte:86`.
- **`apps/web/src/lib/shane/loupe.ts:619` `stripRing`**: places the page ring on
  the loupe's strip by the body panel's own linear map, so it can reach across a
  seam.
- **`loupe.ts:646` `ringRoom`**: widens the crop's ink band above by what the
  half-space pad lacks for the ring's reach. It is a page-wide constant, so the
  frame still does not change size between notes.
- **`apps/web/src/lib/shane/Loupe.svelte`:**
  - `:957`: the crop uses `ringRoom`.
  - `:995` and `:1015`: the page's ring comes out of the clone. **N.138's seam
    clamp is deleted**, because it was the cause of every step 1 collision.
  - `:1095`: builds the loupe's ring from the page ring's own attributes.
  - `:1263`: the panels sit in a new `.loupe-strip`.
  - `:1266`: the ring draws in `.loupe-ring`, beneath the panels, which have been
    transparent since N.133. So it stays under the music, as ruled 2026-08-28.
  - `:1512`: the stylesheet for both.
- **`loupe.test.ts:679`**: 3 tests.

### Two loupe faults found by the measurement, fixed, both outside N.141

Both sat under the step 1 numbers, and neither could be measured past without
fixing.

1. **`Loupe.svelte:281`: a stem was taken for a barline.** `staffVerticals`
   accepted any vertical that spans the staff to within 0.3 of a space.
   - On Kabalevsky T05, m. 15, a stem at x = 151.85 runs 85.88 to 106.95
     against a staff of 85 to 107.
   - `closingBarline` took the stem, and **the loupe showed 12.25 units of an
     80-unit measure.**
   - **The fault is mine, shipped in `8bb406c`** (N.138 increment 3), and my own
     increment 3 survey missed it.
   - The fix: skip verticals inside `[data-event-id]`, since a barline never
     stands there.
2. **`Loupe.svelte:665`: the opening barline search could open past the whole
   measure.**
   - On T05, m. 23, the next measure with entries lies beyond a tacet run, so
     the window spans that run.
   - The run's own barline at 408.83 sat inside the window's left half, right of
     the measure's notes at 344 to 358.
   - The crop opened past all of them. The same happened on m. 73.
   - This is slice 3 §11's search, exposed by N.104's tacet runs.
   - The fix: an opening barline must stand left of the measure's first ink,
     accidental included.

---

## 2. The measurements

**Instrument.** Dev server, Browser pane hidden, viewport emulated at 390 × 844.
Every reading comes from the DOM; no screenshot is used.
- **Collisions:** the taken note's own `data-of-event` parts (accidental,
  brackets, dot), measured as glyph ink by canvas, must lie inside the ring's
  inner edge.
- **Truncation:** the ring plus half its stroke must lie inside the loupe's
  window. In step 2 this is read from the ring's own screen box.
- **Sync:** a note counts only once the loupe's ring matches the page ring
  mapped through the body SVG's actual screen position, to within half a pixel.
  That rules out stale frames.
- **No glyph failed to return ink on either run.**

### Step 1

**Expectation, stated before measuring.** Own accidentals and dots would clear
the ring on nearly every note. The ring would not fit the loupe's crop on some
notes, at the top because a 9-unit pad exceeds the crop's 2.75, and possibly at
the right near a barline. Likeliest instrument failure: a SMuFL glyph returning
no ink.

**Result, on the corrected loupe:**

| | Sunless 01 | T05 |
|---|---|---|
| notes the loupe can raise on | 96 | 160 |
| of which carry their own accidental or dot | 26 | 23 |
| page collisions with the note's own accidental or dot | **0** | **0** |
| loupe collisions | **3**: m. 3 B3, m. 4 B♭3, m. 11 C4 | **1**: m. 44 G♯3 |
| loupe truncations | **60, all at the top, 0.37 to 3.37 units** | 0 |
| one ring height per system | yes, all 8 systems | no IPA row in that run |
| reaches the IPA baseline; Cyrillic row outside | all 96 | not tested |

**Step 1 count: 61 of 256 notes.** Against the expectation:
- The top truncation came as predicted.
- The right-edge truncation did not appear.
- **All four collisions came from N.138's seam clamp**, which I had not
  predicted. On a note that opens its system, the clamp moved the ring's left
  edge inside the body crop and across the note's own accidental.

### Step 2

**Expectation, stated before measuring.** Zero truncations and zero collisions.
Likeliest failure: a ring reaching past the strip's edge.

| | Sunless 01 | T05 |
|---|---|---|
| notes | 96 | 160 |
| loupe collisions | **0** | **0** |
| loupe truncations | **0** | **0** |
| stale readings discarded | 0 | 0 |
| rings left in the clone | 0 | 0 |
| ring heights, by system | 8 systems, one height each, 59.93 to 73.54 | 2 systems with IPA, one height each, 71.79 and 70.56 |
| reaches the IPA baseline; Cyrillic row outside | all | all |

---

## 3. Were steps 2 and 3 needed

**Step 2 was needed.** Step 1 left 61 of 256 notes failing, and both causes were
the page ring seen through the body's crop: the crop's top edge cut it, and the
clamp at its left edge pushed it across the note's own accidental. Neither can be
fixed without moving the ring out of the crop.

**Step 3 was not needed and was not built.** Step 2 reached zero on both scores,
so re-spacing was never shown to be necessary. The loupe stays a crop of the
page.

---

## 4. Gates

| gate | result | ship script reads | moved |
|---|---|---|---|
| 1 | 216 passed (216) | 216 | no |
| 2 | 235 passed (235) | 235 | no |
| 3 | 0 errors and 7 warnings in 4 files | same | no |
| 4 | **1173 passed (1173)** | 1170 | **+3**: `stripRing` and `ringRoom` tests |
| 5 | 550 passed, 5 skipped (555) | same | no |

**`selection-ring.ts` is untracked, so the ship script refuses until it is
added.** Line 79 of the script also needs to move from 1170 to 1173.

---

## 5. NOT ESTABLISHED

NOT ESTABLISHED beats a complete invented answer.

- **Whether the shape reads as closed and balanced to a singer.** That is Dann's
  eye on the walk.
- **T05's full vertical grammar.**
  - In the step 1 run T05 had no IPA row at all. Loading its score onto an empty
    poem box did not seat its own words in this pane, twice.
  - In the step 2 run the poem that was present seated onto two of T05's 10
    systems. Only those two carry IPA.
  - So one height per system and the IPA baseline were checked on 2 of T05's
    systems, not all 10.
- **No survey at a desktop width.**
  - Every count is at 390 px. The geometry is in page units and scales linearly,
    so the counts should not change, but that is argument, not measurement.
- **The loupe's window height grows** by the extra headroom `ringRoom` adds,
  7.25 units at a 5.5 stave space. How that reads on screen was not looked at.
- **Neither score was walked for a system with notes above the stave**, which
  would raise the system-wide top for every ring on that system.
- **The page's step 1 ring was not compared with the pre-N.141 ring on screen.**

---

## 6. Decisions the brief did not settle. All mine, all reversible

1. **The bottom edge sits halfway between the IPA row's lowest ink and the
   Cyrillic row's highest ink**, not on the IPA baseline itself. A ring ending on
   the baseline would cut IPA descenders such as ɲ and j.
2. **The top is the highest note ink on the whole system**, so every ring on a
   system shares it, as definition of done 1 asks. A tall stem anywhere on a
   system raises every ring on it.
3. **A system with no IPA text keeps the note's own bottom plus `RING_PAD_Y`.**
   Heights then vary on that system. T05's step 1 run was this case.
4. **The turning layer is left out of the note's own ink.** The old code read it
   through the group's children for height, though not for width.
5. **The loupe's crop grows above the ink band** so the ring fits, rather than
   the loupe's ring being shortened. That keeps the shape identical on both
   surfaces.
6. **The two loupe barline fixes in §1**, both outside N.141.
7. **Fixture state in the pane's scratch library** was replaced several times to
   load each score. None of it is Dann's library.

---

## 7. Appended: the bottom encloses the IPA row, and the rows part to make room

This follows Dann's overrule of 2026-09-15 (`docs/memory/OPEN.md` §N.141,
OVERRULED 2026-09-15) and his contingency ruling of the same day, IF THE BOX
WILL NOT FIT BETWEEN THE ROWS.

**It replaces §6 decision 1.** The midpoint between the two rows is gone.
**Not committed and not staged. WRITTEN, not walked by Dann.**

### 7.1 The gap, measured before anything changed

**ROUNDING, READ THIS FIRST.** Chrome returns `fontBoundingBoxAscent` and
`fontBoundingBoxDescent` as whole numbers. Every face-metric figure in this
section therefore carries about half a unit of rounding, and every gap built from
two of them carries about one unit either way. The font tables themselves were
not read, because `fontTools` is not installed.

Measured on Sunless 01's page faces: **Lato IPA at 12** and **Source Sans 3 at
12.5**, both loaded. IPA baseline at y 135, Cyrillic baseline at y 151.

| | face metric (±0.5) | deepest or tallest actual ink |
|---|---|---|
| IPA descent below its baseline | 3 | 2.35 (β), 2.20 (ɲ) |
| Cyrillic ascent above its baseline | 13 | 10.51 (Й), 10.16 (Ё) |

**At the old 16-unit spacing the gap was 16 − 3 − 13 = 0 units, about ±1 from
rounding.** The box's edge and its 2-unit stroke did not fit, so the contingency
fired.

### 7.2 The value chosen: 20

**`staff-renderer.ts:817` `IPA_TO_CYR_BASELINE = 20`**, used at `:2738`. It was
`ipaY + 16`. The arithmetic, on face metrics:

1. The box's inner edge sits at the IPA descent, 3, and its outer edge at 3 plus
   the 2-unit stroke, 5.
2. The Cyrillic row starts 13 above its baseline, so the two touch at a spacing
   of 5 + 13 = **18**.
3. A spacing of **19** leaves 1 unit of air, which is about the size of the
   rounding, so it could still touch.
4. **20 is the smallest value whose air survives the rounding: 2 units nominal,
   about 1 at worst.**

**Named cost:** every system is 4 units taller.

### 7.3 What else changed

- **`staff-renderer.ts:790` and following** export `IPA_FONT_SIZE`,
  `IPA_FONT_FAMILY`, `CYR_FONT_SIZE` and `IPA_TO_CYR_BASELINE`.
  `packages/score-parser/src/index.ts:52` re-exports them.
- **`staff-renderer.test.ts:169`** now asserts the 20-unit spacing, inside an
  existing test.
- **`VoiceProfilePane.svelte:525`: the bottom rule.** The stroke's inner edge
  sits on the IPA baseline plus the IPA face's descent (`:443`
  `ipaFaceDescent`, at 12 px Lato IPA). That is constant: a syllable without a
  descender, and a melisma with no syllable, get the same box as one carrying ɲ.
- **`:422` `ipaBaselineOf`** reads the IPA row. Where a system prints no IPA, it
  reads the Cyrillic row and subtracts `IPA_TO_CYR_BASELINE`. `underlayRows` and
  the midpoint are removed.
- **The Cyrillic row is outside by construction, from the renderer's spacing.**
  No clamp in the pane enforces it.

### 7.4 Page count before and after

**Expectation, stated before measuring:** unchanged at 3 pages on both scores,
because the last score page of each has slack.

| score | fixture | at 16 | at 20 | per system |
|---|---|---|---|---|
| Sunless 01 | 8 systems, 95 IPA and 95 Cyrillic syllables | 3 pages, score pages 6 + 2 | **3 pages**, 6 + 2 | +4 units on every system, e.g. 103 to 107 |
| T05 | 11 systems, 146 Cyrillic syllables, no IPA | 3 pages, 6 + 5 | **3 pages**, 6 + 5 | +4 units on every system, e.g. 108 to 112 |

**The T05 comparison is controlled.** My first T05 "before" count came from a
different fixture state, 10 systems with IPA on two. It is not comparable,
because system count follows syllable widths, not the row spacing. So the
constant was set back to 16 on the identical fixture, counted, and restored to
20. The Sunless before and after share one fixture.

**Result: 0 pages added on either score.** As expected.

### 7.5 Collisions, truncations, and the Cyrillic row

**Expectation, stated before measuring:**
- 0 collisions and 0 truncations on both scores.
- No box touching the Cyrillic row: 2 units of air on face metrics, about 4.5
  against the actual Cyrillic ink.
- Every IPA glyph inside the box.

Measured at 390 px in the dev server's pane, on screen geometry, keeping only
readings where the loupe's ring matched the page ring to within half a pixel:

| | Sunless 01 | T05 |
|---|---|---|
| notes | 96 | 160 |
| loupe collisions with the note's own accidental or dot | **0** | **0** |
| loupe truncations | **0** | **0** |
| **boxes touching the Cyrillic row, by face ascent** | **0**; minimum air **2** (±1 rounding) | **0**; minimum air **2** (±1 rounding) |
| **boxes touching the Cyrillic row, by actual ink** | **0**; minimum air 5.88 | **0**; minimum air 5.88 |
| IPA ink outside the box | 0; minimum air 0.80 | no IPA row in this fixture |
| one box height per system | all 8 systems | all 11 systems, baseline read from the Cyrillic row |
| stale readings discarded | 0 | 0 |

**Re-spacing the loupe is still not needed.** Every count is zero, so Dann's new
permission was not used.

### 7.6 Gates

| gate | result | moved |
|---|---|---|
| 1 | 216 passed (216) | no |
| 2 | 235 passed (235) | no |
| 3 | 0 errors and 7 warnings in 4 files | no |
| 4 | **1173 passed (1173)** | no, same as §4 |
| 5 | **550 passed, 5 skipped (555)** | no; the new assertion sits inside an existing test |

### 7.7 NOT ESTABLISHED, added

- **The unrounded face metrics**, and so the exact air. It is known only as about
  2 units, ±1.
- **T05's IPA row under the new rule.** T05 had no IPA text in this fixture, so
  its IPA-ink check could not run.
- **Pagination on a longer song.** Both scores kept 3 pages, but the 4 units per
  system will add a page wherever a page was already full.
- **How the taller systems read to Dann on screen and in print.**

---

## 8. Appended: the width holds the IPA syllable

This follows `docs/memory/OPEN.md` §N.141, INCREMENT: THE WIDTH IGNORES THE IPA,
found by Dann on the walk of `debdf02`. **Not committed and not staged. WRITTEN,
not walked by Dann.**

### 8.1 What changed

- **`packages/score-parser/src/staff-renderer.ts:2750`.** Every IPA syllable now
  carries `data-ipa-of="<event id>"`, the same stamping as `data-withheld`. The
  column's x is not a safe key, because a melisma's syllable is left-anchored.
- **`staff-renderer.test.ts:918`.** One new test: every IPA text carries the
  handle, and each handle names an event the system draws.
- **`apps/web/src/lib/shane/VoiceProfilePane.svelte:515`.** The box's left and
  right edges are the union of the notation's ink and the syllable's rendered
  ink, found by the handle, padded by the same `RING_PAD_X`, and floored at
  `RING_MIN_W`.
  - A withheld syllable's sigla, `data-withheld`, is held the same way. **DESK
    DEFAULT.**
  - A note with no syllable keeps the notation's width.
  - The Cyrillic row is not read.
- **`VoiceProfilePane.svelte:357`, `glyphInk`: a fix to the ink measurement
  itself.** It centred a middle-anchored string's INK on x. SVG centres the
  string's ADVANCE on x, and an IPA syllable's ink is not symmetric in its
  advance: the stress mark hangs left and the superscripts trail right. So the
  measured ink sat in the wrong place on exactly m. 15's kind of syllable. It now
  places the advance first and reads the ink from it. Notation glyphs carry no
  anchor and are unaffected.

**Nothing in `Loupe.svelte` changed.** The loupe draws the page ring's geometry
across the whole strip, so the wider box reached it for free, as the cheap route
predicted.

### 8.2 Measured, 390 px, pane hidden, DOM geometry

**Expectation, stated before measuring.**
- No IPA glyph touches its squircle on Sunless, on either surface.
- Still 0 accidental collisions and 0 Cyrillic contacts.
- Possibly a few loupe truncations from long melisma syllables near the window's
  edges.
- T05 might have no IPA row in the pane.

**The IPA instrument is deliberately not the pane's own.** It is an independent
canvas measurement placed by its own advance arithmetic, widened to the union
with the text's SVG layout box. That is conservative: it can only report less
air than there is.

| | Sunless 01 | T05 |
|---|---|---|
| notes | 96 | 160 |
| notes with an IPA syllable | 95 | **0**: no IPA text in this fixture |
| **IPA glyphs touching or crossing their own squircle, page** | **0** | not testable |
| **the same, loupe** | **0** | not testable |
| minimum IPA side air, page | 1.91 | n/a |
| loupe collisions with the note's own accidental or dot | 0 | 0 |
| loupe truncations | 0 | 0 |
| boxes touching the Cyrillic row, by face ascent | 0; minimum air 2 (±1 rounding, §7.1) | 0; minimum air 2 (±1 rounding) |
| boxes touching the Cyrillic row, by actual ink | 0; minimum air 5.88 | 0; minimum air 5.88 |
| stale readings discarded | 0 | 0 |

**The truncations I expected did not appear.**

### 8.3 Dann's three cases, with a positive control

The control re-checks each syllable against a box sized by the notation alone,
which is the old rule. The instrument must fail there for the pass to mean
anything.

| measure | syllable as drawn | notation-only box: left and right air | now, page | now, loupe |
|---|---|---|---|---|
| m. 15 | « ˈpʲe » | **−2.45** and 3.96: the stress mark crosses | inside, 1.91 and 3.96 | inside, 1.84 and 3.83 |
| m. 8 | « ʃʲʃʲɪm » | **−5.56** and **−4.46**: crosses both sides | inside, 3.00 and 2.23 | inside, 2.23 and 1.66 |
| m. 4 | « ɲɪ » | 1.02 and 1.76: inside, but under one stroke-width of air | inside, 3.00 and 2.15 | inside, 2.90 and 2.09 |

- **m. 8's syllable is drawn as « ʃʲʃʲɪm »**, a doubled ʃʲ, not « ʃʲːɪm » as the
  finding records it. The codepoints are U+0283 U+02B2 U+0283 U+02B2 U+026A
  U+006D.
- **m. 4's case measured as inside the old box by a hair.** Dann saw it tangent,
  and under 2 units of air at page scale reads as tangent, so his reading and the
  numbers agree. It now has 2.15 or more on both surfaces.
- **Three more syllables** crossed the notation-only box by about 6 units and are
  now inside: « ˈʃʲʃʲɑsʲ » on m. 13 and « ˈnotʃʲ » on m. 16 and m. 17.

### 8.4 Gates

| gate | result | ship script reads | moved |
|---|---|---|---|
| 1 | 216 passed (216) | 216 | no |
| 2 | 235 passed (235) | 235 | no |
| 3 | 0 errors and 7 warnings in 4 files | same | no |
| 4 | **1173 passed (1173)** | 1173 | no |
| 5 | **551 passed, 5 skipped (556)** | 550 / 555 | **+1**, the `data-ipa-of` test |

**`~/Downloads/ilya-ship.sh:80` will refuse until it moves to 551 and 556.**

### 8.5 NOT ESTABLISHED

- **T05's IPA row.** No IPA text drew on T05 in this pane, for the third time, so
  the new check has no T05 case.
- **Where a wider box now reaches a neighbour on the page.** It is accepted by
  ruling, so it was not counted.
- **A withheld syllable's sigla.** Neither score carried one, so the DESK DEFAULT
  was not exercised.
- **Desktop width, and Dann's eye.**
