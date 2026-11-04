# Report, row 177, step 5 (r1), 2026-11-02: pair slurs as a stack

Lane: `cloud-lane-30`, on step 4 (`e5ca9b8`). Ordered by the desk from its measure of this lane merged with `Shane` 979fdd78: 361 of 590 (40, 136, 29, 82, 74) against 48 on song 1 for the control, so row 177 cost 8 on song 1. I did not see the captures; the shape below is the desk's description of song 1's MusicXML, rebuilt. Nothing under `docs/memory/`; no push to `Shane` or `main`; no pull request. No change outside `slurSpans` and its tests.

## The cause, as the desk read it, and why my pairing produced it

Notes 21 and 22 each start a slur; notes 24 and 25 each stop one. My step 1 rule paired each start with the **next** stop of its number, so both starts took note 24 and the stop at 25 matched no start. The union then ran 22 to 24, note 25 stayed free, and every later syllable sat one note early. Step 1's report (rule "Difference from the typed path") warned that two starts could share a stop; I judged the gate would bound the harm. It did not here: the counts came out even by chance on the wrong notes. That was my call, and it was wrong.

## The fix (`omr/underlay-prepare.ts`, `slurSpans`)

- Pairing is a **stack**. A `stop` closes the most recent open `start` of its `number`; two starts never share a stop.
- A `stop` with **no `number` attribute** closes the most recent open start of any number. This is my reading of "or of any number when homr gives none". A stop with an explicit number that matches no open start is ignored (it does not borrow another number's start). If the desk meant that an unmatched numbered stop should also fall back to any open start, say so; it is a one-line change.
- A note stays in the union while any slur is open, including the note where the last open slur stops: the span for each pair is still start+1 to stop inclusive, and the spans are unioned.
- A stop on a start's own note closes the earlier slur, never its own (stops are processed before starts within a note, as before).
- A start never closed opens no span and counts as unmatched; a stop with nothing to close counts as unmatched.
- `SlurEnd.number` is now `number | null` (null: a stop with no attribute). A start's number still defaults to 1.

## Tests

- `underlay-prepare.test.ts`, `voiceNotes`: the song 1 shape on 27 notes (start 21, start 22, stop 24, stop 25): marked notes are exactly 22, 23, 24, 25, so 21 and 26 are free.
- Same file, `seatPage` end to end (`describe` "overlapping slurs ... step 5"): six notes, starts on 0 and 1, stops on 3 and 4. Gate line `free 6, slurFree 2, units 2, slurReading true`; «на» on note 0, «я» on note 5, no breach. This is the desk's «на» on 21, «я?» on 26 shape, with the same relative positions.
- Same file: a stop with no number closes the most recent start of any number; a numbered stop closes only its own number.
- Checked against the old code: reverting `slurSpans` fails these tests and the changed pin below; restored, all pass.

**Pin changed (was, now).** "counts the starts and stops that found no partner", first case (start, stop, stop, start, start, stop): was `unmatchedStarts 0, unmatchedStops 1` (both late starts took the last stop); now `unmatchedStarts 1, unmatchedStops 1` (the last stop closes the later start; the earlier one stays open). Nothing else changed.

## Gates

| gate | step 4 | now |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| web check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| web test | 3924 passed, 1 skipped | **3927 passed, 1 skipped** (+3) |
| score-parser | 785, 5 skipped | 785, 5 skipped |
| blurb | 148 | 148 |
| integration | 98 | 98 |
| ratchets | OK | OK |

## NOT ESTABLISHED

- That song 1 reaches 48 and the total 369: the desk's re-run decides. Not measured here.
- That the same-shape sites at notes 39, 41 (stop and start), and 42 now read correctly: I rebuilt only the 21 to 26 shape. A stop and a start on one note (39 or 41) is covered by the step 1 chain test, which the stack keeps; I did not rebuild the 39 to 42 sequence.
- Whether any real song has a stop with an explicit number matching no open start where the desk's fallback would matter (above).
