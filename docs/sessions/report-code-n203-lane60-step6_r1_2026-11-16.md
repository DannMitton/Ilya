# Report: N.203 lane 60, Step 6 (Finish, and MELODY's line)

2026-11-16. Code (cloud session), branch `cloud-lane-60`, on `c29d4b87` (Step 5). Paths under `apps/web/`. Test rule (desk 02:4x): only the files this step touched; the eight gates run once at the end of Step 3.

## 1. What changed

- **Finish returns to the Drawer at rest (D5).** Built in Step 5, reported here for the record: `finish()` in `src/lib/voice/CalibrationWizard.svelte` calls `onComplete?.(profile)`, and `src/routes/+page.svelte:3887` passes `onComplete={exitCalibration}`. It writes nothing (review amendment 20). Not yet seen end to end in a browser: the take path is lane 59's and the pane at rest is Step 2's. I looked at the summary screen and its Finish button was below the fold in each picture; I did not press it. **NOT ESTABLISHED in a browser until Step 2 or the Playwright run.**
- **MELODY's empty line takes sheet line 30**, character for character: `profile.emptyState` in `src/lib/i18n.ts` is now "Open VOICE and record your vowels, or choose a voice type to start from generic values." / « Ouvrez VOIX et captez vos voyelles, ou choisissez un type de voix pour partir de valeurs par défaut. » (the French sheet's line 30). No word of my own. The key count is unchanged (1,281).
- `e2e/singer-paths.test.ts:99`, `:102`, `:197`: the three assertions that pinned the old line now pin the new one (en, fr, en). Nothing else in that file is touched in this step (the Calibrate-button assertions at `:92-110`, `:182-204` are Step 2's).
- `src/lib/markup/MarkupPane.svelte:22`: one comment's quotation of the old line replaced by a pointer to the key.

## 2. Tests run

`i18n*.test.ts` and `src/lib/markup/**`: 11 files, **691 passed (691)**. The Playwright `singer-paths` assertions are edited and not run (end of Step 3).

## 3. Pictures (looked at: phone French, desk English; the other two carry the same string)

`docs/sessions/report-code-n203-lane60-pictures/step6-melody-{phone,desk}-{en,fr}.png`, 390 by 844 and 1440 by 900. The line is centred in the sheet's empty body and wraps to two lines at 390 px in French.

## 4. For Dann's eye

On the picture, MELODY with a bass voice type and no readings shows the heading "Resonance profile: placeholder values for a generic bass, not yet your own resonances" and, below it, line 30, which says to "choose a voice type to start from generic values". The type is already chosen, so the second half of line 30 offers what is already done. Line 30 is ratified; I did not change it. The desk may want a second line for the "type chosen, nothing recorded" case (sheet line 29 is the INSIGHTS method line, not this). Also, the French heading says « valeurs par défaut » where the English says "placeholder values": the existing heading, not this lane's.
