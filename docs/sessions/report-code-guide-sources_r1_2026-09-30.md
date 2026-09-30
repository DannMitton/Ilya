# Report: a Sources section in the Guide, from one list of works

Written by Code 2026-09-30, for `brief-code-guide-sources_r1_2026-09-27.md` (`QUEUE.md` row 4). Read against branch `Shane` at `6d87638`, working tree dirty with rows 2c, 3, and this one. Nothing committed. Status: **WRITTEN**. It becomes DONE when you walk the section in both languages.

## What was built

- **`apps/web/src/lib/sources.ts`** is the one registry of works. It came from `comment-sources.ts`'s `WORKS`, the brief's DESK DEFAULT. `Work`, `Run`, and `fullReference` moved with it. `comment-sources.ts` re-exports all four, so Insights' imports did not change. Four fields are new:
  - `group`: which Guide group the work sits in.
  - `degree`: "D.M.A." for a thesis.
  - `container`: a journal and its volume.
  - `url`.
- **The seven Insights works are unchanged.** Row 8c's citation repairs are still owed.
- **Seven works are new.** Each was read from a place the app or the repository already cites it, and each entry's `record` names that place.
  - Grayson 2012
  - Mitton 2020
  - Richter 2002
  - Yanushevskaya and Bunčić 2015
  - Montgomery 2021
  - Challis 2006
  - Pacheco 2013
- **`OWED`** names ten works that the app cites by author and year but with no title. A full reference cannot be printed for these without supplying facts, so they are listed rather than invented.
- **`GuideSources.svelte`** renders the section from the registry, after Licences, in both languages. Each group's works are sorted by author, then year, and each prints the way Insights' "Sources cited" prints: `fullReference`, with a hanging indent.
- **The Guide's table of contents** in `Drawer.svelte` has a Sources entry after Licences. The file stays at its 1990-line ceiling: the entry replaced the one-word `<!-- Licences -->` comment.
- **Strings:** the five ratified strings from §6, verbatim, as `guide.sources.*`.

## Section 3's list: every work cited

A read-only search agent swept Learn, the Guide, `data/blurb-composer.json`, `i18n.ts`, Insights, the voice engine, `NOTICES.md`, and `README.md`. I read the passages it quoted for every work below that is in the registry.

**In the registry, by group (DESK DEFAULT on the grouping):**

| Group | Work | Where the app cites it |
|---|---|---|
| Russian lyric diction | Grayson 2012 | Everywhere: Learn, Guide, footer, word explanations (`blurb-composer.json:2155`) |
| | Yanushevskaya and Bunčić 2015 | Learn `:2727` (FR `:678`) |
| | Montgomery 2021 | Learn `:3476` (FR `:1447`) |
| | Challis 2006 | Learn `:3443` (FR `:1414`) |
| The voice and its acoustics | Mitton 2020 | Guide `:350`, `:553`; Learn `:3383-3387` |
| | Pacheco 2013 | `insights.footnote.tessitura` (`i18n.ts:1536`) |
| | Miller 2004, Miller 1986, Bozeman 2021, Bozeman 2025, Reid 1975, McKinney 1994, Howell 2025 | Insights comments |
| Song texts | Richter 2002 | `footer.richter` (`i18n.ts:740`) |

**Owed a record (`OWED`, in the registry file; none prints):**

- Challis 1989
- Piatak and Avrashov 1991
- Richter's six volumes (1999 to 2008)
- Belov 2004
- Olin 2012
- McMaster 2012 (in Sheil)
- Thomas 2010 (in Karna)
- Lindblom 1983
- Derwing and Priestly 1980
- Bolla 1980

The first seven all come from Learn's survey paragraph (`LearnContent.svelte:2081`). A full record needs the book in hand, or a record the desk can read.

**Cited, but not a work for this list** (the test lists each with its reason):

- the Kiel Convention (an event)
- the Russian Alphabet Song, arr. Dann Mitton, 2017 (music)
- Kochetov, a personal communication

The following are credited in Licences and outside the three ratified groups, so they stay in Licences only:

- kaikki.org and Wiktextract (the dictionary data)
- LiederNet
- the OQLF and Roberge (French usage)

The works in Grayson's own introduction, as the Guide quotes it (Colorni, Grubb, Odom, and others), are Grayson's citations, not Ilya's.

**Cited in code only, never on screen:** `BAND_SOURCES` in `plausibility.ts` (Bozeman), and `advice-resolver.ts`'s citations (Godin and Howell 2015, Bozeman 2008 and 2010, Mitton 2020, Bozeman 2021), which `watchlist.ts:168` says are never printed. Titze, Roubeau, and Dayme appear in comments only.

## The test

`apps/web/src/lib/sources.test.ts`, eight tests:

- **The registry test scans the citing files.** These are Learn, the Guide, `i18n.ts`, and `blurb-composer.json`, with HTML and line comments stripped. It collects every "Surname … year" pair. Each pair must be a registered work, an `OWED` entry, or a named non-author (a place, a date, or software), each listed with what it is. A new citation such as "Sundberg (1987)" fails the test until it is registered or owed.
- **Positive controls:** the scan must find Grayson 2012, Mitton 2020, Richter 2002, Montgomery 2021, Challis 2006, and Lindblom 1983.
- **Structure checks:**
  - Every Insights row names a registered work.
  - No owed entry is also registered.
  - Every work is in exactly one group, and every group has at least one work and both strings.
- **Exact output** for a thesis (Grayson, Mitton), an article (Pacheco), and two books (Richter, Reid).

**Its limit:** it catches the "Surname (year)" family of shapes. A work cited with no year (Avanesov, Daniel Jones, Dailey), or with the year far from the name, passes unseen.

## Decisions I made (DESK DEFAULT, reversible)

1. **"D.M.A." in a thesis reference**, in both languages, as `README.md:5` prints it. "D.M.A. dissertation" would need French words, and French is yours.
2. **Mitton is "Mitton, Daniel A."**, the byline `README.md:107` gives. The app says "Dann Mitton" everywhere else.
3. **Mitton's dissertation is under "The voice and its acoustics"**, because Markup and Insights build on it. Learn also cites it on diction.
4. **Richter is under "Song texts"**: his book is the song texts, and the Latin IPA comes from it.
5. **Pacheco is listed** although Insights prints it beside "CITATION NOT YET VERIFIED". It is cited on screen, so the section must hold it. Its `record` says it is unverified.
6. **Titles in articles take English curly quotation marks** in both languages, as Pacheco's French string already does.
7. **The list keeps the Guide's own list indent** (`ReadingPaper.svelte`), so it matches every other Guide list.

## Proof

- **Gates** (scratch copy of the ship script, as in the row 2c report):
  - 1, 2, 3, 5, 6, 7, and 8: at baseline.
  - 4: **1747**. That is 1732 plus row 2c's 7 and this row's 8. Gate 4's baseline in `~/Downloads/ilya-ship.sh` moves to 1747.
- **Playwright:** `pnpm test:e2e` (chromium), **28 passed (3.0m)**, on the tree with rows 2c, 3, and 4.
- **Browser**, in the pane at `http://calib2c.localhost:5173/`:
  - French: the drawer's table of contents shows « Sources » after « Licences et remerciements ». Tapping it lands on the section and marks it active.
  - The band reads « Sources » with the ratified French deck.
  - The groups are « La diction lyrique russe » (4 works), « La voix et son acoustique » (9), and « Les textes chantés » (1), each reference in full.
  - English shows the same with the English words.
  - At 375 px wide, no reference overflows and the page does not scroll sideways.

To see it on the local dev server (Vercel does not show this until it is committed and pushed):

```
http://localhost:5173/#guide-sources
```

Arrival: the Guide opens on the blue "Sources" band, with "Russian lyric diction" and Challis first beneath it.

## What I could not establish

- **Imprints for the new works beyond what the repository holds.** Challis 2006 prints no publisher. Montgomery prints "STM", as Learn gives it. Yanushevskaya prints no pages. Grayson prints no place. I supplied nothing.
- **The disagreements the sweep found, left for the desk, not fixed:**
  - Learn's French calls Grayson's university « Université de Washington » (`LearnContent.svelte:30`); every other French copy keeps "University of Washington".
  - Learn's English prints Grayson's full title in sentence case (`:2079`).
  - `NOTICES.md` lacks Mitton 2020, and the Guide's Licences lacks Richter.
  - `NOTICES.md` and `README.md` license kaikki under CC BY-SA 4.0 and GFDL. The Guide and the footer name only CC BY-SA 4.0.
  - The dictionary's size is given three ways: 1.3 million, 943,096, and "nearly a million" entries.
  - Learn's French source note at `:2030` is still in English ("Grayson source: … Appendix F").
- **Whether you want the owed ten researched and added**, or the survey paragraph left to cite them by name alone.
