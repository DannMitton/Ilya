# Report: step B1, `rebar.ts` and the two stored fields (Code, cloud lane 43, r1, 2026-11-10)

Commit: "B1: the barline and time signature layer". Files: `score/correction.ts` (+49), `score/rebar.ts` (new, 373 lines), `score/rebar.test.ts` (new, 15 tests), `analysis/rebar-downstream.test.ts` (new, 2 tests), `score/correction.test.ts` (+5 tests). Focused tests: 106 pass. Gate 3 (0 errors, 12 warnings) and gate 8 (OK) pass on this tree; the full set is run at the B2 close.

## What was built

**`NoteCorrection.barline?: 'before' | 'none'` and `NoteCorrection.timeSignature?: { beats, beatType, through: 'next' | 'end' }`** (`correction.ts`), both additive, both on the entry that opens the bar, both joined to the prune list (Fable finding 7 and amendment 2: a record holding only a mark is not deleted on its first write). `clearCorrection` (the per-note Restore) now keeps the bar's own marks (amendment 6); `amendsNote(record)` says whether a record touches the note beyond them, which B3 uses for `restoreAvailable`.

**`rebar(score, line, map)`** (`rebar.ts`), pure, after `applyCorrections`:
- Returns the inputs untouched where the map carries no mark (`applied: false`, `BarMap.identity`).
- Divides a reading bar at every `'before'` (a `'before'` on the first entry of a bar is already a barline and changes nothing); joins a bar to the one before at every `'none'` where the two bars are adjacent, both hold entries, the second opens no change of signature, key, or clef, no repeat, no ending boundary, no jump or rehearsal mark, and carries no time signature mark (`mergeBlocked`, Fable finding 9 and amendment 10).
- Rebuilds each entry's `measureIndex` and onset (a divided half's onsets start at 0; a joined half's continue from the first half's end), the `Measure` list (index, number, signature, `expectedDuration`, and the repeat flags: the first half keeps `repeatStart`, the last keeps `repeatEnd`, `repeatTimes`, `repeatAfterJump`, amendment 12), `keySignatures`, `clefs`, `timeSignatures` (rebuilt from the per-bar signatures), and the positioned lists `tempoMarkings`, `tempoWords`, `metricModulations` (a mark inside a divided bar moves to the half that holds it).
- Applies the signature marks per bar: "to next" stops at the reading's next change of signature or at a later mark of the singer's; "to end" overrides the reading's later changes and stops only at a later mark of the singer's (amendment 10: a later change of hers bounds an earlier one). The reading's signature symbol (common time) is kept only where the digits are the reading's.
- Carries a deleted entry's marks to the next entry standing (amendment 9).
- `BarMap` (`toSong`, `toReading`) converts between reading bars and song bars. Event ids never change.

**`BarLayer`** (`bar-layer.ts`), a memoising getter class the page will read through in B2 (`line`, `preLine`, `score`, `bars`, `measureAt`, `labelOf`, `readingLabelOf`). Written now so B2 is a swap of lines; 4 tests.

## Tests (the brief's B1 "done when")

Division gives 8 bars from the fused fixture, every bar adds up, ids unchanged, onsets from the downbeat, the bars after it shifted by one, both halves keep one strip. Join gives 7 bars, the merged bar `8 of 4`, onsets continuing. A join is refused at a change of signature and at a repeat end. A division that leaves a short bar keeps its flag (`3 of 4`). A mark on a deleted opener stays. Repeat flags follow a division. A key change, and two tempo marks inside the divided bar, are re-indexed. A signature change: 4/8 to 3/4 over the Gretchaninov-shape fixture makes every bar add up; "to next" stops at a reading change; "to end" overrides it; a later change of hers bounds an earlier; a signature on a deleted opener is carried. A barline-only record and a signature-only record are not pruned; Restore keeps both. An empty map returns the same objects.

**Undo restores** is pinned at B3 and T1, where the write sites are; at B1 there is no write site.

## Two corrections to the review of 2026-11-10

1. **Amendment 7 says the phonation seconds double when 4/8 becomes 3/4; measured, they HALVE** (`analysis/rebar-downstream.test.ts`: ratio 0.5). The felt beat moves from the eighth to the quarter, as the review says, and a typed 60 then runs the same notes at a quarter per second, where it had run them at an eighth per second. The direction is the reverse of the review's; the finding that the tempo and INSIGHTS move is right.
2. **`score/` may not import `analysis/`** (`scripts/ratchets.mjs`, MODULES), so the downstream test lives in `analysis/`. First run of gate 8 on this work failed on exactly that and is fixed.

## Decisions I took (DESK DEFAULT, one line each)

- Numbers: where a bar's structure changed, numbers run on consecutively from the first bar's own number (a pickup `'0'` then 1, 2, …); where only a signature changed, the reading's numbers stand.
- A bar the singer divides inside a reading bar keeps the reading's `isPickup` only on the first half. No bar is made a pickup by the layer (the offer, A2, may mark one).
- A time signature mark takes the digits only; the reading's common-time symbol is dropped when the digits change.
- After a "to end" mark is bounded by a later mark of hers, the bars past the later mark's own stop revert to the READING's signature, not to the earlier mark. One rule for one case; the card (T1) writes the same state in any order (amendment 10).

## What I could not establish

- Accompaniment lines carry `measureIndex` (`types.ts:108-115`, `AccompanimentLine`): I did not read how, and `rebar` does not renumber them. If a score carries one and a bar is divided, its bars and the voice's disagree. The scan path ingests none; an imported file might.
- `Measure.jump` origin tokens (da capo, dal segno, fine, to coda) belong to a bar's END, and `rebar` keeps `jump` only on the first half of a divided bar. A divided bar carrying an origin token would lose it from the half that should hold it. No stored reading carries a jump inside a bar the singer would divide.
- Whether `validateRecord` keeps the two new fields through save, load, and binder: B4 tests it.
