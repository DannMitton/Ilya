# Ilya project memory — START HERE

**This folder is the project's memory. It lives in the repository, beside the code,
under git. It replaces the per-session thread opener.**

Read this page. Then read only what it sends you to. Do not read the whole folder.

---

## THE ONE THING

> **Whatever `STATE.md` says it is. Open that file and read its first section.**
>
> **Do not restate the one thing here.** On 2026-08-14 this block still named a
> commit that `STATE.md` had never heard of, and the session opened on a
> contradiction it had to resolve before it could start.
>
> **It happened again and was caught on 2026-09-13.** This block still carried
> "the syllable station and the note click are `WRITTEN`, not `DONE`" and sent
> the reader to `STATE.md` §The walk. Neither phrase appeared anywhere in
> `STATE.md` any more, and there is no §The walk: the four-step walk lives in
> §THE FIXTURE. **Both lines are struck.** The rule this block states is the rule
> it kept breaking, so: nothing after the first line of this block ever names an
> item, a commit, a state, or a section of `STATE.md`.

Nothing else is in progress. Everything else is in `STATE.md` or `INBOX.md` and is
waiting, on purpose.

---

## Read order for a new session

1. **`CONTRACT.md`** — how we work. The tethers, the ceiling, and the things you
   must not do. **Read this every time. It is the shortest and the most expensive
   to skip.**
2. **`STATE.md`** — the one thing, the tracker, and the rulings Dann owes.
3. **`ENVIRONMENT.md`** — only when you are about to touch a tool, a path, or a
   gate. It is a lookup table, not a read-through, and since 2026-09-01 it
   opens with an index keyed by symptom. Use the index.
4. **`PRODUCT.md`** — only before forming an opinion about what Ilya should do or
   look like.
5. **`OPEN.md`** — the specs for the numbered items that are open and not
   started. **NOT part of the opening read.** Open it when the one thing closes
   and you need the next item's spec, or when Dann names an item by its number.
   Split out of `STATE.md` on 2026-09-13; nothing in it was reworded.

`INBOX.md` is append-only and **you do not open it unless Dann asks.**

`../sessions/LOG.md` is the archive behind `STATE.md`, split out 2026-09-01.
**Nothing in the read order opens it.** Go there to check what a superseded
ruling said, and nowhere else.

`../sessions/` holds the archived thread openers, handovers, and returned memos.
Nothing there is authoritative. **The code beats this folder, and this folder
beats the archive.**

---

## The four lifespans, which is why this is split up

| file | changes | who writes it |
|---|---|---|
| `CONTRACT.md` | rarely, when Dann rules a new tether | Dann rules, you transcribe |
| `PRODUCT.md` | rarely, when something is settled | Dann rules, you transcribe |
| `ENVIRONMENT.md` | when a tool, path, or baseline moves | you, when you learn it the hard way |
| `OPEN.md` | when an item is numbered, ruled, or starts | you |
| `STATE.md` | **every session, at the close** | you |
| `INBOX.md` | any time Dann digresses | you, one line, immediately |

The old openers rewrote all four every time. That is why there were forty-eight of
them and why the project knowledge estate filled up four times in a month.

---

## Opening a session

Dann pastes this and nothing else. Everything it used to say now lives in the
files above, which is the whole point of this folder.

```
Claude, I'm Dann.

Read ~/Desktop/ilya-rewrite/docs/memory/README.md first and follow its read
order. Do not read the whole folder.

Your first call is device_request_folder_access for
/Users/dannmitton/Desktop/ilya-rewrite and /Users/dannmitton/Downloads.
Folder grants do not carry between sessions.

Once the reads are done, emit the sequence-position block from CONTRACT.md §0.
Nothing else happens before it.

Then ask me for the repository state in one line. You do not write with git,
ever. Read-only git is allowed; CONTRACT.md §5 says which commands.

Then start on THE ONE THING in STATE.md and stop after one question.
```

**If that prompt ever needs to grow, something has gone wrong in this folder
instead.** The E.48 opener it replaced ran to about six thousand words, and
forty-seven of its predecessors were written and thrown away.

---

## Closing a session

1. Update `STATE.md`: the one thing, the tracker marks, what moved. **If an item
   closes, its spec leaves `OPEN.md` in the same pass;** if Dann numbers a new
   one, its spec enters `OPEN.md` and its mark enters `STATE.md` §THE TRACKER.
2. **Move what closed to `../sessions/LOG.md`.** Ruled by Dann 2026-09-01:
   **`STATE.md` holds only what is open. Anything that closes moves to `LOG.md` at
   the close of the session that closed it.** Size is an output, not a target.
   **Tripwire, not an allowance: over 600 lines means something failed to move.
   Go and find it.**
3. Add anything hard-won to `ENVIRONMENT.md`, **and add its row to the index at
   the top of that file.** A trap nobody can find costs the next session the same
   hour it cost the last one.
4. Ask Dann to commit. **No agent commits, ever, and no agent stages.** The
   narrowed rule, ratified by Dann 2026-09-13, is in `CONTRACT.md` §5: every
   git command that WRITES is forbidden; `status`, `log`, `diff`, `show`,
   `ls-files` and `check-ignore` are allowed.

That is the whole ritual. There is no handover document and no opener to write.

---
*Created 2026-08-13 from `claude/e48-thread-opener_v1_2026-08-13.md`, read in full.
Everything in this folder is SOURCED from that opener unless marked otherwise.*
