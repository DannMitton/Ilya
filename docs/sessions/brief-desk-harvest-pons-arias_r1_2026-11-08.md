# Brief: harvest the 109 arias Pons 2008 lists: provenance and texts for Ilya's poem library (Sonnet helper, r1, 2026-11-08)

Research and data only. Nothing goes into the repository. NOT ESTABLISHED beats a complete invented answer.

## The goal

Dann ruled (2026-11-08 20:42, 22:17): harvest every ethically usable text Pons names, and locate each aria's authorship and operatic provenance. Pons gives the list only; texts come from attributed public-domain sources; Pons's printed text is a cross-check witness, never the named source, and his name appears in no record Ilya would show.

## Inputs (Dann's Mac; load the remote-devices tools with ToolSearch, "select:mcp__remote-devices__device_bash,mcp__remote-devices__device_stage_files"; device folders $HOME/mnt/Downloads and $HOME/mnt/ilya-rewrite)

1. The aria list: the repertoire tables in `$HOME/mnt/Downloads/_desk-2026-11-08/digest-pons-2008-halfA_r1_2026-11-08.md` (43 rows) and `digest-pons-2008-halfB_r1_2026-11-08.md` (66 rows).
2. Pons's page text as witness: `$HOME/mnt/Downloads/_desk-2026-11-08/pons-2008-ocr-integrated.txt` (blocks `=== PAGE pN-PPP`; the RUSSIAN READING holds the Cyrillic; OCR, so letters may be wrong).
3. The library's record shape: `$HOME/mnt/ilya-rewrite/tools/poems/library.json` (read two entries in full), and the build's notes at the top of `$HOME/mnt/ilya-rewrite/scripts/build-poem-library.mjs`.
4. The library's rules, read in full before deciding anything usable: in `$HOME/mnt/ilya-rewrite/docs/memory/OPEN.md`, the sections whose headings begin "THE POEM LIBRARY CATALOGUES AUTHORITATIVE TEXTS", "THE POEM LIBRARY'S FOURTH RULE", "THE POEM LIBRARY FILLS FROM ATTRIBUTED SOURCES", "UNTIL RELEASE, DANN'S OWN STORED DATA", and "A POEM'S DATING LINE STAYS IN THE LIBRARY'S RECORD" (grep the headings, read each section whole).

## Work in your own Linux workspace under /root/harvest/

## Part 1: provenance, all 109 rows

For each aria: composer; opera (Russian and English title); act and scene if findable; role; voice type (Pons's); librettist or librettists with their dates; the literary source the libretto rests on (author, work, dates), if any; whether the sung text is the literary source's own verse, adapted, or the librettist's; the rights status under the library's rules, with the dates that decide it; Pons's printed page. Sources: Russian or English Wikipedia and Wikisource pages for each opera, via WebSearch and WebFetch for facts only. Each fact carries the URL it came from. Where sources disagree, give both.

## Part 2: texts, for every aria whose text is usable under the rules

- Fetch the text from Russian Wikisource through its API from your workspace shell (for example `https://ru.wikisource.org/w/api.php?action=query&prop=revisions&rvprop=content|ids&format=json&titles=...`), never through WebFetch (WebFetch summarizes and can change letters). Respect rate limits: pause between calls; on a 429, back off and retry later. If the shell cannot reach the site, say so and stop Part 2.
- A libretto page usually holds the whole opera: cut out the aria's text only, bounded by the aria's incipit and its last line as Pons's witness shows them; record the cut's start and end lines.
- Compare each cut with Pons's printed text (RUSSIAN READING of his pages), letter by letter after the library's fold (lowercase; ѣ→е, і→и, ѳ→ф, ѵ→и, ё→е, й→и; ъ dropped; only а-я kept). Report the agreement as a share; list real word differences (a composer's change is expected; OCR noise is not a difference).
- Where an aria's text sets a poem that the library already holds or that Wikisource holds as a poem (for example Pushkin's verse in *Eugene Onegin*), fetch the poem's own page too and note which the aria follows.

## Output (deliver to the Mac, in `$HOME/mnt/Downloads/_desk-2026-11-08/harvest-pons-arias/`; write text files there through device_bash)

1. `provenance.tsv`: one row per aria, Part 1's columns, with a URL column per fact group.
2. `candidate-entries.json`: one object per usable aria in `library.json`'s entry shape (`id`, `work`, `title`, `incipit`, `author`, `translator`, `rightsHolderDates`, `status`, `verification` with state "unverified", `source` with site, url, revid, page, licenceTemplate, `spelling`, `textEdition`, `textModern`), plus one extra object `provenance` holding Part 1's fields. Make `id` and `work` the way `library.json` makes them if you can find how (else leave them null and say so). `author` is the text's author as the library's rules define it; say how you decided for adapted libretti.
3. `report.md`: counts (rows; provenance complete; texts usable; texts fetched; texts not found anywhere but Pons; rights doubtful), the agreement shares, the word differences, every rule you applied with its OPEN.md section, and what you could not establish.

## Rules

- No IPA. Nothing on the Mac but the output folder. No git. Never name Pons in any field of `candidate-entries.json`.
- Hard cap 260,000 tokens. Write the outputs as you go so a stop loses nothing.
