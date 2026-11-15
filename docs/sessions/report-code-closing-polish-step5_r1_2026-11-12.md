# Report: closing polish lane, step 5, Latin words as ruled 2026-11-09 23:32 (Code, cloud-lane-48, r1, 2026-11-12)

Amendments 8, 9, and 10 govern; where they differ from the step's text I followed them.

## What changed

**Builder, `scripts/build-poem-library.mjs`**
- `isLatinWord(word)`: at least one letter, and every `\p{L}` is `\p{Script=Latin}`. The builder applies it to each run of `[\p{L}\p{M}]` (`WORDS`). (Amendment 8.)
- `textFault(text)`: the second parameter is gone (nothing needs it). A Latin letter touching a Cyrillic one is a fault for a poem and a libretto alike (`GLUED_LATIN`, now the table's row "a Latin letter glued to a Russian word"). A whole Latin word passes in a poem. New `latinTextFault`: a line that is only a Roman numeral is refused (`[IVXLCDM]+` with an optional full stop or bracket; capitals only, so lower-case «mi» is a word), and a one-letter Latin word in a line that also holds a Cyrillic word is refused, at any position (Amendment 9). `shipEntry` calls `textFault(e.textModern)`.
- The clean library still passes: 327 entries, no fault, and the poem file is unchanged (hash `83fa37e8`, built in step 4).

**App, `apps/web/src/lib/latin.ts`**
- `isLatinWord` uses the same test, applied to the `cleanWord` as the pipeline made it (`pipeline.ts:586`, `:671`); it does not split again (Amendment 8). «à» and «cœur» are now marked Latin, so `VerseLine.svelte:26-28` and `page-fit.ts:75`, `:130` keep them.
- `markLatinWords` gives the table's IPA only when the text holds at least two DIFFERENT nouns of the table, every key but `et` and `atque` (`isSeminarianText`). Without that, a Latin word is marked, kept, and has no IPA, so `showsRichterIpa` is false and no Richter credit is drawn.
- Three rows moved to Grayson's softening limits (p. 209): `pulvis` `ˈpul vʲis`, `amnis` `ˈɑm ɲis`, `axis` `ˈɑk sʲis` (`latin.ts:40`, `:43`, `:50`). `footer.richter` is not changed.

## Tests

- `tests/build-poem-library.test.ts` (gate 7: 155 to 159 passed, re-run after this step): «I» alone fails; «Он пришёл c ней» (Latin c) fails; «C тобой» (Latin C) fails; a Latin a at a line's end fails; «à ce soir» and a French line with «Ça va, mon cœur» pass; «мeня» (Latin e) fails; a line «IV.» fails; one word list runs through the builder's `isLatinWord` and the app's (the equality test, Amendment 8). Pins moved: the fault table's Latin row (`:176`, now named for the glued letter) and `:384-387` (`textFault(quoted)` for a poem is now null; the two glued cases still say "glued").
- `src/lib/latin.test.ts`: the table's three rows; «à» and «cœur» marked Latin on a page; «et» alone in a French line gets no IPA and no credit; «panis et vinum» and «panis panis et» (one noun) show no credit; «Panis et piscis» keeps «et» as `ɛt` and shows the credit; «et atque panis» shows none. The thirty-row loop now runs each word beside two other nouns, so every row stays in «Семинарист»'s text.

## Gates after this step

Web unit suite: 282 files, 5241 passed, 1 skipped. Ratchets OK. Integration suite (gate 7): 7 files, 159 passed.

## Reports the step asked for

- **Does a Latin word reach `provenance.ts:215`?** It can be in `lines` there, but the loop skips any word whose `cyrillic` holds no Cyrillic letter, and a Latin word's `cyrillic` is its Latin text, so it is skipped. And the only entries tested there are keys of `spotReconstitution`, which the engine fills for Russian words. Unchanged, as the desk default says.
- **«Семинарист» as a seated song, MELODY and INSIGHTS (Amendment 10).** Read, not run in a browser. The page's transcription is `processText(doc.inputText)` over the whole of Lyrics (`routes/+page.svelte:1805`), so it holds every noun of the table, and the table's IPA applies; MELODY and INSIGHTS take that transcription's `lines`. The `.latin` mark itself is read only by display code (`VerseLine.svelte`, `WordStack.svelte`, `page-fit.ts`), not by `score/` code. Whether the vowel resolver reads a Latin word's `ipaDisplay` is NOT ESTABLISHED.
- **Callers whose text is too short for two nouns.** `underlay-seams.ts:59` calls `processText` one printed line at a time and reads `cleanWord` and the clitic flags only. `text/poem-join-wire.ts:34` (`slotsFor`) transcribes a run of words and reads `cyrillic` only. Neither reads IPA, so the new rule changes nothing for them. `score/vowel-resolver.ts:476` and `score/clitic-seat.ts:491` send a verse's whole score words.
- **`NOTICES.md:17-28` says the pronunciation is Richter's.** Not edited, as the amendment says. Owed with the footer's wording ("after Richter, adapted to Grayson's rules"), once its French is ruled: after this step the three rows named above depart from Richter's table, and the notice still says the pronunciation is Richter's.

## Not in this lane: a Latin word on a scan marked for checking (stop)

Where the scan reader would mark it: NOT ESTABLISHED as a word-level mark; none exists. What does exist: `omr/underlay-language.ts` (`RowLanguage`, `RUSSIAN_SHARE`, `MIN_LETTERS`) judges a whole text row 'russian' or 'other', so a row of Latin words falls out as 'other'; and "to check" in the scan flow is a list of bars (`score/loupe-print.svelte.ts:8`, `:111`), not of words. I stopped there, as the step says.

## What I could not establish

- A browser render of a page with «à» (the line keeping it, in italics).
- A one-letter Latin word the guard wrongly refuses: «a» in an English line quoted inside a Russian line would be refused (by the ruling's own guard).
