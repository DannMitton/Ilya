# Report, Code, N.203 lane 59, Step 2 (a tap focuses; Start records)

r1, 2026-11-16. Branch `cloud-lane-59`. Brief r3 Step 2 with amendments 7 and 8.

## What changed

- `voice/VowelCapture.svelte`: `tapVowel` now only focuses (`selected = v`). During a take it does nothing (the second-tap cancel is gone). During the dwell on a new dot it ends the dwell at once and focuses the tapped vowel (amendment 8, DESK DEFAULT). `pressMain` records the focused vowel and no longer has a `done` branch. At ten recorded a new control, **See your vowel space** (`.see-space`), sits directly under the main and second buttons at rest (amendment 9, DESK DEFAULT); for one to nine the old quiet "Return to summary" link stays at the foot until Step 6 replaces it.
- `voice/chart/screen-logic.ts`: `MainButton` loses the `done` kind; at ten recorded the main button reads Re-take for the focused vowel.
- `voice/capture-ritual.svelte.ts`: new `endDwell()`, which ends the landing at once and keeps the reading.
- `voice/count-in.ts`: `tapAction` deleted, with its test (amendment 7).
- `i18n.ts`: new key `capture.seeSpace` (sheet line 24, ratified: "See your vowel space" / « Voir votre espace vocalique »); `capture.done` marked UNUSED and kept; header count 1,272 to 1,273 and `capture.` 32 to 33.
- The tick context is made inside the Start handler: that was done in Step 1 (`begin()` calls `prepareTicks()`), and `startTake` runs inside the tap.

## Tests

`chart/screen-logic.test.ts` (main button at ten is Re-take), `chart/ratified-strings.test.ts` (pins 48 to 49, adds `capture.seeSpace`), `count-in.test.ts` (`tapAction` cases removed), `VowelCapture.test.ts` (at ten: Re-take for the focused vowel, See your vowel space present, no "Done", no "Return to summary"; at one: "Return to summary", no See your vowel space), `capture-ritual.test.ts` (+2 for `endDwell`).

## Gates

| Gate | Baseline | Got |
|---|---|---|
| 1 | 462 | 462 passed (462) |
| 2 | 248 | 248 passed (248) |
| 3 | 0 errors, 12 warnings, 5 files | same |
| 4 | 6258 passed \| 1 skipped (6259) | 6284 passed \| 1 skipped (6285) (Step 1's 26, and 2 for `endDwell`, less the 2 `tapAction` cases removed and the one-for-one rewrites) |
| 5 | 894 \| 5 skipped (899) | same |
| 6 | 178 | 178 |
| 7 | 159 | 159 |
| 8 | OK | `ratchets: OK.` |

The `open-extract` timeout seen in Steps 0 and 1 did not occur on this run.

## What I did not do, and why

- **The browser suites (`calibrate-new`, `singer-paths`) are not run at this step.** The brief puts them at the end, and `calibrate-new` still asserts the old behaviour (a tap starts a take, a second tap cancels, "Done", the 6 s count-in). I rewrite it for the new order in Step 4, where the brief asks for it, and run it then.
- No pictures: the brief asks for them after Steps 3, 4, 5, and 6.

## What I could not establish

- That a tap during the dwell feels right: I changed `tapVowel` and tested the ritual's `endDwell`, but the component is rendered on the server in this tree's unit tests, so the tap itself is exercised only in the browser suite, which I have not yet run.
