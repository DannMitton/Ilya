# BRIEF FOR CODE. Drop the `inferred` row from the transcription legend

**Ruled by Dann, 2026-08-21.** The dashed box and the small-caps `verify` label
are self-explanatory. `verify` is an instruction to the singer, not a sigil, so
it carries no legend entry. This is the same shape as his clitic-arrow ruling of
the same day, which `provenance.ts` already records in a comment.

**What is wrong today.** `provenance.ts` maps `inferred` to a `question` icon and
`PageFooter.svelte` draws a traced question mark for it, but `WordStack.svelte`
excludes `inferred` from its icon span twice, on purpose, and prints the word
`verify` instead. The legend therefore decodes a glyph that is nowhere on the
sheet.

Everything below was read in the tree at `52eda23` on 2026-08-21.

## The change

**`apps/web/src/lib/provenance.ts`**

1. Remove `'inferred'` from `LEGEND_ORDER`. It is the last member, so
   `LEGEND_DISPLAY_ORDER` no longer needs its `flatMap`. Replace the derivation
   with `[...LEGEND_ORDER, SPOT_RECONSTITUTION]`.
2. Keep spot reconstitution in the relative position it holds today, which is
   after `user-override`. With `inferred` gone, that position is last. Update
   the comment above `LEGEND_DISPLAY_ORDER` so its reasoning matches the new
   code rather than describing an ordering against an entry that no longer
   exists.
3. Remove the `'inferred'` entry from `PROVENANCE_ICONS`.
4. Remove the `'inferred'` entry from `LEGEND_KEYS`.

**`apps/web/src/lib/components/Paper/PageFooter.svelte`**

5. Remove the `{:else if item.type === 'inferred'}` branch and the traced
   question-mark SVG inside it.

## Do not touch

- **`WordStack.svelte`.** The dashed box, the `verify` label, and the twin
  `!isInferred` exclusions all stay exactly as they are. Nothing about what
  prints on the word changes.
- **`pipeline.ts`.** `stressSource = 'inferred'` stays. The state is correct.
  Only the legend row goes.
- **`i18n.ts`.** Leave `legend.inferred` in place. It becomes unused. Removing
  approved copy is Dann's ruling, not Code's.
- **`showProvenance()`**, the exported function in `provenance.ts`. It has no
  importers outside its own file; `WordStack.svelte` has a local `$derived` of
  the same name. Leave it alone. Do not tidy it in this change.
- **The Fit legend**, `lib/shane/fit-legend.ts`, and the `textOnly` flag.

## Done when

Report the rendered result, not the source. Use a print preview or a printed
sheet from a local production build.

1. A page carrying at least one `verify` word prints **no** question-mark row
   and **no** `Verify stress` row in its footer legend.
2. A page carrying a `verify` word **and** a `user-dictionary` word still prints
   the `user-dictionary` row, unchanged and in its existing position.
3. **The control, and it is the likeliest failure.** A page whose only special
   provenance is `inferred` must print **no legend block at all**, because
   `seen` is then empty and `buildProvenanceLegend` returns `[]`. Confirm that
   is what happens, rather than an empty legend region leaving a stray hairline
   or a gap above the attribution rule. State what you observed.
4. All five gates at baseline.

## What you owe back

A short memo, in the same commit. Three sections:

- **What changed**, each with `path:line`.
- **The four done-conditions**, each with what you observed, not what you
  expected.
- **What I could not establish.** `NOT ESTABLISHED` beats a complete invented
  answer.

Do not run `git`. Do not commit.
