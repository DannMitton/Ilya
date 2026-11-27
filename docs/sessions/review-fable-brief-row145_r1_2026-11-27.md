DO NOT SEND

# Review r1: brief r1, a slur's height (QUEUE row 145)

2026-11-27, Fable, for the desk. Brief read in full: `docs/sessions/brief-code-row145-slur-height_r1_2026-11-27.md`, md5 `d22d1998e6e8a1edaabf9e51505ce7c5` (matches). Tree: branch `Shane` at `79d6d18e`, `dd14f78b` is an ancestor. Every code line below was opened in this session. Paths are under `packages/score-parser/src/` unless stated. Nothing in the tree was changed; this file is the only write.

Terms: "base law" is mine, for the expression at `ties-and-slurs.ts:417`. "Rise", "span", and "ceiling" are the brief's.

## Blockers

**B1. The base law does not run away at the long end. The brief's diagnosis of the "absurd" slur is wrong, and step 1 as written makes unobstructed slurs taller.**
`ties-and-slurs.ts:417` is `Math.min(24, 10 + (xB - xA) / 20)`, in raw px, not through `sp()`. At the shipping `lineGap` of 5.5 (`apps/web/src/lib/score/engraving.ts:35`), with apex equal to half the depth, the visible rise is `0.909 + span / 40` staff spaces:

| span (sp) | base law today | Dann's picture | brief's step 1 target |
|---|---|---|---|
| 2.65 | 0.98 | 0.83 to 0.88 | 0.6 to 0.7 |
| 9.5 | 1.15 | 1.80 | about 1.8 |
| 22.6 | 1.47 | 9.88 | 2.18 |

The cap of 24 is reached only at a span of 280 px, which is 50.9 staff spaces. So at 22.6 spaces the base law asks for 1.47, and all of the remaining 8.4 comes from `solve()` (`:418-445`). The brief's sentence "Ilya uses a straight line, which sits too high at the short end and runs away at the long end. That is both of Dann's complaints" is false at the long end. Consequence: step 1's fit ("about 1.8 at 9.5, and at the ceiling by 22.6") raises every unobstructed slur of 9.5 spaces by 57 per cent and every unobstructed slur of 22.6 spaces by 48 per cent. Dann's two reports (2026-10-20 15:49, 2026-11-27) are of slurs that are too tall. The step moves the wrong way for every slur the obstacle rule does not touch.

**B2. Step 2 and done-when 5 turn Dann's cap into a wall, against his recorded ruling.**
`docs/memory/QUEUE.md:255` records Dann 2026-10-20 16:07: the cap "is a default, not a wall. The slur takes the cap's height unless a note, a ledger line, an accent, or a beam under its span needs more room, and then it rises only as far as that needs, with its clearances kept." The same row says "the design is his direction of 2026-10-20 16:06 and 16:07 and it is already recorded." Step 2 ("the apex is clamped to `SLUR_SHALLOW_APEX_SP`") and done-when 5 ("No slur anywhere on the test set exceeds 2.18") are the wall. The brief does not cite the 16:07 ruling at all. A lane that follows his ruling fails done-when 5.

**B3. Clamping a single quadratic deletes the inner-note clearance, and the escape clause draws the collision.**
`solve()` clears every inner note at `:420-426` by dividing the needed clearance by `room = max(2t(1-t), 0.05)` (`:423-424`). For a note near an end, `room` is small, so the depth is multiplied: at t = 1/6, by 3.6. That amplification, not the base law, is the mechanism that can produce a 9.88 rise. `clearAt` (`:361-371`) asks for `accClear + clear`, at least 12 px (2.18 sp), above every inner note's turning pitch (`:366`, `:328`, `:330`), against 4 px at the ends (`:46`, `:355`). With level heads, an inner note at t = 1/6 already needs a depth of 28.8 px, an apex of 2.6 sp, above the ceiling before any tuplet is involved. Notes cannot move. So after step 2 the arc passes through the code's own clearances at inner notes, stems, and beams, and the brief's clause ("leaves the arc at the ceiling ... a collision that results is reported") draws it. That breaks done-when 6 and Dann's rule of 2026-10-11 03:42 in the same sentence that cites the rule. The brief has no route by which the absurd slur gets under 2.18 without a collision when its binding constraint is an inner note: the end-moving rule already gave up (`:463`), endpoints are out of scope, and the curve stays one quadratic (`arc-outline.ts:96`). `docs/memory/OPEN.md:3230-3232` records the same finding on 2026-10-19 (a parabola cannot keep a flat middle; "the end-point rule, in context, is the fix; the curve's construction follows from it"). Which constraint binds on each of the four pictures is NOT ESTABLISHED, and step 0 as written does not ask.

**B4. A fourth site computes a slur's height and the brief's table names it wrongly.**
The derived melisma slur is drawn by `drawDerivedSlurs` (`:199`), with its own copy of the law at `:237`: `Math.min(24, 10 + (last.x - first.x) / 20)`, drawn at `:259`, and reserved at `:240`. The brief's table says `:417`, `:446`, `:479` are "the printed and derived slur's depth". They are the printed slur's only (`planPrintedSlurs`, `:315`). Step 1 replaces `:417` alone, so after it the derived and printed slurs follow two laws on one page, and the comment at `:58-60` that derives `SLUR_SHALLOW_APEX_SP` from "the derived melisma slur's own ceiling" stops being true. Whether Dann's short and "beautiful" slurs are derived (`data-slur`, `:259`) or printed (`data-slur-printed`, `:556`) is NOT ESTABLISHED. If the short ones are derived, done-when 4 cannot be met by any step in the brief.

**B5. Step 2 reaches rows 126 and 129, which the brief puts out of scope, and reverses a recorded convention without Dann's yes.**
- `:302-307` records the rule the tree follows (Dorico's convention): a slur wholly inside a bracket's run goes under it; "every other slur above that overlaps a bracket in x passes over it." Step 2 puts the bracket or numeral above a slur that extends past the tuplet. The existing raise at `:492-500` runs only for the inside case (`:493-494`, `clearBrackets.length === 0`), so "Ilya already does exactly this" is true of a different geometry.
- Row 129 (`QUEUE.md:239`), Dann 2026-10-19 23:21: the bare 3 stands "directly over the meeting of the stem terminus with the beam", and "the slur should change contours slightly", that is, the slur clears the 3. Lifting the 3 above the slur's apex (`apex - 8`, `:500`) moves the numeral off the beam with an arc between them. That is row 129's placement, named out of scope at brief line 71.
- Pinned tests that step 2 turns red: `row126-slur-clearance.test.ts:76-87` (bar 10's second slur stays above the bracket line and the numeral's box), `row129-bracketless-triplet.test.ts:107-114` and `:116-125`. Done-when 7 ("all eight gates at baseline") then cannot hold, and the brief does not say these are expected to change.
This is taste and it is Dann's: slur over numeral with less air, or numeral over slur.

## Amendments

1. **Step 0 must name the binding constraint for each slur**, not only "whether a tuplet lies under it": the base law, inner note k and which of the three terms in `clearAt` (`:364-369`), or bracket point (`:432-435`), with t and `room`. Add: whether the slur is derived or printed, whether it ran as an inside job (`:532`), and the `lineGap` of the render. Without this, steps 1 and 2 are written against a guess.
2. **Rewrite the diagnosis after B1.** The long-end fault is `solve()`'s amplification and stacked clearances. For a slur over a bare numeral the stack is: `yBr = minY - 8` (`staff-renderer.ts:2252`), numeral top at `yBr - 4.75` (`tuplet-bracket.ts:41`), plus 6 px (`:434-435`), so 18.75 px (3.4 sp) above the highest ink of the run, before the division by `room`. Have step 0 report this stack per tuplet slur. A smaller clearance over the numeral is a repair that keeps row 129's placement; put both to Dann.
3. **Step 1: name the family, and say which of the three targets yields.** The targets cannot all be met by the one-parameter families the brief points at. An exponential to 2.18 through (9.5, 1.80) gives 0.84 at 2.65, which is today's measured value and fails done-when 4. The same exponential through (2.65, 0.65) gives 1.57 at 9.5. MuseScore's `c * sqrt(L)` through (9.5, 1.80) gives 0.95 at 2.65 and 2.78 at 22.6. A capped power law or Finale-style buckets fit, with a kink. The brief has to choose; "the lane picks" hands a taste decision to Code.
4. **Step 1 must not raise any slur without Dann's word.** Either hold the law at or under today's values above some span, or put "unobstructed 9.5-space slurs rise from 1.15 to 1.80" to Dann as the question. The "beautiful" 1.80 was not produced by the base law (1.15 at that span), so fitting the base law to it fits the wrong term.
5. **Write the new law in staff spaces through `sp()`.** `:417` and `:237` are raw px while the ceiling at `:460` is `sp(SLUR_SHALLOW_APEX_SP)`. The tree renders at more than one stave size (`row126-slur-clearance.test.ts` BEFORE table, `@5.5` and `@12`); at `lineGap` 12 the cap of 24 px is an apex of 1.0 sp, not 2.18. The brief's "2.18" for `:417` holds at 5.5 only. State the stave size of Dann's four pictures; it is NOT ESTABLISHED, and the base law's 0.98 at 2.65 does not match the measured 0.83 to 0.88.
6. **Replace the clamp with Dann's rule of 16:07**: the ceiling binds the base law and any movable obstacle; a note, ledger line, accent, or beam that needs more lifts the arc only as far as it needs. Then done-when 1 reads against the cause step 0 finds, and done-when 5 becomes "no slur exceeds 2.18 unless step 0's table names the fixed obstacle that needs more, and by how much".
7. **Done-when 6 needs a measure.** Say whether "collides" means ink overlap or a breach of the planner's clearances (`:46-47`, `:70`, `:328`), and by what instrument (sampled outline against boxes, as `row126-slur-clearance.test.ts:83-86` does). Add ledger lines and accents, which Dann named at 16:07, and whatever sits above a raised bracket.
8. **If any bracket still moves, order and neighbours.** Plans run inside jobs, then through jobs, then the rest (`:543-545`). A bracket raised by a later job invalidates an earlier slur planned against its old level (`:382`, `:412`). A raised `yBr` also lifts `highestInk` (`staff-renderer.ts:3362-3364`) and so the system's top (`:3409`). What else stands above a run (bar numbers at `staff-renderer.ts:2215`, others) and whether anything checks a raised bracket against it is NOT ESTABLISHED.
9. **Correct the site table and the reader list.** Four sites: `:237`, `:417` (with `:446`, `:479`), `grace-draw.ts:193`, and the tie at `:164-168`. Readers of the depth beyond the brief's three: `:461` (end-moving trigger), `:240` and `:559-561` (ink reserved at the control point, which sets system height), `:557`. A smaller depth also changes the side test at `:489-490` and `:513`: more below-slurs stay below. The brief notes that one; keep it.
10. **Name the tests expected to change** (B5) and say the lane stops for Dann's look before rewriting a test that pins a shipped row.

## The eight checks

**1. Citations.** Table below. Fourteen true, one true with a wrong label, one false row in the site table.

**2. Central arithmetic.** Holds, at `lineGap` 5.5 only. The outer edge is one quadratic with its control at the chord midpoint plus `depth` (`arc-outline.ts:92`, `:96`), so the rise above the chord is `depth / 2` at t = 0.5; the ink thickens inward (`:93`). `24 / 5.5 / 2` is 2.18 (`:64`), and 24 px at `:417` is the same at 5.5. `lift` is px, not staff spaces (amendment 5). The chain is sound; what the brief built on it is not (B1).

**3. Done-when, item by item.**

| item | passes with the absurd slur still on the page? | fails a correct repair? |
|---|---|---|
| 1 | No. But it passes with the arc through an inner note or stem (B3). | Yes, where a fixed obstacle needs more than 2.18 and Dann's 16:07 rule lets the arc rise (B2). |
| 2 | Not applicable to the absurd slur. Passes at 2.18 over 8.1 (ratio 0.27, against his "beautiful" 0.19), so "poor" can survive it. | Yes. "The numeral has moved" fails a repair that trims the clearance, and fails if the numeral is not the binding constraint, which is NOT ESTABLISHED (a slur inside the run is never constrained by the numeral, `:532`, `:494`). |
| 3 | Yes. It is a guard and says nothing about the absurd slur. | Possibly, if that slur's 1.80 comes from a constraint the lane changes. NOT ESTABLISHED. |
| 4 | Yes. | Yes. Dann called the short slurs "acceptable, not engraver-quality"; he did not say too tall. The range comes from Finale's control-point figure (check 8). A law through his "beautiful" point lands at 0.84. If these are derived slurs, no step reaches them (B4). |
| 5 | No. | Yes, under his 16:07 ruling (B2). Also bounded to the test set. |
| 6 | Yes, if the absurd slur collides with nothing today. | Yes: contradicts the escape clause in step 2, and has no measure (amendment 7). |
| 7 | Yes. | Yes: three pinned tests go red under step 2 as written (B5). |

No item says what the absurd slur is caused by, so items 1 and 5 can be met by drawing a collision. That is the failure of the three earlier briefs in a fourth form.

**4. Does step 2 delete a capability?** Yes: clearance of inner noteheads, marks, accidentals, stem tips, and beams (`:361-371`, `:420-426`), for slurs above and below. The escape clause covers it only by drawing the collision and reporting it. See B3, B5, amendment 8.

**5. Is step 1 buildable?** Code can act on it, and will pick something. It is underspecified where it matters: the family decides which of done-when 3 and 4 can pass (amendment 3), and the fit points were not produced by the term being fitted (B1). Name the family.

**6. The grace slur.** `grace-draw.ts:193` is a separate object in the code: its own function, drawn at `:196` as a stroked path (`fill="none"`), always below, head to head, no planner, no clearance, control at `max(y1, y2) + depth` (`:195`). Its control depth is 0.6 to 1.2 `lineGap`, so a rise of 0.3 to 0.6 sp on level ends, already scaled to the stave. That sits under any law the brief proposes at grace spans, so the heights do not visibly disagree. The visible difference from a main slur is the untapered stroke, which is out of scope. The brief's either-or is adequate; the one-line statement is the cheaper path. The brief's description of the line is accurate.

**7. Scope.** Endpoints: no step moves them, though the fix B3 points at does. Tie: untouched (`:164-168`). Melisma rule: untouched, but the melisma slur's height law at `:237` is in scope and missing (B4). Row 126 bar 10 and row 129: step 2 reaches both (B5).

**8. Caveats.** Three launderings.
- Brief line 57 to 58: "his short slurs at 0.83 to 0.88 where Finale gives 0.71". The memo (`memo-slur-sources-finale-sibelius_r1_2026-11-27.md:79-83`) gives 0.71 as a control-point height, by the helper's linear interpolation where the manual says only "proportional", after the inch conversion. All three caveats sit on that number, and it sets step 1's "0.6 to 0.7" and done-when 4's range.
- "MuseScore about 0.61" and "about 1.78" rest on the helper's own 0.75 factor, "not stated in the code", for a level slur "before collision adjustments" (memo `:93`). The memo also says MuseScore's figures "do not match your measured table at any of the three spans" and sit below "beautiful" at 9.5 (1.16 against 1.80, memo `:98-101`). The brief's "four engines and Dann's eye land in the same place" drops that.
- Sibelius's "two-space slur one space high" and the 4.0 and 2.0 asymptotes are used as rises; the memo says whether they are control height or peak rise is "not stated" (memo `:108`).
Finale's 3.0 is flagged where it is used, and the brief does not compare it to 2.18. That one is clean.

## Citations checked

| citation | verdict | note |
|---|---|---|
| `ties-and-slurs.ts:417` | true | raw px; cap reached at 280 px of span |
| `:498` | true | `2 * t * (1 - t) * g.depth`, inside the bracket-raise loop |
| `:64` | true | `24 / 5.5 / 2` |
| `:47` | true | `6 / 5.5`, 1.09 sp |
| `:418-445` | true | `solve()` |
| `:420-426` | true | inner notes |
| `:429-442` | true | corners at `box.top + s * clear` (`:434-435`); the two bracket ends are at `bracketLevel` (`:432-433`), not at `box.top` |
| `:382` | true | |
| `:452-481` | true | runs for whole slurs only (`!half`, `:452`) |
| `:463` | true | |
| `:482` | true | no clamp |
| `:489`, `:513` | true | |
| `:492-500` | true | inside-run case only (`:493-494`) |
| `:164-168` | true | tie, `lineGap * 0.9`, plus a 3 px nudge |
| `tuplet-bracket.ts:40-42` | true | top is `yBr - 4.75` |
| `grace-draw.ts:193` | true | verbatim |
| `:434-435` (step 2) | true | |
| site table, "`:417`, `:446`, `:479` the printed and derived slur's depth" | **false** | printed only; derived is `:237` |
| "three sites compute one" | **false** | four |
| "`arc-outline.ts` `slopedArcOutline` ... needs no change" | true | `:81-99` |
| "`CONTRACT.md` section 4" as the every-site rule | not established | `docs/memory/CONTRACT.md` section 4 is titled "The ceiling, helpers, and git"; body not read |
| "base lift is capped to it (`:417`)", "4.5 times" | true | 9.88 / 2.18 = 4.53 |
| "runs away at the long end" | **false** | 1.47 sp at 22.6 (B1) |

## Not established

- Which constraint binds on each of Dann's four slurs, and whether each is derived or printed. I did not see the pictures and did not render.
- The stave size (`lineGap`) of his pictures, and why the base law's 0.98 at 2.65 differs from the measured 0.83 to 0.88.
- Whether the "poor" triplet's slur lies inside the run or extends past it, so whether the numeral constrains it at all.
- What stands above a tuplet run that a raised bracket could meet.
- What Gould says about a numeral above a slur. Not read.
- LilyPond's height formula. Dann's direction of 16:06 names LilyPond, and the brief's concavity paragraph leaves it out. `OPEN.md:3232` gives `height-limit` 2.0 and `ratio` 0.25; the function that joins them was not read this session and I give none.
- The desk's pixel measurements themselves.
- The gates were not run.

Tool uses: 12.
