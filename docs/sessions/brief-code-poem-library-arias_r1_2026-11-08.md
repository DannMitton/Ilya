# Brief: 92 aria texts into the poem library, with their opera's metadata (Code, r1, 2026-11-08; NOT YET FABLE-REVIEWED)

Ruled by Dann 2026-11-08 22:58: *"Yes, add the 92 texts to Ilya's poem library through a Fable-reviewed Code brief."* Lane: a cloud session on `cloud-lane-37`, cut from `Shane`; push that branch only; one report per step in `docs/sessions/report-code-poem-arias-stepN_r1_<date>.md`. NOT ESTABLISHED beats a complete invented answer.

## What the singer gets

She brings an aria from one of these operas (a scan, a file, or Lyrics pasted into an empty field), and Ilya fills POEM with the opera's text from its library, as it does today for 14 poems. The card names the opera's text and where it came from. Any of Title, Composer, Poet, and Translator she left empty fills from the entry; nothing she typed changes.

## Inputs

- `tools/poems/arias-for-library_r1_2026-11-08.json`: 92 entries in `tools/poems/library.json`'s entry shape plus a `provenance` object (composer, `opera_ru`, `opera_en`, role, voice, librettists with dates, `literary_source`, `text_kind`, rights). 20 come from Russian Wikisource, 62 from operalib.eu, 10 from FEB (feb-web.ru). Harvest reports, read by the desk: (a desk folder on Dann's Mac, removed; the desk relays anything you need from them).
- The library's rules: `docs/memory/OPEN.md`, sections "THE POEM LIBRARY CATALOGUES AUTHORITATIVE TEXTS", "THE POEM LIBRARY'S FOURTH RULE", "THE POEM LIBRARY FILLS FROM ATTRIBUTED SOURCES, VERIFIED OR NOT". Read them whole.

## Steps

0. **Read and report, change nothing.** Read `scripts/build-poem-library.mjs`, `apps/web/src/lib/text/poem-library.ts` (the `PoemEntry` shape and the check a file passes), `poem-offer.svelte.ts`, `poem-source.ts`, `poem-site.ts`, `components/Drawer/PoemLibraryCard.svelte`, `MetadataFields.svelte`, and every test that pins the library's entry count or its 14 ids. Report each with lines, and how `poem-site.ts` turns `source.site` into the card's source line.
1. **The entry kind and the opera fields.** `PoemEntry` gains optional `kind: 'poem' | 'libretto'` (absent means poem) and an optional `opera` object: composer, opera title in Russian and English, role, voice type, librettists, literary source. The build carries them; the check accepts their absence. DESK DEFAULT, for Fable's review against the library's rule 4 ("poem and text as set stay apart"): a libretto is the opera's authored text, so a libretto entry fills POEM; the literary source behind it (Pushkin, Ostrovsky) is recorded, never substituted.
2. **Ids.** Keep the 14 existing ids. For new entries, `id` and `work` must be unique per aria: one libretto page holds several arias, so an id from the page alone collides (4 groups). Make `work` from the opera and `id` from the opera and the aria's incipit; state the formula in the build's comment.
3. **Merge and build.** Add the 92 entries to `tools/poems/library.json` (drop the `provenance` object's working fields: `cutBoundsCleanedLines`, `otherCandidates`, `idCollisionGroup`, `authorDecision`); run the build. Report the new `data/dictionary.poems.<hash8>.json` byte count against today's 129,444; the desk tells Dann before ship.
4. **Source lines for two new sites.** The card names its source (ratified for Wikisource 2026-11-03 20:21). operalib.eu and FEB need lines in English and French: put `TODO-EN` and `TODO-FR` placeholders and list them; the desk drafts, Dann ratifies.
5. **Empty metadata fills from the entry.** When Ilya fills POEM from the library, each EMPTY field of Title, Composer, Poet, and Translator takes the entry's value; a field she typed stays. For a libretto: Title from the entry's title, Composer matched to `COMPOSERS` (`composers-poets.ts`), Poet the librettists. A composer not in `COMPOSERS` is reported, not added. Revert of the fill restores the fields it filled.
6. **The match threshold holds.** Re-run the threshold measure on the 18 build songs with 106 entries (`~/Downloads/_desk-2026-11-03/report-desk-poem-threshold_r1_2026-11-03.md` gives the method; the desk relays it): row 114 songs 2 to 5 still fill, song 1 still does not, and no song fills from an aria by mistake.
7. **Gates.** All eight at baseline; tests added for the kind, the opera fields, the id formula, and the metadata fill (empty filled, typed kept, Revert restores).

## Constraints

- No change to how the matcher computes a score. Changes to the fold go nowhere near this row.
- Do not change `VocalLineEvent`.

## Report

Per step: what changed, files and lines, test counts, and what you could not establish. NOT ESTABLISHED beats a complete invented answer.
