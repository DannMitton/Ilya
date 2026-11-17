# Packet: N.203 lane 60 as built (scout, read only)

r1, 2026-11-16, Sonnet scout. Brief: `/home/claude/n204/brief-sonnet-scout-lane60-as-built_r1_2026-11-16.md`. Clone: `/home/claude/scout60/repo`, detached at `origin/cloud-lane-60` `38ec37c2`. Paths are under `apps/web/src/` unless they begin `apps/`, `docs/`, or `scripts/`. "Head" means `38ec37c2`. I judge no design. Where I did not read a line myself I say so. NOT ESTABLISHED beats a complete invented answer.

Names I coined: none. Everything is adopted from the brief, the reports, or the code.

## 1. Commits, diff, trial merge

`git log --oneline origin/Shane..origin/cloud-lane-60` (10 commits, newest first):

```
38ec37c2 N.203 lane 60 step 4: report and pictures (merge of lane 59, the test fry, calibrate-new repaired, gates and suites)
180dc886 N.203 lane 60 step 4: the test fry (Start, TakeLine, a verdict that can say no), one visit across fry and vowels, the pane's finish-early wiring, calibrate-new repaired
460e1222 Merge origin/Shane (lane 59) into cloud-lane-60
898c8891 N.203 lane 60 step 3: the two doors open the built characteristics screen; Done closes the takeover; gates and suites after Step 3
058edb3b N.203 lane 60 step 2: report states which pictures were looked at
51cfefdc N.203 lane 60 step 2: the VOICE pane at rest replaces the anchor (sentences, doors, type control, first-launch form); summary fits the view
2df574a1 N.203 lane 60 step 1: the seam (voices and commands published by the wizard; record, summary, characteristics requests)
64e34d69 N.203 lane 60 step 6: MELODY's empty line takes sheet line 30; Finish closes the takeover
c29d4b87 N.203 lane 60 step 5: the summary becomes Your vowel space (one table, the roster's marks in it, Finish writes nothing)
dae57160 N.203 lane 60 step 0: gates on the untouched tip, seam B holds, counts
```

Order of the commits is the order amendment 1 asks for: Step 0, 5, 6, 1, 2, 3, the merge of `Shane`, Step 4.

Merge base of `Shane` (`bb556024`) and the lane: `3fd9a13f` (lane 59 and lane 56's second follow-up). `Shane` has one commit the lane lacks: `bb556024` "Close of the 2026-11-16 afternoon desk: memory notes" (five files under `docs/memory/` only).

`git diff --stat 3fd9a13f..38ec37c2`: 105 files changed, 1,621 insertions, 868 deletions. 74 of the files are pictures. The other 31:

```
apps/web/e2e/calibrate-new.test.ts (62), singer-paths.test.ts (16), voice-pane.test.ts (+162, new)
lib/components/Drawer/VoiceAnchor.svelte (-136, deleted), voice-anchor-usable.test.ts (-44, deleted)
lib/components/Drawer/VoicePane.svelte (+142, new), voice-pane-usable.test.ts (+26, new), voice-pane.test.ts (+86, new), voice-pane.ts (+79, new)
lib/i18n.ts (53), lib/markup/MarkupPane.svelte (2), lib/voice/CalibrationWizard.svelte (757 changed; 1,726 to 1,314 lines at head)
lib/voice/VowelCapture.svelte (22), lib/voice/chart/SummarySheet.svelte (4), VowelSpaceSheet.svelte (147), VowelSpaceSheet.test.ts (33)
lib/voice/chart/readings.ts (+36), readings.test.ts (26), lib/voice/engine/stub.ts (9)
lib/voice/readiness-view.ts (+55, new), readiness-view.test.ts (+75, new), lib/voice/seam.ts (+59, new), seam.test.ts (+30, new)
routes/+page.svelte (46), docs/sessions/report-code-n203-lane60-step0..step6 (7 files)
```

Not in the diff: `docs/memory/`, any brief, `package.json`, `scripts/ratchets.json`, `TakeLine.svelte`, `visit.ts`, `engine/readiness.ts`, `finish-early.ts`, `Drawer.svelte`, `GuideContent.svelte`.

Trial merge (`git worktree add --detach ../wt-merge origin/cloud-lane-60`; `git merge --no-commit --no-ff origin/Shane`): "Automatic merge went well; stopped before committing as requested". Conflicts: none. Aborted, worktree removed (`git worktree list` shows only the main clone).

## 2. Checklist

Columns: item, where it is built on head (read by me), report claim, the code line (at most two lines). "R" is the lane's report and section. Amendments are the review's section 2 (`docs/sessions/review-fable-lane60-brief-r2_r1_2026-11-16.md`), which the brief's section 9 makes part of the brief; where an amendment replaces a brief line, the amendment is the item.

### Step 0 (read and report, change nothing)

| # | Item | Built or claimed | Evidence |
|---|---|---|---|
| 0.1 | Eight gates with counts | R step0 section 1 (table). Commit `dae57160` changes docs only | quoted in section 7 |
| 0.2 | Every cited line re-read, moved ones named | R step0 section 3 | see section 3 of this packet |
| 0.3 | Line counts against `scripts/ratchets.json` | R step0 section 2 | see section 6 |
| 0.4 | Plan r4 sections 4.1 to 4.8, 7.1 and its two reviews read | R step0 does not say it read them; it says "I did not re-read every line of every file" (section 3, last paragraph). NOT ESTABLISHED that the plan was read | |
| 0.5 | Whether seam B holds | R step0 section 4: "Yes, on this tip, with the review's amendments 3 to 7 applied" | |
| 0.6 | Nothing changed | `git show --stat dae57160` touches one report file only | |

### Step 1 (the seam, as amended by 3 to 7)

| # | Item | Built at | Code |
|---|---|---|---|
| 1.1 | Wizard publishes voices, active id, commands | `lib/voice/seam.ts:28-39`; `lib/voice/CalibrationWizard.svelte:807-819` | `onSeamChange?.({ voices: store.voices.map(...), activeId: store.activeId, nextDefaultName,` / `select: selectVoice, create: ..., duplicate:..., rename:..., remove:..., setOwn });` |
| 1.2 | The voice type and usable count publish | NOT FOUND in the seam. They cross by the built `onActiveProfileChange` (`CalibrationWizard.svelte:158`, `:220`, `:785`, `:791`; amendment 5 says they already cross) | |
| 1.3 | `openRequest` takes three kinds | `seam.ts:14`; answered at `CalibrationWizard.svelte:333-343` | `export type VoiceRequestKind = 'record' \| 'summary' \| 'characteristics';` |
| 1.4 | `record` lands on Welcome when no reading, else capture by `openTour` | `seam.ts:47-49`; `CalibrationWizard.svelte:339-341` | `if (kind === 'record') return hasReadings ? 'capture' : 'welcome';` |
| 1.5 | Refusal only for "Add your range" over the capture screen (amendment 4) | `seam.ts:57-59`; `CalibrationWizard.svelte:338` | `return phase === 'capture' && !req.fromRest;` |
| 1.6 | Request carries `{ phase, n, fromRest }`, `fromRest` from `!calibrating` | `seam.ts:16-22`; `routes/+page.svelte:1670` | `calibrationRequest = { phase: kind, n: (calibrationRequest?.n ?? 0) + 1, fromRest: !calibrating };` |
| 1.7 | No take-running flag (amendment 3) | No flag in `seam.ts`; `disabled={phase === 'capture'}` absent from `CalibrationWizard.svelte` (grep, no match) | |
| 1.8 | No visibility prop added in Step 1 (amendment 4) | `takeoverVisible` at `CalibrationWizard.svelte:210`, `:225` arrived with the merge `460e1222` | |
| 1.9 | No new close callback; Finish uses `onComplete` (amendment 1) | `routes/+page.svelte:3900`; `CalibrationWizard.svelte:761-763` | `onComplete={exitCalibration}` / `onComplete?.(profile);` |
| 1.10 | `openVoice(kind)` grows from `openRangeFields`; `voiceSeam` in one `$state.raw` | `routes/+page.svelte:1659`, `:1664-1672` | `let voiceSeam = $state.raw<VoiceSeam \| undefined>(undefined);` |
| 1.11 | `voiceCalibrated` removed | `routes/+page.svelte:1637-1638` (comment: "`voiceCalibrated` is gone with the voice anchor"); `grep voiceCalibrated` finds only that comment | |
| 1.12 | Names `record`, `summary`, `characteristics`, not `sing` (amendment 6) | `seam.ts:13-14` | |
| 1.13 | No voice saved: pane shows first-launch form; `openVoice` only reveals the band (amendment 7) | `VoicePane.svelte:43-56`; `routes/+page.svelte:1666-1669` | `if (!voiceSeam?.voices.length) { sections.reveal(BAND_IDS.scoreMarkup); return; }` |
| 1.14 | "Add your range" calls `openVoice('characteristics')` | `routes/+page.svelte:4358` | `onaddrange={() => openVoice('characteristics')}` |
| 1.15 | Tests: seam rules | `lib/voice/seam.test.ts:4-24`, 5 tests (R step1 section 2: "5 passed (5)") | |
| 1.16 | Tests: write from pane changes store and page; request from rest on stowed capture lands | not unit tests (R step1 section 2 says no DOM test env). Built as `e2e/voice-pane.test.ts:52` (switcher) and `:76` (request from rest) | R step1 admits "the wiring is untested end to end" until Step 2 |

### Step 2 (the VOICE pane at rest, amendments 8 to 11)

| # | Item | Built at | Code |
|---|---|---|---|
| 2.1 | New component replaces `VoiceAnchor` at the page mount | `lib/components/Drawer/VoicePane.svelte`; mounted `routes/+page.svelte:4179-4180`; `VoiceAnchor.svelte` absent on head | `<VoicePane {language} seam={voiceSeam} voiceType={voiceTypeChoice} usable={usableReadingCount(voiceFormants)}` |
| 2.2 | Voice line: name with built `ProfileSwitcher` moved here | `VoicePane.svelte:45-55`; wizard mount gone (no `<ProfileSwitcher` in `CalibrationWizard.svelte`) | |
| 2.3 | Voice type beside it, or "Choose a voice type", opens the built `VoiceTypeIntake` | `VoicePane.svelte:57-62` | `{typeLabel ?? T('calib.pane.chooseType')}` |
| 2.4 | Inert only while a take runs | Dropped by amendment 3; no `disabled` on the switcher | |
| 2.5 | Seven sentence states, by `usableReadingCount` | `components/Drawer/voice-pane.ts:26-34`, `:45-58`; `VoicePane.svelte:39`, `:63` | `if (i.usable >= 10) return 'all';` / `if (i.usable >= 1) return i.restWorkedOut ? 'some-works-out' : 'some-fills';` |
| 2.6 | `paneSentence({ usable, voiceType, restWorkedOut })`, pure (amendment 8) | `voice-pane.ts:14-24`, `:45` | |
| 2.7 | `restWorkedOut` passed `false` until the merge, then lane 59's function | `routes/+page.svelte:4180`; `lib/voice/chart/finish-early.ts:33` (not written by this lane) | `restWorkedOut={finishEarlyState(voiceFormants, voiceTypeChoice?.voiceType).kind === 'work-out'}` |
| 2.8 | Door to recording named by usable count (amendment 9) | `voice-pane.ts:61-63`; `VoicePane.svelte:65` | `return usable >= 10 ? 'calib.pane.door.again' : usable >= 1 ? 'calib.pane.door.carryOn' : 'calib.pane.door.record';` |
| 2.9 | "Your vowel space" door rule | `voice-pane.ts:70-72`; `VoicePane.svelte:66-68` | `return hasStoredReading \|\| hasPlaceholderProfile(voiceType);` |
| 2.10 | "Describe your voice" and "What INSIGHTS shares, and how" doors | `VoicePane.svelte:69-70` (both call `onopen('characteristics')`) | |
| 2.11 | Every door quiet; one filled control is the first-launch Start | `VoicePane.svelte:64-71` uses class `vp-door`; first-launch form is `ProfileSwitcher.svelte:235` (`ps ps-first`). Fill style of `.vp-door` not read by me | |
| 2.12 | "Not sure" printed by its own name (amendment 10) | `voice-pane.ts:75-79` | `choice?.voiceType === 'not-sure' ? t('voiceType.type.not-sure', language)` |
| 2.13 | With no voice saved, form only | `VoicePane.svelte:43-56` (`{#if seam.voices.length}` wraps all else) | |
| 2.14 | Inside the takeover the name is a plain label at each screen's head | `CalibrationWizard.svelte:859`, except the summary (R step2 section 1 says so) | `{#if activeVoice && phase !== 'summary'}<p class="wizard-voice-name">` |
| 2.15 | Notices stay (D15); behind the wall the pane shows nothing | Notices not diffed by me; VoicePane sits after the `{#if INCLUDE_MARKUP_INSIGHTS}` at `routes/+page.svelte:4124`. I did not trace the matching `{/if}`. NOT ESTABLISHED that the mount is inside the wall | |
| 2.16 | Tests: seven states, implausible-only profile, type control writes same value as Welcome, switcher, rewrite of the anchor test | `voice-pane.test.ts:9-80`; implausible fixture `:44-53`; same-store `:77`; `voice-pane-usable.test.ts:10-26`; switcher e2e `e2e/voice-pane.test.ts:52` | |
| 2.17 | `singer-paths` Calibrate and MELODY pins rewritten (amendment 11) | `e2e/singer-paths.test.ts:99`, `:102`, `:197` (MELODY line), `:204` (`name: 'Calibrate'` `toHaveCount(0)`) | |
| 2.18 | `calibrate-new` entry helpers `open` and `toCapture` | `e2e/calibrate-new.test.ts:13`, `:29-35` | `await page.getByRole('button', { name: /^record your vowels$/i }).click();` |

### Step 3 (the two doors open the built screen, amendment 23)

| # | Item | Built at | Code |
|---|---|---|---|
| 3.1 | Doors open "Voice characteristics" in the takeover by `openRequest`, no microphone | `VoicePane.svelte:69-70`; `seam.ts:47-50` (`characteristics` lands as asked); wizard phase `CalibrationWizard.svelte:949` | |
| 3.2 | Done calls the close, not `phase = 'summary'` | `CalibrationWizard.svelte:1031-1032` | `<button type="button" class="wizard-primary" onclick={finish}>` / `{T('calib.characteristics.doneButton')}` |
| 3.3 | "Add your range" still opens it | `routes/+page.svelte:4358` | |
| 3.4 | Tests, one per door | `e2e/voice-pane.test.ts:94` (loop over two labels) | |
| 3.5 | A stale comment remains | `CalibrationWizard.svelte:956-962` still says "Done returns to the summary." (fact, not judged) | |

### Step 4 (the test fry; amendments 12 to 18)

| # | Item | Built at | Code |
|---|---|---|---|
| 4.1 | Before: line 9 and Start; nothing listens until Start | `CalibrationWizard.svelte:885-888`; `startFry` `:679-694` | `<p class="wizard-lede">{T('calib.readiness.intro')}</p>` / `onclick={startFry}>{T('calib.readiness.start')}` |
| 4.2 | Run: `TakeLine`, Quiet, Breathe, Fry, weights 1, 2, 3 | `CalibrationWizard.svelte:544-548`, `:891` | `{ id: 'quiet', label: T('calib.readiness.partQuiet'), weight: 1 },` |
| 4.3 | Quiet holds until `onQuiet`; Breathe `READINESS_PREP_MS`; Fry `READINESS_CAPTURE_MS`; constants unchanged | `:687-690`; `engine/readiness.ts:133-134` untouched | `ramp(READINESS_PREP_MS, () => { readinessStep = 'fry'; ramp(READINESS_CAPTURE_MS); });` |
| 4.4 | Cues (line 12); spoken count gone | `CalibrationWizard.svelte:549` | `const fryCue = $derived(readinessStep === 'quiet' ? T('calib.readiness.quiet') : ... T('capture.cue.breathe') : T('calib.readiness.captureLede'));` |
| 4.5 | `TakeLine` imported, not edited | `CalibrationWizard.svelte:53`; `TakeLine.svelte` not in the diff | |
| 4.6 | Verdict: heard AND accepted | `lib/voice/readiness-view.ts:32` | `export const fryAccepted = (r: ReadinessResult): boolean => r.fryHeard === true && r.fryAccepted === true;` |
| 4.7 | `null` from `fryHeard` is not acceptance | same line (`=== true`); test `readiness-view.test.ts:62` | |
| 4.8 | Four outcomes in `voice/readiness-view.ts` (amendments 13, 16) | `readiness-view.ts:22-25`, `:35-55`; wizard use `CalibrationWizard.svelte:669-677` | `if (error.code === 'CANCELLED') return undefined;` |
| 4.9 | Refusal: Try again quiet and first, Continue filled and last | `CalibrationWizard.svelte:896-900` | `class="wizard-secondary" onclick={startFry}>{T('calib.roster.tryAgain')}` / `class="wizard-primary" onclick={beginCapture}>{T('calib.common.continue')}` |
| 4.10 | On refusal: no room toast, no marginal line; record keeps room, `fryRateHz: null`, `fryRange: 'not-measured'` | `readiness-view.ts:50-54`; wizard sets `readinessResult` only on accept `:676` | `record: { ... fryRateHz: null, fryRange: 'not-measured' }` |
| 4.11 | No-microphone path stays | `CalibrationWizard.svelte:892-895`; `readiness-view.ts:27`, `:39` | `T('calib.readiness.noMic')` |
| 4.12 | One visit across fry and vowels; predicate widened | `CalibrationWizard.svelte:574-579`; `VowelCapture.svelte:60-61`, `:84-89`, `:138`, `:144`, `:191` | `wanted: () => takeoverVisible && ((phase === 'readiness' && readinessStep !== 'before') \|\| phase === 'capture')` |
| 4.13 | `visit.resume()` in the Start tap | `CalibrationWizard.svelte:685` | |
| 4.14 | Leaving, hiding, or changing voice ends the run and returns to "before" | `CalibrationWizard.svelte:557-569`; `resetFlow` cancels `:458` | `$effect(() => { if (!takeoverVisible) untrack(fryToBefore); });` |
| 4.15 | `calib.readiness.guidance` UNUSED | `i18n.ts:1315` (see section 4) | |
| 4.16 | Fixtures: silence, white-noise bursts, bursts low-passed at 300 Hz, clicks 40 Hz low-passed 800 Hz, `synthFry` | `readiness-view.test.ts:32-47`; failed conditions table in R step4 section 3 (I did not re-run it) | |
| 4.17 | Stub outcome `no-fry` (amendment 16) | `engine/stub.ts:51`, `:81-82`, `:100-101` | `fryAccepted: outcome !== 'no-fry',` |
| 4.18 | Key map (amendment 18) | section 4 of this packet | |
| 4.19 | Debug line explained (amendment 17) | `engine/live.ts:175` (`const DEBUG = true;`), `:177`, `:623`, `:637`; R step4 section 8 | |
| 4.20 | Dann rustling on his iPhone (amendment 17) | NOT DONE; R step4 section 8: "Dann rustling on purpose on his iPhone is still the test" | |
| 4.21 | e2e repairs after the merge (amendment 2) | `e2e/calibrate-new.test.ts` at head: no "Re-calibrate", no "Calibrate" click, no "vowels sampled" remain (grep); three "Re-take" clicks remain at `:228`, `:250`, `:259`, commented as the note's Re-take | |
| 4.22 | Edits to files the brief gives lane 59 | `VowelCapture.svelte` (+17/-5 by `git diff --stat`; adds `visit` and `onVisitHooks` props) and `engine/stub.ts` (`no-fry`). The `stub.ts` edit is authorised by amendment 16. I found no amendment or brief line that authorises the `VowelCapture.svelte` edit (brief section 4 "Leaves: the screen with the ten vowels ... (lane 59)"). R step4 section 2 discloses it ("lane 59's file, edited here"). Authorisation not found | |

### Step 5 (the summary becomes "Your vowel space", amendments 19 to 22)

| # | Item | Built at | Code |
|---|---|---|---|
| 5.1 | Note on readings outside Ilya's values (`OutsideNote`) first | `CalibrationWizard.svelte:933` | `{#if outside.length}<OutsideNote vowels={outside} ... />{/if}` |
| 5.2 | Sheet title, subtitle, voice name | `VowelSpaceSheet.svelte:64-66`; `SummarySheet.svelte:14` | |
| 5.3 | The whole chart | `VowelSpaceSheet.svelte` (chart block not individually read) | |
| 5.4 | One table, ten rows, mark, symbol, name, fR1, fR2 with notes | `VowelSpaceSheet.svelte:99-110` (`<table class="readings">`, `<tr class:placed={r.kind === 'placed'} data-row={r.vowel}>`) | |
| 5.5 | Filled mark for recorded; hollow for not recorded with accessible name `capture.button.placed` | `VowelSpaceSheet.svelte:115` | `<svg class="row-mark" ... role="img" aria-label={t('capture.button.placed', language)}>` |
| 5.6 | Roster marks in the table: Provisional, Beyond, Noise floor, Try again | `VowelSpaceSheet.svelte:123-125`, `:132`; data `lib/voice/chart/readings.ts:103-137` (`summaryRows`) | `{#if r.marks.provisional}<span class="row-mark-word is-provisional">...` |
| 5.7 | ⓘ beside [o], not on paper | `VowelSpaceSheet.svelte:119-121`; prop chain `SummarySheet.svelte:11`, `:14`, `CalibrationWizard.svelte:934` | `{#if onLearnNote && !forPrint && r.vowel === 'o'}` |
| 5.8 | `readingListRows` unchanged (lane 59's list) | `readings.ts:118-137` wraps it; `readings.test.ts:124` pins | |
| 5.9 | Legend below the table (amendment 19) | table `:99`, legend `:141` | |
| 5.10 | Footnote on sources, Print | `VowelSpaceSheet.svelte:166` (`{#if onprint && !forPrint}`); sources block not individually read | |
| 5.11 | Back to the ten vowels | `CalibrationWizard.svelte:936`, `backToTen` `:746-750` | `<button type="button" class="wizard-secondary" onclick={backToTen}>{T('calib.summary.backToTen')}</button>` |
| 5.12 | Finish filled and leads; Back and Start over quiet; Start over only when stored (amendment 20) | `CalibrationWizard.svelte:935-946` | `...wizard-primary" onclick={finish}>{T('calib.summary.finishButton')}` / `{:else if hasAnyReadings(profile)}` |
| 5.13 | Finish writes nothing | `CalibrationWizard.svelte:761-763`: calls `onComplete?.(profile)` only | |
| 5.14 | `backToTen` follows the `record` rule (amendment 20) | Built as its own function, not through a `record` request: `hasAnyReadings` then `openTour`, else Welcome. Same landing as `seam.ts:47-49`; R step5 says "Step 1 will route this through the `record` request" and R step1 does not say it did. Not routed | `if (!hasAnyReadings(profile)) { phase = 'welcome'; return; }` |
| 5.15 | Gone: "Profile summary" title and ledes, roster and Re-take buttons, Continue, invitation, characteristics buttons | none of `challengingInvite`, `characteristicsButton`, `capturedCount`, `continueTour` found in `CalibrationWizard.svelte` (grep) | |
| 5.16 | Note's own Re-take walks its vowels | `retakeFromSummary` `CalibrationWizard.svelte:752-758`; call `:933` | |
| 5.17 | Done when: chart and ten rows in one view at 390 by 844 and desk 900 | R step5 section 8 and R step2 section 3: English 18 px to spare, French 39 px, desk 5 px; with three marks over by 65 (en) and 43 (fr) phone, 45 desk. I measured nothing | |
| 5.18 | Print holds one page | R step5 section 3 (Chromium print emulation, PDF page count). Not re-run | |
| 5.19 | New keys outside `capture.` and `sheet.` (amendment 22) | the one new Step 5 key is `calib.summary.backToTen` | |
| 5.20 | Pins updated (amendment 22) | `VowelSpaceSheet.test.ts:29`; `readings.test.ts:124` | |

### Step 6 (Finish, MELODY's line)

| # | Item | Built at | Code |
|---|---|---|---|
| 6.1 | Finish closes the takeover to the Drawer at rest | `routes/+page.svelte:3900`; `CalibrationWizard.svelte:761`; browser test `e2e/voice-pane.test.ts:76` | |
| 6.2 | MELODY's empty state takes sheet line 30 | `i18n.ts:1493` (`profile.emptyState`) | `'profile.emptyState': { en: 'Open VOICE and record your vowels, or choose a voice type to start from generic values.', ...` |
| 6.3 | Pins of the old line rewritten | `e2e/singer-paths.test.ts:99`, `:102`, `:197`; comment `MarkupPane.svelte:22` | |

### Step 7 (words)

| # | Item | Built at | Evidence |
|---|---|---|---|
| 7.1 | Lines 1 to 14, 25, 26, 30 character for character | section 4 | all SAME but one apostrophe, noted there |
| 7.2 | OQLF sweep | `lib/i18n.test.ts:155` ("every French value in i18n.ts follows the table"); R step4 section 2 says it passes. I did not run vitest | |
| 7.3 | Key index moved at the head of `i18n.ts` and in `i18n-index.test.ts` | header `i18n.ts:19` (1,328), `:30` (`calib. 120`); `i18n-index.test.ts` unchanged, it compares the header with `stringKeys()` and holds no literal count | |
| 7.4 | Retired keys marked UNUSED and kept; pinning tests listed before change | 17 UNUSED (section 4); R step2 section 2 and R step5 section 2 list pinning tests ("none outside `i18n.ts`"); R step4 section 2 "its pinning tests: none" | |
| 7.5 | Lines 15 to 24, 26b, 27 to 29 not written | none of the keys `capture.*` or `sheet.*` is in the lane's added or changed list (section 4) | |

### Amendments 1 to 25

| Amd | Subject | Status and evidence |
|---|---|---|
| 1 | Step order; Finish by built `onComplete` | Commit order in section 1. `routes/+page.svelte:3900`; `seam.ts` has no close callback |
| 2 | Cut, merge, e2e ownership | Merge commit `460e1222`. Before it, `calibrate-new.test.ts` changed only at `toCapture` (`git diff 16922501 898c8891` shows 2 lines). After it, sites repaired (4.21). Whether lanes 56, 57, 58 had merged at the cut: R step0 says cut at `16922501` "(lane 57) merged"; lane 58 NOT ESTABLISHED |
| 3 | No take-running flag | 1.7 |
| 4 | `{ phase, n, fromRest }`; refuse only over capture from INSIGHTS | 1.5, 1.6, 1.8 |
| 5 | One published object | 1.1, 1.10, 1.11; page counts per step in R step1 (5,524), step2 (5,520); head 5,523 |
| 6 | Kind names; `record` rule | 1.12, 1.4 |
| 7 | No voice: form only | 1.13 |
| 8 | `paneSentence` pure; `restWorkedOut` | 2.6, 2.7 |
| 9 | Door names; vowel-space rule | 2.8, 2.9 |
| 10 | "Not sure" label | 2.12 |
| 11 | Pins removed and rewritten | `voice-anchor-usable.test.ts` absent on head; 2.17 |
| 12 | "Never consulted" corrected; heard AND accepted | rule `readiness-view.ts:6-8`, `:32`; amendment is brief text |
| 13 | Four outcomes in `voice/readiness-view.ts` | 4.8 to 4.11 |
| 14 | Weights, Quiet holds, constants unchanged, keys reused, only "Quiet" new | 4.2, 4.3, 4.5; `capture.part.breathe`, `capture.part.fry`, `capture.cue.breathe` exist (`i18n.ts:2556`, `:2559`, `:2560`); new key `calib.readiness.partQuiet` |
| 15 | Start is the gesture; leaving cancels | 4.13, 4.14 |
| 16 | Fixtures; stub `no-fry` | 4.16, 4.17 |
| 17 | Dann rustles; debug line | 4.19 (explained), 4.20 (not done) |
| 18 | Key map | section 4 |
| 19 | Legend below table; `readingListRows` unchanged; hollow mark name; no new French; ⓘ prop | 5.5 to 5.9 |
| 20 | Finish and button order; Finish writes nothing; Start over only when stored | 5.12 to 5.14 (5.14 is not routed through a `record` request) |
| 21 | One-view heights; print page | 5.17, 5.18 (reported, not re-measured by me) |
| 22 | Keys outside `capture.`/`sheet.`; pins; recount after merge | 5.19, 5.20; recount in section 5 |
| 23 | Done calls the close | 3.2 |
| 24 | Pictures: French phone test fry at Breathe; pane sentence in each state at 390 px French | `step4-fry-phone-fr-breathe.png` exists; eight `step2-pane-phone-fr-*` files exist (section 8) |
| 25 | GUIDE note for the desk, no change | `GuideContent.svelte` not in the diff. Nothing built, by design |

## 3. Cited `file:line` in the reports, against head

The reports cite 75 lines in Step 0 (read on the untouched tip `16922501`, before the lane changed the wizard from 1,726 to 1,314 lines), 9 in Step 2, 20 in Step 3, 2 in Step 4, 14 in Step 5, 7 in Step 6, none in Step 1. I checked each by the symbol or text the report names, on head, with a script that looks for the pattern at the cited line or range (`/home/claude/scout60/tmp/cites.sh`). MOVED means the symbol is on head at another line (given). WRONG means the symbol is not on head, which for most of Step 0's wizard lines is because the lane removed it by design.

MATCHES:
`engine/readiness.ts:108`, `:133-134`; `engine/stand-ins.ts:84`; `components/Drawer/bandState.ts:245`; `bandState.test.ts:211`; `CalibrationWizard.svelte:454` (`resetFlow`), `:321-332` (`answeredRequest` at `:331`); `routes/+page.svelte:1637`, `:1647-1649`, `:1656-1661`, `:3878-3908` (wizard mount at `:3896`); `Drawer.svelte:448`; `profileStore.ts:196`; `MarkupPane.svelte:22`; `VowelSpaceSheet.test.ts:29`; `readings.test.ts:124-126`; `e2e/singer-paths.test.ts:99`, `:102`, `:197`, `:204`; `e2e/calibrate-new.test.ts:29-34` (helper starts at `:29`, now spans to `:35` because Step 4 added the Start click); `e2e/loupe-header.test.ts:47`.

MOVED (new line on head):
- `engine/stub.ts:99` (`fryAccepted`) to `:100`.
- `VowelCapture.svelte:88` (`sungSet`) to `:107` (first of several).
- `CalibrationWizard.svelte`: `:237` (`store`) to `:245`; `:202` (`openRequest`) to `:206`; `:330` (refusal) to `:338`; `:836-850` (`onActiveProfileChange`) to `:785`, `:791`; `:1141-1195` (summary) to `:930`; `:1196-1282` (characteristics) to `:949`; `:777-783` (`retakeFromSummary`) to `:752`; `:785-789` (`finish`) to `:761`; `:213` (`onComplete`) to `:145` and `:219` area; `:419-422` (`setOwn`) to `:423`; `:243-248` (`nextDefaultName`) to `:251`; `:485` (`hasAnyReadings` then summary) to `:481`, `:497`, `:518`; `:501`, `:522` (`resetFlow` calls) to `:481`, `:497`, `:518`; `:916-1002` (roster) the word "roster" survives only in comments, at `:931`.
- `routes/+page.svelte:1644` (`enterCalibration`) to `:1645`; `:4163-4167` (`<VoiceAnchor>`) to `:4179` (`<VoicePane>`); `:3887` (`onComplete`, cited by R step5 and R step6) to `:3900`.
- `Drawer.svelte:845-846` (`voiceTakeover`) to `:847`; `:1497` (`.stowed`) to `:1499`.
- `i18n.ts`: `:1448` (`profile.emptyState`) to `:1493`; `:1288` (`calib.readiness.quiet`) to `:1301`; `:1289` to `:1303`; `:1290` to `:1305`; `:1293` to `:1310`; `:1296` to `:1313`; `:1297` to `:1315`.
- `VowelSpaceSheet.svelte:94-115` (legend) to `:141`; `:118` (table) to `:99` (the legend and table swapped order by design).

WRONG on head (symbol gone):
- `CalibrationWizard.svelte:1032-1043`, `:1035` (`ProfileSwitcher` mount with `disabled={phase === 'capture'}`): moved out by design (Step 2).
- `CalibrationWizard.svelte:894-903` (`challengingInvite`), `:910-914` (characteristics buttons), `:771-774` (`continueTour`), `:336` (`capturedCount`): removed by design (Step 5).
- `components/Drawer/voice-anchor-usable.test.ts:17-21`, `:27-28` (R step2): file deleted by design.
- Step 3 and Step 5 bare citations into `e2e/calibrate-new.test.ts` (`:71`, `:110`, `:145`, `:146`, `:161`, `:167`, `:168`, `:170`, `:175`, `:176`, `:177`, `:186`, `:187`, `:330`, `:331`, `:379`, `:392`, `:395`, `:396`, `:32`): these are line numbers of the file before the merge of `Shane`; R step4 section 4 says the file's lines moved when lane 59 merged and the sites were found by content. I cannot map them by number; the sites no longer hold the old text (4.21). Marked WRONG by line number, repaired by content.
- `CalibrationWizard.svelte:1141-1195` `phase === 'summary'` I list as MOVED, because the phase exists at `:930`.

R step4 cites `live.ts` and `detector.ts` by name only, without line numbers, except the debug line text; I found `live.ts:175`, `:177`, `:623`, `:637` for it.

## 4. Words

Method: loaded head's `i18n.ts` and the merge base's with `node --experimental-strip-types` and compared `t(key, lang)` with the sheet strings (`sheet-english_r2`, `sheet-french_r1`, with the 01:28, 01:35, and 02:07 amendments for lines 5, 5b, and the one-left forms). Script: `/home/claude/scout60/tmp/words.mjs`.

Keys the lane added (20) and changed (4 keys, 8 strings), `3fd9a13f` to head. No key removed. Compared character for character:

| Key | Sheet line | EN | FR |
|---|---|---|---|
| `calib.pane.none` | 1 | SAME | SAME |
| `calib.pane.typedGeneric` | 2 (`{type}` on the English sheet, `{voiceType}` in code and on the French sheet) | SAME | SAME |
| `calib.pane.typedNone` | 3 | SAME | SAME |
| `calib.pane.notSure` | 4 | SAME | SAME |
| `calib.pane.fills` | 5 as amended 02:07 | SAME | SAME |
| `calib.pane.fillsOne` | 5, one left, 02:07 | SAME | SAME |
| `calib.pane.worksOut` | 5b as amended 01:28 | SAME | SAME |
| `calib.pane.worksOutOne` | 5b, one left, 01:35 | SAME | SAME |
| `calib.pane.all` | 6 | SAME | SAME |
| `calib.pane.door.record` | 7 | SAME | SAME |
| `calib.pane.door.carryOn` | 7 | SAME | SAME |
| `calib.pane.door.again` | 7 | SAME | SAME |
| `calib.pane.door.space` | 7 | SAME | SAME |
| `calib.pane.door.describe` | 8 | SAME | SAME |
| `calib.pane.door.insights` | 8 | SAME | SAME |
| `calib.pane.chooseType` | 7 | SAME | SAME |
| `calib.summary.backToTen` | 25 | SAME | SAME |
| `calib.readiness.intro` (new) | 9 | SAME | SAME |
| `calib.readiness.start` (new) | 10 | SAME | SAME |
| `calib.readiness.partQuiet` (new) | 11, "Quiet" | SAME | SAME |
| `calib.readiness.quiet` (changed) | 12, first | SAME | SAME |
| `calib.readiness.captureLede` (changed) | 12, third | SAME | SAME |
| `calib.readiness.noFry` (changed) | 13 (French has no-break space before the colon, as the sheet) | SAME | SAME |
| `profile.emptyState` (changed) | 30 | SAME | SAME |

Built keys the lane reads for sheet lines 11, 12, 14, 26 (not added or changed by the lane):

| Key | Sheet line | EN | FR |
|---|---|---|---|
| `calib.roster.tryAgain` | 14 | SAME | SAME |
| `calib.common.continue` | 14 | SAME | SAME |
| `capture.part.breathe` | 11 | SAME | SAME |
| `capture.part.fry` | 11 | SAME | SAME |
| `capture.cue.breathe` | 12, second | SAME | SAME |
| `calib.roster.reading.provisional` | 26 | SAME | no French on the sheet; code has « Provisoire » |
| `calib.roster.kept` | 26 | DIFFERENT, apostrophe only: code `Beyond Ilya’s reference values` (U+2019), sheet `Beyond Ilya's reference values` (U+0027) | no French on the sheet; code has « Au-delà des valeurs de référence d’Ilya » |
| `calib.roster.noiseFloorLabel` | 26 | SAME | no French on the sheet; code has « Bruit de fond : non mesuré » |
| `capture.button.placed` | 26 | SAME | no French on the sheet; code has « valeur par défaut » |

`calib.roster.kept` is not among the keys the lane changed (it is absent from the changed list), so the difference predates the lane.

UNUSED keys the lane marked (17), each with an `// UNUSED SINCE N.203 lane 60 Step N` comment above it, each with its text kept. A grep of `apps/web/src` and `apps/web/e2e` for each key outside `i18n.ts` finds no reader and no test naming it (template-string readers `readiness.count${`, `anchor.${`, `summary.${`: none):

- Step 2, `i18n.ts:1219`, `:1222`, `:1224`: `calib.anchor.uncalibrated`, `calib.anchor.calibrate`, `calib.anchor.recalibrate`.
- Step 4, `:1303`, `:1305`, `:1307`, `:1309`, `:1315`: `calib.readiness.prepareLede`, `.countThree`, `.countTwo`, `.countOne`, `.guidance`.
- Step 5, `:1274`, `:1276`, `:1282`, `:1284`, `:1286`, `:1288`, `:1414`, `:1416`, `:1418`: `calib.roster.reading.estimated`, `calib.roster.actionsHeader`, `calib.challengingInvite.button`, `.caption`, `calib.characteristics.editButton`, `.addButton`, `calib.summary.title`, `.savedLede`, `.progressLedeSuffix`.

The brief's list of leaving keys (Step 7) is 13 keys, all marked: 3 anchor keys, 3 summary keys, 2 invitation keys, 2 characteristics-button keys, `calib.roster.actionsHeader`, `calib.roster.reading.estimated`, `calib.readiness.guidance`. Amendment 18 adds four (`prepareLede`, `countThree`, `countTwo`, `countOne`). 13 + 4 = 17, and all 17 are marked.

Review amendment 18 says `countTwo` and `countOne` are read by `capture-ritual.svelte.ts:173` on the merged tip. At head a grep finds no reader of either key outside `i18n.ts`; I did not open `capture-ritual.svelte.ts`. R step4 section 2 says "a grep found no reader outside the wizard's removed count".

## 5. Counts

Counted with `stringKeys().length` through `node --experimental-strip-types` on three versions of `i18n.ts`:

| Version | Keys |
|---|---|
| `3fd9a13f` (merge base) | 1,308 |
| `origin/Shane` `bb556024` | 1,308 |
| head `38ec37c2` | 1,328 |

- Header at head: `i18n.ts:19` "This file holds 1,328 keys." Prefix lines `:30` `calib. 120`, `:31` `capture. 55`. I counted by prefix: `calib` 120, `capture` 55, `sheet` 16, `profile` 35. They agree with the header.
- `i18n-index.test.ts` pins no literal number. It reads the header and the prefix lines and compares them with `stringKeys()` (`i18n-index.test.ts:44-56`). The test file is not in the lane's diff.
- The lane wrote 1,325 in its Step 4 report at the merge; that was 1,308 plus 17. It then added three Step 4 keys, so 1,328 is the total on head.
- The desk's 1,323 comes from the Fable review of lane 59 as built (`docs/sessions/review-fable-lane59-as-built_r1_2026-11-16.md:68`): "Lane 60 adds 17 keys and removes 2 ... With all three merged the count is 1,323". 1,308 + 17 - 2 = 1,323.
- The difference of 2 is the "removes 2". The lane removed no key (key-set diff against the merge base: `removed 0`). It marked 17 as UNUSED and kept them (the practice the file's header describes for retired strings). Which two keys the desk meant to remove: NOT ESTABLISHED. That review line does not name them.
- Keys by name, the 17 added before the merge (Steps 2 and 5): the sixteen `calib.pane.*` keys (`none`, `typedGeneric`, `typedNone`, `notSure`, `fills`, `fillsOne`, `worksOut`, `worksOutOne`, `all`, `door.record`, `door.carryOn`, `door.again`, `door.space`, `door.describe`, `door.insights`, `chooseType`) and `calib.summary.backToTen`. The 3 added in Step 4: `calib.readiness.intro`, `.start`, `.partQuiet`.

## 6. Line ceilings (`scripts/ratchets.json`)

| File | Lines at head | Ceiling | Free | Lane raised it? |
|---|---|---|---|---|
| `routes/+page.svelte` | 5,523 | 5,534 | 11 | No |
| `lib/voice/CalibrationWizard.svelte` | 1,314 | 1,727 | 413 | No |
| `lib/markup/MarkupPane.svelte` | 1,351 | 1,353 | 2 | No (the lane changed one comment line; the file is under the ceiling) |
| `lib/components/Drawer/Drawer.svelte` | 1,983 | 1,990 | 7 | Not changed by the lane |

`git show --stat <commit> -- scripts/ratchets.json` is empty for all nine lane commits, and `git diff --name-only 3fd9a13f..38ec37c2 -- scripts` is empty. No ceiling was raised or lowered by the lane.

`node scripts/ratchets.mjs` on head prints `ratchets: OK.` and says these could fall: `MarkupPane.svelte` 1353 to 1351, `pipeline.ts` 901 to 896, `ScoreUploader.svelte` 867 to 865, `pairings.ts` 1422 to 1421, `CalibrationWizard.svelte` 1727 to 1314, `routes/+page.svelte` 5534 to 5523, `musicxml-parser.ts` 1167 to 1166.

Files the lane added or changed that have no ceiling (new-file limit 1,000): `VowelSpaceSheet.svelte` 494, `VowelCapture.svelte` 811, `VoicePane.svelte` 142, `voice-pane.ts` 79, `seam.ts` 59, `readiness-view.ts` 55, `readings.ts` 137, `stub.ts` 214, `e2e/calibrate-new.test.ts` 489, `e2e/voice-pane.test.ts` 162. `i18n.ts` (2,699 lines) is exempt.

## 7. Gates, as the lane's final report gives them

Source: `docs/sessions/report-code-n203-lane60-step4_r1_2026-11-16.md`, sections 5 and 6, on code commit `180dc886` (the report commit `38ec37c2` adds only the report and pictures). I did not run any gate.

Section 5, "Gates, once, on `180dc886`", baseline column is `Shane` `3fd9a13f`:

```
phonology     462            -> 462 passed (462)
dictionary    248            -> 248 passed (248)
svelte-check  0 errors, 12 warnings, 5 files -> 0 errors and 12 warnings in 5 files
web unit      6445 passed, 1 skipped (6446) -> 6481 passed, 1 skipped (6482); +36, "no failure in this run"
score-parser  904 passed, 5 skipped (909) -> 904 passed, 5 skipped (909)
blurb         178            -> 178 passed (178)
integration   159            -> 159 passed (159)
ratchets      OK             -> OK
```

Section 6, Playwright: "`pnpm exec playwright test --project=chromium` (the whole desk project, one worker, `--trace off` ...): **259 passed, 1 failed, 1 skipped, 51.2 minutes.** ... Per file: **`calibrate-new` 37 passed (none failed), `singer-paths` 7, `voice-pane` 12, `insights-no-score` 6.**" The one failure is `e2e/loupe-header.test.ts:47` (expected -40, received -30); the report says it fails the same way on `origin/Shane` `3fd9a13f`. The skipped test is not named.

Earlier report (Step 3, gates after Step 3, before the merge): gate 4 "6337 passed | 1 failed | 1 skipped (6339)", the failure `open-extract.test.ts > the open picker is agnostic > gives the same reading whichever vowel is asked` at a 5 s timeout; `singer-paths` 7 passed; `voice-pane` 8 passed; `calibrate-new` "11 passed, 15 failed". Step 0 (untouched tip): gate 4 "6312 passed | 1 failed | 1 skipped (6314)", the same timeout.

Counts I can check without running: `e2e/voice-pane.test.ts` holds 12 tests (the `test(` lines at `:28`, `:40`, `:52`, `:61`, `:69`, `:76`, `:94` run twice by a loop, `:110`, `:122`, `:135`, `:148`), which agrees with "voice-pane 12". `calibrate-new` and the others I did not count.

## 8. Pictures (not judged)

`docs/sessions/report-code-n203-lane60-pictures/`, 74 files, all `.png`:

- Step 2, 32 files: `step2-pane-{desk,phone}-{en,fr}-{first-launch,none,typed-generic,typed-none,not-sure,three,nine,ten}.png`.
- Step 4, 20 files: `step4-fry-{desk,phone}-{en,fr}-{before,quiet,breathe,fry,refused}.png`.
- Step 5, 16 files: `step5-{desk,phone}-{en,fr}-{one,nine,ten,marked}.png`; plus 2: `step5-print-en-10-1.png`, `step5-print-fr-10-1.png`.
- Step 6, 4 files: `step6-melody-{desk,phone}-{en,fr}.png`.

Facts about the set that I read, not judged: there is no picture for the pane's "works out" sentence state; the Step 2 pane pictures predate the Step 4 wiring of `restWorkedOut` (Step 2 commit `51cfefdc`; Step 4 commit `180dc886`); no picture exists for the Step 3 characteristics screen (R step3 section 5 says the brief asks for none). The reports say how many pictures their author opened: Step 2 five of 32 (R step2 section 3: "I did not [look at every picture]"), Step 4 four of 20 (R step4 section 7), Step 5 seven of 18 (R step5 section 3), Step 6 two of 4 (R step6 section 3).

## 9. Could not establish

- Whether the lane read plan r4 sections 4.1 to 4.8, 7.1, and its two reviews (brief Step 0). R step0 does not say.
- Whether lane 58 had merged when the lane was cut (R step0 names only lane 57).
- Which two keys the desk's "removes 2" meant (section 5). The lane's key diff shows none removed.
- Authorisation for the `VowelCapture.svelte` edit (item 4.22): none found in the brief or the 25 amendments. The edit is disclosed in R step4.
- Whether `VoicePane` sits inside the `INCLUDE_MARKUP_INSIGHTS` wall: I found the `{#if}` at `routes/+page.svelte:4124` and the mount at `:4179` and did not trace the closing `{/if}`.
- Whether the notices (`routes/+page.svelte` after `:4196` by the brief) stayed unchanged: I did not diff that range line by line; the page diff is 46 lines.
- Any gate, test, or Playwright result: I ran none. Counts in section 7 are the lane's own, quoted.
- Any pixel height, print page count, or picture: I measured and viewed nothing.
- Whether a real rustle is refused (R step4 section 8 says NOT DONE).
- The first-visit behaviour of Chrome on iOS with the shared visit: only the stub's `visitOpen` flag was tested (R step4 section 8).
- The chart block, sources block, and `.vp-door` fill style in `VowelSpaceSheet.svelte` and `VoicePane.svelte`: not individually read.
- The scout's own token use: I cannot read a harness counter; my estimate is in the final message.
