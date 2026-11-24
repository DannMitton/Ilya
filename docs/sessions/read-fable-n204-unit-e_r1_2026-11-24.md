# read-fable-n204-unit-e_r1_2026-11-24

Judgement read of unit e, the Loupe and Corrections, under `plan-code-audit-maintainability_r9_2026-11-23.md` sections 3, 4, 4a, and 5b, and `brief-fable-n204-unit-e_r1_2026-11-24.md`. Written by Fable (the reader). Nothing in the repository was changed except this file.

**Read against:** `Shane` at `50315f2e` (ran, `git rev-parse`). The working tree carried uncommitted changes under `docs/` only (ran, `git status`), none in the unit.
**Size (ran, `wc`):** 37 files, 11,696 lines. All 37 were read whole.
**Path prefix:** `S/` is `apps/web/src/lib/score/`. `P/` is `apps/web/src/routes/+page.svelte`. `R/` is `packages/score-parser/src/`.
**"ran"** marks a claim settled by a command. Runs of the unit's own code were made on copies in `/tmp` under plain Node with a four-line stand-in for `@ilya/score-parser`; the copies were deleted. Vitest does not start in the bridge VM (the tree's `node_modules` holds macOS binaries and the VM is Linux arm64), so nothing here rests on the test suite.
**No browser was available.** Every finding that needs the page says so.

**Findings by tier:** tier 4, eight; tier 3, two; tier 2, thirteen; tier 1, fourteen groups. **Blockers under ONE VOWEL PER NOTE: none found.** No path in these 37 files writes a syllable to a note; the placement and the fill are called from here and carried out elsewhere (section 8, item 1).

**The three that matter most, in a singer's words:**

1. **With the tuplet row open, defining a tuplet on one note and then nudging the row on another note removes the first tuplet and every correction made in between, and Undo treats all of it as one step.** (D1, ran.)
2. **A note she adds after a grace note disappears from the music when she deletes the grace note's main note, and Ilya does not count it as lost.** (D2, ran.)
3. **Deleting a note she added by hand leaves nothing selected, and by reading the Loupe closes under her hand.** (D3, the cause ran; the closing is by reading.)

**The one thing most worth the desk's attention is not a defect.** The two files that open this unit still describe the Loupe as a clone of the page (`S/Loupe.svelte:9-14`, `S/loupe.ts:4-6`). Since N.153 stage 3b it draws its own one-measure engraving (`S/loupe-render.ts:1-3`, `S/Loupe.svelte:570`). A large share of the 1,440-line `attempt` closure was written for the clone, and nobody has established which of its branches a one-measure render can still reach. Tier 3 cannot be cut well until that is measured (T3-1).

Terms I coined in this report: "clone-era" (code and comments written while the Loupe showed a crop of the page's own system), "no-op record" (a stored correction that restates what the read already says), "by-principal partition" (grace notes grouped under the note they hang on, split into before and after). Every other term is the tree's.

---

## 1. The paragraph a developer needs

**What it is for, as a musician meets it.** A scanned or imported song arrives with wrong notes in it. The singer taps a bar on the MELODY page and a card rises over the page: the Loupe. It shows that one bar, engraved again at a size a finger can work on, with its clef, key, and meter in front of it and a short run of stave after its barline so it reads as an excerpt. The card has two modes. **Syllables** lists the poem's syllables; a tap on one seats it on the note she has taken. **Corrections** draws a small caret in every space between notes and opens the correction cells: lengths, pitch steps, accidentals, rest, tie, barline, grace note, key and time signature, tuplet, delete, restore. She moves a cursor that stands either on an entry or in a gap between two, the way Finale's Speedy Entry does. Everything she does is kept as a list of amendments keyed to each note's id, never as an edited score, because the scan is read again from its stored bytes on every reload and her work has to land on the new read.

**What it is in the code.** Four layers, and the folder does not show them.

- **The correction model, pure.** `S/correction.ts` is the amendment record (`NoteCorrection`, `S/correction.ts:49-169`) and `applyCorrections`, which turns the read line plus the map into the line the page draws (`S/correction.ts:450-567`). `S/entry.ts` is the cursor grammar, entering, rest, tie, tuplet, and the beat arithmetic. `S/grace-layer.ts` and `S/grace-verbs.ts` do the same for grace notes; `S/entry-marks.ts` moves a bar's marks when a note is entered at its head.
- **The station's state, as classes the page constructs.** `CorrectionCursor`, `CorrectionVerbs`, `TupletRow`, `UndoHistory`, `LoupePanel`, and the factories `createCorrectionKeys`, `createPressAndHold`, `createUndoHistory`. Each was lifted out of `P/` and takes closures over the song document. The page wires them at `P/:804-975`.
- **The Loupe's arithmetic and readings.** `S/loupe.ts` (pure geometry), `S/loupe-render.ts` (the one-measure render and the search for a spacing that keeps carets 44 px apart), `S/loupe-ink.ts` (what a rendered system holds, read off the DOM), `S/selection-ring.ts` and `S/stop-ring.ts` (the squircle), `S/loupe-hold.ts` (the card holds its size and follows the taken note), `S/loupe-fit.ts` (one notation size per song, and the zoom), `S/loupe-edge.ts`, `S/loupe-place.svelte.ts`, `S/loupe-swipe.svelte.ts`, `S/loupe-tween.svelte.ts`.
- **The components.** `Loupe.svelte` draws the card; `LoupeHeader`, `LoupePrintStrip` (the singer's own scan at this bar), `LoupeSyllables`, `LoupePlacementRow`, `CorrectionSurface`, and `GraceCells` are its parts.

**Three things a newcomer will get wrong without being told.** (1) `<Loupe>` is destroyed every time it closes (`P/:4514`), so anything that must outlast a close lives in a module-level object: `loupePanel` on the page, `songSizes` and `loupeZoom` (`S/loupe-fit.svelte.ts:52-53`), `loupePrint` (`S/loupe-print.svelte.ts:212`). (2) The Loupe's drawing is the renderer's SVG string, mounted off-screen to be measured and parsed a second time to be drawn (`S/Loupe.svelte:463-483`, `:1056-1061`); every reading in it depends on `data-` handles and on the order the renderer paints in. (3) `CorrectionSurface` has one mount, inside the Loupe's panel, as `variant="panel"` (`P/:4469-4470`); its `dock` variant, which its own header presents as half of its purpose, is never used (finding 1.1).

---

## 2. The findings

### Tier 4: behaviour defects, in the order a singer meets them

Each is its own lane. None is refactoring.

**D1. A second tuplet erases the first, and what came between.**
*What a singer reads differently:* she opens the tuplet row on a note and sets a triplet. With the row still open she steps to a later note and nudges the row. The first triplet is gone, any pitch or length she corrected since the first nudge is gone, and one Undo takes back everything.
*Mechanism.* `TupletRow.apply` keeps `#base`, the map as it stood before the row first applied, so that many nudges make one undo step (`S/tuplet-row.svelte.ts:14-18`, `:76-80`). `#base` is cleared only by `openRow` and `close` (`S/tuplet-row.svelte.ts:60-68`), and the page calls `close` only from `dismissLoupe` and the row's own back chevron (`P/:1405`, `P/:4508`). Nothing clears it when the selection moves, so the next nudge applies the definition to the new note on top of the old base. **Ran:** tuplet on `n0`, a pitch correction on `n5`, selection to `n3`, apply; the map then held `n3, n4, n5` with the tuplet only, and one undo entry.
*Smell:* temporal coupling; a cached base with no owner for its lifetime. *Repair:* key `#base` to the taken entry and start a fresh base (and a fresh undo entry) when the entry changes. *Risk:* low. *Proof:* a new case beside "the base is the map as it stood at the first apply" in `S/tuplet-row.test.ts`.

**D2. A note entered after a grace note vanishes when the grace note's main note is deleted.**
*What a singer reads differently:* she adds a note at the caret after a grace note, then deletes the main note the grace note leaned on. Her added note is no longer drawn, and the count of corrections that failed to land does not include it.
*Mechanism.* An entry made after a read grace note is anchored to the grace note's id and is emitted only through the principal's branch of the walk (`S/correction.ts:483-491`, `:544`, `:550`, `:564`). The branch for a principal that no longer stands emits the entries hung on the principal and nothing hung on its grace notes (`S/correction.ts:553-560`). `orphanIds` treats a grace id as live, so the entry is not reported (`S/correction.ts:889-905`). **Ran:** before the deletion the line read `a, hand:1, b, c`; after it, `a, c`, with no orphan.
*Reachable* because grace notes are stops with a caret after them (`S/grace-layer.ts:191-211`, `P/:825`). *Repair:* carry the grace-anchored entries forward with the grace notes, as `carried` already does for a grace note made a full note (`S/correction.ts:469`, `:545`). *Risk:* medium; `applyCorrections` is the centre of the model. *Proof:* a new case in `S/correction.test.ts`; `S/grace-layer.test.ts` as the guard.

**D3. Deleting a hand-added note leaves the cursor nowhere.**
*What a singer reads differently:* she deletes a note she entered herself and, by reading, the Loupe closes; she has to tap the bar again.
*Mechanism.* `handleDeleteNote` looks for the neighbour in the line as the reader read it, unless the entry is a grace note (`S/correction-verbs.svelte.ts:352-362`). A hand-added note is not in that line, so `neighbourId` answers null both ways (`S/correction.ts:809-811`). **Ran:** both lookups returned null, while the same lookup in the corrected line returned the next note. The page then sets the selection to null (`P/:898`), the cursor is null, and the Loupe is drawn only while there is a cursor (`P/:4514`). The comment states the intent the code misses: "so the singer is left somewhere rather than nowhere" (`S/correction-verbs.svelte.ts:352-354`).
*Repair:* look in the drawn line for every entry. *Risk:* low. *Proof:* extend the delete case at `S/correction-verbs.test.ts:235-241` with an entered id. **The closing of the Loupe is by reading; the page must confirm it.**

**D4. A press that changes nothing still leaves a correction behind.**
*What a singer reads differently:* she turns a tie on and off again, or presses the length a note already has. Restore lights for that note as though it had been corrected, and for the second case there is no Undo step for what was written.
*Mechanism.* `toggleTie` and `toggleRest` write straight into the map and never prune (`S/entry.ts:256-276`, `:307-310`), while every other verb goes through `withCorrection`, which removes a record that says nothing (`S/correction.ts:368-399`). **Ran:** tie on, tie off left `{"a":{"tied":"none"}}`. `handleBase` pushes an undo entry only where the length differs but writes the length regardless (`S/correction-verbs.svelte.ts:332-339`); **ran:** `withCorrection({}, 'a', { base: 'quarter' })` keeps the record. Restore reads any such record as a correction (`S/correction.ts:426-430`, `S/correction-verbs.svelte.ts:214-217`), and the page's test for "no corrections at all" counts keys (`P/:827`, `P/:983`).
*Repair:* compare against the read before writing. *Risk:* low. *Proof:* cases in `S/entry.test.ts` and `S/correction-verbs.test.ts`.

**D5. The tuplet row's back chevron is 32 px on a phone.**
*What a singer reads differently:* the one control that leaves the tuplet row is smaller than every other control on the surface.
*Mechanism.* `.back` sets 32 px both ways with no coarse-pointer rule (`S/CorrectionSurface.svelte:1195-1197`); the file's own header calls the 44 px floor unconditional on every control here (`S/CorrectionSurface.svelte:34-35`). By reading; the page must confirm the size.

**D6. A screen reader names the whole placement row "Clear placements".**
*What a singer reads differently:* with a screen reader, Place from here and the break button are announced inside a group named for a different button.
*Mechanism.* The group's `aria-label` is the Clear pill's own key (`S/LoupePlacementRow.svelte:32`, `:38`). By reading. The fix needs a string, so it is Dann's.

**D7. Latent: a correction on a file whose note ids have four dash-separated parts would not survive a reload.**
*What a singer would read differently:* her corrections to such a file would be reported as not landing after she reopens the song.
*Mechanism.* `migrateCorrectionIds` rewrites every key with exactly four dash-separated segments to its first and fourth (`S/correction.ts:857-871`), on every load (`apps/web/src/lib/library/library.ts:105`). Its comment rests on "a four-segment id is old, and nothing else is" (`S/correction.ts:840-844`). Since N.97b the MusicXML parser honours a file's own `<note id>` (`R/musicxml-parser.ts:728-732`), which can have any shape. **NOT ESTABLISHED** whether any file a singer has dropped carries ids of that shape. *Repair:* test for the old reader's prefix as well as the count. *Proof:* a case in `S/correction.test.ts`.

**D8. Possible: the Loupe's swipe guard answers to the transposition dock.**
The swipe and the "gesture began on our surface" flag look for `.loupe, .dock` (`S/loupe-swipe.svelte.ts:36`). The `.dock` it was written for is `CorrectionSurface`'s dock variant, which is never mounted (finding 1.1). The only `.dock` now on screen is `apps/web/src/lib/melody/TranspositionDock.svelte:156` (ran, grep). **NOT ESTABLISHED** whether that dock and the Loupe can be open together; if they can, a downward swipe on it closes the Loupe on a phone.

### Tier 3: the ratcheted hotspots

Both files sit exactly on their ceilings: `Loupe.svelte` 3008 of 3008 and `CorrectionSurface.svelte` 1227 of 1227 (`scripts/ratchets.json:11`, `:20`; ran, `wc`). The pressure shows in the code: an import left unindented and three statements on one line (`S/Loupe.svelte:30`, `:38`), and a key signature cell placed in `GraceCells` "because the surface has no line of room" (`S/GraceCells.svelte:16`).

**T3-1. `Loupe.svelte`: one effect holds the whole frame.**
*Anchor:* the `$effect` at `S/Loupe.svelte:501-2076` and the `attempt` closure inside it, `:555-1996`. *Smell:* Long Function, about 1,440 lines, with a body that shadows the component's props (`:569`) so the same code can draw another measure for the song's fit. Comment lines are 47 percent of the file (ran, section 4).
*Refactoring:* Extract Function along the seams the closure already has, into a module beside `loupe-ink.ts`: (a) read the mounted render (window, barlines, head, meter, stave), `:570-1003`; (b) place the carets, `:1315-1548`, whose core `placeMarks` (`:1425-1480`) is pure once ink is handed to it; (c) the body's clip, `:1776-1879`; (d) assemble the frame, `:1911-1995`. Slide Statements first for what reads the page and not the render: `sheet`, `room`, `pageMetrics`, `bare`, and `ranges` are recomputed inside every attempt (`:622-623`, `:1038`, `:1044`, `:1054`) though none depends on `minGap`.
*Before any cut:* find out which clone-era branches a one-measure render still reaches. Candidates, none established: `openingBarline` (the comment at `S/loupe.ts:708-709` says a slice's first column has no barline before it, and every Loupe render is now a slice of one measure); the foreign-marks pass (`S/Loupe.svelte:1854-1879`), which now can meet only the clef and key signature; `carryBand`'s mid-system case (`S/loupe.ts:639-643`); `openAfterPageMeter` (`S/loupe.ts:583-601`).
*Risk:* high. *Baseline:* serialize `frame` for every sung measure of the walk scores before and after, in the browser; `apps/web/e2e-phone/loupe-probe.ts` exists (ran, grep) and is unit t's. **NOT ESTABLISHED** whether that probe already records enough.

**T3-2. `CorrectionSurface.svelte`: remove the dead half before splitting anything.**
Finding 1.1 takes out the dock variant and its comments. After that the file has room, and the tier 2 move of the key signature cell (M6) can go back where it belongs. No split is proposed.

### Tier 2: moves across modules

| # | Anchor | Smell | Refactoring | Risk | Proof |
|---|---|---|---|---|---|
| M1 | "an event's own ink": `inkOf` `S/Loupe.svelte:1330-1352`; `markInk` `:1833-1853`; the first-note loop `:679-692`; `eventInk` `S/selection-ring.ts:154-178`; `followEntry` `S/loupe-hold.ts:134-148` | Duplicated Code, five homes | Extract Function into `loupe-ink.ts`; the others call it | medium | `selection-ring.test.ts`; the frame baseline of T3-1 |
| M2 | a glyph's ink by canvas: `textInk` `S/loupe-ink.ts:28-38`; `glyphInk` `S/selection-ring.ts:103-130`; `underlayRows` `S/loupe-hold.ts:176-190`; three lazily made canvases `S/loupe-ink.ts:26`, `S/selection-ring.ts:131`, `S/loupe-hold.ts:205` | Duplicated Code | Extract Function, one canvas | low | `loupe-ink-measure.test.ts`, `selection-ring.test.ts` |
| M3 | the staff from a hit rectangle, eleven spaces tall, staff 3.5 in: `S/loupe.ts:153-163`; `S/loupe-ink.ts:216-218`; `S/selection-ring.ts:254-259`; `S/Loupe.svelte:594-597`, `:668`, `:1584-1585` | a renderer fact recomputed in four files | Extract Function `staffOfHit`, and have the renderer export the two numbers so the relationship is a test | low | `loupe.test.ts:307` already pins 11 |
| M4 | fraction arithmetic: `gcd` `S/correction.ts:227-229` and `greatestCommonDivisor` `:791-793` in one file; `addFractions`, `reduceFraction` `:775-789`; `gcd` `S/entry.ts:475-477`; two hand-rolled running sums `S/entry.ts:432-442`, `:598-610` | Duplicated Code | Extract Module `fraction.ts`; see section 6 for the tree-wide count | low | `correction.test.ts`, `entry.test.ts` |
| M5 | the by-principal partition of grace notes: `S/correction.ts:462-468`, `:485-491`; `S/grace-layer.ts:51-57`, `:166-171`, `:198-203`; and `HEAD`, `ZERO` twice each (`S/correction.ts:664`, `:674`; `S/grace-layer.ts:29`, `:184`) | Duplicated Code | Extract Function `byPrincipal` | low | `grace-layer.test.ts` |
| M6 | the Key signature cell inside `GraceCells` (`S/GraceCells.svelte:16`, `:38-39`), styled from its parent through `:global(.cell-g)` (`S/CorrectionSurface.svelte:1025`, `:1048`, `:1059`, `:1069`) | Misplaced Responsibility, placed by size pressure | Move the cell into `CorrectionSurface` once T3-2 gives room | low | `e2e/grace-corrections.test.ts` (unit t) |
| M7 | a barline is recognized by its colour: `S/Loupe.svelte:1511`; and by geometry: `S/loupe-ink.ts:160-181` | a hidden key on a paint value | have the renderer stamp `data-barline`; both readers ask for the handle | medium, touches the renderer | `staff-renderer.test.ts`; frame baseline |
| M8 | `nextIds`: declared `S/Loupe.svelte:85-86`, never destructured (`:184-216`), said to be unread (`:582-584`), still passed `P/:4520`, still computed `S/held-measure.ts:12`, `:22`, `:27` | Dead parameter across three files | Remove Parameter | low | `held-measure.test.ts:11-20` changes with it |
| M9 | `joinDeps` in `S/loupe-print-wiring.ts:32-57` serves the Poem join, not the Loupe | Misplaced Function | Move Function beside `text/poem-join.svelte.ts` | low | `loupe-print-wiring.test.ts` |
| M10 | the 44 px tap floor: `TAP_FLOOR_PX` `S/loupe-render.ts:72`; `22 / scale` `S/Loupe.svelte:1375`; `BAR_ESTIMATE` `:2221`; and the tween's two durations, in `S/loupe-tween.svelte.ts:42-44` and again as CSS literals `S/Loupe.svelte:2887`, `:2893` | one fact, several literals | Replace Magic Number; hand the durations to CSS as custom properties from the component | low | `loupe-tween.test.ts` |
| M11 | `LoupeHeader` imports `stackActions` from `components/Drawer/bandState` (`S/LoupeHeader.svelte:19`) | `score/` reaching into `components/` | for step 6 to place; no move proposed here | none | none |
| M12 | a scan's kind from its file name: `S/loupe-print.svelte.ts:71`; `S/loupe-print-wiring.ts:80` | Duplicated Code, the only two in the tree (ran, grep) | Extract Function `scanKind` | low | `loupe-print.svelte.test.ts` |
| M13 | a length's word: `LENGTH_CELLS` `S/correction.ts:204-212`; `DURATION_KEY` `S/correction-verbs.svelte.ts:111-118`; `S/value-name.ts:28` reads the first | two tables for one fact | Remove `DURATION_KEY`, derive from `LENGTH_CELLS` | low | `value-name.test.ts`, `correction-verbs.test.ts` |

### Tier 1: inside a file

**1.1 `CorrectionSurface`'s dock variant is dead.** The component is mounted once, as `variant="panel"` (`P/:4469-4470`; ran, grep for `<CorrectionSurface` across `apps/web/src`). Dead with it: the `variant` default, `portrait`, `syllables`, and `onheight` props (`S/CorrectionSurface.svelte:58-67`, `:137-138`, `:143-145`, `:163`); the height effect (`:322-325`); `tight` (`:328`); the dock's header (`:422-424`); the dock's accessible name (`:401`); the lyric snippet (`:724-730`); the `.dock` rules, the keyframes, and the print rule (`:825-903`, `:1085-1087`, `:1220-1226`); both shadow literals (`:866`, `:875`). Svelte cannot flag the CSS because the class is built from a string (`:397`). *Refactoring:* Remove Dead Code. *Risk:* the header's thesis "ONE COMPONENT, TWO CONTAINERS" (`:8-14`) and the dock's rulings of 2026-08-26 to 2026-08-28 go to a decision record first, with their dates and words. *Proof:* `svelte-check`, the e2e suite.

**1.2 Dead or test-only code.** Each was checked by a word search across `apps/web/src` and `apps/web/e2e` (ran).

- `handleDot` (`S/correction-verbs.svelte.ts:341-347`): no caller; `handleDotCell` replaced it.
- `selectionOrder` (`S/grace-layer.ts:160-180`): called only by its test, though the file's header calls it "the one SELECTION ORDER every reader of a selected id uses" (`S/grace-layer.ts:8-11`). The order is rebuilt by hand at `S/correction-verbs.svelte.ts:511-513`.
- `firstNoteId` (`S/correction.ts:817-820`): test only.
- `GRACE_HEAD` and its `HEAD` (`S/grace-layer.ts:29`, `:182`): no reader. `readGrace` (`S/grace-layer.ts:42`, silenced at `:110`). `standsAsGrace`, an alias (`S/correction.ts:482`). `TUPLET_COUNTS` (`S/entry.ts:321`): no reader; `stepCount` writes 2 and 9 again (`S/entry.ts:336`).
- `totalSpan`, computed and voided (`S/Loupe.svelte:1007`, `:1020`).
- `windowScale` (`S/loupe.ts:919-922`): not imported by `Loupe.svelte` (`S/Loupe.svelte:41-65`). `PageInk.minTotalSpan` exists only for it, so the survey's whole measure-width loop is dead work on every page survey (`S/loupe.ts:863-864`, `S/loupe-ink.ts:212`, `:258-283`).
- `renderLoupeSystem` (`S/loupe-render.ts:243-280`): its own comment says the Loupe no longer calls it and that it is kept for one test.
- The rule for `[data-loupe-selected]` (`S/Loupe.svelte:2994-3001`): nothing sets that attribute. The inner print rule (`S/Loupe.svelte:2930-2936`) is covered by the outer one (`:3003-3007`).
- Guards for `data-held-measure`, which nothing sets since 2026-09-19 (`S/Loupe.svelte:1066-1067`): `S/loupe-ink.ts:114`, `:141`, `:229`; `S/Loupe.svelte:953`.

**1.3 `withCorrection` lists every field of `NoteCorrection` by hand** (`S/correction.ts:383-395`), so a new field has to be added in two places or a record of it is pruned as empty. `amendsNote` already asks the general question (`S/correction.ts:426-430`). *Refactoring:* Substitute Algorithm. *Proof:* `correction.test.ts`.

**1.4 Four pitch verbs with one body** (`S/correction-verbs.svelte.ts:267-283`, `:305-330`). Extract Function `#repitch(from, to)`.

**1.5 `applyCorrections`' walk has three branches that repeat their tails** (`S/correction.ts:546-564`). Consolidate Duplicate Conditional Fragments, after D2 is settled, not before.

**1.6 The depth guard 512 is written four times** (`S/correction.ts:511`, `:625`, `:640`, `:899`), and 64 once (`S/grace-layer.ts:98`). Replace Magic Number.

**1.7 `LoupeSyllables` builds a slot's key three times** (`S/LoupeSyllables.svelte:61`, `:71`, `:86`) and rebuilds the set of placed slots the page already builds (`P/:521-529`).

**1.8 `loupe-render.ts`** parses the same `viewBox` twice (`:96`, `:274`) and measures adjacent pairs twice (`offendingPairs` `:130-138`, `pairSeparations` `:152-166`).

**1.9 `staffVerticals` names a note's group by `data-event-id` alone** (`S/loupe-ink.ts:171`), while the same file names the verse-pass handles everywhere else (`:95-96`, `:112`, `:144`, `:262`). Today its one consumer of consequence is the dead loop of 1.2. Recorded so it is not lost when that loop goes.

**1.10 `handleKeySignature` and `handleTimeSignature` compare two whole maps as JSON strings** to learn whether anything changed (`S/correction-verbs.svelte.ts:532`, `:541`). The writers could answer null.

**1.11 Symbols exported that no other file names** (ran, word search; a symbol used only inside its own file needs no `export`, `code-conventions.md` section 6): `PITCH_FLOOR_MIDI`, `PITCH_CEILING_MIDI`, `tupletFraction` (`correction.ts`); `BeatPosition` (`entry.ts`); `DENSE_OVER_MEDIAN`, `FIT_PASSES`, `RESPONSE_SHARE`, `FitInput` (`loupe-fit.ts`); `PrintScan`, `LETTER_OF_SPACE` (`loupe-print.svelte.ts`); `LoupeSystemRender`, `SpacingReading` (`loupe-render.ts`); `SwipeDeps`; `TWEEN_EASING`, `TweenDirection`, `TweenState`; `HitRect`, `MeasureWindow`, `TapTarget`, `DragHome`, `MeterDigit`, `MeterLayout` (`loupe.ts`); `NotationFontId`, `NotationFontSpec`; `PressAndHold`; `TupletRowDeps`; `UndoEntry`; `CorrectionVerbsDeps`. Twenty-eight. A further thirty-two are named only by tests; those stay exported. The search is by word, so a symbol that another file names only in a comment would be missed by it.

**1.12 `Loupe.svelte:30` and `:38`** restore to one import per line once the file has room.

**1.13 The token migrations** are section 5.

**1.14 The comments** are section 4.

### Performance, for step 9 to measure

No time was measured; there was no browser. These are where a measurement would look.

- **The song's fit.** On the first raise on a desk every sung measure is rendered up to fourteen times (`S/loupe-render.ts:173`, `S/Loupe.svelte:2056-2075`), and each render runs the caret placement once for every entry in the measure and once for none (`S/Loupe.svelte:1486-1499`). Each placement calls `inkOf` per boundary with no memo, and `inkOf` is a query and a `getBBox` (`S/Loupe.svelte:1330-1352`, `:1400-1423`). Inside every one of those attempts the page is read again: `pageMetrics`, an underlay test over every system on the page, and the system ranges (`S/Loupe.svelte:1038`, `:1044`, `:1054`). A phone leaves the fit at once (`S/loupe-fit.ts:109`, `S/Loupe.svelte:2054-2055`).
- **Every cursor step** renders the held measure twice, once for the cache key and once to draw (`S/Loupe.svelte:2017-2018`, `:2049`).
- **The clone is injected three times** where a meter and a carried band both draw (`S/Loupe.svelte:2342`, `:2392`, `:2446`).
- **The print strips' object URLs are never released** (`S/loupe-print.svelte.ts:153`; no `revokeObjectURL` under `lib/score` or `lib/omr`, ran, grep). They live until the tab closes, one per bar opened.
- **A no-op record (D4)** defeats the page's early return for a song with no corrections (`P/:983`).

---

## 3. The hidden relationships

What depends on what with no import saying so. Each was established by reading the two ends, unless it says "ran".

1. **The Loupe reads the renderer's drawing by its handles and its paint order.** `MUSIC_MARK` is a selector over `data-event-id`, `data-hit`, `data-of-event`, `data-tacet`, and their verse twins, and the head's end is "everything painted before the first of them" (`S/loupe.ts:314-347`). `loupe-ink.ts`, `selection-ring.ts`, `loupe-hold.ts`, and `Loupe.svelte` add `data-meter`, `data-key-change`, `data-clef`, `data-key-signature`, `data-ipa-of`, `data-withheld`, `data-hyphen`, `data-extender`, `data-bar-number`, `data-analysis`, `data-tie-runon`, `data-slur-runon` (`S/loupe-ink.ts:112-119`, `:189`; `S/loupe-hold.ts:180`, `:191`; `S/Loupe.svelte:1085-1137`). A change to what the renderer stamps, or to the order it emits in, changes the Loupe with no type error. This is the unit's largest unwritten contract and belongs in a test on the renderer's side.
2. **A hit rectangle is eleven stave spaces tall with the staff as its middle four.** Four files recover the staff from that (`S/loupe.ts:146-151`, `S/loupe-ink.ts:217-218`, `S/selection-ring.ts:250-259`, `S/Loupe.svelte:589-597`). The renderer emits the rectangles at `R/staff-renderer.ts:2645` and `:2920` (ran, grep).
3. **A barline is found by the colour of its stroke.** `nudgeBarline` moves only lines whose stroke is `#3a352f` (`S/Loupe.svelte:1509-1518`). The renderer bakes that hex and says it must match `--ink-stave` (`R/staff-renderer.ts:2096`; `apps/web/src/app.css:31`). A skin that changes the stave's ink would stop the nudge, and a caret would then stand on its barline. This is why section 4a's migration cannot treat `S/Loupe.svelte:1511` as paint.
4. **The Loupe finds the page by class name.** `.markup-paper-container` and `.score-page` belong to `MarkupPane` (`apps/web/src/lib/melody/MarkupPane.svelte:351`, `:964`); the Loupe queries them (`S/Loupe.svelte:332`, `:514`, `:622`), and `followEntry` queries the Loupe's own `.loupe-body` and `.loupe-strip` and assumes the body's first `<g>` holds the stave lines (`S/loupe-hold.ts:111-112`, `:127`; `S/Loupe.svelte:2432-2443`).
5. **`<Loupe>` is destroyed on close, so its memory lives elsewhere** (`P/:4514`; `S/loupe-panel.svelte.ts:10-14`; `S/loupe-fit.svelte.ts:5-8`; `S/loupe-hold.ts:21-23`).
6. **Numbers in script that restate the stylesheet.** `FRAME_SIDES`, `CHROME`, `CARD_FURNITURE`, and `BAR_ESTIMATE` are the card's padding, border, and row heights written again (`S/Loupe.svelte:283`, `:298`, `:2218`, `:2221` against `:2595-2596`); the caret's 0.32 opacity is in the script and in a comment in another file (`S/Loupe.svelte:1591`, `S/loupe-tween.svelte.ts:13`); the tween's durations are in two places (M10).
7. **The z-index 9100 answers `InstallPrompt`'s 9000** (`S/Loupe.svelte:2587`, `S/CorrectionSurface.svelte:827`; `apps/web/src/lib/components/InstallPrompt.svelte:181`, ran, grep).
8. **A hand-entered id carries a colon because `migrateCorrectionIds` counts dashes** (`S/entry.ts:174-184`, `S/correction.ts:861-862`). D7 is the same relationship seen from the parser's side.
9. **`withCorrection`'s pruning list must name every field of `NoteCorrection`** (1.3).
10. **`entered.measureIndex` is written in reading bars, and the cursor's `measureIndex` is in song bars** (`S/entry-marks.ts:10-11`; `S/correction-verbs.svelte.ts:391-402`). Nothing in the types tells the two apart.
11. **The cursor has one stated writer and three actual ones.** `CorrectionCursor.set` calls itself "the one function that writes" the selection and the gap (`S/correction-cursor.svelte.ts:78`); the undo writes the three fields directly (`S/undo-wiring.svelte.ts:35-37`), and so does the page's `selectEntry` (`P/:898`), which is how D3 leaves a null selection.
12. **Three cells read page-attached singletons, not props.** `barlineUi`, `tsUi`, and `keyUi` are attached by the page (`P/:907-909`) and read inside the components (`S/CorrectionSurface.svelte:681`, `:684`; `S/GraceCells.svelte:39`), while every other cell is a prop.
13. **`GraceCells` has no stylesheet; it wears its parent's** through `:global(.cell-g)` (M6).
14. **The key handler stands down for a tablist because the Loupe's mode pills are one** (`S/loupe-panel.svelte.ts:56`, `S/Loupe.svelte:2506`).
15. **The swipe's `.dock`** (D8).
16. **A song's fitted size is keyed by title, measure count, and first event id** (`S/loupe-fit.ts:192-194`). Two songs alike in all three share a size for the session.

## 4. The comment census

**The measure (ran, an `awk` count of comment lines; approximate at block edges):** 4,985 of 11,696 lines are comment, 42 percent. `Loupe.svelte` 1,429 of 3,008; `loupe.ts` 592 of 990; `correction.ts` 417 of 906; `entry.ts` 295 of 613; `CorrectionSurface.svelte` 465 of 1,227; `selection-ring.ts` 238 of 406. All 37 files open with a comment saying what the file is for.

**What stays.** Every comment that carries a ruling of Dann's with its date and words. They are many and they are the unit's real value to a newcomer: `Loupe.svelte` names him 39 times, `CorrectionSurface.svelte` 16, `selection-ring.ts` 15, `loupe.ts` 13 (ran, grep). Also staying: the comments that name a coupling no import shows (`S/loupe.ts:88-90`, `:362-364`; `S/entry.ts:177-183`; `S/undo-history.svelte.ts:139-144`).

**What fails the test, by kind.**

*False today. These mislead a reader arriving cold and come out or are rewritten first.*

- The Loupe as "a view transform, not a second renderer", "a clone cannot [drift]" (`S/Loupe.svelte:9-14`; `S/loupe.ts:4-6`), against `S/loupe-render.ts:1-3` and `S/Loupe.svelte:570`. The head of both files.
- "A tap inside the Loupe takes the entry, and places the armed syllable" (`S/Loupe.svelte:2078`), against the prop's own comment (`S/Loupe.svelte:117-123`).
- "It hangs off that point at -50% of its own height" (`S/Loupe.svelte:2280-2284`), against `:2190-2214` and `:2598`.
- "The sage rectangle on the page says the same thing" (`S/Loupe.svelte:2656-2657`), against `:1638-1646`.
- Three references to `.loupe-syl-label`, a rule that does not exist (`S/Loupe.svelte:2486`, `:2715`, `:2730`; ran, grep).
- "`Loupe.svelte`'s own `restOrNoteInk`" and "`pageMetrics`' own list at `:222-236`" (`S/Loupe.svelte:1326`, `:769-770`); both functions live in `loupe-ink.ts`.
- `correction.ts`'s head: "Insertion ... is not here" (`S/correction.ts:4-6`) against `entered` (`:86`); "tuplets are deliberately not handled" (`:235-239`) against "slice 1's note is superseded" in the same file (`:707-712`).
- `measureFill`'s own description says a bar reads `9 of 8` rather than `4.5 of 4` (`S/entry.ts:413-417`); the body, and Dann's ruling of 2026-08-27 inside it, say the opposite (`S/entry.ts:444-464`). The ruling stays; the description is corrected.
- "The five values, in the fixed order the DURATION station already uses" (`S/entry.ts:323`; `S/CorrectionSurface.svelte:377-378`); the station has had seven since N.183 (`S/correction.ts:204-212`). Whether a tuplet of 32nds ought to be definable is a product question the comment hides.
- `CorrectionSurface`'s head: "Three cells render disabled ... tuplet, Rest, and Tie" and "the desktop `CorrectionControls`" (`S/CorrectionSurface.svelte:23-27`); all three act, and no such component exists (ran, `find`). "Undo and Redo are ... `HeaderBar`'s now" (`:76-79`, `:441-456`); they left that bar too (`apps/web/src/lib/components/HeaderBar.svelte:10-12`) and are in `LoupeHeader`.
- "`getBBox` gives its real inked box" (`S/CorrectionSurface.svelte:237-242`), corrected fourteen lines later in the same comment (`:255-264`). "Right for whichever face is loaded, including the day someone chooses Bravura or Leland" (`:249-253`), while the face is written as a literal three times (`:351`; `S/loupe-ink.ts:54`, `:84`).
- "The numbers live in `selection-ring.ts`" (`S/selection-ring.ts:96-100`), four lines under the comment that says they moved to the package (`:26-28`). "Appended by this pane" (`:80-82`) was written for `MarkupPane` and travelled with the code.
- `grace-layer.ts`'s head on `selectionOrder` (1.2).
- "The one function that writes" (`S/correction-cursor.svelte.ts:78`; relationship 11).
- `openAfterPageMeter`'s description names `METER_RUN_IN_SP` (`S/loupe.ts:572`); the code uses `LOUPE_METER_RUN_IN_SP` (`:591`).
- `LoupeSyllables`' head compares itself at length to `SyllableStation` (`S/LoupeSyllables.svelte:11-23`), a file that no longer exists (ran, `find`). The ruling of N.147 stays; the comparison goes.

*Citations by line number.* 31 across 14 files (ran, grep), against `code-conventions.md` section 5. Verified stale: `staff-renderer.ts:1011` and `:1007-1011` (`S/loupe.ts:78`, `:147`; `S/Loupe.svelte:592`) and `staff-renderer.ts:2894` (`S/loupe.ts:695`) all point at the hit rectangle, which is at `:2645` and `:2920`; `InstallPrompt.svelte:157` (`S/Loupe.svelte:2577`, `S/CorrectionSurface.svelte:793`) is at `:181`; `Loupe.svelte:1513` (`S/LoupeSyllables.svelte:157`) is at `:2593`. The others were not each checked.

*Where the code came from.* Sixteen "moved out of `+page.svelte` at commit x, lines a to b" notes across 13 files (ran, grep), for example `S/correction-verbs.svelte.ts:5-9`, `S/loupe-ink.ts:6-10`, `S/undo-wiring.svelte.ts:6-7`. Git holds this. What a reader needs from each is the one clause saying what the file must agree with.

*Tombstones.* Comments marking what is gone: `S/CorrectionSurface.svelte:68-73`, `:122-123`, `:911-916`; `S/loupe.ts:252-258`; `S/Loupe.svelte:1638-1656`. Three of them quote Dann. The ruling and its date belong in a decision record; a marker in the code for a thing that is not there curates nothing.

*Status notes.* "NOT RUN IN A BROWSER in the step that wrote it" (`S/LoupePrintStrip.svelte:20-21`); "Strings are PENDING DANN" (`S/GraceCells.svelte:18`). **NOT ESTABLISHED** whether either is still true. Both belong in `STATE.md`, not in source.

*One comment, two homes.* The z-index paragraph is in both stylesheets word for word (`S/Loupe.svelte:2572-2584`, `S/CorrectionSurface.svelte:792-800`).

**A judgement for the desk, not a recommendation to cut.** The word MEASURED appears 53 times in five files (ran, grep). Many of those passages narrate a walk: what was seen, on which bar, to a hundredth of a unit. Where the number is the reason a constant has its value, one line with the number and the fixture does the curating. Where the passage records how a defect was found, it is a session record. These passages often carry Dann's words inside them, so separating the two is a careful hand's work, file by file, and `Loupe.svelte` is where most of it is.

## 5. The colour-literal census

**The script, re-run on `50315f2e` (ran):** 296 literals tree-wide, 174 matching a token's value, 122 needing a judgement, 51 files. The plan's figures were 299, 177, 122, and 52.

**Two faults in the instrument, found on this unit.**

1. **It does not see `rgb()` or `rgba()`.** This unit has six (`grep`, ran). The tree-wide count is therefore low by an amount nobody has taken.
2. **It reads a print override as a token.** `--paper-cream` is `#F0EBE0` (`apps/web/src/app.css:78`) and is redefined as `#ffffff` in a later block (`apps/web/src/app.css:236`), so the script reports `#ffffff` as "equals `--paper-cream`". On screen it does not.

It also counts a literal inside a comment (`S/LoupeSyllables.svelte:67`, two).

**The unit: 38 rows by the script, plus 6 it missed.**

| Where | Literal | Class | Becomes, or the reason |
|---|---|---|---|
| `S/CorrectionSurface.svelte:807`, `:925`, `:1041`, `:1179` | `#1a1612` as a fallback inside `var(--ink-primary, ...)` | MIGRATE | `var(--ink-primary)`; the fallback is a second copy of the token |
| `S/CorrectionSurface.svelte:937`, `:967`, `:1112`, `:1185` | `#4a4540` fallback | MIGRATE | `var(--ink-secondary)` |
| `S/CorrectionSurface.svelte:988`, `:1049` | `#6a655f` fallback | MIGRATE | `var(--ink-tertiary)` |
| `S/CorrectionSurface.svelte:1038` | `#d6d3d1` fallback | MIGRATE | `var(--stone-300)` |
| `S/CorrectionSurface.svelte:1040` | `#f5f1e8` fallback | MIGRATE | `var(--paper-light)` |
| `S/CorrectionSurface.svelte:837`, `:865`, `:874` | `#faf8f5`, `#d6d3d1` fallbacks | MIGRATE, but dead | in the dock rules that finding 1.1 removes |
| `S/CorrectionSurface.svelte:866`, `:875` | `rgba(46, 42, 38, 0.08)` | dead | same; if the dock were kept, NEEDS A TOKEN beside `--float-shadow` |
| `S/Loupe.svelte:2596` | `#4a4540` fallback | MIGRATE | `var(--ink-secondary)` |
| `S/Loupe.svelte:2599` | `#f5f1e8` fallback | MIGRATE | `var(--paper-light)` |
| `S/Loupe.svelte:2669`, `:2682`, `:2833`, `:2910` | `#6a655f` fallback | MIGRATE | `var(--ink-tertiary)` |
| `S/Loupe.svelte:2735`, `:2743`, `:2754`, `:2772` | `#1a1612` fallback | MIGRATE | `var(--ink-primary)` |
| `S/Loupe.svelte:1567` | `#6A655F`, the carets' ink, set as an SVG attribute from script | MIGRATE | `--ink-tertiary`, through a CSS rule on `.loupe-carets`; the comment beside it already calls it that token's literal (`:1562`) |
| `S/Loupe.svelte:909`, `:998` | `#3a352f`, the fallback when the render has no stave line or clef to sample | MIGRATE | `--ink-stave` by value; the first copy is the renderer's own baked hex (`R/staff-renderer.ts:2096`), so the true single home is a constant the renderer exports |
| `S/Loupe.svelte:1511` | `#3a352f` | none of the three | not paint: it is the test for "this line is a barline" (relationship 3). It goes by M7, never by a token swap |
| `S/Loupe.svelte:2711`; `S/LoupeSyllables.svelte:307` | `rgba(74, 69, 64, 0.25)`, a hairline | NEEDS A TOKEN | `--ink-hairline`, in the ink tier: `--ink-secondary` at a quarter strength |
| `S/LoupePlacementRow.svelte:73` | `rgba(74, 69, 64, 0.35)`, a pill's border | NEEDS A TOKEN | the same `--ink-hairline` if the desk accepts one strength; otherwise `--ink-rule` beside it |
| `S/Loupe.svelte:2766` | `rgba(26, 22, 18, 0.06)`, a hover tint | NEEDS A TOKEN | `--ink-hover`, in the ink tier: `--ink-primary` at 6 percent |
| `S/LoupePlacementRow.svelte:76`, `:96` | `#4a4540` | MIGRATE | `var(--ink-secondary)` |
| `S/LoupeSyllables.svelte:208`, `:230` | `#6a655f` | MIGRATE | `var(--ink-tertiary)` |
| `S/LoupeSyllables.svelte:211` | `#1a1612` | MIGRATE | `var(--ink-primary)` |
| `S/LoupeSyllables.svelte:220` | `#ffffff`, the fill behind the syllable on the taken note | NEEDS A TOKEN | the script's `--paper-cream` is the print override and is wrong here. The value is ruled: "white fill, 1.4 px lavender inset outline" (N.147, `S/LoupeSyllables.svelte:213-218`). Proposed: `--paper-white`, in the paper group, which is not a hue; `#fff` is the tree's most repeated unmatched value (plan 4a). `--lavender-wash` would fit the hue rule and change the ruled value, so that choice is Dann's |
| `S/LoupePrintStrip.svelte:160` | `#fff` | LOCAL BY RIGHT | the ground behind a picture of the singer's own printed page. A skin must not tint a photograph of print, and it is never printed |
| `S/LoupeSyllables.svelte:67` | `#6A655F`, `#1a1612` | not a colour use | inside a comment; they go when the comment is trimmed |

**Counts:** MIGRATE 33 (three of them in dead rules); NEEDS A TOKEN 5 across three proposed names; LOCAL BY RIGHT 1; dead 2; not paint 1; in a comment 2. No literal in this unit asks for a sixth hue.

**The hue rule (`apps/web/src/app.css:33-41`), checked for this unit.** The Loupe is lavender, and it is: the header (`S/LoupeHeader.svelte:91-92`), the ring (`S/Loupe.svelte:2973`), the chosen pill (`:2761`), the engaged cell (`S/CorrectionSurface.svelte:1060-1061`). **Two uses of sage inside the Loupe:** the print strip's Previous, Next, and Fill from the poem (`S/LoupePrintStrip.svelte:196`, `:198`), and the dead rule of 1.2 (`S/Loupe.svelte:2998`). Fill from the poem is about words, which is sage's idea; Previous and Next move between bars, which is not. That is a taste call for Dann and no migration decides it.

**The focus ring has no token, and this unit shows why it needs one.** Three different colours ring a focused control here: `--ink-primary` (`S/Loupe.svelte:2769-2774`), `--lavender-ink` (`S/LoupeHeader.svelte:139-142`, `:178-181`), and `--lavender` (`S/LoupePlacementRow.svelte:101-104`, `S/LoupeSyllables.svelte:233-236`, `S/CorrectionSurface.svelte:1069-1073`). `LoupeHeader` records the reason for its choice: `--lavender` on the head tint is under 3:1 (`S/LoupeHeader.svelte:176-177`).

**Hard-coded faces.** Every CSS `font-family` in the unit reads `--font-sans` or `--font-serif`; thirteen carry a literal fallback list that restates part of `apps/web/src/app.css:23-24` (for example `S/Loupe.svelte:2665`, `S/LoupeSyllables.svelte:249`), which is MIGRATE by the same reasoning as the colour fallbacks. Outside CSS:

| Where | Literal | Class | Becomes |
|---|---|---|---|
| `S/CorrectionSurface.svelte:351`; `S/loupe-ink.ts:54`, `:84` | `Finale Maestro` | MIGRATE | the family of `DEFAULT_NOTATION_FONT_ID` in `S/notation-fonts.ts:36-42`, the registry that already holds it |
| `S/selection-ring.ts:199` | `Lato IPA`, used to recognize the IPA row | MIGRATE | `IPA_FONT_FAMILY`, already imported at `:24`; better, the `data-ipa-of` handle `S/loupe-hold.ts:180` uses for the same question |

## 6. Duplication contributions, counted tree-wide

All counts by `grep` over `apps/`, `packages/`, `scripts/`, and `tools/` (ran), tests excluded unless named.

| Fact | Homes | Where |
|---|---|---|
| `gcd` | **11** in `apps/web/src` and `packages`; 13 with `tools/`; 14 with one test | in the unit: `S/correction.ts:227`, `:791`; `S/entry.ts:475`. Elsewhere: `omr/triplets.ts:98`, `omr/metre-witness.ts:83`, `S/offers-for-a-bar.ts:84`, `S/rebar-notes.ts:31`, `S/rebar.ts:86`, `R/phonation.ts:55`, `R/mnx-parser.ts:170`, `R/musicxml-parser.ts:198`; `tools/e16-harness/src/adapters/oemer-adapter.ts:95`, `homr-adapter.ts:110`; `S/ingestion/fixture-rule.test.ts:255`. The desk's ten is one low |
| adding two fractions | 5 | `S/correction.ts:775`; inline twice in `S/entry.ts:437-441`, `:605-609`; `R/mnx-parser.ts:187`; `R/musicxml-parser.ts:214` |
| `median` | 6 in `apps/web/src`; 8 with `tools/` | `S/loupe-fit.ts:58`; `omr/underlay-rows.ts:79`; `omr/metre-windows.ts:113`; `omr/underlay-below.ts:42`; `S/old-reader-seats.ts:221` (inline); `voice/engine/dsp.ts:256` |
| the staff from a hit rectangle (11 and 3.5) | 4 files, 6 sites | M3 |
| a glyph's ink by canvas | 3, all in the unit; a fourth in `apps/web/e2e-phone/loupe-probe.ts:342` | M2 |
| an event's own ink | 5 sites in 3 files | M1 |
| "what the Loupe does not draw" (hit rectangles, the ring, bar numbers, analysis, verse labels, the page's meter) | 6 | `S/loupe-ink.ts:112-119`, `:141-142`, `:229-236`; `S/Loupe.svelte:946-956`, `:1085-1126`; `S/system-ground.ts:71-73` |
| a slot's key, `line-word-slot` | 14 sites in 6 files | `S/LoupeSyllables.svelte:61`, `:71`, `:86`; `S/reseat.ts:48`; `S/pairings.ts:450`, `:458`, `:998`, `:1004`; `S/heal.ts:158`, `:190`, `:460`; `S/placement-scope.ts:95`; `P/:525`, `:529` |
| the by-principal partition of grace notes | 5 | M5 |
| the head-of-part sentinel `\u0000head` | 2 | `S/correction.ts:674`; `S/grace-layer.ts:29` |
| the zero fraction | 2 named, 2 literal | `S/correction.ts:664`, `:492`, `:751`; `S/grace-layer.ts:184` |
| a length's i18n key by base | 2 | M13 |
| a note's pitch with its correction | 3 | `S/correction.ts:350-352`; `S/entry.ts:300-301`; `S/grace-layer.ts:32-34` |
| a new grace note's defaults (an eighth; C4 where no pitch) | 4 | `S/grace-layer.ts:94`, `:105`, `:107`; `S/grace-verbs.ts:30` |
| a scan's kind from its file name | 2 | M12 |
| the literal `'words-partly-read'` | 4 code sites | `S/loupe-print-wiring.ts:30`; `S/ingestion/ingest.ts:117`, `:149`, `:151`; typed at `R/types.ts:991` |
| z-index 9100 | 2, with their comment | relationship 7 |
| the 44 px floor | 1 constant, 2 script literals, and 17 `44px` in six stylesheets (ran, `grep -c`) | M10 |
| the tween's durations | 2 | M10 |
| "does the system ask for no motion" | 2 in the unit | `S/loupe-tween.svelte.ts:73-75`; `S/LoupeSyllables.svelte:123-131` |
| a tuplet count's bounds, 2 to 9 | 2 | `S/entry.ts:321`, `:336` |
| rounding to a hundredth | 2 | `S/loupe.ts:302-304`; `S/loupe-fit.ts:78` |
| the Cyrillic vowel class | **0 in this unit** (ran, grep) | none |

## 7. Token spend

About 440,000 of the 650,000 cap. This is my estimate from the volume read and written; no meter is visible to me from inside the session. No subagent was spawned and no artifact was published.

## 8. What I could not establish

1. **What happens to a seated syllable when its note is made a rest or a grace note.** `handleRest` and `handleGrace` write the correction and nothing to the pairings (`S/correction-verbs.svelte.ts:462-464`, `:501-503`). Whether the syllable is then drawn under a rest, withheld, or re-seated is decided in `pairings.ts` and the renderer, outside this unit. Under ONE VOWEL PER NOTE this is the one question from unit e that the reader of those files owes an answer to. It is not reported as a blocker because nothing in unit e writes the syllable.
2. **Whether the Loupe closes in D3.** The null selection ran; the unmounting is by reading `P/:4514`.
3. **Which clone-era branches a one-measure render still reaches** (T3-1). It needs a coverage run in a browser across the walk scores.
4. **Any timing** (the performance list). No browser.
5. **Whether any real file carries four-part note ids** (D7), and **whether the transposition dock and the Loupe can be open together** (D8).
6. **Whether `e2e/grace-corrections.test.ts:82` still finds anything.** It looks for `.loupe [data-selection-ring]`; the Loupe draws its ring as `.loupe-ring rect` and strips that attribute from its clone (`S/Loupe.svelte:1125`, `:2313-2328`). The locator is declared and, in the lines I read (`:74-88`), not asserted on. It is unit t's.
7. **The sizes in D5 and the wording in D6** as a singer meets them. The page and a screen reader must confirm both.
8. **Whether the 24 line-number citations I did not check are stale.** All four families I checked were (seven sites).
9. **Gould's figure for the air between a key signature and a meter**, which the code itself marks as not read (`S/loupe.ts:441-448`).
10. **The text of the i18n values** behind `loupe.place.clear` and the other keys named here. `i18n.ts` is read for structure only under plan section 4, and I did not open it.
