# Report: row 165, step 3, the score renderer (r1, 2026-11-01)

Branch `cloud-lane-23`. Files: `packages/score-parser/src/staff-renderer.ts`, `stem-legend.ts`, three score-parser tests, the five approval SVGs.

## What changed

- `TURNING_COLOUR` is `#6C4D8C` (lavender jewel). New exported `TURNING_HEAD_SCALE = 0.82`.
- The turning notehead is drawn at 82 percent (SMuFL: font size times 0.82, centred; primitive: `rx` 4.92, `ry` 3.61) at **full opacity** (the `0.85` is gone from the head, in both modes).
- `turningHeadW` (`staff-renderer.ts`, read by `turningUnitAt`, `columnInk`, the accidental placement, and the spacing at `:1555`) is the old width times 0.82, held to a two-decimal half-width (10.16 in primitive mode, was 12.4) so every position stays on the file's two-decimal grid. Without that rounding, `page-layout.test.ts` ("sliceWidth equals an unstretched system's width") disagreed with the render by 0.004 px.
- The placeholder (hollow) circle's diameter takes the same 82 percent, so a hollow head matches a filled one.
- Turning ledger lines: colour follows; opacity 0.85 to 1 (my choice, so the layer is consistent; reversible).
- The legend (`stem-legend.ts`, "= the pitch where this vowel turns"): same colour, 82 percent size, full opacity.
- The Loupe filters by `data-analysis`, not by ink, so it needed no change (the comment near `:935` stays true).
- `PRIMITIVE_TURNING_ACC_W` (11.3) is the accidental's own width, not the head's, so it is unchanged. The accidental follows the narrower head edge: it sits 1.12 px nearer the head, same clearance.
- `WITHHELD_SIGLA.colour` (the "?" mark) is `#6C4D8C`, written out because it is declared above `TURNING_COLOUR` (a reference would hit the temporal dead zone). A new test pins that the two agree. DESK DEFAULT, as stated in step 0.

## Not ruled, so left (NOT ESTABLISHED)

- Whether the turning **accidentals** (and ledger line length) should also be cue size. Only the head was ruled (Dann 16:08); accidentals keep full size and take the new colour. The mock under `~/Downloads/ilya-colour-review/` is not in the tree, so I could not check it.

## Pins re-pinned (old to new)

- `#9585A2` to `#6C4D8C` in `staff-renderer.test.ts` (15 sites), `stem-legend.test.ts`, `placeholder-mark.test.ts`. `#839275` negative check to `#7D9D76`.
- `opacity="0.85"` assertions on the ledger, the legend head, and the hollow mark now assert no opacity.
- Geometry: a new `TURN_HALF` (5.08) replaces the turning use of `HEAD_HALF` (6.2) in six N.106 tests. Demo-fixture literals: n5 head `cx` 348.2 to 347.08; n11 head 711.15 to 710.03 (and the retired-left check 680.1 to 678.98); n13 accidental `x` 795.35 to 795.1.
- Placeholder test: expected diameter times `TURNING_HEAD_SCALE`.

## Approval fixtures (regenerated with `vitest -u`)

Diff classified line by line (old line with colour and opacity normalised, then numbers masked): `renderDemo.{primitive,smufl}.svg` and `renderDemoDotted.{primitive,smufl}.svg`, 80 changed lines each: 25 are turning marks (colour, opacity removed, head size) and 55 differ **only in an x coordinate** (the narrower head moves later columns). `sunless-01-engraved.primitive.svg`: 148 turning-mark lines and 425 position-only lines; 0 other. **So the review's "colour, opacity, and head size only" is not quite true: positions shift too (1.12 px at a displaced head, then 0.25 px per later column), as the spacing rule demands.** `renderDemoUnmeasured.*` has no turning marks and is unchanged.

## Gates

score-parser 776 passed, 5 skipped (781; +1 new test). web test 3718 passed, 1 skipped (3719) on the final run. web check 0 errors, 12 warnings in 5 files. integration 55, phonology 291, dictionary 248, blurb 145. `pnpm ratchets`: OK; `staff-renderer.ts` is 3428 (ceiling 3429), no ceiling raised.

**Flake to know about:** `src/lib/text/syntactic-break-unit.test.ts` (the 20,000-line property test) failed in two of four full web runs and passed alone and in the other full runs. I touched nothing near it; it looks load-sensitive (likely the default timeout) but I did not confirm the cause.

`tsc --noEmit` in score-parser shows one error in `row141-tacet-run.test.ts`, a file this row does not touch; I did not check whether it predates this branch.

No French changes.
