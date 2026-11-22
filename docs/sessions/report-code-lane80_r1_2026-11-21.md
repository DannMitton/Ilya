# Report, lane 80 (QUEUE row 202): one frame for the content of TEXT, MELODY, and INSIGHTS

r1, 2026-11-21, by the Code lane. Brief: `brief-code-lane80-one-frame-for-content_r2_2026-11-21.md`. Branch `cloud-lane-80`, cut from `origin/Shane` at `18db8ec5` after `git fetch origin`. The working tree carried two uncommitted files (`docs/memory/QUEUE.md`, `STATE.md`) which I did not write and do not commit.

Brief note: the message said "both addenda"; the file holds **one** addendum (four items, "on Dann's instruction", 22:3x). NOT ESTABLISHED whether a second exists elsewhere.

Instrument for everything below: `report-code-lane80_r1_2026-11-21/measure.mjs` (Playwright, Chromium, 1440 px viewport, so the sheet is 816 px at scale 1), readings in `before-1440.json` (taken on the tree at `18db8ec5`, before any edit), summarised by `summarize.py`. Voice: a bass called "Voice 1"; no fixture carries Dann's name. The dev server on :5173 was the maintainer's own, serving this tree.

## 1. Step 0, the five numbers

1. **`.running-header` offsetHeight: 25** (every later page, all three documents). The CSS arithmetic said 24.6, `page-config.ts` says 29 (2026-08-15). The browser says 25. The 29 is stale (`HEADER_HEIGHTS_AT_LETTER.subsequent`). The title header is 105 (TEXT, blank-state INSIGHTS), 127 (INSIGHTS with a score), 154 (MELODY page 1, with its key line and legend); `HEADER_HEIGHTS_AT_LETTER.title` says 127.
2. **`.page-footer` offsetHeight: 66 with no band** (every plain page, all three documents, both languages), **90 with a one-row legend** (TEXT, Tchaikovsky pages 1 and 2: band 32), **109 with the Richter credit and a legend** (band 32, credit four lines). MELODY and INSIGHTS pages here all measure 66 (their bands are empty on these fixtures: the broad note did not draw).
3. **The divider's distance from the sheet's bottom edge: 114 on every page of every document and both languages, except the Richter page, 133.** `.footer-content` is 57 high (three credit lines) and 76 with Richter (four). A two-digit page count (40 pages, both languages) does **not** move it (114): the label widens from 56 to 61.4 (one digit, EN) to 66.9 (two digits, EN), and 62.3 to 67.8 / 73.2 in French, and never changes the credit's line count. English and French agree. So by measurement the only thing that moves the divider is the Richter credit; the brief's other two mechanisms (language, label width) do not on any case I could reach.
4. **TEXT's first glyph: left 96 on page 1 and on every later page** (Range over the first text node of the first `.cyrillic-row`, sheet px). The window box (`.page-content`) is at 88, so the brief's arithmetic (88 + 4 + 4) is confirmed. MELODY's `.score-window` and INSIGHTS' `.column` are at 96.
5. **`.header-aside` clientWidth on INSIGHTS: 80 and 79 (Sunless, EN, FR), 74 and 70 (Tchaikovsky, EN, FR). `html` font-size: 16px.**

## 2. Step 0, the control (1440 px; page count, then first and last item per page)

TEXT, first and last line index per page; MELODY, first and last system's bar range; INSIGHTS, the page's `.part` count and the first and last block's opening words (full table: `before-1440.json`).

| Fixture | TEXT | MELODY | INSIGHTS |
|---|---|---|---|
| Sunless | 1 page, lines 0 to 9 | 2 pages: 0-2 .. 10-11 (5 systems), 12-13 .. 17-17 (3) | EN 3 pages, FR 4 |
| Tchaikovsky | 3 pages: 0-8, 9-18, 19-19 | 3 pages: 0-8 .. 32-39 (5), 40-46 .. 74-80 (6), 81-87 .. 96-98 (3) | EN 6 pages, FR 6 |

- **Neither fixture contains a Latin word.** Sunless gives **one** TEXT page, Tchaikovsky three, so page 2 comparisons in TEXT use Tchaikovsky.
- The Richter case is a typed text: "sanguis atque caulis" plus two Russian lines. Its footer is 109, hairline 133.
- A forty-page TEXT (160 typed lines) was used for the two-digit page label.
- Closed disclosures on Tchaikovsky INSIGHTS (EN): "Show keys that reach higher" ends at y 554 on page 1, "3 more observations" at y 376 on page 3.

## 3. Step 0, the numbers today (so commit A has something to match)

- TEXT window: top 169 (page 1, header 105) or 191 (header 127), 89 later; bottom 920 (footer reserve floored at 80), 910 with a 90 footer; box left 88.
- MELODY: top 220 (header 154 + 18), later pages 93 (37 + 8 + 48), bottom 920, left 96.
- INSIGHTS: `.column` top 191 (127 + 16), later pages 89 (25 + 16 + 48), left 96. No bottom: the column is as tall as its blocks.
- So the three documents' later pages begin at 89, 93, 89 today, and page 1 under the rule at 16, 18, 16.

## 4. Citations that moved (brief cites `e0ca61bf`; tree is `18db8ec5`)

Lane 79 merged. `page-config.ts` now has `BlankFrame`, `BLANK_ANCHOR`, `blankFrame` (`:43-77`), so every later `page-config.ts` line moved by about 37. `MarkupPane.svelte` is 1232 lines (was 1234): `TITLE_HEADER_GAP` is at `:466` (brief `:469`), `contentTop` `:468`, `contentBottom` `:488-490`, `subsequentTop` `:508`, `page1WindowHeight` `:789`, `laterPageHeight` `:850`, `lastWindowTop` `:870`, `notesPlan` `:873`, score windows `:984`, `:990`, `NotesColumn` `:1011`, `.score-window` `:1166-1167`. The e2e files are `e2e/one-page-frame.ts` (a body), `e2e/one-page-frame.test.ts`, `e2e-phone/one-page-frame.test.ts`. `page-fit.test.ts` is at `src/lib/page-fit.test.ts`, not in `components/Paper/`.

(Sections 5 onward are written as the lane proceeds.)
