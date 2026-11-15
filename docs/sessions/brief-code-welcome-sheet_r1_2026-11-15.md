# Brief to Code: the welcome sheet

r1, 2026-11-15 01:4x, from the desk (Opus). Ruled by Dann 2026-11-15 01:30 (design and English) and 01:38 (French): `docs/memory/OPEN.md`, last section, "THE WELCOME SHEET, EN AND FR, RATIFIED". Read it in full first; its strings are the only strings this lane may use, character for character. DESK DEFAULT: no Fable review of this brief, because the design is Fable's own (its critique is `docs/sessions/welcome-sheet/critique-fable-welcome_r1.md`) and every string is ratified.

No git writes outside your lane. Gates before and after every step. Canadian spelling, the Oxford comma, no em dashes. NOT ESTABLISHED beats a complete invented answer.

## The reference

`docs/sessions/welcome-sheet/ilya-welcome-draft-17.html` (English) and `ilya-welcome-draft-17-fr.html` (French) are self-contained prototypes. Open them in Chrome. They are the visual and motion specification: layout, sizes, colours, the scrim, the head band, the shadow, the plate, the six images, the 30-degree wipe, its timing, the station labels, the footer. Reproduce them in the app with the app's own tokens (`app.css`), fonts (`static/fonts/`), and components. Where the prototype hard-codes a colour, use the token of the same value. The prototype's app behind the scrim and its "show the welcome again" button are draft scaffolding: do not build them.

## What to build

1. **`WelcomeSheet.svelte`** (a new component), shown over the app on a browser's first visit, before anything else is usable. A dialog: `role="dialog"`, `aria-modal`, labelled by its title, focus moved into it and trapped, Escape does nothing (the singer must choose Begin).
2. **Once per browser.** A localStorage flag set when Begin is chosen. Wrap reads and writes in try and catch; if storage throws, show the sheet and do not crash. A returning browser never sees it.
3. **Language.** The sheet follows the app's current language. Its head-band pill switches the app's language exactly as the app's own Français and English pill does (reuse it; do not write a second language control).
4. **Strings** into `i18n.ts` under a new `welcome.` prefix, English and French from OPEN.md, with a test that pins every pair. The station labels reuse `tab.text`, `tab.markedScore`, and `tab.insights`; Begin reuses the existing « Commencer » key if one with English "Begin" exists, otherwise a new `welcome.begin` (report which).
5. **The plate,** drawn in code: я in Source Serif 4 Bold; [ɑ] in Lato IPA; the eighth note on a staff in Bravura (glyph U+E1D7, centred by its bounding box from `bravura_metadata.json`); the [ɑ] zone; the vowel space from `computeZones({}, 'bass')` and the chart's own geometry (`voice/chart/zones.ts`, `geometry.ts`, `colours.ts`), not hard-coded numbers; the Илья icon: five equal stripes in the jewel colours of TEXT, MELODY, INSIGHTS, LEARN, GUIDE (sage, lavender, rose, slate, cobalt), Илья in Source Serif 4 Bold, cream. Contents in `--ink-stave`.
6. **Motion** as in the prototype: once, about 5.5 s, top-to-bottom 30-degree wipes; all text readable from the first frame; Begin usable from the first frame; `prefers-reduced-motion` shows the final state with no motion. Screen readers get the text, not the images (the plate is `role="img"` labelled Илья).
7. **Phone (390 px):** as the prototype's narrow layout; Begin full width in the fixed footer, never scrolled away.

Not in this lane: a control to reopen the sheet (it needs a string Dann has not ratified), the app icon files (the home-screen icon is a separate item).

## Steps

0. Read and report: the gates; where the app mounts its first screen (`routes/+page.svelte`); the language control; the existing keys in item 4; the ratchet line for every file you will touch. Change nothing.
1. The component and its strings, with tests (the pins; the flag; storage throwing; reduced motion). Pictures at 1280 x 800 and 390 x 844, English and French, final state and one mid-wipe frame. Look at every picture.
2. Close: merge `Shane`, all eight gates, the Playwright suite (desktop and phone), and one report, `docs/sessions/report-code-welcome-sheet_r1_<date>.md`, with the pictures in `docs/sessions/report-code-welcome-sheet-pictures/`.

## Could not establish

- Whether an existing key holds "Begin".
- Whether the app's first render can mount a dialog before its dictionary finishes loading (Step 0 says how the first screen mounts).
