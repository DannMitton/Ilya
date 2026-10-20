# Brief for Code, cloud lane: row 126, a printed slur stays outside the beam and the triplet bracket, r1

> **SUPERSEDED by r2** (`brief-code-row126-slurs-beam-and-bracket_r2_2026-10-19.md`, 2026-10-19 22:2x), which applies Fable's nine amendments (`review-fable-brief-row126_r1_2026-10-19.md`). Kept for the record; do not send.

Written by the desk (Opus) 2026-10-19 22:0x. QUEUE row 126. For a cloud session, Sonnet 5.5, on branch `cloud-lane-11`, after row 123 (`f93b9e5`). Fable reviews this brief before Code gets it (`CONTRACT.md` §1 item 19). Row 126's QUEUE entry, the desk's walk pictures, and the Gould reading notes are not on the branch; this brief carries what they say.

## What the singer sees

Song 1 of row 114, a homr reading of Dann's scan, in Markup on the Shane alias after N.188 (build `start.C6A-llvp.js`), bar 10 (notes below). Two printed slurs are drawn badly:

1. **The first slur, a dotted F♯4 eighth to a G♯4 sixteenth, beamed, both stems up.** It is drawn above, with its ends at the noteheads, so it arches in the gap between the heads and the beam, across the stems. Dann, 2026-10-19 21:51: *"the slurs in bar 10 look clumsy. the first one should be inverted or appear above the staff."*
2. **The second slur, from the first F♯4 of a sixteenth-note triplet to the E4 eighth after it,** runs through the triplet's bracket and numeral.

After this row, the first slur arches over the beam, and the second passes over the bracket and numeral without touching them. A slur that lies wholly within a triplet goes under the bracket, and the bracket rises to clear it. Nothing below the stave moves: the words keep their line.

## Why, and the rules

Elaine Gould, *Behind Bars* (2011), pp. 109 to 122, read by the desk 2026-10-19 22:0x from Dann's scan:

- **p. 111, "Slurs at stem end":** a slur on the stem side may come close to the noteheads, beside the stems, only where nothing is obstructed, and *"It should always remain outside a beam"*. Her example is two beamed notes: the slur over the beam, "and not" between the beam and the heads. That "and not" is what Ilya draws today.
- **p. 110:** with all stems one way, the slur usually goes on the notehead side. Ilya's printed-slur rule chooses above instead unless the file says below, so the words below never move (`packages/score-parser/src/ties-and-slurs.ts:301-305`, the choice at `:434-439`; Gould p. 117 allows all articulation above when the space below is taken). **That rule stays.** Dann offered either side; the desk kept above (DESK DEFAULT 2026-10-19 21:5x), so this row makes "above" correct over a beam.
- **The bracket:** Gould's pp. 109 to 122 state no rule for slurs and tuplet brackets; her p. 113 example draws a long slur outside a triplet numeral. Dorico's documented convention (Steinberg, "General placement conventions for tuplets"): brackets sit as close to the notes as they can without colliding with slurs; a slur shorter than the bracket usually goes inside it; a longer slur may go outside it. This row takes that convention as the rule.

## The code today

- The printed-slur plan: `planPrintedSlurs` (`ties-and-slurs.ts:307-...`), `geometry` (`:331-431`). An end starts at `levelAt` (the head plus `SLUR_HEAD_ANCHOR_SP`, or beyond a marking). `clearAt` adds stem tips and beams for INNER notes only (`:351-361`). **DANN'S END-POINT RULE** (`:396-429`) moves an end off its head toward the stem only while an inner note forces a deep curve, and then no further than `SLUR_STEM_END_SP` short of the stem tip (`limit`, `:406`), which is inside the beam. A two-note slur has no inner note, so its ends stay at the heads.
- The tuplet pass (`packages/score-parser/src/staff-renderer.ts:2267-2310`) places each bracket above all ink in its run (`yBr = minY - 8`, `:2300`) and builds its markup then; the slur plan runs much later (`:3245`), and the bracket markup is pushed at `:3394`. Neither knows the other.
- **`staff-renderer.ts` is at its ratchet ceiling (3435 lines; `scripts/ratchets.json:10`).** It may not grow. If the bracket must move, take the tuplet pass out of it into its own module rather than add lines. `ties-and-slurs.ts` (489 lines) has no ceiling.

## The work

1. **A slur on the stem side clears the stems and beams at its ends.** In `geometry`, an end whose note's stem points the slur's way (`stemUpFor(ev, y) === (dir === 'above')`, not stemless) does not sit at the head. It sits at the stem's x (`stemHalfUp` / `stemHalfDown`, as the end-point rule already computes), and:
   - if the note is beamed (`beamStemById.has(ev.id)`), beyond the beam: `tipY + s * clear`, where `tipY` is the beam's y at that stem;
   - if unbeamed, beyond the stem tip and clear of its flag.
   The curve between the ends is then solved as today (`solve`), so inner notes are still cleared. An end whose stem points away from the slur stays at its head, as today. The below-side rule (`:436-439`) is unchanged.
2. **A slur and a tuplet bracket never touch.** For each bracket on the system (its first and last placed index, its x span, the y of its line and the top of its numeral), and each printed slur that overlaps it in x on the same side (above):
   - **If the slur's span is not wholly inside the bracket's run** (it starts before the run's first event or ends after its last), the slur goes outside: the bracket's line and numeral count as ink the slur must clear, the same way `clearAt` counts a beam, wherever the slur passes over the run.
   - **If the slur lies wholly inside the run** (first and last slurred events both in the run, the case of a slur over a triplet's own notes), the bracket goes outside: its line moves up to clear the slur's highest point by the same gap it keeps from notes today (8 px at `:2300`, or its own constant), and its numeral moves with it.
   Do this for printed slurs only. Ilya's own derived melisma slur (`drawDerivedSlurs`, `:3250`) is out of scope; name in the report whether it can meet a bracket.
3. **Nothing else.** No change to ties, markings, fermatas, the below-side rule, the derived slur, or any string. No change to how a slur picks its side.

## Tests and the done state

1. **A fixture bar from song 1, copied into `packages/score-parser/src/fixtures/n188-markings.musicxml` as a new last bar (or a new fixture file beside it):** 4/4, divisions 24, voice part, stamped `<software>homr</software>` as N.188's Section D test is; no `placement` on any slur (homr writes none): dotted eighth F♯4 (duration 18, slur 1 start), sixteenth G♯4 (6, slur 1 stop), three sixteenths F♯4, G♯4, F♯4 under `time-modification` 3:2 (4 each; `tuplet` start on the first and stop on the third; slur 1 start on the first), eighth E4 (12, slur 1 stop), quarter F♯4 (24), quarter rest (24). This is bar 10 of the reading as homr wrote it, notes and notations unchanged.
2. **Add a second bar for the inside case:** three eighth-note triplets under one slur from the first to the third (slur and bracket over the same three notes), then a half rest.
3. Tests, in the N.188 test file or a new one beside it, on the rendered SVG of the fixture: (a) bar 10's first slur: both ends at or beyond the beam (above the beam's y at each stem) and no point of the arc between the heads and the beam; (b) bar 10's second slur: its outline does not intersect the bracket's line or the numeral's box; (c) the inside bar: the bracket's line is above the slur's highest point, with the gap; (d) a two-note slur over stem-DOWN notes drawn above still starts at its heads (no change). Read the geometry from the SVG or from `planPrintedSlurs`'s output, not from screenshots.
4. Every existing N.188 test passes unchanged. If one pinned the old two-note geometry, say which and why it changed.
5. Pictures, as N.188's were (`docs/sessions/n188-shots/`): the fixture's bars in Markup at 1,440 px and at 390 px, before and after, into `docs/sessions/row126-shots/`.
6. All eight gates at baseline, with web-test and score-parser counted (after row 123: web-test 2849, score-parser 744 passed and 5 skipped). No ceiling raised; `staff-renderer.ts` not over 3435.
7. **DONE** is Dann's look at song 1, bar 10, on the alias after the merge.

## The lane

Branch `cloud-lane-11`, after row 123, its own commit and push. Never `Shane` or `main`; no pull request; Dann merges. Do not edit `docs/memory/`. Never commit a `brief-code-*` file: the brief lives in `/tmp/briefs` only. Report: `docs/sessions/report-code-row126_r1_2026-10-19.md`, with the diff by file and line, every constant added and whether it is from Gould, Dorico, or your judgement, the test counts, the pictures, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
