# Report: row 126, a printed slur stays outside the beam and the triplet bracket

Branch `cloud-lane-11`, after row 123 (`f93b9e5`), its own commit. Brief: `brief-code-row126-slurs-beam-and-bracket_r2_2026-10-19.md`. Cloud session, Sonnet 5.5. `Shane` was not merged into the lane.

## What was built, by file

- `packages/score-parser/src/tuplet-bracket.ts` (new): `BracketRec`, `bracketMarkup`, and `numeralBox` (exported once; x from `midX - 7` to `midX + 7`, top at `yBr + 3.5 - 11 x 0.75`, bottom at the line). The markup is character for character what the tuplet pass built in place.
- `staff-renderer.ts` (3435 to 3432 lines; ceiling lowered to 3432): the tuplet pass keeps its geometry and pushes a `BracketRec` (`:2306-2307`, replacing the nine-line markup string); the records go to `planPrintedSlurs` (`:3239`); the markup is built after the plan (`:3388-3391`), and `highestInk` takes the final `yBr`. Constants 6, 8, 5, 7, 3.5, 11 and the attribute order are untouched.
- `ties-and-slurs.ts`:
  - **Item 1, the beam.** In `geometry`, for a slur above, an end on a beamed up-stem note sits at that stem's x (`beamStemById.sx`) and at `outer(levelAt, tipY + s x clear)`; the curve is then solved as before. Every other end is unchanged.
  - **Item 2, the bracket.** Two phases in `planPrintedSlurs`. A slur wholly inside one bracket's run is planned first with no bracket constraint, and the bracket rises to `apex - 8` (apex sampled at 51 points of the outer edge). Every other slur above is planned against the brackets as they then stand: an end inside a bracket's span takes `outer(level, yBr + s x clear)`, and `solve` gains four constraint points (the span's two ends clipped to the slur, and the numeral box's two upper corners, each with one clearance). Half and through slurs clear brackets too (their free end rides above them). Through slurs are planned after the inside ones.
  - **Item 3, the down-stem x.** `px - c.stemHalfDown` became `px + c.stemHalfDown` (the value is negative, so the old end landed right of its head).
- `fixtures/row126-song1-bars-9-10.musicxml` (new): bars 9 and 10 as the brief specifies (divisions 24, three sharps, homr stamp in the file, no `placement`).
- `row126-slur-clearance.test.ts` (new, 9 tests).
- `scripts/ratchets.json`: `staff-renderer.ts` 3435 to 3432, lowered. None raised.

## Constants added

| constant | value | source |
|---|---|---|
| the bracket's clearance over the slur | 8 px (`apex - 8`) | the brief; the same 8 the bracket already stands above notes |
| the slur's clearance over a beam or bracket | `SLUR_CLEAR_SP` (6 / 5.5 sp), reused | the existing slur clearance (Dann's 2026-09-16 walk), not new |
| numeral box (11 px font, 0.75 of it above the baseline, 3.5 px drop, 7 px half-gap) | existing values, named | the existing bracket markup |
| 50 samples for the apex | judgement | accuracy of the sampled apex, no visual meaning |
| 0.05 floor on `2t(1-t)` for bracket points | judgement | the same floor the existing inner-note solve uses |

The rule that a slur outside a beam and clear of a bracket comes from Gould p. 111 (beam) and Dorico's documented convention (bracket); Gould pp. 109 to 122 state no slur-and-bracket rule.

## Tests and gates

New: 9 in `row126-slur-clearance.test.ts`: (a) bar 10's first slur, ends at or above the beam's top and no sampled point between the heads and the beam; (b) bar 10's second slur, no sampled point inside the bracket's line or the numeral box; (c) bar 9, `yBr <= apex - 8`, and a second, inline score where the notes stem up and the bracket visibly rises (higher without the slur than with it); (d) four runs (two cases at 5.5 and 12) that pin the paths the code before this row drew, captured from a clean worktree of `f93b9e5`; (e) the `:423` correction, a `placement="below"` slur over down-stems and a deep inner note ends left of its heads.

**Checked to discriminate:** the same file run against the code before this row: (a), (b), both (c), and (e) fail (5 tests); (d) passes on both, as it must. All 744 earlier score-parser tests pass untouched, the six approved SVGs with a `data-tuplet` group are byte-identical, and `staff-renderer.test.ts:633-634` passes unchanged.

| gate | baseline | this commit |
|---|---|---|
| phonology | 267 | 267 |
| dictionary | 248 | 248 |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| web-test | 2849 | 2849 passed, unchanged |
| score-parser | 744 passed, 5 skipped | 753 passed, 5 skipped (758) |
| blurb | 145 | 145 |
| integration | 55 | 55 |
| ratchets | OK | OK; no ceiling raised |

## Pictures

`docs/sessions/row126-shots/`: `before-1440.png`, `after-1440.png`, `before-390.png`, `after-390.png`. The fixture (bars 9 and 10) in Markup through the real upload route, English, from two dev servers: the code at `f93b9e5` for "before", this branch for "after". After: bar 10's first slur arches over its beam; the second passes over the bracket and the numeral; bar 9 is unchanged.

## Can the derived melisma slur meet a bracket?

Yes, it can: `drawDerivedSlurs` is untouched and knows nothing of brackets, but it is drawn only on a file that prints no slur, and it sits at least one clearance above every stem tip it spans, as the bracket does, so a collision would need a melisma inside a tuplet; not looked for.

## Could not establish

- **Dann's look at song 1, bar 10, on the alias:** not possible here; the reader does not run in the lane. The fixture is hand-typed from the brief's description of homr's reading, not Dann's file, so the shapes match its notes and notations, not necessarily its pixels.
- **Whether the second slur's new height pleases Dann.** It now clears bracket and numeral, and its apex stands noticeably high (the picture shows it); the rule asks only that it not touch them. If it looks too tall, the end-point rule's cap is the lever, and it was not changed.
- **Unbeamed stem-side ends** are not moved to the stem, as the brief says; only beamed up-stem ends are.
- **A slur below** over beamed down-stems is not changed (the brief limits item 1 to slurs above).
- **A bracket and a slur drawn below:** brackets stand above, so a below slur never meets one; not constrained.
- **The loupe** was not pictured for this row; it draws through the same plan.
