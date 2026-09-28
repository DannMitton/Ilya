# Desk check of the calm loupe, slices 1 to 5

**2026-09-28, the desk, in its cloud clone.** Patch `calm-loupe-s5.patch` applied to `9ebfdc0`; `+page.svelte` and `Loupe.svelte` md5-match Dann's tree (`feb5b44f…`, `06a2f73b…`).

## Gates, re-run by the desk

- `pnpm test` in `apps/web`: 87 files, 1,608 tests passed.
- `pnpm check`: 0 errors, 12 warnings.
- `pnpm ratchets`: OK, 315 source files.

## Screenshot compare (84 captures, which never raise the loupe)

The page outside the loupe is unchanged. The only differences were Learn's top capture, which is a flake in both states. I captured it twice on each side: blank once and loaded once, in both the baseline and the slice (stddev 14.1 against 39.8). Once loaded, the two sides match except for the known pixel (1423, 24).

## The desk's own walk (Playwright, desk project, viewport 1,630 × 1,000, `Sunless 04 - Be bored.musx`)

The file loads in treble clef here. Dann's library copy shows bass clef, so his stored song differs from the raw file.

- **Panel closed:** the card held at x 792.8, width 564.4, height 340.8 over four arrow stops within the measure. It changed only when the cursor crossed into the next measure. The window held at 225.2 px tall with no horizontal overflow (scrollWidth equals clientWidth).
- **Barline:** the closing barline and its tail are drawn, and nothing from the neighbouring measures (screenshots `01`, `03`).
- **Carets:** drawn in Corrections and absent with the panel closed.
- **Pill:** a second click on the filled pill closes the panel (panel height 0).

## A defect found by the desk: the arrow keys after a click on a mode pill

**This is what Dann saw on 2026-09-28 01:23** (*"Arrow right exits us out of Corrections and seems to pull up Syllables"*).

Measured: click `#loupe-mode-corrections`, then press ArrowRight.
- Focus stays on the pill (`document.activeElement` is `loupe-mode-corrections`).
- One press switches the tab to Syllables (`aria-selected` flips) and also moves the cursor.
- The next press switches back to Corrections and moves the cursor again (readout `F♯4 · Eighth · соз`, then none, then `after да`).

Both handlers act on one key:
- the tablist's own `handleModeKeydown` (`Loupe.svelte`, the roving-tab handler for the two pills);
- the page's correction-key handler.

**DESK DEFAULT, the fix, under Dann's delegation of 2026-09-28 01:36:**
1. A pointer click on a pill hands focus back to the loupe, so the arrow keys drive the cursor.
2. When a keyboard user has tabbed onto the pills, the arrows move between the two tabs, as the WAI-ARIA tabs pattern expects, and the page's handler ignores any key whose target is inside the tablist.

## Code's open items, and what the desk decided

- **Stepping left onto a measure's first caret switches the loupe to the previous measure.** Correction Station work, as Code says. Queued with slices 4 to 6.
- **Size per song and the zoom.** Held until Dann's walk. The spacing fix alone brought this song to 24 of 27 measures fitting at 1,630 px. The walk decides whether the notation still reads as too large. The French labels « Réduire le zoom » and « Agrandir le zoom » wait for that walk and for Dann's ruling.
