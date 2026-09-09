# Brief for Code: N.114a, two rulings from Dann's N.114 walk. r1, 2026-09-09

Paste into a Claude Code session in `~/Desktop/ilya-rewrite`, branch `Shane`.
Read `docs/memory/CONTRACT.md` §5 first. Do not run git.

## Goal

Three changes, all ruled by Dann on 2026-09-09 walking
`3765314` on the alias. No new string, no French, no copy change.

1. **The Voice station in Score markup is always expanded and loses its
   chevron.** His reason: Calibrate and Re-calibrate open their own drawer
   surface, so the station has nothing to collapse for. Keep the header;
   remove the toggle and the collapsed state for this one station only.
   Corrections keeps its chevron. Start at `+page.svelte`'s Score markup
   stations (the `STATION_IDS` block and the `sections.has(...)` gates near
   where the Underlay station used to be, removed in N.114).
2. **The intake hint moves under the textarea.** `intake.dropHint`
   (`i18n.ts:574`, approved copy, unchanged in both languages) currently sits
   under Choose a file at the bottom of the frame. It moves to sit directly
   under the textarea and above the poem receipt, as the field's caption, in
   the same type it has now. Choose a file stays where it is. Nothing else in
   `IntakePanel.svelte` moves. (`IntakePanel.svelte:355-372` is the receipt
   block; the hint is below the button after it.)

3. **Undo and Redo move to the top bar.** Ruled by Dann 2026-09-09, from the
   user's side: "the button is hard to find." The Undo pill and the Redo pill
   leave the Corrections dock and sit at the right end of the lavender top
   bar (the strip carrying `[Ilya]` and the Français toggle), fixed, in the
   same place whatever is scrolled or open. Undo first, Redo beside it. Each
   keeps its existing sentence as its label (`loupe.undo` and `loupe.redo`
   with their `loupe.undo.*` clauses, `i18n.ts:342-357`), so the button says
   what it will do. Same handlers, same stack, same Cmd-Z and Shift-Cmd-Z.
   ONE UNDO, ONE PLACE: the dock's Undo row and its reservation
   (`CorrectionSurface.svelte:472-496`) go, and the dock closes up by that
   row; measure the loupe's anchor before and after and report it. DESK
   DEFAULT, reversible: both buttons are always drawn and are dimmed and
   disabled when their stack is empty, so their place is learned; if Dann
   prefers absent-when-empty, that is one line. Pill ends per
   `IntakePanel.svelte:753-768`. Touch floor 44 px. No new string.

## Definition of done

- Five gates clean, `tsc` clean, no new i18n key. Report gate 4 and 5 numbers
  against `ilya-ship.sh:79-80`.
- Walked on a local production build, expectation before observation:
  1. Score markup: Voice is open on load with no chevron; Corrections still
     toggles.
  2. Input band, poem present, no score: the hint is the first thing under
     the textarea; the receipt follows it; Choose a file is unchanged.
  3. Input band with a score: same, and the syllable line still sits under
     the score receipt.
  4. Top bar: Undo and Redo at the right end, dimmed with nothing to undo;
     after a placement, Undo reads "Undo: syllable placed" and pressing it
     undoes exactly that; Redo then reads "Redo: syllable placed". Cmd-Z with
     the poem field unfocused still works. The dock has no Undo row and the
     loupe's anchor is reported before and after.
  5. Phone width (390 px): both buttons visible and 44 px, nothing wraps.

## Constraints

Do not run git. No agent commits. Do not coin a string. Do not touch
`SyllableStation.svelte` or the syllable line. `WRITTEN` is not `DONE`.

## What you could not establish

A section with this heading in the memo. **NOT ESTABLISHED beats a complete
invented answer.**

## Return memo

`docs/sessions/memo-n114a-voice-and-hint_r1_<date>.md`, under 90 lines.
