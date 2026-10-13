# Brief for Code: the every-score test counts tracked files only (r1, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 01:46. QUEUE row 83. For the cloud lane, Sonnet. Fable reviews this brief before Code gets it (`docs/memory/CONTRACT.md`, the paragraph of 2026-10-11 22:36). **Small: one test file.**

## 1. What was observed

- Gate 4 counted 2402 tests in a clean clone and 2448 on Dann's Mac, all passing, on the same commit (2026-10-11 23:42; `docs/memory/ENVIRONMENT.md`, the line beginning "Gate 4 differs between a clean clone and Dann's Mac").
- The ship script's gate 4 line was moved 2402 to 2448 to match the Mac (`~/Downloads/ilya-ship.sh`, comment at its line 78).

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-12:

- `apps/web/src/lib/markup/markup-pages.test.ts:45-55`: `scores(dir)` walks the disk with `readdirSync` and keeps every name ending `.musicxml`, skipping only `node_modules` and dot-names. Its comment says "Every tracked `.musicxml`", which the walk does not check.
- `apps/web/src/lib/markup/markup-pages.test.ts:68`: the files are `scores(apps)`, `scores(docs)`, and `scores(tools)`.
- `apps/web/src/lib/markup/markup-pages.test.ts:70-72`: a guard that more than 50 files are found.
- `git ls-files` on the Mac lists 187 `.musicxml`; `find` lists 233 outside `node_modules` (run by the desk 2026-10-12 about 01:45). The difference includes git-ignored readings under `tools/e16-harness/output/` (lead: `ENVIRONMENT.md` names 46 there) and any untracked measure folder under `docs/sessions/`.

## 3. Measure before you change anything

1. Run gate 4 on the branch as it stands and record the count (the clean-clone count).
2. Report how many `.musicxml` files `git ls-files` lists under `apps/`, `docs/`, and `tools/`, and how many `scores()` finds, in this clone.

## 4. The rulings this serves

- None of Dann's. The owed line is the desk's (`ENVIRONMENT.md`, same line as section 1: "the test should list files with `git ls-files`, so the count is the same everywhere and nothing private is read").
- The held-out scans and truth files must never be read by any lane (`docs/sessions/brief-truth-heldout3_r1_2026-10-11.md`, "Never"). They live outside the repository today; listing tracked files only keeps that true if one is ever dropped into the tree by mistake.

## 5. Constraints

- Change only `apps/web/src/lib/markup/markup-pages.test.ts`. The test's assertions stay as they are.
- List the files with `git ls-files -z -- '*.musicxml'` run at the repository root (`execFileSync('git', [...], { cwd: ROOT })`), kept to paths under `apps/`, `docs/`, and `tools/`. Fix the comment at `:45` to say what the code does.
- If `git` is not available where the test runs, the test fails with a message that says so. It never falls back to walking the disk.
- No other file changes. No git command that writes, except the cloud lane's own commit and push to `cloud-lane`.
- **Displaces:** nothing.

## 6. Done when

- Gate 4 in the cloud clone passes, and its count is reported beside section 3's count. The two may differ only by tracked files `scores()` missed or counted twice; any difference is explained file by file.
- All eight gates pass at baseline otherwise.
- `WRITTEN` on the code. There is nothing for Dann to walk; DONE is the ship, after which the desk moves the ship script's gate 4 line to the clean count with a backup.

## 7. Report back

`docs/sessions/report-code-markup-pages-tracked-only_r1_2026-10-12.md`: the commit, section 3's counts, section 6's results, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer.
