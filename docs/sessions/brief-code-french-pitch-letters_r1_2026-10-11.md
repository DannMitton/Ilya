# Brief for Code: French pitch names become letters with the American index (QUEUE row 68, r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 05:00. For Code, Sonnet. **After row 66 has shipped and after row 57 run 2 has reported** (DESK DEFAULT: row 66 builds Insights with the 04:12 rule; run 2 hashes `apps/`).

## The ruling

Dann 2026-10-11 04:58 (`CONTRACT.md` §6): in Ilya's French, a pitch is written as in English, letter plus American octave index: A4 = 440 Hz, C4 = middle C, D♯4. This supersedes 04:12 (solfège with the French index, la3). Source: Roberge, *GDRM*, https://roberge.mus.ulaval.ca/gdrm/04-notes.htm: digit flush to the name; no space between the name and the accidental. A quotation keeps its source's notation.

## The work

1. Find every place Ilya's French writes a pitch: `apps/web/src/lib/i18n.ts`, Insights, the Guide, Learn, printouts, and any formatter that turns a pitch into French text. List each with its `path:line` before changing anything.
2. Change each to the ruled form. Where a formatter converts to solfège or to the French index, make the French path use the English form.
3. Where row 66 seated a « la3 = 440 Hz » key, it becomes « A4 = 440 Hz » or goes, whichever the surrounding sentence needs; report which.
4. Tests for the formatter in both languages. All eight gates; say if a count moves.

## Report

`docs/sessions/report-code-french-pitch-letters_r1_2026-10-11.md`: the list from step 1, the diff by `path:line`, gates, **Could not establish**. NOT ESTABLISHED beats a complete invented answer.
