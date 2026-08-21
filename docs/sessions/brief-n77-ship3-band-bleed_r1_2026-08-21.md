# BRIEF FOR CODE. N.77 ship 3: the band's bleed must track the sheet's padding

**Found by Dann on his phone, on `e52b1c9`, 2026-08-21.** Every chapter band
runs off the left of the screen. `How Ilya Works` reads `ow Ilya Works`.
`Section 2 · Stress` reads `CTION 2` and `tress`.

Everything below was read in the tree at `e52b1c9` on 2026-08-21.

## The cause, established by reading

The bleed is a hard-coded `-96px`, and the padding it cancels is not always
96px.

- `ReadingPaper.svelte:34`: `.reading-paper { padding: 3rem 96px; }`
- `ReadingPaper.svelte:112`: `.chapter-band { margin: 3.5rem -96px 1.25rem -96px; }`
- `ReadingPaper.svelte:419-424`: under `@media (max-width: 767px)`,
  `.reading-paper { padding: 1.5rem 1rem; }`

On the phone the paper's horizontal padding is `1rem`, so the band overhangs by
`96px - 16px = 80px` on each side. Its own `padding-left: 30px` leaves the title
starting about 50px left of the sheet, which is off-screen.

**This is not a defect in ship 2.** The bleed shipped in ship 1, where the memo
recorded it as a reading of the mockup rather than a ruling, and recorded mobile
as NOT ESTABLISHED. Nobody hid it. Nobody asked either.

## The change

**Make the two numbers one number, so they cannot drift again.**

1. Declare a custom property on `.reading-paper` for its horizontal padding.
   Give it the current desk value.
2. Set `.reading-paper`'s `padding` from that property.
3. Set the band's left and right margins to the negative of that property.
4. **Redeclare the property, not the padding, in every media query that changes
   the sheet's horizontal padding.** I found the `max-width: 767px` block at
   `:419`. There is also an `@media print` block at `:450`. **Find every one of
   them and say how many you found.** After this change no rule anywhere should
   set `.reading-paper`'s horizontal padding to a literal, and no rule should
   set the band's horizontal margin to a literal.

**Do not change any value.** The desk keeps 96px, the phone keeps 1rem, print
keeps whatever it has. This ship changes where the number lives, not what it is.

**Say in a comment why the two are bound**, so the next person who changes one
changes both.

## Do not touch

- The band's vertical margins, its padding, its colours, and its type. All
  ruled and all walked on the desk.
- `page-config.ts` and `MARGINS.horizontal`. If the desk value should read from
  it, that is a separate question and not this ship.
- Ship 2's `scroll-margin` work, including the three band-offset rules at
  `:226`, `:230`, and `:256`. **If binding the padding changes any landing
  position, say so and change nothing.**

## Done when

Report the rendered result, not the source. Production build.

1. **The control, and it is the case Dann found.** At a 393px viewport, the
   Guide's `How Ilya Works` band shows its title whole, starting inside the
   sheet. Measure the band's left edge against the sheet's left edge and give
   both numbers.
2. The same at 360px, the narrowest case `STATE.md` records him using.
3. On the desk at 1400px, the band still meets the sheet edge exactly as it does
   today. **Measure it before and after and show that it did not move.**
4. Print is unchanged. Measure it the same way.
5. Learn and Guide, both languages, no band clipped at any of the three widths.
6. All five gates at baseline.

## What you owe back

A memo in the same commit, three sections:

- **What changed**, each with `path:line`, and the count of media queries you
  found that set the sheet's horizontal padding.
- **The six done-conditions**, each with what you observed, not what you
  expected. Give the measured edges, not a verdict.
- **What I could not establish.** `NOT ESTABLISHED` beats a complete invented
  answer.

Do not run `git`. Do not commit.
