# Report: N.203 lane 60, Step 1 (the seam)

2026-11-16. Code (cloud session), branch `cloud-lane-60`, after Steps 5 and 6. Brief r3 Step 1 with review amendments 3 to 7 (which strike the take-running flag, the visibility prop, and the new close callback). Paths under `apps/web/src/`. Test rule (desk 02:4x): only the files this step touched; the eight gates once at the end of Step 3.

## 1. What changed

- **New `lib/voice/seam.ts`** (the types and two pure rules; no browser): `VoiceRequestKind` (`record`, `summary`, `characteristics`, amendment 6: not `sing`), `VoiceRequest { phase, n, fromRest }`, `VoiceSeam` (the voices `{id, name}`, `activeId`, `nextDefaultName`, and the commands `select`, `create`, `duplicate`, `rename`, `remove`, `setOwn`; amendment 5), `landingFor(kind, hasReadings)` (`record` is Welcome for a voice with no stored reading, else the capture screen), and `requestRefused(phase, req)` (refused only when `phase === 'capture'` and `fromRest` is false, amendment 4).
- **`lib/voice/CalibrationWizard.svelte`** (1,376 to 1,400; ceiling 1,727): a new prop `onSeamChange` and an effect that publishes the `VoiceSeam` whole when the list, the active id, or `nextDefaultName` changes; `openRequest` is now a `VoiceRequest`, and its effect answers by `landingFor` (a `record` request sets `openTour(profile)` and bumps `captureKey`, which remounts the capture screen so a request from rest meets a fresh screen on the vowel Ilya's order names). A refused request is dropped, never answered later. The wizard's own `ProfileSwitcher` mount, with `disabled={phase === 'capture'}`, is **unchanged in this step**: it moves in Step 2 with the pane (amendment 3).
- **`routes/+page.svelte`** (5,512 to 5,524; ceiling 5,534; **10 lines free**, tight for Step 2): `voiceSeam` in one `$state.raw` (it holds functions); `onSeamChange` at the mount; `openVoice(kind)` grows from `openRangeFields` (amendment 5), sets the request with `fromRest: !calibrating`, raises the Drawer on a phone, and enters the takeover. With **no voice saved** it only opens the VOICE band (`sections.reveal(BAND_IDS.scoreMarkup)`) and returns, so nothing opens the takeover onto an empty wizard (amendment 7). INSIGHTS' "Add your range" calls `openVoice('characteristics')`.
- Not done here, on purpose: `voiceCalibrated` stays until `<VoiceAnchor>` leaves in Step 2 (it is that component's only reader). No visibility prop and no take-running flag.

## 2. Tests

- `lib/voice/seam.test.ts`, **5 passed (5)**: where `record`, `summary`, and `characteristics` land with and without a stored reading; a request over the capture screen from INSIGHTS is refused; a request from rest is not; every other phase answers every request.
- **The brief's two seam tests that need the wizard mounted are not unit tests here.** "A write from the pane changes the store and the page's active voice" and "a request from rest with the wizard stowed on the capture screen lands on the asked screen" need the wizard and the page mounted, and the tree has no DOM test environment (`jsdom` and `happy-dom` are absent from `package.json`; no component test mounts anything; adding one is a new dependency, which the brief forbids). They are Playwright tests in `e2e/` and belong to Step 2, when the pane first uses the seam; I will write them there and say so. **Until then the wiring is untested end to end.** The refused-request-is-dropped rule is covered by the pure test only.
- svelte-check: first run showed **1 error and 13 warnings** against baseline 0 and 12. The error was mine in this step (`activeId` can be `null`; the type now says so). The extra warning was an unused `.wizard-caption` rule that **my Step 5 left behind** when it removed the invitation; Step 5 shipped without a svelte-check run, which the desk's rule allowed, but I should have run it on a deletion this size. Removed here. svelte-check now reads **0 errors and 12 warnings in 5 files**.

## 3. What I could not establish

- Whether `$state.raw` and republishing the whole object on each `nextDefaultName` change cause extra renders in the pane (the pane does not exist yet).
- `captureKey`'s remount against lane 59's visit helper (the microphone's lifetime is tied to the capture screen mounting; lane 59 owns that and is not on `Shane`). I do not know that a remount on a `record` request from rest is harmless to its visit; **for the merge.**
- The `+page.svelte` ceiling: 10 lines free. Step 2 removes `VoiceAnchor`'s mount and `voiceCalibrated` (about 10 lines) and adds the pane's mount; it will land close. I will report the count and will not raise the ceiling.

## 4. For Dann's eye

Nothing needs a ruling. A fact for the desk: the review's blocker 3 said the page had 22 lines free; it had 23 on this tip and has 10 now.
