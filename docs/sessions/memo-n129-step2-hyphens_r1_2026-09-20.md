# Memo: N.129 step 2, hyphens are never omitted

2026-09-20, on top of e75d6f3. Step 2 only. No git command that writes was run. No new file
except this memo.

## 1. What changed

`packages/score-parser/src/staff-renderer.ts`
- New exports `HYPHEN_PAD = 2` and `HYPHEN_GAP_PX = HYPHEN_HALF * 2 + HYPHEN_PAD * 2 = 9`
  (beside `HYPHEN_HALF`).
- New `joinsWord(prevEv, ev, options)`, the hyphen loop's own join test (start|middle
  followed by middle|end, both with text), reading the same `sylTypePreview` and
  `cyrPreview` sources the drawing reads.
- `columnAdvance`: the gap term after the next syllable's half-width is now
  `max(lineGap * 0.5, joinsWord ? HYPHEN_GAP_PX : 0)`. Between two words it is unchanged.
  This is the one function `sliceWidth` and the renderer share, so pagination sees it.
- The hyphen loop: `if (to <= from) continue` removed. It uses `HYPHEN_PAD` for its `± 2`.
- `clampHyphenX`'s comment now says Dann ruled against omission and the overhang case is a
  guard.

`packages/score-parser/src/staff-renderer.test.ts`: two tests, in one new `describe`.

**Value chosen, DESK INFERENCE and Dann's to wave off:** the floor is 9 px, because that is
exactly what the drawing loop already demanded (4 px of padding plus a 5 px hyphen). The spacer
now reserves what the loop needs. It is a floor on the gap between ink edges, not a fixed
column width.

## 2. Expectation, measurement

**Expectation:** on fixtures where the default spacing already leaves 9 px inside words,
nothing changes. It bites only where the old half-space (`lineGap * 0.5`, 6 px at the default
12) fell under 9.

**Measured**, engraved Without Sun no. 1 (`sunless-01-engraved.musicxml`), before (HEAD
renderer) against after, whole paginated output:

| options | pages | systems | in-system joins | hyphens drawn |
|---|---|---|---|---|
| default, before | 5 | 18 | 50 | 50 |
| default, after | 5 | 18 | 50 | 50 |
| pxPerWhole 30, minGap 4, before | 2 | 7 | 53 | 53 |
| same, after | 2 | 7 | 56 | 56 |

Default: **no change at all** (this is what I expected). Tight: page and system counts equal,
but measures redistribute across systems (53 → 56 joins in-system), so spacing did move. Per
brief, systems per page on the engraved Sunless: **5 pages, 18 systems, unchanged at default.**

## 3. Gates

| gate | baseline | now |
|---|---|---|
| phonology | 216 | 216 |
| dictionary | 235 | 235 |
| web-check | 0 errors, 12 warnings, 5 files | same |
| web-test | 1263 | 1263 |
| score-parser | 570 passed, 5 skipped (575) | **572 passed, 5 skipped (577)** |

**One baseline moved: score-parser +2, my two new tests.** No existing expected value moved.
`~/Downloads/ilya-ship.sh:80` will read DEVIATED until Dann moves it to
`572 passed | 5 skipped (577)`. I did not edit it.

## 4. Definition of done, item by item

- **3, no hyphen omitted on any fixture:** true on the engraved Sunless and the demo, both
  before and after. **It was already true before.** I could not make the old code omit one.
- **4, the word:** `не прог ляд` is in no fixture. Satisfied on the engraved Sunless no. 1
  as the fixture with hyphenated words: all 50 in-system joins draw a hyphen (default), and
  56 of 56 under the tight options. The demo's «по-гру-зи-сь» draws all three at `lineGap`
  2, 4, 6, 8, 12 and `pxPerWhole` 1, 10, 100, before and after.

## 5. NOT ESTABLISHED

- **Why Dann saw three hyphens missing.** The omission needs a gap under 4 px between
  syllable ink. `columnAdvance` never gives less than 6 px at the default, and the notehead
  ink term usually dominates. Under 8 stave-space units of `lineGap` the old floor could go
  under 4 px, but the demo and Sunless never showed it, even at `lineGap` 2. Step 1's
  metric mismatch is the likeliest cause of what he saw, but I did not reproduce it. **So
  the new floor is guarded by a test that fails on the old code (`columnAdvance`, at
  `lineGap` 4), but I have no rendered case that the old code failed and the new one fixes.**
- **The `continue` removal is untested.** Its branch is unreachable with the floor in place.
- **T05** is not in the tree. Systems per page on T05: not measured.
- **Seven joins per the Sunless run draw no hyphen because they cross a system break**
  (the last syllable of a measure to the first of the next, each measure its own system in
  that output). The loop only joins syllables within one system. Whether a hyphen belongs at
  a line end is an engraving question the ruling did not address; I did not build it. Dann
  should say whether "never omitted" covers it.
- **Walk in a browser and in print:** not done. WRITTEN, not DONE.

## 6. Decisions mine, reversible

- The floor is applied to the text-half-width term only, not to the ink term.
- The demo render test (all three joins draw at four sizes) passes on the old code too. I
  kept it as a regression guard, not as proof of the fix.
