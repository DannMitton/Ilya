# Review: brief-code-retire-old-reader_r1_2026-10-27 (retire `?reader=ilya`)

Fable, 2026-10-27, under `docs/memory/CONTRACT.md` section 1 item 19. Read only. Clone `/home/claude/ilya`, branch `measure-n194` at `4afd8dd8` (code equal to `Shane` at `234eff3f` per the task). Every `path:line` below was read this session in that clone; paths are relative to the clone root. The two lanes that merge first, `cloud-lane-17` and `cloud-lane-18`, are not in this clone (`git branch -a` lists only `Shane` and `cloud-lane-16`), so their merged code is NOT READ; what is said about them comes from their briefs, read in full this session.

## Verdict: SEND WITH AMENDMENTS

The ruling is sound and the brief's shape is right: the route and its browser plumbing go, the harness stays, the singer sees nothing change. Eleven amendments, two of them load-bearing.

**The two that matter, first.**

1. The brief removes "the restore else-branch" (section 2 item 1). That branch is the restore of every stored MusicXML, `.mxl`, `.musx`, and `.mscz` file, not the old reader's. `onMount` (`apps/web/src/lib/score/ScoreUploader.svelte:786-816`) reads `kind = await readableKind(file)` (`:789`); `kind` is `null` for every direct format (`:505-512`), and `null` takes the else-branch at `:798-803`, `handleFile(file, restore.answers ?? undefined)`. Removing it means a reload of any song with a stored MusicXML file never re-ingests it. What goes is the clause `&& !useIlyaReader(location.search)` at `:790` and the `restore.answers` argument at `:802`; the else-branch stays as `await handleFile(file)`. This error is mine: the audit's section 1 and section 6 named "the restore else-branch" as reader-only, and the brief carried it. Amendment 1 replaces the text.

2. The brief's removal list for `ScoreUploader.svelte` names seven things; the compiler will find about twenty. Sonnet will follow the errors, but the brief is where the desk says which of them are the old reader's and which are the homr route's, so Code does not take a homr-route line down with them. Amendment 2 names each with its line.

Section 3's two open readings close by reading, both in favour of removal (amendments 4 and 5), and the `.gitignore` removal would wall Dann in at the ship (amendment 6).

## Checks the task asked for

- **homr's route keeps everything it needs.** `take()` (`:267-301`) calls `readScanAsScore` at `:287-292` with its four hooks; nothing in it is removed except the `useIlyaReader` clause at `:286` and the `pendingPoemFallback` assignment at `:285` (write-only once `readAsked` goes; its only reader is `:738`). `rasterizeFirstPage` (`:353-376`), `readPdfAsPoem` (`:390-413`), `readAsPoemByOcr` (`:440-488`), `undecodablePictureMessage` (`:495-498`), `readableKind` (`:505-512`), `handleFile`'s direct-format body (`:549-605`, less the picture lines named in amendment 2), `announceArrival` (`:624-628`), `onMount`'s homr branch (`:790-797`), `reset` (`:818-822`), `formatLabel` (`:826-836`, which row 122 replaces), and `classify` (`:842-910`) all stay. The clef controls import nothing from the reader: `ClefControls.svelte:28-30` imports `$lib/i18n`, `./clef-ui.svelte`, and `./clef-choice`; `ClefReceipt.svelte:25` and `clef-ui.svelte.ts:23-24` read `upload.ask.clef*` strings only. The receipt at `:989` reads `formatLabel`, whose `via === 'reader'` arm (`:832-834`) is unreachable after this row; row 122 replaces the whole function with `format-label.ts` and keys homr's receipt by `source.origin` and the scan kind (its brief, section 3), so the receipt does not depend on anything removed here.
- **The poem route keeps everything it needs.** It is reached from `take()` at `:290` and `:296-300` and from nothing removed. The HEIC brief's edit at `:746` (`readAsPoemByOcr(inkFile(file, fallback.ink), ...)`) sits inside `readAsked`, which this row deletes whole; amendment 9 says so, so Code does not look for a line that has gone.
- **A song stored before October still opens, and nothing about that changes.** A stored song carries `SongSource` (`apps/web/src/lib/library/types.ts:75-88`): file name, bytes' hash, fingerprint, and `page?: PageProvenance | null` (`:87`), never an `IngestProvenance`. `restoreFrom` (`apps/web/src/routes/+page.svelte:3283-3291`) hands the uploader the bytes and `answers` from `page`; `onMount` sniffs the bytes (`ScoreUploader.svelte:789`). A photograph stored before 2026-10-04 is its greyscale PNG ink (`:653-657`, `:771-777`), which sniffs as `image`; a PDF is the PDF. Both take the homr branch at `:790-797` today, since 2026-10-05, with `restore.reading` null, so homr reads them anew; `old-reader-seats.ts` (`rekeyOnArrival`, `+page.svelte:2850`) re-seats their syllables. After this row the condition at `:790` is `kind !== null` and the path is the same. The `answers` the old song carries are already ignored on that path today; after this row no code reads them (amendment 8).
- **The brief's tests can fail.** Section 4's three drops in Chromium fail if `take()` loses a line it needs (the drop never reaches `arrived` or the wait); the flagged drop fails if the flag still reaches a removed function; the build fails if `copy-reader.mjs` is still in `package.json:9-10` with the script gone, or if a deleted module is still imported (svelte-check, gate 3). The unit gates fail on any dangling import. One test the brief relies on is missing: nothing under section 4 drops a MusicXML file through the restore path (a reload), which is the path amendment 1 protects; amendment 1 adds it.
- **PWA and service worker.** `apps/web/static/sw.js` names no `/reader/` path (its `APP_SHELL` is `:23-28`; its one reader line is homr's `/omr/` bypass at `:57-60`). A singer whose cache holds `/reader/*.py` from an earlier build loses it on the next activation: `activate` deletes every `ilya-*` cache but the current one (`:37-47`), and `stamp-sw.mjs` gives each build its own name (`:20-21`). `manifest.webmanifest` was not read; nothing in the brief touches it. No wall here.
- **Where would this wall a singer in?** Section 6's two lines hold. One more, not a singer but Dann: the stale `apps/web/static/reader/` folder on his Mac (amendment 6). And one the audit already found and this row does not change: a stored photograph whose `page.octaveChange` is `-1` (a tenor's treble clef with the 8) was read an octave lower by the old reader and is read at written pitch by homr on restore; that has been so since the 2026-10-05 restore ruling and is QUEUE row 127's and the measure-first row's, not this row's. Say it in section 6 so Code does not report it as new (amendment 11).

## Amendments

Each is the exact text to put in r2. Line numbers are at `234eff3f`; the brief already tells Code to re-locate by name on its cut.

### Amendment 1. Section 2 item 1, the restore branch

Replace, in section 2 item 1, the words "and the restore else-branch (audit sections 1 and 6)" with:

> and, in `onMount` (`:786-816`), the clause `&& !useIlyaReader(location.search)` at `:790` and the argument `restore.answers ?? undefined` at `:802`. THE ELSE-BRANCH ITSELF STAYS: `kind` is `null` for every stored MusicXML, `.mxl`, `.musx`, and `.mscz` file (`readableKind`, `:505-512`), and the else-branch is how those are re-ingested on a reload. After the edit it reads `await handleFile(file);` and its comment says a stored score file is re-ingested here and a stored scan goes to homr above. Fable's audit named this branch as the old reader's; it is not.

Add to section 4, after the three drops:

> - Reload with a stored MusicXML song open (store one by dropping `apps/web/src/lib/omr/fixtures/tch-1.musicxml`, then reload the page): the score comes back with no error. This is the restore else-branch, which stays.

### Amendment 2. Section 2 item 1, the full list for `ScoreUploader.svelte`

Replace the first sentence of section 2 item 1 ("The two `useIlyaReader` branches ... (audit sections 1 and 6).") with:

> In `ScoreUploader.svelte`, the old reader's code, each at `234eff3f` and re-located by name on your cut: the imports at `:64` (`WorkerPageReader`, `ClefKeyProbe`), `:80` (`prefillFrom`), `:84` (`EngravingAnswers`), `:85` (`ReadReport`), and `useIlyaReader` from the import at `:68` (`readScanAsScore` and `readingWait` stay); the `answers` member of the `restore` prop (`:116-118`); `pageReader`, `getPageReader`, and the `pageReader?.dispose()` line (`:189-193`, `:197`); `CLEF_CHOICES`, `clefChoice`, `fifths`, `preselect`, `FIFTHS_CHOICES`, `fifthsLabel`, and `answers` (`:200-246`); the `asking` member of `UiState` (`:164-168`); the `useIlyaReader` clause at `:286` (the `else` and `readScanAsScore` call stay as the only path) and the assignment `pendingPoemFallback = { kind, ink }` at `:285`, with `pendingPoemFallback` itself (`:303-310`) and its reset at `:821`, because `readAsked` at `:738` is its only reader; `isPicture` (`:500-503`), read only by the picture branches below; in `handleFile`, the parameters `storedAnswers` and `onNoSungLine` (`:531-532`), the picture branch (`:535-548`), `picture` and `getPageReader()` (`:559-560`), the picture arm of the busy label (`:567-570`, so the label is converting, convertingMscz, or reading), `readPages` and `engravingAnswers` in the deps (`:584-585`), the two `onNoSungLine` returns (`:589`, `:594-596`), and the `IMAGE_UNDECODABLE` arm at `:601-603` (only `asReaderError` produced that code; after this row `classify` alone maps the outcome); `readPages` (`:630-683`); `lastInk`, `lastPage`, `lastKind` (`:685-693`); `probeFile` (`:695-726`); `readAsked` (`:728-750`); `pageFor` and the component's own `inkFile` (`:760-777`), so that `announceArrival` (`:624-628`) becomes `oningested(ui.ingested, ui.file, 'upload', undefined, scan)`; the `readReport`, `measureList`, and `subTotal` deriveds (`:916-922`); the `'reader'` arm of the banner text at `:993` (see section 3 a); the `asking` template (`:940-974`) and the read-report template (`:1000-1070`); and the CSS they alone dressed: `.ask`, `.ask-title`, `.ask-why`, `.ask-field`, `.ask-label`, `.ask-select`, `.read-report`, `.report-title`, `.report-line`, `.report-sub` (`:1292-1357`), and `.result-actions` (`:1211-1215`) if no remaining markup uses it. Remove every selector that no remaining markup uses, so gate 3's warning count does not rise. The `arrived` receipt's dismiss button lived inside the read-report block (`:1058-1068`); a homr arrival has never shown it, so nothing a singer sees changes. The `oningested` prop's `page?` parameter (`:101-104`) and the `PageProvenance` import (`:86`) stay, because `+page.svelte`'s `handleArrival` (`:2593-2599`) is typed with it; the component now always passes `undefined`.

### Amendment 3. Section 2 item 5, `ingest.ts` and its test

Replace section 2 item 5 with:

> 5. In `ingest.ts`: the imports at `:44-45` (`recognizedToMusicXml`, `EngravingAnswers`, `ReadReport`, `RecognizedOutput`); `readReport` on `IngestedScore` (`:96-101`) and `PageRead` (`:104-108`); `readPages` and `engravingAnswers` on `IngestDeps` (`:156-169`); the body of the `pdf`/`image` case (`:232-260`), which becomes `return err({ code: 'PAGE_READER_UNAVAILABLE' });` with a comment that a picture or PDF reaching dispatch is the uploader's fault, since `take()` routes every scan to homr before dispatch; `asReaderError` (`:392-408`); and, from `IngestError` (`:124-135`), the five codes nothing produces after that: `PAGE_READER_LOAD_FAILED`, `PAGE_READ_FAILED`, `IMAGE_UNDECODABLE`, `PDF_UNREADABLE`, `PDF_JBIG2_UNDECODED`, with their `classify` cases in `ScoreUploader.svelte` (`:881-891`, except `PAGE_READER_UNAVAILABLE`, which stays with its string). `upload.err.pdfUnreadable`, `pdfJbig2`, and `imageUndecodable` are still read by `rasterizeFirstPage` (`:362`, `:371-374`) and `undecodablePictureMessage` (`:497`); `upload.err.readerLoadFailed` and `pageReadFailed` become unread (section 3 b). In `ingest.test.ts`: the whole `describe('ingestScoreFile: the page-reader route')` at `:367-445`, four cases, not two (`:391`, `:400`, `:409`, `:428`), with its `oneNoteRead` fixture; the case at `:336-340` (`PAGE_READER_UNAVAILABLE` with no seam) STAYS and now describes the only outcome. Rewrite its comment at `:330-335` and the comment at `:81` in `ingest.ts`.

### Amendment 4. Section 3 (a), decided by reading

Replace section 3 (a) with:

> (a) `provenance` is NOT stored, so `via: 'reader'` can never come back from the library and the member goes. What a song stores is `SongSource` (`apps/web/src/lib/library/types.ts:75-88`): name, hash, fingerprint, and `page?: PageProvenance | null`; `restoreFrom` (`+page.svelte:3283-3291`) hands the uploader bytes and the stored `page`'s answers, and the uploader re-ingests the bytes (`ScoreUploader.svelte:786-803`), which is where provenance is made each time. Remove the member at `ingest.ts:56-57`, the `reader` tier of `fidelityBanner` (`:67-71`, return type `'denigma' | null`), the `p.via === 'reader' ||` clause of `noLyricsNoticeKey` (`:89-90`, homr's `origin === 'homr-musicxml-from-image'` is the whole test now), and the `'reader'` arm at `ScoreUploader.svelte:993`, which becomes `T('upload.banner.denigma')`. In `no-lyrics-notice.test.ts`: the `scan` and `pdf` constants (`:14-15`) and the three assertions that use them (`'a photograph draws 1b'` (`:26-28`), the first assertion of `'a scanned PDF draws 1b'` (`:30`), and `'the E.16 reader (via reader) still draws 1b whatever the origin'` at `:62-64`); the homr-fed assertions and the string tests at `:67-114` stay. `SongSource.page`, `validatePage` (`library.ts:309-314`), `PageProvenance`, and `old-reader-seats.ts` stay untouched: songs from before 2026-10-04 carry them.

### Amendment 5. Section 3 (b), decided by reading

Replace section 3 (b) with:

> (b) `upload.format.pdfReader` and `upload.format.imageReader` STAY, and so does every other string: this row deletes no key from `i18n.ts`, in either language. Row 122, merged before you cut, reuses those two keys for homr's receipt (`brief-code-row122-scan-receipt-format_r2_2026-10-25.md`, section 3: "the two existing reader strings are reused"), and the component records Dann's standing on the rest at `ScoreUploader.svelte:152-154`: a ratified French string is not a ship's to delete. The report lists, under its own heading, every `upload.*` key that nothing reads after this row (expected: `upload.ask.title`, `upload.ask.why`, `upload.ask.key`, `upload.ask.keyNone`, `upload.ask.keySharp`, `upload.ask.keySharps`, `upload.ask.keyFlat`, `upload.ask.keyFlats`, `upload.ask.read`, `upload.ask.cancel`, `upload.confirm.title`, `upload.confirm.why`, every `upload.report.*`, `upload.err.readerLoadFailed`, `upload.err.pageReadFailed`, and `upload.banner.reader`; `upload.ask.clef`, `upload.ask.clefTreble`, `upload.ask.clefTrebleOttava`, and `upload.ask.clefBass` are read by `ClefControls.svelte:156-221`, `ClefReceipt.svelte:25`, and `clef-ui.svelte.ts:23-24` and are not in that list; `upload.status.preparingReader` and `upload.status.readingPage` are homr's own, `omr/scan.ts:56`, `:84`, `:91`, `omr/restore.ts:67`, `omr/wait.ts:61`). The desk decides their fate in a row of its own.

### Amendment 6. Section 2 item 6, the `.gitignore` lines stay

Replace, in section 2 item 6, "and the `.gitignore` lines for `apps/web/static/reader/` (audit `:24-28`)" with:

> The `.gitignore` entry `apps/web/static/reader/` (`:28`) STAYS, with its comment (`:24-27`) rewritten to say: a generated copy of the old page reader, written by `copy-reader.mjs` at every dev and build until 2026-10-27, which may remain on any machine that built before then; never committed. The reason: Dann's Mac has run the build many times, the folder is there, and the ship script refuses on an untracked file (`CONTRACT.md` section 4); with the ignore line gone, his next ship would stop on a folder he did not make. The folder's other cost is that Vite copies all of `static/` into the build, so a build on his Mac still ships the Python until the folder is gone; the cloud lane's build is clean. The report says in one line that the folder must be deleted on his Mac after the merge, and the desk gives Dann that one command after the merge (it is reversible: the source stays under `tools/e16-harness/reader/`).

### Amendment 7. Section 4, the grep's reach and the comments known to lie

Replace the first bullet of section 4 with:

> - Grep `apps/web` (excluding `node_modules`, `.svelte-kit`, and `build`) and `ARCHITECTURE.md` for `reader=ilya`, `useIlyaReader`, `WorkerPageReader`, `page-reader`, `recognizedToMusicXml`, `recognized-to-musicxml`, `clef-key-prompt`, `copy-reader`, `static/reader`, `asReaderError`, `readPages`, and `cdn.jsdelivr.net/pyodide`: report every remaining hit. Rewrite each comment that now lies; known at `234eff3f`: `ARCHITECTURE.md:111` (the codemap names `page-reader.ts` as what reads a PDF or a photograph; the homr route under `src/lib/omr/` is what reads them), `apps/web/vite.config.ts:24`, `apps/web/src/lib/reader/page-pdf.ts:225-226` (`asReaderError` is gone; the path is `rasterizeFirstPage`'s catch at `ScoreUploader.svelte:371`), `apps/web/src/lib/score/correction.ts:547` (cites `recognized-to-musicxml.test.ts:365`, a file this row deletes and a line it never had, the file being 326 lines; say in the report whether any remaining test pins a rest carrying a pitch correction, and if none does, say NOT PINNED), `omr/restore.ts:6`, `omr/scan.ts:4-6`, `ingest.ts:81`, `ScoreUploader.svelte:30-32`, `:54-56`, `:259-261`, and `copy-pdfjs-wasm.mjs:16`. Comments written as history stay as they are: `old-reader-seats.ts:5-8`, `mini-dom.ts:12`, `mini-xml.test-support.ts:12`.

### Amendment 8. The `restore` prop and `+page.svelte`

Add to section 2, as item 7:

> 7. In `+page.svelte`, one line: `answers: page ? { ... } : null,` in `restoreFrom` (`:3288`), because the `restore` prop no longer has that member. Nothing else in `+page.svelte` changes: `handleArrival`'s `page?` parameter (`:2596`), `arrivalPage` (`:2462`), and `attachUploadedSource`'s `page?` (`:3327`) are the carriers of `SongSource.page`, which stored songs still hold; after this row an arrival always carries `undefined` there, and the report says so. Lower `+page.svelte`'s ceiling in `scripts/ratchets.json:8` to its new length in the last commit, never raise it.

### Amendment 9. What the two merged lanes leave in `ScoreUploader.svelte`

Add to section 1, after "nothing under `tools/e16-harness/` is deleted or edited.":

> Two lanes merge before you cut, and each moves lines in `ScoreUploader.svelte`. Row 122 (`cloud-lane-17`) replaces `formatLabel` (`:826-836`) with `format-label.ts` and adds `scanKind` to the `arrived` state and the `ingest` hook at `:289`; none of that is this row's to touch. Row 113 (`cloud-lane-18`) imports `inkFile` from `$lib/reader/page-image` at `:65` and calls it at `:290`, `:299`, `:412`, and `:746`. The call at `:746` is inside `readAsked`, which this row deletes whole; do not look for it. The component at `234eff3f` has its own `function inkFile(original: File)` at `:771-777`, which collides with that import; whatever name lane 18 gave to one of the two, the component's own (the one read by `announceArrival` at `:627`, which takes one argument and reads `lastInk` and `lastKind`) is the one this row removes, and the one from `page-image.ts` stays. Report what you found.

### Amendment 10. Section 5, the counts

Replace "Gate 4 falls by the removed tests (about 42 per the audit); count each removed file's tests." with:

> Gate 4 falls by the removed tests: 7 in `page-reader.driver.test.ts`, 7 in `reader-ids.test.ts`, 18 in `recognized-to-musicxml.test.ts`, 10 in `clef-key-prompt.test.ts`, 3 in `scan.test.ts` (`:131-136`, one `it` with three assertions: count it as the file counts it), 4 in `ingest.test.ts` (`:367-445`), and 3 assertions in `no-lyrics-notice.test.ts` (amendment 4; one `it` goes whole, one loses its first line, one goes whole), so about 48 to 49 fewer, plus the one you add under amendment 1's drop if it is a unit test. Count each file's tests before and after and report the per-file numbers. Gate 3's warning count (12 in 5 files at `234eff3f`) must not rise: an unused CSS selector left behind is a new warning.

### Amendment 11. Section 6, one more line

Add to section 6:

> - A stored photograph whose `page.octaveChange` is `-1` (a tenor's treble clef with the 8, answered in the old prompt) was read an octave lower by the old reader and is read at written pitch by homr on restore. That has been so since 2026-10-05 (restore through homr, `ScoreUploader.svelte:790-797`), not since this row; report it as unchanged, not as a regression. Row 127 and the measure-first row the desk opens hold it.

## Smaller points, no amendment needed

- Section 1's "What the singer sees change: nothing" holds: a dropped scan takes `:287` and a stored scan `:790-797` unless the address carries the flag, and no e2e spec, string, or control offers it (grep of `apps/web/e2e` for `reader=ilya`, `upload.ask.read`, `'asking'`, and `preparingReader`: no hits).
- `NOTICES.md` carries nothing for Pyodide, OpenCV under Pyodide, or matplotlib (grep this session: only `@techstark/opencv-js` at `:78-79`, which is homr's); nothing to remove there.
- `scan.test.ts:131-136` is the `useIlyaReader` test the brief's item 2 names; its other cases (`:39`, `:83`, `:90`) are homr's and stay.
- The brief's "This row changes no computation another site repeats" is right; the cross-site line of `CONTRACT.md` section 4 does not apply.
- "NOT ESTABLISHED beats a complete invented answer" is present verbatim (section 7), as section 4 of the contract requires.

## What I could not establish

- The merged code of `cloud-lane-17` and `cloud-lane-18`: neither branch is in this clone. Every line of `ScoreUploader.svelte` above is at `234eff3f`; amendment 9 says what their briefs do to it.
- Whether lane 18 resolved the `inkFile` name collision, and how (its review is not in the clone or the scratchpad).
- Whether any remaining test pins a rest carrying a pitch correction once `recognized-to-musicxml.test.ts` is gone (`correction.ts:547`); the grep of `correction.test.ts` for a rest with a pitch found only the fixture line `:58`.
- Whether Vercel builds from the git tree or from Dann's Mac; if from the tree, the stale `static/reader/` folder affects only his local build (amendment 6).
- Whether `svelte-check` in this app errors or only warns on an unused local such as a leftover `isPicture`: the root `tsconfig.json:15-16` sets `noUnusedLocals`, but `apps/web/tsconfig.json` extends `.svelte-kit/tsconfig.json`, which was not read.
- The exact per-file test counts after the edit (counted by `it(` this session: 7, 7, 18, 10; the harness-driven count may differ by `it.each` or skips).
- `manifest.webmanifest`: not read.
