# Report, N.200 path picker, Step 4: time

Cloud lane 62, branch `cloud-lane-62`. Brief `brief-code-n200-path-picker_r3_2026-11-16.md`, Step 4. Code in `545f1b5`.

## The bar, written first (DESK DEFAULT, from the brief)

Over at least five takes each, the median `analysisMs` with `?measure=path` is no more than 1,000 ms above the median without it, **on Dann's iPhone**. The lane cannot measure that. What the lane can measure is below, and it is Chromium on the lane's machine, **not WebKit and not a phone**.

## What changed

- `engine/capture-file.ts`: `CaptureRecord` gains `analysisMs?: number` (whole milliseconds, every picker). It reaches the sidecar on the recorder build with `?harness=1`, because `holdCapture` writes `...rec` into the JSON.
- `engine/live.ts` (the call to `runCapture`): `const t0 = performance.now()` before the `try`, `analysisMs = Math.round(performance.now() - t0)` right after the call, and `analysisMs` passed to `holdCapture` at both calls (the throwing one measures to the throw). Nothing else in the file changed. The timing runs in every build; it is read only where the recorder is.
- `vercel.json`: line 3 gains `cloud-lane-62` beside `cloud-lane-52` (`[ ... = "cloud-lane-52" ] || [ ... = "cloud-lane-62" ]`), and `git.deploymentEnabled` gains `"cloud-lane-62": true`. Without the second, the branch is not deployed (`"**": false`).
- **A test outside the brief's Owns:** `engine/capture-file.test.ts` pins `vercel.json`'s build command to a single `cloud-lane-N` comparison. Adding the second branch needed its pattern widened to one or more comparisons joined by `||`; nothing else in that test changed. For the desk to confirm.
- New `apps/web/e2e-phone/path-picker-time.test.ts`, after `poem-arias-time.test.ts` (the `phone` project: 390 by 844, touch; Chromium's `Emulation.setCPUThrottlingRate`).

## What the lane measured

Five synthetic fry takes of 2 s each (what `runCapture` sees after the app trims a 3 s sweep, `engine/live.ts`), `runCapture` under the shipped picker and the path picker, in the `phone` project, on an idle machine, one run. The test file prints the lines and writes `test-results/path-picker-time.txt` (copied to `n200-path-step4-time_2026-11-17.txt` beside this report).

| CPU | Shipped, median (five takes) | Path, median | Path minus shipped |
|---|---|---|---|
| 1x | 291 ms (255 to 356) | 427 ms (376 to 492) | **136 ms** |
| 4x throttle | 1,092 ms (1,043 to 1,360) | 1,600 ms (1,521 to 1,831) | **508 ms** |

**Milliseconds per ceiling** (Burg and the roots at one ceiling, median of five takes), 1x: 8 to 17 ms for each of the 15 ceilings, 3001 Hz 12 ms rising to 7000 Hz 17 ms; at 4x: 35 to 58 ms each. **Frames per take (a 2 s buffer):** 308 to 315 at every ceiling, about 4,700 Burg fits per take over the ladder (the plan estimated about 4,800).

So the path picker adds about a seventh of a second at full speed and about half a second at a 4x slowdown in Chromium on this machine, against a bar of one second. **The throttled figure is below the bar, so no stop and no Web Worker** (the brief: build none; if above the bar, report and stop). Whether an iPhone meets the bar is NOT ESTABLISHED: the desk measures it with Dann after the lane deploys, reading `analysisMs` in the sidecar.

Not measured: the closed-phase and envelope work are inside `runCapture` for both pickers, so the difference above is the path picker's own work (Burg across the ladder, the fits, the cross-check). A 3.5 s buffer (the synthetic set's length) takes longer: the Node runs of the measurement took about 0.6 to 0.8 s per path reading unloaded.

## The gates (the changed files' tests), and the end-of-lane gates

- `capture-file.test.ts` and `live.test.ts`: 27 passed.
- The eight gates and the Playwright suites, once, at the end of the lane: see "End of lane" below.

## End of lane

END_OF_LANE_PLACEHOLDER

## What I could not establish

- The time on a real phone (WebKit, a phone's processor).
- Whether the Chromium 4x throttle resembles an iPhone's slowdown.
