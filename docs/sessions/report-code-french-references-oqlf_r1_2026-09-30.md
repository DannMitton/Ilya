# Report from Code: French references follow the OQLF notice (QUEUE row 2i)

Code, 2026-09-30. Brief: `brief-code-french-references-oqlf_r1_2026-09-30.md`. Read on branch `Shane` at `93bc639`, working tree dirty with the uncommitted rows 2b to 2h. No git writes.

## Summary

- **In French, every full reference the Guide's Sources section and Insights print is now an OQLF notice.** A comma separates place and publisher, and a comma follows the title. The surname is in capitals.
- **English is unchanged.** No title, author name, or publisher changed; a test checks every work.
- **One function serves all three places:** `fullReference(key, language)` in `$lib/sources.ts`, called by the Guide (`GuideSources.svelte`), "Sources cited" (`InsightsPane.svelte:827`), and the comment tap (`rowReference`, `insights/comment-sources.ts`).
- **Not done, flagged:** the tessitura footnote in `i18n.ts`, which is a footnote citation, not a notice.
- **Gates:** gate 4 moves from 1772 (after row 2h) to 1776, the 4 new tests, all passing. The rest are at baseline.

## The models, as read

Read by Code 2026-09-30 from the OQLF page the brief names (vitrinelinguistique.oqlf.gouv.qc.ca/23252). One model for each of the three types the registry holds:

- **Book:** « NOM, Prénom. *Titre du livre : sous-titre*, numéro de l'édition, lieu de publication, maison d'édition, date de publication, … »
- **Thesis** (the page gives examples, no abstract model): « BALLARIN, Sophie. *Approche sociolinguistique … glottopolitique*, Thèse (Ph. D.), Université de Montréal, 2009, xvii, 537 f. »
- **Periodical article:** « NOM, Prénom. « Titre : sous-titre de l'article », *Nom de la revue ou du journal*, volume, numéro, date de publication, numéro de la première page-numéro de la dernière page. » Its example writes « vol. 8, no 4 ».
- **For a work in another language,** the page keeps the author's name, the title « en respectant les majuscules », and the publisher in the original language.

The page also has models for a chapter and a web page. No work in the registry is either.

## Before and after, three types, in French

**Book** (Reid 1975):

- Before: Reid, Cornelius L. *Voice: Psyche and Soma*. New York: Joseph Patelson Music House, 1975, third printing 1999. ISBN 0-915282-00-3.
- After: REID, Cornelius L. *Voice: Psyche and Soma*, New York, Joseph Patelson Music House, 1975, 3e tirage, 1999. ISBN 0-915282-00-3.

**Thesis** (Grayson 2012):

- Before: Grayson, Craig M. *Russian Lyric Diction: A Practical Guide with … Selected Sources*. D.M.A., University of Washington, 2012.
- After: GRAYSON, Craig M. *Russian Lyric Diction: A Practical Guide with … Selected Sources*, Thèse (D.M.A.), University of Washington, 2012.

**Periodical article** (Pacheco 2013):

- Before: Pacheco, Alberto José Vieira. “Angelica Catalani’s Voice According to a Method of Statistical Analysis.” *Journal of Singing* 69, no. 5 (2013).
- After: PACHECO, Alberto José Vieira. « Angelica Catalani’s Voice According to a Method of Statistical Analysis », *Journal of Singing*, vol. 69, no 5, 2013.

All 14 works in French, as the live Guide prints them at `http://fitcheck.localhost:5173/` (Guide, Français), checked 2026-09-30:

- CHALLIS, Natalia. *The Singer’s Rachmaninoff*, 2006.
- GRAYSON, Craig M. *Russian Lyric Diction: …*, Thèse (D.M.A.), University of Washington, 2012.
- MONTGOMERY, Cheri. *Russian Lyric Diction Workbook*, STM, 2021.
- YANUSHEVSKAYA, Irena, et Daniel BUNČIĆ. « Russian », *Journal of the International Phonetic Association*, vol. 45, no 2, 2015.
- BOZEMAN, Kenneth. *Practical Vocal Acoustics*, 2e éd., 2025.
- BOZEMAN, Kenneth W. *Kinesthetic Voice Pedagogy 2: Motivating Acoustic Efficiency*, Inside View Press, 2021.
- HOWELL, Ian. *Hearing Singing*, Lanham (MD), Rowman & Littlefield, 2025.
- McKINNEY, James C. *The Diagnosis and Correction of Vocal Faults*, Waveland, 1994, réédition, 2005.
- MILLER, Richard. *The Structure of Singing*, 1986.
- MILLER, Richard. *Solutions for Singers: Tools for Performers and Teachers*, Oxford University Press, 2004. ISBN 978-0-19-516005-5.
- MITTON, Daniel A. *Sung Russian for the Low Male Voice Classical Singer: …*, Thèse (D.M.A.), University of Toronto, 2020. https://hdl.handle.net/1807/100864.
- PACHECO, … (the article, as listed in the article example).
- REID, … (the book, as listed in the book example).
- RICHTER, Laurence R. *Mussorgsky’s Complete Song Texts*, Geneseo (NY), Leyerle Publications, 2002. ISBN 1-878617-31-1.

## Choices the page does not settle (DESK DEFAULT, all reversible)

1. **Surname in capitals,** as the model sets it; a Mc prefix keeps its case (« McKINNEY »). The brief says not to change an author. Capitals are the model's typography, not a changed name, but say if you read it otherwise.
2. **A second author** is joined with « et », with the surname in capitals: « YANUSHEVSKAYA, Irena, et Daniel BUNČIĆ ». The page read gives no model for two authors.
3. **The degree:** « Thèse (D.M.A.) », after the page's « Thèse (Ph. D.) ». The degree keeps its English abbreviation.
4. **A place with a state:** "Lanham, MD" prints as « Lanham (MD) », so the place carries no comma of its own in a notice whose fields are separated by commas. The page has no example of this.
5. **The registry's two printing notes, in French:** « 3e tirage, 1999 » for "third printing 1999", and « réédition, 2005 » for "reissued 2005". Any future note prints as written until it is added to `FRENCH_PRINTING` in `sources.ts`.
6. **The edition:** "2nd ed." prints as « 2e éd. », after the page's « 3e éd. ».
7. **« no »** is written with a plain *o*, because the page's superscript cannot be set in a run.
8. **The ISBN and the URL** follow the notice, as in English. The page read gives no rule for either.

## Not in this change

- **The tessitura footnote** (`insights.footnote.tessitura`, `i18n.ts`) prints Pacheco in English style inside its French text, with a bracketed French title. It is a footnote citation, the page read covers bibliography notices, and the bracketed title was written for that string. Left alone; the desk may want it in the same form.
- **Learn's in-text source lists** (for example Unit 1, `LearnContent.svelte:678`) are outside the brief's two places and were not checked.
- **Short citations** in comments, "(Miller, *Solutions for Singers*, 2004, p. 163)", are not full references and are unchanged.

## Tests

`apps/web/src/lib/sources.test.ts`, "a full reference in French", 4 tests. The expected strings are written from the OQLF models, not read back from the function:

- books (Reid, Howell, Bozeman 2025, McKinney);
- a thesis (Grayson);
- articles (Pacheco, Yanushevskaya and Bunčić);
- every work keeps its full title and publisher, with no colon before the publisher.

The English tests are unchanged and pass.

## Gates

| Gate | Before (after row 2h) | After |
|---|---|---|
| 1 phonology | 251 passed (251) | 251 passed (251) |
| 2 dictionary | 235 passed (235) | 235 passed (235) |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 1772 passed (1772) | **1776 passed (1776)** |
| 5 score-parser | 636 passed, 5 skipped (641) | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) | 145 passed (145) |
| 7 integration | 55 passed (55) | 55 passed (55) |
| 8 ratchets | OK | OK |

The ship script's gate 4 baseline is 1760; rows 2h and 2i move it to 1776. That is the desk's to move.

## Files

- `apps/web/src/lib/sources.ts` (the French notice, +~85 lines)
- `apps/web/src/lib/sources.test.ts`
- `apps/web/src/lib/insights/comment-sources.ts` (one call)
- `apps/web/src/lib/insights/InsightsPane.svelte` (one call; line count unchanged at the ratchet ceiling)
- `apps/web/src/lib/components/Reading/GuideSources.svelte` (one call, one comment line)
