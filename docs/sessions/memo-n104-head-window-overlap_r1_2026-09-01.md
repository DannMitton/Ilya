# Memo: the loupe's head and window no longer overlap

Written 2026-09-01 against
[brief-n104-head-window-overlap_r1_2026-09-01.md](brief-n104-head-window-overlap_r1_2026-09-01.md),
after Dann's walk of `510a280`. Floor: `510a280`, "N.104: the loupe's head
carries the whole clef and key".

The window now opens where the head stops. On all six measures that open a
system, the loupe paints the clef and **exactly two** sharps, measured. Nothing
in the window's own reading of the music changed, and the seven mid-system
windows are identical to the digit. **Gate 4 moves from `908 passed (908)` to
`914 passed (914)`**, from six tests I added. §7 carries the line Dann has to
approve before the ship.

The build is WRITTEN. The walk is his.

---

## 1. What changed

Three files, all under `apps/web/src/lib/shane/`. The renderer is untouched,
`VocalLineEvent` is unchanged, and nothing under
`apps/web/src/lib/shane/reconciliation/` was read or changed.

### `loupe.ts:353-398`, one new exported function

```ts
export function clipToHead(win: MeasureWindow, head: number): MeasureWindow {
	if (!Number.isFinite(head) || !(head > win.left)) return win;
	return { left: Math.min(head, win.right - 1), right: win.right };
}
```

Its comment carries the whole coupling: what the two quantities are, that they
were one number by construction until 2026-08-29, what Dann walked, the proof
that clipping loses nothing, and why the clamp cannot bite today. The brief
asked for a comment naming the coupling, and it lives here rather than at either
site, because a rule written at one of two sites is a rule the other one can be
changed without reading.

**Both sites now point at it.** `measureWindow`'s doc comment (`loupe.ts:73-75`)
and `headBound`'s (`loupe.ts:343-345`) each carry three lines saying the two are
coupled, must not overlap, and that `clipToHead` holds the rule.

### `Loupe.svelte:583-598`, the clip applied

```ts
const view = clipToHead(win, headWidthUnits);
const viewSpan = view.right - view.left;
```

`view` and `viewSpan` then feed the three things that draw the loupe:
`totalSpan` (`:617`), `contentWidth` (`:620`), and the window's `viewBox`
(`:807`). One line was added to the import block at `:25`.

**The page's sage rectangle keeps the UNCLIPPED window**, `:756-759`. It marks
which measure the page is working on, which is a question about the measure and
not about the loupe's two crops. Deciding otherwise would move a mark on the
page, which this brief does not reach. §5.3 reports it measured.

### `loupe.test.ts:474-551`, six tests

A new `describe('the window clipped to the head')` beside the head's own block.
The clip on a measure that opens a system; a mid-system window untouched; the
window untouched where head and window meet exactly, which is the construction
as it stood before 2026-08-29; the six measured cases tiling the system once;
the one-unit floor; and a non-finite head ignored. Every number in them is a
measured one from §3 and §5.

---

## 2. The alternative, costed, and why it needs no ruling

The brief named a second route: bring `measureWindow` onto the same `MUSIC_MARK`
basis as the head, so the two are one quantity again. **It is not the smaller
change, and it is blocked by this brief's own constraint, so nothing here is
Dann's to rule.**

- **It needs a renderer change, which §6 forbids.** The head bound is set by the
  UNDERLAY on four of the seven systems (`memo-n104-loupe-head_r1_2026-08-29.md`
  §3.1), and the underlay carries no handle at all
  (`staff-renderer.ts:1778`, `:1783`). A window on a music-ink basis has to
  attribute each mark to a measure; `[data-event-id]` and `[data-of-event]` carry
  the measure in their ids, and a syllable carries nothing. There is no way to
  ask which measure a syllable belongs to without a new handle on the renderer.
- **It moves every window on the page.** `memo-n104-loupe-head_r1_2026-08-29.md`
  §4 records that bringing the sibling at `Loupe.svelte:275-276` onto
  `MUSIC_MARK` makes system 1's tacet measure a candidate measure and resizes the
  loupe's window on every system. The seven mid-system windows §5.2 reports
  unchanged would all move.
- **It changes what a window means.** A window opened on the first notehead
  rather than on the midpoint before it drops the run-in an engraver leaves, and
  §11 of the same memo records the barline search that exists to keep that run-in
  looking like an engraved excerpt.

Cost of the route taken: two files, seven lines of code, six tests. Cost of the
alternative: a renderer handle, a re-measurement of all seventeen windows, and a
second ruling from Dann on what a window's left edge is. **The first is clearly
smaller, so I built it and did not bring him the question.**

---

## 3. What Dann walked, reproduced

Desk readings at 1400 × 900 on the engraved Without Sun song 1, the loupe raised
by a click on the first note of each measure, read off the live DOM.

**Expectation, stated before the reading:** the head runs to the leftmost music
ink and the window opens at the leftmost hit rectangle, x = 56, so the key
signature's second sharp at 56.01 to 61.25 falls inside both crops and is drawn
twice.
**Likeliest failure:** the boundary-barline search moves `win.left` off 56 on a
measure that opens a system, which would make the overlap different from the
brief's arithmetic.

| the loupe on | system | head bound | window left | overlap | drawn twice |
|---|---|---|---|---|---|
| m. 4 | 2 | 63.53 | 56 | **7.53** | the second sharp, 56.01 to 61.25 |
| m. 7 | 3 | 64.98 | 56 | **8.98** | the same |
| m. 10 | 4 | 66.38 | 56 | **10.38** | the same |
| m. 13 | 5 | 69.33 | 56 | **13.33** | the same |
| m. 16 | 6 | 70.77 | 56 | **14.77** | the same |
| m. 18 | 7 | 69.14 | 56 | **13.14** | the same |

**The expectation holds and the failure does not occur.** `win.left` reads 56 on
all six, so the search finds no boundary barline, which is what
`staff-renderer.ts:541` says it should: the renderer draws no barline for the
first column of a slice. The six overlaps match the brief's table to the digit.

**The instrument was checked against a record it did not produce.** The clef's
ink at 27.75 to 43.33, the two sharps at 49.78 to 55.02 and 56.01 to 61.25, and
«тень» at 63.53 all read here exactly as
`memo-n104-loupe-head_r1_2026-08-29.md` §3.1 recorded them on 2026-08-29, and
the eight windows of its §3.3 read exactly as that table records them. Two
instruments, one set of numbers.

---

## 4. §5.1. Six measured readings, none assumed

**Expectation:** each window's left moves from 56 to that system's head bound,
the overlap becomes zero, and nothing is drawn twice.
**Likeliest failure:** the head and the window no longer abut, so a mark
straddling the seam is cut in half or a staff line shows a break.

| the loupe on | system | head bound | window left | overlap | sharps painted | drawn twice |
|---|---|---|---|---|---|---|
| m. 4 | 2 | 63.53 | **63.53** | **0** | **2 of 2** | **none** |
| m. 7 | 3 | 64.98 | **64.98** | **0** | **2 of 2** | **none** |
| m. 10 | 4 | 66.38 | **66.38** | **0** | **2 of 2** | **none** |
| m. 13 | 5 | 69.33 | **69.33** | **0** | **2 of 2** | **none** |
| m. 16 | 6 | 70.77 | **70.77** | **0** | **2 of 2** | **none** |
| m. 18 | 7 | 69.14 | **69.14** | **0** | **2 of 2** | **none** |

**All six are measured readings.** Each row is one raised loupe, its two
`viewBox` attributes read off the DOM, and every drawn mark in that system tested
against both crops. None is predicted from another.

**"Sharps painted" is a measurement and not a count of what I expected.** For
each system I listed every element whose ink meets the discarded band, with no
filtering at all, and asked which crop shows it. The key signature's first sharp
ends at 55.02, below 56, so it was never in the head; the second, 56.01 to 61.25,
now shows in the head only. Two sharps, once each.

**The failure does not occur.** The five staff lines cross the seam on every
system and are drawn continuous, because the two crops are laid flush at one
scale: the head is `headWidthUnits` units drawn in `headWidthUnits × scale` px
and the window is `viewSpan` units in `viewSpan × scale` px, so a unit is the
same width in both and the seam falls at one x. Looked at at three times on m. 4,
and on a phone at 430 × 932: no break in any of the five lines.

---

## 5. §5.2 and §5.3. What did not move

### 5.1 The mid-system loupe is unchanged

**Expectation:** `clipToHead` returns the window it was given wherever the head
ends left of it, which is every measure that does not open a system, so all
seven are identical.
**Likeliest failure:** `totalSpan` feeds `scale`, so a changed head could move a
drawn width even with the `viewBox` fixed.

| the loupe on | window before | window after |
|---|---|---|
| m. 2 | 138.24, width 236.35 | **identical** |
| m. 3 | 378.04, width 245.96 | **identical** |
| m. 5 | 247.42, width 191.23 | **identical** |
| m. 8 | 248.38, width 186.98 | **identical** |
| m. 11 | 245.30, width 193.82 | **identical** |
| m. 14 | 248.70, width 180.53 | **identical** |
| m. 17 | 328.55, width 295.45 | **identical** |

All seven unchanged in units and in drawn pixels. The head is unchanged on all
seven too, at 95.37, 95.37, 63.53, 64.98, 66.38, 69.33 and 70.77. The failure
does not occur, because on these measures `clipToHead` returns its argument
untouched and `totalSpan` is the number it always was.

### 5.2 The held measure's window, before and after, on the six of §5.1

| the loupe on | left before | left after | width before | width after | right before | right after |
|---|---|---|---|---|---|---|
| m. 4 | 56 | **63.53** | 185.51 | **177.98** | 241.51 | **241.51** |
| m. 7 | 56 | **64.98** | 192.38 | **183.40** | 248.38 | **248.38** |
| m. 10 | 56 | **66.38** | 183.63 | **173.25** | 239.63 | **239.63** |
| m. 13 | 56 | **69.33** | 192.70 | **179.37** | 248.70 | **248.70** |
| m. 16 | 56 | **70.77** | 267.43 | **252.66** | 323.43 | **323.43** |
| m. 18 | 56 | **69.14** | 189.03 | **175.89** | 245.03 | **245.03** |

**Every right edge is unchanged, so the pair covers exactly what it covered.**
The head paints `[0, head]` and the window paints `[head, right]`; before the
change the window painted `[56, right]` and the head painted the same
`[0, head]`. The union is `[0, right]` in both cases. **The clip changes the
partition, not the coverage.**

### 5.3 What ink the clip removed

**Nothing. Measured exhaustively rather than argued.** For each of the six
systems I listed every element in the system whose ink meets the discarded band
`[56, head]`, with every filter off, including the ones the head walk applies.
On all six, **exactly one element lies wholly inside the band**: the `<text>` at
56.01 to 61.25, which is the key signature's second sharp, and the head draws it.

Everything else that meets the band extends past the head bound and is drawn by
the window exactly as before: the system's paper rectangle, the five staff lines,
the first note's `[data-event-id]` group and its `[data-hit]` rectangle, and on
system 4 that note's own accidental, whose ink begins at 66.38, which IS that
system's head bound. On system 2 the page's `[data-selection-ring]` also meets
the band; the clone strips it and it is drawn in neither crop.

**One apparent straddle was a rounding artifact and is ruled out by reading the
float.** On system 7 the syllable «ди» reported an ink left of 69.13 against a
head bound reported as 69.14. Read at full precision, both are
`69.13268280029297`: «ди» IS the mark that sets that head bound, and it does not
cross the seam. **The two-decimal readings this project works in produced a
0.01-unit disagreement that does not exist**, which is worth knowing the next
time a seam is measured.

### 5.4 The page's sage rectangle did not move

| the loupe on | sage x | sage width |
|---|---|---|
| m. 4 | **56** | **185.51** |
| m. 7 | **56** | **192.38** |
| m. 10 | **56** | **183.63** |
| m. 13 | **56** | **192.70** |
| m. 16 | **56** | **267.43** |
| m. 18 | **56** | **189.03** |

Each is the unclipped window, which is what it was before the change. The mark on
the page still spans the whole held measure.

### 5.5 One drawn width moved, and it is the cap working

The applied scale is unchanged on five of the six, so their heads draw at the
same pixel width as before: 138.61, 141.78, 144.83, 151.27 and 150.84 px.
**m. 16 draws larger, 149.41 px before and 154.41 px after.** Its measure is the
widest on the page, so it meets the loupe's width cap, and at the cap
`scale = width / totalSpan`. Dropping 14.77 units of duplicated furniture out of
`totalSpan` leaves more room for the music. That is the cap doing what
`Loupe.svelte`'s "THE HEAD SHARES THE FIT" note says it does, and it is an
improvement rather than a side effect.

---

## 6. What I looked at with my own eyes

- **m. 4 at three times, before and after, side by side**, built from the same
  clone with the window's `viewBox` opened at 56 for the before row and at 63.53
  for the after row. BEFORE: bass clef, F sharp, C sharp, **C sharp**, then the
  flat and the first note. AFTER: bass clef, F sharp, C sharp, then the flat and
  the first note, in the same place. **Dann's defect is in the first drawing and
  gone from the second.**
- **The seam**, in the same drawing. The five staff lines run through it
  unbroken, and no glyph shows a cut edge.
- **m. 4 on a phone at 430 × 932**, drawer collapsed, on the real loupe: clef,
  two sharps, the flat, the music. Head bound 63.53 units, the same number as the
  desk, drawn at 71.38 px.
- **The six raised loupes**, one at a time, each with its tag read: `m. 4 ·
  system 2 of 7` through `m. 18 · system 7 of 7`.

---

## 7. Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | `found 0 errors and 7 warnings in 4 files` |
| 4 web-test | `908 passed (908)` | **`914 passed (914)`** |
| 5 score-parser | `481 passed \| 5 skipped (486)` | `481 passed \| 5 skipped (486)` |

**Gate 4 moved, and it is disclosed rather than slipped.** Six tests, all added
by me, all in `apps/web/src/lib/shane/loupe.test.ts` under `describe('the window
clipped to the head')`. No existing test changed and none was deleted: the
package went from 908 to 914.

**`~/Downloads/ilya-ship.sh` needs one line changed, and that is Dann's to
approve.** Line 79 reads:

```
gate 4 web-test     "908 passed (908)"                          pnpm -C "$REPO" --filter @ilya/web test
```

and would become

```
gate 4 web-test     "914 passed (914)"                          pnpm -C "$REPO" --filter @ilya/web test
```

Line 80 stays at `481 passed | 5 skipped (486)`. **I read the file and did not
edit it.**

---

## 8. Citations that my edit moved

The edit adds lines to both files, so line numbers into them shift. Repaired
where they live in the tree; reported where they live in the memory files, which
are the desk's to write.

**Repaired, by naming the thing rather than writing a new number.** Two comments
cited `Loupe.svelte:359`, the frame effect's early return. Both now name its
`ownIds.length === 0` guard: `loupe.ts:339-341` and `loupe.test.ts:455-457`.

**Reported, for `docs/memory/STATE.md` to repair at the session's close.** New
anchors, read out of the tree:

| what it cites | STATE.md said | now |
|---|---|---|
| `MUSIC_MARK` | `loupe.ts:283-324` | `loupe.ts:287-328` |
| `measureWindow`'s left edge | `loupe.ts:79` | `loupe.ts:83` |
| `headBound` | `loupe.ts:338` | `loupe.ts:347` |
| the head walk | `Loupe.svelte:563-580` | `Loupe.svelte:564-581` |
| `pageMetrics`' sibling head | `Loupe.svelte:275-276` | `Loupe.svelte:276-277` |
| `pageMetrics`' skipped system | `Loupe.svelte:217` | `Loupe.svelte:218` |

`STATE.md:70`'s `Loupe.svelte:528` is a past-tense citation to the state before
`510a280` and is left alone.

---

## 9. Housekeeping

- **Nothing was committed and nothing was shipped.** I do not run git.
- Untracked and needing `git add` before the ship: this memo. The brief,
  `docs/sessions/brief-n104-head-window-overlap_r1_2026-09-01.md`, is modified
  and rides along, as are the three edited source files.
- The engraved MusicXML I staged under `apps/web/static/reader/` is deleted. That
  directory is gitignored (`.gitignore:28`) and `pnpm --filter @ilya/web dev`
  empties and regenerates it through `copy-reader.mjs`, so anything staged there
  must be staged after the server starts.
- No new user-facing string and **no French coined**. `clipToHead` is a code
  identifier and the word is mine, not adopted.
- Nothing was added to `static/`, so there is no byte count to report.

The commit message is `N.104: the loupe's window opens where its head stops`.

---

## 10. NOT ESTABLISHED

- **That any measure other than the six shows a change.** The seven mid-system
  measures §5.2 lists are measured unchanged. The other four measures of this
  document, m. 1, 6, 9 and 12, were not raised: m. 1 raises no loupe, and the
  rest are mid-system measures of the same shape as the seven that were.
- **That the fix holds on a document whose first system opens with music rather
  than with a tacet run.** This document's system 1 opens on the tacet bar, so
  its first measure raises no loupe. A document with no tacet run would put a
  seventh measure in §5.1's class, and I did not build one.
- **That the head bound is exact wherever text sets it.**
  `memo-n104-loupe-head_r1_2026-08-29.md` §6 measures the loupe's clone laying
  the underlay 1.99 units left of where the page lays it, on systems 2, 5, 6 and
  7, and calls it a measured near-miss. **This change does not touch it and does
  not make it worse:** the clip moves the window right, away from the head, so
  the head crop is the same crop it was. Still Dann's to rule.
- **What the clamp does, on the page.** `clipToHead`'s one-unit floor is pinned
  by a test and cannot be reached from this renderer, for the reason its comment
  gives. NOT ESTABLISHED by a reading of a rendered page.
- **`pageMetrics`' two siblings**, `Loupe.svelte:276-277` and `:218`, are
  unchanged and still owed, as `STATE.md`'s OWED section records. `minTotalSpan`
  is still built on hit rectangles, so the loupe's window height and width cap
  still read a quantity the head no longer uses. **It sizes the frame and not the
  crop, so it cannot double a glyph**, but the two are now three quantities where
  they were one.
- **That `MUSIC_MARK` is pinned by a test.** It still is not, for the reason the
  2026-08-29 memo gives: `apps/web`'s vitest has no DOM environment.
  `clipToHead`'s arithmetic is pinned six ways; the selector is not.
- **Whether the sage rectangle SHOULD keep the unclipped window.** I kept it
  because moving a mark on the page is outside this brief. On a measure that
  opens a system it starts at 56, which is inside the key signature. **Nobody has
  ruled what it should do there, and nobody reported it.**
