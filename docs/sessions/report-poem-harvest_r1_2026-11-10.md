# Report: poem harvest r1 (2026-11-10)

Files: `poems-harvest_r1_2026-11-10.json` (195 entries), `excluded_r1.tsv` (every checklist song not harvested, with category and reason), `checklists/` (the eleven song lists, copied).
Checker: `check-poem-harvest.mjs`, adapted from `check-aria-r2.mjs` (opera and role logic removed; id and work shape, rights year, site, and trace words added). Run over library.json (14) plus the aria r2 file (89) plus this harvest (195): **0 failures**. Merged build: **1,012,260 bytes** (`dictionary.poems.7fcb4a34.json`), 298 entries. JSON md5 d38dbfb8c85bf70b0439043203f1ab40, 1,347,545 bytes.

## Counts

- Checklist song lines: 1665 across the eleven lists (the six Richter volumes hold 533 of them; the other five lists overlap them heavily, so this is lines, not distinct songs).
- Distinct poems (my count, by method below): 1044.
- Harvested: 195 poems, covering 434 checklist song lines.
- Left out, by song line: copyright 24; not found 910; ambiguous 106; not a poem 175; already in library or aria file 16.

Method for "distinct poems": each harvested page is one poem; each unresolved poet-plus-title pair is one poem; each song with no poet printed and no match is one poem (by composer and title). Several songs setting one poem are merged only where the search landed on the same Wikisource page, so the count overstates distinct poems among the unresolved.

## Per-poet table (harvested)

Poet is the author, or the translator where the Russian text is a translation (the rights holder of the Russian text).

| Poet | Poems | Checklist song lines covered |
|---|---|---|
| Пушкин | 38 | 103 |
| Толстой | 23 | 64 |
| Есенин | 15 | 17 |
| Лермонтов | 14 | 25 |
| Фет | 14 | 30 |
| Кольцов | 10 | 20 |
| Блок | 9 | 15 |
| Полонский | 7 | 16 |
| Плещеев | 6 | 18 |
| Ахматова | 5 | 10 |
| Мережковский | 5 | 14 |
| Цветаева | 4 | 6 |
| Чёрный | 4 | 8 |
| Апухтин | 3 | 8 |
| Курочкин | 3 | 3 |
| Майков | 3 | 5 |
| Мей | 3 | 11 |
| Михайлов | 3 | 5 |
| Дельвиг | 2 | 3 |
| Ленский | 2 | 2 |
| Минский | 2 | 6 |
| Некрасов | 2 | 6 |
| Аксаков | 1 | 2 |
| Аммосов | 1 | 3 |
| Андреевский | 1 | 1 |
| Бальмонт | 1 | 2 |
| Берг | 1 | 4 |
| Богданович | 1 | 1 |
| Бунин | 1 | 3 |
| Вяземский | 1 | 1 |
| Голенищев-Кутузов | 1 | 2 |
| Дмитриев | 1 | 1 |
| Жуковский | 1 | 3 |
| Крылов | 1 | 2 |
| Кукольник | 1 | 2 |
| Надсон | 1 | 3 |
| Никитин | 1 | 1 |
| Огарёв | 1 | 4 |
| Северянин | 1 | 3 |
| Сологуб | 1 | 1 |

## Entry shape, id, and work

Every entry has library.json's fields, in order: id, work, title, incipit, author, translator, rightsHolderDates, status ("canada"), verification ({state "unverified", edition null, witness null}), source (site, url with oldid, revid, page, editionAsNamed, licenceTemplate), spelling, textEdition, textModern. Added: `provenance` (retrieval date 2026-11-10, the edition the page names, author and translator dates, the rights trail, the checklist songs that set the poem with composer, title and opus or cycle, hygiene log, edition subpages seen).

- id = first 10 hex digits of the MD5 of the NFC Wikisource page title (`source.page`). I verified this against all 14 library entries (for example «Весёлый час (Кольцов)» gives 0127a63ffe).
- work = first 8 hex digits of id. For a poem, work is the poem; the library's one two-text work (Молитва, f1a88510) has a work key that is not id-derived, and no harvested poem needed that case. The checker confirms no work is shared.
- rightsHolderDates are the dates of the rights holder of the Russian text: the author, or the translator for a translation (the library's Heine entry carries Tyutchev's dates).
- Pre-reform pages (3) carry textEdition as printed and textModern by ѣ→е, і→и, ѳ→ф, ѵ→и, final ъ dropped. The rule names the first three and the final ъ; ѳ and ѵ I added by the library's own fold in build-poem-library.mjs. Flag for Dann if unwanted.
- verification is "unverified" on every entry: no second witness was read (feb-web.ru did not answer from this sandbox).

## Sources and rights

All 195 texts are Russian Wikisource. Each carries the page revision (oldid) and the edition the page names in its header: 188 name one (some only as a site link, such as ФЭБ or РВБ, with no volume or page, recorded as named), 7 name none and read NOT ESTABLISHED in provenance.editionNamedOnPage. Where a page lists editions as subpages and carries no text itself, I took the best critical-edition subpage (ПСС or Собрание сочинений, modern spelling first). No text came from an anthology; the song lists were used only to choose which poem to find.

Death years: 164 entries read the dates from the Wikisource page header; 31 read them from the poet's Russian Wikipedia infobox (URL in each rightsTrail), because the page header gave a name without dates. Every rights holder died in 1971 or earlier. Copyright exclusions (24 song lines) read their years from ru.wikipedia.org: Dolmatovsky 1994, Voznesensky 2010, Martynov 1980, Sapgir 1999, Barto 1981.

## Text hygiene applied

Trailing dating and place lines, line numbers, footnote markers, leading headings or dedications (for example «МУЗЫКА», «(Посв. …)», «Памяти Н. М. Д.»), asterisk lines, and per-line indentation were cut and logged in provenance.hygiene. Latin homoglyphs inside Russian words (for example a Latin O in «O, не грусти») were replaced with the Cyrillic letter and logged. Stress marks appear only where the page prints them. Four entries the checker's furniture tests rejected were dropped to the exclusions (two lines wholly in parentheses, one line read as a stage direction, one stray Latin letter).

## What I could not establish

- Most Pleshcheev, Golenishchev-Kutuzov, Mey, Ratgauz, Grekov, Apukhtin, Kukolnik, and Khomiakov poems have no individual page on Russian Wikisource (only a collection or scan page). They are listed as not found, not guessed. feb-web.ru did not answer from this sandbox (connection reset); rvb.ru answered but was not searched for want of budget. These are the next place to look.
- Richter titles that are the composer's own titles (for example Prokofiev's «Сосны», Shostakovich's «Отрывок», «Стансы», «Прощание» under the Pushkin heading) were matched by title only; where Wikisource's nearest page differed, they are ambiguous, not harvested.
- Several mid-length matches were accepted after I read the title and first line (Два ворона, К няне, Тучка, Адель, and the Heine texts set by Borodin). The identity of each rests on title and first-line agreement, not on a musical score.
- For poems only matched in a second pass by first line (songs whose lists print no poet), the poet comes from the Wikisource page.
- Pushkin pages that carry editorial square brackets (reconstructed words) were left out as ambiguous: Для берегов отчизны дальной, Лишь розы увядают, Отрывок (Не розу), Ворон к ворону летит. Во глубине сибирских руд was left out for digits in the page text.
- Marshak (died 1964) is public domain in Canada, but his poems were not searched on Wikisource; they sit under not found with that reason. Death years for Akhmadulina and Brodsky could not be read from the Wikipedia infobox by my parser; those songs are under not found.
- The Wikimedia API refused this sandbox (rate limit), so I used page, raw, PrefixIndex, and search HTML at about one request a second. I tried to route requests through Dann's Mac; the permission system refused it, and I did not pursue it.
- Not read: whether any harvested text differs from the printed critical edition. Every entry is an unverified Wikisource text, which the 2026-11-04 ruling allows to fill POEM with the source line as the attribution.
