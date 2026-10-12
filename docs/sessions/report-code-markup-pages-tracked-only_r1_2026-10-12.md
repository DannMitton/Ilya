# Report: every-score test lists tracked .musicxml only (QUEUE row 83)

## State

- Branch `cloud-lane-2`, made from `origin/Shane` at 9f9e8966. Working tree was clean before the edit.
- Changed one file: `apps/web/src/lib/markup/markup-pages.test.ts`. No assertion changed.
- Commit: the one carrying this report (`git log -1 cloud-lane-2`). Its hash cannot be written inside itself.
- Environment: Linux cloud sandbox, fresh `pnpm install --frozen-lockfile`.

## Step 1: before the change

- Gate 4 (`pnpm --filter @ilya/web test`): **2402 passed** (137 files).
- `git ls-files` `.musicxml` under `apps/`, `docs/`, `tools/`: **187**.
- Files the old `scores()` found on disk: **187**.
- The two lists were identical (sorted and diffed).

## The change

- `scores()` and the `readdirSync` and `statSync` imports are gone.
- `trackedScores()` runs `git ls-files -z -- '*.musicxml'` with `cwd: ROOT`, splits on NUL, drops empty strings, keeps `apps/`, `docs/`, `tools/`, and joins each to `ROOT`.
- It is called inside the describe where `scores()` was, so `it.each` has the list at collection time.
- A git failure rethrows `markup-pages: git ls-files failed (is this a git checkout with git installed?): <message>`. There is no disk-walk fallback.
- The old comment said "tracked" while the code walked the disk. The new comment says what the code does.

## Step 3: after the change

- Gate 4: **2402 passed** (137 files). Same as step 1.
- Tracked `.musicxml` under a dot-directory: **0**. Tracked under a `node_modules` path: **0**.
- So in this clone the tracked list and the old disk walk are the same 187 files, and the count does not move.

## The eight gates

All pass.

1. `pnpm test:phonology`: 251 passed
2. `pnpm test:dictionary`: 242 passed
3. `pnpm --filter @ilya/web check`: 0 errors, 12 warnings in 5 files
4. `pnpm --filter @ilya/web test`: 2402 passed (before and after)
5. `pnpm --filter @ilya/score-parser test`: 663 passed, 5 skipped (668)
6. `pnpm test:blurb`: 145 passed
7. `pnpm test:integration`: 55 passed
8. `pnpm ratchets`: OK

## Could not establish

- **Dann's Mac count of 2448.** I have no access to that machine. This clone has no git-ignored `.musicxml`, so I did not reproduce the 46-file gap. That the new code reads 2402 there is expected from the design, not observed.
- **The git failure path.** I did not run the test with git absent or outside a checkout, so the rethrown message is untested.
- **A git-ignored `.musicxml` being excluded.** I did not plant one to watch it drop out. `git ls-files` lists tracked files only, which is the basis for the claim.
- **CI on this branch.** Nothing was pushed before this report, so no CI run exists yet.
