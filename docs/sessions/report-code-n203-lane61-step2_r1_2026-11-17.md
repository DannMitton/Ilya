# Report: N.203 lane 61, Step 2 (the characteristics screen leaves the takeover; the page opens stations)

Branch `cloud-lane-61`. Pictures: `docs/sessions/report-code-n203-lane61-pictures/step2-*.png` (the link's landing on a phone and on a desk, with an empty range; the Range with a filled range and with an inverted pair, phone and desk). I looked at all six.

## What changed

- `lib/voice/seam.ts`: `'characteristics'` leaves `VoiceRequestKind` and `Landing`. `'leave'` joins `VoiceRequestKind`; `OpenKind` is the two kinds that land on a screen (`record`, `summary`). `requestRefused` is unchanged. `seam.test.ts` changed with it, and gained a `leave` case (refused over the capture screen, answered from welcome, readiness, and summary).
- `lib/voice/CalibrationWizard.svelte` (1,293 to 1,148 lines): the `characteristics` phase, its markup, and its `.charx-group` CSS are gone; `Phase` is four values. A request whose kind is `leave` and that is not refused calls the new `onLeave` prop and nothing else: no `landingFor`, no `resetFlow`. `onComplete` is not used for it. The comments at the old `:115-119` and `:199-200` are rewritten.
- `routes/+page.svelte` (5,519 lines; ceiling 5,534): `leaveThen(action)` and `openStation(which, at?)` beside `openVoice`. With the takeover up, the press sends a `leave` request (`fromRest: false`) and stores the action; the wizard's `onLeave` calls `exitCalibration()` and then the action. A refused press stores an action that only a later `leave` can run, and each `leaveThen` overwrites it first, so nothing is answered later. `openStation` raises the Drawer on a phone, reveals the VOICE band, stops there with no voice saved, reveals the station, and asks the Drawer to scroll to `[data-station=...]`, or to `[data-describe="range"]` for `'range'`. "Add your range" now calls `openStation('describe', 'range')`. The word tap clears the target so it keeps its behaviour. The stale N.164 comment and the long anchor comment above the pane were cut to pay for the new lines.
- `lib/components/Drawer/Drawer.svelte` (1,986 lines; ceiling 1,990): the reveal carries a target (`revealTarget`, a selector; `''` is the word tap's ANALYSIS head). **Two defects in the tree, both fixed.** (i) The takeover's exit restores the stowed scroll in a `requestAnimationFrame`; a link asked in the same turn lost to it. A reveal that runs while a restore is queued now cancels it (`restoreQueued`, `restoreYields`). (ii) `revealScrollTop` sent a phone to 0 for every request; a link's target uses `link: true` and the desk rule on a phone too. The three scroll comments (the prop's, the effect's, "THE TWO SCROLLS") are rewritten to state the reason, and cite N.108, N.201, and "Dann 2026-11-16 20:13".
- `reveal-scroll.ts`: `link` input; header rewritten the same way. `reveal-scroll.test.ts`: four cases added; the word tap's seven expectations are unchanged.
- `VoicePane.svelte`, `routes/+page.svelte`: `OpenKind` replaces `VoiceRequestKind` in the pane's `onopen`.
- `lib/i18n.ts`: `calib.characteristics.title` and `.doneButton` marked `UNUSED SINCE N.203 lane 61 Step 2`. Nothing deleted. The three keys lane 60 already marked are left.

## Evidence the restore defect was real

I disabled the fix (`if (true) el.scrollTop = stowedScrollTop`) and ran the two "takeover up" desktop tests: both failed at `toBeInViewport` on the Range. With the fix restored: both pass. My first draft of those tests passed with the fix disabled too, because the Drawer was scrolled to the Range anyway; the final tests set the Drawer to the top before entering the takeover, so the restore would undo the link.

## Tests

- `e2e/voice-links.test.ts` (new, desk, 6): the link lands with the VOICE band closed, and with INPUT and VOICE open (the Drawer scrolls); with the takeover up on Welcome and on the summary (leaves, lands, still landed after the restore's frame); from the test fry (leaves, lands, the microphone visit closes); an inverted pair shows its amber note.
- `e2e/voice-pane.test.ts`: the range-link test now asserts a press over the capture screen is dropped and never answered later (the station stays closed after the singer leaves), and that from rest the Describe station opens at the Range with no takeover. `calibratedAt` unchanged is asserted in `voice-stations.test.ts` and in the door tests.
- `e2e-phone/voice-stations.test.ts`: the link lands with the Drawer lowered and with it open on the VOICE pane, and with the takeover up on Welcome.
- Word tap unchanged and green: `e2e/word-tap-opens-analysis.test.ts`, `e2e-phone/word-tap-opens-analysis.test.ts`.

## Gates

phonology 462 (462); dictionary 248 (248); svelte-check 0 errors, 12 warnings, 5 files; web 6502 passed, 1 skipped (6503); score-parser 904 passed, 5 skipped (909); blurb 178 (178); root 159 (159); ratchets OK. Playwright: desk `voice-links`, `voice-pane`, `voice-stations`, `word-tap-opens-analysis` together, 36 of 36; phone `voice-stations` 4 of 4 and `word-tap` 1 of 1.

## Not covered, and for Dann's eye

- **"With no voice saved, the pane shows its first-launch form" is not reachable from this link**: INSIGHTS draws "Add your range" only for a voice (an existing test pins that). `openStation` has the branch, as `openVoice` does; no browser path presses it yet. Step 3's link L1 is also not drawn with no voice.
- **The pictures of a filled range and an inverted pair come from opening the station by its header, not by the link.** INSIGHTS offers "Add your range" only to a voice with no range, so the link cannot land on a filled range. The landing picture is with an empty range.
- **GUIDE left untrue, for the GUIDE's rewrite:** `GuideContent.svelte:389` (English) and `:85` (French, « saisies depuis le sommaire du profil dans le Tiroir »).
- `VoiceTypeIntake.svelte:147` still has a comment naming `.charx-heading`, a class that no longer exists (the wizard lost it in Step 1). Not mine to edit; stated here.
- Pictures use English only for this step; the stations' French is in the Step 1 pictures.
