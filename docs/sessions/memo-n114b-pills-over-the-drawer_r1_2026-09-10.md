# Memo: N.114b, pills over the drawer, air under every band. r1, 2026-09-10

Branch `Shane`, against the brief re-read after it gained item 2 mid-session.
Nothing committed. Three files modified, none new, no new string. All five gates
at baseline and none moved: `216 (216)`, `235 (235)`, `0 errors and 7 warnings in
4 files`, `1076 (1076)`, `547 | 5 skipped (552)`. `ilya-ship.sh` needs no edit.

## What moved

**The width is `+page.svelte`'s `drawerWidth`**, the value it already hands
`Drawer` as `width`, passed to `HeaderBar` and spent as one custom property,
`--drawer-right`. Nothing measures the DOM, and the pair follows the Inspector.
The anchor is one declaration inside `@media (min-width: 1400px)`:
`.head-right { position: absolute; left: 0; right: calc(100% -
var(--drawer-right)); justify-content: flex-end }`. An absolutely positioned
child is offset from its containing block's padding box and this header has no
border, so `100%` is the viewport and the group's right edge lands on the
drawer's. `1400px` is `layout.ts`'s `DESK_LAYOUT_MIN_WIDTH`, a literal the way
every other layout query in the tree carries `1399px`.

**The language pill left `.head-right`** and is the header's own last child
again, as before N.114a: the group moves to the drawer's edge and the pill keeps
the far corner, and two places cannot be one element's children. `.head-right`
takes `margin-left: auto` so the phone packing is unchanged, the pill carries the
8px the group's `gap` gave it, and the group takes `pointer-events: none` (the
pills take their own back) because its box now spans the sigil.

**Air under every band** is one rule in `Drawer.svelte`, beside the
`border-top: none` rule already there: `.group-band + :global(.station),
.group-band + .band-body { margin-top: 0.35rem }`. Two selectors because what
stands first in a group is not fixed. The value is `MetadataFields`' own `gap`.
**Kept on all four bands**: Text and Score markup read right with it.

## The walk, production build on 4173, entry `app.C7iuRmRX.js`

1. **1400 px.** Expected the pills' right edge on the drawer's, Français at the
   corner. **Observed** drawer right 520.00, `.head-right` right **520.00**,
   Français right 1384 against a 1400 viewport, the header's own 16px padding.
2. **The gap.** Expected it to hold at the narrowest desk. **Observed 794.96 px**
   at `drawerWidth` 520; driving `--drawer-right` to `calculateDrawerWidth`'s 720
   ceiling put the group's right edge at 720.00 and left **594.96 px**, the
   minimum the layout can produce.
3. **390 px.** Expected byte-identical to N.114a. **The rendering is identical
   and the DOM is not.** Every position matches the N.114a walk to the pixel:
   pills x 149 right 220 w 71 and x 228 right 297 w 69, Français x 305 right 374
   w 69 h 21, header 48 tall, `scrollWidth` 390, `.head-right` and `.header-bar`
   both `static`. Three DOM differences: `button.lang-pill` is the header's child
   not `div.head-right`'s, the header carries `style="--drawer-right: 520px"`,
   and the scope hash moved with the stylesheet.
4. **The bands.** Expected 0.35rem under each. **Observed 5.59 px** under all four
   at 1400 and all four at 390, Metadata's four field gaps unchanged at 5.59 px.

## What I could not establish

- **No diff against a build of the N.114a tree.** I may not run git, so item 3
  compares against the figures recorded walking N.114a on this viewport.
- **I did not see the app produce a 720 px drawer.** 594.96 px comes from driving
  `--drawer-right` to the ceiling `calculateDrawerWidth` sets in source.
- **A resize alone did not move the layout**: the drawer kept its phone width at
  1400 until I reloaded, which looks like the pane's viewport override not firing
  `resize`. Every figure above was taken after a reload at the target size.
- **The first Metadata reading was 1.59 px**, settling at 5.59 px 1.5 s later
  inside the opening transition. Nothing else was measured mid-transition.
- **No real phone, no coarse pointer, no French walk, no walk with the wall up.**
- **This memo is 68 lines, not under 40.** Cutting further would drop a
  measurement or a caveat.

`WRITTEN`, not `DONE`. Dann's walk on the alias makes it `DONE`.
