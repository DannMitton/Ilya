# Memo: the path pass, increment 3

Code, `~/Desktop/ilya-rewrite`, branch `Shane`, HEAD `2160437` plus this working
tree. No git was run. Answers `docs/sessions/brief-path-pass-inc3_r1_2026-09-11.md`.
Serves THE DRAWER AS A PATH, step 3. Reasoning that is not here is in the code
comments at the lines cited.

**New file for Dann to `git add`:** this memo. **Files changed**, all under
`apps/web/src`: `lib/components/Drawer/{Drawer.svelte, IntakePanel.svelte,
NotationFields.svelte, sections.svelte.ts, sections.test.ts, bandState.ts,
bandState.test.ts}`, `lib/components/HeaderBar.svelte`, `lib/i18n.ts`,
`routes/+page.svelte`. Untouched: `VocalLineEvent`, `lib/shane/reconciliation/`,
`underlay-donor.ts`. **Strings:** none new, one deleted, one renamed. **French
owed:** nothing new.

**THE ONE QUESTION IN THIS MEMO:** on a phone the pair is now unreachable at the
moment of action. The measurement is in §2.3.

## 2.1 The Text fold is deleted

- **`sections.svelte.ts`:** `STATION_IDS` loses `text` (`:69-75`); `Tier` is
  `band | station` again (`:130-134`). A stored `text` drops through the
  existing unknown-id path, as `metadata`, `voice` and `underlay` already do, so
  no version bump. Walked: the open set never held `text` again.
- **Notation and Analysis are in the STATION tier**, so on a phone opening one
  shuts the other. Walked at 390 px. That is the 2026-09-02 rule, not new.
- **`IntakePanel.svelte`:** the fold's header, body, state line and four props
  are gone; `notationAndAnalysis` renders in their place (`:130`, `:155`,
  `:625-627`), and the `StationHeader` import went with the fold. One CSS rule
  survives, the side-inset removal, at `:1134`. The hairline above Notation is
  the drawer's own station hairline now.
- **`+page.svelte`:** the snippet moved verbatim, renamed (`:4256-4262`).
  **`i18n.ts`:** `group.text` deleted in both languages (`:56-58`); grep over
  `apps` and `packages` finds no other reader. `docs/memory/INBOX.md:130` names
  it among the French owed and is one key stale.

## 2.2 The changed phrase sits beside Notation

- `text.state.changed` → `notation.state.changed` (`i18n.ts:74`), same text both
  languages; `textStateLine` → `notationStateLine` (`bandState.ts:153`);
  `+page.svelte:2123` builds it from the same seven values.
- It renders in `StationHeader`'s status slot (`NotationFields.svelte:124`,
  snippet `:126`, style `:265`), **open or shut**, and nothing renders beside
  Analysis. Measured: 14 px, `rgb(74, 69, 64)`, `tabular-nums`.

## 2.3 Undo and Redo on the SCORE MARKUP band

- **The decision is a pure function**, `stackActions` (`bandState.ts:180-200`),
  so a node-only gate can test what the band draws. `Drawer.svelte`: derived
  `:189`, props `:143-147`, the room the band name reserves `:196` and `:532`,
  the pair `:556-568`, CSS `:1272-1305`, given to SCORE MARKUP alone at `:626`.
- **Text in the band's label style, not pills.** The band is 40 px with them and
  without, walked on all three bands at both widths; the hit area is the full
  40 px header height and each action is 62 px wide at 390 px.
- **A sibling of the band toggle, not a child** (no button inside a button).
  Walked: two taps on Undo left the band shut, and a tap on the band's own
  length opened and closed it.
- **`HeaderBar.svelte` keeps the sigil and the language toggle only.**
  `undoLabel`, `redoLabel`, `onundo`, `onredo`, `drawerWidth`, `.head-right`,
  `.head-pill`, the 1400 px anchor and the `DRAWER_WIDTH` and `INCLUDE_SHANE`
  imports are deleted; `+page.svelte:3949` is one line.
- **Two visible changes, each one line to revert.** The clause moved off screen
  into `aria-label` (the band draws `↶ Undo`, a screen reader hears "Undo:
  syllable placed"), because two sentences do not fit beside SCORE MARKUP at
  390 px in 0.7 rem uppercase; and the glyphs are the brief's `↶ ↷` where the
  top bar drew `↰ ↱`.

**THE UNDO STACK, INVENTORIED BEFORE ANYTHING MOVED.** Seventeen `pushUndo`
sites, all in `+page.svelte`, all Score markup: `placeArmedSyllable :600`
(reached only from `handleLoupePick :639-642`, a tap inside the loupe), then
`handleStep :890`, `handleOctave :899`, `handleSemitone :929`, `handleAccidental
:947`, `handleBase :955`, `handleDot :964`, `handleDeleteNote :993`,
`handleRestoreNote :1016`, `handleDurationCell :1051`, `handleDotCell :1075`,
`handleRest :1094` and `:1099`, `handleTie :1107`, `applyTupletDefinition
:1205`, `handleMelisma :1578`, `handleDockShift :1608`. All are pressed on
`CorrectionSurface`, which renders twice: the drawer's Corrections station
(`:4424`) and the loupe dock (`:4789`). **Nothing on the stack originates in a
poem edit, a Notation toggle, or a Piece field**, so the item proceeded.
`handleStartPlacementOver` (`:541-580`) pushes nothing, so Start placement over
is still outside Undo (N.121 d).

**AT 390 px, AND THIS IS THE FINDING.** Measured: after placing a syllable with
the drawer lowered, the Undo action is in the DOM and **zero are on screen**.
The loupe has carried no Undo since N.114a (`CorrectionSurface.svelte:472-487`)
and the dock's buttons are the note verbs only. Raising the drawer to reach the
band **dismisses the loupe and clears the selection** (`+page.svelte:1833-1835`,
ruled 2026-08-26). So a phone singer cannot undo without leaving the place they
are working. The top bar the pair left was visible at that moment; the band is
not. **The brief's premise that the loupe covers the moment of action does not
hold for any undoable action on a phone.** On a desk it does not arise.

## 2.4 Filled pills at rest, established, nothing changed

| pill | site | filled while |
|---|---|---|
| Transcribe and fit | `IntakePanel.svelte:667-673` | `transcribeActs` (`+page.svelte:3493-3495`) |
| Continue to analysis | `ScoreUploader.svelte:879` | `ui.kind` is `done` |
| the score answer | `ScoreUploader.svelte:759` | `ui.kind` is `askKind` |
| Read | `ScoreUploader.svelte:796` | `ui.kind` is `asking` |
| Calibrate / Recalibrate | `VoiceAnchor.svelte:55`, `:107-119` | always, whenever SCORE MARKUP is open (`+page.svelte:4518`) |
| Dictionary | `InspectorPanel.svelte:984-991`, `:1502-1519` | always, whenever Analysis is open on a taken word |

**Which pair.** The three uploader pills are one `ui.kind` and exclude each
other. Transcribe and fit cannot pair with Continue (`hasWaitingScore`,
`ScoreUploader.svelte:546-548`) but can pair with the other two. **Calibrate and
Dictionary pair with everything and with each other**, because neither reads a
state: that is Dann's 00:02 sighting, two unconditional fills rather than one
rule mis-applied.

## The walk, on a local production build

Build `app.8vRBu2oR.js`, confirmed by the loaded entry hash. Storage, service
worker and IndexedDB were wiped first and what was there is in this session's
transcript. The `.musx` was staged under `.svelte-kit/output/client/` and
deleted; the walkclock harness was injected and removed, both files re-grepped
clean. Screenshots are in the transcript, not on disk.

1. **1400 px, fresh:** three 40 px bands, Piece and Score markup closed, INPUT
   open with the placeholder and the caption, `Notation` and `Analysis` two
   closed rows flush with the intake, no `TEXT` anywhere, the top bar showing
   the sigil and `Français` only, SCORE MARKUP with no Undo and no Redo.
2. **One Notation toggle flipped:** `1 of 7 changed` beside `Notation`, seen on
   screen open and shut; flipped back, nothing; never anything beside Analysis.
3. **Poem pasted, `.musx` dropped, Continue pressed, one syllable placed in the
   loupe:** `↶ Undo` on the band, `aria-label` "Undo: syllable placed". Pressed:
   the placement reverts (`1 / 42` to `0 / 42`) and `↷ Redo` takes its place.
4. **390 px:** the same three, the band reading `SCORE MARKUP … ↶ UNDO ⌄`, name
   unclipped, 12 px before the chevron. After a reload the bands persist
   (`{"v":3,"open":["input"]}`) and the pair is absent, the stack being in
   memory by N.92's rule while the placement survives.

## Gates

| gate | result | baseline |
|---|---|---|
| phonology | 216 passed | 216 |
| dictionary | 235 passed | 235 |
| web-check | 0 errors, 7 warnings in 4 files | same |
| web-test | **1105 passed (1105)** | 1104 |
| score-parser | 547 passed, 5 skipped (552) | same |

**Web-test moved +1**, the brief's new test at `bandState.test.ts:167`: the pair
draws nothing on empty stacks, with its positive control in the same test.
`sections.test.ts:66` and `:85` were rewritten in place and net zero. **Move
`~/Downloads/ilya-ship.sh:79` to `1105 passed (1105)` before the ship.**

## NOT ESTABLISHED

- **Whether the phone keeps an Undo at the moment of action.** §2.3 has the
  measurement; the answer is Dann's.
- **Whether the clause belongs on screen.** He has seen neither the verb nor the
  sentence on the band yet.
- **The 44 px floor.** The actions are 40 px because the band is, and the ruling
  forbids changing its height: no new exemption, but under the coarse-pointer
  floor every station row keeps.
- **`Redo`'s French is still `Redo: %s`** (`i18n.ts:379`), untranslated before
  this ship and now on the band as `↷ REDO`.
- **The 390 px toggle flip used a scripted click.** Everything else at both
  widths was a real click or a real `MouseEvent` at the target's coordinates.
- **`PRODUCT.md` was not touched.** Grep finds no Text fold in it; whether its
  drawer grammar wants a line about the two stations is the desk's call.
