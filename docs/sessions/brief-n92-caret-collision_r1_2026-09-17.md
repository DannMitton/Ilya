# Brief: the caret and the note after the squircle collide

Revision 1, 2026-09-17. Written by the desk for Claude Code. Follows
`brief-n92-caret-span-and-rests_r1_2026-09-17.md`, shipped as `8cb9b51`.

Item: **N.92, the insert reach.** Ruling: `docs/memory/OPEN.md`, section THE
CARET, **clause 6**.

## 1. What Dann found

**Two collisions, on two measures.**

1. **m. 14**: the caret that should stand between the squircle'd note and the
   next note is drawn on top of that next note. His words: *"Collision between
   the note to the right of the squircle and the caret that should precede
   it."*
2. **m. 3**: the measure's last caret overlaps the closing barline. His words:
   *"The last caret in this measure must not overlap the barliine: caret first,
   then barline."* The tail gap is drawn at the crop's own right edge, which is
   where that barline stands.
3. **m. 4**: the first and last carets are drawn as halves of themselves. His
   words: *"There is not reason the first and last carets in the measure cannot
   be full symbols instead of the truncated halves Ilya draws. Please make all
   carets fully complete, and not half of themselves."* **The desk reads this as
   the same cause as 2, the crop's own edges clipping the mark, but that is NOT
   ESTABLISHED. Measure it.**
4. **m. 6**: BOTH strokes of the squircle overlap the carets on either side of
   it. His words: *"Double whammy... Both sides of the squircle overlap the
   carets on either side."*

**Read these four as one finding.** The carets are being fitted into spacing
engraved before they existed, and every remedy so far has relocated the
collision instead of removing it. **The desk's inference, which your measurement
confirms or refutes and which nothing is built on until then: the cheap route is
exhausted and remedy 2 is the answer.** Section 3 keeps the order anyway, because
the measurement decides, not this paragraph.

**Do not diagnose from this paragraph.** The desk suspects clause 5's squircle
floor, which the neighbour clamp may no longer override, but that is **NOT
ESTABLISHED** and has been wrong twice tonight. **Measure the real cause on m. 14
first and say what it is.**

## 2. Step one, measure. Report before you change anything

For the measure Dann photographed, and for at least two other measures whose
carets sit close to a note:

- the squircle's two strokes, in system units;
- the neighbouring note's hit rectangle and its notehead ink;
- where the caret's push wanted to land, where the clamp capped it, where the
  floor forced it, and where the mark was finally drawn;
- **the room that actually exists** between the squircle's outer stroke and the
  neighbouring note's ink;
- **for the tail and head gaps: where the measure's own barlines stand**, and how
  much room there is between the last note's ink and the closing barline.

That last number decides which remedy is possible. **State it before you pick
one.**

**AND ANSWER THIS QUESTION EXPLICITLY, YES OR NO, BEFORE YOU BUILD:** on the
tight measures (m. 3, m. 4, m. 6, m. 14), is there ANY arrangement of the carets
inside the existing spacing that satisfies all of section 5 at once? If the
answer is no, say so and go to remedy 2. **Do not ship a fifth arrangement that
moves the collision to a measure Dann has not photographed yet.**

## 3. Step two, expand the loupe's spacing

**RULED BY DANN 2026-09-17, and it is the frame for everything below.** His
words: *"the spacing in the Loupe is temporary and situational, and bears not on
the paper GUI? Loupe demands expanded spacing to accommodate all the elements
without overlap."*

- **The loupe's spacing is its own.** It is temporary, situational, and it does
  not bind the page. Nothing about the printed result follows from it.
- **The loupe expands its spacing as far as it needs** to hold the stave, the
  notes, the squircle, and every caret without overlap. That is the loupe's job.
- **This supersedes the 2026-09-15 cost** recorded with the re-engraving
  permission (`OPEN.md`, THE PERMISSION HE GAVE), which said re-engraving costs
  the loupe being a guaranteed picture of the page, and that the cheaper route
  comes first. Dann has now priced that property and is not keeping it for
  spacing. **The loupe still shows truly WHAT the measure holds. It no longer
  promises the spacing between those things.**

**So: expand the held measure's spacing in the loupe, and place the carets by
section 5's position rule inside the room that gives you.** A remedy that
squeezes the carets into the page's own spacing is the one that now needs
justifying, not the other way round.

**What is still not available:** thinning or moving the squircle, which is
N.141's and ruled; hiding a caret that cannot be placed; letting any mark touch
any other.

**What must not change: the page and the print.** The page's spacing is
untouched by this work, and you say in the memo how you know that.

## 4. Constraints

- **Do not change `VocalLineEvent`.** Do not touch the squircle's geometry.
- The caret still selects the gap it names. The one-pool tap resolution stands.
- No caret inside the squircle. Clause 5's floor is not being reversed; it is
  being given the room it needs.
- No new strings.
- **Any gate that moves is named in the memo with its new number. Do not edit
  `ilya-ship.sh`.**
- House style in every comment.

## 5. Done when

Report `WRITTEN`; `DONE` is Dann's walk. **Every item below holds on EVERY
measure of the fixture, not only on the measure that exposed it.**

**The position rule, which decides most cases on its own.**

1. **Every caret stands in the middle of the space it names.** Ruled by Dann
   2026-09-17 on m. 17: *"Strange choice to make the last caret overlap the
   barline instead of planting it right in the middle of the space that preceded
   the barline, there's plenty of room there."*
   - The tail caret: midway between the last note's ink and the closing barline.
   - The head caret: midway between whatever opens the measure and the first
     note's ink.
   - An interior caret: midway between its two neighbours' ink.
   **Where the middle is free, the caret takes it and nothing else is computed.**
   The floors below apply only where it is not.

**What a caret's drawn mark never touches. No overlap and no contact, not a
smaller overlap.**

2. A notehead, a stem, a beam, a flag, an accidental, a dot, a tuplet bracket, or
   a rest glyph. (m. 14.)
3. **The squircle's stroke, on either side of it, and no caret stands between the
   squircle's two strokes.** (m. 6, both sides in one measure.)
4. **A barline, opening or closing.** (m. 3.)

**How a caret is drawn.**

5. **Whole.** Both arrowheads and the full stroke, on every caret including the
   first and the last, at every magnification, on a phone and on a desk. No
   caret is clipped by the crop. (m. 4.)

**What must not regress.**

6. Every caret's hit rectangle stays far enough from its neighbours that a tap
   resolves to the one aimed at. **Measured, not assumed.**
7. A tap on a note, a rest, and a caret each resolve as they did in `8cb9b51`.
8. You state which remedy fired, and on how many measures of the fixture.

## 6. Report back

A short memo in `docs/sessions/`, leading with **the measurement from section
2** and **which remedy fired**, then the results against section 5, then a
section on **what you could not establish**. **NOT ESTABLISHED beats a complete
invented answer.**
