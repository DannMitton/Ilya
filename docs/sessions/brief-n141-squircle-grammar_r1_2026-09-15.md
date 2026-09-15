# Brief: N.141, the squircle's grammar

Revision 1, 2026-09-15. Written at the desk. Build in Claude Code.

**Item:** N.141. Spec: `docs/memory/OPEN.md`, section `N.141`. **Read it first and
in full.** Every rule in it is Dann's, quoted and dated, and this brief only
orders the work.

---

## The goal, in the singer's words

Dann, 2026-09-14, on the walk of `d6580af`: *"The lavender squircles need a
consistent grammar. Sometimes they capture the IPA syllable with their note,
sometimes they don't. Sometimes the squircle is trimmed inside the measure region,
sometimes it isn't. Accidentals belonging to the note under examination must never
collide with the squircle."*

The mark says "this is the note you are working on". Today it says it four
different ways on four measures of one song.

---

## The four ruled rules

1. **The bottom is the IPA baseline, always**, whether or not a syllable is
   printed under that note. On a melisma it still descends, *"as if there were a
   verbatim vowel printed there"*. **The Cyrillic row stays outside**, ruled
   explicitly.
2. **Never truncated.** A fully closed shape, every time, on both surfaces.
3. **The taken note's own accidental and dot must never collide with it.** Note
   the scope: his words are *"Accidentals belonging to the note under
   examination"*. **A beam may be bisected**, ruled: *"a beam is acceptable for the
   circle to bisect. Of course."* So what must stay clear is what sits BESIDE the
   note and competes for horizontal space; what runs through it, stave lines,
   beams, ties, may be crossed.
4. **The top** encloses the notehead, its accidental, its dot, and its own stem.

**The shape is IDENTICAL on the page and in the loupe**, ruled 2026-09-14. Only
the permission differs: **the loupe may re-space the music to clear a collision;
the page NEVER may.** On the page a collision with a neighbour is accepted, and
his words for why are *"the priority is the preservation and focus on the selected
note, so its adjacent siblings accept subordinate treatment as adjacent to the
primary note under examination"*.

---

## Build it in this order. The first step may be the whole job

**STEP 1, GEOMETRY ONLY. Change the one mark, and change nothing else.**

The ring is created at `VoiceProfilePane.svelte:502`, inserted at `:536` through
`afterGround`, swept at `:389`, and styled at `:1320`, `:1329` and `:1333`. The
loupe shows the page's ring because its head, carry and body slices all render the
same clone, `frame.inner` (`Loupe.svelte:1231`, `:1281`, `:1294`).

So one geometry change reaches both surfaces at once:

- extend the bottom to the IPA baseline, constant for every note on the system;
- size the box to contain the taken note's own accidental and dot with clearance;
- keep it a closed shape;
- **REMOVE THE HEIGHT FLOOR.** `RING_ASPECT = 2.5` at `VoiceProfilePane.svelte:340`
  is applied at `:472` as `height = max(inkHeight + padding, width * RING_ASPECT)`.
  **Ruled out by Dann 2026-09-15**, because it makes height follow width while the
  new grammar makes height follow position, and the two cannot both hold. It is
  what made m. 7's box tower over an empty stave. **The portrait feel survives as
  a minimum WIDTH, which `RING_MIN_W` at `:338` already gives.** Read `OPEN.md`
  §N.141 for the full account before you touch either constant.

**Because the bottom is a constant baseline and the top is bounded by the stave,
every squircle on a system comes out the SAME HEIGHT.** A uniform object is far
easier to keep closed than one that changes with its contents. Use that.

**MEASURE WHETHER STEP 1 IS SUFFICIENT BEFORE BUILDING ANYTHING ELSE.** On the
engraved Without Sun song 1 and on Kabalevsky T05, for every note the loupe can
raise on, ask: does the widened box clear the taken note's own accidental, and does
it stay inside the loupe's body crop? **Report the count of notes where it does
not.** If that count is zero, N.141 is done and steps 2 and 3 are not built.

**STEP 2, ONLY IF STEP 1 LEAVES COLLISIONS.** Split the mark. The loupe draws its
own squircle and the page's ring is kept out of the loupe's clone. The loupe
already draws its own meter and tail slices (`Loupe.svelte:1239`, `:1301`), so a
loupe-owned mark is in keeping rather than novel.

**STEP 3, ONLY IF STEP 2 STILL LEAVES COLLISIONS, AND SAY SO BEFORE YOU START
IT.** Re-space the measure in the loupe. **Understand what this costs before
proposing it:** the loupe's body is a CROP of the page's SVG, not a render, so
re-spacing means calling the renderer for the held measure alone. That buys the
room and it costs the property that the loupe is a guaranteed picture of the page.
For an editorial instrument that is a real loss: what the singer examines would no
longer be exactly what prints. **Dann gave this permission with the words "if
necessary". Treat "necessary" as something you demonstrate with the step 1
measurement, not something you assume.**

---

## What NOT to do

- **Do not give the neighbours a visual treatment.** His phrase "subordinate
  treatment" was a rephrasing of "recede", and the spec records the desk's reading
  that it describes the existing drawing rather than authorizing dimming, greying
  or shrinking. A mark on every unselected note would run into CONTRACT §6's rule
  against a mark that appears on everything.
- **Do not re-space the page.** Never, on any step.
- **Do not widen the box to clear a NEIGHBOUR'S accidental on the page.** That
  collision is accepted, ruled.

---

## Definition of done

1. Every squircle on a system is the same height and reaches the IPA baseline.
2. No squircle is truncated on either surface.
3. No taken note's own accidental or dot touches its squircle.
4. The Cyrillic row is outside it.
5. A beam may pass through it; that is not a defect.
6. All five gates green. Baselines: `docs/memory/ENVIRONMENT.md` §`Gate baselines`.
7. Walked in a browser, on both scores. **WRITTEN is not DONE.**

**On verification: you may not need a screenshot for the collision questions.**
`ENVIRONMENT.md` §`YOU DO NOT NEED A PIXEL` sets out when DOM geometry settles a
question and when it does not. Bounding boxes and overlap are DOM readings.
Whether the shape reads as closed and balanced to a human is not, and that one is
Dann's eye on the walk.

---

## What to return

A memo at `docs/sessions/memo-n141-squircle_r1_<date>.md`:

1. What you changed, by file and line.
2. **The step 1 measurement, with the count of remaining collisions**, and your
   expectation stated before you took it.
3. Whether steps 2 and 3 were needed, and the evidence that made them necessary.
4. The gate results, with any baseline movement named.
5. **A section listing what you could not establish.** NOT ESTABLISHED beats a
   complete invented answer.
6. Any decision this brief did not settle, marked as yours and reversible.

**Do not commit and do not stage.** No agent writes with git.
