# Brief: QUEUE row 95, Ilya stops saying a printed song has no words (r1)

Desk (Opus 5.5), 2026-10-14 about 16:40. For Code (cloud lane, Sonnet), on `Shane` at `db7fc43` or later. Fable review owed before it is sent (`CONTRACT.md` §1 item 19).

## What the singer sees, and what must be true

On a scanned or photographed score whose print carries words, Ilya says "This score has no words in it" (`upload.banner.noLyrics`, `apps/web/src/lib/i18n.ts:1353`, drawn at `apps/web/src/routes/+page.svelte:4458`), and the scan banner ends "The words are not in a picture" (`upload.banner.reader`, `i18n.ts:1021`). Both are false for a printed song. Dann 2026-10-14 02:14: *"laughably false: the evidence is right there"*.

**Done when:** a scan or photograph never shows either false sentence, in English or French; a MusicXML file with no lyrics shows string 1a; a scan or photograph shows 1b where it showed `noLyrics`, and string 2 as the last sentence of the scan banner. A test pins each string's text in both languages and which arrival draws 1a or 1b.

## The strings, RATIFIED by Dann 2026-10-14 16:36 to 16:37 (English his; French the desk's draft, ratified)

**1a. `upload.banner.noLyrics` (MusicXML file with no lyrics), replaces today's text:**
- EN: This score has no words in it. The text you added is under the notes, assigned one syllable per note. Click a note to move a syllable.
- FR: Cette partition ne porte aucune parole. Le texte que vous avez ajouté se trouve sous les notes, réparti à raison d'une syllabe par note. Cliquez sur une note pour déplacer une syllabe.

**1b. New key for a scan or photograph (name it; the desk suggests `upload.banner.noLyricsScan`):**
- EN: Ilya does not read the words printed in an image. The text you added is under the notes, assigned one syllable per note. Click a note to move a syllable.
- FR: Ilya ne lit pas les paroles imprimées dans une image. Le texte que vous avez ajouté se trouve sous les notes, réparti à raison d'une syllabe par note. Cliquez sur une note pour déplacer une syllabe.

**2. `upload.banner.reader`, its last sentence only (keep the rest of the string as it is):**
- EN: Ilya does not read the words printed in an image; type them into the Input field.
- FR: Ilya ne lit pas les paroles imprimées dans une image; saisissez-les dans le champ Entrée.

Copy each string byte for byte. If 1a's `%s` placeholder (`+page.svelte:4458` calls `.replace('%s', noLyricsFile)`) has no slot in the text, say so in the report and keep the call harmless; do not add a file name to the text.

## Constraints

- Change nothing else in either string. Do not edit `docs/memory/`.
- How the code tells a scan from a file is yours; report it with `path:line`.
- Run all eight gates before and after; report counts and the files that moved them.

## Report

`docs/sessions/report-code-row95-the-words-on-a-scan_r1_2026-10-14.md`: the answer in three lines; how a scan is told from a file (`path:line`); each string as built, quoted from the tree; the tests; the gates; what could not be established. NOT ESTABLISHED beats a complete invented answer.
