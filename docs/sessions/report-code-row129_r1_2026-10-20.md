# Report: row 129, a beamed triplet is drawn without a bracket, its 3 over the middle stem

Branch `cloud-lane-12`, after row 128 (`6d2bdcf`); working tree clean before. Brief: batch A r2, row 129 (in `/tmp/briefs`, not committed).

## The diff, by file and line

- `packages/score-parser/src/tuplet-bracket.ts`: `BracketRec.bare?` (new field); `bracketSpan(run, beamStemById)` (new, line 54): returns the run's `xa`, `xb`, `midX`, and `bare`. A run qualifies when its count is odd and every note has a `beamStemById` entry with the same `group` and the same direction as the middle note. For a qualifying run the numeral stands on the middle stem's `sx` (stems up) or the middle note's `x` (stems down), and `xa`/`xb` are the numeral's own box edges (`midX ± 7`). `bracketMarkup` draws only the `<text>` inside `<g data-tuplet="n">` for a bare record; the bracket's markup is otherwise character for character what it was.
- `packages/score-parser/src/staff-renderer.ts` (3432 to 3430, ceiling lowered): `beamStemById`'s entry gains `group: notes` (the beam group's own array, so identity says "same group"; `:2034`, `:2061`); the tuplet pass takes `xa, xb, midX, bare` from `bracketSpan` in place of three lines (`:2303`) and pushes `bare` (`:2305`); the import (`:55`). `yBr` is computed exactly as before, so the numeral keeps the bracket pass's clearances.
- `packages/score-parser/src/ties-and-slurs.ts:382`: `bracketLevel` is the numeral box's top for a bare record, the line's `yBr` otherwise. Everything else in the planner reads `xa`/`xb` (now the numeral's box) and `numeralBox`, so a slur clears only the numeral. A slur wholly inside a bare run still raises `yBr`, so the numeral rides above it (bar 9).
- `packages/score-parser/src/row126-slur-clearance.test.ts`: `brackets()` rewritten to read both forms (a bare group's `xa`/`xb` are the numeral's edges, `t` is 0). Its nine tests pass unchanged otherwise.
- `packages/score-parser/src/row129-bracketless-triplet.test.ts` (new, 7 tests): stems up, the 3's x is the middle stem's within 0.5; stems down, the middle notehead's centre within 0.5 and the 3 above that head; two beamed notes and one unbeamed keep the bracket; an even-count run (a duplet) keeps it; an unbeamed triplet keeps it; a slur over a bracketless triplet clears the numeral's box; bar 10's second slur of the fixture begins lower than before and its numeral stands over the middle stem.
- `packages/score-parser/src/approval/__approved__/` six SVGs, re-approved (below).
- `scripts/ratchets.json`: `staff-renderer.ts` 3432 to 3430.

`staff-renderer.test.ts` (`data-tuplet="3"` about `:632-635`) passes unchanged: the group is still there.

## The six approved SVGs

Each file differs by one line: the `data-tuplet` group, which lost its four bracket lines. The numeral's y is unchanged in all six. Numeral x, before to after:

| File | x before | x after |
|---|---|---|
| renderDemo.primitive | 848.35 | 848.35 |
| renderDemo.smufl | 846.38 | 846.38 |
| renderDemoDotted.primitive | 890.85 | 890.85 |
| renderDemoDotted.smufl | 896.86 | 896.86 |
| renderDemoUnmeasured.primitive | 839.2 | 844.7 |
| renderDemoUnmeasured.smufl | 832.56 | 838.92 |

`git diff --stat` shows 1 line changed in each of the six, so nothing else in them moved.

## The fixture, bars 9 and 10 (`row126-song1-bars-9-10.musicxml`, 5.5 px stave)

- Both triplets are bracketless now. Bar 9's numeral (stems down) stands at x 173.47 over the middle notehead, above the slur; bar 10's (stems up) at x 560.72, was 557.47, over the middle stem.
- Bar 10's second slur: path was `M520.72 31.33 Q 580.72 16.82 640.72 42.08`, now `M520.72 39.33 Q 580.72 6.84 640.72 42.08`. Its start end dropped 8 px (no bracket line holds it up); its curve now rises more steeply over the numeral. Bar 9's slur and bar 10's first slur are unchanged.
- System height (viewBox): `0 11 797.47 128` before, `0 1 797.47 138` after. **The system is 10 px taller, not lower.** The top moved by the same 9.98 px as the slur's control point (16.82 to 6.84), which suggests the system's top follows the arc's control point; I did not read the code that sets it, so that is an inference. Dann's second sentence expected more room; the ends have it, the apex does not (apex at t=0.5: about 26.8 before, 23.8 after, by my arithmetic from the two paths).

Pictures: `docs/sessions/batch-a-shots/row129-{before,after}-{1440,390}.png`, the fixture's SVG as the renderer draws it, in Finale Maestro, scaled to the viewport width. They are the renderer's output, not the web app's page.

## Gates

phonology 267, dictionary 248, blurb 145, integration 55, web-test 2865 (2865), web-check 0 errors and 12 warnings, score-parser 763 passed and 5 skipped (768) (756 plus 7), ratchets OK.

## Shared numbers

The numeral's box: `numeralBox` (`tuplet-bracket.ts`) is read by `planPrintedSlurs` (`ties-and-slurs.ts`, the corner points and now `bracketLevel`), by `row126-slur-clearance.test.ts` and by `row129-bracketless-triplet.test.ts`. `bracketMarkup` draws the numeral from the same `midX`/`yBr`, with the same `+ 3.5` baseline the box assumes. What depends on them agreeing: a slur clears the numeral where it is drawn. The rule of which runs qualify lives only in `bracketSpan`; `staff-renderer.ts` and the slur planner both consume its record.

## Could not establish

- **The print.** I did not see song 1's page; the rule is the brief's reading of it.
- **Whether 10 px of system height is acceptable.** It follows from the slur's steeper rise over the numeral. I changed nothing to prevent it. Whether it moves a page break on a real score is not tested.
- **The cause of the viewBox change** (above) is inferred from numbers, not from the code.
- **The group-identity rule** (same `notes` array) is tested only through the cases above; a triplet spanning two adjacent beam groups is not tested.
- **The web app's own page** was not rendered for this row; the pictures are of the SVG alone.
