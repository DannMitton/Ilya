# Report: poem library build 1, step 8, part 3, clean data and a check that keeps it clean (Code cloud lane, r1, 2026-11-04)

Brief: step 8 r2, Part 3. Branch `cloud-lane-31`, after part 2. No word of any poem changed beyond (e). I did not re-read the source pages in this session (no web access used); the stanza structure of (a) and the dating line of (d) follow the brief's reading of `oldid=5036885` and `oldid=5201296`. That is NOT ESTABLISHED by me.

## The changes, by entry (both `textModern` and `textEdition`, where the same fault stood in both)

| Entry | Change | Characters |
|---|---|---|
| `419e40dd3c` «С чужой стороны» | MediaWiki style block removed, from `.mw-parser-output` to the last `}` | 2,232 each field (offsets 134 to 2366 in `textModern`, as the brief says) |
| | four U+200E removed | 4 each |
| | the line number `5` and the U+00A0 after it, before «Про юную пальму» | 2 each |
| | stanza structure restored: the file had a blank line after every verse line; now two quatrains, single breaks inside each, one blank line between (8 verse lines checked) | the 4-break run before the style block and the doubled breaks are gone with it; `textModern` 2,500 to 254 chars (2,246 removed in all) |
| | the combining grave on «Что̀» left (the edition's) | 0 |
| `cb6998d772` | heading `ИЗ ГЕЙНЕ.` + its break (`textModern`); `ИЗЪ ГЕЙНЕ.` + its break (`textEdition`) | 10; 11 |
| `c1964bc3bd` «Мцыри» | the line `________` + its break (was at offset 549) | 9 each |
| `87376c1710` «Русская песня» | `8 декабря 1840Москва` to `8 декабря 1840\nМосква` | +1 each |
| `298e556367` «Молитва», pre-reform | Latin `i` U+0069 in «покаянiем» to «и» U+0438 (`textModern`); in «покаянiемъ» to «і» U+0456 (`textEdition`). **Rule 5 correction**, reason: a Latin letter inside a Russian word is a transcription fault, a letter and not a word; the edition's other nine «і» stand as U+0456 (the edition now has ten and no Latin letter). DESK DEFAULT, Dann may strike it | 1 each |
| `c1964bc3bd` «Мцыри» | 25 runs of three or more line breaks collapsed to two (the brief's "25 in «Мцыри» and 1 in `419e40dd3c`"; the one in `419e40dd3c` went with its restructuring above) | 50 each |

`built`, ids, titles, authors, `source`, `verification` untouched. The file is `data/dictionary.poems.2e56f692.json`, **129,444 bytes** (was 131,860), manifest `poemHash` `2e56f692`.

## «Русская песня» and the dating block (d)

`isDateline` (`poem-source.ts:42`) now accepts a closing block of **at most two lines and four words in all, holding a four-digit year**. With the line break restored, the old rule (one line) made `8 декабря 1840` / `Москва` a stanza; `poem-source.test.ts`'s `ends['Русская песня']` failed until it was widened, and that failure was the check (I also ran the old rule against the tests: three fail). «Русская песня» now fills ending at **«Сам с собою грущу…»**.

## The build check

`scripts/build-poem-library.mjs` exports `TEXT_FAULTS` and `textFault`, and `shipEntry` throws `library entry <id>: "textModern" holds <fault>` for: `{` or `}`; `.mw-`; U+200E or U+200F; three or more underscores; three or more line breaks; a Latin letter (`\p{Script=Latin}`); a digit glued to a letter; or a line of one to three digits and a space or U+00A0 and a letter with no four-digit year (a line number; «8 декабря 1840» passes). `tests/build-poem-library.test.ts` feeds each fault (ten cases) and the clean library, checks the dating lines (one line, two lines, «Февраль 1837», «1830») pass, and pins the data fixes above entry by entry.

## One consequence the brief did not name

The data fixes change the stanza structure, so the pinned review of capitalised joined lines (part 4 of step 7) had to be redone, not renumbered: the library now has **77 passage-start stanzas** (a dating block is not one), and the joined lines that begin with a capital are Борону, В, Дайте, Из, Мать-земля, Много, На, Накормлю, Ночью, Ну, Останься, Пашней, С, Я. **None is a proper noun.** The earlier «И» (the removed underscore stanza) and the Heine heading's «На» joined line are gone with the data faults. The test now iterates the body stanzas.

## Gates

web unit 4159 + 1 skipped (4160 total: part 2 had 4160), integration 125 (was 113: +12 for the check), svelte-check 0 errors, 12 warnings, ratchets OK. Full browser suite after part 5.

## NOT ESTABLISHED

- The source pages themselves (not re-read here); the structure of `419e40dd3c` and the dating line of «Русская песня» are the brief's reading.
- That no other fault the check does not name sits in a text (the check names seven faults and the line number; the clean library passes it, nothing more is claimed).
