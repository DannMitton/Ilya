<!-- Filed verbatim by the desk (Opus 5.5) 2026-11-16 evening. Fable 5.2 subagent, read-only, at Shane 8f2f93ec, cap 200k; 159,594 tokens by the harness count, 16 tool uses, 3.8 min. All of R1 to R9 applied in brief r3. -->

# Delta review: brief r2 for N.203 lane 61, against Fable's review of r1

Read-only at `Shane` `8f2f93ec` (`git log --oneline -3`: `8f2f93ec`, `079ce6d8`, `4df96a85`; `git diff --stat HEAD`: only `docs/memory/INBOX.md`, 1 insertion). Paths are under `apps/web/src/` unless they begin with `docs/`, `scripts/`, or `e2e`. I ran no test and no gate.

## 1. Verdict

**SEND WITH AMENDMENTS.** All 17 amendments and 6 of 7 blockers are carried faithfully, but the scroll step has two defects the tree shows (a restore that overwrites the link's scroll after the takeover is left, and a phone rule that sends every reveal to the top), and the takeover hand-back in Step 2 item 1 needs a request kind that r2 removes without replacing.

## 2. Faithfulness

| Item | Status | Note |
|---|---|---|
| A1 | APPLIED | r2 `:5`, `:7`, `:41`, section 9. |
| A2 | APPLIED | r2 `:45`, with the `touchVoice` sentence of A15 added. |
| A3 | APPLIED | r2 `:47`. The plan cite "section 4.6, first bullet" is dropped; no change in meaning. |
| A4 | APPLIED | r2 `:51`. |
| A5 | APPLIED | r2 `:53`. |
| A6 | CHANGED in one clause | A6 said `calib.characteristics.lede` "is not drawn until Dann rules it". r2 `:49` draws it as a DESK DEFAULT, "flagged to Dann for wording". This follows the review's own recommendation 6.4, and is the desk's addition (d). The no-intro half is applied. |
| A7 | APPLIED, with (a) changed by design | A7 said the page function "never sets `calibrationRequest`"; r2 `:63` sends the takeover case through the request path. This is addition (a), see section 3. Items (b) to (f) and the comment rewrites are applied (`:64-70`). The ruling A7 asked for exists: `docs/memory/INBOX.md:811`, "2026-11-16 20:13 ... RULED: lane 61's links scroll the Drawer to what they open (a third exception ... links only)". |
| A8 | APPLIED | r2 `:74`. |
| A9 | APPLIED | r2 `:82`, `:86`, `:118`. |
| A10 | APPLIED | r2 `:90`. |
| A11 | APPLIED | r2 `:92`. |
| A12 | APPLIED | r2 `:100-102`. `Drawer.svelte` is owned outright now that the scroll is ruled; `i18n.ts` for comments, not deletions. |
| A13 | APPLIED | r2 `:104`. "Four more props" became "its new props". |
| A14 | APPLIED, delete changed to mark | r2 `:76`, `:106`. Addition (c). |
| A15 | APPLIED | r2 `:45`, `:55`, `:78`. |
| A16 | APPLIED | r2 `:113`. |
| A17 | APPLIED | r2 `:118`. |
| B1 | APPLIED | `setCharacteristic` on the seam. |
| B2 | APPLIED | `openStation`. |
| B3 | APPLIED | Two station targets and `at: 'range'`. |
| B4 | APPLIED | Ruled at `INBOX.md:811`; cited in r2 `:29`, `:31`. One cite is off: the comment "THE TWO SCROLLS ... Do not add a third scroll here" is at `Drawer.svelte:973-979` at HEAD (`git show HEAD:...Drawer.svelte | grep -n`: 973 and 979). `:968-974` is the tail of the "RIGHT EDGE" comment, a brace, two blank lines, and the first two lines of the scroll comment. r2 carries the review's wrong range at `:31`, `:147`. |
| B5 | APPLIED | Owns list. |
| B6 | WEAKENED | Specified for "Add your range", L1 (through `openStation`), and L4 (`openVoice('record')`). **Not specified for L6** (r2 `:92`). The Drawer's reveal effect does nothing while the takeover is up (`Drawer.svelte:401`, `if (!el || untrack(() => takeoverActive)) return;`), and the takeover stows the content (`Drawer.svelte:448`), so L6 pressed with the takeover up opens a band the singer cannot see. |
| B7 | APPLIED | r2 `:66`, `:82`. |

## 3. The five additions

**(a) Step 2 item 1, the takeover press through the request path. BUILDABLE without a take-running flag; r2 leaves out three things Code would have to invent.**
- The refusal is decided inside the wizard, from its own `phase` (`CalibrationWizard.svelte:335`, `requestRefused(phase, req)`), and the page already sends `fromRest: !calibrating` (`routes/+page.svelte:1670`). No flag crosses the seam.
- What is wrong: r2 `:59` removes `'characteristics'` from `VoiceRequestKind`, and `:63` then sends a station press "through the existing request path". After the removal the kinds are `'record' | 'summary'` (`seam.ts:14`), and `landingFor` returns a wizard screen for every kind (`seam.ts:47-50`). A station press has no kind and no landing. Code must add a kind (or a field on `VoiceRequest`, `seam.ts:16-22`) that means "leave the takeover", and a branch in the wizard's effect (`CalibrationWizard.svelte:330-340`) that skips `landingFor` and `resetFlow(to)` for it.
- The hand-back: the wizard's only way out to the page is `onComplete` (`:742`, wired to `exitCalibration` at `routes/+page.svelte:3900`). It is also what Finish calls. If the page keeps the pending station and waits for `onComplete`, a press refused over the capture screen leaves the pending station set, and the singer's next Finish would open it. That breaks "dropped, never answered later" (`seam.ts:55`; `e2e/voice-pane.test.ts:258-261`). Code needs a distinct channel: a new callback prop, or a callback carried on the request and called only when the request is not refused.
- Leaving from the test fry is already safe: `:561` (`if (!takeoverVisible) untrack(fryToBefore)`) and `:575` (the microphone is wanted only while `takeoverVisible`). r2's tests name Welcome and the summary only (`:78`).

**(b) Step 2 item 6, generalizing the reveal. PROBLEM, two defects, both in the tree.**
- *The restore overwrites the link's scroll.* On leaving the takeover the Drawer restores the stowed position in a `requestAnimationFrame` (`Drawer.svelte:373-387`; the write is `:383-385`, `el.scrollTop = stowedScrollTop`). The reveal effect writes after `tick()` (`:399-411`). When `openStation` leaves the takeover and then asks for the reveal, both are queued; reading the code, the `tick` promise resolves before the animation frame, so the restore lands last and undoes the scroll. That order is my reading, not a run. r2's Owns gives Code "the reveal effect and the scroll comment only" (`:100`), which excludes `:373-387`.
- *On a phone every reveal goes to the top.* `revealScrollTop` returns 0 whenever `phone` is true (`reveal-scroll.ts:38`), on the stated ground that "the tap closed the other bands, so ANALYSIS is the first thing open" (`:24-26`). A station header or the Range heading sits below the voice line, the sentence, and the doors (`VoicePane.svelte:57-71`). r2 says "put the decision in `reveal-scroll.ts`" and does not say what a phone does for a target that is not a band head.
- *The word-tap tests that must keep passing:* `lib/components/Drawer/reveal-scroll.test.ts:12-34` (seven expectations; `:13-14` pin phone to 0, `:17-21` pin null on a desk when the head is inside or absent, `:24-33` pin 670, 360, 0, 580); `e2e-phone/word-tap-opens-analysis.test.ts:12-33` (`:25` pins `scrollTop` 0, `:27-29` pin `[data-band-head="analysis"]` inside 844 px); `e2e/word-tap-opens-analysis.test.ts:23-52` (three tests). The page's site is `routes/+page.svelte:2151-2152`, the prop `Drawer.svelte:148-153`, `:164`, and the page's pass at `routes/+page.svelte:3854`.
- *Seven free lines:* `wc -l` gives 1,983 against 1,990 (`scripts/ratchets.json:15`). The scroll comment is 7 lines (`:973-979`). The effect's own comment is 5 lines (`:389-393`) and the prop's is 5 (`:148-152`); both name the word tap alone and need rewriting too. The comment r2 asks for must give a reason, three cases, and three cites (r2 `:31`), so how many of the 7 lines it frees is NOT ESTABLISHED. The targets (`StationHeader`, the Range heading) are drawn outside `Drawer.svelte`, so the selector can travel in the request and the effect needs few new lines. Plausible; tight if the stow effect also changes.

**(c) Keys marked `UNUSED SINCE`, not deleted. FINE, with one correction.**
- `i18n-index.test.ts:40-57` checks prefixes, per-prefix counts, and the total against `stringKeys()`; `:59-64` checks paths. Nothing reads for a key's reader. A comment line is not matched by the index pattern, which reads only the block between the two header phrases (`:22-26`).
- `lib/voice/chart/ratified-strings.test.ts:99` compares only `capture.` and `sheet.` keys; `:39` already carries a key marked "UNUSED since N.203 lane 59 Step 2, kept". The other `stringKeys()` readers (`roberge-guard.test.ts:34-35`, `french-italics.test.ts:48`, `version-guard.test.ts:61`, `welcome-strings.test.ts:38`, `key-lines.test.ts:174`, `singer-blocks.test.ts:283`, `screen-logic.test.ts:138`) were read at those grep lines only; none is named for unused keys. A test that fails on a key with no reader: none found by `grep -rln 'UNUSED\|unused' --include=*.test.ts` (one hit, the file above).
- `i18n.ts` has no line ceiling (`scripts/ratchets.json:5` lists it as exempt data).
- Correction: three of the five keys are **already marked**: `.editButton` at `i18n.ts:1285`, `.addButton` at `:1287`, `calib.summary.savedLede` at `:1415`, all "UNUSED SINCE N.203 lane 60 Step 5". "Mark each" would mark them twice. Only `.title` (`:1443`) and `.doneButton` (`:1458`) need a mark.

**(d) The lede at the head of the Describe station. FINE.** Its only reader is `CalibrationWizard.svelte:939`. `grep -rn "characteristics\.lede\|These optional values\|charx-lede"` across `src`, `e2e`, `e2e-phone` finds no test. The French hit for « Ces valeurs » is `GuideContent.svelte:87`, a different sentence.

**(e) L6, splitting on `group.input`. FINE.** `i18n.ts:168`: `'group.input': { en: 'INPUT', fr: 'ENTRÉE' }`. `i18n.ts:1881`: the English holds "INPUT" once ("Add a score in the INPUT pane to begin."), the French « ENTRÉE » once (« dans le volet ENTRÉE pour commencer »). It is the only `insights.` key holding either word (`grep "'insights\..*\(INPUT\|ENTRÉE\)"`: one line, 1881). `richParts` splits only on `*…*`, brackets, ♭♯, `fR1`, and private-use glyphs (`text-parts.ts:52-63`), so the word arrives inside one plain part. `t(key, lang)` is at `i18n.ts:2634`.

## 4. Amendments for r3

**R1. Step 2, item 1 (replace the last two sentences).** "`'characteristics'` leaves `VoiceRequestKind` (above), so this press needs its own kind: add `'leave'` to `VoiceRequestKind` (`seam.ts:14`), not to `Landing`, and keep `requestRefused` as it is. In the wizard's effect (`CalibrationWizard.svelte:330-340`), a `'leave'` request that is not refused calls a new callback and does not call `landingFor` or `resetFlow`. The page opens the station from that callback only. Do not use `onComplete` (`:742`; `routes/+page.svelte:3900`) for this: Finish calls it too, and a press refused over the capture screen would then be answered at the next Finish (`seam.ts:55`; `e2e/voice-pane.test.ts:258-261`). Add `'leave'` to `seam.test.ts`. Test also from the test fry (`:561`, `:575` already release it)." Evidence: section 3 (a).

**R2. Step 2, item 6 (add).** "Two things in the tree stand against this, and both are yours. (i) Leaving the takeover restores the stowed scroll in a `requestAnimationFrame` (`Drawer.svelte:373-387`, write at `:383-385`), after the reveal's `tick()` (`:399`); a reveal asked for in the same turn as the exit must win. (ii) `revealScrollTop` sends a phone to 0 for every request (`reveal-scroll.ts:38`). Keep that for the word tap. For a link's target on a phone, use the desk rule (`:39-42`): move only when the target is outside the window, and align its top to the window's top. Unit-test both. The e2e case 'leaves the takeover and lands' asserts the target is in view after the restore has run." And in section 4, Owns: "`Drawer.svelte` (the reveal effect, the takeover's stow and restore at `:373-387`, the prop's comment at `:148-152`, and the scroll comment)."

**R3. Step 2, item 6 (add the tests by name).** "The word tap's tests: `reveal-scroll.test.ts:12-34`, `e2e-phone/word-tap-opens-analysis.test.ts`, `e2e/word-tap-opens-analysis.test.ts`. Change none of their expectations."

**R4. Section 2, section 4, section 9 (cite).** Replace `Drawer.svelte:968-974` with `:973-979` (three places: r2 `:31`, `:147`, and the sense of `:104`). Add to `:104`: "The comment is 7 lines; the effect's comment (`:389-393`) and the prop's (`:148-152`) are 5 each and are rewritten with it."

**R5. Step 4, L6 (add).** "With the takeover up, L6 goes through the same path as `openStation` item 1: dropped over the capture screen, otherwise the takeover is left and INPUT opens. The reveal does nothing while the takeover is up (`Drawer.svelte:401`)." Add to Tests: "L6 with the takeover up on the summary."

**R6. Step 2, Keys (replace the DESK DEFAULT sentence).** "DESK DEFAULT: delete none. `.editButton`, `.addButton`, and `calib.summary.savedLede` are already marked (`i18n.ts:1285`, `:1287`, `:1415`); leave them. Mark `.title` (`:1443`) and `.doneButton` (`:1458`) in the same form, `UNUSED SINCE N.203 lane 61 Step 2 (...)`. No test reads for a key's reader (`i18n-index.test.ts:40-64`)."

**R7. Step 1, the seam, and section 7 (replace the `touchVoice` conditional).** "`touchVoice` (`lib/voice/profileStore.ts:163-166`) sets `calibratedAt` only when it is absent, to the previous `updatedAt`, then moves `updatedAt`; the wizard publishes `calibratedAt ?? updatedAt` (`CalibrationWizard.svelte:780`). The printed date therefore stays. Keep `touchVoice`, and keep the test." Strike the second bullet of section 7.

**R8. Step 4, L4 (add).** "`SingerBlock.svelte` receives the Method line as a string (`:170`, `{block.method}`), not its key. Pass one boolean from `InsightsPane.svelte`, computed where `methodLineKey` is called (`:288-293`) from `adapted.generic` (`identity.ts:66-70`: every generic key has `generic` true), unless the notes block's shape changes with `singer-blocks.test.ts:249`." Note the ceiling: `InsightsPane.svelte` has 1 free line (743 of 744).

**R9. Step 1, "What each component draws" (wording only).** A6 said the lede waits for Dann's ruling. r2 draws it by default. Say so in one clause: "Fable's A6 held this back for a ruling; the desk draws it on the review's recommendation 6.4, and Dann may strike it."

## 5. For Dann's eye

1. **The lede on "Describe your voice"** (`i18n.ts:1444`): "These optional values sharpen MELODY and INSIGHTS. Any field can stay blank; where a value is missing, the analysis simply stays broad for that dimension." / « Ces valeurs facultatives précisent le CHANT et les APERÇUS. Tout champ peut rester vide. Là où une valeur manque, l'analyse demeure simplement générale pour cette dimension. » It carries "simply" / « simplement », and it was written for the old screen. Draw it as built, reword it (French is yours), or leave it out.
2. **L4's words.** r2 fixes them as "Record your vowels" / « Capter vos voyelles ». The pane's own door changes its words by state: "Carry on recording" at 1 to 9 usable vowels, "Record a vowel again" at 10 (`voice-pane.ts:61-63`; `i18n.ts:1429-1431`). Whether INSIGHTS can show the placeholder Method line for a voice with some vowels recorded is not established (section 6). If it can, the page and the pane would name the same door differently. Taste: fixed words, or the door's words.
3. **A phone link's landing** (R2): align the target to the top of the Drawer's window only when it is out of view, as a desk does. The alternative is always to the top of the target. Two competent people could differ.

## 6. What I could not establish

- Whether the animation-frame restore overwrites the reveal in a browser: read from `Drawer.svelte:373-411`, not run.
- Whether a station header or the Range heading is inside an 844 px window at `scrollTop` 0 on a phone: no browser run.
- How many lines the rewritten scroll comment frees.
- Whether `adapted.generic` can be true while the voice has 1 or more usable vowels (`resolveVowelValues`, called at `lib/analysis/analyze-score-adapter.ts:132`, not read).
- Whether a `<button>` inside the no-score paragraph leaves `e2e/insights-no-score.test.ts:30-32` passing: the assertion lines beyond `:34` were not read, and nothing was run.
- The cites r2 inherits from the review that I did not re-open: `sections.svelte.ts`, `sections.test.ts`, `NotePicker.svelte`, `InsightsIntake.svelte`, `intake-symbols.test.ts`, `StationHeader.svelte`, `NotationFields.svelte`, `GuideContent.svelte:389`, `voice-pane-usable.test.ts`, `routes/+page.svelte:4097-4180`, `:4358` (seen by grep only), the sheets, the plan, and r1 of the brief.
- Dann's words in r2's rulings table other than 20:13.
- The eight gates, vitest, Playwright: not run.

## 7. What I read

- `docs/sessions/review-fable-lane61-brief_r1_2026-11-16.md`: whole (155 lines).
- `docs/sessions/brief-code-n203-lane61-describe-and-insights_r2_2026-11-16.md`: whole (151 lines). r1 of the brief: not read.
- `docs/memory/INBOX.md:811` (grep, first 420 characters). `docs/sessions/brief-to-design-n108-drawer-three-groups_r1_2026-09-02.md:20-32`.
- `lib/voice/seam.ts`: whole (59 lines). `lib/voice/seam.test.ts`: grep lines 12, 25.
- `lib/voice/CalibrationWizard.svelte`: 116-128, 190-204, 300-360, 403-418, 446-470, 715-752, 776-800, and greps.
- `lib/voice/profileStore.ts`: 163-175 and a grep.
- `routes/+page.svelte`: 1640-1675, 2140-2154, 3890-3922, and greps (310, 3844-3845, 3854, 4358, 4538).
- `lib/components/Drawer/Drawer.svelte`: 143-156, 364-416, 444-450, 962-990, grep of `stowedScrollTop` and `revealRequest`; `git show HEAD:` grep for the comment's lines.
- `lib/components/Drawer/reveal-scroll.ts`: whole (43 lines). `reveal-scroll.test.ts`: 1-12 and grep lines 13-33.
- `lib/components/Drawer/VoicePane.svelte`: 40-75. `voice-pane.ts`: 55-67.
- `e2e/word-tap-opens-analysis.test.ts`: 1-53. `e2e-phone/word-tap-opens-analysis.test.ts`: 1-33. `e2e/voice-pane.test.ts`: 244-266 and grep lines 121, 124. `e2e/insights-no-score.test.ts`: 26-34.
- `lib/i18n-index.test.ts`: 1-65. `lib/voice/chart/ratified-strings.test.ts`: grep lines 39, 99. Other `stringKeys()` tests: grep lines only.
- `lib/i18n.ts`: 168, 1284-1288, 1414-1416, 1427-1434, 1441-1445, 1457-1459, 1881, 2634, and the `UNUSED` grep.
- `lib/insights/SingerBlock.svelte`: 50-95, 160-172. `text-parts.ts`: 45-66. `InsightsPane.svelte`: 284-296, 322-332. `identity.ts`: 60-72. `lib/analysis/analyze-score-adapter.ts`: grep lines only.
- `scripts/ratchets.json`: grep lines 5, 8, 14, 15, 18. `wc -l` of five files.

Memory: nothing from memory was used beyond style rules. Nothing new worth saving was learned about the user.
