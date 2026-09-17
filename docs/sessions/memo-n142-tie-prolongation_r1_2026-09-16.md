# Memo: N.142, a tie is prolongation, not a new syllable target

Revision 1, 2026-09-16. Built against
`docs/sessions/brief-n142-tie-is-prolongation_r1_2026-09-16.md`.

## 1. What changed

**`apps/web/src/lib/shane/pairings.ts`.**

- `TieAwareEvent` (`:264-269`), a local structural type: `{ id, type: 'note' |
  'rest', tied?: { type: 'start' | 'continue' | 'stop' | 'let-ring' } }`. Not
  an import of `VocalLineEvent`, because this file's own header rule says it
  never touches that type; a caller's real parsed or corrected events satisfy
  the shape without a cast.
- `syllableTargetIds` (`:271-298`), the named helper the brief asked for: the
  ids of notes that may begin a new syllable, in document order. Excludes
  rests (unchanged from before) and a tie's continuation (new). See §3 for how
  it reads the continuation.
- `firstPass`'s doc comment (`:308-326`) updated to say its `eventIds` are
  syllable targets, ties already excluded, rather than merely "rests already
  excluded." The function's own body did not change.
- `mergeOnUpload` (`:369-402`) gained a parameter: `eventIds` (unchanged
  meaning: every sung note, decides ORPHANED) and a new `targetIds`
  (`syllableTargetIds`' output, the only thing handed to `firstPass`). See §4
  for why these had to become two lists rather than one.
- `toggleMelisma` (`:519-551`) gained a guard: `if
  (!eventIds.includes(eventId)) return { map: { ...map }, set: false,
  displaced: [] };`, placed after the "already marked, clear it" branch so a
  mark predating this rule can still be cleared, and before the "mark it"
  branches so a tie's continuation cannot receive a new one. See §5.

**`apps/web/src/lib/shane/pairings.test.ts`.** A new `syllableTargetIds`
describe block (8 tests: rests, a plain tie, a tie across a barline, a chain
of three, a rest sitting between two events, a singer-added tie, a
singer-removed tie, `let-ring`). The 7 existing `mergeOnUpload` calls updated
with the new `targetIds` argument, plus 2 new tests distinguishing "present"
from "target." 2 new `toggleMelisma` tests for the guard.

**`apps/web/src/routes/+page.svelte`.**

- `:596`, `handleStartPlacementOver`'s `firstPass` call: now
  `firstPass(syllableTargetIds(parsed.vocalLine), rebuildQueue)`.
- `:1612`, the dock's shared `eventIds`: now `$derived(syllableTargetIds(correctedLine))`
  in place of the old rest-only filter. This is read by `vacatedNotes`,
  `toggleMelisma`, `shiftToEndOfLyric`, `shiftToNextOpenNote`, `reseatByDiff`,
  and `dockShiftAnchor`; see §4 for why this one site was "establish, then
  decide" in the brief and what the decision was.
- `:3190-3195`, `applyArrival`'s `mergeOnUpload` call: the existing full
  non-rest list stays as `eventIds`; `syllableTargetIds(ingested.result.score.vocalLine)`
  is passed as the new `targetIds` argument.
- `:623`, `placeArmedSyllable`: a new guard, `if
  (!eventIds.includes(eventId)) return;`, before its existing `slot` check.
  This is a ninth seating site, not in the brief's table; see §6.
- Import list (`:13-26`) gains `syllableTargetIds`.

No file outside these two changed. `correction.ts`, `staff-renderer.ts`,
`reseat.ts`, `clitic-seat.ts`, and `score-seat.ts` were read but not edited
(§3 and §5 say why).

## 2. Expectation, then measurement

**Stated before writing `syllableTargetIds`:** tracking tie state forward
note-by-note (using the PREVIOUS note's own `tied.type` to decide the CURRENT
note's eligibility, never the current note's own field) would correctly
handle a plain tie, a chain, a singer-added tie, and a singer-removed tie in
one pass, because it never reads the field a hand correction leaves
unwritten. All 8 `syllableTargetIds` tests and both new `toggleMelisma` tests
passed on the first run.

**Measured against the real T05 file**, converted through the project's own
denigma WASM (as N.143's memo did) and parsed with the real `MnxScoreParser`:
22 tied events (11 ties), all simple two-note ties. Before this rule: 160
non-rest events. After: 149 syllable targets, the 11 continuation ids
(`m12-0-1`, `m14-0-1`, `m19-0-1`, `m30-0-1`, `m40-0-1`, `m44-0-1`, `m60-0-1`,
`m67-0-1`, `m69-0-1`, `m84-0-1`, `m89-1-4`) excluded and none else. This
matches the arithmetic exactly (160 − 11 = 149) and confirms the rule fires
on real engraved ties, not only the synthetic fixtures.

## 3. The renderer check (finding 1)

**Established: the renderer's rule and this one agree, by reading
`staff-renderer.ts:3148-3202`.** The tie-drawing loop tests `e.tied.type ===
'start' || 'continue'` on the EARLIER note (`e`, at index `i`) and, if true,
draws an arc to `placed[i + 1]` as the tie's landing note, keyed
`data-tie="{e.id}"` (the start note's id). It never reads the following
note's own `tied.type`. `syllableTargetIds` tests the identical field with
the identical predicate on the identical earlier note to decide whether the
NEXT note is excluded. So every note the renderer draws an arc into is a note
this rule excludes, and the two cannot disagree on any real, contiguous
(no-rest) tie.

**One narrow, deliberate divergence, found while checking this and not
asked for by the brief: a tie into a rest.** This cannot occur in valid
notation (a tie cannot sound across silence), so it is not a case real
parsed data produces, but the two implementations differ on it. The renderer
requires strict adjacency to a NOTE (`nxt.ev.type !== 'note'` skips drawing
entirely), so a `'start'`/`'continue'` note immediately followed by a rest
gets no drawn arc. `syllableTargetIds`, per the brief's own test list ("a
rest between… is skipped"), carries the tie state THROUGH a rest rather than
resetting it, so the note after that rest would still be excluded. This is a
considered, reversible choice (§8), made for malformed input the parsers
should not produce in the first place, not a disagreement over data either
implementation expects to see in practice.

**This also settles the spec's own NOT ESTABLISHED item 1.** A tie's
continuation was, until this build, tappable AND placeable by hand: the
loupe's `ownIds` (`heldMeasureIds`, unchanged, `:1456-1464`) already excludes
only rests, so a tied note was always selectable, and `placeArmedSyllable`
(before this build) placed onto whatever id it was given with no check
against `eventIds` at all. After this build it is still selectable
(navigation unchanged) but no longer placeable (§6).

## 4. The site table, completed

| site | reads/feeds | change |
|---|---|---|
| `+page.svelte:596` | `firstPass` input | **yes**, narrowed |
| `+page.svelte:1612` (was `:1589`) | `vacatedNotes`, `toggleMelisma`, `shiftToEndOfLyric`, `shiftToNextOpenNote`, `reseatByDiff`, `dockShiftAnchor` | **yes**, narrowed. Established: every one of these six readers is about which note may hold or receive a syllable, the same concept the brief itself names, so all six should exclude a tie's continuation together rather than some of them disagreeing about what "the note sequence" means. |
| `+page.svelte:3190` (was `:3162`) | `mergeOnUpload`'s `firstPass` branch | **yes**, but only the NEW `targetIds` argument; the existing `eventIds` argument (orphan detection) is untouched. See below. |
| `+page.svelte:2956` (was `:2947`) | the "ask to replace" dialog's orphan count | **established: no.** Read the whole function (`handleArrival`, `:2938-3031`): this `eventIds`/`present`/`orphaned` triple only feeds the confirmation dialog's warning count before an upload proceeds. It is never passed to `firstPass` or `mergeOnUpload`. A tie's continuation is still a real note the score carries, so narrowing this would misreport an ordinary, still-present note as orphaned. |
| `+page.svelte:1456`, `:1465` (was `:1448`, `:1456`) | the loupe's held measure (`heldMeasureIds`, `nextMeasureIds`) | **no**, per the brief. Confirmed unedited. |
| `correction.ts:568` (`neighbourId`), `:581` (`firstNoteId`) | hand-pick navigation, both skip rests only | **no**, confirmed unedited. |

**Why `eventIds` and `targetIds` had to become two separate lists at
`mergeOnUpload` (not asked for explicitly by the brief, a finding of
building it).** `mergeOnUpload`'s `eventIds` decides `orphaned` — a
placement whose note the new score no longer has, kept and reported, never
dropped (`pairings.ts:387-402`'s own doc comment). If the SAME narrowed list
that feeds `firstPass` had also been used for that check, a legacy placement
sitting on what is now recognised as a tie's continuation would misreport as
orphaned (the note "not present"), when the note is still there; only the
RULE about it changed. Existence and eligibility are different questions,
and conflating them would have shown singers an incorrect, alarming count on
an ordinary re-upload. New tests at `pairings.test.ts` (the two "N.142"
`mergeOnUpload` cases) pin this distinction directly.

## 5. Step 2: not built, and the reason it stopped

**Established: it cannot arise on the score-words path, confirmed by
reading `score-seat.ts:78-121` rather than trusting the spec's own claim.**
`seatScoreWords` only ever writes onto a `cell.eventId` drawn from
`collectScoreWords`, which builds cells from a note's OWN `syllable` field
(set by the parser). A parser leaves `syllable` undefined on a tie's
continuation (measured on T05 by the spec, and consistent with every ordinary
engraving), so there is no cell there to seat from in the first place.
`seatCliticFolds` (`clitic-seat.ts:430-440`) goes through the same
`collectScoreWords`, for the same reason.

**The brief's own gate: "the build's first act is a count, not a policy."
I could not perform that count.** Whether any song in Dann's own library
holds a placement on what N.142 now recognises as a tie's continuation is a
question about the contents of his browser's IndexedDB, which this coding
session has no access to. Building the migration's shape (a pure function,
per the desk's own fallback design) without knowing whether it is needed
would be exactly the "policy without a count" the brief warns against, and
wiring it into a read site nobody has confirmed is load-bearing risks adding
complexity for a scenario that may not exist. **Stopped here rather than
guessed.** If the count turns out to be non-zero, the shape the desk
describes (shift the run forward using the existing `shiftToEndOfLyric`
primitive, applied transiently wherever the map is read for display, never
written back, so no new save site opens under N.27) is still the right one
and is not designed further in this memo beyond what the brief already said.

## 6. A ninth seating site, found while building the brief's own list

**`placeArmedSyllable` (`+page.svelte:610-635`), the loupe's direct
tap-and-place, was not in the spec's or the brief's site list, and it needed
the same guard as the bulk passes.** `handleLoupePick` (`:673-676`) calls it
on whatever note the singer tapped, with no check against `eventIds`. Before
this build, narrowing `eventIds` at `:1612` alone would have left a real gap:
a singer could still tap a tie's continuation directly in the loupe and place
a syllable on it by hand, defeating the whole point of this item. Fixed with
`if (!eventIds.includes(eventId)) return;` before the existing `slot` check.
Selection still runs regardless (`handleLoupePick`'s `setCursor` call is
unconditional), so the loupe still stops on a tied note, per requirement 3;
only the placement is refused, silently, the same way a rest was always
refused (a rest was never reachable here either, because the loupe's own
`ownIds` never offers one as a tappable target in the first place, so this
function never previously needed to guard against one).

**Also found and fixed for the same reason: `toggleMelisma`
(`pairings.ts:519-551`).** `dockShiftAnchor` and `handleDockShift`
(`+page.svelte`) were already correctly gated by the narrowed `:1612`
`eventIds`, but `handleMelisma`'s own enablement, `melismaDisabled` (`selectedEventId
=== null || inGap`), never checked target-membership, and `toggleMelisma`'s
own final write, `{ ...base, [eventId]: { kind: 'melisma' } }`, ran
regardless of whether `eventId` was in `eventIds` at all. A tie's
continuation could still be marked `melisma` through the dock even after
`:1612`'s narrowing. This is not cosmetic: a note cannot be both a tie's
continuation (no new sounded event) and a melisma's continuation (a new
attack on the same vowel) at once, by Dann's own table in the spec. Fixed as
described in §1; the "already marked, clear it" branch is deliberately
unguarded so a mark predating this rule can still be removed.

**Not found to need a change, checked and confirmed by reading the code
rather than assuming:** `handleDockShift` (already gated through
`dockShiftAnchor`), `reseatAcross` (already reads the narrowed `:1612`
`eventIds`), `seatScoreWords` and `seatCliticFolds` (§5), the undo/redo
stack's `restore` (`:883-889`, restores a prior snapshot verbatim, decides
nothing new), and `rotateSyllables`/`applyBlank` (the first is unused outside
its own tests; the second only blanks TEXT for display and does not write
`doc.pairings`).

## 7. The two spec NOT ESTABLISHED items

1. **Whether a tie's continuation is tappable for hand placement:
   answered, §3 and §6.** It was tappable and placeable before this build;
   after, it is tappable (selectable) and not placeable.
2. **What a melisma spanning a tie should do: still NOT ESTABLISHED, and
   this build does not change that.** Nobody has looked at what happens
   when N.113's melisma marking and a tie occupy the same run of notes
   beyond what §6 fixes (a tie's continuation itself may not be marked). Left
   exactly as the spec left it; out of this brief's stated scope.

## 8. Gate results

All five run in full, individually, today:

| gate | baseline | this run |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216) |
| dictionary | 235 passed (235) | 235 passed (235) |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| web-test | 1187 passed (1187) | **1199 passed (1199)** |
| score-parser | 567 passed, 5 skipped (572) | 567 passed, 5 skipped (572), unchanged |

**Web-test moves: 1187 → 1199, twelve new tests, all passing.**
`docs/memory/ENVIRONMENT.md` §`Gate baselines` and
`~/Downloads/ilya-ship.sh:79` need the web-test row moved to `1199 passed
(1199)` before Dann ships. Not done here; the desk owns that table.

## 9. What could not be established

- Whether any song in Dann's own library holds a placement on a tie's
  continuation (§5). This is the one blocking Step 2, and it is a fact about
  his browser's storage, not about this repository.
- Whether other `.musx` or `.mnx` files carry ties in a shape this rule
  handles differently from a simple two-note tie (a chain longer than three,
  or two ties sharing a note). The T05 measurement (§2) found only simple
  two-note ties; the synthetic tests (§1) cover a three-note chain, but no
  real file with one was available to measure against.
- Whether `placeArmedSyllable`'s and `toggleMelisma`'s guards behave
  correctly in the running app. Neither has automated coverage:
  `placeArmedSyllable` is `+page.svelte` logic above this codebase's own
  "nothing above this line decides anything" boundary (`pairings.ts`'s header
  note), and `toggleMelisma`'s guard is unit-tested (§1) but not walked
  through the actual loupe UI.
- The tie-into-a-rest divergence named in §3 was reasoned through, not
  reproduced against a real file; no fixture with that shape was found or
  built, because building one would mean asserting a shape the parsers are
  not expected to ever emit.

## 10. Decisions this brief did not settle, and are reversible

- **`syllableTargetIds` carries tie state through a rest rather than
  resetting it** (§3). Reversible: resetting on a rest instead would only
  change behaviour on malformed input no real parser output is expected to
  produce, and would make this rule and the renderer's own drawing
  disagree on that same malformed shape instead of agreeing on every
  ordinary one.
- **`+page.svelte:1612`'s shared `eventIds` was narrowed for all six of its
  readers together, rather than only for `firstPass`-adjacent ones** (§4).
  Reversible per reader if any one of `vacatedNotes`, `shiftToEndOfLyric`,
  `shiftToNextOpenNote`, or `reseatByDiff` turns out to want the wider list;
  none showed a sign of it on reading, but none was walked live either.
- **`placeArmedSyllable` and `toggleMelisma` were given guards the brief's
  site list did not name** (§6). Reversible by removing either guard; doing
  so would reopen the exact gap this memo describes finding.

## Files touched

- `apps/web/src/lib/shane/pairings.ts` (tracked, modified)
- `apps/web/src/lib/shane/pairings.test.ts` (tracked, modified)
- `apps/web/src/routes/+page.svelte` (tracked, modified)
- `docs/sessions/memo-n142-tie-prolongation_r1_2026-09-16.md` (this file, new,
  untracked)

Not committed and not staged. No git command that writes was run.
