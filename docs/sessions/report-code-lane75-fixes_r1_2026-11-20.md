# Report, lane 75: the as-built review's fixes 1 to 5

r1, 2026-11-20, by the cloud lane. Branch `cloud-lane-75`, on `203a7407`. Review read in full from `origin/Shane` (`review-fable-lane75-as-built_r1_2026-11-20.md`, at `3110d49a`). The five fixes are applied as the review writes them, in one commit, and only in the three files they name. Nothing was pushed to `Shane` or `main`, and no pull request was opened.

## What changed

- **Fix 1**, `voice/VoiceTypeFirst.svelte`: `noteEl` and a `$effect` that calls `scrollIntoView({ block: 'nearest' })` when the note arrives, and `bind:this={noteEl}` on the `.vt-note` div. The three lines and the comment are the review's, verbatim.
- **Fix 2**, `e2e-phone/wizard-begin.test.ts`: the scroll reset and the `scrollTop` assertion are gone; the three new assertions (note inside the scroll box, nine choices whole) are added; "at rest" is now "at the moment of choice" in the test's title and header.
- **Fix 3**, `voice/VoiceTypeFirst.svelte`: the media condition is `(pointer: coarse) and (max-height: 741px), (pointer: coarse) and (max-height: 880px) and (max-width: 599px)`. I added the review's sentence about 685.6, 742, and 868 **beside** "880 is measured", as the review allows, and did not remove it.
- **Fix 4**: "41 to 172 px below the fold" is now "97 to 228 px past the fold" in the stylesheet comment and in the test header (line 4).
- **Fix 5**, `stand-in-borrowing.test.ts`: the `|| key === 'VOICE pane (4.6)'` special case is removed.

Files in the commit: `VoiceTypeFirst.svelte`, `wizard-begin.test.ts`, `stand-in-borrowing.test.ts`, and this report. No other file.

## The positive control for fix 2 (run in this order)

1. Fix 2 applied alone, on the branch as it stood (`203a7407` plus the test edit only): `e2e-phone/wizard-begin.test.ts` **0 passed, 6 failed**. Every failure is Begin or the note past the readable screen: received 708.1 (390 by 667 EN), 676.3, 676.6, 694.5, 649.6, and 668.0, against limits of 611.5 and 584.5.
2. Fixes 1, 3, 4, and 5 then applied: **6 passed, 0 failed** (34.6s).

## Gates and tests, measured on the tree with all five fixes

| check | baseline | measured |
| --- | --- | --- |
| gate 3 web-check | `found 0 errors and 12 warnings in 5 files` | `svelte-check found 0 errors and 12 warnings in 5 files` |
| gate 4 web-test | `6743 passed \| 1 skipped (6744)` with numpy and scipy; `6739 passed \| 5 skipped (6744)` without | `Test Files 363 passed (363)`, `Tests 6739 passed \| 5 skipped (6744)`. **This is the WITHOUT figure: scipy is not installed in this container** (`ModuleNotFoundError`). |
| gate 8 ratchets | `ratchets: OK.` | `ratchets: OK.` |
| `e2e-phone/wizard-begin.test.ts` | six of six | **6 passed** |

`VoiceTypeFirst.svelte` is 112 lines, as the review predicted. `CalibrationWizard.svelte` is not touched. Gate 4's count is unchanged: no unit test was added or removed (fix 5 changes one condition inside an existing test), and that file's tests passed within the 6739.

## Not run, and not established

- Gates 1, 2, 5, 6, and 7 were not asked of me and I did not run them. No package changed.
- I did not re-run the other Playwright files (`voice-pane`, `insights-no-score`, `borrowing-with-score`, `voice-stations`, `welcome-sheet`) on the fixed tree. Fix 1 adds a scroll that fires only when the picker's note arrives, so a desk test that chooses a contralto is the one place it could matter; I did not check it.
- I did not render the review's tablet and touch-laptop cases (1024 by 768, 1180 by 820, 1440 by 800) to confirm that fix 3 leaves them alone. I applied the condition as written; its effect there is the review's measurement, not mine.
- Nothing here establishes the review's "For Dann's eye" items, Safari behaviour, or a screen reader.
