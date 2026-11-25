# Report: Corrections keeps what she did, round 2 (Code, cloud lane 89 continued), r1

Written 2026-11-24 on `cloud-lane-89`, from `brief-code-corrections-keeps-round-2_r1_2026-11-24.md` and `review-fable-lane89-as-built_r1_2026-11-24.md`. First step: `git fetch origin` and `git merge origin/Shane` (documents only, `736b1281`), merged as `40e54930`. Nothing was merged to `Shane`, no `ilya-ship.sh` was run, no French was written, and no new string was added. All paths are under `apps/web/src/lib/score/`.

Commits this round: `e1c48b2e` (the blocker and the nudge), then one for the tuplet row (repairs 1 to 3 of the four fixes), then this report.

## Blocker: repair 4 removed a pitch the singer pinned against a key change

**Built.** `settleAgainstRead` (`correction.ts:459`) now takes the fields the verb wrote and settles only those. `#correct` passes the keys of its change (`correction-verbs.svelte.ts:266`), `toggleRest` passes `type` and `pitch` (`entry.ts:274`, `:277`), and `toggleTie` passes `tied` (`entry.ts:311`). No pitch is settled while any record in the map holds a key mark (`correction.ts:470`). This is the coarse repair Fable ranked first, as the brief ordered.

**The three rows, after the repair** (committed tests in `key-signature.test.ts`, last `describe`, on `key-changes.musicxml`, note `m4-1-4`, mark `{fifths: 2, through: 'next', notes: 'follow'}` on the opener of bar index 4, real `CorrectionVerbs` over a real `BarLayer`):

| Press | Record | Drawn |
|---|---|---|
| Flat on the respelled B natural | `{pitch: B flat 4}` | B flat |
| Dot on a note pinned at B flat | `{pitch: B flat 4, dots: 1}` | B flat |
| Rest and back on the pinned note | pitch kept | B flat |

These are the parent's values from Fable's table. I did not run the parent myself this round; the tests assert the parent's values and pass on the lane.

**Before and after.** On the round-1 code (`correction.ts`, `entry.ts`, and the verbs file stashed, the new tests left in place) rows 1, 2, and 3 fail, and so do the nudge test, the field-restriction test, and the key-mark test: six failures in `key-signature.test.ts` and `entry.test.ts`, 99 passing. On the repair, all 148 in `key-signature.test.ts`, `entry.test.ts`, and `correction-verbs.test.ts` pass. A fourth test I added, a tie pressed twice on the pinned note, passes on both; it is a guard and not evidence.

**Cost, as Fable stated.** Under a key mark, a pitch nudged up and back leaves a record and lights Restore, as it did before the lane.

## Dann's ruling, 2026-11-24: the nudge comes back

**Built.** The `dead` clause is removed from `settleAgainstRead`, so a pitch on a rest the reader found is not pruned. A read rest made a note, nudged to A3, made a rest, then a note again, comes back at A3. The round-1 test that pinned the arrival guess is rewritten to pin the nudge (`entry.test.ts`, "rest to note, nudged, to rest and to note again, on a rest the reader found, brings her nudge back"). It fails on the round-1 code.

**Consequence I chose.** A read rest made a note and made a rest again, with no nudge, now leaves `{pitch: <arrival guess>}`, because the value of an unnudged arrival pitch cannot be told from a nudge that landed on it. Restore lights for that note. That is the cost of "losing her work silently is the worse failure"; the parent left a fuller record in the same case. A guess, listed below.

## The four fixes

1. **A tuplet made smaller after a correction leaves a stranded member. Built.** `tuplet-row.svelte.ts:93-98`, with `unapplyTuplet` at `entry.ts:412`. When the base is retaken for the same entry, the row takes `base`, `dots`, and `tuplet` of its last run back to what the old base held, keeping anything else she set on those notes (a pitch, a tie). Two tests in `tuplet-row.test.ts`: the stranded member (`c` has no record, `f` keeps her correction) and the take-back keeping a pitch on `c`. Both fail with the take-back switched off (mutation run). A close and reopen of the row followed by a smaller count on the same entry still strands a member: `close` forgets the base, and the brief ordered the repair for the retake only. The parent has the same fault.
2. **A test for the `#baseId` clause. Built.** "a second entry with nothing between still keeps the first tuplet" (`tuplet-row.test.ts`). With ` || this.#baseId !== id` removed (`tuplet-row.svelte.ts:93`) it fails and the other 15 pass; before this round all 13 passed with the clause gone.
3. **A test for the tuplet guard. Built.** "base and dots on a record that holds a tuplet are left alone" (`entry.test.ts`). With the guard at `correction.ts:479` removed it fails and the other 75 pass.
4. **The round-1 report. Built.** `report-code-corrections-keeps_r1_2026-11-24.md` now corrects its sentence on repair 3 (a read note before a hand-added note now lands on the hand-added note) and records the rest-memory change under repair 4. The correction is marked as made in round 2; the rest of that report is as written.

## Left alone, as ordered

The grace-note orphan (`correction.ts` around `:534` and `:940` in Fable's numbering) and `correction.test.ts:613` are untouched, with the test as the lane wrote it (QUEUE row 205). The grace-stop landing in repair 3 is untouched (Dann is deciding it). `key-signature.ts` was not touched.

## Gates

- **Gate 4: `6852 passed | 5 skipped (6857)`**, 367 files, Linux. Round 1 was `6841 | 5 (6846)`; this round adds 11 tests (five key rows, three tuplet cases, three `entry.test.ts` cases, with one round-1 `entry.test.ts` case rewritten in place).
- **The skip split.** My sandbox gives five skipped. Fable's gave one, with four more passes. Cause, established by reading and one check: `voice/engine/burg.test.ts` skips four tests where Python lacks numpy or scipy (`:6`, `:30`, `:31`, `:59`, `:80`), and `import scipy` fails in this container (numpy is present); the fifth skip is `reader/heic-decode.test.ts:130`, which runs only with `ILYA_HEIC_REAL` set. So Fable's container had scipy and mine does not. I did not install scipy, so I did not run those four.
- Type check: `0 errors and 12 warnings in 5 files`, the baseline.
- I did not re-run phonology, dictionary, score-parser, blurb, integration, ratchets, the build, or the capture this round. No file outside `apps/web/src/lib/score/` changed, apart from this report and the round-1 report.

## Places I guessed

1. Unnudged arrival pitch after a rest round trip on a read rest stays as a record (above).
2. `unapplyTuplet` restores `base`, `dots`, and `tuplet` only, not other fields, on my reading of "take the records of the row's last run back to what the old base held".
3. A local key-mark check in `settleAgainstRead` rather than `hasKeyMarks`, which lives in `key-signature.ts`; importing it would make `correction.ts` and `key-signature.ts` import each other.
4. One commit for the blocker and the nudge, because they are the same function.
5. The table's parent values are Fable's, not re-run by me.

## What I could not establish

- The page: nothing was driven in a browser, including whether `doc.corrections` hands back one stable proxy on the real page. A throwaway `$state` test in round 1 said it does; it is not committed, and Fable flagged that.
- The four burg tests, for want of scipy.

## Round 3: a rest carrying her remembered pitch is named by INSIGHTS

Written 2026-11-24, on Fable's MERGE WITH FIXES (its report is on the Mac and is not in this repository, so I worked from the defect as the brief stated it, not from the report).

**The defect.** A rest the reader found, made a note, nudged above her range, then made a rest again: round 2 settled `type` away and kept the pitch, so the record held only a pitch. `applyCorrections` drops a rest's pitch only where the record says `type: 'rest'` (`correction.ts:768`), so the drawn rest carried A4, and `firstOutsideRange` (`insights/singer-page.ts:139`) has no type test and named it as her first note outside her range.

**Built.** One condition at `correction.ts:469`: `settleAgainstRead` keeps `type: 'rest'` on a read rest whose record holds a pitch. Nothing else changed: the nudge ruling, the two tuplet fixes, row 205, and the grace stop are as they were.

**Test.** `entry.test.ts`, "a rest carrying her remembered pitch is not a note". In one run it proves both halves: after rest, note, nudge to A4 (above a range ending at G4), rest, the record is `{type: 'rest', pitch: A4}`, the drawn rest carries no pitch, and `firstOutsideRange` returns `null`; then rest to note brings A4 back, and `firstOutsideRange` names it, as it should for a note she sings. With the repair taken out the test fails (the record holds only the pitch); with it, all 77 in the file pass. I did not separately print what `firstOutsideRange` returns without the repair, since the test stops at the record assertion first; Fable's measurement of A4 on the tip stands as stated.

**Gate 4: `6853 passed | 5 skipped (6858)`**, 367 files, Linux: round 2's 6852 plus the one new test. The five skips are the same five as in round 2 (four `burg.test.ts` tests without scipy, one HEIC test without `ILYA_HEIC_REAL`). Type check: 0 errors, 12 warnings.

**Guess.** The repair keys on "read rest and record holds a pitch", as Fable recommended, so a read rest with a pitch record and no round trip (a pitch written some other way) also keeps its `type: 'rest'`; that is harmless, since it is what the parent's round trip left.
