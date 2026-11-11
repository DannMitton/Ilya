Model: Sonnet 5.5 (claude-sonnet-5-5)

# Report: poem library harvest, step 0 (read and report, nothing changed), 2026-11-11

Read on branch `cloud-lane-45`, cut from `Shane` at `a12ee171`. The working tree held one uncommitted file, `docs/memory/OPEN.md` (the desk's notes); I did not touch or stage it. No file was changed in this step except this report.

## 1. The builder (`scripts/build-poem-library.mjs`)

- `TEXT_FAULTS` is at `:104`; the Latin rule is its row `['a Latin letter', /\p{Script=Latin}/u]` at `:110`. `textFault` is at `:122` (it skips the Latin row only for a libretto, through `GLUED_LATIN`).
- `shipEntry` `:271`. It checks the required string fields, `translator`, `source.site` and `source.url`, `spelling`, `verification.state` (verified or unverified), `kind`, then `textFault`. For a libretto only, it then runs `librettoFault` and `provenanceFault`.
- `buildPoemFile` `:315`: refuses an empty library and a repeated `id`, then maps `shipEntry`. Name is `dictionary.poems.<hash8>.json`, the hash being the MD5 of the file text.
- `provenanceFault` `:216`, `PROVENANCE_KEYS` `:209`, `LIBRETTO_SITES` `:213`. All three run only inside `if (libretto)` in `shipEntry`.
- **Confirmed (Fable's finding):** nothing in the builder reads a poem's `provenance`, `rightsHolderDates`, or `status`. A grep for `provenance`, `rightsHolderDates`, and `.status` in the file returns only the libretto paths (`:16` comment, `:216-218`, `:257-261`, `:287-289`).

## 2. The site names

- `apps/web/src/lib/text/poem-site.ts`: `SITE_KEYS` `:12` (three entries today: Russian Wikisource, operalib.eu, FEB); `siteName` `:19`. An unlisted site prints the data's own string.
- `apps/web/src/lib/i18n.ts`: `intake.poemLibrary.site.russianWikisource` `:910`, `.operalib` `:912`, `.feb` `:913`. The key index at the head of the file says "This file holds 1,219 keys" (`:19`) and `intake.` has 51 (`:48`). Step 2 adds three keys, so 1,222 and 54.

## 3. The tests the library's size or content moves

All under `apps/web/` unless stated.

| test | line | what it pins |
|---|---|---|
| `src/lib/text/poem-library.test.ts` | `:99` | 103 entries ("14 poems and 89 arias") |
| `src/lib/text/poem-arias.test.ts` | `:29-32` | 103 entries, 89 arias, 42 works; `:35` takes poems as `kind === undefined`; header `:4` says 14 poems of 13 works |
| `src/lib/text/poem-source.test.ts` | `:342-343` | stanza starts 166 ("77 from the 14 poems") and the sorted list of capitalised second lines (32 words). The test is at `:315`; the brief's `:316-342` is about two lines early on this tip |
| `src/lib/text/poem-match.test.ts` | `:43` reads `expected_r2.txt`; `:148` comment ("the library has 42 works"); `:267-274` the measured floor (`fills(6)>100`, `fills(15)>20`, `fills(80)`, `fills(100)` equal 0); `:398-400` "the 14 poems" as every entry with no `kind`, shortlist size 13; `:407-408` 42 works |
| `tools/poems/fixtures/expected_r2.txt` | whole file | the reference scores of the twelve fixtures, over the 103-entry library |
| `src/lib/text/poem-library-strings.test.ts` | `:39` RATIFIED_TABLE has 15 keys; `:82-90` the test's site map (3 sites) |
| `e2e/poem-library.test.ts` | `:360`, `:386`, `:416` read `library.json` and the poem file; I did not read the whole file for other counts (see below) |
| `e2e-phone/poem-arias-time.test.ts` | `:29` takes the "14 poems" as every entry with no `kind`; `:7`, `:17`, `:48` name 14 and 103 in text |
| `tests/build-poem-library.test.ts` (repo root) | `:111-116` 14 poems of 13 works, 89 arias; `:359-364` 103 entries, 42 works, 89 arias |

## 4. A whole Latin-script word today (read only)

- Text: `markLatinWords` is the pipeline's last pass (`apps/web/src/lib/pipeline.ts:487`; the function `latin.ts:85-96`). A word with a Latin letter and no Cyrillic one (`latin.ts:66-68`, `/[A-Za-z]/`) gets `latin = true`, no gloss, and the Seminarian table's IPA or none (`latin.ts:75-78`, `:89`). `VerseLine.svelte:26-27` keeps a Latin word in the line. `WordStack.svelte:144-164` makes it inert (no click, `tabindex` -1, `aria-disabled`). Matches Fable's reading.
- MELODY and INSIGHTS: `markup/` and `insights/` contain no reference to `latin` or `isLatinWord` (grep of both folders, tests excluded). Both panes take `transcribedLines?: readonly LineData[]` (`markup/MarkupPane.svelte:228`, `insights/InsightsPane.svelte:106`), so a Latin word reaches them as a `LineData` word with `latin: true`. **What either pane then does with it I did not read. NOT ESTABLISHED.**

## 5. The data

`tools/poems/poems-harvest-for-library_r2_2026-11-10.json`: md5 `1d16a03428113744d6f79bf3f979d8f2` (matches), 715,975 bytes, keys `version` (`r1`), `built` (2026-11-10), `entries`.
- 224 entries; no repeated `id`.
- By `source.site`: Russian Wikisource 200, az.lib.ru 12, RVB 7, ilibrary.ru 5.
- By `spelling`: modern 221, pre-reform 3.
- By `status`: `canada` 224. (`status` is the key's name; the brief's "counts by `status`" has this one value.)
- By `verification.state`: `unverified` 224. By `kind`: absent on all 224 (so all are poems).
- No `id` or `work` collides with `tools/poems/library.json` (version `r2`, 103 entries) or repeats inside the data.
- `rightsHolderDates` is a pair on all 224; the latest second year is 1966.
- Provenance keys present: `retrieved`, `editionNamedOnPage`, `authorDates`, `translatorDates`, `rightsTrail`, `hygiene`, `subpages` on all 224; `matchedBy`, `sourcePrintsYo`, `sourceNote` on 38. All are inside the `POEM_PROVENANCE_KEYS` list of step 1.

## 6. Baselines (tip `a12ee171`, tree otherwise clean, Mac)

| gate | command | result |
|---|---|---|
| 1 | `pnpm test:phonology` | 456 passed |
| 2 | `pnpm test:dictionary` | 248 passed |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings (5 files) |
| 4 | `pnpm --filter @ilya/web test` | 5189 passed, 1 skipped (280 files) |
| 5 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped |
| 6 | `pnpm test:blurb` | 168 passed |
| 7 | `pnpm test:integration` | 151 passed |
| 8 | `pnpm ratchets` | OK |

These equal the lane 47 report's merged-tip figures. The poem file today is `data/dictionary.poems.a7c468a0.json`, 552,855 bytes on disk (the review's 526,109 is a rebuild by the review's own run; the byte baseline for step 4 will be this file's).

## What Code could not establish

- What MELODY and INSIGHTS do with a `latin: true` word: not read beyond the absence of any reference in `markup/` and `insights/`.
- `e2e/poem-library.test.ts` and `e2e-phone/poem-arias-time.test.ts`: I read the lines that read the library and the pin at `:29`; I did not read each file whole, so a further count in them may exist.
- Gate 8's file count: the output I kept names only "ratchets: OK."
- The `poem-source.test.ts` and `poem-match.test.ts` line numbers differ by one or two from the brief's; I name the tip's lines above.
