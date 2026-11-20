# Report, lane 74, step 8: the final report

Branch `cloud-lane-74`, cut from `Shane` (`ca2a4e5`; the branch head the lane started on is `20c9a48`, which adds only the brief and its reviews, `git diff --stat ca2a4e5b HEAD -- apps packages scripts` printing nothing). Brief: `brief-code-lane74-voice-type-followup_r3_2026-11-19.md`. The step reports are `report-code-lane74-step0_r1_2026-11-19.md` to `report-code-lane74-step7_r1_2026-11-19.md`, and the pictures are in `lane74-step6-shots/`.

## What changed, in one paragraph per item

**Item 2 (step 1).** Two comments no longer name `hasDeclaredType`, a function that does not exist. `grep -rn hasDeclaredType apps packages` returns nothing.

**Item 3 (step 2).** `placeholderFillLabel` is gone. `borrowedStaffLabel` takes the Tier 1 id alone and is the one function every page uses, so a bass who typed octavist (or picked basso buffo, or typed their own words) reads "bass" on the VOICE pane, MELODY's subtitle, INSIGHTS' lede, the vowel chart's caption, and the vowel-space sheet. The equivalence check ran first: 196 comparisons, 0 differences for the Tier 1 form; today's function differed on 56. No French changed.

**Item 4 (step 3).** A new key `voiceType.borrowing` holds Dann's ratified English and French. A pure function `voiceTypeBorrowingNote(voiceType, language)` in `voice/voiceTypes.ts` returns the note for contralto, countertenor, and bass-baritone and `null` otherwise. Both pickers show it directly under the Tier 1 radio group, inside the same fieldset, in a polite live region, with no control and no focus move.

**Item 1 (step 4).** The VOICE pane's sentence for the three types names the reason: the borrowing line replaces "Ilya is using generic values..." when nothing is sampled, and in the below-core state it comes first, then one space, then the below-core sentence. The five published types, "Not sure", and no type are unchanged.

## Every file and line

`git diff -U0`, line numbers in the new files. Paths under `apps/web/`.

| File | Lines | What |
| --- | --- | --- |
| `src/lib/voice/voiceTypes.ts` | 117-119, 124 | `borrowedStaffLabel`'s comment: its role on every page, and clause 4 without the dead name |
| | 132-145 | `placeholderFillLabel` and its comment removed; `voiceTypeBorrowingNote` and its comment added |
| `src/lib/voice/chart/screen-logic.ts` | 77 | `sheetProvenance`'s comment without the dead name |
| `src/lib/markup/subtitle.ts` | 4, 8, 11 | the comment; the import; the call now `borrowedStaffLabel(o.voiceType?.voiceType, o.language)` |
| `src/lib/insights/identity.ts` | 12, 48, 55, 57 | the import; two comments; `placeholderLabel` calls `borrowedStaffLabel(voiceType?.voiceType, language)` |
| `src/lib/i18n.ts` | 19, 88 | the key index: 1,348 keys, `voiceType.` 46 |
| | 1896 | the comment above `insights.generic.lede` |
| | 2261-2265 | the comment and the new key `voiceType.borrowing` |
| `src/lib/voice/VoiceTypeIntake.svelte` | 27, 51-52, 81-84 | the import; the derived note; the live region and note, after the `{#each}` and before the clear button |
| `src/lib/voice/VoiceTypeFirst.svelte` | 13, 24-25, 39-42 | the import; the derived note; the live region and note, after the grid |
| `src/lib/components/Drawer/voice-pane.ts` | 11-15, 22, 38-50, 75-79, 87-90 | the header comment; the import; `borrowingSentence` and `borrowingFor`; the below-core branch; the typed-generic branch |
| `src/lib/components/Drawer/voice-pane.test.ts` | 11-22, 27-30, 93-111, 176-253 | the shared strings; the three cases; the below-core loop; the new block |
| `src/lib/stand-in-borrowing.test.ts` | 14, 85-90, 111, 127, 254, 270, 282-394 | the import; test 2; tests 3 and 4; test 13; test 14's list; the two new blocks |
| `src/lib/markup/subtitle.test.ts` | 2-3, 16-28 | the imports; the bass pin and the elision pin |
| `e2e/voice-pane.test.ts` | 93, 95 | the contralto expectation |
| `docs/sessions/` | | eight step reports (step 0 to step 8, this file included) and `lane74-step6-shots/` (16 PNG files) |

## Every measurement (390 px; the detail, pictures, and caveats are in step 6)

- **The pane's sentence block** for a contralto: nothing sampled, EN **60.89 px** (3 lines) and FR **81.19 px** (4 lines); three stable core vowels, EN **142.08 px** (7 lines) and FR **202.97 px** (10 lines). The unchanged bass sentence is 40.59 px in both languages. The doors fit inside 844 px in all four screens; the browser-storage reminder below them does not fit in the two three-vowel screens.
- **The picker note**: 72.75 px (4 lines), English and French, in both pickers.
- **Begin** in the wizard moves 79 px lower (629 to 708 EN, 692 to 771 FR) and stays on screen at 844 px. At 667 px its bottom edge is 672 (EN) and 671 (FR), 4 to 5 px past the edge; NOT ESTABLISHED whether that costs the singer a scroll.
- **Note and sentence together**: 268 px apart in both languages, so they do not share an 844 px screen.
- **The bass who typed octavist**, English: MELODY reads "generic bass", INSIGHTS' lede reads "generic bass", the chart caption reads "generic bass".

## The gates

| Gate | Baseline | After |
| --- | --- | --- |
| 1 | 462 | 462 |
| 2 | 248 | 248 |
| 3 | 0 errors, 12 warnings in 5 files | the same |
| 4 | `6723 passed \| 5 skipped (6728)` | **`6739 passed \| 5 skipped (6744)`** (+16, all new tests) |
| 5 | `904 passed \| 5 skipped (909)` | the same (this lane adds no score-parser test) |
| 6 | 178 | 178 |
| 7 | 159 | 159 |
| 8 | `ratchets: OK.` | `ratchets: OK.` (identical output; no ceiling file touched; `ratchets.json` untouched) |

The scipy-present form of gate 4 would read `6743 passed | 1 skipped (6744)`, DERIVED, not measured. The ship script is not in this sandbox, so its baselines were not moved: see step 7.

## Both Playwright projects

- **Control, untouched tree:** 355 passed, 6 failed, 2 skipped.
- **Changed tree:** 352 passed, 9 failed, 2 skipped.
- The six control failures: `e2e/loupe-header.test.ts:47`, `e2e/time-signature-card.test.ts:114`, `e2e-phone/input-views.test.ts:134`, `e2e-phone/phrase-ends.test.ts:26`, `e2e-phone/relining.test.ts:70`, `e2e-phone/relining.test.ts:95`. All six fail on the changed tree too.
- The three extra on the changed tree: `e2e/time-signature-card.test.ts:78` (fails on the untouched tree too when that file runs alone), `e2e/time-signature-card.test.ts:192` (passed on a rerun), and `e2e-phone/voice-stations.test.ts:62` (the brief's known flake; passed on a rerun).
- **Nothing in the changed tree's failures is a line this lane touched.** All 24 tests in `e2e/voice-pane.test.ts`, including the contralto line I changed, passed.
- The two time-signature failures wait on `.loupe .loupe-body` and are NOT ESTABLISHED as to cause. The control's six also include four phone tests (`input-views`, `phrase-ends`, `relining` twice) that failed identically on both trees; the brief's two known flakes are `insights-links:32` (passed) and `voice-stations:62` (failed once, passed on rerun). That means four more failures on the untouched tree than the brief's note allowed for. Dann should know the Playwright suite does not read green on an untouched `Shane` in this sandbox.

## What I decided, and what is Dann's (DESK DEFAULTS from the brief, applied as written, plus mine)

From the brief: the key name `voiceType.borrowing`; U+2019 in « n’a »; the picker note's `.vt-hint` style; the borrowing line first, joined with one space, in the below-core state; item 3's scope reaching all 23 Tier 2 labels and Other's text. **Mine, not in the brief:** (1) I read the brief's equivalence check as a check of the label function as it will be after the change (the Tier 1 id alone), because today's function differs from `borrowedStaffLabel` by design (step 2, section 1). (2) I repaired two comments that described the old label behaviour without naming the function (`identity.ts:48` and the removed `voiceTypes.ts` block), beyond the three the brief counts. (3) I added `voiceType.borrowing` to the key index and test 14's list. (4) The picker's note uses an always-present empty live region, which costs the six notes-free choices one 4.8 px flex gap; the other way, inserting the live region with the note, is less reliable for screen readers, so I did not take it.

## 9. What you could not establish

1. **What a screen reader says**, and when, for the picker note. No screen reader ran. The accessibility tree shows the polite live region and its text in both languages.
2. **Whether a singer on a 667 px phone sees Begin without scrolling** after choosing a borrowing type, and the heights between 667 and 844.
3. **Why `e2e/time-signature-card.test.ts` hangs at `.loupe .loupe-body`** on both trees, and why four phone tests fail on the untouched tree. I did not read the loupe or the failing tests' setup.
4. **What the second, hidden copy of the vowel chart's caption is for.** The page holds two; the visible one reads "generic bass".
5. **Whether scipy is the cause of gate 4's four extra skips.** The numpy-yes, scipy-no result matches the brief's description, but I did not read how `havePython` in `burg.test.ts` is computed.
6. **The ship script's baselines.** `~/Downloads/ilya-ship.sh` is not in this sandbox, so I moved nothing and kept no backup. The figures to set are in step 7.
7. **That no live path reaches the French elision.** Every live call of `fillVoiceType` takes a label from `borrowedStaffLabel`, `voiceTypePrint` on a Tier 1 id alone, or `placeholderLabel`, and none of the French labels those print begins with a vowel letter. That is a reading of the call sites and the label table, not a run of every page.
8. **That the chart caption's test is a render.** It is the two calls the page makes (`placeholderLabel`, then `fillVoiceType`), as the file's existing `sites()` helper does; `singerBlocks` needs a whole model.
9. **Whether a singer who reads the picker's note and the pane's sentence one after the other finds it a repetition.** Both open with the same clause, 268 px apart. The brief calls them not redundant on purpose. I measured and did not judge.
10. **Whether INSIGHTS' heading line saying "OCTAVIST" above a lede that says "generic bass" is wanted.** It is the identity line, which prints the label the singer chose. It is outside item 3's three sentences, and I left it.
11. **Brief inconsistency, for the next desk.** Section 5 counts three comments that name `placeholderFillLabel`; step 2 of section 8 says "the six stale comments". I found the three that name it and two more that described the old behaviour, and repaired five, plus the two `hasDeclaredType` comments of step 1. I did not find a sixth by name.
12. **Brief line numbers.** I read the files and ranges the brief points at and every claim I relied on held. I did not check each cited line number one by one, and I did not re-read `scripts/ratchets.mjs:81`; gate 8 passing is the check on that.
13. **French is Dann's.** I wrote no French. The only French in this change is the ratified string, wired as given, with U+2019 in « n’a » (the brief's desk default). Items 1 and 3 change no French sentence.
