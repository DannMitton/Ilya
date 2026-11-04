# Report: poem library build 1, step 8, part 5, the title is not printed twice; gates and browser baseline (Code cloud lane, r1, 2026-11-04)

Brief: step 8 r2, Part 5 and "Gates and done". Branch `cloud-lane-31`, after part 4.

## The change

`poem-source.ts` gains `showsLine(title, firstLine, passage)`: false when `!passage && cardLine(firstLine) === cardLine(title)`. `PoemLibraryCard.svelte` sets `naming.line` to null on false and the template omits `<p class="line">` (`{#if naming.line}`). Tests: on the shipped entry `21568f1c1e` (title and first line both «Средь шумного бала, случайно») false whole, true as a passage; on `0127a63ffe` true; through `resolveSource` on the shipped entry; the template guard. Browser (`poem-library.test.ts`): fixture P, pasted, shows one title “Средь шумного бала, случайно”, **no `.line`**, and fills all five stanzas.

## Gates (the "eight" are the suites; part 6 of step 7 was the last count)

| Gate | Step 7 part 6 | Now |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| blurb | 148 | 148 |
| score-parser | 785 + 5 skipped | 785 + 5 skipped |
| web unit | 4146 + 1 skipped | **4164** + 1 skipped |
| integration (root) | 113 (part 1 raised it from 112) | **125** |
| svelte-check | 0 errors, 12 warnings | 0 errors, 12 warnings |
| ratchets | OK | OK |
| build | succeeded | succeeded |

## The browser suite against step 0's eight

**129 tests: 121 passed, 8 failed; the 8 are exactly step 0's eight by name** (a `comm` of the failing titles against step 0's list printed nothing new and nothing gone): `glue-typed-marks` ×2, `heic-offline`, `heic-reader-path`, `insights-page`, `loupe-header`, `print-pages`, `singer-paths:169`. NOT ESTABLISHED, as since step 0: why each fails.

## Done, line by line

| "Done" says | State |
|---|---|
| Parts 1 to 5 pushed with reports | Yes (`report-code-poem-build1-step8-part1` to `part5`). |
| The eight gates at their part 6 counts plus this step's tests | Yes, above. |
| Browser failures exactly the baseline's eight | Yes. |
| Every shipped entry carries `verified` and `source.site` | Yes: `isEntry` refuses an entry without `verified` and with an empty `source.site`; the build refuses the same; the test reads all 14 shipped entries (`verified: false`, site "Russian Wikisource"). |
| The nine filling fixtures land as the table has them | Yes: coverage and ratio equal Fable's table to two decimals and one, and each answer (whole or cut) is as stated (part 2). |
| No `textModern` fails the part 3 check | Yes: the build runs the check on every entry and the clean library test passes. |
| «Русская песня» fills ending at «Сам с собою грущу…» | Yes (part 3). |

## For Dann

- Part 1's card link (the site name links to the page) is a DESK DEFAULT he may strike; the quiet line stays text.
- Part 3 (e), the Latin `i` correction, is a rule 5 correction he may strike.
- No entry is marked verified; the fourth rule's source-line rung and the title of `cb6998d772` («диком» against «дальнем») wait for the verification data, as the brief says.

## NOT ESTABLISHED

- Why each of the eight baseline browser failures fails.
- The source pages for the data fixes (not re-read in this session; part 3's report says so).
- A real scan of the fish's song against part 2's thresholds.
