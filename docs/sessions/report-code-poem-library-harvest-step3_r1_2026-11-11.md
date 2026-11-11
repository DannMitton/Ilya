Model: Sonnet 5.5 (claude-sonnet-5-5)

# Report: poem library harvest, step 3 (the tests the library's growth moves), 2026-11-11

Branch `cloud-lane-45`. `docs/memory/OPEN.md` left alone and unstaged. All figures are from the shipped matcher (`apps/web/src/lib/text/poem-match.ts`, unchanged) run in vitest on this Mac, over the library before (`a12ee171`, 103 entries) and after (327 entries), unless a line says it is the reference.

## What changed

- `tools/poems/fixtures/expected_r3.txt`: written by `tools/poems/reference_sw_match.py` over the new `library.json` (all 266 works, no shortlist), never by hand; `expected_r2.txt` kept as the record. `poem-match.test.ts` and `poem-arias.test.ts` read `expected_r3.txt`.
- Count pins moved: `poem-library.test.ts` (327 entries), `poem-arias.test.ts` (327 entries, 238 poems, 266 works, 89 arias of 29 operas), `poem-match.test.ts` (266 works), `poem-source.test.ts` (846 stanza starts, and the capitals list), `tests/build-poem-library.test.ts` (step 1).
- "The 14 poems" rebuilt by id, not re-pinned: `poem-match.test.ts` (the shortlist-is-everything test, now 14 ids that must be 13 works) and `e2e-phone/poem-arias-time.test.ts` (the "before" library, plus the entry count read from the library in the printed line).
- `poem-source.test.ts`, the dating-line test: its expected-ending table was keyed by title, and the harvest brought a second «Русская песня» (`2f6be9d47e`, Кольцов, no dating line; there are three entries of that title, and «Молитва» has three and «Прости» two). The test failed on the title collision, not on a data fault. It is keyed by id now (`0127a63ffe`, `87376c1710`). This failure was not predicted by the brief.
- `poem-match.test.ts`, the reference rows: the old rule allowed the matcher's second work to differ from the reference's on a row the reference refuses. With 266 works the shortlist (20) does not see the reference's second on more rows, so the rule is now stated for seven named rows (`SHORTLIST_DIFFERS`: S, U1, U4, U5, r114-song1, r114-song2, r114-song5): the matcher never scores above the reference; a row the reference fills must still fill the reference's top work at the reference's score; a row the reference refuses must still be refused. Every other row must agree with the reference on top, second, and margin to three decimals. **No threshold, bound, or constant moved.**

## Fixtures: before and after

"Before" and "after" are the shipped matcher. "Reference after" is `expected_r3.txt` (all works). Works are named by `work` id; an opera's work is the opera.

| fixture | letters | before: top, second, margin | fills before | after: top, second, margin | fills after | reference after: top, second, margin |
|---|---|---|---|---|---|---|
| P | 121 | 21568f1c 0.293, f1a88510 0.074, m 0.219 | yes | same | yes | same |
| S | 260 | c1964bc3 0.862, 4f94e1a3 (Пиковая дама) 0.042, m 0.819 | yes | same | yes | c1964bc3 0.862, d729a821 (Лермонтов, «Отчего») 0.050, m 0.812 |
| T | 433 | 36f13ef5 0.681, 04cc9462 (Русалка) 0.030, m 0.651 | yes | same | yes | same |
| U1 | 221 | 2ba9040d 0.921, a7b12193 (Борис Годунов) 0.045, m 0.876 | yes | same | yes | 2ba9040d 0.921, 0acef4a6 (А. К. Толстой, «Не пенится море…») 0.057, m 0.864 |
| U4 | 250 | b655d8eb (Евгений Онегин) 0.050, bb52aaf5 (Снегурочка) 0.040, m 0.010 | no (low-score) | b655d8eb 0.050, 7ecff6c7 (Полонский, «Диссонанс») 0.038, m 0.012 | no (low-score) | 2f3ccc3d (Пушкин, «Я пережил свои желанья…») 0.068, b655d8eb 0.050, m 0.018 |
| U5 | 567 | 7e59d67a (Иоланта) 0.019, a78be89a (Руслан и Людмила) 0.018, m 0.001 | no (low-score) | a78be89a (Руслан и Людмила) 0.018, 4f94e1a3 (Пиковая дама) 0.018, m 0.000 | no (low-score) | 2b82617c (Бунин, «Ночь печальна…») 0.023, 52662ec1 (Лермонтов, «Из-под таинственной…») 0.021, m 0.002 |
| U6 | 312 | 7b9b662a 0.708, 00e3244d (Жизнь за Царя) 0.035, m 0.673 | yes | same | yes | same |
| r114 song 1 | 161 | eb5d3101 (Царская невеста) 0.056, 3e714e57 (Князь Игорь) 0.056, m 0.000 | no (low-score) | same | no (low-score) | 37b94043 (А. К. Толстой, «Кабы знала я…») 0.062, eb5d3101 0.056, m 0.006 |
| r114 song 2 | 414 | 0127a63f 0.431, a78be89a 0.023, m 0.408 | yes | same | yes | 0127a63f 0.431, 1fc2d404 (Пушкин, «К ***») 0.028, m 0.403 |
| r114 song 3 | 113 | 307359f1 0.447, b655d8eb 0.088, m 0.358 | yes | same | yes | same |
| r114 song 4 | 278 | 87376c17 0.441, 04cc9462 (Русалка) 0.045, m 0.396 | yes | 87376c17 0.441, 359aac69 (Полонский, «Зимний путь») 0.047, m 0.394 | yes | same as after |
| r114 song 5 | 214 | f1a88510 0.271, b655d8eb 0.044, m 0.227 | yes | same | yes | f1a88510 0.271, d729a821 (Лермонтов, «Отчего») 0.056, m 0.215 |

- **The nine fills are unchanged in work and score** (P, S, T, U1, U6, songs 2 to 5), by the shipped matcher and by the reference. No fixture that filled before fails to fill now. U4, U5, and song 1 still refuse, each at `low-score`.
- **No top work changes above the floor.** The shipped matcher's top changes only on U5 (Иоланта to Руслан и Людмила, 0.019 to 0.018: both far below the floor of 0.15). The reference's top (all works) differs on U4, U5, and song 1, each below 0.07.
- **Where my run differs from what the brief expected.** The brief expected the shipped matcher's second work to change on S, U4, U5, and song 4. It changes on U4, U5, and song 4; **it does not change on S**. The reference (all works) names a different second on seven rows (S, U1, U4, U5, song 1, song 2, song 5), because the shortlist of 20 does not hold the poem the reference ranks second. On the four fill rows where it differs (S, U1, song 2, song 5) the reference's second is 0.057 or less and the margin stays at 0.215 or more, so no fill is at risk there.
- The shortlist can only hide a competitor: the shipped matcher's second (and top, on a refusing row) is never above the reference's, and the test now says so.

## The floor (windows cut at every letter from U4, U5, and r114 song 1)

| window | windows | fill | top 0.15 or more | highest top | closest margin | shortfall to 0.10 |
|---|---|---|---|---|---|---|
| 80 letters, now | 741 | **0** | 177 | 0.212 | 0.087 | 0.013 |
| 100 letters, now | 681 | **0** | 73 | 0.170 | 0.060 | 0.040 |
| 113 letters, now | 642 | **0** | 93 | 0.150 | 0.053 | 0.047 |
| 80 letters, before (103 entries) | 741 | 0 | 49 | 0.156 | 0.050 | 0.050 |

- The closest case at 80 and at 100 and 113 letters is U4 (letter 62 at 80: top 0.212 «Я пережил свои желанья…» (Пушкин), second 0.125; letter 51 at 100 and 113). **At 80 letters the closest margin is 0.087, 0.013 short of filling.** The brief's review measured 176 windows and a closest margin of 0.081 (shortfall 0.019); this run has 177 and 0.087, which differ because the data I loaded is the 224 entries, not the 336 the review ran.
- The count 0 is the shipped matcher's, which sees the shortlist's 20 works only. I did not measure what the all-works reference would say for the 177 windows at 80 letters (see below).
- The bounds in `poem-match.test.ts` `:267-274` (`fills(6) > 100`, `fills(15) > 20`, `fills(80) = 0`, `fills(100) = 0`, every 80-letter window null) were not moved, and they pass. The comment beside them is updated (not re-counted).

## `poem-source.test.ts`: the capitals read

The test's list of capitalised second lines goes from 32 words to 111, and the stanza starts from 166 to 846 (77 from the 14 first poems, 89 from the arias, 680 from the 224 harvested poems). I read the 111 words and the line each came from. All but one are an ordinary word opening a verse line (a poet's capital at the start of a line: «Орден», «Соловей», «Красавица», «Поэтесса», «Артистка», «Мир», «Лето», «Тучи», «Плач», and so on).

**One proper noun: «Дона»**, entry `4da617ce24` («Грусть девушки»), the lines «В широких степях / Дона тихова» (the river Don). `passageLine` would print the passage as «в широких степях дона». It is reported and not fixed: `passageLine` is untouched. «Орден» (`053ba6daac`, «Старый капрал», «Честною кровью солдата / Орден не выслужить вам») is the common noun (a decoration); I read it so.

## The matcher's run time

Node, this Mac, median of 7 runs of `evaluate` on the fixture's Lyrics, before then after:

| fixture | before | after |
|---|---|---|
| U5 (567 letters, the slowest) | 105 ms | 91 ms |
| r114 song 2 (414 letters) | 77 ms | 73 ms |
| T (433 letters) | 81 ms | 74 ms |

The match does not slow with 224 more poems: the shortlist bounds the alignment work, and the shortlist step is cheap. The floor test (about 2,300 matches) takes about 3.1 s now. **This is Node on the Mac, not a phone** (the phone project's timing is `e2e-phone/poem-arias-time.test.ts`, run in step 4).

## Verified

`vitest run src/lib/text/poem`: 15 files, 319 tests passed. The probes I used (two `zz-lane45-*.test.ts` files, written to measure and read) were removed before the commit; the probe's outputs are in the scratchpad, not the tree.

## What Code could not establish

- Whether the all-works reference would fill any of the 177 windows (of U4, U5, song 1 at 80 letters) that the shipped matcher refuses for margin: not measured. The shortlist only ever lowers the second score, so it can make a refusal into a fill and never the reverse. The closest margin (0.087) is the shipped matcher's, so a window the matcher refuses by 0.013 might be refused by more under the reference, never by less. A fill by the shipped matcher that the reference would refuse is the case that could not be ruled out by this run on windows; on the twelve whole fixtures none arises.
- Whether a fill at any of those windows would be wrong. U4's closest window names Pushkin's «Я пережил свои желанья…» at 0.212, which is a poem a singer might also be singing: I did not read U4's text against the entry to say whether the song sets that poem.
- The phone timing: Node only here; step 4 runs the phone project.
- Which Wikisource or other pages the proper nouns in lines other than each stanza's second line (for example inside a passage) are on: the test reads second lines only, as the brief says.
