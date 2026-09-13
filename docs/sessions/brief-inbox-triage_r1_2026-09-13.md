# Brief: triage the INBOX backlog

**A READ-ONLY AUDIT. Change nothing, including `INBOX.md` itself.** The output
is a table the desk turns into one ruling pass with Dann.

Asked for by Dann 2026-09-13: *"organize the older backlog and systematically
resolve its elements... carrying dead weight is no bueno."*

Read `docs/memory/CONTRACT.md` in full before you start.

## 1. The scope

`docs/memory/INBOX.md`, **lines 32 to 135 only**. Lines 136 onward are this
week's and the desk has already accounted for them. The file is append-only:
**do not edit it.**

Roughly 104 items, from 2026-08-24 to 2026-09-11.

## 2. What each item gets

One row per item, in file order:

| column | what goes in it |
|---|---|
| line | the line number in `INBOX.md` |
| gist | the item in under fifteen words |
| state | one of the five below |
| evidence | a `path:line`, a commit, or a `STATE.md` / `LOG.md` quote. **A state with no evidence is not a state; use `UNCLEAR` instead** |
| needs Dann | yes or no, and if yes, the one question in one sentence |

**The five states:**

- **DONE** — it was built or ruled and you can point at the thing.
- **SUPERSEDED** — a later ruling or item replaced it. Name the later one.
- **NUMBERED** — it became a cardinal. Give the number and where it lives now.
- **OPEN** — still live, nothing has touched it.
- **UNCLEAR** — you cannot tell from the tree and the record. This is a
  respectable answer and it is better than a guess.

## 3. Where to look for evidence, in this order

1. `docs/memory/STATE.md`, which holds what is open.
2. `docs/sessions/LOG.md`, which holds what closed.
3. The tree, for anything describing a control, a string, or a behaviour.
4. `docs/sessions/` memos, for anything a walk found.

**Stop at the first solid hit.** Do not keep searching to strengthen a case.

## 4. Three the desk already believes are closed. Confirm or overturn them

Use these to calibrate, and report what you find even if it contradicts:

- **Line 61**, a named Redo pill beside Undo: the desk believes this exists.
- **Line 113**, the Open syllables toggle should reach Score markup live: the
  desk believes this became N.119 and is briefed but not built, so **OPEN and
  NUMBERED at once**. Say which single state fits best and why.
- **Line 79**, a re-seated cell loses its punctuation: the desk believes this
  became N.118 and is briefed.

## 5. What NOT to do

- **Do not edit `INBOX.md`.** It is append-only and Dann's.
- Do not recommend deleting anything. The desk and Dann decide what leaves.
- Do not number anything. Only Dann numbers.
- Do not run git.
- Where an item is a proposal Dann made and never returned to, that is **OPEN**,
  not superseded. Age is not a state.

## 6. What the desk wants most

**The `needs Dann` column is the point of this.** The goal is one short sitting
where Dann rules a batch of items at once, so every question must be answerable
in a sentence and must carry enough context to be answered cold. A question of
the form "what should we do about line 88?" is useless. A question of the form
"Line 88 asks for a singer to move a measure between systems, Finale-style;
nothing in the tree does this and it is numbered N.115. Keep it open, or retire
it?" is what is wanted.

## 7. The return memo

`docs/sessions/memo-inbox-triage_r1_<date>.md`. The full table. A tally of the
five states. Then a second, short list: **every item marked `needs Dann`,
gathered in one place**, ready for a single ruling pass.

**NOT ESTABLISHED beats a complete invented answer.**
