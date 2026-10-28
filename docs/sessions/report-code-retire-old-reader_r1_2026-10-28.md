# Report: retiring the old page reader's route (`?reader=ilya`), r1, 2026-10-28

Code (cloud lane, Sonnet), for the desk. Brief: `docs/sessions/brief-code-retire-old-reader_r2_2026-10-27.md`.

## Where this was read

- Branch `cloud-lane-20`, cut from `origin/Shane` at `fb2d2e37` after `git fetch origin`. The working tree was clean at the cut.
- Four commits, each pushed to `origin/cloud-lane-20` only: `cef72ee1` (the route in the uploader, dispatch, and scan hook), `cc664ab0` (the deleted modules and their tests), `135648ac` (`copy-reader.mjs`, `package.json`, `.gitignore`, comments), `3db33649` (the ratchet ceiling).
- `Shane` and `main` were not pushed. No pull request. Nothing under `docs/memory/` was touched. The brief was not committed.
- This report is the fifth commit.

## Gates, before and after

Before is measured on the cut at `fb2d2e37` before any edit. After is measured at `135648ac`, where all code had landed. `3db33649` changes `scripts/ratchets.json` only.

| Gate | Before | After |
|---|---|---|
| 1. phonology | 291 passed (291) | 291 passed (291) |
| 2. dictionary | 248 passed (248) | 248 passed (248) |
| 3. web check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files (same twelve) |
| 4. web test | 3456 passed, 1 skipped (3457) | 3404 passed, 1 skipped (3405) |
| 5. score-parser | 775 passed, 5 skipped (780) | 775 passed, 5 skipped (780) |
| 6. blurb | 145 passed (145) | 145 passed (145) |
| 7. integration | 55 passed (55) | 55 passed (55) |
| 8. ratchets | OK | OK |

All eight "before" numbers equal the desk's baselines. The `syntactic-break-unit.test.ts` timeout did not occur on this four-core sandbox. Gate 4 after the last commit was not re-run, because that commit changed a JSON ceiling only.

Gate 4 fell by 52, not "about 48 to 49". Per file, counted by `it(` and by the runner:

| File | Before | After | Fewer |
|---|---|---|---|
| `page-reader.driver.test.ts` (deleted) | 7 | 0 | 7 |
| `reader-ids.test.ts` (deleted) | 7 | 0 | 7 |
| `recognized-to-musicxml.test.ts` (deleted) | 18 | 0 | 18 |
| `clef-key-prompt.test.ts` (deleted) | 10 | 0 | 10 |
| `ingest.test.ts` | 25 | 21 | 4 |
| `no-lyrics-notice.test.ts` | 13 | 10 | 3 |
| `scan.test.ts` | 8 | 7 | 1 |
| `format-label.test.ts` | 8 `it(` lines, one an `it.each` | 8 `it(` lines, the `it.each` two rows shorter | 2 |

The two extra against the brief's arithmetic are in section "Departures" 1 and 2. The 12 warnings are the same set before and after (`.action-btn` x3, `.btn-ghost`, `.btn-primary`, `.word-gloss`, `.word-gloss-missing`, two empty rulesets, three `tabIndex`); none is in `ScoreUploader.svelte`.

## Files changed, with line counts

`git diff --numstat fb2d2e37 HEAD`, before this report:

| File | Added | Removed |
|---|---|---|
| `apps/web/src/lib/score/ScoreUploader.svelte` | 34 | 516 |
| `apps/web/src/lib/score/ingestion/ingest.ts` | 13 | 104 |
| `apps/web/src/lib/score/ingestion/ingest.test.ts` | 5 | 89 |
| `apps/web/src/lib/score/no-lyrics-notice.test.ts` | 0 | 11 |
| `apps/web/src/lib/score/format-label.ts` | 0 | 1 |
| `apps/web/src/lib/score/format-label.test.ts` | 0 | 2 |
| `apps/web/src/lib/score/correction.ts` (comment) | 6 | 4 |
| `apps/web/src/lib/omr/scan.ts` | 6 | 12 |
| `apps/web/src/lib/omr/scan.test.ts` | 1 | 9 |
| `apps/web/src/lib/omr/restore.ts` (comment) | 1 | 2 |
| `apps/web/src/lib/reader/page-pdf.ts` (comment) | 1 | 1 |
| `apps/web/src/routes/+page.svelte` | 3 | 3 |
| `apps/web/vite.config.ts` (comment) | 1 | 1 |
| `apps/web/package.json` | 2 | 2 |
| `apps/web/scripts/copy-pdfjs-wasm.mjs` (comment) | 2 | 1 |
| `.gitignore` (comment) | 4 | 4 |
| `ARCHITECTURE.md` | 3 | 2 |
| `scripts/ratchets.json` | 1 | 1 |

Deleted whole: `apps/web/scripts/copy-reader.mjs` (83), `reader/page-reader.ts` (212), `reader/page-reader.worker.ts` (373), `reader/recognized.ts` (125), `reader/page-reader.driver.test.ts` (93), `reader/reader-ids.test.ts` (99), `score/ingestion/recognized-to-musicxml.ts` (348), `recognized-to-musicxml.test.ts` (326), `clef-key-prompt.ts` (70), `clef-key-prompt.test.ts` (77). Total across the 28 files: 83 added, 2,571 removed.

Not touched: `tools/e16-harness/`, `page-image.ts`, `page-pdf.ts` (one comment only), `staff-detect.ts`, `old-reader-seats.ts`, `SongSource.page`, `validatePage`, `PageProvenance`, `i18n.ts`, `docs/memory/`.

`ScoreUploader.svelte`: 1,349 lines at the cut, 867 now. Its ceiling in `scripts/ratchets.json` is lowered from 1350 to 867. `+page.svelte` is 5,586 lines before and after (one line out, comment lines in), so its ceiling of 5,586 is unchanged and could not be lowered. `pnpm ratchets` also prints lowerable ceilings for `LearnContent.svelte`, `InsightsPane.svelte`, and `Loupe.svelte`. Those predate this row and are not mine; I left them.

## The component's `inkFile` (amendment 9)

No collision exists on this cut. Row 113 exported `inkPng` from `page-image.ts`, not `inkFile`, and the component imports `inkPng` (`ScoreUploader.svelte:66`) and still calls it at the three poem-route sites in `take()` and `readPdfAsPoem`. The component's own `function inkFile(original: File)` was the one `announceArrival` read with `lastInk` and `lastKind`. It is removed with `lastInk`, `lastPage`, `lastKind`, and `pageFor`. The `inkPng` import and its three call sites stay. Row 122's `format-label.ts` import and the `scanKind` line in `take()`'s `ingest` hook stay.

## Section 3's two readings

**(a) `via: 'reader'` is not stored; the member goes.** Confirmed by reading `restoreFrom` (`+page.svelte`) and the uploader's `onMount`: a song's source hands the uploader bytes, and provenance is made on each re-ingest. Removed: the `reader` member of `IngestProvenance`, the `reader` tier of `fidelityBanner` (return type now `'denigma' | null`), the `p.via === 'reader' ||` clause of `noLyricsNoticeKey`, and the `'reader'` arm of the banner text (now `T('upload.banner.denigma')`). I built no test that opens a song stored with `via: 'reader'`, because the type member no longer exists and `provenance` is not in `SongSource`. The compile (gate 3) is the proof.

**(b) No key leaves `i18n.ts`.** `upload.format.pdfReader` and `upload.format.imageReader` stay, and both are still read, by row 122's `format-label.ts`. No key was deleted in either language.

## Departures from the brief, each with its reason

1. **`format-label.ts` and `format-label.test.ts` (row 122's files) needed one arm and two rows removed.** `formatLabelKey` had `if (p.via === 'reader') return ...` at its end. With the `reader` member gone, svelte-check errored on it ("types 'webmscore' and 'reader' have no overlap"), and the test file's `it.each` table held two rows with `via: 'reader'`. I removed the arm and the two rows (three lines in all). Homr's keys are untouched. The brief said row 122's work was not this row's to touch; it could not stay as it was once the member went.
2. **`no-lyrics-notice.test.ts`: three tests go whole, not two.** The brief expected `'a scanned PDF draws 1b'` to have two assertions, so that only its first would go. On this cut it has one. Deleting its only assertion would leave an empty `it`, so the whole `it` went. Gone: `'a photograph draws 1b'`, `'a scanned PDF draws 1b'`, and `'the E.16 reader (via reader) still draws 1b whatever the origin'`, plus the `scan` and `pdf` constants. That is one more test than the brief's arithmetic.
3. **`.btn-primary` rules removed from the component.** Its only user was the asking template's "Read this page" button. Left in, it would be a new unused-selector warning. `.btn-secondary` stays (the `soon` and `error` blocks use it). I also rewrote the CSS comment above those rules, which named "the PDF and picture kind question".
4. **`upload.err.readerLoadFailed` is still read.** The brief expected it to become unread, but it also said `PAGE_READER_UNAVAILABLE` stays "with its string", and that string is `upload.err.readerLoadFailed`. `classify` still maps `PAGE_READER_UNAVAILABLE` to it, so the key stays read. Only `upload.err.pageReadFailed` became unread.
5. **`upload.ask.clefTreble` is newly unread, which the brief said it would not be.** The brief listed `clef`, `clefTreble`, `clefTrebleOttava`, and `clefBass` as read by `ClefControls.svelte`, `ClefReceipt.svelte`, and `clef-ui.svelte.ts:23-24`. Reading those: `clef-ui.svelte.ts` reads `clefTrebleOttava` and `clefBass` only, and `ClefControls` and `ClefReceipt` read `upload.ask.clef` only. Before this row the key was read by `CLEF_CHOICES` in the uploader.
6. **`restoreFrom`'s `page` parameter is now unused** in `+page.svelte`. The brief allowed one line there. I kept the signature and its two callers (`:3162`, `:3296`) and rewrote the doc comment to say why. Dropping the parameter is a two-site change in `+page.svelte`, which I left for the desk to rule.
7. **The `accept()` history comment** (the block that said what `accept()` did is now `announceArrival`, naming `pageFor` and `inkFile`) was inside the deleted range and is gone with them.
8. **`ingest.test.ts`'s comment** on the surviving `PAGE_READER_UNAVAILABLE` case is rewritten, and its title is now "says so when a PDF reaches dispatch".

## The grep (section 4)

Run over `apps/web` (excluding `node_modules`, `.svelte-kit`, `build`) and `ARCHITECTURE.md`, for `reader=ilya`, `useIlyaReader`, `WorkerPageReader`, `page-reader`, `recognizedToMusicXml`, `recognized-to-musicxml`, `clef-key-prompt`, `copy-reader`, `static/reader`, `asReaderError`, `readPages`, and `cdn.jsdelivr.net/pyodide`. Remaining hits, all five:

| Hit | Kind |
|---|---|
| `omr/scan.ts:5` names `?reader=ilya` as retired | new comment, says so on purpose |
| `score/ScoreUploader.svelte:55` names `?reader=ilya` as retired | new header note, same |
| `score/old-reader-seats.ts:8` names `recognized-to-musicxml.ts` | history, stays as the brief says |
| `score/ingestion/mini-dom.ts:12` names `recognized-to-musicxml.test.ts` | history, stays as the brief says |
| `scripts/copy-pdfjs-wasm.mjs:16` names `apps/web/static/reader/` | rewritten, names the old folder as the precedent |

The `.gitignore` entry `apps/web/static/reader/` also stays (outside `apps/web`), with its comment rewritten as the brief gave. `mini-xml.test-support.ts:12` did not match the grep, so I left it.

Comments rewritten that the brief named: `ARCHITECTURE.md` codemap line (now says `page-pdf.ts`, `page-image.ts`, `staff-detect.ts` prepare a PDF or photograph and the homr route under `src/lib/omr/` reads it), `vite.config.ts` (now cites `reader/score-reader.ts` only, the one remaining `new Worker` in `reader/`), `page-pdf.ts` (names `rasterizeFirstPage`'s catch), `correction.ts`, `omr/restore.ts`, `omr/scan.ts`, `ingest.ts`, the three `ScoreUploader.svelte` comments, and `copy-pdfjs-wasm.mjs`.

**`correction.ts:547` (a rest carrying a pitch correction): NOT PINNED.** I read `correction.test.ts` and `correction-verbs.test.ts`. The only rest-with-no-pitch fixtures (`note('r1', undefined)`, `note('r', undefined, 'eighth')`) are never given a pitch correction, and `correction-verbs.test.ts:200-203` converts a note to a rest, which is the other direction. I did not read every test in the repository, so this is a reading of those two files plus a grep. I rewrote the comment to say the pinning test went with the old converter and no remaining test pins it.

## Behaviour checks (Playwright Chromium, dev build, 1440 x 900)

Run from a script in the scratchpad against `pnpm dev` on this cut; the script is not committed.

- **MusicXML, then reload.** Dropped `src/lib/omr/fixtures/tch-1.musicxml` through `input.hidden-input`: the receipt line "Format: Mu..." appeared. After `page.reload()` the intake still showed "SCORE tch-1.musicxml Clear Replace", the same six `svg` elements were on the page, and the console held no error. That is the restore else-branch, which stays.
- **PDF of a scan.** A PDF made from `src/lib/reader/fixtures/staff-page.png` (1600 x 2200) with Pillow. After the drop: "Ilya is reading the notes off your page", then "Reading your score · page 1 of 1". No error. No request to `pyodide`, `jsdelivr`, or `localhost:5173/reader/`.
- **PNG of a scan.** `staff-page.png`: "Reading your score · page 1 of 1" for the 34 seconds watched. Same request check, same result.
- **`?reader=ilya` with the PNG.** Same wait, no error, no Pyodide or jsDelivr request. The flag is ignored.
- **Existing specs.** `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm exec playwright test --project=chromium core-loop clef-controls`: 23 passed. Without that variable the browser path the config expects does not exist in this sandbox. The full Playwright suite was not run.

## Build, before and after

`pnpm --filter @ilya/web build`, both runs in this sandbox, `du -sb build`:

| | Bytes |
|---|---|
| `fb2d2e37` (before) | 461,185,751 (of which `build/reader/` 412,502 and `build/omr/` 241,849,327) |
| `3db33649` (after) | 460,747,488 (`build/omr/` 241,849,327; no `build/reader/`) |
| Change | -438,263 |

Both builds exit 0. After the change `apps/web/static/` holds no `reader/` folder. The after build was made from a tree where I had deleted the generated `static/reader/` that the before build wrote. `fetch-omr-models.mjs` downloaded the four model files here for both builds, so `build/omr` is equal and the comparison is not skewed by it.

## `upload.*` keys that nothing reads after this row

Method: every `'upload.*'` key in `i18n.ts`, searched as a quoted literal in `.ts` and `.svelte` files under `apps/web/src`, excluding `i18n.ts` and tests. A key built by string concatenation would be missed, and none of these is built that way as far as I read.

**Newly unread by this row (24):** `upload.ask.title`, `upload.ask.why`, `upload.ask.key`, `upload.ask.keyNone`, `upload.ask.keySharp`, `upload.ask.keySharps`, `upload.ask.keyFlat`, `upload.ask.keyFlats`, `upload.ask.read`, `upload.ask.cancel`, `upload.ask.clefTreble` (see departure 5), `upload.confirm.title`, `upload.confirm.why`, `upload.banner.reader`, `upload.err.pageReadFailed`, and `upload.report.title`, `.systems`, `.events`, `.spacing`, `.seconds`, `.pitchSubs`, `.durationSubs`, `.pageFailed`, `.staffFallback`.

**Already unread at the cut, not from this row (7):** `upload.continue`, `upload.drop.acceptedNow`, `upload.drop.browse`, `upload.drop.placeholder`, `upload.drop.release`, `upload.drop.title`, `upload.scanTooltip`.

**Stay read (checked):** `upload.err.readerLoadFailed` (departure 4), `upload.err.pdfUnreadable`, `pdfJbig2`, `imageUndecodable`, `imageHeic`, `upload.format.pdfReader`, `imageReader`, `upload.ask.clef`, `clefTrebleOttava`, `clefBass`, `upload.status.preparingReader`, `readingPage`. The desk decides the unread keys' fate. I deleted none.

## Where this would wall a singer in (section 6)

- A song stored with `via: 'reader'`: cannot occur, as above.
- A bookmark carrying `?reader=ilya`: the flag is now ignored, and a dropped or restored scan goes to homr. Observed in the walk above for a dropped PNG.
- A stored photograph whose `page.octaveChange` is `-1` was read an octave lower by the old reader and is read at written pitch by homr on restore. Unchanged by this row (restore through homr since 2026-10-05), not a regression. Row 127 and the measure-first row hold it.
- `SongSource.page` still exists. After this row every arrival carries `undefined` there, because `announceArrival` now passes `undefined` for `page`. `+page.svelte`'s `handleArrival` and `attachUploadedSource` still accept the parameter.

## For Dann, on the Mac

The generated folder `apps/web/static/reader/` may still be on the Mac, from earlier builds. After the merge it must be deleted there, or a local build still ships the Python through Vite's copy of `static/`. The `.gitignore` line stays so the ship script does not stop on it. The source stays under `tools/e16-harness/reader/`, so deleting the folder is reversible. The desk gives Dann the command.

## What I could not establish

- **A browser comparison with `Shane`.** I ran the three drops and the flagged drop on this cut only, and checked them against the brief's description of the states, not against a `Shane` run side by side. NOT ESTABLISHED: that the states are identical to `Shane`'s beyond what the brief said they should be.
- **The end of the homr read.** I watched the wait for 34 seconds on each scan and did not wait for the arrived receipt of a scan. The receipt for a file was observed for MusicXML only. Whether a scan completes to a score in this sandbox is NOT ESTABLISHED here.
- **The full Playwright suite.** Only `core-loop` and `clef-controls` (23 tests) were run.
- **Whether any other string or key use exists outside `.ts` and `.svelte` under `apps/web/src`** (for example in `e2e/`, `e2e-phone/`, or generated files). I did not search those for `upload.*` keys. Fable's review reported none for the reader keys in `apps/web/e2e`.
- **Whether `svelte-check` would have flagged a leftover unused local.** I removed every one I found by reading and the check ends at 0 errors and the same 12 warnings, so none was left for it to flag. Whether it would have flagged one is not shown.
- **The bytes the removed Pyodide load fetched, and whether anyone used the flag.** Unchanged from the audit; not answerable from the tree.
- **Vercel.** Whether it builds from the git tree or from the Mac is NOT ESTABLISHED, as in the review.
- **`manifest.webmanifest`** was not read.
