# Report, Code, N.203 lane 59, Step 0 (read and report; nothing changed)

r1, 2026-11-16. Cloud session, branch `cloud-lane-59`, cut from `Shane` at `bd4af89a` ("Strophic lane A (lane 56) merged"). The first checkout in the container was a stale `Shane` (`649fe49`); I fetched `origin/Shane` (`bd4af89a`) and cut the branch from that. Working tree clean at the cut. `pnpm install --frozen-lockfile` on Node v22.23.4, pnpm 10.28.0.

## The eight gates on the untouched tip

| Gate | Baseline | Got |
|---|---|---|
| 1 phonology | 462 passed (462) | 462 passed (462) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web check | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files |
| 4 web test | 6258 passed \| 1 skipped (6259) | **1 failed \| 6257 passed \| 1 skipped (6259)** |
| 5 score-parser | 894 passed \| 5 skipped (899) | 894 passed \| 5 skipped (899) |
| 6 blurb | 178 passed (178) | 178 passed (178) |
| 7 integration | 159 passed (159) | 159 passed (159) |
| 8 ratchets | OK | `ratchets: OK.` (843 source files checked; it also prints that some ceilings can be lowered) |

**Gate 4 deviates by one test, a timeout.** `src/lib/voice/engine/open-extract.test.ts > the open picker is agnostic > gives the same reading whichever vowel is asked` failed with "Test timed out in 5000ms" (it took 5190 ms, inside a 384 s full run). Run alone three times: 9 passed, 1 failed (the same test), 9 passed. So it passes on its own and is sensitive to load; I did not change it. Total count is the baseline's 6259 either way. NOT ESTABLISHED: whether it fails on the Mac gate; I report it as seen in this container.

## Cited lines re-read on this tip

Read in this session, not taken from the packet. Every line the brief cites in `live.ts`, `session.ts`, `VowelCapture.svelte`, `capture-ritual.svelte.ts`, `count-in.ts`, `screen-logic.ts` (`:77`), `geometry.ts` (`zoomTarget` `:93`), `routes/+page.svelte` (`calibrating` `:307`, `enterCalibration` `:1643`, `exitCalibration` `:1646`) was as cited. Moved or different:

- `routes/+page.svelte`: the wizard's one mount is `:3881-3903`, not `:3885-3887` (your correction; the mount is `<CalibrationWizard` with no `takeoverActive`-style prop).
- `i18n.ts`: `insights.silence.noScore` is at `:1834`, not `:1833`.
- `engine/session.ts`: the `CaptureSession` interface begins at `:69`, not `:68`.
- `CalibrationWizard.svelte` is 1,726 of 1,727; `InsightsPane.svelte` is 744 of 744 (as the brief says).

Not yet read, and read in the step that needs them: the e2e line ranges, `InsightsPane.svelte:284-293` (read: the block is at `:287-294`), and the pinned-test lines in amendment 20.

## Line counts against `scripts/ratchets.json`

`routes/+page.svelte` 5508 of 5534; `CalibrationWizard.svelte` 1726 of 1727; `InsightsPane.svelte` 744 of 744. Owned, not in the ratchet file (new files stay under 1,000): `VowelCapture.svelte` 817, `capture-ritual.svelte.ts` 295, `count-in.ts` 63, `screen-logic.ts` 127, `VowelChart.svelte` 71, `ChartLayers.svelte` 219, `geometry.ts` 280, `live.ts` 760, `session.ts` 87, `stub.ts` 202, `identity.ts` 64, `i18n.ts` 2597 (exempt). Key count in the head of `i18n.ts` on this tip: 1,272, which gate 4 (`i18n-index.test.ts`) passes. Lanes 57 and 58 are not on this tip, so the 1,280 the packet predicted does not apply yet.

## Plan 4.4 and the prototype

Read in Step 3 and Step 4 where their behaviour is used.

## What I could not establish

- Whether the gate-4 timeout also appears on the Mac.
