# Report, lane 74, step 5: the tests

Brief section 6 and step 5. Paths are under `apps/web/` unless a full path is given. Every pinned line was read in this session before it was changed. Nothing was deleted: each pin moved to the new behaviour.

## The nine pins of section 6

The brief's line numbers were each read. Where a number had moved by the time I opened the file, I name the test instead.

| Test | What it pinned | What it pins now |
| --- | --- | --- |
| `src/lib/components/Drawer/voice-pane.test.ts`, the three `typed-generic` cases (brief `:16-18`) | "Ilya is using generic values for a mezzo-soprano voice..." and its French, for contralto, countertenor, bass-baritone | The ratified `placeholder.borrowing`, filled, in both languages, written out in full in the test and not computed |
| same file, "for every type" below-core test (brief `:81-86`) | `calib.pane.belowCore` alone, for every type | For the three: the borrowing line, one space, then the below-core sentence, with `toBe` on the whole concatenation; for the other four types and `undefined`: below-core alone, as before |
| `src/lib/stand-in-borrowing.test.ts`, test 2 (brief `:85-86`) | The declared type's name is ABSENT from `VOICE pane (4.6)` | `VOICE pane (4.6)` leaves the absence list and takes the borrowing line's treatment: it contains the type and the staff, and is `toBe` the borrowing line |
| same file, test 13 (brief `:241-255`) | The pane read like a fill, so any other type name was forbidden after stripping the staff | The pane is stripped of the declared type first, as the borrowing line already was, then the staff, then no other type name may appear |
| `src/lib/markup/subtitle.test.ts` (brief `:14-18`) | A bass with Other text "octaviste" prints « d’octaviste » | Prints « de basse ». The elision rule moves onto `fillVoiceType` directly: « d’octaviste », « de heldentenor », « de basse », « d’élève », and English never elides |
| `stand-in-borrowing.test.ts` import (brief `:14`) | Imported `placeholderFillLabel` | Imports `TIER2` and `voiceTypeBorrowingNote` instead |
| same file, Other's text and Tier 2 test (brief `:107`) | `placeholderFillLabel(choice, language)` equals the staff | `placeholderLabel(true, choice, language)` equals the staff, so it reads the label the pages call, with the whole choice |
| same file, "Not sure" test (brief `:123`) | `placeholderFillLabel(choice, language)` is `undefined` | `borrowedStaffLabel(choice?.voiceType, language)` is `undefined` |
| `e2e/voice-pane.test.ts` (brief `:95`) | A contralto reads "Ilya is using generic values for a mezzo-soprano voice..." | Reads the borrowing line. The bass line at `:91` is untouched and unchanged |

I also added `voiceType.borrowing` to test 14's list of strings checked for straight apostrophes and French colons.

## New tests

All in the files above.

**`components/Drawer/voice-pane.test.ts`, a new block: "lane 74, item 1".**

- `paneSentence` for all eight declared types, nothing sampled, both languages, exact strings: the three read the borrowing line, the five keep "generic values".
- All eight with three stable core vowels, both languages: the three read the borrowing line, one space, then the below-core sentence; the five read the below-core sentence alone. The join is `toBe` on the exact concatenation, and a test asserts no line break and no double space.
- "Not sure", no type, and an unknown id carry no borrowing line in either state.
- Five stable core vowels, nine recorded, and ten recorded carry no borrowing line for any of the three.
- The pane's sentence contains every non-token piece of `placeholder.borrowing`, in order, so it is the ratified line and not a second copy.

**`stand-in-borrowing.test.ts`, "lane 74, item 4".**

- Both strings pinned character for character, tokens included.
- The apostrophe in « n’a » is U+2019: the test reads the code point at that position, and asserts no straight apostrophe and no colon in either language.
- `voiceTypeBorrowingNote` for all nine Tier 1 ids and for no selection, an empty id, an unknown id, and two near-miss spellings, in both languages: the three read the exact string, the others read `null`, and no brace survives.
- The French stays masculine: « pour un contre-ténor », « pour un baryton-basse », « pour un contralto ».
- Both pickers call the one function, carry `aria-live="polite"`, never move focus, and place the note after the radio group and before the clear button (`VoiceTypeIntake`), and after the grid's closing tag and inside the fieldset (`VoiceTypeFirst`). These are reads of the source, like the existing `:168` pin.

**`stand-in-borrowing.test.ts`, "lane 74, item 3".**

- `profileSubtitle`, `genericLede`, and the chart caption for a bass, for each of `TIER2.bass` (basso-cantante, basso-buffo, basso-profondo, octavist), with no finer label, and with Other text ("octaviste", "my own words"), in both languages: all read "bass" / « basse », with the whole sentence compared.
- The chart caption is the two calls the page makes (`placeholderLabel`, then `fillVoiceType`), as `sites()` already did, because `singerBlocks` needs a whole model. It is not a render of the caption.
- The pane and the sheet also read "bass" for the same choices.
- `TIER2.bass` holds four labels and the five published types hold 23 (the brief's count, read from the data).
- Other's text never reaches a published type's fill, and "Not sure" with Other's text still reads nothing.

## Results

`vitest run` on the three unit files after the changes: `Test Files 3 passed (3)`, `Tests 71 passed (71)`. The e2e change runs with both Playwright projects in step 7.

## Not changed on purpose

`insights/singer-blocks.test.ts:232-234` passes a label into `sub()` directly, including « d’octaviste ». It tests the caption's fill given a label, which this lane does not change, and it passes. I left it. It still pins the elision on a path no live call reaches (step 2, section 5).
