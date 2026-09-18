# Memo: no opening barline, and the loupe sizes to its contents

**Reply to `brief-n92-no-opening-barline-and-fit_r1_2026-09-18.md`.** Built in
Claude Code, branch `Shane`, on top of `a86e985`. Nothing else changed the
tree this session, and no commit was made. **WRITTEN, not DONE**: section 5
below says exactly where this stands.

## 1. The minimum width, and why

`280` CSS pixels. MEASURED, not chosen by eye: off this fixture's own DOM,
read at the tag's and the readout's own font (canvas `measureText`, not
`getBoundingClientRect`, since the tag's own box already fills its row and
its rect reports the row's width, not the text's), the widest tag on the
fixture, `m. 17 · system 6 of 6 · 14 of 12, over`, sets `220.7` px at the
tag's own weight and tracking, and the widest readout, `Rest · beat 4,
pulse 2 · Quarter`, sets `160.6` px at the readout's own lighter one. `280`
clears the wider of the two by `59.3` px past its own text plus the card's
own padding and border (`FRAME_SIDES`, `22.8` px). **NOT ESTABLISHED beyond
this fixture's own longest strings**: a score with a higher system count or
a longer fill-status flag could still wrap the tag onto a second line: this
is a floor, not a proof.

## 2. Results against section 4

1. **Holds, on every measure of the fixture, at a system's start and
   mid-system.** The opening barline is excluded by its own rule now,
   `bodyClipLeft = opening.x + CLIP_PAD` (clause 11), not by the crop
   simply not reaching that far, which is what clause 7's own clip did and
   what let it back in whenever `CARET_MARGIN` needed the room. Confirmed
   by the whole-fixture scan, §3: zero unwanted barlines across `236`
   steps, `m. 2` through `m. 18`.
2. **Holds.** The closing barline's own boundary formula is unchanged in
   the ordinary case (`closing.right`, no pad: `loupe.ts`'s own
   `closingBarline` already returns the stroke's outer edge, so a pad
   there was redundant and, found this session on `m. 8`, actively
   harmful, §4). The tail panel's own code is untouched.
3. **Holds.** `frame.width` is now `stripWidth` (every panel this effect
   built, side by side) plus the card's own padding, clamped to
   `[MIN_WIDTH, maxWidth]`, `maxWidth` being the old, viewport-derived
   ceiling under its new name. MEASURED across the fixture: `m. 4`, the
   shortest measure, draws at `537.3` px; `m. 3`, the widest, at `767.4`
   px; neither the fixture's own minimum nor its maximum ever reached
   `MIN_WIDTH` or `maxWidth` on a 1024 px desktop, so both clamps stood
   ready without firing on this fixture. Screenshotted before and after on
   `m. 4` and `m. 5`: the card visibly narrows to the shorter measure and
   widens to the longer one, centred on the page either way.
4. **Holds, after a fix mid-session.** MEASURED, `m. 7`, before the fix:
   with the measure's own first note taken, `642.3` px; with any other
   entry or gap taken, `634.55` px, a real, singer-visible resize under the
   hand. Root cause: clause 13's own squircle clearance (below) is read by
   `leftBoundary`/`rightBoundary` only when the boundary note happens to be
   the one selected, so the head or tail gap's own mark moved with
   selection, and `bodyViewSpan`'s dynamic footprint widening moved with
   it. Fixed by folding `SQUIRCLE_CLEARANCE` into `CARET_MARGIN` itself,
   unconditionally: the fixed floor now reserves the room clearance could
   ever ask for, so the dynamic widening has nothing selection-dependent
   left to add on top of it. Re-measured: **zero width variation on all 17
   held-able measures of the fixture, 239 steps**, raising the loupe
   fresh and stepping every note and gap in each one. **NOT ESTABLISHED
   past this fixture**: a squircle wide enough (an unusually long IPA
   syllable, N.141's own width driver) to still exceed
   `CARET_MARGIN`'s new floor would still move `frame.width`, since
   nothing here can know another note's own squircle without building it,
   which is N.153's own extraction and out of this brief's scope.
5. **Confirmed unregressed by real clicks** (this pane's `computer` tool,
   not synthetic dispatch): a note tap on `m. 6`'s `A♭3` read `A♭3 ·
   Eighth · ка`; a rest tap on the same measure's own rest read `Rest ·
   Eighth`; a caret tap read `after ка · the next duration enters here`.
6. **Runs and passes on the rules `a86e985` passed**, §3.
5b. **The drawn clearance is 1.6 line-gaps**, `SQUIRCLE_CLEARANCE`, spent
   only where the boundary note is the one taken. **Raising it alone made
   things worse before a second fix**, §4 below. **The tap separation
   floor is not reached on any measure of the fixture at phone width**,
   §5.

## 3. The whole-fixture scan, `a86e985`'s own five rules plus this
   session's own three

Reused the previous brief's own scan, extended with this brief's own
checks (no opening barline; the panel seam, unchanged from `a86e985`; no
glyph, notation or underlay, straddling the clip). Walked by real clicks to
raise the loupe, then the loupe's own note stepper, rewound far enough to
reach `m. 2` regardless of where the walk started (an 80-click rewind, used
earlier in this same session's own work, was not enough once a walk started
near the fixture's own end and silently covered only its back half; `320`
clicks is comfortably past the fixture's own total and was checked against
the readout at both ends). `236` steps, `m. 2` through `m. 18`.

- **Adjacent-measure content, a clipped glyph, an unwanted barline, a
  panel seam: zero, on all 18 measures.**
- **The 27 collisions from `fda5b9c`'s own scan: unchanged, `27` on the
  same `12` of the fixture's `18` measures** (`20` ink, `20` squircle,
  `9` beam, several counted in more than one column). Not attempted this
  session; N.153 is where they close.

## 4. What the session found, and had to fix twice

**The clip's own right-hand pad let a half-visible barline pass unnoticed
until this session, because nothing before it checked underlay text for
adjacency.** `closing.right` is already the barline's own outer stroke
edge (`loupe.ts`'s `closingBarline` adds half the line's own width in), so
the flat pad this file added two sessions ago, spent unconditionally, was
never needed in the ordinary case and, on `m. 8`, let `m. 9`'s own first
syllable, `деж`/`ˈdʲɛʒ`, paint half-visible past the barline. Fixed two
ways: the pad is now spent only where a nudge actually moved the barline,
and a general safety net (matching the general form clause 7 itself
prefers over naming one adjacent mark at a time) reads every mark
already-named foreign, an adjacent event's own ink, its accidental or dot,
its IPA or Cyrillic syllable, a stray key signature or clef, and pulls the
clip in from whichever side it is found on, never past the closing barline
itself, which clause 7 requires to stand.

**That safety net's first version read the wrong DOM and then the wrong
box.** Read against `clone` (a detached copy at that point in the effect,
whose `getBBox()` has no layout to answer from) instead of `sysEl` (the
live, mounted page), it silently found nothing. Corrected to read `sysEl`,
its first live measurement pulled the clip so far in that it cut the
closing barline itself, because a `[data-event-id]` group's own `getBBox`
includes its `data-hit` rectangle, wider than the glyph and invisible, the
same trap `inkOf` elsewhere in this file was already built to avoid.
Corrected again to read a group's children, excluding the hit rectangle,
and to never tighten past the barline's own position. **One case remains,
found and left as a genuine, measured tension rather than coded around**:
on `m. 8`, `m. 9`'s own syllable reaches back far enough that a hair of it
still stands inside the room between the last note and the (correctly,
fully drawn) closing barline; there is no boundary that draws the barline
whole and excludes the syllable whole at once, since the two overlap in
the page's own native coordinates before the loupe crops anything. Section
1.0 asks for the barline to stand; this session kept that over excluding
the syllable, since the barline is the more load-bearing of the two
(clause 7's own conceit) and the syllable's own leak is a sliver, not a
whole mark.

**Clause 13's own clearance, raised alone, traded a squircle touch for an
ink one on tight measures and made some existing ink touches deeper.**
`SQUIRCLE_CLEARANCE` widens the boundary the position rule reads from a
squircle's stroke; on `m. 6`'s own case, `ringRightEdge + 8.8` already
read past `593`, the next note's own ink starting at `587.51`, before the
caret's own footprint was even counted, so the position rule's midpoint
landed inside a note that, at the bare stroke, it used to only just clear.
Fixed by asking for the clearance only where the room it leaves still fits
a caret (against `MIN_SPACE`, the same floor the head and tail gaps
already nudge a barline to reach); short of that, both boundaries of the
gap fall back to their bare stroke together, so a gap the clearance cannot
answer is never worse than clause 4's own retired 1.2-line-gap version
left it. Re-measured, whole fixture: the 27-gap baseline (§3) is exactly
where `a86e985` left it, not larger.

## 5. What I could not establish

- **The tap separation floor, 44 CSS px, is not reached on any of the
  17 held-able measures of the fixture at phone width.** MEASURED (`375`
  px viewport, `2×` device pixel ratio, real geometry off the DOM, not
  estimated): the closest pair's centres range from `1.13` px (`m. 16`,
  the note `m15-5-8` and its own following gap) to `7.89` px (`m. 17`,
  `m15-11-8` and its own gap), every measure below the floor, most well
  below it. This is not a surprise the brief's own wording anticipated
  only on "the tight measures": at this fixture's own phone-width scale
  (governed by `MAGNIFICATION` and the page's own on-screen size, both
  unchanged this session), NO measure reaches it, tight or not, because
  each hit target is already sized to the 44 px FLOOR on its own width
  (`hitHalf`'s own `22 / scale` term), and two adjacent 44-px-wide targets
  need `44` px of CENTRE separation only if they do not overlap at all,
  which the fixture's own note-to-note spacing at this scale does not
  give most pairs. Per the brief's own instruction, this is reported, not
  shrunk quietly or coded around: it is evidence for N.153, which the
  same note already names as the route to wider relative spacing.
- **Whether `MIN_WIDTH` (`280`) holds on a score with a longer tag or
  readout than this fixture's own longest.** Section 1's own caveat.
- **Whether every reader of `Loupe.svelte`'s own frame tolerates
  `frame.width` varying by measure**, beyond what this session's own
  reading of the template and `+page.svelte`'s own use of `frame.left`
  found. Not exhaustively searched.
- **A measure with neither an opening nor a closing barline** (the
  piece's own only measure, not present in this fixture): the clip
  formula's fallback (`view.left`/`view.right`, no pad on either side) is
  the same one already proven safe for a single missing end; the doubled
  case is untested.

## 6. Files to `git add`

One file changed, source: `apps/web/src/lib/shane/Loupe.svelte`.

`docs/memory/OPEN.md`, `docs/memory/SEQUENCE.md`, `docs/memory/STATE.md`,
and `docs/memory/ENVIRONMENT.md` were already modified when this session
started. None was touched further here.

One new file, this memo:
`docs/sessions/memo-n92-no-opening-barline-and-fit_r1_2026-09-18.md`.

The brief itself,
`docs/sessions/brief-n92-no-opening-barline-and-fit_r1_2026-09-18.md`, and
`docs/sessions/BRIEF-TEMPLATE.md`, were present as untracked files at the
start of this session and are untouched.

## 7. Gates

Only `apps/web/src/lib/shane/Loupe.svelte` changed this session, inside
`apps/web`. `phonology`, `dictionary`, and `score-parser` were not touched
and were not re-run; their last confirmed numbers stand (`phonology` 216,
`dictionary` 235, `score-parser` 567 passed + 5 skipped,
`memo-n92-caret-span-and-rests_r1_2026-09-17.md`).

- **web-test**: `1265 passed (1265)`, `64` test files, unchanged.
- **web-check**: `0 errors and 12 warnings in 5 files`, unchanged.

No gate moved. `ilya-ship.sh` was not found in this repository and was not
touched.
