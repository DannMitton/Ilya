# Report, row 179, step 1: the edit carries its language, and one function resolves (cloud-lane-44, 2026-11-10)

Brief: `brief-code-gloss-language-and-reuse_r3_2026-11-03.md`, step 1. Base: `e8d706e` on `cloud-lane-44`. This commit also corrects three line ranges in the step 0 report.

## What changed

- **New `apps/web/src/lib/text/gloss-edit.ts`.** `GlossEdit = { en?; fr? }`; `glossFor(word, language, songEdit, glossary)` returns `{ text, source }` with `source` one of `'song' | 'glossary' | 'dictionary' | 'none'`; `resolvedGlosses(lines, edits, language, glossary)` builds the map the readers take; `editsFromRows`, `rowsFromEdits`, and `withGlossEdit` convert and edit. Pure TypeScript, no runes.
- **Order in `glossFor`.** The song's edit in that language first (an empty edit counts: it is the singer's "no gloss here"), then the dictionary's displayed gloss (`word.gloss`), then the glossary, then nothing. The glossary is a parameter and its store is step 2; nothing passes one yet, so the page passes `null`.
- **Stored row.** `GlossRow` gains an optional fourth element, `'en' | 'fr'` (`library/types.ts:49`). A row with no fourth element, or one that is neither value, reads as English (`editsFromRows`). Rows are written tagged on the song's next ordinary save, one row per language, English then French. `validateRecord` keeps its filter unchanged, so a stray fourth element is neither dropped nor malformed.
- **Types that changed from `Map<string, string>`:** `SongFields` (`library.ts:52-53`, `:74`), the document's two pairs (`document.svelte.ts`), and the page's `shownGlosses`. `survivingGlosses` in both files, `carryPoemEdit`, and `resetWord` are now generic over the value, so they keep their key logic and their tests. `rekeyByWord` was already generic.
- **Readers.** `Paper`, `ReadingAid`, `TitlePage`, `SubsequentPage`, `TextFitProbe`, and `VerseLine` carry `Map<string, ResolvedGloss>` and pass it through unchanged; `VerseLine.svelte:82` reads `.text` for `WordStack`, whose prop stays a string. The Inspector's `glossOverride?: string` became `gloss?: ResolvedGloss`, and `hasOverrides` reads `gloss?.source === 'song'`. The map holds an entry only where the song (or, from step 2, the glossary) decides; a word the dictionary decides has no entry and the reader's own `word.gloss` stands, as before.
- **Page.** `shownEdits` replaces the old `shownGlosses` line (`+page.svelte:466`); the new `shownGlosses` is derived after `effectiveLines` from `resolvedGlosses`. `handleGlossOverride` now calls `withGlossEdit` with the language on screen, so a typed gloss lands in that language and the other is left alone. `handleReset` passes `shownEdits`, and `resetWord` deletes the whole value, so Reset clears both languages at once.

## Ceilings

`+page.svelte` went from 5534 to 5526 lines: `handleGlossOverride` shrank by 7 and the new derived line added 1 net of the import (on an existing line). `InspectorPanel.svelte` stays at 2432 (the new import shares the `gloss-resolve` line). I did not lower the `+page.svelte` ceiling in `scripts/ratchets.json`: lanes 39 to 43 edit that file too, and a changed number there is a certain merge conflict. The desk can lower it to 5526 at merge.

## Tests

New `text/gloss-edit.test.ts` (14 tests): an English edit does not show in French and the reverse; an empty edit is not an absence; the glossary fills only where the dictionary's gloss is empty and the song has no edit; a legacy row shows in English and not in French; a fourth element of `'de'` reads as English and is not malformed; two rows on one key are one edit in two languages and write back tagged; a legacy row is written tagged on the next save; a French row survives JSON the way a binder carries it; `withGlossEdit` sets one language, takes one away, and does not mutate its input; Reset clears both languages and the anchor. `library.test.ts` fixtures updated to the nested shape and the tagged rows.

Walk items covered here: 6 (language), and the Reset half of 8. Item 7 needs no code (a correction of a dictionary gloss was already an edit in its song; no offer exists yet).

## Gates

All eight pass after this step: `test:phonology`, `test:dictionary`, `@ilya/web check`, `@ilya/web test`, `@ilya/score-parser test`, `test:blurb`, `test:integration`, `ratchets`. No ceiling raised.

## What I could not establish

- Whether an older Ilya reading a song with both an English and a French row on one key keeps the English one. The older reader sets each row's key in turn, so it keeps the later row, which is French (rows are written English then French). I did not run an old build. The brief's "an older Ilya reads the row unchanged" holds for a song with one language; for a song with both, the older Ilya would show the French text as an English gloss until the next save by a current Ilya. The brief names no rule for this. DESK DEFAULT: leave it (no release has shipped, and Dann 2026-11-03 15:21 treats stored songs as exploration until release).
- Anything in the browser. No step so far has been run in a page; step 3 carries the phone-width run.
