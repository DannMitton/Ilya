# Fable's review of the row 126 brief, r1

Reviewed by Fable (subagent of the desk) 2026-10-19 22:0x to 22:2x, against `cloud-lane-11` at `f93b9e5` in the desk's workspace, read only, with the Gould scan's pages and the desk's walk pictures. 199,067 tokens against a stated worst case of 350k. Verdict and amendments verbatim below; all nine applied in r2 (`brief-code-row126-slurs-beam-and-bracket_r2_2026-10-19.md`). Amendment 5's open choice, taken by the desk (DESK DEFAULT 22:2x): beamed up-stem ends only; unbeamed stem-side ends are a later row (Gould p. 111 makes them optional; Dann reported the beamed case). The first item of "For the desk" (the `:423` sign) was folded into r2 as its item 3, being the same function. The desk checked by reading: `stemHalfDown` negative (`staff-renderer.ts:1302`, `:1307`), added at `:2045` and `:3110`, subtracted at `ties-and-slurs.ts:423`; the six approved SVGs with `data-tuplet` carry no `data-slur-printed`; `n188-markings.test.ts:36`, `:198`, `:399`; `engraving.ts:35`. One correction to the review: the slur path is at `arc-outline.ts:96` (the file has 99 lines), not `:100`.

**SEND WITH AMENDMENTS**

1. **Mandate a new fixture file; drop the "new last bar" option.** Two tests pin the fixture at five printed slurs (`packages/score-parser/src/n188-markings.test.ts:198` and `:399`), and the fixture is `divisions 1` (`fixtures/n188-markings.musicxml:11`), so a bar at divisions 24 would also need a mid-score `<attributes>`. Appending contradicts "Every existing N.188 test passes unchanged." Wording: *"A new fixture `fixtures/row126-song1-bars-9-10.musicxml`, divisions 24, key fifths 3, G clef, stamped `<identification><encoding><software>homr</software></encoding></identification>` in the file itself. Do not touch `n188-markings.musicxml`."*

2. **Tests (a) to (c) must render at the shipping stave, `lineGap: 5.5`** (`apps/web/src/lib/score/engraving.ts:35`). The N.188 harness uses `lineGap: 12` (`:36`). The clearances do not scale alike: `SLUR_CLEAR_SP` is 6/5.5 sp (`ties-and-slurs.ts:46`), so 13.1 px at 12, while the bracket's gap is a fixed 8 px (`staff-renderer.ts:2300`) and its numeral top is about `yBr − 4.75`. At 12, an item-1 end at `tipY − 13.1` already stands above the bracket line at `tipY − 8`, so test (b) passes without item 2 and catches nothing. At 5.5 the end sits at `tipY − 6`, 2 px under the line, which is the fault. Wording: *"Render the fixture with `{ ...OPTS, lineGap: 5.5, staffMidY: 60 }` for (a), (b), (c); keep (d) at both."*

3. **Item 2 as written misses the end that is inside the run.** `clearAt` is called for inner notes only (`:373-377`, `:385-389`); bar 10's second slur starts ON the run's first note and is not wholly inside, so under item 1 its start lands under the bracket line (point 2) and the arc rises through it. Add to item 2: *"An end whose x lies within the bracket's span `[xa, xb]` takes `outer(itsLevel, yBr + s*clear)`. In `solve`, add constraint points for the bracket, not placed indices: `(max(xa, xA), yBr + s*clear)`, `(min(xb, xB), yBr + s*clear)`, and the numeral box's two upper corners. The arc is concave, so clearing those points clears the span."* Also state the order: *"Plan slurs wholly inside a bracket first, raise the brackets from their apexes, then plan the rest, so an outside slur clears the raised line. A raised bracket lowers `highestInk` again (`:2301` recorded the old `yBr`)."*

4. **The second fixture bar does not add up.** Three triplet eighths (8 each) plus a half rest (48) is 72 of 96. Recommend bar 9 of song 1 verbatim (D5 quarter 24; C♯5, B4, A4 triplet eighths 8 each, tuplet start/stop, slur 1 start on C♯5 and stop on A4; B4 eighth 12; eighth rest 12; D4 dotted eighth 18; E4 sixteenth 6 = 96). It is Dann's real inside case, its stems are down positionally (C♯5 furthest from B4, `:2104-2110`), and the fixture becomes "song 1, bars 9 and 10". Name the pitches either way.

5. **Item 1 reaches further than bar 10; say so or narrow it.** Every stem-side slur drawn above moves (all five N.188 fixture slurs, song 1 bars 5, 7, 12, 18, which Dann saw as fine). Three fixes to the wording:
   - Restrict to `dir === 'above'`. Applied below, the ends of a `placement="below"` slur over beamed down-stems drop under `beamLow` (`staff-renderer.ts:3242-3245`), and `:436-439` flips it above. That is a silent behaviour change the brief calls "unchanged".
   - Add Gould's p. 111 clause (read on the scan): where the two end notes' stems point opposite ways, an unbeamed stem-side end stays at its head "so it does not tilt contrary to the direction of the pitches". A beamed end always goes outside the beam.
   - Either state that unbeamed stem-side ends move by design and add bar 18 to the pictures, or limit this row to beamed ends and name the rest as a follow-up. Desk's call; the first is Gould's default, the second is Dann's reported case only.
   - The stem x: do not copy `:423`. `stemHalfDown` is negative (`staff-renderer.ts:1302`, `:1307`) and the beam and stem passes add it (`:2045`, `:3110`); `:423` subtracts it, so a down-stem end would land right of the head. Wording: *"a beamed end sits at `beamStemById.get(id).sx`; an unbeamed one at `px + (up ? stemHalfUp : stemHalfDown)`. Leave `:423` as it is and name it in the report."*
   - The end's level is `outer(levelAt(k), tipY + s*clear)`, not a replacement: a mark placed above the stave still counts.

6. **Define the numeral's box and the gap once, shared by code and test.** The SVG carries no box (`:2311`). Wording: *"x from `midX − 7` to `midX + 7` (the gap the line leaves, `:2308-2309`); top at `yBr + 3.5 − 11 × 0.75`; export the constant. Test (c) asserts `yBr ≤ apex − 8`; the numeral's descender then sits 4.5 px above the apex, as it sits above notes today. Test (a) takes the beam's top as `tipY − beamT/2`, and samples the quadratic at 50 points over the beam's span."* A test cannot call `planPrintedSlurs` with the renderer's `ArcCtx`; strike that option and read the `M x1 y1 Q cx cy x2 y2` path (`arc-outline.ts:100`).

7. **Guard the approvals and the numeral string.** Six files in `packages/score-parser/src/approval/__approved__/` carry a `data-tuplet` group and no printed slur; `staff-renderer.test.ts:633-634` pins `font-style="italic" fill="#1a1612">3<`. Wording: *"No approved SVG changes and none is re-approved; the bracket's constants (6, 8, 5, 7, 3.5, 11) and attribute order stay."* For the line budget, name the cheap path: the tuplet pass keeps its geometry and pushes a record instead of the string at `:2305-2313`; a new module builds the markup at `:3394`. That nets fewer lines than today.

8. **Small corrections.** The tuplet pass is `:2267-2328`, not `:2310`. "All eight gates at baseline" conflicts with adding tests: say "web-test 2849 unchanged; score-parser 744 plus the new tests, 5 skipped".

9. **Citations.** Dorico's page says brackets sit close "without colliding with other notation", not "with slurs"; the inside/outside sentences are as quoted. Gould p. 117 is about articulation marks; the slur clause is p. 110, "in cramped conditions a long slur may go above the stave whatever the stems" (desk notes item 4). Cite that and mark p. 117 as analogy.

## For the desk, not this brief

- `ties-and-slurs.ts:423` sign slip on down-stem ends (point 5). One row, one test.
- The derived melisma slur can meet a bracket: its level is `min(tipY) − 6` with lift ≥ 10 at 5.5 (`:220-239`), apex about `tipY − 11`; the bracket line is `tipY − 8`. Song 1 is a scan, so it does not show there.
- The bracket's constants and the slur's `lift` (`:382`) are unscaled px; everything else here is in sp.

## Could not establish

- The gate counts 2849 and 744 (no runs allowed here).
- Whether grace notes ever reach `placed`; the A.2a test implies they are dropped before the vocal line.
- Whether a `<software>homr</software>` fixture uploads through the Markup route for the pictures; song 1 did.

Sources: [Dorico, General placement conventions for tuplets](https://archive.steinberg.help/dorico_pro/v3/en/dorico/topics/notation_reference/notation_reference_tuplets/notation_reference_tuplets_general_placement_conventions_c.html)
