# Brief: confirm the integrity of N.204 plan r8 (Fable)

Written by the desk (Opus 5), 2026-11-23 21:5x. Read-only. You write one file and nothing else.

## Why this exists

`plan-code-audit-maintainability_r8_2026-11-23.md` (md5 `0fb9e593`) is the governing plan for N.204 and `STATE.md` says so. **It is a rebuild, not an amendment.** r7 was abandoned because it had replaced one section of r6 and left six others instructing a design Dann struck, so r8 was rebuilt from r6, the last internally consistent revision, with the ten steps in place and every item of the r7 review applied.

**The review on file is of r7. No reviewer has read r8.** A plan that was assembled by rebuilding under time pressure, in the same evening that produced r5, r6, and r7, can carry exactly the fault it was rebuilt to remove. That is what you are checking.

**You are not reviewing the plan's design.** The sequence of ten steps is Dann's ruling of 2026-11-23 20:45 merged with the literature, and `STATE.md` says DO NOT REDESIGN ITS TEN STEPS. Do not propose a different sequence, a different method, or a different scope. If you believe a step is wrong, say so in one line under "What I could not establish" and move on.

## What you read

In the container, under `/mnt/user-data/uploads/ilya-rewrite/`:

- `docs/sessions/plan-code-audit-maintainability_r8_2026-11-23.md` — **whole, this is the subject**
- `docs/sessions/review-fable-plan-n204-r7_r1_2026-11-23.md` — whole; its four blockers and twelve amendments
- `docs/sessions/review-fable-plan-n204-r5_r1_2026-11-23.md` — whole; its four blockers and eleven amendments, some of which r7 lost
- `docs/sessions/plan-code-audit-maintainability_r6_2026-11-23.md` — whole, or by line diff against r8; r8 claims to be built from it
- `docs/sessions/plan-code-audit-maintainability_r7_2026-11-23.md` — for the diff only
- `docs/sessions/research-n204-sources_r1_2026-11-23.md` — for question 4
- `docs/memory/CONTRACT.md` — sections 0 to 0.3, 1, 4, 5, 6, 8, **read whole, not through `cut`**. Your r7 review recorded reading these through `cut` at 2,600 characters a line and truncating the last bullet of section 8. Lines in that file run past 11,000 characters. Read with a tool that does not truncate.
- `docs/memory/STATE.md` — the close of the 2026-11-23 evening desk
- `docs/memory/OPEN.md` — the four N.204 sections at lines 4050, 4126, 4474, and 4531
- `docs/memory/INBOX.md` — lines 1002 to 1008

**Already settled, so do not re-file it as a finding.** Your r7 amendment 12 and your unestablished item 2 said Dann's words of 2026-11-23 were recorded only inside r7's header. They are now in `INBOX.md` at lines 1002 to 1008, covering 20:45, 20:49, 21:07, 21:18, 21:22, 21:27, and 21:29. Check them if you wish; the finding is closed.

## The five questions

**1. Does any part of r8 still instruct the design Dann struck at 20:45?**

What he struck: a framework designed or chosen before the read; the two pre-read drafters; the probe questions asked before the read; the provisional file table; a shape derived from the folder tree or from a paradigm chosen at the outset. The phase names `1a`, `1b`, `1c`, `2`, `3`, `4a` belong to that design where they carry its machinery. Read every section of r8 as a desk or a helper would read it without the header, which is how a lane brief reads a plan. Name each place by its line.

**2. Does r8 cite anything that is not in r8?**

r7's fault was a pointer, not a paragraph. Check every internal citation: "section 5" and the restored sections 5a to 5e, every phase name, every step number, every event a done-when item names, and every file path. For each, say whether the target exists in r8.

**3. Is every item of both reviews present, and is each one actually applied rather than named?**

r8's header claims all thirty-one items of the r7 review are applied, and that it carries the r5 review through r6. Go item by item: r7 blockers 1 to 4 and amendments 1 to 12, then the r5 items your r7 review reported lost (amendment 10, the Fable read before step 7 binds; blocker 4 part c, the cost of a move; the comparison rule; the probe questions). For each, give r8's line and one of three verdicts: **APPLIED**, **NAMED BUT NOT APPLIED**, or **ABSENT**.

**4. Is every done-when item measurable as written?**

Item 11 is the one you declared unmeetable in r7 and r8 rewrote it. Take each of the eleven items and say what a person would measure, with what instrument, and what number or artifact would settle it. Flag any item that can be satisfied while the tree does not move. Items 5 and 7 carry arithmetic; check it.

**5. Was anything in r6 lost in the rebuild without a stated reason?**

The same method you used on r7: diff r6 against r8, then segment. Separate what r8 struck on purpose and says so, from what simply did not survive the copy. r8 claims sections 5a to 5e restore r6's section 5 "verbatim"; test that word.

## How you report

File to `docs/sessions/review-fable-plan-n204-r8_r1_2026-11-23.md`, written in the container under `/mnt/user-data/outputs/`. **Run `ls` on the folder before you name the path**, because lane and revision numbers are not unique across subjects.

Open with a verdict: **ADOPT**, **ADOPT WITH AMENDMENTS**, or **DO NOT USE**. Then blockers, then amendments, then the five questions in order, then a section headed "What I could not establish", then a section headed "Files read" naming what was read whole and what in part.

A blocker is something that would make a desk or a lane act on a struck design, act on a citation that leads nowhere, or report a done-when as met when it is not. Everything else is an amendment.

Say which terms you coined and which you adopted.

House style governs: Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no directional language, no `simply`, `just`, `easy`, or exclamation marks. Do not write a sentence whose only work is to show care.

## What you could not establish

Carry a section with that heading. **NOT ESTABLISHED beats a complete invented answer.**

## Constraints

- Read-only. Open no source file under `apps/`, `packages/`, or `scripts/`; this is a review of a document.
- Create no `.bak` file.
- Write exactly one file, the report.
- Cap: 300,000 tokens. If you approach it, file what you have with the questions you did not reach named.
