# Memo: N.106, the turning unit keeps to the right of the sung unit

Built 2026-09-02 against `e7c2e43`, 'N.102: the courtesy survives the system
break'. The working tree was dirty at the start with `docs/memory/INBOX.md`,
`docs/memory/PRODUCT.md`, and `docs/memory/STATE.md`, and nothing else.

Gould r103's rising diagonal is retired for the turning layer. A turning pitch at
a unison or a second now takes its accidental and its head with it to the RIGHT
of everything the sung note owns, and it never goes left. On Without Sun song 1
there are **22 such notes**, every one of them displaced right, every one of them
at the same **2.97 units** of clearance, and **no mark of either unit touches the
other or anything else on the page**. Nothing in the sung line moved.

**One thing in your ruling had to be corrected to keep the rest of it**, and it
is in §2: the predicate you named for "a third or more" reads a third as a
second, because a stave step is half a stave space.

---

## 1. What changed

One source file and its test file.

### The constant

`packages/score-parser/src/staff-renderer.ts:155-168` adds
`export const TURNING_CLEARANCE_SP = 0.25`, in stave spaces, beside
`COURTESY_GAP_SP`. It is exported so the tests read the number the renderer
draws. It is added to the 1.6 px the two-voice offset has always carried, so the
displacement is `1.6 + TURNING_CLEARANCE_SP × lineGap` and the two numbers stay
legible as what they are: the old offset, and the air you asked for on top of it.

JUDGEMENT, and it carries no rule number. Gould's own two-voice spacing is a
chord's, and N.106 is the ruling that this layer is not a chord.

### The principle, in the file

`:1796-1839` carries your words as the block's opening, quoted:

> a sung note's accidental, notehead, and augmentation dots are ONE SEMANTIC UNIT
> (his term, a "TRIGLYPH"), the turning note's accidental and head are another (a
> "BIGLYPH"), and NO MARK FROM ONE UNIT MAY SIT INSIDE THE OTHER.

The same block records that Gould 103's rising diagonal is retired for this
layer, on your ruling of 2026-09-02, and why: r103 spaces the two notes of a
second inside one voice's chord, where the pair is read as a single shape. Here
the two marks belong to different voices and different alphabets, and the
diagonal sent a lower turning note left, through the sung note's own accidental
and across the place a singer reads the sung pitch from.

### The geometry

`:1840-1858` is the whole rule.

```ts
const gap = Math.abs(ty - y);
const steps = Math.round(gap / half);
const tHeadW = smufl ? sp(smufl.glyph('noteheadBlack').widthSp) : 12.4;
const tAccW = !drawsAcc ? 0 : smufl ? sp(smufl.glyph(accName!).widthSp) : PRIMITIVE_TURNING_ACC_W;
const tAccGap = drawsAcc ? 1.5 : 0;

let tx: number;
if (steps > 1) {
  tx = nx;
} else {
  const stemmed = ev.duration.base !== 'whole' && ev.duration.base !== 'breve';
  let sungRight = nx + headHalfW;
  if (stemmed && stemUpFor(ev, y)) sungRight = Math.max(sungRight, nx + stemHalfUp + stemT / 2);
  sungRight = Math.max(sungRight, dotsRight);
  tx = sungRight + 1.6 + sp(TURNING_CLEARANCE_SP) + tAccW + tAccGap + tHeadW / 2;
}
```

`sungRight` is the rightmost ink the triglyph owns: the notehead, the
augmentation dots where there are any, and an up-stem, which stands on the right
of the head. A down-stem is on the left and a whole note has none.

The accidental then hangs immediately left of the turning head at `:1860-1871`,
inside the unit, at `tAccGap`, which is the 1.5 px the sung line already uses
between its own head and its own accidental. In the aligned case that arithmetic
reduces to exactly what the file drew before, on both modes, which is why the
existing measure-opening test still reads `x="761"` unchanged.

**A flag is not counted.** It flies from the stem tip, a stave and more from the
turning unit's own height, so it can never be ink the biglyph sits inside.

### Primitive mode

Runs the same rule with its 12.4 px width, as ruled. It has no font to measure,
so `:575-582` adds `const PRIMITIVE_TURNING_ACC_W = 11.3`, which is the width the
mode's own hard-coded `nx - 19` already implied: the 12.4 px head's half-width,
then the same 1.5 px of clearance. Stating it as a width is what lets primitive
mode run one rule instead of a second one, and it keeps an aligned primitive
turning accidental on the pixel it always had.

### The dots

`:1721-1737` hoists the last dot's right ink edge into `dotsRight`, so the
turning block can read it. **The blocks were already in the right order**: the
augmentation-dot block has stood ahead of the turning layer since 2026-08-28, so
nothing was reordered and no other pass moved. The comment on `dotsRight` says
why the order matters, so a later edit cannot swap them without reading the
reason.

---

## 2. The correction inside the ruling

Your ruling names the predicates `gap > o.lineGap` for "a third or more" and
`gap <= o.lineGap` for "a unison or a second". Those are the predicates the file
already carried. **They do not mean what they say**, because a stave STEP is half
a stave space: `yFor` moves a pitch by `half`, which is `lineGap / 2`. A second
measures `lineGap / 2` and a third measures exactly one `lineGap`, so
`gap <= o.lineGap` catches thirds along with seconds.

Taken literally, your predicate would have displaced every third, and your own
test list says a third aligns. The intent is unambiguous, so the interval is
counted in stave steps and `steps > 1` aligns. `a third aligns` is a test.

This also means the OLD rule was displacing thirds, and a lower third was going
left. No fixture in the suite held a third with a turning pitch, so nothing
caught it, and no page had a measured voice on it to show it. It is fixed as a
side effect of stating the interval properly.

---

## 3. The tests

Beside the existing turning-layer block, at
`packages/score-parser/src/staff-renderer.test.ts:313-467`, in primitive mode
throughout so every number is arithmetic you can check rather than a font's
report. Each case builds one bar with one sung note and chooses the turning pitch
by construction: the engine takes it as `hzToPitch(fR1 / 2)`, so naming the pitch
and doubling its frequency lands it at whatever interval the case needs.

| case | what it asserts |
|---|---|
| unison | `turningCx = nx + 6.25 + 1.6 + 3 + 6.2`, and right of `nx` |
| second above | displaced right, off the notehead's edge |
| second below | displaced right, and **not** left; within 0.05 of where a second above lands |
| third | `turningCx = sungCx`, the boundary §2 corrects |
| dotted sung note, turning second | the unit's left edge is the dot's right edge plus the clearance, and the dot sits where it sits when nothing is displaced |
| turning second with an accidental | the accidental is at `nx + 6.25 + 1.6 + 3`, right of `nx`, with the head 11.3 + 1.5 + 6.2 beyond it |
| turning third with an accidental | head aligned at `nx`, sharp at `nx − 19`, left of the head, as today |

Two existing tests asserted the retired rule and were rewritten in place, not
deleted: the unison at `:281` now reads `cx="323"` where it read `cx="320"`, and
`:291` asserts `cx="677.05"` and `expect(svg.includes('cx="646"')).toBe(false)`
where it used to assert the leftward 646.

**A detail the second-above and second-below cases surfaced, and it is real.**
They land 0.05 apart, not on the same pixel. A turning pitch above the sung note
makes the timbre open, which forces the sung stem down, and a down-stem is on the
left of the head, so the sung unit's right edge is the notehead's rather than the
stem's. One rule, two different sung edges. The test states it rather than
rounding it away.

---

## 4. The walk, on Without Sun song 1

`pnpm --filter @ilya/web build` succeeds (`stamp-sw: CACHE_VERSION is now
ilya-1788330105842`). The walk is on that production build served by
`pnpm --filter @ilya/web preview` at port 4173, viewport 1400 × 900, on
`tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/repaired/score.repaired.musicxml`
staged into `apps/web/static/reader/` before the build and deleted afterwards,
read off the live DOM. The page renders 18 bars over seven systems on two pages,
`lineGap` 5.5 units.

**The document carries no measured voice, so a fabricated one was seeded to make
the layer draw at all.** `memo-n102-courtesy-accidentals_r1_2026-09-02.md` §5
records the same fact from the other side: no lavender reached the page then, and
the turning layer was untested by that walk. Here the profile written into
`localStorage` under `shane.profiles.v2` is the project's own demo BASS profile
from `demo-fixture.ts:63` (fR1 a 650, o 450, u 350, i 300, e 400, ɛ 500, ɑ 622,
with ɪ 380, ɨ 330, ʌ 600 added for the vowels this text reaches), range C2 to E4,
tessitura F2 to C3. **It is not a singer.** It was cleared when the walk ended.
What the walk therefore proves is the geometry on real notation, not that this
page is what any particular singer sees.

The page draws **95 turning noteheads**. By interval: 9 unisons, 13 seconds, 15
thirds, and 58 wider.

### Every sung note whose turning pitch is a unison or a second

All 22 displaced right. `moved` is the turning head's centre minus the sung
head's centre, in page units. `clearance` is the turning unit's left ink edge
minus the sung unit's right ink edge, measured off the live DOM.

| # | event | interval | moved | clearance | what governs the sung edge |
|---|---|---|---|---|---|
| 1 | `m1-0-1` | unison | 9.97 | 2.97 | notehead |
| 2 | `m1-3-4` | unison | 9.97 | 2.97 | notehead |
| 3 | `m3-1-4` | second above | 9.97 | 2.97 | notehead |
| 4 | `m4-0-1` | unison | 9.97 | 2.97 | notehead |
| 5 | `m6-0-1` | unison | 9.97 | 2.97 | notehead |
| 6 | `m6-1-2` | second below | 15.10 | 2.97 | up-stem, and the unit leads with a sharp |
| 7 | `m9-1-4` | unison | 9.97 | 2.97 | notehead |
| 8 | `m9-1-2` | second below | 9.97 | 2.97 | up-stem |
| 9 | `m9-1-1` | unison | 9.97 | 2.97 | notehead |
| 10 | `m10-1-2` | second below | 9.97 | 2.97 | up-stem |
| 11 | `m10-3-4` | unison | 16.38 | 2.971 | **the dot** |
| 12 | `m10-9-8` | second below | 9.97 | 2.97 | up-stem |
| 13 | `m11-3-4` | second below | 9.97 | 2.97 | up-stem |
| 14 | `m12-9-8` | second above | 9.97 | 2.97 | notehead |
| 15 | `m13-1-4` | unison | 9.97 | 2.97 | notehead |
| 16 | `m13-1-2` | second above | 9.97 | 2.97 | notehead |
| 17 | `m13-3-4` | second below | 16.38 | 2.971 | **the dot** |
| 18 | `m13-9-8` | second below | 9.97 | 2.97 | up-stem |
| 19 | `m14-1-4` | unison | 9.97 | 2.97 | notehead |
| 20 | `m14-1-2` | second above | 9.97 | 2.97 | notehead |
| 21 | `m14-3-4` | second below | 16.38 | 2.971 | **the dot** |
| 22 | `m14-9-8` | second below | 9.97 | 2.97 | up-stem |

The clearance is `1.6 + 0.25 × 5.5 = 2.975` by arithmetic. The DOM reads 2.97 and
2.971, and the hundredth is the difference between the glyph's ink box and the
advance width the renderer places from.

Nine of the 22 are seconds BELOW. Every one of them used to go left.

### The three cases you asked to see

Each is cloned from the page's own system window into a fixed overlay with a
tight viewBox, at 3x with a 12x companion, the same instrument as N.102's walk.
**The overlay draws the nodes the page draws.** No page source was changed to
look at it, and the overlay was removed afterwards.

- **A second below**: `m9-1-2`, viewBox `120.05 77.5 34 26`. The lavender head
  sits clear to the right of the sung head and one step down. Under the retired
  rule it sat to the left.
- **A dotted case**: `m10-3-4`, viewBox `333.31 72 44 26`. Flat, notehead, dot,
  then the lavender head, in that order left to right, nothing overlapping. The
  dot is where it was.
- **An accidental on the turning pitch**: `m6-1-2`, viewBox `113.56 73.75 44 28`.
  The lavender sharp leads the unit, right of the sung notehead, with the
  lavender head immediately right of the sharp. Before N.106 that sharp was drawn
  at the sung note's own left.

### Nothing collides

A sweep over the two page SVGs pairs every turning mark against every other
event's ink, in a common coordinate frame, comparing x from `getBBox` and y from
the mark's own attribute. **Zero pairs share x while sitting within one stave
space of each other.** Where a turning mark does share x with another event's
mark at all, the nearest in y is **8.25 units**, three stave steps, at `m6-1-2`
against `m6-3-4` and at `m12-9-8` against `m12-5-4`.

### The aligned notes did not move

All 73 turning heads at a third or more sit at `moved` of 0 or 0.001, and all 19
that carry a turning accidental still draw it to the LEFT of the sung head's left
edge. Nothing in the sung line moved anywhere on the document: `nx` comes from
`layoutColumns`, which N.106 does not touch and which has never known the turning
layer exists.

---

## 5. Gates

| gate | baseline | after | moved |
|---|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` | no |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` | no |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | not re-run, no web source touched | n/a |
| 4 web-test | `920 passed (920)` | `920 passed (920)` | no |
| 5 score-parser | `504 passed \| 5 skipped (509)` | `511 passed \| 5 skipped (516)` | **yes, +7** |

`npx tsc --noEmit` over `packages/score-parser` exits 0.

**One line of `~/Downloads/ilya-ship.sh` must change, and it is line 80.** I did
not edit that file.

```
gate 5 score-parser "504 passed | 5 skipped (509)"              pnpm -C "$REPO" --filter @ilya/score-parser test
```

becomes

```
gate 5 score-parser "511 passed | 5 skipped (516)"              pnpm -C "$REPO" --filter @ilya/score-parser test
```

The +7 is seven new tests. Two existing tests were rewritten in place, so they
add nothing to the count.

---

## 6. NOT ESTABLISHED

- **That 0.25 stave-spaces is right.** It is your number, ruled 2026-09-02, and
  it carries no rule number. The Gould extraction is not on this machine, so I
  cannot say whether the book gives a figure for the air between two voices'
  marks, and I did not look for one. At the page's own 5.5 unit `lineGap` the
  clearance is 2.97 units, and **whether that reads as air or as crowding is your
  eye, not a measurement.** The 3x panel is the closest thing here to the page's
  own size.
- **That the 1.6 should survive at all.** It is the offset the two-voice rule
  carried from 2026-07-12, and your ruling keeps it by naming it. Nobody has
  asked whether 1.6 plus a stave-relative clearance is one number too many.
- **Column spacing does not reserve room for a displaced turning unit, and never
  has.** `columnAdvance` knows the sung underlay and the duration, and nothing
  about the turning layer. N.106 widens the ink a turning unit can occupy on the
  right by the accidental's width plus 1.5 plus the clearance, so a dense passage
  where a turning second carries an accidental could crowd the next column. It
  does not on Without Sun song 1: §4's sweep finds nothing within a stave space.
  It is a real gap and it is yours to rule, because closing it means teaching the
  layout pass an analysis-layer measurement.
- **The primitive turning accidental's 11.3 px width is a reconstruction, not a
  measurement.** It is the width the mode's own `nx - 19` implied. It is exact
  for the aligned case by construction, and for a displaced one it is the same
  assumption carried forward.
- **Two turning units in adjacent columns are not coordinated.** Each is placed
  from its own sung note only. Two consecutive displaced units cannot collide
  with each other on this document, but nothing in the rule prevents it at a
  tighter spacing.
- **The flag is excluded by reasoning, not by measurement.** A flag on an
  up-stem does extend right of the stem; it sits at the stem tip, about a stave
  above or below the notehead, so it cannot meet a turning unit placed at the
  turning pitch's own height. That holds while a turning pitch is within a second
  of the sung note, which is the only case that displaces. It would stop holding
  if the displacement rule ever widened.
- **What a walk on a real measured voice shows.** §4's profile is fabricated, so
  which notes fall at a unison or a second on this document is an artifact of the
  numbers I seeded. The geometry is the page's; the census is not a claim about
  any singer.
- **Whether a displaced turning unit should push the sung line's own spacing.**
  It does not. Your ruling says nothing in the sung unit moves, and nothing does.
  Recorded because the alternative, widening the column, is the other way this
  could have been built.
