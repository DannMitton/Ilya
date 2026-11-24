# Brief: N.204 step 1, the instruments (Sonnet)

Written by the desk (Opus 5), 2026-11-23 22:5x. Read-only analysis. You install tools in your own container and write one report.

## What this serves

Step 1 of `plan-code-audit-maintainability_r9_2026-11-23.md`: "Fix the units, build the instruments, and admit what they cannot do." Nine Fable unit reads and the whole mapping of step 5 rest on what you establish here. **Two pieces of step 1 are NOT yours and are not in this brief:** the behaviour baseline and the performance baseline, both of which need a real install and a build.

## Inputs, staged for you

Under `/mnt/user-data/uploads/`:

- `_desk-2026-11-23/n204-step1-source.tgz` — the source of `apps`, `packages`, `scripts`, with `package.json` and `pnpm-workspace.yaml`. **This is the tree at base commit `b2869772`**: the desk confirmed by `git diff --stat b2869772..HEAD -- apps packages scripts` that nothing under those three paths has changed since. Unpack it into a directory of its own.
- `_desk-2026-11-23/n204-step1-gitlog.txt` — `git log --since=2026-08-01 --name-only` over those same three paths, 6,919 lines. Each commit begins `COMMIT|<sha>|<iso date>|<subject>` and its changed files follow.
- `ilya-rewrite/docs/sessions/plan-code-audit-maintainability_r9_2026-11-23.md` — read section 5 step 1, section 5a, and section 6's unit table.
- The three filed unit reads you test the graph against: `read-fable-n204-unit-d_r1_2026-11-22.md`, `..._unit-g_...`, `..._unit-h_...`.

**There is no `node_modules` and you cannot install the project.** `pnpm install` will fail and you are not to attempt a build. Everything below is static analysis or text.

## The five deliverables

**1. The frozen area map of `b2869772`.** Every source file to exactly one top-level area, where the areas are the sixteen reading units of the plan's section 6 (a to o, plus t for the tests). Deliver it as JSON, file path to area, **and as the script that produced it**, so a later desk re-runs it rather than trusting a table. Any file your rule cannot place is listed separately with the reason; do not force a placement.

**2. The graph trial, and its test of trust.** Try `madge` and `dependency-cruiser` on the TypeScript and Svelte source. Report for each: whether it runs at all, whether it resolves `.svelte` imports and the project's path aliases, and what share of files it reaches. **Then the test of trust, which is the point of this deliverable:** take the files of units d, g, and h, and compare the tool's edges against the imports and the hidden relationships those three filed reads record. Report agreement, edges the tool invented, and edges it missed. **File the known blind spots beside the result:** the 142 test files that read source as text, and every entry on the keep-list of deliverable 3.

**3. The keep-list:** paths that no import shows and that a dead-code tool would therefore call unused. The plan's section 5a names the kinds: URL switches, `__ILYA_RECORDER__`, workers and assets reached by URL, glob reads, dynamic imports, `static/sw.js`'s precache list, old-shape readers, and `routes/notation-font-lab/`. Find the actual paths and add any further kind you find.

**4. Does `knip` run here?** Report yes, no, or yes-with-caveats, with the command and its output. If it needs the install it cannot have, say so plainly; that is a useful answer and the plan already carries a fallback for it.

**5. The first commit-log measure, at the frozen grain.** From the git log file and your area map: over commits since 2026-08-01, how many AREAS does an average commit touch, with the distribution and not only the mean. **The unit is the frozen area, never the file.** If the history will not support the measure, say why, and that is the answer.

## What to report, and how

Write one file to `/mnt/user-data/outputs/`. Run `ls` on that folder before naming it. Suggested name `report-sonnet-n204-step1-instruments_r1_2026-11-23.md`. The JSON map and the script go in the same folder as their own files.

Open with a table: the five deliverables, each ESTABLISHED, PARTIAL, or NOT ESTABLISHED. Then one section each. Then a section headed "What I could not establish".

**NOT ESTABLISHED beats a complete invented answer.** A tool that half works is reported as half working, with the share it reached. Do not estimate a number you did not compute, and do not report a figure without saying what produced it.

House style: Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, no exclamation marks.

## Constraints

- No build. No `pnpm install` of the project. Installing analysis tools into your own container is fine.
- Create no `.bak` file.
- Cap: 300,000 tokens. If you approach it, file what you have and name the deliverables you did not reach.
