# Fable review: brief for Code, N.196, r1 (2026-10-25)

Brief reviewed: `docs/sessions/brief-code-n196-security-headers_r1_2026-10-22.md`, md5 `8acc613f6efd354af3991149a06e9092` (untracked in the repository; checked in the clone at `e0f4ad9`, 2026-10-25). Every `path:line` below was read by Fable this session; nothing was run. NOT ESTABLISHED beats a complete invented answer.

## Verdict: SEND WITH AMENDMENTS

The four simple headers are safe against everything I read in the tree, and report-only is the right posture for the policy. Three things change what Code builds or what the report can claim: the brief's step 0 inventory misses the three loaders that need `blob:`, `'unsafe-eval'`, and a third origin, so the first report-only policy would log noise that hides the real finding (amendment 1); the test's home is not named and the root `vitest.config.ts` only reads `tests/**` (amendment 2); `X-Frame-Options: DENY` is right, but the brief's own evidence for it names the wrong thing (amendment 3). One lead closes against vendor docs (HSTS), and one stays open and is Dann's to hear about (the report-only header's size and the camera input).

## Amendments, ranked

### 1. Step 0 must start from the mechanisms the tree already shows; three of them are not in the brief

Evidence, each read this session:

- **`blob:` workers and worklets.** The vendored webmscore converter starts its worker from a Blob URL: `apps/web/src/lib/reader/vendor/webmscore.js:907` (`this.worker=new Worker(url)` where `url` is a `createObjectURL` of the worker's source). The voice engine's AudioWorklet module is a Blob URL too: `apps/web/src/lib/voice/engine/live.ts:458` (`URL.createObjectURL(new Blob([WORKLET_SRC], ...))`, `WORKLET_SRC` at `:142`). A `worker-src` or `script-src` without `blob:` logs both; an enforcing policy later would break the `.mscz` route and the voice wizard.
- **`'unsafe-eval'`.** `webmscore.js:34` contains `new Function("body","return function "+name+"()...")` (Emscripten's glue). The pdf.js worker (`pdfjs-dist/build/pdf.worker.mjs`, loaded at `apps/web/src/lib/reader/page-pdf.ts:154-161`) and onnxruntime-web's glue under `/omr/ort/` (`apps/web/src/lib/omr/homr-reader.ts:54`, `metre-model.ts:66`) are NOT READ for `eval` or `new Function`; Code reads them in `apps/web/build` and `node_modules`. The brief names `'wasm-unsafe-eval'` for WebAssembly (right: `denigma_wasm_mnx.js` in `apps/web/static`, `webmscore.lib.wasm` via `?url`, onnxruntime under `/omr/ort/`) and not `'unsafe-eval'`.
- **A third origin: tesseract.js.** `ScoreUploader.svelte:449-450` runs `createWorker('rus')` with no `langPath` or `corePath`. tesseract.js's documentation says that when `langPath` is unset "the correct language data will be automatically downloaded from the jsDelivr CDN" and `corePath` defaults to `https://cdn.jsdelivr.net/npm/tesseract.js-core@...` (tesseract.js docs, local-installation, https://unpkg.com/tesseract.js@6.0.1/docs/local-installation.md, read this session; the installed version is 7.0.0, `pnpm-lock.yaml:1131`, whose defaults are NOT READ). So the poem-photograph route reaches `cdn.jsdelivr.net` for the core WebAssembly and the Russian language file, and the worker script's own location is NOT ESTABLISHED (bundled by Vite, or a CDN URL). The brief lists two third parties (Google Fonts, Pyodide behind `?reader=ilya`); this is a third, and on the singer's path, not behind a flag. `ENVIRONMENT.md:3280-3296` records the desk missing OCR twice before.
- **Inline styles.** 61 `style=` attributes across `apps/web/src/**/*.svelte` (count this session) and Svelte's scoped styles mean `style-src` needs `'unsafe-inline'` or a nonce scheme Ilya does not have. `app.html:24-40` has one inline `<script>` (the worker registration), so `script-src` logs it unless hashed. Both belong in the step 0 table as findings, not surprises.
- **`'self'` is wider than it looks.** `apps/web/static/data` is a symlink to `../../../data`; the dictionary, the models under `/omr/`, the fonts under `/fonts/`, and `/denigma_wasm_mnx.js` (`score-reader.worker.ts:96-99`, a dynamic `import()` of a static root file) are all same-origin. `connect-src 'self'` covers the loader (`loader.ts:284`, `:342`), the notation font metadata (`notation-fonts.ts:56`), and `OMR_MODELS_BASE` at its default (`homr-reader.ts:50-51`); if `PUBLIC_OMR_MODELS_BASE` is ever set to another host, the policy must name it. Say so.

Cost if not amended. The first report-only policy logs the mscz worker, the voice worklet, tesseract's CDN, every inline style, and the registration script on the first visit, and the desk reads a wall of violations that says nothing about an attacker.

Replace step 0's sentence "List every origin and mechanism..." with:

> List every origin and mechanism the built app uses, starting from these, each read this session by Fable, and adding what `apps/web/build` shows: Blob-URL workers and worklets (`vendor/webmscore.js:907`; `voice/engine/live.ts:458`), so `worker-src` and `script-src` need `blob:`; `new Function` in `vendor/webmscore.js:34`, so `script-src` needs `'unsafe-eval'` unless the converter is excluded, which it is not; `'wasm-unsafe-eval'` for `denigma_wasm_mnx.js`, webmscore's `.wasm`, and onnxruntime under `/omr/ort/`; a third third-party origin, `cdn.jsdelivr.net`, reached by tesseract.js for its core and `rus` data (`ScoreUploader.svelte:449-450`, no `corePath` or `langPath`; confirm the installed 7.0.0 defaults in `node_modules/tesseract.js/src/constants/defaultOptions.js` and say where the worker script itself comes from); the inline `<script>` in `app.html:24-40` and the `style=` attributes (61 in `.svelte` files), so `style-src` needs `'unsafe-inline'` and `script-src` either a hash of the registration script or a logged violation that the report names as accepted; `connect-src 'self'` and, if `PUBLIC_OMR_MODELS_BASE` is ever set, that host (`homr-reader.ts:50-51`). Read `pdf.worker.mjs` and the onnxruntime glue in the build for `eval` and `new Function` and report. Then the table.

Add to §3's "NOT in this row": "Moving tesseract's core and language data onto Ilya's own origin, as webmscore's were moved (`vendor/webmscore.js:7-16`, the self-hosting ruling of 2026-07-13) and as N.197 does for fonts and Pyodide; the desk adds it to N.197 or opens a row."

### 2. The test has no home, and the root runner does not see `apps/web/src`

Evidence. `vitest.config.ts` at the repository root includes `tests/**/*.test.ts` only; `apps/web/vite.config.ts` includes `src/**/*.{test,spec}.{js,ts}` and excludes `e2e/**`. `vercel.json` is at the root. A test under `apps/web/src` reads it by a relative path four levels up; a test under `tests/` runs in the root runner, which is a different gate (NOT ESTABLISHED which of the eight gates runs `tests/`; the ship script was not read this session). The brief says "under the repository's existing test set" and leaves the choice to Code, which is a choice the desk owns.

Replace step 3's first clause with: "Add `apps/web/src/lib/vercel-headers.test.ts` (DESK DEFAULT) that reads `vercel.json` by `fileURLToPath(new URL('../../../../vercel.json', import.meta.url))` (the pattern `contrast.test.ts:277` uses for `app.css`), so it runs in gate 4 with the rest of `apps/web`; parse it with `JSON.parse` and assert..." Keep the assertions as written. Add one: "the `/(.*)` rule is listed after the `/_app/immutable/(.*)` rule or before it, and the test does not depend on order; Vercel applies every matching rule, so both match an immutable asset and the two sets of keys do not overlap. NOT ESTABLISHED from Vercel's documentation whether a later rule overrides an earlier one on the same key; the two rules here share no key, so it does not arise. Say so in the report."

### 3. `X-Frame-Options: DENY`: the brief's evidence is right in effect and wrong in kind

Evidence. The brief supports `DENY` with "nothing uses an iframe or `frame-ancestors`" (`§2`). `X-Frame-Options` controls whether Ilya may be framed by another page, not whether Ilya frames anything, so the grep for `<iframe` in Ilya's own source proves nothing about it; it would matter for `frame-src`. What does matter: Ilya's print path is `window.print()` on its own document (`+page.svelte:2188-2190`), not a hidden iframe, and no `<iframe>`, `<embed>`, or `<object>` exists in `apps/web/src` (grep this session), so nothing in the app's own print or preview path is framed. The desk's walks run Playwright against the alias directly, not in a frame. Vercel's own preview comments toolbar is NOT ESTABLISHED: whether it frames the deployment is not something the tree can say.

Replace §2's iframe bullet with: "`X-Frame-Options: DENY` stops other sites framing Ilya. Nothing in Ilya is itself framed: print is `window.print()` on the document (`+page.svelte:2188-2190`), and no `<iframe>`, `<embed>`, or `<object>` exists in `apps/web/src`. NOT ESTABLISHED: whether any Vercel preview surface frames the deployment; the desk looks on the first preview after the ship."

### 4. HSTS: closed against Vercel's documentation; keep it out of this row as the brief says

Evidence. Vercel sends `Strict-Transport-Security: max-age=63072000` on custom domains by default, and `max-age=63072000; includeSubDomains; preload` on `*.vercel.app`; the header can be changed through custom response headers (Vercel, "Encryption and TLS", https://vercel.com/docs/encryption, and "Response headers", https://vercel.com/docs/edge-network/headers/response-headers, both read this session). So Ilya already has HSTS on `ilya.dannmitton.com` without `includeSubDomains`. Adding `includeSubDomains` would bind every subdomain of `dannmitton.com` to HTTPS for two years, which is irreversible in effect and is Dann's domain, not Ilya's.

Replace §2's last bullet with: "Vercel sends `Strict-Transport-Security: max-age=63072000` on a custom domain by default (Vercel docs, Encryption and TLS, read 2026-10-25). Not changed in this row; `includeSubDomains` would reach every subdomain of `dannmitton.com` and is Dann's to rule." Move the HSTS line in §3's "NOT in this row" to match.

### 5. The camera input and `Permissions-Policy`

Evidence. The HTML Media Capture specification (https://w3c.github.io/html-media-capture/, read this session) does not mention Permissions Policy or the `camera` feature; `getUserMedia` is what the `camera` policy governs. The brief's `camera=(self)` is harmless either way, and the brief marks the question NOT ESTABLISHED. Right. One addition: `microphone=(self)` is needed and sufficient for `getUserMedia` at `live.ts:339`; `self` means the top-level origin, which is Ilya's, and no cross-origin frame asks for either. Code cannot test the policy's effect in the lane (no live site); the desk tests the camera button on a phone after the ship. Write that in step 3's expectations.

### 6. The report-only header's length and what the desk will read

Evidence. `vercel.json` schema validation refuses a header value longer than 4,096 characters (Vercel community thread, "CSP header exceeding max header length", https://community.vercel.com/t/csp-header-exceeding-max-header-length/9127, read this session; the staff answer was Edge Middleware, which Ilya does not have). With amendment 1 the policy grows; it stays well under 4,096, but Code reports the byte length. Also: a report-only policy with no `report-to` logs to the console only in the browser whose console is open; the desk's walk reads it on the alias, singers never see it. The brief says so. Add: "Report the header's byte length and say it is under 4,096 (the schema's limit)."

### 7. Cites and small corrections

- `vercel.json` has 24 lines; the immutable rule is `:6-15`, `git.deploymentEnabled` `:16-22`. The brief's description is right.
- `path-choice.ts:14` is a comment line; the fact it carries ("steps down to single-threaded `wasm` where the page has no `SharedArrayBuffer`") is homr-web's probe at `third_party/homr-web/src/models/backend.ts:30` and `:108` (`crossOriginIsolated`). Cite those so the COOP/COEP exclusion in §3 rests on code.
- `CalibrationWizard.svelte:217` and `live.ts:339`: as stated. `getUserMedia` also appears in `session.ts:7`, `:18` and `readiness.ts:4` (comments and types); the one call is `live.ts:339`.
- Google Fonts: `app.html:14-19` (preconnects and the stylesheet) and `+page.svelte:3757-3760`. The brief's `:14-17` and `:3758-3760` are within a line.
- Pyodide: `page-reader.worker.ts:92-93`. Right, and the worker also fetches `/reader/*` from its own origin (`:366`).
- The self-hosted fonts: `app.css:13-18` (`/fonts/lato-ipa.woff2`) and the notation fonts under `/fonts/` (`notation-fonts.ts:56`), so `font-src 'self' https://fonts.gstatic.com`.
- "No test or script reads `vercel.json`": confirmed by grep of `apps`, `scripts`, `tests`, `.github` this session.
- The brief does not say that `Permissions-Policy` and `X-Frame-Options` are harmless to the service worker: `sw.js:74-87` stores the response with its headers, so a singer with a cached shell keeps the old headers until the cache turns over; the brief says this already at §5. Right.

## Checks that passed

- The four simple headers break nothing I read: `nosniff` (every served type is set by Vercel from the extension; the `?url` assets are real files), `Referrer-Policy` (no cross-origin request depends on a full referrer), `X-Frame-Options: DENY` (amendment 3), `Permissions-Policy` as drafted (amendment 5).
- Report-only, not enforcing: right, and the brief says why.
- COOP and COEP excluded: right. `crossOriginIsolated` is read by homr-web (`backend.ts:108`) and is false today; turning it on would need `Cross-Origin-Resource-Policy` on Google Fonts and jsDelivr responses Ilya does not control.
- No `ignoreCommand`: right; the dashboard setting of 2026-10-22 stands (`ENVIRONMENT.md:4972` records how to read it).
- The cross-site line: present (`sw.js`, print, fonts, Pyodide). Amendment 1 adds tesseract and the two Blob loaders.

## Where would this wall a singer in

- None from the four headers. A report-only policy walls nobody.
- The row after this one, an enforcing policy, is where the walls are: the `.mscz` route (Blob worker, `new Function`), the voice wizard (Blob worklet), the photographed poem (tesseract on jsDelivr), the `.musx` route and the scan reader (WebAssembly). Amendment 1 puts every one of them in the step 0 table so that row starts from a list, not from console noise.
- The singer who gets nothing from this row: one whose browser already enforces nothing. Right; this row is hygiene, which is what Dann asked for.

## Questions for Dann

- None required now. One to hear, not decide: HSTS with `includeSubDomains` would bind every `*.dannmitton.com` host to HTTPS for two years (amendment 4). It is not in this row; the desk says so in two sentences when the row ships.

## What I could not establish

- tesseract.js 7.0.0's exact defaults for `corePath`, `langPath`, and `workerPath` (the 6.0.1 docs were read; the installed source was not reachable this session).
- Whether `pdf.worker.mjs` or onnxruntime's glue uses `eval` or `new Function`.
- Whether Vercel applies every matching header rule or the first (no key overlaps here, so it does not bite).
- Whether a Vercel preview surface frames the deployment.
- Whether a Permissions-Policy `camera` setting touches `<input capture>` in any browser.
- Which gate runs the root `tests/` folder.
