# Brief: 224 harvested poems into the poem library (Code, lane 45, r2, 2026-11-11)

Written by the desk (Opus). r2 applies Fable's review of r1 (`docs/sessions/review-fable-brief-poem-harvest_r1_2026-11-10.md`, SEND WITH AMENDMENTS, 16): amendments 1 to 5 and 8 were applied by the desk to the data (r2, shipped 2026-11-10 in `8fb0ffc6`); 6, 7, and 9 to 16 are applied here. QUEUE row 183 (DESK DEFAULT number).

## Why

Dann wants Ilya's poem library to carry every ethically usable public-domain poem that Russian art song sets (Dann 2026-11-08 20:06 to 20:59, `INBOX.md`). Ilya ships 14 poems and 89 arias (103 entries, after row 182). For the colleague share (Dann 2026-11-09 11:56, `OPEN.md`), a singer who pastes or drops the words of a song the library holds is offered its poem, with its source named. This lane loads 224 harvested poems. The list of lines still unfound waits until after the share (Dann 2026-11-10 15:16); it is not this lane's work.

## Rulings that bind this lane (all in `docs/memory/OPEN.md`; read the sections in full)

- "THE POEM LIBRARY FILLS FROM ATTRIBUTED SOURCES, VERIFIED OR NOT" (2026-11-04 09:40): any entry with a named source fills POEM, and the singer always sees where its text came from. Every entry records its verification state. No new string marks an entry as unverified.
- "THE POEM LIBRARY CATALOGUES AUTHORITATIVE TEXTS" (2026-11-03 19:54), rules 1, 2, 4, 5, and "THE POEM LIBRARY'S FOURTH RULE" (2026-11-03 20:27).
- 2026-11-09 23:32: a whole Latin-script word is deliberate foreign text; a Latin letter inside a Russian word is garble. **Not built in this lane**: no entry holds a Latin letter (desk and Fable, run 2026-11-10), and the builder rule, the app's ASCII test (`apps/web/src/lib/latin.ts:66-72`), «à», «et», and the two guards go together to the closing polish lane.
- 2026-11-10 15:16: title-only matches are not filled silently.
- The three site names, ratified by Dann: rvb.ru 2026-11-10 22:40, az.lib.ru 22:41, ilibrary.ru 2026-11-11 (`OPEN.md`, last sections). The exact strings are in step 3.

## Inputs

- **The data:** `tools/poems/poems-harvest-for-library_r2_2026-11-10.json` on `Shane` (md5 `1d16a03428113744d6f79bf3f979d8f2`, 715,975 bytes, `{version, built, entries}`, 224 entries). Sites: Russian Wikisource 200, az.lib.ru 12, RVB 7, ilibrary.ru 5. Spelling: modern 221, pre-reform 3. `verification.state` `unverified` on all. The desk removed the homoglyph hygiene notes (a detector fault), the working-pass keys, and nine entries whose rights or song match were not established (Fable's amendments 1 to 5); it corrected Мей's and Мережковский's dates and set the twelve az.lib.ru `source.editionAsNamed` to null (amendment 8).
- **The held-out rule:** pass 1's 195 entries were matched by title and poet and carry no `matchedBy`; they stay, because the matcher decides a fill from the Lyrics, not from a title (`poem-match.ts:291-297`). Held out of the data: the three Dann named, the ten other title matches of passes 2 to 4 (DESK DEFAULT), and seven of pass 1 whose song-list title is not the entry's title.
- **Branch:** `cloud-lane-45`, cut from `Shane` at the commit named where Code is started (after lane 47's ship).

## Steps (one commit and one report per step, `docs/sessions/report-code-poem-library-harvest-step<n>_r1_2026-11-11.md`, each with a section "What Code could not establish")

### Step 0: read and report, nothing changed

Read on the lane's tip and report with `path:line`:
1. `scripts/build-poem-library.mjs`: `TEXT_FAULTS` and `textFault`, `shipEntry`, `buildPoemFile`, `provenanceFault`, `PROVENANCE_KEYS`, `LIBRETTO_SITES`. (Fable found that no check reads a poem's `provenance`, `rightsHolderDates`, or `status`; confirm.)
2. `apps/web/src/lib/text/poem-site.ts` (`SITE_KEYS`, `siteName`) and the `intake.poemLibrary.site.*` keys in `apps/web/src/lib/i18n.ts`.
3. Every test that pins the library's size or content: `poem-library.test.ts`; `poem-source.test.ts` (stanza starts, `:316-342`); `poem-match.test.ts` (`:247-271`, `:398-400`, `:407-410`) and `tools/poems/fixtures/expected_r2.txt`; `poem-arias.test.ts:29-36`; `tests/build-poem-library.test.ts:111-116`, `:359-364`; `poem-library-strings.test.ts`; `e2e/poem-library.test.ts`; `e2e-phone/poem-arias-time.test.ts:29`.
4. What a whole Latin-script word does today in POEM on Text, MELODY, and INSIGHTS (read only; Fable read Text: marked Latin, no IPA, no gloss, italic, `pipeline.ts:487`, `latin.ts:66-100`, `WordStack.svelte:144-164`).
5. The data: counts by `source.site`, `spelling`, `status`; no `id` or `work` collides with `library.json`; 224.
6. Baselines: all eight gates.

### Step 1: the 224 entries enter the library

Append the 224 entries to `tools/poems/library.json` after the existing entries; bump `version` one step; set `built` to the lane's date. Do not copy the data file's top-level keys. In the same step:
- **The three pre-reform entries take modern titles and incipits** (Fable amendment 7), as the five pre-reform entries already in the library do: `7f571e4227` title «Странник», `43ce5bb096` «Сон в летнюю ночь», `91a716b953` «Нет, только тот, кто знал…»; each `incipit` becomes the first line of its `textModern`. Their `textEdition` stays as printed.
- **Two build checks** (amendment 16): the build refuses a poem whose `rightsHolderDates[1]` is not a year of 1971 or earlier, and a poem whose `provenance` holds a key outside `POEM_PROVENANCE_KEYS` = `retrieved`, `editionNamedOnPage`, `authorDates`, `translatorDates`, `rightsTrail`, `subpages`, `sourcePrintsYo`, `sourceNote`, `matchedBy`, `hygiene` (as `PROVENANCE_KEYS` does for libretti). A test each. The 14 existing poems carry no `provenance` and pass.
Rebuild with `node scripts/build-poem-library.mjs`; add the new poem file with `git add -f` (as lane 41 did); confirm the old one is removed and the manifest's dictionary `hash` unchanged. Then remove `tools/poems/poems-harvest-for-library_r2_2026-11-10.json` from the tree in the same commit.

### Step 2: the three site names

`SITE_KEYS` gains `RVB`, `az.lib.ru`, and `ilibrary.ru`, with keys `intake.poemLibrary.site.rvb`, `.azLib`, `.ilibrary` (key names coined by Fable). Seat Dann's ratified strings exactly:
- `rvb`: EN "the Russian Virtual Library (rvb.ru)"; FR « la Bibliothèque virtuelle russe (rvb.ru) »
- `azLib`: EN "Maxim Moshkov's Library (az.lib.ru)"; FR « la Bibliothèque de Maxime Mochkov (az.lib.ru) »
- `ilibrary`: EN "ilibrary.ru"; FR « ilibrary.ru »
Apostrophes U+2019 as in the file's other strings. Add them to `RATIFIED_TABLE` in `poem-library-strings.test.ts` (`:39`), to the test's site map (`:82-90`), and to the key index at the head of `i18n.ts` (count the total from the file; lane 41's step 4 went red on it). The source line stays « Tiré de {site} », no elision.

### Step 3: the tests the library's growth moves

- Regenerate `tools/poems/fixtures/expected_r2.txt`'s successor with `tools/poems/reference_sw_match.py` over the new library, never by hand; keep the earlier file as the record.
- Move every count pin. Where a test takes "the 14 poems" as every entry with no `kind` (`poem-match.test.ts:398-400`, `e2e-phone/poem-arias-time.test.ts:29`), rebuild it on the 14 by id, not re-pin it.
- For every fixture, a table: top work, second work, margin, fills, before and after. Expect (Fable's run at 336 entries): the nine fills unchanged in work and score; U4, U5, r114 song 1 still refuse; U5's top work changes below the floor (Иоланта to Руслан и Людмила); the second work changes on S, U4, U5, and r114 song 4. **Any fixture that filled before and does not fill now, or whose top work changes above the floor, is reported with both works named, and is not fixed by changing a threshold.**
- The floor (amendment 13): for windows of 80, 100, and 113 letters cut at every letter from U4, U5, and r114 song 1, report how many fill (must be 0), how many score 0.15 or more, and the smallest margin shortfall. Fable measured 0 fills, 176 of 741 at 80 letters, closest margin 0.081 (U4, «Я пережил свои желанья…»). No bound in `poem-match.test.ts:247-271` moves to make it pass without the number reported.
- `poem-source.test.ts:316-342` is a reading, not a count: read every new capitalised second line and report each proper noun with its entry and line (Fable found at least «Дона», `4da617ce24`). Do not change `passageLine`.
- The matcher's run time on the slowest fixture, before and after.

### Step 4: gates, the byte count, one browser check

1. All eight gates; the web suite's count; the new poem file's name.
2. The byte count: the poem file's bytes, gzip level 9, and brotli, before and after. (Fable, 336 entries: 1,140,782; 250,873; 180,527, from 526,109; 115,834; 83,562. With 224 poems it is a little smaller.)
3. One browser check on the built app: paste (clipboard, as `e2e/poem-library.test.ts:33-35` does; on a Mac use Meta+V) the first stanza, 80 letters or more, of three harvested poems into LYRICS of an empty song: one RVB, one az.lib.ru, one pre-reform entry. Record what the card offers, with screenshots EN and FR.
4. Playwright: the poem-library specs in both projects. Two failures already on `Shane` are not this lane's: `e2e/poem-library.test.ts` pastes with Control+V, which does not paste in Chromium on a Mac (lane 47 report, step 8), and `e2e/singer-paths.test.ts` expects the French title « …pour chanteurs ». Name any other red.
Push `cloud-lane-45` only. No pull request.

## Sites that compute the same thing (CONTRACT §4)

This lane changes no computation.

## What the desk could not establish

- First-publication dates for the Ахматова and Цветаева entries, and whether Canada's rule for a work first published after its author's death applies to any of them (Fable: not read; the trail rests on death years, all 1966 or earlier).
- MELODY and INSIGHTS with a whole Latin word.
- Whether `/data/` is served compressed in production, so which byte figure a singer downloads.

NOT ESTABLISHED beats a complete invented answer.
