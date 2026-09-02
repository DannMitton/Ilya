# Memo: N.103, the spacer sees ink

Built 2026-09-02 against `bb73488`, "N.106: the turning unit keeps to the right
of the sung unit". The working tree was dirty at the start with
`docs/memory/INBOX.md`, `docs/memory/PRODUCT.md`, and `docs/memory/STATE.md`,
and nothing else. Built to the brief as amended: `TURNING_TRAIL_SP` at 1.0 stave
spaces replaces the ink clearance after a displaced turning unit, and the
biglyph is a property of the vowel that corresponds to the note it follows.

The «лё ко» pair Dann read as cramped had **−4.38 units** of ink-to-ink
clearance. It now has **18.92**. Across Without Sun song 1 the narrowest
ink-to-ink clearance between adjacent columns went from **−4.38 units to 4.05**,
and the count of gaps under half a stave space went from **5 to 0**. The page
holds fewer measures per system, 7 systems became 8, and the page count did not
change.

---

## 1. What changed

Two source files and their two test files.

### The two constants

`packages/score-parser/src/staff-renderer.ts:769-785` adds
`export const INK_CLEAR_SP = 0.5`, the clearance between one column's rightmost
ink and the next column's leftmost ink, in stave spaces. It is the same half
stave space Gould r235 already gives the underlay text, on the reasoning that
ink is ink.

**The brief names it `INK_CLEAR`; the file calls it `INK_CLEAR_SP`.** The `_SP`
suffix is this file's convention for a stave-space quantity, beside
`COURTESY_GAP_SP`, `TURNING_CLEARANCE_SP`, and `STEM_LENGTH_SP`, and it makes
the unit legible where the number is spent. Nothing else about it changed. Say
the word and it goes back.

`:787-808` adds `export const TURNING_TRAIL_SP = 1.0`, the clearance AFTER a
displaced turning unit, and it carries Dann's ruling verbatim in its own
comment. Four times the leading gap, because N.106 seats the biglyph 0.25 spaces
from its parent and a page that then leaves 0.5 to the next note states the
opposite of the meaning.

Two px literals were given names in the same pass: `ACC_GAP_PX = 1.5` at `:811`,
the gap between a notehead and its own accidental, and `TURNING_OFFSET_PX = 1.6`
at `:814`, the offset the two-voice rule has carried since 2026-07-12.

### The measurement

`:1026-1123`, `columnInk(ev, a, accState, turningState, options)`, returns
`{ left, right, turningDisplaced }` as px offsets from the notehead's centre. It
is the measurement `columnAdvance` was missing.

It ADVANCES the two carries, exactly as the draw loop does, because whether a
flat draws at all depends on every note before it in the bar. It calls
`advanceAccidentalState` and `carryIntoMeasure` rather than restating either.
That is why the state is a parameter and not a local.

`turningDisplaced` is the third field because the ink term needs to know which
clearance to spend, and a displaced turning unit is always the column's
rightmost ink by construction: N.106 seats it past everything the sung unit
owns.

### The fourth term

`:1127-1168`, `columnAdvance`, gains `prevInk` and `nextInk`, both optional, and
a fourth term:

```ts
const inkNeed = prevInk
  ? prevInk.right +
    (nextInk ? nextInk.left : 0) +
    lineGap * (prevInk.turningDisplaced ? TURNING_TRAIL_SP : INK_CLEAR_SP)
  : 0;
return Math.max(minGap, prevDurWhole * pxPerWhole, textNeed, inkNeed);
```

The widest of the four wins, as before. Stretch-only justification above it is
untouched. A caller that measures no ink gets exactly the three terms it got
before N.103, which is what keeps every existing caller honest, and it is a
test.

### One definition of every width

The brief's hard constraint was that the draw loop and `columnInk` must not
restate each other. Five things were factored out and both now read them:

- `inkMetrics(options)` at `:841-931` returns every glyph width the ink rule
  needs, from the font in SMuFL mode and from primitive mode's fixed numbers
  otherwise. The renderer builds it once at `:1394` and its own locals
  (`stemT`, `stemHalfUp`, `stemHalfDown`, `headHalfW`, `ledgerHalf`) now come
  from it. The required accidental at `:2018` and the courtesy cluster at
  `:2093` read their widths from it too.
- `dotGeometry` at `:933-948` returns the first dot's x and the last dot's right
  edge. The draw loop takes the first at `:2169`; `columnInk` takes the last at
  `:1102`.
- `sungRightEdge` at `:950-967` is N.106's triglyph, measured: notehead, dots,
  and an up-stem.
- `turningUnitAt` at `:969-978` is N.106's displacement, in one place. The draw
  loop takes `.tx` at `:2294`; `columnInk` takes `.right` at `:1120`.
- `staveSteps` at `:816-826` counts the interval in stave steps from the two
  pitches. Both callers use it at `:1115` and `:2290`.

`staveSteps` is also a correction. N.106 measured the interval in pixels and
divided by the half-space to recover it. Counting diatonic numbers is
clef-independent and cannot round, and it removes the last place where the
spacer could have thought a unit aligned that the page displaces.

### One definition of the barline carry

`AccidentalCarry` at `:980-996`, `newAccidentalCarry` at `:998`, and
`carryIntoMeasure` at `:1013-1024` hold the two accidental maps, the bar
counter, and the step across a barline. **Three copies of that step existed
before this**: the draw loop's, `accidentalStateAtEndOf`'s, and the one
`layoutColumns` would have needed. There is one now, called from
`accidentalStateAtEndOf` at `:434`, from the draw loop at `:1969`, and from
`columnInk` at the top of every call.

The maps are read off `carry` rather than destructured, because the barline step
REPLACES `measureAcc` and a local binding would go stale at the first bar
change.

---

## 2. The threading

`columnAdvance` needed the analysis and the two accidental states, and
`sliceWidth` called it with neither. The design is one sentence: **the walk that
already knows the column order carries the state and measures the ink, so
neither call site has to assemble anything.**

`layoutColumns` at `:1200` takes a fifth argument, `analyzed?: AnalyzedScore`.
Inside it:

- resolves the clef once, `options.clef ?? chooseClef(parsed)`, and passes it to
  every `columnInk` call;
- seeds the carry from `options.incomingAccidentals` when there is one, and
  otherwise from `accidentalStateAtEndOf(parsed, fromMeasure - 1, fifths)` when
  `fromMeasure` is finite;
- measures every column, in order, and hands the previous and current ink to
  `columnAdvance`.

**The seed is the same state by two routes that cannot disagree, because the
route is one function.** `paginateScore` hands the renderer
`incomingAccidentals` for a rebased slice, computed with `accidentalStateAtEndOf`.
`sliceWidth` asks about a measure range of an UNSLICED score, so there is no
such option and the walk makes the same call itself.

The two call sites:

- `staff-renderer.ts:1416`, the renderer, now passes `{ ...options, clef }` and
  `analyzed`. **Passing the clef matters on its own**: this call took raw
  `options`, so before N.103 a slice was packed under whatever `chooseClef` made
  of the unsliced score. Nothing in the advance depended on the clef until now.
- `page-layout.ts:128`, `sliceWidth`, takes `analyzed` as a fifth argument, and
  `paginateScore:199` passes `renderOptions` (resolved clef included) and
  `analyzed` where it used to pass raw `options` and nothing.

`analyzed` is optional at both, and its absence is correct rather than degraded:
a score with no measured voice draws no turning layer, so there is no turning
ink to measure. A test asserts that withholding it makes `sliceWidth` smaller
than the render, which is the regression the threading exists to prevent.

Nothing derived is stored. Ink is computed at layout, every time, and written
nowhere.

---

## 3. The tests

`staff-renderer.test.ts:824-945`, `columnInk`:

| case | assertion |
|---|---|
| bare quarter | head half-width left, and the up-stem's edge right |
| required flat | `headHalf + 1.5 + accidentalW` on the left |
| courtesy | `headHalf + 1.5 + courtesyClusterW`, and the cluster is wider than the bare natural |
| dotted | `headHalf + dotClear + dotW` on the right, left untouched |
| displaced turning unit | `sungRight + 1.6 + TURNING_CLEARANCE_SP × lineGap + turningHeadW`, and `turningDisplaced` is true |
| aligned turning unit with an accidental | the accidental on the LEFT, the right untouched, `turningDisplaced` false |
| rest | its own glyph half-width, never zero |
| primitive mode | real widths for accidental, courtesy cluster, and turning head |

`staff-renderer.test.ts:947-1010`, the ink term: two eighths whose first carries
a displaced turning unit advance by exactly `right + left + TURNING_TRAIL_SP ×
lineGap`; two columns with sung ink only by exactly `right + left + INK_CLEAR_SP
× lineGap`; the same pair advances further with lavender than without; the
advance is exactly the rhythm term when the ink term is smaller; and a caller
that measures no ink gets less than one that does.

`page-layout.test.ts:266-390`: a twelve-bar run of eighths packs fewer measures
per system and takes more systems once its columns carry turning ink; a sole
unstretched system's rendered width equals `sliceWidth` to nine places;
withholding the analysis makes `sliceWidth` smaller than the render, which is
the regression guard; and the control, a page whose ink term never binds, packs
and renders to the same number twice.

**One existing assertion moved.** `staff-renderer.test.ts:305`, the
measure-opening turning accidental on the demo, reads `x="761.25"` where it read
`x="761"`. On that fixture `n11` carries a displaced turning unit, so the advance
to the rest after it now answers to `TURNING_TRAIL_SP` and grew by a quarter of a
pixel, which every column after it inherits. **That single column is the only
place the ink term binds on the demo**, which is why one assertion moved and not
twenty.

---

## 4. The walk, on Without Sun song 1

Two local production builds, walked at 1400 × 900 on
`pnpm --filter @ilya/web preview`, on
`tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/repaired/score.repaired.musicxml`
staged into `apps/web/static/reader/` and deleted afterwards.

- BEFORE is the build already on disk from the N.106 session, confirmed to
  predate this change by the absence of `turningDisplaced` from its bundle.
- AFTER is `ilya-1788332479580`, built from this tree, confirmed by the presence
  of `turningDisplaced` in `build/_app/immutable/chunks/DoPzwHGz.js`.

The voice is the fabricated demo bass profile the N.106 memo used, seeded into
`localStorage` under `shane.profiles.v2` and cleared afterwards. **It is not a
singer.** Both walks used the same profile, so the comparison is honest even
though the page is not a page any singer sees. 95 turning noteheads on both.

### The «лё ко» pair

`m12-9-8` then `m12-5-4`, in bar 13, the two eighths Dann read as cramped.

| | before | after |
|---|---|---|
| ink-to-ink clearance | **−4.38 units** | **18.92 units** |
| system | `12-14` | `12-13` |

Negative means the first column's rightmost ink and the second column's leftmost
ink overlapped in x. They did not collide, because they sit 8.25 units apart
vertically, but the lavender head stood inside the next note's column and read as
belonging to it. Both screenshots were taken at 3x with a 12x companion, cloned
from the page's own system window into a fixed overlay. **The overlay draws the
nodes the page draws.** No page source was changed to look at it, and the
overlay was removed afterwards.

### The narrowest ink-to-ink clearance on the page

Measured over all adjacent column pairs within a system, from real ink edges off
the live DOM.

| | before | after |
|---|---|---|
| adjacent pairs measured | 89 | 88 |
| narrowest | **−4.38** (`m12-9-8` → `m12-5-4`) | **4.05** (`m17-3-8` → `m17-1-2`) |
| second narrowest | −0.69 (`m6-1-2` → `m6-3-4`) | 7.94 (`m5-0-1` → `m5-1-4`) |
| third narrowest | 1.53 (`m10-9-8` → `m10-5-4`) | 8.78 (`m5-9-8` → `m5-5-4`) |
| pairs under half a stave space (2.75) | **5** | **0** |
| median | not recorded before | 28.99 |

The pair count fell by one because the page gained a system break, and a break
removes an intra-system pair.

### Measures per system, and the page count

| | before | after |
|---|---|---|
| systems | 7 | 8 |
| bars per system | 3, 3, 3, 3, 3, 2, 1 | 3, 3, 2, 2, 2, 2, 2, 2 |
| pages | **2** | **2** |
| systems per page | 6 then 1 | 6 then 2 |

The two systems that keep three bars, `0-2` and `3-5`, are the two whose columns
carry the least turning ink. Every system from bar 7 onward dropped from three
bars to two. The piece still fits on two pages.

### The control

**Bar 18, measure index 17.** It carries no displaced turning unit and no
courtesy accidental. Its two intra-bar advances, `m17-0-1` → `m17-3-8` →
`m17-1-2`:

| | before | after |
|---|---|---|
| first advance | 41.25 | **41.25** |
| second advance | 17.78 | **17.78** |

Identical to the digit. The bar moved on the page, because packing now puts it
with bar 17 instead of alone, but nothing inside it moved.

**It is not quite the control the brief asked for.** The brief wants a system
with no displaced turning units, no courtesies, AND no dots. No such system
exists on this document: bar 18's first note is dotted, and every system carries
at least one dot. What the numbers show is the same thing by a narrower route:
where the ink term does not bind, including on a dotted column, the spacing is
unchanged. The zero-ink case is asserted to the digit in
`page-layout.test.ts` instead.

### No user-facing string was added or changed. No French was coined.

---

## 5. Gates

| gate | baseline | after | moved |
|---|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` | no |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` | no |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same | no |
| 4 web-test | `920 passed (920)` | `920 passed (920)` | no |
| 5 score-parser | `511 passed \| 5 skipped (516)` | `528 passed \| 5 skipped (533)` | **yes, +17** |

`npx tsc --noEmit` over `packages/score-parser` exits 0.

**One line of `~/Downloads/ilya-ship.sh` must change, and it is line 80.** I did
not edit that file.

```
gate 5 score-parser "511 passed | 5 skipped (516)"              pnpm -C "$REPO" --filter @ilya/score-parser test
```

becomes

```
gate 5 score-parser "528 passed | 5 skipped (533)"              pnpm -C "$REPO" --filter @ilya/score-parser test
```

The +17 is seventeen new tests: eight on `columnInk`, five on the ink term, four
in `page-layout`. One existing assertion changed its number in place and adds
nothing to the count.

---

## 6. Citations this edit moved

Line references in comments and in the brief that this change invalidated, and
where the thing now lives:

- `columnAdvance` was `staff-renderer.ts:758-775` in the brief's §2. It is
  `:1127-1168`.
- The required accidental was the `:1372-1395` region in the brief's §2. It is
  `:2007-2032`.
- The augmentation dots were `:1662-1715`. They are `:2121-2185`.
- The turning unit was `:1796-1871`. It is `:2222-2321`.
- `advanceAccidentalState` was cited at `:348`. It is `:377`.
- `staff-renderer.test.ts:305`, the measure-opening turning accidental, now
  reads `x="761.25"`, and its comment says why.
- The N.106 memo's §1 cites `TURNING_CLEARANCE_SP` at `:155-168` and
  `PRIMITIVE_TURNING_ACC_W` at `:575-582`. Those moved to `:155-168` (unchanged)
  and `:585-593`.

Nothing was deleted. `headNameFor` inside the renderer is now an alias for a
module-level `headNameOf`, and `round2px` at module level is the same rounding
the renderer's own `round2` does, hoisted so `inkMetrics` can use it.

---

## 7. NOT ESTABLISHED

- **That 0.5 and 1.0 stave spaces are right.** Both are desk defaults. 0.5 is
  argued from Gould r235's text floor by analogy, and the analogy is mine: r235
  is about syllables, and I have not read a rule that says an accidental and a
  dot answer to the same number. 1.0 is Dann's ratio, four times the leading
  gap, chosen for the meaning rather than measured from a page. **Both are his
  to set by eye now that the page exists.**
- **That the ratio is the right instrument.** The ruling says the gap after the
  biglyph must be visibly larger than the gap before it. It is now 1.0 against
  0.25 in stave spaces, which at the production stave is 5.5 units against 1.375.
  Whether four times reads as "this belongs to the note on its left" or merely as
  "these two notes are far apart" is Dann's eye. Nothing here measured
  legibility.
- **The measure-opening nudge is not modelled in `columnInk`.** The draw loop
  holds a measure-opening accidental off the barline at `nx - 16`, which makes
  its ink narrower on the left than `columnInk` reports. Reporting the un-nudged
  width is conservative for a minimum, and a measure opening gets
  `BARLINE_ROOM` on top of the advance regardless, so nothing is crowded. It
  does mean the first column of a bar is measured slightly wider than it draws.
- **The stem side at layout time is the analysis's, then Gould's positional
  default, never the beam's.** The beam pass has not run when `layoutColumns`
  walks, and cannot. A beamed note with NO analysis therefore takes the
  positional answer in the measurement and the beam's answer on the page, worth
  at most `stemHalfUp + stemT / 2 - headHalfW`, which is 0.05 px at the
  production stave. Both call sites make the same call, so pagination and
  rendering still agree with each other. A note WITH analysis is never affected,
  because the timbre rule outranks the beam.
- **Primitive mode's widths are reconstructions.** `accidentalW` returns 12.3 and
  `courtesyClusterW` returns 17.3, which are the widths the mode's own
  hard-coded `nx - 20` and `nx - 25` already implied against the same head
  half-width and clearance. They are exact for the placements that existed and
  are the same assumption carried forward for the ink term. No font measured
  them.
- **The trailing advance past the last column spends the clearance against
  nothing.** With no next column there is no `nextInk`, so the ink term is the
  previous column's own ink plus the clearance. That keeps a displaced turning
  unit off the barline it runs into, which seems right, and nobody ruled it.
- **Two adjacent displaced turning units are not coordinated**, which is N.106's
  open item and not closed here. Each unit is still placed from its own sung
  note; N.103 only guarantees the space AFTER one.
- **The walk's profile is fabricated**, so which columns carry displaced turning
  ink on this document is an artifact of the numbers seeded. The before-and-after
  comparison is sound because both walks used the same profile. The absolute
  claim "this document needs 8 systems" is not.
- **Whether losing a bar per system is acceptable.** Bars 7 to 18 dropped from
  three per system to two, which is a third more systems for the same music.
  The page count held at two here. On a longer song it will not always, and
  nobody has ruled what the trade is worth. **Lowering `TURNING_TRAIL_SP` is the
  dial**, and it is Dann's.
- **The narrowest gap before the change was not measured on the N.106 walk.**
  The N.106 memo measured turning ink against other ink and found no collision
  within a stave space; it did not measure adjacent-column ink-to-ink clearance.
  The "before" numbers here come from re-walking that build today, not from that
  memo.
