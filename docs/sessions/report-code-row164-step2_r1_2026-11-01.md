# Report: row 164, step 2, drag on the desk (r1, 2026-11-01)

Branch `mac-row164`; step 1 is `0748a09b`. Nothing pushed, no pull request.

## What was built

- **`loupe-drag.svelte.ts`** (new): `LoupeDrag` holds the offset `{x, y}`, whether a drag is in flight, the window's size, and the header's height. The offset is added to where the loupe seats the card (`frame.left` and `anchorTop`), never written over them. Pointer capture on the header; a press that starts on a header button never begins a drag; no key drags (the buttons remain the keyboard's way in).
- **`clampDrag` and `DragOffset`, `DragHome`** (`loupe.ts`, pure): the whole header stays on screen. Left edge no further left than `dockInset + GUTTER`, right edge no further right than the viewport less the gutter, top no higher than the gutter, header bottom no lower than the viewport less the gutter. Where the room is smaller than the header the left and top edges win, the order `frame.left` already clamps in. Six unit tests beside `isDismissSwipe` (`loupe.test.ts`).
- **Re-clamp.** The clamp runs on every pointer move and again on every read of `shift`, which `Loupe` derives; the window's size comes from a `<svelte:window>` in `LoupeHeader`, so a resize or the drawer opening (`dockInset`) pulls the card back. Checked live: dragged far right and up at 1400 by 900 (header right edge 1374.98, 25.02 from the edge), then resized to 1000 by 700: the layout became the phone's and the header is at x 145, y 25, inside the window.
- **Reset on close.** `Loupe` is destroyed on close (`+page.svelte`, the `{#if loupeAvailable && loupeOpen && cursor}`), and the `LoupeDrag` goes with it. Confirmed by e2e: drag, Close, raise again, the card is back at its seat to the pixel (after the 180 ms rise).
- **Holds while open.** Confirmed by e2e: after a drag, `ArrowRight` to the next note leaves the card where the singer put it (within 2 px vertically).
- **The panel follows the card.** `panelRoom` subtracts the shift, so Syllables or Corrections still hang below the card wherever it stands and scroll in the room that is left. Drag, then open the panel: loupe 468.5 px tall at y 259, panel 140 px at y 574 (`step2-desktop-1400-dragged-open.png`).
- **No easing against the pointer.** `.loupe.eased:not(.dragging)` (the 150 ms width and left transition is off while a drag is in flight).
- **Phone.** `drag` is passed only when `isPhone` is false, so a phone's header is not a handle. The swipe stays gated on `isPhone` (`+page.svelte:1429`), so a desk drag cannot dismiss.
- **Cursor.** `grab` on the desk's header, `grabbing` during a drag, `user-select: none`.

## Drawer clamp is correct, not a bug

At 1440 by 900 with the drawer open, a leftward drag stops 75 px from where I asked: the left edge is held at `dockInset + GUTTER`, the card's own seat (619) less the drawer's 544. My first e2e asked for 120 and received 75; the test now asks for 40.

## Ratchets

| file | ceiling | before step 2 | after |
|---|---|---|---|
| `Loupe.svelte` | 3013 | 3008 | 3012 |
| `+page.svelte` | 5586 | 5585 | 5585 |
| `LoupeHeader.svelte` (new) | 1000 | 120 | 157 |
| `loupe-drag.svelte.ts` (new) | 1000 | none | 77 |
| `loupe.ts` | none listed | 947 | 990 |

`loupe.ts` carries no ceiling of its own but is near the 1000-line new-file guide; step 3's pure functions should go in a new file if there are many. No ceiling raised.

## Gates

| Gate | Result |
|---|---|
| web check | found 0 errors and 12 warnings in 5 files |
| web test | 3790 passed, 1 skipped (3791) (3784 plus the six `clampDrag` cases) |
| `pnpm ratchets` | ratchets: OK. |
| e2e `loupe-header.test.ts` (5) | 5 passed; `loupe-head-caret.test.ts` (2) passed |

## Not established

- Dragging by touch is not built (the ruling names the desk only). A desk-width window with a touch screen can still drag by pointer events, which touch produces; this was not tried.
- Keyboard drag does not exist, per amendment 9.
- Screenshot: `step2-desktop-1400-dragged-open.png` in `docs/sessions/measure-loupe-header-r164_2026-11-01/` with `shoot-step2.mjs`.
