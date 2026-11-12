# Report: rhyme matcher, step 2 (`rhyme-reading.ts`) (Code, cloud lane 49, r1, 2026-11-12)

## What was built

`apps/web/src/lib/rhyme-reading.ts` (new, beside `ne-join.ts`, about 140 lines, no caller yet) and `rhyme-reading.test.ts` (24 tests). The module is pure: `rhymeReading(lines, probe)` takes `RhymeLine[]` (each line's words and `endsStanza`) and an injected `RhymeProbe` (one word, under `'stage'` or `'literary'`, to its IPA), and returns a `Map` from `"lineIndex-wordIndex"` to the partner's `cleanWord`. It implements the brief's rules 1 to 5 with Amendment 8:

- **Compare the engine's output**, before notation preferences and Reconstitution: the tail is read from the probe's string as it is.
- **The tail** is the probe's IPA from the first vowel after `ˈ` to the end, with a leading stressed `ɨ` folded to `i` (`rhymeTail`).
- **Unstressed ending:** the last Cyrillic vowel of the word is not the stressed one (`stress < vowel count - 1`).
- **Stress usable:** `stress >= 0`, `stressSource` not `'inferred'`, and not an unresolved homograph (`user-` sources pass).
- **Groups:** equal tails, linked within three lines (`RHYME_LINK_LINES`), within a stanza; a trigger is matched if its group holds a partner, and names the nearest partner, earlier line on a tie.
- Only the line-final word is read; members are triggers and partners only.

## Tests

The case table of Fable's finding 13, on the real dictionary (`loadRealDictionary`) and the real engine, with «зыбкий» / «улыбкой» now literary (21:11). The word data are built as the pipeline builds them (the dictionary's stress, source, homograph flag and part of speech; stress from ё where the word has one). All 15 rows pass: the adjacent pair both ways, the six-line chain (the fourth line is matched directly and «далёкий», four lines from «глубокой», through the chain), «сладкий» / «краткой», «гибкий» / «зыбкой», the noun partner, a stressed partner, non-velar, one line, a blank line, four unrelated lines (three keep it), «далекий» without ё against «далёкий», a homograph partner and trigger, «тонкий» / «звонкий», «русский» / «узкой», and a trigger followed by «ли». Added: a refrain (each copy finds its own partner), the nearest-partner naming, the stanza break, a `name` partner, a probe with no stress mark.

Two rows are tested here only as far as the pure module goes, and finish in step 3 through `processText`: the ё toggle (step 2's helper stands in for the pipeline's ё handling), and the homograph rows (the flag is set by hand; the real `homographs.json` tier is not loaded here).

Gates touched: web-check 0 errors, 12 warnings (unchanged); ratchets OK. Full web-test is run after step 3.

## DESK DEFAULTs taken (reversible)

1. **A `name` part of speech is not a partner.** The brief's rule 1 says "an adjective or a noun"; the 21:11 ruling says "any unstressed line-final -кой/-гой/-хой". They differ on proper names («Волгой», pos `name` in the dictionary). I followed the brief's words. To allow names, delete the `PARTNER_POS` test (one line). The supplement's `adj.` (with a point) counts as `adj`.
2. **Which partner is named** when several are in the group: the nearest by line, the earlier on a tie.
3. **Members are triggers and partners only.** A third word with the same tail that is neither cannot link a chain.

## What I could not establish

- The case table is constructed text, not verse; the Glinka run is Fable's memory, as the brief says.
- How `homographs.json` and the loader's late tier mark «дорогой»-like words in the pipeline; step 3 reads it.
- Whether `endingUnstressed` agrees with the engine's own syllabification on hyphenated or foreign words (it counts Cyrillic vowel letters).
