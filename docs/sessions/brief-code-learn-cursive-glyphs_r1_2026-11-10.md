# Brief for Code: LEARN's Glyph Table draws Dann's cursive letters (r1, 2026-11-10)

Written by the desk (Opus) 2026-11-10 22:0x. Fable review owed before Code starts (CONTRACT §1 item 19). Serves THE SHARE: the cursive columns of the Glyph Table show the placeholder text «SVG» to colleagues today (`INBOX.md` 2026-11-09 12:20, "IN for the share").

## What the singer sees now, and after

Now: in LEARN, unit 1, the Glyph Table's two Cursive columns (Maj., Min.) print the word «SVG» in small sans type on every row, in both languages.

After: each of those cells shows the letter in Dann's own handwriting, redrawn as copybook script, in the cursive column's ink colour, the same size on every row, sitting on one baseline across the row. Cells with no handwritten form show the table's existing null mark «—».

## Ruling

Dann 2026-11-10 22:01, on the desk's r4 (all 33 rows drawn at LEARN's cell size): *"This looks gorgeous. Let's use mine with your alterations. Thank you"* (transcribed as written). Recorded in `docs/memory/OPEN.md`, last section.

## Inputs

- `tools/cursive/r4/svg/`: 62 files, `NN-<capital>-<upper|lower>.svg` (NN = row 01 to 33 in the order А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я). 100,9xx bytes in all (measure it). Every file: one `<path fill="currentColor">`, `role="img"`, `aria-label` with the letter, viewBox `x -3 w 72` (a shared vertical frame; the width varies by letter). Provenance and the scripts: `tools/cursive/r4/README.md`.
- Missing on purpose: capital Й, Ъ, Ы, Ь (Dann left those boxes blank).
- The table: `apps/web/src/lib/components/Reading/LearnContent.svelte`, both copies (English and French), cells `<td class="gt-cell gt-cursive">SVG</td>` (and one `gt-cursive gt-hi` per copy, at about `:278` and `:2319` on `Shane` `3c247013`, read by the desk). Styles: `apps/web/src/routes/+page.svelte:4808-4815` (`.gt-cursive`: 0.6rem sans for the placeholder) and `:4765-4774` (cells 48 by 48 px).

## Steps

0. Read and report: the line ranges of both tables, how many «SVG» cells each holds, which rows they are, and whether any row's cursive cells are already `gt-null`. Run the eight gates for a baseline.
1. Copy the 62 files into `apps/web/src/lib/components/Reading/cursive/` unchanged (keep `tools/cursive/r4/` as the source record). Load them with `import.meta.glob('./cursive/*.svg', { query: '?raw', import: 'default', eager: true })` and draw each inline (`{@html}`), so `currentColor` takes the column's `color: var(--sage-ink)`. DESK DEFAULT: inline, not `<img>`, because an `<img>` cannot take the page's colour in dark mode. Byte count told to Dann: about 101 KB, about 50 KB gzipped, in LEARN's code.
2. One small component or snippet draws a cell from (row letter, case); every cursive cell in both copies uses it. The SVG is drawn at 40 px high, centred in the cell; width follows the file. `.gt-cursive` keeps its background and colour and loses the placeholder's type settings.
3. Capital Й, Ъ, Ы, Ь: the cell shows `—` with `gt-null`, as the table already does for absent forms (`LearnContent.svelte:628-665` on `Shane` `3c247013`, read by the desk). Dann 2026-11-10 22:03 asked for a discreet null sign and noted a lyric diction student never meets these capitals; the existing `—` is that sign.
4. Tests: (a) no cell in either copy still reads «SVG»; (b) every row of both copies whose file exists draws it, and the four absent capitals draw `—`; (c) every file's viewBox has y = -3 and height 72, and one path with `fill="currentColor"`; (d) the `aria-label` of each file is its letter in the right case. Pin counts by reading the files, not by typing numbers.
5. Gates, and a Playwright look at LEARN unit 1 in both languages at desk and phone widths, light and dark: a screenshot of the table's first eight rows and last eight rows in each, saved under `docs/sessions/learn-cursive_2026-11-10/`.
6. Report: what changed with `path:line`, the gate table, the screenshots' paths, and anything not established.

## Constraints

- No string changes; nothing in French changes (the cells carry no text).
- Do not rename, redraw, or edit the SVG files. A file that will not draw is a finding, reported, not fixed.
- One branch, pushed; no pull request; Dann merges.

## What you could not establish

Every report carries this section. NOT ESTABLISHED beats a complete invented answer.
