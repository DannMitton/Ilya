# Memo: the loupe drops a measure's opening rest

Revision 1, 2026-09-16. Built in Claude Code. Nothing is committed or staged.

**Found by Dann on the walk of `eb7d220`:** T05 m. 57 and m. 37 draw a rest on the page and omit it in the loupe. **Fixed, and walked on a local production build (`app.Bq1r7M5w.js`). All five gates pass.**

## 1. Cause

- `staff-renderer.ts:2626` draws a rest with no hit rectangle. A note's hit rectangle starts halfway from the column before it (`:2457`, `:2894`), and that column can be the rest.
- `measureWindow` (`loupe.ts:79`) opens the loupe's window at the measure's leftmost hit rectangle. On a measure that opens on a rest, that point lies between the rest and the note: 576.00 on m. 37, against the rest's ink at 558.52 to 564.09.
- The old barline search accepted a barline only inside that window, and this one (543.28) lies left of it.
- **Not a regression.** The deployed `570d76f` bundle has the same three rules. That is established from its code, not a walk: the live site could not fetch T05.

## 2. What changed

- `loupe.ts:631` `openingBarline`: the rightmost staff-wide barline left of the first note's ink. It returns null where there is none (a system's first measure) or where the note's ink is unknown. `Loupe.svelte:728` opens the window at that barline + ½ space. A system's first measure keeps today's path.
- `loupe.ts:646` `isRestGlyph` (SMuFL Rests, U+E4E0 to U+E4FF). `loupe.ts:655` `firstInkIn`.
- `Loupe.svelte:287` `restOrNoteInk`: the x of note marks (event-group children, `[data-of-event]`) and rests (rest glyphs, multibar rest groups) only. Underlay, ties, slurs, and ledger lines are excluded.
- **N.139 leftover:** the meter panel's run-in now measures to the first rest or note on every measure (`Loupe.svelte:994-997`). Where a band is carried, it measures from the band's left edge. `openAfterPageMeter` receives the first rest or note (`:859`), so a meter change that opens on a rest also works.
- `loupe.test.ts:681` and `:736`: 8 tests. They cover a rest-first measure at the measured m. 37 positions (including the old window, as the defect), a note-first measure, drawing order, a tacet-run barline right of the note (N.141's case), a system's first measure, unknown ink, rest glyphs, and the span rule.

## 3. Walk (desktop layout 1440 × 900, loupe scale 2.182; expectations stated before reading)

Gap = meter panel's digit ink to the first rest or note's ink.

| measure | expected left edge / gap | body opens at | rest ink, in the loupe? | gap |
|---|---|---|---|---|
| T05 m. 28 | 381.00 / 27.25 px | 381.00 | 393.49–399.06 and 423.22–429.06, both in | 27.25 px, 12.49 units, to the rest |
| T05 m. 35 | 381.90 / 27.25 px | 381.90 | 394.39–399.96, in | 27.25 px |
| T05 m. 37 | 546.03 / 27.25 px | 546.03 | 558.52–564.09, in (shown in screenshot) | 27.25 px |
| T05 m. 57 | 529.44 / 26.93 px | 529.44 | 541.78–547.62, in | 26.92 px |
| T05 m. 81 | 352.97 / 26.93 px | 352.97 | 365.31–371.15, in | 26.92 px |
| control T05 m. 36, opens on a note | 471.88, unchanged / 25.64 px | **471.88** (was 471.88) | none | 25.64 px (was 31.30) |
| Sunless m. 2, change to 12/8 | 148.47 / 24.00 px | 148.47 | none opening | **24.00 px, 2.000 spaces** |
| T05 m. 9 | 112.48 / 25.64 px | 112.48 | none | **25.64 px**, 2.136 spaces (was 37.28) |
| T05 m. 14, opens a system | 45.44 / 24.00 px | 45.44 | none | **24.00 px**, 2.000 spaces (was 26.44) |

Every reading matched its expectation. The 26.92 against 26.93 is rounding.

**Why the gap is not always 2 spaces.** The body opens half a space after the barline, so the panel adds air only when the music stands closer than 2 spaces. Where the page's own air is wider, it shows: 12.49 units on the rest measures, 11.75 on m. 9 and m. 36.

## 4. Gates

phonology 216, dictionary 235, web-check 0 errors and 7 warnings in 4 files, **web-test 1181 (1173 + 8 new, all in `loupe.test.ts`)**, score-parser 564 passed and 5 skipped (569).

## 5. Not established

- **A system's first measure that opens on a rest.** No example exists in T05 or Sunless 01, so both the kept path and the carried band's rest-or-note air are established by reading only.
- A multibar rest as the first music after the barline in a held window. The rest walk's `[data-tacet]` branch is untested in the browser.
- **DESK DEFAULT:** rests are recognized by glyph range, because the renderer gives them no handle. A handle in `staff-renderer.ts` would be sturdier and was outside scope.

**New file for git add:** `docs/sessions/memo-loupe-opening-rest_r1_2026-09-16.md`. Changed: `apps/web/src/lib/shane/Loupe.svelte`, `loupe.ts`, `loupe.test.ts`.
