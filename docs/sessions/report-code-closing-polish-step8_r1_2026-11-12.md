# Report: closing polish lane, step 8, the Roberge guard test (Code, cloud-lane-48, r1, 2026-11-12)

## What changed

New `apps/web/src/lib/roberge-guard.test.ts` (27 tests). It fails if a French interface string (every key of `i18n.ts` read in French through `stringKeys()` and `t(key, 'fr')`), the French GUIDE (`GuideContent.svelte`, rendered with `svelte/server`, tags removed), or the French LEARN (`LearnContent.svelte`, the same) names a pitch in solfège with an octave number. Code comments are exempt, because the test reads rendered strings, not source.

## The pattern (Amendment 14)

A syllable (`do`, `re`/`ré`/`rè`, `mi`, `fa`, `sol`, `la`, `si`, `ti`, any case) matched as a whole word (no letter or digit before it), then at most one space or no-break space, then an octave digit 0 to 8 not followed by a letter, a digit, or an ordinal mark (`e`, `er` by the letter rule; `º`, `°`, `ᵉ` by name). Positive controls: do3, ré4, re4, Ré 4, la3, la 3, sol with a no-break space 2, si3, ti 5, Fa4, mi 6, DO 4 each match once. Negative controls: «la 2e fois», «le 1er», «la 3º», «le mi bémol», «la mesure 12», «si 33 fois», «dans la 1ère mesure», «à la page 4b», «Sol3x», «domaine 4», «mille» match nothing. The three real-text tests also check that what they read is large (over 1,000 keys; over 5,000 characters of GUIDE and of LEARN), so an empty render cannot pass.

## Result on the current text

No real sentence trips the test: no French interface string, no French GUIDE text, and no French LEARN text matches. Nothing was reworded. (Findings to list by file and line: none.) One limit, stated plainly: «si 3 mesures» (the brief's second example) would match this pattern, since a digit followed by a space is allowed to end the match; no ratified French text contains it today. A future sentence of that shape would need the pattern narrowed, or the sentence reworded, by the desk.

## What I could not establish

- The English and the other documents (MELODY, INSIGHTS) are not scanned: the step names the French interface strings, GUIDE, and LEARN only. Strings built in code from parts (a note name filled into a French sentence at run time) are not seen, as the test reads the table and the two pages, not the page's live text.
