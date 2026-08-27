# Memo: mobile slice 2, r3, the deploy walk's defects

For Dann. Branch `Shane`. Beside r1 and r2, which stand. No commits, no ship.

**The floor moved while I was away: r2 shipped as `e0405bd`**, "N.92: mobile
slice 2, the loupe and the dock", ten files including r1's and r2's memos and
the `INBOX.md` line that was already modified when slice 2 opened. That is the
build you walked, so every defect below is a defect in `e0405bd` and every fix
below sits in the working tree on top of it. Three files are modified and this
memo is new; nothing else is dirty.

Both defects are fixed and the ruling is built. **Your reading of the
dismissal defect was right to the mechanism**, and §1 names it with the line.

## 1. Defect: dismissal was dead, and the tap fell through the control

### The cause

`+page.svelte:869`, `handlePageTap`'s `document.elementFromPoint`, reached by
the same click that dismissed the loupe.

The sequence, in order:

1. The chevron's own `onclick` runs first, at the target, and calls
   `dismissLoupe`. `loupeOpen` becomes false.
2. Svelte flushes and takes `.loupe` and `.dock` out of the DOM.
3. **The same click event is still bubbling.** It reaches the window, where
   `handlePageTap` is bound beside the correction keys.
4. Its first guard is `if (!loupeAvailable || loupeOpen) return`, and
   `loupeOpen` is false now, so the guard lets the click through.
5. `elementFromPoint` is a LIVE query. The dock that stood at those
   coordinates a moment ago is gone, so the document answers with the page
   underneath, and the loupe rises again on the measure at that point.

So the loupe never looked dismissed, it looked repositioned, which is exactly
what you saw and exactly what you called it.

**Reproduced before touching anything.** A chevron press at 396, 538 in
portrait re-tagged the loupe from `m. 9 · system 3 of 6` to
`m. 16 · system 5 of 6`. The same press in landscape dismissed correctly.

**And that is why r1's walk passed.** The only chevron press in that walk was
the landscape one, where the dock sits down the left edge and the page starts
below the chevron, so nothing was under it to fall through to. In portrait the
chevron sits at 396, 538 and the sheet spans 24 to 406 by 120 to 614, so the
chevron is squarely over the page. **I tested the case that could not fail.**

### The swipe had a second cause

The swipe passed the walk too, and for a reason that does not survive contact
with glass: the harness drives it with mouse events, which nothing else
competes for. On a finger, a downward drag beginning on a scrollable box is a
scroll as far as the browser is concerned. It claims the pointer and answers
with `pointercancel`, and the `pointerup` the dismissal listens for never
arrives.

### The fixes

**`+page.svelte:873-874`, two tests, because there are two cases.**

- The click's own target still answers `closest('.loupe, .dock')` after Svelte
  removes it, because a detached subtree keeps its own ancestors. That covers
  the chevron and every other control on either surface.
- A click synthesized at the end of a swipe can carry a target that is already
  the page, so `:921` remembers on `pointerdown` whether the gesture began on
  a surface and `:874` consults it. It is cleared on the next frame
  (`requestAnimationFrame`), because the click arrives after `pointerup` and
  the flag has to still be standing when it does.

**`+page.svelte:944` handles `pointercancel`**, bound at `:2480`, so a gesture
the browser takes away clears the flag instead of leaving it standing to
swallow the next page tap.

**`Loupe.svelte:461` and `CorrectionDock.svelte:468` take `touch-action:
none`**, so the swipe is ours rather than the scroller's. The ruled grammar
gives pinch on the loupe no meaning and the stations are sized not to scroll,
so this costs nothing that was ruled in. `overflow-y: auto` stays on the dock
as the safety it always was, and a pointer that is not a finger still reaches
it.

## 2. Defect: no exclusion between the drawer and the dock

`+page.svelte:956-970`. Opening the drawer now sends the loupe and the dock
away in the same one motion they leave by any other route.

It is an effect on `drawerCollapsed` rather than a line inside
`handleDrawerToggle`, so a drawer opened by any means closes them, not only a
drawer opened by the pull.

**It costs the selection**, because it is the same leave the chevron performs
and `dismissLoupe` clears the taken entry. One consequence follows and you
should see it stated: on a phone the drawer's own correction station is now
idle whenever the drawer is open, because nothing is selected and the page is
behind the drawer, so the dock is the phone's correction surface and the
drawer is not a second way in. **That reads to me like the ruling's intent
rather than a cost of it, but it is yours to confirm.**

## 3. Ruled: the loupe anchors fixed and never travels

`Loupe.svelte:317-343`, and it replaces the placement r2 shipped, which moved
the loupe to keep the sage rectangle in view. The page is the thing that stays
still and the loupe is the thing that stays put; the sage rectangle alone
moves across it, and the measure tag carries the name.

Two things had to become constants for "never travels" to be true rather than
nearly true.

**The window's height is sized by the tallest system on the page**, not by the
one in hand (`:337-342`). The renderer crops each system's headroom to its own
ink, so systems differ by a few units, and a window sized to the held system
breathed by those units at every step. Each measure now draws at its own
height and is centred in a constant window.

**The anchor is the dock, not the measure** (`:408`). Portrait pins the
loupe's own bottom edge one gutter above the dock, using `bottom` rather than
`top` so a measure of a different height grows upward instead of shifting the
frame. Landscape has the dock down its left side and nothing above it, so the
loupe centres in the room to its right, which is a constant now that its
height is one.

**One residue, measured, and it is yours to rule.** The loupe still moves in
one circumstance: when the Undo pill appears or goes, the dock grows or shrinks
by its row and the loupe follows, **50.0 px in portrait**. That is two rulings
meeting: the pill is absent rather than disabled, and the loupe is anchored
above the dock. It happens once at the first correction of a session rather
than at every step. The one-line fix, if you want it, is to reserve the pill's
row height always and leave it empty, which costs no ink and holds the loupe
still; the landscape dock still measures 430 either way. **I did not do it,
because reserving space for an absent control is close enough to your "a
control that cannot act earns no ink" that it should be your call and not
mine.**

## 4. What I looked at with my own eyes

Same harness, 430 by 932 and 932 by 430, touch emulation on, your engraved
`Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`.

| check | result |
|---|---|
| chevron, PORTRAIT, over the page | loupe gone, dock gone |
| swipe down starting on the loupe | loupe gone, dock gone |
| swipe down starting on the dock | loupe gone, dock gone |
| chevron, landscape | loupe gone, dock gone |
| a dock verb still fires | `C♯3 · Quarter` became `C♯3 · Eighth`, loupe still up |
| opening the drawer | loupe gone, dock gone, drawer open |
| print, loupe up | loupe `none`, dock `none`, mark `none`, page opacity `1` |

**The guard does not swallow the work.** The dock's duration cell fired and
left the loupe standing, which is the case that would break if the guard were
too wide.

**Ruling 3, measured across three measures and two systems.** Stepping the
insertion point from `m. 5 · system 2 of 6` to `m. 6` and on to
`m. 8 · system 3 of 6`:

- the loupe's box read `[24, 315.4, 382, 165.6]` at all three, identical;
- its window read `360 by 119.1` at all three, identical;
- the sage rectangle read `[95.2, 260.6]`, then `[186.2, 260.6]`, then
  `[95.2, 310.7]`, moving along the system and then down to the next.

**The loupe held still and the mark travelled**, which is the ruling in one
line. Landscape the same: nine steps, the box `[404, 67.8, 504, 300.9]`
unchanged throughout.

**Desktop, 1400 by 900, re-verified after this round.** No loupe, no dock, no
insertion bar, no held mark, full ink, drawer name `Controls`, both semitone
verbs still in the drawer, and a click on a note still places the armed
syllable.

## 5. Gate results, run just now

All five at the baseline the ship script now holds. Nothing moved this round.

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `822 passed (822)` | `822 passed (822)` |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

**Gate 4 is unchanged from r2 at 822**, and no test was added this round. That
is not an omission I am hiding: every fix here is a guard in an event handler,
an effect, or a CSS declaration, and none of it is pure logic that a node-
environment test could hold. `loupe.ts` still carries the 22.

`~/Downloads/ilya-ship.sh:79` **already says 822**, moved with the `e0405bd`
ship. I read it rather than edited it, and nothing in this round moves it
again.

## 6. What this round did not settle

- **The Undo pill's 50 px**, §3. The only travel left in the loupe.
- **The sage rectangle can still sit behind the loupe**, and now it always will
  for the systems the loupe covers, because the loupe no longer moves out of
  its way. That is the ruling, and the tag is what answers it. Worth one look
  on glass to confirm the tag is enough.
- **`touch-action: none` on both surfaces is unverified on iOS Safari.** It is
  the standard cure for a scroller stealing a drag and I expect it to hold,
  but the swipe that failed on your walk failed on a real device and my
  evidence for the fix is Chromium's.
- **Everything carried from r2's "not established" stands**: the ink step
  between the page's two states, whether 2.4 should multiply the thumbnail or
  the engraved page, coarse-pointer behaviour, the dense-page case, thumb
  reach for the landscape dock, the two lyric anchors disagreeing on purpose,
  whether a whole note should draw true or draw to fit, and the missing pitch
  crossbar.

## 7. Housekeeping

The dev server on port 5174 is stopped. Nothing was copied into the
repository's static directories. Walk scripts and screenshots are in this
session's scratchpad, outside the tree.

---

## 8. Appended: the Undo pill's row, reserved

Ruled by Dann after reading §3: reserve the row so the dock's geometry never
changes, and keep the pill absent when it cannot act, with no ink drawn.

**Built.** `CorrectionDock.svelte:286` renders the row unconditionally and the
pill inside it only when there is something to undo; `:553-555` gives the row
the pill's own 44 px floor. The two rulings stop pulling against each other
without either one bending, because **an empty row draws nothing.** Measured on
the empty row: border `0px`, background `rgba(0, 0, 0, 0)`, text content empty,
tappable targets zero. It is height and nothing else.

### Measured, portrait at 430 by 932

| | dock height | loupe box | undo row | pill |
|---|---|---|---|---|
| nothing to undo | 477 | `[24, 265.4, 382, 165.6]` | 44 | absent |
| after a duration change | 477 | `[24, 265.4, 382, 165.6]` | 44 | `↰ Undo: Quarter → Eighth` |
| after undoing it | 477 | `[24, 265.4, 382, 165.6]` | 44 | absent |

**The dock's height does not change and the loupe does not move.** The third
row is byte-identical to the first, so the surface returns to exactly where it
started rather than to somewhere near it. The 50 px travel r3 reported is gone.

### Measured, landscape at 932 by 430

The dock reads 380 by **430** with the pill and without it, the loupe holds
`[404, 67.8, 504, 300.9]` through both, and `scrollHeight` equals
`clientHeight` at 430, so **it still fits without scrolling**. The row that was
the last 48 px of slack is now spent permanently and the fit is unchanged,
because the tightened landscape values of r1 §6 already accounted for a dock
carrying a pill.

The chevron still dismisses, checked after the change, so nothing about the
reserved row interferes with the r3 fix beneath it.

### Gates, re-run after this change

All five at baseline. Nothing moved; no test was added, for the same reason as
r3, which is that a reserved row is one CSS declaration and a moved `{#if}`.

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `822 passed (822)` | `822 passed (822)` |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

**§6's first item is closed.** The rest of that list stands unchanged. Dev
server stopped; no commits, no ship.
