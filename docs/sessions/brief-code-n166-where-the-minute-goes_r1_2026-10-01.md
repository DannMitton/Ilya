# Brief to Code: measure where a stored scan's minute goes (N.166)

From the desk, 2026-10-01. No git writes. Gates before and after. **This brief changes
no shipped behaviour: it measures, reports, and restores.** Any instrumentation you add
is removed before the report, and `git --no-optional-locks diff --stat` is empty at
the end.

## Why

N.166 is open: a song made from a PDF or a photograph re-runs the page reader on every
reload. Code measured a one-page PDF after reload at « Préparation du lecteur de page »
from 3.8 s to 61.3 s (`docs/memory/STATE.md` N.166). The reader's own baselines do not
add up to that: the worker warm-up was 3.36 s and `envelope.run` 1.96 to 2.36 s per
page (`docs/memory/ENVIRONMENT.md` §THE PAGE READER, N.59). About 55 s is unaccounted
for. Dann is about to confer on a remedy (`memo-overnight-A17_r1_2026-10-01.md`,
finding 1), and the right remedy depends on where the time goes.

## The path, with lines read 2026-10-01

- `apps/web/src/lib/score/ScoreUploader.svelte:779-785`: `onMount` restores by calling
  `handleFile(file, restore.answers)`.
- `:552-553`: `storedAnswers` makes it a picture; `getPageReader()` starts the worker.
- `:569-579`: `ingestScoreFile(file, { readPages, ... })`.
- `:628-676` `readPages`: for a PDF, `import('$lib/reader/page-pdf')` at `:636` and
  `rasterizePdf(file)`; then `getPageReader().read(inks, ...)` at `:670`.
- `apps/web/src/lib/reader/page-pdf.ts:52`: `TARGET_DPI = 400`.
- `apps/web/src/lib/reader/page-reader.worker.ts:92-94`: Pyodide v0.26.4 and
  `['numpy', 'opencv-python', 'matplotlib']` from `cdn.jsdelivr.net`; `:255-291` the
  warm-up, which already posts `loadSeconds` in its `ready` message, read at
  `page-reader.ts:173` into `WorkerPageReader.loadSeconds`.

## The work

1. Build and preview as the gates do. Load a song whose source is a ONE-page PDF
   (Code's N.166 measurement used one; if it is not in the library, make one from a
   fixture and record which).
2. Reload the page and record, with `performance.now()` stamps you add locally and
   remove after, the wall time of each of these, in order:
   - a. from `onMount` to the first `busy` label;
   - b. `import('$lib/reader/page-pdf')` resolving;
   - c. `rasterizePdf(file)`, and separately whether pdf.js took the WASM or the
     `_nowasm_fallback` decoder (`page-pdf.ts:138-141` names the failure mode);
   - d. the worker's `loadSeconds` as posted, split if you can into `loadPyodide`,
     `loadPackage`, and the module and cache fetches;
   - e. `getPageReader().read(...)` to its resolution;
   - f. the score painted.
3. Do the reload twice: once with the browser's HTTP cache cleared (DevTools, Disable
   cache), once warm. The CDN packages are not in the service worker's cache
   (`apps/web/build/sw.js` has no rule for `cdn.jsdelivr.net`), so the two runs bound
   how much of the minute is download.
4. Repeat 2 and 3 once for a stored PHOTOGRAPH (greyscale PNG path, `:638`) if one is
   in the library, so the PDF-only costs (b, c) are separated.
5. Remove every stamp. `git --no-optional-locks diff --stat` must print nothing.

## Definition of done

A table of a to f for each of the four runs (PDF cold, PDF warm, photo cold, photo
warm), the browser and machine named, and one sentence saying which of a to f holds
most of the minute. If the parts still do not reach the total, say what is between
them that you did not stamp. NOT ESTABLISHED beats an estimate.

## Constraints

- Change nothing that ships. No fix, even an obvious one; the remedy is Dann's call.
- No git writes; read-only git as `git --no-optional-locks`.
- Gates before and after (`pnpm test`, `pnpm ratchets`, `pnpm check` in `apps/web`),
  because the stamps touch `ScoreUploader.svelte` and the worker even if briefly.

## Report

`docs/sessions/report-code-n166-where-the-minute-goes_r1_2026-10-01.md`.
