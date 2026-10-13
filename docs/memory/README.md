# Ilya project memory — START HERE

r1 draft, 2026-10-12. This folder is the project's memory. It lives in the repository, beside the code, under git. Read this page, then only what it sends you to. Do not read the whole folder.

## The one thing

Whatever `STATE.md` says it is. Open that file and read its first section. Nothing after this line names an item, a commit, a state, or a section of `STATE.md`: twice (2026-08-14, 2026-09-13) this block named one and was stale.

## Read order for a new session

1. **`CONTRACT.md`**: how we work. The posture, the opening ritual, the tethers, the ceiling and git, style, French, and what not to do. Read it every time.
2. **`STATE.md`**: the one thing, the latest handover, and the tracker of open items. Then **`QUEUE.md`**: every Code brief that is open, or shipped and not walked.
3. **`ENVIRONMENT.md`**: only when you are about to touch a tool, a path, or a gate. It opens with an index keyed by symptom; use the index.
4. **`PRODUCT.md`**: only before forming an opinion about what Ilya should do or look like.

Not part of the opening read; open each when its moment comes:

- **`OPEN.md`**: the specs behind the tracker's marks. Open it when the one thing closes, or when Dann names an item by number.
- **`SEQUENCE.md`**: the build order and the dependencies that fix it. Open it when the next item is being chosen.
- **`SCHEDULE.md`**: the week-by-week road to the release. Open it when choosing what to do next; tick it at every close.
- **`OWED.md`**: standing debts and unsettled questions. Open it when one of its items comes up or when Dann asks what is outstanding.
- **`INBOX.md`**: append-only; you do not open it unless Dann asks.

The archives are records, never authority. **The code beats this folder, and this folder beats the archive.**

- `CONTRACT-archive.md`: the accounts of what each rule cost, and every earlier wording, verbatim.
- `STATE-archive.md` and `../sessions/LOG.md`: closed rows, superseded floors, old handovers and colophons.
- `QUEUE-archive.md`: every row's full history.
- `SCHEDULE-archive.md`: the r1 schedule of 2026-09-16 to 2026-10-12, verbatim.
- `../sessions/`: thread openers, handovers, briefs, reports, and returned memos.

## Who writes what

| file | changes | who writes it |
|---|---|---|
| `CONTRACT.md`, `PRODUCT.md` | rarely, when Dann rules | Dann rules, you transcribe |
| `ENVIRONMENT.md` | when a tool, path, or baseline moves | you, with an index row |
| `OPEN.md`, `SEQUENCE.md`, `OWED.md` | when an item is numbered, ruled, started, closed, or a debt moves | you |
| `STATE.md`, `QUEUE.md`, `SCHEDULE.md` | every session, at the close | you |
| `INBOX.md` | any time Dann digresses | you, one line, at once |
| the archives | at a close, when something leaves a working file | you, verbatim |

## Opening a session

Dann pastes this and nothing else:
```
Claude, I'm Dann.

Read ~/Desktop/ilya-rewrite/docs/memory/README.md first and follow its read
order. Do not read the whole folder.

Your first call is device_request_folder_access for
/Users/dannmitton/Desktop/ilya-rewrite and /Users/dannmitton/Downloads.
Folder grants do not carry between sessions.

Once the reads are done, emit the sequence-position block from CONTRACT.md §2.
Nothing else happens before it.

Then ask me for the repository state in one line. You do not write with git,
ever. Read-only git is allowed; CONTRACT.md §4 says which commands.

Then start on THE ONE THING in STATE.md. Do not bring me an engineering
choice. Before any helper runs, tell me how long you will be silent.
```

If that prompt ever needs to grow, something has gone wrong in this folder instead. Its last line was changed by the desk at the close of 2026-10-05 under Dann's rule of 2026-10-04 22:27 (he says what he wants, the desk decides how), a DESK DEFAULT, his to overrule.

## Closing a session

0. **Check every open line against `git log` first.** Run `git --no-optional-locks --no-pager log --since=<the last close> --format="%h %s"` and, for every row or item a commit names, set its line in `QUEUE.md`, `SCHEDULE.md`, and `STATE.md` §THE TRACKER in the same pass. A walk Dann reports goes into all three the moment he reports it, not at the close. (Added 2026-10-11 after an audit found 28 stale lines: `../sessions/audit-memory-vs-git_r1_2026-10-11.md`.)
1. **Update `STATE.md`:** the one thing, the handover, the tracker marks. If an item closes, its spec leaves `OPEN.md` and its row goes to `STATE-archive.md` in the same pass; if Dann numbers a new one, its spec enters `OPEN.md` and its mark enters the tracker. A new debt or unsettled question goes to `OWED.md`. Ruled by Dann 2026-09-01: `STATE.md` holds only what is open; anything that closes moves out at the close of the session that closed it. Tripwire, not an allowance: over 200 lines means something failed to move.
2. **Before any row moves, check where its rulings landed.** Grep each ruling the row carries and confirm it also lives in `OPEN.md`, `CONTRACT.md`, or `PRODUCT.md`; a ruling made inside a brief is copied there in the same pass, because a brief is not a ruling's home. (Six rulings nearly went to the archive on 2026-09-20.)
3. **Update `QUEUE.md`:** a shipped row becomes one line until Dann walks it, then its history moves to `QUEUE-archive.md` verbatim. Tick `SCHEDULE.md` from the day's `memo-*` and `report-*` files, with the file name.
4. Add anything hard-won to `ENVIRONMENT.md`, with its row in the index at the top.
5. Ask Dann to commit. No agent commits, ever, and no agent stages (`CONTRACT.md` §4; the two branch exceptions are there too).

That is the whole ritual. There is no handover document and no opener to write.

---
*Created 2026-08-13 from `claude/e48-thread-opener_v1_2026-08-13.md`; r1 draft 2026-10-12 after the split of the archives. The accounts of why the folder is split this way are in `CONTRACT-archive.md` and `STATE-archive.md`.*
