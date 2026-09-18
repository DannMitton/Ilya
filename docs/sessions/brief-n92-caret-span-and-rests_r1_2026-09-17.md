# Brief: the caret inside the squircle, and the rest that has no edges

Revision 1, 2026-09-17. Written by the desk for Claude Code. Follows
`brief-n92-caret-weight_r1_2026-09-17.md`, shipped as `7e28272`.

Item: **N.92, the insert reach.** Rulings: `docs/memory/OPEN.md`, section THE
CARET, **clause 5**, ruled by Dann 2026-09-17 on his walk of `7e28272`.

## 1. What he found

Two things, on m. 6 of Without Sun song 1.

1. **A caret is drawn inside the squircle.** His words: *"The left side shows
   the caret inside the squircle (big no-no)."*
2. **A rest has a contiguous pair of carets beside it rather than one on each
   side.** His words: *"Rests are rhythmic placeholders. there should be a caret
   on either side of the rest glyph just like every other duration glyph in this
   measure. No two contiguous carets make sense. They are devices like
   parentheses, meant to contain something."*

## 2. The first: the clearance becomes a span rule

Clause 4's clearance catches a gap within 1.2 line-gaps of a squircle STROKE. A
gap whose x falls deep inside the squircle's span is within neither band, so it
stays put, inside. The squircle is wider than the note's own hit rectangle
because an accidental and the IPA row widen it (N.141), so a gap landing inside
it is ordinary.

**The rule is now the span.** A caret whose x falls anywhere between the
squircle's two strokes moves outward to 1.2 line-gaps beyond the nearer stroke.
Everything else about clause 4 stands, the clamp included: the push still stops
`hitHalf` short of a neighbouring note's centre, never at it.

## 3. The second: a rest gets the hit rectangle every other event gets

**The cause, read by the desk 2026-09-17.**
`packages/score-parser/src/staff-renderer.ts:2626-2633` draws a rest's glyph and
then `continue`s, so a rest never reaches the hit rectangle emitted at
`:2892-2898`. That rectangle spans the midpoint to the previous event's x, to
the midpoint to the next's (`prevXById`, `nextXById`). With no rectangle on
either side of a rest, the caret geometry has no edge to read there, so the two
gaps flanking the rest collapse into a contiguous pair.

**The same `continue` is why a singer cannot tap a rest at all**, although
`entry.ts:46-58` already records that a rest is a place the cursor can stand,
because slice 3 converts one back to a note.

**The work: emit a rest with the same hit rectangle every other event gets**,
carrying the rest's own `ev.id`, with the same `prevXById`/`nextXById` extent,
the same `pointer-events` and `cursor` treatment, and the same reasoning about
`highestInk` that the note branch's comment states. Do not special-case the
caret geometry to fake a rest's edges. **Fix the cause.**

**The consequence, DESK DEFAULT and named for Dann:** a tap on a rest then
selects that rest, on the page as well as in the loupe, where today it resolves
to the nearest note. That follows from his ruling that a rest is a duration
glyph like the others. **Say in your memo what else this changes**, if the page
or the loupe relies anywhere on a rest having no `data-hit`.

## 4. Constraints

- **Do not change `VocalLineEvent`**, and do not touch the squircle's own
  geometry. That is N.141's.
- The caret's behaviour is unchanged: a caret still selects the gap it names,
  and the one-pool tap resolution stands.
- **No two carets ever stand contiguous with no glyph between them.** After the
  rest's rectangle exists, that should hold by construction. If you find a case
  where it does not, report it. Do not suppress the pair.
- **Gate 5 may move.** This touches `score-parser`, whose gate is at
  `567 passed | 5 skipped (572)`. If it moves, say so in the memo with the new
  number and why. **Do not edit `ilya-ship.sh`.**
- House style in every comment.

## 5. Done when

Report `WRITTEN`; `DONE` is Dann's walk.

1. No caret's drawn mark stands anywhere between the squircle's two strokes.
2. A rest carries a caret on each side, and no two carets stand contiguous
   anywhere in the fixture.
3. A tap on a rest selects that rest, in the loupe and on the page.
4. A tap on a note, and a tap on a caret, resolve as they did in `7e28272`.
5. The five gates run, and any that moves is named in the memo with its new
   number.

## 6. Report back

A short memo in `docs/sessions/`, with the commit, the results against section
5, what the rest's new rectangle changed elsewhere, and a section on **what you
could not establish**. **NOT ESTABLISHED beats a complete invented answer.**
