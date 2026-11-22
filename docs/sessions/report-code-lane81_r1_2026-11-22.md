# Report, lane 81 (QUEUE row 204): TEXT, MELODY, and INSIGHTS, judged from the rendered pages

r1, 2026-11-22, by the Code lane. Branch `cloud-lane-81`, cut from `origin/Shane` at `83270c74` after `git fetch origin`. The working tree carried one uncommitted file (`docs/memory/CONTRACT.md`) that I did not write and do not commit. Nothing under `docs/memory/` was written.

**Outcome in one paragraph.** Step 1 is done and the table is below. Read from the pages, TEXT, MELODY, and INSIGHTS already agree on every row where two or more of them share a role: size, weight, line height, letter spacing, case, style, colour, margins, indent, rules, hairlines, and the footer. Every row the table marks is content (a word that is longer, a line that wraps, a stave, a legend, an aside). No row is eligible for the two-of-three rule, so the rule-driven repair changed nothing. **Afterwards, on Dann's reading of the pages, two edits were made (section 8).** The one repair the brief named in advance, INSIGHTS' prose inset, is a row where I stopped, as the brief says to when the rule does not decide it. Section 5 gives the two ways to close it and what each moves. The eight gates were **not run** (no source changed); NOT ESTABLISHED as a claim about gate counts.

## 1. Instrument

- `census.mjs` (this folder; run from `apps/web`: `node ../../docs/sessions/report-code-lane81_r1_2026-11-22/census.mjs before`). Playwright, Chromium, device scale 2, against the dev server on :5173 serving this tree.
- Fixture: `tchaikovsky-op38-3-voice.musicxml`; one voice, a bass called "Voice 1" with all ten vowels sampled; no fixture names a person. A second capture (`before-ph`) uses the same bass with three vowels sampled, so the placeholder sentence is drawn. The "Voice line as written" card is dismissed (Escape) before every capture.
- Conditions: English and French, at 1024 and 390, three scenarios: the score (page 1, page 2, page 3), the three blank pages, and the placeholder voice (MELODY and INSIGHTS page 1). Pictures: `pics/before-<doc>-<score|blank|placeholder>-<en|fr>-p<n>-<1024|390>.png` (`before-ph-` for the placeholder voice). Score: pages 1, 2, and 3 per document; blank: page 1 per document; placeholder: MELODY and INSIGHTS page 1.
- Every length below is in **sheet px** (client box divided by the sheet's scale), so the phone's fit transform is divided out. The sheet is 816 by 1056 at 1024 and at 390.
- Data: `census-before.json` (every text node's tight box, element box, font size, weight, line height, letter spacing, case, style, colour, margins, padding, indent; every rule and hairline; every bordered or rounded box), `census-before-ph.json`.
- `table.py` builds the table; `pixdiff.py` the pixel diffs; `roles.py` dumps the roles per sheet.

## 2. The table (Step 1)

The full table is `table-before.md`: **276 rows** (one row per property of each role, one column per document; a value in a cell is every distinct value that property took over the eight score and blank conditions, with the count of conditions). The 34 marked rows are in `marked-rows-before.md` and reproduced here by group. Everything else, **242 rows, agree**, including all of: font size, weight, line height, letter spacing, case, style, family, colour (the three accent hues folded to ACCENT), margins, text indent of the header block, the running header, the footer credit and page number, the hairlines, the title rule's colour and thickness, the squircle's radius, border, and fill, and the blank-page sentences' type.

Marked rows, and why each is content:

| Group | Rows marked | Disagreement | Cause |
|---|---|---|---|
| Page-1 tab mark and running-header tab, left edge | 4 | TEXT 647.0, MELODY 675.7, INSIGHTS 666.8 (English); the right edge is 720 on all three | The tab word differs in length ("TEXT: LYRICS", "MELODY", "INSIGHTS"), right-aligned. Content. |
| Page-1 song title and metadata lines, right edge | 4 | TEXT and MELODY 720; INSIGHTS 632 (EN) and 636 (FR) | INSIGHTS' compass stave takes the right 88 px of its title block. Content (the stave). |
| Page-1 metadata line (first and last), text right edge, top, bottom; page-1 title rule top and bottom | 10 | TEXT and INSIGHTS: two lines with a score, rule at 174.4; MELODY: one line plus its key, rule at 200.8; one line on the blank pages, rule at 152.0 on all three | The number of identity lines and MELODY's legend. Content. On the blank pages the rule is 152.0 on all three. |
| Blank squircle: bottom, height; sentences 1 and 2: right edge, top, bottom; notes heading and line: top, bottom, right edge | 16 | The French sentences wrap to two lines on TEXT and INSIGHTS and to one on MELODY, so the box is 106.9 tall against 86.6 | The words. Content. The top edge, left, right, radius, border, fill, and every type row agree. |

No row in the table has all three values different. **No row has two documents agreeing and a third differing** apart from the content rows above, where the difference is the length of the words.

Not rows, because only one or two documents carry the role, so the rule cannot apply. Each is a measured difference, listed so that it is on the record:

1. **INSIGHTS' prose inside its squircle sits inset; MELODY's matching sentence sits at the full column.** Placeholder voice, English, 1024 (the French and the 390 captures give the same numbers). MELODY's "To complete your personal vowel space..." (`.header-note`, 13 px serif, line height 18.2): left 96, right 720. INSIGHTS' same sentence in its title block: left 96, right 632 (the stave). INSIGHTS' placeholder note inside the squircle (`.placeholder-note`, 13 px serif, 18.2): left **133**, right 693 on pages 2 and 3, left **123**, right 693 on page 4. Its comment body (14 px): left 123, right 693. The squircle's own edges are 96 and 720; the inset is its 1 px border and 26 px padding (`InsightsPane.svelte:383-386`, `INSIDE = COLUMN - 2 * 27`). The placeholder note is a further **10 px** in on pages 2 and 3 than on page 4.
2. INSIGHTS' framing paragraph (`.frame`) stops at 696, not 720 (`max-width: 600px`, `SingerBlock.svelte:220`). Only INSIGHTS has it.
3. The key: TEXT's "ё stress" key is 9.5 px, letter spacing 0.38, in the footer band above the hairline; MELODY's key ("stems up = close timbre") is 14 px, letter spacing 0.56, in the title header. INSIGHTS has none. Two documents, two sizes, two places.
4. Within a document, one look carries three line heights: the 14 px, weight 600, 1.5 px-spaced, accent-coloured Source Sans is 19.6 px tall on the tab and the running-header text, 22.4 px on the title block's metadata lines, 21 px on INSIGHTS' section heads and MELODY's "Notes" head. This is within one document, not a cross-document disagreement.
5. TEXT's blank page has no Notes block; MELODY's and INSIGHTS' have one, and those two agree on every property (heading 14 px, 600, accent, line height 21; line 11.5 px serif, line height 16.1).

## 3. Pixel diff between documents (Step 1)

`pixdiff-before.txt` lists every pair, region, and condition; threshold, grey difference above 40, on the 2x pictures at 1024.

- **Blank pages, footer band:** 0 differing pixels for every pair, both languages. The three footers, hairlines, and credit lines are pixel-identical on the blank pages.
- **Score pages, footer band, MELODY against INSIGHTS:** 46 px, the hairline's tint (lavender against rose). **TEXT against either:** about 16,600 px, all of it TEXT's "ё stress" key row and its circle sitting above its hairline (item 3 above); the hairline, credit, and page number are at the same positions (942, 614, 664) in all three.
- **Running header band (page 2):** MELODY against INSIGHTS 549 to 638 px, bounding box x 667 to 718: the tab word. TEXT against either, about 3,300 px, bounding box x 96 to 718: the tab word ("TEXT: LYRICS") and the tint of the rule. The left text, "ЧАЙКОВСКИЙ | ТОЛСТОЙ | СРЕДЬ ШУМНОГО БАЛА", is identical.
- **At 390** the pictures are scaled sheets (about 342 px wide), so the same pixel bands do not line up; the 390 pixel diffs in `pixdiff-before.txt` for the header band are not meaningful and I do not rely on them. The 390 table values are in sheet px and agree with 1024.

Nothing in the pictures is unexplained by the table.

## 4. Step 2, the repair

By the rule ("where two of the three agree, the third takes their value; where all three differ, list it and stop"), no row of the table qualifies: the marked rows differ because the words differ, and the brief says content stays different. **No source file was changed.** There are no "after" captures that differ from "before"; the before set is the set. NOT ESTABLISHED: any claim that a future change would hold, because no change was made.

Ratchets: no file touched, so `MarkupPane.svelte` stays at 1231 and `InsightsPane.svelte` at 668; no ceiling changed. Gate 4's count and the other gates: not run.

## 5. The row I stopped on, and the decision it needs from Dann

Section 2, item 1. The rule does not settle it: the squircle's text inset is the same 123 on all three blank pages (the three agree), and the full-column sentence in MELODY is not inside a squircle at all. Making INSIGHTS' prose sit at 96 to 720 means one of:

- **A. Hang the squircle outside the column.** The text stays on the column (96 to 720) and the border moves out by 27 px a side (69 to 747), on INSIGHTS' score pages. Moves: every squircle edge on INSIGHTS; the rail lines run 27 px past the title rule and footer hairline. The blank pages' squircle (96 to 720, text at 123, ruled in lane 79) would then differ from INSIGHTS' score squircle, unless all three blank pages hang too, which changes lane 79's ruled frame and its pins in `e2e/one-page-frame.ts`.
- **B. Take the sentence out of the squircle.** The placeholder note and the placeholder sentence become free text at the full column, as MELODY's is. Moves: pagination of INSIGHTS' comment blocks; the note is attached to its comment today.

Either is a design ruling. I did not choose. Whichever it is, the placeholder note's extra 10 px on pages 2 and 3 (133 against 123) is a separate, plain defect inside INSIGHTS that disagrees with its own page 4; fixing it needs no ruling beyond "123", and I have not made that change either, because it is part of the same row.

Also unresolved and Dann's: the "hollow or dashed" (MELODY) and "dashed" (INSIGHTS) wording. Not touched.

## 6. What was not established

- Gates 1 to 8: not run, since nothing changed.
- 390 pixel diffs of the header band (see section 3).
- The brief's "later page" for INSIGHTS is page 2 here; INSIGHTS has six pages, MELODY and TEXT three, so page 3 is the last page of the shorter two and the third INSIGHTS page.

## 7. Files in `report-code-lane81_r1_2026-11-22/`

`census.mjs`, `table.py`, `pixdiff.py`, `roles.py`, `census-before.json`, `census-before-ph.json`, `table-before.md`, `marked-rows-before.md`, `pixdiff-before.txt`, `hdr-p2-1024.png` and `ftr-p2-1024.png` (the three documents' running header and footer stacked), `pics/`.

## 8. Edits made after Dann's reading of the pages (2026-11-22)

Dann saw that INSIGHTS' right margin looked more generous than MELODY's. Both causes are in the rendered numbers above and were missed by the table, because each belongs to a role only INSIGHTS has.

1. `apps/web/src/lib/components/Paper/TitleHeader.svelte`: the aside's reserved room (`--aside-room`, the compass stave's width) no longer applies to `.header-note`. The note sits below the stave (note top 174.4, stave ends near 115), so it now spans 96 to 720 like MELODY's (measured: el 96, er 720 on both, English, 1024, placeholder voice). The title and the metadata lines keep the margin. The note wraps in 4 lines; INSIGHTS still has 6 pages.
2. `apps/web/src/lib/insights/SingerBlock.svelte`: the intro paragraph's `max-width: 600px` is removed (right edge 696 to 720; 3 lines instead of 4).

Checked: `vitest run src/lib/insights src/lib/components/Paper`, 30 files, 595 tests pass. NOT RUN: the other gates, and a full after-capture of the three documents in all four conditions. Trial pictures: `pics/trial-*`, `pics/trial3-*`, crop `trial3-insights-note-crop.png`. Ratchets: neither pane file was touched.
