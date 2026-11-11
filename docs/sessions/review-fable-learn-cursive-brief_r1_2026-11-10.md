# Review: brief "LEARN's Glyph Table draws Dann's cursive letters" (r1, 2026-11-10)

Reviewer: Fable, against `/root/lane41` at `3c247013`. `L` = `apps/web/src/lib/components/Reading/LearnContent.svelte`; `P` = `apps/web/src/routes/+page.svelte`. The clone is unchanged; the pack's 62 SVGs match `r5out` byte for byte. The build was tried in a scratch clone (deleted): 132 cells replaced, 130 tests in 7 files pass, `svelte-check` 0 errors / 12 warnings (CI baseline, `ci.yml:49-51`), ratchets OK, `vite build` OK.

## VERDICT

SEND WITH AMENDMENTS. Amendments 1 to 3 prevent a failed first pass.

## AMENDMENTS

1. **The inputs are not in the repository.** `git ls-tree -r 3c247013` holds no `tools/cursive`. Add to Inputs: "The desk commits `tools/cursive/r4/` (62 SVGs, README, scripts) to `Shane` before this brief is sent, and the brief cites that commit. If the folder is absent, stop and report." README:8 says 100,918 bytes; the files total 101,164 (the brief's figure).

2. **There is no dark mode.** `--sage-ink` is defined once (`apps/web/src/app.css:47`); `apps/web` holds no `prefers-color-scheme`, `data-theme`, or `color-scheme`; the cell background is a fixed hex (`P:4809`). Replace the DESK DEFAULT sentence in step 1 with: "DESK DEFAULT: inline, not `<img>`, because an `<img>` cannot take `currentColor` from the cell." In step 5 delete ", light and dark". `currentColor` reaches the path through `P:4810`.

3. **Ratchet headroom is 3 lines.** `L` is 4096 lines; its ceiling is 4099 (`scripts/ratchets.json:9`). Replace step 2's first sentence with: "A new component, `Reading/CursiveGlyph.svelte`, holds the `import.meta.glob` and draws one letter; `L` gains one import line and each «SVG» cell changes in place on its own line (`<td class="gt-cell gt-cursive"><CursiveGlyph letter="а" /></td>`). No snippet in `L`. The one `gt-hi` (lowercase д, `L:278`, `L:2319`) stays on its `<td>`. File names carry the capital for both cases (`05-Д-lower.svg`), so key on capital plus case. Style the drawing with one global rule beside `P:4808`: `:global(.gt-cursive svg) { display: block; height: 40px; width: auto; margin: 0 auto; }`. A scoped selector for `{@html}` content counts as unused and breaks the warnings baseline of 12."

4. **Step 0 facts, to verify.** Add: "The French copy comes first: table `L:204-668`; English `L:2245-2709`. Each holds 37 rows: the 33 letters in the files' NN order, then Ѣ, Ѳ, І, Ѵ, whose cursive cells are already `gt-null` (`L:628-665`, `L:2669-2706`) and stay untouched. Each copy has 66 «SVG» cells (33 rows by 2); after the work, 62 drawings and 12 null cells per copy."

5. **Keep the null mark's font.** `.gt-null` sets no `font-family` (`P:4817-4823`); the dash takes it from `.gt-cursive` (`P:4811`). Replace step 2's last sentence with: "`.gt-cursive` keeps background, colour, `font-family`, and `font-style`; only `font-size` and `letter-spacing` may go. The eight existing null cells per copy look unchanged."

6. **Fit: state it and test it.** The files carry a viewBox only (all 62: y = -3, height 72). At 40 px high the widest are capital Ж 47.2 px, Т 45.3, М 42.0, Щ 41.7, П 40.4. All fit in 48 px (`P:4769-4772`); Ж's box comes within 1 px of the border (`P:4766`), its ink about 43 px. Add to step 2: "No letter is scaled on its own. The Playwright pass asserts every cursive `<svg>` is 40 px high and no wider than 48 px, and names any that fails."

7. **Baseline: say which.** The shared frame gives one baseline for the cursive cells (README:6), not the printed letters' baseline. Change "sitting on one baseline across the row" to "the two cursive cells of every row on one baseline".

8. **Tests.** Replace (a) and (b) with: "Render `LearnContent` with `svelte/server` in both languages, as `learn-opening.test.ts:8-12` does: no `>SVG<`; the count of `<svg` equals the count of files; the cells for capital Й, Ъ, Ы, Ь are `gt-null`. Allow for the comment `{@html}` emits before `<svg>`." Add (e): "each file holds one `<svg>` and one `<path>`, and no `<script`, `on…=`, `href`, or `style`". Add (f): "the app's copy and `tools/cursive/r4/svg/` are byte-identical."

9. **Accessibility: tell Code to leave it.** Add to Constraints: "Keep each file's `role="img"` and `aria-label`. Each cell is announced by its own letter, as the eight printed cells are; without the label a cursive cell is empty to a screen reader. No `aria-hidden`, no `<title>`." No label is duplicated on one element.

10. **Small corrections.** Cell size is `P:4765-4775`, not `-4774`. Step 3 cites French rows only; add `L:2669-2706`. Step 1: gzip is 49,598 bytes summed per file, 34,952 as one stream. Add: "`L` shifts by one line; the line citations in `sources.ts:83,101,119,337`, `i18n.ts:1390-1393`, and `pipeline.ts:502` go stale by one and are not chased here."

## Answers to check 2

- `import.meta.glob(..., { query: '?raw', import: 'default', eager: true })` works: Vite 6.4.1, SvelteKit 2.50.2, Svelte 5.50.1, vite-plugin-svelte 5.1.1 (`pnpm-lock.yaml:722,746,1131,1191`); it ran in vitest SSR and `vite build`.
- `{@html}` is safe here: build-time, the project's own files, `svg` and `path` only. No ESLint exists (no config; zero lockfile hits).
- No pin moves: `learn-letter-names.test.ts:58-59` splits the copies at line 1000; `i18n.test.ts:143-153`, `french-italics.test.ts:91-96`, `retired-names.test.ts:93-98`, and `sources.test.ts:17` pass on the changed source.

## WHAT I COULD NOT ESTABLISH

- Which eight gates the ship script runs. I ran four: affected unit tests, `svelte-check`, ratchets, `vite build`. Full unit suite and Playwright: not run.
- Browser rendering: nothing was seen; `width: auto` and Ж's 47.2 px are computed. My trial put the `<td>` inside the component; amendment 3's form (the `<td>` stays in `L`) was not run.
- Dann's 22:01 and 22:03 rulings: not in the clone's `docs/memory` at `3c247013`.
- Ink widths come from path control points: approximate.
