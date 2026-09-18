# Memo: the caret and the note after the squircle collide

**Reply to `brief-n92-caret-collision_r1_2026-09-17.md`.** Built in Claude
Code, branch `Shane`, on top of `8cb9b51`. Nothing else changed the tree this
session, and no commit was made. **WRITTEN, not DONE**: section 3 below says
exactly where this stands against the brief's own definition of done, and
section 4 says what it does not cover.

## 1. The measurement, and which remedy fired

**Answering the brief's own question first: no.** On the four measures Dann
named, there is no arrangement of the carets inside the spacing already
engraved that satisfies section 5 at once. Measured on m. 3's head gap
(`apps/web/src/lib/shane/Loupe.svelte:1338-1357`, the gap named `m1-11-8`):
the native room between the opening barline and the first note's own ink was
short of a caret's own footprint by most of a line-gap. Remedy 2, expanding
the loupe's own spacing, is the one Dann ruled for, and it is the one this
ships.

**Two things changed to get there, both scoped to `Loupe.svelte`.**

1. **The position rule reads ink, not hit rectangles** (`leftBoundary`/
   `rightBoundary`, `Loupe.svelte:1338-1357`). A neighbour's boundary is now
   its own drawn ink (`inkOf`, unioning a note's group and anything stamped
   `data-of-event` for it) or, where the neighbour is the currently selected
   note, the squircle's own near stroke. MEASURED on m. 14: the OLD
   hit-rectangle clamp let a caret stand only `hitHalf` short of the next
   note's hit-rectangle centre, which on that note was more than seven units
   short of where its ink actually began, and the caret landed on the note.
   Re-measured after the fix: the squircle on `m13-1-4` (A3) draws at
   `272.566` to `294.818`; the gap after it sits at `301.909`, the exact
   midpoint of the squircle's right stroke (`294.818`) and the next note's
   ink (`309`, room `14.182` units), inside neither.
2. **Where the native room is still short, the boundary that can safely move
   does.** For the head and tail gaps, that boundary is the barline
   (`nudgeBarline`, `:1399-1416`): nothing else in the renderer references a
   barline's own position, confirmed by the research this session drew on.
   For the crop's own edge, a second, independent floor was added this
   session (`:1418-1441`): the fixed two-line-gap `CARET_MARGIN`
   (`:1213-1216`) is a floor, not a guarantee, and widens further past
   whichever caret actually lands closest to it. MEASURED before the fix, m.
   2's head gap: the caret's own true position (`137.4545`, the midpoint of
   the opening barline at `128.54` and the squircle's left stroke at
   `146.369`) sat `0.015` units inside the fixed crop edge (`137.47`), well
   inside the arrowhead's own half-width (`1.87` units), so the arrowhead
   itself was clipped. Re-measured after the fix: the crop edge moves to
   `134.760`, and the arrowhead's own left edge (`135.585`) clears it by
   `0.825` units, exactly the buffer the widening adds.

**What neither remedy touches, found going past the four named measures**:
section 4.

## 2. What I read before changing anything

Section 2's own list, read before any code changed, on m. 14 and two other
measures:

- **The squircle's two strokes**, in system units: read from the live page's
  own `[data-selection-ring][data-note-selected]` element, `x` and `width`
  plus half its own stroke width on each side. m. 6 (A♭3, `m5-9-8`):
  `558.150` to `583.332`. m. 14 (A3, `m13-1-4`): `272.566` to `294.818`.
- **The neighbouring note's hit rectangle and its ink**, read separately: a
  note's hit rectangle (`prevXById`/`nextXById` tiling, unchanged since
  N.92's first ship) is wider than its ink on every note checked. m. 14's
  next note (`m13-1-2`): ink `309` to `315.997`.
- **Where the push wanted to land, where the clamp capped it, where the
  floor forced it, where the mark was finally drawn**: pre-fix on m. 14, the
  push wanted the squircle's own outer stroke (`294.818`) but the neighbour
  clamp capped it `hitHalf` short of the neighbour's hit-rectangle centre,
  landing the mark on the note itself. Post-fix, no clamp exists any more;
  the mark is the ink-to-ink or ink-to-stroke midpoint outright, `301.909`.
- **The room between the squircle's outer stroke and the neighbouring
  note's ink**: m. 14, `309 - 294.818 = 14.182` units either side of the
  squircle. m. 6, the gap after the squircle: `587.510 - 583.332 = 4.178`
  units, tighter but still enough for the caret's own `3.74`-unit width.
- **The barlines, and the room to them**: m. 3's opening barline and its
  own head gap's deficit is section 1's own number. m. 3's closing barline:
  drawn at `623.73`, the last note's ink ending at `608.93`, room `14.8`
  units, no nudge needed there.

## 3. Results against section 5

Checked on the four measures Dann named, and, because the brief's own
wording is "every measure of the fixture, not only the measure that exposed
it," on the whole fixture: every gap in every held measure across all six
systems, stepped by real clicks and by the loupe's own note-stepper, 233
steps, every one re-checked against the same five geometric tests the
shipped code itself computes from (ink, squircle stroke, barline, beam,
crop edge).

1. **Holds, where a floor exists.** Every mark is its own true midpoint:
   confirmed by exact arithmetic match on m. 2, m. 3, m. 4, m. 6, and m. 14,
   reading the drawn mark's own `x` back against the ink/stroke/barline
   numbers that should have produced it. Where the middle was not free (m.
   2's and m. 3's head gaps), the floor moved the constraining boundary and
   the mark still took the new middle. **Does not hold for every interior
   gap**: section 4.
2. **Holds for the four named measures**, confirmed by direct re-check
   against every note's own ink. **Does not hold on 18 gaps found by the
   full scan**: section 4.
3. **Holds for the four named measures.** m. 6's own "double whammy," the
   gap after `m5-9-8`: the mark now clears the squircle's own outer stroke
   by `0.219` units and the next note's ink by `0.219` units, tight but
   never touching. **Does not hold on the same 18 gaps as item 2**: every
   one of them is a squircle-adjacent gap, so an ink violation there is a
   squircle violation too. Section 4.
4. **Holds everywhere checked.** Zero barline-touching marks across the
   233-step scan.
5. **Holds everywhere checked**, after this session's crop-margin fix.
   Zero clipped marks across the same scan; m. 2's head gap was the one
   instance found, and it is fixed (section 1).
6. **Measured, not assumed.** m. 6, the fixture's own tightest measure by
   this metric: the nearest two hit targets' centres sit `3.83` units
   apart. Nothing in this session's own changes touches `hitHalf` or a
   rectangle's own width, so this mechanism is the same one the previous
   brief measured and shipped.
7. **Confirmed by real clicks**, this pane's `computer` tool, not synthetic
   dispatch. A caret tap in m. 6 selected the gap it named (`after ка`). A
   rest tap in m. 6 (`m5-3-8`) selected that rest. Note taps across m. 2,
   m. 3, m. 4, m. 6, and m. 14 each selected the note clicked.
8. **Both remedies fired.** Remedy 1, the ink/stroke/barline position rule,
   governs every gap in the fixture. Remedy 2 fired in two forms: the
   barline nudge, confirmed firing on m. 3's head gap and measured there;
   and the crop-margin widening added this session, confirmed firing on m.
   2's head gap and measured there. **NOT ESTABLISHED**: the exact count of
   gaps either form of remedy 2 fires on across the whole fixture. The
   whole-fixture scan's own zero count for both barline-touching and
   crop-clipping marks (items 4 and 5) confirms each fires wherever the
   scan found it was needed, but the scan does not distinguish "fired and
   succeeded" from "was never needed."

## 4. What I could not establish

**The larger finding, past what the brief named.** The whole-fixture scan
surfaces a third collision the brief's own four measures did not: an
INTERIOR gap, neither the head nor the tail of its measure, where the true
room between a neighbouring note's ink and the selected note's squircle
stroke is less than the caret's own footprint. Section 5 items 2 and 3 do
not hold here. **Eighteen gaps**, across measures 2, 5, 6, 7, 8, 10, 11, 12,
14, 15, and 17 (of the fixture's 18 measures): `m2-5-8`, `m5-0-1`,
`m5-1-4`, `m5-3-8`, `m6-5-4`, `m7-1-1`, `m7-5-4`, `m8-9-8`, `m8-5-4`,
`m10-1-2`, `m10-5-4`, `m11-1-1`, `m11-9-8`, `m12-5-4`, `m14-5-4`, `m15-1-2`,
`m15-5-8`, `m15-5-4`, `m17-3-8` (one gap, `m17-3-8`, was found short twice,
against two different neighbours as the selection moved). The true native
room ranges from `2.366` units (`m2-5-8`) down to `0.153` units
(`m5-3-8`, the rest immediately before m. 6's own squircle, from the other
side) against a caret width of `3.74` units, so the overlap into ink and
into the squircle's stroke ranges from about `0.13` to about `1.8` units on
each side.

**Neither available remedy reaches this category, under this brief's own
constraints.** Remedy 2's barline nudge does not apply: neither boundary is
a barline. The squircle's own geometry is off limits, N.141's and ruled.
Translating the neighbouring note was not attempted: the research this
session drew on, dispatched before any code changed, found that a beam, a
tie, a ledger line, or an accidental can depend on a note's rendered
position without that note carrying a handle back to them, so a rigid
per-note move is unsafe in general, safe only for a note that is unbeamed,
untied, not in a tuplet, and inside the staff, a check this session did not
build. **I did not find a safe remedy for this category and did not ship
one.** The mark stands at its true midpoint, exactly as remedy 1 places
every other gap, which is no worse than before this brief and no better on
these 18.

**The beam-crossing category, already known from the previous ship, now
measured across the whole fixture rather than the one gap that first found
it.** Nine gaps: `m2-9-8`, `m4-9-8`, `m5-9-8`, `m6-9-8`, `m8-9-8`,
`m10-9-8`, `m12-9-8`, `m14-9-8`, `m15-3-8`. Eight of the nine share one
shape, the gap after the last eighth note of a beamed beat in a measure
built on eighth-note beaming; the previous ship's own memo had found only
one instance of this (m. 6's `m5-9-8`), because it was not checked against
the rest of the fixture. Two gaps (`m8-9-8`, `m15-3-8`) carry both this
violation and the squircle/ink one above at once. `staff-renderer.ts` draws
a beam from both its notes' positions at once and hands neither note a
handle back to it, so moving one from outside the renderer risks a beam
that no longer says what duration it groups. Not attempted, for the same
reason it was not attempted in the previous brief.

**Whether remedy 2's crop-margin floor (section 1, item 2) ever needs to
widen past what this session's fixed buffer allows.** The buffer is a
caret's own arm half-width plus `0.15` of a line-gap, and it held on every
gap the whole-fixture scan checked, but I did not construct a case
designed to defeat it, only found the ones the fixture already has.

**Whether the eighteen-gap category above is closer to the general case on
a real score than the fixture's own four named measures were.** The
fixture is one song. Whether most scores carry this many
squircle-adjacent, short-room gaps, or whether this fixture happens to sit
unusually close to its own theoretical minimum spacing, is not established
here.

## 5. Files to `git add`

One file changed, source: `apps/web/src/lib/shane/Loupe.svelte`.

`docs/memory/OPEN.md` was already modified when this session started,
carrying clause 6's own ruling. It was not touched further here.

One new file, this memo:
`docs/sessions/memo-n92-caret-collision_r1_2026-09-17.md`.

The brief itself, `docs/sessions/brief-n92-caret-collision_r1_2026-09-17.md`,
was present as an untracked file at the start of this session and is
untouched.

## 6. Gates

Only `apps/web/src/lib/shane/Loupe.svelte` changed this session, inside
`apps/web`. The other three packages' own gates were not re-run, since
nothing in `phonology`, `dictionary`, or `score-parser` moved; their last
confirmed numbers stand (`phonology` 216, `dictionary` 235, `score-parser`
567 passed + 5 skipped, `docs/sessions/memo-n92-caret-span-and-rests_r1_2026-09-17.md`).

- **web-test**: `1265 passed (1265)`, `64` test files, unchanged.
- **web-check**: `0 errors and 12 warnings in 5 files`, unchanged.

No gate moved. No line in `ilya-ship.sh` was touched; the file was not
found in this repository at all, so nothing there needed naming.
