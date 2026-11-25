# Read: N.204 phase 1b, unit j (`apps/web/src/lib/voice/`, less `engine/` and `chart/`)

Fable, 2026-11-25. Read-only. Nothing was written to the tree, and no `.bak` was created.
Filed verbatim by the desk. **Desk note on scope:** the brief said "every source file in it, read whole", which over-asked. Plan r10's own table assigns the tests to unit t, so the 19 unread test files are not a shortfall against the plan. The brief's wording was the desk's error.

## 0. What was read, and what was not

- **Tree.** The brief names `Shane` at `65196e65`. The tree's HEAD is `66dfb5f9` ("N.221: lane 88 merged..."), one commit later. `git --no-optional-locks diff --stat 65196e65 HEAD -- apps/web/src/lib/voice` printed nothing, so unit j is identical at both (ran).
- **Read whole, all 29 non-test source files (5,453 lines):** the 17 `.ts` modules and 12 `.svelte` components listed in section 4's table.
- **One exception inside a file I otherwise read whole.** `VowelCapture.svelte:470-814` (the style block) was read through a filter that dropped layout-only declarations (display, margin, padding, and similar) and kept every selector, comment, colour, border, and font line. Lines 1-469 were read unfiltered. No layout finding for that block is claimed.
- **NOT REACHED: the 19 test files (2,281 lines).** `VowelCapture.test.ts`, `capture-ritual.test.ts`, `characteristics-pairs.test.ts`, `count-in.test.ts`, `intake-answers.test.ts`, `intake-symbols.test.ts`, `note-picker.test.ts`, `outside-igh.test.ts`, `outside.test.ts`, `plausibility-keeps-status.test.ts`, `profileStore.test.ts`, `readiness-view.test.ts`, `scroll-top.test.ts`, `seam.test.ts`, `take-line.test.ts`, `takes.test.ts`, `visit.test.ts`, `voiceTypes.test.ts`, `vowel-names.test.ts`. Stopped for the 180,000 budget. Case count only (ran: 199 `it`/`test` calls). Where a finding names a test as its proof, the test's existence is from the file list and case count, not from reading it.
- Governing documents read: plan r10 sections 1, 2, 3, 4a, 5b, and 6; `docs/memory/OPEN.md:4587-4643` (the model).

Terms: "tier" is the plan's. Refactoring names are Fowler's. Names Fable coined are marked (coined).

## 1. Behaviour defects (tier 4), ranked by what a singer meets

1. **A duplicated voice loses its voice type, range, tessitura, passaggio, and intake.** `createVoice` builds the copy from `formants` alone (`CalibrationWizard.svelte:415-423`, called by `duplicateActiveVoice` at `:431-435`). The copy lands on the summary because it has readings (`:427`), and the voice-type question is asked only on Welcome (`:334`), so nothing asks again. A bass who duplicates his voice for a style variant gets a copy with no declared type: the note picker's clef falls back to the pitch rule (`note-picker.ts:105-108`), and the guard routes with no type (`CalibrationWizard.svelte:293`). `takes.ts:10` says "Duplicating a voice copies formants only" about takes; whether dropping the singer's own statements was intended is NOT ESTABLISHED. Proof for a fix: a new characterization test on a pure `duplicateVoice(v, name)` (coined) lifted to `profileStore.ts`.
2. **Sage hover and focus inside the lavender VOICE surfaces.** `.wizard-hold-actions button:hover` (`CalibrationWizard.svelte:1093-1096`), `.ps-verbs button:hover` (`ProfileSwitcher.svelte:470-473`), `.ps-input:focus` (`:504-507`), `.vt-text:focus` (`VoiceTypeIntake.svelte:205-208`), `.outside-actions button:hover` (`OutsideNote.svelte:89-92`) all take `--sage` or `--sage-ink`. Plan section 4a quotes the rule that sage names the words and lavender names VOICE; the same files say lavender is the family here (`CalibrationWizard.svelte:1012-1016`, `ProfileSwitcher.svelte:508-513`). A singer sees a green outline in a lavender pane. Read in the plan's quotation, not at `app.css:33-41` itself.
3. **The summary's note names vowels in a different order from the ten buttons.** The note and its Re-take pass walk `ALL_VOWELS`, the seven then the three (`CalibrationWizard.svelte:103-105`, `:331`, `:865`); the buttons walk `VOWELS`, Grayson's order (`VowelCapture.svelte:338`, `engine/types.ts:26`). `outside.ts:17` calls the order "the roster's", and the roster is gone (`CalibrationWizard.svelte:529`).
4. **Keep and "Use Ilya's estimate for now" move the calibration date though they change no number.** Both call `persist()` (`CalibrationWizard.svelte:670`, `:681`), which sets `calibratedAt` (`:394`); `outside.ts:7-8` says Keep "changes no number", and `finish` avoids `persist()` for exactly this reason (`:690`). INSIGHTS prints that date (`profileStore.ts:86-88`).
5. **Start over stamps a calibration date on a voice with no readings.** `confirmReset` empties the profile and calls `persist()` (`:696-701`, `:394`). Whether any page prints the date for an empty voice is NOT ESTABLISHED (outside this unit).
6. **Two voices can carry one name.** Rename and Duplicate accept any text (`ProfileSwitcher.svelte:103-111`, `CalibrationWizard.svelte:447-452`); only the offered default avoids collisions (`:240-245`). The switcher list then shows two identical rows told apart by date alone (`ProfileSwitcher.svelte:292-293`).
7. **A take could hang in "listening" if the session ever completes without `onStableFry`.** `onComplete` stores `pending` and `maybeDeliver` waits on `clockDone`, which only the sweep sets (`capture-ritual.svelte.ts:262-266`, `:282-289`, `:293`). Whether `engine/live.ts` can do that is NOT ESTABLISHED: it is unit i. Only that `onStableFry` is called at `live.ts:609` was seen.
8. **Deleting the active voice activates the first voice, not a neighbour** (`CalibrationWizard.svelte:461-462`). Taste; noted, not ranked higher.

## 2. Findings (tiers 1 to 3)

Each: anchor; smell; refactoring; tier; risk; proof.

**CalibrationWizard.svelte (1,124 lines; "at its line ceiling" per `seam.ts:5-6`)**

- F1. `store`, the seven mutators, and the three passes. Smell: Large Class; the component is the voice repository, the readiness driver, the guard boundary, and four screens. Refactoring: Extract Class to a `voice-store.svelte.ts` (coined) holding `store`, `profile`, `persist`, `persistStore`, `setOwn`, `setCharacteristic`, `recordReadiness`, `recordTake`, create/duplicate/select/rename/delete (`:234-466`, `:564-576`). Tier 3. Risk: medium; `$state.snapshot` timing and the two publish effects (`:720-750`). Proof: `seam.test.ts`, `profileStore.test.ts`, plus a new characterization test of the seam's ten commands before the move.
- F2. `store.voices.find((x) => x.id === store.activeId)` seven times (`:370`, `:385`, `:391`, `:448`, `:565`, `:574`, `:697`) beside `activeVoice` (`:235`). Duplicated Code. Extract Function. Tier 1. Low. Proof: existing suite.
- F3. `profile = { ...v.formants }; resetFlow(hasAnyReadings(profile) ? 'summary' : 'welcome'); persistStore()` three times (`:426-428`, `:442-444`, `:463-465`). Duplicated Code. Extract Function `activate(v)` (coined). Tier 1. Low.
- F4. `import FrSym` (`:45`) is unused: no `<FrSym` in the file (ran, grep). Dead code. Remove. Tier 1. None. Proof: `svelte-check`.
- F5. `onVowelCaptured` prop (`:125-126`, "so a future parent can subscribe"); no caller passes it (ran, grep over `src`). Speculative Generality. Remove Dead Code, with the call at `:656`. Tier 1. Low.
- F6. `DEFAULT_VOWELS`, `CHALLENGING_VOWELS`, `ALL_VOWELS` (`:103-105`) exist to order one note (`:331`), and `DEFAULT_VOWELS` repeats `TOUR_SEVEN` (`chart/tour.ts:10`). Duplicated Code. Replace with the imported constant; the order question is defect 3. Tier 1 once defect 3 is ruled.
- F7. `.wizard-phase` is declared twice (`:904-910`, `:952-955`). Consolidate. Tier 1. None.
- F8. `guardSessionId` (`:278-281`) repeats `newVoiceId`'s UUID-with-fallback (`profileStore.ts:201-210`). Duplicated Code. Tier 1. Low.
- F9. `after` and `timers` (`:542-556`) serve one caller, the toast (`:635`). Inline or keep; tier 1, optional.
- F10. `readinessStep` value `'unmeasured'` now means only "no microphone" (`:473-474`). Mysterious Name. Rename to `'no-mic'`, matching `FryView` (`readiness-view.ts:23`). Tier 1. Low.
- F11. `snrMarginal` (`:496`) reads `room.lively`. Mysterious Name. Rename `roomLively`. Tier 1.
- F12. Line `:68` is mis-indented. Tier 1.

**VowelCapture.svelte (814)**

- F13. `onRolledBack` and `onFailed` props (`:55-56`, `:74-75`) are never passed by the only mount (`CalibrationWizard.svelte:858-859`). Speculative Generality. Tier 1. Whether the tests pass them is NOT ESTABLISHED (tests unread).
- F14. The unshared-visit branch (`:140-145`, `:148`, `:195`) is unreachable in the app: the wizard always passes `visit` (`CalibrationWizard.svelte:859`). Dead path or test seam; NOT ESTABLISHED which. Tier 1 if dead.
- F15. `ritual.destroy(); ritual.closeTicks()` (`:194`): `destroy` already closes the ticks (`capture-ritual.svelte.ts:345`). Redundant call. Tier 1.
- F16. `showReading && reading && !hiding` (`:308`): `showReading` already holds `!!reading` (`:227`). Tier 1.
- F17. `.vowel-btn.placed { border-style: solid; }` (`:603-605`) restates the base rule (`:601`). Dead CSS. Tier 1.
- F18. `.visually-hidden` is defined in four files (`CalibrationWizard.svelte:934-944`, `VowelCapture.svelte:439-449`, `NotePicker.svelte:382-392`; the fourth use is in-file). Duplicated Code. Move to `app.css` as one utility. Tier 2. Low; scoped-style specificity.

**capture-ritual.svelte.ts**

- F19. `SWEEP_MS = 3000` (`:32`) and `WAIT_FILL_MS = 1000` (`:39`) copy `SWEEP_S` and `GATE_WINDOW_S`, private at `engine/live.ts:111` and `:105`. Duplicated fact with no check. Export the engine's constants and derive, or pin with a test. Tier 2. Low.
- F20. Two stacked doc comments at `:190-191`; the first belongs to `update` (`:196`). Tier 1.
- F21. `ERROR_KEY`'s three microphone codes (`:101-106`) repeat `MIC_CODES` (`readiness-view.ts:27`). Duplicated fact. Extract Constant to `engine/errors` (unit i's file). Tier 2.

**profileStore.ts**

- F22. `write`'s quota test (`:332-338`) is a declared copy of `reasonFor` (`library/driver.ts:186-187`), kept so `voice/` does not import the vault (`scripts/ratchets.mjs:81` allows `voice` only `reader` and `score`). Legitimate; pin both with one shared test rather than move. Tier 1 (test only).
- F23. `validVoice` (`:226-238`) checks the envelope and nothing inside `formants`; `loadStore` casts `JSON.parse` (`:251`). Risk noted, not a defect shown. A characterization test with a malformed `formants` entry is the cheap proof.
- F24. `assignToVoice`'s cast (`:153`). Acceptable; no action.

**The rest**

- F25. `ProfileSwitcher.svelte`: the `disabled` prop (`:41`, `:58`), its effect (`:128-130`), and `.ps-header:disabled` (`:386-389`) are dead: the one mount passes no `disabled` (`components/Drawer/VoicePane.svelte:65-75`), and `seam.ts:8-9` records why none is needed. Remove Dead Code. Tier 1. Low.
- F26. `ProfileSwitcher.svelte:207-216`: `toLocaleDateString` on a bad date returns "Invalid Date" and does not throw, so the `try` guards nothing. Tier 1.
- F27. `note-picker.ts:168-170`: `pitchName` ignores `_language` and returns `pitchLabel`. The comment (`:159-167`) carries the ruling that both languages write a pitch alike and that the parameter stays on purpose. Keep; it is called across `insights/` (ran, grep). No action.
- F28. `ALTER_GLYPH` (`note-picker.ts:135-143`) and `ACC_TEXT` (`NotePicker.svelte:155`) hold the same four glyphs, cross-referenced by comment. Move `ACC_TEXT` to import `ALTER_GLYPH`. Tier 1.
- F29. `clefForVoiceType` special-cases `countertenor` by string (`note-picker.ts:55`) ahead of `bucketFor`. Documented (`:49-52`). Keep; pin with the existing `note-picker.test.ts`.
- F30. `readiness-view.ts:24`: `FryView.why` is not read by the wizard (`CalibrationWizard.svelte:603`). Whether a test reads it is NOT ESTABLISHED. Tier 1 if unused.
- F31. The option, legend, hint, and clear recipes are copied across `IntakeScale.svelte:50-92`, `InsightsShares.svelte:68-106`, `VoiceTypeIntake.svelte:145-222`, `VoiceTypeFirst.svelte:51-111`, and `DescribeVoice.svelte:131-147`, each naming the other in a comment. Duplicated Code. Extract shared classes to one stylesheet or `app.css`. Tier 2. Low; visual baseline screenshots are the proof.
- F32. The banner and pill-button recipe is copied between `CalibrationWizard.svelte:1060-1096` and `OutsideNote.svelte:50-92`. Same refactoring, same tier.
- F33. `TakeLine.svelte:101-117`: the reduced-motion rules exist twice, by class and by media query. Keep one; the class is the one the prop drives. Tier 1.
- F34. `seam.ts:75`: `requestRefused(phase: string, ...)` takes a bare string for the wizard's `Phase`. Export `Phase` from `seam.ts`. Tier 1.

## 3. The paragraph a developer needs

This folder is box 6 of the model, "the voice": what Ilya has heard of a singer, and the singer's own statements. Start at `seam.ts`. `CalibrationWizard.svelte` owns the voices and every write to them; it is mounted once, in `routes/+page.svelte:3928`, stays mounted while hidden, and publishes one `VoiceSeam` object that `components/Drawer/VoicePane.svelte` uses to draw the pane at rest (`ProfileSwitcher`, `VoiceTypeIntake`, `DescribeVoice`, `InsightsShares`). The takeover has four phases: Welcome, the test fry, the capture screen (`VowelCapture.svelte`), and the summary. One take is `capture-ritual.svelte.ts` on `count-in.ts`'s clock, drawn by `TakeLine.svelte`; the microphone's lifetime is `visit.ts`. Storage is `profileStore.ts` (localStorage, key `shane.profiles.v2`, never rename it). Almost every decision is a small pure module with a test beside it (`outside.ts`, `readiness-view.ts`, `voiceTypes.ts`, `note-picker.ts`, `intake-answers.ts`), because the tree has no DOM test environment (`readiness-view.ts:3-4`). Two dates matter: `updatedAt` moves on every write, `calibratedAt` only through `persist()`. `voice/` may import only `reader` and `score` (`scripts/ratchets.mjs:81`), which is why three helpers are deliberate copies. The signal processing and the chart are next door in `engine/` and `chart/`.

## 4. Hidden relationships (no import shows them)

1. **Two clocks agree by copy.** `SWEEP_MS` and `WAIT_FILL_MS` against `engine/live.ts:111`, `:105` (F19).
2. **Three statements of 2, 4, 2, 4.** `count-in.ts:13-17` (ms), `take-line.ts:14` (weights), and `SWEEP_MS` plus the wait for the fourth part. The test fry's weights 1, 2, 3 (`CalibrationWizard.svelte:491-493`) stand for `READINESS_PREP_MS` 2100 and `READINESS_CAPTURE_MS` 3000 (`engine/readiness.ts:133-134`).
3. **`persist()` versus `persistStore()`.** Only `persist()` moves `calibratedAt` (`CalibrationWizard.svelte:390-396`). Every author of a new write must choose; defects 4 and 5 are wrong choices.
4. **`saveStore` is handed a snapshot** (`:345-347`), so its quota path deletes takes from the snapshot (`profileStore.ts:317-318`) and the live store keeps them and retries on every later save.
5. **Cue keys are strings shared by three files**: the ritual emits them (`capture-ritual.svelte.ts:54-56`, `:245-247`), `chart/screen-logic` words them (`cueText`, `staysAfterTake`, used at `VowelCapture.svelte:152`, `:219`), and `i18n.ts` holds them. No type joins them.
6. **`plausibilityOverride` means "kept"** and is read by two notes (`outside.ts:8`, `:25`, `:37`).
7. **`hasAnyReadings` and `usableReadingCount` differ on purpose** (`profileStore.ts:174-198`).
8. **The visit hooks handshake.** A `captureKey` remount mounts the new screen before the old unmounts, so the old passes its own hooks object back (`VowelCapture.svelte:146-147`, `:194`; `CalibrationWizard.svelte:859`).
9. **Ordering on unmount.** `ritual.destroy()` before `visit.destroy()`, or a CANCELLED take record lands on another voice (`visit.ts:90-97`).
10. **The ritual assumes `onStableFry` precedes `onComplete`** (defect 7).
11. **`BORROWED_STAFF` mirrors `standInBucket`** in `engine/stand-ins.ts` (`voiceTypes.ts:100-108`), by comment only.
12. **`.vt-first { order: 1 }` depends on being a flex child of the wizard's `.wizard-phase`** (`VoiceTypeFirst.svelte:82-90`, `CalibrationWizard.svelte:904-910`).
13. **`VowelCapture`'s 484 px equals `CHART_W`** in `chart/model.ts` (`VowelCapture.svelte:429-432`).
14. **`MIDDLE_LINE` copies the score-parser's staff renderer** (`note-picker.ts:9-11`, `:34-37`), and `VISIBLE_STEPS = 15` encodes the picker's 150 by 136 box (`:86-91`, `NotePicker.svelte:120-124`).
15. **The storage keys are frozen** (`profileStore.ts:72-75`).

Candidates to become checks first (plan section 3): 1, 2, 10, 11, and 14.

## 5. Comment census

From an awk pass over the 29 files (ran; approximate, it misses trailing same-line comments): **about 1,336 comment lines in 5,453 source lines, 24 percent.** Largest: `CalibrationWizard.svelte` 347, `profileStore.ts` 156, `ProfileSwitcher.svelte` 114, `note-picker.ts` 91, `NotePicker.svelte` 74, `VowelCapture.svelte` 73, `voiceTypes.ts` 67, `capture-ritual.svelte.ts` 62. Blocks were not counted exactly; the blocks below are the ones judged against section 3's test.

**False today (fix or remove):**
- `CalibrationWizard.svelte:128-129` and `:690`: "Done on the characteristics screen". That screen left the takeover (`:112`).
- `:9-11`: "plus the skippable Voice characteristics phase behind the summary". Gone (`:112`).
- `:163-170`: an orphan doc block, half overwritten, attached to no prop.
- `:892-895`: describes padding that is now `0`. `:912-914`: describes an accordion that is gone. `:1056-1058`: heads no rules. `:1042-1048`: names "Add voice characteristics", gone.
- `ProfileSwitcher.svelte:3`: "the drawer header above the calibration wizard"; it is in the pane at rest (`CalibrationWizard.svelte:789`). `:22-23`: "inert during an active capture ... driven by the wizard's phase"; nothing passes `disabled` (F25).
- `outside.ts:17`: "the roster's" order.
- `VoiceTypeIntake.svelte:3-5` and `VoiceTypeFirst.svelte:8-10`: "Voice characteristics step"; it is a station of the pane now.
- `profileStore.ts:332`: accurate on `reasonFor` (`driver.ts:186`); kept.

**Tombstones and build history that curate nothing for a cold reader (remove):** `CalibrationWizard.svelte:18-31`, `:41`, `:74-75`, `:106-110`, `:336-343`, `:774-787`, `:923-926`; `vowel-names.ts:4-23` down to about four lines; `profileStore.ts:4-13` (v1 history; keep one line on migration); `ProfileSwitcher.svelte:137-162` and `:179-195`, which are sound reasoning at four times the length a reader needs; `note-picker.ts:73-79`.

**Stay, with their dates:** every block carrying a ruling in Dann's words, for example `CalibrationWizard.svelte:95-102` (none of the ten is optional), `count-in.ts:5-7`, `visit.ts:2-4`, `readiness-view.ts:2-10`, `capture-ritual.svelte.ts:9-23`, `voiceTypes.ts:116-124`, `ProfileSwitcher.svelte:256-259`, `FrSym.svelte:10-13`, `note-picker.ts:43-53` and `:159-167`.

**NOT ESTABLISHED:** whether `CalibrationWizard.svelte:796-797` and `:803-805` ("Placeholder: the newcomer fry-description copy is deferred") are still true; the string exists, its status is in `i18n.ts`, outside this unit.

**Tally (estimates, by the ranges above):** about 165 comment lines marked for removal or compression, about 92 of them in `CalibrationWizard.svelte`, about 35 in `ProfileSwitcher.svelte`, about 16 in `vowel-names.ts`, about 15 in `profileStore.ts`. About 6 lines to add, counted separately: one each at hidden relationships 1, 3, 4, 10, 12, and the order of `ALL_VOWELS` if it stays.

## 6. Duplication census (a fact with two or more homes)

| fact | homes |
|---|---|
| The sweep is 3.0 s | `capture-ritual.svelte.ts:32`; `engine/live.ts:111` |
| The gate window is 1.0 s | `capture-ritual.svelte.ts:39`; `engine/live.ts:105` |
| The take is 2, 4, 2, 4 | `count-in.ts:13-17`; `take-line.ts:14` |
| The seven tour vowels | `CalibrationWizard.svelte:103`; `chart/tour.ts:10` |
| Microphone error codes | `capture-ritual.svelte.ts:102-104`; `readiness-view.ts:27` |
| The quota test | `profileStore.ts:336`; `library/driver.ts:187` |
| UUID with fallback | `profileStore.ts:201-210`; `CalibrationWizard.svelte:278-281` |
| Plain-text accidentals | `note-picker.ts:135-143`; `NotePicker.svelte:155` |
| The middle staff line per clef | `note-picker.ts:34-37`; the score-parser's staff renderer (named at `note-picker.ts:10`, not read) |
| The picker's box, 150 by 136, middle 68 | `NotePicker.svelte:120-124`; `note-picker.ts:86-91` |
| Borrowing types and their staves | `voiceTypes.ts:104-108`; `engine/stand-ins.ts` `standInBucket` (named at `voiceTypes.ts:101`, not read) |
| Countertenor is a treble voice | `note-picker.ts:55`; `engine/plausibility.ts` `bucketFor` leaves it in `union` (per `note-picker.ts:50-52`) |
| The symbol convention, upright subscript at 0.78em | `FrSym.svelte:28-32` (which calls itself "the single source", `:4-5`); `IntakeScale.svelte:45-49`; `intake-symbols.ts:30-35` |
| `.visually-hidden` | `CalibrationWizard.svelte:934-944`; `VowelCapture.svelte:439-449`; `NotePicker.svelte:382-392` |
| Radio-option, legend, hint, clear recipes | `IntakeScale.svelte:50-92`; `InsightsShares.svelte:68-106`; `VoiceTypeIntake.svelte:145-222`; `VoiceTypeFirst.svelte:62-111`; `DescribeVoice.svelte:131-147` |
| Banner and pill buttons | `CalibrationWizard.svelte:1060-1096`; `OutsideNote.svelte:50-92` |
| The text-field recipe | `ProfileSwitcher.svelte:493-507`; `VoiceTypeIntake.svelte:194-208` |
| The primary lavender button | `CalibrationWizard.svelte:1017-1024`; `ProfileSwitcher.svelte:514-528`; `VowelCapture.svelte:645-652` |
| Reduced-motion media read | `CalibrationWizard.svelte:482-488`; `VowelCapture.svelte:187-190` |
| Reduced-motion fill rules | `TakeLine.svelte:102-108`; `:109-117` |
| "active voice" lookup | `CalibrationWizard.svelte:235` and seven inline copies (F2) |
| The landing rule | `seam.ts:65-68` (one home; `CalibrationWizard.svelte:427`, `:443`, `:464` restate its summary-or-welcome half inline) |
| The intake defaults (`'two'`, imagery on, topics on) | `intake-answers.ts:21-23`; `InsightsShares.svelte:24`, `:48`, `:56` |

## 7. Token table (plan section 4a)

`census-colour-tokens.mjs` is at `docs/sessions/`, not yet in `scripts/` (ran `ls`). It prints totals only: 296 literals, 174 MIGRATE, 122 judgement, 51 files on this tree (ran), against the plan's 299. The table below is from Fable's own reading. Token values checked at `app.css:28` (`--ink-primary: #1a1612`), `:74` (`--stone-300: #d6d3d1`), `:79` (`--paper-light: #F5F1E8`). No white token was found in a grep of `app.css`.

**Colour literals: 20.**

| path:line | literal | class | reason |
|---|---|---|---|
| `NotePicker.svelte:263`, `:271`, `:275`, `:279` | `#1a1612` | MIGRATE to `--ink-primary` | exact value |
| `VowelCapture.svelte:529`, `:753` | `#f5f1e8` as a `var()` fallback | MIGRATE: drop the fallback | the token exists |
| `VowelCapture.svelte:728` | `#d6d3d1` as a `var()` fallback | MIGRATE: drop the fallback | the token exists |
| `CalibrationWizard.svelte:1019`; `VowelCapture.svelte:608`, `:651`; `ProfileSwitcher.svelte:522` | `#ffffff`, text on `--lavender-jewel` | NEEDS A TOKEN: `--ink-on-jewel` (coined), ink tier | white on a filled button is thematic; a dark skin needs it |
| `CalibrationWizard.svelte:1089`; `ProfileSwitcher.svelte:434`, `:466`, `:502`; `NotePicker.svelte:332`; `VoiceTypeIntake.svelte:203`; `OutsideNote.svelte:84`; `VowelCapture.svelte:516` | `#ffffff`, a control or panel surface | NEEDS A TOKEN: `--surface-control` (coined), paper family | a raised white field on the drawer; `--paper-cream` is `#ffffff` only inside the override at `app.css:236`, so it is not a safe match |
| `VowelCapture.svelte:654` | `#9a8fa6`, disabled Start | NEEDS A TOKEN: `--lavender-disabled` (coined), lavender family | a muted lavender; no token holds it |

None is LOCAL BY RIGHT.

**Hard-coded `font-family`: 4.**

| path:line | value | class |
|---|---|---|
| `CalibrationWizard.svelte:929` | `'Lato IPA', sans-serif` | NEEDS A TOKEN: `--font-ipa` (coined), the one IPA token the plan asks for |
| `VowelCapture.svelte:486`, `:596`, `:761` | `'Lato IPA', 'Source Sans 3', sans-serif` | same token; note the two stacks differ |

LOCAL BY RIGHT: `NotePicker.svelte:222`, `:226`, `:262`, `:270`, `:292` set `font-family` from `font.family`, the loaded notation font, which is data and not a theme.

**Focus ring.** No token. `VowelCapture.svelte:616-623` and `:709-712` draw it in `--ink-primary`; `ProfileSwitcher.svelte:504-507` and `VoiceTypeIntake.svelte:205-208` draw it in `--sage` on `:focus`; `app.css:210-213` sets a global sage `:focus-visible`. Three practices in one pane. NEEDS A TOKEN: `--focus-ring` (coined); see defect 2.

## 8. Against the model

Unit j sits in box 6 and in CONTROLS. Two points for step 5:
- The model says the work never depends on a view. Here the voice's store lives inside a view component (`CalibrationWizard.svelte:234`), and the pane reaches it only because that component stays mounted (`seam.ts:4-5`). F1 is the repair.
- "Borrowed from the nearest voice it can defend and said on the page to be borrowed" is met in this unit by `voiceTypeBorrowingNote` and `borrowedStaffLabel` (`voiceTypes.ts:126-145`), one function for both pickers.

## 9. For the desk's estimates table

- Tool uses: 17, counting the hand-back.
- Tokens: not metered from inside the subagent session; its own estimate is 170,000 to 178,000, at the cap. **Harness count: 180,000 cap, actual to be added by the desk.**
- Elapsed minutes: NOT ESTABLISHED; no clock reading was taken at the start.
- Nothing from memory was used as a claim in this report.
