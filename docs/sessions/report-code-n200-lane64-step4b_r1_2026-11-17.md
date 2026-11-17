# Report, N.200 lane 64, Step 4b: a deployment to time

`vercel.json` names `cloud-lane-64` beside `cloud-lane-62` in the two places the brief gives: the build command at `:3` (so the branch's build sets `PUBLIC_RECORDER=1`, which the `?harness=1` sidecars need; the recorder is still off in Vercel's production environment, `apps/web/vite.config.ts:26`) and the `git.deploymentEnabled` block (`:49`, with a comma added after `cloud-lane-62` at `:48`). The file parses as JSON; `deploymentEnabled` now holds `Shane`, `main`, `cloud-lane-52`, `cloud-lane-62`, and `cloud-lane-64`. Nothing else changed in this step.

The branch carries the Step 4 defaults (R125 + DP + P3), so `?harness=1&measure=path` times the chosen picker and `?harness=1&measure=shipped` times the picker the app has used until now. Step 5 has not begun: with no `measure` in the address the app still reads by `shipped`.

**Stopped for the desk.** The desk times at least five takes at each address on Dann's iPhone and types both medians and "the time bar is met" into this session. The bar (brief section 5): the median `analysisMs` at `?measure=path` no more than 1,000 ms above the median at `?measure=shipped`.

## What I could not establish

- Whether Vercel has built and deployed this push, or its address. I did not read the deployment's state. The desk should confirm that the build succeeded and that `?harness=1` shows the recorder panel before timing.
- The time on a real phone. Lane 62 measured 136 ms at 1x and 508 ms at 4x CPU throttle in Chromium, not on a phone (`docs/sessions/n200-path-step4-time_2026-11-17.txt`). The path picker now also runs R125, DP, and P3; these add arithmetic on stored tracks and one extra peak search, and I have not timed them.
