# Brief: the install banner reaches Chrome on iPhone, with its own instruction line held for ratification (r1)

Desk (Fable 5.1 drafting for Opus), 2026-10-15. For Code (cloud lane, Sonnet), on `cloud-lane-8`, after N.27. Row 3 of 5. Every `path:line` here was read in a clone of `Shane` at `14e2ff8` on 2026-10-15.

## What the singer sees and gains

A singer who opens Ilya in Chrome on an iPhone is never told that Ilya can be kept on the Home Screen. Safari users see the banner after six seconds; Chrome users see nothing, because the component rules them out by name. After this row and one follow-up, that singer sees the same banner with an instruction line written for Chrome's own menu, not Safari's. **In this row the singer sees no change.** The reason is in "The choice". What lands now is the mechanism, keyed and tested, so the follow-up is a two-string commit once Dann has ratified the words.

## What the tree does today

- `apps/web/src/lib/components/InstallPrompt.svelte:81-90`: `const ios = /iphone|ipad|ipod/i.test(ua) && !(ua.includes('CriOS') || ua.includes('FxiOS'));` Where `ios` is true the banner rises after 6,000 ms if `mayAsk()`. Where it is false the code falls to the `beforeinstallprompt` listener (`:96-101`), which Chrome on iOS never fires (iOS browsers run on WebKit; no `beforeinstallprompt`), so a Chrome-on-iPhone singer gets nothing.
- The strings live in the component, not in `i18n.ts`: `InstallPrompt.svelte:20-39`. The iOS pair: EN `ios_heading: 'Add <em>Ilya</em> to your Home Screen'`, `ios_body: 'Tap the <strong>Share</strong> button below, then choose <strong>Add to Home Screen</strong>.'`, `ios_dismiss: 'Got it'`; FR `ios_heading: 'Ajoutez <em>Ilya</em> à votre écran d’accueil'`, `ios_body: 'Appuyez sur le bouton <strong>Partager</strong> en bas, puis choisissez <strong>Sur l’écran d’accueil</strong>.'`, `ios_dismiss: 'Compris'`.
- The template reads `isIos` to choose the heading, body, and the ghost button (`:126-134`).
- The decline rule is already platform-blind: `apps/web/src/lib/install-decline.ts` (`DECLINE_KEY`, `declineIsFresh`), tested in `install-decline.test.ts`. The component is mounted once at `apps/web/src/routes/+page.svelte:4270`.

## What is established about Chrome on iOS, and what is not

- Chrome for iOS can add a web app to the Home Screen since July 2023 on iOS 16.4 or later: 9to5Mac, 2023-07-14 (https://9to5mac.com/2023/07/14/google-chrome-web-apps-ios/), read by the desk on 2026-10-15; the article says it "requires the latest version of Google Chrome for iOS and also a device running iOS 16.4 or later" and gives no menu path.
- **The menu path in Chrome on iPhone is NOT ESTABLISHED.** Google's own help page for adding to the Home Screen (support.google.com/chrome/answer/6204307, both the Android and the iPhone variant, read 2026-10-15) covers Android and the Chrome widget only. Nobody in this lane may write "tap the Share button" or "tap the three dots" for Chrome until Dann has done it on his iPhone. Firefox on iOS (`FxiOS`) is out of scope: no source was read for it, and it stays excluded.

## The choice

Two ways to build this:

A. Show the Chrome singer the existing Safari sentence now, and swap in a Chrome line later. Cost: the Safari sentence says "Tap the **Share** button below"; where Chrome puts its share control on an iPhone is not established, so the banner could send a singer to a button that is not where the sentence says. That is an instruction the desk cannot walk first (CONTRACT tether 7).

B. Build the detection and a separate key for the Chrome line, and keep the banner down for Chrome until that key holds a ratified string. Cost: Chrome singers wait one more row. Nothing they see changes until the words are right.

**Build B.** The banner's only job is to give an instruction that works; an instruction nobody has walked is worse than no banner. The strings arrive from the desk as a marked draft (`draft-strings-chrome-ios-install_r1_2026-10-15.md`, beside this brief); the follow-up row pastes them into the keys this row creates once Dann has ratified the French and checked the path on his iPhone.

## The build

1. **Detection moves out of the component into plain TypeScript**, so a gate can reach it (the reason `install-decline.ts:11-16` gives). New file `apps/web/src/lib/install-platform.ts` exporting `installPlatform(ua: string): 'ios-safari' | 'ios-chrome' | 'other'`: `/iphone|ipad|ipod/i` with neither `CriOS` nor `FxiOS` is `ios-safari` (what the component calls iOS today); with `CriOS` it is `ios-chrome`; `FxiOS` and everything else is `other`. Keep the test exactly as the component had it, character for character, for the Safari case; the only new branch is `CriOS`.
2. **The component** (`InstallPrompt.svelte`) replaces `:81-82` with a call to `installPlatform(navigator.userAgent)`, keeps `isIos` for the template, and adds `ios_chrome_body` to the strings table in BOTH languages with the value `null` and a comment: "Owed to Dann; drafted in `docs/sessions/draft-strings-chrome-ios-install_r1_2026-10-15.md`; the banner stays down for Chrome on iOS until this holds a ratified string." Rule at `:84-90`: `ios-safari` behaves as today; `ios-chrome` sets `isIos = true` and raises the banner only where `t.ios_chrome_body` is a string; `other` falls to the listener as today. The body line drawn is `ios_chrome_body` for `ios-chrome` and `ios_body` for `ios-safari`; heading and dismiss are shared. Nothing in the Safari path changes: same six seconds, same strings, same `mayAsk()`.
3. **No string is added.** `ios_chrome_body` is `null` in both languages in this commit. `svelte-check` must stay at 0 errors with the `string | null` type.

## Tests

- New `apps/web/src/lib/install-platform.test.ts`: a real iPhone Safari user-agent string gives `ios-safari`; a real iPhone Chrome string (contains `CriOS/`) gives `ios-chrome`; an iPhone Firefox string (`FxiOS/`) gives `other`; an Android Chrome string gives `other`; a desktop Safari string gives `other`; an iPad Safari string gives `ios-safari`. Write the strings in the test with the source each came from (your own browser's `navigator.userAgent` is a source; say so).
- A test that the component's gate holds: read `InstallPrompt.svelte` as text (the way `settle-field.test.ts:106` and `composers-poets.test.ts:194` read a component) and assert that `ios_chrome_body` is `null` in both languages and that the raise is conditioned on it being a string. State in the report that this is a text test, not a render.
- `install-decline.test.ts` unchanged and passing.

## Done when

1. `installPlatform` returns the three answers above for the six user agents.
2. In Playwright on the built site with an iPhone Chrome user agent (`page.setUserAgent` or a context `userAgent`), no banner appears within 10 s; with an iPhone Safari user agent, the banner appears at about 6 s with the existing text. Headless Chromium honours the override for `navigator.userAgent`; the display-mode check at `:71` is false in a normal page.
3. `svelte-check` at 0 errors; all eight gates pass; gate 4 rises only by the tests you added, named.
4. The report names the two keys the follow-up fills (`strings.en.ios_chrome_body`, `strings.fr.ios_chrome_body`) and the file the desk's draft is in.

## Gates

The eight commands in `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117`. Baselines after row 98: phonology 251, dictionary 248, web-check 0 errors 12 warnings, web-test 2512, score-parser 675 passed 5 skipped, blurb 145, integration 55, ratchets OK, plus what rows 91 and N.27 added. Cloud notes: `docs/memory/ENVIRONMENT.md`, "THE GATES RUN IN A CLOUD CLONE".

## Constraints

- Commit to `cloud-lane-8` only; no pull request; `docs/memory/` untouched.
- No new English or French string reaches the tree in this row; the Chrome keys hold `null`.
- Do not change the Safari path's timing, strings, or decline rule. Do not touch `FxiOS`.
- Do not write a menu path for Chrome anywhere, including comments and the report.

## Report

`docs/sessions/report-code-chrome-ios-install_r1_2026-10-15.md`: the answer in three lines; the detection's six cases and their sources; the Playwright observation for both user agents; the keys the follow-up fills; the gates; what you could not establish.

## What you could not establish

The Chrome-on-iPhone menu path is NOT ESTABLISHED by design and stays so in this row. List anything else. NOT ESTABLISHED beats a complete invented answer.
