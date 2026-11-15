# Report: closing polish lane, step 1, the Drawer's button reads Calibrate when no reading is usable (Code, cloud-lane-48, r1, 2026-11-12)

## What changed

- `apps/web/src/lib/voice/profileStore.ts`: new `usableReadingCount(f)` beside `hasAnyReadings`, counting readings for which `isUsable` (`voice/engine/plausibility.ts:275`) is true; imports `isUsable`. The comment above `hasAnyReadings` is rewritten: it now decides only the wizard's opening phase, and says why it differs from the anchor.
- `apps/web/src/routes/+page.svelte`: `:1646` `voiceCalibrated = $derived(usableReadingCount(voiceFormants) > 0)`; the band's count (`:1731`) is `usableReadingCount(voiceFormants)`; the import (`:129`) and the two comments (the block above `:1646`, and the one in the anchor's markup) say the new rule. The file is 5514 lines, one fewer than the 5515 it had on entry (Amendment 4); ratchets pass.
- `VoiceAnchor.svelte`: header comment and the `calibrated` prop's comment (Amendment 4, `:17-20`, `:27`).
- `components/Drawer/bandState.ts` comment above `scoreStateLine` (Amendment 4, `:226-230`): the count is of usable readings.
- Kept as they were: the four `hasAnyReadings` uses in `voice/CalibrationWizard.svelte` (`:335`, `:511`, `:527`, `:548`); `MarkupPane.svelte:449` and `:1106` (desk default); `bandState.test.ts:207-209` (stays, per Amendment 3). The band's name half is unchanged (Amendment 3): `scoreStateLine` itself was not edited, so a named voice with no usable reading prints "Voice: {name}" with no count.

## Tests added

- `voice/profileStore.test.ts`: `usableReadingCount` on none, usable, refused, refused-and-kept, and its difference from `hasAnyReadings`.
- `components/Drawer/voice-anchor-usable.test.ts` (4): a voice whose only readings are `implausible` renders "Voice: not yet calibrated" and "Calibrate" (EN) and "Calibrer" (FR), never "Re-calibrate"; a usable or kept reading renders "Voice: Dann" and "Re-calibrate"; the band line is "Voice: Dann" with no count when all are refused; and the page is wired from one function (no `Object.keys(voiceFormants).length` left).

## Gates after this step

Web unit suite: 282 files, 5201 passed, 1 skipped (5190 at step 0, plus 11 across steps 0b and 1). Ratchets OK. The other gates run at step 12.

## What MELODY shows for a voice whose readings are all refused (asked of step 1)

Read, not run. `MarkupPane.svelte:449` `hasReadings` is true for any stored key, so `:1106` draws the profile copy: the lede, `statusLine` (`:956`, from `analysedVowels.length`, which counts `adapted.snapshot.fR1`, `:566`), and the provisional-vowels line. `analysedVowels` is built from `buildVoiceProfileSnapshot`; I did not read whether that function drops refused readings (`isUsable` is read in `analysis/analyze-score-adapter.ts:204, :226, :286`, so the analysis does), so the number MELODY then prints is **NOT ESTABLISHED**. What is established: the Drawer says "not yet calibrated" while MELODY's copy block is drawn. That disagreement stays, by the desk default.

## What I could not establish

- What MELODY prints for such a voice in a browser (above).
- A browser capture of the Drawer for such a voice: the test renders the anchor component on the server (`svelte/server`), not the Drawer in Chromium.
