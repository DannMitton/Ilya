# Brief (desk helper, Sonnet): rows 224 and 227, step 0, run in the cloud container

2026-11-27, written by the desk (Opus 5). Serves QUEUE rows 224 and 227. Cap 300k tokens.
This is a MEASURE. It keeps nothing, changes no source, and commits nothing.

## Goal

Run step 0 parts (a) to (e) of `docs/sessions/brief-code-rows224-227-lyric-band-and-row-choice_r3_2026-11-27.md`
(md5 `70f59bb2`) in the cloud container, on Nightingale page 4, using Ilya's own pdf.js as the rasteriser.

## Why the rasteriser matters

poppler is not a substitute, and this was measured. `pdftoppm -gray -png` on `nightingale-p4-only.pdf` at
4400 by 5500 gives paper tone 226 against the lane's 227 (acceptable) and a 1st percentile of 96 against the
lane's 89 (NOT acceptable). The difference is antialiasing on ink edges, which is exactly what a band-edge
measure reads. Every figure in your report names the rasteriser that produced it.

## The harness already exists; port it, do not rebuild it

`docs/sessions/measure-staff-finder-light-scan_2026-11-25/raster.mjs` already rasterizes one PDF page through
the app's own `rasterizePdf` (`apps/web/src/lib/reader/page-pdf.ts`, which is pdf.js) by driving a Playwright
browser at a vite dev server on :5173. `step0c-browser.mjs` and `step3-rows.mjs` in the same folder are the
patterns for calling the tree's own modules in the page. THREE PORTS ARE NEEDED and nothing else:
1. `createRequire('/Users/dannmitton/...')` becomes the container's clone path.
2. `require('@playwright/test')` becomes `require('playwright')`. `@playwright/test` is MODULE_NOT_FOUND here.
3. `chromium.launch()` becomes
   `chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })`.

Verified in the container by the desk this session: Chrome 153.0.8010.12 at `/usr/bin/google-chrome`,
node v22.23.5, pnpm 10.28.0, `require('playwright')` resolves, 31 GB free.
`pnpm install --frozen-lockfile` exits 1 on "Ignored build scripts" while still populating `node_modules`:
CHECK FOR THE DIRECTORY, NOT THE EXIT CODE.

## Inputs

- Repository: clone `Shane` shallow from the project's GitHub remote into the container. Read-only git ONLY
  (`status`, `log`, `diff`, `show`, `ls-files`). NEVER `add`, `commit`, `push`, `checkout -b`, `reset`,
  `restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, `tag`. If the clone fails, stop and report.
- The PDF: on Dann's Mac at
  `~/Desktop/ilya-rewrite/docs/sessions/../../../Downloads/_desk-staffin-2026-11-25/work/code-lane/step3/nightingale-p4-only.pdf`
  (absolute: `/Users/dannmitton/Downloads/_desk-staffin-2026-11-25/work/code-lane/step3/nightingale-p4-only.pdf`,
  269,065 bytes). Bring it in with `device_stage_files`.
- The lane's own row dump for cross-checking:
  `/Users/dannmitton/Desktop/ilya-rewrite/docs/sessions/measure-staff-finder-light-scan_2026-11-25/step3-rows.out.txt`
  and `step3-summary.out.txt`.

## Step 0, the instrument check, FIRST and gating

Raster page 4 through `rasterizePdf` at the lane's pixel size (4400 by 5500; read `page-pdf.ts`'s scale logic
and match it, do not invent a scale). Report, from that raster:
- the paper tone (the modal or median background grey) against the lane's recorded **227**
- the 1st percentile grey against the lane's recorded **89**
- the raw-bytes md5 against the lane's recorded `5bb97b1e`
**If the paper tone or the 1st percentile does not match the lane's, STOP AND REPORT. Take no step 0 figure
from a raster that fails this check.**

## Step 0 parts, on Nightingale page 4

Read the brief r3 section "### Step 0, measure only" in full before starting; what follows is its scope, not a
replacement for its wording.

- **(b) Whether the band's edge actually cuts ink.** For every system, the first row's `core[0]`
  (`underlay-rows.ts:56`, `:187`). `core[0]` is the first band line where `on` is true (`:165`, `:179-180`,
  `:187`), so "`core[0]` is 0" and "band line 0 holds ink" are ONE condition. The row's `y0` is clamped to the
  band's top (`:185`), so a box starting within 1 px of the edge is NOT evidence of a cut. Measure the ink.
- **(c) The ink profile of the 1.5 staff spaces above each band's top.**
- **(d) What each of the four looks gives, per system:** its rows, which pass `rowLanguage`, each row's score
  on the lane's one measure (the share of the row's letters inside sewn words the dictionary knows), AND each
  row's letter total beside its score. Also run `?looks=off` behaviour where the harness allows it.
  **STOP AND REPORT if the measure scores the German row above the printed Russian line on ANY system.**
  Report the projected cost: systems tripping each trigger, times looks offered, times rows a look, times ms a
  row. The first look read 41 rows in 5,431 ms on this page, about 132 ms a row, inside a 6.2 s page read.
- **(e) How many pages in the staged sets have a first row with `core[0]` at 0**, with their names.
  **Where most staged pages trip it, STOP AND REPORT:** the remedy would then be the band's edge, not the
  trigger, and that is a finding for Dann rather than a step.
- **(a) The key.** For every system, the top and bottom y of the PRINTED Russian line, read BY EYE from crops,
  not from any rule the code holds. Save every crop as a PNG under your output folder, named by system, so the
  desk can check your reading. **Mark your (a) reading PROVISIONAL, DESK TO CONFIRM.** Note especially
  system 16, whose rows 1 and 2 stand 16 px apart where every other system's pair stands 26 to 39.

**Scope default, the desk's:** Nightingale page 4 first and complete. song2 page 1 only if you are under 200k
when page 4 is done. If you do not reach song2 p1, say so plainly; it is not a failure.

## Constraints

- Change no source. Commit nothing. Write only under your own output folder in the container, plus the one
  report file named below.
- Every number carries the file and line, or the run, that produced it. No third form.
- Do not report a timing you have not controlled for.
- State your expectation before each measurement and report against it.
- **NOT ESTABLISHED beats a complete invented answer.**

## What could not be established (fill this in; it is required)

A section listing everything you could not settle, and why.

## Done when

A report exists that carries: the instrument check with its three figures, parts (b) to (e) complete for
Nightingale page 4, part (a) as a provisional by-eye key with its crops saved, a "what could not be
established" section, and the rasteriser named for every figure.

## Return

1. Write the full report to the container, then place it on Dann's Mac with `device_commit_files` at
   `/Users/dannmitton/Desktop/ilya-rewrite/docs/sessions/report-desk-rows224-227-step0_r1_2026-11-27.md`.
2. Return in your final message a memo UNDER 1,200 WORDS: the instrument check's three figures and its verdict,
   the headline number for each of (b) to (e), every STOP condition you hit, what could not be established, and
   your token cost. Do not paste the whole report into the message.
