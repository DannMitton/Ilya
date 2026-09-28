# The Correction Station in +page.svelte: map and slices

**r1, 2026-09-27, by Code.** Answers §3 of
`brief-code-audit-correction-station_r2_2026-09-27.md`. Every line number is
`apps/web/src/routes/+page.svelte` at `f5d0dd4`, read on branch `Shane` with a
clean tree. Read old lines with `git show f5d0dd4:apps/web/src/routes/+page.svelte`.

## 1. What the station holds (lines 640 to 1,495)

**State (`$state`).** `selectedEventId` 785, `gapAfter` 823, `armedBase` 855,
`armedDots` 856, `undoStack` 963, `redoStack` 975, `tupletOpen` 1332,
`tupletDef` 1334. Two plain `let`s: `holdTimer` and `holdBeat` 1292 to 1293,
and `tupletBase` 1335.

**Derived (`$derived`).** `readLine` 788, `correctedLine` 797,
`correctedCount` 799, `orphanCount` 806, `selectedEvent` 808, `cursor` 825,
`inGap` 833, `scoreClef` 859, `arrival` 865, `gapAnchor` 870, `heldMeasure`
881, `heldFill` 885, `heldMeter` 894, `selectedLabel` 900, `selectedBase` 907,
`selectedDots` 910, `selectedDotted` 913, `restoreAvailable` 1160,
`tieAvailable` 1265, `selectedIsRest` 1269, `selectedTied` 1272, `tupletFits`
1337, `correctedScore` 1478.

**Functions.** Placement: `handleStartPlacementOver` 640,
`placeSyllableOnSelected` 710, `handleNotePick` 745, `handleLoupePick` 761,
`handleLoupePickGap` 773. Cursor: `setCursor` 835, `handleMove` 1130. Undo:
`snapshot` 978, `restore` 989, `pushUndo` 997, `handleUndo` 1002,
`handleRedo` 1010. Pitch: `correct` 1032, `handleStep` 1038, `handleOctave`
1047, `spellingContextFor` 1067, `handleSemitone` 1077, `handleAccidental`
1089. Duration: `durationWord` 1027, `handleBase` 1104, `handleDot` 1113,
`handleDurationCell` 1192, `handleDotCell` 1219. Entry: `handleDeleteNote`
1137, `handleRestoreNote` 1167, `handleRest` 1242, `handleTie` 1257. Hold:
`stopHold` 1295, `onhold` 1302. Tuplet: `openTuplet` 1341, `closeTuplet`
1346, `applyTupletDefinition` 1351. Keyboard: `handleCorrectionKey` 1386.

**What it reads from outside itself.** `doc` (`corrections`, `pairings`,
`seatedText`, `inputText`), `ingestedScore`, `language`, `eventIds` (1759),
`heldMeasureIndex` (1575), `dismissLoupe` (1967), and for
`handleStartPlacementOver`: `flushText`, `poemQueue`, `scoreTextQueue`,
`scoreText`, `transcribedText`, `seatFilledPoem`, `orphanedCount`.

## 2. Every reader and writer outside the station

**Writes from outside.** `setCursor` at 1963 (a page tap raises the loupe)
and 1969 (`dismissLoupe`). `closeTuplet` and `stopHold` at 1970 to 1971
(`dismissLoupe`). `pushUndo` at 1786 (`handleMelisma`) and 1816
(`handleDockShift`). No other line outside the station assigns a station
`$state`.

**Reads from outside.**

- `selectedEventId`: 1662 (readout), 1762 (`dockShiftAnchor`), 1783, 1795,
  1805 (melisma), 5083 (`MarkupPane`), 5206 (`Loupe`).
- `selectedEvent`: 1576 to 1577 (`heldMeasureIndex`), 1686, 1693, 1702.
- `inGap`: 1578, 1640, 1702, 1805, 5176.
- `correctedLine`: 1579, 1596, 1604, 1613, 1619, 1695, 1755, 1759.
- `cursor`: 5198 (the loupe's `{#if}`).
- `undoStack` and `redoStack`: 1831 to 1832 (the pill labels).
- `handleUndo` and `handleRedo`: 5226 to 5227 (`Loupe` props).
- `armedBase`, `armedDots`: 5177 to 5178. `tupletOpen`, `tupletDef`,
  `tupletFits`: 5189 to 5191. `correctedScore`: 5057 and 5088.

## 3. The seam

**A class with `$state` fields in a `.svelte.ts` module, handed `read` and
`write` closures for the state it does not own.** The pill labels read the
stacks inside `$derived`, so the stacks must stay reactive, and a class keeps
them so without the page holding them. Context would add a provider for state
that has one consumer. A plain TypeScript module would leave the page holding
the `$state` and the move would save little. Under vitest the runes are inert
(`document.svelte.ts` records why), so the class runs there as a plain class
and its logic is testable.

## 4. The slices

1. **Undo and redo.** `WRITTEN` 2026-09-27: `lib/score/undo-history.svelte.ts`
   and its test. The page keeps `pushUndo`, `handleUndo`, and `handleRedo` as
   bindings, so no caller changed.
2. **Press and hold.** `onhold` and `stopHold` touch no page state; a plain
   module. The lowest-risk slice left. `WRITTEN` 2026-09-27:
   `lib/score/press-and-hold.ts` (`createPressAndHold`) and its test. The
   page destructures `onhold` and `stopHold` from it, so no caller changed.
   `+page.svelte` 6,135 to 6,097 lines.
3. **The cursor.** `selectedEventId`, `gapAfter`, `cursor`, `inGap`,
   `setCursor`, `handleMove`. The most readers outside (§2), all read-only
   except `dismissLoupe` and the page tap.
4. **The tuplet row.** `tupletOpen`, `tupletDef`, `tupletBase`, `tupletFits`,
   and the three functions. Needs slices 1 and 3.
5. **The verbs and the selection readings.** Pitch, duration, rest, tie,
   delete, restore, and the `selected*` deriveds. Needs slices 1 and 3.
6. **The keyboard.** `handleCorrectionKey`, last, because it calls every
   other slice.

## 5. A defect found, not fixed

**The undo stack survives a song switch.** READ IN CODE, NOT REPRODUCED.
`switchSong` (3788; the resets at 3799 to 3812) resets the outgoing song's session state and then
assigns `doc = next`, but nothing clears `undoStack` or `redoStack`. An undo
pressed after a switch writes the OUTGOING song's `corrections`, `pairings`,
and `seatedText` into the incoming song's document, which autosaves. Left as
it was by the brief's §5 ("If you find a bug, report it and leave it"). The
fix is one call in `switchSong` once Dann rules it in.

**Update, 2026-09-27.** Reproduced in the browser, then fixed by
`brief-code-undo-cleared-on-song-switch_r1_2026-09-27.md`: `UndoHistory.clear`,
called in `switchSong`. `WRITTEN`.
