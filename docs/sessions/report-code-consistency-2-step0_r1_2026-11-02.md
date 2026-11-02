# Report: consistency batch 2, step 0, baselines (Code, cloud lane, r1, 2026-11-02)

Read at: branch `cloud-lane-27`, cut from `origin/Shane` at `9fa204305a405828e91d766d789c0a00e5c34417`, working tree clean before this report. Brief: `brief-code-consistency-2-legend_r2_2026-11-02.md`; review: `review-fable-brief-consistency-2_r1_2026-11-02.md`.

## Lane

- `cloud-lane-27` is free on `origin` (`git ls-remote --heads origin cloud-lane-27` returned nothing; the highest existing name is `cloud-lane-26`). The branch is `cloud-lane-27`.
- The cut is `9fa20430`, which is after `ce5dc96f`.
- The upstream the checkout set (`origin/Shane`) was unset, so a bare `git push` cannot reach `Shane`. Every push names `cloud-lane-27` explicitly.
- The clone arrived shallow. `git fetch --unshallow origin` ran in this step, so `git log --all` is now complete (step 2 item 3 needs it).
- Install: `pnpm install --frozen-lockfile --ignore-scripts`, Node v22.23.4, pnpm 10.28.0.

## The eight gates on the cut

| # | gate | line | baseline |
|---|---|---|---|
| 1 | phonology | `Tests  407 passed (407)` | 407, holds |
| 2 | dictionary | `Tests  248 passed (248)` | 248, holds |
| 3 | web-check | `svelte-check found 0 errors and 12 warnings in 5 files` | holds |
| 4 | web-test | `Tests  3803 passed \| 1 skipped (3804)` | holds |
| 5 | score-parser | `Tests  785 passed \| 5 skipped (790)` | holds |
| 6 | blurb | `Tests  148 passed (148)` | holds |
| 7 | integration | `Tests  98 passed (98)` (after `pnpm -C apps/web exec svelte-kit sync`) | holds |
| 8 | ratchets | `ratchets: OK.` (it also lists ceilings that can be lowered; not a breach) | holds |

No difference from the baselines.

## Not established

Nothing in this step.
