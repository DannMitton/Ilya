# Brief for Code: tuplets of any number, n in the space of m (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 21:55. For Code on the Mac, in the window that did rows 49 to 54 and 37, after row 37. QUEUE row 56. Model: Opus.

## What the singer needs, and why

A singer's score may print any tuplet: duplets and quadruplets in compound or triple metre, quintuplets, sextuplets, septuplets, and longer groups in florid arias. Today Ilya handles the 3 only: row 54's page detector reports a 3 and nothing else (`docs/sessions/report-code-the-printed-three_r1_2026-10-08.md`, "What it reads"), and the repair rules in `apps/web/src/lib/omr/triplets.ts` look for runs of three. Dann, 2026-10-08 21:49: *"Tuples are an easy concept: x notes in the space of y. Why can't we have responsible interpretation of any denominator?"* The desk had answered that no opened song prints another tuplet; he called that *"poor justification for ignoring the eventuality."* He is right: the design must be general, and the lack of real examples is a problem to solve, not a reason to stop.

## The design, from the singer's score outward

1. **Read the digit, whatever it is**: 2 to 9, and two-digit numbers, italic as engravers print them, with or without a bracket, and the ratio form (for example 7:6) where printed. Extend `tuplet-number.ts` from one shape to a digit reader. It keeps row 54's discipline: look only where a voice bar is in doubt, and a false number is worse than a missed one.
2. **Examples beyond the opened songs.** No opened song prints a tuplet other than 3, except where truth files show duplets; find them. Build test examples from the engraving fonts' own tuplet digits: check the SMuFL specification for its tuplet-number glyphs (the desk has not verified the codepoints; do not assert them unread), render them in more than one music font Ilya can use (Bravura, and any other SMuFL font with an open licence), at several sizes and with scan-like degradation (blur, skew, threshold noise, a staff line through the digit). Add real printed examples wherever you can find them in songs outside both unseen sets (Dann's own library in `~/Documents/Repertoire & Scores/Scores - vocal/` may hold florid arias; you may open those). Report how many real and how many rendered examples each digit has.
3. **The ratio by rule.** Once a digit n is read, the space m it fills follows the convention the project has verified from Gould: her Table 2, p. 203, gives the ratio from how many notes fill the beat (`claude/opus-memo-e16-gould-metre-tuplets-verified_2026-07-27.md` in project knowledge; Code cannot read `claude/`, so the desk quotes what it can: "Table 2 (p. 203) gives the ratio deterministically from the number of notes in a beat"). Where the table is not available to you, use the standard convention (n in the space of the next lower power of two in simple metre; duplets and quadruplets in the space of three in compound metre) and say so as a DESK DEFAULT to be checked against Gould.
4. **Check it against the bar.** A read digit is applied only if its ratio makes the bar fit the metre printed there (row 37's metre, once built). Where the digit and the bar disagree, change nothing; that bar is one the Corrections review will offer the singer to compare.
5. **Generalize the repair rules** in `triplets.ts` from runs of three to runs of n with ratio n:m, keeping its refusal to guess when more than one reading fits. Rename the file to `tuplets.ts` only if the rename costs nothing else; say what you chose.

**Cadenzas are out of scope here**: small-printed, unmetred notes are a separate problem.

## Prove it

- The digit reader on every example, by digit: found, missed, false. **Zero false numbers** on the negative marks from row 54 (293 plain groups, 138 non-numeral marks), plus lyric letters that resemble digits («з», «б», «ч», «э»).
- Before and after through the drop box: the 17 opened and build songs. No song may get worse.
- A, B, C, E, F once, one line each, never opened. **Never open anything in `~/Downloads/_desk-2026-10-08/` whose name begins `heldout2`**; it is the final test, and it holds duplets.
- All eight gates, against row 37's baseline.

## Report

`docs/sessions/report-code-tuplets-of-any-number_r1_2026-10-08.md`: the digit reader and its examples, the ratio rule and its source, the bar check, each change with `path:line`, tests, gates, before and after lines, the five unseen lines, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. No git command that writes; Dann ships. Set QUEUE row 56, say so in one line, and stop.
