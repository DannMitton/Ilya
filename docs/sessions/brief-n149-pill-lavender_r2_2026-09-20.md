# BRIEF. N.149 revision: the pill's fill marks an OPEN panel, not a mode

Written by the desk 2026-09-20, revision 2. Shape from `BRIEF-TEMPLATE.md`. Small.
**Revision 1 was wrong and is superseded: it tied the fill to the mode alone.**

## 1. What was observed

**Dann, 2026-09-20 11:31, verbatim:** *"The active portion of the
Syllable/Corrections pill should have a lavender fill to reinforce to the user
which mode they are in."*

**Dann, 2026-09-20 11:33, refining it, verbatim:** *"on open state neither half
should bear colour. Selecting the mode gives it colour. When the accordion is
retracted there is no colour."*

**The desk read it back to him as three states and he answered "correct":**

1. **The loupe opens, the panel retracted: neither half bears colour.**
2. **A segment is tapped and the panel opens: that half takes the lavender.**
3. **The panel is retracted: the colour goes.**

**So the fill means "this panel is open, and it is this one." It does not mean
"this is the current mode."**

## 2. What is established, each line read this session

- `apps/web/src/lib/shane/Loupe.svelte:2432` `class:chosen={mode === m}` is what
  fills the segment today.
- `:2660-2663` `.loupe-pair-member.chosen { background: var(--paper-cream,
  #f0ebe0); cursor: default; }`. **`--paper-cream` is the loupe card's own
  ground**, so the chosen segment is barely marked at all today.
- `:154-155` the props `mode: LoupeMode` and `onmode`.
- `:145` the prop `syllablesOpen: boolean`, and **the comment at `:150-151` states
  it keeps "the panel's own open state, and the re-frame at the effect that reads
  it", with the mode read separately.** So the panel's open state is already in
  this component and needs no new prop.
- `:2454` the chevron carries `aria-expanded={syllablesOpen}`; `:2461` its icon
  takes `class:expanded={syllablesOpen}`.
- `:2435-2436` `aria-selected={mode === m}` and the roving
  `tabindex={mode === m ? 0 : -1}`.
- `:668-669` the effect reads both `syllablesOpen` and `mode`.
- Tokens in `apps/web/src/app.css`: `--lavender: #9585A2` (`:56`),
  `--lavender-desk: #D5CEDA`, lavender at 60% (`:149`),
  `--lavender-chip: #746580` (`:175`), `--lavender-ink: #554660` (`:184`).

## 3. Measure before you change anything, and report before writing code

1. **Which token the squircle uses.** Read it in the tree and report it. The
   ruling of 2026-09-17 says the squircle is the one coloured thing in the loupe,
   so the pill's fill must not match its weight.
2. **Contrast.** Report the measured contrast of the label ink on the chosen
   fill. It clears 4.5:1 or the fill changes, not the ink.
3. **Whether the loupe opens with `syllablesOpen` false.** State 1 depends on it.
   If the panel opens open, report that: the three states above would then never
   show state 1 and Dann needs to know before anything is built.

**The cause of anything you find is yours to state. This brief supplies none.**

## 4. The rulings this serves

- **Dann, 2026-09-20 11:31 and 11:33, both quoted in full above, and the
  three-state reading he confirmed with "correct".** These are the later rulings
  and they stand.
- **Dann, 2026-09-17: the squircle is the one coloured thing in the loupe.** This
  revision adds a second. **That is his call, already made. Do not treat the
  older ruling as a bar; treat it as the reason the fill is a tint.**

## 5. Constraints

- **The fill is gated on BOTH: the segment is the current mode AND the panel is
  open.** In `Loupe.svelte` those are `mode === m` and `syllablesOpen`.
- **`aria-selected` and the roving `tabindex` DO NOT CHANGE.** They stay on
  `mode === m` alone. A retracted panel does not unselect the tab for a screen
  reader; only the fill goes.
- **Use an existing token. Coin no colour.**
- Touch only the chosen segment's fill. The border, the radius, the divider, the
  type, the hover and the layout do not change.
- **No new strings and no French.**
- Do not change `DeskHead.svelte`. Its pill is the desk's and is not in scope.
- **No agent commits and no agent stages.**

## 5b. AMENDMENT, desk, 2026-09-20 11:38, after Code's section 3

**CODE ESTABLISHED:** `+page.svelte:1474` `let loupeSyllablesOpen = $state(false)`
lives on the page, so the panel's open state **survives a dismiss and re-raise**,
while `loupeMode` returns to `'syllables'` on close (`:1481-1484`). **The mode
resets and the panel does not.**

**WHY IT MATTERS:** on a re-raise the loupe would open with the panel open and the
fill already on, which breaks Dann's *"on open state neither half should bear
colour"* in that one case.

**DESK DEFAULT, reversible, Dann's to overturn with a word: THE PANEL ALSO RESETS
CLOSED ON DISMISS**, matching the mode reset that is already there. Every raise then
looks the same and his ruling holds in every case. **Cost, stated and accepted:** a
singer who dismisses mid-correction and comes back reopens the panel with one tap.

**ALSO CHECK, from Code's own NOT ESTABLISHED list:** whether any theme or media
block in `app.css` redefines `--lavender-desk`. Report it before building.

## 6. Done when

`WRITTEN` on all of these, each observed in a browser, not inferred:

- **Panel retracted: both segments render identically and neither bears colour**,
  whichever mode is current.
- **Panel open: the current mode's segment fills with `var(--lavender-desk)`** and
  the other does not.
- **Retracting the panel removes the fill** and leaves both segments identical.
- Switching modes with the panel open moves the fill to the other segment.
- The keyboard path behaves the same as the tap path.
- `tsc` clean and the five gates at baseline.

**DESK DEFAULTS, both reversible, both Dann's to overturn with a word:**

- **The weight: `--lavender-desk` (#D5CEDA, lavender at 60%) rather than
  `--lavender` (#9585A2).** He said "lavender"; the desk chose the tint so the
  segment reads as state rather than competing with the squircle.
- **With the panel retracted, the chosen segment loses the `--paper-cream` fill
  too, so the two really are identical**, which is what "neither half should bear
  colour" says plainly.

`DONE` is Dann's walk.

## 7. Report back

The commit, the three measurements of section 3, the contrast figure, and **what
could not be established.**

**NOT ESTABLISHED beats a complete invented answer.**
