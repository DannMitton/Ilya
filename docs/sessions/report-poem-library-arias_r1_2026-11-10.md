# Report: 89 aria texts into the poem library (Code, cloud-lane-41, 2026-11-10)

Brief: `brief-code-poem-library-arias_r2_2026-11-09.md`, with Fable's "Brief 3" amendments and the evening rulings. Data: `arias-for-library_r3_2026-11-10.json`, md5 `76dd8f4675ccd662239d20742dc161eb` (checked). Branch `cloud-lane-41` from `origin/cloud-lane-38` at `534d9981`. One section per step, appended as each lands.

Order of work, per Fable's "one lane, one day" section: 0, 1, 2, 3, 4, 6, 7, 5, 8.

## Baseline (before any change)

Run by this lane on the clean branch: 1 phonology 456; 2 dictionary 248; 3 web check 0 errors, 12 warnings; 4 web test 4707 passed, 1 skipped; 5 score-parser 785 passed, 5 skipped; 6 blurb 168; 7 integration 125; 8 ratchets OK. These equal the desk's figures.

## Step 0: read and report (nothing changed)

Read at `534d9981` on a clean tree.

| file | what stands there |
|---|---|
| `scripts/build-poem-library.mjs` | `TEXT_FAULTS` `:100-108` (seven faults, each a regex over `textModern`); `textFault` `:111-117` (adds the line-number test); `shipEntry` `:120-148` (requires `id work title incipit author spelling textModern`, `source.site`, `source.url`, `verification.state`; ships twelve keys; no `kind`, no `opera`); `buildPoemFile` `:155-165` (duplicate ids throw; name is the MD5 of the text); `main` removes an older `dictionary.poems.*.json`. |
| `poem-library.ts` | `PoemEntry` `:26-45`; `isEntry` `:90-107` (shape check the app runs before it trusts a file; unknown keys pass). |
| `poem-offer.svelte.ts` | `offer` `:99-122` (fills Poem through `put`, then writes `poemSource`); decline key `keyOf(songId, work)` `:76`, used `:111` and `:187`; `decline` `:181-197`; `undo` `:200-211`; `Removed` `:64-74`. |
| `poem-source.ts` | `cutFor` `:101-106`; `resolveSource` `:165-177` (the fallback to "a modern entry of the same `work`, else any" is `:166-168`). |
| `poem-site.ts` | `SITE_KEYS` `:12-14` (one key); `siteName` `:16-19` (an unlisted site prints as the data has it). |
| `poem-match.ts` | `SHORTLIST` `:54`; `shortlist` `:210-232` (engages above 20 works, at `:217`); `rankWorks` `:238-257`; margin rule `:296-297`. The brief's `:243-251` is the body of `rankWorks`. |
| `PoemLibraryCard.svelte` | prints `entry.title`, the first line of the cut, `entry.author` (or "translated by"), and the site; no opera, role, or composer anywhere (`:40-57`, `:81-93`). |
| `MetadataFields.svelte` | the only tag is "from score" (`fromScore?.has(...)`, `:108-156`). |
| `metadata-provenance.ts` | `applyScoreHeader` fills blanks only; `clearScoreFilled` empties what a previous score filled. A library fill is neither typed nor "from score" (see step 5). |
| `composers-poets.ts` | `COMPOSERS` `:28-54` (25 keys), `POETS` `:56-94`; matching is against the English "Surname, Given" form only (`formatNameForPaper` `:156-183`). |

Tests that pin the library: `poem-library.test.ts:99` (`toHaveLength(14)`); `poem-match.test.ts:62` ("19,553 letters"), `:142-158` (twelve rows from `expected_r1.txt`), `:383-384` (shortlist is everything, `13`); `poem-library-strings.test.ts:36` (table of 13 keys) and its "the library has one site" test; `poem-offer.test.ts:212` and `poem-source.test.ts:196` pin work ids of existing poems (unaffected, no work is shared); `e2e/poem-library.test.ts` (card on row 114 song 2); `loader-poems.test.ts` builds its own poem file and is unaffected.

`+page.svelte` has a size ceiling of 5534 lines (`scripts/ratchets.json`), so step 5's page change must be a same-line edit.

### Findings that change the build, stated now

1. **Two of the 89 ids do not reproduce from the cleaned text.** `id = first 10 hex of MD5(opera_ru + "/" + first sung line)` reproduces for 87 entries from the first line of `textModern`. `d821a19eea` (Кума's arioso) and `3538324966` (Gvidon's arioso) do not, from `textModern` or from `textEdition`, with or without a trailing comma or a speaker label. Their ids were made from a line this lane does not have. An id is a stored identity, so it stands and is not recomputed. The build checks that an id is ten hex digits and unique, and checks the `work` formula (89 of 89 reproduce). The formula is stated in the build's comment with these two named.
2. **The "18 build songs" are not in the tree.** The tree holds twelve Lyrics files (`tools/poems/fixtures/*.lyrics.txt`: P, S, T, U1, U4, U5, U6, and r114 songs 1 to 5). Step 7's run on "the 18 build songs" covers these twelve. The other six are NOT ESTABLISHED.
3. **The r3 file carries a top-level `harvest` key** (`"2026-11-08"`), which names a working pass. It is not copied into `library.json`.

### What I could not establish (step 0)

- The six build songs beyond the twelve fixtures (finding 2).
- How the two non-reproducing ids were made (finding 1).

## Step 1: the entry kind and the opera fields

**Changed.**
- `scripts/build-poem-library.mjs`: `OPERA_FIELDS` and `operaOf` (exported); `shipEntry` ships `kind: 'libretto'` and `opera` for a libretto, and nothing new for a poem (the 14 poems build to the same bytes). A libretto with no `provenance`, or an empty opera field, throws, as does a `kind` that is neither `poem` nor `libretto`.
- `apps/web/src/lib/text/poem-library.ts`: `PoemOpera` and `kind?` / `opera?` on `PoemEntry`; `isEntry` accepts an absent `kind`, requires every opera field on a libretto, and refuses an opera on a poem.
- The opera object holds `composer` (a `COMPOSERS` key), `operaRu`, `operaEn`, `characterRu`, `characterEn`, `number` (the provenance's `role`, the number's English name, named for what it holds), `voice`, `librettists` (the entry's `author` as it stands), and `literarySource`. The literary source is recorded and never stands in for the text.
- Tests: `tests/build-poem-library.test.ts` +3 (125 to 128 under gate 7); `poem-library.test.ts` +3 (12 to 15).

**Gates after this step:** gate 7 128 passed. The other gates are unaffected by a build-script and type change and run in full at the end of step 3.

**What I could not establish.** The app's `PoemEntry` has no entries with `kind` yet: the 89 arrive in step 3, so the opera path is tested on a synthetic libretto here and on the real data there.

## Step 2: ids, checked

**Changed.**
- `scripts/build-poem-library.mjs`: `workOfOpera` (first 8 hex of the MD5 of the NFC Russian opera title), and a comment stating both formulas, why `work` is per opera, and the cost in one clause ("Not this poem" declines by `(songId, work)`, `poem-offer.svelte.ts:111`, so declining one aria declines that opera for that song). `operaOf` refuses a libretto whose `work` is not the opera's or whose `id` is not ten lowercase hex digits.
- `apps/web/src/lib/text/poem-source.ts` (`resolveSource`): Fable's amendment 2. Where the stored id is gone and the work's entries are libretti, the work-level fallback answers null, so a card never names another aria of the opera; the caller falls back as it does for a missing work. An aria found by its id is unaffected.
- Tests: `build-poem-library.test.ts` +1 (to 129 under gate 7); `poem-source.test.ts` +1. `src/lib/text` as a whole: 28 files, 589 passed.

**Checked against the data (r3, 89 entries):** `work` reproduces for 89 of 89; `id` reproduces from the cleaned first line for 87 of 89 (step 0, finding 1). The two that do not are named in the build's comment and stand.

**Other readers of `work`, read and found sound per opera** (Fable's list, re-read on the tip): the shortlist and rank (`poem-match.ts:213-231`, `:243-255`), the decline key (`poem-offer.svelte.ts:76`, `:111`, `:187`), and the stored source (`library.ts:303-307`).

**What I could not establish.** Whether the two ids that do not reproduce were hashed from the speaker-labelled or the pre-cleaning first line; nothing in the tree says.

## Step 4: two new sites and two composers (landed before step 3's data, so every commit is green)

**Changed.**
- `i18n.ts`: `intake.poemLibrary.site.operalib` (EN "operalib.eu", FR "operalib.eu") and `intake.poemLibrary.site.feb` (EN "the Fundamental Electronic Library (feb-web.ru)", FR "la Bibliothèque électronique fondamentale (feb-web.ru)"). These are Dann's ratified lines of 2026-11-09 22:14 (rulings file), so they are seated as ratified, not as `TODO-EN`/`TODO-FR`, and no test fails on them. The brief's TODO seat, and Fable's amendment 10 on the conflict with step 8, are therefore moot. The source line stays "Tiré de {site}" with no elision.
- `poem-site.ts`: `SITE_KEYS` gains `'operalib.eu'` and `FEB`.
- `composers-poets.ts`: `COMPOSERS` gains `Napravnik, Eduard` (Направник, Эдуард; 1839–1916; French "Nápravník, Eduard") and `Verstovsky, Alexei` (Верстовский, Алексей; 1799–1862; French "Verstovski, Alexeï"), in alphabetical place. Serov left with the Judith entries, so the brief's "three composers" is two (Fable's amendment 11).
- Tests: `poem-library-strings.test.ts` (table of 13 to 15 keys; the sites test now covers every site the library holds, three after step 3); `composers-poets.test.ts` (counts 62 to 64 and 49 to 51; the two new entries; alphabetical order; every aria's composer is a `COMPOSERS` key).

**Every entry whose composer matches no key: none.** The 89 arias name 12 composers (Arensky, Borodin, Dargomyzhsky, Glinka, Mussorgsky, Napravnik, Rachmaninoff, Rimsky-Korsakov, Rubinstein, Taneyev, Tchaikovsky, Verstovsky), all keys. The check is a test.

**What I could not establish.** Whether "Nápravník" with its Czech accents is the form French Wikipedia carries as a title: it is Dann's ratified form, not looked up.

## Step 3: merge, guard, build

**Changed.**
- `tools/poems/library.json`: the 89 entries of r3 added after the 14 poems (103 in all; `version` "r2", `built` "2026-11-10"), each with `kind: 'libretto'`. The data's top-level `harvest` key is not copied (it names a working pass). **`provenance` is kept whole** (Fable's amendment 3): r3 carries 19 keys, all of them facts about the text, the opera, or its rights; nothing in them names a working pass. The rights trail stays on the entries that have it (`contributorDates` on 69, `rightsTrail` and `rightsResolution` on 13).
- `scripts/build-poem-library.mjs`: furniture checks for libretti (`LIBRETTO_FURNITURE`, `librettoFault`, `OPERA_ROLES`) and a provenance check (`PROVENANCE_KEYS`, `LIBRETTO_SITES`, `provenanceFault`). The furniture shapes are the checker's: a line that is only a role name (capitals, or a capitalised role of the entry's opera, from the 29-opera table, now in the build), a line wholly in parentheses, a parenthetical run inside a line, bracketed text, «- 38 -» page numbers, «[N. 13 - …]», «№ 7» and «Сцена V» headings, a stage-direction opener. They apply to libretti only (a poem may carry its author's parentheses: Fable's amendment 4). A Latin letter is refused for every entry (it already was). `shipEntry` throws on any of them.
- **The trace test is not in the repository, on purpose.** Fable's amendment 3 says the checker's trace test (its part d) "becomes a build check". The checker's trace test is a list of the words that must not appear, and the words are the trace, so a copy of the list in a public build script would put them in the release (rulings, 22:19). The build checks the same property by structure: a key outside `PROVENANCE_KEYS` is refused, a parenthetical in `composer`, `text_kind`, or `literary_source` is refused, and a `source.site` outside the three listed is refused. The word list stays in the desk's checker.
- Tests: `tests/build-poem-library.test.ts` +22 (one per furniture shape, plus the provenance and count tests; gate 7 is 150).
- `data/`: `node scripts/build-poem-library.mjs` wrote `dictionary.poems.b3cc2f7e.json` and removed `dictionary.poems.2e56f692.json` (Fable's amendment 6). The manifest names the new file; its dictionary `hash` (86d83340) is unchanged. `.gitignore` lists `data/dictionary.*.json` with no exception for the poem file, and the old file was tracked by force, so the new one is added with `git add -f`. I did not touch `.gitignore`.
- Pins moved by the data: `poem-library.test.ts:99` (14 to 103); `poem-source.test.ts` "every stanza start" (77 to 166, and the list of capitalised line openers). **I read the 20 new capitals** that test asks to be read. Nineteen are ordinary words opening a verse line; one, «Марта» (the nurse in Иоланта), is a proper noun, which `passageLine` would wrongly lower. It cannot be reached: each of the 89 arias is a single stanza (a new test pins that), so no card cuts an aria to a passage.

**THE BYTE COUNT DANN HEARS BEFORE SHIP: 526,109 bytes** for `dictionary.poems.b3cc2f7e.json` (103 entries), from 129,444 bytes (14 entries). The desk's checker built 492,927 bytes before step 1; the `kind` and `opera` fields add about 33,000. It is 4.1 times the old file, and the letters the matcher holds grow from 19,547 to 71,041.

**Gates after steps 3, 4, and 6's data pins:** 1 456; 2 248; 3 0 errors, 12 warnings; 4, see the end of step 7; 5 785 and 5 skipped; 6 168; 7 150; 8 OK.

**What I could not establish.** Whether the ratchet script or CI treats a 526 KB tracked data file differently from a 129 KB one (nothing in `scripts/ratchets.json` names `data/`).

## Step 6: the tests the library's growth moves

**Changed** (landed in the same commit as step 3, because the data build moves them and a commit with the data and not these would be red).
- `tools/poems/fixtures/expected_r2.txt`, regenerated with `tools/poems/reference_sw_match.py` over the r2 library and never edited by hand; `expected_r1.txt` is kept as the record. `poem-match.test.ts` reads `expected_r2.txt`.
- `poem-library.test.ts:99` pins 103. `poem-match.test.ts:62` no longer names a letter count.
- **The shortlist now engages** (42 works against `SHORTLIST` 20). The old test (`:383`, "20 works or fewer, the shortlist is everything (13)") is rewritten: 14 poems are still 13 works and the shortlist is everything; a library cut to 20 works is everything; and the shipped library gives a shortlist of exactly 20 on each of the twelve fixtures, with the poem each filled fixture sets inside it and equal to the reference's top work.
- "The floor is measured" (a control that counts short windows that would fill if the floor were lifted): 213 of 963 now, from 440, and 40 of 313, from 94, because there is more to compete with. Its lower bounds move (300 to 100, 50 to 20); the assertions that matter (none fills at 80 letters or above) are unchanged and pass. Its timeout is 60 s (it takes about 10 s with the larger library).

**Every row of `expected_r2.txt` against `expected_r1.txt`** (reference, all works):

| row | top (r1 to r2) | second (r1 to r2) | margin (r1 to r2) | fills |
|---|---|---|---|---|
| P | same | f1a88510, same | 0.219, same | yes, unchanged |
| S | same | 21568f1c to 4f94e1a3 (Queen of Spades) | 0.829 to 0.819 | yes |
| T | same | c1964bc3 to 04cc9462 (Rusalka) | 0.658 to 0.651 | yes |
| U1 | same | 0127a63f to a7b12193 (Boris Godunov) | 0.880 to 0.876 | yes |
| U4 | 21568f1c 0.038 to b655d8eb (Onegin arias) 0.050 | c1964bc3 to bb52aaf5 (Snow Maiden) | 0.006 to 0.010 | no (below the floor, both) |
| U5 | c1964bc3 0.017 to 7e59d67a (Iolanta arias) 0.019 | 2ba9040d to a78be89a (Ruslan and Ludmila) | 0.002 to 0.001 | no |
| U6 | same | c1964bc3 to 00e3244d (A Life for the Tsar) | 0.676 to 0.673 | yes |
| r114-song1 | c1964bc3 0.053 to eb5d3101 (The Tsar's Bride arias) 0.056 | f1a88510 to 3e714e57 (Prince Igor) 0.056 | 0.019 to 0.000 | no (0.056 is below 0.15) |
| r114-song2 | same | c1964bc3 to a78be89a | 0.413 to 0.408 | yes |
| r114-song3 | same | c1964bc3 to b655d8eb | 0.385 to 0.358 | yes |
| r114-song4 | same | 7b9b662a to 04cc9462 | 0.408 to 0.396 | yes |
| r114-song5 | same | c1964bc3 to b655d8eb | 0.234 to 0.227 | yes |

On eleven rows the second work changed, each to an aria's work, and the eleven margins moved; none is below 0.10 on a row that fills (the lowest is r114-song5, 0.227). On the three rows with no poem the top work changed too, to an aria's work at 0.019 to 0.056, all far under the floor of 0.15.

**One row where the matcher is not the reference, by design.** The reference scores every work; the matcher scores the 20 sharing the most trigrams, so a second work outside them is not seen. On U4 the matcher's second is a different work (7e59d67a) from the reference's (bb52aaf5); its score is not above the reference's. U4 does not fill either way, and the test pins that. On the nine rows that fill, the matcher's second is the reference's, to three decimals. This is the existing shortlist (no change to how a score is computed), now engaged.

**What I could not establish.** Whether a Lyrics could ever have its true second work outside the shortlist on a row that fills, which would overstate its margin. No fixture does; the shortlist took the true top work on all twelve.

## Step 7: the threshold, both ways

All by `apps/web/src/lib/text/poem-arias.test.ts` (9 tests, about 42 s) and the measurements below. The matcher, the fold, and `VocalLineEvent` are unchanged.

**On the songs (back).** The tree holds twelve Lyrics, not 18 (step 0, finding 2); the run is on those twelve. Row 114 songs 2 to 5 still fill («Весёлый час», «Могила», «Русская песня», «Молитва»); song 1 still does not (`low-score`: its best work is now an aria's, The Tsar's Bride, at 0.056, far under 0.15, tied with Prince Igor at 0.056). P, S, T, U1, and U6 still fill their own poems; U4 and U5 still refuse. **No song fills from an aria**: every fill is a poem, and the best aria score on each of the twelve is under 0.15 (the test checks both). The nine fixtures that fill and the three that refuse answer exactly as `expected_r2.txt` says (the brief's and Fable's "nine held-out fixtures" are twelve files, nine of which fill; Fable's amendment 7).

**From the arias (forward).** A Lyrics made from each aria's own `textModern` fills **its own entry for 89 of 89** (and its own opera's work). **The lowest margin among the arias is 0.944** (`e04061d4b4`, «Доля моя горькая!», Руслан и Людмила), which is also the lowest within one opera (an aria's margin is against the best work that is not its opera, since the arias of one opera are one work). Half of each aria's text (where that is at least 80 letters) names the same aria in more than 90 percent of cases, and never names another opera's. **What `work` per opera costs in similarity:** the highest score of any aria's text against a sibling aria of its own opera is 0.120 («Ужель та самая Татьяна» against «Пускай погибну я, но прежде»), so even if each aria were its own work the closest pair would still have a margin of 0.880, well above the 0.10 floor. Two arias of one opera never block each other.

**Time** (Fable's amendment 9). Not on a phone: Chromium at 390 by 844 on this machine, with the browser's own CPU throttle standing in (`e2e-phone/poem-arias-time.test.ts`; the matcher is `poem-match.ts` unchanged, run in the page).

| | 14 poems | 103 entries |
|---|---|---|
| longest aria's Lyrics (2,268 letters), CPU 1x | 299 ms | 1,088 ms |
| the same, CPU 4x | 1,291 ms | 4,405 ms |
| longest text in the library (15,173 letters), CPU 1x | 2,011 ms | 6,287 ms |
| the same, CPU 4x | 11,583 ms | 29,075 ms |

The twelve fixtures (113 to 567 letters) take 47 to 233 ms each in Node against the new library (15 to 73 ms against the poems alone). **The matcher runs on the main thread with no worker, so the page does not respond while it runs.** A Lyrics of the usual length is a fraction of a second, but a very long paste is seconds, and the library is three times what it was. No change to the matcher was asked for and none is made. If Dann wants it, moving the match to a worker is the fix, and it is its own piece of work.

**What I could not establish.** The match time on an actual phone. The six build songs not in the tree. Whether a real singer pastes a Lyrics as long as 15,000 letters (the longest fixture is 567).

## Step 5: empty metadata fills from the entry

**Changed.**
- New `apps/web/src/lib/text/poem-metadata.ts` (pure): `entryFields`, `fillEmpty`, `emptyWhatWasPut`, `putBack`, `poetKeyOf`, `operaLine`.
- `poem-offer.svelte.ts`: `OfferDeps` takes an optional `metadata` getter and setter; `offer` fills the empty fields after it fills POEM; `decline` empties the fields the fill put that still hold what it put; `undo` puts them back into the fields that are still empty. What the fill put is remembered for the session only, as the Lyrics memory is.
- `routes/+page.svelte`: one same-line edit on the `poemOffer.attach(...)` line, lending `metadata: { get: () => doc.metadata, set: (m) => handleMetadataChange(m) }`, so a fill is written by the path the singer's own edit takes. The file stays at 5,534 lines (its ratchet).
- `PoemLibraryCard.svelte`: an aria's role and opera stand under its title (`operaLine`): English «Pimen · Boris Godunov (Борис Годунов)». This is the sentence Fable's amendment 11 found "built by no step", and the ruling of 22:13 asks for it.

**What fills, decided here.**
- **Only a libretto fills the fields.** The brief's step 5 says "when Ilya fills POEM from the library", and its content is written for a libretto. A poem's title is not the song's, and its author is not a composer, so the 14 poems still fill POEM alone, as today. Reversible: it is one condition in `entryFields`.
- **Title** is the entry's title, the aria's opening words in Russian (ruling 22:13). **Composer** is the opera's composer as the dropdown writes it («Modest Mussorgsky (1839–1881)»); every one of the 89 is a `COMPOSERS` key. **Poet** fills only where the entry's `author` is one person who is in `POETS` (Fable's amendment 5; the data carries no `poetKey`, so the match is the Cyrillic surname and given name against the list). That is **5 of the 89** (Pushkin four times, Polonsky once); the other 84 leave Poet empty rather than put a Russian full name in a Latin field. **Translator**: no aria has one, so nothing fills.
- **The tag.** A library-filled field wears no tag. It is neither typed nor "from score" (`metadata-provenance.ts`), and a "from score" tag would be false. A later score header fills blanks only, so it does not overwrite these fields; a new score does not clear them either.
- **The three moves.** The fill (empty fields only; whitespace counts as empty); "Not this poem" (empties only the fields still holding what the fill put, so a field she has since edited stays hers); Undo (fills them again, into fields that are still empty, so a field she typed after the decline stays). After a reload the decline has no memory of what the fill put, so the fields stay; the same rule as the Lyrics memory (`poem-offer.svelte.ts` header).
- **French on the card.** The data holds no French name for a role or an opera, and none is made up, so a French card prints the Russian names («Пимен · Борис Годунов»). No new string: the line is a middle dot and parentheses. Dann may want French names; that is his to give.

**Tests.** `poem-offer-metadata.test.ts` (18, new): the pure functions, the five poets and the zero translators measured on the 89, and the controller (fill, typed field kept, nothing to write, two librettists, a poem touches nothing, no `metadata` dep, read-only, decline, Undo, keep, edit). `e2e/poem-library.test.ts` +2 (chromium): a pasted Pimen fills POEM, the card names «Pimen · Boris Godunov (Борис Годунов)», and Title, Composer, and Poet fill; "Not this poem" empties what the fill put and keeps a Title she edited, and Undo restores the rest.

**What I could not establish.**
- In a browser, a click on "Not this poem" made right after typing into Title, with no pause, did not register in my first run of the e2e; with a Tab and 800 ms for the field's "saved" note to settle it did. I read it as the re-render the note causes (the click landing on a node that was replaced), not as the fill's doing, but I did not trace it.
- With a Title typed before the paste, the Lyrics tab would not take focus in my e2e (it stays on POEM), so that case is pinned in the unit test only.
- Whether Dann wants Title to fill for the 14 poems too; I did not.

**A correction to step 4's commit.** The step 4 commit left `i18n-index.test.ts` red: the two new site strings move the key index at the head of `i18n.ts` (1,186 to 1,188 keys; `intake.` 49 to 51), and I ran only the strings and composers tests before that commit. The index is corrected in the step 5 commit below; the full web suite found it.

## Step 8: gates, and both Playwright projects

Merge: `git fetch origin cloud-lane-38` gives `534d9981`, which is an ancestor of this branch, so `git merge origin/cloud-lane-38` is a no-op and the gates below stand.

| gate | baseline | at the tip |
|---|---|---|
| 1 phonology | 456 | 456 |
| 2 dictionary | 248 | 248 |
| 3 web check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| 4 web test | 4707 passed, 1 skipped | 4744 passed, 1 skipped (258 files; +37 new tests) |
| 5 score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| 6 blurb | 168 | 168 |
| 7 integration | 125 | 150 (+25 build tests) |
| 8 ratchets | OK | OK (no ceiling raised; `+page.svelte` unchanged at 5,534) |

**Playwright** (installed Chromium via `PW_CHROMIUM_PATH`, traces off). Desk project: 138 passed, 1 skipped, 7 failed. Phone project: 25 passed, 1 skipped, 4 failed. **None of the 11 is a poem test, and I ran 10 of them on an untouched worktree of `cloud-lane-38` (`534d9981`): the same 10 fail there, with the same assertions.** They are `glue-typed-marks` (2), `insights-page:95`, `loupe-header:47`, `print-pages:20`, `singer-paths:169`, and phone `input-views:134`, `phrase-ends:26`, `relining` y and bb. The eleventh, `heic-reader-path.test.ts:111` (a HEIC poem reaching tesseract), waited 3.4 minutes and failed; I did not run it on the baseline, so it is **not established** whether it fails there (it needs tesseract, which may not load in this sandbox). The two new aria tests in `poem-library.test.ts` and the timing test pass, as do the existing poem tests.

## What I could not establish (whole lane)

- The six of the 18 build songs not in the tree; the match time on a real phone; the id of two arias (step 0).
- Whether the 10 baseline Playwright failures are this sandbox's Chromium (build 1243) or are real; and whether the HEIC test fails on the baseline.
- **Traces in the repository outside this lane's reach.** `docs/memory/` (ENVIRONMENT, STATE, INBOX, OPEN), `docs/sessions/master-list-poem-sources_r1_2026-11-03.md`, `docs/sessions/inventory-n116-learn-grayson_r1_2026-09-07.md`, and `docs/sessions/brief-desk-harvest-pons-arias_r1_2026-11-08.md` (the file name itself) name the dissertation's author. `apps/`, `packages/`, `data/`, `tools/`, `scripts/`, and `tests/` carry none (grep, this lane's tip). I did not edit `docs/memory/`, and did not touch the older session files. Dann decides.
- **The 195-poem harvest** attached after the brief is not merged (it would take the file to about 1.0 MB).
