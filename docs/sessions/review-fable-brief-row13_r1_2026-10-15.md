# Fable review of the row 13 brief (N.166, where a stored scan's first reopen time goes), r1

Reviewer: Fable 5.1, 2026-10-15. Brief: `docs/sessions/brief-code-n166-where-the-minute-goes_r1_2026-10-01.md` (r1, 2026-10-01). Checked against a fresh clone of `Shane` at `14e2ff8`. Every `path:line` below was read this session at that commit. Lane: a Claude Code cloud session (Sonnet) on branch `cloud-lane-9`, last of rows 5, 47, 48, 13. The brief measures and keeps nothing, so under `docs/memory/CONTRACT.md:25` it may start while its review runs; this review is the review.

## Verdict

REWRITE. The path the brief instruments no longer runs on a reopen. Since `bbe524b` (2026-10-06) a stored scan is restored by homr through `restoreStoredScan` (`apps/web/src/lib/score/ScoreUploader.svelte:790-797`; `apps/web/src/lib/omr/restore.ts:80-110`), and the Pyodide page reader the brief's steps 2b to 2d stamp (`page-pdf`, `rasterizePdf`, `loadPyodide`, `loadSeconds`) runs only behind `?reader=ilya` (`ScoreUploader.svelte:790`, `useIlyaReader`, `apps/web/src/lib/omr/scan.ts:25-27`). More than that: the question the desk put tonight, why the first reopen still costs time, is NOT ESTABLISHED on today's tree. A scan dropped now keeps its reading at the drop (`ScoreUploader.svelte:289` hands `announceArrival({ file, reading })`; `+page.svelte:3772` stores `reading: scan.reading` with the source), and a reopen whose stamp matches returns the kept reading with no read (`restore.ts:42-44`, `:54`). The record "first reload 44 s, later 0.4 s" (`docs/memory/QUEUE-archive.md:68`, 2026-10-05 23:46) was taken on a song stored by the old reader, whose first reload re-read and then kept. So the rewritten brief first tests whether a scan dropped at HEAD reopens from the kept reading, and only then measures the one case that still reads: a stored reading whose stamp is not the installed reader's.

The replacement brief is written out below (amendments 1 to 7) so the desk can paste it whole.

## Citations checked

| Citation | Status at `14e2ff8` |
|---|---|
| `ScoreUploader.svelte:779-785`, `onMount` restores by `handleFile(file, restore.answers)` | MOVED and SPLIT. `onMount` is `:786-816`. For a readable scan it calls `restoreStoredScan` (`:790-797`); `handleFile(file, restore.answers)` is the `else` branch (`:802`), taken for a non-scan file or under `?reader=ilya`. |
| `:552-553` `storedAnswers`; `:569-579` `ingestScoreFile`; `:628-676` `readPages`; `page-pdf.ts:52` `TARGET_DPI`; `page-reader.worker.ts:92-94` Pyodide | NOT RE-READ; they belong to the `?reader=ilya` path, which a reopen does not take. |
| `apps/web/build/sw.js` has no rule for `cdn.jsdelivr.net` | NOT RE-READ; Pyodide's CDN is not on the reopen path. |
| QUEUE row 13: "partly overtaken by `bbe524b` (first reload 44 s, later 0.4 s)" | CONFIRMED as a record (`QUEUE-archive.md:68`, `:232`; `STATE.md:87`). The 44 s was a song "stored by the old reader" (`QUEUE-archive.md:68`). |
| `restore.ts` ~`:40-41`, a kept reading is reused when the stamp matches | CONFIRMED: `isCurrent` at `restore.ts:42-44`; `restoreScan` returns `from: 'kept'` at `:54`. |
| The stamp | `apps/web/src/lib/omr/stamp.ts:23`, `READER_STAMP = homr-web@0.2.0-ilya.7/465` (`:17`, `:20`). A homr-web or model bump re-reads every stored scan once. |
| A dropped scan keeps its reading | `scan.ts:102` (`hooks.ingest(readingFile(...), { musicXml, stamp: READER_STAMP })`), `ScoreUploader.svelte:289`, `+page.svelte:3772` (`attachSource(... reading: scan.reading)`), read back at `+page.svelte:3708` (`restoreFrom`) and passed as `restore={restoreSource}` (`:4444`). |
| The reopen's own timing line | `scan.ts:105-110`, `logRead`: `[omr] homr read N of M pages of <file> in <ms> ms on <backend>`; `durationMs` from `homr-reader.ts:327` and `:395`. On the kept path nothing logs: `restore.ts:107` logs only where `restored.result` exists. |
| "The scan reader stays on the Mac" (`CONTRACT.md:75`) | The reason is the WebGPU path. This brief ships nothing and the row 98 review already ran the reader in a cloud box on wasm (97 s for one page). The cloud answers the structural question; the WebGPU timing stays on the Mac (amendment 6). |

## Amendments: the replacement brief

### 1. Title and why

> # Brief to Code: does a stored scan's first reopen still read, and where its time goes (N.166, r2)
>
> From the desk, 2026-10-15; supersedes r1 of 2026-10-01, whose path (Ilya's Pyodide page reader) a reopen no longer takes. **This brief changes no shipped behaviour: it measures, reports, and restores.** Any stamp you add is removed before the commit; the commit carries the report and nothing else.
>
> Since `bbe524b` a stored scan is restored by homr (`apps/web/src/lib/omr/restore.ts:80-110`, called from `apps/web/src/lib/score/ScoreUploader.svelte:790-797`); a reading whose stamp equals `READER_STAMP` (`apps/web/src/lib/omr/stamp.ts:23`) is used as it is and nothing is read (`restore.ts:42-44`, `:54`). A scan dropped today keeps its reading with the song at the drop (`scan.ts:102`, `ScoreUploader.svelte:289`, `+page.svelte:3772`). The record of a slow first reload (44 s, `docs/memory/QUEUE-archive.md:68`) was a song stored by the reader before the stamp. Whether a scan dropped at HEAD still costs a read on its first reopen is NOT ESTABLISHED; that is question 1. Question 2 is where the time goes when a read does happen, which it does once per reader bump for every stored scan.

### 2. Lane

> Lane: a Claude Code cloud session (Sonnet) on branch `cloud-lane-9`, after rows 5, 47, and 48. The reader runs on the wasm path here (the headless adapter lacks `shader-f16`; `docs/sessions/review-fable-brief-row98_r1_2026-10-14.md`, "What this session established", item 5); every time you report is a wasm time and says so. Build as the gates do and serve `apps/web/build` with `python3 -m http.server 5199 --bind 127.0.0.1` from that folder; Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, viewport 1440 by 1000 (the method of `review-fable-brief-row98_r1_2026-10-14.md`, amendment 3). The scan: `tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf` (tracked), and its first page as a PNG from `pdftoppm -r 300 -f 1 -l 1 -png` for the picture case.

### 3. The work

> **Expectation, stated before the measurement (the control rule, `CONTRACT.md:81`):** a scan dropped at HEAD reopens from the kept reading, with no `[omr] homr read` line, no request under `/omr/models/`, and the score painted within a few seconds; the likeliest failure mode is the drop path not storing the reading when the song is first created (a race between `attachSource` and the first save), in which case the first reopen reads and the second does not.
>
> 1. **Question 1, the kept path.** In one browser context: drop the PDF on the second `input[type=file]`, wait for `[omr] homr read 1 of 1 pages …` (`scan.ts:107-110`) and `.receipt-score` visible, note the time in that line and the backend. Reload the page. Record: whether `[omr] homr read` appears again; every request matching `ort-wasm|\.onnx|/omr/`; the wall time from navigation to `.receipt-score` visible; and the busy label shown, if any (`restore.ts:89-92` shows « Préparation du lecteur de page » only when the stamp does not match). Reload a second time and record the same. Repeat once for the PNG. Say which of the two expectations held.
> 2. **Question 2, the read that still happens once per reader bump.** Make the kept reading stale without changing the reader: in the same context, open the library's IndexedDB in DevTools or by script, find the song's source record, change `reading.stamp` to any other string, and reload. (`isCurrent`, `restore.ts:42-44`, compares the stamp alone.) Record, with `performance.now()` stamps you add locally in `restore.ts`, `scan.ts`, and `homr-reader.ts` and remove after: (a) navigation to `onMount`'s call of `restoreStoredScan`; (b) `import('$lib/reader/page-pdf')` and `rasterizePdf` (`scan.ts:38-39`), and whether pdf.js took its wasm decoder; (c) `import('./homr-reader')` (`scan.ts:46`); (d) the first `onProgress` with `stage === 'models'` to the first with another stage (the model and engine load; `restore.ts:96`); (e) that to the read's `durationMs` (`homr-reader.ts:395`); (f) `hooks.ingest` to `.receipt-score` visible; (g) the second reload after the re-read, which must be the kept path again (`hooks.keep`, `restore.ts:109`). Run (a) to (g) twice: once with the HTTP cache disabled, once warm, so download is bounded. Repeat for the PNG.
> 3. Remove every stamp. `git --no-optional-locks diff --stat` prints nothing before you write the report.

### 4. Definition of done

> For question 1: four reopens (PDF first and second, PNG first and second), each with the three signals (read line, `/omr/` requests, wall time), and one sentence: a scan dropped at HEAD does or does not read on its first reopen. For question 2: a table of (a) to (g) for the four runs (PDF cold, PDF warm, PNG cold, PNG warm), the backend named in every row (expect `wasm`), and one sentence saying which of (a) to (g) holds most of the time here. If the parts do not reach the total, say what is between them that you did not stamp. NOT ESTABLISHED beats an estimate.

### 5. Constraints

> Change nothing that ships. No fix, even an obvious one; the remedy is Dann's call. Never edit `docs/memory/`; do not commit this brief. All eight gates after the stamps are removed (phonology 251, dictionary 248, web-check 0 errors 12 warnings, web-test 2512 plus rows 5, 47, 48, score-parser 675 passed 5 skipped plus theirs, blurb 145, integration 55, ratchets OK; `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117`), because the stamps touched three source files even briefly. Commit the report alone; push only `cloud-lane-9`; never `Shane` or `main`; no pull request.

### 6. What stays on the Mac

> The size of (d) and (e) on Dann's path is a WebGPU number this box cannot take. The report's table is the wasm shape of the read; one line says that the Mac's (d) and (e) are owed, and that the kept-path answer (question 1) does not depend on the backend. If question 1 shows the kept path holds, the desk tells Dann that a scan dropped now reopens without a read and that the one remaining read is the per-bump re-read, with its wasm shape; the Mac measurement is then a lower priority and Dann decides whether it is taken.

### 7. Report

> `docs/sessions/report-code-n166-first-reopen_r2_<date>.md`: the two tables, the backend, the browser build, the three files stamped and the `diff --stat` line showing them clean, each gate with its number, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer.

## What the brief forbids or invites, checked

- The r1 brief's "no git writes" is superseded for this lane by `CONTRACT.md:75`; the rewrite commits the report alone.
- The r1 brief's step 3 (clearing the HTTP cache for the Pyodide CDN) survives as the cold and warm pair in step 2, for the model and engine files under `/omr/`.
- Nothing here touches `VocalLineEvent`, `reconciliation/`, or any store; question 2 edits one record's `reading.stamp` in the test browser's own IndexedDB, which is that browser profile's and not Dann's.

## What I could not establish

- Whether a scan dropped at HEAD reopens from the kept reading. The code says yes (`+page.svelte:3772`, `restore.ts:54`); no run was made here. That is question 1.
- Whether `doc.attachSource` at `+page.svelte:3771-3781` persists before a reload that follows the drop closely; the failure mode named in amendment 3 covers it.
- The IndexedDB database and store names for the source record (`apps/web/src/lib/library/driver.ts`, not read in full); Code reads them before step 2.
- Whether the row 98 review's 97 s single-page wasm read is the right order for this box; it was one run in one container.
