# AUDIT BRIEF. Every ruled string against the tree

**Written by the desk 2026-09-24 15:55.** Read-only. You edit nothing except your own memo, and you run no git command that writes (`status`, `log`, `diff`, `show`, `ls-files` only, always `git --no-optional-locks --no-pager`). Canadian spelling, no em dashes.

**NOT ESTABLISHED beats a complete invented answer.** Every claim carries a `path:line` you read in this run.

## Why

On 2026-09-24 the desk found that Dann's French rulings of 2026-09-22 on Insights had never reached `apps/web/src/lib/i18n.ts`. Code is seating those now (`docs/sessions/brief-code-n130-strings_r1_2026-09-24.md`; **exclude every key listed in that brief's table from your findings**). Dann's words: *"This is not the first time we have encountered older work that was not properly seated in the tree."* Find the rest.

## Access

`mcp__remote-devices__device_bash`. Repository: `$HOME/mnt/ilya-rewrite`. The strings live in `apps/web/src/lib/i18n.ts` (one line per key, `{ en: ..., fr: ... }`).

## Sources of rulings, in this order

1. `docs/sessions/spec-n131-french_r1_2026-09-16.md`
2. `docs/sessions/insights-french_r1_2026-09-19.md`
3. `docs/sessions/insights-french-as-built_r2_2026-09-22.md` (older sibling of r3; note where r3 supersedes it)
4. `docs/sessions/e42-n34-n35-french-draft_2026-08-12.md` and `docs/sessions/e38-n22-french-strings-drafted_2026-08-10.md` if present
5. Any other `docs/sessions/*french*` file, and any string quoted as RULED or RATIFIED in `docs/memory/OPEN.md` and `docs/memory/PRODUCT.md` (grep for `RULED`, `RATIFIED`, `ratified`, and guillemets « »).

**A ruling counts only when the file says Dann ruled, ratified, or accepted it.** A desk draft he never ruled is not a finding; list it separately as "drafted, never ruled". **Check for a later ruling that amended it** (a later file, or a later dated line in the same file) and use the latest.

## For each ruled string

Find the key in `i18n.ts`. Compare the ruled text with the tree's text, ignoring only escape spelling (`’` vs `’`, ` ` vs a literal non-breaking space). Classify: **SEATED** (matches), **MISSING** (tree differs from the ruling), **KEY GONE** (key no longer exists; search for where the string moved), or **SUPERSEDED** (a later ruling replaced it; name it).

## Return

A memo saved as `docs/sessions/memo-audit-rulings-vs-tree_r1_2026-09-24.md`: first a table of every **MISSING** and **KEY GONE** row (key, `i18n.ts:line`, tree text, ruled text, ruling source `path:line` and date), then counts per class per source file, then "drafted, never ruled" as a short list, then a section headed **"NOT ESTABLISHED"**. Your final message to the desk is the MISSING table and the counts only.
