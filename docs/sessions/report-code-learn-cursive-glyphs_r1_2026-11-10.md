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
