# Report: poem library build 1, step 7, part 6 (Code cloud lane, r1, 2026-11-04)

From the desk, both DESK DEFAULTS Dann may revise, answering the part 4 notes. Branch `cloud-lane-31`, after part 5.

## (a) D1 reaches the card

`PoemLibraryCard.svelte`: in English the card's title line and first-line line are quoted in “ ” (`“Весёлый час”`, `“Дайте бокалы!”`), as the sentences under POEM are; in French they keep « ». The passage line already followed D1 (its string). Browser tests read the English card with “ ” and the French card with « ».

## (b) A capital stays after a sentence end

`passageLine` (`text/poem-source.ts`) lowers a joined line's first letter only when the line before does not end in `.`, `!`, `?` or `…` (a closing quote or space after the mark does not hide it). So «Весело на пашне.» + «Ну, тащися, сивка» reads «Весело на пашне. Ну, тащися, сивка». The oracle is unchanged: «Дитя моё,» + «Останься здесь со мной:» is still «Дитя моё, останься здесь со мной». Tests: a capital kept after `.`, `!`, `?`, `…`; lowered after a comma or nothing; the oracle; and the closing-punctuation test updated for the `?` case. The pinned list of capitalised joins in the library is unchanged by this (it reads the data, not the rule).

The library data is untouched (the «Мцыри» underscores and the «ИЗ ГЕЙНЕ.» heading are the desk's).

## Gates and the browser baseline

| Gate | Part 5 | Now |
|---|---|---|
| web unit | 4145 + 1 skipped | **4146** + 1 skipped |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| ratchets | OK | OK |
| other packages | unchanged | not rerun (no change in them) |

**Browser suite: 128 tests, 120 passed, 8 failed; the 8 are exactly the baseline's 8 by name** (a `comm` of the failing titles against step 0's list printed nothing new and nothing gone). The two Tchaikovsky tests, the poem-library tests (18) and the header tests (14) are green.
