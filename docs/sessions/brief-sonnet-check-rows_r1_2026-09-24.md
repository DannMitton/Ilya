# SONNET BRIEF. The nine CHECK rows: one look each

**Written by the desk 2026-09-24 10:37.** Read-only. You do not edit any file except your own memo, and you run no git command that writes (`status`, `log`, `diff`, `show`, `ls-files` are allowed, always as `git --no-optional-locks --no-pager`). Canadian spelling, no em dashes.

**NOT ESTABLISHED beats a complete invented answer.** Every claim about code carries a `path:line` you read in this run. A grep hit is not a reading: open the lines.

## Access

Use `mcp__remote-devices__device_bash`. The repository is at `$HOME/mnt/ilya-rewrite`. Memory: `docs/memory/`. The rows are defined in `docs/sessions/sort-release_r1_2026-09-16.md`, section "CHECK: 9 rows" (about line 67). Find each row's full original entry in `docs/memory/INBOX.md`, `docs/memory/OWED.md`, `docs/memory/OPEN.md`, or `docs/sessions/LOG.md` (search by its label and by its wording), and read it before judging.

## The rows and what "one look" means

For each, return **CLOSED** (with the evidence that it is fixed or false), **IN** (still true, with the evidence and a one-sentence description of the fix's scope), or **NOT ESTABLISHED** (and why).

1. **UNSETTLED-10**, `.mscz` in a browser. Code read only: does an `.mscz` path exist from upload to parsed score (`apps/web/src/lib/shane/engine/mscz-converter.ts`, `ingestion/ingest.ts`)? The live test is Dann's walk; say what the walk must check.
2. **OWED-9**, `sustain.ts` and `watchlist.ts` reading a stale field. See `INBOX.md` 2026-09-12 entry on N.128 (stale `rhythmicPosition` after a duration correction). Was N.128 fixed (search `LOG.md` and the tree)? Do `apps/web/src/lib/shane/sustain.ts` and `watchlist.ts` now read a position that follows corrections?
3. **INBOX-21**, a re-seated cell losing its punctuation. Check `carryPunctuation` and its callers.
4. **INBOX-22**, can the last note of a seated piece be stale?
5. **INBOX-23**, a blanked note printing a stray IPA « a ».
6. **INBOX-5**, colour print coming out greyscale. Code read only: find the print stylesheet rules (`@media print`, `print-color-adjust`, `-webkit-print-color-adjust`) and report what they do. The live test is a print by Dann; say exactly what he should print and look at.
7. **UNSETTLED-8**, the VERIFY box and the USER OVERRIDE badge in print. Same as 6: code read, then the one print Dann should make.
8. **N.121(a) and N.121(b)**, did they ship? `docs/memory/OPEN.md` about line 132 to 145 has the rulings; check the strings and components they name against the tree and `git log`.
9. **N.72 residue**, Chrome for iPhone cannot install to the home screen. Documents only: is it recorded as known and closed anywhere, or still open for Dann to rule?

## Return

A memo of at most 600 words, saved as `docs/sessions/memo-sonnet-check-rows_r1_2026-09-24.md`: a table (row, verdict, evidence as `path:line`, one-line fix scope if IN), then the two print instructions for Dann as plain sentences, then a section headed **"NOT ESTABLISHED"** listing everything you could not settle. Your final message to the desk is the memo's table only.
