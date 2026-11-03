# Brief: the scan path observes a printed slur as a melisma when the counts come out even (Code, cloud lane, row 177, r1, 2026-11-02)

Written by the desk (Opus) from a measure on row 114's first file (songs 1 to 5; the second file stays sealed for the gate). Fable reviews this brief before it is sent.

## The ruling this builds

`OPEN.md`, "A PRINTED SLUR IS A MELISMA ILYA OBSERVES, NOT ONE IT CREATES", RULED by Dann 2026-10-20 03:37. Ilya invents no melisma. A slur printed over the voice's notes is evidence of one, and the seating observes it **when doing so makes the notes and the syllables come out even; where the counts disagree, it seats one syllable per note as today.** The typed path already does this: `apps/web/src/lib/score/slur-seat.ts` (`slurContinuationIds`, `observedTargets`; QUEUE row 149, shipped `b488bef9`). The scan path does not: `voiceNotes` (`apps/web/src/lib/omr/underlay-prepare.ts:70`) reads ties only, so a slur's later notes count as free, a token drifts onto them, and every later syllable in the system sits one note late.

`CONTRACT.md` §0.1 governs: one vowel per note, no more and no less; a slur continuation is a continuation note and takes no syllable.

## The measure behind it

Tree: `Shane` `83e8610` merged with `cloud-lane-28` `5ee60a6` (the tree now shipped as `e74ee1b2`, tree `06b83f59`), built, headless Chromium, `?words=read`, homr on wasm, scored per syllable against the truth (credit (b): exact syllable on its exact note). Scratch diff `~/Downloads/_desk-2026-11-02/t0t2/scratch-t2.diff`; report `report-desk-t2-slur-aware_r1_2026-11-02.md` beside it.

| arm | (b) of 590 |
|---|---|
| control (the shipped tree) | 363 |
| slur taken per system where it makes the counts equal or nearer | 373 (+10) |
| slur taken in every system (no gate) | 376 (+13) |
| slur taken per system only where the counts come out exactly even | DESK FILLS IN before sending (`/root/desk/D/`) |

The gain is in seating: lost syllables at the seating stage fell from 38 to 28. Song 5 lost 1. No arm added a note with two vowels or a new empty sung note (DESK CHECKS before sending).

## Lane

Sonnet. Branch `cloud-lane-30` from `Shane` at its tip (`e74ee1b2` or later). Push only that branch; never `Shane` or `main`; no pull request; nothing under `docs/memory/`; no `brief-*` or `review-*` file. One commit and one report per step at `docs/sessions/report-code-row177-scan-slur_step<n>_r1_2026-11-02.md`.

## Steps

**Step 0.** All eight gates on the cut; record them.

**Step 1, read the slur.** In `voiceNotes` (`underlay-prepare.ts`), read `<slur type="start">` and `type="stop"` on the voice part and mark `inSlur` on every note after a slur's first note, up to and including its stop note. Follow `slurContinuationIds`'s semantics (`slur-seat.ts:41-53`) so the two paths agree: span from start to its stop, inclusive; the start note is not a continuation; overlapping or nested spans take the union. One difference to settle and state in the report: the typed path skips a rest inside a slur and keeps the slur open; the scratch closed any open slur at a rest. Use the typed path's rule unless a test shows a reason not to, and say which. Carry `inSlur` into `NotePlace` (`underlay-seat.ts:86-94`) at `underlay-prepare.ts:113`.

**Step 2, the gate, per system.** In `seatPage` (`underlay-page.ts`, around `:196-219`), after the vowelless drop has produced the system's syllable units: count free notes two ways, ties and extenders only (today) and ties, extenders, and `inSlur`. Take the slur reading for that system **only when the slur-aware free count equals the number of syllable units and the ties-only count does not**, and where the system has at least one `inSlur` note; otherwise the system seats as today. Per system, not per song: the scan seats system by system, and a whole-song count does not exist on this path. Say this in a comment that cites the ruling and `slur-seat.ts`.

**Step 3, one predicate in every site.** Where a system takes the slur reading, an `inSlur` note is a continuation at every site that decides the question, changed together (`CONTRACT.md` §4):
1. `seatTokens`' `free` (`underlay-seat.ts:197`);
2. `freeNoteXs` (`underlay-counts.ts:44`), which `underlay-seat.test.ts` holds equal to `free`;
3. the `continuation` flag of the sung notes passed to the one-vowel-per-note check (`underlay-page.ts:216`), so a slur continuation without a syllable is not a `no-syllable` breach;
4. the per-system count in the console line (`underlay-reader.ts`, `counted`): print, per system, ties-only free, slur-aware free, units, and which reading the system took.
Where the system does not take it, `inSlur` changes nothing anywhere. Name any other site you find and how it now agrees.

**Step 4, tests.** A system whose slur makes the counts even takes it (song 2 bar 8 shape: «ка» over two slurred notes, the next syllable on the note after the pair); a phrasing slur over a syllabic passage, where the counts disagree, leaves the system as today; a tie and a slur on the same notes; a slur whose start note is the system's last note; a rest inside a slur (whichever rule step 1 chose); `freeNoteXs` equal to `free` with and without the slur reading. Pins that change, with was and now.

## Measure (the desk runs it)

The desk re-runs row 114 songs 1 to 5 on the lane's build and expects the strict arm's number above, within 2.

## Report

What changed; the gate lines; pins changed, with was and now; every site and its line; the rest rule chosen and why; what you could not establish. NOT ESTABLISHED beats a complete invented answer.
