# The cut list for `+page.svelte` (audit phase 4)

Read at `/home/claude/dannmitton/ilya`, HEAD `561e68e` (confirmed: `git log --oneline -1`,
`git status` clean, read-only session). `+page.svelte` is 6,224 lines total
(`wc -l`, this session): script line 1 to `</script>` at line 4,369
(`grep -n "^<script\|^</script>"`), `<style>` opens at line 5,257, so markup runs
4,370 to 5,256 (887 lines) and style runs 5,257 to 6,224 (968 lines).
`scripts/ratchets.json:8` gives it a ceiling of 6,224, matching the file exactly.

This map does not re-derive `docs/sessions/audit-2026-09-26/page-anatomy.md` from
scratch; it treats it as a lead (its own words, and the outer brief's), re-reads
every line number it borrows, and corrects a uniform +1 line drift found in the
script region (the anatomy was read at `b7c2fc6`; one line was added before line
700 since then, most likely by N.174's renaming pass, and nothing after it removed
a line to compensate until later). Every span below was read this session at the
line numbers given; where I did not re-derive a boundary from scratch (mostly the
markup and style regions, which the anatomy itself calls "only coarsely mapped"), I
say so and mark it NOT ESTABLISHED rather than borrow the anatomy's line numbers
unverified.

## 1. The cut table

| # | Name | Destination | Lines removed (est.) | Risk |
|---|---|---|---|---|
| 1 | The Correction Station | `apps/web/src/lib/score/correction-station.svelte.ts` | ~740 (script only) | Medium |
| 2 | Loupe and dock orchestration | `apps/web/src/lib/score/loupe-station.svelte.ts` | ~545 (script) + markup TBD | Medium |
| 3 | Text arrival pipeline | `apps/web/src/lib/arrival.svelte.ts` (new, top-level, beside `one-action.ts`) | ~500 | High |
| 4 | Library and song CRUD | `apps/web/src/lib/library/library-station.svelte.ts` | ~465 | Low-medium |
| 5 | Tab and reading navigation | `apps/web/src/lib/navigation.svelte.ts` (new, top-level) | ~130 | Low |
| 6 | Drawer content snippets (markup only) | `apps/web/src/lib/components/Drawer/DrawerContent.svelte` (new) | ~470 (markup) | Medium |
| 7 | Calibration entry/exit shell | `apps/web/src/lib/voice/` (existing module) | ~20-40 | Low, low value |

Running estimate after all seven: script down from 4,369 to roughly 1,470 lines;
total file from 6,224 to roughly 5,290 minus whatever of the 887 markup and 968
style lines travel with cuts 2 and 6. **This does not reach 2,000.** See section 3.

## 2. Each cut in detail

### Cut 1: The Correction Station

**Job:** cursor and selection, undo/redo, pitch/duration/accidental/rest/tie
editing, tuplets — the pitch-correction surface's script logic.

**Exact span (script):** `apps/web/src/routes/+page.svelte:710-1466`, from
`function placeSyllableOnSelected` through the closing brace of
`handleCorrectionKey`. Read this session; every function/state line below is a
grep hit at the line shown, this session, against HEAD:

- `placeSyllableOnSelected` `:710`, `handleNotePick` `:745`, `handleLoupePick`
  `:761`, `handleLoupePickGap` `:773`
- `selectedEventId` (`$state`) `:785`; `cursor` (`$derived`) `:825`; `inGap`
  `:833`; `setCursor` `:835`; `armedBase`/`armedDots` `:855-856`
- `undoStack` `:963`, `redoStack` `:975`, `snapshot` `:978`, `restore` `:989`,
  `pushUndo` `:997`, `handleUndo` `:1002`, `handleRedo` `:1010`
- `correct` `:1032`, `handleStep` `:1038`, `handleOctave` `:1047`,
  `handleSemitone` `:1077`, `handleAccidental` `:1089`, `handleBase` `:1104`,
  `handleDot` `:1113`, `handleMove` `:1130`, `handleDeleteNote` `:1137`,
  `handleRestoreNote` `:1167`, `handleDurationCell` `:1192`, `handleDotCell`
  `:1219`, `handleRest` `:1242`, `handleTie` `:1257`
- `tupletOpen` `:1332`, `tupletDef` `:1334`, `openTuplet` `:1341`,
  `closeTuplet` `:1346`, `applyTupletDefinition` `:1351`
- `handleCorrectionKey` `:1386-1466` (keyboard dispatch, wired to
  `<svelte:window on:keydown>` at `:4385`, which cannot move, see section 4)

Excluded on purpose: `handleStartPlacementOver` (`:640-709`) reads `slotQueue`
and calls `seatFilledPoem`, and belongs with the arrival pipeline (cut 3), not
here, even though it sits just above this span; and `correctedScore`
(`$derived.by`, `:1478-1502`) is consumed by the loupe/dock renderer, not by
correction logic itself, so it is placed with cut 2 below. Both are noted as
boundary calls, not settled ones: NOT ESTABLISHED which module should actually
own `handleStartPlacementOver`'s undo push versus its seat call.

**Destination:** `apps/web/src/lib/score/correction-station.svelte.ts`. Fits
the `score` module (already home to `entry.ts`, `correction.ts`,
`CorrectionSurface.svelte`, per `ARCHITECTURE.md`'s codemap and confirmed on
disk: `apps/web/src/lib/score/entry.ts`, `correction.ts`,
`CorrectionSurface.svelte` all exist). A `.svelte.ts` class, per the Correction
Station brief's own instruction (section 2 of
`brief-code-audit-correction-station_r1_2026-09-26.md`) and the Svelte docs'
pattern for shared reactive state.

**Interface:** counted this session by grepping each identifier's total
occurrences in `+page.svelte` against occurrences inside `710-1477`
(`correctedScore` folded in as the boundary):

| Variable | Total refs | Outside the span |
|---|---|---|
| `selectedEventId` | 30 | 7 |
| `cursor` | 28 | 16 |
| `correctedLine` | 21 | 10 |
| `gapAfter` | 13 | 0 |
| `undoStack` | 7 | 1 |
| `redoStack` | 7 | 1 |
| `armedDots` | 5 | 1 |
| `armedBase` | 4 | 1 |
| `tupletOpen` | 4 | 1 |
| `tupletDef` | 4 | 1 |

That is nine `$state` fields plus two heavily-read `$derived` values
(`cursor`, `correctedLine`) the rest of the page needs back, mostly through the
`loupeCorrections` snippet (`+page.svelte:5154-5197`) and the `<Loupe>` call
(`:5199-5229`), which pass `selectedBase`, `armedBase`, `tupletOpen`,
`onundo={handleUndo}`, `onredo={handleRedo}`, and more, straight from this
span. **This is at or just past the brief's ten-variable flag.** It reads as
one cluster today because the loupe/dock markup is the one place nearly all of
it surfaces; splitting the class as `CorrectionStation` (state and pure
handlers) with the loupe-visibility state (cut 2) kept separate, as the
Correction Station brief itself proposes, is the split that keeps each side
under ten.

**Lines removed:** ~740 to 757 (estimate: `1466 - 710 = 756`, minus whatever a
constructor/import preamble in the page adds back; call it 740, an estimate).

**Risk:** Medium. The hard logic already lives in `packages/score-parser`
(phonation/tessitura is untouched by this cut) and `$lib/score/entry.ts` /
`correction.ts`, so this span is mostly glue, per the anatomy's own reading —
but the keyboard dispatch (`handleCorrectionKey`) is wired through
`<svelte:window on:keydown>`, a page-only binding, so event ordering against
the loupe's own dismiss-on-Escape path (`dismissLoupe` inside
`handleCorrectionKey`'s `case 'Escape'`, `:1462`) crosses the cut boundary and
is exactly the kind of thing an 84-screenshot compare would not catch (no pixel
changes, but a dropped keystroke would not show as a visual diff).

**Tests that guard it today:** `apps/web/src/lib/score/correction.test.ts`
(pure logic: `withCorrection`, `applyCorrections`, the correction map, ten
`describe` blocks from `N.92 pitch operations` to `N.128`) guards the
operations this span calls, but not the page's own undo/redo stack or keyboard
wiring. **Grepped this session, zero hits:** neither
`apps/web/e2e/core-loop.test.ts` nor `apps/web/e2e/singer-paths.test.ts`
mentions `undo`, `redo`, `tuplet`, `ArrowUp`, or `CorrectionSurface`. The one
e2e test named "correcting a word" (`singer-paths.test.ts:42`) is the
dictionary-gloss override, an unrelated feature that happens to share the word
"correction". **The pitch/undo/redo/tuplet path has no automated test today;**
the Correction Station brief's own "Done when" (section 6) sends this to
Dann's manual walk, not to Playwright. A unit test for undo/redo on the new
module, as that brief already asks for, is the one thing that should be added
before this ships, not after.

### Cut 2: Loupe and dock orchestration

**Job:** the magnifier's visibility, mode, phone/desktop split, and the
surface's gesture handling (tap, pointer down/up/cancel) that opens and closes
it.

**Exact span:** `apps/web/src/routes/+page.svelte:1478-2047` (script). This
folds in `correctedScore` (`:1478-1502`, the renderer's read-and-corrected
score, consumed here and by `<Paper>`/`<Loupe>`) rather than counting it with
cut 1. Read this session:

- `isPhone` `:1503`, `phonePortrait` `:1505`, `loupeOpen` `:1518`,
  `loupeSyllablesOpen` `:1530`, `loupeMode` `:1537`, the mode-reset `$effect`
  `:1541`, `handleLoupeMode` `:1547`
- `loupeAvailable` `:1562`, `heldMeasureIndex` `:1575`, `heldMeasureLabel`
  `:1586`, `heldMeasureIds` `:1593`, `nextMeasureIds` `:1602`,
  `heldMeasurePositions` `:1618`, `gapAnchorName` `:1627`, `readoutLine`
  `:1636`, `selectedSignature` `:1685`, `selectedBeat` `:1692`,
  `loupeNoteLine` `:1698`
- `handleMelisma` `:1782`, `handleDockShift` `:1807`, `stackLabel` `:1823`,
  `undoLabel`/`redoLabel` `:1831-1832`
- `handlePageTap` `:1843-1966`, `dismissLoupe` `:1967-1980`,
  `gestureBeganOnSurface` `:1981`, `handleSurfacePointerDown` `:1983`,
  `handleSurfacePointerUp` `:1989`, `handleSurfacePointerCancel` `:2010`, and
  the two effects that close the loupe on invalid cursor or on
  phone-drawer-raised, `:2018` and `:2041`

**Markup:** the `{#snippet loupeCorrections()}` block
(`+page.svelte:5154-5197`, wrapping `<CorrectionSurface>`) and the
`{#if loupeAvailable && loupeOpen && cursor}<Loupe ...>{/if}` block
(`:5198-5230`) are the loupe's entire template footprint, confirmed by
grepping `<CorrectionSurface` and `<Loupe` this session (hits at `:5155` and
`:5199`, both inside `4370-5256`). **These two blocks are where almost every
`$state` field from cut 1 surfaces as a prop or callback** (`selectedBase`,
`armedBase`, `tupletOpen`, `onundo`, `onrest`, and so on, all read directly at
`:5155-5196`), which is why cuts 1 and 2 should ship as a pair even though they
are separate modules: whichever ships first has to expose its state to a page
that has not yet moved the other half.

**Style:** NOT ESTABLISHED beyond two spot checks: `.loupe-up` appears at
`+page.svelte:584` and `:599` inside the style block (`5257-6224`), and
`.drawer-content` at `:735`. I did not map the full set of loupe/dock selectors
this session; a further grep pass keyed to every class referenced in
`handlePageTap` and the `<Loupe>`/`<CorrectionSurface>` markup would be needed
before this cut moves any CSS.

**Destination:** `apps/web/src/lib/score/loupe-station.svelte.ts`, same module
as cut 1 for the same reason (score already owns `Loupe.svelte`, `loupe.ts`,
`LoupeSyllables.svelte`). Keeping it a separate class from
`CorrectionStation`, per the Correction Station brief's own framing, is what
keeps each side's interface under the ten-variable flag.

**Interface:** counted this session the same way:

| Variable | Total refs | Outside the span |
|---|---|---|
| `isPhone` | 15 | 10 |
| `loupeOpen` | 16 | 5 |
| `loupeSyllablesOpen` | 5 | 2 |
| `loupeMode` | 4 | 1 |
| `phonePortrait` | 2 | 1 |
| `loupeAvailable` | 5 | 1 |
| `heldMeasureIds` | 2 | 1 |
| `gestureBeganOnSurface` | 6 | 0 |

`isPhone` is the outlier: ten of fifteen references sit outside this span,
mostly in `onMount`'s `checkMobile` (`:4277-4282`) and drawer-width
calculations, so it is genuinely page-wide device state, not loupe-owned. It
should be passed in, not moved.

**Lines removed:** ~545 (estimate: `2047 - 1503 = 544`), script only. Markup
lines are NOT ESTABLISHED to move at all: the two snippet/component blocks
could shrink if the extracted module exposes fewer, coarser props, but by how
much is not measured this session.

**Risk:** Medium. `handlePageTap` (`:1843-1966`, 124 lines, the single
longest function in the file after the ones already inside cut 1) reads
`drawerRaised`, which belongs to neither cut 1 nor cut 2, so this is the
region the anatomy already flagged as needing "a boundary carefully between
loupe visibility and general surface gestures." Touch handling and gesture
ordering are exactly what the 84-screenshot compare does not catch.

**Tests that guard it today:** none found by name (same grep as cut 1: no
`loupe` hit in either e2e file). Unit tests: NOT ESTABLISHED whether
`apps/web/src/lib/score/loupe.test.ts` or `loupe-render.test.ts` (both exist,
`ls apps/web/src/lib/score/`) cover the page-level open/close/gesture state
this cut would extract, versus only the rendering math; I did not open them
this session.

### Cut 3: Text arrival pipeline

**Job:** every way text or a score arrives at the document: paste/type,
score upload, the replace-confirmation dialog, and carrying corrections across
an edit.

**Exact span:** `apps/web/src/routes/+page.svelte:3040-3541`. Read this
session:

- `claimDerivedPoem` `:3040`, `handlePoemInput` `:3052`, `handleInput` `:3057`
- `pendingArrival` `:3068`, `replaceDialogEl` `:3074`, `keepButtonEl` `:3075`,
  `pendingConfirm` `:3091`, `askToReplace` `:3094`
- `transcribedText` `:3131`, `transcribeWhenDictionaryReady` `:3161`,
  `cancelQuietTimer` `:3166`, `joinText` `:3187`, `flushText` `:3224`, the
  auto-transcribe `$effect` `:3233`
- `handleArrival` `:3243-3341`, `answerWith` `:3342`, `seatFilledPoem` `:3371`,
  `applyArrival` `:3384-3541`

Also logically part of this pipeline but sitting outside the span, upstream:
`handleStartPlacementOver` (`:640-709`, excluded from cut 1 above) and, further
up, `carryOverridesAcross` (`:2651`) and `reseatAcross` (`:2687`), both inside
the transcription block (cut boundary not drawn here; see "what resists
extraction" in section 3).

**Destination:** NOT a `$lib/score/`, `voice/`, etc. seam by itself: this
region already delegates to `$lib/one-action.ts` and `$lib/text-diff.ts`
(both exist at `apps/web/src/lib/`, outside the six modules, confirmed on
disk), the same pattern the Correction Station brief used to justify a
`.svelte.ts` class. A new `apps/web/src/lib/arrival.svelte.ts` beside them
fits that precedent, but this module would need to import from `score/`
(for `seatFilledPoem`'s ingestion work) and reach into `doc` (the library
module's document object), so it sits above the six-module layering rather
than inside it. `scripts/ratchets.mjs`'s module check only restricts files
*under* `apps/web/src/lib/<one of the six>/`; a file at the `lib/` root is not
checked by rule 4, so this placement is legal but is a judgement call, not
one the ratchet enforces for you.

**Interface:** counted this session:

| Variable | Total refs | Outside the span |
|---|---|---|
| `pendingConfirm` | 8 | 5 |
| `transcribedText` | 13 | 7 |
| `replaceDialogEl` | 6 | 3 |
| `pendingArrival` | 4 | 1 |
| `keepButtonEl` | 4 | 1 |
| `transcribeWhenDictionaryReady` | 5 | 1 |

Six fields listed, but this undercounts the real coupling: `applyArrival` and
`handleArrival` both read and write `doc`, `lines`, `ingestedScore`, and
`noLyricsFile`, all boot-region state declared at `:96-365`, and both call
into the correction-carry-over functions in the transcription block above
(`:2651`, `:2687`). This is the anatomy's own "most tangled region" finding,
and this session's read does not overturn it.

**Lines removed:** ~500 (estimate: `3541 - 3040 = 501`).

**Risk:** High, per the anatomy and confirmed by the interface count above:
this is the one region where the state it touches is not local to itself.
**A cut here is a strong candidate for further splitting** (for example,
"replace-confirmation dialog" versus "score/text arrival" as two slices)
before a coding agent takes it in one sitting.

**Tests that guard it today:** `apps/web/src/lib/text-diff.test.ts` and
`apps/web/src/lib/one-action.test.ts` exist and guard the pure logic these
handlers call; I did not open either this session, so their coverage of the
specific carry-over and replace-confirmation paths is NOT ESTABLISHED.
`apps/web/e2e/singer-paths.test.ts`'s "opening a score" describe block
(`:13`) likely exercises `handleArrival`/`applyArrival` at least once; I did
not read its body this session to confirm which of this span's branches it
reaches.

### Cut 4: Library and song CRUD

**Job:** the binder (export/import), collision handling, and the song
list (new, rename, delete, switch).

**Exact span:** `apps/web/src/routes/+page.svelte:3542-4008`. Read this
session:

- `importInputEl` `:3542`, `binderError` `:3543`, `binderNotice` `:3545`,
  `storageReading` `:3552`, `bootLines` `:3556`, `storageLines` `:3557`, the
  storage-quota `$effect` `:3565`
- `todayInWords` `:3576`, `writeBinder` `:3598`, `handleExport`/`handleExportAll`
  `:3630-3632`, `settleCollision` `:3655`, `askCollision` `:3661`,
  `handleImportFile` `:3699`
- `songs` `:3746`, `libraryError` `:3747`, `refreshSongs` `:3750`, `songRows`
  `:3754`, `switchSong` `:3788`, `handleNewSong` `:3832`, `handleRenameSong`
  `:3845`, `handleDeleteSong` `:3867`, `commitDelete` `:3889`, `songLibrary`
  `:3903`, `restoreFrom` `:3932`, `restoreSource` `:3944`, `uploaderEl`
  `:3957`, `attachUploadedSource` `:3972-4008`

**Destination:** `apps/web/src/lib/library/library-station.svelte.ts`. The
`library` module already exists (`src/lib/library/`, per `ARCHITECTURE.md`:
"stores songs on the device... `document.svelte.ts` is the seam between the
page and storage") and already holds the seam pattern this cut would extend.
Not one of the ratchet's six lib modules, so no layering rule applies beyond
"packages never import the app," which this code does not touch.

**Interface:**

| Variable | Total refs | Outside the span |
|---|---|---|
| `songs` | 24 | 5 |
| `restoreSource` | 5 | 3 |
| `binderError` | 9 | 3 |
| `binderNotice` | 7 | 3 |
| `bootLines` | 3 | 1 |
| `libraryError` | 9 | 0 |
| `storageReading` | 3 | 0 |

Seven fields, none past the ten-variable flag; `switchSong`'s dependency on
the active `doc` object being swapped out from under the rest of the page
(the anatomy's own caution) is the real risk here, not the count.

**Lines removed:** ~465 (estimate: `4008 - 3542 = 466`).

**Risk:** Low-medium. Mostly orchestration calling into `$lib/library/*`
already (per `ARCHITECTURE.md`'s codemap); the risk is `switchSong` changing
`doc` while another region (arrival pipeline, correction station) still holds
a reference to the old song's state mid-edit.

**Tests that guard it today:** `apps/web/e2e/singer-paths.test.ts`'s "the
library" describe block (`:121-162`, read this session) covers new-song,
switching, and reload-persistence directly. Import/export/collision handling:
NOT ESTABLISHED whether any e2e test exercises the binder; I did not find one
by name and did not open `helpers.ts` to check for a binder fixture helper.

### Cut 5: Tab and reading navigation

**Job:** switching tabs/destinations, scrolling to an anchor, and the
IntersectionObserver-based active-heading tracking for Learn/Guide.

**Exact span:** `apps/web/src/routes/+page.svelte:4106-4233`. Read this
session: `handleTabChange` `:4106`, `scrollToAnchor` `:4141`,
`handleHeadingNavigate` `:4162`, `readingContentEpoch` `:4170`,
`handleReadingContentReady` `:4172`, the two IntersectionObserver `$effect`
blocks `:4190` and `:4196`, `handleHashNavigation` `:4228-4233`.

**Destination:** `apps/web/src/lib/navigation.svelte.ts` (new, top-level,
same reasoning as cut 3: this logic is destination/anchor bookkeeping that
does not belong to any one of the six modules; it reads `destination` and
`studioDocument`, both declared far above at `:339-340`).

**Interface:** NOT fully counted this session (low priority given the small
size of this cut); `activeHeadingId` and `readingContentEpoch` are the two
`$state` fields it owns, both declared inside the span, so the interface is
mainly the read of `destination`/`studioDocument`/`isMobile` coming in and
`activeHeadingId` going back out to the markup that highlights the current
heading. A handful of variables; low risk on the count alone.

**Lines removed:** ~130 (estimate: `4233 - 4106 = 127`).

**Risk:** Low, but low value too, per the anatomy: self-contained, small, a
reasonable first or last slice for a coding agent still learning the file's
conventions, not one that moves the needle on the 2,000-line goal by itself.

**Tests that guard it today:** NOT ESTABLISHED. I did not find `scrollToAnchor`,
`activeHeadingId`, or `IntersectionObserver` mentioned in either e2e test file
by name; the "Learn and Guide" describe block (`singer-paths.test.ts:163`)
plausibly exercises tab switching but I did not open its body to confirm it
reaches this code rather than only the Reading components' own content.

### Cut 6: Drawer content snippets (markup only)

**Job:** the drawer's own content: metadata, voice takeover, piece band,
score upload, notation/analysis console, and the score group — currently five
named `{#snippet}` blocks passed to `<Drawer>`.

**Exact span (markup):** `apps/web/src/routes/+page.svelte:4508-4981`
(`<Drawer` opens at `:4508`, its matching `</Drawer>` at `:4981`, both grepped
this session). Its five top-level snippets, boundaries read this session:
`metadataBody` `:4533-4552`, `voiceTakeover` `:4557-4588`, `pieceGroup`
`:4594-4603`, `inputGroup` `:4615-4800` (nesting `sourceScore` `:4635-4684`,
wrapping `<ScoreUploader>` at `:4665`, and `notationAndAnalysis` `:4706-4798`,
nesting `consoleContent` `:4761-4796`, wrapping `<AnalysisStation>` at `:4752`
and `<InspectorPanel>` at `:4775`), `scoreGroup` `:4827-4980`.

**Destination:** `apps/web/src/lib/components/Drawer/DrawerContent.svelte`
(new), inside the existing `Drawer/` component folder
(`ARCHITECTURE.md`: "`src/lib/components/Drawer/` is the drawer: every
control that changes something"). This is markup and its prop-wiring only; it
does not, by itself, move any `$state` declarations, though several of the
snippets close over handlers this cutlist assigns elsewhere (`voiceTakeover`
over voice-module state; `sourceScore` over arrival-pipeline handlers from
cut 3).

**Interface:** NOT ESTABLISHED. This cut's real interface is "every prop
`<Drawer>`'s five snippets read," which is most of the page's `$state`
surface by a different route than cuts 1 through 5; counting it properly
needs a dedicated read of all five snippet bodies, not the boundary-only pass
done this session.

**Lines removed:** ~470 (estimate: `4981 - 4508 = 473`), markup only, no
script lines.

**Risk:** Medium. Untested by pixel comparison alone if a snippet's prop
list is trimmed rather than passed through unchanged; this is the region
where a "no pixel changed" cut is easiest to state and hardest to be sure of,
because five different features' controls sit in one component.

**Tests that guard it today:** NOT ESTABLISHED beyond whatever the e2e suite's
existing flows touch by using the drawer at all (most of it, per
`core-loop.test.ts` and `singer-paths.test.ts`'s use of `.new-btn`,
`.dict-button`, etc., both inside the drawer).

### Cut 7: Calibration entry/exit shell

**Job:** entering and leaving the voice-calibration wizard.

**Exact span:** `apps/web/src/routes/+page.svelte:2292-2309`
(`enterCalibration` `:2292`, `exitCalibration` `:2295`, `calibrationRequest`
`:2304`, `openRangeFields` `:2305`), read this session.

**Destination:** `apps/web/src/lib/voice/`, which already owns
`CalibrationWizard.svelte` and `profileStore.ts` (`ARCHITECTURE.md`). The
state this shell touches (`voiceFormants`, `voiceCharacteristics`, and so on,
declared at `:346-353`) is also read by `VoiceProfilePane`/`InsightsPane`
outside this file, per the anatomy, so the seam is the shared voice-profile
store, not this thin shell alone.

**Interface:** NOT ESTABLISHED precisely; small (under 20 lines of logic),
low value on its own.

**Lines removed:** ~20 (estimate).

**Risk:** Low, low value: the anatomy already calls this "a thin shell," and
this session's read does not change that. Worth doing only as part of a
larger `voice/` consolidation, not as its own commit.

## 3. Order, running total, and whether 2,000 is reached

**Order, least-coupled first:**

1. **The Correction Station brief is cut 1**, unchanged from the outer task's
   default. No reason found this session to reorder it: its interface (nine
   `$state` fields, two heavily-shared `$derived` values) is real but the
   hard logic already sits in `packages/score-parser` and `$lib/score/`, and
   Dann's own ruling (`docs/memory/CONTRACT.md`, cited by the brief) already
   commissioned it.
2. **Cut 4 (Library/song CRUD)** next: lower risk than cut 2 on the count
   alone, and its own e2e coverage ("the library" describe block) is the
   best-guarded of any cut in this list.
3. **Cut 2 (Loupe/dock)**, right after cut 1, because its markup
   (`loupeCorrections`, `<Loupe>`) is where cut 1's state surfaces; shipping
   them close together keeps the page's exposed surface smaller for less
   time, even though they are two separate commits and two separate modules.
4. **Cut 5 (Tab/reading navigation)**: small, low risk, a good "breather"
   slice between the harder ones.
5. **Cut 7 (Calibration shell)**: same reasoning as 5, smaller still.
6. **Cut 6 (Drawer content snippets)**: markup-only, medium risk, best done
   once the script-side cuts it depends on (voice, arrival) have already
   moved their handlers, so the snippet only has to be re-pointed at a new
   import, not rewritten.
7. **Cut 3 (Text arrival pipeline)** last, because it is the highest risk and
   the anatomy's and this session's read agree it should be split further
   before a coding agent takes it in one sitting; ordering it last means the
   easier cuts have already proven the extraction pattern (and the ceiling
   ratchet) on lower-stakes code first.

**Running total (script lines, estimates, each "after" carrying the previous cuts):**

| After cut | Script lines remaining (est.) |
|---|---|
| (start) | 4,369 |
| 1. Correction Station | ~3,629 |
| 2. Library/CRUD | ~3,164 |
| 3. Loupe/dock | ~2,619 |
| 4. Tab/reading nav | ~2,489 |
| 5. Calibration shell | ~2,469 |
| 6. Drawer snippets (markup, not script) | ~2,469 (script unchanged; markup down to ~417) |
| 7. Arrival pipeline | ~1,969 |

Adding the untouched markup (887, minus cut 6's ~470 leaves ~417) and untouched
style (968, nothing established as moved) gives a total file estimate of
roughly **1,969 + 417 + 968 ≈ 3,354 lines after all seven cuts.** That is
**below 2,000 for the script alone, but not for the whole file.** Reaching
2,000 total needs the style block addressed too, and this session did not map
which of the 968 style lines belong to which extracted module (the two spot
checks in cut 2 are the only style citations here). **What resists
extraction:** the `<style>` block as a whole, because Svelte's scoped styles
mean moving a rule out of `+page.svelte` requires either moving it into the
extracted component's own `<style>` block (safe, mechanical, but unread this
session for all but two selectors) or leaving print/shared layout rules
page-level on purpose (see section 4). NOT ESTABLISHED how much of 968 lines
is genuinely page-global (print layout, the app shell) versus attributable to
a single extracted feature.

## 4. What must never move out of the page

- **`<svelte:window on:keydown={handleCorrectionKey} on:click={handlePageTap}
  on:pointerdown={...} .../>`** (`:4385-4390`) and **`<svelte:head>`**
  (`:4393-4397`, the font preconnect links): both are Svelte special elements
  valid only at a component's top level, read this session at those lines.
  Cuts 1 and 2 move the *handlers* these bindings call; the bindings
  themselves stay, coupling the page to whatever module ends up owning
  `handleCorrectionKey` and `handlePageTap` regardless of the cut list above.
- **`onMount(() => { ... })`** (`:4234-4369`): a SvelteKit/Svelte lifecycle
  hook, callable only from a component. Its *body* (boot-notice assembly,
  `checkMobile`, the localStorage restores, `joinText('boot')`,
  `loadDictionary`) can delegate to helper functions living elsewhere, but the
  `onMount` call and its cleanup return must stay in `+page.svelte`.
- **The six per-song boot-state declarations at `:96-365`** (`doc`, `lines`,
  `destination`/`studioDocument`, and the rest): every other cut in this list
  reads or writes through them, so they are the page's own state by
  necessity, not a leftover to be swept up later. Moving them would turn
  every other cut's interface count into a page-wide one.

## 5. The Correction Station brief's stale citations

Checked `docs/sessions/brief-code-audit-correction-station_r1_2026-09-26.md`
against HEAD this session.

**Not stale, checked and confirmed:** the `$lib/shane/` paths the outer task
warned about are **already gone from the brief itself.** `git log -p` on the
brief shows commit `9d1baa6` (N.174 D.3) rewrote both occurrences
(section 2's "already sits in" line and section 5's reconciliation-folder
line) from `$lib/shane/` to `$lib/score/` before this session started. Both
now read `apps/web/src/lib/score/entry.ts`, `correction.ts`, and
`.../score/reconciliation/`, and both paths exist on disk, confirmed this
session (`ls apps/web/src/lib/score/`). The `e52-fable-save-design_r1_2026-08-16.md:227`
citation is exact: line 227 of that file reads "...which at 74,413 bytes
(`wc -c`, run this session) must shrink or hold, never grow, per the brief's
§3.2 warning," matching the brief's paraphrase. `../memory/CONTRACT.md` §5
("no git command that writes") and §6 ("Do not change `VocalLineEvent`... or
rebuild anything in `.../score/reconciliation/`") both check out against the
current file's section 5 and section 6 headings and text, read this session.

**Stale, found this session:**

| Cited in the brief | Brief's line | Current `path:line` | Note |
|---|---|---|---|
| `placeSyllableOnSelected` | `+page.svelte:709` | `:710` | +1 drift |
| `selectedEventId` | `:784` | `:785` | +1 drift |
| `setCursor` | `:834` | `:835` | +1 drift |
| `undoStack` | `:962` | `:963` | +1 drift |
| `redoStack` | `:974` | `:975` | +1 drift |
| `pushUndo` | `:996` | `:997` | +1 drift |
| `handleUndo` | `:1001` | `:1002` | +1 drift |
| `handleRedo` | `:1009` | `:1010` | +1 drift |
| `handleRest` | `:1241` | `:1242` | +1 drift |
| `handleTie` | `:1256` | `:1257` | +1 drift |
| `tupletOpen` | `:1331` | `:1332` | +1 drift |
| File length: "6,225 lines at `b7c2fc6`" | section 1 | 6,224 at `561e68e` | one line net removed since, despite the local +1 drift above; some other edit removed two lines, or removed one and the +1 area is not uniform across the whole file — NOT ESTABLISHED which commit |
| `scripts/ratchets.json` ceiling "6,225" | section 2 | `6224` (`ratchets.json:8`) | matches the corrected line count above, so this is the same staleness as the file-length citation, not a second one |

Eleven identifier citations are stale by exactly one line each, and the two
file-length citations are stale together by one line, for a combined count of
**12 stale citations** (11 identifiers + 1 length/ceiling pair counted once,
since they are the same fact stated twice). All are mechanical line drift, not
a change in what the brief describes: every named function and variable it
cites still exists, doing the same job, one line later.

## 6. What I could not establish

- The full attribution of the 968-line `<style>` block to modules: spot-checked
  two selectors only (`.loupe-up`, `.drawer-content`).
- Which of `apps/web/src/lib/score/loupe.test.ts` and `loupe-render.test.ts`,
  if either, cover the page-level loupe open/close/gesture state cut 2 would
  extract, versus only the rendering math.
- Whether any e2e test exercises binder export/import/collision (cut 4's
  higher-risk half).
- The exact commit that removed the one net line between `b7c2fc6` and
  `561e68e` beyond N.174's renaming pass; not investigated, since the outer
  task did not ask for a full blame trace and it does not change any cut's
  boundary.
- A full read of the five `<Drawer>` snippet bodies (cut 6): boundaries only,
  not their prop lists in detail.
- Whether `handleStartPlacementOver` (`:640-709`) is better owned by cut 1 or
  cut 3; flagged as a boundary call in cut 1's detail, not settled.
