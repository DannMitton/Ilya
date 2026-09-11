# Memo: tie/slur geometry anchors, 2026-09-11

All paths below are in `packages/score-parser/src/staff-renderer.ts` (2830
lines) and its test file `staff-renderer.test.ts`, both under
`packages/score-parser/src/`.

## 1. Files, functions, SVG element

Tie and slur geometry both live inline in the main render pass of
`staff-renderer.ts` (no separate named functions).

- Tie: `staff-renderer.ts:2571-2634`, emitted at `:2630`:
  `<path d="M x1 ey Q mid (ey+depth) x2 ey Q mid (ey+tieInner) x1 ey Z" fill="#1a1612" data-tie="...">`.
  Two quadratics sharing both endpoints, closed with `Z`, `fill` set, no
  `stroke` attribute. This IS a filled, tapered shape already.
- Slur: `staff-renderer.ts:2636-2670`, emitted at `:2669`:
  `<path d="M x1 sy Q mid (sy-lift) x2 sy" fill="none" stroke="#1a1612" stroke-width="1.3" data-slur="...">`.
  One quadratic, `fill="none"`, constant `stroke-width="1.3"`. Uniform-width
  stroke, no taper.

So defect (1) is confirmed for slurs and appears stale for ties (see NOT
ESTABLISHED).

## 2. Curve maths and the height cap

Tie depth, `staff-renderer.ts:2602`: `depth = (up?-1:1) * o.lineGap * 0.9`,
a FIXED height independent of span (`x2-x1`). Only adjustment is a ±3
staff-line-avoidance nudge (`:2604-2606`), also constant. No term scales
`depth` by span. **This answers observation (2) for ties:** absolute arch
height never grows with distance, so a stretched span (post-justification,
e.g. across a barline) looks flatter for the same pixel sagitta. Centre
thickness constant `TIE_CENTRE_SP = 0.4` at `:654`.

Slur lift, `staff-renderer.ts:2658`: `lift = Math.min(24, 10 + (last.x-first.x)/20)`.
This DOES scale with span, but is hard-capped at 24px. A long melisma slur
(span > 280px) is clamped flat at that 24px regardless of further width,
answering (2) for slurs.

## 3. Shared code, direction

No shared helper between tie (`:2571`) and slur (`:2636`) blocks.

Tie direction, `:2591-2596`: opposite the syllabic slur if one arches above
the span; else away from shared stem direction; else away from the middle
staff line. Slur direction, `:2649` (`sy = top - 6`): always above the
staff in this function, no downward branch.

## 4. Named sources (Gould, thickness, shape)

`TIE_CENTRE_SP` doc comment, `:639-654`: 0.4 stave-spaces, sourced as
"DANN'S EYE, 2026-08-27" from comparing 0.29/0.40/0.51, explicitly NOT
Gould — her tie/slur rules (150-175 of
`gould-vocal-engraving-rules_v7_2026-08-05.md`) were deliberately excluded
from the extracted-priors memo; the book is not on the build machine. No
equivalent constant or comment exists in the slur block.

## 5. What the tests pin

`staff-renderer.test.ts:233-236`: one tie present, presence only.
`:238-250`: regex requires the two-Q, filled, `Z`-closed pattern; asserts
outer control below endpoints and inner control strictly between endpoint
and outer control (the taper) — would fail if reverted to a stroke.
`:254-259`: regex literally requires `fill="none" stroke="#1a1612"
stroke-width="1.3"`, single-Q — this PINS the slur to uniform stroke,
non-tapered. Any slur-tapering fix must deliberately update this test.

## 6. Existing filled-tapered technique to reuse

The tie block (`:2571-2634`) is the only filled/tapered shape in this
renderer. Beams (`:1570`) are stroked `<line>`s of constant `beamT` width.
Noteheads are `<ellipse>` (`:2455`), dots are `<circle>` (`:2289`). No other
outline-fill technique exists. The tie's own pattern (outer arc out, inner
arc back, sharing both terminals, closed and filled) is the one to reuse;
it would replace the current stroked `<path>` at `:2669` in the slur block,
using the same terminal points (`first.x`/`last.x`, `sy`) already computed
there.

## NOT ESTABLISHED

- Whether the tie's filled-tapered code (dated 2026-08-27,
  `:2609-2626`, already present in this source at `:2630`) is actually what
  rendered on the page the user viewed tonight, versus a stale bundle — the
  source conflicts with the user's report of a uniform-width tie.
- Whether the specific long-span tie the user saw was near a barline
  because of justification stretch specifically, or another spacing cause
  (rest, accidental). No reproduction case inspected this session.
- Whether the slur's 24px `lift` cap (`:2658`) or the tie's fixed `depth`
  (`:2602`) dominates the page-foot case the user flagged — both are
  candidates, neither measured against tonight's actual rendered SVG.
