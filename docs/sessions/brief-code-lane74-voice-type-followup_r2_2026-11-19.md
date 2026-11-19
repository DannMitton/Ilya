# Code brief, lane 74: the lane 71 follow-up, and the concession at the moment of choice

r2, 2026-11-19, written by the desk (Opus 5). Branch `cloud-lane-74` from `Shane` at `ca2a4e5b`.

r2 replaces r1 (md5 `cd42ed87`) whole. Fable's review of r1 returned DO NOT SEND with four blockers and seven further amendments (`review-fable-lane74-brief_r1_2026-11-19.md`, md5 `cbdb9272`); all are applied, and the desk re-read every blocker in the tree rather than taking the review's word. Two of the four were desk errors and are named in section 9.

Four items. Three are lane 71's tail. The fourth is Dann's ruling of 18:33, made after r1 was written.

Every line cited below was read in the tree at `ca2a4e5b` by the desk on 2026-11-19 between 18:2x and 18:5x.

## 1. What these lines are for

A singer who declares contralto, countertenor, or bass-baritone is told something Ilya cannot soften: the field has published no resonance values for their voice type, so Ilya works from a neighbouring staff until they sample their own vowels. Dann ruled at 09:41 and again at 10:08 that transparency is paramount, that the concession is stated in the line itself and never only behind a link, and that a sentence never tells a singer the values are their own type's when they are a neighbour's.

At 18:27 he asked whether to remove the three types outright, so the cohort would self-select from the types the field does publish and own the approximation. At 18:33 he ruled the other way, on the desk's alternative: the three types stay, and **the concession is made at the moment of choice**. Choosing one of the three names says, right there, that the field has published nothing for that type, and names both paths open to the singer. The account and the readings behind it are in `docs/memory/OPEN.md`, "ROW 167: THE CONCESSION IS MADE AT THE MOMENT OF CHOICE"; his words are in `INBOX.md` under 18:27 and 18:33.

So the singer meets the concession twice, and the two are not redundant. Item 4 is what they read when they choose. Item 1 is what they read when they come back. Items 2 and 3 are the same principle read once more in the code and on the pages.

## 2. Item 4: the concession at the moment of choice

### What exists today

Ilya has two Tier 1 pickers. Both iterate `TIER1` (`voice/voiceTypes.ts:19-29`), so both carry the note or the concession depends on which door the singer came through:

| picker | file | the radio group | shown by |
|---|---|---|---|
| Voice characteristics, in the VOICE pane | `voice/VoiceTypeIntake.svelte:67-78` | one column | `components/Drawer/VoicePane.svelte:85` |
| the one optional question before the first vowel | `voice/VoiceTypeFirst.svelte:30-36` | a two-column grid, read downward (`:69-75`) | `voice/CalibrationWizard.svelte:810` |

Selecting a radio saves at once: `VoiceTypeIntake.svelte:74` calls `onchange(withTier1(choice(), id))`, and `VoiceTypeFirst.svelte:32` calls `onchange(id)`. Neither says anything about what the choice means.

### The string, RATIFIED by Dann 2026-11-19 18:36

English and French both, in one message: *"I ratify both the french and the english"*. Store it under one key. **DESK DEFAULT on the key name, Dann's to overrule: `voiceType.borrowing`**, beside `voiceType.heading` and `voiceType.hint`, because it belongs to the picker and not to the pane.

English, character for character:

> The field has not yet published resonance values for a {type}. Ilya can start from the {borrowed} staff, or you can record your vowels in vocal fry and Ilya works from your own voice.

French, character for character:

> La recherche n'a pas encore publié de valeurs de résonance pour un {type}. Ilya peut partir de la portée de {borrowed}, ou vous pouvez capter vos voyelles en friture vocale et Ilya travaille à partir de votre propre voix.

In the French, the apostrophes are U+2019 and there is no colon, so no no-break space is needed. Pin both in `lib/stand-in-borrowing.test.ts` beside the other row 167 pins.

Provenance, for the comment above the key: assembled by the desk from `placeholder.borrowing` (`i18n.ts:2052`, ratified 09:43 and 09:52) and `calib.pane.notSure` (`i18n.ts:1436`, ratified 11:59). The only new clause is the join, "Ilya can start from the {borrowed} staff, or" and « Ilya peut partir de la portée de {borrowed}, ou », built on the construction already in `sheet.provenance` (`i18n.ts:2580`). Nothing is coined.

### The fills

`{type}` and `{borrowed}`, the same two tokens `placeholder.borrowing` takes, filled the same way `borrowingLine` fills them (`analysis/placeholder-line.ts:114-117`): `{type}` from `voiceTypePrint({ voiceType })` on the Tier 1 id alone, so the French stays masculine; `{borrowed}` from `borrowedStaffLabel`. Use `fillVoiceType` with the tokens `type` and `borrowed` (`voiceTypes.ts:153-157`).

`borrowingLine` is the pattern to follow and probably the function to reuse the shape of, but it is not the function to call: it takes formants and tests `isPersonal` (`placeholder-line.ts:113`), and the picker's note does not depend on what the singer has sampled. Write a sibling pure function that takes the Tier 1 id and the language and returns the text or null, so both pickers call one thing and it is tested without a browser.

### When it shows

Whenever the currently selected Tier 1 id is contralto, countertenor, or bass-baritone, in both pickers. Not for the five published types, not for "Not sure", not for no selection. `isBorrowingType` (`voiceTypes.ts:111-113`) is the test.

It shows on selection and stays while that type is selected. It is a note, not a dialogue: **do not add a control, do not block the singer, and do not make them dismiss it.** Both paths it names already exist. Doing nothing takes the neighbouring staff; `calib.pane.door.record` (`i18n.ts:1450`) is already the way to the other.

### Where it sits

Directly below the Tier 1 radio group, inside the same `fieldset`, before anything that follows it. In `VoiceTypeIntake.svelte` that is after the `{#each}` at `:78` and before the clear button at `:79-83`. In `VoiceTypeFirst.svelte` it goes below the `.vt-choices` grid at `:36`, not inside it, because the grid flows in two columns and a note inside it would be placed by the flow rather than under the chosen option.

Style: `VoiceTypeIntake.svelte`'s own `.vt-hint` recipe (`:159-165`), which is what the group's own hint already uses, so the note reads as part of the group. Do not invent a new visual treatment.

### What the lane reports

The rendered note at 390 px in both pickers, English and French, with pixel heights and a picture of each. In `VoiceTypeFirst.svelte` also report whether the note pushes Begin off a phone screen, which its own comment at `:40-41` says the two-column layout exists to prevent.

## 3. Item 1: the VOICE pane at rest gives no reason

Dann found this himself at 18:13, before the 18:33 ruling, and it stands beside it: the picker's note is read once at the moment of choosing, and the pane's sentence is what a returning singer reads.

### What it does today

`components/Drawer/voice-pane.ts:44` returns the state `typed-generic` for every declared Tier 1 type that is not `not-sure` once nothing is sampled. `:49` maps it to `calib.pane.typedGeneric`, and `:63-67` prints it with `borrowedStaffLabel` filling `{voiceType}`.

`i18n.ts:1432`:

> Ilya is using generic values for a {voiceType} voice until you record your own.

A contralto reads "generic values for a mezzo-soprano voice". The staff is named; the reason it is a neighbour's is not. Dann's ratified `placeholder.borrowing` (`i18n.ts:2052`) carries that reason and is built by `borrowingLine` (`analysis/placeholder-line.ts:108-118`), whose callers today are MELODY and INSIGHTS only.

### What this lane builds

1. For a borrowing type with nothing sampled, the `typed-generic` sentence becomes the borrowing line, in place of `calib.pane.typedGeneric`.
2. The five published types keep `calib.pane.typedGeneric` unchanged. "The field has not yet published resonance values" is false for them.
3. `not-sure` keeps `calib.pane.notSure` (`i18n.ts:1436`). `none` keeps `calib.pane.none` (`i18n.ts:1431`). Both untouched.
4. **The below-core state carries it too, and the borrowing line comes FIRST. DESK DEFAULT, Dann's to overrule.** A borrowing type with one to four stable core vowels takes the `below-core` branch at `voice-pane.ts:38` and reads `calib.pane.belowCore` (`i18n.ts:1445`), which never says the remaining values are a neighbour's. MELODY and INSIGHTS show both lines in that state, borrowing line first: `markup/MarkupPane.svelte:996` puts `borrowingLine(...)` before `placeholderNote` in the note array, and `insights/InsightsPane.svelte:503` puts it before `placeholderLine(...)`. Both orders are pinned at `stand-in-borrowing.test.ts:171-172`. The pane follows the pages.

### The condition, without changing the input shape

`borrowingLine` takes formants and `PaneSentenceInput` has none (`voice-pane.ts:19-31`). Do not add formants to the input and do not change `paneSentence`'s signature. The test is already available from the input: `isPersonal(formants)` is `coreCount(formants) >= PERSONAL_CORE_MIN` (`voice/engine/sung.ts:41`), `coreCount` is `stableCore(formants).length` (`:33`), and `PaneSentenceInput.core` is documented as `stableCore(voiceFormants)` (`voice-pane.ts:22`). So `i.core.length >= PERSONAL_CORE_MIN` is the same test.

**Verify that before you rely on it:** `VoicePane.svelte:43` documents `core` as `stableCore(voiceFormants)` and `:59` passes it to `paneSentence`. Confirm the value actually handed in at `:59` comes from `stableCore` and not from some other count, and say in the report what you found. If it does not, stop and report rather than widening the input.

Build the pane's sentence from the ratified string directly, the way `borrowingLine` does, rather than calling `borrowingLine` with manufactured formants.

### What it must not do

Do not write a new string for item 1 and do not alter any French. Do not change `placeholder.borrowing`, `calib.pane.typedGeneric`, `calib.pane.notSure`, `calib.pane.belowCore`, or `calib.pane.none`. The closing clause of `placeholder.borrowing` names VOICE while the singer is standing in VOICE; that is Dann's ratified wording, it misleads nobody into a wrong action, and it is not this lane's to repair.

### NOT ESTABLISHED, and the lane establishes it

How the longer sentence sits in the VOICE pane at 390 px. `placeholder.borrowing` in English is 144 characters against `calib.pane.typedGeneric`'s 79, and the French is longer again. **Report the rendered height of the pane's sentence block at 390 px for a contralto with nothing sampled, English and French, and the same for a contralto with three stable core vowels, where two sentences show.** Pixel heights and a picture of each. Do not redesign the pane to fit it; report what it is.

## 4. Item 2: two comments name code that is gone

Lane 71's step 8 deleted `hasDeclaredType`. Two comments still tell a reader it exists and that sites avoid branching on it:

- `voice/voiceTypes.ts:121`, clause 4 of `borrowedStaffLabel`'s contract.
- `voice/chart/screen-logic.ts:77`, on `sheetProvenance`.

`grep -rn hasDeclaredType apps/web/src` at `ca2a4e5b` returns those two lines and nothing else.

Repair: keep what each comment establishes, which is that "undeclared" means exactly `undefined` from `borrowedStaffLabel` and that sites branch on that value, and drop the dead reference. Dann ruled at 15:00 that a comment's test is whether it curates the code for a developer arriving cold; a warning against a function that does not exist curates nothing.

## 5. Item 3: one singer, two names for the same staff

### What it does today

A bass who also picks the Tier 2 label "octavist" reads two different names for one set of values:

- The VOICE pane prints **bass**. `borrowedStaffLabel` takes the Tier 1 id alone (`voiceTypes.ts:123-127`); its clause 2 at `:119` says so.
- The vowel-space sheet prints **bass**. `sheetProvenance` calls `borrowedStaffLabel` (`voice/chart/screen-logic.ts:79-82`).
- MELODY's subtitle prints **octavist**. `markup/subtitle.ts:11` calls `placeholderFillLabel`, which at `voiceTypes.ts:140` returns `voiceTypePrint(choice)` on the whole choice.
- INSIGHTS' lede prints **octavist**, same path (`insights/identity.ts:57`).
- **The vowel chart's caption prints octavist**, same path: `insights/singer-blocks.ts:337` fills `insights.r2.vowels.against.generic` (`i18n.ts:2042`) with `i.voiceTypeLabel`. Confirm at that line where `voiceTypeLabel` is built; it is the third site and r1 missed it.

So MELODY says "placeholder values for a generic octavist" (`i18n.ts:1489`) and INSIGHTS says "These findings use placeholder values for a generic octavist" (`i18n.ts:1897`), while Ilya holds no octavist values. The same path prints the singer's own free text when they choose Other and type their own words (`voiceTypePrint`, `voiceTypes.ts:86-89`), stating the claim in their own vocabulary.

Lane 71's brief r4 section 9 item 6 kept this on purpose, on the reading that a published type's values are its own. That holds for the type and fails for the label: an octavist's values are the bass staff's, and the sentence says they are an octavist's.

### What this lane builds

`placeholderFillLabel` takes the Tier 1 id alone, as `borrowedStaffLabel` does. Dann's principle of 10:08 decides it, and the desk resolves it under his ruling of 14:59 on the desk's decision rights inside N.204: this is which of two inconsistent sentences a singer reads, and naming.

After it, `placeholderFillLabel(choice, language)` and `borrowedStaffLabel(choice?.voiceType, language)` return the same value for every input. **Collapse them into one exported function. Name the survivor `borrowedStaffLabel`**, because that name says what the value is, and update every call site and every comment that names the other. Six comments reference `placeholderFillLabel` by name; find them with a grep and repair each, do not leave them stale.

Check the equivalence before you act on it: compare the two over every Tier 1 id crossed with no Tier 2 label, each of the 23 Tier 2 labels of the five published types, Other with text, Other with empty text, `not-sure`, `undefined`, and an id this build does not know. If any pair differs, keep both functions, repair only the label, and report which input made them differ.

### What the singer reads after it

- A bass who typed octavist: **bass**, in the pane, on MELODY, in INSIGHTS, on the chart caption, and on the sheet.
- French: « une voix type de basse » where it read « une voix type d'octaviste ». Both fills sit after « de » with no article and no adjective agreeing with them (`i18n.ts:1489`, `:1897`, `:2042`). Referent checked by the desk: nothing agrees with the fill, so no French changes and none is drafted. If you find any French sentence where the fill does agree with something, stop, change nothing in that sentence, and report it; French is Dann's.
- The three borrowing types: unchanged.
- `not-sure` and no type: unchanged, `undefined`.

### One consequence to report, not to act on

`fillVoiceType`'s French elision, « de octaviste » to « d'octaviste » (`voiceTypes.ts:143-156`), exists for vowel-initial labels. After this change none of the labels these three sentences can receive is vowel-initial in French (mezzo-soprano, mezzo et ténor, basse, baryton, ténor, soprano). **Report whether any live path still reaches the elision, and leave the code in place either way.** Do not delete it on this lane's say-so.

## 6. Tests this lane turns red

Each of these pins today's behaviour and must be **updated to the new behaviour, not deleted**. The desk read each line at `ca2a4e5b`.

| test | line | why |
|---|---|---|
| `components/Drawer/voice-pane.test.ts` | `:16-18` | pins the three borrowing types' `typed-generic` sentences verbatim, EN and FR. Item 1 replaces them with the borrowing line. |
| `components/Drawer/voice-pane.test.ts` | `:81-86` | pins `below-core` for every type including the three, for n of 1 to 4, EN and FR. Item 1's clause 4 prepends the borrowing line for the three only. |
| `lib/stand-in-borrowing.test.ts` | `:85-86` | asserts the declared type's own name is ABSENT from `VOICE pane (4.6)`. After item 1 the pane carries the borrowing line, which contains it by design (`:87`). Move `VOICE pane (4.6)` out of that list and give it the borrowing line's treatment. |
| `lib/stand-in-borrowing.test.ts` | `:241-255` | strips the staff then forbids any other type name. Same cause, same repair: the pane now reads like the borrowing line, so strip the declared type first, as `:250` already does for the borrowing line. |
| `lib/markup/subtitle.test.ts` | `:14-18` | asserts a bass with Other text "octaviste" renders « une voix type d'octaviste ». Item 3 makes that « de basse ». The elision rule itself still matters, so move the pin onto `fillVoiceType` directly rather than dropping it. |
| `e2e/voice-pane.test.ts` | `:95` | expects a contralto to read "Ilya is using generic values for a mezzo-soprano voice until you record your own." Item 1 replaces it. `:91`, the bass, stays green and must not change. |

This is the list the desk found. It is not a promise the list is complete: run the gates and report anything else that moves.

## 7. Computation sites

No step changes how a number is computed. The brief therefore carries no list of other sites computing the same number (`CONTRACT.md` section 4, its condition).

## 8. Steps

Each step ends with its own report in `docs/sessions/report-code-lane74-step<n>_r1_2026-11-19.md`.

0. **Baseline.** All eight gates on `Shane` at `ca2a4e5b` before any change. **Gate 4 has two baselines and this brief carries both** (`docs/memory/ENVIRONMENT.md:5547-5552`): with numpy and scipy, `6727 passed | 1 skipped (6728)`, measured on the Mac at Dann's ship of lane 71. Without scipy, which a cloud sandbox usually lacks, four tests in `voice/engine/burg.test.ts` skip instead of running, which gives `6723 passed | 5 skipped (6728)`. **That second figure is DERIVED by the desk from the first, not measured at this commit.** If you read it, you are on the no-scipy path and nothing is wrong. If you read neither, stop and report before step 1.
1. Item 2, the two comments. Smallest change; do it first.
2. Item 3, `placeholderFillLabel`. The equivalence check first, then the change, then the collapse, then the six stale comments, then the elision report.
3. Item 4, the picker note, in both pickers, with its ratified string and both languages.
4. Item 1, the VOICE pane, including the below-core pairing with the borrowing line first.
5. The tests of section 6, updated to the new behaviour. New tests: `paneSentence` for all eight declared types crossed with nothing sampled and with three stable core vowels, both languages; the picker note's pure function for all nine Tier 1 ids and for no selection, both languages; `profileSubtitle` and the chart caption for a bass with each of its Tier 2 labels and with Other text, both languages.
6. **Renders and measurements.** The four pane screens of section 3, and the four picker screens of section 2, all at 390 px, with pixel heights and pictures. Then one render each of MELODY, INSIGHTS, and the vowel chart caption for the bass who typed octavist, English.
7. **All eight gates at baseline.** Ratchets: **none of the five changed files has a ceiling in `scripts/ratchets.json`** (desk grep at `ca2a4e5b` returned no match for `voice-pane`, `voiceTypes`, `screen-logic`, `subtitle`, or `identity`), so no ceiling moves for them. If the gate reports otherwise, report what it says and do not edit the file to make it pass.
8. Final report: what changed, every file and line, every measurement, and section 9's heading below.

## 9. What you could not establish

Open a section with this heading in the final report and list anything you could not settle from the tree. **NOT ESTABLISHED beats a complete invented answer.**

Desk errors in r1, owned, so you do not inherit them: r1 told you MELODY and INSIGHTS draw the borrowing line after the placeholder sentence and that the pane should match; they draw it first, and r1's author asserted an order without reading `MarkupPane.svelte:996` or `InsightsPane.svelte:503`. r1 also gave gate 4 one baseline of its two, which is the same slip the afternoon desk made and recorded.

## 10. What this lane does not close

- Dann's walk of lane 71. This lane prepares the first screens of it; the walk is his.
- `capture.hint.placed.typed` staying false once five core vowels are stable, for all eight types (lane 71 brief r4 section 9).
- The sources note's first clause being untrue for an undeclared voice (same place).
- The guard and the stand-ins disagreeing about a countertenor: `voice/engine/plausibility.ts:135-142` sends him to `union`, `voice/engine/stand-ins.ts:58` to `tenor-mezzo`, so his chart zones and his page's words describe different staves. It needs a ruling the desk has not put to Dann, and it is not naming, so section 5's decision right does not reach it.
- Case 3 of Dann's 14:21 ruling, that no declared type with fewer than five sampled core vowels gets no full set, where `stand-ins.ts:61` and `:163-164` work one up from `template('middle')`. Its own item.
