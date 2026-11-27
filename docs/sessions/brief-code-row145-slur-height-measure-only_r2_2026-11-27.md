# Brief r2: a slur's height, THE MEASURE ONLY (QUEUE row 145)

2026-11-27, written by the desk (Opus 5) for Code on Dann's Mac. Branch: cut from `Shane` at `79d6d18e` or later.
**Supersedes r1 (md5 `d22d1998`), which Fable returned DO NOT SEND on with five blockers**
(`review-fable-brief-row145_r1_2026-11-27.md`, md5 `cf78b4f8`). **r1 diagnosed the fault wrongly and its repair would
have made unobstructed slurs taller.** This brief keeps nothing and changes no code. The build brief is written from
its report.

## What a singer meets

Dann reported the slurs twice, on 2026-10-20 and again on 2026-11-27, and the second time sent four pictures of
Ilya's own drawing with a verdict on each. The desk measured all four from the pixels, rise meaning the arc's height
above the straight line joining its own two ends, staff space from the median gap between staff lines:

| his verdict | span (sp) | rise (sp) | ratio |
|---|---|---|---|
| **"absurd"** | 22.60 | 9.88 | 0.437 |
| a triplet, **"poor"** | 8.10 | 3.21 | 0.396 |
| **"beautiful"** | 9.50 | 1.80 | 0.189 |
| short slurs, **"acceptable, not engraver-quality"** | 2.60 to 2.70 | 0.83 to 0.88 | 0.32 |

## What r1 got wrong, so this lane does not inherit it

**`ties-and-slurs.ts:417` is `Math.min(24, 10 + (xB - xA) / 20)` in RAW PIXELS, not staff spaces.** At the shipping
`lineGap` of 5.5 (`apps/web/src/lib/score/engraving.ts:35`), with the apex at half the depth, the base law gives a
rise of `0.909 + span/40` staff spaces: **0.98 at a 2.65-space span, 1.15 at 9.5, and 1.47 at 22.6.** Its cap of 24 is
reached only at a span of 280 px, which is 50.9 staff spaces.

**So the base law does not run away at the long end**, as r1 said. At 22.6 spaces it asks 1.47, and all of the
remaining 8.4 comes from obstacle clearance in `solve()` (`:418-445`). **Fitting the base law to his "beautiful" 1.80
would fit the wrong term**, since the base law gives 1.15 at that span, and would raise every unobstructed slur.

**And the ceiling is in staff spaces while the law is in pixels:** `:460` uses `sp(SLUR_SHALLOW_APEX_SP)` where
`:417` does not, so the 24 px cap is 2.18 staff spaces at `lineGap` 5.5 and 1.0 at `lineGap` 12. The tree renders at
more than one stave size.

## His ruling this lane serves, which r1 never cited

Dann 2026-10-20 16:07, transcribed as written in `QUEUE.md` row 145: the cap *"is a default, not a wall. The slur
takes the cap's height unless a note, a ledger line, an accent, or a beam under its span needs more room, and then it
rises only as far as that needs, with its clearances kept."* **Any build brief written from this measure obeys that.**
r1 clamped instead, and its own done-when would have failed a lane that followed him.

## The mechanism this lane is measuring

`solve()` clears every inner note and every bracket point by dividing the needed clearance by
`room = Math.max(2 * t * (1 - t), 0.05)` (`:423-424`, `:440-441`), so a constraint near an end is amplified: at
t = 1/6 by 3.6 times. For a slur over a bare tuplet numeral the stack above the run's highest ink is
`yBr = minY - 8` (`staff-renderer.ts:2252`), the numeral's top at `yBr - 4.75` (`tuplet-bracket.ts:40-42`), and
`s * clear` on top of that with `SLUR_CLEAR_SP = 6 / 5.5` (`:47`, `:434-435`): **18.75 px, or 3.4 staff spaces,
before the division by `room`.**

## Steps, all measurement, nothing kept

### 1. The four pictures, each one identified in the running app

For each of the four slurs Dann judged, taken from the song and bar they were captured from:

- Whether it is **printed** (`planPrintedSlurs`, `:315`, drawn `data-slur-printed` at `:556`) or **derived**
  (`drawDerivedSlurs`, `:199`, drawn `data-slur` at `:259`). **The derived slur has its own copy of the law at
  `:237`**, which r1's site table missed.
- The **`lineGap` of that render**, because every staff-space figure above depends on it.
- **Which constraint binds**: the base law, or a named inner note with its index, its `t`, its `room`, and which of
  the three terms in `clearAt` (`:361-371`) demanded the height, or a bracket point (`:432-435`).
- Whether the slur ran as an **inside job** (`:532`, `:494`), because a slur wholly inside a tuplet's run is never
  constrained by the numeral.
- The **measured rise and span in staff spaces**, reported beside the desk's figures above, so the two agree or the
  disagreement is named.

**Stop and report if the base law binds on any of the four.** The repair then is not the one this lane assumes.

### 2. Why 0.98 is not 0.85

The base law gives 0.98 staff spaces at a 2.65-space span, and Dann's short slurs measure 0.83 to 0.88. **One of the
stave size, the desk's pixel measurement, or the law's reading is wrong, and the build brief cannot be written until
which is known.** Report the arithmetic.

### 3. The clearance stack, per tuplet slur on the test set

For every slur that passes over a tuplet, the stack as drawn: `minY`, `yBr`, the numeral's top, the added `clear`,
the resulting demand, its `t` and `room`, and the apex that falls out. **This is the figure a repair would trim**, and
it is the one that decides whether trimming the clearance is enough on its own.

### 4. The whole test set, as a table

Every slur Ilya draws on the project's set: span, rise, ratio, printed or derived, binding constraint, whether the
end-moving rule at `:452-481` fired or gave up at `:463`, and whether a tuplet lies under it. **This is the before
column of the build brief's done-when, and the only honest basis for a growth law.**

### 5. What is above a tuplet run

For each run, what else stands over it (bar numbers at `staff-renderer.ts:2215`, and whatever else the lane finds),
and whether anything checks a raised bracket against it. **A build brief that moves a numeral needs this and the
desk does not have it.**

## The sites that compute a slur's height, corrected from r1

| site | what it computes | r1 said |
|---|---|---|
| `ties-and-slurs.ts:417`, with `:446`, `:479` | the **printed** slur's depth | "the printed and derived slur's depth", which is false |
| `ties-and-slurs.ts:237` | the **derived melisma** slur's depth, its own copy of the same expression | not named at all |
| `grace-draw.ts:193` | the grace group's slur depth, already scaled to the stave, a rise of 0.3 to 0.6 sp | named |
| `ties-and-slurs.ts:164-168` | a **tie's** depth, fixed and shallow, not span-dependent | named, and not changed |

**Readers of `depth` a build brief must check:** `:461` (the end-moving trigger), `:240` and `:559-561` (the ink
reserved at the control point, which sets the system's height), `:557`, and the below-slur side tests at `:489-490`
and `:513`.

## What the build brief will have to carry, named here so it is not rediscovered

- **Dann's 16:07 ruling**, above.
- **The pinned tests a numeral move would turn red:** `row126-slur-clearance.test.ts:76-87`,
  `row129-bracketless-triplet.test.ts:107-114` and `:116-125`. **The lane stops for his look before rewriting a test
  that pins a shipped row.**
- **The recorded convention it would reverse:** `:302-307` says a slur wholly inside a bracket's run goes under it and
  every other slur that overlaps a bracket passes over it. Putting a numeral above a slur that extends past the
  tuplet reverses that, and **it is taste and his**: slur over numeral with less air, or numeral over slur.
- **Row 129's ruled placement** (Dann 2026-10-19 23:21): the bare 3 stands over the meeting of the stem terminus with
  the beam, and the slur changes contour to clear it.
- **The caveats on the research numbers.** Finale's 0.71 at a 2.65-space span is a CONTROL-POINT height reached by
  the helper's own linear interpolation where Finale says only "proportional"; MuseScore's figures rest on the
  helper's own 0.75 factor and sit below Dann's "beautiful" at 9.5; Sibelius's figures are not stated to be rise or
  control height. **r1 used all three as if they were rises. None of them may set a target.**

## What could not be established, and this lane settles

- Which constraint binds on each of the four pictures, and whether each is derived or printed.
- The stave size of those renders.
- Whether the "poor" triplet lies inside its run or extends past it.
- What stands above a tuplet run.
- LilyPond's own function joining `height-limit` 2.0 and `ratio` 0.25, which Dann's direction of 2026-10-20 16:06
  names and which no source read so far gives.

**NOT ESTABLISHED beats a complete invented answer.**

## Reporting

One report to `docs/sessions/`. Commit nothing. Change no code. The build brief is written from this report and gets
its own Fable review.
