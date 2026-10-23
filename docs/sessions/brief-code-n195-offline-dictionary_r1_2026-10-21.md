# Brief r1: N.195, the dictionary starts with no connection (2026-10-21)

Written by the desk (Sonnet) 2026-10-21 about 21:4x. NOT Fable-reviewed; it waits for Sunday 2026-10-25 05:00 and Dann's say-so (`CONTRACT.md` section 1 item 19). N.195 is a DESK DEFAULT number, offered by the desk and ruled in by Dann.

For Code in a cloud session, Sonnet, on a lane cut from `Shane` by Dann. It has no dependency on batch C, N.194, or row 134, but read section 4's cross-site line against batch C's update check before you start. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code carries a `path:line` the desk read on 2026-10-21, or says NOT ESTABLISHED or NOT READ. Do not write with git beyond one commit per step on the lane; no pull request; no other branch; no brief file in any commit.

Cost, a range and not measured: about 100k to 300k Sonnet tokens.

## 1. The need and the done state

Dann 2026-10-21 21:16: *"The dictionary and the reader are both part of the app, they don't need internet connectin to work. Verify."* After the desk showed that the dictionary does not start offline, Dann 21:20: *"I'm perplexed that it doesn't already work this way. Make it so."* (both transcribed as written).

Done when: a browser that has opened Ilya online before, and is then opened with no connection, loads the stored dictionary, and Text transcribes a song. A test shows it.

## 2. What the desk read (read, not run)

- Every start calls `fetchManifest()` first, with `cache: 'no-cache'` (`apps/web/src/lib/loader.ts:283`, called in `loadDictionary` at `:623`). A failure throws "Could not load dictionary manifest" (`:624-628`), and the outer catch records it as the loader's error (`:695`).
- The stored dictionary's key is built from the manifest's hash, `dict-${manifest.hash}` (`:631`), and `loadDictionaryData` reads IndexedDB before it fetches (`:717-726`, `getCachedChunked` at `:179`). With no manifest there is no key, so the stored copy is never read.
- `CACHE_HASH_KEY = 'ilya-dict-hash'` is declared at `loader.ts:65` and used nowhere else in the file (grep, 2026-10-21).
- The gloss tier reads IndexedDB first under `gloss-${manifest.hash}-part${i}` and fetches only on a miss (`:470-472`); it needs the manifest object for `glossFiles` (`:468`, `:578-584`). Its failures are non-fatal.
- The singer's supplement and the blurb data load by `loadJsonFile`, a plain `fetch` with no stored copy (`:342`, used at `:672-673`, inside the step that must succeed before the dictionary is injected). Whether this fails offline depends on the service worker having cached them: NOT ESTABLISHED.
- The homograph tier fetches `/data/homographs.json` every start with no stored copy (`:509`); its failure is non-fatal by design.
- The service worker skips `dictionary.*.json` (`apps/web/static/sw.js:55`) and `/omr/` (`:60`), and its manifest branch is network-first with a fallback to `caches.match` (`:69-70`), a cache that nothing fills: the manifest is never put in a cache by that branch. Everything else is stale-while-revalidate. The header comment of `sw.js` says a new worker waits until every client is gone (the lines were not numbered by the desk; cite them).
- The page treats a dictionary that did not load as no dictionary: `loaderState.entryCount === 0` returns no lines at `apps/web/src/routes/+page.svelte:437`, `:464`, and `:1661`, and `dictionaryReady` is false at `:2550` and `:2592`. The comment at `loader.ts:592-594` says the app then runs in inference mode; the page's lines read otherwise. What a singer sees is NOT ESTABLISHED (not run).
- `loader.ts` has 754 lines and no entry in `scripts/ratchets.json` (the 1000-line limit for a file without a ceiling applies); `apps/web/src/routes/+page.svelte` stands at ceiling 5607 (`scripts/ratchets.json:8`). A test file exists: `apps/web/src/lib/loader.test.ts`.

## 3. Steps

**Step 0, measure, change nothing.** In headless Chromium (Playwright) against a local build, run: online first visit; online second visit (so the service worker controls the page); then the context offline and a reload. Record, for each of the manifest, the dictionary parts, the supplement, the blurb, the gloss tier, and the homograph tier, whether it loaded, from where, and the error if not. Record what the page shows for a fixture song: `entryCount`, and whether Text draws any line. Report this table before you change code. If the repository's Playwright set-up cannot take a context offline, say so and use what it can.

**Step 1, the manifest.** After the dictionary has loaded and its chunks are written to IndexedDB (not when the manifest is fetched), store the manifest that produced them in the same `cache` store. Choose the key and say whether you reused `CACHE_HASH_KEY` or removed it. When `fetchManifest()` fails, read the stored manifest and go on from `:631` unchanged; if none is stored, the current error stands. The reason for storing it late: a stored hash must point at a complete dictionary. Verify that `getCachedChunked` returns `null` for an incomplete write, and report what you found.

**Step 2, the two JSON files.** If step 0 shows the supplement or the blurb failing offline, give each the same treatment: keep the last good text, and read it only when the fetch itself rejects. A server answer that is not ok stays an error. DESK DEFAULT, his to wave off.

**Step 3, the tiers.** The gloss tier works from the stored manifest with no change. The homograph tier is report only: say what step 0 shows. Its failure is non-fatal and stays so.

**Step 4, tests.** In `loader.test.ts`, with a mocked `fetch` and a fake IndexedDB: (a) a good start stores the manifest after the dictionary; (b) a failed manifest with a stored one loads the dictionary from IndexedDB; (c) a failed manifest with none stored gives today's error; (d) a new hash online replaces the stored manifest and the stale entries are cleaned as `cleanLegacyCache` does today (`:645`). Add the offline browser test of step 0 as an end-to-end test if the repository's set-up can hold it; if not, say why.

**Step 5, the page, report only.** Report what Text shows when the dictionary fails to load, online or off. Do not change `+page.svelte` in this row.

## 4. Constraints and the cross-site line

- The online path does not change: the manifest is fetched first and with `cache: 'no-cache'`, because a new hash is how a new dictionary is noticed.
- Do not change `sw.js` in this row. A changed worker reaches a singer only after the old worker's clients are gone, so the fix lives in the loader.
- This row changes how the start decides which dictionary to load. Every other site that reads the manifest, and what depended on them agreeing: `sw.js:69-70` (unchanged); the gloss tier (`loader.ts:468`, `:578-584`), which needs `glossFiles` in the stored manifest; `cleanLegacyCache(manifest.hash)` (`:645`), which keeps entries by hash; and batch C's update check (`apps/web/src/lib/update-check.ts`, NOT READ by the desk), which Code reads and reports on: does an offline start interact with it? The IndexedDB keys `dict-<hash>` and `gloss-<hash>-part<i>` all derive from one hash, and the stored manifest's hash must be the one under which those keys were written.
- No strings and no French. If the page shows nothing when the dictionary is missing, a notice is Dann's to word, and it is a separate row.
- `loader.ts` stays under 1000 lines; do not add a ratchet entry and do not raise a ceiling.
- Run all eight gates before and after, and report each.

## 5. Report

`docs/sessions/report-code-n195-offline-dictionary_r1_2026-10-21.md`, with: what you changed (files and `path:line`); the table of step 0 and the same table after; the tests added and which failed before the change; the eight gates before and after; and a section "What I could not establish" (every NOT ESTABLISHED and NOT READ above, closed or still open).
