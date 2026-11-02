# Report: row 165, step 7, the finding cue (r1, 2026-11-02): STOPPED, no code changed

Branch `cloud-lane-23`, fast-forwarded to `origin/Shane` at `6f740db` (row 165 as shipped). The one change in this commit is this report.

## Why I stopped

Dann's ruling (2026-11-01 17:57) asks for a dark outline, inside the bar, drawn in "the darkest rose token the palette has", at least 3:1 against the `--rose-jewel` fill (WCAG 2.2, 1.4.11), and says to stop and report the closest values if no rose token reaches 3:1. **None does.** Measured from `apps/web/src/app.css` on `6f740db` (WCAG 2.2 relative luminance), each token against the fill `--rose-jewel #7C4E59`:

| Token | Value | Contrast against the jewel fill |
|---|---|---|
| `--rose-ink` (the darkest rose token) | `#73414E` | **1.19:1** |
| `--rose-jewel` (the fill itself) | `#7C4E59` | 1.00:1 |
| `--rose` (band) | `#AF858E` | 2.12:1 |
| `--rose-head` | `#DBC8CC` | 4.25:1 |
| `--rose-desk` | `#E7DADD` | 5.00:1 |
| `--rose-wash` | `#F3EDEE` | 5.87:1 |

So the darkest rose token is the closest dark value, and it is 1.19:1. The jewel is already nearly as dark as the ink, which is the same fact behind decision 2 in the step 5 report.

For context only (not applied): the neutral `--ink-primary #1A1612` is 2.65:1 against the jewel, also under 3:1 and not a rose token. The jewel against the cream paper is 5.71:1.

## What this means for the cue

- A dark outline cannot be seen against this fill at 3:1 from any rose token. The three light rose steps (`--rose-head`, `--rose-desk`, `--rose-wash`) do clear 3:1, so a LIGHT inner outline (or a light inner stripe) would satisfy 1.4.11 and would not rely on shade of the fill alone. That is a different look from the dark outline he ruled, so it is his call, not mine.
- Other options he may prefer: lighten the ordinary bars (a lighter fill makes the dark outline readable), or mark a finding by shape or hatching.
- `PitchSeconds.svelte` carries no finding cue (its bars are one `--rose-jewel` fill); only `Tessituragram.svelte` (`r.dark`, line 154) does. Nothing to change there.

## State left

`Tessituragram.svelte` is unchanged: a finding bar is still `--rose-ink`, the other bars `--rose-jewel`, the two nearly the same shade (1.19:1). No test, comment, or screenshot was added. Gates were not re-run, since no code changed since the step 6 tip, which `6f740db` includes as shipped.

No French changes.
