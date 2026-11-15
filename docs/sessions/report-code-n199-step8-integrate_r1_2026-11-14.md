# Report, N.199 Step 8: the new Calibrate screen for every singer, and the wheel deleted

Cloud lane 55, branch `cloud-lane-55`. This file grows by one part per step; each part is pushed with its step.

## Step 0. Read and report

**Base (A1).** Cut from `origin/Shane` at `e8f91ee7`, message "N.199 Step 8: integrate brief r2 with Fable review" (`git log`, `git rev-parse HEAD`). The local `Shane` ref in the fresh clone was at `649fe49`; `git fetch origin Shane` brought it to `e8f91ee`. Tree clean before any edit. Fresh clone, `pnpm install --frozen-lockfile`, Node v22.23.4, pnpm 10.28.0.

**The eight gates on the untouched tip** (run by one script, each exit 0):

| Gate | Count |
|---|---|
| 1 phonology | 462 passed |
| 2 dictionary | 248 passed |
| 3 web-check | 0 errors, 12 warnings (5 files) |
| 4 web-test | **5662 passed, 1 skipped (5663)** |
| 5 score-parser | 785 passed, 5 skipped (790) |
| 6 blurb | 178 passed |
| 7 integration | 155 passed |
| 8 ratchets | OK |

**Every importer of `calibrateNewOn` / `calibrate-switch`** (grep over `apps`, `packages`, excluding `docs/sessions`), as read:
- Code that calls it: `CalibrationWizard.svelte:49` (import) and `:258` (`const calibrateNew = calibrateNewOn()`), used at `:770`, `:985`, `:998`, `:1380`; `chart/SummarySheet.svelte:8` (import) and `:13`, used at `:16`.
- Its own test: `chart/calibrate-switch.test.ts`.
- Comments only that name `?calibrate=new`: `app.css:170`, `profileStore.ts:134`, `takes.ts:2`, `VowelCapture.svelte:5`, `chart/SummarySheet.svelte:2`, `e2e/calibrate-new.test.ts:2`.
- The address itself is used by `e2e/calibrate-new.test.ts:21` and `chart/stub-switch.test.ts:12-13`.

**Every importer of `lib/voice/pacifier/`:**
- Code import: **one**, `CalibrationWizard.svelte:45` (`import Pacifier from '$lib/voice/pacifier/Pacifier.svelte'`).
- Inside `pacifier/`: `contrast.test.ts:40` imports `./contrast`; `pacifier/count-in.ts` is a re-export of `voice/count-in.ts` (so `count-in` is already outside; nothing moves first, A7).
- Names it in a comment or a test-only path, no import: `lib/i18n.ts:58` and `:88` (the key index, which `i18n-index.test.ts` checks for existing paths: B1), `vowel-names.ts:22`, `engine/readiness.ts:124`, `CalibrationWizard.svelte:569`, `VowelCapture.svelte:5`, `capture-ritual.svelte.ts:4`, `count-in.ts:20`, `ARCHITECTURE.md:119`.
- Outside `lib/voice/`: nothing imports from `pacifier/` (grep over `apps`, `packages`, `scripts`). The desk's open question is closed.

**Other e2e tests that drive the wheel.** `grep -rn "pacifier\|Pacifier"` over `apps/web/e2e` and `apps/web/e2e-phone`: no match. `grep` for `calibrat|wizard|Resonance|wheel` finds only `calibrate-new.test.ts` and four files that seed a stored voice (`insights-page`, `insights-key-lines`, `pages-without-gaps`, `singer-paths`) and never open the wheel. Closed: none other drives the wheel.

**Other readers of the three CSS tokens** (`--surround-voice`, `--arc-green`, `--signal-red`): `Pacifier.svelte` and `pacifier/contrast.ts` and its test only; `+page.svelte:5045` and `app.css:144` name `--surround-voice` in comments.

## Step 8a. The handover (one commit)

**What changed.** `CalibrationWizard.svelte` goes from 2118 to 1727 lines (`wc -l`; ratchet ceiling `scripts/ratchets.json` 2124 to **1727**, the only ceiling lowered here).
1. The capture phase mounts `VowelCapture` for every singer (`{:else if phase === 'capture'}`). `chart/calibrate-switch.ts` and its test are deleted; `grep -rn calibrateNewOn apps packages` finds nothing. An address carrying `?calibrate=new` does nothing and breaks nothing (e2e below).
2. `chart/SummarySheet.svelte` draws the vowel-space sheet for every singer; its `on` test is gone.
3. `chart/stub-switch.ts` stays. One addition, code only, no words: the stub's readiness verdict can be set from a development test with `window.__ilyaStubReadiness` (default `clear`), as `__ilyaStubNext` already scripts takes. It exists so the room notice (B2) can be pictured and tested.
4. **Gone from the wizard:** the `Pacifier` import, `pacifierRef`, the seven `activateVowel` calls, the queue (`queue`, `queueIndex`, `currentVowel`) and its auto-advance (`advance`), the hold (`HOLD_MS`, `holdActive`, `holdVowel`, `holdKind`, `holdTimer`, `beginHold`, `interruptHold`, `holdContinue`, `holdRetake`, `holdAnnounce` and its live region), Pause (`paused`, `togglePause`), `returnToSummary` (the new screen's `onReturn` replaces it), `handleVowelCaptured`, `handleVowelSkipped`, `handleRolledBack`, `handleProfileChange`, `sameExtraction`, `pacifierFormants`, the `onProfileChange` prop (no mount passed it: Step 0), and the CSS only the wheel branch used (`.wizard-progress`, `.wizard-cue`, `.wizard-pacifier-wrap`, `.wizard-catcher`, `.wizard-quiet-actions`, `.wizard-hold-slot`, `.wizard-pause`). `hold.ts` is deleted (A5; sole importer was the wizard).
   **Stays:** `withPlausibility`, `withIghPass` (now called only from `commitReading`), persistence, `logAnnounce`, `commitReading`, `keepOutside`, the roster (summary only), the challenging invitation, `recordTake`.
5. **B2, the room notice stays.** The existing block with its two existing strings (`calib.capture.toast`, `calib.capture.toastDismissAria`), raised by `beginCapture` as before, now renders above `VowelCapture` in the capture branch. Pictures `07-room-notice-*`. **A cost, for the walk:** the notice is in the flow, so the screen moves down about 70 px while it shows and back up when it goes (5 s or its ×). Nothing is under the thumb at that moment, but it is a shift on a screen whose rows are built not to shift. DESK DEFAULT, Dann's to strike; the alternative is an overlay, which would cover the title and count.
6. **B3, a way back into the tour.** On the summary, while `capturedCount < 10`, a button labelled `calib.common.continue` ("Continue" « Continuer ») calls `openTour(profile)` and opens the capture screen on the next unsung vowel in Ilya's order. No new string. Pictures `08-` (nine sung) and `09-` (three sung). **A finding:** from seven sung, the existing invitation "Sing the three Ilya derived for you" shows beside it and leads to the same place by a different word. I built what B3 binds ("fewer than ten") and did not hide either; picture `08-summary-nine-continue-*` shows both. Whether Continue should give way to the invitation once the seven are sung is Dann's.
7. **A10, the take record is written for every singer** (`onTake={recordTake}`). Comments corrected: `takes.ts:2`, `profileStore.ts:134`, `VowelCapture.svelte:5` and `:65`, `app.css:170`. Stale comments in the wizard that named the wheel (header, `:126`, `:147`, the `withIghPass` seam note, the roster siglum note, the Ghost-pill note) are reworded; remaining mentions of "pacifier" in the wizard are two citations of historical spec names (`pacifier spec v11 §15` and `§17`), left as the spec's own title.

**Tests.** `e2e/calibrate-new.test.ts`: `open()` goes to `/?capture=stub` (A11); added (a) no `.pacifier` in the DOM and `?calibrate=new&capture=stub` still loads the screen and its hint; (b) the summary's Continue with three sung opens on [ɛ] ("Ready for [ɛ]."); (c) a lively room raises the notice and its × dismisses it. `chart/stub-switch.test.ts:12-13` keeps its two lines with comments that say the retired switch does nothing and does not block the stub. `outside.test.ts`: the block "no question during capture" (two `it`, both on `hold.ts`) is removed (A5). What those two guarded, and what guards it now: that a take judged implausible announced as captured with no question in it. The new screen shows no verdict at capture (`VowelCapture.svelte` header, "Capture shows no verdict"), and `commitReading` still announces through `logAnnounce`; no test pins the new screen's announcement. NOT ESTABLISHED: whether a test should.

**Other e2e that drove the wheel:** none (Step 0). **The whole of `e2e/calibrate-new.test.ts`**, chromium project, no switch in the address, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, `--trace off`: the first 16 tests **16 passed (6.6 m)**; the room-notice test, written after that run began, **1 passed (18 s)**. All 17 pass; they were not run in one invocation.

**Gate 4: 5662 before, 5657 after (-5).** Removed: `chart/calibrate-switch.test.ts` (3 `it`: that the switch is off for any value but `new`, on for `new` alone or among others, off with no address; it guarded the switch, which is gone) and the two `it` in `outside.test.ts` (above). `pacifier/contrast.test.ts` goes in 8b (A6).

**The eight gates on the 8a tree:** 462; 248; 0 errors, 12 warnings (the same 12, 5 files); 5657 passed, 1 skipped; 785, 5 skipped; 178; 155; ratchets OK.

**Pictures** (`report-code-n199-step8-pictures/`, 36, each looked at by me): for each of phone 390 by 844 and desktop Drawer 1440 by 900, English and French (`-phone-en`, `-phone-fr`, `-desk-en`, `-desk-fr`): `01-entry` (the Calibrate entry), `02-rest` (the capture screen at rest), `03-landing` (a take landing, on the stub, [ʌ] captured, "10 of 10"), `04-allten` (all ten, "Done"), `05-summary-sheet` (the summary scrolled to the sheet), `06-readings-open-scrolled`, `07-room-notice`, `08-summary-nine-continue`, `09-summary-three-continue`. Things I saw: the phone's closed readings line is below the fold at rest (as the readings ruling accepts); at ten sung with the list open the stage covers the upper rows (the 8c.1 finding, picture `06`); the notice sits above the title and moves the screen down.

**What the desk's A12 asks: lines this step deletes that N.200 r2 cites** (`brief-code-n200-voice-as-it-is_r2_2026-11-13.md`, lines 94 to 96): `hold.ts:19-22` and `hold.ts:11-18` (the file is deleted); `CalibrationWizard.svelte:850-859` (the E.26 comment in `handleProfileChange`, deleted); `pacifier/Pacifier.svelte:219, :290, :419, :458` (the wheel, deleted in 8b). Line numbers N.200 cites elsewhere in `CalibrationWizard.svelte` (`:308-319`, `:289-298`, `:814`, `:872`, `:1202`) have moved: `withPlausibility` and `withIghPass` are at their new lines by name, and `withIghPass` is now called only inside `commitReading`.

## Step 8b. The deletion (one commit)

**Deleted whole:** `lib/voice/pacifier/` (`Pacifier.svelte` 949 lines, `contrast.ts` 384, `contrast.test.ts`, `count-in.ts`, which was a one-line re-export). Nothing moved first (A7): `count-in` was already `lib/voice/count-in.ts`, and the only code import from `pacifier/` was the wizard's (removed in 8a). After the commit, `grep -rn "pacifier/" apps packages scripts` finds no import; it finds comments that say the wheel is deleted.

**The key index (B1).** `lib/i18n.ts` index block: `pacifier.` repointed to `lib/voice/capture-ritual.svelte.ts` (`:58`), `vowel.` to `lib/voice/vowel-names.ts, lib/markup/legend.ts` (`:88`). The counts (17, 11) did not change, because keys are marked, not deleted. `i18n-index.test.ts` passes.

**Marked `UNUSED SINCE N.199`, kept with their French (A3).** Each confirmed to have no other reader (grep over `apps/web/src`, `e2e`, `e2e-phone`, `packages`; the only other hits were two comments):
- wheel only: `pacifier.tapToCapture`, `pacifier.wheelAria`, `pacifier.ready`, `pacifier.skipped`, `pacifier.sampleUncertain`;
- the wizard's old capture branch only: `calib.capture.allSet`, `.paused`, `.resumeButton`, `.pauseButton`, `.hold.captured`, `.hold.rolledBack`, `.hold.noted`.
That is 12 keys, 12 comment lines in `i18n.ts`. No word was written; the comment is code, not copy. **Where this touches lane 54:** I edited `lib/i18n.ts` at the index block (`:58`, `:88`) and above those 12 keys. Lane 54 edits the same file (four new keys and the key index at `:19`). The merge in the last step keeps both.

**Tokens and test lines gone:** `--surround-voice`, `--arc-green`, `--signal-red` from `app.css` (their only readers were `Pacifier.svelte`, `contrast.ts` and its test); the line "`--surround-voice` is not retired" in `colour-story.test.ts`'s header (SCOUT). `--prep-amber` stays: the wizard's note and toast read it. `colour-story.test.ts` half two still computes the word-carrying pairs from `app.css`.

**Stale comments corrected:** `CalibrationWizard.svelte` (8a), `engine/readiness.ts:124`, `engine/live.ts` (`:2`, `:20`, `:76`, `:110`), `engine/session.ts`, `engine/types.ts` (the `:22-25` wizard note and `:6`), `capture-ritual.svelte.ts` (`:4-5`, `:35`, `:37`, `:49`), `count-in.ts`, `vowel-names.ts`, `routes/+page.svelte:5046`, `ARCHITECTURE.md:119`. Left as they stand: comments that call the capture "the pacifier" as history in `engine/stub.ts:6`, `engine/derivations.ts:27` (a spec citation), `count-in.test.ts:12` and `:86`, `LoupeSyllables.svelte:121`, and the `pacifier.*` key names (ruled kept), plus the font section header in `app.css:7` (the Lato IPA subset, which the capture screen still uses).

**Gate 4: 5657 before, 5597 after (-60).** One file went: `pacifier/contrast.test.ts` (45 `it` sites by grep; 60 tests by the runner's count, since some are `.each`). It guarded the wheel's colour pairs (every locked state combination of the wheel's band, arc and sigla cleared WCAG, every owned exception was in fact sub-threshold), WCAG's own maths against reference values, and that its `PALETTE` matched `app.css` literally (R20). With the wheel and its three tokens gone, nothing is left for it to guard. `colour-story.test.ts` guards the word-carrying pairs the new screen and the rest of the app use.

**The eight gates on the 8b tree:** 462; 248; 0 errors, 12 warnings; 5597 passed, 1 skipped; 785, 5 skipped; 178; 155; ratchets OK. No ceiling other than the wizard's (8a) moved because of this lane's work.
