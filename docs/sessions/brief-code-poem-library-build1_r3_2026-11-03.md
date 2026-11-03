# Brief for Code: the poem library, build 1 (Ilya fills Poem from its own library on a confident match) (desk, r3, 2026-11-03 15:4x)

r2 put the singer's experience first (Dann 15:00 and 15:05: *"the driving impulse needs to be friendliness, intuitiveness, and ease on the part of the user"*; design 1, the arrival card). r3 applies Fable's review, from the singer's point of view, all 15 amendments (`review-fable-poem-build1_r1_2026-11-03.md`, verdict SEND WITH AMENDMENTS, 180k Fable tokens). r1 and r2 are superseded. Strings are desk drafts, not ratified.

## The singer's walk (this governs; the code serves it)

She drops a scan of a song. Lyrics fills, and she lands on LYRICS, as today. Then:

1. **She sees** a card above the field she is looking at (LYRICS or POEM). It names the poem the way her score does: the title «Весёлый час», the first line of the stretch her song sets («Дайте бокалы!»), and the poet, Алексей Васильевич Кольцов (with "translated by …" when the Russian is a translator's). Below, small: "From Russian Wikisource." (a pre-reform source adds ", in modern spelling"). Then: "Coloured words in LYRICS show where the song departs from the poem." Two buttons: **Not this poem** and **Keep this poem**. Nothing takes her focus; she reads, looks at POEM if she likes, then answers.
2. **She wonders,** in order: what is this; is it my song's poem; can I trust it; what if it is wrong. The card answers in that order: recognition, then source, then what changed in LYRICS, then her choice.
3. **She taps Keep this poem.** The card folds to one quiet line under POEM: "Алексей Васильевич Кольцов, «Весёлый час», from Russian Wikisource."
4. **Or she taps Not this poem.** POEM empties, LYRICS returns exactly as it was before the poem arrived, and a line reads "Poem removed." with **Undo**, until she leaves the song. Ilya does not offer that poem for that song again this session.
5. **Or she ignores the card.** The poem stays (Dann 02:17: fill); the card shows on her next visit to the song until she answers it.
6. **She edits the poem** (a typo, her edition's variant). It is hers now; the card folds, and its source still shows: "Based on Алексей Васильевич Кольцов, «Весёлый час», from Russian Wikisource." Attribution is never dropped silently.
7. **Her own poem always wins.** A paste or a poem page replaces an unedited library poem with no question; the replace guard asks, as today, only over a poem she filled or edited.
8. **Her song sets a passage of a long poem** (song S sets the golden fish's song in «Мцыри»). POEM fills with the stanzas her song sets, not the whole poem, and the card says so: «Мцыри», a passage beginning «Дитя моё, останься здесь со мной». (DESK DEFAULT, reversible.)
9. **Nothing she did not ask for happens later:** no fill on typing, no fill when she reopens a stored song, no fill over a Poem she filled, no fill for a cycle of several songs.

Design: `docs/sessions/design-onboard-poems_r2_2026-11-03.md` (Dann's decisions 1 to 3: fill; poets dead by 1971; modern spelling). Threshold: `~/Downloads/_desk-2026-11-03/report-desk-poem-threshold_r1_2026-11-03.md` (desk only; its numbers are repeated here).

## Inputs in the repository (committed `1a05b7e0`)

- `tools/poems/library.json`: 14 entries, 12 works, 108,533 bytes. Each entry: `id`, `work` (two entries of one work share it), `title`, `incipit`, `author`, `translator`, `rightsHolderDates`, `status` (all `canada`), `source` (`site`, `url` with revision id, `revid`, `page`, `editionAsNamed` raw, `licenceTemplate`), `spelling` (`modern` or `pre-reform`), `textEdition`, `textModern`.
- `tools/poems/reference_sw_match.py`: the reference matcher. Letters only: lowercase; ѣ→е, і→и, ѳ→ф, ѵ→и, ё→е, й→и; ъ dropped; everything outside а-я dropped. Smith-Waterman local alignment, match +2, mismatch −1, gap −2. Score = best local score ÷ (2 × query letters). A work's score is its best entry's.
- `tools/poems/fixtures/`: 12 read Lyrics (public-domain poems only) and `expected_r1.txt`, the reference scores.

`data/` is served whole (`apps/web/static/data` is a symlink to `../../../data`), so nothing under `tools/` is served.

## Rules for the match (DESK DEFAULT, measured, not tuned)

- Fill only when the top work scores at least **0.15**, beats the second work by at least **0.10**, and the query's letters are at most **3 ×** the matched entry's letters (a cycle of several songs gets no fill; the fixtures run 0.017 to 1.46, so no expected result changes; Fable amendment 12).
- Measured on the 18 build songs: true 0.293 to 0.921; no poem in the library 0.017 to 0.062. At 1,009 works (desk scale test): chance at most 0.088. Row 114 measured, never tuned: songs 2 to 5 fill (0.271 to 0.447), song 1 fills nothing (0.053).
- Which entry of a work fills: the best-scoring; on a tie within 0.01, the `modern` entry (amendment 10).
- On a phone, aligning against a large library is too slow. Shortlist the 20 works sharing the most letter trigrams with the query, then align the shortlist only. With 12 works the shortlist is everything.

## Steps (one commit and one report per step, on `cloud-lane-31` from `origin/Shane`, push after each)

0. **Measure only.** Name, with file and line:
   - the three arrival sites where Lyrics is filled (the file fill near `routes/+page.svelte:2829`; the Lyrics paste through `handlePoemInput` near `:2360-2363`; the scan's site, NOT ESTABLISHED by the review);
   - what a Poem arrival does to Lyrics today (`adoptPoemLines` → `handleInput`, `:2372-2375`; `text/relining.ts`; whether words are repaired or only re-lined);
   - the replace guard (`routePoemPage`, `handlePoemPage`, `:2391-2403`); Poem's Clear (`:3976`, writes `doc.publishedPoem = ''` directly);
   - the values of `TextArrival` and what `IntakePanel` passes for a typed key and a paste; whether `lyricsTakesPoem` is false for a non-empty Lyrics;
   - `introLine` (`lib/text/input-line.ts:12-16`); the six places a stored field lives (step 4);
   - the loader (`lib/loader.ts`: `DictionaryManifest` `:113-120`, `cleanLegacyCache` `:296` called at `:730`, `scheduleGlossTier` `:653-675`, `loadDictionary` `:683`, the tier scheduling near `:790`) and the worker's dictionary exemption (`static/sw.js:100`).
   - Run the eight gates for a baseline. Report; change nothing.
1. **The data build.** `scripts/build-poem-library.mjs` reads `tools/poems/library.json` and writes `data/dictionary.poems.<hash8>.json` (the name passes `sw.js:100`, so the worker never stores it twice) holding, per entry, `id`, `work`, `title`, `incipit`, `author`, `translator`, `source.site`, `source.url`, `spelling`, `textModern`, and the letter stream with a map from each letter back to its offset in `textModern`. It adds `poemFiles` and `poemHash` to `data/dictionary-manifest.json`, never touching `hash`. State the byte count (`CONTRACT.md` §8).
2. **The loader.** Fetch the poem file in the background after the app is interactive, as `scheduleGlossTier` does; store it in IndexedDB under `poems-<poemHash>`; read it from there when offline. Export the library as a promise that resolves to it, or to `null` on failure (amendment 13). `cleanLegacyCache` takes the poem hash as a second argument, deletes stale `poems-` keys, and keeps the current one. A missing or failed poem file leaves the app as it is today (no fill, no message).
3. **The matcher.** `lib/text/poem-match.ts`, pure, no DOM: the letter fold, the trigram shortlist, Smith-Waterman as specified, with a traceback giving the matched stretch's start and end in the entry (amendment 1); the threshold, margin, length guard, and entry choice. Test: every fixture's top work and score match `expected_r1.txt` to three decimals; P, S, T, U1, U6, and row 114 songs 2 to 5 fill; U4, U5, and row 114 song 1 do not; a five-song concatenation of fixtures does not.
4. **The fill and the song's memory.**
   - Hook the match at the three arrival sites from step 0, never inside `handleInput` (amendment 11: `claimDerivedPoem`, `:2348-2357`, calls it with the default `how` of `'paste'` on a keystroke). The match awaits the library promise; at fill time it re-checks that `doc.id` is still the song it started on and Poem is still empty.
   - The text that fills: the entry's `textModern`, cut to the whole stanzas (blank-line blocks) containing the matched stretch when the stretch covers less than the whole poem; otherwise the whole poem. Fill through the path a pasted poem takes, so differences and omissions work unchanged.
   - Before the fill, keep `doc.inputText` (and anything else the step 0 report shows a Poem arrival changes) in memory, so a decline restores it byte for byte (amendment 3).
   - Stored: `poemSource: { id, work, poemHash, start, end, answered, edited } | null` (`start`, `end`: the stanza cut, offsets in `textModern`). Title and author are looked up by `work`, never stored (`CONTRACT.md:144`). Add it in all six places (amendment 14): `SongRecord` (`types.ts`, optional and additive, as `publishedPoem` at `:199`), `SongFields` (`library.ts:70`), `fieldsFromRecord` (`:104`), `recordFromFields` (out of `base` at `:121`, written only when set, `:141`), `validateRecord` (`:264-265`), and the document's `$state`, `#snapshot` (`document.svelte.ts:296`), and `#apply` (`:351`). `RECORD_SCHEMA` stays 1.
   - A decline is held in memory for the session, per song and work, beside `inputViews.#memory` (`input-views.svelte.ts:46`); nothing about a decline is stored in build 1 (amendment 5).
   - Transitions (amendment 6): an edit to Poem sets `edited` and `answered`; Poem's Clear (`:3976`) sets `poemSource` to `null`; a paste or poem page replacing it sets `poemSource` to `null`; the replace guard does not ask when `poemSource` is set and `edited` is false (amendment 9).
5. **The card and the lines** (walk items 1 to 8).
   - The card shows above the field in whichever view is showing (every arrival lands on LYRICS, `+page.svelte:2829`, `input-views.svelte.ts:85-88`), on every visit to the song until answered; the "Poem removed." line shows the same way until she leaves the song (amendment 2).
   - No focus moves when it arrives. It is `role="group"`, named by its heading, placed before the field in tab order; its heading is announced through an `aria-live="polite"` region (amendment 4).
   - It shows the matched stretch's first line, and for a passage the passage wording (walk item 8); the poet as the data's `author` field prints it, the full name, with no surname derivation (amendment 8), and "translated by" where `translator` is set (amendment 7).
   - Button order: **Not this poem**, then **Keep this poem**, following the page's rule that the last answer is the safe one (`+page.svelte:2427`, `:2434`). DESK DEFAULT, open for Dann.
   - Keep this poem sets `answered`. Not this poem empties Poem, restores Lyrics from step 4's memory, records the session decline, and shows the removed line with Undo; Undo restores the state before the tap: the poem, `poemSource`, Lyrics as filled, and the card if it was unanswered.
   - `introLine` takes `poemSource` and, in the POEM view only, returns the quiet line or the based-on line; under LYRICS, `lyricsLine` stands (amendment 15). When the library has no entry for the stored `work` (file not loaded, or a later library dropped it), it falls back to `poemLine`.
6. **Gates and the walk.** The eight gates. End to end, on row 114 song 2's fixture pasted into an empty song:
   - the card shows «Весёлый час», «Дайте бокалы!», Алексей Васильевич Кольцов, in the LYRICS view, and focus has not moved;
   - Keep this poem folds it to the quiet line, which shows under POEM only;
   - a second run taps Not this poem: Poem empties, `doc.inputText` equals its value before the fill, and Undo restores the filled state;
   - a third run edits Poem: the based-on line shows, and a pasted poem then replaces it with a question;
   - fixture S fills the stanzas of the fish's song only, and the card shows the passage wording;
   - a reload of a song with an unanswered card shows the card again.

## Strings (desk drafts for Dann; not ratified)

| key | English (desk) | French (desk draft) |
|---|---|---|
| `intake.poemLibrary.cardHeading` | Ilya found this poem for your song: | Ilya a trouvé ce poème pour votre chant : |
| `intake.poemLibrary.by` | {author}, translated by {translator} | {author}, traduit par {translator} |
| `intake.poemLibrary.passage` | a passage beginning «{line}» | un passage commençant par « {line} » |
| `intake.poemLibrary.cardSource` | From {site}. | Tiré de {site}. |
| `intake.poemLibrary.cardSourceModernized` | From {site}, in modern spelling. | Tiré de {site}, en orthographe moderne. |
| `intake.poemLibrary.cardColours` | Coloured words in LYRICS show where the song departs from the poem. | Les mots en couleur du champ PAROLES montrent où la mise en musique s’écarte du poème. |
| `intake.poemLibrary.notThis` | Not this poem | Pas ce poème |
| `intake.poemLibrary.keep` | Keep this poem | Conserver ce poème |
| `intake.view.libraryPoem` | {author}, «{title}», from {site}. | {author}, « {title} », tiré de {site}. |
| `intake.view.libraryPoemEdited` | Based on {author}, «{title}», from {site}. | D’après {author}, « {title} », tiré de {site}. |
| `intake.poemLibrary.removed` | Poem removed. | Poème retiré. |
| `intake.poemLibrary.undo` | Undo | Annuler |

French adopted from `lib/i18n.ts`: « poème », « chant » (`:1663`), « les mots en couleur », « le champ PAROLES », « la mise en musique » and « s’écarte » (`landedLyrics`, `:829`), « Conserver » (`:843`, `:1663`), « Retirer » (`:875`), « Annuler » (`clitic.undo`, `:407`), the no-break space before a colon. Coined by the desk: « Tiré de », « en orthographe moderne », « Pas ce poème », « D’après », « traduit par », « un passage commençant par ». Open choices for Dann: whether to keep `cardColours` (under LYRICS it restates `lyricsLine`, and on a phone it is the line that wraps); the button order; nested guillemets around a Russian title, or the title unquoted; `{site}` in French («Wikisource en russe»).

## Out of scope (later builds)

The candidate list for weak matches; offers on stored songs (and with them a stored decline list); the Lyrics receipt line ("4 words repaired from the poem"); showing `editionAsNamed` (raw wikitext today, cleaned before it is shown; DESK DEFAULT, departs from the design's "from [edition]"); the shared register of people with Piece; growing the library (data only, no code; entries are single poems, collection pages split into their poems, and near-identical entries merged into one work).

## Done

Steps 0 to 6 pushed with reports; walk items 1 to 9 each shown by a test; the eight gates at baseline plus the new tests; the byte count stated; nothing about the singer or the song leaves the device.
