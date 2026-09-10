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

`docs/sessions/memo-n114b-pills-over-the-drawer_r1_<date>.md`, under 40 lines.
