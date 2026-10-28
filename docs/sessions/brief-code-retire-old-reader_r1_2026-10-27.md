# Brief for Code: retire the old page reader's route (`?reader=ilya`), r1, 2026-10-27

Desk (Opus 5.5). For a cloud session, Sonnet, one dedicated branch, cut from `Shane` AFTER batch D (`cloud-lane-17`) and row 113 (`cloud-lane-18`) have merged, because both touch `ScoreUploader.svelte`. Serves N.197 (QUEUE row 155, no outside service at run time) and the ceiling of `ScoreUploader.svelte`.

## 1. The ruling

Dann 2026-10-27 14:59: *"retire the old reader's route, as Fable recommends"*, on Fable's audit `docs/sessions/report-fable-old-reader-audit_r1_2026-10-27.md` (read it in full first; every `path:line` below is from it, read at `234eff3f`, and must be re-located by name on your cut). His earlier words, 14:37, are why the audit came first: *"I'm wary of abandoning something we worked so hard on without all the information."* So this row removes the ROUTE and its browser plumbing, and keeps every piece of the work that has a use: nothing under `tools/e16-harness/` is deleted or edited.

What the singer sees change: nothing. A dropped scan has gone to homr since 2026-10-04 and a stored scan since 2026-10-05 (audit, section 2); no control offers the flag.

## 2. Remove

1. The two `useIlyaReader` branches in `ScoreUploader.svelte` (audit: `:286-287` on a drop, `:790-805` on restore), and the code only they reach: the `asking` state and its template, `probeFile`, `readAsked`, `readPages`, `lastInk` and `lastPage`, and the restore else-branch (audit sections 1 and 6). Read every remaining caller of each before deleting it; where homr's route also calls one, it stays and the report says so.
2. `useIlyaReader` in `apps/web/src/lib/omr/scan.ts` (audit `:25-27`) and its tests in `scan.test.ts`.
3. `apps/web/src/lib/reader/page-reader.ts`, `page-reader.worker.ts`, `recognized.ts`, and their tests (`page-reader.driver.test.ts`, `reader-ids.test.ts`).
4. `apps/web/src/lib/score/ingestion/recognized-to-musicxml.ts` and `clef-key-prompt.ts` and their tests, after checking that `ClefControls.svelte` does not import either (audit: the `upload.ask.*` strings are shared and STAY).
5. The `readPages` seam in `ingest.ts` (audit `:163`, `:232-247`) and the two `ingest.test.ts` cases that set `via: 'reader'` (audit `:394-407`).
6. `apps/web/scripts/copy-reader.mjs` and its place in `dev` and `build` (`apps/web/package.json:9-10`), and the `.gitignore` lines for `apps/web/static/reader/` (audit `:24-28`).

## 3. Keep, untouched

`apps/web/src/lib/reader/page-image.ts`, `page-pdf.ts`, `staff-detect.ts`; `score/old-reader-seats.ts` and its 18 tests (stored songs from before 2026-10-04 still carry its ids); `tools/e16-harness/` whole, including `reader/` and `src/scan-scorer.ts`; the `upload.ask.*` strings. Two things decided by reading, not by assumption: (a) whether a stored song's `provenance` can carry `via: 'reader'` (read `ingest.ts:57`, the song format, and the library's save and load); if it can, keep the type member and every reader of it, so an old song still opens; (b) whether `upload.format.pdfReader` and `upload.format.imageReader` have any reader besides the receipt (`ScoreUploader.svelte:833` at `234eff3f`; batch D's row 122 rewrites the receipt's format choice, so read its merged code); if none, remove both keys in EN and FR, and say so.

## 4. Prove nothing a singer reaches changed

- Grep `apps/web/src` for `reader=ilya`, `useIlyaReader`, `WorkerPageReader`, `page-reader`, `recognizedToMusicXml`, `cdn.jsdelivr.net/pyodide`: report every remaining hit (expect comments only; rewrite a comment that now lies).
- In Playwright Chromium on the dev build: drop a MusicXML file, a PDF of a scan, and a PNG of a scan through `input.hidden-input`; each reaches the same state it reaches on `Shane` (the arrived receipt for the file, the reader's wait for the two scans). Then load the address with `?reader=ilya` and drop the PNG: it now goes to homr, no error.
- The production build: `pnpm --filter @ilya/web build` succeeds with no `static/reader/` produced; report the build's size before and after.

## 5. Gates and ceilings

Measure the eight gates yourself on your cut before any edit and report them (the baselines move with batch D and row 113; take yours). Gate 4 falls by the removed tests (about 42 per the audit); count each removed file's tests. `ScoreUploader.svelte`'s ceiling in `scripts/ratchets.json` is lowered to its new length in the last commit, never raised. This row changes no computation another site repeats.

## 6. Where would this wall a singer in?

- A song stored with `via: 'reader'` (section 3 a). Open one in a test if the format allows; if no fixture holds one, build one in the test.
- Anyone with a bookmark carrying `?reader=ilya`: it now goes to homr. Say so.

## 7. Report

`docs/sessions/report-code-retire-old-reader_r1_2026-10-27.md`: every file removed and changed with line counts; section 3's two readings; the grep; the three drops and the flagged drop; the build size before and after; the eight gates before and after; "What I could not establish". NOT ESTABLISHED beats a complete invented answer.

## What the desk could not establish

- The bytes the removed Pyodide load fetched (audit, section 1).
- Whether any singer ever used the flag.
- Found by the audit, not this row: a treble clef with an 8 below is read an octave high on the homr route (audit section 3, row 5); the old reader did not read it either. The desk opens a measure-first row for it.
