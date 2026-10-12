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


## Amendments after Fable's review, 2026-10-11 19:30. THESE OVERRIDE THE TEXT ABOVE WHERE THEY DIFFER.

Reviewed by Fable against HEAD `8e74f39` (167k tokens). Anchor every `i18n.ts` edit by key, never by line number. The safe order across the i18n briefs is rows 72, 70, 73, 68, 75, 62.

- Both holds are met at `8e74f39`.
- **The formatter is `pitchName`** (`apps/web/src/lib/voice/note-picker.ts:150-153`, comment `:143-149`), called from `comment-text.ts:335,346,394`, `PitchSeconds.svelte:33`, `singer-blocks.ts:130`, `InsightsPane.svelte:272`, `compass-stave.ts:86`. The test at `singer-page.test.ts:253` asserts `la3` and must change.
- All eight gates; report gate 4's new count.
