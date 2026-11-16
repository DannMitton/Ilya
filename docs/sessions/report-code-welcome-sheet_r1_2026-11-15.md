# Report: the welcome sheet (lane `cloud-lane-57`)

Brief: `docs/sessions/brief-code-welcome-sheet_r2_2026-11-15.md`. Written by the cloud session, 2026-11-15. Parts are added at the close of each step.

Branch `cloud-lane-57`, cut from `Shane` at `fb9d829e215687a730e717cec55d3f0bb4ab50c2` ("Close of the 2026-11-15 Fable desk ..."). The working tree was clean at the cut.

**One correction to the start, said first.** The cloud clone's local `Shane` was at `649fe492` (N.199) when the session began, two commits behind `origin/Shane`. The branch was first cut there and then moved to `fb9d829e` after `git fetch origin Shane`. Nothing was committed or pushed at `649fe492`.

## Part 0: read and report (nothing changed)

### The eight gates on the untouched tip (`fb9d829e`, a fresh `pnpm install --frozen-lockfile`)

| gate | command | brief's baseline | measured | match |
|---|---|---|---|---|
| 1 phonology | `pnpm test:phonology` | 462 passed (462) | 462 passed (462) | yes |
| 2 dictionary | `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) | yes |
| 3 web-check | `pnpm --filter @ilya/web check` | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files | yes |
| 4 web-test | `pnpm --filter @ilya/web test` | 5817 passed \| 1 skipped (5818) | 5817 passed \| 1 skipped (5818), 325 files, 347 s | yes |
| 5 score-parser | `pnpm --filter @ilya/score-parser test` | 842 passed \| 5 skipped (847) | 842 passed \| 5 skipped (847) | yes |
| 6 blurb | `pnpm test:blurb` | 178 passed (178) | 178 passed (178) | yes |
| 7 integration | `pnpm test:integration` | 159 passed (159) | 159 passed (159) | yes |
| 8 ratchets | `pnpm ratchets` | ratchets: OK | ratchets: OK. | yes |

The ship script (`~/Downloads/ilya-ship.sh`) is not in this sandbox, so the gate-to-command mapping is read from `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117` (the gate lines; its own baselines there are older and are not the brief's), and the counts above identify each gate. All eight read the baseline exactly.

### Where the app mounts its first screen

- `apps/web/src/routes/+layout.ts:3-4`: `ssr = false`, `prerender = true`. `+layout.svelte` wraps the page in `.app-shell`.
- `apps/web/src/routes/+page.ts:21-24`: the load function awaits `openLibrary()` (IndexedDB, raced against a timeout) before the page renders. It does not touch the dictionary.
- `apps/web/src/routes/+page.svelte:3546`: `onMount`. At `:3671` it calls `loadDictionary({ onStateChange })` and does not await it (the comment at `:3659-3670`: "THE DICTIONARY IS NOT LOADED ON THIS LINE, and it is not awaited either").
- The markup begins at `+page.svelte:3716`, `<div class="screen-only">`, and `:3725` is `<HeaderBar {language} {activeTab} onlanguagechange={handleLanguageChange} />`.
- **The "could not establish" item is answered:** the first render mounts independently of the dictionary, so a component placed beside `HeaderBar` shows on the first frame and the dictionary's load is neither awaited nor delayed by it. The service worker is registered from `apps/web/src/app.html:56-64`, outside the Svelte tree, so it is not affected either.
- Plan: one line, `<WelcomeSheet {language} onlanguagechange={handleLanguageChange} />`, after `HeaderBar`, plus one import.

### The language control

`apps/web/src/lib/components/HeaderBar.svelte:32-37`: `other = language === 'en' ? 'fr' : 'en'`, `label = other === 'fr' ? 'Français' : 'English'`, and `<button class="lang-pill" lang={other} onclick={switchLanguage}>`, which calls `onlanguagechange(other)`. The page's handler is `handleLanguageChange` at `+page.svelte:3353`. It sets `language` and writes `ilya:language`. Plan: lift the two derivations into one small pure function used by `HeaderBar` and the sheet, so the sheet has no second control and no second copy of the rule. The sheet's pill calls the same `handleLanguageChange`.

### The existing keys

- **Begin: a key with English "Begin" exists.** `apps/web/src/lib/i18n.ts:1282`: `'calib.welcome.beginButton': { en: 'Begin', fr: 'Commencer' }`. The brief says to reuse it, so Step 1 reuses it and adds no `welcome.begin`. It sits in the calibration wizard's `calib.` prefix, so a future change to the wizard's button changes this sheet's. That coupling is the brief's choice and is reported here.
- The station labels: `tab.text` (`i18n.ts:208`, TEXT / TEXTE), `tab.markedScore` (`:226`, MELODY / CHANT), `tab.insights` (`:230`, INSIGHTS / APERÇUS).
- No `welcome.` prefix exists yet (`grep -n "'welcome\." i18n.ts` returns nothing; `calib.welcome.*` is the calibration wizard's).
- The key index at the head of `i18n.ts` (`:9` onward; the total is at `:19`) says "This file holds 1,270 keys" and lists one row per prefix; `src/lib/i18n-index.test.ts` checks every count and the total.
- Flag name: the tree's `ilya:` keys are `ilya:activeTab`, `ilya:language`, `ilya:notationPrefs`, `ilya:showStressDiacritics`, among others. The new one is `ilya:welcomeSeen`.

### The ratchet line for every file Step 1 touches (`scripts/ratchets.json`, `scripts/ratchets.mjs`)

| file | now | ceiling | room |
|---|---|---|---|
| `apps/web/src/routes/+page.svelte` | 5508 | 5534 | 26 lines; the lane adds about 2 |
| `apps/web/src/lib/i18n.ts` | 2593 | exempt ("data") | none needed |
| `apps/web/src/lib/components/HeaderBar.svelte` | 232 | none; limit 1000 for a file without a ceiling | ample |
| `apps/web/playwright.config.ts` | not a ratcheted source (`.ts` under `apps/web/src` only) | | |
| new files (`WelcomeSheet.svelte`, the plate, the pure modules, tests) | | 1000-line limit for a new file | the plate is its own component so no file nears it |

The module ratchet (`MODULES` in `ratchets.mjs:78-85`) restricts only files under `lib/{reader,score,voice,analysis,markup,insights}/`. A component under `lib/components/Welcome/` has no module, so it may import `$lib/voice/chart/*` (the plate's `computeZones`, `fullView`, `project`) without a breach.

### Which existing sheet the dialog follows

`apps/web/src/lib/score/KeySignatureCard.svelte` (and its sibling `TimeSignatureControls.svelte`): a `<div role="dialog" aria-modal="true" aria-label=...>` moved to `<body>` by a `use:portal` action, over a full-viewport `.scrim` div, a centred card on a fine pointer and a sheet from the foot on a coarse one, z-index 9290 (scrim) and 9300 (card), `@media print { display: none }`, Escape caught on `window` in the capture phase.

Why not a native `<dialog>`: `docs/memory/ENVIRONMENT.md:910-921` (`app.css` resets `margin: 0`, which breaks a `showModal()` dialog's centring unless `margin: auto` is set) and `:1636-1654` (the `close` event does not fire in the in-app browser pane, so nothing may depend on it). A div-based sheet has neither trap, and it is the shape of the three existing cards. Two differences from the key signature card that the brief requires, so Step 1 adds them: (1) focus is **trapped** (the card has none; Tab can leave it), and (2) **Escape does nothing** (the card's Escape closes it). The page's one native `<dialog>` (`replace-dialog`, `+page.svelte:3768`) is a different feature and is not followed.

CORRECTED 2026-11-16 (the desk's review): this paragraph said the highest z-index in the tree is 9300. That was the highest among `.svelte` and `.css` files, which is all my `grep` covered. The highest in the tree is `apps/web/src/lib/voice/engine/capture-file.ts:201`, the recorder panel's `z-index:2147483000`, set from a TypeScript string. It is mounted only when `__ILYA_RECORDER__` is true (`stub-switch.ts:29`): on the development server, and in a build only with `PUBLIC_RECORDER=1` outside Vercel production (`vite.config.ts`). So the singers' bundle has no layer above 9300 except this sheet, and a development or recorder build shows the recorder panel over the sheet, which is the tool standing over everything, as it is meant to. Of the app's own layers, the highest was 9300 (the cards); the install banner is 9000 (`InstallPrompt.svelte:181`). The sheet is 9400 (one value: `.scrim` in `WelcomeSheet.svelte`; this paragraph's earlier "9400 and 9410" was wrong).

### How the browser tests are given the flag

- `apps/web/playwright.config.ts` has no `globalSetup` and no `storageState` (read on this tip: 54 lines, one `use` block with `baseURL` and `trace`, two projects `chromium` at 1440 x 900 and `phone` at 390 x 844, 3x). There are 34 files in `e2e/` and 15 in `e2e-phone/` (`ls`).
- **Chosen: `use.storageState` in the config's top-level `use`**, pointing at one JSON file that holds `ilya:welcomeSeen` for the origin `http://localhost:5173` (the config's `baseURL`). Both projects spread `devices[...]`, which carries no `storageState`, so both inherit it, and no test file is edited.
- Why not an init script in `e2e/helpers.ts`: 29 of the 49 test files (`grep -L helpers`) do not import it, so it would reach 20 files and miss 29.
- **Known edge, to be settled by running it in Step 1:** two tests open their own context with `browser.newContext(...)`: `e2e/insights-page.test.ts:84` (no explicit `baseURL`, so it is relying on the config's defaults and is expected to inherit the storage state) and `e2e/heic-offline.test.ts:45` (its own origin, `127.0.0.2:4173` (corrected 2026-11-16 from "`127.0.0.1`"), from a static server over `build/`, and it skips unless a build exists). If either does not inherit it, that test is touched by one line and the count is reported. The sheet's own tests clear it with `test.use({ storageState: { cookies: [], origins: [] } })`.

### The prototype needs no image file and no new font

- `grep -c "<img" docs/sessions/welcome-sheet/ilya-welcome-draft-17.html` returns 0, and the same for the French file. Every picture is inline SVG or CSS (the plate's six layers, the stripes of the icon, the flag).
- It embeds six fonts (692,274 bytes of 938,433). Each was decoded from its base64 and compared by SHA-256 with a file already in `apps/web/static/fonts/`:

| prototype family | bytes | SHA-256 (first 12) | the file in `static/fonts/` |
|---|---|---|---|
| SS4 (Cyrillic subset, U+0400-045F) | 93,440 | e553fa829fd9 | `source-serif-4/vEFI2_tTDB4M7-auWDN0ahZJW1gf8tenXg.woff2` |
| SS4 (the rest) | 122,360 | f2ea9c12d2fe | `source-serif-4/vEFI2_tTDB4M7-auWDN0ahZJW1gb8tc.woff2` |
| SS4 italic | 130,188 | 96e639320972 | `source-serif-4/vEFK2_tTDB4M7-auWDN0ahZJW1gewtW_Wg.woff2` |
| SSans | 28,872 | 19143dca0759 | `source-sans-3/nwpStKy2OAdR1K-IwhWudF-R3w8aZQ.woff2` |
| Lato IPA | 70,212 | 907db8fa3031 | `lato-ipa.woff2` |
| Bravura | 247,200 | 5c25278c208c | `bravura/Bravura.woff2` |

  All six are byte-identical to files already served, so **nothing new goes into `static/`** (`CONTRACT.md` section 8 is not engaged; the byte count added is 0).
- One thing to watch in Step 1, not a blocker: the prototype's family names `SS4` and `SSans` are its own aliases. The app declares the same files as `Source Serif 4` and `Source Sans 3` in `static/fonts/google-families.css` (and `Lato IPA`, `Bravura` by name), and the app's `--font-serif` and `--font-sans` are those families. The component uses the tokens, not the aliases.

### The English licence line and the French one differ: owed to Dann in one line

The brief asks for this to be said when the lane starts. The two ratified lines are not translations of each other:

- English (prototype): "Free and open source under the GNU Affero General Public License, version 3. The name *Ilya* and its icon are not licensed under it."
- French (prototype): « *Ilya* est gratuit et à code ouvert, © 2026 Dann Mitton, et publié selon les termes de la licence publique générale GNU Affero, version 3. Le nom *Ilya* et son icône ne sont pas visés par cette licence. »

The French has the copyright holder and the year ("© 2026 Dann Mitton") and the subject "*Ilya* est"; the English has neither. `docs/memory/OPEN.md` names this and says both lines are as ratified and that each is copied from its prototype. **Step 1 copies each character for character.** Whether the English should gain "© 2026 Dann Mitton" is his to rule.

### Nothing else needed before Step 1

Nothing new is to be added to `static/`. No word of English or French is needed beyond the ratified strings in `OPEN.md` and the two prototypes. No stop.

## Part 1: the component and its strings

### What was built (all on `cloud-lane-57`)

| file | what |
|---|---|
| `apps/web/src/lib/components/Welcome/WelcomeSheet.svelte` | the sheet: portaled `<div role="dialog" aria-modal>` over a scrim, sage head band, plate, text, fixed footer with Begin |
| `apps/web/src/lib/components/Welcome/WelcomePlate.svelte` | the six images, drawn in code, as SVG layers under a 30-degree `clip-path` wipe |
| `apps/web/src/lib/components/Welcome/welcome-plate.ts` | the plate's numbers: the vowel space from `computeZones({}, 'bass')`, `fullView`, `project`, `zoneColour`; the staff; the note; the icon |
| `apps/web/src/lib/components/Welcome/welcome-motion.ts` | the schedule (WIPE 720, HOLD 380, FIRST 700, station map) and the reduced-motion plan |
| `apps/web/src/lib/welcome-seen.ts` | the flag `ilya:welcomeSeen`, try/catch around the accessor, the read, and the write |
| `apps/web/src/lib/language-switch.ts` | the language pill's rule, now read by `HeaderBar.svelte` and the sheet |
| `apps/web/src/lib/i18n.ts` | 8 keys under `welcome.`; the index row; the total 1,270 to 1,278 |
| `apps/web/src/routes/+page.svelte` | one import and one element, after `HeaderBar` (5508 to 5511 lines; ceiling 5534) |
| `apps/web/playwright.config.ts`, `apps/web/e2e/returning-browser.storage.json` | the shared returning-browser state |
| tests | `welcome-strings.test.ts`, `welcome-seen.test.ts`, `language-switch.test.ts`, `welcome-motion.test.ts`, `welcome-plate.test.ts`; `e2e/welcome-sheet.test.ts` (14), `e2e-phone/welcome-sheet.test.ts` (3) |

### The brief's items, one by one

1. **Dialog.** Built the way `KeySignatureCard.svelte` is (portal to `<body>`, scrim, `role="dialog"`, `aria-modal="true"`, `aria-labelledby` the title). Not a native `<dialog>` (the two `ENVIRONMENT.md` traps). Focus moves into the sheet and is trapped (a capture-phase Tab handler plus a `focusin` guard); Escape is stopped and does nothing. While open, `.app-shell` is `inert`, so nothing behind takes a key or a tap. The sheet is z-index 9400, over the install banner (9000) and the cards (9290, 9300). It never prints (`@media print { .overlay { display: none } }`, and a browser test emulates print). It does not delay the dictionary: a browser test shows the intake field enabling while the sheet is up.
2. **Once per browser.** `ilya:welcomeSeen` = `"1"`, written by Begin. Read at component init (so a returning browser never builds the sheet and a first visit never flashes the app). Storage that throws on the accessor, the read, or the write: the sheet shows, Begin still closes it, no crash (unit tests with stores that throw; a browser test that makes the flag's reads and writes throw and asserts no page error). **Existing tests touched so far: none.** The browser tests start as a returning browser through `use.storageState` in `playwright.config.ts`, for both projects. The question of the two tests with their own contexts is settled in Part 2.
3. **Language.** The head-band pill reads `languageSwitch(language)` (the same rule as the header's) and calls the page's `handleLanguageChange`. A browser test: it switches the sheet to French, stores `ilya:language` = `fr`, and switches back.
4. **Strings.** Eight keys under `welcome.` (`band`, `title`, `lead`, `body`, `method`, `maker`, `madeIn`, `licence`), English and French, taken by script from the two prototypes. `welcome-strings.test.ts` pins every pair, and also reads the two prototype files and asserts each string is in them, the licence line first. **Begin reuses `calib.welcome.beginButton`** (en "Begin", fr "Commencer"); no `welcome.begin` was added. Stations reuse `tab.text`, `tab.markedScore`, `tab.insights`. The key index gained its row and the new total; `i18n-index.test.ts` passes.
5. **The plate.** я in Source Serif 4 Bold; [ɑ] in Lato IPA; the eighth note on a staff in Bravura; the [ɑ] zone; the vowel space; the Илья icon of five equal stripes in the jewel tokens. **The vowel space is computed, not typed, and it reproduces the prototype:** a test reads the prototype's printed ellipses and asserts all ten centres and radii and the [ɑ] dot to a tenth of a unit, and every zone's opacity.
6. **Motion.** The prototype's numbers, once, 5,350 ms to the last wipe's start and 6,070 ms to its end (the prototype's 700 ms first delay plus 250 ms after load). All text and Begin are usable from the first frame (browser test). `prefers-reduced-motion` shows the final state at once with `transition-duration: 0s` (browser test). The plate is `role="img"` named Илья; its layers and the station list are `aria-hidden`.
7. **Phone.** The prototype's narrow layout at 700 px and under: plate 76 px beside the title, stations hidden, Begin full width in the footer, which does not scroll (browser test: scroll the body to its end, Begin has not moved).

### Departures and observations, each for Dann or the desk

1. **Bravura, against the engraving default.** `AGENTS.md` says Finale Maestro is the default music font for all renderings. The brief and the prototype name Bravura for this one glyph, and the brief is explicit, so Bravura is used. The file is already served (`static/fonts/bravura/Bravura.woff2`). If the plate's note should be Maestro's, it is a one-word change in `WelcomePlate.svelte` and in the pinned bounding box.
2. **The glyph is `metNote8thUp`, not `note8thUp`.** U+E1D7 is SMuFL's metronome-mark eighth note (`score/correction.ts:201` and `:208`). The first constant I pinned was for the wrong glyph; the test that holds the constant to `bravura_metadata.json` caught it. Corrected: `glyphBBoxes.metNote8thUp`, NE [2.132, 2.784], SW [0, -0.564].
3. **The note is not where the prototype put it: NOT ESTABLISHED which is wanted.** The brief says "centred by its bounding box". Centred that way, the glyph's left edge is at about x = 123.4 in the 300-unit box. The prototype has `x="134"`, which puts the notehead, not the whole glyph, near the middle. I followed the brief. The note therefore stands about 10 units left of the prototype's (visible in `desktop-en-mid-wipe.png` and `plate-five-images-and-icon.png`). I could not establish how 134 was derived. The choice is Dann's by eye: one number in `noteX()`.
4. **Links open in a new tab.** The prototype's links are same-tab. A singer who follows one would leave the sheet unseen, so each link carries `target="_blank" rel="noopener"`, as `footer.attribution`'s do. No word changed; the test says so.
5. **The shadow.** The prototype's tail layer is `0 20px 44px rgba(46,42,38,.16)`; the app's `--float-shadow` has `.07` there. I used the prototype's four layers literally (the prototype is the spec), so the sheet's shadow is a little heavier than the app's other floats.
6. **The stations' resting grey `#B9B4AC` has no token.** I kept the literal with a comment. Every other prototype colour is a token of the same value (`--sage-head`, `--sage-wash`, `--sage-jewel`, `--sage-ink`, `--lavender-ink`, `--rose-ink`, `--drawer-bg`, `--paper-light`, `--ink-*`, `--cobalt-jewel`); a test checks the five stripe tokens against the prototype's hexes.
7. **An accessibility fault in the prototype, not reproduced.** Its phone copy of the made-in and licence lines is `aria-hidden="true"`, and its desktop copy is `display: none` on the phone, so on a phone a screen reader would get neither. The sheet renders both copies without `aria-hidden`; `display: none` already removes the hidden one from the accessibility tree.
8. **Focus lands on the sheet, not on Begin** (DESK DEFAULT, critique open item 6), so an Enter does not skip the reading. Tab reaches the language pill, the four links, then Begin.
9. **Begin's key sits in the `calib.` prefix** (said in Part 0): changing the wizard's button changes this one.
10. **A cold dev server is slow.** The first page load of a fresh `pnpm dev` took about 6 s to show the sheet, over an assertion's default 5 s. The sheet's own tests wait up to 45 s for the dialog; the existing tests already use long waits.
11. **The new `welcome-plate.test.ts` imports `$lib/score/correction`** (for `LENGTH_CELLS`). It is a test under `components/`, which has no module, so the module ratchet does not apply.

### The pictures (`docs/sessions/report-code-welcome-sheet-pictures/`, looked at one by one)

Taken from the dev server with Playwright at `deviceScaleFactor: 2`, in this sandbox's Chromium, in English and in French. The mid-wipe frame is made repeatable by pausing the plate's `clip-path` transition at 360 ms of 720.

| file | what I saw |
|---|---|
| `desktop-en-final.png`, `desktop-fr-final.png` (1280 x 800) | sage head band with WELCOME or BIENVENUE and the language pill; the icon at rest with TEXT, MELODY, INSIGHTS (TEXTE, CHANT, APERÇUS) all grey; the title; the care box with the bold last sentence; Grayson's line under the plate and the maker's line under the text; the footer with the made-in line, the flag, the licence line, and Begin or Commencer |
| `desktop-en-mid-wipe.png`, `desktop-fr-mid-wipe.png` | the staff and the note half revealed along the diagonal (its fifth line still being drawn), MELODY or CHANT lit in lavender, text and Begin untouched |
| `phone-en-final.png`, `phone-fr-final.png` (390 x 844) | plate 76 px beside the title, the care box, Grayson's and the maker's lines continuing under the fold, Begin or Commencer full width in the fixed footer |
| `phone-en-mid-wipe.png`, `phone-fr-mid-wipe.png` | the same, the plate mid-turn on the note |
| `plate-five-images-and-icon.png` | the plate alone: я, [ɑ], the note on a staff, the vowel space with the [ɑ] dot, the icon, and the icon again. **The fourth image, the enlarged [ɑ] zone, is not in this file:** my second capture's timing skipped it. I saw it in the first capture (a rose ellipse about 90 by 104 units with [ɑ] at its centre) but did not save that frame. |

What the pictures do not show, so it is not claimed: the app behind the scrim at 1280 px is the narrow desk layout (the drawer is a bottom sheet below 1,400 px); nothing here is an iPhone or Safari render; and French and English were looked at in this sandbox's Chromium only.

### The gates after Step 1

| gate | baseline | now |
|---|---|---|
| 1 phonology | 462 passed (462) | 462 passed (462) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web-check | 0 errors, 12 warnings, 5 files | found 0 errors and 12 warnings in 5 files |
| 4 web-test | 5817 passed \| 1 skipped (5818) | **5863 passed \| 1 skipped (5864)**, 330 files (+46 tests, +5 files) |
| 5 score-parser | 842 passed \| 5 skipped (847) | 842 passed \| 5 skipped (847) |
| 6 blurb | 178 passed (178) | 178 passed (178) |
| 7 integration | 159 passed (159) | 159 passed (159) |
| 8 ratchets | OK | ratchets: OK. |

Gate 4's new baseline for the ship script is therefore 5863 passed | 1 skipped (5864), if this lane is merged alone. The Playwright counts (the sheet's 14 and 3, and the full suites) are in Part 2.

## Part 2: close

### The merge

`git fetch origin Shane` showed `origin/Shane` still at `fb9d829e`, the commit the lane was cut from. `git merge origin/Shane` answered "Already up to date." There was nothing to merge, so the lane's code is `Shane` plus Part 1's commit.

### The eight gates at close

The code the gates read has not changed since Part 1's run (the only files written since are this report and the Playwright logs), and the merge was empty, so the counts in Part 1's table are the close's counts: 462, 248, 0 errors and 12 warnings in 5 files, **5863 passed | 1 skipped (5864)**, 842 passed | 5 skipped (847), 178, 159, ratchets OK. I did not re-run them for this part. The amendment below re-runs all eight on the final tree.

### The Playwright suites (`--trace off`, this sandbox's Chromium 1243 through `PW_CHROMIUM_PATH`)

The desktop suite is 223 tests in 35 files. A first run was cut off at the 30-minute background limit inside `pages-without-gaps.test.ts`, so I ran that file and every later file again in a second run, and the phone suite separately.

| run | result |
|---|---|
| desktop, first run (files up to `pages-without-gaps`) | about 111 passed, **2 failed** |
| desktop, second run (`pages-without-gaps` and every later file, which includes the sheet's 14) | **110 passed, 0 failed** |
| phone (44 tests, 16 files, which includes the sheet's 3 and its file; corrected 2026-11-16 from "15 files", which was the count before the sheet's file was added) | **39 passed, 1 skipped, 4 failed** |

I assembled the desktop figure from two runs, so the first run's count is derived (the run was killed, so there is no final tally line for it): 223 tests minus the second run's 110 is 113, of which 2 failed.

**All six failures also fail on the untouched tip.** I made a clean worktree of `fb9d829e`, installed with `pnpm install --frozen-lockfile`, and ran exactly those six tests there: the same six failed.

| test | on the untouched tip |
|---|---|
| `e2e/calibrate-new.test.ts:392` fr at 375 px: Re-take [i] on one line | fails (1.0 m) |
| `e2e/loupe-header.test.ts:47` a drag on the desk moves the card | fails |
| `e2e-phone/input-views.test.ts:134` a poem typed into Poem moves no seat | fails |
| `e2e-phone/phrase-ends.test.ts:26` Tchaikovsky onto an empty song: 172 seats | fails |
| `e2e-phone/relining.test.ts:70` y. a poem pasted into Poem | fails |
| `e2e-phone/relining.test.ts:95` bb. a poem typed key by key | fails |

I did not establish why they fail (this sandbox's Chromium and fonts differ from the maintainer's; `ENVIRONMENT.md` records French desk captures differing in this sandbox for the same reason). They are not caused by this lane, and none involves the sheet. They are a sandbox baseline to be compared against CI, which is the shared record.

### How many existing tests were touched: none

No test file that existed before this lane was edited. The one shared setup (`use.storageState` in `playwright.config.ts`) reached all of them. Two tests open their own browser context, and I looked at each:

- `e2e/insights-page.test.ts:84` (`browser.newContext(...)` with no `baseURL`): **passed** in the suite, so a context made that way inherits the config's `use` options, the storage state included.
- `e2e/heic-offline.test.ts:45` (its own origin `127.0.0.2:4173`, served from `build/`): **skipped here**, because it needs `pnpm --filter @ilya/web build` first. **NOT ESTABLISHED** whether the sheet affects it: its origin is not the config's, so the flag is not set there, and the sheet will stand over its page. It drives a hidden file input (`input.hidden-input`), which Playwright's `setInputFiles` does not need an interactive page for, so it may be unaffected. If it fails on a machine that has a build, the fix is one line: give that `newContext` a `storageState` whose origin is `http://127.0.0.2:4173` and which holds `ilya:welcomeSeen` = `1`. I did not make that edit unverified.

### What the desk should know about the lane as it stands

- Branch `cloud-lane-57` is pushed. No pull request, nothing on `Shane` or `main`, nothing under `docs/memory/`, no brief edited.
- New gate 4 baseline for the ship script, if this lane merges alone: 5863 passed | 1 skipped (5864).
- Owed to Dann: (1) the note's horizontal place (Part 1, departure 3); (2) Bravura against Maestro for that one glyph (departure 1); (3) the shadow's tail (departure 5); (4) a control to reopen the sheet and the app icon files are outside this lane, as the brief says.

## Amendment: the English licence line

Ruled by Dann 2026-11-15 13:20, sent to this session by the desk while Part 2's Playwright runs were going; made after Part 2 was pushed, as its own commit. **Parts 0 to 2 above describe the lane before this amendment.** Where they say the English and French licence lines differ in having the copyright, or that gate 4 is 5863, this section supersedes them.

### What changed

- `apps/web/src/lib/i18n.ts`, key `welcome.licence`, English only:
  `<em>Ilya</em> is free and open source, © 2026 Dann Mitton, and released under the GNU Affero General Public License, version 3. The name <em>Ilya</em> and its icon are not licensed under it.`
  These are the first two sentences of the GUIDE's English paragraph at `GuideContent.svelte:579`, with both "Ilya" in `<em>` as the French line has them, and the no-break space before the 3 as the prototype's line has it (the GUIDE itself has a plain space there). The French line is untouched.
- This supersedes, for English only, the `OPEN.md` bullet that says to copy the licence line from the prototype. `OPEN.md` and the prototypes were not edited.
- `welcome-strings.test.ts`: the English pin moved to the new line. A new test reads `GuideContent.svelte`, takes the first two sentences of that paragraph, and asserts the sheet's English line equals them character for character except for the no-break space. The test that said the English line has no "2026" now says both lines carry "© 2026 Dann Mitton". The prototype-copy test still checks every other string and the French licence line against the prototypes, and skips only the English licence line.
- `e2e/welcome-sheet.test.ts` and `e2e-phone/welcome-sheet.test.ts`: the one assertion each that quoted the old English line now quotes the new one. The sheet's 14 desktop and 3 phone browser tests pass on the amended tree.

### Does the longer line change the layout? Desktop: a little. Phone: not in the footer.

- **Desktop, 1280 x 800** (`desktop-en-final.png`, `desktop-en-mid-wipe.png`, retaken). The line is longer than the footer's text column, so it now wraps to two lines and the made-in line above it makes three. The footer is therefore about one line taller (read off the pictures: about 71 px before, about 84 px now; I did not measure it in the browser). The sheet is correspondingly taller and its top edge moved up by about the same amount; nothing else moved. **Begin is whole in the footer**, vertically centred against the three lines, with the licence text ending before it. The sheet still fits the 800 px viewport.
- **Phone, 390 x 844.** The licence text is not in the footer on the phone: it is in the scrolling body (Part 1, departure 7). The footer is unchanged, 366 x 71 at (12, 761), with Begin 326 x 46 inside it, whole (measured in the browser). The longer line wraps to three lines in the body, under the maker's line and above the footer, and is visible when the body is scrolled to its end (`phone-en-final-scrolled-to-end.png`). `phone-en-final.png` and `phone-en-mid-wipe.png` were retaken and are byte-identical to the old ones, because the first screen does not reach that text.
- I looked at `desktop-en-final.png`, `phone-en-final.png`, and `phone-en-final-scrolled-to-end.png` after the change. The two French pictures were not retaken because the French line did not change.

### The eight gates on the final tree

| gate | baseline | now |
|---|---|---|
| 1 phonology | 462 passed (462) | 462 passed (462) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web-check | 0 errors, 12 warnings, 5 files | found 0 errors and 12 warnings in 5 files |
| 4 web-test | 5817 passed \| 1 skipped (5818) | **5864 passed \| 1 skipped (5865)**, 330 files (+47 tests over the baseline: Part 1's 46 and this amendment's GUIDE test) |
| 5 score-parser | 842 passed \| 5 skipped (847) | 842 passed \| 5 skipped (847) |
| 6 blurb | 178 passed (178) | 178 passed (178) |
| 7 integration | 159 passed (159) | 159 passed (159) |
| 8 ratchets | OK | ratchets: OK. |

**The new gate 4 baseline for the ship script, if this lane merges alone, is 5864 passed | 1 skipped (5865)** (Part 2 said 5863; it is superseded). The full Playwright suites were run before this amendment; after it I re-ran only the sheet's own browser tests (17 passed), because the amendment changes one string and no other code.

## After the desk's review

From the desk, 2026-11-16, after Fable's as-built review (verdict: merge with fixes). Seven items. I did not change the note's place, the music font, the shadow, the scrim's timing, or the plate's inks.

### 1. The plate on its fourth image

`plate-fourth-image-active-zone.png`: the plate alone, at rest on its fourth image, captured when exactly three layers were turned (checked: `shown layers at capture 3`). I looked at it: a rose ellipse, about 90 by 104 units, centred on the square, with [ɑ] in Lato IPA at its centre, on the paper-light ground. It is the enlarged [ɑ] zone the prototype shows.

### 2. The desktop mid-wipe pictures, retaken; one French phone picture added

- `desktop-en-mid-wipe.png` and `desktop-fr-mid-wipe.png` were caught before the station label's 300 ms colour change. They are retaken after it: the wipe is paused at 50 percent, then the script waits for the lit label and a further 700 ms. The lit label's computed colour was `rgb(98, 63, 132)`, which is `--lavender-ink` (#623F84). I looked at both: **MELODY** (English) and **CHANT** (French) are lavender with their underline, TEXT or TEXTE and INSIGHTS or APERÇUS are grey, and the staff and note are half revealed along the diagonal. The report's earlier statement that they are lit is now true of the files.
- `phone-fr-final-scrolled-to-end.png` (new): the French phone body scrolled to its end. I looked at it: the maker's line, then the made-in line with the flag, then the full French licence line (« *Ilya* est gratuit et à code ouvert, © 2026 Dann Mitton, … », four lines at 390 px), then **Commencer** whole and full width in the fixed footer.

### 3. The plate's name has its language

`WelcomePlate.svelte:24` now reads `<div class="plate" class:still={!animate} role="img" lang="ru" aria-label={ICON_WORD} ...>`. `welcome-plate.test.ts` gained a test that reads that element and asserts `role="img"`, `lang="ru"`, `aria-label={ICON_WORD}`, and that `ICON_WORD` is `Илья`.

### 4. `e2e/heic-offline.test.ts`: it fails, and not because of the sheet

I built the app (`pnpm --filter @ilya/web build`, exit 0) and ran that one test: `pnpm exec playwright test --project=chromium heic-offline --trace off`.

- Result line: `✘ 1 [chromium] › e2e/heic-offline.test.ts:43:1 › a singer offline who never opened a HEIC can open one (1.1m)`, then `1 failed`.
- Error: `expect(locator).toBeVisible() failed`, locator `getByText(/Ilya is reading the notes off your page|Reading the page/).first()`, `Expected: visible`, `Timeout: 60000ms`, `Error: element(s) not found`, at `heic-offline.test.ts:78` (line 84 after the edit below).
- The page snapshot at the failure showed the sheet's dialog up (`dialog "Sung Russian made easier."`) and, in the intake, the message "Could not load dictionary manifest. Please check that dictionary-manifest.json exists in /data/."
- **To test whether the sheet was the cause I gave that context the flag** (a `storageState` with origin `http://127.0.0.2:4173` holding `ilya:welcomeSeen` = `1`, the smallest change). The dialog was then gone from the snapshot, and **the test failed in exactly the same way**, with the same message about the dictionary manifest. So the sheet is not the cause.
- **On a clean worktree of `fb9d829e`** (built the same way), the same test fails the same way: same locator, same `element(s) not found`, same "Could not load dictionary manifest" in the snapshot.
- **I reverted my edit.** The test file is untouched, so **no existing test file was edited by this lane.** I did not establish why the offline page cannot load the dictionary manifest in this sandbox. The test is a sandbox baseline, not a regression.
- Because the build existed during the full runs below, this test ran and failed there (it is skipped without a build).

### 5. Keyboard scrolling at 1280 x 600: it did not work, and now does

Measured first, with focus where the sheet put it (on the sheet itself): at 1280 x 600 the text region's content is 504 px in a 427 px region, and **none of ArrowDown, Space, PageDown, or End moved it** (scroll position stayed 0). The cause: focus was on `.sheet`, which is not the scroller. Fix, in `WelcomeSheet.svelte`:

- `.body` (the scrolling text) has `tabindex="-1"`, and focus lands on it when the sheet opens, not on the sheet.
- The `focusin` guard that keeps focus inside the sheet used to pull a stray outside focus back to the sheet itself, which undid the new target (found by logging every `focus()` call and `focusin`); it now returns focus to the same place.
- Tab goes to the links, then Begin; Shift+Tab reaches the language pill. A link inside the text keeps the arrow keys working, because the scroller is its ancestor.

Browser tests added to `e2e/welcome-sheet.test.ts` at 1280 x 600: the text overflows (so the test proves something); focus is on `.body`; each of ArrowDown, Space, PageDown, and End scrolls from the top; End reaches the end; ArrowUp comes back; Begin stays in the viewport; a link takes focus on the first Tab and ArrowDown still scrolls. The sheet's browser tests now number 16 desktop and 3 phone, all passing.

### 6. Three statements corrected

Each is corrected in place in Parts 0 and 2 and marked "corrected 2026-11-16": (a) the highest z-index is `voice/engine/capture-file.ts:201`, the recorder panel's `z-index:2147483000`, mounted only on the development server or a `PUBLIC_RECORDER=1` build outside Vercel production (my `grep` had covered only `.svelte` and `.css`); of the app's own layers the highest was 9300, and the sheet is 9400 (the "9400 and 9410" was wrong, it is one value); (b) the phone suite is 44 tests in **16** files with the sheet's; (c) `heic-offline`'s origin is `127.0.0.2:4173`, not `127.0.0.1`.

### 7. Both Playwright projects, whole, once, on the final code

Run on commit `763dac14` (the code and pictures; the only commits since are this report's text), `--trace off`, this sandbox's Chromium 1243, with the build present:

- **Desktop (`chromium`): `3 failed`, `222 passed (46.4m)`** (225 tests: the earlier 223 plus the two keyboard tests).
- **Phone: `4 failed`, `1 skipped`, `39 passed (8.8m)`** (44 tests, as before).

The desktop failures: `calibrate-new.test.ts:392`, `loupe-header.test.ts:47`, and `heic-offline.test.ts:43` (item 4). The four phone failures are the ones named in Part 2: `input-views.test.ts:134`, `phrase-ends.test.ts:26`, `relining.test.ts:70`, `relining.test.ts:95`; none changed.

**`calibrate-new.test.ts:392` (fr at 375 px: Re-take [i] on one line).** On this tip:

```
Test timeout of 60000ms exceeded.
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /^(re-take|réessayer)$/i }).first()
> 396 | await page.getByRole('button', { name: /^(re-take|réessayer)$/i }).first().click();
```

On a clean worktree of `fb9d829e`, the same test: `✘ ... (1.0m)`, with the same text, the same locator, and the same line 396.

**`loupe-header.test.ts:47` (a drag on the desk moves the card).** On this tip:

```
Error: expect(received).toBe(expected) // Object.is equality
Expected: -40
Received: -30
> 59 | expect(Math.round(moved.x - before.x)).toBe(-40);
```

On a clean worktree of `fb9d829e`, the same test: `✘ ... (10.8s)`, with `Expected: -40`, `Received: -30`, line 59.

So both fail the same way with and without this lane. I did not establish why either fails in this sandbox. CI is the shared record.

### The eight gates, on the final tree (`1886332`, with the build removed)

| gate | baseline | now |
|---|---|---|
| 1 phonology | 462 passed (462) | 462 passed (462) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web-check | 0 errors, 12 warnings, 5 files | found 0 errors and 12 warnings in 5 files |
| 4 web-test | 5817 passed \| 1 skipped (5818) | **5865 passed \| 1 skipped (5866)**, 330 files (+48: Part 1's 46, the amendment's GUIDE test, and the plate-name test) |
| 5 score-parser | 842 passed \| 5 skipped (847) | 842 passed \| 5 skipped (847) |
| 6 blurb | 178 passed (178) | 178 passed (178) |
| 7 integration | 159 passed (159) | 159 passed (159) |
| 8 ratchets | OK | ratchets: OK. |

**The gate 4 baseline for the ship script, if this lane merges alone, is now 5865 passed | 1 skipped (5866)** (supersedes 5863 and 5864 above). Two notes: I removed the gitignored `apps/web/build/` after the heic-offline run, and I checked that `git status` was clean before the gates. The "highest z-index" and "known edge" statements in Parts 0 and 2 are corrected in place, as item 6 says.

## After the desk's amendment of 2026-11-16

Five changes from the desk, each its own commit, test first where a test applies. I did not touch `docs/memory/` or any brief, and the inks are as built.

| # | change | commit | test, red before the change |
|---|---|---|---|
| 1 | after Begin, focus goes to a real control | `c6ad6de` | Playwright: `activeElement` was `BODY`; now it is the header's `BUTTON` |
| 2 | the note stands at the prototype's x = 134 | `3676231` | `welcome-plate.test.ts`: `expected 123.4 to be 134` |
| 3 | the shadow is `var(--float-shadow)` | `d424278` | `welcome-sheet.test.ts` (new): the `.sheet` rule had four literal layers |
| 4 | the scrim leaves in 260 ms | `6f96506` | `welcome-sheet.test.ts` and `welcome-motion.test.ts`: `expected 180 to be 260` |
| 5 | the note is Finale Maestro | `63827a8` | `welcome-plate.test.ts`: the pinned box and the family and file URL |

The pictures were retaken in `ea9e192`.

### 1. Focus after Begin

`WelcomeSheet.svelte` used to remember `document.activeElement` at open, which on a first visit is `<body>`, and give it focus back on close. It now waits one `tick()` (the app is `inert` until the sheet's effects clean up) and focuses the first focusable control of the header in tab order, falling back to the first control in the app. In the app that is the language pill. The new browser test in `e2e/welcome-sheet.test.ts` clicks Begin, waits for the dialog to go, and polls until `document.activeElement` is not `body` or `html`, is inside `header`, is a `BUTTON`, and has the class `lang-pill`. Red first (`isBody: true, tag: "BODY"`), then green.

### 2. The note's place

`noteX()` returns 134, the prototype's `x="134"` (line 84). `welcome-plate.test.ts` now reads the prototype's own text element for the note and asserts both that it says 134 and that `noteX()` equals it, with the baseline at 150. The test that centred the glyph's bounding box is gone. `NOTE_BBOX` stays as the pinned record of the glyph's box. With Maestro (item 5), 134 puts the notehead's centre at 134 + (1.272 / 2) x 25 = 149.9 in the 300-unit box, within a unit of the plate's middle; a test asserts that from `FinaleMaestro.json`'s `noteheadBlack`.

### 3. The shadow

The `.sheet` rule is now `box-shadow: var(--float-shadow);` (`app.css:150`), in place of the four literal layers, which included the prototype's 1 px ring. That ring went with them, because the amendment says to replace the four layers. A new test, `welcome-sheet.test.ts`, reads the component and asserts the declaration and the absence of the literal `rgba(46, 42, 38` layers, and reads `app.css` to assert that the token exists. In the retaken pictures the sheet's edge is softer, as `--float-shadow`'s lighter tail would make it.

### 4. The scrim leaves in 260 ms

`LEAVE_MS` (`welcome-motion.ts:22`) is 260. The prototype has the scrim at 260 ms and the sheet at 180 ms (lines 24 and 27), so I added `SHEET_LEAVE_MS` = 180 and the sheet's CSS reads that; only the scrim moved. The tests: `welcome-motion.test.ts` pins both numbers; `welcome-sheet.test.ts` reads the prototype's two `transition` declarations and asserts that the scrim spends `--leave` and the sheet `--leave-sheet`. `LEAVE_MS`, the longer of the two, is also how long the sheet stays mounted after Begin. Reduced motion still closes at once. I did not time the 260 ms fade in a browser; the browser test confirms that Begin closes the sheet.

### 5. Finale Maestro

**Maestro has the glyph and draws it correctly, so the note is Maestro.** Evidence: `FinaleMaestro.json` has `glyphBBoxes.metNote8thUp` (NE [2.264, 3.04], SW [0, -0.548]); in the browser `document.fonts.check("100px 'Finale Maestro'", '')` returned `true` and the font's status was `loaded`; and I looked at the render at 3x (`/tmp` scratch capture, then the plate's third image in the contact sheet): a correct eighth note, notehead on the middle line, stem up, a clean flag, notehead centred on the plate. I could not inspect the OTF's cmap directly (`fontTools` is not installed here), so the browser check and the picture are the evidence.

- `WelcomePlate.svelte` declares `@font-face { font-family: 'Finale Maestro'; src: url('/fonts/finale-maestro/FinaleMaestro.otf') format('opentype'); }` and its `.smufl` class uses it. The Bravura `@font-face` is gone.
- Family and URL are exactly `notation-fonts.ts`'s spec for `finale-maestro` (`:39`), so the browser reuses one file. A test imports `NOTATION_FONTS` and `DEFAULT_NOTATION_FONT_ID` and asserts that the component contains that family and that URL and no Bravura declaration or file.
- `NOTE_BBOX` is now Maestro's box, pinned against `FinaleMaestro.json` by a test, as the Bravura one was against `bravura_metadata.json`. The glyph is still checked against `LENGTH_CELLS` (`score/correction.ts`).
- One thing I noticed and did not change: in the browser `document.fonts` listed two entries for the family, `Finale Maestro` and `"Finale Maestro"`, both `loaded`. One is the plate's `@font-face` and the other is the app's own `FontFace` registered by the score renderer. They name the same URL, so I expect one download from the browser's cache; I did not check the network log.

### The pictures (retaken in `ea9e192`, each looked at)

- `desktop-en-final.png`: the sheet with the float shadow, a softer edge than before; layout unchanged; Begin whole in the footer. The icon is at rest.
- `phone-fr-final.png`: unchanged in layout; Commencer whole in the fixed footer.
- `plate-five-images-and-icon.png` (the name is stale: it now holds **six** images, in order): я, [ɑ], the Maestro note on its staff, the enlarged [ɑ] zone, the vowel space, the icon. **This is the first contact sheet to hold all six.** I made it by setting each layer's reveal state directly, because two earlier timed captures skipped or doubled an image: a screenshot can run longer than the 1,100 ms between turns. So these are the plate's images at rest, not frames of the running sequence.

### Counts

- **Both welcome Playwright suites:** desktop `17 passed (55.2s)` (`e2e/welcome-sheet.test.ts`, which gained the focus test), phone `3 passed (8.1s)` (`e2e-phone/welcome-sheet.test.ts`). I did not re-run the whole suites after this amendment; the earlier whole-suite results stand for the other tests, and the amendment touches only the sheet and the plate.
- **The eight gates, on the final tree (`ea9e192`, clean, no `build/`):**

| gate | baseline | now |
|---|---|---|
| 1 phonology | 462 passed (462) | 462 passed (462) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web-check | 0 errors, 12 warnings, 5 files | found 0 errors and 12 warnings in 5 files |
| 4 web-test | 5817 passed \| 1 skipped (5818) | **5872 passed \| 1 skipped (5873)**, 331 files |
| 5 score-parser | 842 passed \| 5 skipped (847) | 842 passed \| 5 skipped (847) |
| 6 blurb | 178 passed (178) | 178 passed (178) |
| 7 integration | 159 passed (159) | 159 passed (159) |
| 8 ratchets | OK | ratchets: OK. |

Gate 4 is up 7 over the previous section's 5865 (two tests for the shadow, two for the leave timing, one for `LEAVE_MS` in `welcome-motion.test.ts`, two for Maestro). **The gate 4 baseline for the ship script, if this lane merges alone, is now 5872 passed | 1 skipped (5873)** (supersedes 5865).
