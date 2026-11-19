# Review, lane 74 brief r1: the lane 71 follow-up

Reviewer: Fable 5.2, 2026-11-19. Brief: `docs/sessions/brief-code-lane74-voice-type-followup_r1_2026-11-19.md`, md5 `cd42ed8782ec32f4e9a7aa2414f77eea`, read in full. Tree: `Shane` at `ca2a4e5b`, read through the bridge with read-only git. `git diff --stat 496047c0 ca2a4e5b -- apps packages scripts` prints nothing, so the code is the code lane 71 shipped. Paths are under `apps/web/src/lib/` unless they start elsewhere. Nothing was run: every finding is a line read, and the one place I reasoned over inputs (item 3's equivalence) says so.

Read in full: the brief; `CONTRACT.md`; `OPEN.md:4102-4140`; `ratified-voice-type-stand-ins_2026-11-19.md`; `components/Drawer/voice-pane.ts`; `voice/voiceTypes.ts`; `analysis/placeholder-line.ts`; `markup/subtitle.ts`; `stand-in-borrowing.test.ts`; `components/Drawer/voice-pane.test.ts:1-120`. Read in part: lane 71 brief r4 (section 9 only); the as-built review (lines 1-60 and 81-130); `STATE.md:19-23`; `voice/chart/screen-logic.ts:60-95`; `insights/identity.ts:35-75`; `insights/identity.test.ts:104-146`; `voice/engine/stand-ins.ts:50-80, 138-170`; `voice/engine/plausibility.ts:128-145`; `voice/engine/sung.ts:20-45`; `scripts/ratchets.json` and `scripts/ratchets.mjs:1-30, 76-90`; `ENVIRONMENT.md:5540-5552`.

## 1. Verdict

**DO NOT SEND r1.** Four blockers and seven further amendments.

**The finding that changes the decision, first and alone.** The brief was written at 18:26 (file time 23:26:58 UTC) on the belief that the concession belongs in the pane's sentence and needs no new words. At 18:33 Dann ruled that the concession is made in the picker, at the moment of choice, with two doors (`INBOX.md`, the entry dated 2026-11-19 18:33, appended at 18:34 while this review was running). Item 1 is silent on that ruling, so it cannot go to Code until the desk says how item 1 stands against it.

Blockers 2 to 4 are text repairs that need nothing from Dann. Items 2 and 3 do what the rulings say and can go in an r2 with the amendments below, whichever way item 1 is settled. The brief's account of the tree is wrong in five places.

## 2. Blockers

1. **Item 1 predates Dann's ruling of 18:33 on where the concession is made, and does not mention it.** `INBOX.md`, 2026-11-19 18:33, Dann, transcribed there as written: *"Yes! this eases my conscience: \"That can live in the picker: choosing one of the three names says, at that moment, that the field has published nothing for this type and offers two doors, the neighbouring staff or your own samples.\""* The desk's own note beside it: "The three types stay. The concession moves to the moment of choice." Three consequences for the brief, each of which the desk settles, not Code:
   - Brief line 13 says "No new string and no new French enter the tree in this lane." A statement in the picker and two doors are words the tree does not hold. Whether they belong to this lane or to their own is not said anywhere I could read.
   - Brief lines 37 to 46 put the reason in `.vp-sentence`, which `VoicePane.svelte:121` draws below the picker's station (`:85`, `VoiceTypeIntake`). Whether that sentence still changes once the picker carries the concession, or changes as well, is not established. If the picker says it at the moment of choice and the pane's sentence says it too, the pane says it twice; how far apart the two sit on the screen is not measured.
   - The entry says it is "Homed in `OPEN.md`, 'ROW 167: THE CONCESSION IS MADE AT THE MOMENT OF CHOICE'". A grep of `OPEN.md` for "MOMENT OF CHOICE" and for "18:33" returns nothing; `OPEN.md` was last written at 20:08 UTC. The home is not written yet, so the brief has nothing to cite.
   The same entry records his 18:27 question, whether to remove the three types altogether; it was answered by the 18:33 ruling and the types stay.

2. **The brief gives the pane an order and says it is the pages' order; the pages use the other order.** Brief line 44: "Draw the borrowing line after the below-core sentence, one space between them, the same order the pages use." MELODY's note array is `[header, borrowingLine, placeholderNote]` (`markup/MarkupPane.svelte:996`) and INSIGHTS' is `[header, genericLede, borrowingLine, placeholderLine]` (`insights/InsightsPane.svelte:503`). `components/Paper/TitleHeader.svelte:202-203` draws the entries in array order, one `<p>` each. The order is pinned at `stand-in-borrowing.test.ts:171-172`. So the pages draw the borrowing line first. A Code session cannot satisfy both halves of the sentence.

3. **The brief names none of the existing tests its steps turn red, one of them sits outside the eight gates, and its "must not" sentence can be read as forbidding the repair.** Count: six sites in four files.
   - Item 1, nothing sampled: `components/Drawer/voice-pane.test.ts:16-18` pins the three borrowing types to the `typedGeneric` sentence with `toBe`.
   - Item 1, below core: `components/Drawer/voice-pane.test.ts:81-86` pins contralto, countertenor, and bass-baritone to the below-core sentence alone with `toBe`.
   - Item 1: `stand-in-borrowing.test.ts:85-86` asserts the VOICE pane does not contain the declared type's name. The borrowing line contains it.
   - Item 1: `stand-in-borrowing.test.ts:241-255` (test 13) strips the declared type from the borrowing line only (`:250`), so the pane's text fails `:254` on "contralto", "contre-ténor" or "countertenor", and "baritone" or "baryton".
   - Item 1: `apps/web/e2e/voice-pane.test.ts:95` pins the contralto's pane sentence in a browser. Playwright is not one of the eight gates (as-built review, "Gates" table: phonology, dictionary, web-check, web-test, score-parser, blurb, integration, ratchets), so "all eight gates at baseline" passes with this test red.
   - Item 3: `markup/subtitle.test.ts:14-18` pins « d’octaviste » and "heldentenor" reaching MELODY's subtitle through Other's text. After item 3 neither can.
   - If the collapse removes the name `placeholderFillLabel`: `stand-in-borrowing.test.ts:14` (import), `:107`, and `:123`.
   Brief line 50 says "Do not change ... any of their pins in `lib/insights/ratified-lines.test.ts` or `lib/stand-in-borrowing.test.ts`". The four strings' own pins there (`:145-146`, `:184`) do stay. Three other assertions in that file must change, and the sentence does not separate the two.

4. **Step 0 carries one gate 4 baseline and tells the session to stop if it measures another; a cloud sandbox measures another.** Brief line 105 gives `6727 passed | 1 skipped (6728)` only. `ENVIRONMENT.md:5547-5552`: "GATE 4 HAS TWO BASELINES AND A BRIEF MUST CARRY BOTH", the second where python3 lacks scipy, four tests in `voice/engine/burg.test.ts` skipped; "A cloud sandbox usually lacks scipy." The branch is `cloud-lane-74`. Lane 71's cloud figure was 6723 passed, 5 skipped (as-built review, "Gates").

## 3. Amendments

Blocker 1 has no text I can supply: the desk writes the `OPEN.md` home for the 18:33 ruling, then rewrites or withdraws section 2 of the brief against it, and r2 comes back for review. Amendments 1 to 3 repair blockers 2 to 4. Amendments 1, 4, 6, and 10 concern item 1 and fall away if item 1 is withdrawn. Each gives the text to change and the text to put there.

1. (Blocker 2.) Line 44, change "On MELODY and INSIGHTS that singer sees both lines, because" to "On MELODY and INSIGHTS with a score analysed that singer sees both lines (`placeholder-line.ts:74-75`; with no score INSIGHTS draws the borrowing line alone), because". Change "Draw the borrowing line after the below-core sentence, one space between them, the same order the pages use." to "Draw the borrowing line before the below-core sentence, one space between them, the order the pages use (`markup/MarkupPane.svelte:996`, `insights/InsightsPane.svelte:503`, pinned at `stand-in-borrowing.test.ts:171-172`)." If the desk wants the borrowing line second in the pane, keep "after" and strike "the same order the pages use"; that is the desk's call and the sentence must then say the pane departs from the pages.

2. (Blocker 3.) Line 50, change "or any of their pins in `lib/insights/ratified-lines.test.ts` or `lib/stand-in-borrowing.test.ts`" to "or the pins of those strings' own text (`lib/insights/ratified-lines.test.ts`; `lib/stand-in-borrowing.test.ts:145-146` and `:184`)". Add to section 6, before step 1: "Existing tests these steps turn red, each repaired in the step that breaks it and listed in that step's report with its old and new expectation: `components/Drawer/voice-pane.test.ts:16-18` and `:81-86` (step 3); `stand-in-borrowing.test.ts:85-86` and `:241-255` (step 3); `apps/web/e2e/voice-pane.test.ts:95` (step 3; Playwright is outside the eight gates, so run `e2e/voice-pane.test.ts` and `e2e/insights-no-score.test.ts` in step 5 and report the counts); `markup/subtitle.test.ts:14-18` (step 2; the elision stays tested at `voice/voiceTypes.test.ts:164-168`); `stand-in-borrowing.test.ts:14`, `:107`, and `:123` if the collapse retires a name (step 2). If any other test fails, name it and stop."

3. (Blocker 4.) Line 105, change "The current baseline is `6727 passed | 1 skipped (6728)`; report what you measure, and if it differs, stop and say so before step 1." to "The current baseline is `6727 passed | 1 skipped (6728)` where python3 has numpy and scipy, and `6723 passed | 5 skipped (6728)` where it has no scipy (`ENVIRONMENT.md:5547-5552`; the four are in `voice/engine/burg.test.ts`). Report which form you measured; if it is neither, stop and say so before step 1." Line 110, change "All eight gates at baseline." to "All eight gates. Gate 4 rises by the tests this lane adds; report the old and new strings in both forms so the desk can move the ship script's line." The second figure is derived (6727 less the four); see section 6.

4. **`paneSentence` has no formants to hand to `borrowingLine`.** `borrowingLine` takes `formants` (`analysis/placeholder-line.ts:110`). `PaneSentenceInput` carries `usable`, `core`, `voiceType`, and `restWorkedOut` (`components/Drawer/voice-pane.ts:19-31`), and `VoicePane.svelte`'s props carry no formants (`:40-56`; the call is `:59`). Line 39 ("`paneSentence` calls `borrowingLine` for a borrowing type") is silent on this, and line 44's "`borrowingLine` already stops on its own at five stable core vowels (`:113`, `isPersonal`), so nothing is needed to end it" is not what ends it in the pane: the pane leaves `below-core` at `voice-pane.ts:38` when `core.length` reaches `PERSONAL_CORE_MIN`, and `typed-generic` needs `usable` 0, so in both states the voice is already not personal (`voice/engine/sung.ts:33`, `:41`). Replace that sentence with: "`PaneSentenceInput` carries no formants (`voice-pane.ts:19-31`) and `borrowingLine` needs them (`placeholder-line.ts:110`). In the two states where the pane draws the line the voice is already not personal: `typed-generic` has nothing sung, and `below-core` has fewer than five stable core vowels (`voice-pane.ts:38`). DESK DEFAULT: <the route the desk chooses>; say in the report which route you took." The route is the desk's to name; I name none.

5. **None of the five files has a ceiling.** Line 110: "`voice-pane.ts`, `voiceTypes.ts`, `screen-logic.ts`, `subtitle.ts`, and `identity.ts` are each inside the ratcheted set; report each file's count against its ceiling, and if the collapse in step 2 lowers one, lower the ceiling with it." `scripts/ratchets.json` lists sixteen ceilings and none is one of these; they are 91, 157, 154, 14, and 75 lines against `newFileMaxLines` 1000. Change to: "None of `voice-pane.ts`, `voiceTypes.ts`, `screen-logic.ts`, `subtitle.ts`, or `identity.ts` has a ceiling in `scripts/ratchets.json`; each sits under the 1000-line limit for an unlisted file. Report gate 8's output. `voice-pane.ts` is outside the six modules and already imports `analysis/placeholder-line` (`:15`), so the new import breaks no module rule."

6. **Two character counts are not what the file holds.** Line 54: "`placeholder.borrowing` in English is 142 characters against `calib.pane.typedGeneric`'s 69". Counted from `i18n.ts:2052` and `:1432`: 144 and 79 with their tokens; 150 and 81 filled for a contralto; the French templates are 186 and 109. Change to "is 144 characters against `calib.pane.typedGeneric`'s 79, tokens included (French 186 against 109)".

7. **`stand-ins.ts:147` is a comment line.** Line 123: "`stand-ins.ts:61` and `:147` manufacture one from `template('middle')`". `:61` is `return 'middle'`, correct. `:147` is inside the doc comment of `fillStandIns`. The call `template('middle')` is at `:160` and serves the personal scale; the unscaled route for an undeclared voice is `:163-164` (`standInBucket(voiceType)`, then `template(bucket)`). Change "`:147`" to "`:163-164`". `OPEN.md:4117` carries the same stale `:147`.

8. **Item 3 reaches a third sentence and twenty-three labels, and the brief names two sentences and one label.** Add to "What it does today" (after line 78): "INSIGHTS' vowel chart caption prints **octavist** by the same path: `insights/InsightsPane.svelte:373` passes `placeholderLabel` to `insights/singer-blocks.ts:337`, which fills `insights.r2.vowels.against.generic` (`i18n.ts:2042`)." Add `:2042` to the French check at line 93; it has the same shape, « pour une voix type de {voiceType} ». Add to "What the singer reads after it": "Every Tier 2 label of the five published types stops reaching these three sentences, 23 labels in all (soprano 5, mezzo-soprano 3, tenor 7, baritone 4, bass 4; `voiceTypes.ts:35-42`), and so does Other's text for those five. A lyric soprano reads 'a generic soprano'; a Heldentenor reads 'a generic tenor'. The identity line still prints the singer's own label (`insights/identity.ts:28`)." In step 2, change "Tests for a bass with each of its Tier 2 labels" to "Tests for each of the five published types with each of its Tier 2 labels". Mark the item DESK DEFAULT in one line (`CONTRACT.md` section 1 item 2); the decision right the brief cites is recorded as "inside N.204" (`OPEN.md:4134`), and this lane is not N.204.

9. **The collapse leaves comments naming code that is gone, which is item 2's defect made again.** The brief says "Collapse them into one exported function and keep one contract comment" and names neither the surviving name nor its signature (one takes a choice, `voiceTypes.ts:136`; one takes an id, `:123`; the callers at `markup/subtitle.ts:11` and `insights/identity.ts:57` pass a choice). Add: "DESK DEFAULT: the survivor is `<name>`, taking `<the id | the choice>`. These comments describe the rule this step changes and are rewritten in the same step: `voice/voiceTypes.ts:116-121` and `:129-135`; `markup/subtitle.ts:4`; `insights/identity.ts:48` and `:55`; `i18n.ts:1896`; `components/Drawer/voice-pane.ts:65-66` (after step 3); the header of `stand-in-borrowing.test.ts:6-8`. After the step, grep for the retired name and report the count, which is 0." The desk fills the two blanks.

10. **Below core starts at zero stable core vowels.** Line 44: "A borrowing type that has sampled one to four core vowels takes the `below-core` branch". The branch is `usable >= 1 && core.length < 5` (`voice-pane.ts:38`), so a contralto with one hard vowel sung and no stable core vowel is in it too (`voice-pane.test.ts:94-99` pins that state for a bass). Change "one to four core vowels" to "anything, with fewer than five stable core vowels (zero to four; `voice-pane.ts:36-38`)". In step 3, change "with nothing sampled and with three core vowels sampled" to "with nothing sampled, with one hard vowel and no core vowel sampled, and with three core vowels sampled".

## 4. Citations checked

Every `path:line` in the brief, opened at `ca2a4e5b`.

| Brief line | Citation | Result |
|---|---|---|
| 21 | `components/Drawer/voice-pane.ts:44` | OK |
| 21 | `voice-pane.ts:49` | OK |
| 21 | `voice-pane.ts:63-67` | OK; the fill is `:67`, the block closes `:68` |
| 23 | `i18n.ts:1432` | OK, text as quoted |
| 27 | `voice/voiceTypes.ts:123-127` | OK |
| 29 | `i18n.ts:2052` | OK, text as quoted; 09:43 and 09:52 agree with `i18n.ts:2051` and the ruling, sections 3 and 5 |
| 33 | `analysis/placeholder-line.ts:108-118` | OK |
| 33, 44 | `placeholder-line.ts:113` | OK |
| 41 | `i18n.ts:1436` | OK; 11:59 agrees with the ruling, section 8 |
| 42 | `i18n.ts:1431` | OK |
| 44 | `voice-pane.ts:38` | OK; see amendment 10 |
| 44 | `i18n.ts:1445` | OK; its "One" form is `:1446` |
| 44 | `placeholder-line.ts:96-103` | OK; the stated reason is `:96-97` |
| 54 | 142 and 69 characters | WRONG: 144 and 79 (amendment 6) |
| 60 | `voice/voiceTypes.ts:121` | OK, text as quoted |
| 61, 65 | `voice/chart/screen-logic.ts:77` | OK; the sentence begins on `:76` |
| 63 | grep `hasDeclaredType` returns two lines | OK: `screen-logic.ts:77`, `voiceTypes.ts:121` |
| 75 | `voiceTypes.ts:123`, `:126` | OK |
| 75 | `voiceTypes.ts:119` | OK, text as quoted |
| 76 | `voice/chart/screen-logic.ts:79-82` | OK |
| 77 | `markup/subtitle.ts:11` | OK |
| 77 | `voiceTypes.ts:140` | OK |
| 78 | `insights/identity.ts:57` | OK |
| 80, 93 | `i18n.ts:1489` | OK |
| 80, 93 | `i18n.ts:1897` | OK |
| 80 | `voiceTypes.ts:86-89` | OK |
| 82 | lane 71 brief r4 section 9 item 6 | OK; it speaks of Other's text only, the Tier 2 half is `voiceTypes.ts:132-133` |
| 93 | `voiceTypes.ts:153-157` | OK |
| 99 | `CONTRACT.md` section 4 | OK |
| 105 | `6727 passed \| 1 skipped (6728)` | OK for the scipy form (`STATE.md:19`); the other form is missing (blocker 4) |
| 110 | five files "inside the ratcheted set" | WRONG (amendment 5) |
| 122 | `voice/engine/plausibility.ts:135-142` | OK; the function closes `:143` |
| 122 | `voice/engine/stand-ins.ts:58` | OK |
| 123 | `stand-ins.ts:61` | OK |
| 123 | `stand-ins.ts:147` | WRONG: a comment line; `:163-164` (amendment 7) |

The rulings the brief dates (09:41, 09:43, 09:52, 10:08, 11:59, 14:21, 14:59, 15:00) agree with `OPEN.md:4102-4140` and the ruling file. The ruling of 18:33 is in none of them and not in the brief.

## 5. The three items against the rulings

**Item 1.** Read against the rulings the brief cites (09:41, 10:08), before the 18:33 ruling is weighed: `placeholder.borrowing` says what the pane needs for all three types, in both languages, with nothing new. `borrowingLine` fills `{type}` with the Tier 1 name and `{borrowed}` with the staff (`placeholder-line.ts:114-117`); it draws with nothing sampled and with one to four stable core vowels (pinned for 0, 1, 3, 4 at `stand-in-borrowing.test.ts:157-162`). The five published types, "Not sure", and no type keep their sentences, as the ruling's section 8 requires. No new string, no new French: confirmed, since the pane would print the function's own output. French agreement, referent checked: `{type}` follows « pour un » and the three fills are masculine (contralto, contre-ténor, baryton-basse); `{borrowed}` follows « ses valeurs de » and none of « mezzo-soprano », « basse », « mezzo et ténor » begins with a vowel letter, so no elision fires.
The pairing: on the pages the companion sentence is `placeholder.line.belowCore` or `placeholder.line.markup.belowCore` (`i18n.ts:2065`, `:2072`), in its own paragraph, after the borrowing line. The pane's companion is `calib.pane.belowCore` (`i18n.ts:1445`), shorter, same facts. The pairing is sound against the tree; its order is blocker 2, and whether the pane's sentence changes at all is blocker 1.

**Item 2.** Both comments are as quoted, and the identifier survives nowhere else. Nothing to amend.

**Item 3, the equivalence.** Worked from the lines, not run. With `placeholderFillLabel` changed to call `voiceTypePrint({ voiceType: id }, language)` at `:140`:
- Three borrowing ids, any Tier 2 label or Other's text: both return the staff (`:138`, `:125`).
- Five published ids with no Tier 2 label, each of their 23 Tier 2 labels, Other with text, Other with empty text: both return `voiceTypePrint` on the id alone, the Tier 1 label lower-cased (`:126`, `:91-96`; no Tier 1 id is in `KEEPS_CAPITAL`, `:55-58`).
- `not-sure`, with or without Other's text: both `undefined` (`:139`, `:124`).
- `undefined` choice, `{}`, `''`, and an unknown id with or without Other's text: both `undefined` (`:84`, `:124`).
The claim holds for every input the brief lists. It holds only if the changed line passes the id alone; the brief says so in words and not in code.

**Item 3, the French.** Referent checked at `i18n.ts:1489`, `:1897`, and `:2042`: each reads « une voix type de {voiceType} », the fill stands bare after « de », and no adjective, participle, or pronoun in the sentence agrees with it (« vos propres résonances » and « votre voix en particulier » do not depend on it). After the change the fills at these three sites are « soprano », « mezzo-soprano », « ténor », « baryton », « basse », and the three staff labels; none begins with a vowel letter, so the elision at `voiceTypes.ts:155` is no longer reachable from them. No agreement changes.

## 6. What the brief misses

Sites that print a voice-type label in a sentence about placeholder values, by grep of the keys and the fill functions: MELODY's subtitle (`i18n.ts:1489`), INSIGHTS' lede (`:1897`), the vowel chart's caption (`:2042`), the VOICE pane (`:1432`), the borrowing line (`:2052`), the sheet's sources note (`:2580`), and the capture hint (`:2632`). After the three items all seven fill from the Tier 1 id or the staff, and none is left inconsistent. The brief omits the caption (amendment 8). `calib.summary.outside` carries `{type}` and is retired (`voice/outside.ts:10`). `voiceTypePrint` keeps two callers on the whole choice, the identity line (`insights/identity.ts:28`) and the pane's type control (`voice-pane.ts:88`); both name the singer, not the values.

## 7. House style and load

No em dash, no exclamation mark, none of "simply", "just", "easy". Canadian spelling, ISO dates, and sentence-case headings hold. Sentences that report neither a count nor a line:
- Line 5: "so this lane is what makes that walk worth taking." A forecast (`CONTRACT.md` section 1 item 11).
- Line 15: "Items 2 and 3 are the same principle read twice more".
- Line 67: "a warning against a function that does not exist curates nothing." Delete it and no fact is lost (section 6, "No aphorisms").
- Line 44, the bold opener "The below-core state travels with it." names no line; the line it needs is `voice-pane.ts:38`.

## 8. Out of scope, worth recording

1. Dann's words of 2026-11-19 18:13 are not in `INBOX.md`. Its committed copy ends at 15:31; the two entries appended at 18:34 are his 18:27 and 18:33. `STATE.md:23` is the one record that he found item 1 (`CONTRACT.md` section 1 item 20).
2. `OPEN.md:4117` cites `stand-ins.ts:147` and `:144-147`; both have drifted. The lines are `:160` and `:163-164`.
3. The sheet's sources note and the capture hint name a borrowing type's staff and give no reason (`voice/chart/screen-logic.ts:72`, `:81`). Ratified that way at 12:01; after item 1 they are the two surfaces in VOICE that name the neighbour without the reason.
4. After item 1 a borrowing singer with one to four core vowels reads, in VOICE, "until you sample your own vowels in VOICE" after sampling some. The as-built review raised the same sentence on the pages ("For Dann's eye" 3).
5. `markup/subtitle.test.ts:14-18` is the only test that reaches `fillVoiceType`'s elision through a page function. After item 3 no page function can reach it.

## 9. What I could not establish

1. Dann's own words at 18:13, and so whether he asked for the borrowing line in the pane or for a reason in the pane. See 8.1.
1a. How item 1 stands after 18:33: kept, kept beside the picker's statement, or replaced by it. I read the `INBOX.md` entry and nothing else on it; no other file holds the ruling yet.
2. Gate 4's no-scipy figure at `ca2a4e5b`. `6723 passed | 5 skipped` is the Mac figure less the four `burg.test.ts` tests; it is not measured on this commit, and I ran nothing.
3. That step 8 of lane 71 is the commit that deleted `hasDeclaredType`. The identifier is gone and `773dfca1` is titled "step 8"; I did not read its diff.
4. Whether Playwright runs in the cloud session that takes this lane. The as-built reviewer ran it in a sandbox.
5. How the two sentences sit in `.vp-sentence` at 390 px. The brief assigns this to the lane, correctly.
6. The equivalence in item 3 as a run. It is worked from `voiceTypes.ts:82-141` by hand.
7. Any test outside `apps/web/src` and `apps/web/e2e*` that pins these sentences. The grep covered `apps/web` only; `packages/` was not searched.
8. Not reached: lane 71 brief r4 outside section 9; the as-built review lines 60-80; `QUEUE.md` beyond lines 9 and 141.
