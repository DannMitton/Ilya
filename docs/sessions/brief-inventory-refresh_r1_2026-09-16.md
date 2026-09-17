# Brief: refresh the release inventory

Revision 1 of this brief, 2026-09-16. Written at the desk. **Run in a fresh
Claude Code session set to Sonnet**, in `~/Desktop/ilya-rewrite`.

**This is a READ-ONLY task. You write exactly one new file, and nothing else.**
Another Claude Code session may be building in this same tree while you work.
Do not run tests, builds, or gates, and do not edit any existing file.

---

## Why this exists

Dann ruled on 2026-09-16 that this iteration of Ilya ships by **Friday
2026-10-30**, and that everything open is sorted into three buckets: IN,
FLAGGED, LATER. The desk proposes the buckets. **Your job is only the list the
desk sorts from**, brought up to date. **Do not propose buckets, rank, or
recommend anything.**

The list to refresh: `docs/sessions/inventory-release_r1_2026-09-13.md`, 114
items, written 2026-09-13. Since then some items closed and N.134 to N.143 were
numbered.

---

## Inputs. Read these in full

1. `docs/sessions/inventory-release_r1_2026-09-13.md`, the old list and its
   method.
2. `docs/memory/STATE.md`
3. `docs/memory/OPEN.md`
4. `docs/memory/SEQUENCE.md`
5. `docs/memory/INBOX.md`. **Dann has asked for this task, so reading it is
   allowed this time.**

**Search, do not read in full:** `docs/sessions/LOG.md` (over 5,000 lines).
Grep it only to check whether an item closed.

**The tree:** for each item whose build state is not stated in the memory files,
you may grep the code to establish it. Cite `path:line`. **Where the memory files
and the tree disagree, the tree wins, and say so on that row.**

---

## What to produce

One new file: `docs/sessions/inventory-release_r2_2026-09-16.md`.

1. **A header** naming every input and how you read it (in full, or grepped).
2. **A count**, by build state and by document, in the same shape as r1.
3. **The table**, the same columns as r1:
   `id | name | source | build state | evidence | touches | blocked by | closed already?`
   - `touches` is one of: `Text`, `Markup`, `Insights`, `more than one`,
     `none of the three`, `NOT ESTABLISHED`. The three documents are Ilya's
     three tabs: Text (the transcription), Markup (the score), Insights.
   - Build states: `SHIPPED-PARTIAL`, `BUILT-NOT-SHIPPED`, `BRIEFED`,
     `SPEC-ONLY`, `NOT STARTED`, `NOT ESTABLISHED`. Add `IN CODE` for anything a
     brief dated 2026-09-16 hands to Code: N.142, the loupe French build, N.129.
   - `evidence` is a short verbatim quotation from the source, in quotation
     marks.
4. **A changes section:** every item CLOSED since r1, with the commit or the
   `LOG.md` block that closed it; every item NEW since r1; every r1 row whose
   state changed.
5. **The contradictions r1 could not settle** (its "WHAT I COULD NOT ESTABLISH"
   section): for each, settle it from the tree if you can, with `path:line`, or
   carry it forward.
6. **A section headed "WHAT I COULD NOT ESTABLISH".** State this sentence in it
   verbatim: NOT ESTABLISHED beats a complete invented answer.

**Rows for loose INBOX findings** keep r1's convention (`INBOX-n`), with the
INBOX date in `source`. Include the three INBOX lines of 2026-09-16 (the upload
pause question, "1 lines", the loupe tap).

---

## Rules

- **Do not infer a closure.** r1 excluded some items on an inferred closure and
  said so once. Do not do that: if you cannot find the closing commit or `LOG.md`
  line, keep the row and mark `closed already?` as `NOT ESTABLISHED`.
- **Do not merge rows** you think are duplicates. List suspected duplicates in
  their own section, as r1 did.
- **Do not paraphrase a ruling** into a row's name. Use the source's own words.
- Canadian spelling, no em dashes.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.**
Read-only git (`log`, `show`, `diff`, `status`) is allowed.

---

## What to return in chat

Five lines, no more: the file path, the total count, the number closed since
r1, the number new since r1, and the number of rows marked `NOT ESTABLISHED`.
