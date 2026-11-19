# Fable review, lane 71 brief r1
VERDICT: DO NOT SEND
Blockers: 4. Amendments: 19.

Reviewed: `docs/sessions/brief-code-lane71-voice-type-stand-ins_r1_2026-11-19.md` (md5 `86bba51257e8c755b43abacdd93b425c`, confirmed) against `docs/sessions/ratified-voice-type-stand-ins_2026-11-19.md` (md5 `8153b0de145c87b5ec4c12a4a829fbb4`, confirmed) and the tree at `Shane` `b79e33e9`. Paths below are under `apps/web/src/lib/` unless they begin with `e2e/` or `docs/`. Every line cited was read in this session.

The brief's citations are almost all exact, and its count of readers of `AdaptedProfile.generic` holds. The blockers are elsewhere: one label route the brief describes incompletely, five strings the lane is sent without, one instruction the lane cannot satisfy, and two sentences that reach the voice type by a route other than `generic`.

## Blockers

1. **Other's typed text passes through the borrowed label, so "Not sure" and the borrowing types can still fill `{voiceType}` with a name the values do not belong to.**
   - Where: `voice/voiceTypes.ts:86-89` returns Other's typed text before the "Not sure" test at `:90`. The brief's section 3, fact 2, says "`voiceTypePrint:90` returns `undefined` for `not-sure`". That is true only when no Other text is typed. `voice/voiceTypes.test.ts:112` and `insights/identity.test.ts:36` pin the case where it returns the text ("Russian Bass" under "Not sure").
   - The brief's section 3 defines `borrowedStaffLabel` for the three borrowing types and for "the five published types", and gives no return value for "Not sure". Section 4.3 relies on the label being undefined for "Not sure" ("`:337`'s own else branch"). Fact 1 says the helper discards "the singer's Tier 2 label"; Other's text is not a Tier 2 label in the code (`voiceTypes.ts:47`, `:86`).
   - What the lane could build: a singer on "Not sure" with Other text "Russian Bass" reads "Resonance profile: placeholder values for a generic Russian Bass" (`markup/subtitle.ts:11-12`), the same in the lede (`insights/identity.ts:51-52`) and the chart caption (`insights/singer-blocks.ts:337`), over the averaged profile. A contralto with Other text reads the typed text if the lane reads "Tier 2 label" narrowly.
   - Repair: state in section 3 that `borrowedStaffLabel` returns `undefined` for `not-sure` whatever Other holds, and the fixed staff label for the three borrowing types whatever Tier 2 or Other holds. Add both cases to section 7.

2. **Step 1 opens the gate while five strings are still drafts, and the brief gives the lane no instruction for the interval.**
   - Where: brief section 6 lists the five; section 2 step 1 widens the list first. The lane "does NOT invent them" and waits for an amendment that has no gate attached to it.
   - What the lane could build, if it finishes before the amendment lands or reports done without it: for a contralto, "Method: computed from placeholder values for your voice type" (`i18n.ts:1897`, `:1898`), "Method: from generic values for your voice type" (`i18n.ts:1905`), and "The forecast uses placeholder values for your voice type." (`i18n.ts:1075`), each over a mezzo's values. For "Not sure", `calib.pane.notSure` (`i18n.ts:1434`) still says the profile is built from the singer's own vowels, and INSIGHTS prints no lede at all, because `insights/identity.ts:52` returns null when the label is undefined.
   - Repair, either one: (a) put the five drafts to Dann before sending and send the brief with their ratified text; or (b) keep the order and add a hard stop: the lane does not report done and nothing merges until the amendment is applied, enforced by a test that fails while any of `i18n.ts:1897`, `:1898`, `:1905`, `:1075` contains "your voice type" or « votre type de voix », and while `calib.pane.notSure` equals today's text.

3. **Section 4.7 gives two instructions that cannot both be met, and does not say when the line draws.**
   - Where: brief section 4.7 says the ruling's two lines "go in verbatim" and also "Do not repeat the remedy: the existing placeholder line already carries it". Both ratified lines carry the remedy themselves: "until you sample your own vowels in VOICE" (ruling `:58-59`) and "the moment you sample them in VOICE" (ruling `:71-72`). The existing line carries "until you sample them in vocal fry, which you can do anytime through the DRAWER on the left" (`i18n.ts:2057`).
   - `analysis/placeholder-line.ts:66-78` takes vowels, language, page, and stored readings. It has no voice type and no `generic`. It returns null when the vowel list is empty (`:76`), and it returns the below-core sentence in place of the placeholder line once anything is sung and the voice is not yet personal (`:73-75`). The brief names none of this.
   - What the lane could build: a ratified string with its remedy clause cut, which the ruling does not allow; or a page that names the remedy twice with two different surface names; or a line that never draws on a page whose vowel list is empty.
   - Repair: say that both ratified strings go in whole and that "do not repeat" means no further remedy sentence is added. State the draw condition as a rule (`generic` true and the declared type is one of the four). State whether `placeholder.line.many` still prints beside the new line in that state; that choice is taste and is Dann's. This is where DESK DEFAULT 3 meets the ruling, so it is a blocker under the review's rule 3.

4. **Two ratified sentences say "your voice type" over borrowed values and reach the type without passing through `generic`. The brief names neither, and the lane widens the reach of one.**
   - `i18n.ts:2569` `sheet.provenance`, drawn at `voice/chart/VowelSpaceSheet.svelte:163`: "Placeholder values: the centre of each zone for the first resonance, and Mitton (2020), Table 5.3, scaled to your voice type, for the second." The sheet opens from `components/Drawer/VoicePane.svelte:124` through `showVowelSpaceDoor` (`components/Drawer/voice-pane.ts:81-83`), which reads `hasPlaceholderProfile`. After step 1 the door shows for all four types with nothing stored, so a contralto who has sung nothing reaches this sentence. Pinned at `voice/chart/ratified-strings.test.ts:29`.
   - `i18n.ts:2619` `capture.hint.placed.typed`, chosen at `voice/chart/screen-logic.ts:63`: "Ilya has placed {v} from your voice type for now." `hasDeclaredType` (`screen-logic.ts:30`) is true for contralto, countertenor, and bass-baritone. Drawn at `voice/VowelCapture.svelte:220`. Pinned at `voice/chart/ratified-strings.test.ts:70`. This one is reachable today, with or without the lane.
   - What the lane would build: the gate open, the nine sites repaired, and these two still telling a contralto the placement came from her own type.
   - Repair: add both to the brief's section 6 sheet as drafts for Dann, or have Dann rule them out of this lane in words. Both are ratified strings, so the lane cannot reword them on its own.
   - Limit of this finding: that the chart's placeholders come from `standInBucket(voiceType)` rests on `voice/engine/stand-ins.ts:147` and on the header comment at `voice/engine/resolve-values.ts:17-18`. I did not read the chart's own call.

## Amendments

1. Section 2: "`tenor-mezzo` counted twice (`:92`)" reads `:91` in the tree; a one-line drift.
2. Section 2, step 1: name every comment the widening makes stale, since the brief names one. `voice/engine/resolve-values.ts:14-18` and `:148-152`; `analysis/analyze-score-adapter.ts:66-71`; `insights/identity.ts:55` and `:63-64`; `insights/singer-blocks.ts:116`; `components/Drawer/voice-pane.ts:77-79`; `i18n.ts:1894` ("one of five types") and `:1903`; reason: the lane otherwise leaves the tree describing the old rule.
3. Section 3: say what fills `{type}` in the ruling's templated line. The ruling's French holds "because contralto, contre-ténor, and baryton-basse are all masculine" (ruling `:144-145`), which fits the Tier 1 name only; a Tier 2 label such as haute-contre (`voiceTypes.ts:38`) or Other's text would break « pour un {type} ». State: `{type}` is the Tier 1 name.
4. Section 3: `fillVoiceType` replaces the literal tokens `de {voiceType}` and `{voiceType}` (`voiceTypes.ts:109-110`). It cannot fill `{type}` or `{borrowed}` as written. Say whether the lane generalizes the helper or fills the new line another way; reason: "route `{borrowed}` through the same helper" is not possible on today's helper.
5. Sections 3 and 4.6: give `borrowedStaffLabel`'s parameter type. The VOICE pane passes the Tier 1 id alone on purpose (`voice-pane.ts:65-66`: "The type's own name, not a finer label"). If 4.6 passes the full choice, a bass who chose octavist reads "a octavist voice". State that 4.6 keeps the Tier 1 call.
6. Section 4.6 and section 7: list every test the lane breaks, since the brief names one. `components/Drawer/voice-pane.test.ts:15`, `:35` (asserts « une voix de contre-ténor », which is `typedNone`'s French), and `:126`; `e2e/voice-pane.test.ts:94-95`; `e2e/insights-no-score.test.ts:55-62`; `insights/identity.test.ts:68` and `:96`; `voice/engine/resolve-values.test.ts:14-22`; `analysis/stand-ins-snapshot.test.ts:37-42`, `:72-80`, and `:100-101`. Reason: "Remove nothing else from that file without saying so" reads as if `:15` were the only one.
7. Section 4.6: name `showVowelSpaceDoor` (`voice-pane.ts:81-83`) as a tenth reader of the list, and state the outcome as a DESK DEFAULT: "Your vowel space" now shows for all nine types with nothing stored. Its comment at `:77-79` records the earlier default (review amendment 9) that this reverses.
8. Section 4.6 and DESK DEFAULT 4: `i18n.ts:1437` records this file's convention for retired strings: "Kept and marked in place, with their ratified French, the way this file's other retired strings are." Either keep `calib.pane.typedNone` marked unused, or say the lane departs from the convention and why.
9. Section 4.7: cite the two call sites, `insights/InsightsPane.svelte:503` and `markup/MarkupPane.svelte:736`, and a precedent for a line that ends in a link (`insights/InsightsPane.svelte:294`, the L4 link after the generic Method lines). `placeholderLine` returns a plain string; the brief asks for a link and does not say how one is drawn.
10. Section 4.7, one question for Dann: a contralto who has sung one to four core vowels is no longer `generic`, yet her unsung vowels still take the mezzo and tenor staff unscaled (`voice/engine/stand-ins.ts:147`), and the page shows the below-core sentence, which names no borrowing (`placeholder-line.ts:73-75`). The ratified Guide passage says Ilya "says so on the page every time" (ruling `:98`). The brief needs his answer before it sends.
11. Section 4.9: give the path. The Guide is `components/Reading/GuideContent.svelte`; the only placeholder material my grep found there is one sentence in the MELODY notation paragraph, `:395` (English) and `:91` (French). Say where the passage sits and what anchor the link targets; reason: "beside the existing placeholder material" points at half a sentence.
12. Sections 4.9 and 10.1, to surface to Dann without reopening: the ratified Guide passage says "If you have not named a type, Ilya starts from the middle of its five staves" (ruling `:101`). Under DESK DEFAULT 1 a singer with no type and nothing sung gets no starting profile on MELODY or INSIGHTS. The lane leaves the passage verbatim; the desk tells Dann the two meet here.
13. Section 7, fourth test: as worded it fails on the brief's own section 4.7, whose ratified line prints the declared type on purpose ("for a {type}"). Reword: the declared name appears in none of the `{voiceType}` fills, and the section 3 line contains both the declared name and the borrowed one.
14. Section 7: add the tests listed under "Defects no test in section 7 would catch", below.
15. Sections 4.1 to 4.3 and 4.6, for the sheet to Dann: show him the countertenor's reading of the four existing strings, since French and taste are his. "placeholder values for a generic mezzo and tenor"; "generic values for a mezzo and tenor voice"; "turns in a generic mezzo and tenor"; « une voix type de mezzo et ténor ». The ruling ratified "mezzo and tenor" inside "its {borrowed} values"; its section 6 example shows the mezzo-soprano fill only.
16. Section 4.7 and 4.9, typography: the ruling's English uses the straight apostrophe ("Ilya's", ruling `:169`); the tree's English strings use U+2019 (`i18n.ts:1341`; `voice/chart/ratified-strings.test.ts:7`). The ruling's French carries U+2019 and one no-break space before the colon (ruling `:132`), and wraps each French line in outer guillemets that are the document's quotation, not the string. Say which characters "verbatim" means.
17. Section 8: `analysis/adapter-grid.ts:35` runs the four types through the adapter golden (`analysis/adapter-golden.test.ts`, `analysis/__golden__/adapter-snapshots.json`). The golden moves for them. Tell the lane to regenerate it on purpose and report the rows that changed.
18. Section 4.4: "`noScore.none` ... now only for a singer with no voice type at all" leaves out an id this build does not know, which also stays non-generic (`analysis/stand-ins-snapshot.test.ts:72`, 'other-text'). One clause.
19. Section 5, the table: `markup/legend.ts:107` is a comment; the reader is `markup/MarkupPane.svelte:866` (`filledHeads: !adapted.generic`), which the table omits. Add the two readers of `completeness.formants`, `insights/InsightsPane.svelte:204` and `markup/MarkupPane.svelte:831`: that flag turns true for the four (`analysis/stand-ins-snapshot.test.ts:78` pins it false today), and it is how the pages stop withholding.

### The four DESK DEFAULTS against the ruling

| default | ruling |
|---|---|
| 1. No voice type, no starting profile | Supports. "all nine types join the list" (ruling `:45`) and Dann 09:13, "a generic profile that they select" (`:48-49`). One tension at `:101`; amendment 12. |
| 2. `borrowedStaffLabel` beside `voiceTypePrint`, discarding Tier 2 for the three | Supports the discard: "the fill is the staff the values came from, not the declared type" (`:164-165`). Silent on where the helper lives. Incomplete on Other's text; blocker 1. |
| 3. Section 3 lines drawn by `placeholderLine`, on MELODY and INSIGHTS, remedy not repeated | Supports "on the page" (`:13-14`). Silent on which function. The remedy clause cuts against the verbatim strings, which carry the remedy; blocker 3. |
| 4. `typed-none` and `calib.pane.typedNone` removed | Silent. The state's removal is safe. The string's removal departs from the file's convention; amendment 8. |

### Verbatim strings the brief quotes from the ruling

All agree, character for character, with the ruling: "Resonance profile: an average of Ilya's five voice types, not yet your own resonances." (ruling `:169-170`); the three English fills (`:62-63`); the three French fills (`:125`); "Why these values" (`:86`) and « Pourquoi ces valeurs » (`:124`); "averages its five voice types" (`:70`); "Nineteen sources were read in full" (`:96-97`); "a generic profile that they select" (`:49`); the 10:08 principle (`:161-162`). No mismatch found. The brief does not reproduce the section 3 and section 5 lines or the Guide passage; it sends the lane to the ruling for them, so their fidelity rests on amendment 16.

### Removing `typed-none` and `calib.pane.typedNone`: everything the grep found

- `components/Drawer/voice-pane.ts:33` (the type), `:43` (the return), `:49` (the key), `:64` (the branch).
- `i18n.ts:1433` (the string).
- `components/Drawer/voice-pane.test.ts:15` (the case), and `:35`, which asserts the string's French wording without naming the key.
- `e2e/voice-pane.test.ts:94` (the English text), with `:95` asserting the door is absent.
- No Svelte file references the state or the key. `VoicePane.svelte` takes the sentence from `paneSentence`.
- After step 1 the state is unreachable, as the brief says: `voice-pane.ts:41` sends a non-Tier-1 id to `none`, `:42` sends `not-sure` to `not-sure`, and `:43` is then true for the other eight.

### Defects no test in section 7 would catch

1. "Not sure" with Other text filling `{voiceType}` (blocker 1).
2. A borrowing type with Other text or a countertenor's Tier 2 label (sopranist, haute-contre) filling `{voiceType}`; the fourth test checks only for the declared type's own name.
3. The tokenless strings left as they are (blocker 2): the fourth test passes on "your voice type", because the declared name is absent from it.
4. "Not sure" receiving no sentence at a site: no test asserts that the subtitle, the lede, and the VOICE pane each print their "Not sure" sentence, or that the caption falls back.
5. The section 3 line added as keys and never drawn: no test asserts it appears on MELODY and on INSIGHTS for a contralto, and does not appear for a bass.
6. `{type}` filled with a Tier 2 label, breaking the French gender (amendment 3).
7. A regression for the five published types: a bass with a finer label in the VOICE pane (amendment 5).
8. The French of every borrowed fill; section 7 names no language.
9. The Guide passage, English and French, matching the ruling.
10. The two sentences of blocker 4, and the vowel space door now showing for the four.
11. One page disagreeing with itself: no test renders one page for a contralto and reads all of its sentences together, which is the defect the brief's section 5 says the lane exists to prevent.

## Citations checked

| brief's citation | the tree reads | result |
|---|---|---|
| `voice/voiceTypes.ts:19-29` `TIER1`, nine ids in the stated order | as stated | agree |
| `voice/voiceTypes.ts:82-97` `voiceTypePrint` | as stated | agree |
| `voiceTypePrint:91-94` returns the Tier 2 label | as stated | agree |
| `voiceTypePrint:90` returns undefined for `not-sure` | true only without Other text; `:86-89` return first | incomplete; blocker 1 |
| `voice/voiceTypes.ts:108-111` `fillVoiceType` elides « de » | as stated; the token is the literal `{voiceType}` | agree; amendment 4 |
| `voice/engine/stand-ins.ts:73` `PLACEHOLDER_PROFILE_TYPES`, five ids | as stated | agree |
| `stand-ins.ts:66-72` comment, "left out on purpose ... until row 167 rules their staves" | comment block is `:64-72`; the words are at `:67-69` | agree |
| `stand-ins.ts:55-62` `standInBucket` maps all nine | as stated | agree |
| `stand-ins.ts:52` "COUNTERTENOR BY THE TRACT: DESK INFERENCE" | as stated | agree |
| `stand-ins.ts:89-96` `template` | function is `:89-98` | agree |
| `stand-ins.ts:92` `tenor-mezzo` counted twice | the `five` array is at `:91` | drift; `:91` |
| `voice/engine/resolve-values.ts:154` the gate | as quoted | agree |
| `markup/subtitle.ts:10-13`, fill at `:11` | function `:10-14`; `:11` as stated | agree |
| `markup/MarkupPane.svelte:552` | `profileSubtitle({ generic: adapted.generic, ... })` | agree |
| `i18n.ts:1487` `profile.subtitlePlaceholder` | English as quoted | agree |
| `insights/identity.ts:50-53` `genericLede`, `:52` | as stated | agree |
| `insights/identity.ts:56-58` `placeholderLabel` | as stated | agree |
| `insights/InsightsPane.svelte:503` | `genericLede(adapted.generic && !!model, ...)` | agree |
| `i18n.ts:1895` `insights.generic.lede` | present, carries `{voiceType}` | agree |
| `insights/singer-blocks.ts:337` and its else branch | as stated | agree |
| `insights/InsightsPane.svelte:373` | `voiceTypeLabel: placeholderLabel(...)` | agree |
| `i18n.ts:2040` `insights.r2.vowels.against.generic` | English as quoted | agree |
| `insights/identity.ts:66-70` `methodLineKey`, `:68-69` | as stated | agree |
| `insights/InsightsPane.svelte:292` | `methodLineKey({...})` | agree |
| `i18n.ts:1897`, `:1898`, `:1905` | English as quoted | agree |
| `i18n.ts:1906` `insights.method.noScore.none` | present | agree |
| `insights/identity.ts:64` comment lists the four and no type | as stated | agree |
| `analysis/analyze-score-adapter.ts:188-196` `composeBroadNote`, `:195` | as stated | agree |
| `analysis/analyze-score-adapter.ts:183-195` (table) | `:183` opens the row 166 comment | agree |
| `markup/MarkupPane.svelte:846` | `composeBroadNote(adapted.completeness, language, adapted.generic)` | agree |
| `i18n.ts:1075` `analysis.broad.body.generic` | closing sentence as quoted | agree |
| `components/Drawer/voice-pane.ts:38-43` `paneState` | function is `:35-44` | agree |
| `voice-pane.ts:43`, `:41`, `:42` | as quoted | agree |
| `voice-pane.ts:48`, `:49`, `:50`, `:64` | as stated | agree |
| `i18n.ts:1432`, `:1433`, `:1434` | English as quoted | agree |
| `components/Drawer/voice-pane.test.ts:15` | the contralto case, `typed-none` | agree |
| `analysis/placeholder-line.ts:66` `placeholderLine` | as stated | agree |
| `i18n.ts:2057-2068` the placeholder lines | `:2057`, `:2065`, `:2068` read; they are placeholder lines | agree |
| `markup/legend.ts:107` | a comment on `filledHeads`; the reader is `MarkupPane.svelte:866` | agree, with amendment 19 |
| `analysis/gates.ts:302`, `:323` | the `generic` parameter, and its use | agree |
| `analysis/placeholder-line.ts:81-82` | `placeholderCommentSentence` | agree |
| `i18n.ts:2075` `placeholder.comment.generic` | English as quoted | agree |
| `insights/identity.ts:42` `restsOnSamples` | as stated | agree |
| `insights/singer-blocks.ts:254` | `placeholderCommentSentence(..., i.generic)` | agree |
| `markup/MarkupPane.svelte:873` | `gatedLines(..., adapted.generic)` | agree |
| `i18n.ts:2057`, `:2065` "through the DRAWER on the left" | as stated | agree |
| `docs/memory/STATE.md`, "6691 passed \| 1 skipped (6692)" | `STATE.md:19` | agree |
| `e2e-phone/insights-links.test.ts:32`, `:46` | the test, and the `toBeGreaterThanOrEqual(0)` line | agree |
| Section 9: the ruling cites `stand-ins.ts:58-66`, `:76`, `:91-96`; the tree reads `:55-62`, `:73`, `:89-96` | confirmed; the ruling's `:55` for the countertenor comment is `:52`, and its `:71-72` for "placeholder" is `:71` | agree |

One line drift and one incomplete description in 49 rows.

## Sites the brief missed

Readers of `AdaptedProfile.generic`: none missed. My grep of `apps/web/src` for `.generic`, `generic:`, `generic,`, and `generic)` returned the brief's readers plus `markup/MarkupPane.svelte:866`, which the brief covers by its legend entry.

Sites that reach the voice type by another route:

1. `components/Drawer/voice-pane.ts:81-83` `showVowelSpaceDoor`, drawn at `components/Drawer/VoicePane.svelte:124`. Reads `hasPlaceholderProfile` directly. Behaviour changes for the four; no string. Amendment 7.
2. `voice/chart/VowelSpaceSheet.svelte:163`, `sheet.provenance` (`i18n.ts:2569`): "scaled to your voice type". Blocker 4.
3. `voice/chart/screen-logic.ts:63`, `capture.hint.placed.typed` (`i18n.ts:2619`): "from your voice type". Blocker 4.
4. `voice/voiceTypes.ts:86-89`, Other's typed text, which reaches all three `{voiceType}` fills. Blocker 1.

Checked and clear: `insights/identity.ts:28` (the identity line prints the declared type and makes no claim about values); `components/Drawer/voice-pane.ts:86-90` `typeControlLabel` (the control's own label); `i18n.ts:1343` `calib.summary.outside`, which carries `{type}` and has no caller my grep found; `i18n.ts:1438-1439`, marked unused at `:1437`; `i18n.ts:1431` and `:1514`, which name no type.

Greps run, in `apps/web`: `hasPlaceholderProfile|PLACEHOLDER_PROFILE_TYPES`; `typed-none|typedNone`; `voiceTypePrint|fillVoiceType|placeholderLabel|typeControlLabel|standInBucket|voiceTypeLabel`; the four `generic` patterns above; in `i18n.ts`, `your voice type|votre type de voix|{voiceType}|{type}|for a generic|voix type|generic values|five voice types|cinq types`, and the names of the four types; `completeness.formants`; and the four type ids across every test file under `src`, `e2e`, and `e2e-phone`.

## What I could not establish

- Whether the chart and the capture screen place a contralto's unsung vowels from the mezzo and tenor staff. `stand-ins.ts:147` and the comment at `resolve-values.ts:17-18` say so; I did not read `buildChartModel`.
- Whether INSIGHTS with no score passes an empty vowel list to `placeholderLine`. If it does, the section 3 line never draws there (`placeholder-line.ts:76`), and that page's only disclosure is the Method line.
- What "The method line on the same page carries the why" (ruling `:166`) refers to: the Method endnote, or the section 3 line. MELODY has no Method endnote that I found. The brief treats it as the section 3 line and does not say so.
- Whether the Guide has an anchor the link can target. I read `guide-anchors.ts:1-22`, which holds renamed anchors only.
- Dann's standing default of 2026-10-11 19:47 (a page names its remedy once) and the 2026-10-11 ratification of `placeholderLine`. The brief cites both; I read neither source.
- Whether `ratified-lines.test.ts` pins the six existing strings the lane rewords. I read `:424-425` only.
- Outside this lane, and Dann's to rule: a singer on one of the five published types who typed Other text reads that text in `{voiceType}` today (`voiceTypes.ts:86-89`), so a mezzo-soprano who typed "contralto" already reads "a generic contralto" over a mezzo's values. The brief keeps this behaviour for the five.
- Token cost of this review: under half the 260,000 cap, by my own count; I have no meter.
