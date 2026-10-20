# Report: row 125, the wordless banner stops claiming text nobody added

Branch `cloud-lane-11`, after row 126 (`1e9358d`), its own commit. Brief: `brief-code-row125-wordless-banner-clause_r2_2026-10-19.md`. Cloud session, Sonnet 5.5. `Shane` was not merged into the lane. Dann's ratification of 2026-10-19 22:25 is as the brief states it; I did not see the ratified file.

## The diff

- `apps/web/src/lib/i18n.ts`: the values of `upload.banner.noLyrics` (`:1406`) and `upload.banner.noLyricsScan` (`:1410`, both shifted one line by the comment). Only the second sentence of each changed, in both languages: English "The text you add in Lyrics goes under the notes, assigned one syllable per note."; French "Le texte que vous ajoutez dans le champ Paroles se place sous les notes, réparti à raison d’une syllabe par note." The first and third sentences are byte for byte as before. One comment line added at `:1405`, directly after the row 95 comment: `// Row 125 (ratified by Dann 2026-10-19 22:25): the second sentence is true before and after words arrive.` The apostrophe in « d’une » is still U+2019, untouched. The comment at `:1407-1409` stays.
- `apps/web/src/lib/score/no-lyrics-notice.test.ts`: tests `1a` and `1b` carry the four new strings (the only existing expectations changed), a comment line names row 125 and the ratification, and one new test, `row 125: neither wordless key claims text that nobody added, in either language`, checks neither key contains `The text you added` or `avez ajouté`.
- Nothing else: `noLyricsNoticeKey`, when the line shows, `upload.banner.reader`, and every other string are untouched. No file under `docs/sessions/` was created or edited but this report.

## Tests and gates

The file went from 12 to 13 tests. `i18n.test.ts` (the French punctuation table) passes untouched, with no edit.

| gate | baseline (after row 126) | this commit |
|---|---|---|
| phonology | 267 | 267 |
| dictionary | 248 | 248 |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| web-test | 2849 | 2850 passed (2849 plus the one new test) |
| score-parser | 753 passed, 5 skipped | 753 passed, 5 skipped |
| blurb | 145 | 145 |
| integration | 55 | 55 |
| ratchets | OK | OK, no ceiling raised |

## Could not establish

- How the two lines read on the alias, with Input empty, in English and French: the page was not opened. DONE is the desk's look after the merge.
- The saved copy of the brief in `/tmp/briefs` is a short summary, not the full text; the four strings were built from the old ones by replacing the second sentence, then checked by the byte-for-byte pins. It is not committed.
