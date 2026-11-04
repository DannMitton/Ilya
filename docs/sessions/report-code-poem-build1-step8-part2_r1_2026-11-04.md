# Report: poem library build 1, step 8, part 2, a whole poem unless she sings a passage of a long one (Code cloud lane, r1, 2026-11-04)

Brief: step 8 r2, Part 2. Branch `cloud-lane-31`, after part 1.

## What changed

- `poem-match.ts`: `PoemMatch.coverage` = `(alignment.queryEnd - alignment.queryStart + 1) / letters.length`, from the alignment `evaluate` already held. **CONTRACT §4 check:** `grep queryStart|coverage` under `apps/web/src` outside tests finds the alignment's own fields (`poem-match.ts:93`, `:171-172`) and this one use; the coverage is computed nowhere else.
- `poem-source.ts`: `cutFor(match)` beside `stanzaCut`, with `PASSAGE_COVERAGE = 0.8` and `LONG_POEM_RATIO = 10` (DESK DEFAULT numbers). It cuts to a passage when (coverage at least 0.8 **and** poem letters over Lyrics letters greater than `MAX_LENGTH_RATIO`) **or** that ratio is greater than 10; otherwise the whole body (`stanzaCut(text, 0, text.length)`). `stanzaCut` itself is unchanged.
- `poem-offer.svelte.ts`: `offer()` calls `cutFor(match)` where it called `stanzaCut(match.entry.textModern, match.start, match.end)`.
- **`MAX_LENGTH_RATIO`**: read at `poem-match.ts:292` the other way round (Lyrics at most 3 times the poem: the no-fill rule for a cycle), pinned in `poem-match.test.ts`, re-derived in the same file's tests; none of those changed. `cutFor` reads the same constant and shares only the number, as the brief says. `poem-source.ts` now imports it from `poem-match.ts` (no cycle: `poem-match.ts` imports only `poem-library.ts`).

## Fable's table, measured here (`poem-source.test.ts`, each row a test)

Every coverage and ratio below equals Fable's table (coverage to two decimals, ratio to one), and every answer is as the table has it:

| fixture | coverage | ratio | under the rule |
|---|---|---|---|
| P | 33.1% | 3.40 | whole |
| S | 94.2% | 58.4 | cut (to the fish's song, under a twentieth of «Мцыри») |
| T | 91.5% | 1.23 | whole |
| U1 | 100% | 1.00 | whole |
| U6 | 100% | 1.10 | whole |
| r114-song2 | 61.4% | 0.69 | whole |
| r114-song3 | 55.8% | 1.30 | whole |
| r114-song4 | 73.0% | 1.09 | whole |
| r114-song5 | 93.5% | 2.14 | whole |

U4, U5 and r114-song1 fill nothing, as before (their tests in `poem-match.test.ts` are unchanged and pass).

## Tests

- The nine rows above; **P, r114-song4 and r114-song5 fill every body stanza** (5, 5 and 4; the brief's "3 to 5 of 5" for song 4 reads as 5 body stanzas, with «Русская песня»'s sixth block being its dating line), and the test also asserts that the old `stanzaCut` rule had cut each of them short.
- A synthetic poor scan of S (every third word replaced by noise) still matches «Мцыри», has a ratio above 10, and still cuts to the fish's song.
- The two clauses on synthetic matches: ratio 5 at coverage 0.9 cuts; ratio 5 at coverage 0.5 fills whole; ratio 2 fills whole at any coverage; ratio 11 cuts at any coverage.
- `poem-offer.test.ts`: fixture P fills all five stanzas of «Средь шумного бала, случайно» and is not called a passage. The walk item 8 test (S) and the existing `poem-source.test.ts` tests that call `stanzaCut` pass unchanged.
- **Control:** making `cutFor` use the old rule fails the P, song 4, song 5, and clause tests.

## Gates

web unit 4159 + 1 skipped (was 4146), svelte-check 0 errors, 12 warnings, ratchets OK. Full browser suite after part 5.

## NOT ESTABLISHED

- How the rule behaves on a real scan of the fish's song: only the fixture and a synthetic noisy copy were run.
- Whether 0.8 and 10 are the right numbers beyond these nine fixtures (DESK DEFAULTS).
