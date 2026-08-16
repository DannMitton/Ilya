# ENVIRONMENT — the traps

**A lookup table, not a read-through.** Open it when you are about to touch a tool,
a path, or a gate. Every line here cost someone an hour.

---

## Gate baselines

| gate | baseline |
|---|---|
| phonology | 216 |
| dictionary | 235 |
| web-check | 0 errors, 7 warnings, 4 files |
| web-test | **438** |
| score-parser | 442 passed, 5 skipped |

**Tell Dann the new gate number BEFORE he runs the ship script, not after.**

**A BRIEF THAT ASKS A FARMED-OUT AGENT TO RUN A GATE IS A BROKEN BRIEF.** No
gate runs anywhere but Dann's own Terminal, for the reason two sections down:
`node_modules` is macOS and every VM in reach is Linux arm64. Tell the agent
that in the brief, and make its definition of done "the tests are written and
hand-traced," with the gate run listed under what Dann must do. **Running the
task on Dann's computer instead of in the cloud does NOT fix this**: that mode
is a Linux VM too.

**The baseline lives in `~/Downloads/ilya-ship.sh:79` and only moves with
Dann's permission.** It moved 408 to 416 on 2026-08-13 for `pairings.test.ts`,
then 416 to 438 on 2026-08-14 for `shift-lyrics.test.ts`.

**`mscz-converter.test.ts` prints to stderr on three tests by design.** They
exercise failure paths. The ship script echoes those lines when a gate
deviates, and they are not failures. **Read the count, not the verdict.**

`vitest` never compiles a `.svelte` file. If logic needs testing it does not belong
in a `.svelte` file. `svelte-check` is what looks at components.

**A CSS-only change moves no gate.** Confirmed twice in E.51 across five
component style blocks. If you predict a gate will not move, say so before the
ship, and then you have a control.

---

## The ship script has a bug. `ilya-ship.sh:52`

**`CHANGED=$(git -C "$REPO" diff --name-only)` only sees UNSTAGED changes.** A
file staged with `git add` first reads as clean to this line, so the script
prints "Working tree clean. Nothing to commit" and skips the commit even though
a real, staged change is sitting there. **Confirmed 2026-08-14.**

**Trigger: pre-staging before running the script.** CONTRACT §5's "ask Dann to
`git add` a new file before you ask him to ship" is about UNTRACKED files. It
does not apply to an already-tracked file. Don't pre-stage a tracked file; let
the script's own `git add -u` (line 94) do it.

**Fixed, 2026-08-14, Dann's yes given.** Line 52 now reads
`git -C "$REPO" diff --name-only HEAD`. **Exercised successfully three times in
E.51**, including one commit that swept up `docs/memory/INBOX.md` alongside two
source files.

---

## PRINT. The media-query trap, and how the paper is built

**A bare `@media (max-width: 767px)` has no media type, so it defaults to `all`
and MATCHES PRINT.** This is the single most expensive thing in this file. Every
portrait concession written that way applies to paper. **On a desk the width
never matches and the bug is invisible. On a phone the paper inherits the
phone.** Write portrait concessions as `@media screen and (max-width: 767px)`.

**ORDER IS NOT OVERRIDE, AND A COMMENT IS NOT A CONTROL.** Four separate comments
in the Paper components asserted that print overrode the mobile block. None was
true. `TitleHeader.svelte`'s `@media print` sat at line 188, *before* its width
block at 201, so at equal specificity the width rule won. `RunningHeader.svelte`
and `PageFooter.svelte` contained no `@media print` block at all.

**And a print block that sets `box-shadow` does not override a width block that
sets `height`.** In N.69 pass one I checked the source order of
`TitlePage.svelte` and `SubsequentPage.svelte`, saw a print block after the width
block, and marked them fine without reading the declarations. **Read what a block
actually sets, every time.**

**The paper's geometry, so you can reason about it without re-deriving it:**

- `.paper-page` carries an INLINE `style="width: {dims.width}px; height: {dims.height}px"`
  (`TitlePage.svelte:122`, `SubsequentPage.svelte:57`). **A rule with `!important`
  beats an inline style**, which is how `height: auto !important` unmade the page.
- `.page-content` is `position: absolute`, inset by
  `style="top: {contentTop}px; bottom: {contentBottom}px"` (`TitlePage.svelte:138`).
  That inset is the band the header and footer live outside of.
- `.title-header` is `position: absolute; top: 48px` (`TitleHeader.svelte:104-105`).
  `.page-footer` is `position: absolute; bottom: 48px` (`PageFooter.svelte:90-91`).
  **Both depend on the page being letter-height and the content being inset.**
  Break either and they land in the middle of the words.
- `app.css:134-225` is the document-wide print block: `@page { margin: 0; size: letter }`
  at 221-224, which suppresses the browser's own header and footer, and
  `.header-bar, .drawer, .drawer-lip, .tab-bar, .ribbon { display: none !important }`
  at 200-206.
- `ReadingPaper.svelte:235` has the same bare width query and is CORRECTLY left
  alone: it governs the Guide's padding and font sizes, not the transcription
  paper.

**There is no second renderer, and saying so to Dann is a mistake.** Portrait and
landscape are the same Paper components with different CSS; his N.45 ruling keeps
the pages in the DOM and removes only the seam (`Paper.svelte:109-112`). But when
he says *"print the WYSIWYG,"* he is right and the correct reading is
operational, not architectural: **every difference between screen and paper is a
bug until proven otherwise.** Telling him there is nothing to point at cost E.51
five build passes. The paper is ALWAYS letter geometry, 816 × 1056 from
`page-config.ts:18`, on every device. Anything that differs is a leak.

**THE THREE LEAKS, all found in E.51, all the same shape.**

1. **CSS that forgot to say `screen`.** A bare `@media (max-width: 767px)` has no
   media type, defaults to `all`, and matches `print`.
2. **Print restyling the document.** `app.css` set `line-height: normal` on
   `.paper-page` at print while the screen used `1.5` from `body:106`. Print
   re-metriced every line box after the layout had been measured.
3. **A measurement taken at the wrong width.** `TitlePage` derives `contentTop`
   from `TitleHeader`'s `bind:offsetHeight`. On a phone `.paper-page` is 100%
   wide, the song title wraps, and the header measures **40 CSS px** too tall for
   the 816px sheet that is actually printed.

**So: a JS-computed inline style cannot be media-query-scoped.** Screen and print
cannot carry different values for the same measured number. Below the breakpoint,
use `HEADER_HEIGHTS_AT_LETTER` (`page-config.ts`) instead of the live
measurement. The `isMobile` prop is already threaded `+page.svelte:985` →
`Paper` → both page components.

**The geometry, so nobody re-derives it.** `HEADER_GAP = 16`, one constant, both
pages. Both header components END at their rule (it is the last child, nothing
below it): title 127px with rule bottom at 127.38, running 29px with rule bottom
at 29.0, measured at 816px with the real fonts. That is what makes
`contentTop − (MARGINS.vertical + headerHeight)` exactly `HEADER_GAP` everywhere.
**Do not "tune" one page to look like the other. That is what produced 18 against
8 and it cannot be made to agree.**

**`VoiceProfilePane.svelte:295-313` still duplicates the OLD arithmetic**, its own
`TITLE_HEADER_GAP = 18` and `HEADER_HEIGHTS.subsequent + GAP`, and `HEADER_HEIGHTS`
stays in `page-config.ts` only because of it. Fit's paper does not yet share the
single `HEADER_GAP`.

**With no score loaded, print emits a genuinely blank sheet**, not a sheet with a
footer: there are no `.paper-page` elements and `.paper-container` is
`font-size: 0` at print time (`app.css:177-178`). **A blank print is therefore
useless as a test**, because blank is also what a broken print stylesheet
produces. It has no positive control.

### The two Print buttons

Both call the same bare `window.print()` (`+page.svelte:457-459`), so **neither
does anything Safari's Share → Print does not.** What they add is a gate:

- **Transcribe's**, `RootPanel.svelte:195-201` (the file is in
  `components/Drawer/`), `disabled={!hasResults}`. Transcribing is the whole
  prerequisite. **It is the better print test**, because the button lives inside
  the drawer and on a phone the drawer is the whole screen, so pressing it
  guarantees `app.css:201`'s `.drawer { display: none }` is exercised.
- **Fit's**, `+page.svelte:1227-1233`,
  `disabled={!ingestedScore && Object.keys(shaneFormants).length === 0}`.

**A desktop cannot falsify a mobile print bug.** The width query never matches on
a desk, so desktop print preview passes either way. **The phone is the only
instrument on Dann's side.** Do not send him to check on the Mac.

**iOS Safari's print preview thumbnails are a usable instrument.** They showed
the header overlap clearly enough to diagnose from a screenshot, and the gaps are
measurable off a screenshot with PIL: find the long dark run (the rule), then the
next row with ink. **Check the preview before spending paper.**

### RENDER IT HERE BEFORE HE PRINTS IT

**This is the most expensive lesson in this file.** E.51 shipped five passes at
Dann, each verified by making him print. He was clear from his first message and
the disagreement was mine every time. **Do not use him as the renderer.**

Chromium is in this container and a standalone harness measures the paper in
about a minute:

- Launch path is `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, and
  **you must pass `channel: 'chromium'`** or Playwright asks for old headless
  mode, which the binary has removed. `/opt/pw-browsers/chromium` is a directory,
  not the binary. `npm i -D playwright` first; the bundled version may be older
  than the installed browser.
- **You do not need to build the app.** Extract the `<style>` block from the
  component with a regex, drop the real markup into a 816 × 1056 `.paper-page`
  div, declare the CSS variables by hand, and link the Google Fonts the app
  links. `document.fonts.status` must read `loaded` before measuring, or every
  number is wrong. `await page.waitForTimeout(3000)` was enough.
- Measure `getBoundingClientRect()` on the rule and on the first text node and
  subtract. That is the same number Dann is looking at on paper.

**Then, and only then, hand him a QR.**

---

## Deploys

`WRITTEN` until a browser observation exists, then `DONE`. Builds run 26 to 27
seconds, Vercel about 90 more. **Measured end to end in E.51: under two minutes
from `git push` to state READY.**

**Use the deployment's own permanent URL:** `list_deployments` with a `since`, match
`githubCommitSha`. **Do not take the newest.** Team
`team_CmkdrV66wAIF29pQLpiAb80O`, project `ilya` (`prj_oOvEOXnovbEkVBAOQRmTmgxJK0DB`).
There is no `.vercel/project.json`.

**VERCEL SSO IS NOW OFF, changed 2026-08-15.** It was
`ssoProtection: enabled, all_except_custom_domains`, which put a Vercel login in
front of any device not signed in. It is now disabled via
`update_project_deployment_protection`, so **a plain deployment URL works on
Dann's phone, needs no `?_vercel_share=` token, and never expires.** Reversible
in the dashboard: project `ilya`, Settings, Deployment Protection.
`get_access_to_vercel_url` is still there if it is ever turned back on; those
links last 23 hours.

**THE VERCEL SIGIL.** Vercel appends
`<script src="https://vercel.live/_next-live/feedback/feedback.js">` after
`</html>` on every PREVIEW deployment, and it mounts a `<vercel-live-feedback>`
custom element. **The tag name is read out of that script**
(`createElement("vercel-live-feedback")`), not guessed: fetch it with `curl` in
the container and grep. It is hidden at print in `app.css`. **Nothing in the tree
ever stripped it before E.51** — `grep -ri vercel apps/web/src` returns nothing —
so if Dann remembers it being stripped, it was never committed.

**EVERY DEPLOYMENT URL IS A SEPARATE ORIGIN**, so every ship hands the phone an
empty `localStorage` and the test text has to be pasted again. Four iterations in
E.51 cost four re-pastes. The branch alias
`ilya-git-shane-dannmittons-projects.vercel.app` would persist across ships at
the cost of not being sha-pinned. **Unruled; ask Dann before switching.**

**Do not tell Dann to clear website data; his readings live in `localStorage`.**
Send a QR only for a build whose change he can see.

**The cloud container cannot reach `*.vercel.app`.** Chrome on his Mac, or his
phone, is the way.

---

## Browser and extension

- **A TAB THAT LOADED WHILE HIDDEN NEVER HYDRATES.** Reload it. `document.hidden`
  first, always.
- **`document.hasFocus()` can be TRUE while `visibilityState` is `hidden`**, when
  the Chrome window is not the frontmost window on the Mac. **Ask Dann to bring the
  window to the front**, and do not report a reading taken before he has.
- **The language toggle is not a `<button>`.** Use `'button,a,[role=button]'`.
- **A BACKGROUNDED CHROME TAB IS NOT AN INSTRUMENT.**
- The extension's tab group can drop. Recreate with `createIfEmpty: true`.
- **The Fit file input is NOT in the accessibility tree**, so **`file_upload`
  cannot be given a ref**. What works: build a `File` in `javascript_tool`, put it
  on the input through a `DataTransfer`, then dispatch `input` and `change`.
  **Record and restore any attribute you set on the page first.**
- **A fixture's JS `.length` is not its byte count.** The control file is 1757
  bytes and 1747 JS characters; the difference is the ten Cyrillic characters in
  its `work-title` at two UTF-8 bytes each.
- **`file_upload` needs the Fit tab ACTIVE FIRST.** Transcription's OCR input will
  take a `.musicxml` and fail.
- **`form_input` triggers Svelte's binding; `computer`'s `type` did not.**
- **`computer`'s `left_click` can silently no-op on a real, visible, enabled
  button.** Check the button's own state via `javascript_tool` first, then drive
  it with a dispatched `.click()`.
- **`javascript_tool` has a 45-second CDP ceiling**, and it redacts base64-looking
  strings, so an unreadable `localStorage` key is not an absent one.
- **`/fit-font-lab` 404s on the deployed build.** There is no zero-setup route that
  renders a stave; you must upload a score.
- **Browsers and origins do not share state.** Nine voice profiles exist in
  Chrome; **"Dann", 11 juillet, is the one with readings.**
- **A reload does not restore the ingested score.** Only `ilya:pairings` and the
  Transcription textarea's own text survive.
- **A no-lyrics score upload always overwrites `pairings`**
  (`+page.svelte:1147-1152`). To see a restored value you must reload WITHOUT
  re-uploading.

---

## The device bridge

- **Connected folders to request:** `~/Desktop/ilya-rewrite`, `~/Documents/Finale
  Files`, `~/Documents/Voice Pedagogy Research`, `~/Downloads`. **Folder grants are
  PER SESSION and do not carry between sessions.**
- **The grant survives a long gap WITHIN a session.** E.51 ran across a
  twenty-eight-hour pause and the same grant still worked.
- `device_bash` paths are `mnt/<folder>`; it times out at 45 seconds.
  `device_stage_files` takes the full `/Users/...` path.
- **NO GATE RUNS ON THE DEVICE VM.** `node_modules` is macOS, the VM is Linux
  arm64. **A background job does not survive between `device_bash` calls**; for
  sleeps use the cloud `Bash` tool and pass its `timeout`.
- **The bridge refuses `rm`.** Move a file into `_to_delete/` and tell Dann.
- **Re-staging a path already staged this session can return a STALE copy while
  reporting the NEW size.**
- **Re-staging a path AFTER editing your local copy overwrites the edit.** Stage
  before you edit, not after.
- **THE BRIDGE DROPS**, and so do the tool schemas. `RefreshMcpTools` on
  `remote-devices`, then `ToolSearch` by exact name. **A ToolSearch that returns
  nothing during a drop is a dropped connection, not a missing tool.** In E.51 the
  `mcp__remote-devices__*` schemas went deferred mid-session with the bridge still
  live; one `ToolSearch select:` call restored them.
- **BSD versus GNU.** `sed -i ''` and `stat -f %z` fail on the device VM. Use
  `python3` heredocs, and **write ASCII-only Python.** For non-ASCII content
  (Cyrillic, guillemets, accents) do NOT use a device heredoc: write the file in
  the container and bring it over with `SendUserFile` then `device_commit_files`.
- **`grep -n` numbers lines relative to its input.** Read with Python and print
  absolute indices. Restrict searches to `src` and pass `--include` filters.
- `device_list_dir` on `~/Downloads` exceeds the token cap; use `ls -lt`.

---

## Container

- `npx --yes typescript@5 tsc` fails. `npm i -D typescript` then
  `./node_modules/.bin/tsc` works.
- `pnpm --filter` resolves from the current directory. Give Dann the `cd`.
- **QR codes:** `pip install segno --break-system-packages`, then
  `segno.make(url, error='h').save(path, scale=12, border=4)`. A 102-character
  bypass URL lands at version 10 and scans off a screen.
- **Playwright:** see "Render it here before he prints it" under PRINT. Binary at
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, and `channel: 'chromium'`
  is required.
- **Vercel deploy timing, measured E.51:** `git push` to state READY is under two
  minutes, six times running. `sleep 115` in the cloud `Bash` tool then one
  `list_deployments` call is the right shape. Do not poll.
- **Dann's phone photographs are HEIC.** `pip install pillow-heif
  --break-system-packages`, `pillow_heif.register_heif_opener()`, then PIL opens
  them. **Crop and upscale a region before reading it**: the print-preview
  thumbnails were unreadable at full-frame and legible at 1400 px wide.

---

## Network refusals. Do not route around any of them

`ru.wikipedia.org` and the `fr.wikipedia.org` symbol pages are cache-only to
`WebFetch`. **CanLII, the Supreme Court's site, ScienceDirect, jvoice.org, PubMed,
npmjs.com package pages, and bundlephobia all refuse.**

---

## Known instrument faults in the code

- **`welchPSD` (`dsp.ts:225-241`) does not fail on a short buffer.** It returns an
  all-zero spectrum, which reads downstream as perfect silence rather than "no
  measurement." Guard on length yourself.
- **`stripBackingRect` matches `fill="#FFFFFF"` while `staff-renderer.ts` paints
  `#F0EBE0`.** Unsettled.

---

## Claude Code, and where the building happens from E.52

**The build moved off the bridge on 2026-08-16.** The reason is the line under
"The device bridge" above, which was already written and which E.52 wasted half an
hour re-deriving: **no gate runs on the device VM.** Writing code through the
bridge means Dann runs all five gates by hand and pastes the output back, once per
step. For a six-step build that is untenable.

- **Claude Code is in the desktop app, not the terminal.** `claude` is NOT
  installed on Dann's Mac; `claude --version` returns `command not found`
  (2026-08-16). It does not need to be. The desktop app's left sidebar has
  **Home** and **Code** tabs; Code is a full Claude Code session.
- **Point it at a folder** with **"Select folder…"** at the bottom of the Code
  tab, beside "Local". `~/Desktop/ilya-rewrite` associated 2026-08-16.
- **That session reads the repository directly.** No grant, no staging, no
  `device_stage_files`, and the gates run for real. `docs/memory/README.md`'s
  opener is the whole handover; nothing else needs writing.
- **What stays in a Cowork session:** rulings, design, Fable, anything needing
  taste. **What moves:** the building.

---

## Storage, as it actually is. Measured E.52

- **Ilya ALREADY uses IndexedDB.** `apps/web/src/lib/loader.ts:103-115` opens
  database **`ilya-data`**, version **1**, object store **`cache`**, holding the
  dictionary as chunked NDJSON. **`claude/e45-n67-storage-architecture_2026-08-13.md`
  recommends IndexedDB as though it were new. It is wrong about that.** A song
  store must share this database and bump its version, or open its own beside it.
- **`navigator.storage.persist()` and `.estimate()` have NEVER been called.** Zero
  occurrences across `apps` and `packages`, 2026-08-16. So the origin is
  best-effort and evictable, and the real quota on Dann's devices is unread.
- **`.musx` does not compress.** `gzip -9` on a 145,513-byte Kabalevsky returns
  **145,526**, thirteen bytes larger, because Finale's container is already a zip.
  Same on a 64,286-byte Musorgsky: 64,314 out. **The N.67 document's "15 to 25 KB
  compressed" is wrong.** Dann's real scores run **64 KB to 146 KB and stay there.**
- **PDF, image, and MIDI are in the picker and then refused.**
  `ScoreUploader.svelte:48` accepts them; `:184-187` classifies each as a "coming
  soon" note, copy at `i18n.ts:273-275`. **No heavy format is ingested today**, so
  nothing is yet built on the wrong storage assumption.
- **Thirteen live storage keys**: eleven `ilya:*` (ten written inline in
  `+page.svelte`, `ilya:pairings` in `pairings.ts:62`), plus `shane.profiles.v2`
  with a v1 migration at `profileStore.ts:173-205`, plus a sessionStorage
  `ilya-ios-hint-shown` at `InstallPrompt.svelte:52`.
- **`profileStore.ts:216-224` swallows its quota failure silently.** That is N.27.
  `pairings.ts:390-422` is the model to copy instead: an outcome with a reason,
  surfaced at `+page.svelte:1186-1194`.

---

## Project knowledge capacity

Measured 2026-08-13: **2.55 bytes per unit**, and a document costs roughly 5,900
units. The estate has a hard 2,000,000-unit ceiling. **This is why the memory lives
here and not there.**

---
*SOURCED from `claude/e48-thread-opener_v1_2026-08-13.md`, read in full 2026-08-13,
plus earlier handovers quoted in it, plus the capacity figures measured directly.
The PRINT section, the SSO and origin lines under Deploys, and the QR, HEIC, and
bridge-drop lines are new in E.51 and were learned by hitting them.*
