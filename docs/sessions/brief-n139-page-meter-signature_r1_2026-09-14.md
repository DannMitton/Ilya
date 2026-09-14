# Brief: N.139, every meter assignment in a score draws on the page

Revision 1, 2026-09-14. Written at the desk. Build in Claude Code.

**Item:** N.139. Spec: `docs/memory/OPEN.md`, section `N.139`. Read it first.

**DO NOT START THIS WHILE N.138 IS IN FLIGHT.** N.138 is the loupe's synthesized
meter and touches `Loupe.svelte`. This item touches `staff-renderer.ts` and
`page-layout.ts`. They do not overlap, but they answer to each other, and N.138
should be walked first so its measurement is taken against today's page.

---

## The goal, in the singer's words

Dann, 2026-09-14: *"I do want every meter assignment in a score to be reproduced
faithfully."* And, bounding it: *"I agree that inserting a meter signature at the
beginning of each in the score is undesirable."*

So: the opening signature, and every change. Never repeated at a system start
that declares nothing. That is where a meter signature differs from a clef and a
key signature, which do repeat.

---

## What is established. Do not re-derive it

Read in the tree on 2026-09-14.

1. **Ilya has never drawn a meter signature, on any score.** The system head lays
   out exactly two symbols, computed backwards from `leftMargin`: the clef and
   the key signature (`staff-renderer.ts:1654-1664`). The draw calls are the clef
   at `:1684` and `:1694`, the key accidentals at `:1712-1718`. No time-signature
   draw call exists in the file.
2. The `timeSig0` to `timeSig9` glyphs at `:564` are declared for the **tacet
   count numeral**, per the comment at `:553-558`. They are not a half-built
   meter signature.
3. **The fonts carry the digits.** `FinaleMaestro.json` has bounding boxes for
   all ten, plus `timeSigCommon`, `timeSigCutCommon`, `timeSigPlus` and
   `timeSigFractionalSlash`; Bravura and Leland carry the same ten. Finale
   Maestro is the default face (`notation-fonts.ts:5-6`). Maestro and Leland ship
   no `glyphAdvanceWidths`, which costs nothing: `smufl-metadata.ts:256` derives
   `widthSp` from the bounding box.
4. **The data is there.** `types.ts:228` carries the in-effect signature on every
   measure; the change list is built at `mnx-parser.ts:411-437` and
   `musicxml-parser.ts:395-455`. `musicxml-parser.ts:454` also records
   `symbol: 'common'` or `'cut'`; the MNX path records no symbol.
5. **The head's own arithmetic cites Gould in reverse order of application**
   (`staff-renderer.ts:1640-1653`): r240 p. 42, two and a half stave-spaces from
   the last header symbol to a first note with no accidental; r236 p. 41, clef
   and key separated by one to one and a half; r81 p. 6, the clef indented into
   the stave by a stave-space or slightly less. **The book is not on this
   machine.** Do not invent a page number for the meter signature's own
   clearance. If you need one, say NOT ESTABLISHED and pick a working value,
   named as yours.

---

## The two places this touches

**One: the system head.** `staff-renderer.ts:1654-1664` computes `clefW`,
`ksCount`, `ksStep`, `ksEnd`, `ksStart`, `clefX` and `staveLeft` by laying out
backwards from `leftMargin`. A meter signature becomes a third symbol between the
key signature and the first note, so `ksEnd` moves left by the signature's width
plus its clearance, and `ksStart`, `clefX` and `staveLeft` follow.

**It draws on the first system only, and on no other system**, unless that
system's first measure declares a change.

**Two: a change inside a system.** The spacing pass at `staff-renderer.ts:1325`
reads:

    advance = columnAdvance(...) + (newMeasure ? BARLINE_ROOM : 0)

`BARLINE_ROOM` is 14 (`:135`). A measure that declares a new meter needs the
signature's width added to that advance, so the digits have room between the
barline and the first note. `:1300` and `:1321` are the two sibling advance
sites, for a tacet run opening and for the column after one; check whether either
can also open a measure that declares a change.

**THE TRAP IS SETTLED, 2026-09-14, BY READING BOTH FILES. It is not a trap, and
the instruction it becomes is the important one in this brief.**

`staff-renderer.ts:134` says `BARLINE_ROOM` is *"shared with `page-layout.ts`'s
width estimate"*. **`page-layout.ts` never references that constant.** What it
does instead is stronger: `sliceWidth` imports `layoutColumns` from the renderer
and sums the SAME columns' advances (`page-layout.ts:136-137`). Its own comment at
`:55-60` states the reason: *"The advance arithmetic is NOT mirrored here:
`layoutColumns` is imported from the renderer and produces the columns BOTH
modules walk, so the estimate and the rendering cannot drift apart at all rather
than merely failing a test when they do (N.6b-1; widened from two shared
constants to the whole walk at N.104)."*

**SO: PUT THE METER'S WIDTH INTO A COLUMN'S `advance`, INSIDE `layoutColumns`.**
Do that and the paginator sees it with no further work. Add it anywhere in the
draw loop instead and the page will break where the estimate thinks it does rather
than where the ink is, and no test will catch it.

**A SECOND RISK, FOUND WHILE CHECKING THAT, AND IT IS NOT ESTABLISHED.** The
opening signature is a HEAD symbol, not a column, so it does not pass through
`layoutColumns` at all. The head is laid out BACKWARDS from `leftMargin`
(`staff-renderer.ts:1654-1664`), and `clefX` and `staveLeft` are both clamped at
zero. `leftMargin` is 76 on the page path (`engraving.ts:35`). **Adding a third
header symbol eats into a fixed budget, and with enough accidentals in the key
signature the clef will clamp at 0 and the symbols will collide.** The desk's
rough arithmetic says two sharps still fit with room to spare, but it used
estimated glyph widths and is not a measurement. **Measure the head's total width
at 0, 4 and 7 accidentals before you ship, and if it clamps, say so rather than
letting it overlap.** `sliceWidth` starts from `leftMargin`, so a wider head does
not change the slice width and the paginator will not warn you.

---

## The DESK DEFAULTS this brief builds to

Dann may wave off any of them; `OPEN.md` wins over this file if he has.

1. **Digits always.** Never `timeSigCommon` or `timeSigCutCommon`, even where the
   MusicXML path recorded a symbol. The MNX path records none, so digits are the
   only form both paths produce identically, and Ilya is an editorial instrument.
2. **No repeat at a system start.** Opening signature and declared changes only.
3. **Count over unit**, count centred on the upper two spaces, unit on the lower
   two, in the selected notation face at the size the tacet numeral already uses
   (`numeralScale: 1` at `:559-568` calls that "the size of a time signature").
4. **The run-in is 2 stave spaces, RULED BY DANN 2026-09-14, and it is not yours
   to pick.** Gould rule 240, p. 42, gives the time signature its own row in the
   pre-first-note distance table, 2 / 1 / 1 stave spaces for a first note with
   no accidental, one, or two or more. The key signature's row is 2.5 / 1.5 / 1,
   and that is the figure N.138 first borrowed by mistake. Source:
   `memo-gould-dimensional-priors_r1_2026-08-24.md:113`. **That row is FLAGGED in
   its own memo as read from small table numerals; Dann ruled on it knowing
   that.** N.138 carries the same value in `loupe.ts`'s `METER_RUN_IN_SP`, so
   **read that constant rather than writing a second one.**
5. **The header order is sourced too**, from the same memo at `:21`, rule 176,
   p. 91: clef, then key signature, then time signature.

---

## The measurement this build owes

State your expectation BEFORE you measure, per CONTRACT's control rule, then
report against both it and your likeliest failure mode.

On the engraved Without Sun song 1, which declares 6/8 at measure 1 and 12/8 at
measure 2:

- measures per system, before and after, on every system;
- the page count, before and after;
- `staveLeft` and `clefX`, before and after, on system 1.

**Pagination WILL change.** That is named and accepted in the spec. What is not
accepted is pagination changing in a way nobody measured.

---

## Definition of done

1. The opening signature draws at the head of the first system.
2. Every declared change draws at the measure that declares it, with room between
   the barline and the first note.
3. No signature draws at a system start that declares none.
4. The pagination estimate and the renderer agree, established rather than
   assumed.
5. All five gates green. Baselines: `docs/memory/ENVIRONMENT.md` §`Gate
   baselines`. If gate 4 or 5 moves, say by how much and why. **`staff-renderer`
   is pinned by tests that assert geometry; if one fails, look at the test before
   you look at the ruling.**
6. Walked in a browser. **WRITTEN is not DONE.**

Walk it on both scores in `~/Downloads`:

- `Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`, 6/8 at
  measure 1 and 12/8 at measure 2. **This file is recorded as damaged in other
  respects (`STATE.md`); its meter declarations are not part of that damage.**
- `Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell.musx`, 2/4
  once at measure 1 and never again, across 90 measures. Expect exactly one
  signature on the whole score.

---

## What to return

A memo at `docs/sessions/memo-n139-page-meter_r1_<date>.md`:

1. What you changed, by file and line.
2. The measurement table, with your stated expectation beside each reading.
3. What you established about `BARLINE_ROOM` and `page-layout.ts`.
4. The gate results, with any baseline movement named.
5. **A section listing what you could not establish.** NOT ESTABLISHED beats a
   complete invented answer.
6. Any decision this brief did not settle, marked as yours and reversible.

**Do not commit and do not stage.** No agent writes with git.
