# Report: word marks saved, step 2, save and load (Code, cloud-lane-42, r1, 2026-11-10)

Branch `cloud-lane-42`. Files changed: `lib/library/document.svelte.ts`, `lib/library/word-mark-rows.ts`, `lib/text/word-marks.svelte.ts`, `lib/text/witness-lines.ts`, `routes/+page.svelte`; new `lib/text/spot-choice.ts`; tests `lib/library/document-word-marks.test.ts`, `lib/text/spot-choice.test.ts`, and edits to `word-marks.test.ts` and `witness-lines.test.ts`.

## What was built

1. **The document owns the marks** (Fable's amendment 1). `SongDocument` holds `lyricsMarks` and `poemMarks` (`WordMarks`). Its save effect reads them through `#snapshot`, so a mark change saves, and `close()` flushes the outgoing song's marks before the next document exists. The page's two constants became `$derived(doc.lyricsMarks)` and `$derived(doc.poemMarks)`, so every other page line is unchanged.
2. **Loading does not save** (amendment 2). Marks load in `#apply` under its `#applying` guard, the place the other fields load. All three ways a song opens reach `#apply` (boot and `switchSong` through the constructor, a remote write through `#onRemoteWrite`), so all three load (amendment 6). The page's `poemMarks.clear()` on a switch is removed, since the new document brings its own; `handleClear` still clears Lyrics' marks through `resetSessionState`, and a new song starts empty.
3. **The anchor is the text's word, ё folded, checked on the stored text before the first transcription** (amendment 3). `mapsFromRows` compares each row's anchor with `wordGrid(record.poem)` or `wordGrid(record.publishedPoem)` through `glossAnchorForm`. A row that fails is dropped and counted, with one `console.info` line naming the song (its name, else its id) and the count. The marks are in place before `transcribeText` runs, so the pipeline's first run and the seat heal at `:1934` read them.
4. **The pause gap is closed at save** (amendment 4). The document keeps `lyricsMarksGrid`, the words the Lyrics keys describe: the stored text's grid at load, then the grid of each transcription (`transcribeText` sets it). The record's rows are built through `rowsFromMaps` from that grid to the text as it stands, with `rekeyByWord` and `rekeyByWordChar`, leaving the live maps alone. The page's first transcription after a load now carries the marks from `lyricsMarksGrid` instead of from an empty diff, so a line typed above a mark before the first transcription moves it. The grid is a plain field, not reactive, so moving it is not a change to the song.
5. **Lyrics that come from the score** (amendment 5). With empty Lyrics at load, the rows are held: not applied, not dropped, and written back as held by any save in between. One page line, `$effect(() => doc.syncLyricsMarks(derivedPoem))`, tells the document the score's words once they exist. The marks then follow that grid, and the held rows are checked against it and applied, or against the singer's own text if she has typed Lyrics meanwhile. A re-read that changes a word drops that word's marks by the anchor.
6. **The Poem's marks after an emptied poem.** `carryPoemEdit` now clears the marks when there is no earlier text (`before` is empty). Marks are saved now, so marks left over from a poem that was emptied (Clear, "Not this poem") must not land on the words of the next poem. This was a latent session-only fault; saving would have kept it.
7. **The 22:20 ruling, option 2.** `spot` holds the singer's choice: `true` reconstituted, `false` reduced. A word with no entry follows the setting. `toggleSpot(key, setting)` now takes the setting: the box offers the opposite of the setting; ticking it saves that choice, and unticking removes the mark (the word follows the setting again). The page hands every existing surface a derived map of only the words whose choice differs from the setting now (`spotInversions`, `lib/text/spot-choice.ts`), which they read with `has(key)` as before. So `WordStack`, `VerseLine`, `drawPairings`, the provenance legend, PAPER, ReadingAid, and the Inspector are unchanged. A choice the singer made keeps its meaning when the setting changes: reconstituted stays reconstituted, reduced stays reduced.
8. **The global open-syllabification change** still clears both witnesses' syllable marks, and now the clear is saved because the maps are the document's.
9. **Comments that now state the opposite** (amendment 9) are corrected in `word-marks.svelte.ts`, `library/types.ts`, and `+page.svelte` (`:436-437`, the `resetSessionState` block, the `carryOverridesAcross` block).

## The page ceiling

`routes/+page.svelte` was at its ceiling of 5534. It is now 5523: the two derived maps, the effect, the two carry lines, and one import are paid for by removing the `WordMarks` import and `poemMarks.clear()`, and by shortening the two comment blocks above that were rewritten anyway. No ceiling in `scripts/ratchets.json` was changed, and the file can be lowered by 11 when Dann chooses.

## Decisions made here

- **A saved choice equal to the setting is kept, not removed.** If the setting is later turned on, a word she reconstituted draws as reconstituted exactly as before, and the box shows unticked (the box offers the opposite of the setting). Ticking it then sets "reduced". Her old mark is invisible while it equals the setting; the Inspector's per-word reset (`hasEdits`, `InspectorPanel.svelte:378`) does not light for it. This is the price of "survives a change of setting", and I judged it right; a smaller design would store only the inversion, which Dann ruled out.
- **`syncLyricsMarks` releasing held rows is a load**, so it runs under the same guard as `#apply` unless it dropped a row (a drop is worth saving).
- **A non-object `wordMarks` costs nothing**, step 1's decision, unchanged.

## Tests

`document-word-marks.test.ts` (10 tests): both witnesses load and write back; one of each kind through save and reopen; removing the last mark removes the rows; mark song A, switch to B, switch back (A has its mark and B has none); a word that moves takes its mark, a deleted word takes it away; the pause gap (a line typed above, no carry yet, the saved row lands on its own word and the live map is untouched); a row whose word is gone is dropped, counted, and named in one console line; a restored ё keeps its stress mark; held rows for score-derived Lyrics; a record from another tab replaces the marks. `spot-choice.test.ts` (5): the choice semantics across a change of setting, in both directions, and `load`/`maps`. `witness-lines.test.ts` (1): marks from an emptied poem do not land on the next. `word-marks.test.ts`: updated for the new `toggleSpot`.

## Gates

| # | gate | result |
|---|---|---|
| 1 | phonology | 456 passed |
| 2 | dictionary | 248 passed |
| 3 | web check | 0 errors, 12 warnings |
| 4 | web tests | 4736 passed, 1 skipped (step 1 was 4720, plus 16 new) |
| 5 | score-parser | 785 passed, 5 skipped |
| 6 | blurb | 168 passed |
| 7 | integration | 125 passed |
| 8 | ratchets | OK; `+page.svelte` 5523 of 5534, no ceiling touched |

## What I could not establish

- **That loading does not save, in a running app.** Runes are inert under vitest, so the save effect does not run in any unit test, including the new ones. The guard is the one `#apply` already used for every other field, and I could not observe `updatedAt` staying put across an open and a close. Step 4's Playwright test reloads and could read it back; I will report there what it does and does not cover.
- **That `syncLyricsMarks`' guarded release suppresses the save in a browser.** The guard is cleared on a microtask, as in `#apply`, and I did not verify the effect order for a mutation made inside an effect. At worst a held song saves once more than it needs to when its score words are read.
- **Real songs.** There are none with marks, so the anchor-drop path, the console line, and the held path are tested on constructed records only.
- **Two surfaces I did not trace beyond the grep:** `Pacifier.svelte` and `loader.ts` mention reconstitution; neither reads the spot map (the grep for `spotReconstitution` and `.spot` found no read there).
- **Whether lane 41 (poem library) writes `doc.publishedPoem` on a path that does not go through `handlePoemEdit`.** Today only `poem-offer.svelte.ts:190` and `:206` ("Not this poem" and its undo) do. While the poem is empty the saved rows have no word to anchor to and are left out; the live maps keep the marks, so an Undo of "Not this poem" brings them back, and a different poem entered next clears them (item 6). I found no path that puts a mark on the wrong word, but I did not run that sequence in a browser.
