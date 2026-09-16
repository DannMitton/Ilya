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

---

# AMENDED AT THE DESK, 2026-09-15. Read this before §1

## 0.1 THE LINE NUMBERS ABOVE ARE FROM 2026-09-11 AND HAVE MOVED

N.126 landed between then and now and pushed this file down by about 150 lines.
**Re-verified against the tree at `76b24a3`, 2026-09-15:**

| | line as written above | line today |
|---|---|---|
| tie emission | `:2630` | **`:2783`** |
| `TIE_CENTRE_SP` declaration | `:654` | **`:655`** |
| tie depth | `:2602` | **`:2757` region** |
| slur emission | `:2669` | **`:2822`** |
| slur lift cap | `:2658` | **`:2818`** |

Re-verify every one before editing. The FINDING is unchanged: the tie is a
filled two-quadratic lens with `fill="#1a1612"` and no stroke; the slur is a
single quadratic with `fill="none" stroke-width="1.3"`.

## 2.4 NEW. IS THE TIE'S TAPER VISIBLE AT THE SIZE IT IS DRAWN?

**Why this was added.** Dann raised the arcs again on 2026-09-15 and said *"These
constant-width arcs are noticeable and wrong."* If any arc he is pointing at is a
TIE, then the source and his eye disagree, because the source says ties already
taper. **The 2026-09-11 memo flagged this as NOT ESTABLISHED and it has never
been measured.**

**Do this before §2.1, because it may change what §2.1 is worth.** It is
arithmetic and a render, not a redesign.

1. **State the tie's centre thickness in px** at the shipping `lineGap` of 5.5
   (`engraving.ts:30-36`), that is `sp(TIE_CENTRE_SP)` with `TIE_CENTRE_SP =
   0.4`, and put it beside the slur's 1.3 px stroke. Say which is thicker.
2. **Measure the drawn shape, not only the control points.** The lens's greatest
   thickness is not the difference between the two control points; compute or
   sample the actual vertical gap between the two quadratics at the midpoint and
   report THAT number.
3. **Say whether a tie of the shortest span on the T05 page still reads as
   tapered**, and at what span the taper stops being visible.
4. **Change nothing.** If the number is too thin, `TIE_CENTRE_SP` is Dann's eye
   (2026-08-27, chosen from 0.29 / 0.40 / 0.51) and only he moves it. Render the
   same spot at 0.4, 0.55 and 0.7 sp as `tie-centre-040.png`, `-055.png`,
   `-070.png` for his eye, the way §2.2 and §2.3 do.

## 2.3 AMENDED: HOW TO TELL WHICH ARC IS WHICH

**Do not judge it from the curve.** The paths carry `data-tie` and `data-slur`
already. `querySelectorAll('[data-tie], [data-slur]')` on the rendered page, or
a regex over the emitted SVG string in a test, answers it exactly.
`ENVIRONMENT.md` §YOU DO NOT NEED A PIXEL §THE SAME RULE.

**This answer is wanted by two other items**, so report it plainly and in one
place: N.141's case 2 needs to know whether m. 84 and m. 87 of Without Sun song
2 carry ties or melisma slurs, and N.142 is the tie predicate itself. **Name
those two measures explicitly in the memo.**


---

# AMENDED AT THE DESK, 2026-09-16. Read with §0.1

## 0.2 RE-VERIFIED AT `68aab4f`, WITH CORRECTIONS

- **No commit since `76b24a3` touches `packages/` or `apps/`** (`git log 76b24a3..HEAD -- packages apps` is empty). The §0.1 table holds: `:655`, `:2783`, `:2818`, `:2822` read as stated. Tie depth is `:2755` (`o.lineGap * 0.9`).
- **The gate baseline in §0 is stale.** Today, from `~/Downloads/ilya-ship.sh` gates 4 and 5: web-test `1173 passed (1173)`, score-parser `555 passed | 5 skipped (560)`. Phonology 216, dictionary 235, and web-check 0 errors and 7 warnings in 4 files are unchanged.
- **The slur test is `staff-renderer.test.ts:259-264`** (the pinning regex is `:261`), not `:254-259`. The tie shape test that §3 copies starts at `:243`.
- **§2.4's `engraving.ts:30-36` is `apps/web/src/lib/shane/engraving.ts:31`** (`lineGap: 5.5`). There is no `engraving.ts` in `packages/score-parser`.
- **T05 is `~/Downloads/Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell.musx`.** N.143 is open: on a `.musx`, the input field and Transcription stay empty, but Score markup draws the file's own words, which is all this brief needs.
- **The Without Sun song 2 file Dann walked on 2026-09-15 is NOT ESTABLISHED on this machine.** It is not in `~/Downloads`. Ask Dann for it. Do not substitute `tools/e16-harness/output/mussorgsky---sunless-02---you-did-not-recognize-me/`, which is OCR harness output and not the file he walked.
