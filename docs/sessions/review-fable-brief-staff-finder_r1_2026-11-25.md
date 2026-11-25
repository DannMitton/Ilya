# Fable's review of the staff finder brief r1 (2026-11-25)

Commissioned by the desk 2026-11-25 on Dann's "Yes proceed with the Fable farmout". Read `brief-code-staff-finder-light-scan_r1_2026-11-25.md` (md5 `97c77aec`), the measured report and its scripts, and the cited lines from `Shane` at `63e5101b`. **169,138 tokens, 18 tool uses, 5.3 min, cap 250k.** Below the quoted range of 180k to 250k for its kind.

## VERDICT: DO NOT SEND as r1. All findings repairable by edit; r2 carries every one.

Fable found the diagnosis sound and the `stretchBand` arithmetic right, and failed the brief on two things the lane would hit in its first hour, plus several wrong citations.

## Blocker 1: the lane cannot read its inputs

r1 said "Code, new cloud lane". Every page it measures is on the Mac and untracked, and `git ls-files` returns no such PDF. `ENVIRONMENT.md:6128-6132`: a cloud session has no bridge to the Mac. Steps 0a, 0b, 2, and 3 could not produce one figure. Fable also flagged `CONTRACT.md:106` exception (b), "the scan reader stays on the Mac", and could not establish whether a later ruling lifted it.

**Settled by the desk, not by Fable and not by Dann:** the desk searched the memory files and found no later ruling. The 2026-10-02 ruling stands, so r2 is a Mac lane and names all three pages by full path.

## Blocker 2: step 1 misdescribed what the ink constant feeds

r1 said "pass it to `staffIn`, `lineRows`, and `fives`". Read from the tree and confirmed by the desk:

- `fives` (`metre-windows.ts:94-111`) takes rows only and tests no pixel. It holds the thickness ceiling, not the ink.
- `inkAt` (`:67-69`) is also called by `extent` (`:163`, the staff's ends), `meanInk` (`:263`, behind `isBar`), and `strokes` (`:294`, the bar-line columns). r1 named none of them.
- `lineRows` and `fives` have a second caller outside the module, `underlay-below.ts:75` inside `topLineBelow`, called for every system at `underlay-prepare.ts:219`. It sets the lower edge of the lyric band. r1 did not name it.

r1's done-when ("`metre-windows.ts` holds no page-wide ink constant") could not be met without giving `extent`, `strokes`, and `meanInk` a level too, and no done-when in r1 counted bar lines or staff ends, so a regression there would have passed every stated test. r2 adds step 0d for exactly this.

## The nineteen amendments, all applied in r2

1. Strike "cloud lane"; name the lane and give all three pages by full path. **Applied: Mac lane.**
2. Rewrite step 1's list of what takes the level, with `fives` named as the ceiling's holder and `topLineBelow` named.
3. New step 0d: `extent`'s `x0`/`x1`, `barLines`' count, and `topLineBelow` per system, before and after, with a stated tolerance.
4. `underlay-band.ts:126` is a doc comment; the `return []` is `:129`. **Desk checked: Fable is right.**
5. `page-pdf.ts` and `page-image.ts` are under `lib/reader/`, not `lib/omr/`. **Desk checked: Fable is right.**
6. No comment stands at `:104-105` or at its source `staff.py:44`, so what the ceiling rejects is NOT ESTABLISHED; report it before changing it.
7. `underlay-looks.ts` cites off by two and one (`:64-73`, `:29`); the stretch argument restated in its stronger form (equivalent to a raw threshold of 163; the port found 0 of 16 at 170 with the ceiling off).
8. The sweep's resamplers ran at 140 only; 16 of 16 at 195 and 200 came from one bilinear render.
9. The window is no wider than fifteen levels sampled every five: 15 at 190, 16 at 195 and 200, 13 at 205, 0 at 215.
10. r1's "a ceiling tuned at 140 does not hold at 195" contradicted the report: the 0.45 ceiling holds at 195 and 200 and fails from 205.
11. **r1's claim that the other ink sites act on glyph ink is false for one.** `tuplet-number.ts:83`, inside `staffSpace` (`:72-99`), measures the staff space from the rules themselves at 140, and `:149` removes staff lines at the same constant. It is live (`homr-reader.ts:38`) and is presumed to fail on this page. **Desk checked the lines: Fable is right and the desk's own reading from looking at the page was wrong.**
12. The site table is incomplete; add `extent`/`meanInk`/`strokes`, `underlay-below.ts:75`, `underlay-looks.ts:27` and `:29`, and `reader/staff-detect.ts:33` through `ScoreUploader.svelte:67`.
13. r1's test claim could not hold with r1's own "arrives as an argument": the calls change. State the level on a blank page and on a page under one per cent ink; neither may be NaN.
14. Close the gap that would let a tuned rule through: one closed-form expression, no branch, clamp, floor, fallback, or lookup, including `max(140, …)`. Strike "the constant 140 becomes a special case", which reads as leave to keep it as a branch.
15. Sweep with the tree's own functions on the pdf.js raster with homr's own boxes, and add held-out pages. `omr/fixtures/` holds nine `.musicxml` files and no page image, so "every page of the fixture set" named nothing a staff could be lost from.
16. Done-whens get a margin: the pair must sit N rule-units and M ceiling-units inside every page's passing region, or it is reported as not robust and does not ship.
17. Step 0a also saves homr's boxes; 0a and 0c get their own done-whens.
18. The ask names notes: step 3 reports the voice notes `systemsOf` assigns to a staff.
19. Where the rule holds a proportion, the measurement sets it and the comment names it.

## Enhancements, two taken

Taken: `paperTone` could return the white margin rather than the paper on a scan that does not fill its PDF page (`reader/page-pdf.ts:210-211` paints white first), so 0a reports both; and the level has two entry points in two workers, so r2 says one function called at both.

Not taken into r2's prose: the naming of `metre-reader.ts:348` and `:427` as `profiles` and `cutRatio` is adopted in step 0c; "both pages they were tuned on are high-contrast" was softened rather than cited.

## What Fable could not establish

Whether a later ruling lifted "the scan reader stays on the Mac" (settled by the desk since); whether a cloud session can run pdf.js in a browser; what `extent`, `strokes`, `staffSpace`, and `hasStaves` return on page 4 (it read the lines and ran nothing); what the 0.45 ceiling was set to reject; whether page 4 carries a tuplet number or a piano staff; and whether walks 4 and 5 of N.220 are scan walks, which it could not find in `STATE.md` (it is in `OPEN.md`, N.220, and the desk read it this session).

CONTRACT sections 1, 3, 5, and 6 were not read in full by Fable, on its output limit.
