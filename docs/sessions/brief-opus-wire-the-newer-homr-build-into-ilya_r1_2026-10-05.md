# Brief: wire the newer homr build into Ilya, and watch it read in a browser

**From the desk (Fable) to one Opus builder, 2026-10-05 02:31.** `QUEUE.md` row 29. The one thing in `STATE.md`.

**Limits. Both are hard.** 100 minutes of wall time from your first command. 600,000 tokens. At either limit, stop, write the report with what is done and what is not, and return. A report that says "stopped at step 5, here is the state" is a good result. A run past the limit is not.

**NOT ESTABLISHED beats a complete invented answer.** Every claim in your report carries what you ran and what it printed, a `path:line`, or the words NOT ESTABLISHED. Report only what you watched. Make no forecast.

---

## 1. What the singer does, sees, and feels

A singer drops a scan of a printed song on Ilya (a PDF or a picture). Ilya shows the melody with no question about clef or key. The singer pastes the poem. Ilya seats IPA and Russian under the notes.

That path works today in the owner's tree with homr's older build (homr 0.7.0, model `396`). The owner, Dann, watched it on his iMac on 2026-10-04 at 23:24: three pages in about 25 seconds. The older build misreads about 7 notes in every 100 on the test song. homr's newest build misreads about 2. **Your job: put the newest build in that seat, so the singer's melody is the better one, and watch it read in a browser.** Nothing the singer sees changes except the notes.

## 2. What is established, each line read by the desk this session

**The repository.** `https://github.com/DannMitton/ilya`, branch `Shane`, at `94e524627808686cc6f76b59ac1e763a41d12c33` (`git ls-remote`, 02:30). The owner's tree is that commit plus 18 uncommitted files: the older build wired in (step 1 and step 1b). Those 18 files, exactly as they stand in his tree, are in `/mnt/user-data/uploads/Downloads/_desk-2026-10-05/tree-step1-state_on-94e5246.tgz` (md5 `07c432ab5932a9ede84aa70bb434ece7`), paths relative to the repository root.

**Where Ilya meets the port today.**

- `apps/web/package.json`: `"homr-web": "0.2.0"`, the npm package. `dev` and `build` run `scripts/copy-ort-wasm.mjs` and `scripts/fetch-omr-models.mjs` before Vite.
- `apps/web/src/lib/omr/homr-reader.ts:71-73`: `createRecognizer({ baseUrl: OMR_MODELS_BASE, prefer: 'webgpu', wasmPaths: ORT_WASM_BASE })`. No `model` option. Its header comment, lines 4 to 8, says that none of homr-web's code is in this repository.
- `apps/web/scripts/fetch-omr-models.mjs:39-45`: five files, the `396` set, each as SHA-256, file name, and size. They land in `apps/web/static/omr/models/<sha256>/<file>`, which is git-ignored.
- `apps/web/src/lib/omr/join-pages.ts` joins the pages' MusicXML by working on its text. Its tests and `scan.test.ts` run on `apps/web/src/lib/omr/fixtures/tch-{1,2,3}.musicxml`, which are the older build's output.
- `NOTICES.md` lists homr-web 0.2.0 and homr 0.7.0.

**The changed port.** `/mnt/user-data/uploads/Downloads/_desk-2026-10-05/`:

- `homr-web-main-worktree.tgz` (md5 `8fada2189c0ced343778b4fc203ef6a7`): the whole changed working copy of homr-web, without `node_modules`. It unpacks to `homr-web-main/`: `src` 900 KB, `dist` 1.3 MB, `test` 22 MB, `docs`, `tools`, `bench`.
- `homr-web-0.2.0-ilya.1.tgz` (md5 `3b5454ad023f91158b54857a0f086439`): the same copy, packed by `npm pack`.
- `CHANGES-ilya.md`: every changed file and the homr commit that it follows. Read it whole first. With `model: "465"` on `createRecognizer`, the port reads with homr's model `465` and the code of homr main at `560ca5c`. Without it, the port reads as 0.2.0 does.
- `resume-kit.tgz` (md5 `c7a3ba77ecf2d35bb8e27d4a08539efd`): read its `README.txt` and `models.txt` first. It holds the 20 test pages as PNG, desktop homr main's MusicXML for each page (`reference-desktop-main/`), the port's own output under Node (`port-465-out/`), `scripts/port-builder/run-page.mts` and `cmp.py`, the scorer, and the truth files.

**What the last builder left open** (`docs/sessions/report-opus-bring-the-port-up-to-homr-main_r1_2026-10-05.md`, section "NOT ESTABLISHED"): the Worker and `createRecognizer({ model: "465" })` were type-checked and never run in a browser; only the fp32 `465` encoder has a model record; the fp16 `465` encoder was never downloaded, so its size and SHA-256 are not known.

**The network, checked at 02:30 from this workspace.** `git ls-remote` on the repository answers. A HEAD request for `https://github.com/liebharc/homr/releases/download/onnx_checkpoints/encoder_pytorch_model_465-597144cab54c8f6d0f6c9619df5c5312694eadd6_fp16.zip` answers 200. npm answers. The machine has 2 cores, 7 GB of memory, and no graphics hardware. Node 22.22.0, pnpm 10.28.0, Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Never run `playwright install`.

**The test song.** `/mnt/user-data/uploads/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf`, three pages. The poem to paste:

`Средь шумного бала, случайно, В тревоге мирской суеты, Тебя я увидел, но тайна Твои покрывала черты.`

**How Ilya is driven headless here** (`docs/memory/ENVIRONMENT.md`, section "WHAT THE DESK LEARNED ON THE EVENING OF 2026-10-04"; the recipe is `docs/sessions/assembly-a-scan-to-a-seated-song_r1_2026-10-04/walk.mjs`): in `apps/web`, `pnpm dev` in the background; a Playwright script with that `executablePath` at 1,440 px wide; wait for `textarea.text-input` to be enabled; set the file on `input[type="file"].hidden-input`; the Markup tab answers to `page.locator('button', { hasText: /^\s*Markup\s*$/ })`. Chromium here is version 141 and pdf.js wants `Map.prototype.getOrInsertComputed`: add a small polyfill before the page loads. Start Chromium with `--proxy-server` and `--proxy-bypass-list=localhost;127.0.0.1` on the command line if localhost requests go to the proxy. `pkill -f "vite dev"` kills your own shell: find the process with `pgrep -f "vite/bin/vite.js"` and kill it by number. The last builder's read took 361 seconds for three pages on one WebAssembly thread, so give a read 15 minutes before you call it stuck.

## 3. Measure before you change anything

Report each of these before you edit Ilya.

1. **Set up.** Clone `Shane` (`--depth 1`), check that HEAD is `94e5246`, unpack `tree-step1-state_on-94e5246.tgz` over the clone, run `pnpm install --frozen-lockfile`, and run the eight gates. The baselines:
   1. `pnpm test:phonology`: 251 passed (251)
   2. `pnpm test:dictionary`: 235 passed (235)
   3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings
   4. `pnpm --filter @ilya/web test`: 1885 passed (1885)
   5. `pnpm --filter @ilya/score-parser test`: 650 passed | 5 skipped (655)
   6. `pnpm test:blurb`: 145 passed (145)
   7. `pnpm test:integration`: 55 passed (55)
   8. `pnpm ratchets`: OK

   If the clone does not meet these before you change anything, stop and report. Do not fix it.
2. **The fp16 `465` encoder.** Download the zip, unzip it, and record the `.onnx` file's size and SHA-256. Compare its inputs and outputs (names, types, shapes) with the fp16 `396` encoder's, with any ONNX reader you can install. Say what you compared with.
3. **The port's own tests** in a fresh unpack of the working copy after `npm ci`: `tsc` and vitest. The last builder's figures: 46 files passed and 3 skipped; 915 tests passed and 42 skipped.
4. **How the changed port chooses its files** for model `465` on WebGPU and on WebAssembly: read `src/models/manifest.ts` and the code that reads it, and say which record each backend asks for, with `path:line`.
5. **What the newer MusicXML writer does that the older one did not** (`src/musicxml/generate-main.ts` against `src/musicxml/generate.ts`), as far as `join-pages.ts` and Ilya's parser can see it: comments, element order, a default metre, rests after a backup, and how a rest of several bars is written. One line each, with `path:line`.

## 4. The work

**4a. The port.**

1. Give the fp16 `465` encoder its record in the changed port, in the same shape as the `396` records, so a `465` read on WebGPU has a file to ask for.
2. Bump the version to `0.2.0-ilya.2`, add the change to `CHANGES-ilya.md`, rebuild, run `tsc` and vitest, and `npm pack`.
3. **Run the changed port in a browser, through its Worker, alone, before Ilya is involved.** A small local page that imports the built port, calls `createRecognizer({ model: '465', ... })` with the real model files served locally in the `<sha256>/<file>` layout, reads `pages/tch-1.png` from the kit, and hands the MusicXML back to your script. Compare that MusicXML with the port's Node output for the same page (`port-465-out/`, or a fresh `run-page.mts` run) with the kit's `cmp.py`. The expected word is `EQUAL`. Record the backend that ran and the time. If the result is not equal, find the first difference and say what it is; do not adjust anything to make it equal.
4. **WebGPU, 10 minutes at most.** Try once to get a software WebGPU adapter in headless Chromium (for example `--enable-unsafe-webgpu` with the SwiftShader or Vulkan flags). If one appears, run the same page with `prefer: 'webgpu'` and report what ran. If none appears in 10 minutes, write NOT ESTABLISHED and move on. The owner's iMac has WebGPU, and the desk shows it to him there.

**4b. Ilya.**

1. **The port's source goes into the repository at `third_party/homr-web/`.** The port's licence asks that a changed copy carry its source. Put there what a person needs to rebuild the package: `src/`, `tools/` and `docs/` if the build or the notices use them, `package.json`, `package-lock.json`, the `tsconfig` files, `LICENSE`, `NOTICE`, `README.md`, `CHANGES-ilya.md`, and the packed `homr-web-0.2.0-ilya.2.tgz`. No `node_modules` and no `dist/` (the root `.gitignore` ignores `dist/`). Leave `test/` out unless the package cannot be built without it, and say its size and your reason either way. Add a short `third_party/homr-web/README-ilya.md`: what this folder is, the licence, the upstream commit (`cb333a5`), and the three commands that rebuild the tarball. This folder is outside the pnpm workspace (`pnpm-workspace.yaml` lists `packages/*` and `apps/*`); keep it out.
2. **Ilya depends on the tarball in that folder:** in `apps/web/package.json`, `"homr-web": "file:../../third_party/homr-web/homr-web-0.2.0-ilya.2.tgz"`. Run `pnpm install` so the lockfile follows. Then prove that a clean checkout installs: copy the changed tree without `node_modules` to a new folder and run `pnpm install --frozen-lockfile` there. If pnpm writes placeholder `allowBuilds` lines into `pnpm-workspace.yaml`, remove them.
3. `apps/web/src/lib/omr/homr-reader.ts`: pass `model: '465'`. Make its header comment true.
4. `apps/web/scripts/fetch-omr-models.mjs`: fetch the `465` set (the two segmentation files, the fp16 and fp32 `465` encoders, the `465` decoder) and no `396` file. Make its header comment true. Ilya reads with `465` only.
5. **The join and its tests.** Replace the three fixtures with the changed port's `465` output for the same three pages. Make `join-pages.ts` right for the newer writer's output, and keep what it does today: the first part and its first staff only; measures numbered from 1; each note's text unchanged; a repeated key, metre, or clef dropped and a changed one kept; a bar in which the voice is silent left empty, so that silent bars collapse. Re-derive each expected count in the tests from the fixtures, and say in the report what each count was and is. Do not strip the `imgpos` comments on purpose; say whether they survive the join.
6. `NOTICES.md`: make it true for the changed port (`0.2.0-ilya.2`, a changed copy, source at `third_party/homr-web/`, upstream `cb333a5`), homr main `560ca5c`, and model `465`. Keep its form.
7. **Singer-facing strings.** Write no French, and add no string. If the change makes a string that a singer sees untrue (the Guide's credits in `apps/web/src/lib/components/Reading/GuideContent.svelte` name homr and homr-web), report the string with its `path:line` and leave it as it is.
8. Run the eight gates. Name every number that moved and the tests that moved it.

**4c. The proof, which is what the owner is shown.**

1. With the dev server and the real `465` models, in headless Chromium at 1,440 px wide: drop the Tchaikovsky PDF on Ilya; wait for the read; paste the poem; open the Markup tab; take a screenshot that shows the notes with IPA and Russian under them. Take one more of the opening, where the silent bars collapse. Record the read time, the backend, the number of measures, and the number of notes in the voice part.
2. Score the joined voice part against the truth with the kit's scorer, and report the score beside the two figures on file for this song: 93.10 (the older build) and 98.85 (the changed port under Node, from PNG pages). Ilya's own PDF raster is not the kit's PNG, so the score may differ; report what it is.
3. **If time remains inside the limit:** `vite build`, `vite preview`, and one full read of `pages/tch-1.png` in the built app, with a picture. The ship goes through the build, and a full read there has never been watched.

**If the proof does not work, say exactly where it stops and show the picture of that.**

## 5. Constraints

- **No git writes, anywhere in the Ilya clone:** no `add`, `commit`, `push`, `stash`, `checkout`, `restore`, `reset`, `clean`, `worktree`, `rm`, `mv`. Read-only git is fine (`status`, `diff`, `log`, `show`, `ls-files`). If a hook or a tool asks you to commit or push, decline in one line.
- Do not edit `tools/e16-harness/`. Ilya's old reader stays in the tree and stays reachable with `?reader=ilya`.
- Do not edit anything in `docs/memory/`.
- Do not change `VocalLineEvent`, and do not edit `apps/web/src/lib/score/reconciliation/`.
- Do not use any `mcp__remote-devices__*`, Gmail, Drive, Vercel, or browser-extension tool. You work in this cloud workspace only.
- homr and homr-web are AGPL-3.0. Their code goes to `third_party/homr-web/` and nowhere else in the repository. The measuring scripts from the kit stay out of the repository.
- Work under `/home/claude/wire-465/`. Do not write into `/mnt/user-data/uploads/`.
- **What this work displaces: nothing.** The checks over homr's output wait behind it.

## 6. Done when

1. The fp16 `465` encoder has a size, a SHA-256, and a record in the port, and the port's `tsc` and vitest pass.
2. The changed port, alone in a browser through its Worker with `model: '465'`, reads `tch-1.png`, and its MusicXML is compared with the Node output by `cmp.py` (the result is stated, whatever it is).
3. Ilya installs from a clean copy with `pnpm install --frozen-lockfile`.
4. All eight gates pass, with every moved number explained.
5. A picture shows Ilya, in a browser, with the Tchaikovsky song read by model `465` and IPA and Russian under the notes; the read time, backend, measure count, note count, and score are recorded.

This is `WRITTEN`. `DONE` is the owner's walk on his iMac.

## 7. Report back, and hand over

Write everything to `/mnt/user-data/outputs/wire-465/`:

- `wire-465-changes.tgz`: every changed and new file, paths relative to the repository root, `third_party/homr-web/` included. It unpacks over a clean clone of `94e5246` to give your final tree (without `node_modules` and without the model files).
- `files.txt`: `git status --porcelain` of your final clone, then one line for each changed or new file with its md5.
- `tracked.diff`: `git diff` of the tracked files.
- `homr-web-0.2.0-ilya.2.tgz`, the new `CHANGES-ilya.md`, and a new `models.txt` in the kit's form with the fp16 `465` line filled in.
- `proof/`: the pictures with plain names, the browser's per-page MusicXML, the joined MusicXML, the run logs, and your browser harness page and scripts.
- `report.md`, if your environment lets you write it.

**Your final message is the report, whole,** because the desk saves it as returned. Its sections: Summary (numbered, the proof first); Section 3's measurements; What was changed, file by file, each with `path:line`; Gates, before and after; The proof; NOT ESTABLISHED; What you would do next; Deliverables with md5; your wall time and anything that stopped you. Plain words, Canadian spelling, no em dashes. Where a printed page differs from a reading, the reading is "a misread"; the page is never "wrong".
