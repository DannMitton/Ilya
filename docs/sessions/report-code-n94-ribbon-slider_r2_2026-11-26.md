# Report: N.94's ribbon, the French abbreviations, and room at the ends (Code, Mac lane), r2

2026-11-26. Builds `amendment-code-n94-ribbon-french-and-ends_r3_2026-11-26.md` on brief r3, on branch
`mac-n94-ribbon-slider`. **Supersedes report r1**, which stays on disk because the amendment and both reviews cite its
lines. **Nothing is committed, merged, or pushed.**

## Where it stands

Both items are built. The French labels read « 2de m » to « 4te J » and TT, and on a phone the pair at −6 and at +6
prints whole and centred. `insights-key-lines.test.ts` passes, 34 of 34. Seven gates are at baseline. Gate 4 is up
16 on the old baseline: r1's 15 and one added here. The baseline is yours to move.

## Step 0

Measured in French in headless Chromium, on a print with no sharps or flats, 10 px Source Sans 3 loaded.

**Part 1, the labels, before the build** (each string set into its own nodes, with U+00A0). None overflows its node or
a neighbour's. Overhang is zero; the figures are the space left on each side.

| label | width | per side at 390 (node 55.7) | at 320 (45.7) | at 1440 (59.7) |
|---|---|---|---|---|
| 2de m | 25.77 | 15.0 | 10.0 | 17.0 |
| 2de M | 24.75 | 15.5 | 10.5 | 17.5 |
| 3ce m | 24.58 | 15.6 | 10.6 | 17.6 |
| 3ce M | 23.55 | 16.1 | 11.1 | 18.1 |
| 4te J | 19.97 | 17.9 | 12.9 | 19.9 |
| TT | 10.73 | 22.5 | 17.5 | 24.5 |
| ORIG. | 23.63 | 16.0 | 11.0 | 18.1 |

Left and right differ by 0.02 px at most. The closest neighbours are 30.5 px apart at 390, 20.5 at 320, and 34.5 at
1440.

**Parts 2 and 3, the end pairs, before and after.** "Outside" is the painted word past the window's edge, and
"clear" is the room left inside it, in px. Both spellings were bold in turn.

| width, node | word | before: outside, bold / faded | after: clear, bold / faded | outer tap half, before → after |
|---|---|---|---|---|
| 390, −6 | sol bémol | 16.9 / 16.0 | 38.8 / 39.7 | 27.5 → 83 |
| 390, +6 | fa dièse | 8.3 / 7.4 | 47.4 / 48.3 | 28.5 → 84 |
| 320, −6 | sol bémol | 21.9 / 21.0 | 23.8 / 24.7 | 22.5 → 68 |
| 320, +6 | fa dièse | 13.3 / 12.4 | 32.4 / 33.3 | 23.5 → 69 |

The inner word was inside the window throughout. After the build the end node's centre is 83.6 px from the edge at
390 (slot two or six) and 68.6 px at 320.

## What was built

**Item 1.** Six `fr` values in `i18n.ts`, written with ` ` escapes; no English value changed. The comment above
them now records the ruling and the provenance. `transposition-ruler.test.ts` pins all six French values.

**Item 2.** The one logic edit is the clamp in `slideWindow`: the low bound is −1 only for the first node and the
high bound 7 only for the last. `TranspositionRuler.svelte`'s drag clamp is untouched. The desktop's code changes are
comments only.

**Comments corrected** at each site the amendment names, and the doc line over `WINDOW_SLOTS`.

## Tests

**The French end test was run on the tree before either item was built, and failed as expected.** I ran it ahead of
the build, which the amendment requires. At 390 it caught −16.91 px at −6 and −7.44 px at +6 (−16.03 and −8.34 with
the other spelling bold), and the end nodes in slots one and seven. At 320: −21.91 and −12.44. After the build it
passes at both widths.

**The French dock route at `fifths: 0`:** the Piece band in the drawer (drawer pull, PIÈCE, « Essayer une autre
tonalité »). `openDock` was not used. The test swaps the spelling with a scripted click, so that it could run on the
unrepaired tree, where the outer half was off the screen. The tap sizes above were measured by hit testing.

**Unit:** the end expectations are `[-1, 0, 6, 7]`; every node from every window −1..7 rests in slots two to six; and
one added case: the window is at −1 only for the first node and at 7 only for the last.

**Browser:** the window test now expects −6..−1 at −6 and +1..+6 at +6, checks that one step off the end brings back
seven nodes, and has a new title. A new test drags from inside the window across the blank to the screen's edge, at
both ends, and stays on the end node. The desktop French test's assertions are unchanged.

**Snap and drag tests from brief r3**, still passing: unit "the drag snaps" (nearest node, midpoint toward zero, the
two midpoints beside zero, past either end); browser, in the same file, "drag from 0 to −2" (no new engraving while
down, one on release), the clamp and off-strip release test, and the phone's touch drag.

**Not run:** the rest of the Playwright suite.

**Gates**, run from a copy of `ilya-ship.sh` that cannot stage or commit.

| gate | result |
|---|---|
| 1 phonology | 462 passed, at baseline |
| 2 dictionary | 248 passed, at baseline |
| 3 web-check | 0 errors, 12 warnings in 5 files, at baseline |
| 4 web-test | **6960 passed, 1 skipped (6961).** Baseline 6944 and 1: +16 |
| 5 score-parser | 913 passed, 5 skipped, at baseline |
| 6 blurb | 178 passed, at baseline |
| 7 integration | 159 passed, at baseline |
| 8 ratchets | OK |

## What brief r3's memo section asks for

**The three twin nodes**, from the running app on `sunless-01-engraved.musicxml`:

| node | printed order | bold on first arrival |
|---|---|---|
| −3 | C♭ / B | B |
| −1 | D♭ / C♯ | C♯ |
| +4 | G♭ / F♯ | F♯ |

**Spelling half, hit size, width × height in px.** The height is 46 (hit testing at half-pixel steps reads 46.5 to 47).

| where | outer half | inner half |
|---|---|---|
| desktop, any node but the ends | 96 × 46 | 96 × 46 |
| desktop, −6 and +6, clipped at the card | 49 × 46 | 96 × 46 |
| phone 390, slot two or six | 83 to 84 × 46 | 96 × 46 |
| phone 320, slot two or six | 68 to 69 × 46 | 96 × 46 |

**The 44 px exemption in r1 is no longer needed:** every phone half now measures at least 68 px wide. The record is
the desk's.

**Pictures**, in `docs/sessions/n94-ribbon-shots/`:
- `ruler-1440-sunless-01-at-minus-1.png`
- `dock-390-sunless-01-at-minus-1.png`
- `dock-390-sunless-01-as-printed.png`
- `dock-390-fr-at-minus-6.png`: six nodes and the blank
- `dock-390-fr-at-minus-3-after-minus-6.png`: seven nodes, the blank gone
- `dock-390-fr-at-plus-6.png`

**Phone redraw, carried from earlier today and not measured again** (headless Chromium, Apple M4, 390 × 844, dev
server, two pages, tap to the second painted frame): median 63 ms unthrottled (58 to 91), 136 ms at 4× (126 to 223),
214 ms at 6× (194 to 368). This amendment does not touch the redraw. **Not a phone.**

## The focus ring, found in this run and then repaired

Asked of Dann after the first version of this report: "Should I fix the keyboard focus ring that crosses the spelling
words?" **Answered "Yes, fix it".**

- **The node's ring** ran round the whole radio, band included, and through « sol bémol » and « fa dièse ». It now
  stops at the top of the spelling band (a border on `.node-hit:focus-visible::after`, so a forced-colours mode still
  draws it). The radio's tap area is unchanged.
- **The faded half's ring**, found while checking the first, ran down the middle of the pair and through the slash. It
  now goes round that half's word, at full strength while ringed. The half's tap area is unchanged.

Both are asserted in the desktop keyboard test, which failed on each before its repair. The whole browser file passes
afterwards, 34 of 34, and the gates read as in the table above. The two rings share their styles with the dock, where
I checked them in pictures; the assertions run on the desktop only. The French pictures were taken again and show the
new ring.

## Still standing from r1

- **A transposed song keeps "As printed" alone:** ruled, "Leave it" (`OPEN.md`, ruling 22).
- **Node zero on a print of five or more sharps or flats** commits the print, a choice I made inside the brief
  (r1, item 2).
- **The clef question** floats over the ribbon, and answering it closes the ribbon. **A dock opened from the Piece
  band** opens over the drawer. Both overlaps are older than this work.
- **Unruled French:** `key.ruler.respell` and `key.ruler.undo`.
- **Held:** the readout says tone words for one and two semitones beside labels that name seconds.

## NOT ESTABLISHED

**NOT ESTABLISHED beats a complete invented answer.**
- Anything on a real phone, and any WebKit engine, including the positive `translateX` under `overflow: clip` that
  now shows the blank at −6.
- Screen reader output.
- The production build. All browser work ran on the dev server.
- `3ce` and `4te` in French music writing; *GDRM* not opened.

## Tree

Source changes, all uncommitted: `lib/i18n.ts`; in `lib/melody/`, `TranspositionRuler.svelte`,
`TranspositionDock.svelte`, `transposition-ruler-state.svelte.ts`, `transposition-ruler.ts`,
`transposition-ruler.test.ts`; `e2e/insights-key-lines.test.ts`. `docs/memory/OPEN.md` and `QUEUE.md` are also
modified in the folder and are not this lane's writes. The folder is still on `mac-n94-ribbon-slider`; the staff
finder session needs it back on `mac-staff-finder` before it resumes.
