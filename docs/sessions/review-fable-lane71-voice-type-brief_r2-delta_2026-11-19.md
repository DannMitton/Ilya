# Fable delta review, lane 71 brief r2
VERDICT: DO NOT SEND
Blockers: 2. Amendments: 15.

Reviewed: `docs/sessions/brief-code-lane71-voice-type-stand-ins_r2_2026-11-19.md` (md5 `583cd327b3d22c2acce6bad61a14fdd8`, confirmed) against `docs/sessions/ratified-voice-type-stand-ins_2026-11-19.md` (md5 `8d3f8a4fc3c93076f868b6be7abc1776`, confirmed, read whole again), my own r1 report (md5 `5791565e94362ab168891a98a71f02fc`, confirmed), the desk's sheet `draft-lane71-strings-for-dann_r2_2026-11-19.md` (md5 `976df613509287689bc5e0759fa16ba0`), and the tree at `Shane` `b79e33e9`. "r2:n" is a line of the brief. Paths are under `apps/web/src/lib/` unless they begin with `e2e/` or `docs/`. Every line cited was read in this session. No test and no browser was run.

**Where this file is, and why.** The path I was given, `review-fable-lane71-brief_r2-delta_2026-11-19.md`, already holds a different review: the delta review of the blank-states brief r2, committed at `b79e33e9`, and cited by the ruling's section 6. I did not overwrite it. DESK DEFAULT: this report has its own name.

r2 repairs three of my four blockers in instructions and the fourth in the part that could not be built. Both new blockers come from two places where r2 reasons from "the average is gone" and the tree still holds it.

## New blockers

1. **`{borrowed}` now sits in two strings that draw for every voice, and r2 gives its fill for three types.**
   - `sheet.provenance` is drawn with no condition at `voice/chart/VowelSpaceSheet.svelte:163`. The sheet opens for any voice with a stored reading (`components/Drawer/voice-pane.ts:82`, `hasStoredReading || ...`). For "Not sure", no type, and an unknown id, `borrowedStaffLabel` returns `undefined` under r2:102, so the lane prints the raw token, or "scaled to the  staff", or invents a string. r2 gives no text for that reader.
   - For the five published types, r2:100 returns `voiceTypePrint`'s label, which is a Tier 2 label or Other's text when the full choice is passed (`voice/voiceTypes.ts:86-94`). r2:122-124 fixes the Tier 1 call for section 4.6 only. Section 4.10 says nothing, so a bass who chose octavist can read "scaled to the octavist staff" and "Ilya has placed [ɑ] from its octavist values", and a mezzo-soprano who typed "contralto" can read "from its contralto values". Both strings say "your voice type" today, which is true for those five. The lane would make a true sentence untrue.
   - Repair, two parts. (a) State that both fills of section 4.10 pass the Tier 1 id alone, as the two props already carry it (`VowelSpaceSheet.svelte:37`, `voice/chart/screen-logic.ts:30` and `:63`), and add the bass-with-octavist case to test 9. (b) One string from Dann: what `sheet.provenance` says for a voice with no declared type. The true fill there is the middle of the five staves, which leads to blocker 2.

2. **The average is still in Ilya for "Not sure" and no type, in two places, and r2 strikes the one sentence that discloses it on the ground that it is "no longer true".**
   - r2:62-64 says the `middle` bucket "stops being a starting profile, not a shape", and names `:144` only. `voice/engine/stand-ins.ts:147` reads `scaled ? 'middle' : standInBucket(voiceType)`, and `:61` returns `middle` for "Not sure" and no type. `voice/engine/resolve-values.ts:156` runs the fill whenever `anySung || generic || placeholders === 'always'`.
   - So the unscaled five-staff average fills every unsung vowel for a "Not sure" or untyped singer (a) on the vowel chart always (`voice/chart/zones.ts:89-91` asks for `'always'`; its header at `:21-23` says "the chart shows a placeholder for every voice"), and (b) on MELODY and INSIGHTS from the first sampled vowel until five core vowels are stable. This is today's behaviour, and the ruling's section 8, item 1, says "as before this ruling". The lane does not make it worse.
   - What the lane does do: r2:260-263 strikes "If you have not named a type, Ilya starts from the middle of its five staves." from the ratified Guide passage, EN and FR. After the lane, Ilya still starts from that middle on the chart, and nothing on any page says so (`capture.hint.placed.untyped`, `i18n.ts:2620`, says "from typical voices"). That meets Dann 09:41, "we are not trying to hide anything", head on.
   - The strike itself is narrow: one sentence in each language, nothing else moved, and "Nineteen sources" kept. It does not go further in the text. It goes further in its ground: the ruling's section 8 says "sections 1, 4, 5, and 7 stand as ratified", the struck sentence lives in sections 4 and 5, and it speaks of no type, where the amendment speaks of "Not sure".
   - Repair: one question to Dann before sending. Does "No average" reach the chart's placeholders and the fill after the first sampled vowel for a singer with no declared type? If yes, that is code this brief does not hold, and the strike is right. If no, the Guide sentence stays or is reworded by him, and blocker 1(b) takes its fill from the same answer. Cost of guessing wrong: a ratified EN and FR sentence removed and restored, or a second lane.

## My r1 blockers, one by one

1. **Other's text through the borrowed label: REPAIRED in instructions.** r2:98-108 gives the contract clause by clause; r2:354-357 adds both tests. I confirmed the three fills gate on `generic` (`markup/subtitle.ts:11`, `insights/identity.ts:57`, `insights/singer-blocks.ts:337`), so "Not sure" reaches none of them once it is out of the list.
2. **Five strings unratified at step 1: REPAIRED**, by route (a). The text is in r2 sections 4.4, 4.5, 4.6, and 4.10, and test 5 is the mechanical stop. One limit: the 12:01 ratification is recorded in the brief alone (amendment 8).
3. **Section 4.7's two instructions: REPAIRED in the part that could not be built.** r2:222-224 keeps the ratified string whole. r2:225-235 states a draw rule and extends it to the below-core state. r2:236-239 gives the link precedent. Two parts are repaired in words and not yet in instructions: the predicate as written is not the rule (amendment 1), and r2 says the line "joins" the placeholder line without saying both print (amendment 3).
4. **Two sentences that reach the type without `generic`: REPAIRED for the three borrowing types, and the repair opens new blocker 1.**

## My r1 amendments

| # | landed | where, and any residue |
|---|---|---|
| 1 | yes | The sentence that cited `:92` is gone from r2. |
| 2 | yes | r2:73-77. Two more comments go stale under r2's own new text; amendment 10. |
| 3 | yes | r2:110-113. |
| 4 | yes | r2:115-120. |
| 5 | partly | r2:122-124 and r2:196-197 keep the Tier 1 call for 4.6. The helper's parameter type is given by implication only, and 4.10 is left out; new blocker 1. |
| 6 | yes | r2:338-342 carries my list. r2's own rewording breaks more; amendment 5. |
| 7 | yes | r2:208-211, and default 4, adapted to eight. |
| 8 | yes | r2:193-195. |
| 9 | yes | r2:215-216 and r2:236-239. |
| 10 | as a DESK DEFAULT, not as his answer | r2:229-235. I asked for Dann's answer before sending. Reversible, so it may stand as a default; amendment 15. |
| 11 | yes | r2:254-258. |
| 12 | beyond what I asked | I asked that it be surfaced to Dann. r2 strikes the sentence; new blocker 2. |
| 13 | yes | r2:351-353. |
| 14 | mostly | r2:349-370; see "Test coverage". |
| 15 | on the sheet; outcome NOT ESTABLISHED | The sheet's "One reading to judge" shows him all four. Neither the ruling nor r2 records what he said, and r2 builds "a generic mezzo and tenor" either way. |
| 16 | partly | r2:327-332 gives the rule. The brief's own French breaks it; amendment 7. |
| 17 | yes | r2:343-345. It says "the four types"; three move now; amendment 9. |
| 18 | yes | r2:173-175. |
| 19 | partly | The `completeness.formants` row is in (r2:304). The `generic` reader is still cited one line off, with the wrong description; amendment 4. |

## New in r2, and whether it holds

New citations, all read: `stand-ins.ts:58`, `:60`, `:61`, `:144`, `:147`, `:153`, `:158`; `resolve-values.ts:156`; `analyze-score-adapter.ts:93`; `voiceTypes.ts:38`, `:104-106`, `:109-110`; `voice-pane.ts:35-44`, `:65-66`, `:77-79`, `:81-83`; `VoicePane.svelte:85`; `screen-logic.ts:30`, `:63`; `GuideContent.svelte:91`, `:395`; `i18n.ts:1437`, `:2569`, `:2619`; `STATE.md:19`. All agree with the tree, with the two exceptions in amendments 4 and 14.

**Section 2 (the gate).** Eight, with `not-sure` and no type out: agrees with the ruling's section 8, item 1. The unblocking path (r2:66-71) is correct as read. One statement is incomplete; new blocker 2.

**Section 4.6 (`calib.pane.notSure`).** Character for character the ruling's text, EN and FR. No new control: `VoicePane.svelte:85` draws `VoiceTypeIntake`, as r2 says.

**Section 4.9.** See new blocker 2.

**Section 4.10.** See new blocker 1.

**Does r2 contradict the amended ruling on "Not sure"?** In its instructions, no. I found no place where r2 gives "Not sure" a profile, a token fill, a subtitle, a lede, or the 09:50 or 10:08 sentences. The withdrawn "Not sure" items of r1 section 6 are gone. The one contradiction is of fact, at r2:62-64.

**Ratified strings, character for character.**
- English: all seven agree with their source. `calib.pane.notSure` with the ruling (`:241-243`); the three Method strings, the broad note's closing sentence, `sheet.provenance`'s clause, and `capture.hint.placed.typed` with the sheet (`:46-47`, `:52`, `:57`, `:66`, `:95`, `:120-121`).
- French, three mismatches, all the apostrophe. The brief holds no U+2019 and no U+00A0 anywhere (counted). The sheet and the ruling hold U+2019.
  - r2:170 « jusqu'à ce que » against the sheet's « jusqu’à ce que » (`:58`).
  - r2:281 « d'après ses valeurs » and « pour l'instant » against the sheet's « d’après » and « l’instant » (`:125`).
  - r2:261 quotes the struck sentence as « Si vous n'avez indiqué »; the ruling reads « Si vous n’avez indiqué » (`:137`). A lane that searches for r2's bytes finds nothing to strike.
- The wording of every French string agrees with its source once the apostrophe is set aside.

### New amendments

1. r2:225-228, the draw rule. "`standInBucket(voiceType)` differing from the singer's own type" is true of a tenor and a mezzo-soprano too (`stand-ins.ts:58` returns `tenor-mezzo` for both). And once five core vowels are stable the fill comes from `middle` times the tract scale (`:144-147`), so no borrowed value is in use. State the rule as: the declared Tier 1 id is contralto, countertenor, or bass-baritone, and the voice is not personal. Add to test 7: no line for a tenor, a mezzo-soprano, or a contralto with five stable core vowels.
2. r2:241-243 and r2:391-392, now established. `insights/InsightsPane.svelte:189` sets `placeholders = placeholderVowels(analyzed)`; `analysis/placeholder-line.ts:27` returns `[]` with no analysis; `:76` then returns null, and `:73-75` returns null first when something is sampled and nothing is analysed. So the borrowing line cannot draw through `placeholderLine` on INSIGHTS with no score, and that page would name no borrowing at all (no lede either: `InsightsPane.svelte:503` asks for `!!model`). Recommendation: make the borrowing line its own function with its own entry in the `note` array (`InsightsPane.svelte:503`; `MarkupPane.svelte:736` for MELODY), with the rule of amendment 1 and no dependence on the vowel list. That also settles the below-core case without touching `placeholderLine`.
3. r2:217-218. Say in words that the borrowing line and `placeholder.line.many` both print in the `generic` state, and name the cost in default 2: the page then gives the remedy twice, as "the DRAWER on the left" (`i18n.ts:2057`) and as "VOICE". r1 cited Dann's default of 2026-10-11 19:47 here; r2 drops it without saying so.
4. r2:247-248 and r2:301. `markup/MarkupPane.svelte:865` is `hollowHeads`, which reads `e.placeholder`, not `generic`. The reader is `:866`, `filledHeads: !adapted.generic`, and `markup/legend.ts:105-108` is its comment. The call site `:873` (`gatedLines(..., adapted.generic)`) was in r1's table and is missing from r2's.
5. r2:338-342. Add the tests the ratified rewording breaks: `insights/ratified-lines.test.ts:422-423`, `:428-431`, `:437-438`; `analysis/analyze-score-adapter.test.ts:467-468`; `components/Drawer/voice-pane.test.ts:16`; `voice/chart/screen-logic.test.ts:45`; `voice/chart/ratified-strings.test.ts:29` and `:70`; `e2e/insights-no-score.test.ts:34-35`. r2:373 says the last pair "already pins the two of 4.10"; it pins their old text.
6. r2:358-359, test 5. Name the keys, not `i18n.ts` line numbers, which move as the lane edits. Add `sheet.provenance` and `capture.hint.placed.typed`.
7. r2:327-332. "French keeps U+2019" does not describe the brief's own French. Say: in both languages every apostrophe is U+2019, and in French every colon takes U+00A0 before it, as `i18n.ts:1897` does. Or set the brief's French in those characters.
8. r2:323-325. Record the 12:01 ratification in the ruling file, with Dann's words. Today it is in the brief alone: the ruling holds none of the six strings, the sheet calls them drafts, and `docs/memory/INBOX.md` has no entry for 2026-11-19 12:01. r2:372 asks the lane to pin each string "with its ruling's date". Record his answer on the countertenor reading in the same place.
9. r2:343-345. Three types move in the adapter golden, not four. Ask the lane to confirm that the `not-sure`, `undefined`, and `''` rows of `analysis/adapter-grid.ts:35` did not move.
10. r2:73-77. Add `voice/chart/screen-logic.ts:29` ("the placeholder says 'your voice type'") and `voice/chart/zones.ts:21-23`.
11. For Dann, not the lane: the ratified `calib.pane.notSure` ends "Or choose a voice type, and Ilya starts from published values for it." For three of the eight types on offer there are none. The next sentence the singer reads (`calib.pane.typedGeneric`, with the borrowed fill) corrects it.
12. For Dann, not the lane: once five core vowels are stable, every placeholder is the middle shape times the singer's tract scale (`stand-ins.ts:144-147`). `capture.hint.placed.typed` draws in that state (`screen-logic.ts:58-64`), so "from its {borrowed} values" is untrue there for all eight types. The live "from your voice type" is untrue in the same state; the new text names a staff and so is more exactly wrong.
13. Section 7. Add a test for the door: open for the three with nothing stored, shut for "Not sure" and no type.
14. r2:257 and r2:394. `guide-anchors.ts` has 18 lines; "`:1-22`" is my r1 error, carried over. Corrected here. The Guide's headings carry `id` attributes (`GuideContent.svelte:21`, `:25`), so the new anchor is an `id`.
15. r2:406-407, default 2. Name the reading Dann would be overruling: a contralto who has sampled three vowels reads "until you sample your own vowels in VOICE".

## Still able to build a false sentence?

Yes, by three routes.

1. Section 4.10 for the five published types with a Tier 2 label or Other's text (new blocker 1). Closed by passing the Tier 1 id.
2. Section 4.10 for a voice with five stable core vowels (amendment 12). Not closable by the lane; it needs a string or a ruling.
3. Kept on purpose and recorded at r2:397-400: Other's text on the five published types in `{voiceType}`.

For contralto, countertenor, and bass-baritone on the sites of 4.1 to 4.6, I found no route left to "your own type's values". The fills are fixed whatever Tier 2 or Other holds, and the tokenless strings no longer name a type.

One route to a silent page, not a false one: INSIGHTS with no score names no borrowing unless amendment 2 is taken.

## Test coverage against my r1 list

| r1 defect | r2 test | covered |
|---|---|---|
| 1. "Not sure" with Other text | 4 | yes |
| 2. Borrowing type with Other or Tier 2 | 3 | yes |
| 3. Tokenless strings | 5 | yes, for four of six strings; amendment 6 |
| 4. "Not sure" with no sentence at a site | 4, 6, 7 | yes; the case shrank with the amendment |
| 5. Section 3 line never drawn | 7 | yes |
| 6. `{type}` with a Tier 2 label | 8 | yes |
| 7. Bass with a finer label in VOICE | 9 | yes |
| 8. French | 11 | yes |
| 9. Guide passage | 12 | yes, pending blocker 2 |
| 10. The two sentences of blocker 4, and the door | 2 | partly: the three types only; no test for the door, the five published types, or a voice with no type |
| 11. One page disagreeing with itself | 10 | yes |

Still uncovered: the door (amendment 13); `{borrowed}` in 4.10 for the five published types and for no type (new blocker 1); the borrowing line's absence for a personal voice (amendment 1).

## What I could not establish

- That Dann ratified the six strings at 12:01, and what he said about the countertenor reading. The brief and the caller say so; no file in the tree records it.
- Dann's standing default of 2026-10-11 19:47. `docs/memory/OPEN.md:3073` opens the entry for 19:42 to 19:47; I read its first lines only.
- Every opener of `VowelSpaceSheet` besides the VOICE pane's door. I read the door and the sheet's line `:163`.
- Whether `tractScale` is always finite for a personal voice. `stand-ins.ts:145` falls back to the declared type's staff when it is not.
- What MELODY's equivalent of the `note` array is at `MarkupPane.svelte:736`; I read the line that builds `placeholderNote`, not where it is drawn.
- Whether `CORE_BANDS` matches Bozeman's figures (r2:395-396). Not read.
- Token cost of this review: about 130,000 of the 200,000 cap, by my own count; I have no meter.
