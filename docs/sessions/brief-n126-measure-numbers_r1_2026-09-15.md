# Brief: N.126, measure numbers on Score markup

Revision 1, 2026-09-15. Written at the desk. Build in Claude Code.

**Item:** N.126, ruled by Dann 2026-09-11 at 00:40, UNPLACED since. The ruling is
in `docs/memory/STATE.md`, §RULINGS DANN OWES, under "New from N.104".

**Read these two first, in this order.** They contain every decision, and this
brief only orders them.

1. `docs/sessions/gould-bar-numbers-p484_2026-08-29.md`, **read in full.** Gould
   p. 484, photographed by Dann and read whole. It is the source for placement,
   which bars, the unlabelled first bar, and italic.
2. `docs/sessions/drawing-bar-numbers_r1_2026-08-29.html`, the drawing Dann ruled
   from. **It is 1.1 MB; open it in a browser rather than reading it as text.**

---

## Why now, in Dann's words

2026-09-15: *"We need to apply measure numbers finally. We have gone long enough
without them but they are necessary for locating measures in exactly this way."*

**"In exactly this way" is the loupe's own tag**, which reads `m. 15 · system 7
of 8`. The loupe can already name the measure it holds. **The page cannot.** So a
singer told "look at bar 15" has no way to find it by eye. That is what this
closes.

---

## What is already ruled. Do not re-decide any of it

| | value | source |
|---|---|---|
| **Which bars** | **The first measure of every system.** Never every five or ten | Gould p484-c, and Dann 2026-08-29 |
| **The first bar of the piece** | **NO number.** The first system of page 1 carries none | Gould p484-a; **Dann ruled the amendment the same day** it was found |
| **Placement** | At the system's start, **above the clef** | Gould p484-c, which sharpens Dann's "above the staff" |
| **Style** | **Italic** | Gould p484-d, and Dann's own habit |
| **Weight** | Regular | Dann 2026-09-11 |
| **Size** | **The lyric underlay's point size** | Dann 2026-09-11 |
| **Clearance** | **1.0 stave-space** above the stave | DESK DEFAULT, the middle of the drawing's 0.6 / 1.0 / 1.4, ruled by Dann |
| **Bare** | **Never parenthesized, never boxed, never circled** | Dann 2026-09-11 |

**Dann's reason for bare, and it governs the whole mark's character:** *"to orient
collaborating musicians quickly, not to trumpet our editorial decision."*

**Gould forbids every-fifth-bar numbering in her own words**, p484-c: *"To number
every five or ten bars gives these bars an apparent significance that they do not
have, and should be avoided."* **Do not offer it as an option.**

---

## The data. Nothing needs parsing

`Measure.number` already holds it, **verbatim from the source's own
`<measure number>` attribute and kept as a STRING** so a pickup can be `0`, empty,
or `X` (`types.ts:215-225`).

**Print what the publisher printed.** Gould says the first complete bar is bar 1
and an up-beat is not; where a publisher disagrees, **Gould disagrees with the
publisher, not with Ilya**. That is recorded in the source memo and there is
nothing to build for it.

**A system knows where it starts.** `paginateScore` slices by measure range and
the renderer already takes a `measureOffset`. Read the first measure of the slice
and take its `number`.

---

## THREE DESK DEFAULTS. Gould supplies no dimension on this page

Her own closing line is that every dimension here is convention. These three are
the desk's, marked as such, and Dann can overturn any of them on the walk.

1. **Ink: `#3a352f`, the stave's ink.** Sourced from the tree rather than
   invented: the tacet count numeral, the only other numeral above this stave,
   draws with exactly that fill (`staff-renderer.ts`, the tacet block). Two
   numerals above one stave in two different greys would need a reason.
2. **Horizontal anchor: the stave's left edge**, `staveLeft`, which is where the
   system begins. Gould says "above the clef"; the clef is indented into the stave
   by about a stave-space, so the left edge and the clef's left edge are within one
   space of each other. **If it reads as hanging left of the system, move it to the
   clef's own left edge and say so.**
3. **It prints.** The bar number is engraving furniture, not a screen affordance.
   The selection ring is hidden under `@media print` and this is not that.

---

## THE POST-REST COURTESY NUMBER

**Dann ruled one on 2026-08-29:** a number on the measure after a multibar rest,
when that measure lands mid-system. He named it *"a useful courtesy"*, his word.

**Gould does not say this**, and her objection to every-fifth-bar numbering could
be read against it. **The reading that lets both stand, recorded in the source
memo:** Gould objects to lending *arbitrary* bars a significance they lack, and
the bar a singer re-enters on after counting rests is not arbitrary. **The desk
asserts post-rest numbering as ordinary practice in parts and cannot cite it to
any source this project holds.** Build it as Dann's ruling, not as Gould's.

**Anchor: the closing barline of the rest.** DESK DEFAULT, explained to Dann and
not waved off.

**IT TAKES SQUARE BRACKETS. RULED BY DANN 2026-09-15**, correcting the desk's
reading that "bare, never parenthesized" covered both kinds. His words: *"the
post-rest courtesy number should be parenthesized in square brackets. It's my
understanding that square brackets in a musical score means 'this is
editorial'."*

**So the two rules are consistent, not in tension.**

| | mark | why |
|---|---|---|
| system-start number | **bare** | standard practice; every engraver prints it, so it declares nothing |
| post-rest courtesy number | **`[15]`, square brackets** | Ilya's own addition. Gould does not prescribe it and the desk could not cite it to any source this project holds, so it declares its provenance |

**Dann's 2026-09-11 reason survives intact.** What he objected to was decorating a
number every engraver prints anyway: *"to orient collaborating musicians quickly,
not to trumpet our editorial decision."*

**CONTRACT §6 DOES NOT REACH THIS, and the reason is recorded so nobody cites it
here.** §6 forbids a mark that says Ilya is unsure, and warns that a mark on
everything says nothing. **Square brackets are a PROVENANCE mark, not an
uncertainty mark**, and they appear only on courtesy numbers, never on the
system-start ones.

**The brackets are TEXT in the same italic face as the numeral**, not SMuFL
glyphs. Ilya's round parentheses are spoken for: `accidentalParensLeft` and
`accidentalParensRight` bracket a courtesy ACCIDENTAL
(`staff-renderer.ts:2221-2223`). **Square for editorial, round for courtesy
accidentals, and the two never mean the same thing.**

---

## ONE COLLISION TO CHECK BEFORE YOU SHIP

**The tacet numeral already occupies the space above the stave.** It draws at
`staffTop - sp(0.9)` and is centred over its run; a bar number at 1.0 stave-space
sits just above that height. **On a system that OPENS with a tacet run, the two
numerals are on nearly the same line**, one at the left edge and one centred over
the run.

**T05 has tacet runs opening systems 5 and 7** (its m. 37 and m. 57 carry opening
rests, measured on 2026-09-15). **Look at those two.** If the numbers crowd, say
so with the measurement rather than nudging a constant quietly.

---

## What NOT to do

- **No frame.** Gould forbids boxes and circles only where rehearsal figures are
  present, and Ilya has none, so a frame is not forbidden. **Nothing argues for
  one and Dann ruled bare.**
- **Do not use the SMuFL time-signature digits.** Those are the notation face and
  are spoken for: the tacet count uses them upright, and if rehearsal marks ever
  arrive they take the same face in bold (Gould p484-f). **A bar number is text in
  the underlay's face, italic.**
- **No French is owed.** The mark is a bare numeral with no label, so nothing here
  needs translating and Dann should not be asked for a string.

---

## Definition of done

1. Every system except the first of the piece carries its first measure's number,
   italic, at the underlay's point size, 1.0 stave-space above the stave, at the
   system's left edge.
2. The first system of the piece carries none.
3. A measure following a multibar rest mid-system carries its number, anchored to
   the closing barline of the rest.
4. No number is parenthesized, boxed, or circled.
5. The tacet numeral and a system-start bar number do not crowd each other on
   T05's systems 5 and 7, or the crowding is measured and reported.
6. It prints.
7. All five gates green. Baselines: `docs/memory/ENVIRONMENT.md` §`Gate baselines`.
   **`staff-renderer` is pinned by tests that assert geometry and element order;
   if one fails, look at the test before you look at the ruling**, which is what
   N.133 found.
8. Walked in a browser on both scores. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-n126-measure-numbers_r1_<date>.md`:

1. What you changed, by file and line.
2. The tacet-collision measurement, with your expectation stated before it.
3. Whether the page count moved on either score. A numeral above the stave raises
   the system's highest ink, which feeds the crop and the pagination.
4. The gate results, with any baseline movement named.
5. **A section listing what you could not establish.** NOT ESTABLISHED beats a
   complete invented answer.
6. Any decision this brief did not settle, marked as yours and reversible.

**Do not commit and do not stage.** No agent writes with git.
