# Report: lane 66, Step 1 (comments that state a rule Dann has ruled out)

2026-11-18, Code (cloud session). Branch `cloud-lane-66`. No code change and no test assertion changed: comments only. Each comment now says what the tree does: the verdict and the divergence pass describe a reading and never change its status (`docs/memory/PRODUCT.md:1269-1270`).

## Comments rewritten

| Site | What it said | What it says now |
|---|---|---|
| `voice/engine/types.ts:59-60` | an implausible reading resolves to Provisional at the wizard boundary | the verdict describes a reading and never changes its status or confidence |
| `voice/engine/session.ts:38-41` | a divergent velar-i resolves to provisional | the status comes from the take's own evidence; the divergence pass describes only |
| `voice/CalibrationWizard.svelte:248-261`, above `withIghPass` | resolves [ɨ] to Provisional (Dann's locked anchor rule); a downgraded [ɨ] | the pass describes and changes no status (lane 64); the label "Dann's locked anchor rule" is gone with the rule |
| `voice/CalibrationWizard.svelte:647-648`, in `commitReading` | a divergent [ɨ] the pass resolved to Provisional | the post-pass reading is the reading's own |
| `voice/engine/plausibility.ts:21-23` (review) | the demotion to Provisional happens at the wizard boundary | the verdict never changes a status either (2026-11-13) |
| `voice/engine/plausibility.ts:322-325`, above `keepReading` | undoing only the guard's demotion | the guard changes no status now; a reading stored before lane 64 that the old guard demoted returns to what its confidence earns |
| `voice/engine/derivations.ts:72-75` | the locked anchor rule ... not yet wired | no pass demotes an [ɨ]; `applyIghDivergence` describes only |
| `voice/chart/readings.ts:105` (review) | Provisional "the plausibility guard or the [ɨ] pass resolved it so" | its own evidence left it so; a stored reading the old rules demoted keeps that until sung again |
| `voice/engine/stub.ts:66-69` | a divergent velar-i: the engine resolves the reading to provisional | says it is a scripted state the engine no longer produces; the outcome and `defaultOutcome('ɨ')` stay |
| `voice/engine/capture-file.ts:104` | `?measure=open` and `?measure=path` | `open`, `shipped`, and anything else (no `measure` included) selects `path` |
| `apps/web/e2e-phone/path-picker-time.test.ts:11` | "the median without it" | the median with `?measure=shipped` (the path picker is the default) |
| `components/Drawer/reveal-scroll.ts:32` | a station under the VOICE pane's doors | the stations stand above the doors |
| `apps/web/src/routes/+page.svelte:4179-4180` | the voice, its sentence, its doors, and its two stations | the voice, its three rows, its sentence, then its doors |
| `voice/chart/ratified-strings.test.ts:2` | the calibration screen's and the sheet's strings | adds the wizard's voice type line (pinned at `:104`) |
| `voice/NotePicker.svelte:20-23` | the clef is chosen per note by pitch | `clefFor`: the type's clef when declared, the pitch rule otherwise, and for a note the type's clef cannot show |
| `tools/n200-score/vitest.config.ts` header | no `write-path`, no `third` | adds `N200_GOLDEN=write-path` and `N200_SET=third` |

The grep the brief asks for ("Provisional", "demot", "locked anchor", "downgrad") under `voice/` and `components/Drawer/` found, beyond these, `voice/engine/divergence.ts:13-14` and `voice/CalibrationWizard.svelte:284` (both already say it describes and never demotes: correct, left), and `voice/engine/resolve-values.ts:108-111` and the sites that state the exclusion, which belong to Step 5 and are corrected there.

Wizard: 1120 lines before, 1121 now (the `withIghPass` comment is one line longer); ceiling 1126. `+page.svelte`: 5531, ceiling 5534.

## Tests run

Only the test files of the changed files: `ratified-strings.test.ts`, `plausibility-keeps-status.test.ts` (reads the wizard's source), `capture-file.test.ts`, `plausibility.test.ts`: 4 files, 44 passed. The n200 tool's own two tests (the config header changed): 33 passed. `path-picker-time.test.ts` is a Playwright file; only its comment changed, and it was not run.
