# Brief: the trimming audit, measure first and remove only what is proven unused (r1)

Desk (Fable 5.1 drafting for Opus), 2026-10-15. For Code (cloud lane, Sonnet), on `cloud-lane-8`, after N.157. Row 5 of 5. Reads on from `docs/sessions/report-code-row98-one-engine-and-two-branches_r1_2026-10-14.md` (row 98: the build fell from 480 MB to 453 MB; the non-jsep engine pair and the PDF-path failure were left for a later row). Every `path:line` here was read in a clone of `Shane` at `14e2ff8` on 2026-10-15.

## What the singer sees and gains

A singer on a phone or a slow connection opens Ilya and waits less: fewer bytes in the first visit, and nothing downloaded that nothing uses. A singer who drops a scanned PDF in a browser that lacks one new JavaScript method gets a page that reads the scan instead of "the PDF could not be rasterized". **Nothing the singer sees changes in this row**, except where a removal is proven unused by grep and by the gates; the dictionary question (b) and the PDF fix (d) come back as measured proposals, not as changes.

## The facts the desk read

- The build after row 98 is 453 MB: `build/omr` 245 MB, `build/data` 166 MB, `build/_app` 33 MB (row 98's report, "Build size" table, `du -sm`).
- **(a) The non-jsep pair.** `build/omr/ort/ort-wasm-simd-threaded.wasm` is 14,239,897 bytes and `.mjs` 24,381 bytes (row 98's report). They are copied by `apps/web/scripts/copy-ort-wasm.mjs:47-50` (the `FILES` list of four names). Row 98's grep over `apps/web/src`, `apps/web/e2e`, `packages`, `scripts`, and `tools` found no import of `onnxruntime-web/wasm` and no use of the string except that list and the prose at `apps/web/src/lib/omr/homr-reader.ts:34`. `ort.min.mjs` names only `ort-wasm-simd-threaded.jsep.mjs` (Fable's review of row 98, finding 4).
- **(b) The dictionary.** `apps/web/static/data` is a symlink to the repository's `data/` (166 MB on disk): `dictionary.86d83340-a.json` 47,485,378 bytes, `-b.json` 48,896,620, `-gloss-a.json` 36,869,100, `-gloss-b.json` 37,970,717, `homographs.json` 2,004,513, `singer-supplement.json` 45,943, `blurb-composer.json` 88,425, `dictionary-manifest.json` 239. The loader (`apps/web/src/lib/loader.ts:1-45`) fetches the manifest, then the two dictionary files, parsing NDJSON line by line into IndexedDB, with the supplement, homographs, and blurb in parallel, and fetches the gloss tier after the app is interactive (`:36-40`, `loadGlossTier` at `:464`, `requestIdleCallback` at `:566-567`). The load starts in `onMount` (`apps/web/src/routes/+page.svelte:4127-4131`). **Loading at boot is ruled behaviour**: N.108-5, Dann 2026-09-07, "at boot, if the field holds text, transcribe once the dictionary is ready, score or no score" (`+page.svelte:4115-4116`). The desk's figure "about 10.7 MB of the first visit" for the dictionary is NOT ESTABLISHED by an instrument the desk can name; you measure it.
- **(c) Static assets.** Tracked under `apps/web/static` (63 files, `git ls-files`): `denigma_wasm_mnx.wasm` 4,511,746 bytes and `denigma_wasm_mnx.js` (referenced by `apps/web/src/lib/reader/mscz-converter.ts`, `page-reader.ts`, `page-reader.worker.ts`, `score-reader.worker.ts`, and `GuideContent.svelte`, by the desk's grep), `fonts/` (bravura, finale-maestro, leland, lato-ipa), `guide/`, `icons/`, `images/`, `sw.js`, `manifest.webmanifest`, `favicon.png`. Generated at build and git-ignored: `static/omr/` (models and the ort files), `static/pdfjs-wasm/` (`scripts/copy-pdfjs-wasm.mjs:33-40`), `static/reader/` (`scripts/copy-reader.mjs:24`). The service worker precaches four paths only (`static/sw.js:23-28`) and never intercepts the dictionary or `/omr/` (`:54-60`).
- **(d) The PDF path.** `apps/web/src/lib/reader/page-pdf.ts:150-162` and `:273-285` import `pdfjs-dist` and its worker dynamically; `getDocument` is called with `wasmUrl: '/pdfjs-wasm/'` at `:183`. `apps/web/package.json:26` pins `pdfjs-dist` 6.2.108. Row 98's report ("Found, not for this row") says `pdf.mjs` and `pdf.worker.mjs` of that version call `Map.prototype.getOrInsertComputed` and define no fallback, and that Chromium 1194 lacks the method; the failure was not reproduced there. `ScoreUploader.svelte:276-279` turns the thrown error into "the PDF could not be rasterized".

## Step 0. Measure before anything moves

Build (`pnpm --filter @ilya/web build`; `apps/web/package.json:10`, which fetches the models) and record:

1. `du -sm` of `apps/web/build` and of each top-level folder in it, and the 25 largest files with byte counts (`find apps/web/build -type f -printf '%s %p\n' | sort -rn | head -25`).
2. **The first visit**, two ways, and say which is which:
   - Local, uncompressed: serve `apps/web/build` with `python3 -m http.server 5199 --bind 127.0.0.1` from that folder, open `/` in Playwright Chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, viewport 1440 by 1000, a fresh context with no IndexedDB), wait until the loader's state reports done (the Text page's ready signal; name the selector or console line you used), and record every request with its URL, status, and response byte count, in order, and the total. Do it again with a phone viewport (390 by 844) and say whether the list differs.
   - Live, compressed: for each file in the first-visit list, `curl -sS -o /dev/null --compressed -w '%{url_effective} %{http_code} %{size_download} %{content_type}\n' https://ilya.dannmitton.com<path>` and record the `content-encoding` header too (`-D -`). This is the deployed `Shane`, not your branch; say so. It is read-only and spends nothing.
3. Keep both lists in the report; the "after" lists are taken the same way.

## Step 1. (a) Remove the non-jsep pair, after proving it

Prove first, in the built site, not only in the source: `grep -rl 'ort-wasm-simd-threaded.wasm\|ort-wasm-simd-threaded.mjs' apps/web/build` must name no file outside `build/omr/ort/` itself. Then remove the two names from `copy-ort-wasm.mjs:47-50`, rebuild, and run row 98's scan check unchanged (its amendment 3: the Lamm PNG on the second `input[type=file]`, wait for `[omr] homr read N of M pages` at `scan.ts:107-110`, confirm `.receipt-score`, record every request matching `ort-wasm|\.onnx|/omr/` with duplicates and every response of 400 or more). The request list must equal row 98's ten, and no 404 may appear. Update the prose at `homr-reader.ts:34` if it names the pair. Report the build size after. WebGPU remains NOT ESTABLISHED in this box; say so, and add the line that the WebGPU path is owed a run on the Mac before merge.

## Step 2. (b) The dictionary: measure and propose, do not ship

Answer, with numbers from step 0: how many bytes of the first visit are the two dictionary files, compressed on the live site and raw locally; when the first dictionary request starts relative to the page's first paint (`performance` timing or the request's start time against the navigation); what the singer sees while it loads (name the component that shows the loader's progress, from `loaderState` in `+page.svelte`); and what in the page blocks on it (transcription; `joinText('boot')` at `+page.svelte:4126`). Then write one proposal, with its cost, for each of these, and ship none:

1. Begin the fetch later (first focus of the text field, or first paste) and what that does to a singer who types in the first second.
2. Keep the boot fetch but lower its bytes (a smaller first file, a split by frequency, a different compression) and what each needs from the build script that writes `data/`.
3. Do nothing, and what that costs on a phone (your phone-viewport measurement).

If one of these changes nothing the singer sees (the desk expects none does), say which and why it is safe; otherwise the section is a proposal for the desk, and the ruled boot-time load stands.

## Step 3. (c) Dead code and unused static assets

For each tracked file under `apps/web/static` (the 63), and for each generated folder, state what references it: a `grep -rn` of the exact path or file name over `apps/web/src`, `apps/web/scripts`, `apps/web/static` (the service worker and the manifest), `packages`, and `apps/web/svelte.config.js` and `vite.config.ts`, with the hit's `path:line` or NONE. Remove only a file with NONE on every grep, and only after a rebuild and all eight gates pass without it; list each removal with its byte count. Fonts: a font may be referenced by family name in CSS rather than by file name; grep the family name too, and leave any font whose name appears. Do the same for source: run `pnpm --filter @ilya/web check` and `npx knip` or `ts-prune` if either runs without network trouble (the cloud box reaches `registry.npmjs.org`; `cdn.jsdelivr.net` is refused, `docs/memory/ENVIRONMENT.md`, "THE CLOUD LANE"); treat their output as leads, confirm each by grep, and remove only an export with no reader in `src`, `e2e`, `scripts`, or `tools`. A component or module kept "UNUSED" on purpose with a comment saying so (the tree does this; `CalibrationWizard.svelte:371-372` names one such string) stays. Nothing in `i18n.ts` is removed. Nothing in `static/data` is removed.

Nothing ships into `static/` in this row; if a step needs a new file there, stop and put it in the report with its byte count instead.

## Step 4. (d) The PDF path: reproduce, name the caller, propose a fix

1. Reproduce in Playwright on the built site served locally: give `tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf` (tracked) to the same file input, and capture the console and the page's error line. Record the exact message and the first stack frame that names a file in `pdfjs-dist` (the chunk name under `_app/immutable` and, from a source-map-free build, the function name).
2. Confirm the method is absent: `page.evaluate(() => typeof Map.prototype.getOrInsertComputed)` in that Chromium, and the Chromium version string from `browser.version()`.
3. Name which browsers ship `Map.prototype.getOrInsertComputed` (the TC39 "upsert" proposal). Read MDN's compatibility table or caniuse for it and quote the versions with the URL; if neither page gives a table, write NOT ESTABLISHED. Dann's singers are on Safari (Mac and iPhone), Chrome, and Firefox; the question is whether a current release of each has it.
4. Propose, do not ship: (i) `pdfjs-dist`'s legacy build (`pdfjs-dist/legacy/build/pdf.mjs` and its worker), if 6.2.108 ships one that polyfills the method, with the byte difference between the two builds from `node_modules`; (ii) a small polyfill loaded before the dynamic import at `page-pdf.ts:150-162`, with its source; (iii) a `pdfjs-dist` version that does not call it, if one exists, with its changelog line. Give the cost of each and a recommendation. The desk decides; N.59 step 8 is Dann's ruling approving 6.2.108 (`page-pdf.ts:4`), so a version change is his.

## Done when

1. The report holds the before and after build size by folder and the 25 largest files, and the first-visit lists both ways, before and after.
2. The non-jsep pair is gone from the build, the scan check's ten requests are unchanged with no 404, and the gates pass.
3. Every removal in (c) carries its grep result (NONE on every path), its byte count, and the gate run that passed without it.
4. (b) and (d) are measured and proposed with numbers and sources; nothing of them is shipped.
5. All eight gates pass after every commit of this row; gate 4 rises only by tests you added, if any.

## Gates

The eight commands in `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117`. Baselines after row 98: phonology 251, dictionary 248, web-check 0 errors 12 warnings, web-test 2512, score-parser 675 passed 5 skipped, blurb 145, integration 55, ratchets OK, plus what the earlier rows of this lane added. Cloud notes: `docs/memory/ENVIRONMENT.md`, "THE GATES RUN IN A CLOUD CLONE".

## Constraints

- Commit to `cloud-lane-8` only; no pull request; `docs/memory/` untouched. One commit for (a), one for each removal group in (c), none for (b) and (d).
- No model file, dictionary file, font in use, or string is touched. Nothing ships into `static/` without its byte count in the report, and nothing new ships into it in this row.
- Do not change `wasmPaths`, `/omr/ort/`, or `vite.config.ts`'s resolve condition from row 98.
- Every number in the report names its instrument (`du -sm`, `find -printf`, Playwright response sizes, `curl --compressed`), and a local uncompressed figure is never presented as what a singer downloads.

## Report

`docs/sessions/report-code-trimming-audit_r1_2026-10-15.md`: the answer in three lines; the size tables before and after; the first-visit lists both ways, before and after; (a) with the scan check; (b) with the three proposals; (c) as a table of every static file and each removal; (d) with the reproduction, the browser table, and the three fixes; the gates; what you could not establish.

## What you could not establish

NOT ESTABLISHED beats a complete invented answer.
