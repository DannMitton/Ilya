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
