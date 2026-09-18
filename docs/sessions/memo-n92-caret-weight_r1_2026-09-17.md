# Memo: the caret's weight, and its clearance from the squircle

**Reply to `brief-n92-caret-weight_r1_2026-09-17.md`.** Built in Claude Code,
branch `Shane`, on top of `f4e31a2`. Nothing else changed the tree this
session, and no commit was made. **WRITTEN, not DONE**: section 5 below says
exactly where this stands against the brief's own definition of done.

## 1. What changed, by file and line

**`apps/web/src/lib/shane/Loupe.svelte`.**

- **The squircle's query is hoisted** (`:1194`) to a point before the caret
  block, so both the carets and N.141's own ring drawing (unmoved, further
  down) read `pageRing` from one query rather than two. Its own geometry, its
  own consumer at its own place, are both untouched.
- **The weight, plate C** (`:1325-1336`): `armLen` `lineGap * 0.6` (was `1`),
  `armHalf` `lineGap * 0.34` (was `0.8`), colour `#6A655F` (`--ink-tertiary`,
  was `#9585a2` the lavender), stroke width `stave.lineWidth` (was the flat
  literal `1`). The whole mark, line and both arrowheads, is wrapped in one
  `<g opacity="0.32">` (`:1358`) rather than opacity on each shape, so three
  overlapping fills composite once instead of stacking.
- **The clearance, plate D** (`:1286-1323`): for each gap, if its x sits
  within 1.2 line-gaps of the taken note's squircle stroke, it moves outward
  (away from the squircle's own centre) to the edge of that band, clamped so
  it never advances far enough to sit within `hitHalf` of a neighbouring
  note's own hit-rectangle centre. §2 is the exact arithmetic and why the
  clamp needed that margin, which the brief did not ask for and which
  testing found necessary.
- **`hitHalf`** (`:1285`), the caret's own hit-rectangle half-width, is
  computed once, before the clearance, and read in two places: by the clamp
  (§2) and by the hit rectangle itself, which used to declare an identical
  second copy of the same line further down. That second declaration is
  gone. One number, read twice, is what clause 4's own "the caret's hit
  rectangle moves with the drawn mark" means in practice.

**No new files, no new tests.** This ship changes rendering geometry inside
one component's effect. Nothing here is pure logic in the sense `entry.ts`'s
functions are, so nothing here has its own unit test, matching the first
caret ship's own precedent.

## 2. The clearance's clamp: why it needed a margin beyond the brief's own words

The brief's clamp rule reads: *"if the full 1.2 would carry the caret onto a
neighbouring note's own hit rectangle, the caret holds short of that note
instead."* My first build read this as "stop the push at the neighbour's own
hit-rectangle **centre**", and built exactly that.

**It broke tapping.** MEASURED live on the fixture
(`tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/score.mxl`):
selecting `F♯3 · Quarter · серд` in measure 8 clamps the gap after it,
because that note's squircle (widened by the sharp) reaches close enough to
its neighbour that the full 1.2 would have crossed into it. Clamping to the
bare centre put that gap's hit-rectangle centre and its neighbour NOTE's hit-
rectangle centre `0.00003` system units apart, a separation smaller than a
real `MouseEvent.clientX` even reports (the DOM rounds it to a whole CSS
pixel), so `nearestTarget` had nothing reliable to compare. A synthetic tap
dead centre on the caret resolved to the NOTE, not the gap: **DoD 3, failed,
on my own first build.**

**The fix**: the clamp now stops the push `hitHalf` short of the neighbour's
own centre (on whichever side the push is moving toward) rather than at the
bare centre, so the caret's OWN hit rectangle's near edge touches the
neighbour's centre instead of the caret's centre landing on it.
Re-measured after the fix: the same two rectangles' centres sit **22 CSS
pixels apart** (`hitHalf` converted through `scale`, the same conversion the
hit rectangle's own width already uses), and the same synthetic tap now
resolves to the gap. I did not keep a tap-pool ordering fix I tried first
(gaps checked before notes in `nearestTarget`'s array): that changes who
wins a genuine exact tie, and the real problem was never a tie. It was two
targets close enough that no tap can aim at one over the other. The margin
is the fix. Ordering was a red herring, tried and removed.

**Which measures hit the clamp.** Walked the entry-and-gap stepper across
the whole fixture, comparing every gap's rendered x against the band edge it
would have taken unclamped, for every note that carries a squircle:

- **m. 8**, the note `F♯3 · Quarter · серд`: the gap after it clamps.
- **m. 9**, the note `F♯3 · Eighth · на`: the gap after it clamps.

Both are sharps. No other measure in the fixture triggered the clamp on
either side of any note I walked to (the stepper reached every measure from
`m. 2` to `m. 18`). **NOT ESTABLISHED** whether the pattern (an accidental
widening the squircle enough to reach a close neighbour) generalizes, since
this fixture's only two clamp cases are both sharps in adjacent bars of the
same phrase. I did not build a second fixture to test a flat, a natural, or
a double accidental in isolation.

## 3. Live walk

`pnpm dev`, the same fixture, fed via a synthetic `DragEvent`/`DataTransfer`
drop (staged and removed from the gitignored `apps/web/static/reader/`).

- **Weight.** Selected a note in m. 2: every caret drew as a fine warm-grey
  hairline with a small arrowhead, read via DOM as `stroke="#6A655F"`,
  `stroke-width="0.5"` (the fixture's own sampled stave line), inside a
  `<g opacity="0.32">`. Visually the squircle is now unambiguously the
  featured mark. The carets read as a fine grid line, not a picket fence.
- **Clearance, the unclamped case.** Selecting the very first note of m. 2
  (whose squircle sits close to both the head gap and the gap after it):
  both flanking carets' rendered x matched the band edge formula
  (`ringX - stroke/2 - 1.2·lineGap` and the symmetric right form) to full
  floating-point precision. No clamp needed on either side there.
- **Clearance, the clamped case, and the fix.** §2's numbers, confirmed live
  before and after the fix.
- **DoD 3, re-confirmed.** Tapping the clamped caret after m. 8's `серд`
  read `after серд · the next duration enters here`. Tapping m. 9's clamped
  caret read `after на · the next duration enters here`. Both correct.
- **A plain note tap beside a clamp zone still selects that note.** Tapped
  `m7-1-1` directly (the very note the m. 8 clamp measures against):
  resolved to it, not to the gap.
- **A plain, unrelated note tap elsewhere still works**: tapped a note in
  m. 15, resolved correctly.
- No console errors across the walk.

## 4. Gate table

| gate | baseline (`f4e31a2`) | after |
|---|---|---|
| phonology | 216 passed | 216 passed, untouched |
| dictionary | 235 passed | 235 passed, untouched |
| score-parser | 567 passed, 5 skipped (572) | 567 passed, 5 skipped (572), untouched |
| web-test | 1265 passed | **1265 passed, unchanged**: no new test file, §1 |
| web-check | 0 errors, 12 warnings, 5 files | **0 errors, 12 warnings, 5 files, unchanged** |

No gate moved. Gate 4's baseline is not touched, so nothing needs moving in
`ilya-ship.sh`.

## 5. Definition of done, walked against

1. **Yes.** Every caret reads warm grey (`#6A655F`) at `0.32` opacity, a
   hairline (the stave's own sampled width), with the smaller arrowheads.
2. **Yes, with the margin in §2 counted as part of the rule rather than a
   violation of it.** No caret's drawn mark stands within 1.2 line-gaps of
   the squircle's stroke UNLESS the clamp fired, in which case it stands
   exactly at the clamp (short of the neighbour's hit-rectangle centre by a
   full `hitHalf`), which is the brief's own named exception. No caret's
   rendered x ever equals or crosses a neighbouring note's hit-rectangle
   centre. The clamp exists precisely to guarantee that.
3. **Yes, after the fix in §2.** Tapping a moved caret, clamped or not,
   selects the same gap it always named. Confirmed for both clamp cases in
   the fixture and for the general (unclamped) push case.
4. **Yes.** All five gates, this session: phonology 216, dictionary 235,
   score-parser 567 passed + 5 skipped (572), web-test 1265 (unchanged),
   web-check 0 errors, 12 warnings, 5 files (unchanged). Gate 4's baseline
   does not move, so `ilya-ship.sh` needs no edit.

## 6. What I could not establish

- Whether the clamp pattern found in §2 (an accidental widening a squircle
  enough to reach a close neighbour) generalizes beyond sharps, or beyond
  this one fixture. Only two occurrences were found, both sharps, both in
  the same short phrase.
- Whether `hitHalf`'s specific size (the 44 px floor, §2) is the right
  margin to protect against this class of tie, as opposed to some smaller
  number that would still separate the two targets comfortably while
  clamping less aggressively. I picked the number already in scope (the
  same one the hit rectangle's own width already uses) rather than tuning a
  second one, since it already produced a comfortable, measured 22 px
  separation on both fixture cases.
- Whether a measure exists, in some other score, where the squircle is wide
  enough that BOTH its clearance band AND the `hitHalf` margin together
  would exceed the room between two very close neighbouring notes, forcing
  the clamp itself into a contradiction (nowhere to stand that satisfies
  both). Not encountered on this fixture, and not proven impossible.

## 7. Files to `git add`

No new source files. One existing file changed:

- `apps/web/src/lib/shane/Loupe.svelte`

`docs/memory/OPEN.md` was already modified when this session started,
carrying the brief's own clause 4 ruling. It was not touched further here.

One new file, this memo: `docs/sessions/memo-n92-caret-weight_r1_2026-09-17.md`.
