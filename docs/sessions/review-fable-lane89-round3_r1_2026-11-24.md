# Review: lane 89, round 3, the rest that remembers a pitch (Fable), r1

Written 2026-11-24. Lane `cloud-lane-89` at `2d3e8f9`, read as the one commit past `f7bb19e`. A check of one repair, not an audit. Read from a shallow clone in the reviewer's cloud scratch space, deleted after. Second review: `docs/sessions/review-fable-lane89-round2_r1_2026-11-24.md`.

Paths are under `apps/web/src/` and line numbers are the lane's at `2d3e8f9`, read this session.

## Verdict: MERGE

Nothing is owed before the merge. One queue row is offered under question 6.

## 1. The repair is the one prescribed, and it is narrow

The condition at `lib/score/correction.ts:474` is, character for character, the line the round-2 review gave. The comment above it is `:469-473`. The lane's report still cites `:469` and `:768`; the commit moved them to `:474` and `:773`. The lane read the finding correctly from the desk's prose.

It declines to delete `type` only when the read is a rest AND the record holds a pitch. Ran `settleAgainstRead` directly:

- read rest, `{type: 'rest'}` with no pitch: record gone, as before.
- read note, `{type: 'note', pitch: G3}`: `{pitch: G3}`, as before.
- read note made a rest, `{type: 'rest', pitch: F3}`: kept, drawn rest with no pitch, as before.
- read rest, `{type: 'rest', pitch: A4}`, a press that wrote only `dots`: unchanged.

With the condition taken out, the lane's new test fails at its record assertion (`lib/score/entry.test.ts:638`; the test opens at `:631`), `1 failed | 76 passed (77)`. Restored; `git status` clean.

## 2. The three key-mark rows, run again

`key-changes.musicxml`, note `m4-1-4` (read B flat 4), mark `{fifths: 2, through: 'next', notes: 'follow'}` on `m4-0-1`, real `CorrectionVerbs` over a real `BarLayer`:

| Press | Record at `2d3e8f9` | Drawn |
|---|---|---|
| Flat on the respelled B natural | `{pitch: B flat 4}` | B flat 4 |
| Dot on a note pinned at B flat | `{pitch: B flat 4, dots: 1}` | B flat 4 |
| Rest and back on the pinned note | `{pitch: B flat 4}` | B flat 4 |

Identical to the round-2 tip column. Row 3 at its midpoint is `{pitch: B flat 4, type: 'rest'}`, a drawn rest with no pitch.

## 3. The nudge ruling holds

Real verbs, line `F3, rest, G3`, typed range E2 to E4.

- The lane's sequence (note, two steps, rest, note): A3 comes back. Record at the rest: `{type: 'rest', pitch: A3}`.
- Nine steps up, then rest: record `{type: 'rest', pitch: A4}`, drawn rest with no pitch, `firstOutsideRange` null. Note again: A4 comes back, and `firstOutsideRange` names it, "above". She sings it, so that is right.
- Mis-press with no nudge (rest, note, rest): `{type: 'rest', pitch: F3}`, drawn rest with no pitch, null. This is the parent's record.

## 4. Insights says nothing about a rest

`firstOutsideRange` (`lib/insights/singer-page.ts:139`) returns null for the remembering rest: ran, above. `lib/insights/key-suggest.ts:252` skips an event with no pitch: read, not run; the drawn rest has none (`lib/score/correction.ts:773`), so it is skipped. Neither reader gained a type test. The repair works by keeping the pitch off the drawn rest.

Other readers of a drawn pitch with no type test, found by one grep, read at the line only: `lib/insights/singer-page.ts:110`, `lib/insights/insights.ts:396` and `:469`, `lib/insights/InsightsPane.svelte:257`, `lib/score/key-signature.ts:144`. None is fed a pitch by the repaired path. Whether each would name a rest that did carry one: NOT ESTABLISHED.

## 5. Nothing else moved

`git diff --numstat f7bb19e 2d3e8f9`: `correction.ts` +6 −1 (one hunk), `entry.test.ts` +20 −0, the lane's report +14 −0. `tuplet-row.svelte.ts`, `entry.ts`, `correction.test.ts`, `correction-verbs.test.ts`, and the verbs file are not in the diff, so the two tuplet fixes, row 205, and the grace-stop landing are as round 2 left them.

Ran: the five score test files plus `lib/insights`, `Test Files 28 passed`, `Tests 757 passed`. Type check: `0 errors and 12 warnings in 5 files`. Gate 4 not re-run whole; the lane's `6853 passed | 5 skipped` is consistent with round 2 plus one test, by arithmetic only.

## 6. The lane's guess, corrected

The guess says a read rest with a pitch record and no round trip "also keeps its `type: 'rest'`". It keeps a `type` the record already has. It does not add one. Ran: a bare `{pitch: A4}` on a read rest, settled, stays `{pitch: A4}`; the drawn rest carries A4 and `firstOutsideRange` names it.

That is not this lane's doing and not a blocker. No verb reaches it: a step pressed on an untouched read rest writes nothing (ran), and every pitch verb takes the same guard (`lib/score/correction-verbs.svelte.ts:279`, `:288`, `:317`, `:328`). The comment at `lib/score/correction.ts:762-771` says a stored record of that shape can exist and calls the pitch inert; for the two Insights readers it is not. Whether any saved song holds one: NOT ESTABLISHED.

Queue row offered, after the merge: add the type test to `singer-page.ts:139` and `key-suggest.ts:252`, which closes the gap at the reader for every record shape.

One thing seen, same on the parent's record shape, not judged: a step pressed on the remembering rest moves the remembered pitch (A4 to B4) while the page draws a rest.

## Not established

- Anything on a rendered page.
- `key-suggest.ts:252` by a run.
- Playwright and the capture, as in round 2.

## Conduct

One clone in cloud scratch, deleted. One probe test file written in the clone and removed; one mutation made and reverted. Nothing merged, pushed, or published. No subagents. This file is the only write to the Mac tree, and no `.bak` was made. No terms coined; "pin" and "remembering rest" follow the earlier reviews and the lane's "remembered pitch". Token spend: about 75,000, estimated, not metered.
