# Memo: N.139, every meter assignment draws on the page

Revision 1, 2026-09-16. Built in Claude Code against brief r1 with desk amendments §0.1 to §0.4. Nothing is committed or staged.

**Verdict: NOT READY TO SHIP. The page draws correctly on both walk scores, but three things need files outside this scope (§5), and gate 5 has 3 failures (§4).**

## 1. What changed

`packages/score-parser/src/staff-renderer.ts`:

- `:147` `BARLINE_TO_COLUMN_PX = 18` names the old literal `nx - 18`. `:169` `METER_RUN_IN_SP = 2`, moved from `loupe.ts` with its comment. `:179` `METER_KEY_CLEAR_SP = 1` and `:180` `METER_BARLINE_CLEAR_SP = 1` (sources in §6).
- `:392` new option `incomingTimeSignature`, which nothing passes yet (§5.3).
- `:658` `meterInk`: digit glyphs and ink width from each digit's SMuFL `bBoxSW`/`bBoxNE`. The layout walk and the draw both call it. `:634` has the width used when no font is loaded.
- `:690` `meterDeclaredAt`: a measure declares a meter when its snapshot differs from the measure before.
- `:727` `tacetRuns` starts a new run at a change of meter.
- `:1593` `layoutColumns` adds `meterRoom` to the advance of a column that opens a measure mid-system. `LayoutColumn.meter`/`meterRoom` at `:938`.
- `:2070-2088` head: when a meter draws, `ksEnd = meterLeft - sp(METER_KEY_CLEAR_SP)` (`:2085`). `:2154` emits it. `:1767` `meterMarkup` draws `<g data-meter="b/t">`, with the count baseline on line 2 and the unit baseline on line 4.
- `:2409` tacet draw and `:2544` note draw: the barline stands `meterRoom` further left, and the digits follow it.

`packages/score-parser/src/index.ts:56` exports `METER_RUN_IN_SP`. `apps/web/src/lib/shane/loupe.ts:15` imports it and `:369` re-exports it, so `loupe.test.ts` is untouched. `staff-renderer.test.ts:2211` adds 6 tests: declaration, head geometry, no restatement at a system start, mid-system geometry, `sliceWidth` equal to the rendered width with a change inside the slice, and the tacet split.

**New files for git add:** `docs/sessions/memo-n139-page-meter_r1_2026-09-16.md` only.

## 2. Measurements (production build, port 4173, entry `app.CJCKQ_NF.js`; before was `app.CuOtITRa.js`)

| reading | expected before measuring | before | after |
|---|---|---|---|
| Sunless 01 pages | brief: pagination WILL change | 2 | 2 |
| Sunless 01 systems | as brief | 0-2, 3-5, 6-7, 8-9, 10-11, 12-14 / 15-16, 17-17 | identical |
| Sunless sys 1 `clefX` | 14.16 (first sharp 35.24 − 5.5 − clef 15.58) | 28.7 | **14.16** |
| Sunless sys 1 `staveLeft` | 8.66 | 23.2 | **8.66** |
| Sunless signatures drawn | 6/8 head, 12/8 at m. 2 | none | 6/8 head of 0-2; 12/8 in 0-2 |
| Sunless barline to 12/8 ink | 5.5 (1 space) | n/a | 5.50 (bar 135.71, ink 141.21) |
| Sunless 12/8 ink to m. 2 notehead | 11.0 (2 spaces) | n/a | 11.00 (155.64 to 166.64) |
| T05 pages and systems | unchanged: no change of meter | 2; 0-12 … 88-89 | identical |
| T05 signatures drawn | exactly one | none | one 2/4, head of 0-12 |
| T05 sys 1 `clefX` / `staveLeft` | both about 15 px left | 34.94 / 29.44 | 19.96 / 14.46 |

Pagination did not move on either score. Sunless m. 1 and T05 m. 1-8 are tacet, so each opening meter sits in the head and costs no column width. The 12/8 room fitted inside system 1's existing slack. The brief expected a change, and none occurred.

**Head width at 0, 4, and 7 accidentals.** Probe run through vitest with Finale Maestro's real metadata, `lineGap` 5.5, `leftMargin` 76, treble clef. The probe was deleted afterward, and its table is in the scratchpad. **Expected before running:** 0 fits, 4 clamps the stave edge, and 7 collides.

| meter, key | clefX | clef right | first accidental | result |
|---|---|---|---|---|
| 6/8, 0 | 32.68 | 47.71 | n/a | fits |
| 6/8, 2 | 14.71 | 29.74 | 35.24 | fits |
| 6/8, 4 | 2.24 | 17.27 | 22.76 | **staveLeft clamps to 0**, clef indent 2.24 px, under 1 space |
| 12/8, 4 | 0 | 15.03 | 16.63 | **clamps**, clef-to-key gap 1.6 px |
| 6/8, 7 | 0 | 15.03 | 4.06 | **COLLIDES by 11 px** |
| 12/8, 7 | 0 | 15.03 | −2.08 | **COLLIDES by 17 px**, first sharp off the system |
| no meter, 7 (today) | 0 | 15.03 | 18.6 | already clamps before N.139 |

## 3. `BARLINE_ROOM` and `page-layout.ts`

Confirmed: `page-layout.ts` never reads `BARLINE_ROOM`. `sliceWidth` sums `layoutColumns` advances (`page-layout.ts:136-137`). The meter room is inside the advance (`staff-renderer.ts:1593`). The new test at `:2211` shows that `sliceWidth` equals the rendered width for a slice with a change inside it. I did not edit `page-layout.ts`. The old comment on `BARLINE_ROOM` said the opposite; it now reads correctly at `staff-renderer.ts:135-139`.

## 4. Gates

| gate | baseline | now | movement |
|---|---|---|---|
| phonology | 216 | 216 | none |
| dictionary | 235 | 235 | none |
| web-check | 0 errors, 7 warnings, 4 files | same | none |
| web-test | 1173 | 1173 | none |
| score-parser | 555 passed, 5 skipped (560) | **558 passed, 3 failed, 5 skipped (566)** | +6 new tests pass; 3 old tests fail |

All 3 failures come from the header clamp in §2, at the package default stave (`lineGap` 12, `leftMargin` 92): `staff-renderer.test.ts:127` and `:1499` pin the flat at x 53, and `:1185` asserts Gould r81's one-space clef indent. At that stave a 3/4 plus one flat puts the clef at 0. I read the tests first. They are sound, so I left them failing rather than pin a collided header.

## 5. Needs files outside scope (not done)

1. **The header has no room.** A wider head must move the content start, and `sliceWidth` must see the move, or the estimate and the ink part company. That needs `page-layout.ts` (a head-width term in `sliceWidth`) or a larger `leftMargin` in `apps/web/src/lib/shane/engraving.ts:35`. **This is the one to decide before shipping.**
2. **The loupe doubles the meter.** Walked on Sunless m. 2: the loupe drew its own 12/8 panel, and then the body crop (x from 150.14) carried the right-hand part of the page's 12/8 (ink 141.21 to 155.64). The fix is in `Loupe.svelte`: strip `[data-meter]` from the clone, next to `:1003`, and skip it in the band walk at `:896`. The same band walk would carry a page head meter into a system-opening measure (`:914`). That case is established by reading only, because both walk scores open on tacet measures. T05 m. 9 was checked and is clean.
3. **A change on a system's first measure draws nothing.** `sliceScore` replaces `timeSignatures` with the slice's snapshot (`page-layout.ts:107`). The fix is one line beside `:222`: `incomingTimeSignature: parsed.measures[a - 1]?.timeSignature`. The renderer side is built and tested.

## 6. Not established

- **Gould's key-to-meter and barline-to-meter clearances were not read from the book.** Both 1-space values come from the priors memo's low end: r236 at `memo-gould-dimensional-priors_r1_2026-08-24.md:22` and r242 at `:34`. The font's `engravingDefaults` gives neither.
- `METER_KEY_CLEAR_SP` duplicates `METER_LEAD_SP` at `loupe.ts:379`. Both are 1. Moving that constant too was outside scope.
- Whether Gould breaks a multibar rest at a change of meter.
- The MNX parser inserts a 4/4 where a source declares no meter, and the head draws it.
- The browser `clefX` before the change (28.7) is 0.55 px left of the probe's 29.25. The cause was not found.

## 7. My decisions (all reversible)

- **DESK DEFAULT:** a declaration is a change of value, so a restated identical meter draws nothing. This is forced by §5.3's slicing.
- **DESK DEFAULT:** the head's run-in is measured to a black notehead, not to the first column's ink, so the clef stands at the same x on every system. Mid-system, the run-in is measured to the column's real leftmost ink, as the loupe does.
- **DESK DEFAULT:** a tacet run that opens on a change stands its H-bar the run-in from the digits.
- **DESK DEFAULT:** in primitive mode a digit is 1.5 spaces wide, drawn as bold text.
- **DESK DEFAULT:** I stopped a stale `vite preview` (PID 23974, started 03:24) that held port 4173. I created an "Untitled, 2026-09-16" song in the pane's library for T05 rather than replace the Sunless song.

---

# Round 2, 2026-09-16: forward head, loupe, and system-start changes

Approved at the desk, with scope widened to `page-layout.ts`, `engraving.ts`, and `Loupe.svelte`. **This round supersedes §5, and the verdict at the top of this memo no longer holds: all five gates pass, and both scores were walked.**

## R2.1 What changed

- **Forward head.** `staff-renderer.ts:766` `systemHead` lays the head out left to right. The stave starts at `leftMargin`, the clef is indented `sp(1)` (r81), the key signature follows at `sp(1)` (r236), the meter at `METER_KEY_CLEAR_SP`, then the run-in to a black notehead's left edge: `METER_RUN_IN_SP` after a meter, and `HEAD_RUN_IN_SP = 2.5` (`:705`, r240 key row) after a clef or key. It returns `contentLeft`, the first column's x. `:713` `headMeterSignature` decides whether the head draws a meter. The renderer calls both at `:1950` and starts its columns at `head.contentLeft` (`:1961`, `:1987`, `:2007`). There are no `Math.max(0, …)` clamps.
- **One function for both callers.** `page-layout.ts:143` `sliceWidth` calls `systemHead` with the slice's first measure's key and meter, and with the bar before it as the incoming meter. It returns `contentLeft + advances + trailing`. `RENDER_DEFAULTS` is gone.
- **Changes at a system start.** `page-layout.ts:237` and `:327` pass `incomingTimeSignature` from the bar before the slice.
- **What `leftMargin` means.** It is now the stave's left edge. Defaults: `staff-renderer.ts:402` and `engraving.ts:41` are both **0** (were 92 and 76). Nothing persists this value or shows a control for it; the only reader in the app is `VoiceProfilePane.svelte:1082`.
- **Loupe.** `Loupe.svelte:1015` strips `[data-meter]` from the clone. `:262` (the ink walk) and `:909` (the carried band) skip it, so the panel measures its run-in to the real music.

## R2.2 Tests: score-parser 555 → 564 passed, 5 skipped (569), 0 failed

**+9 from N.139, all new tests.** 6 were added in round 1. This round replaced round 1's head test with 2 (`staff-renderer.test.ts:2249`, `:2266`: stave edge 0 and clef at 1 space for 0, 4, 7, and −7 accidentals, with nothing colliding) and added `:2320` (`sliceWidth` equals the render when a change opens the slice) and `:2337` (a paginated change on a system's first measure draws there and nowhere after).

**Round 1's three failures:** `:1185` (Gould r81 indent) now passes unchanged. `:127` and `:1499` pinned the flat at x 53. I read both before changing them. They assert where the head puts the key signature, and forward layout puts it at 12 + 24 + 12 = 48 in primitive mode, so I updated them to 48 with that derivation.

**Four more pinned absolute x at the demo stave and failed this round:** `:568` 323 → 348.2, `:578` 677.05 → 702.25 (and 646 → 671.2), `:596` 761.25 → 786.45, `:1508` ellipse cx 92 → 117.2. I read each one first. Each asserts an offset between marks (turning head beside sung head, accidental beside barline), and each x moved by exactly +25.2 because the demo's first column moved from 92 to 117.2. A probe confirmed all four shifted values before I edited. None of them expects a collision.

## R2.3 Measurements, stated before reading. Production build `app.B2i1fcEI.js`; before is round 1's `app.CJCKQ_NF.js`

| reading | expected | before (r1) | after |
|---|---|---|---|
| Sunless pages / systems | pages stay 2; systems may drop | 2 / 8 (3,3,2,2,2,3 · 2,1) | **1 / 6** (3,3,3,3,3,3) |
| Sunless stave edge, every system | 0 | 8.66 on sys 1, 23.2 on the rest | 0 on all |
| Sunless clefX, every system | 5.5 | 14.16 / 28.7 | 5.5 on all |
| Sunless sys 1 first column | 67.34 (tacet m. 1) | 76 | head 6/8 ink 44.55–52.84 |
| Sunless first notehead, sys 2 on | 52.80 | 72.5 | **52.8** |
| Sunless sys 1: barline to 12/8, 12/8 to notehead | 5.5, 11.0 | 5.5, 11.0 | 5.5 (128.54 → 134.04), 11.00 (148.47 → 159.47) |
| T05 pages / systems | pages stay 2; systems may drop | 2 / 11 (6 · 5) | **2 / 10** (6 · 4) |
| T05 stave edge / clefX, every system | 0 / 5.5 | 14.46, 29.44 / 19.96, 34.94 | 0 / 5.5 on all |
| T05 first notehead, systems without a meter | 45.95 | 72.5 | **46.56** |
| T05 signatures drawn | exactly one | one 2/4 | one 2/4, head of 0-12 |

**Misses.** (1) I expected Sunless to stay on 2 pages. Each system gained 20 px, every system now holds 3 measures, and all 6 fit the first page window (last system ends at y 692 of 749). (2) T05's first notehead is 0.61 px right of my figure because its key is one sharp (`e262`), not the flat I assumed. A sharp's step is 6.24, not 5.62. All systems on both scores are 624 px, the full line.

**Head at 0, 4, and 7 accidentals** (Finale Maestro metadata, `lineGap` 5.5, stave edge 0, treble, via a vitest probe that I deleted afterward). Expected: stave 0 and clef 5.5 throughout, first notehead 45.32 / 75.76 / 94.47 for 6/8, 51.46 / 81.90 / 100.61 for 12/8, and 34.28 / 64.72 / 83.43 without a meter. **All matched to 0.01 px.** Clef right 20.53 and first accidental 26.03 in every keyed row. Key to meter 6.5 (5.5 plus the key step's 1 px). Meter to notehead 11.00. −7 flats: notehead 90.16 (6/8), 96.30 (12/8), 79.11 (no meter). Nothing collides at any count. Round 1 collided by 11 to 17 px at 7.

**Loupe.** Sunless m. 2: one 12/8, from the panel, and no clipped copy. The clone holds no `data-meter`. T05 m. 9 and m. 14: one 2/4 each, from the panel.

## R2.4 Gates

phonology 216, dictionary 235, web-check 0 errors and 7 warnings in 4 files, web-test 1173: no movement. score-parser 564 passed, 5 skipped (569): +9, cause in R2.2.

## R2.5 Not established, and decisions

- **Loupe run-in on a mid-system change is 3 spaces, not 2.** On Sunless m. 2 the body crop opens at 142.97 and the first notehead is at 159.47. The page's 12/8 filled that stretch and is now stripped, and the panel adds no run-in because the body already has more than 2 spaces. Tightening it means opening the body crop after the page's meter room, which is a `Loupe.svelte` change not made here.
- The head run-in ends at a black notehead's edge, so a first note with an accidental keeps less than 2.5 or 2 spaces. Gould's shorter r240 figures are still not implemented.
- **DESK DEFAULT:** the stave starts flush with the page's content edge (`leftMargin` 0). The staves used to start 23 to 29 px in.
- **DESK DEFAULT:** the no-meter run-in, 2.5 spaces, is now measured to the notehead's left edge. The backwards layout measured it to the notehead's centre, which left 0.64 spaces less (half a Maestro notehead, 3.5 px).
- **DESK DEFAULT:** `sliceWidth` reads the key from the slice's first measure, not from `keySignatures[0]`, to match what `sliceScore` hands the renderer.
- Round 1's other not-established items stand (§6). `METER_KEY_CLEAR_SP` still duplicates `loupe.ts`'s `METER_LEAD_SP`.

**New files for git add:** none this round. The memo is already listed in §1. Changed tracked files this round: `staff-renderer.ts`, `staff-renderer.test.ts`, `page-layout.ts`, `apps/web/src/lib/shane/engraving.ts`, `apps/web/src/lib/shane/Loupe.svelte`.

---

# Round 3, 2026-09-16: the loupe run-in on a mid-system change

Dann confirmed the flush stave edge and the run-in to the notehead's edge. Ruled: a measure that changes meter mid-system shows exactly 2 spaces from its meter to the first note in the loupe, as the page does. Scope: `Loupe.svelte` and `loupe.ts`.

## R3.1 What changed

- `loupe.ts:514` `openAfterPageMeter`: the body opens on the page meter's ink right edge when that meter belongs to the held measure. It belongs when it ends at or before the first note's ink and within `METER_RUN_IN_SP + METER_LEAD_SP` of it. The edge never passes the leftmost music ink inside the window, so no mark is cut.
- `Loupe.svelte:804` reads each page meter's ink right edge from the font (`x + bBoxNE[0] × lineGap` per digit), with the drawn box as the fallback. `:833` records whether the body opened on that edge. `:967` then passes `meterLayout` the air to the first NOTE, not to the first ink.
- **Why the second part was needed, measured.** The first build of this round opened the body correctly at 148.47 but read **44.06 px (20.19 units)** on Sunless m. 2. The IPA syllable "ˈkom" starts at 150.27, and N.138's rule held the panel 2 spaces off the first thing in the measure, which was that syllable. Underlay sits below the stave, where the page never measures the run-in to it either.

## R3.2 Gap in the loupe, from the meter panel's digit ink to the first note's ink

Desktop layout at 1440 × 900, loupe scale 2.182 px per unit, `lineGap` 5.5. Expected before reading: Sunless m. 2 at 11.00 units (24.00 px); T05 m. 9 and m. 14 unchanged, because neither changes meter.

| measure | kind | before (round 2 build) | after (`app.DnJmLXyc.js`) |
|---|---|---|---|
| Sunless 01 m. 2 | 12/8, change mid-system | 36.0 px, 16.50 units, 3.000 spaces | **24.00 px, 11.00 units, 2.000 spaces** |
| T05 m. 9 | 2/4, no change, mid-system after a silent run | 37.28 px, 17.09 units, 3.107 spaces | 37.28 px, unchanged |
| T05 m. 14 | 2/4, no change, opens system 13-19 | 26.44 px, 12.12 units, 2.203 spaces | 26.44 px, unchanged |

The Sunless before-figure in px is the 16.50 units read in round 2 times the same scale. It was not read in px on that build. On the final build the Sunless body crop opens at 148.47, the clone holds no `data-meter`, and no mark crosses the body's left edge.

**The T05 measures are not 2 spaces, and this round does not govern them.** Neither changes meter, so the loupe supplies the meter and N.138's rule applies: 2 spaces clear of the first ink in the measure. On m. 14 that ink is 1.12 units left of the notehead, probably a ledger line (not identified). On m. 9 the panel stands clear of ink 5.66 units into the body, not identified, and the notehead is further on. If you want those at exactly 2 spaces to the note too, the same note-based air applies. I have not made that change.

## R3.3 Gates

phonology 216, dictionary 235, web-check 0 errors and 7 warnings in 4 files, web-test 1173, score-parser 564 passed and 5 skipped (569). No movement. No test was added, because `loupe.test.ts` is outside this round's scope.

## R3.4 Not established

- A syllable that reaches left of the page meter's edge makes the body open on the syllable, and the gap to the note then exceeds 2 spaces. Neither walk score has one, so it is not measured.
- What the first ink on T05 m. 9 and m. 14 is (R3.2).

**New files for git add:** none this round. Changed tracked files: `apps/web/src/lib/shane/loupe.ts`, `apps/web/src/lib/shane/Loupe.svelte`.
