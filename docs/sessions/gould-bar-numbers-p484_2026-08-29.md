# Gould p. 484, Bar numbers. The gap the priors memo named, now closed

**Instrument: a photograph of the page, taken by Dann 2026-08-29 and read in
full by the desk the same day.** Not a snippet, not a summary. The section is
complete in the photograph: it opens under the Page numbers paragraphs and
closes at the parenthetical cross-reference, and the Rehearsal marks heading
that follows it is also captured.

**Why this file exists.** `memo-gould-dimensional-priors_r1_2026-08-24.md`
carried one bar-number line, r178 p.490, with an empty dimension column, and
`gould-vocal-engraving-rules_v7` records at r213 that "Bar numbers, p. 484" is
"outside this extraction's photographed range". Every bar-number question this
project asked before today was therefore answered NOT ESTABLISHED. It is
established now.

**The rule labels below are the desk's own**, `p484-a` to `p484-f`, because
this page was never in the numbered extraction and inventing numbers in that
sequence would collide with it.

---

## The rules, verbatim

**p484-a.** [bar numbers, purpose] "Bar numbers provide an invaluable
reference point in a piece that has separate instrumental parts. They are also
a useful guide when preparing the performance material: to check that all
material contains the same number of bars, and that rehearsal letters or
figures (if used) are placed in the same bars in all parts. The first complete
bar (and not an up-beat) is bar 1. The first bar of a piece (or movement) is
not labelled."

*Fit:* **SOURCED, and two clauses bite.** "The first bar of a piece (or
movement) is not labelled" means the first system's first measure takes NO
number, which amends Dann's ruling of 2026-08-29 as he first gave it. **He
ruled the amendment in the same day: the first system's first measure takes no
number.** "The first
complete bar (and not an up-beat) is bar 1" is the source's business rather
than Ilya's: `Measure.number` (`types.ts:215-225`) is copied verbatim from the
source's own `<measure number>` attribute, kept as a string so a pickup can be
`0`, empty, or `X`. Where a publisher numbers its up-beat as bar 1, Ilya
prints what the publisher printed and Gould disagrees with the publisher, not
with Ilya. Recorded, nothing to build.

**p484-b.** [bar numbers, when not to] "Bar numbers should not be used in
music in which individual performers have different numbers of bars or where
barlines do not coincide (see *Non-coinciding bar lengths*, p. 175). Instead,
use rehearsal marks at points where players co-ordinate."

*Fit:* SOURCED, and not applicable. Ilya draws one vocal line.

**p484-c.** [bar numbers, placement] "Place bar numbers at the beginning of
each system, ideally above the clef of the top stave. To number every five or
ten bars gives these bars an apparent significance that they do not have, and
should be avoided."

*Fit:* **SOURCED, and it is Dann's ruling in Gould's own words.** It also
sharpens "above the staff" to **above the clef**, at the system's left edge.
Ilya has one stave, so "the top stave" is the stave.

**DESK READING, not Gould's words, on the post-rest number.** Dann also ruled
a number on the measure after a multibar rest when it lands mid-system. Gould
does not say that, and the second sentence of p484-c could be read against it.
The reading that lets both stand: Gould's objection to every-fifth-bar
numbering is that it lends *arbitrary* bars a significance they do not have,
and the bar a singer re-enters on after counting rests is not arbitrary. The
objection does not reach it. Placing a number after a multibar rest is also
ordinary practice in parts, which the desk asserts as convention and **cannot
cite to any source this project holds.**

**Dann named it 2026-08-29: it is "a useful courtesy."** His word, adopted
rather than coined, and it places the mark in a family this project already
has: N.102's courtesy accidentals, and the courtesy natural observed on
N.97b's walk. A courtesy mark restates what a reader would otherwise have to
carry. **That framing bears on how it is drawn**, because the courtesy
accidental's convention is a parenthesis, and r178 p.490 already parenthesizes
a continuation system's bar number for a related reason. Not ruled. The
drawing offers both.

**p484-d.** [bar numbers, typography] "It is best to use italic to
differentiate bar numbers from roman-type page numbers, since both are likely
to be in close proximity on left-hand pages."

*Fit:* **SOURCED. Gould argues FOR italic**, which is what Dann said he had
traditionally seen. **One honest qualification on the reason rather than the
rule:** Gould's stated reason is proximity to a roman-type page number, and she
places page numbers "clear of the notation, ideally at the top outside edge"
(same page, the paragraph above this section). Ilya's page number is roman
(upright, `var(--font-sans)`, 9.5pt, all-small-caps,
`PageFooter.svelte:235-241`) but sits in the FOOTER, bottom right, so the
proximity Gould names does not occur on Ilya's paper. The rule holds as
convention; its stated cause does not apply here.

**p484-e.** [bar numbers, framing] "Bar numbers should not be framed in boxes
or circles where rehearsal figures are also present, or else the two will be
confused."

*Fit:* SOURCED, conditional, and inert. Ilya has no rehearsal figures, so a
frame is not forbidden. Nothing argues for one either.

**p484-f.** [rehearsal marks, typography] "Place rehearsal letters or figures
in conspicuous non-italic bold type, to differentiate them from bar numbers.
Many editions use the roman bold time-signature typeface."

*Fit:* SOURCED, and worth keeping even though Ilya has no rehearsal marks.
**It spoken-for the notation-digit face.** The tacet count added by N.104 uses
the SMuFL time-signature digits (`DIGIT_SMUFL`, `staff-renderer.ts:348-352`),
upright, which is SMuFL's own supply for a multibar rest's numeral. If
rehearsal marks ever arrive in Ilya they want that same face in bold, so the
three numbers above the stave would then be: bar number italic, tacet count
upright notation digits, rehearsal mark bold notation digits.

**Cross-references Gould gives and this project has not read:** bar numbering
with repeat sections, *Bar numbers*, p. 237; with Da Capo and Dal Segno
layouts, *Bar numbers*, p. 240. **p. 237 IS in the photographed range** and is
extracted as r213 in `gould-vocal-engraving-rules_v7`. **p. 240 is r226**, also
extracted, with its own recorded caveat that the sentence is cut off at the
foot of the page.

---

## What this closes, and what it does not

**Closed:** whether Gould speaks to bar-number typography (yes, italic),
placement (system start, above the clef), which bars (every system, not every
five or ten), the first bar of a piece (unlabelled), and framing (not where
rehearsal figures are present).

**NOT ESTABLISHED, still:** every dimension. Gould gives no size, no weight,
no clearance, and no horizontal offset for a bar number on this page. **The
numbers remain convention**, recorded as convention the way `TACET_REST` is.
