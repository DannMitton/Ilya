# Brief: mobile slice 3, the entry grammar

For Claude Code, pointed at `~/Desktop/ilya-rewrite`. Serves the mobile
correction track (N.92 and N.93 territory), third of four slices. Written
by the desk 2026-08-26. Floor: `d9d1191` (slice 2 whole, walked by Dann).

## The design this builds

The r2 schematic's §4 (the insertion bar in a gap) and §3 (the tuplet
definition row), with Dann's rulings of 2026-08-26: the definition grammar
only, no quick count row; a freshly entered note arrives at the previous
entry's pitch and the pitch verbs finish it, middle line where no previous
entry exists; « Nolet » ratified. Read
`docs/sessions/design-mobile-correction_r2_2026-08-25.html` §3 and §4 and
`docs/sessions/memo-mobile-slice2_r3_2026-08-26.md` before code.

## What to build

**The bar stands in a gap.** The stepper and loupe taps can place the
insertion bar between entries, before the first, and after the last. The
readout names the place, the schematic's own sentence: "gap after %s, the
next duration enters here." In a gap the DURATION row stays fully lit and
acts; verbs that need a note read disabled.

**Entry, Speedy's grammar under touch.** With the bar in a gap: tapping a
duration enters a NOTE of that duration at the previous entry's pitch (the
ruled arrival; middle line when the part has no previous entry), selects
it, and the pitch verbs finish it. Tapping Rest in a gap enters a REST of
the lit duration. On an existing note, Rest converts note to rest;
on a rest, it converts back to a note at the ruled arrival pitch. Delete
in a gap does nothing.

**Tie.** On a selected note, Tie toggles a tie to the following entry.
Disabled whenever the following entry cannot legally take it (a rest, a
different pitch, the end of the part). The renderer's existing tie drawing
carries it; engraving answers to Gould.

**The Nolet row.** Tapping `Nolet` swaps the DURATION station in place for
one definition row, the label gaining a back chevron; nothing opens over
anything and nothing is modal. The row reads as the ratified sentence:
count, "of", duration, "in the space of", count, "of", duration. Counts 2
through 9 by stacked triangle pairs, each pair two 44 px targets; each
duration box steps its own five-value ladder on tap. The definition
applies LIVE to the selection, no confirm: the selected entry and the
following entries of matching total duration become the defined group, and
the page re-engraves under the loupe. The last definition persists as the
session default (Finale's save-as-default, ruled 2026-08-25). One Undo
reverses the whole tuplet operation.

**Press-and-hold repeat**, from the ruled gesture table: holding a stepper
arrow or a pitch verb repeats it while held. Nothing else takes a hold.

## The storage constraint, read before designing the diff

Corrections are ONE stored diff keyed to event ids (slice 1 of the old
N.92 numbering, N.97b's id carry). Insertion creates events no reader id
covers: extend the diff schema ADDITIVELY with synthetic ids in a
correction namespace, no new save site (N.27's rule), no change to
`VocalLineEvent`, nothing rebuilt in
`apps/web/src/lib/shane/reconciliation/`. Inserted entries, rests, ties,
and tuplet groups must survive re-read and reload exactly as pitch
corrections do. Say in the memo how the schema grew.

## The glyph metrics finding, from your own slice 2 memo

If the definition row's duration boxes need precise glyph metrics, add the
five duration codepoints (U+E1D2, E1D3, E1D5, E1D7, E1D9) to
`SMUFL_CODEPOINTS` as you proposed. That touches `score-parser` and may
move gate 5's count: allowed, disclosed in the memo, and
`ilya-ship.sh:80` gets flagged for the desk to update, never edited
silently.

## Strings

New strings expected: the gap readout, the Nolet row's "of" and "in the
space of", and the undo sentences for entry, rest, tie, and nolet
operations. Full table in the memo, English and French side by side,
coined marked against adopted, for Dann's eye before any ship. Do not
invent French beyond the table.

## Constraints

The standing set, unchanged: 44 px floor on controls; verbs boxed,
navigation bare; drawer manipulates, page displays and prints; the loupe
stays the one floating exception and stays FIXED; desktop untouched;
print untouched; no custom pinch, no viewport zoom cap; five gates at
baseline except a disclosed gate 5 move; no commits, no ship.

## Verification, before the memo

The real use case is the walk subject: the Lamm page-read song, whose read
carries 50 duration abstentions and found 0 of 10 rests. At 430 x 932:
step the bar into a gap and read the gap sentence; enter a note, watch it
arrive at the previous pitch, finish it with a pitch verb; enter a rest;
convert a note to a rest and back; tie two same-pitch notes; select the
first of three even quarters and define 3 of quarter in the space of 2,
watch the group become a triplet live; define one custom ratio; undo each
operation class once and watch the page return; reload and watch every
entry survive; then the same circuit's tuplet and gap moves at 932 x 430.
State your expectation before each measurement and name your likeliest
failure mode, per the control rule.

## Return memo format

`docs/sessions/memo-mobile-slice3_r1_2026-08-26.md`: how the diff schema
grew, what changed with `path:line`, the strings table, what you looked at
with your own eyes at both orientations, gate results with any gate 5 move
disclosed, and "Not established". NOT ESTABLISHED beats a complete
invented answer.
