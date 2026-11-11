Model: Sonnet 5.5 (claude-sonnet-5-5)

# Report: poem library harvest, step 2 (the three site names), 2026-11-11

Branch `cloud-lane-45`. `docs/memory/OPEN.md` left alone and unstaged.

## What changed

- `apps/web/src/lib/text/poem-site.ts`: `SITE_KEYS` gains `RVB`, `az.lib.ru`, `ilibrary.ru`, mapped to `intake.poemLibrary.site.rvb`, `.azLib`, `.ilibrary`. These are the data's `source.site` strings (the library holds exactly those four spellings plus Russian Wikisource).
- `apps/web/src/lib/i18n.ts`, Dann's ratified strings as the brief gives them:
  - `rvb`: EN "the Russian Virtual Library (rvb.ru)"; FR « la Bibliothèque virtuelle russe (rvb.ru) »
  - `azLib`: EN "Maxim Moshkov’s Library (az.lib.ru)" (apostrophe U+2019); FR « la Bibliothèque de Maxime Mochkov (az.lib.ru) »
  - `ilibrary`: EN "ilibrary.ru"; FR « ilibrary.ru »
  The key index at the head of the file: "This file holds 1,219 keys" to 1,222, and `intake.` 51 to 54 (counted from the file's keys by `i18n-index.test.ts`, which passes). The source line `intake.poemLibrary.cardSource` is unchanged: « Tiré de {site}. », no elision.
- `apps/web/src/lib/text/poem-library-strings.test.ts`: the three keys added to `RATIFIED_TABLE` (15 to 18), the test's site map (`RVB`, `az.lib.ru`, `ilibrary.ru`), and one new test that prints each of the three in both languages and the French card sentence with the two sites that take no elision.

## Verified

`vitest run src/lib/text/poem-library-strings src/lib/i18n`: 3 files, 23 tests passed. This includes the "every site the library holds is listed" test, red at step 1, now green, and the i18n index test.

## What Code could not establish

- The ratification dates (rvb.ru 2026-11-10 22:40, az.lib.ru 2026-11-10 22:41, ilibrary.ru 2026-11-11) are the brief's; I did not open `OPEN.md` to read the rulings (it holds the desk's uncommitted notes, and the brief says to leave it alone).
- Gates 3 and 8 and the rest of gate 4 were not run for this step; they run at step 4. The ten reds named in the step 1 report other than the strings one remain for step 3.
