# Report: poem library build 1, step 7, part 4, the ratified strings D1 to D4 (Code cloud lane, r1, 2026-11-04)

Brief: `brief-code-poem-library-build1-step7_r4_2026-11-03.md`, Part 4, and `review-fable-poem-build1-step7_r1_` amendments 12 and 13, `_r2_` amendment 11. Branch `cloud-lane-31`, on top of part 3. The strings are Dann's, ratified 2026-11-03 20:01 (D1 to D3) and 20:21 (every poem-card, gloss-offer, and TEXT header string); the comment in `i18n.ts` above the block says so, which words were adopted and which coined, and that the table and its pin change together (`CONTRACT.md` 11a).

## D1: the quote marks follow the sentence's language

English now quotes a Russian title or line in “…”; French stays « … » with no-break spaces (the French side did not change):

| Key | English now |
|---|---|
| `intake.poemLibrary.passage` | a passage beginning “{line}” |
| `intake.view.libraryPoem` | {author}, “{title}”, from {site}. |
| `intake.view.libraryPoemEdited` | Based on {author}, “{title}”, from {site}. |

**Not changed, and for Dann to say:** the card's own title line and first-line line (`PoemLibraryCard.svelte`) still print «Весёлый час» and «Дайте бокалы!» in guillemets in both languages. The brief lists three keys, those two lines are not sentences, and I changed nothing else. In English the card therefore shows « » on its title and line and “ ” in the sentences under POEM. If D1 should reach them, it is two template literals in the card.

## D2

`intake.poemLibrary.cardColours`: EN "Coloured words in LYRICS now show where your song departs from this poem."; FR « Les mots en couleur du champ PAROLES montrent maintenant où la mise en musique s’écarte de ce poème. »

## D3: the site's name per language, and its mechanism (r1 amendment 12)

New `lib/text/poem-site.ts`: `siteName(site, language)` looks the data's `source.site` up in a table keyed on that string and returns the key's text in the interface language, **falling back to the data's own string** for a site not listed. The one listed value is "Russian Wikisource" → key `intake.poemLibrary.site.russianWikisource`: EN "Russian Wikisource", FR « Wikisource en russe » (new key; the index header now counts 1,134 keys and `intake.` 49). It is applied wherever `{site}` is filled: the card's source line (`PoemLibraryCard.svelte`) and the two lines under POEM (`IntakeViews.svelte`, before `fillLibraryLine`). **The stored record keeps the data's string**: nothing in `poemSource` changed, and the data file is untouched. Tests: both languages, an unlisted site prints as the data has it, and the library's one site is listed (so no entry prints the English name in French).

## D4: the passage's wording (r1 amendment 13; r2 amendment 11)

`passageLine(text, start)` in `text/poem-source.ts`: join the stanza's lines with a space from its first line until the running count of words reaches four; drop the closing punctuation; **lower the first letter of each line after the first**. The ratified example is the oracle, and a test asserts it exactly: «Дитя моё,» + «Останься здесь со мной:» gives «Дитя моё, останься здесь со мной». It stops at the stanza's end. `resolveSource` uses it for a passage and keeps `lineAt` (the poem's first line) for a whole poem, so «Весёлый час» still names «Дайте бокалы!». DESK DEFAULT, as the brief says, Dann may revise.

**The library, every stanza start (the brief asks to report any joined line that begins with a proper noun).** 14 entries, 86 stanza starts, 17 joined lines that begin with a capital. **None is a proper noun**: the words are Борону, В, Дайте, И, Из, Мать-земля (a compound common noun), Много, На, Накормлю, Ночью, Ну, Останься, Пашней, С, Я. A test pins that list, so a library that grows and brings a new capital to a joined line fails it and the line is read, not lowered by habit.

**Things I saw in that scan, not asked, for Dann:**
- A joined line that follows a sentence end is still lowered: «Песня пахаря», a stanza starting «Весело на пашне.» / «Ну, тащися, сивка» reads «Весело на пашне. ну, тащися, сивка». That is the rule as written; a lowered capital after a full stop is wrong in prose.
- «Мцыри» has a stanza whose first line in the data is `________ и божья благодать сошла` (an underscore run, a data fault), which would read «________ и божья благодать сошла» as a passage wording. The library text was not touched.
- «На севере диком стоит одиноко» opens with the heading `ИЗ ГЕЙНЕ.` inside the text (known, step 4), and its passage wording would carry it.

## Tests

`text/poem-library-strings.test.ts` is now the ratified table (13 keys, the expected values copied from the brief, D1 to D3 included); `poem-source.test.ts` (passage wording, five cases, plus the library scan); `input-line.test.ts` (the English lines with “ ”); `poem-offer.test.ts` (fixture S's `firstLine` is now the oracle). The browser tests read the ratified wording: «a passage beginning “Дитя моё, останься здесь со мной”», the quiet line with “Весёлый час”, «Tiré de Wikisource en russe.», and the French line under POEM with «tiré de Wikisource en russe.»; **`e2e/poem-library.test.ts` 18 of 18 green.**

## Gates after part 4

| Gate | Part 3 | Now |
|---|---|---|
| web unit | 4135 + 1 skipped | **4144** + 1 skipped |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings (994 files) |
| ratchets | OK | OK |
| e2e | | `poem-library.test.ts` 18 of 18. The whole suite is Part 5's. |
