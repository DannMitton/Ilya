# Brief for Code: LEARN's Glyph Table draws Dann's cursive letters (r2, 2026-11-10)

Written by the desk (Opus) 2026-11-10 22:0x; r2 applies Fable's review (`docs/sessions/review-fable-learn-cursive-brief_r1_2026-11-10.md`, SEND WITH AMENDMENTS, all ten applied). Serves THE SHARE: the cursive columns of the Glyph Table show the placeholder text «SVG» to colleagues today (`INBOX.md` 2026-11-09 12:20, "IN for the share").

## What the singer sees now, and after

Now: in LEARN, unit 1, the Glyph Table's two Cursive columns (Maj., Min.) print the word «SVG» in small sans type on every row, in both languages.

After: each of those cells shows the letter in Dann's own handwriting, redrawn as copybook script, in the cursive column's ink colour, the same size on every row, the two cursive cells of every row on one baseline. Cells with no handwritten form show the table's existing null mark «—».

## Ruling

Dann 2026-11-10 22:01, on the desk's r4 (all 33 rows drawn at LEARN's cell size): *"This looks gorgeous. Let's use mine with your alterations. Thank you"* (transcribed as written). Recorded in `docs/memory/OPEN.md`, last section.

## Inputs

- The desk's files reach `Shane` in Dann's ship before this brief is sent; the commit is named where Code is started. If `tools/cursive/r4/` is absent, stop and report.
- `tools/cursive/r4/svg/`: 62 files, `NN-<capital>-<upper|lower>.svg` (NN = row 01 to 33 in the order А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я). 101,164 bytes in all. Every file: one `<path fill="currentColor">`, `role="img"`, `aria-label` with the letter, viewBox `x -3 w 72` (a shared vertical frame; the width varies by letter). Provenance and the scripts: `tools/cursive/r4/README.md`.
- Missing on purpose: capital Й, Ъ, Ы, Ь (Dann left those boxes blank).
- The table: `apps/web/src/lib/components/Reading/LearnContent.svelte` (`L`). The French copy comes first, `L:204-668`; English `L:2245-2709` (at `3c247013`, read by Fable). Each holds 37 rows: the 33 letters in the files' NN order, then Ѣ, Ѳ, І, Ѵ, whose cursive cells are already `gt-null` (`L:628-665`, `L:2669-2706`) and stay untouched. Each copy has 66 «SVG» cells (33 rows by 2); after the work, 62 drawings and 12 null cells per copy. The one `gt-hi` per copy is lowercase д (`L:278`, `L:2319`). Styles: `apps/web/src/routes/+page.svelte` (`P`) `:4808-4815` (`.gt-cursive`) and `:4765-4775` (cells 48 by 48 px).

## Steps

0. Read and report: verify the Inputs' line ranges and counts. Run the eight gates for a baseline.
1. Copy the 62 files into `apps/web/src/lib/components/Reading/cursive/` unchanged (keep `tools/cursive/r4/` as the source record). Load them with `import.meta.glob('./cursive/*.svg', { query: '?raw', import: 'default', eager: true })` and draw each inline (`{@html}`), so `currentColor` takes the column's `color: var(--sage-ink)`. DESK DEFAULT: inline, not `<img>`, because an `<img>` cannot take `currentColor` from the cell (`P:4810`). Byte count told to Dann: 101,164 bytes, about 35 to 50 KB gzipped, in LEARN's code.
2. A new component, `Reading/CursiveGlyph.svelte`, holds the `import.meta.glob` and draws one letter; `L` gains one import line and each «SVG» cell changes in place on its own line (`<td class="gt-cell gt-cursive"><CursiveGlyph letter="а" /></td>`). No snippet in `L` (its ratchet ceiling is 4099 against 4096 lines, `scripts/ratchets.json:9`). The `gt-hi` stays on its `<td>`. File names carry the capital for both cases (`05-Д-lower.svg`), so key on capital plus case. Style the drawing with one global rule beside `P:4808`: `:global(.gt-cursive svg) { display: block; height: 40px; width: auto; margin: 0 auto; }` (a scoped selector for `{@html}` content counts as unused and breaks the warnings baseline of 12). `.gt-cursive` keeps background, colour, `font-family`, and `font-style`; only `font-size` and `letter-spacing` may go, so the eight existing null cells per copy look unchanged. No letter is scaled on its own; at 40 px the widest is capital Ж, 47.2 px, inside the 48 px cell.
3. Capital Й, Ъ, Ы, Ь: the cell shows `—` with `gt-null`, as the table already does for absent forms (`L:628-665`, `L:2669-2706`). Dann 2026-11-10 22:03 asked for a discreet null sign and noted a lyric diction student never meets these capitals; the existing `—` is that sign.
4. Tests: (a) render `LearnContent` with `svelte/server` in both languages, as `learn-opening.test.ts:8-12` does: no `>SVG<`; the count of `<svg` equals the count of files; the cells for capital Й, Ъ, Ы, Ь are `gt-null` (allow for the comment `{@html}` emits before `<svg>`); (c) every file's viewBox has y = -3 and height 72, and one path with `fill="currentColor"`; (d) the `aria-label` of each file is its letter in the right case; (e) each file holds one `<svg>` and one `<path>`, and no `<script`, `on…=`, `href`, or `style`; (f) the app's copy and `tools/cursive/r4/svg/` are byte-identical. Pin counts by reading the files, not by typing numbers.
5. Gates, and a Playwright look at LEARN unit 1 in both languages at desk and phone widths (the app has no dark mode, `app.css:47`); it asserts every cursive `<svg>` is 40 px high and no wider than 48 px, naming any that fails; and a screenshot of the table's first eight rows and last eight rows in each, saved under `docs/sessions/learn-cursive_2026-11-10/`.
6. Report: what changed with `path:line`, the gate table, the screenshots' paths, and anything not established.

## Constraints

- No string changes; nothing in French changes (the cells carry no text).
- Do not rename, redraw, or edit the SVG files. A file that will not draw is a finding, reported, not fixed.
- Keep each file's `role="img"` and `aria-label`: each cell is announced by its own letter, as the printed cells are. No `aria-hidden`, no `<title>`.
- `L` shifts by one line; the citations into it in `sources.ts:83,101,119,337`, `i18n.ts:1390-1393`, and `pipeline.ts:502` go stale by one and are not chased here.
- One branch, pushed; no pull request; Dann merges.

## What you could not establish

Every report carries this section. NOT ESTABLISHED beats a complete invented answer.
