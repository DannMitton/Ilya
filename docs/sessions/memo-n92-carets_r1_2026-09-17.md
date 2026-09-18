# Memo: N.92's insert reach, the carets

**Reply to `brief-n92-carets_r1_2026-09-17.md`.** Built in Claude Code,
branch `Shane`, on top of `2dd1e09`. Nothing else changed the tree this
session, and no commit was made, per the brief's own git constraint.
**WRITTEN, not DONE**: section 7 below says exactly where this stands
against the brief's own definition of done, unsliced (§7's own note).

## 1. What changed, by file and line

**`apps/web/src/lib/shane/entry.ts:60-89`.** One new pure function,
`positionsInMeasure(line, measureIndex)`: a slice of `positions(line)`
covering one measure's own head gap, its entries, and its tail gap. It finds
the measure's first and last entry by index in `line` and slices
`positions(line)` around them (`entry k` sits at position `2k+1`, so its
flanking gaps are `2k` and `2k+2`). No second way to name a gap: a gap this
returns is the exact same object `positions` itself would return at that
index. Tested at `entry.test.ts:99-138`: it equals the whole line's
`positions` for a one-measure line, it slices correctly across a barline, the
boundary gap between two measures is the same object on both sides, and it is
empty for a measure with no entry.

**`apps/web/src/routes/+page.svelte`.**
- `positionsInMeasure` imported (`:172`).
- `heldMeasurePositions`, a derived value: the held measure's own run of
  places off `correctedLine` (`:1533-1542`), so a hand-entered note is a
  place the bar can stand exactly as a read one is.
- `handleLoupePickGap(after)` (`:714-724`): `setCursor({ kind: 'gap', after
  })`, the one function that already writes `selectedEventId` and `gapAfter`
  together, so nothing downstream of the cursor (the readout, the armed
  duration cells, the PITCH station's greying) had to learn a caret tap
  exists.
- Both passed to `<Loupe>`: `positions={heldMeasurePositions}` and
  `onpickgap={handleLoupePickGap}` (`:4994-4995`).

**`apps/web/src/lib/shane/Loupe.svelte`.**
- Two new props, `positions: readonly Cursor[]` and `onpickgap: (after:
  string | null) => void` (`:110-123`), and `Cursor` imported from
  `$lib/shane/entry`.
- The frame-building `$effect` gains a block (`:1188-1290`) that computes one
  caret per gap in `positions` and injects it into the clone, gated on
  `!syllablesOpen`. §2 below is the geometry.
- `handleTap` (`:1459-1489`) now resolves NOTES and CARETS in one combined
  pool. §3 is why one pool and not two.

## 2. Where a caret's x comes from, and the one case it cannot cover

**Every gap's x is an existing hit rectangle's own edge, never a new
measurement.** The renderer tiles each note's hit rectangle edge to edge with
its neighbours' (`staff-renderer.ts`'s `prevXById`/`nextXById`), so the
shared edge between two adjacent rectangles already IS the gap between them,
rest or no rest in between, because a rest's neighbours still meet at its
true boundary even though the rest earns no rectangle of its own (confirmed
by reading `staff-renderer.ts:2626-2632`: a rest's branch of the render loop
`continue`s before the hit-rectangle code, so it has no `data-hit` at all).
Concretely, for the gap at index `i` in `positions`:

- `i === 0` (the head gap): `x = view.left`, the crop's own left edge, which
  is where the opening barline already stands (`Loupe.svelte`'s own comment
  at the opening-barline search).
- `i` is the last index (the tail gap): `x = view.right`, symmetrically.
- otherwise: the entry immediately before the gap's hit rectangle's right
  edge, or, failing that (the entry before is a rest), the entry immediately
  after's hit rectangle's left edge.

**A gap flanked by two rests on both sides has no rectangle to read on either
side, and none is invented: that gap is left out.** I walked every measure of
the one fixture available to me (`tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/score.mxl`)
and the drawn caret count matched entry-count-plus-one on every measure,
several of which end on a rest, so this fixture never hit the double-rest
case. **NOT ESTABLISHED how often a real score does**, and I did not build a
second fixture to force it. If it matters, the honest fix is teaching the
renderer to hand rests a hit rectangle too (out of scope here: it touches
`staff-renderer.ts`, not this surface).

**The mark itself** (`Loupe.svelte:1237-1290`): a vertical line from one
line-gap above the staff to one line-gap below it, with a filled triangular
arrowhead at each end whose apex touches the staff line it terminates on and
whose base is the mark's own outer end, so nothing stands proud of the
arrow, per Dann's "terminates the lines... with arrowheads pointing inward."
Colour is `#9585a2`, the app's own lavender (`--lavender`'s literal, matched
rather than referenced because every other colour this renderer emits is a
literal hex value, never a CSS variable). **This is mine and reversible,
named in §5.**

## 3. One pool, not two

`handleTap` resolves a note and the gap beside it in the SAME call to
`nearestTarget`, keyed by a prefix (`note:` or `gap:`) that never reaches
`onpick`/`onpickgap`. I chose one pool because "one tap has one winner" is
then true by construction: two separate `nearestTarget` calls would still
need a second comparison between their two winners to decide which is
actually nearest, which is the same computation `nearestTarget` already does
once. `nearestTarget` resolves by CENTRE alone with no containment test
(`loupe.ts:161-177`), so the two kinds of target compete on equal footing.

## 4. The hit area, and the mark that does not grow to match it

**44 CSS px**, converted to the clone's own coordinate space via `scale`
(the same px-per-unit every panel on this surface is already sized by):
`Math.max(lineGap, 22 / scale)` half-width, floored at one line-gap so a
very small `scale` (a wide desk stave) cannot shrink it. Height spans 3.5
line-gaps above and below the staff, the same vertical reach the note hit
rectangles already draw. **The drawn mark stays its own size**: the
transparent hit rectangle is a separate element behind the line and the two
arrowheads, exactly the shipped note's own pattern
(`staff-renderer.ts`'s "a transparent hit target... SVG hit-tests painted
geometry only"). Because `nearestTarget` reads only the rectangle's centre,
the 44 px width sets no boundary between one gap and its neighbour. It only
guarantees the rectangle is discoverable and, on the walk, genuinely
tappable.

## 5. Decisions this brief did not settle, mine and reversible

- **Colour, `#9585a2` (lavender).** The brief ruled shape, not colour. I
  read the app's own convention (`CorrectionSurface.svelte`'s "STATE MARKERS
  ON MUSIC VERBS... take the section's own hue") as the closer precedent
  than notation ink black, since a caret is a correction-surface affordance
  and not part of the engraving. Change one literal (`Loupe.svelte`, the
  `ink` constant in the caret block) to move it.
- **Arm length and width**, one line-gap and 0.8 line-gaps respectively.
  Proportioned to the stave space already in scope at the point of drawing,
  not measured against anything Dann ruled on.
- **One combined tap pool rather than two**, §3.

## 6. What I could not establish

- The double-rest gap, §2: whether it costs a real score, and I built no
  fixture to force it.
- Whether the hit rectangle's 44 px floor, measured against `scale` at the
  moment the frame builds, ever produces neighbouring carets whose
  rectangles overlap enough to feel wrong under a thumb on a dense run of
  short notes. The walk (§7) found nothing wrong on the one fixture
  available, which is not a survey.
- Whether a phone narrower than the pane's 375 px preset changes anything
  here. Not tested, the same caveat the pitch-grid memo before this one
  named.

## 7. Definition of done, walked against

1. **Yes.** With a note selected and syllables closed, the loupe's measure
   draws a caret in every gap it can resolve (§2), including before the
   first note and after the last, confirmed on five consecutive measures of
   the fixture, desktop width and 375 px.
2. **Yes.** Every caret runs past the top and bottom staff lines with an
   inward-pointing arrowhead at each end, confirmed visually on both
   widths.
3. **Yes.** Tapping a caret stands the cursor in that gap: `readout` reads
   `after X · the next duration enters here` (or the head/rest-anchor form,
   §2's aside on `gapAnchorName`), the armed duration cell shows `engaged`,
   and the PITCH station's six cells read `disabled`. Confirmed by direct
   DOM read after synthetic and real taps, both widths.
4. **Yes.** A note tap still selects that note (confirmed: tapping directly
   on a note beside a caret read its own pitch, not the gap's sentence), and
   the one-pool design (§3) means no tap can resolve to both.
5. **Yes.** Toggling the syllables row open dropped the caret count to zero
   on the same measure. Closing it again returned the same count.
6. **Yes.** The stepper (`Next note`) was walked 40 steps across four
   measures without incident, alternating entry and gap exactly as before.
   Nothing here touches `handleMove` or `stepCursor`.
7. **Yes**, all five, this session: phonology 216, dictionary 235,
   score-parser 567 passed + 5 skipped (572), web-test **1265** (was 1261,
   +4: `positionsInMeasure`'s own suite), web-check **0 errors, 12 warnings,
   5 files** (unchanged).

**Not sliced**: the brief's own permission to stop after "carets drawn and
tappable on a computer first" was not needed. The phone hit area (§4) and
the phone walk (§7.1-7.6, all reconfirmed at 375 px) are both in.

## 8. What to `git add`

No new source files. Four existing files changed:

- `apps/web/src/lib/shane/entry.ts`
- `apps/web/src/lib/shane/entry.test.ts`
- `apps/web/src/lib/shane/Loupe.svelte`
- `apps/web/src/routes/+page.svelte`

`docs/memory/OPEN.md` and `docs/sessions/spec-n92-edit-surface_r1_2026-09-17.md`
were already modified when this session started, carrying the brief's own §3
ruling and the spec's superseded strike-through. Neither was touched further
here.

One new file, this memo: `docs/sessions/memo-n92-carets_r1_2026-09-17.md`.
