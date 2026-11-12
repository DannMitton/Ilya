# Report: closing polish lane, step 0b, serve the scan reader's words (Code, cloud-lane-48, r1, 2026-11-12)

Code commit `14e4cd3` on `cloud-lane-48`.

## What changed

- `apps/web/package.json:9` (`dev`) and `:10` (`build`): `&& node scripts/copy-underlay-model.mjs` after `node scripts/copy-metre-model.mjs`.
- `apps/web/scripts/copy-underlay-model.mjs`: header rewritten to say the script is wired and names the test; it now copies five files, adding each package's own licence file as `LICENSE-tesseract.js.txt` (from tesseract.js's `LICENSE.md`) and `LICENSE-tesseract.js-core.txt` (from the core's `LICENSE`).
- `apps/web/src/lib/omr/underlay-recognize.ts` (comment above the header's last paragraph): says the files are served and what happens where they are not.
- Amendment 1: `omr/stamp.ts:52` `UNDERLAY_READER` is `'underlay@6'`; its comment gains the sentence that `underlay@6` reads nothing differently and marks that the files are served, citing Dann's 2026-11-11 23:37 ruling. Pins moved: `omr/stamp.test.ts` (the `@5` test no longer asserts the value; a new `@6` test does, and that `@5` is stale) and `omr/underlay-switch.test.ts:62-63` (`underlay@5` joins the stale list; the value is `@6`).
- Amendment 2: `NOTICES.md` gains entries for tesseract.js 7.0.0 and tesseract.js-core 7.0.0 under "Dependencies". The `rus` photo-path model is added in step 6, when it is served.

## Tests added

- `src/lib/omr/underlay-wired.test.ts`: `dev` and `build` each contain the copy, after the metre model's.
- Gate check after the change: `src/lib/omr` and `i18n.test.ts`, 44 files, 715 passed; ratchets OK. The full eight gates run at step 12.

## Done-when

- Built site, `pnpm build` (exit 0): `build/omr/models/underlay/` holds `rus_prereform_r2_29000.traineddata` 7,827,478; `tesseract-core-simd-lstm.wasm.js` 3,899,472; `worker.min.js` 111,307. Sum 11,838,257, as the desk counted. Plus `LICENSE-tesseract.js.txt` 11,357 and `LICENSE-tesseract.js-core.txt` 11,358.
- A real scan read in Playwright, on **the dev site** (`pnpm dev`, which runs the same copy; Chromium at `/opt/pw-browsers/chromium`), file `tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf`: the console printed "underlay: page read ... 47 syllables seated, 1 unseated" (page 1), "... 48 syllables seated, 0 unseated" (page 2), and "95 syllables written on 2 of 2 pages"; the page then showed "The words as sung, as the score sets them." So the scan read words, from the files the dev server serves.

## Licence text each package ships (read, not recalled)

- tesseract.js 7.0.0: `package.json` license `Apache-2.0`, no author; `LICENSE.md` is the standard Apache 2.0 text, its appendix still reading "Copyright {yyyy} {name of copyright owner}".
- tesseract.js-core 7.0.0: license `Apache-2.0`, author `antimatter15`; `LICENSE` is the same standard text.
- Neither names a copyright holder in its licence file. I wrote none into NOTICES.md.

## What I could not establish

- The scan read on the **built** site (`vite preview` of `build/`): not run. It ran on the dev server. The built site's three files are present with the right bytes; that the page fetches them from the build is the same path, but I did not observe it. The desk reads a scan on the alias after the ship, as the brief says.
- The HTTP status of each of the three requests: my probe recorded them but I stopped it before it printed. The syllables seated are the proof that the worker, the core, and the model were fetched.
- The `rus_prereform` model's licence: it is the project's own model (row 82); I did not find or write a licence line for it.
- L17 step 1 (the measure) is still to be taken.
