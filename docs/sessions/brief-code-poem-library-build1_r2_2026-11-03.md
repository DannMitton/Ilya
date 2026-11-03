# Brief for Code: the poem library, build 1 (Ilya fills Poem from its own library on a confident match) (desk, r2, 2026-11-03 15:1x)

r2 puts the singer's experience first (Dann 15:00 and 15:05: *"the driving impulse needs to be friendliness, intuitiveness, and ease on the part of the user"*; design 1, the arrival card, chosen 15:05). r1 is superseded.

NOT Fable-reviewed. Fable reviews this file before Code gets it (`CONTRACT.md`).

## The singer's walk (this governs; the code serves it)

She drops a scan of a song. Lyrics fills, as today. Then:

1. **She sees** a card, once, where she is looking: «Весёлый час», its first line «Дайте бокалы!», and Кольцов. Below, small: "From Russian Wikisource." (a pre-reform source adds ", in modern spelling") Below that: "Coloured words in Lyrics show where the song departs from the poem." Two buttons: **Keep it** (first) and **Not this poem**.
2. **She wonders,** in order: what is this; is it my song's poem; can I trust it; what if it is wrong. The card answers them in that order: recognition (title, first line, poet), then the source, then what changed in Lyrics, then her choice.
3. **She taps Keep it.** The card folds to one quiet line under Poem: "Кольцов, «Весёлый час», from Russian Wikisource."
4. **Or she taps Not this poem.** Poem empties, the colours in Lyrics clear, and a line reads "Poem removed." with **Undo**, until she leaves the song. Ilya never offers that poem for that song again, across sessions.
5. **Or she ignores the card** and keeps working. The poem stays (Dann 02:17: fill); the card waits for her next visit to the song, until she answers it.
6. **She edits the poem** (a typo, her edition's variant). The poem is hers now, and its source still shows: "Based on Кольцов, «Весёлый час», from Russian Wikisource." Attribution is never dropped silently.
7. **Her own poem always wins.** A paste or a poem page replaces the library's (today's replace guard asks first), and the source line goes.
8. **Nothing she did not ask for happens later:** no fill on typing, no fill when she reopens a stored song, no fill over a Poem she filled.

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
4. **The fill and the song's memory.** On a confident match, set Poem to the entry's `textModern` through the same path a pasted poem takes, so differences, omissions, the tiers, and Revert work unchanged. Add to `SongRecord` (stored; old records read as empty): `poemSource: { id, work, poemHash, answered: boolean, edited: boolean } | null` and `poemDeclined: string[]` (works she said no to). An edit to Poem sets `edited`; a paste or poem page replacing it sets `poemSource` to `null`. A work in `poemDeclined` is never filled for that song.
5. **The card and the lines** (walk items 1 to 6). Step 0 names the view the singer is on after each arrival (file, scan, paste); the card shows above the field in that view, once per song, until answered. Keep it sets `answered`. Not this poem clears Poem, adds the work to `poemDeclined`, and shows the removed line with Undo until she leaves the song (Undo restores Poem and `poemSource` and removes the work from `poemDeclined`). `introLine` (`lib/text/input-line.ts`) returns the quiet line or the based-on line while `poemSource` is set, else today's lines. Focus goes to the card's first button for keyboard and screen-reader users; the card reads as one group with a name.
6. **Gates and the walk.** The eight gates. End-to-end, on row 114 song 2's fixture pasted into an empty song: the card shows «Весёлый час», «Дайте бокалы!», Кольцов; Keep it folds it to the quiet line; a second run taps Not this poem, Poem empties, Undo restores it; a third run declines, reloads, and the poem is not offered again; an edit shows the based-on line.

## Strings (desk drafts for Dann; not ratified)

| key | English (desk) | French (desk draft) |
|---|---|---|
| `intake.poemLibrary.cardHeading` | Ilya found this poem for your song: | Ilya a trouvé ce poème pour votre chant\u00a0: |
| `intake.poemLibrary.cardSource` | From {site}, in modern spelling. | Tiré de {site}, en orthographe moderne. |
| `intake.poemLibrary.cardColours` | Coloured words in LYRICS show where the song departs from the poem. | Les mots en couleur du champ PAROLES montrent où le chant s’écarte du poème. |
| `intake.poemLibrary.keep` | Keep it | Le garder |
| `intake.poemLibrary.notThis` | Not this poem | Pas ce poème |
| `intake.view.libraryPoem` | {author}, «{title}», from {site}. | {author}, «\u00a0{title}\u00a0», tiré de {site}. |
| `intake.view.libraryPoemEdited` | Based on {author}, «{title}», from {site}. | D’après {author}, «\u00a0{title}\u00a0», tiré de {site}. |
| `intake.poemLibrary.removed` | Poem removed. | Poème retiré. |
| `intake.poemLibrary.undo` | Undo | Annuler |

"in modern spelling" shows only for a `pre-reform` source; for a `modern` one the card reads "From {site}." / « Tiré de {site}. ». French adopted from `lib/i18n.ts`: « poème », « chant », « les mots en couleur », « le champ PAROLES », « s’écarte » (from « s’en écarte », `landedLyrics`), the no-break space before a colon. Coined by the desk: « Tiré de », « en orthographe moderne », « Le garder », « Pas ce poème », « D’après », « Poème retiré », « Annuler » (check the file for an existing Undo first). Open choices for Dann: nested guillemets around a Russian title; `{site}` in French («Wikisource en russe»).

## Out of scope (later builds)

The candidate list for weak matches; offers on stored songs; the Lyrics receipt line ("4 words repaired from the poem"); showing `editionAsNamed` (raw wikitext today, cleaned before it is shown; DESK DEFAULT, departs from the design's "from [edition]"); the shared register of people with Piece; growing the library (data only, no code).

## Done

Steps 0 to 6 pushed with reports; walk items 1 to 8 each shown by a test; the eight gates at baseline plus the new tests; the byte count stated; nothing about the singer or the song leaves the device.
