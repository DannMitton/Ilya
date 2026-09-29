# Brief for Code: N.173, strict gate 2 and no page limit

Written by the desk 2026-09-28 20:26. Amends your uncommitted gates work (report
`docs/sessions/report-code-n173-gates_r1_2026-09-28.md`), checked by the desk: 1,665
tests, `check` 0 errors, ratchets OK. Run this before anything ships.

## The ruling

`docs/sessions/draft-curation-rules_r1_2026-09-24.md`, "Revision r5". Dann, 20:22 and
20:24: the box is not a data dump; it points out what may need coaching and lets
accurate but unhelpful facts pass unsaid; a song may need no comment, or two or three
per page.

## The work

1. **Remove gate 5, the page limit.** Delete `perPage` and the page-grouping step in
   `applyGates` (`gates.ts`, "Gate 5"), and `pageDropped` from the result. The page map
   (`pageOfMeasureFrom`) goes too unless something else reads it; say which.
2. **Make gate 2 strict and drop the switch.** Remove `offer` from `GATE_DEFAULTS`; a
   place passes gate 2 only with a sourced thing to try, or when its interaction is rare
   (the existing `isRare` path). No "pending" route.
3. **Weight never passes a place alone.** Confirm by test: a place with no offer at the
   song's climax and phrase top prints nothing.
4. Update the header comment of `gates.ts` to the five gates that remain, citing
   Revision r5.
5. Tests: update the gate tests; add the climax test in step 3; keep the fold and
   gate 1 tests.
6. Re-run your trial harness on «Скучай» and Sunless 1 with the frequency run's Mitton
   profile and report what the box prints (expected: nothing on both). Report too
   what it prints for the four other Sunless songs, so Dann can see where advice
   does appear.
7. Leave `watch.lead.one` / `watch.lead.many` in place; their French is still to be
   ruled by Dann and does not ship until it is.

## Gates

All eight at baseline or better; report the new count. `check` 0 errors; ratchets OK;
`MarkupPane.svelte` does not grow. Do not pack statements onto one line to fit a
ceiling; if a ceiling bites, say so in the report.

## The report

Append to `docs/sessions/report-code-n173-gates_r1_2026-09-28.md` a section
"r2, strict gate 2": what changed with `path:line`, gate numbers, the trial output
per song, and **What I could not establish**. NOT ESTABLISHED beats a complete
invented answer. Do not commit, stage, stash, check out, or restore. Dann ships.

## Addendum, 2026-09-28 20:33: threshold 2

Ruled by Dann 20:32 (curation draft, Revision r5). Set `GATE_DEFAULTS.stakesThreshold`
to 2. Rewrite its comment: the 3 of the first trial guarded against passaggio lines with
nothing to try, which strict gate 2 now removes; 2 lets through advised places the
music does not stress. Update any test that pins 3. Re-run the six-song trial and all
eight gates, and append the results to the "r2" section of your report. Do not commit.

