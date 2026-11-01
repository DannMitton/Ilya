# Report: row 163, step 0 (measure, keep nothing)

2026-11-01, Code (Sonnet), branch `mac-row163` cut from `Shane` at `cab8d205`, in the worktree `~/Desktop/ilya-rewrite-row163`. The working tree was clean when each reading was taken. This step changes no source file; the probes and the two builds live outside the repository.

## Baselines, run in the worktree before step 1

| Gate | Brief | Read |
|---|---|---|
| 1 phonology | 291 passed (291) | 291 passed (291) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web check | 0 errors, 12 warnings, 5 files | same |
| 4 web test | 3718 passed, 1 skipped (3719) | same |
| 5 score-parser | 775 passed, 5 skipped (780) | same |
| 6 blurb | 145 passed (145) | same |
| 7 integration | 55 passed (55) | same |
| 8 ratchets | ratchets: OK. | same |

## (a) Markup columns with a # after every word, before step 2

Fixture: `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` (Sunless no. 1, the repaired file), seated through `seatScoreWords`, `rekeySeatsToLines`, and `drawPairings` (no switches), drawn with `renderAnalyzedStaff` as `syntactic-break-surfaces.test.ts` does. The text was the score's own words with « #» after every word.

- 96 syllable IPA texts drawn in both runs (with and without the #); 34 of them end in `#` (the # folds into the unit's last word, so fewer than one per word).
- **Columns that moved with the # against without it: 0 of 96.** Today the # is part of the IPA string, so a wider string does not outgrow the wider Cyrillic beside it on any column of this song. Step 2 is the change that can move columns; its rerun is the measure.
- The # sits inside the string and the string is centred: `kʌ#` at x 374.2 (`m1-1-2`), `jɑ#` at x 554.2 (`m1-5-4`), `jɑ#` at x 768.2 (`m2-1-2`), all `text-anchor="middle"`.
- Readings kept outside the repository: `step0-before.json` in the session scratchpad (every `<text>` with its x, y, anchor, and `data-ipa-of`).

## (b) The blank page after a deploy

`vercel.json:42-48` deploys only `Shane` and `main`, so this branch has no Vercel preview (review amendment 1). I reproduced it on a local static server instead, and it **reproduces locally**.

- Build A is `pnpm build` of the tree as it stands; build B is the same tree with one byte changed in the French footer string (restored afterwards; `git status` clean). Their entry files differ (`start.DrDeZ7Pk.js` and `start.DxIVOxni.js`).
- A node server on `ilya.localhost` (Chrome treats it as a secure context, and `app.html` registers the worker on any host but `localhost` and `127.0.0.1`) answers like Vercel does after a deploy: the old hashed files are gone (404), any path without an extension gets `index.html`.
- Playwright Chromium: open A once (the worker installs and stores `/`), switch the server to B, clear the HTTP cache (Dann's Chrome had no copy of the old entry), navigate to `/`.
  - **First load after B: blank.** 3 DOM nodes, no text; two 404s (`start.DrDeZ7Pk.js`, `app.BnS-z18Q.js`), served inside the old page by the worker's stored `/`.
  - **Second load: the app** (142 nodes, 702 characters of text).
- Without the cache clear, Chrome's HTTP cache (the one-year immutable rule) still held A's files and the page did not go blank. So the blank page needs a visitor whose HTTP cache no longer holds the old entry, which fits Dann's Chrome.
- What a local server cannot prove about Vercel: that Vercel removes the old hashed files on deploy (it is what Dann saw, `start.BikemZ4X.js` 404), and the CDN's own caching of `/`. Nothing in step 1 can be marked DONE until it is seen on a Vercel build (amendment 1).

## Not established

- Whether `~/Downloads/ilya-ship.sh` is what CI runs; I ran its eight gates' commands against the worktree and read the same counts.
