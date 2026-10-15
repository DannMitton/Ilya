# Brief: QUEUE row 95, Ilya stops saying a printed song has no words (r2)

Desk (Opus 5.5), 2026-10-14 about 16:40. For Code (cloud lane, Sonnet), on `Shane` at `db7fc43` or later. r2 2026-10-14 about 22:00: Fable reviewed (`review-fable-briefs-95-90-94-97_r1_2026-10-14.md`, SEND WITH AMENDMENTS); its amendments below are part of this brief and override any line above they contradict.

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


## Amendments from Fable's review, binding

1. Line 25, "Copy each string byte for byte." Add: "French apostrophes are typographic (U+2019), as every French value in `i18n.ts` writes them (`:1021` « d’une image »); the ratified text's straight marks in « d'une syllabe » become ’. Words, punctuation, and spacing stay as ratified." Reason: the ratified French carries straight apostrophes inside what will be a single-quoted TypeScript string, and the file's French uses ’ throughout (96 occurrences, no escaped straight mark).

2. Line 30, "How the code tells a scan from a file is yours." Add the lead: "`ingested.provenance.via === 'reader'` (`apps/web/src/lib/score/ingestion/ingest.ts:56`, set at `:227`), the field `fidelityBanner` already reads at `ScoreUploader.svelte:912-913`." Reason: saves a search and keeps one mechanism for both banners.

3. Line 9, "A test pins … which arrival draws 1a or 1b." Add: "Put the choice of key in a pure function (for example in `apps/web/src/lib/score/`), test that function on a `provenance` with `via: 'reader'` and one with `via: 'direct'`, and cite the one call site in `+page.svelte`." Reason: `+page.svelte` is over 5,000 lines and runes are inert under vitest (`docs/memory/ENVIRONMENT.md:653`), so a test of the component itself would not test the choice.

4. Line 7, add after the `reader` citation: "drawn at `apps/web/src/lib/score/ScoreUploader.svelte:993`." Reason: completeness; the brief cites where `noLyrics` is drawn but not where `reader` is.

## Running order (from the review)

Files two briefs both edit:
- `apps/web/src/lib/i18n.ts`: brief 1 (`:1021`, `:1353`, one new key), brief 2 (`:1742`), brief 3 (`:255` and `:256` if removed). No two touch the same key; line numbers shift after brief 1 inserts a key.
- `apps/web/src/lib/components/Reading/GuideContent.svelte`: brief 2 (§1 adds to the list at `:284-290`; §3 adds a paragraph after `:347` and `:61`) and brief 3 (§1 replaces `:347`, `:361`, `:564`, `:61`, `:74`, `:277`). Brief 2 §1 adds lines before `:347`, so brief 3's English line numbers move by that count.

Order: brief 1, then brief 3, then brief 2. Brief 2 §3 seats the teacher paragraph beside paragraph A, which must already be the ratified text (amendment 9), and brief 2's "Found, not fixed" item (amendment 11) is resolved by brief 3. Brief 1 is independent. Tests do not collide: brief 2 edits `ratified-lines.test.ts`; briefs 1 and 3 add new files. All three say "Run all eight gates before and after"; in one session the "before" is the session's first run and each brief's "after" is the next brief's "before", which the reports can say.
