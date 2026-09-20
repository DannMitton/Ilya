# Memo: N.155, a word broken across a system takes a hyphen at the line end

2026-09-20, on `7bd3d04`. No git command that writes was run. No new file except this memo.

## 1. Did the cheap reading hold?

**Yes, with one correction. The paginator is not touched and no `incomingAccidentals`-style
handoff was needed.**

- `sliceScore` (`page-layout.ts:98`) spreads each measure and event, so `syllable.type`
  reaches the slice's renderer intact. The underlay entry carries `sylType`
  (`staff-renderer.ts:3186`, with the singer's `sylTypePreview` override), and a slice's
  system is the only place the continuation can be.
- Checked by measurement: on the engraved Without Sun no. 1, every one of the seven
  measure-final syllables the old output left hyphenless has `sylType` middle, and its
  continuation is the next system's first syllable.
- **The correction:** "the slice's LAST underlay entry" is wrong as worded. A melisma's
  continuation notes are underlay entries too (IPA only, `cyr: ''`), so on the demo the
  last entry after a melisma opener is an empty-Cyrillic `n20`. The build tests **the last
  entry that carries Cyrillic**. My first draft used the literal last entry and drew nothing
  in the demo; the test caught it.

## 2. What changed

`packages/score-parser/src/staff-renderer.ts`
- `:1116` (approx.) new export `LINE_END_HYPHEN_OFFSET_PX = HYPHEN_PAD + HYPHEN_HALF`, the one
  value for the horizontal position, with a comment saying how to move it.
- After the in-system hyphen loop, inside the same block: if the last Cyrillic-bearing
  entry is `start` or `middle`, one `<line>` is pushed at
  `rightEdgeOf(last) + LINE_END_HYPHEN_OFFSET_PX`, same `HYPHEN_HALF` width, same
  `hyphenY`, same stroke, same `data-hyphen="<evId>"` shape as every other hyphen.
- It reserves no space. Extenders, `VocalLineEvent`, `page-layout.ts` and the in-system
  loop are untouched.

`packages/score-parser/src/staff-renderer.test.ts`: three tests in one new `describe`.

**Continuation never arrives** (a `start` or `middle` ends the score, or a whole score is
rendered in one call): one spurious hyphen, no crash, no other effect.

## 3. Expectation, measurement

**Expectation, before measuring:** seven new hyphens on the engraved Without Sun no. 1, no
existing hyphen moves, no column moves.

**Measured**, whole paginated output, HEAD renderer against the new one, default options:
- **Eight** new `data-hyphen` lines, not seven. Pages 5 → 5, systems 18 → 18.
- With the new lines deleted, the output is **byte-identical** to before, and every non-SVG
  field of every system (`fromMeasure`, `width`, `height`, `minY`) is equal.
- Under the tight options (`pxPerWhole` 30, `minGap` 4): 2 new hyphens, 2 pages and 7
  systems both times, and the same identity holds.

**The eighth is the last system of the score**, «ди-но-ка», whose «ка» is tagged `middle`
**in Dann's own file** (`sunless-01-engraved.musicxml`, near line 1978). It is the "start is
the last syllable in the score" case. Seven were what Code had reported; the eighth is the
file's own truncation. The renderer cannot tell a score's end from a system's, so it draws a
hyphen there. **Dann's call:** leave it (a truncated word does continue), or have the last
system suppress it.

## 4. Gates

| gate | baseline | now |
|---|---|---|
| phonology | 216 | 216 |
| dictionary | 235 | 235 |
| web-check | 0 errors, 12 warnings, 5 files | same |
| web-test | 1263 | 1263 |
| score-parser | 572 passed, 5 skipped (577) | **575 passed, 5 skipped (580)** |

**One baseline moved: score-parser +3, my three tests.** No existing expected value changed.
The failure mode the brief predicted (a snapshot counting hyphens) did not occur.
`~/Downloads/ilya-ship.sh:80` will read DEVIATED until Dann moves it to
`575 passed | 5 skipped (580)`. I did not edit it.

## 5. NOT ESTABLISHED

- **Room.** The brief says stop if the margin lacks room. The mark's ink ends 7 px after the
  syllable's ink; `columnAdvance` leaves a full `lineGap` (12 px at default) after the last
  syllable's half-width. I did not measure the clearance to the barline on the rendered
  page, and a small `lineGap` (under about 7) would put the hyphen on the barline.
  Unwalked.
- **A melisma opener as the last syllable.** The hyphen sits immediately after the opener,
  which is mid-melisma, before the held notes. Whether that reads right is Dann's eye. I
  tested the geometry on the demo's melisma opener, not the look.
- **Print and browser walk:** not done. WRITTEN, not DONE.
- Melisma extenders crossing a break: not touched, as briefed.

## 6. Decisions mine, reversible

- The last-Cyrillic-entry rule (section 1) rather than the literal last entry.
- No note-column nudge on the line-end hyphen: there is no next column to avoid.
- The end-of-score hyphen is left drawn (section 3).
