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
edge) is evidently narrower than that value. Read why (the drawer's outer
gutter is the likeliest, unread) and anchor to the edge the singer sees.
Walk item, stated by what he can see: on the desk, `getBoundingClientRect().right`
of the Redo pill equals that of the Piece band, to the pixel. Item 3 below
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
