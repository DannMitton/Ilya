# Report: poem library build 1, step 7, part 0, the merge (Code cloud lane, r1, 2026-11-04)

Brief: `brief-code-poem-library-build1-step7_r4_2026-11-03.md` (read in full, with `review-fable-poem-build1-step7_r1_` and `_r2_` and `desk-probe-and-sum.diff`). Branch `cloud-lane-31`.

## The merge

- `git fetch origin Shane`: `origin/Shane` is `5a093a4d` (`git rev-parse`). It contains `ee3a1d72` (row 177).
- Before merging: `git merge-tree --write-tree cloud-lane-31 origin/Shane` printed a tree id (`ba6e0364...`) and no conflict lines.
- `git merge origin/Shane`: merge commit `39c42c9`, **no conflicts**.
- Fable's expectation (r2 amendment 10) held: `git diff --stat cloud-lane-31...origin/Shane` over `apps/web/src/lib/text`, `apps/web/src/lib/components/Paper`, `apps/web/src/lib/i18n.ts`, `apps/web/src/routes`, and `apps/web/e2e/pages-without-gaps.test.ts` printed nothing: Shane's advance touches none of them.

## The gates after the merge

| Gate | Step 6 | After the merge |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| blurb | 148 | 148 |
| score-parser | 785 + 5 skipped | 785 + 5 skipped |
| web unit | 4065 + 1 skipped | **4094** + 1 skipped (+29, from row 177's tests) |
| integration (root) | 112 | 112 |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings (989 files) |
| ratchets | OK | OK |
| build | succeeded | succeeded |

The browser suite is not rerun in this part; Part 5 runs it against the baseline.
