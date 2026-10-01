# Report from Code: ten ratified calibration strings seated (QUEUE row 2l)

Code, 2026-09-30. Brief: `brief-code-calibration-copy-ratified_r1_2026-09-30.md`. Branch `Shane`, working tree dirty with rows 2b to 2k. No git writes.

## Summary

- **Five strings changed, verbatim** as Dann ratified them 2026-09-30 23:42, English and French, with the file's `’` escape.
- **Five ratified as built**, text unchanged.
- **Every PLACEHOLDER comment on them now carries the ratification** and its date; "Dann writes copy" is gone from all of them.
- **Gates:** all eight hold. Gate 4 is 1784, unchanged from row 2k, because no test pinned these strings.

## Changed (`apps/web/src/lib/i18n.ts:1074-1082`)

| Key | Before | After |
|---|---|---|
| `calib.readiness.quiet` | Listening for quiet. Stay silent for a moment. / À l’écoute du silence. Restez silencieux un moment. | Listening to the room. Stay silent for a moment. / Ilya écoute la pièce. Restez en silence un moment. |
| `calib.readiness.prepareLede` | Now a throwaway fry, just to check the mic hears you. / Maintenant une friture d’essai, simplement pour vérifier que le micro vous entend. | Next, a short test fry, so Ilya can check that the microphone hears you. / Ensuite, une courte friture d’essai, pour qu’Ilya vérifie que le micro vous entend. |
| `calib.readiness.captureAria` | Recording your throwaway fry / (French unchanged) | Recording your test fry / Enregistrement de votre friture d’essai |
| `calib.readiness.noMic` | We could not reach your microphone, … / Nous n’avons pas pu … | Ilya could not reach your microphone, so nothing was measured. / Ilya n’a pas pu accéder à votre microphone, donc rien n’a été mesuré. |
| `calib.readiness.noFry` | We did not hear a fry, … / Nous n’avons pas entendu … | Ilya did not hear fry, so nothing was measured. / Ilya n’a pas entendu de friture, donc rien n’a été mesuré. |

A two-line comment above the readiness keys records the ratification (Dann 2026-09-30 23:42, "yes", desk-drafted) and covers `calib.roster.noiseFloorTitle` and `calib.challengingInvite.*`.

## Ratified as built, text unchanged

`calib.readiness.captureLede`, `calib.roster.noiseFloorTitle`, `calib.challengingInvite.button`, `calib.challengingInvite.caption`, and `MARKUP_WITHHELD_COPY` (`markup/legend.ts`).

`MARKUP_WITHHELD_COPY`'s French carries row 2g's spacing fix, « différemment : rien », with U+00A0. That is the version now ratified.

## Comments rewritten

Each was rewritten in place, keeping the same number of lines, so `CalibrationWizard.svelte` stays at 2123, its ratchet ceiling, and `legend.ts` at 68:

- `CalibrationWizard.svelte:1131`, the challenging-vowels invite: "BOTH STRINGS RATIFIED by Dann 2026-09-30 23:42, as built."
- `:1210`, the noise-floor title: "RATIFIED by Dann 2026-09-30 23:42, as built."
- `:1317`, the count-in: "Copy RATIFIED by Dann 2026-09-30 23:42."
- `:1324`, the capture bar: "Copy RATIFIED by Dann 2026-09-30 23:42."
- `:1340`, the abstention: "Copy RATIFIED by Dann 2026-09-30 23:42." It keeps the register note and adds that Ilya, not "we", is the one that could not hear.
- `markup/legend.ts:27`: "RATIFIED by Dann 2026-09-30 23:42, English and French, as built."

**Left alone, as the brief says:** `readiness.ts`'s PLACEHOLDER thresholds, which are numbers for tuning. Two other "placeholder" mentions in `CalibrationWizard.svelte` (`:1295`, `:1301`) concern the deferred newcomer fry description, not these strings. `legend.ts:17` describes the copy's history and was left as history.

**Not seen live:** the readiness steps need a microphone and the wizard's flow. The strings are data, the type check passes, and gate 4 holds.

## Gates

| Gate | Before (after row 2k) | After |
|---|---|---|
| 1 phonology | 251 passed (251) | 251 passed (251) |
| 2 dictionary | 235 passed (235) | 235 passed (235) |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 1784 passed (1784) | 1784 passed (1784) |
| 5 score-parser | 636 passed, 5 skipped (641) | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) | 145 passed (145) |
| 7 integration | 55 passed (55) | 55 passed (55) |
| 8 ratchets | OK | OK |

The ship script's gate 4 baseline is still 1760; rows 2h to 2k move it to 1784.

## Files

`apps/web/src/lib/i18n.ts`, `apps/web/src/lib/voice/CalibrationWizard.svelte`, `apps/web/src/lib/markup/legend.ts`.
