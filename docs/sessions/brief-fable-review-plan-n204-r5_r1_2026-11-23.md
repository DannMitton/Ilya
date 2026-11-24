# Fable review brief: N.204 plan r5

r1, 2026-11-23, by the desk (Opus 5). Read-only. Write one report and nothing else.

## 0. What you are reviewing, and against what

`docs/sessions/plan-code-audit-maintainability_r5_2026-11-23.md` (md5 `98deb02b`), the plan for Ilya's code audit and one refactoring pass. Compare it against `plan-code-audit-maintainability_r4_2026-11-21.md`, which it replaces.

r5 was written tonight in about forty minutes, amended twice in place on Dann's rulings, and has had exactly one reader: the desk that wrote it. You are the second.

## 1. The standard it is tested by, in Dann's own words

2026-11-23 20:19, transcribed as written: *"we need the code legible, navigable, and thoughtfully prganized."*

2026-11-23 20:22, transcribed as written: *"N.204 needs to be us coming up for that air. The time is now to plan an effective audit and refactoring. I want code I can be proud to share"*.

2026-11-23 20:26, transcribed as written: *"The architecture was written well after Ilya was vibecoded. Now might be the time to thoughtfully architect a well-organized framework that happily hosts our body of modular code?"*

## 2. What changed from r4, so you can aim

1. **Phase 1a is new:** a capability list, then a framework designed from it, drafted twice independently (Fable and Opus) and compared. r5's own first draft derived the structure by synthesis from sixteen unit reads; Dann struck that at 20:26 as induction over the decomposition Ilya already has.
2. **Each unit read now owes a framework test** instead of a placement answer.
3. **Phase 1c settles the framework** against what the reads found.
4. **Phase 4 splits** into documents written from the framework before the lanes, and documents brought true after.
5. **Done-when item 5** became a sampled comment audit; **item 11** is new.
6. The stale date in section 7 is corrected.

## 3. The questions, in order of what they cost if wrong

1. **Does r5 now test "thoughtfully organized"?** r4 did not; the desk's finding was that nothing in r4's done-when measured organization and that tier 3 split a file under ratchet pressure rather than by design. Say whether item 11 plus phases 1a and 1c close that, or whether the gap survives in a new shape.
2. **Is phase 1a's two-draft comparison sound, or theatre?** Two models drafting from the same capability list may converge for reasons that have nothing to do with Ilya. Say what would make the comparison informative and what would make it a ritual, and whether r5 as written gets the first.
3. **Is the order workable?** Phase 1a runs before the eleven remaining unit reads, on `names.ts`, the Names table, and five filed reads. Is that enough input for a framework, or does it design in the dark? If it is not enough, say what the minimum is.
4. **Does step 3's cost constraint actually bind,** or can a framework still be drawn that the code cannot be moved into?
5. **Is the sampled comment audit sound?** 200 comments, a 90 per cent pass rate, the unit sent back rather than the comment. Say whether the sample size and the threshold do any work.
6. **What did r4 carry that r5 lost?** Read both. Anything dropped by accident in an in-place amendment is yours to catch.
7. **Does r5 contradict any standing ruling?** Check `docs/memory/CONTRACT.md` sections 1, 4, 5, and 8, and `docs/memory/OPEN.md`'s section "N.204: ITS PURPOSE, ITS COMMENTS, AND THE DESK'S DECISION RIGHTS" and "N.204: FABLE READS ALL THE CODE".

## 4. Reading list

- `docs/sessions/plan-code-audit-maintainability_r5_2026-11-23.md`, whole.
- `docs/sessions/plan-code-audit-maintainability_r4_2026-11-21.md`, whole.
- `docs/memory/CONTRACT.md`, sections 1, 4, 5, 8.
- `docs/memory/OPEN.md`, the two N.204 sections named above.
- `docs/sessions/read-fable-n204-unit-d_r1_2026-11-22.md`, whole. **Read this one to answer question 3:** it is a filed unit read of the shape r5 expects to carry a framework test, so it tells you whether that instrument fits the work a unit actually does.

Do not read the source tree for this review. It is a review of a plan.

## 5. Verdict

One of **ADOPT**, **ADOPT WITH AMENDMENTS**, or **DO NOT SEND**, at the top of your report, with blockers separated from amendments and each numbered.

## 6. What you could not establish

Carry a section for it. **NOT ESTABLISHED beats a complete invented answer.**

## 7. Report

`docs/sessions/review-fable-plan-n204-r5_r1_2026-11-23.md`. Write no other file, write nothing under `docs/memory/`, change no code, and use no git write command.
