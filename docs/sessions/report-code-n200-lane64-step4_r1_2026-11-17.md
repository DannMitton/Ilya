# Report, N.200 lane 64, Step 4: the chosen options become the path picker's defaults

Cloud lane 64, branch `cloud-lane-64`, on top of `2658679` (Step 3) and the Step 4 code commit. The desk's choice, typed after Step 3: **ladder L15, options R125 + DP + P3 on, weighting off**. The desk's reasons, as given: every L15 variant keeps 12 of 13 of Dann's takes in both bars against Praat at 4000 Hz, loses no take, keeps both [u] takes in both bars, and R125 changes none of the 12 readings; every raised-floor variant passes on his takes but fails bar 4 on the third set, and his takes cannot rescue a variant that failed the third set (Dann, 2026-11-17 10:02). I did not see the desk's run of Dann's takes; it is held outside the repository, and this step relies on the desk's statement of it.

## What changed

- `apps/web/src/lib/voice/engine/path-extract.ts`: a new exported constant `PATH_DEFAULTS = { r125: true, dp: true, p3: true, sqrtWeight: false }` (with its comment citing `report-code-n200-lane64-step3_r1_2026-11-17.md`, its tables file, and "the desk's run of Dann's takes, 2026-11-17, held outside the repository"). `pathFinish` and `scoreCeilings` take an option the caller leaves out from it; an option passed as `false` turns it off. The four `PathOptions` field comments and the header comment now say so. The ladder was already L15. `crossCheck`'s own parameter defaults stay off, so every unit test of the cross-check on constructed inputs is unchanged.
- `tools/n200-score/variants.ts`: because an omitted option now means "on", the tool names every option for every combination (the `off` combination passes `false` three times), so `off` still reproduces lane 62. The weighting variant is `off` plus `sqrtWeight: true`, as the brief specifies. `DEFAULT_KEY = 'L15|R125+DP+P3'` names the variant the engine runs by default; `variant-core.ts`'s self-check now compares that variant with the default run.
- Tests: `path-extract.test.ts` gains two (the constant's values; no options equals the explicit defaults, and an option passed as `false` leaves fR1 and the path's fR1 alone). `score-core.test.ts` now checks the default variant equals the default path run. Run, only the changed files: `path-extract.test.ts` and `open-extract.test.ts` 46 passed (46); `score-core.test.ts` and `fidelity-set.test.ts` 30 passed (30).

## The goldens

- **`shipped-open-600.json` is byte-equal**: the compare-mode test passed after the engine change (`1 passed | 1 skipped`).
- **`path-600.json` is rewritten in this step's own commit. 43 of 600 takes changed**, all in fR2: fR1 changed on none, and no reading changed status (Captured, Provisional, re-prompt all unchanged). In 39 the fR2 value changed (the second track's value replaced by the third's); in 4 an absent fR2 became a value (those four also move f2Quality from `absent` to `marginal`); in none did a value become absent. By type: soprano 16, mezzo-soprano 11, tenor 10, bass 3, baritone 3.

## What I could not establish

- How many of those 43 are closer to the truth than before. The golden holds no truth, and I did not recompute it for the primary set. The third set (Step 3) is the evidence for the choice, not this set.
- Anything about Dann's takes beyond what the desk stated.
