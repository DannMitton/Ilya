# MEMO — N.141 r2. The squircle's height: a floor, and growth for high notes

**Written by Code, in answer to `brief-n141-loupe-ring-height_r2_2026-09-20.md`. Tree read at `2b980e7`. Nothing is staged and nothing is committed.** This supersedes `memo-n141-loupe-ring-height_r1_2026-09-20.md`, which describes a build that no longer exists.

**Status: built, and measured at 390 px on all 97 notes of the 17 held-able measures. All five gates at baseline, gate 4 unchanged at 1342 (no test added). Not walked by Dann.**

**Three findings, each stated in full in the sections named.**

1. **64 of 97 boxes exceed the floor, and 47 of those are not notes above the stave** (section 4). The brief expected only notes above the stave.
2. **The viewBox clamp binds twice, both on the page, on system 0-2, and both change a height** (section 5). The loupe and the page then differ by 1.776 and 0.632 units on those two notes.
3. **The new clearance is smaller than the one it replaces**: `gap` is 5.5, against 9 (section 6).

## 1. What changed

r1 was removed by file edit. `VoiceProfilePane.svelte`, `loupe-render-bundle.ts` and `loupe-render.test.ts` are back to what they were at `2b980e7`, and `git diff` on the first two is empty. No height is passed between the page and the loupe.

- **`apps/web/src/lib/shane/selection-ring.ts`**
  - 255 to 261: the grammar comment now describes the amended rule.
  - 297 to 318: the system-wide highest-ink loop (`systemTop`) is deleted. The top is `Math.min(staffTop, own.top) - gap`, with no `RING_PAD_Y` on the vertical. `own` is the taken note's `eventInk`.
  - 328 to 352: the bottom is as the original `ringBox` had it (IPA baseline, plus `ipaFaceDescent()`, plus half the stroke; a system with no underlay keeps the note's own bottom plus `RING_PAD_Y`). The viewBox clamp is kept; its upper bound is now the note's own highest ink, where it was the system's.
  - `ringBox` has its original signature. There is no surface branch.
- **`apps/web/src/lib/shane/Loupe.svelte`** 1354 to 1358: the comment on the squircle now says the height is `ringBox`'s own.
- No other file. `git diff HEAD -- packages` is empty.

**`RING_PAD_Y` and `RING_REACH`, grepped before touching either, and no caller changed.** `RING_PAD_Y = 9` stays exported. It is now used in one place inside `ringBox`, the no-underlay bottom, and by `RING_REACH` (`selection-ring.ts:41`). `RING_REACH` has one other reader: `Loupe.svelte:1246`, where `ringRoom` uses it to leave room above the page's ink band for the ring. The new top clearance (5.5) is smaller than `RING_REACH` (10), so that room is more than the ring now needs, and I did not shrink it. `RING_PAD_X` is untouched.

## 2. Per measure: box top, bottom and height, page and loupe

Units are the notation's own, offsets from the staff's top line, negative above it. Read from the page's `rect[data-selection-ring]` and the loupe's ring rect, converted by the loupe's scale, for **every one of the 97 notes** (each raised by a click on its page note). Bottom is 54 for every note, on both surfaces.

| m. | notes | page top | page height | loupe top | loupe height |
|---|---|---|---|---|---|
| 1 | 6 | -5.5 to -16 | 59.50 to 70 | -5.5 to **-17.776** | 59.50 to **71.78** |
| 2 | 6 | -5.522 to -16 | 59.52 to 70 | -5.522 to **-16.632** | 59.52 to **70.63** |
| 3 | 6 | -5.5 to -17.776 | 59.50 to 71.78 | same | same |
| 4 | 6 | -5.5 to -11 | 59.50 to 65 | same | same |
| 5 | 6 | -7.568 to -16.522 | 61.57 to 70.52 | same | same |
| 6 | 6 | -5.5 to -17.776 | 59.50 to 71.78 | same | same |
| 7 | 6 | -5.5 to -11.682 | 59.50 to 65.68 | same | same |
| 8 | 6 | -5.5 to -11 | 59.50 to 65 | same | same |
| 9 | 6 | -5.5 to -17.776 | 59.50 to 71.78 | same | same |
| 10 | 6 | -8.272 to -19.382 | 62.27 to 73.38 | same | same |
| 11 | 6 | -5.5 to -17.776 | 59.50 to 71.78 | same | same |
| 12 | 6 | -5.5 to -17.776 | 59.50 to 71.78 | same | same |
| 13 | 6 | -5.522 to -17.776 | 59.52 to 71.78 | same | same |
| 14 | 6 | -5.522 to -17.776 | 59.52 to 71.78 | same | same |
| 15 | 6 | -5.5 to -9.372 | 59.50 to 63.37 | same | same |
| 16 | 3 | -5.5 | 59.50 | -5.5 | 59.50 |
| 17 | 4 | -5.5 | 59.50 | -5.5 | 59.50 |

**Definition of done 3: every bottom is the same number, 54, on both surfaces. Met.**

**Definition of done 4: the loupe's box and the page's are identical in height on 95 of 97 notes. Not met on two: `m1-3-4` and `m2-0-1`, both on the page's system 0-2.** The clamp causes both (section 5). Every other note is identical to the thousandth of a unit.

The floor is height 59.50 (top -5.5, bottom 54). The heights of 59.52 and 59.522 are notes whose ink stands 0.02 above the top line, a stroke's width.

## 3. The page's ring heights, before and after, per system

Before (measured in the earlier session, which had one height per system): **70, 74 and 63.** After, the smallest and largest height on each system:

| page system | before | after |
|---|---|---|
| 0-2 | 70 | 59.50 to 70 |
| 3-5 | 74 | 59.50 to 71.78 |
| 6-7, 8-9 | 74 | 59.50 to 71.78 |
| 10-11 | 74 | 59.50 to 73.38 |
| 12-13, 14-15 | 74 | 59.50 to 71.78 |
| 16-17 | 63 | 59.50 (every note) |

The page's ring got shorter for most notes, by 3.5 to 14.5 units, and the tallest is 73.38 (`m10-0-1`). The page's notation is untouched: `git diff HEAD -- packages` is empty and `ringBox` feeds only the ring's rectangle.

## 4. Notes whose box exceeds the floor (definition of done 5)

**64 of 97.** 33 sit on the floor. Excess is in units above the floor of -5.5, on the page (the loupe is identical except `m1-3-4`, 12.276 rather than 10.5, and `m2-0-1`, 11.132 rather than 10.5).

**17 have a notehead above the stave**, as the brief expected: `m1-3-4`, `m2-0-1`, `m2-3-4`, `m3-0-1`, `m5-3-4`, `m6-3-4`, `m9-0-1`, `m9-5-4`, `m10-0-1`, `m10-1-4`, `m10-1-2`, `m11-3-4`, `m12-3-4`, `m13-0-1`, `m13-3-4`, `m14-0-1`, `m14-3-4`. Their excess runs 5.52 (`m9-5-4`, `m13-3-4`) to 13.88 (`m10-0-1`).

**47 do not, and that is a finding.** Their notehead is on or below the top line and they exceed the floor by 0.02 to 9.53. Two likely causes. **I inferred them from the excess values and did not inspect each note.**

- **An up-stem** reaches above the top line from a head inside the stave, and `eventInk` includes the stem (the brief says so). The larger excesses without a head above the stave, such as 9.53 on `m5-9-8` and `m10-3-4`, look like this.
- **A notehead on the top line**, whose ink stands about 2.77 above the line, so the box reaches 2.77 above the floor. Counting the list below, 21 notes sit at 2.77 to 2.88.

By measure, `note-id-suffix:excess`: m1 `0-1:2.77 1-4:2.77 1-2:2.77 3-4:10.5 1-1:2.88`; m2 `0-1:10.5 1-4:0.02 1-2:0.02 3-4:9.37 9-8:2.77 5-4:2.77`; m3 `0-1:12.28 3-4:3.87`; m4 `0-1:0.02 1-2:5.5 3-4:2.88`; m5 `0-1:2.77 1-4:2.07 1-2:2.77 3-4:11.02 9-8:9.53 5-4:2.77`; m6 `0-1:0.02 1-4:0.02 1-2:0.02 3-4:12.28`; m7 `1-4:5.5 11-8:6.18`; m8 `1-4:5.5 3-4:3.87`; m9 `0-1:12.28 1-2:2.88 3-4:0.02 1-1:2.77 5-4:5.52`; m10 `0-1:13.88 1-4:12.28 1-2:8.27 3-4:9.53 9-8:2.77 5-4:2.77`; m11 `0-1:0.02 1-2:0.02 3-4:12.28 1-1:0.02 5-4:0.02`; m12 `3-4:12.28 9-8:0.02 5-4:0.02`; m13 `0-1:12.28 1-4:2.77 1-2:0.02 3-4:5.52 9-8:2.77 5-4:2.77`; m14 `0-1:12.28 1-4:2.77 1-2:0.02 3-4:9.37 9-8:2.77 5-4:2.77`; m15 `0-1:3.87 3-8:2.88 3-4:0.02`. Measures 16 and 17 are entirely on the floor.

The brief's rule (*"the minimum default... and notes that require more height (such as those above the staff on ledger lines) will get that extra height"*) reads as notes above the stave. **The formula as the brief wrote it, `Math.min(staffTop, own.top) - gap`, also grows the box for a head on the top line and for a note with an up-stem.** I built the formula as written and did not narrow it. Whether Dann wants stems and top-line heads to count is his call, and one edit to `own.top` (read the notehead's ink alone) would change it.

## 5. The viewBox clamp binds twice, both on the page (definition of done, brief 4.3)

The clamp was instrumented for the run and the instrument removed.

| note | surface | system | wanted top | clamped top | height lost |
|---|---|---|---|---|---|
| `m1-3-4` | page | 0-2 | -17.776 | -16 | 1.776 |
| `m2-0-1` | page | 0-2 | -16.632 | -16 | 0.632 |

- **It never bound in the loupe**, where the crop is the page's ink band and not the render's viewBox.
- **It bound on the page's first system only**, whose viewBox starts 1 unit above the staff's ink (`viewBox` y 68, clamp at 69).
- **It is the whole reason the two surfaces differ** in section 2. Per the brief this is a finding for a follow-up and I did not change it. Those two page rings are the "truncation avoided by shortening" case: not cut, but shorter than the rule asks.
- The bottom clamp never bound.

## 6. The value of `gap`, and the clearance

**`gap` is 5.5 on every note of the fixture.** The clearance above is 5.5 units, against the `RING_PAD_Y` of 9 it replaces, so **the new clearance is 3.5 smaller.** The floor box is 59.5 units tall. Before, a box could not be shorter than 70 in this song.

## 7. Every ring is closed (definition of done 8)

All 97 rings are closed on both surfaces. In the loupe the nearest a ring's stroke comes to the top of the drawing is 3.52 px, and to the bottom 20.9 px. The tallest loupe strip is 101.18 px, unchanged from stage 3b's range (100.2 to 101.2), so the change needed no extra vertical room.

## 8. Gates

`216 passed`, `235 passed`, `svelte-check found 0 errors and 12 warnings in 5 files`, `1342 passed (1342)`, `575 passed | 5 skipped (580)`. No test was added; `ringBox` reads layout, which vitest here cannot supply, so the proof is the browser run above. **Stage 3a's 8-layout page comparison was not re-run**: the notation cannot have moved (packages untouched), and the ring is meant to move.

## 9. What I could not establish

- **Whether `eventInk` includes beams: it does not.** It reads a note group's marks and what is tagged `data-of-event`. On the page, 10 elements carry `data-beam-level`; none sits inside a `[data-event-id]` group and none carries `data-of-event`. A beam therefore cannot set a box's top. I did not read the renderer's stem-into-beam geometry beyond that.
- **A measure with no underlay at all: NOT ESTABLISHED, not exercised.** Every sung measure on this fixture has underlay, and m. 0 carries no entry. The code path is the original: the bottom becomes the note's own bottom plus `RING_PAD_Y`, clamped to the viewBox, so boxes on such a system would no longer share a bottom edge. That contradicts Dann's *"the bottom of the squircle will always line up with its siblings."* **A follow-up decision, not made here.**
- **The clamp: bound twice, section 5.**
- **Landscape, tablet, desktop width: not measured.** Every figure is at 390 px. The heights are in the notation's own units, so I expect them to hold.
- **Whether the loupe's top can ever be clamped** by a taller render than this fixture's: not seen, and not established.
- **A stale-module trap cost time, not correctness.** After an edit the pane served the previous `selection-ring.ts` until I refetched it with `cache: 'reload'` and reloaded. The figures above are from the new code; I confirmed by calling the new module's `ringBox` directly on `m1-0-1` before the run.

## 10. For `docs/memory/ENVIRONMENT.md`

- **After editing a module the app imports, the browser pane can keep serving the old copy of it** even after `preview_stop` and `preview_start`, and a plain `navigate` does not clear it. Refetch each changed URL with `fetch(url, { cache: 'reload' })` (get them from `performance.getEntriesByType('resource')`), then navigate. Symptom: the page's ring rect has the old height while `import('/src/lib/shane/selection-ring.ts?t=' + Date.now())` calls the new code and gets a different answer. An earlier session recorded a similar symptom for `Loupe.svelte`.
- **`import('/src/lib/shane/<file>.ts?t=' + Date.now())` from `javascript_tool` loads the dev server's current module**, which is how to tell a stale page from a wrong edit.
