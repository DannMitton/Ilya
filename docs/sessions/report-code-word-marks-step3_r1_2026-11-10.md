# Report: word marks saved, step 3, the binder and PAPER (Code, cloud-lane-42, r1, 2026-11-10)

Branch `cloud-lane-42`. Only one file changed: `apps/web/src/lib/library/binder.test.ts` (two tests added). No source file changed in this step.

## What was found, and why no code was needed

- **Export.** The page exports the open song as `{ ...doc.toRecord(), name: doc.name }` (`+page.svelte:2934`), and a stored song through the library's own load. `toRecord()` builds the record through `#snapshot`, which since step 2 writes `wordMarks`. `buildBinder` writes `raw ?? record` as `song.json` (`binder.ts:158-164`), so the field is in the file.
- **Import.** `readBinder` passes every parsed record through `validateRecord` (`binder.ts:238`), which keeps a well-formed `wordMarks` and drops a malformed row alone (step 1). `importBinder` (`exchange.ts:213`) hands the record to `library.save`, which stores it; the song opens through `SongDocument.open`, whose `#apply` loads the marks. A damaged song that cannot be read is written back exactly as the file carries it (`salvage`), as for every other field.
- **PAPER.** It prints what the page shows (`marks.spot` becomes `spotInverts`, and the other marks reach the engine before it prints), so it needs no change. No string was added anywhere in this build.

## Tests (`binder.test.ts`, 2 added)

1. Export a record with marks for both witnesses (one of each kind, a spot `false` in Lyrics and a spot `true` in Poem), read it back, and import it through `importBinder` into an empty `Library` on the memory driver. The stored record, and `fieldsFromRecord` of it, carry the same rows, and the spot choices are as set (the 22:20 ruling: they survive an import).
2. A binder from before this field imports as it always did (no `wordMarks` key appears), and a binder with one damaged row drops that row alone.

## Gates

| # | gate | result |
|---|---|---|
| 1 | phonology | 456 passed |
| 2 | dictionary | 248 passed |
| 3 | web check | 0 errors, 12 warnings |
| 4 | web tests | 4738 passed, 1 skipped (step 2 was 4736, plus 2 new) |
| 5 | score-parser | 785 passed, 5 skipped |
| 6 | blurb | 168 passed |
| 7 | integration | 125 passed |
| 8 | ratchets | OK, no ceiling touched |

## What I could not establish

- **A binder import in a browser.** The two tests run `readBinder`, `importBinder`, and `Library` on the memory driver; I did not run the file picker, the collision dialog, or IndexedDB.
- **The binder's own tolerance of an older Ilya.** An older Ilya imports this binder through its own `validateRecord`, which copies only the fields it knows, so it would drop `wordMarks` and keep the song. I read that from the comments in `types.ts` and from `validateRecord`'s shape; I did not run an older build.
