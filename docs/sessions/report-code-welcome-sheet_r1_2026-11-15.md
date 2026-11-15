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

Highest z-index in the tree today is 9300 (`grep` over `src`); the install banner is 9000 (`InstallPrompt.svelte:181`). The sheet takes 9400 and 9410 so it stands over both.

### How the browser tests are given the flag

- `apps/web/playwright.config.ts` has no `globalSetup` and no `storageState` (read on this tip: 54 lines, one `use` block with `baseURL` and `trace`, two projects `chromium` at 1440 x 900 and `phone` at 390 x 844, 3x). There are 34 files in `e2e/` and 15 in `e2e-phone/` (`ls`).
- **Chosen: `use.storageState` in the config's top-level `use`**, pointing at one JSON file that holds `ilya:welcomeSeen` for the origin `http://localhost:5173` (the config's `baseURL`). Both projects spread `devices[...]`, which carries no `storageState`, so both inherit it, and no test file is edited.
- Why not an init script in `e2e/helpers.ts`: 29 of the 49 test files (`grep -L helpers`) do not import it, so it would reach 20 files and miss 29.
- **Known edge, to be settled by running it in Step 1:** two tests open their own context with `browser.newContext(...)`: `e2e/insights-page.test.ts:84` (no explicit `baseURL`, so it is relying on the config's defaults and is expected to inherit the storage state) and `e2e/heic-offline.test.ts:45` (its own `127.0.0.1` origin and port from a static server over `build/`, and it skips unless a build exists). If either does not inherit it, that test is touched by one line and the count is reported. The sheet's own tests clear it with `test.use({ storageState: { cookies: [], origins: [] } })`.

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
