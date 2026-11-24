# Review: lane 89 as built, "Corrections keeps what she did" (Fable), r1

Written 2026-11-24. Lane `cloud-lane-89` at `f2269fbf`, on `Shane` `5594904b`. Read from a shallow clone in the reviewer's cloud scratch space, deleted after. Brief: `docs/sessions/brief-code-corrections-keeps-what-she-did_r2_2026-11-24.md`. The lane's own report: `docs/sessions/report-code-corrections-keeps_r1_2026-11-24.md` (on the lane).

Every path below is under `apps/web/src/lib/score/` unless it says otherwise, and every line number is the lane's at `f2269fbf`, read this session.

## Verdict: DO NOT MERGE

One blocker, in repair 4. Repairs 1, 2, 3, and 5 do what the brief ordered. Repair 1 carries one fix that ought to travel with it. Commit 5 touches no file commit 4 touches (`key-signature.ts`, `bar-layer.ts` against `correction.ts`, `entry.ts`, `correction-verbs.svelte.ts`), so the four sound commits can ship without the fourth; that is INFERENCE from the diff stat, not a rebase I ran.

## Blocker: repair 4 removes a pitch the singer pinned against a key change

**What she meets.** She sets a key change from bar 5 with "notes follow". Ilya respells a read B flat to B natural. On one note she wants the B flat that was read.

1. She presses flat. Nothing changes on the page, and an Undo step is pushed for it.
2. On a song where she pinned that B flat before this lane, she presses the dot on the same note. The dot goes on and the pitch turns to B natural with no word about it. The same happens when she turns the note to a rest and back.

**Why.** The key layer leaves a note alone when its record holds a pitch: `key-signature.ts:138` (`movable`), and the standing test `key-signature.test.ts:57` ("leaves a pitch the singer set, and a hand entry, alone"). So a pitch record EQUAL to the read is not an empty decision under a "follow" mark; it is the pin. `settleAgainstRead` deletes any pitch equal to the read (`correction.ts:451-460`), sweeps the whole record and not only the field the verb wrote (`correction.ts:447-469`), and runs on every press that goes through `#correct` (`correction-verbs.svelte.ts:265`), on the rest toggle (`entry.ts:274`, `:277`), and on the tie toggle (`entry.ts:311`).

**Ran, lane against parent source, on `key-changes.musicxml`, note `m4-1-4`, mark `{fifths: 2, through: 'next', notes: 'follow'}` on the opener of bar index 4:**

| Press | Parent `5594904b` | Lane `f2269fbf` |
|---|---|---|
| Flat on the respelled B natural | record `{pitch: B flat 4}`, drawn B flat | record gone, drawn B natural, one undo step |
| Dot on a note pinned at B flat | `{pitch: B flat, dots: 1}`, drawn B flat | `{dots: 1}`, drawn B natural |
| Rest and back on the pinned note | pitch kept, drawn B flat | record gone, drawn B natural |

The second and third rows are a repair silently altering an unrelated correction, which the review's terms name a blocker.

**Repairs, ranked.**

1. Settle only the field the verb wrote, and never settle `pitch` while the map holds a key mark (`hasKeyMarks`, used at `key-signature.ts:113`). Coarse, small, and closes all three rows. Cost: under a key mark, a pitch nudged up and back leaves a record and lights Restore, as it does today.
2. Compare the pitch with what the note WOULD draw without its record (after the key layer), not with the raw read. Exact, but `settleAgainstRead` then needs the layer, which `entry.ts` and the verbs do not hold. Larger change at the centre of the model.

Recommendation: 1, with the three rows above as its failing tests.

## Question 1: does each repair do what the brief ordered, and does its test fail on the old code?

**All five verified against the parent, not two.** Method: the six changed source files checked out at `5594904b` with the lane's tests left in place, then the five test files run. Result: `23 failed | 197 passed (220)`. Restored after; `git status` clean.

| # | Repair | Ordered? | New tests failing on parent | What the parent printed |
|---|---|---|---|---|
| 1 | `tuplet-row.svelte.ts:90-98` | Yes, both halves of amendment 1 are in the condition at `:90` | 2 of 3 | `expected ['d','e','f'] to deeply equal ['a','b','c','d','e','f']`; `expected undefined to deeply equal {base:'half'}` |
| 2 | `correction.ts:606-608` | Yes; not `carried`, as amendment 2 ordered. Order matches the standing branch (`:591`, `:613-614`) | 3 of 6 | `expected ['a','c'] to deeply equal ['a','hand:1','c']` |
| 3 | `correction-verbs.svelte.ts:364-367` | Yes | 3 of 3 | `expected null to deeply equal {kind:'entry',id:'b'}` |
| 4 | `correction.ts:445-469`, `entry.ts:274-311`, `correction-verbs.svelte.ts:265` | Yes for the defect named; see the blocker | 12 of 16 | `expected {b:{tied:'none'}} to deeply equal {}` |
| 5 | `key-signature.ts:54-90`, `bar-layer.ts:65` | Yes; it mirrors the time signature walk at `rebar.ts:146-166`, and amendment 5 is at `key-signature.ts:56` | 3 of 7 | `expected [2,2,2,2,-1,-1,-1,-1,2,…] to deeply equal [2,2,2,2,2,2,2,2,2,2,3,3]` |

The lane's correction to the brief on repair 4 is right: the dot, pitch, and length verbs do go through `withCorrection` by way of `#correct` (`correction-verbs.svelte.ts:262-266`), and `withCorrection` prunes only a record with no fields (`correction.ts:383-398`).

In `bar-layer.ts`, the `score` passed as `read` at `:65` is the read score taken at `:53`, not the rebarred one. Correct.

## Question 2: does any repair change what a singer sees beyond its defect?

- **Repair 4: yes, the blocker above.**
- **Repair 4, second effect, not a blocker.** A rest the READER found, made a note, nudged, made a rest again, then a note again, used to come back at the nudged pitch. It now comes back at the arrival guess. Ran: parent kept `{type:'rest', pitch: A3}` and returned A3; the lane pruned the record and returned F3. Cause: `dead` at `correction.ts:457`. This follows from "leaves no correction", and the lane's own test pins it (`entry.test.ts`, "rest to note and back, on a rest the reader found"). Taste, for Dann.
- **Repair 3: the lane's report understates it.** It says the grace stop is "the one place this commit moves a selection that was not null before". Ran: deleting read note `b` in `a, b, hand:1, c` landed on `c` on the parent and lands on `hand:1` on the lane. That is what "look in the drawn line, for every entry" orders, and it matches the arrow keys, so I do not count it against the lane; the report's sentence is wrong.
- **Repair 3, grace stop.** After deleting the note before a grace note, a second Delete now removes the grace note, where it used to remove the principal. The lane marked this DESK DEFAULT. Taste, for Dann.
- **Repair 5.** A saved song that already holds a key mark on a deleted or grace-made note will show that key change again after the merge. Intended by the brief. No verb is re-run: the mark is placed at draw time and the record is not rewritten (`key-signature.ts:74-87`).
- **Repairs 1 and 2:** nothing beyond the defect, apart from the fix under question 5.

No string was changed: the diff holds eleven files, all under `apps/web/src/lib/score/`, and nothing under `routes/` or the i18n files.

## Question 3: the 35 tests

Counted from the diff (`+35`, `-0` test cases, five files, no other test file touched) and from the runs.

| File | Added | Fail on parent | Pass on parent |
|---|---|---|---|
| `tuplet-row.test.ts` | 3 | 2 | 1 (the one-undo guard, `:194`) |
| `correction.test.ts` | 6 | 3 | 3 (characterization) |
| `correction-verbs.test.ts` | 11 | 9 | 2 ("a different length is recorded", "a note the singer entered keeps its record") |
| `entry.test.ts` | 8 | 6 | 2 ("a tie turned on", "a conversion to a rest") |
| `key-signature.test.ts` | 7 | 3 | 4 (three characterization, and "own mark wins") |
| **Total** | **35** | **23** | **12** |

**Gate 4, my run on the clean lane, Linux:** `Test Files 367 passed (367)`, `Tests 6845 passed | 1 skipped (6846)`. The total 6846 agrees with the lane. The split does not: the lane reports `6841 | 5`, my container ran four of those five. Why is NOT ESTABLISHED. I did not run the full suite on the parent; 6811 there follows from 6846 less 35.

**Tests that pass, or fail, for a reason other than the repair.** Found by mutating the lane and re-running; each mutation was reverted.

1. **`tuplet-row.test.ts:167`, the new-entry case, does not test the `#baseId` clause.** With `this.#baseId !== id ||` removed from `tuplet-row.svelte.ts:90`, all 13 tests pass. The test puts an edit between the two tuplets, so the `#written` clause alone carries it. The clause works (ran: tuplet on `a`, step to `d`, apply, nothing between; lane keeps `a` to `f` with two undo steps, parent keeps `d, e, f` only), but no committed test would notice its removal. The brief asked for one case per half.
2. **The tuplet guard at `correction.ts:461` is untested.** With the guard removed, 196 of 196 pass across the four files.
3. **Two `entry.test.ts` cases fail on the parent only because `settleAgainstRead` does not exist there** (`TypeError: settleAgainstRead is not a function`): `:599` and `:627`. They are tests of the new helper, not of the old behaviour. Harmless, but they are not "before" evidence.

Mutations the tests did catch: the `#written` clause, the order of own and carried key marks, the rest memory, the before-grace line in repair 2, the grace-made carry in repair 5, and the `entered` guard.

## Question 4: do the five compose?

No two touch one decision in opposite directions, with one exception that is the blocker, and it is repair 4 against the key layer already on `Shane`, not against another repair.

- 1 and 4: the row writes `base`, `dots`, and `tuplet` (`entry.ts:398-401`); settle leaves `base` and `dots` alone where `tuplet` is set (`correction.ts:461`). Any press between two nudges makes a new map, so the row takes a fresh base and a new undo step, which is repair 1's intent.
- 2 and 5: `marksIn` calls `applyCorrections` with the deletions undone (`key-signature.ts:66-73`), so repair 2's branch for a principal that no longer stands does not fire for those entries.
- 2 and 3: a hand-added note that now survives its principal (repair 2) is in the drawn line, so a delete beside it finds it (repair 3).
- 3 and 5: deleting a bar opener moves the selection to a drawn neighbour and the key mark to the next entry standing. Independent.
- 4 and 5: settle never touches `keySignature`; `withCorrection` keeps a record that holds one (`correction.ts:394`).

## Question 5: what a singer would meet that the brief did not intend

**Fix for repair 1: a tuplet made smaller after any correction leaves a stranded member.** Ran on the lane: triplet on `a, b, c`; any correction elsewhere; nudge the same row to a duplet. Result: `a` and `b` hold `actualNotes: 2`, and `c` still holds `actualNotes: 3`. On the parent the same steps gave a clean duplet and erased the correction between (the defect). Cause: the fresh base taken at `tuplet-row.svelte.ts:90-92` already contains the row's own last write, and `applyTuplet` only overlays (`entry.ts:398-401`). The parent reaches the same stranded member by closing and reopening the row (ran: `a: 2, b: 2, c: 3`), so the fault is older than the lane; the lane moves it onto the path amendment 1 ordered, where one stray press is enough. Repair: when the base is retaken for the SAME entry, take the records of the row's last run back to what the old base held before applying. The lane's test at `:181` changes the note value and not the count, so it does not see this.

**Older than the lane, and pinned by it: a note added after a grace note vanishes when the GRACE NOTE is deleted.** Ran, same on both sides: `{'b~g1': {deleted: true}, 'hand:1': {entered: {after: 'b~g1'}}}` draws `a, b, c` and reports no orphan. Cause: `correction.ts:534` drops a deleted grace note from `readGraces`, and `orphanIds` counts a grace id as live (`correction.ts:940`). This is defect 2's sibling. `correction.test.ts:613` now records it as expected behaviour. Not this lane's to fix; it wants a row in the queue.

**Not established by me.** The Loupe closing on a null selection (`routes/+page.svelte:896`, `:4513`, read, not run). Anything on a rendered page. Whether `doc.corrections` hands back one stable proxy between reads on the real page, which repair 1's `#written` comparison rests on (`routes/+page.svelte:948-949`); the lane says a throwaway test showed it, and that test is not on the lane. If it did not hold, every nudge would push its own undo step, which the desk can see in one look at the page.

## Fixes, in order

1. **Blocker.** Repair 4 must not remove a pitch record while a key mark is in the map, and must not sweep fields the verb did not write. Three failing tests are in the table above.
2. Repair 1: no stranded tuplet member when the count shrinks after a correction between.
3. Repair 1: a test that fails when the `#baseId` clause is removed (a second entry with nothing between).
4. Repair 4: a test for the tuplet guard at `correction.ts:461`.
5. The lane's report: correct the sentence on repair 3, and record the rest-memory change under repair 4.

For Dann, taste, after the fixes: the grace stop landing in repair 3, and the lost pitch memory on a read rest in repair 4.

## Conduct

One clone, in cloud scratch, deleted. One probe test file written inside the clone and removed. Nothing merged, pushed, or published. No subagents. This file is the only write to the Mac tree, and no `.bak` was made. Terms coined here: "pin" for a pitch record equal to the read under a "follow" mark, and "stranded member" for the leftover tuplet record. Token spend: about 150,000, estimated, not metered.
