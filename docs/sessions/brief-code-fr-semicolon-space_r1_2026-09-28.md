# Brief for Code: a narrow no-break space before every French semicolon, and the watch box's new heading

Written by the desk 2026-09-28 19:50. Runs after the N.173 gates have reported.

## The ruling

`docs/memory/PRODUCT.md`, "French spacing before the semicolon", ruled by Dann
2026-09-28 19:42: a narrow no-break space (U+202F) before every French semicolon.
The colon keeps U+00A0. Question and exclamation marks are NOT in this ruling; leave
them as they are.

## What the desk counted, in `i18n.ts` only, at `2535f88`

19 French semicolons: 14 with no space, 3 with U+00A0 (`insights.phonation.noTempo`,
`.untrustedOne`, `.untrustedMany`), 2 already U+202F (`insights.finding.passaggio`,
`comment.working.frame.sustainedTop`).

## The work

1. **Enumerate before you count** (`docs/memory/ENVIRONMENT.md`, "TYPOGRAPHY IN THIS
   TREE"): a space before « ; » can be written as nothing, a plain space, ` `,
   ` `, a literal U+00A0 or U+202F, `&nbsp;`, `&#160;`, or `&#8239;`.
2. Find every French semicolon a singer can see: `i18n.ts`, and any French prose in
   Svelte files (`LearnContent.svelte`, `Drawer.svelte`'s table of contents, the
   Guide). Leave semicolons in code, CSS, HTML entities, and English alone.
3. Set each to U+202F: ` ` in TypeScript literals, `&#8239;` in Svelte markup.
4. Add a test that fails if any French value in `i18n.ts` has a semicolon without
   U+202F before it.

## Also in this pass: the watch box's heading

Ruled by Dann 2026-09-28: English *"For your consideration"* (19:47, replacing "Places
to watch"); French « À considérer » (19:48, option 2 of the desk's three; « Pour votre
considération » was set aside as a calque). Who offered it: the English is Dann's, the
French is the desk's proposal, ruled by Dann.

- `watch.header` (`i18n.ts:1717` at `2535f88`): `{ en: 'For your consideration', fr: 'À considérer' }`.
- Update `watchlist.test.ts:265` and `:557`, which assert the old text.
- Comments that name the box "Places to watch" (`watchlist.ts:2`, `notes-pages.ts:4`,
  `MarkupPane.svelte:715`, `NotesColumn.svelte:4` and `:121`, `i18n.ts:1710`): rename to
  "For your consideration" so a grep finds one name.
- Screenshot the box heading in both languages.

## Also: the `watch.lead.*` comment

`i18n.ts`, the comment above `watch.lead.one` says "French DRAFTED BY CODE ... for Dann". Dann ratified both 2026-09-28 20:44 (`PRODUCT.md`, "The folded watch line's lead"). Change the comment to say so.

## Also: fR1 and fR2 in Learn's English

Titze et al. 2015 (Table I, p. 3006, read by the desk 2026-09-28; Dann ruled 2026-09-16 that Ilya uses this notation): an italic *f* with an upright subscript. Learn's French already sets it so (`LearnContent.svelte:1348-1349`, `<em>f</em><sub>R2</sub>`), but Learn's English prints plain "fR2" and "fR1" (`LearnContent.svelte:3385-3386` at `e8c4732`). Set every fR*n* and fo in Learn and the Guide, in both languages, as `<em>f</em><sub>R1</sub>` / `<em>f</em><sub>o</sub>`. Report any occurrence in `i18n.ts` (plain strings cannot carry markup; list them, do not change them).

## Also: the intake's acoustics question, ruled 2026-09-29 00:06 and 00:07

`voiceIntake.acoustics.stem` (`i18n.ts:1693` at `e8c4732`). English, Dann 00:06 (desk's wording on his correction to Titze et al. 2015's symbols): "How comfortable are you with voice acoustics terms such as fundamental (fo), harmonic (nfo), resonance (fR1), and formant (F1)?" French, desk's draft, ratified 00:07: « Dans quelle mesure êtes-vous à l\u2019aise avec des termes comme fondamentale (fo), harmonique (nfo), résonance (fR1) et formant (F1)\u202f? » Plain text, so no subscripts (the fallback in `notation-reference_Titze-2015.md`).

## Gates

All eight at baseline or better; report the new count. `check` 0 errors; ratchets OK.
One screenshot of the watch band in French showing « passaggio ; ».

## The report

`docs/sessions/report-code-fr-semicolon-space_r1_<date>.md`: every file and count
changed, before and after, and **What I could not establish**. NOT ESTABLISHED beats a
complete invented answer. Do not commit, stage, stash, check out, or restore. Dann ships.
