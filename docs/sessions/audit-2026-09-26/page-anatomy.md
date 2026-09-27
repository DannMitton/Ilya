# apps/web/src/routes/+page.svelte — anatomy map (phase 0 baseline)

Read at `/home/claude/ilya`, branch `Shane`, HEAD `b7c2fc6`, working tree clean
(verified: `git status --porcelain` empty before and after this read). File is
6,225 lines total; `<script lang="ts">` runs line 1 to `</script>` at line
4370 (confirmed by `grep -n "^<script\|^</script>"`), 77 `import` statements
(confirmed: `grep -cE "^\s*import " +page.svelte` = 77). This is a map for a
later refactor. No file was edited to produce it.

This is a map, not a full trace: every line range below is real (from grep
line numbers on the actual file), but the "what it does" descriptions are
read from the surrounding code and comments at that line, not a full
line-by-line audit of the whole 4,370-line script. Anything not directly
quoted or greppable is marked NOT ESTABLISHED.

## Section map (line ranges, script only)

| Lines | Region | Owns ($state) | Notes |
|---|---|---|---|
| 2–95 | Imports (77 statements) | — | pipeline, pairings, correction, entry, loupe, library, i18n, destinations, metadata-provenance, text-diff, one-action |
| 96–261 | Boot state: engine check, dictionary loader, language, `data.opened`, `doc` (SongDocument) | `loaderState`, `language`, `doc` | `doc` is the per-song state object (poem, metadata, glosses, pairings) per the N.67 comment at 232–261; page reads/writes `doc.<field>` rather than storage directly |
| 262–365 | Transcription result state, drawer/calibration flags, destination/studioDocument split, Shane voice state, ingested score | `lines`, `transcribeError`, `transcribeMs`, `selectedWord`, `lastFocusedWord`, `drawerRaised`, `calibrating`, `destination`, `studioDocument`, `shaneFormants`, `shaneVoiceName`, `shaneCharacteristics`, `shaneVoiceUpdatedAt`, `shaneIntake`, `ingestedScore`, `orphanedCount`, `noLyricsFile` | `destination`/`studioDocument` pair (338–339) replaced a single `TabId` per an N.73 comment |
| 389–564 | Score/poem slot-queue derivations: `scoreTextQueue`, `poemQueue`, `slotQueue`, `scoreText`, `derivedPoem`, `derivedLines`, `shownPoem`, `shownPairings`, `placedSlotCount`, `cliticFolds`, `blankUnderlay`, `melismaMarks`, `queueExhausted` | (all `$derived`) | Bridges the poem text and the ingested score's syllable slots; feeds Correction and Paper |
| 639–1385 | **Correction Station**: syllable placement (`placeSyllableOnSelected`, `handleNotePick`, `handleLoupePick*`), cursor (`setCursor`, 834), undo/redo (`snapshot`/`restore`/`pushUndo`/`handleUndo`/`handleRedo`, 977–1025), pitch edits (`correct`, `handleStep`, `handleOctave`, `handleSemitone`, `handleAccidental`, `handleBase`, `handleDot`, `handleMove`, `handleDeleteNote`, `handleRestoreNote`, duration-cell handlers, `handleRest`, `handleTie`), tuplets (1331–1385) | `selectedEventId`, `gapAfter`, `armedBase`, `armedDots`, `undoStack`, `redoStack`, `tupletOpen`, `tupletDef` | Largest single cohesive block (~750 lines). Heavy `$derived` cluster at 858–1272 (`scoreClef`, `arrival`, `gapAnchor`, `heldMeasure`, `heldFill`, `heldMeter`, `selectedLabel`, `selectedBase/Dots/Dotted`, `restoreAvailable`, `tieAvailable`, `selectedIsRest`, `selectedTied`) describes cursor/selection state derived from `correctedLine` + `cursor` |
| 1385–1502 | Keyboard handling for the correction surface (`handleCorrectionKey`) | — | Reads `armedBase`/cursor state set above |
| 1502–1781 | **Loupe** (magnifier) mode/visibility, phone-vs-desktop split, measure/gap navigation derivations (`loupeAvailable`, `heldMeasureIndex/Label/Ids`, `nextMeasureIds`, `gapAnchorName`, `readoutLine`, `selectedSignature/Beat`, `loupeNoteLine`), melisma toggling (`handleMelisma`, 1781), dock shift (`handleDockShift`, 1806) | `isPhone`, `phonePortrait`, `loupeOpen`, `loupeSyllablesOpen`, `loupeMode` | Comment at 1546–1556 says the loupe was "never a phone object" and now persists on desktop too (ruling 2026-08-25); effect at 1540 resets loupe mode when closed |
| 1822–2081 | Gesture/tap handling for the page surface: `stackLabel` (undo/redo labels), `handlePageTap`, `dismissLoupe`, `handleSurfacePointerDown/Up/Cancel`, `handlePagesDrawn` | `gestureBeganOnSurface` | Effects at 2017 and 2040 close the loupe on invalid cursor / on phone-drawer-raised |
| 2081–2172 | Portrait/reading view toggle (`showPortraitView`), breath-transition triggers (`triggerPaperBreathIn`, `triggerViewBreathCycle`) | `pageRevision`, `updateDismissed`, `activeHeadingId`, `tabTransitionClass`, `isMobile`, `mainContentEl`, `portraitView` | Effect at 2128 forces `portraitView` back to `'page'` off certain tab/device combinations |
| 2187–2260 | Drawer width calculation (`calculateDrawerWidth`) plus derived UI flags (`showInspector`, `isReadingMode`, `drawerWidth`, `loupeInset`, `canTranscribe`, `hasResults`) | — | |
| 2260–2410 | **Calibration** entry/exit (`enterCalibration`, `exitCalibration`, `openRangeFields`), notation/display preference state, band-state text derivations (`voiceCalibrated`, `wordCount`, `poemLineCount`, `pieceStateText`, `inputStateText`, `notationStateText`, `scoreStateText`) | `calibrationRequest`, `notationPrefs`, `showStressDiacritics`, `spotReconstitution`, `userStressOverrides`, `yoToggles`, `syllableOverrides`, `paperBreathClass`, `viewBreathClass` | `notationPrefs` persisted to localStorage per comment at 2131 |
| 2377–2439 | Underlay derivation (`effectiveLines`, `drawnUnderlay`) plus the two seat-logging effects (2410, 2432) | `seatCountLoggedFor`, `dryRunLoggedFor` — both plain `let` (confirmed at lines 2409 and 2431: `let seatCountLoggedFor: string | null = null;` / `let dryRunLoggedFor: string | null = null;`), not `$state` | Diagnostic-only effects (console logging), no visible DOM write |
| 2439–2523 | **Pipeline**: `runPipeline()` calls `processText` and sets `lines`/`transcribeMs`/`transcribeError` | (writes `lines`, `transcribeError`, `transcribeMs`, `selectedWord`) | Core transcription entry point |
| 2523–2960 | Transcription view/session reset (`resetTranscriptionView`, `resetSessionState`), main `transcribeText()`, text-diff carry-over (`carryOverridesAcross`, `reseatAcross`), `healFrozenSeats`, `handleClear`, `handleClearScore`, `handlePrint`, `handleWordClick`, notation/stress/syllable/gloss change handlers, `keepSurvivingGlosses`, `handleReset` | — | `handlePrint` (2794) is the print entry point; no test exercises it (see coverage map) |
| 3040–3384 | **Text arrival pipeline**: `claimDerivedPoem`, `handlePoemInput`, `handleInput`, `askToReplace` (replace-dialog confirm flow), `cancelQuietTimer`, `joinText` (debounced auto-transcribe), `flushText`, `handleArrival` (score upload arrival), `answerWith`, `seatFilledPoem`, `applyArrival` | `pendingArrival`, `replaceDialogEl`, `keepButtonEl`, `pendingConfirm`, `transcribedText`, `transcribeWhenDictionaryReady` | Effect at 3233 auto-transcribes once the dictionary is ready (`untrack`-guarded) |
| 3384–3576 | Continuation of `applyArrival` (background work), `todayInWords`, storage-quota effect (3565) | `storageReading` | |
| 3576–3750 | **Library/binder**: `writeBinder`, collision handling (`settleCollision`, `askCollision`), `handleImportFile`, `refreshSongs` | `importInputEl`, `binderError`, `binderNotice`, `bootLines` | |
| 3750–3972 | Song switching and CRUD: `switchSong`, `handleNewSong`, `handleRenameSong`, `handleDeleteSong`, `commitDelete`, `restoreFrom`, `attachUploadedSource` | `songs`, `libraryError`, `restoreSource`, `uploaderEl` | `songLibrary` derived object built at 3903 |
| 4009–4103 | Language and metadata handlers: `handleLanguageChange`, `handleMetadataChange`, `nameIfUnnamed`, `setFromScoreFields`, `commitMetadataState`, `handleRevertToScoreHeader`, `handlePullToggle` | (writes `doc.metadata` fields, `language`) | `arrangerProvenance` derived at 4094 |
| 4106–4228 | Tab navigation: `handleTabChange`, `scrollToAnchor`, `handleHeadingNavigate`, `handleReadingContentReady`, `handleHashNavigation` | `readingContentEpoch` | |
| 4172–4370 | IntersectionObserver-based active-heading tracking (two near-duplicate `$effect` blocks at 4190/4196 — the second, longer one appears to be the live one; NOT ESTABLISHED whether the first is dead code or the two serve different purposes; would need a diff read to confirm), phone/mobile detection (`checkMobile`), `onMount` boot sequence: restore tab/section state from localStorage, `joinText('boot')`, `loadDictionary`, resize listener, `handleHashNavigation` | — | `onMount` cleanup removes the resize listener and cancels the quiet timer |

## Markup (post-`</script>`, lines 4371–6225)

Only coarsely mapped (not required by the task to the same depth as the
script): `<div class="screen-only">` at 4404 hosts `<HeaderBar>` (4413);
`<div class="app-content tab-{activeTab} ...">` opens at 4508 and `<main>`
begins at 4983. Full markup breakdown by tab (Transcription/Fit/Learn/Guide
panels, Drawer, Loupe, CorrectionSurface placement) is NOT ESTABLISHED here;
would need a further read pass keyed to `activeTab`/`destination` branches.

## `$effect` inventory

Ten `$effect` blocks total (`grep -c "\$effect(" +page.svelte` = 10; no
`$effect.pre` or `$effect.root` found). Lines: 1540, 2017, 2040, 2128, 2410,
2432, 3233, 3565, 4190, 4196.

Of these, at least six write `$state` (the Svelte docs' "escape hatch" usage,
not pure side-effect-free reactions), two more write a plain (non-reactive)
`let`, and one writes only a DOM attribute:

- **1540**: writes `$state` `loupeMode`, `loupeSyllablesOpen`
- **2017**: writes `$state` `loupeOpen`
- **2040**: calls `dismissLoupe()`, which (per its definition at 1966) writes loupe `$state`
- **2128**: writes `$state` `portraitView`
- **2410**: writes the plain `let seatCountLoggedFor` (not `$state`; gates a `console.info` call, no state or DOM visible to the user)
- **2432**: writes the plain `let dryRunLoggedFor` (same pattern)
- **3233**: writes `$state` `transcribeWhenDictionaryReady` (via `untrack`) and calls `joinText`
- **3565**: writes `$state` `storageReading` (async, off `readStorageEstimate()`)
- **4196**: writes `$state` `activeHeadingId`

One effect (**4190**) writes only `document.documentElement.lang`, a DOM
attribute rather than app state of any kind.

## Candidate extraction seams, ranked by independence and risk

1. **Correction Station (lines ~639–1502), lowest risk to extract first.**
   Cohesive: cursor, undo/redo stack, pitch/duration/tuplet editing all read
   and write a self-contained state cluster (`selectedEventId`, `gapAfter`,
   `armedBase`, `armedDots`, `undoStack`, `redoStack`, `tupletOpen`,
   `tupletDef`) plus derivations off `correctedLine`/`cursor`. It already
   delegates to `$lib/shane/entry.ts`, `$lib/shane/correction.ts` and
   `CorrectionSurface.svelte` for the heavy logic, so this region is largely
   glue: a strong candidate for a `.svelte.ts` class (e.g. `CorrectionStation`)
   holding those fields and methods, consumed by `+page.svelte` and by
   `CorrectionSurface.svelte` directly.

2. **Loupe orchestration (lines ~1502–1781, plus its dismiss/gesture logic at
   1822–2081), medium risk.** State (`loupeOpen`, `loupeMode`,
   `loupeSyllablesOpen`, `isPhone`, `phonePortrait`) and the phone-vs-desktop
   effects (1540, 2017, 2040) are fairly self-contained, but `handlePageTap`
   and the pointer handlers (1842–2081) also touch `drawerRaised` and general
   page gesture state, so extraction would need to draw a boundary carefully
   between "loupe visibility" and "general surface gestures."

3. **Library/binder/song-CRUD (lines ~3576–3972), medium-low risk.** Mostly
   calls into `$lib/library/*` modules already; the page-level code is
   orchestration (`switchSong`, `handleNewSong`, `handleDeleteSong`,
   `commitDelete`, `writeBinder`, collision handling). A `.svelte.ts` module
   holding `songs`, `libraryError`, `restoreSource` and these methods looks
   extractable with modest risk, mainly around `doc` (the active `SongDocument`)
   being swapped out from under other regions on `switchSong`.

4. **Text arrival / one-action pipeline (lines ~3040–3576), higher risk.**
   `handleInput`, `joinText`, `handleArrival`, `applyArrival` interleave with
   the pipeline (`runPipeline`, `transcribeText`), the correction-carry-over
   logic (`carryOverridesAcross`, `reseatAcross`), and the replace-confirmation
   dialog. This is the most tangled region: it both owns state and reaches
   into `doc`, `lines`, `ingestedScore`, and the correction/loupe state set
   elsewhere. Extraction here would need the arrival pipeline itself
   (`$lib/one-action.ts`, `$lib/shane/*seat*.ts`) as the seam, not a page-level
   split.

5. **Tab/reading navigation (lines ~4106–4267), low risk but low value.**
   Self-contained (`handleTabChange`, `scrollToAnchor`, heading navigation,
   the IntersectionObserver effects) but small; a good "practice" extraction
   rather than a load-bearing one.

6. **Calibration entry/exit (lines ~2260–2410) is a thin shell** over
   `CalibrationWizard.svelte`/`shaneFormants` etc.; likely low effort to pull
   into a small `.svelte.ts` module, but the state (`shaneFormants`,
   `shaneCharacteristics`, ...) is also read by `VoiceProfilePane` and
   `InsightsPane` outside this file, so the seam is the shared voice-profile
   store, not `+page.svelte` alone.

Extraction risk was judged by: how many other regions read/write the same
`$state` fields (cross-region coupling), and whether the region already
delegates its hard logic to a `packages/*` or `$lib` module (meaning the page
code is thin orchestration, safer to move) versus contains the logic inline.
This is JUDGEMENT (my ranking), not derived from a source document; no
comparable ranking exists in the repository's own docs that I read.

## What I read to build this map

- `apps/web/src/routes/+page.svelte` (grep passes across the full file;
  targeted reads at lines 1–261, 220–271 (via sed), 639–1385, 1502–2470,
  2439–2960 headers, 3040–3384 headers, 3576–4103 headers, 4106–4370,
  4300–4370, 4404–4990 headers)
- No other file was needed for this task beyond confirming import targets by
  name (not by reading their contents)
