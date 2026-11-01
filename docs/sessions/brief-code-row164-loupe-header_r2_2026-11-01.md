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

## r2 (2026-11-01): Fable's review and Dann's answer applied

Review: `docs/sessions/review-fable-brief-row164_r1_2026-11-01.md` (SEND WITH AMENDMENTS, 16 amendments, 166,397 tokens). **All 16 amendments apply as written in that file, with their exact replacement text; read it in full first. Where the review and the text above differ, the review wins, except where a ruling below differs.** In particular: the header recipe is the drawer's group band (`Drawer.svelte:1058-1070`, `:1118-1120`), not the station row; the header lives in a new `LoupeHeader.svelte`, because `+page.svelte` (5586 of 5586) and `Loupe.svelte` (3012 of 3013) have no ratchet room; the colours use row 165's tokens.

**Ruled by Dann 2026-11-01 13:05 (question 1):** on a phone with the LOUPE at the foot of the screen, the LOUPE grows upward when the Syllables or Corrections panel opens; its header and music stay at the foot, and the panel rises above them.

**French (questions 2 and 3), held:** « LOUPE » as the header word, « Fermer » for Close, and the two phone move labels: Code writes the English, leaves each French value as the English with a `TODO-FR` comment, and lists them in its report; the desk drafts each with a recommendation for Dann, and nothing French reaches `Shane` before he rules. Singer-facing mentions of the five document names in capitals (Dann 12:19).

**Order:** after rows 165 and 163 merge; cut the lane from `Shane` then, and re-check every cited line.
