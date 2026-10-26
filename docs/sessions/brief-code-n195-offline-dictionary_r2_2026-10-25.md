# Brief r2: N.195, the dictionary starts with no connection (2026-10-25)

Written by the desk (Sonnet) 2026-10-21 about 21:4x; r2 written 2026-10-25. Fable-reviewed 2026-10-25 (`../sessions/review-fable-brief-n195_r1_2026-10-25.md`), all 7 amendments applied (`CONTRACT.md` section 1 item 19). It waits for Dann's say-so. N.195 is a DESK DEFAULT number, offered by the desk and ruled in by Dann.

For Code in a cloud session, Sonnet, on a lane cut from `Shane` by Dann. It has no dependency on batch C, N.194, or row 134, but read section 4's cross-site line against batch C's update check before you start. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code carries a `path:line` the desk or Fable read (2026-10-21 and 2026-10-25), or says NOT ESTABLISHED or NOT READ. Do not write with git beyond one commit per step on the lane; no pull request; no other branch; no brief file in any commit.

Cost, a range and not measured: about 100k to 300k Sonnet tokens.

## 1. The need and the done state

Dann 2026-10-21 21:16: *"The dictionary and the reader are both part of the app, they don't need internet connectin to work. Verify."* After the desk showed that the dictionary does not start offline, Dann 21:20: *"I'm perplexed that it doesn't already work this way. Make it so."* (both transcribed as written).

Done when: a browser that has opened Ilya online before, and is then opened with no connection, loads the stored dictionary, and Text transcribes a song. A test shows it. The start also needs the singer's supplement and the blurb (section 2), so the done state includes them (step 2).

This row does not reach two cases, and the report says so to Dann (step 5): a first open with no connection, and any browser where IndexedDB refuses the store.

## 2. What the desk read (read, not run)

- Every start calls `fetchManifest()` first, with `cache: 'no-cache'` (declared at `apps/web/src/lib/loader.ts:282`, the fetch at `:283-284`, called in `loadDictionary` at `:623`). A failure throws "Could not load dictionary manifest" (`:624-628`), and the outer catch records it as the loader's error (`:695-702`).
- The stored dictionary's key is built from the manifest's hash, `dict-${manifest.hash}` (`:631`), and `loadDictionaryData` reads IndexedDB before it fetches (`:717-726`, `getCachedChunked` at `:179`). With no manifest there is no key, so the stored copy is never read.
- `CACHE_HASH_KEY = 'ilya-dict-hash'` is declared at `loader.ts:65` and used nowhere else in `apps/web/src` (grep, 2026-10-21 and 2026-10-25). The legacy cleanup list `LEGACY_CACHE_KEYS` (`:93`) does not include it, so nothing ever wrote it or deletes it.
- The gloss tier reads IndexedDB first under `gloss-${manifest.hash}-part${i}` and fetches only on a miss (`:470-472`); it needs the manifest object for `glossFiles` (`:468`, `:578-584`). Its failures are non-fatal.
- The singer's supplement and the blurb data load by `loadJsonFile`, a plain `fetch` with no stored copy (`:342-348`, used at `:672-673`). Both are awaited in a `Promise.all` before the injection at `:676-679`, inside the `try` whose `catch` sets `state.error` (`:697-702`), so their failure is fatal to the start and throws away a dictionary recovered from IndexedDB a moment earlier. With a service worker, both paths fall to stale-while-revalidate (`apps/web/static/sw.js:74-87`) and are served from the `ilya-` cache if an earlier online visit stored them (`:78-81` stores any 200 `basic` response). Without a worker, or before the first worker installs, they reject. `loadJsonFile` throws an `Error` both for a rejected `fetch` and for a response that is not ok (`:344-346`), so it does not tell the two apart.
- The homograph tier fetches `/data/homographs.json` every start with no stored copy (`:509`); its failure is non-fatal by design.
- The service worker skips `dictionary.*.json` (`sw.js:55`: the path includes `dictionary.` and ends with `.json`), so the gloss files (for example `dictionary.86d83340-gloss-a.json`, per `data/dictionary-manifest.json`) are also never intercepted: offline, the gloss tier is IndexedDB or nothing. It skips `/omr/` (`:60`); its version probe is `:63-66`; its manifest branch is network-first with a fallback to `caches.match` (`:69-72`, the match at `:70`), a cache that nothing fills, because `:69-72` returns before the stale-while-revalidate branch (`:74-87`) can store the manifest. Everything else is stale-while-revalidate. The header comment of `sw.js` says a new worker waits until every client is gone (`sw.js:16-19`).
- The page registers the worker only off `localhost` and `127.0.0.1`: on those hosts it unregisters every worker and registers none (`apps/web/src/app.html:29-39`). The repository's Playwright set-up starts `pnpm dev` at `http://localhost:5173` (`apps/web/playwright.config.ts:50-55`), so it never has a worker.
- The page treats a dictionary that did not load as no dictionary: `loaderState.entryCount === 0` returns no lines at `apps/web/src/routes/+page.svelte:437`, `:464`, and `:1661`, and `dictionaryReady` is false at `:2550` and `:2592`. The comments at `loader.ts:44` (header) and `:604-605` (the doc comment on `loadDictionary`) say the app then runs in inference mode; the page's lines read otherwise. What a singer sees is NOT ESTABLISHED (not run); step 5 reports it.
- `loader.ts` has 754 lines and no entry in `scripts/ratchets.json` (the 1000-line limit for a file without a ceiling applies); `apps/web/src/routes/+page.svelte` stands at ceiling 5607 with the file at 5606 lines (`scripts/ratchets.json:8`). A test file exists: `apps/web/src/lib/loader.test.ts`.
- `loader.ts` exports `LoaderState`, `LoaderCallbacks`, `mergeGlossTier`, `installHomographEntries`, and `loadDictionary`; `openDB` (`:131-142`, which reads the global `indexedDB`) is not exported. `fake-indexeddb` is a devDependency (`apps/web/package.json:36`) and is used by `library/driver.idb.test.ts`. The library's own database is `ilya-library` (`library/driver.ts:409`), separate from `ilya-data` (`loader.ts:58`); nothing else opens `ilya-data`, so the IndexedDB readers of this store are `loader.ts` alone.

## 3. Steps

**Step 0, measure, change nothing.** In headless Chromium (Playwright). `app.html:29-39` registers no worker on `localhost`, so the repository's set-up (`playwright.config.ts:50-55`, `pnpm dev`) never has one. Measure two ways and label each: (a) **no worker**: online visit, then `context.setOffline(true)` and a reload; expect the document itself to fail, and say so if it does; then instead keep the page open and call the loader's path again through a new navigation only if one is possible, else record the fetch failures by `page.route` on `/data/*` returning a network error while the page is up. (b) **with a worker**: serve `apps/web/build` from a static server on a hostname that is not `localhost` (an entry in `/etc/hosts` or `127.0.0.2`, whichever the lane allows), visit twice so `sw.js` controls the page, then set the context offline and reload. If (b) cannot be made to work in the lane, write NOT ESTABLISHED for the worker case and say why; the desk measures it on the alias with DevTools' offline box. Say in the table which of (a) and (b) each row came from.

The reload itself needs the shell. With no worker, an offline `page.reload()` fails at the document, before any loader code runs, and the table has nothing to fill; that is a finding, and the report states it. Whether Playwright's own route interception (`page.route`) can stand in for a worker is for Code to say.

Record, for each of the manifest, the dictionary parts, the supplement, the blurb, the gloss tier, and the homograph tier, whether it loaded, from where, and the error if not. Record what the page shows for a fixture song: `entryCount`, and whether Text draws any line. Report this table before you change code. If the repository's Playwright set-up cannot take a context offline, say so and use what it can.

**Step 1, the manifest.** After the dictionary has loaded and its chunks are written to IndexedDB (not when the manifest is fetched), store the manifest that produced them in the same `cache` store. DESK DEFAULT, his to wave off: a new key `ilya-dict-manifest` holds the whole manifest object (the gloss tier needs `glossFiles`, `:468`, not the hash alone); `CACHE_HASH_KEY` (`:65`) is removed, and the report says so. When `fetchManifest()` fails, read the stored manifest and go on from `:631` unchanged; if none is stored, the current error stands. The reason for storing it late: a stored hash must point at a complete dictionary.

`setCacheChunked` is not awaited anywhere (`loader.ts:738` and `:751` call it without `await`), so "after the chunks are written" needs a choice. Awaiting it changes the start's timing on a cache miss, against section 4's "the online path does not change"; the other path chains the manifest write onto its promise without making the start wait for it. Code chooses and says which.

Confirm by reading, and cite, that `getCachedChunked` returns `null` for an incomplete write: on a missing meta (`loader.ts:192`) and on a missing chunk (`:204`). On a hash change online the order is: `cleanLegacyCache` removes the old keys (`:645`, `:240-275`, the stale test at `:257-262`), the new chunks are fetched and written, then the new manifest is written. A crash between the first and last leaves an old stored manifest pointing at deleted keys; `getCachedChunked` then returns `null` and the offline path falls to today's error, which is the right failure.

**Step 2, the two JSON files.** The supplement and the blurb fail offline whenever no worker serves them (`loader.ts:342-348`, `:672-673`; `app.html:29-39`), and their failure is fatal to the start (`:697-702`). Give each the stored-copy treatment unconditionally: store the parsed JSON under a fixed key in the same `cache` store after a successful fetch; on a rejected `fetch` (the promise rejects), read the stored copy; on a response that is not `ok`, throw as today. Split `loadJsonFile` so the two failures are distinguishable, and test both. DESK DEFAULT, his to wave off.

**Step 3, the tiers.** The gloss tier works from the stored manifest with no change. The homograph tier is report only: say what step 0 shows. Its failure is non-fatal and stays so.

**Step 4, tests.** In `loader.test.ts`, with a mocked global `fetch` and `fake-indexeddb` installed on `globalThis` (the tests drive the exported `loadDictionary`; do not export `openDB` or other internals): (a) a good start writes the manifest only after `setCacheChunked` resolves for the last file (`:738`, `:751` are not awaited today; chain the manifest write onto that promise without making the start wait for it, and test the order with a fake IndexedDB that records write sequence); (b) a failed manifest with a stored one loads the dictionary from IndexedDB; (c) a failed manifest with none stored gives today's error; (d) a new hash online replaces the stored manifest with the new one, and the old `dict-` keys are gone after `cleanLegacyCache` (the second clause passes today; the first is the one that fails before the change); (e) the supplement and the blurb: a rejected `fetch` reads the stored copy, and a response that is not ok throws. Add the offline browser test of step 0 as an end-to-end test if the repository's set-up can hold it; if not, say why. State which tests failed before the change.

**Step 5, the page, report only.** Report what a singer sees when the dictionary fails to load: the Text page (`apps/web/src/lib/one-action.ts:152-159` returns `'quiet'` when `error` is set), the drawer (`apps/web/src/lib/components/Drawer/AnalysisStation.svelte:84-106` draws the progress bar while `isLoading` and otherwise the "Select a word" hint; there is no string for the error), and the console (`loader.ts:698`, "[Ilya] Dictionary loading failed", the only witness). Then name the two cases this row leaves there on purpose: a first open with no connection, and any browser where IndexedDB refuses the store (`loader.ts:43`, `:174`, `:209-210`). Do not change `+page.svelte`; the notice is Dann's.

## 4. Constraints and the cross-site line

- The online path does not change: the manifest is fetched first and with `cache: 'no-cache'`, because a new hash is how a new dictionary is noticed.
- Do not change `sw.js` in this row. A changed worker reaches a singer only after the old worker's clients are gone (`sw.js:16-19`), so the fix lives in the loader.
- This row changes how the start decides which dictionary to load. Every other site that reads the manifest, and what depended on them agreeing: `sw.js:69-72` (unchanged); the gloss tier (`loader.ts:468`, `:578-584`), which needs `glossFiles` in the stored manifest; `cleanLegacyCache(manifest.hash)` (`:645`), which keeps entries by hash; and batch C's update check (`apps/web/src/lib/update-check.ts`, a new module that is not yet in the tree, `ls` 2026-10-25; batch C r2 B2 describes it), which Code reads and reports on: does an offline start interact with it? The IndexedDB keys `dict-<hash>` and `gloss-<hash>-part<i>` all derive from one hash, and the stored manifest's hash must be the one under which those keys were written.
- B2's Refresh deletes `caches` entries only (`+page.svelte:4625-4628`; batch C r2 keeps that scope) and never IndexedDB, so the stored dictionary and manifest survive a Refresh. Record in the report the sequence: offline start from the stored manifest, then a Refresh pressed offline leaves B2's notice up (B2's probe fails, and its Refresh keeps the caches). `getCachedChunked` returns `null` on a missing meta (`loader.ts:192`) and on a missing chunk (`:204`); confirm by reading and cite.
- No strings and no French. If the page shows nothing when the dictionary is missing, a notice is Dann's to word, and it is a separate row.
- `loader.ts` stays under 1000 lines; do not add a ratchet entry and do not raise a ceiling.
- Run all eight gates before and after, and report each. The baselines are NOT ESTABLISHED until you read them at your start.

## 5. Report

`docs/sessions/report-code-n195-offline-dictionary_r1_2026-10-21.md`, with: what you changed (files and `path:line`); the table of step 0 and the same table after, each row labelled (a) or (b); the tests added and which failed before the change; the eight gates before and after; what a singer sees (step 5), framed as the two cases this row does not reach; the sequence of section 4's offline start and Refresh; and a section "What I could not establish" (every NOT ESTABLISHED and NOT READ above, closed or still open).

## 6. Owed to Dann

- Owed to Dann: the notice for a dictionary that did not load. It is a separate row and his to word; the report (step 5) gives him the two cases it would serve. Nothing is decided here.
- DESK DEFAULTS in this brief, his to wave off: the key `ilya-dict-manifest` and the removal of `CACHE_HASH_KEY` (step 1); the stored-copy treatment of the supplement and the blurb (step 2).

## Appendix: amendments of the Fable review

| Amendment | Applied | Where in r2 |
|---|---|---|
| 1. Step 0 cannot see the service worker from a dev server | yes | section 2 (worker bullet); section 3, step 0 |
| 2. Supplement and blurb fail offline and are fatal | yes | section 2 (supplement bullet); section 3, step 2; section 3, step 4 (e) |
| 3. The first offline open and refused IndexedDB stay dark | yes (the notice itself: owed to Dann) | section 1; section 3, step 5; section 5; section 6 |
| 4. Cross-site line against batch C | yes | section 4 (third and fourth bullets); section 3, step 1 |
| 5. Test (d) cannot fail as named; (a) needs the write order pinned | yes | section 3, step 1 (last two paragraphs); section 3, step 4 (a), (d) |
| 6. `CACHE_HASH_KEY`: close the lead | yes (DESK DEFAULT, his to wave off) | section 2 (third bullet); section 3, step 1; section 6 |
| 7. Cites | yes | section 2 (worker, tier, exports, ratchet bullets); section 3, step 4 |

## What I could not establish

From the review (Fable, 2026-10-25), still open:

- Whether the lane can serve `apps/web/build` on a non-localhost name so the worker installs (the build's own `fetch-omr-models.mjs` reaches GitHub; whether it skips when offline is NOT READ beyond its `existsSync` guard at `:129`).
- Whether `context.setOffline(true)` in Playwright lets a controlling worker answer a reload from cache (expected, not run).
- Whether `fake-indexeddb` records write order in a way the test (a) can read.
- The eight gate baselines at Code's start.

From the desk at r2:

- Cites where the desk's reading of the clone at `e0f4ad9` differs from the review's numbers, and the desk's numbers are used above: the header line "IndexedDB unavailable" is `loader.ts:43` (review: `:40`); `setCacheChunked`'s swallowing catch is `:174` (review: `:155-157`) and `getCachedChunked`'s is `:209-210` (review: `:209-211`); the missing-meta return is `:192` (review: `:195`); `LEGACY_CACHE_KEYS` is `:93` (review: `:88`); the stale-key test is `:257-262` (review: `:257-263`).
- What a singer sees when the dictionary fails (not run); step 5 reports it.
- Whether the `tests/` folder of the root `vitest.config.ts` (which includes only `tests/**/*.test.ts`) is run by any of the eight gates: NOT READ, not needed here because `loader.test.ts` sits in `apps/web/src/lib`.
