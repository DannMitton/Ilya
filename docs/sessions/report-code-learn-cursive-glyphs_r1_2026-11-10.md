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
