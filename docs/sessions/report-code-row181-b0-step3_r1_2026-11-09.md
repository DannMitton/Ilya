# Report: row 181 B0 and B0g, step 3 (each piece placed by its own vowel's ink) (Code, cloud lane 40, r1, 2026-11-09)

## 1. What was built

- `underlay-units.ts`: `letterBoxes(token)` (the token's letter boxes, one for each of its letters, or null), `VowelBoxCounts`, `noVowelBoxes()`. The helpers live in `underlay-units.ts`, which owns `VOWEL`, so `underlay-tokens.ts` imports them without a cycle (a separate module would have had to import `VOWEL` from units, which would import it back).
- **`cutUnits`**: where `letterBoxes` matches, each piece takes the box of the first vowel letter in it; a piece with no vowel letter keeps its letter share and is counted (`fallbackNoVowel`); a token whose boxes are missing or do not match keeps its letter shares and is counted once (`fallbackNoMatch`). It now also returns `boxes`.
- **`splitTokens`**: where `letterBoxes` matches, a part of exactly one vowel letter takes that letter's box; a part of two vowels or more, or none, takes the span of its own letters' boxes; each part carries its own `syms` slice onward. Where they do not match, the share stands and the token is counted once. `SplitOptions.boxes` is the counter (absent: not counted); `pageTokens` takes it as a third argument.
- The vowel test is `VOWEL` from `underlay-units.ts` everywhere; no second regex was written. `underlay-units.test.ts` still holds it equal to `CYRILLIC_VOWEL`.
- `UnderlayStats.vowelBoxes: { placed, fallbackNoMatch, fallbackNoVowel }`, counted for the **seated row** only (the split's count from `pageTokens`, the cut's from `cutUnits`, summed), printed on the page's console line (`vowelBoxesLine`, `underlay-reader.ts`).
- Nothing after the box changes: `seatTokens(..., 'monotone')` takes the units as before. `assertVowelPerNote` runs as before.
- Comments in the 2026-11-01 form (what it checks, why, what follows when it fails, relation) at `splitTokens`, `cutUnits`, and `letterBoxes`, naming Dann 2026-11-05 00:32 and 00:35 and `CONTRACT.md` §0.2.

## 2. What «match» means (the patch's `symLettersMatch`, as I read the brief)

The boxes that hold a letter (a box of a mark is dropped), each holding exactly one letter, in the token's letter order, equal to the token's letters with case folded. A box holding two letters (a ligature), a dropped or an extra letter, or a different letter, is no match. A token with no `syms` is no match and is counted `fallbackNoMatch`: the brief names three counters and no «no boxes» one, so a reader that gives none shows as fallbacks, and the desk's «fallbacks 0» reads «every token had boxes and they matched».

## 3. Two readings of the brief I settled, and why

- **A part with no vowel in `splitTokens`.** Item 1 of step 3 says it takes the span of its own letters' boxes; the test list (item 7) says «a part with no vowel keeps its share». I followed item 1 for `splitTokens` (it is the rule's text) and item 2 for `cutUnits` (a piece with no vowel keeps its share and is counted). The test list's sentence is the `cutUnits` rule. If the desk meant the share in both, `splitTokens` takes a one-line change.
- **`syms` carried on the cut's pieces.** A piece made by `cutUnits` carries no `syms` (the whole token's boxes would be wrong for it); nothing reads `syms` after the cut.

## 4. Tests, with the mutants they kill (I ran each mutant and restored the file)

| Test | Mutant it kills |
|---|---|
| `cutUnits`: second piece at its vowel (70 to 90) and not at the share (50 to 100); counts 2 placed | the units take the share (5 tests fail) |
| a dropped middle letter falls back, one token counted | |
| the **last** letter dropped falls back (the count is checked, not only the letters) | removing the `have.length !== want.length` check (it survived until this test was added) |
| no boxes, a two-letter box, a different letter: each counted once | |
| a vowelless piece keeps its share (0 to 25), the other is placed; both counted | |
| ѣ found as the vowel of «хлѣ» | |
| a mark's box and a capital: «Бала,» with a capital Б box still matches | removing the case fold (survived until the capital was put in the box) |
| `splitTokens`: «су-е» gives the vowel boxes 12 to 30 and 60 to 80, own `syms` slices, 2 placed; two vowels or none give the span; a dropped letter gives the share, no `syms`, one counted; a whole token keeps its boxes | taking the vowel rule out (2 tests fail) |
| `seatPage`: «бала» with letter boxes seats «ла» on the note at 86; without them on the note at 70 (the share); `stats.vowelBoxes` is 2 placed with boxes, 1 fallback without | `cutUnits` falling back to the share |

`apps/web/src/lib/omr`: 41 files, 691 tests pass; `svelte-check` 0 errors, 12 warnings.

## 5. What Code could not establish

- On row 114 f1: which x each vowel box holds, and the per-syllable gain (+6, −2). Needs the scans and the harness. The desk's measure.
- Whether tesseract.js returns letter boxes in the model's real answer for every word (not run; the desk's 0 fallbacks says it did on its harness).
