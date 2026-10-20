# Report: row 149, the seating observes a printed slur as a melisma when the counts agree

Branch `cloud-lane-12`, after batch A (`aa31941`). Brief: batch B r2, row 149.

## The diff, by file

- `apps/web/src/lib/score/slur-seat.ts` (new; `pairings.ts` is at its ceiling): `slurContinuationIds(events)`, `observedTargets(events, queue)`, `withObservedMelismas(map, marks)`, and `mergeOnUploadObserving(existing, events, queue, noLyrics)`.
  - A continuation is every note after the first under one printed slur: only a `SlurEnd` with `type === 'start'` and a `partnerEventId` opens a span; it runs in document order to the partner, inclusive; a rest inside is skipped and does not break the slur; overlapping or nested spans take the union; a note is counted once; the start note is not a continuation.
  - The gate: T is `syllableTargetIds(events)`, C the continuations among T. When `queue.length === T - C` (and C is not empty), `targetIds` is T less C and `marks` holds `{ kind: 'melisma' }` for each continuation; otherwise today's T and no marks. The queue is the one handed to `mergeOnUpload`; the gate reads no other.
  - `mergeOnUploadObserving` calls `observedTargets`, then `mergeOnUpload` with those targets; the marks go in only where `firstPass` ran (`proposed`), as `{ ...map, ...marks }` guarded `map[id] === undefined` per id.
- `apps/web/src/routes/+page.svelte` (5618 to 5607, ceiling lowered): the two first seatings (`:2020`, the first transcription of a wordless score; `:2862`, the upload path) call `mergeOnUploadObserving(doc.pairings, <vocalLine>, buildSlotQueue(lines), noLyrics)`, in place of the `mergeOnUpload` call with its filter and `syllableTargetIds` argument lines. The brief calls the new function at "the `targetIds` argument" at these two places; I put it behind one wrapper there so the page gets shorter (the observed-targets function is the one the wrapper calls).
- `apps/web/src/lib/score/slur-seat.test.ts` (new, 11 tests).
- `scripts/ratchets.json`: `+page.svelte` 5618 to 5607.

`syllableTargetIds` is unchanged. No string is written.

## The seating sites, and why only two change

`syllableTargetIds` is computed at: `+page.svelte:1201` (`eventIds`, the hand's and the shift's note order: not a first seating, unchanged), `old-reader-seats.ts:151` (rekeys an old reader's seats: moves existing seats, unchanged), `placement-scope.ts:30` (Place from here fills open notes below a selection: DESK DEFAULT, unchanged), `heal.ts:144` (the heal moves existing seats, unchanged), and the two call sites above (changed). What depends on them agreeing is that a melisma mark is only ever on a note in `eventIds` (`toggleMelisma`, `pairings.ts` about `:548`); that holds because C is a subset of T, and T is a subset of `eventIds`. A note a slur continues that is a tie's continuation is not in T and so is never marked. `melismaRuns` (`pairings.ts` about `:579-585`) finds a syllable before each continuation, including a slur that starts on a tie's continuation: the run is anchored to the nearest earlier note that holds a syllable.

The seats that write placements are `firstPass` and `mergeOnUpload` (`pairings.ts`), `seatScoreWords` (`score-seat.ts`), `seatCliticFolds` (`clitic-seat.ts`), and `reseatAcross` (`reseat.ts`); only `firstPass`, through `mergeOnUpload`, is changed in effect. `seatCliticFolds` runs after the merge at the first site and writes no continuation.

## Gates

phonology 267, dictionary 248, blurb 145, integration 55, web-test 2943 (2943) (2932 plus 11), web-check 0 errors and 12 warnings, score-parser 775 passed and 5 skipped (780), ratchets OK.

## The tests

Two bars of 3/4, bar 1 three quarters, bar 2 E5 A4 B4 with a slur E5 to A4, the poem «Дай-те бо-ка-лы!» as five slots: T is 6, C is 1, the gate passes: «Дай», «те», «бо», «ка» on E5, the A4 a melisma, «лы!» on B4 (the syllable text carries its punctuation). Controls: the same bars with no slur seat one per note; with the slur and a six-slot poem (the phrasing-slur case) one per note and no melisma; a slur over a syllabic passage seats exactly as the same score with its slurs removed. Also: a tie inside a slur is not counted (the tie's second note is not a target); a rest inside a slur does not break it, and nested slurs take the union once; only a start with a partner opens a span; placements already on the page are never overwritten (the second seating is not a first seating); a score that carries its own words is untouched; undoing one observed melisma with `toggleMelisma` leaves the note undecided, runs no re-seat, and the next syllable stays where the gate put it; and the rendered system carries the printed slur, no derived `data-slur=` arc, and draws «ка» and «лы!» once each.

## Could not establish

- **How often the gate passes on the in-tree fixtures that carry slurs.** None: `n188-markings.musicxml`, `row126-song1-bars-9-10.musicxml`, and `sunless-01-engraved.musicxml` all carry lyrics, so they take `seatScoreWords`, not `firstPass`; the gate is exercised by this row's own tests only, as the brief expected. I did not run it against any real wordless score with a typed poem, song 2 included (the file is not in the tree).
- **The upload through the page.** I tested the pure seating and the renderer; I did not drive the app with a wordless score, a slur, and a typed poem.
- **The derived-melisma slur arc suppression** is exercised only through "no `data-slur=` in the output"; the renderer's own suppression rule (`staff-renderer.ts` about `:2383`) I read but did not test separately. The melisma over a middle syllable draws no extender by the renderer's rule (an extender opens only on a whole or end syllable), so a hyphen, not an extender, follows «ка» here.
- **MNX**: carries no slur ends into `vocalLine`, so the gate never passes there; not tested.
- **Owed to Dann for new wording**: `upload.banner.noLyrics` (`apps/web/src/lib/i18n.ts:1444`) and `upload.banner.noLyricsScan` (`:1448`) say "assigned one syllable per note", which is no longer true where a slur is observed. I left them.
