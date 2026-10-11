# Report: which bars to confirm, rechecked (row 51 slice 1, 2026-10-11)

**QUEUE row 51 slice 1, state: WRITTEN, as it already was. No code changed in this pass.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, on `cloud-lane` after row 17 (`ef9dcb07`), clean tree. The desk's list of 2026-10-11 named row 51 slice 1 for this session.

## What was found

Row 51 slice 1 was already written and pushed to `cloud-lane` by an earlier cloud session: commit `322015f6` (2026-10-09), which is an ancestor of this branch's head. It holds:

- `apps/web/src/lib/score/bars-to-confirm.ts`: `barsToConfirm`.
- `apps/web/src/lib/score/bars-to-confirm.test.ts`: 18 tests. These cover all six of the brief's section 7 cases, plus the repeat-sign pairs, a fractional reading (`6.5 of 6`), and an empty score.
- `docs/sessions/report-code-bars-to-confirm_r1_2026-10-09.md`: the section 3 answers and the 58-file table.

I did not see that commit before I started. I wrote a second version of the module and its tests, then found the first one when `git status` showed both files as modified rather than new. I put the committed files back unchanged. My draft is not committed; nothing of it is in this commit.

## What the independent pass confirms

My draft and its probe were written without reading the earlier report, so they make an independent check of it. Over the 58 files the earlier table covers, the counts agree exactly:

| Count | Earlier report | This pass |
|---|---|---|
| Bars `measureFill` names | 342 | 342 |
| Bars `aggregatePhonation` calls `untrusted` | 1 (`sunless-01-engraved`, bar 17) | 1 (same bar, index 16) |
| Bars named by the function | 335 | 335 |
| Bars set aside | 7, each a short first bar | 7, the same seven |
| Fixtures with a repeat sign | 0 | 0 |

The earlier report also found that the parser sets `isPickup` only on a short first bar (`musicxml-parser.ts:614-616`). This pass agrees.

## What is new since that report

- **A 59th fixture.** Row 25 of this session added `apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml` (99 bars). On it, `measureFill` names 0, `untrusted` is 0, and the function names 0. The 59-file totals are therefore the 58-file totals unchanged.
- **The baselines moved.** This session's rows 64 through 17 moved the gate counts, so the earlier report's gate table is out of date. The figures in the next section are the current ones.

## The eight gates, at `ef9dcb07` (no code change)

1. `pnpm test:phonology`: 251 passed (251)
2. `pnpm test:dictionary`: 242 passed (242)
3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings in 5 files
4. `pnpm --filter @ilya/web test`: 2150 passed (2150). This includes the 18 tests of `bars-to-confirm.test.ts`.
5. `pnpm --filter @ilya/score-parser test`: 653 passed, 5 skipped (658)
6. `pnpm test:blurb`: 145 passed (145)
7. `pnpm test:integration`: 55 passed (55)
8. `pnpm ratchets`: OK

## One difference between the two versions, for the desk

The two versions part on one case. Neither fixture nor the brief decides it.

- **The last bar.** The committed version takes the last bar to be the last measure that holds a vocal event. My draft took it to be the last entry of `measures`. The two differ only where the voice ends before the piece does. The committed choice fits the bar rule's purpose better, because the completing bar is a sung one. This is not a change request.

## Could not establish

Everything in the earlier report's own **Could not establish** still stands. Two items matter most:

- Double bars. The parser drops `<bar-style>`, so a short pair either side of a double bar is named.
- The 17 song readings. They are not in the repository, so the run on them is for the Mac.
