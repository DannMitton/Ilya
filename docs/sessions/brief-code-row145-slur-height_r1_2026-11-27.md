# Brief r1: a slur's height (QUEUE row 145)

2026-11-27, written by the desk (Opus 5) for Code on Dann's Mac. Branch: cut from `Shane` at `dd14f78b` or later.
Serves QUEUE row 145, moved before the release by Dann 2026-11-27 01:08. **Fable review owed before this ships.**

## What a singer meets, and why this lane exists

She opens a song and the slurs are the wrong shape. Dann reported it twice, on 2026-10-20 and again on 2026-11-27,
and the second time he sent four pictures of Ilya's own drawing with a verdict on each. **Every number below is
measured from those pictures by the desk, in staff spaces, with the staff space taken from the median gap between
staff lines and the rise taken as the arc's height above the straight line joining its own two ends.**

| his verdict | span | rise | ratio |
|---|---|---|---|
| **"absurd"** | 22.60 | **9.88** | 0.437 |
| triplet, **"poor"** | 8.10 | **3.21** | 0.396 |
| **"beautiful"** | 9.50 | **1.80** | 0.189 |
| short slurs, **"acceptable, not engraver-quality"** | 2.60 to 2.70 | 0.83 to 0.88 | 0.32 |

**All four are Ilya's own output** (Dann, 2026-11-27 01:15). So the renderer already draws the shape he wants at some
spans and loses it at others, and this lane is a repair, not a rewrite.

## What the code does today, every line read 2026-11-27

1. **The base height is a straight line in span, capped.** `ties-and-slurs.ts:417`:
   `const lift = Math.min(24, 10 + (xB - xA) / 20)`. The apex sits at half the depth (`:498`, `2 * t * (1 - t) * depth`
   at `t = 0.5`), so that cap of 24 is an apex of 12 units, which at the shipping stave is **2.18 staff spaces**.
2. **A constant already names that same height.** `SLUR_SHALLOW_APEX_SP = 24 / 5.5 / 2` (`:64`), the same 2.18.
3. **Obstacle clearance overrides the base with no ceiling.** `solve()` (`:418-445`) takes the deepest requirement
   among every inner note (`:420-426`) and, for a tuplet the slur passes over, four pinned points: the bracket's two
   ends and **the numeral's two upper corners**, each at `box.top + s * clear` (`:429-442`), where
   `SLUR_CLEAR_SP = 6 / 5.5` (`:47`) is **1.09 staff spaces of air above the numeral**. For a bare numeral with no
   bracket, `bracketLevel` is the numeral's own top plus that clearance (`:382`), and the numeral's top is
   `b.yBr + NUMERAL_BASELINE_DROP - NUMERAL_PX * 0.75` (`tuplet-bracket.ts:40-42`).
4. **The only correction is moving the ends, and it gives up.** `:452-481` slides an end along its stem while the apex
   exceeds `SLUR_SHALLOW_APEX_SP`, and breaks where no end can move (`:463`): a stem pointing the wrong way, or an end
   already at its limit. **`:482` then returns that depth unclamped.**

**So the target height exists in the tree and nothing enforces it.** Dann's "absurd" slur is 4.5 times it. His
"poor" triplet is the same fault with the numeral as the obstacle, which is the cause he named himself at 01:13.

## What the published engines do, and where they agree

Research filed as `memo-slur-sources-finale-sibelius_r1_2026-11-27.md` (Sonnet, 126,002 tokens, 32 tool uses,
2.7 min), extending `memo-slur-engraving-sources_r1_2026-10-20.md`.

**On the ceiling, four engines and Dann's eye land in the same place.** LilyPond caps at 2.0 staff spaces. Ilya's own
constant is 2.18. MuseScore, which has no cap, reaches about 1.78 at a 22.6-space span. Sibelius has an asymptote of
4.0 at its default and 2.0 at its 50 per cent setting. Finale saturates at 3.0, measured to its control point, and
says the visible arc is "somewhat less" by an amount it does not publish. Dann's "beautiful" is 1.80. **The constant
is not retuned by this lane.**

**On the growth law, all three engines are concave and Ilya is not.** Finale uses four span buckets that stop growing
(1.5 spaces of span to 0.583 of height, 12 to 1.75, 36 to 3.0, 48 to 3.0). Sibelius uses an exponential approaching
an asymptote, with a two-space slur one space high. MuseScore uses `sqrt(L / 4)` for its control height. **Ilya uses
a straight line**, which sits too high at the short end and runs away at the long end. **That is both of Dann's
complaints, at the two ends of the same range**: his short slurs at 0.83 to 0.88 where Finale gives 0.71 and
MuseScore about 0.61, and his long one at 9.88.

**Caveats carried from the memo, and the lane does not launder them.** Finale's figures are control-point heights and
the difference from the visible rise is NOT ESTABLISHED. Sibelius publishes no constants for its exponential and no
defaults for its limit settings. The conversion of Finale's inches into staff spaces is the helper's arithmetic from
Finale's stated 1/12-inch default staff space and does not hold at other staff sizes.

## Scope

**In:** the height of a printed or derived slur above or below the stave, the growth law that sets it, the ceiling
that bounds it, and what happens when a tuplet numeral or bracket would push past that ceiling.

**Out:** the slur's endpoints, which Dann called precise on 2026-10-20 15:49; the tie's shape; the taper and
thickness of the stroke; the melisma rule; row 126's two bar-10 faults; row 129's bracketless triplet placement.

## Steps

### Step 0, measure only, keeps nothing, report before step 1

a. **Every slur Ilya draws on the project's test set, as a table:** span and rise above its own chord, both in staff
   spaces, the ratio, whether a tuplet numeral or bracket lies under it, and whether the end-moving rule at `:452-481`
   fired or gave up. This is the before column of the done-when.
b. **The four slurs Dann judged, found in that table and marked with his verdict**, so the lane is measured against
   the pictures he sent and not against a fixture.
c. **What the visible apex is as a fraction of `depth`**, confirmed by rendering rather than by reading `:498`, since
   every figure in this brief rests on apex equalling half the depth.
d. **How many slurs on the set exceed 2.18 staff spaces today**, and of those, how many have a tuplet under them.

Report. No code changes in step 0.

### Step 1, a saturating growth law

Replace the straight line at `:417` with a law that rises quickly at short spans and flattens toward the ceiling, in
the family all three engines use. **The lane picks the function and reports why**, fitted so that it passes close to
Dann's own four points: about 0.6 to 0.7 at a 2.65-space span, about 1.8 at 9.5, and at the ceiling by 22.6.
**`SLUR_SHALLOW_APEX_SP` is not changed.** The law is one named exported constant set, not numbers inline.

### Step 2, the ceiling is enforced, and the obstacle moves instead

After `solve()` and after the end-moving rule, **the apex is clamped to `SLUR_SHALLOW_APEX_SP`**. Where an obstacle
would need more room than that, **the obstacle moves, not the arc.** Ilya already does exactly this in one case: a
slur wholly inside a bracket's run raises the bracket to clear the slur's apex (`:492-500`, `run.yBr` mutated). This
step makes that the rule rather than the exception, and it covers the bare numeral, which today pins the arc at its
two upper corners (`:434-435`).

**Where the obstacle cannot move**, the lane reports the case and leaves the arc at the ceiling rather than above it;
a collision that results is reported, never drawn silently, because Dann's standing rule of 2026-10-11 03:42 forbids
collisions.

### Step 3, the grace note's own slur

`grace-draw.ts:193` computes a second, unrelated slur height:
`Math.min(m.lineGap * 1.2, Math.max(m.lineGap * 0.6, Math.abs(x2 - x1) * 0.25))`, a straight line in span with its own
floor and cap, drawn outside the slur planner. **The lane either brings it under the same law or states in one line
why a grace slur is a different object.** It does not leave two laws unremarked.

## The numbers this lane changes, and every other site that computes them

`CONTRACT.md` section 4. The number is **a slur's height**, and three sites compute one:

| site | what it computes | this lane |
|---|---|---|
| `ties-and-slurs.ts:417`, `:446`, `:479` | the printed and derived slur's depth | steps 1 and 2 |
| `grace-draw.ts:193` | the grace group's slur depth | step 3 |
| `ties-and-slurs.ts:164-168` | **a TIE's depth**, a fixed shallow value, not span-dependent | **not changed.** A tie is shallow by convention and is not a slur |

**What depended on them agreeing:** `:489` and `:513` test a below-slur's lowest point as
`(y1 + y2) / 2 + depth / 2`, and `:498` computes a bracket's clearance from the same depth. **A step that changes how
depth is produced without checking those three readers changes where a below-slur is allowed to sit and where a
bracket is raised to.** `arc-outline.ts` `slopedArcOutline` draws from `depth` and needs no change.

## The grep that was run before proposing this

`CONTRACT.md` section 4. Run 2026-11-27 in `packages/score-parser/src`: `grep -rn "depth"` filtered for slur, arc, and
curve, plus full reads of `ties-and-slurs.ts:296-500` and the constants at `:41-70`, and `tuplet-bracket.ts:30-52`.
**The ceiling this brief asks for already exists as a constant and as a trigger; it does not exist as a clamp.** The
lane adds the clamp and does not add a constant.

## Done when, measured against Dann's four pictures

1. **The slur he called absurd measures at or under 2.18 staff spaces of rise**, against 9.88 today.
2. **The triplet slur he called poor measures at or under 2.18**, against 3.21 today, and the numeral has moved rather
   than the arc.
3. **The slur he called beautiful is unchanged within a tenth of a staff space**, at 1.80. This is the item that stops
   the lane from flattening everything.
4. **His short slurs fall from 0.83 to 0.88 into the range 0.6 to 0.75.**
5. **No slur anywhere on the test set exceeds 2.18 staff spaces of rise**, counted from step 0's table.
6. **No slur collides with a notehead, a stem, a beam, an accidental, a numeral, or a bracket**, reported per slur.
7. All eight gates at baseline on the Mac; any baseline moved is reported with both figures.

Items 1 to 4 are read off rendered output at the same stave size as step 0, not from the source.

## What could not be established

- **How far below its control point Finale's visible arc peaks.** Finale says "somewhat less" and gives no figure, so
  Finale's 3.0 cannot be compared to Ilya's 2.18 directly, and this brief does not.
- **Sibelius's exponential constants and its default limit settings.**
- **Whether Finale's inch figures scale with staff size.**
- **Whether `avoidCollisions` changes MuseScore's height**, which the helper did not read in full.
- **Which slurs on the test set have a tuplet under them**; step 0 (d) settles it.

**NOT ESTABLISHED beats a complete invented answer.**

## Reporting

One report per step, written to `docs/sessions/` by the lane itself. Commit nothing. The lane stops and reports where
step 0 (c) finds that the visible apex is not half the depth, because every figure in this brief rests on it.
