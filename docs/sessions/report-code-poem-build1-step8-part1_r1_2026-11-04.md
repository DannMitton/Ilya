# Report: poem library build 1, step 8, part 1 (Code cloud lane, r1, 2026-11-04)

Brief: `brief-code-poem-library-build1-step8` r2 (in the task), Part 1. Branch `cloud-lane-31`, after part 6 (`adebd32`; `git pull` said up to date).

## What changed

- `tools/poems/library.json`: every entry gains `verification: { state, edition, witness }`. All 14 are `"unverified"`, `edition` and `witness` null; none was marked verified. The file's format is preserved (round-trip checked before writing).
- `scripts/build-poem-library.mjs` ships `verified: boolean` per entry and refuses an entry whose `verification.state` is neither value. The existing refusal of a missing `source.site`/`source.url` now also refuses an empty string (it passed an empty `site` before; the brief's "refuse an entry with no `source.site`" is only true for a missing key without this).
- `apps/web/src/lib/text/poem-library.ts`: `PoemEntry.verified: boolean`, checked by `isEntry`. The hand-built entries in `loader-poems.test.ts`, `poem-library.test.ts`, `poem-match.test.ts` carry it.
- Rebuilt: `data/dictionary.poems.dff71887.json`, **131,860 bytes** (was 131,622: +238), manifest `poemHash` `dff71887`. The old file is removed; the new one is force-added (`.gitignore` pattern, as before).
- **Card (DESK DEFAULT, Dann may strike):** `PoemLibraryCard.svelte` splits the ratified `cardSource`/`cardSourceModernized` sentence around `{site}` and renders the site name as a link to `entry.source.url` (`target="_blank" rel="noopener noreferrer"`); the sentence around it is unchanged. The quiet line under POEM stays text. Matching and filling do not read `verified`; no new string.

## Tests

- `tests/build-poem-library.test.ts`: the field pin gains `verified`; an unverified entry ships `verified: false` and `source.site` "Russian Wikisource"; a verified one ships `true`; every library entry is unverified; refusals for missing `site`, empty `site`, missing and bad `verification`.
- `poem-library.test.ts`: `isPoemLibrary` refuses a missing or non-boolean `verified`.
- Browser (`e2e/poem-library.test.ts`): the privacy test now checks the card's link `href` equals the entry's own `source.url` (read from `library.json`), `target`, `rel`, text; the tab-order test gains the link between the view tab and the buttons. The attribution pins (English quiet line, French card and line) were already in place and pass.

## Gates

web unit 4146 + 1 skipped (unchanged count; the new tests are in the root suite), integration 113 (was 112, +1), svelte-check 0 errors, 12 warnings. The full browser suite is run after part 5, as the brief says.

## NOT ESTABLISHED

- That the link works in a browser beyond its attributes: no click was made (an unclicked link makes no request, which the privacy test pins).
- Whether any entry's text matches a named edition (all remain unverified, by the brief).
