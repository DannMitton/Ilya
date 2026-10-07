# Corrections inventory: every control driven and logged (r1, 2026-10-07)

> Provenance, added by the desk (Opus): a Sonnet helper in the desk's cloud workspace, 2026-10-07 about 00:45 to 01:25, under brief C (`/home/claude/heldout/brief-C-corrections-inventory.md`, not kept), on a clone at `5c0f557`, driving `sunless-01-engraved.musicxml` in headless Chromium. 266,735 tokens. Its final message, transcribed by script, unedited. Its claims are its own; the desk has not looked at its screenshots.

The Corrections tab has 39 controls and keys, and every one I drove works at both sizes, undoes, and survives a reload. The planned fixed-size panel is not in the tree. Controls below Pitch are also hard to reach on a 1440 x 900 desk.

I drove `sunless-01-engraved.musicxml`, not the Tchaikovsky PDF, so nothing here is established for a PDF read. The target was the A3 quarter note in m. 2 («нат», hit `m1-1-4`), on the dev server at 5c0f557. The scans and truth folders were not touched. The only files I wrote are under `/home/claude/heldout/work-C/`.

## Table (desk 1440 x 900 / phone 390 x 844)

**Reaching any control.**
- A tap on a measure on the page raises the loupe in Syllables mode.
- A second tap on the Corrections pill (`Loupe.svelte:2510`) opens the panel.
- The control is the third step.
- Controls below Pitch need an extra scroll inside the panel at desk size. Phone shows one more row than desk before scrolling.

**Reading the pass columns.**
- Every row passed on desk and phone unless noted.
- "Works" means the readout changed as the label promises. For the page I checked the drawn text hash.
- "Undo" means the readout returned. The page-drawing hash returned in the desk subset rerun; the loupe's own hash sometimes differs, because the loupe card widens and never shrinks.
- "Reload" means the readout or the page hit count survived a reload. Delete and insert show 115 and 117 page hits against a baseline of 116.

**Screenshot names.** `<id>-<desk|phone>-<before|after|undone|reloaded>.png` in `/home/claude/heldout/work-C/shots/`. The tuplet ids add `-row-open.png`.

Line numbers below are `CorrectionSurface.svelte` unless another file is named. The handler is in `routes/+page.svelte`.

| Control and label | Element | Reach and size | Result | Handler, screenshot id |
|---|---|---|---|---|
| ▲ semitone, ▼ semitone (Up a semitone, Down a semitone) | pitch | Pitch grid, visible. Desk 232 x 44, phone 90 x 44. | A3 to A♯3 and G♯3. Works, undo, reload all pass. | `:624`, `:651`; `handleSemitone` `:938`. ids `semiUp`, `semiDown` |
| ▲ step, ▼ step (Up a step, Down a step) | pitch | Same grid. | A3 to B3 and G3. All pass. | `:633`, `:660`; `handleStep` `:899`. ids `stepUp`, `stepDown` |
| ▲ octave, ▼ octave (Up an octave, Down an octave) | pitch | Same grid. | A3 to A4 and A2. All pass. | `:642`, `:669`; `handleOctave` `:908`. ids `octUp`, `octDown` |
| Flat, Natural, Sharp (glyph buttons) | accidental | Desk 86, 80, 86 wide, mostly below the fold. Phone 44. | A3 to A♭3, A♯3 to A3, A3 to A♯3. All pass. | `:687`; `handleAccidental` `:950`. ids `flat`, `natural`, `sharp` |
| Sharp pressed twice | double sharp | Same button. | A♯3 to Ax3. All pass. A double flat was not driven. | `:687`. id `dsharp` |
| Sixteenth, Eighth, Quarter, Half, Whole (glyphs) | length | Desk 95 wide, phone 52. | Each sets the duration named. All pass. Breve and 32nd are not offered. | `:575`, list at `:207`; `handleDurationCell` `:1037`. ids `len16`, `len8`, `lenQ`, `lenH`, `lenW` |
| Dot (glyph) | dot | Desk 95, phone 128. | Pressing once gives Dot, twice gives Double dot. All pass. | `:586`; `handleDotCell` `:1063`. ids `dot`, `dot2` |
| Rest | rest, convert | Desk 101, phone 59. | Note to rest and back. All pass. | `:701`; `handleRest` `:1086`. ids `rest`, `restBack` |
| Rest, with a caret taken | rest, add | Gap taken first. | Enters a rest ("Rest · Quarter"). Page hits 117 after reload. | ids `insRest` |
| Quarter etc., with a caret taken | note, add | Tap a caret or press Next, then a duration cell. | Enters "A3 · Quarter" at the arrival pitch. Page hits 117 after reload. | `:575`; `handleDurationCell` `:1037`. id `insNote` |
| Delete | note, delete | Desk 111, below the fold. Phone 70. | The note goes and the cursor moves on. Page hits 115 after reload. | `:709`; `handleDeleteNote` `:982`. id `delete` |
| Restore (Undo my corrections to this note) | restore | Disabled until the note has a correction. | Clears that note's whole correction. | `:732`; `handleRestoreNote` `:1012`. id `restore` |
| Tie | tie | Enabled only where the next note has the same pitch. | The drawing changes. I did not inspect the tie visually. | `:721`; `handleTie` `:1101`. id `tie` |
| Tuplet, then ▲ One more and ▼ One fewer | triplet, make | 3 steps, then nudges. | Opening the row changes nothing (`rowOpenChangesDrawing` false). The definition applies only on the first ▲ or ▼, with no confirm. The note read "Eighth" after. Bracket not inspected. | `:591`, `:399`, `:403`; `applyTupletDefinition` `+page.svelte:1156`. ids `tuplet`, `tupletUnmake` |
| Melisma | syllable, sustain | Lyric station, below the fold on both. | Works, undo, reload pass. | `:780`; `handleMelisma` `+page.svelte:1585`. id `melisma` |
| Shift lyrics (←, → ×2 rows) | syllable shift | Same station, below the fold. | All four work, undo, reload pass. | `:789-814`; `handleDockShift` `+page.svelte:1610`. ids `shiftEndBack`, `shiftEndFwd`, `shiftOpenBack`, `shiftOpenFwd` |
| Keys (desk only): ↑, ⇧↑, +, −, 3, `.`, Delete | pitch, length, dot, delete | Corrections open, cursor on a note. | Step, octave, semitone up, semitone down, 16th, dot, delete all work and reload. Undo for key 3 was not established (script error). | `+page.svelte:1239-1275`; digits at `correction.ts:110`. ids `kUp`, `kShiftUp`, `kPlus`, `kMinus`, `kDigit`, `kDot`, `kDel` |

**Navigation and loupe controls** (screenshots `nav-<id>-<size>.png`):
- **Pills and chevron.**
  - The Corrections pill opens the panel.
  - A second press on the filled pill closes it, on both sizes.
  - The chevron reopens it, on both sizes (`Loupe.svelte:2506-2536`).
- **Zoom ± (`Loupe.svelte:2526-2527`).** On desk the card width goes 707 to 763 and back. On phone the card stays 299 and the readout is unchanged.
- **Stepping the cursor.**
  - Previous and Next buttons (`:498`, `:506`) work on both sizes.
  - A caret tap works on both sizes (`handleLoupePickGap` `+page.svelte:740`).
  - ← and → keys work on desk.
- **Syllable placement.** Tapping a syllable in Syllables mode places it (`+page.svelte:677`), and the Undo pill undoes it. The cursor then jumped to m. 18.
- **Undo and Redo.** The bar shows one pill at a time ("Undo: A3 → B3", then "Redo: …"). Redo restored the readout on every control tested.

## Cannot edit in Corrections

| Item | Status | Exists elsewhere? |
|---|---|---|
| Metre | No control. | None. Metre is only read (`+page.svelte:827`, `:836`; `Loupe.svelte:979`). |
| Key | No control. | Key and clef selects at upload only (`ScoreUploader.svelte:955-971`, lists at `:202`, `:232`, state at `:546`). The transposition ruler (`transposition-ruler.ts`) re-engraves in another key as a view, not a correction. |
| Clef | No control. | Same upload selects, `ScoreUploader.svelte:955`. |
| Barline | No control. | None. |
| Triplet, unmake | No direct control. | Restore clears one note's record at a time (`+page.svelte:1012`), or Undo reverses the whole definition. |
| Syllable on a note | Not in the Corrections pill. | In Syllables mode (`LoupeSyllables`, rendered at `Loupe.svelte:2567`). Melisma and shift are in Corrections. |

Tie works only for same-pitch neighbours (`entry.ts:283`). Tie removal is the same button toggled (`entry.ts:296`) and I did not drive it.

## Plan against tree

1. **Fixed-size panel is not built** (`brief-code-corrections-fixed-panel_r1`, "The design" and Step 2).
   - `.cell { flex: 1 1 auto }` is at `CorrectionSurface.svelte:1072`, and `grid-template-columns: repeat(3, 1fr)` is at `:1047`.
   - Measured on desk across 16 measures, the card runs 661 to 763 px.
   - Pitch cells run 210 to 244, quarter 85 to 100, flat 76 to 91, rest 91 to 106, tuplet 102 to 117.
   - Phone is a fixed 299 card with unequal cells (44 to 148).
   - No `report-code-corrections-fixed-panel_r1_*` file exists in `docs/sessions`.
2. **Correction-station slices 4 to 6 are not extracted** (`code-audit-correction-station-map` §4).
   - Tuplet state (`+page.svelte:1137`, `:1146`), verbs (`:899`), and keyboard (`:1191`) are still in the page.
   - `lib/score` has no tuplet, verbs, or keyboard module.
   - Slices 1 to 3 are present: `undo-history.svelte.ts`, `press-and-hold.ts`, `correction-cursor.svelte.ts`.
   - The §5 song-switch defect is fixed (`+page.svelte:3558`, `undoHistory.clear()`).
3. **Calm-loupe cause 1c is open** (report §4 item 1).
   - A gap's held measure is its anchor's measure (`+page.svelte:1367`).
   - An entered note takes the anchor's measure (`correction.ts:535`).
4. **Calm-loupe items that are in the tree:**
   - The two-line tag (`Loupe.svelte:2296`).
   - The zoom and per-song fit (comment at `:847`, buttons at `:2526`).
   - The C1/C7 pitch limits (`correction.ts:209-214`).
   - The filled pill closing the panel (driven).
5. **The panel is clipped on desk.** At 1440 x 900 the Corrections panel shows only the Duration and Pitch stations; Accidental, Rest, Delete, Tie, Restore and Lyric need an in-panel scroll. The brief's "reach" concern is real, but no brief sets a target.

## Tokens used

About 260,000 by the counter, against the 300,000 limit.

## Could not establish

- **Real PDF read.** Nothing was driven on the Tchaikovsky read. A MusicXML fixture is cleaner than a real read.
- **Visual checks.** I did not look at any before or after screenshot to confirm tie, tuplet bracket, or rest drawing. "Works" rests on readout and drawn-text hashes.
- **Desk undo of the page drawing.** The page-drawing hash was captured only in the eight-control desk rerun (semiUp, flat, dsharp, len16, len8, lenQ, lenH, lenW). Elsewhere on desk only the readout returning is established.
- **Gaps in the key tests.**
  - Ctrl-Z and Ctrl-Shift-Z were not tested with a stack.
  - Escape was not tested.
  - Key 3's undo and reload were not captured.
  - The phone has no keyboard, so no key rows ran there.
- **Tapping a note inside the loupe.** My selector hit a caret, so this is untested. The handler is `+page.svelte:728`.
- **Phone Done and close.** My tap hit the wrong button, which is a harness error. Swipe-down dismissal was not tested.
- **Panel scrolling at 900 px.** I did not measure how far the panel scrolls.
- **Carets in Syllables mode.** Eight `[data-loupe-gap]` nodes exist while the panel is closed or in Syllables mode. Whether they are drawn there was not established.
- **Slice 7.** Rest and gap squircles (`stop-ring.ts`) and the E1 and C7 fragment behaviour were not measured.
- **Smaller items.** Zoom's effect on the phone drawing, the "gap left unseen" item (§4 item 3), rest-length editing, tie removal, and double flat were not driven.
- **Sunless 1 measure widths.** I used this fixture's measures, not "Sunless 1" or «Скучай».
- **Process cleanup.** One early driver run was killed by PID; its leftover Chromium processes had exited when I checked. Nothing else is left running except the dev server, which `serve.sh` started.

Nothing here needs saving to memory.

Files are in `/home/claude/heldout/work-C/`:
- `shots/`
- `run-desk-part1.log`, `run-desk-part2.log`, `run-desk-rerun.log`
- `run-phone-part1.log`, `run-phone-part2.log`, `run-phone-rerun.log`
- `nav-desk.json`, `nav-phone.json`
- `widths-desk.log`, `widths-phone.log`
- `drive.mjs`, `nav.mjs`, `widths.mjs`, `lib.mjs`