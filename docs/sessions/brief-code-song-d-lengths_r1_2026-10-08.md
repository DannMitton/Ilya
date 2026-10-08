# Brief for Code: song D's lengths, diagnosed and fixed (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 15:40. For Code on the Mac, in the window that measured QUEUE row 52 (it holds the drop-box harness and knows which file is D). QUEUE row 53. Model: Opus.

## Why

Row 52 (`docs/sessions/report-code-eight-unseen-through-the-drop_r1_2026-10-08.md`) read eight unseen songs through the drop box on the deployed site. Seven pass at 95. **Song D scores 89.5**: 138 of 153 right, 15 length misreads, 1 extra, 33 bars read for 31 printed. THE ONE THING is not met until it passes.

**Dann opened D for diagnosis, 2026-10-08 15:37** (*"absolutely, yes"*), knowing the cost: D is no longer unseen. **A, B, C, E, and F stay unseen** under row 49's strict limits.

## The job

1. **Open D:** its scan, its truth file and notes, and its reading. Name it by title in the report from here on.
2. **Check the truth first.** The truth files are a helper's drafts by eye, never proofed. For every bar where the reading and the truth disagree, look at the page and say which is right. Where the truth file is outside what the page prints, correct the truth file, list each change, and re-score. The page is never wrong; a difference between Ilya's reading and the page is a misread, and it is Ilya's.
3. **Diagnose what is left, bar by bar,** looking at the page images: each length misread (the 2026-10-07 cloud read inferred missed triplets read too long; that is unchecked), the extra note, and the two extra bars. **State each cause with `path:line` before changing anything.**
4. **Fix it with a rule a musician would accept**, as row 49 did. A fix tuned to D alone is not acceptable. If no general fix exists, say so and change nothing. If the port changes, bump it to `0.2.0-ilya.6` everywhere `ilya.5` is named, as row 49 did, so readings stamped ilya.5 are read again. Tests for each rule.

## Prove it

- Before and after, through the drop box on the Mac's WebGPU as row 52 did (a local build is acceptable for the "after" if it serves the change; say which): D, Grechaninov, Varlamov, and the 14 build songs of row 49. No song may get worse.
- **Then A, B, C, E, F once, after the fix is final:** one line each, as row 52 printed them, never opened. Before: row 52's lines.
- All eight gates. Gate 4 baseline 1998. Name any number that moves.

## Report

`docs/sessions/report-code-song-d-lengths_r1_2026-10-08.md`: truth corrections, each cause with `path:line`, every change with `path:line`, tests, gates, before and after lines, the five unseen lines, md5 of any packed `.tgz`, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer.

No git command that writes; Dann ships. When the report is written, set QUEUE row 53 to BUILT (or MEASURED, if nothing changed) with the report's name, say so in one line, and stop.
