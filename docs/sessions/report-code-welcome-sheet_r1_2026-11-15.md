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
