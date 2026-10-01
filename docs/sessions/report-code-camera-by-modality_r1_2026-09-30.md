# Report from Code: the camera glyph answers to touch, not to width (QUEUE row 2k)

Code, 2026-09-30. Brief: `brief-code-camera-by-modality_r1_2026-09-30.md`. Branch `Shane`, working tree dirty with rows 2b to 2j. No git writes.

## Summary

- **Built:** the camera glyph in the Input field shows when the primary pointer is coarse, read live, per Dann's ruling of 2026-08-10 (E.36, the sixth clause): "Control geometry answers to input modality, not to form factor or brand."
- **Left alone:** `isMobile`, and N.70's `acceptList`.
- **Verified** in four browser set-ups, and both directions of a change in unit tests with a mocked `matchMedia`.
- **Gates:** gate 4 moves from 1779 (after row 2j) to 1784, the 5 new tests, all passing. The rest are at baseline.

## What changed

- **New `apps/web/src/lib/input-modality.ts`:** `watchCoarsePointer(onChange, matchMedia)` asks `(pointer: coarse)`, reports it at once, and reports again on every `change`. It returns a stop function. With no `matchMedia` (prerender) it reads fine and watches nothing.
- **`IntakeCamera.svelte`:** a `<script module>` holds one page-life watcher and exports `pointer`, a `$state` object whose `coarse` field follows the pointer.
- **`IntakePanel.svelte`:** the glyph's `{#if}` and the field's `beside-camera` class read `pointer.coarse` instead of `isMobile`, and the comment over the camera now cites the sixth clause. The file stays at 999 lines, one under the 1000-line cap for files without a ceiling: the import line, the two expressions, and three comment lines were rewritten in place.

## Verified

Headless Chromium against `http://localhost:5173/`, one fresh context each:

| Set-up | `(pointer: coarse)` | Camera glyph | Before this change |
|---|---|---|---|
| 1366 × 1024 with touch (an iPad in landscape) | true | shown | hidden, because the width is not a phone's |
| 1366 × 1024 with a mouse | false | hidden | hidden |
| 390 × 844 with touch (a phone) | true | shown | shown |
| 390 × 844 with a mouse (a narrow desktop window) | false | hidden | shown, because the width is a phone's |

**A live change is not seen in a browser.** A trackpad attached to a tablet mid-session was not walked. `input-modality.test.ts` covers it: fine to coarse, coarse to fine and back, and stopping.

## Tests

`apps/web/src/lib/input-modality.test.ts`, 5 tests:

1. it asks `(pointer: coarse)` and nothing else;
2. coarse at start follows to fine and back;
3. fine at start follows to coarse;
4. the stop function removes the listener;
5. with no `matchMedia`, it reads fine.

## Gates

| Gate | Before (after row 2j) | After |
|---|---|---|
| 1 phonology | 251 passed (251) | 251 passed (251) |
| 2 dictionary | 235 passed (235) | 235 passed (235) |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 1779 passed (1779) | **1784 passed (1784)**, +5 |
| 5 score-parser | 636 passed, 5 skipped (641) | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) | 145 passed (145) |
| 7 integration | 55 passed (55) | 55 passed (55) |
| 8 ratchets | OK | OK |

## Files

- New: `apps/web/src/lib/input-modality.ts`, `input-modality.test.ts`.
- Changed: `apps/web/src/lib/components/Drawer/IntakeCamera.svelte`, `IntakePanel.svelte`.
