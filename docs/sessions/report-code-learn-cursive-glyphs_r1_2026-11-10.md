# Report: LEARN's Glyph Table draws Dann's cursive letters (brief r2, 2026-11-10)

Code (Sonnet 5.5), cloud lane 46. Branch `cloud-lane-46`, cut from `Shane` at `64d9f08f`. Working tree was clean at the start. No pull request.

## Step 0: verify the Inputs, run the gates (read-only)

Verified against `64d9f08f`:

- `tools/cursive/r4/` is present: `README.md`, `scripts/`, `svg/`. 62 SVG files, 101,164 bytes in all (`cat svg/*.svg | wc -c`). Missing capitals: Й (only `11-Й-lower.svg`), Ъ, Ы, Ь (`28`, `29`, `30` have lower only), as the brief says.
- `LearnContent.svelte` is 4096 lines (`wc -l`). Lines 204 to 668 (French) hold 66 `>SVG<` cells and 8 `gt-cursive gt-null` cells; lines 2245 to 2709 (English) hold the same, 66 and 8. File total: 132 `>SVG<`. The one cursive `gt-hi` is `LearnContent.svelte:278` (FR) and `:2319` (EN), both on the д row, as the brief says.
- Null cells for Ѣ, Ѳ, І, Ѵ are at `:628-665` and `:2669-2706`, as stated.
- `scripts/ratchets.json:9` ceiling for `LearnContent.svelte` is 4099.
- `+page.svelte:4765-4775` (cells 48 by 48) and `:4808-4815` (`.gt-cursive`) match.

Gates run at the baseline (the ship script `ilya-ship.sh` is not in the repository, so I ran the CI equivalents; I did not run it):

| Gate | Result |
|---|---|
| ratchets (`node scripts/ratchets.mjs`) | OK |
| svelte-check | 0 errors, 12 warnings |
| phonology | 456 passed |
| dictionary | 248 passed |
| blurb | 168 passed |
| score-parser | 785 passed, 5 skipped |
| web (`apps/web`) | 4894 passed, 1 skipped |
| integration (root vitest) | 151 passed |
| build (`pnpm --filter @ilya/web build`) | done |
| Playwright e2e | not run at baseline |

### NOT ESTABLISHED (step 0)

- The ship script's own eight gates, its baselines, and their order: the script is outside the repository. My table is the CI set, not the ship script.
- The desk's 2026-11-09 figures (web 4707 + 1, integration 125) differ from mine (4894 + 1, 151). This checkout is the maintainer's working tree and may count files a clean clone does not (`ENVIRONMENT.md` says gate 4 differs between a clean clone and the Mac). I did not reconcile this.
- The Playwright suite's baseline.

## Step 1: the 62 files copied

`apps/web/src/lib/components/Reading/cursive/` now holds the 62 files, copied unchanged (`diff -r` against `tools/cursive/r4/svg/` is empty). `tools/cursive/r4/` stays as the source record. Loading is step 2.

## Step 2: CursiveGlyph, the cells, the style

- New `apps/web/src/lib/components/Reading/CursiveGlyph.svelte`: one `import.meta.glob('./cursive/*.svg', { query: '?raw', import: 'default', eager: true })`, keyed on capital plus case (`А` gives the `upper` file, `а` the `lower`), drawn with `{@html}`.
- `LearnContent.svelte` gains one import line (`:4`), so it is 4097 lines against the ceiling of 4099. 124 cells changed in place, 62 per language (`<td class="gt-cell gt-cursive"><CursiveGlyph letter="а" /></td>`, for example `:230-231`); `gt-hi` stays on its `<td>` (`:279`, `:2320`). The letter in each call was read from its own row's sans-oblique cell, not typed. The four capitals Й, Ъ, Ы, Ь keep «SVG» until step 3.
- `apps/web/src/routes/+page.svelte:4817-4819`: the one global rule beside `.gt-cursive`, as the brief gives it. `.gt-cursive` itself is unchanged, so the eight existing null cells look as before (I read the brief's "only `font-size` and `letter-spacing` may go" as permission, not an instruction, because the null cells use both).
- Checked: `node scripts/ratchets.mjs` OK; a throwaway server-render of `LearnContent` in English held 62 `<svg` and 4 `>SVG<`. The throwaway test was deleted.

NOT ESTABLISHED (step 2): how it looks (step 5); svelte-check's warning count after the change (step 5).

## Step 3: capital Й, Ъ, Ы, Ь

The four capital cells per language now read `<td class="gt-cell gt-cursive gt-null">—</td>`: `LearnContent.svelte:350, 554, 566, 578` (French) and `:2391, 2595, 2607, 2619` (English). No `>SVG<` remains in the file; each language has 12 null cursive cells (8 existing plus 4) and 62 drawings. The file is still 4097 lines. Nothing else changed.

NOT ESTABLISHED (step 3): how the `—` looks beside the drawings (step 5).

## Step 4: tests

New `apps/web/src/lib/components/Reading/learn-cursive-glyphs.test.ts`, 197 tests, all passing (run alone). Counts come from the files on disk, nothing typed.

- (a) Both languages, rendered with `svelte/server` and comments stripped as `learn-opening.test.ts` does: no `>SVG<`; `<svg` count equals the file count; the capital cursive cell of each capital with no file (found by listing the files: Й, Ъ, Ы, Ь) is `gt-null` and holds `—`, and its small cell is drawn; the `aria-label`s in the table equal the files' letters, one each.
- (c) Per file: viewBox y = -3 and height 72; exactly one `<path>` with `fill="currentColor"`.
- (d) Per file: `role="img"`, and `aria-label` is the capital for `upper`, the small letter for `lower`.
- (e) Per file: one `<svg`, one `<path`, no `<script`, `on…=`, `href`, or `style`.
- (f) Every app file is byte-identical to `tools/cursive/r4/svg/`, and the two directories list the same names.
- Also: the list of letters with no capital file is non-empty and the file count equals lower plus upper.

NOT ESTABLISHED (step 4): that the (a) assertions fail on the pre-change tree (a positive control). I did not run the test against `64d9f08f`; the rules forbid checkout and stash, so I read the assertions instead. The web gate total with the new tests is measured in step 5.

## Step 5: gates and the look

Gates after the change (same set as step 0):

| Gate | Baseline | After |
|---|---|---|
| ratchets | OK | OK |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| phonology | 456 | 456 |
| dictionary | 248 | 248 |
| blurb | 168 | 168 |
| score-parser | 785 + 5 skipped | 785 + 5 skipped |
| web | 4894 + 1 skipped | 5091 + 1 skipped (+197, the new file) |
| integration | 151 | 151 |
| build | done | done |

Playwright look: `docs/sessions/learn-cursive_2026-11-10/look.mjs` (run from the repository root with the dev server on :5173; Chromium, 1440 x 900 desk and 390 x 844 phone at 2x, LEARN in English and in French). It asserts every `.gt-cursive svg` is 40 px high and at most 48 px wide, by `getBoundingClientRect`. Result in all four runs: 62 drawings, 0 outside the bounds, so no letter is named as failing. The eight pictures are in the same folder: `{en,fr}-{desk,phone}-{first8,last8}.png`. On the phone the script scrolls the table (`.gt-table` is itself the horizontal scroller) to its right edge so the cursive columns show. I read four of the pictures (en-desk-first8, en-desk-last8, en-phone-first8, fr-phone-last8): the letters are drawn in the column's green, the д cell keeps its `gt-hi` highlight, and the null cells show `—`.

## Step 6: summary

Changed: `Reading/cursive/` (62 files, new); `Reading/CursiveGlyph.svelte` (new); `LearnContent.svelte:4` (import) and 124 cells (`:230` onward, `:2320` onward); 8 cells to null (`:350, 554, 566, 578, 2391, 2595, 2607, 2619`); `+page.svelte:4817-4819` (one global rule); `Reading/learn-cursive-glyphs.test.ts` (new, 197 tests); this report; the look script and its eight pictures. Nothing was changed in the SVG files or any string. `LearnContent.svelte` is 4097 lines against a ceiling of 4099, so the citations the brief lists are off by one, as it says.

## What I could not establish

- The ship script's own eight gates and its baselines (outside the repository); I ran the CI set. My baseline counts (web 4894, integration 151) differ from the desk's 2026-11-09 figures (4707, 125); not reconciled.
- The Playwright suite (`pnpm test:e2e`) was not run, before or after; only the look script.
- That the new tests fail on the old tree (no positive control; no checkout allowed).
- "The two cursive cells of every row on one baseline" was not measured. It follows from the shared viewBox frame (README: baseline at y = 48.2) and the one 40 px height; I looked at pictures, I did not measure baselines.
- The tables have 38 `tbody tr`, not 37: the extra is the "Pre-1917 obsolete letters" divider row. I did not find it in the brief; it does not affect any count above.
- Pictures: on the phone the first-eight shot shows about seven rows (the viewport clips it), and the last-eight shot ends at the first obsolete row. I read four of eight pictures, not all.
- Gzipped weight of the built LEARN code was not measured; the 62 files gzip to 34,706 bytes together (`gzip -9`).
- Dev server only; no production build was served. `docs/memory/OPEN.md` showed as modified in the working tree during the session. I did not touch it and did not stage it.
