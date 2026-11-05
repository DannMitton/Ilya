# Brief: B0 (each syllable under its own vowel's ink) and the offer counts, on the three-arm harness (Sonnet helper, continued, r1, 2026-11-05)

Measure only. Keep nothing in any repository. NOT ESTABLISHED beats a complete invented answer. Use the harness, builds, and scorer you already have under `/root/c181/`.

## Read first, in full

`/tmp/claude-0/-home-claude/31f40b71-4f77-5a1c-9e65-335bc8ca0931/scratchpad/review-fable-design-poem-reads-the-letters_r1_2026-11-05.md` (findings 1, 5, 7) and `report-desk-reader-outputs-inventory_r1_2026-11-05.md` (W18, W19; N11 to N13) in the same folder.

## Part 0, first: does the ink under each note say "new vowel" or "melisma"?

Dann 2026-11-05 00:35 to 00:36: the note takes a vowel; every sung note has a vowel value; a note with no vowel printed under it is part of a melisma. Test the premise before anything else. For every sung note of row 114 f1 that homr read (not grace, not chord tone, not voice 2), decide from the page image alone, with no letter reading: is there ink in that system's lyric band within the note's horizontal span (bounds: half-way to the neighbouring notes' `imgpos` x)? Use the band geometry the tip already keeps (`underlay@4`, `KeptSystem`) and the page images from the run. Compare against the truth, per note: a new syllable starts here (truth `syllableText` present) or not (melisma, tie, or no text). Report the two-by-two table per song and in total (ink and new vowel; ink and none; no ink and new vowel; no ink and none), the systems with no band, and ten examples of each wrong cell with page, system, bar. Try two ink thresholds and say which; do not tune past two.

## Arm B0, on the tip `05db2dac` (the 376 tree), worktree only

1. The reader returns symbols: ask tesseract.js for `{ blocks: true }` as today and read each word's `symbols` (text and bbox) in `wordsOf` (`apps/web/src/lib/omr/underlay-recognize.ts:55-57`), carried with the word box through `pageTokens` (`underlay-page.ts:207-214`) and `splitTokens` (`underlay-tokens.ts`). Where a token is split into syllables (`underlay-tokens.ts:63-69` by letter share; `underlay-units.ts:79-85` for the engine's cut), place each piece by the box of its own VOWEL letter (the vowel letters as `CYRILLIC_VOWEL` in `score/vowel-resolver.ts`, «й» excluded) instead of by its share of the letters. Dann 2026-11-05 00:32 and 00:35: the vowel is the syllable's nucleus, consonants optional content beside it; and the note takes a vowel: every sung note has a vowel value, and a note with no vowel printed under it is part of a melisma. So the evidence for which note takes a printed vowel is that vowel's own ink, not the piece's. Where the vowel has no symbol box (symbols do not add up to the token's letters), keep today's placement and count it.
2. In the same arm: leave grace notes (`<grace>`), chord tones (`<chord/>`), and voice 2 (`<voice>` above 1 in staff 1) out of the notes that take syllables (`underlay-prepare.ts:123-138` collects every `<note>`). Dann ruled 2026-11-05 00:19 that a grace note takes no syllable by default. Count the exclusions per song.
3. Also run **B0g**: step 2 alone, without step 1, so the two effects are separate.

## The offer counts (tip, join on)

From each song's console, count every offer by its `why` kind (the console prints the set, not counts: `poem-join.svelte.ts:134`); if the console cannot give counts, add one temporary console line in the worktree that prints each offer's kind, and say so. Also count `tokenMapReport` failures per song.

## Score

Control 376 must reproduce on the tip first (48, 139, 33, 82, 74; (c) 99), else stop and report. Then B0, B0g: (b), (a), (c) per song and total, the per-syllable ledger, and new two-vowel or empty sung notes (must be 0; report any).

## Rules

Scratch under `/root/c181/b0/`. Stop at 120,000 tokens for this part and write what you have.

## Output

`/root/c181/b0/report-desk-row181-b0_r1_2026-11-05.md`, answer first. If the Write tool refuses, return the report as your final message. Reply with three lines: B0's (b) and (c) against 376 and 99, B0g's, the offer counts by kind.
