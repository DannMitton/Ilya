# Brief: N.104, the page shows every bar the singer counts

For Claude Code, pointed at `~/Desktop/ilya-rewrite`. Numbered by Dann
2026-08-27. Written by the desk the same night. Floor: the tip of `Shane`
after the slice 4 polish run; ask Dann for the state, and do not run git.

## The ruling, in Dann's words

"We absolutely must represent measures without voice content with a single
rest and a number overtop of it saying how many measures are tacet for
voice."

And, on what that resolves: "If the measure reporting is correct and there
is a missing (voiceless) measure, it must be visible with a count above
it."

## What is already established. Do not re-measure it

Measured by Code 2026-08-27 (`memo-mobile-slice4_r1_2026-08-27.md` §26),
on the engraved Without Sun song 1:

- The vocal part's `<measure number="1">` carries **0 notes, 0 rests, 0
  lyrics**. The piano's measure 1 carries **5 notes**. It is a genuine
  piano-only bar.
- The page **omits it**: hit ids run `m1` to `m17`, there is no `m0`, and
  the first system draws its first note at x=56.
- The loupe's measure tag copies the source's own number
  (`musicxml-parser.ts:599`, read at `+page.svelte:1102`), so **the tag is
  faithful and the page is short one bar.** Dann found this by selecting
  the visibly second bar and reading `m. 3`.
- **Gould holds nothing usable here.** The priors memo, its own line 220:
  rest geometry, pages 34 to 38, was never photographed, so no dimensional
  prior exists for a rest of any kind, multibar rests included.

## What to build

**Every measure of the vocal part appears on the page**, whether or not the
singer sings in it. A run of consecutive silent measures is drawn as ONE
consolidated multibar rest carrying the count of measures above it. A
single silent measure is drawn as a whole-measure rest, by convention,
with no numeral; say so in the memo if you conclude otherwise, with your
reason.

The measure numbering then agrees with the page by construction. Do NOT
renumber the tag: it is already faithful, and completing the page is the
ruled fix.

**The count is the number of measures tacet**, sitting above the staff,
centred over the consolidated rest.

## The geometry, and how to decide it honestly

Gould gives us nothing here, so:

1. State that plainly in the memo, citing the priors memo's line 220 as
   Code did in §26.
2. Take the dimensions from **engraving convention**, and record them as
   convention, in a named constant with a comment saying exactly that, the
   way the tie's taper is recorded as Dann's eye rather than as Gould. If
   the source is ever photographed, these are the numbers to check.
3. Where the font supplies a glyph, prefer it to invented geometry:
   check the SMuFL registry for `restHBar`, `restHBarLeft`,
   `restHBarRight`, and the multi-numeral digits, and report what Finale
   Maestro actually carries, the way §24 reported that no composable tie
   glyph exists among its 2,728 names.
4. Bring Dann a **rendered comparison** of two or three weights before
   settling anything he would notice: the bar's thickness and length, the
   numeral's size, and its clearance above the staff. He rules from
   drawings, not from prose.

## Consequences to face, not to bury

- **Spacing.** A multibar rest occupies horizontal space. Say what it does
  to system breaking and to the page count, and whether any ruled figure
  moves (`PAGE 1 OF n`, the loupe's ink band, the tag's arithmetic).
- **The system-index scale.** §26 recorded that the first system declares
  `data-system="0-3"` while drawing source indices 1 to 4, so the loupe's
  `systemIndexOf` compares two scales differing by the omitted bar. It
  reads correctly today by accident of that offset. **Re-check it once the
  page draws every measure**, and report what it reads before and after.
- **The correction surface.** A tacet run is not an entry. Establish what
  the stepper does when it reaches one, what the tap band does over it,
  and what the readout says. Propose, do not decide: this is Dann's.
- **The page read path.** The Lamm page read has no piano part at all, so
  a scan-derived score should be unaffected. Confirm that rather than
  assume it, and say what its first three measures read before and after.
- **Print.** The paper must carry the same bars as the screen. Confirm it.

## Constraints

The standing set: the renderer stays the one renderer; nothing lands on
the paper as a control; `VocalLineEvent` is not changed and nothing in
`apps/web/src/lib/shane/reconciliation/` is rebuilt; the loupe still
filters analysis overlays and still shows engraving only; five gates at
baseline, and any move disclosed rather than slipped, with
`ilya-ship.sh:79-80` flagged for the desk rather than edited; no commits,
no ship.

## Strings

New strings are likely (an accessible name for the multibar rest, perhaps
a readout phrase). Full table in the memo, English and French side by
side, coined marked against adopted, for Dann's eye before any ship. Do
not invent French beyond the table.

## Verification

On the engraved Without Sun song 1: the page shows the piano-only bar as a
rest, the singer's second sung bar reads `m. 3` in the tag and is visibly
the third bar on the page, and the two agree. Then a score with a longer
tacet run, hand-built if none exists, so the numeral is exercised beyond 1.
Then the Lamm page read, unchanged. Both orientations and the desk. State
your expectation before each measurement and name your likeliest failure
mode.

## Return memo format

`docs/sessions/memo-n104-tacet_r1_<ISO date>.md`: what the font carries,
the geometry you chose and the convention you took it from, what changed
with `path:line`, the strings table, the consequences above each answered,
what you looked at with your own eyes, gate results, and "Not
established". NOT ESTABLISHED beats a complete invented answer.
