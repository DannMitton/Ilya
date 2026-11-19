# Delta review, lane 74 brief r2: the lane 71 follow-up, and the concession at the moment of choice

Reviewer: Fable 5.2, 2026-11-19. Brief: `docs/sessions/brief-code-lane74-voice-type-followup_r2_2026-11-19.md`, md5 `013d7d1acb6b82ab5c4caf1f0c6d11c7`, read in full. Checklist: `review-fable-lane74-brief_r1_2026-11-19.md`. Tree: `Shane` at `ca2a4e5b`, read through the bridge, read-only git. `OPEN.md` and `INBOX.md` read from disk with their uncommitted appends. Paths are under `apps/web/src/lib/` unless they start elsewhere. Nothing was run: every finding is a line read.

## 1. Verdict

**SEND WITH AMENDMENTS.** No new blocker. Amendments 1 to 7 in section 5 go in before the brief is sent; 8 to 12 are the desk's call.

The ratified string is intact: r2 section 2 and `OPEN.md`'s last section are byte-identical in English and in French. Section 2's citations all hold.

r2 line 5 says of the r1 findings "all are applied". That is not what the text holds. Of the four blockers, three are repaired and one is repaired in part. Of the seven further amendments, four are applied, two in part, and one not at all.

## 2. R1 blockers

| r1 | Status | Proof |
|---|---|---|
| 1. Item 1 predates the 18:33 ruling | APPLIED | `OPEN.md:4142` now homes the ruling. r2 line 15 cites it, and line 72 says how item 1 stands: "the picker's note is read once at the moment of choosing, and the pane's sentence is what a returning singer reads." `OPEN.md` records that as "DESK DEFAULT, Dann's to overrule". r2 line 72 does not carry the DESK DEFAULT mark (amendment 11). |
| 2. The pane's order against the pages' order | APPLIED | r2 line 89: "the borrowing line comes FIRST ... `markup/MarkupPane.svelte:996` puts `borrowingLine(...)` before `placeholderNote` ... `insights/InsightsPane.svelte:503` puts it before `placeholderLine(...)`. Both orders are pinned at `stand-in-borrowing.test.ts:171-172`." All three read and true. The repair dropped r1's "one space between them", so the join is now unstated (amendment 3). |
| 3. No list of tests turned red; one outside the gates; the "must not" sentence | APPLIED IN PART | Section 6 lists six sites; all six verified (section 5 of this review, D). The "must not" sentence (r2 line 101) no longer forbids the repair. Two parts are missing: r2 nowhere says Playwright is outside the eight gates or tells Code to run `e2e/voice-pane.test.ts`, so `:95` can be edited and never run; and `stand-in-borrowing.test.ts:14`, `:107`, `:123` (the import and two calls of `placeholderFillLabel`) are not in the list, though the collapse retires that name (amendment 6). |
| 4. One gate 4 baseline of two | APPLIED | r2 line 176 carries both, cites `ENVIRONMENT.md:5547-5552`, and says the second "is DERIVED by the desk from the first, not measured at this commit." Step 7 still reads "All eight gates at baseline", which a session that has added tests cannot meet (amendment 7). |

## 3. R1 amendments (4 to 10; 1 to 3 repaired the blockers above)

| r1 | Status | Proof |
|---|---|---|
| 4. `paneSentence` has no formants | APPLIED | r2 lines 93-97: `i.core.length >= PERSONAL_CORE_MIN` is the same test as `isPersonal`. Holds: `sung.ts:33`, `:41`; `voice-pane.ts:22`. The check r2 line 95 asks of Code resolves: `routes/+page.svelte:4187` passes `core={stableCore(voiceFormants)}`. |
| 5. None of the five files has a ceiling | APPLIED, now stale | r2 line 183 is true of the five. Item 4 adds files it does not name (amendment 7). |
| 6. Character counts | APPLIED | r2 line 105: "144 characters against `calib.pane.typedGeneric`'s 79". |
| 7. `stand-ins.ts:147` | APPLIED | r2 line 198: "`stand-ins.ts:61` and `:163-164`". Read: `:163` `standInBucket(voiceType)`, `:164` `template(bucket)`. |
| 8. Item 3's third sentence, the 23 labels, DESK DEFAULT mark | APPLIED IN PART | The caption is in (line 128), `:2042` is in the French check (line 145), the 23 labels are in the equivalence check (line 140). Not applied: "What the singer reads after it" names the bass alone; step 5 tests the bass alone; line 136 still rests on "his ruling of 14:59 on the desk's decision rights inside N.204", and `OPEN.md:4136` scopes that right "INSIDE N.204" (amendment 8). |
| 9. The collapse and its stale comments | APPLIED IN PART | The survivor is named (line 138). The comment list is replaced by "Six comments reference `placeholderFillLabel` by name", and the tree holds three (amendment 5). No grep-to-zero check. |
| 10. Below core starts at zero | NOT APPLIED | r2 line 89 still reads "A borrowing type with one to four stable core vowels takes the `below-core` branch at `voice-pane.ts:38`". The branch is `usable >= 1 && core.length < 5` (`voice-pane.ts:36-38`). Step 5 has no case for one hard vowel and no core vowel (amendment 4). |

## 4. New blockers in r2

None.

## 5. New amendments

Required before sending: 1 to 7.

1. **The apostrophe: the brief quotes one character and names another.** r2 line 44: "In the French, the apostrophes are U+2019". The French has one apostrophe, in « n'a », and its byte in r2 line 42 and in `OPEN.md` is `27` (U+0027). "Character for character" and "U+2019" give Code two different strings to store and pin. Change the sentence to: "The French has one apostrophe, in « n'a ». It is typed U+0027 in this brief and in `OPEN.md`; store it as `’`, as `i18n.ts:2052` stores the same clause. There is no colon, so no no-break space is needed."

2. **The pure function's home is unnamed, and the obvious home breaks gate 8.** r2 line 52: "Write a sibling pure function". A sibling of `borrowingLine` sits in `analysis/placeholder-line.ts`. Both pickers are under `voice/`, and `voice` may import only `reader` and `score` (`scripts/ratchets.mjs:78-81`; `.svelte` files and tests are checked, `:36` and the header's rule 4). Add after that sentence: "It lives in `voice/voiceTypes.ts`: `voice` may not import `analysis` (`scripts/ratchets.mjs:78-81`), and everything it calls is already in that file (`t`, `voiceTypePrint`, `borrowedStaffLabel`, `fillVoiceType`, `isBorrowingType`)."

3. **The join of the two sentences below core is unstated.** r2 line 89 gives the order and no separator; `paneSentence` returns one string into one `<p class="vp-sentence">` (`VoicePane.svelte:121`), and section 6 row 2 needs an exact `toBe`. r1 said "one space between them". Add to line 89, after "The pane follows the pages.": "`paneSentence` returns one string: the borrowing line, <the desk's separator>, then the below-core sentence." The desk fills the blank.

4. **(r1 amendment 10.)** Line 89, change "A borrowing type with one to four stable core vowels takes" to "A borrowing type with anything sung and fewer than five stable core vowels (zero to four; `voice-pane.ts:36-38`) takes". Step 5, change "with nothing sampled and with three stable core vowels" to "with nothing sampled, with one hard vowel and no core vowel sampled, and with three stable core vowels".

5. **Three comment lines name `placeholderFillLabel`, not six.** `grep -rn placeholderFillLabel apps/web/src` returns eleven lines: three comments (`markup/subtitle.ts:4`, `insights/identity.ts:55`, `i18n.ts:1896`), five of code (`subtitle.ts:8`, `:11`; `identity.ts:12`, `:57`; `voiceTypes.ts:136`), and three in `stand-in-borrowing.test.ts` (`:14`, `:107`, `:123`). Line 138, change "Six comments reference `placeholderFillLabel` by name; find them with a grep and repair each, do not leave them stale." to "Three comment lines name `placeholderFillLabel` (`markup/subtitle.ts:4`, `insights/identity.ts:55`, `i18n.ts:1896`), and three more describe the rule this step changes without naming it (`voice/voiceTypes.ts:116-121` and `:129-135`; `insights/identity.ts:48`). Repair each. The survivor takes the Tier 1 id, so `subtitle.ts:11` and `identity.ts:57` pass `voiceType?.voiceType`. `placeholderLabel` (`identity.ts:56`) is a different function and stays. After the step, `grep -rn placeholderFillLabel apps/web` returns nothing; report the count."

6. **Section 6 misses three sites and the Playwright gap.** Add a row: "`lib/stand-in-borrowing.test.ts` | `:14`, `:107`, `:123` | imports and calls `placeholderFillLabel`. The collapse retires the name; repoint each to `borrowedStaffLabel` on the Tier 1 id." In the `subtitle.test.ts` row, change "so move the pin onto `fillVoiceType` directly rather than dropping it" to "and it stays pinned on `fillVoiceType` at `voice/voiceTypes.test.ts:163-168` and through the caption at `insights/singer-blocks.test.ts:233`, so pin « de basse » here and add nothing there". Add under the table: "Playwright is not one of the eight gates. Run `e2e/voice-pane.test.ts` and `e2e/insights-no-score.test.ts` after step 5 and report the counts. If the session cannot run Playwright, say so under section 9; the 390 px renders of step 6 need a browser too."

7. **Step 7 is stale in two places.** Change "All eight gates at baseline." to "All eight gates. Gate 4 rises by the tests this lane adds; report the old and new strings in both forms." Change "none of the five changed files has a ceiling ... so no ceiling moves for them" to "none of `voice-pane.ts`, `voiceTypes.ts`, `screen-logic.ts`, `subtitle.ts`, `identity.ts`, `VoiceTypeIntake.svelte` (213 lines), or `VoiceTypeFirst.svelte` (90) has a ceiling in `scripts/ratchets.json`, and `i18n.ts` is exempt there. Two neighbours have no room: `insights/InsightsPane.svelte` is 677 lines against a ceiling of 677, and `voice/CalibrationWizard.svelte` is 1124 against 1126. This lane has no reason to add a line to either."

8. **(r1 amendment 8, the unapplied part.)** Item 3 changes what every singer of the five published types with a finer label reads, not one bass. Add to "What the singer reads after it": "Every Tier 2 label of the five published types stops reaching these three sentences, 23 labels (`voiceTypes.ts:35-42`), and so does Other's text for those five: a lyric soprano reads 'a generic soprano', a Heldentenor 'a generic tenor'. The identity line still prints the singer's own label (`insights/identity.ts:28`)." Step 5, change "for a bass with each of its Tier 2 labels and with Other text" to "for each of the five published types with each of its Tier 2 labels and with Other text". Line 136, mark the item "DESK DEFAULT, Dann's to overrule"; the 14:59 right is recorded as inside N.204 (`OPEN.md:4136`).

9. **A quotation that is not his words.** r2 line 34 quotes *"I ratify both the french and the english"*. `INBOX.md`, 18:36, transcribed as written, holds "Iratify both the frrench and the english". Drop the quotation marks and write "ratified both in one message (`INBOX.md`, 18:36)".

10. **Whether the note is announced is unstated.** The note appears on selection. The wizard's welcome phase has no live region (`CalibrationWizard.svelte:794`; the readiness phase has one at `:814`), and neither picker has one beyond `SavedNote`. A screen-reader user who picks contralto hears nothing. Add to "When it shows" one line, DESK DEFAULT: whether the note is a live region, yes or no. The desk names it.

11. **The same sentence twice on one screen is not measured.** With the Voice type station open, a contralto reads the picker's note (`VoicePane.svelte:85`) and the pane's sentence (`:121`), and both open "The field has not yet published resonance values for a contralto". Add to step 6: "one render of the VOICE pane at 390 px with the Voice type station open for a contralto with nothing sampled, English, where the note and the sentence both show". Mark r2 line 72 "DESK DEFAULT, Dann's to overrule", as `OPEN.md` does.

12. **The note's style is a desk choice without its mark.** r2 line 64 gives it `.vt-hint` (`VoiceTypeIntake.svelte:159-165`: `--ink-tertiary`, 0.8125rem). Mark it DESK DEFAULT. `VoiceTypeFirst.svelte` has its own copy of the recipe at `:62-68`; cite it so Code does not import a class across files.

## 6. Section 2, the new item

**The ratified string, character for character.** The English line of r2 (line 38) and of `OPEN.md`'s last section are equal as shell strings, 186 bytes with the newline, no non-ASCII byte. The French lines (r2 line 42) are equal, 228 bytes; the non-ASCII bytes are three « é » and one « à », no U+00A0, no U+2019. No drift. The one defect is r2's sentence about the apostrophe (amendment 1).

**Provenance.** "The field has not yet published resonance values for a {type}" and its French: `i18n.ts:2052`, verbatim to the full stop. "record your vowels in vocal fry and Ilya works from your own voice" and « capter vos voyelles en friture vocale et Ilya travaille à partir de votre propre voix »: `i18n.ts:1436`, the verb moved from imperative to infinitive after « vous pouvez ». "the {borrowed} staff" and « la portée de {borrowed} »: `i18n.ts:2580`. Holds.

**Citations in section 2.** All true at `ca2a4e5b`: `voiceTypes.ts:19-29`, `:111-113`, `:153-157`; `VoiceTypeIntake.svelte:67-78`, `:74`, `:78`, `:79-83`, `:159-165`; `VoiceTypeFirst.svelte:30-36`, `:32`, `:36`, `:40-41`, `:69-75`; `VoicePane.svelte:85`; `CalibrationWizard.svelte:810`; `placeholder-line.ts:113`, `:114-117`; `i18n.ts:1436`, `:1450`, `:2052`, `:2580`. `voiceType.heading` and `voiceType.hint` are `i18n.ts:2260-2261`; no key `voiceType.borrowing` exists. Only the two pickers use `TIER1` outside `voiceTypes.ts`, so there is no third picker.

**The fills, worked from `voiceTypes.ts:82-127` and `i18n.ts:2266-2277`, not run.**

| id | `{type}` en / fr | `{borrowed}` en / fr |
|---|---|---|
| contralto | contralto / contralto | mezzo-soprano / mezzo-soprano |
| countertenor | countertenor / contre-ténor | mezzo and tenor / mezzo et ténor |
| bass-baritone | bass-baritone / baryton-basse | bass / basse |

English reads "for a contralto ... the mezzo-soprano staff", "for a countertenor ... the mezzo and tenor staff", "for a bass-baritone ... the bass staff". "a" is right before all three. In French no fill begins with a vowel letter, so `fillVoiceType`'s elision (`:155`) does not fire, and `{type}` follows « un », not « de ». Each token occurs once, which `String.replace` needs (`:156`).

**French agreement (`CONTRACT.md` section 7), referent named for each.**
- « un {type} »: referent the fill. Contralto, contre-ténor, baryton-basse are masculine as `placeholder.borrowing` already prints them, pinned at `stand-in-borrowing.test.ts:181-183`. Holds.
- « publié »: with « avoir », its object « de valeurs » follows it. Invariable. Holds.
- « la portée de {borrowed} »: « portée » feminine singular with « la ». Nothing agrees with the fill, which stands bare after « de ». Holds.
- « friture vocale »: « vocale » agrees with « friture », feminine singular. Holds.
- « vos voyelles », « votre propre voix »: possessives agree with « voyelles » (plural) and « voix » (singular). Holds.
- « Ilya peut », « Ilya travaille », « vous pouvez capter »: subject and verb agree. Holds.
Nothing wrong found. Nothing drafted.

**Placement in `VoiceTypeFirst.svelte`.** Below `.vt-choices` and inside the `fieldset` is sound: the `fieldset` is a flex column (`:46-48`), so the note takes the full 22rem width under the grid, and the grid's column flow (`:73`) never places it. The picker stays on screen after the choice: `askTypeFirst` is latched by an effect that reads `voiceType` untracked (`CalibrationWizard.svelte:333-334`), so choosing does not remove the question. The comment at `:40-41` says two columns exist so nine choices "do not push Begin off a phone screen". The grid saves four rows; the note is 186 characters in English and longer in French at the same type size, so it plausibly spends about what the grid saved. That is an estimate, not a measurement, and r2 line 68 rightly has the lane measure it. Begin (`:811`) moves down under the singer's finger when the note appears; r2 asks for the report and no redesign, which is consistent with "do not block the singer".

**Placement in `VoiceTypeIntake.svelte`.** After `:78`, before `:79`, inside the first `fieldset`. Sound.

**Tests that pin the picker markup.** None. No test reads either `.svelte` file; `e2e/voice-pane.test.ts` reaches the radios by role and the sentence by `.vp-sentence` (`:25`); `e2e-phone/voice-stations.test.ts` seeds a bass (`:50`), for whom no note shows. `voice/chart/ratified-strings.test.ts:108-109` pins `calib.voiceTypeFirst.hint`, which this lane does not touch.

**Section 6, verified row by row (D).** `voice-pane.test.ts:16-18`: true. `:81-86`: true, the loop is `:81-88`. `stand-in-borrowing.test.ts:85-86`, `:87`: true. `:241-255`, `:250`: true. `subtitle.test.ts:14-18`: true. `e2e/voice-pane.test.ts:95` and `:91`: true. Missed: `stand-in-borrowing.test.ts:14`, `:107`, `:123` (amendment 6). Checked and unaffected: `insights/identity.test.ts:104-146` (no Tier 2 label on a published type), `insights/singer-blocks.test.ts:232-236` (label passed in directly), `e2e/insights-no-score.test.ts:66-72` (scoped to `.insights-container`), `stand-in-borrowing.test.ts` tests 9 and 12.

## 7. Out of scope, worth recording

1. `OPEN.md`'s last section quotes the ratification as *"I ratify both the french and the english"*, "transcribed as written". `INBOX.md` 18:36 holds different characters. The same section says the strings were "put to him 2026-11-19 18:4x" and ratified at 18:36.
2. Dann's words of 18:13 are still not in `INBOX.md`; the appends are 18:27, 18:33, and 18:36. r2 line 72 rests on them.
3. After item 4 the picker's note sits beside `voiceType.hint`, and in the wizard beside `calib.voiceTypeFirst.hint` ("Ilya can use generic values with your guidance"), ratified 2026-11-17. For a borrowing type the hint's "generic values" and the note's "the mezzo-soprano staff" describe one thing in two vocabularies.
4. After item 3 no page function reaches `fillVoiceType`'s elision with `voiceType`; the unit pin and the caption's direct-label pin remain.

## 8. What I could not establish

1. Which apostrophe Dann saw when he ratified the French. The records hold U+0027; the house stores U+2019.
2. Any pixel height, and whether the note pushes Begin off a 390 px screen. Nothing was rendered.
3. Whether `--ink-tertiary` at 0.8125rem meets contrast for a sentence Dann ruled paramount.
4. Gate 4's no-scipy figure at `ca2a4e5b`; still derived.
5. Whether Playwright runs in the cloud session.
6. The equivalence of item 3 as a run; worked by hand in r1, not re-worked here.
7. Whether anything outside `apps/web/src`, `apps/web/e2e`, and `apps/web/e2e-phone` names `placeholderFillLabel`; `packages/` and `docs/` were not searched.
8. Not re-read: r2 sections 4 and 10 beyond their cited lines; `CONTRACT.md` (relied on the r1 reading of sections 1, 4, and 7).
