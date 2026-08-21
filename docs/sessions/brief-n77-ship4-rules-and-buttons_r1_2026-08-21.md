# BRIEF FOR CODE. N.77 ship 4: the drawer's rules, then the button sizes

Two parts. **Part A is a live regression on a walked build and comes first.**
Part B is polish. They share files, so they ship together, but keep them
separate in your memo.

Everything below was read in the tree at `a1b5774` on 2026-08-21.

---

# PART A. The drawer's station rules lost their regularity

**Found by Dann on his phone, on `a1b5774`.** With every station shut he sees:

- **a thicker sage rule above `REPERTOIRE`** than above its siblings, and
- **no rule at all between `REPERTOIRE` and `SOURCE`**, so the two read as one
  block.

N.65 ship B's whole achievement was six headers on one rhythm, walked by Dann on
`2b81f5a`. This undoes part of it.

## The cause, as far as reading establishes it

The Repertoire move of `a1b5774` changed which station sits where, and one
exemption stayed behind.

**ESTABLISHED.** `RootPanel.svelte:971-973` declares
`.source-section { border-top: none; }`. Its comment at `:965-969` gives the
reason in its own words: *"Source is first in the scroll and draws NO rule of
its own. The top anchor's own boundary is already directly above it."* **Source
is not first any more.** It now sits between Repertoire and Analysis, where
every sibling draws the standard `border-top: 2px solid var(--sage)` from
`.section` at `:918`. That is the missing rule.

**NOT ESTABLISHED, and you must measure it rather than take my word.** I have no
second source for the doubled rule above `REPERTOIRE`. My reading is that
Repertoire now occupies the position whose boundary was already drawn by
something above it, so two 2px sage rules land within a few pixels and read as
one thick one. `SongList.svelte` and `StationHeader.svelte` declare no
`border-top` or `border-bottom` at all, so whatever draws the second mark is
somewhere I did not find. **Find it and name it with a `path:line` before you
change anything.**

## The change

**Restore the rhythm. Do not invent a value.** Every station rule is
`2px solid var(--sage)`; the only question is which boundaries carry one.

1. Give `.source-section` the standard rule back, by deleting its exemption
   rather than by adding a new declaration.
2. Remove whichever mark is doubling above `REPERTOIRE`, once you have found
   what draws it.
3. **Rewrite the comment at `:965-969` rather than deleting it.** It records
   real reasoning about a double line Dann kept asking about. Say what changed
   and why the exemption moved or went.
4. The same reasoning applies to `:958-961`, which lists by name which stations
   draw a rule. That list is now wrong. Correct it.

**The principle, and it is Dann's, from his walk of `2b81f5a`: one mark, one
weight, at every station boundary.** A boundary either carries a 2px sage rule
or it does not, and no boundary carries two.

## Part A is done when

Report the rendered result, not the source. Production build, phone width.

1. With every station shut, **measure the rendered height of the rule above each
   of the six headers** and give the six numbers. They are equal, or you say
   which is not and why.
2. There is a rule between `REPERTOIRE` and `SOURCE`.
3. The rule above `REPERTOIRE` is the same weight as the one above `NOTATION`.
4. `SHIFT LYRICS` keeps its lavender rule. That is a ruled exception, not a
   defect.
5. **The control.** Measure the same six on `2b81f5a`, which Dann walked and
   accepted, and show that this build matches it apart from the deliberate order
   change. If you cannot build that commit, say so and measure `2b85d13`.
6. Both languages, desk and phone.

---

# PART B. Button sizes

Dann's instruction, 2026-08-21: one size for the quiet buttons, and the two
standout actions paired.

## The model, and what already matches it

**The size model is `Clear text`**, `.action-btn.btn-ghost`
(`RootPanel.svelte:867-876` and `:878-881`): `padding: 0.45rem 0.5rem`,
`var(--font-sans)`, `font-size: 0.8rem`, `font-weight: 500`,
`border-radius: 4px`, `border: none`.

**Already identical in recipe, so verify rather than change:**

- `Export` and `Import` (`RootPanel.svelte:397-398`) are the same class. They
  render at a different width only because `.output-row` is `repeat(3, 1fr)`
  (`:862-866`) and `.source-actions` is `1fr 2fr` (`:853-857`). **Confirm the
  recipe matches and report both rendered widths. Do not change either grid.**
- `New song`, `.new-btn` (`SongList.svelte:297-308`) already carries the same
  padding, family, size, and weight. **It differs by exactly one declaration:
  `border: 1px solid var(--stone-600)` where the model has `border: none`.**
  That border adds 2px to its rendered height.

## What changes

1. **`New song`.** Bring its rendered box to the model's. Report `Clear text`'s
   and `New song`'s rendered height and width before and after. **The border is
   a look, not a size: if removing it is the only way to match the height, say
   so and stop, because that is Dann's ruling and not yours.** Prefer
   `box-sizing` or padding arithmetic that keeps the border and matches the
   height.
2. **`Print`, `.sheet-print`'s button in `+page.svelte`.** Give it the model's
   size recipe. **Dann's ruling of 2026-08-21 governs its POSITION and its
   IDIOM, not its size**: it stays flush left under the sheet and it still
   parallels Transcribe. Do not move it, do not restyle its colour, do not
   touch `.sheet-print`'s own layout rules at `+page.svelte:2773-2784`.
3. **`Calibrate`, `.voice-action` in `VoiceAnchor.svelte:55`.** Dann's
   instruction: *"Transcribe button is the model width, Calibrate should match
   its width."* **Do it by construction, not by a number.** `.voice-line`
   (`VoiceAnchor.svelte:59-62`) is a flex row holding the status sentence and
   the button. Make it a `1fr 2fr` grid, **the same declaration
   `.source-actions` already uses**, so the status takes the first column and
   `Calibrate` takes the second. Then `Calibrate` is Transcribe's width because
   both are the `2fr` of the same drawer, and no value is invented.
   - **The risk, and you must report it:** the status sentence
     `Voice: not yet calibrated` and its French now live in a narrower column.
     Measure whether either wraps at 360px and say what you saw. **Do not
     shorten a string.** The French is Dann's and the desk does not write it.

## Do not touch

- Any i18n string, in either language.
- `.source-actions`'s and `.output-row`'s grids.
- Print's position, colour, or its `@media` rules.
- The bands and ship 3's `--sheet-pad-x`.

## Part B is done when

1. `Clear text`, `New song`, `Export`, `Import`, and `Print` render at the same
   height. **Give the five measured heights.**
2. `Calibrate` and `Transcribe` render at the same width. **Give both numbers at
   360px and at desk width.**
3. The voice status sentence is reported at 360px in both languages: wrapped or
   not, and how many lines.
4. All five gates at baseline.

---

## What you owe back

A memo in the same commit. **Keep Part A and Part B in separate sections.**

- **What changed**, each with `path:line`.
- **Part A's six conditions and Part B's four**, each with what you observed,
  not what you expected. Give measured numbers, not verdicts.
- **What I could not establish.** `NOT ESTABLISHED` beats a complete invented
  answer. In particular, name whatever was drawing the second mark above
  `REPERTOIRE`, or say plainly that you could not find it.

Do not run `git`. Do not commit.
