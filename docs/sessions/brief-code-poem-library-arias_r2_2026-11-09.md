# Brief: 89 aria texts into the poem library, with their opera's metadata (Code, r2, 2026-11-09)

Ruled by Dann 2026-11-08 22:58 (add the arias through a Fable-reviewed Code brief) and 2026-11-09 20:22 (they ship with the colleague share). r2 applies Fable's twelve amendments (`docs/sessions/review-fable-three-briefs_r1_2026-11-09.md`, "Brief 3"). r1: `brief-code-poem-library-arias_r1_2026-11-08.md`. NOT ESTABLISHED beats a complete invented answer.

## What the singer gets

She brings an aria from one of these operas (a scan, a file, or Lyrics pasted into an empty field), and Ilya fills POEM with the named role's text, as it does today for 14 poems. The card names the opera's text and where it came from. Any of Title, Composer, Poet, and Translator she left empty fills from the entry; nothing she typed changes.

## Inputs

- **The cleaned data, attached to the prompt:** `arias-for-library_r2_2026-11-09.json`, md5 `b8706cf9b642f24db14501010595bfa2`, 89 entries (from 92: Tomsky's ballad held out for its French lines, DESK DEFAULT; Judith's Aria and Holofernes dropped, rights not established). Every entry has `id` and `work` (work = first 8 hex of MD5 of the NFC opera title; id = first 10 hex of MD5 of opera + "/" + first sung line; 29 works; no repeats). `textModern` holds the named role's sung lines only: speaker labels, stage directions, page numbers, and number headings removed; other roles' lines cut in 18 entries; `composer` is a `COMPOSERS` key. `source.site` is "Russian Wikisource", "operalib.eu", or "FEB". Rights resolved with dates and a trail in `provenance`. Report: `docs/sessions/report-aria-r2_r1_2026-11-09.md`.
- **The checker, attached:** `check-aria-r2.mjs` (0 failures on r2 plus the 14 library entries, re-run by the desk). Its furniture checks become the build's own (step 3).
- The library's rules: `docs/memory/OPEN.md`, "THE POEM LIBRARY CATALOGUES AUTHORITATIVE TEXTS", "THE POEM LIBRARY'S FOURTH RULE", "THE POEM LIBRARY FILLS FROM ATTRIBUTED SOURCES, VERIFIED OR NOT". Read them whole.

## Steps

0. **Read and report, change nothing.** Read `scripts/build-poem-library.mjs` (`buildPoemFile`, `shipEntry`, `textFault`, `TEXT_FAULTS`, `:100-147`), `apps/web/src/lib/text/poem-library.ts` (`PoemEntry`, `:26-45`), `poem-offer.svelte.ts`, `poem-source.ts`, `poem-site.ts` (`siteName`, `:16-19`), `poem-match.ts` (`SHORTLIST` `:54`, `:217`; `rankWorks` `:243-251`; the margin rule `:296-297`), `components/Drawer/PoemLibraryCard.svelte`, `MetadataFields.svelte`, `composers-poets.ts`, and every test that pins the library: `poem-library.test.ts:99` (`toHaveLength(14)`), `poem-match.test.ts:142-158` (twelve reference rows from `tools/poems/fixtures/expected_r1.txt`), `:383` (the shortlist is everything with 20 works or fewer). Report each with lines.
1. **The entry kind and the opera fields.** `PoemEntry` gains optional `kind: 'poem' | 'libretto'` (absent means poem) and an optional `opera` object: composer, opera title in Russian and English, role, voice type, librettists, literary source. The build carries them; the check accepts their absence. A libretto is the opera's authored text, so a libretto entry fills POEM; the literary source behind it (Pushkin, Ostrovsky) is recorded, never substituted (DESK DEFAULT, held by Fable against rule 4).
2. **Ids, checked.** The r2 ids stand; the build's comment states the formula. `work` per opera is deliberate: `rankWorks` scores a work by its best entry and the margin compares the top two works, so two arias of one opera never compete against each other. The cost, in one clause in the comment: "Not this poem" declines by `(songId, work)` (`poem-offer.svelte.ts:111`), so declining one aria declines that opera for that song.
3. **Merge, guard, build.** Add the 89 entries to `tools/poems/library.json`, dropping `provenance`'s working fields and keeping `provenance.notes` and the rights trail (the repository is public: no field names a working pass). Add to the build a `TEXT_FAULTS` row or a separate check for each furniture shape the checker tests (a line that is only a role name; a line wholly in parentheses; a parenthetical run inside a line; «- 38 -» page numbers; «[N. 13 - …]» and «Сцена V» headings; any Latin letter), so none can return, with a test per shape. Run the build. Report the byte count: the desk's checker built 492,927 bytes (from 129,444); Dann hears the figure before ship.
4. **Two new sites and three composers.** `SITE_KEYS` gains "operalib.eu" and "FEB", with two strings, `intake.poemLibrary.site.operalib` and `intake.poemLibrary.site.feb`, seated as `TODO-EN`/`TODO-FR` behind a failing test until the desk sends Dann's ratified text. `COMPOSERS` gains 'Verstovsky, Alexei' (Верстовский, Алексей; 1799–1862; French 'Verstovski, Alexeï') and 'Napravnik, Eduard' (Направник, Эдуард; 1839–1916; French 'Nápravník, Eduard'), DESK DEFAULT (a list of composers, reversible); report every entry whose composer still matches no key.
5. **Empty metadata fills from the entry.** When Ilya fills POEM from the library, each EMPTY field of Title, Composer, Poet, and Translator takes the entry's value; a field she typed stays. For a libretto: Title from the entry's title, Composer from its key, Poet the librettists. Revert of the fill restores the fields it filled.
6. **The tests the library's growth moves.** `poem-library.test.ts:99` pins the new count. With 42 works the shortlist engages (`SHORTLIST` 20): rewrite `:383` and check that each build song's poem lands in the shortlist. Regenerate `tools/poems/fixtures/expected_r2.txt` with `tools/poems/reference_sw_match.py` over the r2 library (never edited by hand), point `:142-158` at it, and report every row whose second work or margin changed.
7. **The threshold, both ways.** On the 18 build songs: row 114 songs 2 to 5 still fill, song 1 still does not, and no song fills from an aria by mistake. In reverse: a Lyrics made from each aria's own `textModern` fills its own entry; the nine held-out fixtures (`tools/poems/fixtures/*.lyrics.txt`) still refuse or still pick their poem. Report the lowest margin among the arias of one opera.
8. **Gates.** All eight at baseline or with every move explained; both Playwright projects.

## Constraints

- No change to how the matcher computes a score, to the fold, or to `VocalLineEvent`.

## Report

Per step: what changed, files and lines, test counts, and "What I could not establish". NOT ESTABLISHED beats a complete invented answer.
