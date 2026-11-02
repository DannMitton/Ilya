# Report: row 164, step 1, the header and the moved controls (r1, 2026-11-01)

Branch `mac-row164`, from `Shane` `6f740dbf`; step 0 is `738fcae5`. Nothing pushed, no pull request.

## What was built

- **`LoupeHeader.svelte`** (new, `apps/web/src/lib/score/`): a lavender band, first child of `.loupe-top`. `background: var(--lavender-head)`, `color: var(--lavender-ink)`, 0.7 rem, 600, 0.12 em, uppercase, the drawer's `.group-band` recipe (`Drawer.svelte:1037-1070`, `:1118-1120`). LOUPE flush left; Undo, Redo, and Close flush right. No hex. The tokens already exist from row 165 (`app.css:50,53`), so none was added.
- **Heights.** 40 px on the desk (measured 40), 44 px on a phone (measured 44); on a phone each button is at least 44 by 44 (measured Undo 66 by 44, Close 54 by 44).
- **Undo and Redo** reuse `stackActions` and the same `aria-label` sentences ("Undo: dotted"); an empty stack draws nothing; hotkeys untouched. They are gone from the bottom bar (the e2e asserts it).
- **Close** is a new prop `onclose` on `Loupe`, passed `dismissLoupe` at `+page.svelte` beside `onundo`. It is the same function Escape, the Corrections panel's Done, and the phone swipe already call: no second close path.
- **The card** lost its 10 px top padding so the band bleeds to the border and carries the border's inner radius on top; `CARD_FURNITURE` went from `10 + 12 + 2.8` to `12 + 2.8`, so `centreOnPage` still centres the measured fixed part (`topH` includes the header).
- **The line "m. 2 · system 1 of 7" and the note line** are unchanged, under the header.
- **The bottom bar** keeps the pill, the zoom, and the chevron.

## The chevron: ESTABLISHED

The chevron opens and shuts the Syllables or Corrections panel (`aria-expanded`, `aria-controls="loupe-panel"`, `onclick={ontogglesyllables}`). It stays flush right in the bar.

## One row at 390 px: NOT ACHIEVED

The bar is still two rows on a phone (90 px, measured). The pill is 181 px; the zoom is 2 by 44; the chevron is 44; the row is 277 px. They need about 313 px with the 8 px gaps, so the zoom stays on the second row. Fitting one row would need the pill under about 129 px (its two labels alone are about 136 px at the present type) or the zoom or chevron under the 44 px floor. Neither is mine to choose. I left the two-row rules and corrected their comment. Dann's call: a smaller pill label on a phone, a zoom smaller than 44, or two rows as today.

## Deviations from the amendments, and why

1. **Capitals (amendment 3 superseded).** Amendment 3 stores "Loupe" and uppercases by CSS. `docs/house-style/interface-text.md` §3 (ratified 22:35 tonight) says the value carries the capitals. So `loupe.title` is `LOUPE`; the CSS also uppercases, but it is not the only source. The ordinary case stays in the `aria-label`s (Undo's sentence, and in step 3 "Move the Loupe to the top").
2. **Focus ring (amendment 2 says follow the band's).** The band's ring is `var(--lavender)`; on `--lavender-head` that is under 3:1, so the header's buttons draw `var(--lavender-ink)` instead, inset 2 px. Hover underlines, as `.loupe-action` does. If Dann wants the band's lavender, it is one line in `LoupeHeader.svelte`.

## New strings, French held

`apps/web/src/lib/i18n.ts`, beside `loupe.zoomIn`, each French value the English with `// TODO-FR`:

| key | English | French in the tree | draft for Dann |
|---|---|---|---|
| `loupe.title` | LOUPE | LOUPE // TODO-FR | « LOUPE » (the key's French is the same word) |
| `loupe.close` | Close | Close // TODO-FR | « Fermer » (the tree uses it once, `i18n.ts` `calib.capture.toastDismissAria`) |

## Print

`@media print { .loupe { display: none !important } }` covers the header. Checked with `emulateMedia('print')` in Playwright (`print-check.mjs`): `.loupe` display is `none`, header not visible. A pass in Chrome's own print preview on MELODY was not done.

## Ratchets

| file | ceiling | before | after |
|---|---|---|---|
| `Loupe.svelte` | 3013 | 3012 | 3008 |
| `+page.svelte` | 5586 | 5586 | 5585 |
| `LoupeHeader.svelte` (new) | 1000 | none | 120 |

No ceiling raised or lowered.

## Gates

| Gate | Result |
|---|---|
| web check | found 0 errors and 12 warnings in 5 files |
| web test | 3784 passed, 1 skipped (3785) |
| `pnpm ratchets` | ratchets: OK. |
| e2e `loupe-header.test.ts` (new, 2) and `loupe-head-caret.test.ts` (2) | 4 passed |

The other packages are untouched by this step and were not re-run; step 3's report runs all eight.

## Screenshots

In `docs/sessions/measure-loupe-header-r164_2026-11-01/`: `step1-desktop-1400-shut.png`, `step1-desktop-1400-open.png`, `step1-phone-390-shut.png`, `step1-phone-390-open.png` (the panel open is Corrections, after a dot was entered so Undo shows). Top and bottom come in step 3.

## Not established

- Undo and Redo both showing at once on a phone was not screenshotted (the stack after one undo shows Redo; measured widths leave room: 66 + 66 + 54 + title and padding is under 297).
- The French drafts above are my suggestions, not rulings.
