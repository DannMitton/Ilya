# Fable brief: lane 74 as built, the lane 71 follow-up and the concession at the moment of choice

r1, 2026-11-19, written by the desk (Opus 5) while the lane ran. Read it with the lane's own reports, which land in `docs/sessions/report-code-lane74-step*_r1_2026-11-19.md`.

## 0. What these lines are for

A singer who declares contralto, countertenor, or bass-baritone is told that the field has published no resonance values for their voice type, so Ilya works from a neighbouring staff until they sample their own vowels. Dann ruled at 09:41 and again at 10:08 that transparency is paramount and that the concession is stated in the line itself, never only behind a link, and that a sentence never tells a singer the values are their own type's when they are a neighbour's.

At 18:27 he asked whether to remove those three types outright. At 18:33 he ruled the other way: the three stay, and the concession is made **at the moment of choice**, in the picker, with both paths named. So the singer now meets the concession twice, and the two are not redundant: the picker's note is read when they choose, and the pane's sentence is read when they come back. **Your first job is to judge whether those two readings work together on one screen, or crowd each other.**

## 1. Read in full before you judge

1. `docs/sessions/brief-code-lane74-voice-type-followup_r3_2026-11-19.md` (md5 `9ba6fade`), the specification. Its sections 2 to 5 are the four items.
2. `docs/memory/OPEN.md`, the last two sections: "ROW 167: ALL EIGHT DECLARED TYPES GET A STARTING PROFILE" and "ROW 167: THE CONCESSION IS MADE AT THE MOMENT OF CHOICE". The second carries the ratified string, character for character. It is the authority, not the brief.
3. `docs/memory/CONTRACT.md` sections 0, 0.1, 1 item 11a, 5, 6, and 7.
4. `docs/sessions/review-fable-lane74-brief_r1_2026-11-19.md` and `..._r2-delta_2026-11-19.md`, your own two reviews of the brief, so you can see what was already caught and need not re-find it.
5. Every step report the lane filed.

## 2. The branch

`cloud-lane-74`, cut from `Shane` at `20c9a48f`. Trial-merge it into `Shane` in your own clone and report any conflict. The lane pushes only to its own branch; Dann merges.

## 3. What to check, in priority order

**First, the thing a singer meets, rendered.** For contralto, countertenor, and bass-baritone, in English and French, at 390 px and at a desktop width: the picker note in **both** pickers (`voice/VoiceTypeIntake.svelte` in the VOICE pane, `voice/VoiceTypeFirst.svelte` before the first vowel), and the VOICE pane's sentence, with nothing sampled and with three stable core vowels. Then the one screen that shows the note and the pane sentence together. **No screen may say two things that cannot both be true, and no screen may say the same thing twice in a way that reads as a stutter.** If the two readings crowd each other, say so plainly and say which one you would cut; that is a judgement the desk wants from you, not a nit.

Check the five published types read the short line unchanged, "Not sure" reads its own ratified sentence, and no declared type reads `calib.pane.none`. The picker note must not appear for any of those.

**Second, the ratified string, byte for byte.** `voiceType.borrowing`, English and French, against `OPEN.md`'s last section. **The apostrophe in « n'a » is U+2019, not U+0027**, and there is no colon in either language so no U+00A0 is expected. A drift of one character is a blocker. Confirm the fills: `{type}` is the Tier 1 name so the French stays masculine for all three, and `{borrowed}` is the staff.

**Third, the pane's two-sentence state.** A borrowing type with zero to four stable core vowels and at least one usable reading reads the borrowing line **first**, then `calib.pane.belowCore`, joined by a single space in one paragraph. That order matches `markup/MarkupPane.svelte` and `insights/InsightsPane.svelte`, which put `borrowingLine` before the placeholder note. Confirm the order against those two files in the tree, not against this brief. Confirm the condition is read from the stable core count and that `paneSentence`'s input shape did not grow a formants field.

**Fourth, item 3, the collapse.** `placeholderFillLabel` and `borrowedStaffLabel` were to become one function named `borrowedStaffLabel`. Confirm the survivor's behaviour over every Tier 1 id crossed with no Tier 2 label, each of the 23 Tier 2 labels of the five published types, Other with text, Other with empty text, `not-sure`, `undefined`, and an unknown id. **The case that motivated it:** a bass who typed octavist must read "bass" in the pane, on MELODY, in INSIGHTS, on the vowel chart caption, and on the sheet, never "octavist", and never their own Other text. Render MELODY and INSIGHTS for that singer and read them.

Check the lane's report on whether any live path still reaches `fillVoiceType`'s French elision. It was told to report and not to delete; confirm it did not delete.

**Fifth, item 2, the two stale comments.** `voice/voiceTypes.ts:121` and `voice/chart/screen-logic.ts:77` named `hasDeclaredType`, which no longer exists. `grep -rn hasDeclaredType apps/web/src` must now return nothing. Each repaired comment must still tell a reader that "undeclared" means exactly `undefined` from `borrowedStaffLabel`. A comment that lost that meaning while losing the dead name is a fix to request.

**Sixth, the tests.** The brief's section 6 named six sites that turn red plus three in `stand-in-borrowing.test.ts` that import or call the retired name. Each was to be **updated, never deleted**. Confirm each, and confirm the new tests the brief asked for exist: `paneSentence` for all eight declared types crossed with two sample states in both languages; the picker note's pure function for all nine Tier 1 ids and for no selection; `profileSubtitle` and the chart caption for a bass with each Tier 2 label and with Other text. **Flag any test the lane deleted or weakened to make a gate pass.**

**Seventh, the accessibility claim.** The note arrives after the singer has acted, so it was to sit in a polite live region and the lane was to report how it announces in both languages. Confirm the markup and the report. Confirm focus was not moved.

## 4. What is NOT this lane's to close, and must not be reported as a defect of it

- `capture.hint.placed.typed` staying false once five core vowels are stable, for all eight types.
- The sources note's first clause being untrue for an undeclared voice.
- The guard and the stand-ins disagreeing about a countertenor (`voice/engine/plausibility.ts:135-142` sends him to `union`, `voice/engine/stand-ins.ts:58` to `tenor-mezzo`). It needs a ruling Dann has not been given.
- Case 3 of his 14:21 ruling, that no declared type with fewer than five sampled core vowels gets no full set.
- The closing clause of `placeholder.borrowing` naming VOICE while the singer stands in VOICE. Dann's ratified wording; out of scope.
- Dann's walk of lane 71, which this lane prepares and does not replace.

## 5. Gates

All eight, plus **both Playwright projects**, which sit outside the eight and which the eight will not catch. **Gates 4 and 5 are expected to move**, because the lane adds tests; each moved count must be reported with its new number and what added it. Every other gate at baseline. Gate 4 has two baselines, with and without scipy; the brief's step 0 carries both.

Two phone checks are known to flake with causes not established: `e2e-phone/insights-links.test.ts:32` and `e2e-phone/voice-stations.test.ts:62`. A failure at either is the known flake; anything else is the lane's.

No file this lane touches has a size ceiling, and `apps/web/src/lib/i18n.ts` is a named exemption in `scripts/ratchets.json`. If a ratchet moved, find out why.

## 6. How to report

Write to `docs/sessions/review-fable-lane74-as-built_r1_2026-11-19.md`:

1. **VERDICT:** MERGE, MERGE WITH FIXES, or DO NOT MERGE.
2. **BLOCKERS**, numbered, each with the file and line that proves it.
3. **FIXES**, numbered, each with the exact change.
4. **FOR DANN'S EYE**, the walk list: what he looks at first, in order, and what to look for. His walk of lane 71 follows this merge, so this list and that walk are one list.
5. **WHAT YOU COULD NOT ESTABLISH.** **NOT ESTABLISHED beats a complete invented answer.**

**Create no `.bak` file.** The environment cannot delete one. Run `ls` before naming any path, because lane numbers are not unique across subjects.
