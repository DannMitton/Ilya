# Report: N.192 and N.187, step 8 (merge of lane 49, `+page.svelte` back under its ceiling), r1, 2026-11-12

Lane `cloud-lane-50`.

## 1. The merge

`origin/Shane` at `e41e5c8a` (the rhyme matcher, lane 49) merged into the lane. One conflict, as expected: the key-count line at the head of `apps/web/src/lib/i18n.ts` (ours 1,240, theirs 1,223). Resolved to **1,241**, the desk's measured total; `i18n-index.test.ts` passes (5 of 5), so the per-prefix counts merged correctly without a hand edit. The other auto-merged files needed no hand work.

## 2. `+page.svelte`

After the merge it was 5540 lines against 5534. I moved one block of 28 lines, the held measure's three reads (`heldMeasureIds`, `nextMeasureIds`, `heldMeasurePositions`, the last of them carrying my lane's `stopLine` change), into new `apps/web/src/lib/score/held-measure.ts` as `heldMeasureReads(line, index)`, unchanged in logic. The page now has one derived, `held`, and its three uses read `held.ids`, `held.nextIds`, `held.positions`; the `positionsInMeasure` import it no longer needs is gone. **`+page.svelte` is 5513 lines (ceiling 5534, so 21 lines of room for lane 48).** No ceiling in `scripts/ratchets.json` was touched.

One fault of mine, caught by svelte-check before the push: I first named the function `heldMeasure`, which collides with an existing identifier in the page (three errors). Renamed `heldMeasureReads`; svelte-check is clean.

Behaviour check: 17 Playwright tests pass on desktop against the merged tree (`grace-corrections`, `key-signature-card`, `key-change-melody`, `time-signature-card`: they hold bars in the Loupe, walk the carets, and use the corrected line). I added `held-measure.test.ts` (3 tests: nothing held, a measure with a rest and a gap, no next ids after the last entry).

## 3. The eight gates, on the merged tree

| Gate | Result |
|---|---|
| phonology | 462 passed (462) |
| dictionary | 248 passed (248) |
| svelte-check | 0 errors, 12 warnings |
| web | 5295 passed, 1 skipped, **1 failed** (5297); see below. The desk's 5293 plus my 3 new tests is 5296, so on that count one is missing, which is the failed test |
| score-parser | 838 passed, 5 skipped (843), as expected |
| blurb | 178 passed (178) |
| integration | 155 passed (155) |
| ratchets | OK |

The web run before my last commit (without the new test and with the name collision, which vitest does not load) read 5293 passed, 1 skipped, as the desk expected.

**The one failure** is `src/lib/text/syntactic-break-unit.test.ts`, "property: breakTarget agrees with unitEnd and stays inside the unit, on random songs" (a randomised property test; 5.7 s in the failing run). That file and its subject are not touched by this lane. I re-ran the file three times alone: 19 of 19 passed each time. I did not capture the failing run's seed or counterexample, so whether it is a random counterexample or a timeout under load is NOT ESTABLISHED. It would be worth the desk's eye if it recurs.

## What I could not establish

- The cause of that one property-test failure (above).
- The full Playwright suite was not re-run after the merge; only the 17 named above.
