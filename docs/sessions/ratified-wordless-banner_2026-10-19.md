# The wordless banner's second sentence, RATIFIED by Dann 2026-10-19 22:25

QUEUE row 125. Found by the desk's walk on the Shane alias 2026-10-19 21:3x: with Input empty, the drawer said *"The text you added is under the notes, …"*. Both `upload.banner.noLyrics` and `upload.banner.noLyricsScan` (`apps/web/src/lib/i18n.ts:1405`, `:1409` at `f93b9e5`) show whenever the score as Ilya receives it has no words (`apps/web/src/routes/+page.svelte:2828-2829`), whatever Input holds.

The desk offered three designs, ranked (22:2x): 1, change one clause so the line is true either way (strings only); 2, two lines, before and after words arrive (two new strings and a condition in `+page.svelte`, at its ceiling); 3, hide the line until words arrive (a scan loses its first sentence). French drafted from the file's own French (`i18n.ts:1405`, `:1409`; « le champ Paroles » from `intake.view.poemLine`), with one open choice, « se place » or the current « se trouve ». Dann, 22:25: *"1"*, with the question *"We;re talking about a melody on a page that is scanned, and the melody has not lyric underlay, right?"* (transcribed as written). The desk answered that the line covers both a scan (whose print usually carries words Ilya does not read) and a file with no words, and that option 1 is true in both; recorded as ratified with « se place », the draft as offered.

Only the second sentence changes. The first and third sentences of both keys stay as they are.

## English

- `upload.banner.noLyrics`: This score has no words in it. The text you add in Lyrics goes under the notes, assigned one syllable per note. Click a note to move a syllable.
- `upload.banner.noLyricsScan`: Ilya does not read the words printed in an image. The text you add in Lyrics goes under the notes, assigned one syllable per note. Click a note to move a syllable.

## French

- `upload.banner.noLyrics`: Cette partition ne porte aucune parole. Le texte que vous ajoutez dans le champ Paroles se place sous les notes, réparti à raison d’une syllabe par note. Cliquez sur une note pour déplacer une syllabe.
- `upload.banner.noLyricsScan`: Ilya ne lit pas les paroles imprimées dans une image. Le texte que vous ajoutez dans le champ Paroles se place sous les notes, réparti à raison d’une syllabe par note. Cliquez sur une note pour déplacer une syllabe.

Typography: the apostrophe in « d’une » is U+2019, as the file has it; no colon or other high punctuation in the new clause.
