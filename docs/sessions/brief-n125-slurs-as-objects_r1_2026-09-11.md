# Brief for Code: N.125, slurs drawn as tapered objects, with an arch that keeps its proportion

Desk, 2026-09-11 00:30. Numbered N.125 by the desk at Dann's word ("make
them taper gracefully as objects"), unplaced, its own Code thread: it lives
in `packages/score-parser/src/staff-renderer.ts` and touches nothing on the
drawer path. Anchors from Sonnet's read-only memo
`docs/sessions/memo-anchors-ties-slurs_r1_2026-09-11.md` (89 lines, read in
full by the desk); re-verify every line against the tree before editing.
Returns `docs/sessions/memo-n125-slurs_r1_2026-09-11.md`.

## 0. Ground rules

- No git. Dann ships with `ilya-ship.sh`. Ask him to `git add` any new file.
- Gates at baseline: phonology 216, dictionary 235, web-check 0 errors and 7
  warnings in 4 files, web-test 1104, score-parser 547 passed and 5 skipped.
  Report movement with cause. Score-parser WILL move: see §3.
- Edit by anchor. Do not touch `VocalLineEvent`.
- Every claim carries a `path:line` you opened, or NOT ESTABLISHED. NOT
  ESTABLISHED beats a complete invented answer.
- Do not type a number Dann has not chosen: §2.2 and §2.3 produce renders
  for his eye, they do not pick.

## 1. What Dann saw, and what the tree says

On the Kabalevsky T05 Score markup page (branch alias, `8032489`): a short
arc that "arches properly but is a uniform line width", and two long arcs,
one mid page 1 and one near the foot of page 2, "nearly flat and thin".

The tree, per the memo: TIES are already filled tapered shapes, two
quadratics closed with `Z`, `fill` and no stroke (`staff-renderer.ts:2571-2634`,
emitted `:2630`), centre thickness `TIE_CENTRE_SP = 0.4` sp chosen by Dann's
eye 2026-08-27 from 0.29 / 0.40 / 0.51 (`:639-654`). SLURS are a single
quadratic with `fill="none" stroke-width="1.3"` (`:2636-2670`, emitted
`:2669`): the uniform width Dann saw. Slur lift is
`Math.min(24, 10 + span/20)` (`:2658`): capped at 24 px, so any span over
about 280 px goes flat. Tie depth is fixed at `0.9 × lineGap` (`:2602`)
regardless of span. Gould 151 (project extraction, `gould-vocal-engraving-rules_v7`):
tie and slur SHARE ONE DESIGN, a tapered symmetrical arc, the tie flatter.
Gould's slur-design pages 109 to 112 were never photographed, so no slur
height rule exists in the project; the height is Dann's eye.

## 2. The changes

### 2.1 Slurs become filled tapered shapes

Replace the stroked `<path>` at `:2669` with the tie's own technique: outer
arc out, inner arc back, same terminals (`first.x`/`last.x`, `sy`), closed
and filled, no stroke. Centre thickness: reuse `TIE_CENTRE_SP` (Gould 151,
one design), DESK DEFAULT, Dann waves it off if the slur reads too heavy
beside a tie. Keep `data-slur`. Ends must come to points like the tie's.

### 2.2 The slur's arch keeps its proportion: renders for Dann's eye

Do not pick a new cap. Produce three renders of the T05 page, first page
and the page-2 foot, with the cap at 24 px (today), 40 px, and 56 px, each
labelled, as PNGs in `docs/sessions/n125-renders/` named
`slur-cap-24.png`, `slur-cap-40.png`, `slur-cap-56.png`. Also state, in the
memo, what the lift formula would be if it were written in stave-spaces
rather than pixels, so the number Dann picks can be recorded as a
proportion. Code changes nothing here until he picks; the memo carries the
three numbers and the formula.

### 2.3 Which arc was which

Reproduce the two long arcs Dann flagged on the T05 page and say, from the
rendered SVG, whether each is `data-tie` or `data-slur`, its span in px,
and its depth or lift. If either is a tie, render the same two spots with
tie depth at `0.9`, `1.2`, and `1.5 × lineGap` (Gould 152: a shallow tie is
about 1 to 1.5 stave-spaces deep; Gould 153: a long tie is flattened so
successive ties do not vary wildly), as `tie-depth-09.png`, `-12.png`,
`-15.png`, for his eye. Change nothing until he picks.

## 3. Tests

`staff-renderer.test.ts:254-259` pins the slur to `fill="none"
stroke="#1a1612" stroke-width="1.3"`. Update it deliberately to the
filled two-Q pattern the tie test (`:238-250`) already asserts, including
the taper assertion. Report the score-parser count.

## 4. Walk before hand-over

On a local production build, the T05 page: every slur is a filled tapered
arc with pointed ends; ties unchanged; the renders in §2.2 and §2.3
exist and are named in the memo.

## 5. The memo

`docs/sessions/memo-n125-slurs_r1_2026-09-11.md`, under 100 lines: what
shipped (2.1 and the test), the three-render sets with their numbers and
the stave-space formula, the which-arc-was-which finding, gate numbers,
NOT ESTABLISHED.
