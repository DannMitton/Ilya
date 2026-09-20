# BRIEF. N.149 revision: the chosen pill segment takes a lavender fill

Written by the desk 2026-09-20. Shape from `BRIEF-TEMPLATE.md`. Small.

**RULED BY DANN 2026-09-20, 11:31, verbatim:** *"The active portion of the
Syllable/Corrections pill should have a lavender fill to reinforce to the user
which mode they are in."*

## 1. What was observed

Dann walked `6ca97db` on desk-driven screenshots and ruled the above. Nothing
else about the pill was raised.

## 2. What is established, each line read this session

- `apps/web/src/lib/shane/Loupe.svelte:2660-2663`: the chosen member is
  `.loupe-pair-member.chosen { background: var(--paper-cream, #f0ebe0); cursor:
  default; }`. **`--paper-cream` is the loupe card's own ground**, so the chosen
  segment is currently distinguished by almost nothing.
- `Loupe.svelte:2644-2650`: `.loupe-pair-member` sets
  `color: var(--ink-primary, #1a1612)`, `background: transparent`, and the
  uppercase 0.6875rem label.
- `Loupe.svelte:2636-2642`: `.loupe-pair` carries a 1px `--ink-primary` border
  and `border-radius: 4px`; `:2656-2658` gives the second member a 1px left
  divider.
- `Loupe.svelte:2630-2634`: the comment records this pill as a copy of
  `DeskHead.svelte`'s `.pair` / `.pair-member`.
- The lavender tokens already exist in `apps/web/src/app.css`:
  `--lavender: #9585A2` (`:56`), `--lavender-desk: #D5CEDA`, lavender at 60%
  (`:149`), `--lavender-chip: #746580` (`:175`), `--lavender-ink: #554660`
  (`:184`).

## 3. Measure before you change anything, and report before writing code

1. **Which token the squircle uses.** Read it in the tree and report it. The
   ruling of 2026-09-17 says the squircle is the one coloured thing in the
   loupe, so the pill's fill must not match its weight.
2. **Contrast.** Report the measured contrast of the label ink on the chosen
   fill. It clears 4.5:1 or the fill changes, not the ink.

## 4. The rulings this serves

- **Dann, 2026-09-20, quoted in full above.** It is the later ruling and it
  stands.
- **Dann, 2026-09-17: the squircle is the one coloured thing in the loupe.**
  This revision adds a second. **That is his call, already made. Do not treat
  the older ruling as a bar; treat it as the reason the fill is a tint.**

## 5. Constraints

- **Use an existing token. Coin no colour.** `--lavender-desk` is the desk
  default (see section 6) and `--lavender` is available if Dann asks for more
  weight.
- Touch only `.loupe-pair-member.chosen`. The border, the radius, the divider,
  the type and the layout do not change.
- **No new strings and no French.**
- Do not change `DeskHead.svelte`. Its pill is the desk's and is not in scope.
- **No agent commits and no agent stages.**

## 6. Done when

`WRITTEN` on all of these:

- `.loupe-pair-member.chosen` fills with **`var(--lavender-desk)`**, which is
  lavender at 60% over white. **DESK DEFAULT on the weight, not Dann's ruling:
  he said "lavender", and the desk chose the tint so the segment reads as state
  rather than competing with the squircle. He can call for `--lavender` instead
  with one word.**
- The label on the chosen segment stays legible and its contrast is reported.
- The unchosen segment is unchanged: transparent, with its existing hover.
- `tsc` clean and the five gates at baseline.

`DONE` is Dann's walk.

## 7. Report back

The commit, the two measurements of section 3, the contrast figure, and **what
could not be established.**

**NOT ESTABLISHED beats a complete invented answer.**
