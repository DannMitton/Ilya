# Report, row 177, step 1 (r1), 2026-11-02: read the slur

Lane: `cloud-lane-30`, on step 0's commit. Read on the tree before I changed it: `omr/underlay-prepare.ts` (all), `omr/underlay-seat.ts:70-260`, `omr/underlay-counts.ts` (all), `omr/underlay-page.ts` (all), `score/slur-seat.ts:30-80`, `packages/score-parser/src/notations.ts:100-175` (`pairSlurs`). Nothing under `docs/memory/` touched; no push to `Shane` or `main`; no pull request.

## What changed

- `omr/underlay-prepare.ts`
  - `VoiceNote.inSlur` (new field), and `SlurEnd`, `slurEndsOf` (private), and `slurSpans` (exported, pure).
  - `voiceNotes` reads each note's `<slur>` ends, then marks `inSlur` in a second pass over the whole part. The marks run from the note after a slur's start up to and including its stop note.
  - `prepareUnderlay` carries `inSlur` into `NotePlace` (`underlay-prepare.ts:178`, the line the brief calls `:113`).
- `omr/underlay-seat.ts`: `NotePlace.inSlur?: boolean`, documented. **Nothing reads it yet.** The count gate is step 2 and the predicate is step 3, so this step changes no output.

## Rules as built

1. A span runs from the start to its stop, inclusive; the start note is not in it (as `slurContinuationIds`, `slur-seat.ts:41-53`).
2. Pairing is one pass: each `start` takes the next `stop` of the same `number` (default 1) on a **later** note. A stop on the start's own note is not its partner: a note that closes one slur and opens the next (`stop` then `start`) chains correctly. Within a note I put stops before starts whatever the file's order, so `start`-before-`stop` in one note's text reads the same. This ordering is my decision; the brief does not state it. Test: "chains slurs".
3. A `start` with no later `stop` of its number opens no span; a `stop` that no start took is ignored (`slur-seat.ts:46-48`).
4. Overlapping or nested spans take the union.
5. A rest inside a span does not end it and is never marked (`slurSpans`' `rest` argument). It never reaches `NotePlace` (`prepareUnderlay` filters `!n.rest && n.at !== null`, `underlay-prepare.ts:166` at this commit).
6. `type="continue"` or anything else opens and closes nothing.
7. The attribute order is not assumed: homr's own files write `number` before `type` (`<slur number="1" type="start" />`, read in `fixtures/tch-1.musicxml`), and the test covers both orders.

**One difference from the typed path, stated.** `pairSlurs` (`notations.ts:~140`) abandons an open start when a second start of the same number arrives before a stop. The brief's rule, which I built, lets each start take the next stop, so two starts of one number can share a stop and the span runs from the earlier. The brief wins; the consequence is that a stray unmatched start followed later by a complete slur of the same number marks from the stray start to that slur's stop. The gate in step 2 bounds the harm (a wrong span makes the counts disagree, and the system seats as today); it does not reduce it to zero. Not measured.

## Tests (9 new in `underlay-prepare.test.ts`, 1 in `prepareUnderlay`)

Cover: the span and its ends; `number` before `type`, and default number; a tie and a slur on the same notes; a rest inside; the union of nested and of overlapping spans with different `number`; chained slurs in both orders; a start with no stop, and a stop with no start, mark nothing; a start does not pair with another number's stop; the unmatched counts; `prepareUnderlay` carries `inSlur` into the system's notes.

Pins that changed (was, now): in `underlay-prepare.test.ts`, the three `voiceNotes` `toEqual` lists and the `prepareUnderlay` notes list each gained `inSlur: false` on every note (was: `{ ordinal, rest, bar, at, tiedInto }` and `{ id, x, bar, tiedInto }`; now: the same plus `inSlur: false`). No other pin changed.

## Gates

| gate | step 0 | now |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| web check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| web test | 3898 passed, 1 skipped | **3908 passed, 1 skipped** (+10) |
| score-parser | 785, 5 skipped | 785, 5 skipped |
| blurb | 148 | 148 |
| integration | 98 | 98 |
| ratchets | OK | OK |

## Unmatched slur starts and stops per song

**NOT ESTABLISHED.** Row 114's captures are not in this workspace (`/root/desk` and `~/Downloads/_desk-2026-11-02` do not exist here), and the app's console does not print the counts: `slurSpans` returns `unmatchedStarts` and `unmatchedStops` but nothing carries them to `UnderlayStats`. The desk can read them by calling `slurSpans` on the captured MusicXML, or I can add them to the console line in step 3 if the desk wants them in the next run (not asked for; not done).

What I could read: the four MusicXML fixtures in `omr/fixtures/` (`tch-1`, `tch-2`, `tch-3`, `sun3-2`). **The first part of each has no `<slur>` at all** (0 starts, 0 stops, 0 notes in a slur); every `<slur>` in them is in the second part, the piano (number 1 and 2). So they show the markup's shape and give no evidence about voice slurs, unmatched or otherwise. How many melismas the unmatched ones hide: NOT ESTABLISHED.

## NOT ESTABLISHED

- Unmatched starts and stops per song, and what melismas they hide (above).
- Whether homr ever writes `number="2"` on a voice slur. The `pairSlurs` comment says every voice slur arrives as number 1 (`notations.ts:~120`); I did not verify it on a voice part.
- The behaviour of rule 2's shared-stop reading on real homr output with stray starts.
