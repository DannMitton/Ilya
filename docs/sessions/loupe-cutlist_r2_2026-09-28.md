# r2, 2026-09-28: citations corrected against 9ebfdc0 and cut 4's seams proposed; supersedes r1

Read at `/home/claude/ilya-night`, branch `Shane`, HEAD `9ebfdc0` (`git log --oneline -1`, this
session). `git diff --stat eab54f9 9ebfdc0 -- apps/web/src/lib/score/Loupe.svelte` returned no
output, this session, confirming `Loupe.svelte` is unchanged since r1 was written. Read-only
session: no git command that writes was run.

## What changed from r1

- Corrected the dead-prop citation in section 5: `nextIds={nextMeasureIds}` is at
  `apps/web/src/routes/+page.svelte:5078`, not `:5116`. Line 5116 there now holds unrelated
  cache code; `+page.svelte` moved between r1's HEAD (`eab54f9`) and this session's (`9ebfdc0`),
  confirmed by reading both files this session.
- Corrected cut 1's grep claim: `pageMetrics` does appear outside `Loupe.svelte`, in a comment
  at `apps/web/src/lib/score/loupe.ts:774` ("See `Loupe.svelte`'s `pageMetrics`."). It is a
  comment, not a call, so the interface conclusion (one definition, calls only inside cut 4's
  territory) still holds; only the stated grep result was wrong.
- Corrected cut 4's `GUTTER` citation: `GUTTER` is read outside `attempt` at
  `Loupe.svelte:2389` (inside `anchorTop`) only. `panelRoom` (`:2393-2397`) does not read
  `GUTTER` directly; it reads `anchorTop`'s return value, which itself depends on `GUTTER`.
- Every other citation and line span checked this session against `Loupe.svelte` and against
  `+page.svelte` matched exactly: no other error found.
- Checked every span in r1 against the sister list's JSDoc-bleed pattern (a span's stated end
  landing on the *next* item's closing `*/` rather than the cited item's own closing brace).
  No instance of that pattern was found in this document: every multi-line span checked this
  session (all of cut 1's eight sub-items, cuts 2, 3, 4's three pure helpers, and the whole
  `attempt` closure) ends exactly where the doc says, one line short of, or exactly on, the
  next declaration's own leading comment, never past it.
- The "~24" estimate for the three pure helpers in cut 4 is 20 by direct count
  (`fingerprint` 696-700, `worstSeparation` 703-708, `offendingPairs` 711-719: 5+6+9), as the
  citation check already noted. Kept as a correction here since r2 aims for exact figures
  where r1 estimated.
- Section 2, cut 4 now carries proposed internal seams for the 1,423-line `attempt` closure
  (below), which r1 left as three untested candidate groupings read off comment headers.

Everything else in r1's structure (the cut table, the ordering, sections 4 and 6) is carried
over unchanged except where corrected above; it is not reproduced here in full. This document
stands alongside r1's own prose for cuts 1, 2, 3 and 5, which needed no correction.

## Cut 4: the frame-computation engine, seams proposed

**The closure:** `attempt`, `Loupe.svelte:774-2196`, 1,423 lines, confirmed this session by
reading the file start to end. It is a single arrow function bound to `const attempt = (...)`
at `:774` and closing at `:2196` with the standalone `};` before the spacing-search code that
calls it.

**Five contiguous seams**, each read start to finish this session. Moves only, no rewrites, as
asked. Grouping the five into three files keeps each new file under `scripts/ratchets.json`'s
default 1,000-line ceiling for an unlisted file (`scripts/ratchets.mjs:9-10, 68`; confirmed
this session by reading both).

### Seam 1: window and barline geometry, `:774-937` (164 lines)

What it does: mounts the one-measure render, reads the system's own width and the held
measure's hit rectangle, computes `win` (the measure's boundary from `measureWindow`), then
finds the drawn opening and closing barlines and narrows `win` to them.

Reads (from outer scope): `drawnFrom`, `measure`, `ownIds`, `minGap` (the closure's own
params); `container`, `dockInset`, `isPhone`, `GUTTER`, `SIDE_INSET` (module/outer state).

Produces, all consumed by later seams: `sysEl`, `own`, `first`, `sysWidth`, `sysHeight`,
`sysMinY`, `hitY`, `hitH`, `lineGap`, `win`, `sheet`, `stageWidth`, `stageBottom`, `inset`,
`maxWidth`, `staffTop`, `verticals`, `opening`, `closing`, `tailSpanUnits`, `span`.

Destination: `apps/web/src/lib/score/loupe-window.ts` (new).

Shared-state flag: this seam's job IS producing shared state. Roughly twenty locals cross into
seams 2 through 5. Extracted whole, it returns one object of that shape; every downstream seam
then takes that object as a parameter instead of closing over the locals directly. This is the
seam a mechanical move handles cleanly (nothing here is mutated after this seam ends), but the
interface is wide.

### Seam 2: head, meter, and carry panel layout, `:939-1235` (297 lines)

What it does: measures the header's own ink (clef, key signature) to find where the head
crop ends; computes `view`/`viewSpan` (where the body's clip begins) via `clipToHead` and
`openAfterPageMeter`; picks the magnification (phone's fixed 2.4, or the desk's derived
figure); builds the meter panel (N.138) when a meter is due, including its own stave-line
survey; and derives `totalSpan`, `scale`, `headWidth`, `meterWidth`.

Reads: `sysEl`, `win`, `opening`, `lineGap`, `staffTop`, `font` (`notationFont`), `meter`,
`DIGIT_GLYPHS`, `isPhone`, `unitPx`, plus the cut-1 helpers `musicInk`, `headerRightOf`,
`restOrNoteInk`, `headBound`, `clipToHead`, `openAfterPageMeter`, `meterLayout`,
`carryBand`, `firstInkIn`.

Produces: `headWidthUnits`, `headCropUnits`, `view`, `viewSpan`, `magnification`,
`meterPanel`, `carry`, `meterSpanUnits`, `carrySpanUnits`, `scale`, `headWidth`, `meterWidth`,
`stave` (the `StaveInk` survey, `:1111-1122`).

Destination: `apps/web/src/lib/score/loupe-panels.ts` (new).

Shared-state flag: `scale`, computed here, is read by every later seam (carets, body sizing,
centring). Nothing here is mutated after the seam ends, so this is a clean return-object move
like seam 1, just with `scale` as the one value worth naming because of how far downstream it
travels.

### Seam 3: page-ink crop and clone preparation, `:1236-1448` (213 lines)

What it does: surveys the page's own ink band (`pageMetrics`, `ringRoom`, `inkCrop`) for the
crop's vertical extent; builds the system-range list for the tag's "system N of M"; parses the
render markup into a detached `clone` and strips from it everything the loupe draws itself
(analysis marks, bar numbers, the page's own meter, the page's selection ring) or renames
(`data-hit` to `data-loupe-hit`); reads the page's own selection ring into `pageRing`; and sets
the caret margin and the body's initial (unwidened) view bounds.

Reads: `page` via `pageMetrics(container)`, `sysEl`, `markup` (the render string), `bare` (via
`hasUnderlay` over every system), `selectedEventId`, `derive`, `view`/`viewSpan`, `lineGap`,
`sysHeight`, `sysMinY`, `RING_REACH`/`RING_RADIUS`/`RING_STROKE`, `INK_PAD_SP`.

Produces: `cropTop`, `cropHeight`, `contentHeight`, `ranges`, `clone` (a mutable DOM node),
`pageRing`, `SQUIRCLE_CLEARANCE`, `CARET_MARGIN`, `bodyViewLeft`, `bodyViewRight`,
`bodyViewSpan`, `openingNudge` and `closingNudge` (both initialised to `0`), `caretsMarkup`
(initialised to `''`).

Destination: `apps/web/src/lib/score/loupe-clone-prep.ts` (new).

Shared-state flag: `clone` is a live, mutable DOM tree that seam 4 mutates further (barline
nudging, `:1721-1732`) and seam 5 reads from (`clone.innerHTML`, `:2153`). `bodyViewLeft`,
`bodyViewRight`, `bodyViewSpan`, `openingNudge`, and `closingNudge` are declared here with
`let` and reassigned in seam 4. A seam boundary here means passing `clone` by reference (fine,
DOM nodes are references already) and passing the five `let`-bound view/nudge values into
seam 4 as a small mutable record it can write back into, rather than five separate primitives.

### Seam 4: caret placement, `:1450-1843` (394 lines)

What it does: N.92's caret placement. Builds `inkOf` (a note or rest's own drawn ink) and the
left/right boundary functions for each gap; runs the placement once normally and, when
`derive` is set, once per candidate selection to find the worst-case spacing; widens
`bodyViewLeft`/`bodyViewRight`/`bodyViewSpan` past whichever mark landed closest to an edge;
nudges the clone's own opening or closing barline where a gap's floor required it; and, when
drawing (not deriving), serializes the caret markup itself.

Reads: `positions`, `derive`, `mode`, `syllablesOpen`, `sysEl`, `selectedEventId`, `pageRing`,
`view`, `win` is not read directly here but `opening`/`closing` are, `lineGap`, `staffTop`,
`scale`, `stave.lineWidth`, and from seam 3: `bodyViewLeft`/`bodyViewRight`/`bodyViewSpan`,
`openingNudge`/`closingNudge`, `clone`, `SQUIRCLE_CLEARANCE`, `CARET_MARGIN`.

Writes (mutates in place, not just returns): `openingNudge`, `closingNudge`,
`bodyViewLeft`/`bodyViewRight`/`bodyViewSpan` (widened at `:1754-1756`), `clone`'s own barline
elements (`nudgeBarline`, `:1721-1732`), and produces `marks`, `derivationSets`,
`caretsMarkup`.

Destination: `apps/web/src/lib/score/loupe-carets.ts` (new).

Shared-state flag: this is the seam the brief's "shared mutable state" question is really
about. It both reads and reassigns five locals seam 3 declared (`bodyViewLeft`,
`bodyViewRight`, `bodyViewSpan`, `openingNudge`, `closingNudge`) and mutates a DOM tree (seam
3's `clone`) that seam 5 then reads. Extracted as a plain function, it cannot return a single
value; it needs to take the seam-3 record above and return an updated copy of it (the five
numbers plus the mutated `clone` reference), and the caller (whatever remains in the
component, or seam 5) applies that update before continuing. This is not a rewrite of the
logic, only of its calling convention: today five outer `let`s absorb the mutation invisibly,
and after the move the mutation has to be explicit in a return value.

### Seam 5: body clip, frame sizing, and assembly, `:1845-2196` (352 lines)

What it does: narrows `bodyClipLeft`/`bodyClipRight` past any foreign mark (a neighbour
measure's note, accidental, or syllable) that still falls inside the widened view; computes
`windowHeight` and `centreY` (the page-anchored vertical position, reading `CHROME` and
`GUTTER`); places the loupe's own squircle (`ring`, via `stripRing`); sizes the strip
(`stripWidth`, clause 12's `width`) and centres it (`left`, `stop`); and returns the final
`Frame` object together with `marks`, `derivationSets`, and `scale`.

Reads: `opening`/`closing` (for the clip's initial bounds), `drawnFrom.readingScore.vocalLine`
(for `ownEvents`), `sysEl`, `marks`/`caretsMarkup`/`clone` from seam 4, `stageTop`/
`stageBottom`, `window.innerHeight`/`window.innerWidth`, `CHROME`, `GUTTER`, `dockInset`,
`pageRing`, `bodyViewLeft`, `headWidth`/`meterWidth`/`carryWidth`, `cropTop`, `scale`,
`ranges`, `measureIndex`, `sheet`.

Produces: `bodyClipLeft`/`bodyClipRight` (final), `windowHeight`, `centreY`, `carryWidth`,
`tailWidth`, `bodyContentWidth`, `ring`, `stripWidth`, `width`, `left`, `stop`, and the
returned `{ marks, derivationSets, scale, frame }` object itself.

Destination: `apps/web/src/lib/score/loupe-frame-assembly.ts` (new).

Shared-state flag: none beyond what seams 1 through 4 already handed it as a return value;
this seam only reads, it does not feed anything back upstream.

### Grouping into files under the ratchet

| File | Seams | Lines |
|---|---|---|
| `loupe-window.ts` + `loupe-panels.ts`, or one `loupe-geometry.ts` | 1, 2 | 164 + 297 = 461 |
| `loupe-clone-prep.ts` + `loupe-carets.ts`, or one `loupe-clone.ts` | 3, 4 | 213 + 394 = 607 |
| `loupe-frame-assembly.ts` | 5 | 352 |

Three files, each well under the 1,000-line default, whether kept as five files or grouped
into three as shown; 164+297+213+394+352 = 1,420, plus the three blank separator lines
between seams (`:938`, `:1449`, `:1844`) accounts for the full 1,423.

**Not established:** whether any narrower split of seam 4 (the largest, at 394 lines) is
possible without further splitting the mutable-state handoff described above; this session
did a single dependency pass, not an exhaustive one. Whether `apps/web/e2e-phone/loupe-scan.
test.ts`'s Playwright project runs in CI: unchanged from r1, not re-checked this session.

## Running total and target size (unchanged from r1, spans confirmed accurate)

| After cut | Script lines remaining (est.) |
|---|---|
| (start) | 2,422 |
| 1. Measurement utilities | ~2,081 |
| 2. Tap resolution | ~2,061 |
| 3. Measure-tag text | ~2,031 |
| 4. Frame-computation engine | ~591 |

Adding untouched markup (286, `:2423-2708`, confirmed this session) and untouched style (346,
`:2709-3054`, confirmed this session) gives roughly **591 + 286 + 346 ≈ 1,220 lines** after
cuts 1 through 4, before cut 5. Target size: **1,000 to 1,200 lines**, stated as an estimate,
unchanged from r1: nothing found this session moves that estimate.
