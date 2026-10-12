# Brief for Code: the French Guide states its conventions (QUEUE row 67, r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 04:57. For Code, Sonnet, cloud lane or the Mac. **Not before row 57 run 2 has reported** (DESK DEFAULT: run 2 hashes `git diff` under `apps/`, so no other edit lands in `apps/` while it runs).

## What the singer sees

A French reader of the Guide finds, in « Licences et remerciements », every convention Ilya's French follows, each with its authority.

## The work

1. In `apps/web/src/lib/components/Reading/GuideContent.svelte`, French branch only, replace the paragraph that opens `<strong>Langue.</strong>` with the text under "The draft" in `docs/sessions/draft-french-guide-conventions_r1_2026-10-11.md`, verbatim. **RATIFIED by Dann 2026-10-11 04:55** (*"Ratified"*).
2. Markup: one `<p>` for the lead sentence, then a `<ul>` whose items open with `<strong>`. Italics as in the draft (`<em>Ilya</em>`, the Italian terms, the two titles). Link the OQLF and Roberge as the current paragraph does; link Roberge's octave page (`https://roberge.mus.ulaval.ca/gdrm/04-notes.htm`) on his name in the « Hauteurs » item, and DeCS (`https://decs.bvsalud.org/fr/ths/resource/?id=15228`) the same way.
3. Spacing: the OQLF drift test must pass (no space before « ; », « ? », « ! »; no-break space before « : » and inside « »).
4. The English "Language." paragraph is unchanged.
5. Run all eight gates; say if a count moves.

## Report

`docs/sessions/report-code-french-guide-conventions_r1_2026-10-11.md`: the diff's `path:line`, the gates, a screenshot of the French section if you can take one, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. `WRITTEN`; `DONE` is Dann's look.


## Amendments after Fable's review, 2026-10-11 19:30. THESE OVERRIDE THE TEXT ABOVE WHERE THEY DIFFER.

Reviewed by Fable against HEAD `8e74f39` (167k tokens). Anchor every `i18n.ts` edit by key, never by line number. The safe order across the i18n briefs is rows 72, 70, 73, 68, 75, 62.

- **French spacing in Svelte files:** the OQLF drift test reads only `i18n.ts` (`i18n.test.ts:100-135`), so it cannot check a `.svelte` file. Apply the OQLF table by hand to every French string you write in a Svelte file (U+00A0 or `&#160;` before « : » and inside « »; no space before « ; », « ? », « ! »), and extend the test's `faults` check to the French branch of each Svelte file you change, or report the Guide's spacing as NOT ESTABLISHED.
- Stop rule: `french-italics.test.ts` stays green (it requires *passaggio*, *legato*, *crescendo* in `<em>` in the Guide).
- The pitch line is letters with the American index (A4 = 440 Hz), as the draft says; ignore any solfège wording elsewhere.
- All eight gates; report gate 4's new count.
