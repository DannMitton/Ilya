# Brief: the scan path observes a printed slur as a melisma when the counts come out even (Code, cloud lane, row 177, r2, 2026-11-02)

Written by the desk (Opus) from a measure on row 114's first file (songs 1 to 5; the second file stays sealed for the gate). r2 applies all eight amendments of Fable's review (`docs/sessions/review-fable-row177-and-pw-r2_r1_2026-11-02.md`, SEND WITH AMENDMENTS); r2 carries each amendment's text, so it stands alone. r1 is superseded.

## The ruling this builds

`OPEN.md`, "A PRINTED SLUR IS A MELISMA ILYA OBSERVES, NOT ONE IT CREATES", RULED by Dann 2026-10-20 03:37. Ilya invents no melisma. A slur printed over the voice's notes is evidence of one, and the seating observes it **when doing so makes the notes and the syllables come out even; where the counts disagree, it seats one syllable per note as today.** The typed path already does this: `apps/web/src/lib/score/slur-seat.ts` (`slurContinuationIds`, `observedTargets`; QUEUE row 149, shipped `b488bef9`). The scan path does not: `voiceNotes` (`apps/web/src/lib/omr/underlay-prepare.ts:70`) reads ties only, so a slur's later notes count as free, a token drifts onto them, and every later syllable in the system sits one note late.

The 'equal or nearer' arm is not the ruling's 'even' and is not built. Its number is evidence for a ruling only Dann can make; the desk puts it to him after the build with the three numbers, never pre-empted here.

`CONTRACT.md` §0.1 governs: one vowel per note, no more and no less; a slur continuation is a continuation note and takes no syllable.

## The measure behind it

Tree: `Shane` `83e8610` merged with `cloud-lane-28` `5ee60a6` (the tree now shipped as `e74ee1b2`, tree `06b83f59`), built, headless Chromium, `?words=read`, homr on wasm, scored per syllable against the truth (credit (b): exact syllable on its exact note). Scratch diff `~/Downloads/_desk-2026-11-02/t0t2/scratch-t2.diff`; report `report-desk-t2-slur-aware_r1_2026-11-02.md` beside it.

| arm | (b) of 590 |
|---|---|
| control (the shipped tree) | 363 |
| slur taken per system where it makes the counts equal or nearer | 373 (+10) |
| slur taken in every system (no gate) | 376 (+13) |
| **slur taken per system only where the counts come out exactly even (this brief)** | **369 (+6)**; per song 48, 136, 29, 82, 74 |

The strict arm's gain is in seating (38 to 33 lost) and token splitting (28 to 27); no song falls below the control (song 4 +4, song 5 +2). Counted from the captured MusicXML of the voice part: the strict arm writes 468 lyrics, of which 5 carry two or more vowel letters, and leaves 210 untied notes without a lyric, all three equal to the control; **the 'equal or nearer' arm adds 2 notes of two vowels (5 to 7), against `CONTRACT.md` §0.1.** Strict arm tree: the control plus the scratch with `VITE_ARM=T2s` (`/root/desk/D/`), ledger `ledger-t2s.tsv`.

## Lane

Sonnet. Branch `cloud-lane-30` from `Shane` at its tip (`e74ee1b2` or later). Push only that branch; never `Shane` or `main`; no pull request; nothing under `docs/memory/`; no `brief-*` or `review-*` file. One commit and one report per step at `docs/sessions/report-code-row177-scan-slur_step<n>_r1_2026-11-02.md`.

## Steps

**Step 0.** All eight gates on the cut; record them.

**Step 1, read the slur.** In `voiceNotes` (`underlay-prepare.ts`), read `<slur type="start">` and `type="stop"` on the voice part and mark `inSlur` on every note after a slur's first note, up to and including its stop note. Follow `slurContinuationIds`'s semantics (`slur-seat.ts:41-53`) so the two paths agree: span from start to its stop, inclusive; the start note is not a continuation; overlapping or nested spans take the union. Pair each `start` with the next `stop` of the same `number` (default 1) in document order, in a first pass over the part. A `start` with no `stop` in the part opens no span (the typed path's rule, `slur-seat.ts:46-48`); a `stop` with no open `start` is ignored. So a slur across a page break marks nothing on either page: count the unmatched starts and stops per song in the report, with a NOT ESTABLISHED on how many melismas they hide. A rest never reaches `NotePlace` (`underlay-prepare.ts:101`), so the rest question is only whether the span runs past it; it does, as on the typed path. Carry `inSlur` into `NotePlace` (`underlay-seat.ts:83-94`) at `underlay-prepare.ts:113`.

**Step 2, the gate, per system.** In `seatPage` (`underlay-page.ts`), after `assertVowelPerNote` (`:232-233`) has produced the system's syllable units, at the point where `:234` counts them. The `sung.push` at `:216` runs before the units exist; move it after the gate so that its `continuation` carries the reading the system took. `NotePlace` is `underlay-seat.ts:83-94`. count free notes two ways, ties and extenders only (today) and ties, extenders, and `inSlur`. Take the slur reading for that system **only when the slur-aware free count equals the number of syllable units and at least one free note of the system is `inSlur` (so the ties-only count differs)**. This mirrors `observedTargets` (`slur-seat.ts:62-70`), whose gate is strict equality with `observed.length > 0`, taken over the whole song; otherwise the system seats as today. Per system, not per song. This is DESK DEFAULT: the ruling names no scope, and the typed path's song-level gate has no song-level unit count to mirror here. The report counts, per song, the systems that took the slur reading, and for each whether its continuations agree with the truth's melisma marks; song 1 is where homr's slurs disagree with the truth (review finding 1). Why per system: the scan seats system by system, and a whole-song count does not exist on this path. Say this in a comment that cites the ruling and `slur-seat.ts`.

**Step 3, one predicate in every site.** Where a system takes the slur reading, an `inSlur` note is a continuation at every site that decides the question, changed together (`CONTRACT.md` §4). The decision reaches every site through the notes: where the system takes the slur reading, `seatPage` hands the sites below a copy of `system.notes` whose `inSlur` notes are continuations; where it does not, a copy with `inSlur` false. One exported predicate, `isContinuation(note)` in `underlay-seat.ts`, is the only reader of the three flags, used at `underlay-seat.ts:197` and `underlay-counts.ts:44`.
1. `seatTokens`' `free` (`underlay-seat.ts:197`);
2. `freeNoteXs` (`underlay-counts.ts:44`), which `underlay-seat.test.ts` holds equal to `free`;
3. the `continuation` flag of the sung notes passed to the one-vowel-per-note check (`underlay-page.ts:216`), so a slur continuation without a syllable is not a `no-syllable` breach;
4. the per-system count in the console line (`underlay-reader.ts`, `counted`): print, per system, ties-only free, slur-aware free, units, and which reading the system took.
5. the numbers derived from the free set in `seatPage`, each named with the reading it takes: `free` at `:190` and its readers at `:197` (the rescue decision), `:222` (`foldClitics`, the `ownNote` count only, `underlay-clitics.ts:52`), `:234`, `:236`, `:244`; and the FAR reach at `underlay-seat.ts:210`, which widens when free notes are fewer. What depended on them agreeing: the comment at `underlay-counts.ts:40-41` and the pin at `underlay-seat.test.ts:394-404`.
Where the system does not take it, `inSlur` changes nothing anywhere. Name any other site you find and how it now agrees.

**Step 4, tests.** A system whose slur makes the counts even takes it (song 2 bar 8 shape: «ка» over two slurred notes, the next syllable on the note after the pair); a phrasing slur over a syllabic passage, where the counts disagree, leaves the system as today; a tie and a slur on the same notes; a slur whose start note is the system's last note; a rest inside a slur (the span runs past it); `freeNoteXs` equal to `free` with and without the slur reading; two slurs with different `number` values nested, the union; a `start` with no `stop`, which marks nothing; a token FAR under the ties-only reading that is near under the slur reading, pinning the reach at `underlay-seat.ts:210` under both. Pins that change, with was and now.

## Measure (the desk runs it)

The desk re-runs row 114 songs 1 to 5 on the lane's build and expects the strict arm's number exactly, per song (T0's floor on this machine is 0); any syllable that differs is named from the two ledgers. Scored twice: (b), and the breaches per system from the console line. No new empty sung note and no new note of two vowels against the control.

## Report

What changed; the gate lines; pins changed, with was and now; every site and its line; the unmatched slur starts and stops per song; the systems that took the slur reading per song and whether they agree with the truth; why no arrival-side site is named (the scan's words reach the file as `<lyric>` from `writeLyrics`, and the parser reads a missing syllable as a melisma, `pairings.ts:8-9`); what you could not establish. NOT ESTABLISHED beats a complete invented answer.
