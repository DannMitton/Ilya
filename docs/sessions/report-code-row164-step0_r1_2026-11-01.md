# Report: row 164, step 0, the Loupe as built (r1, 2026-11-01)

Branch `mac-row164`, a worktree at `~/Desktop/ilya-rewrite-row164` cut from `Shane` at `6f740dbf`. Working tree clean at start. Step 0 changes no code: the commit holds this report, the harness, and two screenshots.

## Baselines before step 1 (all eight match the prompt)

| Gate | Result |
|---|---|
| phonology | 291 passed (291) |
| dictionary | 248 passed (248) |
| web check | found 0 errors and 12 warnings in 5 files |
| web test | 3784 passed, 1 skipped (3785) |
| score-parser | 785 passed, 5 skipped (790) |
| blurb | 145 passed (145) |
| integration | 55 passed (55) |
| `pnpm ratchets` | ratchets: OK. |

Ratchet counts at start: `Loupe.svelte` 3012 of 3013, `+page.svelte` 5586 of 5586 (`scripts/ratchets.json:8,11`).

## Screenshots (MELODY, song 1, bar 2; the tab is still named Markup in this tree)

Song 1 is `sunless-01-engraved.musicxml`, bar 2 raised by clicking the first entry of m. 2, after the `[Ilya] N.160 seats:` line and 5 s. The "Voice line as written" prompt appears on a fresh load; the harness answers **As written** first.

- `docs/sessions/measure-loupe-header-r164_2026-11-01/before-desktop-1400.png` (1400 by 900)
- `docs/sessions/measure-loupe-header-r164_2026-11-01/before-phone-390.png` (390 by 844, touch, 2x)

Measured with Playwright, not read from CSS: desktop Loupe 693.5 by 288.5 px, bar 31.6 px tall (one row). Phone Loupe 299.25 by 279.6 px, bar 90 px tall (two rows: the pill and the chevron, then the zoom). Undo and Redo draw nothing at this point because both stacks are empty (`stackActions`, `bandState.ts`).

The harness is `raise.mjs` and `shoot-before.mjs` in `docs/sessions/measure-loupe-header-r164_2026-11-01/`; it needs `vite dev` on 5173 in the worktree.

## Citations re-read on this tree (`6f740dbf`)

- Card markup `Loupe.svelte:2289-2574`; the bar `:2496-2557`; Undo and Redo markup `:2528-2533`; the chevron `:2534-2555`.
- Bar CSS `:2720-2726`; the phone's two-row rules `:2777-2809`; flush right `:2811-2817`; the 44 px floor `:2921-2932`; print `:3007-3011`.
- `panelRoom` `:2233-2237`; `anchorTop` `:2226-2231`; `CARD_FURNITURE` `:2219` (10 above, 12 below, border twice); the card's inline style `:2292`; `frame.left` `:1936-1939`.
- Swipe: `+page.svelte:1404-1441`, gated on `isPhone` at `:1436`; the comment to shorten is `:1431-1434`. `Loupe` is mounted at `:4572`, `onundo` at `:4600`. `dismissLoupe` is also Escape's (`:939`), the Corrections panel's `ondismiss` (`:4536`), and the 56 px swipe (`loupe.ts:205-207`).
- Band recipe: `Drawer.svelte:1037-1070` and `:1118-1120`, which row 165 already sends to `var(--lavender-head)` with `var(--lavender-ink)` text. Both tokens exist in `app.css:50,53`. No token is added by this row.
- Review's "ESTABLISHED, not drifted": every line the review cites is within a few lines of where it said.

## The chevron (brief item 4, review amendment 5): ESTABLISHED

It is the Syllables or Corrections panel's disclosure (`aria-expanded={syllablesOpen}`, `aria-controls="loupe-panel"`, `onclick={ontogglesyllables}`, `Loupe.svelte:2534-2541`; the page passes `loupePanel.toggle`). It does not close the Loupe. It stays flush right in the bottom bar. After step 1 the bar holds the pill, the zoom, and the chevron.

## Decisions I am carrying into step 1

1. **Capitals.** `interface-text.md` (ratified tonight) §3 says the value carries the capitals and CSS is never the only source, which supersedes review amendment 3's "stored as Loupe, uppercased by CSS". So `loupe.title` is `LOUPE` in English and `LOUPE` in French (a place, capitals, feminine). Screen-reader text stays ordinary case: the buttons' `aria-label`s say "Loupe" in words (§3 last bullet).
2. **Header inside `.loupe-top`.** The header is the first child of `.loupe-top`, so the measured fixed part (`topH`) includes it and `centreOnPage` still centres the fixed part. The card's own 10 px top padding goes (the header bleeds to the border), so `CARD_FURNITURE` loses 10 px.
3. **Ratchet.** The header, its styles, and the drag live in a new `LoupeHeader.svelte`; clamp maths are pure functions in `loupe.ts` with tests. `Loupe.svelte` must end at or under 3013 and `+page.svelte` at or under 5586.
