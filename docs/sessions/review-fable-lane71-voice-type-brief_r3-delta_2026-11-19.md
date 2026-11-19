# Fable delta review, lane 71 brief r3
VERDICT: DO NOT SEND
Blockers: 1. Amendments: 11.

Reviewed: `docs/sessions/brief-code-lane71-voice-type-stand-ins_r3_2026-11-19.md` (md5 `65357810389ae4f835ca429780abce7a`, confirmed) against my r2 report (md5 `3242dc453839657c3c346d1f615670a2`, confirmed), the diff of r2 to r3, `docs/memory/INBOX.md:912-915`, `docs/memory/CONTRACT.md` sections 1, 5, and 7, the ruling file (md5 `8d3f8a4f`, unchanged), and the tree at `Shane` `b79e33e9`. "r3:n" is a line of the brief. Paths are under `apps/web/src/lib/` unless they begin with `docs/`. Every line cited was read in this session. No test and no browser was run. The report path was free; no other document holds it.

The one blocker costs Dann one yes. Everything else is the desk's to apply.

## Blocker

1. **`sheet.provenance.undeclared` carries French Dann has not seen, and r3 declares it settled under a clause that does not cover French.**
   - r3:295-298 says the sentence "stands unless Dann objects" under `CONTRACT.md` section 1 item 4. Item 4 (`CONTRACT.md:22`) grants that for money and for his name only. French is one of the four things he hears a question for. Section 7 (`CONTRACT.md:136`): "Do not write French Dann has not seen." Section 5 (`CONTRACT.md:122`): "nothing reaches the tree until he ratifies it."
   - The wording is also a taste matter. Dann at 11:56 (`INBOX.md:912`): *"I reject this now: \"Ilya averages its five voice types as a starting point.\"*, and in the ruling's section 8, *"No average."* The desk's sentence puts "average" / « moyenne » on the sheet for the very singer that ruling was about. His ratified word for the same thing is "middle" / « milieu » (ruling `:104`, `:137`).
   - r3:346 says "Nothing in this brief is a draft. The lane invents no string". With this key, that is no longer so.
   - r3:295 holds « d'Ilya » with U+0027. The live string holds « d’Ilya » (`i18n.ts:2569`).
   - Repair: one marked draft to Dann, then record his answer. A draft built from his own ratified words, mine, offered to the desk:
     - EN: "... and Mitton (2020), Table 5.3, scaled to the middle of Ilya’s five staves, for the second."
     - FR, DRAFT: « ... et Mitton (2020), tableau 5.3, ajusté au milieu des cinq portées d’Ilya, pour la deuxième. »
     - Sources: « du milieu de ses cinq portées » is the ratified Guide (ruling `:137`); « ajusté à » and « d’Ilya » are the live string (`i18n.ts:2569`). « ajusté » agrees with « Mitton (2020), tableau 5.3 », masculine singular, as the live string does. "Middle" is adopted from the Guide; "average" was the desk's.
   - Cost of sending without it: unratified French in the tree, on the sheet and on its printout (`voice/chart/print-sheet.ts:28` mounts the same component).

## 1. Is r2 blocker 1 repaired in instructions?

For the cases r2 named, yes. Two residues, both the desk's to close.

- **Tier 1 call, both sites: REPAIRED.** r3:288-290 and default 6 (r3:446-448) instruct it at the sheet and at the capture hint. Both props carry the id alone (`VowelSpaceSheet.svelte:29`, `screen-logic.ts:63`). Not yet in a test: test 9 (r3:398-399) covers the VOICE pane only.
- **Undeclared voice at the sheet: REPAIRED in instructions, pending the blocker.** r3:291-294 gives a second key. What "undeclared" means in code is not stated (amendment 2).
- **Capture hint: one hole left.** `hasDeclaredType` (`screen-logic.ts:30`) is true for any non-empty id but `not-sure`, so an id this build does not know takes `capture.hint.placed.typed`. The helper's contract (r3:105-115) has no clause for that id or for no type. `voiceTypePrint` returns `undefined` for a non-Tier-1 id (`voiceTypes.ts:84`), so the fill is empty or the token prints raw. Whether a stored voice can hold such an id is NOT ESTABLISHED; `analysis/stand-ins-snapshot.test.ts:72` tests one.

## 2. Does r3's reading of the 13:58 ruling hold?

Yes, on the record as written.

- `INBOX.md:915` holds his words, *"A) it reaches the starting path only"*, and the effect: the average stays as the chart's ground (`voice/chart/zones.ts:89`, `:91`) and as the fill for a partly sampled voice (`voice/engine/resolve-values.ts:153`, `:156`; `voice/engine/stand-ins.ts:147`, `:61`); r2 section 4.9's strike is withdrawn. All six citations agree with the tree. r3:11-15 and r3:274-278 repeat the entry faithfully.
- The text of option A as the desk put it to him is not in the entry. So whether he saw the Guide consequence in the question is NOT ESTABLISHED; the entry records it as the ruling's effect.
- Withdrawing the strike is right: it restores ratified text whole, and the ruling's section 8 says sections 4 and 5 stand.
- **For Dann, not the lane.** In its paragraph the sentence follows "When Ilya has not yet heard your voice" (ruling `:98`). For a singer with no type and nothing sampled, no page a singer can reach starts from the middle: MELODY and INSIGHTS withhold (`resolve-values.ts:154`), and the vowel-space door is shut (`components/Drawer/voice-pane.ts:81-83`). The sentence becomes true at the first sampled vowel. Under his 2026-11-18 13:58 rule (`INBOX.md:882`) this is his to wave off.
- **r3 still assumes the strike in two places.** r3:353, "the Guide passage, EN and FR, less the struck sentence", and r3:403, test 12, "less the struck sentence". Both contradict r3:274. Amendment 1.
- r3:69-71 still names `:144` alone as the reason `middle` stays. The header corrects it; section 2 does not. Amendment 8.

## 3. The fifteen r2 amendments

| # | landed | where |
|---|---|---|
| 1 | no | r3:232-235 unchanged; test 7 unchanged |
| 2 | partly | r3:248-257: established, and a route for no score. Not as its own function; the draw condition there is unstated (amendment 4) |
| 3 | no | r3:224-225 unchanged |
| 4 | no | r3:261 and r3:334 still cite `:865`; `:866` and `:873` absent |
| 5 | no | r3:371-378 unchanged; r3:406 still says the two of 4.10 are "already" pinned |
| 6 | no | r3:391-392 still names `i18n.ts` line numbers, four strings |
| 7 | partly | Three apostrophes fixed (r3:177, r3:314). The rule at r3:360-365 is unchanged, and the new string breaks it |
| 8 | partly | `INBOX.md:914` now records 12:01 with his words. The ruling file holds neither 12:01 nor 13:58. His answer on the countertenor reading: still NOT ESTABLISHED |
| 9 | no | r3:376 still says "the four types" |
| 10 | no | r3:80-84 unchanged |
| 11 | n/a | for Dann; not a brief edit |
| 12 | no | not recorded in r3 section 9 |
| 13 | no | no test for the door |
| 14 | partly | r3:424-426 says 18 lines. r3:271 still says `guide-anchors.ts:1-22`. The `id` point is absent |
| 15 | no | r3:438-439 unchanged |

## 4. The desk's sentence at `sheet.provenance.undeclared`

- **True of the code, for the clause it changes.** An undeclared voice takes `template('middle')` (`stand-ins.ts:61`, `:147`). Its fR2 is Mitton's table times a scale taken from the middle's fR1 (`stand-ins.ts:89-98`), and the middle is the geometric mean of the five staves with the mezzo and tenor set counted twice. The zones' fR2 centres come from the same values (`zones.ts:89`, `:104`).
- **It reads as a sources note.** It describes how a number was made, and says nothing about the singer's voice. The live "scaled to your voice type" was the claim about the singer; this is not.
- **The word is the problem, not the fact.** See the blocker.
- **The rest of the note is not true for this voice, before the lane and after.** "Placeholder values: the centre of each zone for the first resonance": with no type the zone is the union band (`voice/engine/plausibility.ts:211`), and the placeholder is the geometric middle of five centres. That these two agree is NOT ESTABLISHED and unlikely. Not this lane's; for section 9.

## 5. Paths still open to a false sentence or a raw token

1. **Raw `{borrowed}`:** the capture hint for an id the build does not know (section 1 above). Closed by amendment 2.
2. **False:** the borrowing line for a contralto, countertenor, or bass-baritone with five stable core vowels. No borrowed value is in use then (`stand-ins.ts:144-147`). r3:240 says "whenever a borrowed value is in use", r3:232-235 states the predicate by type alone, and no test covers the personal voice. Closed by amendment 4.
3. **False, not closable by the lane:** `capture.hint.placed.typed`, "from its {borrowed} values", for all eight types once five core vowels are stable (r2 amendment 12). r3 does not record it.
4. **Silent, not false:** INSIGHTS with no score for a borrowing voice with one to four core vowels sampled, if the lane hangs the line on `methodGeneric` (`insights/InsightsPane.svelte:294`). That voice's Method key is `insights.method.noScore.samples` (`insights/identity.ts:67`), which is not generic.
5. **Kept on purpose, recorded at r3:429-432:** Other's text on the five published types in `{voiceType}`.

For the three borrowing types on sites 4.1 to 4.6 and 4.10, with nothing sampled, I found no route to "your own type's values" and no route to a raw token.

## 6. The French

Not yet correct.

- U+2019: three in the brief, all at the two strings r2 named (r3:177, r3:314). Correct there.
- U+0027 remains in the new string, « d'Ilya » (r3:295).
- U+00A0: none in the brief. The three Method strings (r3:169, r3:173, r3:177) hold a plain space before the colon. The live strings hold U+00A0 (`i18n.ts:1897` as ` `; `i18n.ts:2569` as the character). r3:362 tells the lane to keep it, so the instruction is right and the brief's bytes are not.
- Wording of the ratified French: unchanged from r2, which agreed with its sources.

## New amendments

1. r3:353 and r3:403. Remove "less the struck sentence" from both. Test 12 asserts the whole ratified passage, EN and FR, the middle-of-five-staves sentence included.
2. r3:105-115 and r3:282-300. Add a fourth contract clause: `borrowedStaffLabel` returns `undefined` for no type and for any id that is not Tier 1. Then define "undeclared" as that `undefined`: the sheet draws `sheet.provenance.undeclared`, and the capture hint takes `capture.hint.placed.untyped`, whatever `hasDeclaredType` says.
3. Section 7, tests for 4.10. (a) A bass who chose octavist reads "the bass staff" on the sheet and "from its bass values" in the hint. (b) "Not sure", no type, and an unknown id each draw the undeclared note. (c) Across the nine ids, no type, and one unknown id, in both languages, no rendered string at any of the eleven sites contains `{` or `}`.
4. r3:232-235 and r3:254-257. State the draw rule once, for both pages and for no score: the declared Tier 1 id is contralto, countertenor, or bass-baritone, and the voice is not personal (`isPersonal`, `voice/engine/sung.ts`). Say that the no-score line does not hang on `methodGeneric`. Add to test 7: no line for a tenor, a mezzo-soprano, or a contralto with five stable core vowels; a line on INSIGHTS with no score for a contralto with three.
5. r3:346-358. Add a row for `sheet.provenance.undeclared` with its true status, and reword r3:346.
6. r3:360-365 and test 11. State the rule for both languages: every apostrophe is U+2019, and in French every colon takes U+00A0 before it. Add both to test 11 as assertions on the lane's strings. Set the brief's own French in those characters.
7. r3:271. `guide-anchors.ts` has 18 lines. The Guide's headings carry `id` attributes (`components/Reading/GuideContent.svelte:21`, `:25`), so the new anchor is an `id`.
8. r3:69-71. Add `:147` and `:61`, so section 2 agrees with r3:13-15.
9. Carry in the r2 amendments that did not land: 3, 4, 5, 6, 9, 10, 13, and 15. Their text is in my r2 report and stands unchanged. With 13:58, `zones.ts:21-23` stays true in substance and needs only its list of withheld types corrected.
10. Section 9. Record three things the lane cannot close: route 3 of section 5 above; the first clause of the sources note for an undeclared voice (section 4 above); and amendment 11.
11. **New finding, for the desk and Dann, not the lane.** The guard and the stand-ins disagree about a countertenor. `plausibility.ts:135-142` sends countertenor to `union`; `stand-ins.ts:58` sends it to `tenor-mezzo`. So a countertenor's zones along the first resonance are the union bands (`plausibility.ts:211`, read by `zones.ts:96`), while his placeholders are the mezzo and tenor staff's centres. After the lane the page says "mezzo and tenor values" beside a chart whose zones are neither, and the door now opens that chart with nothing stored (r3:215-218). Aligning the guard changes which countertenor samples it accepts, which is a formula change this lane says it does not make (r3:319). Tell the lane to leave `bucketFor` alone and report what it sees.

## What I could not establish

- The text of option A in the desk's 13:5x question to Dann.
- Whether any stored voice can hold an id outside Tier 1.
- Whether the union band's centre equals the middle of five for any vowel. Not computed.
- His answer on the countertenor reading (r2 amendment 15 of r1).
- Every opener of the sheet at run time. Read: `voice/chart/SummarySheet.svelte:14` and `voice/chart/print-sheet.ts:28`; both pass the same `voiceType` prop.
- Token cost of this review: about 95,000 of the 200,000 cap, by my own count; I have no meter.
