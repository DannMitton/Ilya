# Report, row 177, step 3 (r1), 2026-11-02: one predicate in every site

Lane: `cloud-lane-30`, on step 2. Read before changing: `omr/underlay-seat.ts:188-260` (`seatTokens`), `omr/underlay-counts.ts` (all), `omr/underlay-page.ts` (all, as step 2 left it), `omr/underlay-clitics.ts:36-145`, `omr/underlay-reader.ts:53-61`, `omr/underlay-seat.test.ts:370-420`. Nothing under `docs/memory/`; no push to `Shane` or `main`; no pull request.

## What changed

The decision (step 2's `slurReading`) now reaches every site through the notes. `seatPage` builds `seatNotes` at `underlay-page.ts:256`: the system's own notes where it took the slur reading (its `inSlur` notes are continuations), and `tiesOnly` (a copy with `inSlur` false) where it did not. `seatFree` (`:257`) is that reading's free set.

## Every site, and the reading it takes

The only reader of the three flags, as a continuation decision, is `isContinuation(note)` (`underlay-seat.ts:108`). It is asked at the first two, the third and fourth reach it through the notes.

1. `seatTokens`' `free`, `underlay-seat.ts:213`: `!isContinuation(staff[j])`. Was `!tiedInto && !underExtender` at `:197`.
2. `freeNoteXs`, `underlay-counts.ts:44`: `!isContinuation(n)`. Was `!n.tiedInto && !n.underExtender`. The comment at `:40-41` now says the filter is `isContinuation`, the same as `seatTokens`'; the equality is pinned (below).
3. The `continuation` of the sung notes passed to `vowelsPerNote`, `underlay-page.ts:266`: `isContinuation(n)` over `seatNotes`, after the gate. A slur continuation with no syllable is not a `no-syllable` breach where the system took the slur reading; a note under a slur in a system that did not is checked as today.
4. The console line, `underlay-reader.ts:58-60` (`counted`): per system, `ties N, slur-aware N, units N, SLUR|ties`.
5. Numbers derived from the free set in `seatPage`, each with the reading it takes:
   - `free` (`:200`), ties-only: read before any units exist by the rescue decision (`:~205`, `free.length > 0`, whether the system has a note to seat on) and by the first `foldClitics`. **Ties-only is its reading in every system.**
   - `foldClitics` (`:~236`): runs before the gate, because the gate counts its units, so it first reads `free`. The free notes enter it only for the `ownNote` count (`underlay-clitics.ts:52`, `:97-98`, `:119-126`), never the units. Where the system took the slur reading, it is run **again** with `seatFree` (`:259`) and its counts are the ones kept. The units are the first run's, identical by construction. This re-run is the one mechanism I added beyond the brief's list; the alternative was to leave `ownNote` on the ties-only reading for a slur system, which would count a clitic over a melisma note as "a note of its own".
   - `manyVowelsInUnits(units, seatFree)` (`:268`) and `manyVowelsMerged(units, placed, seatFree)` (`:276`): the system's reading.
   - `perSystem` (`:~252`): carries both numbers and the reading (`free` ties-only, `slurFree`, `units`, `slurReading`).
   - The FAR reach, `underlay-seat.ts:226` (`FAR_FACTOR * medianGap(xs)`, `xs` the free notes): follows from site 1. Fewer free notes widen the median gap and so the reach. A token far under the ties-only reading can be near under the slur reading, and the test below pins it.
6. What depended on them agreeing: the comment at `underlay-counts.ts:40-41` and the pin at `underlay-seat.test.ts:394-404` (still passing, unchanged), now also held by a test over all three flags with and without the slur reading.

Sites I found that the brief did not name: none that decides a continuation. `grep` over `apps/web/src` (tests excluded) for `.tiedInto`, `.underExtender`, `.inSlur` finds `underlay-seat.ts:109` (the predicate), `underlay-prepare.ts:178` (the carry), and in `underlay-page.ts` two reads of `inSlur` as data, not as a decision: `:197` builds the ties-only copy and `:251` asks, for the gate, whether a note that is free by ties alone is under a slur. The bars at `:280` are untouched.

Where the system does not take the reading, `inSlur` changes nothing anywhere: a test holds `words`, `breaches`, and `manyVowels` equal to the same page with no slur flags.

## Tests (+8 in gate 4: 3914 to 3922)

- `underlay-seat.test.ts`, new `describe`: `isContinuation` for each flag; `freeNoteXs` equal to the notes `seatTokens` seats on, over four note sets (all three flags at once; the same with `inSlur` false; a slur set read both ways); no token seated on a melisma note under all three rules; the **FAR flip**: free notes 100, 150, 200, 1000, a token at 600; ties-only median gap 50 so reach 100 and the token is unseated, slur reading median gap 900 so reach 1800 and it seats on note 13.
- `underlay-page.test.ts`: the song 2 bar 8 shape applied (the pair takes «ка», the next syllable seats after it, no breach; the same page by ties alone drifts «мир» onto the melisma note and breaches on the empty one); a phrasing slur where the counts disagree leaves the system equal to the no-flag system; a slur whose start note is the last note of one system, with the next system's first note a melisma; a folded clitic's `ownNote` counted on the reading taken (1 by ties alone, 0 under the slur reading). These replace step 2's "nothing reads it yet" test.
- `underlay-reader.test.ts`: the per-system console line under both readings.
- Mutation check, run and reverted: never applying the reading, skipping the re-fold, and reading the old two flags at `seatTokens`, at `freeNoteXs`, and at the sung notes each fail at least one of these tests.

**Pins that changed, with was and now.** Step 2's test "does not change the seating or the breaches in this step" (was: seating and breaches equal with and without a slur flag; now removed, because the reading is applied). No other existing pin changed in this step. The step 2 `perSystem` pins stand. The console line's wording changed (was `1: 3 against 1`, now `1: ties 3, slur-aware 3, units 1, ties`); no test pinned the old wording.

## Gates

| gate | step 2 | now |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| web check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| web test | 3914 passed, 1 skipped | **3922 passed, 1 skipped** (+8) |
| score-parser | 785, 5 skipped | 785, 5 skipped |
| blurb | 148 | 148 |
| integration | 98 | 98 |
| ratchets | OK | OK |

## Why no arrival-side site is named

The scan's words reach the file as `<lyric>` elements written by `writeLyrics` (`underlay-song.ts`, `underlay-words.ts`), and the parser reads a missing syllable as a melisma (`score/pairings.ts:8-9`). A slur continuation with no lyric therefore arrives as a melisma with no new code. I read `pairings.ts:8-9` as cited in the review and did not trace the renderer's draw of it (the review's own NOT ESTABLISHED, which I did not close).

## NOT ESTABLISHED

- The step 3 effect on the five songs: not measured (no captures here). The desk's re-run gives (b), the per-song systems that took the slur reading, and whether they agree with the truth.
- Whether the second `foldClitics` run is a visible cost: not timed.
- The renderer's draw of an arrival with slur continuations and no `<lyric>` (above).
