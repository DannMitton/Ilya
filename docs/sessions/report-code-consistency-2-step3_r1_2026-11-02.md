# Report: consistency batch 2, step 3, the names table and its test (Code, cloud lane, r1, 2026-11-02)

Read at: branch `cloud-lane-27`, parent `9542cf61` (step 2). Working tree clean before the step.

## What changed, file by file

- `ARCHITECTURE.md`: new section `## Names`, before "Invariants", with a short preface and a table of exactly the columns `| id | key | EN | FR | code today | folder today | retired |`, one row per record in `names.ts` in record order (17 rows). The rows were generated from the real record and `t()` by a scratch test (deleted), not typed. Cells: `EN` and `FR` are `t(nameKey, lang)`; `code today` is each `identifiers[].today` in code font joined by `, `; `folder today` is `folder.today` in code font or blank; `retired` is each pattern in code font joined by `, ` or blank. "Where to start" now points to the table first.
- `apps/web/src/lib/names-table.test.ts` (new, 23 tests): reads `ARCHITECTURE.md` and `docs/house-style/interface-text.md` as source. It checks the header is exactly the fixed columns, that the rows' ids equal the records' ids in order (a missing row and an extra row both fail), and that each row equals its record cell by cell. For `interface-text.md` section 2 it takes each row whose key cell names exactly one key (no `*`) that a record has as `nameKey`, and checks the English and French cells against `t()`. It also checks it is not vacuous (the five documents are among the checked rows, at least ten rows).
- `apps/web/src/lib/names.ts`: the header's "What reads it" now names the three readers (`names.test.ts`, `retired-names.test.ts`, `names-table.test.ts`). `retired-names.test.ts` exists from step 4's commit.
- `docs/house-style/interface-text.md`: the `tab.markedScore` row loses "(to be `tab.melody`)" (batch 3 renames the key; `code-conventions.md` section 1 already says so); the "Until consistency batch 1 creates `names.ts`" sentence says `names.ts` is the record and names the test.

## Positive control

I planted four faults and restored each file: a changed EN cell in the `melody` row (1 failed), a deleted `guide` row (2 failed), an extra `ghost` row (1 failed), and `LEÇONS` changed to `LECONS` in `interface-text.md` (the French check failed). The restored tree passes 23 of 23.

## Rows in `interface-text.md` section 2 the test does not check

Twelve rows are checked (the five documents, DRAWER, PIECE, VOICE, INPUT, POEM, LYRICS, and ANALYSIS). Not checked, because no record has their key: `songs.heading`, `binder.heading`, `cosmetic.heading`, `inspector.dictionary`, the LOUPE row (no key), `loupe.station.*`, the panels of the LOUPE, the spot controls (two keys), `drawer.paper` and `a11y.paper` (two keys; the `page` record is checked in the architecture table instead), and the rows with no backticked key. A one-off scratch comparison (not committed) found all the single-key rows without a record also agree with `t()` in both languages.

## For step 4

The `retired` column quotes retired words on purpose (`Transcribe and fit`, `the Paper`, `Partition annotée` and others match their own source text as phrases; the bare patterns such as `\bMarkup\b` do not match their own source, because no word boundary falls before the word). Step 4's guard therefore skips the `retired` cell of the Names table, which this test keeps equal to `names.ts`, so it cannot grow quietly.

## The eight gates

Phonology `Tests  407 passed (407)`; dictionary `248 passed (248)`; web-check `svelte-check found 0 errors and 12 warnings in 5 files`; web-test `Tests  3826 passed | 1 skipped (3827)` (3803 plus the 23 new); score-parser `785 passed | 5 skipped (790)`; blurb `148 passed (148)`; integration `98 passed (98)` (after `svelte-kit sync`); `ratchets: OK.` (625 files).

## Not established

Nothing new in this step.
