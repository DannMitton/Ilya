# Brief: the colour census, use by use

**WIDENED 2026-09-13 at Dann's word, from the neutrals to every colour.** He
asked to "make sure we aren't using six lavenders instead of five" and to
resolve the ghost references in the same pass. The neutral questions below are
unchanged; sections 1 and 3 now cover the whole palette.

**A READ-ONLY AUDIT. Change nothing. Write no code.** The output is a table
Dann can rule on, case by case.

Asked for by Dann 2026-09-13: *"I see a bunch of dark neutrals that make me
wonder if we can consolidate or eliminate one? Likewise with the cream neutrals.
I love the warmth, but I want to know why we have a few that are so close in
appearance? Can we examine where they are used and make better choices? If the
uses are justified, I want to examine them case by case."*

**Counts do not answer this. What each one COLOURS answers it.**

## 1a. The neutrals: eleven tokens, and two literals

Read out of `apps/web/src/app.css` by the desk, 2026-09-13.

**Inks, warm:** `--ink-primary` `#1A1612` (85 uses), `--ink-secondary` `#4A4540`
(100), `--ink-tertiary` `#6A655F` (73).

**Stone, cool:** `--stone-300` `#D6D3D1` (38), `--stone-500` `#78716C` (15),
`--stone-700` `#44403C` (9).

**Surfaces:** `--drawer-bg` `#FAF8F5` (17), `--paper-light` `#F5F1E8` (12),
`--paper-cream` `#F0EBE0` (30), `--desk-surface` `#D8D4C8` (10).

**Two literals with no token:** `#3A352F` (9 uses, the renderer's glyph fill)
and `#57534E` (7 uses, always written as `var(--stone-600, #57534e)` where
**`--stone-600` is never declared**, so every one falls through to the hex).

## 1b. Everything else in the palette

Same treatment, same table. **Every colour token declared in `app.css`**, and
**every hex literal written inline in a component or in the renderer**, whether
or not a token exists for it.

Three specific questions to answer with the rows:

1. **How many lavenders are there really?** `--deeper-lavender`,
   `--muted-lavender`, `--light-lavender`, `--surround-marked`,
   `--surround-shane`, `--lang-chip-marked`, plus any inline `#8E7E9B` and
   friends. Say how many DISTINCT VALUES exist and what each one is for.
   Do the same for sage.
2. **Which tokens are ghosts?** `--stone-600` is written seven times and never
   declared. **Find every other token referenced but never declared**, and every
   token declared but never referenced.
3. **Which inline literals duplicate a token?** `#8E7E9B` appears 29 times
   inline while `--deeper-lavender` holds the same value. For each literal, say
   whether a token already carries it.

## 2. What to produce

**One row per USE SITE, not per token.** For every occurrence:

| column | what goes in it |
|---|---|
| token | the token or literal |
| path:line | exact |
| what it colours | in plain words: "the drawer station header's bottom border", not "a border" |
| property | `color`, `background`, `border`, `fill`, `stroke`, `box-shadow` |
| what it sits on | the surface behind it, where you can tell |
| swappable to | the nearest other neutral in this list, and the OKLCH lightness gap to it |

Group the rows by token. Put the table in the memo.

## 3. The three questions the table must answer

1. **Is the warm/cool split doing work?** `--stone-700` `#44403C` and
   `--ink-secondary` `#4A4540` are nearly the same lightness, one cool and one
   warm. **Find every place the two appear near each other** and say whether the
   difference is visible or accidental.
2. **Are the four surfaces four things?** `--drawer-bg` `#FAF8F5`,
   `--paper-light` `#F5F1E8` and `--paper-cream` `#F0EBE0` are close.
   Say what each one is FOR, from its use sites, and whether any two are used
   for the same job in different files.
3. **What would break if a token went?** For each of the eleven, name the one
   use that would be hardest to reassign, and why.

## 4. Rules

- **Read only.** No edits, no renames, no test runs needed.
- Report the OKLCH lightness of each value so the "close in appearance"
  question has a number against it. Say what tool you used.
- Where a use site is inside a `@media print` block, mark it: print inverts
  `--paper-cream` to `#FFFFFF` (`app.css:238`) and that changes what "sits on"
  means.
- **Do not recommend.** Dann rules case by case; the desk frames the options.
  A row may carry a one-clause observation, never a verdict.
- Say what you could not establish.

## 5. The return memo

`docs/sessions/memo-neutral-audit_r1_<date>.md`. The full table. The §3 answers.
A NOT ESTABLISHED section.

**NOT ESTABLISHED beats a complete invented answer.**
