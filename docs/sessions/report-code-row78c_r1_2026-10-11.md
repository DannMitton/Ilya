# Report: row 78c, the red ring outside the selection ring, and the room for it (r1)

Code (Opus 5.5) on Dann's Mac, 2026-10-12, brief `brief-code-row78c-red-ring-and-room_r2_2026-10-11.md`, read whole.

- **Tree:** `9f9e896` on `Shane`, with rows 78a and 78b uncommitted.
- **Where the brief was set aside.** It was written for the cloud lane. As Dann directed, its git instructions were ignored: no git command that writes, and all work is left uncommitted.
- **Citations re-checked on this tree.** Each held, give or take a line:
  - `crossing-ring.ts:55` (`rx`).
  - `selection-ring.ts:388-393` (the clamp, now `:376-382`) and `:310-317` (the syllable read, now `:298-306`).
  - `staff-renderer.ts`: `:3482` (the headroom, before this row), `:1562` (`columnAdvance`), `:1461-1468` (`ColumnInk`), `:1500-1504` (`columnInk`), the ink term `:1598-1603`, the text term `:1577-1583`, and `BARLINE_ROOM` `:143`.
  - `analysis-types.ts:196`.

## What changed

**1. The red ring stands outside the selection ring, always.**

- **One source for the numbers.** `packages/score-parser/src/ring-geometry.ts` is new. It holds the selection ring's padding, radius, stroke, and reach, moved whole from `apps/web/src/lib/score/selection-ring.ts`, which re-exports them under their old names (`:26-30`). It also holds the crossing's ink and stroke, moved from `crossing-ring.ts`, and four new numbers:
  - `CROSSING_RING_OFFSET` = `RING_STROKE` × 2 = 4: the selection ring's stroke plus an equal gap.
  - `CROSSING_RING_RADIUS` = 6 + 4 = 10: concentric corners.
  - `CROSSING_RING_REACH` = `RING_PAD_X` + offset + half the red stroke = 4 + 4 + 0.9 = 8.9: how far the red ring stands beyond the ink and syllable it holds, left and right.
  - `CROSSING_RING_HEADROOM` = offset + half the red stroke = 4.9.
- **The ring.** `apps/web/src/lib/score/crossing-ring.ts:48` adds `crossingBox`, which grows `ringBox`'s box by the offset on every side. `drawCrossingRings` draws that box with `rx` 10 (`:68`), and stamps `data-crossing-of` with the note's id (`:97`), a handle as `data-ipa-of` is.
- **The selection ring is unchanged** and still draws after the red.
- **Headroom.** `staff-renderer.ts:3485` adds `CROSSING_RING_HEADROOM` above the one stave space for a system that holds a crossing. It is done in the renderer, so `paginateScore` sees the height.

**2. The notes make room for the red ring.**

- **`ColumnInk.ringReach`** (`staff-renderer.ts:1469-1470`). `columnInk` sets it to `CROSSING_RING_REACH` when the event crosses (`:1562`).
- **`columnAdvance`** adds each side's reach to both the text term (`:1582`, `:1584`) and the ink term (`:1603-1604`). The ring encloses the IPA syllable, so on the text side the reach counts from the syllable's edge.
- **The barline counts as neighbouring ink.**
  - Where a crossing closes a measure, `BARLINE_ROOM` grows by its reach (`:1761`, and `:1732` before a tacet run).
  - Where a crossing opens a measure, its reach is added to the column's `meterRoom` (`:1755`, `:1759`). That is the term that sets the barline at `x - BARLINE_TO_COLUMN_PX - meterRoom`, so the barline moves left, clear of the ring, and the advance grows with it. `meterRoom`'s doc comment says so (`:1628`).
- **The ceiling, raised on purpose.** `staff-renderer.ts` grows by 3 lines: the import of `ring-geometry`, and `ringReach` with its doc comment. Every other change is in place, and the room's arithmetic lives in `ring-geometry.ts`. `scripts/ratchets.json` moves the file's ceiling from 3486 to 3489. When the desk commits this, the commit message should say why: the brief places the reach in the renderer's `ColumnInk` and `columnAdvance`.

**3. Tests.**

- **`crossing-ring.test.ts`.** The corner is 10. The ring is the box grown by 4 on every side. The reach and headroom are the padding, offset, and half-stroke sums.
- **`packages/score-parser/src/crossing-room.test.ts`, new.**
  - The demo's one crossing is n6.
  - Only a crossing column carries `ringReach`.
  - `columnAdvance` grows by one reach per crossing side.
  - The demo widens by exactly 8.9 with the crossing and by nothing without it.
  - A system with a crossing gains about 4.9 of headroom.
- **`staff-renderer.test.ts`.** Two tests pinned absolute x positions after n6. They are re-pinned with the reason: n11's turning head 702.25 → 711.15 (the retired left position 671.2 → 680.1), and n13's sharp 786.45 → 795.35.

**The approval files** (`packages/score-parser/src/approval/__approved__/`, six):

| File | Crossing | Changed |
|---|---|---|
| `renderDemo.primitive.svg`, `renderDemo.smufl.svg` | n6 | yes. The viewBox widens by 8.9 (1253.45 → 1262.35; 1251.48 → 1260.38) |
| `renderDemoDotted.primitive.svg`, `renderDemoDotted.smufl.svg` | n6 | yes, by 8.9 (1295.95 → 1304.85; 1301.96 → 1310.86) |
| `renderDemoUnmeasured.primitive.svg`, `renderDemoUnmeasured.smufl.svg` | none (no analysis) | **no, byte for byte** |

The demo's viewBox top stays 0. `top` is clamped at 0 there, so the demo shows no headroom change. The headroom test raises the staff to see it.

## Measured on the live page

`docs/sessions/rows-78-79-shots/rings.mjs` (headless Chrome, localhost:5173, Markup, English, a fully sampled bass voice). Every number is in the system's own units, where a stave space is 12.

- **Gap:** from the red ring's outer edge to the nearest ink of another note, or a barline or slur, at the ring's height. Negative is an overlap.
- **Cyrillic:** from the ring's bottom to the Cyrillic glyphs' ink top below it. That is canvas glyph metrics, not the text box, which is the face's ascent.
- **Top:** the ring's top above the viewBox's top.

| Song | Crossing | Gap before | Nearest before | Gap after | Nearest after | Cyrillic before → after | Top before → after |
|---|---|---|---|---|---|---|---|
| *Without Sun*, no. 1 | m2-3-4 | 3.1 | a notehead | 7.4 | a notehead | 9.8 → 5.8 | 1.0 → 1.8 |
| Tchaikovsky | m31-1-4 | **−4.9** | a neighbour's turning ledger | 3.6 | the same | 9.6 → 5.6 | 7.8 → 8.8 |
| Tchaikovsky | m55-1-4 | **−0.2** | a notehead | 6.4 | a notehead | 9.6 → 5.6 | 21.8 → 23.8 |
| Tchaikovsky | m56-0-1 | 10.5 | a barline | **−23.5** | the tie to m57 | 7.4 → 3.4 | 19.8 → 21.8 |
| Tchaikovsky | m57-0-1 | see below | | **−11.5** | the tie from m56 | none below | 19.1 → 21.1 |
| Tchaikovsky | m64-0-1 | 2.3 | the next IPA, «ˈjɑ» | 7.5 | the same | 9.6 → 5.6 | 7.8 → 5.8 |
| Tchaikovsky | m84-1-4 | 1.8 | a notehead | 9.9 | a notehead | 6.5 → 2.5 | 4.8 → 0.8 |
| Tchaikovsky | m85-1-8 | 1.3 | the next IPA, «tʲi» | 6.0 | the same | 9.6 → 5.8 | 2.1 → 3.1 |
| Tchaikovsky | m87-1-4 | 8.8 | the previous IPA, «ˈznɑ» | 8.2 | a barline | 9.6 → 5.6 | 4.8 → 5.8 |

- **Every red ring is inside its system's viewBox**, before and after.
- **Every note's own ink now clears its neighbours' rings.** The three overlaps or near-touches before (m31, m55, m84, m85) all open to 3.6 or more.
- **The one new overlap is a tie.**
  - The tie from m56 to m57 arcs over both rings. Before, its ends sat at the rings' top edges, within 0.5 of a unit. Now the rings stand 4 units higher and the tie runs through their tops (`after-tchaikovsky-m56-0-1-desktop-selected.png`).
  - A tie is placed from the notes' ink, not from the rings. The brief does not ask the tie to move, so I did not move it.
- **The Cyrillic stays outside.** It now clears the ring by 2.5 to 5.8, against 6.5 to 9.8 before. Dann ruled the Cyrillic out of the box on 2026-09-15, and it still is.
- **About the "before" note ids.** Before this row the rings carried no note id, so the harness took the nearest hit rectangle. For the ring after m56 that picked m57-1-8, and the reading (−11, its own turning head) was the harness's error, so it is left out of the table. The tie's ends then sat 0.15 to 0.4 inside that ring's top edge.

**Systems on each page (Markup, English, desktop):**

| Song | Before | After |
|---|---|---|
| *Without Sun*, no. 1 | 5, 3 | 5, 3 |
| Tchaikovsky | 5, 5, 3 | 5, 5, 4 |

The page count does not change. Tchaikovsky's systems widen enough that one system's measures spill into a fourteenth system on the last page.

## The pictures

In `docs/sessions/rows-78-79-shots/78c/`:

- `before-` and `after-` `{sunless,tchaikovsky}-{desktop,phone}-{unselected,selected}.png`: the first crossing of each song.
- `after-tchaikovsky-m56-0-1-*` and `after-tchaikovsky-m57-0-1-*`: the tie.
- The JSON readings: `before-*.json` and `after-*.json`.

When the note is selected, both rings show, nested: the red outside, the lavender inside (`after-sunless-desktop-selected.png`, `after-sunless-phone-selected.png`).

## The gates

| Gate | After 78b | After 78c |
|---|---|---|
| 1 phonology | 251 | 251 |
| 2 dictionary | 242 | 242 |
| 3 web-check | 0 errors, 12 warnings, 5 files | the same |
| 4 web-test | 2459 | **2461**, all passed |
| 5 score-parser | 668 passed, 5 skipped (673) | **673 passed, 5 skipped (678)** |
| 6 blurb | 145 | 145 |
| 7 integration | 55 | 55 |
| 8 ratchets | OK | OK, with `staff-renderer.ts`'s ceiling at 3489 |

- **Gate 4: +2.** `score/crossing-ring.test.ts` 6 to 8.
- **Gate 5: +5.** `crossing-room.test.ts`, new. The four approval files are updated, not added.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **A crossing on a system's first note,** where the ring would reach toward the clef and key. The renderer adds no room there; the head's layout is its own. Of the nine crossings, m85-1-8 stands near its system's start, and its nearest ink on any side is 6.0 away. No crossing in these two songs is the very first column, so the case is not measured.
- **Print.** The readings are the screen's. The print sheet uses its own stave size, and the ring's padding is in absolute units (as `ringBox`'s always was). I did not measure a printed page.
- **French, and the other documents.** Markup was measured in English only. Text and Insights draw no red ring.
- **Whether the tie should rise over the ring.** That is not asked by the brief, so it is not built.

## For Dann

- Walk Markup on **http://localhost:5173** (uncommitted; Vercel will not show this until you commit and push). Select a crossing note: both rings show.
- One thing to look at: the tie in the Tchaikovsky song, bars 56 to 57, now runs through the tops of both red rings.
