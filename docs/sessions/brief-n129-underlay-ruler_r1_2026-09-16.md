# Brief: N.129, the underlay is spaced with the wrong font's widths

Revision 1, 2026-09-16. Written at the desk. Build in Claude Code, AFTER N.142
and the loupe French build.

**Item:** N.129. Spec: `docs/memory/STATE.md`, the paragraph headed "N.129, THE
UNDERLAY IS SPACED IN THE WRONG FONT'S METRICS", and the block under it headed
"FOLDED IN 2026-09-14 ON DANN'S WORD". **Read both in full.** Also read
`docs/memory/PRODUCT.md` §"What Ilya produces", the paragraph "AMENDED
2026-09-14 BY DANN", for his ruling that layout and spacing are editorial.

---

## The goal, in the singer's words

Dann, 2026-09-14, after reading `не прог ляд – на я,` on the page and counting
three hyphens missing from one word: *"I don't want Ilya dropping hyphens.
Instead, I want the note spacing to shift to permit the appearance of hyphens
properly."*

A singer reads every hyphen a word has, and syllables never crowd each other,
because the spacing is measured with the face the page actually draws.

---

## What the desk read, 2026-09-16, after `7abb5ae`

- `packages/score-parser/src/underlay-widths.ts:690` declares its Cyrillic table
  as "Per-1000-em advance widths for **Source Serif 4** Cyrillic (measured at
  12.5px)". Its header (`:30-45`) describes measuring Source Serif 4 at
  `opsz=12.5, wght=400`.
- The page draws the Cyrillic underlay in **Source Sans 3**. The renderer's SVG
  root declares it (`staff-renderer.ts:3424`), since `246c17c`. The spec's
  earlier cause, the paginator stripping a serif root at `page-layout.ts:376`,
  is out of date: that line no longer holds it.
- The table feeds the column advance (`staff-renderer.ts:1063`,
  `CYR_FONT_PX = 12.5` at `:132`) and the hyphen and extender endpoints
  (`:3343`).
- **The hyphen omission:** `staff-renderer.ts:3359-3361`,
  `from = rightEdgeOf(a) + 2`, `to = leftEdgeOf(b) - 2`,
  `if (to <= from) continue`. `clampHyphenX` (`:1193`) already handles a gap
  narrower than the hyphen and is never reached in that case.
- `INK_CLEAR_SP = 0.5` (`staff-renderer.ts:1214`) is the one floor between
  columns, and it knows nothing about hyphens.
- Code measured about 5% on one word in the loupe-typeface memo: « ночь »
  27.72 px in the serif against 26.34 px in the sans.

---

## Build in this order

**STEP 1. THE RULER. Change the table, and nothing that uses it.**

1. Remeasure the Cyrillic table from **Source Sans 3, Regular 400, upright, at
   12.5 px**, from the same Google Fonts file `apps/web/src/app.html:17`
   loads. Use the method the file's header records (fonttools), and rewrite
   the header so it describes what was measured. If the font file is a
   variable font, pin every axis and say which values you pinned.
2. **Make the face one constant.** Export the Cyrillic underlay face name from
   one place, and use it both in the renderer's SVG root at `:3424` and in the
   table's declaration, so the two cannot drift apart again. Add a test that
   fails if they differ. **DESK DEFAULT:** this is the cheap form of "make the
   face a parameter"; do not build a multi-face table.
3. **State your expectation before measuring:** Cyrillic advances shrink by
   about 5%, so systems hold slightly more and some pages reflow. Name your
   likeliest failure mode.
4. Run the gates. **Report every test whose expected number moved and why.** Do
   not edit an expected value without saying why the new one is right.

**STEP 2. HYPHENS ARE NEVER OMITTED. Ruled by Dann 2026-09-14.**

1. Remove the silent omission at `:3361`. Every join between two syllables of
   one word draws at least one hyphen.
2. **Give a gap inside a word a larger floor than a gap between words**, sized
   to hold the hyphen plus its clearance, so the spacer widens the column
   rather than the hyphen overhanging. The shape is DESK INFERENCE from the
   spec, item 5, and Dann can wave it off. Say what value you chose and why.
3. `clampHyphenX`'s overhang case should now be unreachable in practice. Keep
   it as a guard, and say in its comment that Dann ruled against omission.

**Named cost, and it is accepted:** wider word-internal gaps mean fewer measures
per system and different pagination on every page. Dann's ruling of 2026-09-14
makes spacing editorial, with justification as the standard.

---

## What NOT to do

- **Do not shrink the stave to fit more systems** (CONTRACT §6).
- Do not change the IPA table or the Lato IPA face.
- Do not touch the loupe's own drawing beyond what the shared renderer gives it.
- Do not change `VocalLineEvent`.

---

## Definition of done

1. The Cyrillic table is measured from Source Sans 3, and a test ties it to the
   face the renderer declares.
2. No hyphen is omitted anywhere, on any fixture.
3. On the word Dann read on the N.118 walk, `не прог ляд – на я,`, every hyphen
   draws. Say which song it is in; if you cannot find it, say so.
4. All five gates green, with any baseline movement named. Read the baselines
   from `docs/memory/ENVIRONMENT.md` §`Gate baselines` when you start.
5. Walked in a browser by Dann, and in print. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-n129-underlay-ruler_r1_<date>.md`:

1. What you changed, by file and line.
2. The pinned axes and the file you measured from.
3. Your expectation before each measurement, and the measurement: at least
   « ночь » in both faces, and the change in systems per page on T05 and on
   the engraved Without Sun song 1.
4. The gate results, with any baseline movement named.
5. **A section listing what you could not establish.** NOT ESTABLISHED beats a
   complete invented answer.
6. Any decision this brief did not settle, marked as yours and reversible.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.** To
measure a before state, copy the file aside and copy it back. If you create a
new file, name it in the memo so Dann can `git add` it before he ships.
