# Brief: N.105, the install prompt remembers "Not now"

Written 2026-09-02 by the desk for a fresh Claude Code thread. Floor:
`5c957d5`, "close: N.104 walked and closed". Item: **N.105**, numbered by Dann
2026-09-01, `docs/memory/INBOX.md:56`.

## 1. What Dann saw

On the 2026-09-01 walk of `510a280` the install banner rose on every page
load. He dismissed it ten times in one hour. His words: "I must have dismissed
this dialog box ten times. Why does it persist?"

## 2. The cause, read off the tree

`apps/web/src/lib/components/InstallPrompt.svelte`, read in full 2026-09-02:

- `onMount` (`:44-63`): on iOS the banner shows after 6 s unless
  `sessionStorage['ilya-ios-hint-shown']` is set. Everywhere else it listens
  for `beforeinstallprompt` and shows the banner 8 s later, with no check of
  any stored decline.
- `dismiss()` (`:73-77`): sets `visible = false`, drops the deferred prompt,
  and writes to `sessionStorage` only `if (isIos)`. On desktop nothing is
  written. `sessionStorage` dies with the tab, so even iOS forgets by the next
  visit.
- `install()` (`:65-71`): awaits `userChoice`; if the native Chrome prompt is
  dismissed, nothing is recorded either, so the banner returns next load.

So "Not now" lasts one page view, on every platform, for every singer on a
stable URL.

## 3. What to build

Persist the decline in `localStorage`, per origin, with a timestamp, and do
not raise the banner while the decline is fresh.

- Key: `ilya:installDeclinedAt`, an ISO date string. This follows the tree's
  `ilya:` convention (`+page.svelte:1751`, `:1766`, `:2600`).
- **DESK DEFAULT, Dann's to wave off: a decline lasts 30 days.** After that
  the banner may rise again once, and a second "Not now" starts a new 30 days.
- **DESK DEFAULT: a dismissed native prompt counts as a decline.** In
  `install()`, when `outcome === 'dismissed'`, write the same key. An
  `accepted` outcome writes nothing; the app is installed and
  `display-mode: standalone` already suppresses the banner (`:45`).
- Replace the iOS `sessionStorage` write with the same `localStorage` key, and
  the iOS `onMount` check with the same freshness test. One rule, both paths.
- Guard every `localStorage` access in `try/catch`, as the rest of the file's
  callers do not need to but a private-mode Safari throws on write. On a throw,
  behave as though nothing is stored.
- Delete the `ilya-ios-hint-shown` key on first run if present. It is dead.

One helper, exported for testing, in a new `install-decline.ts` beside the
component or under `$lib`:

```ts
export const DECLINE_DAYS = 30;
export function declineIsFresh(stored: string | null, now: Date): boolean
```

Pure, no DOM, so it is testable under `apps/web`'s vitest, which has no DOM
environment (`docs/sessions/memo-n104-loupe-head_r1_2026-08-29.md` §9).

## 4. Definition of done

1. Tests for `declineIsFresh`: null is not fresh; a date 29 days ago is fresh;
   31 days ago is not; garbage is not fresh; the boundary at exactly 30 days is
   not fresh.
2. Five gates at baseline, with gate 4 disclosed if it moves from
   `914 passed (914)`. Report the new number and say that line 79 of
   `~/Downloads/ilya-ship.sh` must change; do not edit that file.
3. A local production build, walked by you: press "Not now", reload, no
   banner. Set the stored date 31 days back in DevTools, reload, banner
   returns after 8 s. Record what you saw, not what you expected.
4. No user-facing string added or changed. **No French coined.** The existing
   strings stay byte-identical, em dashes included; they are not this item's.

## 5. Constraints

- `THIS DESK DOES NOT BUILD`; you do. You do not run git. Nothing is committed
  and nothing is shipped by you.
- Do not touch `static/`, the service worker, or the `CriOS` / `FxiOS`
  exclusion at `:48`.
- Do not add a second silent save site while N.27 is open: this is one
  `localStorage` key for one preference, the same class as `ilya:language`.
  Say so in the memo if you disagree.
- House style in the memo: Canadian spelling, no em dashes, `NOT ESTABLISHED`
  never smoothed into prose.

## 6. Return format

A memo at `docs/sessions/memo-n105-install-decline_r1_<date>.md`: what
changed with `path:line`, what you walked and saw, gates before and after,
citations your edit moved, and a NOT ESTABLISHED section. **"NOT ESTABLISHED
beats a complete invented answer."** Commit message for Dann to use:
`N.105: "Not now" lasts thirty days`.
