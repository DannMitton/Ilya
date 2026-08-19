# N.73 S1: the desk selector and the drawer's pull

**Written by Code, 2026-08-19, on branch `Shane` from floor `cb2ecc0`.** The
work is in the working tree and is not committed: the brief says you ship, so
this memo cannot carry its own commit sha. When you run the ship script, this
file goes in the same commit as the code.

All five gates run and all five sit at baseline. No baseline needs your
permission to move.

---

## 1. What shipped

Two new files:

- `apps/web/src/lib/components/DeskHead.svelte`. The desk head: the boxed pair
  on the left, Learn and Guide on the right, one line across the top of the
  desk on every display.
- `apps/web/src/lib/destinations.ts`. The `TabId` type, which had been living
  in `TabBar.svelte`. It is not drawer furniture: `+page.svelte` owns the
  active destination, `HeaderBar` keys its colour from it, and the drawer only
  receives it. So it now lives in a module with no component attached. That
  answers §2.1's question about where the type went.

One file deleted: `apps/web/src/lib/components/Drawer/TabBar.svelte`, along with
both of its mounts.

Five files changed:

- `apps/web/src/app.css`. The three desk tints.
- `apps/web/src/lib/i18n.ts`. Two keys added, `tab.markedScore` and
  `drawer.pull`.
- `apps/web/src/lib/components/Drawer/Drawer.svelte`. The tab bar mount and the
  phone's top handle deleted, the lip restyled into the pull, the motion turned
  horizontal.
- `apps/web/src/lib/components/HeaderBar.svelte`. The Marked score takes sage.
- `apps/web/src/routes/+page.svelte`. The desk head mounted, the phone's tab bar
  and paper handle deleted, every rule written in terms of the 56 px bar
  repaired.
- `apps/web/src/lib/components/InstallPrompt.svelte`. Its bottom offset.

The strings ship as ratified. `Marked score` and « Partition annotée » are byte
for byte the table's, and the pull's accessible name is `Drawer` and « Tiroir ».
`tab.fit` is untouched: Fit is the tool's name and invariant in French, and the
pair's second document is not called Fit.

---

## 2. Every `56px` hit and its disposition

`grep -rn "56px" apps/web/src` finds fourteen hits. The brief named seven of
them. Here is all fourteen.

| site at `cb2ecc0` | what it was | disposition |
|---|---|---|
| `Drawer/Drawer.svelte:958` | `.drawer { height: calc(100dvh - 56px) !important }` | now `100dvh`. N.41's own repair, made |
| `Drawer/Drawer.svelte:21` | the header comment restating that rule | rewritten. It names the rule and stops citing a line number, because a line number in a comment rots |
| `+page.svelte:2845` | `.main-content { padding-bottom: calc(56px + 36px + 0.5rem) }` | now `0.5rem`. Both terms are gone with the furniture they reserved |
| `+page.svelte:2831-2844` | the comment explaining the 92 px | rewritten. It records what the reservation was for and that N.73 S1 deleted both pieces |
| `+page.svelte:2860` | `.paper-handle { bottom: 56px }` | deleted with the handle |
| `+page.svelte:2906-2918` | the `.mobile-tabbar` block, `height: 56px`, `z-index: 50` | deleted, both the stub and the media-query block |
| `+page.svelte:2987` | `.update-toast { bottom: calc(56px + 0.75rem) }` | now `0.75rem`, comment rewritten |
| `InstallPrompt.svelte:100` | `.install-prompt { bottom: 56px }` | now `16px`, not `0`. See below |
| `+page.svelte:2407` | `:global(.gt-label-h) { min-width: 56px; width: 56px }` (two hits on one line) | UNTOUCHED. This is the gutter label's width in the transcription table. It has nothing to do with the bar |
| `+page.svelte:2449-2450` | the same two properties in a media query | UNTOUCHED, same reason |
| `Paper/WordStack.svelte:232` | a comment, "Content fits within 56px row" | UNTOUCHED. Row geometry |
| `Paper/TitlePage.svelte:94` | a comment, "10 rows at 56px = 560px" | UNTOUCHED. Page geometry |

**The brief said the tree holds six sites. It holds seven that matter,** the six
plus `InstallPrompt`, which its own table lists. The other five hits are three
unrelated rules and two comments, and the coincidence of the number is exactly
why the census was worth running rather than trusting.

**`InstallPrompt` is `16px`, not `0`, and here is why not.** The 56 px was
clearance for the bar, not a designed gap. The prompt is a floating card with an
8 px radius and a drop shadow, and flush against the viewport edge it loses both
and sits under the iPhone's home indicator. 16 px is a gap where 56 px was
clearance.

---

## 3. The drawer's motion

**What changed.** One property, as the brief predicted. The phone's collapsed
drawer was `transform: translateY(100%)` and is now `translateX(-100%)`. It
arrives from the left, matching the side it sits on at the desktop, where
`.drawer-body`'s double `border-right` faces the paper. The transition duration
and easing are the ones that were there, 400 ms on
`cubic-bezier(0.22, 1, 0.36, 1)`, and the `prefers-reduced-motion` rule still
covers the drawer and now covers the chevron.

**What the collapsed drawer does to touches.** `width: 0 !important` is gone.
Two things replace it, and I verified both in the browser at 390 by 844:

1. The overlay is entirely off-screen. Its rect is x from -390 to 0.
2. It carries `pointer-events: none`, with `pointer-events: auto` restored on
   the pull alone, since the pull is how a closed drawer gets opened.

`document.elementFromPoint` at three places on the desk with the drawer closed
returns `.main-content` and the sheet's own content, never the drawer. At the
pull's centre it returns the chevron inside the pull. The collapsed drawer
intercepts nothing and the pull is pressable.

**What it does to horizontal scroll.** Nothing. Measured with the drawer closed
at 390 by 844: `documentElement.scrollWidth` is 390 and `clientWidth` is 390.
There is no horizontal scrollbar and no scrollable overflow, because a
left-to-right document does not scroll into negative space, and the overlay is
`position: fixed` besides.

---

## 4. The contrast numbers I computed

Computed at the hexes that ship, not at any hex in a document, per N.42 §6.
WCAG 2.x relative luminance, sRGB.

| pair | ratio |
|---|---|
| card label `#1a1612` on card fill `#F0EBE0` | 15.13:1 |
| ink `#1a1612` on the sage desk `#D1D7CB` | 12.24:1 |
| ink `#1a1612` on the rose desk `#DBCACA` | 11.40:1 |
| ink `#1a1612` on the cobalt desk `#BEC7D8` | 10.58:1 |

The card's border is the same `#1a1612` against the same three desks, so it
carries the same three numbers, 10.58 to 12.24:1. Everything the desk head draws
is dark ink on a light desk, and every number clears AA and AAA for text at any
size.

These agree with the ruled configuration's stated measurements (card border 10.6
to 12.2:1, card label 15.1:1, desk labels 10.6 to 12.2:1).

**The sheet against its desk** is 1.24:1 on sage, 1.33:1 on rose, 1.43:1 on
cobalt. That is your taste ruling, made twice. It is recorded here as a fact and
NOT as a compliance exception, and nothing was done to it.

---

## 5. Where the tree beat the brief

This is the section the brief says is the point of the memo.

### The line numbers that had moved

Most of the brief's numbers were right. These were not:

- **`+page.svelte:758` and `:888`, the wall's consumer sites.** They are at
  **1660** (the `localStorage` restore, which validates a saved `shane` against
  `INCLUDE_SHANE`) and **1871** (the `shanePanel` snippet). The brief predicted
  this rot and it was the largest, roughly nine hundred lines.
- **`TabBar.svelte:40-62`, the roving focus.** It is at 42-65.
- **`Drawer.svelte:962` and `:968`**, the mobile transition and the collapsed
  width. They are at 961 and 967.
- **`Drawer.svelte:1005-1020`, the phone's top handle.** The mobile rule is at
  1006-1021, and see the next item.
- **`+page.svelte:2905-2920`, the `.mobile-tabbar` block.** It is at 2906-2918,
  in two pieces: a `display: none` stub and the media-query block.

Exact at `cb2ecc0`, checked: `app.css:57-59`, `i18n.ts:30-33`,
`Drawer.svelte:21`, `:437`, `:443`, `:485`, `:958`, `:645-667`,
`HeaderBar.svelte:3`, `:29-32`, `+page.svelte:2162`, `:2845`, `:2860`,
`InstallPrompt.svelte:100`.

### The claims that were wrong

1. **"Delete both phone handles" is four rules and a spacer, not two blocks.**
   `.drawer-handle-top` exists twice, a `display: none` stub at
   `Drawer.svelte:926` and the real rule at 1006. With it went
   `.mobile-handle-shape`, `.mobile-handle-chevron`, and
   `.mobile-handle-spacer`, plus a `<div class="mobile-handle-spacer">` in the
   markup that reserved 36 px at the top of the drawer body. Deleting only the
   two named blocks would have left a 36 px hole at the top of the phone's
   drawer.

2. **§2.5 and §2.7 collide, and I followed §2.7.** §2.5 says to fold `shane`
   into `transcription` in the drawer lip's per-destination hover rules
   (`Drawer.svelte:645-667`). §2.7 rules the pull is a bare neutral chevron on a
   drawer-fill tab, and the lip-options document it cites says outright that the
   hue stays neutral, that hue names place and ink names state. Those cannot both
   hold: a neutral tab has no per-destination colour to fold anything into. **I
   deleted all eight rules,** the four destination colours and their four hover
   shades, along with `.drawer-handle`, `.handle-chevron`, and the
   `--handle-bg` and `--handle-fg` custom properties. This satisfies §2.5's
   intent more completely than folding would: there is no lavender left anywhere
   in the pull. **One word from you reverses it.**

3. **The mockup draws the desk head on a DARK desk, in light ink.** Exhibit 1's
   `.p-deskhead` uses `#f0ede4` text on `#6E6A60`. §4.1's default takes the desk
   light, so the ink inverts to `#1a1612`. I built the ruling, not the drawing,
   which is what §4.1 and the mockup's own session record ask for.

4. **The mockup's desk head spans the phone's full width, not the sheet's.** Its
   `.fitpage` is 186 px centred inside a full-width `.p-deskhead`. Placement B
   is the ruling, so the head is flush with the sheet and not with the desk. The
   ruling wins over the drawing, per §1.

### The defects the tree handed me, both found in the browser

5. **A sticky child of a padded scroll container sticks at the container's
   CONTENT edge, not its padding edge.** With `top: 0` the desk head stuck 32 px
   low, leaving a strip the height of `.main-content`'s top padding where the
   sheet slid past in the open. The fix is `top: calc(-1 * var(--desk-pad-top))`,
   and `--desk-pad-top` is now set beside every rule that changes that padding,
   which is three: the base rule, `.reading-mode`, and the mobile block.
   Measured: at rest the head sits at y 80, and stuck it sits at y 48, flush with
   the top of the scroll region.

6. **`.drawer`'s mobile `overflow: hidden` clipped the pull out of sight.** With
   the drawer closed, the pull is laid out correctly at x 0 to 44, and it was
   invisible: it sits at `left: 100%`, outside the drawer's own box, and the
   drawer was clipping it. The phone had no way to open its drawer for about ten
   minutes. It is now `overflow: visible`; `.drawer-clip` still clips the body,
   which is what that element is for.

---

## 6. What I refused to invent

`NOT ESTABLISHED` against each.

1. **`paper.empty.mobile` is now false, and I did not rewrite it.** It reads
   "Tap the chevron at the bottom to open the drawer." and « Appuyez sur le
   chevron en bas pour ouvrir le tiroir. » (`i18n.ts:160`, rendered at
   `Paper/TitlePage.svelte:158`). The chevron is not at the bottom any more; it
   is on the left. I saw the French string on the phone during the walk, so a
   singer with an empty document will. **This is copy, the ratified table has no
   replacement in it, and §3 forbids me French that is not in the table.**
   The one-line fix, if you want it, is to render `paper.empty` on both displays
   rather than `paper.empty.mobile`: it says "in the drawer on the left", which
   is now true on the phone as well. That retires a string and writes no new
   French. **It needs your word, not mine.** NOT ESTABLISHED: what the phone
   should tell a singer with an empty document.

2. **iOS's left-edge back-swipe against a left-flush pull.** The pull sits at
   x 0 to 44 with the drawer closed, which is inside the strip iOS reserves for
   its own navigation gesture. A press is not a swipe, so the risk is low and it
   is real, and no desktop browser can settle it. **I did not inset it**, because
   insetting it on a guess would cost the flush edge for nothing. It is item 6
   in your walk. NOT ESTABLISHED: whether a real iPhone delivers that press.

3. **Whether Learn and Guide should show that they are the active
   destination.** Nothing in the head marks them when they are current; the desk
   tint and the app bar's colour do. "The active destination takes treatment C, a
   card" sits in §2.2's paragraph about the pair, and reading it to cover the
   links would put a card and an underline on the same word. I built the narrow
   reading. NOT ESTABLISHED: whether the links want an active state.

4. **The desk head in landscape at 844 by 390.** It builds and it holds one
   line: the pair is 261 px, the links are 96 px, and 423 px of desk sits between
   them. No collapse rule was invented. **One thing to report there:** the head is
   flush with the sheet at 1427 by 840 and at 390 by 844, exactly, both edges at
   the same x. At 844 by 390 they differ by 18 px, because the transcription
   sheet is a fixed 816 px that `flex-shrink: 0` lets overflow a desk whose
   content box is only 780 px wide, and the head stays inside the desk. The
   sheet is the one leaving its container there, not the head. NOT ESTABLISHED:
   which of the two should give way when the desk is narrower than the sheet.

5. **What still reads `tab.fit`: nothing.** `TabBar.svelte:31` was its only
   consumer and it is deleted. I left the key in place rather than deleting it,
   because Fit the tool is not gone, only this use of its name. **Two more keys
   also have no consumer now:** `drawer.expand` and `drawer.collapse`
   (`i18n.ts:20-21`), replaced by `drawer.pull` plus `aria-expanded`. All three
   are reported rather than deleted.

6. **What I anchored "flush left" to,** since §5.5 asks. `.main-content`
   publishes `--sheet-width` and `DeskHead` takes its `max-width` from it: 816 px
   for Transcription and the Marked score, which is `PAGE_SIZES.letter.width` in
   `$lib/page-config.ts`, and 720 px for Learn and Guide, which is
   `ReadingPaper`'s own `max-width`. Below the mobile breakpoint both sheets go
   full width and so does the head. I anchored to the sheet's declared width, not
   to a measurement of the sheet at runtime.

---

## 7. The gate numbers

Run here, on your machine, after the last edit.

| gate | baseline | run |
|---|---|---|
| phonology | 216 | **216 passed** |
| dictionary | 235 | **235 passed** |
| web-check | 0 errors, 7 warnings, 4 files | **0 errors, 7 warnings, 4 files** |
| web-test | 671 | **671 passed**, 37 files |
| score-parser | 444 passed, 5 skipped | **444 passed, 5 skipped** |

**No baseline moves, so `ilya-ship.sh:79` needs no `sed` and no permission.**

Gate 4 held at 671 for the reason §5.6 predicted: `vitest` never compiles a
`.svelte` file, and this step added no testable module. `DeskHead.svelte`'s
roving focus is therefore covered by the walk and by `svelte-check`, and by
nothing else. That is a real gap and it is the ordinary one for this
architecture, not a new one.

`pnpm --filter @ilya/web build` also runs clean, which is not a gate but is
worth knowing before a deploy: the wall's dead branch tree-shakes and
`stamp-sw` stamped a fresh `CACHE_VERSION`.

---

## 8. What you must walk

On a real deploy, in this order. The deploy is the one you make from the commit
that carries this memo; nothing here was verified on a deployed build, only on
`localhost:5173`.

1. **On the phone, no bar at the bottom, and the page has its 56 px back.**
   Scroll to the end of a transcribed document and check the last line clears
   the bottom of the screen.
2. **The desk head is one line above the sheet, in both languages,** at 1427 by
   840 and at 390 by 844. In French the pair reads TRANSCRIPTION and PARTITION
   ANNOTÉE, and it fits at 390 px.
3. **With the drawer closed on desktop, all four destinations are reachable.**
   This is audit finding F4 and this walk is the cure's proof.
4. **The pair rests as 1c while you read:** no thumb, both words at equal
   weight, the track drawn. On Learn or Guide neither member is a card, which is
   deliberate: you are not in Studio.
5. **Switching the pair still switches the document, and the app bar is sage on
   both Studio documents,** rose on Learn, cobalt on Guide. The lavender bar is
   gone.
6. **The drawer opens sideways on the phone and on the desktop,** from one tab
   in the same relative place, and the chevron points the way it will move both
   times. One press opens, one press closes. **This is the item where the iPhone
   can still beat me:** the closed pull sits flush against the left edge, inside
   iOS's back-swipe strip. If the press does not land, tell me and I will inset
   it. Check the thumb reach in portrait while you are there; the pull is 44 by
   88 on a coarse pointer, vertically centred.
7. **Closing the drawer on the phone discards no drawer state.** Type into the
   text field, close, reopen. It survived here, and the structural reason is that
   the drawer is never unmounted: `collapsed` is a class driving a transform, so
   there is no state to discard. E.44 §NOT ESTABLISHED item 8 is answered by
   that reason, and your walk is what confirms it on a real phone.
8. **The three desks render at the ruled tints and the head's ink is legible on
   each,** at the numbers in §4.
9. **A wall-closed build shows one document and no pair.** Verified here with a
   temporary `.env.local`, which is deleted: the head showed TRANSCRIPTION
   alone, no track and no divider, with Learn and Guide still beside it. If you
   want it on a deploy, that is a build with `PUBLIC_INCLUDE_SHANE` unset.

---

## 9. Before you ship

`ilya-ship.sh` refuses on untracked files anywhere in the repository. Two new
files need `git add` first, and this memo is one of them:

```
git add apps/web/src/lib/components/DeskHead.svelte \
        apps/web/src/lib/destinations.ts \
        docs/sessions/n73-s1-the-desk-selector_r1_2026-08-19.md
```

`docs/sessions/brief-to-code-n73-s1-desk-selector_r1_2026-08-19.md` is already
staged, so the script will not trip on it. Nothing else was written to your
disk: a `.claude/launch.json` existed while the dev server ran for the walk and
is deleted, and the `apps/web/.env.local` used for the wall-closed check is
deleted. `apps/web/.env` is untouched and still says
`PUBLIC_INCLUDE_SHANE=true`.

Then:

```
sh ~/Downloads/ilya-ship.sh "N.73 S1: the desk selector and the drawer's pull"
```
