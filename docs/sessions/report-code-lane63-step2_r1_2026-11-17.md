# Report: lane 63, Step 2 (stale comments and one guard)

2026-11-17. Branch `cloud-lane-63`.

## What changed

Comments (no code, no string):

- `apps/web/src/lib/voice/VoiceTypeIntake.svelte:10`: "for the reason `InsightsIntake.svelte` gives" now names `IntakeScale.svelte`. I checked it: `IntakeScale.svelte:7` gives that reason ("a radio group cannot otherwise be unselected").
- `VoiceTypeIntake.svelte:129-131`: the recipes comment now names `IntakeScale.svelte` (its `.intake-option` is `.vt-option` here; both are 0.8125rem, flex, gap 0.5rem, checked against `IntakeScale.svelte:66-75`) and the stations beside it, `DescribeVoice.svelte` and `InsightsShares.svelte`.
- `VoiceTypeIntake.svelte:148`: "The characteristics phase's group heading (`.charx-heading`)" now reads "The group heading, the same recipe as `DescribeVoice.svelte`'s `.dv-heading`". I checked `DescribeVoice.svelte:131-138`: same family, size 0.65rem, uppercase, 0.12em tracking, `--ink-tertiary`, weight 600. The `.vt-legend` rule is kept (it is used at `:65` and `:88`); only its comment changed.
- `apps/web/src/lib/voice/intake-symbols.ts:5`: `InsightsIntake.svelte` becomes `IntakeScale.svelte`, the importer of `stemParts` (`IntakeScale.svelte:12`).

`grep` for `InsightsIntake` and `charx` in `apps/web/src` still finds `InsightsIntake.svelte` named in the headers of `IntakeScale.svelte:3`, `InsightsShares.svelte:3`, `DescribeVoice.svelte:3`, and `intake-answers.ts:2`. Those say what the file used to be, accurately, and are outside this step's list; I left them. No `charx` remains.

The guard:

- `apps/web/src/lib/components/Drawer/reveal-scroll.ts` (end of file): new pure function `revealYieldsRestore(restoreQueued, targetFound)`, true only when both are true.
- `apps/web/src/lib/components/Drawer/Drawer.svelte:406-407`: the line that set `restoreYields` now runs after the target lookup: `if (revealYieldsRestore(restoreQueued, !!head)) restoreYields = true;`. Import at `:6`. The file is still 1,986 lines; no ceiling touched.
- `apps/web/src/lib/components/Drawer/reveal-scroll.test.ts`: 3 tests added (queued and found yields; queued and missing does not; nothing queued does not).

## Tests

- `reveal-scroll.test.ts`: 14 passed (14); 11 before, 3 new.
- `intake-symbols.test.ts`: 8 passed (8) (comment-only change).
- `svelte-check --threshold error`: 0 errors, 12 warnings.

I did not write a test of the Svelte effect itself. The component's behaviour on a missing target has no path to reach it today (the brief says so), so only the decision is tested.

## What I could not establish

- A side effect for the desk to rule on, not changed here: on a phone, a word tap with no `revealTarget` writes `scrollTop = 0` even when its default head, `[data-band-head="analysis"]`, is missing (`revealScrollTop` returns 0 for `phone && !link` before it looks at the head). With this change that tap no longer sets `restoreYields` in that case, so a queued restore would overwrite the scroll. The brief says to yield only when the target is found, and I did that. I do not know that any path has a missing ANALYSIS head on a phone.
- Playwright on this change: once, at the end.
