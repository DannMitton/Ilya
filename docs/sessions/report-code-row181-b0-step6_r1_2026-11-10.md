# Report: row 181 B0 and B0g, step 6 (a skipped note has no slur of its own) (Code, cloud lane 40, r1, 2026-11-10)

From Fable 5.2's as-built review, amendment 40-1.

## The fault, as reviewed

A slur that starts on a skipped grace note marked the principal note after it `inSlur` (`voiceNotes` read the grace note's slur ends as its own, then `slurSpans` marked the notes after its start). Where a system's count was one short, the slur gate (`seatPage`) took the slur reading, the principal note entered `sung` as a continuation, the syllable went one note late, and the no-syllable breach was silenced. I reproduced it: the three new tests fail with `underlay-prepare.ts` as it was at step 5 and pass with the change.

## The change (`underlay-prepare.ts`, `voiceNotes`)

A note with `skip` (grace note or chord tone) contributes no slur ends of its own. Its **starts** go to the next note with no `skip`; its **stops** go to the last non-rest note with no `skip` before it; a start with no later unskipped note, or a stop with no earlier one, is dropped (no partner, as `slurSpans` already treats one). Each note's ends are put back stops-before-starts, as `slurEndsOf` orders them, and `slurSpans` marks no skipped note (`inSlur` is false on any note with `skip`). The comment follows the 2026-11-01 form and names the typed path's rule, `packages/score-parser/src/musicxml-parser.ts:703-711` (N.188 A.2a: a dropped grace note's starts wait for the next kept note, its stops go to the last kept note before it).

One reading of «next note with no skip»: a rest counts as the next note for a carried start (a slur start on a rest never marks its own note, so the result is the same as dropping it). The typed path says «kept note», which includes rests too.

## Tests (`underlay-prepare.test.ts`, 3 new)

1. `voiceNotes` on four notes where the second is a grace note holding the slur start and the third the stop: every `inSlur` is false, the grace note's included.
2. A real slur still spans its principals: a stop on a grace note goes back to the last unskipped note (`[false, true, false, false]`); a start on a grace note goes to the next principal note, which is then the slur's own start and not in its span (`[false, false, false, true, false]`).
3. End to end, `prepareUnderlay` then `seatPage`, on four principal notes (ids 0, 2, 3, 4) with the grace note (id 1) holding the start and note 2 the stop, three of four syllables read: seats on notes 0, 2, 3; `slurReading` false; one breach, `{ id: 4, kind: 'no-syllable' }`. (I read «a four-note system with that grace note» as four principal notes plus the grace note, since a breach needs a fourth live note; with three live notes and three syllables there would be none.)

## Gates, on the tip, after a fetch showing `origin/cloud-lane-38` unmoved (nothing to merge)

| # | Gate | Step 5 | Now |
|---|---|---|---|
| 1 | `test:phonology` | 456 | 456 |
| 2 | `test:dictionary` | 248 | 248 |
| 3 | `@ilya/web check` | 0 errors, 12 warnings | 0 errors, 12 warnings |
| 4 | `@ilya/web test` | 4734 passed, 1 skipped | **4737 passed, 1 skipped** (+3, mine) |
| 5 | `@ilya/score-parser test` | 785 passed, 5 skipped | 785 passed, 5 skipped |
| 6 | `test:blurb` | 168 | 168 |
| 7 | `test:integration` | 125 | 125 |
| 8 | `ratchets` | OK | OK |

Stamp stays `underlay@5` (the build has not left the branch). On `silent`: left on all notes (DESK DEFAULT), as asked. Ceilings not raised.

## What Code could not establish

Whether homr writes a slur on a grace note on a real scan, and how often: the fixtures hold no grace note in the first part (step 2 report). The desk's run prints `skipped notes: … grace` per page.
