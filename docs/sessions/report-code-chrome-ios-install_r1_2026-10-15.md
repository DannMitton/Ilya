# Report: the install banner reaches Chrome on iPhone, its instruction line held for ratification (r1)

Code (cloud lane, Sonnet), 2026-10-15, branch `cloud-lane-10`. Brief: `brief-code-chrome-ios-install_r1_2026-10-15.md`, with the amendments of `review-fable-brief-chrome-ios-install_r1_2026-10-15.md` applied. Desk decision applied: the mechanism is built, the Chrome-on-iOS banner stays down, and no unratified string ships.

## The answer in three lines

1. Detection moved out of the component into `apps/web/src/lib/install-platform.ts`, which answers `ios-safari`, `ios-chrome`, or `other` from the user agent. The Safari test is the component's old test in the same terms; the only new branch is `CriOS`.
2. The component has a new key, `ios_chrome_body`, typed `string | null` and holding `null` in both languages. The Chrome banner is raised only where it is a string, so it is never raised in this commit.
3. **Until the follow-up lands, Chrome on iPhone shows nothing, exactly as today.** The six-case detection is the only observable change in the tree, and it is a test, not a screen. Safari is unchanged: same six seconds, same strings, same `mayAsk()`.

## The detection's cases and their sources

`installPlatform(ua)` in `apps/web/src/lib/install-platform.ts`. The seven strings in `install-platform.test.ts` were **written from the documented shape of each user agent, not copied from a device**: this box has no iPhone, no iPad, and no Mac, and I did not read my own browser's `navigator.userAgent` for them (my browser is headless Chromium on Linux). Each string carries a comment naming the shape it follows. That is a weaker source than a captured string; NOT ESTABLISHED that each matches what a current device sends byte for byte, and the rule reads only three tokens (`iphone|ipad|ipod`, `FxiOS`, `CriOS`).

| case | string's shape | result |
|---|---|---|
| iPhone Safari | WebKit, `Version/17.5 Mobile/…`, no `CriOS`/`FxiOS` | `ios-safari` |
| iPhone Chrome | `CriOS/126…` token | `ios-chrome` |
| iPhone Firefox | `FxiOS/127.0` token | `other` |
| Android Chrome | `Linux; Android 14` | `other` |
| Mac Safari | `Macintosh; Intel Mac OS X` | `other` |
| iPad Safari naming `iPad` | `iPad; CPU OS 12_2`, `Version/12.1` | `ios-safari` |

Per review amendment 2: a current iPadOS Safari sends the Macintosh string by default (desktop-class browsing), so it reaches `other`. That is the component's behaviour before this row and this row does not change it. The Mac Safari test is the "Macintosh string gives `other`" test the amendment asked for; its comment says it is also what a current iPad sends. I did not add a second test with an identical string. The iPadOS claim is the review's, not mine; I did not verify it.

## The component

`apps/web/src/lib/components/InstallPrompt.svelte`:

- The old two-line `ios` test (`const ios = …` at the old `:81-82`) is replaced by `installPlatform(navigator.userAgent)`. Where the platform is not `other`, `isIos` is set; `isChrome` is set for `ios-chrome`.
- The raise is `mayAsk() && (!isChrome || typeof t.ios_chrome_body === 'string')`. Safari takes the left side as before.
- The body drawn is `ios_chrome_body` for Chrome and `ios_body` for Safari; the heading and the dismiss label are shared.
- **The type, per amendment 3.** I declared an `interface Strings` with `ios_chrome_body: string | null` and typed the table `Record<'en' | 'fr', Strings>`. A bare `null` in both branches would have given the follow-up row a type to change as well as a value. `svelte-check` is at 0 errors.
- A small behavioural difference you should know about: a Chrome-on-iPhone visitor now takes the iOS branch and returns early, so the `beforeinstallprompt` listener is no longer registered for them. Chrome on iOS never fires that event, so nothing observable changes. NOT ESTABLISHED by me beyond the brief's statement that iOS browsers run on WebKit.
- The `null` line carries a comment that points to the desk's draft (`docs/sessions/draft-strings-chrome-ios-install_r1_2026-10-15.md`) and says the banner stays down until it holds a ratified string.
- **No menu path for Chrome is written anywhere**, in code, comments, or this report. It remains NOT ESTABLISHED, by design.

## The text test, and what it is

`apps/web/src/lib/components/install-prompt-gate.test.ts` reads `InstallPrompt.svelte` as source, as `settle-field.test.ts` does for `SavedNote.svelte`. **It is a text test, not a render.** It asserts that `ios_chrome_body` is declared `string | null`, that it is `null` in both languages, that the raise is conditioned on `typeof t.ios_chrome_body === 'string'` for Chrome, and that the body line follows the platform. It will fail the day a string lands without the follow-up row.

`install-decline.test.ts` is unchanged and passes.

## The Playwright observation (the built site)

Instrument: `pnpm --filter @ilya/web build`, then `python3 -m http.server 5199 --bind 127.0.0.1` from `apps/web/build`, then a Node script driving the sandbox Chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, reported as version 141.0.7390.37 by `browser.version()`) with `browser.newContext({ userAgent, viewport: { width: 390, height: 844 } })` (review amendment 1: the override is a context option). It polled for `.install-prompt` every 100 ms for 10 s from the start of navigation.

| user agent | `navigator.userAgent` honoured | observation |
|---|---|---|
| iPhone Chrome (`CriOS`) | yes | **no banner within 10 s** |
| iPhone Safari | yes | banner at **6,753 ms** (measured from the start of navigation, so about 6 s after mount plus load), text "Add Ilya to your Home Screen / Tap the Share button below, then choose Add to Home Screen. / Got it" |

Same text as the existing Safari strings. The one run is one observation per user agent, not a repeated measure. The `(display-mode: standalone)` check is false in a normal page, as the brief predicted.

## The keys the follow-up fills

- `strings.en.ios_chrome_body` and `strings.fr.ios_chrome_body` in `apps/web/src/lib/components/InstallPrompt.svelte`.
- The desk's draft is `docs/sessions/draft-strings-chrome-ios-install_r1_2026-10-15.md`. Both strings, and the menu path on Dann's iPhone, are his to ratify first. Nothing in the draft reached the tree.

After ratification the follow-up pastes two strings and removes the gate comment. Because the gate is `typeof … === 'string'`, the banner then rises with no code change.

## Tests

| gate | baseline | now | added by |
|---|---|---|---|
| 4 web-test | 2514 (2512 plus row 91's 2) | 2524 | +10: `install-platform.test.ts` (6) and `install-prompt-gate.test.ts` (4) |

## What I could not establish

- The Chrome-on-iPhone menu path, by design.
- Whether each user-agent string matches a current device byte for byte (above).
- The banner on a real iPhone, in either browser. Everything here is headless Chromium with an overridden user agent; it shows the gate logic, not WebKit behaviour.
- Anything about Firefox on iOS, which stays excluded.

## Gates

| # | gate | expected | result |
|---|---|---|---|
| 1 | phonology | 267 | 267 passed |
| 2 | dictionary | 248 | 248 passed |
| 3 | web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| 4 | web-test | 2524 | 2524 passed |
| 5 | score-parser | 675 passed, 5 skipped | 675 passed, 5 skipped |
| 6 | blurb | 145 | 145 passed |
| 7 | integration | 55 | 55 passed |
| 8 | ratchets | OK | OK |

`gates-scratch.sh:111`'s gate 4 string (2433) is stale and was not edited.
