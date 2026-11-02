# Report: row 164, step 3, the phone's top and bottom (r1, 2026-11-01)

Branch `mac-row164`; step 2 is `ab5149c6`. Nothing pushed, no pull request. This is the last step; the report closes the row.

## What was built

- **A tap on the header flips the card** (phone only). The label side of the band is a `<button>` that fills the band up to the actions, named for where it will go: `loupe.moveTop` "Move the Loupe to the top", `loupe.moveBottom` "Move the Loupe to the bottom" (ordinary case: a screen reader says it, `interface-text.md` §3). On the desk the label stays a plain element and the drag handle.
- **Three places, not two (my reading; NOT ESTABLISHED by the ruling).** The ruling says "flips between the top and the bottom". Today's phone Loupe sits centred on the stage (`centreOnPage`), which is what keeps the bar the singer is looking at clear, and amendment 8 says the *top* is pinned at the gutter. Pinning the top as the opening place would have moved every phone's first Loupe. So it opens where it always has (`seat`); the first tap goes to the edge farther from the seat (at 390 by 844, m. 2: the bottom); after that a tap flips top and bottom. If Dann wants it to open at the top, it is one default in `loupe-place.svelte.ts` (`edge`).
- **At the bottom the Loupe grows upward (Dann 13:05).** Built as ruled: the header and the music stay at the foot, the panel rises above them. The card is pinned by its bottom edge, 8 px (`PANEL_FOOT`) above the screen's foot. The panel's room at the bottom is `viewportHeight - PANEL_FOOT - GUTTER - fixedHeight` (amendment 8's formula), via `panelRoom` in `loupe-edge.ts`. When the panel is open at the bottom the card is a column in reverse order (`.loupe.up`), the header's top corners square off (the panel is the card's top), and the panel takes 10 px of top padding.
- **At the top** the card is pinned at the 24 px gutter and the panel hangs below, as it did.
- **Header and swipe.** A finger that moved more than 10 px (`TAP_SLOP_PX`) between press and click flips nothing, and `isDismissSwipe` is 56 px, so one gesture is never both; a key press (`detail` 0) flips without the finger test. A swipe down from the header closes the Loupe as before (e2e).
- Placement now lives in `loupe-place.svelte.ts` (`LoupePlace`, renamed from the step 2 file `loupe-drag.svelte.ts`: it holds the drag and the edge) and `loupe-edge.ts` (pure, tested in `loupe-edge.test.ts`: seven cases).

## The panel state at the bottom, measured (390 by 844, Without Sun song 1, m. 2, Corrections)

| state | card y, height | header y | panel y, height |
|---|---|---|---|
| seat, shut | 182.1, 323.6 | 183.1 | 492.6, 0 |
| bottom, shut | 512.4, 323.6 (ends at 836 = 844 less 8) | 513.4 | 823, 0 |
| bottom, open | 25.3, 810.8 | 513.4 (unmoved) | 26.3, 487.2 (above the header) |
| top, open | 24, 816.8 | 25 | 334.6, 493.2 |
| top, shut | 24, 323.6 | 25 | 334.6, 0 |

Pictures: `step3-phone-390-seat-shut.png`, `-bottom-shut.png`, `-bottom-open.png`, `-top-open.png`, `-top-shut.png` in `docs/sessions/measure-loupe-header-r164_2026-11-01/` (harness `shoot-step3.mjs`). At 1400 the Loupe has no top and bottom; its shut and open pictures are step 1's and step 2's.

## The chevron: ESTABLISHED (step 1)

It opens and shuts the Syllables or Corrections panel and stays flush right in the bottom bar. At 390 px the bar is still two rows (90 px, measured again in every state above); see step 1 for the arithmetic.

## French held: every new value is the English with `// TODO-FR`

| key | English | French in the tree | draft for Dann |
|---|---|---|---|
| `loupe.title` | LOUPE | LOUPE | « LOUPE » |
| `loupe.close` | Close | Close | « Fermer » (the tree's `calib.capture.toastDismissAria`) |
| `loupe.moveTop` | Move the Loupe to the top | Move the Loupe to the top | « Placer la loupe en haut » |
| `loupe.moveBottom` | Move the Loupe to the bottom | Move the Loupe to the bottom | « Placer la loupe en bas » |

The two move labels are screen-reader text, so « la loupe » stays in ordinary case (`interface-text.md` §3). The drafts are mine, for Dann to rule; nothing French reaches `Shane` before that.

## Ratchets, before and after the whole row

| file | ceiling | start (`6f740dbf`) | end |
|---|---|---|---|
| `Loupe.svelte` | 3013 | 3012 | 3011 |
| `+page.svelte` | 5586 | 5586 | 5585 |
| `LoupeHeader.svelte` (new) | 1000 | none | 182 |
| `loupe-place.svelte.ts` (new) | 1000 | none | 110 |
| `loupe-edge.ts` (new) | 1000 | none | 60 |
| `loupe.ts` | none listed | 947 | 990 |

No ceiling raised. `Loupe.svelte` ends 2 under its ceiling by trimming the comments this row rewrote and by moving the panel arithmetic into `loupe-edge.ts`. `loupe.ts` is 10 lines under the 1000-line new-file guide.

## Gates on this tip

| Gate | Result |
|---|---|
| phonology | 291 passed (291) |
| dictionary | 248 passed (248) |
| web check | found 0 errors and 12 warnings in 5 files |
| web test | 3797 passed, 1 skipped (3798) (baseline 3784 plus 13 new: six `clampDrag`, seven in `loupe-edge.test.ts`) |
| score-parser | 785 passed, 5 skipped (790) |
| blurb | 145 passed (145) |
| integration | 55 passed (55) |
| `pnpm ratchets` | ratchets: OK. |
| e2e chromium: `loupe-header` (5), `loupe-head-caret` (2) | 7 passed |
| e2e phone: `loupe-header` (5) | 5 passed |

## Not established

- **A real iPhone.** Whether Safari fires `click` after a 56 px swipe is NOT ESTABLISHED; the 10 px guard answers it either way, and the phone e2e drives mouse events at 390 px with touch emulation, not a finger. Code did not test on a device.
- **The home indicator.** The bottom pin is 8 px above `innerHeight`; `env(safe-area-inset-bottom)` is not applied, so on an iPhone with a home bar the bar's lower edge may sit close to it. Not measured.
- **Print.** Covered by the existing `@media print { .loupe { display: none } }` and checked with print emulation in step 1; not opened in Chrome's print preview.
- **A reduced-motion phone** was used in the phone e2e (`reducedMotion: 'reduce'`); the panel's tween at the bottom with motion on was seen only in screenshots taken after it settled.
- The French drafts above are not rulings.

## Merge

Not asked: the answer is not yet. The branch is `mac-row164` at the commit that holds this report; it was never merged, pushed, or proposed as a pull request, and `docs/memory/`, `brief-*`, and `review-*` files are untouched.
