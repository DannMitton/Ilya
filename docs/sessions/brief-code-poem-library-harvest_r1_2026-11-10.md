# Brief: 233 harvested poems into the poem library, and whole Latin words allowed (Code, cloud lane, r1, 2026-11-10)

Written by the desk (Opus) 2026-11-10. NOT Fable-reviewed at the time of writing; the review's amendments are applied before Code reads this (CONTRACT §1 item 19). QUEUE row 183 (DESK DEFAULT number).

## Why

Dann wants Ilya's poem library to carry every ethically usable public-domain poem that Russian art song sets (Dann 2026-11-08 20:06 to 20:59, `INBOX.md`). Four harvest passes found 246 poems; none is in Ilya, which ships 14 poems (and 103 entries once the arias of row 182, `cloud-lane-41`, ship). For the colleague share (Dann 2026-11-09 11:56, `OPEN.md`), a singer who types or drops a song the library holds is offered its poem with its source named. This lane loads the poems. Dann ruled 2026-11-10 15:16 that the list of lines still unfound waits until after the share; it is not this lane's work.

## Rulings that bind this lane (all in `docs/memory/OPEN.md`, read the sections in full)

- "THE POEM LIBRARY FILLS FROM ATTRIBUTED SOURCES, VERIFIED OR NOT" (2026-11-04 09:40): any entry with a named source fills POEM, and the singer always sees where its text came from. Every entry still records its verification state. No new string marks an entry as unverified.
- "THE POEM LIBRARY CATALOGUES AUTHORITATIVE TEXTS" (2026-11-03 19:54) rules 1, 2, 4, 5, and "THE POEM LIBRARY'S FOURTH RULE" (2026-11-03 20:27): the library's aim; every entry keeps its edition as the page names it, its rights trail, and its correction log. No anthology text, and never the text as a composer set it.
- 2026-11-09 23:32 (last section of `OPEN.md`): **a whole Latin-script word is deliberate foreign text** (shown as printed, in italics, no IPA unless a ruled table gives it); **a Latin letter inside a Russian word is garble**. The poem library accepts whole Latin-script words and keeps refusing Latin letters inside Cyrillic words.
- 2026-11-10 15:16: the tick-off list waits; title-only matches are not filled silently.
- CONTRACT §8: Dann hears the byte count of anything shipped into what the app downloads, before it ships.

## Inputs

- **The data:** `tools/poems/poems-harvest-for-library_r1_2026-11-10.json` (committed by Dann's ship before this lane starts; md5 `c9de13491c28edc87223e8c5aa66d775`, 1,538,735 bytes, `{version, built, entries}`, 233 entries). Each entry has the library entry's shape (`id work title incipit author translator rightsHolderDates status verification source spelling textEdition textModern`) plus `provenance`. Built by the desk from the four harvest passes (`~/Downloads/_desk-2026-11-09/harvest/`, `~/Downloads/_desk-2026-11-10/harvest/`, not in the tree), with two changes: the 13 entries whose `provenance.matchedBy` begins "title" are held out (a title match does not show that the poem is the one the composer set; held file `~/Downloads/_desk-2026-11-10/harvest/poems-harvest-held-title-matches_r1_2026-11-10.json`, DESK DEFAULT extending Dann's 15:16 ruling on three of them to all thirteen), and `provenance.harvest` (the name of a working pass) is dropped. The harvest's own checker passed every entry (0 failures, pass 4 report), with whole Latin words replaced by a stand-in, because the builder refuses them today.
- Sites, over the 233: Russian Wikisource 209, az.lib.ru 12, RVB 7, ilibrary.ru 5. Step 0 recounts them.
- `verification.state` is `unverified` on all 233. 3 entries are `spelling: 'pre-reform'`.
- Branch: `cloud-lane-45`, cut from `Shane` AFTER `cloud-lane-41` (row 182, the arias) is merged into `Shane`. Both lanes change `tools/poems/library.json`, `scripts/build-poem-library.mjs`, `apps/web/src/lib/text/poem-site.ts`, the library tests, and the poem file in `data/`. If `Shane` does not yet hold lane 41's report `docs/sessions/report-poem-library-arias_r1_2026-11-10.md`, stop and say so.

## Steps (one commit and one report per step, `docs/sessions/report-code-poem-library-harvest-step<n>_r1_2026-11-10.md`, each with a section "What Code could not establish")

### Step 0: read and report, nothing changed

Read on the lane's tip and report with `path:line`:
1. `scripts/build-poem-library.mjs`: `TEXT_FAULTS` and `textFault`, `shipEntry`, `buildPoemFile`, the libretto-only checks (`provenanceFault`, `LIBRETTO_SITES`), and whether any check reads a poem's `provenance`.
2. `apps/web/src/lib/text/poem-site.ts` (`SITE_KEYS`, `siteName`) and the `intake.poemLibrary.site.*` keys in `apps/web/src/lib/i18n.ts`: what a source line prints for a site that has no key.
3. Every test that pins the library's size or content (lane 41's report lists them: `poem-library.test.ts` count, `poem-source.test.ts` stanza starts, `poem-match.test.ts` and `tools/poems/fixtures/expected_r2.txt`, the shortlist tests, `poem-library-strings.test.ts`, `e2e/poem-library.test.ts`).
4. **What a whole Latin-script word does on each surface today** when it is in POEM: Text (the word stack: is it transcribed, glossed, or flagged?), MELODY, and INSIGHTS. Read the code path (`apps/web/src/lib/pipeline.ts` and the word stack) and run one example through it: «Не говори: меня он, как и прежде, любит, Rendez-vous» or any line with a whole Latin word. Report what a singer sees.
5. The data: count entries by `source.site`, by `spelling`, by `status`; confirm no `id` or `work` collides with `library.json`; confirm 233.
6. Baselines: all eight gates.

### Step 1: a whole Latin word passes the builder; a Latin letter inside a Cyrillic word still fails

In `TEXT_FAULTS`, replace the rule "a Latin letter" (`/\p{Script=Latin}/u`) with "a Latin letter inside a Cyrillic word": a word that holds both Cyrillic and Latin letters fails; a word wholly in Latin script passes. A word is a maximal run of letters, with an internal hyphen or apostrophe allowed. Tests: «Rendez-vous» and «adieu» pass; «мeня» (Latin e) fails; «Бoг» (Latin o) fails; a line mixing a whole Latin word and Cyrillic words passes. Apply the same rule wherever else the tree refuses a Latin letter in library data (grep for `Script=Latin` under `scripts/`, `tools/poems/`, and `apps/web/src/lib/text/`), and name each site in the report. Libretti follow the same rule.

If step 0 item 4 found that Text transcribes a whole Latin word as Russian, or crashes, step 1 also makes Text show it as printed, in italics, with no IPA and no gloss, per the 2026-11-09 23:32 ruling, with a test. If Text already does that, change nothing there. If the change needs a new string, stop and report it; do not write one.

### Step 2: the 233 entries enter the library

Append the 233 entries of the data file to `tools/poems/library.json` after the existing entries; bump `version` one step and set `built` to the lane's date. Keep `provenance` whole (as the arias lane did); it is not shipped. Do not copy the data file's top-level keys. Rebuild with `node scripts/build-poem-library.mjs`; add the new poem file with `git add -f` (as lane 41 did), and confirm the old one is removed and the manifest's dictionary `hash` unchanged.

Then remove `tools/poems/poems-harvest-for-library_r1_2026-11-10.json` from the tree in the same commit (its entries now live in `library.json`), as lane 41 removed its arias file.

### Step 3: the new sites

`SITE_KEYS` gains `RVB`, `az.lib.ru`, and `ilibrary.ru`, each with an `intake.poemLibrary.site.*` key. Seat the English and French as `TODO-EN` / `TODO-FR` with these DESK DRAFTS in a comment beside each, because Dann has not ratified them: RVB, EN "the Russian Virtual Library (rvb.ru)", FR « la Bibliothèque virtuelle russe (rvb.ru) »; az.lib.ru, EN "Maksim Moshkov's Library (az.lib.ru)", FR « la Bibliothèque de Maxime Mochkov (az.lib.ru) »; ilibrary.ru, EN "ilibrary.ru", FR « ilibrary.ru ». The desk brings the ratified strings as a later step; a test that every site the library holds has a key in both languages is extended, and may fail only on the TODO markers if the existing tests treat them so (say which).

### Step 4: the tests the library's growth moves

Regenerate `tools/poems/fixtures/expected_r2.txt` (or its successor) with `tools/poems/reference_sw_match.py` over the new library, never by hand; keep the earlier expected file as the record. Move every count pin. For every fixture, report in a table, as lane 41's step 6 did: top work, second work, margin, and whether it fills, before and after. **Any fixture that filled before and does not fill now, or whose top work changes, is reported with the two works named, and is not "fixed" by changing a threshold.** Report the matcher's run time on the slowest fixture before and after.

### Step 5: gates, the byte count, one browser check

1. All eight gates; the web suite's count and the new poem file's name.
2. **The byte count**: the poem file's size in bytes, gzip, and brotli, and the same three for the file before this lane. The desk measured the merged library at 1,181,823 bytes (gzip 263,725) with all 246 poems; with 233 it is a little smaller. Dann hears this before the ship.
3. One browser check on the built app: paste the Russian first lines of three harvested poems into POEM with an empty song (one RVB, one az.lib.ru, one pre-reform entry) and record what the card offers, with screenshots EN and FR.
4. Playwright: the two poem-library projects; any red outside the 11 known reds (`docs/memory/STATE.md` records 11 Playwright reds red on `Shane` too) is named.
Push `cloud-lane-45` only. No pull request.

## Sites that compute the same thing (CONTRACT §4)

The Latin rule is computed in `TEXT_FAULTS` (`scripts/build-poem-library.mjs`), in the desk's harvest checker (outside the tree, `check-poem-harvest_r4.mjs`, already on the ruled form), and in any app-side check step 1 finds. They must agree: a library that builds must not hold a word the app would refuse.

## What the desk could not establish

- Whether the app's Text, MELODY, or INSIGHTS handle a whole Latin word as ruled (step 0 item 4).
- Whether a library of about 336 entries keeps the matcher's choices for the twelve fixtures (step 4).
- Whether the 13 title-only matches are the poems their composers set.
- The French of the three new site names (drafts, step 3).

NOT ESTABLISHED beats a complete invented answer.
