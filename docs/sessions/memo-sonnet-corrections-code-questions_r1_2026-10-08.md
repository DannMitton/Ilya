Returned by a Sonnet research agent, 2026-10-08, commissioned by the desk on Dann's yes of 16:10. Read-only.

# Corrections panel: what today's code says

Source: a shallow clone of DannMitton/Ilya, branch Shane, HEAD 8f59ba6 (the expected commit). Nothing was written to the tree and no git command that writes was run. Paths below are under `apps/web/src/` unless they begin `packages/`. Where I infer rather than read, the word INFERENCE marks it.

## 1. Does the Loupe know where a printed system ends?

It knows where a RENDERED system ends, not a printed one.

- The Loupe reads the page's own markup: `lib/score/Loupe.svelte:1050-1054` loops `container.querySelectorAll('[data-system]')` and builds `ranges` with `parseSystemRange` (`lib/score/loupe.ts:40`, attribute form `"12-17"`).
- `systemIndexOf(ranges, measureIndex)` (`loupe.ts:57`) answers which system holds a bar. Its only output is the measure tag: `Loupe.svelte:1992-1993`, `system: systemIndexOf(ranges, measureIndex) + 1, systems: ranges.length`.
- Those ranges come from the app's own repacking. `packages/score-parser/src/page-layout.ts:238-255`: "Pack measures into systems against the inner width", adding bars while `sliceWidth(...) <= innerWidth`. The attribute is written at `page-layout.ts:415`.
- The scan's printed line breaks are not kept. `lib/omr/join-pages.ts` numbers measures "from 1" across pages and has no system notion (grep for "system" in the file returns nothing). homr's `<!-- imgpos: x, y -->` comment travels with each note (`join-pages.ts:23`), but nothing outside that header comment reads it (grep `imgpos` in `lib/`: one hit).
- Nothing the Loupe exposes names "last bar of its system". `ranges` is local to the render function; only `system` and `systems` leave it.

So "which bars share a line on the Paper" is answerable for the app's re-engraved page (it changes with page width), and NOT ESTABLISHED for the scan's printed lines.

## 2. How a correction is stored; removing a run; undo

- Type: `lib/score/correction.ts:48`, `interface NoteCorrection { pitch?, base?, dots?, deleted?: true, entered?: {after}, type?: 'note'|'rest', tied?: 'start'|'none', tuplet? }`.
- Shape: `correction.ts` `CorrectionMap = Record<string, NoteCorrection>`, keyed by event id, "a diff, not an edited score" (header, `correction.ts:7-17`). Per song it is `SongRecord.corrections` (`lib/library/types.ts`), held live as `doc.corrections` (`lib/library/document.svelte.ts:77`).
- A removal is one record per note. `routes/+page.svelte:991-992`: `pushUndo({ kind: 'text', key: 'loupe.undo.deleted' }); doc.corrections = withCorrection(doc.corrections, id, { deleted: true });`. No range record exists. I searched `+page.svelte`, `entry.ts`, `correction.ts`, and `correction-cursor.svelte.ts` for multi-select, range, and run-delete terms and found none.
- Undo is one step per call of a verb, so deleting n notes is n steps. `lib/score/undo-history.svelte.ts` `push` appends one snapshot per call (`undoStack = [...undoStack, snapshot]`, `redoStack = []`). `handleDeleteNote` (`+page.svelte:982`) pushes once per note.
- The exception is the tuplet: it is one step for a whole run. `+page.svelte:1131-1135` ("ONE UNDO REVERSES THE WHOLE OPERATION"), with `tupletBase` snapshotted at `:1156-1165`. That is the existing pattern for a multi-note act.
- The stack is in memory (`$state`), and each entry snapshots corrections, pairings, cursor, and seated text (`undo-history.svelte.ts` `UndoState`). I found no persistence of it.

## 3. Accidentals

- Storage: an accidental is not stored as an accidental. A pitch correction holds a whole `Pitch` (`packages/score-parser/src/types.ts:519-531`: `step`, `octave`, `alter` from -2 to +2). `handleAccidental` (`+page.svelte:950-966`) computes `flatPitch/sharpPitch/naturalPitch(p)` and calls `correct({ pitch: next })`.
- Spelling context: `spellingContextFor` (`+page.svelte:928`) returns only `{ key, previous }`, "the key in force in this note's own measure, and the note before it". It looks at no earlier accidental in the bar.
- Carry exists only in drawing. `packages/score-parser/src/staff-renderer.ts:456-505`: `accidentalKey(p)` is `${step}${octave}`, and `advanceAccidentalState(pitch, fifths, measureAcc, prevMeasureAcc)` returns `'none' | 'required' | 'courtesy'`, with "a drawn accidental ... puts the note's alter into `measureAcc`, so the rest of the bar is governed by it". So the picture already carries an accidental through the bar; the data does not.
- What "carries through the bar" would need (INFERENCE): the model holds absolute pitches, so a later same-letter, same-octave note in the bar keeps whatever pitch the reader gave it. A carry would be either (a) an act that writes `pitch` corrections onto each later `step+octave` match in that bar (n records, one undo push if wrapped as the tuplet is), or (b) a new bar-level field. Option (a) needs no schema change. Whether homr already writes `<alter>` on each carried note is NOT ESTABLISHED (I did not open `lib/score/ingestion/recognized-to-musicxml.ts`).

## 4. The Syllables panel

Syllables mode (`lib/score/Loupe.svelte:2564-2567`, `{#if mode === 'syllables'}` renders `LoupeSyllables`) holds:
- the syllable tray: one button per slot, `onclick={() => tap(it.index)}` (`lib/score/LoupeSyllables.svelte:173,189`), which calls `placeSyllableOnSelected`;
- `LoupePlacementRow` (`LoupeSyllables.svelte:193`): a Clear pill with scopes (`loupe.place.clear`, `loupe.place.scope.*`) and a "Place from here" pill (`lib/score/LoupePlacementRow.svelte:28-47`). Scopes are `all`, `toEnd`, and the bar (`lib/score/placement-scope.ts:47-53`).

Melisma and lyric shift are NOT in Syllables. They are in Corrections, in `CorrectionSurface.svelte`: a LYRIC station with `onmelisma` (`:131`, button at `:773-780`), `loupe.lyric.toEnd`, and `loupe.lyric.toNextOpen` shift arrows (`:784-813`, both `disabled={shiftDisabled || inGap}`). Corrections mode renders the surface through `{@render corrections?.()}` (`Loupe.svelte:2569`).

## 5. Is the cursor set when the Loupe or Corrections opens?

- Start state is empty: `lib/score/correction-cursor.svelte.ts:40-41`, `selectedEventId = $state<string | null>(null); gapAfter = $state<... | undefined>(undefined);`.
- The Loupe opens only from `handlePageTap` (`+page.svelte:1636`), whose tail is `setCursor({ kind: 'entry', id }); loupeOpen = true;` (`:1756-1757`), where `id` is the nearest tapped note (`nearestTarget`). So opening the Loupe sets the cursor to a note.
- The Loupe cannot stand without one: `$effect(() => { if (!loupeAvailable || !cursor) loupeOpen = false; })` (`+page.svelte:1811-1813`) and the mount guard `{#if loupeAvailable && loupeOpen && cursor}` (`:4976`).
- Choosing Corrections does not set the cursor. `LoupePanel.choose` (`lib/score/loupe-panel.svelte.ts`) changes `mode`/`open` only, and calls the callback only when carets are hidden (`leaveGap`, moving a gap-standing bar to an entry). The Loupe opens on Syllables and the panel resets on every close (`loupe-panel.svelte.ts:74-75`; `+page.svelte:1335-1338`).
- `dismissLoupe` clears it: `setCursor(null)` (`+page.svelte:1762`).

## 6. Bar checks that exist

1. **Bar fill tag in the Loupe.** `measureFill` (`lib/score/entry.ts:412-460`) sums `duration.fraction` of the corrected line for a bar against its own signature and returns `{ actual, expected }` in units of the signature's denominator, or null when equal (`:460`). Fed by `heldFill` (`+page.svelte:825-828`). The tag prints "short" or "over" (`Loupe.svelte:2167-2173`). Names: the finding only (amount over or short), no fix. It runs on the corrected line and only for the bar held.
2. **"Does not add up" (Insights).** `lib/i18n.ts:1681-1682` (`insights.phonation.untrustedOne/Many`), shown at `lib/insights/InsightsPane.svelte:759-767` from `model.phonation.untrustedMeasures` (`:271`). Source: `packages/score-parser/src/phonation.ts:300-352`. A bar is `'untrusted'` only when the notation reading and the `fraction` reading DISAGREE and neither equals the metre. If the two readings agree, the verdict is `'agreed'` even when the bar does not fill its metre (`phonation.ts:329-331`), so it is not flagged. Pickups and no-metre bars are exempt. It is fed `correctedScore` (`+page.svelte:4833`). Names: bar numbers only. A second use is "Not printed: measure ... does not add up" (`i18n.ts:1616-1617`, via `insights.ts:359-363`).
3. **`triplets.ts`** (read-time, `lib/omr/triplets.ts`, called from `join-pages.ts:241`). `completeTriplets` returns `rule: 1 | 2 | 3 | null` (`triplets.ts:111-118`), but `join-pages.ts:241-243` uses only `divisions`; the rule is discarded and no list of changed bars is kept. Rule 3 applies only when exactly one set of runs fits: `onlyRunsThatFill` stops once `found.length > 1` and returns null (`triplets.ts:160-179`), so with two fits the candidates are NOT retained. A bar it leaves alone comes back identical, and nothing records that it was considered. Names: one fix (applied silently) or nothing; never several candidates.
4. Anything else: `lib/analysis/watchlist.ts` is acoustic (singer-profile challenges), not a bar-arithmetic check. `lib/score/reconciliation/*` concerns text witnesses. I found no further bar check; NOT ESTABLISHED beyond what I grepped (`untrusted`, `measureFill`, `fill`, `completeTriplets`).

## 7. Where a per-song, per-bar flag would live

- IndexedDB database `ilya-library` (`lib/library/driver.ts:409`, version 1), stores `songs` (keyPath `id`, indices `by-updated`, `by-fingerprint`), `sources` (keyPath `songId`, holds the scan bytes), and `meta` (`driver.ts:411-426`).
- A song row is `SongRecord` (`lib/library/types.ts`): `schema, id, name, createdAt, updatedAt, poem, metadata, fromScore, glosses, openSyllabification, pairings, corrections, seatedText?, transposition?, source`.
- Per-note user state already exists, keyed by event id: `pairings` (`PairingMap`, sparse; `lib/score/pairings.ts:132`) and `corrections`. Per-bar user state: none. `transposition` is per song.
- Loading rebuilds the record field by field in `validateRecord` (`lib/library/library.ts:136`, see `:155-216`). A field not copied there is dropped on every load, the bug the file's own comment at `:214-225` records for `source`. A new optional field (absence = default) would follow the `seatedText` and `transposition` pattern (`library.ts:198-213`), plus a save site (`document.svelte.ts:256` builds the saved fields; `:305` restores them). Event ids carry the measure and position (`m{measureIndex}-...`, `types.ts` around line 467), so a bar key can be derived, but ids depend on reader determinism (`correction.ts:15-17`).

## 8. Data for "the same rhythm"

No comparator exists (grep for same-rhythm, rhythm-fingerprint, and duration-sequence terms: none). The data does: each `VocalLineEvent` has `measureIndex` and `duration: { base, dots, tuplet?, fraction }` (`types.ts:545-562`), and type note/rest through `currentType` plus tied state through `currentTie` (`entry.ts`). A per-bar sequence of `fraction` (plus rest flag) could be compared from `correctedLine`. This would be new code (INFERENCE).

## 9. Keyboard

The one global key handler is `handleCorrectionKey`, bound on `<svelte:window on:keydown>` (`+page.svelte:4157-4158`, function at `:1191`).
- Claimed: ArrowUp, ArrowDown (Shift = octave), `+`, `=`, `-`, `_`, ArrowLeft, ArrowRight, `.`, Delete, Backspace, Escape, and the digits `3 4 5 6 7` (`DIGIT_BASE`, `correction.ts`). With Cmd/Ctrl: `z` (undo), Shift+`z` and `y` (redo) (`+page.svelte:1217-1233`).
- No bare letter is claimed. V, T, P, L, M, D, H do not collide with this handler. The fall-through is `default: if (DIGIT_BASE[e.key]) ... else return;` so unclaimed keys pass on (`:1270-1272`).
- Modifier guard: `if (e.metaKey || e.ctrlKey || e.altKey) return;` after the undo block (`:1239`). A Cmd/Ctrl letter would need to sit above it.
- Mode gate: `if (!loupePanel.musicKeys && !['ArrowLeft','ArrowRight','Escape'].includes(e.key)) return;` (`:1241`). A new letter key would be dead in Syllables mode unless added to that list.
- Stand-down: `keyOwnedElsewhere` skips inputs, textareas, selects, contenteditable, and `[role="tablist"]` (`loupe-panel.svelte.ts` `KEYS_OWNED_ELSEWHERE`).
- Other handlers: the Loupe's tablist handles ArrowLeft/Right, Home, End (`Loupe.svelte:2268-2271`); `lib/voice/ProfileSwitcher.svelte:219-222` claims Escape when open; `InspectorPanel.svelte:881` adds a capture-phase Escape. No other letter handlers found by grepping `keydown` across `.svelte` and `.ts` files (accesskey: none).

## 10. When Restore, Tie, and the triplet are disabled

- Restore, `+page.svelte:1005-1010`:
```
const restoreAvailable = $derived(
	!inGap &&
		!!selectedEventId &&
		selectedEventId in doc.corrections &&
		!isEnteredId(selectedEventId),
);
```
  Button: `disabled={!restoreAvailable}` (`CorrectionSurface.svelte:731`). `isEnteredId` is `id.startsWith('hand:')` (`entry.ts:177-181`).
- Tie, `+page.svelte:1109-1111`:
```
const tieAvailable = $derived(
	!inGap && !!selectedEventId && canTie(correctedLine, doc.corrections, selectedEventId),
);
```
  Button: `disabled={!tieAvailable && !selectedTied}` (`CorrectionSurface.svelte:720`), so a tie already on can always be removed. `canTie` (`entry.ts:283-294`) needs a next entry, both entries notes, and identical step, alter, and octave.
- Triplet, `+page.svelte:1142-1144`:
```
const tupletFits = $derived(
	!inGap && !!selectedEventId && tupletRun(correctedLine, selectedEventId, tupletDef.actualNotes).length > 0,
);
```
  The opener button is disabled only in a gap: `disabled={inGap}` (`CorrectionSurface.svelte:591`). `tupletFits` greys the definition row (`class:idle={!tupletFits}`, `:557`) and `applyTupletDefinition` returns without change when `tupletRun(...).length === 0` (`+page.svelte:1156`). `tupletRun` (`entry.ts:343-359`) is empty if the run passes the end of the line or crosses a barline.

## Could not establish

- The scan's printed system breaks (Q1): no record of them in the stored model. Only the app's own width-packed systems are readable.
- Whether homr's MusicXML already writes `<alter>` on every carried accidental (Q3); `recognized-to-musicxml.ts` was not opened.
- Which other bar checks exist beyond the three found (Q6); my search was by term, not a read of every module.
- Whether the undo stack has a depth cap (Q2); I read only the class head, not a cap constant.

Terms I coined: "rendered system" for the app's repacked line, to separate it from the scan's printed line. All other terms are the code's own.
