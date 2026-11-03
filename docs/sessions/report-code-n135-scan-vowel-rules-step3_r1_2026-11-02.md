# Report: N.135 scan vowel rules, step 3, tests (cloud lane, branch cloud-lane-28, 2026-11-02)

Read on `cloud-lane-28`, parent `d8f8456` (step 2), from `f9797ac`. The tree was clean before this step.

## What changed

Tests only, plus one comment in `underlay-counts.ts` that now names the test that holds `freeNoteXs` equal to the notes the far rule measures.

| Brief's case | Where |
| --- | --- |
| a vowelless unit between two syllables | `underlay-page.test.ts` (through `seatPage`: «мир» «т» «ты» on three notes, «т» dropped, «ты» keeps note 2); `assert-vowel-per-note.test.ts` (unit) |
| a lone «І» at a row's start | `underlay-page.test.ts` (dropped as `stray`, `dropped: { vowelless: 0, stray: 1 }`); `assert-vowel-per-note.test.ts` |
| «поѣду» cut into three pieces keeps all three | `underlay-page.test.ts` (`cut` stub returns «по», «ѣ», «ду»; notes 0, 1, 2; nothing dropped); `assert-vowel-per-note.test.ts` (`wholeTokenOf`) |
| a token over the piano intro while the voice rests | `underlay-seat.test.ts` and `underlay-page.test.ts` («Дудка» at x 50, voice notes from x 300) |
| a long note followed by a wide gap, the token under the long note still seats | `underlay-seat.test.ts` (free notes 100, 200, 300, 600; text printed 30 and 150 past the long note's head both seat) |
| a syllable under a tie's second note, within 2x the median seats; beyond it is unseated, by `monotone` | `underlay-seat.test.ts` (free notes 100, 300, 500, tied-into 700: a token at 700 seats on 500; a token at 1000 is `unseated: true`, `by: 'monotone'`) |

Also added: `FAR_FACTOR` is 2 and `medianGap` values; the rule is exact at the reach and does not apply with one free note; `nearest` and `order` are untouched; `seatTokens` measures free notes only (a token 150 from the last free note seats when tied-into notes are ignored and would not when they are counted), and `freeNoteXs` lists those same notes.

Pins that change in this step: none. The four clitic pins and the `underlay-page.test.ts:191` pin changed in step 1 (see its report), because step 1's commit had to stay green.

**Mutant check, done:** setting `FAR_FACTOR` to 1e9 fails four tests (the two «Дудка» cases, the `FAR_FACTOR` value, and the beyond-2x tie case); restored afterwards. I did not run a mutant for the free-notes-only test; I checked its arithmetic by hand (all-note median gap 50, reach 100, distance 150: unseated; free-note reach 200: seated).

**One thing the test shows that the brief did not say:** `stats.units` is counted after the drop, so it counts what is seated, not what the cut made. A test pins that, with a comment.

## Gates, on the tree of this commit

| Gate | Result |
| --- | --- |
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 type check | 0 errors, 12 warnings |
| 4 web | 3867 passed, 1 skipped (3868), 220 files (step 2: 3844, so +23 tests) |
| 5 score-parser | 785 passed, 5 skipped (790) |
| 6 blurb | 148 passed |
| 7 root integration | 98 passed |
| 8 ratchets | OK |
| build | exit 0 |

## What I could not establish

- That the tests describe what the scan reads on real pages. They use hand-made boxes and notes; the desk's row 114 measure is the check on real input.
