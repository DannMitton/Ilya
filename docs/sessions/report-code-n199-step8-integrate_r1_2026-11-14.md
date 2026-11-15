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

## Step 8c. Two layout repairs from lane 53's pictures (one commit)

Both are in `VowelCapture.svelte`; no word changed.

### 8c.1 The readings list under the sticky stage

**What changed.** `.stage` gets `class:flows={stageFlows}` with `stageFlows = listOpen && ritual.phase === 'idle'`, and `.stage.flows { position: static }`. DESK DEFAULT, Dann's to strike on his walk (brief 8c.1; review A8). `ritual.phase` is `idle` only when no take runs and no landing plays, so a take and its landing stay sticky and the dot is seen. Static and sticky leave the stage in the same place in the flow, so changing between them moves nothing at rest and the scroll position holds. The brief's clause "the closed line is clear of the stage at 375 by 667" is struck, as the review's A8 ruled: a rule acting on an open list cannot change a closed one.

**Measured** (Chromium, touch, dev server, four vowels sung and six placeholders, the list open, scrolled in 10 px steps through the takeover's whole length; "before" is the old rule forced back with injected CSS on the same page; a row counts as clear when it is wholly in view and no part of it lies behind the stage; `m8c.cjs`, the same numbers in English and in French):

| window | rows reachable clear at some scroll, before | at the end of the scroll: clear / behind the stage, before | same, after |
|---|---|---|---|
| 390 by 844 | 10 | 6 / 4 | **10 / 0** |
| 375 by 667 | 10 | **0 / 10** | **10 / 0** |
| desktop 1440 by 900 | 10 | 7 / 3 | **10 / 0** |

(Before the change every row was reachable at some scroll position by scrolling back up, so that clause held already; what failed was the end of the scroll, where the singer stops, and at 375 by 667 all ten rows lay behind the stage. After: all ten wholly in view and none behind the stage, at every window, both languages.) The stage's `position` reads `sticky` with the list closed, `static` with it open at rest.

**A take started while scrolled, the list open, the hide toggle off.** The stage's top against the top of the scrolling area, in px, at rest, 500 ms into the take, and back at idle (the same in English and French; the scroll position was 150, 300, or 400 px and did not change at the tap or at idle in any row):

| window | scroll | at rest | during the take | back at idle |
|---|---|---|---|---|
| 390 by 844 | 150 | 111 | 111 (moves 0) | 111 |
| 390 by 844 | 300 | -39 | 4 (moves 43 down) | -39 |
| 390 by 844 | 400 | -139 | 4 (moves 143) | -139 |
| 375 by 667 | 150 / 300 / 400 | 106 / -44 / -144 | 106 / 4 / 4 | 106 / -44 / -144 |
| desktop | 150 / 300 / 400 | 133 / -17 / -117 | 133 / 4 / 4 | 133 / -17 / -117 |

So: while the stage's own place is still below the top of the screen, nothing moves at the tap; once it has scrolled partly out, the tap brings it to the top, by as much as it had scrolled out (43 px at a scroll of 300 on a 375-wide phone, 143 px at 400); at idle it returns to its place in the flow by the same amount. Where the 300 and 400 rows were measured, the Start button was clicked by script: a thumb cannot reach it when the stage is mostly off screen, so the largest jump a singer can cause by a tap is the part of the stage above the top while Start is still on screen. NOT ESTABLISHED: where the jump is largest in practice on a real phone, and how it feels.

**Pictures:** `8c1-before-phone{375,390}-{en,fr}.png` and `8c1-after-phone{375,390}-{en,fr}.png` (the list open, scrolled to its end; before, the rows are behind the stage, 375 by 667 shows none; after, all ten show), and `8c1-during-take-phone375-en.png` (a take at a scroll of 300: the stage sticks, the dot is seen). All nine looked at by me.

### 8c.2 « Commencer [i] » and « Reprendre [i] » on two lines

**What changed.** `.main` gets `white-space: nowrap` and `padding: 0 0.9rem`. `.actions` already wraps (`flex-wrap: wrap`) and `.stop` is already `nowrap`, so where the pair does not fit the row wraps as a whole. The padding was added after I looked at the first picture: with `nowrap` alone the longest label sat about 5 px from the button's edge at 375 and 390, legible but cramped. The brief's mechanism ("for example `white-space: nowrap`") needed it for the singer's finger and eye; it changes no word.

**Before** (the 8b version of the component, measured and pictured; capture width 307 at 375, 322 at 390, 252 at 320):

| language, window | label | main button | stop button |
|---|---|---|---|
| fr 390 | « Commencer [i] » | 100 by **48** (two lines) | « Tout recommencer » 213 |
| fr 390 | « Reprendre [i] » | 100 by 44 (one line) | 213 |
| fr 375 | « Commencer [i] » | 90 by **48** | 208 |
| fr 375 | « Reprendre [i] » | 90 by **48** | 208 |

The review's claim that « Reprendre [i] » wraps at 390 is not borne out here: it wraps at 375, not at 390. At 320 the French row wrapped as a whole already (the pair needs more than the 252 px).

**After** (measured on the shipped code, every label, both languages, one line is 44 px tall; `main` width by `stop` width in px):

| window (capture width) | Start [i] / Start over | [i] in progress / Stop | Re-take [i] / Start over | « Commencer [i] » / « Tout recommencer » | « [i] en cours » / « Arrêter » | « Reprendre [i] » / « Tout recommencer » |
|---|---|---|---|---|---|---|
| 320 (252) | 104 / 139, one row | 127 / 115, one row | 104 / 139, one row | **252 / 252, two rows** | 116 / 126, one row | **252 / 252, two rows** |
| 375 (307) | 140 / 157 | 164 / 133 | 140 / 157 | 130 / 168, one row | 153 / 144 | 119 / 179, one row |
| 390 (322) | 150 / 162 | 174 / 138 | 150 / 162 | 130 / 183, one row | 163 / 149 | 119 / 194, one row |

Every main and stop label is 44 px tall (one line) in both languages at 320, 375, and 390. At 320 the French pair does not fit in one row (252 px against 129 + the label's width + padding and gap), so the row wraps as a whole: « Commencer [i] » on one line, full width, and « Tout recommencer » on one line below it. English holds one row at all three. The English widths moved by up to 10 px with the padding.

**Pictures** (all looked at by me): `8c2-before-390-fr-start.png`, `8c2-before-375-fr-retake.png` (two lines, the defect); `8c2-after-390-fr-start.png`, `8c2-after-390-fr-retake.png`, `8c2-after-375-fr-start.png`, `8c2-after-375-fr-retake.png`, `8c2-after-320-fr-start.png`, `8c2-after-320-fr-retake.png` (the wrapped row at 320), `8c2-after-390-en-retake.png`.

### Tests (A11) and gates

`e2e/calibrate-new.test.ts` gains, for 8c.1, two tests (390 by 844 and 375 by 667: the stage is `sticky` with the list closed, `static` open at rest, every one of ten rows wholly in view and clear of the stage at some scroll position, `sticky` during a take, `static` again at idle, `sticky` when the list is closed again), and, for 8c.2, eight (English and French, each at 320, 375, and 390: Start and Stop on one line, with a take running; and, in each, Re-take on one line at 375). The helper `open()` takes a `lang`. Gate 4 is unchanged by 8c (**5597**): the new tests are browser tests. **The eight gates on the 8c tree:** 462; 248; 0 errors, 12 warnings; 5597 passed, 1 skipped; 785, 5 skipped; 178; 155; ratchets OK.

**The whole of `e2e/calibrate-new.test.ts` on the 8c tree:** one invocation, chromium project, no switch in the address, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, `--trace off`: **27 passed (8.5 m)** (the 17 from 8a, two for 8c.1, eight for 8c.2).

## The merge with `Shane`, and lane 54

`git fetch origin Shane` at the end: `origin/Shane` is still `e8f91ee7`, the commit this branch was cut from. It has not moved, so there was no merge to make and no second round of gates to run after one. The gates of record for the tip are the 8c run above (the last code change; after it only this report and four test titles changed, and `svelte-check` was re-run: 0 errors, 12 warnings).

Lane 54 (`cloud-lane-54`) has not reached `Shane`. For Dann's merge, read-only: its branch is at `4ea05c5` ("N.201: report r1 and the 43 pictures (steps 1 to 5)"), cut from `463290e1`. A trial merge of it into this branch, in a throwaway worktree that I removed, **merged with no conflict** (`i18n.ts` and `routes/+page.svelte` auto-merged; this lane edits `i18n.ts` at the index lines `:58` and `:88` and above twelve keys at `:1318` to `:1460`; lane 54 edits it at `:16`, `:24`, `:69`, `:1055`, `:1769`). `scripts/ratchets.json`: lane 54's branch makes no change to it, so only this lane's wizard ceiling (2124 to 1727) is in play. **The gates on that merged tree were NOT RUN.** Whoever ships second should merge `Shane` and run all eight.

## Done-when, checked

- All eight gates pass on the tip; gate 4: **5662 before, 5657 after 8a, 5597 after 8b, 5597 after 8c**.
- The whole of `e2e/calibrate-new.test.ts` on the chromium project with no switch in the address: **27 passed** in one invocation.
- This report and its pictures, `report-code-n199-step8-pictures/` (36 for 8a and 8b, 17 for 8c, each looked at).
- `grep` over `apps`, `packages`, `scripts` for an import from `pacifier/`: **0**; for `calibrateNewOn` or `calibrate-switch`: **0**; `lib/voice/pacifier/` does not exist.
- The branch pushed: `cloud-lane-55`.

## For Dann's walk (not built, from the brief)

- **Removing one vowel's reading.** The wheel's long press went with the wheel; the new screen has Clear all and Re-take only. Not covered until N.200 builds "use Ilya's estimate for now".
- **Whether the stage sticks at rest at all** (8c.1 is the narrow version of this question).
- **B3's Continue next to the existing invitation** from seven sung (two buttons, one destination), and **B2's notice moving the screen down about 70 px for five seconds**.
- Whether release may go without single-vowel removal if N.200 slips (the review's third question).

## What you could not establish

- **Any behaviour in Safari or Firefox**, and in particular the rendered effect of 8c.1 and 8c.2 on a phone in Safari (the desk's own open item). Every picture and measure is headless Chromium on the development server, with touch emulation; Chromium's button padding is what the widths include.
- **The microphone path.** Every browser test and picture runs on `StubCaptureSession`. Nothing here exercised `LiveCaptureSession` on the new screen, so a take from a real voice, a real room, or a denied microphone was not seen.
- **How the 8c.1 jump feels on a real phone**, and where it is largest in practice (see its section).
- **Whether the room notice and the summary's Continue are right for singers**: both are DESK DEFAULTS built from the review, seen only in pictures.
- **Whether a test should pin the new screen's screen-reader announcement.** The two assertions removed with `hold.ts` guarded the wheel's; `commitReading` still sets `logAnnounce`, but no test reads it.
- **The printed sheet from the browser's own print dialogue**, and anything on the summary I did not change.
- **Gates on the merge with lane 54**: not run (above).
- **Whether other Playwright projects** (the rest of `chromium`, and `phone`) **still pass.** I ran only `e2e/calibrate-new.test.ts`. A grep found no other e2e or phone test that opens the wheel or the capture screen (Step 0), but I did not run them.
- Lines this lane's report cites in `CalibrationWizard.svelte` before 8a (the desk's numbers from `62dc2b2f`) were re-read at `e8f91ee7` before each use; any line number in the older briefs that I did not need was not re-checked.
