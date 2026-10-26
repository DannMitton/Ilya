# Fable review: brief for Code, N.195, r1 (2026-10-25)

Brief reviewed: `docs/sessions/brief-code-n195-offline-dictionary_r1_2026-10-21.md`, md5 `fb8465596203b6faad8ff8de56c8e67b` (checked in the clone at `e0f4ad9`, 2026-10-25). Every `path:line` below was read by Fable this session; nothing was run. NOT ESTABLISHED beats a complete invented answer.

## Verdict: SEND WITH AMENDMENTS

The diagnosis is right and every `loader.ts` cite reads as stated. Three things change what Code builds or measures: step 0 as written cannot run against the service worker (amendment 1); the done state names Text but the start also needs two files the brief leaves to the measure, and the tree already says how they behave offline (amendment 2); the fix the brief asks for leaves the first open with no connection, and every open where IndexedDB is refused, exactly where it is today, which the report must say in Dann's terms (amendment 3). The rest are the cross-site line against batch C, a test that cannot fail as named, and cites.

## Amendments, ranked

### 1. Step 0 cannot see the service worker from a dev server, and the brief's done state depends on it

Evidence. `apps/web/src/app.html:29-39`: on `localhost` and `127.0.0.1` the page unregisters every worker and registers none; `/sw.js` is registered only on another host. `apps/web/playwright.config.ts:50-55` starts `pnpm dev` at `http://localhost:5173`. So the brief's "online second visit (so the service worker controls the page)" never happens in the repository's Playwright set-up, and the offline reload then has no worker, no cached shell, and no cached manifest to fall back to at `sw.js:69-72`. What step 0 would record is the no-worker case, which is also the case of a singer whose worker has not installed yet. Both are worth having, but the report must say which one it measured.

The reload itself needs the shell. With no worker, an offline `page.reload()` fails at the document, before any loader code runs, and the table has nothing to fill. Playwright's `context.setOffline(true)` blocks the network at the browser, including the request to the dev server; whether Playwright's own route interception (`page.route`) can stand in for a worker is for Code to say.

Cost if not amended. Code reports "the manifest fails offline" from a run whose page never loaded, or spends the budget making the worker install on localhost against `app.html`'s own rule.

Replace step 0's first two sentences with:

> In headless Chromium (Playwright). `app.html:29-39` registers no worker on `localhost`, so the repository's set-up (`playwright.config.ts:50-55`, `pnpm dev`) never has one. Measure two ways and label each: (a) **no worker**: online visit, then `context.setOffline(true)` and a reload; expect the document itself to fail, and say so if it does; then instead keep the page open and call the loader's path again through a new navigation only if one is possible, else record the fetch failures by `page.route` on `/data/*` returning a network error while the page is up. (b) **with a worker**: serve `apps/web/build` from a static server on a hostname that is not `localhost` (an entry in `/etc/hosts` or `127.0.0.2`, whichever the lane allows), visit twice so `sw.js` controls the page, then set the context offline and reload. If (b) cannot be made to work in the lane, write NOT ESTABLISHED for the worker case and say why; the desk measures it on the alias with DevTools' offline box. Say in the table which of (a) and (b) each row came from.

### 2. The supplement and the blurb are known to fail offline without a worker, and they are in the step that must succeed

Evidence. `loader.ts:672-673`: `loadJsonFile(SUPPLEMENT_URL)` and `loadJsonFile<BlurbData>(BLURB_URL)` are awaited in `Promise.all` before the injection at `:676-679`, inside the `try` whose `catch` sets `state.error` (`:697-702`). `loadJsonFile` is a bare `fetch` (`:342-348`) with no stored copy. With a worker, both paths fall to stale-while-revalidate (`sw.js:74-87`) and are served from the `ilya-` cache if a previous online visit put them there (`:78-81` stores any 200 `basic` response). Without a worker, or before the first worker installs, they reject, and the dictionary that step 1 recovered from IndexedDB a moment earlier is thrown away with them. So step 2's "if step 0 shows them failing" is already answered for case (a): they fail. The brief's DESK DEFAULT (keep the last good text, read it only when the fetch rejects) is right; it is not conditional.

Also `loadJsonFile` loses the shape of the failure: a rejected `fetch` and a non-ok response both throw an `Error` (`:344-346`), so "read it only when the fetch itself rejects" needs the function to tell the two apart. The brief says the right thing and does not say where.

Replace step 2's first sentence with: "The supplement and the blurb fail offline whenever no worker serves them (`loader.ts:342-348`, `:672-673`; `app.html:29-39`), and their failure is fatal to the start (`:697-702`). Give each the stored-copy treatment unconditionally: store the parsed JSON under a fixed key in the same `cache` store after a successful fetch; on a rejected `fetch` (the promise rejects), read the stored copy; on a response that is not `ok`, throw as today. Split `loadJsonFile` so the two failures are distinguishable, and test both."

### 3. The row's own wall: the first open with no connection, and any open where IndexedDB is refused, stays dark and silent, and the brief must say so to Dann

Evidence. Dann's words were "they don't need internet connectin to work" (brief §1). After this row, a browser that has never opened Ilya online still has nothing to load (no manifest, no chunks), and a browser whose IndexedDB is unavailable (the loader's own header: "IndexedDB unavailable (private browsing) → skips caching", `loader.ts:40`; `setCacheChunked` and `getCachedChunked` swallow every error, `:155-157`, `:209-211`) stores nothing and will fail offline every time. What the singer then sees: the drawer shows nothing about the failure (`AnalysisStation.svelte:86-104` draws the progress bar while `isLoading` and otherwise the "Select a word" hint; grep for a `dict.error` string: none), the Text page shows `'quiet'` for a poem when `error` is set (`one-action.ts:152-159`, pinned at `one-action.test.ts:153`), and no line is drawn because `entryCount === 0` (`+page.svelte:437`, `:464`, `:1661`). The console line "[Ilya] Dictionary loading failed" (`loader.ts:698`) is the only witness. The brief's §4 names a notice as a separate row; right. But the report's "What Text shows" (step 5) must be framed as the two cases this row does not reach, so Dann can rule the notice knowing who it is for.

Replace step 5 with: "**Step 5, the page, report only.** Report what a singer sees when the dictionary fails to load: the Text page (`one-action.ts:152-159` returns `'quiet'` when `error` is set), the drawer (`AnalysisStation.svelte:86-104`), and the console. Then name the two cases this row leaves there on purpose: a first open with no connection, and any browser where IndexedDB refuses the store (`loader.ts:40`, `:155-157`, `:209-211`). Do not change `+page.svelte`; the notice is Dann's."

### 4. The cross-site line against batch C: name what B2's Refresh does to the stored dictionary, and what this row does to B2's probe

Evidence. Batch C r2, B2 (`brief-code-batch-c_r2_2026-10-21.md:42-44`): a new module `apps/web/src/lib/update-check.ts` (not yet in the tree; `ls` this session), a probe of `/_app/version.json` with a cache-busting query, and the Refresh deleting the `ilya-` caches only when the probe is `ok`. Two crossings:

- B2's Refresh deletes `caches` entries (`+page.svelte:4625-4628` today). It never touches IndexedDB, so the `dict-*` chunks and the manifest N.195 stores survive a Refresh. Say so; Code otherwise wonders whether to clear them.
- N.195's stored manifest makes an offline start succeed. B2 then has a page that is up, offline, with `updated.current` possibly true from a previous online check; its Refresh probe fails and leaves the notice up (B2 done-when 2 and 3). No conflict, but the two sit on the same screen, and the report records the sequence once.
- The hash. `cleanLegacyCache(manifest.hash)` (`loader.ts:240-275`) deletes every `dict-` and `gloss-` key not under the current hash (`:257-263`). If the stored manifest is written late (after the chunks) and `cleanLegacyCache` runs early (`:645`, before the chunks are fetched), then on a hash change online the order is: clean old keys, fetch new chunks, write new chunks, write new manifest. Between the first and last step a crash leaves no complete dictionary and an old stored manifest pointing at deleted keys; `getCachedChunked` returns `null` for a missing meta (`:183-195`), and the offline path then falls to today's error. That is the right failure, and step 1's "verify that `getCachedChunked` returns `null` for an incomplete write" is answered at `:195` (no meta) and `:204` (a missing chunk). Keep the verification as a confirmation and cite both lines.

Add to §4 after the batch C sentence: "B2's Refresh deletes `caches` entries only (`+page.svelte:4625-4628`; r2 keeps that scope) and never IndexedDB, so the stored dictionary and manifest survive a Refresh. Record in the report the sequence: offline start from the stored manifest, then a Refresh pressed offline leaves B2's notice up. `getCachedChunked` returns `null` on a missing meta (`loader.ts:195`) and on a missing chunk (`:204`); confirm by reading and cite."

### 5. Test (d) cannot fail as named, and (a) needs the write order pinned

Evidence. `cleanLegacyCache` runs today (`:645`) and already deletes stale keys (`:257-263`), so a test that "the stale entries are cleaned as `cleanLegacyCache` does today" passes on the unchanged tree. The part of (d) that can fail is "a new hash online replaces the stored manifest". For (a), "stores the manifest after the dictionary" is only testable if the test can observe order: the brief's reason (a stored hash must point at a complete dictionary) is a property of the sequence, so the test asserts that the manifest key is absent while a chunk write is pending and present after the meta write, or that the manifest write awaits `setCacheChunked`, which today is fire-and-forget (`:738`, `:751`: not awaited).

That last point is a design fact the brief does not state: `setCacheChunked` is not awaited anywhere, so "after the dictionary has loaded and its chunks are written" requires either awaiting it (changing the start's timing on a cache miss, against §4's "the online path does not change") or chaining the manifest write onto its promise without awaiting the chain. Code chooses; the brief names the constraint.

Replace step 4 (a) and (d) with: "(a) a good start writes the manifest only after `setCacheChunked` resolves for the last file (`:738`, `:751` are not awaited today; chain the manifest write onto that promise without making the start wait for it, and test the order with a fake IndexedDB that records write sequence); (d) a new hash online replaces the stored manifest with the new one, and the old `dict-` keys are gone after `cleanLegacyCache` (the second clause passes today; the first is the one that fails before the change)."

### 6. `CACHE_HASH_KEY`: close the lead

Evidence. `loader.ts:65` declares `CACHE_HASH_KEY = 'ilya-dict-hash'`; grep of `apps/web/src` this session finds no other use, and the legacy cleanup list `LEGACY_CACHE_KEYS` (`:88`) does not include it, so nothing ever wrote or deletes it. Storing the whole manifest object (not the hash alone) is what the gloss tier needs (`:468`, `glossFiles`). The brief's "reuse or remove" is right; a DESK DEFAULT saves Code the choice: a new key `ilya-dict-manifest` for the object, `CACHE_HASH_KEY` removed, and the removal said in the report.

### 7. Cites

- `sw.js:55` is the dictionary guard (`includes('dictionary.')` and `endsWith('.json')`), so the gloss files `dictionary.86d83340-gloss-a.json` are also never intercepted (`data/dictionary-manifest.json`, read this session); offline, the gloss tier is IndexedDB or nothing, which step 3 says. `:60` `/omr/`; `:63-66` version probe; `:69-72` manifest; `:74-87` stale-while-revalidate. The header comment on the waiting worker is `:16-19`.
- The brief's "a cache that nothing fills" for the manifest branch: right. `caches.match(request)` at `:70` searches every cache, and nothing puts the manifest in one, because `:69-72` returns before `:74-87`.
- `loader.ts:592-594` for "inference mode": the lines are `:44` (header) and `:604-605` (the doc comment on `loadDictionary`). The page's lines read otherwise, as the brief says.
- `loader.ts` 754 lines, no ratchet entry: right (`scripts/ratchets.json` read). `+page.svelte` 5606 of 5607: right.
- `fake-indexeddb` is a devDependency (`apps/web/package.json`) and used by `library/driver.idb.test.ts`; the loader's `openDB` (`:131-142`) reads the global `indexedDB`, so the fake can be installed on `globalThis` in the test. `openDB` is not exported (`loader.ts` exports: `LoaderState`, `LoaderCallbacks`, `mergeGlossTier`, `installHomographEntries`, `loadDictionary`); the tests drive `loadDictionary` with a mocked global `fetch`. Say so, so Code does not export internals.
- The library's own database is `ilya-library` (`library/driver.ts:409`), separate from `ilya-data`; nothing else opens `ilya-data` (grep this session). The cross-site list of IndexedDB readers is therefore `loader.ts` alone.

## Checks that passed

- Every `loader.ts` cite in §2 (`:283`, `:623-628`, `:631`, `:645`, `:468-472`, `:578-584`, `:509`, `:717-726`, `:179`, `:695` is `:697-702`) reads as stated.
- The design: store late, read on failure, go on from `:631` unchanged. The online path keeps `cache: 'no-cache'` (`:284`). Right.
- Not changing `sw.js`: right, and for the reason given (`:16-19`).
- The `+page.svelte` sites `:437`, `:464`, `:1661`, `:2550`, `:2592`: as stated.
- No strings, no French. Right.

## Where would this wall a singer in

- Amendment 3: the first open offline and every private-mode open stay dark with no word on screen. This row does not cause it and does not fix it; the notice is Dann's.
- Amendment 2 as unamended: a singer with a stored dictionary and no worker would still see nothing, because two small JSON files failed. Fixed by making step 2 unconditional.
- A singer whose stored manifest points at a dictionary that a later online visit half-replaced: today's error, and the next online visit heals it. No wall.

## Questions for Dann

None in this row. The notice for a dictionary that did not load is already named as his, in a separate row; the report (amendment 3) gives him the two cases it would serve.

## What I could not establish

- Whether the lane can serve `apps/web/build` on a non-localhost name so the worker installs (the build's own `fetch-omr-models.mjs` reaches GitHub; whether it skips when offline is NOT READ beyond its `existsSync` guard at `:129`).
- Whether `context.setOffline(true)` in Playwright lets a controlling worker answer a reload from cache (expected, not run).
- Whether `fake-indexeddb` records write order in a way the (a) test can read.
- The eight gate baselines at Code's start.
