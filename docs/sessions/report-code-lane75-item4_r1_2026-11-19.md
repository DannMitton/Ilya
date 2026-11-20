# Report, lane 75, item 4: one kept browser test, a contralto with a score

r1, 2026-11-19 (session of 2026-11-20 UTC), by the cloud lane. Branch `cloud-lane-75`. Brief md5 `e254d48b34ba43c45d8f2a6d030faaf1`. Items 1 to 3 are commits `92f39c4`, `a5caa3b`, and `1891751`.

## What was added

`apps/web/e2e/borrowing-with-score.test.ts`, one Playwright case in each language (two tests). For a stored contralto with nothing recorded and the tracked fixture `sunless-01-engraved.musicxml` loaded (`.receipt-score` visible), it opens MELODY (`#tab-markup`) and reads `.markup-paper-container`, then INSIGHTS (`#tab-insights`) and reads `.insights-container`, and asserts each contains the ratified `placeholder.borrowing` line for a contralto in full, with all white space (a non-breaking space among it) read as one space. The line is written out in the test, not imported, so the pin does not share code with the function it pins.

**The search the brief and CONTRACT section 4 require, rerun by me at `3bff3358`** (`grep -rln "contralto\|countertenor\|bass-baritone" e2e e2e-phone`, before adding the file): `e2e/insights-no-score.test.ts` and `e2e/voice-pane.test.ts` only, as the brief says. Neither loads a score for a borrowing type. This file is the first that does.

**Proved to bite.** With the stored type changed to a tenor (no borrowing line), both tests fail on MELODY (the page reads "PLACEHOLDER VALUES FOR A GENERIC TENOR..." and no borrowing line). Restored to contralto: both pass.

## What this test does not cover

Countertenor and bass-baritone are not rendered with a score (the brief asks for a contralto; their line is the same code path, `borrowingLine`, but I did not render them). The test sets no formants, so it covers "fewer than five stable core vowels" at zero; one to four stable core vowels is covered by unit tests only (`placeholder-line` and `stand-in-borrowing.test.ts`). It is on the desk layout (1440 by 1300), not a phone.

## The eight gates, on the final tree of commit 4

| gate | baseline | got |
| --- | --- | --- |
| 1 phonology | `462 passed (462)` | `462 passed (462)` |
| 2 dictionary | `248 passed (248)` | `248 passed (248)` |
| 3 web-check | `found 0 errors and 12 warnings in 5 files` | `found 0 errors and 12 warnings in 5 files` |
| 4 web-test | `6743 passed \| 1 skipped (6744)` with numpy and scipy, `6739 passed \| 5 skipped (6744)` without | `6739 passed \| 5 skipped (6744)`: **this is the WITHOUT figure; numpy and scipy are not installed here** |
| 5 score-parser | `904 passed \| 5 skipped (909)` | `904 passed \| 5 skipped (909)` |
| 6 blurb | `178 passed (178)` | `178 passed (178)` |
| 7 integration | `159 passed (159)` | `159 passed (159)` |
| 8 ratchets | `ratchets: OK.` | `ratchets: OK.` |

Gate 4's own arithmetic across the lane: tests added 1 (item 1's replacement test for "the same words as the ratified line") and removed 1 (that same test). Net 0, so 6744 before and after. Items 2, 3, and 4 add no unit test; the Playwright tests are outside gate 4. The commands were the package commands, since the maintainer's `ilya-ship.sh` is not in this container.

## Playwright, which is not a gate: what I ran, and what I did not

On the final tree: `e2e/voice-pane.test.ts`, `e2e/insights-no-score.test.ts`, and `e2e/borrowing-with-score.test.ts` together, chromium project: **34 passed (3.9m)**. `insights-no-score.test.ts` is unedited and passes, so the cut did not reach the pages. `e2e-phone/wizard-begin.test.ts` (item 3): 6 passed. `e2e-phone/voice-stations` and `e2e-phone/welcome-sheet`: 9 passed. I did NOT run the whole of `e2e` or `e2e-phone`, and not `e2e/time-signature-card.test.ts`. The two known sub-pixel phone failures (`insights-links.test.ts:32`, `voice-stations.test.ts:62`): the second ran and passed here; the first I did not run.

## Section 6 and section 8, for the whole lane

No computation changed anywhere in the lane. Section 8, in one place:

- Anything the done-when of item 3 needs a string change for: nothing. No string was touched.
- Any phase of the wizard my change harms: none found. See item 3's report for the phases rendered and read.
- Whether a screen reader announces the picker's note: NOT ESTABLISHED. Nobody ran one, and I did not.
- Any assertion pinning the pane's borrowing sentence outside the five files named: none. `insights/ratified-lines.test.ts:451` pins the string `placeholder.borrowing` itself, which this lane does not change.
- The one thing for Dann's taste: item 3 puts the picker after Begin on a short touch screen (item 3's report, first section).
- The brief's figures for Begin's overflow (97 EN and 160 FR past the fold at 667) differ from my first measurements (41 and 104 at 390 by 667). I do not know why. NOT ESTABLISHED.

## State of the branch

Four commits on `cloud-lane-75`, cut from `Shane` at `3bff3358`. Nothing was written to `Shane`, `main`, or `docs/memory/`. No pull request was opened. I am pushing this branch only.
