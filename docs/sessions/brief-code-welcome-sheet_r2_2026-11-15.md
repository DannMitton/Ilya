# Brief to Code: the welcome sheet

r2, 2026-11-15 03:3x, from the desk (Fable 5.2). r2 is r1 (2026-11-15 01:4x, the desk on Opus) with the desk's own Fable review applied: seven amendments, listed in the last section. r1 had skipped the review as a DESK DEFAULT; `CONTRACT.md` section 1 item 19 does not allow that, so the review was done at this desk before the lane starts. Ruled by Dann 2026-11-15 01:30 (design and English) and 01:38 (French): `docs/memory/OPEN.md`, section "THE WELCOME SHEET, EN AND FR, RATIFIED". Read it in full first; its strings are the only strings this lane may use, character for character. The design's critique is `docs/sessions/welcome-sheet/critique-fable-welcome_r1.md`.

Lane: `cloud-lane-57` (DESK DEFAULT number), cut from `Shane` at the commit the desk names, after lanes 50 and 52 ship (each edits the key index of `i18n.ts`).

No git writes outside your lane. Gates before and after every step. Canadian spelling, the Oxford comma, no em dashes. NOT ESTABLISHED beats a complete invented answer.

## The reference

`docs/sessions/welcome-sheet/ilya-welcome-draft-17.html` (English) and `ilya-welcome-draft-17-fr.html` (French) are self-contained prototypes. Open them in Chrome. They are the visual and motion specification: layout, sizes, colours, the scrim, the head band, the shadow, the plate, the six images, the 30-degree wipe, its timing, the station labels, the footer. Reproduce them in the app with the app's own tokens (`app.css`), fonts (`static/fonts/`), and components. Where the prototype hard-codes a colour, use the token of the same value. The prototype's app behind the scrim and its "show the welcome again" button are draft scaffolding: do not build them.

## What to build

1. **`WelcomeSheet.svelte`** (a new component), shown over the app on a browser's first visit, before anything else is usable. A dialog: `role="dialog"`, `aria-modal`, labelled by its title, focus moved into it and trapped, Escape does nothing (the singer must choose Begin). Build it the way the app's existing sheets are built (the key signature card, the time signature card, the clef sheet): Step 0 names the one you follow. Before choosing a native `<dialog>`, read two sections of `docs/memory/ENVIRONMENT.md`, "`app.css:93` BREAKS NATIVE MODALS" and "`<dialog>`'s `close` EVENT DOES NOT FIRE IN THE IN-APP BROWSER PANE". The sheet stands over every other first-visit affordance (the install banner, the clef chip). It does not delay the dictionary's load or the service worker. It never prints (`@media print`).
2. **Once per browser.** A localStorage flag set when Begin is chosen, named `ilya:welcomeSeen` after the tree's own keys (`ilya:activeTab`, `ilya:language`, `ilya:notationPrefs`, `ilya:showStressDiacritics`). Wrap reads and writes in try and catch; if storage throws, show the sheet and do not crash. A returning browser never sees it.
   - **The browser tests start as a returning browser.** Every Playwright test opens a fresh browser, and `apps/web/playwright.config.ts` has no `globalSetup` and no `storageState` (read by the desk on the trial merge of lanes 50 and 52; 34 files in `e2e/`, 15 in `e2e-phone/`). Without a change, the sheet stands in front of every one of them. So: one shared setup for both projects sets the flag before the app loads (the config's `use.storageState`, or an init script in `e2e/helpers.ts`; Step 0 says which fits), and only the sheet's own tests clear it. Say in the report how many existing tests were touched; the aim is none.
3. **Language.** The sheet follows the app's current language. Its head-band pill switches the app's language exactly as the app's own Français and English pill does (reuse it; do not write a second language control).
4. **Strings** into `i18n.ts` under a new `welcome.` prefix, English and French from OPEN.md, with a test that pins every pair. The hand-written key index at the head of `i18n.ts` gains the `welcome.` row (its count and the component's path) and the new total; `src/lib/i18n-index.test.ts` fails otherwise. The station labels reuse `tab.text`, `tab.markedScore`, and `tab.insights`; Begin reuses the existing « Commencer » key if one with English "Begin" exists, otherwise a new `welcome.begin` (report which).
5. **The plate,** drawn in code: я in Source Serif 4 Bold; [ɑ] in Lato IPA; the eighth note on a staff in Bravura (glyph U+E1D7, centred by its bounding box from `bravura_metadata.json`); the [ɑ] zone; the vowel space from `computeZones({}, 'bass')` and the chart's own geometry (`voice/chart/zones.ts`, `geometry.ts`, `colours.ts`), not hard-coded numbers; the Илья icon: five equal stripes in the jewel colours of TEXT, MELODY, INSIGHTS, LEARN, GUIDE (sage, lavender, rose, slate, cobalt), Илья in Source Serif 4 Bold, cream. Contents in `--ink-stave`.
6. **Motion** as in the prototype: once, about 5.5 s, top-to-bottom 30-degree wipes; all text readable from the first frame; Begin usable from the first frame; `prefers-reduced-motion` shows the final state with no motion. Screen readers get the text, not the images (the plate is `role="img"` labelled Илья).
7. **Phone (390 px):** as the prototype's narrow layout; Begin full width in the fixed footer, never scrolled away.

Not in this lane: a control to reopen the sheet (it needs a string Dann has not ratified), the app icon files (the home-screen icon is a separate item).

## Steps

0. Read and report: the gates; where the app mounts its first screen (`routes/+page.svelte`); the language control; the existing keys in item 4; the ratchet line for every file you will touch; which existing sheet you follow for the dialog; how the browser tests will be given the flag. Confirm that the prototype needs no image file: the desk found six embedded fonts and no `<img>` in `ilya-welcome-draft-17.html` (692,274 of its 938,433 bytes are fonts), so every picture is drawn in code. Confirm that each of those fonts is already in `static/fonts/`. If anything new must go into `static/`, stop and report its byte count before adding it (`CONTRACT.md` section 8). Change nothing.
1. The component and its strings, with tests (the pins; the flag; storage throwing; reduced motion). Pictures at 1280 x 800 and 390 x 844, English and French, final state and one mid-wipe frame. Look at every picture.
2. Close: merge `Shane`, all eight gates, the Playwright suite (desktop and phone), and one report, `docs/sessions/report-code-welcome-sheet_r1_<date>.md`, with the pictures in `docs/sessions/report-code-welcome-sheet-pictures/`.

## Could not establish

- Whether an existing key holds "Begin".
- Whether the app's first render can mount a dialog before its dictionary finishes loading (Step 0 says how the first screen mounts).

## What r2 changed (the desk's Fable review of r1, 2026-11-15)

1. The browser tests are given the flag by one shared setup; without it the sheet blocks all 49 test files (item 2).
2. The flag's name follows the tree's `ilya:` keys (item 2).
3. The dialog follows an existing sheet, and two traps in `ENVIRONMENT.md` are named (item 1).
4. The key index of `i18n.ts` gains the `welcome.` row (item 4).
5. The sheet never prints, stands over the other first-visit affordances, and does not delay the dictionary (item 1).
6. Step 0 confirms that no image file and no new font is needed, and reports any byte count before `static/` grows (Step 0).
7. The lane and its base are named (the head).
