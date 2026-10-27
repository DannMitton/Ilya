# Report, batch C, row B2: the update check, QUEUE row 151 (r1)

Branch `cloud-lane-13`, after B1 (`eba4249`). Read and run in the Linux cloud sandbox, 2026-10-26.

## What I changed

- `apps/web/svelte.config.js:18-21`: `pollInterval` from 60_000 to 0, comment updated.
- `apps/web/src/lib/update-check.ts` (new, 90 lines): `startUpdateChecks` (the three triggers) and `refreshToNewVersion` (the probe, the cache deletion, the reload). `check`, the window, the document, `fetch`, `caches`, `reload`, and the clock are arguments.
- `apps/web/src/lib/i18n.ts:927`: one key, **`update.offline`**, beside `update.notice`, both languages, seated verbatim from `docs/sessions/addendum-batch-c-b2-string_2026-10-21.md`:
  - EN: `The new version could not be loaded. Check your connection, then press Refresh again.`
  - FR: `La nouvelle version n’a pas pu être chargée. Vérifiez votre connexion, puis appuyez de nouveau sur Actualiser.` (U+2019, no colon). In the source the accents and the apostrophe are `\u` escapes, as on the lines around it; the test pins the literal characters.
- `apps/web/src/routes/+page.svelte`: the import (`:4`), one state variable on the existing `updateDismissed` line (`:1534`), one `onMount` wiring line (`:1535`), and the toast (`:4616-4627`). The ten-line `onclick` is now one line calling `refreshToNewVersion`. The file went from 5606 to 5597 lines.
- `scripts/ratchets.json`: the `+page.svelte` ceiling lowered from 5607 to 5597 (lowered, never raised; the script's own instruction for a file that shrinks).
- `apps/web/src/lib/update-check.test.ts` (new, 15 tests).

## Verified, as the brief asked

`node_modules/@sveltejs/kit/src/runtime/client/utils.js:268` and `:297` read `if (interval) timeout = setTimeout(check, interval);`. With `pollInterval` 0 neither arms a timer, so a check on opening needs app code. `updated.check` is `stores.updated.check` at `src/runtime/app/state/client.js:67`.

## The notice and the calibration takeover

The brief said: build it only if `+page.svelte` has state that plainly says the Calibration wizard is open. Fable grepped `isRecording` and `calibrationOpen` and found none. There is such state: `let calibrating = $state(false)` (`+page.svelte:295`), set by `enterCalibration()` and cleared by `exitCalibration()` (`:1695-1700`), passed to the drawer as `takeoverActive={calibrating}` (`:3880`). I built it: the toast's condition is now `updated.current && !updateDismissed && !calibrating`, and the notice rises when the takeover closes. Cost: three tokens on an existing line.

Caveats, all unmeasured: the takeover only exists in builds with `INCLUDE_MARKUP_INSIGHTS`, so in other builds `calibrating` is never true and the guard is inert. I did not render the page, so I do not know whether the toast would have covered the wizard's buttons without the guard.

## Every caller of `updated`

`grep -rn "updated" apps/web/src --include=*.svelte --include=*.ts` (excluding `lastUpdated`, `updatedAt`, and tests) finds one importer: `+page.svelte:3` (`import { updated } from '$app/state'`), which reads `updated.current` (`:4616`) and now passes `updated.check` (`:1535`). The other hits are prose. Also searched: `pollInterval`, `version.json`, `update-toast`, and `update.notice` across `apps/web` outside `node_modules` and build output; the hits are `svelte.config.js`, `sw.js`, `i18n.ts`, `+page.svelte`, `scripts/stamp-sw.mjs` (reads `version.json`), and the new files. No other `online` listener exists in `apps/web/src`.

## Tests added, and which fail on the old tree

All 15 in `update-check.test.ts`. On the old tree: the `pollInterval` test fails (it was 60000); the two string tests fail (`[MISSING: update.offline]`); the other twelve cannot run because `update-check.ts` did not exist.

- `pollInterval` is 0: imports `svelte.config.js`.
- Mount: one check. Foreground: none at one millisecond under the hour, one at the hour, none a minute later; none when the page goes hidden. `online`: one more. After disarming, none. A rejecting `check` does not throw.
- Refresh with the probe rejecting, and with it answering not ok: `caches.delete` never called, `reload` never called, outcome `offline`. With it ok: only the `ilya-` caches deleted, then one reload. The probe URL starts with `/_app/version.json?` and differs call to call. CacheStorage refusing still reloads, as the old code did.
- A reading of `static/sw.js`: the version path is network-first with a `caches.match(request)` fallback.
- Both strings, literal characters.

**What these tests do not prove:** they inject `fetch` and the caches. They do not prove the service worker path (see below).

## Gates

Before: the baselines in the B1 report (all match the prompt).

After B2: 1 phonology 267 passed (267); 2 dictionary 248 passed (248); 3 web-check 0 errors, 12 warnings in 5 files; 4 web-test 2962 passed (2962) (2947 plus the 15 new); 5 score-parser 775 passed, 5 skipped (780); 6 blurb 145 passed (145); 7 integration 55 passed (55); 8 ratchets OK.

One honest note on gate 3: my first run showed 2 errors in my own test (`config.kit` possibly undefined). I fixed it with optional chaining in the test file only and reran web-check (0 errors, 12 warnings in 5 files) and that test file alone (15 passed). I did not rerun the other seven gates after that one-line test change, which cannot affect them.

## Done-when

1. Met.
2. Met.
3. Met, with the ratified string from the addendum (supersedes "do not add the string"). After a Refresh whose probe fails, the notice's text becomes `update.offline`, the Refresh button stays, and nothing is deleted. A later successful Refresh reloads.
4. NOT ESTABLISHED, see below.

## What I could not establish

- **The worker path, in a browser.** I did not run a browser against `sw.js`. By reading, a cache-busted `/_app/version.json` matches the worker's version branch on pathname (`sw.js:63-66`), `fetch` rejects offline, and `caches.match(request)` misses on the new query (a Cache lookup matches the query string by default; that is my reading of the platform, not something I ran), so the page's `fetch` rejects. Whether it rejects or resolves opaque in every browser is open.
- Whether an unsaved edit survives the reload.
- Whether a first open with no network works. The addendum's own correction says a start with no connection runs without the dictionary (`loader.ts:283`, `:623-631`); I did not test it.
- Whether the toast would have covered the calibration wizard.
- Whether `online` fires usefully on iOS Safari. Not tested.

## Behaviour to know

- After a failed Refresh the offline sentence stays up until the singer presses Refresh again, dismisses the notice, or reloads. The `online` event runs a check but does not clear it. Not changed; one line if Dann wants it.
- The foreground limit counts from the last check by any trigger, including `online`.
- Nothing I measured gave a reason to change the once-an-hour limit or the three triggers.

## Owed to Dann

- The Guide paragraph (B3 will name it too). Nothing else new: the one string this row needed was the addendum's.

## Cost

About 18k tokens for B2. About 157k used in the session so far.
