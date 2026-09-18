# Brief: the loupe re-engraves the held measure at its own spacing

Revision 1, 2026-09-18. Written by the desk for Claude Code. Follows
`brief-n92-caret-collision_r1_2026-09-17.md`, shipped as `fda5b9c`.

Item: **N.92, the insert reach.** Rulings: `docs/memory/OPEN.md`, section THE
CARET, clauses 4 to 6.

## 1. Why this exists, and what the last pass established

`fda5b9c` fixed the four measures Dann photographed. Its own whole-fixture scan
then found **27 gaps on 12 of the fixture's 18 measures that still collide**: 18
where a neighbour's ink and the squircle leave less room than a caret's own
width, as little as `0.153` units against a caret `3.74` units wide, and 9 where
a caret meets a beam
(`memo-n92-caret-collision_r1_2026-09-17.md` §4, read in full by the desk).

**Every remedy so far has worked inside the CLONE of the page's SVG**, where a
beam, a tie, a ledger line, or an accidental can depend on a note's rendered
position without carrying a handle back to it. That makes moving any note unsafe,
which the previous two passes both established independently. **The wall is the
clone, not the geometry.**

**The desk's brief chose that mechanism by not naming one.** This brief names it.

## 1.0 THE GOVERNING RULE, ruled by Dann 2026-09-18. Read this first

His words, on m. 13: *"The Loupe is an artificial instance of a single measure.
The conceit that we implemented of the barline suggesting continuation is
conceptual only. There should not be any information in the Loupe from adjacent
measures."*

- **No mark from an adjacent measure appears in the loupe, at either end.** Not a
  barline, not an accidental, not a notehead, not a syllable, not a fragment of
  one.
- **The continuation barline is a conceit.** It stands for the measure's
  boundary. It is not a window onto the other side of it.
- **This is why re-engraving is the route.** A crop of the page can always pull
  in a neighbour, and every widening of the crop pulls in more. A re-engraved
  single measure has no neighbours to pull in, so this rule holds by construction
  instead of by stripping marks one kind at a time.

**Section 1.1's defect is one instance of this rule being broken. Fix the rule,
not the instance, wherever you can.**

## 1.0.2 THE WIDTH IS NO LONGER CAPPED. Ruled by Dann 2026-09-18

He RETRACTED his own ruling of 2026-08-27, which `Loupe.svelte:682-687` carries
as a comment in his name. His words: *"especially on desktop, the measure
contents should be fully represented... This extra width is going to cause wider
measures. If we don't shrink the point size of the notation, the only responsible
alternative is to allow wider measures to be fully expressed on a device where
they can be."*

- **The notation's point size is the fixed quantity. The window is the variable
  one.**
- **On a desk, the loupe takes the width its contents need**, up to the viewport
  less the drawer and the gutters. It is no longer capped at the page's width.
- On a device that cannot give the width, the singer turns to landscape or
  scrolls. **That is N.140, open and not this brief's work. Do not build it
  here.**
- **AMEND THE COMMENT AT `:682-687` rather than deleting it.** It cites Dann for
  the opposite rule. Record the retraction, its date, and its reason in place.

**This is the room the carets have been missing all night.** With it and the
re-engraving, the position rule should hold without any mark being nudged.

## 1.0.1 A second live defect from `fda5b9c`: the tail panel is detached

Dann, on m. 12: *"Why is the measure followed by the weird disconnected artefact
of a stave line?"*

**Read by the desk 2026-09-18.** `Loupe.svelte:807` draws a short run of bare
stave after the measure whenever the closing barline is not the final one, the
continuation conceit. `:1984-2000` draws it as its own SVG butted against the
body panel. `fda5b9c` widened the body by `CARET_MARGIN` on each side, and
`:1610-1617` renders that extra width as blank space, so a gap opens between the
closing barline and the tail.

- **The conceit stays.** Dann endorsed the continuation barline in the same
  breath as section 1.0. What is wrong is the detachment.
- **Every panel of the strip meets its neighbour with no gap**, whatever margin
  the body takes for its carets.
- **Fixed in this pass whether or not the re-engraving proceeds.**

## 1.1 A live defect from `fda5b9c`, and it is fixed whatever else happens

**Dann walked `fda5b9c` and found a barline standing after the meter signature**,
m. 14. His words: *"this measure has an inappropriate barline after the meter
signature."* **A meter signature is followed by music, never by a barline.**

**Dann saw it again on m. 5 and says it is general:** *"so many of these measures
now have that inappropriate barline at the beginning."*

**THE CAUSE, read by the desk 2026-09-18.** `Loupe.svelte:1215-1218` widens the
body crop by `CARET_MARGIN`, two line-gaps, on each side, and `:1637` feeds that
widened left edge into the viewBox. The crop now takes in two line-gaps of
whatever precedes the measure, which on a mid-system measure is the previous
measure's closing barline. The head panel has already drawn the clef, key and
meter, so that barline lands between the meter and the first note. **The last
step, that the mark in view is specifically that barline, is NOT ESTABLISHED.
Measure it first.**

**Desk recommendation, confirm it or better it:** the body clone strips the
barline preceding the held measure, the way it already strips the page's
selection ring. The head panel stands for the measure's opening, so that barline
is redundant there and wrong where it is drawn. The head caret then takes the
middle between the crop's left edge and the first note's ink.

**This is fixed in this pass whether or not the re-engraving proceeds.** If you
hit section 3's stop condition, fix this defect on its own, ship that, and report
the rest. A re-engraved measure draws its own barlines and needs no nudge, so the
suspected mechanism goes away with the re-engraving if it proceeds.

## 2. What Dann ruled

- **The loupe's spacing is its own.** 2026-09-17: *"the spacing in the Loupe is
  temporary and situational, and bears not on the paper GUI? Loupe demands
  expanded spacing to accommodate all the elements without overlap."*
- **The mechanism, permitted 2026-09-15 and recorded with its condition:**
  *"Re-engrave the measure for the Loupe with the spacing to allow this, if
  necessary."* The record names what that means: **calling the renderer for the
  held measure alone, at its own spacing**, rather than cropping the page's SVG
  (`OPEN.md`, THE PERMISSION HE GAVE).
- **The condition is now met.** Two passes have established that the cheaper
  route cannot reach 27 gaps.

## 3. The work

**The loupe draws the held measure by re-engraving it, not by cropping the
page.** The renderer lays out beams, ties, accidentals and ledger lines itself at
whatever spacing it is given, so at wider spacing they come out right and no mark
is nudged by anything.

**Step 1, establish before you build.** Read what calling the renderer for one
measure actually requires: what `staff-renderer.ts` needs as input for a single
measure, what the loupe's own panels (the head, the meter panel, the carried
band) assume about being crops of the page, and what a re-engraved measure would
have to supply in their place. **Report that before writing the drawing code.**

**Step 2, build it,** with the carets placed by the position rule inside the room
the new spacing gives.

**THE STOP CONDITION, and it is not a failure.** If step 1 shows this cannot be
done in one pass, **stop and report what it needs.** Say what is tractable, what
is not, and what a staged version would look like. **Do not half-build it, and do
not fall back to nudging marks in the clone.** A clear account of the cost is the
deliverable in that case.

## 4. Constraints

- **The page and the print do not change.** The loupe's spacing is the loupe's.
  Say in the memo how you know the page is untouched.
- **Do not change `VocalLineEvent`.** Do not touch the squircle's geometry, which
  is N.141's and ruled.
- The caret's behaviour does not change: it selects the gap it names, and the
  one-pool tap resolution stands.
- A tap on a note, a rest, and a caret each resolve as they do in `fda5b9c`.
- No new strings.
- **Any gate that moves is named in the memo with its new number. Do not edit
  `ilya-ship.sh`.**
- House style in every comment.

## 5. Done when

Report `WRITTEN`; `DONE` is Dann's walk.

**Reuse your own whole-fixture scan from the last pass as the acceptance test**,
and run it over all 18 measures. Zero violations on all five checks:

1. Every caret stands in the middle of the space it names.
2. No caret's drawn mark touches a notehead, stem, beam, flag, accidental, dot,
   tuplet bracket, or rest glyph.
3. No caret touches the squircle's stroke or stands between its two strokes.
4. No caret touches a barline.
5. Every caret is drawn whole, both arrowheads and the full stroke, at every
   magnification, on a phone and on a desk.
6. **No mark from an adjacent measure appears in the loupe, at either end**, on
   any measure of the fixture: no barline where one does not belong, no
   accidental, notehead, syllable, or fragment of one belonging to the measure
   before or after. Section 1.0 is the rule; this is its test.
7. **No gap between the strip's panels.** The head, meter, carried band, body and
   tail meet with no blank seam, at every magnification and on every measure.
   Section 1.0.1.

Plus: every caret's hit rectangle stays far enough from its neighbours that a tap
resolves to the one aimed at, measured rather than assumed.

**If any violation remains, name it, count it, and say why it is not reachable.**

## 6. Report back

A short memo in `docs/sessions/`, leading with **step 1's finding**, then whether
you built or stopped, then the scan's results, then a section on **what you could
not establish**. **NOT ESTABLISHED beats a complete invented answer.**
