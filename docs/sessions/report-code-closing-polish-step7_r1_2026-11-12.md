# Report: closing polish lane, step 7, two Playwright faults (Code, cloud-lane-48, r1, 2026-11-12)

Amendment 13 applies.

## What changed

- `Control+V` to `ControlOrMeta+V` (a paste): `e2e/poem-library.test.ts:38`, and `e2e-phone/text-witness.test.ts:80`. Comments corrected at `e2e/poem-library.test.ts:11` and `:33`.
- `Control+A` to `ControlOrMeta+A` (a select): `e2e/poem-library.test.ts:178`.
- `Control+z` to `ControlOrMeta+z` (an undo): `e2e/glue-typed-marks.test.ts:46`, `e2e-phone/relining.test.ts:88` (and its comment at `:86`).
- `e2e/singer-paths.test.ts:180` expects « La diction lyrique russe pour chanteuses et chanteurs », the title at `components/Reading/LearnContent.svelte:20` (the unit test `learn-opening.test.ts:18` already pinned it).
- Unchanged, as the step says: `Control+End` at `e2e/poem-library.test.ts:225`, `:239` and `e2e-phone/relining.test.ts:118`. They move the caret, they do not select, paste, or undo. A search of `e2e/` and `e2e-phone/` for `Control+` finds only these three presses and descriptive comments.

## What `Control+End` does on a Mac

NOT ESTABLISHED. I have no Mac here. I did not run it. What I know from reading, not from running: Playwright's `ControlOrMeta` exists for a key that means "the platform's command key", and `End` has no such meaning on macOS, where the move to the end of a text field is Command+Down. So a single key that moves the caret to the end of the field on both platforms is not one press; `Control+End` may leave the caret where it is on a Mac, which would put the typed ` x` and ` ` in the wrong place in those three tests. The desk's Mac run is the way to establish it.

## Tests run

The edits are to e2e files; the Playwright runs of the touched tests are in step 11's report (this lane runs them there, with the eight the desk named).

## What I could not establish

- What `Control+End` does on a Mac (above).
- Whether any of the changed presses behaves differently in Chromium on a Mac; none was run there.
