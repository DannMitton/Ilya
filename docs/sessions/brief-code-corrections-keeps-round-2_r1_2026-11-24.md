# Brief: Corrections keeps what she did, round 2, closing Fable's blocker (Code, cloud lane 89 continued), r1

Written by the desk (Opus 5), 2026-11-24. **This is not a new lane.** Check out `cloud-lane-89` at `f2269fbf` and keep going on it. Dann merges the branch once this round is done and reviewed.

Your predecessor built all five repairs, and Fable verified every one against the parent commit: 23 of the 35 new tests fail at `5594904b`, so the defects were real and the tests are honest. One repair then introduced a new way to lose the singer's work. The review is `docs/sessions/review-fable-lane89-as-built_r1_2026-11-24.md`. Read it whole. Its governing brief is `brief-code-corrections-keeps-what-she-did_r2_2026-11-24.md`, which still stands.

## Blocker: repair 4 removes a pitch the singer pinned against a key change

**What she meets.** She sets a key change from bar 5 with "notes follow", and Ilya respells a read B flat to B natural. On one note she wants the B flat the score printed.

1. She presses flat. The page does not change, and an Undo step is pushed for nothing.
2. On a song where she pinned that B flat before this lane, she presses the dot on that note. The dot goes on, and the pitch turns to B natural with no word about it. Turning the note to a rest and back does the same.

**Why.** Under a "follow" mark the key layer leaves a note alone when its record holds a pitch (`key-signature.ts:138`, and the standing test `key-signature.test.ts:57`). A pitch record EQUAL to the read is therefore not an empty decision there: it is her pin. `settleAgainstRead` deletes any pitch equal to the read (`correction.ts:451-460`), sweeps the whole record rather than the field the verb wrote (`correction.ts:447-469`), and runs on every press through `#correct` (`correction-verbs.svelte.ts:265`), on the rest toggle (`entry.ts:274,277`), and on the tie toggle (`entry.ts:311`).

**Build:** settle only the field the verb wrote, and never settle `pitch` while the map holds a key mark (`hasKeyMarks`, used at `key-signature.ts:113`). Fable weighed the exact alternative, comparing against what the note would draw after the key layer, and ruled it too large a change at the centre of the model. Take the coarse repair.

**Done when:** all three rows of Fable's table come out as the parent does, each as a committed test on `key-changes.musicxml`, note `m4-1-4`.

## Dann's ruling, 2026-11-24: the nudge comes back

A rest the READER found, made a note, nudged, made a rest again, then a note again, used to come back at the nudged pitch. The lane prunes the record (`dead` at `correction.ts:457`) so it now comes back at the arrival guess, and the lane's own test pins that (`entry.test.ts`, "rest to note and back, on a rest the reader found").

**Dann ruled: keep her nudge.** Losing her work silently is the worse failure, and Corrections exists to hold it. Build that, and rewrite that test to pin the pitch coming back.

## The four fixes

1. **A tuplet made smaller after any correction leaves a stranded member.** Triplet on `a, b, c`, any correction elsewhere, then nudge the row to a duplet: `a` and `b` hold `actualNotes: 2` and `c` still holds 3. The fresh base taken at `tuplet-row.svelte.ts:90-92` already contains the row's own last write and `applyTuplet` only overlays (`entry.ts:398-401`). The fault is older than the lane, but amendment 1 moved it onto a path where one stray press reaches it. Repair: when the base is retaken for the SAME entry, take the records of the row's last run back to what the old base held before applying.
2. **No committed test covers the `#baseId` clause** at `tuplet-row.svelte.ts:90`: remove the clause and all 13 pass. Add a case with a second entry and nothing between.
3. **The tuplet guard at `correction.ts:461` is untested**: remove it and 196 of 196 pass. Add a case.
4. **Your predecessor's report is wrong in one sentence.** It says the grace stop is the only selection it moves; deleting a read note before a hand-added note now lands on the hand-added note. Correct the report, and record the rest-memory change under repair 4.

## Also found, and not yours

A note added after a grace note vanishes when the GRACE NOTE is deleted, with no orphan reported (`correction.ts:534`, `:940`). Older than the lane, and `correction.test.ts:613` now records it as expected. The desk has put it in the queue. **Leave it, and leave that test as the lane wrote it.**

## For Dann, not for you

The grace stop landing in repair 3 (after deleting the note before a grace note, a second Delete now removes the grace note). Marked DESK DEFAULT by your predecessor. Dann is looking at it. Change nothing.

## Constraints

- `CONTRACT.md` governs. Read `docs/memory/README.md` first and follow its read order.
- Every repair carries a test that fails without it. Record the before and after run for each.
- Do not touch `key-signature.ts`'s own walk (repair 5): it is sound.
- No new user-visible string without flagging it for a French draft. **You do not write French.**
- Run gate 4 whole and report the figure with its skip split. Fable's clean run on this branch read `6845 passed | 1 skipped (6846)`; your predecessor reported `6841 passed | 5 skipped (6846)`. Say which your sandbox gives and why, if you can tell.
- Do not merge, do not push to `Shane`, do not run `ilya-ship.sh`.

## Return memo

Write `docs/sessions/report-code-corrections-keeps-round-2_r1_2026-11-24.md` on the branch and end your session with a memo of at most 400 words: the blocker and each fix, built or not, with the path:line; the three table rows after the repair; the ruling on the nudge as built; gate 4 whole with its skip split; anything left undone and why; and every place you guessed.
