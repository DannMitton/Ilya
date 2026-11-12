# Report: N.192 and N.187, step 6 (Corrections: grace notes), r1, 2026-11-12

Lane `cloud-lane-50`. Built to the brief with amendments 6 to 10 (two cells, not three; the Corrections design that names the right functions; selection specified; the other verbs on a grace note; no syllable on a grace note).

## What changed

**The record.** `NoteCorrection.grace?: { slash: boolean } | 'none'` (`correction.ts`). On a read full note it makes a grace note of it; on a hand-added entry it IS the entry (`entered.after` the entry it follows); on a read grace note it carries the stroke; `'none'` makes a read grace note a full note again. `withCorrection`'s field list gained it (an entered record is never pruned). `clearCorrection` and `amendsNote` needed no change (Restore clears a note's record, and a grace mark counts as the note's own).

**`applyCorrections(vocalLine, map, graceNotes?)`.** A read full note with `grace` set is left out of the line exactly as a deleted note is (entries hung on it still emit). A hand-added grace record is skipped when emitting the line, and what hangs on it still emits. A read grace note made a full note (`'none'`) is emitted as an event (its own id, its `base` as its duration, its principal's bar and onset) immediately before its principal (after it, for an after-grace); where the principal is gone it passes to the next note that stands. An entry made in the gap after a read grace note, whose id is in no line, now emits where the grace note stands. The four production callers pass the read list: `bar-layer.ts`, `time-signature.ts`, `rebar-notes.ts`, `rebar.ts`; and the three mark-passing loops (`rebar.ts`, `time-signature.ts`, `rebar-notes.ts`) treat a note made a grace note as they treat a deleted one, so a barline or time signature mark on it passes to the next note.

**`grace-layer.ts` (new, `apps/web/src/lib/score/`).** `correctedGraceNotes(read, map, readLine, line)` returns the corrected list: read grace notes with `pitch`, `base`, `slash`, and `deleted` applied, full notes made grace notes, hand-added ones, each attached to the next note that stands after its place (an after-grace of the last note where none follows). It returns the read list itself where nothing touches a grace note. `selectionOrder` and `lineWithGraceStops` give the one order every reader uses: each grace note before its principal, an after-grace after it. `BarLayer` puts the corrected list on `score.graceNotes`.

**Selection (amendment 7).** The readers of a selected id (step 0's list) are served by one device: the page's `stopLine` is the corrected line with each grace note standing in it as a zero-length entry (`lineWithGraceStops`), and the cursor, the carets, `positionsInMeasure`, `heldMeasureIds`, `nextMeasureIds`, and the verbs all walk it. A grace note is therefore a place the bar can stand exactly as a note is, and `selectedEvent` finds it. The renderer gives each grace note its own `<g data-event-id>` and its own `data-hit` rectangle, the width of its own slot, and begins its principal's rectangle where the grace notes end, so they never overlap; the grace group carries `pointer-events="none"` so only each hit rectangle takes a click. This also settles step 4's finding: a grace note now sits in the Loupe's body, not in its head (seen, below).

**Verbs** (`grace-verbs.ts`, `correction-verbs.svelte.ts`, `correction-keys.ts`). `;` and the Grace note cell: in a gap, add a grace note before the next note at that note's pitch; on a full note, make it a grace note of its own value; on a grace note, make it a full note again (the Rest cell's grammar). `/`: add a grace note immediately before the taken note or grace note (after any already before a taken note), an eighth, slashed, selected at once. The Slash cell: shown only on a lone, flagged grace note; a scan's unmarked lone grace note reads as slashed (amendment 5's default). On a taken grace note the pitch verbs, Delete, Restore, and the duration digits act (a digit sets its `base`; nothing in the bar moves); Dot, Rest, Tie, Barline, and the time signature card are disabled. Undo pushes its own text for each (`loupe.undo.graceAdded`, `.grace`, `.graceSlash`). `orphanIds` takes the read grace ids as live, so a correction keyed `m17-1-2~g1` is not reported in the drawer as one that did not land.

**The cells** (`GraceCells.svelte`, new): two cells beside the others in the ACCIDENTAL · ENTRY station. `CorrectionSurface.svelte` gained exactly its 4 lines of room (1223 to 1227 of 1227) and no more; its `.cell` rules share their look with the new component through `:global(.cell-g)` selectors edited in place. `+page.svelte` is 5524 of 5534 (+1 net line over its start; the rest are edits to existing lines). Nothing in `Loupe.svelte` changed in this step.

## Strings (PENDING DANN)

Built with the English drafts. **No French was invented**: the French slot of each new key holds the same English text until Dann rules it, and it is marked in a comment block in `i18n.ts` (one contiguous block, to merge cleanly beside lane 48's changes). Keys: `loupe.grace` "Grace note"; `correct.graceAdd` "Add a grace note before the next note"; `correct.graceMake` "Make this a grace note"; `correct.graceFull` "Make this a full note again"; `loupe.graceSlash` "Slash"; `correct.graceSlash` "Add or remove the slash on this grace note"; `loupe.undo.graceAdded` "grace note added"; `loupe.undo.grace` "grace note changed"; `loupe.undo.graceSlash` "slash changed". The three accessible names of the Grace note cell are by state, as the barline cell's two are. The hand-written key index at the head of `i18n.ts` is updated (1,231 keys; `correct.` and `loupe.` counts). The desk replaces the French before the lane merges; the French term for a grace note is Dann's to choose.

Amendment 10, told to Dann in one line as asked: this is how the 2026-11-05 00:19 ruling's "force this option manually" is met in this lane. Where a print sets a syllable under a grace note, the singer turns it into a full note (the Grace note cell, off) and it takes a syllable as any note does; the bar may then read "over".

## Tests

- `grace-layer.test.ts` (19 tests): a read grace note re-pitched, re-sized, slashed, deleted, made a full note, an after-grace made a full note, a deleted principal passing its grace notes on, not an orphan; a note made a grace note leaves the line exactly as a deleted note does (same onsets), joins the list before the next note, is an after-grace at the end; a hand-added grace note is not in the line, hangs on the next note, follows a read grace note in its group, is an after-grace at the end, and what hangs on it stands; the selection order, with deletions out.
- `grace-draw.test.ts` (12 tests): adds the event group and hit rectangle of each grace note, and that a principal's rectangle begins where its grace notes end.
- Playwright, desktop (`e2e/grace-corrections.test.ts`, 5 tests, all pass): a click selects a grace note and the cell reads as one (with Slash lit); ArrowUp moves it and one Undo puts it back, Delete removes it and Undo returns it; `;` turns it into a full note (the bar reads over) and back; `/` adds one, selected at once, as a hand entry (a group of two shows no Slash cell), and Delete removes it; the arrow keys walk onto the grace note and then its principal. Phone (`e2e-phone/grace-corrections.test.ts`, passes): at 390 px a tap on a mid-system grace note selects it and a tap on its principal selects the principal.

## Gate counts after this step

| Gate | Result |
|---|---|
| score-parser | 838 passed, 5 skipped (843), 39 files |
| web, all of `src/lib` | 5214 passed, 1 skipped (5215), 281 files |
| svelte-check | 0 errors, 12 warnings |
| ratchets | OK. `CorrectionSurface.svelte` 1227 of 1227; `Loupe.svelte` 3012 of 3012; `+page.svelte` 5524 of 5534; `staff-renderer.ts` 3409 of 3427; `musicxml-parser.ts` 1164 of 1167 |
| Playwright | `grace-corrections` desktop 5 of 5, phone 1 of 1; `key-change-melody` desktop and phone pass; the whole suite runs at step 7 |

## Screenshots

`docs/sessions/shots-n192-n187-step6_2026-11-12/`: the Loupe holding a grace note in Corrections at 1440 and 390 px (`grace-corrections-desktop-en.png`, `-390-en.png`). The Grace note cell is in the station below the fold at 390 px in the second shot; the first shot's station shows it beside Barline and Time signature. No French shot: the French strings are not ruled.

## Found, not fixed

- **The first note of a system, at 390 px.** A grace note before the first note of a system sits under the page's own clef control (`clef-hit`), which takes its tap (measured: the grace hit rectangle is 4.5 px wide there, under the button). A tap on it selects nothing. The principal beside it is 7.6 px wide at that scale. On desktop it works. The phone test therefore taps a mid-system grace note.
- Hit rectangles on the page at 390 px are 4.5 to 8 px wide, on the page's own scaling; the Loupe, not the page, is where a singer works at that width (its tap floor is 44 px). I did not measure the Loupe's tap targets for a grace note at 390 px.
- The slur and the grace notes are drawn in `grace-draw.ts`, not through the slur planner (step 4's report).

## What I could not establish

- How the undo stack stores a verb that writes two records: no verb here writes two (each writes one record), so it did not arise.
- Whether six cells plus the Key signature cell (step 6b) fit the station at 390 px. Not yet seen.
- The library save: grace corrections are `NoteCorrection` records in the one `CorrectionMap`, which `document.svelte.ts` saves and restores as it does every correction. I did not run a save-and-reload of a song with grace corrections in the browser; no unit test covers it. NOT ESTABLISHED.
