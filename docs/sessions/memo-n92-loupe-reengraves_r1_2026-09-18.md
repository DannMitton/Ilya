# Memo: the loupe re-engraves the held measure at its own spacing

**Reply to `brief-n92-loupe-reengraves_r1_2026-09-18.md` and its
`addendum-n92-loupe-reengraves_r1_2026-09-18.md`.** Built in Claude Code,
branch `Shane`, on top of `fda5b9c`. Nothing else changed the tree this
session, and no commit was made. **WRITTEN, not DONE**: section 5 below says
exactly where this stands.

**Which copies I had, per the addendum's own question.** The brief grew twice
while this session ran. My first read carried sections 1 through 6 only, no
1.0, 1.0.1, 1.0.2, or 1.1. I re-read the file mid-build, on the addendum's own
instruction, and from that point had the full brief: 1.0 (the governing
rule), 1.0.1 (the tail panel), 1.0.2 (the width retraction, dated 2026-09-18),
and 1.1 (the stray barline), plus sections 2 through 6 unchanged. The
addendum itself grew once too; both its own sections, including 3.1 (no
clipped glyph), were read before any of this shipped.

## 1. Step 1's finding: the big re-engraving does not fit in one pass

The mechanism is real and named correctly. `packages/score-parser/src/page-layout.ts`
already renders one measure alone, at its own spacing: `renderAnalyzedStaff(sliceScore(parsed, m, m), analyzed, options)`
is exactly what `paginateScore` calls per system, and event ids survive
slicing unchanged (`sliceScore` rebases `measureIndex`, never `ev.id`, and
`data-hit`/`data-event-id` are built from `ev.id` directly), so the caret,
tap-resolution, and hit-rectangle machinery this brief protects would key off
the same ids it already does. `analyzed` tolerates a thin stand-in (the one
read site, the tie-direction choice at `staff-renderer.ts:3193`, falls back
gracefully when an id is not in `analyzed.events`).

**What is not a one-file change:**

- **The score, the analysis, the font, and the five underlay preview maps
  (`ipaPreview`, `withheldIpa`, `cyrPreview`, `sylTypePreview`,
  `melismaPreview`) all live as private `$derived` state inside
  `VoiceProfilePane.svelte`.** `Loupe.svelte` is not handed any of them today;
  `+page.svelte`, which owns both components as siblings, holds only the raw
  ingested score, not the octave-shifted, performance-order-resolved one the
  page actually renders. A re-engraved measure that dropped the preview maps
  would show the file's own default syllable under a note the singer has
  hand-paired to a different one: a real, singer-visible divergence from the
  page, not a cosmetic one.
- **The squircle's own box is computed inline in `VoiceProfilePane.svelte`**
  (`RING_PAD_X`/`RING_PAD_Y`/`RING_MIN_W`/`RING_RADIUS` are shared constants,
  but the arithmetic that turns a note's ink into a box is not a function
  either surface can call). A re-engraved measure needs the same box from its
  own, independently-rendered note; duplicating that arithmetic is the "two
  copies of one fact" this codebase's own comments warn against elsewhere
  (`staff-renderer.ts` on `inkMetrics`), and extracting it is a second file's
  worth of change before the loupe touches it.
- **The panel strip itself is built for cropping, not for a self-contained
  render.** `loupe.ts` carries roughly a dozen exported functions
  (`headBound`, `clipToHead`, `measureWindow`, `openAfterPageMeter`,
  `carryBand`, `windowScale`, `pageInset`, `centreOnPage`, `inkCrop`,
  `ringRoom`, `stripRing`) whose whole job is deciding which slice of one
  shared coordinate space each panel may show; `loupe.test.ts` is 781 lines
  and roughly 110 cases, mostly against these. A re-engraved single measure
  draws its own head inline and needs none of them: the head/meter/carry
  split collapses toward one panel. Retiring that machinery is either a
  second large edit in the same pass or deliberately-kept dead code, and I
  did not want to decide which under time pressure with the rest of this
  brief still open.
- **The addendum's own correction adds a fourth, uncosted piece: deriving the
  minimum relative spacing per held measure** (the caret's footprint, its
  clearance from ink on each side, and the squircle's stroke where the
  selected note is a neighbour), which means rendering a TRIAL layout,
  measuring it, and re-rendering wider if the position rule's floor would
  still fire, per measure, every time the held measure or the selection
  changes. Nothing in `staff-renderer.ts`'s `pxPerWhole`/`minGap` options is
  today driven by a caller measuring its own output and asking for more; this
  is a real, un-costed control loop, not a parameter to set once.

**Given all four, in one pass, I judged the risk of a broken or half-working
loupe (the app's own core editing surface) too high to accept under this
session's constraint that a stop is not a failure but a half-build is
forbidden. I stopped.**

**A staged version, concretely:**

1. Extract the ring's own box arithmetic out of `VoiceProfilePane.svelte`
   into a pure, shared function (`selection-ring.ts` or beside it), called
   from the page exactly as it is today (a behaviour-preserving refactor,
   verifiable by diffing the page's own rendered output) and available to a
   second caller.
2. Add one new, additive data channel from `VoiceProfilePane.svelte` to
   `+page.svelte` to `Loupe.svelte`, carrying `readingScore`, `analyzed`,
   `clef`, the font, and the five preview maps: a `LoupeRenderContext`
   assembled inside the SAME untracked effect that already reports
   `onpagesdrawn`, so it costs no new reactive surface. Land and verify this
   on its own before anything reads it.
3. Only then, in `Loupe.svelte`: replace the `sysEl.cloneNode(true)` step
   with a call to `renderAnalyzedStaff` on a one-measure slice, at a spacing
   derived per the addendum's own instruction (render, measure every gap
   against the position rule's own floor, widen and re-render if any floor
   would still fire, stop at the smallest spacing that needs none). Collapse
   the panel strip toward the one panel a self-contained render actually
   produces. Repoint the caret math already built across the last three
   briefs (`leftBoundary`/`rightBoundary`/the marks loop/the barline nudge)
   at the new root: this part is the least risky of the whole change, since
   it already works by DOM query on `data-event-id`/`data-of-event`/
   `data-hit` rather than by page-relative geometry.
4. Retire or knowingly keep `loupe.ts`'s now-unused crop helpers and their
   tests, as its own decision, not a side effect of step 3.
5. Re-run the whole-fixture scan (below) as the acceptance test, over all 18
   measures, plus real-click verification of note, rest, and caret tap
   resolution.

**NOT ESTABLISHED: how many of the 27 collisions the derived-spacing
mechanism actually closes**, since it was not built. Section 1.0's own
governing rule is what makes re-engraving the right mechanism in principle;
whether the CONCRETE per-measure spacing search the addendum asks for
converges quickly, or needs a cap and a "the viewport cannot give this
measure the width it needs" report of its own, is unmeasured.

## 2. What was built regardless of the stop

Sections 1.0.1 and 1.1 are named in the brief as fixed **whether or not the
re-engraving proceeds**, and 3.1 was added as a further acceptance item
against the same mechanism (the CARET_MARGIN crop). All three, plus 1.0.2,
were built and verified this session, entirely inside the existing clone.
**This is not the remedy section 3 forbids** ("do not fall back to nudging
marks in the clone"): nothing here nudges a mark to close one of the 27
collisions. It clips what the clone paints and adds one guard to what the
page draws; the 27 collisions are untouched, named again in section 4.

**1.0/1.1/3.1, one mechanism.** `Loupe.svelte`'s body panel now clips the
clone's own content to the measure's true boundary (`bodyClipLeft`/
`bodyClipRight`, computed where `frame` is assembled), instead of relying on
the crop's own edge to simply not reach far enough to show anything
foreign, which is what clause 6's `CARET_MARGIN` widening broke. The clip
bound is `view.left`/`view.right` (the boundary N.138 and N.139 already
proved never lands inside a glyph's own ink, `loupe.ts`'s own comment on
`clipToHead`), moved outward by whatever a nudged barline moved by, plus a
small, fixed pad spent only on the side a barline is actually drawn. The
carets themselves are drawn to their own serialized markup
(`frame.caretsMarkup`) and placed OUTSIDE the clip, since a caret's own
arrowhead legitimately stands in the room `CARET_MARGIN` cleared for it.

MEASURED, before the fix, m. 13: the system's own key signature (already
drawn once, correctly, by the head panel) painted a second time at the
body's own left edge, `[32.81, 38.05]`, overlapping the first note's own hit
rectangle by about `1.75` units. The "stray sharp" 3.1 later named on m. 16
is the same mechanism, caught mid-glyph instead of whole. On the right,
m. 14's own first note (`data-of-event="m13-0-1"` in this fixture's own
0-indexed ids) painted at `[238.74, 247.775]`, past m. 13's own closing
barline at `236.5`. After the fix: zero elements foreign to the held
measure paint anywhere inside the clip, on any of the 18 measures walked
(section 3), and zero glyphs straddle the clip's own edge (3.1's own test).

**1.1's own desk recommendation** (strip the specific preceding barline) was
not the mechanism used. **Bettering it, as the brief invited**: a single
geometric clip reaches every case the recommendation would have needed
naming one kind at a time (a barline on m. 5/m. 14, a key signature on
m. 13, a half-cut sharp on m. 16, and, not photographed but the same
mechanism, the next measure's own notehead and syllable on the tail side of
every mid-system measure), and does it by construction, matching section
1.0's own stated preference over "stripping marks one kind at a time."

**1.0.1, the detached tail.** The body panel's own margin (the room
`CARET_MARGIN` clears past the last note's ink) was blank inside the clip,
and Dann's photograph is what a blank stretch immediately before the tail
panel's own short stave-line run reads as: a break in the stave. Fixed by
giving the body panel its own background layer, painted first (behind the
clipped clone): the SAME five lines the tail panel already draws, same `y`,
same stroke, same width, read off the page once (`stave`, already
computed), unclipped and reaching past this panel's own viewBox on both
sides so the viewBox itself is what crops them. Where the clipped clone's
own five lines paint on top, inside the clip, they coincide exactly with
this layer and nothing doubles. MEASURED, m. 12: before the fix, a
`10.175`-unit stretch after the closing barline (`623.73` to `1.15`-unit
overshoot past the pad, `624.83` to bodyViewRight's own `635.005`) carried no
stave ink at all; after, all five lines run unbroken from the last note
through the closing barline, across that stretch, and into the tail panel's
own run, confirmed by a `0.5`-px screen-coordinate tolerance check on every
one of the eighteen measures walked (section 3) that carries a tail panel.

**1.0.2, the width retraction.** `Loupe.svelte`'s own comment naming Dann
2026-08-27's cap is amended in place, not deleted, recording the 2026-09-18
retraction and its reason (`stageWidth`'s own computation, where the cap
lived). `stageWidth` now holds to the page's own width only when `isPhone`;
on a desk it is `room` alone, the viewport less the drawer and the gutters.
**Per the addendum's own correction, this changes nothing about the 27
collisions on its own**: `scale` grows, not relative spacing, and every
quantity in a collision is proportional. It is applied because it is its
own, unconditional ruling (not gated on the re-engraving the way 1.0.1 and
1.1 are), it is low-risk (inert until a held measure's own natural width
exceeds the page's, which none in this fixture do, confirmed by the
unchanged screenshot on m. 6 after the change), and it is the half of the
addendum's "two rulings, you need both" that costs nothing to ship now.

## 3. The scan's results

Reused the previous brief's own whole-fixture scan (its own five geometric
checks: position rule, ink/stem/beam/accidental/rest touch, squircle-stroke
touch, barline touch, whole-mark), extended with this brief's three new
items: no adjacent-measure content inside the clip (1.0/1.1), no glyph
straddling the clip's own edge (3.1), and the panel-seam check (1.0.1, body's
own right screen edge against the tail panel's own left, in CSS px). Walked
by real clicks to open the loupe, then by the loupe's own note stepper, 233
steps, rewound to the piece's own start and re-walked to its own end, every
step re-checked.

- **Adjacent-measure content: zero, on all 18 measures.** (One early version
  of this scan's own check flagged 73 false positives, by testing a note's
  whole hit-rectangle rather than its ink; `Loupe.svelte` and every other
  script this session wrote for the caret's own ink already exclude
  `data-loupe-hit` from an ink measurement, and the scan's own check was
  fixed to match before its numbers were trusted.)
- **Clipped glyphs: zero, on all 18 measures.**
- **Panel-seam gaps: zero, on all 18 measures**, CSS-pixel-flush confirmed
  both by the client-rect check and by eye on m. 12's own screenshot.
- **The 27 collisions from `fda5b9c`'s own scan: unchanged, `27` on `12` of
  the fixture's `18` measures** (`18` ink/squircle-adjacent, `9`
  beam-adjacent, `2` counted in both). Not attempted this session, named in
  section 1 as the reason the stop condition fired.
- **Hit-rectangle separation**: measured on m. 6, the fixture's own tightest
  case by this metric in the previous brief's memo too, `3.83` units
  between the nearest two centres, unchanged, since nothing this session
  touched `hitHalf` or a rectangle's own width.
- **Tap resolution**: confirmed by real clicks (this pane's `computer` tool,
  not synthetic dispatch), on m. 6: a note tap read `A♭3 · Eighth · ка`, a
  rest tap read `Rest · Eighth`, a caret tap on m. 13 read `after счас · the
  next duration enters here`.

## 4. What I could not establish

- **Whether the derived-spacing mechanism the addendum describes actually
  converges to something the viewport can show, on every measure of this
  fixture or a harder one.** Not built this session; section 1's own staged
  plan is the answer I have instead of a measurement.
- **Whether every reader of `Loupe.svelte`'s panel strip tolerates the
  background stave layer this session added.** I read the template's own
  five consumers of `frame.tail`/the body panel and found none that assume
  the body panel paints nothing outside its clip; I did not search the rest
  of the app for a reader of `.loupe-body`'s own rendered SVG that could
  care.
- **Whether a measure with NO opening barline and NO closing barline (both
  ends system-initial and system-final at once, i.e., the piece's only
  measure) clips correctly.** Not present in this fixture; the formula
  (`view.left`/`view.right`, no pad, when `opening`/`closing` are both null)
  is the same one already proven safe for a single missing end, but the
  doubled case is untested.
- **The 27 collisions' own further characterization.** Section 1's citation
  of `18`/`9` is the previous brief's own memo, re-confirmed by this
  session's scan (`20` ink-overlap steps, `20` squircle-overlap, `9`
  beam-adjacent, `27` distinct gaps total), not re-derived independently.

## 5. Files to `git add`

One file changed, source: `apps/web/src/lib/shane/Loupe.svelte`.

`docs/memory/OPEN.md` was already modified when this session started,
carrying clause 7's own ruling and the two live-defect findings. It was not
touched further here.

One new file, this memo:
`docs/sessions/memo-n92-loupe-reengraves_r1_2026-09-18.md`.

The brief and its addendum,
`docs/sessions/brief-n92-loupe-reengraves_r1_2026-09-18.md` and
`docs/sessions/addendum-n92-loupe-reengraves_r1_2026-09-18.md`, were present
as untracked files at the start of this session (the addendum arrived mid-
session) and are untouched.

## 6. Gates

Only `apps/web/src/lib/shane/Loupe.svelte` changed this session, inside
`apps/web`. `phonology`, `dictionary`, and `score-parser` were not touched
and were not re-run; their last confirmed numbers stand (`phonology` 216,
`dictionary` 235, `score-parser` 567 passed + 5 skipped,
`memo-n92-caret-span-and-rests_r1_2026-09-17.md`).

- **web-test**: `1265 passed (1265)`, `64` test files, unchanged.
- **web-check**: `0 errors and 12 warnings in 5 files`, unchanged.

No gate moved. `ilya-ship.sh` was not found in this repository and was not
touched.
