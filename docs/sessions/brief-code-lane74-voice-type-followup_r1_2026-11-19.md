# Code brief, lane 74: the lane 71 follow-up

r1, 2026-11-19, written by the desk (Opus 5). Branch `cloud-lane-74` from `Shane` at `ca2a4e5b`.

Three items, one small lane. All three come out of lane 71 (QUEUE row 167, shipped `496047c0`, not walked): one Dann found himself at 18:13, two the desk carried forward. Dann walks lane 71 after this lands, and the first screen he looks at is the VOICE pane, so this lane is what makes that walk worth taking.

Every line cited below was read in the tree at `ca2a4e5b` by the desk on 2026-11-19 between 18:2x and 18:4x.

## 1. What these lines are for

A singer who declares contralto, countertenor, or bass-baritone is told something Ilya cannot soften: the field has published no resonance values for their voice type, so Ilya is working from a neighbouring staff until they sample their own vowels. Dann ruled on 2026-11-19 at 09:41 and again at 10:08 that transparency is paramount, that the concession is stated in the line itself and never only behind a link, and that a sentence never tells a singer the values are their own type's when they are a neighbour's.

MELODY and INSIGHTS already carry that reason. The VOICE pane, which is where the singer chose the type and where they go to fix it, does not. It names the borrowed staff and stops. That is the gap this lane closes, and it closes it with words Dann has already ratified. No new string and no new French enter the tree in this lane.

Items 2 and 3 are the same principle read twice more: one comment that now describes code that is gone, and one page that calls a singer's voice by a name Ilya holds no values for.

## 2. Item 1: the VOICE pane gives no reason

### What it does today

`apps/web/src/lib/components/Drawer/voice-pane.ts:44` returns the state `typed-generic` for every declared Tier 1 type that is not `not-sure` once nothing is sampled. `:49` maps that state to `calib.pane.typedGeneric`, and `:63-67` prints it with `borrowedStaffLabel` filling `{voiceType}`.

`apps/web/src/lib/i18n.ts:1432` is that string:

> Ilya is using generic values for a {voiceType} voice until you record your own.

For a contralto, `borrowedStaffLabel` (`voice/voiceTypes.ts:123-127`) gives `mezzo-soprano`, so the pane reads "generic values for a mezzo-soprano voice" to a singer who declared contralto. The staff is named. The reason it is a neighbour's staff is not.

Dann's own ratified line carries that reason. `i18n.ts:2052`, `placeholder.borrowing`, ratified by him at 09:43 (English) and 09:52 (French):

> The field has not yet published resonance values for a {type}, so Ilya is using its {borrowed} values until you sample your own vowels in VOICE.

It is built by `borrowingLine` (`apps/web/src/lib/analysis/placeholder-line.ts:108-118`), which draws only for the three borrowing types and only while the voice is not personal (`:113`). Today its callers are MELODY and INSIGHTS. The pane has no path to it.

### What this lane builds

In `voice-pane.ts`, the `typed-generic` sentence for a borrowing type becomes the borrowing line. Everything else in the pane is untouched.

1. `paneSentence` calls `borrowingLine` for a borrowing type and returns its text when it is non-null.
2. The five published types keep `calib.pane.typedGeneric` exactly as it reads now. The sentence "the field has not yet published resonance values" is false for them, so they must not receive it.
3. `not-sure` keeps `calib.pane.notSure` (`i18n.ts:1436`), ratified 11:59. Untouched.
4. No type keeps `calib.pane.none` (`i18n.ts:1431`). Untouched.

**The below-core state travels with it. DESK DEFAULT, 2026-11-19 18:4x, Dann's to overrule.** A borrowing type that has sampled one to four core vowels takes the `below-core` branch at `voice-pane.ts:38` and reads `calib.pane.belowCore` (`i18n.ts:1445`), which says how many more samples complete the profile and never says the remaining values are a neighbour's. On MELODY and INSIGHTS that singer sees both lines, because `borrowingLine` is its own function and does not depend on the placeholder line (`placeholder-line.ts:96-103` states this as the reason it is not a branch of `placeholderLine`). The pane shows one sentence where those pages show two, so the pane must carry both or it is the one surface that drops the concession at the state where the singer is most engaged. Draw the borrowing line after the below-core sentence, one space between them, the same order the pages use. `borrowingLine` already stops on its own at five stable core vowels (`:113`, `isPersonal`), so nothing is needed to end it.

`paneSentence` returns a string today. Keeping that signature and joining the two sentences with a single space is the smaller change; take it unless the pane's own markup makes two paragraphs better, and say in the report which you took and why.

### What it must not do

Do not write a new string. Do not write or alter any French. Do not change `placeholder.borrowing`, `calib.pane.typedGeneric`, `calib.pane.notSure`, `calib.pane.belowCore`, or any of their pins in `lib/insights/ratified-lines.test.ts` or `lib/stand-in-borrowing.test.ts`. The closing clause of `placeholder.borrowing` names VOICE while the singer is standing in VOICE; that is Dann's ratified wording, it misleads nobody into a wrong action, and it is not this lane's to repair.

### NOT ESTABLISHED, and the lane establishes it

How the longer sentence sits in the VOICE pane at 390 px. `placeholder.borrowing` in English is 142 characters against `calib.pane.typedGeneric`'s 69, and the French is longer again. **Report the rendered height of the pane's sentence block at 390 px for a contralto with nothing sampled, English and French, and the same for a contralto with three core vowels sampled, where two sentences show.** Give the measured pixel height and a picture of each. Do not redesign the pane to fit it; report what it is.

## 3. Item 2: two comments name code that is gone

`step 8` of lane 71 deleted `hasDeclaredType`. Two comments still tell a reader it exists and that sites avoid branching on it:

- `apps/web/src/lib/voice/voiceTypes.ts:121`, clause 4 of `borrowedStaffLabel`'s contract: "every site branches on it, never on `hasDeclaredType`."
- `apps/web/src/lib/voice/chart/screen-logic.ts:77`, on `sheetProvenance`: "The branch is on `borrowedStaffLabel` being `undefined`, never on `hasDeclaredType`."

`grep -rn hasDeclaredType apps/web/src` at `ca2a4e5b` returns those two lines and nothing else, so the identifier survives only in prose about itself.

**The handover says `screen-logic.ts:78`. It is `:77`.** Desk citation error, caught by this read.

Repair: keep what each comment establishes and drop the dead reference. Each contract clause exists to tell a future reader that "undeclared" means exactly `undefined` from `borrowedStaffLabel` and that sites branch on that value. Say that, and stop. Dann ruled at 15:00 that a comment's test is whether it curates the code for a developer arriving cold; a warning against a function that does not exist curates nothing.

## 4. Item 3: one singer, two names for the same staff

### What it does today

A bass who also picks the Tier 2 label "octavist" reads two different names for one set of values:

- The VOICE pane prints **bass**. `borrowedStaffLabel` takes the Tier 1 id alone (`voiceTypes.ts:123`, `:126`), and its clause 2 at `:119` says so in as many words: "a bass who chose octavist reads 'bass', a staff Ilya has, never 'octavist'."
- The vowel-space sheet prints **bass**. `sheetProvenance` (`voice/chart/screen-logic.ts:79-82`) calls `borrowedStaffLabel`.
- MELODY's subtitle prints **octavist**. `markup/subtitle.ts:11` calls `placeholderFillLabel`, which at `voiceTypes.ts:140` returns `voiceTypePrint(choice)` on the whole choice, Tier 2 label included.
- INSIGHTS' lede prints **octavist**, by the same path (`insights/identity.ts:57`).

So MELODY says "placeholder values for a generic octavist" (`i18n.ts:1489`) and INSIGHTS says "These findings use placeholder values for a generic octavist" (`i18n.ts:1897`), while Ilya holds no octavist values at all. The same path prints a singer's free text when they choose Other and type their own words (`voiceTypePrint`, `voiceTypes.ts:86-89`), which states the claim in the singer's own vocabulary.

Lane 71's brief r4 section 9 item 6 kept this on purpose, on the reading that a published type's values are its own. That reading holds for the type and fails for the label: an octavist's values are the bass staff's, and the sentence says they are an octavist's.

### What this lane builds

`placeholderFillLabel` takes the Tier 1 id alone, the way `borrowedStaffLabel` does. Dann's principle of 10:08 decides it, and the desk resolves it under his ruling of 14:59 on the desk's decision rights inside N.204: this is which of two inconsistent sentences a singer reads, and naming.

Once it does, `placeholderFillLabel(choice, language)` and `borrowedStaffLabel(choice?.voiceType, language)` return the same value for every input. **Collapse them into one exported function and keep one contract comment.** Check that claim before you act on it rather than taking it from this brief: compare the two over every Tier 1 id crossed with no Tier 2 label, each Tier 2 label of that type, Other with text, Other with empty text, `not-sure`, `undefined`, and an id this build does not know. If any pair differs, keep both functions, repair only the label, and report which input made them differ.

### What the singer reads after it

- A bass who typed octavist: **bass**, in the pane, on MELODY, in INSIGHTS, and on the sheet.
- French: « une voix type de basse » where it read « une voix type d'octaviste ». Both fills sit after « de » with no article and no adjective agreeing with them (`i18n.ts:1489` and `:1897`), and the elision is already handled by `fillVoiceType` (`voiceTypes.ts:153-157`). Referent checked by the desk: nothing agrees with the fill, so no French changes and none is drafted. If you find any French sentence where the fill does agree with something, stop, change nothing in that sentence, and report it; French is Dann's.
- The three borrowing types: unchanged, since `placeholderFillLabel` already routed them to the staff.
- `not-sure` and no type: unchanged, `undefined`.

## 5. Computation sites

No step changes how a number is computed. The brief therefore carries no list of other sites computing the same number (`CONTRACT.md` section 4, its condition).

## 6. Steps

Each step ends with its own report in `docs/sessions/report-code-lane74-step<n>_r1_2026-11-19.md`.

0. Baseline. All eight gates on `Shane` at `ca2a4e5b` before any change. Record gate 4's two counts as printed. The current baseline is `6727 passed | 1 skipped (6728)`; report what you measure, and if it differs, stop and say so before step 1.
1. Item 2, the two comments. Smallest change in the lane; do it first so the tree is clean for the two that touch behaviour.
2. Item 3, `placeholderFillLabel`. The equivalence check first, then the change, then the collapse if the check allows it. Tests for a bass with each of its Tier 2 labels, Other with text, and Other with empty text, over both languages.
3. Item 1, the VOICE pane, including the below-core pairing. Tests on `paneSentence` for all eight declared types crossed with nothing sampled and with three core vowels sampled, both languages.
4. Renders and measurements. The four pane screens of section 2's NOT ESTABLISHED block, at 390 px, with pixel heights and pictures. Then one render each of MELODY and INSIGHTS for the bass who typed octavist, English, to show item 3 on the page.
5. All eight gates at baseline. Ratchets: `voice-pane.ts`, `voiceTypes.ts`, `screen-logic.ts`, `subtitle.ts`, and `identity.ts` are each inside the ratcheted set; report each file's count against its ceiling, and if the collapse in step 2 lowers one, lower the ceiling with it.
6. Final report: what changed, every file and line, the measurements, and anything in section 7.

## 7. What you could not establish

Open a section with this heading in the final report and list anything you could not settle from the tree. **NOT ESTABLISHED beats a complete invented answer.**

## 8. What this lane does not close

- Dann's walk of lane 71. This lane prepares the first screen of it; the walk itself is his.
- `capture.hint.placed.typed` staying false once five core vowels are stable, for all eight types (lane 71 brief r4 section 9).
- The sources note's first clause being untrue for an undeclared voice (same place).
- The guard and the stand-ins disagreeing about a countertenor: `voice/engine/plausibility.ts:135-142` sends him to `union`, `voice/engine/stand-ins.ts:58` to `tenor-mezzo`, so his chart zones and his page's words describe different staves. Not this lane. It needs a ruling the desk has not yet put to Dann, and it is not naming, so section 4's decision right does not reach it.
- Case 3 of Dann's 14:21 ruling, that no declared type with fewer than five sampled core vowels gets no full set, where `stand-ins.ts:61` and `:147` manufacture one from `template('middle')`. Its own item.
