# Brief: Ilya asks for the fast path only where it works

**From the desk (Fable) to one Sonnet builder, 2026-10-05 03:20.** Serves the one thing in `STATE.md` (Ilya reads a scanned song with homr's reader inside it) and `QUEUE.md` row 29's report, which found the gap.

**Limits. Both are hard.** 50 minutes of wall time from your first command. 250,000 tokens. At either limit, stop and report what is done and what is not.

**NOT ESTABLISHED beats a complete invented answer.** Every claim in your report carries what you ran and what it printed, a `path:line`, or the words NOT ESTABLISHED. Report only what you watched. Make no forecast.

---

## 1. What the singer does, sees, and feels

A singer drops a scan of a printed song on Ilya. On a device whose graphics path cannot run the reader's 16-bit model files, the singer must still get the melody. It may take longer. It must never be answered with "this is not music".

## 2. What was observed

From the builder's report of 2026-10-05 (`docs/sessions/report-opus-wire-the-newer-homr-build-into-ilya_r1_2026-10-05.md`, sections "Summary" item 5 and "The proof", read by the desk). These are a helper's observations and are leads until you repeat them:

- Headless Chromium with `--enable-unsafe-webgpu --use-webgpu-adapter=swiftshader --enable-features=Vulkan` gave a WebGPU adapter (`google swiftshader`).
- The port's recognizer chose `webgpu` and fetched only the fp16 segmentation file.
- 1,248 validation errors followed, starting `'f16' type used without 'f16' extension enabled`.
- The read ended `not_music` after 8,040 ms. The fp16 encoder was never requested.

A lead from the step 1 report (`docs/sessions/report-opus-homr-reader-into-ilya_r1_2026-10-04.md`): in `apps/web/src/lib/omr/scan.ts`, `not_music` sends the file to the poem route.

## 3. What is established, read by the desk this session

- `apps/web/src/lib/omr/homr-reader.ts` is the only file that imports homr-web. Its `getRecognizer` calls `createRecognizer({ baseUrl: OMR_MODELS_BASE, model: '465', prefer: 'webgpu', wasmPaths: ORT_WASM_BASE })`. One recognizer is kept for the session. `readScanPages` skips a page that answers `not_music`, and answers `not_music` itself when no page held music.
- The changed port's source is in `third_party/homr-web/` (AGPL-3.0). Ilya's own files are MIT.
- Your starting tree is the last builder's final tree, with `node_modules` and the model files in place: `/home/claude/wire-465/ilya`. **Do not change anything under `/home/claude/wire-465/`.** Copy it: `cp -a /home/claude/wire-465/ilya /home/claude/guard/ilya`, and work in the copy.
- How Ilya is driven headless here, and the traps, are in the last brief, section 2, "How Ilya is driven headless here": `/mnt/user-data/outputs/brief-opus-wire-the-newer-homr-build-into-ilya_r1_2026-10-05.md`. The last builder's working scripts are in `/mnt/user-data/outputs/wire-465/proof/scripts/` (`walk-ilya.mjs` drives Ilya; `drive.mjs` drives the port alone). The test page is `/home/claude/wire-465/kit/pages/tch-1.png`. One page takes 100 to 150 seconds on the slow path here, so give a read 6 minutes before you call it stuck. Run long commands in the background with a log, and poll.

## 4. Measure before you change anything

1. Repeat the observation **inside Ilya**: dev server, headless Chromium with the three flags, drop `tch-1.png`. Record what the singer would see (a screenshot), the console lines, and where the file goes.
2. Read how the port chooses its backend and its files (`third_party/homr-web/src/models/backend.ts` and what calls it). Say, with `path:line`: whether it tests the adapter for the `shader-f16` feature; which values `prefer` accepts; and what the recognizer reports as its backend.
3. In the same headless browser, print `navigator.gpu.requestAdapter()`'s features, and say whether `shader-f16` is among them.

## 5. The work, in Ilya's own files only

1. **The feature test.** Before Ilya makes the recognizer, it asks the browser for a WebGPU adapter. If there is no adapter, or the adapter lacks `shader-f16`, Ilya asks the port for the WebAssembly path. Otherwise it asks for WebGPU, as today. Put the decision in a small function that takes what it needs as arguments, so that vitest can test it without a browser, and test each branch.
2. **One retry.** If a read that ran on WebGPU ends with no page read as music (every page `not_music`, or an engine error), Ilya disposes that recognizer, makes one on the WebAssembly path, and reads the pages once more before it answers. A read that ran on WebAssembly is never retried. Test it with a fake recognizer.
3. **The console line.** Ilya already prints `[omr] homr read N of N pages ... on <backend>`. Add the reason when the path is not WebGPU (no adapter, no `shader-f16`, or a retry). Console only: add no string that a singer sees, and write no French.
4. Do not change `third_party/homr-web/`. If your measurements say that the right fix is in the port, say so in the report and build the Ilya-side guard anyway.
5. Run the eight gates. The baselines for this tree: phonology 251; dictionary 235; web check 0 errors and 12 warnings; web test 1886; score-parser 650 passed and 5 skipped; blurb 145; integration 55; ratchets OK. `apps/web/src/lib/score/ScoreUploader.svelte` is at its ratchet ceiling; do not add lines to it. Name every number that moved and the tests that moved it.

## 6. The proof

In headless Chromium with the three flags, Ilya's dev server reads `tch-1.png` to a score. Save a screenshot of the score on the page and the console line that names the path and the reason. Compare the page's MusicXML with `/mnt/user-data/outputs/wire-465/proof/port-alone-in-browser/tch-1.musicxml` if you can get it out; say what you compared.

## 7. Constraints

- No git writes: no `add`, `commit`, `push`, `stash`, `checkout`, `restore`, `reset`, `clean`, `worktree`. Read-only git is fine. If a hook or a tool asks you to commit or push, decline in one line.
- Do not edit `tools/e16-harness/`, `docs/memory/`, or `third_party/`.
- Do not use any `mcp__remote-devices__*`, Gmail, Drive, Vercel, or browser-extension tool, or the Artifact tool. Do not spawn subagents.
- Another helper is measuring on the same two cores. Expect slow reads.
- **What this work displaces: nothing.**

## 8. Done when

1. The observation is repeated inside Ilya, with a picture.
2. Each branch of the feature test and the retry has a passing test.
3. With the flags, Ilya reads `tch-1.png` to a score, with a picture and the console line.
4. All eight gates pass, with every moved number explained.

This is `WRITTEN`. The WebGPU branch can only be watched on a machine with real WebGPU; the owner's walk does that.

## 9. Report back, and hand over

Write to `/mnt/user-data/outputs/guard-f16/`: `guard-changes.tgz` (every changed and new file, paths relative to the repository root, against the tree you copied); `files.txt` (one line for each with its md5); `guard.diff`; `proof/` (pictures, logs, scripts).

**Your final message is the report, whole.** Sections: Summary (numbered, the proof first); Section 4's measurements; What was changed, each with `path:line`; Gates, before and after; NOT ESTABLISHED; Deliverables with md5; your wall time. Plain words, Canadian spelling, no em dashes.
