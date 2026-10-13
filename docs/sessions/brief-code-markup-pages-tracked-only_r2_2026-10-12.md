# Brief for Code: the every-score test counts tracked files only (r2, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 01:46. **r2, about 01:49: applies Fable's amendments 1 to 5** (`docs/sessions/review-fable-briefs-83-84_r1_2026-10-12.md`, SEND WITH AMENDMENTS); r1 superseded. QUEUE row 83. For the cloud lane, Sonnet. Fable reviews this brief before Code gets it (`docs/memory/CONTRACT.md`, the paragraph of 2026-10-11 22:36). **Small: one test file.**

## 1. What was observed

- Gate 4 counted 2402 tests in a clean clone and 2448 on Dann's Mac, all passing, on the same commit (2026-10-11 23:42; `docs/memory/ENVIRONMENT.md`, the line beginning "Gate 4 differs between a clean clone and Dann's Mac").
- The ship script's gate 4 line was moved 2402 to 2448 to match the Mac (`~/Downloads/ilya-ship.sh`, comment at its line 78).

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-12:

- `apps/web/src/lib/markup/markup-pages.test.ts:45-55`: `scores(dir)` walks the disk with `readdirSync` and keeps every name ending `.musicxml`, skipping only `node_modules` and dot-names. Its comment says "Every tracked `.musicxml`", which the walk does not check.
- `apps/web/src/lib/markup/markup-pages.test.ts:66`: the files are `scores(apps)`, `scores(docs)`, and `scores(tools)`.
- `apps/web/src/lib/markup/markup-pages.test.ts:68-70`: a guard that more than 50 files are found (`:69`).
- `git ls-files` on the Mac lists 187 `.musicxml`; `find` lists 233 outside `node_modules` (run by the desk 2026-10-12 about 01:45). The difference includes git-ignored readings under `tools/e16-harness/output/` (lead: `ENVIRONMENT.md` names 46 there) and any untracked measure folder under `docs/sessions/`.

## 3. Measure before you change anything

1. Run gate 4 on the branch as it stands and record the count (the clean-clone count).
2. Report how many `.musicxml` files `git ls-files` lists under `apps/`, `docs/`, and `tools/`, and how many `scores()` finds, in this clone.

## 4. The rulings this serves

- None of Dann's. The owed line is the desk's (`ENVIRONMENT.md`, same line as section 1: "the test should list files with `git ls-files`, so the count is the same everywhere and nothing private is read").
- The held-out scans and truth files must never be read by any lane (`docs/sessions/brief-truth-heldout3_r1_2026-10-11.md`, "Never"). They live outside the repository today; listing tracked files only keeps that true if one is ever dropped into the tree by mistake.

## 5. Constraints

- Change only `apps/web/src/lib/markup/markup-pages.test.ts`. The test's assertions stay as they are.
- Import `execFileSync` from `node:child_process`. List the files with `execFileSync('git', ['ls-files', '-z', '--', '*.musicxml'], { cwd: ROOT, encoding: 'utf8' })`, split the result on `'\0'`, drop empty strings, keep the paths that start with `apps/`, `docs/`, or `tools/`, and map each to `join(ROOT, p)`. The listing runs where `scores()` runs today, inside the `describe` at `:65`, so `it.each` at `:72` has the list at collection time. Remove `scores()`, and remove the `readdirSync` and `statSync` imports at `:17` if nothing else uses them. Fix the comment at `:45` to say what the code does.
- Wrap the call in `try`/`catch` and rethrow as `new Error('markup-pages: git ls-files failed (is this a git checkout with git installed?): ' + message)`. The test file then fails at collection, which is the intended behaviour. It never falls back to walking the disk.
- No other file changes. No git command that writes, except the cloud lane's own commit and push to `cloud-lane`.
- **Displaces:** nothing.

## 6. Done when

- Gate 4 in the cloud clone passes, and its count is reported beside section 3's count. The two may differ only by tracked files `scores()` missed or counted twice; any difference is explained file by file. In a clean clone the two lists can differ only by a tracked `.musicxml` under a dot-directory or under a tracked `node_modules` path, both of which `scores()` skips at `:48`; report zero such files if there are none.
- All eight gates pass at baseline otherwise.
- `WRITTEN` on the code. There is nothing for Dann to walk; DONE is the ship. The desk moves the ship script's gate 4 line only after row 84 has also shipped, since row 84 removes 5 tests (`notation-overlay.test.ts:17, :21, :29, :38, :43`).

## 7. Report back

`docs/sessions/report-code-markup-pages-tracked-only_r1_2026-10-12.md`: the commit, section 3's counts, section 6's results, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer.
