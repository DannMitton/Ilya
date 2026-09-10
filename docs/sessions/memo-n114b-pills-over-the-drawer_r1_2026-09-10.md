# Memo: N.114b item 1 corrected, item 3 built. r1, 2026-09-10

Branch `Shane`, against the brief as it stood after the item 1 correction and
item 3 were added. Nothing committed. Five files touched, none new, no new
string. All five gates at baseline and none moved: `216 (216)`, `235 (235)`,
`0 errors and 7 warnings in 4 files`, `1076 (1076)`, `547 | 5 skipped (552)`.
`ilya-ship.sh` needs no edit.

## Item 1 correction: why it overhung, and the fix

**The cause, read rather than guessed.** The anchor was `drawerWidth`, which is
the COLUMN. The card the singer sees is inset inside it by `.drawer-content`'s
own horizontal padding, 16 px a side, so the drawn band ends one gutter short of
the column and the pill's box stood 16 px past it. That 16 is not new: it is the
1rem `.root-panel` and the two drawer anchors each spent before N.108, ruled by
Dann 2026-08-20 as the one inset every drawer rule shares.

**The fix is one shared value, not a copy.** `--drawer-gutter: 16px` is a token
in `app.css` now. `Drawer.svelte` spends it as the padding that draws the gutter
and `HeaderBar.svelte` spends it to find the card's edge:
`right: calc(100% - var(--drawer-right) + var(--drawer-gutter))`. Move it and
the pills move with the card. The column's width is still `+page.svelte`'s
**`drawerWidth`** and nothing measures the DOM.

**The METADATA question, with the numbers.** At 1400 the card's drawn edge is
**504** and METADATA's right edge is **486**: the band sets its label on
`.group-band`'s `padding: 0 18px`, so the word is one band inset further in than
the card. I anchored to 504 and would keep it there. The pills are surfaces, not
type; 504 is a continuous vertical down the whole drawer, where 486 is one word
on one band, drawn only when Metadata's affordance is. A chip aligned to a word
reads 18 px short of the edge the eye follows. One value if you want the type
line instead.

## Item 3: the Clear of placements

"Start placement over" left its pill under Voice for the syllable line's own
open row, left of the count it resets, in the receipts' `.receipt-btn` style.
Same handler, same `station.startOver`, nothing coined; `.start-over` is deleted
with the pill. `IntakePanel` takes one new prop, `onstartover`.

**THE UNDO GAP, named rather than papered over.** `handleStartPlacementOver`
does NOT push, and I did not make it: no `loupe.undo.*` clause fits. The nearest,
`loupe.undo.restored`, reads "corrections cleared" and this clears PLACEMENTS,
which would be a lie in the pill. The clause needed says something like
"placements rebuilt" and coining it is yours. Two notes for when you rule it:
`snapshot()` already carries `pairings` and `pairingCursor`, everything the
handler changes, so the push is one line; but `orphanedCount`, which the handler
zeroes, is NOT in the snapshot and would not come back.

## The walk, production build on 4173, entry `app.4_vCidfm.js`

1. **1400 px, tangency.** Expected the Redo pill's right to equal the Piece
   band's to the pixel. **Observed both at 504.00**, against a column right edge
   of 520.00. Français right 1384, the header's own 16 px from the corner.
2. **The gap.** **810.96 px** at `drawerWidth` 520; driving `--drawer-right` to
   `calculateDrawerWidth`'s 720 ceiling put the group's right edge at 704.00 and
   left **610.96 px**, the minimum the layout can produce.
3. **390 px.** Unchanged from N.114a to the pixel: pills x 149 right 220 w 71 and
   x 228 right 297 w 69, Français x 305 right 374, header 48 tall, `scrollWidth`
   390, header and group both `static`. The four bands still carry 5.59 px.
4. **The verb.** Expected absent without a score, absent collapsed, present
   open. **Observed** exactly that: score cleared, no row and no verb; score with
   the line collapsed, row yes, verb no; open, it reads "Start placement over" at
   x 47, left of the count at x 410, wearing `receipt-btn` (12 px, 500,
   `rgb(120,113,108)`, no border, no fill, 44 px floor). The Voice pill is gone.
5. **Pressing it.** **1 / 12 became 12 / 12** with every syllable seated from the
   poem, `Ком- нат- ка тес-` leading. **Undo stayed disabled through it**, which
   is the gap above, observed rather than inferred.

## What I could not establish

- **No diff against a build of the N.114a tree.** I may not run git, so item 3's
  390 px comparison is against the figures recorded walking N.114a.
- **I did not see the app produce a 720 px drawer.** 610.96 px comes from driving
  `--drawer-right` to the ceiling `calculateDrawerWidth` sets in source.
- **`--drawer-gutter` is a token with no test.** `layout.ts`'s copied numbers are
  pinned by the arithmetic beside them; a lone token has no sum to pin, so a
  change to the drawer's inset is caught by a walk, not a gate.
- **A resize alone did not move the layout**; every figure was taken after a
  reload at the target size.
- **No real phone, no coarse pointer, no French walk, no walk with the wall up.**
- **I did not run the git command you pasted.** The brief and CONTRACT §5 both
  say I never run git; it is in my reply as a block to paste.
- **This memo is 85 lines, not under 70.** Cutting further drops a measurement.

`WRITTEN`, not `DONE`. Dann's walk on the alias makes it `DONE`.
