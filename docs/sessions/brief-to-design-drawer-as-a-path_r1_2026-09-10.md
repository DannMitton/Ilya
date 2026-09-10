# Brief to Design: the drawer as a path

**From:** Dann, via Claude (Fable), the desk. **To:** Claude (Design).
**Date:** 2026-09-10. **Revision 1.**

**This brief is self-contained. You cannot read the repository or the
project's documents, so everything you need is inline or attached. If
something you need is not here, that is a defect in this brief: say so and
stop, rather than filling the gap.**

---

## 0. Attachments

1. `drawer-front.png`: the drawer's front side (Piece, Input, Text, Score
   markup) as it ships tonight, phone width.
2. `drawer-back.png`: the calibration surface (the takeover behind Score
   markup > Voice) as it ships tonight, phone width, summary phase.
3. `drawing-calibration-surface_r1_2026-09-10.html`: the desk's drawing.
   Plate 1 is the drawer's grammar as measured from the code; Plates 2 and
   3 are the desk's redraw of the calibration summary. Treat the plates as
   a first answer to be bettered, not as a specification.
4. The current design system, standalone HTML, which Dann attaches with its
   hash. Verify the hash before you use it.

---

## 1. What Ilya is, and who is holding it

*Ilya* turns Russian poetry into singable IPA for classical singers, from
Craig Grayson's *Russian Lyric Diction* (2012). It is deterministic and
rule-based, not machine learning, and that is load-bearing for its
credibility. *Fit*, inside it, answers "does this piece suit my voice?": the
singer sings ten vowels through vocal fry, Ilya measures their first and
second resonances, and forecasts note by note how each vowel of the score
behaves for that voice. It operationalizes Mitton (2020).

The person holding it is a classical singer, often at a piano, often on a
phone, sometimes with a tremor, reading at a music stand. They are not a
technician. They want to sing the piece.

## 2. The drawer, and what it is for

Ilya has two surfaces. **The page** is the engraved paper: the score, the
IPA, the forecast. It displays and prints and carries no controls. **The
drawer** is where the singer works, and it is one column of four bands in
the order the work happens:

1. **Piece**: title, composer, poet, translator; the song list; export and
   import.
2. **Input**: the poem (typed or pasted), the score (dropped or chosen), and,
   once a score is present, the line of syllables with a count of how many
   sit under a note.
3. **Text**: the notation choices (departures from Grayson's defaults) and
   analysis.
4. **Score markup**: Corrections (the hands that fix notes and words) and
   Voice, which opens the calibration surface as a takeover of the drawer.

The calibration surface is the back side of the same drawer: a band with
Back at its left, a voice switcher, a table of ten vowels with their
measurements and a status word (Captured, Provisional, Estimated), verbs to
re-take or sing, and Finish.

## 3. The problem, in the singer's words

Dann, 2026-09-10: *"It is a complex tool that needs to feel simple and
intuitive to use. We are not there yet."* The measure he sets is the
singer's **confidence**: at every step, knowing it worked before moving on. And: *"consistent where helpful,
and purposefully drawing the user's attention to the linear progress they
will want to follow."* And of the calibration surface: *"convey the illusion
that this is a seamless tool that is reliably curated by its organization."*

What a singer meets today: every band looks equally open and equally urgent;
two filled buttons compete (Transcribe and fit in sage, Re-calibrate in
lavender); the calibration surface centres what the front side sets flush
left, labels stations in small caps where the front side uses sentence
case, wears ten identical Re-take pills, and replaces the whole table with a
capture screen when one vowel is re-taken, so the singer loses their place.

## 4. The thesis the desk proposes, from the singer's chair

**The drawer is a path, top to bottom, and it should read as one.** Three
rules, none of which adds an element:

1. **Every stage states its state**, in one quiet line, open or collapsed:
   "Without Sun, no. 1 · Mussorgsky"; "8 lines · 37 words · score loaded";
   "Grayson defaults"; "37 / 94 placed · Voice: Dann, 7 of 10". A singer
   scanning down reads the whole job in four lines and knows where they
   stopped.
2. **Exactly one thing is next, and only it is filled.** The filled button
   belongs to whichever stage is next; a stage that is done downgrades its
   verb to outline. Before a poem: nothing filled. Poem in: Transcribe and
   fit. Score in, syllables waiting: nothing filled, the count is the work.
   Placed, no voice: Calibrate. Voice captured: nothing filled; the drawer
   is at rest.
3. **Done goes quiet; the singer's own content stays black.** Controls that
   have done their job drop to outline or text; the poem, the placed
   syllables, the measured vowels stay in primary ink.

And for the calibration surface: it is the interior of the Voice stage, not
a different tool. Same left edge, same rows, same pills, one filled verb.
The lavender capture surface (the fry guide and its bar) is a landmark the
singer likes; it should open in place under the row they pressed, with the
rest of the table dimmed, and fold when the vowel is done, so the table
never leaves.

**What we are asking you** is not to ratify this but to better it: bring
the most current, well-evidenced patterns for showing linear progress and
state in a single-column tool, on a phone first, without a stepper and
without adding chrome, and say where the desk's three rules are naive.

## 4b. The two sets of words, ruled by Dann 2026-09-10

The singer's confusion with the highest cost: a poem they typed and a score
that arrived with its own words, and nothing saying which Ilya uses. The
rule, in one sentence: **the singer is never surprised by which words end up
under the notes.** Ruled, and to be designed against, not re-opened:

- A score that arrives with words when the poem box is empty puts its words
  INTO the box, and the poem's receipt reads "from score", exactly as the
  Piece fields already do for title and composer. Edit and the mark goes.
  No question is asked. A singer's own words are never overwritten.
- When both exist, the syllable line under the poem is the whole statement:
  these are your words, placed under your score, with a count. No sentence
  beside it.
- No reporting of differences between the poem and the file's words, ever.
  Ilya is not a critical edition; it removes a barrier.
- When a score arrives after the poem, the line appears and the page
  updates. Silent. No narration of what the singer can see.

## 4c. The moment the score arrives: an open design question for you

This is the moment Dann most wants your eye on, because he suspects the
field has devices for it that we have not thought of.

The singer has a transcribed poem. They drop a score. Underneath, Ilya
already seats their syllables under the notes at once (a "first pass"), one
syllable per note, and the singer then corrects it with the hands in
Corrections: shift, melisma, place, undo. On a melismatic song the first
pass runs ahead of the music, so the correction is real work. The desk's
current proposal: seat automatically and immediately; show the truth as a
count and as grey (unplaced) versus black (placed) syllables in the line
under the poem; and, when the score arrived with its own underlay, seat the
singer's words onto the file's syllable slots rather than onto every note,
so the engraving's melismas and word breaks are inherited and the to-do
list shrinks to the places where poem and engraving differ in shape.

What we ask you, from the singer's chair and against the principles in §5:

1. Is "it happens the moment you drop the file, and here is what is left to
   do" the right feeling, or is there a better-evidenced pattern for a
   join that will need touching up? A staged reveal? A first look that
   invites correction rather than presenting a result? Something the
   singer can accept or adjust in one gesture?
2. How should the page and the drawer show a join that is partly done,
   without a mark on every note (forbidden) and without narration? What is
   the modern vocabulary for "this part is yours to finish"?
3. Where should the singer's attention land immediately after the drop:
   the page (their words under the notes), the line under the poem (the
   count), or the first bare note? Only one of these can be first.
4. The hands that fix a join are in a station two bands below the poem.
   Is that the right distance, or does the correcting surface belong
   beside the thing it corrects while a join is fresh?
5. Anything in this flow you would remove.

Constraints that stand: Ilya never invents a melisma of its own (a note it
leaves bare is left bare, not marked); the singer's words are never
overwritten; nothing derived is stored; the page carries no control.

## 5. What may not be re-decided

These are ruled and are not on the table. Design against them.

- **Drawer manipulates; page displays and prints.** No control on the paper.
- **Calm Authority governs** (the palette and the philosophy are in the
  attached design system): restraint, coherence, respect for the singer's
  attention; a scholarly environment that invites sustained attention.
- **Three radii, no fourth**: 0 for paper, small for controls, full-round
  for pills. Nothing floats over the paper.
- **One accent per surface.** Hue names place (each band has its hue); ink
  names state.
- **Colour never carries alone** (WCAG 1.4.1). Every status also has a word.
- **Touch geometry**: every control presents 44 × 44 px on a coarse
  pointer; two named exemptions exist and you may not create a third.
- **One term, one control, one meaning, forever.** Do not rename anything
  that has a name. Strings that exist are ratified in English and French;
  **do not write French**; mark every new English string as new so Dann can
  rule on it and see the French before it ships.
- **No mark that appears on everything.** A progress mark on every row says
  nothing.
- **Nothing derived is stored**; the drawer shows state, it does not keep a
  second copy of it.
- **Parity between desktop and phone wherever it can be had.** Dann,
  2026-09-10: *"we are trying to achieve parity between desktop and mobile
  where we can. Divergence is acceptable to comply with mobile
  limitations."* The drawer is one reflowing implementation, identical in
  content, order, naming, gesture, and state from roughly 390 to 560 px and
  on the desk; geometry answers the pointer, not the width. Diverge only
  where the phone cannot do what the desk does, and name each divergence.
- The grammar in the drawing's Plate 1 is measured from the code and is the
  starting point; propose changes to it as changes, with reasons.

## 6. What we want back

Mockups, in the attached design system's tokens, of:

1. The front side of the drawer in three states: empty, mid-work (poem and
   score in, syllables half placed), and at rest (everything done). Phone
   width first, desk second. Show where the one filled button is in each,
   and what each band's state line reads.
2. The calibration summary, redrawn to the same grammar, with the capture
   surface open under a pressed row.
3. One page of reasoning: which current patterns you drew on and why they
   suit a singer at a music stand; where the desk's three rules are wrong
   or naive; anything in §5 you believe is costing the singer, stated as a
   cost and left unbuilt.

4. **A walkthrough, before any mockup.** Sit in the singer's chair and walk
   the whole path virtually, three sessions: the first evening (a poem,
   nothing else), the second (the score arrives, the words are joined and
   touched up), the third (the voice is calibrated and the page is sung
   from). At every step write what the singer sees, what they press, and
   **how they know they did the right thing before they move on.** That
   last clause is the measure this brief is written for: Dann's word is
   *confidence*. A singer who has to wonder whether it worked has been
   failed at that step, and the walkthrough is where you find those steps.
   Where a step has no honest answer, say so; do not invent one. The
   mockups in 1 and 2 are then drawn from the walkthrough, not the other
   way round.

A section headed **What I could not establish**, listing everything you
assumed. **NOT ESTABLISHED beats a complete invented answer.**

Do not write code. Do not change strings. Do not draw the page; only the
drawer.
