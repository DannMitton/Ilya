# Report, lane 74, step 2: item 3, one singer, one name for the staff

Brief section 5. Every line cited below was read in this session. Paths without a directory are under `apps/web/src/lib/`.

## 1. The equivalence check, before the change

**How I read the brief's check.** The brief says that "after it" the two functions return the same value for every input, and to compare them before acting. Today's `placeholderFillLabel` takes the whole choice and prints a Tier 2 label or Other's text for the five published types (`voiceTypes.ts`, before this step: `return voiceTypePrint(choice, language)`), so it differs from `borrowedStaffLabel` by design, and a check of today's function against `borrowedStaffLabel` could only fail. I therefore ran the check on the function as it will be after the change (the Tier 1 id alone: `isBorrowingType` to the staff, `not-sure` to `undefined`, otherwise `voiceTypePrint({ voiceType: id })`), and I also counted how today's function differs, for the record. If I have read the brief's check the wrong way round, the other reading is the "current" number below.

**Inputs** (each crossed with `en` and `fr`): `undefined`, an empty choice, every id in `TIER1` plus `unknown-id` and the empty string, each with no Tier 2 label; every Tier 2 label of every Tier 1 id in `TIER2` (including all 23 of the five published types: soprano 5, mezzo-soprano 3, tenor 7, baritone 4, bass 4); Other with text, Other with empty text, Other with whitespace, Other with no text field; an unknown Tier 2 label; and Other's text with no Tier 1 id. 98 choices, 196 comparisons.

**Result, run with vitest on a temporary test file, now deleted** (`ls src/lib/zz-*` confirms it is gone):

`EQUIV total=196 tier2LabelsOfFive=23 proposedDiffs=0 currentDiffs=56`

The change as proposed and `borrowedStaffLabel(choice?.voiceType, language)` agree on all 196. Today's `placeholderFillLabel` differs on 56, all of them a published type with a Tier 2 label or Other's text, for example `soprano` + `coloratura-soprano` prints "coloratura soprano" against "soprano". Those 56 are the singers this item changes. No input made the pair differ in the direction that would have stopped the step, so both functions collapse.

## 2. The change

- `voiceTypes.ts`: `placeholderFillLabel` and its comment block are deleted. `borrowedStaffLabel` survives under the name the brief gives. Its comment now says it fills `{voiceType}` in every sentence that says whose placeholder values a page works from, and why (the ruling's principle of 2026-11-19 10:08). Its four clauses are untouched apart from clause 4 (step 1).
- `markup/subtitle.ts:11`: `borrowedStaffLabel(o.voiceType?.voiceType, o.language)`. Import changed to match.
- `insights/identity.ts:57` (`placeholderLabel`): `generic ? borrowedStaffLabel(voiceType?.voiceType, language) : undefined`. Import changed to match. `voiceTypePrint` stays imported: `identity.ts:28` still uses it.
- The chart caption needed no code change. `insights/singer-blocks.ts:337` fills `insights.r2.vowels.against.generic` with `i.voiceTypeLabel`, and the only place that builds `voiceTypeLabel` is `insights/InsightsPane.svelte:373`, which calls `placeholderLabel`. So the caption follows `identity.ts`.

## 3. Stale comments

`grep -rn placeholderFillLabel apps packages --include=*.ts --include=*.svelte --exclude-dir=node_modules` after the edits returns only `stand-in-borrowing.test.ts:14`, `:107`, and `:123`. Step 5 repairs those. The three comments the brief names were read and repaired:

1. `i18n.ts:1896` (above `insights.generic.lede`).
2. `markup/subtitle.ts:4`.
3. `insights/identity.ts:55` (above `placeholderLabel`).

**Two more comments described the old behaviour without the name, and I repaired them too:** `insights/identity.ts:48` (above `genericLede`: "the borrowed staff for the three borrowing types, otherwise the label the identity line prints") and the `voiceTypes.ts` block I removed. `grep -rn "identity line prints\|otherwise the label"` over `apps` and `packages` returns nothing now. The brief's count of three is the count of comments that name the function. The count of comments that told a reader the old behaviour was five.

## 4. French: where the fill sits

I read every French string that takes the fill. Three do: `profile.subtitlePlaceholder` (`i18n.ts:1489`, « pour une voix type de {voiceType}, pas encore vos propres résonances »), `insights.generic.lede` (`:1897`, « pour une voix type de {voiceType}, et non sur votre voix en particulier »), and `insights.r2.vowels.against.generic` (`:2042`, « pour une voix type de {voiceType} »). The fill follows « de » in all three, and no article, adjective, or participle agrees with it. « voix » belongs to « une voix type », whose gender the fill does not touch. So no French changes, as the brief predicted. I found no sentence where the fill agrees with something, so the stop condition did not fire.

The fourth user of the fill, `calib.pane.typedGeneric` (`:1432`), is the pane's sentence and is item 1's. It follows « de » as well.

## 5. The elision, reported and left in place

**Is any live path still reaching `fillVoiceType`'s « de » + vowel elision?** NOT through any label I can find, as follows. Every live call of `fillVoiceType` in `apps/web/src` outside tests (grep: `voice-pane.ts:67`, `screen-logic.ts:72` and `:81`, `subtitle.ts:12`, `placeholder-line.ts:117`, `singer-blocks.ts:337`, `identity.ts:52`) takes its label from `borrowedStaffLabel`, from `voiceTypePrint` on a Tier 1 id alone (`placeholder-line.ts:114`), or from `i.voiceTypeLabel`, which `InsightsPane.svelte:373` builds with `placeholderLabel`. The French strings those can print are the five published types' (`voiceType.type.*`: Soprano, Mezzo-soprano, Ténor, Baryton, Basse, lower-cased by `voiceTypePrint`) and the three staves (`voiceType.staff.*`: mezzo-soprano, basse, mezzo et ténor). None begins with a vowel letter by `VOWEL_LETTER` (`/^[aeiouy]/`, `voiceTypes.ts`). The only other French template with « de {type} » is `calib.summary.outside` (`i18n.ts:1343`). `voice/outside.ts:10` says that older form is retired, and `grep -rn "{type}"` over `apps/web/src` outside `i18n.ts` and tests finds no code that fills it (the three hits are comments), so it is not a live path. `placeholder.borrowing` reads « un {type} », which has no « de ».

So no live path reaches the elision. This is a reading of the grep, not a run of every page. The code stays in place, as instructed, and its pin moves onto `fillVoiceType` directly in step 5.

## 6. What stays red until step 5

`stand-in-borrowing.test.ts` still imports `placeholderFillLabel`, and `markup/subtitle.test.ts:14-18` still expects « d’octaviste ». Both are in the brief's section 6 list and step 5 repairs them. The step's own tests were not run for those two files for that reason.
