# Is 2026-10-30 achievable? Desk estimate

Revision 1, 2026-09-16. **DESK INFERENCE, asked for by Dann** ("make a
reasonable estimate based on our work history together"). Every fact about the
tree carries the line it was read from, 2026-09-16. Every size is an inference
and says so.

## The unit: one build cycle

One brief, one Code build, one ship, one walk. **Measured from `git log`,
2026-09-16:** four cycles shipped between 20:25 and 22:34 (N.143, N.142 with the
loupe French, N.144, N.145). Commit counts per day since 2026-09-10: 18, 3, 3,
19, 10, 1, 11, so about **four heavy evenings a week**, each worth about **four
cycles** when the items are small.

**Available:** 2026-09-17 to 2026-10-30 is 44 days, about 6.3 weeks, so about
**25 heavy evenings, or about 100 cycles, at tonight's pace.**

## The IN list, sized

| row | state in the tree | size (DESK INFERENCE) |
|---|---|---|
| N.132, N.131 build, COLOUR-6 | strings only; N.131's 21 rows ratified | 1 cycle |
| N.142 step 2 | a count in Dann's browser, likely zero | 1 |
| INBOX-37, the loupe tap | `handleLoupePick`, `+page.svelte:673-676`; needs his design pick | 1 to 2 |
| PROC-1, COLOUR-7, INBOX-17, INBOX-31 | desk writing | 1 |
| N.146 | in Code tonight | 1 to 2 |
| N.129 | brief written; `underlay-widths.ts:690`, `staff-renderer.ts:3361` | 2 to 3 |
| N.136 with N.119, widened | Transcription applies it (`+page.svelte:2256-2257`); Markup does not (spec) | 2 to 3 |
| N.141 last step | the squircle across a tie | 2 |
| N.130 | 59 Insights strings; desk drafts, Dann rules the French | 2 to 3, plus about an hour of his reading |
| N.82 | the watch band builds English sentences in code (`watchlist.ts:530` on, e.g. the passaggio line) | 2 to 3 |
| N.127 increment 2 | compass prints as text (`InsightsPane.svelte:320`); space reserved (`insights.ts:352-353`) | 2 to 3 |
| N.85 | README, CONTRIBUTING, code of conduct; Dann reads every word | 2 |
| N.86 | dead-code audit and the Shane switch (`wall.ts:6-7`); a Sonnet agent can read | 2 to 3 |
| N.123 | the layer is built (`phonation.ts:298`); the figures, two unsourced formulas, and a place on a page fixed at one page (`insights.ts:348-360`) are not | 5 to 8, with design |
| N.94 | `transposeScore` exists (`transposition.ts:217`) and nothing in the app calls it; only `suggestTranspositions` is used (`watchlist.ts:478`); the control's spec is 40 days old | 5 to 8, with design |
| N.84 | the Guide walks the old interface: four tabs at the bottom, a Transcribe button (`GuideContent.svelte:368`, `:406-410`), in two languages, with screenshots | 5 to 8, and it must come last |
| UNSETTLED-6 | the per-format walk; its fixes are NOT ESTABLISHED | 2 to 6 |
| N.83 | the walkthrough call; Dann schedules it | 1 |
| CHECK, nine rows | one look each; some become work | 5 to 12 |

**Total: about 45 to 75 cycles.**

## The answer

**Achievable at tonight's pace, with room, if three things hold:**

1. **The freeze holds.** In the week to 2026-09-13, fifteen items arrived and
   nine closed; that rate would eat the margin.
2. **The three large rows start early.** N.94 and N.123 need design before
   Code, and N.84 needs the interface to stop changing.
3. **The pace holds for six weeks.** Four heavy evenings a week is what the log
   shows for the last week, not for the last month: the log has gaps (2026-08-29
   to 2026-08-31, 2026-09-05, 2026-09-06, 2026-09-09).

**The risk is the design rows, not the build rows.** If N.94's control is not in
Code by a checkpoint date, it moves to LATER and the date stands.
