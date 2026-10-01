# Overnight agents: the common rules. Desk, 2026-10-01 01:50

Read this first. Then read your own section of `inbox-curated_r1_2026-10-01.md` and your item lines in `docs/memory/INBOX.md` (grep for them; do not read the whole file).

## Where things are
- The repository is on Dann's Mac, reached with the device shell (`mcp__remote-devices__device_bash`; load it with ToolSearch `select:mcp__remote-devices__device_bash`) at `$HOME/mnt/ilya-rewrite`. HEAD `740dfe7` plus uncommitted desk edits to `docs/`.
- `ARCHITECTURE.md` is the code map. `docs/memory/PRODUCT.md` holds the product rulings. `docs/sessions/memo-n84-path-map_r1_2026-10-01.md` maps every control a singer sees, with `path:line`.

## Rules
1. READ ONLY. The only files you write are your own memo and, where something needs building, a brief, both in `docs/sessions/`. Write with a short python script through the device shell.
2. No git command that writes. Read-only git only, always as `git --no-optional-locks`: `status`, `log`, `diff`, `show`, `ls-files`.
3. Every claim about code carries a `path:line` you read in this run. Memory files and old memos are leads, not evidence.
4. **NOT ESTABLISHED beats a complete invented answer.**
5. Describe things by what a singer sees, then cite the code.
6. House style: second person where you address a reader, active voice, present tense, Canadian spelling, sentence-case headings, ISO dates, no em dashes, no hype, no "simply" or "just".
7. French: never write French as final. Any new user-facing string carries an English text and a French PROPOSAL, marked PROPOSED, drafted from the French already in `apps/web/src/lib/i18n.ts`, following the OQLF spacing table (no space before « ; » « ? » « ! »; a non-breaking space before « : » and inside « »). Say which words you coined and which you adopted.

## A brief for Code, when one is warranted
Model it on `brief-code-camera-by-modality_r1_2026-09-30.md`: title "Brief to Code: <what changes for the singer>"; "From the desk, 2026-10-01. No git writes. Gates before and after."; the ruling or reason with its source; the fault with `path:line`; the work; the tests; the report path `docs/sessions/report-code-<slug>_r1_2026-10-01.md`. Name it `brief-code-<slug>_r1_2026-10-01.md`. Write a brief only when the fix is reversible and needs no taste, French, or design ruling from Dann. Otherwise, write in your memo what Dann must decide, as one question with a recommendation.

## Your memo
`memo-overnight-<your letters>_r1_2026-10-01.md`. For each item: the question, what you found (cited), the verdict (CLOSE: already done or moot / BRIEF: written, with its file / NEEDS DANN: the one question / NOT ESTABLISHED: what would settle it). End with a section "What I could not establish", required even if empty.

Reply to the desk in no more than 20 lines: one line per item with its verdict, and the file names.
