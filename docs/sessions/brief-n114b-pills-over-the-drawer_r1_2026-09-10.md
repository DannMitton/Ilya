# Brief for Code: N.114b, Undo and Redo align to the drawer's right edge. r1, 2026-09-10

Paste into a Claude Code session in `~/Desktop/ilya-rewrite`, branch `Shane`.
Read `docs/memory/CONTRACT.md` §5 first. Do not run git.

## Goal

Ruled by Dann 2026-09-10 walking `f3250a6` on the alias. The Undo and Redo
pills in the top bar (N.114a, `HeaderBar.svelte`) move from the bar's right
end to sit flush with the drawer's right edge, directly above the drawer, on
every desk that has a drawer. Français keeps the far corner. On a phone the
drawer is the full width, so the pills already sit there; nothing changes
below the drawer's breakpoint. Same handlers, same labels, same disabled
state, no new string.

## Item 1, CORRECTION after Dann's walk of `ec4fbe9`, 2026-09-10

Items 1 and 2 shipped in `ec4fbe9` (code rode in `767f70d`). Dann's eye on
the alias: the Redo pill's right edge overhangs the drawer's drawn edge by
about a pill's end-cap; it must be TANGENT. The anchor was `drawerWidth`
via `--drawer-right`; the drawn band (`.group-band`, the Piece band's right
edge) is evidently narrower than that value. RULED BY DANN 2026-09-10, refining
the target: the pill sits on the drawer's CONTENT line, not the band's outer
edge. That line is the band's label edge, 18 px inside the band
(`.group-band { padding: 0 18px }`, `Drawer.svelte:980-994`), which the
fields share (`.band-body { margin: 0 18px }`, `:1064-1066`). Anchor to it
using the same value the band uses, not a second literal. Walk item, by
what he can see: on the desk, `getBoundingClientRect().right` of the Redo
pill, of the METADATA label, and of the first metadata field share one x,
to the pixel. Item 3 below
is NOT yet built and goes in this pass.

## Item 2. Air under every band

Ruled by Dann 2026-09-10 from two crops: the first field under the Piece
band and the intake frame under the Input band both touch their band, while
the fields sit `gap: 0.35rem` apart (`MetadataFields.svelte:176-180`).
`.band-body { margin: 0 18px }` (`Drawer.svelte:1064-1066`) gives no top
margin and `.intake` (`IntakePanel.svelte:604-609`) has none. Add ONE rule in
`Drawer.svelte`: the first child after `.group-band` takes
`margin-top: 0.35rem`, the fields' own value, so the two measures stay equal.
DESK DEFAULT: it applies to all four bands. If Text or Score markup read
wrong with it (their stations carry their own header row), narrow it to
Piece and Input and say so in the memo. Walk item: Piece's first field and
Input's frame each sit 0.35rem under their band, measured in the DOM, and
the gap between Piece's fields is unchanged.

## Item 3. Start placement over moves into the syllable line's row

Ruled by Dann 2026-09-10. The button now sits as a pill under Voice in Score
markup. It rebuilds every seat from the poem (`+page.svelte:557-568`), so it
is the Clear of placements, and placements live in the syllable line since
N.114. Move it: when the line is OPEN, its header row (count and chevron)
also carries "Start placement over" as a small text verb in the receipts'
`.receipt-btn` style, left of the count. Absent while the line is collapsed
and absent without a score. Same handler, same string
(`placement.startOver` or whatever key it carries today; do not coin one).
The pill under Voice goes. UNDO: whether the handler pushes onto the undo
stack is NOT ESTABLISHED by the desk; read it, and if it does not, make it
push with the existing `loupe.undo.*` vocabulary if one clause fits, or STOP
and name the gap in the memo rather than coin a string. Walk items: the verb
is present only with a score and the line open; pressing it rebuilds; Undo
in the top bar reverses it, or the memo says why not.

## Item 4, after Dann's walk of `7665afa`, 2026-09-10

"Start placement over" in the open line's row is a PILL, not a text verb.
Dann: "needs to be inside a pill to be consistent as an actionable button."
DESK DEFAULT: the outlined ghost pill Choose a file wears in the same band
(`.action-btn.btn-ghost`, pill ends per `IntakePanel.svelte:753-768`); Clear
and Replace on the receipts stay text. Same handler, same string. Walk item:
the row shows the pill left of the count; 44 px on touch; nothing wraps at
390 px.

## Item 5, same walk, 2026-09-10

The pills' horizontal padding becomes the band inset, the 18 px
`.group-band` spends on its label (`Drawer.svelte:980-994`), keyed to the
same value and not a second literal. Effect, ruled by Dann: the pill's end
stays tangent to the card's edge (504 at 1400 px, as built) AND the word
"Redo" ends on the content line where METADATA ends (486). Walk items: on
the desk, the Redo pill's `right` equals the Piece band's, and the text
node "Redo"'s `right` equals the METADATA label's, both to the pixel; at
390 px both pills, 44 px, and Français still fit on one line with the
clipping rule holding.

## Item 6, Dann's walk of `8278429`, 2026-09-10

Air above the open syllable box to match the air below it. Below: Choose a
file's row is `margin-top: 8px` under the box (`IntakePanel.svelte:853-857`).
Above: the header row (`.syl-head`, `:779-783`) has 8 px above itself and
nothing between it and `.syl-box` (`:504`). Give the open box the same 8 px
above it, from the one value the actions row uses (a custom property or a
shared rule, not a second literal). Walk item: header row bottom to box top
equals box bottom to Choose a file top, in the DOM.

## Item 7, Dann's walk of `8278429`, 2026-09-10

Under Export and import (Piece band, `SongList.svelte` or wherever the three
buttons live; read it), the order becomes: **Export all songs, Export this
song, Import a song.** Today it is Export this song, Import a song, Export
all songs. Reorder only; same handlers, same strings, same pills. Walk item:
the three read in that order left to right on the desk and top to bottom
if they wrap at 390 px.

## Item 8, Dann's walk of `8278429`, 2026-09-10

On the calibration takeover surface, the compact collapse row ("Dann ·
7/10 vowels", `CalibrationWizard.svelte:1250-1262`, gated on
`scoreRenders > 0 || collapsed`) folds the whole wizard body away and leaves
an empty drawer. It was built to cede the Fit drawer to the score (Kimi Q3,
§A.28); calibration now takes over its own surface, so there is nothing to
cede. DESK DEFAULT, ruled reversible: remove the row and the collapsed state
on the takeover surface; the body is always shown. Read first whether the
wizard is mounted anywhere else where the fold still has a job, and say so
in the memo; if it is, scope the removal to the takeover. Walk item: with a
score rendered, the calibration surface opens with no collapse row and the
body present; nothing else on the surface moves.

## Item 9, same walk

On the calibration surface, "Start over" (the text link under Finish) becomes
a ghost pill, the same recipe as "Add voice characteristics" above it
(`.wizard-secondary`, `border-radius: 999px`). Filled Finish, ghost Add
voice characteristics, ghost Start over, in that order. Same handler, same
string. Walk item: three pills in a column; 44 px on touch.

## Constraints

- Use the width the layout already has for the drawer column; do not
  measure the DOM. Name the variable in the memo.
- The pills and the Français pill never touch: a minimum gap, stated in px,
  at the narrowest desk width the layout allows.
- Do not run git. No agent commits. Do not coin a string.

## Definition of done

Gates clean, `tsc` clean. Walked on a local production build, expectation
before observation: (1) desk, 1400 px: the pills' right edge equals the
drawer's right edge, Français at the corner; (2) the narrowest desk width:
the gap holds; (3) 390 px: the bar is byte-identical to N.114a's.

## What you could not establish

A section with this heading. **NOT ESTABLISHED beats a complete invented answer.**

## Return memo

`docs/sessions/memo-n114b-pills-over-the-drawer_r1_<date>.md`, under 70 lines.
