# Brief to Code: seat ten ratified strings that were PLACEHOLDER

From the desk, 2026-09-30 23:50. No git writes. Gates before and after. Use the file's apostrophe escape (`’`).

**RATIFIED by Dann 2026-09-30 23:42 (*"yes"*)**, all ten as drafted by the desk. Found by the desk's sort of code markers 23:41: each was marked "PLACEHOLDER, flagged for Dann" with no ruling on record.

## Change these five, verbatim

| Key | English | French |
|---|---|---|
| `calib.readiness.quiet` | Listening to the room. Stay silent for a moment. | Ilya écoute la pièce. Restez en silence un moment. |
| `calib.readiness.prepareLede` | Next, a short test fry, so Ilya can check that the microphone hears you. | Ensuite, une courte friture d’essai, pour qu’Ilya vérifie que le micro vous entend. |
| `calib.readiness.captureAria` | Recording your test fry | Enregistrement de votre friture d’essai |
| `calib.readiness.noMic` | Ilya could not reach your microphone, so nothing was measured. | Ilya n’a pas pu accéder à votre microphone, donc rien n’a été mesuré. |
| `calib.readiness.noFry` | Ilya did not hear fry, so nothing was measured. | Ilya n’a pas entendu de friture, donc rien n’a été mesuré. |

## Ratified as built, text unchanged

`calib.readiness.captureLede`, `calib.roster.noiseFloorTitle`, `calib.challengingInvite.button`, `calib.challengingInvite.caption`, and `MARKUP_WITHHELD_COPY` (`markup/legend.ts`).

## Also

Replace every "PLACEHOLDER ... flagged for Dann, who writes copy" comment on these strings (`CalibrationWizard.svelte` near `:1131`, `:1210`, `:1317`, `:1324`, `:1340`; `markup/legend.ts:27`) with one line carrying the ratification and its date. "Dann writes copy" is superseded (`CONTRACT.md` §4, 2026-09-19: the desk drafts, Dann ratifies). Leave `readiness.ts`'s PLACEHOLDER thresholds alone: they are numbers for tuning, not copy.

## Report

`docs/sessions/report-code-calibration-copy-ratified_r1_2026-09-30.md`.
