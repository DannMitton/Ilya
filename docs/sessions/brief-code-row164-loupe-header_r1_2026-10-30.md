# Brief: row 164, the Loupe's lavender header

r1, 2026-10-30, written by the desk (Opus). NOT Fable-reviewed: Fable reviews it after Sunday 2026-11-01 04:00 (`CONTRACT.md` §1 item 19). Lane: cloud, Sonnet, after row 163 or beside it on its own branch.

**NOT ESTABLISHED beats a complete invented answer.**

## What the singer sees, and why

The Loupe has no name on screen, so a singer who skips the Guide never learns it. It does not look like the Drawer's sections. It can cover the bar the singer is looking at, and nothing lets them move it. Dann 2026-10-30 14:32 asked; 14:34 kept the swipe-to-close and accepted a Close button beside it; 14:40 ratified.

## The ruling (`docs/memory/OPEN.md`, "2026-10-30, FROM THE WALK", Loupe)

1. A solid lavender header on the Loupe, built from the Drawer's band recipe (`StationHeader.svelte`; not read by the desk), with **LOUPE** flush left and Undo, Redo, and Close flush right. French « LOUPE » (ratified 14:40 with the Loupe modifications; Ilya's French already says « la loupe », `apps/web/src/lib/i18n.ts:1827`).
2. Desktop: dragging the header moves the Loupe; the position holds while it is open and resets when it closes.
3. Phone: a tap on the header flips the Loupe between the top and the bottom of the screen; the downward swipe still closes it (`apps/web/src/lib/score/Loupe.svelte:2594-2599`).
4. The bottom bar keeps the zoom (− and +); Undo and Redo move up. Today Undo, Redo, and the chevron sit flush right in the bottom bar (`Loupe.svelte:2500`, `:2811`), and on a phone the bar takes two rows (`:2777-2778`); after the move it should fit one. What the chevron does today is NOT ESTABLISHED: read it and say in the report where it goes.
5. The line "m. 2 · system 1 of 9" and the note line stay, under the header.

## Steps

Step 0: screenshots of the Loupe as built, desktop and 390 px, song 1 bar 2. Step 1: the header and the moved controls. Step 2: drag on desktop. Step 3: the phone's top and bottom flip. One commit and one report each. Gates at baseline; no push to `Shane` or `main`; nothing under `docs/memory/`.

## What the desk could not establish

`StationHeader.svelte`'s API; the chevron's action; whether the Loupe's present placement code tolerates a user-set position.
