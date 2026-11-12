# Report: rhyme matcher, step 3 (wired into `processText`) (Code, cloud lane 49, r1, 2026-11-12)

## What changed

- `apps/web/src/lib/pipeline.ts`: after step 2 (`joinAfterNe` and boundaries, so after every override and before the engine), `rhymeReading` runs once over all the lines, with a probe that is one `GraysonEngine.transcribe` call under the given `adjectival` (`{ ...engineConfig, adjectival }`, `.ipa`, so before notation and Reconstitution). `transcribeWords` takes the map; a matched line-final word goes to the engine under `'literary'`, every other word under the configured value, and `stampRhymePartner` writes the partner's `cleanWord` onto the ⟨и⟩ log entry's `features.word` (Amendment 8: as typed, no punctuation). The other two callers of `processText` (`syntactic-break.support.ts`, the scout's frequency run) get the reading and needed no edit; neither did `+page.svelte`, `witness-lines.ts`, or any other file.
- `apps/web/src/lib/rhyme-reading.ts`: `stampRhymePartner` added.
- **Paying for the lines.** `pipeline.ts` was 901 of 901. The character-level ё swap (about 20 lines, no dependencies) moved unchanged to a new `apps/web/src/lib/yo-swap.ts` (`swapYoAt`). `pipeline.ts` is now 892; the ceiling stays 901 (ratchets prints "901 -> 892" as a shrink notice, and I did not lower it; the desk may). No ratchet changed otherwise.

## Done states, as tested

- Typing «глубокой / высокий» on two lines shows [ɡɫu ˈbo kʌj] / [vɨ ˈso kʌj] in Text (`rhyme-reading.pipeline.test.ts`). The ⟨и⟩ entry's exception is `velar-adjectival-rhyme` and `features.word` is «Глубокой» for ««Глубокой,»».
- The pair on one line, with a blank line between, a trigger with no partner, and a user stress override that makes the partner stressed: [kɨj], exception `velar-adjectival`.
- Only the line-final word changes («высокий, высокий / глубокой»: the first copy stays [kɨj]).
- Reconstitution keeps the pair rhyming: both end [kɑj].
- «далекий» without ё stays [kɨj]; the ё toggle (key `1-0-3`) gives [kʌj] (the case table's last unchecked row from step 2, now run through the real pipeline).
- «русский» beside «узкой» keeps [kʲij].
- **MELODY** (`rhyme-reading.melody.test.ts`, a one-part score built in code with syllabic marks): with Lyrics' transcription passed as `transcribedLines`, the last note of «высокий» is [kʌj], equal to the syllable Text prints; the vowel INSIGHTS tallies for it (`vowelOfSyllable`) is [ʌ] where the stage reading counted [ɨ]; with no transcription, or with the pair typed on one line, MELODY prints [kɨj]. So Text and MELODY agree on one seated fixture through the donor, with no new carriage. I seated a score built in code, not a library fixture, because no shipped fixture sings «высокий».

## The library pin (`rhyme-reading.library.test.ts`) and what it found

It reads the poem file the manifest names, runs `processText` on each entry's `textModern` (327 entries, 7,345 lines, no entry empty) and pins the list of matched line ends. **The list is empty.** What the library holds, read by hand:

- Five line-final velar -ий words in all: «тонкий» and «звонкий» (Fet, «Средь шумного бала», `21568f1c1e`, lines 8 and 10, rhyming with each other, so both stay stage), «широкий» (`412703d604`, «Ах! Плачу я, горько плачу я…», line 18, no partner), «тонкий» (`53ce5942eb`, «То было раннею весной…», line 7, no partner), and «одинокий» (`2b82617c1a`, «Ночь печальна, как мечты мои…», line 2).
- **One near miss, and it is a real candidate.** In `2b82617c1a`, line 1 ends «широкой» (stress 1, dictionary) and line 2 ends «одинокий». The dictionary has no stress for «одинокий», so it reads `inferred` and the matcher declines it under rule 4: the transcription stays [o dʲi no kɨj], all vowels cardinal. If the singer marks the stress (or the dictionary gains it), the pair would read [ʃɨ ˈro kʌj] / [ʌ dʲi ˈno kʌj] and the pin will need an update. The desk should know that this is a poem where the rhyme is probably the poet's and Ilya does not apply it. A second test pins the decline.
- Amendment 9 asks for each match's two lines, title, and both transcriptions. There are none to report. The desk's reading is of the near miss above.

## Gates

phonology 462, blurb 168, integration 155, web-test 5230 passed and 1 skipped (was 5190; +40 are this step's 40 tests across four files), web-check 0 errors and 12 warnings (unchanged), ratchets OK. score-parser and dictionary not re-run (untouched).

## DESK DEFAULTs and limits

- The partner for a chained trigger is the nearest in its group (step 2's default).
- Per Amendment 10 (left as is): where Poem has verse lines and Lyrics does not, Poem shows [kʌj] and Lyrics, MELODY, and INSIGHTS [kɨj]. No carriage built.
- `+page.svelte` line 444's derived poem goes through the same `processText`; confirmed by reading, not by a separate test.

## What I could not establish

- A real run of the full app (the Playwright suite is step 6's). The Text pane's display of [kʌj] is shown through `processText` output, not a rendered page.
- Whether the singer's `phraseEnds` or syntactic-break options change which word is line-final in a way the matcher misses; the pipeline tests ran without them.
- INSIGHTS beyond `vowelOfSyllable`: the tally itself was not run.
- Which real song fixture could seat the pair.
