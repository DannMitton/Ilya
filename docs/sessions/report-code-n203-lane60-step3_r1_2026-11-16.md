# Report: N.203 lane 60, Step 3 (the two doors open the built screen) and the end-of-step-3 verification

2026-11-16. Code (cloud session), branch `cloud-lane-60`, after Steps 5, 6, 1, and 2. Brief r3 Step 3 with review amendment 23. Paths under `apps/web/`. This is the end of the last step before the wait, so the desk's rule has me run all eight gates and the Playwright suites the brief names once, here (sections 3 and 4).

## 1. What changed

- **"Describe your voice" and "What INSIGHTS shares, and how"** (sheet line 8) already call `openVoice('characteristics')` (built in Steps 1 and 2: `src/lib/components/Drawer/VoicePane.svelte`, `src/routes/+page.svelte`). They open the built "Voice characteristics" screen in the takeover by `openRequest`, at any time, with no microphone and no capture screen (`landingFor('characteristics', …)` is `characteristics` whatever is stored). INSIGHTS' "Add your range" still opens it the same way (`onaddrange={() => openVoice('characteristics')}`).
- **Done returns to the Drawer at rest** (amendment 23). In `src/lib/voice/CalibrationWizard.svelte` the screen's Done button called `phase = 'summary'`; it now calls `finish()`, which closes the takeover through the `onComplete` the page passes (`exitCalibration`) and writes nothing. For "Add your range" the close returns to INSIGHTS, which never left the page. The wizard is 1,380 lines.
- Lane 61 later divides that screen into two sections that open in place; nothing here pre-empts it.

## 2. Tests

`e2e/voice-pane.test.ts`, two new tests (one for each door): the screen's heading "Voice characteristics" is visible, no capture screen is on the page, Done returns to the pane at rest with its sentence visible, and `calibratedAt` is as it was. **2 passed** alone; part of the 8 in that file below. Unit files for this step: none (the change is one handler); the wiring is pinned by the browser test.

## 3. The eight gates, once, on this branch after Step 3 (compared with Step 0's untouched tip)

| # | Gate | Baseline | Step 0 measured | After Step 3 |
|---|---|---|---|---|
| 1 | phonology | 462 passed (462) | same | 462 passed (462) |
| 2 | dictionary | 248 passed (248) | same | 248 passed (248) |
| 3 | svelte-check | 0 errors, 12 warnings, 5 files | same | 0 errors and 12 warnings in 5 files |
| 4 | web unit | 6313 passed \| 1 skipped (6314) | 6312 passed \| 1 failed \| 1 skipped (6314) | **6337 passed \| 1 failed \| 1 skipped (6339)**; the failure is named in section 3.1 |
| 5 | score-parser | 894 passed \| 5 skipped (899) | same | 894 passed \| 5 skipped (899) |
| 6 | blurb | 178 passed (178) | same | 178 passed (178) |
| 7 | root | 159 passed (159) | same | 159 passed (159) |
| 8 | ratchets | OK | OK | OK |

Gate 4 passes 25 more tests than Step 0's 6312 (net of the four anchor tests that went with `VoiceAnchor`): the seam's 5, the pane's 16, the pane-wiring 2, and the sheet's and readings' additions.

### 3.1 Gate 4's one failure

`src/lib/voice/engine/open-extract.test.ts > the open picker is agnostic > gives the same reading whichever vowel is asked`, the same 5 s timeout as on the untouched tip at Step 0 (there it passed alone, 9 of 9, in 10 s). A second full run of gate 4 after the first, with output kept, names it again. It is the only failure; this lane changes no file it reads. Nothing in this lane's files fails.

## 4. The Playwright suites the brief names

Chromium, desk project, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, `--trace off`, one worker, development server.

- **`singer-paths`: 7 passed (7)**, including the MELODY line in both languages and the empty-state test, with the three assertions I rewrote.
- **`voice-pane` (new): 8 passed (8)** in the run (the two door tests were added after the first run of 6; all 8 pass).
- **`calibrate-new`: 11 passed, 15 failed, 27.5 minutes.** I did not edit this file past `toCapture` (`:29-34`), as the review's amendment 2 orders, so these failures are expected until lane 59 is on `Shane`. Every failure is a site this lane's removals broke, and each is in the review's list except one:
  - `:71` (the full tour, after Done): `getByText('Your vowel space').first()` now resolves to the pane's new door button, which is hidden while the takeover is up. **A new site, not in the review's list**, caused by the pane's door label, not by a removal. The fix after the merge is to select the sheet's heading.
  - `:110` (and `:161`, `:170`, `:176`), "N of 10 vowels sampled": the lede is gone.
  - `:145`, `:167`, `:175`, `:186`, `:330`, `:395`: clicks of "Re-calibrate" (the anchor is gone). `:379`: a click of "Calibrate". Their following steps (roster Re-take at `:146`, `:168`, `:187`, `:396`; summary Continue at `:177`, `:331`) are unreached.
  - The 11 that pass go through `toCapture` and the capture screen, so the entry helper works.
  The list of sites for the repair after the merge is therefore the review's 17 plus `:71`.

## 5. What I could not establish

- Whether `calibrate-new` passed before this lane on this machine: I did not run it on the untouched tip (Step 0 ran the eight gates only), so I cannot say that the 11 passes and the 15 failures differ from the baseline in any other way than the causes above. The causes are read from each failure's own message.
- Phone-project suites (`e2e-phone`) are not among the suites the brief names and were not run.
- The Step 3 screen itself in a picture: the brief asks for pictures after Steps 2, 4, and 5 only; I took none here.

## 6. For Dann's eye

Nothing new. The floor screen is the built "Voice characteristics" page, unchanged but for Done; Lane 61 reshapes it.
