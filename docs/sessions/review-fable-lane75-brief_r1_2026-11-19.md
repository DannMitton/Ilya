# Review, Code brief for lane 75: the pane cut and Begin

r1, 2026-11-19, by Fable. Brief read in full: `brief-code-lane75-pane-cut-and-begin_r1_2026-11-19.md` (md5 `267a5658939c049c2a0e94d7439a36ea`, confirmed, 91 lines). Also read in full: `review-fable-lane74-as-built_r1_2026-11-19.md` (82 lines) and `docs/memory/CONTRACT.md` (170 lines). Tree read: `Shane` at `ce9abfc9`, through the bridge, read-only. Every `path:line` in this report was opened in this session.

## Verdict

**SEND WITH AMENDMENTS.** Four blockers. Each is a sentence of the brief that is untrue about the tree, and each has its replacement wording in this report. With blockers 1 to 4 applied as r2 the brief can go; r1 as written cannot, because its own stop rule fires on the first test file the lane opens, and gates 4 and 8 would move for reasons the brief says cannot happen.

The decision of 22:42 is enacted faithfully in the code section. `voice-pane.ts` after the cut is the lane 71 function body (`git show 773dfca1:apps/web/src/lib/components/Drawer/voice-pane.ts`, read this session), and no string changes. The faults are all in what the brief says about tests, ratchets, and line numbers.

One thing the desk was told that the tree does not show: the tree is not clean. `git status` read ` M docs/memory/INBOX.md`, ` M docs/memory/OPEN.md`, and the brief itself untracked when I began, and ` M docs/memory/QUEUE.md` as well when I finished; this report is now a second untracked file. The ship script refuses on an untracked file (`CONTRACT.md` section 4).

## Blockers

### 1. Section 2, tests, last bullet: `stand-in-borrowing.test.ts` does pin this pane, and the cut breaks it

The brief says the file "tests MELODY's and INSIGHTS' panes, not this one, and is not touched", and tells the lane to stop if any assertion reads `components/Drawer/`. The tree:

- `src/lib/stand-in-borrowing.test.ts:19` imports `paneSentence` from `$lib/components/Drawer/voice-pane`; `:46` wraps it as `pane`; `:60` puts it in `sites` as `'VOICE pane (4.6)'`. The file's own header (`:3`) says it reads "MELODY, INSIGHTS, the VOICE pane, and the chart together".
- `:88` asserts the pane's sentence contains the declared type's own name, and `:90` asserts it equals the borrowing line (`toBe(s['borrowing line (4.7)'])`). Both fail after the cut, for all three types in both languages (test 2, two cases, gate 4).
- `:87` is a comment that describes lane 74's behaviour. `:254` special-cases the pane in test 13; it passes after the cut and is stale.
- `:195`, `:198`, `:379` read the pane for a bass and pass unchanged.

So the lane halts on its first read, or edits a file the brief told it not to touch.

**Replace the bullet with:**

> - `src/lib/stand-in-borrowing.test.ts` reads this pane too (`:19`, `:46`, `:60`). Test 2 (`:75-96`) returns to its lane 71 form, which is in `git show 773dfca1:apps/web/src/lib/stand-in-borrowing.test.ts`: add `'VOICE pane (4.6)'` back to the list at `:85` whose entries must NOT contain the declared type's own name, and delete `:87-90` (the comment and the three assertions that the pane contains the type's name, contains the staff, and equals the borrowing line). The staff assertion at `:81-82` already covers the pane and stays. In test 13, drop `|| key === 'VOICE pane (4.6)'` from `:254`; the pane's sentence no longer holds the type's name, so nothing is stripped for it. Tests 9 (`:195`, `:198`) and the lane 74 item 3 group (`:379`) read the pane for a bass and do not change. No test is added or removed in this file.

### 2. Section 2, tests: a kept browser test pins the pane's borrowing sentence, and the brief does not name it

`e2e/voice-pane.test.ts:93-95`: after checking the Contralto radio, `:95` expects `.vp-sentence` to have the text "The field has not yet published resonance values for a contralto, so Ilya is using its mezzo-soprano values until you sample your own vowels in VOICE." The comment at `:93` says "the pane says why". This fails after the cut. Playwright is not one of the eight gates (`ilya-ship.sh:187`), so nothing on the Mac catches it before CI.

**Add to section 2, tests:**

> - `e2e/voice-pane.test.ts:93-95` (chromium project): the expected text at `:95` becomes `'Ilya is using generic values for a mezzo-soprano voice until you record your own.'`, which is lane 71's pin (`git show 773dfca1:apps/web/e2e/voice-pane.test.ts`). Repair the comment at `:93`. In the same test, after the Contralto radio is checked, add one assertion that the picker's note is on the screen (`.vt-note` holds "The field has not yet published resonance values for a contralto."), so the test shows the note and the short sentence together, which is the ruling.

### 3. Section 2, tests: two more pins in `voice-pane.test.ts` fail after the cut and are not named

The brief names the tests at `:184`, `:200`, `:220`, `:228`, `:236` and the comments at `:11`, `:27`, `:93`. All eight are as described. It misses:

- `:28-30`, three rows of the `cases` table ("a contralto", "a countertenor", "a bass-baritone"), each pinning the borrowing line with `toBe` in both languages (`:40-41`). The brief names only the comment over them.
- `:92-108`, "prints the ratified sentence ... for every type": `:94-98` build a `BORROWING` map and `:102` prefixes it for the three types. The brief names only the comment at `:93`.
- `:177`, the `describe` title, "lane 74, item 1: the pane gives its reason", which describes what is being cut.

The brief's bullet for `:184` also says "the three now read the same sentence as the five". They read the same template, each filled with its staff, not one sentence.

**Add to section 2, tests, and replace the `:184` bullet's first sentence:**

> - `:28-30`: the three rows take lane 71's exact strings (`git show 773dfca1`, the same file, `:16-18`). Contralto: "Ilya is using generic values for a mezzo-soprano voice until you record your own." / « Ilya utilise des valeurs par défaut pour une voix type de mezzo-soprano jusqu’à ce que vous captiez les vôtres. » Countertenor: "... for a mezzo and tenor voice ..." / « ... une voix type de mezzo et ténor ... ». Bass-baritone: "... for a bass voice ..." / « ... une voix type de basse ... ». The labels are `voiceType.staff.*` (`i18n.ts:2280-2282`).
> - `:92-108`: the `BORROWING` map (`:94-98`) and `lead` (`:102`) go; every one of the seven types in the list at `:99` reads `EN(n, ...)` and `FR(n, ...)` alone, with `toBe`.
> - `:177`: retitle the `describe` to say what it now holds, for example "the pane names the staff and gives no reason: all eight declared types, nothing sampled and three stable core vowels".
> - `:184`: each of the three reads `calib.pane.typedGeneric` filled with its staff. Add `contralto: 'mezzo-soprano'`, `countertenor: 'mezzo and tenor'`, `'bass-baritone': 'bass'` to `GENERIC_EN` and `contralto: 'mezzo-soprano'`, `countertenor: 'mezzo et ténor'`, `'bass-baritone': 'basse'` to `GENERIC_FR`, and run the two `toBe` lines at `:193-194` for all eight.

None of this weakens a test. Every `toBe` stays a `toBe`.

### 4. Section 7: "None of the files this lane touches is in `scripts/ratchets.json`" is false, and gate 8 has two lines of room

`scripts/ratchets.json:14` holds `"apps/web/src/lib/voice/CalibrationWizard.svelte": 1126`. The file is 1,124 lines (`wc -l`, this session). Item 3 names that file as the place for the change. `scripts/ratchets.mjs:66` fails gate 8 when a file passes its ceiling. A sticky rule with its comment is more than two lines.

The neighbours are as tight: `Drawer.svelte` is 1,986 of 1,990 (`ratchets.json:15`), and it holds the scroll container (amendment 3); `routes/+page.svelte` is 5,532 of 5,534 (`:8`). `voice-pane.ts`, both picker files, both test files, and `VoicePane.svelte` are not in the ceilings.

**Replace the sentence with:**

> `CalibrationWizard.svelte` is under a ratchet: 1,124 lines against a ceiling of 1,126 (`scripts/ratchets.json:14`). `Drawer.svelte` is 1,986 of 1,990 and `routes/+page.svelte` 5,532 of 5,534. Item 3 must not take any of the three over its ceiling, and must not raise a ceiling. Put the new rule where there is room (`VoiceTypeFirst.svelte` is 96 lines and has no ceiling; a new small component is the other path), or remove at least as many lines as you add. Say in the item 3 report each file's line count before and after.

## Amendments

### 1. Section 2, code: the header comment is `:1-16`, not `:1-38`

`voice-pane.ts:1-16` is the header comment. `:17-22` are the imports, `:24-36` the `PaneSentenceInput` interface, `:38` the comment of `borrowingSentence`. The paragraph to remove is `:12-15`, added by lane 74; `:1-10` are lane 71's and stay.

**Replace the last bullet of the code list with:** "The header comment is `:1-16`. Its last paragraph, `:12-15` ('A CONTRALTO, COUNTERTENOR, OR BASS-BARITONE WITH FEWER THAN FIVE STABLE CORE VOWELS'), describes the sentence being cut and goes, in the same commit. Restore lane 71's two-line comment over the `typed-generic` fill (`git show 773dfca1`, the same file): a contralto, countertenor, or bass-baritone reads the staff the values came from."

The other cited lines are right: `:39-45` `borrowingSentence` (comment at `:38`), `:47-49` `borrowingFor` (comment at `:47`), `:75-79` and `:77`, `:86-92` with `:87`, `:88`, `:89`, `:91`.

**The imports, checked.** After the cut `isBorrowingType` (`:22`) is the only unused import. Still used: `t` and `Language` (`:73`, `:85`), `PERSONAL_CORE_MIN` (`:56`, in `paneState`), `Vowel` (`:28`), `belowCoreText` (`:76`), `hasPlaceholderProfile` (`:107`), `borrowedStaffLabel` and `fillVoiceType` (`:91`), `isTier1` (`:59`), `voiceTypePrint` (`:112`). The brief may say so and spare the lane the check.

**No other module imports the two functions.** `grep -rn "borrowingSentence\|borrowingFor\b" src e2e e2e-phone scripts` returns only `voice-pane.ts:39`, `:48`, `:49`, `:77`, `:88`. Neither is exported.

### 2. Section 1: "the pane returns to naming the staff" is true in one state only

With nothing sampled the pane names the staff. With one to four stable core vowels it reads `calib.pane.belowCore` alone, which names no staff and no type (`i18n.ts:1445`). That is lane 71's behaviour and what the ruling restores, but the brief's sentence says more than the build does. `OPEN.md:4177` words the ruling for "a borrowing type and nothing sampled"; the brief cuts both states, which matches Dann's words ("cut the pane sentence") and item 1 as he walked it.

**Replace** "and the pane returns to naming the staff" **with** "and the pane returns to lane 71's sentences: with nothing sampled it names the staff, and with one to four core vowels sampled it reads the count sentence that every type reads, which names no staff".

### 3. Section 4, item 3: wrong line numbers, the wrong box, and a done-when that leaves two harms unguarded

**Line numbers.** `VoiceTypeFirst.svelte:45` is `<style>`; the guard comment is `:46-47`. `CalibrationWizard.svelte:810` is the `<VoiceTypeFirst>` line; Begin is `:811`. `.wizard-body` at `:788` is right.

**The box that scrolls is not `.wizard-body`.** `.wizard-body` (`CalibrationWizard.svelte:915-921`) sets no overflow and no height. The scroll container is `.takeover-body` (`Drawer.svelte:1474-1479`, `overflow-y: auto`, padding `4px 18px 16px`). Between it and the button, `.takeover-panel` (`routes/+page.svelte:4603-4607`), `.calibration-wizard` (`:887-897`), `.wizard-body`, and `.wizard-phase` (`:904-910`, `:952-955`) set no overflow, so a sticky button would hold to `.takeover-body`'s visible area. "At the foot of `.wizard-body`" names a box whose foot is off the screen.

**Whether the done-when can be met at all (your question 4).** From the lane 74 review's figures, which I did not re-measure: at 390 by 667 the body ends at 611 px, and with contralto chosen Begin's lower edge is at 708.1 px in English and 771.3 px in French. Left in the flow, Begin is 97 px and 160 px past the fold. The welcome screen's whole set of gaps is four at 0.875rem (`:908`), 56 px, so no trimming of space reaches 97, let alone 160. **The done-when is achievable in French at 390 by 667 only by taking Begin out of the flow (pinned in the visible area, or in a foot outside the scroller) or by moving it ahead of the picker. It is not achievable by spacing, and it does not force a string change.** That arithmetic is mine from the review's numbers. Nothing was rendered.

**What a pinned Begin covers.** Unscrolled at 390 by 667 in French, a 44 px button held at the foot of the visible area sits over the picker's grid or the first lines of the note. My estimate from the same figures, not rendered: the grid's last rows. The done-when protects the note and says nothing of the nine choices.

**Every phase read, and what a rule on `.wizard-primary` would do to each.** The class is on six buttons:

| phase | lines | buttons | a pinned primary |
| --- | --- | --- | --- |
| welcome | `:793-812` | primary Begin `:811` | the intended case |
| readiness, before | `:816-819` | primary Start `:819` | short screen; no harm read |
| readiness, running | `:820-822` | none (`TakeLine`) | none |
| readiness, unmeasured | `:823-826` | primary Continue `:826` | short screen; no harm read |
| readiness, refused | `:827-831` | secondary Try again `:830`, then primary Continue `:831` | pinning splits the pair the comment at `:828` orders on purpose |
| readiness, complete | `:832-839` | primary Continue `:839` | short screen; no harm read |
| capture | `:842-860` | toast dismiss `:850`; `VowelCapture`'s own `main`, `stop`, `see-space`, `return` (`VowelCapture.svelte:356-360`, `:418`) | not reached; those classes are scoped to that file |
| summary | `:861-880` | primary Finish `:867`, secondary Back to the ten `:868`, then the reset banner's two (`:873-874`) or secondary Start over `:878` | **harm**: Finish follows `SummarySheet` (`:866`), which is the chart, the table, the legend, the sources, and Print. Pinned, it floats over the sheet the singer is reading and is cut off from the two actions that follow it |

So the rule must be scoped to the welcome screen's button and must not be written on `.wizard-primary`.

**Replace the third paragraph of section 4 with:**

> The mechanism is yours, within this: the done-when cannot be met by tightening space (Begin is 97 px past the fold in English and 160 px in French at 390 by 667, by the lane 74 review's figures), so Begin leaves the flow on the welcome screen, or moves ahead of the picker. The box that scrolls is `.takeover-body` (`components/Drawer/Drawer.svelte:1474-1479`), not `.wizard-body`. Scope the change to the welcome screen (`voice/CalibrationWizard.svelte:793-812`, Begin at `:811`). Do not write it on `.wizard-primary`: that class is also Start, Continue (three times), and Finish, and a pinned Finish would float over the summary's sheet (`:866-867`).

**Add to the done-when:** "A pinned Begin sits on an opaque band, never over a line the singer cannot scroll clear of it; every one of the nine choices can be brought fully into view and tapped; at the end of the scroll the note's last line is clear of Begin. Readiness, capture, and the summary render as they do on `ce9abfc9`. If the mechanism changes what the comment at `VoiceTypeFirst.svelte:46-47` claims, repair the comment."

**Add a kept test,** since this guard failed silently once already (the review, section 4 step 4): "One Playwright case, kept: the welcome screen at 390 by 667 with Contralto checked, in English and in French, asserts Begin is wholly inside the viewport without a scroll. `e2e/calibrate-new.test.ts:450-454` already measures a button against `.takeover-body` and is the pattern."

### 4. Section 3, item 2: the rule is right; two line numbers and one condition are not

**What I read.** `VoiceTypeFirst.svelte`: comment `:39`, the live region `:40-42`, fieldset `.vt-first` a flex column with `gap: 0.3rem` at `:52-54`. `VoiceTypeIntake.svelte`: comment `:81`, the live region `:82-84`, fieldset `.vt-question` a flex column with `gap: 0.3rem` at `:149-151`. The brief's `:39-41` and `:81-83` are each one line early; the lane 74 review had them right.

**Would the rule remove the gap?** Yes, as far as the source and the compiler show. I compiled both files with the tree's Svelte 5.50.1 in a scratch folder, with the rule added to a copy held in memory (nothing under `apps/` was written). Both templates come out as `<div class="vt-note ..." aria-live="polite"><!></div>`: the region's only child is a comment node, and no whitespace text is kept. `:empty` ignores comments, so the rule matches while no note is shown. The compiler kept the selector (`.vt-note.svelte-...:empty`) and raised no warning, so gate 3 stays at 12 warnings from this rule. A zero-height flex item with `margin-top: -0.3rem` cancels exactly the one 0.3rem gap it adds, in both files and in both of the intake's cases (region last, with no type; region followed by `.vt-clear`, with a published type). **I did not render it in a browser.**

**Replace** "`voice/VoiceTypeFirst.svelte:39-41` and `voice/VoiceTypeIntake.svelte:81-83`" **with** "`voice/VoiceTypeFirst.svelte:40-42` and `voice/VoiceTypeIntake.svelte:82-84`".

**Add to the verification sentence:** "Read it on item 2's own commit, before item 3 moves Begin; after item 3 the figure no longer means anything. If Begin does not move by 4.8 px, check in the browser that the empty region holds no text node before changing the rule."

### 5. Section 5, item 4: "No kept test renders either page for a borrowing type today" is not what the tree or the cited review says

`e2e/insights-no-score.test.ts:65-74` renders INSIGHTS for a contralto with no score, in both languages, and asserts the borrowing line. The lane 71 review's section 6 says no kept test renders "MELODY, or INSIGHTS with a score". The new test is still owed; the sentence is too wide, and the brief carries no search line (`CONTRACT.md` section 4, "Search the tree before you propose to add anything").

**Replace the last sentence with:** "Searched: `grep -rn 'contralto' apps/web/e2e apps/web/e2e-phone` returns two files. `e2e/insights-no-score.test.ts:65-74` renders INSIGHTS for a contralto with no score, both languages; `e2e/voice-pane.test.ts:94` is the VOICE pane. No kept test renders MELODY, or INSIGHTS with a score, for a borrowing type (`review-fable-lane71-voice-type-as-built_r1_2026-11-19.md`, section 6). Load the score the way `e2e/insights-links.test.ts:14` and `:23` do. Seed the voice with `voiceType: 'contralto'` and no formants, and assert the exact ratified sentence, as `insights-no-score.test.ts:70-72` does."

### 6. Section 2, tests: say what "the words of `placeholder.borrowing`" means

Read loosely, the replacement for `:236` cannot pass: the short sentence shares "Ilya", "values", "until you" with the borrowing line.

**Replace** "does NOT contain the words of `placeholder.borrowing`" **with** "contains none of the three pieces `t('placeholder.borrowing', language)` leaves when split on `{type}` and `{borrowed}`, and does not contain the type's own name".

## What each singer reads in the VOICE pane after the cut

Derived from the lines read (`voice-pane.ts:53-63`, `:65-70`, `:75-93`; `voiceTypes.ts:126-130`; `i18n.ts:1431`, `:1432`, `:1436`, `:1445`, `:2280-2282`), and equal to lane 71's passing pins for the same function body. I did not run the function.

**Nothing sampled.**

| singer | English | French |
| --- | --- | --- |
| contralto | Ilya is using generic values for a mezzo-soprano voice until you record your own. | Ilya utilise des valeurs par défaut pour une voix type de mezzo-soprano jusqu’à ce que vous captiez les vôtres. |
| countertenor | ... for a mezzo and tenor voice ... | ... une voix type de mezzo et ténor ... |
| bass-baritone | ... for a bass voice ... | ... une voix type de basse ... |
| tenor | ... for a tenor voice ... | ... une voix type de ténor ... |
| "Not sure" | Not knowing is a fine answer. ... (`calib.pane.notSure`, whole) | Ne pas savoir est une réponse valable. ... |
| no type | Record your ten vowels, and Ilya builds your resonance profile. Or choose a voice type, and Ilya starts from generic values for now. | Captez vos dix voyelles, ... |

**Three stable core vowels ([i], [e], [ɛ]).** All six read the same sentence: "You have sampled 3 of the 6 core vowels so far ([i], [e], and [ɛ]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 2 more, unsampled vowels are assigned placeholder values." and its French, « ... ([i], [e] et [ɛ]) ... ».

**Is any of it false?** No. The contralto's values are the mezzo-soprano staff's, the bass-baritone's the bass staff's, the countertenor's the shared mezzo and tenor staff's.

**Is a sentence missing where one is owed?** By the ruling, no. Two things follow from it that Dann has not seen in these words, both lane 71's and both restored, not introduced:

1. With one to four core vowels sampled and the type row shut, a contralto's pane says neither whose values fill the rest nor why. MELODY and INSIGHTS say both (next section).
2. A countertenor reads "a mezzo and tenor voice", which names no voice a singer would recognize. It is true of the staff. For Dann's eye on the walk; not a reason to hold the lane.

Outside this brief and unchanged by it: `calib.pane.notSure` ends "Or choose a voice type, and Ilya starts from published values for it", which is not so for three of the eight types. The picker's note corrects it at the moment of choice.

## MELODY and INSIGHTS keep the borrowing line

Confirmed. `analysis/placeholder-line.ts:108-118` is `borrowingLine`, and `:113` draws it for a borrowing type whenever `isPersonal` is false, which is zero to four stable core vowels (`voice/engine/sung.ts:40-41`). It imports nothing from `components/Drawer/` (`:17-21`). MELODY calls it at `markup/MarkupPane.svelte:996` with the Tier 1 id (`routes/+page.svelte:4397` passes `voiceTypeChoice?.voiceType`), and INSIGHTS at `insights/InsightsPane.svelte:503`. So with nothing sampled, and with one to four core vowels sampled, a contralto, countertenor, or bass-baritone still reads the reason on both pages. `stand-in-borrowing.test.ts:158-175` pins that for 0, 1, 3, and 4 vowels and is not touched by blocker 1's edits.

## The gates

All figures in section 7 match `~/Downloads/ilya-ship.sh`, read this session: gate 1 `:90`, gate 2 `:91`, gate 3 `:92`, gate 4 both baselines at `:182` (`6743 passed | 1 skipped (6744)` with numpy and scipy, `6739 passed | 5 skipped (6744)` without), gate 5 `:184`, gate 6 `:188`, gate 7 `:189`, gate 8 `:190`. The brief's cited ranges `:90-92`, `:182-184`, `:188-190` are right.

With blockers 1 and 3 applied, I count no test added or removed in gate 4 by items 1 and 2 (one `it` replaced at `:236`), so gate 4 stays at 6,743 unless the lane adds one. Items 3 and 4 add Playwright cases, which gate 4 does not count.

## The brief against the contract

- Section 0, the alpha rule: the brief breaks it in the four places named as blockers and in the line numbers of amendments 1, 3, and 4.
- Section 4, "names every other site that computes the same number": the brief omits the line and says why. Correct; no number moves.
- Section 4, the NOT ESTABLISHED section and its verbatim sentence: present (brief section 8).
- Section 4, the search line before proposing new work: absent for item 4 (amendment 5).
- Section 5, "opens with what the line is for": met (brief section 1).
- Section 1 item 11a and section 7: no string and no French changes, so nothing goes to Dann as a draft.

## WHAT YOU COULD NOT ESTABLISH

NOT ESTABLISHED beats a complete invented answer.

1. **Anything rendered.** No browser was run. Every height in this report is the lane 74 review's, or my arithmetic on it. That covers the done-when at 390 by 667, and all of 375 by 667 and 360 by 640, for which I hold no figure of Begin's position at all.
2. **The `:empty` rule in a browser.** Established from the compiled template only. Whether Begin's lower edge reads 626.6 px is the lane's to measure.
3. **What a pinned Begin covers** on the welcome screen before a scroll. My estimate, from the review's figures and the style block, is the grid's last rows in French at 667.
4. **Whether the readiness screens overflow at 667.** I read their markup, not their heights.
5. **The singer table as executed output.** It is derived from the lines cited and matches lane 71's pins; I did not run `paneSentence`.
6. **The two phone tests said to fail on an untouched tree** (`e2e-phone/insights-links.test.ts:32`, `e2e-phone/voice-stations.test.ts:62`) and the hang of `e2e/time-signature-card.test.ts`. I ran no Playwright.
7. **Whether a screen reader announces the note.** Not run, as the brief says.
8. **Any pin of the pane's borrowing sentence outside `apps/web/src`, `apps/web/e2e`, and `apps/web/e2e-phone`.** Those three were searched for "not yet published", "pas encore publié", `placeholder.borrowing`, `borrowingLine`, `BORROW`, and `paneSentence`. The pins found are the ones in blockers 1 to 3, plus `e2e/insights-no-score.test.ts:71-72` and `insights/ratified-lines.test.ts`, which pin the page's line and the string and stay.
9. **Dann's words of 22:42 in the chat.** Read in `INBOX.md:929` and `OPEN.md:4177`, both uncommitted edits on the Mac; they agree with the brief's quotation.

## Terms

Adopted from the briefs and the review: "borrowing line", "picker note", "below-core", "the cut". Coined here: none.
