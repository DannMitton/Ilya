# Brief r2: N.196, security headers for Ilya (2026-10-25)

Written by the desk (Sonnet) 2026-10-22 about 22:2x; r2 written 2026-10-25. Fable-reviewed 2026-10-25 (`../sessions/review-fable-brief-n196_r1_2026-10-25.md`), all 7 amendments applied (`CONTRACT.md` section 1 item 19). It waits for Dann's say-so. N.196 is a DESK DEFAULT number, offered by the desk and ruled in by Dann.

For Code in a cloud session, Sonnet, on a lane cut from `Shane` by Dann. It has no dependency on batch C, N.194, N.195, or rows 122 and 134. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code carries a `path:line` the desk or Fable read (2026-10-22 and 2026-10-25), or says NOT ESTABLISHED or NOT READ. Do not write with git beyond one commit per step on the lane; no pull request; no other branch; no brief file in any commit.

Cost, a range and not measured: about 40k to 120k Sonnet tokens.

## 1. The need and the done state

Dann 2026-10-22 22:05: *"What can you advise in terms of security for Ilya? I'm hearing a lot about the php hack and I want to reasonably protect Ilya from malicious intent."* The desk proposed security headers; Dann ruled the item in at 22:08 (*"Yes"*). Transcribed as written.

Done when: `vercel.json` sets the four simple headers in section 3 on every response and a Content-Security-Policy in report-only mode; a test proves it; and nothing about how the app works changes. The desk verifies the live responses after Dann ships; Code cannot, because the cloud lane cannot fetch the site. The report-only policy walls nobody; it exists so that the later enforcing row starts from a list and not from console noise.

## 2. What the desk read (read, not run)

- `vercel.json` (repository root, 24 lines) has a `headers` array with one rule, for `/_app/immutable/(.*)` with a `Cache-Control` value (`:6-15`), and a `git.deploymentEnabled` block (`:16-22`) that builds only `Shane` and `main`. It sets no security header. `apps/web/static/_headers` does not exist.
- No test or script reads `vercel.json` (grep of `apps`, `scripts`, `tests`, `.github`, 2026-10-22 and 2026-10-25).
- The microphone is requested with `getUserMedia` in `apps/web/src/lib/voice/engine/live.ts:339`, from the voice wizard (`CalibrationWizard.svelte:217`). That is the one call; `session.ts:7`, `:18` and `readiness.ts:4` only mention it in comments and types.
- The camera is reached only through a file input with `capture="environment"` (`apps/web/src/lib/components/Drawer/IntakeCamera.svelte:77`), not through `getUserMedia`. Whether a Permissions-Policy `camera` setting affects that input is NOT ESTABLISHED: the HTML Media Capture specification (https://w3c.github.io/html-media-capture/, read 2026-10-25) does not mention Permissions Policy or the `camera` feature.
- `X-Frame-Options: DENY` stops other sites framing Ilya. Nothing in Ilya is itself framed: print is `window.print()` on the document (`apps/web/src/routes/+page.svelte:2188-2190`), and no `<iframe>`, `<embed>`, or `<object>` exists in `apps/web/src` (grep, 2026-10-25). NOT ESTABLISHED: whether any Vercel preview surface frames the deployment; the desk looks on the first preview after the ship.
- Nothing sets `Cross-Origin-Opener-Policy` or `Cross-Origin-Embedder-Policy`. The page steps down to single-threaded WebAssembly where it has no `SharedArrayBuffer`: that is homr-web's probe (`third_party/homr-web/src/models/backend.ts:30`, and `crossOriginIsolated` at `:108`), which is false today. (`apps/web/src/lib/omr/path-choice.ts:14` carries the same fact only as a comment.)
- Third parties at run time: Google Fonts (`apps/web/src/app.html:14-19`, the preconnects and the stylesheet; `apps/web/src/routes/+page.svelte:3757-3760`); Pyodide from jsDelivr for Ilya's own reader behind `?reader=ilya` (`apps/web/src/lib/reader/page-reader.worker.ts:92-93`, and the worker also fetches `/reader/*` from its own origin, `:366`); and tesseract.js, which reaches `cdn.jsdelivr.net` for its core and its `rus` language data on the poem-photograph route (`apps/web/src/lib/score/ScoreUploader.svelte:449-450`, `createWorker('rus')` with no `langPath` or `corePath`). The tesseract route is on the singer's path and not behind a flag. tesseract.js's documentation says that when `langPath` is unset the language data is downloaded from the jsDelivr CDN and `corePath` defaults to `https://cdn.jsdelivr.net/npm/tesseract.js-core@...` (https://unpkg.com/tesseract.js@6.0.1/docs/local-installation.md, read 2026-10-25); the installed version is 7.0.0 (`pnpm-lock.yaml:1131`), whose defaults are NOT READ. The worker script's own location is NOT ESTABLISHED. `docs/memory/ENVIRONMENT.md:3280-3296` records the desk missing OCR twice before.
- Self-hosted and same-origin, so `'self'` is wider than it looks: `apps/web/static/data` is a symlink to `../../../data`; the dictionary, the models under `/omr/`, the fonts under `/fonts/` (`apps/web/src/app.css:13-18`, `/fonts/lato-ipa.woff2`; `apps/web/src/lib/score/notation-fonts.ts:56`), and `/denigma_wasm_mnx.js` (`apps/web/src/lib/reader/score-reader.worker.ts:96-99`, a dynamic `import()` of a static root file) are all same-origin. `connect-src 'self'` covers the loader (`loader.ts:284`, `:342`), the notation font metadata (`notation-fonts.ts:56`), and `OMR_MODELS_BASE` at its default (`apps/web/src/lib/omr/homr-reader.ts:50-51`); if `PUBLIC_OMR_MODELS_BASE` is ever set to another host, the policy must name it. For fonts, `font-src 'self' https://fonts.gstatic.com`.
- Vercel sends `Strict-Transport-Security: max-age=63072000` on a custom domain by default (Vercel docs, "Encryption and TLS", https://vercel.com/docs/encryption, and "Response headers", https://vercel.com/docs/edge-network/headers/response-headers, both read 2026-10-25). Not changed in this row; `includeSubDomains` would reach every subdomain of `dannmitton.com` and is Dann's to rule.

## 3. DESK DEFAULT, his to wave off

On every path (`"source": "/(.*)"`):

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy: geolocation=(), payment=(), usb=(), microphone=(self), camera=(self)` (`camera=(self)` because of the capture input above; it is harmless either way. `microphone=(self)` is needed and sufficient for `getUserMedia` at `live.ts:339`: `self` means the top-level origin, which is Ilya's, and no cross-origin frame asks for either.)
- `Content-Security-Policy-Report-Only`, built from step 0. It has no reporting endpoint, because Ilya has no server; the browser's console records violations, which the desk reads on the live site on the alias. Singers never see it.

NOT in this row: `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` (they would block Google Fonts and change the `SharedArrayBuffer` path; turning `crossOriginIsolated` on would need `Cross-Origin-Resource-Policy` on Google Fonts and jsDelivr responses Ilya does not control); an enforcing Content-Security-Policy (a wrong one can silently break WebAssembly, workers, or blob URLs; it is a later row after the report-only period); `Strict-Transport-Security` (Vercel's default is in section 2; `includeSubDomains` stays out of this row and is Dann's); and moving tesseract's core and language data onto Ilya's own origin, as webmscore's were moved (`apps/web/src/lib/reader/vendor/webmscore.js:7-16`, the self-hosting ruling of 2026-07-13) and as N.197 does for fonts and Pyodide. The desk adds it to N.197 or opens a row.

## 4. Steps

**Step 0, read, change nothing.** List every origin and mechanism the built app uses, starting from these, each read by Fable on 2026-10-25, and adding what `apps/web/build` shows: Blob-URL workers and worklets (`vendor/webmscore.js:907`; `voice/engine/live.ts:458`), so `worker-src` and `script-src` need `blob:`; `new Function` in `vendor/webmscore.js:34`, so `script-src` needs `'unsafe-eval'` unless the converter is excluded, which it is not; `'wasm-unsafe-eval'` for `denigma_wasm_mnx.js`, webmscore's `.wasm`, and onnxruntime under `/omr/ort/`; a third third-party origin, `cdn.jsdelivr.net`, reached by tesseract.js for its core and `rus` data (`ScoreUploader.svelte:449-450`, no `corePath` or `langPath`; confirm the installed 7.0.0 defaults in `node_modules/tesseract.js/src/constants/defaultOptions.js` and say where the worker script itself comes from); the inline `<script>` in `app.html:24-40` and the `style=` attributes (61 in `.svelte` files), so `style-src` needs `'unsafe-inline'` and `script-src` either a hash of the registration script or a logged violation that the report names as accepted; `connect-src 'self'` and, if `PUBLIC_OMR_MODELS_BASE` is ever set, that host (`homr-reader.ts:50-51`). Read `pdf.worker.mjs` (loaded at `apps/web/src/lib/reader/page-pdf.ts:155` and `:278`) and the onnxruntime glue (`homr-reader.ts:54`, `metre-model.ts:66`) in the build for `eval` and `new Function` and report. Then the table: directive, the values it needs, and the evidence as `path:line`. Report it before you change code.

**Step 1.** Add the four simple headers to `vercel.json` under `"source": "/(.*)"`, keeping the existing `/_app/immutable/(.*)` rule exactly as it is. Confirm the file is valid JSON.

**Step 2.** Add `Content-Security-Policy-Report-Only` from step 0 in the same rule. It must not be named `Content-Security-Policy`. Report the header's byte length and say it is under 4,096, the limit the `vercel.json` schema enforces on a header value (Vercel community thread, "CSP header exceeding max header length", https://community.vercel.com/t/csp-header-exceeding-max-header-length/9127, read 2026-10-25; the staff answer there was Edge Middleware, which Ilya does not have). If it is over, stop and report; do not split it.

**Step 3, test.** Add `apps/web/src/lib/vercel-headers.test.ts` (DESK DEFAULT) that reads `vercel.json` by `fileURLToPath(new URL('../../../../vercel.json', import.meta.url))` (the pattern `apps/web/src/lib/voice/pacifier/contrast.test.ts:277` uses for `app.css`, adjusted for this file's depth), so it runs in gate 4 with the rest of `apps/web` (`apps/web/vite.config.ts:39-40` includes `src/**/*.{test,spec}.{js,ts}`; the root `vitest.config.ts:5` reads only `tests/**/*.test.ts`, and which of the eight gates runs `tests/` is NOT ESTABLISHED). Parse it with `JSON.parse` and assert: the four headers are present with these values; the immutable cache rule is unchanged; a report-only policy is present; and no `Cross-Origin-Embedder-Policy`, `Cross-Origin-Opener-Policy`, or enforcing `Content-Security-Policy` key exists. Add one: the `/(.*)` rule and the `/_app/immutable/(.*)` rule both match an immutable asset, and the test does not depend on their order, because the two sets of keys do not overlap. NOT ESTABLISHED from Vercel's documentation whether a later rule overrides an earlier one on the same key; the two rules here share no key, so it does not arise. Say so in the report. State which assertions failed before step 1.

Expectations the report states, because the lane cannot test them: Code cannot test the Permissions-Policy's effect (no live site); the desk tests the voice wizard's microphone and the camera button on a phone after the ship.

## 5. Constraints and the cross-site line

- Change `vercel.json`, the test, and the report only. No app code, no strings, no French. Do not add an `ignoreCommand` to `vercel.json`: the dashboard's Ignored Build Step (set 2026-10-22; `docs/memory/ENVIRONMENT.md:4972` records how to read it) stands, and a `vercel.json` value would override it.
- This row changes what the browser is told about every response. Other places that depend on those responses: the service worker `apps/web/static/sw.js` (it stores a response with its headers, `:74-87`, so a singer with a cached shell keeps the old headers until the cache turns over); the print route (`window.print()`, section 2); the Google Fonts stylesheet; the `?reader=ilya` Pyodide load; and the tesseract load from jsDelivr. The report-only policy will log the fonts, Pyodide, and tesseract; do not change them in this row (N.197 handles the fonts and the jsDelivr load; the tesseract move is named in section 3).
- Run all eight gates before and after, and report each. The baselines are NOT ESTABLISHED until you read them at your start.

## 6. Report

`docs/sessions/report-code-n196_r1_2026-10-22.md`, with: what you changed (files and `path:line`); the step 0 table; the header's byte length; the test and which assertions failed before; the eight gates before and after; and a section "What I could not establish" (every NOT ESTABLISHED and NOT READ above, closed or still open).

## 7. Owed to Dann

- Owed to Dann: HSTS with `includeSubDomains`. It would bind every `*.dannmitton.com` host to HTTPS for two years, which is irreversible in effect and is his domain, not Ilya's. It is not in this row; the desk says so in two sentences when the row ships. To hear, not to decide now.
- DESK DEFAULTS in this brief, his to wave off: the four headers and the report-only policy (section 3); the test's home, `apps/web/src/lib/vercel-headers.test.ts` (step 3).

## Appendix: amendments of the Fable review

| Amendment | Applied | Where in r2 |
|---|---|---|
| 1. Step 0 must start from the mechanisms the tree shows (Blob, `unsafe-eval`, tesseract, inline, `'self'`) | yes | section 2 (third-party and `'self'` bullets); section 3 (NOT in this row); section 4, step 0 |
| 2. The test has no home | yes | section 4, step 3 |
| 3. `X-Frame-Options: DENY`: the evidence | yes | section 2 (frame bullet) |
| 4. HSTS | yes (`includeSubDomains`: owed to Dann) | section 2 (last bullet); section 3 (NOT in this row); section 7 |
| 5. The camera input and `Permissions-Policy` | yes | section 2 (camera bullet); section 3 (Permissions-Policy line); section 4, step 3 (expectations) |
| 6. The report-only header's length | yes | section 4, step 2; section 6 |
| 7. Cites and small corrections | yes | section 2 (microphone, COOP and COEP, fonts, Pyodide, `'self'` bullets); section 5 |

## What I could not establish

From the review (Fable, 2026-10-25), still open:

- tesseract.js 7.0.0's exact defaults for `corePath`, `langPath`, and `workerPath` (the 6.0.1 docs were read; the installed source was not reachable).
- Whether `pdf.worker.mjs` or onnxruntime's glue uses `eval` or `new Function`.
- Whether Vercel applies every matching header rule or the first (no key overlaps here, so it does not bite).
- Whether a Vercel preview surface frames the deployment.
- Whether a Permissions-Policy `camera` setting touches `<input capture>` in any browser.
- Which gate runs the root `tests/` folder.

From the desk at r2:

- The eight gate baselines at Code's start.
- Cite differences from the review: the review cites the contrast test as `contrast.test.ts:277`; in the clone it is `apps/web/src/lib/voice/pacifier/contrast.test.ts:277` (a `../../../app.css` path from that depth), so the depth in the new test's `URL` is worked out for `apps/web/src/lib/` (four levels up to the repository root). The review's `notation-fonts.ts` is `apps/web/src/lib/score/notation-fonts.ts`. The Google Fonts stylesheet in `app.html:17` loads Source Sans 3 and Source Serif 4, and `+page.svelte:3757-3760` loads Noto Sans and Noto Serif; both are the same two origins.
