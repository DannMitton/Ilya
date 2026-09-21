# BRIEF — N.153 stage 3b. Derive the loupe's own spacing, on one measure

**Written 2026-09-20 by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree read for this brief at `a1cd0dd`, working tree clean.**

Stage 3a shipped in `0f7375c`. This brief is stage 3b and nothing else. Stage 4
(retiring `loupe.ts`'s crop helpers) and stage 5 (the whole-fixture scan) are
separate and are not in scope.

---

## 1. GOAL

The loupe draws **one measure**, at a horizontal spacing **it derives for
itself**, so that every caret is separated from its neighbour by at least the tap
floor.

Two jobs, and they are one move:

1. Narrow the render from the system to the single held measure.
2. Replace the page's spacing with a spacing found by a loop: render, measure,
   widen, re-render, stop at the smallest spacing that violates no floor.

They are one move because a one-measure render at the page's own spacing is 17 to
71 percent narrower than the page's justified measure
(`apps/web/src/lib/shane/loupe-render.ts:10-14`, measured 2026-09-20). Narrowing
without deriving makes the drawing worse. Deriving without narrowing widens every
measure in the system.

---

## 2. WHY THIS EXISTS, and it is not a tidy-up

At phone width the separation between a caret's hit centre and its neighbour's
runs **1.13 px to 7.89 px on all 17 held-able measures, against a 44 px floor**
(measured 2026-09-18, recorded in `docs/memory/OPEN.md` §N.153). `nearestTarget`
resolves by centre, so a caret is not reliably tappable on a phone anywhere in
this score. The carets are drawn correctly and cleared correctly, and they cannot
be used by a thumb.

**N.153 is what makes the insert reach work on a phone.** The desktop path works
today.

---

## 3. THE RULINGS THIS SERVES

All in `docs/memory/OPEN.md`, section THE CARET. Quote them back in the memo if
you depart from any of them.

- **Clause 6.** The loupe's spacing is its own, temporary and situational, and
  does not bind the page.
- **Clause 7, ruled by Dann 2026-09-18** (`OPEN.md:1683`). *"The Loupe is an
  artificial instance of a single measure... There should not be any information
  in the Loupe from adjacent measures."* No mark from an adjacent measure is
  drawn, at either end.
- **Clause 8, ruled by Dann 2026-09-18**, which retracts his own ruling of
  2026-08-27. The loupe may exceed the page's width. *"The notation's point size
  is the fixed quantity. The window is the variable one."*
- **Clause 1 and the position rule.** Every caret stands in the middle of the
  space it names, and touches nothing.

---

## 4. THE LOAD-BEARING FINDING. Read this before you write any code

**The loop converges only if you render at natural width. If you pass
`targetWidth`, it can diverge, and this is established from the code, not
suspected.**

`staff-renderer.ts:2011-2012`:

```
const targetSpan = (options.targetWidth ?? 0) - head.contentLeft;
const stretch = naturalSpan > 0 && targetSpan > naturalSpan ? targetSpan / naturalSpan : 1;
```

and `staff-renderer.ts:2038-2042` accumulates `x += s.advance * stretch`.

So `stretch` is a single scalar over every column. Hold `targetWidth` fixed and
raise `minGap`. `naturalSpan` rises, `stretch` falls, and a gap that was **not**
on the floor gets **narrower**. Widening to fix one gap opens another. There is
no guarantee of termination.

Without `targetWidth`, `stretch` is 1, and each column's advance is
`staff-renderer.ts:1646`:

```
return Math.max(minGap, prevDurWhole * pxPerWhole, textNeed, inkNeed);
```

`textNeed` (`staff-renderer.ts:1620-1626`, via `underlayHalfWidth` at
`:1066-1083`) and `inkNeed` (`:1641-1645`, via `columnInk` at `:1540-1602` and
`inkMetrics` at `:1338-1403`) read `lineGap` and `font` and **neither reads
`minGap` nor `pxPerWhole`**. So every advance is non-decreasing in either knob,
the cumulative position is a sum of non-decreasing terms, and the loop
terminates.

**THE RULE FOR THIS STAGE: the loupe's render passes no `targetWidth`. Ever.**
The page's width is not a target the loupe honours, and clause 8 says it does not
have to be.

---

## 5. WHAT TO BUILD

### 5.1 The one-measure slice

`loupe-render.ts:74-93`, `renderLoupeSystem`, currently takes a `SystemRange` and
a `targetWidth`. Replace it with a single-measure entry point.

`renderSystemSlice` (`packages/score-parser/src/page-layout.ts:184-222`) already
supports this. It calls `renderAnalyzedStaff(sliceScore(parsed, fromMeasure,
toMeasure), ...)` and hands in `incomingAccidentals` and `incomingTimeSignature`
precisely because each slice renders independently of what precedes it. Call it
with `fromMeasure === toMeasure === m`.

**The head comes free.** The clef is drawn at `staff-renderer.ts:2235` and the key
signature at `:2254-2260`, unconditionally, on every render. A one-measure render
draws its own clef and key rather than cropping the system's.

**`finalBarline`** stays `m === measures - 1`.

### 5.2 The loop

Move `minGap` only. Hold `pxPerWhole` at the page's value.

**DESK DEFAULT, and Dann can wave it off with a word.** `pxPerWhole` is the
duration term: raising it widens gaps in proportion to note values and changes
the engraving's rhythmic proportion, which is what horizontal distance reads as.
Raising `minGap` lifts the floor under the short gaps without disturbing the
proportion of the long ones.

The loop:

1. Render at the page's `minGap`.
2. Mount, measure every adjacent caret pair's separation in CSS pixels at the
   loupe's own scale.
3. If every separation is at or above the floor, stop. This spacing is the
   answer.
4. Otherwise raise `minGap` and re-render.
5. Stop on convergence, or on the iteration cap.

**The floor is 44 CSS pixels**, the tap-target floor this surface already draws
every control at (`apps/web/src/lib/shane/Loupe.svelte:1673` carries that number
in prose; `:1502` realizes it as `hitHalf = Math.max(lineGap, 22 / scale)`).

**The step and the cap are yours to choose and to report.** State in the memo what
you chose, how many iterations the fixture's worst measure needed, and the widest
`minGap` any measure asked for. **A bisection between the page's `minGap` and a
ceiling converges in fewer renders than a fixed increment; take whichever you can
defend with a measured iteration count.**

### 5.3 What happens when a measure cannot get its width

**DESK DEFAULT.** On the cap, keep the best spacing reached, draw it, and report
the residual violations to the console with the measure index and each offending
pair.

**Put no mark on the page and none in the loupe.** `docs/memory/CONTRACT.md` §6:
*"Do not put a mark on the page to say Ilya is unsure. A mark that appears on
everything says nothing."*

### 5.4 The scale cap, which will otherwise undo the whole stage

`Loupe.svelte:1173-1175`:

```
const fitWidth = Math.max(0, maxWidth - FRAME_SIDES);
const drawn = Math.min(totalSpan * unitPx * magnification, fitWidth);
const scale = drawn / totalSpan;
```

A wider native span against a fixed CSS ceiling produces a **smaller** `scale`.
The loop would widen the engraving and the cap would shrink it back, and the
on-screen separation would not move.

**DESK DEFAULT: remove the `fitWidth` clamp from `scale`.** Hold the scale at
`unitPx * magnification` and let the strip exceed the window, scrolling
horizontally. That is clause 8 applied literally: the point size is fixed and the
window is the variable.

`.loupe-window` carries `overflow: hidden` (`Loupe.svelte:2660`) and
`Loupe.svelte:2009` reclamps the frame's outer width to `maxWidth` while
`stripWidth` is not reclamped to match. **Both need to change together, or the
widened strip is clipped instead of scrolled.**

**N.140 is the item that owns the scroll**, and it is open and waiting on two
things of Dann's: the floor in CSS pixels, and whether the scroll may take a
gesture on a surface where the swipe dismisses and the tap places a syllable.
**Stage 3b does not wait on N.140.** It stops shrinking; N.140 decides how the
singer moves what no longer fits.

### 5.5 Panels

With a one-measure render:

- **The head panel** (`Loupe.svelte:2313-2326`) and **the carry panel**
  (`:2363-2376`) are both second and third crops of the same clone
  (`Loupe.svelte:902-908`, `:2360-2362`). The one-measure render supplies its own
  head, so **both crops go**.
- **The meter panel** (`:2330-2359`) and **the tail panel** (`:2435-2455`)
  synthesize their own content and do not read `frame.inner`. **Leave them.**
- Clause 7's continuation barline is a conceit Dann endorsed in the same breath
  as the clause. **Keep the tail. The seam must not show:** every panel meets its
  neighbour with no gap, whatever margin the body takes for its carets.

### 5.6 What breaks, and must be repaired in the same pass

`nextHere` (`Loupe.svelte:741-742`) bounds the window by the next measure **only
when it shares the render**. With a one-measure render, `hitsFor(sysEl, nextIds)`
is always empty. Repair the bound rather than letting it fall through silently.

`musicInk`'s gate walk (`Loupe.svelte:330-353`) and the carried-band walk
(`:1108-1130`) both iterate `sysEl.querySelectorAll('*')` in paint order,
discriminating head ink from music ink. **A one-measure render still draws a head**
(clef, key, and the meter when it changes), so the discrimination is still needed;
confirm it, do not assume it.

The squircle edges (`Loupe.svelte:1482-1488`) read `pageRing` off
`pageSys.querySelector(...)`, which is the **live page's DOM**, not `sysEl`
(`:1292`). That is page-coordinate data feeding a loupe-coordinate calculation.
**Check it and report what you find.** Do not silently re-point it.

---

## 6. WHAT YOU MUST NOT DO

- **Do not pass `targetWidth`.** Section 4.
- **Do not change `VocalLineEvent`**, and do not rebuild anything in
  `apps/web/src/lib/shane/reconciliation/`.
- **Do not touch the page's or the print's output.** Both must stay
  byte-identical. Stage 3a proved this across 8 layouts; prove it again.
- **Do not retire `loupe.ts`'s crop helpers.** That is stage 4 and its own
  decision. Leave dead exports in place and list them in the memo.
- **Do not build the whole-fixture scan.** That is stage 5.
- **Do not commit and do not stage.** `docs/memory/CONTRACT.md` §5. Report what
  you changed and let Dann ship it.

---

## 7. DEFINITION OF DONE

1. `pnpm tsc` clean.
2. All five gates at their current baselines. **Gate 4 expects `1333 passed
   (1333)`** (`~/Downloads/ilya-ship.sh:79`). New tests raise that number; say by
   how many and update the line, backing up the original as the previous change
   did.
3. **Page and print output byte-identical** across at least 8 layouts, by the same
   method stage 3a used.
4. **Every measure of `sunless-01-engraved.musicxml` renders in the loupe**, and
   for each you report: the `minGap` the loop settled on, the iteration count, and
   the worst caret separation in CSS pixels at phone width.
5. **The count of the 27 known collisions that the derived spacing closes**, with
   the residue named by measure. The memo's numbers come from a run, not from an
   estimate.

---

## 8. WHAT YOU COULD NOT ESTABLISH

Fill this section. **NOT ESTABLISHED beats a complete invented answer.**

State at minimum:

- Whether the loop converged on every measure, and what the cap caught.
- Whether removing the `fitWidth` clamp broke any layout you did not expect.
- Anything in `Loupe.svelte` that reads page coordinates and feeds a loupe
  calculation, beyond the squircle edges named in section 5.6.
- Any place where a comment and the code disagree. **`loupe.ts`'s internal
  citations into `staff-renderer.ts` are stale by roughly 1000 to 1600 lines**
  (audited 2026-09-20); the substance holds and the line numbers do not. Repair
  by naming the thing, not by writing a new number.

---

## 9. RETURN MEMO

Write `docs/sessions/memo-n153-s3b-derived-spacing_r1_2026-09-20.md`. Keep it
short. It carries:

1. What you changed, by file, with line ranges.
2. The five numbers from section 7.
3. Section 8.
4. Anything that belongs in `docs/memory/ENVIRONMENT.md`, with the symptom that
   would send the next session looking for it.
