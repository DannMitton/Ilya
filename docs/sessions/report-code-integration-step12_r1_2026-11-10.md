# Report: integration step 12, every scan banner can be dismissed, 2026-11-10

Branch `cloud-lane-38`. Dann ruled 2026-11-09 20:28: "whether that is clicking outside the banner or a familiar verbatim x in the top right corner, your choice. Align with Calm Authority." DESK DEFAULT: a small × in the top-right corner, with the Finale banner's dismiss control, label, and focus behaviour. Commits: the × and its state (one), then two small test fixes. Nothing pushed to `Shane` or `main`; no pull request; `docs/memory/` untouched.

## The Finale (denigma) banner, read first

`apps/web/src/lib/score/ScoreUploader.svelte`: the banner is drawn at `:651-660` (`<div class="banner">`, a `<p class="banner-text">` with `T('upload.banner.denigma')` and a `<button type="button" class="banner-dismiss" onclick={() => (bannerDismissed = true)}>` with the visible text `T('upload.banner.dismiss')`), styled at `:770-800`; `bannerDismissed` is the `$state` at `:171`, reset at `:207`, `:439`, `:545` and read at `:616`. **It has no `aria-label`:** its accessible name is its visible text, `upload.banner.dismiss` (`i18n.ts:1166`): **English « Dismiss », French « Ignorer »**. Its focus behaviour is the browser's own (a plain button, no focus handling, no trap). It sits at the bottom-right of its banner as a text button, not a ×.

## What I built

- **`ScanBanner.svelte`** (the one component behind every scan banner: the reader banner, `noLyricsScan`, `noLyrics`, and both partly-read banners): a new optional `ondismiss` prop draws `<button type="button" class="banner-x" aria-label={t('upload.banner.dismiss', language)}>` with a × glyph, absolutely placed in the banner's top-right corner (`position: absolute; top: 0; right: 0`), quiet (`--ink-tertiary`, `--ink-secondary` on hover), a visible `:focus-visible` outline, and on a coarse pointer a hit area that grows past the glyph as the bar links' does. **The accessible name is the shared string**, so « Dismiss » / « Ignorer »; no string was added. The sentence has right padding so it never runs under the ×. It is a real button: Tab reaches it, Enter and Space activate it (browser behaviour; I did not walk it in a browser). **No click-outside, blur, or window handler exists** (a test reads the component for them).
- **`score/scan-banner-state.svelte.ts` (new, `ScanBannerState`):** remembers dismissals by banner key AND text argument (the file name, or the unread bars), so dismissing one banner never hides another, and a re-read that lists different bars is a different banner and shows. `reset()` clears it.
- **`+page.svelte`** (still 5534 lines; every change is on an existing line): both `ScanBanner` mounts take `ondismiss` and are hidden while dismissed; `scanBanners.reset()` is called in `applyArrival` (an upload, and a re-read, since both arrive there), in `handleClearScore`, and on a song switch.

## What this means for the singer

- A banner stays dismissed **for that score**; a **new upload** or a **re-read** brings the banners back with their new text; a **song switch** or **Clear** resets it too, so a scan reopened later shows its banners again (I read this as "until a new upload or a re-read sets new banners", plus the page's own rule that banners belong to the open score). The Finale banner is unchanged (its text "Dismiss" button stays; the desk did not ask to touch it).

## Tests (`components/Drawer/scan-banner.test.ts`, 16)

Each of the five banners renders a `<button type="button" class="banner-x">` whose `aria-label` is `upload.banner.dismiss` in English and French; no × without a handler; the component uses the Finale banner's string and adds none; no click-outside handler; each banner dismisses and a reset brings it back; a dismissal never hides a different banner or the same banner with other bars; the page wires the dismiss on both mounts and calls `reset()` in exactly three places. Two earlier assertions in `reader-banner.test.ts` (that the banner's HTML starts with `<p>`) moved to find the paragraph inside the new wrapper. **Not tested:** the keys in a real browser (no spec shows a scan banner; the e2e scans are MusicXML fixtures).

## Gates (baseline on Shane, then at the final code)

| Gate | Baseline | Now | Move |
|---|---|---|---|
| 1 phonology | 407 | 456 | +49 (steps 3, 9) |
| 2 dictionary | 248 | 248 | none |
| 3 web check | 0 errors, 12 warnings, 5 files | same | none |
| 4 web unit | 4198, 1 skipped | 4707, 1 skipped (4708) | +509: +491 before step 11, +2 (ratified-lines, step 11c), +16 here |
| 5 score-parser | 785, 5 skipped | same | none |
| 6 blurb | 148 | 168 | +20 (rows 157, 10) |
| 7 integration | 125 | 125 | none |
| 8 ratchets | OK. | OK. | none |

(Two of my first runs of gate 4 showed 2 failures in `reader-banner.test.ts`, which looked for a bare `<p>`; fixed in two small commits and re-run clean.)

## Playwright

**160 passed, 11 failed, 2 skipped** (36.0 min), both projects, `--trace off`, Chromium `/opt/pw-browsers/chromium`, on the final code. The 11 are the same ones red on Shane (listed in step 7's report): `glue-typed-marks` ×2, `heic-reader-path`, `insights-page`, `loupe-header`, `print-pages`, `singer-paths`, phone `input-views:134`, `phrase-ends:26`, `relining:70`, `relining:95`. None is new.

## What I could not establish

- **Keyboard and focus in a browser:** Tab, Enter, and Space on the ×; where focus goes after a dismissal (the button disappears with its banner, so focus returns to the page body, as the Finale banner's does).
- **How it looks:** a 20 px × at the top right of a lavender-free plain paragraph; not seen.
