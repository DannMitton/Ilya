# Report, N.200 lane 64, Step 2: the ceiling options, as tool columns only

**The tool is ready for the desk.** Branch `cloud-lane-64`, on top of Step 1. No engine default changed: every new engine option is still off, and the only engine edit is a refactor that lets the tool compute the cross-check inputs once per take.

## What changed

**Engine (`apps/web/src/lib/voice/engine/path-extract.ts`), no behaviour change.** `pathFromTracks` is split into `checkInputs` (the envelope peaks and the closed phase's qualifying poles, once per take) and `pathFinish` (the choice of path, the reading, and the cross-check, from stored tracks and stored inputs); `pathFromTracks` is now their composition, with the same operations in the same order. `PeakLite` is exported. The 35 tests of `path-extract.test.ts` still pass; Step 3's first table checks that `L15|off` equals the default run take by take.

**The third set (`tools/n200-score/fidelity-set.ts`).** `THIRD = { seedBase: 15000, permBase: 17000, truthBase: 19000 }`, as the desk confirmed. `setByName(name)` returns `primary`, `held`, or `third` and **throws** on anything else; `measure.run.ts` and `measure-report.run.ts` both call it, so an unknown `N200_SET` no longer falls to the primary set. Tests: 600 distinct seeds, none shared with the primary or held-out sets; truth factors between 0.90 and 1.10; `''` and `'thrid'` throw.

**The variants (`tools/n200-score/variants.ts`, new, 67 lines).** Three ladders: `L15`, `L3188` (L15 without its lowest ceiling, 3188 to 7000 Hz), `L3387` (without its lowest two, 3387 to 7000 Hz). Five combinations: off, R125, DP, R125+DP, R125+DP+P3. That is 15 variants, plus `L15|w` (the weighting option, L15 alone, other options off). Burg runs once per take on L15; the raised floors re-score slices of the same stored tracks with `choosePath` (`path-extract.ts`), as the brief says. Each variant records the final fR1 and fR2, the path's track-2 and track-3 values before any check, the cross-check's case, which track gave fR2, the chosen ceiling, and the runner-up ceiling.

**Dann's takes (`tools/n200-score/score-core.ts`).** Beside `path9`, the table gains 60 columns, `p_<ladder>_<combination>_fR1`, `_fR2`, `_fR1_ok`, `_fR2_ok`, for the 15 variants, and `summary.txt` gains one rate line per variant. The path's evidence string (`evidenceOf`) now reads `case:..;f2kept:..;ceil:..;runnerUp:..;setAside:..;pathF1:..;pathF2:..;pathF3:..` (fR1, fR3, chosen ceiling, runner-up ceiling, as asked). The existing columns, their order, and the `path9` header are unchanged.

**The synthetic sets (`measure-core.ts`, `measure.run.ts`, `measure-report.run.ts`, `variant-core.ts`, new, 187 lines).** Each row gains `v`, the 16 variant cells. `variant-core.ts` applies the bars of section 3A, as committed in Step 0, and prints: a pooled verdict table (the figure behind each bar and the verdict), every voice type for every variant, the split by second pulse, where P3 got its fR2, the weighting table, the 80 percent check with every option off, the self-check, and the desk's choice rule. For the third set the runner skips lane 62's older sensitivity variants (t, terms, L9, 5 ms step), which Step 3 does not use; they still run for `primary` and `held`.

## Two readings of the brief, DESK DEFAULTS, printed in the tables' header

1. **A take with no track-2 value** is in neither the "within 12 percent" set of bar 1 nor the "outside 12 percent" set of bar 2 (it has no value to be inside or outside of). Bar 2 is also printed with those takes counted, so the desk can apply the other reading from the same table.
2. **Bar 2's "more than with every option off"** compares a variant with the same ladder's `off` row. For an `off` row that comparison is with itself, so only its "at least half" clause is judged, and the row is marked "reference". Without this reading no `off` row could ever pass bar 2, and the brief's tie rule ("fewest options, then L15") would never reach an `off` row.

If the desk reads either clause differently, every number needed is in the tables.

## Tests (only the files this step changed)

- `fidelity-set.test.ts`: 7 passed (5 existing, 2 new).
- `score-core.test.ts`: 23 passed (11 existing, 1 test of the new columns, and 11 constructed-row tests of the bars: each of bars 1 to 5 passes and fails on rows whose verdict is worked out by hand, the choice rule, the weighting count, the 80 percent check).
- `path-extract.test.ts`: 35 passed.
- Type check (`pnpm --filter @ilya/web check`): 0 errors, 12 warnings in 5 files, as at the tip. Ratchets: OK.
- An unknown `N200_SET` (`thrid`) throws in `measure.run.ts` and in `measure-report.run.ts`.

The tool's own tests live in files `vitest.config.ts` already includes. That file belongs to lane 63, so I added no new test file and did not edit it.

## What I could not establish

- That `measure.run.ts` completes a whole third-set run: Step 3 is its first. The variants code is exercised on a synthetic take by `score-core.test.ts`.
- That the 60 new columns are the ones the desk wants: the brief names the ladders and combinations, and I added L15's five combinations beside the two raised floors, because "R125 changes none of the 12 readings" is judged on L15.
