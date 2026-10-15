# Fable review of the trimming audit brief (measure first, remove only what is proven unused), r1

Reviewer: Fable 5.1, 2026-10-15, independent of the drafting instance. Brief: `brief-code-trimming-audit_r1_2026-10-15.md`. Checked against a clone of `Shane` at `14e2ff8`; every `path:line` below read this session. No build was run here.

## Verdict

SEND WITH AMENDMENTS. The measurement plan is sound and names its instruments. The facts hold except one reference list. Two things in step 3 would remove files that must stay: the font licences, which no code references and which the fonts' licences require to ship, and the 24 Guide pictures the Guide does not currently reference, which are Dann's screenshots and a content decision. Amendments 1 and 2 close both; the rest are reachability and the branch name.

## Citations

| Citation | Status |
|---|---|
| `apps/web/static/data` is a symlink to `data/` | CONFIRMED (`data -> ../../../data`) |
| `data/` byte counts for the eight files | CONFIRMED by `ls -l`, all eight exact |
| `copy-ort-wasm.mjs:47-50` the `FILES` list of four | CONFIRMED (`:46-51`) |
| `homr-reader.ts:34` names the copy script | CONFIRMED |
| `loader.ts:1-45` header; gloss tier `:36-40`, `loadGlossTier` `:464`, `requestIdleCallback` `:566-567` | CONFIRMED (`:36-40`; `:464`; `:566-567`, and again at `:589-590`) |
| `+page.svelte:4115-4116` N.108-5 ruling quoted; `:4126` `joinText('boot')`; `:4127-4131` `loadDictionary` in `onMount` | CONFIRMED (`:4115-4116`, `:4126`, `:4127-4131`) |
| 63 tracked files under `apps/web/static` | CONFIRMED by `git ls-files`; the count includes the `data` symlink, so 62 regular files |
| `denigma_wasm_mnx.*` referenced by five files | PARTLY WRONG. By exact file name only `score-reader.worker.ts:8` (prose) and `:96` (`const gluePath = '/denigma_wasm_mnx.js'`) reference it; `mscz-converter.ts`, `page-reader.ts`, `page-reader.worker.ts`, and `GuideContent.svelte` contain the word `denigma` but not the file name. Under the brief's own grep rule (exact path or file name) the pair has one code reference, which is enough to keep it |
| `sw.js:23-28` four precached paths; `:54-60` never intercepts the dictionary or `/omr/` | CONFIRMED (`:23-28`; `:54`, `:59`) |
| `page-pdf.ts:150-162`, `:273-285` dynamic imports; `:183` `wasmUrl`; `:4` N.59 step 8 ruling | CONFIRMED |
| `apps/web/package.json:26` `pdfjs-dist` 6.2.108; `:10` the build script | CONFIRMED |
| `ScoreUploader.svelte:276-279` the error line | CONFIRMED (`:276-280`) |
| `copy-pdfjs-wasm.mjs:33-40`; `copy-reader.mjs:24` | CONFIRMED |
| `CalibrationWizard.svelte:371-372` an UNUSED string kept on purpose | CONFIRMED (`:371-372`, `calib.compact.vowelsSampled`) |
| Row 98 report: 453 MB; `getOrInsertComputed` not reproduced; gate 4 at 2512 | CONFIRMED (`report-code-row98…:7`, `:17`, `:89`, `:120`) |
| `ENVIRONMENT.md` "THE CLOUD LANE": `registry.npmjs.org` answers, `cdn.jsdelivr.net` refused | CONFIRMED (`:4557`) |
| `gates-scratch.sh:78-117` the eight commands | CONFIRMED |

## Amendments

### 1. Step 3: files no grep names and that stay anyway

Append to step 3, after "leave any font whose name appears":

> Never remove a licence or provenance file: `fonts/bravura/OFL.txt`, `fonts/bravura/FONTLOG.txt`, `fonts/finale-maestro/OFL.txt`, `fonts/lato-OFL.txt`, `fonts/leland/LICENSE.txt`, `fonts/leland/FONTLOG.txt`. No code references them; the fonts' licences require them beside the font files (`notation-fonts.ts:28`: "licences ship with the files"). List each as KEPT, licence. Treat the three font metadata files (`bravura_metadata.json`, `FinaleMaestro.json`, `leland_metadata.json`) by the grep rule, and if one is NONE, list it under "Found, not removed" with its byte count rather than removing it; the desk decides.

Reason: the brief's "Remove only a file with NONE on every grep" would remove six licence files on first run.

### 2. Step 3: the Guide's pictures are listed, not removed

Append to step 3:

> `static/guide/` holds 39 `guide-step-NN.webp`; `GuideContent.svelte` references 15 by name (grep this session). The other 24 are Dann's screenshots from Guide drafts and the row 97 report measured two of them for recapture. List every unreferenced picture with its byte count under "Found, not removed"; remove none. Which pictures the Guide keeps is a content decision for Dann.

Reason: reversible in git but a decision about his material, not a dead asset; the trimming gain is small next to the 245 MB of models.

### 3. Step 0, the live measurement: egress is NOT ESTABLISHED

Append to the "Live, compressed" bullet:

> Whether the cloud box can reach `https://ilya.dannmitton.com` is NOT ESTABLISHED (`ENVIRONMENT.md:4557` names only the registries and the refused CDN). Try one `curl -sI`; if it is refused or times out, write NOT ESTABLISHED for the compressed figures, keep the local list, and do not retry through a proxy flag.

Reason: a refused host would otherwise cost a loop; the measurement has a named fallback.

### 4. Step 3, `knip` and `ts-prune`

Replace "run `pnpm --filter @ilya/web check` and `npx knip` or `ts-prune` if either runs without network trouble" with "run `pnpm --filter @ilya/web check`; then try `npx --yes knip@5` once, with a ten-minute cap; if it fails to install or to run on the monorepo, write NOT ESTABLISHED and continue with grep alone. Do not add either tool to `package.json`."

Reason: `knip` on a pnpm workspace with Svelte needs configuration and can run long; the gain is leads, which grep confirms anyway.

### 5. Step 1, before the removal: the Mac path owed, in the commit message too

Append to step 1: "Put the owed WebGPU run in the commit message of the removal commit as well as in the report, so the merge reads it."

Reason: Dann merges from the log; the report is a second place.

### 6. The reference list for `denigma_wasm_mnx`

In "(c) Static assets", replace "(referenced by `apps/web/src/lib/reader/mscz-converter.ts`, `page-reader.ts`, `page-reader.worker.ts`, `score-reader.worker.ts`, and `GuideContent.svelte`, by the desk's grep)" with "(referenced by file name at `apps/web/src/lib/reader/score-reader.worker.ts:96`, `gluePath = '/denigma_wasm_mnx.js'`, and in prose at `:8`; four other reader files name `denigma` without the file name)".

Reason: tether 3; the grep rule in step 3 is by file name and Code must find exactly one code reference.

### 7. Branch, order, and gate baselines

Replace every `cloud-lane-8` with `cloud-lane-10`. Run this row last in the lane. Add: "`gates-scratch.sh:111`'s expected string for gate 4 is stale (2433); compare against 2512 plus what the four earlier rows added."

Reason: this row builds twice and commits removals; if the session runs short, the four product rows are already pushed.

## Strings

None added or changed; the brief forbids it and no step needs one. Nothing owed.

## Executability

Steps 0, 1, 3, and the reproduction in step 4 run in the cloud with the row 98 harness (`pdftoppm`, Chromium 1194, `python3 -m http.server`). Step 2's phone-viewport measurement is Playwright with a 390 by 844 viewport. The live curl (amendment 3) and `knip` (amendment 4) each have a NOT ESTABLISHED path. WebGPU stays owed to the Mac, as the brief says. Step 4's browser table depends on reaching MDN or caniuse; the brief already allows NOT ESTABLISHED there.

## Collision with cloud-lane-9

This brief edits `copy-ort-wasm.mjs`, possibly `homr-reader.ts:34`, and whatever step 3 removes; it does not edit `+page.svelte` or `ratchets.json` (a removed source file could lower a ceiling, which the ratchet script prints and which is a one-line, non-conflicting edit unless it is `:8`). Rows 5, 47, and 13 touch none of the files named here. If step 3 removes a source module, say in the report which ceilings moved.

## What I could not establish

- The build sizes and request lists; no build here.
- Whether the cloud box reaches `ilya.dannmitton.com` or MDN.
- Whether any of the three font metadata JSON files is read at runtime; `notation-fonts.ts` is the place to look and Code's grep will say.
- Whether `knip` runs on this workspace.
