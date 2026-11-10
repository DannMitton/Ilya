# Report: step B4, persistence (Code, cloud lane 43, r1, 2026-11-10)

Commit: "B4: the marks are saved with the song". New: `library/barline-record.test.ts` (3 tests), one test in `e2e/barline-verb.test.ts`. **No source changed.** What Fable's review left NOT ESTABLISHED (finding 7: "whether `validateRecord` keeps an unknown `NoteCorrection` field through save, load, and binder") is now established by reading and by test.

## What I read

`library.ts:250-251`: `validateRecord` keeps `value.corrections` when `isStringRecord` holds, as a `CorrectionMap` without looking inside a record, so `barline` and `timeSignature` (both `NoteCorrection` fields, `correction.ts`) pass through. A record that holds only a mark is not pruned (B1, `withCorrection`), and the library never prunes corrections itself.

## What I tested

- **Save and load:** `recordFromFields`, JSON, `validateRecord`, `fieldsFromRecord`: a map holding a time signature mark, a shortened and tied read note, a hand-entered remainder carrying `barline: 'before'` and a pitch, and a `barline: 'none'` returns equal.
- **Binder out and in:** `exportBinder` then `readBinder` returns the same map.
- **A song with no marks** writes the record it always did (`{"m0-0-1":{"dots":1}}`).
- **A real reload** (Playwright, chromium): a barline added in the Loupe, three seconds for the autosave, `page.reload()`, the score read again from its stored bytes, and the same note offers Remove and its bar no longer reads `8 of 4`. This is the walk the brief's "save, reload" asks for: the marks ride the stored corrections, are keyed by event id, and so land on the re-read.

## Gates

Gate 3 (0 errors, 12 warnings) and gate 8 (OK) on this tree; focused tests pass (7 files, 100+ tests). The whole set is re-run at the close of B5 with both Playwright projects, since this step changes no source.

## What I could not establish

- A **binder import into a vault with the same song** (a collision) was not walked; it uses the same `validateRecord` path as every other field of the record.
- That a reload is lossless when the **reader's re-read changes an event id** (a different reader build): then the marks are orphaned like every other correction, and the drawer's existing "orphaned corrections" count names them (`orphanIds`, `correction.ts`); not walked.
