# Review, lane 74 as built: the lane 71 follow-up and the concession at the moment of choice

r1, 2026-11-19, by Fable. Brief: `brief-fable-lane74-followup-as-built_r1_2026-11-19.md` (md5 `66e106d9`, read in full). Branch read: `cloud-lane-74` at `89c8cb98`, cloned into a throwaway container. Every figure below was produced in that clone this session unless it is marked as the lane's.

## 1. VERDICT

**MERGE WITH FIXES.** No blocker. One fix, and it does not gate the merge: the branch is safe to merge as it stands, and the fix can land as a follow-up commit before or after.

The merge is a fast-forward. `Shane` at `20c9a48f` is an ancestor of `cloud-lane-74`, so there is no conflict to report. The Mac's tree holds one untracked file, this review's own brief, which the branch does not touch.

What I checked and found sound:

- **The ratified string, byte for byte.** `voiceType.borrowing` (`apps/web/src/lib/i18n.ts:2265`) equals the text in `OPEN.md`'s last section in English and in French, compared with `toBe` in a test of my own. The apostrophe in « n’a » is U+2019. Neither language holds U+0027, U+00A0, or a colon. `{type}` is filled from `voiceTypePrint({ voiceType })` on the Tier 1 id alone and `{borrowed}` from `borrowedStaffLabel` (`voice/voiceTypes.ts:139-145`). The French reads « pour un contralto », « pour un contre-ténor », « pour un baryton-basse ».
- **What each voice reads.** I printed the note, the pane sentence in four sample states, and the sheet's sources note for all nine Tier 1 ids, no type, and an unknown id, in both languages. The three borrowing types read the note and the borrowing line. The five published types read "Ilya is using generic values for a ... voice until you record your own." unchanged and no note. "Not sure" reads `calib.pane.notSure` and no note. No declared type reads `calib.pane.none`. With five stable core vowels no type reads the borrowing line.
- **The two-sentence state.** `components/Drawer/voice-pane.ts:75-79`: borrowing line first, one space, then `calib.pane.belowCore`, one string. The order matches `markup/MarkupPane.svelte:996` and `insights/InsightsPane.svelte:503`, read in the tree. The condition is `i.core.length >= PERSONAL_CORE_MIN` (`voice-pane.ts:49`). `PaneSentenceInput` gained no field. `routes/+page.svelte` hands in `stableCore(voiceFormants)`, as the lane reported.
- **The collapse (your question 6).** Worked out from the branch's `voiceTypes.ts`, with the retired function rebuilt from `Shane`: 101 choices in two languages, 202 comparisons. The Tier 1 form and `borrowedStaffLabel` differ on **0**. Today's function differs on **56**, every one a published type with a Tier 2 label or Other's text. The lane's 0 and 56 stand; my input set is five choices wider than its 98 and the counts do not move. `grep -rn "placeholderFillLabel\|hasDeclaredType" apps/web/src apps/web/e2e apps/web/e2e-phone` returns nothing. The bass who typed octavist reads "generic bass" in MELODY's subtitle, INSIGHTS' lede, and the chart caption, and "bass" in the pane and on the sheet.
- **The elision.** `fillVoiceType`'s « de » to « d’ » rule is still in `voiceTypes.ts`. The lane reported and did not delete.
- **The two comments.** `voiceTypes.ts:124` and `voice/chart/screen-logic.ts:77` both still say that "undeclared" is `undefined` from `borrowedStaffLabel` and that sites branch on that value.
- **The tests.** All nine pins of the code brief's section 6 were updated, none deleted. The only removed assertions are the six that pinned the old behaviour, each replaced by a stricter one. The new tests the brief asked for exist. I found no weakened test.
- **The gates I ran.** Gate 3: `0 errors and 12 warnings in 5 files`. Gate 4: **`6743 passed | 1 skipped (6744)`**, 363 files. My container has scipy, so this is the lane's DERIVED figure, now measured. Gate 8: `ratchets: OK.`, 905 files. Playwright, chromium, `time-signature-card` and `voice-pane` together on the branch: 31 passed. I did not run gates 1, 2, 5, 6, 7 or the full Playwright projects.

## 2. BLOCKERS

None.

## 3. FIXES

1. **The empty live region costs every singer one flex gap, 4.8 px.** `voice/VoiceTypeFirst.svelte:40-42` and `voice/VoiceTypeIntake.svelte:82-84` keep `<div class="vt-note" aria-live="polite">` in the page when it holds nothing, and both fieldsets are flex columns with `gap: 0.3rem`. Measured in the wizard at 390 px: Begin's bottom edge is 631.4 px with the empty region and 626.6 px with it taken out of the layout, in English, for a tenor. At 390 by 700 that gap is what makes the wizard's body scroll at all (content 591 px in a 588 px body; 588 in 588 without it). Add this rule to the `<style>` block of both files:

```css
	.vt-note:empty {
		margin-top: -0.3rem;
	}
```

   The region stays rendered, so the announcement pattern is untouched. **I measured the effect with the region hidden, which gives the same arithmetic. I did not render this exact rule,** because the reviewer does not edit `apps/`. Whoever applies it reads Begin's bottom edge for a tenor at 390 by 844 in English: 626.6 px means it worked.

## 4. FOR DANN'S EYE

One list for this merge and the lane 71 walk. Each step says where to stand and what to look for.

1. **The note and the pane's sentence on one screen (your question 1).** VOICE pane, a contralto with nothing sampled, the voice type row open. The lane concluded the two never share a screen. **That conclusion is wrong.** The lane measured the page before any scroll. From the top of the note to the bottom of the sentence is 402 px in English and 423 px in French at 390 px wide, and the drawer shows 800 px at 844 and 623 px at 667. So after one short scroll both are on a phone screen together at every height I tried. At 768 by 1024 both are on screen with no scroll (note 606 to 646, sentence 911 to 951, in a 980 px body). At 1440 by 900 they are 265 px apart in the same column. They never contradict each other. They do open with the same clause, word for word, "The field has not yet published resonance values for a contralto", and the second half of each says the same thing in different words. Look for whether that reads as a stutter. **If one goes, I would cut the pane's borrowing line (item 1), not the picker's note.** Reasons: the note is your ratified ruling of 18:33 and 18:36 and the only one that names both paths; the pane's line is a desk default; it is the heavier of the two (seven lines in English and ten in French with three vowels sampled, step 3 below); and the same reason is still stated on MELODY, on INSIGHTS, and in the note whenever the type row is open. The cost of that cut: with the type row shut, the pane names the staff and gives no reason. I would not cut either before you have looked.
2. **Both pickers, the three types, both languages.** In the VOICE pane and on the wizard's first screen, choose contralto, countertenor, bass-baritone. The note appears under the group and stays. Choose tenor, then "Not sure": no note. The French note is one line longer than the English at 375 px wide.
3. **The pane with three vowels sampled, on a phone.** The sentence block is 142 px in English and 203 px in French at 390 px (the lane's figures; I did not re-measure them). The lane reports the browser-storage reminder under the doors runs below the screen in that state. Look for whether the doors still read as the next thing to do.
4. **Begin on the wizard's first screen (your question 3).** The lane measured Begin against the bottom of the window. The wizard's body ends 56 px above that, at the bar that reads THE PAGE, so the lane's clearances are 56 px too generous and its "four or five pixels" at 667 is a position taken after Playwright had scrolled. Read without scrolling, at 390 px wide, Begin's bottom edge is 626.6 px (English) and 689.8 px (French) before this lane, 631.4 and 694.6 with no note, and 708.1 and 771.3 with a note. It is fully on screen when the window is at least this tall:

   | | before this lane | this lane, no note | this lane, with the note |
   | --- | --- | --- | --- |
   | English | 683 px | 688 px | 765 px |
   | French | 746 px | 751 px | 828 px |

   At 390 by 844 Begin stays on screen in every case, with 80 px to spare in English and 17 px in French under the note. At 390 by 667, with contralto chosen, Begin's top is at 664 px in English and 727 px in French against a body that ends at 611 px: it is wholly out of sight, and so are the note's last two lines. **The guard had already failed at 667 before this lane** (Begin cut off in English, out of sight in French). The lane adds 5 px for everyone and 77 px for the three types. Look at it on your own phone in the browser, where the visible height is shorter than 844.
5. **The bass who typed octavist.** MELODY's subtitle, INSIGHTS' lede, and the chart caption read "generic bass". Confirmed in the code and in the lane's two pictures.
6. **INSIGHTS' heading over its lede (your question 2).** It is real. `insights/identity.ts:28` calls `voiceTypePrint(voiceType, language)` on the whole choice inside `composeIdentityLine` (`:25-33`), the template is `insights.identityUncalibrated` (`i18n.ts:1822`), and `insights/InsightsPane.svelte:280` builds it and `:499` prints it as the page's `poet` line. So the page reads "INSIGHTS FOR DANN · OCTAVIST · NOT CALIBRATED" one line above "placeholder values for a generic bass". Nothing else on INSIGHTS carries it: `identity.ts:28` is the page's only call of `voiceTypePrint` on a whole choice. The same pairing stands in the VOICE pane, where the type row's label comes from `typeControlLabel` (`components/Drawer/voice-pane.ts:112`) and reads "Octavist" above "generic values for a bass voice"; that one predates this lane. Whether a singer's own label over a staff's values is a contradiction or the honest pair is yours. Not for this lane.
7. Then the rest of the lane 71 walk as the desk listed it.

## 5. WHAT YOU COULD NOT ESTABLISH

**NOT ESTABLISHED beats a complete invented answer.**

1. **What a screen reader says (your question 4).** No assistive technology was run, by the lane or by me. The markup: each picker holds `<div class="vt-note" aria-live="polite">`, present before the text arrives, with the note inserted as a `<p>` inside it; neither file calls `.focus()` or sets `autofocus`; the wizard's welcome screen has no live region of its own around it (`voice/CalibrationWizard.svelte:793`), so the regions are not nested. That is the pattern that announces. Whether VoiceOver or TalkBack speaks it, and in which language voice, is not known.
2. **Why `e2e/time-signature-card.test.ts` hung for the lane (your question 5).** Its step 8 section 9 item 3 gives no cause. On an idle container all seven of its tests passed on untouched `Shane` (1.1 minutes) and all seven passed on the branch. The lane ran two full Playwright suites at once on one machine, and the test clicks after a fixed three-second wait (`:20`). So it is not this lane's doing: the lane touches no file under the loupe, the reader, or the score, and the hang appeared on its untouched control too. The cause under load is not established; the fixed wait is my inference and I did not test it.
3. **The four phone failures on the lane's untouched control** (`input-views:134`, `phrase-ends:26`, `relining:70`, `relining:95`) and `e2e/loupe-header.test.ts:47`. I did not run them.
4. **The fix's exact rule, rendered.** See fix 1.
5. **Your finding of 18:13 on 2026-11-19**, which the code brief and `OPEN.md` cite as the ground for item 1. `INBOX.md` at `20c9a48f` holds no line dated 2026-11-19 between 17:00 and 18:27, so I could not read it in your words. My answer in step 1 of the walk list leans on the pane's line being a desk default.
6. **Heights and widths I did not try.** I measured 390 by 844, 780, 740, 700, and 667, then 375 by 667, 360 by 640, 375 by 812, 430 by 932, 768 by 1024, and 1440 by 900, in Chromium only. No Safari, no real phone, no installed-app window.
7. **Gates 1, 2, 5, 6, and 7, and both full Playwright projects**, on the branch. The lane's figures for them are its own.
8. **The ship script's baselines.** `~/Downloads/ilya-ship.sh` is outside the connected folder. The measured gate 4 figure to set for the scipy path is `6743 passed | 1 skipped (6744)`.

## Out of scope, worth recording

- **The pane's sentence could fall back to its short form while the type row is open on a borrowing type**, which would remove the overlap in step 1 without cutting either reading at rest. New behaviour, not this lane's.
- **Begin at short heights** was failing before this lane. The two-column grid's comment (`VoiceTypeFirst.svelte:46-47`) states a guard the layout does not meet under 683 px in English or 746 px in French.
- **The lane's step 6 and step 8 reports carry the two wrong readings** named in steps 1 and 4 of the walk list. This review is the correction; the reports were not edited.

## What I did in the clone, for the record

Two temporary test files, both deleted, and one worktree of `Shane` for the control run. I wrote nothing under `apps/` or `docs/memory/` on the Mac and ran no git write there. One attempt to trial the fix's rule by editing two component files in the clone was refused by the permission system and not retried.

## Terms

Adopted from the briefs: "borrowing line", "picker note", "below-core". Coined here: none.
