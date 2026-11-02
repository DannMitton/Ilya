# Report: consistency batch 2, step 1, the French colon (Code, cloud lane, r1, 2026-11-02)

Read at: branch `cloud-lane-27`, parent `fe5c9de2` (step 0), cut `9fa20430`. Working tree clean before the step.

## The source

`docs/sessions/ratified-palatalization-comments-fr_2026-11-02.md` on the cut already carries U+00A0 (19 occurrences, `grep -c`) and the closing paragraph "Amended 2026-11-02 09:0x". It is the source, as review amendment 2 allows. Nothing was added to it, and it was not edited.

## What changed, file by file

- `data/blurb-composer.json`: sixteen French strings, `processes.<id>.fr.template`, each had an ordinary space before a colon. Each now has U+00A0 (a literal character, as the twenty existing French strings in the file already do). The sixteen are `regressive-dental`, `regressive-dental-dp-differs`, `regressive-homorganic`, `regressive-n`, `geminate`, `r-front-stressed`, `hard-sign-vzs`, `blocked-class`, `blocked-n`, `blocked-r`, `blocked-l`, `boundary-hard-sign`, `boundary-prefix`, `no-soft-follower`, `lexical-exception`, `look-alike-root`. Only the space before the colon changed; the diff is sixteen one-line changes. No word changed. The two other templates among the eighteen (`agent-vowel`, `agent-soft-sign`) carry no colon.
- `tests/palatalization-comments.test.ts`: the French map (`const FR`, sixteen colons) and the rendered expectation for «подвиг» (« racine «двиг-» : la palatalisation ») take the escape ` `, never the literal character (`text/break-glue.ts:8`). The header (formerly "preceded by an ordinary space ... so the file is matched") now says the colon takes a no-break space by Dann's ruling of 2026-11-02 09:02 (OQLF) and that the ratified file carries the same character.

## Done when

- No French string in `data/blurb-composer.json` has an ordinary space before a colon: a parse of every string under any `fr` key matches `[^ ] :` zero times (it matched sixteen at the cut). Thirty-six French strings now have U+00A0 before a colon (twenty before, plus sixteen).
- The French map and the rendered expectation match the ratified file character for character: I parsed the ratified file's eighteen paragraphs (item 4 composed as item 3 plus its stated second sentence), the `FR` map with ` ` decoded, and the JSON templates in the map's order. Result: test == ratified, JSON == ratified. This was a one-off check; no test reads the ratified file (not added, since the brief does not ask for one).
- Gate 6 (blurb) and gate 7 (integration, which runs `tests/palatalization-comments.test.ts`, 43 tests) pass.

## The eight gates

| # | gate | line |
|---|---|---|
| 1 | phonology | `Tests  407 passed (407)` |
| 2 | dictionary | `Tests  248 passed (248)` |
| 3 | web-check | `svelte-check found 0 errors and 12 warnings in 5 files` |
| 4 | web-test | `Tests  3803 passed \| 1 skipped (3804)` |
| 5 | score-parser | `Tests  785 passed \| 5 skipped (790)` |
| 6 | blurb | `Tests  148 passed (148)` |
| 7 | integration | `Tests  98 passed (98)` (after `svelte-kit sync`) |
| 8 | ratchets | `ratchets: OK.` |

## Kept as it was, and why

`docs/sessions/draft-palatalization-comments-fr_r1_2026-11-02.md` still has "palatalisé :" with an ordinary space. It is a dated draft, superseded by the ratified file; not touched.

## Not established

- Whether any other surface shows these templates with a different colon rule (the app composes them from the JSON, so the browser should show the no-break space; I did not look at a rendered page).
