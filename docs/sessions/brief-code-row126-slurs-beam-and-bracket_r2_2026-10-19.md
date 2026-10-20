# Brief for Code, cloud lane: row 126, a printed slur stays outside the beam and the triplet bracket, r2

r1 written by the desk (Opus) 2026-10-19 22:0x; **r2, 22:2x, applies all nine of Fable's amendments** (review returned 22:2x, SEND WITH AMENDMENTS; the one choice it left to the desk, amendment 5's scope, is taken below: beamed ends only). QUEUE row 126. For a cloud session, Sonnet 5.5, on branch `cloud-lane-11`, after row 123 (`f93b9e5`). Row 126's QUEUE entry, the desk's walk pictures, and the Gould reading notes are not on the branch; this brief carries what they say.

## What the singer sees

Song 1 of row 114, a homr reading of Dann's scan, in Markup on the Shane alias after N.188 (build `start.C6A-llvp.js`), bar 10. Two printed slurs are drawn badly:

1. **The first slur, a dotted F♯4 eighth to a G♯4 sixteenth, beamed, both stems up.** It is drawn above with its ends at the noteheads, so it arches in the gap between the heads and the beam, across the stems. Dann, 2026-10-19 21:51: *"the slurs in bar 10 look clumsy. the first one should be inverted or appear above the staff."*
2. **The second slur, from the first F♯4 of a sixteenth-note triplet to the E4 eighth after it,** runs through the triplet's bracket and numeral.

After this row, a slur drawn above over beamed up-stems arches over the beam; a slur longer than a triplet passes over its bracket and numeral; a slur wholly inside a triplet goes under the bracket, and the bracket rises to clear it. Nothing below the stave moves: the words keep their line.

## Why, and the rules

Elaine Gould, *Behind Bars* (2011), pp. 109 to 122, read by the desk 2026-10-19 22:0x from Dann's scan:

- **p. 111, "Slurs at stem end":** a slur on the stem side may come close to the noteheads, beside the stems, only where nothing is obstructed, and *"It should always remain outside a beam"*. Her example is two beamed notes: the slur over the beam, "and not" between the beam and the heads. That "and not" is what Ilya draws today.
- **p. 110:** with all stems one way, the slur usually goes on the notehead side; in cramped conditions a long slur may go above the stave whatever the stems. Ilya's printed-slur rule chooses above unless the file says below, so the words below never move (`packages/score-parser/src/ties-and-slurs.ts:301-305`, the choice at `:434-439`; Gould p. 117 allows all articulation above when the space below is limited, an analogy). **That rule stays.** Dann offered either side; the desk kept above (DESK DEFAULT 2026-10-19 21:5x), so this row makes "above" correct over a beam.
- **The bracket:** Gould's pp. 109 to 122 state no rule for slurs and tuplet brackets; her p. 113 example draws a long slur outside a triplet numeral. Dorico's documented convention (Steinberg, "General placement conventions for tuplets"): brackets sit as close to the notes as possible "without colliding with other notation, such as slurs"; a slur shorter than the bracket usually goes inside it; a slur longer than the bracket can go outside it. This row takes that convention as the rule.

## The code today

- The printed-slur plan: `planPrintedSlurs` (`ties-and-slurs.ts:307`), `geometry` (`:331-431`). An end starts at `levelAt` (`:342-349`: the head plus `SLUR_HEAD_ANCHOR_SP`, or beyond a marking). `clearAt` (`:351-361`) adds stem tips and beams, and is called for INNER notes only (`:373-377`, `:385-389`). **DANN'S END-POINT RULE** (`:396-429`) moves an end toward the stem only while an inner note forces a deep curve, and no further than `SLUR_STEM_END_SP` short of the stem tip (`limit`, `:406`), which is inside the beam. A two-note slur has no inner note, so its ends stay at the heads.
- The tuplet pass (`packages/score-parser/src/staff-renderer.ts:2267-2328`) places each bracket above all ink in its run (`yBr = minY - 8`, `:2300`), records `highestInk` (`:2301`), and builds its markup string there (`:2305-2313`); the slur plan runs at `:3245`, and the bracket markup is pushed at `:3394`. Neither knows the other.
- **`staff-renderer.ts` is at its ratchet ceiling (3435 lines; `scripts/ratchets.json:10`).** It may not grow. The cheap path: the tuplet pass keeps its geometry and pushes a record (run indices, `xa`, `xb`, `midX`, `yBr`, the tuplet's number) instead of the string at `:2305-2313`; a new module builds the markup at `:3394` from the records after the slur plan. That nets fewer lines than today. `ties-and-slurs.ts` (489 lines) has no ceiling.
- **Stem x.** A beamed note's stem x is `beamStemById.get(id).sx`. An unbeamed note's is `px + (up ? stemHalfUp : stemHalfDown)`; `stemHalfDown` is negative (`staff-renderer.ts:1302`, `:1307`) and the beam and stem passes add it (`:2045`, `:3110`).

## The work

1. **A slur drawn above clears the beam at a beamed up-stem end.** In `geometry`, only when `dir === 'above'`: an end whose note is beamed (`beamStemById.has(ev.id)`) and stems up (`stemUpFor(ev, y)`, not stemless) sits at that stem's x (`beamStemById.get(ev.id).sx`) and at `outer(levelAt(k), tipY + s * clear)`, where `tipY` is the beam's y at that stem. It is `outer` of the two, not a replacement: a mark placed above still counts. The curve is then solved as today (`solve`), so inner notes are still cleared. Unchanged: every end that is unbeamed, or stems down, or belongs to a slur drawn below; the below-side rule (`:436-439`); how a slur picks its side. (Unbeamed stem-side ends are a later row; Gould p. 111 makes them optional, and Dann reported the beamed case.)
2. **A slur and a tuplet bracket never touch.** For each bracket on the system (its run's first and last placed index, `xa`, `xb`, `yBr`, and the numeral's box) and each printed slur drawn above that overlaps it in x:
   - **The numeral's box,** defined once and exported, used by the code and the tests: x from `midX − 7` to `midX + 7` (the gap the line leaves, `:2308-2309`); top at `yBr + 3.5 − 11 × 0.75`; bottom at the line, `yBr`.
   - **A slur wholly inside the run** (its first and last slurred events both inside the run) **goes under; the bracket goes over.** Plan these slurs first. Then raise each such bracket so `yBr ≤ apex − 8`, where `apex` is the slur's highest point; the numeral moves with the line, and its lowest point then sits about 4.5 px above the apex, as it sits above notes today. A raised bracket updates `highestInk` (`:2301` recorded the old `yBr`).
   - **Every other slur that overlaps the run in x goes over** (it starts before the run's first event, ends after its last, or crosses two runs). Plan these after the brackets are final. An end whose x lies within `[xa, xb]` takes `outer(itsLevel, yBr + s * clear)`. In `solve`, add constraint points for the bracket, not placed indices: `(max(xa, xA), yBr + s * clear)`, `(min(xb, xB), yBr + s * clear)`, and the numeral box's two upper corners. The arc is concave, so clearing those points clears the span.
   - A rest inside a run belongs to the run, as it does today (`:2268-2269`).
   Do this for printed slurs only. Ilya's own derived melisma slur (`drawDerivedSlurs`, `:3250`) is out of scope.
3. **The end-point rule's down-stem x.** `ties-and-slurs.ts:423` computes `px - c.stemHalfDown`; since `stemHalfDown` is negative, a down-stem end lands right of its head. Correct it to the stem x above (`px + c.stemHalfDown`), and cover it with one test (a `placement="below"` slur over down-stems deep enough to move an end).
4. **Nothing else.** No change to ties, markings, fermatas, the derived slur, or any string. **No approved SVG changes and none is re-approved:** six files in `packages/score-parser/src/approval/__approved__/` carry a `data-tuplet` group and no printed slur, so they must come out identical; the bracket's constants (6, 8, 5, 7, 3.5, 11) and its attribute order stay; `staff-renderer.test.ts:633-634` (the numeral's `font-style="italic" fill="#1a1612">3<`) passes unchanged.

## Tests and the done state

1. **A new fixture, `packages/score-parser/src/fixtures/row126-song1-bars-9-10.musicxml`.** Do not touch `n188-markings.musicxml` (two tests pin its five printed slurs, `n188-markings.test.ts:198` and `:399`, and it is at divisions 1). The new file: one voice part, G clef, key fifths 3, 4/4, divisions 24, `<identification><encoding><software>homr</software></encoding></identification>` in the file itself, no `placement` on any slur (homr writes none). Bars 9 and 10 of the reading as homr wrote them, notes and notations unchanged:
   - **Bar 9 (the inside case):** quarter D5 (24); three triplet eighths C♯5, B4, A4 (8 each, `time-modification` 3:2, `tuplet` start on C♯5 and stop on A4, slur 1 start on C♯5 and stop on A4); eighth B4 (12); eighth rest (12); dotted eighth D4 (18); sixteenth E4 (6). Total 96.
   - **Bar 10 (the two faults):** dotted eighth F♯4 (18, slur 1 start); sixteenth G♯4 (6, slur 1 stop); three triplet sixteenths F♯4, G♯4, F♯4 (4 each, 3:2, `tuplet` start on the first and stop on the third, slur 1 start on the first); eighth E4 (12, slur 1 stop); quarter F♯4 (24); quarter rest (24). Total 96.
2. **Render at the shipping stave:** `{ ...OPTS, lineGap: 5.5, staffMidY: 60 }` (`apps/web/src/lib/score/engraving.ts:35`) for tests (a), (b), and (c). At the harness's 12 (`n188-markings.test.ts:36`) the clearances scale apart and (b) would pass without the fix. Keep (d) at both.
3. **Tests, reading the slur's `M x1 y1 Q cx cy x2 y2` path from the SVG** (`packages/score-parser/src/arc-outline.ts:96`, the outer edge of the closed outline); a test cannot call `planPrintedSlurs` with the renderer's context:
   - (a) bar 10's first slur: both ends at or above the beam's top at their stems (`tipY − beamT/2`), and, sampling the curve at 50 points across the beam's span, no point between the heads and the beam's top;
   - (b) bar 10's second slur: no sampled point inside the bracket line's band or the numeral's box;
   - (c) bar 9: the bracket's line satisfies `yBr ≤ apex − 8` for the slur under it;
   - (d) a two-note slur drawn above over beamed DOWN-stems, and one over unbeamed up-stems, are unchanged from today (compare paths before and after);
   - (e) the `:423` correction (item 3).
4. Every existing N.188 test passes unchanged. If one pinned the old geometry, stop and report it; do not edit it.
5. Pictures, as N.188's were (`docs/sessions/n188-shots/`): bars 9 and 10 in Markup at 1,440 px and at 390 px, before and after, into `docs/sessions/row126-shots/`.
6. Gates: phonology 267, dictionary 248, web-check 0 errors and 12 warnings, web-test 2849 unchanged, score-parser 744 plus your new tests (5 skipped), blurb 145, integration 55, ratchets OK. No ceiling raised; `staff-renderer.ts` not over 3435.
7. **DONE** is Dann's look at song 1, bar 10, on the alias after the merge.

## The lane

Branch `cloud-lane-11`, after row 123, its own commit and push. Never `Shane` or `main`; no pull request; Dann merges. Do not edit `docs/memory/`. Never commit a `brief-code-*` file: the brief lives in `/tmp/briefs` only. Report: `docs/sessions/report-code-row126_r1_2026-10-19.md`, with the diff by file and line, every constant added and whether it is from Gould, Dorico, or your judgement, the test counts, the pictures, whether the derived melisma slur can meet a bracket (one sentence, no change), and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
