# Citation packet for the lane 60 brief (scout S6b), r1, 2026-11-16

Read-only. Facts, not design judgements. Written for the Fable reviewer of `brief-code-n203-lane60-the-voice-pane_r1_2026-11-16.md` (called "the brief"; its own line numbers are written "L<n>").

## 0. Method and limits

- Base: `Shane` `d9af5ac9`, read from a git worktree at `/home/claude/s6/base` (made with `git worktree add`, local only). Merged tip: `/home/claude/s6/ilya`, branch `merged`, head `68871a6e`. Every path is under `apps/web/src/` unless it begins `apps/`, `docs/`, `scripts/`, or `e2e/`.
- What the merged tip changes in files this brief touches: `routes/+page.svelte` (+4 lines, 5,508 to 5,512), `lib/i18n.ts` (+20 lines; header 1,270 keys to 1,278), `lib/insights/InsightsPane.svelte` (-1), `lib/insights/ratified-lines.test.ts` (+11). `CalibrationWizard.svelte`, `ProfileSwitcher.svelte`, `VowelCapture.svelte`, `chart/*`, `engine/*`, `Drawer.svelte`, `VoiceAnchor.svelte`, and both e2e files are byte-identical to `d9af5ac9` (`git diff --name-only d9af5ac9 HEAD`).
- `routes/+page.svelte` offsets on the merged tip, checked by grep: `calibrating` 307 to 308; `voiceCalibrated` 1636 to 1637; the wizard mount 3881 to 3885; `scoreGroup` 4105 to 4109; `<VoiceAnchor` 4160 to 4164; `.group-notices` 4196 to 4200. Lines before 14 do not move; the rest move by +1 to +4.
- `lib/i18n.ts` offsets on the merged tip: keys between about 1,050 and 1,985 move by +2 (`profile.emptyState` 1446 to 1448, `calib.readiness.guidance` 1295 to 1297); keys after about 2,520 move by +5 (`sheet.title` 2472 to 2477).
- Ran no tests and installed nothing. Three throwaway Node scripts (section 4.4 and section 3.4) ran copies of `detector.ts`, `readiness.ts`, `dsp.ts`, `fry-synth.ts`, `resolve-values.ts` and their imports under `node --experimental-strip-types`, in `/tmp/s6exp`. Nothing in the repository was edited.
- The two sheet files in the uploads folder have no counted forms at the end (49 and 37 lines). The French sheet has no line 26 (only 26b). Both are the older copies the task warned about.
- The clone's `docs/memory/INBOX.md` ends at 2026-11-15 23:54. Every Dann quotation of 2026-11-16 in the brief (L27, L28, L29, L30) is NOT ESTABLISHED from the clone. The 2026-11-15 rulings are in it (`INBOX.md:737`, `:740`, `:760` to `:763`).

## 1. Every cite in the brief, at `d9af5ac9`

Status key: MATCHES, MOVED (right line given), WRONG (what is there). "By plan r4" cites: none is off at `d9af5ac9`.

| Brief | Cite | Status | What is there |
|---|---|---|---|
| L9 | `routes/+page.svelte:4160-4165` | MATCHES | `<VoiceAnchor voiceName={voiceName} calibrated={voiceCalibrated} {language} oncalibrate={enterCalibration} />`. Merged 4164-4169. |
| L9 | `lib/components/Drawer/VoiceAnchor.svelte` | MATCHES | 136 lines; one line of status and one button (`:47-52`). |
| L18 | plan r4 sections 4.1, 4.2, 4.3, 4.5, 4.6, 4.8, 7.1 | MATCHES | Headings at plan `:94`, `:112`, `:119`, `:182`, `:200`, `:233`, `:317`. The floor paragraph is in 4.6 (`:214`). |
| L32 | `Drawer.svelte:540-548` | MATCHES | The ANALYSIS band; `:540-543` says NOTATION is its first row, "a station, closed on arrival, never stored open". |
| L32 | "plan r4 section 8 as decided 2026-11-16 00:4x" | NOT ESTABLISHED | Plan r4 section 8 (`:370-392`) lists D1, D4, D5, D14, D15, D16 as defaults "still Dann's". No decision of 00:4x is in the plan or the clone's INBOX. |
| L40 | wizard at 1,726 of 1,727 | MATCHES | `wc` 1,726; `scripts/ratchets.json` 1,727. |
| L44 | `CalibrationWizard.svelte:237` | MATCHES | `let store = $state<ProfileStore>(loadStore(`${INITIAL_NAME_BASE} 1`));` |
| L44 | `Drawer.svelte:819-823` | MATCHES, as a comment | The comment says "Always in the tree on Studio and hidden until it is entered". The mount is `:845-856`: `{#if isStudio && voiceTakeover}`, `class:stowed={!takeoverActive}` (`:846`), `{@render voiceTakeover()}` (`:856`). "Whenever VOICE is shown" is loose: the wizard is in the tree on Studio only when the wall is open (`routes/+page.svelte:3874-3875`, `{#if INCLUDE_MARKUP_INSIGHTS}` inside the snippet). |
| L46 | `CalibrationWizard.svelte:836-850` | MATCHES | The `$effect` calling `onActiveProfileChange?.(...)` with six arguments. |
| L46 | `routes/+page.svelte:3884-3891` | MATCHES | The callback body writes six `$state` fields (`:357-366`). Merged 3888-3895. |
| L47 | `openRequest` `:202`, answered `:321-332`, refused at `:330` | MATCHES | `:202` the type `{ phase: 'characteristics'; n: number } \| null`; `:330` `if (phase !== 'capture') resetFlow(req.phase);`. |
| L48 | `routes/+page.svelte:3885-3887` | WRONG | Those three lines are `voiceFormants = f;`, `voiceName = name;`, `voiceCharacteristics = characteristics;` inside the `onActiveProfileChange` body. The mount is `:3881-3903`; its attribute lines are `:3882` (`{language}`) and `:3883` (`openRequest={calibrationRequest}`). Merged: mount 3885-3907. The same wrong cite is in lane 59's r3 section 9 amendment 3 (taken from the review) and so inherited. |
| L49 | "the mount passes no `onComplete` today, `:3881-3896` by plan r4" | MATCHES (fact) | No `onComplete` at the mount. The prop exists (`CalibrationWizard.svelte:143`, `:213`) and is called by `finish()` at `:787`. The cited range stops inside `onOpenLearnNote`; the mount ends at `:3903`. |
| L56 | `ProfileSwitcher` mounted at wizard `:1032`; `disabled={phase === 'capture'}` at `:1035` | MATCHES | Both exact. |
| L57 | `routes/+page.svelte:1636`, `usableReadingCount` | MATCHES, with a note | `:1636` is `const voiceCalibrated = $derived(usableReadingCount(voiceFormants) > 0);`. The function is defined at `lib/voice/profileStore.ts:196`, imported at `routes/+page.svelte:130`, and also used at `:1721` (`scoreStateLine`). |
| L57 | `stand-ins.ts:81-87` | MATCHES | `PLACEHOLDER_PROFILE_TYPES` (`:81`) and `hasPlaceholderProfile` (`:84-87`). |
| L58 | `ProfileSwitcher.svelte:251` | MATCHES | `<button type="button" class="ps-primary" onclick={submitFirst}>`. |
| L58 | `docs/memory/PRODUCT.md:522` | MATCHES | "At rest, nothing in the drawer is filled; exactly one thing is next, and only that one thing is filled, one primary pill per surface, last in its row." |
| L59 | `ProfileSwitcher.svelte:225-253` | MATCHES | The `voices.length === 0` first-launch form. |
| L61 | `routes/+page.svelte:4196-4256` | MATCHES | `<div class="group-notices">` to its closing `</div>`. |
| L61 | `routes/+page.svelte:1714-1716` | MATCHES, a comment | "VOICE SAYS NOTHING BEHIND THE WALL"; the code is `scoreStateText` (`:1717` on) and the group's gate `{#if INCLUDE_MARKUP_INSIGHTS}` at `:4106` (closing `{/if}` `:4257`). |
| L63 | `voice-anchor-usable.test.ts:13`, `:40-42` | MATCHES | `:13` renders `VoiceAnchor`; `:40`, `:41`, `:42` are three `toMatch` / `not.toMatch` on page source. |
| L63 | `e2e/singer-paths.test.ts:92-110` | MOVED (narrower) | The Calibrate-related pin is `:92-103` (`:99` EN text, `:102` FR text of the empty state). `:105-110` is the next test and pins nothing on Calibrate. |
| L63 | `e2e/singer-paths.test.ts:182-204` | MATCHES | `:197` the MELODY text; `:203-204` `expandStation(page, 'Voice')` then the "Calibrate" button. |
| L67 | `CalibrationWizard.svelte:1196-1280` | MATCHES | `{:else if phase === 'characteristics'}` at `:1196`; the Done button returns to the summary (`:1274-1276`, `phase = 'summary'`). |
| L67 | `routes/+page.svelte:1650-1660` | MATCHES | The comment and `openRangeFields` (`:1656-1660`); its only caller is `onaddrange={openRangeFields}` at `:4343`. |
| L71 | `readiness.ts:133-134`; wizard `:646-714` | MATCHES | `READINESS_PREP_MS = 2100`, `READINESS_CAPTURE_MS = 3000`; `beginReadiness` spans `:646-714`. |
| L71 | "done branch near `:1113`" | MATCHES | `:1113` is `<p class="wizard-lede">{T('calib.readiness.complete')}</p>`. |
| L71 | `assessReadiness` `readiness.ts:316-338` | MOVED | The function is `:306-340`; the presence veto comment is `:314-329`; the return is `:331-339`. |
| L71 | `FRY_PRESENCE_MIN_SNR_DB = 6` at `readiness.ts:108` | MATCHES | Exact. |
| L71 | "the done screen says 'Readiness check complete.' whatever the check found" | PARTLY WRONG | A silent room is not routed to that screen. `fryCandidateRank` scores a window with `heard === false` as 0 (`readiness.ts:157-158`), the driver keeps only windows with rank above 0 (`live.ts:602-607`), and `finishReadiness` calls `onError` when none exists (`live.ts:631-640`). The wizard then shows `calib.readiness.noFry`, the guidance line, and Continue (`CalibrationWizard.svelte:1097-1111`). "Complete" is shown only when some window had a rate and a room ratio of 6 dB or more (or an unmeasurable ratio). See section 4. |
| L75 | `calib.readiness.noMic` | MATCHES | `i18n.ts:1293`; wizard `:1099-1101`. |
| L76 | `calib.readiness.guidance` | MATCHES | `i18n.ts:1295` ("You can carry on; each vowel asks for the microphone again."); wizard `:1108-1110`. Merged 1297. |
| L83 | summary phase `:1141-1195` | MATCHES | `{:else if phase === 'summary'}` `:1141`; the next branch `:1196`. |
| L86 | `VowelSpaceSheet.svelte` | MATCHES | 401 lines. The component the wizard mounts is `SummarySheet.svelte` (14 lines), which wraps it (`CalibrationWizard.svelte:1154`, `:1163`). |
| L88 | "Your readings" near `VowelSpaceSheet.svelte:119` | MATCHES | `{#if rows.length}` `:117`, `<table class="readings">` `:118`, `<caption>` `:119`, table ends `:146`. |
| L88 | roster `:916-1002` | MATCHES | `{#snippet rosterTable(showActions: boolean)}` `:916` to `{/snippet}` `:1002`. |
| L89 | `:935-975` | MATCHES | ⓘ `:935-945`; reading word `:946-958`; "Beyond" `:959`; "Noise floor" `:960-975`. "Try again" is outside the cited range at `:984-988`. |
| L93 | `:894-903`, `:910-914`, `:777-783` | MATCHES | Invitation snippet; characteristics-button snippet; `retakeFromSummary`. |
| L95 | `lib/voice/chart/print-sheet.ts` | MATCHES | 54 lines; mounts `VowelSpaceSheet` with `forPrint: true`. |
| L100 | MELODY `i18n.ts:1446` | MATCHES | Key `profile.emptyState`. Merged 1448. |
| L104 | `lib/i18n.test.ts:155` | MATCHES | `it('every French value in i18n.ts follows the table'`. |
| L106 | `bandState.ts:245` | MATCHES | `named ? t('calib.anchor.named', language).replace('{voice}', voiceName) : null`. |
| L106 | plan r4 section 5 "Strings that leave use" | MATCHES | Plan `:298`. The brief's list is the plan's list less the lane 59 and lane 61 keys, plus `calib.readiness.guidance`. |
| L110 | `e2e/calibrate-new.test.ts:13-34`, "click Calibrate today" | MATCHES for the extent, partly for the claim | `open` is `:13-27`, `toCapture` is `:28-34`. Only `toCapture` clicks Calibrate (`:30`). `open` clicks the VOICE band (`:26`). Three other tests click `/re-calibrate/i` directly (`:166`, `:175`, `:185`), outside the helpers. |
| L116 | `VowelCapture.svelte:88` | MATCHES | `sungSet` as quoted. |
| L116 | `engine/stub.ts:99` | MATCHES | `fryAccepted: true,`. |
| L123 | `docs/house-style/interface-text.md` | MATCHES | Exists. |

## 2. Step 1, the seam

### 2.1 Every read and write in `CalibrationWizard.svelte` (identical on the merged tip)

| Item | Where |
|---|---|
| `store` declared | `:237`. Only the wizard calls `loadStore` (`:237`) and `saveStore` (`:356`, through `persistStore`); no other non-test file does (grep). |
| `store` reads | `:244-245` (`nextDefaultName`), `:317` (`initialFormants`), `:340` (`askTypeFirst` effect reads `store.activeId`), `:405`, `:420`, `:445`, `:506`, `:516`, `:632`, `:641`, `:793` (each `store.voices.find(...activeId)`), `:1033-1034` (switcher props), `:1045` (`{#if activeVoice}`). |
| The voice list (`store.voices`) writes | `:482` (`push` in `createVoice`), `:518` (`splice` in `deleteActiveVoice`). |
| The active id (`store.activeId`) writes | `:483` (create), `:499` (select), `:520` (delete). `activeVoice` is derived at `:238`. |
| Writes inside the active voice | `v.formants`, `v.updatedAt`, `v.calibratedAt` (`persist`, `:444-450`); `v.characteristics` (`setCharacteristic`, `:404-416`); `assignToVoice` (`setOwn`, `:419-422`; defined `lib/voice/profileStore.ts:150`); `v.name` (`:508`); `v.readiness` (`recordReadiness`, `:631-637`); `addTake` (`recordTake`, `:640-643`); `delete v.takes` (`confirmReset`, `:794`). |
| `voiceType` | Derived at `:240`. Reads: `:299`, `:307` (the guard and its event), `:848` (published), `:1063` (`VoiceTypeFirst`), `:1138` (`VowelCapture`), `:1144` (`OutsideNote`), `:1154`, `:1163` (`SummarySheet`), `:1216`, `:1223`, `:1238`, `:1245`, `:1261`, `:1268` (six `NotePicker`s). Writes: only through `setOwn` at `:1063` (`setOwn({ voiceType: id })`) and `:1209` (`VoiceTypeIntake onchange={setOwn}`). |
| Own answers | `setOwn` `:419-422`; callers `:1063`, `:1209`, `:1276` (`setOwn({ intake })`); read `activeVoice.intake` `:847`, `:1276`. |
| `openRequest` | Prop type `:202`; destructured with default `null` `:217`; effect `:323-332`. Page: state `routes/+page.svelte:1655`; written `:1657`; passed `:3883`. The only trigger is INSIGHTS' `onaddrange` (`:4343`). |
| `onActiveProfileChange` | Type `:156-171`; destructured `:214`; effect `:836-850`. Page callback `:3884-3891` writes `voiceFormants` (`:357`), `voiceName` (`:358`), `voiceCharacteristics` (`:359`), `voiceUpdatedAt` (`:362`), `voiceIntake` (`:364`), `voiceTypeChoice` (`:366`). |
| Phase changes on a voice change | `createVoice` `:485`, `selectVoice` `:501`, `deleteActiveVoice` `:522` (each `resetFlow(hasAnyReadings(profile) ? 'summary' : 'welcome')`); `confirmReset` `:797` (`resetFlow('welcome')`). |
| Other phase writes | `beginReadiness` `:646`, `beginCapture` `:717`, `addChallengingVowels` `:765`, `continueTour` `:772`, `retakeFromSummary` `:777`, the capture's `onReturn` `:1138`, the characteristics Done `:1275`. |
| Props the wizard takes | `session` (`:211`, default `captureSessionFor()`), `onVowelCaptured`, `onComplete`, `onActiveProfileChange`, `onOpenLearnNote`, `language`, `openRequest` (`:209-217`). |

### 2.2 Every prop at the one mount (`routes/+page.svelte:3881-3903`)

| Line | Prop |
|---|---|
| `:3882` | `{language}` |
| `:3883` | `openRequest={calibrationRequest}` |
| `:3884-3891` | `onActiveProfileChange={(f, name, characteristics, updatedAt, intake, voiceType) => {...}}` |
| `:3892-3902` | `onOpenLearnNote={() => { exitCalibration(); handleTabChange('learn'); handleHeadingNavigate('learn-u3-note-o'); }}` |

Not passed: `session`, `onVowelCaptured`, `onComplete`. Takeover visibility reaches the Drawer, not the wizard: `takeoverActive={calibrating}` (`:3829`) and `onexittakeover={exitCalibration}` (`:3830`); `exitCalibration` is only `calibrating = false` (`:1646-1648`).

### 2.3 What must cross from the wizard to the page for the pane at rest

Already crossing today (`:836-850`, `:3884-3891`): the working readings, the voice name, the characteristics, the readings' date, the intake answers, and the voice type triple (`voiceType`, `voiceTypeSpecific`, `voiceTypeOther`, in `voiceTypeChoice`, `routes/+page.svelte:366`, read at `:4335` and `:4373`). The page therefore already holds the type; it needs no new publication for the type line.

Not crossing, and needed by the brief's Step 2:

1. The voice list (`id`, `name` per voice) and the active id: today only the wizard's own `ProfileSwitcher` receives them (`:1033-1034`).
2. `nextDefaultName` (`:243-248`, a derived): the switcher uses it for the New, Duplicate, and Rename drafts.
3. The five commands the switcher calls back: `selectVoice` `:495`, `createVoice` `:473`, `duplicateActiveVoice` `:489`, `renameActiveVoice` `:504`, `deleteActiveVoice` `:514`.
4. A voice-type write: `setOwn` `:419` (the page cannot call it today).
5. An open command for three screens: sing (`resetFlow('welcome')` for no readings, else `opening = openTour(profile); phase = 'capture'`, which is what `beginCapture` does at `:717-720`), summary, characteristics. The effect at `:323-332` handles characteristics only, and refuses when `phase === 'capture'` (`:330`).
6. A "take running" flag. Neither the wizard nor the page has one. The state is `ritual.phase !== 'idle'` inside `VowelCapture.svelte` (`running` `:202`, `active` `:201`); `VowelCapture` exposes no prop or callback that reports it upward (its props, `:39-61`, are `session`, `language`, `voiceType`, `profile`, `startVowel`, `pass`, and callbacks `onCaptured`, `onRolledBack`, `onFailed`, `onTake`, `onReturn`, `onClearAll`). The wizard's `phase === 'capture'` is wider than a take: it is true on the idle capture screen too. The brief's "refuse only while a take runs" and "inert only while a take runs" (L47, L56) therefore need a new signal from `VowelCapture` (lane 59's file) through the wizard to the page. Neither brief names it.
7. A close callback for Finish: the existing `onComplete` fires at `finish()` (`:785-789`) and the mount passes none, so the brief's "new callback" (L49) could be `onComplete` itself. `finish()` also sets `finished = true` (`:788`).
8. The page cannot tell "no voice saved" from "voice saved, nothing recorded" by `voiceName` alone: `voiceName` is `undefined` only before first-launch naming (doc comment `:153-155`). `ProfileSwitcher` decides first launch by `voices.length === 0` (`ProfileSwitcher.svelte:225`).

A path that breaks when the switcher moves out: with no voice, the wizard renders only the switcher (`{#if activeVoice}` at `:1045`; comment `:232-233`). INSIGHTS' "Add your range" (`openRangeFields`, `+page:1656`) can open the takeover in that state today and shows the first-launch form. After the move the takeover would show no content in that state, since the brief makes the name a plain label inside it. NOT ESTABLISHED whether the brief intends that path to be handled.

## 3. Step 2, the pane's sentence

### 3.1 What decides each state

Inputs available: `usableReadingCount(voiceFormants)` (`profileStore.ts:196`); `voiceTypeChoice.voiceType` (a free string, `engine/types.ts:35`, not validated by `validVoice`); `hasPlaceholderProfile(voiceType)` (`stand-ins.ts:84-87`, true for soprano, mezzo-soprano, tenor, baritone, bass; it trims and lowercases); `TIER1` (`voiceTypes.ts:19-29`: soprano, mezzo-soprano, contralto, countertenor, tenor, baritone, bass-baritone, bass, not-sure); `isTier1` (`:60`); `voiceTypePrint` (`:81-96`); `voices.length`. `hasPlaceholderProfile` is read nowhere in `routes/` or `components/` today; its only non-test caller is `engine/resolve-values.ts:210`.

| # | State (brief L57; sheet r2) | What decides it | Notes |
|---|---|---|---|
| 1 | No voice saved: first-launch form, no sentence | `voices.length === 0` (`ProfileSwitcher.svelte:225`) | The brief's item 4 (L59). Not in the list of sentence states. |
| 2 | Nothing recorded, no type (line 1) | usable 0 and `voiceType` undefined, empty, or an id outside `TIER1` and outside the five placeholder types | An unknown stored id lands in state 4 (line 3), not here: `hasPlaceholderProfile` is false and `isTier1` is false. |
| 3 | Nothing recorded, a type with generic values (line 2) | usable 0 and `hasPlaceholderProfile` true | `{type}` from `voiceTypePrint`. French elision through `fillVoiceType` (`voiceTypes.ts:128-131`) fills `{voiceType}`; the English sheet writes `{type}` and the French sheet `{voiceType}`. |
| 4 | Nothing recorded, contralto, countertenor, or bass-baritone (line 3) | usable 0, `isTier1` true, not placeholder, not `not-sure` | Also reached by an unknown legacy id, where `voiceTypePrint` returns `undefined` and `{type}` is empty. NOT ESTABLISHED whether such stored ids exist. |
| 5 | Nothing recorded, "Not sure" (line 4) | usable 0 and `voiceType === 'not-sure'` | `voiceTypePrint` returns `undefined` for `not-sure` without Other's text (`voiceTypes.ts:88`), the same as for no type, so the type control's label ("Choose a voice type" or "Not sure") cannot come from `voiceTypePrint` alone. `hasDeclaredType` (`chart/screen-logic.ts:30`) treats `not-sure` as undeclared. |
| 6 | One to nine, before the six anchors (line 5) | usable 1 to 9, and not state 7 | Stand-ins run for any type once anything is sung (`resolve-values.ts:208-212`: `anySung \|\| generic \|\| placeholders === 'always'`), so "generic values" is true for every type, including none and not-sure (middle of the five staves, `stand-ins.ts:63-70`). |
| 7 | One to nine, every remaining vowel worked out (line 5b) | Lane 59's function (review amendment 10): `resolveVowelValues(profile, voiceType, { placeholders: 'always' })` (`chart/zones.ts:93`) has no `surrogate` source and at least one vowel is unrecorded | Not yet written. Lane 59's brief names no module or export for it (section 8). |
| 8 | Ten recorded (line 6) | usable 10 | |

The brief says "eight states" three times (L63, L127, and the heading of this check). It lists seven sentence states and one form. Eight is reached only by counting the first-launch form (state 1). With the counted forms for "one left" (m = 1), lines 5 and 5b each gain a variant; those forms are not in the uploaded sheets. NOT ESTABLISHED: whether "eight" means these eight.

Unreachable or missing:

- No state: readings exist but none is usable (all implausible and not kept). usable is 0, so lines 1 to 4 print, while the wizard still opens on the summary (`hasAnyReadings`, `:485`, `:501`, `:522`) and the capture screen's head says "n of 10" (`VowelCapture.svelte:277`). The brief's door rule "shown once there is a type or a reading" (L58) does not say which count.
- Line 5b with no recorded vowel in `DERIVE_ANCHORS` order: unreachable by construction (it needs at least one recorded vowel).
- A type-only voice with `voiceTypeOther` text: `voiceTypePrint` returns the singer's own text (`voiceTypes.ts:84-87`); the state is still decided by `hasPlaceholderProfile`, so a "Not sure" voice with Other text is state 5 with a printed label.
- The sing door's target: the brief says Welcome "for a voice with no reading" (L47). The wizard's own test for Welcome is `hasAnyReadings` (`:485`), not `usableReadingCount`. At ten recorded the door "Record a vowel again" has no ruled target; `openTour` returns `'i'` when nothing is left (`chart/opening.ts:19`), which plan r4 section 4.3 says ("or on [i] when all ten are sung").

### 3.2 Where the counts disagree

Counters, by file and line:

- `usableReadingCount` (`profileStore.ts:196-198`): readings where `isUsable` (`engine/plausibility.ts:317-319`: not `implausible`, or kept).
- `sungSet` (`VowelCapture.svelte:88`): `reading !== 'estimated' && f1 > 0`, regardless of plausibility or fR2. The same test is `isSung` in `chart/readings.ts:51` and `chart/zones.ts:82`.
- `capturedCount` (`CalibrationWizard.svelte:336`): every truthy entry in `profile`.
- `hasAnyReadings` (`profileStore.ts:179-181`): `Object.keys(f).length > 0`.
- `openTour`'s `sungOf` (`chart/opening.ts:13`): every truthy entry.
- `anySung` (`resolve-values.ts:~163`): usable and `f1 > 0`, no check on `reading`.

Computed with copies of `isUsable`, `sungSet`, `capturedCount`, and `resolveVowelValues` (script `/tmp/s6exp/run/exp3.mjs`, bass):

| Reading | usable | sungSet | capturedCount | hasAnyReadings | anySung |
|---|---|---|---|---|---|
| A: [i] `f1 1063, f2 2250, plausibility 'implausible'`, not kept | 0 | 1 | 1 | true | false |
| B: the same, `plausibilityOverride: true` | 1 | 1 | 1 | true | true |
| C: [i] `f1 296`, no fR2, `f2Quality 'absent'` | 1 | 1 | 1 | true | true |
| D: [e] `f1: 0` (the shape of `formant(0)` in `analysis/analyze-score-adapter.test.ts:101`) | 1 | 0 | 1 | true | false |
| E: [ɨ] stored `reading: 'estimated'`, `f1 300` (an older build; `profileStore.ts:~89` says estimates are never stored) | 1 | 0 | 1 | true | true |
| F: [i] `296 / 1705`, plausible | 1 | 1 | 1 | true | true |

Reading A is the case the brief's L116 names: the pane says nothing recorded, the capture screen says "1 of 10", the summary lede says "1 of 10 vowels sampled", and INSIGHTS' `generic` flag is computed from `anySung` (false). Reading C counts as recorded everywhere but prints "Try again" in the roster and the sheet, and lane 59's finish-early rule treats it as not usable (its amendment 10 test "an anchor with `f2Quality: 'absent'`"). Lane 59's `{m}` is "ten less the head's count" (review amendment 10), that is `sungSet`; lane 60's pane uses `usableReadingCount`. For reading A the two numbers differ on screens one tap apart.

NOT ESTABLISHED: whether readings D or E exist in any real store.

## 4. Step 4, the test fry

### 4.1 `engine/readiness.ts` (340 lines), in brief

- Constants: `FRY_RANGE_LO_HZ 20`, `HI 80` (`:50-51`); marginal 25 and 75 (`:59-60`); SNR band 100 to 4000 Hz (`:63-64`); `PSD_NPERSEG 2048` (`:67`); `ROOM_SNR_TOAST_DB 25` (`:82`); `FRY_PRESENCE_MIN_SNR_DB 6` (`:108`); `READINESS_PREP_MS 2100`, `READINESS_CAPTURE_MS 3000` (`:133-134`).
- `fryCandidateRank` (`:152-160`): 0 for no finite rate or `heard === false`; 1 for a refused rate; 2 for an accepted one.
- `ReadinessResult` (`:184-219`): `room`, `fryHeard`, `fryRateHz`, `fryRange`, `fryAccepted`, `fryFailed`, `fryUndecided`.
- `bandPower` (`:229-249`), `measureRoom` (`:255-260`), `roomSnrDb` (`:269-272`), `classifyFryPresence` (`:284-287`), `classifyFryRate` (`:295-300`).
- `assessReadiness(quiet, fry, sr)` (`:306-340`): `det = detect(fry, sr)` `:311`; `heard = classifyFryPresence(room.snrDb)` `:313`; `rateHz = heard === false ? null : det.rateHz` `:330`; `fryAccepted: det.accept` `:336`. The comment at `:203` says "eight-condition"; the detector has six (`detector.ts:128`: `c3_ipi`, `c4_decay`, `c5_cv`, `c6_count`, `c7_flat`, `c8_snr`).

### 4.2 The driver, `engine/live.ts`

- Constants: `GATE_WINDOW_S 1.0` (`:105`), `GATE_HOP_MS 250` (`:107`), `QUIET_S 1.0` (`:120`), `QUIET_SETTLE_S 0.25` (`:126`).
- `runReadiness` (`:408-454`): acquire; every 250 ms test whether `QUIET_SETTLE_S + QUIET_S` of audio is buffered (`:411-421`); bank the last second as `quietBuf` and its band power as `quietPower` (`:424-425`); clear buffers; call `onQuiet()` (`:434`); `setTimeout(READINESS_PREP_MS)` (`:440`) discarding audio; then `setInterval(readinessTick, 250)` (`:446`) and `setTimeout(finishReadiness, READINESS_CAPTURE_MS)` (`:447-451`).
- `readinessTick` (`:569-607`): 1.0 s trailing window; `detect`; `snr = roomSnrDb(quietPower, bandPower(y))` (`:584`); `rank = fryCandidateRank(heard, det.rateHz, det.accept)` (`:602`); keeps the window when `rank > 0 && rank >= fryRank`. It does not end the run early (its header comment, "An accepting window ends the run at once", is stale).
- `finishReadiness` (`:610-645`): no kept window gives `onError({ code: 'EXTRACTION_FAILED', cause: { reason: 'readiness-timeout' } })` (`:631-640`); otherwise `assessReadiness(quiet, fry, sr)` (`:642`) and `onComplete`.
- The microphone is released at `:629` (`releaseAudio()`, defined `:707`).

### 4.3 The clocks and the wizard's readiness phase

- Engine: Quiet is not a fixed clock. It ends after 1.25 s of audio has buffered after `acquire()` (checked every 250 ms), so it includes the permission wait. Then 2.1 s of prep, then a 3.0 s window with a tick every 250 ms. The brief's "Breathe 2 s" (L74) is 2.1 s in the engine.
- Wizard: it has no clock for Quiet (`readinessStep = 'quiet'` until `onQuiet`, `:646-653`, `:658`). On `onQuiet` it starts its own timers: three beats of `READINESS_PREP_MS / 3` for "Three.", "Two.", "One." (`:667-669`), then `READINESS_PREP_MS` later the capture bar (`:671-681`, `readinessProgress` from `performance.now()` over `READINESS_CAPTURE_MS`). Both clocks start from the same `onQuiet` call (`live.ts:434` then `:440`; the wizard's timers start inside the callback), so they agree to within a frame; the wizard's comment `:546-553` says the engine and the wizard "read" one constant and do not drive each other.
- Stub: `startReadiness` (`stub.ts:166-188`) calls `onQuiet` after 1,000 ms and `onComplete` after `READINESS_PREP_MS + READINESS_CAPTURE_MS` more. It returns `fryAccepted: true` (`:99`) and `fryHeard` from the real classifier on an SNR of 34 dB (or 18 dB for `marginal-snr`), so it is always `true` (`:80`, `:96`).
- Wizard markup: title `:1068`; `quiet` lede `:1070`; prepare lede and `calib.readiness.countThree`... (`:1076-1078`); capture lede and a `role="progressbar"` (`:1082-1092`); `unmeasured` branch `:1093-1112` (noMic or noFry, guidance, Continue); done branch `:1113-1120` (complete, marginal if `fryMarginal`, Continue). `fryMarginal` is `fryRange` of `marginal` or `out-of-range` (`:567-569`); `snrMarginal` is `room.lively` (`:570`) and raises the room toast at `beginCapture` (`:720`).
- What the wizard records from a result (`:687-695`): `measuredAt`, `measured`, `roomSnrDb`, `roomLively`, `fryRateHz`, `fryRange`. `fryHeard`, `fryAccepted`, `fryFailed`, `fryUndecided` are not stored.

### 4.4 The claims, confirmed or corrected

1. "`fryHeard` and `fryAccepted` are read by no screen": CONFIRMED. `grep -rn "fryHeard\|fryAccepted"` over `src`, `e2e`, `e2e-phone` finds only `engine/readiness.ts`, `engine/readiness.test.ts`, and `engine/stub.ts`.
2. The prep and capture clocks: as in 4.3. CORRECTION to L74: Quiet is about 1.25 s of audio plus the permission wait, not "the room's second"; Breathe is 2.1 s.
3. Where `null` `fryHeard` arises: `classifyFryPresence` returns `null` only when `room.snrDb` is `null` (`readiness.ts:284-286`), which `roomSnrDb` returns when either band power is `null` or not above 0 (`:269-271`). `bandPower` is `null` for an invalid sample rate (`:236`), a buffer shorter than 2,048 samples (`:237`), or a band with no bins (`:247`). With the driver's 1.0 s buffers (48,000 samples at the 48 kHz it requests, `live.ts:~99`) and a band of 100 to 4,000 Hz, the practical causes are a quiet second or a fry window of exactly zero power (a muted or noise-gated stream). Existing test: `readiness.test.ts:316-328` (a 2,047-sample quiet buffer gives `fryHeard` null while the rate is still recovered). A `null` window is still a candidate (`fryCandidateRank(null, 40, false)` is 1, `readiness.test.ts:301-314`), so a `null` result can reach `onComplete`; it cannot arise from the stub. The brief's treatment (L75, "not heard here") is consistent with this.
4. Would `det.accept` reject broadband noise bursts? By reading `engine/detector.ts` (accept is "no condition false", `:131`; conditions `:109-128`):
   - `c7_flat`: spectral flatness over 100 to 4,000 Hz (`:9-14`) must be at most 0.3 (`:120`). White or broadband noise is near 1.
   - `c8_snr`: the in-buffer proxy (100 to 4,000 Hz against the median of 5 to 10 kHz, `:23-45`) must be at least 12 dB (`:127`). Broadband noise reads about 0 dB. It is `null` (not failed) below a 10.4 kHz sample rate (`:39`).
   - `c3_ipi`: median inter-pulse interval 12.5 to 50 ms (`:109`). Noise bursts read 7 to 9 ms.
   - `c4_decay`: median valley-to-peak ratio below 0.4 (`:110`).
   - `c5_cv` (`:118`, at most 0.75) and `c6_count` (`:119`, at least 8 peaks) pass for noise.
   Experiment (synthetic, deterministic: `rng` from `fry-synth.ts`; 48 kHz; 1.0 s windows as `live.ts:105`; quiet second = pink-ish room bed at RMS 0.0005; scripts `/tmp/s6exp/run/exp.mjs`, `exp2.mjs`). `heard` was true for every non-silent case; `accept` was false for every one:

   | Fry-window signal | fryHeard | room SNR dB | accept | failed conditions |
   |---|---|---|---|---|
   | Room against room | false | 0.2 | false | c4, c7 |
   | Stationary white noise, RMS 0.01 | true | 19.2 | false | c4, c7, c8 |
   | White-noise bursts (20 to 120 ms on, 10 to 80 ms off), RMS 0.01 | true | 18.9 | false | c3, c4, c7, c8 |
   | The same, RMS 0.05 | true | 33.2 | false | c3, c4, c7, c8 |
   | Bursts low-passed at 2 kHz | true | 25.3 | false | c3, c4, c7, c8 |
   | Bursts low-passed at 800 Hz | true | 26.0 | false | c3, c4, c7 |
   | Bursts low-passed at 300 Hz | true | 26.0 | false | c3, c4, c7 |
   | Broadband clicks at 40 Hz (2 ms, 8 ms) | true | 19.7, 19.3 | false | c7, c8 |
   | Clicks at 40 Hz low-passed at 2 kHz, 800 Hz, 400 Hz | true | 25.3, 25.8, 26.1 | false | c7, c8 (2 kHz); c7 (800, 400) |
   | `synthFry` 40 Hz, formants 300 and 2200 Hz | true | 45.6 | true | none |

   So the presence floor (`readiness.ts:108`) does pass these signals; `c7_flat` (`detector.ts:120`) is the condition that rejected every one, with `c8_snr` (`:127`) and `c3_ipi` (`:109`) as extra rejecters for broadband content. Limits: synthetic signals only. No recording of Dann's clothing or hands exists in the clone (grep of `docs` and `apps` for "rustl" finds nothing relevant), and a real rustle may have a spectrum more peaked than anything tried. NOT ESTABLISHED for real rustle. For the brief's Step 4 test (L77), reusable deterministic material already exists: `noise()` in `readiness.test.ts:34-47` (xorshift, uniform), `fryPulses()` `:57-71`, and `rng`/`synthFry` in `engine/fry-synth.ts:52`, `:94`. A gated-burst generator is a few lines on top of `rng`; the test file has none today.
5. The existing control at `readiness.test.ts:275-288` ("a loud sample DOES carry a recoverable rate") shows `fryHeard` true and a non-null rate for a noise buffer, and asserts nothing about `fryAccepted`.

## 5. Step 5, the summary

### 5.1 The summary phase, `CalibrationWizard.svelte:1141-1195`

In order: `<h2 id="wizard-title">` (`:1143`, `calib.summary.title`); `OutsideNote` when `outside.length` (`:1144`); then `{#if finished}` (`:1145-1158` region) or `{:else}` (`:1159-1172`):

- finished: `calib.summary.savedLede` (`:1151`), `rosterTable(true)`, `SummarySheet`, `continueTourButton`, `challengingInvite`, `characteristicsButton`.
- not finished: `{capturedCount} {calib.common.of} 10 {calib.summary.progressLedeSuffix}` (`:1160`), `rosterTable(true)`, `SummarySheet`, `continueTourButton`, `challengingInvite`, the filled Finish (`:1171`, `calib.summary.finishButton`), `characteristicsButton`.
- then, in both: `confirmingReset` banner (`:1174-1189`: `calib.summary.resetConfirm`, `startFreshButton`, `keepProfileButton`) or the ghost Start over (`:1190-1194`, `calib.summary.startOverButton`).

Keys used, from `T(...)` in `:862-1002` and `:1141-1195`: `calib.challengingInvite.button`, `.caption`; `calib.characteristics.addButton`, `.editButton`; `calib.common.continue`, `.hz`, `.retake`, `.vowelWord`, `.of`; `calib.roster.actionsHeader`, `.kept`, `.noiseFloorLabel`, `.noiseFloorTitle`, `.oNoteAria`, `.tryAgain`, and through `readingLabel` (`:800-811`) `.reading.captured`, `.provisional`, `.estimated`; `calib.summary.finishButton`, `.keepProfileButton`, `.progressLedeSuffix`, `.resetConfirm`, `.savedLede`, `.startFreshButton`, `.startOverButton`, `.title`. `OutsideNote` adds `calib.summary.outside*`, `calib.summary.keepAll`, `calib.common.retake` (`OutsideNote.svelte`). `SummarySheet` adds every `sheet.*` key. `readingLabel` is also called at `:747` (the live-region announcement of a captured reading), so `.reading.captured` and `.provisional` stay in use; `.reading.estimated` has no other caller.

### 5.2 The roster's marks, file and line

| Mark | Where | Condition |
|---|---|---|
| Reading word ("Captured", "Provisional", "Estimated"; `≈` before Estimated) | `:946-958`; label from `readingLabel` `:800-811`; keys `i18n.ts:1266-1268` | A displayed value exists (`displayFormant` `:827-829`: the direct reading, else `deriveFrom`). "Captured" prints on every captured row; the brief's mark list (L89) does not include it. |
| "Beyond Ilya's reference values" | `:959` (`calib.roster.kept`, `i18n.ts:1316`) | `f?.plausibilityOverride` |
| "Noise floor: Unmeasured" | `:960-975` (`.noiseFloorLabel` `i18n.ts:1272`, title `:1271`) | `f?.noiseFloor === 'unmeasured'` |
| ⓘ beside [o] | `:935-945` (`calib.roster.oNoteAria`, `onOpenLearnNote`) | `showActions && g === 'o' && onOpenLearnNote`; the prop's doc says summary only (`:168-192`) |
| "Try again" | `:984-988` (`calib.roster.tryAgain`, `i18n.ts:1273`) | `f` exists and `typeof f.f2 !== 'number'` (the sheet and `readings.ts` test `f2 > 0` instead: `readings.ts:62`, `:93`) |
| Re-take button | `:991-997` | `direct` (a stored reading); goes with the roster |
| Greyed row | `:932` (`class:is-muted={!direct}`) | no stored reading |

### 5.3 `VowelSpaceSheet.svelte` and `readings.ts`

- The sheet: head (`sheet.title` "Your vowel space", `sheet.subtitle`, the voice's name, `:68-73`), the chart (`:75-92`), the four-line legend (`:94-115`), the table (`:117-146`), the provenance footnote (`:148`), the Print button (`:150-152`, drawn only with `onprint` and not `forPrint`).
- The table today: `{#if rows.length}` so nothing is drawn for an empty profile (pinned at `VowelSpaceSheet.test.ts:29`); columns Vowel (symbol `row-sym` and `spokenName`), `FrSym 1` with `sheet.col.fr1` "Hz and note", `FrSym 2` with `sheet.col.fr2`; each cell prints `hzText Hz` and `note` (`D4 +14`), or `calib.roster.tryAgain` for no fR2.
- Data per row (`readings.ts:28-33`): `vowel`, `fR1: NoteReading`, optional `fR2`. Rows are sung vowels only (`readingRows`, `:54-66`, via `isSung` `:51`). No `reading`, `confidence`, `plausibilityOverride`, `noiseFloor`, or placeholder flag.
- `readingListRows` (`:84-101`) already gives ten rows with `kind: 'sung' | 'placed'` and the chart's placeholder values (the capture screen's list; tests `readings.test.ts:67-130`). `PlaceholderDot` carries `source: 'derived' | 'surrogate'` (`zones.ts:123-126`).
- Can `readings.ts` carry the marks? The input of both functions is the full `CalibratedFormant` (`profile[vowel]`), which holds `reading` (`engine/types.ts:52`), `plausibilityOverride` (`:72`), and `noiseFloor` (`:~88`), so the data is present at the call; the row types do not carry it today. Two things are not in the sheet at all: a callback for ⓘ (the sheet has no `onOpenLearnNote`-like prop), and the print path: `printVowelSheet` (`print-sheet.ts:25-30`) passes only `profile`, `voiceType`, `language`, `voiceName`, so any mark the table gains also reaches the printed sheet unless `forPrint` filters it.
- Tests that pin the current table and rows: `VowelSpaceSheet.test.ts:29` (no table with nothing sung), `:50-54` (Hz, `D4 +14`, "Try again"); `readings.test.ts:48-65` ("lists only sung vowels"), `:124-126` ("leaves the sheet's rows as they were: sung vowels only"); `chart/ratified-strings.test.ts:18-21` (`sheet.readings`, `sheet.col.*`) and `:68` (`toHaveLength(48)` on the `capture.` and `sheet.` keys). The brief does not mention `ratified-strings.test.ts`.

## 6. Line counts and what Step 5 frees

### 6.1 Line counts (the method of `scripts/ratchets.mjs:63`: `split('\n').length` less 1 when the text ends with a newline; tests are exempt, `IS_TEST` `:35`)

| File (brief section 4) | `d9af5ac9` | merged | Ceiling in `scripts/ratchets.json` |
|---|---|---|---|
| `lib/voice/CalibrationWizard.svelte` | 1,726 | 1,726 | 1,727 |
| `routes/+page.svelte` | 5,508 | 5,512 | 5,534 |
| `lib/voice/ProfileSwitcher.svelte` | 539 | 539 | none (new-file maximum 1,000) |
| `lib/voice/chart/VowelSpaceSheet.svelte` | 401 | 401 | none (1,000) |
| `lib/voice/chart/readings.ts` | 101 | 101 | none (1,000) |
| `lib/voice/engine/readiness.ts` | 340 | 340 | none (1,000) |
| `lib/components/Drawer/VoiceAnchor.svelte` (to be replaced) | 136 | 136 | none (1,000) |
| `lib/i18n.ts` | 2,593 | 2,613 | exempt (`ratchets.json` `exempt`) |
| Also touched or read: `chart/SummarySheet.svelte` | 14 | 14 | none |
| `lib/voice/VoiceTypeIntake.svelte` | 212 | 212 | none |
| `lib/voice/VowelCapture.svelte` (lane 59) | 817 | 817 | none |
| `lib/components/Drawer/Drawer.svelte` | 1,981 | 1,981 | 1,990 |
| `e2e/singer-paths.test.ts`, `e2e/calibrate-new.test.ts`, `voice-anchor-usable.test.ts` | 206, 401, 44 | same | tests exempt |

`scripts/ratchets.json` differs between the two trees only for `staff-renderer.ts` (3,427 to 3,414) and `MarkupPane.svelte` (1,364 to 1,353). Headroom: wizard 1 line; `routes/+page.svelte` 26 at base, 22 on the merged tip.

### 6.2 What Step 5's removals free in `CalibrationWizard.svelte` (counted at `d9af5ac9`; an estimate of the upper bound, before the lines Step 5 adds back)

| Block | Lines | Count |
|---|---|---|
| Markup snippets: roster comment, invitation comment and snippet, continue snippet, characteristics snippet, roster snippet (`:865-1002`; `vowelTag` `:862-863` stays, `OutsideNote` needs it) plus the blank line | `:865-1003` | 139 |
| Summary markup: `<h2>` `:1143`; `{#if finished}` to `{/if}` less the kept Finish button, `:1145-1173` (29 lines, 28 without Finish) | `:1143`, `:1145-1173` | 29 |
| State: `challengingOffered`, `finished`, `capturedCount` | `:334-336` | 3 |
| `defaultsComplete` and its comment | `:341-344` | 4 |
| `hasCharacteristics` | `:424-427` | 4 |
| `resetFlow` resets of `challengingOffered`, `finished` | `:468-469` | 2 |
| `addChallengingVowels`, `continueTour` and their comment | `:765-776` | 12 |
| `finished = true` in `finish()` | `:788` | 1 |
| Script comment on the roster (history and typography) | `:578-597` | 20 (optional) |
| "Working values" comment and `displayFormant` | `:813-830` | 18 |
| Imports `FrSym` (`:45`), `deriveFrom` (`:70`) | | 2 |
| CSS: `.wizard-roster*`, `.wizard-info-glyph`, the narrow media query | `:1491-1625` | 135 |
| Total | | about 369 |

Not removable: `ALL_VOWELS` (`:108`, still used by `outside` `:337`), `DEFAULT_VOWELS`, `readingLabel` (used at `:747`), the `onOpenLearnNote` prop (the new ⓘ still needs it). `openChallenging` (`:51`) goes from the import list but the line stays. Counting only the lines the brief names (roster, invitation, ledes, characteristics buttons): about 139 + 29 + 12 + 4 + 4 = 188; with the roster's CSS: about 323. Step 1 and Step 2 (seam, switcher move, new callbacks) are in the wizard before Step 5 runs, and the brief orders them first (L79, L114), so the ceiling (1 line of headroom) binds from Step 1: the freed lines do not exist until Step 5. NOT ESTABLISHED: how many lines Step 1 needs.

## 7. Tests and e2e tests that pin what the brief removes or renames

| Item | Pinned at |
|---|---|
| `VoiceAnchor` ("Calibrate", "Re-calibrate", "not yet calibrated", FR "Calibrer") | `voice-anchor-usable.test.ts:4`, `:13` (render), `:16-21` ("Voice: not yet calibrated", "Calibrate", not "Re-calibrate", `Calibrer`), `:24-28` ("Re-calibrate"); page source `:40` (`voiceCalibrated` definition), `:41` (`usableReadingCount(voiceFormants), VOWELS.length`), `:42` (no `Object.keys(voiceFormants).length`). `voiceCalibrated` is read only by `<VoiceAnchor>` (`+page:4162`), so it has no reader once the component goes (`:1636`, comments `:1631`, `:1634`, `:4148`). |
| `calib.anchor.named` (stays) | read by `bandState.ts:245`; `bandState.test.ts:211` (comment), `:201` (comment naming `VoiceAnchor`) |
| The Calibrate button in the e2e | `e2e/singer-paths.test.ts:200-204`; `e2e/calibrate-new.test.ts:30` (`/^calibrate$/i`, in `toCapture`), `:166`, `:175`, `:185` (`/re-calibrate/i`) |
| MELODY's empty line (`profile.emptyState`) | `e2e/singer-paths.test.ts:99`, `:102` (EN and FR), `:197`; no unit test. Consumer `markup/MarkupPane.svelte:1126`. |
| "Profile summary" (`calib.summary.title`) | no test pins it (grep of `src`, `e2e`, `e2e-phone`) |
| `calib.summary.savedLede`, `.progressLedeSuffix` (the lede "N of 10 vowels sampled") | `e2e/calibrate-new.test.ts:110` ("1 of 10 vowels sampled"), `:161`, `:170`, `:176` ("3 of 10", "2 of 10", "3 of 10"). These are owned by lane 59's side of the file (section 8). |
| The roster's Re-take buttons | `e2e/calibrate-new.test.ts:167`, `:186` (`/^re-take$/i` `.first()`); test titles `:164`, `:183`; `:164-171` also relies on `Calibrate` becoming `Re-calibrate` |
| Summary Continue | `e2e/calibrate-new.test.ts:173` (title, B3), `:177` (`/^continue$/i`). Readiness Continue: `:32` (`toCapture`, 30 s timeout). |
| The invitation ("Sing the three Ilya derived") | no test pins it (grep) |
| Characteristics buttons (`calib.characteristics.addButton`, `.editButton`) | no test pins them (grep); the screen's own keys are read only in `french-italics.test.ts:65-66` (`passaggioHeading`, `passaggioPrimaryLabel`) |
| Roster reading words and marks | `voice/outside.test.ts:59`, `:62` (`calib.roster.kept` and its English), `n200-strings.test.ts:33` (`calib.roster.tryAgain` FR); no test pins `.reading.*` or `.actionsHeader` |
| Readiness strings | No unit or e2e test pins "Getting ready", "Fry now", "Readiness check complete", the guidance line, or the room-lively toast text other than `e2e/calibrate-new.test.ts:226` (toast "The room sounds a little lively."), reached through `__ilyaStubReadiness: 'marginal-snr'` (`:20`, `:223`; `stub-switch.ts:22-31`). `e2e/calibrate-new.test.ts:31` (`Begin`) and `:193` (`Begin` after Start over) pin the Welcome button. |
| `calib.readiness.countTwo` and `.countOne` | These are the vowel take's cues too (`capture-ritual.svelte.ts:173`), pinned at `capture-ritual.test.ts:88`, `:90`, `screen-logic.test.ts:98`, `:107`. Retiring the test fry's count (L74) must not mark them UNUSED while the take still reads them; `.countThree` is read only by the wizard (`CalibrationWizard.svelte:~660`). |
| The assessReadiness verdict | `readiness.test.ts:252-329` (the presence veto, rank, null abstention); `:195-250` (end to end, "carries the detector conditions without acting on them" `:229`) |
| Welcome sheet table (Step 5) | section 5.3 |
| Key index | `i18n-index.test.ts` (header "1,270 keys" at base, 1,278 on the merged tip, `i18n.ts:19`); `i18n.test.ts:58` pins `calib.common.retake` (stays) |
| No unit test mounts the wizard | `grep` finds none; plan r4 section 6 says so |

## 8. Contradictions with lane 59's r3 brief, its review, and plan r4

Lane 59 r3 is `brief-code-n203-lane59-the-take_r3_2026-11-16.md`; its review is `review-fable-lane59-brief-r2_r1_2026-11-16.md` (section 2, amendments 1 to 25); plan r4 is `plan-voice-in-the-drawer_r4_2026-11-15.md`.

Ownership and the visit helper

1. The brief's own L112 lists "the visit helper" under what the lane leaves to lane 59, while Step 4 item 4 (L76) tells lane 60 to widen the visit predicate. Lane 59's amendment 3 makes the helper take "a `() => boolean`", so the widening is an edit to the wizard's expression (lane 60 owns the wizard), not to the helper. Lane 59 Step 1's own note says lane 60 "calls the same pair around the test fry" (r3 `:...Step 1`); amendment 25 says "widen the predicate". Two mechanisms are named across the documents; the brief chose one.
2. Lane 59 section 4 says lane 59 touches the wizard "only to open and close the visit and to wire the finish-early action"; the new take-running signal (section 2.3, item 6) is not in either brief.
3. Lane 59 section 4 says the readiness clock is "which lane 60 replaces". The brief gives lane 60 `readiness.ts` "the verdict only" (L110); `READINESS_PREP_MS` and `READINESS_CAPTURE_MS` are also read by `live.ts` (lane 59's file, `:94-95`, `:440`, `:447`) and `stub.ts`, so they stay.
4. Lane 59's `e2e/calibrate-new.test.ts` ownership is "everything except `open` and `toCapture`". The tests that pin lane 60's removals (the `Re-calibrate` clicks `:166`, `:175`, `:185`; the "N of 10 vowels sampled" lede `:110`, `:161`, `:170`, `:176`; roster Re-take `:167`, `:186`; summary Continue `:177`; `Begin` `:193`) sit outside the two helpers. Plan r4 section 7.2 says "both briefs fix the selectors first" and "lane 60's seam merges before lane 59 rebases". Lane 59 r3 says neither; the brief says neither and names no owner for those tests.

The prop and Back

5. The takeover-visibility prop: lane 59 (amendment 3) adds it "at the wizard's mount (`routes/+page.svelte:3885-3887`, from `calibrating`, `:308`)". The cite is wrong (section 1). `calibrating` is `+page:307` at base, 308 on the merged tip. The brief (L48) reuses the prop and repeats the cite.
6. Back: lane 59 section 4 gives lane 59 "Back during a take (D13) and the visit's close on leaving the takeover". The brief cites "section 9, amendments 2 and 3" (L48); amendment 3 holds the rule ("end any take first, keep nothing, then `closeVisit()`"), amendment 2 the release rules. Neither says what happens to a readiness run on Back: today Back only sets `calibrating = false` (`+page:1646-1648`) and the wizard stays mounted (`Drawer.svelte:846`, class `stowed`), so a test fry begun before Back would run on. `resetFlow` cancels a readiness run (`CalibrationWizard.svelte:457-458`) but Back does not call it. NOT ESTABLISHED: who ends it.
7. Branch point: lane 59 says "after lanes 56, 57, and 58 have merged"; the brief says "after lane 56 has merged" (L3). The merged branch holds all three.

`TakeLine` props

8. Lane 59 amendment 13 gives the props: the parts (id, label, weight), the current part, progress within it (0 to 1), a holding flag, the accessible label, reduced motion; `aria-valuetext` is the current part's label; no clock. The brief's Step 4 item 2 (three parts, weights 1, 2, 3, "your clock drives the line") agrees. The brief does not say what it passes for the holding flag or for reduced motion. Lane 59 amendment 14 requires "Respiration" (and « Silence » for line 11) to stay whole at 390 px in French; the brief's picture list (L127) shows the test fry mid-run in French but does not ask for that check.

Lane 59 function that lane 60 imports

9. The brief (L57) says line 5b is "computed by the same function, which lane 59 writes and you import". Lane 59's r3 Step 6 and amendment 10 describe a rule (no `surrogate` source, at least one unrecorded vowel, `{vowels}` in `VOWELS` order) and name no module, function, or export. Lane 59 Step 6 is the sixth of its eight steps, but the brief tells lane 60 to do its Steps 1, 2, 3, 5, 6 before lane 59's Step 3 lands (L79); Step 2 of the brief needs that function.
10. Line 5b's words: the brief (L104) says use sheet lines 1 to 14 "character for character". Lane 59 r3 Step 7 amendment 2 (ratified by Dann 2026-11-16 01:28) changes line 5b to "… Ilya works out the other {m} from your own vowels." and « … Ilya déduit les {m} autres de vos propres voyelles. ». The uploaded `sheet-english_r2` still reads "from your own six" (line 5b) and `sheet-french_r1` « de vos six ». The brief does not mention the amendment.
11. `{m}`: lane 59's `{m}` is ten less the head's count (`sungSet`); the brief's pane uses `usableReadingCount` (section 3.2).
12. The counted forms: lane 59 §9 says the desk sends "the ratified forms" as an amendment; the brief (L104) points to "counted forms at the end of each" sheet file. Neither uploaded sheet has them.

Plan r4

13. Notices: plan r4 section 4.8 moves them to the foot of the Drawer; section 8 D15's default is "after the release"; plan section 7.2 lists "the notices" among lane 60's slice 2 files. The brief keeps them (D15), which is the plan's default; nothing in the brief says Dann ruled.
14. The command list: plan 7.1 includes "set a characteristic"; the brief's list (L46) has "set the voice type, set an own answer" and not a characteristic write. The floor keeps the characteristics screen in the wizard, so none is needed.
15. Doors: plan 4.1 names "Sing your vowels", "Carry on singing", "Sing a vowel again"; the brief uses the sheet r2 words ("Record ..."), which came later (Dann 01:13). Not a conflict.
16. The legend: plan 4.5 item 6 "the legend's four lines"; the brief (L90) sends line 26b to lane 59. Consistent. The brief's Step 5 item 5 "placeholder is the one word... the roster's 'Estimated' leaves use" agrees with plan D2's default.
17. Plan 4.3: "On a voice with readings it opens the capture screen on the next vowel ... or on [i] when all ten are sung". The brief (L47) says "the next vowel by `chart/tour.ts`"; the function is `openTour` in `chart/opening.ts:19`, which calls `nextVowel` in `chart/tour.ts`.
18. Plan 7.1 says the doors are refused "only while a take runs" and the switcher is inert only while a take runs; the brief agrees. The signal is missing (section 2.3, item 6).
19. Plan 7.1: "A new callback closes the takeover from Finish". `onComplete` already exists (section 2.3, item 7).

## Could not establish

- Dann's quotations of 2026-11-16 (L27 to L30 of the brief; the clone's INBOX ends 2026-11-15 23:54).
- "Decided 2026-11-16 00:4x" for D1, D4, D5, D14, D15, D16 (plan r4 marks them defaults).
- Whether a real clothing or hand rustle is rejected by `det.accept`: only synthetic bursts and clicks were tried (section 4.4).
- Whether "eight states" means the seven sentence states plus the first-launch form, and the counted forms for one vowel left (missing from both uploaded sheets).
- Whether stored readings of shape D (f1 of 0) or E (an estimate) exist in real profiles, and whether any stored voice type falls outside `TIER1`.
- How many lines Step 1 and Step 2 add to the wizard (ceiling headroom is 1).
- The sheet French line 26 (the marks' words): absent from the uploaded copy; the brief (L104) cites "lines 1 to 14, 25, 26, and 30" of the French sheet.
- Who ends a running test fry on Back, and what the singer sees on success of the test fry: the brief's Step 4 item 3 specifies the failure screen (line 13, Try again, Continue) and the acceptance test, and not the screen shown on acceptance, nor the fate of `calib.readiness.complete`, `.marginal`, `.quiet`, `.prepareLede`, `.captureLede`, `.captureAria`, `.noFry`, or the room toast (`snrMarginal`, `CalibrationWizard.svelte:720`).
