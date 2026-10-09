# Brief for Code: the printed tuplet number, read from the page (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 19:58. For Code on the Mac, in the window that did QUEUE rows 49, 52, and 53. QUEUE row 54. Model: Opus.

## What the singer sees, and why

A singer drops Gurilyov's «Раскаяние» and gets bar 25 wrong in twelve notes: the page prints four groups of sixteenth triplets, each marked 3, and Ilya draws sixteen plain sixteenths, so the bar runs a quarter too long and every vowel timing in it is off. Row 53 (`docs/sessions/report-code-song-d-lengths_r1_2026-10-08.md`) found the cause: homr wrote no 3 anywhere on that page, and nothing in its output says which notes the 3s cover. It also found the mirror case: in bar 7 a missed flag and a missed 3 leave the same bar in homr's output, and *Sunless* 5 bar 9 is the counter-case where the 3 is printed. **In both, the printed number on the page is the evidence, and Ilya does not look at it.** Dann's ruling of 2026-10-08 15:50 (`docs/memory/OPEN.md`, "THE CORRECTIONS REDESIGN", item 5): the goal is the rhythm the composer printed, not a bar that adds up.

## The job

Teach Ilya to look for a printed tuplet number (3, and 5 or 6 where printed) on the page image, **only where homr's reading of a voice bar is in doubt**: a bar that reads longer than its metre, or a bar where `triplets.ts` rule 3 would act. Use the place homr gives for each note to find the beam or flag group, then look at the band just above or below it for a numeral. Decide how to detect it (template, a small classifier, an existing OCR, or homr's own symbol output if it carries one); say which and why.

**A false 3 is worse than a missed one.** Ilya abstains unless the numeral is clear, and an abstention leaves the bar as today.

## Measure first, then build

1. **Positive and negative controls, from songs that may be opened:** Gurilyov bars 25 and 7; *Sunless* 5 bar 9; every printed voice triplet in the build songs and in Grechaninov and Varlamov (find them in their truth files); and an equal number of beamed or flagged groups with no number. Report, per control, found, missed, or false.
2. **If it separates** (no false number on any negative control, and most positives found), build it. If it does not, report and change nothing.
3. Wire it so that a found number makes those notes a tuplet in the reading, and so that rule 3 defers to the page where a number was looked for: a bar where the page shows no number is not made a triplet by rule 3 (which repairs bar 7) unless the evidence says so; say what you chose and why.

## Prove it

- Before and after through the drop box, as row 53 did: the 17 opened and build songs. No song may get worse.
- Then A, B, C, E, F once, one line each, never opened (row 49's strict limits).
- **Do not open, read, or run anything on the new unseen set** in `~/Downloads/_desk-2026-10-08/heldout2-scans/`, or any folder or archive there whose name begins `heldout2` (truth is in `heldout2-truth-r1/` and `heldout2-truth-r2/`; added by the desk 20:40). It is the final test.
- All eight gates. Gate 4 baseline 2000. If the port changes, bump to `0.2.0-ilya.6` as row 49 did.

## Report

`docs/sessions/report-code-the-printed-three_r1_2026-10-08.md`: the detector and why, the control table, each change with `path:line`, tests, gates, the before and after lines, the five unseen lines, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer.

No git command that writes; Dann ships. When the report is written, set QUEUE row 54 with the report's name, say so in one line, and stop.
