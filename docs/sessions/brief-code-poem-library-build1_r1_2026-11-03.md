# Brief for Code: the poem library, build 1 (Ilya fills Poem from its own library on a confident match) (desk, r1, 2026-11-03)

NOT Fable-reviewed. Fable reviews this file before Code gets it (`CONTRACT.md`).

## What the singer meets

A singer drops a scan or score, or pastes Lyrics, while Poem is empty. If Ilya's library holds the poem, Poem fills with it, in modern spelling, and the line under Poem names where it came from, with one tap, "Not this poem". If the match is weak, nothing fills and today's line (`intake.view.landedLyrics`) stands. The singer's own poem always outranks the library's.

Design: `docs/sessions/design-onboard-poems_r2_2026-11-03.md` (Dann's decisions 1 to 3: fill; poets dead by 1971; modern spelling). Threshold: `~/Downloads/_desk-2026-11-03/report-desk-poem-threshold_r1_2026-11-03.md` (desk only; its numbers are repeated here).

## Inputs in the repository (added by the desk, committed by Dann)

- `tools/poems/library.json`: 14 entries, 12 works, 108,533 bytes. Each entry: `id`, `work` (two entries of one work share it), `title`, `incipit`, `author`, `translator`, `rightsHolderDates`, `status` (all `canada`), `source` (`site`, `url` with revision id, `revid`, `page`, `editionAsNamed` raw, `licenceTemplate`), `spelling` (`modern` or `pre-reform`), `textEdition`, `textModern`.
- `tools/poems/reference_sw_match.py`: the reference matcher. Letters only: lowercase; ѣ→е, і→и, ѳ→ф, ѵ→и, ё→е, й→и; ъ dropped; everything outside а-я dropped. Smith-Waterman local alignment, match +2, mismatch −1, gap −2. Score = best local score ÷ (2 × query letters). A work's score is its best entry's.
- `tools/poems/fixtures/`: 12 read Lyrics (public-domain poems only) and `expected_r1.txt`, the reference scores.

`data/` is served whole (`apps/web/static/data` is a symlink to `../../../data`), so nothing under `tools/` is served.

## Rules for the match (DESK DEFAULT, measured, not tuned)

- Fill only when the top work scores at least **0.15** and beats the second work by at least **0.10**.
- Measured on the 18 build songs: true 0.293 to 0.921; no poem in the library 0.017 to 0.062. At 1,009 works (desk scale test): chance at most 0.088. Row 114 measured, never tuned: songs 2 to 5 fill (0.271 to 0.447), song 1 fills nothing (0.053).
- Run once, when Lyrics is filled by a file, a scan, or a paste, and Poem is empty. Never on typing. Never when a stored song is opened. Never over a Poem the singer filled.
- On a phone, aligning against a large library is too slow. Shortlist the 20 works sharing the most letter trigrams with the query, then align the shortlist only. With 12 works the shortlist is everything; the shortlist is for growth.

## Steps (one commit and one report per step, on `cloud-lane-31` from `origin/Shane`, push after each)

0. **Measure only.** Read and name, with file and line: where Lyrics is filled by a file, a scan, and a paste (`handleInput` is called at `routes/+page.svelte:2388`); the replace guard (`routePoemPage`, `handlePoemPage` at `:2390-2401`); `introLine` (`lib/text/input-line.ts`); `SongRecord` and `recordFromFields` (`lib/library/document.svelte.ts`, `publishedPoem` at `:117`, `:296`, `:351`); the loader's manifest and cleanup (`lib/loader.ts`: `DictionaryManifest` `:113-120`, `cleanLegacyCache` `:296-335`, `scheduleGlossTier` `:653-675`, `loadDictionary` `:683`, `setStored`/`getStored` `:259-290`); the worker's dictionary exemption (`static/sw.js:100`). Run the eight gates for a baseline. Report; change nothing.
1. **The data build.** `scripts/build-poem-library.mjs` reads `tools/poems/library.json` and writes `data/dictionary.poems.<hash8>.json` (the name passes `sw.js:100`, so the worker never stores it twice) holding, per entry, `id`, `work`, `title`, `incipit`, `author`, `translator`, `source.site`, `source.url`, `spelling`, `textModern`, plus the letter stream precomputed. It adds `poemFiles` and `poemHash` to `data/dictionary-manifest.json`, never touching `hash`. State the byte count in the report (`CONTRACT.md` §8).
2. **The loader.** Fetch the poem file in the background after the app is interactive, as `scheduleGlossTier` does; store it in IndexedDB under `poems-<poemHash>`; read it from there when offline. Extend `cleanLegacyCache` to delete stale `poems-` keys and keep the current one. A missing or failed poem file leaves the app as it is today (no fill, no error shown).
3. **The matcher.** `lib/text/poem-match.ts`, pure, no DOM: the letter fold, the trigram shortlist, Smith-Waterman as specified, the threshold and margin. Test: every fixture's top work and score match `expected_r1.txt` to three decimals; P, S, T, U1, U6, and row 114 songs 2 to 5 fill; U4, U5, and row 114 song 1 do not.
4. **The fill.** On a confident match, set Poem to the entry's `textModern` through the same path a pasted poem takes, so differences, omissions, the tiers, and Revert work unchanged. Add `poemSource: { id, poemHash } | null` to `SongRecord` (stored; old records read as `null`). Any edit to Poem by the singer sets it to `null`. "Not this poem" clears Poem and `poemSource` and holds the dismissal for that song and that work for the session.
5. **The line and the strings.** `introLine` returns `intake.view.libraryPoem` (or `libraryPoemModernized` for a `pre-reform` source) while `poemSource` is set and Poem is the view; the line carries one button, `intake.poemLibrary.notThis`. Strings below.
6. **Gates and the walk path.** The eight gates. An end-to-end test: paste row 114 song 2's fixture into an empty song; Poem fills with «Весёлый час»; the line names Кольцов; "Not this poem" empties Poem; a reload keeps the dismissed state for the session only.

## Strings (desk drafts for Dann; not ratified)

English (desk):
- `intake.view.libraryPoem`: "From Ilya's library: {author}, «{title}», from {site}. Paste your own poem to replace it."
- `intake.view.libraryPoemModernized`: "From Ilya's library: {author}, «{title}», from {site}, in modern spelling. Paste your own poem to replace it."
- `intake.poemLibrary.notThis`: "Not this poem"

French (desk draft, built from `lib/i18n.ts`: « poème », « collez », the no-break space before a colon):
- `intake.view.libraryPoem`: « Tiré de la bibliothèque d’Ilya : {author}, « {title} », de {site}. Collez votre propre poème pour le remplacer. »
- `intake.view.libraryPoemModernized`: « Tiré de la bibliothèque d’Ilya : {author}, « {title} », de {site}, en orthographe moderne. Collez votre propre poème pour le remplacer. »
- `intake.poemLibrary.notThis`: « Pas ce poème »
- Coined by the desk: « Tiré de », « bibliothèque d’Ilya », « en orthographe moderne », « Pas ce poème ». Open choices for Dann: nested guillemets around the title; `{site}` in French («Wikisource en russe»).

## Out of scope (later builds)

The candidate list for weak matches; offers on stored songs; the Lyrics receipt line ("4 words repaired from the poem"); showing `editionAsNamed` (raw wikitext today, cleaned before it is shown; DESK DEFAULT, departs from the design's "from [edition]"); the shared register of people with Piece; growing the library (data only, no code).

## Done

Steps 0 to 6 pushed with reports; the eight gates at baseline plus the new tests; the byte count stated; nothing about the singer or the song leaves the device.
