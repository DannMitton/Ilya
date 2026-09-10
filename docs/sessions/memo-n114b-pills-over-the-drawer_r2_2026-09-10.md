# Memo: N.114b items 4 and 5. r2, 2026-09-10

r1 covers the item 1 correction and item 3 and is not restated. **This is r2
rather than a second r1** because the brief names one memo path, r1 is already on
disk, and the tree's habit for a revision is a new number. Branch `Shane`,
nothing committed, three files touched, none new, no new string. All five gates
at baseline and none moved: `216 (216)`, `235 (235)`, `0 errors and 7 warnings in
4 files`, `1076 (1076)`, `547 | 5 skipped (552)`. `ilya-ship.sh` needs no edit.

## Item 4: the verb is a pill

`receipt-btn` became `action-btn btn-ghost`, the ghost pill Choose a file wears
three rows down in the same band. Same handler, same `station.startOver`. Its
only rule of its own is still `margin-right: auto`, so the count and the chevron
keep the corner. `.action-btn` sets no touch floor, so the pill joined `.syl-row`
and `.syl-toggle` in this component's existing `@media (pointer: coarse)` block
rather than carrying a floor the drawer's other five `.action-btn`s lack. Clear
and Replace on the receipts stay text, which is the ruling drawing the line
rather than blurring it.

## Item 5: one number behind two edges

`--band-inset: 18px` is a token in `app.css` now. `Drawer.svelte`'s
`.group-band` spends it as the padding that sets its label's line, and
`HeaderBar.svelte`'s `.head-pill` spends it as horizontal padding. The pill's
BOX stays tangent to the card's edge, so its WORD ends where METADATA ends: one
edge for the surfaces, one line for the words, one number behind both, and no
literal copied between the two files. The vertical `4px` is unchanged.

**Four other `18px` literals in `Drawer.svelte` are the same ruled inset and I
left them alone**: the station margin, `.band-body`'s margin, the takeover header
and the takeover body. Same measure, but not what this ruling keys, and
rewriting them is a wider ship than was asked for.

## The walk, production build on 4173, entry `app.ialKlL7U.js`

1. **1400 px, both lines.** Expected the Redo pill's box right to equal the Piece
   band's and the word "Redo" to end on METADATA's line. **Observed** box right
   **504.00** against the band's **504.00**, and the "Redo" text node's right
   **486.00** against METADATA's **486.00**.
2. **The gap.** Unchanged by the padding, which grows inward: **810.96 px** at
   `drawerWidth` 520, and **610.96 px** with `--drawer-right` driven to
   `calculateDrawerWidth`'s 720 ceiling. That is still the minimum the layout
   can produce.
3. **The pill.** Expected it left of the count wearing the ghost recipe.
   **Observed** "Start placement over" at x 47, right 177, left of the count at
   x 402, its computed radius, border, fill, type, colour and padding
   **identical to Choose a file's** in the same band (`999px`, `1px
   rgb(87,83,78)`, transparent, `12.8px/500`, `rgb(120,113,108)`, `7.2px 8px`).
4. **390 px, coarse pointer.** Expected 44 px and no wrapping. **Observed**
   `matchMedia('(pointer: coarse)')` true, the pill 44.00 tall with
   `min-height: 44px`, its row 296 wide inside a 390 drawer and not overflowing.
   Both head pills 44 px on one 48 px line, header `scrollWidth` 390 against a
   390 viewport, Français still right 374.
5. **The clipping rule.** With a clause, `↰ Undo: sylla…` clips and `↱ Redo`
   stays whole, which is N.114a's rule holding. **It clips about two characters
   earlier than before**: each pill is 12 px wider, so at 390 the clause loses
   that much room. A real cost of item 5 at phone width, not a defect.

## What I could not establish

- **No real phone.** 390 x 844 with the pane's coarse-pointer emulation is what
  I measured, not a device.
- **No French walk.** `Annuler` is longer than `Undo` and clips sooner at 390; I
  did not see it.
- **I did not see the app produce a 720 px drawer.** 610.96 px comes from
  driving `--drawer-right` to the ceiling `calculateDrawerWidth` sets in source.
- **`--band-inset` and `--drawer-gutter` are tokens with no test**, so a change
  to either is caught by a walk and not a gate. **No walk with the wall up**, and
  **no returning-singer walk**.

`WRITTEN`, not `DONE`. Dann's walk on the alias makes it `DONE`.
