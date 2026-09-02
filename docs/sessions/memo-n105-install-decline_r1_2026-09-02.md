# Memo: N.105, "Not now" lasts thirty days

Written 2026-09-02 by Code, against the brief
`docs/sessions/brief-n105-install-decline_r1_2026-09-02.md`. Floor: `5c957d5`,
"close: N.104 walked and closed". Item: **N.105**, numbered by Dann 2026-09-01,
`docs/memory/INBOX.md:56`.

**Nothing here is committed and nothing is shipped.** The tree is edited and
the gates are run. The commit is yours.

```
SEQUENCE POSITION
item:        N.105, the install prompt remembers "Not now"
serves:      a singer who declines the banner is not asked again on every load
blocked on:  nothing
done when:   "Not now" survives a reload in a walked production build, and the
             thirty-day rule is gated under vitest
displaces:   nothing
```

---

## 1. What changed

Three files carry the fix, two carry a corrected citation.

### New: `apps/web/src/lib/install-decline.ts`

The whole rule, in plain TypeScript with no DOM, so vitest can reach it.
`apps/web` runs vitest with no DOM environment, which is why the component
does the storage and this file only rules on what came out of it.

| line | what |
| --- | --- |
| `install-decline.ts:23` | `DECLINE_KEY = 'ilya:installDeclinedAt'` |
| `install-decline.ts:29` | `DEAD_IOS_KEY = 'ilya-ios-hint-shown'`, exported only so the component can delete it |
| `install-decline.ts:36` | `DECLINE_DAYS = 30` |
| `install-decline.ts:55` | `declineIsFresh(stored, now)` |
| `install-decline.ts:56` | nothing stored is not a decline |
| `install-decline.ts:59` | an unparseable value is not a decline |
| `install-decline.ts:61` | the one comparison, exclusive at the boundary |

### New: `apps/web/src/lib/install-decline.test.ts`

Six tests. The five the brief asked for, plus one for a timestamp in the
future.

### Changed: `apps/web/src/lib/components/InstallPrompt.svelte`

| line | what |
| --- | --- |
| `:4` | imports the key, the dead key, and the rule |
| `:51-59` | `mayAsk()`, a wrapped read, called at each decision point and never cached |
| `:62-68` | `recordDecline()`, a wrapped write of `new Date().toISOString()` |
| `:76` | deletes `ilya-ios-hint-shown` from `sessionStorage` on every mount |
| `:86-87` | the iOS six-second timer now runs only if `mayAsk()` |
| `:96-100` | the listener still registers and still calls `preventDefault`; only the eight-second timer is gated |
| `:111` | a dismissed native prompt writes the same key; an accepted one writes nothing |
| `:119` | `dismiss()` writes on every platform, not just iOS |

The old `sessionStorage` write at the former `:76` is gone, and so is the old
`sessionStorage` read at the former `:52`. One key, one rule, both paths.

### Changed, comments only: `Loupe.svelte:951`, `CorrectionSurface.svelte:752`

Both cited `InstallPrompt.svelte:114` for the `z-index: 9000`. See §5.

## 2. The one judgment call inside the fix

**The `beforeinstallprompt` listener stays registered even when a decline is
fresh, and still calls `preventDefault`.** The obvious shape is to return
before `addEventListener`. That would be wrong. `preventDefault` is what
suppresses Chromium's own install affordance today, so returning early would
hand a singer who just declined Ilya's banner the browser's install prompt
instead. That is a second nag wearing the fix as a costume. Only the banner is
held back (`:99`), which is the one thing the item is about.

DESK DEFAULT, yours to wave off.

## 3. What I walked, and what I saw

Local production build, `pnpm --filter @ilya/web build`, served with
`pnpm --filter @ilya/web preview --port 4173`, walked in the browser pane at
`http://localhost:4173`. Desktop UA, `display-mode: standalone` false.

**Read §4 before you read these numbers. The instrument is not clean.**

| step | what I did | what I saw |
| --- | --- | --- |
| 1 | planted `ilya-ios-hint-shown` in `sessionStorage`, reloaded | after mount the key read `null`. The dead key is deleted. |
| 2 | dispatched `beforeinstallprompt`, waited nine seconds | banner up, heading "Make Ilya yours", buttons "Install" and "Not now" |
| 3 | clicked "Not now" | banner gone; `ilya:installDeclinedAt` read `2026-09-02T04:23:01.678Z`, read four milliseconds after the click |
| 4 | reloaded, dispatched again, waited **ten** seconds | **no banner.** The eight-second timer never fired. |
| 5 | set the stored value to `2026-08-02T04:23:33.361Z`, thirty-one days back, reloaded, dispatched | no banner at six seconds, **banner at ten seconds.** It returned, and it returned on the eight-second timer, not earlier. |
| 6 | clicked "Install" with `userChoice` resolving `dismissed` | banner gone; the stored value was rewritten from the thirty-one-day-old date to `2026-09-02T04:24:05.048Z`. A dismissed native prompt counts. |
| 7 | cleared the key, reloaded, dispatched, clicked "Install" with `userChoice` resolving `accepted` | banner gone, stored value still `null`. An accepted outcome writes nothing. |
| 8 | replaced `Storage.prototype.setItem` with a thrower, then clicked "Not now" | banner closed normally, stored value `null`, **no console error.** A private-mode Safari loses the memory of the decline and loses nothing else. |

Console errors across the whole walk: none.

Step 4 is the item. Ten seconds is deliberate: the timer is eight, so ten is
two seconds past the moment the old build would have raised the banner.

## 4. What could make that walk lie

**The `beforeinstallprompt` events in steps 2 and 4 through 7 were synthetic.**
I dispatched a hand-built `Event` carrying `prompt()` and `userChoice`, because
Chromium withholds the real event behind installability and engagement
heuristics and would not fire it on demand. So the walk exercises every line
this item changed, on the real production bundle, with real `localStorage` and
real timers, but it does not prove that Chromium's own event still arrives.
Nothing in this change touches the conditions under which it arrives, and the
listener registration at `:96` is byte-for-byte where it was.

The two clicks that mattered, "Not now" and "Install", were real pointer events
on the rendered buttons, not scripted calls.

## 5. Citations my edit moved

The script block grew, so everything in the stylesheet moved down 43 lines.
`z-index: 9000` was `InstallPrompt.svelte:114` and is now
`InstallPrompt.svelte:157`.

Two files cited the old number, both in a comment explaining why the loupe sits
above the install prompt:

- `apps/web/src/lib/shane/Loupe.svelte:951`
- `apps/web/src/lib/shane/CorrectionSurface.svelte:752`

Both are updated to `:157`. While in there I corrected the same sentence's
claim: it said the prompt "raises itself six seconds into every iOS Safari
session", which stopped being true tonight. It now says every session that
carries no fresh decline, and names N.105. **The z-index reasoning itself is
untouched and still holds; 9000 has not moved.**

## 6. Gates

Before, on the unedited tree, all five at baseline:

| gate | baseline | before | after |
| --- | --- | --- | --- |
| 1 phonology | `216 passed (216)` | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same | same |
| 4 web-test | `914 passed (914)` | `914 passed (914)` | **`920 passed (920)`** |
| 5 score-parser | `481 passed \| 5 skipped (486)` | same | same |

**Gate 4 moved, and it moved by exactly the six tests this item added.** 914
plus 6 is 920, 47 test files became 48, and nothing that was passing stopped.

**Line 79 of `~/Downloads/ilya-ship.sh` must change** from

```
gate 4 web-test     "914 passed (914)"                          pnpm -C "$REPO" --filter @ilya/web test
```

to the same line with `920 passed (920)`. **I did not edit that file.** Until
it changes, the script reports gate 4 as `DEVIATED FROM BASELINE` and refuses
to stage anything.

Gate 3 is worth a note because it could have moved and did not. `install()`
destructured `outcome` and never used it; now it reads it at `:111`. The
warning count is still 7.

## 7. Two things about shipping this, both yours

**The ship script refuses when untracked files exist, and this item adds three
of them:** `install-decline.ts`, `install-decline.test.ts`, and this memo. The
check is at `ilya-ship.sh:45-51`, before any gate runs, and `git add -u` at the
end stages only tracked modifications. So `sh ~/Downloads/ilya-ship.sh` will
refuse outright until the new files are added, and if it did run, `add -u`
would commit the component change without the file it imports. Adding them
first clears both problems at once.

The brief's commit message:

```
N.105: "Not now" lasts thirty days
```

**I touched `.claude/launch.json` and put it back.** I added a preview entry to
walk the production build, then restored the file to its original bytes when
the walk was done, so it should not appear in your diff. If it does, that is
mine and it is safe to discard. The command the entry ran, for whoever walks
this next:

```bash
pnpm --filter @ilya/web preview --port 4173
```

## 8. The constraint I was asked to answer

The brief: *"Do not add a second silent save site while N.27 is open: this is
one localStorage key for one preference, the same class as `ilya:language`. Say
so in the memo if you disagree."*

**I do not disagree.** `ilya:installDeclinedAt` is one key holding one
preference, written only when the singer presses a button, and it sits beside
`ilya:activeTab` (`+page.svelte:1751`), `ilya:notationPrefs` (`:1766`), and
`ilya:language` (`:2600`) under the same prefix and the same `try/catch` shape.
It stores no work, so nothing can be lost by it failing, which is what step 8
of the walk shows.

One caveat, and it is not a disagreement. This key is silent in the sense N.27
is about: nothing on screen tells a singer a decline was recorded, and nothing
offers to clear it. A singer who declines and then wants the banner back has no
route to it except DevTools. That is small enough not to be a finding, and it
is the same silence `ilya:language` has, so I did nothing about it and did not
number it.

## 9. What I did not do

- **No user-facing string was added, changed, or removed.** The `strings`
  object at `:20-39` is byte-identical, em dashes included. **No French was
  coined.**
- `static/`, the service worker, and the `CriOS` / `FxiOS` exclusion at `:82`
  are untouched. The exclusion moved from `:48` to `:82` with the rest of the
  block, and its text is unchanged.
- No git was run. Nothing is staged, committed, or pushed.
- `docs/memory/STATE.md` is not updated. N.105 is still THE ONE THING there and
  is still unplaced by you, so closing it is not mine to write.

## 10. NOT ESTABLISHED

- **Whether the iOS path behaves as walked on a real iPhone.** The browser pane
  is desktop Chromium; its mobile emulation serves an Android UA, so the
  `/iphone|ipad|ipod/` branch at `:82-90` was never entered. It is one call to
  the same `mayAsk()` the desktop path uses and it is covered by the six unit
  tests, but **it was not walked.** Nothing here should be read as a claim
  about your phone.
- **Whether the real Chromium `beforeinstallprompt` still arrives.** See §4.
  The event I fired was mine.
- **Whether thirty days is right.** It is a DESK DEFAULT, `install-decline.ts:36`,
  and it is one edit to change. Nothing measured it, and nothing in this repo
  records a prior ruling on how long a decline should last. `INBOX.md:56` asked
  you for the number and you have not given it.
- **How many singers this reaches.** The item says it reaches anyone on the
  stable URL who declines. The count is NOT ESTABLISHED and nothing in the tree
  records it.
- **Whether a decline should survive a cleared browser store.** It does not,
  and nothing was built to make it. A singer who clears site data is asked
  again.

**NOT ESTABLISHED beats a complete invented answer.**
