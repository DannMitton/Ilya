# Report, N.200 lane 64, Step 5: the switch

Cloud lane 64, branch `cloud-lane-64`, on top of `19cc17e` (Step 4b). Begun after the desk typed the time result (path median 258.5 ms over 10 takes on Dann's iPhone; the shipped median NOT MEASURED, because the address bar kept the earlier address; "the time bar is met" by bound, the desk's DESK DEFAULT) and added one item to this step (`divergence.ts`). I did not see the phone timings; this step relies on the desk's statement of them.

## What changed

- **The switch** (`chart/measure-switch.ts:12-14`): with no `measure` in the address `measurePicker` returns `'path'`. Only the exact values `shipped` and `open` select the other two; anything else, `PATH`, `paths`, an empty value, reads as path. The header (`:1-9`) is rewritten.
- **The defaults** become `'path'`: `engine/analyze.ts` `f1Steadiness` (`:60`), `analyze` (`:141`), `grade` (`:145`), `runCapture` (`:196`); `engine/live.ts:200`. Their comments and the `Picker` header (`analyze.ts:9-15`) say so.
- **The stored picker**: a reading now always carries the picker that took it (`analyze.ts:181`, `out.picker = picker`), so a reading taken under `shipped` stores `picker: 'shipped'`. The literal is widened to `'shipped' | 'open' | 'path'` at `engine/types.ts:78` and `takes.ts:28`, with the comment at `types.ts:73-77` rewritten. A reading stored before this step keeps its `picker` as stored (absent still means shipped); nothing is re-measured.
- **The plausibility band stops demoting** (`CalibrationWizard.svelte:298`, `withPlausibility`): the two lines that turned Captured into Provisional are gone; the `plausibility` field and the console event stay; the comment cites `docs/memory/PRODUCT.md:1269-1270`.
- **The divergence pass stops demoting** (the desk's addition; `engine/divergence.ts`): `isDivergent` is null when [i] or [u] is not usable (`:21`) and true or false otherwise (`:24`); the two lines that set `reading = 'provisional'` are gone; nothing else in the file changed. A divergent [ɨ] stays Captured with `isDivergent` true, and an [ɨ] with [u] missing stays as its own evidence left it.
- **MITTON** stays in `engine/extract.ts` for the shipped picker only; no default path reaches it (test below).
- `path-extract.ts:2` header: "Read by default since lane 64 Step 5".

## Callers that relied on the old default

Every caller in the brief's list now passes `'shipped'` explicitly: `analyze.test.ts` (all `runCapture` and `analyze` calls), `detector.test.ts`, `i-extractor.test.ts` (`:47`, `:87`), `live.test.ts` (every `new LiveCaptureSession`), `open-extract.test.ts` (the shipped comparison), `path-extract.test.ts` (the shipped comparison), `tools/n200-score/score-core.ts` (`PICKERS.shipped`) and `measure.run.ts`.

I grepped `'shipped'`, `measure=`, and every call of `analyze`, `runCapture`, `f1Steadiness`, and `LiveCaptureSession` on this tip. **Callers the brief's list does not name, all of which need no change**: `tools/n200-score/golden.run.ts:31` and `synth-gate.run.ts:55` (both pass the picker explicitly), `apps/web/e2e-phone/path-picker-time.test.ts:37-38` (explicit `'shipped'` and `'path'`), `chart/stub-switch.ts:32` (passes `measurePicker(search)`), `engine/live.ts:740` (passes `this.picker`), and `f1Steadiness`'s one caller inside `analyze.ts`. The `analyze(` calls under `lib/analysis/` are a different function.

## Tests that assert the default (changed with it)

`open-extract.test.ts` and `path-extract.test.ts`: the measure-switch tests now say `''`, `PATH`, `paths`, `SHIPPED`, and `OPEN` read as path, and `shipped` and `open` select theirs; the two that asserted a shipped reading carries no `picker` now expect `'shipped'`.

New tests:

- `path-extract.test.ts`, "no default path reaches MITTON": with no `measure` in the address a capture never calls `extractFormants` or `closedPhaseF1` (spies that call through), runCapture with no picker argument reads by path and carries `picker: 'path'`, and the shipped picker still reaches `extractFormants` and stores `'shipped'`.
- `engine/divergence.test.ts` (new, 6 tests): an [ɨ] with [u] missing, or [i] or [u] Provisional or without an fR2, stays as it was with `isDivergent` null; a divergent [ɨ] (fR1 59.5 Hz from the expected 409.5, then fR2 more than 100 Hz from 1262) stays Captured with `isDivergent` true; a Provisional divergent [ɨ] stays Provisional; a near-expectation [ɨ] is false and Captured.
- `plausibility-keeps-status.test.ts` (new, 4 tests): an implausible reading stays Captured and carries `plausibility: 'implausible'`. **How:** `withPlausibility` is inside `CalibrationWizard.svelte`, which has no component test, and the Playwright stub's readings sit inside every voice type's band (I checked: none is implausible), so a browser test cannot script an implausible capture without editing `stub.ts`, which is not mine. The test takes that one function's source out of the `.svelte` file, removes its type annotations, and runs it with the real `checkPlausibility`. I re-injected the old demotion into the file to check that the test fails (2 of 4 failed), then restored it. **This is a new file outside the brief's Owns list**; it is a Step 5 test the brief requires, and no other lane can collide with its name.

Run, only the files this step changed: `divergence.test.ts`, `path-extract.test.ts`, `open-extract.test.ts` 55 passed; `analyze.test.ts`, `live.test.ts`, `detector.test.ts`, `i-extractor.test.ts` 76 passed; `plausibility-keeps-status.test.ts` 4 passed; the tool's `score-core.test.ts` 26 passed.

## The counts the brief and the desk ask for

Synthetic takes only, under the engine's defaults (L15, R125 + DP + P3). "Third set" is the set of Step 3; "primary" is the 600-take set of lane 62, re-run here under the new defaults (`measure.run.ts`, once). Rows stayed in the scratchpad.

**1. [i] and [u] with fR1 standing (case a or c) and fR2 absent** (the readings `divergence.ts` `usable` could not use; this no longer makes an [ɨ] Provisional):

| type | third: [i] | third: [u] | primary: [i] | primary: [u] |
|---|---|---|---|---|
| bass | 3/12 | 1/12 | 0/12 | 0/12 |
| baritone | 0/12 | 0/12 | 0/12 | 0/12 |
| tenor | 1/12 | 0/12 | 1/12 | 0/12 |
| mezzo-soprano | 4/12 | 0/12 | 2/12 | 0/12 |
| soprano | 0/12 | 0/12 | 0/12 | 0/12 |

**2. Readings the plausibility band used to demote** (Captured readings with an fR1 `checkPlausibility` calls implausible for the voice type): **0 of 588 on the third set, 0 of 566 on the primary set.** The window here is the voice type's alone: the app also passes the singer's own anchors (`anchorF1sFor(profile)`), which a set of separate takes does not have, so this is not the app's exact window. The synthetic truths come from the stand-in templates, which sit inside the bands by construction, so zero here says nothing about real voices. **On Dann's takes: NOT MEASURED.** They are held outside the repository; the desk can count the Captured readings whose fR1 is implausible for his declared type.

**3. [ɨ] readings the divergence pass used to demote** (the desk's addition). A profile is the [i], [ɨ], and [u] takes of one voice type with the same take index (12 per type), each as its default reading; the pass is the real `applyIghDivergence`, and its old status is derived from `isDivergent` (null or true demoted, as the old code did):

| type | third: Captured [ɨ] | third: changed | primary: Captured [ɨ] | primary: changed |
|---|---|---|---|---|
| bass | 11 | 3 | 11 | 3 |
| baritone | 11 | 3 | 12 | 1 |
| tenor | 12 | 2 | 12 | 2 |
| mezzo-soprano | 11 | 4 | 12 | 5 |
| soprano | 12 | 0 | 12 | 4 |
| **all** | **57** | **12 (21.1%)** | **59** | **15 (25.4%)** |

Of the 12 on the third set, 10 were for a missing or unusable [i] or [u] and 2 for divergence; of the 15 on the primary set, 11 and 4. Stated plainly: before this step about a fifth to a quarter of the synthetic [ɨ] readings that the evidence called Captured were turned Provisional by the pass; they stay Captured now, with `isDivergent` null or true as the description. The tables are in `docs/sessions/n200-lane64-step5-counts_2026-11-17.md`.

## Not changed, and for the desk

- **Comments now stale, outside this lane's Owns list, not edited:** the comment above `withIghPass` in `CalibrationWizard.svelte` (`:246-259`, says divergence "resolves [ɨ] to Provisional"); `engine/session.ts:38-42` (says a divergent [ɨ] "resolves to provisional"); `engine/capture-file.ts:104` ("`?measure=open` selects `open`, `?measure=path` selects `path`"); `engine/derivations.ts:73`. The stub's `provisional-divergent` outcome (`engine/stub.ts`) also still scripts a divergent Provisional [ɨ]; that is a test double and I left it.
- `withIghPass` still deletes `isDivergent` from the clone (`CalibrationWizard.svelte`, `:270`), so the description the pass now keeps is dropped before the profile is stored. Nothing reads the field. Keeping it would be a change in a file and a place the brief does not give me.
- The shipped median was not measured on the phone, so the bar is met by bound only (the desk's ruling).

## What I could not establish

- The plausibility count on Dann's takes, and on any real voice.
- Whether the synthetic [ɨ] profile construction (one take index across the three vowels) matches how real singers' profiles fall; it is a way to count, not a model of a singer.
