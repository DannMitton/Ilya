# Report: closing polish lane, step 4, the aria card in French (Code, cloud-lane-48, r1, 2026-11-12)

## What changed

- `tools/poems/library.json`: each of the 89 libretto entries' `provenance` gains `opera_fr` (after `opera_en`) and `character_fr` (after `character_en`), from the brief's table. I read the table out of the brief's JSON block and checked it: 29 operas, 74 roles, exactly the 74 `(opera_ru, character_ru)` pairs the data holds (none missing, none extra), no straight apostrophe. The file's formatting round-trips byte for byte, so the diff is the 178 added lines only.
- `scripts/build-poem-library.mjs`: `OPERA_FIELDS` (`:249-258`) gains `['operaFr', 'opera_fr']` and `['characterFr', 'character_fr']`, so `operaOf` refuses an entry without them. **Not in the brief:** `PROVENANCE_KEYS` (`:209-212`) is an allow-list that refused the new keys ("not a field a libretto carries"), so `opera_fr` and `character_fr` are added to it.
- `apps/web/src/lib/text/poem-library.ts`: `PoemOpera` gains `operaFr` and `characterFr`; `OPERA_TEXT_KEYS` (`:123`) gains both. `kindFits` therefore refuses a libretto without them.
- `apps/web/src/lib/text/poem-metadata.ts`: `operaLine`'s French branch returns `${characterFr} · ${operaFr} (${operaRu})`; its comment (`:91-94`) is rewritten to match. The one caller is `components/Drawer/PoemLibraryCard.svelte:53`.

## The poem file

Rebuilt with `node scripts/build-poem-library.mjs --library tools/poems/library.json --out data`. The name carries a new hash: `dictionary.poems.d77d09cd.json` is removed with `git rm`; `dictionary.poems.83fa37e8.json` is added with `git add -f` (`.gitignore:12` ignores `data/dictionary.*.json`, Amendment 7); `data/dictionary-manifest.json` names `83fa37e8` as `poemHash` and in `poemFiles` (read after the build). No source file names the old hash (only earlier reports do).

| | before (lane 45) | after | change |
|---|---|---|---|
| raw bytes | 1,134,338 | 1,139,076 | +4,738 |
| gzip -9 (Node zlib) | 247,522 | 248,921 | +1,399 |
| brotli q11 (Node zlib) | 178,015 | 178,910 | +895 |

I re-measured the old file with the same Node call first and got lane 45's three figures exactly, so the method matches.

## Tests

- `text/poem-offer-metadata.test.ts`: the French pin moved from «Пимен · Борис Годунов» to «Pimène · Boris Godounov (Борис Годунов)», and the test renamed (its name said no French name is in the data); the English line is unchanged and still pinned. New: 29 `it.each` lines, one per opera with one of its roles, in French, against the real file; and a test that the table holds 29 distinct operas, that the library holds 29, and that no libretto's French fields hold a straight apostrophe or a Cyrillic letter.
- Fixtures given the two fields (Amendment 7): `text/poem-library.test.ts`, `text/poem-source.test.ts`, `tests/build-poem-library.test.ts` (both the provenance and the expected opera). `text/poem-offer-metadata.test.ts` reads the real file and needed no fixture. The existing "refuses a missing opera field" test iterates `OPERA_FIELDS`, so it now covers the two new fields.
- Gates touched: `text/` suite, 34 files, 702 passed; the root integration suite, 7 files, 155 passed (no new test there). Full web suite and the rest run at step 12.

## What I could not establish

- Whether every French name in the table is right. The table is the desk's, ratified by Dann at 22:18; I checked its shape and coverage, not its French.
- The card as drawn in French in a browser.
