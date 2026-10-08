# Brief for Code: the wait for the reader, shown on the Paper (r1, 2026-10-07)

Written by the desk (Opus) 2026-10-07 about 20:30. Model: Sonnet. For Code on the Mac. QUEUE row 41.

## What the singer sees, does, and feels

A singer drops a scanned score, or reopens a song saved by an older reader version. Today the only sign that Ilya is working is a small spinner and "Reading the page…" in the drawer, out of the singer's line of sight. Dann, 2026-10-07 20:09: *"this is too discrete."* The singer looks at a blank sheet and cannot tell whether anything is happening.

After this brief: a squircle floats above the Paper, centred horizontally and vertically on the visible sheet, on whichever tab is open (Text, Markup, or Insights). It says **"Reading your score · page 2 of 3"**. Under that line, a five-line staff fills from left to right, one page at a time. Under the staff, in small italics: **"Ilya reads each score once and keeps the reading."** The squircle takes the tab's own colour, so it reads as part of the page the singer is on. When the last page is done, the staff completes, holds a moment, and the squircle fades away. The singer feels told, calmly, how long this will take and that it happens once.

Drawings: `drawing-wait-on-paper_r3_2026-10-07.png` (the ruled layout); `drawing-wait-on-paper_r2_2026-10-07.png` shows the bottom position used by the Text tuck (item 6). Both are in `docs/sessions/`.

## Ruled by Dann, 2026-10-07 20:09 to 20:24

Who offered what: the floating squircle in each tab's colour, centred vertically, and the staff as the progress bar are Dann's. The desk offered the tints, the one-second delay, the fade, the Text tuck, and the screen-reader line; Dann asked for a critique and accepted (20:20, *"I think this is arresting and still aligns with Calm Authority"*). The strings are the desk's, ratified by Dann at 20:24.

1. **It floats above the Paper and never prints.** It is a layer like the Loupe (`CONTRACT.md` section 6, the ruling of 2026-09-28: no control is part of the printed page). It does not change the Paper's layout.
2. **The same squircle on all three tabs**, centred horizontally and vertically on the visible part of the sheet, staying centred as the singer scrolls.
3. **Colour by tab:** fill with the tab's desk tint and draw the words and the staff in its label ink. Text: `--sage-desk` and `--sage-ink`. Markup: `--lavender-desk` and `--lavender-ink`. Insights: `--rose-desk` and `--rose-ink` (`app.css:148-150`, `:183-185`; tab-to-family mapping at `app.css:181-182`). No new colour values.
4. **Shape and lift:** take the Loupe card's own corner radius and shadow from wherever they are defined. Do not invent new ones. If the Loupe has no named token for them, name one and use it in both places.
5. **The staff is the progress bar.** Five lines, the filled part in the label ink and the rest the same ink at low opacity. It fills by pages done over pages, from the reader's own progress: `readScan`'s `onProgress` already carries `page`, `pages`, `stage`, `done`, `total` (`apps/web/src/lib/omr/homr-reader.ts:159`, passed through `scan.ts:30` and `:46`). Before the first page starts (models still loading), the line says the preparing text (item 8) and the staff is empty. Within a page, `done/total` may advance the fill smoothly if it is monotonic; never let the fill go backwards (the reader's second pass on WebAssembly, `homr-reader.ts:213`, restarts pages: hold the fill, do not rewind).
6. **On Text, a tap tucks it** to the bottom centre of the visible sheet (r2's position), because Text is the tab where the singer can work during the wait. A second tap brings it back to the centre. On Markup and Insights a tap does nothing.
7. **Never flash.** Show it only when the read is still going one second after it started. A kept reading reopens in about 0.4 s (QUEUE row 38), and must show nothing.
8. **Leave quietly.** On success: staff complete, hold about 600 ms, fade about 300 ms. On a failure or the poem route, it goes at once and the existing message takes over. Respect `prefers-reduced-motion` (no fade, no smooth fill).
9. **Screen readers:** one polite live region that announces the line when the page number changes, not on every stage.
10. **Phone (390 px):** it fits inside the Paper's side margins; the lines may wrap; tap targets for the Text tuck are at least 44 px.
11. **The drawer keeps a one-line echo** of the same line, so the drawer and the Paper never disagree.

## The strings, ratified by Dann 2026-10-07 20:24

| key (Code names them; suggested) | English | French |
|---|---|---|
| `wait.reading` | Reading your score · page {page} of {pages} | Lecture de votre partition · page {page} sur {pages} |
| `wait.once` | Ilya reads each score once and keeps the reading. | Ilya ne lit chaque partition qu’une fois et en garde la lecture. |

Use the typographic apostrophe in the French, as the rest of `i18n.ts` does (`’`). The preparing state reuses `upload.status.preparingReader` as it stands. No other new text. If the build needs a string not listed here, stop that part and report; write no French.

## Fold in N.167: the line must follow the language

`ScoreUploader.svelte:286` and `:793` store `label: T(key)`, so the text is fixed in whatever language was active when the wait began (N.167, `OPEN.md`). Store the key and the numbers, and translate at render, so a French singer never reads English for the whole wait. Add a test that switches language mid-wait.

## Tests and gates

- Unit tests: the fill from `onProgress` (including a second pass that restarts pages, which must not rewind); the one-second delay (a read finished in 0.4 s shows nothing); language switch mid-wait; the tab-to-colour mapping.
- One browser check per tab at 1440 x 900 and 390 x 844 with a real PDF (the Tchaikovsky PDF), screenshots into the report. Also screenshot the Text tuck.
- All eight gates. Name any number that moves and the tests that move it. Gate 4 baseline `1939`.

## Report

`docs/sessions/report-code-wait-on-the-paper_r1_2026-10-07.md`: what changed with `path:line`, each gate, the screenshots, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. WRITTEN is not DONE: DONE is Dann's look on the alias.

No git writes of any kind. Dann ships.
