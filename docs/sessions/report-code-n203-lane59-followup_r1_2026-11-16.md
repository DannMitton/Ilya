# Report, Code, N.203 lane 59, follow-up fixes (Fable's as-built review: MERGE WITH FIXES)

r1, 2026-11-16 12:4x. Branch `cloud-lane-59`, built on `239a677`; `Shane` not merged. Nothing under `docs/memory/`, no brief edited, no new English or French. Each fix is its own commit. I did not read Fable's memo, as told.

## The fixes

| Fix | Commit | What | Test |
|---|---|---|---|
| 1 | `b8da03a` | `live.ts`: a `graphReady` flag, set only after the source is connected to the tap and cleared in `releaseGraph()`; `acquire()` reuses a held graph only when it is true, otherwise releases and acquires again. The tap is also built into a local and assigned only if the run is still current. | `live.test.ts`: a cancel while `resume()` is pending, then a second take in the same visit reaches stable fry. **Written first and failed** (`expected [] to include 'fry'`), then passed. |
| 3 | `a31a5d9` | The dev stub session is exposed as `window.__ilyaStubSession` (development server only, beside the existing stub switches). | `calibrate-new`: `visitOpen` is true after the capture screen mounts, false after Back, true after returning, false after See your vowel space. Passes. |
| 4 | `76f1f9a` | `screen-logic.ts` `focusFromDwell(tapped)` returns the focus with `pendingSelected: null` and `returnWhenIdle: false`; the screen applies it in the `endDwellAndFocus` branch. | A unit test for the helper, and a browser test (a tap during the dwell at the end of a re-take pass keeps the screen). **I checked the browser test bites**: with `returnWhenIdle` left out of the assignment it fails; with the fix it passes. |
| 5 | `993a38c` | **Not a defect as I read it.** The loop at `VowelCapture.svelte:171-173` already visited every ancestor (no `break`), so it did not stop at the first scrollable one. I moved it to `scroll-top.ts` `resetScrollAncestors` so the behaviour is pinned. If the memo meant something else, I did not see it. | `scroll-top.test.ts`: three scrollable ancestors are all reset; a non-scroller and one already at the top are left alone. |
| 6 | `973a852` | One-line comment at `stub.ts` `closeVisit`: it must stay silent like the live one. | none (comment) |
| 7 | `8c1b3b1` | `visit.ts` `leaveScreen(visit, ritual)`: the ritual `destroy()` first (silent), then `visit.destroy()`. Unmount calls it, so no CANCELLED take record is written on the way out. Back during a take still reports the cancel, as built. | `visit.test.ts`: leaving mid-take reports nothing and the visit still closes; and the old order (visit first) reports `i:CANCELLED`, so the order is what the test pins. |
| 8 | `081b241` | `hintsFor` passes no `{v}` to `capture.hint.active`; the ritual's ticker goes through `setTake`, which assigns only when part, `within`, or `holding` changed. | `screen-logic.test.ts` updated; `capture-ritual.test.ts`: the same `take` object stands through the whole wait for steady fry. I did not check that this test fails on the old code. |

(There is no fix 2 in the brief you sent.) One more commit, `0ec49c2`, declares the fake context's static fields before use in the fix 1 test: `svelte-check` reported it as a type error.

The main button's in-progress label during the dwell is left as built.

## The eight gates, once, at the end

| Gate | Baseline | Got |
|---|---|---|
| 1 phonology | 462 | 462 passed (462) |
| 2 dictionary | 248 | 248 passed (248) |
| 3 web check | 0 errors, 12 warnings, 5 files | **first run: 1 error**, 12 warnings, 6 files (the type error above); **after `0ec49c2`: 0 errors and 12 warnings in 5 files** |
| 4 web test | not set | 6343 passed \| 1 skipped (6344); nothing failed (the `open-extract` timeout did not occur) |
| 5 score-parser | 894 \| 5 skipped (899) | same |
| 6 blurb | 178 | 178 |
| 7 integration | 159 | 159 |
| 8 ratchets | OK | `ratchets: OK.` (855 source files; the wizard, pane, and page ceilings are unchanged) |

Gates 1, 2, 4 to 8 ran on `081b241`; the one commit after it changes a test file's field order only. Gate 3 was re-run after it. I re-ran `live.test.ts` (16 passed) but not gate 4 whole.

## Playwright, whole, on the final commit

`calibrate-new`, `singer-paths`, `insights-no-score`: **50 passed, 0 failed** (13.3 min; chromium, the stub session, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`). That is the 48 of the lane report plus the two new browser tests (fixes 3 and 4).

## What I could not establish

- Whether fix 8's ticker test fails on the old code: not checked.
- Whether Fable's fix 5 meant something other than what I found; see the table.
- Everything on a real device remains open, as in the lane report.
