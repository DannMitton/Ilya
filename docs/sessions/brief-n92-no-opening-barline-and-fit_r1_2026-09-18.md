# Brief: no opening barline, and the loupe sizes to its contents

Revision 1, 2026-09-18. Written by the desk for Claude Code. Follows
`brief-n92-loupe-reengraves_r1_2026-09-18.md`, shipped as `a86e985`.

Item: **N.92.** Rulings: `docs/memory/OPEN.md`, section THE CARET, **clauses 11
and 12**, both ruled by Dann on the walk of `a86e985`. **Neither is N.153. Do not
start the re-engraving here.**

## 1. No opening barline, ever

Dann, on m. 5: *"found another unwanted initial barline. These need to be gone."*

**Why the clip you shipped did not catch it.** Your clip removes content belonging
to ADJACENT measures, and it works: the stray key signature, the half-cut sharp
and the neighbouring barline are gone. **A measure's own opening barline is not
adjacent content**, so it survives and is drawn immediately after the loupe's
clef, key and meter panels.

- **Draw no barline at the loupe's left, whatever it belongs to.** The head panel
  stands for the measure's start, and a barline after a meter signature is wrong
  notation.
- **The closing barline stays.** It is the continuation conceit Dann endorsed, and
  the tail panel sits behind it.
- **Check every measure of the fixture**, at a system's start and mid-system,
  since the two cases differ in what precedes the measure.

## 2. The loupe sizes to its contents

Dann, after the width retraction made every loupe full width: *"Can we have some
sort of responsive dimension? I think imposing a minimum is smart? But this Loupe
can be much tighter to its contents than it is. I see no reason to impose
uniformity in dimension for all Loupes."*

- **Width equals the contents plus padding**, clamped between a minimum and the
  viewport less the drawer and the gutters. **`Loupe.svelte:1662` already computes
  `stripWidth` from the panels it has just built**, and `:692` currently discards
  it in favour of the room the viewport offers.
- **THE SIZE IS KEYED TO THE HELD MEASURE, NEVER TO THE SELECTION.** Within one
  measure the card holds absolutely still while the singer steps from note to gap
  to note. It resizes only when the loupe is raised on a different measure.
  **This is not a nicety: a card that resizes under the hand moves the header, the
  syllables bar and the dismiss target while the singer is working.**
- **The minimum is set by what the header and the syllables bar need to read
  properly**, not by the notation. **State the number you chose and why.**
- The loupe stays centred on the measure it magnifies, as it does today.
- **The height is unchanged** unless your own measurement says otherwise.

## 2.5 More daylight, and a tap separation floor

Dann, on the walk: *"Maybe even a little more daylight between the squircle and
that caret on the right side? I'm thinking about fat fingers on mobile and
selection hotspots."*

**These are two numbers, not one.** The clearance is the drawn gap and scales with
the notation. Mis-taps are decided by `nearestTarget`, which compares hit-rectangle
CENTRES, so a thumb is governed by the distance between two centres in CSS pixels
at phone width. Your own memo measured that at **22 px** on the case you fixed on
2026-09-17.

- **Raise the drawn clearance from 1.2 line-gaps to 1.6.** DESK DEFAULT.
- **Add a tap separation floor: 44 CSS pixels between a caret's hit centre and its
  neighbour's, measured at phone width.** DESK DEFAULT.
- **Where the floor cannot be reached, report it. Do not shrink it quietly.** On
  the tight measures it will not be reachable inside the current spacing. **Name
  those measures and their actual separation. That list is evidence for N.153.**

## 3. Constraints

- **Do not change `VocalLineEvent`**, the squircle's geometry, or the caret
  behaviour. A caret still selects the gap it names.
- **Do not start N.153.** No re-engraving, no derived spacing. Those five stages
  are their own item and their own passes.
- The page and the print do not change.
- No new strings.
- **Any gate that moves is named in the memo with its new number. Do not edit
  `ilya-ship.sh`.**
- House style in every comment.

## 4. Done when

Report `WRITTEN`; `DONE` is Dann's walk.

1. **No barline is drawn at the loupe's left on any measure of the fixture**, at a
   system's start or mid-system.
2. The closing barline and the tail panel are unchanged.
3. **The loupe's width fits its contents plus padding**, never the full viewport
   for a short measure, and never below the minimum you set.
4. **Raising the loupe on the same measure twice gives the same width, and moving
   the selection within one measure does not change it at all.** Measured, not
   assumed.
5. Tap resolution for note, rest and caret is unregressed.
5b. **The drawn clearance is 1.6 line-gaps**, and **every caret's hit centre sits
   at least 44 CSS pixels from its neighbours' at phone width, or the measure is
   named in the memo with its actual separation.**
6. Your whole-fixture scan still passes on the rules it passed in `a86e985`.

## 5. Report back

A short memo in `docs/sessions/`, with the commit, the minimum width you chose and
why, the results against section 4, and a section on **what you could not
establish**. **NOT ESTABLISHED beats a complete invented answer.**
