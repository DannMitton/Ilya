# Brief: the loupe and the page draw one typeface

RULED BY DANN 2026-09-12, on his own screen: **the Cyrillic, and everything else
the score renderer leaves unnamed, is SANS in both the page and the loupe.** His
reason, in his words: "the page responds to legibility: at smaller sizes, sans
serif should be easier to read." He also ruled the renderer's own root flips,
"but please make sure we are not breaking vital dependencies in the process."

This amends the `STATE.md` entry of 2026-08-29 under RULINGS DANN OWES, which
described the cause as a container override. It is not. The mechanism is below.

Read `docs/memory/CONTRACT.md` before you start.

## 1. The mechanism, read 2026-09-12 by the desk

- The renderer declares the face on its own SVG root:
  `font-family="'Source Serif 4', Georgia, serif"` (`staff-renderer.ts:2827`).
- `paginateScore` strips that opening tag when it nests each system into a page:
  `.replace(/^<svg[^>]*>/, '')` (`page-layout.ts:376`). The page root (`:364`)
  and the system wrapper (`:374`) declare no font.
- So on the page the unnamed text inherits `body`, which is `var(--font-sans)`
  (`app.css:200-201`). **The page has always been sans, by accident.**
- The loupe clones the same inner markup and re-declares the serif on its own two
  wrappers (`Loupe.svelte:884`, `:897`), so it alone keeps the renderer's intent.

**Nine of the renderer's fourteen `<text>` elements name no font and therefore
inherit:** the Cyrillic (`:2697`), the `8` under an 8vb clef (`:1700`), key
signature glyphs (`:1719`), the tuplet numeral (`:1768`), the numerals at
`:2039`, accidentals at `:2137` and `:2223`, and the turning-layer accidental at
`:2430`. The five that name their own font are unaffected by anything here.

## 2. The dependency check, done before the ruling. Confirm it, do not trust it

Searched 2026-09-12, `node_modules` and build output excluded:

- The serif literal exists in exactly three live places: `staff-renderer.ts:2827`
  and `Loupe.svelte:884`, `:897`. Two other hits are not code: a copy of
  `Loupe.svelte` inside `docs/sessions/n127-design-pack/`, which is a record, and
  `routes/fit-font-lab/+page.svelte:104`, a dev route's own CSS that never
  touches the score SVG.
- **No test asserts the serif string.** The only two font assertions in
  `staff-renderer.test.ts` are the Lato IPA line (`:148`) and a `TestFont`
  injected through options (`:908`).
- **No snapshot tests exist in `packages/score-parser`.** No `toMatchSnapshot`,
  no `__snapshots__` directory.
- Consumers of `staff-renderer`: `page-layout.ts` (strips the root anyway),
  `demo-fixture.ts` (calls `renderAnalyzedStaff` and returns the string,
  `:155`, `:164`, `:186`), `index.ts` (public export), and the test file.

**NOT ESTABLISHED, and you check it:** whether anything outside this repository
consumes `@ilya/score-parser`'s standalone SVG and depends on serif metrics;
whether any print or export path uses the renderer's root rather than the DOM.

## 3. What to build

1. **`Loupe.svelte:884` and `:897`.** Drop the serif presentation attribute. Set
   the face from the token instead, `style="font-family: var(--font-sans)"`, so
   the loupe follows the page if that token ever moves. Do not type a second
   literal.
2. **`staff-renderer.ts:2827`.** Change the literal to the sans stack, so a
   standalone render out of the package agrees with the app. The package cannot
   read the app's CSS variable, so a literal is correct here and it must match
   `app.css:24`.
3. Nothing else. Do not touch `page-layout.ts:376`, which is what makes the page
   sans today and is load-bearing for the page's own geometry.

## 4. Definition of done

- At 1400 px, open the loupe on a note carrying a syllable. The Cyrillic in the
  loupe is the same face as the Cyrillic on the page behind it.
- The eight other inheriting marks match too. Check at least the tuplet numeral
  and one accidental, on a passage that has them.
- **State the expectation before you measure it:** several of these glyphs are
  placed with hand-tuned offsets such as `y + 4`, tuned against what the page
  draws, which is sans. The desk expects loupe positions to improve, not to
  shift. Report against that.
- Five gates at baseline.

## 5. The return memo

`docs/sessions/memo-loupe-typeface_r1_<date>.md`. Files changed with
`path:line`. What you walked and at which width. The gate table. The §2 items you
could not confirm.

**NOT ESTABLISHED beats a complete invented answer.**

---

## 6. SECOND ITEM, added 2026-09-12: restore the undo and redo marks

**Different file, same pass. Do both in one commit.**

RULED BY DANN 2026-09-12, on his own screen: the band's marks are wrong.
`Drawer.svelte:564` draws `↶` and `↷` (U+21B6, U+21B7), which came from the
increment 3 brief and are the desk's error, not his.

**Ilya's established marks are `↰` (U+21B0) and `↱` (U+21B1)**, in use since at
least 2026-08-26 and stated explicitly at
`docs/sessions/memo-n111-3b-loupe_r1_2026-09-07.md:165`: "The mark on the Redo
pill is `↱` (U+21B1), the mirror of the Undo pill's `↰`." They appear in the
mobile slice memos, N.111, N.113, and N.114b.

**Change:** `Drawer.svelte:564`, `'↶'` to `'↰'` and `'↷'` to `'↱'`. One line.
Nothing else. The `aria-hidden="true"` on that span stays, and the accessible
name is unaffected.

**NOT ESTABLISHED:** whether `↰ ↱` was ever a deliberate ruling of Dann's or
became the house mark by use. It is the mark on every surface he has walked,
which is the ground for restoring it.

**Done when:** the band reads `↰ UNDO` and `↱ REDO` at 1400 px and 390 px.
