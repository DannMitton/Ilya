# New Thread Kickoff

Hi Claude. Resuming Ilya development. Please read all project files before responding.

## Where We Are

**Version:** 6.0.78 | Phase B-bugs complete | Phase C (Audit Arc) begins

All desktop bugs from regression testing are resolved. The app is fully functional with complete bilingual EN/FR support. Mobile layout (7.A) is deferred to a dedicated pass after Phase C.

The codebase is ~16,238 lines in a single `index.html` file. Phase C aims to bring this to ~10,917 lines through dead code removal, externalization, and cleanup, without changing any functionality. The ultimate target of 9,000 lines requires Phase D (structural consolidation).

## What's Next

**Read `PHASE_C_TASK_SEQUENCE.md` for the full plan.** It contains seven verified tasks (C.1 through C.7) with line-level detail, estimated savings, risk assessments, and a test protocol.

**Start with C.1: Strip Console Statements.** This is the simplest, safest entry point. Fetch `index.html` from the project files, execute the task, and deliver with the standard checklist.

## Session Resumption Checklist

1. Read `ILYA_STATE.md` for architecture and current status
2. Read `PHASE_C_TASK_SEQUENCE.md` for the detailed execution plan
3. Read `KICKOFF.md` (this file) for orientation
4. The current `index.html` is available in the project files
5. Follow one-change-per-cycle protocol
6. Deliver with: repo link, live link, commit message (copyable), test text (copyable), sequential test steps

## Delivery Template

Every commit must include:

- **Repo:** https://github.com/DannMitton/Ilya
- **Live:** https://dannmitton.github.io/Ilya/
- **Commit title:** (copyable)
- **Commit description:** (copyable)
- **Test text:** Не пой красавица при мне
- **Test steps:** (numbered, sequential)
