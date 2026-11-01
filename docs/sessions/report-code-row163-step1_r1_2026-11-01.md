# Report: row 163, step 1 (the first open after a deploy)

2026-11-01, Code (Sonnet), branch `mac-row163`, on top of the step 0 commit `7981f438`. Review amendments 1 to 4 applied; `vercel.json` and `vercel-headers.test.ts` are untouched.

## What changed

- `apps/web/static/sw.js`: a navigation (`request.mode === 'navigate'`) and `/` itself are fetched from the network first. If the network fails, rejects, or takes longer than 3 s (`NAVIGATE_WAIT_MS`, the review's DESK DEFAULT), the stored page serves; for a path with no stored page it is the stored `/` (the SPA shell, `svelte.config.js` `fallback: 'index.html'`). A reply that loses the race still lands in the cache (`event.waitUntil`). A non-200 reply from the network is not served when a stored page exists. Everything else stays stale-while-revalidate. `skipWaiting` and `clients.claim` are still absent. `__BUILD_VERSION__` and `/*__HEIF_CHUNKS__*/` are untouched.
- `apps/web/src/app.html`: a script in the head, ahead of the app, listens for `unhandledrejection` (messages naming a failed dynamic import: Chrome "Failed to fetch dynamically imported module", Firefox "error loading dynamically imported module", Safari "Importing a module script failed") and for a failed `<script>` or `<link>` under `/_app/immutable/`. It reloads the page once, guarded by `sessionStorage` key `ilya-chunk-reload`; every read and write is in try/catch, and where storage throws it does nothing. No server stand-in, no `vercel.json` change, nothing cached (amendment 2, a DESK DEFAULT on mechanism, Dann's to overrule).
- `apps/web/src/lib/update-check.ts`: the comment at `:57-66` now says the shell is network-first and the files under it are still stale-while-revalidate, so dropping the caches stays right. No code change; `update-check.test.ts` is green.
- `apps/web/src/lib/sw-shell.test.ts` (new, 8 tests): runs `sw.js` in a stub scope.

## Proved, on the local server of step 0 (same two builds' shape, rebuilt with this step)

| Run | Before (step 0) | After |
|---|---|---|
| Open build A once, deploy B (old files 404), clear HTTP cache, navigate | blank, 3 DOM nodes, two 404s | the app, 142 nodes, no console errors |
| Second navigation | the app | the app |
| Offline reload after A was controlled | not measured | the app (142 nodes), from the stored page |
| Page request held 6 s | not measured | the app from the stored page at 3.1 s |
| Stale page that names a removed entry, worker blocked, served once | blank | reloads once, then the app; flag `1` |
| The same stale page served on every request | blank | reloads **once** (two page requests in all), then nothing, no loop |

## What this does not prove, and what it cannot reach

- **Not DONE.** `vercel.json:42-48` deploys only `Shane` and `main`; nothing here has been seen on a Vercel build (amendment 1). A local server cannot show that Vercel removes old hashed files on deploy (Dann's 404 says it does), what the CDN does with `/`, or how Vercel orders `headers`.
- **A worker already installed in a colleague's browser is the old worker.** It will serve its stored `/` once more after the first deploy that carries this change, and the guard in the new `app.html` is not in that stored page. The blank page ends for them on the second load, as today; it is gone from the deploy after that. The server stand-in of the ruling (`OPEN.md:3329`) would reach them too; amendment 2 left it as a second commit with a Vercel-deployed proof, which this branch cannot give. NOT ESTABLISHED: how many singers hold a worker from before this change.
- The reload flag lasts for the tab's session, so a second blank page in the same tab session after a later deploy does not reload by itself. DESK DEFAULT, from the brief's "once"; a time window would cover it at the cost of a possible slow loop.
- The Playwright suite (`e2e/offline-dictionary.test.ts`, `e2e/heic-offline.test.ts` exercise the worker) was not run here; CI is its record.

## Gates

Gates 3, 4, and 8 run after this step (gates 1, 2, 5, 6, 7 read no file this step touched; they run in full at the end):

| Gate | Baseline | Now |
|---|---|---|
| 3 web check | 0 errors, 12 warnings, 5 files | same |
| 4 web test | 3718 passed, 1 skipped (3719) | **3726 passed, 1 skipped (3727)** (+8, `sw-shell.test.ts`) |
| 8 ratchets | OK | OK |

`ilya-ship.sh` gate 4 baseline needs `3726 passed | 1 skipped (3727)` once this lands (the desk's to move).
