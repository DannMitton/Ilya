# Brief for Code, r1: N.174 slice D.2.5, the `reader/` module

Written by the desk 2026-09-27 after D.2.4 shipped at `128610b`. Spec, plan, and module map
as in D.2.1's brief. Every `path:line` here was read by the desk at `128610b` this session.
If the tree has moved, the tree wins; say where.

**What the singer sees must not change.** The desk compares the 84 screenshots once you are
done. This slice moves the code that reads a score from MusicXML, MuseScore, PDF, and a
photograph, so the checks in "Done when" open each kind.

## Before you start

Fetch `Shane` and confirm HEAD is `128610b` or a descendant. One writer on `Shane` at a time.
**Take the "before" reading first.** No `git stash`, `checkout`, `restore`, `worktree`, or
other git command that writes; read old code with `git show 128610b:<path>`.

**Grep with `-a`.** `library/binder.ts` holds bytes that make plain `grep` call it a binary
file and print nothing for it; the desk's first scan missed its import that way.

## The move

All paths are under `apps/web/src/lib/` unless given in full. Use `git mv`. **`reader/` is
flat** (DESK DEFAULT): the `engine/` and `ingestion/` levels go, and `vendor/` stays a
subfolder.

The 19 files, and where each goes:

- `shane/engine/` to `reader/`: `errors.ts`, `mscz-converter.ts`, `mscz-converter.test.ts`, `page-image.ts`, `page-pdf.ts`, `page-reader.ts`, `page-reader.worker.ts`, `page-reader.driver.test.ts`, `reader-ids.test.ts`, `score-reader.ts`, `score-reader.worker.ts`, `staff-detect.ts`, `staff-detect.test.ts`.
- `shane/engine/vendor/` to `reader/vendor/`: `webmscore.js`, `webmscore.d.ts`.
- `shane/ingestion/` to `reader/`: `recognized.ts`, `zip-reader.ts`, `zip-reader.test.ts`, `zip-fixture.ts`.

**What stays:** `shane/engine/notation-fonts.ts` (it goes to `score/` in D.2.6), and every
other file in `shane/ingestion/`.

## Paths inside the moved files that the flattening breaks

1. `mscz-converter.ts:51` `../ingestion/zip-reader` becomes `./zip-reader`.
2. `mscz-converter.test.ts:19`, `:20` `../ingestion/zip-reader`, `../ingestion/zip-fixture` become `./zip-reader`, `./zip-fixture`.
3. `page-reader.worker.ts:33` `../ingestion/recognized` becomes `./recognized`.
4. **`reader-ids.test.ts:26-28`, three `new URL(…)` paths.** The file rises one level (from `lib/shane/engine/` to `lib/reader/`), so each loses one `../`: `:26` and `:27` go from six to five; `:28` goes from four to three (`'../../../static/reader/run_page2.py'`). **`:28` fails silently if it is wrong:** `existsSync` at `:96` skips the assertion when the file is missing. So, with the dev server having run once (it generates `apps/web/static/reader/`), prove the assertion at `:97` ran: temporarily change one byte of the expected text in the test, see it fail, and put it back. State your expectation first.
5. Unchanged, because each pair moves together: `score-reader.ts:29`, `:125` and `page-reader.ts:30`, `:156` (each facade and its Worker); `mscz-converter.ts:98` (`./vendor/webmscore`); `page-pdf.ts:33`; the `./errors` imports.

## Importers that stay behind

Relative, in `shane/` (rewrite to `$lib/reader/…`):

- `ScoreUploader.svelte:62`, `:63`, `:64`, `:65`, `:66`, `:82`, and the four dynamic imports of `./engine/page-pdf` at `:358`, `:392`, `:636`, `:707`.
- `ingestion/ingest.ts:36`, `:37`, `:44`, `:45`.
- `ingestion/ingest.test.ts:19`, `:20`, `:21`.
- `ingestion/recognized-to-musicxml.ts:43`; `ingestion/recognized-to-musicxml.test.ts:14`.
- `ingestion/clef-key-prompt.ts:19`; `ingestion/clef-key-prompt.test.ts:11`.

By `$lib/shane/…`:

- `library/binder.ts:21`; `library/binder.test.ts:18`.
- `analysis/diction-fold-live.test.ts:20`.

Comments naming old paths: `library/zip-writer.ts:5`, `voice/engine/errors.ts:2`, `:8`, and any
`grep -arn "shane/engine/\(score-reader\|page-\|mscz\|staff-detect\|errors\)\|shane/ingestion/\(recognized\.ts\|zip-\)" apps tools packages docs/memory`
finds (not `docs/sessions/`). `ARCHITECTURE.md`: a `src/lib/reader/` entry; these files
leave the `lib/shane/` listing.

## Done when

- `apps/web/src/lib/reader/` holds the 19 files, two of them in `vendor/`. `lib/shane/engine/` holds only `notation-fonts.ts`.
- `node scripts/ratchets.mjs` passes with no `MODULE` breach. **State your expectation first.** The desk expects none: `reader/` imports only itself and `$lib/library/zip-writer` (from `zip-fixture.ts:15-18`), which is outside the six.
- The reader-ids control in item 4 above, reported.
- All eight gates pass, web-test still 1493. Playwright desktop 28 and phone 2 stay green.
- **On localhost, one score of each kind still opens,** before and after, with the same result: a MusicXML file (the e2e fixture), a `.mscz`, a PDF, and a photograph, whichever of the last three exist in `tools/`, the test fixtures, or `~/Documents/Finale Files`. Name each file you used. A kind you could not find a file for is NOT ESTABLISHED, not skipped silently.
- In the browser's network panel, both Workers load from their new paths with no 404.
- A memo of fifteen lines or fewer in `docs/sessions/memo-code-n174-d25_r1_2026-09-27.md`: what moved, the reader-ids control, the four kinds opened, the gates, and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**

## Do not

- Do not move `notation-fonts.ts` or any other `ingestion/` file. They go to `score/` in D.2.6.
- Do not touch `apps/web/scripts/copy-reader.mjs` or `static/reader/`; they name no `shane` path.
- Do not change any string a singer sees.
- Do not use `git stash`, `checkout`, `restore`, `worktree`, or any other git command that writes. Do not commit. Dann ships with `ilya-ship.sh`; `git add` the new paths first.
