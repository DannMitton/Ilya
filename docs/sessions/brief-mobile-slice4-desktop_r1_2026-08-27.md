# Brief: slice 4, the desktop homecoming

For Claude Code, pointed at `~/Desktop/ilya-rewrite`. Serves the mobile
correction track (N.92 and N.93 territory), last of four slices. Written by
the desk 2026-08-27. Floor: `4553e3c` (slices 1 through 3 whole, every
walk Dann's own).

## The design this builds

`docs/sessions/note-desktop-adaptation_r2_2026-08-25.md`, accepted by
Dann, plus the rulings the build days added, recorded in
`docs/memory/STATE.md` (the build-days block) and
`docs/sessions/memo-mobile-slice2_r3_2026-08-26.md` and
`memo-mobile-slice3_r1_2026-08-26.md` §8 through §11. Read all three
before code. The principle over everything: a singer who learned the phone
has learned the desktop, and the other way round.

## What to build

**1. The loupe arrives on desktop** (768 px and up). Same object, same
grammar: a click on the page raises it on that measure with the nearest
entry taken; it anchors FIXED and never travels (Dann, 2026-08-26); the
sage rectangle alone moves; the measure tag carries its clauses with the
unit pinned; the clef and key open the crop with no orphan barline; the
page's two states hold, full ink before, one step down while the loupe is
up. Placement and magnification are yours to propose since 2.4 is a
portrait figure and no source sets a desktop one: measure what a desktop
page needs and say the number in the memo. The loupe never overlaps the
open drawer.

**2. The drawer's correction surface becomes the SAME surface the dock
carries.** The old `CORRECT THE READ` palette and the separate
`SHIFT LYRICS` station die; in their place the four stations in the
phone's order, DURATION with dot and Nolet, PITCH, ACCIDENTAL · ENTRY
with Rest, Delete, Tie, LYRIC, identical labels, identical verbs,
identical strings, the named Undo pill with its reserved row, the stepper,
the readout, and the gap grammar. The semitone verbs are retired
everywhere; today the drawer still shows them, and they die in this
re-cut. Prefer one shared component in two containers over two copies;
siblings behave identically, and one implementation is how that stays
true.

**3. The lyric anchors unify.** The taken entry anchors the lyric verbs on
desktop exactly as on the phone; the interim disagreement recorded in the
slice 3 memo ends here.

**4. The keyboard arrives** (Dann, 2026-08-27): left and right arrow keys
drive the stepper, Speedy's own grammar coming home. Escape dismisses the
loupe. Keys act only when no text input has focus. OPEN QUESTION for the
memo, not for silent building: whether up and down arrows should drive the
pitch verbs as Speedy's crossbar did; state the case both ways and Dann
rules.

**5. Dismissal on a fine pointer**: the chevron the surface already
carries, and Escape. No swipe exists on desktop; do not invent one.

**6. One accessible name.** Both containers already say `Controls` /
« Commandes »; verify nothing in the re-cut breaks that, and that
`i18n.test.ts`'s N.62 assertions still hold.

## What must not change

- Mobile, below 768 px: zero behavioural change. The walk verifies this,
  not the diff.
- Print: untouched. The loupe and the surface never print.
- The paper: nothing lands on it; the loupe stays the one ruled floating
  exception.
- `VocalLineEvent`, `reconciliation/`: untouched.
- The E.36 §1.4 drawer anchors (metadata and NOTATION top, voice bottom)
  survive the re-cut; only the scroll's correction tenant changes shape.
- Redo and the barline-correction verb are in INBOX, unnumbered, and are
  NOT built in this slice.

## Strings

Expect few or none new. Any new key goes in the memo's table, English and
French side by side, coined marked against adopted, for Dann's eye before
any ship. Do not invent French beyond the table.

## Verification, before the memo

At 1400 px with the engraved song: click a mid-page measure, loupe rises
fixed with clef and key and no orphan barline; arrow keys walk the bar
across a barline and the sage mark follows; a duration change lands from
the drawer's re-cut station and the Undo pill names it; step into a gap,
read the gap sentence, enter a note, a rest, a tie; define a triplet from
the Nolet row; shift a syllable from the LYRIC row anchored on the taken
entry; Escape dismisses; corrections survive a reload. Then at 430 x 932:
the phone circuit unchanged, spot-checked. State your expectation before
each measurement and name your likeliest failure mode.

## Return memo format

`docs/sessions/memo-mobile-slice4_r1_2026-08-27.md`: what changed with
`path:line`, the desktop magnification number and how you chose it, the
up-down-arrow question argued both ways, any strings table, what you
looked at with your own eyes at both widths, gate results, and "Not
established". NOT ESTABLISHED beats a complete invented answer.
