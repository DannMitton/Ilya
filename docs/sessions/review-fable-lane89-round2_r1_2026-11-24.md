# Review: lane 89, round 2, "Corrections keeps what she did" (Fable), r1

Written 2026-11-24. Lane `cloud-lane-89` at `f7bb19e`, read as the delta from `f2269fbf`. A delta read, not a fresh audit. Read from a shallow clone in the reviewer's cloud scratch space, deleted after. Orders: `docs/sessions/brief-code-corrections-keeps-round-2_r1_2026-11-24.md`. First review: `docs/sessions/review-fable-lane89-as-built_r1_2026-11-24.md`. The lane's report: `docs/sessions/report-code-corrections-keeps-round-2_r1_2026-11-24.md`.

Every path below is under `apps/web/src/lib/score/` unless it says otherwise. Every line number is the lane's at `f7bb19e`, read this session.

## Verdict: MERGE WITH FIXES

The blocker is closed and the nudge ruling is built. One fix is wanted before the merge: it is one line and one test, and without it the round puts a wrong statement into Insights. Fixes 2 and 3 can follow the merge as queue rows.

## Fix 1, before the merge: a rest she made is counted as a sung note

**What she meets.** The reader found a rest. She makes it a note, nudges it above her range, then makes it a rest again. The page draws a rest. Insights names that rest as her first note outside the range.

**Measured, three source states, real `CorrectionVerbs`, line `F3, rest, G3`, nine steps up, typed range E2 to E4:**

| | Record on the rest | Drawn event | `firstOutsideRange` |
|---|---|---|---|
| Parent `5594904b` | `{type: 'rest', pitch: A4}` | rest, no pitch | null |
| Round 1 `f2269fbf` | none | rest, no pitch | null |
| Tip `f7bb19e` | `{pitch: A4}` | rest, pitch A4 | the rest, A4, "above" |

**Why.** `settleAgainstRead` deletes `type` when it equals the read (`correction.ts:469`) and, with the `dead` clause gone, keeps the pitch. `amend` drops the pitch from a drawn rest only when the RECORD says `type: 'rest'` (`correction.ts:768`), so the drawn rest now carries a pitch. Two Insights readers take any event with a pitch as sung, with no test of its type: `lib/insights/singer-page.ts:139` (ran, table above) and `lib/insights/key-suggest.ts:251` (read, not run). The staff draws it as a rest (`packages/score-parser/src/staff-renderer.ts:1393`, read). The same record is left by a mis-press with no nudge: rest to note and back leaves `{pitch: <arrival guess>}` and a rest that carries it.

**Repair, tried in the clone and reverted.** At `correction.ts:469`, do not settle `type` on a read rest whose record still holds a pitch:

`if (mine('type') && next.type === read.type && !(read.type === 'rest' && next.pitch !== undefined)) delete next.type;`

Result: the record is the parent's `{type: 'rest', pitch: A4}`, the drawn rest carries no pitch, `firstOutsideRange` is null, the nudge still comes back (A3 in the lane's own sequence), row 3 is unchanged, and all 231 tests in the five score test files pass. It wants one test: the drawn event of that rest has no pitch.

This also answers the lane's guess 1. The record left by an unnudged round trip is then the parent's record, not a new shape.

## Question 1: the blocker is closed

Ran on `key-changes.musicxml`, note `m4-1-4` (read B flat 4), mark `{fifths: 2, through: 'next', notes: 'follow'}` on the opener of bar index 4 (`m4-0-1`), real `CorrectionVerbs` over a real `BarLayer`, same probe on all three source states:

| Press | Parent `5594904b` | Round 1 `f2269fbf` | Tip `f7bb19e` |
|---|---|---|---|
| Flat on the respelled B natural | `{pitch: B flat 4}`, drawn B flat | no record, drawn B natural | `{pitch: B flat 4}`, drawn B flat |
| Dot on a note pinned at B flat | `{pitch: B flat 4, dots: 1}`, drawn B flat | `{dots: 1}`, drawn B natural | `{pitch: B flat 4, dots: 1}`, drawn B flat |
| Rest and back on the pinned note | `{pitch: B flat 4, type: 'note'}`, drawn B flat | no record, drawn B natural | `{pitch: B flat 4}`, drawn B flat |

Rows 1 and 2 match the parent exactly. Row 3 matches in what is drawn and in the pin; the record differs by the redundant `type: 'note'`, which the lane settles. That difference is the lane's purpose, not a fault.

Also ran under the same mark: a length there and back on the pinned note keeps the pin (round 1 lost it); a tie pressed twice keeps it.

## Question 2: the repair is narrow enough, and the original defect has not come back

Built as ordered: only the written fields are settled (`correction.ts:467`, `:469`, `:470`, `:480-481`, `:483`), and no pitch is settled while any record holds a key mark (`correction.ts:470`). The local test is the same expression as `hasKeyMarks` (`key-signature.ts:92`), and it counts a `'remove'` mark too. The callers pass what they wrote: `correction-verbs.svelte.ts:266-267`, `entry.ts:274`, `:277`, `:311`.

Ran on the same note with NO key mark. Each leaves no record at the tip, where the parent left one:

- dot on and off (parent `{dots: 0}`)
- step up and back (parent `{pitch: B flat 4}`)
- sharp then flat (parent `{pitch: B flat 4}`)
- the length it already had (parent `{base: 'quarter'}`)
- rest and back (parent `{type: 'note', pitch: B flat 4}`)

Mixed presses settle only their own field: step, then dot on and off, leaves `{pitch}`; dot, then step up and back, leaves `{dots: 1}`.

Under a key mark, a dot on and off still leaves no record. A step up and back leaves `{pitch}` and lights Restore, as on the parent. That is the cost the first review stated. It also holds under a "notes keep" mark, where no pin exists; the coarse repair accepts that.

One leftover, harmless: on a song with no key mark, a record that already held a pitch equal to the read keeps it after a dot press (`{pitch, dots: 1}`). Nothing is drawn differently.

## Question 3: the nudge ruling is built, with fix 1 owed

Ran with the real verbs on a read rest: note (F3, the arrival guess), two steps (A3), rest, note. The note comes back at A3. Parent A3, round 1 F3, tip A3.

The rewritten test (`entry.test.ts:620`) fails on the round-1 code. Ran: `correction.ts` and the verbs file at `f2269fbf`, the three field arguments taken out of `entry.ts`, the tip's tests left in place: `6 failed | 158 passed (164)`. The six are rows 1, 2, and 3 (`key-signature.test.ts:266`, `:273`, `:280`), the nudge (`entry.test.ts:620`), the field restriction (`:630`), and the key-mark test (`:635`). This agrees with the lane's count.

The side effect of how it was built is fix 1 above.

## Question 4: the four fixes

1. **Stranded member on a smaller count. Built**, `tuplet-row.svelte.ts:93-98` and `:106`, `entry.ts:412`. Ran: triplet on `a`, a correction on `f`, duplet: `a` and `b` hold 2, `c` has no record, `f` keeps hers. With the take-back switched off, both new tests fail (`tuplet-row.test.ts:213`, `:225`).
2. **Test for the `#baseId` clause. Built.** With the clause removed from `tuplet-row.svelte.ts:93`, one test fails and 230 pass.
3. **Test for the tuplet guard. Built**, `entry.test.ts:642`. With the guard at `correction.ts:479` removed, one test fails and 230 pass.
4. **The round-1 report. Built.** Both corrections are in `docs/sessions/report-code-corrections-keeps_r1_2026-11-24.md`, marked as made in round 2.

Two more mutations: with the key-mark test removed from `correction.ts:470`, rows 1 and 3 and `entry.test.ts:635` fail. With the field restriction switched off (`correction.ts:467`), only `entry.test.ts:630` fails, because the key-mark test alone carries rows 2 and 3.

**Close and reopen: leaving it is right for this lane, and it is not the only path left.** Ran:

| Steps | Parent | Tip |
|---|---|---|
| Triplet on `a`, close, reopen, duplet | `c` stranded on 3 | `c` stranded on 3 |
| Triplet on `a`, triplet on `d`, back to `a`, duplet | clean duplet, `d` to `f` erased | `c` stranded on 3, `d` to `f` kept |

The second row is new with the lane: `#baseId` is `d` when she returns to `a`, so `again` is false at `tuplet-row.svelte.ts:97` and nothing is taken back. Both rows have one cause that the row's memory cannot reach: `applyTuplet` overlays (`entry.ts:398-401`) and never reads what the map already holds at that entry. The repair belongs there (clear the tail of a longer tuplet the map already holds at this entry), it would cover a reloaded song too, and it is a design choice about what the tail goes back to. That is a queue row, not a round-3 order. She sees the stranded member on the page and Restore on that note clears it, so nothing of hers is lost silently.

**Fix 2, after the merge, same queue row.** `unapplyTuplet` takes `base` and `dots` off every member of the last run (`entry.ts:418`), including a length or a dot she set on a member AFTER the tuplet was made. Ran: triplet on `a`, a dot on `c` (or a half on `c`), duplet: `c` ends with no record. The parent loses it too, so this is not a regression; round 1 kept it on a stranded member. A take-back limited to fields still equal to what the row wrote would keep it.

**Fix 3, after the merge, minor.** `unapplyTuplet` writes the old base's `base` back onto any member that still has a record (`entry.ts:416-423`). After two Undos with the row open, a length she undid on `c` returns when she applies a smaller count. Ran with the map set by hand, not through the Undo stack: `c: {pitch}` became `c: {pitch, base: 'half'}`. The parent does the same.

## Question 5: nothing cleared earlier has moved

Files changed outside `docs/` from `f2269fbf` to the tip, by `git diff --name-only`: `correction-verbs.svelte.ts`, `correction.ts`, `entry.ts`, `tuplet-row.svelte.ts`, and three test files. The merge `40e54930` brought documents only.

- Repair 2: `correction.ts` has one changed hunk, the body of `settleAgainstRead`. The grace-principal branch is untouched.
- Repair 3: the one changed hunk in `correction-verbs.svelte.ts` is `#correct` (`:263-267`).
- Repair 5: `key-signature.ts` and `bar-layer.ts` are not in the diff.
- Repair 1: moved on purpose (fix 1 of the four). Ran the first review's cases again: a second tuplet keeps the first; a correction between survives; nothing between is one Undo step.

Gate 4, my run on the clean tip, Linux: `Test Files 367 passed (367)`, `Tests 6856 passed | 1 skipped (6857)`. The total agrees with the lane. The split differs by the four `burg` tests, which ran here. Type check, my run: `0 errors and 12 warnings in 5 files`.

## Question 6: the build, Playwright, and the capture

It does not block this lane. The round's source change is four files of pure logic under `lib/score/`, with no component, route, string, or new import between modules that did not already import each other (`tuplet-row.svelte.ts:27`, `correction-verbs.svelte.ts:45`). The type check is clean. INFERENCE, not run: the build is at low risk for that reason.

Two things I did not establish. Whether any Playwright file asserts on a record the lane now settles (`apps/web/e2e/key-signature-card.test.ts` and `grace-corrections.test.ts` drive these verbs; I did not run them). Whether any captured family presses these verbs. The ship gates on the Mac run both before the push, per `docs/memory/STATE.md:37`, so the merge itself is the check. The baseline is expected to differ where it captures a Corrections press, because the lane changes that on purpose; a recapture after the merge is owed, not a precondition.

## Question 7: out of scope, and untouched

`correction.test.ts` and `correction-verbs.test.ts` are not in the diff from `f2269fbf`, so the grace-note orphan test (row 205) and the grace-stop landing are as round 1 left them. No string changed.

What a singer would meet that neither document intended: fix 1, and the second row of the tuplet table.

## Not established

- Anything on a rendered page, including the stable-proxy question the first review left open.
- `key-suggest.ts:251` counting the rest: read, not run.
- That the Insights pane's score is the corrected one at every link. Read: `routes/+page.svelte:4361` hands it `correctedScore`, and `lib/insights/InsightsPane.svelte:179` derives `analysisScore` from `readingScore`. The link between those two I did not read.
- Fix 3 through the real Undo stack.

## Conduct

One clone, in cloud scratch, deleted. Two probe test files written inside the clone and removed. Mutations and one candidate repair made in the clone and reverted; `git status` clean after each. Gate 4 run whole, once. Nothing merged, pushed, or published. No subagents. This file is the only write to the Mac tree, and no `.bak` was made. Terms: "pin" and "stranded member" are adopted from the first review; "take-back" is the lane's; none coined here. Token spend: about 140,000, estimated, not metered.
