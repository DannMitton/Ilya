# AUDIT BRIEF. What the code really contains, tied to the plan

**Written by the desk 2026-09-24 21:25**, on Dann's request of 21:11: *"poll the code and catalogue what it really contains, associating each of those modules to an outstanding task if it relates, or assigning a new cardinal if a chunk of code isn't described in our plan already."* Why: the desk keeps rediscovering built work (on 2026-09-16 it called N.123 "the largest unstarted piece" when the layer was built and in use).

Read-only. You edit nothing except your own memo. Git: only `status`, `log`, `diff`, `show`, `ls-files`, always as `git --no-optional-locks --no-pager`. Canadian spelling, no em dashes.

**NOT ESTABLISHED beats a complete invented answer.** Every claim about what a file does carries a `path:line` you read in this run.

## Access

`mcp__remote-devices__device_bash` (load with ToolSearch `select:mcp__remote-devices__device_bash` if deferred). Repository: `$HOME/mnt/ilya-rewrite`. Source files: `git --no-optional-locks ls-files` filtered to `.ts`, `.svelte`, `.js`, excluding tests and `.d.ts`.

## Two halves, one agent each

- **HALF A:** everything under `apps/web/src/lib/` (about 140 files).
- **HALF B:** everything else: `packages/`, `apps/web/src/routes/`, `tools/`, `scripts/`.

Do only your half.

## The plan to map against

1. Open items: `grep -n "^## N\." docs/memory/OPEN.md` and each item's first paragraph; `docs/memory/STATE.md` §THE TRACKER (the `[ ]`, `[D]`, `[~]` marks); `docs/memory/SEQUENCE.md`.
2. Closed items: `grep -n "N\.[0-9]\+" docs/sessions/LOG.md` for the number, then read the lines around it. A module that serves a CLOSED item counts as described.
3. Product rulings: `docs/memory/PRODUCT.md` headings.

## Method, per module (a file, or a folder of tightly related files)

Read the header comment, the exports, and enough of the body to say what it does. Do not read every line of a large file; grep its call sites (`grep -rn "from '.*<name>'"`) to see what uses it. Then classify:

- **SERVES OPEN:** it implements part of an open item. Name the item and say which part is built and which is not, with `path:line`.
- **SERVES CLOSED:** it implements a closed item. Name it.
- **UNDESCRIBED:** nothing in the plan describes it. Propose a one-line title for a new number. **Do not number it**; numbering is Dann's.
- **DEAD OR ORPHANED:** nothing imports it (show the empty grep). This feeds N.86, the dead-code audit.

Flag especially: **anything an open item describes as unbuilt that is in fact built, in whole or in part.** That is the finding Dann most needs.

## Return

Save a memo as `docs/sessions/memo-audit-code-catalogue-<a|b>_r1_2026-09-24.md` (a or b for your half):
1. **Built but described as unbuilt:** a table (item, what the plan says, what the tree has, `path:line`).
2. **Undescribed:** a table (module, what it does, proposed title).
3. **Dead or orphaned:** a list with the empty grep.
4. **The full catalogue:** one row per module (path, one-line purpose, class, item).
5. **NOT ESTABLISHED.**

Your final message is sections 1 and 2 only, plus the memo's path and byte count.
