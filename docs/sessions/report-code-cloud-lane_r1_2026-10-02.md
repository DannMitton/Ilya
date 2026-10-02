# Report: the cloud lane, first batch

Cloud session on branch `cloud-lane`, 2026-10-02. Started from `952ff7f` ("Scan reader: a hook is not a head; two heads on a stem are one event (row 20, WRITTEN). Cloud lane ruled. Desk records."), which is the `Shane` commit the branch was made from. The prompt in `QUEUE.md` named `004ffe4`; the desk corrected that to `952ff7f` and the checkout confirms it (`git rev-parse HEAD` printed `952ff7ffd73ab710fea116730775b70aab87366e`, working tree clean).

Rows taken, in order: 8c, 10, 15, 16, 7, 14. Rows 3, 5, 6, 8, 9, 11, 12, 13, and 17 were not taken. `tools/e16-harness/` was not edited.

## Baseline

Fresh clone, `pnpm install --frozen-lockfile`, nothing changed. `pnpm-workspace.yaml` was not touched by pnpm (working tree stayed clean).

| # | Gate | Baseline | Result before any change |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 251 passed (251) | 251 passed (251) |
| 2 | `pnpm test:dictionary` | 235 passed (235) | 235 passed (235) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 1784 passed (1784) | 1784 passed (1784) |
| 5 | `pnpm --filter @ilya/score-parser test` | 636 passed, 5 skipped (641) | 636 passed, 5 skipped (641) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | ratchets: OK. | ratchets: OK. (it also prints that two ceilings can be lowered: `MarkupPane.svelte` 1358 to 1302, `+page.svelte` 6028 to 6016; not acted on) |

The clean clone met every baseline, so work began.

## Does the reader run in the cloud

**Short answer: no, not as the measuring scripts are written, and not under Node either. Both stop at the same place: this machine's network policy denies `cdn.jsdelivr.net`, which is the only place the pinned Pyodide's numpy and OpenCV wheels come from.** No code was changed. The scratch copies lived outside the repository (the session's scratchpad); `git status` stayed clean.

**What was run.** A scratch copy of `docs/sessions/measure-bars_r1_2026-10-02/pyrun.mjs` with two edits: the `createRequire` path pointed at `/home/user/Ilya/apps/web/package.json` in place of Dann's Mac path, and `chromium.launch()` given `executablePath` from `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (as `ENVIRONMENT.md`, "THE GATES RUN IN A CLOUD CLONE", says). A scratch copy of `b1.py` with `NAMES` cut to `['lamm-1','lamm-2']`. The script was fed the two tracked pages `tools/e16-harness/scans/pdfjs400-1.png` and `pdfjs400-2.png`, against the web dev server (`pnpm dev --port 5173`) on port 5173.

**Why `b1.py` and `lamm-1`.** None of the recorded `b*.json` files names `pdfjs400-*` or `raster400-*`. The page-level scores in `docs/sessions/measure-staves_r1_2026-10-01/m9b.json` are identical for `S_lamm-1.png` and `pdfjs400-1.png` (and for `-2`), which is evidence, not proof, that they are the same render. So the comparison target would have been the `lamm-1` and `lamm-2` entries in `b1.json`. NOT ESTABLISHED: that the two files are pixel-identical, because the run never got far enough to compare.

**What loaded, and from where.**

| Piece | Source | Result |
|---|---|---|
| Dev server, `/reader/manifest.json` | `localhost:5173` (`apps/web/scripts/copy-reader.mjs` runs first under `pnpm dev`) | HTTP 200 |
| Headless Chromium 1194 under Playwright | `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` | launched, reached `localhost:5173` |
| `pyodide.mjs` v0.26.4 | `https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs` | **FAILED** |

**Exactly what failed (Chromium).** `pyrun.mjs:15` threw `page.evaluate: TypeError: Failed to fetch dynamically imported module: https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs` after 3.6 seconds. `curl` to the same URL gave `curl: (56) CONNECT tunnel failed, response 403`. The agent proxy's status endpoint lists the cause as `connect_rejected`, "gateway answered 403 to CONNECT (policy denial or upstream failure)", host `cdn.jsdelivr.net:443`. So headless Chromium can launch and the app's own files load, but it cannot reach jsdelivr. Hosts that did answer: `registry.npmjs.org` (200) and `pypi.org` (200). `unpkg.com` gave no answer (curl code 000).

**The Node fallback.** In a scratch folder outside the repository: `npm i pyodide@0.26.4` (14 MB; not added to any of the repository's package files). `loadPyodide()` from that package booted: `core ok 0.26.4 3.12.1`, so the interpreter itself runs under Node here. Then `loadPackage` for `numpy`, `opencv-python`, and `matplotlib` printed `Failed to load 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/numpy-1.26.4-cp312-cp312-pyodide_2024_0_wasm32.whl': request failed.`, and the same for Pillow, pyparsing, python-dateutil, pytz, and `matplotlib-pyodide`. The npm package carries the interpreter and `python_stdlib.zip` only, with no package wheels, so every wheel is fetched from jsdelivr, and none arrives. (Its log line "loaded numpy" prints even after the failure; it is not a success.) Without numpy and OpenCV, `reader.py` cannot import, so the page could not be run and there is no number of mine to set beside the recorded ones.

**Whether another route exists.** PyPI is reachable, but the JSON index lists no Emscripten or Pyodide wheel for `numpy` (4,232 files) or `opencv-python` (1,126 files), so the Pyodide wheels are not there. System Python here has no `cv2` (`ModuleNotFoundError`).

**Numbers beside the recorded ones: none.** Recorded for `lamm-1` in `b1.json`: not compared. Mine: not produced.

**What would unblock it, for the desk to rule on (not done; each is outside this measurement's scope):**
1. Allow `cdn.jsdelivr.net` in this environment's network policy (`read_documentation` topic `environment.network`). That alone lets `pyrun.mjs` run as written.
2. Mirror the Pyodide v0.26.4 `full/` folder (the wheels for numpy, opencv-python, matplotlib and their dependencies, plus `pyodide-lock.json`) from somewhere reachable. NOT ESTABLISHED: whether any reachable host serves them.
3. Run the reader's Python natively (`pip install numpy opencv-python` from PyPI, which is reachable). This answers a different question: whether the reader's logic gives the recorded numbers, not whether the pinned Pyodide in the browser does. A different OpenCV build could differ in the last digit. Not run, because the brief asked for the pinned Pyodide.

Time spent on the measurement: well inside the 30-minute cap (not timed to the minute).

## Row 8c: citation repairs in `insights/comment-sources.ts`

WRITTEN, not DONE. DONE is Dann's walk after he merges.

**What changed.**
1. `apps/web/src/lib/insights/comment-sources.ts:78-86`, row `RMR-057`: the quotation is now Miller 1986 p. 158, "natural modification of the vowel will inevitably result in the mounting scale", in place of the quotation that argued against modification to the schwa. `pages` goes from `[157, 158]` to `[158, 158]`, because the brief gives p. 158 only. A comment records why.
2. `apps/web/src/lib/sources.ts:275-278`, `miller1986`: `place: 'New York'`, `publisher: 'Schirmer Books'`, from the title and copyright pages, PDF pp. 1 to 8. The `record` field (`:285`) says so.
3. `apps/web/src/lib/sources.ts:260-261`, `bozeman2021`: `isbn: '978-1-7335060-3-8'`, supplied by Dann 2026-09-30 12:15. The comment says the copyright page is not among the photos.
4. `apps/web/src/lib/insights/comments.test.ts:149` and `:359`: the two expected comment strings print "p. 158" (French) and "p. 158" (English) in place of "p. 157-158" and "pp. 157 to 158". These are the only tests that moved; their count did not change.

**Gates (all eight run after the change).**

| # | Result | Baseline |
|---|---|---|
| 1 | 251 passed (251) | same |
| 2 | 235 passed (235) | same |
| 3 | 0 errors, 12 warnings in 5 files | same |
| 4 | 1784 passed (1784) | same |
| 5 | 636 passed, 5 skipped (641) | same |
| 6 | 145 passed (145) | same |
| 7 | 55 passed (55) | same |
| 8 | ratchets: OK. | same |

No number moved.

**Not established.**
- That "natural modification of the vowel will inevitably result in the mounting scale" supports the comment's wording "tends to open a little on its own". The desk chose the quotation; the comment text in `i18n.ts:1657` was not touched.
- The Bozeman ISBN's copyright page was not read by this session; it is Dann's figure.
- How the new place and ISBN print in the French references was not walked. The existing sources tests pass.
