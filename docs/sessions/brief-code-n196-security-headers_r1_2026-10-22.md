# Brief r1: N.196, security headers for Ilya (2026-10-22)

Written by the desk (Sonnet) 2026-10-22 about 22:2x. NOT Fable-reviewed; it waits for Sunday 2026-10-25 05:00 and Dann's say-so (`CONTRACT.md` section 1 item 19). N.196 is a DESK DEFAULT number, offered by the desk and ruled in by Dann.

For Code in a cloud session, Sonnet, on a lane cut from `Shane` by Dann. It has no dependency on batch C, N.194, N.195, or rows 122 and 134. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code carries a `path:line` the desk read on 2026-10-22, or says NOT ESTABLISHED or NOT READ. Do not write with git beyond one commit per step on the lane; no pull request; no other branch; no brief file in any commit.

Cost, a range and not measured: about 40k to 120k Sonnet tokens.

## 1. The need and the done state

Dann 2026-10-22 22:05: *"What can you advise in terms of security for Ilya? I'm hearing a lot about the php hack and I want to reasonably protect Ilya from malicious intent."* The desk proposed security headers; Dann ruled the item in at 22:08 (*"Yes"*). Transcribed as written.

Done when: `vercel.json` sets the four simple headers in section 3 on every response and a Content-Security-Policy in report-only mode; a test proves it; and nothing about how the app works changes. The desk verifies the live responses after Dann ships; Code cannot, because the cloud lane cannot fetch the site.

## 2. What the desk read (read, not run)

- `vercel.json` (repository root) has a `headers` array with one rule, for `/_app/immutable/(.*)` with a `Cache-Control` value, and a `git.deploymentEnabled` block that builds only `Shane` and `main`. It sets no security header. `apps/web/static/_headers` does not exist.
- No test or script reads `vercel.json` (grep of `apps`, `scripts`, `tests`, `.github`, 2026-10-22).
- The microphone is requested with `getUserMedia` in `apps/web/src/lib/voice/engine/live.ts:339`, from the voice wizard (`CalibrationWizard.svelte:217`).
- The camera is reached only through a file input with `capture="environment"` (`apps/web/src/lib/components/Drawer/IntakeCamera.svelte:77`), not through `getUserMedia`. Whether a Permissions-Policy `camera` setting affects that input is NOT ESTABLISHED.
- Nothing in `apps/web/src` or `apps/web/static` uses an iframe or `frame-ancestors`, and nothing sets `Cross-Origin-Opener-Policy` or `Cross-Origin-Embedder-Policy`. `SharedArrayBuffer` is used only where the page has it (`apps/web/src/lib/omr/path-choice.ts:14`), so the page falls back to the plain WebAssembly path today.
- Third parties at run time: Google Fonts (`apps/web/src/app.html:14-17`, `apps/web/src/routes/+page.svelte:3758-3760`) and, for Ilya's own reader behind `?reader=ilya`, Pyodide from jsDelivr (`apps/web/src/lib/reader/page-reader.worker.ts:92`).
- NOT READ: the response headers Vercel adds by default, including `Strict-Transport-Security`. The device shell and the cloud lane cannot fetch the site.

## 3. DESK DEFAULT, his to wave off

On every path (`"source": "/(.*)"`):

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy: geolocation=(), payment=(), usb=(), microphone=(self), camera=(self)` (`camera=(self)` because of the capture input above)
- `Content-Security-Policy-Report-Only`, built from step 0. It has no reporting endpoint, because Ilya has no server; the browser's console records violations, which the desk reads on the live site.

NOT in this row: `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` (they would block Google Fonts and change the `SharedArrayBuffer` path), an enforcing Content-Security-Policy (a wrong one can silently break WebAssembly, workers, or blob URLs; it is a later row after the report-only period), and `Strict-Transport-Security` (Vercel's default is NOT READ; the desk reads it live first).

## 4. Steps

**Step 0, read, change nothing.** List every origin and mechanism the built app uses, from the source and from `apps/web/build`: scripts, styles, fonts, images, connections (`fetch` and the like), workers, WebAssembly (which needs `'wasm-unsafe-eval'`), blob and data URLs, and the service worker. Report a table: directive, the values it needs, and the evidence as `path:line`. Report it before you change code.

**Step 1.** Add the four simple headers to `vercel.json` under `"source": "/(.*)"`, keeping the existing `/_app/immutable/(.*)` rule exactly as it is. Confirm the file is valid JSON.

**Step 2.** Add `Content-Security-Policy-Report-Only` from step 0 in the same rule. It must not be named `Content-Security-Policy`.

**Step 3, test.** Add a unit test under the repository's existing test set that parses `vercel.json` and asserts: the four headers are present with these values; the immutable cache rule is unchanged; a report-only policy is present; and no `Cross-Origin-Embedder-Policy`, `Cross-Origin-Opener-Policy`, or enforcing `Content-Security-Policy` key exists. State which assertions failed before step 1.

## 5. Constraints and the cross-site line

- Change `vercel.json`, the test, and the report only. No app code, no strings, no French. Do not add an `ignoreCommand` to `vercel.json`: the dashboard's Ignored Build Step (set 2026-10-22) stands, and a `vercel.json` value would override it.
- This row changes what the browser is told about every response. Other places that depend on those responses: the service worker `apps/web/static/sw.js` (cached responses keep the headers they were stored with, so a singer sees the new headers after the cache refreshes); the print and PDF routes; the Google Fonts stylesheet; and the `?reader=ilya` Pyodide load. The report-only policy will log the last two; do not change them in this row (N.197 handles the fonts and the jsDelivr load).
- Run all eight gates before and after, and report each.

## 6. Report

`docs/sessions/report-code-n196_r1_2026-10-22.md`, with: what you changed (files and `path:line`); the step 0 table; the test and which assertions failed before; the eight gates before and after; and a section "What I could not establish" (every NOT ESTABLISHED and NOT READ above, closed or still open).
