# Brief for Code, cloud lane: row 125, the wordless banner stops claiming text nobody added, r1

> **SUPERSEDED by r2** (`brief-code-row125-wordless-banner-clause_r2_2026-10-19.md`, 2026-10-19 22:3x), which applies Fable's six amendments (`review-fable-brief-row125_r1_2026-10-19.md`). Kept for the record; do not send.

Written by the desk (Opus) 2026-10-19 22:3x. QUEUE row 125. For a cloud session, Sonnet 5.5, on branch `cloud-lane-11`, after row 126. Fable reviews this brief before Code gets it (`CONTRACT.md` §1 item 19). Row 125's QUEUE entry and the ratified file (`docs/sessions/ratified-wordless-banner_2026-10-19.md`) are not on the branch; this brief carries what they say, and the four strings below are the ratified text itself.

## What the singer sees

A singer drops a score whose reading has no words: a scan or photograph (the print usually carries words; the reader on the singer's path does not read them yet), or a file whose melody truly has none. The drawer under the receipt shows a courtesy line at once, whatever Input holds (`apps/web/src/routes/+page.svelte:2828-2829`, drawn at `:4081-4087`). Its second sentence says *"The text you added is under the notes, …"* even when nothing was added. The desk walked it on the Shane alias 2026-10-19 21:3x with Input empty.

After this row, the second sentence of both lines reads as a description that is true before and after words arrive. A poem pasted whole into Poem lands in Lyrics anyway (`apps/web/src/lib/text/witness-lines.ts:153-155`, called at `+page.svelte:2428` and `:2871`), and Lyrics is where typed words are placed.

## Why

Dann ratified option 1 of three on 2026-10-19 at 22:25 (*"1"*): change one clause, strings only, no new logic. Only the second sentence of each line changes; the first and third stay byte for byte.

## The work

1. In `apps/web/src/lib/i18n.ts`, replace the values of the two keys (`:1405` and `:1409` at `f93b9e5`) with these, character for character:

   - `upload.banner.noLyrics`, en: `This score has no words in it. The text you add in Lyrics goes under the notes, assigned one syllable per note. Click a note to move a syllable.`
   - `upload.banner.noLyrics`, fr: `Cette partition ne porte aucune parole. Le texte que vous ajoutez dans le champ Paroles se place sous les notes, réparti à raison d’une syllabe par note. Cliquez sur une note pour déplacer une syllabe.`
   - `upload.banner.noLyricsScan`, en: `Ilya does not read the words printed in an image. The text you add in Lyrics goes under the notes, assigned one syllable per note. Click a note to move a syllable.`
   - `upload.banner.noLyricsScan`, fr: `Ilya ne lit pas les paroles imprimées dans une image. Le texte que vous ajoutez dans le champ Paroles se place sous les notes, réparti à raison d’une syllabe par note. Cliquez sur une note pour déplacer une syllabe.`

   The apostrophe in « d’une » is U+2019, as the file has it today; keep the file's quoting style (single-quoted string literals, the U+2019 written as the character). Nothing else in `i18n.ts` changes; the comment at `:1406-1408` stays.
2. **The pins.** `apps/web/src/lib/score/no-lyrics-notice.test.ts`, `describe('row 95: the ratified strings, byte for byte')`, tests `1a` (`:68-75`) and `1b` (`:76-83`), pin the old wording. Change their expected values to the four strings above, and add a one-line comment naming row 125 and Dann's ratification of 2026-10-19 22:25. These two expectations are the only existing test lines this row may change. Add one test in the same `describe`: neither key, in either language, contains `The text you added` or `avez ajouté`.
3. **Nothing else.** No change to when the line shows, which key is chosen (`noLyricsNoticeKey`, `apps/web/src/lib/score/ingestion/ingest.ts:89-90`), `upload.banner.reader` (its own rewrite is owed, row 103), or any other string. The French punctuation table (`apps/web/src/lib/i18n.test.ts`, "every French value in i18n.ts follows the table") must pass untouched.

## Tests and the done state

1. The tests above; every other test unchanged.
2. Gates: phonology 267, dictionary 248, web-check 0 errors and 12 warnings, web-test at its baseline after row 126 plus the one new test, score-parser at its baseline after row 126, blurb 145, integration 55, ratchets OK. No ceiling raised.
3. **DONE** is a look on the alias after the merge: the desk drops a wordless scan reading and a wordless file with Input empty and reads both lines, in English and French.

## The lane

Branch `cloud-lane-11`, after row 126, its own commit and push. Never `Shane` or `main`; no pull request; Dann merges. Do not edit `docs/memory/`. Never commit a `brief-code-*` file: the brief lives in `/tmp/briefs` only. Report: `docs/sessions/report-code-row125_r1_2026-10-19.md`, with the diff by file and line, the test counts, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
