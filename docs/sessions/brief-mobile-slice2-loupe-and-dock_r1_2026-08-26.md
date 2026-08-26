# Brief: mobile slice 2, the loupe and the dock

For Claude Code, pointed at `~/Desktop/ilya-rewrite`. Serves the mobile
correction track (N.92 and N.93 territory), second of four slices. Written
by the desk 2026-08-26. Floor: `bcab673` (slice 1, walked by Dann).

## The design this builds

`docs/sessions/design-mobile-correction_r2_2026-08-25.html`, accepted by
Dann 2026-08-26 with three rulings: the quick tuplet counts are struck
(the definition grammar arrives in slice 3, not here); one accessible
name, `Drawer` and « Tiroir », for both containers; and the loupe is the
named, singular exception to "nothing floats over the paper." Read the
schematic in full before writing code, and read
`docs/sessions/note-desktop-adaptation_r2_2026-08-25.md` for the station
order. Read `docs/memory/STATE.md`'s mobile design session block for the
ruling set.

## Step one, before any code: the notation face

Measure what draws the page's glyphs today. Name the source with
`path:line`: font, SVG path data, or component. The loupe magnifies the
held measure from THE SAME source, and slice 3's duration buttons will
need the same glyphs at control size. Report the finding in the memo even
though the loupe itself is a view transform.

## What to build

**The loupe.** Tap on the page (below 768 px, both orientations) raises
the loupe on the tapped measure and selects the nearest entry. It floats
clear of the page on the z-axis, two shadow steps, displaces nothing: the
page does not pan, reflow, or resize. It renders the held measure at 2.4
times, the schematic's portrait figure. Its top-left carries the measure
tag: `m. N · system X of Y`. One sage rectangle on the page marks the held
measure; it is not a control.

**The dock.** The loupe and the dock arrive as one motion and leave as
one, a single ~180 ms fade, opacity and transform only. Portrait: the dock
anchors to the bottom edge. Landscape: the left edge, 380 px wide per the
schematic. Four stations in this order: DURATION, PITCH,
ACCIDENTAL · ENTRY, LYRIC. Durations lead (N.95: durations are the broken
channel). The verbs are the SHIPPED verbs re-homed, not new function:

- DURATION: the five duration values and the dot, applied to the selected
  entry. The tuplet cell renders DISABLED with no behaviour; slice 3
  takes it.
- PITCH: up and down a step, up and down an octave. The semitone verbs
  stay retired (Dann, 2026-08-24, slice 2 of the old N.92 numbering).
- ACCIDENTAL · ENTRY: flat, natural, sharp, cumulative to doubles through
  the one spelling policy, exactly as shipped; Delete as shipped. Rest and
  Tie render DISABLED; slice 3 takes them.
- LYRIC: the shipped Shift Lyrics verbs, relabelled for what they touch.
  The melisma pair from the desk drawing is NOT built; it was never ruled.

**The header row.** The readout (`F3 · quarter · на`), the named Undo
pill, and the dismissal chevron. The pill reads the change it will
reverse ("Undo: quarter to eighth"), is absent when nothing can be
undone, and reverses the last correction verb; the stack is in-memory
only. Do NOT add a save site; corrections stay the one stored diff
(N.27's rule stands).

**The stepper.** Two bare arrows beside the readout. They walk the
insertion bar entry by entry and cross barlines; walking past a barline
moves the loupe to the adjacent measure and the sage rectangle with it.
Coarse tap, fine step.

**The page's two states.** Before the loupe: full ink, taps choose the
measure. While the loupe is up: ink drops one visible step, the page takes
no gestures, geometry pixel-identical, the transition a fade. A stray tap
outside the loupe does nothing.

**Dismissal.** The chevron, or a swipe down starting on the loupe or the
dock, sends both away together and the page's taps return.

**Gestures not built, on purpose:** no custom pinch (browser pinch stays;
do not cap zoom in the viewport tag), no double-tap behaviour, no
press-and-hold. The schematic's press-and-hold verb-repeat is slice 3's
call.

## Strings, and Dann's eye

Every new user-facing string needs French, and Dann sees every French
word before it ships. Before the gates, write the full strings table
(station labels, the measure tag, the Undo sentence, the accessible
names) to the memo, English and French side by side, coined marked
against adopted. `Drawer` / « Tiroir » are ruled for both containers'
accessible names. Do not invent French beyond the table.

## Constraints

- 44 px floor on every control on coarse pointers; the page's own glyphs
  stay exempt (the stepper is the precision instrument).
- A verb sits in a box; a navigation mark (stepper arrows, chevron) is
  bare. Draw the distinction everywhere.
- Drawer manipulates, page displays and prints. The loupe is the one
  ruled exception to floating; nothing else floats.
- Do not change `VocalLineEvent`; do not rebuild anything in
  `apps/web/src/lib/shane/reconciliation/`.
- Desktop (768 px and up) is UNTOUCHED this slice.
- Print is untouched: the loupe and dock never print.
- The E.36 §1.4 drawer anchors survive unmodified; the dock is a sibling,
  not the drawer re-anchored.
- Five gates at baseline. If a legitimate test addition moves a baseline,
  say so in the memo; never edit `ilya-ship.sh` silently.
- No commits, no ship. Dann ships after his own walk.

## Verification, before the memo

With the engraved Without Sun song 1 (it is in the library as
`Without Sun, no. 1: Within Four Walls` on Dann's machine; upload the
titled file from `~/Downloads` locally if needed): at 430 x 932, tap a
measure mid-page and look: loupe up, measure tag correct, page dimmed one
step, dock at the bottom, readout naming the entry. Step across a barline
and watch the loupe and the sage rectangle move. Change a duration, watch
the page change under the loupe, and read the Undo sentence. Undo it.
Swipe down, watch both leave in one motion, tap another measure. Then the
same circuit at 932 x 430 with the dock at the left. Then reload:
corrections survived, loupe closed.

## Return memo format

`docs/sessions/memo-mobile-slice2_r1_2026-08-26.md`: the notation-face
finding, what changed with `path:line`, the strings table, what you looked
at with your own eyes at both orientations, gate results, and "Not
established". NOT ESTABLISHED beats a complete invented answer.
