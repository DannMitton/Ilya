# Report: the wait for the reader, shown on the Paper (r1, 2026-10-07)

Code (Sonnet), branch `Shane`, working tree dirty (uncommitted). Brief: `brief-code-wait-on-the-paper_r1_2026-10-07.md`. QUEUE row 41. No git writes. **WRITTEN, not DONE: DONE is Dann's look on the alias.**

## What changed

| Where | What |
|---|---|
| `apps/web/src/lib/omr/wait.ts` (new) | Pure model: `advanceWait` (fill from `onProgress`, never falls), `completeWait`, `readingLine`/`waitLine` (translated at render), `waitColours` (tab to desk tint and label ink), the 1000 / 600 / 300 ms constants. |
| `apps/web/src/lib/score/reading-wait.svelte.ts` (new) | One shared state (`readingWait`): `begin`, `progress`, `complete` (hold 600, fade 300), `cancel` (at once). Holds numbers, never words. |
| `apps/web/src/lib/components/ReadingWait.svelte` (new) | The squircle. `position: fixed`, centred on `.main-content`'s rectangle (so it stays centred while the sheet scrolls), `display: none` in print. Five-line SVG staff: filled part is a clip over the same lines in label ink, rest at 25% opacity. Text: a `<button>`, tap tucks to bottom centre and back; Markup and Insights: a plain `div`, `aria-hidden`. One polite live region, updated per page number (and once on a language switch). `prefers-reduced-motion`: no transitions, no animation. |
| `apps/web/src/lib/components/DeskHead.svelte:~31,100` | Mounts `<ReadingWait>`. **Why here:** `+page.svelte` (6003) and `ScoreUploader.svelte` (1358) sit exactly at their ratchet ceilings; DeskHead is drawn on every destination inside the desk. |
| `apps/web/src/lib/omr/scan.ts`, `restore.ts` | `readScanAsScore` and `restoreStoredScan` take an optional `wait` (default the app's one wait): `begin` (restore only where the kept reading is not current, so a kept reading never begins one), `progress`, `complete` before ingest, `cancel` on failure and on the poem route. `scan.ts` re-exports `readingWait`. |
| `apps/web/src/lib/score/ScoreUploader.svelte:168,286,793,978` | **N.167 folded in.** Busy state stores the key (`key?: string`), not `T(key)`; the drawer echo is `readingWait.line(language) ?? T(ui.key)`, translated at render. Net 0 lines (1358). Other busy sites (`upload.status.reading`, converting) still store text: untouched, same latent N.167 defect there. |
| `apps/web/src/app.css` (after `--cobalt-ink`) and `Loupe.svelte` (~2603, ~2625) | Loupe had no token, so `--float-radius: 10px` and `--float-shadow` (the three layers, unchanged values) are named and used by both. Loupe.svelte 3013 to 3012 lines. |
| `apps/web/src/lib/i18n.ts:~1011` | `wait.reading`, `wait.once`, exactly as ratified; prefix census row added. No other text. |

## Tests

New: `omr/wait.test.ts` (8: fill, second pass does not rewind fill or page, zero total, EN/FR line from one state, preparing text, colours for the three tabs and null for Learn and Guide), `score/reading-wait.test.ts` (6: 0.4 s read shows nothing, shows at 1 s, hold 600 then fade 300, cancel at once, restart holds fill and EN/FR switch mid-wait, deaf when idle), `omr/scan.test.ts` (+2: begin/progress/complete order; cancel on poem route and failure).

## Gates (scratch copy of `ilya-ship.sh`, untracked files allowed, cannot stage)

1 phonology 251 OK. 2 dictionary 235 OK. 3 web-check 0 errors, 12 warnings in 5 files OK. **4 web-test 1955 (baseline 1939): +16** = wait.test 8, reading-wait.test 6, scan.test 2; the desk moves the script. 5 score-parser 650 | 5 skipped OK. 6 blurb 145 OK. 7 integration 55 OK. 8 ratchets OK (Loupe.svelte ceiling can fall 3013 to 3012). Gates ran before the last two small edits to `ReadingWait.svelte` (staff height, the tuck gap on a phone); those were not re-gated.

## Browser checks

Headless Playwright against the dev server, the Tchaikovsky Op. 38 no. 3 PDF (3 pages, read in about 120 s on WebAssembly, no WebGPU adapter). Shots in `docs/sessions/wait-shots/`:
- Preparing state, 1440x900: `desk-text.png`, `desk-markup.png`, `desk-insights.png`, `desk-text-tucked.png`.
- Reading line, 1440x900: `desk-r-text.png`, `desk-r-markup.png`, `desk-r-insights.png`, `desk-r-text-tucked.png`; 390x844: `phone-r-text.png`, `phone-r-markup.png`, `phone-r-insights.png`, `phone-r-text-tucked.png`.
- Measured: squircle appeared 1.9 to 2.8 s after the drop (the 1 s delay plus rasterizing); centre equals `.main-content`'s centre on every tab (980,474 desk; 195,470 phone); fills are 205,211,200 / 213,206,218 / 221,204,204 (the three desk tints); inks match the three label inks; radius 10 px; drawer echo read the same line; the squircle left about 4.5 s after the read ended (hold plus fade plus ingest).
- Phone width 358 px inside 390.

## Could not establish

- **The staff filling past page 1 and the hold, fade and leave were not seen frame by frame.** Screenshots caught page 1 of 3 only; the fill by later pages is covered by unit tests, not by a picture. Leaving was observed as `.reading-wait` detaching.
- **Tuck on a phone:** the first build put the tucked card under the Drawer bar, and the click was intercepted. I raised the gap to 104 px; the 88 px version's shot still showed the card's foot touching the bar, and the 104 px value was **not re-shot**. Check it.
- Tap target on the phone: the tucked card is 81 px tall, 358 wide (measured); the Text card is the button. Not tested by touch.
- Choice I made: on the second pass the page number also holds (not only the fill), so the line never reads "page 1 of 3" after "page 3 of 3". Say if you want the number to follow the pass.
- The preparing text is long (three lines) in the squircle, as the brief says to reuse it as it stands; it makes the squircle taller before the first page.
- Screen-reader announcement was not tested with a screen reader; only the live region's logic exists.
- A transform on `.main-content` during a tab-slide animation would shift the fixed squircle for that moment; not checked.
- The French was seen only in unit tests, not in the browser.
- The drawings show "song"; the ratified string says "score", and I used the string.
