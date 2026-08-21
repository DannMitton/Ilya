# BRIEF FOR CODE. N.77 ship 2: the anchored heading lands behind the chrome

**Found by Dann on his walk of `2b85d13`, 2026-08-21.** He clicked
`Why only one source?` in the Guide's table of contents. The page scrolled, the
hash became `#guide-source`, and the heading it names was not on screen. The
paragraph under it was the first thing visible.

**This is not a defect in tonight's bands.** No band sits near that heading, and
the cause predates them.

Everything below was read in the tree at `2b85d13` on 2026-08-21.

## The cause

`scrollToAnchor` (`+page.svelte:1676-1679`) calls
`scrollIntoView({ behavior, block: 'start' })`, which aligns the target's top
edge with the top of its scroll container. The container runs up underneath the
app bar and the tab row, so the target lands behind them.

**`scroll-margin-top` appears nowhere in the tree.** I grepped for it.

The anchors themselves are correct and need no change. `guide-source` is on the
heading (`GuideContent.svelte:304`), not on the paragraph.

## The change

Give every scroll target in the reading paper a `scroll-margin-top` equal to the
height of the sticky chrome above the scroll port, plus a visible gap.

**Measure the chrome. Do not guess it and do not copy a number from this brief,
because there isn't one.** Read the rendered height of whatever sits above the
scroll port on the built page, state the number in your memo, and derive the
margin from it.

**Which elements.** Table-of-contents targets are not all headings. In Learn,
some are paragraphs: `learn-u3-inventory` is a `<p id=…>` and a table-of-contents
entry (`Drawer.svelte:407`). So the rule must cover headings and id-carrying
paragraphs alike. One rule in the reading paper's scoped CSS reaching
`h1, h2, h3, h4, p[id]` is enough. **Establish that this covers every target
before you write it**, and report any target it misses.

**Where the rule lives.** The reading paper's own stylesheet, beside the band
you added in ship 1. Do not add a second copy in `LearnContent.svelte` or
`GuideContent.svelte`; three drifted copies of one recipe is the defect
`StationHeader` was built to end.

## Do not touch

- **The anchors.** No id moves, no id is renamed, no heading changes tag.
- **`scrollToAnchor` itself**, and the two-shot settle it does at
  `+page.svelte:1669-1680`. The margin is a CSS fix; leave the script alone.
- **The IntersectionObserver's `rootMargin`** at `+page.svelte:1752`. It governs
  which entry highlights, not where the page lands. Your ship 1 memo reported
  one new highlight miss on `learn-arc` and ten pre-existing ones. **That is a
  separate problem and it is not in this brief.** If this change moves those
  counts, say so and change nothing.
- **The bands.** Untouched.

## Done when

Report the rendered result, not the source. Production build.

1. Click every entry in the Guide's table of contents, both languages. Each one
   lands with its target's top edge **visible, below the chrome**, not behind
   it. Name what you clicked.
2. The same for Learn's table of contents, both languages, including the
   paragraph targets such as `learn-u3-inventory`.
3. **The control, and it is the case Dann found.** `Why only one source?` in
   English shows the heading `Why does Ilya follow only one source?` at the top
   of the reading area, with the paragraph below it. Say what you saw.
4. A chapter's own entry still lands on its band, not past it. The band is the
   arrival moment, so it must be what arrives.
5. Loading the page with a hash in the URL lands the same way, since
   `+page.svelte:1767` uses the same function.
6. All five gates at baseline.

## What you owe back

A memo in the same commit, three sections:

- **What changed**, each with `path:line`, including the measured chrome height
  and the margin you derived from it.
- **The six done-conditions**, each with what you observed, not what you
  expected.
- **What I could not establish.** `NOT ESTABLISHED` beats a complete invented
  answer. Name every target the rule does not reach.

Do not run `git`. Do not commit.
