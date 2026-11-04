# Report: poem library build 1, step 7, part 3, the dating line (Code cloud lane, r1, 2026-11-04)

Brief: `brief-code-poem-library-build1-step7_r4_2026-11-03.md`, Part 3, and `review-fable-poem-build1-step7_r1_` amendment 11. Branch `cloud-lane-31`, on top of part 2.

## What changed

`stanzaCut` (`apps/web/src/lib/text/poem-source.ts`) returned the whole `textModern` when the match covered every body stanza (the old `whole`), and that is where «1830» came from. `whole` now ends where the last body stanza ends: `text` is `textModern.slice(0, bodyEnd)` and `end` is `bodyEnd`, with `bodyEnd` the end of the last block that is not a dating line (`bodyStanzas`, which already dropped a trailing dating block for the whole-or-passage test). The comment that said "dating line and all" is gone, and the function's comment says the opposite.

- **A song that sets the whole poem fills the body verbatim without the dating line, and is still not called a passage.** `resolveSource` already tested `source.end` against the body's end, so `passage` stays false. The stored cut ends at the body's end (a test checks `poemSource.end` equals the length of what POEM holds).
- **`library.json` keeps the dating line**, and so does `data/dictionary.poems.a97f2074.json` (a test reads the library entry and checks it still ends in «1830»). Nothing in the data build changed.
- All three datelines in the library stand in a block of their own («1830» in «Весёлый час», `0127a63f`; «Февраль 1837» in «Молитва», `f1a88510`, the modern entry; «8 декабря 1840Москва» in «Русская песня», `87376c17`), so the test for what a dating line is reaches all of them. A dateline glued to its stanza would pass through; none exists in the file today (Fable's note, r1 amendment 11).
- A cut of a passage never reached the dating line, as before.

## Tests that changed, and why

- `poem-source.test.ts`: the test that asserted the dating line stays in the fill now asserts it is left out (the body verbatim, `end` at the body's end); the three forms of dating line each cut to the body; the row 114 song 2 test checks the cut is the poem without «1830», ends on «Видит заря!», and that the library entry itself still ends in «1830»; **a new test runs every entry of the shipped library**: no fill ends in a dating line, «Русская песня» ends on «Сам с собою грущу…», the modern «Молитва» on «Лучшего ангела душу прекрасную.», and an entry without a dating line fills exactly its text.
- `poem-offer.test.ts`: the fill of «Весёлый час» is the body, with no «1830», and the stored cut ends at the body's end.
- `e2e/poem-library.test.ts` (the browser): POEM ends at «Видит заря!», does not contain «1830», and the card does not say "a passage beginning".

## Gates after part 3

| Gate | Part 2 | Now |
|---|---|---|
| web unit | 4134 + 1 skipped | **4135** + 1 skipped |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings (993 files) |
| ratchets | OK | OK |
| e2e | | the two edited tests of `poem-library.test.ts` green; the whole suite is Part 5's |
