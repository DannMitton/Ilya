# Report: N.135 scan vowel rules, step 0 (cloud lane, branch cloud-lane-28, 2026-11-02)

## What was read

- Branch `cloud-lane-28`, cut from `origin/Shane` at `f9797ac` (the brief's floor, `f9797acb`). Pushed with `-u`.
- The gates ran in a **clean git worktree at `f9797ac`** (`pnpm install --frozen-lockfile`, working tree clean), not in the lane's own tree, so no Step 1 edit could touch them. Node v22.23.4, pnpm 10.28.0.
- The review (`review-fable-brief-scan-vowelless_r1_2026-11-02.md`) is **not on `origin/Shane`** (`git show` returned "does not exist"). The work follows brief r3's text.
- The brief is saved at `/tmp/briefs/brief-code-n135-scan-vowelless-and-far-tokens_r3_2026-11-02.md` and is not committed.

## The eight gates, at the cut

The ship script is not in the cloud tree, so the order below is the one `QUEUE.md` (2026-10-27 02:5x) lists: phonology, dictionary, type check, web, score-parser, blurb, root integration, ratchets. The build is a ninth line, the one `ci.yml` runs.

| Gate | Result |
| --- | --- |
| 1 phonology | 407 passed (407), 13 files |
| 2 dictionary | 248 passed (248), 4 files |
| 3 type check (`svelte-check`) | 0 errors, 12 warnings, 969 files |
| 4 web | 3843 passed, 1 skipped (3844), 219 files |
| 5 score-parser | 785 passed, 5 skipped (790), 35 files |
| 6 blurb | 148 passed (148), 2 files |
| 7 root integration | 98 passed (98), 6 files |
| 8 ratchets | OK (six ceilings could be lowered; none raised) |
| build (`pnpm --filter @ilya/web build`) | exit 0 |

All eight pass. Gate 4 reads 3843 and 1 skipped here; `ENVIRONMENT.md` warns that a clean clone differs from the Mac on this gate (tests that read local files), so the desk should not compare this number to the ship script's string.

## What I could not establish

- The ship script's own gate order and numbering (`~/Downloads/ilya-ship.sh` is not in the cloud). The mapping above is from `QUEUE.md`, not from the script.
- The Playwright suite was not run (CI's second job). It is not one of the eight.
