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
| web-test | **682** |
| score-parser | **444** passed, 5 skipped |

**Tell Dann the new gate number BEFORE he runs the ship script, not after.**

**A BRIEF THAT ASKS A FARMED-OUT AGENT TO RUN A GATE IS A BROKEN BRIEF.** No
gate runs anywhere but Dann's own machine, for the reason two sections down:
`node_modules` is macOS and every VM in reach is Linux arm64. **Corrected
2026-08-16: a Claude Code session pointed at the folder IS Dann's own machine
and runs all five for real** (E.53 did). What stays impossible is a cloud or
bridge VM. Tell the agent
that in the brief, and make its definition of done "the tests are written and
hand-traced," with the gate run listed under what Dann must do. **Running the
task on Dann's computer instead of in the cloud does NOT fix this**: that mode
is a Linux VM too.

**The baseline lives in `~/Downloads/ilya-ship.sh:79` and only moves with
Dann's permission.** It moved 408 to 416 on 2026-08-13 for `pairings.test.ts`,
416 to 438 on 2026-08-14 for `shift-lyrics.test.ts`, **438 to 470 on
2026-08-16** for N.67 step 0, **470 to 504 on 2026-08-16** for steps 1 and
2 (`migration.test.ts`, `driver.idb.test.ts`, `fingerprint.test.ts`), **504
to 511 on 2026-08-16** for step 3's merge rule, **511 to 517 on
2026-08-16** for step 4a's arrival decision, **517 to 537 on 2026-08-16**
for step 5's binder, **537 to 552 on 2026-08-16** for N.59 increment 1
(ten converter tests, four for the source carry-through, one for the title), and
**552 to 555 on 2026-08-16** for step 8's reader-route tests, **555 to 590 on
2026-08-18** for N.67 step 4b, **590 to 628 on 2026-08-18** for step 5's
`exchange.test.ts`, **628 to 671 on 2026-08-18** for step 6's
`notices.test.ts`, `salvage.test.ts`, and `positive-control.test.ts`, and
**671 to 682 on 2026-08-19** for N.73 portrait C's `reading-aid.test.ts`. **This
table had been stale at 555 for two moves.** The 628 move was asked for in step
5's memo and carried in the same ship run, so **the permission was taken rather
than given**; recorded plainly rather than tidied. **The 671 move was asked
first and granted before the `sed` was handed over**, which is the shape this
section asks for.

**`sed -i ''` ON `ilya-ship.sh` DROPS ITS EXECUTE BIT.** Found 2026-08-18 moving
gate 4 to 671. macOS `sed -i ''` rewrites the file rather than editing it, and
the new file came out `-rw-------`, so the next run was `Permission denied` and
looked like a problem with the ship rather than with the edit. **Follow every
baseline `sed` with `chmod +x ~/Downloads/ilya-ship.sh`.**

**In Claude Code the five gates run in about a minute, all five, in one command.**
That is the whole reason the build moved off the bridge. Run them yourself and
tell Dann the numbers; do not make him paste output back.

**`autofocus` MOVES THE WEB-CHECK GATE.** `svelte-check` raises
`a11y_autofocus`, taking it from 7 warnings to 8, so a dialog cannot use it.
Focus the safe button programmatically after `showModal()` instead. Measured
2026-08-16.

**`mscz-converter.test.ts` prints to stderr on three tests by design.** They
exercise failure paths. The ship script echoes those lines when a gate
deviates, and they are not failures. **Read the count, not the verdict.**

`vitest` never compiles a `.svelte` file. If logic needs testing it does not belong
in a `.svelte` file. `svelte-check` is what looks at components.

### RUNES ARE INERT UNDER VITEST. Measured 2026-08-16

**A `.svelte.ts` rune module compiles, type-checks, and builds with no
configuration work at all.** `svelte@^5.50.1`, the SvelteKit plugin, gates at
baseline, `pnpm build` clean. That half is settled.

**But its runes do nothing in a test.** `vite.config.ts` sets no `environment`,
so vitest runs in **node**, and vitest picks its transform pipeline from the
environment: node means the module is compiled in **server mode**, where
`$state` is a plain assignment, `$derived` computes once, and `$effect` compiles
to nothing. The signature is a test that passes while proving nothing: no error,
no reactivity, `$derived` stale at its initial value.

- **The failure is silent and looks like a pass.** A rune test must assert
  reactivity (mutate, then read a `$derived`), never just construction.
- `resolve.conditions: ['browser']` **does not fix it**, and the client build is
  already what resolves (`mount`, `hydrate`, and `flushSync` are all present).
  The transform, not the runtime, is what is wrong.
- **Vitest 4 has no config switch.** `viteEnvironment: 'client'` exists only on a
  custom `Environment` object. The ordinary route is a DOM environment, and
  neither `jsdom` nor `happy-dom` is installed, so it is a lockfile operation and
  therefore Dann's.
- **So: put nothing testable in a `.svelte.ts`.** N.67 step 0 is built this way
  on purpose. `library.ts` and `driver.ts` are plain TypeScript and carry every
  decision; `document.svelte.ts` holds fields, the factory, and the teardown, and
  nothing else.
- **The socket addendum's §5 says `flushSync` forces effects in a test. It does
  not, here.**

### `$state.snapshot` BEFORE INDEXEDDB, OR NOTHING SAVES. Measured 2026-08-16

**`$state` deeply proxies plain objects and arrays. IndexedDB writes through the
structured clone algorithm. Structured clone THROWS on a Proxy.** So a record
assembled out of rune state fails every single write with `DataCloneError`,
reported as `write-failed`, and the singer's work never lands.

```
const record = $state.snapshot(recordFromFields(...)) as SongRecord;
```

- **Step 0 never met this** because localStorage goes through `JSON.stringify`,
  which reads a proxy perfectly happily. The bug appears the moment the driver
  swaps, which is exactly the seam step 1 changes.
- **ALL FIVE GATES PASSED WITH THIS BUG LIVE.** Runes are inert under vitest, so
  no unit test can reach it. It was found in a real browser and nowhere else.
- The same applies to anything else handing rune state to a platform API:
  `structuredClone`, `postMessage`, the Cache API.

### THE EFFECT'S GUARDS ARE ORDER-SENSITIVE

The autosave effect skips its first run (the echo of the load) and skips runs
caused by applying another tab's record. **Priming must be checked FIRST.** With
the applying-check ahead of it, the constructor's own apply returns early
without ever setting the primed flag, so the next run swallows the singer's
FIRST REAL EDIT as though it were the load echo. Nothing saves until the second
change. Every gate passed with this live too, and the browser found it.

### `ssr = false`, and what it buys

`src/routes/+layout.ts` sets `ssr = false` and `prerender = true` (NOT `+page.ts`,
which carries N.67's load function and nothing else). **The page never
renders on a server**, so there is no hydration pass to disagree with, and state
may be read out of `localStorage` at component INIT rather than in `onMount`.
That is how N.67 step 0's document is loaded before it exists, with no `null`
window and no `{#if doc}` around the template.

`+page.svelte`'s `<html lang>` effect carries a comment saying "the served
document is lang=en until hydration" (the effect setting
`document.documentElement.lang`). **That is about the served shell, not about
this component's own render**, and it is not a reason to defer a read to
`onMount`.

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

## The ship script refuses on untracked files ANYWHERE in the repository

**`ilya-ship.sh:45-50` runs `git ls-files --others --exclude-standard` against
the whole repository**, not against `apps/`. A memo or a brief written into
`docs/sessions/` is an untracked file and will stop the ship before a single gate
runs. **Cost 2026-08-18: caught before Dann hit it, but only because the script
was read rather than remembered.**

**Before you ask him to ship, account for every file this session wrote to his
disk, including documents.** `device_commit_files` puts them there.

---

## Moving a gate baseline needs Dann's permission, and the `sed` needs checking

**Gate 4's baseline is a literal string in `ilya-ship.sh:79`**, not a number the
script derives. New tests move it and the script then refuses. Precedent: the
438-to-470 move at E.53 and the 555-to-590 move at 2026-08-18 were both put to
Dann first.

**Read the line before you hand him a `sed`.** A substitution that matches
nothing exits 0, changes nothing, and sends him into a confusing refusal. Read
`:79`, confirm the exact literal, hand him the command, then **re-read `:79`
after he runs it** and only then tell him it is done.

---

## `vite preview` DOES NOT SERVE `apps/web/build`, AND IT CACHES

Found 2026-08-18 during N.67 step 6's walk, after half an hour of measuring a
build that was not the one on disk. `pnpm --filter @ilya/web build` writes
`apps/web/build` through adapter-static. **`npx vite preview` serves the vite
`outDir` instead, and it resolves what it has ONCE at startup**, so after a
rebuild it goes on serving the previous build's hashed chunk names and 404s the
new ones. The page loads, runs old code, and nothing says so. A repair was
measured as still broken because of this, and nearly re-repaired.

**Serve the real thing:** `cd apps/web/build && python3 -m http.server 4200`.
**Restart it after every rebuild.** Check which bundle is live before believing
any measurement:

```
document.querySelector('link[rel=modulepreload]').href
```

## A WALK HARNESS BELONGS IN `build/index.html`, NEVER IN THE SOURCE TREE

To provoke a state that has to exist BEFORE `+page.ts` runs (no IndexedDB, no
localStorage), inject a `<script>` into `<head>` of `apps/web/build/index.html`,
gated on a query parameter. `build/` is gitignored and the next build erases it,
so the source tree never carries the stub and no gate can be fooled by it. Used
for N.67 step 6's `storage.none`, which cannot be reached any other way from a
console that only runs after the app has booted.

## TWO DRAWERS, AND THE STORAGE NOTICES ARE IN ONLY ONE OF THEM

`RootPanel.svelte` is the **Transcription** drawer and holds the song list.
`+page.svelte`'s `shanePanel` is the **Fit** drawer and holds every storage
notice. **A measurement that reads `.shane-storage-notice` on Transcription, or
`.song-row` on Fit, finds an empty list and means nothing by it.** Both mistakes
were made during N.67 step 6's walk. It is also a real defect for a singer who
never opens Fit, named in that step's memo and not solved.

**`innerWidth` is 0 in the browser pane, so Ilya's own mobile gate fires.**
Confirmed again 2026-08-18. Click **Continue anyway / Continuer quand même**
before looking for the textarea, or `document.querySelector('textarea')` returns
null and the next line throws on `getPrototypeOf(null)`.

## A STORED PROXY IS NOT A STORED VALUE, AND A SALVAGE PATH MUST CARRY THE RAW

N.67 step 6. When a stored record can be DAMAGED and the app rebuilds a usable
stand-in from it, **the export must carry the raw stored value and not the
rebuild**, or the only copy that outlives the browser is a repair the singer
never asked for. The trap that survived a first build: the OPEN song was taken
from the live document rather than from the vault, so the salvage path failed
for exactly the song the singer is looking at, and every gate passed.

## A SVELTE `{#each}` KEYED ON A REPEATABLE VALUE KILLS THE REGION

N.67 step 6. Two notices legitimately carried the same dictionary key, and
`each_key_duplicate` threw and destroyed the whole notice region **in exactly
the state the notices exist to describe**. For a list of plain paragraphs there
is no identity to preserve: do not key it. Dedupe at the source as well, so the
template never has to survive it.

## A SCREENSHOT PAIR IS NOT A CONTROLLED OBSERVATION. 2026-08-18, twice

**Two screenshots twenty seconds apart cannot tell you whether the app did
something or Dann did.** On 2026-08-18 a reload showed no transcription and then
a transcription, and the coordinator concluded that boot runs the pipeline and
told Dann so. **It does not.** The likeliest explanation was that Dann pressed
Transcribe between the two frames, and that possibility was never named. The
claim was withdrawn one step later when a second reload sat there untranscribed.

**Before reading a state change out of Dann's screen, name what else could have
produced it, and if a human hand is one of the candidates, ask.** This is tether
eleven applied to the walk instead of to a script.

---

## `app.css:93` BREAKS NATIVE MODALS. Measured 2026-08-16

**`*, *::before, *::after { margin: 0 }` overrides the user agent's
`dialog { margin: auto }`**, which is the rule that centres a modal. A
`showModal()` dialog therefore renders in the viewport's **top-left corner**,
and because the drawer starts at x=0 and is about the same width, it looks
convincingly like it was meant to be nested in the drawer.

Measured on the deploy: `(0, 0)` before, `(444, 357)` in a 1400 by 900 viewport
after adding `margin: auto` to the dialog. **Recovery: set `margin: auto`
explicitly on any `<dialog>`.** `:modal` reporting true is not evidence of
correct placement, only of modality.

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
measurement. The `isMobile` prop is already threaded from `+page.svelte` →
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

Both call the same bare `window.print()` (`+page.svelte`, `handlePrint`), so **neither
does anything Safari's Share → Print does not.** What they add is a gate:

- **Transcribe's**, `RootPanel.svelte:195-201` (the file is in
  `components/Drawer/`), `disabled={!hasResults}`. Transcribing is the whole
  prerequisite. **It is the better print test**, because the button lives inside
  the drawer and on a phone the drawer is the whole screen, so pressing it
  guarantees `app.css:201`'s `.drawer { display: none }` is exercised.
- **Fit's**, in `+page.svelte`, the button whose guard reads
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

**THE BRANCH ALIAS LAGS READY.** `get_deployment` reports READY well before
`ilya-git-shane-dannmittons-projects.vercel.app` flips to that build; on
2026-08-16 it took three polls at ten seconds after READY. **A walk that depends
on the alias must poll the ALIAS CONTENT, not the deployment state**: fetch a
file that changes per build, such as `/sw.js`'s `CACHE_VERSION`, and wait for it
to move.

**Do not tell Dann to clear website data; his readings live in `localStorage`.**
Send a QR only for a build whose change he can see.

**The cloud container cannot reach `*.vercel.app`.** Chrome on his Mac, or his
phone, is the way.

---

## Browser and extension

- **DANN USES CHROME ON HIS IPHONE. NOT SAFARI.** Said plainly because it was
  written wrong into a walk plan three times on 2026-08-16. Consequence, and it
  is a real one: **Chrome on iOS offers no Add to Home Screen**, and
  `InstallPrompt.svelte:48` already excludes `CriOS` and `FxiOS` so Ilya never
  asks for it. The install path exists only in Safari. **A singer on Chrome for
  iPhone can therefore never install Ilya.**
- **THERE ARE TWO FILE INPUTS SINCE N.67 STEP 5, and the binder's is FIRST in
  the DOM.** `page.locator('input[type=file]').first()` grabs the IMPORTER, not
  the score uploader, and feeding it a `.musicxml` produces a correct-looking
  "this file was not made by Ilya" rather than an upload. **Target them by
  class: `.file-input` is the score, `.binder-input` is the binder.**
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
  (`+page.svelte`, the `oningested` branch assigning `doc.pairings = noLyrics ?
  firstPass(...) : {}`). To see a restored value you must reload WITHOUT
  re-uploading.

---

## The device bridge

### A SPAWNED SUBAGENT INHERITS THE BRIDGE AND READS THE REPOSITORY DIRECTLY. E.57

**This changes the farm-out protocol.** An agent spawned from a Cowork desk can
call `device_bash` itself and `cat` the working tree on Dann's machine. It needs
no staging, and Dann pastes nothing. Both E.57 farm-outs ran this way: a Sonnet
inventory read 3,871 lines of the E.16 reader, and Fable read the modules and the
app before ruling.

- **Tell the agent explicitly, in its prompt, that the files are NOT in its own
  container** and that `mcp__remote-devices__device_bash` at `$HOME/mnt/ilya-rewrite`
  is the only way to see them. Give it a first command to verify with, and tell it
  to STOP and report NOT ESTABLISHED if the tool is missing or fails twice. Without
  that line an agent will search its own container, find nothing, and invent.
- **The older instruction to "write a brief Dann can paste into a fresh session"
  is now the SLOWER path.** It is still right when the work needs a full session's
  context window, or when the gates must run, since **no gate runs on the bridge**
  (see below) and only a Claude Code session pointed at the folder can run them.
- The two-subagent ceiling is unchanged and is not Dann's to waive.

### WHAT A FARM-OUT ACTUALLY COSTS. Two measured points, E.57

Quote the worst case and say it is a range. **A guess made without these ran 45%
under.**

| shape | measured |
|---|---|
| read ~3,900 lines and return a cited inventory | **131k tokens**, 42 tool calls |
| a design ruling and a build brief, reading already done | **106k tokens**, 25 tool calls |


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
- **`pnpm --filter` FROM `~` IS NOT MERELY WRONG, IT IS DESTRUCTIVE.** Run
  without a `cd`, pnpm treats the HOME directory as the workspace root, reports
  **"Scope: 884 of 6192 projects"**, walks into the macOS container aliases that
  mirror `~/Desktop` back at themselves, and dies with
  `ERR_PNPM_UNEXPECTED_VIRTUAL_STORE`. **It has already edited `package.json`
  by then**, and it leaves a stray 654 KB `apps/web/pnpm-lock.yaml` whose
  workspace links point into `link:../../../../../../../pnpm/store/…`.
  **Recovery: delete the stray lockfile, then
  `pnpm -C ~/Desktop/ilya-rewrite install --lockfile-only`**, which reconciles
  the real lockfile and never relinks `node_modules`. Measured 2026-08-16.
- **THE BUNDLE-SIZE INSTRUMENT IS NOISY, AND ONE FORM OF IT IS USELESS.** Two
  builds from IDENTICAL source differ: raw total by **4 bytes**, gzip of all
  JS concatenated by **443 bytes** (it depends on `find` order, and chunk hashes
  rename files between builds), and the **sum of per-file gzip by 1 byte**.
  **Only the per-file sum is trustworthy**:
  `find build/_app -name '*.js' -exec sh -c 'gzip -9 -c "$1" | wc -c' _ {} \; | paste -sd+ - | bc`.
  A claim smaller than about half a kilobyte cannot be made with the
  concatenation method at all. The 18.7 KB measured for `bits-ui` stands,
  being far outside that band.
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

## THE PAGE READER, N.59. Measured 2026-08-16

- **Pyodide v0.26.4 from `cdn.jsdelivr.net/pyodide/v0.26.4/full/` carries
  cv2 4.9.0 and numpy 1.26.4**, confirmed in a browser. The pin is the whole
  point: E.43 measured 37 noteheads against 36 on the same page at cv2 4.13.
- **The spike's `loadPackage` list is `['numpy','opencv-python']` and NOTHING
  else.** Every `matplotlib` and `leipzig` string in
  `~/Downloads/ilya-reader-spike.html` lives inside its embedded module blob on
  line 82, not in its own setup. The spike calls `reader.read_page_pitch`, so it
  never imports `rest_templates` or `timesig` and never needs matplotlib.
  **`envelope.run` does**, and matplotlib drags in 13 packages (Pillow,
  fonttools, kiwisolver, matplotlib-pyodide, and friends).
- **Load costs, measured in Chromium:** numpy + opencv alone **2.46 s**; plus
  matplotlib **3.67 s**; the whole worker warm-up including 10 module fetches and
  2 cache fetches **3.36 s**. E.43's floor was 2.9 s and did not include
  matplotlib.
- **`envelope.run` is 1.96 to 2.36 s per page, and that is NOT E.43's 0.867 s.**
  E.43 timed `read_page_pitch`; the envelope adds rests, beams, time signatures,
  and metre. **The like-for-like was never measured. Do not report one as the
  other.**
- **`~/Downloads/ilya-test-page.png` is a REPOSITORY FIXTURE.** SHA-256
  `b0c91c1c…`, byte-identical to
  `tools/e16-harness/output/mussorgsky---sunless-06---on-the-river/page2_300dpi.png`.
  It is 2480 x 2883, 8 staves, s = 21.0, four systems of two. **E.43's 12 staves
  and s = 17.00 belong to a different page.** Its clef and key ground truth
  (G2, octaveChange -1, seven sharps) is right.
- **PIECE 06 IS PIANO-FIRST: staff 0 is the piano and the voice is staff 1.**
  Read that page and Ilya reads the accompaniment. Twenty of its 37 notes
  abstain on duration. **For a walk that shows the voice, use
  `mussorgsky---sunless-01---within-four-walls/page1_300dpi.png` with bass clef
  and two sharps**: staff 0 is the voice, 78 notes, 12 rests, 12 measures, zero
  abstentions. A copy is at `~/Downloads/ilya-voice-page.png`.
- **NO FIXTURE IN THIS REPOSITORY CONTAINS A BRACE.** Every Verovio render joins
  voice and piano with the system barline alone. Dann's brace rule is about a
  three-stave braced grand staff, and **its central case has no instrument
  here**: the rule falls back to staff 0 on every system and counts the
  fallback. Proving the brace rule needs a page nobody has yet.
- **The system barline IS a clean grouping signal**, unlike the struck gap
  heuristic: within a system the left-edge column reads 100% filled through the
  gap, between systems 4 to 5%.
- **`detect_staves` can return ZERO staves without raising.** Its "groups of two
  lines or fewer are spurious" branch discards silently, and
  `b3-ledger-lines-scale-page.png` at s = 10.0 yields nothing at all. That is
  the reader's lower bound on staff spacing, and it supports the retention
  floor of s at least 20.
- **`measures_per_system` is `len(barlines)`, NOT `len(barlines) + 1`.** The
  E.57 brief carried the off-by-one. Summed per piece against ground truth, the
  +1 form is wrong on all six Musorgsky pieces by exactly the number of systems.
- **The harness run configs are in `tools/e16-harness/e16_scratch_2026-07-28/`**,
  `gate02_legacy_p01p1.py` and `gate03_close_fixture.py`. E.57 could not find
  them. gate02 gives piece 01 page 1: `vocal=[0,2,4,6]`,
  `measures_per_system=[3,3,3,3]`, clef ('F',4), key 2.
- **Running the reader writes `__pycache__` beside the modules**, which is an
  untracked file and blocks the ship script. Ignored at
  `tools/e16-harness/.gitignore` since 2026-08-16.
- **`npx vite dev` BYPASSES the copy script.** `apps/web/static/reader/` is
  generated by `scripts/copy-reader.mjs`, which only runs from `pnpm dev` and
  `pnpm build`. Start the dev server the wrong way and the browser silently
  serves a STALE reader; it cost one confusing `TypeError` about a function
  signature that had already been changed. **Editing a reader module during a
  dev session also needs a restart.**
- **A greyscale PNG of a 300 dpi page is about 830 KB**, and IndexedDB reports
  roughly 25 MB of usage for one. Quota on Dann's Mac is about 2 GB.

## THE PHOTO PROBE, E.59. Measured 2026-08-17 on two toolchains, NEITHER a browser

- **`_derive_rowfrac_gate`'s premise is false for photographs.** It accepts the
  page's highest coverage segment unconditionally, then walks down accepting
  only segments that are tight (span < 0.0137) AND populous (>= 5 members). On
  a Verovio render the staff lines form one 13-member segment spanning 0.019.
  **On a photocopied photograph the rows of ONE physical staff line spread
  0.71 to 0.91 and shatter into singletons.** The walk accepts one singleton
  and stops at the next for lack of a quorum.
- **Cropping the frame does not fix it.** Interior gate 0.897266, one row still
  passes. The scan border was a symptom, not the cause.
- **`substrate.py` is a SENTINEL, not a decider** (`reader.py:377-379`). Its
  binding rule is ratified: downstream of every decision, upstream of none.
- **Concentration cannot be a decider and this is measured, not argued.** Any
  row whose ink is a single run scores exactly 1.0000 regardless of mass: one
  speck, one barline, one stem. 5,584 non-band rows at 1.0000 against a keep
  minimum K_S = 0.9737. The separation interval is empty. **The discriminator
  is the EXTENT conjunct.**
- **`g = 1 px` is a corpus measurement, not a constant.** Its own docstring:
  the derivation is ratified, the number is not, and g is re-derived whenever
  the corpus changes. **A photograph is a new corpus.**
- ~~**CORRECTION to this file's own record, line 659.** The run-length
  estimator's 19 on this photograph was recorded as a soft smear "against a
  hand measurement of 17.0". The probe located the actual staff-line rows at
  page rows 2045-47, 2064-66, 2083-85, 2102-04, and 2122: **five lines,
  spacing exactly 19 px.** The estimator was right and the hand measurement is
  what the correction lands on.~~ **SUPERSEDED 2026-08-18. BOTH NUMBERS ARE
  RIGHT AND THE PAGE VARIES BY REGION: s runs 17.00 at staff 1 to 21.00 at
  staff 12, monotone.** The hand measurement read staff 1; the probe read
  staff 7. See §THE PHOTOGRAPH IS WARPED at the end of this file, which is
  authoritative on this page's geometry.
- **THE TOOLCHAINS, and why agreement between them is worth something.** The
  desktop runs python 3.14.3 / numpy 2.4.3 / cv2 4.11.0 with `intp` = int64.
  The device bridge VM runs Linux aarch64, python 3.10.12, numpy 2.2.6, and
  **cv2 5.0.0**. Pyodide runs cv2 4.9.0 / numpy 1.26.4 at 32 bits. **That is
  three, and only the first two have ever run this probe.** A subagent
  measuring on the bridge must reproduce a desktop number before its new ones
  count. **Agreement between desktop and bridge says nothing whatever about
  the browser**; E.58's `np.bincount` fault passed every desktop run and threw
  only in Pyodide.
- **HEIC in the cloud container.** ImageMagick's heic delegate fails with
  "Unsupported codec". `pip install pillow-heif --break-system-packages`, then
  `pillow_heif.register_heif_opener()`, then open with PIL.

## PYODIDE IS 32-BIT. `np.intp` IS int32, AND int64 BREAKS `np.bincount`

Measured 2026-08-16, in the browser and nowhere else.

```
TypeError: Cannot cast array data from dtype('int64') to dtype('int32')
           according to the rule 'safe'
```

**A 64-bit desktop numpy accepts an int64 array in `np.bincount` and Pyodide's
WASM numpy refuses it**, because WASM is 32-bit so `np.intp` is int32. Every
local Python proof passed; the fault existed only in the browser, and only the
browser could find it. **Use `np.intp` for anything that will index or be
counted, never `np.int64`.**

This is the same shape as `$state.snapshot` before IndexedDB: a whole class of
bug that no gate and no local run can reach.

## PDF IMPORT, N.59 STEP 8. Measured 2026-08-16

- **`pdfjs-dist` 6.2.108**, Apache-2.0, ZERO runtime dependencies, 20.4 million
  weekly downloads, pinned EXACTLY rather than with a caret. Dann's ruling.
- **Weight, measured by unpacking the tarball and by building:** `pdf.mjs`
  **141,847 gzipped** as a lazy chunk, `pdf.worker…mjs` **470,500 gzipped** as a
  separate asset. **Up-front JS for a singer who never drops a PDF: 30,546
  bytes** across the 10 chunks `index.html` loads. The whole-app per-file gzip
  sum went to **550,730**, and every added byte is lazy.
- **400 dpi, per Ruling E.** A letter page rasterizes to about 3400 x 4400 and
  reads at **s = 29.0**, inside the retention ruling's "retained near 28 to 30".
- **THE SAME MUSIC READS DIFFERENTLY AT DIFFERENT SPACINGS.** Musorgsky 01 p1
  gives **78 notes at s = 21** from the PNG and **79 notes with one pitch
  abstention at s = 29** from a PDF of the same engraving. E.43's 37-against-36
  precedent again. Do not treat a read as reproducible across resolutions.
- **A PDF is STORED BYTE FOR BYTE**, not as its rasters, on the `.musx`
  precedent. A photograph has no better original, so its greyscale ink is both
  what is read and what is stored.
- **`PDFDocumentProxy` has no `destroy()`.** Teardown is `loadingTask.destroy()`.
- pdf.js logs `Math.sumPrecise is not a function` while substituting Times
  fonts. Harmless here: no `standardFontDataUrl` is configured, so TEXT may
  render wrong, while embedded notation glyphs are unaffected.
- **A PDF page is TRANSPARENT where nothing is drawn.** Fill the canvas white
  before rendering or the reader's `img < 128` reads the whole page as ink.
- **To make a true vector-PDF fixture with no dependency:** print a Verovio SVG
  from the harness output through Playwright's `page.pdf({ format: 'Letter' })`.
  Sizing it in CSS pixels instead gives a 21-inch page and a 94-megapixel
  raster.

## THE NaN THAT CRASHED THE READ, AND ITS GUARD. E.58

**`detect_staves` returned `s = NaN` and nobody noticed for four frames.**
`reader.py`'s `rowfrac` is a FULL-PAGE horizontal projection, which only means
"this row is a staff line" when the page is square to the frame. On Dann's
photograph, rotated 1.04 degrees, the top line drifts 29 px across 1,600 px and
the projection smears every line into its neighbours. `np.median` of an empty
array returns NaN twice in a row without raising, and `int(1.7 * s)` in
`beams.py` raised four frames later. **The uploader then invented a reason.**

- Guarded 2026-08-16: a non-finite or implausible `s` now raises the function's
  own `RuntimeError("no staff lines")`, and an EMPTY staff list does too, which
  it previously returned silently (`b3-ledger-lines-scale-page.png` does exactly
  that at s = 10.0).
- **The fallback is Cardoso and Rebelo, ICPR 2010**, paired black-plus-white run
  lengths per column, immune to rotation because it never sums across the page
  width. **A FALLBACK, never primary**, so the 23 fixture pages stay
  byte-identical; measured, they do, with zero firings.
- **On a clean render it is sharp and on a photograph it is not.** The fixture
  gives a single peak at 21 with 6,895 counts against 2,090 for the runner-up.
  The photograph gives 19:2973, 18:2626, 21:2216, 20:2162, 17:1213 — a smear
  across 17 to 22 with no dominant peak, against a hand measurement of 17.0.
  ~~**Treat its value on a photograph as approximate.**~~ **CORRECTED
  2026-08-18: THAT SMEAR IS NOT NOISE. It is the page's real s-distribution,
  and its peaks are its regions.** s runs 17 at the top to 21 at the bottom.
  The estimator was reporting the page correctly and the page was the problem.
- ~~`i18n.ts`'s `upload.err.pageReadFailed` asserts a cause the code has not
  established~~ **CORRECTED 2026-08-17.** It said "A flat, straight photograph of
  the whole page reads best" and was printed for every reader failure,
  including an unguarded NaN. It now names no cause. The lesson it taught is
  kept below under THE COORDINATING DESK'S OWN INSTRUMENTS.

## VALIDATERECORD DROPPED THE SOURCE, AND HAD SINCE N.67 STEP 1

`library.ts`'s `validateRecord` rebuilds the record field by field from
`emptySongRecord`, and **`source` was simply not among the fields it copied**,
so every load returned `record.source === null`. Fixed 2026-08-16 with four
tests.

**Its other victim, which nobody had noticed: N.67 step 4a's chimera warning
cannot fire on the first upload after a reload**, because `handleArrival` reads
`doc.source?.fingerprint` and that was always undefined on a fresh load. It
works within one session, because the upload that just happened set it in
memory. **That is why the walk did not catch it: the walk never reloaded
between uploads.** Any future walk of an arrival decision must reload first.

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

### THE FILE PICKER ON iOS. Learned E.55, the hard way, at 3 a.m.

**iOS matches a file input's `accept` list by REGISTERED TYPE, not by string.**
It has no registration for `.musicxml`, so the picker greys the file out and a
singer on an iPhone cannot choose it at all. Ilya's ACCEPT
(`ScoreUploader.svelte`) lists `.musicxml` and `.mnx` and `.musx` and `.mscz`,
none of which iOS knows. `.xml`, `.pdf`, and `image/*` it does know.

- **Diagnose it from the picker itself**: the greyed rows are the ones outside
  the accept list. In Dann's screenshot the PDFs and screenshots were black and
  every MusicXML and DOCX was grey.
- **The same bytes under a `.xml` name ingest perfectly** ("Format: MusicXML
  (direct)", verified on the deploy), because `detectScoreFormat` sniffs.
- **DO NOT send Dann on a file-transfer errand.** AirDrop, renaming in Files,
  and Google Drive were all tried in E.55 and all of them cost him more than the
  walk was worth. **The desktop picker has no such restriction: move the walk to
  the Mac and it evaporates.**

### DRIVE A REAL BROWSER YOURSELF. Playwright is installed. Learned E.54

**This is now the best instrument on this project, and it beat every other one.**
Chromium 1208 is in `~/Library/Caches/ms-playwright/` and `playwright@1.58.2` is
in the store. A harness that boots the app, seeds an origin, uploads a score,
reloads, and reads IndexedDB runs in about thirty seconds and finds what the
gates structurally cannot.

- **Write the script in the SESSION SCRATCHPAD, never in the repository**, or it
  becomes an untracked file and the ship script refuses.
- Because the scratchpad is outside the workspace, a bare `import 'playwright'`
  does not resolve. **Import by absolute path:**
  `/Users/dannmitton/Desktop/ilya-rewrite/node_modules/.pnpm/playwright@1.58.2/node_modules/playwright/index.mjs`.
- **To test a migration you must seed the origin BEFORE the app's first load.**
  Navigate to a static asset on the same origin first
  (`/manifest.webmanifest`), write the keys there, then navigate to `/`. Loading
  the app first sets the migration flag and there is nothing left to migrate.
- **`fake-indexeddb`: close the database before `deleteDatabase` in `afterEach`.**
  An open connection blocks the delete, the blocked delete blocks the next open,
  and the whole FILE hangs rather than failing. Cost: one 120-second run.
- **The Fit stave DOES draw without a voice profile.** An earlier note here
  was wrong: `[data-note-id]` does not exist in this tree at all. The note hit
  targets are **`[data-hit]`** rectangles carrying the event id, and the stave
  renders with withheld sigla when no profile is calibrated. Fit's Print button
  is still a good marker for "a score is ingested": it is disabled unless
  `ingestedScore` is set, so enabled-after-reload proves the source survived.
- **A DISPATCHED CLICK IS NOT A CLICK, AND THE DIFFERENCE WAS A REAL BUG.**
  `el.dispatchEvent(new MouseEvent('click'))` bypasses hit testing, so it
  succeeds where a user fails. When a dispatched click is needed to make
  something work, **that is a finding, not a workaround**: in E.55 the notehead
  glyph was intercepting clicks over its own hit rectangle, I dispatched around
  it, and Dann hit the wall an hour later. Use `page.mouse.click(x, y)` at real
  coordinates, and `document.elementFromPoint` to see what is actually on top.

### TESTING A SERVICE WORKER LOCALLY. Learned E.56, three lies deep

**`app.html:30` deliberately unregisters the worker on `localhost` and
`127.0.0.1`** — and those are the only hosts where a worker is permitted over
plain HTTP. So a local harness must patch the **copied build output**, never the
source, to register unconditionally. Say so when reporting, because what is then
under test is the worker lifecycle and not the registration gate.

**Two ways a local static server will lie to you about caching:**

- **`python3 -m http.server` sends NO `cache-control`.** Vercel sends
  `public, max-age=0, must-revalidate` on both `/` and `/sw.js` (measured
  2026-08-16). Under the bare server the browser applies heuristic caching and
  feeds the OLD page to the new worker's install.
- **`cp -R` PRESERVES MTIMES on macOS**, so two copied build directories serve
  an identical `Last-Modified`, the server answers **304 Not Modified**, and the
  browser keeps serving the old build. Any "which build am I on" test is then
  measuring nothing, silently.

**What a local harness CAN prove**, and it is the part that matters: that a
changed worker is INSTALLED. `registration.waiting` becomes non-null and a
second cache appears; with a byte-identical worker it stays null forever. Run
the unfixed worker as a positive control or the pass proves nothing.

**What it cannot honestly prove is that the new code is then served**, because
one static server cannot imitate two Vercel deployments. That belongs in a real
two-deploy walk.

### Observing your own work in Claude Code, learned E.53

**You can watch the app yourself. Do not use Dann as the renderer here either.**
Start the dev server from `apps/web` on a spare port, then open the Browser pane
at that URL. A full save-and-reload observation takes about two minutes.

- **`.claude/` is NOT in `.gitignore`.** Creating `.claude/launch.json` for
  `preview_start` leaves an untracked file, and **the ship script refuses on
  untracked files**, so it will block the ship. Start the server another way, or
  delete the file before shipping.
- **The Browser pane can report a 0x0 viewport**, which makes `window.innerWidth`
  0, which trips Ilya's own mobile gate ("Continue anyway"). The DOM is still
  live and scriptable when this happens.
- **A HIDDEN Browser pane freezes every async call.** Synchronous `evaluate`
  still returns, but any promise (a timer, an IndexedDB transaction) times out
  at 30 seconds and reports "the pane may be stuck". It is not stuck; it is
  backgrounded, which this file has warned about since E.51. **Use Playwright
  instead of asking Dann to raise a window** (section above).
- **To drive a Svelte-bound input from `javascript_tool`**, use the native
  setter and dispatch the event: `Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype, 'value').set.call(el, v)` then
  `el.dispatchEvent(new Event('input', { bubbles: true }))`. `form_input` works
  too where the element has a ref.
- **A localhost port is its own origin**, so its `localStorage` is a clean room
  and clearing it costs Dann nothing. Clear it when you are done.

## `<dialog>`'s `close` EVENT DOES NOT FIRE IN THE IN-APP BROWSER PANE. 2026-08-18

**`close()` shuts the dialog and fires NO `close` event** in the Chromium the
Claude Code browser pane drives. Confirmed on a bare `<dialog>` built in the
console with no framework near it: `open` goes true, `close()` sets it false,
and a listener added with `addEventListener('close', …)` never runs, at 300 ms
and again at 900 ms.

**Cost, N.67 step 5:** a collision dialog written to resolve its answer from the
close event hung the whole import on the first colliding song. Every one of the
five gates passed with the hang live, because runes are inert under vitest and
the module underneath was correct. **The browser found it and nothing else
could.**

- **Never make a dialog's answer depend on the `close` event.** Resolve from the
  press, and guard `onclose` with `if (dialogEl?.open) return` so a late event
  cannot blank or answer the next dialog in a sequence.
- **This also means `onclose` cleanup may never run here.** `+page.svelte`
  clears `pendingConfirm` and `pendingArrival` there. Whether that holds in
  Safari and desktop Chrome is NOT ESTABLISHED. **If it does hold there, then
  neither has been cleared on close since N.67 step 4a**, which is a
  pre-existing condition larger than step 5 and worth chasing on its own.
- **A real Escape key press did not close a modal in this pane either.** Whether
  Escape works for a singer is therefore not testable from here, and step 5's
  `oncancel` handler is consequently **written but unexercised**.

### Driving the app from the pane, the instruments that work

- **A file input takes a real file** via `DataTransfer`: build a `File`, assign
  `input.files = dt.files`, dispatch `new Event('change', {bubbles: true})`. The
  real handler runs.
- **A download is readable** by wrapping `URL.createObjectURL` to keep the Blob
  and stubbing `HTMLAnchorElement.prototype.click` so no download sheet blocks
  the run. The export code itself is untouched.
- **`requestAnimationFrame` never fires while the pane is hidden.** A poll built
  on it hangs until the tool times out. Use `setTimeout`.
- **Vite refuses `/@fs/` outside its root** (403), so repository fixtures under
  `tools/` cannot be fetched from the page. A three-line `http.server` with
  `Access-Control-Allow-Origin: *` on another port is the way in.
- **The language toggle is `<span role="button">`, not `<button>`.** A
  `querySelectorAll('button')` search for it finds nothing and `?.click()` fails
  silently. Use `.lang-option`.

### RENAMING INSIDE A LARGE COMPONENT. The method, E.53

**Delete the declarations FIRST.** Then every surviving reference is a
`svelte-check` error, and the compiler enumerates them for you. Insert at exactly
the reported `line:col`, after asserting the identifier really is at that
position. **The compiler cannot report a comment, a string literal, or an import
path, so nothing else can be hit**, and 0 errors at the end is the proof rather
than a promise. 44 of 44 applied with zero mismatches on `+page.svelte`.

Two traps it does not cover, both of which surface as a DIFFERENT error and must
be fixed by hand: **`{shorthand}` props** (`{metadata}` must become
`metadata={doc.metadata}`; `{doc.metadata}` is not valid shorthand) and
**object-literal shorthand** (`{ metadata, fromScore }`).

**`grep -c` counts matching LINES, not occurrences.** Fable's blast-radius
numbers were built on it and ran two low. Use `grep -oE ... | wc -l`, and then
read the lines anyway.

---

## Storage, as it actually is. Measured E.52

- **`ilya-library` now exists**, version 1, stores `songs` / `sources` / `meta`,
  created at N.67 step 1. Separate from `ilya-data` on purpose: that one is
  pinned at version 1 and upgrading it would break the dictionary loader.
  **Dev dependency added 2026-08-16, Dann's ruling: `fake-indexeddb` 6.2.5,
  Apache-2.0, zero runtime deps, dev-only, zero shipped bytes.**
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
- **Thirteen live storage keys.** **Changed at `4568e01`, N.67 step 0:** the six
  per-song keys (`ilya:inputText`, `ilya:metadata`, `ilya:metadataFromScore`,
  `ilya:glossOverrides`, `ilya:openSyllabification`, `ilya:pairings`) are now
  written ONLY by `lib/library/driver.ts`, byte-compatibly, as one whole-record
  write. **`+page.svelte` no longer touches them at all**, and `savePairings` /
  `loadPairings` are no longer called from it. The other seven are unchanged and
  stay device preferences: `ilya:language`, `ilya:notationPrefs`,
  `ilya:showStressDiacritics`, `ilya:activeTab`, `ilya:drawerCollapsed`,
  `shane.profiles.v2` (v1 migration at `profileStore.ts:173-205`), and the
  sessionStorage `ilya-ios-hint-shown` at `InstallPrompt.svelte:52`.
- **The five formerly silent write sites now report.** The poem, the metadata,
  its tags, the glosses, and the syllabification choice used to `catch {}` and
  say nothing; they ride the song save's outcome now and surface through
  `doc.saveFailure` at the drawer notice. N.27's own site
  (`profileStore.ts:216-224`) is still silent and still open.
- **`profileStore.ts:216-224` swallows its quota failure silently.** That is N.27.
  `pairings.ts:390-422` is the model to copy instead: an outcome with a reason,
  surfaced at `+page.svelte`'s drawer storage notice, now keyed on
  `doc.saveFailure` / `doc.loadFailure`.

---

## THE COORDINATING DESK'S OWN INSTRUMENTS. Learned E.58, all the hard way

These are traps for the desk that RULES, not the one that builds. Every one cost
time. Unless a bullet names its own date, it was 2026-08-16.

- **THE DEVTOOLS CONSOLE FILTER PERSISTS ACROSS RELOADS, AND IT LIES BY
  OMISSION.** Dann's console carried the word `plausibility` in its filter box
  from some earlier session. The toolbar read **5 errors, 3 warnings, 14 hidden**
  and the pane showed nothing. **A full hour went into inferring a cause from a
  UI string while the traceback sat two clicks away.** Before reading any console,
  clear the filter box and say you have. Tether 11 is exactly this and it was not
  followed.
- **A MESSAGE FROM A `catch` BLOCK IS NOT EVIDENCE ABOUT THE INPUT.**
  `upload.err.pageReadFailed` said the photograph should be flat and straight. It
  was printed for an unguarded NaN. The code had established nothing about
  flatness. **Treat user-facing error copy as a claim by the person who wrote the
  string, never as a reading of the data.**
- **THE VERCEL CONNECTOR GIVES YOU THE DEPLOY URL. DO NOT ASK DANN FOR IT.**
  `list_teams` -> `list_projects` -> `list_deployments` returns every deployment
  with its `githubCommitSha`, its `state`, and its sha-pinned `url`. Project
  `ilya` is `prj_oOvEOXnovbEkVBAOQRmTmgxJK0DB`, team
  `team_CmkdrV66wAIF29pQLpiAb80O`. `get_project_deployment_protection` confirms
  password, SSO, and trusted-IP are all off, which is how you tell a broken phone
  from a broken deploy. Asking Dann for a URL you can fetch is a defect.
- **QR CODES: `pip install segno`, then `segno.make(url, error='h').save(p,
  scale=14)`.** Dann scans it off the Mac screen with the iPhone camera. The
  camera opens Safari, not Chrome; for anything that is not engine-specific that
  is fine, because Chrome on iOS draws with WebKit.
- **HEIC. Two platforms, two different codes, same file.** Desktop Chromium
  REFUSES a raw `.HEIC` at `createImageBitmap`, so `upload.err.imageUndecodable`
  fires and the reader is never reached. On Chrome for iOS the picture gets
  through to the reader. **Whether iOS WebKit decodes HEIC or the picker
  transcodes to JPEG is STILL NOT ESTABLISHED**; both produce the identical
  screen. To read a HEIC in Python on Dann's Mac with no install:
  `sips -s format png in.HEIC --out out.png`. In this container,
  `pip install pillow-heif` and `pillow_heif.register_heif_opener()`.
- **MEASURING STAFF SPACE ON A TILTED PHOTOGRAPH: PROJECT NARROW SLICES.** A
  full-width row projection is destroyed by one degree of rotation, because a
  line drifts nearly two staff spaces across a system. **A 200 px wide slice
  moves it 3.5 px and finds all five lines cleanly.** This recovered `s = 17.0`
  at five separate x positions on Dann's untouched photograph, and it was the
  measurement that found the bug. It is a DESK instrument for diagnosis; the
  reader's own fallback is Cardoso and Rebelo run lengths, which is different and
  cheaper.
- **AUTOMATIC PAGE-BOUNDARY DETECTION BY LARGEST CONTOUR DOES NOT WORK ON A
  PHOTOGRAPH OF A BOOK.** Otsu plus `findContours` plus `approxPolyDP` returned
  the FRAME corners, area fraction 0.905, not the page. The deskew it produced
  was worthless. **Measure the tilt from the staff lines themselves** and rotate
  by that: residual went from 1.04 degrees to 0.07, and a full-width projection
  that had found nothing then found 7 lines at 17 px. That is a positive control,
  and it is the right shape for one.
- **DANN'S PHOTOGRAPHS, kept because they are the only real ones this project
  has.** `~/Downloads/IMG_5162.HEIC` (3024 x 4032, tilt 1.04 deg, s = 17.0) and
  `IMG_5165.HEIC` (tilt 3.29 deg, worse, and it was the one that felt more
  careful). `~/Downloads/score-page32-deskewed.png` is 5162 rotated flat and
  cropped. **All three are Kabalevsky op. 52 no. 9 page 32, four systems of three
  staves with the lower two braced**, which makes them the only braced fixture in
  existence here.

- **A CLEAN `git status` AT SESSION OPEN DOES NOT STAY TRUE, AND THE TREE CAN MOVE
  UNDER YOU MID-SESSION. 2026-08-18.** This desk opened on a clean tree at
  `ed8318e`, read `STATE.md` at 58,067 bytes, and wrote a brief against it. Eleven
  hours later a parallel session had added 2,955 bytes to that same file and left
  three untracked documents in `docs/sessions/`. **The change was caught only
  because the session-open copy of `STATE.md` had been kept and the two were
  compared.** THE ONE THING was unchanged, so the brief held, but it need not have
  been. **The method, which costs nothing: on staging any memory file, copy it
  aside under a name that says when it was read, and diff before you rely on it at
  the close.** A file comparison is not a git operation, so this stays inside the
  rule that this desk never runs git. **The corollary that bit at the same moment:
  `ilya-ship.sh` refuses on untracked files ANYWHERE in the repository, so another
  session's uncommitted documents will stall YOUR ship**, at the end, after the
  work is done.

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


## THE PHOTOGRAPH IS WARPED, AND THIS IS THE NUMBER THAT GOVERNS IT

**Measured 2026-08-18 by two Opus Code sessions. AUTHORITATIVE on the geometry
of `~/Downloads/score-page32-deskewed.png`, and it supersedes every earlier note
in this file about that page's `s`.** Full account and every table:
`docs/sessions/e60-memo-n59-phase0_2026-08-18.md` and the slice-probe memo.

- **THE DESKEW WAS FITTED TO STAFF 7, AND STAFF 7 IS THE ONLY FLAT BAND.**
  Shear runs monotonically **−1.01° at the top to +1.47° at the bottom**,
  crossing zero at staff 7. **2.48° end to end.** A single global rotation
  cannot correct it. Keystone, page curl, or lens distortion: NOT ESTABLISHED,
  and telling them apart needs a second photograph.
- **`s` VARIES BY REGION: 17.00 at staff 1 to 21.00 at staff 12, monotone.**
  There is no single `s` on this page, and `detect_staves` returns one.
- **A STAFF LINE ON STAFF 12 OCCUPIES 71 PAGE ROWS.** On staff 7 it occupies
  12. On staff 12, line 2 begins **48 rows before line 1 ends**: adjacent staff
  lines overlap in row space, so no proximity rule can separate them.
- **THE TOLERANCE. Line grouping at `reader.py:291` needs |shear| ≲ 0.12°.**
  Lines merge once `D + thickness + 3 ≥ s`, so `D ≥ 11` at `s ≈ 19`. **Only
  staves within ±0.12° of flat survive, which is exactly the two the deskew was
  fitted to.** Any fix must cut shear roughly twentyfold.
- **Line thickness on this page: median 4 px, 83 % at 3–5 px**, over 123,210
  columns. A vertical dark run longer than 6 px is a stem or a notehead merging
  with the line, not the line.
- **Twelve staves, four systems of three, at rows 628, 800, 1030, 1325, 1559,
  1747, 2041, 2247, 2466, 2786, 3064, 3270.** 1,271 true staff rows.
- **The 16 px left strip WIDENS to 263–334 px below row 3600** and is the single
  largest contaminator on the page. What it is remains NOT ESTABLISHED.

### Two instruments that are now known to lie, and where

- **NARROW-SLICE COMB MATCHING IS A DESK INSTRUMENT AND NOT A DECIDER.** It
  finds all 12 bands on the photograph and reproduces the working reader to
  within 0.5 px on all 40 lines of `ilya-voice-page.png`. It then fails the
  fixture corpus **0 of 23**: ten pages raise, thirteen move line positions
  1–3 px, two change staff count. **The ten raises are clean renders, not warped
  pages: LYRIC BASELINES FORM FIVE-LINE COMBS**, so it finds 9–12 combs where
  stock finds 6–10. Do not promote it. Do not raise its threshold to suppress
  this; that is fitting against the fixture corpus.
- **COST, measured: 16.1× on fixtures, 58.8× on the photograph, 17.1× on the
  control**, against `envelope.run` at 1.96–2.36 s per page. A sliced projection
  is not cheap.

## `K_S = 0.9737` IS CALIBRATED TO VEROVIO RENDERS AND TO NOTHING ELSE

Measured 2026-08-18. **It would raise on 59 of 60 CORRECT staff rows on the
photograph, at every `g`.** On `ilya-voice-page.png` it sits at 0 of 40 — but
goes to **11 of 40 under a mere 3 px shift in line positions.** The sentinel is a
render-envelope tripwire that has never been tested against any other class of
input, and it is Dann's to rule on. Its binding rule is unchanged and still
ruled: downstream of every decision, upstream of none.

## A GATE THAT CANNOT BE RUN: THE THREE 1.000 PAGES ARE UNDEFINED

Found 2026-08-18 while trying to run it. **Fable's tier-1 gate, "the three 1.000
pages re-score 1.000", is referenced in the design documents and no document in
the tree names which three pages they are.** `oracle-counts.json` and the
scorecard do not define the set. **A gate that cannot be run is not a gate.**
Either name the three pages or stop quoting the gate.

## `page_substrate` HARDCODES `img < 128`

`substrate.py:140`. Otsu on `score-page32-deskewed.png` picks **118**. Every
substrate number in the E.60 memos is therefore taken at 128, which is the
reader's own threshold. Measured 2026-08-18: the separation answer does not flip
between the two, but a marginal window at `g = 3` does.


## THE VERCEL TOOLBAR SITS ON THE DRAWER'S PULL ON A PHONE. 2026-08-19

**Vercel's toolbar button floats at the RIGHT edge on every preview deploy.**
On the desktop that is empty desk. On the phone the open drawer fills the
screen, so its pull lands underneath that button and **the drawer cannot be
closed**. It stopped a walk cold on 2026-08-19.

**Two ways out.** Immediately: rotate to landscape, where the 767 px rule stops
applying, close the drawer there, rotate back. Permanently: set
`VERCEL_PREVIEW_FEEDBACK_ENABLED=0` in the project's **Preview** environment
variables and redeploy, which kills the toolbar on previews. **Not yet done**;
recorded because every phone walk pays this until it is.

Audit finding F9 already recorded the sigil as a nuisance. This is the sharper
version: on a phone it is not a nuisance, it is a blocked control.

---

## A HIDDEN TAB CANNOT LOAD THE DICTIONARY, SO CODE CANNOT WALK ANYTHING DOWNSTREAM OF `Transcribe`. 2026-08-19

**Measured three times in one evening by Claude Code.** Both browser surfaces
available to a Code session run their tab with `document.hidden === true`.
Chrome clamps timers in a hidden tab to one per second; the dictionary loader
yields to the event loop every 1500 entries; the two 47 MB shards therefore
never finish parsing and **`Transcribe` never enables**. `handleTranscribe`
guards on `canTranscribe`, so there is no honest way around it from the DOM.

**What that costs:** Code cannot walk anything that needs transcribed lines.
On 2026-08-19 that was the `Read` and `The page` switch, the scroll position
surviving it, print, and the marked score with an ingested score. Every one
went to Dann's walk instead.

**The workaround Code used, and it is a good one:** mount the component under
test on a throwaway route with real pipeline output, measure it there, then
delete the route and confirm the routes directory is back to
`+layout.svelte`, `+layout.ts`, `+page.svelte`, `+page.ts`, and
`fit-font-lab`.

**Write this into any brief whose definition of done needs a transcription.**
Ask for the tests plus a harness measurement, and put the live walk on Dann.

---

## A "NOTHING MOVES IN THE DRAWER" TEST CANNOT BE RUN ON A PHONE. 2026-08-20

On a phone the drawer covers the whole screen, so the desk head and its pair sit
behind it. To compare the drawer across a flip the singer has to close it, tap,
reopen, and compare from memory, which is not an observation. **The desk is the
instrument for any test whose subject is the drawer and whose trigger is on the
page.** N.73 S2's central done-test was written for a desktop and handed to Dann
on a phone, and it cost him a confused look and a round trip.

The reliable form is a DOM fingerprint taken in the real browser, not an eye:
`innerText` length, the count of elements with a non-zero bounding rect, and
`.drawer-content`'s `scrollHeight`, captured either side of the flip. For S2
that read 901 characters, 140 elements, and 1684 px on both documents, with only
`data-tab` differing.

---

## CSS SPECIFICITY BEAT FOUR BRIEFS IN ONE EVENING. 2026-08-19

`+page.svelte` carries rules of the form
`.main-content.tab-X :global(.paper-page)`, which outrank a component's own
`.paper-page` by two classes. **A brief that says "change the value in the
component" is silently overridden.** It happened to the paper's shadow on
2026-08-19 and Code caught it only by reading the tree first.

The same evening, four `@media (max-width: 767px)` blocks from the N.44, N.45,
and N.46 spikes were actively reflowing the sheets: hidden header blocks, a
static footer that put the colophon at the TOP of the page, and
`width: 100% !important`. **When a ruling retires a spike, grep for its media
queries before building on top of it.**

---
*A NOTE ON CITING THIS FILE. The design document
`e59-design-substrate-decider_r1_2026-08-17.md` cited `ENVIRONMENT.md:634-638`
for the 17.0 and by 2026-08-18 those lines held something else entirely. **Line
numbers into this file rot within a day. Cite the section heading.**
Edits of 2026-08-18 shifted every line below §THE PAGE READER.*


## CLAUDE CODE CANNOT READ `claude/`. A BRIEF MUST QUOTE A RULING, NOT CITE IT. 2026-08-20

**Project knowledge does not live in the repository.** Code is pointed at
`~/Desktop/ilya-rewrite` and can open anything in `docs/`, but every
`claude/...` path is a project-knowledge document and Code sees nothing at
that path.

On 2026-08-20 a repair brief cited
`claude/fable-ruling-s0-slate-closed_2026-08-19.md` for the ruling that keeps
lavender to the voice anchor and calibration surfaces. Code could not open it,
acted on the substance quoted in the brief and in `STATE.md`, and recorded in
its memo that the primary source was not read. **That is the right behaviour
and it is still a defect in the brief.**

**The rule: when a brief depends on a `claude/` ruling, quote the ruling's
sentence into the brief.** Citing the path alone hands Code a tether-10
violation it cannot avoid.

## A DIRECTIONAL GLYPH'S VALUES ENCODE A POSITION. MOVING THE PANEL INVERTS THEM. 2026-08-20

`NotationFields.svelte` draws one right-pointing chevron and rotates it:
`-90deg` shut, `90deg` open. **The rule behind those values is that the chevron
points the way the panel will grow.** That rule was correct and its values were
correct while NOTATION was pinned at the FOOT of the drawer and opened upward.

N.73 S3 moved NOTATION to the top, where it opens downward, and the rule stayed
right while its two values became backwards. **Nothing in the source said so**,
because the comment recorded the geometry rather than the rule. Dann caught it
by eye on the first walk.

**Before you move a pinned panel, grep the component for `rotate`, `transform`,
`::before` arrows, and any comment naming a direction.** The comment above
those values now states the rule instead of the geometry.

## `PageFit`'s `.paper-fit` IS `width: 100%`, SO CENTRING COMES FROM INSIDE IT. 2026-08-20

`.main-content` carries `align-items: center` and it works. It does not centre
the page, because the flex item between them, `PageFit`'s `.paper-fit`, is
`width: 100%` and fills the desk. **Whatever centres a page must be inside
`PageFit`.**

`Paper.svelte` does it with `.paper-container`. `VoiceProfilePane.svelte` does
it with `.fit-paper-container`, byte-identical, on its score branch only, which
is why the marked score sat flush left in its empty state for at least two
builds before anyone traced it.

**The trap that hid it: at 1400 px with the drawer open the desk is exactly the
page's width, so a centred head and a flush-left page agree by accident.** Test
this class of defect on a wide window with the drawer CLOSED, and measure both
left edges rather than eyeballing them.

## THE COORDINATING DESK CAN READ VERCEL DIRECTLY. 2026-08-20

The Vercel MCP is available from this desk, so **do not make Dann go and find a
deploy URL.** `list_teams` gives `team_CmkdrV66wAIF29pQLpiAb80O`,
`list_projects` gives `prj_oOvEOXnovbEkVBAOQRmTmgxJK0DB` for `ilya`, and
`list_deployments` returns each deployment with its `githubCommitSha`, so the
URL for a commit you just shipped is one lookup. `state` reads `BUILDING` for
roughly thirty seconds before `READY`; check `get_deployment` before handing
the link over.

**For the phone, send a QR rather than a URL.** `pip install qrcode
--break-system-packages`, render to PNG, deliver with `SendUserFile`. Dann
scanned one on 2026-08-20 and the phone walk started immediately instead of
after a retyped sha.


## `git add -A` FROM THIS DESK SWEEPS CODE'S WORKING TREE. THREE TIMES IN ONE NIGHT. 2026-08-20

**This desk and Claude Code share one working tree.** When the desk hands Dann a
memory commit built on `git add -A`, and Code is building in the same
repository, the commit takes Code's work with it.

**What it cost on 2026-08-20, three times:**

1. `af995a9` swept N.73 S3 ship two's entire build into a commit whose message
   reads "STATE: desk-head height ruled...". The ship script never ran, so its
   five gates never ran at ship time. Code had run them separately, so nothing
   unsafe shipped, but the history now names the build after the memory.
2. `661218c` and `8d5b175` each landed a moment before the desk's own edits to
   `STATE.md` finished, so two corrections missed their commit and had to ride
   the next one.
3. `7b1eb20` swept `StationHeader.svelte` and three modified files out of a
   **half-finished refactor**, ungated, and pushed it. Vercel deployed a build
   caught mid-rewrite.

**THE RULE. A memory commit names the memory:**

```
git -C ~/Desktop/ilya-rewrite add docs/memory/ docs/sessions/ && git -C ~/Desktop/ilya-rewrite commit -m "..." && git -C ~/Desktop/ilya-rewrite push
```

**Never `add -A` while Code is running.** The ship script is what commits the
build, because it is the thing that runs the five gates first.

**Also: finish writing before you hand Dann the command.** He is fast. Two
corrections missed their commit by seconds because the desk offered a commit
line while it was still editing the file.
